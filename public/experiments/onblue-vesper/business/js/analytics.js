/* Analytics: the daily views timeline Ashish asked for (2026-11-03). One
   column per day, the daily delta, split into new videos (3 days or younger)
   and older ones, so the long tail of old videos is visible. The totals read
   as one strip of figures, the chart is the lit panel, then every video's
   views with a share bar. */
(function () {
  'use strict';
  var OB = window.OB, A = OB.app, r = A.r, e = OB.esc;
  var main = document.querySelector('[data-main]');

  // the axis top rounds up in fifths, so its half is a clean label too (16K, 8K)
  function nice(v) { var s = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1)))); return Math.round(Math.ceil(v / s * 5) * s / 5); }
  function chart(days) {
    var W = 720, H = 240, n = days.length, gap = 14;
    var bw = (W - gap * (n - 1)) / n, top = nice(Math.max.apply(null, days.map(function (d) { return d.total; }).concat([1])));
    var y = function (v) { return v / top * H; };
    var bars = days.map(function (d, i) {
      var x = i * (bw + gap), ho = y(d.old), hf = y(d.fresh);
      return '<g data-day="' + i + '"><rect x="' + x + '" y="0" width="' + bw + '" height="' + H + '" rx="4" fill="transparent"/>' +
        '<rect x="' + x + '" y="' + (H - ho) + '" width="' + bw + '" height="' + ho + '" rx="4" fill="var(--an-old)"/>' +
        '<rect x="' + x + '" y="' + (H - ho - hf) + '" width="' + bw + '" height="' + Math.max(0, hf - 2) + '" rx="4" fill="var(--an-new)"/></g>';
    }).join('');
    // phones: every third day counted back from today, and Today ends on its bar's right edge (app-phone-2.css)
    var ph = window.matchMedia('(max-width: 700px)').matches;
    var labels = days.map(function (d, i) {
      var last = i === n - 1, skip = ph ? (n - 1 - i) % 3 !== 0 : (i % 2 && !last) || (!last && n - 1 - i < 2);
      var at = ph && last ? i * (bw + gap) + bw : i * (bw + gap) + bw / 2;
      return skip ? '' : '<span' + (last ? ' class="is-today"' : '') + ' style="left:' + (at / W * 100) + '%">' + (last ? 'Today' : d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) + '</span>';
    }).join('');
    return '<div class="ob-chart ob-an-chart"><div class="ob-an-grid" aria-hidden="true"><span><i>' + OB.short(top) + '</i></span><span><i>' + OB.short(top / 2) + '</i></span><span><i>0</i></span></div>' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Daily verified views">' + bars +
      '</svg><div class="ob-chart-x">' + labels + '</div><div class="ob-chart-tip" data-tip hidden></div></div>';
  }
  function head() {
    return '<header class="ob-p-head ob-pg-head"><div><h1 class="ob-p-title">Analytics</h1><p class="ob-p-lede">verified views by day, and what they cost. You pay $8 per 1,000 verified views.</p></div></header>';
  }

  function render() {
    var k = A.kpis(), days = A.timeline();
    var live = A.st.videos.filter(function (v) { return v.status === 'live'; }).sort(function (a, b) { return A.views(b) - A.views(a); });
    if (!live.length) {
      // what the user already did leads: videos approved and with creators, then anything still waiting
      var posting = A.st.videos.filter(function (v) { return v.status === 'posting'; }).length, w = k.waiting;
      var title = posting ? (posting === 1 ? '1 video is' : posting + ' videos are') + ' with creators now' : 'Your first views show up here the day creators post';
      var body = posting ? 'Their first verified views show up here within a day, and nothing is charged until they do.' + (A.st.paused ? ' Posting is paused, so they go out when you resume.' : '') :
        'Approve a video and creators start posting it on YouTube Shorts. Views usually show up within a day, and nothing is charged until they do.';
      var cta = w ? '<a class="ob-btn ob-btn--ink" href="studio.html">' + (w === 1 ? 'Review the 1 waiting' : 'Review the ' + w + ' waiting') + '</a>' : posting ? '<a class="ob-btn ob-btn--ink" href="studio.html">See them in Studio</a>' : '<a class="ob-btn ob-btn--ink" href="home.html">Back to Home</a>';
      main.innerHTML = head() + '<div class="ob-card ob-card--lit ob-pg-empty ob-an-empty"><div class="ob-an-ghost" aria-hidden="true">' + new Array(14).join('<i></i>') + '</div>' +
        '<b>' + title + '</b><p>' + body + '</p>' + cta +
        '<p class="ob-an-pace">At about ' + A.st.perWeek + ' new videos a week, this chart fills in day by day: videos posted in the last 3 days in green, older ones in grey.</p></div>';
      return;
    }
    // what only this page knows: how long the budget lasts at the pace so far (an estimate, and it says so)
    var weekly = k.spent / Math.max(1, k.days) * 7, weeks = weekly ? Math.round(k.left / weekly) : 0;
    var kp = [['verified views', OB.fmt(k.views)], ['Spent', '$' + OB.fmt(k.spent)], ['Budget lasts', '~' + weeks + '<small>weeks</small>'], ['Videos live', k.live], ['Creators who posted', k.creators]];
    var top = A.views(live[0]) || 1;
    // row costs add up to the Spent figure exactly by largest remainder: round
    // down, then hand the missing dollars to the rows with the biggest
    // fractions, so more views never shows a smaller cost
    var exact = live.map(function (v) { return A.views(v) / 1000 * OB.RATE; });
    var cost = exact.map(Math.floor), short = Math.round(k.spent) - cost.reduce(function (a, b) { return a + b; }, 0);
    exact.map(function (x, i) { return [x - Math.floor(x), i]; }).sort(function (a, b) { return b[0] - a[0]; })
      .forEach(function (p, j, all) {
        if (j < short) { cost[p[1]] += 1; }
        if (short < 0 && j >= all.length + short) { cost[p[1]] -= 1; }   // over by a dollar or two: take it from the smallest fractions
      });
    main.innerHTML = head() + '<div class="ob-card ob-an-strip">' + kp.map(function (x) { return '<div><small>' + x[0] + '</small><span class="ob-p-figure">' + x[1] + '</span></div>'; }).join('') + '</div>' +
      '<section class="ob-card ob-card--lit ob-an-panel"><div class="ob-an-head"><div><h2 class="ob-p-h2">Daily views</h2><span class="ob-p-note">Last ' + days.length + ' days, today so far</span></div>' +
      '<div class="ob-legend"><span><i style="background:var(--an-new)"></i>New, posted in the last 3 days</span><span><i style="background:var(--an-old)"></i>Older videos</span></div></div>' + chart(days) + '</section>' +
      '<section><div class="ob-p-sect"><h2 class="ob-p-h2">Every video</h2><span class="ob-p-note">' + live.length + ' live, most viewed first</span></div><div class="ob-table-wrap ob-an-table"><table class="ob-table"><thead><tr><th>Video</th><th>Posted</th><th>verified views</th><th>Cost</th></tr></thead><tbody>' +
      live.map(function (v, i) {
        var vw = A.views(v);
        return '<tr><td><a href="studio.html#' + v.id + '"><span class="ob-table-th"><img alt="" src="' + OB.film(v.film).poster + '"></span>' + e(v.title) + '</a></td><td>' + (v.ago === 0 ? 'Today' : v.ago === 1 ? 'Yesterday' : v.ago + ' days ago') +
          '</td><td><span class="ob-an-v"><span>' + OB.fmt(vw) + '</span><i><b style="width:' + Math.round(vw / top * 100) + '%"></b></i></span></td><td>$' + OB.fmt(cost[i]) + '</td></tr>';
      }).join('') + '</tbody><tfoot><tr><td>Total</td><td></td><td>' + OB.fmt(k.views) + '</td><td>$' + OB.fmt(Math.round(k.spent)) + '</td></tr></tfoot></table></div></section>';

    var tip = main.querySelector('[data-tip]'), box = main.querySelector('.ob-chart'), gs = main.querySelectorAll('[data-day]'), cur = null;
    // touch: the finger covers the column, so the picked day is written into the subtitle (no box over the bars, app-phone-2.css)
    var note = main.querySelector('.ob-an-head .ob-p-note'), noteTxt = note.textContent, coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    // touch: the whole plot is the target; a thumb scrubs across it and the nearest day shows
    if (window.matchMedia('(hover: none) and (pointer: coarse), (max-width: 700px)').matches) {
      var svg = box.querySelector('svg');
      var near = function (ev) {
        var s = svg.getBoundingClientRect(), i = Math.max(0, Math.min(gs.length - 1, Math.floor((ev.clientX - s.left) / s.width * gs.length)));
        if (gs[i] !== cur) { if (cur) { cur.dispatchEvent(new Event('mouseleave')); } cur = gs[i]; cur.dispatchEvent(new Event('mouseenter')); }
      };
      svg.addEventListener('pointerdown', near); svg.addEventListener('pointermove', near);
      document.addEventListener('pointerdown', function (ev) { if (cur && !svg.contains(ev.target)) { cur.dispatchEvent(new Event('mouseleave')); cur = null; } });
    }
    gs.forEach(function (g) {
      g.addEventListener('mouseenter', function () {
        var d = days[+g.getAttribute('data-day')], b = g.getBoundingClientRect(), c = box.getBoundingClientRect();
        tip.innerHTML = '<b>' + d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + '</b>' + OB.fmt(d.total) + ' views<br><small>' + OB.fmt(d.fresh) + ' new, ' + OB.fmt(d.old) + ' older</small>';
        tip.hidden = false;
        if (coarse) { note.textContent = d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · ' + OB.fmt(d.total) + ' views · ' + OB.fmt(d.fresh) + ' new'; }   // one line at 360, so the card never jumps
        // sit just above the hovered bar; a bar too tall for that gets the tip beside it, never over the legend
        var bt = Infinity; g.querySelectorAll('rect').forEach(function (x, j) { var q = x.getBoundingClientRect(); if (j && q.height > 0) { bt = Math.min(bt, q.top); } });
        if (bt === Infinity) { bt = b.bottom; }
        var mid = b.left - c.left + b.width / 2, top = bt - c.top - tip.offsetHeight - 10, W = tip.offsetWidth;
        if (top >= 0) { tip.style.left = Math.min(c.width - W, Math.max(0, mid - W / 2)) + 'px'; tip.style.top = top + 'px'; }
        else { tip.style.left = (mid + b.width / 2 + 8 + W < c.width ? mid + b.width / 2 + 8 : mid - b.width / 2 - 8 - W) + 'px'; tip.style.top = '0px'; }
        box.classList.add('is-hover'); g.classList.add('is-on');
      });
      g.addEventListener('mouseleave', function () { tip.hidden = true; box.classList.remove('is-hover'); g.classList.remove('is-on'); if (coarse) { note.textContent = noteTxt; } });
    });
  }

  render();
})();
