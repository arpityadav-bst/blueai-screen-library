# The BlueAI brands site, redesigned on onBlue Agentic

Replaces the earlier plan in this file, which was wrong in a way worth stating
plainly: it planned a page rather than a site, and it planned it from the agentic
side.

---

## 0. What went wrong, so it does not repeat

The brief was *redesign the BlueAI brands website in the onBlue Agentic design
system*. What was built is **the onBlue Agentic site with brand copy in it**.

The mechanism was a shortcut that looked like rigour at the time: `brands.html`
was copied from `index.html` and `campaign.html` from `apply.html`, then the copy
was swapped. That guarantees the chrome is identical, which is what it was chosen
for. It also guarantees the **structure, the flows and the screens are the
creator site's**, which nobody chose.

Three things fell out of it, and each one is a thing the brands site has and the
rebuild does not:

| Brands site has | Rebuild has | What happened |
|---|---|---|
| A pricing comparison dialog | nothing | dropped |
| Register your agency, then in-review | nothing | dropped |
| Pick a campaign TYPE from nine | "pick a programme" from three | the creator site's programmes screen, wearing brand words |
| A campaign report with proof of work | a spend dashboard | the creator dashboard, mirrored |

The last row is the clearest tell. The creator dashboard is about **earning**, so
its mirror is about **spending**, and that is what got built. But the brands site
does not have a spend dashboard: it has a **campaign report**, and the thing a
buyer opens it for is proof that the work happened.

**The rule this plan runs on:** every screen below exists because the brands site
has it. Nothing is here because the agentic site has it.

---

## 1. The site, in full

Read off `/creator-brand/brands`, `create-campaign`, `campaign-report.html` and
`ModalHost`.

### 1.1 Marketing page, eight sections

1. **Hero** — two CTAs: `Create a campaign` (solid) and `See how pricing works`
   (opens a dialog)
2. **Video examples** — the 9:16 strip
3. **How it works** — **four** steps: create the campaign / BlueAI matches
   creators / real engagement, verified / you watch it run, live
4. **Platforms** — YouTube live, four more coming
5. **Outcome pricing**
6. **Trust** — checked not assumed, a real pool, live status
7. **FAQ** — five questions
8. **Closing CTA**

### 1.2 Three dialogs, hosted centrally

- **`pricing`** — "How pricing works". A six-row comparison, **The old way** vs
  **With BlueAI**: what you pay for, who you reach, how it feels to viewers,
  negotiating rates, checking the work happened, paying out.
- **`signin`** — brand sign in.
- **`campaign`** — branches on session state, which is the important part:
  - signed out → sign in
  - signed in, no agency → **Register your agency** (name, work email, website),
    then the in-review screen
  - registered → the campaign form

### 1.3 Create a campaign, three stages, its own route

`pick` → `brief` → `setup`. The catalogue is **nine types across four families**:
*Get more views*, *Get videos made*, *Get talked about*, *Learn from real
people*. Each type carries its own fields and its own bid unit (per 1,000
verified views, per finished piece, per surviving comment, per completed report,
a monthly retainer).

### 1.4 The campaign report

- **In review** — "Your application is in review."
- **Campaigns** — the list, plus its empty state
- **Campaign detail** — Progress (a chart), Accounting, Verification, Videos,
  **Proof of work**

### 1.5 States

`new` → `registered` → `approved`, switchable from the review gear.

---

## 2. What each becomes on the agentic system

The system is the vocabulary; the brands site is the content. Nothing below
invents a screen.

| Brands screen | On onBlue Agentic |
|---|---|
| Hero | `.hero` two-column, the type ladder, the masked headline entrance. **Two** CTAs, which the ladder already has: `.btn-solid .hero-solid` and `.btn-ghost .hero-ghost` beside it |
| Video examples | the turning ring (**built, keep**) |
| How it works, 4 steps | `.step` cards with `.step-art` demos. Four, not three: the grid takes it |
| Platforms | the `.chip` row, or the band note. Its own section only if the four coming platforms are worth a band |
| Outcome pricing | the `.eco-panel` pair with the illustration swap (**built, keep**) |
| Trust | `.agent-card` row, or folded into How it works. Its three claims are demonstrated elsewhere, so this one is a real question rather than a translation |
| FAQ | `.faq` rows (**built, keep**) |
| Closing | `.band-close` with the typed line (**built, keep**) |
| **Pricing comparison** | a wide `.sheet` dialog. The system has no table component: two columns of `.mini-list` rows with the tick and cross icons it already ships, the "with" column on `--panel-bg` |
| **Sign in** | the access gate's level two: two equal doors, the email door morphing into a field |
| **Register your agency** | the gate's level one slot, as a three-field form on `.field` |
| **In review** | the confirmation treatment: spark, typed line, green strip |
| **Catalogue, 9 types / 4 families** | four `.band`-headed groups of `.card`s, or one grid with family eyebrows. Each card carries its bid unit the way the programme card carried `$30` |
| **Brief stage** | the explainer: `.step` cards showing what this type does |
| **Setup stage** | `.form-card` with the measured floor and the band at submit |
| **Campaigns list** | `.dash` section with `.progtile` rows |
| **Campaign detail** | the one genuinely new screen. Progress needs the `.earn-bars` chart re-aimed; Verification and Proof of work need a component the system does not have |

---

## 3. What to keep and what to throw away

**Keep** (these are the brands site's content on the agentic system, which is the
brief): the ring, the outcome panels and their renders, the FAQs, the closing
band, the header and footer, the whole of `onblue.css` and the light twins.

**Throw away** (these are the creator site wearing brand words):

- `campaign.html`'s programme catalogue: three "programmes" with a Reward pill.
  The brands site picks a campaign **type** from nine, grouped in four families.
- `campaign.html`'s four-step wizard. The brands flow is pick → brief → setup.
- `campaign.html`'s dashboard. Balance, Add budget, Charges and "How spending
  works" are the creator dashboard reflected; the brands site has a campaign
  report whose subject is proof.

**Restore**: the pricing dialog, agency registration, in-review, and the campaign
detail screen.

---

## 4. What the marketing page needs decided

Three of its eight sections were cut in the first pass on arguments that were
about the agentic page, not about this one.

1. **Platforms** was removed because "the system has a component for one
   sentence". True, and the brands site gives it a section because scope is the
   thing agencies ask about first.
2. **Trust** was removed because two other sections demonstrate its claims. Also
   true, and also the section a buyer who has been sold bot traffic reads first.
3. **The second hero CTA**, "See how pricing works", went with the dialog.

---

## 5. Open questions, in the order they block work

1. **The marketing page: eight sections or six?** Restoring Platforms and Trust
   is cheap. The argument for cutting them was a design argument; the argument
   for keeping them is that they are what this audience asks about.
2. **The catalogue: all nine types, or the three that are live?** Nine is what
   the product offers and four families is a real structure. Three was invented.
3. **The campaign report: how far?** The list and the in-review screen are close
   to what exists. Progress, Accounting, Verification, Videos and Proof of work
   are five screens' worth of new component work, and Proof of work has no
   equivalent anywhere in the system.
4. **Live or pre-launch?** The marketing page now says "the day we launch"; the
   report says campaigns are running. Both cannot be true on one site.
