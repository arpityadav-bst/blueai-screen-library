/* How it works (volt/css/journey.css), the Volt homepage's journey cut to the
   PM's three steps. The titles scroll by on the left; the stage on the right
   stays pinned and plays whichever step sits in the middle of the screen.
   1. Learns about your brand: the brand card, Sells / Buyers / Category beside it
   2. Makes your videos that win: your first videos being made, then one plays
   3. Creators post them: the channels go Live, then the views so far take the
      phone (is-then) and keep climbing while you stay
   A sample brand (illustrative). JS sets the step; CSS moves things with
   transforms and opacity only. Needs OB (ob.js) with films registered. */
(function () {
  'use strict';
  var OB = window.OB;
  var sec = document.querySelector('[data-journey]');
  if (!sec || !OB || !OB.FILMS.length) { return; }
  var e = OB.esc;
  var stage = sec.querySelector('[data-oj-stage]'), box = sec.querySelector('[data-oj-box]'), stepsEl = sec.querySelector('[data-oj-steps]');
  var side = sec.querySelector('.oj-side'), pinTop = 0;
  // the scene: W x H design pixels, scaled to fit. The phone is 296 wide drawn
  // at 1.15x, so its edge sits PH from the centre; every card's inner edge sits
  // GAP beyond that, so each wire runs phone edge to card edge
  var W = 1010, H = 760, PH = 170, GAP = 44;
  var AV = 'volt/img/avatars/creator-';
  var CREATORS = [['@mia.makes', '210K'], ['@dan.daily', '88K'], ['@thefoodlab', '1.2M'], ['@kai.reviews', '45K'], ['@sam.cooks', '310K'], ['@lena.loops', '67K'], ['@raj.tries', '150K'], ['@tess.tech', '92K']];
  var B = {
    name: 'Northline Coffee', initial: 'N', sell: 'Fresh food and drinks, made to order', buyers: 'Locals and office crowds, 22 to 40',
    category: 'Food and drink', voice: 'Warm, playful, a little cheeky', pal: ['#6b3e26', '#d9a066', '#f3e3c3', '#2f5d50'],
    videos: [['Deal reveal', 'Your 5 pm reward is two streets away'], ['Photoreal story', 'Watch it get made, start to plate'], ['Animated story', 'The spot locals keep quiet about']]
  };
  var STEPS = [['Learns about ', 'your brand', '.'], ['Makes your videos ', 'that win', '.'], ['Creators post them, and ', 'the views roll in', '.']];

  // a side (-1 left, 1 right), a y and the card's width give its centre; the wire ends on the card's inner edge
  function spots(list, w) { return list.map(function (p) { return { x: p[0] * (PH + GAP + w / 2), y: p[1], edge: p[0] * (PH + GAP), s: p[0] }; }); }
  function at(list, i) { return '--x:' + list[i].x + 'px;--y:' + list[i].y + 'px'; }
  // THE PHONE SCENE (700 and below): a 350 x 400 portrait, the phone left of
  // centre and at most two cards beside it, each at this second spot (--px / --py)
  var PW = 350, PHH = 400, PC = [[86, -56], [86, 62]];
  // step 1's three facts stack beside the phone (PM: Sells, Buyers and Category all stay)
  var PF = [[86, -118], [86, 0], [86, 118]];
  function ph(i, list) { list = list || PC; var p = list[Math.min(i, list.length - 1)]; return ';--px:' + p[0] + 'px;--py:' + p[1] + 'px'; }
  function ava(i) { return i < 5 ? '<img src="' + AV + (i + 1) + '.jpg" alt="">' : '<i style="background:' + B.pal[i % 4] + '">' + CREATORS[i][0].charAt(1).toUpperCase() + '</i>'; }

  function build() {
    var h = OB.hash(B.name), vids = B.videos.map(function (v, i) { return OB.film(OB.filmFor(v[0], h + i * 7)); }), made = vids[0];
    stepsEl.innerHTML = STEPS.map(function (t, i) {
      return '<div class="oj-step" data-i="' + i + '"><div><h3>' + e(t[0]) + '<span class="ob-tone">' + e(t[1]) + '</span>' + e(t[2]) + '</h3></div></div>';
    }).join('');

    // step 1: what was read, three cards (card widths match volt/css/journey.css)
    var FACTS = spots([[-1, -190], [1, -70], [-1, 150]], 260);
    var facts = [['Sells', B.sell, 'brand'], ['Buyers', B.buyers, 'users'], ['Category', B.category, 'studio']].map(function (f, i) {
      return '<div class="oj-fact" style="' + at(FACTS, i) + ph(i, PF) + ';--d:' + (120 + i * 90) + 'ms;--b:' + (i * 0.7) + 's"><i>' + OB.icon(f[2], 18) + '</i><span><small>' + f[0] + '</small><b>' + e(f[1]) + '</b></span></div>';
    }).join('');
    // step 3: a network of creators, four each side, lighting up Live in turn
    var NODES = spots([[-1, -225], [-1, -75], [-1, 75], [-1, 225], [1, -225], [1, -75], [1, 75], [1, 225]], 200);
    var nodes = NODES.map(function (p, i) {
      return '<div class="oj-node" style="' + at(NODES, i) + ph(i) + ';--d:' + (100 + i * 110) + 'ms"><span class="oj-av">' + ava(i) + '</span><span><b>' + CREATORS[i][0] + '</b><small>' + CREATORS[i][1] + ' subscribers</small></span><em>Live</em></div>';
    }).join('');
    var posting = CREATORS.map(function (c, i) {
      return '<li style="--d:' + (100 + i * 110) + 'ms"><span class="oj-pav">' + ava(i) + '</span><b>' + c[0] + '<small>' + c[1] + '</small></b><span><i></i></span><em>Live</em></li>';
    }).join('');
    // the brand card: headed by the brand's name only, its first video's still as the image
    var card = '<div class="oj-card"><div class="oj-bar"><i style="background:' + B.pal[0] + '">' + e(B.initial) + '</i>' + e(B.name) + '</div>' +
      '<div class="oj-og" style="background-image:url(\'' + made.poster + '\'),linear-gradient(135deg,' + B.pal[0] + ',' + B.pal[1] + ')"></div>' +
      '<p class="oj-desc">' + e(B.sell) + '</p>' +
      '<div class="oj-read">' + ['What you sell', 'Who buys', 'Category'].map(function (t, i) { return '<span style="--d:' + (250 + i * 220) + 'ms">' + OB.icon('check', 11) + t + '</span>'; }).join('') + '</div>' +
      '<div class="oj-look"><span><small>Your colours</small><i>' + B.pal.map(function (c) { return '<u style="background:' + c + '"></u>'; }).join('') + '</i></span><span><small>Your voice</small><b>' + e(B.voice) + '</b></span></div></div>';
    var lines = B.videos.map(function (v, i) { return '<li style="--d:' + (80 + i * 160) + 'ms"><b>' + e(v[0]) + '</b>' + e(v[1]) + '</li>'; }).join('');
    var drafts = B.videos.map(function (v, i) { return '<span style="--d:' + (700 + i * 350) + 'ms"><img src="' + vids[i].poster + '" alt=""><small>' + e(v[0]) + '</small></span>'; }).join('');
    // lines that draw themselves from under the phone's edge to each card's inner edge
    function wires(list, cls, d0, step) {
      return '<g class="' + cls + '">' + list.map(function (p, i) {
        var sx = p.s * (PH - 14), sy = Math.round(p.y * 0.4), ex = p.edge, mx = Math.round((sx + ex) / 2), d = d0 + i * step;
        return '<path d="M' + sx + ' ' + sy + ' C ' + mx + ' ' + sy + ', ' + mx + ' ' + p.y + ', ' + ex + ' ' + p.y + '" pathLength="1" style="--d:' + d + 'ms"/><circle cx="' + ex + '" cy="' + p.y + '" r="4" style="--d:' + (d + 380) + 'ms"/>';
      }).join('') + '</g>';
    }
    var wireSvg = '<svg class="oj-wires" viewBox="' + (-W / 2) + ' ' + (-H / 2) + ' ' + W + ' ' + H + '" aria-hidden="true">' + wires(FACTS, 'w-1', 120, 90) + wires(NODES, 'w-3', 100, 110) + '</svg>';
    // step 2's callout, phone only (journey.css hides it above 700)
    var done = '<div class="oj-done" style="--px:86px;--py:60px;--d:1200ms"><img src="' + made.poster + '" alt=""><span><small>Your first videos</small><b>' + B.videos.length + ' videos</b><em>Ready</em></span></div>';
    stage.innerHTML = wireSvg + '<div class="oj-facts">' + facts + '</div><div class="oj-net">' + nodes + '</div>' + done +
      '<div class="oj-phone ob-iphone"><div class="oj-glass ob-iphone-screen">' +
        '<div class="oj-screen oj-site">' + card + '<i class="oj-scan"></i></div>' +
        '<div class="oj-screen oj-make"><small>Your first videos</small><ol>' + lines + '</ol><small>Making them</small><div class="oj-prog"><i></i></div><div class="oj-drafts">' + drafts + '</div></div>' +
        '<video class="oj-screen oj-film" src="' + made.src + '" poster="' + made.poster + '" muted loop playsinline preload="none"></video>' +
        '<div class="oj-screen oj-post"><small>Posting to creators</small><b class="oj-post-n">Live on 8 channels</b><ol>' + posting + '</ol></div>' +
        '<div class="oj-screen oj-stats"><small>Views so far</small><b data-oj-total>0</b><div class="oj-chart">' + [22, 30, 41, 47, 58, 66, 80].map(function (v, i) { return '<i style="--h:' + v + '%;--d:' + (i * 80) + 'ms"></i>'; }).join('') + '</div></div>' +
        '<span class="oj-glare"></span></div></div>';
    last = -1; tick();
  }

  // ---- the step: whichever block of words is nearest the middle of the screen
  var last = -1, countT = null, thenT = 0;
  function setStep(n) {
    var cls = 'oj-stage at-' + (n + 1);
    for (var k = 1; k <= n; k++) { cls += ' gt-' + k; }
    stage.className = cls;
    stepsEl.querySelectorAll('.oj-step').forEach(function (s, i) { s.classList.toggle('is-now', i === n); s.classList.toggle('is-past', i < n); });
    var film = stage.querySelector('.oj-film');
    if (film) { if (n === 1) { film.play().catch(function () {}); } else { film.pause(); } }
    window.clearInterval(countT); window.clearTimeout(thenT);
    // step 3: once the channels are Live, the views so far take the phone
    if (n === 2) { thenT = window.setTimeout(function () { stage.classList.add('is-then'); readViews(); }, 2400); }
  }
  function tick() {
    var mid = window.innerHeight / 2, best = 0, bestD = Infinity;
    // the phone: the stage pins above the words
    if (sec.classList.contains('oj-ph')) {
      var bb = box.getBoundingClientRect().bottom, sb = Math.max(0, bb), st = side.getBoundingClientRect().top;
      sec.classList.toggle('oj-pinned', st < pinTop + 1);
      sec.style.setProperty('--oj-out', String(Math.max(0, Math.min(1, (bb - pinTop - 64) / 160))));
      var all = stepsEl.querySelectorAll('.oj-step'), pick = all.length - 1;
      for (var j = 0; j < all.length; j++) { if (all[j].firstElementChild.getBoundingClientRect().bottom > sb + 40) { pick = j; break; } }
      if (pick !== last) { last = pick; setStep(pick); }
      return;
    }
    stepsEl.querySelectorAll('.oj-step').forEach(function (s, i) {
      var r = s.firstElementChild.getBoundingClientRect(), d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best !== last) { last = best; setStep(best); }
  }

  // the views so far climb, then keep ticking while you stay
  function readViews() {
    var total = stage.querySelector('[data-oj-total]'), t0 = performance.now(), sum = 23400;
    (function climb(now) {
      var k = Math.min(1, (now - t0) / 1400), ease = 1 - Math.pow(1 - k, 3);
      total.textContent = OB.fmt(sum * ease);
      if (k < 1 && last === 2) { window.requestAnimationFrame(climb); }
    })(t0);
    countT = window.setInterval(function () { sum += 7 + Math.round(Math.random() * 30); total.textContent = OB.fmt(sum); }, 900);
  }

  // the scene scales to the room it has: from its column's left edge out to the
  // right of the screen, and the screen's height; on a phone, the column's width
  // and about half the screen's height
  function fit() {
    var r = box.parentNode.getBoundingClientRect(), small = window.matchMedia('(max-width: 900px)').matches, phone = window.matchMedia('(max-width: 700px)').matches;
    sec.classList.toggle('oj-ph', phone);
    if (!phone) { sec.classList.remove('oj-pinned'); }
    pinTop = parseFloat(window.getComputedStyle(side).top) || 0;
    var w = phone ? PW : W, hh = phone ? PHH : H;
    var room = small ? Math.min(r.width, document.documentElement.clientWidth - 40) : window.innerWidth - r.left - 64;
    var tall = phone ? window.innerHeight * (window.innerHeight >= 780 ? 0.5 : 0.46) : small ? window.innerHeight * 0.5 : window.innerHeight - 88;
    var s = Math.max(0.3, Math.min(room / w, tall / hh, phone ? 1 : 1.4) * (small ? 1 : 0.85));
    box.style.setProperty('--oj-s', String(s));
    box.style.width = Math.round(w * s) + 'px'; box.style.height = Math.round(hh * s) + 'px';
    sec.style.setProperty('--oj-h', Math.round(hh * s) + 'px');
    box.style.marginLeft = Math.max(0, Math.round((room - w * s) * (phone ? 0.5 : 0.25))) + 'px';
  }

  // MAGNETIC STEPS: when the scrolling stops inside the section, a step already
  // within 18% of the screen's height of the middle glides to it (~0.7s); any
  // wheel, touch or key lets go at once. Never on touch or phones.
  var settleT, glide = 0, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none) and (pointer: coarse), (max-width: 900px)');
  function magnet() {
    if (glide || reduce || touch.matches) { return; }
    var mid = window.innerHeight / 2, sr = sec.getBoundingClientRect(), bd = Infinity;
    if (sr.top > mid || sr.bottom < mid) { return; }
    stepsEl.querySelectorAll('.oj-step').forEach(function (s) {
      var b = s.firstElementChild.getBoundingClientRect(), d = (b.top + b.bottom) / 2 - mid;
      if (Math.abs(d) < Math.abs(bd)) { bd = d; }
    });
    if (Math.abs(bd) < 6 || Math.abs(bd) > window.innerHeight * 0.18) { return; }
    var y0 = window.scrollY, t0 = performance.now(), dur = 500 + Math.min(300, Math.abs(bd) * 1.5);
    glide = window.requestAnimationFrame(function step(now) {
      var k = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
      window.scrollTo(0, y0 + bd * ease);
      glide = k < 1 ? window.requestAnimationFrame(step) : 0;
    });
  }
  function letGo() { if (glide) { window.cancelAnimationFrame(glide); glide = 0; } }
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { window.addEventListener(t, letGo, { passive: true }); });
  window.addEventListener('scroll', function () { if (glide) { return; } window.clearTimeout(settleT); settleT = window.setTimeout(magnet, 220); }, { passive: true });

  window.addEventListener('scroll', function () { window.requestAnimationFrame(tick); }, { passive: true });
  window.addEventListener('resize', function () { fit(); tick(); });
  fit();
  build();
})();
