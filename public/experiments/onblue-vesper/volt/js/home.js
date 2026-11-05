/* brands.html (the Volt homepage on the PM's product): the page's own data and
   small behaviours, from the Volt homepage's site.js and site-parts.js with the
   free report, the website field and the no-website dialog left behind.
   Load after ob.js (films registered) and BEFORE parts.js and compare.js,
   which draw OB.FAQ and OB.COMPARE.
   - the formats wall: two rows of films, each doubled so the drift loops
   - the comparison data (y = yes, p = partly, n = no; the last two rows are words)
   - the budget meter: views = budget / rate x 1,000, the rate an editable field
   - the FAQ data */
(function () {
  'use strict';
  var OB = window.OB;

  // ---- the wall: on a phone it skips the one film whose poster has a white frame baked in
  var wall = document.querySelector('[data-wall]');
  if (wall && OB.FILMS.length) {
    var skip = window.matchMedia('(max-width: 700px)').matches ? { 'storm-chaser-night-drive': 1 } : {};
    var row = function (from, cls) {
      var tiles = '';
      for (var i = 0, k = from; i < 12 && k < from + 48; k++) {
        var f = OB.film(k);
        if (skip[f.id]) { continue; }
        i++;
        tiles += '<div class="ob-tile">' + OB.videoTag(f) + '<span class="ob-phone-tag">' + OB.esc(f.label) + '</span></div>';
      }
      return '<div class="ob-wall-row ' + cls + '">' + tiles + tiles + '</div>';
    };
    wall.innerHTML = row(0, '') + row(12, 'ob-wall-row--b');
  }
  OB.watchFilms();

  // ---- the comparison (the PM's rows and marks, 2026-11-05), drawn by compare.js
  OB.COMPARE = {
    COLS: ['onBlue', 'An agency', 'Doing it yourself', 'UGC marketplaces', 'AI video tools'],
    ROWS: [
      ['Makes your videos that win', 'y', 'p', 'p', 'p', 'p'],
      ['Posted by creators on their own channels', 'y', 'n', 'n', 'p', 'n'],
      ['Makes more of what works', 'y', 'p', 'p', 'n', 'n'],
      ['You pay only for views', 'y', 'n', 'n', 'n', 'n'],
      ['Time to go live', 'Days', 'Months', 'Your evenings', 'Weeks', 'You still post'],
      ['Price', 'Per view', 'Monthly retainer', 'Your time', 'Per video', 'Subscription']
    ]
  };

  // ---- the budget meter: a halftone field where each dot is 1,000 views. The
  // grid holds what $5,000 buys at $8 (625 dots); a lower rate buys more than
  // that, so then the grid fills in proportion to the budget instead
  var range = document.querySelector('[data-budget]');
  if (range) {
    var out = document.querySelector('[data-budget-out]'), views = document.querySelector('[data-budget-views]');
    var rateEl = document.querySelector('[data-rate]'), field = document.querySelector('[data-meter-dots]');
    var rate = 8, CAP = Math.round(+range.max / 8), dots = [], lit = 0;
    if (field) {
      var html = '';
      for (var i = 0; i < CAP; i++) { html += '<i></i>'; }
      field.innerHTML = html; dots = field.children;
    }
    var fitRate = function () { if (rateEl) { rateEl.style.width = (Math.max(1, rateEl.value.length) + 0.6) + 'ch'; } };
    var show = function () {
      var b = +range.value, max = +range.max;
      out.textContent = '$' + OB.fmt(b);
      views.textContent = OB.fmt(b / rate * 1000);
      range.style.setProperty('--p', ((b - range.min) / (max - range.min) * 100) + '%');
      var n = max / rate <= CAP ? Math.round(b / rate) : Math.round(b / max * CAP);
      n = Math.min(n, CAP);
      // only the dots that changed are touched
      for (var j = Math.min(lit, n); j < Math.max(lit, n) && j < dots.length; j++) { dots[j].classList.toggle('is-on', j < n); }
      lit = n;
    };
    range.addEventListener('input', show);
    if (rateEl) {
      rateEl.addEventListener('input', function () {
        var v = parseFloat(rateEl.value);
        if (v > 0 && isFinite(v)) { rate = v; show(); }
        fitRate();
      });
      // left empty or at zero: back to the last rate that worked
      rateEl.addEventListener('blur', function () { if (!(parseFloat(rateEl.value) > 0)) { rateEl.value = String(rate); fitRate(); } });
      fitRate();
    }
    show();
  }

  // ---- the FAQ (the PM's four), drawn by parts.js
  OB.FAQ = [
    ['What do I pay?', 'You pay for the views your videos get.'],
    ['Do you guarantee views?', 'No, and nobody honest can. You pay only for the views your videos actually get. If a video doesn\'t land, it costs you nothing. Each success is yours, our failures are ours.'],
    ['Who posts the videos?', 'Creators from the onBlue community post them on their own channels. BlueAI matches each video to creators whose audience fits your buyers. Every view is organic.'],
    ['Which platforms?', 'YouTube Shorts today. TikTok and Instagram are coming.']
  ];
})();
