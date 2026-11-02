/* Campaign report, part 8: every post, last on the page. PM's table kept
   whole: search with its short loader, Published / Views / Status / Group by,
   sortable column heads, a pager of 20, the row menu, removed posts. Added for
   two platforms: a platform mark on each row and the right audience word. */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, D = window.onblueData, esc = U.esc, F = window.onblueFilters;
  var DAY = R.DAY;
  var DEF = { q: '', sort: 'newest', posted: 'any', views: 'any', status: 'all', group: 'none' };
  var P = R.postState = { q: '', sort: 'newest', posted: 'any', views: 'any', status: 'all', group: 'none', page: 1, size: 20, open: {} };
  var SORTS = {
    newest: function (a, b) { return b.at - a.at; },
    oldest: function (a, b) { return a.at - b.at; },
    subs: function (a, b) { return b.creator.subs - a.creator.subs || b.pv - a.pv; },
    views: function (a, b) { return b.pv - a.pv || b.at - a.at; },
    likes: function (a, b) { return b.pl - a.pl || b.pv - a.pv; },
    comments: function (a, b) { return b.pc - a.pc || b.pv - a.pv; },
    saves: function (a, b) { return b.ps - a.ps || b.pv - a.pv; }
  };
  var POSTED = { '24h': DAY, '7d': 7 * DAY, '30d': 30 * DAY };
  var VIEWS = { '0': [0, 0], '1-99': [1, 99], '100-999': [100, 999], '1000+': [1000, Infinity] };
  var OPTS = {
    posted: [['any', 'Any time'], ['24h', 'Last 24 hours'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days']],
    views: [['any', 'Any'], ['0', 'No views yet'], ['1-99', '1 to 99'], ['100-999', '100 to 999'], ['1000+', '1,000 or more']],
    status: [['all', 'All'], ['live', 'Live'], ['removed', 'Removed']],
    group: [['none', 'None'], ['creator', 'Creator']]
  };

  function test(k, v, p, M) {
    if (k === 'posted') { return v === 'any' || M.now - p.at <= POSTED[v]; }
    if (k === 'views') { return v === 'any' || (p.pv >= VIEWS[v][0] && p.pv <= VIEWS[v][1]); }
    if (k === 'status') { return v === 'all' || p.status === v; }
    return true;
  }
  function filtered(X, M) {
    var q = P.q.trim().toLowerCase();
    return X.published.filter(function (p) {
      if (q && (p.title + ' ' + p.creator.name).toLowerCase().indexOf(q) < 0) { return false; }
      return ['posted', 'views', 'status'].every(function (k) { return test(k, P[k], p, M); });
    }).sort(SORTS[P.sort]);
  }
  R.postsInView = function () { return filtered(R.cur.X, R.cur.M); };
  function active() { return ['q', 'posted', 'views', 'status'].some(function (k) { return P[k] !== DEF[k]; }); }

  function audience(X, M) {
    var pl = X.plat !== 'all' ? [X.plat] : M.plats;
    return pl.length > 1 ? 'Audience' : pl[0] === 'instagram' ? 'Followers' : 'Subscribers';
  }
  function head(X, M, lead) {
    var th = function (k, label, cls) {
      var on = P.sort === k || (k === 'newest' && P.sort === 'oldest');
      return '<button class="th ' + cls + (on ? ' is-on' : '') + '" type="button" data-sort="' + k + '">' + label + (on ? (P.sort === 'oldest' ? ' &uarr;' : ' &darr;') : '') + '</button>';
    };
    var aud = audience(X, M);
    return '<div class="rp-post rp-post--head' + (X.plat === 'instagram' ? ' has-saves' : '') + '">'
      + (lead || '<span class="c-content">Post</span><span class="c-creator">Creator</span>')
      + th('newest', 'Published', 'c-pub') + '<span class="c-subs"' + (aud === 'Audience' ? ' title="Subscribers on YouTube, followers on Instagram"' : '') + '>' + th('subs', aud, '') + '</span>'
      + th('views', 'Views', 'c-n c-views') + th('likes', 'Likes', 'c-n c-likes') + th('comments', 'Comments', 'c-n c-comments')
      + (X.plat === 'instagram' ? th('saves', 'Saves', 'c-n c-saves') : '') + '<span class="c-acts"></span></div>';
  }
  function xlink(href, text) {
    return '<a class="rp-xl" href="' + href + '" target="_blank" rel="noopener"><span>' + esc(text) + '</span>' + U.IC.ext + '</a>';
  }
  function key(k) { return P.sort === k ? ' is-key' : ''; }
  function row(p, X) {
    var gone = p.status === 'removed';
    return '<div class="rp-post' + (gone ? ' is-removed' : '') + (X.plat === 'instagram' ? ' has-saves' : '') + '" data-row="' + p.id + '" tabindex="0" role="button" aria-label="Details for ' + esc(p.title) + '">'
      + '<span class="c-content">' + U.thumb(p, 'row') + '<span class="rp-post-t">' + xlink(p.url, p.title)
      // creator and date ride on this line too, shown where their own columns are hidden
      + '<span class="rp-post-by">' + D.marks([p.plat]) + U.formatOf(p) + '<span class="rp-by-x">&middot; ' + esc(p.creator.name) + ' &middot; ' + U.dayF(p.at) + '</span>' + (gone ? '<span class="app-status" title="This post is no longer up. Its last known views still count.">Removed</span>' : '') + '</span></span></span>'
      + '<span class="c-creator">' + U.avatar(p.creator, 'sm') + xlink(R.seed.channelUrl(p.creator), p.creator.name) + '</span>'
      + '<span class="c-pub"><span>' + U.dateF(p.at) + '</span><span>' + U.timeF(p.at) + '</span></span>'
      + '<span class="c-subs c-n' + key('subs') + '">' + U.num(p.creator.subs) + '</span>'
      // the unit shows only on a phone, where views sit on their own line under the title
      + '<span class="c-n c-views' + key('views') + '">' + U.num(p.pv) + '<span class="rp-unit"> ' + (p.pv === 1 ? 'view' : 'views') + '</span></span><span class="c-n c-likes' + key('likes') + '">' + U.num(p.pl) + '</span>'
      + '<span class="c-n c-comments' + key('comments') + '">' + U.num(p.pc) + '</span>' + (X.plat === 'instagram' ? '<span class="c-n c-saves' + key('saves') + '">' + U.num(p.ps) + '</span>' : '')
      + '<span class="c-acts"><button class="app-btn app-btn--sm app-btn--icon app-btn--quiet" type="button" data-menu="' + p.id + '" aria-label="More for this post" aria-haspopup="menu" aria-expanded="false">' + U.IC.more + '</button></span></div>';
  }
  function groupRow(g, X) {
    var open = !!P.open[g.id], c = g.creator;
    return '<div class="rp-grp' + (open ? ' is-open' : '') + '"><div class="rp-post rp-grp-head' + (X.plat === 'instagram' ? ' has-saves' : '') + '">'
      + '<button class="rp-grp-tog" type="button" data-grp="' + g.id + '" aria-expanded="' + open + '">' + U.IC.chev + U.avatar(c, 'sm')
      + '<span class="rp-post-t"><b>' + esc(c.name) + '</b><span class="rp-post-by">' + D.marks([c.plat]) + U.plural(g.posts.length, 'post') + '</span></span></button>'
      + '<span class="c-pub"></span><span class="c-subs c-n">' + U.num(c.subs) + '</span><span class="c-n c-views is-key">' + U.num(g.views) + '</span>'
      + '<span class="c-n c-likes">' + U.num(g.likes) + '</span><span class="c-n c-comments">' + U.num(g.comments) + '</span>' + (X.plat === 'instagram' ? '<span class="c-n c-saves">' + U.num(g.saves) + '</span>' : '')
      + '<span class="c-acts"><button class="app-btn app-btn--sm app-btn--icon app-btn--quiet" type="button" data-menu="' + g.id + '" data-menu-kind="creator" aria-label="More for ' + esc(c.name) + '" aria-haspopup="menu" aria-expanded="false">' + U.IC.more + '</button></span></div>'
      + (open ? '<div class="rp-grp-body">' + g.posts.map(function (q) { return row(q, X); }).join('') + '</div>' : '') + '</div>';
  }

  function pills(X, M) {
    F.current = function (k) { return k === 'size' ? String(P.size) : P[k]; };
    var defs = ['posted', 'views', 'status', 'group'].map(function (k) {
      return { k: k, label: { posted: 'Published', views: 'Views', status: 'Status', group: 'Group by' }[k], plural: k,
        fixed: function () { return OPTS[k].map(function (o) { return [o[0], o[1], k === 'group' ? '' : X.published.filter(function (p) { return test(k, o[0], p, M); }).length]; }); } };
    });
    F.render(document.getElementById('pills'), defs, [], P, pick);
  }
  function pick(k, v) { var patch = {}; patch[k] = k === 'size' ? +v : v; if (k === 'group') { patch.open = {}; } R.setPosts(patch); }

  R.renderPosts = function () {
    var M = R.cur.M, X = R.cur.X, list = filtered(X, M), grouped = P.group !== 'none';
    var gk = ['likes', 'comments', 'saves'].indexOf(P.sort) >= 0 ? P.sort : 'views';
    var items = grouped ? X.groupBy(list).sort(function (a, b) { return b[gk] - a[gk]; }) : list;
    R.lastGroups = {};
    if (grouped) { items.forEach(function (g) { R.lastGroups[g.id] = g; }); }
    var pages = Math.max(1, Math.ceil(items.length / P.size));
    P.page = Math.min(P.page, pages);
    var from = (P.page - 1) * P.size, slice = items.slice(from, from + P.size);
    document.getElementById('posts-hint').textContent = X.full
      ? U.plural(X.published.length, 'post') + ' published for this campaign.'
      : U.plural(X.published.length, 'post') + ' published ' + R.span(X, M) + '. Views, likes and comments are the ones gathered in that period.';
    pills(X, M);
    document.getElementById('f-clear').hidden = !active();
    document.getElementById('f-count').textContent = active() ? U.num(list.length) + ' of ' + U.plural(X.published.length, 'post') + ' match' : U.plural(X.published.length, 'post');
    document.getElementById('posts-list').innerHTML = items.length
      ? head(X, M, grouped ? '<span class="c-lead">Creator</span>' : '') + slice.map(function (x) { return grouped ? groupRow(x, X) : row(x, X); }).join('')
      : '<div class="rp-empty-row">No posts match these filters. <button class="app-link" type="button" data-clear>Clear filters</button></div>';
    var pg = document.getElementById('pager');
    pg.hidden = !items.length;
    if (!items.length) { return; }
    var nums = [], k;
    for (k = 1; k <= pages; k++) {
      if (k === 1 || k === pages || Math.abs(k - P.page) <= 1) { nums.push(k); } else if (nums[nums.length - 1] !== '...') { nums.push('...'); }
    }
    pg.innerHTML = '<span>Showing ' + U.num(from + 1) + ' to ' + U.num(from + slice.length) + ' of ' + U.plural(items.length, grouped ? 'creator' : 'post') + '</span>'
      + '<div class="rp-pg"><button type="button" data-page="' + (P.page - 1) + '"' + (P.page === 1 ? ' disabled' : '') + ' aria-label="Previous page">' + U.IC.back + '</button>'
      + nums.map(function (n) { return n === '...' ? '<span class="rp-gap">&hellip;</span>' : '<button type="button" data-page="' + n + '"' + (n === P.page ? ' aria-current="page"' : '') + '>' + n + '</button>'; }).join('')
      + '<button type="button" data-page="' + (P.page + 1) + '"' + (P.page === pages ? ' disabled' : '') + ' aria-label="Next page">' + U.IC.chev + '</button></div>'
      + '<span id="size-pill"></span>';
    F.render(document.getElementById('size-pill'), [{ k: 'size', label: 'Per page', plural: 'sizes', fixed: function () { return [['20', '20', ''], ['10', '10', ''], ['50', '50', '']]; } }], [], { size: String(P.size) }, pick);
  };

  R.setPosts = function (patch) {
    Object.keys(patch).forEach(function (k) { P[k] = patch[k]; });
    if (!('page' in patch)) { P.page = 1; }
    R.renderPosts();
  };
  R.clearPosts = function () {
    clearTimeout(searchT);
    busy(false);
    document.getElementById('f-q').value = '';
    R.setPosts({ q: '', posted: 'any', views: 'any', status: 'all' });
  };

  /* Half a second of visible work after the last keystroke, so a search reads
     as having been run rather than as the list blinking (PM). */
  var searchT = 0;
  function busy(on) {
    document.querySelector('.rp-search').classList.toggle('is-busy', on);
    document.getElementById('posts-list').classList.toggle('is-busy', on);
    if (on) { document.getElementById('f-count').textContent = 'Searching…'; }
  }
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'f-q') { return; }
    var v = e.target.value;
    busy(true);
    clearTimeout(searchT);
    searchT = setTimeout(function () { busy(false); R.setPosts({ q: v }); }, 500);
  });

  // the posts card markup, rendered once per report
  R.postsCard = function () {
    return '<section class="rp-card" id="posts-card"><div class="rp-card-head"><div><h2 class="app-sect-title">Posts published in this period</h2>'
      + '<p class="rp-hint" id="posts-hint"></p></div></div>'
      + '<div class="toolbar rp-toolbar"><label class="search rp-search">' + U.IC.search + '<span class="rp-spin" aria-hidden="true"></span>'
      + '<input id="f-q" type="search" placeholder="Search titles or channels" autocomplete="off" aria-label="Search titles or channels"></label>'
      + '<div id="pills" style="display:contents"></div><button class="app-link" type="button" id="f-clear" data-clear hidden>Clear filters</button>'
      + '<span class="count" id="f-count"></span></div>'
      + '<div class="rp-posts" id="posts-list"></div><div class="rp-pager" id="pager"></div></section>';
  };
})();
