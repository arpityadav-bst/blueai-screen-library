## 32 Screen header and navigation model

**Status:** ScreenHeader: Changed from V2. Navigation model: Changed from V2.

**Why:** A partner who opens Credits or Account must always know where they are and how to get back, and must never lose today's run by looking elsewhere. V2 has five title treatments (19/800 index.html:448, 22/800 history.jsx:91, 20/700 schedule.jsx:118, 22/800 in #1e293b jobs.jsx:140, none on Profile) and no Back anywhere; it picks the screen from a chain of booleans (index.html:965) and mounts the chat, with the run inside it, only on the chat tab (index.html:975).

### ScreenHeader (Changed from V2)

**Purpose.** One title band for every screen.

**Anatomy.** Optional Back (IconButton 32, `back`, label "Back"), the title (`<h1>`), an optional trailing slot for one action.

**Variants.** Title only (a tab root: Activity, Settings). With Back (a pushed screen: Worker settings, Account). With a trailing action: an IconButton (Chat's "New chat", `plus`) or a quiet md Button (Notifications' "Mark all read", `screens/notifications.jsx:157`).

**Sizes.** Min 52 tall (`--v2-topbar-h`), padding 8 16 (`--v2-space-2`, `--v2-gutter`); with Back the left padding is 10, so the chevron lands on the 16 gutter. Title 20/600, -0.02em, ink, one line (`--v2-text-20`, `--v2-weight-semibold`, `--v2-tracking-title`). Ground `--v2-canvas`.

**States.** None of its own (Back follows IconButton states, section 11). A long title truncates with an ellipsis. V2: open AI Credits, Chat History or Schedule from `?start=worker` to see the five treatments.

**Props.** `ScreenHeader { title, onBack, trailing, titleId, className }`.

**Motion.** None. It is sticky to the top of the content band (`--v2-z-sticky`), so Back stays reachable on the 640 window.

**Accessibility.** The title is the screen's `<h1>` with `tabIndex -1`: when a screen is pushed, focus moves to it, so a screen reader announces where the partner landed. Back has a label. One trailing action only.

**Responsive.** One line at 419; truncate, never wrap.

**Do / Don't.** Do give every pushed screen a Back. Don't use a second title style. Don't put Back on a tab root or on an overlay.

### Navigation model (Changed from V2)

**Purpose.** Where every screen sits, how the partner gets back, and which tab is lit, kept apart from the Worker record.

**Anatomy.** Three levels.

| Level | Screens | Way back | Tab lit |
|---|---|---|---|
| Tab | Home, Activity, Settings | the nav | itself |
| Pushed screen | Chat, Run detail, Notifications, Account, Worker settings, Connected apps, AI credits (Help is the top bar menu plus the Report a problem sheet, not a screen) | Back in the ScreenHeader | its parent tab (rule below) |
| Overlay | Dialog, Sheet, day done, splash, toast | its own close or answer | unchanged |

**Which tab is lit for a pushed screen, one rule.** A screen with a home in Settings (Worker settings, Connected apps, Account) lights Settings from any door, the top bar's More menu included. A pushed screen with no home in Settings goes on the stack of the tab it was opened from and keeps it lit; Back returns there (Run detail, AI credits, Notifications); Chat belongs to Home. The props are `tab` (Run detail, AI credits) or `parentTab` (Notifications).

**Variants.** None.

**Sizes.** Not applicable.

**States.** Tab; pushed (one or more screens on a tab's stack); overlay open. Rules: each tab keeps its own stack; tapping another tab switches and keeps the stack; tapping the lit tab returns to its root; a notification or the tray opens the screen it names, pushed over its parent tab. V2: none of these exist; a kebab screen is left only by tapping a tab (index.html:867).

**Props.** Navigation state is `{ tab, stacks: { home: [], activity: [], settings: [] } }`, held by the host router: the code that mounts the screens (V2's app root when it adopts the kit; the guide's demo is `guide/sections/screens-home.jsx`, `Flow`), never inside a screen and never in the kit. A stack entry is `{ id, run, row }`. BottomNav's `value` is `tab`. Every screen emits `onNavigate(id, opts)`; the router resolves each id by this table.

| id | opts | Screen | Level | Tab lit | Back |
|---|---|---|---|---|---|
| `home`, `activity`, `settings` | none | Home, Activity, Settings | tab | itself | none; tapping the lit tab returns it to its root |
| `settings` | `{highlight}`: a section id ('worker', 'apps', 'notifications', 'bluestacks', 'account', 'help', 'advanced') | Settings, scrolled to that section and holding the highlight | tab | Settings | none |
| `chat` | `{state}`: setup, running, waiting, retrying | Chat | pushed on Home's stack, from any door | Home | the screen under it on Home's stack |
| `run` | `{state, row, tab}`: a Run detail state, its ledger row (`rowTarget`, section 58) and the tab it was opened from | Run detail (`tab`) | pushed on the stack of the tab it was opened from (`opts.tab`; Activity by default) | that tab | the screen under it on that tab's stack |
| `notifications` | none | Notifications (`parentTab`) | pushed over the tab you are on | that tab | that tab |
| `credits` | none | AI credits (`tab`) | pushed over the tab you are on | that tab | that tab |
| `account` | none | Account | pushed on Settings' stack | Settings | Settings |
| `worker-settings` | none | Worker settings | pushed on Settings' stack | Settings | the screen under it |
| `connected-apps` | `{app}`: 'youtube' or 'telegram'; none for the list | Connected apps | pushed on Settings' stack | Settings | the screen under it |
| `report` | none | the Report a problem sheet (`V2Screens.ReportProblemSheet`) | overlay | unchanged | its own close |
| `sign-out` | none | the sign-out confirm (`CONFIRM_COPY.signOut`, section 64) | overlay | unchanged | Cancel |
| `terms` | `{docs}`: the changed documents' names | the Program Terms sheet, `update` mode (`V2Screens.TermsSheet`, section 53), from a Terms updated notification | overlay | unchanged | none: it asks for the agreement |

The run chip, the WorkerCard's Details and the RunCard's details emit no id of their own: they open `V2Screens.chipTarget(worker)` (`screens/home.jsx`), which is today's row as Activity opens it (`chat` {state} while the run is live, `run` {state, row} once it has an outcome), `worker-settings` while paused, and `home` otherwise. Earnings is not a route: it opens `EARNINGS_URL` on the site in the browser. A pushed screen whose id is already on top is replaced, so it shows the new state. A new screen gets a row here before it ships (section 74, step 3).

**Motion.** A pushed screen enters with `v2-anim-fade-up` (section 07); Back reverses it. Reduced motion: instant.

**Accessibility.** Focus moves to the pushed screen's title; on Back it returns to the control that pushed it.

**Responsive.** The same on both window heights.

**Do / Don't.** Do keep the worker's run in the Worker record (section 41) so no navigation can unmount it. Don't model screens as a chain of booleans. Don't open a pushed screen from a menu without lighting its parent tab.
