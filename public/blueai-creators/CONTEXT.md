# Blue AI Creators — full working context

**Purpose of this file:** everything a fresh session needs to pick this up cold. Written
2026-08-03 at the end of a working session on a MacBook; the work is being moved to a PC.

**If you are an AI assistant reading this at the start of a new session:** read this file
top to bottom before touching anything. Sections 9 and 10 are the current state and the
open items — start there if you only read two.

---

## 1. What the product is

A **two-sided marketplace** for influencer marketing, run by AI agents instead of an
agency team.

- **Creators** — ordinary people with small followings (1,000–20,000, sometimes fewer) —
  get paid **cash** for posts a brand's campaign verified actually went live.
- **Brands** hire **many small local creators** instead of one large influencer.
- **Blue AI** sits in the middle and does the work an agency does by hand: finding
  creators, matching them to campaigns, writing briefs, checking the post really ran,
  paying everyone, reporting.

The company is BlueStacks (`bluestacks.ai`). The product name in copy is **Blue AI**.

**Stage: pre-launch.** No backend, no live campaigns, no customers, no case studies.
Everything built so far is design-only. Both user journeys therefore end at a **waitlist**,
not a signup — there is nothing to sell yet, and faking traction would lose exactly the
audience we want.

---

## 2. Why now — the market thesis

From a WSJ / CMO Today piece the PM shared ("The Latest Darlings of Social-Media Marketing?
Regular People With 500 Followers", Katie Deighton, 27 July 2026). The core argument:

**The "post-follower era."** Social algorithms now surface mostly content from accounts you
don't follow. So a large following no longer guarantees an ad gets seen, while a
500-follower creator's post can go viral if it resonates. Brands are responding by spreading
creator budgets across many small creators instead of concentrating on a few big ones.

**The spend shift (Emarketer, via WSJ):**

| Segment | 2021 | 2026 |
|---|---|---|
| Under 20,000 followers | 19.5% | ~45% of US influencer spend |
| Nano — under 5,000 | 3.1% | 19.9% |

US creators will earn roughly **$21B** this year.

**Who is already doing it:** Target (Club Target — 15,000 members, gamified tiers, weekly
challenges), Little Spoon ("Spoon Squad"), SoulCycle, American Eagle. Entry bars as low as
500 followers.

**Where those programmes are weak — this is our wedge:**

- Payment is mostly **gift cards, discounts and free product**. The WSJ profiles Reid
  Mottet, a Louisiana mother who earned a **$10 Target gift card** and is working toward
  a $15 one. This single detail is the most useful thing in the article — it is the
  contrast our creator pitch is built on.
- Programmes are **per-brand silos**. A creator joins Club Target, Spoon Squad and
  Amazon's affiliate programme separately.
- Climbing the tiers is slow and effortful: *"I can't just go out every day and shop for a
  new product at Target."*

**The psychology argument** (the PM's own framing, and it's correct): when a famous person
endorses a product, the audience assumes they were paid a lot and discounts it. When someone
who looks like a peer shows the product, it reads as real. That perceived authenticity is
the actual thing brands are buying.

Also useful, from Isha Patel (co-founder of Kale), quoted in the same piece:
*"You can spend a quarter or two quarters of a million hiring an agency and a film crew to
get that perfectly polished, scripted video, and audiences will just swipe right past it."*

---

## 3. The competitive set

Two reference products the PM shared. Know both — the design borrows from one and the
proof-point strategy from the other.

### Kale — getkale.com (Palette Technologies, Inc.)

Mid-market, demo-gated, TikTok + Instagram. Positioning: **"Reward customers, not
influencers."** Creators must have actually bought the product.

- **Brands** get: Sales / Scale / Social framing, "activate hundreds of real customers
  instead of one big influencer", +225% tagged videos, $45k saved, **73% lower CAC**,
  120 hours saved, **UGC converts 1.6× better**.
- **Creators** use a mobile app with two modes:
  - **Create** — pick a brand, claim a *challenge* (e.g. Starburst: "show us your most
    creative take on repurposing the wrappers"), with example content and inspiration.
  - **Play** — join *tournaments* with countdowns, prize pools and live rankings.
- **Creator payout is points → coins → merch and gift cards.** $500 Disney gift card =
  50,000 coins; Kale hat = 4,300; 2 Coachella tickets = 250,000. **Not cash.**
- Clever mechanic worth stealing: a **graded ladder of micro-actions**, each worth points —
  post to feed (1,300), submit a receipt (1,200), share a story (900), snap a photo (650),
  reshare, vote in polls. Very low activation energy for a small creator.
- Brand owns content rights from day one.
- Case study: OLIPOP, challenge to buy a new flavour at Whole Foods → tagged TikToks +40%,
  beat Q1 revenue goals by +50%.

### Duel — duel.tech

Enterprise, demo-gated, "Brand Advocacy" rather than influencer marketing. Clients include
Estée Lauder, Charlotte Tilbury, Victoria's Secret, Abercrombie & Fitch, Lush, Spanx,
Unilever, SoulCycle.

- Sells on **hard ROI**: Charlotte Tilbury 10× ROI; Monica Vinader 16,608 advocates and
  **19× ROAS**; Beekman 1802's Kindness Krew drove **45% of total brand EMV**, 33,000 posts,
  60M+ reach, $92k affiliate revenue in six months.
- Brands run their own programme; advocates apply and **can be rejected** (Beekman required
  1,000+ followers on TikTok or Instagram).
- Gamified advocate portal: tiers, points, tasks (photo uploads, reviews, referral codes).
- **"One person managing 15,000 advocates on one platform"** — their AI automates ~90% of
  manual work. Our claim is the next step: the loop runs without the one person.
- Brand owns all UGC, instantly.
- They own the category narrative — they publish "The State of Brand Advocacy 2026"
  ("Persuasion is losing. Participation is compounding.").

### How we differ

| | Duel | Kale | **Blue AI** |
|---|---|---|---|
| Creator gets paid in | points → perks + commission | points → coins → merch | **cash** |
| Pricing unit | platform fee + commission | dynamic on quality | **brand bids per 1k views / post / action** |
| Creator entry | apply, can be rejected | open, purchase-first | **open, no purchase required** |
| Channels | IG, TikTok | TikTok, IG | **IG, TikTok, YouTube** |
| Content rights | brand owns outright | brand owns day one | **three priced tiers, creator keeps ownership at Tier 1** |
| Sold via | demo | demo | **self-serve** |

---

## 4. What the PM built, and what was wrong with it

The PM produced two landing pages, well designed, correct positioning:

- **Creator page** (`bluestacks.ai` CREATORS) — "AI agents take your money. Blue AI makes
  you money." Hero, three benefit cards, a REACH section with Reddit/YouTube/Instagram
  channel cards, a trust section, and an **"Estimate your earnings"** modal.
- **Brand page** (INFLUENCERS) — "Hire influencers to promote your brand." Same structure
  mirrored, with a **"Start your campaign"** modal.

**The problem is the conversion mechanism, not the design.**

- The creator page's payoff opens an **8-field form** (channels, country, niche, cadence,
  followers, avg views per reel, subscribers, avg views per video) *before showing any
  value*. We were asking a 3,000-follower creator to do data entry for a number they had
  no reason to trust.
- The brand page's payoff opens an even bigger form — brand, message, goal, links, bid
  unit, bid, budget, dates — *before the brand has seen a single creator*.

Neither competitor does this. Kale never asks a creator to type their follower count.
Duel never asks a brand to write a brief before showing them dashboards full of revenue.

**The fix, both sides: payoff first, form later. One question per screen. Let the AI do
the data entry.** That inversion is also what makes the AI claim real rather than
decorative — the agents start working *during* onboarding, not after signup.

---

## 5. Design principles we settled on

1. **One question per screen.** Never a form where a single field will do.
2. **Show the number before asking for the email.**
3. **AI fills in what it can infer.** Handle → followers, median views, niche, metro.
   Product URL → category, price, retail, audience.
4. **Commitment ladder** — each step smaller than the last. Payout details are only
   requested once money is already pending.
5. **Kill the specific objection on the screen where it occurs.** Creator: *"I'm too
   small."* Brand: *"unknown people can't beat one big name."*

**The pre-launch constraint turned out to help.** With no case studies, the flows lean on
three things we genuinely have: public data (a real handle really can be read), published
third-party evidence (Emarketer/WSJ, Kale, Duel), and honest scarcity (a queue). Queue
position became the engine — creators move up by connecting channels, completing their
profile and inviting local creators, which pre-collects our matching data *and* builds the
metro density that solves cold start.

---

## 6. What was built

Three deliverables, all in this folder.

### `index.html` — the clickable prototype

Self-contained, no dependencies, hash-routed so every screen has a real URL. Light and dark
themes. Eight pages:

**Creator journey**

| URL | Job | Captures |
|---|---|---|
| `#/creators` | Convince, then ask for **one field** | Handle only |
| `#/creators/earnings` | Show a believable number **before signup** | **Nothing** |
| `#/creators/waitlist` | Turn a queue into **useful work** | Email, channel, niche answers, referrals |

**Brand journey**

| URL | Job | Captures |
|---|---|---|
| `#/brands` | State the trade, ask for **two fields** | Product URL, city |
| `#/brands/map` | Prove **supply exists** near them | Which filters they used |
| `#/brands/compare` | Win the argument vs **one big name** | **Nothing** |
| `#/brands/plan` | Let them **price it themselves** | Budget, bid unit, follower floor |
| `#/brands/reserve` | Convert to a **pilot**, not a purchase | Email, company, campaign spec |

**Two of the eight pages capture nothing at all.** That is deliberate and it is the single
best sentence to open a walkthrough with.

Things that actually work when clicked:

- Typing a handle routes to a computed estimate. Three example accounts:
  `@sarahmakesdinner` (3.2k → $141–235/mo), `@caseycooks` (12.4k YouTube → $245–408),
  `@austin.thrifts` (890 followers → **drops to the Coach branch**, paid posts locked,
  micro-actions still paying).
- Waitlist priority actions move queue position from #412 upward.
- The supply map is a canvas: 412 creators across eight Austin neighbourhoods, filterable
  by niche and platform, with live-recomputing stat tiles.
- The budget slider drives creators / posts / views / CPM and the payout-vs-fee split, and
  carries through to the reservation summary.

### `diagrams.html` — how to explain it

Page inventory table, two swimlane diagrams (creator → waitlist, brand → reservation, with
each page's URL printed above the columns it covers), and a **level-1 data flow diagram**
showing what data moves and where it rests. Hand-rendered SVG from a node/edge data
structure, no libraries.

### `onboarding-flows.md` — the spec

The reasoning, all decisions, segmentation schema, agent architecture, economics, funnel
targets, and open questions. Contains mermaid flowcharts.

---

## 7. The nine decisions — locked

These were all answered by the user (Arpit) and should be treated as settled unless
he reopens them. Full reasoning is in §6 of `onboarding-flows.md`.

1. **Take rate — 20%, charged to the brand**, on top of the creator's payout. Never
   deducted from the creator. This buys a sentence no competitor can say: *creators keep
   100% of their quoted payout.*
2. **Fraud — Blue AI absorbs the brand's risk, the creator carries their own.** Verifier
   reads metrics at 24h / 72h / 7d and we pay on the **72-hour reading, not the peak** —
   that delay is the clawback buffer. Detection on view velocity, engagement ratio, comment
   authenticity, follower spikes, audience-geo mismatch. Three consequences: flag-and-hold
   (48h to respond) → partial payout on organically attributable views → removal and
   forfeiture. **The brand is never invoiced for an outcome we couldn't verify.**
3. **Follower floor — open platform, per-campaign floor set by the brand.** Default 1,000
   for paid posts, **zero for micro-actions**.
4. **Purchase — not required, per-campaign toggle.** Brand can tick "requires proof of
   purchase"; receipt upload becomes a verified outcome at a premium.
5. **Content rights — three priced tiers.** Tier 1 (included): reshare on owned channels,
   creator keeps ownership. Tier 2 (+40%): 12-month paid-media licence. Tier 3 (~+150%):
   full buyout. Creator always keeps the post on their own feed.
6. **Cold start — supply first, one metro, one category: Austin, food & beverage.** Not
   LA: 500 creators look *dense* in Austin and empty in LA, and the map is our strongest
   brand-side screen. Target: 500 connected creators within 25 miles, 10 founding brands.
7. **Payment — Stripe Connect Express.** Payout available immediately on 72h verification,
   withdraw any time over **$10**, ACH free / instant debit 1.5% / PayPal. W-9 at $600
   cumulative, 1099-NEC. Before claiming any job a creator sees three numbers: *you earn
   $X · verified by DATE · paid by DATE.*
8. **Reddit — dropped from the launch set.** Most subreddits ban undisclosed promotional
   participation, and paid commenting can get both the creator's account and the brand's
   domain banned. The brand page states this on the page rather than omitting it silently.
9. **TikTok — in, and arguably should lead.** Launch channels: **Instagram, TikTok,
   YouTube.**

---

## 8. Economics — illustrative model

**These are models built so the screens have believable numbers. They are NOT researched
market rates and must not go in front of a customer without validation.**

Creator payout, US, with 20% platform fee charged to the brand on top:

| Outcome | Creator earns | Brand pays |
|---|---|---|
| Instagram reel | $12.00 / 1,000 verified views | $14.40 |
| TikTok video | $8.00 / 1,000 verified views | $9.60 |
| YouTube integration | $18.00 / 1,000 verified views | $21.60 |
| YouTube Short | $7.00 / 1,000 verified views | $8.40 |
| Instagram story reshare | $5.00 flat | $6.00 |
| Comment on brand content | $1.50 flat | $1.80 |
| Receipt / proof of purchase | $3.00 flat | $3.60 |

**Worked creator example** — 3,200 IG followers / 4,800 median reel views, 1,800 TikTok /
3,100 median views, food niche, Austin: 2 reels ($115.20) + 2 TikToks ($49.60) + 4 stories
($20) + 1 receipt ($3) = **~$188/month, ~$2,256/year**. Only 2 of ~6 monthly posts are
sponsored — we deliberately don't saturate the feed, and that restraint is itself a selling
point to brands.

**Worked brand example** — $10,000, Austin, beverage, in-store trial, blended brand rate
~$13/1k → ~770,000 verified views, ~$13 CPM, ~130 creators, ~190 posts, ~190 owned assets.

**The comparison that closes the brand argument** (macro option modeled *generously* on
purpose — a sceptical buyer will attack a rigged comparison):

| | 1 macro creator, 250k followers | Blue AI fleet |
|---|---|---|
| What $10,000 buys | 2 posts at $4,000 + $2,000 production | ~130 creators, ~190 posts |
| Verified views | ~110,000 | ~770,000 |
| Effective CPM | ~$91 | ~$13 |
| **Views inside the target metro** | **~4,400** (4% of followers are local) | **~770,000 — 175×** |
| Distinct voices | 2 | ~190 |
| If it flops | budget already spent | unspent budget returns |

The in-metro row is the one that closes. A national macro creator sells 96% of their reach
to people who cannot walk into the store.

**Assumptions:** macro = 250k followers, 22% view-through, $4,000/post, ~4% of followers in
any one metro. Fleet = 4,000 median views/post, ~1.5 posts/creator, blended $13/1k brand
rate. Third-party figures (Emarketer/WSJ, Kale, Duel) are published claims, not
independently verified.

---

## 9. Current state — READ THIS

**Live in the repo, on the PC, pushed. Parked as an experiment.**

- Repo: `arpityadav-bst/blueai-screen-library`
- Branch: `main` (this repo's convention is **direct-to-main**, no feature branches or PRs)
- Location: **`public/blueai-creators/`** — served at `/blueai-creators` (a rewrite in
  `next.config.js` maps that clean URL onto `index.html`, matching how `/blueai-desktop`
  and `/blueai-product` are served). `diagrams.html` and the two `.md` files sit beside it
  at `/blueai-creators/diagrams.html` etc.
- Indexed on the **root Screen Library** (`src/app/page.tsx`) under **Dormant**, as two
  cards: the prototype and the diagrams page.

**UPDATE 2026-08-03 (same day, later):** the full **website draft 1 now exists at `site/`** —
18 pages, two zones, built from the approved `site-ia.html` with all six of its §11
recommendations accepted, PLUS the PM-requested change: **the brand supply map is replaced by
a ranked creator list** (`site/brands/creators.html`). Design direction "The Payout" is locked
in `site/DESIGN.md` (read it before touching any screen — it carries the anti-AI-slop ban
list). Assets are Higgsfield-generated tactile props, matted with `video-creator/matte_u2net.py`,
graded by `site/assets/tools/grade.py`; job ids in `site/assets/higgsfield/JOB-RECORD.md`.
Fonts: Cabinet Grotesk + General Sans (Fontshare FFL) + IBM Plex Mono, self-hosted. Motion:
GSAP 3.15 + ScrollTrigger vendored in `site/shared/`. The 8-page hash prototype stays beside
it untouched as the flow reference.

**Status: PARKED / experimental** (designer's call, 2026-08-03). This surface is in the same
class as `/blueai-product` and the dormant marketing pages — it is **not** governed by VDA,
not reviewed against either BlueAI design system, and touching it must not touch
`blueai-desktop` (the one active surface) or its DS. It carries its own self-contained
tokens; that is deliberate, not drift.

**Historical note, resolved.** This work was first built on a MacBook and committed there as
`74379cf`, but never reached `origin` — that machine's global `~/.gitconfig` carried a stale
URL-specific credential helper pointing at a `gh` binary in a deleted temp directory, which
beat the system keychain helper and failed every push. That commit does not exist in the PC
clone and never will; the files were hand-carried across and committed fresh here. Nothing
was lost. The Mac's config still needs unsetting if it is ever used for this repo again.

---

## 10. What's open

Three items. Only the first blocks anything.

1. **Buy, scrape, or hand-seed the creator index?** — **the blocker.** Two processes read
   it: resolving a pasted handle, and returning local supply for the map. Until it holds
   real Austin data, the earnings estimate and the supply map are both illustrative — and
   those are the two strongest pages we have. Everything else in the system is a form, a
   model and a table. Hand-seeding one metro is the cheapest way to make both real.
2. **Founding-brand discount** — free first campaign, or fee waived and media paid?
   Affects how qualified the reservations are. The reserve page currently says only
   "$0 charged today."
3. **Launch window on the waitlist screen.** A queue with no date decays. The prototype
   deliberately shows a position and a target ("first 500 connected creators in Austin")
   rather than a date, so this can be answered late.

**Already resolved, don't reopen:** the creator estimate is shown as a **range**, not a
single number — a pre-launch product can't afford to overstate a figure the creator will
later check against reality.

### Sensible next steps

- Validate the rate card against real nano-creator pricing. Every number above is modeled.
- Decide the creator-index question, then make the Austin map real.
- The pages still have **no proof numbers** — unavoidable pre-launch, but the moment there
  is a single pilot campaign, that becomes the highest-value addition to both pages.

---

## 11. Conventions and gotchas

- **This repo is design-only.** No real backend anywhere in it. Don't build one without
  being asked.
- **Direct to main.** No feature branches, no PRs. Commits go straight to `main` once the
  user has confirmed a batch.
- **The user verifies UI changes himself** in the browser — don't re-verify in a browser
  and don't ask him to confirm what he can already see.
- **Naming is kebab-case** — `blueai-desktop`, `blueai-product`, `live-demo-v2`, and now
  `blueai-creators`. The user originally said "blueAI ai creators"; it was named
  `blueai-creators` because spaces break the served URL and the repo is consistent.
  Rename if he prefers.
- **Don't fabricate content, data or traction.** There's an established discipline in this
  repo of treating empty states as legitimate rather than filling them with invented
  filler. It applies doubly here — the entire creator pitch depends on not overpromising.
- Everything is plain HTML/CSS/JS with **no build step**. `python3 -m http.server` and open
  the file.
- `index.html` and `diagrams.html` are fully self-contained — no CDN, no external fonts, no
  network calls. Keep them that way; they need to open from a file:// path.
