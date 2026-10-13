## 31 Bottom navigation

**Status:** BottomNav: Changed from V2.

**Why:** Navigation should name the three things a partner does: see the worker today, check runs and verified days, change how the worker works. V2's first tab, Jobs, is a "Coming Soon" page (jobs.jsx:140) in a product about paid jobs; Schedule shows sample tasks for another app; the active tab is indigo #4f46e5 on #eef2ff (shared.jsx:305), a second accent beside the blue every other control uses; and the bar carries both a border and a shadow (shared.jsx:300).

### BottomNav (Changed from V2)

**Purpose.** Move between the three places of the product. Home: the worker, today and progress (the chat is reached from here). Activity: every run and whether each day was verified (replaces Jobs). Settings: Worker first, Advanced last.

**Anatomy.** A `<nav>` of three equal buttons; each is a 20 icon over a 12/500 label. The selected item has a 2px blue bar on the bar's top hairline and ink icon and label. An optional count badge sits on the icon's top right.

**Variants.** Three items: Home (`home`), Activity (`activity`), Settings (`settings`). Four items only if decision D12 keeps chat as a tab: Home, Chat, Activity, Settings (`NAV_ITEMS_WITH_CHAT`). The recommendation is three.

**Sizes.** 56 tall (`--v2-nav-h`; V2 64). Padding 0 8; items 47 tall inside the bar (56 less the 1px top line and a 4 margin above and below), radius 6. Icon 20, stroke 1.75 (V2 22, stroke 1.9). Label 12/500 in every state (V2 10.5px, 700 active / 600 rest). Selected bar 24 x 2, `--v2-blue`. Badge 16 tall pill, `--v2-action` fill, white 11/600 (4.92:1), a 2px surface ring.

**States.**
- Rest: ink-3 icon and label (6.0:1).
- Hover: `--v2-wash-hover` on the item, ink-2. (V2 has no hover.)
- Pressed: `--v2-wash-press`.
- Selected: blue bar + ink; no fill, no weight change, so labels never shift.
- Focus-visible: 2px blue outline, inset 2.
- Badge: something in Activity needs the partner (a waiting job, a rejected day); hidden at 0, "9+" above 9.
- Pushed screen open: the parent tab stays lit (V2 lights none, index.html:992).
- Signed out: no nav (AppFrame chrome-free).
V2: `?start=worker` shows the nav with Chat active (the default, index.html:613).

**Props.** `BottomNav { items = NAV_ITEMS ([{ id, label, icon, badge }]), value, onChange(id), ariaLabel = 'Main', forceState, className }`. `value` is the parent tab while a pushed screen is open. `forceState` is for guide specimens only.

**Motion.** Colour and wash over `--v2-dur-1` (120ms). No indicator slide.

**Accessibility.** `<nav aria-label="Main">`; the selected item has `aria-current="page"`. The badge number is hidden from screen readers and said as ", 2 new" after the label. Every item is a 47 tall target.

**Responsive.** One width; labels truncate rather than wrap (none do at three or four items).

**Do / Don't.** Do keep the parent tab lit on a pushed screen. Do use the badge only for something that needs the partner. Don't add a tab for a page with nothing on it. Don't change weight or size on selection. Don't show the nav before sign-in.
