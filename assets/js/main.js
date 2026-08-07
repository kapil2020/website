/* ==========================================================================
   Kapil Kumar Meena, Ph.D. — site behaviour
   Vanilla JS, no dependencies. Leaflet is loaded lazily, only if the
   footprint map scrolls into view.
   ========================================================================== */

(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* Theme                                                               */
  /* ------------------------------------------------------------------ */

  var themeToggle = $('#theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* Follow the OS only while the visitor has not made an explicit choice. */
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onSchemeChange = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) {}
    if (!stored) applyTheme(e.matches ? 'dark' : 'light');
  };
  if (mq.addEventListener) mq.addEventListener('change', onSchemeChange);
  else if (mq.addListener) mq.addListener(onSchemeChange);

  applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

  /* ------------------------------------------------------------------ */
  /* Header: stuck state, progress bar, mobile nav, scroll spy           */
  /* ------------------------------------------------------------------ */

  var header    = $('#site-header');
  var progress  = $('#progress-bar');
  var navToggle = $('#nav-toggle');
  var nav       = $('#primary-nav');
  var toTop     = $('#to-top');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navToggle.innerHTML = '<svg aria-hidden="true"><use href="#i-menu"></use></svg>';
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      navToggle.innerHTML = open
        ? '<svg aria-hidden="true"><use href="#i-close"></use></svg>'
        : '<svg aria-hidden="true"><use href="#i-menu"></use></svg>';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) closeNav();
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y     = window.scrollY || document.documentElement.scrollTop;
      var doc   = document.documentElement;
      var total = doc.scrollHeight - doc.clientHeight;

      if (header) header.classList.toggle('is-stuck', y > 8);
      if (progress) progress.style.width = (total > 0 ? Math.min(100, (y / total) * 100) : 0) + '%';
      if (toTop) toTop.classList.toggle('is-shown', y > 700);

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* Scroll spy — highlight the section currently in the upper viewport. */
  var navLinks = $$('#primary-nav a[href^="#"]');
  var spyTargets = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if (spyTargets.length && 'IntersectionObserver' in window) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var bestId = null, best = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > best) { best = visible[id]; bestId = id; }
      });
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', bestId !== null && a.getAttribute('href') === '#' + bestId);
      });
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.4, 0.75] });
    spyTargets.forEach(function (el) { spy.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                       */
  /* ------------------------------------------------------------------ */

  var revealables = $$('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealables.forEach(function (el) { revealer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------------ */
  /* Animated metric counters                                            */
  /* ------------------------------------------------------------------ */

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = target + suffix; return; }

    var duration = 1100;
    var start = null;
    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Toast + clipboard                                                   */
  /* ------------------------------------------------------------------ */

  var toastEl = $('#toast');
  var toastText = $('#toast-text');
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastText.textContent = message;
    toastEl.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-shown'); }, 2400);
  }

  function copyText(text, message) {
    var done = function () { toast(message || 'Copied to clipboard'); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Could not copy — please copy manually'); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    e.preventDefault();
    copyText(btn.getAttribute('data-copy'), btn.getAttribute('data-copy-message'));
  });

  /* ------------------------------------------------------------------ */
  /* BibTeX                                                              */
  /* ------------------------------------------------------------------ */

  function citeKey(authors, year, title) {
    var surname = (authors.split(' and ')[0] || 'meena').split(',')[0];
    surname = surname.replace(/[^A-Za-z]/g, '').toLowerCase() || 'meena';
    var word = (title.split(/\s+/).find(function (w) { return w.replace(/[^A-Za-z]/g, '').length > 3; }) || 'paper');
    return surname + (year || '') + word.replace(/[^A-Za-z]/g, '').toLowerCase();
  }

  function buildBibtex(d) {
    var entry = d.type || 'article';
    var venueKey = entry === 'article' ? 'journal' : (entry === 'inproceedings' ? 'booktitle' : 'howpublished');
    var pad = function (k) { return (k + '        ').slice(0, 12); };

    var fields = [];
    fields.push([pad('title'), '{' + d.title + '}']);
    fields.push([pad('author'), '{' + d.authors + '}']);
    if (d.venue)  fields.push([pad(venueKey), '{' + d.venue + '}']);
    if (d.volume) fields.push([pad('volume'), '{' + d.volume + '}']);
    if (d.year)   fields.push([pad('year'), '{' + d.year + '}']);
    if (d.doi)    fields.push([pad('doi'), '{' + d.doi + '}']);
    if (d.note)   fields.push([pad('note'), '{' + d.note + '}']);

    var lines = ['@' + entry + '{' + citeKey(d.authors, d.year, d.title) + ','];
    fields.forEach(function (f, i) {
      lines.push('  ' + f[0] + ' = ' + f[1] + (i === fields.length - 1 ? '' : ','));
    });
    lines.push('}');
    return lines.join('\n');
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-bib-title]');
    if (!btn) return;
    e.preventDefault();
    copyText(buildBibtex({
      type:    btn.getAttribute('data-bib-type'),
      title:   btn.getAttribute('data-bib-title'),
      authors: btn.getAttribute('data-bib-authors'),
      venue:   btn.getAttribute('data-bib-venue'),
      volume:  btn.getAttribute('data-bib-volume'),
      year:    btn.getAttribute('data-bib-year'),
      doi:     btn.getAttribute('data-bib-doi'),
      note:    btn.getAttribute('data-bib-note')
    }), 'BibTeX entry copied');
  });

  /* ------------------------------------------------------------------ */
  /* Publications: filter + search                                       */
  /* ------------------------------------------------------------------ */

  var pubs      = $$('#pub-list .pub');
  var filters   = $$('.filter');
  var searchBox = $('#pub-search');
  var emptyEl   = $('#pub-empty');
  var showingEl = $('#pub-showing');
  var activeFilter = 'all';

  pubs.forEach(function (pub) {
    pub.dataset.haystack = pub.textContent.replace(/\s+/g, ' ').toLowerCase();
  });

  function applyPubFilters() {
    var q = (searchBox ? searchBox.value : '').trim().toLowerCase();
    var shown = 0;

    pubs.forEach(function (pub) {
      var typeOk = activeFilter === 'all' || pub.getAttribute('data-type') === activeFilter;
      var textOk = !q || pub.dataset.haystack.indexOf(q) !== -1;
      var visible = typeOk && textOk;
      pub.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });

    if (emptyEl) emptyEl.classList.toggle('is-shown', shown === 0);
    if (showingEl) {
      if (shown === pubs.length) {
        showingEl.textContent = 'Showing all ' + pubs.length + ' entries.';
      } else {
        showingEl.textContent = 'Showing ' + shown + ' of ' + pubs.length + ' entries.';
      }
    }
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeFilter = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      applyPubFilters();
    });
  });

  if (searchBox) {
    var searchTimer = null;
    searchBox.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(applyPubFilters, 110);
    });
    /* "/" focuses search, Escape clears it. */
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== searchBox &&
          !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        e.preventDefault();
        searchBox.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchBox) {
        searchBox.value = '';
        applyPubFilters();
        searchBox.blur();
      }
    });
  }

  if (pubs.length) applyPubFilters();

  /* ------------------------------------------------------------------ */
  /* Lightbox                                                            */
  /* ------------------------------------------------------------------ */

  var lightbox = $('#lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lastFocus = null;

    var openLightbox = function (src, alt) {
      lastFocus = document.activeElement;
      lbImg.src = src;
      lbImg.alt = alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.close').focus();
    };
    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      lbImg.src = '';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-lightbox]');
      if (trigger) {
        var img = trigger.querySelector('img');
        openLightbox(trigger.getAttribute('data-lightbox'), img ? img.alt : '');
        return;
      }
      if (e.target.closest('#lightbox')) {
        if (e.target === lbImg) return;
        closeLightbox();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Footprint map — Leaflet, loaded only when the section is reached    */
  /* ------------------------------------------------------------------ */

  var PLACES = [
    { name: 'Los Angeles, USA',     lat:  34.0689, lng: -118.4452, kind: 'base', event: 'UCLA — HUMAN Lab' },
    { name: 'Washington D.C., USA', lat:  38.9072, lng:  -77.0369, kind: 'intl', event: 'TRB 2026 Annual Meeting' },
    { name: 'Nashville, USA',       lat:  36.1627, lng:  -86.7816, kind: 'intl', event: 'UAA 2024' },
    { name: 'Montréal, Canada',     lat:  45.5017, lng:  -73.5673, kind: 'intl', event: 'WCTR 2023' },
    { name: 'Leeds, UK',            lat:  53.8067, lng:   -1.5550, kind: 'intl', event: 'Research exchange grant' },
    { name: 'Vienna, Austria',      lat:  48.2082, lng:   16.3738, kind: 'intl', event: 'IATBR 2024' },
    { name: 'Jakarta, Indonesia',   lat:  -6.2088, lng:  106.8456, kind: 'intl', event: 'EASTS 2025' },
    { name: 'Kharagpur, India',     lat:  22.3149, lng:   87.3105, kind: 'home', event: 'Ph.D. — IIT Kharagpur' },
    { name: 'Roorkee, India',       lat:  29.8543, lng:   77.8880, kind: 'home', event: 'M.Tech — IIT Roorkee' },
    { name: 'Kota, India',          lat:  25.2138, lng:   75.8648, kind: 'home', event: 'B.Tech' },
    { name: 'Surat, India',         lat:  21.1702, lng:   72.8311, kind: 'home', event: 'CTRG 2023' },
    { name: 'Bengaluru, India',     lat:  12.9716, lng:   77.5946, kind: 'home', event: 'CyPhySS' }
  ];

  var COLOURS = { base: '#e0533d', intl: '#1f5eb3', home: '#1d6b45' };

  var mapEl = $('#map');
  var mapFallback = $('#map-fallback');
  var mapState = { loaded: false, map: null, tiles: null };

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function loadStyles(href) {
    return new Promise(function (resolve) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.onload = resolve;
      l.onerror = resolve;
      document.head.appendChild(l);
    });
  }

  function tileUrl() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
  }

  function buildMap() {
    if (!window.L || !mapEl) return;

    var map = L.map(mapEl, {
      center: [26, -20],
      zoom: 2,
      minZoom: 1,
      maxZoom: 6,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
      worldCopyJump: true
    });
    mapState.map = map;

    mapState.tiles = L.tileLayer(tileUrl(), { subdomains: 'abcd', maxZoom: 6 }).addTo(map);

    var base = PLACES[0];
    PLACES.forEach(function (p) {
      var colour = COLOURS[p.kind];
      var size = p.kind === 'base' ? 13 : 10;
      var icon = L.divIcon({
        className: '',
        html: '<span class="map-dot" style="display:block;width:' + size + 'px;height:' + size + 'px;background:' + colour + '"></span>',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2 - 2]
      });
      var marker = L.marker([p.lat, p.lng], { icon: icon, title: p.name }).addTo(map);
      marker.bindPopup(
        '<div class="pt">' + p.name + '</div><div class="pe">' + p.event + '</div>',
        { closeButton: false, offset: [0, 0] }
      );
      marker.on('mouseover', function () { this.openPopup(); });

      if (p !== base) {
        L.polyline([[base.lat, base.lng], [p.lat, p.lng]], {
          color: colour, weight: 1, opacity: 0.28, dashArray: '3 5'
        }).addTo(map);
      }
    });

    /* Re-tile when the theme flips. */
    document.addEventListener('themechange', function () {
      if (mapState.tiles) mapState.tiles.setUrl(tileUrl());
    });

    if (mapFallback) mapFallback.remove();
    setTimeout(function () { map.invalidateSize(); }, 120);
  }

  function initMap() {
    if (mapState.loaded || !mapEl) return;
    mapState.loaded = true;

    loadStyles('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
      .then(function () { return loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'); })
      .then(buildMap)
      .catch(function () {
        /* No map, no empty box — the venue list below carries the content. */
        var shell = mapEl.closest('.map-shell');
        if (shell) shell.hidden = true;
      });
  }

  if (mapEl && 'IntersectionObserver' in window) {
    var mapObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        mapObserver.disconnect();
        initMap();
      });
    }, { rootMargin: '250px' });
    mapObserver.observe(mapEl);
  } else if (mapEl) {
    initMap();
  }

  /* ------------------------------------------------------------------ */
  /* Misc                                                                */
  /* ------------------------------------------------------------------ */

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* A quiet note for anyone who opens the console. */
  try {
    console.log(
      '%cKapil Kumar Meena, Ph.D.%c\nPostdoctoral Researcher · HUMAN Lab · UCLA\nkapil.meena@kgpian.iitkgp.ac.in',
      'font:600 15px/1.4 Georgia,serif;color:#1f5eb3',
      'font:12px/1.6 ui-monospace,monospace;color:#6b7382'
    );
  } catch (e) {}
})();
