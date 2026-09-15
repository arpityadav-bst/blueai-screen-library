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
