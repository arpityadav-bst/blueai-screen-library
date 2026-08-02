# BlueAI Creators — onboarding concept

Pre-launch concept work for the two-sided BlueAI creator marketplace: creators get paid cash
for verified posts, brands hire many small local creators instead of one large one.

Design-only, like the rest of this repo. No backend, no real data, all figures illustrative.

## What's here

| File | What it is |
|---|---|
| `index.html` | Clickable prototype site — 8 pages across both journeys |
| `diagrams.html` | Page inventory, two swimlanes, level-1 data flow diagram |
| `onboarding-flows.md` | The spec: reasoning, decisions, economics, open questions |

## Viewing it

No build step. Either open the files directly, or serve the repo and visit
`/blueai-creators/` — `index.html` is a hash-routed single page, so every screen
has a real URL:

```bash
python3 -m http.server 8000
```

**Creator journey** — `#/creators` → `#/creators/earnings` → `#/creators/waitlist`
**Brand journey** — `#/brands` → `#/brands/map` → `#/brands/compare` → `#/brands/plan` → `#/brands/reserve`

Both journeys end at a **waitlist**, not a signup, because there is nothing to sell pre-launch.

## Worth knowing before you read the code

- Channels are **Instagram, TikTok, YouTube**. Reddit was dropped deliberately — most
  subreddits ban undisclosed promotional participation, and paid commenting risks banning
  both the creator's account and the brand's domain. The brand page says so on the page
  rather than silently omitting it.
- Every dollar figure is a **model built for screen design**, not a researched rate card.
  Assumptions are listed at the end of `onboarding-flows.md`.
- The seed market is **Austin, food & beverage**, chosen so the supply map reads as dense.
- The one real dependency is a **creator index**. Until it holds live data, the earnings
  estimate and the supply map are both illustrative. See §9 of the spec.
