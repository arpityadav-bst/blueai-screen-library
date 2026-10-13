## 22 Empty state

**Status:** Changed from V2.

**Why:** A new partner opens Activity before their first run and Notifications before anything has happened; an empty view has to say what will be there and when. V2's two empty states use off-palette art (Schedule: a purple icon on a purple disc, schedule.jsx:126-132; Jobs: a 120px disc with a brown briefcase over "Coming Soon", jobs.jsx:129-145, standing in for a whole tab). The onBlue site already has the family's answer: the dashed ghost and copy that names what will appear (onblue/apply.html:323-327, 1422).

### EmptyState (Changed from V2)

**Purpose.** What a view shows with nothing in it: names what will appear, gives one line of why, and offers the one way forward when there is one.

**Anatomy.**
1. Box: 1px dashed `--v2-line-strong`, radius 16, `--v2-surface-panel`, padding 32 24, centred column, gap 8. A dashed edge means "a thing will be here".
2. Icon: 24 (`--v2-icon-lg`) in `--v2-ink-3`. No disc, no colour.
3. Title: 16/600 `--v2-ink`, an h2 by default.
4. Body: 13 `--v2-ink-3`, at most 280 wide.
5. Actions (optional): one medium primary Button (36), and a quiet one beside it only if needed.

**Variants.** Five, which change the words and the default icon, never the colours:
- first use (`activity`): "No runs yet" / "Your first run starts today at 11 am. Each run shows up here, with what it did and whether the day counts."
- no results (`info`): "No unread notifications" / "You're up to date. Earlier ones are under All." + Show all.
- error (`alert`): "Couldn’t load your days" / "Nothing is lost: your runs and days are not affected. Try again in a moment." + Try again (`V2Screens.LoadError`'s words).
- offline (`wifi-off`): "You're offline" / "Activity updates when BlueAI is back online. Today's run starts then too."
- locked (`lock`): "Activity starts after setup" / "Set up your worker once in a short chat. Every run then shows up here." + Set up the worker.
(All proposed copy.)

**Sizes.** One; adapts to the width of its container.

**States.**
- Static. V2 today: the Jobs tab (`?start=worker`, then Jobs); Schedule's empty state only after deleting both seeded rows.
- Action loading: the primary Button shows its spinner and `aria-busy` (error, Try again). New.

**Props.** `EmptyState { variant = 'first' | 'noresults' | 'error' | 'offline' | 'locked', icon (name, or null), title, body, primaryAction, secondaryAction, headingLevel = 2, className }`. An action is `{ label, onClick, href, external, loading, icon }` or a node.

**Motion.** Arrives with `.v2-anim-fade-up` (180ms, 6px rise); simply there under reduced motion.

**Accessibility.** The title is a real heading. The error variant is `role="alert"`. Body text is 6.0:1 (V2's Schedule body is 2.54:1). The button is the only target.

**Responsive.** Centred; the body keeps a readable measure of 280 at any width.

**Do / Don't.** Do name what will appear and when, in the site's voice ("Nothing here yet. Programs you finish will show up here, with what each one earned."). Do offer the action that fills the view, if there is one. Do say what unlocks a locked view. Don't use "Coming Soon" for a tab. Don't use coloured discs or illustrations. Don't add a button that does not fill the view.
