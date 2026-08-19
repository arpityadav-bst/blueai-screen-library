# PLAN — the new creators website (`/creators`)

**Approved by Appy, 2026-08-19.** The robots mock (this folder) becomes the CREATOR side of the
product's web presence, replacing the creator half of `/creator-brand` — which itself is now
**FROZEN: `/creator-brand/**` (app routes + components) must not be edited at all.** Its brand side
is finalized; its creator side stays on record as-is. Everything below happens in NEW trees only:
`src/app/creators/`, `src/components/creators/`, `public/creators/`.

Decisions locked:
- **Route:** `/creators` — top-level, its own layout/shell, its own route-scoped CSS. Not a
  creator-brand sibling.
- **Canonical copy variant:** `alt-copy.html` — the "Join the first wave" one (Appy, 2026-08-19,
  reversing the earlier same-day call for `index.html`). Everything the port builds from is this
  file: its copy ("an AI worker you own", "You get it hired."), its webp couch image, and its
  richer task lifecycle (brand hands task → sent for YOUR approval → approved → working → Done →
  Paid). `index.html` stays on record, unused. Note ported faithfully and left for the Phase 2
  audit: alt-copy's own closer button still says "Apply Now" while its hero says "Join the first
  wave" — an inconsistency in the source, not the port.
- **Reuse = COPY, never import across:** flow logic (journey state, validation spec, form
  machinery) and the now.gg SignInDialog are copied into the new site's tree and adapted there.
  Importing from `creator-brand/` would couple the frozen site to the new one — the exact thing the
  freeze exists to prevent.

## Phase 0 — Explode & port (foundation)
Extract the mock's embedded base64 images to real files (`public/creators/`), split its CSS/JS out,
port the page into `src/app/creators/` as React: own `layout.tsx` (dark shell), sections as
components, route-scoped stylesheet (precedent: the hero variants' scoped CSS), inline script ported
to effects (precedent: `boot.js` → `PixelRain.tsx`). **Pixel-faithful, zero redesign.**
Gate: tsc + build clean; Appy eyeballs `/creators` against `/experiments/robots/index.html`.

## Phase 1 — Header
Robots-theme header: creator-brand's logo art + wordmark lockup (assets copied), nav tabs from the
homepage's real sections (anchor scroll), CTA slot designed for three states up front (Apply Now /
account chip + logout). Mobile hamburger re-skinned from the MobileMenu recipe.

## Phase 2 — Multi-agent visual UX audit + fixes (desktop AND mobile)
Workflow A (audit): parallel agents, one per dimension, SOURCE-ONLY analysis (CSS values, markup,
numerically computed contrast — no screenshots; nobody here verifies visually, Appy does):
spacing/rhythm · type hierarchy/line-height/sizes · color+contrast · buttons/hover/states · icon
consistency · section division/layout grid · anti-AI-slop · mobile (breakpoints, tap targets,
overflow). NO accessibility work (explicitly out of scope, Appy).
Findings merged + severity-ranked → **Appy approves the list** → Workflow B (fix): parallel agents
apply approved items, batched by file ownership. Machine gates + Appy's visual pass close the phase.

## Phase 3 — Creator flow, re-themed
Theme kit FIRST (dark-language button/field/card/modal/checkbox primitives, built once), then
parallel agents build surfaces consuming it: signed-in home top (application swap), the 5-step
application + milestones + confirmation, FullCapacityNotice, Dashboard (StatCards / Transactions /
HowEarningWorks / CashOutModal), logout in the header, PreviewToggler (dev chrome, visually
distinct). SignInDialog reused UNCHANGED (copied). Copy/content pulled from creator-brand's creator
side; monthly model facts ($30/month, 20 days) stay consistent with its mockData.

## Phase 4 — Index & ship
Screen Library card flips from the raw mock to `/creators`. Session log, push (ask first), deploy
confirmed via API status only.

**Appy reviews at the end of every phase.** Machine gates (tsc, build) run per phase; visual
verification is his, never ours.
