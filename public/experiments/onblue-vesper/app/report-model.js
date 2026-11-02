/* Campaign report, part 2: one campaign row in, one report model out.
   THE ONLY INPUTS ARE THE ROW'S OWN NUMBERS (done, target, spent, budget,
   platforms, dates), so the report cannot disagree with the list that led to
   it: the posts add up to the views, spend is views x rate, the chart ends on
   the headline. PM's BlueAIGoLive row reuses his sample-posts.js, scaled to
   the row's views. Every other campaign is generated from its id. */
(function () {
  'use strict';

  var R = window.onblueRep, S = R.seed, D = window.onblueData;
  var DAY = 864e5;
  // PM's report read YouTube at 09:50; the app's TODAY is that morning
  var NOW = D.TODAY.getTime() + (9 * 60 + 50) * 60000;
  var MON = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');
  var REPORTED = { live: 1, completed: 1, under: 1 };

  function amount(s) { return parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0; }
  function midnight(t) { var d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* When it started: the wizard's own answer if the agency made it, else a
     date in the name ("India_test_16Oct", "promo_Oct1"), else a run length
     picked from the id. */
  function startOf(c, end, h) {
    var b = c.brief || {};
    // the wizard's date and time, read as local: Date.parse('YYYY-MM-DD') is UTC midnight
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(b.startDate || ''), tm = String(b.startTime || '00:00').split(':');
    if (dm) { return new Date(+dm[1], +dm[2] - 1, +dm[3], +tm[0] || 0, +tm[1] || 0).getTime(); }
    var t = Date.parse(b.start || '');
    if (!isNaN(t)) { return t; }
    var m = /(\d{1,2})(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.exec(c.title);
    var m2 = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(\d{1,2})(?!\d)/i.exec(c.title);
    if (m) { t = new Date(2026, MON.indexOf(m[2].toLowerCase()), +m[1], 12, 55).getTime(); }
    else if (m2) { t = new Date(2026, MON.indexOf(m2[1].toLowerCase()), +m2[2], 12, 55).getTime(); }
    else { t = end - [14, 21, 28, 30][h % 4] * DAY + 12 * 3600000; }
    if (c.status === 'live' && t > NOW - 2 * DAY) { t = midnight(NOW - (3 + h % 5) * DAY) + 12 * 3600000; }
    return Math.min(t, end - DAY / 2);
  }

  function base(c) {
    var h = S.hash(c.id), growth = c.kind !== 'engagement';
    var end = Date.parse(c.ends) || NOW + 14 * DAY;
    var start = startOf(c, end, h);
    var budget = amount(c.budget), target = c.target || 0;
    var M = {
      c: c, id: c.id, growth: growth, plats: (c.platforms || ['youtube']).slice(), h: h,
      budget: budget, target: target, done: c.done || 0,
      // the agency's own price: per 1,000 views for growth, per completion for
      // engagement; data.js holds the rule so the Campaigns list bills the same
      rate: D.rateOf(c),
      start: start, end: end, now: NOW, live: c.status === 'live' && NOW < end,
      reported: !!REPORTED[c.status], posts: [], creators: []
    };
    M.lastT = Math.min(NOW, end);
    M.day0 = midnight(start);
    M.DAYS = Math.max(1, Math.round((midnight(M.lastT - 1) - M.day0) / DAY) + 1);
    M.dayIndex = function (t) { return clamp(Math.round((midnight(t) - M.day0) / DAY), 0, M.DAYS - 1); };
    M.dayDate = function (k) { var d = new Date(M.day0); return new Date(d.getFullYear(), d.getMonth(), d.getDate() + k); };
    M.left = Math.max(0, Math.ceil((end - NOW) / DAY));
    // today is only part done while the campaign runs, so it carries part of a day's work
    M.partial = M.live ? (NOW - midnight(NOW)) / DAY : 1;
    return M;
  }

  // a post's views, spread over the days after it went up and fading like real posts do
  function days(M, p, r) {
    var tau = 1.5 + r() * 3, w = [], k;
    for (k = 0; k < M.DAYS; k++) {
      var on = k < p.d0 ? 0 : Math.exp(-(k - p.d0) / tau) + 0.015;
      if (k === M.DAYS - 1) { on *= M.partial; }
      w.push(on);
    }
    return S.spread(p.views, w);
  }

  function fromPm(M) {
    var raw = (window.REPORT_POSTS || []).filter(function (x) { return Date.parse(x.at) <= NOW; });
    var r = S.rng(M.h), by = {};
    var totals = S.spread(M.done, raw.map(function (x) { return x.views; }));
    var f = M.done / Math.max(1, raw.reduce(function (s, x) { return s + x.views; }, 0));
    raw.forEach(function (x, i) {
      var c = by[x.h];
      if (!c) {
        c = by[x.h] = { id: 'c' + M.creators.length, name: x.c, handle: x.h, subs: 0, hue: Math.floor(r() * 360), plat: 'youtube' };
        M.creators.push(c);
      }
      c.subs = Math.max(c.subs, x.subs || 0);
      // his days end on Oct 21; any later day of this campaign is a day with nothing in it yet
      var dw = [];
      for (var k = 0; k < M.DAYS; k++) { dw.push((x.d || [])[k] || 0); }
      var d = S.spread(totals[i], dw);
      M.posts.push({
        id: 'p' + (i + 1), creator: c, plat: 'youtube', shape: 'tall', title: x.t, th: x.th, vid: x.v,
        emoji: S.EMOJI[(i * 5) % S.EMOJI.length], hue: (i * 47 + 200) % 360,
        at: Date.parse(x.at), d0: M.dayIndex(Date.parse(x.at)), views: totals[i], d: d,
        likes: Math.round((x.likes || 0) * f), comments: Math.round((x.comments || 0) * f), saves: 0,
        status: x.live ? 'live' : 'removed', url: 'https://www.youtube.com/shorts/' + x.v
      });
    });
  }

  function generate(M) {
    if (!M.done) { return; }
    var r = S.rng(M.h ^ 0x51ed), taken = {};
    var n = clamp(Math.round(Math.sqrt(M.done) / 3.2), 1, Math.min(140, M.done));
    var two = M.plats.length > 1 && n > 1;
    var share = two ? 0.48 + r() * 0.22 : 1;
    var split = two ? S.spread(M.done, [share, 1 - share]) : [M.done];
    var span = M.lastT - M.start;
    (two ? M.plats : [M.plats[0]]).forEach(function (plat, pi) {
      var np = two ? (pi === 0 ? Math.max(1, Math.round(n * share)) : Math.max(1, n - Math.round(n * share))) : n;
      var nc = Math.max(1, Math.round(np * (0.35 + r() * 0.2)));
      var own = [], k;
      for (k = 0; k < nc; k++) {
        var c = S.creator(plat, r, taken);
        c.id = 'c' + M.creators.length;
        M.creators.push(c);
        own.push(c);
      }
      var list = [];
      for (k = 0; k < np; k++) {
        var at = M.start + Math.pow(r(), 1.1) * span * 0.97;
        var age = (M.lastT - at) / span;
        var shape = plat === 'instagram' ? 'tall' : r() < 0.25 ? 'wide' : 'tall';
        var vid = S.videoId(r, plat === 'instagram' ? 10 : 11);
        list.push({
          creator: own[Math.floor(Math.pow(r(), 1.6) * nc)], plat: plat, shape: shape,
          title: S.title(plat === 'instagram' ? 'reel' : shape, M.c.product, r), vid: vid, th: null,
          emoji: S.pick(S.EMOJI, r), hue: Math.floor(r() * 360), at: Math.round(at), d0: M.dayIndex(at),
          w: (0.04 + Math.pow(r(), 3)) * (0.35 + 0.65 * age),
          lk: plat === 'instagram' ? 0.025 + r() * 0.035 : 0.012 + r() * 0.02,
          cm: 0.0006 + r() * 0.002, sv: 0.004 + r() * 0.01,
          status: r() < 0.03 ? 'removed' : 'live', url: S.urlOf(plat, shape, vid)
        });
      }
      var views = S.spread(split[pi], list.map(function (p) { return p.w; }));
      list.forEach(function (p, i) {
        p.views = views[i];
        p.d = days(M, p, r);
        p.likes = Math.round(p.views * p.lk);
        p.comments = Math.round(p.views * p.cm);
        p.saves = plat === 'instagram' ? Math.round(p.views * p.sv) : 0;
        M.posts.push(p);
      });
    });
    M.posts.sort(function (a, b) { return a.at - b.at; });
    M.posts.forEach(function (p, i) { p.id = 'p' + (i + 1); });
  }

  /* Engagement: completions by day, PM's under review and rejected shares (6 and 9
     against 212), the board, the agency's own video and the proof-of-work log. */
  function engage(M) {
    var r = S.rng(M.h ^ 0x2f17), k;
    var total = M.done, w = [];
    for (k = 0; k < M.DAYS; k++) { w.push((k < 2 ? 0.5 + 0.25 * k : 1) * (0.7 + 0.6 * r()) * (k === M.DAYS - 1 ? M.partial : 1)); }
    var e = M.eng = {
      verified: total,
      wait: M.live ? Math.round(total * 0.028) : 0,
      bad: Math.round(total * 0.042),
      daily: S.spread(total, w),
      claimed: Math.max(1, Math.round(total * 0.057)),
      today: Math.max(1, Math.round(total * 0.104))
    };
    e.open = Math.max(0, M.target - total - e.claimed);
    var plat = M.plats[0], vid = S.videoId(r, plat === 'instagram' ? 10 : 11);
    e.post = {
      plat: plat, shape: 'tall', vid: vid, th: null, title: S.title(plat === 'instagram' ? 'reel' : 'short', M.c.product, r),
      emoji: S.pick(S.EMOJI, r), hue: Math.floor(r() * 360), url: S.urlOf(plat, 'tall', vid),
      creator: { name: M.c.product, plat: plat }
    };
    var all = e.verified + e.wait + e.bad, n = Math.min(all, 60), t = M.lastT, gap = (M.lastT - M.start) / Math.max(1, all);
    e.rows = [];
    for (k = 0; k < n; k++) {
      t -= gap * (0.3 + r() * 1.4);
      var st = k < 15 && r() < Math.min(0.5, e.wait / Math.max(1, all) * 4) ? 'wait' : r() < e.bad / Math.max(1, all) ? 'bad' : 'ok';
      var acts = st === 'bad' ? (r() < 0.5 ? ['Watch'] : ['Watch', 'Like']) : st === 'ok' && r() < 0.15 ? ['Watch', 'Like'] : ['Watch', 'Like', 'Comment'];
      var quote = st === 'bad' ? S.pick(S.FAILS, r) : st === 'wait' ? 'Comment posted, awaiting platform indexing'
        : acts.indexOf('Comment') >= 0 ? S.pick(S.QUOTES, r) : '';
      e.rows.push({ n: all - k, at: Math.max(M.start, Math.round(t)), day: M.dayIndex(Math.max(M.start, t)), acts: acts, quote: quote, st: st, ev: st === 'ok' && acts.length === 3 ? 2 : 1 });
    }
  }

  R.model = function (c) {
    var M = base(c);
    if (!M.reported) { return M; }
    if (!M.growth) { engage(M); return M; }
    if (c.id === 'a667ef59' && window.REPORT_POSTS) { fromPm(M); } else { generate(M); }
    return M;
  };
  R.NOW = NOW;
  R.DAY = DAY;
})();
