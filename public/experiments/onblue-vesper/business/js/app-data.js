/* The dashboard's data, built from the free report: the videos (and where
   each one is: making, waiting for your yes, posting, live), the daily views
   timeline (daily delta, old videos included, Ashish 2026-11-03), spend at
   $8 per 1,000 US views, and each competitor's top Shorts. Illustrative and
   deterministic. One clip per video, and a clip's format is the format the
   card says. Everything follows the report: the angles you kept, the
   formats it found, your budget and pace, and how far you got (r.done, the
   steps finished before sign-up; a report without it counts as finished).
   Two prototype stages: 'new' (just signed up) and 'running' (two weeks in).
   Exposes OB.app. */
(function () {
  'use strict';
  var OB = window.OB, DAYS = 14, V = 4, STEPS = 6;

  var r = OB.report.get() || OB.report.make({ site: 'northline-coffee.com' });
  var stage = OB.store('onblue-app-stage') || 'new';
  var KEY = 'onblue-app-' + stage;
  var done = stage === 'running' || typeof r.done !== 'number' ? STEPS : Math.max(0, Math.min(STEPS, r.done));
  // has(2): competitors found, has(3): formats, has(4): angles, has(5): first videos, has(6): plan
  var progress = { done: done, total: STEPS, finished: done >= STEPS, has: function (n) { return done >= n; } };

  // what each clip shows, so a title never fights its picture (two takes each)
  var SHOWS = {
    'pm-ai-drama-cat': ['The cat runs this house now', 'Cat versus Monday'], 'aquarium-night-diver': ['The night shift at the aquarium', 'One last dive before closing'],
    'pm-evolution-counter': ['A hundred years in thirty seconds', 'How it got this way, year by year'], 'pm-ai-drama-photoreal': ['She almost quit at 3 am', 'The call that changed her week'],
    'dj-last-set-4am': ['The last set at 4 am', 'One more song, then home'], 'pm-what-if-3d': ['What if it ran itself?', 'What if, in 3D'],
    'pm-deal-reveal': ['The deal, revealed', 'Wait for the price'], 'pm-ai-drama-fruit': ['The fruit bowl drama, part 2', 'Nobody touch the last banana'],
    'dragon-finally-naps': ['The dragon finally naps', 'Even dragons take a break'], 'pm-then-vs-now': ['3 am in 2015 vs now', 'Then vs now, honestly'],
    'pm-when-meme': ['When your coach remembers', 'Three weeks later, he remembered'], 'ferris-wheel-operator-midnight': ['The ferris wheel at midnight', 'Last ride of the night'],
    'pm-ai-micro-horror': ['My webcam turned on by itself', 'Do not look behind the screen'], 'pm-price-counter': ['What it really costs, counted', 'Every dollar, counted'],
    'hot-air-balloon-dawn': ['Up before the sun', 'The balloon at dawn'], 'pm-talking-pc': ['My PC has opinions', 'The computer that talks back'],
    'pm-2000s-real-time': ['Installing a game in 2003, in real time', 'Disc 1 of 4'], 'frog-choir-night-concert': ['The frog choir plays the night shift', 'Front row at the pond'],
    'pm-lab-prank': ['Make the school PC look hacked', 'The screen trick everyone tried'], 'pirate-captain-perfect-sailor': ['The captain who never gets lost', 'The perfect sailor'],
    'storm-chaser-night-drive': ['Chasing the storm home', 'The night drive'], 'comet-every-40-years': ['The comet that comes back every 40 years', 'Once in 40 years'],
    'clock-tower-keeper': ['Who winds the clock tower?', 'The clock tower keeper'], 'penguin-dad-polar-night': ['Penguin dad waits out the night', 'The longest night of the year']
  };
  var BAD = { 'storm-chaser-night-drive': 1 };   // its poster has a white frame baked in
  var BAR = { 'pm-deal-reveal': 1 };   // a happy-hour promo: only for a brand whose report has Deal reveal
  function label(i) { return OB.FILMS[i][1]; }
  function shows(i) { return SHOWS[OB.FILMS[i][0]]; }
  function same(a, b) { return String(a).toLowerCase() === String(b).toLowerCase(); }
  function matches(format) {
    var out = []; OB.FILMS.forEach(function (f, i) { if (!BAD[f[0]] && same(f[1], format)) { out.push(i); } }); return out;
  }
  // two pools, so a rival never shows one of your videos: yours (your first videos, up to three
  // clips per format in your report, and a fixed share of the rest for tests) and the rivals'
  var FMTS = r.formats.map(function (f) { return f.name; }).concat(r.angles.map(function (a) { return a.format; }));
  var RIVAL = {};
  (function () {
    var own = {}, rest = [];
    r.videos.forEach(function (v) { own[v.film] = 1; });
    FMTS.forEach(function (f) { matches(f).slice(0, 3).forEach(function (i) { own[i] = 1; }); });
    OB.FILMS.forEach(function (f, i) { if (!own[i] && !BAD[f[0]] && !BAR[f[0]]) { rest.push(i); } });
    rest.sort(function (a, b) { return OB.hash(r.site + a) - OB.hash(r.site + b); });
    rest.slice(0, Math.max(6, Math.ceil(rest.length / 2))).forEach(function (i) { RIVAL[i] = 1; });
  })();
  function ok(i) { return !RIVAL[i] && !BAD[OB.FILMS[i][0]] && (!BAR[OB.FILMS[i][0]] || FMTS.some(function (f) { return same(f, OB.FILMS[i][1]); })); }
  function mine(format) { return matches(format).filter(ok); }
  // a clip for a format, skipping clips already in `used` (an index -> true map)
  function take(format, used, salt) {
    var m = mine(format).filter(function (i) { return !used[i]; });
    var pick = m.length ? m[0] : -1;
    for (var k = 0; pick < 0 && k < OB.FILMS.length; k++) { var j = (Math.abs(salt | 0) + k * 5) % OB.FILMS.length; if (!used[j] && ok(j)) { pick = j; } }
    if (pick < 0) { pick = OB.filmFor(format, salt); }
    used[pick] = true; return pick;
  }
  function onAngles() { return r.angles.filter(function (a) { return a.on !== false; }); }
  function vid(id, title, format, film, angle, status, ago, base) {
    return { id: id, title: title, format: format, film: film, angle: angle, status: status, ago: ago, base: base || 0 };
  }

  // two weeks in: the first videos, then the angles you kept and the report's
  // formats, as many as your pace makes in about 13 days. A clip outside the
  // report's formats only fills in when those run out (a test, and it gets fewer
  // views). A format whose only angle you turned off is never made.
  function running() {
    var used = {}, vs = [], on = onAngles(); if (!on.length) { on = r.angles.slice(0, 1); }
    var off = r.angles.filter(function (a) { return a.on === false && !on.some(function (b) { return same(b.format, a.format); }); }).map(function (a) { return a.format.toLowerCase(); });
    var pace = r.perWeek || 5, n = Math.max(6, Math.min(14, Math.round(pace * 13 / 7)));
    r.videos.forEach(function (v) { used[v.film] = true; vs.push(vid('v' + vs.length, v.title, v.format, v.film, v.who, 'live', 0)); });
    var plan = on.filter(function (a) { return !r.videos.some(function (v) { return v.who === a.who; }); }).map(function (a) { return { title: a.say, format: a.format, who: a.who }; });
    r.formats.forEach(function (f) { if (off.indexOf(f.name.toLowerCase()) < 0) { plan.push({ format: f.name }); } });
    on.forEach(function (a) { plan.push({ format: a.format, who: a.who }); });
    for (var k = 0; vs.length < n && k < plan.length * 3; k++) {
      var p = plan[k % plan.length], free = mine(p.format).filter(function (i) { return !used[i]; });
      if (!free.length) { continue; }
      used[free[0]] = true;
      vs.push(vid('v' + vs.length, p.title && k < plan.length ? p.title : shows(free[0])[0], label(free[0]), free[0], p.who || on[vs.length % on.length].who, 'live', 0));
    }
    for (var j = 0; vs.length < n && j < OB.FILMS.length; j++) {
      var q = (OB.hash(r.site + r.brand) + j * 5) % OB.FILMS.length;
      if (used[q] || !ok(q) || off.indexOf(label(q).toLowerCase()) >= 0) { continue; }
      used[q] = true; var t = vid('v' + vs.length, shows(q)[0], label(q), q, on[vs.length % on.length].who, 'live', 0); t.test = true; vs.push(t);
    }
    var L = vs.length - 3;   // the newest three: one posting, two waiting for your yes
    vs.forEach(function (v, i) {
      if (i < L) { v.ago = Math.round(12 - i * 11 / Math.max(1, L - 1)); v.base = (5000 + (OB.hash(v.id + r.brand) % 11000)) * (v.test ? 0.6 : 1.4); } else { v.status = i === L ? 'posting' : 'approve'; }
    });
    // about a quarter of the budget spent so far, so every figure follows the budget you set
    var budget = r.budget || 500, raw = vs.reduce(function (s, v) { return s + views(v); }, 0);
    var f = raw ? budget * 0.27 / OB.RATE * 1000 / raw : 1;
    vs.forEach(function (v) { v.base = Math.round(v.base * f); });
    return vs;
  }
  function init() {
    var vs = [];
    if (stage === 'running') { vs = running(); } else if (progress.has(5)) {
      vs = r.videos.map(function (v, i) { return vid('v' + i, v.title, v.format, v.film, v.who || '', 'approve', 0); });
    }
    return { v: V, done: done, videos: vs, budget: r.budget || 500, budgetSet: progress.finished, paused: false, perWeek: r.perWeek || 5, seq: 0 };
  }
  var st = OB.store(KEY);
  if (!st || st.v !== V || st.done !== done) { st = init(); }
  function save() { OB.store(KEY, st); }
  save();

  // views a live video gets on its Nth day out: a launch spike, then a long tail
  function daily(v, age) {
    if (age < 0) { return 0; }
    var curve = [0.34, 0.24, 0.14][age];
    return Math.round(v.base * (curve !== undefined ? curve : 0.06 * Math.pow(0.86, age - 3)));
  }
  function views(v) { var s = 0; for (var a = 0; a <= v.ago; a++) { s += daily(v, a); } return v.status === 'live' ? s : 0; }

  // the timeline: one column per day, split into videos posted in the last 3 days (ages 0 to 2) and older ones
  function timeline() {
    var out = [];
    for (var k = DAYS - 1; k >= 0; k--) {
      var fresh = 0, old = 0;
      st.videos.forEach(function (v) {
        if (v.status !== 'live') { return; }
        var age = v.ago - k, n = daily(v, age);
        if (age >= 0 && age <= 2) { fresh += n; } else { old += n; }
      });
      var d = new Date(); d.setDate(d.getDate() - k);
      out.push({ date: d, fresh: fresh, old: old, total: fresh + old, today: k === 0 });
    }
    while (out.length > 1 && !out[0].total) { out.shift(); }   // start at the first day with views
    return out;
  }

  function kpis() {
    var live = st.videos.filter(function (v) { return v.status === 'live'; });
    var total = live.reduce(function (s, v) { return s + views(v); }, 0);
    var spent = Math.min(st.budget, total / 1000 * OB.RATE);
    var oldest = live.reduce(function (m, v) { return Math.max(m, v.ago); }, 0);
    return { views: total, spent: spent, left: Math.max(0, st.budget - spent), live: live.length, days: oldest + 1,
      creators: live.length ? 14 + live.length * 9 : 0, waiting: st.videos.filter(function (v) { return v.status === 'approve'; }).length,
      making: st.videos.filter(function (v) { return v.status === 'making'; }).length };
  }

  // each competitor's top six Shorts, from the rivals' own pool of clips (never one of yours),
  // fixed per competitor
  var OTHER = [];
  OB.FILMS.forEach(function (f, i) { if (RIVAL[i]) { OTHER.push(i); } });
  OTHER.sort(function (a, b) { return OB.hash(r.site + a) - OB.hash(r.site + b); });
  var cache = {};
  function shorts(x) {
    if (cache[x.name]) { return cache[x.name]; }
    var k = Math.max(0, r.rivals.indexOf(x)), h = OB.hash(x.name), per = x.views / x.videos, top = r.longest.days, picks = [];
    for (var i = 0; picks.length < 6; i++) { var n = k * 5 + i; picks.push([OTHER[n % OTHER.length], Math.floor(n / OTHER.length) % 2]); }
    var list = picks.map(function (p, j) {
      return { title: shows(p[0])[p[1]], format: label(p[0]), film: p[0],
        views: Math.round(per * (2.6 - j * 0.35) * (0.85 + ((h >>> j) % 4) / 20)), days: 5 + ((h >>> (j * 2)) % Math.max(6, top - 9)) };
    });
    list.sort(function (a, b) { return b.views - a.views; });
    if (x.name === r.longest.rival) { list[0].days = top; }   // the report's longest-running Short lives here
    cache[x.name] = list; return list;
  }
  function longest() {
    var best = null;
    r.rivals.filter(function (x) { return x.on; }).forEach(function (x) {
      shorts(x).forEach(function (s) { if (!best || s.days > best.days) { best = { days: s.days, rival: x.name, title: s.title }; } });
    });
    return best;
  }

  function byId(id) { return st.videos.filter(function (v) { return v.id === id; })[0]; }
  function approve(id) { var v = byId(id); if (v) { v.status = 'posting'; save(); } return v; }
  function unpost(id) { var v = byId(id); if (v) { v.status = 'approve'; save(); } return v; }
  function watched(id) { var v = byId(id); if (v && !v.watched) { v.watched = true; save(); } return v; }
  function improve(id) {
    var v = byId(id); if (!v) { return v; }
    var used = {}; st.videos.forEach(function (q) { used[q.film] = true; });
    var m = mine(v.format).filter(function (i) { return !used[i]; });
    if (m.length) { v.film = m[0]; }
    v.status = 'approve'; v.watched = false; v.take = (v.take || 1) + 1; save(); return v;
  }
  // read a format and an angle out of what was typed ("Then vs now for busy people")
  function parse(text) {
    var t = String(text).toLowerCase(), names = r.formats.map(function (f) { return f.name; }).concat(r.angles.map(function (a) { return a.format; }), OB.FILMS.map(function (f) { return f[1]; }));
    var fm = names.filter(function (n) { return t.indexOf(n.toLowerCase()) >= 0; })[0];
    var an = r.angles.filter(function (a) { return a.on !== false && t.indexOf(a.who.toLowerCase()) >= 0; })[0];
    return { format: fm, angle: an ? an.who : '' };
  }
  // ask BlueAI for a new video: it shows up making, then waits for your yes.
  // A request that names a format gets a working title from its clip, never the request read back.
  // A remix (`avoid` is the rival's clip) never reuses the rival's own clip.
  function make(text, format, angle, title, avoid) {
    var p = parse(text), on = onAngles(), fm = format || p.format || r.formats[0].name, used = {}, titles = {};
    st.videos.forEach(function (q) { used[q.film] = true; titles[q.title] = true; });
    if (avoid !== undefined) { used[avoid] = true; }
    var free = mine(fm).filter(function (i) { return !used[i]; });
    if (!free.length && avoid !== undefined) { free = matches(fm).filter(function (i) { return !used[i] && !BAD[OB.FILMS[i][0]]; }); }
    var film = free.length ? free[0] : take(fm, used, OB.hash(text));
    var s = shows(film), t = title || (p.format || format ? (titles[s[0]] ? s[1] : s[0]) : text);
    st.seq += 1;
    var v = vid('n' + st.seq, t, fm, film, angle || p.angle || (on[0] || r.angles[0]).who, 'making', 0);
    st.videos.unshift(v); save();
    window.setTimeout(function () { v.status = 'approve'; save(); document.dispatchEvent(new CustomEvent('ob:videos')); }, 6000);
    return v;
  }

  var STATUS = { making: 'Making', approve: 'Needs your yes', posting: 'Posting', live: 'Live' };

  // the demo switch rebuilds the stage from the report as it is now (angles, budget, pace)
  function setStage(s) { OB.store('onblue-app-' + s, null); OB.store('onblue-app-stage', s); window.location.reload(); }
  function reset() { OB.store(KEY, null); window.location.reload(); }

  OB.app = {
    r: r, st: st, stage: stage, progress: progress, save: save, saveReport: function () { OB.report.save(r); },
    views: views, timeline: timeline, kpis: kpis, byId: byId, approve: approve, unpost: unpost, watched: watched, improve: improve, make: make,
    shorts: shorts, longest: longest, take: take, shows: shows, STATUS: STATUS, setStage: setStage, reset: reset
  };
})();
