/* ==========================================================================
   Kapil Kumar Meena, Ph.D. — site behaviour
   Vanilla JS, no dependencies, no third-party requests.
   ========================================================================== */

(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Theme ------------------------------------------------------------ */

  var themeBtn = $('#theme');

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* The site opens light regardless of the OS setting — dark is a deliberate
     choice made with the toggle, and it is remembered from then on. */
  setTheme(document.documentElement.getAttribute('data-theme') || 'light');

  /* ---- Header, progress rail, back-to-top ------------------------------- */

  var head = $('#head'), rail = $('#rail'), toTop = $('#totop');
  var nav = $('#nav'), menu = $('#menu');
  var busy = false;

  function onScroll() {
    if (busy) return;
    busy = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      var d = document.documentElement;
      var total = d.scrollHeight - d.clientHeight;
      if (head) head.classList.toggle('stuck', y > 10);
      if (rail) rail.style.width = (total > 0 ? Math.min(100, (y / total) * 100) : 0) + '%';
      if (toTop) toTop.classList.toggle('on', y > 800);
      busy = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
    });
  }

  /* ---- Mobile menu ------------------------------------------------------ */

  function closeMenu() {
    if (!nav || !menu) return;
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
    menu.innerHTML = '<svg aria-hidden="true"><use href="#i-menu"></use></svg>';
    document.body.style.overflow = '';
  }

  if (nav && menu) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.innerHTML = open
        ? '<svg aria-hidden="true"><use href="#i-x"></use></svg>'
        : '<svg aria-hidden="true"><use href="#i-menu"></use></svg>';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    addEventListener('resize', function () { if (innerWidth > 1080) closeMenu(); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Scroll spy -------------------------------------------------------- */

  var links = $$('#nav a[href^="#"]');
  var marks = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);

  if (marks.length && 'IntersectionObserver' in window) {
    var seen = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      var best = 0, id = null;
      Object.keys(seen).forEach(function (k) { if (seen[k] > best) { best = seen[k]; id = k; } });
      links.forEach(function (a) { a.classList.toggle('on', id !== null && a.getAttribute('href') === '#' + id); });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: [0, 0.1, 0.35, 0.7] });
    marks.forEach(function (m) { spy.observe(m); });
  }

  /* ---- Reveal on scroll -------------------------------------------------- */

  var risers = $$('[data-rise]');
  if (!still && 'IntersectionObserver' in window) {
    var rise = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        /* Fire when it scrolls in — or immediately if the visitor already
           landed past it (an anchor jump, or a reload part-way down). */
        if (!en.isIntersecting && en.boundingClientRect.top >= 0) return;
        en.target.classList.add('is-in');
        rise.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    risers.forEach(function (el) { rise.observe(el); });
  } else {
    risers.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Counters ---------------------------------------------------------- */

  function run(el, instant) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var group = target >= 1000;
    var fmt = function (n) { return group ? n.toLocaleString('en-US') : String(n); };
    if (still || instant) { el.textContent = fmt(target); return; }

    var dur = 1200, t0 = null;
    function tick(now) {
      if (t0 === null) t0 = now;
      var p = Math.min((now - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cw = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var above = en.boundingClientRect.top < 0;
        if (!en.isIntersecting && !above) return;
        run(en.target, above);
        cw.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cw.observe(el); });
  } else {
    counters.forEach(function (el) { run(el, true); });
  }

  /* ---- Toast + clipboard -------------------------------------------------- */

  var toast = $('#toast'), toastT = $('#toast-t'), toastTimer = null;

  function say(msg) {
    if (!toast) return;
    toastT.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('on'); }, 2400);
  }

  function copy(text, msg) {
    var ok = function () { say(msg || 'Copied'); };
    var manual = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { say('Could not copy'); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, manual);
    } else { manual(); }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    e.preventDefault();
    copy(b.getAttribute('data-copy'), b.getAttribute('data-copy-msg'));
  });

  /* ---- BibTeX ------------------------------------------------------------ */

  function key(authors, year, title) {
    var last = (authors.split(' and ')[0] || 'meena').split(',')[0].replace(/[^A-Za-z]/g, '').toLowerCase() || 'meena';
    var word = (title.split(/\s+/).filter(function (w) { return w.replace(/[^A-Za-z]/g, '').length > 3; })[0] || 'paper');
    return last + (year || '') + word.replace(/[^A-Za-z]/g, '').toLowerCase();
  }

  function bibtex(d) {
    var kind = d.type || 'article';
    var venueKey = kind === 'article' ? 'journal' : (kind === 'inproceedings' ? 'booktitle' : 'howpublished');
    var fields = [
      ['title', d.title],
      ['author', d.authors],
      [venueKey, d.venue],
      ['volume', d.volume],
      ['pages', d.pages],
      ['year', d.year],
      ['doi', d.doi],
      ['note', d.note]
    ].filter(function (f) { return f[1]; });

    var lines = ['@' + kind + '{' + key(d.authors, d.year, d.title) + ','];
    fields.forEach(function (f, i) {
      lines.push('  ' + (f[0] + '         ').slice(0, 10) + '= {' + f[1] + '}' + (i === fields.length - 1 ? '' : ','));
    });
    lines.push('}');
    return lines.join('\n');
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-bib]');
    if (!b) return;
    e.preventDefault();
    try {
      copy(bibtex(JSON.parse(b.getAttribute('data-bib'))), 'BibTeX copied');
    } catch (err) {
      say('Could not build BibTeX');
    }
  });

  /* ---- Publication filter + search --------------------------------------- */

  var pubs = $$('#pubs .pub');
  var tabs = $$('.tab');
  var q = $('#q');
  var none = $('#noresults');
  var shown = $('#shown');
  var kind = 'all';

  pubs.forEach(function (p) { p.dataset.hay = p.textContent.replace(/\s+/g, ' ').toLowerCase(); });

  function apply() {
    var term = (q ? q.value : '').trim().toLowerCase();
    var n = 0;
    pubs.forEach(function (p) {
      var typeOk = kind === 'all' || p.getAttribute('data-type') === kind;
      var textOk = !term || p.dataset.hay.indexOf(term) !== -1;
      var vis = typeOk && textOk;
      p.hidden = !vis;
      if (vis) n++;
    });
    if (none) none.classList.toggle('on', n === 0);
    if (shown) shown.textContent = n === pubs.length
      ? 'Showing all ' + pubs.length + ' entries'
      : 'Showing ' + n + ' of ' + pubs.length + ' entries';
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      kind = t.getAttribute('data-f');
      tabs.forEach(function (o) { o.setAttribute('aria-pressed', String(o === t)); });
      apply();
    });
  });

  if (q) {
    var qt = null;
    q.addEventListener('input', function () {
      clearTimeout(qt);
      qt = setTimeout(apply, 110);
    });
    document.addEventListener('keydown', function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) { e.preventDefault(); q.focus(); }
      if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; apply(); q.blur(); }
    });
  }

  if (pubs.length) apply();

  /* ---- Lightbox ---------------------------------------------------------- */

  var lbox = $('#lbox');
  if (lbox) {
    var img = lbox.querySelector('img');
    var restore = null;

    function open(src, alt) {
      restore = document.activeElement;
      img.src = src; img.alt = alt || '';
      lbox.classList.add('on');
      document.body.style.overflow = 'hidden';
      lbox.querySelector('.x').focus();
    }
    function shut() {
      lbox.classList.remove('on');
      img.src = '';
      document.body.style.overflow = '';
      if (restore && restore.focus) restore.focus();
    }

    document.addEventListener('click', function (e) {
      var z = e.target.closest('[data-zoom]');
      if (z) {
        var inner = z.querySelector('img');
        open(z.getAttribute('data-zoom'), inner ? inner.alt : '');
        return;
      }
      if (e.target.closest('#lbox') && e.target !== img) shut();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lbox.classList.contains('on')) shut();
    });
  }

  /* ---- Misc --------------------------------------------------------------- */

  var yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  try {
    console.log(
      '%cKapil Kumar Meena, Ph.D.%c\nPostdoctoral Researcher · HUMAN Lab · UCLA\nkapil.meena@kgpian.iitkgp.ac.in',
      'font:600 15px/1.4 Georgia,serif;color:#d8430e',
      'font:12px/1.7 ui-monospace,monospace;color:#797b84'
    );
  } catch (e) {}
})();
