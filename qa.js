/* Full-site QA: unstyled classes, overflow, tap targets, contrast, JS errors. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL = 'http://127.0.0.1:8899/preview/';
/* Phones, then the tablet sizes people actually hold (iPad mini/Air/Pro
   portrait and landscape), then desktop. */
const WIDTHS = [320, 360, 390, 414, 430, 600, 744, 768, 834, 912, 1024, 1180, 1280, 1440, 1920];

const IGNORE_CLASS = new Set(['sr', 'is-in', 'on', 'open', 'hide', 'stuck', 'me', 'yr']);

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let fails = 0;
  const bad = (m) => { fails++; console.log('  ✗ ' + m); };
  const ok = (m) => console.log('  ✓ ' + m);

  // ---------- 1. every class used in the markup has a rule ----------
  {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await c.newPage();
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);

    const unstyled = await p.evaluate((ignore) => {
      const declared = new Set();
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch (e) { continue; }
        const walk = (rs) => {
          for (const r of rs) {
            if (r.selectorText) {
              (r.selectorText.match(/\.[A-Za-z0-9_-]+/g) || [])
                .forEach((m) => declared.add(m.slice(1)));
            }
            if (r.cssRules) walk(r.cssRules);
          }
        };
        walk(rules);
      }
      const used = new Set();
      document.querySelectorAll('[class]').forEach((el) =>
        (el.getAttribute('class') || '').split(/\s+/).filter(Boolean).forEach((c) => used.add(c)));
      return [...used].filter((c) => !declared.has(c) && !ignore.includes(c));
    }, [...IGNORE_CLASS]);

    console.log('\n1. CSS coverage');
    unstyled.length ? bad('classes with no rule: ' + unstyled.join(', ')) : ok('every class in the markup has a rule');

    // stylesheets actually loaded?
    const sheets = await p.evaluate(() =>
      [...document.styleSheets].map(s => ({ href: (s.href || '').split('/').pop(), rules: (() => { try { return s.cssRules.length; } catch (e) { return -1; } })() })));
    sheets.forEach(s => s.rules > 0 ? ok(`${s.href} → ${s.rules} rules`) : bad(`${s.href} failed to load`));
    await c.close();
  }

  // ---------- 2. layout across widths ----------
  console.log('\n2. Layout');
  for (const w of WIDTHS) {
    const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 });
    const p = await c.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('requestfailed', r => errs.push('request failed: ' + r.url()));
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(700);
    const r = await p.evaluate(() => ({
      s: document.documentElement.scrollWidth,
      c: document.documentElement.clientWidth,
      tiny: [...document.querySelectorAll('a,button,select,input,label.opt')]
        .filter(el => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.height < 30 && !el.closest('.ticker,.foot,.head'); })
        .slice(0, 4).map(el => el.tagName + '.' + ((el.getAttribute('class') || '?').split(' ')[0]) + ' “' + (el.textContent || '').trim().slice(0, 22) + '” h=' + Math.round(el.getBoundingClientRect().height))
    }));
    const line = `${String(w).padStart(5)}px  ${r.s}/${r.c}`;
    if (r.s > r.c) bad(line + '  horizontal overflow');
    else if (errs.length) bad(line + '  errors: ' + errs.join(' | '));
    else ok(line + (w < 500 && r.tiny.length ? '  (small targets: ' + r.tiny.join(', ') + ')' : ''));
    await c.close();
  }

  // ---------- 2a. nothing sits on top of anything else ----------
  /* Overflow is not overlap. A flex item with min-width:0 and nowrap text
     shrinks its box and paints its content straight over its neighbour
     without ever widening the page — which is how the wordmark's affiliation
     came to sit on top of the nav at every width above 1080 px while the
     overflow check stayed green.

     Compared per line fragment via getClientRects(), not by bounding box: an
     inline element that wraps has one box spanning every line it touches, and
     would otherwise collide with its neighbours on paper but not on screen. */
  console.log('\n2a. Overlap');
  {
    const OVERLAP = () => {
      const SKIP = '.pal, .lbox, .toast, .skip, .top-btn, .net, .hero-tag, .ticker, .split, .sr, .rail, .spectrum';
      const shown = (el) => {
        const s = getComputedStyle(el);
        if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.15) return false;
        const b = el.getBoundingClientRect();
        return b.width > 1 && b.height > 1;
      };
      const owns = (el) => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const els = [...document.body.querySelectorAll('*')]
        .filter(el => !el.closest(SKIP) && owns(el) && shown(el));
      const name = el => el.tagName.toLowerCase() + '.' + ((el.getAttribute('class') || '?').split(' ')[0]);
      const out = [];
      for (let i = 0; i < els.length; i++) {
        for (let j = i + 1; j < els.length; j++) {
          const a = els[i], b = els[j];
          if (a.contains(b) || b.contains(a)) continue;
          let hit = null;
          for (const x of a.getClientRects()) {
            for (const y of b.getClientRects()) {
              const ox = Math.min(x.right, y.right) - Math.max(x.left, y.left);
              const oy = Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top);
              if (ox > 2 && oy > 2) { hit = [ox, oy]; break; }
            }
            if (hit) break;
          }
          if (hit) out.push(`${name(a)} "${a.textContent.trim().slice(0, 16)}" over ${name(b)} "${b.textContent.trim().slice(0, 16)}" ${Math.round(hit[0])}×${Math.round(hit[1])}px`);
        }
      }
      return out;
    };

    let clean = 0;
    for (const w of WIDTHS) {
      const c = await b.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 });
      const p = await c.newPage();
      await p.goto(URL, { waitUntil: 'networkidle' });
      await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelectorAll('[data-rise]').forEach(e => e.classList.add('is-in')));
      await p.waitForTimeout(250);
      const found = await p.evaluate(OVERLAP);
      if (found.length) bad(`${w}px: ` + found.slice(0, 3).join(' | '));
      else clean++;
      await c.close();
    }
    if (clean === WIDTHS.length) ok(`no text overlaps any other text, at all ${WIDTHS.length} widths`);
  }

  // ---------- 2b. text you can actually read ----------
  /* Guards the whole class of "the label went the same colour as the thing
     behind it" — how a fill on .btn--line once erased the CV button where it
     sits on the inverted contact band. Walks up for the first opaque
     background and compares luminance. */
  console.log('\n2b. Contrast');
  for (const theme of ['light', 'dark']) {
    const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await c.newPage();
    await p.goto(URL, { waitUntil: 'domcontentloaded' });
    await p.evaluate((t) => localStorage.setItem('theme', t), theme);
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    await p.evaluate(() => document.querySelectorAll('[data-rise]').forEach((e) => e.classList.add('is-in')));
    await p.waitForTimeout(300);

    const faint = await p.evaluate(() => {
      const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      const lum = ([r, g, b]) => {
        const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const bgOf = (el) => {
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          const c = rgb(getComputedStyle(n).backgroundColor);
          if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c;
        }
        return rgb(getComputedStyle(document.body).backgroundColor);
      };
      const out = [];
      document.querySelectorAll('.btn, .nav a, h1, h2, h3, .lnk, .tag, .jrnls cite, .act, .chip').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const st = getComputedStyle(el);
        if (st.visibility === 'hidden' || +st.opacity < 0.1) return;
        const fg = rgb(st.color), bg = bgOf(el);
        if (fg.length < 3) return;
        const a = lum(fg), z = lum(bg);
        const ratio = (Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05);
        if (ratio < 3.0) {
          out.push(el.tagName.toLowerCase() + '.' + ((el.getAttribute('class') || '?').split(' ')[0]) +
            ' "' + (el.textContent || '').trim().slice(0, 24) + '" ' + ratio.toFixed(2) + ':1');
        }
      });
      return out;
    });
    faint.length ? bad(`${theme}: unreadable — ` + faint.join(' | ')) : ok(`${theme}: every button, link and heading clears 3:1`);
    await c.close();
  }

  // ---------- 3. interactions ----------
  console.log('\n3. Interactions');
  {
    const c = await b.newContext({ viewport: { width: 1440, height: 950 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const p = await c.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);

    const rows = () => p.$$eval('#pubs .pub', e => e.length);
    const pick = (k, v) => p.click(`label.opt:has(input[data-key="${k}"][value="${v}"])`);

    (await p.textContent('#shown')) === '12 of 28 entries' ? ok('lands with journals filtered (12 of 28)') : bad('landing filter wrong: ' + await p.textContent('#shown'));

    await p.click('#clear'); await p.waitForTimeout(200);
    for (const [mode, expect] of [['year', 28], ['type', 28], ['none', 28], ['topic', 28]]) {
      await p.selectOption('#group', mode); await p.waitForTimeout(200);
      const n = await rows();
      n === expect ? ok(`group by ${mode} → ${n} rows`) : bad(`group by ${mode} → ${n}, expected ${expect}`);
    }

    await pick('type', 'journal'); await p.waitForTimeout(200);
    (await p.textContent('#shown')).startsWith('12 of') ? ok('journal facet → 12') : bad('journal facet → ' + await p.textContent('#shown'));
    await p.click('#clear'); await p.waitForTimeout(200);
    (await p.$$eval('#facets input:checked', e => e.length)) === 0 ? ok('clear resets facets') : bad('clear left facets checked');

    await p.fill('#q', 'kolkata'); await p.waitForTimeout(300);
    (await p.textContent('#shown')).startsWith('2 of') ? ok('search works') : bad('search → ' + await p.textContent('#shown'));
    await p.fill('#q', ''); await p.waitForTimeout(250);

    await p.click('#pubs .pub [data-bib]'); await p.waitForTimeout(400);
    (await p.evaluate(() => navigator.clipboard.readText())).startsWith('@') ? ok('BibTeX copies') : bad('BibTeX failed');

    await p.click('#theme'); await p.waitForTimeout(800);
    (await p.getAttribute('html', 'data-theme')) === 'dark' ? ok('theme toggles') : bad('theme did not toggle');
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(400);
    (await p.getAttribute('html', 'data-theme')) === 'dark' ? ok('theme persists') : bad('theme did not persist');
    await p.evaluate(() => localStorage.removeItem('theme'));

    await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
    (await p.getAttribute('html', 'data-theme')) === 'light' ? ok('fresh visit opens light') : bad('fresh visit not light');

    await p.evaluate(() => document.getElementById('media').scrollIntoView({ block: 'start', behavior: 'instant' }));
    await p.waitForTimeout(500);
    await p.click('[data-zoom]'); await p.waitForTimeout(400);
    (await p.$eval('#lbox', e => e.classList.contains('on'))) ? ok('lightbox opens') : bad('lightbox did not open');
    await p.keyboard.press('Escape'); await p.waitForTimeout(250);

    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(200);
    await p.keyboard.press('/'); await p.waitForTimeout(250);
    (await p.evaluate(() => document.activeElement.id)) === 'q' ? ok('“/” focuses search') : bad('“/” did not focus search');

    errs.length ? bad('JS errors: ' + errs.join(' | ')) : ok('no JS errors');
    await c.close();
  }

  // ---------- 4. mobile explorer ----------
  console.log('\n4. Mobile explorer');
  {
    const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await c.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    await p.evaluate(() => document.getElementById('publications').scrollIntoView({ block: 'start', behavior: 'instant' }));
    await p.waitForTimeout(600);
    (await p.$eval('#rail-body', e => getComputedStyle(e).display)) === 'none' ? ok('filter rail starts collapsed') : bad('rail not collapsed');
    await p.click('#rail-toggle'); await p.waitForTimeout(400);
    (await p.$eval('#rail-body', e => getComputedStyle(e).display)) !== 'none' ? ok('filter rail opens') : bad('rail did not open');
    await p.click('label.opt:has(input[data-key="type"][value="journal"])'); await p.waitForTimeout(200);
    await p.click('label.opt:has(input[data-key="type"][value="patent"])'); await p.waitForTimeout(300);
    (await p.textContent('#shown')).startsWith('1 of') ? ok('mobile facet filters') : bad('mobile facet → ' + await p.textContent('#shown'));
    await p.click('#menu'); await p.waitForTimeout(400);
    (await p.$eval('#nav', e => e.classList.contains('open'))) ? ok('mobile menu opens') : bad('mobile menu failed');
    /* The header hides the CV button on phones, so the menu has to carry it. */
    const act = await p.$$eval('.nav-act .btn', els => els.filter(e => e.getBoundingClientRect().height > 40).length);
    act === 2 ? ok('menu carries CV and email') : bad('menu actions missing (' + act + '/2)');
    /* These are anchors inside .nav, so a nav-item rule can outrank .btn and
       paint the label the same colour as the fill. Check them while open. */
    const inked = await p.$$eval('.nav-act .btn', els => els.map((e) => {
      const st = getComputedStyle(e);
      return e.textContent.trim().split(/\s+/)[0] + ':' + (st.color === st.backgroundColor ? 'INVISIBLE' : 'ok');
    }));
    inked.every(s => s.endsWith('ok')) ? ok('menu buttons keep their labels') : bad('menu button labels: ' + inked.join(', '));
    await p.click('#menu'); await p.waitForTimeout(350);
    (await p.evaluate(() => getComputedStyle(document.body).overflow)) !== 'hidden'
      ? ok('closing the menu releases the scroll lock') : bad('body left scroll-locked');
    errs.length ? bad('JS errors: ' + errs.join(' | ')) : ok('no JS errors');
    await c.close();
  }

  // ---------- 4b. the pieces that actually compute something ----------
  console.log('\n4b. Interactive');
  {
    const c = await b.newContext({ viewport: { width: 1440, height: 950 }, acceptDownloads: true });
    const p = await c.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1100);

    // --- the choice model ---
    const set = (id, v) => p.$eval(id, (el, v) => { el.value = v; el.dispatchEvent(new Event('input')); }, v);
    const shares = async () => p.$$eval('#modes .m-share', els => els.map(e => parseFloat(e.textContent)));

    const base = await shares();
    base.length === 4 ? ok('model solves four modes') : bad('model rows: ' + base.length);
    const total = base.reduce((a, x) => a + x, 0);
    Math.abs(total - 100) < 0.4 ? ok(`shares sum to ${total.toFixed(1)}%`) : bad(`shares sum to ${total.toFixed(1)}%`);

    /* Dirty air should move trips off the most exposed mode. If this stops
       being true the utility function has been broken. */
    await set('#ctl-d', 2.5); await set('#ctl-p', 15); await p.waitForTimeout(120);
    const clean = await shares();
    await set('#ctl-p', 280); await p.waitForTimeout(120);
    const dirty = await shares();
    dirty[3] < clean[3] - 5
      ? ok(`walking falls ${clean[3].toFixed(1)}% → ${dirty[3].toFixed(1)}% as PM2.5 rises`)
      : bad(`walking did not respond to PM2.5 (${clean[3]} → ${dirty[3]})`);

    /* With no taste for clean air, the same rise should do almost nothing. */
    await set('#ctl-b', 0); await p.waitForTimeout(120);
    const numb = await shares();
    numb[3] > dirty[3] + 5
      ? ok('zeroing the exposure coefficient restores the walk share')
      : bad('exposure coefficient has no effect');

    await p.click('#sim-reset'); await p.waitForTimeout(150);
    (await p.inputValue('#ctl-p')) === '90' ? ok('reset restores the scenario') : bad('reset failed');

    // --- the network ---
    await p.evaluate(() => document.getElementById('net').scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(2600);
    const net = await p.evaluate(() => {
      const ns = [...document.querySelectorAll('#net-svg .node')];
      const box = document.querySelector('#net').getBoundingClientRect();
      const stray = ns.filter(n => {
        const b = n.getBoundingClientRect();
        return b.left < box.left - 4 || b.right > box.right + 4 || b.top < box.top - 4 || b.bottom > box.bottom + 4;
      }).length;
      return { n: ns.length, e: document.querySelectorAll('#net-svg .edge').length, stray };
    });
    net.n > 12 && net.e > 20 ? ok(`network: ${net.n} authors, ${net.e} ties`) : bad(`network too small: ${net.n}/${net.e}`);
    net.stray === 0 ? ok('every node settled inside the frame') : bad(`${net.stray} node(s) escaped the frame`);

    await p.click('#net-svg .node:not(.me)'); await p.waitForTimeout(500);
    /^\d+ of 28/.test(await p.textContent('#shown'))
      ? ok('clicking a co-author filters the list') : bad('co-author click did not filter');

    // --- the palette ---
    await p.keyboard.press('Control+k'); await p.waitForTimeout(350);
    !(await p.$eval('#pal', e => e.hidden)) ? ok('palette opens on Ctrl-K') : bad('palette did not open');
    await p.fill('#pal-q', 'nattr'); await p.waitForTimeout(280);
    (await p.textContent('.pal-item .pal-t')).startsWith('Not all travellers')
      ? ok('fuzzy match: "nattr" finds "Not all travellers…"') : bad('fuzzy match failed');
    await p.keyboard.press('ArrowDown'); await p.waitForTimeout(120);
    (await p.$$eval('.pal-item.on', e => e.length)) === 1 ? ok('arrow keys move one selection') : bad('selection broken');
    await p.fill('#pal-q', 'zzqq'); await p.waitForTimeout(220);
    (await p.$('.pal-empty')) ? ok('no-match state shows') : bad('no-match state missing');
    await p.keyboard.press('Escape'); await p.waitForTimeout(250);
    (await p.$eval('#pal', e => e.hidden)) ? ok('Escape closes the palette') : bad('palette did not close');
    (await p.evaluate(() => getComputedStyle(document.body).overflow)) !== 'hidden'
      ? ok('palette releases the scroll lock') : bad('palette left the body locked');

    // --- BibTeX export ---
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), p.click('#exportbib')]);
    /\.bib$/.test(dl.suggestedFilename()) ? ok(`export downloads ${dl.suggestedFilename()}`) : bad('bad .bib filename');

    errs.length ? bad('JS errors: ' + errs.join(' | ')) : ok('no JS errors');
    await c.close();
  }

  // ---------- 5. tablet ----------
  console.log('\n5. Tablet');
  for (const [name, w, h] of [['iPad portrait', 834, 1112], ['iPad landscape', 1180, 820]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true });
    const p = await c.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => ({
      shot: Math.round(document.querySelector('.hero-shot .frame').getBoundingClientRect().height),
      /* What matters is not how tall the portrait is but whether the reader
         meets the writing without scrolling — beside it or below it. */
      bio: Math.round(document.querySelector('.hero-bio p').getBoundingClientRect().top),
      vh: innerHeight,
      nav: getComputedStyle(document.querySelector('#menu')).display,
    }));
    r.bio < r.vh
      ? ok(`${name}: bio starts at ${r.bio}px, above the ${r.vh}px fold (portrait ${r.shot}px)`)
      : bad(`${name}: bio starts at ${r.bio}px, below the ${r.vh}px fold`);
    ok(`${name}: menu button ${r.nav === 'none' ? 'hidden (full nav)' : 'shown'}`);
    errs.length ? bad(name + ' JS errors: ' + errs.join(' | ')) : ok(name + ': no JS errors');
    await c.close();
  }

  console.log('\n' + (fails ? `✗ ${fails} problem(s)` : '✓ all checks passed'));
  await b.close();
  process.exit(fails ? 1 : 0);
})();
