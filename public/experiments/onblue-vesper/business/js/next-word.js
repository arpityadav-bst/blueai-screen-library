/* The word "next" in the hero title (css/next-word.css): it flips fast through
   other looks (type, colour, ground), each cut a little longer than the last,
   and settles on the normal title. Plays when the title comes into view and
   again every few seconds while it stays there; never with reduced motion. */
(function () {
  'use strict';
  var el = document.querySelector('[data-next]');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  // 7 quiet looks plus the site's halftone; cuts start quick and ease out
  // a longer run (Appy: it stopped too soon): ~21 cuts over about 3.5s
  var LOOKS = 8, STEPS = [70, 70, 72, 75, 78, 82, 86, 92, 98, 106, 115, 126, 140, 156, 175, 198, 226, 260, 300, 350, 410];   // ms per cut, slowing down
  var timer = null, on = false, look = 0;

  // lock the word to its normal width so the line never jumps while it flips
  function lock() { el.style.width = ''; el.style.width = el.getBoundingClientRect().width + 'px'; }

  function play() {
    var n = 0;
    (function step() {
      if (!on) { settle(); return; }
      if (n === STEPS.length) { settle(); timer = window.setTimeout(play, 5200); return; }
      look = (look + 1 + Math.floor(n * 7 % 3)) % LOOKS;   // never the same look twice in a row
      el.className = look === 7 ? 'ob-next ob-tone' : 'ob-next nx-' + (look + 1);
      timer = window.setTimeout(step, STEPS[n++]);
    })();
  }
  function settle() { el.className = 'ob-next'; }

  function begin() { lock(); window.clearTimeout(timer); play(); }
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () {
    lock();
    window.addEventListener('resize', function () { settle(); lock(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        on = es[0].isIntersecting;
        if (on) { begin(); } else { window.clearTimeout(timer); timer = null; settle(); }
      }).observe(el);
    } else { on = true; begin(); }
  });
})();
