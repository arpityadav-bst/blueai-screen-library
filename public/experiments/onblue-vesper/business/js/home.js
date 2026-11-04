/* Home: BlueAI's inbox. Your yes leads: the videos waiting for it (the one
   lit panel, anything still being made on top), then the prompt bar, recent
   videos, the report's winning formats in the report's order, and a row of
   competitor Shorts to remix. A report left unfinished at sign-up shows how
   far it got and a way back into it, and nothing it never reached. No clip
   shows twice on the page, and nothing sits on top of a video's middle. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc, P = A.progress;
  var main = document.querySelector('[data-main]');
  var LEFT = ['your brand', 'competitors', 'what wins', 'your angles', 'first videos', 'your plan'];
  var used;

  function hello() { var h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }
  function low(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ''; }
  function same(a, b) { return String(a).toLowerCase() === String(b).toLowerCase(); }
  function angles() { return r.angles.filter(function (a) { return a.on !== false; }); }
  function rivals() { return P.has(2) ? r.rivals.filter(function (x) { return x.on && !x.checking; }).slice(0, 5) : []; }
  function meta(v) { return e(v.format) + (v.angle ? ' &middot; for ' + e(low(v.angle)) : ''); }
  var nb = OB.ui.nb;
  function phone() { return window.matchMedia('(max-width: 700px)').matches; }
  function fit(t) { if (t && t.tagName === 'TEXTAREA') { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 92) + 'px'; } }

  // the count is the page's one toned word, kept on one line with its noun
  function head(n) {
    var hi = hello() + (r.name ? ', ' + e(r.name) : '');
    var h1 = n ? '<span class="ob-tone">' + (n === 1 ? 'One&nbsp;video' : n + '&nbsp;videos') + '</span> ' + '<span class="ob-nw">' + (n === 1 ? 'is' : 'are') + ' waiting</span> for your yes' : hi;
    var sub = n ? hi + '. BlueAI is making videos for ' + e(r.brand) + '.' :
      P.finished ? 'BlueAI is making videos for ' + e(r.brand) + '. Nothing needs you right now.' : 'Your free report for ' + e(r.brand) + ' is saved, ' + P.done + ' of ' + P.total + ' steps done.';
    return '<div class="ob-head"><div><h1>' + h1 + '</h1><p>' + sub + '</p></div></div>';
  }

  // signed up before the report was done: where it stopped, and the way back in
  function resume() {
    if (P.finished) { return ''; }
    var rest = LEFT.slice(P.done), bar = LEFT.map(function (_, i) { return '<i' + (i < P.done ? ' class="is-done"' : '') + '></i>'; }).join('');
    return '<section class="ob-resume"><div class="ob-resume-t"><b>Finish your report</b><p>Still to go: ' + e(rest.join(', ')) + '. BlueAI makes your first videos once your angles are set.</p>' +
      '<span class="ob-resume-bar" aria-label="' + P.done + ' of ' + P.total + ' steps done">' + bar + '</span></div>' +
      '<a class="ob-btn ob-btn--ink" href="../run.html?resume=1">Continue my report' + OB.icon('arrow', 16) + '</a></section>';
  }

  function chips() {
    var vs = A.st.videos, out = [];
    var has = function (f) { return vs.some(function (v) { return v.status !== 'making' && same(v.format, f); }); };
    if (P.has(4)) { angles().slice(0, 3).forEach(function (a) { out.push((has(a.format) ? 'Another ' + low(a.format) : a.format) + ' for ' + low(a.who)); }); }
    else if (P.has(3)) { r.formats.slice(0, 3).forEach(function (f) { out.push(f.name + ' for ' + r.brand); }); }
    var rv = rivals()[0]; if (rv) { out.push('Remix ' + rv.name + '\'s top Short'); }
    return out;
  }
  function prompt() {
    return '<form class="ob-prompt ob-prompt--home" data-prompt data-tour="prompt"><div class="ob-prompt-row">' + OB.agent() +
      // phones get a field that grows to three lines, so a filled chip reads in full
      (phone() ? '<textarea rows="1" placeholder="Ask BlueAI for a video" aria-label="Ask BlueAI"></textarea>' :
        '<input placeholder="' + (window.innerWidth < 640 ? 'Ask BlueAI for a video' : 'What should BlueAI make for ' + e(r.brand) + '?') + '" aria-label="Ask BlueAI">') +
      '<button class="ob-prompt-send" type="submit" aria-label="Send">' + OB.icon('send', 18) + '</button></div>' +
      '<div class="ob-prompt-chips">' + chips().map(function (c) { return '<button type="button" data-chip>' + e(c) + '</button>'; }).join('') + '</div></form>';
  }

  // one card per video: a real 9:16 poster to watch from, Approve as the one filled button
  // (the section already says these need your yes, so the card does not say it again)
  function need(v) {
    return '<div class="ob-need"><a class="ob-phone ob-need-th" href="studio.html#' + v.id + '" data-watch="' + v.id + '" aria-label="Watch ' + e(v.title) + '">' + OB.videoTag(OB.film(v.film)) +
      '<span class="ob-play" aria-hidden="true">' + OB.icon('play', 11) + '</span></a>' +
      '<div class="ob-need-t"><b>' + nb(v.title) + '</b><small>' + meta(v) + '</small>' +
      '<div class="ob-need-act"><button class="ob-btn ob-btn--sm ob-btn--ink" type="button" data-approve="' + v.id + '">' + OB.icon('check', 15) + 'Approve</button>' +
      '<a class="ob-btn ob-btn--sm ob-btn--ghost" href="studio.html#' + v.id + '" data-watch="' + v.id + '">Watch first</a></div></div></div>';
  }
  // videos still being made sit on their own slim line above the ones that need you
  function making(list) {
    if (!list.length) { return ''; }
    return '<div class="ob-mk-line">' + list.map(function (v) {
      return '<div class="ob-mk-i"><span class="ob-mk-spark" aria-hidden="true">' + OB.icon('spark', 14) + '</span><span><b>Making \u201c' + nb(v.title) + '\u201d</b><small>' + e(v.format) + '. It waits here for your yes when it\'s ready.</small></span>' +
        '<span class="ob-mk-bar"><i></i></span></div>';
    }).join('') + '</div>';
  }
  function needs(list, wait) {
    var empty = P.has(5) ? '<b>You\'re all caught up.</b><small>Ask BlueAI for a new video below. It waits here for you before it posts.</small>' :
      '<b>Your first videos come next.</b><small>Finish your report and BlueAI makes three. They wait here for your yes before anything posts.</small>';
    var mk = list.filter(function (v) { return v.status === 'making'; }), ready = list.filter(function (v) { return v.status !== 'making'; });
    var body = ready.length ? '<div class="ob-needs">' + making(mk) + ready.map(need).join('') + '</div>' :
      '<div class="ob-needs ob-needs--empty' + (mk.length ? ' has-making' : '') + '">' + making(mk) + '<span class="ob-yes">' + OB.icon('check') + '</span><div>' + empty + '</div></div>';
    return '<section class="ob-sect ob-sect--first" data-tour="needs"><div class="ob-sect-head"><h2>Needs your yes</h2><span>Nothing posts until you approve it</span></div>' + body + '</section>';
  }

  // the same poster cards at every stage: what is posting now, then what is live, most viewed first
  function recent(rest) {
    if (!rest.length) { return ''; }
    return '<section class="ob-sect"><div class="ob-sect-head"><h2>Your videos</h2><a href="studio.html">All in Studio</a></div><div class="ob-home-row">' + rest.map(OB.ui.vcard).join('') + '</div></section>';
  }

  // the report's five formats, in the report's order, each saying where your videos in it are.
  // "N live" counts only live videos in that format. Bars run on a true 0 to 100% track.
  function formats() {
    if (!P.has(3)) { return ''; }
    var vs = A.st.videos;
    return '<section class="ob-sect"><div class="ob-sect-head"><h2>Formats that win in ' + e(r.category.toLowerCase()) + '</h2><span>From your report, estimated share of views</span></div><div class="ob-fmts">' +
      r.formats.map(function (f, i) {
        var mine = vs.filter(function (v) { return same(v.format, f.name); });
        var n = function (k) { return mine.filter(function (v) { return v.status === k; }).length; };
        var tag = n('live') ? n('live') + ' live' : n('approve') ? n('approve') + ' waiting for your yes' : n('posting') ? n('posting') + ' posting now' : n('making') ? 'Making one' : 'Not tried yet';
        return '<div class="ob-fmt' + (i ? '' : ' is-top') + '"><span class="ob-fmt-rank">' + (i + 1) + '</span><b>' + e(f.name) + '</b>' +
          '<span class="ob-fmt-share"><strong>' + f.share + '%</strong> of views</span><span class="ob-fmt-bar"><i style="width:' + f.share + '%"></i></span>' +
          '<small class="ob-fmt-tag' + (mine.length ? ' is-used' : '') + '">' + tag + '</small>' +
          '<button class="ob-btn ob-btn--sm" type="button" data-format="' + i + '" aria-label="' + (mine.length ? 'Make another ' : 'Make one: ') + e(f.name) + '">' + OB.icon('plus', 15) + (mine.length ? 'Make another' : 'Make one') + '</button></div>';
      }).join('') + '</div></section>';
  }

  // each competitor's best Short whose clip is not already on the page (the same Shorts as Radar)
  function remixes() {
    var cards = [];
    rivals().forEach(function (x, i) {
      var s = A.shorts(x).filter(function (q) { return !used[q.film]; })[0]; if (!s) { return; }
      used[s.film] = true;
      cards.push('<div class="ob-pcard"><span class="ob-phone">' + OB.videoTag(OB.film(s.film)) + '</span><b>' + nb(s.title) + '</b>' +
        '<small class="ob-pcard-meta">' + e(x.name) + '<span class="ob-pcard-fm"> &middot; ' + e(s.format) + '</span></small><small class="ob-pcard-views"><strong>' + OB.short(s.views) + '</strong>&nbsp;views</small>' +
        '<button class="ob-btn ob-btn--sm" type="button" data-remix="' + i + '" data-title="' + e(s.title) + '" data-fm="' + e(s.format) + '" data-film="' + s.film + '" data-rival="' + e(x.name) + '" aria-label="Remix ' + e(x.name) + '\'s Short for ' + e(r.brand) + '">' + OB.icon('spark', 15) + 'Remix</button></div>');
    });
    if (!cards.length) { return ''; }
    return '<section class="ob-sect"><div class="ob-sect-head"><h2>Remix a competitor</h2><a href="radar.html">Open Radar</a></div><div class="ob-home-row">' + cards.join('') + '</div></section>';
  }

  function render() {
    var vs = A.st.videos, wait = vs.filter(function (v) { return v.status === 'approve'; });
    var list = vs.filter(function (v) { return v.status === 'making'; }).concat(wait);
    var rank = function (v) { return v.status === 'posting' ? 1e9 : A.views(v); };
    var rest = vs.filter(function (v) { return v.status === 'posting' || v.status === 'live'; }).sort(function (a, b) { return rank(b) - rank(a); }).slice(0, 5);
    used = {}; list.concat(rest).forEach(function (v) { if (v.status !== 'making') { used[v.film] = true; } });
    main.innerHTML = head(wait.length) + resume() + needs(list, wait.length) + prompt() + recent(rest) + formats() + remixes();
    OB.ui.films(main);
  }

  function made(v) { OB.toast('Making \u201c' + v.title + '\u201d. It\'ll wait for your yes when it\'s ready.'); render(); OB.ui.side(); }

  main.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var inp = ev.target.querySelector('input, textarea'), v = inp.value.trim();
    if (!v) { inp.focus(); return; }
    made(A.make(v.charAt(0).toUpperCase() + v.slice(1)));
  });
  main.addEventListener('input', function (ev) { var f = ev.target.closest('[data-prompt]'); if (f) { f.classList.toggle('has-text', !!ev.target.value.trim()); fit(ev.target); } });
  // the phone's field is a textarea: Enter still sends, Shift+Enter is a new line
  main.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' || ev.shiftKey || ev.isComposing || ev.target.tagName !== 'TEXTAREA') { return; }
    var f = ev.target.closest('[data-prompt]'); if (!f) { return; }
    ev.preventDefault(); if (f.requestSubmit) { f.requestSubmit(); } else { f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }
  });
  main.addEventListener('click', function (ev) {
    var t = ev.target;
    var chip = t.closest('[data-chip]');
    if (chip) { var inp = main.querySelector('[data-prompt] input, [data-prompt] textarea'); inp.value = chip.textContent; inp.closest('form').classList.add('has-text'); fit(inp); inp.focus(); return; }
    var w = t.closest('[data-watch]'); if (w) { A.watched(w.getAttribute('data-watch')); return; }
    var ap = t.closest('[data-approve]');
    if (ap) { A.approve(ap.getAttribute('data-approve')); OB.toast(A.st.paused ? 'Approved. It goes out when you resume posting.' : 'Approved. Creators start posting it today.'); render(); OB.ui.side(); return; }
    var fm = t.closest('[data-format]');
    if (fm) { var f = r.formats[+fm.getAttribute('data-format')]; made(A.make(f.name + ' for ' + r.brand, f.name)); return; }
    var rx = t.closest('[data-remix]');
    if (rx) { made(A.make(rx.getAttribute('data-title'), rx.getAttribute('data-fm'), '', rx.getAttribute('data-rival') + ' remix: \u201c' + rx.getAttribute('data-title') + '\u201d', +rx.getAttribute('data-film'))); return; }
    var vc = t.closest('[data-video]');
    if (vc) { window.location.href = 'studio.html#' + vc.getAttribute('data-video'); }
  });
  document.addEventListener('ob:videos', function () { render(); OB.ui.side(); });

  render();
  // a new sign-up hears that the report was kept, then gets the tour (also replayable from the
  // account menu); someone signing back in gets neither
  var q = window.location.search, fresh = /welcome=1/.test(q), replay = /tour=1/.test(q);
  if (fresh || replay) { window.history.replaceState(null, '', 'home.html'); }
  if (fresh) {
    OB.toast(P.finished ? 'Your report is saved.' : 'Your report is saved. Pick it up where you left off.');
  }
  if (OB.tour && (replay || (fresh && !OB.store('onblue-tour-done')))) { window.setTimeout(function () { OB.tour.start(); }, fresh ? 2200 : 400); }
})();
