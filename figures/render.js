/* Exports the paper thumbnails as images, for slides, posters or a
 * research statement. The page itself shows them as inline SVG (see
 * figures/pubs.py), so it does not need this.
 *
 *   npm i --no-save playwright && node figures/render.js
 *
 * Each figures/pubs/NAME.svg is drawn with the shared icons (icons.svg),
 * styles (figures.css) and the site's typeface, finished (no motion), and
 * saved as figures/export/NAME.png at three times its size (1200 x 750).
 *
 * Options:  --sheet FILE   also save every figure on one page, for review
 *           NAME ...       only draw these figures
 * Set CHROMIUM=/path/to/chrome to use a browser that is already installed. */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIR = __dirname;
const ROOT = path.join(DIR, '..');
const OUT = path.join(DIR, 'export');

const args = process.argv.slice(2);
const sheetAt = args.indexOf('--sheet');
const sheet = sheetAt >= 0 ? args.splice(sheetAt, 2)[1] : null;
const only = new Set(args);

const b64 = (f) => fs.readFileSync(f).toString('base64');
const face = (file, range) => `@font-face{font-family:"Source Sans 3";font-weight:200 900;` +
  `src:url(data:font/woff2;base64,${b64(file)}) format("woff2");${range ? `unicode-range:${range};` : ''}}`;

const fonts = [
  face(path.join(ROOT, 'assets/fonts/SourceSans3-Roman.woff2')),
  face(path.join(DIR, 'fonts/SourceSans3-greek.woff2'), 'U+0370-03FF'),
].join('\n');

const figs = fs.readdirSync(path.join(DIR, 'pubs'))
  .filter((f) => f.endsWith('.svg'))
  .map((f) => f.slice(0, -4))
  .filter((n) => !only.size || only.has(n))
  .sort();

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fonts}
${fs.readFileSync(path.join(DIR, 'figures.css'), 'utf8')}
body { margin: 0; background: #e9ecef; display: flex; flex-wrap: wrap; gap: 16px; padding: 16px; width: 1280px; }
.shot { width: 400px; height: 250px; background: #fff; }
</style></head><body>
${fs.readFileSync(path.join(DIR, 'icons.svg'), 'utf8')}
${figs.map((n) => `<div class="shot" id="f-${n}">${fs.readFileSync(path.join(DIR, 'pubs', n + '.svg'), 'utf8')}</div>`).join('\n')}
</body></html>`;

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1312, height: 900 }, deviceScaleFactor: 3 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  fs.mkdirSync(OUT, { recursive: true });
  for (const n of figs) {
    await page.locator('#f-' + n).screenshot({ path: path.join(OUT, n + '.png') });
    console.log('  ' + n);
  }

  if (sheet) {
    await page.setViewportSize({ width: 1312, height: 200 });
    await page.screenshot({ path: sheet, fullPage: true });
    console.log('sheet: ' + sheet);
  }
  await browser.close();
})();
