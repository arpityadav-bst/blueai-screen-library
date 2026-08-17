/* ==========================================================================
   logo.js — the blueai-desktop pixel logo, rendered into the header.

   The mark is PROCEDURAL, not an image: a pixel disc minus a 4-point NSEW
   sparkle (an astroid), graded cyan → violet across the diagonal. Ported
   verbatim from `blueai/public/blueai-desktop/boot.js` — `genLogo()` and the
   exact header-resolution arguments it calls with, `genLogo(9, 0.82, 0.74, 1.0)`.

   READ-ONLY REFERENCE. Nothing here writes back to blueai-desktop, and this is
   a copy on purpose — the two files are allowed to diverge. If blueAI's mark
   changes, this does not follow automatically.
   ========================================================================== */

(function () {
  "use strict";

  /* ── Ported from boot.js, unchanged ─────────────────────────────────── */

  var HCELLS = 9; /* header resolution — ODD, so the sparkle has a true centre */
  var EX = 0.82; /* <1 = concave sparkle; the header uses a fatter star than  */
  var STAR_FAC = 0.74; /*   the boot animation so coarse pixels don't spike     */
  var DISC_FAC = 1.0;

  function clamp(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function genLogo(cells, ex, starFac, discFac) {
    var arr = [],
      C = (cells - 1) / 2,
      R = C + 0.5,
      circleR = R * discFac,
      starR = R * starFac,
      thr = Math.pow(starR, ex);
    var cyan = [14, 164, 197],
      violet = [123, 76, 255];
    for (var j = 0; j < cells; j++) {
      for (var i = 0; i < cells; i++) {
        var lx = i - C,
          ly = j - C;
        if (Math.sqrt(lx * lx + ly * ly) > circleR) continue; // outside the disc
        if (Math.pow(Math.abs(lx), ex) + Math.pow(Math.abs(ly), ex) <= thr)
          continue; // inside the sparkle -> empty
        var t = clamp(((lx + ly) / (2 * circleR)) * 0.5 + 0.5); // cyan (top-left) -> violet (bottom-right)
        arr.push({
          lx: lx,
          ly: ly,
          /* The brand grade is kept even when --logo-ink overrides it, so
             switching back is a token change and not a re-port. */
          color:
            "rgb(" +
            Math.round(cyan[0] + (violet[0] - cyan[0]) * t) +
            "," +
            Math.round(cyan[1] + (violet[1] - cyan[1]) * t) +
            "," +
            Math.round(cyan[2] + (violet[2] - cyan[2]) * t) +
            ")",
        });
      }
    }
    return arr;
  }

  var CELLS = genLogo(HCELLS, EX, STAR_FAC, DISC_FAC);

  /* ── Render ─────────────────────────────────────────────────────────── */

  /* Every .logo-canvas on the page, painted the same size. Colour is per-instance
     because --logo-ink is read off each canvas's own computed style — so the
     header can be black and the closer/footer white with no JS involved. */
  var canvases = Array.prototype.slice.call(
    document.querySelectorAll(".logo-canvas")
  );
  if (!canvases.length) return;

  /* The mark is a FIXED size, taken from boot.js's own cell pitch — it is not
     scaled to fit its container. That's what makes it the same physical size as
     the blueai-desktop header logo: ~27px at dpr 1, ~22.5px at dpr 2. The canvas
     is then sized to the mark, and the white circle centres it via `place-items`.

     JS sets the CSS size explicitly (as boot.js does) rather than leaving it to a
     stylesheet. A <canvas> falls back to an intrinsic 300×150 whenever its CSS
     box isn't in effect, so a percentage rule here is a ~300px logo waiting to
     happen — which is exactly what it did.

     Integer device-px blocks on an untransformed context: fractional cells
     anti-alias and the seams read as soft grid lines instead of distinct pixels. */
  function paint(canvas) {
    if (!canvas.getContext) return;

    /* The REAL dpr, capped only for sanity — deliberately NOT boot.js's cap of 2.
       That cap is safe on desktop (dpr 1/1.5/2) but wrong on phones at dpr 3: the
       bitmap is built for dpr 2 and then the browser resamples it by 1.5× to fill
       the CSS box, and non-integer resampling of pixel art is exactly the smeared,
       distorted mark it produced on mobile. Using the true dpr keeps the bitmap a
       1:1 map onto device pixels at every ratio.
       Desktop is bit-identical to before: only dpr > 2 takes a different path. */
    var dpr = Math.max(1, Math.min(4, window.devicePixelRatio || 1));

    /* Cell pitch. boot.js hardcodes 2.6, giving a ~22–27px mark; at that size a
       9-cell grid puts 2.5px in each block and the 4-point star cutout can't
       resolve, so the mark reads as a blob rather than a logo. --logo-pitch
       raises it. This is a deliberate divergence from blueai-desktop's SIZE —
       the geometry, colours and 1px gap are still its own. */
    var pitch =
      parseFloat(
        getComputedStyle(canvas).getPropertyValue("--logo-pitch")
      ) || 2.6;

    var DC = Math.max(3, Math.round(pitch * dpr));

    /* boot.js uses DB = DC - 1: a gap of ONE DEVICE pixel. That's a full CSS px
       at dpr 1, but only 0.5 at dpr 2 and 0.33 at dpr 3 — so on any dense screen
       the blocks visually merge and the mark stops reading as pixels at all.
       Scaling the gap with dpr keeps it a constant ~1 CSS px everywhere. */
    var gap = Math.max(1, Math.round(dpr));
    var DB = Math.max(1, DC - gap);

    var size = HCELLS * DC; /* device px */
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size / dpr + "px";
    canvas.style.height = size / dpr + "px";

    var ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, size, size);

    /* Flat ink from the token, or blueai-desktop's cyan→violet grade if it is
       unset / `none`. Read here rather than cached so a token edit takes effect
       on the next repaint. */
    var ink = "";
    if (window.getComputedStyle) {
      ink = (
        getComputedStyle(canvas).getPropertyValue("--logo-ink") || ""
      ).trim();
    }
    if (ink === "none") ink = "";

    /* lx/ly run -4..+4, so +C maps them to 0..8 cells inside the square. */
    var C = (HCELLS - 1) / 2;
    for (var k = 0; k < CELLS.length; k++) {
      var p = CELLS[k];
      ctx.fillStyle = ink || p.color;
      ctx.fillRect((p.lx + C) * DC, (p.ly + C) * DC, DB, DB);
    }
  }

  function paintAll() {
    for (var i = 0; i < canvases.length; i++) paint(canvases[i]);
  }

  paintAll();

  /* Dragging a window between displays changes dpr, which changes the cell pitch.
     Repaint on resize. */
  var queued = false;
  window.addEventListener(
    "resize",
    function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        paintAll();
      });
    },
    { passive: true }
  );

  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(paintAll);
})();
