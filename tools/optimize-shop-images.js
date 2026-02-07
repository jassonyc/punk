// tools/optimize-shop-images.js
// Simple script to download shop images and generate optimized variants (JPEG + WebP)
// Usage: node tools/optimize-shop-images.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'shop');
const DATA_OUT = path.join(__dirname, '..', 'src', 'data', 'shopImages.json');

const IMAGES = [
  { id: 'p-01', url: 'https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/gg-1.jpg' },
  { id: 'p-02', url: 'https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/jj-1.jpg' },
  { id: 'p-03', url: 'https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/kk-3.jpg' },
  // also includes compares used on the page
  { id: 'c-01-after', url: 'https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/ff-2-1.jpg' },
  { id: 'c-02-after', url: 'https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/hh-3.jpg' },
  { id: 'c-03-after', url: 'https://catazhohardcore.wordpress.com/wp-content/uploads/2023/01/uuuuu-1.jpg' },
];

async function ensureDir(dir) {
  return fs.promises.mkdir(dir, { recursive: true });
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.buffer();
}

async function writeFile(filePath, buf) {
  await fs.promises.writeFile(filePath, buf);
}

(async function main(){
  try {
    await ensureDir(OUT_DIR);
    const mapping = {};

    for (const img of IMAGES) {
      const id = img.id;
      console.log('Downloading', img.url);
      const buf = await downloadBuffer(img.url);

      const origPath = path.join(OUT_DIR, `${id}-orig.jpg`);
      await writeFile(origPath, buf);

      // sizes
      const sizes = [480, 1024];
      const out = {};
      for (const s of sizes) {
        const jpgPath = path.join(OUT_DIR, `${id}-${s}.jpg`);
        const webpPath = path.join(OUT_DIR, `${id}-${s}.webp`);
        await sharp(buf).resize({ width: s }).jpeg({ quality: 82 }).toFile(jpgPath);
        await sharp(buf).resize({ width: s }).webp({ quality: 78 }).toFile(webpPath);
        out[`jpg${s}`] = `/images/shop/${id}-${s}.jpg`;
        out[`webp${s}`] = `/images/shop/${id}-${s}.webp`;
      }

      // create a small thumb for product list
      const thumbPath = path.join(OUT_DIR, `${id}-thumb.jpg`);
      await sharp(buf).resize({ width: 160, height: 160, fit: 'cover' }).jpeg({ quality: 80 }).toFile(thumbPath);
      out.thumb = `/images/shop/${id}-thumb.jpg`;

      mapping[id] = out;
      console.log('Processed', id);
    }

    await writeFile(DATA_OUT, JSON.stringify(mapping, null, 2));
    console.log('Wrote mapping to', DATA_OUT);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
