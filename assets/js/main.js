/* Kapil Kumar Meena — homepage.
   The page works without this file. It shows and hides BibTeX, and starts
   the software drawings when their cards scroll into view. */

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

  // Software cards: each drawing traces itself in the first time its card
  // scrolls into view. Skipped for reduced motion, where the finished
  // drawing simply shows.
  var apps = document.querySelector('.apps');
  if (apps && 'IntersectionObserver' in window &&
      !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    apps.classList.add('anim');
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-on'); seen.unobserve(e.target); }
      });
    }, { threshold: .35 });
    Array.prototype.forEach.call(apps.querySelectorAll('.app'), function (a) { seen.observe(a); });
  }
})();
