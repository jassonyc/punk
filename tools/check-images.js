// tools/check-images.js
// Checks that each url in src/data/mediaItems.js exists under public
const path = require('path');
const fs = require('fs');
const items = require(path.join(__dirname, '..', 'src', 'data', 'mediaItems.js')).mediaItems;
const publicDir = path.join(__dirname, '..', 'public');
let missing = [];
console.log('Checking', items.length, 'media items...');
items.forEach((it) => {
  const rel = it.url.replace(/^\//, ''); // remove leading slash
  const full = path.join(publicDir, rel);
  const ok = fs.existsSync(full);
  console.log(ok ? 'OK   ' : 'MISSING', rel);
  if (!ok) missing.push(rel);
});
if (missing.length) {
  console.log('\nMissing files:');
  missing.forEach(m=>console.log(' -', m));
  process.exitCode = 2;
} else {
  console.log('\nAll media files are present.');
}
