
function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('./pages/', true, /\.html$/));

console.log('farlopen!')