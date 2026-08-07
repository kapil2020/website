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

  /* ---- Publications explorer ---------------------------------------------
     Facets, counts and group headings are all derived from the markup, so
     adding a <article class="pub"> is the only edit a new paper needs.
     ------------------------------------------------------------------------ */

  var TOPIC_LABEL = {
    behaviour: 'Travel behaviour & choice modelling',
    exposure:  'Air quality & exposure',
    learning:  'Machine learning & prediction',
    active:    'Active mobility & accessibility',
    routing:   'Routing & decision tools'
  };
  var TOPIC_ORDER = ['behaviour', 'exposure', 'learning', 'active', 'routing'];
  var TYPE_LABEL  = { journal: 'Journal article', conference: 'Conference paper', patent: 'Patent' };
  var TYPE_ORDER  = ['journal', 'conference', 'patent'];

  var listEl  = $('#pubs');
  var facetEl = $('#facets');

  if (listEl && facetEl) {
    var items = $$('.pub', listEl).map(function (el) {
      return {
        el: el,
        node: el.cloneNode(true),
        type: el.getAttribute('data-type'),
        year: el.getAttribute('data-year'),
        venue: el.getAttribute('data-venue'),
        topics: (el.getAttribute('data-topics') || '').split(/\s+/).filter(Boolean),
        title: (el.querySelector('h3') || {}).textContent || '',
        hay: el.textContent.replace(/\s+/g, ' ').toLowerCase()
      };
    });

    var q       = $('#q');
    var none    = $('#noresults');
    var shown   = $('#shown');
    var clearBt = $('#clear');
    var groupSel = $('#group');
    var sortSel  = $('#sort');
    var railBody = $('#rail-body');
    var railBt   = $('#rail-toggle');
    var railCount = $('#rail-count');

    var picked = { topic: [], type: [], year: [], venue: [] };
    var collapsed = {};   /* group headings the visitor folded away */

    function tally(key) {
      var counts = {};
      items.forEach(function (it) {
        var vals = key === 'topic' ? it.topics : [it[key]];
        vals.forEach(function (v) { if (v) counts[v] = (counts[v] || 0) + 1; });
      });
      return counts;
    }

    function order(key, counts) {
      var keys = Object.keys(counts);
      if (key === 'topic') return TOPIC_ORDER.filter(function (k) { return counts[k]; });
      if (key === 'type')  return TYPE_ORDER.filter(function (k) { return counts[k]; });
      if (key === 'year')  return keys.sort(function (a, b) { return b - a; });
      return keys.sort(function (a, b) {
        return counts[b] - counts[a] || a.localeCompare(b);
      });
    }

    function label(key, v) {
      if (key === 'topic') return TOPIC_LABEL[v] || v;
      if (key === 'type')  return (TYPE_LABEL[v] || v) + 's';
      return v;
    }

    /* --- build the rail ------------------------------------------------- */
    function buildFacets() {
      var groups = [
        { key: 'topic', title: 'Research area', cap: 0 },
        { key: 'type',  title: 'Type',          cap: 0 },
        { key: 'year',  title: 'Year',          cap: 0 },
        { key: 'venue', title: 'Journal / venue', cap: 7 }
      ];
      facetEl.innerHTML = '';

      groups.forEach(function (g) {
        var counts = tally(g.key);
        var keys = order(g.key, counts);

        var wrap = document.createElement('div');
        wrap.className = 'facet';
        var h = document.createElement('h3');
        h.textContent = g.title;
        wrap.appendChild(h);

        var ul = document.createElement('ul');
        keys.forEach(function (v, i) {
          var li = document.createElement('li');
          if (g.cap && i >= g.cap) li.className = 'hide';
          var lab = document.createElement('label');
          lab.className = 'opt';
          lab.innerHTML =
            '<input type="checkbox" value="' + v + '" data-key="' + g.key + '">' +
            '<span class="box" aria-hidden="true"><svg><use href="#i-check"></use></svg></span>' +
            '<span class="lab"></span>' +
            '<span class="n">' + counts[v] + '</span>';
          lab.querySelector('.lab').textContent = label(g.key, v);
          li.appendChild(lab);
          ul.appendChild(li);
        });
        wrap.appendChild(ul);

        if (g.cap && keys.length > g.cap) {
          var more = document.createElement('button');
          more.type = 'button';
          more.className = 'more';
          more.textContent = 'Show all ' + keys.length + ' venues';
          more.addEventListener('click', function () {
            var hidden = ul.querySelector('li.hide');
            $$('li', ul).forEach(function (li, i) {
              li.classList.toggle('hide', hidden ? false : i >= g.cap);
            });
            more.textContent = hidden ? 'Show fewer' : 'Show all ' + keys.length + ' venues';
          });
          wrap.appendChild(more);
        }
        facetEl.appendChild(wrap);
      });

      facetEl.addEventListener('change', function (e) {
        var box = e.target;
        if (!box.matches('input[type="checkbox"]')) return;
        var key = box.getAttribute('data-key');
        var v = box.value;
        var at = picked[key].indexOf(v);
        if (box.checked && at === -1) picked[key].push(v);
        if (!box.checked && at !== -1) picked[key].splice(at, 1);
        render();
      });
    }

    /* --- filter, sort, group -------------------------------------------- */
    function matches(it, term) {
      if (term && it.hay.indexOf(term) === -1) return false;
      if (picked.topic.length && !picked.topic.some(function (t) { return it.topics.indexOf(t) !== -1; })) return false;
      if (picked.type.length && picked.type.indexOf(it.type) === -1) return false;
      if (picked.year.length && picked.year.indexOf(it.year) === -1) return false;
      if (picked.venue.length && picked.venue.indexOf(it.venue) === -1) return false;
      return true;
    }

    function heading(text, count, id) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'grp-head';
      b.setAttribute('aria-expanded', collapsed[id] ? 'false' : 'true');
      b.innerHTML = '<svg class="caret" aria-hidden="true"><use href="#i-chev"></use></svg>' +
                    '<span class="t"></span><span class="n">' + count + '</span>';
      b.querySelector('.t').textContent = text;
      b.addEventListener('click', function () {
        collapsed[id] = !collapsed[id];
        render();
      });
      return b;
    }

    function render() {
      var term = (q ? q.value : '').trim().toLowerCase();
      var dir = sortSel && sortSel.value === 'asc' ? 1 : -1;
      var mode = groupSel ? groupSel.value : 'topic';

      var kept = items.filter(function (it) { return matches(it, term); });
      kept.sort(function (a, b) {
        return (a.year - b.year) * dir || a.title.localeCompare(b.title);
      });

      listEl.innerHTML = '';
      var put = function (it) { listEl.appendChild(it.node.cloneNode(true)); };

      if (!kept.length) {
        if (none) none.classList.add('on');
      } else {
        if (none) none.classList.remove('on');

        if (mode === 'none') {
          kept.forEach(put);
        } else {
          var buckets = {};
          kept.forEach(function (it) {
            var keys = mode === 'topic' ? it.topics : [it[mode]];
            keys.forEach(function (k) { (buckets[k] = buckets[k] || []).push(it); });
          });
          var keys = Object.keys(buckets);
          if (mode === 'topic') keys = TOPIC_ORDER.filter(function (k) { return buckets[k]; });
          else if (mode === 'type') keys = TYPE_ORDER.filter(function (k) { return buckets[k]; });
          else keys.sort(function (a, b) { return (a - b) * dir; });

          keys.forEach(function (k) {
            var id = mode + ':' + k;
            listEl.appendChild(heading(label(mode, k), buckets[k].length, id));
            if (!collapsed[id]) buckets[k].forEach(put);
          });
        }
      }

      var active = picked.topic.length + picked.type.length + picked.year.length + picked.venue.length;
      if (shown) {
        shown.textContent = kept.length === items.length
          ? items.length + ' entries'
          : kept.length + ' of ' + items.length + ' entries';
      }
      if (clearBt) clearBt.hidden = !(active || term);
      if (railCount) railCount.textContent = active ? active + ' active' : '';
    }

    /* --- wiring ---------------------------------------------------------- */
    buildFacets();

    if (q) {
      var qt = null;
      q.addEventListener('input', function () {
        clearTimeout(qt);
        qt = setTimeout(render, 110);
      });
      document.addEventListener('keydown', function (e) {
        var tag = (document.activeElement && document.activeElement.tagName) || '';
        if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
          e.preventDefault();
          if (railBody && !railBody.classList.contains('open') && railBt && getComputedStyle(railBt).display !== 'none') railBt.click();
          q.focus();
        }
        if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; render(); q.blur(); }
      });
    }

    if (groupSel) groupSel.addEventListener('change', render);
    if (sortSel) sortSel.addEventListener('change', render);

    if (clearBt) {
      clearBt.addEventListener('click', function () {
        picked = { topic: [], type: [], year: [], venue: [] };
        $$('input[type="checkbox"]', facetEl).forEach(function (b) { b.checked = false; });
        if (q) q.value = '';
        render();
      });
    }

    if (railBt && railBody) {
      railBt.addEventListener('click', function () {
        var open = railBody.classList.toggle('open');
        railBt.setAttribute('aria-expanded', String(open));
      });
    }

    render();
  }

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
