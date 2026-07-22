// ============================================
// INTERACTIVE EUROPE MAP ENGINE & DATA
// ============================================

// Data is now loaded modularly from mapDatabase.js

// ── Interactive Map Pan & Zoom Engine (D3 + TopoJSON) ──
class EuropeMapEngine {
    constructor() {
        this.svg = d3.select('#mapSvgCanvas');
        this.zoomContainer = d3.select('#mapZoomContainer');
        this.countryGroup = d3.select('#countryGroup');
        this.cityGroup = d3.select('#cityGroup');
        
        // Canvas Setup (Optional / In-progress)
        this.canvas = document.getElementById('cityCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.dpr = window.devicePixelRatio || 1;
            
            // Fix Canvas DPI
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * this.dpr;
            this.canvas.height = rect.height * this.dpr;
            this.ctx.scale(this.dpr, this.dpr);
        }
        
        this.overlayZoomContainer = d3.select('#overlayZoomContainer');
        this.cityOverlayGroup = d3.select('#cityOverlayGroup');
        
        this.infoPanel = document.getElementById('mapInfoPanel');

        this.projection = d3.geoMercator().scale(160).translate([500, 450]);
        this.pathGenerator = d3.geoPath().projection(this.projection);

        this.currentTransform = d3.zoomIdentity;
        this.hoveredCity = null;

        let zoomTimeout;

        this.zoom = d3.zoom()
            .scaleExtent([0.85, 30.0])
            .translateExtent([[-200, -200], [1200, 900]])
            .on('zoom', (event) => {
                this.currentTransform = event.transform;
                this.svg.classed('is-zooming', true);
                
                this.zoomContainer.attr('transform', event.transform);
                this.overlayZoomContainer.attr('transform', event.transform);
                
                this.renderCanvasCities();

                const overlayContent = this.cityOverlayGroup.select('.city-content');
                if (!overlayContent.empty()) {
                    overlayContent.attr('transform', `scale(${1 / event.transform.k})`);
                }

                if (this.visibleCityContents) {
                    this.visibleCityContents.attr('transform', `scale(${1 / event.transform.k})`);
                }

                clearTimeout(zoomTimeout);
                zoomTimeout = setTimeout(() => {
                    this.svg.classed('is-zooming', false);
                }, 40);
            });

        this.svg.call(this.zoom);
        
        this.svg.on('mousemove', (event) => this.handleMouseMove(event));
        
        this.init();
    }

    async init() {
        // Wire up control buttons
        const btnZoomIn = document.getElementById('btnZoomIn');
        const btnZoomOut = document.getElementById('btnZoomOut');
        const btnResetView = document.getElementById('btnResetView');

        if (btnZoomIn) btnZoomIn.addEventListener('click', () => this.zoomDelta(1.5));
        if (btnZoomOut) btnZoomOut.addEventListener('click', () => this.zoomDelta(0.666));
        if (btnResetView) btnResetView.addEventListener('click', () => this.resetView());

        // Click background to clear selection
        this.svg.on('click', (event) => {
            if (event.defaultPrevented) return; // Ignore drag clicks
            if (event.target.tagName === 'svg' || event.target.classList.contains('map-svg-bg')) {
                this.clearSelection();
            }
        });

        try {
            await this.loadMapData();
        } catch (error) {
            console.error("Failed to load map data:", error);
        }
    }

    async loadMapData() {
        // Fetch 50m TopoJSON world atlas
        const response = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json');
        const world = await response.json();
        const countriesGeo = topojson.feature(world, world.objects.countries).features;

        // Build a mapping from full name to our country code
        const nameToCode = {};
        for (const [code, data] of Object.entries(EUROPE_DATA.countries)) {
            nameToCode[data.name] = code;
        }

        // Draw ALL Countries (not just Europe)
        this.countryGroup.selectAll('.country-path')
            .data(countriesGeo)
            .enter()
            .append('path')
            .attr('id', d => {
                const code = nameToCode[d.properties.name] || d.properties.name.replace(/\s+/g, '-');
                return 'country-' + code;
            })
            .attr('class', 'country-path has-data')
            .attr('d', this.pathGenerator)
            .attr('data-code', d => nameToCode[d.properties.name] || d.properties.name)
            .on('mouseenter', (event, d) => {
                d3.select(event.currentTarget).raise();
                const code = nameToCode[d.properties.name];
                const titleEl = document.getElementById('mapWindowTitleText');
                if (titleEl) {
                    titleEl.textContent = d.properties.name;
                }
            })
            .on('mouseleave', () => {
                const titleEl = document.getElementById('mapWindowTitleText');
                if (titleEl) {
                    titleEl.textContent = this.activeCountryName || 'WORLD';
                }
            })
            .on('click', (event, d) => {
                if (event.defaultPrevented) return;
                event.stopPropagation();
                const code = nameToCode[d.properties.name];
                if (code) {
                    this.selectLocation('country', code, event.currentTarget, d);
                } else {
                    this.selectLocation('empty_country', d.properties.name, event.currentTarget, d);
                }
            });

        // Draw Cities
        const cityEntries = Object.entries(EUROPE_DATA.cities);
        const cityNodes = this.cityGroup.selectAll('.city-node')
            .data(cityEntries)
            .enter()
            .append('g')
            .attr('class', 'city-node')
            .attr('data-city', d => d[0])
            .attr('transform', d => {
                const [x, y] = this.projection([d[1].lon, d[1].lat]);
                return `translate(${x}, ${y})`;
            })
            .on('click', (event, d) => {
                if (event.defaultPrevented) return;
                event.stopPropagation();
                this.selectLocation('city', d[0], event.currentTarget);
            });

        const cityContents = cityNodes.append('g')
            .attr('class', 'city-content');

        // Invisible hit area for easier clicking
        cityContents.append('circle')
            .attr('class', 'city-hit-area')
            .attr('r', 24)
            .style('fill', 'transparent');

        cityContents.append('circle')
            .attr('class', 'city-dot')
            .attr('r', 4.5);

        cityContents.append('text')
            .attr('class', 'city-label')
            .attr('x', 18)
            .attr('y', 7)
            .text(d => d[1].name);
    }

    getCityHit(event) {
        if (!this.quadtree) return null;
        const [mx, my] = d3.pointer(event);
        const t = this.currentTransform;
        const x = (mx - t.x) / t.k;
        const y = (my - t.y) / t.k;
        const searchRadius = 24 / t.k;
        return this.quadtree.find(x, y, searchRadius);
    }

    handleMouseMove(event) {
        const hit = this.getCityHit(event);
        if (hit) {
            if (!this.hoveredCity || this.hoveredCity.key !== hit.key) {
                this.hoveredCity = hit;
                this.renderHoveredCitySVG(hit);
                this.renderCanvasCities(); // hide dot from canvas
                document.getElementById('mapViewport').style.cursor = 'pointer';
            }
        } else {
            if (this.hoveredCity) {
                this.hoveredCity = null;
                this.cityOverlayGroup.selectAll('*').remove();
                this.renderCanvasCities(); // restore dot
                document.getElementById('mapViewport').style.cursor = '';
            }
        }
    }
    
    isCityVisible(city) {
        const isCountrySelected = this.countryGroup.classed('has-selection');
        const activeCountryEl = this.countryGroup.select('.country-path.active');
        if (isCountrySelected && !activeCountryEl.empty()) {
            return city.data.country === activeCountryEl.datum().properties.name;
        }
        return true;
    }

    renderCanvasCities() {
        if (!this.ctx || !this.canvas) return;
        const t = this.currentTransform;
        this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        
        this.ctx.save();
        this.ctx.translate(t.x, t.y);
        this.ctx.scale(t.k, t.k);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#3e2723';
        this.ctx.lineWidth = 1.5 / t.k;
        const radius = 4.5 / t.k;
        
        for (const city of this.cityData || []) {
            if (this.hoveredCity && this.hoveredCity.key === city.key) continue;
            if (!this.isCityVisible(city)) continue;
            
            this.ctx.beginPath();
            this.ctx.arc(city.x, city.y, radius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    renderHoveredCitySVG(city) {
        this.cityOverlayGroup.selectAll('*').remove();
        if (!this.isCityVisible(city)) return;

        const node = this.cityOverlayGroup.append('g')
            .attr('class', 'city-node visible hovered')
            .attr('transform', `translate(${city.x}, ${city.y})`)
            .on('click', (event) => {
                if (event.defaultPrevented) return;
                event.stopPropagation();
                this.selectLocation('city', city.key, event.currentTarget);
            });

        const content = node.append('g')
            .attr('class', 'city-content')
            .attr('transform', `scale(${1 / this.currentTransform.k})`);
            
        content.append('circle')
            .attr('class', 'city-hit-area')
            .attr('r', 24)
            .style('fill', 'transparent');

        content.append('circle')
            .attr('class', 'city-dot')
            .attr('r', 4.5);

        content.append('text')
            .attr('class', 'city-label')
            .attr('x', 18)
            .attr('y', 7)
            .text(city.data.name);
    }

    zoomDelta(factor) {
        this.svg.transition().duration(300).call(this.zoom.scaleBy, factor);
    }

    resetView() {
        this.svg.transition().duration(400).call(this.zoom.transform, d3.zoomIdentity);
        this.cityGroup.selectAll('.city-node').classed('visible', false);
        this.visibleCityContents = d3.selectAll('.none');
    }

    selectLocation(type, key, element, geoData = null) {
        if (type === 'country' || type === 'empty_country') {
            if (element && element.classList.contains('active')) {
                return; // Already selected, ignore click to prevent unselecting/jumping
            }
            document.querySelectorAll('.country-path.active, .city-node.active').forEach(el => el.classList.remove('active'));
            if (element) {
                element.classList.add('active');
                this.countryGroup.classed('has-selection', true);
            this.renderCanvasCities();
                d3.select('#activeCountryUse').attr('href', '#' + element.id);
            }
        } else if (type === 'city') {
            document.querySelectorAll('.city-node.active').forEach(el => el.classList.remove('active'));
            if (element) {
                element.classList.add('active');
            }
        }

        let data = null;
        if (type === 'country' || type === 'empty_country') {
            data = type === 'country' ? EUROPE_DATA.countries[key] : { name: key, type: 'empty' };

            // Toggle cities for this country
            this.cityGroup.selectAll('.city-node').classed('visible', d => {
                const belongsToCountry = (d[1].country === data.name);
                return belongsToCountry;
            });
            this.visibleCityContents = this.cityGroup.selectAll('.city-node.visible .city-content');

            // Re-apply current zoom scale to newly visible cities to prevent jarring pop
            const currentScale = d3.zoomTransform(this.svg.node()).k;
            this.visibleCityContents.attr('transform', `scale(${1 / currentScale})`);

            // Auto-zoom to bounding box
            if (geoData) {
                let targetGeo = geoData;

                // If it's a MultiPolygon, find the largest polygon by projected area 
                // to avoid zooming out to overseas territories (e.g. French Guiana)
                if (geoData.geometry && geoData.geometry.type === 'MultiPolygon') {
                    const polys = geoData.geometry.coordinates.map(coords => ({
                        type: 'Feature',
                        geometry: { type: 'Polygon', coordinates: coords }
                    }));
                    polys.sort((a, b) => this.pathGenerator.area(b) - this.pathGenerator.area(a));
                    targetGeo = polys[0]; // Pick the largest polygon (e.g. Metropolitan France)
                }

                const bounds = this.pathGenerator.bounds(targetGeo);
                const dx = bounds[1][0] - bounds[0][0];
                const dy = bounds[1][1] - bounds[0][1];
                const x = (bounds[0][0] + bounds[1][0]) / 2;
                const y = (bounds[0][1] + bounds[1][1]) / 2;

                // Calculate scale to fit box with padding
                const scale = Math.max(1, Math.min(8, 0.6 / Math.max(dx / 1000, dy / 700)));
                const translate = [1000 / 2 - scale * x, 700 / 2 - scale * y];

                this.svg.transition()
                    .duration(400)
                    .call(
                        this.zoom.transform,
                        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
                    );
            }

        } else if (type === 'city') {
            data = EUROPE_DATA.cities[key];
        }

        if (data) {
            this.renderInfoPanel(data);
            const titleEl = document.getElementById('mapWindowTitleText');
            if (titleEl) {
                const titleText = (type === 'country' || type === 'empty_country') ? data.name : (data.country || '');
                titleEl.textContent = titleText;
            }
        }
    }

    clearSelection() {
        document.querySelectorAll('.country-path.active, .city-node.active').forEach(el => el.classList.remove('active'));
        this.countryGroup.classed('has-selection', false);
        this.renderCanvasCities();
        d3.select('#activeCountryUse').attr('href', null);
        this.renderEmptyState();
        this.cityGroup.selectAll('.city-node').classed('visible', false);
        this.visibleCityContents = d3.selectAll('.none');

        const titleEl = document.getElementById('mapWindowTitleText');
        if (titleEl) titleEl.textContent = 'WORLD';
    }

    renderInfoPanel(data) {
        if (!this.infoPanel) return;

        if (data.type === 'empty') {
            this.infoPanel.innerHTML = `
                <div class="map-info-header">
                    <div class="map-info-header-content">
                        <h2 class="map-info-title">${data.name}</h2>
                        <div class="map-info-subtitle">COUNTRY</div>
                    </div>
                </div>
                <div style="padding: 24px 32px; color: var(--th-text-muted); text-align: center;">
                    Information coming soon.
                </div>
            `;
            return;
        }

        const isCity = data.type === 'Major City';
        const badgeText = isCity ? `CITY • ${data.country}` : `COUNTRY`;
        const subtitleText = isCity ? `Major European Center` : `Capital: ${data.capital}`;

        const landmarksHTML = (data.landmarks || []).map(l => `<span class="map-info-tag">${l}</span>`).join('');

        this.infoPanel.innerHTML = `
            <div class="map-info-header">
                <div class="map-info-title-group">
                    <span class="map-info-badge">${badgeText}</span>
                    <h3 class="map-info-name">${data.name}</h3>
                    <p class="map-info-sub">${subtitleText}</p>
                </div>
            </div>
            
            <div class="map-info-grid">
                <div class="map-info-card">
                    <p class="map-info-card-label">Primary Number Energy</p>
                    <p class="map-info-card-val" style="color: var(--th-accent);">Number ${data.number}</p>
                </div>
                <div class="map-info-card">
                    <p class="map-info-card-label">Vibrational Essence</p>
                    <p class="map-info-card-val">${data.vibration}</p>
                </div>
            </div>
            
            <p class="map-info-body-text">${data.description}</p>
            ${data.energySummary ? `<p class="map-info-body-text" style="font-style: italic; opacity: 0.9;">"${data.energySummary}"</p>` : ''}
            
            <div style="margin-top: 18px;">
                <p class="map-info-card-label" style="margin-bottom: 8px;">Key Landmarks & Focal Points</p>
                <div class="map-info-highlights">
                    ${landmarksHTML}
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        if (!this.infoPanel) return;
        this.infoPanel.innerHTML = `
            <div class="map-info-empty" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div class="map-info-empty-icon">🌍</div>
                <h3 class="map-info-empty-title">Select a Location</h3>
                <p class="map-info-empty-text">Click on any country or major city to reveal its energetic signature.</p>
            </div>
        `;
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.europeMap = new EuropeMapEngine();
});
