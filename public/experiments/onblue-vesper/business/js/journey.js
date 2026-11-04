/* How it works, as ONE SHORT'S JOURNEY. The words scroll by on the left, six
   steps, one after another; the stage on the right stays pinned and plays
   whichever step sits in the middle of the screen. One phone (a real-looking
   phone, turning in 3D) lives through the loop: it opens the visitor's site
   (its real logo, title and share image), sees the rivals' Shorts, sorts the
   formats, makes the video, POSTS ACROSS A NETWORK of creators (each channel
   lighting up Live), then reads the results and doubles down on the winner with
   new variations. It speaks about the visitor's own site: what they typed in the hero,
   else their last report, else a sample. JS sets the step; CSS moves things
   with transforms and opacity only (css/journey.css, journey-2.css). */
(function () {
  'use strict';
  var OB = window.OB, e = OB.esc;
  var sec = document.querySelector('[data-journey]');
  if (!sec || !OB.report) { return; }
  var stage = sec.querySelector('[data-oj-stage]'), box = sec.querySelector('[data-oj-box]'), stepsEl = sec.querySelector('[data-oj-steps]');
  // the scene: W x H design pixels, scaled to fit (fit() below). The phone is
  // 296 wide drawn at 1.15x, so its edge sits PH from the centre; every card's
  // inner edge sits GAP beyond that, so each wire runs phone edge to card edge
  var W = 1010, H = 760, PH = 170, GAP = 44;
  var PAL = {
    'Food and drink': ['#6b3e26', '#d9a066', '#f3e3c3', '#2f5d50'], 'Beauty and skincare': ['#b76e79', '#f2c4ce', '#fbe9e7', '#5e3a46'],
    'Fitness': ['#1f2937', '#ef4444', '#f59e0b', '#e5e7eb'], 'Games': ['#7c3aed', '#111827', '#22d3ee', '#f472b6'],
    'Retail and fashion': ['#8a5a44', '#1e293b', '#c2a878', '#f5f0e6'], 'Travel': ['#0e7490', '#fbbf24', '#f1f5f9', '#047857'],
    'Apps and software': ['#2563eb', '#0f172a', '#e0e7ff', '#10b981']
  };
  var CREATORS = [['@mia.makes', '210K'], ['@dan.daily', '88K'], ['@thefoodlab', '1.2M'], ['@kai.reviews', '45K'], ['@sam.cooks', '310K'], ['@lena.loops', '67K'], ['@raj.tries', '150K'], ['@tess.tech', '92K']];
  var SAMPLE = 'northlinecoffee.com';

  function report(site) {
    if (site) { return OB.report.build({ site: site }); }
    return OB.report.get() || OB.report.build({ site: SAMPLE });
  }
  // the visitor's own site as BlueAI reads it: its logo, title, description
  // and share image (Microlink's page metadata, not a raw screenshot, which
  // crops badly). The sample brand is made up, so it keeps the drawn card.
  function readSite(host, card) {
    if (!window.fetch) { return; }
    fetch('https://api.microlink.io/?url=' + encodeURIComponent('https://' + host)).then(function (res) { return res.json(); }).then(function (j) {
      var d = j && j.status === 'success' && j.data; if (!d || !card.isConnected) { return; }
      // sites behind bot protection hand the reader an error or challenge page;
      // if that is what came back, keep the drawn card rather than show it
      var BAD = /error|denied|forbidden|not found|attention required|just a moment|captcha|cloudflare|blocked|unavailable|40[0-9]|50[0-9]/i;
      if (!d.title || BAD.test(d.title) || BAD.test(d.description || '')) { return; }
      // a site can send the reader somewhere else (bluestacks.com sends this
      // Mac-based service to its /mac page); then only the logo and the
      // publisher's name still describe the brand, so the card keeps the rest
      var landed = '/';
      try { landed = new URL(d.url).pathname.replace(/\/+$/, '') || '/'; } catch (err) { /* keep root */ }
      if (landed !== '/') {
        if (d.logo && d.logo.url) { card.querySelector('.oj-bar i').innerHTML = '<img src="' + e(d.logo.url) + '" alt="">'; }
        if (d.publisher) { card.querySelector('.oj-brand').textContent = d.publisher.slice(0, 40); }
        return;
      }
      if (d.title) { card.querySelector('.oj-brand').textContent = d.title.split(/ [|\-:] /)[0].slice(0, 40); }
      if (d.description) { card.querySelector('.oj-desc').textContent = d.description.slice(0, 120); }
      if (d.logo && d.logo.url) { card.querySelector('.oj-bar i').innerHTML = '<img src="' + e(d.logo.url) + '" alt="">'; }
      if (d.image && d.image.url) { var img = card.querySelector('.oj-og img'); img.onload = function () { img.classList.add('is-ready'); }; img.src = d.image.url; }
    }).catch(function () {});
  }
  function poster(fmt, salt) { return OB.film(OB.filmFor(fmt, salt)).poster; }

  function words(r) {
    var host = r.site || 'your website', top = r.formats[0].name;
    // every line here is from the 2026-11-03 PM sync (Ashish) and the overhaul
    // plan: the agent learns the company, finds competitors and the formats that
    // win, makes the videos, a community of creators posts them, you pay per
    // 1,000 US views, old videos keep counting, every loop gets better
    // [before, accent, after, line]: one ink headline with the halftone accent
    // on its key words, the way the hero and the statements are set
    return [
      ['Learns your brand from ', 'one link', '.', 'BlueAI reads ' + host + ': what you sell and who buys it.'],
      ['Finds your ', 'competitors', ' and what they post.', 'It finds ' + r.rivals.length + ' rivals in ' + r.category.toLowerCase() + ' and the ' + r.rivalsTotal + ' Shorts they posted in the last six months.'],
      ['Finds the formats that ', 'win', ' in your category.', 'It sorts every rival Short by format and keeps the ones that win. Right now, ' + top.toLowerCase() + ' leads.'],
      ['Makes your videos on ', 'winning formats', '.', 'BlueAI makes your Shorts on the formats that win in your category.'],
      ['Creators post them ', 'everywhere at once', '.', 'A community of thousands of real creators posts them on their own channels. Days, not months.'],
      ['Reads the results and ', 'doubles down', '.', 'It tracks the views every day, old videos included, and makes more of what works. You pay $8 per 1,000 US views.']
    ];
  }
  // a side (-1 left, 1 right), a y and the card's width give its centre; the
  // wire ends on the card's inner edge
  function spots(list, w) { return list.map(function (p) { return { x: p[0] * (PH + GAP + w / 2), y: p[1], edge: p[0] * (PH + GAP), s: p[0] }; }); }
  function at(list, i) { return '--x:' + list[i].x + 'px;--y:' + list[i].y + 'px'; }

  function build(r, live) {
    var pal = PAL[r.category] || PAL['Apps and software'], made = OB.film(r.videos[0].film), h = OB.hash(r.site || r.brand);
    stepsEl.innerHTML = words(r).map(function (t, i) {
      return '<div class="oj-step" data-i="' + i + '"><div><h3>' + e(t[0]) + '<span class="ob-tone">' + e(t[1]) + '</span>' + e(t[2]) + '</h3><p>' + e(t[3]) + '</p></div></div>';
    }).join('');

    // card widths here match css/journey-2.css, so the wires meet the edges
    // delays are short (the step must answer the scroll at once) and apply on
    // the way IN only; leaving, everything goes together with no wait
    var FACTS = spots([[-1, -190], [1, -70], [-1, 150], [1, 210]], 260);
    var facts = [['Sells', r.sell, 'brand'], ['Buyers', r.buyers, 'users'], ['Category', r.category, 'studio'], ['Competitors', r.rivals.length + ' found', 'radar']].map(function (f, i) {
      return '<div class="oj-fact" style="' + at(FACTS, i) + ';--d:' + (120 + i * 90) + 'ms;--b:' + (i * 0.7) + 's"><i>' + OB.icon(f[2], 18) + '</i><span><small>' + f[0] + '</small><b>' + e(f[1]) + '</b></span></div>';
    }).join('');
    var RIV = spots([[-1, -150], [-1, 165], [1, -150], [1, 165]], 124);
    var rivals = r.rivals.slice(0, 4).map(function (x, i) {
      var f = OB.film(OB.filmFor(r.formats[i % r.formats.length].name, h + i));
      return '<div class="oj-rival" style="' + at(RIV, i) + ';--r:' + (RIV[i].s * 4) + 'deg;--d:' + (60 + i * 70) + 'ms"><img src="' + f.poster + '" alt=""><span>' + x.videos + ' Shorts</span><b>' + e(x.name) + '</b></div>';
    }).join('');
    var CH = spots([[-1, -180], [1, -100], [-1, 110], [1, 190]], 236);
    var chips = r.formats.slice(0, 4).map(function (f, i) {
      return '<div class="oj-chip' + (i === 0 ? ' is-top' : '') + '" style="' + at(CH, i) + ';--d:' + (60 + i * 80) + 'ms"><b>' + e(f.name) + '</b><span>' + f.share + '%</span></div>';
    }).join('');
    // step 5: a network of creators, four each side, lighting up Live in turn
    var NODES = spots([[-1, -225], [-1, -75], [-1, 75], [-1, 225], [1, -225], [1, -75], [1, 75], [1, 225]], 200);
    var nodes = NODES.map(function (p, i) {
      var c = CREATORS[i], ava = i < 5 ? '<img src="img/avatars/creator-' + (i + 1) + '.jpg" alt="">' : '<i style="background:' + pal[i % 4] + '">' + c[0].charAt(1).toUpperCase() + '</i>';
      return '<div class="oj-node" style="' + at(NODES, i) + ';--d:' + (100 + i * 110) + 'ms"><span class="oj-av">' + ava + '</span><span><b>' + c[0] + '</b><small>' + c[1] + ' subscribers</small></span><em>Live</em></div>';
    }).join('');
    var posting = CREATORS.map(function (c, i) {   // all 8 the screen promises, each with its face
      var av = i < 5 ? '<img src="img/avatars/creator-' + (i + 1) + '.jpg" alt="">' : '<i style="background:' + pal[i % 4] + '">' + c[0].charAt(1).toUpperCase() + '</i>';
      return '<li style="--d:' + (100 + i * 110) + 'ms"><span class="oj-pav">' + av + '</span><b>' + c[0] + '<small>' + c[1] + '</small></b><span><i></i></span><em>Live</em></li>';
    }).join('');
    // step 6: three results (one wins, one stalls) and three new takes on the winner
    var RES = spots([[-1, -210], [-1, 0], [-1, 210]], 204), VARS = spots([[1, -210], [1, 0], [1, 210]], 92), RV = [4100, 18400, 900];
    var results = RES.map(function (p, i) {
      return '<div class="oj-res' + (i === 1 ? ' is-win' : '') + (i === 2 ? ' is-cut' : '') + '" style="' + at(RES, i) + ';--d:' + (80 + i * 90) + 'ms"><img src="' + OB.film(h + 3 + i * 5).poster + '" alt=""><span><small>Day 3</small><b data-v="' + RV[i] + '">0</b><em>' + (i === 1 ? 'Winner' : i === 2 ? 'Stalled' : 'Steady') + '</em></span></div>';
    }).join('');
    var takes = VARS.map(function (p, i) {
      return '<div class="oj-var" style="' + at(VARS, i) + ';--d:' + (500 + i * 110) + 'ms"><img src="' + OB.film(h + 14 + i * 3).poster + '" alt=""><em>Var 0' + (i + 1) + '</em></div>';
    }).join('');
    // step 1: the site card; step 2: the rivals' Shorts as real thumbnails;
    // step 3: the formats as rows of thumbnails, the winner tagged in volt
    var page = '<div class="oj-card"><div class="oj-bar"><i style="background:' + pal[0] + '">' + e(r.initial) + '</i>' + e(r.site || 'your site') + '</div>' +
      '<div class="oj-og" style="background:linear-gradient(135deg,' + pal[0] + ',' + pal[1] + ')"><img alt=""></div>' +
      '<b class="oj-brand">' + e(r.brand) + '</b><p class="oj-desc">' + e(r.sell) + '</p>' +
      '<div class="oj-read">' + ['What you sell', 'Who buys', 'Category'].map(function (t, i) { return '<span style="--d:' + (250 + i * 220) + 'ms">' + OB.icon('check', 11) + t + '</span>'; }).join('') + '</div>' +
      '<div class="oj-look"><span><small>Your colours</small><i>' + pal.map(function (c) { return '<u style="background:' + c + '"></u>'; }).join('') + '</i></span><span><small>Your voice</small><b>' + e(r.voice || '') + '</b></span></div></div>';
    var grid = [];
    for (var gi = 0; gi < 6; gi++) {
      var rv = r.rivals[gi % r.rivals.length], fm = r.formats[(gi + h) % r.formats.length].name;
      grid.push('<span style="--d:' + (gi * 70) + 'ms"><img src="' + poster(fm, h + gi * 3) + '" alt=""><em>' + OB.short(rv.views / rv.videos * (2.4 - gi * 0.3)) + '</em><b>' + e(rv.name) + '</b></span>');
    }
    var rows = r.formats.slice(0, 3).map(function (f, i) {
      return '<li' + (i === 0 ? ' class="is-top"' : '') + ' style="--d:' + (i * 120) + 'ms"><span><b>' + e(f.name) + '</b><em>' + (i === 0 ? 'Winning' : f.share + '%') + '</em></span><div>' +
        [0, 1, 2].map(function (k) { return '<img src="' + (k === 0 ? poster(f.name, h + i) : OB.film(h + i * 7 + k * 5).poster) + '" alt="">'; }).join('') + '</div></li>';
    }).join('');
    var lines = r.videos.slice(0, 3).map(function (q, i) { return '<li style="--d:' + (80 + i * 160) + 'ms"><b>' + e(q.format) + '</b>' + e(q.title) + '</li>'; }).join('');
    // lines that draw themselves from under the phone's edge to each card's
    // inner edge (they start 14px under the phone so its small tilt never
    // shows a gap), each drawn as its card arrives; a dot marks where it lands
    function wires(list, cls, d0, step) {
      return '<g class="' + cls + '">' + list.map(function (p, i) {
        var sx = p.s * (PH - 14), sy = Math.round(p.y * 0.4), ex = p.edge, mx = Math.round((sx + ex) / 2), d = d0 + i * step;
        return '<path d="M' + sx + ' ' + sy + ' C ' + mx + ' ' + sy + ', ' + mx + ' ' + p.y + ', ' + ex + ' ' + p.y + '" pathLength="1" style="--d:' + d + 'ms"/><circle cx="' + ex + '" cy="' + p.y + '" r="4" style="--d:' + (d + 380) + 'ms"/>';
      }).join('') + '</g>';
    }
    var wireSvg = '<svg class="oj-wires" viewBox="' + (-W / 2) + ' ' + (-H / 2) + ' ' + W + ' ' + H + '" aria-hidden="true">' + wires(FACTS, 'w-1', 120, 90) + wires(RIV, 'w-2', 60, 70) + wires(CH, 'w-3', 60, 80) + wires(NODES, 'w-5', 100, 110) + wires(RES, 'w-6', 80, 90) + wires(VARS, 'w-6', 500, 110) + '</svg>';
    stage.innerHTML = wireSvg + '<div class="oj-facts">' + facts + '</div><div class="oj-rivals">' + rivals + '</div><div class="oj-chips">' + chips + '</div><div class="oj-net">' + nodes + '</div><div class="oj-results">' + results + takes + '</div>' +
      '<div class="oj-phone ob-iphone"><div class="oj-glass ob-iphone-screen">' +
        '<div class="oj-screen oj-site">' + page + '<i class="oj-scan"></i></div>' +
        '<div class="oj-screen oj-list"><small>' + r.rivals.length + ' rivals &middot; ' + r.rivalsTotal + ' Shorts</small><div class="oj-grid">' + grid.join('') + '</div></div>' +
        '<div class="oj-screen oj-formats"><small>What wins in ' + e(r.category.toLowerCase()) + '</small><ul>' + rows + '</ul></div>' +
        '<div class="oj-screen oj-make"><small>Your first videos</small><ol>' + lines + '</ol><small>Making them</small><div class="oj-prog"><i></i></div><div class="oj-drafts">' +
          r.videos.slice(0, 3).map(function (q, i) { return '<span style="--d:' + (700 + i * 350) + 'ms"><img src="' + OB.film(q.film).poster + '" alt=""><small>' + e(q.format) + '</small></span>'; }).join('') + '</div></div>' +
        '<video class="oj-screen oj-film" src="' + made.src + '" poster="' + made.poster + '" muted loop playsinline preload="none"></video>' +
        '<div class="oj-screen oj-post"><small>Posting to creators</small><b class="oj-post-n">Live on 8 channels</b><ol>' + posting + '</ol></div>' +
        '<div class="oj-screen oj-stats"><small>Views so far</small><b data-oj-total>0</b><div class="oj-chart">' + [22, 30, 41, 47, 58, 66, 80].map(function (v, i) { return '<i style="--h:' + v + '%;--d:' + (i * 80) + 'ms"></i>'; }).join('') + '</div>' +
          '<p><span>Winner</span>' + e(r.formats[0].name) + ', 3 new takes on the way</p><ol class="oj-top">' +
          [1, 0, 2].map(function (k, i) { return '<li style="--d:' + (400 + i * 140) + 'ms"><img src="' + OB.film(h + 3 + k * 5).poster + '" alt=""><b>' + ['Steady', 'Winner', 'Stalled'][k] + '</b><span>' + OB.short(RV[k]) + ' views</span></li>'; }).join('') + '</ol></div>' +
        '<span class="oj-glare"></span></div></div>';
    if (live && r.site) { readSite(r.site, stage.querySelector('.oj-card')); }
    last = -1; tick();
  }

  // ---- the step: whichever block of words is nearest the middle of the screen
  var last = -1, countT = null;
  function setStep(n) {
    var cls = 'oj-stage at-' + (n + 1);
    for (var k = 1; k <= n; k++) { cls += ' gt-' + k; }
    stage.className = cls;
    stepsEl.querySelectorAll('.oj-step').forEach(function (s, i) { s.classList.toggle('is-now', i === n); });
    var film = stage.querySelector('.oj-film');
    if (film) { if (n >= 3) { film.play().catch(function () {}); } else { film.pause(); } }
    window.clearInterval(countT);
    if (n === 5) { readViews(); }
  }
  function tick() {
    var mid = window.innerHeight / 2, best = 0, bestD = Infinity;
    stepsEl.querySelectorAll('.oj-step').forEach(function (s, i) {
      var r = s.getBoundingClientRect(), d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best !== last) { last = best; setStep(best); }
  }

  // step 6: the results' views climb, then the total keeps ticking while you stay
  function readViews() {
    var views = stage.querySelectorAll('.oj-res b'), total = stage.querySelector('[data-oj-total]'), t0 = performance.now(), sum = 23400;
    (function climb(now) {
      var k = Math.min(1, (now - t0) / 1400), ease = 1 - Math.pow(1 - k, 3);
      views.forEach(function (el) { el.textContent = OB.short(+el.getAttribute('data-v') * ease) + ' views'; });
      total.textContent = OB.fmt(sum * ease);
      if (k < 1 && last === 5) { window.requestAnimationFrame(climb); }
    })(t0);
    countT = window.setInterval(function () { sum += 7 + Math.round(Math.random() * 30); total.textContent = OB.fmt(sum); }, 900);
  }

  // the scene scales to the room it has: from its column's left edge out to the
  // right of the screen, and the screen's height (under the header pill); on a
  // phone, the column's width and half the screen's height
  function fit() {
    var r = box.parentNode.getBoundingClientRect(), small = window.matchMedia('(max-width: 900px)').matches;
    var room = small ? r.width : window.innerWidth - r.left - 64, tall = small ? window.innerHeight * 0.5 : window.innerHeight - 88;
    // 85% of the room it could take (Appy: the full fit read too large)
    var s = Math.max(0.3, Math.min(room / W, tall / H, 1.4) * (small ? 1 : 0.85));
    box.style.setProperty('--oj-s', String(s));
    box.style.width = Math.round(W * s) + 'px'; box.style.height = Math.round(H * s) + 'px';
    sec.style.setProperty('--oj-h', Math.round(H * s) + 'px');   // the stage's height: the pin and the first and last steps use it
    // a little left of centre in its room (Appy), nearer the words
    box.style.marginLeft = Math.max(0, Math.round((room - W * s) * 0.25)) + 'px';
  }

  // MAGNETIC STEPS: when the scrolling stops inside the section, the nearest
  // step glides to the middle of the screen, so a step is never left half way
  // SUBTLE (Appy: it pulled from too far, too hard): it only catches a step
  // already within 18% of the screen's height of the middle, waits for the
  // scroll to rest, then eases in over ~0.7s; any wheel, touch or key from the
  // reader lets go at once
  var settleT, glide = 0, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function magnet() {
    if (glide || reduce) { return; }
    var mid = window.innerHeight / 2, sr = sec.getBoundingClientRect(), bd = Infinity;
    if (sr.top > mid || sr.bottom < mid) { return; }
    stepsEl.querySelectorAll('.oj-step').forEach(function (s) {
      var b = s.getBoundingClientRect(), d = (b.top + b.bottom) / 2 - mid;
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

  var input = document.querySelector('.ob-hero [data-site-input]'), typedT;
  if (input) {
    input.addEventListener('input', function () {
      window.clearTimeout(typedT);
      typedT = window.setTimeout(function () {
        var v = input.value.trim();
        if (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(v.replace(/^https?:\/\//i, '').replace(/^www\./i, ''))) { build(report(v), true); }
      }, 700);
    });
  }
  window.addEventListener('scroll', function () { window.requestAnimationFrame(tick); }, { passive: true });
  window.addEventListener('resize', function () { fit(); tick(); });
  fit();
  var first = report();
  build(first, first.site !== SAMPLE);
})();
