const fs = require('fs');
const content = fs.readFileSync('tools/map-paths-source.html', 'utf8');
fs.writeFileSync('js/data/map-paths.js', 'const MAP_PATHS_SVG = `' + content + '`;');
