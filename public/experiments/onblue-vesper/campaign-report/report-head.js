/* The head's two menus (Appy, 2026-11-16 and 2026-11-17): Download (Posts
   list as CSV, Full report as PDF) and More actions (Copy report ID). Each
   .rep-more holds a button and its menu. The items keep report.js's own
   handlers (#btn-csv, #btn-pdf, data-copy); this only opens and closes them. */
(function () {
  'use strict';

  var pairs = Array.prototype.map.call(document.querySelectorAll('.rep-head .rep-more'), function (w) {
    return { btn: w.querySelector('[aria-haspopup="menu"]'), menu: w.querySelector('[role="menu"]') };
  }).filter(function (p) { return p.btn && p.menu; });
  if (!pairs.length) { return; }

  function items(p) { return Array.prototype.filter.call(p.menu.querySelectorAll('[role="menuitem"]'), function (b) { return b.offsetParent; }); }
  function open(p) {
    pairs.forEach(function (q) { if (q !== p) { close(q); } });
    p.menu.hidden = false;
    p.btn.setAttribute('aria-expanded', 'true');
    p.btn.classList.add('is-on');
    var first = items(p)[0];
    if (first) { first.focus(); }
  }
  function close(p, refocus) {
    if (p.menu.hidden) { return; }
    p.menu.hidden = true;
    p.btn.setAttribute('aria-expanded', 'false');
    p.btn.classList.remove('is-on');
    if (refocus) { p.btn.focus(); }
  }
  function openOne() { return pairs.filter(function (p) { return !p.menu.hidden; })[0]; }

  document.addEventListener('click', function (e) {
    pairs.forEach(function (p) {
      if (p.btn.contains(e.target)) { if (p.menu.hidden) { open(p); } else { close(p); } return; }
      // an item does its job (report.js), then its menu closes
      if (p.menu.contains(e.target)) {
        if (e.target.closest('[role="menuitem"]')) { setTimeout(function () { close(p); }, 600); }
        return;
      }
      close(p);
    });
  });
  document.addEventListener('keydown', function (e) {
    var p = openOne();
    if (!p) { return; }
    if (e.key === 'Escape') { e.preventDefault(); close(p, true); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var list = items(p), at = list.indexOf(document.activeElement);
      if (!list.length) { return; }
      e.preventDefault();
      list[(at + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
    }
  });
  window.addEventListener('scroll', function () { pairs.forEach(function (p) { close(p); }); }, { passive: true });
})();
