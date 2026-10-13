## 55 Settings model

**Status:** Changed from V2.

**Why:** V2's Settings is one stack of five cards with no groups (`settings.jsx:144-155`): BlueStacks first, claiming "Connected" even when it is not installed (`settings.jsx:31`), then Telegram, AI mode, your own key, and Chat AI Settings with Max Output Tokens, Max Steps and a timeout (`settings.jsx:132-134`). A Save button with a 2.5 s success line (`settings.jsx:93, 136`) sits next to switches that apply at once. A partner looking for the worker's controls ("pause, stop, or disconnect anytime") finds none.

### Grouping and save model (Changed from V2)

- **Purpose:** group settings by what the partner thinks about, worker first and developer controls last, with one rule for when a change applies.
- **Anatomy (groups, in this order):**
  1. Worker: Always ask or Automatic per app, run window, pause until, start with Windows, interest profile.
  2. Connected apps: YouTube (account, watch history, Disconnect), Instagram (coming soon, no switch), Telegram.
  3. Notifications: two switches for Windows notifications, "A paid job needs you" and "Today’s run ends" (section 61); section 54 maps each event to its switch or to always on.
  4. BlueStacks: App Player status from the real check (not installed, signed out, connected as).
  5. Account and privacy: the signed-in account, the program, agreements, what BlueAI keeps, Sign out.
  6. Help: FAQ (opens the site), Report a problem.
  7. Advanced, closed by default: AI mode, your own key, chat model.
  Each group is a SettingsSection (card radius 16, title 16/600, ListRows full-bleed); Worker and Connected apps push their own screens (sections 62, 63).
- **Variants (the save model):**
  - Apply on change, for a switch, segmented control or select: the change applies at once; a quiet Toast says what changed ("BlueAI starts with Windows.", proposed copy); on failure the control goes back and a Toast error offers Try again.
  - Save, only for a form whose fields make sense together (your own key: provider and key; Report a problem): Save is disabled with a reason until something changes ("No changes yet"), loads while it saves, ends in a Toast ("Key saved."), shows errors on the field and keeps the input; leaving with unsaved changes asks first.
- **Sizes:** Settings fills the content band; sections are full column width.
- **States:** clean, dirty, saving, saved, error (both models).
- **Props:** see `V2Screens.Settings {worker, state, highlight}`, `SettingsSection {title, description, action, highlight}`, `AdvancedDisclosure {open, onToggle}`.
- **Motion:** a routed section scrolls into view and holds the highlight for 1900 ms (V2's timing, `byok_settings.jsx:47`); instant under reduced motion.
- **Accessibility:** each section is a labelled region; Advanced is one button with `aria-expanded`; a switch has role switch and a visible label; the disabled Save keeps focus and its reason is linked with `aria-describedby`.
- **Responsive:** the stack scrolls inside the content band; nothing is side by side.
- **Do / Don't:** Do put the worker's controls first; apply a single control at once and say so quietly; keep Save for forms whose fields belong together. Don't mix apply-on-change and Save on one card; don't show developer controls by default; don't show a status the app has not checked.
