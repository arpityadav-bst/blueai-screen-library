/* The agent run: plays OB.STEPS one at a time. Each step ticks through its
   checklist while BlueAI asks a quick question or shows a proof card, then
   shows its result and adds what it learned to the left column. Sign-up comes
   last, only when you want to keep the report (Appy: sign up afterwards). */
(function () {
  'use strict';
  var OB = window.OB, e = OB.esc, STEPS = OB.STEPS;

  // where the run came from: the website field, the three questions, or ?site=
  var input = null;
  try { input = JSON.parse(OB.sess('onblue-run-input') || 'null'); } catch (err) { input = null; }
  var qs = new URLSearchParams(window.location.search);
  if (!input && qs.get('site')) { input = { site: qs.get('site') }; }
  var r = input ? OB.report.make(input) : OB.report.get();
  if (!r) { window.location.replace('./'); return; }
  OB.sess('onblue-run-input', null);
  // ?resume=1 (app home's "Continue my report"): pick up at the first step not
  // finished (r.done), already saved when the account exists
  var resume = !input && qs.get('resume') === '1';

  var stage = document.querySelector('[data-stage]'), facts = document.querySelector('[data-facts]');
  var stepper = document.querySelector('[data-stepper]'), stepnow = document.querySelector('[data-stepnow]');
  var count = document.querySelector('[data-facts-count]');
  var knows = document.querySelector('.ob-knows'), saveBtn = document.querySelector('[data-save]');
  var bar = document.querySelector('.ob-runbar');
  // ticked: checklist lines done in the step at work; saved: signed up mid-run
  var at = 0, done = resume ? Math.max(0, Math.min(STEPS.length, r.done | 0)) : 0, ticked = 0, timers = [];
  var saved = resume && !!(r.email && OB.store('onblue-app-stage')), order = [], shownSet = {};
  var api = {
    save: function () { OB.report.save(r); backLabel(); },
    saved: function () { return saved; },
    facts: renderFacts,
    redo: function () { show(at, true); },
    next: function () { go(at + 1); },
    is: function (k) { return STEPS[at].key === k; },
    toast: toast
  };

  // the toast sits at the foot of the main column (run.css); when that would
  // cover a button (on a phone, the full-width step CTA) it drops in under the bar
  function toast(msg) {
    OB.toast(msg);
    var t = document.querySelector('.ob-toast'); if (!t) { return; }
    t.style.top = ''; t.style.bottom = '';
    var tr = t.getBoundingClientRect();
    var hit = Array.prototype.some.call(stage.querySelectorAll('button, input, a, textarea'), function (b) {
      var br = b.getBoundingClientRect();
      return br.bottom > tr.top - 24 && br.top < tr.bottom + 12 && br.right > tr.left && br.left < tr.right;
    });
    if (!hit) { return; }
    // on a phone the brand row sits under the bar: drop in under it, so the
    // toast never covers the "What BlueAI knows" toggle (once it scrolls away, under the bar)
    var top = bar.getBoundingClientRect().bottom, kb = knows.getBoundingClientRect().bottom;
    if (window.innerWidth <= 860 && kb > top && kb < window.innerHeight / 2) { top = kb; }
    t.style.top = (top + 12) + 'px'; t.style.bottom = 'auto';
  }
  // the bar lifts off the page once it scrolls, so nothing reads as cut under it
  window.addEventListener('scroll', function () { bar.classList.toggle('is-scrolled', window.scrollY > 4); }, { passive: true });

  // left column: the brand, then everything learned so far
  // no website: "Your brand" until a name is given, and "No website" stays in
  // view, joined by the category once BlueAI has placed you in one
  var head = document.querySelector('[data-knows-head]'), catKnown = false;
  function renderHead() {
    var mark = r.site ? '<img alt="" src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(r.site) + '&sz=128">' : r.brand === 'Your brand' ? OB.icon('brand', 20) : e(r.initial);
    head.innerHTML = '<span class="ob-knows-fav">' + mark + '</span><span><b>' + e(r.brand) + '</b><small>' + (r.site ? e(r.site) : 'No website' + (catKnown ? ' &middot; ' + e(r.category) : '')) + '</small></span>';
    var img = head.querySelector('img');
    // no icon, or only a tiny one (Google's 16px default globe for unknown sites, stretched
    // and blurry): the brand's initial instead (Appy: "why the favicons so blurry?")
    if (img) { img.onerror = function () { img.parentNode.textContent = r.initial; }; img.onload = function () { if (img.naturalWidth < 32 && img.parentNode) { img.parentNode.textContent = r.initial; } }; }
  }
  renderHead();

  // on a phone the facts fold into one row that opens on tap (run.css)
  var fold = document.querySelector('[data-knows-toggle]');
  if (fold) { fold.addEventListener('click', function () { var o = knows.classList.toggle('is-open'); fold.setAttribute('aria-expanded', String(o)); }); }

  // facts keep the order they first arrived in; only ones not shown before rise in
  // (the budget slider re-renders often). Only the list scrolls, so the brand,
  // the heading and the count stay put; f[2] flags a row 'guess' and/or 'dim'
  function renderFacts() {
    var list = [];
    for (var i = 0; i < done; i++) { list = list.concat(STEPS[i].facts(r, i === at)); }
    if (at >= done && STEPS[at].live) { list = list.concat(STEPS[at].live(r, ticked)); }
    list.forEach(function (f) { if (order.indexOf(f[0]) < 0) { order.push(f[0]); } });
    list.sort(function (a, b) { return order.indexOf(a[0]) - order.indexOf(b[0]); });
    var fresh = 0;
    facts.innerHTML = list.length ? list.map(function (f) {
      var isNew = !shownSet[f[0]]; if (isNew) { fresh++; }
      var fl = f[2] || '';
      return '<li class="ob-fact' + (isNew ? ' is-new' : '') + (/dim/.test(fl) ? ' is-dim' : '') + '"><span>' + e(f[0]) + (/guess/.test(fl) ? ' <em class="ob-guess">my guess</em>' : '') + '</span><b>' + e(f[1]) + '</b></li>';
    }).join('') : '<li class="ob-knows-empty">Everything BlueAI learns shows up here as it works.</li>';
    shownSet = {}; list.forEach(function (f) { shownSet[f[0]] = true; });
    if (count) { count.textContent = list.length; count.hidden = !list.length; }
    var cat = list.some(function (f) { return f[0] === 'Category'; });
    if (cat !== catKnown) { catKnown = cat; renderHead(); }
    var first = facts.querySelector('.is-new');
    if (fresh && first && window.innerWidth > 860 && facts.scrollHeight > facts.clientHeight) {
      var want = Math.min(first.offsetTop, facts.scrollHeight - facts.clientHeight);
      if (want > facts.scrollTop) { facts.scrollTo({ top: want, behavior: 'smooth' }); }
    }
    moreCue();
  }
  // soft fades inside the card while rows sit above or below its edges
  function moreCue() {
    facts.classList.toggle('has-more', facts.scrollTop + facts.clientHeight < facts.scrollHeight - 8);
    facts.classList.toggle('has-above', facts.scrollTop > 4);
  }
  facts.addEventListener('scroll', moreCue, { passive: true });
  window.addEventListener('resize', moreCue);

  function renderStepper() {
    stepper.innerHTML = STEPS.map(function (s, i) {
      var ok = i < done && i !== at;
      return '<li class="' + (i === at ? 'is-now' : i < done ? 'is-done' : '') + '"' + (i === at ? ' aria-current="step"' : '') + (ok ? ' title="Back to ' + e(s.label) + '" aria-label="Go to step ' + (i + 1) + ': ' + e(s.label) + '"' : '') +
        '><i>' + (ok ? OB.icon('check', 12) : i + 1) + '</i><span>' + e(s.label) + '</span></li>';
    }).join('');
    if (stepnow) { stepnow.innerHTML = '<b>' + e(STEPS[at].label) + '</b> &middot; step ' + (at + 1) + ' of ' + STEPS.length; }
    // the bar's save keeps its slot (nothing shifts) and fades in from step 3,
    // "What wins", the first thing worth an email (Appy: on step 1 there is
    // nothing to save yet); once reached it stays to the last step, the plan
    // included (Appy), and when going back
    saveBtn.classList.toggle('is-hidden', !(saved || Math.max(at, done - 1) >= 2));   // done counts a step once its result shows, so step 2's list made it 2: the step reached is done - 1
    saveBtn.disabled = saved;
    saveBtn.innerHTML = saved ? OB.icon('check', 14) + 'Saved' : 'Save my report';
  }

  function aside(a, step) {
    if (!a) { return ''; }
    if (a.kind === 'proof') { return '<div class="ob-aside ob-card ob-card--float ob-proofcard">' + (a.big ? '<b>' + e(a.big) + '</b>' : '') + '<span>' + e(a.say) + '</span></div>'; }
    var body = a.kind === 'text'
      ? '<form class="ob-aside-row" data-ask><input class="ob-input" placeholder="' + e(a.ph) + '" aria-label="' + e(a.q) + '"><button class="ob-btn ob-btn--ink" type="submit">Next</button></form>'
      : '<div class="ob-picks" data-ask>' + a.picks.map(function (p) { return '<button class="ob-pick" type="button" aria-pressed="false">' + e(p) + '</button>'; }).join('') + '</div>';
    return '<div class="ob-aside ob-card ob-card--float" data-aside="' + step + '"><h3>' + e(a.q) + '</h3>' + body +
      '<button class="ob-link ob-aside-skip" type="button" data-skip>Skip for now</button></div>';
  }

  // the quick questions, one after another, answered or skipped
  function ask(step, n) {
    var list = typeof step.asks === 'function' ? step.asks(r) : step.asks;
    var box = stage.querySelector('[data-asks]'), a = list[n];
    // a proof card only fills the wait: once the result is up, it has nothing to fill
    box.innerHTML = a && a.kind === 'proof' && done > at ? '' : aside(a, n);
    if (!a || a.kind === 'proof') { return; }
    var answer = function (v) {
      if (v) {
        r[a.key] = v;
        if (a.key === 'brand') { r.brand = v; r.initial = v.charAt(0).toUpperCase(); renderHead(); }
        api.save(); renderFacts();
        // answered after the result showed: the heading picks it up
        var sy = done > at && stage.querySelector('.ob-say'); if (sy) { sy.outerHTML = say(STEPS[at].done(r)); }
      }
      ask(step, n + 1);
    };
    var el = box.querySelector('[data-ask]');
    if (a.kind === 'text') {
      el.querySelector('input').focus({ preventScroll: true });
      el.addEventListener('submit', function (ev) { ev.preventDefault(); answer(el.querySelector('input').value.trim()); });
    } else {
      el.addEventListener('click', function (ev) { var p = ev.target.closest('.ob-pick'); if (p) { p.setAttribute('aria-pressed', 'true'); window.setTimeout(function () { answer(p.textContent); }, 220); } });
    }
    box.querySelector('[data-skip]').addEventListener('click', function () { answer(''); });
  }

  // lines[2], when given, is the one word of the heading in the homepage halftone
  function say(lines) {
    var h = e(lines[0]), w = lines[2] ? e(lines[2]) : '', k = w ? h.indexOf(w) : -1;
    if (k >= 0) { h = h.slice(0, k) + '<span class="ob-tone">' + w + '</span>' + h.slice(k + w.length); }
    return '<div class="ob-say">' + OB.agent() + '<div><h1>' + h + '</h1><p>' + e(lines[1]) + '</p></div></div>';
  }

  // instant = re-render the result only (after an edit like adding a rival)
  function show(i, instant) {
    var s = STEPS[i];
    if (instant) { result(s); return; }
    timers.forEach(window.clearTimeout); timers = []; ticked = 0;
    stage.innerHTML = say(s.say(r)) + '<div class="ob-workbox" data-work><div class="ob-workbar"><span data-bar></span></div><ul class="ob-work">' +
      (typeof s.work === 'function' ? s.work(r) : s.work).map(function (w) { return '<li><i></i><span>' + e(w) + '</span></li>'; }).join('') + '</ul></div><div data-asks></div><div data-out></div>';
    ask(s, 0);
    var items = stage.querySelectorAll('[data-work] li'), wbar = stage.querySelector('[data-bar]'), t = 0;
    items.forEach(function (li, k) {
      timers.push(window.setTimeout(function () {
        li.className = 'is-now';
        if (k) { items[k - 1].className = 'is-done'; items[k - 1].querySelector('i').innerHTML = OB.icon('check', 12); ticked = k; renderFacts(); }
        // the line fills as lines tick, never ahead of the list
        wbar.style.transform = 'scaleX(' + (k / items.length) + ')';
      }, t));
      t += 700 + (OB.hash(r.brand + i + k) % 500);
    });
    timers.push(window.setTimeout(function () {
      var w = stage.querySelector('[data-work]'); if (w) { w.remove(); }
      // a proof card only fills the wait; an unanswered question stays
      var ab = stage.querySelector('[data-asks]'); if (ab && ab.querySelector('.ob-proofcard')) { ab.innerHTML = ''; }
      stage.querySelector('.ob-say').outerHTML = say(s.done(r));
      // progress for the app: how far the report got, saved with it
      if (done < i + 1) { done = i + 1; }
      r.done = Math.max(r.done | 0, done); api.save();
      renderStepper(); renderFacts(); result(s);
    }, t));
  }

  function result(s) {
    // a fresh node each time, so a re-render never stacks a second set of listeners
    var old = stage.querySelector('[data-out]'), out = old.cloneNode(false);
    old.parentNode.replaceChild(out, old);
    out.className = 'ob-out';
    // a finished step you came back to: the button returns you to where you were
    var back = Math.min(done, STEPS.length - 1), isBack = back > at && done > at + 1;
    var label = isBack ? backText() : typeof s.next === 'function' ? s.next(r) : s.next;
    out.innerHTML = s.result(r, api) + (label ? '<div class="ob-next"><button class="ob-btn ob-btn--ink" type="button" data-next' + (isBack ? ' data-back' : '') + '>' + e(label) + ' ' + OB.icon('arrow', 16) + '</button></div>' : '');
    if (s.bind) { s.bind(out, r, api); }
    var nb = out.querySelector('[data-next]'); if (nb) { nb.addEventListener('click', function () { go(isBack ? back : at + 1); }); }
  }

  function go(i) {
    if (i >= STEPS.length) { return; }
    at = i; timers.forEach(window.clearTimeout); timers = [];
    var t = document.querySelector('.ob-toast'); if (t) { t.classList.remove('is-on'); }
    renderStepper(); renderFacts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (i < done) { revisit(i); } else { show(i); }
  }
  // a step you came back to says "Update" only once something changed
  var snap = null;
  function backText() { return (snap === null || JSON.stringify(r) === snap ? 'Back to ' : 'Update and back to ') + STEPS[Math.min(done, STEPS.length - 1)].label.toLowerCase(); }
  function backLabel() { var nb = stage.querySelector('[data-back]'); if (nb) { nb.innerHTML = e(backText()) + ' ' + OB.icon('arrow', 16); } }
  function revisit(i) { snap = null; stage.innerHTML = say(STEPS[i].done(r)) + '<div data-asks></div><div data-out></div>'; result(STEPS[i]); snap = JSON.stringify(r); backLabel(); }

  // jump back to a finished step from the stepper
  stepper.addEventListener('click', function (ev) {
    var li = ev.target.closest('li'); if (!li) { return; }
    var i = Array.prototype.indexOf.call(stepper.children, li);
    if (i < done && i !== at) { go(i); }
  });

  // sign-up: one rule with sign-in, any valid email (work or personal). Google
  // never makes an address up: it asks which Google account, and uses that one.
  // Before the run is finished it saves and BlueAI keeps going; at the end it opens the app.
  var modal = document.querySelector('[data-signup-modal]'), suT = modal.querySelector('#ob-su-t');
  var suIn = modal.querySelector('#ob-su-email'), suErr = modal.querySelector('[data-su-err]'), suMode = '';
  var google = modal.querySelector('[data-google]'), orLine = modal.querySelector('[data-su-or]');
  var suSub = modal.querySelector('[data-su-sub]'), suLabel = modal.querySelector('.ob-signup-label'), suGo = modal.querySelector('[data-email-form] button');
  function isEmail(v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }
  function err(msg) { suErr.textContent = msg; suErr.hidden = !msg; suIn.classList.toggle('is-bad', !!msg); }
  function openSignup(mode, viaGoogle) {
    suMode = mode || '';
    suT.textContent = viaGoogle ? 'Continue with Google' : mode === 'start' ? 'Save your report and start' : 'Save your report';
    suSub.textContent = viaGoogle ? 'Which Google account should onBlue use?' : mode === 'start' ? 'Free to save. Your budget is set to $' + OB.fmt(r.budget) + ', and you only ever pay $8 per 1,000 US views that happen.' : 'Free, and it picks up right where BlueAI left off.';
    google.hidden = !!viaGoogle; orLine.hidden = !!viaGoogle;
    suLabel.textContent = viaGoogle ? 'Google account email' : 'Email';
    suGo.textContent = viaGoogle ? 'Continue' : 'Continue with email';
    suIn.value = r.email || ''; err('');
    modal.classList.add('is-open');
    var target = suIn.value ? suGo : suIn;
    if (window.innerWidth > 860 || suIn.value) { window.setTimeout(function () { target.focus({ preventScroll: true }); }, 60); }
  }
  function closeSignup() { modal.classList.remove('is-open'); modal.style.bottom = ''; }
  // iOS keeps the layout viewport under the keyboard: lift the phone's bottom
  // sheet to sit on top of it (Android resizes, see the viewport meta)
  var vv = window.visualViewport;
  if (vv) {
    var lift = function () { modal.style.bottom = modal.classList.contains('is-open') && window.innerWidth <= 860 ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) + 'px' : ''; };
    vv.addEventListener('resize', lift); vv.addEventListener('scroll', lift);
  }
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { closeSignup(); } });
  modal.addEventListener('click', function (ev) { if (ev.target === modal || ev.target.closest('[data-close]')) { closeSignup(); } });
  function finish(email) {
    r.email = email; api.save();
    OB.sess('onblue:signedin', '1'); OB.sess('onblue:email', email); OB.sess('onblue:site', r.site || '');
    OB.sess('onblue:agency', r.brand); OB.sess('onblue:agency-status', 'approved');
    if (suMode !== 'start' && done < STEPS.length) {
      saved = true; closeSignup(); renderStepper();
      toast('Saved to ' + email);
      return;
    }
    OB.store('onblue-tour-done', null); OB.store('onblue-app-stage', 'new'); OB.store('onblue-app-new', null); OB.store('onblue-app-running', null);
    window.location.href = 'app/home.html?welcome=1';
  }
  api.signup = function (mode) { if (saved && mode === 'start') { suMode = 'start'; finish(r.email); } else { openSignup(mode); } };
  // Google's own chooser in a popup (js/google.js); the in-page form only if the popup is blocked
  google.addEventListener('click', function () {
    OB.google(r.email || r.mailed || '', function (email) { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { finish(email); } }, function () { openSignup(suMode, true); });
  });
  suIn.addEventListener('input', function () { err(''); });
  modal.querySelector('[data-email-form]').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = suIn.value.trim();
    if (!isEmail(v)) { err('That doesn\'t look like an email yet.'); suIn.focus(); return; }
    finish(v);
  });
  saveBtn.addEventListener('click', function () { if (!saved) { openSignup(); } });

  renderFacts(); go(resume ? Math.min(done, STEPS.length - 1) : 0);
})();
