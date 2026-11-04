/* Radar (Appy: "really good, should be highlighted"): your competitors,
   watched every day. The lead is the one Short worth remixing right now (the
   lit panel: its 9:16 poster, its views, one ink button), beside a quieter
   panel with the formats winning across the category (true 0 to 100% bars)
   and this week's figures. Then each competitor's Shorts as cards (each with
   its own fixed clip and title, from OB.app.shorts, never one of your own
   videos), what that competitor leans on, and one click to remix any of them. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  var page = document.querySelector('[data-main]');
  // the head, the competitor manager (js/radar-manage.js) and the body; a change
  // in the manager redraws the head and body, never the panel you are using
  page.innerHTML = '<div data-rh></div><div class="rd-man" data-rman hidden></div><div data-rbody></div>';
  var rh = page.querySelector('[data-rh]'), main = page.querySelector('[data-rbody]');
  var at = 0, done = {}, man;

  function head(sub, act) {
    rh.innerHTML = '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Radar</h1><p class="ob-p-lede">' + e(sub) + '</p></div>' + (act ? '<div class="ob-pg-act">' + act + '</div>' : '') + '</header>';
    exp(); return '';
  }
  // the head's Manage says whether the manager is open (phones hide it then: the panel's Done is the one close)
  function exp() { var o = !!(man && man.isOpen()); rh.querySelectorAll('[data-manage]').forEach(function (b) { b.setAttribute('aria-expanded', o ? 'true' : 'false'); }); }
  function remixBtn(x, i, ink) {
    var key = x.name + ':' + i;
    return done[key] ? '<a class="ob-rd-done" href="studio.html">Making it &middot; Open in Studio' + OB.icon('arrow', 14) + '</a>' :
      '<button class="ob-btn ob-btn--sm' + (ink ? ' ob-btn--ink' : '') + '" type="button" data-remix="' + i + '" data-of="' + e(x.name) + '">' + OB.icon('spark', 15) + 'Remix for ' + e(r.brand) + '</button>';
  }
  // lead: the Short already shown as the best of your competitors (phones hide its second copy)
  function card(x, s, i, lead) {
    return '<div class="ob-rd-short' + (lead ? ' is-lead' : '') + '" data-short="' + i + '"><div class="ob-phone">' + OB.videoTag(OB.film(s.film)) + '</div><div class="ob-rd-body"><b>' + OB.ui.nb(s.title) + '</b>' +
      '<small>' + e(s.format) + '</small><small>' + s.days + ' days running</small><span class="ob-rd-views"><strong>' + OB.short(s.views) + '</strong>&nbsp;views</span>' + remixBtn(x, i) + '</div></div>';
  }
  // the most common format in a competitor's top Shorts
  function leans(list) {
    var c = {}, best = list[0].format;
    list.forEach(function (s) { c[s.format] = (c[s.format] || 0) + 1; if (c[s.format] > c[best]) { best = s.format; } });
    return best;
  }

  // the formats your plan makes (the angles you kept), against the category's winners
  function mine(name) { return r.angles.some(function (a) { return a.on && a.format.toLowerCase() === name.toLowerCase(); }); }
  function planSay() {
    var hit = r.formats.filter(function (f) { return mine(f.name); }).map(function (f) { return f.name.toLowerCase(); });
    if (!hit.length) { return 'Your plan makes none of these yet. Remixing the best Short above is the quickest way in.'; }
    var list = hit.length > 1 ? hit.slice(0, -1).join(', ') + ' and ' + hit[hit.length - 1] : hit[0];
    return 'Your plan makes ' + (hit.length === 1 ? 'one' : hit.length) + ' of these, marked with a dot: ' + e(list) + '.';
  }

  function render() {
    var on = r.rivals.filter(function (x) { return x.on && !x.checking; }), ph = window.matchMedia('(max-width: 700px)').matches;
    var mbtn = '<button class="ob-btn ob-btn--sm" type="button" data-manage>Manage competitors</button>';
    if (!on.length) {
      // phones: while the manager is open it is the way in, so its two actions never show twice
      if (ph && man && man.isOpen()) { main.innerHTML = head('Your competitors, watched every day.', mbtn); return; }
      // phones with brands only switched off: switching them back on leads, and the card is the one way in (no head button)
      var back = ph && r.rivals.length;
      main.innerHTML = head('Your competitors, watched every day.', back ? '' : mbtn) +
        '<div class="ob-card ob-card--lit ob-pg-empty"><b>No competitors to watch yet</b><p>' + (r.rivals.length ? 'Radar watches the competitors you switch on. None are on right now.' : 'Add the brands you compete with, or let BlueAI find the ones selling to your buyers.') + '</p>' +
        '<div class="rd-empty-act"><button class="ob-btn ob-btn--ink" type="button" data-manage>' + (back ? OB.icon('redo', 16) + 'Switch competitors back on' : OB.icon('plus', 16) + 'Add a competitor') + '</button><button class="ob-btn" type="button" data-findme>' + OB.icon('radar', 16) + 'Find competitors for me</button></div></div>';
      return;
    }
    var x = on[Math.min(at, on.length - 1)], list = A.shorts(x), lg = A.longest();
    // the lead: the best Short across every competitor you watch
    var top = null; on.forEach(function (q) { var s = A.shorts(q)[0]; if (!top || s.views > top.s.views) { top = { x: q, s: s }; } });
    var lean = leans(list), wins = r.formats.some(function (f) { return f.name.toLowerCase() === lean.toLowerCase(); });
    var oldTabs = main.querySelector('.ob-rd-tabs'), sl = oldTabs ? oldTabs.scrollLeft : 0;   // the phone's swipe strip keeps its place
    main.innerHTML = head('Your competitors, watched every day. See what lands and remix it for ' + r.brand + '.', '<button class="ob-btn ob-btn--sm rd-watch" type="button" data-manage><i aria-hidden="true"></i>Watching ' + on.length + ' brand' + (on.length === 1 ? '' : 's') + '<span>Manage</span></button>') +
      '<div class="ob-rd-top"><div class="ob-card ob-card--lit ob-rd-hero"><div class="ob-phone">' + OB.videoTag(OB.film(top.s.film)) + '</div><div class="ob-rd-hero-t">' +
      '<small>Best of your competitors right now</small><b>' + OB.ui.nb(top.s.title) + '</b><span class="ob-rd-hero-by">' + e(top.x.name) + ' &middot; ' + e(top.s.format) + '</span>' +
      '<span class="ob-rd-views"><strong>' + OB.short(top.s.views) + '</strong>&nbsp;views</span>' +
      // what makes it work, as BlueAI reads it: fills the card with the reason to remix, not air
      '<div class="ob-rd-why"><small>Why it works, as BlueAI reads it</small><ul>' + ['A hook in the first second', 'One character, one small problem', 'Short enough to watch twice'].map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' +
      '<p class="ob-rd-say">' + OB.agent() + '<span>BlueAI keeps the format and the hook, and makes it about ' + e(r.brand) + '.</span></p>' +
      '<span data-hero>' + remixBtn(top.x, 'hero', true) + '</span></div></div>' +

      '<div class="ob-card ob-rd-week"><h3 class="ob-pg-h3">Formats winning across ' + e(r.category.toLowerCase()) + '</h3><p class="ob-pg-p">Share of views, all brands in the category, estimated</p><div class="ob-rd-bars">' +
      r.formats.map(function (f, i) {
        return '<div class="ob-rd-bar' + (i ? '' : ' is-top') + '"><span>' + e(f.name) + (mine(f.name) ? '<i class="rd-mine" title="In your plan" aria-label="in your plan"></i>' : '') + '</span><div class="ob-rd-t"><i style="width:' + f.share + '%"></i></div><b>' + f.share + '%</b></div>';
      }).join('') + '</div>' +
      '<div class="ob-rd-figs"><div><span class="ob-p-figure">' + Math.max(3, Math.round(r.rivalsTotal / 26)) + '</span><small>New Shorts from your competitors this week, estimated</small></div>' +
      '<div><span class="ob-p-figure">' + lg.days + '<small>days</small></span><small>' + e(lg.rival) + '\'s longest-running Short</small></div></div>' +
      // what the bars mean for you: the winning formats your plan already makes
      '<p class="ob-rd-say rd-plan-say">' + OB.agent() + '<span>' + planSay() + '</span></p></div></div>' +

      '<section><div class="ob-rd-tabs" role="group" aria-label="Competitors">' + on.map(function (q, i) {
        return '<button type="button" data-rival="' + i + '" aria-pressed="' + (q === x) + '" title="' + q.videos + ' Shorts in 6 months">' + e(q.name) + '<span>' + q.videos + ' Shorts</span></button>';
      }).join('') + '</div>' +
      '<div class="ob-p-sect ob-rd-sect"><h2 class="ob-p-h2">' + e(x.name) + '\'s top Shorts</h2><span class="ob-p-note">' + x.videos + ' Shorts in 6 months &middot; ' + e(x.site) + '</span></div>' +
      '<p class="ob-rd-lean">' + e(x.name) + ' leans on ' + e(lean.toLowerCase()) + (wins ? ', one of the formats winning in your category.' : ', which is not one of the five formats winning across the category.') + '</p><div class="ob-rd-list">' +
      list.map(function (s, i) { return card(x, s, i, list.length > 1 && x === top.x && s.film === top.s.film && s.title === top.s.title); }).join('') + '</div></section>';
    main.__list = list; main.__rival = x; main.__top = top;
    var tabs = main.querySelector('.ob-rd-tabs'); if (tabs) { tabs.scrollLeft = sl; if (ph) { OB.ui.reveal(tabs); } }
    OB.ui.films(main);
  }

  // phones with nothing switched on: opening or closing the manager swaps the empty card in or out
  function emptyPhone() { if (!man.count() && window.matchMedia('(max-width: 700px)').matches) { render(); } }
  function manage(find) { man.open(find); emptyPhone(); exp(); }
  rh.addEventListener('click', function (ev) { if (ev.target.closest('[data-manage]')) { manage(false); } });
  main.addEventListener('click', function (ev) {
    if (ev.target.closest('[data-manage]')) { manage(false); return; }
    if (ev.target.closest('[data-findme]')) { manage(true); return; }
    var t = ev.target.closest('[data-rival]'); if (t) { at = +t.getAttribute('data-rival'); render(); return; }
    var rx = ev.target.closest('[data-remix]');
    if (rx) {
      var k = rx.getAttribute('data-remix'), hero = k === 'hero', x = hero ? main.__top.x : main.__rival, s = hero ? main.__top.s : main.__list[+k];
      A.make(s.title, s.format, '', x.name + ' remix: “' + s.title + '”', s.film); OB.ui.side();
      done[x.name + ':' + k] = true;
      rx.outerHTML = remixBtn(x, k, hero);   // only the clicked button changes, and it says where the remix went
      OB.toast(OB.ui.ph('Remix started. It\'ll wait in Studio for your yes.', 'Remixing. It waits in Studio.'));
    }
  });

  man = OB.radarManage(page.querySelector('[data-rman]'), function () { at = 0; render(); }, function () { emptyPhone(); exp(); });
  render();
})();
