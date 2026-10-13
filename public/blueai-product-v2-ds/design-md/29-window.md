## 29 Window and app frame

**Status:** AppFrame: Changed from V2. Window semantics and tray: New.

**Why:** BlueAI is a worker that runs once a day on its own. Its window has to fit the partner's laptop, and the worker has to outlive the window. V2's window is a fixed 866px tall (product-scene.css:76), which does not fit a 1366 x 768 laptop or a 1080p screen at 125%; its close button unmounts the whole app (index.html:933) and Minimize does nothing (index.html:553), so nothing can run or notify while it is closed.

### AppFrame (Changed from V2)

**Purpose.** The window's content box. Every screen lives inside it, and every dialog, sheet, toast and the splash is positioned against it, so nothing escapes the window.

**Anatomy.** Three bands in a column, plus an overlay plane:
1. Top bar, 52 tall, pinned (section 30).
2. Content band: the only part that scrolls. A screen puts its ScreenHeader and body here.
3. Bottom nav, 56 tall, pinned (section 31).
4. Overlay plane: the frame itself (`isolation: isolate`), so overlay layers stay inside the window.

**Variants.** Full (signed in). Compact (signed in, short screen). Chrome-free (signed out: no top bar, no nav; Welcome and Sign in).

**Sizes.** Content box 419 x 830 (`--v2-shell-w`, `--v2-shell-h`); compact 419 x 640 (`--v2-shell-min-h`). Content band 722 full, 532 compact. The Windows caption adds 34 (`--v2-titlebar-h`). The window opens at the content box plus caption, capped to the screen's work area, resizes in height only, never below 640. Ground `--v2-canvas`. One gutter, 16 (`--v2-gutter`).

**States.** Full: V2 `?start=worker`. Compact: new, no V2 equivalent (resize the window). Signed out: V2 bare URL (the welcome renders chrome-free, index.html:935).

**Props.** `AppFrame { compact, topBar, nav, children, overlays, landmark = true, className }`. Leaving out both `topBar` and `nav` gives the chrome-free frame. `landmark={false}` only for guide specimens (the content band is the page's `<main>`).

**Motion.** None on the frame. Screens change inside the content band with their own motion (section 07).

**Accessibility.** The content band is the `<main>` landmark; the top bar is a `<header>`, the nav a `<nav>`. Overlays live in the same window, so focus trapping (section 25) stays inside it. The content band scrolls with the keyboard because every screen has focusable content.

**Responsive.** Two heights only, 830 and 640; the width never changes. At 640 the content band scrolls and the bars stay. Never use `vh` inside the window: it measures the browser, not the frame.

**Do / Don't.** Do mount every overlay in `overlays`. Do design every screen for 640 too. Don't scroll the bars away. Don't give a band its own width (V2's chat column was 420 inside a 419 box, index.html:966).

### Window semantics and tray (New)

**Purpose.** What the window does when it is closed, minimized or quit, so the worker keeps its schedule and the partner always has one place to see it, skip a day or stop it. It keeps the setup promise "You can pause, stop, or disconnect anytime." (worker_flow.jsx:67).

**Anatomy.** Window behaviours plus a tray menu (Windows draws it; the kit's `TrayMenu` fixes its items, order and words): a head (mark, "BlueAI", a status line with a dot), a separator, Open BlueAI, then Skip today's run (only while today's run is still to come: scheduled, or it didn't start) or Resume runs (while paused), a separator, Quit BlueAI. Skip and Quit lead to a confirm step that states the cost (`kit/shell.jsx:39-63, 96-100`). Pausing runs for days is not a tray item: it lives in Settings > Worker, always with an end date (section 62).

**Variants.** Tray status: any RUN_STATUS key (section 30), in its tray words: scheduled ("Next run 11 am"), running ("Running today’s run"), pending ("Done today, pending verification"), missed ("Today’s run didn’t start. Run it by 9 pm"), paused ("Runs paused"), and the rest of section 30's table. Confirm: skip, quit.

**Sizes.** Specimen width `--v2-dialog-sm` (320); items 32 tall (`--v2-hit-min`), radius 6; surface, hairline, `--v2-shadow-1`, radius 10.

**States.** (All proposed copy; none exist in V2.)
- Close: hides to the tray, worker keeps its schedule. First time only, a Windows notification: "BlueAI is still running. Your next run is at 11 am."
- Minimize: to the taskbar; the running dash stays.
- Reopen (taskbar, tray, notification): restores the last screen at once, no splash.
- Tray click: opens BlueAI. Right-click: the tray menu.
- Skip today's run (offered only while today's run is still to come): confirm "Skip today’s run?" / "Today won’t count toward your 20 days. Runs start again tomorrow." [Keep today’s run] [Skip today] (danger). It skips one day; it never pauses runs.
- Resume runs (offered only while paused): resumes at once, no question.
- Quit BlueAI: confirm "Quit BlueAI?" / "Today’s run won’t happen while BlueAI is closed, so today won’t count." [Keep running] [Quit] (danger). Once today is settled (pending, done, not counted, verified, period ended): "Today is done. Your next run won’t happen while BlueAI is closed." No question while runs are paused: the host passes no confirm.
- PC restarts: BlueAI starts with Windows into the tray, window closed (proposed; a switch in Settings > Worker).
- Sign out: signs out and pauses the worker, and the confirm says so (section 64; V2's Logout confirm does not sign out, index.html:1000).

**Props.** `TrayMenu { runStatus (a RUN_STATUS key, section 30; 'done' reads as 'pending'), statusLabel (the real time or count; default the tray words), onOpen, onSkip, onResume, onQuit, confirm: null | 'skip' | 'quit', onConfirm, onCancel }`.

**Motion.** None in the product (Windows animates its own menu).

**Accessibility.** Specimen uses `role="menu"` / `menuitem`; the confirm is an `alertdialog` labelled by its title and described by its body. The status dot is decorative; the words carry the state.

**Responsive.** Not applicable (OS surface).

**Do / Don't.** Do say the cost of Skip and Quit before the click. Do use the same status words as the top bar chip. Don't stop runs when the window closes. Don't replay the splash on reopen. Don't hide Quit.
