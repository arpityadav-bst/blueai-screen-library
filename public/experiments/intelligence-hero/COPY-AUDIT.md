# Copy audit — the investor lens

> **STATUS: applied 2026-08-17.** Every verdict below is live in `index.html`, with two exceptions,
> both recorded at the bottom under **Not applied**: the §2→economics reorder (it breaks the copy —
> reasoning there) and the named-proof line (needs a real customer; inventing one would be fabricating
> a record). Kept as the rationale for the current copy — read it before rewriting any line.

**Question asked:** would a billionaire who invests in future AI like what's written here? Is it
impactful? Can it be simpler and still stronger?

**Reader model.** Someone who sees fifty AI pitches a month. Consequences:

- **Immune to adjectives and category nouns.** "Platform", "layer", "solution", "seamless",
  "powerful", "autonomous" are invisible — read past, not read.
- **Reads three things:** the headline, the numbers, and the last line. The middle is skimmed.
- **Wants a wedge and an endgame.** One thing you do that nobody else does, and the enormous thing it
  becomes. Six things done equally reads as *unfocused*, not *ambitious*.
- **Buys inevitability, not aspiration.** "We will" is worthless; "this is already happening" is
  everything.
- **Reads numbers for revenue implication.** A spec is decoration; throughput is a business.

---

## The one structural finding

**The page sells a capability. Investors buy a category.**

Right now BlueAI is described as *"a layer that commands anything autonomous."* That is an **IoT
framing** — a graveyard category that has been pitched for fifteen years. Every reader over forty has
seen it fail.

The same product described as **labour** is a different company:

> BlueAI turns things you already own into workers that earn.

That reframe does three things the current copy doesn't:

1. **It unifies the two halves of the brief.** A worker does your chores *and* earns for you. Right
   now "money" and "life easier" sit in separate sections, competing.
2. **It lands in the frame the market is actually paying for in 2026** — AI labour, not connected
   devices.
3. **It implies a market the reader sizes themselves.** Nobody needs to be told how big labour is.

**Appy's own first instinct was closer to right than the line I steered toward.** "AI workers grind
while you rest and make you money" is the labour frame. I argued it narrowed the vision to a business
tool, and for a *consumer* audience that's true. For the audience actually being asked about here it's
the stronger frame, and "Anything Autonomous" is the weaker one. Correcting that.

---

## Verdicts

`KEEP` = don't touch · `SHARPEN` = right idea, weak words · `REPLACE` = wrong idea · `CUT` = delete

### Hero

| Item | Current | Verdict |
|---|---|---|
| H1 | Anything Autonomous / Now Answers To You | **REPLACE** |
| Subhead | BlueAI commands anything connected and autonomous — digital or physical. It runs your campaigns, your car, your kitchen, your business. | **SHARPEN** |
| CTA | Get Access | KEEP |
| Nav | Home / What It Runs / How It Works / Contact | KEEP |
| Tab title | BlueAI — Anything Autonomous Now Answers To You | SHARPEN |

**H1.** "Autonomous" is the problem word — a decade-old category label, and the reader's eye slides
off it. "Answers to you" describes a *relationship*, not an *outcome*. The line is structurally good
(two balanced ~19-char lines) but semantically soft.

Replacements, strongest first:

```
You Own Machines.        ← the labour reframe, stated as economics
Now They Earn.

Tell It Once.            ← present tense, persistence, no category words;
It Never Stops.            pairs with §2's "You told it once, and it remembered"

Your Machines            ← plainest version of the same idea
Have Staff Now.
```

**"You Own Machines. / Now They Earn."** is the recommendation. It is an economic claim, it needs no
adjective, and an investor finishes the second line already calculating.

**Subhead.** Two abstractions ("connected and autonomous", "digital or physical") arrive before any
concrete noun. The concrete list is the strong half — lead with it:

> Your campaigns, your car, your kitchen, your storefront. One instruction each. Then it keeps
> working without you.

Drops "commands", "connected", "autonomous", "digital or physical" — four category words for none.

**Tab title.** Truncates around 40 characters in a tab. `BlueAI — It Already Runs More Than You Think`
survives the cut better.

### Stats — the weakest area on the page

| Current | Verdict | Why |
|---|---|---|
| `~` 41,920 **Coffees brewed** | **CUT** | Cute, and it's the *first* number the reader meets. Signals gadget company, not labour platform. This single metric does more damage than any sentence on the page. |
| `>` 2.1M **Miles driven** | **REPLACE** | Vanity. No revenue implication. |
| `#` 18,400 **Campaigns run** | SHARPEN | Volume is fine; "Jobs completed" generalises past social media. |
| `+` $840K **Paid to creators** | **KEEP — but move it first** | The only metric an investor cares about, currently last. |

Every number should imply economic throughput or labour hours. Proposed set:

```
$   $840K      Paid out
::  1.2M       Hours worked        ← the killer metric; reframes the whole page as a workforce
#   18,400     Jobs completed
%   94%        Verified first try  ← quality/trust, and it's the hard engineering problem
```

**"Hours worked" is the single highest-value addition available.** It says *this is a workforce* in
two words, and it's the number that makes the labour framing literal rather than metaphorical.

Ordering rule: money first, scale second, quality third. The reader stops after two.

### §2 The morning — **REPLACED** (revised verdict, 2026-08-17)

This section first passed as *"the best writing on the page"* — true as prose, wrong for this reader.
On a second pass against the investor lens it was the page's **weakest** section, and it was rewritten.
Recording both verdicts, because the reason the first one was wrong is the useful part.

**Why the original failed.** It was: *alarm waits for your sleep cycle → curtains open → coffee starts
→ car cools → it's already driving.*

1. **The most commoditized story in tech.** Alarm → curtains → coffee → car has been the demo reel for
   Nest, Alexa, Google Home, HomeKit and SmartThings since roughly 2014. The target reader has seen
   this exact vignette in dozens of decks. It reads *"fifth company to promise this,"* not
   *"out of this world."*
2. **It undersold the hard thing.** The investable difficulty is cross-domain agentic execution with
   verification — one instruction, many unrelated systems, checked results. A morning routine makes
   that sound like scheduling; a technical reader decodes it as *"IFTTT with a nicer voice."*
3. **A scenario, not a claim.** It told the reader how to feel, not what the company is or why it wins.
4. **No money**, in the section given the most scroll real estate on the page.

**The diagnosis worth keeping:** the section was built for the CEO's brief — the *Her* feeling, a
consumer reader — and then judged against an investor. Two different people. It wasn't badly made; it
was aimed at the wrong one. The *form* was right and was kept: specific, present tense, mundane, no
adjectives.

**Shipped version** — same length and rhythm, but a scenario only BlueAI could run:

> **6:41 AM**
>
> You are asleep. Somewhere it's afternoon, and a brand's campaign clears its last verification. Your
> three cars finish charging and take their first fares. Your storefront reprices forty items against a
> competitor who moved overnight. You wake at 7:02. Nothing needed you.
>
> *One instruction each. Given weeks ago.*

Three unrelated systems, running simultaneously, unsupervised, with money moving — the claim no
smart-home company can make. "Nothing needed you" is the leverage line. The foot deliberately echoes
the hero subhead's *"One instruction each."*

**Also fixed:** unlit scrub words were `rgba(255,255,255,.14)`, close to illegible — anyone landing
mid-section before the scrub caught up saw a wall of near-invisible text. Now `.24`.

### §3 What it runs — the biggest problem

| Item | Current | Verdict |
|---|---|---|
| Label | The scope | KEEP |
| H2 | **It isn't one product.** | **REPLACE** |
| Sub | Anything with an interface and a purpose. BlueAI is the layer between what you want and the machine that does it — a phone, a fleet, a kitchen, a body. | SHARPEN |

**Two faults, both serious.**

1. **It opens with a negation.** Never define yourself by what you are not. The reader's first
   impression of your scope section is an absence.
2. **Six equal cards read as unfocused.** This is the failure mode the audience is *trained* to spot.
   Six verticals with equal weight says "will die trying to do all of this."

The fix inverts it — **one capability, six consequences.** Same six cards, opposite meaning:

> **We only built one thing.**
>
> An agent that can be told what to do, and then does it — in the real world, without supervision.
> These are just the places it has been pointed so far.

That reads as focused engineering *plus* unlimited surface. Focus that implies scale is exactly what
the reader is looking for, and it costs one headline and one paragraph.

Alternatives: `One Skill. Every Machine.` · `It Learned One Thing. It Applies Everywhere.`

**Also:** *Creators & Brands* is the only live domain and it sits as one of six equals. That's your
traction, presented as a footnote. Give it ordinal or visual privilege.

**Card copy** is mostly strong — concrete, no adjective padding.

- Robotics — *"Give it the intent; it works out every step itself."* **KEEP**, best card.
- Home — *"It reads your calendar, so it acts before you think to ask."* **KEEP**.
- Companions — *"inside something that walks."* **KEEP**, genuinely unsettling in the right way.
- Mobility — *"a robotaxi you own and never once drive."* **KEEP**.
- Creators & Brands — accurate and specific. **KEEP**.
- Commerce — *"while the market moves without you"* is limp. **SHARPEN** → *"…through the night, in
  a market that doesn't wait for your morning."*

### §4 How it works — **KEEP, essentially untouched**

The strongest section on the page.

- **"Three steps. Then never again."** — best headline on the page. A promise, short, implies
  permanence.
- *"If it can be reached over the internet, it can be reached by BlueAI."* — sounds falsifiable, which
  is why it's persuasive.
- *"No flowcharts, no rule builders, no dashboards to maintain."* — reads as competitive positioning
  against Zapier/n8n, and the audience will decode it as such immediately.
- *"You get the outcome, not the task list."* — the thesis of agentic AI in eight words.

### §5 While you rest, it earns

| Item | Verdict |
|---|---|
| H2 — While you rest, it earns. | KEEP |
| Sub — …on the hours you were never awake for. | SHARPEN — *"in the hours you'd have slept through."* Cleaner, and "slept through" is concrete. |
| While you sleep / commute / offline | KEEP — good device |
| "hands you the ledger in the morning" | KEEP — best line in the section |
| "The shop doesn't close because you went to sleep." | KEEP |

**The fault: a section titled "The economics" contains zero numbers.** For this reader that is the
letdown of the page — they arrive at the part addressed to them and find prose. One figure per panel,
even illustrative, changes the register entirely:

```
While you sleep      →  $2,400 average campaign payout
While you commute    →  $310/day per vehicle, net of charge and clean
While you're offline →  18% lift in overnight conversion
```

### §6 Closer

| Item | Verdict |
|---|---|
| **"It's already awake."** | **KEEP** — joint-best line on the page. Present tense, faintly eerie, exactly on brief. |
| "Give BlueAI one thing to run. Then give it everything." | **KEEP** — it's a land-and-expand motion in human language, and the reader will recognise the growth model instantly. |
| Foot — "BlueAI — anything connected, anything autonomous" | **CUT** — repeats the H1's two weakest words as the last thing on the page. End on the CTA. |

---

## What is missing entirely

Two absences matter more than any wording fix.

**1. No claim of scale.** Nothing anywhere makes the market obvious. The reader needs one line that
sizes it without a chart — e.g. *"By 2030 there will be more autonomous machines than people with
jobs. None of them have a manager."* One sentence, and the TAM argues itself.

**2. No proof.** No named customer, no partner, no verifiable figure. The four counters are the only
evidence and they're unsourced. For this audience, one real name outweighs all four numbers — and if
there isn't one yet, a specific *pilot* ("running on N creator accounts since March") beats a round
number.

---

## If only five things change

1. **H1** → `You Own Machines. / Now They Earn.` — the labour reframe.
2. **Cut "Coffees brewed."** Add **"Hours worked."** Put **"$840K Paid out"** first.
3. **§3 headline** → `We only built one thing.` — turns six scattered verticals into one capability
   with six proofs.
4. **Put numbers in "The economics."** A section addressed to investors with no figures in it reads
   as having nothing to show.
5. **Add one line of scale and one line of proof.** Currently the page asserts ambition and never
   evidences it.

Everything else on the page is already at or above the bar — §2 and §4 in particular should be left
alone.

---

## Not applied — and why

Two items from above are deliberately **not** in the shipped copy.

### 1. The reorder (morning → economics → scope)

Recommended above, and **wrong on closer inspection.** The §5 panels are titled *"Your fleet,
driving"* and *"Your storefront, selling"* — but fleets and storefronts are introduced in §3. Moving
economics ahead of scope makes both references dangle: the reader meets "your fleet" before anything
has suggested they'd own one.

The current order — feel it, understand the breadth, understand the mechanism, understand the money,
act — is the defensible one. Fixing it would mean rewriting the §5 panels to be self-introducing,
which costs more than the reorder gains.

### 2. A named proof point

The audit asks for one real customer, partner or verifiable figure, and it's right that its absence is
the page's biggest credibility gap. It isn't shippable from here: there's no real name to use, and
writing a plausible-looking one would be fabricating a record rather than designing a page.

**This one needs a decision from Appy, not a copy edit** — a real logo, a real pilot, or a real
number. It's the highest-value single addition left on the page.

The **scale** line *was* added (`§3`, `.scale-line`), but as an assertion rather than a statistic:

> Every autonomous machine needs someone to tell it what to do. Almost none of them have anyone.

The draft version — *"By 2030 there will be more autonomous machines than people with jobs"* — was
dropped on purpose. It reads as research and there is none behind it; a fabricated forecast stated as
fact is a different category of problem from an illustrative product metric, and it's the kind of line
an investor checks.
