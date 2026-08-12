/* ==========================================================================
   Dr. Kapil Kumar Meena — site behaviour
   Vanilla JS, no dependencies, no third-party requests.
   ========================================================================== */

(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* One read of the publication markup, taken before the explorer starts
     swapping the list out for a filtered copy. The network, the palette and
     the .bib export all index this rather than re-querying the DOM. */
  var PUBS = $$('#pubs .pub').map(function (el) {
    var data = {};
    var holder = el.querySelector('[data-bib]');
    try { data = JSON.parse(holder.getAttribute('data-bib')); } catch (e) {}
    var link = el.querySelector('h3 a');
    return {
      id:      ((el.querySelector('.id') || {}).textContent || '').replace(/[\[\]]/g, ''),
      title:   ((el.querySelector('h3') || {}).textContent || '').trim(),
      authors: String(data.authors || '').split(' and ').map(function (x) { return x.trim(); }).filter(Boolean),
      venue:   el.getAttribute('data-venue') || '',
      year:    el.getAttribute('data-year') || '',
      type:    el.getAttribute('data-type') || '',
      topic:   (el.getAttribute('data-topics') || '').split(/\s+/)[0] || '',
      href:    link ? link.getAttribute('href') : '',
      bib:     data
    };
  });

  /* Hand a file to the visitor. Used by the .bib export in both places it
     is offered. */
  function download(name, text) {
    var url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ---- Theme ------------------------------------------------------------ */

  var themeBtn = $('#theme');

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      var apply = function () {
        setTheme(next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      };

      /* Where it is supported, clip the incoming theme open from the middle
         of the button, so the change has a source. Everywhere else it is the
         plain instant swap it always was. */
      if (still || !document.startViewTransition) { apply(); return; }

      var box = themeBtn.getBoundingClientRect();
      var x = box.left + box.width / 2;
      var y = box.top + box.height / 2;
      var far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

      document.startViewTransition(apply).ready.then(function () {
        document.documentElement.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)',
                       'circle(' + far + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 520, easing: 'cubic-bezier(0.22, 0.68, 0.16, 1)',
            pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
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
  var TOPIC_VAR = {
    behaviour: 'var(--c-behaviour)', exposure: 'var(--c-exposure)',
    learning: 'var(--c-learning)', active: 'var(--c-active)', routing: 'var(--c-routing)'
  };
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

    /* Journals lead on arrival; everything else is one click away. */
    var picked = { topic: [], type: ['journal'], year: [], venue: [] };
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
          var swatch = g.key === 'topic'
            ? '<span class="swatch" style="background:' + TOPIC_VAR[v] + '" aria-hidden="true"></span>'
            : '';
          lab.innerHTML =
            '<input type="checkbox" value="' + v + '" data-key="' + g.key + '">' +
            '<span class="box" aria-hidden="true"><svg><use href="#i-check"></use></svg></span>' +
            '<span class="lab">' + swatch + '</span>' +
            '<span class="n">' + counts[v] + '</span>';
          lab.querySelector('.lab').appendChild(document.createTextNode(label(g.key, v)));
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

    function heading(text, count, id, tone) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'grp-head';
      if (tone) b.style.setProperty('--grp', tone);
      b.setAttribute('aria-expanded', collapsed[id] ? 'false' : 'true');
      b.innerHTML = '<svg class="caret" aria-hidden="true"><use href="#i-chev"></use></svg>' +
                    (tone ? '<span class="swatch" aria-hidden="true"></span>' : '') +
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
            listEl.appendChild(heading(label(mode, k), buckets[k].length, id,
              mode === 'topic' ? TOPIC_VAR[k] : null));
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
    $$('#facets input[data-key="type"][value="journal"]').forEach(function (b) { b.checked = true; });

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

    /* The network and the palette steer the list through this event rather
       than reaching into the explorer's closure. */
    document.addEventListener('pubs:search', function (e) {
      var d = e.detail || {};
      picked = { topic: [], type: [], year: [], venue: [] };
      $$('input[type="checkbox"]', facetEl).forEach(function (b) { b.checked = false; });
      if (q) q.value = d.term || '';
      render();
      if (d.flash) {
        requestAnimationFrame(function () {
          var first = listEl.querySelector('.pub');
          if (!first) return;
          first.classList.remove('flash');
          void first.offsetWidth;
          first.classList.add('flash');
        });
      }
    });

    /* Export what is on screen, filters and all. */
    var expBt = $('#exportbib');
    if (expBt) {
      expBt.addEventListener('click', function () {
        var here = $$('.pub [data-bib]', listEl).map(function (b) {
          try { return bibtex(JSON.parse(b.getAttribute('data-bib'))); } catch (e) { return ''; }
        }).filter(Boolean);
        if (!here.length) { say('Nothing to export'); return; }
        download('meena-' + here.length + '-entries.bib', here.join('\n\n') + '\n');
        say(here.length + ' entries downloaded');
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


  /* ---- Live choice model --------------------------------------------------
     A multinomial logit over four urban modes, solved on every input event.
     Utility is linear in parameters; exposure enters as inhaled dose rather
     than ambient concentration, which is why walking stops being the clean
     option once the air is bad — the exertion term doubles the breathing rate
     while the trip takes three times as long.
     ------------------------------------------------------------------------ */

  var sim = $('#sim');
  if (sim) {
    /* t: minutes, c: rupees, both as functions of distance in km.
       env: micro-environment concentration relative to ambient.
       br:  breathing rate multiplier — exertion, not just time. */
    var MODES = [
      { id: 'car',   name: 'Car',         asc: 0.95, env: 0.55, br: 1.00, hue: 'var(--m-car)',
        t: function (d) { return 6 + 2.7 * d; }, c: function (d) { return 22 + 11 * d; } },
      { id: 'tw',    name: 'Two-wheeler', asc: 0.70, env: 1.15, br: 1.20, hue: 'var(--m-2w)',
        t: function (d) { return 4 + 2.1 * d; }, c: function (d) { return 3.5 * d; } },
      { id: 'metro', name: 'Metro',       asc: 0.35, env: 0.45, br: 1.10, hue: 'var(--m-metro)',
        t: function (d) { return 11 + 1.9 * d; }, c: function (d) { return 10 + 2.2 * d; } },
      { id: 'walk',  name: 'Walk',        asc: 1.60, env: 1.00, br: 2.10, hue: 'var(--m-walk)',
        t: function (d) { return 12 * d; }, c: function () { return 0; } }
    ];

    var BC = -0.012;          /* per rupee — the numéraire */
    var VENT = 0.55;          /* m³/h at rest; br scales it */
    var BASE = { d: 8, p: 90, b: 30, v: 240 };

    var AQ = [
      [50,  'Good to moderate'], [90,  'Unhealthy for sensitive groups'],
      [150, 'Unhealthy'], [250, 'Very unhealthy'], [1e9, 'Hazardous']
    ];

    /* Solve the model. Returns per-mode attributes, shares and the log-sum. */
    function solve(s) {
      var bt = BC * s.v / 60;             /* value of time ties βt to βc */
      var be = -s.b / 1000;               /* per µg inhaled */
      var rows = MODES.map(function (m) {
        var t = m.t(s.d), c = m.c(s.d);
        var dose = s.p * m.env * m.br * VENT * (t / 60);
        return { m: m, t: t, c: c, dose: dose, v: m.asc + bt * t + BC * c + be * dose };
      });
      /* Shift by the max before exponentiating — the standard guard against
         overflow when utilities run large. */
      var top = Math.max.apply(null, rows.map(function (r) { return r.v; }));
      var exps = rows.map(function (r) { return Math.exp(r.v - top); });
      var sum = exps.reduce(function (a, b) { return a + b; }, 0);
      rows.forEach(function (r, i) { r.p = exps[i] / sum; });
      return { rows: rows, logsum: top + Math.log(sum) };
    }

    var splitEl = $('#split'), tbodyEl = $('#modes');
    var out = { d: $('#out-d'), p: $('#out-p'), b: $('#out-b'), t: $('#out-t'),
                ls: $('#out-ls'), lsd: $('#out-lsd'), el: $('#out-el') };
    var ctl = { d: $('#ctl-d'), p: $('#ctl-p'), b: $('#ctl-b'), t: $('#ctl-t') };
    var hintP = $('#hint-p');

    var bars = MODES.map(function (m) {
      var i = document.createElement('i');
      i.style.background = m.hue;
      splitEl.appendChild(i);
      return i;
    });

    var cells = MODES.map(function (m) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><span class="m-name"><i style="background:' + m.hue + '"></i></span></td>' +
        '<td data-cell="t"></td><td data-cell="c"></td><td data-cell="e"></td>' +
        '<td class="m-v" data-cell="v"></td><td class="m-share" data-cell="p"></td>';
      tr.querySelector('.m-name').appendChild(document.createTextNode(m.name));
      tbodyEl.appendChild(tr);
      return { tr: tr, t: tr.querySelector('[data-cell="t"]'), c: tr.querySelector('[data-cell="c"]'),
               e: tr.querySelector('[data-cell="e"]'), v: tr.querySelector('[data-cell="v"]'),
               p: tr.querySelector('[data-cell="p"]') };
    });

    var baseLogsum = solve(BASE).logsum;

    function paint() {
      var s = { d: +ctl.d.value, p: +ctl.p.value, b: +ctl.b.value, v: +ctl.t.value };
      var r = solve(s);

      out.d.textContent = s.d.toFixed(1) + ' km';
      out.p.textContent = s.p + ' µg/m³';
      out.b.innerHTML = 'β<sub>e</sub> = ' + (s.b ? '−' + (s.b / 1000).toFixed(3) : '0.000');
      out.t.textContent = '₹' + s.v + '/h';
      for (var i = 0; i < AQ.length; i++) { if (s.p <= AQ[i][0]) { hintP.textContent = AQ[i][1]; break; } }

      var lead = 0;
      r.rows.forEach(function (row, i) { if (row.p > r.rows[lead].p) lead = i; });

      r.rows.forEach(function (row, i) {
        bars[i].style.flexGrow = String(Math.max(row.p, 0.0008));
        cells[i].t.textContent = Math.round(row.t) + ' min';
        cells[i].c.textContent = row.c ? '₹' + Math.round(row.c) : 'free';
        cells[i].e.textContent = row.dose.toFixed(1) + ' µg';
        cells[i].v.textContent = (row.v >= 0 ? '+' : '−') + Math.abs(row.v).toFixed(2);
        cells[i].p.textContent = (row.p * 100).toFixed(1) + '%';
        cells[i].tr.classList.toggle('lead', i === lead);
      });

      splitEl.setAttribute('aria-label', 'Predicted mode shares: ' + r.rows.map(function (row) {
        return row.m.name + ' ' + (row.p * 100).toFixed(0) + '%';
      }).join(', '));

      /* Log-sum: the expected maximum utility of the whole choice set, and the
         standard basis for a money-metric welfare comparison once divided by
         the cost coefficient. */
      out.ls.textContent = r.logsum.toFixed(2);
      var rupees = (r.logsum - baseLogsum) / Math.abs(BC);
      out.lsd.textContent = Math.abs(rupees) < 1
        ? 'expected utility of the choice set — level with the reference scenario'
        : '≈ ₹' + Math.abs(Math.round(rupees)) + ' ' + (rupees > 0 ? 'better' : 'worse') +
          ' than the reference scenario';

      /* What a worse air day does to the split, holding everything else. */
      var worse = solve({ d: s.d, p: Math.min(s.p + 25, 400), b: s.b, v: s.v });
      var drop = 0, at = 0;
      worse.rows.forEach(function (row, i) {
        var delta = row.p - r.rows[i].p;
        if (delta < drop) { drop = delta; at = i; }
      });
      out.el.textContent = drop < -0.0005
        ? (drop * 100).toFixed(1).replace('-', '−') + ' pts · ' + MODES[at].name
        : 'no shift';
    }

    Object.keys(ctl).forEach(function (k) { ctl[k].addEventListener('input', paint); });

    var reset = $('#sim-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        ctl.d.value = BASE.d; ctl.p.value = BASE.p;
        ctl.b.value = BASE.b; ctl.t.value = BASE.v;
        paint();
      });
    }
    paint();
  }


  /* ---- Co-authorship network ----------------------------------------------
     Nodes and edges come out of the publication markup, not a data file, so
     adding a paper redraws the graph. Layout is a plain spring–charge
     simulation: every pair repels by an inverse-square law, every shared
     paper pulls, and a weak centring force keeps the whole thing on canvas.
     Twenty-odd nodes make the O(n²) pass free, so there is no quadtree here.
     ------------------------------------------------------------------------ */

  var netSvg = $('#net-svg');
  if (netSvg && PUBS.length) {
    var NS = 'http://www.w3.org/2000/svg';
    var netBox = $('#net'), tip = $('#net-tip'), reheat = $('#net-reheat');
    var TOPIC_HUE = {
      behaviour: 'var(--c-behaviour)', exposure: 'var(--c-exposure)',
      learning: 'var(--c-learning)', active: 'var(--c-active)', routing: 'var(--c-routing)'
    };

    /* --- Build the graph ------------------------------------------------- */
    var byName = {}, nodes = [], edgeMap = {};

    function nodeFor(name) {
      if (!byName[name]) {
        byName[name] = { name: name, surname: name.split(',')[0].trim(), n: 0, topics: {}, i: nodes.length };
        nodes.push(byName[name]);
      }
      return byName[name];
    }

    PUBS.forEach(function (pub) {
      var authors = pub.authors.map(nodeFor);
      authors.forEach(function (a) {
        a.n++;
        if (pub.topic) a.topics[pub.topic] = (a.topics[pub.topic] || 0) + 1;
      });
      for (var i = 0; i < authors.length; i++) {
        for (var j = i + 1; j < authors.length; j++) {
          var k = Math.min(authors[i].i, authors[j].i) + ':' + Math.max(authors[i].i, authors[j].i);
          if (!edgeMap[k]) edgeMap[k] = { a: authors[i], b: authors[j], w: 0 };
          edgeMap[k].w++;
        }
      }
    });

    var edges = Object.keys(edgeMap).map(function (k) { return edgeMap[k]; });
    nodes.forEach(function (d) {
      var best = null;
      Object.keys(d.topics).forEach(function (t) { if (!best || d.topics[t] > d.topics[best]) best = t; });
      d.hue = TOPIC_HUE[best] || 'var(--faint)';
      d.r = 5 + Math.sqrt(d.n) * 3.2;
      d.me = /^Meena/.test(d.name);
    });

    /* --- Simulation -------------------------------------------------------
       Fruchterman–Reingold. The ideal edge length k is derived from the area
       per node, so the graph fills whatever canvas it is given instead of
       needing a magic constant retuned for every screen width. Moves are
       capped by a temperature that cools each pass, which is what stops it
       oscillating. */
    var W = 0, H = 0, K = 1, LW = 0;

    function seed() {
      nodes.forEach(function (d, i) {
        var a = (i / nodes.length) * Math.PI * 2 + 0.6;
        d.x = W / 2 + Math.cos(a) * LW * 0.32 + (Math.random() - 0.5) * 20;
        d.y = H / 2 + Math.sin(a) * H * 0.34 + (Math.random() - 0.5) * 20;
      });
      var hub = nodes.filter(function (d) { return d.me; })[0];
      if (hub) { hub.x = W / 2; hub.y = H / 2; }
    }

    function tick(temp) {
      var i, j, a, b, dx, dy, dist, f;

      nodes.forEach(function (d) { d.dx = 0; d.dy = 0; });

      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          a = nodes[i]; b = nodes[j];
          dx = b.x - a.x; dy = b.y - a.y;
          dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          f = (K * K) / dist;                       /* repulsion */
          dx = (dx / dist) * f; dy = (dy / dist) * f;
          a.dx -= dx; a.dy -= dy; b.dx += dx; b.dy += dy;
        }
      }

      edges.forEach(function (e) {
        dx = e.b.x - e.a.x; dy = e.b.y - e.a.y;
        dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        f = ((dist * dist) / K) * (1 + Math.min(e.w, 5) * 0.22);   /* attraction */
        dx = (dx / dist) * f; dy = (dy / dist) * f;
        e.a.dx += dx; e.a.dy += dy; e.b.dx -= dx; e.b.dy -= dy;
      });

      /* The frame is much wider than it is tall, so gravity pulls harder
         vertically — otherwise the graph grows a tail off the top and bottom. */
      nodes.forEach(function (d) {
        d.dx += (W / 2 - d.x) * 0.09;
        d.dy += (H / 2 - d.y) * 0.30;

        var len = Math.sqrt(d.dx * d.dx + d.dy * d.dy) || 0.01;
        var move = Math.min(len, temp);
        d.x += (d.dx / len) * move;
        d.y += (d.dy / len) * move;

        var pad = d.r + 16;
        var left = (W - LW) / 2;
        d.x = Math.max(left + pad, Math.min(left + LW - pad, d.x));
        d.y = Math.max(pad + 6, Math.min(H - pad - 12, d.y));
      });
    }

    /* --- Render ---------------------------------------------------------- */
    var gEdge = document.createElementNS(NS, 'g');
    var gNode = document.createElementNS(NS, 'g');
    netSvg.appendChild(gEdge); netSvg.appendChild(gNode);

    var edgeEls = edges.map(function (e) {
      var l = document.createElementNS(NS, 'line');
      l.setAttribute('class', 'edge');
      l.setAttribute('stroke-width', String(Math.min(1 + e.w * 0.55, 4)));
      gEdge.appendChild(l);
      e.el = l;
      return l;
    });

    nodes.forEach(function (d) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'node' + (d.me ? ' me' : ''));
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', d.name + ', ' + d.n + (d.n === 1 ? ' paper' : ' papers'));
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', String(d.r));
      c.setAttribute('fill', d.hue);
      var t = document.createElementNS(NS, 'text');
      t.textContent = d.surname;
      g.appendChild(c); g.appendChild(t);
      gNode.appendChild(g);
      d.g = g; d.t = t;
    });

    function draw() {
      edges.forEach(function (e) {
        e.el.setAttribute('x1', e.a.x.toFixed(1)); e.el.setAttribute('y1', e.a.y.toFixed(1));
        e.el.setAttribute('x2', e.b.x.toFixed(1)); e.el.setAttribute('y2', e.b.y.toFixed(1));
      });
      nodes.forEach(function (d) {
        d.g.setAttribute('transform', 'translate(' + d.x.toFixed(1) + ',' + d.y.toFixed(1) + ')');
        d.t.setAttribute('y', String(d.r + 11));
      });
    }

    var raf = null;

    function layout(animate) {
      if (raf) cancelAnimationFrame(raf);
      W = Math.max(300, netBox.clientWidth);
      H = W < 620 ? 500 : 440;
      /* A 21-node graph stretched across a 1400 px panel would sit in a small
         clump with wide empty margins, so lay it out inside a centred band and
         let the panel keep its full width. */
      LW = Math.min(W, 1120);
      K = Math.sqrt((LW * H) / (nodes.length + 1)) * 1.02;
      netSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      netSvg.setAttribute('height', String(H));
      seed();

      var TOTAL = 200;
      var heat = function (i) { return Math.max(0.4, (W / 11) * Math.pow(1 - i / TOTAL, 1.6)); };

      if (!animate || still) {
        for (var i = 0; i < TOTAL; i++) tick(heat(i));
        draw();
        return;
      }

      netBox.classList.add('busy');
      var step = 0;
      (function frame() {
        var chunk = step < 60 ? 3 : 2;      /* untangle fast, then settle */
        for (var k = 0; k < chunk && step < TOTAL; k++, step++) tick(heat(step));
        draw();
        if (step < TOTAL) { raf = requestAnimationFrame(frame); }
        else { raf = null; netBox.classList.remove('busy'); }
      })();
    }

    /* --- Interaction ----------------------------------------------------- */
    function focus(d) {
      nodes.forEach(function (o) { o.g.classList.toggle('dim', !!d && o !== d && !linked(d, o)); });
      edges.forEach(function (e) { e.el.classList.toggle('lit', !!d && (e.a === d || e.b === d)); });
      if (!d) { tip.classList.remove('on'); return; }
      tip.innerHTML = '<b></b><span>' + d.n + (d.n === 1 ? ' paper' : ' papers') + ' together</span>';
      tip.querySelector('b').textContent = d.name;
      tip.style.left = d.x + 'px';
      tip.style.top = d.y - d.r + 'px';
      tip.classList.add('on');
    }

    function linked(a, b) {
      return edges.some(function (e) {
        return (e.a === a && e.b === b) || (e.a === b && e.b === a);
      });
    }

    nodes.forEach(function (d) {
      d.g.addEventListener('mouseenter', function () { focus(d); });
      d.g.addEventListener('focus', function () { focus(d); });
      d.g.addEventListener('mouseleave', function () { focus(null); });
      d.g.addEventListener('blur', function () { focus(null); });
      var go = function () {
        document.dispatchEvent(new CustomEvent('pubs:search', { detail: { term: d.surname } }));
        var sec = document.getElementById('publications');
        if (sec) sec.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
        say(d.n + (d.n === 1 ? ' paper' : ' papers') + ' with ' + d.name);
      };
      d.g.addEventListener('click', go);
      d.g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });

    if (reheat) reheat.addEventListener('click', function () { layout(true); });

    var sized = 0, resizeT = null;
    addEventListener('resize', function () {
      if (Math.abs(netBox.clientWidth - sized) < 40) return;
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { sized = netBox.clientWidth; layout(false); }, 180);
    }, { passive: true });

    /* Hold the animation until it is actually on screen. */
    if ('IntersectionObserver' in window) {
      var netObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting && en.boundingClientRect.top >= 0) return;
          sized = netBox.clientWidth;
          layout(!(en.boundingClientRect.top < 0));
          netObs.unobserve(en.target);
        });
      }, { threshold: 0.15 });
      netObs.observe(netBox);
    } else {
      sized = netBox.clientWidth;
      layout(false);
    }
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


  /* ---- Command palette ----------------------------------------------------
     ⌘K / Ctrl-K. Indexes every section, every publication, every project and
     a handful of actions. Scoring is a subsequence match with bonuses for
     word starts and for consecutive runs — the fzf idea, small enough to
     write out — so "nattr" finds "Not all travellers" in TRR.
     ------------------------------------------------------------------------ */

  var pal = $('#pal');
  if (pal) {
    var palQ = $('#pal-q'), palList = $('#pal-list'), palN = $('#pal-n'), palBt = $('#palbtn');
    var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    var palKey = $('#palkey');
    if (palKey && !mac) palKey.textContent = 'Ctrl K';

    var CV = 'cv/Kapil-Kumar-Meena-CV.pdf';
    var index = [];

    $$('#nav > a[href^="#"]').forEach(function (a) {
      index.push({ g: 'Sections', icon: '#i-arrow', t: a.textContent.replace(/^\d+/, '').trim(),
                   s: 'Jump to section', run: function () { location.hash = a.getAttribute('href'); } });
    });

    PUBS.forEach(function (pub) {
      index.push({
        g: 'Publications', icon: '#i-form', tag: pub.id,
        t: pub.title,
        s: pub.authors.join(', ') + ' · ' + pub.venue + ' · ' + pub.year,
        extra: pub.authors.join(' ') + ' ' + pub.venue + ' ' + pub.year + ' ' + pub.id,
        run: function () {
          document.dispatchEvent(new CustomEvent('pubs:search', {
            detail: { term: pub.title.split(/\s+/).slice(0, 6).join(' '), flash: true }
          }));
          var sec = document.getElementById('publications');
          if (sec) sec.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    $$('#software .work').forEach(function (w) {
      var h = w.querySelector('h3, h4');
      if (!h) return;
      /* .work is itself the anchor, so read the href off the card. */
      var href = w.getAttribute('href') || (w.querySelector('a[href]') || {}).href;
      var blurb = w.querySelector('p');
      index.push({ g: 'Software', icon: '#i-code', t: h.textContent.trim(),
                   s: blurb ? blurb.textContent.trim().split('. ')[0] : 'Open project',
                   extra: blurb ? blurb.textContent : '',
                   run: function () {
                     if (href) window.open(href, '_blank', 'noopener');
                     else location.hash = '#software';
                   } });
    });

    [
      ['Toggle light and dark', 'Theme', '#i-moon', function () { themeBtn.click(); }],
      ['Copy email address', 'kapilm.48@gmail.com', '#i-mail', function () { copy('kapilm.48@gmail.com', 'Email copied'); }],
      ['Download the CV', 'PDF, four pages', '#i-down', function () { window.open(CV, '_blank', 'noopener'); }],
      ['Export all ' + PUBS.length + ' entries as BibTeX', 'Downloads a .bib file', '#i-copy', function () {
        var all = PUBS.map(function (pub) { return bibtex(pub.bib); }).filter(Boolean);
        download('meena-publications.bib', all.join('\n\n') + '\n');
        say(all.length + ' entries downloaded');
      }],
      ['Google Scholar', 'External profile', '#i-out', function () { window.open('https://scholar.google.com/citations?user=5jIAPTEAAAAJ&hl=en', '_blank', 'noopener'); }],
      ['ORCID', '0000-0002-0271-0175', '#i-out', function () { window.open('https://orcid.org/0000-0002-0271-0175', '_blank', 'noopener'); }],
      ['GitHub', 'github.com/kapil2020', '#i-out', function () { window.open('https://github.com/kapil2020', '_blank', 'noopener'); }],
      ['LinkedIn', 'linkedin.com/in/kapilmeena', '#i-out', function () { window.open('https://www.linkedin.com/in/kapilmeena/', '_blank', 'noopener'); }]
    ].forEach(function (a) {
      index.push({ g: 'Actions', icon: a[2], t: a[0], s: a[1], run: a[3] });
    });

    /* Subsequence match. Returns a score and the matched positions, or null
       when a character of the query never turns up. */
    function fuzzy(text, needle) {
      var hay = text.toLowerCase();
      var n = hay.length, m = needle.length;
      var i = 0, j = 0, run = 0, score = 0, hits = [];
      while (i < n && j < m) {
        if (hay.charCodeAt(i) === needle.charCodeAt(j)) {
          var head = i === 0 || /[\s\-–—:,.\/(\[]/.test(hay.charAt(i - 1));
          score += 6 + (head ? 16 : 0) + run * 7;
          run++; hits.push(i); j++;
        } else {
          run = 0;
          score -= 1;
        }
        i++;
      }
      if (j < m) return null;
      score += Math.max(0, 24 - (hits[hits.length - 1] - hits[0] - m));  /* compactness */
      return { score: score, hits: hits };
    }

    function mark(text, hits) {
      var frag = document.createDocumentFragment();
      var at = 0;
      (hits || []).forEach(function (h) {
        if (h > at) frag.appendChild(document.createTextNode(text.slice(at, h)));
        var b = document.createElement('span');
        b.className = 'pal-hit';
        b.textContent = text.charAt(h);
        frag.appendChild(b);
        at = h + 1;
      });
      if (at < text.length) frag.appendChild(document.createTextNode(text.slice(at)));
      return frag;
    }

    var GROUPS = ['Sections', 'Publications', 'Software', 'Actions'];
    var results = [], cursor = 0;

    function search(term) {
      var q = term.trim().toLowerCase();
      if (!q) {
        return index.filter(function (it) { return it.g !== 'Publications'; })
          .concat(index.filter(function (it) { return it.g === 'Publications'; }).slice(0, 4))
          .map(function (it) { return { it: it, hits: null, score: 0 }; });
      }
      var out = [];
      index.forEach(function (it) {
        var best = fuzzy(it.t, q);
        var hits = best ? best.hits : null;
        var score = best ? best.score : -1e9;
        var alt = fuzzy(((it.s || '') + ' ' + (it.extra || '')), q);
        if (alt && alt.score - 24 > score) { score = alt.score - 24; hits = null; }
        if (score > -1e8) out.push({ it: it, hits: hits, score: score });
      });
      out.sort(function (a, b) {
        return b.score - a.score || GROUPS.indexOf(a.it.g) - GROUPS.indexOf(b.it.g);
      });
      /* Subsequence matching is generous: on a long author-and-venue string
         almost any short query finds *some* path through. Keep only what
         scores near the best, so the list stays worth reading. */
      var floor = out.length ? Math.max(14, out[0].score * 0.42) : 0;
      return out.filter(function (r) { return r.score >= floor; }).slice(0, 18);
    }

    function paintPal() {
      palList.innerHTML = '';
      cursor = 0;
      if (!results.length) {
        var e = document.createElement('p');
        e.className = 'pal-empty';
        e.textContent = 'Nothing matches that.';
        palList.appendChild(e);
        palN.textContent = '';
        return;
      }
      var seen = {};
      results.forEach(function (r, i) {
        if (!seen[r.it.g]) {
          seen[r.it.g] = 1;
          var h = document.createElement('p');
          h.className = 'pal-grp';
          h.textContent = r.it.g;
          palList.appendChild(h);
        }
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'pal-item' + (i === 0 ? ' on' : '');
        b.id = 'pal-o' + i;
        b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        b.innerHTML = '<svg class="pal-ic" aria-hidden="true"><use href="' + r.it.icon + '"></use></svg>' +
                      '<span class="pal-txt"><span class="pal-t"></span><span class="pal-s"></span></span>' +
                      (r.it.tag ? '<span class="pal-tag">' + r.it.tag + '</span>' : '');
        b.querySelector('.pal-t').appendChild(mark(r.it.t, r.hits));
        b.querySelector('.pal-s').textContent = r.it.s || '';
        b.addEventListener('click', function () { go(i); });
        b.addEventListener('mousemove', function () { move(i, true); });
        palList.appendChild(b);
      });
      palN.textContent = results.length + (results.length === 1 ? ' result' : ' results');
      palQ.setAttribute('aria-activedescendant', 'pal-o0');
    }

    function move(to, quiet) {
      var all = $$('.pal-item', palList);
      if (!all.length) return;
      cursor = (to + all.length) % all.length;
      all.forEach(function (el, i) {
        el.classList.toggle('on', i === cursor);
        el.setAttribute('aria-selected', i === cursor ? 'true' : 'false');
      });
      palQ.setAttribute('aria-activedescendant', 'pal-o' + cursor);
      if (!quiet) all[cursor].scrollIntoView({ block: 'nearest' });
    }

    function go(i) {
      var r = results[i === undefined ? cursor : i];
      if (!r) return;
      shutPal();
      /* Let the overlay clear before the page moves under it. */
      setTimeout(function () { r.it.run(); }, 20);
    }

    var palBack = null;

    function openPal() {
      if (!pal.hidden) return;
      palBack = document.activeElement;
      pal.hidden = false;
      document.body.style.overflow = 'hidden';
      palQ.value = '';
      results = search('');
      paintPal();
      palQ.focus();
    }

    function shutPal() {
      if (pal.hidden) return;
      pal.hidden = true;
      document.body.style.overflow = '';
      if (palBack && palBack.focus) palBack.focus();
    }

    if (palBt) palBt.addEventListener('click', openPal);

    palQ.addEventListener('input', function () {
      results = search(palQ.value);
      paintPal();
    });

    palQ.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(cursor + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(cursor - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); go(); }
      else if (e.key === 'Tab') { e.preventDefault(); move(cursor + (e.shiftKey ? -1 : 1)); }
    });

    pal.addEventListener('mousedown', function (e) { if (e.target === pal) shutPal(); });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        pal.hidden ? openPal() : shutPal();
        return;
      }
      if (e.key === 'Escape' && !pal.hidden) { e.preventDefault(); shutPal(); }
    });
  }

  /* ---- Misc --------------------------------------------------------------- */

  var yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  try {
    console.log(
      '%cDr. Kapil Kumar Meena%c\nPostdoctoral Researcher · HUMAN Lab · University of California, Los Angeles' +
      '\nkapilm.48@gmail.com' +
      '\n\nHand-built: no framework, no build step, no third-party request.' +
      '\nThe mode choice model, the co-author network and the palette all run here, in this file.' +
      '\nPress ' + (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl-K') + ' to search the site.',
      'font:600 16px/1.4 Georgia,serif;color:#c2255c',
      'font:12px/1.7 ui-monospace,monospace;color:#797b84'
    );
  } catch (e) {}
})();
