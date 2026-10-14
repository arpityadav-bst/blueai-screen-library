// BlueAI V3: the welcome's dot field, in the onBlue Agentic site's language. Dots are crisp in the
// middle and, toward the window's edges, soften and split into the site's red and cyan fringe
// (its light-theme --fringe-l #f7a9ad and --fringe-r #a8e2ea, painted with multiply the way the
// site paints its aberration copies), like the edge of a lens.
// Drawn ONCE on a canvas and repainted only when the window resizes: no CSS blur, filter or mask
// (on some Macs any of those caps an animated page at 30 fps) and no animation loop.
// Exposes window.LensDots. The host must be positioned; the canvas fills it.
(function () {
  const { useEffect, useRef } = React;
  const GAP = 18;
  const INK = '11,11,13', FRINGE_L = '247,169,173', FRINGE_R = '168,226,234';

  function paint(canvas) {
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!host || !ctx) return;
    const w = host.clientWidth, h = host.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'multiply';
    const cx = w / 2, cy = h * 0.46;
    const dot = (x, y, r, rgb, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
      g.addColorStop(r > 1.6 ? 0.25 : 0.6, 'rgba(' + rgb + ',' + a + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    for (let y = (h / 2) % GAP; y < h; y += GAP) {
      for (let x = (w / 2) % GAP; x < w; x += GAP) {
        const dx = (x - cx) / (w * 0.62), dy = (y - cy) / (h * 0.6);
        const t = Math.min(1, Math.max(0, (Math.sqrt(dx * dx + dy * dy) - 0.35) / 0.65));
        const s = t * t * (3 - 2 * t);            // 0 in the middle, 1 at the edges
        const r = 1.1 + 2.2 * s;                  // softer as it nears the edge
        const fade = 1 - 0.85 * s;                // and fading out toward the edge
        dot(x, y, r, INK, 0.13 * fade / (1 + 1.2 * s));  // very subtle overall
        if (s > 0.05) {
          const len = Math.hypot(x - cx, y - cy) || 1, o = 2.6 * s;
          const ux = (x - cx) / len, uy = (y - cy) / len;
          dot(x + ux * o, y + uy * o, r, FRINGE_L, 0.32 * s * fade);   // red outward
          dot(x - ux * o, y - uy * o, r, FRINGE_R, 0.32 * s * fade);   // cyan inward
        }
      }
    }
  }

  function LensDots() {
    const ref = useRef(null);
    useEffect(() => {
      const c = ref.current;
      if (!c) return undefined;
      paint(c);
      const ro = 'ResizeObserver' in window ? new ResizeObserver(() => paint(c)) : null;
      if (ro) ro.observe(c.parentElement);
      return () => { if (ro) ro.disconnect(); };
    }, []);
    return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
  }

  window.LensDots = LensDots;
})();
