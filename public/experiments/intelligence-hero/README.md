# intelligence-hero — standalone experiment

A single-viewport, full-bleed video-background hero. Static **HTML + CSS + vanilla JS**, no build
step, no framework, no dependencies beyond three CDN font/icon links and one CloudFront MP4.

Starting point for a full landing page — right now it is the hero only.

---

## SCOPE — read this first

**Location:** `blueai/public/experiments/intelligence-hero/`
**URL:** `/experiments/intelligence-hero/index.html` — **the `index.html` is required, not optional.**

This page uses **relative** asset paths (`styles.css`, `logo.js`, …). At an extensionless URL like
`/experiments/intelligence-hero`, a browser resolves relative URLs against `/experiments/`, so every
local file 404s and the page renders completely unstyled — only the hero video survives, because its
URL is absolute. A `next.config.js` rewrite was tried and caused exactly that; it was removed.

**How `/blueai-desktop` gets away with the clean URL:** it declares
`<base href="/blueai-desktop/" />` in its head. That is the repo's established answer to this, and it
is why its rewrite is safe while ours was not.

To adopt the clean URL here, add `<base href="/experiments/intelligence-hero/" />` and restore the
rewrite. One side effect to handle first: with a `<base>`, a bare `href="#"` resolves to the page URL
and **reloads** instead of doing nothing — this page has two (the closer CTA and Sign in), so point
them at real anchors before switching.

It sits inside the blueai repo **only so it can be served and navigated to.** Physical location is
not scope: `/creator-brand` and the root Screen Library index live here too and are equally out of
VDA scope.

**Out of scope for:**
- **VDA** — do **not** fire the VDA bootstrap for work in this folder. No Gate 8, no `taste.md`,
  no `visual-designer/` notebook. This has no design-system contract with anything.
- **Every product surface** — not `/creator-brand`, not `/blueai-desktop`, not `/blueai-product`,
  not `/style-guide`. It shares no tokens, no stylesheet and no components with any of them.
- **`blueai-desktop`'s design system** — no `--bai-*` tokens, no `blueai-icons.js`, no
  `ds-drift-check.js`. Its variables live in its own `:root` in `styles.css`. The one thing borrowed
  is the *pixel logo geometry*, ported by hand into `logo.js` — a copy, free to diverge.

**Indexed under "Experiments" on the Screen Library**, deliberately grouped apart from the product
surfaces rather than listed among them.

It is an experiment. If it graduates into something real, that is a separate decision — until then
nothing else in the repo should depend on it, and it depends on nothing else.

---

## Files

```
index.html                      markup — hero + five sections + mobile menu
styles.css                      the hero: tokens, shell, header, hero, stats, menu
sections.css                    everything below the hero
logo.js                         the procedural pixel logo (ported from blueai-desktop)
main.js                         stat count-up + mobile menu
scroll.js                       scroll reveals + the §2 scrubbed word fill
assets/noise.png                160×160 tileable film grain
assets/closer-blob.mp4          closing video band (in use) — 1920×768
assets/closer-sphere.mp4        closing video band (alternate) — 1920×928
fonts/GeistPixel-Circle.woff2   fallback display face — SEE BELOW
COPY-AUDIT.md                   why every line of copy says what it says
EDITING.md                      ← how to change anything: text, style, image, video
```

## Page order

1. **Hero** — one full viewport over the video
2. **The morning** — scroll-scrubbed word fill; the emotional core
3. **What it runs** — six domain cards
4. **How it works** — three steps
5. **While you rest, it earns** — the money half
6. **Closer** — Get Access
7. **Video band** — the morphing blob, screen-blended into black
8. **Footer** — single bar

**Known gap: the header is not sticky.** It scrolls away with the hero, so the nav's anchor links are
only usable from the top of the page. Making it sticky isn't a one-liner — over the dark sections it
needs its own ground (a blur, a scrim, or a colour shift on scroll) or the white pills read as floating
detached. Left as a deliberate decision rather than a guessed treatment.

**Before editing anything, read [EDITING.md](EDITING.md).** It maps every knob in the template to an
exact file and line — all copy, the video swap, the logo swap, the trust icons, the stat data
attributes, the token palette, both font systems, the motion system, the breakpoint map, and the three
rules you must relax to turn this into a scrolling landing page.

## Run it

It is served by blueai's own preview server now — no separate server:

```bash
python -m http.server 8410 --directory "N:\Antigravity Main\blueai\public"
```

Then open `http://localhost:8410/experiments/intelligence-hero/`. Under `npm run dev` the clean URL
`/experiments/intelligence-hero` works too, via the rewrite.

**Never open it as `file://`.** That surface sandboxes sibling files — `styles.css` and the assets
silently fail and you get an unstyled page. It has to be HTTP.

---

## Assets — one note

**There is no logo image file.** The mark is drawn procedurally by `logo.js` — see `EDITING.md` §3. A
`logo.webp` stand-in existed early on and was deleted once the canvas replaced it; don't add one back
expecting it to be picked up.

**`fonts/GeistPixel-Circle.woff2` is not present.** The file does not exist anywhere in the
workspace. It is the *fallback* display face only — the primary display font,
`BubbledotICG-FinePos`, loads from the OnlineWebFonts CDN and is what the headline and stat glyphs
actually render in. The `@font-face` is wired exactly as specified, so dropping the file in is the
only step needed. Until then the fallback chain is
`BubbledotICG-FinePos → (missing) → monospace`, which only matters if the CDN is unreachable.

---

## Composition

One viewport (`100vh` / `100dvh`, `overflow: hidden`), three vertical regions over the video:

1. **Header** — logo circle · white nav pill (Home active, three-dot indicator) · dark Sign in pill.
   Enters on `slideDown`.
2. **Hero** — liveness pill (pulsing dot + count-up) · two-line dot-matrix headline · subhead ·
   glowing white CTA.
3. **Stats** — four world-action counts, 4 cols → 2 cols at ≤720px, counting up once on intersect.

## Every number on this page is illustrative

The live count, the coffees brewed, the miles driven, the campaigns run and the dollars paid are
**invented for the design**, not measured. Same posture as `/creator-brand`, whose dollar figures are
also illustrative rather than a researched rate card.

They read as present-tense proof on purpose — that is the brief (see below) — but nothing here is
wired to real telemetry, and the six capability domains are presented as one vision without
distinguishing what ships today. **Today only creators-and-brands campaigns are live.** Keep that in
mind before this page goes in front of anyone outside the company.

## The brief

The CEO's direction, after seeing `/creator-brand`: a visitor should arrive and grasp that BlueAI is
not a social-media tool but a command layer over **anything autonomous, digital or physical** — a
robot, a coffee maker, a robotaxi fleet, a car's AC, an automated curtain — and that **it is here
right now.** The reference point is the film *Her*.

The design consequence worth holding onto: **the more futuristic this looks, the more it reads as
concept art.** Sci-fi styling now signals vaporware. The astonishment comes from mundane specificity
in the present tense — "your coffee started brewing at 6:41" beats "the future of intelligence,"
because it's checkable. The video carries the *unreal*; the words should carry the *real*.

`.anim` drives the shared entrance (fade + rise + de-blur), sequenced by an inline `--d`. The
headline is the exception: its parent carries no reveal, each line fades in on its own delay.

## Conventions worth keeping

- **The headline is solid white.** No gradient, no shimmer, no LED scan.
- **No cards in the hero** — one composition.
- Nav and logo carry the soft shadow only: `0 4px 14px rgba(0,0,0,0.16)`.
- Trust logos are small **white inner circles inside dark padded rings**, never full-bleed white
  discs.
- Every colour and font stack goes through a `:root` variable. Add new ones there, don't inline.
- `prefers-reduced-motion: reduce` kills all animation and transition and shows the final state,
  including snapping the stat values straight to target.
