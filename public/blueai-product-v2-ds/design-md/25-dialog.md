## 25 Dialog

**Status:** Dialog, AlertDialog (confirm, destructive): both Changed from V2.

**Why:** The partner's consent, sign-out and disconnect decisions happen in dialogs, and V2 builds each one separately: five widths (280, 300, 340, 360, 382), radii 12, 16 and 20, five different scrims, z-indexes from 50 to 130 with a tie at 120 (shared.jsx:72-73, profile.jsx:73-74, byok.jsx:79-80, worker_day_done.jsx:139-142, terms_sheet.jsx:97). None moves focus in or gives it back, the close button has no name (shared.jsx:76) and none has a busy state, so a slow consent can be clicked twice. One Dialog on one scrim and one layer fixes all of it (P5, P7, R24), with the onBlue sheet's quiet manners: the panel takes focus, not its close button (onblue/onblue.css:942), and the title takes the row (onblue.css:1384).

**V3 restyle (2026-10-14).** Decisions: one dialog radius, 20 (`--v2-radius-dialog`); titles 18/600/-0.03em (`--v2-text-18`, `.v2-text-title-dialog`). Size split: confirm dialogs (sign out, out of credits) are `--v2-dialog-sm` with the plain frame (no header rule); task dialogs (Telegram, Hybrid) are `--v2-dialog-md` with the header. The commit is the solid ink primary; there is no red solid: a destructive confirm names the loss in a solid primary.

### Dialog (Changed from V2)

**Purpose.** A decision or a short task the partner must finish or decline before going on: consent to Automatic, sign out, disconnect, out of credits, the day-done moment.

**Anatomy.** Scrim `--v2-scrim` over the window. Panel centred with a symmetric 20px inset (`--v2-space-5`, review round 1, 2026-10-14): `--v2-surface`, 1px `--v2-line`, radius 20 (`--v2-radius-dialog`), `--v2-shadow-2`. Header: title 18/600 `--v2-ink` (tracking -0.03em) taking the row, a 32px IconButton named Close beside it. Body: 14/1.5 `--v2-ink-2`, padding 20, scrolls when tall. Actions: 44px Buttons of equal width, 8px apart, secondary first, primary last. Optional footer note 12 `--v2-ink-3`. Layer `--v2-z-dialog` (100). One dialog at a time; if two ever overlap, mount order decides which is on top (section 06), which only settles the overlap, it does not make stacking a pattern.

**Variants.** `task` (md, Close, scrim click cancels). `consent` (md, Close, scrim click does nothing, the primary's label is the agreement: "I agree, turn on"). `alert` (see AlertDialog). `celebration` (sm, centred, no Close, scrim click closes: DayDone). `scrim="frost"` puts it on the sign-in gate veil and layer (`--v2-z-gate`), sign-in only.

**Sizes.** sm 320 (`--v2-dialog-sm`): alert, celebration, out of credits. md 382 (`--v2-dialog-md`): task, consent. Height up to the window less 20px each side.

**States.** Closed (nothing mounted); opening; open; busy (the primary loads; Esc, the scrim and Close wait); closing; over a menu (the menu closes first, focus comes back to the menu button). In V2 today: ModalOverlay as Confirm delete on the Schedule tab (schedule.jsx:144); the Automatic consent at `?start=worker&v=1`, open the mode chip, pick Automatic, in ModalOverlay's plain frame since 2026-10-14 (no header, divider or X; agent_permissions.jsx:189); out of credits at `?credits=0` then send a message (byok.jsx:76).

**Props.** `open`, `onClose`, `title`, `description`, `variant`, `size` ('sm' | 'md'), `role` (override), `dismissible` (false blocks: no Close, no Esc, no scrim), `busy`, `actions` ([{label, onClick, variant 'secondary' | 'primary' | 'danger' | 'quiet', disabled}]), `footer`, `initialFocus` (ref or selector), `labelledBy` (when the title lives in the body), `scrim`, `className`, `children`. `preview` renders it open in place without focus (guide specimens only).

**Motion.** Scale-in `--v2-dur-4` (320ms) on `--v2-ease-out`; scrim fades `--v2-dur-3`; exit fades `--v2-dur-3` on `--v2-ease-in`. Reduced motion: instant (motion.css).

**Accessibility.** role dialog, `aria-modal`, named by its title, described by `description`. Where focus lands on open, one rule (section 09): the panel itself for dialogs read before acting (task, consent, celebration), with no ring until Tab; the first field, through `initialFocus`, for a dialog that is a form; Cancel, the first action, for an AlertDialog. Tab cycles inside; Esc, Close and Cancel return focus to the opener. `aria-busy` while busy. Close is named. Every label at least 4.5:1.

**Responsive.** Scoped to the window (absolute inside AppFrame's overlay plane), never the page. A product window that is not the kit's AppFrame marks itself `data-v2-bounds` (V3's `.ba-app`), and `useFocusTrap` makes everything in it inert under the overlay, as it does inside AppFrame (`kit/dialog.jsx` inertAround; V3 review round 1, 2026-10-14). On the compact window the body scrolls; header and actions stay.

**Do / Don't.** Do write the title as the question and the body as what changes and how to undo it. Do set `busy` while an answer is recorded. Don't confirm something cheap to reverse; act and offer Undo (section 24). Don't stack a dialog on a dialog. Don't use a dialog for a long form; that is a Sheet.

### AlertDialog (confirm, destructive) (Changed from V2)

**Purpose.** The confirm before something that cannot be taken back cheaply, or that changes what the worker may do.

**Anatomy.** Dialog sm with role alertdialog, no Close: the title is the question, the body says what changes, two actions: Cancel and the action named for itself.

**Variants.** Confirm: the solid primary (`--v2-solid`). Destructive: Button `destructive`, the same solid in Target (V3 restyle: no red fill; V2 today paints it red through `--v2-button-destructive-fill`), its label naming what is lost.

**Sizes.** sm 320.

**States.** Confirm; destructive; busy. In V2 today: Profile, Sign out opens Logout (profile.jsx:69-84), reached at `?start=worker`, more menu, Profile.

**Props.** `variant="alert"` plus the Dialog props.

**Motion.** As Dialog.

**Accessibility.** Focus starts on Cancel, the safe answer. Esc cancels; a scrim click does nothing.

**Responsive.** As Dialog.

**Do / Don't.** Do name the primary for the action (Sign out, Disconnect, Delete), never OK or Yes. Do say the consequence; the sign-out confirm's strings are owned by section 64, the disconnect confirm's by section 63. Don't paint Sign out as destructive: V2's "Logout" on #ef4444 (3.76:1, profile.jsx:79) suggests loss, and confirming it does not even sign out (index.html:1010, R03).
