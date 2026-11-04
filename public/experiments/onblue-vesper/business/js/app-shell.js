/* The dashboard shell: the sidebar (Home, Plan, Studio, Brand, Radar,
   Analytics; a bottom tab bar on phones), the budget card, the account menu
   (which also holds the prototype's demo switch, so nothing floats over the
   page), and the shared video card. Each page sets <body data-page="..."> and
   fills [data-main]. Exposes OB.ui. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  var page = document.body.getAttribute('data-page');

  var NAV = [['home', 'Home', 'home'], ['plan', 'Plan', 'plan'], ['studio', 'Studio', 'studio'], ['brand', 'Brand', 'brand'], ['radar', 'Radar', 'radar'], ['analytics', 'Analytics', 'chart']];
  var who = r.name || OB.sess('onblue:agency') || r.brand;
  var email = OB.sess('onblue:email') || r.email || ('you@' + (r.site || 'yourbrand.com'));

  // the Radar tag stays until you have opened Radar once
  if (page === 'radar') { OB.store('onblue-radar-seen', 1); }
  var radarNew = !OB.store('onblue-radar-seen');

  function side() {
    var k = A.kpis(), P = A.progress;
    var nav = NAV.map(function (n) {
      var on = n[0] === page;
      var extra = n[0] === 'radar' && radarNew ? '<span class="ob-new">New</span>' : n[0] === 'studio' && k.waiting ? '<span class="ob-count" title="Waiting for your yes">' + k.waiting + '</span>' : '';
      return '<a class="ob-navi' + (on ? ' is-on' : '') + '" href="' + n[0] + '.html" data-nav="' + n[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + OB.icon(n[2]) + '<span>' + n[1] + '</span>' + extra + '</a>';
    }).join('');
    // the bar fills with what is spent: empty on day one, never a full bar that reads as used up
    var set = A.st.budgetSet || P.finished;
    var used = A.st.budget ? Math.max(0, Math.min(100, Math.round(k.spent / A.st.budget * 100))) : 0;
    // the same exact figure Analytics shows, so the two never disagree; nothing spent says it once
    var some = k.spent >= 1, spentLine = some ? '$' + OB.fmt(k.spent) + ' spent, ' + OB.fmt(k.views) + ' US views' : 'Nothing spent yet';
    var budget = set ? '<a class="ob-side-budget" href="plan.html" aria-label="Budget: $' + OB.fmt(k.left) + ' left of $' + OB.fmt(A.st.budget) + '">' +
      '<span class="ob-side-budget-top"><span class="ob-side-budget-l">Budget' + (A.st.paused ? '<em>Paused</em>' : '') + '</span>' + (some ? '<span>of $' + OB.fmt(A.st.budget) + '</span>' : '') + '</span>' +
      '<b>$' + OB.fmt(some ? k.left : A.st.budget) + (some ? '<small>left</small>' : '') + '</b>' +
      '<div class="ob-meter"><span style="width:' + used + '%"></span></div>' +
      '<small>' + spentLine + '</small></a>' :
      '<a class="ob-side-budget" href="plan.html"><span class="ob-side-budget-top"><span>Budget</span></span><b>Not set yet</b><small>You pick it in the last step of your report</small></a>';
    return '<a class="ob-logo" href="home.html">' + OB.logoMark + '<span><span class="ob-logo-on">on</span>Blue</span></a>' +
      '<div class="ob-side-nav">' + nav + '</div>' +
      '<div class="ob-side-gap"></div>' + budget +
      '<button class="ob-me" type="button" aria-haspopup="menu" aria-expanded="false" data-me><span class="ob-me-av">' + e(who.charAt(0).toUpperCase()) + '</span>' +
      '<span class="ob-me-t"><b>' + e(who) + '</b><small>' + e(email) + '</small></span><span class="ob-me-dots" aria-hidden="true"><i></i><i></i><i></i></span></button>' +
      '<div class="ob-menu" role="menu" data-menu><div class="ob-menu-who"><b>' + e(r.brand) + '</b><small>Workspace</small></div>' +
      '<button type="button" role="menuitem" data-tour-replay>' + OB.icon('redo', 16) + 'Replay the tour</button>' +
      '<a href="../" role="menuitem">' + OB.icon('globe', 16) + 'onBlue website<span class="ob-menu-ext" aria-hidden="true">' + OB.icon('arrow', 14) + '</span></a><hr>' +
      '<div class="ob-menu-demo" role="group" aria-label="Prototype demo"><small>Prototype demo</small><div>' +
      '<button type="button" data-st="new" aria-pressed="' + (A.stage === 'new') + '" title="Just signed up">Day 1</button>' +
      '<button type="button" data-st="running" aria-pressed="' + (A.stage === 'running') + '" title="Two weeks in">Week 2</button>' +
      '<button type="button" class="ob-menu-reset" data-st-reset>Reset</button></div></div><hr>' +
      '<button type="button" role="menuitem" data-signout>' + OB.icon('logout', 16) + 'Sign out</button></div>';
  }
  var sideEl = document.querySelector('[data-side]');
  function renderSide() { sideEl.innerHTML = side(); }
  renderSide();
  document.addEventListener('ob:videos', renderSide);
  // the old floating demo pill: its controls now live in the account menu
  var dock = document.querySelector('[data-ob-dock]'); if (dock) { dock.remove(); }

  function hideToast() { var t = document.querySelector('.ob-toast'); if (t) { t.classList.remove('is-on'); } }
  // a toast never sits on a button: when one is under it, the toast rises just
  // above that button (it no longer jumps to the top, where it covered the
  // page heading)
  var toast = OB.toast;
  // phones: one home on every page, 12px above the tab bar (app-phone.css), never over the heading.
  // It takes no taps and is gone in 2.4s, so passing over a button is a glance, not a block.
  // Inside the Studio drawer it sits above the sticky footer.
  OB.toast = function (msg) {
    var t = document.querySelector('.ob-toast'); if (t) { t.style.bottom = ''; }
    toast(msg); t = document.querySelector('.ob-toast');
    if (window.matchMedia('(max-width: 820px)').matches) { return; }
    var b = t.getBoundingClientRect(), top = Infinity;
    Array.prototype.forEach.call(document.querySelectorAll('.ob-btn, .ob-prompt-send, button[data-approve]'), function (x) {
      var q = x.getBoundingClientRect();
      if (q.width && q.bottom > b.top - 8 && q.top < b.bottom + 8 && q.right > b.left && q.left < b.right) { top = Math.min(top, q.top); }
    });
    if (top < Infinity) { t.style.bottom = Math.round(window.innerHeight - top + 12) + 'px'; }
  };
  // phones say a toast in one line at 360 (about 34 characters); the longer line stays on desktop
  function ph(long, short) { return window.matchMedia('(max-width: 700px)').matches ? short : long; }
  function menuOpen(on) {
    var menu = sideEl.querySelector('[data-menu]'), me = sideEl.querySelector('[data-me]');
    menu.classList.toggle('is-open', on); me.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) { hideToast(); }
  }
  document.addEventListener('click', function (ev) {
    var menu = sideEl.querySelector('[data-menu]');
    if (ev.target.closest('[data-me]')) { menuOpen(!menu.classList.contains('is-open')); return; }
    if (!ev.target.closest('[data-menu]')) { menuOpen(false); }
    if (ev.target.closest('[data-signout]')) {
      ['onblue:signedin', 'onblue:email', 'onblue:site', 'onblue:agency', 'onblue:agency-status'].forEach(function (k) { OB.sess(k, null); });
      window.location.href = '../';
    }
    if (ev.target.closest('[data-tour-replay]')) {
      OB.store('onblue-tour-done', null);
      if (page === 'home' && OB.tour) { menuOpen(false); OB.tour.start(); } else { window.location.href = 'home.html?tour=1'; }
    }
    var b = ev.target.closest('[data-st]'); if (b) { A.setStage(b.getAttribute('data-st')); }
    if (ev.target.closest('[data-st-reset]')) { A.reset(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && sideEl.querySelector('[data-menu].is-open')) { menuOpen(false); sideEl.querySelector('[data-me]').focus(); }
  });

  // grids show still posters; a clip plays only while its card is hovered or
  // focused, so a work grid never has ten moving pictures at once
  function films(root) {
    (root || document).querySelectorAll('video[data-ob-film]').forEach(function (v) {
      if (v.__obh) { return; } v.__obh = 1;
      var card = v.closest('.ob-vcard, .ob-pcard, .ob-rd-short, .ob-need') || v.parentNode;
      var play = function () { v.preload = 'auto'; v.play().catch(function () {}); };
      var stop = function () { if (!v.paused) { v.pause(); v.load(); } };
      card.addEventListener('mouseenter', play); card.addEventListener('mouseleave', stop);
      card.addEventListener('focusin', play); card.addEventListener('focusout', stop);
    });
  }
  // a video still being made has no picture yet: a tile that says what is being made, with a progress line
  // a fixed share (0 to 1) holds the bar still; without one it runs for the six seconds a request takes
  function making(at, what) {
    return '<div class="ob-phone ob-phone--making" aria-hidden="true"><span class="ob-mk-glyph">' + OB.icon('spark', 20) + '</span>' + (what ? '<span class="ob-mk-what">' + e(what) + '</span>' : '') +
      '<span class="ob-mk-bar"><i' + (at ? ' class="is-held" style="transform:scaleX(' + at + ')"' : '') + '></i></span></div>';
  }
  function thumb(v) { return v.status === 'making' ? making(0, v.format) : '<div class="ob-phone">' + OB.videoTag(OB.film(v.film)) + '<span class="ob-play" aria-hidden="true">' + OB.icon('play', 11) + '</span></div>'; }
  // a title never breaks inside "10-second": the hyphen between two word characters does not wrap
  function nb(s) { return e(s).replace(/(\w)-(\w)/g, '$1‑$2'); }

  // the status sits beside the video, never on it (burnt-in captions collide)
  function status(v) { return '<span class="ob-vstat ob-vstat--' + v.status + '">' + A.STATUS[v.status] + '</span>'; }
  function vcard(v) {
    // phones: a number keeps its unit ("3 am") on one line in the 2-up grid
    var ti = window.matchMedia('(max-width: 700px)').matches ? nb(v.title).replace(/(\d) (am|pm|sec|min|K|M)\b/gi, '$1 $2') : nb(v.title);
    return '<button class="ob-vcard" type="button" data-video="' + v.id + '">' + thumb(v) + status(v) + '<b>' + ti + '</b><small>' +
      e(v.format) + (v.status === 'live' ? '<span class="ob-vsep"> &middot; </span><span class="ob-vviews">' + OB.short(A.views(v)) + '&nbsp;views</span>' : '') + '</small></button>';
  }
  // phones: a swipe strip of filters keeps the pressed one fully inside its 20px edges
  function reveal(strip) {
    var p = strip.querySelector('[aria-pressed="true"]'); if (!p) { return; }
    var s = strip.getBoundingClientRect(), b = p.getBoundingClientRect(), pad = 20;
    if (b.right > s.right - pad) { strip.scrollLeft += b.right - s.right + pad; } else if (b.left < s.left + pad) { strip.scrollLeft -= s.left + pad - b.left; }
  }
  function head(title, sub, act) {
    return '<div class="ob-head"><div><h1>' + e(title) + '</h1>' + (sub ? '<p>' + e(sub) + '</p>' : '') + '</div>' + (act ? '<div class="ob-head-act">' + act + '</div>' : '') + '</div>';
  }

  OB.ui = { vcard: vcard, status: status, head: head, side: renderSide, who: who, films: films, making: making, thumb: thumb, nb: nb, reveal: reveal, ph: ph };
})();
