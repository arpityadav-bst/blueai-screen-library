## 72 Review states (URL params and Preview panel)

**Status:** State catalogue: In V2. Preview panel: In V2.

**Why:** Every V2 state is a specimen, and a review link has to open on exactly the state being discussed. V2 documents its params only in a comment block (index.html:195-236), three of them only work in combination, and Copy link drops several states (index.html:743-765). This section is the index.

### State catalogue (In V2)

**Purpose.** Every V2 URL param: what it opens, what it needs, and whether Copy link carries it.

**Anatomy.** One table; in the guide each row has Show, which loads that V2 state below the table.

**Variants.**

| Param | Values | Needs | Opens | Copy link |
|---|---|---|---|---|
| (bare URL) | | | BlueAI alone, signed out: welcome + first-run terms | n/a |
| `?start` | worker, signin | | worker home, signed in as a new partner; signin is the default | yes |
| `?v` | 1, 2 | start=worker | 1 Mode chip in the composer; 2 ribbon above it | yes |
| `?setup` | off | start=worker | onboarding without the setup question | yes |
| `?day` | next, returning | implies start=worker | next: the next day's run plays; returning: home before today's run | yes |
| `?end` | job, nojob, day20, failed | implies day=next | how today's run ends: day-done card and toast | yes |
| `?card` | days, money, plain | day=next or ?end | which day-done option draws it | yes |
| `?mode` | auto | start=worker | YouTube on Automatic, consent skipped | yes |
| `?signin` | browser | | the sign-in handoff with the browser beside | yes |
| `?player` | out, accepted, other | other needs signin=browser | the App Player account on this PC | yes |
| `?browser` | accepted, other, out | signin=browser | what bluestacks.ai holds | yes |
| `?cases` | signin | | the five sign-in cases as a bar, no Preview panel | no |
| `?case` | 1, 2, 3a, 3b, 3c | cases=signin | which case opens | no |
| `?opt` | a, b | cases=signin | sign-in option A or B | no |
| `?ask` | any text | waits for sign-in | auto-sends the message | no |
| `?credits` | 0 | signed in to see it | zero credits: chip 0, banner, popup on send | no |
| `?bs` | 1 | | BlueStacks installed too | yes |
| `?bai` | 0 | bs=1 (alone it is forced on, index.html:262) | BlueAI not installed | yes |
| `?dlg` | blueai | bs=1 and bai=0 (index.html:713) | Flow A's installer | no |

Worker params ride on Copy link only from the signed-in worker home (index.html:752).

**Sizes.** Not applicable.

**States.** Each row is itself a state; a row's canonical URL is the one in the guide's Show.

**Props.** Not a kit part (V2 tooling: `QS`, `LINK`, `START`, index.html:202-264).

**Motion.** None.

**Accessibility.** Not product UI.

**Responsive.** Not applicable.

**Do / Don't.** Do link reviews to one of these URLs. Do make Copy link carry every state and every param stand alone (R46). Don't add a state reachable only from the Preview panel.

### Preview panel (In V2)

**Purpose.** V2's dark review dock (bottom left), the only door to about a third of V2's states.

**Anatomy.** "Preview" header with Copy link and collapse; Installed chips; rows of segmented options shown only when they affect the screen.

**Variants.** Rows and when they show:

| Row | Options | Shown when |
|---|---|---|
| Installed | BlueStacks, BlueAI | always |
| Start at | Sign in, Worker home | BlueAI installed |
| Session | Onboarding, Default, BlueAI worker | BlueAI installed |
| Terms | First run, Terms update, Off | BlueAI installed |
| App Player | Signed out, Accepted account, Other account | signed out, or App Player not signed out |
| Browser | Accepted account, Other account, Signed out | as App Player |
| Chat states | Off, On | the chat tab |
| Scheduled job | Off, Out of credits | the chat tab |
| Version | 1 Chat box, 2 Ribbon | the worker chat, signed in |
| Worker | Day 1, Returning, Next day | the worker chat, signed in |
| Day end | Job done, No job, Day 20, Failed | the worker chat, signed in |
| Card | Days, Money, Plain | the worker chat, signed in |
| Setup question | On, Off | the worker chat, signed in |
| Hardware | Yes, No | the Settings tab |
| AI conflict | None, Detected | the Settings tab |
| Own key | Off, On | signed in |
| Credits | Full, Empty | signed in, own key off |

**Sizes.** Fixed bottom left, 300 wide (index.html:1094); collapses to a 38 gear.

**States.** Open, collapsed; hidden under `?cases=signin`.

**Props.** V2 internals (`PreviewRow`, `InstallChip`). Not a kit part.

**Motion.** Tooling only.

**Accessibility.** Tooling, not product.

**Responsive.** Not applicable.

**Do / Don't.** Do keep it as tooling, following the onBlue site's review-dock convention (onblue-dev.js). Don't take its dark palette (index.html:871-877) into product tokens.
