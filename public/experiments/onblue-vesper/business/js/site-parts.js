/* The website, part 2: the result bars, the comparison table, the budget
   slider, the FAQ. (How it works lives in journey.js.) */
(function () {
  'use strict';
  var OB = window.OB;

  // the result bars grow the first time they come into view
  var bars = document.querySelector('[data-bars]');
  if (bars && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { bars.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(bars);
  } else if (bars) { bars.classList.add('is-in'); }

  // the comparison, one symbol system: y = yes, p = partly, n = no; the last
  // two rows are words. Every onBlue line is from the 2026-11-03 PM sync; the
  // competitors' prices say HOW they charge, never invented figures.
  var COLS = ['onBlue', 'An agency', 'Doing it yourself', 'UGC marketplaces', 'AI video tools'];
  var ROWS = [
    ['Learns your brand from one link', 'y', 'p', 'n', 'n', 'p'],
    ['Finds your competitors and what they post', 'y', 'p', 'p', 'n', 'n'],
    ['Finds the formats that win in your category', 'y', 'p', 'n', 'n', 'n'],
    ['Posted by thousands of real creators on their own channels', 'y', 'n', 'n', 'p', 'n'],
    ['You pay only for US views', 'y', 'n', 'n', 'n', 'n'],
    ['Reads the results and doubles down', 'y', 'p', 'p', 'n', 'n'],
    ['Time to go live', 'Days', 'Months', 'Your evenings', 'Weeks', 'You still post'],
    ['Price', '$8 per 1,000 US views', 'Monthly retainer', 'Your time', 'Per video', 'Subscription']
  ];
  OB.COMPARE = { COLS: COLS, ROWS: ROWS };   // drawn as the face-off by js/compare.js

  // the budget meter: what a budget pays for at $8 per 1,000 US views, drawn as
  // a halftone field where each dot is 1,000 views; the lit dots grow with it
  var range = document.querySelector('[data-budget]');
  if (range) {
    var out = document.querySelector('[data-budget-out]'), views = document.querySelector('[data-budget-views]');
    var field = document.querySelector('[data-meter-dots]'), dots = [], lit = 0;
    if (field) {
      var total = Math.round(+range.max / OB.RATE), html = '';
      for (var i = 0; i < total; i++) { html += '<i></i>'; }
      field.innerHTML = html; dots = field.children;
    }
    var show = function () {
      var b = +range.value, n = Math.round(b / OB.RATE);
      out.textContent = '$' + OB.fmt(b);
      views.textContent = OB.fmt(b / OB.RATE * 1000);
      range.style.setProperty('--p', ((b - range.min) / (range.max - range.min) * 100) + '%');
      // only the dots that changed are touched
      for (var j = Math.min(lit, n); j < Math.max(lit, n) && j < dots.length; j++) { dots[j].classList.toggle('is-on', j < n); }
      lit = n;
    };
    range.addEventListener('input', show); show();
  }

  var FAQ = [
    ['What do I pay?', '$8 for every 1,000 views from the US. You set a budget; when it is spent, posting stops. No setup fee and no retainer.'],
    ['Do you guarantee views?', 'No, and nobody honest can. You pay only for the US views your videos actually get. If a video doesn\'t land, it costs you nothing. Each success is yours, our failures are ours.'],
    ['Who posts the videos?', 'Creators from the onBlue community post them on their own channels. BlueAI matches each video to creators whose audience fits your buyers.'],
    ['Which platforms?', 'YouTube Shorts today. TikTok and Instagram are coming.'],
    ['What is in the free report?', 'Your brand as BlueAI reads it, your competitors, what wins in your category, the angles to go after, your first three videos and a plan. It takes about two minutes.'],
    ['I don\'t have a website. Can I still start?', 'Yes. Answer three quick questions instead and BlueAI starts the same way.']
  ];
  var faq = document.querySelector('[data-faq]');
  if (faq) {
    // one open at a time, the first open to start; the answer slides open
    faq.innerHTML = FAQ.map(function (q, i) {
      return '<div class="ob-qa-item' + (i === 0 ? ' is-open' : '') + '"><button type="button" aria-expanded="' + (i === 0) + '"><em>0' + (i + 1) + '</em><span>' + OB.esc(q[0]) + '</span><i>' + OB.icon('plus', 16) + '</i></button>' +
        '<div class="ob-qa-a"><div><p>' + OB.esc(q[1]) + '</p></div></div></div>';
    }).join('');
    faq.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) { return; }
      var item = b.parentNode, open = !item.classList.contains('is-open');
      faq.querySelectorAll('.ob-qa-item').forEach(function (x) { x.classList.remove('is-open'); x.firstChild.setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); }
    });
  }
})();
