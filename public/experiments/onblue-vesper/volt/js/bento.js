/* The features grid (css/bento.css), from the Volt homepage's bento.js with
   only the Creators tile kept: three videos from one brand go live on three
   creators' channels one after another (Posting, then Live, then the views
   climb), then it starts again. Runs only while the grid is on screen. */
(function () {
  'use strict';
  var OB = window.OB;
  var bt = document.querySelector('[data-bento]');
  if (!bt || !OB) { return; }

  var phones = Array.prototype.slice.call(bt.querySelectorAll('[data-ph]'));
  var timers = [], running = false;
  function later(fn, ms) { timers.push(window.setTimeout(fn, ms)); }
  function climb(el) {
    var to = +el.getAttribute('data-v'), t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / 1600), v = to * (1 - Math.pow(1 - k, 3));
      el.textContent = OB.short(v) + ' views';
      if (k < 1 && running) { window.requestAnimationFrame(step); }
    })(t0);
  }
  function cycle() {
    phones.forEach(function (p) { p.classList.remove('is-posting', 'is-live'); });
    [1, 0, 2].forEach(function (idx, n) {
      var p = phones[idx]; if (!p) { return; }
      later(function () { p.classList.add('is-posting'); }, 400 + n * 1500);
      later(function () { p.classList.remove('is-posting'); p.classList.add('is-live'); climb(p.querySelector('.bt-vw')); }, 1600 + n * 1500);
    });
    later(cycle, 9000);
  }
  function start() { if (running || !phones.length) { return; } running = true; cycle(); }
  function stop() { running = false; timers.forEach(window.clearTimeout); timers = []; }

  function inView(on) { bt.classList.toggle('is-in', on); if (on) { start(); } else { stop(); } }
  if (!('IntersectionObserver' in window)) { inView(true); return; }
  new IntersectionObserver(function (es) { inView(es[0].isIntersecting); }, { rootMargin: '-10% 0px' }).observe(bt);
})();
