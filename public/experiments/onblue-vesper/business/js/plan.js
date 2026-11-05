/* Plan: what BlueAI is running and what it costs. The budget reads like the
   homepage's pricing meter (one sentence that answers itself, the run's
   slider, a quiet dot field where each dot is 2,500 verified views: ink for views
   already paid for, grey for what the budget still buys, pale for room to
   raise it). Then the angles, the
   pace as one row, and the rules as a list, each with the face-off's yes dot. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  var main = document.querySelector('[data-main]');
  var MIN = 100, MAX = 5000, PER = 20;   // 250 dots of $20 (2,500 verified views), the $5,000 top end
  var PAUSED = 'Paused. No new videos go out; views on Shorts already live still count.';
  var PER_VIDEO_WEEK = 80;   // an estimate: a live video earns about $80 of verified views a week
  function lasts(budget, perWeek) { return Math.max(1, Math.round(budget / (perWeek * PER_VIDEO_WEEK))); }
  var yes = function (sm) { return '<span class="ob-yes' + (sm ? ' ob-yes--sm' : '') + '">' + OB.icon('check') + '</span>'; };

  function phone() { return window.matchMedia('(max-width: 700px)').matches; }
  function head(st) {
    // paused is said once, in the lede; the posting tag only shows while posting
    // (phones: a status line in both states, so the row keeps its shape)
    var act = (st.paused ? (phone() ? '<span class="ob-ap-tag ob-ap-tag--off">Paused</span>' : '') : '<span class="ob-ap-tag">Posting</span>') +
      '<button class="ob-btn' + (st.paused ? ' ob-btn--ink' : '') + '" type="button" data-pause>' + (st.paused ? 'Resume posting' : phone() ? 'Pause' : 'Pause posting') + '</button>';
    // paused swaps the lede line rather than adding one, so nothing on the page moves
    return '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Plan</h1><p class="ob-p-lede">' + (st.paused ? PAUSED : 'What BlueAI is running for ' + e(r.brand) + ', and what it costs.') + '</p></div><div class="ob-pg-act">' + act + '</div></header>';
  }
  function sect(t, note) { return '<div class="ob-p-sect"><h2 class="ob-p-h2">' + t + '</h2>' + (note ? '<span class="ob-p-note">' + note + '</span>' : '') + '</div>'; }

  function render() {
    // phones: half as many dots in five rows, each 5,000 verified views, so the field stays short
    var st = A.st, dots = '', paused = st.paused, k = A.kpis(), ph = phone(), per = ph ? PER * 2 : PER, n = MAX / per;
    for (var i = 0; i < n; i++) { dots += '<i></i>'; }
    main.innerHTML = head(st) +

      '<section class="ob-card ob-card--lit ob-pl-meter' + (paused ? ' is-paused' : '') + '"><div class="ob-pl-top"><div><p class="ob-pl-eq" data-eq></p>' +
      '<p class="ob-pl-sub" data-sub></p></div>' +
      '<div class="ob-pl-price"><span class="ob-p-figure">$8<small>per 1,000 verified views</small></span></div></div>' +
      '<input class="ob-range ob-pl-range" type="range" min="' + MIN + '" max="' + MAX + '" step="50" value="' + st.budget + '" aria-label="Budget in dollars" data-budget>' +
      '<div class="ob-pl-ends" aria-hidden="true"><span>$' + OB.fmt(MIN) + '</span><span>$' + OB.fmt(MAX) + '</span></div>' +
      '<div class="ob-pl-dots" aria-hidden="true" data-dots>' + dots + '</div>' +
      '<div class="ob-pl-key"><span><i class="is-spent"></i><b data-spent></b> spent</span><span><i class="is-on"></i><b data-left></b> left</span><span><i></i>Room to raise your budget</span><span class="ob-pl-unit">Each dot is ' + (ph ? '5,000' : '2,500') + ' verified views</span></div>' +
      '<ul class="ob-pl-terms"><li>' + yes() + 'No setup fee</li><li>' + yes() + 'No retainer</li><li>' + yes() + 'Charged only for views that happen</li></ul></section>' +

      '<section' + (paused ? ' class="ob-pl-dim"' : '') + '>' + sect('Video ideas BlueAI makes', paused ? 'These apply when you resume posting' : (window.matchMedia('(hover: none)').matches ? 'Tap' : 'Click') + ' an idea to turn it on or off') + '<div class="ob-pg-grid2">' +
      r.angles.map(function (a, i) {
        return '<div class="ob-pa' + (a.on ? '' : ' is-off') + '" data-angle="' + i + '" role="checkbox" tabindex="0" aria-checked="' + a.on + '">' +
          '<span class="ob-pa-mark">' + OB.icon('check') + '</span><span class="ob-pa-off">Off</span><small>' + e(a.who) + '</small><b>' + e(a.say) + '</b><span class="ob-chip">' + e(a.format) + '</span></div>';
      }).join('') + '</div></section>' +

      '<section' + (paused ? ' class="ob-pl-dim"' : '') + '>' + sect('Pace and rules') +
      '<div class="ob-card ob-pl-pacecard"><div><h3 class="ob-pg-h3">New videos a week</h3><p class="ob-pg-p">How many BlueAI makes for you each week.</p></div><div class="ob-picks ob-pl-pace" data-pace>' +
      [3, 5, 7, 10].map(function (n) { return '<button class="ob-pick" type="button" aria-pressed="' + (st.perWeek === n) + '" data-n="' + n + '" aria-label="' + n + ' a week">' + n + '<span class="ob-pl-aw"> a week</span></button>'; }).join('') + '</div></div>' +
      '<ul class="ob-card ob-pl-rules">' +
      '<li>' + yes() + '<div><b>You approve every video</b><span>Always on. Nothing posts without your yes.</span></div></li>' +
      '<li>' + yes() + '<div><b>' + (r.where === 'Worldwide' ? 'Buyers worldwide' : 'Buyers in ' + (r.where === 'United States' ? 'the United States' : r.where === 'UK' ? 'the UK' : e(r.where))) + '</b><span>Creators are matched to audiences where your buyers are. You pay only for verified views.</span></div></li>' +
      '<li><span class="ob-pl-where" aria-hidden="true">' + OB.icon('youtube', 14) + '</span><div><b>Where it posts</b><span class="ob-plats ob-pl-plats"><span class="ob-chip">' + OB.icon('youtube', 14) + 'YouTube Shorts</span><span class="ob-chip ob-chip--soon">TikTok' + (ph ? ' soon' : ', coming') + '</span><span class="ob-chip ob-chip--soon">Instagram' + (ph ? ' soon' : ', coming') + '</span></span></div></li>' +
      '</ul></section>';

    var range = main.querySelector('[data-budget]'), cells = main.querySelectorAll('[data-dots] i');
    var spent = k.spent, sub = main.querySelector('[data-sub]'), live = spent >= 1;
    var show = function () {
      var v = +range.value, sp = Math.min(v, spent), on = Math.round(v / per), used = Math.round(sp / per), cap = v / OB.RATE * 1000;
      // once money is going out, progress leads and the budget becomes the line under it
      if (live) {
        var perWeek = sp / Math.max(1, k.days) * 7, weeks = perWeek ? Math.max(0, Math.round((v - sp) / perWeek)) : 0;
        main.querySelector('[data-eq]').innerHTML = '<b>' + OB.fmt(k.views) + '</b> of <b>' + OB.fmt(cap) + '</b> verified views delivered';
        sub.textContent = 'Your $' + OB.fmt(v) + ' buys up to ' + OB.fmt(cap) + '. At this pace it lasts about ' + weeks + ' more week' + (weeks === 1 ? '' : 's') + '.';
      } else {
        var wk = lasts(v, st.perWeek);
        main.querySelector('[data-eq]').innerHTML = '<b>$' + OB.fmt(v) + '</b> pays for up to <b>' + OB.fmt(cap) + '</b> verified views';
        sub.textContent = '$' + OB.fmt(v) + ' in total, not monthly. At ' + st.perWeek + ' new videos a week it usually lasts about ' + wk + ' week' + (wk === 1 ? '' : 's') + ', an estimate.';
      }
      main.querySelector('[data-spent]').textContent = '$' + OB.fmt(sp);
      main.querySelector('[data-left]').textContent = '$' + OB.fmt(Math.max(0, v - sp));
      range.style.setProperty('--p', ((v - MIN) / (MAX - MIN) * 100) + '%');
      for (var j = 0; j < cells.length; j++) { cells[j].className = j < used ? 'is-spent' : j < on ? 'is-on' : ''; }
    };
    range.addEventListener('input', show);
    range.addEventListener('change', function () { st.budget = +range.value; st.budgetSet = true; r.budget = st.budget; A.save(); A.saveReport(); OB.ui.side(); OB.toast('Budget set to $' + OB.fmt(st.budget)); });
    show();
  }

  function toggle(a) {
    var x = r.angles[+a.getAttribute('data-angle')]; x.on = !x.on; A.saveReport(); a.classList.toggle('is-off', !x.on); a.setAttribute('aria-checked', String(x.on));
    var w = A.st.videos.some(function (v) { return v.angle === x.who && v.status === 'approve'; });
    var ph = OB.ui.ph;   // phones: one line at 360
    OB.toast(x.on ? ph(x.who + ' on. New ' + x.format.toLowerCase() + ' videos for them.', x.who + ' on. New videos for them.') :
      w ? ph(x.who + ' off. No new videos for them. The one waiting for your yes stays.', x.who + ' off. Its waiting video stays.') : ph(x.who + ' off. No new videos for them.', x.who + ' off. No new videos.'));
  }
  main.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-angle]');
    if (a) { toggle(a); return; }
    var p = ev.target.closest('[data-pace] [data-n]');
    if (p) {
      A.st.perWeek = r.perWeek = +p.getAttribute('data-n'); A.save(); A.saveReport(); render();
      var wk = lasts(A.st.budget, A.st.perWeek), sp = A.kpis().spent >= 1;
      OB.toast(OB.ui.ph(A.st.perWeek + ' new videos a week' + (sp ? '' : '. Your budget lasts about ' + wk + ' weeks now.'), A.st.perWeek + (sp ? ' new videos a week' : ' a week. Budget lasts about ' + wk + ' weeks.'))); return;
    }
    if (ev.target.closest('[data-pause]')) { A.st.paused = !A.st.paused; A.save(); render(); OB.ui.side(); OB.toast(A.st.paused ? 'Posting paused' : 'Posting resumed'); }
  });
  main.addEventListener('keydown', function (ev) {
    var a = ev.target.closest('[data-angle]');
    if (a && (ev.key === ' ' || ev.key === 'Enter')) { ev.preventDefault(); toggle(a); }
  });

  render();
})();
