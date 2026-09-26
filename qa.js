/* Page checks, run with Playwright:
 *
 *   npm i --no-save playwright && node qa.js
 *
 * Serves this folder on a local port, then loads the page at phone, tablet
 * and desktop widths. Set CHROMIUM=/path/to/chrome to use a browser that is
 * already installed instead of Playwright's own. */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = __dirname;
const WIDTHS = [320, 360, 375, 390, 414, 540, 600, 720, 768, 834, 1024, 1180, 1280, 1440, 1920];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.pdf': 'application/pdf', '.webmanifest': 'application/manifest+json' };

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

(async () => {
  const srv = await serve();
  const BASE = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  let fails = 0;
  const bad = (m) => { fails++; console.log('  ✗ ' + m); };
  const ok = (m) => console.log('  ✓ ' + m);

  // ---- 1. Links, assets, markup ------------------------------------------
  console.log('\n1. Links and markup');
  {
    const p = await browser.newPage();
    const missing = [];
    p.on('response', (r) => { if (r.status() >= 400) missing.push(r.url()); });
    await p.goto(BASE, { waitUntil: 'networkidle' });

    const r = await p.evaluate(() => {
      const ids = new Set([...document.querySelectorAll('[id]')].map((e) => e.id));
      const anchors = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href').slice(1))
        .filter((h) => h && !ids.has(h));
      const local = [...document.querySelectorAll('a[href], img[src], link[href], script[src]')]
        .map((e) => e.getAttribute('href') || e.getAttribute('src'))
        .filter((u) => u && !/^(https?:|mailto:|#)/.test(u));
      const noAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
      const noSize = [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length;
      const dupIds = [...document.querySelectorAll('[id]')].map((e) => e.id).filter((v, i, a) => a.indexOf(v) !== i);
      const h1 = document.querySelectorAll('h1').length;
      const bibs = [...document.querySelectorAll('button[data-bib]')].filter((b) => !document.getElementById(b.dataset.bib)).length;
      return { anchors, local, noAlt, noSize, dupIds, h1, bibs };
    });

    r.anchors.length ? bad('in-page links with no target: ' + r.anchors.join(', ')) : ok('every in-page link has a target');
    r.dupIds.length ? bad('duplicate ids: ' + r.dupIds.join(', ')) : ok('ids are unique');
    r.h1 === 1 ? ok('one h1') : bad(`${r.h1} h1 elements`);
    r.noAlt ? bad(`${r.noAlt} images without alt`) : ok('every image has alt text');
    r.noSize ? bad(`${r.noSize} images without width/height`) : ok('every image reserves its space');
    r.bibs ? bad(`${r.bibs} BibTeX buttons point at nothing`) : ok('every BibTeX button has its entry');

    for (const u of new Set(r.local)) {
      const res = await p.request.get(new URL(u, BASE).href);
      if (res.status() !== 200) bad(`${u} → ${res.status()}`);
    }
    ok(`${new Set(r.local).size} local files resolve`);
    missing.length ? bad('failed requests: ' + missing.join(', ')) : ok('no failed requests');

    // BibTeX toggles open and closed.
    const btn = p.locator('button[data-bib]').first();
    const pre = p.locator('#' + (await btn.getAttribute('data-bib')));
    await btn.click();
    const shown = await pre.isVisible();
    await btn.click();
    const hidden = !(await pre.isVisible());
    shown && hidden ? ok('BibTeX opens and closes') : bad('BibTeX toggle is broken');
    await p.close();
  }

  // ---- 2. Layout at every width ------------------------------------------
  console.log('\n2. Layout');
  for (const w of WIDTHS) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 600, hasTouch: w < 600 });
    const p = await c.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);

    // Compare against the width asked for, not innerWidth: a mobile
    // viewport widens itself to fit content that is too wide, exactly as a
    // phone zooms out, and would then measure the page against itself.
    const r = await p.evaluate((W) => {
      const overflow = document.documentElement.scrollWidth - W;

      // Every line of every text node, as a rectangle; any two that
      // intersect are text painted over text.
      const rects = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement;
        if (el.closest('[hidden], .skip, script, style')) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of range.getClientRects()) {
          if (r.width > 1 && r.height > 1) rects.push({ r, el, t: n.textContent.trim().slice(0, 30) });
        }
      }
      const hits = [];
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i].r, b = rects[j].r;
          const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (x > 2 && y > 2) hits.push(`"${rects[i].t}" / "${rects[j].t}"`);
        }
      }

      // Boxes or lines of text that run past the edge of the screen.
      const outside = [...document.querySelectorAll('main *, .top *')]
        .filter((e) => e.getClientRects().length && !e.closest('pre'))
        .filter((e) => { const b = e.getBoundingClientRect(); return b.right > W + 1 || b.left < -1; })
        .map((e) => e.tagName.toLowerCase() + (e.className ? '.' + e.className : ''))
        .concat(rects.filter((x) => x.r.right > W + 1 && !x.el.closest('pre')).map((x) => `"${x.t}"`));

      return { overflow, hits: hits.slice(0, 5), outside: [...new Set(outside)].slice(0, 5) };
    }, w);

    const label = `${w}px`.padEnd(7);
    if (r.overflow > 0) bad(`${label} page scrolls sideways by ${r.overflow}px`);
    if (r.outside.length) bad(`${label} elements past the edge: ${r.outside.join(', ')}`);
    if (r.hits.length) bad(`${label} overlapping text: ${r.hits.join('; ')}`);
    if (errs.length) bad(`${label} script errors: ${errs.join(' | ')}`);
    if (!r.overflow && !r.outside.length && !r.hits.length && !errs.length) ok(`${label} no overflow, no overlap, no errors`);
    await c.close();
  }

  // ---- 3. Contrast ---------------------------------------------------------
  console.log('\n3. Contrast');
  {
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto(BASE, { waitUntil: 'networkidle' });
    const low = await p.evaluate(() => {
      const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
        .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
      const bgOf = (el) => {
        for (let e = el; e; e = e.parentElement) {
          const c = rgb(getComputedStyle(e).backgroundColor);
          if (c.length === 3 || (c.length === 4 && c[3] > 0.5)) return c.slice(0, 3);
        }
        return [255, 255, 255];
      };
      const out = new Set();
      document.querySelectorAll('main *, .top *, .foot *').forEach((el) => {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
        if (el.closest('[hidden]')) return;
        const L1 = lum(rgb(getComputedStyle(el).color)), L2 = lum(bgOf(el));
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        if (ratio < 4.5) out.add(`${el.tagName.toLowerCase()}.${el.className} ${ratio.toFixed(2)}`);
      });
      return [...out];
    });
    low.length ? bad('text under 4.5:1: ' + low.join(', ')) : ok('all text is at least 4.5:1 against its background');
    await p.close();
  }

  await browser.close();
  srv.close();
  console.log(fails ? `\n${fails} problem(s)\n` : '\nAll checks passed\n');
  process.exit(fails ? 1 : 0);
})();
