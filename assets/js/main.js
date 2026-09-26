/* Kapil Kumar Meena — homepage.
   The page works without this file; it only shows and hides BibTeX. */

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
})();
