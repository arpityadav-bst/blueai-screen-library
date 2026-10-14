/* BlueAI: the design system's tokens, "V2 today" look, as one JS object for the prototype's
   inline styles (2026-10-14). Mirrors blueai-product-v2-ds/tokens-v2-today.css in Arpit's
   blueai-screen-library (DESIGN.md, sections 03 to 10): same names, same values, so the parts
   built here read the same source the kit reads. When V2 moves onto the kit, this file goes and
   the kit's CSS classes take over. Keep the values in step with that CSS, never invent one here.

   Exposes window.V2Tokens. */
(function () {
  window.V2Tokens = {
    // Ink
    ink: '#111827', ink2: '#374151', ink3: '#6b7280', ink4: '#94a3b8', placeholder: '#9ca3af', onColor: '#ffffff',
    // Surface and lines
    canvas: '#f8fafc', surface: '#ffffff', panel: '#f8fafc', sunken: '#f1f5f9',
    washHover: 'rgba(115,155,195,0.10)', washPress: 'rgba(0,0,0,0.07)',
    line: '#e2e8f0', lineStrong: '#d1d5db', lineHair: '#eef2f6', lineHover: '#c7d2e1', linkUnderline: 'rgba(0,0,0,0.32)',
    // Blue
    blue: '#1990FF', action: '#1990FF', actionHover: '#359dff', blueInk: '#1e40af', blueTint: '#eff6ff', blueTintLine: '#bfdbfe',
    select: '#eef6ff', selectLine: '#1990FF',
    // Status
    success: '#16a34a', successInk: '#15803d', successTint: '#dcfce7', successLine: '#bbf7d0',
    dangerInk: '#ef4444', dangerTint: '#fdecec', dangerLine: '#f8d7d7', dangerEdge: '#d0454a',
    attentionTint: '#fdf6cf', attentionLine: '#f3e8a8', attentionInk: '#8a6116',
    // Type (px; weights: today's "medium" is 600 and "semibold" 700)
    font: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    text11: 10.5, text12: 12, text13: 13, text14: 13.5, text16: 17, text20: 20, text24: 24,
    wRegular: 400, wMedium: 600, wSemibold: 700,
    leadingTight: 1.2, leadingSnug: 1.4, leadingBody: 1.5,
    trackingTitle: '-0.4px', trackingEyebrow: '0.08em',
    // Space
    space1: 5, space15: 6, space2: 8, space3: 10, space4: 16, space5: 20, space6: 24,
    // Radius and stroke
    radiusXs: 4, radiusSm: 8, radiusMd: 10, radiusLg: 16, radiusPill: 999, radiusRound: '50%',
    stroke: 1, strokeSelected: 1.5,
    // Elevation and overlay
    shadow0: '0 1px 3px rgba(0,0,0,0.04)', shadow1: '0 10px 28px rgba(0,0,0,0.14)', shadow2: '0 20px 60px rgba(0,0,0,0.3)',
    scrim: 'rgba(0,0,0,0.5)',
    // Z
    zPopover: 30, zDialog: 60, zToast: 120,
    // Motion (ms)
    dur1: 150, dur2: 200, dur3: 250, dur4: 350, durCelebrate: 450,
    easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)', easeIn: 'cubic-bezier(0.5, 0, 0.75, 0.4)', easeStandard: 'ease',
    // Sizes
    controlSm: 28, controlMd: 34, controlLg: 44, hitMin: 32, dialogSm: 320, dialogMd: 382,
    rail: 6, popoverW: 364, markXl: 56, iconSm: 16, iconMd: 20
  };
})();
