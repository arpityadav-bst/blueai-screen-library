# blueAI — Evolution
Last updated: 2026-06-11 (S2 — Phase 2 entered; recurring category named)

> VDA's growth + maturity timeline ON THE BLUEAI PROJECT. Separate from WSUP/now.gg —
> a fresh notebook starts at Phase 1.

## Phase 1 — Bootstrapping (current, entered 2026-06-10)
Session 1: notebook created; taste **seeded from the designer-authored blueai-modern DS
README** (a real spec, not live-site inference — a stronger Phase-1 start than now.gg had).
Full marketing site built in one session: foundation + homepage + 3 hero directions
(1 rich + 2 legacy) + options chooser + style-guide. Production build green.

**Phase 1 markers (all met → Phase 2):**
- [x] Site built and ready for designer review (homepage + 3 heroes + options + style-guide)
- [x] First designer correction cycle logged + promoted (S1 → taste rule 11; S2 build-session
      ~20 corrections + prod fixes → taste rules 14–18 + KB + 6 decisions)
- [x] Recurring correction category identified → see Phase 2

## Phase 2 — Confirmed-correction era (entered 2026-06-11, S2)
S2 met all three Phase-2 maturity markers:
- [x] 1+ designer review cycle with corrections logged + promoted (this audit promoted the
      2026-06-10 build session + the S2 prod text-align catch)
- [x] taste.md rules confirmed/OVERRIDDEN by real review (rule 14 = designer corrected
      `balance`→`pretty` for body — a DS-seed override, not just a seed)
- [x] A recurring correction category named (below)

**Recurring correction category: prod-vs-dev fidelity from shared generic CSS class names.**
The hero variant stylesheets reuse `.hero`/`.pane-title`/`.hero-screen`; production chunking
leaks one variant's rule onto another's route (text-align caught on Vercel; `.hero` padding still
latent). Will keep biting until the stylesheets are scoped under unique roots.

**Active gaps / watch for next session:**
- ✅ RESOLVED (S2): scoped the 3 hero stylesheets under `.v-stage`/`.v-cards`/`.v-original` — the
  recurring CSS-leak category is now structurally closed (built bundle has zero unscoped generic
  hero rules; verified live). Watch for the same generic-class trap if a 4th variant or a new
  shared-name stylesheet is added — scope it from the start.
- Hero motion timing is a first-pass approximation of the original GSAP — retune on review.

**Count history:** S1 = N/A (build session). **S2 = `designer_caught_count: 1`** (the Stage hero
prod/dev text-align mismatch, caught on Vercel — a prod-only CSS-chunking bug dev didn't show).
