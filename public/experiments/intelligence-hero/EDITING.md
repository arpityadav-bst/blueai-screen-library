# EDITING.md — the template, taken apart

Every knob in this page, and exactly where it lives. Line numbers are accurate as of the initial
build; if you've edited since, the selector names in the left column are the durable reference.

**Three files, one job each:**

| File | Owns | Touch it when |
|---|---|---|
| `index.html` | **content** — every word, every URL, every stat number | changing what the page *says* |
| `styles.css` | **the hero** — the `:root` token block, shell, header, hero, stats, mobile menu | changing how the first screen *looks* |
| `sections.css` | **everything below the hero** — section furniture, cards, steps, the scrub | changing how the *rest* looks |
| `main.js` | stat count-up + mobile menu | first-screen behaviour |
| `scroll.js` | scroll reveals + the §2 word fill | below-the-fold behaviour |

The split is by **screen position, not by concern** — `styles.css` is the hero's, `sections.css` is
everything after it. That keeps either file readable and stops one 1200-line stylesheet forming.

There is no build step, no bundler, no framework. Save the file, reload the browser.

---

## 0. The mental model (read this once, everything else follows)

```
body
├── .bg                     black box, absolutely positioned, z-index 0
│   └── video.bg-video      object-fit: cover — fills the viewport, crops
└── .page                   flex column, 100vh, overflow hidden, z-index 1
    ├── header.site-header  flex-shrink: 0   ← pinned top
    ├── main.hero           flex: 1          ← eats all leftover height, centers its content
    └── footer.stats        flex-shrink: 0   ← pinned bottom
```

Two structural facts explain almost every layout question you'll have:

1. **The video is a sibling of the content, not a parent.** It sits behind everything at `z-index: 0`;
   everything else is `z-index: 1` (`styles.css:90–95` sets that in one shared rule). To put anything
   behind the content, give it `z-index: 0`. To put anything in front, `z-index: 1` is enough.

2. **The hero is vertically centered by `flex: 1`, not by margins.** Header and stats declare their
   own height and refuse to shrink; the hero takes whatever's left and centers inside it. So the hero
   block re-centers itself automatically on any screen — you never need to tune a top margin.

**The one global constraint:** `html`/`body` (`styles.css:35`) and `.page` (`:79`) are both locked to
`100vh` / `100dvh` with `overflow: hidden`. That is what makes this exactly one screen with no scroll.
It is also the thing you must undo to build a real landing page — see §9.

---

## 1. Text — every string on the page

All of it is in `index.html`. Nothing is generated in JS except the stat digits.

Copy across the whole page was rewritten on 2026-08-17 against an investor-audience audit — see
[COPY-AUDIT.md](COPY-AUDIT.md) for the reasoning behind each line. The short version: the page reframed
from *"a layer commanding anything autonomous"* (an IoT framing) to **labour** — machines you own that
earn. Don't reintroduce the words "autonomous", "platform" or "layer" into headline copy.

| What you see | Line | Notes |
|---|---|---|
| Browser tab title | `6` | |
| Nav: Home / What It Runs / How It Works / Contact | `43–46` | `is-active` on line 43 draws the three dots; hrefs are section anchors |
| "Sign in" (desktop) | `49` | |
| Headline — "You Own Machines." / "Now They Earn." | `68`, `69` | |
| Subhead paragraph | `72–75` | |
| "Get Access" | `77` | |
| Stat labels — Paid out / Hours worked / Jobs completed / Verified first try | `84`, `97`, `104`, `116` | money first is deliberate |
| Nav + Sign in (mobile sheet) | `133–137` | **separate copy** — see the gotcha below |

### Gotchas on text

- **The mobile menu duplicates the nav.** Lines `53–56` are desktop, lines `162–166` are the mobile
  sheet. Change a nav label and you must change it in both places. This is deliberate (two different
  layouts, not one responsive list) but it is the single easiest thing to forget.

- **The headline lines are hard-coded, and each is `white-space: nowrap`** (`styles.css:326`). The line
  break is structural — two `<span class="line">` elements — not text wrapping. So:
  - Adding a third line means adding a `<span class="line line-3">` **and** a delay rule alongside
    `styles.css:335/338`, or it will render with no animation delay.
  - A **longer** line will not wrap; it will scale down with the viewport and then overflow-hide. If
    you lengthen a line, re-check it at 360px wide. The tight letter-spacing at small sizes
    (`-0.08em` at ≤720px, `-0.09em` at ≤420px, `styles.css:613`/`718`) exists precisely to buy that room.

- **Links all point at `#`.** Every `href="#"` (lines 48, 53–56, 59, 102, 162–166) is a placeholder.

---

## 2. The background video

**One line: `index.html:39`.** Replace the `src`.

```html
<source src="YOUR-VIDEO.mp4" type="video/mp4" />
```

- **Local file:** drop it in `assets/` and use `src="assets/your-video.mp4"`. Remember it must be
  served over HTTP (`localhost:8410/experiments/intelligence-hero/`), not `file://` — that pane sandboxes
  sibling files and the video will silently fail to load.
- **How it fits:** `object-fit: cover` (`styles.css:67`) means it always fills the viewport and crops
  the overflow. It will never letterbox and never distort. Design for the **center** of the frame —
  the edges get cut differently on every aspect ratio.
- **`autoplay muted loop playsinline` are all load-bearing.** Drop `muted` and browsers block
  autoplay. Drop `playsinline` and iOS Safari opens it fullscreen.
- **Want a still image instead?** Delete the `<video>` and put the image on `.bg` (`styles.css:59`):
  ```css
  .bg { background: #000 url("assets/hero.jpg") center / cover no-repeat; }
  ```
- **Want to darken it for text contrast?** Add an overlay to `.bg` rather than touching the video:
  ```css
  .bg::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,.35); }
  ```

---

## 3. The logo — procedural, not an image

**It is a `<canvas>`, drawn by `logo.js`.** There is no logo image file to swap.

The mark is blueai-desktop's **pixel logo**, ported from
`blueai/public/blueai-desktop/boot.js`: a pixel disc minus a 4-point NSEW sparkle (an astroid),
graded cyan `rgb(14,164,197)` → violet `rgb(123,76,255)` across the diagonal. `genLogo()` is copied
verbatim, called with that file's exact header-resolution arguments — `genLogo(9, 0.82, 0.74, 1.0)`.

```
....##########....      HCELLS   9     odd, so the sparkle has a true centre
..######..######..      ex       0.82  <1 = concave; the header uses a fatter
########..########                    star than the boot animation so coarse
######......######                    pixels don't spike
##..............##      starFac  0.74
######......######      discFac  1.0
########..########
..######..######..      52 blocks of 81
....##########....
```

**It is a copy, and the two are allowed to diverge.** Nothing here writes back to blueai-desktop, and
this does not track changes to blueAI's mark. If that mark changes, re-port deliberately.

**Colour is a token: `--logo-ink`** (`styles.css:32`), `#000000` by default. `logo.js` still computes
the cyan→violet grade for every cell and simply lets the token win, so **restoring the brand gradient is
a token edit, not a re-port**: set `--logo-ink: none` (or delete the line).

**It renders in two places**, because `logo.js` paints every `.logo-canvas` it finds:

| Where | Ink |
|---|---|
| Header circle | black — `--logo-ink` from `:root` |
| Above the closer title (`.closer-mark`) | white — `.is-white` |

**The footer is wordmark-only** — no mark, by decision. Its `<span class="brand-lockup">` still supplies
the display face and size.

`.brand-lockup` is shared by the closer and the footer on purpose, since the same lockup written twice is
two lockups waiting to drift. `.closer-mark` overrides only what has to differ: block-level `display` so
it can centre itself, and a larger wordmark (`clamp(20px, 2.1vw, 26px)` vs the shared
`clamp(15px, 1.5vw, 18px)`) because it sits above a 30–74px headline rather than in a 12px bar.

**Ink is read per canvas**, off each element's own computed style, so a new instance in a new colour is
`class="logo-canvas is-white"` (or any rule setting `--logo-ink` on it) and **no JS change at all**.
`.closer-mark` exists only to centre its canvas — the canvas is `display: block`, so `.closer`'s
`text-align: center` can't reach it.

### Sizing — desktop and mobile are set independently, on purpose

| | pitch | circle | mark |
|---|---|---|---|
| **Desktop** | `2.6` (boot.js's own) | `clamp(40px, 4.4vw, 46px)` | 21.6px at dpr 1.25 |
| **Mobile** (≤720px) | `3` | `45px` | 27.0–28.3px |

**Desktop is signed off. Do not change it to fix a mobile problem** — mobile has its own override in the
720px block, and that is where a mobile fix belongs.

**Why mobile needs a 27px floor — this is arithmetic, not taste.** A gap has to be at least 1 CSS px to
be visible at all (a 0.5px gap is what made the blocks look merged). With 9 cells, that puts a hard
floor on the mark:

| | block | gap | ratio |
|---|---|---|---|
| Desktop, 21.6px mark | 1.60 | 0.80 | 2.0:1 |
| Mobile at pitch 2.6, 22.5px | 1.50 | **1.00** | 1.5:1 ← blocks thinner than desktop's, gap wider |
| Mobile at pitch 3, 27px | 2.00 | 1.00 | 2.0:1 |

Below ~3 CSS px per cell the blocks end up *thinner than the gaps*, and the mark stops reading as solid
pixels — it reads as unstable dots that appear to shift from device to device. **Desktop escapes the
floor only because dpr 1.25 quantises its gap down to 0.8px.** A phone at dpr 2 or 3 cannot.

Verified across real phone ratios (2, 2.625, 2.75, 3, 3.5): the mark holds at **26.2–28.3px** with a
block:gap ratio of **1.7–2.0:1**, and cells are always uniform because `DC` is a single integer
device-pixel value. That range is the practical answer to "it keeps shifting."

**The 45px mobile circle is chosen so 45 − 27 = 18 → a whole 9px inset.** An even circle against an odd
mark lands on a half device pixel and the compositor resamples the whole bitmap.

Fractional dpr can't be made exact by any choice of numbers. `image-rendering: pixelated` keeps edges
hard there rather than smoothing them.

```js
DC  = Math.max(3, Math.round(pitch * dpr));   // cell pitch, device px
gap = Math.max(1, Math.round(dpr));           // gap, device px — SCALES with dpr
DB  = DC - gap;                               // the block
```

Desktop deliberately matches blueai-desktop's size. Mobile does not, and can't: at 2.6 the mark is
~22px, which puts 2.5px in each of the 9 cells, and the 4-point star cutout cannot resolve — it reads
as a blob. `--logo-pitch` and `.logo`'s width must move together or the mark outgrows its circle.

**Three separate bugs were fixed here. They looked like one problem ("the logo is distorted") and were
not.** Worth reading before touching any of this:

1. **`boot.js` caps dpr at 2 — wrong on phones.** At dpr 3 it built a dpr-2 bitmap and let the browser
   resample it **1.5×**; non-integer resampling of pixel art is mush. Now uses the true dpr (capped at 4).
   Verified `scaleFactor: 1.000` at dpr 1, 1.25, 2 and 3.
2. **The mark was too small on mobile to resolve its own shape** — a size problem, not a rendering one.
   Mobile-only pitch of 4.
3. **`boot.js`'s `DB = DC - 1` is a ONE-DEVICE-PIXEL gap**, so it shrinks as dpr rises: 1.0 CSS px at
   dpr 1, **0.5 at dpr 2, 0.33 at dpr 3**. On any dense screen the blocks merge and the mark stops
   reading as pixels at all. `gap = round(dpr)` holds it at a constant ~1 CSS px, giving a 3:1
   block-to-gap ratio on mobile and 2:1 on desktop.

**Desktop is unchanged by all three** — at dpr 1 and 1.25, `round(dpr)` is `1`, which is exactly what
`DC - 1` already did, and only dpr > 2 takes the new resampling path. `image-rendering: pixelated` is a
belt-and-braces backstop.

> **Never give `.logo-canvas` a width or height in CSS.** `logo.js` sets both, on purpose. A `<canvas>`
> falls back to an **intrinsic 300×150** the instant its CSS box isn't in effect — a stale stylesheet, a
> percentage that doesn't resolve — so `width: 72%` is a 300px logo waiting to happen. It already
> happened once: the mark rendered at ~300px and covered the nav. JS-set pixel dimensions are immune.

**To resize it,** change the `2.6` multiplier — and understand you are then diverging from
blueai-desktop, which is the whole point of matching it.

Blocks are integer device pixels drawn on an untransformed context; fractional cells anti-alias and the
seams read as soft grid lines instead of distinct pixels. It repaints on resize, because dragging a
window between displays changes `dpr`.

> **There is no logo image file.** A `logo.webp` stand-in existed before the canvas and has been
> deleted. Don't add one back expecting it to be picked up — `logo.js` draws the mark.

---

## 4. The trust row — a liveness signal

`index.html:68–75`. The row is a single dark pill: a pulsing dot, a count-up number, and a sentence.

```html
<span class="trust-pill is-live">
  <span class="live-dot"></span>
  <span class="live-text"><span class="live-count" data-target="1284">0</span>
  actions taken in the last hour</span>
</span>
```

It replaced a three-ring Microsoft/Amazon/Google cluster, deliberately: enterprise logos signal
*"safe vendor,"* which fights the brief. A live count signals *"awake right now,"* which is the brief.

- **The number** is driven by `data-target` exactly like a stat (§5) and gets thousands separators.
- **The dot** is `.live-dot` (`styles.css:246`), 7px, pulsing on `livePulse` (`:503`) — an expanding
  `box-shadow` ring every 2.4s. The pulse is what reads as "live"; the colour doesn't have to.
- **Dot colour is a token** — `--live-dot` (`styles.css:26`). White keeps the page monochrome. Swap it
  to `#4ade80` for the conventional online-green, and change `livePulse`'s `rgba` to match.
- **`.is-live`** (`styles.css:287`) is a variant that resets the pill's ring-clearing offsets to
  symmetric padding. The base `.trust-pill` rule is unchanged and still carries the overlap maths.
- **`.live-text` matters** — it wraps the number and sentence so they sit in normal inline flow. Without
  it the pill's `inline-flex` makes the sentence its own flex item and the space before "actions"
  collapses, giving `1,284actions`.

> **The three-ring cluster's CSS is parked, not deleted** (`styles.css:236`, marked with a comment).
> If the enterprise logos aren't coming back, delete through `.trust:hover .avatar.a3`. The Font
> Awesome `<link>` is already gone — restoring it is one line in `<head>`.

### How the cluster was built (still true if you bring the rings back)

The **entire** trust row is driven by one variable — `--trust-size` on `.trust` (`styles.css:229`,
`clamp(36px, 4.5vw, 42px)`; overridden to `34px` at ≤420px on `:718`). Ring size, icon size, overlap
distance and the pill's left padding are all computed from it:

| Thing | Formula | Line |
|---|---|---|
| Ring diameter | `var(--trust-size)` | `236` |
| Icon size | `--trust-size × 0.34` | `258` |
| Overlap between rings | `--trust-size × -0.42` (negative margin) | `267`, `271` |
| Pill's left padding (clears the overlap) | `--trust-size × 0.58` | `286` |

**Change `--trust-size` alone and the whole cluster rescales in proportion.** That is the intended
knob. Editing the individual pixel values instead will break the relationship.

**The z-index order is not arbitrary:** rings are `1 / 2 / 4` and the pill is `3`. The pill slides
*under* the third ring (so the ring overlaps the pill) but *over* the first two. If you add a fourth
ring, it needs `z-index: 5` and the pill needs to move up too.

**Adding or removing a ring** just means adding/removing an `.avatar` block — but the hover-lift rules
(`styles.css:276–284`) are per-class (`.a1 -2px`, `.a2 -4px`, `.a3 -2px`, an arc). A new `.a4` gets no
lift until you add a rule.

---

## 5. The stats

Each stat is one `<div class="stat">` in `index.html:95–134`:

```html
<div class="stat anim" style="--d: 0.74s">
  <span class="stat-icon">+</span>                 <!-- ① the glyph -->
  <span class="stat-value"
        data-target="840"                          <!-- ② count up to this -->
        data-prefix="$"                            <!-- ③ before the number -->
        data-suffix="K"                            <!-- ④ after the number -->
        data-decimals="0">$0K</span>               <!-- ⑤ decimal places -->
  <span class="stat-label">Paid to creators</span>
</div>
```

**`main.js` reads ②–⑤ off the `data-` attributes — you never edit JS to change a stat.** The current
four are world-action counts, not platform specs — that reframe is the point (see §4).

- **`data-target`** — the number it counts to. `41920`, `2.1`, `18400`, `840`.
- **`data-prefix`** — literal text *before* the number. Currently only `$`.
- **`data-suffix`** — literal text *after* it: `M`, `K`, or `%`, `/7`, `x` — anything.
- **`data-decimals`** — places shown *during and after* the count. `2.1` needs `1`, or it animates
  as `2`.
- **`data-group`** — thousands separators, **on by default**. `41920` renders `41,920`. Set
  `data-group="false"` for a year, a version, or anything that shouldn't be comma'd.
- **The text content** (`$0K`) is the pre-animation state. Set it to the zero-form of your value so
  there's no flash of the wrong shape before the count starts.
- **`.stat-icon`** is a single character in the **dot-matrix display font** (`styles.css:405`) — that's
  why `<`, `%`, `*`, `#` read as pixel-art symbols rather than punctuation. `<` must be written as
  `&lt;` in HTML. Any single character works; a full emoji or word will not match the aesthetic.
- **`--d`** is that stat's entrance delay (`0.5s`, `0.58s`, `0.66s`, `0.74s` — an 80ms stagger).

**Adding a 5th stat:** copy a block, give it `--d: 0.82s`, and change the grid
(`styles.css:389` — `repeat(4, 1fr)`, and `:614`'s mobile `repeat(2, 1fr)`).

**Count-up timing** lives in `main.js:34–35` and applies to all of them:
```js
var duration = 1500 + index * 80;   // each one runs slightly longer than the last
var delay    = 480  + index * 90;   // and starts slightly later
```
Easing is `easeOutCubic` (`main.js:14`) — fast start, soft landing. The animation fires **once**, when
the element scrolls into view at 25% visibility, and never repeats.

**The selector is `[data-target]`, not `.stat-value`** — so the trust row's live count is animated by
the same code, and any element you give a `data-target` joins in automatically. Note the ordering
consequence: the live count is first in the DOM, so it takes `index` 0 and the four stats shift to
1–4, putting each ~90ms later than it was. Intentional; the stagger still reads as one sweep.

---

## 6. Style — the token layer

**`styles.css:14` is the whole palette.** Change a colour here and it propagates everywhere.

```css
:root {
  --bg: #000000;                    /* page + video-box background */
  --text: #ffffff;                  /* default ink */
  --muted: #8e8e8e;                 /* stat labels */
  --nav-text: #2e2e2e;              /* nav link ink AND the three active dots */
  --pill-dark: #28282a;             /* Sign in pill, burger, trust rings */
  --sign-in-text: #c8c8c8;
  --nav-shadow: 0 4px 14px rgba(0,0,0,.16);   /* the ONLY shadow on nav/logo — keep it soft */
  --trust-bg: #28282a;
  --trust-border: rgba(255,255,255,.4);
  --trust-text: #c4c2c3;
  --font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
  --font-display: "BubbledotICG-FinePos", "Geist Pixel Circle", monospace;
}
```

**Convention: put new colours here, don't inline them.** Two exceptions already exist by design and
are worth knowing about because a global palette change won't catch them:

- **The CTA's white glow** (`styles.css:357`) is a three-layer `box-shadow` with hard-coded
  `rgba(255,255,255,…)` — it's a light effect, not a colour role.
- **The nav pill and mobile sheet are literal `#fff`** (`:135`, `:530`), as are the avatar inner
  circles (`:249`). They're "white surface," which is a different idea from `--text`.

### Where each component's look lives

| Component | Line | Main knobs |
|---|---|---|
| Logo circle | `112` | size, `background`, `border-radius`; `:124` = the 72% inset |
| Nav pill | `135` | `max-width: 430px`, `height`, `background`, `border-radius: 999px` |
| Nav link | `148` | size, weight, `opacity: .5` resting → `.75` hover (`:164`) → `1` active (`:168`) |
| Active three-dot indicator | `173` | one 3×3px dot + two `box-shadow` copies at `±5px` |
| Sign in pill | `186` | `:203` is the hover (bg, ink, `-1px` lift) |
| Trust ring | `236` | `padding: 5px` is what makes it a *ring* not a disc |
| Trust pill | `286` | |
| Headline | `308` | font, size `clamp(28px, 6.2vw, 80px)`, `letter-spacing: -0.04em` |
| Subhead | `344` | `max-width: min(500px, 92%)`, `opacity: .8` |
| CTA | `357` | padding, the glow; `:380` is the hover (lift + stronger glow) |
| Stat icon / value / label | `405` / `412` / `421` | |
| Burger | inside `613` | 48px circle, three 18×1.5px bars; the X transform is `:660`–`:672` |
| Mobile sheet | `530` | `border-radius: 28px`, padding, drop shadow |

**Sizes are almost all `clamp(min, preferred, max)`** — they scale with the viewport between two
bounds instead of jumping at breakpoints. To make something bigger, raise the **third** value (the
max); to stop it shrinking on small screens, raise the **first**.

---

## 7. Type

Two font systems, deliberately separate.

**UI text — Inter.** Loaded from Google Fonts (`index.html:11–14`), used via `--font-sans`. To swap:
change the `<link>` and the first name in `--font-sans`. Weights 400/500/600 are all in use (400
subhead, 500 nav/values, 600 CTA) — if you swap to a font with different weights, request them in the
URL or they'll render as synthetic bold.

**Display text — BubbledotICG-FinePos**, the retro dot-matrix face. Loaded from OnlineWebFonts
(`index.html:17–20`). Used by exactly two things: the **headline** (`styles.css:308`) and the **stat
icons** (`:405`).

The fallback chain is `BubbledotICG-FinePos → Geist Pixel Circle → monospace`.

> **`fonts/GeistPixel-Circle.woff2` is not in the repo.** The `@font-face` at `styles.css:6` points at
> it and the folder exists — drop the file in and it works, no code change. Until then the middle link
> of that chain is dead, which only matters if the OnlineWebFonts CDN is unreachable. If the headline
> ever renders as plain monospace, that's what happened.

**Swapping the display face** is a two-line change: the `<link>` at `index.html:17` and the first name
in `--font-display`. The tracking tokens below are tuned to *this* face and will need re-checking.

### Dot-matrix tracking — two tokens, no exceptions

```css
--display-track: -0.04em;   /* letter-spacing */
--display-word:  -0.06em;   /* word-spacing   */
```

**Every element in the display face uses these. None carries its own number.** That rule exists because
the spacing was previously set per element — `-0.04`, `-0.045`, `-0.05`, `-0.08`, `-0.09` — which is
exactly why it read tight in one place and loose in another.

The `-0.08em` / `-0.09em` pair on the mobile headline was worse than merely inconsistent: it was
**tracking used as a fitting tool**, squeezing the `nowrap` headline onto a narrow screen. Fitting is
`font-size`'s job. Those overrides are gone and the headline's floor dropped `32px → 26px` to buy the
same width back — the two roughly cancel, so the mobile headline occupies about the width it did before.

A pixel face also has a wide space glyph, which is what made word gaps look loose; `--display-word`
tightens it once, globally. **If a new display element needs different spacing, the answer is a
different font-size, not a local letter-spacing.**

Sans-serif tracking is a separate matter and is still set per element (`-0.01em` on nav and buttons,
`0.16em` on the uppercase section label, and so on) — that's normal typographic practice and not part of
this rule.

---

## 8. Motion

### The shared entrance system

Any element with `class="anim"` fades in, rises 22px, and un-blurs (`styles.css:431`):

```css
.anim {
  opacity: 0; transform: translateY(22px) scale(.98); filter: blur(6px);
  animation: reveal .85s cubic-bezier(.22,1,.36,1) forwards;
  animation-delay: var(--d, 0s);
}
```

**This is the extension point.** Any new element you add gets the house entrance for free:

```html
<div class="anim" style="--d: 0.9s">…</div>
```

The `--d` values currently in use, in fire order: trust `0.05s` → headline lines `0.12s`/`0.3s` →
subhead `0.28s` → CTA `0.4s` → stats `0.5 / 0.58 / 0.66 / 0.74`. Header runs its own `slideDown` at
`0.7s` with no delay (`styles.css:100`).

### The exceptions

- **The headline opts out of `reveal`.** It carries `class="anim"` but `styles.css:319` cancels the
  animation, because its two **lines** animate individually (`:326`) on their own delays (`:335`,
  `:338`) via `headlineFade` — a gentler 14px rise with no blur. Change line delays there, not in HTML.
- **The CTA uses `revealPulse`** instead of `reveal` (`:376`) — same motion but it overshoots to
  `scale(1.03)` at 70% before settling. That's the small "pop" that draws the eye to the button.

### All keyframes, one place

`reveal` `439` · `revealPulse` `447` · `slideDown` `465` · `headlineFade` `476` ·
`overlayIn` `483` · `menuIn` `492` · `linkIn` `503`

The house easing is `cubic-bezier(0.22, 1, 0.36, 1)` — a strong ease-out. Used on every entrance and
every hover. Keep it for anything new or the new thing will feel like a different site.

### Turning motion off

`styles.css:735` already handles `prefers-reduced-motion: reduce` — it kills every animation and
transition, shows final states, and snaps the stat values straight to target (`main.js:30`). To disable
an entrance permanently, just remove the `anim` class from that element.

---

## 9. The scroll unlock — already done

The page used to be locked to exactly one screen. **That's been undone** — it now scrolls, and the
hero is just the first screen of a longer document. What changed, for the record:

| Line | Was | Now |
|---|---|---|
| `styles.css:35` | `html, body { height: 100vh; overflow: hidden }` | margin/padding reset only |
| `styles.css:44` | — | `body.menu-open { overflow: hidden }` — **now load-bearing** (see §11) |
| `styles.css:86` | `.page { height: 100vh; overflow: hidden }` | `min-height: 100vh`, no overflow |
| `styles.css:66` | `.bg { position: absolute; inset: 0 }` | `height: 100vh` — **capped to one screen** |

**The video is the hero's background, not the page's.** That's the `.bg { height: 100vh }` decision. The
alternative was `position: fixed`, parking it behind the whole document — more dramatic, but body copy
over moving video for a full page is a legibility problem. Sections below bring their own ground
(`--surface`, `#08080a`).

Two consequences worth knowing:

- **`html { scroll-behavior: smooth }`** (`styles.css:40`) makes the nav's anchor links glide rather
  than jump. Disabled under `prefers-reduced-motion` (`styles.css:754`).
- **Anything with no `background` shows the video through it.** New sections must set one — `.section`
  (`sections.css:22`) does this for you, so build on that class rather than a bare `<section>`.

**Nothing about the hero itself changed.** `.page` is still exactly one viewport tall, header still
pinned top, stats still pinned bottom.

---

## 10. Responsive map

Four breakpoints, `styles.css`:

| Line | Query | What changes |
|---|---|---|
| `613` | `max-width: 720px` | **The big one.** Desktop nav + Sign in hidden, burger appears, header goes `space-between`, headline letter-spacing tightens to `-0.08em`, stats → 2 columns |
| `690` | `max-width: 700px` + portrait | hero vertical gaps tighten |
| `704` | `max-height: 700px` | hero vertical gaps tighten (short laptops / landscape phones) |
| `718` | `max-width: 420px` | `--trust-size` → 34px, trust pill → 12px, headline letter-spacing → `-0.09em` |
| `735` | `prefers-reduced-motion` | all motion off |

**720px is hard-coded in three places and they must agree:** the CSS media query (`:613`), the second
media query's sibling logic, and `main.js:112` (`window.innerWidth > 720` closes the mobile menu on
resize). Change the breakpoint and change all three, or the menu will strand open at the wrong width.

### The mobile pass (2026-08-17) — what was wrong and why

Worth reading before adjusting any `clamp()` on this page, because the same mistake is easy to repeat.

**The pattern behind most of it: a `clamp()`'s MINIMUM is the mobile value.** At 375px, `1.35vw` is 5px
— so the floor governs, always. Every "too small on mobile" complaint traced to a floor set too low
while the desktop maximum looked fine. **Raising a floor cannot affect desktop**, which is why this pass
was safe. Floors raised: body copy 13.5→15px, section sub 15→16, labels 10.5→11.5 and 11.5→12.5, stat
label 11→12, hero headline 28→32, card glyphs 24→28, step numbers 20→24.

Same for gutters — side padding floors went 18→24px (sections, footer), 20→24px (scrub stage), 14→20px
(the hero shell).

**Genuine bugs found by measuring, not by eye:**

- **The page jumped 20px sideways when the mobile menu opened.** `body.menu-open { overflow: hidden }`
  removes the scrollbar, so the viewport widens. Fixed with `scrollbar-gutter: stable` on `html`
  (`styles.css:55`) — free here, since this page always scrolls.
- **The mobile sheet sat 6px wider than the header** on each side; its `left`/`right` floor was 14px
  while `.page`'s padding had moved to 20px. Now matched, so its edges align with the logo and burger.
- **The hero headline sat on the video's bright band** — white dot-matrix on near-white. On a narrow
  viewport `cover` crops the sides, so that band fills more of the frame than on desktop. Fixed with
  `.hero::before`, a soft radial scrim behind the copy only. Darkening the whole video would have cost
  the hero its light; this guarantees contrast at any viewport without flattening the shot.
- **`--hero-shift: 80px` was tuned against desktop slack** and crowded the CTA into the stat grid on a
  phone. `32px` under 720px.
- **The closer left a ~300px void** above its lockup: `min-height: 58vh` centring a short block. `38vh`
  on mobile.
- **The video band collapsed to ~70px.** Its height is a fraction of *width*, so the desktop
  `--cv-w`/`--cv-reveal` all but erased it on a 375px screen. Mobile override: full-bleed, 92% reveal,
  and opacity lifted 0.5→0.62 because the same value reads as nothing at a smaller size.
- **Section padding of `12vh` is ~97px top *and* bottom on a phone** — generous on desktop, dead space
  in a 375px column. Capped to `clamp(56px, 7vh, 92px)` under 620px.
- **The lockup went mark-dominant** once the mark grew to 36px: a 13px wordmark beside it. Wordmark
  floors raised to 15px (footer) and 20px (closer).

---

## 11. The mobile menu

Markup: overlay `index.html:158`, sheet `160–168`. Both start with the `hidden` attribute.

`main.js:85` is the entire state machine:

```js
function setMenu(open) {
  burger.setAttribute("aria-expanded", open);   // ← drives ALL the visual state
  overlay.hidden = !open;
  menu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
}
```

**The burger's X animation is pure CSS keyed off `aria-expanded`** (`styles.css:660`–`672`) — the
accessibility attribute *is* the state flag, so there's no separate class to keep in sync. Top bar
rotates +45° and drops 6.5px, bottom rotates −45° and rises 6.5px, middle fades out.

Closes on: burger click, overlay click, any link inside the sheet, Escape, and resize past 720px
(`main.js:96–114`).

`body.menu-open` is toggled but currently styles nothing — `body` is already `overflow: hidden`
globally. **It becomes load-bearing the moment you make the page scroll** (§9): add
`body.menu-open { overflow: hidden }` then, or the page will scroll behind the open sheet.

---

## 12. The sections below the hero

Five sections, all in `index.html` after `</div>` closing `.page`. Their styling is in a **separate
file** — `sections.css` — so `styles.css` stays the hero's. Behaviour is in `scroll.js`.

| § | Section | `id` | Class | Content lines |
|---|---|---|---|---|
| 2 | The morning | — | `.scrub` | `index.html:152–164` |
| 3 | What it runs | `what-it-runs` | `.section` + `.cards` | `167–241` |
| 4 | How it works | `how-it-works` | `.section` + `.steps` | `244–283` |
| 5 | While you rest, it earns | `economics` | `.section` + `.earns` | `286–325` |
| 6 | Closer | `contact` | `.section.closer` | `328–341` |
| — | Closing video band | — | `.closer-video` | after `#contact` |

### The closing video band

`assets/closer-loop.mp4` — the blue liquid sphere, **1920×928, H.264, 10s, 7.3 MB**.

**The source cannot be used directly.** It's ProRes 4444 with an alpha channel (`yuva444p12le`) at
**805 MB**, and no browser plays ProRes. Alpha in browsers means VP9/WebM (no Safari) or HEVC (Safari
only) — but none of that is needed here, because the band sits on `#000` and blends with `screen`, and
*screen over black is identity*. So the alpha was flattened onto black and encoded as plain H.264,
which is universally supported and 100× smaller:

```bash
ffmpeg -f lavfi -i "color=black:s=1920x1080:r=30:d=10" -i SOURCE.mov \
  -filter_complex "[0][1]overlay=shortest=1,crop=1920:928:0:67,format=yuv420p" \
  -c:v libx264 -crf 20 -preset medium -movflags +faststart -an assets/closer-loop.mp4
```

The explicit `overlay` onto a black source matters — just dropping the alpha channel leaves whatever
happens to be in the RGB planes behind transparent pixels, which is not reliably black.

**`crop=…:0:67` removes dead space, measured not guessed.** A per-row profile of the sphere's visible
energy put its content at y=**67**→**995**, so 67px above it were empty and are gone. Verified after
encoding: everything outside the sphere is pure `0`, highlights reach `253`.

**Four knobs, on `.closer-video`** — and the band's height is *derived* from them, so changing any one
can't leave a gap below the video or crop it early:

| Token | Now | Controls |
|---|---|---|
| `--cv-aspect` | `40%` | **the video file's own aspect** — must match the file in use |
| `--cv-w` | `0.78` | video width as a fraction of the band |
| `--cv-reveal` | `0.58` | how much of the frame's height shows |
| `--cv-opacity` | `0.5` | how present it is |

**Playback speed** is a fifth knob, and it lives in the markup: `data-rate="0.5"` on the `<video>`.
`scroll.js` reads it and sets `playbackRate` — no re-encoded slow version, so no extra bytes. It
re-applies on `loadedmetadata` and `play`, because some browsers reset the rate on load and looping
re-fires `play`.

At `0.5` the 30fps source shows an effective **15fps**. On a slow morph at half opacity that reads as
smooth; if it ever judders, the fix is frame interpolation on the file (RIFE lives at
`video-creator/tools`), **not** a lower rate — a lower rate makes judder worse, not better.

```css
padding-top: calc(var(--cv-aspect) * var(--cv-w) * var(--cv-reveal));
```

Because percentage padding resolves against *width*, the whole band tracks the viewport with no media
query. The video is centred with `left: 50%` + `translateX(-50%)`, so narrowing it keeps it in the middle.

**Two videos are on disk; the band uses one.** Switching is a `src` change **plus** `--cv-aspect`, and
the two must agree or the band's height stops matching the frame:

| File | Size | Aspect → `--cv-aspect` |
|---|---|---|
| `closer-blob.mp4` *(in use)* | 1920×768, 1.4 MB | `40%` |
| `closer-sphere.mp4` | 1920×928, 7.3 MB | `48.33%` |

Both were cropped to their measured content — the blob's was y=140→905 (140px of dead top), the
sphere's y=67→995. Neither crop was estimated; both came from a per-row luminance profile.

### Footer

One bar: wordmark left, links + copyright right (`index.html`, after the video band). Stacks centred
under 620px, because a single row can't hold four items at 360px without crushing.

`.site-footer` carries **the only hairline on the page** — a deliberate exception to the no-dividers
rule. That rule exists so *section transitions* have no visible seam; a footer is a trailing UI bar, and
since it sits on the same `--shade-0` as the video band above it, without the line it reads as text
floating in the dark rather than a bar.

The wordmark uses `--font-display`, so it ties back to the headline and the stat glyphs.

**`mix-blend-mode: screen` is why there's no visible video rectangle** — the background drops entirely
into the page ground and only the sphere survives.

It sits on `--shade-0`, exactly where `#contact`'s fade ends, so the shade chain still joins.
**If you re-order sections and something else ends up before it, give the band that section's `--to`.**

> **The gap between the CTA and the sphere is set by `.closer`, not by the video.** It was
> `min-height: 92vh` with centred content, which parked ~40vh of void underneath plus `.section`'s
> bottom padding. Now `58vh` with a small `padding-bottom`. If the two ever drift apart again, look
> there first — cropping the video is the wrong lever.

### The shade ladder — how sections change colour with no dividers

**There are no borders between sections.** The colour change *is* the separation.

Four shades, at the top of `sections.css`. They were **sampled from the hero video**, not picked by
eye: its dark chromatic pixels sit at hue 21.8° / saturation 0.25 — a warm brown — so every shade is
that hue at rising luminance.

```css
--shade-0: #000000;   /* the video's bottom 6% measures exactly this */
--shade-1: #0c0907;
--shade-2: #17110e;
--shade-3: #241a15;
```

**The mechanism.** One shared gradient on `.section, .scrub`: hold the inherited shade for
`--shade-hold` (**8%**), then drift to the next across the remaining 92%. Each section declares only
where it starts and ends:

```css
.scrub        { --from: var(--shade-0); --to: var(--shade-1); }
#what-it-runs { --from: var(--shade-1); --to: var(--shade-2); }
#how-it-works { --from: var(--shade-2); --to: var(--shade-3); }
#economics    { --from: var(--shade-3); --to: var(--shade-2); }
#contact      { --from: var(--shade-2); --to: var(--shade-0); }
```

**The one invariant that must never break: each section's `--from` has to equal the previous section's
`--to`.** That identity is what makes the boundary invisible — same colour on both sides, nothing to
see. Break it and a hard line appears instantly. Reading down the chain above is how you check it.

The arc is deliberate: black → warm → warmest → back down → black. It comes back down rather than
only ever lightening, so the page breathes instead of drifting.

**`--shade-hold` is the one knob for how the change reads.** At 8% the fade spans almost the entire
section, so the page behaves like one continuous surface slowly changing tone. Raise it and each
section starts to feel like a flat panel with a transition strip at the bottom — which is the "divider"
look, arrived at by gradient instead of by border.

**§2 starts at `#000000` on purpose.** The hero's bottom edge is genuinely black, so the first section
reads as the same plane continuing rather than a new panel beginning. `.bg::after` (`styles.css:75`)
enforces that: `object-fit: cover` crops top and bottom on a wide, short viewport and would otherwise
expose the video's mauve mid-frame right at the join, so a scrim fades the hero's last 38% to black at
every aspect ratio.

**Surfaces are translucent, not coloured.** `--card-bg` is `rgba(255,255,255,.035)`, and `.earn` uses a
white-alpha gradient. A fixed hex would fight the fade — a card that looked right on `--shade-1` would
read wrong on `--shade-3`. **Never give a surface an opaque colour**; use white alpha and let the
section's shade show through.

**Adding a section:** insert it in the chain, set `--from` to the previous section's `--to`, pick a
`--to`, and update whatever follows it so the chain still joins.

### Film grain

`assets/noise.png` — a 160×160 tileable tile of sparse white pixels at low alpha, generated rather
than sourced (gaussian `mean 9, sigma 7`, capped at 26 on the alpha channel).

**It is ONE page-wide overlay: `body::after`, `position: fixed`** (`styles.css:53`). Strength is
`--grain` (`styles.css:28`), currently `0.45` — about 1.6% average and 4.6% at the brightest pixels.

Two reasons it's global and fixed, both learned the hard way:

- **Per-section grain creates a divider.** The first version applied it via `.section::before`, which
  meant the sections had tooth and the hero had none. That boundary was a hard visible line —
  precisely the artefact the shade fade exists to eliminate. Grain must cover the hero too or not exist.
- **`fixed`, not scrolling**, so the grain sits still while content moves. That reads as grain in a
  lens rather than texture printed on the page, which is what the video actually looks like.

**Dialling it:** change `--grain` and nothing else. Regenerate the tile only to change the grain's
*size or character*, never its strength. The bar: **if you can see it as texture, it's too strong.** The
first pass shipped at an effective 5.6% and read as visible sandpaper.

### Shared furniture

Every section is `<section class="section"><div class="wrap">…`. `.section` (`sections.css:22`) supplies
the ground colour, the hairline top border and the vertical rhythm; `.wrap` (`:29`) is the 1040px
column. Inside, use `.section-label` (small uppercase kicker), `.section-title` (dot-matrix headline)
and `.section-sub` (body copy). New ink tokens live at the top of `sections.css` — `--ink-1/2/3`,
`--surface`, `--surface-2`, `--hairline`.

### Scroll reveals — the counterpart to `.anim`

`.anim` fires once on page load, so it's wrong for anything below the fold. Sections use
**`data-reveal`** instead (`sections.css:73`): same fade + rise + de-blur, but triggered by an
IntersectionObserver at 15% visibility (`scroll.js:38`) which adds `.is-in`.

```html
<h2 class="section-title" data-reveal style="--d: 0.06s">…</h2>
```

Same `--d` stagger convention, same house easing. **Use `data-reveal` below the hero and `anim` inside
it** — that's the only rule.

### §2, the scroll-scrubbed word fill

The one genuinely new mechanism, and deliberately used **once**. Multiple scrub sections feel sluggish
and it stops being special.

**How it works:** `.scrub` is `260vh` tall (`200vh` under 620px). Inside, `.scrub-stage` is
`position: sticky; top: 0; height: 100vh` — so it parks in the viewport while you scroll *through* the
tall parent. `scroll.js` measures how far through you are and lights words up in order.

- **`scroll.js:57` splits the sentence into `.word` spans at load** — you write plain text in the HTML,
  never per-word markup. Edit `index.html:155–160` like any paragraph.
- **Unlit words are `--ink-dim`** (`rgba(255,255,255,.14)`), lit ones are `--ink-1`. It's a `color`
  transition, not opacity, so the words hold their layout.
- **`COMPLETE_AT = 0.82`** (`scroll.js:88`) — the fill finishes at 82% of the track so the completed
  sentence holds for a beat. Without it the last word lights up exactly as it scrolls away.
- **To change the pace,** change `.scrub`'s height (`sections.css:88`). Taller = slower fill.
- **Length matters.** ~50 words is the sweet spot. Much longer and the fill outruns the track; much
  shorter and each word gets a distractingly large slice of scroll.
- Scroll handling is rAF-throttled and `passive` (`scroll.js:104`); under
  `prefers-reduced-motion` the track collapses to `height: auto` and every word renders lit
  (`sections.css:356`).

### Section grids

`.cards` and `.earns` are `repeat(3, 1fr)` → 2 columns under 900px → 1 under 620px. `.steps` is
`repeat(3, 1fr)` → 1 column under 900px. All in `sections.css:330–352`. **Note these are 900/620px,
not the hero's 720px** — the hero's breakpoint is about the nav collapsing, which is a different
question from when a 3-up card grid stops fitting.

---

## 13. Things that will bite you

1. **Open it over HTTP, never `file://`.** The in-app browser pane sandboxes sibling files — `styles.css`
   and the assets silently fail and you get an unstyled page. Serve it over HTTP.
2. **Nav labels exist twice** — desktop `index.html:44–47`, mobile `143–147`. Both carry the anchor
   hrefs too, so a renamed section `id` needs changing in both.
3. **Headline lines don't wrap.** `white-space: nowrap` + a hard `<span>` per line. Longer copy needs a
   re-check at 360px.
4. **A new headline line needs a delay rule** or it animates with no stagger (`styles.css:335`/`338`).
5. **A new stat needs a grid change** in two places (`:388` desktop, `:613` mobile) and a `--d`.
6. **A new trust ring needs a z-index and a hover-lift rule** — the pill sits at `z-index: 3`, between
   rings 2 and 4, and that's intentional.
7. **720px is written in three places** — two CSS queries and `main.js:112`.
8. **Don't strengthen `--nav-shadow`.** `0 4px 14px rgba(0,0,0,.16)` is deliberately soft; a heavier
   shadow makes the white pills look pasted onto the video instead of floating over it.
9. **Don't put a gradient or shimmer on the headline.** Solid white is the design decision — the video
   behind it is already doing the visual work.
10. **`data-decimals` must match `data-target`.** `2.1` with `decimals="0"` animates to `2`.
11. **`data-reveal` below the hero, `anim` inside it.** `anim` fires on load, so an element below the
    fold finishes animating before it's ever seen.
12. **Never put `overflow: hidden` on an ancestor of `.scrub-stage`.** It silently kills
    `position: sticky` and the word fill stops tracking. This is why `body`'s old `overflow: hidden`
    had to go rather than being left in place.
13. **A new section with no `background` shows the video through it.** Build on `.section`, which sets
    one.
14. **The header is not sticky.** It scrolls away, which means the nav's anchor links are only reachable
    from the top of the page. Deliberate for now — see the note in the README.
