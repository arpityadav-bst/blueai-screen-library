/* A campaign, opened (campaign.html): each row opens WHAT MAIN OPENS FOR IT,
   the PM's own screens, inside the app's frame (PM feedback, 2026-11-03: an
   in-review campaign should not open a report). His files are used as they
   are; this picks which of his screens to show and adjusts it from outside:
   - in review: his dashboard's in-review campaign screen (campaign.html,
     #view-campaign), carrying this campaign's own name and setup;
   - an engagement sample: his dashboard's report for that same sample (they
     share their references with the app's samples);
   - any other video engagement campaign: his engagement sample report in the
     same state (live, completed, under target);
   - any other video growth campaign, a sample too: his detailed growth report
     (campaign-report/index.html), so every growth campaign opens one design.
   His header, footer, list and dev dock are hidden, his page ground gives way
   to the content area's tone, and every way back leaves for the app's list. */
(function () {
  'use strict';

  var D = window.onblueData, A = window.onblueApp;
  var frame = document.getElementById('pm-report');
  if (!frame) { return; }

  var c = D.find(new URLSearchParams(location.search).get('id') || '');
  var HIS = { '7c2d91e4': 'spring', '4b0a63f7': 'collab', 'd21e88ac': 'anthem', '09c4b3d5': 'summer', 'a15d7f22': 'northline', '3e81b0c5': 'fernweh' };
  var ENGAGE = { live: 'spring', completed: 'anthem', under: 'summer' };
  // opening a sample ticks Get started's step, in the sidebar already drawn too
  if (c && window.onblueSideLists && D.isSample(c)) { window.onblueSideLists.sawSample(); if (A.refreshSide) { A.refreshSide(); } }
  var route = !c ? { page: 'report' }
    : c.status === 'review' ? { page: 'dash', own: c.kind === 'engagement' ? 'mine-boost' : 'mine-films' }
    : HIS[c.id] && c.kind === 'engagement' ? { page: 'dash', open: HIS[c.id] }
    : c.kind === 'engagement' ? { page: 'dash', open: ENGAGE[c.status] || 'spring' }
    : { page: 'report' };
  /* his growth report's FINAL top cards are "Compact" (PM, 2026-11-05). His
     report starts on "Current" unless the browser remembers a pick, and this
     app runs on its own address, so it never had one: set Compact as the
     starting pick (same origin as his report), keeping any pick made since */
  if (route.page === 'report') {
    try { if (!window.localStorage.getItem('campaign-report:tiles')) { window.localStorage.setItem('campaign-report:tiles', 'compact'); } } catch (e) {}
  }
  frame.src = route.page === 'dash' ? '../campaign.html' : '../campaign-report/index.html';

  var HIDE = {
    report: 'header.top',
    dash: '.header, .site-foot, .devdock, #review, #deskonly, #view-list'
  };
  /* his dashboard steps aside for a "use a desktop" screen under 900px, and the
     report area is often narrower than that; inside the app it always shows */
  var SHOW = { report: '', dash: '#dash, #dash[hidden] { display: block !important; }' };

  // the campaign's own name and setup on his in-review screen, in his markup
  function fillOwn(doc) {
    var growth = c.kind !== 'engagement', rate = D.rateOf(c);
    var money = function (n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var row = function (k, v) { return '<tr><td>' + k + '</td><td>' + v + '</td></tr>'; };
    doc.querySelector('[data-cam="name"]').textContent = c.title;
    // his sentence without "verified" (Appy), and in this campaign's own unit
    // waiting reads as a clock; his circular arrow read as "refresh"
    var ic = doc.querySelector('#view-campaign .rep-empty-ic');
    if (ic) { ic.innerHTML = A.icons.clock; }
    // one way back (the link at the top); a sample offers no "sample report" of itself
    var cta = doc.querySelector('#view-campaign .rep-empty-cta');
    if (cta) {
      // style, not the hidden attribute: his .btn sets its own display, which would win
      cta.querySelectorAll('[data-back]').forEach(function (b) { b.style.display = 'none'; });
      var sample = cta.querySelector('[data-sample]');
      if (sample && D.isSample(c)) { cta.style.display = 'none'; }
    }
    var note = doc.querySelector('#view-campaign .rep-empty p');
    if (note) {
      note.textContent = 'We check every campaign before it reaches the community, usually within one business day. Once it is approved and live, '
        + (growth ? 'views' : 'completions') + ', spend and proof of work appear here as they happen.';
    }
    doc.querySelector('[data-cam="meta"]').innerHTML = '<span class="chip chip--wait">In review</span>'
      + '<span>' + (growth ? 'Video growth' : 'Video engagement') + '</span>'
      + '<span>Country: <b>' + A.esc(/^us$/i.test(c.geo) ? 'United States' : c.geo) + '</b></span>'
      + '<span class="is-num">#' + A.esc(c.id) + '</span>';
    // no target row: we can't guarantee a number of views (PM, 2026-11-03)
    doc.querySelector('[data-cam="setup"]').innerHTML = row('Campaign budget', A.esc(c.budget))
      + row(growth ? 'Price per 1,000 views' : 'Bid per completion', rate ? money(rate) : '-')
      + row('Content review', growth ? 'Review everything' : 'Auto-approve')
      + row('Consumed', money(0))
      + row('Invoice', 'After approval');
  }

  /* WHAT IS AHEAD, ON THE IN-REVIEW SCREEN (Appy): his two cards left most of
     the area empty, which read as "nothing here". Above them, where the
     campaign is on its way (Submitted, In review, Live, Report); below them, a
     faded outline of the report it will get, in his own report's parts (tiles,
     a chart card, a list), with one line on top of it. Ours, added from
     outside, styled with his classes plus a few of its own (ob-). */
  var AHEAD_CSS = '.ob-steps { display: flex; gap: 8px; margin: 0 0 20px; padding: 0; list-style: none; }'
    + '.ob-steps li { flex: 1; display: flex; align-items: center; gap: 8px; padding: 12px 14px; border: 1px solid rgba(0,0,0,.08); border-radius: 12px; background: #fff; color: #767b85; font-size: 13px; font-weight: 500; }'
    + '.ob-steps i { flex: none; display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,.05); color: #767b85; font-style: normal; font-size: 11px; font-weight: 600; }'
    + '.ob-steps .is-done { color: #0b0b0d; } .ob-steps .is-done i { background: rgba(22,163,74,.12); color: #15803d; }'
    + '.ob-steps .is-now { border-color: rgba(21,110,254,.4); background: rgba(21,110,254,.06); color: #0b0b0d; } .ob-steps .is-now i { background: #156efe; color: #fff; }'
    + '.ob-ghost { position: relative; margin-top: 20px; }'
    + '.ob-ghost-in { opacity: .35; pointer-events: none; user-select: none; }'
    + '.ob-bar { display: block; height: 10px; margin-top: 10px; border-radius: 999px; background: rgba(0,0,0,.07); }'
    + '.ob-chart { height: 180px; margin-top: 14px; border-radius: 10px; background: linear-gradient(180deg, rgba(21,110,254,.06), rgba(21,110,254,0)); }'
    + '.ob-row { display: block; height: 14px; margin-top: 14px; border-radius: 999px; background: rgba(0,0,0,.06); }'
    // the line over the outline is the one thing to read there: larger, lifted, with its own mark
    + '.ob-ghost-say { position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%); display: grid; justify-items: center; gap: 4px; padding: 26px 40px 28px; border: 1px solid rgba(0,0,0,.1); border-radius: 18px; background: #fff; box-shadow: 0 24px 60px -18px rgba(18,32,64,.38), 0 2px 6px rgba(18,32,64,.06); text-align: center; font-size: 19px; font-weight: 600; letter-spacing: -0.015em; color: #0b0b0d; white-space: nowrap; }'
    + '.ob-ghost-say i { display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 8px; border-radius: 12px; background: rgba(21,110,254,.08); color: #156efe; }'
    + '.ob-ghost-say span { display: block; font-size: 15px; font-weight: 400; letter-spacing: -0.005em; color: #5f636b; }';
  var CHART = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16"/><path d="M6 16l4-5 3 3 5-7"/></svg>';
  function addAhead(doc) {
    var cam = doc.getElementById('view-campaign'), grid = cam && cam.querySelector('.rep-grid');
    if (!grid || cam.querySelector('.ob-steps')) { return; }
    var growth = c.kind !== 'engagement';
    var css = doc.createElement('style');
    css.textContent = AHEAD_CSS;
    doc.head.appendChild(css);
    var steps = [['Submitted', 'is-done', '&#10003;'], ['In review', 'is-now', '2'], ['Live', '', '3'], ['Report', '', '4']];
    grid.insertAdjacentHTML('beforebegin', '<ol class="ob-steps" aria-label="Where this campaign is">'
      + steps.map(function (s) { return '<li class="' + s[1] + '"' + (s[1] === 'is-now' ? ' aria-current="step"' : '') + '><i aria-hidden="true">' + s[2] + '</i>' + s[0] + '</li>'; }).join('') + '</ol>');
    var tiles = (growth ? ['Fill', 'Views', 'Spend', 'Days remaining'] : ['Fill', 'Completed', 'Spend', 'Under review', 'Days remaining'])
      .map(function (l) { return '<div class="tile"><span class="tile-l">' + l + '</span><span class="ob-bar" style="width: 60%"></span><span class="ob-bar" style="width: 40%; height: 8px"></span></div>'; }).join('');
    grid.insertAdjacentHTML('afterend', '<section class="ob-ghost" aria-label="Your report, once the campaign is live">'
      + '<div class="ob-ghost-in" aria-hidden="true">'
      + '<div class="tiles ' + (growth ? 'tiles--four' : 'tiles--five') + '">' + tiles + '</div>'
      + '<div class="card dash-panel" style="margin-top: 16px"><h2 class="rep-h">' + (growth ? 'Views over time' : 'Progress') + '</h2><div class="ob-chart"></div></div>'
      + '<div class="card dash-panel" style="margin-top: 16px"><h2 class="rep-h">' + (growth ? 'Posts' : 'Proof of work') + '</h2>'
      + '<span class="ob-row"></span><span class="ob-row" style="width: 88%"></span><span class="ob-row" style="width: 94%"></span></div></div>'
      + '<p class="ob-ghost-say"><i aria-hidden="true">' + CHART + '</i>Your report starts here once it&rsquo;s live.<span>' + (growth ? 'Views' : 'Completions') + ', spend and proof of work, as they happen.</span></p>'
      + '</section>');
  }

  /* NO "VERIFIED" (Appy, 2026-11-03), on his screens too. Phrase by phrase so
     each still reads, then the word itself; kept on while his report repaints
     (filters, pages), since he rebuilds its text as it is used. */
  var WORDS = [
    [/only verified runs bill/g, 'only completed runs bill'],
    [/Every verified run/g, 'Every completed run'],
    [/\b[Vv]erified\s+(?=[a-z])/g, ''],
    [/^Verification$/, 'Completion checks'],
    [/\bVerified\b/g, 'Completed'],
    [/\b([Dd])id not verify\b/g, '$1id not pass'],
    [/\bdoes not verify\b/g, 'does not pass']
  ];
  function reword(root) {
    var walk = root.ownerDocument.createTreeWalker(root, 4), n;
    while ((n = walk.nextNode())) {
      var t = n.nodeValue, u = t;
      WORDS.forEach(function (w) { u = u.replace(w[0], w[1]); });
      if (u !== t) { n.nodeValue = u; }
    }
  }
  function keepReworded(doc) {
    var main = doc.getElementById('dash') || doc.querySelector('main') || doc.body;
    reword(main);
    var mo = new MutationObserver(function () { mo.disconnect(); reword(main); watch(); });
    function watch() { mo.observe(main, { childList: true, subtree: true, characterData: true }); }
    watch();
  }

  frame.addEventListener('load', function () {
    var doc, win;
    try { doc = frame.contentDocument; win = frame.contentWindow; } catch (e) { doc = null; }
    if (doc) {
      var s = doc.createElement('style');
      s.textContent = HIDE[route.page] + ' { display: none !important; } body { background: transparent !important; } ' + SHOW[route.page];
      doc.head.appendChild(s);
      // every way back on his screens is the app's list
      doc.addEventListener('click', function (e) {
        var back = e.target.closest && e.target.closest('[data-back], a.back');
        if (!back) { return; }
        e.preventDefault();
        e.stopPropagation();
        window.location.href = 'campaigns.html';
      }, true);
      if (route.page === 'dash') {
        // his review dock may have left his page on its "in review" stage
        if (win.onblueStage) { win.onblueStage('approved'); }
        if (route.own && win.onblueAccount) { win.onblueAccount('two'); }
        var row = doc.querySelector('[data-open="' + (route.own || route.open) + '"]');
        if (row) { row.click(); }
        if (route.own) { fillOwn(doc); addAhead(doc); }
        // one way back: the link at the top, not also the sample banner's button
        doc.querySelectorAll('#view-report [data-rep="banner"] [data-back]').forEach(function (b) { b.style.display = 'none'; });
      }
      keepReworded(doc);
    }
    // shown even if the frame could not be read, so the screen is never hidden
    frame.classList.add('is-ready');
  });
})();
