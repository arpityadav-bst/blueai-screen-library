## 52 Confirm, destroy, undo

**Status:** Changed from V2.

**Why:** V2's one sign-out confirm says "Logout" over a body that says sign out, paints a non-destructive action red (`profile.jsx:75-79`), and its confirm does not sign out (`index.html:1000`). The actions that do lose something never ask: switching your own key off deletes the key (`byok_settings.jsx:64`), Remove and Unlink act at once (`byok_settings.jsx:74`, `settings.jsx:44`), and "Not now" on a paid job ends the day as not counted in one tap, the cost told only afterwards (`worker_flow.jsx:121, 149`, `worker_day_done.jsx:95`).

### Rules (Changed from V2)

- **Purpose:** decide, by what an action costs, whether to confirm, say the cost on the control, or act and offer Undo.
- **Anatomy (the decision table):**
  1. Costs today's day (skip today's job, pause today's run, quit, stop a paid run): say the cost on the control before the choice ("Skip: today won’t count", proposed copy); confirm if it cannot be taken back today.
  2. Costs account control or money (sign out, disconnect YouTube, turn on Automatic): AlertDialog. The title is the question with the object; the body says what changes and how to undo it; the primary names the action.
  3. Cannot be undone (delete my data, leave the program): AlertDialog with a danger primary named for the action.
  4. Cheap and reversible (remove my own key, disconnect Telegram, dismiss a notification): do it at once, then a Toast with Undo for 6 s; commit when the toast leaves.
  5. A switch only turns something on or off; it never deletes, signs out or costs a day as a side effect.
- **Variants:** confirm first; cost on the control; act then Undo.
- **Sizes:** AlertDialog sm (320); Toast as wide as the window minus the gutter.
- **States:** confirm, busy (primary loading; Esc, scrim and Cancel held), done (toast), undone (toast "Key restored.").
- **Props:** `Dialog {variant: 'alert', title, description, actions, busy}`; `Toast {tone, title, action: {label: 'Undo', onClick}}`.
- **Motion:** dialog scale-in 320 ms, leaves 240 ms ease-in; toast rises 180 ms.
- **Accessibility:** `role=alertdialog`, focus on the first action, focus back to the opener on close; Undo is a real button and the toast timer pauses on hover and keyboard focus.
- **Responsive:** dialogs centre in the window, compact 640 included.
- **Copy (proposed):** "Sign out of BlueAI?" / "Your worker pauses until you sign in again, and days don’t count while it’s paused." / Cancel, Sign out (primary, not danger). "Disconnect YouTube?" / "Your worker can’t run YouTube jobs until you connect it again, so today won’t count. Your days so far are kept." / Cancel, Disconnect (danger). "Key removed." + Undo.
- **Do / Don't:** Do name the primary for what it does; say what is kept as well as what is lost; prefer Undo to a question when the action is cheap. Don't use "Are you sure?" as the whole message; don't paint a reversible action red; don't let a switch delete data.
