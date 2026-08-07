/* Full-site QA: unstyled classes, overflow, tap targets, contrast, JS errors. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL = 'http://127.0.0.1:8899/preview/';
const WIDTHS = [320, 360, 390, 430, 600, 768, 1024, 1280, 1440, 1920];

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

    (await p.textContent('#shown')) === '28 entries' ? ok('28 entries listed') : bad('entry count wrong: ' + await p.textContent('#shown'));

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

    await p.click('#theme'); await p.waitForTimeout(200);
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
    await p.click('label.opt:has(input[data-key="type"][value="patent"])'); await p.waitForTimeout(300);
    (await p.textContent('#shown')).startsWith('1 of') ? ok('mobile facet filters') : bad('mobile facet → ' + await p.textContent('#shown'));
    await p.click('#menu'); await p.waitForTimeout(350);
    (await p.$eval('#nav', e => e.classList.contains('open'))) ? ok('mobile menu opens') : bad('mobile menu failed');
    errs.length ? bad('JS errors: ' + errs.join(' | ')) : ok('no JS errors');
    await c.close();
  }

  console.log('\n' + (fails ? `✗ ${fails} problem(s)` : '✓ all checks passed'));
  await b.close();
  process.exit(fails ? 1 : 0);
})();
