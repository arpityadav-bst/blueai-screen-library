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
  var main = document.querySelector('[data-main]');
  var at = 0, done = {};

  function head(sub, act) {
    return '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Radar</h1><p class="ob-p-lede">' + e(sub) + '</p></div>' + (act ? '<div class="ob-pg-act">' + act + '</div>' : '') + '</header>';
  }
  function remixBtn(x, i, ink) {
    var key = x.name + ':' + i;
    return done[key] ? '<a class="ob-rd-done" href="studio.html">Making it &middot; Open in Studio' + OB.icon('arrow', 14) + '</a>' :
      '<button class="ob-btn ob-btn--sm' + (ink ? ' ob-btn--ink' : '') + '" type="button" data-remix="' + i + '" data-of="' + e(x.name) + '">' + OB.icon('spark', 15) + 'Remix for ' + e(r.brand) + '</button>';
  }
  function card(x, s, i) {
    return '<div class="ob-rd-short" data-short="' + i + '"><div class="ob-phone">' + OB.videoTag(OB.film(s.film)) + '</div><div class="ob-rd-body"><b>' + OB.ui.nb(s.title) + '</b>' +
      '<small>' + e(s.format) + '</small><small>' + s.days + ' days running</small><span class="ob-rd-views"><strong>' + OB.short(s.views) + '</strong>&nbsp;views</span>' + remixBtn(x, i) + '</div></div>';
  }
  // the most common format in a competitor's top Shorts
  function leans(list) {
    var c = {}, best = list[0].format;
    list.forEach(function (s) { c[s.format] = (c[s.format] || 0) + 1; if (c[s.format] > c[best]) { best = s.format; } });
    return best;
  }

  function render() {
    var on = r.rivals.filter(function (x) { return x.on; });
    if (!on.length) {
      main.innerHTML = head('Your competitors, watched every day.') +
        '<div class="ob-card ob-card--lit ob-pg-empty"><b>No competitors to watch yet</b><p>Radar watches the competitors you kept in your report. None are on right now.</p></div>';
      return;
    }
    var x = on[Math.min(at, on.length - 1)], list = A.shorts(x), lg = A.longest();
    // the lead: the best Short across every competitor you watch
    var top = null; on.forEach(function (q) { var s = A.shorts(q)[0]; if (!top || s.views > top.s.views) { top = { x: q, s: s }; } });
    var lean = leans(list), wins = r.formats.some(function (f) { return f.name.toLowerCase() === lean.toLowerCase(); });
    main.innerHTML = head('Your competitors, watched every day. See what lands and remix it for ' + r.brand + '.', '<span class="ob-ap-tag">Watching ' + on.length + ' brands</span>') +
      '<div class="ob-rd-top"><div class="ob-card ob-card--lit ob-rd-hero"><div class="ob-phone">' + OB.videoTag(OB.film(top.s.film)) + '</div><div class="ob-rd-hero-t">' +
      '<small>Best of your competitors right now</small><b>' + OB.ui.nb(top.s.title) + '</b><span class="ob-rd-hero-by">' + e(top.x.name) + ' &middot; ' + e(top.s.format) + '</span>' +
      '<span class="ob-rd-views"><strong>' + OB.short(top.s.views) + '</strong>&nbsp;views</span>' +
      // what makes it work, as BlueAI reads it: fills the card with the reason to remix, not air
      '<div class="ob-rd-why"><small>Why it works, as BlueAI reads it</small><ul>' + ['A hook in the first second', 'One character, one small problem', 'Short enough to watch twice'].map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' +
      '<p class="ob-rd-say">' + OB.agent() + '<span>BlueAI keeps the format and the hook, and makes it about ' + e(r.brand) + '.</span></p>' +
      '<span data-hero>' + remixBtn(top.x, 'hero', true) + '</span></div></div>' +

      '<div class="ob-card ob-rd-week"><h3 class="ob-pg-h3">Formats winning across ' + e(r.category.toLowerCase()) + '</h3><p class="ob-pg-p">Estimated share of views among the five leading formats, all brands in the category</p><div class="ob-rd-bars">' +
      r.formats.map(function (f, i) {
        return '<div class="ob-rd-bar' + (i ? '' : ' is-top') + '"><span>' + e(f.name) + '</span><div class="ob-rd-t"><i style="width:' + f.share + '%"></i></div><b>' + f.share + '%</b></div>';
      }).join('') + '</div>' +
      '<div class="ob-rd-figs"><div><span class="ob-p-figure">' + Math.max(3, Math.round(r.rivalsTotal / 26)) + '</span><small>New Shorts from your competitors this week, estimated</small></div>' +
      '<div><span class="ob-p-figure">' + lg.days + '<small>days</small></span><small>' + e(lg.rival) + '\'s longest-running Short</small></div></div></div></div>' +

      '<section><div class="ob-rd-tabs" role="group" aria-label="Competitors">' + on.map(function (q, i) {
        return '<button type="button" data-rival="' + i + '" aria-pressed="' + (q === x) + '" title="' + q.videos + ' Shorts in 6 months">' + e(q.name) + '<span>' + q.videos + ' Shorts</span></button>';
      }).join('') + '</div>' +
      '<div class="ob-p-sect ob-rd-sect"><h2 class="ob-p-h2">' + e(x.name) + '\'s top Shorts</h2><span class="ob-p-note">' + x.videos + ' Shorts in 6 months &middot; ' + e(x.site) + '</span></div>' +
      '<p class="ob-rd-lean">' + e(x.name) + ' leans on ' + e(lean.toLowerCase()) + (wins ? ', one of the formats winning in your category.' : ', which is not one of the five formats winning across the category.') + '</p><div class="ob-rd-list">' +
      list.map(function (s, i) { return card(x, s, i); }).join('') + '</div></section>';
    main.__list = list; main.__rival = x; main.__top = top;
    OB.ui.films(main);
  }

  main.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-rival]'); if (t) { at = +t.getAttribute('data-rival'); render(); return; }
    var rx = ev.target.closest('[data-remix]');
    if (rx) {
      var k = rx.getAttribute('data-remix'), hero = k === 'hero', x = hero ? main.__top.x : main.__rival, s = hero ? main.__top.s : main.__list[+k];
      A.make(s.title, s.format, '', x.name + ' remix: “' + s.title + '”', s.film); OB.ui.side();
      done[x.name + ':' + k] = true;
      rx.outerHTML = remixBtn(x, k, hero);   // only the clicked button changes, and it says where the remix went
      OB.toast('Remix started. It\'ll wait in Studio for your yes.');
    }
  });

  render();
})();
