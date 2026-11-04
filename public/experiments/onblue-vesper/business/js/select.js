/* THE PRODUCT'S DROPDOWN (Appy: the browser's own select menus looked cheap
   next to the site). Every <select> on a product page is upgraded to a quiet
   text button and a white menu card (css/product.css .ob-sel). The real
   select stays in the page, hidden, and still fires "change", so the page's
   own code does not change. Works with the mouse and the keyboard (arrows,
   Enter, Escape). Selects drawn later (a page re-render) are picked up too. */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.2 4L19 7"/></svg>';
  var openOne = null;

  function enhance(sel) {
    sel.setAttribute('data-enh', '');
    var wrap = document.createElement('span'), btn = document.createElement('button'), menu = document.createElement('ul');
    wrap.className = 'ob-sel'; sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel); sel.classList.add('ob-sel-native'); sel.tabIndex = -1;
    btn.type = 'button'; btn.className = 'ob-sel-btn'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    menu.className = 'ob-sel-menu'; menu.setAttribute('role', 'listbox');
    wrap.appendChild(btn); wrap.appendChild(menu);
    var active = 0;

    function opts() { return Array.prototype.filter.call(sel.options, function (o) { return o.value !== '' || o.selected; }); }
    function label() { var o = sel.options[sel.selectedIndex]; btn.innerHTML = '<span>' + esc(o ? o.text : '') + '</span>' + CHEV; btn.classList.toggle('is-empty', !o || o.value === ''); }
    function draw() {
      menu.innerHTML = opts().map(function (o, i) {
        return '<li role="option" data-i="' + o.index + '" aria-selected="' + o.selected + '"' + (i === active ? ' class="is-active"' : '') + '><i>' + (o.selected ? TICK : '') + '</i>' + esc(o.text) + '</li>';
      }).join('');
    }
    function place() {   // fixed to the screen, so no card's overflow can clip it
      var r = btn.getBoundingClientRect(), h = menu.offsetHeight, below = window.innerHeight - r.bottom;
      menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - menu.offsetWidth - 8)) + 'px';
      menu.style.top = (below < h + 16 && r.top > h + 16 ? r.top - h - 6 : r.bottom + 6) + 'px';
    }
    function open() {
      if (openOne && openOne !== close) { openOne(); }
      active = Math.max(0, opts().indexOf(sel.options[sel.selectedIndex]));
      draw(); wrap.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); place(); openOne = close;
    }
    function close() { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); if (openOne === close) { openOne = null; } }
    function pick(index) {
      if (sel.selectedIndex !== index) { sel.selectedIndex = index; sel.dispatchEvent(new Event('change', { bubbles: true })); }
      label(); close(); btn.focus();
    }
    btn.addEventListener('click', function () { if (wrap.classList.contains('is-open')) { close(); } else { open(); } });
    menu.addEventListener('click', function (ev) { var li = ev.target.closest('[data-i]'); if (li) { pick(+li.getAttribute('data-i')); } });
    menu.addEventListener('mousemove', function (ev) {
      var li = ev.target.closest('[data-i]'); if (!li) { return; }
      var n = Array.prototype.indexOf.call(menu.children, li); if (n !== active) { active = n; draw(); }
    });
    btn.addEventListener('keydown', function (ev) {
      var list = opts(), isOpen = wrap.classList.contains('is-open');
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        ev.preventDefault(); if (!isOpen) { open(); return; }
        active = (active + (ev.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length; draw();
      } else if ((ev.key === 'Enter' || ev.key === ' ') && isOpen) { ev.preventDefault(); pick(list[active].index); }
      else if (ev.key === 'Escape' && isOpen) { ev.preventDefault(); close(); }
    });
    label();
  }

  document.addEventListener('click', function (ev) { if (openOne && !ev.target.closest('.ob-sel')) { openOne(); } });
  window.addEventListener('resize', function () { if (openOne) { openOne(); } });
  window.addEventListener('scroll', function () { if (openOne) { openOne(); } }, { passive: true, capture: true });

  function scan(root) { Array.prototype.forEach.call((root || document).querySelectorAll('select:not([data-enh])'), enhance); }
  scan();
  new MutationObserver(function () { scan(); }).observe(document.body, { childList: true, subtree: true });
})();
