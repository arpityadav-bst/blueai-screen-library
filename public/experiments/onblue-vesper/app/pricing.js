/* "How pricing works", opened from the sidebar as a dialog over the page the
   agency is on. SHOWN, NOT EXPLAINED: the two prices are the headline, and a
   budget slider answers "what does my money buy?" by doing the sum live,
   instead of a paragraph describing it. Picking a card switches the sum.
   shell.js loads this file on first use; it adds its own stylesheet. */
(function () {
  'use strict';

  var X = window.onblueApp.icons.close; // the app's one close glyph (shell.js)
  var ICON = {
    play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="M10.5 9.5v5l4-2.5z" fill="currentColor"/></svg>',
    eye: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/></svg>',
    heart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 19.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10z"/></svg>',
    chat: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 6.5h15v10h-8l-4 3.5v-3.5h-3z"/></svg>'
  };
  /* growth at the minimum rate; engagement at the bid the create form suggests.
     WHAT IT GETS YOU, NOT JUST HOW MANY: a completion is a person, so the
     engagement sum is said in people and what they do; growth in views, and
     where those views come from. */
  var KIND = {
    growth: { rate: 1.2, per: 1000, unit: 'views', what: 'on videos creators make for your product and post on their own accounts' },
    engagement: { rate: 1, per: 1, unit: 'people', what: 'watch your video, like it and comment on it, from their own accounts' }
  };
  function short(n) {
    if (n >= 1e6) { return (Math.round(n / 1e5) / 10) + 'M'; }
    if (n >= 1e4) { return Math.round(n / 1e3) + 'K'; }
    return n.toLocaleString('en-US');
  }

  // ONE FOCAL POINT PER BLOCK: in a card, its price; in the sum, what the money
  // gets you. Only the sum is display-sized, so the eye lands on the answer.
  /* THE SUM ROLLS (Appy, after NumberFlow and its scrub mode): each digit is a
     wheel of 0 to 9 that turns to its new value, so a drag reads as the number
     climbing, not flickering. Only digits roll; "." "M" "K" stay put. A change
     in the number's shape (1.7M to 17M) is a rebuild, set without motion. The
     real figure sits in a hidden span for screen readers. */
  var WHEEL = '<span class="od-s">0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9</span>';
  function roll(el, text) {
    var shape = text.replace(/[0-9]/g, '0');
    if (el.getAttribute('data-shape') !== shape) {
      el.setAttribute('data-shape', shape);
      el.innerHTML = '<span class="pr-sr"></span><span class="od" aria-hidden="true">'
        + text.split('').map(function (ch) { return /[0-9]/.test(ch) ? '<span class="od-d">' + WHEEL + '</span>' : '<span class="od-c">' + ch + '</span>'; }).join('')
        + '</span>';
      el.classList.add('is-set'); // a new shape is set in place, not rolled to
    }
    el.firstChild.textContent = text;
    var ds = text.replace(/[^0-9]/g, '');
    el.querySelectorAll('.od-s').forEach(function (s, i) { s.style.transform = 'translateY(' + (-10 * +ds[i]) + '%)'; });
    if (el.classList.contains('is-set')) { el.getBoundingClientRect(); el.classList.remove('is-set'); }
  }

  /* THE SCALE, DRAWN AS WHAT IT BUYS, IN THREE TIERS (Appy): the budget's
     range is three bands, and every band draws a good picture. A small budget
     is never a sliver; it is a healthy chart, and crossing into the next band
     upgrades the picture itself. Growth is views, a chart whose curve gets
     steeper each band (the last one a hockey stick). Engagement is people, a
     crowd that gets bigger each band. Inside a band the picture still grows a
     little with the slider, so dragging always does something. Each band has
     its own metal: green, then gold, then diamond. */
  var TIERS = [
    { upTo: 1000, label: 'A solid start', curve: 'M0 100C45 98 75 82 100 45', top: 0.55, crowd: 12, cols: 4 },
    { upTo: 5000, label: 'Strong reach', curve: 'M0 100C40 97 70 70 100 18', top: 0.82, crowd: 24, cols: 6 },
    { upTo: Infinity, label: 'A big launch', curve: 'M0 100C55 99 72 60 100 0', top: 1, crowd: 40, cols: 8 }
  ];
  var LOW = 100, HIGH = 10000;
  function tierOf(b) { for (var i = 0; i < TIERS.length; i++) { if (b < TIERS[i].upTo) { return i; } } return TIERS.length - 1; }
  // how far through its own band a budget is, 0 to 1
  function within(b, t) {
    var lo = t ? TIERS[t - 1].upTo : LOW, hi = TIERS[t].upTo === Infinity ? HIGH : TIERS[t].upTo;
    return Math.min(1, Math.max(0, (b - lo) / (hi - lo)));
  }
  function graph(kind, t) {
    var T = TIERS[t];
    if (kind === 'engagement') {
      var h = '';
      for (var i = 0; i < T.crowd; i++) { h += '<i></i>'; }
      return '<div class="pr-crowd" style="grid-template-columns: repeat(' + T.cols + ', 1fr)">' + h + '</div>';
    }
    return '<svg class="pr-curve" viewBox="0 0 100 100" preserveAspectRatio="none">'
      + '<defs><linearGradient id="pr-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="pr-stop-a"/><stop offset="1" class="pr-stop-b"/></linearGradient></defs>'
      + '<g class="pr-curve-g"><path class="pr-area"/><path class="pr-line" vector-effect="non-scaling-stroke"/></g></svg>'
      + '<span class="pr-tip"></span>';
  }
  function drawGraph(el, kind, b) {
    var t = tierOf(b), T = TIERS[t], w = within(b, t);
    // growth morphs its one curve between bands; a crowd is rebuilt at its new size
    var key = kind === 'engagement' ? kind + t : kind;
    if (el.getAttribute('data-key') !== key) { el.setAttribute('data-key', key); el.innerHTML = graph(kind, t); }
    // the band sets the graph's metal (css/pricing.css): green, then gold, then diamond
    el.setAttribute('data-tier', t + 1);
    el.parentNode.setAttribute('data-tier', t + 1);
    el.parentNode.querySelector('.pr-tier').textContent = T.label;
    if (kind === 'engagement') {
      // a band opens with most of its crowd lit and fills as the budget climbs
      var lit = Math.round(T.crowd * (0.6 + 0.4 * w));
      el.querySelectorAll('.pr-crowd i').forEach(function (dot, i) { dot.className = i < lit ? 'is-on' : ''; });
      return;
    }
    el.querySelector('.pr-area').style.d = 'path("' + T.curve + 'V100Z")';
    el.querySelector('.pr-line').style.d = 'path("' + T.curve + '")';
    var s = 0.86 + 0.14 * w;
    el.querySelector('.pr-curve-g').style.transform = 'scaleY(' + s + ')';
    // the tip rides in CSS on the curve's end (it is placed before the dialog has a size)
    el.style.setProperty('--s', T.top * s);
  }

  function card(k, title, price, unit, sub, tags) {
    return '<button class="app-pick pr-card" type="button" data-pr-kind="' + k + '" aria-pressed="false">'
      + '<span class="pr-card-t">' + title + '</span>'
      + '<span class="pr-price"><b>' + price + '</b><span>' + unit + '</span></span>'
      + '<span class="pr-sub">' + sub + '</span>'
      + '<span class="pr-tags">' + tags + '</span></button>';
  }

  function build() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/pricing.css';
    document.head.appendChild(link);

    var d = document.createElement('dialog');
    d.className = 'pr';
    d.setAttribute('aria-labelledby', 'pr-title');
    // padding sits on .pr-in, so a click whose target is the dialog itself is the backdrop
    d.innerHTML = '<div class="pr-in">'
      + '<div class="pr-head"><h2 class="pr-title" id="pr-title">How pricing <em>works.</em></h2>'
      + '<button class="app-btn app-btn--icon app-btn--quiet" type="button" data-pr-close aria-label="Close">' + X + '</button></div>'
      + '<p class="pr-lede">Set a budget. Pay only for results.</p>'
      + '<div class="pr-cards">'
      + card('growth', 'Video growth', '$1.20', 'per 1,000 views', 'The minimum rate',
        '<span>' + ICON.play + 'Creators make the videos</span>')
      + card('engagement', 'Video engagement', '$1.00', 'per completion', 'A typical bid',
        '<span>' + ICON.eye + 'Watch</span><span>' + ICON.heart + 'Like</span><span>' + ICON.chat + 'Comment</span>')
      + '</div>'
      + '<div class="pr-calc">'
      + '<div class="pr-calc-row"><label class="pr-calc-k" for="pr-budget">Budget</label><output class="pr-calc-b" id="pr-b" for="pr-budget">$2,000</output></div>'
      + '<input class="pr-range" id="pr-budget" type="range" min="100" max="10000" step="100" value="2000">'
      + '<div class="pr-get"><div class="pr-get-text" aria-live="polite">'
      + '<p class="pr-get-k">Gets you about</p>'
      + '<p class="pr-result"><b id="pr-n">1.7M</b> <span id="pr-u">views</span></p>'
      + '<p class="pr-what" id="pr-what"></p>'
      + '<div class="pr-acts" id="pr-acts"></div></div>'
      + '<div class="pr-graph-col" aria-hidden="true"><p class="pr-tier"></p><div class="pr-graph" id="pr-graph"></div></div>'
      + '</div></div>'
      + '<p class="pr-foot">Nothing is charged while a campaign is in review. Rejected work is never charged.</p>'
      + '</div>';
    document.body.appendChild(d);

    var kind = 'growth';
    function paint() {
      var k = KIND[kind], r = d.querySelector('#pr-budget'), b = +r.value;
      // the track's blue runs to the thumb (css/pricing.css .pr-range)
      r.style.setProperty('--fill', ((b - r.min) / (r.max - r.min) * 100) + '%');
      d.querySelector('#pr-b').textContent = '$' + b.toLocaleString('en-US');
      // the create form's own floor: the figure is what the money covers, never more
      var n = Math.floor(b / k.rate) * k.per;
      roll(d.querySelector('#pr-n'), short(n));
      drawGraph(d.querySelector('#pr-graph'), kind, b);
      d.querySelector('#pr-n').title = n.toLocaleString('en-US') + ' ' + k.unit;
      d.querySelector('#pr-u').textContent = k.unit;
      d.querySelector('#pr-what').textContent = k.what + '.';
      // engagement: every completion is all three actions, so the person count is each count
      d.querySelector('#pr-acts').innerHTML = kind === 'engagement'
        ? '<span>' + ICON.eye + short(n) + ' watches</span><span>' + ICON.heart + short(n) + ' likes</span><span>' + ICON.chat + short(n) + ' comments</span>'
        : '<span>' + ICON.play + 'YouTube Shorts and Instagram Reels</span>';
      d.querySelectorAll('[data-pr-kind]').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-pr-kind') === kind)); });
    }
    d.addEventListener('input', paint);
    d.addEventListener('click', function (e) {
      if (e.target === d || e.target.closest('[data-pr-close]')) { d.close(); return; }
      var c = e.target.closest('[data-pr-kind]');
      if (c) { kind = c.getAttribute('data-pr-kind'); paint(); }
    });
    paint();
    return d;
  }

  var dialog = null;
  window.onbluePricing = function () {
    dialog = dialog || build();
    if (!dialog.open) { dialog.showModal(); }
  };
})();
