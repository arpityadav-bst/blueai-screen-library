/* ==========================================================================
   onBlue: the two bits of chrome that cannot be done in CSS alone.

   1. THE SCROLLBAR fades in while the page is moving and back out when it
      stops. Its appearance and the reserved gutter are in onblue.css; there is
      simply no CSS state for "is being scrolled", so the class comes from here.

   2. THE TRAVELLING STROKE needs the pointer's position inside the element it
      is lighting, which CSS cannot read. Everything about how that light looks
      is in onblue.css, on .card; this writes the two numbers it reads.

   Both are page chrome, both are needed by every page that has surfaces, and
   both were previously written inside one page's script. Loaded by all of
   them, so each behaviour exists once.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var idle = 0;

  /* 700ms after the last scroll event, not on a scrollend listener: that event
     is still missing from Safari, and a timer degrades to "fades slightly late"
     rather than "never fades". */
  function moving() {
    root.classList.add('is-scrolling');
    window.clearTimeout(idle);
    idle = window.setTimeout(function () {
      root.classList.remove('is-scrolling');
    }, 700);
  }

  window.addEventListener('scroll', moving, { passive: true });

  /* the thumb also has to be there when someone is reaching for it, or the
     control disappears exactly as the pointer arrives */
  window.addEventListener('pointerdown', function (e) {
    if (e.clientX > root.clientWidth) { moving(); }
  }, { passive: true });

  /* ---- the sheets ---------------------------------------------------------
     ONE OPENER FOR EVERY <dialog class="sheet"> ON EVERY PAGE. This lived inside
     the application, which was fine while the application was the only page that
     had one; the brands page then grew a pricing comparison, wired it the same
     way in markup, and nothing happened, because the code that listens for
     data-sheet was in a file it does not load. A behaviour two pages declare in
     markup has to live where both of them can reach it.
     THE CLASS THAT FADES THEM IN is added a frame after showModal(), so the
     dialog exists to transition FROM something rather than appearing already
     arrived. */
  (function sheets() {
    var open = null;
    function close() {
      if (!open) { return; }
      var d = open;
      open = null;
      d.classList.remove('is-open');
      window.setTimeout(function () { if (d.open) { d.close(); } }, 220);
    }
    document.addEventListener('click', function (e) {
      var go = e.target.closest ? e.target.closest('[data-sheet]') : null;
      if (go) {
        var d = document.getElementById('sheet-' + go.getAttribute('data-sheet'));
        if (d && typeof d.showModal === 'function') {
          open = d;
          d.showModal();
          requestAnimationFrame(function () { d.classList.add('is-open'); });
        }
        return;
      }
      if (e.target.closest && e.target.closest('[data-sheet-close]')) { close(); }
    });
    /* Escape is the dialog's own, so it is intercepted rather than reimplemented:
       letting it close natively would skip the fade and snap the panel away */
    document.addEventListener('cancel', function (e) {
      if (e.target.classList.contains('sheet')) { e.preventDefault(); close(); }
    });
    window.onblueSheetClose = close;
  })();

  /* ---- the travelling stroke ---------------------------------------------
     ONE LISTENER FOR THE WHOLE DOCUMENT, and one style write per frame. A
     handler per surface would be dozens of them on a page of cards, all firing
     on the same move; closest() walks up from whatever is under the pointer and
     finds the one that is actually being lit. */
  var LIT = '.card';
  var lit = null, lx = 0, ly = 0, queued = false;

  function paint() {
    queued = false;
    if (!lit) { return; }
    lit.style.setProperty('--gx', lx + 'px');
    lit.style.setProperty('--gy', ly + 'px');
  }

  document.addEventListener('mousemove', function (e) {
    var el = e.target && e.target.closest ? e.target.closest(LIT) : null;
    if (!el) { lit = null; return; }
    var box = el.getBoundingClientRect();
    lit = el;
    lx = e.clientX - box.left;
    ly = e.clientY - box.top;
    if (!queued) { queued = true; requestAnimationFrame(paint); }
  }, { passive: true });
})();
