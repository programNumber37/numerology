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
        // Inject fast using native parser and the pre-computed AOT SVG string
        this.countryGroup.node().innerHTML = MAP_PATHS_SVG;

        // Build a mapping from code to full name for title
        const codeToName = {};
        for (const [code, data] of Object.entries(EUROPE_DATA.countries)) {
            codeToName[code] = data.name;
        }

        // Attach events to all paths
        this.countryGroup.selectAll('.country-path')
            .on('mouseenter', (event) => {
                d3.select(event.currentTarget).raise();
                const code = event.currentTarget.getAttribute('data-code');
                const fullName = codeToName[code] || event.currentTarget.getAttribute('data-name');
                const titleEl = document.getElementById('mapWindowTitleText');
                if (titleEl) {
                    titleEl.textContent = fullName;
                }
            })
            .on('mouseleave', () => {
                const titleEl = document.getElementById('mapWindowTitleText');
                if (titleEl) {
                    titleEl.textContent = this.activeCountryName || 'WORLD';
                }
            })
            .on('click', (event) => {
                if (event.defaultPrevented) return;
                event.stopPropagation();
                
                const target = event.currentTarget;
                const code = target.getAttribute('data-code');
                const name = target.getAttribute('data-name');
                
                if (EUROPE_DATA.countries[code]) {
                    this.selectLocation('country', code, target);
                } else {
                    this.selectLocation('empty_country', name, target);
                }
            });

        // City rendering is now entirely dynamic (handled by Canvas and D3 update pattern in selectLocation)
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
            return city.data.country === activeCountryEl.node().getAttribute('data-name');
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
        this.cityGroup.selectAll('.city-node').remove();
        this.visibleCityContents = d3.selectAll('.none');
    }

    selectLocation(type, key, element) {
        if (type === 'country' || type === 'empty_country') {
            if (element && element.classList.contains('active')) {
                return; // Already selected, ignore click to prevent unselecting/jumping
            }
            document.querySelectorAll('.country-path.active, .city-node.active').forEach(el => el.classList.remove('active'));
            if (element) {
                element.classList.add('active');
                this.countryGroup.classed('has-selection', true);
                
                const data = type === 'country' ? EUROPE_DATA.countries[key] : { name: key, type: 'empty' };
                
                // PERFORMANCE FIX: Only render SVG cities for the selected country
                const countryCities = Object.entries(EUROPE_DATA.cities).filter(d => d[1].country === data.name);
                
                const cityNodes = this.cityGroup.selectAll('.city-node')
                    .data(countryCities, d => d[0]);
                
                cityNodes.exit().remove();
                
                const cityEnter = cityNodes.enter()
                    .append('g')
                    .attr('class', 'city-node visible') // Always visible since they are the only ones in the DOM
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

                const cityContents = cityEnter.append('g').attr('class', 'city-content');
                
                // Tweak the bigger hitbox to be smaller (10 instead of 24) to avoid overlap for close cities
                cityContents.append('circle')
                    .attr('class', 'city-hit-area')
                    .attr('r', 10)
                    .style('fill', 'transparent');

                cityContents.append('circle')
                    .attr('class', 'city-dot')
                    .attr('r', 4.5);

                cityContents.append('text')
                    .attr('class', 'city-label')
                    .attr('x', 14)
                    .attr('y', 5)
                    .text(d => d[1].name);
                
                // Immediately apply inverse zoom scale to text/dots
                this.visibleCityContents = this.cityGroup.selectAll('.city-content');
                const currentScale = d3.zoomTransform(this.svg.node()).k;
                this.visibleCityContents.attr('transform', `scale(${1 / currentScale})`);

                this.renderCanvasCities();
                d3.select('#activeCountryUse').attr('href', '#' + element.id);
                
                // Auto-zoom to bounding box
                if (element.tagName === 'path') {
                    const boundsAttr = element.getAttribute('data-bounds');
                    if (boundsAttr) {
                        const [dx, dy, x, y] = boundsAttr.split(',').map(Number);
                        const scale = Math.max(1, Math.min(8, 0.6 / Math.max(dx / 1000, dy / 700)));
                        const translate = [500 - scale * x, 350 - scale * y];

                        this.svg.transition()
                            .duration(400)
                            .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
                    }
                }
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
        this.cityGroup.selectAll('.city-node').remove();
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
