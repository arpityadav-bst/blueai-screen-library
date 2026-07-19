// BlueAI boot + pixel-logo core for the desktop drawer.
// The logo is generated PROCEDURALLY (a clean pixel disc minus a 4-point NSEW sparkle/astroid) at
// two resolutions so the star is pristine + smooth at both sizes — not a PNG sample that blurs.
// Act I dormant -> Act II every pixel flies in from a random edge and gathers into the logo (relaxed,
// calm) -> brief shimmer/hold -> Act III the logo bursts away in a left->right pixel splash, then the
// header logo drops in from the top and goes live. No background grid.
window.BlueAIBoot = function (host) {
  var GRID = 6;          // base pixel cell size in css px
  var CELLS = 40;        // assembly resolution (high -> smooth star arc)
  var HCELLS = 9;        // header resolution (ODD; low so distinct pixels + clear gaps fit the ~28px header)
  var LOGO_PX = CELLS * GRID;

  var easeOutExpo = function (t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  var canvas = document.createElement('canvas');
  canvas.className = 'bai-cv';
  host.insertBefore(canvas, host.firstChild);
  var ctx = canvas.getContext('2d');
  var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  // Canvas palette per theme (must mirror the CSS --bai-bg): bg fill, absorb/spark flash, heartbeat ring.
  var THEMES = { dark: { bg: '#141a28', flash: 'rgb(226,238,255)', ring: 'rgb(110,168,255)' }, light: { bg: '#f6f8fc', flash: 'rgb(29,79,184)', ring: 'rgb(37,99,217)' } };
  var PAL = THEMES.dark;

  var W = 0, H = 0, pixels = [], hpixels = [], flickers = [];
  var BIG = 0.7, SMALL = 0.125, CXC = 0, CYC = 0, HDRX = 28, HDRY = 53;   // HDRY centers the logo in the 46px header, which sits BELOW the 30px OS title bar

  // A clean pixel disc minus a 4-point NSEW sparkle (astroid). Same relative shape at any resolution.
  function genLogo(cells, ex, starFac, discFac) {
    // discFac = disc radius vs grid; starFac = star size vs grid; ex<1 = concave sparkle (lower = curvier).
    var arr = [], C = (cells - 1) / 2, R = C + 0.5, circleR = R * discFac, starR = R * starFac, thr = Math.pow(starR, ex);
    var cyan = [14, 164, 197], violet = [123, 76, 255];
    for (var j = 0; j < cells; j++) {
      for (var i = 0; i < cells; i++) {
        var lx = i - C, ly = j - C;
        if (Math.sqrt(lx * lx + ly * ly) > circleR) continue;                           // outside the (shrunk) disc
        if (Math.pow(Math.abs(lx), ex) + Math.pow(Math.abs(ly), ex) <= thr) continue;    // inside the sparkle -> empty
        var t = clamp((lx + ly) / (2 * circleR) * 0.5 + 0.5);                            // cyan(top-left) -> violet(bottom-right)
        var hsh = (((lx + 64) * 73856093) ^ ((ly + 64) * 19349663)) >>> 0;               // stable per-pixel hash
        arr.push({ lx: lx, ly: ly, keep: (hsh % 1000) < 500, color: 'rgb(' + Math.round(cyan[0] + (violet[0] - cyan[0]) * t) + ',' + Math.round(cyan[1] + (violet[1] - cyan[1]) * t) + ',' + Math.round(cyan[2] + (violet[2] - cyan[2]) * t) + ')' });
      }
    }
    return arr;
  }

  function resize() {
    W = Math.max(1, host.clientWidth);
    H = Math.max(1, host.clientHeight);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    BIG = 130 / LOGO_PX; SMALL = 40 / LOGO_PX;   // smaller assembly logo
    CXC = W / 2; CYC = H * 0.40;
  }

  function assignSpawns() {
    for (var k = 0; k < pixels.length; k++) {                   // each pixel flies in from a random edge
      var p = pixels[k], edge = (Math.random() * 4) | 0;
      if (edge === 0) { p.sx = Math.random() * W; p.sy = -GRID * 3; }
      else if (edge === 1) { p.sx = W + GRID * 3; p.sy = Math.random() * H; }
      else if (edge === 2) { p.sx = Math.random() * W; p.sy = H + GRID * 3; }
      else { p.sx = -GRID * 3; p.sy = Math.random() * H; }
      p.delay = Math.random() * 0.38;                           // staggered arrival
    }
    flickers = [];
    for (var f = 0; f < 7; f++) flickers.push({ x: Math.round(Math.random() * W / GRID) * GRID, y: Math.round(Math.random() * H / GRID) * GRID, ph: Math.random() * 6.28 });
  }

  // Assembly + held logo. assembleT (0..1) flies each pixel from its edge spawn to its place.
  // Crisp integer-device-px rendering (same as the header) so pixels are pristine with a clean uniform
  // gap — no fractional/anti-aliased seams reading as soft grid lines. Distinct gapped pixels, not flush.
  function drawLogo(cx, cy, scale, assembleT, sweep, dissolve) {
    var cellCss = GRID * scale, DB = Math.max(2, Math.round(cellCss * dpr) - 2), h = DB >> 1;   // ~2px gap -> distinct pixels, never merged
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);                          // raw device px -> pixel-perfect edges
    for (var k = 0; k < pixels.length; k++) {
      var p = pixels[k], a = 1;
      if (dissolve && !p.keep) { a = 1 - dissolve; if (a <= 0.03) continue; }            // dissolve thins ~half the pixels for the header
      var tx = cx + p.lx * cellCss, ty = cy + p.ly * cellCss, x = tx, y = ty;
      if (assembleT !== null) {
        var local = Math.max(0, Math.min(1, (assembleT - p.delay) / (1 - 0.38)));
        if (local <= 0) continue;
        var e = easeOutExpo(local);
        x = lerp(p.sx, tx, e); y = lerp(p.sy, ty, e);
      }
      var px = Math.round(x * dpr) - h, py = Math.round(y * dpr) - h;
      ctx.globalAlpha = a; ctx.fillStyle = p.color; ctx.fillRect(px, py, DB, DB);
      if (assembleT === null && sweep != null) {                 // brief final shimmer, once
        var dpos = (p.lx + p.ly) / CELLS + 0.5, band = 1 - Math.min(1, Math.abs(dpos - sweep) / 0.10);
        if (band > 0) { ctx.globalAlpha = band * 0.4; ctx.fillStyle = 'rgba(255,255,255,1)'; ctx.fillRect(px, py, DB, DB); }
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function frameBase() { ctx.clearRect(0, 0, W, H); ctx.fillStyle = PAL.bg; ctx.fillRect(0, 0, W, H); }

  // Small, crisp settled header logo: integer device-px blocks (~1px gap), pixel-snapped edges.
  function drawHeaderLogo(cx, cy) {
    var DC = Math.max(3, Math.round(2.6 * dpr)), DB = DC - 1;   // ~20px header logo — smaller, still distinct pixels
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);                         // raw device px for pixel-perfect edges
    var cxD = Math.round(cx * dpr), cyD = Math.round(cy * dpr);
    for (var k = 0; k < hpixels.length; k++) {
      var p = hpixels[k];
      ctx.fillStyle = p.color;
      ctx.fillRect(cxD + p.lx * DC, cyD + p.ly * DC, DB, DB);
    }
    ctx.restore();
  }

  // Header logo = the SAME assembly logo rendered small, so the two can never diverge (consistent star,
  // no separate low-res version with exaggerated pointer-spikes).
  function renderReady() { frameBase(); drawHeaderLogo(HDRX, HDRY); }   // chunky distinct-pixel header (fatter star, no spikes)

  // ---- Part B: living interface (ambient packets -> logo, heartbeat, thinking ramp) ----
  var packets = [], ambientRaf = null, lastTs = null, lastBeat = 0, lastSpawn = 0, thinkUntil = 0, beats = [];
  var logoR = (HCELLS / 2) * Math.max(3, Math.round(2.6 * dpr)) / dpr;     // header-logo radius (css) for packet absorption — tracks the smaller logo

  function spawnPacket() {                                  // enters from the right, at any height across the logo's face
    packets.push({ x: W + 4, y: HDRY + (Math.random() * 2 - 1) * logoR * 0.92, sp: 55 + Math.random() * 65,
      col: Math.random() < 0.5 ? '110,168,255' : '123,76,255' });
  }

  function drawLiveLogo(now, energy) {                      // header logo, subtly alive (twinkle + absorb-spark)
    var DC = Math.max(3, Math.round(2.6 * dpr)), DB = DC - 1;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    var cxD = Math.round(HDRX * dpr), cyD = Math.round(HDRY * dpr);
    for (var k = 0; k < hpixels.length; k++) {
      var p = hpixels[k], tw = 0.5 + 0.5 * Math.sin(now * 0.003 + p.lx * 0.9 + p.ly * 1.4);
      var px = cxD + p.lx * DC, py = cyD + p.ly * DC;
      ctx.globalAlpha = Math.min(1, 0.8 + 0.2 * energy + 0.12 * tw * (0.3 + energy));
      ctx.fillStyle = p.color; ctx.fillRect(px, py, DB, DB);
      if (p.flash) {                                         // a packet was just absorbed here -> spark white, then fade back
        var fl = (now - p.flash) / 430;
        if (fl < 1) { ctx.globalAlpha = (1 - fl) * 0.9; ctx.fillStyle = PAL.flash; ctx.fillRect(px, py, DB, DB); }
      }
    }
    ctx.globalAlpha = 1; ctx.restore();
  }

  function ambientStep(ts) {
    var now = ts, dt = lastTs == null ? 0.016 : Math.min(0.05, (ts - lastTs) / 1000); lastTs = ts;
    var energy = 0;                                                          // thinking now lives above the chatbar, not in the logo
    frameBase();
    if (now - lastBeat > 12000) { lastBeat = now; beats.push(now); }          // heartbeat ~every 12s
    for (var b = beats.length - 1; b >= 0; b--) {
      var age = (now - beats[b]) / 800; if (age >= 1) { beats.splice(b, 1); continue; }
      ctx.globalAlpha = (1 - age) * 0.09; ctx.strokeStyle = PAL.ring; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(HDRX, HDRY, age * Math.max(W, H) * 0.6, 0, 6.2832); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (now - lastSpawn > 1500) { lastSpawn = now; spawnPacket(); }            // steady ambient trickle
    for (var i = packets.length - 1; i >= 0; i--) {                            // stream right -> left in parallel lanes (not one line)
      var pk = packets[i]; pk.x -= pk.sp * dt;                                 // move left, keep its own lane
      var ddx = pk.x - HDRX, ddy = pk.y - HDRY;
      if (ddx * ddx + ddy * ddy < logoR * logoR) { packets.splice(i, 1); hpixels[(Math.random() * hpixels.length) | 0].flash = now; continue; }   // absorbed -> one random logo pixel sparks
      ctx.fillStyle = 'rgba(' + pk.col + ',0.85)'; ctx.fillRect(Math.round(pk.x), Math.round(pk.y), 2, 2);
    }
    drawLiveLogo(now, energy);
    ambientRaf = requestAnimationFrame(ambientStep);
  }

  function startAmbient() { if (!ambientRaf) { lastTs = null; ambientRaf = requestAnimationFrame(ambientStep); } }

  function drawMini(cv) {                                   // tiny pixel logo for the "thinking" indicator above the chatbar
    var g = cv.getContext('2d'), s = 20;                    // 20px css
    cv.style.width = s + 'px'; cv.style.height = s + 'px';
    cv.width = Math.round(s * dpr); cv.height = Math.round(s * dpr);
    g.clearRect(0, 0, cv.width, cv.height);
    var mini = genLogo(9, 0.82, 0.74, 1.0), DC = Math.max(1, Math.floor(cv.width / 9)), DB = Math.max(1, DC - 1);
    var cx = cv.width / 2, cy = cv.height / 2;
    for (var k = 0; k < mini.length; k++) { var p = mini[k]; g.fillStyle = p.color; g.fillRect(Math.round(cx + p.lx * DC - DB / 2), Math.round(cy + p.ly * DC - DB / 2), DB, DB); }
  }

  // ---- Opening sequence: assemble (center) -> hold/launcher -> processing -> collapse to header ----
  var raf = null, holdRaf = null, energy = 0;
  var T = { dormant: 350, assemble: 1700, shimmer: 150, hold: 480 };
  var ASM = T.dormant + T.assemble + T.shimmer + T.hold;

  function drawAssemble(t) {
    frameBase();
    if (t < T.dormant) {
      for (var f = 0; f < flickers.length; f++) { var fl = flickers[f], a = 0.10 + 0.10 * Math.sin(t * 0.006 + fl.ph); ctx.globalAlpha = Math.max(0, a); ctx.fillStyle = '#3a7bd5'; ctx.fillRect(fl.x, fl.y, GRID - 1.5, GRID - 1.5); }
      ctx.globalAlpha = 1; return false;
    }
    if (t < T.dormant + T.assemble) { drawLogo(CXC, CYC, BIG, (t - T.dormant) / T.assemble, null); return false; }
    if (t < T.dormant + T.assemble + T.shimmer) { drawLogo(CXC, CYC, BIG, null, (t - T.dormant - T.assemble) / T.shimmer); return false; }
    if (t < ASM) { drawLogo(CXC, CYC, BIG, null, null); return false; }
    return true;   // assembled, holding at center
  }

  // Held/launcher logo at center, alive with twinkle. energy 0 = calm, 1 = processing (random white sparks).
  function drawCenterLive(now) {
    var cellCss = GRID * BIG, DB = Math.max(2, Math.round(cellCss * dpr) - 2), h = DB >> 1, cellD = cellCss * dpr;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    var cxD = Math.round(CXC * dpr), cyD = Math.round(CYC * dpr);
    for (var k = 0; k < pixels.length; k++) {
      var p = pixels[k];
      var tw = 0.5 + 0.5 * Math.sin(now * 0.0035 + p.lx * 1.1 + p.ly * 0.7);
      var spark = energy > 0 && ((Math.sin(now * 0.02 + k * 2.3) + 1) * 0.5) > (1 - energy * 0.28);
      ctx.globalAlpha = Math.min(1, 0.78 + 0.14 * tw + 0.22 * energy * tw);
      ctx.fillStyle = spark ? PAL.flash : p.color;
      ctx.fillRect(Math.round(cxD + p.lx * cellD) - h, Math.round(cyD + p.ly * cellD) - h, DB, DB);
    }
    ctx.globalAlpha = 1; ctx.restore();
  }
  // Ambient background twinkle: random grid pixels light up + fade (gives the picker/boot screen the same living feel as the header's packet traffic).
  var bgSparks = [], lastBgSpawn = 0;
  function spawnBgSpark(now) {
    bgSparks.push({
      x: Math.round(Math.random() * (W / GRID)) * GRID,
      y: Math.round(Math.random() * (H / GRID)) * GRID,
      born: now, life: 1100 + Math.random() * 1700,
      peak: 0.12 + Math.random() * 0.22,
      col: Math.random() < 0.5 ? '110,168,255' : '123,76,255'
    });
  }
  function drawBgSparks(now) {
    for (var i = bgSparks.length - 1; i >= 0; i--) {
      var s = bgSparks[i], t = (now - s.born) / s.life;
      if (t >= 1) { bgSparks.splice(i, 1); continue; }
      ctx.globalAlpha = Math.sin(t * Math.PI) * s.peak;     // fade in -> peak -> fade out
      ctx.fillStyle = 'rgb(' + s.col + ')';
      ctx.fillRect(s.x, s.y, GRID - 2, GRID - 2);
    }
    ctx.globalAlpha = 1;
  }
  function holdStep(ts) {
    frameBase();
    if (ts - lastBgSpawn > 110 && bgSparks.length < 24) { lastBgSpawn = ts; spawnBgSpark(ts); }   // steady ambient trickle, capped
    drawBgSparks(ts);                                       // behind the logo
    drawCenterLive(ts);
    holdRaf = requestAnimationFrame(holdStep);
  }
  function startHold() { if (!holdRaf) holdRaf = requestAnimationFrame(holdStep); }
  function stopHold() { if (holdRaf) { cancelAnimationFrame(holdRaf); holdRaf = null; } }

  function boot(onAssembled) {                              // assemble -> hold at center, then hand off to the launcher
    assignSpawns();
    var start = null, fired = false;
    function done() { if (fired) return; fired = true; if (raf) cancelAnimationFrame(raf); frameBase(); drawLogo(CXC, CYC, BIG, null, null); startHold(); onAssembled && onAssembled(); }
    function step(ts) { if (start == null) start = ts; if (drawAssemble(ts - start)) { done(); return; } raf = requestAnimationFrame(step); }
    raf = requestAnimationFrame(step);
    setTimeout(done, ASM + 1500);                           // fallback if rAF is throttled (hidden tab)
  }

  // Boot finished: the centered logo bursts away in a left->right pixel splash, clearing the canvas.
  function dissolve(onDone) {
    stopHold(); energy = 0;
    var minLx = 1e9, maxLx = -1e9, k, p, hsh;
    for (k = 0; k < pixels.length; k++) { p = pixels[k]; if (p.lx < minLx) minLx = p.lx; if (p.lx > maxLx) maxLx = p.lx; }
    var span = Math.max(1, maxLx - minLx);
    for (k = 0; k < pixels.length; k++) {
      p = pixels[k]; hsh = (((p.lx + 99) * 73856093) ^ ((p.ly + 99) * 19349663)) >>> 0;
      p.nx = (p.lx - minLx) / span;                          // 0 (left edge) .. 1 (right edge)
      p.dvx = 12 + (hsh % 100) / 100 * 30;                   // splash mostly rightward
      p.dvy = ((hsh >> 7) % 100) / 100 * 40 - 20;            // with vertical scatter
    }
    var start = null, fired = false, TD = 1200, FADEW = 0.3;   // slower, smoother left→right splash
    var cellD = GRID * BIG * dpr, DB = Math.max(2, Math.round(GRID * BIG * dpr) - 2), h2 = DB >> 1;
    function fin() { if (fired) return; fired = true; if (raf) cancelAnimationFrame(raf); frameBase(); onDone && onDone(); }
    function step(ts) {
      if (start == null) start = ts;
      var P = Math.min(1, (ts - start) / TD), front = -0.14 + P * 1.28;   // wipe front sweeps left -> right
      frameBase(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      var cxD = Math.round(CXC * dpr), cyD = Math.round(CYC * dpr);
      for (var k2 = 0; k2 < pixels.length; k2++) {
        var q = pixels[k2], d = (front - q.nx) / FADEW;
        if (d >= 1) continue;                                 // already burst away
        var bx = cxD + q.lx * cellD, by = cyD + q.ly * cellD, a = 1;
        if (d > 0) { var e = d * d; bx += q.dvx * e * dpr; by += q.dvy * e * dpr; a = 1 - d; }
        ctx.globalAlpha = a < 0 ? 0 : a; ctx.fillStyle = q.color;
        ctx.fillRect(Math.round(bx) - h2, Math.round(by) - h2, DB, DB);
      }
      ctx.globalAlpha = 1; ctx.restore();
      if (P >= 1) { fin(); return; }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    setTimeout(fin, TD + 800);                                // fallback if rAF is throttled
  }

  // Header logo drops in from above the panel, fading up, then goes live (ambient + twinkle).
  function enterHeader(onDone) {
    energy = 0;
    var start = null, fired = false, TR = 440, fromY = HDRY - 52;
    function fin() { if (fired) return; fired = true; if (raf) cancelAnimationFrame(raf); renderReady(); startAmbient(); onDone && onDone(); }
    function step(ts) {
      if (start == null) start = ts;
      var tr = easeOutExpo(Math.min(1, (ts - start) / TR));
      frameBase(); ctx.globalAlpha = tr; drawHeaderLogo(HDRX, lerp(fromY, HDRY, tr)); ctx.globalAlpha = 1;
      if (tr >= 1) { fin(); return; }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    setTimeout(fin, TR + 900);                                // fallback
  }

  resize();
  pixels = genLogo(CELLS, 0.45, 0.86, 0.92);    // assembly: curvy concave star, tight ring
  hpixels = genLogo(HCELLS, 0.82, 0.74, 1.0);   // header: fatter star so the coarse low-res pixels don't spike
  window.addEventListener('resize', function () { resize(); if (!raf && !holdRaf && !ambientRaf) renderReady(); });
  if (window.ResizeObserver) new ResizeObserver(function () { resize(); if (!raf && !holdRaf && !ambientRaf) renderReady(); }).observe(host);   // adapt the canvas when the detached window is resized

  return {
    boot: function (onAssembled) { boot(onAssembled); },   // assemble -> launcher
    setEnergy: function (e) { energy = e; },               // 0 calm .. 1 processing twinkle
    dissolve: function (onDone) { dissolve(onDone); },      // boot done -> left→right pixel splash, canvas clears
    enterHeader: function (onDone) { enterHeader(onDone); },// header logo drops in from the top, then goes live
    ready: function () { stopHold(); renderReady(); startAmbient(); },   // instant reopen -> header + chat
    setTheme: function (mode) { PAL = THEMES[mode] || THEMES.dark; if (ambientRaf) renderReady(); },   // repaint sync in the settled state; live loops pick PAL up next frame
    resize: function () { resize(); if (!raf && !holdRaf && !ambientRaf) renderReady(); },   // force a canvas re-fit (detached restore sets geometry before boot)
    drawMini: function (cv) { drawMini(cv); }
  };
};
