// AN ASCII FIELD FOR THE HERO, the same one the dark onBlue landing page runs
// behind its partnered-agents band, re-inked for a light page.
//
// WHY THIS AND NOT THE WEBGL COMPONENT. The first attempt here was a port of
// Canvas UI's Asciify: a fragment shader that reads a capture of the page,
// picks a 5x5 packed bitmap per cell by luminance, and dithers coverage with a
// hash. It is built to asciify a PAGE, and behind a headline there is no page
// to read, so it had to invent a density field and the result was static with
// a lens cut out of it. This one never pretends to be a render of anything: it
// is a grid of characters that mostly sits dark and brightens where the
// pointer is. That is the whole trick, and it is why the other one reads.
//
// The field is the landing page's, kept deliberately: the 15px cell, the 0.948
// ambient threshold, the quadratic falloff, the 68ms throttle. Two things
// changed. The INK, because that page draws near-white glyphs on near-black
// and these have to carry on a pale field. And the POOL, which is turned right
// down here: there it is the effect, and here it is only a sign that the page
// noticed the cursor.
//
// WHAT MAKES A POOL LOUD, in the order it matters. Changing which CHARACTER a
// cell draws is by far the loudest, and at 14fps no amount of low alpha hides
// it. Then the chromatic fringe, which is a colour appearing on a page that
// has none there. Then the hue shift. The brightness lift is the quietest of
// the four and the only one kept at any strength, which is why what is left
// reads as the same field firming up rather than as a light being shone on it.

const RAMP = ' .,:;i1tfLCG08@';

const DEFAULTS = {
  cell: 15,
  font: 11,
  // how far the pool reaches from the pointer, in CSS pixels. Tighter than
  // the landing page's 190: a wide pool at low strength is a large area of
  // almost-nothing, and it reads as the field being uneven rather than as
  // something following the cursor.
  reach: 150,
  // fraction of cells lit when the pointer is elsewhere. The landing page
  // keeps roughly one in twenty, which is what makes the band feel inhabited
  // rather than switched off.
  ambient: 0.948,
  ambientAlpha: 0.085,
  // the landing page lifts by 0.5. This is a quarter of it.
  lensAlpha: 0.12,
  // the page's ink, and the accent the pool warms toward. The warm is applied
  // at a quarter weight, so it is a hint of blue rather than a blue glyph.
  ink: [61, 61, 68],
  lit: [47, 109, 255],
  tint: 0.25,
  // ~14fps. An ascii readout wants to step rather than glide, and this is
  // most of the reason the effect reads as a terminal and not as a gradient.
  interval: 68,
};

export function createAsciiField(canvas, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const host = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  if (!host || !ctx) return null;

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0;
  let h = 0;
  let cols = 0;
  let rows = 0;
  let seed = null;
  let px = 0;
  let py = 0;
  let tracking = false;
  let onScreen = false;
  let frame = 0;
  let painted = 0;
  let destroyed = false;

  function measure() {
    const box = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(box.width));
    h = Math.max(1, Math.round(box.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    cols = Math.ceil(w / config.cell);
    rows = Math.ceil(h / config.cell);
    // ONE FIXED SEED PER CELL. The glyph a cell shows drifts, but which cells
    // are ambient never does: re-rolling it every frame is what turns a field
    // into television static.
    seed = new Float32Array(cols * rows);
    for (let i = 0; i < seed.length; i += 1) seed[i] = Math.random();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = config.font + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
  }

  function paint(now) {
    ctx.clearRect(0, 0, w, h);
    const cell = config.cell;
    const reach2 = config.reach * config.reach;
    const [ir, ig, ib] = config.ink;
    const [lr, lg, lb] = config.lit;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const s = seed[y * cols + x];
        const cx = x * cell + cell * 0.5;
        const cy = y * cell + cell * 0.5;

        const ambient = s > config.ambient
          ? config.ambientAlpha + (still ? 0 : 0.035 * Math.sin(now * 0.0011 + s * 40))
          : 0;
        let lens = 0;
        if (tracking) {
          const dx = cx - px;
          const dy = cy - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach2) {
            // QUADRATIC, not linear: a linear falloff has a visible rim
            const t = 1 - Math.sqrt(d2) / config.reach;
            lens = t * t;
          }
        }
        const alpha = ambient + lens * config.lensAlpha;
        if (alpha < 0.02) continue;

        // the glyph rolls slowly with time, and the POOL DOES NOT TOUCH IT.
        // On the landing page the pool speeds this up and the churn is half
        // of what you see; that is exactly what a very subtle pool cannot do.
        const roll = (s + (still ? 0 : now * 0.00012)) % 1;
        const glyph = RAMP.charAt((roll * RAMP.length) | 0);

        // NO CHROMATIC FRINGE. The red and cyan pair at the rim is the second
        // loudest thing the pool can do and it puts colour on a page that has
        // none of it in this band.

        const warm = lens * config.tint;
        ctx.fillStyle = 'rgba('
          + Math.round(ir + (lr - ir) * warm) + ','
          + Math.round(ig + (lg - ig) * warm) + ','
          + Math.round(ib + (lb - ib) * warm) + ','
          + alpha.toFixed(3) + ')';
        ctx.fillText(glyph, cx, cy);
      }
    }
  }

  function tick(now) {
    frame = 0;
    if (destroyed || !onScreen) return;
    if (now - painted >= config.interval) {
      painted = now;
      paint(now);
    }
    if (!still || tracking) frame = requestAnimationFrame(tick);
  }
  function wake() {
    if (!destroyed && onScreen && !frame) frame = requestAnimationFrame(tick);
  }

  measure();

  const resize = new ResizeObserver(() => { measure(); painted = 0; wake(); });
  resize.observe(host);
  const seen = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting;
    if (onScreen) wake();
  });
  seen.observe(host);

  function onMove(event) {
    const box = host.getBoundingClientRect();
    px = event.clientX - box.left;
    py = event.clientY - box.top;
    tracking = true;
    wake();
  }
  function onLeave() { tracking = false; wake(); }
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave, { passive: true });

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    },
  };
}
