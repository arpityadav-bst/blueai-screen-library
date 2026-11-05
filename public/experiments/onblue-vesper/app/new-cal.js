/* New campaign: the Starts and Ends controls of step 2. PM's pattern from the
   old create flow (campaign.html dateQ, timeQ and its calendar), on the app's
   tokens: a spelled-out date button that opens a month calendar, and a time
   button that opens the day's half-hours, shown 12-hour. Both are one panel,
   fixed to the viewport so the scrolling form never clips it.
   The triggers carry data-k and data-v like every other control: a pick writes
   the trigger's value and fires an input event, so new.js binds, validates and
   autosaves it exactly as it does a typed field. */
(function () {
  'use strict';

  var A = window.onblueApp, N = window.onblueNew, U = window.onblueNewUI, esc = A.esc;
  var WK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var SV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICO = SV + ' class="nw-dtb-i" width="16" height="16" stroke-width="1.8"><rect x="3" y="5.5" width="18" height="15.5" rx="2.5"/><path d="M8 3v4.5M16 3v4.5M3 11h18"/></svg>';
  var CHEV = SV + ' class="nw-dtb-c" width="14" height="14" stroke-width="2"><path d="M6 9.5l6 6 6-6"/></svg>';
  var NAV = SV + ' width="16" height="16" stroke-width="2" style="transform:rotate(DEGdeg)"><path d="M6 9.5l6 6 6-6"/></svg>';

  var key = null, view = null, el = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoOf(x) { return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); }
  function dayKey(x) { return x.getFullYear() * 10000 + x.getMonth() * 100 + x.getDate(); }
  function day(v) { return N.at(v, '00:00'); }
  function isTime(k) { return /Time$/.test(k); }
  function trig(k) { return document.querySelector('[data-cal="' + k + '"]'); }
  function valOf(k) { var t = trig(k); return t ? t.value : ''; }

  // every half hour of the day, built rather than typed: 48 stops, stored 24-hour
  function stops() {
    var out = [];
    for (var m = 0; m < 1440; m += 30) { out.push(pad(Math.floor(m / 60)) + ':' + (m % 60 ? '30' : '00')); }
    return out;
  }

  function trigger(k, v, kind, bad) {
    var d = kind === 'date' && day(v), shown = kind === 'date' ? (d ? N.fmtDay(d) : 'Pick a day') : N.fmtTime(v) || 'Pick a time';
    var rule = k.replace(/(Date|Time)$/, '');
    return '<button class="nw-dtb nw-dtb--' + kind + (bad ? ' is-bad' : '') + '" type="button" id="f-' + k + '" data-cal="' + k + '"'
      + ' data-k="' + k + '" data-v="' + rule + '" value="' + esc(v || '') + '" aria-haspopup="dialog" aria-expanded="false"'
      + ' aria-labelledby="l-' + rule + ' v-' + k + '" aria-describedby="h-' + rule + '"' + (bad ? ' aria-invalid="true"' : '') + '>'
      + (kind === 'date' ? ICO : '')
      // the date leads with its icon, the time ends on a select's chevron: two kinds of answer, one row
      + '<span class="nw-dtb-v' + (v ? '' : ' is-ph') + '" id="v-' + k + '">' + esc(shown) + '</span>' + (kind === 'time' ? CHEV : '') + '</button>';
  }

  // one field: the label, the day and the time side by side, one help slot under both
  function field(key, label, b, err) {
    return '<div class="app-field" data-field="' + key + '">'
      + '<label class="label" id="l-' + key + '" for="f-' + key + 'Date"><span>' + label + '</span></label>'
      + '<div class="nw-dt">' + trigger(key + 'Date', b[key + 'Date'], 'date', err[key])
      + trigger(key + 'Time', b[key + 'Time'], 'time', false) + '</div>'
      + U.help(key, '', err[key]) + '</div>';
  }

  // Starts cannot be in the past; Ends cannot be before the day it starts
  function floor(k) {
    var now = new Date();
    if (k === 'startDate') { return new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
    return day(valOf('startDate')) || floor('startDate');
  }

  function close(focus) {
    if (!el) { return; }
    var t = trig(key);
    el.parentNode.removeChild(el);
    el = null; key = null; view = null;
    if (t) { t.setAttribute('aria-expanded', 'false'); if (focus) { t.focus(); } }
  }

  function open(k) {
    if (key === k) { close(true); return; }
    close(false);
    key = k;
    trig(k).setAttribute('aria-expanded', 'true');
    el = document.createElement('div');
    el.className = 'nw-cal' + (isTime(k) ? ' nw-cal--time' : '');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', isTime(k) ? 'Choose a time' : 'Choose a date');
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    paint(true);
  }

  function month() {
    if (view) { return view; }
    var base = day(valOf(key)) || floor(key);
    return new Date(base.getFullYear(), base.getMonth(), 1);
  }

  // the list opens centred on the time it holds, not at midnight
  function paintTime(first) {
    var cur = valOf(key);
    el.innerHTML = '<div class="nw-tm" role="listbox" aria-label="Times">' + stops().map(function (t) {
      return '<button class="nw-tm-o' + (t === cur ? ' is-on' : '') + '" type="button" role="option" aria-selected="' + (t === cur) + '" data-cal-pick="' + t + '">' + N.fmtTime(t) + '</button>';
    }).join('') + '</div>';
    if (!first) { return; }
    place();
    var list = el.querySelector('.nw-tm'), a = el.querySelector('.nw-tm-o.is-on') || el.querySelector('.nw-tm-o');
    list.scrollTop = Math.max(0, a.offsetTop - (list.clientHeight - a.offsetHeight) / 2);
    a.focus({ preventScroll: true });
  }

  function paint(first) {
    if (isTime(key)) { paintTime(first); return; }
    var m = month(), fl = dayKey(floor(key)), sel = day(valOf(key)), selK = sel ? dayKey(sel) : null, today = dayKey(new Date());
    var f1 = new Date(m.getFullYear(), m.getMonth(), 1), canBack = dayKey(new Date(m.getFullYear(), m.getMonth(), 0)) >= fl;
    var h = '<div class="nw-cal-head">'
      + '<button class="nw-cal-nav" type="button" aria-label="Previous month" data-cal-nav="-1"' + (canBack ? '' : ' disabled') + '>' + NAV.replace('DEG', '90') + '</button>'
      + '<span class="nw-cal-m">' + m.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) + '</span>'
      + '<button class="nw-cal-nav" type="button" aria-label="Next month" data-cal-nav="1">' + NAV.replace('DEG', '-90') + '</button></div>'
      + '<div class="nw-cal-wk" aria-hidden="true">' + WK.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div><div class="nw-cal-grid">';
    // 42 cells, always: the panel keeps its height from month to month
    var cells = [], auto = null, i;
    for (i = 0; i < 42; i++) {
      var x = new Date(f1.getFullYear(), f1.getMonth(), 1 - f1.getDay() + i), k = dayKey(x);
      cells.push({ d: x, k: k, off: k < fl, out: x.getMonth() !== m.getMonth() });
    }
    // focus lands on the chosen day, else today, else the month's first open day
    [function (c) { return c.k === selK; }, function (c) { return c.k === today && !c.out; }, function (c) { return !c.out; }].some(function (test) {
      var hit = cells.filter(function (c) { return !c.off && test(c); })[0];
      if (hit) { auto = hit.k; }
      return !!hit;
    });
    h += cells.map(function (c) {
      var cls = 'nw-cal-d' + (c.k === selK ? ' is-on' : c.out ? ' is-out' : c.k === today ? ' is-today' : '');
      return '<button class="' + cls + '" type="button"' + (c.off ? ' disabled' : '') + (c.k === auto ? ' data-auto' : '')
        + (c.k === selK ? ' aria-current="date"' : '') + ' aria-label="' + N.fmtDay(c.d) + '" data-cal-pick="' + isoOf(c.d) + '">' + c.d.getDate() + '</button>';
    }).join('');
    el.innerHTML = h + '</div>';
    if (first) { place(); }
    // every cell was replaced, so focus goes back onto one or the arrow keys die with it
    var a = el.querySelector('[data-auto]') || el.querySelector('.nw-cal-d:not(:disabled)');
    if (a) { a.focus({ preventScroll: true }); }
  }

  // measure, place, then reveal: below the trigger, above only if that is where it fits
  function place() {
    var t = el && trig(key);
    if (!t) { close(false); return; }
    var r = t.getBoundingClientRect(), GAP = 6, M = 8;
    if (isTime(key)) { el.style.width = r.width + 'px'; }
    var h = el.offsetHeight, w = el.offsetWidth;
    // the floor is the wizard's footer when there is one, so the panel never covers Back
    var foot = document.querySelector('.flow-foot'), floor = foot ? foot.getBoundingClientRect().top : window.innerHeight;
    var up = floor - r.bottom - GAP < h && r.top - GAP > h;
    el.style.left = Math.min(Math.max(M, r.left), Math.max(M, window.innerWidth - w - M)) + 'px';
    el.style.top = (up ? r.top - GAP - h : r.bottom + GAP) + 'px';
    el.style.visibility = 'visible';
  }

  function pick(v) {
    var t = trig(key);
    close(true);
    if (!t || t.value === v) { return; }
    t.value = v;
    var s = t.querySelector('.nw-dtb-v');
    s.textContent = isTime(t.dataset.cal) ? N.fmtTime(v) : N.fmtDay(day(v));
    s.classList.remove('is-ph');
    t.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // arrows rove: a grid on two axes, the time list on one; disabled days are walked past
  function keys(e) {
    var list = isTime(key), stepBy = list ? { ArrowDown: 1, ArrowUp: -1 }[e.key] : { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
    if (!stepBy) { return; }
    e.preventDefault();
    var all = Array.prototype.slice.call(el.querySelectorAll(list ? '.nw-tm-o' : '.nw-cal-d')), at = all.indexOf(document.activeElement);
    if (at < 0) { return; }
    for (var n = at + stepBy; n >= 0 && n < all.length; n += stepBy > 0 ? 1 : -1) {
      if (!all[n].disabled) { all[n].focus(); return; }
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null, x;
    if (!t) { return; }
    if ((x = t.closest('[data-cal]'))) { open(x.dataset.cal); return; }
    if ((x = t.closest('[data-cal-nav]'))) {
      var m = month();
      view = new Date(m.getFullYear(), m.getMonth() + Number(x.dataset.calNav), 1);
      paint(false);
      return;
    }
    if ((x = t.closest('[data-cal-pick]'))) { pick(x.dataset.calPick); }
  });
  document.addEventListener('keydown', function (e) {
    if (!el) { return; }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
    keys(e);
  }, true);
  document.addEventListener('pointerdown', function (e) {
    if (el && !el.contains(e.target) && !(e.target.closest && e.target.closest('[data-cal]'))) { close(false); }
  }, true);
  // the form scrolls inside .flow-main, and scroll does not bubble: listen in capture
  window.addEventListener('scroll', function () { if (el) { place(); } }, true);
  window.addEventListener('resize', function () { if (el) { place(); } });

  window.onblueNewCal = { field: field, close: close };
})();
