/* A campaign, opened (campaign.html): each row opens WHAT MAIN OPENS FOR IT,
   the PM's own screens, inside the app's frame (PM feedback, 2026-11-03: an
   in-review campaign should not open a report). His files are used as they
   are; this picks which of his screens to show and adjusts it from outside:
   - in review: his dashboard's in-review campaign screen (campaign.html,
     #view-campaign), carrying this campaign's own name and setup;
   - one of the six samples: his dashboard's report for that same sample (they
     share their references with the app's samples);
   - any other video engagement campaign: his engagement sample report in the
     same state (live, completed, under target);
   - any other video growth campaign: his detailed growth report
     (campaign-report/index.html).
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
  var route = !c ? { page: 'report' }
    : c.status === 'review' ? { page: 'dash', own: c.kind === 'engagement' ? 'mine-boost' : 'mine-films' }
    : HIS[c.id] ? { page: 'dash', open: HIS[c.id] }
    : c.kind === 'engagement' ? { page: 'dash', open: ENGAGE[c.status] || 'spring' }
    : { page: 'report' };
  frame.src = route.page === 'dash' ? '../campaign.html' : '../campaign-report/index.html';

  var HIDE = {
    report: 'header.top',
    dash: '.header, .site-foot, .devdock, #review, #deskonly, #view-list'
  };

  // the campaign's own name and setup on his in-review screen, in his markup
  function fillOwn(doc) {
    var growth = c.kind !== 'engagement', rate = D.rateOf(c);
    var money = function (n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var row = function (k, v) { return '<tr><td>' + k + '</td><td>' + v + '</td></tr>'; };
    doc.querySelector('[data-cam="name"]').textContent = c.title;
    // his sentence without "verified" (Appy), and in this campaign's own unit
    var note = doc.querySelector('#view-campaign .rep-empty p');
    if (note) {
      note.textContent = 'We check every campaign before it reaches the community, usually within one business day. Once it is approved and live, '
        + (growth ? 'views' : 'completions') + ', spend and proof of work appear here as they happen.';
    }
    doc.querySelector('[data-cam="meta"]').innerHTML = '<span class="chip chip--wait">In review</span>'
      + '<span>' + (growth ? 'Video growth' : 'Video engagement') + '</span>'
      + '<span>Country: <b>' + A.esc(/^us$/i.test(c.geo) ? 'United States' : c.geo) + '</b></span>'
      + '<span class="is-num">#' + A.esc(c.id) + '</span>';
    doc.querySelector('[data-cam="setup"]').innerHTML = row('Campaign budget', A.esc(c.budget))
      + row(growth ? 'Price per 1,000 views' : 'Bid per completion', rate ? money(rate) : '-')
      + row('Target ' + (growth ? 'views' : 'completions'), Number(c.target || 0).toLocaleString('en-US'))
      + row('Content review', growth ? 'Review everything' : 'Auto-approve')
      + row('Consumed', money(0))
      + row('Invoice', 'After approval');
  }

  frame.addEventListener('load', function () {
    var doc, win;
    try { doc = frame.contentDocument; win = frame.contentWindow; } catch (e) { doc = null; }
    if (doc) {
      var s = doc.createElement('style');
      s.textContent = HIDE[route.page] + ' { display: none !important; } body { background: transparent !important; }';
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
        if (route.own && win.onblueAccount) { win.onblueAccount('two'); }
        var row = doc.querySelector('[data-open="' + (route.own || route.open) + '"]');
        if (row) { row.click(); }
        if (route.own) { fillOwn(doc); }
      }
    }
    // shown even if the frame could not be read, so the screen is never hidden
    frame.classList.add('is-ready');
  });
})();
