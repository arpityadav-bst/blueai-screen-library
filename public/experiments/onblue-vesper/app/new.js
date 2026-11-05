/* New campaign: the wizard itself. Owns which step is showing, the rail,
   the footer, binding every control to the brief, autosave and submit.
   Validation runs on blur and on Continue, never on a keystroke; a click on
   a chip or card is a finished answer, so it is checked straight away. */
(function () {
  'use strict';

  var A = window.onblueApp, D = window.onblueData, N = window.onblueNew, U = window.onblueNewUI;
  var S = window.onblueNewSteps, R = window.onblueNewReview, esc = A.esc;
  // indexed by step; the type is chosen before the form, in the type picker (type-picker.js)
  var RENDER = [null, S.promote, S.budget, R.where, R.review];
  var NEXT = [null, 'Continue to budget', 'Continue', 'Review campaign'];

  function $(s) { return document.querySelector(s); }

  // ---- state: resume a draft by its id, copy a campaign, or start one of a type ----
  var b = N.blank(), id = D.newId(), step = 1, seen = 1, stored = false, shown = {};
  (function load() {
    var q = new URLSearchParams(location.search), want = q.get('draft'), type = q.get('type');
    // ?from=<id>: a copy of that campaign, opened on its first step like a fresh draft
    var src = q.get('from') && D.find(q.get('from'));
    if (src) { b = N.fromCampaign(src); step = 1; seen = 1; return; }
    var d = want && D.drafts().filter(function (x) { return x.id === want; })[0];
    if (!d) { if (N.TYPES[type]) { N.setType(b, type); } return; }
    b = Object.assign(N.blank(), d.brief);
    id = d.id; stored = true;
    step = Math.max(1, Math.min(4, d.step || 1)); seen = Math.max(step, d.seen || 1);
    if (step === 4 && N.firstMissing(b)) { step = N.firstMissing(b).step; }
  })();
  /* NO CAMPAIGNS UNTIL THE AGENCY IS APPROVED (Appy, 2026-11-03, as on main):
     an agency in review is sent back to Campaigns, which says why */
  if (A.session.status === 'review') { location.replace('campaigns.html'); return; }
  // a draft saved while the app was YouTube only kept ['youtube'], so it reads as before
  b.platforms = (b.platforms || []).filter(function (p) { return N.PLATS[p]; });
  if (b.type === 'engagement' && b.platforms.length > 1) { b.platforms = b.platforms.slice(0, 1); }
  // no type named: the picker chooses one, over Campaigns. Phones keep the page,
  // which tells them to use a computer.
  if (!b.type) {
    if (window.matchMedia('(min-width: 640px)').matches) { location.replace('campaigns.html?new=1'); }
    return;
  }

  function visible() {
    var e = N.errors(b), out = {};
    Object.keys(shown).forEach(function (k) { if (e[k]) { out[k] = e[k]; } });
    return out;
  }

  // ---- autosave: every change, but only once the agency has typed something ----
  function save() {
    if (N.hasInput(b)) {
      D.saveDraft({ id: id, step: step, seen: seen, updatedAt: new Date().toISOString(), brief: b });
      if (!stored) { stored = true; history.replaceState(null, '', 'new.html?draft=' + id); }
    } else if (stored) {
      D.deleteDraft(id); stored = false; history.replaceState(null, '', 'new.html?type=' + b.type);
    }
  }

  /* ---- rail (240px, 1024 and up) and dashes (under 1024) ----
     Built once, then updated in place: a blur repaints the rail between a
     press and its release, and a rebuilt button would swallow that click. */
  function renderRail() {
    var allOk = !N.firstMissing(b), rail = $('#nw-rail');
    if (!rail.firstChild) {
      rail.innerHTML = '<ol class="app-steps">' + N.STEPS.map(function (name, i) {
        return '<li><button class="app-step" type="button" data-goto="' + (i + 1) + '"><span class="step-dot"></span>' + name + '</button></li>';
      }).join('') + '</ol>';
    }
    rail.querySelectorAll('[data-goto]').forEach(function (el) {
      var n = +el.dataset.goto, cur = n === step, locked = n === 4 && !allOk && !cur;
      var visited = !cur && n < 4 && n <= seen, ok = N.stepValid(b, n), done = visited && ok, warn = visited && !ok;
      el.className = 'app-step' + (cur ? ' is-current' : done ? ' is-done' : warn ? ' is-warn' : '');
      if (cur) { el.setAttribute('aria-current', 'step'); } else { el.removeAttribute('aria-current'); }
      if (locked) { el.setAttribute('aria-disabled', 'true'); } else { el.removeAttribute('aria-disabled'); }
      el.title = locked ? 'Finish steps 1 to 3 first.' : warn ? 'This step has something missing.' : '';
      var dot = done ? U.I.check12 : warn ? U.I.warn12 : locked ? U.I.lock12 : String(n), d = el.firstChild;
      if (d.innerHTML !== dot) { d.innerHTML = dot; }
    });
    $('#nw-dashes').innerHTML = N.STEPS.map(function (x, i) {
      var n = i + 1;
      return '<i class="' + (n === step ? 'on' : n < step ? 'done' : '') + '"></i>';
    }).join('') + '<span>Step ' + step + ' of 4 &middot; ' + N.STEPS[step - 1] + '</span>';
  }

  function renderFoot() {
    var m = N.firstMissing(b), next = $('#nw-next'), note = $('#nw-note'), bk = $('#nw-back');
    // step 1 is the first: the type is changed from its eyebrow, not by going back
    bk.hidden = step === 1;
    next.removeAttribute('aria-disabled');
    next.removeAttribute('title');
    note.textContent = '';
    if (step < 4) { next.textContent = NEXT[step]; return; }
    var bud = N.budgetOf(b);
    next.textContent = 'Submit for review' + (m && m.key === 'budget' ? '' : ', ' + N.money(bud) + ' budget');
    if (m) { next.setAttribute('aria-disabled', 'true'); next.title = m.text; note.textContent = m.text; }
    else { note.textContent = 'You pay only for what your campaign delivers.'; }
  }

  function render(focusSel) {
    $('#nw-step').innerHTML = RENDER[step](b, visible());
    renderRail();
    renderFoot();
    if (focusSel) { var f = $(focusSel); if (f) { f.focus(); } }
  }

  function go(n) {
    step = n; seen = Math.max(seen, n);
    render();
    save();
    $('#nw-main').scrollTop = 0;
    var h = $('.flow-title');
    if (h) { h.focus({ preventScroll: true }); }
  }

  // ---- one help slot per rule: show its error, or give the hint back ----
  function paint(v) {
    var slot = document.getElementById('h-' + v);
    if (!slot) { return; }
    var msg = shown[v] ? N.errors(b)[v] : '';
    var text = msg || slot.getAttribute('data-hint');
    slot.textContent = text;
    slot.hidden = !text;
    slot.classList.toggle('is-err', !!msg);
    document.querySelectorAll('[data-v="' + v + '"]').forEach(function (el) {
      el.classList.toggle('is-bad', !!msg && !/Time$/.test(el.getAttribute('data-k')));
      if (msg) { el.setAttribute('aria-invalid', 'true'); } else { el.removeAttribute('aria-invalid'); }
    });
    renderFoot();
    renderRail();
  }
  function check(v) {
    shown[v] = true;
    paint(v);
    if (v === 'start' && shown.end) { paint('end'); }
    if (v === 'budget' && shown.bid) { paint('bid'); }
    if (v === 'bid' && shown.budget) { paint('budget'); }
  }

  function focusField(k) {
    var box = document.querySelector('[data-field="' + k + '"]');
    var el = box && box.querySelector('input, textarea, select, button');
    if (el) { el.focus(); }
  }

  // Continue checks the whole step; on Review, the first gap is where it goes
  function next() {
    if (step < 4) {
      var e = N.stepErrors(b, step), keys = Object.keys(e);
      if (!keys.length) { go(step + 1); return; }
      keys.forEach(function (k) { shown[k] = true; });
      render();
      focusField(keys[0]);
      return;
    }
    var m = N.firstMissing(b);
    if (m) {
      Object.keys(N.stepErrors(b, m.step)).forEach(function (k) { shown[k] = true; });
      go(m.step);
      focusField(m.key);
      return;
    }
    submit();
  }

  // P12: no confirmation sheet. While the report is the PM's sample (campaign.html),
  // a submit lands on the list, where the new campaign leads, and says so
  function submit() {
    var btn = $('#nw-next');
    if (btn.getAttribute('aria-busy') === 'true') { return; }
    btn.style.width = btn.offsetWidth + 'px';
    btn.setAttribute('aria-busy', 'true');
    btn.innerHTML = '<span class="app-spin" aria-hidden="true"></span>Submitting…';
    setTimeout(function () {
      var row = N.toRow(b, D.newId());
      D.saveCampaign(row);
      D.deleteDraft(id);
      location.href = 'campaigns.html?submitted=1';
    }, 600);
  }

  // close saves and leaves; with nothing typed there is nothing to keep
  function close() {
    if (N.hasInput(b)) { save(); location.href = 'campaigns.html?saved=1'; return; }
    if (stored) { D.deleteDraft(id); }
    location.href = 'campaigns.html';
  }

  // Change, from the picker: a new type starts again from its first step
  function pickType(t) {
    if (t === b.type) { return; }
    var apply = function () {
      N.setType(b, t);
      shown = {};
      go(1);
    };
    if (b.type && b.type !== t && N.typeOwned(b)) {
      window.onblueConfirm({
        title: 'Switch to ' + N.TYPES[t].name + '?',
        body: t === 'growth' ? 'Your video, action and bid will be cleared.' : 'Your references and rate will be cleared.',
        keep: 'Keep ' + N.TYPES[b.type].name, go: 'Switch', onGo: apply
      });
      return;
    }
    apply();
  }

  // ---- events ----
  document.addEventListener('input', function (e) {
    var el = e.target, k = el.getAttribute && el.getAttribute('data-k');
    if (!k) { return; }
    b[k] = el.value;
    if (k === 'note') { $('#nw-count').textContent = el.value.length + '/500'; }
    if (/^(start|end)(Date|Time)$/.test(k)) { $('#nw-runs').textContent = S.runs(b); }
    if (el.hasAttribute('data-cal')) { check(el.getAttribute('data-v')); } // a pick is a finished answer
    save();
    if (step === 4) { renderFoot(); }
  });

  document.addEventListener('focusout', function (e) {
    var el = e.target, v = el.getAttribute && el.getAttribute('data-v');
    if (v && !el.hasAttribute('data-cal')) { check(v); } // the date and time panels check on pick
  });

  document.addEventListener('change', function (e) {
    var inp = e.target.closest && e.target.closest('[data-upload]');
    if (!inp) { return; }
    b.refsFiles = Array.prototype.map.call(inp.files || [], function (f) { return f.name; }).join(', ');
    save();
    render('[data-upload]');
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null, el;
    if (!t) { return; }
    if ((el = t.closest('[data-plat]'))) {
      var p = el.dataset.plat;
      if (b.type === 'growth') {
        // growth takes one or both, kept in YouTube, Instagram order
        b.platforms = N.PLAT_ORDER.filter(function (x) { return x === p ? b.platforms.indexOf(p) < 0 : b.platforms.indexOf(x) >= 0; });
      } else {
        b.platforms = [p];
        if (b.postUrl) { shown.postUrl = true; } // a pasted link is read again against the new platform
      }
      shown.platforms = true;
      save(); render('[data-plat="' + p + '"]');
      return;
    }
    if ((el = t.closest('[data-action]'))) {
      var a = el.dataset.action, on = b.actions.indexOf(a) >= 0;
      b.actions = N.ACTIONS.filter(function (x) { return x === a ? !on : b.actions.indexOf(x) >= 0; });
      shown.actions = true;
      save(); render('[data-action="' + a + '"]');
      return;
    }
    if ((el = t.closest('[data-budget]'))) {
      b.budgetPick = el.dataset.budget;
      if (b.budgetPick !== 'custom') { shown.budget = true; }
      save(); render(b.budgetPick === 'custom' ? '#f-budgetCustom' : '[data-budget="' + b.budgetPick + '"]');
      return;
    }
    if ((el = t.closest('[data-market]'))) { b.market = el.dataset.market; save(); render('[data-market="' + el.dataset.market + '"]'); return; }
    if ((el = t.closest('[data-goto]'))) { if (el.getAttribute('aria-disabled') !== 'true') { go(+el.dataset.goto); } return; }
    if (t.closest('[data-act="change-type"]')) { window.onblueTypePicker({ selected: b.type, onPick: pickType }); return; }
    if (t.closest('#nw-back')) { go(step - 1); return; }
    if (t.closest('#nw-close')) { close(); return; }
    if (t.closest('[data-copy-link]')) {
      try { navigator.clipboard.writeText(location.href).catch(function () {}); } catch (err) { /* the toast still confirms the ask */ }
      A.toast('Link copied');
    }
  });

  // Enter in a field moves on, like any form; the primary is the submit button
  $('#nw-form').addEventListener('submit', function (e) { e.preventDefault(); next(); });

  render();
})();
