/* The end of the page (Appy picked the footer finishes):
   - the closing moment: three tilted rows of our films (stills) drifting slowly
     behind the close, dimmed, under a volt rim of light; they only move while
     on screen
   - the footer wordmark rises into place the first time it is seen, and the
     volt follows the cursor across its halftone letters
   Transforms, opacity and one CSS variable; no filters or masks. */
(function () {
  'use strict';
  var OB = window.OB;

  var films = document.querySelector('[data-close-films]');
  if (films && OB) {
    var row = function (from, cls) {
      var tiles = '';
      for (var i = 0; i < 12; i++) { tiles += '<img src="' + OB.film(from + i * 2).poster + '" alt="" loading="lazy">'; }
      return '<div class="ob-close-row ' + cls + '">' + tiles + tiles + '</div>';
    };
    films.innerHTML = '<div class="ob-close-tilt">' + row(0, '') + row(5, 'ob-close-row--b') + row(11, '') + '</div>';
  }

  var mark = document.querySelector('[data-foot-mark]');
  var word = mark && mark.querySelector('.ob-foot-word');

  // TOUCH has no cursor to follow: once the word has risen, the volt light runs
  // across it once, left to right, then the word rests engraved as Appy chose
  function sweep() {
    if (!word || !window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
    window.setTimeout(function () {
      var t0 = performance.now();
      (function step(now) {
        var k = Math.min(1, (now - t0) / 1600), ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, r = word.getBoundingClientRect();
        word.style.setProperty('--mx', ((-0.2 + 1.4 * ease) * r.width) + 'px');
        word.style.setProperty('--my', (0.6 * r.height) + 'px');
        if (k < 1) { window.requestAnimationFrame(step); } else { word.style.setProperty('--mx', '-999px'); }
      })(t0);
    }, 1200);   // after the 1.2s rise
  }

  if ('IntersectionObserver' in window) {
    if (films) { new IntersectionObserver(function (es) { films.classList.toggle('is-in', es[0].isIntersecting); }).observe(films); }
    if (mark) {
      new IntersectionObserver(function (es, io) {
        if (es[0].isIntersecting) { mark.classList.add('is-up'); io.disconnect(); sweep(); }
      }, { threshold: 0.3 }).observe(mark);
    }
  } else {
    if (films) { films.classList.add('is-in'); }
    if (mark) { mark.classList.add('is-up'); }
  }

  // the volt light follows the cursor across the wordmark
  if (word && window.matchMedia('(hover: hover)').matches) {
    var queued = false, px = 0, py = 0;
    mark.addEventListener('pointermove', function (ev) {
      px = ev.clientX; py = ev.clientY;
      if (queued) { return; }
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        var r = word.getBoundingClientRect();
        word.style.setProperty('--mx', (px - r.left) + 'px');
        word.style.setProperty('--my', (py - r.top) + 'px');
      });
    }, { passive: true });
    mark.addEventListener('pointerleave', function () { word.style.setProperty('--mx', '-999px'); });
  }
})();
