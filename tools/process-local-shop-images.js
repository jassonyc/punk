// tools/process-local-shop-images.js
// Process local images (from Downloads) into public/images/shop and write src/data/shopImages.json
// Usage: node tools/process-local-shop-images.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'shop');
const DATA_OUT = path.join(__dirname, '..', 'src', 'data', 'shopImages.json');

// List of source files (absolute paths) provided by the user — update here if needed
const SOURCES = [
  '/Users/jasson/Downloads/caata negra2.jpg',
  '/Users/jasson/Downloads/Front → Ultra Heavy Hoody By Studio Innate™.jpg (3).jpeg',
  '/Users/jasson/Downloads/Front → Ultra Heavy Hoody By Studio Innate™.jpg (2).jpeg',
  '/Users/jasson/Downloads/Front → Ultra Heavy Hoody By Studio Innate™.jpg (1).jpeg',
  '/Users/jasson/Downloads/Back → Ultra Heavy Hoody By Studio Innate™.jpg (1).jpeg',
  '/Users/jasson/Downloads/Front → Ultra Heavy Hoody By Studio Innate™.jpg.jpeg',
  '/Users/jasson/Downloads/Back → Ultra Heavy Hoody By Studio Innate™.jpg.jpeg',
  '/Users/jasson/Downloads/322012258_1173823229921099_4269832339029357772_n_17978810098754621.jpg.jpeg',
  '/Users/jasson/Downloads/catanegra1.jpg'
];

function ensureDir(dir) {
  return fs.promises.mkdir(dir, { recursive: true });
}

function slugifyName(name) {
  return name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

(async function main(){
  try {
    await ensureDir(OUT_DIR);
    const mapping = {};

    // Heuristic: files containing 'front' -> front pool, 'back' -> back pool, else others
    const fronts = [];
    const backs = [];
    const others = [];

    for (const s of SOURCES) {
      const lower = s.toLowerCase();
      if (lower.includes('front')) fronts.push(s);
      else if (lower.includes('back')) backs.push(s);
      else others.push(s);
    }

    // Assign ids: front -> p-01.., backs -> c-01-after.., others -> p-0n continued
    let pIndex = 1;
    let cIndex = 1;

    // helper to process a file and assign an id
    async function processFile(srcPath, id) {
      if (!fs.existsSync(srcPath)) {
        console.warn('Missing source file:', srcPath);
        return null;
      }
      const buf = await fs.promises.readFile(srcPath);
      const origPath = path.join(OUT_DIR, `${id}-orig.jpg`);
      await fs.promises.writeFile(origPath, buf);

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
      const thumbPath = path.join(OUT_DIR, `${id}-thumb.jpg`);
      await sharp(buf).resize({ width: 160, height: 160, fit: 'cover' }).jpeg({ quality: 80 }).toFile(thumbPath);
      out.thumb = `/images/shop/${id}-thumb.jpg`;

      mapping[id] = out;
      console.log('Processed', id, 'from', srcPath);
      return id;
    }

    // process fronts
    for (const f of fronts) {
      const id = `p-${String(pIndex).padStart(2, '0')}`;
      await processFile(f, id);
      pIndex++;
    }
    // process backs
    for (const b of backs) {
      const id = `c-${String(cIndex).padStart(2, '0')}-after`;
      await processFile(b, id);
      cIndex++;
    }
    // process others into p-* continuing index
    for (const o of others) {
      const id = `p-${String(pIndex).padStart(2, '0')}`;
      await processFile(o, id);
      pIndex++;
    }

    // merge with any existing mapping file if present (preserve other ids)
    let existing = {};
    try {
      const ex = await fs.promises.readFile(DATA_OUT, 'utf8');
      existing = JSON.parse(ex);
    } catch (e) {
      existing = {};
    }
    const final = { ...existing, ...mapping };
    await fs.promises.writeFile(DATA_OUT, JSON.stringify(final, null, 2));
    console.log('Wrote mapping to', DATA_OUT);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
