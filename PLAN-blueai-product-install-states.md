# /blueai-product — Windows desktop scene + the two install states

Plan, written 2026-08-10. Scope: `blueai/public/blueai-product/**` only. Nothing under
`public/blueai-desktop/**` is edited — its two scene assets are **copied out**, read-only.

---

## STATUS — 2026-08-10 · both flows BUILT and VERIFIED

`http://localhost:8411/blueai-product/` (launch.json entry `blueai-product`).

**Deep-links** — every state has a URL, so a review link points at the screen being discussed:

| URL | State |
|---|---|
| `?bai=0` | Flow A start — BlueStacks alone |
| `?bai=0&dlg=blueai` | Flow A's installer popup |
| `?bs=0` | Flow B start — BlueAI alone |
| `?bs=0&ask=Check trending videos on YouTube` | the "needs BlueStacks" chat reply |
| `?bs=0&dlg=bluestacks` | Flow B's installer popup |

`?bs=0&bai=0` is refused by the same guard the Preview chips enforce.

**Verified in the browser, not by reading code.** Flow A: each phase label renders, the dialog
closes, the window mounts, ✕ → reopen does **not** re-run the installer, and unchecking the last
chip flips the other on. Flow B: the CTA gates only app-named tasks, Cancel leaves nothing
installed and the CTA re-openable, and — the part worth checking — **each narration line lands on
the frame it describes** (`BlueStacks is starting…` on `loading`, `Opening the Play Store…` on
`home`, `Found YouTube…` on `play-youtube`). Content box measures exactly 830px; scale 1.0 at
1920×1080, 0.93 at 1440×900. All 18 `CATS_LIVE` prompts spot-checked through `needsApp()`.

**Four deviations from the plan below, all deliberate:**

1. **The installer is scoped to the window that raises it**, not the viewport (§7 had a viewport
   scrim). A full-desktop scrim dimmed the wallpaper and the dev panel; the reference screenshots
   dim only the player. Flow A's dialog now lives inside the BlueStacks window, Flow B's inside the
   BlueAI window — one `contained` prop, and the symmetry falls out of "whoever is talking dims".
2. **Social Media is NOT category-gated** (§10 D2 said it was — and then contradicted itself by
   listing two Social Media prompts as ungated). Game Helpers is category-gated; everything else
   goes by token. Over-gating is the more visible error: blocking "draft sponsorship pitches" on an
   Android emulator looks broken, while a feed-read task quietly succeeding does not. The cost is
   two of seven Social Media prompts running ungated.
3. **The third BlueStacks frame only fires for YouTube.** We hold one Play-Store listing screenshot.
   Ask for TikTok and the sequence rests on the BlueStacks home screen with "Opening TikTok…", rather
   than showing a YouTube listing under the words "Found TikTok" — caught in regression, fixed via
   `NeedsBluestacks.PLAY_FRAME`. Add a listing screenshot there to extend it.
4. **The Preview panel moved to the bottom LEFT.** Bottom-right covered the product's own bottom
   nav once the window became the right-hand member of a 1437px row. Designer approved.

---

## Round 2 — 2026-08-10 (designer: dark panel · wallpaper scales · do the split)

**1. Preview panel is dark.** One `DEV` palette object in `index.html` (near-black `#111524`,
muted ink, `#1a6fc4` active) covering the card, the segmented rows, the install chips, the
dividers and the collapsed gear. It rests at 88% opacity and comes fully forward on hover. It
shares nothing with the product's light system on purpose — it is a tool sitting on a desktop,
not product UI, and the white card was pulling attention off the work.

**2. The wallpaper now scales with the windows.** New `.pscene-screen` — a fixed **1920×1080**
"monitor" carrying the wallpaper, sitting inside the scaler. Before, the wallpaper was a
viewport-level `cover` while the windows were scaled, so shrinking the browser cropped the
desktop's icons and taskbar *and* put the two at different scales; it read as a zoomed crop
rather than a desktop. Now one scale drives wallpaper and windows together. `fit()` is simpler
for it: `min(vw/1920, vh/1080, 1)`, no longer dependent on which windows are present.

**Capped at 1 deliberately** — past that we would upscale a 1917px wallpaper into blur and the
product UI would stop being pixel-exact, which is what makes this artifact reviewable. So
**1920×1080 is the reference size**: at that size the desktop is exactly full-screen and the app
is 1:1. Smaller viewports shrink everything together (letterboxed against `#07090f`); larger ones
centre the screen at 1:1. If you'd rather it fill a 1440p monitor, it's the `, 1)` in `fit()`.

**3. The split is done.** `chat_product.jsx` went from 648 lines to four files, all under 300:

| File | Lines | Holds |
|---|---|---|
| `chat_feedback.jsx` | 204 | `ThumbIcon` → `ReasonChips` → `FeedbackThumbs` |
| `chat_bubbles.jsx` | 184 | every message bubble + `makeTaskSteps` / `makeResumeSteps` + `ChatStatesPreview` |
| `product_home.jsx` | 124 | `CATS_LIVE` + the category home |
| `chat_product.jsx` | 184 | `ChatScreen` only — conversation, composer, send rules |

Sliced programmatically from the original line ranges rather than retyped, so no transcription
drift. Cross-file references resolve at **render** time (thin `React.createElement` forwarders),
so no file carries a load-order dependency on its siblings and reordering the script tags cannot
break it silently. Only `window.ProductChat` still leaks from `chat_product.jsx`, as before.

Four siblings remain over the rule and were not touched: `credits_widget.jsx` 1044, `chat.jsx`
813, `skills.jsx` 630, `tweaks-panel.jsx` 541.

---

## 1. What we're building

`/blueai-product` today is a 421×830 app window floating on a flat `#e2e8f0` page. It becomes a
**fake Windows desktop** (same wallpaper + BlueStacks App Player window as `/blueai-desktop`) and
gains a two-checkbox install model in the Preview panel:

- **BlueStacks App Player installed** — on/off
- **BlueAI Windows software installed** — on/off

Three of the four combinations are real screens; two of them are new flows:

| BlueStacks | BlueAI | Scene | New? |
|---|---|---|---|
| ✓ | ✓ | wallpaper + BS window + BlueAI window side by side | scene is new, product unchanged |
| ✓ | ✗ | wallpaper + BS window only → **Flow A** (BlueStacks asks you to install BlueAI) | **NEW** |
| ✗ | ✓ | wallpaper + BlueAI window only → **Flow B** (BlueAI asks you to install BlueStacks) | **NEW** |
| ✗ | ✗ | undefined — see Decision D4 | — |

---

## 2. Facts the plan is built on (read from code, not recalled)

**`/blueai-product`** — `index.html` (661 lines) is the harness: an `App()` with ~20 `useState`
preview flags, a `PreviewRow` segmented control, a fixed bottom-right Preview card, and `.ba-app`
(421×830, radius 16, `#f8fafc`, centered in `#root`). Screens are `window.*` globals loaded from
`blueai/*.jsx` via Babel-standalone — no build step.

**Established idiom to follow, not reinvent:** `zeroCredits` + `onNoCredits` already do exactly the
shape we need — App owns the flag, passes it into `ProductChatScreen`, chat calls back up on send,
App opens the modal. `needsBluestacks` + `onGetBluestacks` will mirror it 1:1.

**Chat bubbles** live in `chat_product.jsx` (601 lines): `UserBubble`, `StatusBubble`,
`WarningBubble` (`#fff7ed` / `#fed7aa` / `#9a3412`), `FinalBubble` (`FINAL_STYLES` = success
`#d9fbe4` · fail `#fdecec` · needsInput `#fdf6cf`), `ThinkingBubble`. `run()` is the send path;
`makeTaskSteps()` is the scripted task. Max bubble width 290–310.

**`/blueai-desktop` scene** (`blueai-desktop.css` L16–52, marked *OUT OF DS SCOPE — demo desktop
scene*): `.stage` fixed inset-0 with `desktop-bg.png` cover → `.scaler` with `--scale` →
`.composition` 1000×573 → `.bs-window` 100%/100% CSS background (deliberately a background, **not**
an `<img>`, so Chrome's Visual-Search hover button never attaches). `fit()` at L3243 keeps the open
composition inside the viewport. We copy this architecture; we do not import its CSS (its `--bai-*`
tokens are `.drawer`-scoped and the product is a different design system).

---

## 3. Assets

| File (target) | Source | Status |
|---|---|---|
| `assets/desktop-bg.png` | copy of `blueai-desktop/assets/desktop-bg.png` (1917×1077) | I copy it |
| `assets/bluestacks/bs-home.png` | copy of `blueai-desktop/assets/bluestacks-window.png` (1394×799 — the App Center home) | I copy it |
| `assets/bluestacks/bs-loading.png` | **your reference #1** — purple planets, "Loading…", "Starting BlueStacks" progress bar | **you must drop the file** |
| `assets/bluestacks/bs-play-youtube.png` | **your reference #2** — Google Play YouTube detail card with Launch / More Details | **you must drop the file** |

Your two screenshots are 1600×900 (1.778); the BS window box is 1.745. I'll crop-to-fill all three
BS frames to exactly **1394×799** so the CSS `100% 100%` sizing never stretches them and the three
frames swap with zero geometric jump.

The three modal screenshots (Media Gallery, BlueStacks Manager, New instance) are **design
reference only** — no file needed. The dialog is rebuilt in CSS from them (§6).

---

## 4. Scene architecture

New file `product-scene.css` (the demo scene stays out of the product's own style block, same
separation `/blueai-desktop` uses):

```
.pscene            fixed inset-0, desktop-bg.png center/cover
  .pscene-scaler   transform: scale(var(--scale,1))
    .pscene-comp   flex row, gap 16, align-items:center
      .pscene-bs   1000×573, bs frame as CSS background, cursor:pointer   (absent when BS ✗)
      .ba-app      421×864 = 34px titlebar (D1) + the untouched 830px content box
```

- Scene box: **1437 × 864** both-installed (1000 + 16 + 421; BS vertically centred against the
  taller BlueAI window). BlueAI-only: **421 × 864**.
- `fit()`: `s = min((vw-96)/W, (vh-96)/864, 1)`, floor `0.35`, recomputed on load/resize and after
  either install completes. 1920×1080 → 1.0 (no downscale). 1440×900 → 0.93.
- **BS appearing mid-flow must not shove the BlueAI window.** Same trick as
  `.composition.shift`: the comp translates `-508px` (half of 1000+16) when BS mounts, 320ms
  `cubic-bezier(.22,.61,.36,1)`, so BS grows in from the left while BlueAI stays visually put.
- Clicking bare wallpaper does nothing (unlike `/blueai-desktop`, the product window is not a
  dismissible drawer).
- `html, body { overflow: hidden }` — the page no longer scrolls; the Preview card stays
  `position: fixed` outside `.pscene-scaler` so it never scales.

---

## 5. Flow A — BlueStacks ✓, BlueAI ✗

Only the BS window is on screen, showing `bs-home.png`, `cursor: pointer`, `title="Install BlueAI"`.

| # | Trigger / phase | What happens | Timing |
|---|---|---|---|
| 1 | click anywhere on the BS window | `InstallDialog` skin **bluestacks** fades in, centred **on the BS window** (BlueStacks' own dialogs are centred inside the player, per your Media Gallery / New-instance refs) | 160ms |
| 2 | phase `idle` | Title **"BlueAI needs a few more files"** · body "BlueAI runs as a companion app alongside BlueStacks App Player. It needs an additional component (~180 MB) downloaded once before it can start." · primary **Download and Install** · secondary **Not now** | — |
| 3 | click Download and Install | button turns into its own progress shell: **indeterminate** shimmer bar + label "Downloading…", not a percentage (a fake % implies real progress we don't have) | 2800ms |
| 4 | phase `done` | button → green check + **"BlueAI installed — launching…"**, buttons non-interactive | 900ms |
| 5 | auto | dialog fades out, `baiInstalled = true`, `.ba-app` mounts, comp shifts, `fit()` re-runs, and the existing `BootSplash` plays inside it exactly as on a cold start | 140ms + boot |

Cancel/✕ at any point before step 4 closes the dialog and leaves the state untouched.

---

## 6. Flow B — BlueStacks ✗, BlueAI ✓

Only the BlueAI window is on screen, centred on the wallpaper. The product behaves normally until a
task needs an Android app.

| # | Trigger / phase | What happens | Timing |
|---|---|---|---|
| 1 | user sends e.g. *"Check trending videos on YouTube"* | `UserBubble` renders as usual | 250ms |
| 2 | | **`NeedsBluestacksBubble`** — a new chat state, info-blue (`#eff6ff` / `#bfdbfe` / `#1e40af`), sibling of `WarningBubble`: icon + "This one runs inside BlueStacks App Player. BlueAI drives apps like YouTube there, and BlueStacks isn't installed on this PC yet." + an in-bubble **Get BlueStacks** button (48px tall block button, `#1990FF`) | 700ms |
| 3 | click Get BlueStacks | `InstallDialog` skin **blueai** (see D3) opens at **scene level**, not inside the 421px window — it's an OS-level installer, not app UI. Title "BlueStacks App Player required" · body · **Download and Install** / **Cancel** | 160ms |
| 4 | click Download and Install | same indeterminate bar, label "Downloading BlueStacks…" | 3000ms |
| 5 | phase `done` | "BlueStacks installed — starting…" | 900ms |
| 6 | auto | dialog closes; `bsInstalled = true`, `bsScreen = 'loading'`; BS window mounts, comp shifts left, `fit()` re-runs | 320ms |
| 7 | BS boot cycle | `bs-loading.png` → `bs-home.png` → `bs-play-youtube.png` (final resting frame) | 2400 → 1400 → hold |
| 8 | chat resumes on its own | `StatusBubble` "BlueStacks is starting…" → "Opening YouTube…" → the normal `makeTaskSteps` tail → success `FinalBubble` — timed to land **after** the frame swaps, so the chat narrates what the window is showing | ~4.5s total |

Step 8 is the payoff: the install is not a dead end, the original task completes.

---

## 7. `InstallDialog` — one component, two skins, one state machine

`phase: 'idle' | 'downloading' | 'done'`, driven by `setTimeout`s, cleaned up on unmount.

**Skin `bluestacks`** (sampled by eye from your three refs — I'll re-check against them while
building): surface `#1E2440`, header strip `#242C4C`, hairline `#333C63`, title `#F2F5FF` 15/600,
body `#98A2C4` 13/1.5, primary `#1E7FE0` → `#1B72CC` hover, white 13/600, **radius 4–6px** (Windows
app, not a web card), secondary = transparent + `1px #3A4468`, ✕ `#C9D0E4`, shadow
`0 24px 70px rgba(0,0,0,.55)`, font stack Segoe UI first. Notably *not* our product's radius-12/16
softness — that difference is the point: this dialog must not look like BlueAI.

**Skin `blueai`**: the product's own light system — white surface, `#e2e8f0` hairlines, `#111827`
title, `#64748b` body, `#1990FF` primary, radius 12/14, `Plus Jakarta Sans`. Reuses the existing
`ba-field` / button conventions.

Shared: 380px wide, centred with a `rgba(4,8,20,.5)` scrim, `Esc` closes in `idle`, focus lands on
the primary button, indeterminate bar is one keyframe (`ba-shimmer` already exists in index.html).

---

## 8. Files

| File | Action | Est. lines |
|---|---|---|
| `blueai-product/product-scene.css` | **new** — wallpaper/scaler/comp/bs-window + the 3 BS frames + shift transition | ~90 |
| `blueai-product/blueai/desktop_scene.jsx` | **new** — `window.DesktopScene`: scene wrapper, `fit()`, BS window click target, `bsScreen` frame cycler | ~130 |
| `blueai-product/blueai/install_dialog.jsx` | **new** — `window.InstallDialog`: two skins, 3-phase machine, indeterminate bar | ~170 |
| `blueai-product/blueai/needs_bluestacks.jsx` | **new** — `window.NeedsBluestacks`: the `Bubble` + the D2 token list + `needsApp(text, category)` (kept out of chat_product.jsx, already 601 lines) | ~85 |
| `blueai-product/blueai/chat_product.jsx` | edit — accept `bsInstalled` / `onGetBluestacks`, call `needsApp()` in `run()`, pass the category down from `ProductHome`, render the new bubble, add the resume script | ~+60 |
| `blueai-product/index.html` | edit — link the CSS, load 3 scripts, titlebar (D1) + its close/reopen state, 4 new state vars, wrap in `DesktopScene`, mount `InstallDialog`, 2 new Preview rows | ~+85 |
| `blueai-product/assets/…` | 4 image files (2 copied, 2 from you), all normalised to 1394×799 | — |
| `.claude/launch.json` | add a `blueai-product` entry, port **8411**, root `blueai/public` (so `<base href="/blueai-product/">` resolves) | +7 |

No `.jsx` crosses 300 lines. `index.html` lands ~746 — it is a standalone prototype page, the same
exemption `/blueai-desktop`'s `index.html` carries.

**Build order — Flow A needs no new assets** (`bs-home.png` already exists), so the scene, the
titlebar, `InstallDialog` and Flow A can all be built and reviewed before the two screenshots land.
Only Flow B's steps 7–8 are blocked on them.

---

## 9. Preview panel

Two rows added at the **top** of the card, above `Session`, because they now gate everything below
them:

```
Installed   [ BlueStacks ✓ ]  [ BlueAI ✓ ]     ← two independent toggle chips, not a segmented pair
```

Rendered as checkbox chips (checkmark + label) rather than `PreviewRow`'s two-option segments,
because these are two independent booleans, not one either/or. When BlueAI is ✗ the rows below
(`Session`, `Geo`, `Credits`…) are hidden — there is no app to configure. Flipping a box back on
resets that flow so it can be replayed (dialog closed, `bsScreen` back to `home`, chat cleared via
a `sessionKey` bump).

---

## 10. Decisions — RESOLVED (designer, 2026-08-10)

**D1 — window chrome: ADD a titlebar.** Light-theme equivalent of `/blueai-desktop`'s
`.bai-titlebar` — `assets/Logo.png` · "BlueAI" · minimise/maximise (decorative) / ✕. **The 830px
content box is preserved and the window grows to 864** (830 + 34px titlebar); every screen inside
was designed against 830 and must not lose a pixel. ✕ closes the window → BlueAI is "running but
closed", and the desktop is left with just the BS window; clicking the BS window reopens it (it does
**not** re-run the installer — BlueAI is still installed). That's the one extra state the titlebar
introduces and it needs to work, or the ✕ is a trap.

**D2 — trigger scope: only app-named tasks.** Two rules, in this order:

1. **Built-in prompts** are gated by category — **Social Media** and **Game Helpers** always need
   BlueStacks. This exists because the matcher alone misses *"Find a guide for the level I'm stuck
   on"* (a Game Helper with no app noun in it). **Explore** and **Productivity** fall through to the
   matcher, because category-gating them would wrongly gate *"Suggest an outfit for me today"*.
2. **Typed text** (and Explore/Productivity prompts) hit a lowercase word-boundary token match:
   `youtube · tiktok · instagram · reels · reddit · discord · whatsapp · snapchat · telegram ·
   twitter/x · facebook · spotify · netflix · google play · play store · app · apps · game · games`
   plus the game titles the product already names: `coin master · whiteout survival · disney
   solitaire · royal match · subway surf · free fire · clash · epic seven · maplestory · dragon
   raja`.

Verified against all 18 `CATS_LIVE` prompts. Gated: every Social Media + Game Helpers prompt, plus
Explore's redeem-codes / Play-Store / install-a-game. Ungated (runs normally): *"Draft sponsorship
pitches to 5 brands"*, *"Show me what the people I follow posted this week"*, *"Suggest an outfit for
me today"*, and all three Productivity prompts. The token list lives in one exported const in
`needs_bluestacks.jsx` so it is edited in one place.

**D3 — Flow B dialog: BlueAI light skin.** Flow A keeps the BlueStacks dark skin. Same component,
`skin` prop — as specced in §7.

**D4 — ✗/✗ is guarded.** Unchecking the last remaining box checks the other, so at least one is
always installed. No undesigned screen.

---

## 11. Verification

1. `python scripts/nocache_static_server.py 8411 --directory blueai/public` → `http://localhost:8411/blueai-product/`
2. Screenshot all four Preview combinations at 1920×1080 and at 1440×900 (scale-fit sanity).
3. Walk Flow A end to end; confirm the boot splash still plays and the comp doesn't jump.
4. Walk Flow B end to end; confirm the three BS frames swap with no geometric shift and the chat
   narration lands after each swap, not before.
5. Titlebar ✕ → BlueAI closes, BS window remains, clicking BS **reopens** it without re-running the
   installer (D1's new state — the one most likely to be missed).
6. D2 spot-check in the browser: send *"Check trending videos on YouTube"* (gated), then *"Suggest an
   outfit for me today"* (must run normally) with BlueStacks off.
5. Confirm nothing under `public/blueai-desktop/**` changed: `git status` is not available here
   (this tree isn't a repo), so compare `ls -l` mtimes on that folder before/after.
6. Re-check both dialog skins against the three reference screenshots side by side.
