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

  /* ---- platforms -----------------------------------------------------------
     A campaign runs on one or more platforms (details.platforms, ROB-21562),
     and every post is on ONE of them: the platform of the account that posted
     it (the posts API sends it as channel.platform). Everything a platform
     names its own way lives here, so a third platform is one more entry.
     YouTube's words are the report's approved ones, so a YouTube only
     campaign reads exactly as before. */
  var MARK = {
    youtube: '<svg class="pm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
      + '<path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3 3 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3 3 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51A3 3 0 0 0 23.5 17.8C24 15.93 24 12 24 12s0-3.93-.5-5.8z"/>'
      + '<path fill="#fff" d="M9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
    instagram: '<svg class="pm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
      + '<rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#rp-ig)"/>'
      + '<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="3.6" fill="none" stroke="#fff" stroke-width="1.9"/>'
      + '<circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" stroke-width="1.9"/><circle cx="17.2" cy="6.8" r="1.1" fill="#fff"/></svg>',
    tiktok: '<svg class="pm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
      + '<rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#111"/>'
      + '<g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<path stroke="#25F4EE" transform="translate(-0.7 -0.5)" d="M12.6 6v8.3a2.6 2.6 0 1 1-2.6-2.6M12.6 6c.3 1.9 1.6 3.1 3.6 3.3"/>'
      + '<path stroke="#FE2C55" transform="translate(0.7 0.5)" d="M12.6 6v8.3a2.6 2.6 0 1 1-2.6-2.6M12.6 6c.3 1.9 1.6 3.1 3.6 3.3"/>'
      + '<path stroke="#fff" d="M12.6 6v8.3a2.6 2.6 0 1 1-2.6-2.6M12.6 6c.3 1.9 1.6 3.1 3.6 3.3"/></g></svg>'
  };
  /* series colours (the By platform bars), validated together for colour
     blind and normal vision, each a hue from its platform's own mark */
  var PLAT = {
    youtube: {
      name: 'YouTube', color: '#e0261b', mark: MARK.youtube,
      fans: 'Subscribers', fan: 'subscriber', acct: 'channel',
      openAcct: 'Open channel', copyAcct: 'Copy channel link',
      post: function (id) { return 'https://www.youtube.com/shorts/' + id; },
      home: function (h) { return 'https://www.youtube.com/' + h; }
    },
    instagram: {
      name: 'Instagram', color: '#b729a8', mark: MARK.instagram,
      fans: 'Followers', fan: 'follower', acct: 'account',
      openAcct: 'Open profile', copyAcct: 'Copy profile link',
      post: function (id) { return 'https://www.instagram.com/reel/' + id + '/'; },
      home: function (h) { return 'https://www.instagram.com/' + h.replace(/^@/, '') + '/'; }
    },
    /* TikTok is a review sample for now: proof that one more platform is one
       more entry here, and nothing else on the page changes */
    tiktok: {
      name: 'TikTok', color: '#009e8f', mark: MARK.tiktok,
      fans: 'Followers', fan: 'follower', acct: 'account',
      openAcct: 'Open profile', copyAcct: 'Copy profile link',
      post: function (id, h) { return 'https://www.tiktok.com/' + h + '/video/' + id; },
      home: function (h) { return 'https://www.tiktok.com/' + h; }
    }
  };
  var PLAT_ORDER = ['youtube', 'instagram', 'tiktok'];
  /* WHICH PLATFORMS THIS CAMPAIGN RUNS ON (prototype): ?platforms=youtube,instagram
     when the app passes the campaign's own list, else the review bar's pick,
     YouTube + Instagram by default while this is reviewed. The list's order
     is the order everywhere on the page. */
  function platList(s) {
    return String(s || '').toLowerCase().split(',').filter(function (k, i, a) { return PLAT[k] && a.indexOf(k) === i; });
  }
  var platMode = 'youtube,instagram';
  try { platMode = window.localStorage.getItem('campaign-report:platforms') || platMode; } catch (e) {}
  if (platMode === 'both') { platMode = 'youtube,instagram'; }
  var qPlat = new URLSearchParams(location.search).get('platforms');
  if (qPlat && platList(qPlat).length) { platMode = qPlat; }
  C.platforms = platList(platMode).length ? platList(platMode) : ['youtube', 'instagram'];
  platMode = C.platforms.join(',');

  /* Sample data is YouTube's, so on a campaign with more platforms some of
     the accounts move to each of the others (Instagram about a third, TikTok
     about a fifth), from a seed of their own (every other number on the page
     stays as it was). The real report reads it per post. */
  var pseed = 20261116;
  function PR() {
    pseed = pseed + 0x6D2B79F5 | 0;
    var t = Math.imul(pseed ^ pseed >>> 15, 1 | pseed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  var SAMPLE_SHARE = { instagram: 0.36, tiktok: 0.22 };
  creators.forEach(function (c) {
    var r = PR(), acc = 0;
    c.platform = C.platforms[0];
    C.platforms.slice(1).some(function (k) {
      acc += SAMPLE_SHARE[k] || 0.2;
      if (r < acc) { c.platform = k; return true; }
      return false;
    });
    if (c.platform === 'instagram') { c.handle = '@' + c.handle.replace(/^@/, '').replace(/-/g, '.'); }
    if (c.platform === 'tiktok') { c.handle = '@' + c.handle.replace(/^@/, '').replace(/-/g, '_'); }
  });
  function sampleId(k, v, i) {
    if (k === 'youtube') { return v; }
    if (k === 'tiktok') { return '7437' + String(100000000000000 + i * 7919337).slice(-15); }
    return 'DQ' + v.slice(-5) + v.slice(-9, -5).toUpperCase();
  }

  var posts = REAL.map(function (r, i) {
    var c = byHandle[r.h];
    return {
      id: 'p' + (i + 1),
      creator: c,
      platform: c.platform,
      asset: { id: r.v, title: r.t, thumb: c.platform === 'youtube' ? r.th : null, emoji: EMOJI[(i * 5) % EMOJI.length], hue: (i * 47 + 200) % 360 },
      at: Date.parse(r.at),
      views: r.views || 0,
      likes: r.likes || 0,
      comments: r.comments || 0,
      d: (r.d || []).slice(),
      status: r.live ? 'live' : 'removed',
      url: PLAT[c.platform].post(sampleId(c.platform, r.v, i), c.handle)
    };
  });
  C.views = posts.reduce(function (s, p) { return s + p.views; }, 0);
  /* Every post of the campaign (the same list as `posts`); each section
     picks its own platform from it. */
  var ALL = posts;

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

  /* ---- viewer age and gender (sample) --------------------------------------
     What YouTube shows next to geography: per video, the share of views by
     age group and by gender, counted over signed-in viewers only, in its own
     buckets and order. YouTube holds these back below a privacy floor, so a
     post needs its channel's analytics (the same flag as geography) and more
     views than geography does. Its own seed, so every other number on the
     page stays as it was. */
  var AGES = ['13–17', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'];
  var AGE_BASE = [0.13, 0.33, 0.27, 0.14, 0.07, 0.04, 0.02];
  var GENDERS = ['Male', 'Female', 'User-specified'];
  var DEMO_MIN = 100;
  var dseed = 20261105;
  function DR() {
    dseed = dseed + 0x6D2B79F5 | 0;
    var t = Math.imul(dseed ^ dseed >>> 15, 1 | dseed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  posts.forEach(function (p) {
    if (!p.creator.geoOn || p.views < DEMO_MIN) { p.demo = null; return; }
    var age = AGE_BASE.map(function (b) { return b * (0.45 + 1.2 * DR()); });
    var sum = age.reduce(function (s, v) { return s + v; }, 0);
    var male = 0.62 + 0.26 * DR(), other = DR() < 0.6 ? 0 : 0.015 * DR();
    p.demo = { age: age.map(function (v) { return v / sum; }), gender: [male, 1 - male - other, other] };
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
    ALL.forEach(function (p) {
      var v = 0;
      for (var k = period.from; k <= period.to; k++) { v += p.d[k]; }
      p.r = p.views ? v / p.views : 0;
      p.pv = v;
      p.pl = Math.round(p.likes * p.r);
      p.pc = Math.round(p.comments * p.r);
      p.live = p.d0 <= period.to;
    });
  }

  /* ---- platforms on the page -----------------------------------------------
     No platform tabs over the page (Abhisht 2026-11-16). The tiles and the
     Accounting card are always the whole campaign, the By platform card
     splits it, and the chart, Top creators, Top posts and the posts list each
     have a Platform pill of their own: All, then one option per platform the
     campaign runs on. The pill is the filters' own select, so a fourth or
     fifth platform is one more option in it, never a new layout. */
  var pf = { chart: 'all', creators: 'all', top: 'all' };
  function multi() { return C.platforms.length > 1; }
  function pick(list, k) {
    return !k || k === 'all' ? list : list.filter(function (p) { return p.platform === k; });
  }
  // the platforms a section shows: every one, or the one its pill picked
  function inView(k) { return !k || k === 'all' ? C.platforms : [k]; }
  // rows from more than one platform side by side: each carries its mark
  function mixed(k) { return inView(k).length > 1; }
  /* One platform: its own words (Subscribers, channels). More than one: the
     words that fit them all. */
  var BOTH = { fans: 'Followers', fan: 'follower', acct: 'account' };
  function word(w, k) { var v = inView(k); return v.length === 1 ? PLAT[v[0]][w] : BOTH[w]; }
  function names(list) {
    var n = list.map(function (k) { return PLAT[k].name; });
    return n.length < 3 ? n.join(' and ') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1];
  }
  function viewsOn(k, list) {
    return (list || ALL).reduce(function (s, p) { return s + (p.platform === k ? p.views : 0); }, 0);
  }
  /* SUBSCRIBERS AND FOLLOWERS are off for now on every campaign (Abhisht
     2026-11-16; the Instagram accounts are brand new). Off, the column, its
     sort, the drawer's count and the CSV column all go; true brings them all
     back. */
  var SHOW_FANS = false;
  function fansWord(k) { return word('fans', k); }
  function fansCell(c) { return num(c.subs); }
  /* The Platform pill: the posts list's filter pill, reused by every section
     that narrows to one platform. Only on a campaign with two platforms or
     more. */
  function selPlat(k) { return k === 'all' ? 'All' : PLAT[k].mark + PLAT[k].name; }
  function platSel(id, k) {
    if (!multi()) { return ''; }
    return '<label class="sel' + (k !== 'all' ? ' is-set' : '') + '" data-sel="platform"><span class="sel-k">Platform</span>'
      + '<span class="sel-v">' + selPlat(k) + '</span>'
      + '<select data-pf="' + id + '" aria-label="Platform">' + ['all'].concat(C.platforms).map(function (q) {
          return '<option value="' + q + '"' + (q === k ? ' selected' : '') + '>' + (q === 'all' ? 'All' : PLAT[q].name) + '</option>';
        }).join('') + '</select></label>';
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
    check: ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 14, 2.2),
    lock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/>', 16),
    globe16: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>', 16),
    search: ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 16),
    refresh: ic('<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>', 18),
    cal: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', 16),
    caret: ic('<path d="m7 10 5 5 5-5"/>', 14, 2),
    close: ic('<path d="M6 6l12 12M18 6 6 18"/>', 18, 2),
    chev: ic('<path d="m9 6 6 6-6 6"/>', 14, 2),
    info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>', 14),
    yt: ic('<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/>', 15),
    ig: ic('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><path d="M16.9 7.1h.01"/>', 15),
    ext: ic('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', 12, 2)
  };

  /* The platform's mark in the corner of an avatar or a thumbnail, only where
     rows from more than one platform sit together; the name rides along for
     screen readers. */
  function badge(k) {
    return '<span class="pbadge">' + PLAT[k].mark + '<span class="sr">' + PLAT[k].name + '</span></span>';
  }
  function avatar(c, size, mark) {
    return '<span class="av' + (size ? ' av--' + size : '') + '" style="--h:' + c.hue + '">'
      + '<span aria-hidden="true">' + esc(initials(c.name)) + '</span>' + (mark ? badge(c.platform) : '') + '</span>';
  }
  /* The real thumbnail when YouTube has one: the small 480x360 one in lists
     (cropped to the vertical frame), full size in the details panel. The
     coloured tile underneath shows if it fails to load or the Short is gone. */
  function thumb(a, size, flag, mark) {
    return '<span class="thumb' + (size ? ' thumb--' + size : '') + '" style="--h:' + a.hue + '">'
      + '<span class="thumb-em" aria-hidden="true">' + a.emoji + '</span>'
      + (a.thumb ? '<img src="' + (size === 'lg' ? a.thumb : 'https://i.ytimg.com/vi/' + a.id + '/hqdefault.jpg')
        + '" alt="" loading="lazy" onerror="this.remove()">' : '')
      + (flag ? '<span class="thumb-flag">Removed</span>' : '')
      + (mark ? badge(mark) : '')
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
  ALL.forEach(function (p) { byId[p.id] = p; });

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
  /* each post's shares weighted by the views it gathered in the period, so a
     big post counts for more than a small one */
  function demoOf(list) {
    var age = AGES.map(function () { return 0; }), gender = GENDERS.map(function () { return 0; });
    var covered = 0, cv = 0, total = 0;
    list.forEach(function (p) {
      total += p.pv;
      if (!p.demo || !p.pv) { return; }
      covered++;
      cv += p.pv;
      p.demo.age.forEach(function (s, k) { age[k] += s * p.pv; });
      p.demo.gender.forEach(function (s, k) { gender[k] += s * p.pv; });
    });
    var share = function (v) { return cv ? v / cv : 0; };
    return { age: age.map(share), gender: gender.map(share), covered: covered, n: list.length, cv: cv, total: total };
  }

  /* ---- header -------------------------------------------------------------- */
  var updatedAt = NOW;
  function ago(t) {
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) { return 'Updated just now'; }
    if (m < 60) { return 'Updated ' + m + ' min ago'; }
    // past two days a date reads better than "626 h ago" (blind review, 2026-11-16)
    if (m >= 2880) { return 'Updated ' + dateF(t); }
    return 'Updated ' + Math.round(m / 60) + ' h ago';
  }
  function renderHead() {
    $('#c-name').textContent = C.name;
    /* the status beside the name; one grey line under it, without the
       product (the name already says it) or the id (Copy report ID, in the
       menu) (Appy, 2026-11-16) */
    $('#c-status').innerHTML = '<span class="chip chip--live">Live</span>';
    /* data-m names each item so the app's frame fills them by name; the
       platforms ride at the end, marks and names (Abhisht, 2026-11-16) */
    $('#c-meta').innerHTML = '<span data-m="ends">Ends ' + dateF(C.ends) + '</span><span data-m="geo">' + esc(C.country) + '</span>'
      + '<span class="pm-meta" data-m="platforms">' + C.platforms.map(function (k) {
          return '<b class="pm-name">' + PLAT[k].mark + PLAT[k].name + '</b>';
        }).join('') + '</span>';
    $('#btn-copy-id').setAttribute('data-copy', C.ref);
    $('#c-updated').textContent = ago(updatedAt);
    $('#btn-refresh').innerHTML = IC.refresh;
    renderShareBtn();
    $('#btn-csv').textContent = 'Posts list (CSV)';
  }
  /* The date range and Share are off the page for now: neither is in the
     product yet (Abhisht 2026-11-16). The period stays the whole campaign,
     and their code waits here for the buttons to come back. */
  function renderRangeBtn() {
    var b = $('#btn-range');
    if (!b) { return; }
    b.innerHTML = IC.cal + '<span>' + esc(rangeLabel()) + '</span><span class="caret">' + IC.caret + '</span>';
    b.classList.toggle('is-on', !isFull());
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
    var isNew = function (p) { return p.d0 >= period.from && p.d0 <= period.to; };
    var newPosts = posts.filter(isNew).length;
    var active = groupBy(sc.filter(function (p) { return p.pv > 0; }), creatorKey).length;
    var top = $('#tiles-top'), low = $('#tiles-posts');
    var seenSub = names(C.platforms) + ' views on published posts';
    var acctsSub = word('acct') + 's posting your videos';
    /* Likes and Comments get cards of their own only on a one-platform
       campaign; with two or more, the By platform card carries them, per
       platform and in total (Abhisht 2026-11-16). */
    var counts = !multi();

    if (tilesMode === 'current') {
      top.className = 'tiles tiles--five';
      low.className = 'tiles ' + (counts ? 'tiles--four' : 'tiles--two');
      top.innerHTML =
          tile('Fill', Math.floor(C.views / C.target * 100) + '%', num(C.views) + ' of ' + num(C.target) + ' target')
        + (full ? tile('Views', num(C.views), seenSub) : tile('Views', num(pv), 'gathered ' + spanText()))
        + (full ? tile('Spend', money(lifeSpend), 'of ' + money(C.budget)) : tile('Spend', money(periodSpend), 'spent ' + spanText()))
        + (over ? tile('Over budget', money(overBy), 'spent past the ' + money(C.budget) + ' budget')
                : tile('Remaining', money(C.budget - lifeSpend), 'budget left to spend'))
        + tile('Time left', left + ' days', 'ends ' + dateF(C.ends));
      low.innerHTML =
          (full ? tile('Total posts', num(posts.length), 'live on members’ own accounts')
                : tile('New posts', num(newPosts), 'published ' + spanText()))
        + (full ? tile('Creators', num(groupBy(posts, creatorKey).length), acctsSub)
                : tile('Creators', num(active), 'with views ' + spanText()))
        + (counts ? tile('Likes', num(pl), full ? 'on those posts' : 'gathered ' + spanText())
                  + tile('Comments', num(pc), full ? 'on those posts' : 'gathered ' + spanText()) : '');
    } else {
      /* ONE HERO, FOUR FACTS (blind dashboard review, Appy 2026-11-16): Views
         is the one number that says whether this is working, so it stands
         alone with its fill; Posts and Creators are its context and ride in
         its foot. Likes and Comments become a rate, and the price the brand
         pays per 1,000 views gets a place of its own */
      var target = tilesMode === 'compact';
      var nPosts = full ? posts.length : newPosts, nCreators = full ? groupBy(posts, creatorKey).length : active;
      var by = '<span class="tile-by">From <b>' + plural(nPosts, full ? 'post' : 'new post') + '</b> by <b>' + plural(nCreators, 'creator') + '</b></span>';
      var views = full ? C.views : pv, rate = views ? (pl + pc) / views : 0;
      top.className = 'tiles tiles--hero';
      low.className = 'minis';
      top.innerHTML = (!full ? hero('Views', num(pv), 'gathered ' + spanText())
          : target ? hero('Views', num(C.views), 'of the ' + num(C.target) + ' views your budget covers', fillBar(C.views / C.target))
          : hero('Views', num(C.views), seenSub)).replace(/<\/div>$/, by + '</div>');
      low.innerHTML =
          (full ? mini('Spend', money(lifeSpend), 'of ' + money(C.budget))
                : mini('Spend', money(periodSpend), spanText()))
        + mini('Cost per 1,000 views', money(C.cpm), 'fixed for this campaign')
        + mini('Engagement', pct(rate, 1), num(pl) + ' likes \u00b7 ' + num(pc) + ' comments')
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
      /* two platforms or more: each platform's views and what they cost,
         one price per 1,000 views on every platform */
      + (multi() ? C.platforms.map(function (k) {
          var v = viewsOn(k);
          return '<tr class="acct-plat"><td><span class="acct-pl">' + PLAT[k].mark + PLAT[k].name + '</span>'
            + '<span class="acct-work">' + plural(v, 'view') + '</span></td><td>' + money(billed(v)) + '</td></tr>';
        }).join('') : '')
      + (over
        ? '<tr class="is-total"><td>Over budget<span class="acct-work">'
          + (tilesMode === 'notarget' ? 'spent past the ' + money(C.budget) + ' budget'
                                      : num(C.views - C.target) + ' views past the ' + num(C.target) + ' the budget covers')
          + '</span></td><td>' + money(overBy) + '</td></tr>'
        : '<tr class="is-total"><td>Remaining</td><td>' + money(C.budget - lifeSpend) + '</td></tr>');
    /* budget used, under the rows (CEO and PM, 2026-11-16): spent of budget,
       the error tone once it runs past */
    var used = C.budget ? lifeSpend / C.budget : 0, meter = $('#acct-meter');
    if (meter) {
      meter.className = 'acct-meter' + (over ? ' is-over' : '');
      meter.innerHTML = '<span class="acct-meter-l">Budget used</span><b class="acct-meter-v">' + Math.floor(used * 100) + '%</b>'
        + '<span class="acct-meter-bar" aria-hidden="true"><i style="width:' + Math.min(100, used * 100).toFixed(1) + '%"></i></span>';
    }
  }

  /* ---- views over time -----------------------------------------------------
     A line of the views gathered in the period, starting from nothing at its
     first day. One day on its own is drawn from the start of that day to its
     end, so a single day still reads as a line rather than a dot. */
  function niceStep(max, parts) {
    var raw = Math.max(1, max) / parts, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    return [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).filter(function (s) { return s >= raw; })[0];
  }
  /* The chart's Platform pill picks whose views it draws: every platform's
     together (All), or one platform's. Always one line. */
  function chartPoints(list) {
    var pts = [], k, s = 0, inc;
    var dayViews = function (day) { return list.reduce(function (t, p) { return t + p.d[day]; }, 0); };
    if (period.from === period.to) {
      k = period.from;
      inc = dayViews(k);
      pts.push({ label: dayShort(k), tip: dateF(dayDate(k)) + ', start of day', v: 0, inc: null });
      pts.push({ label: k === LAST ? 'Now' : 'End of day', tip: dateF(dayDate(k)) + (k === LAST ? ', so far' : ', end of day'), v: inc, inc: inc });
      return pts;
    }
    for (k = period.from; k <= period.to; k++) {
      inc = dayViews(k);
      s += inc;
      pts.push({ label: dayShort(k), tip: dateF(dayDate(k)), v: s, inc: inc });
    }
    return pts;
  }

  var CH = { W: 660, H: 250, L: 46, R: 16, T: 22, B: 32 };

  /* PER DAY OR TOTAL (CEO and PM, 2026-11-16), a switch in the card head.
     Total, the default since Appy 2026-11-17: the line below. Per day: a bar
     per day of the views gathered that day, on the same axes and date marks,
     the latest day drawn solid and labelled. Remembered per browser (a new
     key, so the old Per day default isn't carried over). Both draw the posts
     the chart's Platform pill picked. */
  var chartMode = 'total';
  try { if (window.localStorage.getItem('campaign-report:chart-view') === 'day') { chartMode = 'day'; } } catch (e) {}
  function dayViews(k, list) { return list.reduce(function (t, p) { return t + p.d[k]; }, 0); }
  function renderBars(list, who) {
    var pts = [], k, top = 0, sum = 0;
    for (k = period.from; k <= period.to; k++) {
      pts.push({ label: dayShort(k), tip: dateF(dayDate(k)) + (k === LAST ? ', so far' : ''), v: dayViews(k, list) });
    }
    var V = who ? who + 'views' : 'Views';
    $('#chart-hint').textContent = period.from === period.to ? V + ' gathered on ' + spanText() + '.'
      : isFull() ? V + ' gathered each day on published posts.' : V + ' gathered each day, ' + spanText() + '.';
    var n = pts.length;
    pts.forEach(function (p) { top = Math.max(top, p.v); sum += p.v; });
    var yMax = niceStep(top, 4) * 4, slot = (CH.W - CH.L - CH.R) / n;
    var bw = Math.max(2, Math.min(n === 1 ? 64 : 28, slot * 0.62)), hw = Math.min(slot, bw * 1.8);
    var cx = function (j) { return CH.L + slot * (j + 0.5); };
    var cy = function (v) { return CH.T + (CH.H - CH.T - CH.B) * (1 - v / yMax); };
    var base = cy(0), rules = '', labels = '', bars = '', font = ' font-family="Inter, system-ui, sans-serif"';
    for (k = 0; k <= 4; k++) {
      var v = yMax * k / 4, y = cy(v).toFixed(1);
      rules += '<line x1="' + CH.L + '" y1="' + y + '" x2="' + (CH.W - CH.R) + '" y2="' + y + '"/>';
      labels += '<text x="' + (CH.L - 9) + '" y="' + (+y + 3.5) + '" text-anchor="end">' + (v ? compact(v) : '0') + '</text>';
    }
    var marks = [], step = Math.max(1, Math.ceil((n - 1) / 4));
    for (k = 0; k < n - 1; k += step) { marks.push(k); }
    if (marks.length > 1 && n - 1 - marks[marks.length - 1] < step / 2) { marks.pop(); }
    marks.push(n - 1);
    marks.forEach(function (j) {
      labels += '<text x="' + cx(j).toFixed(1) + '" y="' + (CH.H - 10) + '" text-anchor="middle">' + esc(pts[j].label) + '</text>';
    });
    pts.forEach(function (p, j) {
      if (!p.v) { return; }
      var x = cx(j) - bw / 2, y = cy(p.v), r = Math.min(3, bw / 2, base - y), f = function (z) { return z.toFixed(1); };
      bars += '<path class="bar' + (j === n - 1 ? ' is-last' : '') + '" fill="#156efe"' + (j === n - 1 ? '' : ' fill-opacity="0.38"')
        + ' d="M' + f(x) + ' ' + f(base) + 'V' + f(y + r) + 'Q' + f(x) + ' ' + f(y) + ' ' + f(x + r) + ' ' + f(y) + 'H' + f(x + bw - r)
        + 'Q' + f(x + bw) + ' ' + f(y) + ' ' + f(x + bw) + ' ' + f(y + r) + 'V' + f(base) + 'Z"/>';
    });
    /* the latest day's count over its bar, clear of the bars just before it */
    var near = Math.max.apply(null, pts.slice(-4).map(function (p) { return p.v; }));
    var lx = n === 1 ? cx(0) : cx(n - 1) + bw / 2;
    $('#chart').innerHTML =
      '<svg viewBox="0 0 ' + CH.W + ' ' + CH.H + '" role="img" aria-label="' + V + ' gathered each day, ' + num(sum) + ' in total, ' + num(pts[n - 1].v) + ' on the latest day">'
      + '<g stroke="rgba(0,0,0,0.08)" stroke-width="1">' + rules + '</g>'
      + '<rect class="hov-band" visibility="hidden" y="' + CH.T + '" width="' + hw.toFixed(1) + '" height="' + (base - CH.T).toFixed(1) + '" rx="4" fill="rgba(0,0,0,0.04)"/>'
      + '<g fill="#767b85" font-size="10"' + font + '>' + labels + '</g>'
      + bars
      + '<text x="' + lx.toFixed(1) + '" y="' + (cy(near) - 8).toFixed(1) + '" text-anchor="' + (n === 1 ? 'middle' : 'end') + '" fill="#0b0b0d" font-size="11.5" font-weight="600"' + font + '>' + num(pts[n - 1].v) + '</text>'
      + '<rect x="' + CH.L + '" y="0" width="' + (CH.W - CH.L - CH.R) + '" height="' + CH.H + '" fill="transparent"/>'
      + '</svg><div class="chart-tip" hidden></div>';

    var svg = $('#chart svg'), band = svg.querySelector('.hov-band'), tip = $('#chart .chart-tip');
    function move(ev) {
      var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width * CH.W;
      var j = Math.max(0, Math.min(n - 1, Math.floor((px - CH.L) / slot)));
      band.setAttribute('x', (cx(j) - hw / 2).toFixed(1));
      band.setAttribute('visibility', 'visible');
      tip.hidden = false;
      tip.innerHTML = '<span>' + esc(pts[j].tip) + '</span><b>' + num(pts[j].v) + ' views that day</b>';
      tip.style.left = Math.max(70, Math.min(r.width - 70, cx(j) / CH.W * r.width)) + 'px';
      tip.style.top = (cy(pts[j].v) / CH.H * r.height) + 'px';
    }
    function leave() { band.setAttribute('visibility', 'hidden'); tip.hidden = true; }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', leave);
  }

  function renderChart() {
    var k0 = pf.chart, who = k0 === 'all' ? '' : PLAT[k0].name + ' ';
    $('#chart-pf').innerHTML = platSel('chart', k0);
    document.querySelectorAll('[data-chart-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-chart-mode') === chartMode ? 'true' : 'false');
    });
    if (chartMode === 'day') { renderBars(pick(posts, k0), who); return; }
    $('#chart-hint').textContent = isFull()
      ? (who ? who + 'views' : 'Total views') + ' gathered on published posts, by day.'
      : (who ? who + 'views' : 'Views') + ' gathered ' + spanText() + ', by day.';

    var pts = chartPoints(pick(posts, k0)), n = pts.length, k;
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
      '<svg viewBox="0 0 ' + CH.W + ' ' + CH.H + '" role="img" aria-label="' + (who ? who + 'views' : 'Views') + ' gathered by day, ' + num(last) + ' in total">'
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

  /* ---- by platform ---------------------------------------------------------
     A campaign on two platforms or more, right after the chart: one row per
     platform in the campaign's order, then the campaign's total. Campaign to
     date. Spend is the platform's views at the campaign's one price, so the
     rows add up to Amount spent. */
  function renderByPlat() {
    var el = $('#by-plat');
    el.hidden = !multi();
    if (el.hidden) { el.innerHTML = ''; return; }
    var count = function (list) {
      var r = { posts: list.length, creators: groupBy(list, creatorKey).length, views: 0, likes: 0, comments: 0 };
      list.forEach(function (p) { r.views += p.views; r.likes += p.likes; r.comments += p.comments; });
      return r;
    };
    var lead = function (r) {
      return '<span class="n c-posts">' + num(r.posts) + '</span><span class="n c-creators">' + num(r.creators) + '</span>'
        + '<span class="n is-key">' + num(r.views) + '</span>';
    };
    var tail = function (r) {
      return '<span class="n c-likes">' + num(r.likes) + '</span><span class="n c-comments">' + num(r.comments) + '</span>'
        + '<span class="n">' + money(billed(r.views)) + '</span>';
    };
    var all = count(ALL);
    var rows = C.platforms.map(function (k) {
      var r = count(pick(ALL, k)), share = all.views ? r.views / all.views : 0;
      return '<div class="tr"><span class="bp-name">' + PLAT[k].mark + PLAT[k].name + '</span>' + lead(r)
        + '<span class="bp-share c-share"><span class="bp-bar" aria-hidden="true"><i style="width:' + (share * 100).toFixed(1) + '%;--c:' + PLAT[k].color + '"></i></span>'
        + '<span class="bp-pct">' + Math.round(share * 100) + '%</span></span>' + tail(r) + '</div>';
    }).join('');
    el.innerHTML = '<div class="card-head"><div><h2 class="rep-h">By platform</h2>'
      + '<p class="rep-hint">One budget and one rate across all platforms.</p></div></div>'
      + '<div class="tbl tbl--plat"><div class="tr tr-head"><span>Platform</span><span class="n c-posts">Posts</span>'
      + '<span class="n c-creators">Creators</span><span class="n">Views</span><span class="c-share">Share<span class="bp-more"> of views</span></span>'
      + '<span class="n c-likes">Likes</span><span class="n c-comments">Comments</span><span class="n">Spend</span></div>'
      + rows
      + '<div class="tr tr-total"><span class="bp-name">Total</span>' + lead(all) + '<span class="c-share"></span>' + tail(all) + '</div></div>';
  }

  /* ---- top creators -------------------------------------------------------- */
  function renderTopCreators() {
    var k0 = pf.creators;
    var gs = groupBy(pick(scope(), k0), creatorKey).filter(function (g) { return g.views > 0; })
      .sort(function (a, b) { return b.views - a.views; });
    var head = '<div class="tr tr-head"><span>#</span><span>Creator</span><span class="n c-subs">' + fansWord(k0) + '</span>'
      + '<span class="n c-posts">Posts</span><span class="n">Views</span><span class="n c-likes">Likes</span>'
      + '<span class="n c-comments">Comments</span></div>';
    var rows = gs.slice(0, 5).map(function (g, k) {
      var c = g.first.creator;
      return '<button class="tr" type="button" data-cgroup="' + g.id + '">'
        + '<span class="t-rank">' + (k + 1) + '</span>'
        + '<span class="t-who">' + avatar(c, '', mixed(k0)) + '<span class="t-id"><b>' + esc(c.name) + '</b></span></span>'
        + '<span class="n c-subs">' + fansCell(c) + '</span>'
        + '<span class="n c-posts">' + num(g.posts.length) + '</span>'
        + '<span class="n is-key">' + num(g.views) + '</span>'
        + '<span class="n c-likes">' + num(g.likes) + '</span>'
        + '<span class="n c-comments">' + num(g.comments) + '</span>'
        + '</button>';
    }).join('');
    $('#top-creators').innerHTML =
      '<div class="card-head"><div><h2 class="rep-h">Top creators</h2>'
      + '<p class="rep-hint">' + (isFull() ? plural(groupBy(pick(posts, k0), creatorKey).length, word('acct', k0)) + ' posted for this campaign'
                                          : plural(gs.length, word('acct', k0)) + ' gathered views ' + spanText()) + '. Ranked by views.</p></div>'
      + '<div class="card-acts">' + platSel('creators', k0) + '<button class="link-btn" type="button" data-all-creators>See all</button></div></div>'
      + '<div class="tbl tbl--creators">' + head + (rows || '<div class="tbl-empty">No views yet.</div>') + '</div>';
  }

  /* ---- top posts ----------------------------------------------------------- */
  var topMore = false;
  function renderTopPosts() {
    var k0 = pf.top;
    var ranked = pick(scope(), k0).filter(function (p) { return p.pv > 0; }).sort(function (a, b) { return b.pv - a.pv || b.at - a.at; });
    var rows = ranked.slice(0, topMore ? 10 : 5).map(function (p, k) { return postRow(p, k + 1, false, mixed(k0)); }).join('');
    $('#top-posts').innerHTML =
      '<div class="card-head"><div><h2 class="rep-h">Top posts</h2>'
      + '<p class="rep-hint">Ranked by views' + (isFull() ? '' : ' gathered ' + spanText()) + '.</p></div>'
      + '<div class="card-acts">' + platSel('top', k0) + '<button class="link-btn" type="button" data-all-posts>See all</button></div></div>'
      + '<div class="plist plist--rank">' + rowHead(true, false) + (rows || '<div class="tbl-empty">No views yet.</div>') + '</div>'
      + (ranked.length > 5 ? '<div class="tbl-more"><button class="link-btn" type="button" data-top-more>' + (topMore ? 'Show fewer' : 'See more') + '</button></div>' : '');
  }

  /* ---- viewer geography ----------------------------------------------------
     THREE VIEWS, switched from the prototype bar at the bottom left. "off" is
     what ships while the backend work is pending: no geography card (a
     Coming soon note felt wrong, Abhisht 2026-10-22). "empty" is the card
     before any post has enough views for audience data (the sample data
     always has some, so this is the only way to see it). "live" is the
     finished card. The choice is remembered per browser.
     CAMPAIGN TOTALS ONLY (Abhisht 2026-11-06): geography, age and gender are
     shown for the campaign as a whole, never per post or per channel (no post
     details, no audience sections in a creator's details, no CSV columns), so
     a brand never sees which posts have no data yet. Each card is built from
     the campaign's own posts that have that data, weighted by their views,
     with no fallback to channel-level data. */
  // geography shows by default (CEO, 2026-11-16: viewer data is the headline); the dock can still hide it
  var geoAll = false, geoMode = 'live';
  try { geoMode = { off: 'off', empty: 'empty', live: 'live' }[window.localStorage.getItem('campaign-report:geo')] || 'live'; } catch (e) {}
  // the three cards' own widgets (report-audience.js, Appy 2026-11-16); his bars stay as the fallback and in the one-card layout
  var AW = window.reportAudience;
  var PROCESSING = '<div class="geo-empty">Geography data shows up once the videos have enough views. This usually takes a few days.</div>';
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
  /* WHICH PLATFORMS HAVE VIEWER DATA. Geography, age and gender come from
     YouTube only for now, so on a campaign with other platforms the numbers
     are YouTube's posts' alone, and the title says so with a "YouTube only"
     tag (Abhisht 2026-11-16). A campaign with none of these platforms gets
     no viewer data card at all. A platform whose audience we can read later
     is one more name in this list. */
  var AUD_PLATS = ['youtube'];
  function audIn() { return C.platforms.filter(function (k) { return AUD_PLATS.indexOf(k) > -1; }); }
  function audOn() { return audIn().length > 0; }
  function audPosts() { return scope().filter(function (p) { return AUD_PLATS.indexOf(p.platform) > -1; }); }
  function audTitle(title) {
    var have = audIn(), missing = C.platforms.filter(function (k) { return have.indexOf(k) < 0; });
    var tag = !missing.length ? '' : '<span class="aud-only" title="Viewer data isn’t available for ' + names(missing) + ' yet.">'
      + have.map(function (k) { return PLAT[k].mark; }).join('') + names(have) + ' only</span>';
    return '<div class="card-head"><div class="aud-title"><h2 class="rep-h">' + title + '</h2>' + tag + '</div>';
  }
  /* one general line, once: under the three cards' row, or in the one card. No
     count of posts covered, no source named */
  function audienceNote() {
    return '<p class="geo-note">' + IC.info + '<span>Based on videos with enough views to report audience data.</span></p>';
  }
  /* the three audience cards carry their title only, no hint line under it (Abhisht 2026-11-06) */
  function renderGeo() {
    var g = geoOf(audPosts()), card = $('#geo-card'), has = geoMode === 'live' && g.covered;
    card.hidden = geoMode === 'off' || audLayout === 'one' || !audOn();
    card.innerHTML = card.hidden ? '' :
      audTitle('Viewer geography')
      + (has && g.rows.length > 5 ? '<button class="link-btn" type="button" data-geo-all>' + (geoAll ? 'Show top 5' : 'Show all') + '</button>' : '')
      + '</div>'
      + (!has ? PROCESSING : AW ? '<div class="aw aw--geo">' + AW.geo(g, geoAll) + '</div>' : geoBars(g, geoAll ? 99 : 5));
    document.querySelectorAll('[data-geo-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-geo-mode') === geoMode ? 'true' : 'false');
    });
    renderAudLayout();
  }

  /* ---- viewer age, viewer gender -------------------------------------------
     The two other audience stats YouTube shows, each a card of its own under
     geography, built like it (same bars, same label column, so the bars line
     up down the page; same coverage note), each in YouTube's own order, never
     re-sorted by share. One Hidden | No data yet | Live data switch in the
     review bar runs both. Shown by default while they are being reviewed. */
  var demoMode = 'live';
  try { demoMode = { off: 'off', empty: 'empty' }[window.localStorage.getItem('campaign-report:demo')] || 'live'; } catch (e) {}
  var DEMO = [
    { key: 'age', card: '#age-card', title: 'Viewer age', word: 'age', labels: AGES },
    { key: 'gender', card: '#gender-card', title: 'Viewer gender', word: 'gender', labels: GENDERS }
  ];
  function demoEmpty(m) { return '<div class="geo-empty">' + m.word.charAt(0).toUpperCase() + m.word.slice(1) + ' data shows up once the videos have enough views. This usually takes a few days.</div>'; }
  function shareBars(labels, shares) {
    return '<div class="geo-list">' + labels.map(function (l, k) {
      var s = shares[k];
      return '<div class="geo-row"><span class="geo-name">' + esc(l) + '</span>'
        + '<span class="geo-bar"><i style="width:' + (s * 100).toFixed(1) + '%"></i></span>'
        + '<span class="geo-pct">' + (s > 0 ? pct(s) : '0%') + '</span></div>';
    }).join('') + '</div>';
  }
  function renderDemo() {
    var d = demoOf(audPosts()), has = demoMode === 'live' && d.covered;
    DEMO.forEach(function (m) {
      var card = $(m.card);
      card.hidden = demoMode === 'off' || audLayout === 'one' || !audOn();
      card.innerHTML = card.hidden ? '' :
        audTitle(m.title) + '</div>'
        + (!has ? demoEmpty(m) : AW ? '<div class="aw aw--' + m.key + '">' + AW[m.key](m.labels, d[m.key]) + '</div>' : shareBars(m.labels, d[m.key]));
    });
    document.querySelectorAll('[data-demo-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-demo-mode') === demoMode ? 'true' : 'false');
    });
    renderAudLayout();
  }

  /* ---- viewer data: one card or three (prototype review control) -----------
     "one": a single Viewer data card, the note once under its title, then
     Geography, Age and Gender as sections (Abhisht 2026-11-06: the same note
     three times was wasted space; side by side squished the bars). With no
     data in any section the card shows one empty line, not three. "three":
     the separate cards above. The Geography and Age and gender switches
     still decide which sections show and in which state. Remembered per
     browser. THREE IS THE DEFAULT (CEO and PM, 2026-11-16): three headline
     widgets under the top numbers, the note once under the row (#aud-note). */
  var audLayout = 'three';
  try { audLayout = window.localStorage.getItem('campaign-report:audcard') === 'one' ? 'one' : 'three'; } catch (e) {}
  function audSec(title, body, action) {
    return '<div class="aud-sec"><div class="aud-sec-head"><h3 class="aud-h">' + title + '</h3>' + (action || '') + '</div>' + body + '</div>';
  }
  function renderAudLayout() {
    var card = $('#aud-card'), showGeo = geoMode !== 'off', showDemo = demoMode !== 'off';
    document.querySelectorAll('[data-aud-layout]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-aud-layout') === audLayout ? 'true' : 'false');
    });
    var g = geoOf(audPosts()), d = demoOf(audPosts());
    var geoHas = geoMode === 'live' && g.covered, demoHas = demoMode === 'live' && d.covered;
    var note = $('#aud-note');
    if (note) {
      note.hidden = audLayout !== 'three' || !audOn() || !(geoHas || demoHas);
      note.innerHTML = note.hidden ? '' : audienceNote();
    }
    card.hidden = audLayout !== 'one' || !(showGeo || showDemo) || !audOn();
    if (card.hidden) { card.innerHTML = ''; return; }
    var head = audTitle('Viewer data') + '</div>';
    if (!geoHas && !demoHas) {
      card.innerHTML = head + '<div class="geo-empty">Viewer data shows up once the videos have enough views. This usually takes a few days.</div>';
      return;
    }
    var secs = [];
    if (showGeo) {
      secs.push(audSec('Geography', geoHas ? geoBars(g, geoAll ? 99 : 5) : PROCESSING,
        geoHas && g.rows.length > 5 ? '<button class="link-btn" type="button" data-geo-all>' + (geoAll ? 'Show top 5' : 'Show all') + '</button>' : ''));
    }
    if (showDemo) {
      DEMO.forEach(function (m) {
        secs.push(audSec(m.word.charAt(0).toUpperCase() + m.word.slice(1), demoHas ? shareBars(m.labels, d[m.key]) : demoEmpty(m)));
      });
    }
    card.innerHTML = head + audienceNote() + secs.join('');
  }

  /* ---- posts: filter, sort, group, page ------------------------------------
     One list view. Sorting lives on the column headers (Published flips
     newest and oldest, the counts sort high to low), so there is no separate
     sort control. */
  var DEFAULTS = { q: '', sort: 'newest', platform: 'all', posted: 'any', views: 'any', status: 'all', group: 'none' };
  var state = { q: '', sort: 'newest', platform: 'all', posted: 'any', views: 'any', status: 'all', group: 'none', page: 1, size: 20, open: {} };
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
      if (state.platform !== 'all' && p.platform !== state.platform) { return false; }
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
      + col('newest', 'Published', 'c-pub') + col('subs', fansWord(), 'c-subs')
      + col('views', 'Views', 'c-views') + col('likes', 'Likes', 'c-likes') + col('comments', 'Comments', 'c-comments')
      + '<span class="c-acts"></span></div>';
  }
  function listHead() {
    return rowHead(false, true, state.group === 'none' ? '' : '<span class="c-lead">Creator</span>');
  }
  /* Title and creator open YouTube in a new tab. They read as plain text until
     hovered, then turn blue and underlined with an external-link mark. The row
     itself opens nothing: there are no post details (campaign totals only,
     Abhisht 2026-11-06). */
  function channelUrl(c) { return PLAT[c.platform].home(c.handle); }
  function xlink(href, text) {
    return '<a class="xlink" href="' + href + '" target="_blank" rel="noopener"><span class="xl-text">' + esc(text) + '</span>'
      + '<span class="xlink-ic" aria-hidden="true">' + IC.ext + '</span></a>';
  }
  function key(k, sortable) {
    if (!sortable) { return k === 'views' ? ' is-key' : ''; }
    return state.sort === k ? ' is-key' : '';
  }
  function postRow(p, rank, sortable, mark) {
    var gone = p.status === 'removed';
    return '<div class="post' + (gone ? ' is-removed' : '') + '">'
      + (rank ? '<span class="t-rank c-rank">' + rank + '</span>' : '')
      + '<span class="t-content c-content">' + thumb(p.asset, '', false, mark ? p.platform : '') + '<span class="pc-text">'
      + '<span class="pc-title">' + xlink(p.url, p.asset.title) + '</span>'
      + '<span class="pc-by">' + esc(p.creator.name) + '</span>'
      + (gone ? '<span class="chip chip--removed" title="This video is no longer on ' + PLAT[p.platform].name + '. Its last known views still count.">Removed</span>' : '')
      + '<span class="post-mstats"><span class="stat">' + dateF(p.at) + '</span>' + statsInline(p) + '</span>'
      + '</span></span>'
      + '<span class="t-creator c-creator">' + avatar(p.creator, 'sm') + xlink(channelUrl(p.creator), p.creator.name) + '</span>'
      + '<span class="post-pub c-pub"><span>' + dateF(p.at) + '</span><span>' + timeF(p.at) + '</span></span>'
      + '<span class="post-n c-subs' + key('subs', sortable) + '">' + fansCell(p.creator) + '</span>'
      + '<span class="post-n c-views' + key('views', sortable) + '">' + num(p.pv) + '</span>'
      + '<span class="post-n c-likes' + key('likes', sortable) + '">' + num(p.pl) + '</span>'
      + '<span class="post-n c-comments' + key('comments', sortable) + '">' + num(p.pc) + '</span>'
      + '<span class="post-acts c-acts">'
      + '<button class="icon-sm" type="button" data-menu="' + p.id + '" aria-label="More for this post" aria-haspopup="menu" aria-expanded="false">' + IC.more + '</button>'
      + '</span></div>';
  }
  function groupRow(g) {
    var open = !!state.open[g.id], c = g.first.creator;
    var who = avatar(c, '', mixed(state.platform)) + '<span class="grp-id"><b>' + esc(c.name) + '</b><span>' + plural(g.posts.length, 'post') + '</span></span>';
    return '<div class="grp' + (open ? ' is-open' : '') + '">'
      + '<div class="grp-head"><button class="grp-tog" type="button" data-grp="' + g.id + '" aria-expanded="' + open + '"><span class="chev">' + IC.chev + '</span>' + who + '</button>'
      + '<span class="c-pub"></span>'
      + '<span class="post-n c-subs">' + fansCell(c) + '</span>'
      + '<span class="post-n c-views is-key">' + num(g.views) + '</span>'
      + '<span class="post-n c-likes">' + num(g.likes) + '</span>'
      + '<span class="post-n c-comments">' + num(g.comments) + '</span>'
      + '<span class="post-acts c-acts"><button class="icon-sm" type="button" data-menu="' + g.id + '" data-menu-kind="creator" aria-label="More for ' + esc(c.name) + '" aria-haspopup="menu" aria-expanded="false">' + IC.more + '</button></span></div>'
      + (open ? '<div class="grp-body">' + g.posts.map(function (q) { return postRow(q, 0, true, mixed(state.platform)); }).join('') + '</div>' : '')
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

    var active = ['q', 'platform', 'posted', 'views', 'status'].some(function (k) { return state[k] !== DEFAULTS[k]; });
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
      body = listHead() + (isGrouped ? slice.map(groupRow) : slice.map(function (p) { return postRow(p, 0, true, mixed(state.platform)); })).join('');
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
    var ps = document.querySelector('[data-pf="posts"]');
    if (ps) {
      ps.value = state.platform;
      ps.closest('.sel').querySelector('.sel-v').innerHTML = selPlat(state.platform);
      ps.closest('.sel').classList.toggle('is-set', state.platform !== 'all');
    }
    if (document.activeElement !== $('#f-q')) { $('#f-q').value = state.q; }
  }
  /* A filter that leaves fewer rows used to shrink the card and drag the page up
     under the reader. While any filter is on, the card keeps the tallest height
     it has had; clearing the filters lets it go. */
  var FILTER_KEYS = ['q', 'platform', 'posted', 'views', 'status', 'group'];
  function setState(patch) {
    var card = $('#posts-card'), before = card.offsetHeight;
    var filtering = Object.keys(patch).some(function (k) { return FILTER_KEYS.indexOf(k) > -1; });
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    if (!('page' in patch)) { state.page = 1; }
    syncSelects();
    renderPosts();
    var active = ['q', 'platform', 'posted', 'views', 'status'].some(function (k) { return state[k] !== DEFAULTS[k]; });
    if (!active) { card.style.minHeight = ''; }
    else if (filtering) { card.style.minHeight = Math.max(before, parseFloat(card.style.minHeight) || 0) + 'px'; }
  }

  /* ---- everything that follows the period ---------------------------------- */
  function renderAll() {
    applyPeriod();
    // no Subscribers column while SHOW_FANS is off, and no sort left on it
    document.documentElement.classList.toggle('no-fans', !SHOW_FANS);
    if (!SHOW_FANS && state.sort === 'subs') { state.sort = 'newest'; }
    renderRangeBtn();
    renderTiles();
    renderChart();
    renderByPlat();
    renderTopCreators();
    renderTopPosts();
    renderGeo();
    renderDemo();
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
    if ($('#btn-range')) { $('#btn-range').setAttribute('aria-expanded', 'false'); }
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
    drawer.scrollTop = 0;
    var close = drawer.querySelector('[data-dr-close]');
    if (close) { close.focus({ preventScroll: true }); }
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    document.body.style.overflow = '';
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
  /* Only a creator has details now: their posts and counts. No audience
     sections and no post details behind the post rows (campaign totals
     only, Abhisht 2026-11-06). */
  function paintDrawer() {
    var view = stack[stack.length - 1], html;
    var top = '<div class="dr-top">'
      + (stack.length > 1 ? '<button class="dr-back" type="button" data-dr-back>&lsaquo; Back</button>' : '<span class="dr-kicker">Creator</span>')
      + '<button class="icon-sm" type="button" data-dr-close aria-label="Close">' + IC.close + '</button></div>';

    var g = view.group, c = g.first.creator, P = PLAT[c.platform];
    /* on a multi-platform campaign the details name the platform too */
    var head = '<div class="dr-who" style="margin-top:0">' + avatar(c, 'lg', multi()) + '<div><h3 style="font-size:16px">' + esc(c.name) + '</h3>'
        + '<span>' + (multi() ? P.name + ' · ' : '') + plural(g.posts.length, 'post') + (SHOW_FANS ? ' · ' + plural(c.subs, P.fan) : '') + '</span></div></div>';
    var list = g.posts.slice().sort(SORTS.views);
    html = top + head
      + periodNote()
      + drStats(g.views, g.likes, g.comments)
      + '<section class="dr-sec"><h4 class="rep-h">Posts</h4><div class="dr-list">' + list.map(function (q) {
          return '<div class="dr-item">'
            + '<span class="post-who"><span style="width:22px;flex:none">' + thumb(q.asset) + '</span>'
            + '<span class="post-id"><b>' + esc(q.asset.title) + '</b><span>' + when(q.at) + (q.status === 'removed' ? ' · Removed' : '') + '</span></span></span>'
            + '<span class="post-n">' + num(q.pv) + '</span></div>';
        }).join('') + '</div></section>';
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
    /* a creator row (grouped by creator) keeps Details; a post row has no
       details, only its links, in its own platform's words */
    var isCreator = btn.getAttribute('data-menu-kind') === 'creator';
    var pk = isCreator ? lastGroups[id].first.creator.platform : byId[id].platform, P = PLAT[pk];
    var pic = { youtube: IC.yt, instagram: IC.ig }[pk] || IC.ext;
    menu.innerHTML = isCreator
      ? item('cdetails', IC.info, 'Details') + item('channel', pic, P.openAcct) + item('ccopy', IC.link, P.copyAcct)
      : item('yt', pic, 'Open on ' + P.name) + item('copy', IC.link, 'Copy link');
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
  /* PRIVATE UNTIL THE OWNER SAYS OTHERWISE (ROB-21554). One switch per report,
     "Anyone with the link can view", off by default. Off stops the link at once;
     on again brings back the SAME link, so links already sent work again. The
     prototype keeps the setting in localStorage; the product keeps it on the
     campaign, with a share token and a report read that needs no sign-in. */
  var pop = $('#share-pop');
  var SHARE_KEY = 'campaign-report:shared:' + C.ref;
  var SHARE_URL = 'https://onblue.ai/r/' + C.ref + '-k7Q2';
  var shared = false;
  try { shared = window.localStorage.getItem(SHARE_KEY) === 'on'; } catch (e) {}

  /* The label stays "Share" in both states so the buttons beside it never move;
     the icon carries the state: a lock while private, a globe once shared. */
  function renderShareBtn() {
    var b = $('#btn-share');
    if (!b) { return; }
    b.innerHTML = (shared ? IC.globe16 : IC.lock) + 'Share';
    b.classList.toggle('is-shared', shared);
    b.title = shared ? 'Shared: anyone with the link can view' : 'Private: only you can see this report';
  }
  function paintShare() {
    pop.innerHTML = '<h3>Share this report</h3>'
      + '<button class="share-row" type="button" role="switch" aria-checked="' + shared + '" data-share-toggle>'
      + '<span class="share-ic">' + (shared ? IC.globe16 : IC.lock) + '</span>'
      + '<span class="share-txt"><b>Anyone with the link can view</b><span>'
      + (shared ? 'The numbers stay up to date.' : 'Only you can see this report.')
      + '</span></span><span class="switch" aria-hidden="true"><i></i></span></button>'
      + (shared ? '<div class="pop-link"><input readonly value="' + SHARE_URL + '" aria-label="Report link"><button class="btn" type="button" data-copy="' + SHARE_URL + '">Copy</button></div>' : '');
  }
  // The popover is repainted, so a keyboard user gets focus put back on the
  // switch; a mouse click doesn't, which would only draw a focus ring.
  function setShared(on, byKeyboard) {
    shared = on;
    try { window.localStorage.setItem(SHARE_KEY, on ? 'on' : 'off'); } catch (e) {}
    renderShareBtn();
    paintShare();
    applyViewAs();
    var sw = pop.querySelector('[data-share-toggle]');
    if (sw && byKeyboard) { sw.focus(); }
  }
  function closeShare() {
    pop.hidden = true;
    var b = $('#btn-share');
    if (b) { b.classList.remove('is-on'); b.setAttribute('aria-expanded', 'false'); }
  }
  function toggleShare() {
    if (!pop.hidden) { closeShare(); return; }
    paintShare();
    pop.hidden = false;
    $('#btn-share').setAttribute('aria-expanded', 'true');
    $('#btn-share').classList.add('is-on');
    var r = $('#btn-share').getBoundingClientRect();
    pop.style.top = (r.bottom + 8) + 'px';
    pop.style.left = Math.max(16, Math.min(window.innerWidth - pop.offsetWidth - 16, r.right - pop.offsetWidth)) + 'px';
  }

  /* ---- view as (prototype review control) --------------------------------- */
  /* Three people can open a report:
     - owner: the brand's own account, everything.
     - viewer: opened the share link. Sharing on: the report read only (no
       account, no All campaigns link, no Share, no CSV). Sharing off: the
       no-permission page.
     - other: a different signed-in account on the report's own address. That
       address is owner only whatever the share switch says, so always the
       no-permission page, with "Switch account" instead of "Sign in".
     "Sign in" / "Switch account" lead back to the owner's view here. */
  var viewAs = 'owner';
  try { viewAs = window.localStorage.getItem('campaign-report:viewas') || 'owner'; } catch (e) {}
  if (['owner', 'viewer', 'other'].indexOf(viewAs) < 0) { viewAs = 'owner'; }
  function applyViewAs() {
    var viewer = viewAs === 'viewer', other = viewAs === 'other';
    document.body.classList.toggle('is-viewer', viewer);
    document.body.classList.toggle('is-link-off', (viewer && !shared) || other);
    $('#top-name').textContent = other ? 'Another account' : 'Abhisht';
    $('#link-off-signin').textContent = other ? 'Switch account' : 'Sign in';
    if (viewer || other) { closeShare(); }
    document.querySelectorAll('[data-viewas]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-viewas') === viewAs ? 'true' : 'false');
    });
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
  /* A copy button answers on itself: "Copied" with a check, then back to its
     label. The eyes are on the button, and a toast at the bottom of the screen
     is easy to miss. Copies from a menu (which closes) still use the toast. */
  function flashCopied(btn) {
    if (!btn._label) { btn._label = btn.innerHTML; }
    btn.innerHTML = IC.check + 'Copied';
    btn.classList.add('is-copied');
    clearTimeout(btn._copiedT);
    btn._copiedT = setTimeout(function () {
      btn.innerHTML = btn._label;
      btn._label = null;
      btn.classList.remove('is-copied');
    }, 1600);
  }
  function copy(text, btn) {
    var done = btn ? function () { flashCopied(btn); } : function () { toast('Link copied'); };
    try {
      navigator.clipboard.writeText(text).then(done, done);
    } catch (e) { done(); }
  }
  function csvCell(v) {
    var s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function downloadCsv() {
    /* no per-post audience columns: campaign totals only (Abhisht 2026-11-06) */
    /* the posts the list shows, its Platform pill included. A YouTube only
       campaign's file is as it was (less Subscribers while SHOW_FANS is off);
       any other gets a Platform column, and the account column in words that
       fit what is in it */
    var list = filtered(), span = isFull() ? 'Campaign to date' : spanText();
    var yt = C.platforms.length === 1 && C.platforms[0] === 'youtube', k0 = state.platform;
    var acct = word('acct', k0);
    var acctCol = yt ? 'Channel' : mixed(k0) ? 'Channel or account' : acct.charAt(0).toUpperCase() + acct.slice(1);
    var fansCol = yt ? 'Subscribers' : mixed(k0) ? 'Subscribers or followers' : fansWord(k0);
    var rows = [['Period'].concat(yt ? [] : ['Platform'], ['Posted at', acctCol], SHOW_FANS ? [fansCol] : [],
      ['Video title', 'Post URL', 'Status', 'Views', 'Likes', 'Comments'])];
    list.forEach(function (p) {
      rows.push([span].concat(yt ? [] : [PLAT[p.platform].name], [new Date(p.at).toISOString(), p.creator.name],
        SHOW_FANS ? [p.creator.subs] : [],
        [p.asset.title, p.url, p.status === 'removed' ? 'Removed' : 'Live', p.pv, p.pl, p.pc]));
    });
    /* THE PROTOTYPE SAYS IT, IT DOESN'T DO IT (Appy, 2026-11-17): a real file
       download from inside the app's frame blanked the page, so the button
       answers with a toast. The rows above are the file's spec for the build. */
    void rows;
    toast('Downloading CSV, ' + plural(list.length, 'post'));
  }

  /* ---- events -------------------------------------------------------------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('button, a');

    if (!menu.hidden && !(t && menu.contains(t)) && !(t && t === menuBtn)) { closeMenu(); }
    if (!pop.hidden && !ev.target.closest('#share-pop') && !(t && t.id === 'btn-share')) { closeShare(); }
    if (!rpop.hidden && !ev.target.closest('#range-pop') && !(t && t.id === 'btn-range')) { closeRange(); }
    if (!t) { return; }

    var a;
    if ((a = t.getAttribute('data-menu'))) {
      if (menuBtn === t) { closeMenu(); } else { openMenu(t); }
      return;
    }
    if ((a = t.getAttribute('data-act'))) {
      var id = t.getAttribute('data-id'), p = byId[id], g = lastGroups[id];
      closeMenu();
      if (a === 'yt') { window.open(p.url, '_blank', 'noopener'); }
      if (a === 'copy') { copy(p.url); }
      if (a === 'cdetails') { openDrawer({ kind: 'creator', group: g }); }
      if (a === 'channel') { window.open(channelUrl(g.first.creator), '_blank', 'noopener'); }
      if (a === 'ccopy') { copy(channelUrl(g.first.creator)); }
      return;
    }
    if ((a = t.getAttribute('data-plat-mode'))) {
      /* the sample's accounts are dealt out at load, so a new pick reloads;
         a ?platforms= in the address would win over it, so it goes */
      try { window.localStorage.setItem('campaign-report:platforms', a); } catch (e) {}
      var u = new URL(location.href);
      u.searchParams.delete('platforms');
      location.replace(u.href);
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
    if (t.hasAttribute('data-share-toggle')) { setShared(!shared, ev.detail === 0); return; }
    if ((a = t.getAttribute('data-viewas'))) {
      viewAs = a;
      try { window.localStorage.setItem('campaign-report:viewas', a); } catch (e) {}
      applyViewAs();
      return;
    }
    if ((a = t.getAttribute('data-copy'))) { copy(a, t); return; }
    if (t.hasAttribute('data-clear') || t.id === 'f-clear') {
      clearTimeout(searchT);
      searching(false);
      $('#f-q').value = '';
      setState({ q: '', platform: 'all', posted: 'any', views: 'any', status: 'all' });
      return;
    }
    if (t.hasAttribute('data-geo-all')) { geoAll = !geoAll; renderGeo(); return; }
    if ((a = t.getAttribute('data-tiles-mode'))) {
      tilesMode = a;
      try { window.localStorage.setItem('campaign-report:tiles', a); } catch (e) {}
      renderTiles();
      return;
    }
    if ((a = t.getAttribute('data-chart-mode'))) {
      chartMode = a === 'day' ? 'day' : 'total';
      try { window.localStorage.setItem('campaign-report:chart-view', chartMode); } catch (e) {}
      renderChart();
      return;
    }
    if ((a = t.getAttribute('data-geo-mode'))) {
      geoMode = a;
      try { window.localStorage.setItem('campaign-report:geo', a); } catch (e) {}
      renderGeo();
      return;
    }
    if ((a = t.getAttribute('data-aud-layout'))) {
      audLayout = a;
      try { window.localStorage.setItem('campaign-report:audcard', a); } catch (e) {}
      renderGeo();
      renderDemo();
      return;
    }
    if ((a = t.getAttribute('data-demo-mode'))) {
      demoMode = a;
      try { window.localStorage.setItem('campaign-report:demo', a); } catch (e) {}
      renderDemo();
      return;
    }
    if (t.hasAttribute('data-top-more')) { topMore = !topMore; renderTopPosts(); return; }
    if (t.hasAttribute('data-all-creators')) {
      setState({ group: 'creator', sort: 'views', open: {}, platform: pf.creators });
      $('#posts-card').scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if (t.hasAttribute('data-all-posts')) {
      setState({ group: 'none', sort: 'views', platform: pf.top });
      $('#posts-card').scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if (t.hasAttribute('data-dr-close')) { closeDrawer(); return; }
    if (t.hasAttribute('data-dr-back')) { stack.pop(); paintDrawer(); return; }
    if (t.id === 'btn-range') { if (rpop.hidden) { openRange(); } else { closeRange(); } return; }
    if (t.id === 'btn-share') { toggleShare(); return; }
    if (t.id === 'btn-csv') { downloadCsv(); return; }
    if (t.id === 'btn-pdf') { toast('Downloading PDF'); return; }
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
    /* a Platform pill: the posts list's goes through its filters; the
       chart's and the top tables' redraw just their own card */
    var pid = s.getAttribute && s.getAttribute('data-pf');
    if (pid) {
      if (pid === 'posts') { setState({ platform: s.value }); return; }
      pf[pid] = s.value;
      if (pid === 'chart') { renderChart(); } else if (pid === 'creators') { renderTopCreators(); } else { renderTopPosts(); }
      var again = document.querySelector('[data-pf="' + pid + '"]');
      if (again) { again.focus({ preventScroll: true }); }
      return;
    }
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
  // Instagram's gradient, defined once for every mark on the page
  document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>'
    + '<linearGradient id="rp-ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">'
    + '<stop offset="0" stop-color="#FEC053"/><stop offset=".35" stop-color="#F2203E"/><stop offset=".7" stop-color="#B729A8"/><stop offset="1" stop-color="#5342D6"/>'
    + '</linearGradient></defs></svg>');
  document.querySelectorAll('[data-plat-mode]').forEach(function (b) {
    b.setAttribute('aria-pressed', b.getAttribute('data-plat-mode') === platMode ? 'true' : 'false');
  });
  // the posts list's Platform pill leads its filters
  $('.filters').insertAdjacentHTML('afterbegin', platSel('posts', 'all'));
  $('#f-q').placeholder = 'Search titles or ' + word('acct') + 's';
  $('.search-ic').innerHTML = IC.search;
  applyViewAs();
  renderHead();
  syncSelects();
  renderAll();
})();
