/* Campaign report, part 12: the page. Reads ?id= (and ?view=link for the
   shared, read-only copy), picks the state, and wires the controls that
   re-cut the numbers: the platform switch, the range, the chart's metric. */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, A = window.onblueApp, D = window.onblueData, esc = U.esc;
  var q = new URLSearchParams(location.search);
  var id = q.get('id') || '', mode = q.get('view') || '';       // '' owner, 'link' share link, 'other' another account
  var c = D.find(id);
  // the wizard lands here with ?submitted=1 (P12: no confirmation sheet, this is the moment)
  var submitted = q.get('submitted') === '1' && !!c && !mode;
  var proto = { posts: 'data' };                                 // prototype dock: 'data' | 'none'
  var METRICS = { views: 'Views', spend: 'Spend', posts: 'Posts', creators: 'Creators', likes: 'Likes', comments: 'Comments', saves: 'Saves', verified: 'Completions' };
  var HINT = {
    views: ['Total views gathered on published posts, by day.', 'Views gathered {s}, by day.'],
    spend: ['What the campaign spent, by day.', 'What the campaign spent {s}, by day.'],
    posts: ['Posts published, by day.', 'Posts published {s}, by day.'],
    creators: ['Creators by the day of their first post.', 'Creators by their first post {s}.'],
    likes: ['Likes on published posts, by day.', 'Likes gathered {s}, by day.'],
    comments: ['Comments on published posts, by day.', 'Comments gathered {s}, by day.'],
    saves: ['Saves on published Reels, by day.', 'Saves gathered {s}, by day.'],
    verified: ['Completions, by day.', 'Completions {s}, by day.']
  };
  function $(s) { return document.getElementById(s); }

  R.view = { plat: 'all', key: 'all', from: 0, to: 0, metric: 'views' };

  /* ---- header ---- */
  function head(M) {
    var name = M ? esc(M.c.title) : 'Not found';
    var back = M && D.isSample(M.c) ? 'campaigns.html#samples' : 'campaigns.html';
    var html = '<button class="app-btn app-btn--icon app-btn--quiet app-menu-btn" type="button" data-nav-open aria-label="Open menu">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>'
      + '<nav class="rp-crumb" aria-label="Breadcrumb"><a href="' + back + '">Campaigns</a>' + U.IC.chev + '<span aria-current="page" title="' + name + '">' + name + '</span></nav>';
    if (M && M.reported) {
      html += '<div class="app-head-actions">'
        + (M.plats.length > 1 ? '<span id="seg-host"></span>' : '')
        + '<button class="app-btn rp-range" type="button" id="btn-range" aria-haspopup="dialog" aria-expanded="false">' + U.IC.cal + '<span id="range-label"></span>' + U.IC.caret + '</button>'
        + '<button class="app-btn" type="button" id="btn-share" aria-haspopup="dialog" aria-expanded="false">' + R.shareBtn() + '</button>'
        + '<button class="app-btn rp-csv" type="button" id="btn-csv">' + U.IC.down + '<span>Download CSV</span></button>'
        // phone: Share and CSV wait behind one button rather than disappearing
        + '<button class="app-btn app-btn--icon rp-more" type="button" id="btn-more" aria-haspopup="menu" aria-expanded="false" aria-label="Share or download">' + U.IC.more + '</button></div>';
    }
    $('head').innerHTML = html;
  }
  // viewOnly: the pill only when there is something to view; tools: the range, as PM's link viewer had
  function bareHead(viewOnly, tools) {
    document.documentElement.classList.add('rp-linkview');
    $('head').className = 'rp-bare';
    $('head').innerHTML = '<span class="rp-bare-brand">' + A.icons.spark + '<span><i>on</i>Blue</span></span>'
      + (viewOnly ? '<span class="app-status rp-viewonly">View only</span>' : '')
      + (tools ? '<div class="app-head-actions"><button class="app-btn rp-range" type="button" id="btn-range" aria-haspopup="dialog" aria-expanded="false">'
        + U.IC.cal + '<span id="range-label"></span>' + U.IC.caret + '</button></div>' : '');
  }

  /* ---- the running report ---- */
  function chartCard(M) {
    return '<section class="rp-card rp-chartcard"><div class="rp-card-head"><div><h2 class="app-sect-title" id="chart-title"></h2>'
      + '<p class="rp-hint" id="chart-hint"></p></div><span id="metric-host"></span></div><div class="rp-chart" id="chart"></div></section>';
  }
  function metrics(M, X) {
    if (!M.growth) { return ['verified', 'spend']; }
    return ['views', 'spend', 'posts', 'creators', 'likes', 'comments'].concat(X.plat === 'instagram' ? ['saves'] : []);
  }
  function renderChart(M, X) {
    var list = metrics(M, X), v = R.view;
    if (list.indexOf(v.metric) < 0) { v.metric = list[0]; }
    $('metric-host').innerHTML = U.seg(list.map(function (k) { return [k, METRICS[k]]; }), v.metric, 'data-metric', 'Chart metric');
    $('chart-title').textContent = METRICS[v.metric] + ' over time';
    $('chart-hint').textContent = HINT[v.metric][X.full ? 0 : 1].replace('{s}', R.span(X, M));
    var money = v.metric === 'spend';
    // an axis is read at a glance: $150, $1.2K, never cents
    var fmt = function (n, axis) { return money ? (axis ? '$' + U.compact(n) : U.money(n)) : axis ? U.compact(n) : U.num(n); };
    // spend is judged against the budget, as views are against the target
    var ref = money && X.full && X.plat === 'all' ? { v: M.budget, label: '$' + U.compact(M.budget) + ' budget' } : null;
    R.line($('chart'), M, R.series(M, X, v.metric), fmt, METRICS[v.metric].toLowerCase(), ref);
  }

  function refresh() {
    var M = R.cur.M, X = R.cur.X = R.calc(M, R.view);
    if ($('range-label')) { $('range-label').textContent = R.rangeLabel(); $('btn-range').classList.toggle('is-set', !X.full); }
    if ($('seg-host')) {
      $('seg-host').innerHTML = U.seg([['all', 'All']].concat(M.plats.map(function (p) { return [p, D.marks([p]) + U.PL[p].name]; })), R.view.plat, 'data-plat', 'Platform');
    }
    var empty = proto.posts === 'none' || (M.growth ? !M.posts.length : !M.done);
    var Z = empty ? R.zero(M) : M, XZ = empty ? R.calc(Z, R.view) : X;
    var bento = M.growth ? R.growthBento(Z, XZ) : R.engageBento(Z, XZ);
    $('report').innerHTML = empty ? R.veil(bento, M) : bento;
    // before the first post the budget and rate are still true: Accounting stays, the rest waits
    document.querySelector('.rp-chartcard').hidden = empty;
    ($('posts-card') || $('work')).hidden = empty;
    if ($('btn-csv')) {
      $('btn-csv').setAttribute('aria-disabled', String(empty));
      $('btn-csv').title = empty ? 'Nothing to download until creators post.' : '';
    }
    $('acct').innerHTML = R.accounting(Z, XZ);
    // viewer geography (PM's card), between the posts and Accounting; the dock decides if it shows
    if ($('geo')) { $('geo').innerHTML = empty ? '' : R.geoCard(M, X); }
    if (empty) { return; }
    renderChart(M, X);
    if (M.growth) { R.renderPosts(); } else { $('work').innerHTML = R.proofCard(M, X); }
    fade();
  }
  R.refresh = refresh;

  // a strip with more to the right fades at its edge, so it reads as scrollable, not cut
  function fade() {
    document.querySelectorAll('.rp-strip').forEach(function (s) {
      s.classList.toggle('is-overflow', s.scrollWidth > s.clientWidth + 1);
      s.classList.toggle('is-end', s.scrollLeft + s.clientWidth >= s.scrollWidth - 1);
    });
  }
  document.addEventListener('scroll', function (e) { if (e.target.classList && e.target.classList.contains('rp-strip')) { fade(); } }, true);
  // the charts are drawn at their real width, so a resize redraws them
  var lastW = window.innerWidth, resizeT = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { if (R.cur && R.cur.X && window.innerWidth !== lastW) { lastW = window.innerWidth; refresh(); } }, 150);
  });

  function render() {
    var body = $('body'), M = c ? R.model(c) : null;
    if (M) { R.cur = { M: M }; }
    if (mode === 'link' || mode === 'other') {
      var ok = !!M && mode !== 'other' && R.isShared();
      bareHead(ok, ok && M.reported);
      if (!ok) { body.innerHTML = R.noAccessView(id, mode === 'other'); return; }
    } else {
      head(M);
    }
    if (!M) { body.innerHTML = R.unknownView(); document.title = 'Campaign not found, onBlue for business'; return; }
    document.title = c.title + ', onBlue for business';
    var banner = D.isSample(c) ? '<div class="app-banner" role="note">' + U.IC.info + '<span><b>Sample report.</b> Illustrative data showing what your report looks like once your campaign is live. '
      + '<a class="app-link" href="campaigns.html#samples">Back to campaigns</a></span></div>' : '';
    // the reason sits under the name it is about, not above it
    var reason = c.status === 'rejected' && !submitted ? R.rejectedBanner(M) : '';
    if (submitted) {
      // the ID is in the meta line right below, so the banner says one thing
      banner = '<div class="app-banner app-banner--success" role="status">' + A.icons.check + '<span><b>Campaign submitted.</b> '
        + (c.status === 'waiting' ? 'It goes into review once ' + esc(A.session.agency) + ' is approved.' : 'We check it within one working day.') + '</span></div>';
    }
    var main = '';
    if (!M.reported) {
      main = c.status === 'rejected' ? R.rejectedView(M) : R.waitingView(M);
    } else {
      R.view.to = M.DAYS - 1;
      main = '<div id="report"></div><div id="detail">' + chartCard(M)
        + (M.growth ? R.postsCard() + '<div id="geo"></div>' : '<div id="work"></div>') + '<div id="acct"></div></div>';
    }
    // the pipeline (Submitted, In review) is ours: an outside viewer of a link does not get it
    body.innerHTML = banner + R.objectBlock(M, { link: mode === 'link' }) + reason + (mode === 'link' ? '' : R.lifecycle(M)) + main;
    if (M.reported) { refresh(); }
  }

  /* ---- controls ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'), a;
    if (!t) { return; }
    if ((a = t.getAttribute('data-plat'))) { R.view.plat = a; R.closeMenu(); refresh(); return; }
    if ((a = t.getAttribute('data-metric'))) { R.view.metric = a; renderChart(R.cur.M, R.cur.X); return; }
    if ((a = t.getAttribute('data-sort'))) { if (a === 'newest' && R.postState.sort === 'newest') { a = 'oldest'; } R.setPosts({ sort: a }); return; }
    if ((a = t.getAttribute('data-page'))) { if (!t.disabled) { R.setPosts({ page: +a }); $('posts-card').scrollIntoView({ block: 'start', behavior: 'smooth' }); } return; }
    if ((a = t.getAttribute('data-grp'))) { R.postState.open[a] = !R.postState.open[a]; R.renderPosts(); return; }
    if (t.hasAttribute('data-clear')) { R.clearPosts(); return; }
    if (t.hasAttribute('data-all-posts') || t.hasAttribute('data-all-creators')) {
      R.setPosts(t.hasAttribute('data-all-posts') ? { group: 'none', sort: 'views' } : { group: 'creator', sort: 'views', open: {} });
      $('posts-card').scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if ((a = t.getAttribute('data-pf'))) { R.proofState.f = a; R.proofState.page = 1; $('work').innerHTML = R.proofCard(R.cur.M, R.cur.X); return; }
    if ((a = t.getAttribute('data-ppage'))) { if (!t.disabled) { R.proofState.page = +a; $('work').innerHTML = R.proofCard(R.cur.M, R.cur.X); } return; }
    if ((a = t.getAttribute('data-copy-id'))) {
      try { navigator.clipboard.writeText(a).catch(function () {}); } catch (err) { /* the toast still names it */ }
      A.toast('Copied ' + a);
      return;
    }
    if (t.hasAttribute('data-stub')) { e.preventDefault(); A.toast('Evidence opens in the live product'); return; }
    if ((a = t.getAttribute('data-posts-state'))) { proto.posts = a; dock(); refresh(); return; }
    if ((a = t.getAttribute('data-viewas'))) {
      location.href = 'campaign.html?id=' + encodeURIComponent(id) + (a === 'owner' ? '' : '&view=' + a);
    }
  });

  function dock() {
    document.querySelectorAll('[data-posts-state]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.postsState === proto.posts)); });
    document.querySelectorAll('[data-viewas]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.viewas === (mode || 'owner'))); });
    document.querySelectorAll('.app-dock a[href*="id="]').forEach(function (l) { l.setAttribute('aria-current', String(l.getAttribute('href').indexOf('id=' + id) > 0 && !!id)); });
    var bar = document.querySelector('[data-dock-posts]');
    if (bar) { bar.hidden = !(c && c.status === 'live'); }
    R.geoDock();
  }

  render();
  dock();
  // one-shot: a refresh must not announce the submit again
  if (q.has('submitted')) { q.delete('submitted'); history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString() : '') + location.hash); }
})();
