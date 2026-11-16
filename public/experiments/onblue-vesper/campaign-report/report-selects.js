/* THE FILTER PILLS' OWN MENU (Appy, 2026-11-16): the browser's native list
   (blue highlight, square corners, system font) broke the look and cannot be
   styled. With a mouse, each .sel pill opens this menu instead; the choice is
   written back to his <select> and a change event fires, so report.js filters
   exactly as before. Touch screens keep the native picker, which is the
   better control there. Keyboard: Enter, Space or Down opens; arrows move;
   Enter picks; Esc and Tab close. */
(function () {
  'use strict';

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var menu = document.createElement('div');
  menu.className = 'sel-menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;
  document.body.appendChild(menu);
  var sel = null;

  function options() { return Array.prototype.slice.call(menu.querySelectorAll('[role="option"]')); }
  function place() {
    var r = sel.closest('.sel').getBoundingClientRect();
    menu.style.minWidth = r.width + 'px';
    menu.style.left = Math.max(8, Math.min(window.innerWidth - menu.offsetWidth - 8, r.left)) + 'px';
    var below = r.bottom + 6, h = menu.offsetHeight;
    menu.style.top = (below + h > window.innerHeight - 8 ? Math.max(8, r.top - 6 - h) : below) + 'px';
  }
  function open(s) {
    sel = s;
    menu.setAttribute('aria-label', s.getAttribute('aria-label') || '');
    menu.innerHTML = Array.prototype.map.call(s.options, function (o, k) {
      var on = o.value === s.value;
      return '<button type="button" role="option" data-k="' + k + '" aria-selected="' + on + '" tabindex="-1">' + o.textContent + '</button>';
    }).join('');
    menu.hidden = false;
    s.closest('.sel').classList.add('is-open');
    place();
    var cur = options().filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0] || options()[0];
    cur.focus();
  }
  function close(refocus) {
    if (menu.hidden) { return; }
    menu.hidden = true;
    sel.closest('.sel').classList.remove('is-open');
    if (refocus) { sel.focus(); }
  }
  function pick(k) {
    var s = sel;
    close(true);
    if (s.selectedIndex === k) { return; }
    s.selectedIndex = k;
    s.dispatchEvent(new Event('change', { bubbles: true }));
  }

  document.addEventListener('mousedown', function (e) {
    var s = e.target.closest && e.target.closest('.sel select');
    if (s && fine.matches) {
      e.preventDefault();
      if (!menu.hidden && sel === s) { close(true); } else { s.focus(); open(s); }
      return;
    }
    if (!menu.hidden && !e.target.closest('.sel-menu')) { close(); }
  });
  menu.addEventListener('click', function (e) {
    var b = e.target.closest('[role="option"]');
    if (b) { pick(+b.getAttribute('data-k')); }
  });
  document.addEventListener('keydown', function (e) {
    var s = e.target.closest && e.target.closest('.sel select');
    if (s && menu.hidden && fine.matches && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      open(s);
      return;
    }
    if (menu.hidden) { return; }
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    if (e.key === 'Tab') { close(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var list = options(), at = list.indexOf(document.activeElement);
      list[(at + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
    }
  });
  window.addEventListener('scroll', function () { close(); }, { passive: true, capture: true });
  window.addEventListener('resize', function () { close(); });
})();
