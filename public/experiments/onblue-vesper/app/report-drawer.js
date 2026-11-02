/* Campaign report, part 9: the post and creator drawer, the row menu, and copy.
   A drawer can stack (creator, then one of their posts) with a Back control.
   Labels name the post's own platform: "Open on Instagram" for a Reel. */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui, A = window.onblueApp, D = window.onblueData, esc = U.esc;
  var stack = [], menuBtn = null;

  function $(id) { return document.getElementById(id); }
  function post(id) { return R.cur.M.posts.filter(function (p) { return p.id === id; })[0]; }
  function group(id) { return R.cur.X.groupBy(R.cur.X.scope).filter(function (g) { return g.id === id; })[0]; }

  function stats(list) {
    return '<div class="rp-dr-stats">' + list.map(function (s) {
      return '<div><span>' + s[0] + '</span><b>' + U.num(s[1]) + '</b></div>';
    }).join('') + '</div>';
  }
  function periodNote() {
    var X = R.cur.X;
    return X.full ? '' : '<p class="rp-dr-period">Showing what was gathered ' + R.span(X, R.cur.M) + '.</p>';
  }

  function paint() {
    var v = stack[stack.length - 1], html, M = R.cur.M;
    var top = '<div class="rp-dr-top">'
      + (stack.length > 1 ? '<button class="app-btn app-btn--sm app-btn--quiet" type="button" data-dr-back>' + U.IC.back + 'Back</button>' : '<span class="rp-dr-kicker">' + (v.kind === 'post' ? 'Post' : 'Creator') + '</span>')
      + '<button class="app-btn app-btn--icon app-btn--quiet" type="button" data-dr-close aria-label="Close">' + U.IC.close + '</button></div>';
    if (v.kind === 'post') {
      var p = post(v.id), pl = U.PL[p.plat], gone = p.status === 'removed';
      html = top + '<div class="rp-dr-body"><div class="rp-dr-hero rp-dr-hero--' + (p.shape === 'wide' ? 'wide' : 'tall') + '">' + U.thumb(p, 'lg', { removed: gone })
        + '<div><h3 class="rp-dr-title">' + esc(p.title) + '</h3>'
        + '<p class="rp-dr-who">' + U.avatar(p.creator, 'sm') + '<b>' + esc(p.creator.name) + '</b>' + D.marks([p.plat]) + '</p>'
        + '<p class="rp-dr-meta">' + U.plural(p.creator.subs, pl.audience) + '</p>'
        + '<p class="rp-dr-meta">' + U.formatOf(p) + ', posted ' + U.dateF(p.at) + ' at ' + U.timeF(p.at) + '</p>'
        + (gone ? '<p class="rp-dr-flag">Removed from ' + pl.name + '. Its last known views still count toward your target.</p>' : '')
        + '</div></div>' + periodNote()
        + stats([['Views', p.pv], ['Likes', p.pl], ['Comments', p.pc]].concat(p.plat === 'instagram' ? [['Saves', p.ps]] : []))
        // right under the stats they act on; the creator view keeps its footer, its list scrolls
        + '<div class="rp-dr-acts"><a class="app-btn" href="' + p.url + '" target="_blank" rel="noopener">' + U.IC.play + pl.open + '</a>'
        + '<button class="app-btn" type="button" data-copy="' + p.url + '">' + U.IC.link + 'Copy link</button></div>'
        + R.geoSection([p], true) + '</div>';
    } else {
      var g = v.group, c = g.creator;
      html = top + '<div class="rp-dr-body"><div class="rp-dr-who rp-dr-who--lg">' + U.avatar(c, 'lg') + '<div><h3 class="rp-dr-title">' + esc(c.name) + '</h3>'
        + '<p class="rp-dr-meta">' + D.marks([c.plat]) + U.plural(g.posts.length, 'post') + ', ' + U.plural(c.subs, U.PL[c.plat].audience) + '</p></div></div>'
        + periodNote() + stats([['Views', g.views], ['Likes', g.likes], ['Comments', g.comments]]) + R.geoSection(g.posts, false)
        + '<h4 class="rp-dr-h">Posts</h4><div class="rp-dr-list">' + g.posts.slice().sort(function (a, b) { return b.pv - a.pv; }).map(function (q) {
          return '<button class="rp-dr-item" type="button" data-open-push="' + q.id + '">' + U.thumb(q, 'row')
            + '<span class="rp-post-t"><b>' + esc(q.title) + '</b><span class="rp-post-by">' + U.dateF(q.at) + (q.status === 'removed' ? ', removed' : '') + '</span></span>'
            + '<span class="rp-dr-n">' + U.num(q.pv) + '</span></button>';
        }).join('') + '</div></div>'
        + '<div class="rp-dr-foot"><a class="app-btn" href="' + R.seed.channelUrl(c) + '" target="_blank" rel="noopener">' + U.PL[c.plat].channel + '</a></div>';
    }
    $('drawer').innerHTML = html;
  }

  function open(view, push) {
    if (!push) { stack = []; }
    stack.push(view);
    paint();
    $('scrim').hidden = false;
    $('drawer').classList.add('is-open');
    $('drawer').setAttribute('aria-hidden', 'false');
    $('drawer').scrollTop = 0;
    var x = $('drawer').querySelector('[data-dr-close]');
    if (x) { x.focus({ preventScroll: true }); }
  }
  function close() {
    $('drawer').classList.remove('is-open');
    $('drawer').setAttribute('aria-hidden', 'true');
    $('scrim').hidden = true;
  }
  R.openPost = function (id) { open({ kind: 'post', id: id }); };
  R.openCreator = function (id) { var g = group(id); if (g) { open({ kind: 'creator', group: g }); } };
  R.drawerOpen = function () { return $('drawer').classList.contains('is-open'); };
  R.repaintDrawer = function () { if (R.drawerOpen()) { close(); } };
  // the dock's Geography switch repaints an open drawer in place
  R.redrawDrawer = function () { if (R.drawerOpen() && stack.length) { paint(); } };

  /* A copy button answers on itself, "Copied" with a check, because the eyes
     are on the button; copies from a menu (which closes) use the toast (PM). */
  R.copy = function (text, btn) {
    var done = function () {
      if (!btn) { A.toast('Link copied'); return; }
      if (!btn._label) { btn._label = btn.innerHTML; }
      btn.innerHTML = U.IC.check + 'Copied';
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.innerHTML = btn._label; btn._label = null; }, 1600);
    };
    try { navigator.clipboard.writeText(text).then(done, done); } catch (e) { done(); }
  };

  function openMenu(btn) {
    closeMenu();
    menuBtn = btn;
    btn.setAttribute('aria-expanded', 'true');
    var id = btn.getAttribute('data-menu'), m = $('menu'), creator = btn.getAttribute('data-menu-kind') === 'creator';
    var pl = U.PL[creator ? R.lastGroups[id].creator.plat : post(id).plat];
    var item = function (act, icon, label) { return '<button class="app-menu-item" type="button" role="menuitem" data-act="' + act + '" data-id="' + id + '">' + icon + label + '</button>'; };
    m.innerHTML = creator
      ? item('cdetails', U.IC.info, 'Details') + item('channel', U.IC.play, pl.channel) + item('ccopy', U.IC.link, pl.copyCh)
      : item('details', U.IC.info, 'Details') + item('open', U.IC.play, pl.open) + item('copy', U.IC.link, 'Copy link');
    m.hidden = false;
    var r = btn.getBoundingClientRect(), mw = m.offsetWidth, mh = m.offsetHeight;
    m.style.left = Math.max(12, Math.min(window.innerWidth - mw - 12, r.right - mw)) + 'px';
    m.style.top = (r.bottom + 6 + mh > window.innerHeight ? r.top - mh - 6 : r.bottom + 6) + 'px';
    m.querySelector('button').focus({ preventScroll: true });
  }
  function closeMenu() {
    $('menu').hidden = true;
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn = null; }
  }
  R.closeMenu = closeMenu;

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a'), a;
    if (!$('menu').hidden && !(t && ($('menu').contains(t) || t === menuBtn))) { closeMenu(); }
    if (!t) {
      var row = e.target.closest('[data-row]');
      if (row) { R.openPost(row.getAttribute('data-row')); }
      if (e.target.id === 'scrim') { close(); }
      return;
    }
    if ((a = t.getAttribute('data-menu'))) { if (menuBtn === t) { closeMenu(); } else { openMenu(t); } return; }
    if ((a = t.getAttribute('data-act'))) {
      var id = t.getAttribute('data-id'), g = R.lastGroups[id];
      closeMenu();
      if (a === 'details') { R.openPost(id); }
      if (a === 'open') { window.open(post(id).url, '_blank', 'noopener'); }
      if (a === 'copy') { R.copy(post(id).url); }
      if (a === 'cdetails') { open({ kind: 'creator', group: g }); }
      if (a === 'channel') { window.open(R.seed.channelUrl(g.creator), '_blank', 'noopener'); }
      if (a === 'ccopy') { R.copy(R.seed.channelUrl(g.creator)); }
      return;
    }
    if ((a = t.getAttribute('data-open'))) { R.openPost(a); return; }
    if ((a = t.getAttribute('data-open-push'))) { open({ kind: 'post', id: a }, true); return; }
    if ((a = t.getAttribute('data-cgroup'))) { R.openCreator(a); return; }
    if (t.hasAttribute('data-dr-close')) { close(); return; }
    if (t.hasAttribute('data-dr-back')) { stack.pop(); paint(); return; }
    if ((a = t.getAttribute('data-copy'))) { R.copy(a, t); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-row]')) { e.preventDefault(); R.openPost(e.target.getAttribute('data-row')); return; }
    if (e.key !== 'Escape') { return; }
    if (!$('menu').hidden) { var b = menuBtn; closeMenu(); if (b) { b.focus(); } return; }
    if (R.drawerOpen()) { close(); }
  });
  // the panel scrolls, not the window, so a fixed menu closes on the panel's scroll
  document.addEventListener('scroll', function () { if (!$('menu').hidden) { closeMenu(); } }, true);
  window.addEventListener('resize', closeMenu);
})();
