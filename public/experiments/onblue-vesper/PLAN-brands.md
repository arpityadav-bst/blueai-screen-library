# onBlue Agentic, the brands site — plan

Decided with Appy 2026-09-17: a standalone page in this folder that links
`onblue.css`, agents as the actor, the inventory re-planned on the homepage's
section system rather than restyled one for one, and all four pieces of machinery
rethought rather than ported.

Nothing below is built yet. This is the thing to argue with before it is.

---

## 0. The anchor

The homepage already names this page's subject in its own words. Section 7.4 is
headed **"Companies bring work to onBlue"**, eyebrow "Where the work comes from",
and the header's fourth nav link is **"For businesses"**, wearing the north-east
arrow that marks the one destination leaving that page.

So this is not a sibling site. It is the other end of a link the homepage already
draws, and the page should open on the sentence the homepage used to describe it.
That also means **one wiring change on index.html**: "For businesses" currently
goes nowhere in particular and should point here.

**The mirror, stated once.** The homepage sells owning an agent. This page sells
hiring the fleet. Every section is the same economy read from the buyer's end, and
where the homepage has a device that says something, this page uses the same
device to say the opposite half of it.

---

## 1. Page-level

| | |
|---|---|
| File | `brands.html`, this folder, beside `index.html` and `apply.html` |
| Links | `onblue.css`, `ascii-field.js`, `onblue-chrome.js`, `onblue-dev.js` |
| Theme | light, forced by the same inline script before the stylesheet parses |
| Grid | `--band-max`, the same one every section on both pages uses |

Joining the stylesheet is the whole point of the standalone choice: the grain, the
scrollbar, the card sheen, the large-surface hover family, the button ladder, the
type ladder and both themes arrive already correct and cannot drift.

**Header.** Identical chrome, identical logo (the spark at `--logo-mark`, "on" in
blue, "Blue" in ink). Three changes, all of them content:

- Nav: `Outcomes`, `The fleet`, `How it works`, then **"For creators"** carrying
  the north-east arrow, pointing back at `index.html`. The arrow marks leaving
  the page, so it moves with the destination.
- CTA: **"Post a campaign"**, small step, with the same two-state behaviour tied
  to the hero CTA by `IntersectionObserver`.
- Signed in: the CTA slot becomes the account control, the way `apply.html`'s
  header carries its logout.

**Footer.** The shared footer verbatim, with this page's destinations and the
wordmark reading `onBlue` as it does everywhere.

---

## 2. Hero

Same construction as the homepage's: two columns at `1.06fr / 0.94fr`, copy capped
at 620px on the left, the ASCII model column on the right, the asymmetric
`--hero-rise` padding, the scroll cue anchored to the first band.

**Headline** — one serif-italic blue phrase, the site's one-emphasis rule:

> Bring work to onBlue. *Agents take it from there.*

It is the homepage's own section head promoted to a headline, which is what ties
the two pages together at a glance.

**Lede** — the exact mirror of the homepage's, clause for clause:

| Homepage | Here |
|---|---|
| Individuals can own an agent, customize it, and earn from the work it does. | Businesses post a campaign, onBlue matches it to agents, and you pay only for the work it verifies. |

**CTA** — one button, the large step, label "Post a campaign", inside the
`.scramble` decode wrapper. Under it the quiet line: `Already have an account?
Sign in`.

**The right column.** Reuse `ascii-object.js` and its sweep band unchanged, with
the existing six models. It is the same workforce seen from the buyer's side, and
the rig, the fit solve and the band handoff are all already correct. *Open
question below if you want brand-specific models instead.*

---

## 3. Section inventory

Six bands. The homepage's alternating grounds and hairline joins are kept, so the
two pages stack the same way.

### 3.1 `#outcomes` — "You pay for outcomes" · eyebrow: *What it costs*

The buyer's half of `#benefits`. Two `.eco-panel` cards on the same 2-column grid,
copy capped at 30% so the artwork has room, and the same three-layer chromatic
hover.

- **Left, "Nothing to start."** Creating a campaign costs nothing upfront. Set a
  budget and a window, that is the whole commitment.
- **Right, "Nothing wasted."** Budget only moves against engagement onBlue has
  verified. Anything below the bar is not paid for.

Below them, the `.rail` card, re-aimed: on the homepage the flow runs *work → core
→ agents*. Here it runs **brief → core → verified → charged**, so the one device
that shows the mechanism shows the buyer's mechanism.

### 3.2 `#fleet` — "The agents who take your work" · eyebrow: *Who runs it*

`#agents` re-aimed from recruitment to proof of supply. Three `.agent-card`s with
their looping terminals, each showing an agent type a brand would actually hire
(creator / video / growth). The terminal log lines become campaign work rather
than personal work.

Closed with the **band note** pill, which is the page's device for a constraint:

> YouTube campaigns run today. Instagram, TikTok, X and Reddit are next.

That retires the whole `PlatformsBrand` section. It was a six-tile grid saying one
sentence, and the system already has a component for one sentence.

### 3.3 `#how-it-works` — "Brief it, run it, verify it" · eyebrow: *Three steps*

Three `.step` cards with self-demonstrating `.step-art` panels, the same nesting
rule (card white, panel down 1%, rows back to white) and the same demo policy:
nothing loops unattended, hover to run, once for four seconds on first reveal.

1. **Write the brief** — a `.pick-list` of campaign settings lighting in sequence.
2. **onBlue dispatches** — a terminal taking the brief and assigning agents.
3. **You pay for what passed** — the seven-bar chart re-aimed at verified actions,
   with the figure as spend and the green pill reading *verified*.

### 3.4 `#work` — "What the agents actually make" · eyebrow: *Sample output*

The 9:16 strip, rethought. Today it is three candidate placements switchable from
a review gear; that was scaffolding for a decision, not a design. It becomes one
band: a row of 9:16 cards on the card primitive, each playing on hover only,
nothing autoplaying. Proof beats description, and this is the only section that
shows the actual product of a campaign.

### 3.5 `#faqs` — "Questions, answered"

Native `<details>` rows on `--faq-line`, the plus-to-minus sign, the same
large-surface hover the fields and doors take. The five existing questions, nouns
moved to agents.

### 3.6 `#start` — closing

Centred, 44px spark, the typed serif phrase. The line runs through its endings
once and settles on the first, so the page at rest reads as written:

> Your next campaign *runs itself.* / *starts in two minutes.* / *pays only for
> proof.* / *needs no outreach.* / *is already staffed.*

No top hairline, so it runs straight on from the FAQs.

**What is gone and why:** `PlatformsBrand` (one sentence, now a band note),
`TrustSectionBrand` (its three claims are what `#outcomes` and step 3 already
demonstrate; a section restating them is the page telling you twice), and
`OutcomePricing` as a separate band (it is `#outcomes`).

---

## 4. Machinery, rethought

**The campaign dialog.** The access gate's construction, not a popup: a
full-viewport `<dialog>`, the ascii sweep band as the transition between levels,
the page's own step cards as the explainer level. Stages brief → setup →
catalogue, on `apply.html`'s wizard: measured floor so the card never resizes
under you, one band at submit and nowhere else, the collapsing title.

**The gate.** Two equal doors, the email door morphing into a field with a
rectangular send control, exactly as `index.html` does it. Registered and approved
are the two states after.

**The dev dock.** `onblue-dev.js` already docks bars per page. This page adds
**Account — New | Registered | Approved**, replacing the bottom-left gear.

---

## 5. Answered, 2026-09-17

1. **Hero models: reuse the existing six.** It is the same workforce seen from the
   buyer's side, and the rig, the fit solve and the band handoff are already
   correct.
2. **The logged-in surface: everything.** The brands side gets its campaign
   dashboard in this phase, not a later one. Section 6 below.
3. **Pricing: mechanism only, no figures.** "Nothing upfront, you pay only for
   engagement onBlue verifies." No rate and no minimum appears on the page.
4. **Vocabulary: onBlue is the platform, BlueAI is an agent on it.** Appy's own
   analogy: onBlue is Apple, BlueAI is the Mac. 6Labs and others run on onBlue
   too. This was never an inconsistency to sweep, it is a product hierarchy, and
   picking one word would have flattened a structure with more agents coming.

   | Layer | Word | Sentences it owns |
   |---|---|---|
   | The environment | **onBlue** | the account, programs, the marketplace, matching, verification, payouts, the terms |
   | The software an agent owner runs | **BlueAI** | install it, run it on your PC, the days it ran |

   **This page is almost entirely platform-layer**, so it says onBlue nearly
   throughout: brands bring work to onBlue, onBlue matches it, onBlue verifies it.
   BlueAI appears only where a specific agent is named.

   **One line on the creator site is now known wrong**: the access gate says
   "Install onBlue on your PC and sign in". You install BlueAI. The application's
   own step 1 was already right.

   Still open, and neither blocks: `campaign` vs `job` (this page says campaign
   throughout), and both footers saying "Terms and conditions" where everything
   else now says "Program Terms".

---

## 6. The brands dashboard

Built in this phase, on `apply.html`'s construction: one page that is two things,
switched by state rather than by route, so the ground, header and footer never
rebuild.

**The states.** New (no campaigns) → the marketing page and the gate. Registered →
the campaign dialog. Approved with campaigns running → the dashboard. The dev dock
carries **Account — New | Registered | Running**.

**The sections**, mirroring the creator dashboard section for section, because a
brand and an agent owner are looking at two ends of the same ledger:

| Creator dashboard | Brands dashboard |
|---|---|
| Welcome back. / your onBlue account | Welcome back. / your campaigns |
| Your earnings: balance, cash out, transactions | Your spend: budget remaining, add budget, the charge ledger |
| Your programs: Active / Past, the progress tile | Your campaigns: Live / Ended, budget spent against verified actions |
| How earning works: steps + payout rules | How spending works: steps + billing rules |

The progress tile inverts cleanly: where the creator's bar fills toward a goal,
the brand's fills toward budget spent, and the same green means the same thing on
both, a state reached.

**Sheets.** Two, on the same `<dialog>` shell the creator dashboard uses: **Add
budget** (the cash-out sheet run backwards) and **campaign detail** (the info
sheet: what the brief said, what counts, what it has paid for).
