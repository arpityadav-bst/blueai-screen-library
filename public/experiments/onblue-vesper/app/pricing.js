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
      + '<div class="pr-get" aria-live="polite">'
      + '<p class="pr-get-k">Gets you about</p>'
      + '<p class="pr-result"><b id="pr-n">1.7M</b> <span id="pr-u">views</span></p>'
      + '<p class="pr-what" id="pr-what"></p>'
      + '<div class="pr-acts" id="pr-acts"></div>'
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
      d.querySelector('#pr-n').textContent = short(n);
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
