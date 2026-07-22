const fs = require('fs');
const content = fs.readFileSync('map_paths.html', 'utf8');
fs.writeFileSync('mapPaths.js', 'const MAP_PATHS_SVG = `' + content + '`;');
