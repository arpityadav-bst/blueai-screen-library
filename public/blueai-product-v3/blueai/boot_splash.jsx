// BlueAI: Boot Splash + Shimmer utility + the two home skeletons
// Exports: BootSplash, Shimmer, HomeSkeleton, WorkerHomeSkeleton

(function () {
  const { useState, useEffect } = React;

  /* ── Shimmer block ─────────────────────────────────────────── */
  /* The kit's skeleton block (kit/feedback.css .v2-skel) with its shimmer (kit/motion.css
     .v2-anim-shimmer, on the token clock); only the block's size and radius are this call's, the
     radius the kit skeleton's own by default. */
  function Shimmer({ w = '100%', h, r = 'var(--v2-radius-xs)', extra = {} }) {
    return <div className="v2-skel v2-anim-shimmer" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...extra }} />;
  }

  /* ── Boot Splash ───────────────────────────────────────────── */
  function BootSplash({ onDone }) {
    // Live app shows two messages on cold start: "Starting BlueAI…" → "Loading your skills…".
    const MSGS = [
      'Starting BlueAI…',
      'Loading your skills…',
    ];
    const [idx, setIdx]       = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
      const msgT  = setTimeout(() => setIdx(1),        1050);
      const fadeT = setTimeout(() => setFading(true),  2150);
      const doneT = setTimeout(() => onDone?.(),       2650);
      return () => [msgT, fadeT, doneT].forEach(clearTimeout);
    }, []);

    /* V3 Phase 1, the Target splash (design-md 33), the kit's since review round 1 (kit/shell.css
       .v2-splash): surface ground, the onBlue BlueAI logo, three 6px blue dots pulsing (progress,
       not brand), one status line in ink-3. Same two messages and the same timings as before; the
       fade runs on --v2-dur-4 with the departure curve, well inside the 500ms before onDone. */
    return (
      <div className={'v2-splash' + (fading ? ' is-fading' : '')}>
        <window.BlueAILogo size={30} />
        <div className="v2-splash-dots" aria-hidden="true">
          <span className="v2-splash-dot" /><span className="v2-splash-dot" /><span className="v2-splash-dot" />
        </div>
        <p role="status" className="v2-splash-status">{MSGS[idx]}</p>
      </div>
    );
  }

  /* ── Home skeletons (chat cold-start), in the shape of what arrives: the kit's skeleton shapes
     (V2Kit.Skeleton, kit/progress.jsx) on the real parts, so every size is the parts' own. ── */
  const Skel = (p) => React.createElement(window.V2Kit.Skeleton, p);

  /* The category list (ProductHome): the eyebrow, then the kit's rows in one pad-none card (review
     round 2: a 32 mark, the label and its description, the count, the chevron). */
  function HomeSkeleton() {
    return (
      <div>
        <Skel width="40%" height="var(--v2-text-11)" className="v3-home-eyebrow" />
        <div className="v2-card v2-card--pad-none">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="v2-row v2-row--divider">
              <Skel shape="circle" width="var(--v2-mark-md)" />
              <span className="v2-row-text"><Skel width="46%" /><Skel width="82%" /></span>
              <Skel width="var(--v2-icon-lg)" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* The BlueAI worker home (MoneyMakerHome, the default session; review round 2): the worker card
     (its tile, three lines, the Run button). */
  function WorkerHomeSkeleton() {
    return (
      <div className="v2-card v3-wk-home" aria-busy="true">
        <Skel shape="rect" width="var(--v2-mark-lg)" height="var(--v2-mark-lg)" />
        <span className="v2-skel-lines v2-grow"><Skel width="40%" /><Skel width="85%" /><Skel width="50%" /></span>
        <Skel shape="rect" width="calc(var(--v2-control-md) * 2)" height="var(--v2-control-md)" />
      </div>
    );
  }

  Object.assign(window, { BootSplash, Shimmer, HomeSkeleton, WorkerHomeSkeleton });
})();
