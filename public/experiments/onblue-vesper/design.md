# onBlue Agentic Hero: homepage design specification

`blueai/public/experiments/onblue-vesper/index.html`

One buildless standalone file: inline `<style>`, one inline classic `<script>` for
page behaviour, one `<script type="module">` for the WebGL hero, and
`ascii-object.js` beside it. No framework, no build step, no CSS file. Two
webfonts from Google Fonts (Inter variable, Instrument Serif italic only), with a
commented self-hosting block already in place.

The page is the onBlue Cinematic light theme with one band replaced: the agentic
hero. Everything from the header down through the footer is the cinematic system;
the hero is its own block, appended last in the stylesheet so it wins on any
selector the two share.

---

## 1. Foundations

### 1.1 Theme

Every colour, glow, shadow and blend switch is a CSS custom property on `:root`,
with a complete second set under `:root[data-theme="light"]`. Nothing is hardcoded
into a rule that needs to change between themes, so a theme swap is a token swap
and never a rule rewrite.

An inline script at the top of `<head>` writes `data-theme="light"` before the
stylesheet parses, so the first paint is already correct. There is no toggle in
the markup on this page; `.theme-toggle` styling survives from the source theme
and is currently unused.

Three things genuinely break when the ground flips, and each is handled by a
switch rather than by a duplicate rule:

| Switch | Dark | Light | What it governs |
|---|---|---|---|
| `--blend-lift` | `screen` | `multiply` | grain, the particle art, every aberration copy |
| `--blend-hero` | `overlay` | `multiply` | the hero grain sheet |
| `--hands-filter` | `invert(1)` | `none` | the particle art is natively dark on pale |
| `--hands-ca` | `1` | `0` | its aberration pass has no pale ground left to tint |

Light also re-tunes what fails on white: `--blue-ink` becomes the brand blue
itself (`#156efe` clears 4.5:1 on white), `--green` steps from mint `#45edbc` to
grass `#16a34a`, glows become casts, and every stacked two-pass drop-shadow
collapses to a single longer pass because on white the eye finds the inner pass's
falloff edge as a visible ring.

### 1.2 Palette (light, the shipped theme)

```
ground          --bg            #ffffff
ink             --ink           #0b0b0d
ink soft        --ink-soft      #16171b
lede ink        --lede-ink      #3c4049
muted           --muted         #5f636b
dim ink         --dim-ink       #767b85
brand blue      --blue          #156efe
blue ink        --blue-ink      #156efe
green           --green         #16a34a
green ink       --green-ink     #15803d
hero accent     --accent        #2f6dff   (the ASCII sweep band only)
```

Surfaces step in fractions of a percent, not in tens:

```
card            --charcoal      #ffffff
badge           --charcoal-2    #fdfdfd
lifted band     --band-lift     #fafbfb
tinted band     --band-tint     #fdfdfd
nested panel    --panel-bg      #fdfdfd
data bars       --bar-bg        #f6f6f8
```

Strokes: `--border` 15% black, `--border-soft` 10%, `--hair` 8%, `--band-line`
4%. Section joins get the lightest one because they run the full page width and
carry far more ink than the same weight around a card.

### 1.3 Typography

Two families. `Inter` for everything, `Instrument Serif` italic for exactly one
job: the emphasised phrase inside a heading. The serif always arrives blue,
always at `1.06em` to `1.08em` of its host so the x-heights match, and always at
`letter-spacing: -0.03em`.

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Hero h1 | `--h1`, 48px base | 500 | -0.045em | 1.12 |
| Section h2 | `clamp(30px, 3.4vw, 52px)` | 500 | -0.04em | 1.08 |
| Closing h2 | `clamp(38px, 5.2vw, 74px)` | 500 | -0.045em | 1.05 |
| Hero lede | `--lede`, 15.5px base | 400 | -0.015em | 1.55 |
| Band sub | `clamp(15px, 1.15vw, 18px)` | 400 | -0.015em | 1.55 |
| Eyebrow | 11px | 500 | +0.14em, uppercase | - |
| Card h3 | 17px to 20px by section | 600 | -0.03em | - |
| Body / list | 12px to 14.5px | 400 | -0.01em | 1.45 to 1.6 |
| Button | `--btn`, 13.5px base | 500 | -0.02em | 1 |
| Footer wordmark | `clamp(84px, 19vw, 300px)` | 600 | -0.055em | 1 |
| Terminal log | 11.5px monospace | 400 | -0.01em | 1.6em |

Negative tracking scales with size: the larger the type, the tighter it is set.
Uppercase is used once, for the eyebrow, and it is the only positive tracking on
the page.

### 1.4 The responsive type ladder

Sizes are tokens, not rules, so the whole page rescales from one block per
breakpoint. Six width steps and two height steps:

| Breakpoint | `--h1` | `--btn-h` / `--hero-btn-h` | `--header-x` | `--band-max` |
|---|---|---|---|---|
| under 560 | 34px | 44 / 52 | 16px | 1180px |
| 561-900 | 36px | 44 / 52 | 18px | 1180px |
| 901-1279 | 42px | 32 / 42 | 28px | 1180px |
| base (1280-1599) | 54px | 34 / 44 | 48px | 1180px |
| 1600-1919 | 64px | 38 / 48 | 64px | 1240px |
| 1920-2559 | 76px | 40 / 52 | 80px | 1340px |
| 2560 and up | 88px | 40 / 52 | 120px | 1480px |

Height steps exist because the hero is one frame on desktop: at
`max-height: 850px` the header padding, hero gap and headline all come down; at
`max-height: 720px` they come down again. Touch targets go the other way, up to
44px at phone widths.

### 1.5 Geometry

```
section width   --band-max      1180px, growing to 1480px
section gutter  max(--header-x, 20px)
section rhythm  --band-y        clamp(76px, 8.5vw, 132px) top and bottom
card radius     --card-radius   16px
button radius                   6px
tile radius                     9px to 12px
pill radius                     999px  (badge, chip note, caption bubble)
grid gap                        18px between cards, 8px to 12px inside them
stroke                          1px everywhere, 1.5px only for the card sheen
```

The header, every section and the footer all resolve their width from the same
`--band-max` and the same gutter, so one vertical edge runs the length of the
page.

### 1.6 Shadow language

Dark emits light, light casts it. Both readings live in the same token names.

In light, the solid button carries three stops that describe contact, near
falloff and ambient body, all tinted `rgba(16, 16, 19, ...)` rather than neutral
black, because a coloured object casts a coloured shadow and pure black on white
reads as dirt. Hover moves the light toward the surface: the contact stop sharpens
and darkens, the ambient stop shrinks and lifts, and the button itself drops 1px
(`translateY(1px)`, 2px on `:active`). Shadow alone reads as the light changing;
the 1px is what makes it a press.

Cards use a two-stop ambient shadow that gains a blue-tinted lift on hover. FAQ
rows keep only the contact stop, because six of them stacked 10px apart would
pool their ambient bodies into a grey ladder.

---

## 2. Layer stack and background effects

Bottom to top:

```
 0   .hero-media        the clay field (hero only)
 0   .band::before      per-band grain
 1   .ascii-bg          the 2D glyph field (hero and #agents)
 1   .hero-ascii        the WebGL ASCII model (hero only)
 1   .band-inner        section content
 2   .hero              hero copy and CTA
 2   .content           everything below the hero
 3   .card::after       the travelling edge sheen
40   .menu-backdrop
50   .header
60   .burger
100  .grain-hero        the hero grain sheet
```

### 2.1 Grain

One `feTurbulence` SVG as a data URI, `fractalNoise`, `baseFrequency 0.75`,
4 octaves, tiled at 200px. It rides each band individually rather than as one
page-wide sheet, so a section can carry its own amount: `--band-grain` is 0.045 in
light, and `#companies` sets it to 0 so that band stays clean under the spark.

The hero has its own sheet, `.grain-hero`, fixed at `100dvh`, `--grain-hero`
0.022, on `multiply` in light and `overlay` in dark.

### 2.2 The hero field

A three-layer CSS gradient, not a video. The stops were sampled off the clay
backdrop of the `amb-opening` clip, then every stop was swapped for a neutral of
the same luminance with a faint cool cast, and mixed twice toward the page ground
so the relationships between them survive while the field sits within about
fifteen levels of the page.

```css
radial-gradient(115% 85% at 10% 6%, #f6f6f8 ...)     the light source
radial-gradient(95% 80% at 97% 44%, #d8d9de ...)     the cool right side
linear-gradient(118deg, #f4f4f7 ... #dfe0e6)         the body
+ ::before radial at 88% 96%                         the cool bottom-right corner
+ ::after  --hero-scrim                              the fade into the page
```

The whole element is masked `linear-gradient(180deg, #000 68%, transparent)`.
That fade is load-bearing: without it the field's last stop `#dfe0e6` meets the
page at `#ffffff` in one pixel across the full width, and that step reads as a
ruled line under the hero.

The two unreferenced video files (`hero.mp4`, `hero-light.mp4`) are still in the
folder if the field ever goes back to being a clip.

### 2.3 The ambient glyph field

One implementation, two hosts: `#agents` and `.hero-wrap`. A 2D canvas inserted
as the first child of each, `aria-hidden`, `pointer-events: none`, at 0.4 opacity.

```
ramp     ' .,:;i1tfLCG08@'      15 steps
cell     15px grid, 11px monospace glyphs
ambient  only cells whose seed > 0.948 draw at all, at 0.075 alpha,
         breathing +/- 0.035 on a 0.0011 rad/ms sine
lens     a 190px radius pool at the pointer, quadratic falloff, +0.42 alpha
churn    the glyph index rolls on time and on lens strength, so the pool
         both brightens and reshuffles
fringe   lens * (1 - lens) * 4, so it peaks at the RIM of the pool and is
         absent at its centre and outside it: red at -1px, cyan at +1px
tint     lerps --ascii-a to --ascii-b by lens strength
         light: 18,20,26 resting, toward 21,110,254 in the pool
```

Throttled to roughly 14fps (68ms), parked entirely off screen via
`IntersectionObserver`, and re-seeded on resize. Under `prefers-reduced-motion`
the ambient breath and the time roll both stop but the pointer lens still works,
because a lens that follows the cursor is a response, not an animation.

### 2.4 The WebGL ASCII model

`ascii-object.js`, three.js 0.169.0 pinned through an importmap, mounted only at
`window.innerWidth >= 640`. It renders a GLB to an offscreen target, then runs a
glyph-cell pass and an atlas pass over it. The canvas is `opacity: 0` until the
first model actually loads, so a failed asset leaves no trace.

```
cellSize 11 | cellAspect 0.55 | contrast 1.6 | edgeContrast 3 | exposure 1.05
colored false, color #3d3d44   one ink, so the model's own texture colours
                               never drag onto the page
fov 32 | cameraDistance 9.8 | orbit off | zoom off
opacity 0.5, masked radial per model (--ascii-mask)
```

Six models rotate: `arm` to `robot100` to `car` to `cleaner` to `dog` to
`sweeper`. Each holds 5 to 7 seconds (randomised, so the loop never becomes a
metronome), then a 4s ASCII sweep band travels across the frame and the model is
exchanged underneath it. The swap point is solved from the shader's own head
equation against the model's projected screen x, so the exchange happens when the
band is actually over the object rather than at the middle of the frame.

The rigged arm (`robot.glb`) has hinge-constrained CCD inverse kinematics on a
six-joint chain measured out of its own animation clip, clamped to 92% of its
measured reach so the solver always has a real solution to converge on. It hangs
from the top of the frame via `mountTop` and a named anchor node. The five props
are unrigged and turn to follow the cursor instead (`pointerLook` 0.6 to 0.8).

Every preset resets the IK fields explicitly, because a prop inheriting the arm's
chain would spend every frame hunting for bones it does not have.

---

## 3. Header

Fixed, full width, `z-index: 50`, on the same `--band-max` grid as every section.
Three columns: `1fr auto 1fr`, so the nav is optically centred regardless of what
the two ends weigh.

**At rest:** transparent, `--header-y` 22px of top padding, 10px bottom, a
transparent 1px bottom border.

**Stuck** (the moment a 40px `.scroll-probe` at the top of the document leaves the
viewport, which is cheaper than listening to scroll): padding contracts to 62% of
`--header-y` top and bottom, background becomes `--glass`
(`rgba(255,255,255,0.7)`), `backdrop-filter: blur(18px)`, and the bottom border
takes `--glass-line`. All four transition together over 0.35s.

**Logo.** The spark glyph at `--logo-mark` 28px in `--spark-ink` with
`--mark-shadow` (a 12px blue halo at 0.18 in light), then "onBlue" at 19.5px/600
with `-0.03em`, where "on" is blue and "Blue" is ink. Gap 5px.

**Nav.** Four links: Benefits, How It Works, FAQs, For businesses. 14px/400,
40px tall, 18px of side padding, `-0.01em`. Hover fades ink to `--muted` over
0.35s, which is a recession rather than a highlight. The fourth link carries a
north-east arrow marking the one destination that leaves this page; it is sized in
`em` (`1.6em`) so it tracks the label rather than sitting at a fixed pixel size
beside it.

**Header CTA.** "Start earning", the small step of the two-size button system.
It has two states tied to the hero:

- Above the hero's own CTA: outline. Transparent fill, ink text, ink border, no
  shadow. Hover inverts to solid ink with a `--bg` label and still no shadow,
  because this is a secondary control while the hero's primary is on screen.
- Past the hero CTA (an `IntersectionObserver` on the hero button itself with
  `rootMargin: -72px`, so it holds at whatever height the hero resolves to): it
  fills in as `--solid-bg` with the full `--solid-shadow`, becoming the button the
  rest of the page uses.

**Mobile.** Below 900px the grid becomes `1fr auto auto`, a 42px burger appears,
and the nav becomes a fixed full-screen layer at `z-index: 45` with 56px/19px
links, fading in over 0.28s behind a `blur(24px)` backdrop. The burger's three
16px bars fold into an X. `backdrop-filter` is removed from the header while the
menu is open, because it would make the bar a containing block and trap the fixed
menu inside it.

---

## 4. Hero

`min-height: calc(100dvh - 78px)`, a grid of one row. Above 900px `.page` is
`height: 100dvh; overflow: hidden`, so the hero is exactly one frame and the page
scrolls past it. Below 900px it grows and scrolls normally.

Two columns, `minmax(0, 1.06fr) minmax(0, 0.94fr)`, gap `clamp(32px, 5vw, 72px)`,
`max-width: var(--band-max)`. The split is tied to the section width rather than
pinned, so the copy column grows at exactly the widths where the type ladder steps
up. The copy column is capped at 620px and left-aligned; the right column is where
the ASCII model lives (it renders into the full-bleed canvas behind, positioned by
`xOffset` rather than by the grid).

Vertical placement is asymmetric padding, not a transform: top padding is
`max(0px, --hero-gap - --hero-rise)` and bottom is `--hero-gap + --hero-rise`,
with `--hero-rise` 28px. The block stays in flow so nothing below it moves, and
the two short-viewport breakpoints still get to shrink the gap.

**Headline.** Two `.headline-line` spans rather than a `<br>`, so each line can
carry its own masked entrance. `-0.045em` at 1.12. The serif phrase, "digital and
physical", is blue with `--em-shadow` and its own fade-and-unblur arriving at
0.72s. The spans carry no styling of their own: they are flex children of the
`h1`, so each takes its own line, and they sit flush with the badge, lede, button
and sign-in line below.

That last part used to need a rule. `.headline-line` carried 0.15em of side
padding so a clipping mask could not cut the italic's overhang, and a matching
`-0.15em` pulled the text back to the shared column edge. Both the padding and
the `overflow: hidden` it was protecting against have since left the sheet and
only the correction survived, which hung the headline 0.15em (about 8px at
`--h1`) left of everything under it. Removed 2026-09-15. If the masked entrance
is ever given its overflow back, the padding and the negative margin come back
together, as a pair, or the column edge breaks again.

**Lede.** "Individuals can own an agent, customize it, / and earn from the work it
does." An explicit `<br class="lede-br">` sets the break on desktop; it is
`display: none` below 900px.

**CTA.** One button, `.btn-solid .hero-solid`, the large step: `--hero-btn-h`
44px, 26px of side padding, `--btn + 1.5px`. Solid ink fill in light, not blue.
The label sits inside a `.scramble` wrapper for the decode micro-interaction.

**Sign-in line.** 13.5px muted, underlined at `--link-underline` with a 3px
offset, `margin-top: var(--actions-mt)` so the same token that sets the gap above
the button sets the gap below it and the CTA is genuinely centred between the lede
and this line.

**Rhythm.** Gaps grow with semantic distance, not evenly: badge to title 26px,
title to lede 20px (the tightest pair, one thought), lede to CTA 34px (the widest,
where reading stops and acting starts), CTA to sign-in 14px (belongs to the
button, not to the block).

**Scroll cue.** Bottom centre, `.scroll-cue`, a real anchor to `#agents` so a
keyboard can reach it. The word "Scroll" at 10.5px/500 uppercase `+0.14em` over a
17px chevron. It drifts 6px on a 2.8s ease-in-out loop rather than bouncing: a
bounce is an alert, this is a hint. At rest it sits at 0.55 opacity, going to 1 on
hover. `.is-scrolled` (set by the same probe that sticks the header) fades it out
entirely and removes its pointer events, because by then it has said everything it
had to say.

---

## 5. Buttons

Two sizes from one base. `.btn` is an inline-flex box with a 6px radius, 500
weight, `-0.02em`, `line-height: 1`, and a five-property transition (background,
border-color, box-shadow, color, filter at 0.35s; transform at 0.18s).

| Size | Height | Padding | Font | Where |
|---|---|---|---|---|
| small | `--btn-h` 34px | 16px | `--btn` 13.5px | header |
| large | `--hero-btn-h` 44px | 26px | `--btn + 1.5px` | hero, closing section |

Two treatments:

- **Solid** (`.btn-solid`): `--solid-bg` fill, `--solid-ink` label, 1px border in
  the fill colour, `--solid-shadow`. Hover deepens the fill to `--solid-bg-hover`
  (`#26262b`), pulls the shadow toward the surface and drops the button 1px.
  `:active` drops it 2px.
- **Ghost** (`.btn-ghost`, `.hero-ghost`): `--charcoal-2` or a translucent fill
  with `backdrop-filter: blur(16px)`, a warm grey border, and an inset top
  hairline. Hover brightens the border and adds a soft outer bloom.

At 560px and below the action rows go vertical and every button goes full width.

---

## 6. The section system

Each `<section class="band">` carries `--band-y` top and bottom, the shared
gutter, a grain pseudo-element, and a `.band-inner` at `--band-max`.

Joins are hairlines: `.band + .band` takes a 1px `--band-line` top border, and
`.content > .band:first-child` takes one too so the join under the hero is not the
one join that is missing. `#get-access` explicitly drops it, so the closing
statement runs straight on from the FAQs.

Backgrounds alternate rather than running as one white sheet:

```
#benefits      --band-tint   #fdfdfd
#agents        --band-lift   #fafbfb
#how-it-works  --band-tint   #fdfdfd
#companies     white, grain 0
#faqs          white
#get-access    white, no top rule
```

**Band head.** Either left-aligned with a `.band-top` flex row that puts the h2 at
the left and the eyebrow at the right on a shared baseline with a 40px gap, or
`.band-head--center` at 820px with the eyebrow above.

**Eyebrow.** 11px/500 uppercase at `+0.14em` in `--dim-ink`, with a
`clamp(34px, 6vw, 88px)` hairline running into it: a gradient from transparent to
`--rule`, so it is darkest where it meets the label. Centred heads get the
mirrored rule on the other side.

**Band note.** The pill that closes several sections: `999px` radius, 13px/22px
padding, a blue icon, `--note-ink` at 14px, centred by a `.band-foot` flex row,
40px above.

**Card.** The one surface primitive. 1px `--border-soft`, 16px radius,
`--card-bg`, `--card-shadow`. Hover raises the border to `--card-line-hover`,
swaps in the blue-tinted `--card-shadow-hover` and lifts the card 2px over 0.35s.

**The card sheen.** A `::after` inset by `-1.5px` with `padding: 1.5px`, holding a
260px radial gradient at `--gx`/`--gy`, masked with `mask-composite: exclude` so
only the ring survives. A single `mousemove` listener on the document finds the
card under the pointer and writes those two custom properties once per frame,
which makes light appear to travel along the card's own stroke. In light the ring
also takes a `drop-shadow(0 0 7px rgba(21,110,254,0.5))` bloom, because on white
the light-to-dark swap the dark theme relies on barely registers.

---

## 7. Section inventory

### 7.1 Benefits, "The onBlue economy"

Two `.eco-panel` cards on a 2-column grid, gap 18px, 96px below the head, each at
least 485px tall.

Copy is capped at 30% of the panel width so the illustration behind it has room.
Below it, `.agent-row`: four tiles per panel at `flex: 1 1 150px`, each a 34px
icon over a 13.5px label, on `--tile-bg` (a 62% white wash) with
`backdrop-filter: blur(10px)` so the artwork behind settles without being sealed
off.

The illustration sits absolutely at `top: -44px; right: 6px`, 64% wide, capped at
360px, aspect `720/980`, masked to fade out below 50%. It is built from three
stacked layers sharing one `--art` custom property:

```
.art-base    grayscale(1) contrast(1.1)     the resting state
.art-ca--l   filter: url(#ca-red)           masked to the left 28%
.art-ca--r   filter: url(#ca-cyan)          masked to the right 28%
```

On panel hover the base drops its grayscale to full colour, the two channel copies
fade to `--ca-opacity` (0.2 in light) and separate by 2px each way, and the whole
illustration scales 1.055 from a `55% 35%` origin. Under `(hover: none)` the
colour version simply shows and the channel copies are removed.

Hovering an individual agent tile swaps the panel's artwork to that agent's own
render; leaving the panel reverts on an idle timer rather than on `mouseleave`,
because the gaps between tiles fire `mouseleave` and reverting there would
flicker. Six of the nine renders have a `-light` twin, picked at paint time from
the theme rather than held as a second attribute in the markup.

Below the two panels, `.rail`: a card holding the flow diagram. A work node whose
label cycles through six job types on a 13.2s loop (each `<b>` absolutely stacked
in a 132px box, 2.2s apart, sliding 8px in and out), a 58px track with three 5px
blue dots travelling it on a 2.4s loop, a 64px `.rail-core` disc (in light: filled
brand blue, white spark, its own 13px blue drop-shadow, no pulse), and three
output chips that light in sequence on the same 2.4s cadence.

### 7.2 Partnered agents

Three `.agent-card`s, centred text, 52px below the head. Each is a title (20px/600
with a blue span), a 14px sub, a terminal, and a 3-column skill grid.

The terminal: 10px radius, `--term-line` border, a `.term-bar` chrome strip with
three 7px dots on `--term-bar-bg`, and a `6.4em` window (exactly four rows)
holding a six-row log that scrolls on an 11s keyframe. The keyframe holds each
frame then slides quickly, and its final frame is one full period,
pixel-identical to the first, so the loop wraps without a jump. Log lines are
11.5px monospace in `--dim-ink`, with `.t-task` in ink and `.t-done` in blue.

Skills are 12px tiles on `--skill-fill` with blue icons. At 560px and below they
go to one column and reflow from stacked to a row.

This section is one of the two hosts of the ambient glyph field.

### 7.3 How it works

Three `.step` cards. Each has a 38px numbered disc (blue-tinted fill, blue border)
beside an 18.5px title and a 13.5px sub, then a `.step-art` panel at 12px radius
on `--panel-bg` that demonstrates that step:

1. **Own an agent**: a `.pick-list` whose rows light blue in sequence with a
   check mark appearing.
2. **Customize it**: three `.slider` tracks whose fills retune around their
   authored `--v`.
3. **Earn from its work**: a seven-bar chart (the last bar in brand blue), a
   `clamp(30px, 3vw, 40px)` figure, a blue delta, and a green payout pill.

Nesting alternates rather than stacking: the card is white, the panel inside steps
down 1%, and the rows inside come back to white. Stacking would make the innermost
element darkest and read the nesting as depth rather than as structure.

The bars grow on the same reveal trigger the sections use, `scaleY` from a bottom
origin with 50ms stagger. All three demos are off by default so nothing loops
unattended; they run while hovered, and once for 4 seconds when the card first
scrolls into view (`.demo`).

### 7.4 Companies

A three-column grid `0.86fr / 1.28fr / 0.86fr` with an SVG wire layer behind it.
Wires use `pathLength` normalisation so every run travels at one speed regardless
of its length, and `vector-effect: non-scaling-stroke` so they stay hairlines. The
beams are a `6 94` dash travelling a 3.2s loop with a per-wire `--t` delay and a
blue `drop-shadow`.

The centre holds the spark mark at `clamp(112px, 13vw, 172px)`, rotating once
every 60 seconds, wearing `--ca-spark --spark-shadow`. Three caption bubbles float
around it on 5.5s offset loops, 7px of travel each.

**The spark lens.** A pointer-driven chromatic aberration. `pointermove` anywhere
in the section computes the vector from the pointer to the mark's centre, and
rewrites `dx`/`dy` on the `.ca-r` and `.ca-g` `feOffset` nodes so the split axis
points along the cursor-to-mark line and its amount grows quadratically as you
approach (`FALLOFF` 430px). Light travels further than dark (rest 1.1 to peak 3.4,
against 0.35 to 2.1) because light's filter paints a fringe onto a blue spark where
the same travel is sub-pixel, while dark's splits a white one where a fraction of
a pixel already reads. One `requestAnimationFrame` per move, coalesced.

This band sets `--band-grain: 0` so the field stays clean under the spark.

Below 1100px the wires are removed, the core stacks, and the bubbles become static
inline elements.

### 7.5 FAQs

Native `<details>` rows, 10px apart, 12px radius, `--faq-line` at 7% black (half
the usual, because six stacked borders add up into a grid). Summary is
`clamp(15px, 1.2vw, 17px)`/500 at `-0.025em` with 20px/22px padding. The marker is
suppressed and replaced by a `.faq-sign`: two 1.5px bars, the second rotated 90
degrees, which rotates back to 0 and fades on open, so a plus becomes a minus in
one 0.3s move. Open state raises the border to `--faq-line-open`. Answers are
14.5px/1.6 capped at 780px.

### 7.6 Closing, "You could be one of them."

Centred. A 44px spark mark with `--close-shadow` above a
`clamp(38px, 5.2vw, 74px)` headline whose serif phrase is typed.

The typing runs the line through five endings once and settles back on the first,
so the page at rest shows the written headline: `one of them.` / `owning agents.` /
`earning while they work.` / `running a workforce.` / `paid for every job.`
Timing is 52ms per character on, 26ms off, 2400ms hold, 520ms gap. It builds
character cells rather than rewriting `textContent`, so the layout never reflows,
and a caret is absolutely positioned after the last visible character. It re-arms
only if the section has been off screen for 10 seconds, so it never loops at a
reader sitting on it.

Padding here is deliberately asymmetric: `max(32px, --band-y - 64px)` on top,
`clamp(92px, 10vw, 150px)` on the bottom.

---

## 8. Footer

Four columns, `1.7fr / 1fr / 1fr / auto`, 40px gap, 60px of top padding, on the
same `--band-max` grid.

Brand block (logo plus a two-line statement at 14px/1.65), two link columns at
13.5px, and a "Back to top" link pushed to the far right. Column links are muted
and go to ink on hover over 0.3s; their icons sit at 0.65 opacity.

**The wordmark.** `clamp(84px, 19vw, 300px)`, 600 weight, `-0.055em`, in a
`.foot-crop` box of `0.9em` against a 1em line, so roughly the lowest tenth of the
letterforms is cut by the edge of the page. Three copies are stacked: the base,
plus two channel-filtered copies masked to the outer 16% at each end and offset
3px each way, so the split shows at the ends of "onBlue" and nowhere in the
middle. In light those two copies are painted directly (`#f7a9ad` and `#a8e2ea`,
pulled well off full saturation) rather than channel-filtered, because a channel
filter on a near-black wordmark returns black.

**The footer spark** rises from behind the letters at `1.05em`, `top: -0.3em`,
with the glow on the outer box (free to spread) and the fade plus the split on an
inner box. The fade is solid through the top 38% then falls away to nothing by
92%, so the spark dissolves at its base rather than going translucent overall.

A `.foot-tail` rule closes the page with the copyright and "Human ambition. Agent
execution.", with `padding-bottom: max(30px, env(safe-area-inset-bottom))`.

Below 900px the grid becomes two columns with the brand and the back-to-top link
spanning both.

---

## 9. Motion

### 9.1 Entrance

`.appear` elements animate on load with `--d` as a per-element delay and
`var(--ease)` = `cubic-bezier(0.16, 1, 0.3, 1)` throughout. Four variants:

| Class | Motion | Duration |
|---|---|---|
| `appear--fade` | opacity only | 0.7s |
| `appear--soft` | opacity + 14px rise | 1.05s |
| `appear--mask` | opacity + 40% rise inside a clipped line | 1.05s |
| `appear--btn` | opacity + 18px rise + `scale(0.94)` | 1.05s |

The hero cascade: header at 0.06s, headline lines at 0.42s and 0.62s, the blue
serif's own unblur at 0.72s, lede at 0.82s (stretched to 1.25s), CTA at 0.96s,
sign-in at 1.24s.

Each animated element gets `.is-in` on `animationend`, which freezes it at the
finished state, and a double-`requestAnimationFrame` check catches anything whose
animation never started.

### 9.2 Scroll reveal

`.reveal` elements start at `opacity: 0; translateY(22px)` and transition over
0.75s with an optional `--rd` delay. The hidden state is applied only under
`.js` on `<html>`, so a dead script leaves the page fully readable. An
`IntersectionObserver` adds `.in`, and for `.step` cards it also adds `.demo` for
4 seconds to run the step's demonstration once.

### 9.3 Ambient loops

| Element | Duration | Shape |
|---|---|---|
| work label cycle | 13.2s | six labels, 2.2s apart, 8px slide |
| rail flow dots | 2.4s | three dots, 0.8s apart, left 0 to 100% |
| rail core pulse | 2.4s | shadow and border (light: ring, not halo) |
| output chips | 2.4s | border and fill light in 0.2s sequence |
| terminal log | 11s | six frames, hold then slide |
| demand beams | 3.2s | dash offset, per-wire delay |
| spark index | 60s | one full rotation |
| caption bubbles | 5.5s | 7px float, three phases |
| scroll cue | 2.8s | 6px drift |
| step demos | 3.9s | pick, slider and bar, staggered |
| model rotation | 5-7s hold + 4s sweep | six GLBs |
| glyph field | about 14fps | ambient breath + pointer lens |

### 9.4 Transitions

0.35s is the page's standard for a state change (buttons, header, cards, nav).
0.3s for links and small marks, 0.18s for transforms, 0.28s for the mobile menu,
0.4s and 0.45s for the card sheen and the illustration hover. Colour on
`html, body` transitions at 0.4s so a theme swap is a dissolve.

### 9.5 Reduced motion

`prefers-reduced-motion: reduce` kills every transition and animation globally
with `!important`, drops the particle mask, hides the flow dots, shows only the
first work label, and forces every entrance and reveal to its finished state. The
closing typewriter and the spark lens both bail out entirely. The model rotation
does not start. The glyph field keeps its pointer lens but stops its own churn.

---

## 10. Micro-interaction inventory

| Interaction | Trigger | Behaviour |
|---|---|---|
| CTA decode | `mouseenter` / `focus` on `.scramble` | each character is frozen at its real width, then glyph noise settles into the real letters left to right, so nothing reflows |
| Card edge sheen | `mousemove` over any `.card` | one style write per frame moves a 260px radial along the card's own 1.5px stroke |
| Illustration colour | `.eco-panel:hover` | grayscale drops, two channel copies fade in and separate 2px each way, whole art scales 1.055 |
| Agent art swap | `mouseenter` on a `.agent-row li` | panel artwork fades to that agent's render; reverts on an idle timer, not on leave |
| Spark lens | `pointermove` in `#companies` | filter offsets rewritten so the split points at the cursor and grows as it nears |
| Glyph pool | `pointermove` in the hero or `#agents` | a 190px pool brightens, churns and fringes at its rim |
| Header fill-in | hero CTA leaves the viewport | outline button becomes the solid page button |
| Header blur | 40px probe leaves the viewport | glass, blur, hairline, tighter padding |
| Scroll cue exit | same probe | fades to 0 and stops taking pointer events |
| FAQ sign | `<details>` open | plus rotates and fades into a minus |
| Step demos | hover, or first reveal | that step's own diagram runs once |
| Button press | `:hover` / `:active` | 1px then 2px drop with the shadow tightening |
| Nav hover | `#site-nav a:hover` | ink recedes to muted rather than brightening |
| Stub links | click on `[data-stub]` | `preventDefault`, keeping focus order and keyboard behaviour intact |

---

## 11. Image aesthetics

Nine agent renders as `.webp`, plus six `-light` twins for the illustrations that
are too dark for a white page. All are mid-tone art on transparent backgrounds,
composed portrait at roughly `720/980`.

They are never shown flat. The resting state is `grayscale(1) contrast(1.1)` in
light (`grayscale(1) brightness(0.94) contrast(1.06)` in dark, where the ground
takes light out), and colour is earned by hover. Every one is masked to fade out
below 50% of its own height so it dissolves into the card instead of ending on a
cut edge, and every one is `pointer-events: none` so it never competes with the
tiles drawn over it.

The theme picks the file at paint time from a lookup of which names have twins, so
the markup holds one base name and nothing has to be rewritten when a twin is
added.

Six GLBs (6.9MB total) run through `gltf-transform optimize --compress draco
--texture-size 128 --texture-compress webp`, down from 99MB. Their textures are
effectively irrelevant: the ASCII pass renders them in one ink.

---

## 12. Responsive behaviour

| Width | What changes |
|---|---|
| 2560 and up | type ladder tops out, gutter 120px, band 1480px |
| 1920 and up | full ladder step, gutter 80px, band 1340px, nav gap 10px |
| 1600 and up | ladder step, gutter 64px, band 1240px |
| 901 and up | hero locks to exactly one frame (`height: 100dvh; overflow: hidden`) |
| 1279 and below | ladder steps down, illustration to 56%, copy cap to 27% |
| 1100 and below | agents and steps to one column, demand to one column, wires removed, bubbles static |
| 900 and below | burger and full-screen menu, page scrolls normally, eco grid to one column, band head reverses to column, rail turns vertical, footer to two columns, `lede-br` removed |
| 700 and below | illustration to 175px, agent tiles two-up, panel min-height 420px |
| 560 and below | action rows vertical and full width, skill tiles to one column and horizontal |
| under 640 | the WebGL model does not mount at all |

Two height breakpoints (`max-height: 850px` and `720px`) compress the hero so it
still fits one frame on a short laptop.

Safe-area insets are honoured on the header, the mobile nav and the footer tail.

---

## 13. Conventions worth keeping

- **One token, one value.** If a colour is not a token it cannot switch themes.
  Every rule that would need two readings is expressed as a switch instead.
- **Specificity is flat on purpose.** The hero block is appended last rather than
  escalating selectors. Several past defects were a two-class selector quietly
  outranking a one-class modifier.
- **Measure, do not eyeball.** The hero field's stops were sampled off a frame;
  the model swap point is solved from the shader's own equation; the arm's joint
  limits were read out of its animation clip.
- **Effects are ambience, not content.** The glyph field, the grain, the wires and
  the spark all sit at low alpha behind the thing the reader is meant to read, and
  every one of them parks itself off screen.
- **Nothing loops unattended** except the deliberate ambient set in section 9.3.
  The step demos, the closing typewriter and the CTA decode all run on attention.
- **A dead script leaves a readable page.** Reveal hiding is gated on `.js`, the
  typed headline only engages once its cells exist, and the WebGL canvas stays at
  `opacity: 0` until a model has actually loaded.
