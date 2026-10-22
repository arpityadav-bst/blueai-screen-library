/* Campaign report prototype: sample data plus all rendering.
   The numbers are generated from a fixed seed so every reload shows the same
   report, and they add up the way the live page's do (views x $1.20 per 1,000 =
   spend, the chart ends on the Views tile, the posts sum to the totals).

   DATE RANGE. Every post keeps its views per day, so a range means "views
   gathered between these days", the way YouTube Studio reads a period. Likes,
   comments and countries in a range are scaled from the post's lifetime figures
   by its share of views, which is a sample-data shortcut: the real report would
   need daily snapshots for all three. Budget figures (fill, remaining, time
   left, accounting) are the campaign's state and never follow the range. */
(function () {
  'use strict';

  /* ---- the campaign -------------------------------------------------------- */
  var DAY = 86400000;
  var META = window.REPORT_META || {};
  var NOW = Date.parse(META.asOf) || new Date(2026, 9, 21, 15, 0).getTime();   // when YouTube was read
  var START = new Date(2026, 9, 1, 12, 55).getTime();
  var C = {
    name: 'BlueAIGoLive_promo_Oct1',
    product: 'BlueAI',
    ref: 'a667ef59',
    country: 'WORLDWIDE',
    ends: new Date(2026, 10, 1).getTime(),
    budget: 100,
    cpm: 1.2,
    views: 0          // the posts' real total, filled in below
  };
  C.target = Math.floor(C.budget / C.cpm * 1000);

  /* ---- seeded random ------------------------------------------------------- */
  var seed = 20261019;
  function R() {
    seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function rand(a, b) { return a + (b - a) * R(); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }

  /* ---- the posts -----------------------------------------------------------
     window.REPORT_POSTS comes from one of two files with the same shape:
     real-posts.js (the local review copy: every Short a member posted, with real
     views, likes, comments, channel, subscribers, upload time and thumbnail, read
     from YouTube at META.asOf) or sample-posts.js (the shared copy: all made up).
     Viewer geography is sample data in both, generated below from the seed. */
  var EMOJI = ['\ud83c\udfae', '\ud83d\udcbb', '\ud83c\udf19', '\u26a1', '\ud83e\udd16', '\ud83c\udfa7', '\ud83c\udf55', '\ud83d\ude34',
               '\ud83d\udcda', '\ud83d\udcb8', '\ud83d\udc31', '\ud83d\udc36', '\ud83d\udd25', '\ud83e\udde0', '\u23f0', '\ud83c\udfc6'];
  var REAL = (window.REPORT_POSTS || []).filter(function (r) { return Date.parse(r.at) <= NOW; });

  var creators = [], byHandle = {};
  REAL.forEach(function (r) {
    var c = byHandle[r.h];
    if (!c) {
      c = { id: 'c' + creators.length, name: r.c, handle: r.h, subs: 0, hue: randInt(0, 359), geoOn: R() < 0.72 };
      byHandle[r.h] = c;
      creators.push(c);
    }
    c.subs = Math.max(c.subs, r.subs || 0);
  });

  var posts = REAL.map(function (r, i) {
    return {
      id: 'p' + (i + 1),
      creator: byHandle[r.h],
      asset: { id: r.v, title: r.t, thumb: r.th, emoji: EMOJI[(i * 5) % EMOJI.length], hue: (i * 47 + 200) % 360 },
      at: Date.parse(r.at),
      views: r.views || 0,
      likes: r.likes || 0,
      comments: r.comments || 0,
      d: (r.d || []).slice(),
      status: r.live ? 'live' : 'removed',
      url: 'https://www.youtube.com/shorts/' + r.v
    };
  });
  C.views = posts.reduce(function (s, p) { return s + p.views; }, 0);

  /* ---- views by day, per post ---------------------------------------------- */
  var DAY0 = new Date(2026, 9, 1).getTime();
  function dayIndex(t) {
    var d = new Date(t);
    return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - DAY0) / DAY);
  }
  function dayDate(k) { return new Date(2026, 9, 1 + k); }
  var DAYS = dayIndex(NOW) + 1;
  /* The days come with the data: real totals at each daily report, spread
     evenly between reports. */
  posts.forEach(function (p) {
    p.d0 = dayIndex(p.at);
    while (p.d.length < DAYS) { p.d.push(0); }
    p.d.length = DAYS;
  });

  /* Every view is billed, past the budget too (Abhisht, 2026-10-21): if the
     views come to $113.92 the page says $113.92, and says how far over it is. */
  function billed(views) { return views * C.cpm / 1000; }

  /* ---- viewer countries (sample) -------------------------------------------
     A post only has a breakdown when its channel shares one and it has enough
     views for YouTube to report countries at all. Everything else is left out
     and the coverage line says how much that is. */
  var COUNTRIES = [
    ['US', 'United States'], ['IN', 'India'], ['PH', 'Philippines'], ['GB', 'United Kingdom'],
    ['CA', 'Canada'], ['AU', 'Australia'], ['PK', 'Pakistan'], ['DE', 'Germany'],
    ['BR', 'Brazil'], ['NG', 'Nigeria']
  ];
  var COUNTRY_NAME = {};
  COUNTRIES.forEach(function (c) { COUNTRY_NAME[c[0]] = c[1]; });
  var GEO_MIN = 50;
  posts.forEach(function (p) {
    if (!p.creator.geoOn || p.views < GEO_MIN) { p.geo = null; return; }
    var us = Math.round(p.views * rand(0.46, 0.8));
    var rest = COUNTRIES.slice(1).map(function () { return Math.pow(R(), 2.2); });
    var rs = rest.reduce(function (s, v) { return s + v; }, 0);
    var g = { US: us }, left = p.views - us;
    COUNTRIES.slice(1).forEach(function (c, k) {
      var v = k === rest.length - 1 ? left : Math.min(left, Math.round((p.views - us) * rest[k] / rs));
      g[c[0]] = v;
      left -= v;
    });
    p.geo = g;
  });

  /* ---- the selected period ------------------------------------------------- */
  var LAST = DAYS - 1;
  var PRESETS = [
    ['all', 'Campaign to date'],
    ['today', 'Today'],
    ['yesterday', 'Yesterday'],
    ['7d', 'Last 7 days'],
    ['14d', 'Last 14 days'],
    ['custom', 'Custom range']
  ];
  function presetRange(key) {
    if (key === 'today') { return [LAST, LAST]; }
    if (key === 'yesterday') { return [LAST - 1, LAST - 1]; }
    if (key === '7d') { return [Math.max(0, LAST - 6), LAST]; }
    if (key === '14d') { return [Math.max(0, LAST - 13), LAST]; }
    return [0, LAST];
  }
  var period = { key: 'all', from: 0, to: LAST };
  function isFull() { return period.from === 0 && period.to === LAST; }

  function applyPeriod() {
    posts.forEach(function (p) {
      var v = 0;
      for (var k = period.from; k <= period.to; k++) { v += p.d[k]; }
      p.r = p.views ? v / p.views : 0;
      p.pv = v;
      p.pl = Math.round(p.likes * p.r);
      p.pc = Math.round(p.comments * p.r);
      p.live = p.d0 <= period.to;
    });
  }

  /* ---- formatting ---------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function num(n) { return Number(n).toLocaleString('en-US'); }
  function money(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function compact(n) {
    if (n >= 1000) { return (Math.round(n / 100) / 10).toString().replace(/\.0$/, '') + 'K'; }
    return String(n);
  }
  function pct(x, digits) {
    if (!isFinite(x)) { return '0%'; }
    var d = digits === undefined ? (x < 0.1 ? 1 : 0) : digits;
    return (x * 100).toFixed(d) + '%';
  }
  function plural(n, w) { return num(n) + ' ' + w + (n === 1 ? '' : 's'); }
  function dateF(t) { return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function dayShort(k) { return dayDate(k).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  function timeF(t) { return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); }
  function when(t) { return dateF(t) + ' · ' + timeF(t); }
  function subs(n) { return plural(n, 'subscriber'); }
  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  }
  function $(sel) { return document.querySelector(sel); }
  function isoDay(k) {
    var d = dayDate(k);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  /* "Oct 13 to Oct 19" or "Oct 19" */
  function spanText() {
    return period.from === period.to ? dayShort(period.from) : dayShort(period.from) + ' to ' + dayShort(period.to);
  }
  function rangeLabel() {
    var p = PRESETS.filter(function (x) { return x[0] === period.key; })[0];
    return period.key === 'custom' || !p ? spanText() : p[1];
  }

  /* ---- icons --------------------------------------------------------------- */
  function ic(d, size, sw) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 14) + '" height="' + (size || 14) + '" fill="none" stroke="currentColor" stroke-width="'
      + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var IC = {
    eye: ic('<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>'),
    like: ic('<path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"/><path d="M7 11l4.2-7.4a2 2 0 0 1 3.6 1.5L14 9h5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17.6 20H7"/>'),
    chat: ic('<path d="M21 12a8 8 0 0 1-11.6 7.1L3.5 20.5l1.4-5.9A8 8 0 1 1 21 12z"/>'),
    more: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5.5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="18.5" r="1.6"/></svg>',
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
    link: ic('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
    search: ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 16),
    refresh: ic('<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>', 18),
    share: ic('<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>', 16),
    cal: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', 16),
    caret: ic('<path d="m7 10 5 5 5-5"/>', 14, 2),
    close: ic('<path d="M6 6l12 12M18 6 6 18"/>', 18, 2),
    chev: ic('<path d="m9 6 6 6-6 6"/>', 14, 2),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>', 14),
    yt: ic('<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/>', 15),
    ext: ic('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', 12, 2)
  };

  function avatar(c, size) {
    return '<span class="av' + (size ? ' av--' + size : '') + '" style="--h:' + c.hue + '" aria-hidden="true">' + esc(initials(c.name)) + '</span>';
  }
  /* The real thumbnail when YouTube has one: the small 480x360 one in lists
     (cropped to the vertical frame), full size in the details panel. The
     coloured tile underneath shows if it fails to load or the Short is gone. */
  function thumb(a, size, flag) {
    return '<span class="thumb' + (size ? ' thumb--' + size : '') + '" style="--h:' + a.hue + '" aria-hidden="true">'
      + '<span class="thumb-em">' + a.emoji + '</span>'
      + (a.thumb ? '<img src="' + (size === 'lg' ? a.thumb : 'https://i.ytimg.com/vi/' + a.id + '/hqdefault.jpg')
        + '" alt="" loading="lazy" onerror="this.remove()">' : '')
      + (flag ? '<span class="thumb-flag">Removed</span>' : '')
      + '</span>';
  }
  function statsInline(p) {
    return '<span class="stat">' + IC.eye + num(p.pv) + '</span>'
      + '<span class="stat">' + IC.like + num(p.pl) + '</span>'
      + '<span class="stat">' + IC.chat + num(p.pc) + '</span>';
  }
  function tile(label, value, sub) {
    return '<div class="tile"><span class="tile-l">' + label + '</span><span class="tile-v">' + value + '</span><span class="tile-s">' + sub + '</span></div>';
  }

  var byId = {};
  posts.forEach(function (p) { byId[p.id] = p; });

  function groupBy(list, key) {
    var map = {}, out = [];
    list.forEach(function (p) {
      var k = key(p);
      if (!map[k]) { map[k] = { id: k, posts: [], views: 0, likes: 0, comments: 0, first: p }; out.push(map[k]); }
      var g = map[k];
      g.posts.push(p); g.views += p.pv; g.likes += p.pl; g.comments += p.pc;
    });
    return out;
  }
  var creatorKey = function (p) { return p.creator.id; };
  function scope() { return posts.filter(function (p) { return p.live; }); }

  function geoOf(list) {
    var by = {}, covered = 0, cv = 0, total = 0;
    list.forEach(function (p) {
      total += p.pv;
      if (!p.geo || !p.pv) { return; }
      covered++;
      Object.keys(p.geo).forEach(function (k) {
        var v = Math.round(p.geo[k] * p.r);
        by[k] = (by[k] || 0) + v;
        cv += v;
      });
    });
    var rows = Object.keys(by).filter(function (k) { return by[k] > 0; })
      .map(function (k) { return { cc: k, name: COUNTRY_NAME[k], v: by[k] }; })
      .sort(function (a, b) { return b.v - a.v; });
    return { rows: rows, covered: covered, n: list.length, cv: cv, total: total };
  }

  /* ---- header -------------------------------------------------------------- */
  var updatedAt = NOW;
  function ago(t) {
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) { return 'Updated just now'; }
    if (m < 60) { return 'Updated ' + m + ' min ago'; }
    return 'Updated ' + Math.round(m / 60) + ' h ago';
  }
  function renderHead() {
    $('#c-name').textContent = C.name;
    $('#c-meta').innerHTML = [
      '<span class="chip chip--live">Live</span>',
      '<span>' + esc(C.product) + '</span>',
      '<span>Ends <b>' + dateF(C.ends) + '</b></span>',
      '<span>Geography: <b>' + esc(C.country) + '</b></span>',
      '<span class="mono">#' + esc(C.ref) + '</span>'
    ].join('');
    $('#c-updated').textContent = ago(updatedAt);
    $('#btn-refresh').innerHTML = IC.refresh;
    $('#btn-share').innerHTML = IC.share + 'Share';
    $('#btn-csv').textContent = 'Download CSV';
  }
  function renderRangeBtn() {
    $('#btn-range').innerHTML = IC.cal + '<span>' + esc(rangeLabel()) + '</span><span class="caret">' + IC.caret + '</span>';
    $('#btn-range').classList.toggle('is-on', !isFull());
  }

  /* ---- tiles ---------------------------------------------------------------
     THREE LAYOUTS, switched from the review bar at the bottom left.
     current:  the five budget tiles over the four post tiles.
     compact:  Views, Posts and Creators as the big three, the fill shown as a
               bar under Views, and Spend, Likes, Comments and Time left as
               small cards. Fill and Remaining stop being tiles of their own:
               the bar and the Accounting card already say them.
     notarget: compact without the view target. We charge for views but cannot
               promise how many, so this version never names a view count to
               aim at; the money side (spent of budget) carries the progress. */
  var tilesMode = 'current';
  try {
    var tm = window.localStorage.getItem('campaign-report:tiles');
    if (tm === 'compact' || tm === 'notarget') { tilesMode = tm; }
  } catch (e) {}

  function hero(label, value, sub, extra) {
    return '<div class="tile tile--hero"><span class="tile-l">' + label + '</span><span class="tile-v">' + value + '</span>'
      + (extra || '') + '<span class="tile-s">' + sub + '</span></div>';
  }
  function mini(label, value, sub) {
    return '<div class="mini"><span class="mini-l">' + label + '</span>'
      + '<span class="mini-v">' + value + (sub ? '<small>' + sub + '</small>' : '') + '</span></div>';
  }
  function fillBar(share) {
    var w = Math.min(100, share * 100);
    return '<span class="fill"><span class="fill-bar"><i style="width:' + w.toFixed(1) + '%"></i></span>'
      + '<span class="fill-pct">' + Math.floor(share * 100) + '%</span></span>';
  }

  function renderTiles() {
    var full = isFull(), sc = scope();
    var lifeSpend = billed(C.views), over = C.views > C.target;
    var pv = 0, pl = 0, pc = 0;
    sc.forEach(function (p) { pv += p.pv; pl += p.pl; pc += p.pc; });
    var periodSpend = billed(pv), overBy = lifeSpend - C.budget;
    var left = Math.max(0, Math.ceil((C.ends - NOW) / DAY));
    var newPosts = posts.filter(function (p) { return p.d0 >= period.from && p.d0 <= period.to; }).length;
    var active = groupBy(sc.filter(function (p) { return p.pv > 0; }), creatorKey).length;
    var top = $('#tiles-top'), low = $('#tiles-posts');

    if (tilesMode === 'current') {
      top.className = 'tiles tiles--five';
      low.className = 'tiles tiles--four';
      top.innerHTML =
          tile('Fill', Math.floor(C.views / C.target * 100) + '%', num(C.views) + ' of ' + num(C.target) + ' target')
        + (full ? tile('Views', num(C.views), 'YouTube views on published posts')
                : tile('Views', num(pv), 'gathered ' + spanText()))
        + (full ? tile('Spend', money(lifeSpend), 'of ' + money(C.budget))
                : tile('Spend', money(periodSpend), 'spent ' + spanText()))
        + (over ? tile('Over budget', money(overBy), 'spent past the ' + money(C.budget) + ' budget')
                : tile('Remaining', money(C.budget - lifeSpend), 'budget left to spend'))
        + tile('Time left', left + ' days', 'ends ' + dateF(C.ends));
      low.innerHTML =
          (full ? tile('Total posts', num(posts.length), 'live on members\u2019 own accounts')
                : tile('New posts', num(newPosts), 'published ' + spanText()))
        + (full ? tile('Creators', num(groupBy(posts, creatorKey).length), 'channels posting your videos')
                : tile('Creators', num(active), 'with views ' + spanText()))
        + tile('Likes', num(pl), full ? 'on those posts' : 'gathered ' + spanText())
        + tile('Comments', num(pc), full ? 'on those posts' : 'gathered ' + spanText());
    } else {
      var target = tilesMode === 'compact';
      top.className = 'tiles tiles--three';
      low.className = 'minis';
      top.innerHTML =
          (!full ? hero('Views', num(pv), 'gathered ' + spanText())
            : target ? hero('Views', num(C.views), 'of the ' + num(C.target) + ' views your budget covers', fillBar(C.views / C.target))
            : hero('Views', num(C.views), 'YouTube views on published posts'))
        + (full ? hero('Posts', num(posts.length), 'live on members\u2019 own accounts')
                : hero('New posts', num(newPosts), 'published ' + spanText()))
        + (full ? hero('Creators', num(groupBy(posts, creatorKey).length), 'channels posting your videos')
                : hero('Creators', num(active), 'with views ' + spanText()));
      low.innerHTML =
          (full ? mini('Spend', money(lifeSpend), 'of $' + num(C.budget))
                : mini('Spend', money(periodSpend), spanText()))
        + mini('Likes', num(pl))
        + mini('Comments', num(pc))
        + mini('Time left', left + ' days', 'ends ' + dayShort(Math.round((C.ends - DAY0) / DAY)));
    }

    $('#acct-foot').textContent = tilesMode === 'notarget'
      ? 'If the campaign ends before the budget is used, the rest is settled per the make-good policy in your agreement.'
      : 'If the campaign closes under target, unconsumed budget is settled per the make-good policy in your agreement.';
    document.querySelectorAll('[data-tiles-mode]').forEach(function (bt) {
      bt.setAttribute('aria-pressed', bt.getAttribute('data-tiles-mode') === tilesMode ? 'true' : 'false');
    });

    $('#acct').innerHTML =
        '<tr><td>Campaign budget</td><td>' + money(C.budget) + '</td></tr>'
      + '<tr><td>Cost per 1,000 views</td><td>' + money(C.cpm) + '</td></tr>'
      + '<tr><td>Amount spent<span class="acct-work">' + num(C.views) + ' × $' + (C.cpm / 1000).toFixed(4) + '</span></td><td>' + money(lifeSpend) + '</td></tr>'
      + (over
        ? '<tr class="is-total"><td>Over budget<span class="acct-work">'
          + (tilesMode === 'notarget' ? 'spent past the ' + money(C.budget) + ' budget'
                                      : num(C.views - C.target) + ' views past the ' + num(C.target) + ' the budget covers')
          + '</span></td><td>' + money(overBy) + '</td></tr>'
        : '<tr class="is-total"><td>Remaining</td><td>' + money(C.budget - lifeSpend) + '</td></tr>');
  }

  /* ---- views over time -----------------------------------------------------
     A line of the views gathered in the period, starting from nothing at its
     first day. One day on its own is drawn from the start of that day to its
     end, so a single day still reads as a line rather than a dot. */
  function niceStep(max, parts) {
    var raw = Math.max(1, max) / parts, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    return [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).filter(function (s) { return s >= raw; })[0];
  }
  function chartPoints() {
    var pts = [], k, s = 0, inc;
    if (period.from === period.to) {
      k = period.from;
      inc = posts.reduce(function (t, p) { return t + p.d[k]; }, 0);
      pts.push({ label: dayShort(k), tip: dateF(dayDate(k)) + ', start of day', v: 0, inc: null });
      pts.push({ label: k === LAST ? 'Now' : 'End of day', tip: dateF(dayDate(k)) + (k === LAST ? ', so far' : ', end of day'), v: inc, inc: inc });
      return pts;
    }
    for (k = period.from; k <= period.to; k++) {
      inc = posts.reduce(function (t, p) { return t + p.d[k]; }, 0);
      s += inc;
      pts.push({ label: dayShort(k), tip: dateF(dayDate(k)), v: s, inc: inc });
    }
    return pts;
  }

  var CH = { W: 660, H: 250, L: 46, R: 16, T: 22, B: 32 };
  function renderChart() {
    $('#chart-hint').textContent = isFull()
      ? 'Total views gathered on published posts, by day.'
      : 'Views gathered ' + spanText() + ', by day.';

    var pts = chartPoints(), n = pts.length, k;
    var last = pts[n - 1].v;
    var yMax = niceStep(last, 4) * 4;
    var cx = function (j) { return CH.L + (CH.W - CH.L - CH.R) * (j / (n - 1)); };
    var cy = function (v) { return CH.T + (CH.H - CH.T - CH.B) * (1 - v / yMax); };

    var rules = '', labels = '';
    for (k = 0; k <= 4; k++) {
      var v = yMax * k / 4, y = cy(v).toFixed(1);
      rules += '<line x1="' + CH.L + '" y1="' + y + '" x2="' + (CH.W - CH.R) + '" y2="' + y + '"/>';
      labels += '<text x="' + (CH.L - 9) + '" y="' + (+y + 3.5) + '" text-anchor="end">' + (v ? compact(v) : '0') + '</text>';
    }
    /* at most five dates, always the first and the last */
    var marks = [], step = Math.max(1, Math.ceil((n - 1) / 4));
    for (k = 0; k < n - 1; k += step) { marks.push(k); }
    if (marks.length && n - 1 - marks[marks.length - 1] < step / 2 && marks.length > 1) { marks.pop(); }
    marks.push(n - 1);
    marks.forEach(function (j) {
      var anchor = n === 2 ? (j === 0 ? 'start' : 'end') : 'middle';
      labels += '<text x="' + cx(j).toFixed(1) + '" y="' + (CH.H - 10) + '" text-anchor="' + anchor + '">' + esc(pts[j].label) + '</text>';
    });

    var line = pts.map(function (p, j) { return (j ? 'L' : 'M') + cx(j).toFixed(1) + ' ' + cy(p.v).toFixed(1); }).join(' ');
    var area = line + ' L' + cx(n - 1).toFixed(1) + ' ' + cy(0).toFixed(1) + ' L' + cx(0).toFixed(1) + ' ' + cy(0).toFixed(1) + ' Z';
    var lastX = cx(n - 1), lastY = cy(last);
    var font = ' font-family="Inter, system-ui, sans-serif"';

    $('#chart').innerHTML =
      '<svg viewBox="0 0 ' + CH.W + ' ' + CH.H + '" role="img" aria-label="Views gathered by day, ' + num(last) + ' in total">'
      + '<g stroke="rgba(0,0,0,0.08)" stroke-width="1">' + rules + '</g>'
      + '<g fill="#767b85" font-size="10"' + font + '>' + labels + '</g>'
      + '<path d="' + area + '" fill="rgba(21,110,254,0.08)"/>'
      + '<path d="' + line + '" fill="none" stroke="#156efe" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<circle cx="' + lastX.toFixed(1) + '" cy="' + lastY.toFixed(1) + '" r="3.5" fill="#fff" stroke="#156efe" stroke-width="2"/>'
      + '<text x="' + (lastX - 8).toFixed(1) + '" y="' + (lastY - 10).toFixed(1) + '" text-anchor="end" fill="#0b0b0d" font-size="11.5" font-weight="600"' + font + '>' + num(last) + '</text>'
      + '<g class="hov" visibility="hidden"><line y1="' + CH.T + '" y2="' + (CH.H - CH.B) + '" stroke="rgba(0,0,0,0.25)" stroke-dasharray="3 3"/>'
      + '<circle r="4" fill="#156efe" stroke="#fff" stroke-width="2"/></g>'
      + '<rect x="' + CH.L + '" y="0" width="' + (CH.W - CH.L - CH.R) + '" height="' + CH.H + '" fill="transparent"/>'
      + '</svg><div class="chart-tip" hidden></div>';

    var svg = $('#chart svg'), hov = svg.querySelector('.hov'), tip = $('#chart .chart-tip');
    function move(ev) {
      var r = svg.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width * CH.W;
      var j = Math.max(0, Math.min(n - 1, Math.round((px - CH.L) / (CH.W - CH.L - CH.R) * (n - 1))));
      var x = cx(j), y = cy(pts[j].v);
      hov.setAttribute('visibility', 'visible');
      hov.querySelector('line').setAttribute('x1', x);
      hov.querySelector('line').setAttribute('x2', x);
      hov.querySelector('circle').setAttribute('cx', x);
      hov.querySelector('circle').setAttribute('cy', y);
      tip.hidden = false;
      tip.innerHTML = '<span>' + esc(pts[j].tip) + '</span><b>' + num(pts[j].v) + ' views</b>'
        + (pts[j].inc !== null && n > 2 ? '<em>+' + num(pts[j].inc) + '</em> <span style="display:inline">that day</span>' : '');
      tip.style.left = Math.max(70, Math.min(r.width - 70, x / CH.W * r.width)) + 'px';
      tip.style.top = (y / CH.H * r.height) + 'px';
    }
    function leave() { hov.setAttribute('visibility', 'hidden'); tip.hidden = true; }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', leave);
  }

  /* ---- top creators -------------------------------------------------------- */
  function renderTopCreators() {
    var gs = groupBy(scope(), creatorKey).filter(function (g) { return g.views > 0; })
      .sort(function (a, b) { return b.views - a.views; });
    var head = '<div class="tr tr-head"><span>#</span><span>Creator</span><span class="n c-subs">Subscribers</span>'
      + '<span class="n c-posts">Posts</span><span class="n">Views</span><span class="n c-likes">Likes</span>'
      + '<span class="n c-comments">Comments</span></div>';
    var rows = gs.slice(0, 5).map(function (g, k) {
      var c = g.first.creator;
      return '<button class="tr" type="button" data-cgroup="' + g.id + '">'
        + '<span class="t-rank">' + (k + 1) + '</span>'
        + '<span class="t-who">' + avatar(c) + '<span class="t-id"><b>' + esc(c.name) + '</b></span></span>'
        + '<span class="n c-subs">' + num(c.subs) + '</span>'
        + '<span class="n c-posts">' + num(g.posts.length) + '</span>'
        + '<span class="n is-key">' + num(g.views) + '</span>'
        + '<span class="n c-likes">' + num(g.likes) + '</span>'
        + '<span class="n c-comments">' + num(g.comments) + '</span>'
        + '</button>';
    }).join('');
    $('#top-creators').innerHTML =
      '<div class="card-head"><div><h2 class="rep-h">Top creators</h2>'
      + '<p class="rep-hint">' + (isFull() ? plural(groupBy(posts, creatorKey).length, 'channel') + ' posted for this campaign'
                                          : plural(gs.length, 'channel') + ' gathered views ' + spanText()) + '. Ranked by views.</p></div>'
      + '<button class="link-btn" type="button" data-all-creators>See all</button></div>'
      + '<div class="tbl tbl--creators">' + head + (rows || '<div class="tbl-empty">No views in this period.</div>') + '</div>';
  }

  /* ---- top posts ----------------------------------------------------------- */
  var topMore = false;
  function renderTopPosts() {
    var ranked = scope().filter(function (p) { return p.pv > 0; }).sort(function (a, b) { return b.pv - a.pv || b.at - a.at; });
    var rows = ranked.slice(0, topMore ? 10 : 5).map(function (p, k) { return postRow(p, k + 1, false); }).join('');
    $('#top-posts').innerHTML =
      '<div class="card-head"><div><h2 class="rep-h">Top posts in this period</h2>'
      + '<p class="rep-hint">Ranked by views' + (isFull() ? '' : ' gathered ' + spanText()) + '.</p></div>'
      + '<button class="link-btn" type="button" data-all-posts>See all</button></div>'
      + '<div class="plist plist--rank">' + rowHead(true, false) + (rows || '<div class="tbl-empty">No views in this period.</div>') + '</div>'
      + (ranked.length > 5 ? '<div class="tbl-more"><button class="link-btn" type="button" data-top-more>' + (topMore ? 'Show fewer' : 'See more') + '</button></div>' : '');
  }

  /* ---- viewer geography ----------------------------------------------------
     TWO VIEWS, switched from the prototype bar at the bottom left. "off" is
     what ships while the backend work is pending: no geography anywhere, not
     the card, not the section in a post's details, not the CSV columns (a
     Coming soon note felt wrong, Abhisht 2026-10-22). "live" is the finished
     card. The choice is remembered per browser. */
  var geoAll = false, geoMode = 'off';
  try { geoMode = window.localStorage.getItem('campaign-report:geo') === 'live' ? 'live' : 'off'; } catch (e) {}
  var PROCESSING = '<div class="geo-empty">Geography data is still processing.</div>';
  function geoBars(g, limit) {
    var rows = g.rows.slice(0, limit), rest = g.rows.slice(limit);
    if (rest.length) {
      rows.push({ cc: '', name: 'Other', v: rest.reduce(function (s, r) { return s + r.v; }, 0), other: true });
    }
    return '<div class="geo-list">' + rows.map(function (r) {
      var share = g.cv ? r.v / g.cv : 0;
      return '<div class="geo-row' + (r.other ? ' is-other' : '') + '">'
        + '<span class="geo-name">' + (r.other ? '<span class="geo-cc">+' + rest.length + '</span>' : '<span class="geo-cc">' + r.cc + '</span>') + esc(r.name) + '</span>'
        + '<span class="geo-bar"><i style="width:' + (share * 100).toFixed(1) + '%"></i></span>'
        + '<span class="geo-pct">' + pct(share) + '</span>'
        + '</div>';
    }).join('') + '</div>';
  }
  function coverNote(g) {
    return '<p class="geo-note">' + IC.info + '<span>Based on ' + num(g.covered) + ' of ' + plural(g.n, 'post')
      + ', ' + pct(g.total ? g.cv / g.total : 0) + ' of views. Posts without geography data are left out.</span></p>';
  }
  function renderGeo() {
    var g = geoOf(scope()), card = $('#geo-card');
    card.hidden = geoMode === 'off';
    card.innerHTML = geoMode === 'off' ? '' :
      '<div class="card-head"><div><h2 class="rep-h">Viewer geography</h2>'
      + '<p class="rep-hint">Where the views on the posts came from' + (isFull() ? '' : ', ' + spanText()) + '.'
      + ' Open any post’s details to see its own geography.</p></div>'
      + (g.rows.length > 5 ? '<button class="link-btn" type="button" data-geo-all>' + (geoAll ? 'Show top 5' : 'Show all') + '</button>' : '')
      + '</div>'
      + (g.covered ? coverNote(g) + geoBars(g, geoAll ? 99 : 5) : PROCESSING);
    document.querySelectorAll('[data-geo-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-geo-mode') === geoMode ? 'true' : 'false');
    });
  }

  /* ---- posts: filter, sort, group, page ------------------------------------
     One list view. Sorting lives on the column headers (Published flips
     newest and oldest, the counts sort high to low), so there is no separate
     sort control. */
  var DEFAULTS = { q: '', sort: 'newest', posted: 'any', views: 'any', status: 'all', group: 'none' };
  var state = { q: '', sort: 'newest', posted: 'any', views: 'any', status: 'all', group: 'none', page: 1, size: 20, open: {} };
  var SORTS = {
    newest: function (a, b) { return b.at - a.at; },
    oldest: function (a, b) { return a.at - b.at; },
    subs: function (a, b) { return b.creator.subs - a.creator.subs || b.pv - a.pv; },
    views: function (a, b) { return b.pv - a.pv || b.at - a.at; },
    likes: function (a, b) { return b.pl - a.pl || b.pv - a.pv; },
    comments: function (a, b) { return b.pc - a.pc || b.pv - a.pv; }
  };
  var POSTED = { '24h': DAY, '7d': 7 * DAY, '30d': 30 * DAY };
  var VIEWS = { '0': [0, 0], '1-99': [1, 99], '100-999': [100, 999], '1000+': [1000, Infinity] };

  function published() {
    return posts.filter(function (p) { return p.d0 >= period.from && p.d0 <= period.to; });
  }
  function filtered() {
    var q = state.q.trim().toLowerCase();
    return published().filter(function (p) {
      if (q && (p.asset.title + ' ' + p.creator.name).toLowerCase().indexOf(q) < 0) { return false; }
      if (state.posted !== 'any' && NOW - p.at > POSTED[state.posted]) { return false; }
      if (state.views !== 'any') {
        var r = VIEWS[state.views];
        if (p.pv < r[0] || p.pv > r[1]) { return false; }
      }
      if (state.status !== 'all' && p.status !== state.status) { return false; }
      return true;
    }).sort(SORTS[state.sort]);
  }

  var lastGroups = {};
  function grouped(list) {
    var gs = groupBy(list, creatorKey);
    if (state.sort === 'views' || state.sort === 'likes' || state.sort === 'comments') {
      gs.sort(function (a, b) { return b[state.sort] - a[state.sort]; });
    } else if (state.sort === 'subs' && state.group === 'creator') {
      gs.sort(function (a, b) { return b.first.creator.subs - a.first.creator.subs; });
    }
    lastGroups = {};
    gs.forEach(function (g) { lastGroups[g.id] = g; });
    return gs;
  }

  function sortHead(k, label, cls) {
    var on = state.sort === k || (k === 'newest' && state.sort === 'oldest');
    var arrow = !on ? '' : state.sort === 'oldest' ? ' ↑' : ' ↓';
    return '<button class="th ' + cls + (on ? ' is-on' : '') + '" type="button" data-sort="' + k + '">' + label + arrow + '</button>';
  }
  /* ONE ROW LAYOUT FOR BOTH POST TABLES. Video, creator, published,
     subscribers, the three counts and the two actions, in that order; Top
     posts only adds its rank in front. The whole row opens the post's details,
     while the link and the menu inside it keep their own clicks. */
  function rowHead(rank, sortable, lead) {
    var col = function (k, label, cls) {
      return sortable ? sortHead(k, label, cls) : '<span class="th ' + cls + '">' + label + '</span>';
    };
    return '<div class="post post-head">'
      + (rank ? '<span class="c-rank">#</span>' : '')
      + (lead || '<span class="c-content">Video</span><span class="c-creator">Creator</span>')
      + col('newest', 'Published', 'c-pub') + col('subs', 'Subscribers', 'c-subs')
      + col('views', 'Views', 'c-views') + col('likes', 'Likes', 'c-likes') + col('comments', 'Comments', 'c-comments')
      + '<span class="c-acts"></span></div>';
  }
  function listHead() {
    return rowHead(false, true, state.group === 'none' ? '' : '<span class="c-lead">Creator</span>');
  }
  /* Title and creator open YouTube in a new tab. They read as plain text until
     hovered, then turn blue and underlined with an external-link mark, so the
     row itself can stay the way into Details. */
  function channelUrl(c) { return 'https://www.youtube.com/' + c.handle; }
  function xlink(href, text) {
    return '<a class="xlink" href="' + href + '" target="_blank" rel="noopener"><span class="xl-text">' + esc(text) + '</span>'
      + '<span class="xlink-ic" aria-hidden="true">' + IC.ext + '</span></a>';
  }
  function key(k, sortable) {
    if (!sortable) { return k === 'views' ? ' is-key' : ''; }
    return state.sort === k ? ' is-key' : '';
  }
  function postRow(p, rank, sortable) {
    var gone = p.status === 'removed';
    return '<div class="post' + (gone ? ' is-removed' : '') + '" data-row="' + p.id + '" tabindex="0" role="button" aria-label="Details for ' + esc(p.asset.title) + '">'
      + (rank ? '<span class="t-rank c-rank">' + rank + '</span>' : '')
      + '<span class="t-content c-content">' + thumb(p.asset) + '<span class="pc-text">'
      + '<span class="pc-title">' + xlink(p.url, p.asset.title) + '</span>'
      + '<span class="pc-by">' + esc(p.creator.name) + '</span>'
      + (gone ? '<span class="chip chip--removed" title="This video is no longer on YouTube. Its last known views still count.">Removed</span>' : '')
      + '<span class="post-mstats"><span class="stat">' + dateF(p.at) + '</span>' + statsInline(p) + '</span>'
      + '</span></span>'
      + '<span class="t-creator c-creator">' + avatar(p.creator, 'sm') + xlink(channelUrl(p.creator), p.creator.name) + '</span>'
      + '<span class="post-pub c-pub"><span>' + dateF(p.at) + '</span><span>' + timeF(p.at) + '</span></span>'
      + '<span class="post-n c-subs' + key('subs', sortable) + '">' + num(p.creator.subs) + '</span>'
      + '<span class="post-n c-views' + key('views', sortable) + '">' + num(p.pv) + '</span>'
      + '<span class="post-n c-likes' + key('likes', sortable) + '">' + num(p.pl) + '</span>'
      + '<span class="post-n c-comments' + key('comments', sortable) + '">' + num(p.pc) + '</span>'
      + '<span class="post-acts c-acts">'
      + '<button class="icon-sm" type="button" data-menu="' + p.id + '" aria-label="More for this post" aria-haspopup="menu" aria-expanded="false">' + IC.more + '</button>'
      + '</span></div>';
  }
  function groupRow(g) {
    var open = !!state.open[g.id], c = g.first.creator;
    var who = avatar(c) + '<span class="grp-id"><b>' + esc(c.name) + '</b><span>' + plural(g.posts.length, 'post') + '</span></span>';
    return '<div class="grp' + (open ? ' is-open' : '') + '">'
      + '<div class="grp-head"><button class="grp-tog" type="button" data-grp="' + g.id + '" aria-expanded="' + open + '"><span class="chev">' + IC.chev + '</span>' + who + '</button>'
      + '<span class="c-pub"></span>'
      + '<span class="post-n c-subs">' + num(c.subs) + '</span>'
      + '<span class="post-n c-views is-key">' + num(g.views) + '</span>'
      + '<span class="post-n c-likes">' + num(g.likes) + '</span>'
      + '<span class="post-n c-comments">' + num(g.comments) + '</span>'
      + '<span class="post-acts c-acts"><button class="icon-sm" type="button" data-menu="' + g.id + '" data-menu-kind="creator" aria-label="More for ' + esc(c.name) + '" aria-haspopup="menu" aria-expanded="false">' + IC.more + '</button></span></div>'
      + (open ? '<div class="grp-body">' + g.posts.map(function (q) { return postRow(q, 0, true); }).join('') + '</div>' : '')
      + '</div>';
  }

  function pageList(cur, pages) {
    var out = [], k;
    for (k = 1; k <= pages; k++) {
      if (k === 1 || k === pages || Math.abs(k - cur) <= 1) { out.push(k); }
      else if (out[out.length - 1] !== '…') { out.push('…'); }
    }
    return out;
  }

  function renderPosts() {
    var all = published(), list = filtered();
    var isGrouped = state.group !== 'none';
    var items = isGrouped ? grouped(list) : list;
    var pages = Math.max(1, Math.ceil(items.length / state.size));
    if (state.page > pages) { state.page = pages; }
    var from = (state.page - 1) * state.size, slice = items.slice(from, from + state.size);
    var unit = isGrouped ? 'creator' : 'post';

    var active = ['q', 'posted', 'views', 'status'].some(function (k) { return state[k] !== DEFAULTS[k]; });
    $('#f-clear').hidden = !active;
    $('#f-count').textContent = active
      ? num(list.length) + ' of ' + plural(all.length, 'post') + ' match'
      : plural(all.length, 'post');
    $('#posts-hint').textContent = isFull()
      ? posts.length + ' posts driving engagement for this campaign.'
      : plural(all.length, 'post') + ' published ' + spanText() + '. Views, likes and comments are the ones gathered in that period.';

    var body;
    if (!items.length) {
      body = '<div class="empty"><span>No posts match these filters.</span><button class="btn" type="button" data-clear>Clear filters</button></div>';
    } else {
      body = listHead() + (isGrouped ? slice.map(groupRow) : slice.map(function (p) { return postRow(p, 0, true); })).join('');
    }
    $('#posts-list').innerHTML = '<div class="plist">' + body + '</div>';

    var pg = pageList(state.page, pages).map(function (k) {
      return k === '…' ? '<span class="gap">…</span>'
        : '<button type="button" data-page="' + k + '"' + (k === state.page ? ' class="is-on" aria-current="page"' : '') + '>' + k + '</button>';
    }).join('');
    $('#pager').innerHTML = items.length
      ? '<span>Showing ' + num(from + 1) + '-' + num(from + slice.length) + ' of ' + plural(items.length, unit) + '</span>'
        + '<div class="pager-r"><div class="pg">'
        + '<button type="button" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + ' aria-label="Previous page">&lsaquo;</button>'
        + pg
        + '<button type="button" data-page="' + (state.page + 1) + '"' + (state.page === pages ? ' disabled' : '') + ' aria-label="Next page">&rsaquo;</button>'
        + '</div>'
        + '<label class="sel" data-sel="size"><span class="sel-k">Per page</span><span class="sel-v">' + state.size + '</span>'
        + '<select id="f-size" aria-label="Per page">' + [10, 20, 50].map(function (s) {
            return '<option value="' + s + '"' + (s === state.size ? ' selected' : '') + '>' + s + '</option>';
          }).join('') + '</select></label></div>'
      : '';
    $('#pager').hidden = !items.length;
  }

  /* ---- filters ------------------------------------------------------------- */
  var SEL = { posted: '#f-posted', views: '#f-views', status: '#f-status', group: '#f-group' };
  function syncSelects() {
    Object.keys(SEL).forEach(function (k) {
      var s = $(SEL[k]);
      s.value = state[k];
      var pill = s.closest('.sel');
      pill.querySelector('.sel-v').textContent = s.options[s.selectedIndex].text;
      pill.classList.toggle('is-set', state[k] !== DEFAULTS[k]);
    });
    if (document.activeElement !== $('#f-q')) { $('#f-q').value = state.q; }
  }
  /* A filter that leaves fewer rows used to shrink the card and drag the page up
     under the reader. While any filter is on, the card keeps the tallest height
     it has had; clearing the filters lets it go. */
  var FILTER_KEYS = ['q', 'posted', 'views', 'status', 'group'];
  function setState(patch) {
    var card = $('#posts-card'), before = card.offsetHeight;
    var filtering = Object.keys(patch).some(function (k) { return FILTER_KEYS.indexOf(k) > -1; });
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    if (!('page' in patch)) { state.page = 1; }
    syncSelects();
    renderPosts();
    var active = ['q', 'posted', 'views', 'status'].some(function (k) { return state[k] !== DEFAULTS[k]; });
    if (!active) { card.style.minHeight = ''; }
    else if (filtering) { card.style.minHeight = Math.max(before, parseFloat(card.style.minHeight) || 0) + 'px'; }
  }

  /* ---- everything that follows the period ---------------------------------- */
  function renderAll() {
    applyPeriod();
    renderRangeBtn();
    renderTiles();
    renderChart();
    renderTopCreators();
    renderTopPosts();
    renderGeo();
    state.page = 1;
    renderPosts();
  }

  /* ---- date range popover -------------------------------------------------- */
  /* Two faces in one popover: the preset list, and (after Custom) a calendar
     that replaces it, the way YouTube Studio does it. First click picks the
     start, second the end; days outside the campaign cannot be picked. */
  var rpop = $('#range-pop'), cal = null;
  function placeRange() {
    var r = $('#btn-range').getBoundingClientRect();
    rpop.style.top = (r.bottom + 8) + 'px';
    rpop.style.left = Math.max(16, Math.min(window.innerWidth - rpop.offsetWidth - 16, r.left)) + 'px';
  }
  function paintList() {
    cal = null;
    rpop.classList.remove('is-cal');
    rpop.innerHTML = '<div class="rng-list">' + PRESETS.map(function (p) {
      var hint = '';
      if (p[0] !== 'custom') {
        var r = presetRange(p[0]);
        hint = r[0] === r[1] ? dayShort(r[0]) : dayShort(r[0]) + ' to ' + dayShort(r[1]);
      } else if (period.key === 'custom') {
        hint = spanText();
      }
      return '<button type="button" data-range="' + p[0] + '"' + (period.key === p[0] ? ' class="is-on"' : '') + '>'
        + esc(p[1]) + (hint ? '<span>' + hint + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function openCal() {
    cal = { a: period.from, b: period.to, pickEnd: false, hover: null };
    rpop.classList.add('is-cal');
    var months = '', m = new Date(2026, dayDate(0).getMonth(), 1);
    var endM = new Date(dayDate(LAST).getFullYear(), dayDate(LAST).getMonth(), 1);
    while (m <= endM) {
      var y = m.getFullYear(), mo = m.getMonth(), cells = '', d, k;
      for (d = 0; d < new Date(y, mo, 1).getDay(); d++) { cells += '<span></span>'; }
      for (d = 1; d <= new Date(y, mo + 1, 0).getDate(); d++) {
        k = Math.round((new Date(y, mo, d).getTime() - DAY0) / DAY);
        cells += k < 0 || k > LAST
          ? '<span class="cal-day is-off">' + d + '</span>'
          : '<button type="button" class="cal-day' + (k === LAST ? ' is-today' : '') + '" data-day="' + k + '">' + d + '</button>';
      }
      months += '<div class="cal-month"><div class="cal-mlabel">'
        + m.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() + '</div>'
        + '<div class="cal-grid">' + cells + '</div></div>';
      m = new Date(y, mo + 1, 1);
    }
    rpop.innerHTML =
        '<div class="cal-fields"><span class="cal-field" data-f="a"></span><span class="cal-to">to</span><span class="cal-field" data-f="b"></span></div>'
      + '<p class="cal-count" data-f="n"></p>'
      + '<div class="cal-dow">' + ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>'
      + '<div class="cal-months">' + months + '</div>'
      + '<div class="cal-acts"><button class="btn" type="button" data-cal-cancel>Cancel</button>'
      + '<button class="btn btn-solid" type="button" data-cal-apply>Apply</button></div>';
    markCal();
    placeRange();
  }
  function markCal() {
    var lo = cal.a, hi = cal.b !== null ? cal.b : (cal.hover !== null ? cal.hover : cal.a), t;
    if (hi < lo) { t = lo; lo = hi; hi = t; }
    rpop.querySelectorAll('[data-day]').forEach(function (b) {
      var k = +b.getAttribute('data-day');
      b.classList.toggle('in-range', k >= lo && k <= hi);
      b.classList.toggle('is-start', k === lo);
      b.classList.toggle('is-end', k === hi);
    });
    var fa = rpop.querySelector('[data-f="a"]'), fb = rpop.querySelector('[data-f="b"]');
    fa.textContent = dateF(dayDate(cal.a));
    fb.textContent = cal.b !== null ? dateF(dayDate(cal.b)) : 'End date';
    fa.classList.toggle('is-on', !cal.pickEnd);
    fb.classList.toggle('is-on', cal.pickEnd);
    fb.classList.toggle('is-empty', cal.b === null);
    rpop.querySelector('[data-f="n"]').textContent = cal.b !== null
      ? plural(cal.b - cal.a + 1, 'day') + ' selected'
      : 'Now pick the end date';
    rpop.querySelector('[data-cal-apply]').disabled = cal.b === null;
  }
  function pickDay(k) {
    if (!cal.pickEnd) {
      cal.a = k; cal.b = null; cal.pickEnd = true;
    } else {
      if (k < cal.a) { cal.b = cal.a; cal.a = k; } else { cal.b = k; }
      cal.pickEnd = false;
    }
    cal.hover = null;
    markCal();
  }
  rpop.addEventListener('mouseover', function (ev) {
    if (!cal || !cal.pickEnd) { return; }
    var b = ev.target.closest('[data-day]'), k = b ? +b.getAttribute('data-day') : null;
    if (k !== cal.hover) { cal.hover = k; markCal(); }
  });
  function openRange() {
    paintList();
    rpop.hidden = false;
    $('#btn-range').setAttribute('aria-expanded', 'true');
    placeRange();
  }
  function closeRange() {
    rpop.hidden = true;
    cal = null;
    $('#btn-range').setAttribute('aria-expanded', 'false');
  }
  function setPeriod(key, from, to) {
    period = { key: key, from: from, to: to };
    closeRange();
    renderAll();
  }

  /* ---- drawer -------------------------------------------------------------- */
  var drawer = $('#drawer'), scrim = $('#scrim'), stack = [];
  function openDrawer(view, push) {
    if (!push) { stack = []; }
    stack.push(view);
    paintDrawer();
    scrim.hidden = false;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (view.focus === 'geo') {
      var sec = drawer.querySelector('[data-dr-geo]');
      if (sec) { sec.scrollIntoView({ block: 'start' }); }
    } else {
      drawer.scrollTop = 0;
    }
    var close = drawer.querySelector('[data-dr-close]');
    if (close) { close.focus({ preventScroll: true }); }
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    document.body.style.overflow = '';
  }
  function geoSection(list, single) {
    var g = geoOf(list), p = list[0], body;
    if (geoMode === 'off') { return ''; }
    if (!g.covered) {
      body = single && p.views >= GEO_MIN && !p.pv
        ? '<div class="geo-empty">This post gathered no views ' + spanText() + '.</div>'
        : PROCESSING;
    } else {
      body = (single ? '' : coverNote(g)) + geoBars(g, 6);
    }
    return '<section class="dr-sec" data-dr-geo><h4 class="rep-h">Viewer geography</h4>' + body + '</section>';
  }
  function drStats(v, l, c) {
    return '<div class="dr-stats">'
      + '<div class="dr-stat"><span>Views</span><b>' + num(v) + '</b></div>'
      + '<div class="dr-stat"><span>Likes</span><b>' + num(l) + '</b></div>'
      + '<div class="dr-stat"><span>Comments</span><b>' + num(c) + '</b></div>'
      + '</div>';
  }
  function periodNote() {
    return isFull() ? '' : '<p class="dr-period">Showing what was gathered ' + spanText() + '.</p>';
  }
  function paintDrawer() {
    var view = stack[stack.length - 1], html;
    var top = '<div class="dr-top">'
      + (stack.length > 1 ? '<button class="dr-back" type="button" data-dr-back>&lsaquo; Back</button>' : '<span class="dr-kicker">' + (view.kind === 'post' ? 'Post' : 'Creator') + '</span>')
      + '<button class="icon-sm" type="button" data-dr-close aria-label="Close">' + IC.close + '</button></div>';

    if (view.kind === 'post') {
      var p = byId[view.id], gone = p.status === 'removed';
      html = top
        + '<div class="dr-hero"><span>' + thumb(p.asset, 'lg', gone) + '</span><div>'
        + '<h3>' + esc(p.asset.title) + '</h3>'
        + '<div class="dr-who">' + avatar(p.creator, 'sm') + '<b>' + esc(p.creator.name) + '</b><span>' + subs(p.creator.subs) + '</span></div>'
        + '<p class="dr-when">Posted ' + dateF(p.at) + ' at ' + timeF(p.at) + '</p>'
        + (gone ? '<p class="dr-flag">Removed from YouTube. Its last known views still count toward your target.</p>' : '')
        + '</div></div>'
        + periodNote()
        + drStats(p.pv, p.pl, p.pc)
        + geoSection([p], true)
        + '<div class="dr-acts"><a class="btn" href="' + p.url + '" target="_blank" rel="noopener">' + IC.yt + 'Open on YouTube</a>'
        + '<button class="btn" type="button" data-copy="' + p.url + '">' + IC.link + 'Copy link</button></div>';
    } else {
      var g = view.group;
      var head = '<div class="dr-who" style="margin-top:0">' + avatar(g.first.creator, 'lg') + '<div><h3 style="font-size:16px">' + esc(g.first.creator.name) + '</h3>'
          + '<span>' + plural(g.posts.length, 'post') + ' · ' + subs(g.first.creator.subs) + '</span></div></div>';
      var list = g.posts.slice().sort(SORTS.views);
      html = top + head
        + periodNote()
        + drStats(g.views, g.likes, g.comments)
        + geoSection(g.posts, false)
        + '<section class="dr-sec"><h4 class="rep-h">Posts</h4><div class="dr-list">' + list.map(function (q) {
            return '<button class="dr-item" type="button" data-open-push="' + q.id + '">'
              + '<span class="post-who"><span style="width:22px;flex:none">' + thumb(q.asset) + '</span>'
              + '<span class="post-id"><b>' + esc(q.asset.title) + '</b><span>' + when(q.at) + (q.status === 'removed' ? ' · Removed' : '') + '</span></span></span>'
              + '<span class="post-n">' + num(q.pv) + '</span></button>';
          }).join('') + '</div></section>';
    }
    drawer.innerHTML = html;
  }
  function creatorGroupOf(id) {
    return groupBy(scope(), creatorKey).filter(function (x) { return x.id === id; })[0];
  }

  /* ---- menu ---------------------------------------------------------------- */
  var menu = $('#menu'), menuBtn = null;
  function openMenu(btn) {
    closeMenu();
    menuBtn = btn;
    btn.setAttribute('aria-expanded', 'true');
    var id = btn.getAttribute('data-menu');
    var item = function (act, icon, label) {
      return '<button type="button" role="menuitem" data-act="' + act + '" data-id="' + id + '">' + icon + label + '</button>';
    };
    /* a post row and a creator row (grouped by creator) get the same three, about their own thing */
    menu.innerHTML = btn.getAttribute('data-menu-kind') === 'creator'
      ? item('cdetails', IC.info, 'Details') + item('channel', IC.yt, 'Open channel') + item('ccopy', IC.link, 'Copy channel link')
      : item('details', IC.info, 'Details') + item('yt', IC.yt, 'Open on YouTube') + item('copy', IC.link, 'Copy link');
    menu.hidden = false;
    var r = btn.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
    var left = Math.min(window.innerWidth - mw - 12, r.right - mw);
    var top = r.bottom + 6 + mh > window.innerHeight ? r.top - mh - 6 : r.bottom + 6;
    menu.style.left = Math.max(12, left) + 'px';
    menu.style.top = top + 'px';
    menu.querySelector('button').focus({ preventScroll: true });
  }
  function closeMenu() {
    menu.hidden = true;
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn = null; }
  }

  /* ---- share --------------------------------------------------------------- */
  var pop = $('#share-pop');
  function closeShare() { pop.hidden = true; $('#btn-share').classList.remove('is-on'); }
  function toggleShare() {
    if (!pop.hidden) { closeShare(); return; }
    var url = 'https://onblue.ai/r/' + C.ref + '-k7Q2';
    pop.innerHTML = '<h3>Share this report</h3>'
      + '<p>Anyone with the link can view this report. No sign-in needed, and the numbers stay up to date.</p>'
      + '<div class="pop-link"><input readonly value="' + url + '"><button class="btn" type="button" data-copy="' + url + '">Copy</button></div>';
    pop.hidden = false;
    $('#btn-share').classList.add('is-on');
    var r = $('#btn-share').getBoundingClientRect();
    pop.style.top = (r.bottom + 8) + 'px';
    pop.style.left = Math.max(16, Math.min(window.innerWidth - pop.offsetWidth - 16, r.right - pop.offsetWidth)) + 'px';
  }

  /* ---- toast, copy, csv ---------------------------------------------------- */
  var toastT = 0;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, 1800);
  }
  function copy(text) {
    var done = function () { toast('Link copied'); };
    try {
      navigator.clipboard.writeText(text).then(done, done);
    } catch (e) { done(); }
  }
  function csvCell(v) {
    var s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function downloadCsv() {
    var list = filtered(), span = isFull() ? 'Campaign to date' : spanText(), live = geoMode === 'live';
    var head = ['Period', 'Posted at', 'Channel', 'Subscribers', 'Video title', 'Post URL', 'Status', 'Views', 'Likes', 'Comments'];
    var rows = [live ? head.concat(['Top geography', 'Top geography share']) : head];
    list.forEach(function (p) {
      var g = geoOf([p]), top = g.rows[0];
      var row = [
        span, new Date(p.at).toISOString(), p.creator.name, p.creator.subs, p.asset.title, p.url,
        p.status === 'removed' ? 'Removed' : 'Live', p.pv, p.pl, p.pc
      ];
      rows.push(live ? row.concat([top ? top.name : '', top ? pct(top.v / g.cv, 1) : '']) : row);
    });
    var blob = new Blob([rows.map(function (r) { return r.map(csvCell).join(','); }).join('\n')], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = C.name + '_posts' + (isFull() ? '' : '_' + isoDay(period.from) + '_' + isoDay(period.to)) + '.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    toast('CSV with ' + plural(list.length, 'post'));
  }

  /* ---- events -------------------------------------------------------------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('button, a');

    if (!menu.hidden && !(t && menu.contains(t)) && !(t && t === menuBtn)) { closeMenu(); }
    if (!pop.hidden && !ev.target.closest('#share-pop') && !(t && t.id === 'btn-share')) { closeShare(); }
    if (!rpop.hidden && !ev.target.closest('#range-pop') && !(t && t.id === 'btn-range')) { closeRange(); }
    if (!t) {
      var row = ev.target.closest('[data-row]');
      if (row) { openDrawer({ kind: 'post', id: row.getAttribute('data-row') }); }
      return;
    }

    var a;
    if ((a = t.getAttribute('data-menu'))) {
      if (menuBtn === t) { closeMenu(); } else { openMenu(t); }
      return;
    }
    if ((a = t.getAttribute('data-act'))) {
      var id = t.getAttribute('data-id'), p = byId[id], g = lastGroups[id];
      closeMenu();
      if (a === 'details') { openDrawer({ kind: 'post', id: id }); }
      if (a === 'yt') { window.open(p.url, '_blank', 'noopener'); }
      if (a === 'copy') { copy(p.url); }
      if (a === 'cdetails') { openDrawer({ kind: 'creator', group: g }); }
      if (a === 'channel') { window.open(channelUrl(g.first.creator), '_blank', 'noopener'); }
      if (a === 'ccopy') { copy(channelUrl(g.first.creator)); }
      return;
    }
    if ((a = t.getAttribute('data-range'))) {
      if (a === 'custom') { openCal(); return; }
      var r = presetRange(a);
      setPeriod(a, r[0], r[1]);
      return;
    }
    if ((a = t.getAttribute('data-day'))) { pickDay(+a); return; }
    if (t.hasAttribute('data-cal-apply')) {
      if (cal && cal.b !== null) { setPeriod('custom', cal.a, cal.b); }
      return;
    }
    if (t.hasAttribute('data-cal-cancel')) { closeRange(); return; }
    if ((a = t.getAttribute('data-open'))) { openDrawer({ kind: 'post', id: a }); return; }
    if ((a = t.getAttribute('data-open-push'))) { openDrawer({ kind: 'post', id: a }, true); return; }
    if ((a = t.getAttribute('data-cgroup'))) { openDrawer({ kind: 'creator', group: creatorGroupOf(a) }); return; }
    if ((a = t.getAttribute('data-grp'))) {
      state.open[a] = !state.open[a];
      renderPosts();
      return;
    }
    if ((a = t.getAttribute('data-sort'))) {
      /* Published flips between newest and oldest; the counts always sort high to low */
      if (a === 'newest' && state.sort === 'newest') { a = 'oldest'; }
      setState({ sort: a });
      return;
    }
    if ((a = t.getAttribute('data-page'))) {
      if (t.disabled) { return; }
      setState({ page: +a });
      $('#posts-card').scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if ((a = t.getAttribute('data-copy'))) { copy(a); return; }
    if (t.hasAttribute('data-clear') || t.id === 'f-clear') {
      clearTimeout(searchT);
      searching(false);
      $('#f-q').value = '';
      setState({ q: '', posted: 'any', views: 'any', status: 'all' });
      return;
    }
    if (t.hasAttribute('data-geo-all')) { geoAll = !geoAll; renderGeo(); return; }
    if ((a = t.getAttribute('data-tiles-mode'))) {
      tilesMode = a;
      try { window.localStorage.setItem('campaign-report:tiles', a); } catch (e) {}
      renderTiles();
      return;
    }
    if ((a = t.getAttribute('data-geo-mode'))) {
      geoMode = a;
      try { window.localStorage.setItem('campaign-report:geo', a); } catch (e) {}
      renderGeo();
      if (drawer.classList.contains('is-open')) { paintDrawer(); }
      return;
    }
    if (t.hasAttribute('data-top-more')) { topMore = !topMore; renderTopPosts(); return; }
    if (t.hasAttribute('data-all-creators')) {
      setState({ group: 'creator', sort: 'views', open: {} });
      $('#posts-card').scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if (t.hasAttribute('data-all-posts')) {
      setState({ group: 'none', sort: 'views' });
      $('#posts-card').scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if (t.hasAttribute('data-dr-close')) { closeDrawer(); return; }
    if (t.hasAttribute('data-dr-back')) { stack.pop(); paintDrawer(); return; }
    if (t.id === 'btn-range') { if (rpop.hidden) { openRange(); } else { closeRange(); } return; }
    if (t.id === 'btn-share') { toggleShare(); return; }
    if (t.id === 'btn-csv') { downloadCsv(); return; }
    if (t.id === 'btn-refresh') {
      t.classList.add('is-spinning');
      setTimeout(function () {
        t.classList.remove('is-spinning');
        updatedAt = Date.now();
        $('#c-updated').textContent = ago(updatedAt);
        toast('Numbers are up to date');
      }, 700);
      return;
    }
    if (t.getAttribute('href') === '#') { ev.preventDefault(); }
  });
  scrim.addEventListener('click', closeDrawer);

  document.addEventListener('change', function (ev) {
    var s = ev.target;
    if (s.id === 'f-size') { setState({ size: +s.value }); return; }
    Object.keys(SEL).forEach(function (k) {
      if ('#' + s.id === SEL[k]) {
        var patch = {};
        patch[k] = s.value;
        if (k === 'group') { patch.open = {}; }
        setState(patch);
      }
    });
  });
  /* Half a second of visible work after the last keystroke, so a search reads
     as having been run rather than as the list blinking. */
  var searchT = 0;
  function searching(on) {
    $('.search').classList.toggle('is-busy', on);
    $('#posts-list').classList.toggle('is-busy', on);
    if (on) { $('#f-count').textContent = 'Searching…'; }
  }
  $('#f-q').addEventListener('input', function (ev) {
    var v = ev.target.value;
    searching(true);
    clearTimeout(searchT);
    searchT = setTimeout(function () { searching(false); setState({ q: v }); }, 500);
  });

  document.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches && ev.target.matches('[data-row]')) {
      ev.preventDefault();
      openDrawer({ kind: 'post', id: ev.target.getAttribute('data-row') });
      return;
    }
    if (ev.key !== 'Escape') { return; }
    if (!menu.hidden) { var b = menuBtn; closeMenu(); if (b) { b.focus(); } return; }
    if (!rpop.hidden) { closeRange(); $('#btn-range').focus(); return; }
    if (!pop.hidden) { closeShare(); return; }
    if (drawer.classList.contains('is-open')) { closeDrawer(); }
  });
  window.addEventListener('resize', function () { closeMenu(); closeRange(); });
  window.addEventListener('scroll', function () { if (!menu.hidden) { closeMenu(); } }, { passive: true });
  setInterval(function () { $('#c-updated').textContent = ago(updatedAt); }, 30000);

  /* ---- go ------------------------------------------------------------------ */
  $('.search-ic').innerHTML = IC.search;
  renderHead();
  syncSelects();
  renderAll();
})();
