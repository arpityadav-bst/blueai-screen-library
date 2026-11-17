/* THE REAL REPORT (Ashish, 2026-11-17), in the run. js/report.js still builds a
   sample report from the website name, instantly, so the run starts at once and
   anything that fails falls back to it. For a typed website this then asks our
   route /api/onblue-report (src/app/api/onblue-report/route.ts) for the real one:
     brand    -> step 1, the brand profile (Claude reading the site)
     market   -> steps 2 to 4: 5 real competitors, the formats, the ideas
     youtube  -> after market: each competitor's real channel, Shorts in the last
                 6 months, average views, their top Shorts; and the brand's own
   Each step's checklist waits for its part (OB.live.ready, used by js/run.js) up
   to a limit, then goes on with what it has, so the run never stalls. On a
   server with no route (the plain static preview) every call fails fast and the
   sample stays. Ported from Ashish's apps/onblue-web/public/report-live.js. */
(function () {
  'use strict';
  var OB = window.OB; if (!OB || !OB.report) { return; }
  var URL = '/api/onblue-report';
  var WAIT = { brand: 45000, rivals: 75000, wins: 20000, angles: 15000 };
  var waits = {}, settled = {};
  OB.live = {
    // true while a step's real part is still on its way (the profile holds the sample back)
    pending: function (key) { return !!waits[key] && !settled[key]; },
    ready: function (key) {
      var p = waits[key]; if (!p) { return Promise.resolve(); }
      return Promise.race([p, new Promise(function (res) { window.setTimeout(res, WAIT[key] || 10000); })]);
    }
  };

  function call(body) {
    return fetch(URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (j) { return j && j.data ? j.data : null; })
      .catch(function () { return null; });
  }
  function clean(s) { return String(s || '').replace(/[–—]/g, ', ').trim(); }
  function host(s) { return String(s || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }

  function applyBrand(r, d) {
    if (!d) { return; }
    if (d.brand) { r.brand = clean(d.brand); r.initial = r.brand.charAt(0).toUpperCase(); }
    ['category', 'sell', 'buyers', 'edge', 'voice'].forEach(function (k) { if (d[k]) { r[k] = clean(d[k]); } });
    if (d.where && !r.whereSet) { r.where = clean(d.where); }
    r.live = r.live || {}; r.live.brand = 1;
    var b = document.querySelector('[data-knows-head] b'); if (b) { b.textContent = r.brand; }
    OB.report.save(r);
  }
  function applyMarket(r, d) {
    if (!d || !d.rivals || !d.rivals.length) { return false; }
    var added = (r.rivals || []).filter(function (x) { return x.added; });
    r.rivals = d.rivals.slice(0, 5).map(function (x) {
      var v = Math.max(0, x.shorts_6mo | 0);
      return { name: clean(x.name), site: host(x.site), videos: v, views: v * Math.max(0, x.avg_views | 0), on: true, est: true };
    }).concat(added);
    if (d.formats && d.formats.length) { r.formats = d.formats.map(function (f) { return { name: f.name, share: f.share | 0 }; }); }
    if (d.angles && d.angles.length) { r.angles = d.angles.map(function (a) { return { who: clean(a.who), say: clean(a.say), format: a.format, on: true }; }); }
    if (d.longest && d.longest.rival) { r.longest = { rival: clean(d.longest.rival), title: clean(d.longest.title), days: d.longest.days | 0 }; }
    sync(r);
    r.live = r.live || {}; r.live.market = 1;
    OB.report.save(r);
    return true;
  }
  // real channels: a found channel replaces Claude's estimate; none found says so
  function fill(x, c) {
    if (c.found) {
      x.est = false; x.noYT = false; x.videos = c.shorts6; x.capped = c.capped; x.views = c.shorts6 * c.avgViews;
      x.yt = { title: c.title, url: c.url, subs: c.subs, avg: c.avgViews, top: c.top || [] };
    } else { x.est = false; x.noYT = true; x.videos = 0; x.views = 0; x.yt = null; }
  }
  function applyYouTube(r, d) {
    if (!d) { return; }
    var bySite = {}; (d.rivals || []).forEach(function (c) { bySite[c.site] = c; });
    r.rivals.forEach(function (x) { if (bySite[x.site]) { fill(x, bySite[x.site]); } });
    r.own = d.own && d.own.found ? { title: d.own.title, url: d.own.url, subs: d.own.subs, shorts6: d.own.shorts6, avg: d.own.avgViews } : null;
    // their best Shorts across every competitor, most viewed first
    var all = [];
    r.rivals.forEach(function (x) { if (x.yt) { x.yt.top.forEach(function (s) { all.push({ rival: x.name, id: s.id, title: clean(s.title), views: s.views, thumb: s.thumb, url: s.url }); }); } });
    r.topShorts = all.sort(function (a, b) { return b.views - a.views; }).slice(0, 3);
    sync(r);
    r.live = r.live || {}; r.live.youtube = 1;
    OB.report.save(r);
  }
  function sync(r) {
    var on = r.rivals.filter(function (x) { return x.on; });
    r.rivalsTotal = on.reduce(function (s, x) { return s + x.videos; }, 0);
    r.perMonth = Math.round(r.rivalsTotal / 6);
  }

  // a competitor you add in step 2 gets its real channel too (false: no answer)
  OB.live.check = function (r, x) {
    return call({ part: 'youtube', rivals: [{ name: x.name, site: x.site }] }).then(function (y) {
      var c = y && y.rivals && y.rivals[0]; if (!c) { return false; }
      fill(x, c); sync(r); OB.report.save(r);
      return true;
    });
  };

  var make = OB.report.make;
  OB.report.make = function (input) {
    var r = make(input);
    if (input && input.site && r.site) {
      waits.brand = call({ part: 'brand', site: r.site }).then(function (d) { applyBrand(r, d); });
      var m = call({ part: 'market', site: r.site }).then(function (d) {
        if (!applyMarket(r, d)) { return; }
        return call({ part: 'youtube', brand: { name: r.brand, site: r.site }, rivals: r.rivals.map(function (x) { return { name: x.name, site: x.site }; }) })
          .then(function (y) { applyYouTube(r, y); });
      });
      waits.rivals = waits.wins = waits.angles = m;
      waits.brand.then(function () { settled.brand = 1; });
      m.then(function () { settled.rivals = settled.wins = settled.angles = 1; });
    }
    return r;
  };
})();
