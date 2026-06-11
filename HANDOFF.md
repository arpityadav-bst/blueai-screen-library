# blueAI — Developer Handoff

Design-only replica. Mock content, scripted animations, links are `#`. Goal: match the
visual + motion intent; wire to real data/destinations on integration.

## Screens

### Hero (3 directions — pick one for production; `/` is the recommended)
All three share the nav, the message ("Your AI worker for getting things done."), the
Download CTA, and the same 3 agents (Career / Creator / Finance). They differ in showcase:
- **Stage (`/`, ★ Recommended):** 2-col. Left = headline + subhead + CTA. Right = "3 Agents
  Live Now" pill → 3 selectable thumbnails → one dominant stage that auto-cycles (~8s),
  each agent a 2-scene RICH demo. Hover pauses; click a thumb to select.
- **Stage Original (`/hero/stage-original`):** centered headline/CTA on top; below, a big
  stage (cross-fades agents) + a vertical thumbnail rail. LEGACY single-scene demos.
- **3 Cards (`/hero/3-cards`):** centered headline; 3 agent cards side by side, each a
  LEGACY demo; highlight cycles.
- **Options chooser (`/hero-options`):** internal design-review page comparing the three.

### Homepage (shared body below every hero — `BaiHome`)
"What BlueAI does" intro → 5 alternating feature rows (Search · Shop · DM · Play · Catch up,
each with a real product preview PNG + a chat-quote) → Skills section + Download CTA →
**All Skills** grid (15 mock skill cards + "more on the way") → "Powered by BlueStacks AI"
closing CTA → footer.

## Agent demos (the hero centerpiece)
Each agent plays its real process; **phase-driven** (a timed `STEPS` array advances a
`phase`; framer-motion animates off it). To retime, edit each scene's `STEPS` array.
- **RICH** (Stage): Career search→pick→autofill→"Applied ✓ 24"; Creator describe→render→
  deliver; Finance ask→metrics+graph→per-position→email.
- **LEGACY** (Stage Original + 3 Cards): Career job→fill→submit→Applied; Creator trend→
  script→storyboard→views; Finance tickers→chart→BUY→portfolio value.
- Hooks: `useTypewriter` (typed strings), `useCountUp` (animated numbers).

## Tokens / theming
- `src/app/globals.css` — the `--bai-*` variable layer (source of truth) + `.bai-*` type
  classes. `src/tailwind.config.ts` maps utilities (`bg-iris`, `text-ink-heading`,
  `bg-bai-gradient`, `rounded-card/field/pill`, `font-head`, …). Light theme.
- Marketing sections use scoped stylesheets in `src/styles/` (built on the same vars).

## Integration points (what's mocked → wire on build)
- All CTAs / nav links / "See it work" / social icons → `#`. Point at real destinations.
- Homepage feature + skill content → `src/lib/home-data.ts` (mock copy/ratings/counts).
- Agent demos are scripted animations, not live agents.
- Fonts via Google Fonts `<link>` (Inter/Space Grotesk/Bricolage) — swap to self-hosted /
  real SF Pro on build if licensed (see the DS README in `design-source/`).

## Known / open
- `design-source/FIX-LATER.md` — parked Recommended-hero polish items (designer to enumerate).
- Hero motion timing is a first-pass approximation of the original GSAP — retune on review.
- Per-variant hero CSS is scoped by route; cross-hero/options links are full-page `<a>` so
  the (intentionally overlapping) class names never collide across routes.
