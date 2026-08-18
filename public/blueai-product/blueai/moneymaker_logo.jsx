// BlueAI — MoneyMaker welcome screen's hero logo: the mark plus a grain overlay, its
// cursor-proximity morph, its entrance travel, and its own keyframes + SVG noise filter. Split out
// of moneymaker.jsx (2026-08-18) when that file crossed the workspace's 300-line rule.
//
// Clean seam: nothing else on the screen reads or writes any of this. The keyframes live here WITH
// the markup rather than in the welcome screen's shared <style> block, deliberately — the two layers
// only work because their opacities and delays are tuned against each other, and splitting the rules
// from the elements they tune is how that kind of thing drifts.
//
// HISTORY, so it isn't re-proposed: two brand-light treatments sat behind the mark and both were
// removed on the designer's call — a pulsing iris→cyan radial ring, then the drifting three-blob
// glow mesh that replaced it (both gone 2026-08-18, along with every keyframe and rule they owned).
// The mark carries the moment on its own now. The page still has its own ambient orbs, but those
// belong to MMBackdrop in moneymaker_backdrop.jsx and are a separate, page-wide treatment.
//
// Exposes window.MoneyMakerLogo = { HeroLogo }.
(function () {
  const { useState, useRef, useEffect } = React;

  /* Positioned at 10% + 25px from the top of the screen, sized 170 (was 150, briefly 200), and
     faint overall — an explicit 0.55 resting opacity on top of the fade mask, so even the "solid"
     top half reads as translucent. This is background presence, not a foreground element.

     LAYERING, back to front: mark → grain, both carrying that 0.55 via .mm-logo-art.

     The mark's fade-out uses six mask stops rather than four, each a smaller step
     (0.88→0.68→0.48→0.28→0.1→0) spread from 40% to 98%, so the dissolve reads as continuous
     instead of as a sequence of visible bands. The grain is a SIBLING layer sharing that exact
     mask, not a filter on the <img>: a CSS filter replaces an element's rendering rather than
     compositing with it, so grain applied directly to the image would have erased the image. */
  function HeroLogo() {
    /* Cursor-driven morph — the mark stretches/scales toward the pointer as it gets close, easing
       back to rest as it moves away. Measures its own screen rect rather than assuming where it
       sits, so it stays correct under the desktop scene's own scaling transform. A window-level
       listener, not one scoped to the element, because "getting near" has to be reacting before the
       cursor is actually over it. */
    const logoRef = useRef(null);
    const [morph, setMorph] = useState({ scale: 1, skewX: 0, skewY: 0 });
    useEffect(() => {
      const RADIUS = 180; // px from the mark's center where the pull starts
      const handleMove = (e) => {
        const el = logoRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const prox = Math.max(0, 1 - dist / RADIUS); // 0 far, 1 right at the center
        setMorph({ scale: 1 + prox * 0.12, skewX: (dx / RADIUS) * prox * 7, skewY: (dy / RADIUS) * prox * 7 });
      };
      window.addEventListener('mousemove', handleMove);
      return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    // No translateX(-50%): the wrapper centers itself with a negative margin instead, precisely so
    // its own `transform` stays free for the entrance travel. Two elements, two transforms, neither
    // fighting the other over one property.
    const morphTransform = `scale(${morph.scale.toFixed(3)}) skew(${morph.skewX.toFixed(2)}deg, ${morph.skewY.toFixed(2)}deg)`;
    const FADE = 'linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,0.88) 50%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.48) 70%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.1) 90%, transparent 98%)';

    return (
      <>
        <style>{`
          /* Two classes, because travel and faintness belong to different elements.

             .mm-logo (the wrapper) owns TRAVEL only: transform + the entrance blur. It deliberately
             carries no opacity — while the brand glow still existed, a fade on the wrapper became a
             ceiling on everything nested inside it, which is what made that glow invisible. The glow
             is gone, but the split stays: the wrapper is a positioning-and-motion shell, and mixing
             appearance into it is what caused the bug.

             .mm-logo-art (the mark + its grain layer) owns the FAINTNESS: the 0.55 resting opacity,
             plus the perpetual brighten pulse. That pulse animates opacity ONLY — it used to animate
             filter too, which silently overrode the grain layer's filter: url(#mmGrain) and switched
             the noise off the moment the pulse started. Opacity carries the whole "getting brighter"
             read on its own.

             (Backticks, not quotes, inside these CSS comments — this is CSS inside a JS template
             literal, and a backtick would end the string. That mistake blanked this screen once.) */
          @keyframes mmLogoTravel { from { transform: translateY(170px); filter: blur(18px); } to { transform: translateY(0); filter: blur(0); } }
          @keyframes mmLogoArt { from { opacity: 0; } to { opacity: 0.55; } }
          @keyframes mmLogoBright { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
          /* Delays continue the welcome screen's intro timeline (title 0s → card 0.9s → CTA 1.65s):
             the logo travels 2.2-4.6s, then its brighten pulse picks up at exactly 4.6s — the moment
             the entrance ends — so there's no visible seam between arriving and settling. */
          .mm-logo { animation: mmLogoTravel 2.4s cubic-bezier(0.4,0.85,0.2,1) 2.2s both; }
          .mm-logo-art { animation: mmLogoArt 2.4s cubic-bezier(0.4,0.85,0.2,1) 2.2s both, mmLogoBright 4s ease-in-out infinite 4.6s; }
          @media (prefers-reduced-motion: reduce) {
            .mm-logo { animation: none !important; }
            .mm-logo-art { animation: none !important; opacity: 0.55 !important; }
          }
        `}</style>

        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="mmGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0" />
          </filter>
        </svg>

        <div className="mm-logo" aria-hidden="true" style={{ position: 'absolute', top: 'calc(10% + 25px)', left: '50%', marginLeft: -85, zIndex: 1, width: 170, height: 170, pointerEvents: 'none' }}>
          <img ref={logoRef} className="mm-logo-art" src="assets/BAILogo2.svg" alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, transform: morphTransform, transition: 'transform 0.25s ease-out', WebkitMaskImage: FADE, maskImage: FADE }} />
          {/* borderRadius:50% clips the grain to a circle matching the mark's own shape — without
             it this is a square div and the feTurbulence output showed past the round edges in its
             corners. The fade mask still applies inside that circle. Shares the SAME morphTransform
             as the image above (not its own measurement) so the two stay pixel-aligned as they warp
             together, and the same .mm-logo-art so they fade and pulse together. */}
          <div className="mm-logo-art" style={{ position: 'absolute', inset: 0, opacity: 0, transform: morphTransform, transition: 'transform 0.25s ease-out', borderRadius: '50%', filter: 'url(#mmGrain)', WebkitMaskImage: FADE, maskImage: FADE }} />
        </div>
      </>);
  }

  window.MoneyMakerLogo = { HeroLogo };
})();
