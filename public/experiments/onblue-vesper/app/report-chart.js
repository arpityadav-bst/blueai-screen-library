/* Campaign report, part 5: the two charts. Plain SVG, coloured by CSS classes
   so every colour stays a token (report-tiles.css / report-detail.css).
   cumSvg:  the lead tile's small running total, start to end.
   line:    the detail chart, one metric over the range, with a hover readout.
   Both are drawn at about their real pixel width, so axis text stays 12px on a
   phone instead of being scaled down with a fixed viewBox. */
(function () {
  'use strict';

  var R = window.onblueRep, U = R.ui;

  function niceMax(v) {
    var raw = Math.max(1, v) / 4, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).filter(function (s) { return s >= raw; })[0];
    return step * 4;
  }
  function path(pts, x, y) {
    return pts.map(function (p, j) { return (j ? 'L' : 'M') + x(p[0]).toFixed(1) + ' ' + y(p[1]).toFixed(1); }).join(' ');
  }

  /* x is in days from the campaign's first midnight. A live campaign's last
     point sits at "now", part way through today, so the line ends where the
     time does. */
  function actual(M, cum) {
    var out = [[(M.start - M.day0) / R.DAY, 0]];
    cum.forEach(function (v, k) { out.push([k === cum.length - 1 && M.live ? k + M.partial : k + 1, v]); });
    return out;
  }

  /* The lead tile's small picture: the running total from the start to now,
     on an axis that runs to the end date, so the time still to go is visible.
     No target or reference line: the Fill figure above it says how far along. */
  R.cumSvg = function (M, X, label) {
    var host = document.getElementById('report'), room = host ? host.clientWidth - 40 : 600;
    var W = Math.max(280, Math.min(600, room || 600)), H = W < 420 ? 112 : 128, L = 4, Rr = 4, T = 12, B = 26;
    var span = (M.end - M.day0) / R.DAY;
    var mine = actual(M, X.cum), last = mine[mine.length - 1];
    var yMax = niceMax(Math.max(1, last[1]) * 1.05);
    var x = function (d) { return L + (W - L - Rr) * d / span; };
    var y = function (v) { return T + (H - T - B) * (1 - v / yMax); };
    var x0 = (M.start - M.day0) / R.DAY;
    var area = path(mine, x, y) + ' L' + x(last[0]).toFixed(1) + ' ' + y(0) + ' L' + x(x0).toFixed(1) + ' ' + y(0) + ' Z';
    var grid = [0, 0.5, 1].map(function (f) {
      var yy = y(yMax * f).toFixed(1);
      return '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + yy + '" y2="' + yy + '"/>';
    }).join('');
    var nowX = x(last[0]);
    var labels = '<text x="' + L + '" y="' + (H - 6) + '">' + U.dayF(M.start) + '</text>'
      + '<text x="' + (W - Rr) + '" y="' + (H - 6) + '" text-anchor="end">' + U.dayF(M.end) + '</text>'
      + (M.live && nowX > 70 && nowX < W - 70 ? '<text x="' + nowX.toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">Today</text>' : '');
    return '<svg class="rp-spark" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + U.esc(label) + '">'
      + '<g class="rp-grid">' + grid + '</g>'
      + (M.live ? '<line class="rp-spark-now" x1="' + nowX.toFixed(1) + '" x2="' + nowX.toFixed(1) + '" y1="' + T + '" y2="' + (H - B) + '"/>' : '')
      + '<path class="rp-area" d="' + area + '"/>'
      + '<path class="rp-line" d="' + path(mine, x, y) + '"/>'
      + '<circle class="rp-dot" cx="' + nowX.toFixed(1) + '" cy="' + y(last[1]).toFixed(1) + '" r="4"/>'
      + '<g class="rp-axis">' + labels + '</g></svg>';
  };

  /* pts: [{ k, v, inc }]; fmt(v) for the axis and readout; unit for the readout;
     ref: optional { v, label }, a dashed reference line (the budget, on Spend) */
  R.line = function (host, M, pts, fmt, unit, ref) {
    var W = Math.max(300, Math.round(host.clientWidth) || 960), H = W < 600 ? 220 : 280, Rr = 16, T = 16, B = 32;
    if (pts.length === 1) {   // one day on its own still reads as a line, start of day to end
      pts = [{ k: pts[0].k, v: 0, inc: null, start: true }, pts[0]];
    }
    var n = pts.length, lastV = pts[n - 1].v, yMax = niceMax(Math.max(lastV, ref ? ref.v : 0)), k;
    // the gutter is as wide as the longest axis label (about 7px a character at 12px), never clipping "$200"
    var ticks = [0, 1, 2, 3, 4].map(function (i) { return i ? fmt(yMax * i / 4, true) : '0'; });
    var L = 14 + 7 * Math.max.apply(null, ticks.map(function (t) { return String(t).length; }));
    var x = function (j) { return L + (W - L - Rr) * j / (n - 1); };
    var y = function (v) { return T + (H - T - B) * (1 - v / yMax); };
    var grid = '', labels = '';
    for (k = 0; k <= 4; k++) {
      var yy = y(yMax * k / 4).toFixed(1);
      grid += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + yy + '" y2="' + yy + '"/>';
      labels += '<text x="' + (L - 10) + '" y="' + (+yy + 4) + '" text-anchor="end">' + ticks[k] + '</text>';
    }
    // the label sits at the line's start, where a running total is still near zero, so it
    // never meets the end marker however close the spend gets to the budget
    var refLine = ref ? '<path class="rp-ref" d="M' + L + ' ' + y(ref.v).toFixed(1) + ' H' + (W - Rr) + '"/>'
      + '<text class="rp-ref-label" x="' + (L + 8) + '" y="' + (y(ref.v) - 8).toFixed(1) + '">' + U.esc(ref.label) + '</text>' : '';
    var marks = [], step = Math.max(1, Math.ceil((n - 1) / Math.max(2, Math.min(5, Math.floor(W / 120)))));
    for (k = 0; k < n - 1; k += step) { marks.push(k); }
    if (marks.length > 1 && n - 1 - marks[marks.length - 1] < step / 2) { marks.pop(); }
    marks.push(n - 1);
    marks.forEach(function (j) {
      var a = j === 0 ? 'start' : j === n - 1 ? 'end' : 'middle';
      var lab = pts[j].start ? 'Start of day' : U.dayF(M.dayDate(pts[j].k));
      labels += '<text x="' + x(j).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="' + a + '">' + lab + '</text>';
    });
    var line = pts.map(function (p, j) { return (j ? 'L' : 'M') + x(j).toFixed(1) + ' ' + y(p.v).toFixed(1); }).join(' ');
    var area = line + ' L' + x(n - 1).toFixed(1) + ' ' + y(0) + ' L' + x(0).toFixed(1) + ' ' + y(0) + ' Z';
    host.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + U.esc(fmt(lastV) + ' ' + unit + ' in total') + '">'
      + '<g class="rp-grid rp-grid--dash">' + grid + '</g><g class="rp-axis">' + labels + '</g>' + refLine
      + '<path class="rp-area" d="' + area + '"/><path class="rp-line" d="' + line + '"/>'
      + '<circle class="rp-dot" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lastV).toFixed(1) + '" r="4"/>'
      + '<g class="rp-hov" visibility="hidden"><line class="rp-hov-line" y1="' + T + '" y2="' + (H - B) + '"/><circle class="rp-hov-dot" r="4"/></g>'
      + '<rect x="' + L + '" y="0" width="' + (W - L - Rr) + '" height="' + H + '" fill="transparent"/>'
      + '</svg><div class="rp-tip" hidden></div>';
    var svg = host.querySelector('svg'), hov = svg.querySelector('.rp-hov'), tip = host.querySelector('.rp-tip');
    function move(ev) {
      var r = svg.getBoundingClientRect();
      var j = Math.max(0, Math.min(n - 1, Math.round(((ev.clientX - r.left) / r.width * W - L) / (W - L - Rr) * (n - 1))));
      var p = pts[j], px = x(j), py = y(p.v);
      hov.setAttribute('visibility', 'visible');
      hov.querySelector('line').setAttribute('x1', px);
      hov.querySelector('line').setAttribute('x2', px);
      hov.querySelector('circle').setAttribute('cx', px);
      hov.querySelector('circle').setAttribute('cy', py);
      tip.hidden = false;
      tip.innerHTML = '<span class="rp-tip-d">' + U.dateF(M.dayDate(p.k)) + (p.start ? ', start of day' : '') + '</span>'
        + '<span class="rp-tip-r"><i></i>' + U.esc(unit.charAt(0).toUpperCase() + unit.slice(1)) + '<b>' + fmt(p.v) + '</b></span>'
        + (p.inc !== null && n > 2 ? '<span class="rp-tip-r">That day<b>+' + fmt(p.inc) + '</b></span>' : '');
      tip.style.left = Math.max(80, Math.min(r.width - 80, px / W * r.width)) + 'px';
      tip.style.top = (py / H * r.height) + 'px';
    }
    function leave() { hov.setAttribute('visibility', 'hidden'); tip.hidden = true; }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', leave);
  };
})();
