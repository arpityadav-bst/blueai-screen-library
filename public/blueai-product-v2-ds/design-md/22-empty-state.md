## 22 Empty state

**Status:** Changed from V2.

**Why:** A new partner opens Activity before their first run and Notifications before anything has happened; an empty view has to say what will be there and when. V2's two empty states use off-palette art (Schedule: a purple icon on a purple disc, schedule.jsx:126-132; Jobs: a 120px disc with a brown briefcase over "Coming Soon", jobs.jsx:129-145, standing in for a whole tab). The onBlue site already has the family's answer: the dashed ghost and copy that names what will appear (onblue/apply.html:323-327, 1422).

**V3 restyle (2026-10-14).** An empty state is now a 56 sunken mark with the 24 icon in muted ink, a 20/600 title, one 14 ink-3 line at `--v2-measure` (280, review round 2), and at most one solid action; no box of its own (the dashed edge is kept for a pending choice). Decision: no serif em phrase in these, they sit in working tabs; the serif stays on welcome and first-run moments.

### EmptyState (Changed from V2)

**Purpose.** What a view shows with nothing in it: names what will appear, gives one line of why, and offers the one way forward when there is one.

**Anatomy.**
1. Column: no box, padding 40 20, centred, gap 8 (V3 restyle).
2. Mark: a 56 disc (`--v2-mark-xl`) in `--v2-surface-sunken`, the 24 icon in `--v2-ink-3`. No colour.
3. Title: 20/600 `--v2-ink`, an h2 by default.
4. Body: 14 `--v2-ink-3`, at most 280 wide (`--v2-measure`, the token for short centred copy; review round 2).
5. Actions (optional): one medium primary Button (36), and a quiet one beside it only if needed.

**Variants.** Five, which change the words and the default icon, never the colours:
- first use (`first`, icon `activity`): "No days yet" / "Each run shows here with its verification: one tick while pending, two once verified." plus the next run time ("Next run today at 11 am."); before setup, + Set up your worker (`screens/activity.jsx:138-140`).
- no results (`noresults`, icon `info`; Notifications passes `check`): "Nothing unread" / "You’ve seen everything your worker sent.", no action (`screens/notifications.jsx:123`).
- error (`error`, icon `alert`): "Couldn’t load your days" / "Nothing is lost: your runs and days are not affected. Try again in a moment." + Try again (`V2Screens.LoadError`'s words, `screens/home.jsx:216-217`).
- offline (`offline`, icon `wifi-off`): "You’re offline" / "BlueAI can’t reach the internet, so there’s nothing to show yet. Today’s run starts when you’re back online." + Try again (section 69, `screens/system-states.jsx:87-89`).
- locked (`locked`, icon `lock`; the update state passes `download`): "Update BlueAI to keep running" / "This version can’t run jobs anymore, so runs are paused. Update now and today can still count. It takes about a minute." + Update now (section 69, `screens/system-states.jsx:121-123`).
(All proposed copy.)

**Sizes.** One; adapts to the width of its container. Review round 1 (2026-10-14): the box, the mark and the type read look hooks (`--v2-empty-fill`, `-line`, `-radius`, `--v2-empty-mark-fill`, `-mark-ink`, `--v2-empty-title-size`, `-title-weight`, `-title-ink`, `--v2-empty-body-ink`), and the box lifts by `--v2-shadow-0` (none in Target, V2's soft in-flow cast in V2 today; review round 2). Target: no box, the sunken mark, 20/600 ink, ink-3 body. V2 today: a white box with a slate edge and radius 12, the purple mark, a 15px title. On a page the state fills the space under the screen header (no fixed viewport height).

**States.**
- Static. V2 today: the Jobs tab (`?start=worker`, then Jobs); Schedule's empty state only after deleting both seeded rows.
- Action loading: the primary Button shows its spinner and `aria-busy` (error, Try again). New.

**Props.** `EmptyState { variant = 'first' | 'noresults' | 'error' | 'offline' | 'locked', icon (name, or null), title, body, primaryAction, secondaryAction, headingLevel = 2, className }`. An action is `{ label, onClick, href, external, loading, icon }` or a node.

**Motion.** Arrives with `.v2-anim-fade-up` (180ms, 6px rise); simply there under reduced motion.

**Accessibility.** The title is a real heading. The error variant is `role="alert"`. Body text is 6.0:1 (V2's Schedule body is 2.54:1). The button is the only target.

**Responsive.** Centred; the body keeps a readable measure of 280 at any width.

**Do / Don't.** Do name what will appear and when, in the site's voice ("Nothing here yet. Programs you finish will show up here, with what each one earned."). Do offer the action that fills the view, if there is one. Do say what unlocks a locked view. Don't use "Coming Soon" for a tab. Don't use coloured discs or illustrations. Don't add a button that does not fill the view.
