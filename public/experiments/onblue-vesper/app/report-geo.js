/* Campaign report, part 13: viewer geography, PM's card brought back
   (campaign-report/report.js: geoOf, renderGeo, geoSection, the CSV columns).
   THREE VIEWS, switched from the prototype dock. "off" is what PM shipped
   while the backend work is pending: no card, no section in a post's details,
   no CSV columns. "live" is the finished card. "processing" is the card before
   the numbers arrive. Growth campaigns only: engagement has none (as PM).
   THE COUNTRIES ARE SPLIT FROM THE VIEWS THE PAGE ALREADY SHOWS (S.spread), so a
   post's countries add up to its views in the range and on the platform picked,
   and the card adds up to the posts it is based on. */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, S = R.seed, esc = U.esc;
  var KEY = 'campaign-report:geo', MODES = { off: 1, live: 1, processing: 1 };
  var COUNTRIES = [
    ['US', 'United States'], ['IN', 'India'], ['PH', 'Philippines'], ['GB', 'United Kingdom'],
    ['CA', 'Canada'], ['AU', 'Australia'], ['PK', 'Pakistan'], ['DE', 'Germany'],
    ['BR', 'Brazil'], ['NG', 'Nigeria']
  ];
  var NAME = {};
  COUNTRIES.forEach(function (c) { NAME[c[0]] = c[1]; });
  // the platform reports countries only past this many views (PM's GEO_MIN)
  var GEO_MIN = 50;
  var PROCESSING = '<div class="rp-geo-empty">Geography data is still processing.</div>';
  var mode = 'off', all = false;
  try { var saved = localStorage.getItem(KEY); if (MODES[saved]) { mode = saved; } } catch (e) { /* storage off: Hidden */ }

  function on() { var M = R.cur && R.cur.M; return !!M && M.reported && M.growth; }
  R.geoMode = function () { return on() ? mode : 'off'; };

  /* Once per model: which channels share a breakdown (PM: about 72%), and each
     post's country weights. The campaign's market leads, as the US did in his
     sample; a worldwide campaign keeps his US-led spread. */
  function prep(M) {
    if (M.geoCodes) { return; }
    var r = S.rng(M.h ^ 0x9e0a), mk = String(M.c.geo || '').toUpperCase();
    var lead = NAME[mk] ? mk : 'US', wide = !NAME[mk];
    M.geoCodes = [lead].concat(COUNTRIES.map(function (c) { return c[0]; }).filter(function (k) { return k !== lead; }));
    var shares = {};
    M.creators.forEach(function (c) { shares[c.id] = r() < 0.72; });
    M.posts.forEach(function (p) {
      var top = wide ? 0.46 + r() * 0.34 : 0.7 + r() * 0.22;
      var rest = M.geoCodes.slice(1).map(function () { return Math.pow(r(), 2.2); });
      var rs = rest.reduce(function (s, v) { return s + v; }, 0) || 1;
      p.gw = shares[p.creator.id] && p.views >= GEO_MIN ? [top].concat(rest.map(function (v) { return (1 - top) * v / rs; })) : null;
    });
  }

  function geoOf(M, list) {
    prep(M);
    var by = {}, covered = 0, cv = 0, total = 0;
    list.forEach(function (p) {
      total += p.pv;
      if (!p.gw || !p.pv) { return; }
      covered++;
      cv += p.pv;
      S.spread(p.pv, p.gw).forEach(function (v, i) { by[M.geoCodes[i]] = (by[M.geoCodes[i]] || 0) + v; });
    });
    var rows = Object.keys(by).filter(function (k) { return by[k] > 0; })
      .map(function (k) { return { cc: k, name: NAME[k], v: by[k] }; })
      .sort(function (a, b) { return b.v - a.v; });
    return { rows: rows, covered: covered, n: list.length, cv: cv, total: total };
  }

  function bars(g, limit) {
    var rows = g.rows.slice(0, limit), rest = g.rows.slice(limit);
    if (rest.length) { rows.push({ cc: '+' + rest.length, name: 'Other', v: rest.reduce(function (s, r) { return s + r.v; }, 0), other: true }); }
    return '<div class="rp-geo-list">' + rows.map(function (r) {
      var share = g.cv ? r.v / g.cv : 0;
      return '<div class="rp-geo-row' + (r.other ? ' is-other' : '') + '" title="' + U.num(r.v) + ' views">'
        + '<span class="rp-geo-name"><span class="rp-geo-cc">' + r.cc + '</span>' + esc(r.name) + '</span>'
        + '<span class="app-bar"><i style="width:' + (share * 100).toFixed(1) + '%"></i></span>'
        + '<span class="rp-geo-pct">' + U.pct(share) + '</span></div>';
    }).join('') + '</div>';
  }
  function coverNote(g) {
    return '<p class="rp-geo-note">' + U.IC.info + '<span>Based on ' + U.num(g.covered) + ' of ' + U.plural(g.n, 'post')
      + ', ' + U.pct(g.total ? g.cv / g.total : 0) + ' of views. Posts without geography data are left out.</span></p>';
  }

  /* The card: full width, after the posts and before Accounting. It reads the
     same posts as the table above it, so it follows the platform and range. */
  R.geoCard = function (M, X) {
    var m = R.geoMode();
    if (m === 'off') { return ''; }
    var g = geoOf(M, X.scope), live = m === 'live' && g.covered > 0;
    var where = (X.plat !== 'all' ? ' on ' + U.PL[X.plat].name : '') + (X.full ? '' : ', ' + R.span(X, M));
    return '<section class="rp-card rp-geo" id="geo-card"><div class="rp-card-head"><div><h2 class="app-sect-title">Viewer geography</h2>'
      + '<p class="rp-hint">Where the views on the posts came from' + where + '. Open any post’s details to see its own geography.</p></div>'
      + (live && g.rows.length > 5 ? '<button class="app-link" type="button" data-geo-all>' + (all ? 'Show top 5' : 'Show all') + '</button>' : '')
      + '</div>' + (live ? coverNote(g) + bars(g, all ? 99 : 5) : PROCESSING) + '</section>';
  };

  // a post's or a creator's own countries, in the drawer
  R.geoSection = function (list, single) {
    var m = R.geoMode(), M = R.cur.M, p = list[0], body;
    if (m === 'off') { return ''; }
    var g = geoOf(M, list);
    if (m === 'processing' || !g.covered) {
      body = m === 'live' && single && p.views >= GEO_MIN && !p.pv
        ? '<div class="rp-geo-empty">This post gathered no views ' + R.span(R.cur.X, M) + '.</div>' : PROCESSING;
    } else {
      body = (single ? '' : coverNote(g)) + bars(g, 6);
    }
    return '<section class="rp-geo-dr"><h4 class="rp-dr-h">Viewer geography</h4>' + body + '</section>';
  };

  // the CSV's two columns, only when the data is live (PM)
  R.geoCols = function () { return R.geoMode() === 'live' ? ['Top geography', 'Top geography share'] : []; };
  R.geoCells = function (p) {
    if (R.geoMode() !== 'live') { return []; }
    var g = geoOf(R.cur.M, [p]), top = g.rows[0];
    return [top ? top.name : '', top ? (top.v / g.cv * 100).toFixed(1) + '%' : ''];
  };

  // the dock's Geography bar: only on a report that can have geography
  R.geoDock = function () {
    var bar = document.querySelector('[data-dock-geo]');
    if (!bar) { return; }
    bar.hidden = !on();
    bar.querySelectorAll('[data-geo-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-geo-mode') === mode)); });
  };

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button'), a;
    if (!t) { return; }
    if (t.hasAttribute('data-geo-all')) {
      all = !all;
      var host = document.getElementById('geo');
      if (host) { host.innerHTML = R.geoCard(R.cur.M, R.cur.X); }
      return;
    }
    if ((a = t.getAttribute('data-geo-mode')) && MODES[a]) {
      mode = a;
      try { localStorage.setItem(KEY, a); } catch (err) { /* stays for this page only */ }
      R.geoDock();
      if (on()) { R.refresh(); R.redrawDrawer(); }
    }
  });
})();
