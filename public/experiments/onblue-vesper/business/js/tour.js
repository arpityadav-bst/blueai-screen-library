/* The first-visit tour on Home (six tips, new sign-ups only): a thin volt
   ring around one thing at a time on an ink scrim, and a card beside it with
   a caret pointing at what it describes. The scrim is a real layer: it takes
   every click, so nothing behind it can be used while the tour is up, and a
   click on it ends the tour. Done once, replayable from the account menu.
   On phones the card docks above the tab bar (or at the top when the tab bar
   is the target). The card is measured against what is on screen, so Next
   and Skip never fall outside it. Exposes
   OB.tour.start(onDone): onDone runs once when the tour ends or is skipped. */
(function () {
  'use strict';
  var OB = window.OB;
  var TIPS = [
    ['[data-tour="needs"]', 'Your yes comes first', 'New videos wait here until you approve them. Watch one first if you like.'],
    ['[data-tour="prompt"]', 'Ask BlueAI', 'Ask for anything here: a new video, a new angle, a remix of a competitor.'],
    ['.ob-side-budget|[data-nav="plan"]', 'Your budget', 'Set it on Plan, with your pace. You pay $8 per 1,000 US views, nothing else.'],
    ['[data-nav="studio"]', 'Studio', 'Every video BlueAI makes. Ask for changes in plain words.'],
    ['[data-nav="brand"]', 'Brand', 'What BlueAI knows about you. Change it once and every video uses it.'],
    ['[data-nav="radar"]', 'Radar and Analytics', 'Radar watches your competitors every day. Analytics shows your views and what they cost.', '[data-nav="analytics"]']
  ];
  var GAP = 16;
  var ring, tip, scrim, at = 0, done = null, raf = 0;

  function phone() { return window.innerWidth < 640; }
  // the part of the page actually on screen (mobile toolbars, scrollbars excluded)
  function view() {
    var v = window.visualViewport, d = document.documentElement;
    return v ? { w: Math.min(v.width, d.clientWidth), h: v.height, top: v.offsetTop } : { w: d.clientWidth, h: d.clientHeight, top: 0 };
  }
  // the first selector, in the order listed, with a match on screen (the budget card is hidden on phones)
  function target() {
    var sels = TIPS[at][0].split('|');
    for (var k = 0; k < sels.length; k++) {
      var all = document.querySelectorAll(sels[k]);
      for (var i = 0; i < all.length; i++) {
        var b = all[i].getBoundingClientRect();
        if (b.width && b.height) {
          // on a phone a section taller than half the screen is shown by its first item, so the docked card never covers it
          var first = phone() && b.height > view().h * 0.45 ? all[i].querySelector('.ob-need, .ob-needs > *') : null;
          return first || all[i];
        }
      }
    }
    return null;
  }
  // the box the ring draws: the target, joined with a second one when the tip names two places
  function box(t) {
    var b = t.getBoundingClientRect(), two = TIPS[at][3] && document.querySelector(TIPS[at][3]);
    if (!two) { return b; }
    var c = two.getBoundingClientRect(); if (!c.width) { return b; }
    var l = Math.min(b.left, c.left), tp = Math.min(b.top, c.top), rt = Math.max(b.right, c.right), bt = Math.max(b.bottom, c.bottom);
    return { left: l, top: tp, right: rt, bottom: bt, width: rt - l, height: bt - tp };
  }

  function end() {
    OB.store('onblue-tour-done', 1);
    if (ring) { ring.remove(); tip.remove(); scrim.remove(); ring = tip = scrim = null; }
    window.removeEventListener('resize', queue);
    window.removeEventListener('scroll', queue, true);
    if (window.visualViewport) { window.visualViewport.removeEventListener('resize', queue); window.visualViewport.removeEventListener('scroll', queue); }
    document.removeEventListener('keydown', key);
    var cb = done; done = null;
    if (cb) { cb(); }
  }
  function queue() { if (!raf) { raf = window.requestAnimationFrame(function () { raf = 0; place(); }); } }

  function place() {
    if (!ring) { return; }
    var t = target(); if (!t) { end(); return; }
    // a tab in the phone's bottom bar: the ring sits inside the bar, never past the screen edge
    var nav = document.querySelector('.ob-side-nav'), fixedBar = nav && window.getComputedStyle(nav).position === 'fixed';
    var inBar = fixedBar && t.closest('.ob-side-nav');
    var b = box(t), PAD = inBar ? 0 : t.closest('.ob-side') ? 2 : 12;
    var rad = parseFloat(window.getComputedStyle(t).borderTopLeftRadius) || 10;
    var vp = view(), x0 = b.left - PAD, y0 = b.top - PAD, x1 = b.right + PAD, y1 = b.bottom + PAD;
    if (phone()) { x0 = Math.max(4, x0); x1 = Math.min(vp.w - 4, x1); y1 = Math.min(window.innerHeight - 4, y1); }
    ring.style.width = (x1 - x0) + 'px';
    ring.style.height = (y1 - y0) + 'px';
    ring.style.borderRadius = (inBar ? 12 : rad + PAD) + 'px';
    ring.style.transform = 'translate(' + x0 + 'px,' + y0 + 'px)';

    tip.classList.remove('is-right', 'is-below', 'is-above');
    if (phone()) { // docked: right above the tab bar (caret on the ringed tab when the bar is the target), or at the top for a low target
      tip.classList.add('is-docked'); tip.style.left = '';
      var barH = fixedBar ? nav.offsetHeight : 0;
      if (inBar) {
        tip.style.top = Math.max(vp.top + 12, vp.top + vp.h - barH - tip.offsetHeight - 12) + 'px';
        tip.classList.add('is-above');
        var tl = tip.getBoundingClientRect().left;
        tip.style.setProperty('--cx', Math.max(20, Math.min(tip.offsetWidth - 20, b.left + b.width / 2 - tl)) + 'px');
        return;
      }
      var low = b.top > vp.top + vp.h / 2;
      tip.style.top = (low ? vp.top + 72 : Math.max(vp.top + 12, vp.top + vp.h - barH - tip.offsetHeight - 12)) + 'px';
      return;
    }
    tip.classList.remove('is-docked');
    var side = 'is-below';
    var w = tip.offsetWidth, h = tip.offsetHeight, vw = vp.w, vh = vp.h, top, left;
    if (b.right + GAP + w < vw - GAP && b.width < vw / 3) { // beside a nav item
      left = b.right + PAD + GAP; top = b.top + b.height / 2 - 28; side = 'is-right';
    } else if (b.bottom + PAD + GAP + h < vh - GAP) { // below
      left = b.left; top = b.bottom + PAD + GAP;
    } else if (b.top - PAD - GAP - h > GAP) { // above
      left = b.left; top = b.top - PAD - GAP - h; side = 'is-above';
    } else { // a tall target: sit inside its lower edge
      left = b.right - w - GAP; top = vh - h - GAP; side = '';
    }
    left = Math.max(GAP, Math.min(left, vw - w - GAP)); top = Math.max(GAP, Math.min(top, vh - h - GAP));
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
    if (side) { tip.classList.add(side); } // the caret points at the target's middle
    // a target wider than the card: the caret sits near the card's left edge, over the target's start
    tip.style.setProperty('--cx', (b.width > w ? 32 : Math.max(20, Math.min(w - 20, b.left + b.width / 2 - left))) + 'px');
    tip.style.setProperty('--cy', Math.max(20, Math.min(h - 20, b.top + b.height / 2 - top)) + 'px');
  }

  function show() {
    var t = TIPS[at], el = target();
    if (!el) { end(); return; }
    var nav = el.closest('.ob-side-nav');
    if (nav && nav.scrollWidth > nav.clientWidth) { nav.scrollLeft = Math.max(0, el.offsetLeft - nav.clientWidth / 2 + el.offsetWidth / 2); }
    var b = el.getBoundingClientRect(), room = phone() ? view().h - 220 : view().h - 40;
    if (!el.closest(".ob-side") && (b.top < 72 || b.top > room * 0.6)) { window.scrollBy(0, b.top - (phone() ? 120 : 96)); }
    var last = at === TIPS.length - 1;
    var dots = TIPS.map(function (_, i) { return '<i' + (i === at ? ' class="is-on"' : i < at ? ' class="is-past"' : '') + '></i>'; }).join('');
    tip.innerHTML = '<b class="ob-tip-t">' + OB.esc(t[1]) + '</b><p>' + OB.esc(t[2]) + '</p>' +
      '<div class="ob-tip-act"><span class="ob-tip-dots" role="img" aria-label="' + (at + 1) + ' of ' + TIPS.length + '">' + dots + '</span><span class="ob-tip-n"></span>' +
      (last ? '' : '<button class="ob-btn ob-btn--sm ob-btn--ghost" type="button" data-tip-skip>Skip</button>') +
      '<button class="ob-btn ob-btn--sm ob-btn--ink" type="button" data-tip-next>' + (last ? OB.icon('check', 15) + 'Got it' : 'Next' + OB.icon('arrow', 15)) + '</button></div>';
    tip.classList.remove('is-in'); void tip.offsetWidth; tip.classList.add('is-in');
    place();
    tip.focus({ preventScroll: true });   // the card, not Next, so no focus ring shows on open; Tab reaches the buttons
  }

  function key(ev) {
    if (ev.key === 'Escape') { end(); return; }
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) { return; }
    if (ev.key === 'ArrowRight') { step(1); }
    if (ev.key === 'ArrowLeft' && at > 0) { step(-1); }
  }
  function step(d) { at += d; if (at >= TIPS.length) { end(); } else { show(); } }

  function start(onDone) {
    if (ring) { return; }
    at = 0; done = typeof onDone === 'function' ? onDone : null;
    var menu = document.querySelector('[data-menu].is-open'); if (menu) { menu.classList.remove('is-open'); }
    ring = document.createElement('div'); ring.className = 'ob-tip-ring';
    scrim = document.createElement('div'); scrim.className = 'ob-tip-scrim';
    scrim.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); end(); });
    tip = document.createElement('div'); tip.className = 'ob-tip'; tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-modal', 'true'); tip.setAttribute('aria-label', 'Tour of your dashboard'); tip.tabIndex = -1;
    document.body.appendChild(scrim); document.body.appendChild(ring); document.body.appendChild(tip);
    tip.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-tip-skip]')) { end(); }
      if (ev.target.closest('[data-tip-next]')) { step(1); }
    });
    window.addEventListener('resize', queue);
    window.addEventListener('scroll', queue, { passive: true, capture: true });
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', queue); window.visualViewport.addEventListener('scroll', queue); }
    document.addEventListener('keydown', key);
    show();
    // glide between tips only after the first placement, so the ring never sweeps in from the corner
    window.requestAnimationFrame(function () { if (ring) { ring.classList.add('is-moving'); } });
  }
  OB.tour = { start: start };
})();
