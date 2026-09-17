# The agency portal, rebuilt from the brands portal

Source of truth: `blueai/public/creator-brand/campaign-report.html` (2,355 lines) plus
`src/components/creator-brand/brands/BrandPreview.tsx` and `BrandSession.tsx`.
Read from source rather than walked in a browser: the source carries the exact copy,
every state key and every branch, including ones a walkthrough would not reach.

NOT CARRIED ACROSS: the Supabase URL and anon key hardcoded at campaign-report.html:1380.
A credential does not belong in a design prototype.

## The state model: three axes, not a list of screens

| Axis | Values | Door |
|---|---|---|
| Workflow | `v1` engagement only · `v2` adds video growth | `window.onblueWorkflow` |
| Agency   | `review` · `approved`                        | `window.onblueStage` |
| Campaigns| `none` · `one` · `two`                       | `window.onblueAccount` |

Workflow governs the other two: video growth does not exist in v1, so the same
Campaigns setting means different things in the two builds. `two` is one engagement
campaign PLUS one video growth campaign, so the step from one to two is what puts the
second KIND on screen with its own row wording, its own report and its own videos card.

Creating is NOT a state. In the portal it is a dialog over the list; the old Stage bar
listed it beside In review and Campaigns as though it were a place you could be.

## The five screens

1. **Application in review** — three-step rail (Register / We review / Start campaigns),
   confirmation card, Refresh status, and a receipt line that appears only after the
   first press. Shown INSTEAD of the app, not as a fourth view.
2. **Campaigns list** — three tiles (In review, Verified completions all time, Spend this
   month); "Your campaigns" with its empty row; "Sample reports" with six rows. The two
   video-growth sample rows exist only in v2.
3. **Campaign report** — sample banner, five tiles, progress chart, board state,
   accounting, verification, proof-of-work table with filters, privacy note.
   **Videos card: video growth only.**
4. **Your campaign, in review** — IN REVIEW chip, kind, dates or country, created-at,
   short id; empty card with two CTAs; a setup table whose rows are rebuilt from the
   campaign's own type. **Videos card in its empty state: video growth only.**
5. **Create dialog** — chooser (v2 only), engagement three-step form, video-growth
   three-step form, submitted panel with the campaign id.

## Passes

- [x] 1. The dock's three axes (`onblue-dev.js`)
- [x] 2. The page's state model + the review screen's rail and receipt
- [x] 3. The list view: tiles, your campaigns, empty state, sample reports
      (also: the chooser dropped from nine catalogue cards to the portal's two)
- [x] 4. The two reports
- [x] 5. The builder at three steps, both kinds

## Removed, and why

The list view carried four things the portal does not have, all of them the creator
dashboard's furniture wearing agency words:

- **Balance + Add budget.** An agency does not hold a float with us; it commits a
  budget per campaign and nothing is charged until a completion verifies.
- **Charges ledger.** Same reason: there is no account to post charges against.
- **Live / Ended tabs.** A campaign in review is neither, which is the state those
  two had no room for. One list, and Status says which state a row is in.
- **How spending works.** The portal says this on the report, once, where the figures
  it explains actually are.

Still to check in pass 5, when the wizard is restructured: `prog-card`, `prog-reward`,
`prog-top`, `prog-unit`, `pay-*`, `choice-card`, `q--consent`, `swap-back`, `swap-fwd`.
They are dressed by the stylesheet and only reachable from JS template strings, so a
class sweep cannot tell dead from merely invisible.

## Pass 4, as built

One report builder for both kinds, and every figure on it derived from the two
pairs the row already printed (`done`/`target`, `spent`/`budget`). The source types
its numbers - 212 verified, 6 under review, 9 failed, 270 open, $288 remaining -
and each of those is a chance for the report to contradict the list that led to it.
Here the report cannot say anything the row denies.

What differs by kind: the unit (verified completions / verified views), what the bid
buys (per one / per thousand), what a run carries as evidence (a comment permalink /
a post permalink), and whether there is a Videos card at all.

A sample row opens its report; one of your own opens itself, in review, with the
same cards empty. The row is the target, not a 34px glyph at the end of it, and it
answers Enter and Space because it claims `role="button"`.

## Pass 5, as built

Five steps became three. The type explainer went because two cards can carry their
own description where nine could not; contact-and-terms went because the agency is
signed in and the Program Terms were agreed at registration. Money and window are
one step, because a budget over a fortnight is a different campaign from the same
budget over a quarter.

The confirmation said "Your campaign is live." the instant it was filed, while the
row it creates says IN REVIEW. One of the two was lying; it now says in review.
