/* Draws the publication thumbnails.
 *
 *   npm i --no-save playwright && node figures/render.js
 *
 * Each figures/pubs/NAME.svg is drawn with the shared icons (icons.svg),
 * styles (figures.css) and the site's typeface, then written to
 * assets/img/pubs/NAME.webp at twice its size. Needs `cwebp` (package
 * `webp`); without it the PNG is kept instead.
 *
 * Options:  --sheet FILE   also save every figure on one page, for review
 *           NAME ...       only draw these figures
 * Set CHROMIUM=/path/to/chrome to use a browser that is already installed. */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const DIR = __dirname;
const ROOT = path.join(DIR, '..');
const OUT = path.join(ROOT, 'assets', 'img', 'pubs');

const args = process.argv.slice(2);
const sheetAt = args.indexOf('--sheet');
const sheet = sheetAt >= 0 ? args.splice(sheetAt, 2)[1] : null;
const only = new Set(args);

const b64 = (f) => fs.readFileSync(f).toString('base64');
const face = (file, range) => `@font-face{font-family:"Source Sans 3";font-weight:200 900;` +
  `src:url(data:font/woff2;base64,${b64(file)}) format("woff2");${range ? `unicode-range:${range};` : ''}}`;

const fonts = [
  face(path.join(ROOT, 'assets/fonts/SourceSans3-Roman.woff2')),
  face(path.join(DIR, 'fonts/SourceSans3-latin-ext.woff2'), 'U+0100-024F,U+20A0-20C0'),
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
  const page = await browser.newPage({ viewport: { width: 1312, height: 900 }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'figs-'));
  let webp = true;
  for (const n of figs) {
    const png = path.join(tmp, n + '.png');
    await page.locator('#f-' + n).screenshot({ path: png });
    try {
      execFileSync('cwebp', ['-quiet', '-q', '92', '-m', '6', png, '-o', path.join(OUT, n + '.webp')]);
    } catch (e) {
      webp = false;
      fs.copyFileSync(png, path.join(OUT, n + '.png'));
    }
    console.log('  ' + n);
  }
  if (!webp) console.log('cwebp not found: wrote PNG instead of WebP');

  if (sheet) {
    await page.setViewportSize({ width: 1312, height: 200 });
    await page.screenshot({ path: sheet, fullPage: true });
    console.log('sheet: ' + sheet);
  }
  await browser.close();
})();
