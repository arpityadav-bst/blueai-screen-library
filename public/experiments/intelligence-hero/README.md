# intelligence-hero — "Own an AI That Works For You"

The BlueAI worker page: a full-page scrolling site built around the product's actual storyline —
you deploy an AI worker on your own PC, it finds real work from brands, completes it, and pays you
**$30 every month via PayPal**. Static **HTML + CSS + vanilla JS**, no build step, no framework, no
dependencies beyond two CDN font links and one CloudFront MP4.

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
is why its rewrite is safe while ours was not. To adopt the clean URL here, add the `<base>` tag and
restore the rewrite — but first repoint the bare `href="#"` links (see "Known gaps"), because with a
`<base>` they resolve to the page URL and **reload** instead of doing nothing.

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

---

## The storyline (2026-08-18 — the current copy, supplied by the designer)

This is the page's source of truth for content. Earlier copy phases are history in `COPY-AUDIT.md`.

- **Hero:** *Own an AI That Works For You.* "BlueAI is an AI worker you deploy on your own PC. It
  finds real work from brands, completes it, and pays you." CTA is **Get Access** (an explicit call:
  the storyline mock said "Apply Now"; Get Access is kept everywhere).
- **The offer:** you apply once → get accepted → install BlueAI on your PC and sign in → approve each
  campaign, your worker completes it, and you **collect $30 every month via PayPal**.
- **One worker, any machine you own:** Your PC (**earning now**) · Home robots (**soon**) ·
  Robotaxis (**soon**) · Whatever's next (**soon**). Status badges are honest and deliberate — they
  come from the storyline itself.
- **While you sleep:** you approve the work; from there the worker doesn't clock out — leave the PC
  on and it keeps at it, adding to your balance.
- **Closer:** *Everyone will have one.* "Yours could be earning you $30 every month." Plus a
  **live clock** line ("It's 4:12 pm. Your worker would be earning right now.") — real time via JS,
  because a checkable clock reads as a live product and a hardcoded one reads as a mockup.

## Copy history (three phases, all recorded in COPY-AUDIT.md)

1. **CEO vision brief** — "out of this world, and here right now"; BlueAI as a command layer over
   anything autonomous; reference point the film *Her*.
2. **Investor-lens audit** — reframed from IoT-flavoured "commands anything autonomous" to
   **labour**: machines you own that earn. Invented world-scale stats, no badges.
3. **The worker storyline (current)** — the labour frame made literal and concrete: one worker, your
   PC, real brand campaigns, $30/month. Status badges came back (the storyline itself carries
   EARNING NOW / SOON), and the invented world-scale numbers went away — the hero stats now state
   the offer's own terms ($30 · 1 PC · 24/7 · 100% approved).

**Design thesis, unchanged through all three:** the more futuristic it looks, the more it reads as
concept art. Astonishment comes from mundane specificity in the present tense. The video carries the
unreal; the copy carries the real.

## Numbers

**The `$30/month via PayPal` figure is the storyline's own stated offer — treat it as canonical copy.**
Every *other* figure is illustrative, stated as a rule and not a list on purpose: an earlier version of
this paragraph enumerated the illustrative numbers and went stale the first time the copy changed. If a
number appears on this page and it isn't the $30 offer, assume it is decoration.

---

## Files

```
index.html                      markup — hero + four sections + mobile menu
styles.css                      the hero: tokens, shell, header, hero, stats, menu
sections.css                    everything below the hero
logo.js                         the procedural pixel logo (ported from blueai-desktop)
main.js                         stat count-up + mobile menu
scroll.js                       scroll reveals, §2 word fill, closer video rate, live clock
assets/noise.png                160×160 tileable film grain
assets/closer-blob.mp4          closing video band — 1920×768, 1.4 MB
fonts/GeistPixel-Circle.woff2   fallback display face — SEE BELOW
COPY-AUDIT.md                   the three copy phases and why each line says what it says
EDITING.md                      ← how to change anything: text, style, image, video
```

## Page order

1. **Hero** — one full viewport over the video; headline, subhead, Get Access, four offer-term stats
2. **While you sleep** — scroll-scrubbed word fill; the overnight worker scene
3. **One worker, any machine** — four machine cards with EARNING NOW / SOON badges
4. **How it works** — the four-step apply flow (Apply / Get accepted / Deploy it / Collect)
5. **Closer** — Everyone will have one · Get Access · live clock line
6. **Video band** — the morphing blob, screen-blended into black
7. **Footer** — single bar

## Known gaps

- **Five dead `href="#"` placeholders:** the closer's Get Access, Sign in (desktop + mobile sheet),
  Privacy, and Terms. The hero's Get Access scrolls to `#contact`. There is no real application form
  behind Get Access yet.
- **The header is not sticky.** It scrolls away with the hero, so the nav's anchor links are only
  usable from the top. Making it sticky needs its own ground over the dark sections (blur, scrim, or
  a colour shift) or the white pills read as detached — a design call, deliberately not guessed at.
- **No real proof point** — no named brand, customer count, or verifiable figure beyond the offer
  itself. Still the highest-value addition available.

## Run it

Any static server rooted at `blueai/public`:

```bash
python "N:\Antigravity Main\scripts\nocache_static_server.py" 8431 --directory "N:\Antigravity Main\blueai\public"
```

Then open `http://localhost:8431/experiments/intelligence-hero/index.html`. Under blueai's
`npm run dev` (port 3000) the same path works, linked from the Screen Library's Experiments card.

Prefer the no-cache server when iterating on CSS — plain `python -m http.server` sends no cache
headers and has served frozen stylesheets through full restarts in this workspace before.

**Never open it as `file://`.** That surface sandboxes sibling files — `styles.css` and the assets
silently fail and you get an unstyled page. It has to be HTTP.

---

## Assets

**There is no logo image file.** The mark is drawn procedurally by `logo.js` — see `EDITING.md` §3. A
`logo.webp` stand-in existed early on and was deleted once the canvas replaced it; don't add one back
expecting it to be picked up.

**`fonts/GeistPixel-Circle.woff2` is not present.** The file does not exist anywhere in the
workspace. It is the *fallback* display face only — the primary display font,
`BubbledotICG-FinePos`, loads from the OnlineWebFonts CDN and is what the headline and stat glyphs
actually render in. The `@font-face` is wired, so dropping the file in is the only step needed. Until
then the fallback chain is `BubbledotICG-FinePos → (missing) → monospace`, which only matters if the
CDN is unreachable.

## Conventions worth keeping

- **The headline is solid white.** No gradient, no shimmer — the storyline mock's gradient italics are
  deliberately not reproduced; this page's design language is the dot-matrix face in plain white.
- **No cards in the hero** — one composition over the video.
- **Dot-matrix tracking is two tokens** (`--display-track` / `--display-word`), never per-element.
- **Surfaces below the hero are translucent white**, never opaque colours — they ride the shade fade.
- **Sections fade, never divide** — each section's `--from` must equal the previous section's `--to`.
- `prefers-reduced-motion: reduce` kills all animation and shows final states.

**Before editing anything, read [EDITING.md](EDITING.md)** — every knob mapped to a file and line,
plus root causes for every bug found while building this.
