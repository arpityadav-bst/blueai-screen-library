/* Campaign report, part 3: the numbers for one view of the model.
   A view is { plat: 'all' | 'youtube' | 'instagram', from, to } (day indexes).
   PM'S RULE FOR A RANGE: a range means "gathered between these days", the way
   YouTube Studio reads a period. Likes, comments and saves in a range are
   scaled from a post's lifetime figures by its share of views (his sample-data
   shortcut). Budget figures (target, spend of budget, remaining, time left) are
   the campaign's state and never follow the range. */
(function () {
  'use strict';

  var R = window.onblueRep;

  function sum(list, f) { return list.reduce(function (s, x) { return s + f(x); }, 0); }

  function groupBy(list) {
    var map = {}, out = [];
    list.forEach(function (p) {
      var g = map[p.creator.id];
      if (!g) { g = map[p.creator.id] = { id: p.creator.id, creator: p.creator, posts: [], views: 0, likes: 0, comments: 0, saves: 0 }; out.push(g); }
      g.posts.push(p); g.views += p.pv; g.likes += p.pl; g.comments += p.pc; g.saves += p.ps;
    });
    return out;
  }

  function cumulative(daily) {
    var s = 0;
    return daily.map(function (v) { s += v; return s; });
  }

  function dailyViews(M, posts) {
    var out = [], k;
    for (k = 0; k < M.DAYS; k++) { out.push(sum(posts, function (p) { return p.d[k]; })); }
    return out;
  }

  R.calc = function (M, v) {
    var full = v.from === 0 && v.to === M.DAYS - 1;
    var X = { full: full, plat: v.plat, from: v.from, to: v.to };
    if (!M.growth) {
      var e = M.eng;
      X.cum = X.cumAll = cumulative(e.daily);
      X.total = e.verified;
      X.inRange = sum(e.daily.slice(v.from, v.to + 1), function (x) { return x; });
      X.spend = e.verified * M.rate;
      X.rows = e.rows.filter(function (r) { return r.day >= v.from && r.day <= v.to; });
      return X;
    }
    var posts = M.posts.filter(function (p) { return v.plat === 'all' || p.plat === v.plat; });
    posts.forEach(function (p) {
      var s = 0;
      for (var k = v.from; k <= v.to; k++) { s += p.d[k]; }
      p.pv = s;
      p.r = p.views ? s / p.views : 0;
      p.pl = Math.round(p.likes * p.r);
      p.pc = Math.round(p.comments * p.r);
      p.ps = Math.round(p.saves * p.r);
    });
    X.posts = posts;
    X.scope = posts.filter(function (p) { return p.d0 <= v.to; });           // live by the end of the range
    X.published = posts.filter(function (p) { return p.d0 >= v.from && p.d0 <= v.to; });
    X.views = sum(posts, function (p) { return p.views; });
    X.likes = sum(posts, function (p) { return p.likes; });
    X.comments = sum(posts, function (p) { return p.comments; });
    X.saves = sum(posts, function (p) { return p.saves; });
    X.pv = sum(X.scope, function (p) { return p.pv; });
    X.pl = sum(X.scope, function (p) { return p.pl; });
    X.pc = sum(X.scope, function (p) { return p.pc; });
    X.ps = sum(X.scope, function (p) { return p.ps; });
    // every view bills, past the budget too (Abhisht, 2026-10-21)
    X.spend = X.views * M.rate / 1000;
    X.pSpend = X.pv * M.rate / 1000;
    X.groups = groupBy(X.scope);
    X.active = X.groups.filter(function (g) { return g.views > 0; }).sort(function (a, b) { return b.views - a.views; });
    X.allCreators = groupBy(posts).length;
    X.cum = cumulative(dailyViews(M, posts));
    X.cumAll = v.plat === 'all' ? X.cum : cumulative(dailyViews(M, M.posts));
    X.groupBy = groupBy;
    return X;
  };

  /* One series for the detail chart: what each day of the range added, and the
     running total from zero at the range's first day (PM's chart). */
  R.series = function (M, X, metric) {
    var pts = [], run = 0, k;
    if (!M.growth) {
      for (k = X.from; k <= X.to; k++) {
        var inc = M.eng.daily[k] * (metric === 'spend' ? M.rate : 1);
        run += inc;
        pts.push({ k: k, v: run, inc: inc });
      }
      return pts;
    }
    // a creator counts on the day of their first post in the range
    var first = {};
    X.published.forEach(function (p) { if (!(p.creator.id in first) || p.d0 < first[p.creator.id]) { first[p.creator.id] = p.d0; } });
    for (k = X.from; k <= X.to; k++) {
      var day = 0;
      if (metric === 'posts') { day = X.published.filter(function (p) { return p.d0 === k; }).length; }
      else if (metric === 'creators') { day = Object.keys(first).filter(function (id) { return first[id] === k; }).length; }
      else {
        day = sum(X.posts, function (p) {
          if (!p.views) { return 0; }
          var f = p.d[k] / p.views;
          return metric === 'likes' ? p.likes * f : metric === 'comments' ? p.comments * f : metric === 'saves' ? p.saves * f : p.d[k];
        });
        if (metric === 'spend') { day = day * M.rate / 1000; }
      }
      run += day;
      pts.push({ k: k, v: run, inc: day });
    }
    return pts;
  };
})();
