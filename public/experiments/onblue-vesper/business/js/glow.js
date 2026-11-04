/* The hero's ambient light: the carousel's screens spill their own colours onto
   the page behind them (YouTube's ambient mode, a TV's Ambilight). Brightest on
   the top edge of the frames, rising in a narrow cone before it fades.

   PAINTED ONCE, AT LOAD (Appy: no slow, jittery fade-in). It waits for the
   still images of the frames facing the reader, reads one averaged colour from
   each, lays them across the screen where those frames sit, and paints the
   light in one go. Nothing updates after that, so nothing flickers and it
   costs nothing while the page runs.

   HOW, WITHOUT A BLUR. A tiny canvas (64 x 28) is painted pixel by pixel and
   stretched over the hero; the browser's smooth upscaling is the softness, so
   there is no filter or backdrop blur (those cap Chrome at 30 fps on some Macs). */
(function () {
  'use strict';
  var hero = document.querySelector('.ob-hero');
  var arc = document.querySelector('[data-cyl]');
  if (!hero || !arc) { return; }

  var GW = 64, GH = 28, BASE = 0.72;            // glow canvas size; the top of the frames sits at 72% down it
  // on a phone the frames leave gaps, so the light must reach clear by its box's foot (no seam)
  var phone = window.matchMedia('(max-width: 700px)').matches;
  var glow = document.createElement('canvas');
  glow.className = 'ob-glow'; glow.width = GW; glow.height = GH; glow.setAttribute('aria-hidden', 'true');
  hero.insertBefore(glow, hero.firstChild);
  var g = glow.getContext('2d');
  var probe = document.createElement('canvas'); probe.width = probe.height = 16;
  var p = probe.getContext('2d', { willReadFrequently: true });

  // the light box: its brightest row sits on the top edge of the frames, so the
  // light shows in the open page above them (the frames would cover it lower down)
  function place() {
    var h = hero.getBoundingClientRect(), r = arc.getBoundingClientRect();
    var height = r.height * 1.25, top = r.top - h.top + r.height * 0.12 - height * BASE;
    glow.style.top = top + 'px'; glow.style.height = height + 'px';
  }

  // A FRAME'S ACCENT, NOT ITS AVERAGE. Most films are mostly dark, so an average
  // is a muddy grey. Instead every pixel of a 16 x 16 read is scored on how vivid
  // it is (saturation x brightness), and only the most vivid quarter is
  // averaged: the balloon's stripes, the neon, the sunset, not the shadows.
  function accent(data) {
    var px = [];
    for (var k = 0; k < data.length; k += 4) {
      var r = data[k], gg = data[k + 1], b = data[k + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
      px.push({ c: [r, gg, b], score: mx ? ((mx - mn) / mx) * (mx / 255) : 0 });
    }
    px.sort(function (a, b) { return b.score - a.score; });
    var top = px.slice(0, Math.max(1, Math.round(px.length / 4))), s = [0, 0, 0];
    top.forEach(function (q) { s[0] += q.c[0]; s[1] += q.c[1]; s[2] += q.c[2]; });
    return [s[0] / top.length, s[1] / top.length, s[2] / top.length];
  }

  // a screen throws light, not shadow: keep the accent's hue, set it as a soft,
  // light tint, so the glow reads as coloured light on the page
  function asLight(r, gg, b) {
    r /= 255; gg /= 255; b /= 255;
    var mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), h = 0, s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(mx + mn - 1));
    if (mx !== mn) { h = mx === r ? ((gg - b) / (mx - mn)) % 6 : mx === gg ? (b - r) / (mx - mn) + 2 : (r - gg) / (mx - mn) + 4; }
    h = (h * 60 + 360) % 360; s = Math.min(0.85, s * 1.1);
    var l = 0.7, c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    var rgb = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255];
  }

  // the frames facing the reader, with where they sit across the hero
  function facing() {
    var hr = hero.getBoundingClientRect(), stageH = arc.getBoundingClientRect().height, out = [];
    arc.querySelectorAll('.ob-cyl-card').forEach(function (c) {
      var r = c.getBoundingClientRect(), v = c.querySelector('video');
      // the culled near half renders larger than the band, so height tells them apart
      if (!r.width || r.height > stageH || r.right < hr.left || r.left > hr.right || !v || !v.getAttribute('poster')) { return; }
      out.push({ x: ((r.left + r.right) / 2 - hr.left) / hr.width, src: v.getAttribute('poster') });
    });
    return out;
  }

  function paint(pts) {
    pts.sort(function (a, b) { return a.x - b.x; });
    var cols = [];
    for (var x = 0; x < GW; x++) {               // each column takes the colour of the frames around it
      var fx = (x + 0.5) / GW, j = 0;
      while (j < pts.length - 1 && pts[j + 1].x < fx) { j++; }
      var a = pts[j], b = pts[Math.min(j + 1, pts.length - 1)];
      var t = b.x > a.x ? Math.min(1, Math.max(0, (fx - a.x) / (b.x - a.x))) : 0;
      cols.push([0, 1, 2].map(function (ch) { return a.c[ch] + (b.c[ch] - a.c[ch]) * t; }));
    }
    var img = g.createImageData(GW, GH), d = img.data, yb = BASE * GH;
    for (var y = 0; y < GH; y++) {
      var u, alpha, half;
      if (y <= yb) { u = (yb - y) / yb; alpha = Math.pow(1 - u, 1.5); half = 0.4 - 0.27 * u; }   // a narrow cone, tightening as it rises
      else { u = (y - yb) / (GH - yb); alpha = phone ? Math.pow(1 - u, 2) : 1 - u * 0.5; half = 0.4; }
      for (var xx = 0; xx < GW; xx++) {
        var off = Math.abs((xx + 0.5) / GW - 0.5), edge = Math.max(0, 1 - off / half);
        var al = alpha * edge * edge * (3 - 2 * edge), o = (y * GW + xx) * 4;
        d[o] = cols[xx][0]; d[o + 1] = cols[xx][1]; d[o + 2] = cols[xx][2]; d[o + 3] = Math.round(al * 255);
      }
    }
    g.putImageData(img, 0, 0);
  }

  function light() {
    var list = facing(), left = list.length, pts = [];
    if (!left) { return; }
    list.forEach(function (f) {
      var im = new Image();
      im.onload = im.onerror = function () {
        if (im.naturalWidth) {
          try {
            p.drawImage(im, 0, 0, 16, 16);
            var ac = accent(p.getImageData(0, 0, 16, 16).data);
            pts.push({ x: f.x, c: asLight(ac[0], ac[1], ac[2]) });
          } catch (e) { /* skip this frame */ }
        }
        if (--left === 0 && pts.length) { paint(pts); }
      };
      im.src = f.src;
    });
  }

  window.addEventListener('resize', place, { passive: true });
  window.addEventListener('load', place);
  place(); light();
})();
