/* Studio: every video BlueAI made. Filter by where it is (videos that need
   you come first), open one to watch it, read its script, approve it, or ask
   for a change in plain words. Tab counts, the sidebar badge and the card
   labels all count the same thing. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  var main = document.querySelector('[data-main]'), drawer = document.querySelector('[data-drawer]');
  var TABS = [['all', 'All'], ['approve', 'Needs your yes'], ['making', 'Making'], ['posting', 'Posting'], ['live', 'Live']];
  var EMPTY = { all: 'No videos yet. Ask for one above.', approve: 'Nothing is waiting for your yes.', making: 'Nothing is being made right now.', posting: 'Nothing is posting right now.', live: 'No videos are live yet. Approve one and creators start posting it.' };
  var LEN = 6;   // the clips run about six seconds; the drawer reads the real length once the clip loads
  var ORDER = { approve: 0, making: 1, posting: 2, live: 3 };
  function say() { return A.st.paused ? 'Posting is paused. It goes out when you resume.' : 'Creators start posting it today.'; }
  var tab = 'all';

  function inTab(k) { return function (v) { return k === 'all' || v.status === k; }; }
  function low(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ''; }
  // the banner above already offers the review, so an empty tab never repeats it; Live knows what is posting
  function empty() {
    var p = A.st.videos.filter(inTab('posting')).length, txt = EMPTY[tab];
    if (tab === 'live' && p) { txt = (p === 1 ? '1 video is' : p + ' videos are') + ' posting now. ' + (p === 1 ? 'It shows' : 'They show') + ' here once creators publish ' + (p === 1 ? 'it' : 'them') + '.'; }
    return '<div class="ob-card ob-st-empty"><span class="ob-st-empty-i">' + OB.icon('studio', 20) + '</span><p>' + txt + '</p>' +
      (tab === 'live' && p ? '<button class="ob-btn ob-btn--sm" type="button" data-tab="posting">See what is posting</button>' : '') + '</div>';
  }
  function render() {
    var vs = A.st.videos.filter(inTab(tab)).sort(function (a, b) { return ORDER[a.status] - ORDER[b.status]; });
    var count = function (k) { return A.st.videos.filter(inTab(k)).length; };
    var n = count('approve');
    // what needs you leads; asking for a new video comes after
    var ph = window.matchMedia('(max-width: 700px)').matches, onAp = tab === 'approve';
    var lead = n && !onAp && !ph ? '<div class="ob-st-wait"><span class="ob-st-n">' + n + '</span><span><b>' + (n === 1 ? 'One video is' : n + ' videos are') + ' waiting for your yes.</b> Watch, then approve or ask for a change.</span>' +
      '<button class="ob-btn ob-btn--sm ob-btn--ink" type="button" data-tab="approve">Review ' + (n === 1 ? 'it' : 'them') + '</button></div>' : '';
    // phones: no waiting card; the "Needs your yes" filter and the tab badge carry the count, so the grid starts higher
    var oldTabs = main.querySelector('.ob-st-tabs'), sl = oldTabs ? oldTabs.scrollLeft : 0;   // the phone's swipe strip keeps its place
    main.innerHTML = '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Studio</h1><p class="ob-p-lede">Every video BlueAI made for ' + e(r.brand) + '.' + (ph ? '' : ' Open one to approve it or ask for a change.') + '</p></div></header>' + lead +
      '<form class="ob-prompt ob-st-prompt" data-new><div class="ob-prompt-row">' + OB.agent() + '<input placeholder="' + (window.matchMedia('(max-width: 700px)').matches ? 'Ask for a new video' : 'Ask for a new video, like another ' + e(r.formats[0].name.toLowerCase())) + '" aria-label="Ask for a new video">' +
      '<button class="ob-prompt-send" type="submit" aria-label="Send">' + OB.icon('send', 18) + '</button></div></form>' +
      '<div class="ob-st-tabs" role="group" aria-label="Filter videos">' + TABS.map(function (t) {   // all five, always; an empty one is dimmed
        var c = count(t[0]);
        return '<button type="button" data-tab="' + t[0] + '" aria-pressed="' + (t[0] === tab) + '"' + (c ? '' : ' class="is-zero"') + '>' + t[1] + '<span>' + c + '</span></button>';
      }).join('') + '</div>' +
      (vs.length ? '<div class="ob-vgrid ob-st-grid">' + vs.map(OB.ui.vcard).join('') + '</div>' : empty());
    var tabs = main.querySelector('.ob-st-tabs'); if (tabs) { tabs.scrollLeft = sl; if (ph) { OB.ui.reveal(tabs); } }
    OB.ui.films(main);
  }

  // the script per format: a hook, three short beats, an end line, timed across the clip's real
  // length. Every row is what is said or shown, never a note about it, and never a raw profile
  // field read aloud; {show} is what the clip itself shows. No claimed measurements.
  var LINES = {
    'then vs now': ['"This used to take all afternoon."', '"Left: the old way."', '"Right: {brand}."', '"Already done."', '"Pick a side."'],
    'talking product': ['"Okay, I have to say something."', '"You do this the long way."', '"I\'m {brand}."', '"One tap. Done."', '"Try me."'],
    'animated story': ['"{show}."', '"One job was still left."', '"Then {brand} picked it up."', '"Done early."', '"Try {brand}."'],
    'real-time retro': ['"No cuts. Real time."', '"Disc one. Still loading."', '"Same job with {brand}."', '"Already done."', '"Nobody misses the old way."'],
    'screen trick': ['"Watch the screen."', '"Most people take six steps."', '"This takes one."', '"That\'s {brand}."', '"You\'re welcome."'],
    'meme edit': ['"Me, pretending this is fine."', '"The fifth tab."', '"Friend: just use {brand}."', '"Me, done."', '"Send this to someone."'],
    'price counter': ['"Let\'s count what it costs."', '"The hours, added up."', '"The tools, added up."', '"Now {brand}\'s number."', '"The math talks."'],
    'deal reveal': ['"Wait for the price."', '"Everything you get."', '"What it costs elsewhere."', '"And with {brand}."', '"No catch."'],
    'micro horror': ['"3:07 am."', '"Something moved on the screen."', '"It was only {brand}."', '"Finishing the job."', '"Sleep well."'],
    'cat drama': ['"{show}."', '"The cat is not impressed."', '"Then {brand} steps in."', '"Even the cat approves."', '"Try {brand}."'],
    'fruit drama': ['"{show}."', '"Everyone wants the last one."', '"{brand} settles it."', '"Peace in the bowl."', '"Try {brand}."'],
    'photoreal story': ['"{show}."', '"It was a long day."', '"{brand} took one thing off the list."', '"Home on time."', '"Try {brand}."'],
    'isometric timeline': ['"{show}."', '"Year one: the hard way."', '"Every year, a little faster."', '"Now: {brand}."', '"See how far it came."'],
    '3d what-if': ['"{show}"', '"Imagine it took one tap."', '"That\'s {brand}."', '"No imagining needed."', '"Try it."']
  };
  function script(v, len) {
    var l = LINES[String(v.format).toLowerCase()] || ['"{show}."', '"Made for {who}."', '"This is {brand}."', '"Here is what it does."', '"See for yourself."'];
    var show = (A.shows(v.film) || [v.title])[0], D = len || LEN;
    var fill = function (s) { return s.replace(/\{brand\}/g, r.brand).replace(/\{who\}/g, low(v.angle) || 'people like you').replace(/\{show\}/g, show); };
    return [0, 0.2, 0.42, 0.62, 0.82].map(function (f, i) { return [time(D * f), i ? (i === 4 ? 'End' : '') : 'Hook', fill(l[i])]; });
  }
  function time(t) { var n = Math.floor(t); return '0:' + (n < 10 ? '0' : '') + n; }
  function lenText(D) { return 'About ' + Math.round(D) + ' seconds, vertical'; }
  function next(id) { return A.st.videos.filter(function (q) { return q.status === 'approve' && q.id !== id; })[0]; }
  function open(id) {
    var v = A.byId(id); if (!v) { return; }
    if (v.status !== 'making') { A.watched(id); }
    var live = v.status === 'live', views = A.views(v);
    var art = v.status === 'making' ? OB.ui.making(0, v.format) : '<div class="ob-phone">' + OB.videoTag(OB.film(v.film)) + '</div>';
    var ang = r.angles.filter(function (a) { return a.who === v.angle; })[0], angOff = ang && ang.on === false, nx = next(id), waiting = A.kpis().waiting;
    drawer.innerHTML = '<div class="ob-drawer-box" role="dialog" aria-modal="true" aria-label="' + e(v.title) + '"><button class="ob-x" type="button" aria-label="Close" data-close>' + OB.icon('close', 18) + '</button>' +
      '<span class="ob-dr-bar-t" aria-hidden="true">' + OB.ui.nb(v.title) + '</span><div class="ob-drawer-grid"><div class="ob-dr-art">' + art + '<span class="ob-dr-len" data-len>' + lenText(LEN) + '</span></div><div class="ob-dr-body">' + OB.ui.status(v) +
      '<h2>' + OB.ui.nb(v.title) + '</h2><p class="ob-dr-meta"><span>' + e(v.format) + '</span><span>For ' + e(low(v.angle)) + '</span><span>' + OB.icon('youtube', 14) + 'YouTube Shorts</span></p>' +
      (live ? '<div class="ob-card ob-card--lit ob-dr-kpis"><div><small>verified views</small><span class="ob-p-figure">' + OB.fmt(views) + '</span></div><div><small>Cost</small><span class="ob-p-figure">$' + OB.fmt(views / 1000 * OB.RATE) + '</span></div></div>' : '') +
      (angOff && v.status === 'approve' ? '<p class="ob-dr-help">' + e(v.angle) + ' is turned off on Plan. This one still waits for your yes; nothing new is made for them.</p>' : '') +
      '<div class="ob-dr-script"><h3 class="ob-pg-h3">Script</h3><ol data-script>' + script(v).map(function (s) { return '<li><small>' + s[0] + (s[1] ? '<em>' + s[1] + '</em>' : '') + '</small><p>' + e(s[2]) + '</p></li>'; }).join('') + '</ol></div>' +
      (v.status === 'approve' ? '<div class="ob-dr-foot"><button class="ob-btn ob-btn--ink ob-dr-approve" type="button" data-approve="' + v.id + '">' + OB.icon('check', 16) + (A.st.paused ? 'Approve' : 'Approve and post') + '</button></div><p class="ob-dr-help">' + say() + (A.st.paused ? ' <a class="ob-link" href="plan.html">Resume on Plan</a>' : '') + '</p>' : '') +
      (v.status === 'posting' ? '<p class="ob-dr-note"><span class="ob-yes ob-yes--sm">' + OB.icon('check') + '</span><span>Approved. ' + say() + (A.st.paused ? '' : ' Views show up in Analytics from tomorrow.') + '</span></p>' +
        (nx ? '<button class="ob-btn ob-btn--ink ob-dr-approve" type="button" data-open="' + nx.id + '">Next waiting (' + waiting + ')' + OB.icon('arrow', 16) + '</button>' : '') +
        '<div class="ob-dr-stopbox"><button class="ob-btn ob-btn--sm" type="button" data-unpost="' + v.id + '">Stop posting</button><p class="ob-dr-help">Creators stop posting new copies and it goes back to Needs your yes. Views so far stay counted.</p></div>' : '') +
      (v.status === 'approve' ? '<form class="ob-dr-ask" data-improve="' + v.id + '"><label for="ob-dr-q">Ask for a change</label><div class="ob-add"><input class="ob-input" id="ob-dr-q" placeholder="Like a shorter hook" autocomplete="off"><button class="ob-btn" type="submit" disabled>' + OB.icon('redo', 15) + 'Remake with this</button></div>' +
        '<p class="ob-dr-help">BlueAI makes a new take with your note. It waits here for your yes, like this one.</p></form>' : '') +
      (v.status === 'making' ? '<p class="ob-dr-note"><span>BlueAI is making this one. It moves to Needs your yes when it is ready.</span></p>' : '') +
      '</div></div></div>';
    drawer.classList.add('is-open'); document.body.classList.add('has-drawer');
    var vd = drawer.querySelector('.ob-dr-art video');
    if (vd) {   // play, scrub and sound; the length line and the script times follow the real clip
      vd.controls = true; vd.preload = 'metadata';
      vd.addEventListener('loadedmetadata', function () {
        var D = vd.duration; if (!D || !isFinite(D)) { return; }
        var l = drawer.querySelector('[data-len]'); if (l) { l.textContent = lenText(D); }
        var ol = drawer.querySelector('[data-script]'); if (ol) { script(v, D).forEach(function (s, i) { var t = ol.children[i] && ol.children[i].querySelector('small'); if (t) { t.firstChild.textContent = s[0]; } }); }
      });
    }
    OB.watchFilms(drawer);
    // phones: once the video scrolls under the top bar, the bar names the video you are looking at
    var bx = drawer.querySelector('.ob-drawer-box'), artEl = drawer.querySelector('.ob-dr-art');
    if (bx && artEl && window.IntersectionObserver && window.matchMedia('(max-width: 820px)').matches) {
      new window.IntersectionObserver(function (es) { bx.classList.toggle('is-past', !es[0].isIntersecting); }, { root: bx, rootMargin: '-56px 0px 0px 0px' }).observe(artEl);
    }
    if (window.location.hash !== '#' + id) { window.history.replaceState(null, '', '#' + id); }
  }
  function close() {
    drawer.classList.remove('is-open'); document.body.classList.remove('has-drawer'); drawer.innerHTML = '';
    var t = document.querySelector('.ob-toast'); if (t) { t.classList.remove('is-on'); }
    window.history.replaceState(null, '', 'studio.html');
  }

  main.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-tab]'); if (t) { tab = t.getAttribute('data-tab'); render(); return; }
    var v = ev.target.closest('[data-video]'); if (v) { open(v.getAttribute('data-video')); }
  });
  main.addEventListener('input', function (ev) { var f = ev.target.closest('[data-new]'); if (f) { f.classList.toggle('has-text', !!ev.target.value.trim()); } });
  main.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var inp = ev.target.querySelector('input'), q = inp.value.trim(); if (!q) { inp.focus(); return; }
    var nv = A.make(q.charAt(0).toUpperCase() + q.slice(1)); tab = 'all'; render(); OB.ui.side();
    OB.toast(OB.ui.ph('Making \u201c' + nv.title + '\u201d. It\'ll wait for your yes when it\'s ready.', 'Making it. It waits for your yes.'));
  });
  drawer.addEventListener('input', function (ev) {
    var f = ev.target.closest('[data-improve]'); if (f) { f.querySelector('button').disabled = !ev.target.value.trim(); }   // stays secondary: Approve is the one filled button
  });
  drawer.addEventListener('click', function (ev) {
    if (ev.target === drawer || ev.target.closest('[data-close]')) { close(); return; }
    var nxb = ev.target.closest('[data-open]'); if (nxb) { open(nxb.getAttribute('data-open')); return; }
    var ap = ev.target.closest('[data-approve]');
    if (ap) {
      // phones: the drawer keeps its scroll place, and a toast says it went through
      var ph = window.matchMedia('(max-width: 820px)').matches, bx = drawer.querySelector('.ob-drawer-box'), sc = bx ? bx.scrollTop : 0;
      A.approve(ap.getAttribute('data-approve')); open(ap.getAttribute('data-approve')); render(); OB.ui.side();
      // the inline note already says it went through; a toast (at the bottom) only when that note is off screen
      if (ph) {
        bx = drawer.querySelector('.ob-drawer-box'); if (bx) { bx.scrollTop = sc; }
        var nt = drawer.querySelector('.ob-dr-note'), nb = nt && nt.getBoundingClientRect();
        if (!nb || nb.bottom < 56 || nb.top > window.innerHeight) { OB.toast(A.st.paused ? OB.ui.ph('Approved. It goes out when you resume posting.', 'Approved. Posts when you resume.') : OB.ui.ph('Approved. Creators start posting it today.', 'Approved. Creators post it today.')); }
      }
      return;
    }
    var un = ev.target.closest('[data-unpost]');
    if (un) { A.unpost(un.getAttribute('data-unpost')); open(un.getAttribute('data-unpost')); render(); OB.ui.side(); }
  });
  drawer.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var id = ev.target.getAttribute('data-improve'), q = ev.target.querySelector('input').value.trim(); if (!q) { return; }
    A.improve(id); OB.toast(OB.ui.ph('Remade with your note: ' + q, 'Remade with your note.')); open(id); render(); OB.ui.side();
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && drawer.classList.contains('is-open')) { close(); } });
  document.addEventListener('ob:videos', function () { render(); OB.ui.side(); var h = window.location.hash.slice(1); if (h && drawer.classList.contains('is-open')) { open(h); } });

  render();
  if (window.location.hash.length > 1) { open(window.location.hash.slice(1)); }
})();
