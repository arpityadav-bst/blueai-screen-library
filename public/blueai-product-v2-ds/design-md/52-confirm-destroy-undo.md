## 52 Confirm, destroy, undo

**Status:** Changed from V2.

**Why:** V2's one sign-out confirm says "Logout" over a body that says sign out, paints a non-destructive action red (`profile.jsx:75-79`), and its confirm does not sign out (`index.html:1000`). The actions that do lose something never ask: switching your own key off deletes the key (`byok_settings.jsx:64`), Remove and Unlink act at once (`byok_settings.jsx:74`, `settings.jsx:44`), and "Not now" on a paid job ends the day as not counted in one tap, the cost told only afterwards (`worker_flow.jsx:121, 149`, `worker_day_done.jsx:95`).

### Rules (Changed from V2)

- **Purpose:** decide, by what an action costs, whether to confirm, say the cost on the control, or act and offer Undo.
- **Anatomy (the decision table):**
  1. Costs today's day (skip today's job, pause today's run, quit, stop a paid run): say the cost on the control before the choice ("Skip: today won’t count", proposed copy); confirm if it cannot be taken back today.
  2. Costs account control or money: sign out and disconnect YouTube use an AlertDialog; turning on Automatic uses the ConsentDialog (section 46: Dialog `consent` variant, md, with Close, a scrim click does nothing, the primary is the agreement "I agree, turn on"). Either way the title is the question with the object, the body says what changes and how to undo it, and the primary names the action.
  3. Cannot be undone (delete my data, leave the program): AlertDialog with a danger primary named for the action.
  4. Cheap and reversible (remove my own key, disconnect Telegram, dismiss a notification): do it at once, then a Toast with Undo for 6 s; commit when the toast leaves.
  5. A switch only turns something on or off; it never deletes, signs out or costs a day as a side effect.
- **Variants:** confirm first; cost on the control; act then Undo.
- **Sizes:** AlertDialog sm (320); Toast as wide as the window minus the gutter.
- **States:** confirm, busy (primary loading; Esc, scrim and Cancel held), done (toast), undone (toast "Key restored.").
- **Props:** `Dialog {variant: 'alert', title, description, actions, busy}`; `Toast {tone, title, action: {label: 'Undo', onClick}}`.
- **Motion:** dialog scale-in 320 ms, leaves 240 ms ease-in; toast rises 180 ms.
- **Accessibility:** `role=alertdialog`, focus on Cancel (the first action, the safe answer; section 09), focus back to the opener on close; Undo is a real button and the toast timer pauses on hover and keyboard focus.
- **Responsive:** dialogs centre in the window, compact 640 included.
- **Copy:** each destructive confirm's strings have one owner, `V2Screens.CONFIRM_COPY` in `screens/settings.jsx` (`signOut(email)`, `disconnect(handle)`, `leave(handle, endsOn)`, `deleteData()`), and this section and the screens read them from it: sign out, section 64 ("Sign out?", Cancel / Sign out, primary not danger); disconnect YouTube, section 63 ("Disconnect YouTube?", Cancel / Disconnect, danger); delete my data and leave the program, on Account (section 64) as danger AlertDialogs. Removing your own key: section 49 ("{provider} key removed" + Undo). Proposed copy, the PM to approve.
- **Do / Don't:** Do name the primary for what it does; say what is kept as well as what is lost; prefer Undo to a question when the action is cheap. Don't use "Are you sure?" as the whole message; don't paint a reversible action red; don't let a switch delete data.
