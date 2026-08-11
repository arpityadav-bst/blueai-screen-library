/* ============================================================================================
   bs-install-dialog.js — BLUESTACKS' OWN install dialog. NOT part of blueai-desktop's design
   system, and deliberately so.

   ── WHY THIS FILE IS THE WAY IT IS ─────────────────────────────────────────────────────────
   This dialog renders in Flow A: BlueStacks App Player is installed, BlueAI is NOT. So there is
   no BlueAI on the machine yet — no drawer, no `--bai-*` tokens, no modern-terminal theme, none
   of it exists at that moment. The software doing the talking is BlueStacks, and this is
   BlueStacks' UI. Designer's ruling, 2026-08-11: *"leave it as it is or use it exactly as it is,
   from blueAI product, and it shouldn't be a part of any Audit or style guide or DS or VDA for
   blueAI desktop."*

   Ported byte-faithfully from `blueai-product/blueai/install_dialog.jsx`. Every colour, size,
   weight, duration and string below is that file's value, NOT a blueai-desktop token — including
   BlueStacks' own greys (#1E2440 / #2B3559 / #98A2C4 / #6F7BA4), its blue (#1E7FE0), its green
   (#4ade80) and its Poppins stack. **Do not "fix" these to `--bai-*` tokens.** Doing so would be
   a real regression: it would put BlueAI's visual identity on software that, in this state, the
   user has not installed.

   ── WHY A VANILLA PORT RATHER THAN THE .jsx ────────────────────────────────────────────────
   The two prototypes do not share a runtime. blueai-product is React 18 + Babel-standalone +
   Tailwind, all from CDN; blueai-desktop is plain HTML/CSS/vanilla-JS whose defining contract is
   no build step and no JS dependencies. Copying the `.jsx` verbatim would have meant importing a
   transpiler and three CDN scripts into the one prototype built to have none. The designer chose
   the port (option A of three offered).
   The port is close to mechanical because the source is: it inline-styles everything, defines its
   own `ProgressShell`, and uses only useState/useEffect/useRef. Two things were deliberately NOT
   carried over: `PixelWave` (dead in the source — `<PixelWave` appears zero times in its own
   render after the layout revert; porting dead code is how dead code survives), and the `.jsx`'s
   `body2` prop, which no caller passes.

   ── HOW THE EXCLUSION IS STRUCTURAL, NOT A PROMISE ─────────────────────────────────────────
   `ds-drift-check.js` reads index.html, style-guide.html, blueai-desktop.css and
   blueai-icons.js. This dialog contributes **zero rules to blueai-desktop.css** — its styles are
   inline here and its one keyframe is injected by this file into its own <style> tag. So it is
   invisible to §1/§2/§7/§8/§12 by construction rather than by an exemption list somebody has to
   remember. The two RUNTIME audits do see the DOM, so they skip the `.bs-ui` scope by name —
   see their own headers. The style guide carries a note saying this surface exists and is out of
   scope, because a reader who has seen it in the product and cannot find it documented should
   learn that was deliberate.

   Everything in here is namespaced `.bs-*` / `bsInstall*`. That prefix is the boundary marker:
   `.bs-*` means "third-party chrome, not ours."
   ============================================================================================ */
(function () {
  'use strict';

  /* The indeterminate bar's keyframe, injected here rather than added to blueai-desktop.css —
     that file is the design system, and this is not part of it. Ported verbatim from
     product-scene.css's `.ba-indet`, renamed to `.bs-indet` for the boundary prefix.
     INDETERMINATE ON PURPOSE, and the source's reason is worth keeping: a percentage would imply
     we know how far along a download is, and nothing here downloads anything. (Flow B's inline
     card DOES show a percentage — that is a different component with a real timer of its own.) */
  var css = '.bs-indet{position:relative;overflow:hidden}'
    + '.bs-indet::after{content:"";position:absolute;top:0;bottom:0;width:38%;'
    + 'background:currentColor;border-radius:inherit;'
    + 'animation:bs-indet 1150ms cubic-bezier(0.45,0.05,0.55,0.95) infinite}'
    + '@keyframes bs-indet{from{left:-38%}to{left:100%}}';
  var st = document.createElement('style');
  st.id = 'bsInstallDialogStyles';
  st.textContent = css;
  document.head.appendChild(st);

  // BlueStacks' UI font from the product's own reference screenshots (Poppins), falling back to
  // the Segoe stack. Verbatim from the source file, including the fallback reasoning.
  var BS_FONT = '"Poppins", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif';

  var ICO_CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var ICO_CHECK_LG = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var ICO_X = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
  // Same glyph the product window's own titlebar minimize uses — reused there, reused here, so
  // the two minimize affordances read as one convention.
  var ICO_MIN = '<svg width="16" height="16" viewBox="0 0 10 10"><rect x="1" y="4.6" width="8" height="1" fill="currentColor"/></svg>';

  /* Flow A's content. Verbatim from blueai-product's `INSTALLERS.blueai`, which its own comment
     sources to the designer's "Full State 1" table (2026-08-11). No `cancelLabel` in the source's
     config — the dialog's default 'Not now' is what renders. */
  var CFG = {
    icon: 'assets/bluestacks/blueai-logo.png',
    title: 'Meet BlueAI',
    subtitle: 'Your AI worker that gets things done.',
    body: 'Tell BlueAI what you need, in plain words. It handles multi-step tasks across your BlueStacks apps, finds deals, claims rewards, creates content, and more.',
    meta: '182 MB · One-time setup',
    primaryLabel: 'Download BlueAI',
    cancelLabel: 'Not now',
    downloadingLabel: 'Downloading BlueAI…',
    doneLabel: 'BlueAI is installed. Launching it now…',
    downloadMs: 2800,
    doneMs: 900
  };

  var host = null, phase = 'idle', minimized = false, timers = [], onCompleteCb = null, onCancelCb = null;
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function progressShell() {
    var done = phase === 'done';
    var ink = done ? '#4ade80' : '#9fb4dd';   // the source's `dark` palette; the light one was Flow B's and Flow B has no modal
    return '<div style="width:100%">'
      + '<div style="display:flex;align-items:center;gap:7px;margin-bottom:' + (done ? 0 : 9) + 'px;color:' + ink + '">'
      + (done ? ICO_CHECK : '')
      + '<span style="font-size:12.5px;font-weight:600;color:' + ink + ';font-family:inherit">'
      + (done ? CFG.doneLabel : CFG.downloadingLabel) + '</span></div>'
      + (done ? '' : '<div class="bs-indet" style="height:4px;border-radius:999px;background:#2b3559;color:#1E7FE0"></div>')
      + '</div>';
  }

  function render() {
    if (!host) return;
    // Minimized = render nothing. No chip, no indicator — the window underneath just becomes
    // fully usable again. The timers keep running, so it completes on schedule regardless of
    // what is rendered; there is nothing to "restore" because minimize only appears during
    // 'downloading', a phase this dialog auto-advances out of on its own. (Source's reasoning.)
    if (minimized) { host.innerHTML = ''; return; }

    var iconBtn = 'width:26px;height:26px;display:flex;align-items:center;justify-content:center;border:none;border-radius:0;background:none;color:#98A2C4;cursor:pointer;padding:0';
    var btn = 'border:none;border-radius:0;padding:10px 20px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:background 130ms ease,opacity 130ms ease';
    var inner;

    if (phase === 'done') {
      /* Success screen — unchanged through every rebuild the source had. The circular badge is
         the ONE rounding exception in this dialog: an identity/completion mark, not chrome. The
         designer's rule for BlueStacks UI is no round radius on containers or CTAs, and the card
         and buttons below honour it at radius 0. */
      inner = '<div style="text-align:center;padding:10px 4px 6px">'
        + '<div style="width:64px;height:64px;border-radius:50%;background:rgba(74,222,128,0.14);color:#4ade80;display:flex;align-items:center;justify-content:center;margin:0 auto 18px">'
        + ICO_CHECK_LG + '</div>'
        + '<h2 style="font-size:17px;font-weight:600;color:#F2F5FF;line-height:1.35;text-wrap:balance">' + CFG.doneLabel + '</h2>'
        + '</div>';
    } else {
      var head = '<div style="display:flex;align-items:flex-start;gap:14px">'
        + '<img src="' + CFG.icon + '" alt="" style="width:44px;height:44px;flex-shrink:0" onerror="this.style.display=\'none\'">'
        + '<div style="flex:1;min-width:0">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">'
        + '<h2 style="font-size:18px;font-weight:500;color:#F2F5FF;line-height:1.1;text-wrap:balance">' + CFG.title + '</h2>'
        + '<div style="display:flex;align-items:center;gap:2px;flex-shrink:0">'
        + (phase === 'downloading' ? '<button data-act="min" aria-label="Minimize" style="' + iconBtn + '">' + ICO_MIN + '</button>' : '')
        + (phase === 'idle' ? '<button data-act="cancel" aria-label="Close" style="' + iconBtn + '">' + ICO_X + '</button>' : '')
        + '</div></div>'
        + '<p style="font-size:13px;font-weight:600;color:#5B9CF6;line-height:1.2;margin-top:2px">' + CFG.subtitle + '</p>'
        + '</div></div>';

      var footer = '<div style="display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:22px">'
        + (phase === 'idle'
          ? '<button data-act="cancel" style="' + btn + ';background:#F2F5FF;color:#1E2440">' + CFG.cancelLabel + '</button>'
            + '<button data-act="start" style="' + btn + ';background:#1E7FE0;color:white">' + CFG.primaryLabel + '</button>'
          : '<div style="width:100%">' + progressShell() + '</div>')
        + '</div>';

      inner = head
        + '<div style="height:1px;background:#2B3559;margin:16px 0"></div>'
        + '<p style="font-size:13.5px;line-height:1.6;color:#98A2C4">' + CFG.body + '</p>'
        + (phase === 'idle' ? '<p style="font-size:12px;color:#6F7BA4;margin-top:10px">' + CFG.meta + '</p>' : '')
        + footer;
    }

    host.innerHTML = '<div role="dialog" aria-modal="true" aria-label="' + CFG.title + '" '
      + 'style="position:relative;width:420px;background:#1E2440;border-radius:0;'
      + 'box-shadow:0 24px 70px rgba(0,0,0,0.55);font-family:' + BS_FONT.replace(/"/g, '&quot;') + ';padding:24px 24px 22px">'
      + inner + '</div>';
  }

  function start() {
    phase = 'downloading'; render();
    timers.push(setTimeout(function () { phase = 'done'; render(); }, CFG.downloadMs));
    timers.push(setTimeout(function () { if (onCompleteCb) onCompleteCb(); }, CFG.downloadMs + CFG.doneMs));
  }

  /* The scrim/host is CREATED HERE, not written into index.html, and that is load-bearing rather
     than tidiness. `ds-drift-check.js` §8 scans blueai-desktop.css AND index.html for raw
     `font-size:Npx` / `border-radius:Npx`; this dialog legitimately has both (18px, 13.5px,
     999px on the progress bar) because BlueStacks' values are not our tokens. §8 does NOT scan
     this file. So keeping every style — the host's included — inside here is what makes the
     exclusion structural: there is nothing for the gate to see, rather than something it has been
     told to ignore. index.html gets exactly one line: a <script> tag.
     Mounted inside `.composition` (the 1000×573 BlueStacks window box) rather than over `.stage`,
     so the scrim dims THAT WINDOW only — the product's `contained` behaviour, and its reason: a
     real app's modal dims its own window, not your entire Windows desktop. */
  function ensureHost() {
    host = document.getElementById('bsInstallHost');
    if (host) return host;
    var parent = document.getElementById('composition');
    if (!parent) return null;
    host = document.createElement('div');
    host.id = 'bsInstallHost';
    host.className = 'bs-ui';   // the boundary marker the runtime audits skip by name
    host.style.cssText = 'position:absolute;inset:0;z-index:400;display:none;'
      + 'align-items:center;justify-content:center;background:rgba(4,8,20,0.5);padding:16px;cursor:default';
    parent.appendChild(host);
    return host;
  }

  function open(opts) {
    opts = opts || {};
    onCompleteCb = opts.onComplete || null;
    onCancelCb = opts.onCancel || null;
    clearTimers(); phase = 'idle'; minimized = false;   // re-arm, so a cancelled-then-reopened install starts at idle
    if (!ensureHost()) return;
    host.style.display = 'flex';
    render();
  }
  function close() { clearTimers(); if (host) { host.style.display = 'none'; host.innerHTML = ''; } }

  // Delegated, so it survives every re-render without rebinding.
  document.addEventListener('click', function (e) {
    if (!host || host.style.display === 'none') return;
    var b = e.target.closest ? e.target.closest('button[data-act]') : null;
    if (!b || !host.contains(b)) return;
    var act = b.getAttribute('data-act');
    if (act === 'start') start();
    else if (act === 'min') { minimized = true; render(); }
    else if (act === 'cancel' && onCancelCb) onCancelCb();
  });

  // Scrim click and Esc both cancel, but ONLY before the install starts — there is no cancelling
  // a running install. Both behaviours are the source's.
  document.addEventListener('mousedown', function (e) {
    if (!host || host.style.display === 'none') return;
    if (e.target === host && phase === 'idle' && onCancelCb) onCancelCb();
  });
  document.addEventListener('keydown', function (e) {
    if (!host || host.style.display === 'none') return;
    if (e.key === 'Escape' && phase === 'idle' && onCancelCb) onCancelCb();
  });

  window.BsInstallDialog = { open: open, close: close, CFG: CFG };
})();
