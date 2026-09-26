/* Kapil Kumar Meena — homepage.
   The page works without this file. It shows and hides BibTeX, and starts
   the drawings (thumbnails and software) when they scroll into view. */

(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-bib]');
    if (!btn) return;
    var pre = document.getElementById(btn.getAttribute('data-bib'));
    if (!pre) return;
    pre.hidden = !pre.hidden;
    btn.setAttribute('aria-expanded', String(!pre.hidden));
  });

  Array.prototype.forEach.call(document.querySelectorAll('button[data-bib]'), function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', btn.getAttribute('data-bib'));
  });

  // Drawings in the research thrusts, publications and software cards: each
  // traces itself in the first time its card scrolls into view. Touch
  // screens have no hover, so there a card's small loops run while it sits
  // in the middle of the screen. Skipped for reduced motion, where the
  // finished drawings simply show.
  var media = function (q) { return window.matchMedia && matchMedia(q).matches; };
  var cards = document.querySelectorAll('.m-card');
  if (cards.length && 'IntersectionObserver' in window && !media('(prefers-reduced-motion: reduce)')) {
    document.documentElement.classList.add('anim');
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-on'); seen.unobserve(e.target); }
      });
    }, { threshold: .35 });
    var live = media('(hover: none)') && new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-live', e.isIntersecting); });
    }, { rootMargin: '-30% 0px -30% 0px' });
    Array.prototype.forEach.call(cards, function (c) {
      seen.observe(c);
      if (live) live.observe(c);
    });
  }
})();
