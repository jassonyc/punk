// tools/import-wxr.js
// Parse public/tiendacata.xml (WXR) and emit public/tiendacata.json and src/data/tiendaItems.js
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const xmlPath = path.resolve(__dirname, '..', 'public', 'tiendacata.xml');
const outJson = path.resolve(__dirname, '..', 'public', 'tiendacata.json');
const outModule = path.resolve(__dirname, '..', 'src', 'data', 'tiendaItems.js');

fs.readFile(xmlPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Failed to read', xmlPath, err.message);
    process.exit(1);
  }
  xml2js.parseString(data, { explicitArray: false }, (err, res) => {
    if (err) {
      console.error('XML parse error:', err);
      process.exit(1);
    }
    try {
      const items = (res.rss && res.rss.channel && res.rss.channel.item) || [];
      const arr = Array.isArray(items) ? items : [items];
      const mapped = arr.map((it) => {
        const title = (it.title && it.title) || '';
        const link = (it.link && it.link) || '';
        const date = (it.pubDate && it.pubDate) || (it['wp:post_date'] && it['wp:post_date']) || '';
        const content = (it['content:encoded'] && it['content:encoded']) || it.description || '';
        const categories = [];
        if (it.category) {
          if (Array.isArray(it.category)) {
            it.category.forEach((c) => {
              if (typeof c === 'string') categories.push(c);
              else if (c._) categories.push(c._);
            });
          } else if (typeof it.category === 'string') categories.push(it.category);
        }
        return { title, link, date, content, categories };
      });

      fs.writeFileSync(outJson, JSON.stringify(mapped, null, 2), 'utf8');
      const moduleSource = `// auto-generated from public/tiendacata.xml
export const tiendaItems = ${JSON.stringify(mapped, null, 2)};
`;
      // Ensure data dir exists
      const dataDir = path.dirname(outModule);
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(outModule, moduleSource, 'utf8');
      console.log('WXR imported:', mapped.length, 'items');
      console.log('Wrote:', outJson);
      console.log('Wrote:', outModule);
    } catch (e) {
      console.error('Processing error:', e);
      process.exit(1);
    }
  });
});
