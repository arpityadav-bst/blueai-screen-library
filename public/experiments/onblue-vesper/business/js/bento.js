/* The bento's behaviour. Loops only run while the grid is on screen.
   - Radar: real tabs; picking a rival swaps its six Shorts in.
   - Creators: the same Short goes live on three creators' channels one after
     another (Posting, then Live, then its views climb), then starts again. */
(function () {
  'use strict';
  var OB = window.OB;
  var bt = document.querySelector('[data-bento]');
  if (!bt || !OB) { return; }

  // ---- Radar --------------------------------------------------------------
  var RIVALS = [
    ['Crumb & Co', [6, 9, 13, 10, 3, 15], ['1.2M', '640K', '410K', '220K', '180K', '96K']],
    ['Daily Grind', [0, 12, 7, 18, 4, 16], ['880K', '510K', '330K', '260K', '140K', '72K']],
    ['Corner Table', [2, 14, 5, 19, 11, 8], ['1.6M', '720K', '450K', '300K', '210K', '120K']],
    ['Brew Theory', [17, 1, 21, 6, 23, 13], ['540K', '390K', '280K', '190K', '110K', '64K']]
  ];
  var tabs = bt.querySelector('[data-tabs]'), grid = bt.querySelector('[data-shorts]');
  function shorts(k) {
    var r = RIVALS[k];
    grid.innerHTML = r[1].map(function (f, i) {
      return '<div class="bt-short" style="--i:' + i + '"><span class="bt-thumb"><img src="' + OB.film(f).poster + '" alt=""><b>Remix for you</b></span><em>' + r[2][i] + ' views</em></div>';
    }).join('');
  }
  if (tabs && grid) {
    tabs.innerHTML = RIVALS.map(function (r, i) {
      return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-rival="' + i + '">' + OB.esc(r[0]) + '</button>';
    }).join('');
    shorts(0);
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rival]');
      if (!b || b.getAttribute('aria-selected') === 'true') { return; }
      tabs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      grid.classList.add('is-swap');
      window.setTimeout(function () { shorts(+b.getAttribute('data-rival')); grid.classList.remove('is-swap'); }, 200);
    });
  }

  // ---- Creators: going live, one channel after another ----------------------
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
