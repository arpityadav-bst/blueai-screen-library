/* The head's "More actions" menu (Appy, 2026-11-16): Copy report ID, out of
   the button row, where Download CSV and Download PDF sit since 2026-11-17.
   Its item keeps report.js's own handler (data-copy); this only opens and
   closes it. */
(function () {
  'use strict';

  var btn = document.getElementById('btn-more'), menu = document.getElementById('more-menu');
  if (!btn || !menu) { return; }

  function items() { return Array.prototype.filter.call(menu.querySelectorAll('[role="menuitem"]'), function (b) { return b.offsetParent; }); }
  function open() {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-on');
    var first = items()[0];
    if (first) { first.focus(); }
  }
  function close(refocus) {
    if (menu.hidden) { return; }
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('is-on');
    if (refocus) { btn.focus(); }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#btn-more')) { if (menu.hidden) { open(); } else { close(); } return; }
    // an item does its job (report.js), then the menu closes
    if (e.target.closest('#more-menu [role="menuitem"]')) { setTimeout(function () { close(); }, 600); return; }
    if (!e.target.closest('#more-menu')) { close(); }
  });
  document.addEventListener('keydown', function (e) {
    if (menu.hidden) { return; }
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var list = items(), at = list.indexOf(document.activeElement);
      if (!list.length) { return; }
      e.preventDefault();
      list[(at + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
    }
  });
  window.addEventListener('scroll', function () { close(); }, { passive: true });
})();
