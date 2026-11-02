/* Campaign report, part 11: the object block, the lifecycle bar, and every
   state that is not a running report: waiting, in review, rejected, no posts
   yet, unknown id, no access. Plus PM's accounting rows, last on the page. */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, A = window.onblueApp, D = window.onblueData, esc = U.esc;

  function kindOf(c) { return c.kind === 'engagement' ? 'Video engagement' : 'Video growth'; }
  function market(g) { return /^worldwide$/i.test(g || '') ? 'Worldwide' : g || ''; }
  // a budget reads the way the wizard's Review wrote it: $2,000, cents only when there are some
  function cash(n) { return Math.round(n * 100) % 100 ? U.money(n) : '$' + U.num(n); }
  function pill(c) { var s = D.STATUS[c.status] || ['Draft', 'draft']; return '<span class="app-status app-status--' + s[1] + '">' + s[0] + '</span>'; }

  R.objectBlock = function (M, opts) {
    var c = M.c, dated = M.reported || (c.brief && (c.brief.start || c.brief.startDate));
    var meta = [kindOf(c), esc(c.product), M.plats.map(function (p) { return U.PL[p].name; }).join(', '), esc(market(c.geo)),
      dated ? U.dayF(M.start) + ' to ' + U.dayF(M.end) : 'Ends ' + U.dayF(M.end),
      '<button class="rp-hash" type="button" data-copy-id="#' + c.id + '" title="Copy campaign ID">#' + c.id + '</button>'];
    return '<div class="rp-obj"><div class="rp-obj-main"><div class="rp-obj-title"><h1 class="app-title">' + esc(c.title) + '</h1>' + pill(c) + '</div>'
      + '<p class="rp-meta">' + meta.join(' &middot; ') + '</p></div>'
      // an ended campaign's numbers no longer move: no clock, nothing to refresh
      + (M.reported ? '<div class="rp-obj-side">' + (M.live ? '<span id="updated">' + R.ago() + '</span>'
        + '<button class="app-btn app-btn--sm app-btn--icon app-btn--quiet" type="button" id="btn-refresh" aria-label="Refresh numbers">' + U.IC.refresh + '</button>' : '<span>Final numbers</span>') + '</div>' : '')
      + '</div>';
  };

  /* Submitted, In review, Live, Completed: where the campaign is, at a glance (FL P18). */
  R.lifecycle = function (M) {
    // a rejected campaign never runs, so its bar stops where it did
    var s = M.c.status, labels = s === 'rejected' ? ['Submitted', 'Rejected'] : ['Submitted', 'In review', 'Live', 'Completed'];
    var at = { waiting: 0, review: 1, rejected: 1, live: 2, completed: 4, under: 4 }[s];
    if (at === undefined) { return ''; }
    var note = {
      waiting: 'Goes into review once ' + esc(A.session.agency) + ' is approved',
      review: '', // the setup card's own line already says one working day
      live: M.left <= 0 ? 'Ends today' : 'Ends in ' + U.plural(M.left, 'day'),
      completed: 'Ended ' + U.dayF(M.end), under: 'Ended ' + U.dayF(M.end), rejected: ''
    }[s];
    return '<div class="rp-life"><ol class="rp-life-segs" aria-label="Campaign progress">' + labels.map(function (l, i) {
      var cls = i < at ? 'is-done' : i === at ? (s === 'rejected' ? 'is-bad' : 'is-now') : '';
      var txt = i === at && s === 'rejected' ? 'Rejected' : l;
      return '<li class="' + cls + '"' + (i === at ? ' aria-current="step"' : '') + '><i></i><span>' + txt + '</span></li>';
    }).join('') + '</ol>' + (note ? '<p class="rp-life-note">' + note + '</p>' : '') + '</div>';
  };

  /* ---- campaign setup, read only: what the agency entered, not a recomputed guess.
     THE WIZARD'S REVIEW STEP, ROW FOR ROW (new-review.js): same order, same
     labels, so the screen after Submit agrees with the screen before it. Its
     working fields (budgetPick, budgetCustom) are not rows; review is PM's Content
     review row, and zone is said once under the list. ---- */
  // "Nov 3, 09:00": the time zone is said once, under the list
  function when(date, time) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || '');
    if (!m) { return ''; }
    return U.dayF(new Date(+m[1], +m[2] - 1, +m[3])) + ', ' + (time || '00:00');
  }
  function briefRows(M, b) {
    var growth = M.growth, plats = M.plats.map(function (p) { return U.PL[p].name; }).join(', ');
    var t = function (v) { return String(v || '').trim(); };
    // a third cell marks a long value: it gets the full width under its label
    var rows = [['Type', kindOf(M.c)], [growth ? 'Platforms' : 'Platform', plats], ['Campaign name', esc(t(b.name) || M.c.title), 1], ['Product', esc(t(b.product) || M.c.product)]];
    if (growth) {
      var vids = [t(b.refs), t(b.refsFiles)].filter(Boolean).join('\n');
      if (t(b.site)) { rows.push(['Reference websites', esc(t(b.site)), 1]); }
      if (vids) { rows.push(['Reference videos', '<span class="rp-pre">' + esc(vids) + '</span>', 1]); }
    } else {
      if (t(b.postUrl)) { rows.push(['Video', esc(t(b.postUrl)), 1]); }
      if (b.actions && b.actions.length) { rows.push(['Action', esc(b.actions.join(', '))]); }
    }
    rows.push(['Campaign budget', cash(M.budget)], [growth ? 'Rate per 1,000 views' : 'Bid per completion', U.money(Number(b.bid) || M.rate)]);
    if (when(b.startDate, b.startTime)) { rows.push(['Starts', esc(when(b.startDate, b.startTime))]); }
    if (when(b.endDate, b.endTime)) { rows.push(['Ends', esc(when(b.endDate, b.endTime))]); }
    rows.push(['Market', esc(t(b.market) || market(M.c.geo))]);
    // PM's setup row: whether we approve each video or it goes straight out (the type's default)
    if (t(b.review)) { rows.push(['Content review', esc(t(b.review))]); }
    if (t(b.note)) { rows.push(['Notes', '<span class="rp-pre">' + esc(t(b.note)) + '</span>', 1]); }
    return rows;
  }
  function setupRows(M) {
    var c = M.c, b = c.brief;
    var rows = b && b.type ? briefRows(M, b)
      : [['Type', kindOf(c)], ['Platforms', M.plats.map(function (p) { return U.PL[p].name; }).join(', ')], ['Product', esc(c.product)],
        ['Campaign budget', cash(M.budget)], [M.growth ? 'Rate per 1,000 views' : 'Bid per completion', U.money(M.rate)],
        ['Target ' + (M.growth ? 'views' : 'completions'), U.num(M.target)], ['Market', esc(market(c.geo))], ['Ends', U.dateF(M.end)]];
    // PM's money rows while nothing has run yet (campaign.html in-review card)
    if (c.status === 'waiting' || c.status === 'review') { rows.push(['Consumed', U.money(0)], ['Invoice', 'After approval']); }
    if (c.createdAt) { rows.push(['Created', U.dateF(c.createdAt)]); }
    return rows.map(function (r) { return '<div class="rp-dl-row' + (r[2] ? ' is-long' : '') + '"><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
  }
  function setupCard(M, foot) {
    var zone = M.c.brief && M.c.brief.zone ? 'Times are in ' + esc(M.c.brief.zone) + '.' : '';
    foot = [foot, zone].filter(Boolean).join(' ');
    return '<aside class="rp-card rp-setup"><h2 class="app-sect-title">Campaign setup</h2><p class="rp-hint">What you defined.</p>'
      + '<dl class="rp-dl rp-dl--plain">' + setupRows(M) + '</dl>' + (foot ? '<p class="rp-foot">' + foot + '</p>' : '') + '</aside>';
  }

  R.waitingView = function (M) {
    var waiting = M.c.status === 'waiting', sample = M.growth ? 'a15d7f22' : '7c2d91e4';
    var what = M.growth ? 'Views, spend and posts' : 'Completions, spend and proof of work';
    return '<div class="rp-wait"><div class="rp-card rp-wait-main"><span class="rp-icon-tile">' + U.IC.clock + '</span>'
      + '<h2 class="app-display rp-wait-h">Your report starts when it goes <em>live.</em></h2>'
      + '<p>' + (waiting ? 'It goes into review once ' + esc(A.session.agency) + ' is approved. ' : 'We check every campaign before it goes live, usually within one working day. ')
      + what + ' appear here as they happen.</p>'
      + '<a class="app-btn" href="campaign.html?id=' + sample + '">See a sample report</a></div>'
      + setupCard(M, 'Nothing is charged while the campaign is in review.') + '</div>';
  };

  R.rejectedBanner = function (M) {
    return '<div class="app-banner rp-banner--error" role="alert">' + U.IC.alert + '<span>This campaign did not run: ' + esc(M.c.reason || 'no reason given') + '.</span>'
      + '<a class="app-btn app-btn--sm rp-banner-act" href="new.html?from=' + encodeURIComponent(M.c.id) + '">Create a copy</a></div>';
  };
  R.rejectedView = function (M) { return '<div class="rp-wait rp-wait--solo">' + setupCard(M, 'Nothing was charged.') + '</div>'; };

  R.unknownView = function () {
    return '<section class="app-empty"><h2>We couldn\'t find that <em>campaign.</em></h2>'
      + '<p>Check the link, or find it in your campaigns.</p><p class="rp-empty-cta"><a class="app-btn" href="campaigns.html">Back to campaigns</a></p></section>';
  };

  // H1: copy kept from PM's campaign-report/index.html; never names the campaign or the brand
  R.noAccessView = function (id, other) {
    return '<section class="app-empty rp-noaccess"><h2>You don\'t have permission to access this report</h2>'
      + '<p>Ask the owner to turn on link sharing.</p><p class="rp-noaccess-own">Is this your report? '
      + '<a class="app-link" href="campaign.html?id=' + encodeURIComponent(id) + '">' + (other ? 'Switch account' : 'Sign in') + '</a></p></section>';
  };

  /* No posts yet (FL P29, DUB 4.1): the answer first, then the report's real
     shape, dimmed, under it. The dimmed numbers come from a zeroed copy of the
     model (R.zero), so they are zeros even when the dock forces this state. */
  R.zero = function (M) {
    var Z = Object.create(M);
    Z.done = 0;
    if (M.growth) { Z.posts = []; } else {
      Z.eng = Object.assign({}, M.eng, { daily: M.eng.daily.map(function () { return 0; }), verified: 0, wait: 0, bad: 0, rows: [] });
    }
    return Z;
  };
  R.veil = function (inner, M) {
    var ended = !M.live;
    var title = M.growth ? (ended ? 'No posts <em>this time.</em>' : 'No posts <em>yet.</em>') : 'No completions <em>yet.</em>';
    var body = M.growth
      ? (ended ? 'The campaign ended before any creator posted. Nothing was charged.' : 'Creators usually post within 48 hours of launch. We\'ll fill this in as they do.')
      : 'Members usually start within a few hours of launch.';
    return '<div class="rp-veil"><div class="rp-card rp-veil-msg"><span class="rp-icon-tile">' + U.IC.posts + '</span><h2 class="app-display">' + title + '</h2><p>' + body + '</p></div>'
      + '<div class="rp-veil-ghost"><div class="rp-veil-under" aria-hidden="true" inert>' + inner + '</div></div></div>';
  };

  /* ---- PM's accounting rows (report.js:395-404, campaign.html engagement) ---- */
  R.accounting = function (M, X) {
    var row = function (l, v, work, cls) {
      return '<div class="rp-dl-row' + (cls ? ' ' + cls : '') + '"><dt>' + l + (work ? '<span>' + work + '</span>' : '') + '</dt><dd>' + v + '</dd></div>';
    };
    var rows;
    if (M.growth) {
      var views = X.cumAll[X.cumAll.length - 1] || 0, spent = views * M.rate / 1000, over = spent - M.budget;
      rows = row('Campaign budget', U.money(M.budget)) + row('Cost per 1,000 views', U.money(M.rate))
        + row('Amount spent', U.money(spent), U.num(views) + ' &times; $' + (M.rate / 1000).toFixed(4))
        + (over > 0.004 ? row('Over budget', U.money(over), U.num(views - M.target) + ' views past the ' + U.num(M.target) + ' the budget covers', 'is-total is-warn')
          : row('Remaining', U.money(M.budget - spent), '', 'is-total'));
    } else {
      var inv = parseInt(M.id.replace(/[^0-9a-f]/gi, '').slice(-4), 16) % 900 + 100, used = M.done * M.rate;
      rows = row('Campaign budget', U.money(M.budget)) + row('Bid per completion', U.money(M.rate))
        + row('Consumed', U.money(used), U.num(M.done) + ' &times; ' + U.money(M.rate)) + row('Remaining', U.money(Math.max(0, M.budget - used)), '', 'is-total')
        + row('Invoice INV-2026-' + inv, 'Paid');
    }
    return '<section class="rp-card rp-acct"><div class="rp-card-head"><div><h2 class="app-sect-title">Accounting</h2>'
      + '<p class="rp-hint">The whole campaign, whatever the range or platform above.</p></div></div>'
      + '<dl class="rp-dl rp-dl--plain">' + rows + '</dl>'
      + '<p class="rp-foot">If the campaign closes under target, unconsumed budget is settled per the make-good policy in your agreement.</p></section>';
  };
})();
