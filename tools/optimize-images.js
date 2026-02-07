// tools/optimize-images.js
// Script to generate resized and webp variants for images in public/images
// Usage:
// 1) npm install sharp
// 2) node tools/optimize-images.js

const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.error('Sharp is not installed. Run: npm install sharp');
  process.exit(1);
}

const INPUT_DIR = path.join(__dirname, '..', 'public', 'images');
const OUT_DIR = path.join(INPUT_DIR, 'optimized');
const WIDTHS = [480, 800, 1200, 2000];

if (!fs.existsSync(INPUT_DIR)) {
  console.error('Input directory not found:', INPUT_DIR);
  process.exit(1);
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const allowed = ['.jpg', '.jpeg', '.png', '.webp'];

(async () => {
  const files = fs.readdirSync(INPUT_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return allowed.includes(ext) && !f.startsWith('optimized');
  });

  if (files.length === 0) {
    console.log('No images found in', INPUT_DIR);
    return;
  }

  for (const file of files) {
    const src = path.join(INPUT_DIR, file);
    const name = path.parse(file).name;
    const ext = path.parse(file).ext.toLowerCase();

    for (const w of WIDTHS) {
      const outJpg = path.join(OUT_DIR, `${name}-${w}.jpg`);
      const outWebp = path.join(OUT_DIR, `${name}-${w}.webp`);
      try {
        await sharp(src)
          .resize({ width: w, withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(outJpg);
        await sharp(src)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toFile(outWebp);
        console.log('Generated', outJpg, outWebp);
      } catch (err) {
        console.error('Error processing', src, err.message);
      }
    }
  }

  console.log('\nOptimized images written to', OUT_DIR);
})();
