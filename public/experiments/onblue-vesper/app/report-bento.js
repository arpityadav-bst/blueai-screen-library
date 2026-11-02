/* Campaign report, part 6: the growth report's tiles, ranked by the question
   each answers. Rank decides size and place; numbers that explain each other
   share one tile.
     1 Is it working?  Fill: views of the target, a bar, the running total (lead, 4 x 3)
     2 Beside it       Views, then Spend (spend of budget, the rate, remaining
                       or over), then Time left while live (2 each)
     3 The proof       the top posts, as they look where they live (4, or 6)
     4 Where           the platform split, only on a two-platform campaign (2)
     5 Posts, Likes, Comments (2 each) / 6 Who and Response (3 each) */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, D = window.onblueData, esc = U.esc;

  function span(X, M) {
    var a = M.dayDate(X.from), b = M.dayDate(X.to);
    return X.from === X.to ? U.dayF(a) : U.dayF(a) + ' to ' + U.dayF(b);
  }
  R.span = span;

  function tile(cls, inner, attrs) { return '<section class="rp-tile ' + cls + '"' + (attrs || '') + '>' + inner + '</section>'; }
  function label(t, extra) { return '<h2 class="rp-label">' + t + (extra || '') + '</h2>'; }

  /* One figure, its label and the line that says what it counts (PM's tiles). */
  function stat(cls, l, v, sub) { return tile('rp-stat ' + cls, label(l) + '<p class="rp-big rp-big--sm"><b>' + v + '</b><span>' + sub + '</span></p>'); }
  R.statTile = stat;

  /* Fill is the campaign's state, so it never follows the range (PM). The
     platform switch scopes it: the share of the target that platform filled. */
  R.fillTile = function (M, X, done, unit) {
    var share = done / Math.max(1, M.target);
    return tile('rp-lead', label('Fill')
      + '<p class="rp-big"><b>' + Math.floor(share * 100) + '%</b><span>' + U.num(done) + ' of ' + U.num(M.target) + ' target'
      + (X.plat !== 'all' ? ', from ' + U.PL[X.plat].name : '') + '</span></p>'
      + '<span class="app-bar rp-fillbar"><i style="width:' + Math.min(100, share * 100).toFixed(1) + '%"></i></span>'
      + R.cumSvg(M, X, U.num(done) + ' ' + unit + ' so far, by day'));
  };

  // only "YouTube views on published posts" follows the platform (PM's sub, made platform-aware)
  function views(M, X) {
    var pl = X.plat !== 'all' ? X.plat : M.plats.length === 1 ? M.plats[0] : '';
    var sub = !pl ? 'Views on published posts' : pl === 'instagram' ? 'Instagram plays on published posts' : U.PL[pl].name + ' views on published posts';
    return X.full ? stat('rp-views', 'Views', U.num(X.views), sub) : stat('rp-views', 'Views', U.num(X.pv), 'gathered ' + span(X, M));
  }

  function money(M, X) {
    var all = X.cumAll[X.cumAll.length - 1] || 0, lifeSpend = all * M.rate / 1000, over = lifeSpend - M.budget;
    var scoped = X.plat !== 'all';
    var share = scoped ? X.spend / Math.max(0.0001, lifeSpend) : lifeSpend / Math.max(0.0001, M.budget);
    var rows = (over > 0.004
      ? '<div class="rp-dl-row is-warn"><dt>Over budget<span>spent past the ' + U.money(M.budget) + ' budget</span></dt><dd>' + U.money(over) + '</dd></div>'
      : '<div class="rp-dl-row"><dt>Remaining<span>budget left to spend</span></dt><dd>' + U.money(M.budget - lifeSpend) + '</dd></div>')
      + '<div class="rp-dl-row"><dt>Cost per 1,000 views<span>your rate</span></dt><dd>' + U.money(M.rate) + '</dd></div>'
      + (X.full ? '' : '<div class="rp-dl-row"><dt>Spent ' + span(X, M) + '</dt><dd>' + U.money(X.pSpend) + '</dd></div>');
    return tile('rp-money', label(scoped ? 'Spend on ' + U.PL[X.plat].name : 'Spend')
      + '<p class="rp-big"><b>' + U.money(scoped ? X.spend : lifeSpend) + '</b><span>' + (scoped ? 'of ' + U.money(lifeSpend) + ' spent in all' : 'of ' + U.money(M.budget)) + '</span></p>'
      + '<span class="app-bar rp-moneybar"><i style="width:' + Math.min(100, share * 100).toFixed(1) + '%"></i></span>'
      + '<dl class="rp-dl">' + rows + '</dl>');
  }

  function proof(M, X, wide) {
    var ranked = X.scope.filter(function (p) { return p.pv > 0; }).sort(function (a, b) { return b.pv - a.pv || b.at - a.at; });
    var cards = ranked.slice(0, wide ? 8 : 6).map(function (p) {
      return '<button class="rp-pcard" type="button" data-open="' + p.id + '" title="' + esc(p.title) + '">'
        + U.thumb(p, 'strip', { mark: true, removed: p.status === 'removed' })
        + '<span class="rp-pcard-v">' + U.compact(p.pv) + ' views</span>'
        + '<span class="rp-pcard-c">' + esc(p.creator.name) + '</span></button>';
    }).join('');
    return tile('rp-proof' + (wide ? ' rp-proof--wide' : ''), '<div class="rp-tile-head">' + label('Top posts')
      + '<span class="rp-hint">Ranked by views' + (X.full ? '' : ' gathered ' + span(X, M)) + '</span>'
      + '<button class="app-link" type="button" data-all-posts>All ' + U.plural(X.published.length, 'post') + '</button></div>'
      + (cards ? '<div class="rp-strip">' + cards + '</div>' : '<p class="rp-none">No views in this period.</p>'));
  }

  function split(M, X) {
    var by = M.plats.map(function (pl) {
      var ps = M.posts.filter(function (p) { return p.plat === pl; });
      var v = ps.reduce(function (s, p) { return s + (X.full ? p.views : p.pv); }, 0);
      return { pl: pl, v: v, n: ps.length };
    });
    var tot = by.reduce(function (s, b) { return s + b.v; }, 0) || 1;
    var rows = by.map(function (b) {
      var on = X.plat === b.pl, sh = b.v / tot;
      return '<button class="rp-split-row' + (on ? ' is-on' : '') + '" type="button" data-plat="' + b.pl + '" aria-pressed="' + on + '">'
        + '<span class="rp-split-name">' + D.marks([b.pl]) + U.PL[b.pl].name + '<b>' + U.pct(sh) + '</b></span>'
        + '<span class="app-bar"><i style="width:' + (sh * 100).toFixed(1) + '%"></i></span>'
        + '<span class="rp-split-sub">' + U.compact(b.v) + ' views, ' + U.money(b.v * M.rate / 1000) + ' spent, ' + U.plural(b.n, 'post') + '</span></button>';
    }).join('');
    return tile('rp-split', label('Platforms') + '<p class="rp-hint">Share of views' + (X.full ? '' : ' gathered ' + span(X, M)) + '</p>'
      + rows + '<p class="rp-foot">One rate on both, so spend follows views.</p>');
  }

  function creators(M, X) {
    var list = X.active.slice(0, 3), tot = X.pv || 1;
    var n = X.full ? X.allCreators : X.active.length;
    var rows = list.map(function (g) {
      return '<button class="rp-crow" type="button" data-cgroup="' + g.id + '">' + U.avatar(g.creator, 'sm')
        + '<span class="rp-crow-n">' + esc(g.creator.name) + '</span>' + D.marks([g.creator.plat])
        + '<b>' + U.pct(g.views / tot) + '</b></button>';
    }).join('');
    return tile('rp-creators', '<div class="rp-tile-head">' + label('Creators') + '<button class="app-link" type="button" data-all-creators>See all</button></div>'
      + '<p class="rp-big rp-big--sm"><b>' + U.num(n) + '</b><span>' + (X.full ? 'channels posting your videos' : 'with views ' + span(X, M)) + '</span></p>'
      + (rows ? '<div class="rp-crows">' + rows + '</div><p class="rp-foot">Share of views, top ' + list.length + '.</p>' : '<p class="rp-none">No views in this period.</p>'));
  }

  function response(M, X) {
    var cols = X.plat === 'all' && M.plats.length > 1 ? M.plats : [X.plat === 'all' ? M.plats[0] : X.plat];
    var per = function (pl, f) {
      var ps = X.scope.filter(function (p) { return p.plat === pl; });
      var v = ps.reduce(function (s, p) { return s + p.pv; }, 0);
      return v ? (ps.reduce(function (s, p) { return s + p[f]; }, 0) / v * 1000).toFixed(1) : '0';
    };
    var metrics = [['pl', 'Likes'], ['pc', 'Comments']].concat(X.plat === 'instagram' ? [['ps', 'Saves']] : []);
    var head = cols.length > 1 ? '<div class="rp-resp-row rp-resp-head" style="--cols:2"><span></span>' + cols.map(function (pl) { return '<span>' + D.marks([pl]) + '</span>'; }).join('') + '</div>' : '';
    var rows = metrics.map(function (m) {
      return '<div class="rp-resp-row" style="--cols:' + cols.length + '"><span>' + m[1] + '</span>' + cols.map(function (pl) { return '<b>' + per(pl, m[0]) + '</b>'; }).join('') + '</div>';
    }).join('');
    return tile('rp-resp', label('Response') + '<p class="rp-hint">Per 1,000 views' + (X.full ? '' : ' gathered ' + span(X, M)) + '</p>'
      + '<div class="rp-resp">' + head + rows + '</div>');
  }

  // PM's post tiles: Total posts (New posts in a range), Likes, Comments
  function counts(M, X) {
    var g = X.full ? 'on those posts' : 'gathered ' + span(X, M);
    return (X.full ? stat('rp-count', 'Total posts', U.num(X.published.length), 'live on members’ own accounts')
      : stat('rp-count', 'New posts', U.num(X.published.length), 'published ' + span(X, M)))
      + stat('rp-count', 'Likes', U.num(X.pl), g) + stat('rp-count', 'Comments', U.num(X.pc), g);
  }

  R.timeTile = function (M) {
    var f = Math.min(1, (M.lastT - M.start) / Math.max(1, M.end - M.start));
    return tile('rp-time', label('Time left')
      + '<p class="rp-big rp-big--sm"><b>' + (M.live ? U.plural(M.left, 'day') : 'Ended') + '</b></p>'
      + '<span class="app-bar app-bar--time"><i style="width:' + (f * 100).toFixed(1) + '%"></i></span>'
      + '<p class="rp-sub">' + (M.live ? 'ends ' : 'ended ') + U.dateF(M.end) + '</p>');
  };

  /* Beside the lead: Views, Spend, and Time left while the campaign runs. An
     ended campaign drops Time left (the lifecycle already says "Ended"), and
     the lead is two rows tall instead of three. */
  R.growthBento = function (M, X) {
    var two = M.plats.length > 1;
    return '<div class="rp-bento rp-bento--growth' + (two ? ' rp-bento--two' : '') + (M.live ? ' rp-bento--timed' : '') + '">'
      + R.fillTile(M, X, X.views, 'views') + views(M, X) + money(M, X) + (M.live ? R.timeTile(M) : '')
      + proof(M, X, !two) + (two ? split(M, X) : '') + counts(M, X) + creators(M, X) + response(M, X) + '</div>';
  };
})();
