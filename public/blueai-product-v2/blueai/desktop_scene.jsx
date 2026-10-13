// BlueAI — the Windows desktop scene the product window sits on.
// Exports: window.DesktopScene
//
// Mirrors /blueai-desktop's .stage / .scaler / .composition architecture: one wallpaper,
// one scale() that keeps the whole scene inside the viewport, and a flex row holding the
// BlueStacks App Player window and the BlueAI app window.
//
// The one non-obvious part is the FLIP shift. Scene geometry is derived entirely from two
// booleans, so when a window mounts the row's width changes and the row re-centres — which
// would teleport the window that was already on screen. So before the browser paints the new
// layout we translate the row by exactly the distance the surviving window moved, then release
// it with a transition: the old window appears to stay put while the new one slides in beside it.

(function () {
  const { useEffect, useRef } = React;

  const BS_W = 1000, BS_H = 573;   // BlueStacks window (frames are 1394x799 = the same 1.745 ratio)
  const WIN_W = 421, WIN_H = 866;  // BlueAI window: 830 content + 34 titlebar + 2 border
  const SIDE_W = 820, SIDE_H = 700; // the web browser window (ROB-21388), left of everything
  const GAP = 16, PAD = 48, MIN_SCALE = 0.3;

  const FRAMES = [
    'assets/bluestacks/bs-home.png',
    'assets/bluestacks/bs-loading.png',
    'assets/bluestacks/bs-play-youtube.png'
  ];

  /* BlueAI's taskbar button. The wallpaper's taskbar (and its five icons) is painted into
     desktop-bg.png, so this one live button is placed in the free slot right of the painted icons
     (their centres sit at x 872..1048.5, 44px apart; the band runs y 1032..1077), in IMAGE pixels,
     then mapped through the same `cover` + `center` maths the CSS background uses. */
  const IMG_W = 1917, IMG_H = 1077;
  const TB = { cx: 1092.5, top: 1034, size: 40 };

  // Row order: [browser] gap [BlueStacks] gap [BlueAI]. `side` is the browser window (ROB-21388).
  const sceneW = (side, bs, win) => (side ? SIDE_W : 0) + (side && (bs || win) ? GAP : 0) + (bs ? BS_W : 0) + (bs && win ? GAP : 0) + (win ? WIN_W : 0);
  const sceneH = (side, bs, win) => Math.max(side ? SIDE_H : 0, bs ? BS_H : 0, win ? WIN_H : 0);

  // Horizontal centre of one window relative to the row's centre, for the given window set.
  const centerOf = (anchor, side, bs, win) => {
    const W = sceneW(side, bs, win);
    const sideOff = side ? SIDE_W + GAP : 0;
    const offset = anchor === 'side' ? 0 : (anchor === 'bs' ? sideOff : sideOff + (bs ? BS_W + GAP : 0));
    const size = anchor === 'side' ? SIDE_W : (anchor === 'bs' ? BS_W : WIN_W);
    return -W / 2 + offset + size / 2;
  };

  function DesktopScene({ bsInstalled, winPresent, bsScreen = 'home', bsLive, bsTitle, onBsClick, onEmptyClick, bsOverlay, sideWindow, aiInstalled, aiOpen, aiAttention, onAiClick, children }) {
    const scalerRef = useRef(null);
    const compRef = useRef(null);
    const prev = useRef(null);
    const tbRef = useRef(null);
    const sidePresent = !!sideWindow;   // the browser window (ROB-21388) is on the desktop

    // Keep the taskbar button glued to the painted taskbar at any viewport size.
    useEffect(() => {
      const place = () => {
        const el = tbRef.current; if (!el || !el.parentElement) return;
        const { width: vw, height: vh } = el.parentElement.getBoundingClientRect();
        const s = Math.max(vw / IMG_W, vh / IMG_H);
        el.style.left = ((vw - IMG_W * s) / 2 + (TB.cx - TB.size / 2) * s) + 'px';
        el.style.top = ((vh - IMG_H * s) / 2 + TB.top * s) + 'px';
        el.style.setProperty('--tb', s);
      };
      place();
      window.addEventListener('resize', place);
      return () => window.removeEventListener('resize', place);
    }, [aiInstalled]);

    // Preload every BlueStacks frame once, so a mid-flow frame swap never flashes empty.
    useEffect(() => { FRAMES.forEach((src) => { const i = new Image(); i.src = src; }); }, []);

    // Fit the WINDOWS to the viewport — same job /blueai-desktop's fit() does for .composition.
    // The wallpaper isn't part of this: it's a `cover` background on the unscaled .pscene, so it
    // always fills edge to edge regardless of viewport shape. Measured against the currently
    // VISIBLE windows, not a fixed maximum — a lone 421px window isn't shrunk to make room for a
    // BlueStacks window that isn't installed.
    useEffect(() => {
      const fit = () => {
        const el = scalerRef.current; if (!el) return;
        const vw = window.innerWidth || document.documentElement.clientWidth || 1280;
        const vh = window.innerHeight || document.documentElement.clientHeight || 800;
        const W = sceneW(sidePresent, bsInstalled, winPresent) || WIN_W;
        const H = sceneH(sidePresent, bsInstalled, winPresent) || WIN_H;
        let s = Math.min((vw - 2 * PAD) / W, (vh - 2 * PAD) / H, 1);
        if (!(s > 0)) s = 1;                      // guard a 0/negative viewport reading
        el.style.setProperty('--scale', Math.max(MIN_SCALE, s));
      };
      fit();
      const raf = requestAnimationFrame(fit);     // catch late layout
      window.addEventListener('resize', fit);
      return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
    }, [sidePresent, bsInstalled, winPresent]);

    // FLIP: hide the re-centring jump when a window mounts or closes.
    useEffect(() => {
      const was = prev.current;
      prev.current = { side: sidePresent, bs: bsInstalled, win: winPresent };
      if (!was || (was.side === sidePresent && was.bs === bsInstalled && was.win === winPresent)) return;

      // The anchor is a window present BOTH before and after. If there isn't one, nothing was
      // on screen to jump, so there is nothing to hide. BlueAI's window first: it is the one the
      // person is looking at when the browser opens beside it.
      const anchor = (was.win && winPresent) ? 'win' : ((was.bs && bsInstalled) ? 'bs' : ((was.side && sidePresent) ? 'side' : null));
      if (!anchor) return;
      const shift = centerOf(anchor, was.side, was.bs, was.win) - centerOf(anchor, sidePresent, bsInstalled, winPresent);
      const el = compRef.current;
      if (!el || !shift) return;

      el.classList.add('pscene-comp--noanim');
      el.style.transform = 'translateX(' + shift + 'px)';
      void el.offsetWidth;                        // force the shifted state to commit...
      el.classList.remove('pscene-comp--noanim'); // ...so releasing it animates instead of snapping
      el.style.transform = '';
    }, [sidePresent, bsInstalled, winPresent]);

    /* Clicking the bare wallpaper does nothing while a window is up — this is a desktop, not a
       dismissible drawer. The ONE exception is an empty desktop: BlueAI's ✕ can leave nothing on
       screen when BlueStacks isn't installed, and that would be a dead end. This is a stopgap —
       an undiscoverable one — and the real fix is a BlueAI desktop shortcut icon. */
    const empty = !bsInstalled && !winPresent;

    return (
      <div className="pscene"
        onClick={empty && onEmptyClick ? onEmptyClick : undefined}
        style={empty && onEmptyClick ? { cursor: 'pointer' } : undefined}>
        <div className="pscene-scaler" ref={scalerRef}>
          <div className="pscene-comp" ref={compRef}>
            {sideWindow}
            {bsInstalled &&
              <div
                className={'pscene-bs pscene-win-in' + (bsLive ? ' pscene-bs--live' : '')}
                data-screen={bsScreen}
                onClick={bsLive ? onBsClick : undefined}
                role={bsLive ? 'button' : 'img'}
                tabIndex={bsLive ? 0 : undefined}
                onKeyDown={bsLive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBsClick(); } } : undefined}
                title={bsTitle || undefined}
                aria-label={bsTitle || 'BlueStacks App Player'}>
                {/* BlueStacks' own dialogs live INSIDE the player window and dim only it. */}
                {bsOverlay}
              </div>}
            {children}
          </div>
        </div>
        {/* Running-app dash, a longer pill while the window is up, and an amber flash-then-hold
           when BlueAI needs an answer (Windows' own "this app needs you" signal). Clicking it
           reopens a closed window. */}
        {aiInstalled &&
          <button ref={tbRef} type="button" aria-label="BlueAI" title="BlueAI"
            className={'pscene-tb-ai' + (aiOpen ? ' pscene-tb-ai--open' : '') + (aiAttention ? ' pscene-tb-ai--attn' : '')}
            onClick={(e) => { e.stopPropagation(); if (onAiClick) onAiClick(); }}>
            <img src="assets/Logo.png" alt="" draggable="false" />
          </button>}
      </div>);
  }

  window.DesktopScene = DesktopScene;
})();
