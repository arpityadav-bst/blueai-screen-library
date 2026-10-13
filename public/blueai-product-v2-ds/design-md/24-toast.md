## 24 Toast

**Status:** Toast: New.

**Why:** Confirm, destroy, undo (section 52) says a cheap mistake gets Undo, not a confirm. Undo needs a home, and V2 has none: its only in-app confirmation is an inline "Settings saved successfully." that vanishes after 2.5 s (settings.jsx:78, 121), while removing your own key and unlinking an app act at once with no confirm and no undo (byok_settings.jsx:75, settings.jsx:44). The toast is that home. It is not the Windows notification (desktop_toast.jsx:12), which reaches a partner who is not looking at BlueAI; a toast only confirms something the partner did in this window a second ago.

### Toast (New)

**Purpose.** Confirm a change just made here (saved, removed, sent, copied) and offer the one follow-up that matters: Undo or Try again.

**Anatomy.** Bottom centre of the window, 12px above the bottom nav. A row that hugs its words, max 388, at least 44 tall: `--v2-surface`, 1px `--v2-line`, radius 10, `--v2-shadow-1`. Icon 16 (check-circle `--v2-success`, info `--v2-blue`, alert `--v2-danger-ink`, a Spinner while loading), title 13/500 `--v2-ink`, an optional text action (13/500 `--v2-blue-ink`, 32px target), a 32px Dismiss button. Layer `--v2-z-toast` (120, above dialogs).

**Variants.** `success`, `info`, `error` (with Try again), `loading` (turns into its result in place). Any of them may carry an `action`; with Undo the change applies now, Undo reverses it, and it commits when the toast goes.

**Sizes.** One.

**States.** Entering; visible; paused (hover or keyboard focus holds the timer); leaving; replaced (a new toast replaces the current one: a 419px window cannot stack). Timing: 4s, 8s for an error, loading waits for `update()`. A toast with Undo or Try again has no timer: it stays until Dismiss, its action, the next toast, or the screen calls `dismiss()` on leaving, so the action can be reached by keyboard and screen reader at any pace (WCAG 2.2.1, `kit/toast.jsx:17-23, 41-45`); a change it can undo commits then. Not in V2 (New): the guide shows every state forced, and its Try it window fires each one.

**Props.** `ToastHost {offset 'nav' | 'none', region, className, children}` holds the one toast and provides `useToast()`. AppFrame draws the window's one `ToastRegion` (`kit/shell.jsx:32`) and mounts its own host when none sits above it, so a part drawn inside the frame can call `useToast()`. A screen that shows toasts from its own body (above its frame) wraps it in `V2Screens.ToastScope` and calls `useScreenToast()` (`screens/home.jsx:157-163`; section 74, step 4); an app-level host above AppFrame must pass `region={false}`, or it draws a second live region beside AppFrame's and every toast is drawn and announced twice (`kit/toast.jsx:130`). `ToastRegion {offset, className}` is AppFrame's; screens never render it. `useToast()` returns `show({tone: 'success' | 'info' | 'error' | 'loading', title, action: {label, onClick}, duration}) -> id`, `update(id, opts)`, `dismiss(id)`; tone 'danger' is read as 'error' (section 03). `Toast {tone, title, action, duration, leaving, onClose}` is the drawn part; `duration={0}` shows it without a timer.

**Motion.** Fade-up `--v2-dur-2` (180ms) on `--v2-ease-out`; fade out `--v2-dur-1` (120ms) on `--v2-ease-in`. The timer is a CSS animation, so pausing is a CSS state; under reduced motion everything else is instant but the timer keeps its length.

**Accessibility.** Two live regions, polite and assertive, both always mounted; the toast goes into the one its tone needs (an error into the assertive one). Toasts never take focus; the action and Dismiss are reachable by Tab, and focus pauses the timer. Never the only route to a fix: a condition that holds is a Banner (section 21).

**Responsive.** Max 388 inside the 419 window with 16px gutters; on a screen without the bottom nav the region sits 16px from the bottom (AppFrame passes `offset="none"` itself when it has no nav).

**Do / Don't.** Do confirm what the partner just did, in a few words (proposed copy: "Settings saved", "Key removed" + Undo, "Sending your report…" then "Report sent", "Couldn’t save your change" + Try again, "Automatic is off for YouTube"). Do prefer Undo to a confirm for anything cheap to reverse. Don't use a toast for something the worker did while the partner was away: that is the Windows notification and the inbox (section 54). Don't stack toasts.
