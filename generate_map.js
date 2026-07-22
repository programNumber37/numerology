const fs = require('fs');
const https = require('https');
const d3 = require('d3');
const topojson = require('topojson-client');

// Mock DOM for eval
const window = {};

// Load EUROPE_DATA
const dbCode = fs.readFileSync('mapDatabase.js', 'utf8').replace('const EUROPE_DATA', 'global.EUROPE_DATA');
eval(dbCode);

https.get('https://unpkg.com/world-atlas@2.0.2/countries-50m.json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const world = JSON.parse(data);
        const countriesGeo = topojson.feature(world, world.objects.countries).features;

        // Build mapping
        const nameToCode = {};
        for (const [code, cdata] of Object.entries(EUROPE_DATA.countries)) {
            nameToCode[cdata.name] = code;
        }

        const projection = d3.geoMercator().scale(160).translate([500, 450]);
        const pathGenerator = d3.geoPath().projection(projection);

        let svgContent = '';
        countriesGeo.forEach(d => {
            const dStr = pathGenerator(d);
            const name = d.properties.name;
            const dataCode = nameToCode[name] || name;
            const idCode = nameToCode[name] || name.replace(/\s+/g, '-');
            
            let targetGeo = d;
            if (d.geometry && d.geometry.type === 'MultiPolygon') {
                const polys = d.geometry.coordinates.map(coords => ({
                    type: 'Feature',
                    geometry: { type: 'Polygon', coordinates: coords }
                }));
                polys.sort((a, b) => pathGenerator.area(b) - pathGenerator.area(a));
                targetGeo = polys[0];
            }
            const bounds = pathGenerator.bounds(targetGeo);
            const dx = bounds[1][0] - bounds[0][0];
            const dy = bounds[1][1] - bounds[0][1];
            const x = (bounds[0][0] + bounds[1][0]) / 2;
            const y = (bounds[0][1] + bounds[1][1]) / 2;

            svgContent += `<path id="country-${idCode}" class="country-path has-data" d="${dStr}" data-code="${dataCode}" data-name="${name}" data-bounds="${dx},${dy},${x},${y}"></path>\n`;
        });

        fs.writeFileSync('map_paths.html', svgContent);
        console.log(`Generated SVG size: ${fs.statSync('map_paths.html').size / 1024} KB`);
    });
});
