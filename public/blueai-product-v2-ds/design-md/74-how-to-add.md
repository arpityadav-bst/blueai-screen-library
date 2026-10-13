## 74 How to add a feature

**Status:** Meta (no parts).

**Why:** The system only pays off if the next feature is built from it. These are the steps from a new task to a screen merged into V2.

### From a new task to a screen in V2

1. **Name the job it serves.** One line: which of the three jobs in section 01 it serves, and which principle in section 02 it leans on. If it serves none, question the feature before designing it.
2. **Find its state in the Worker record.** Everything about the worker's day lives in one record (section 41). Name the fields the feature reads or writes and add them to the fixtures in `kit/worker-data.jsx`, never to a screen's local state, so no navigation can lose them (P1). One thing sits outside the record today: the Notifications inbox keeps its items as fixtures in `screens/notifications.jsx` (section 76 lists the gap). A feature that raises a new event adds its row there and its line to section 54.
3. **Place it.** Pick the level from the navigation model in section 32: a tab, a pushed screen with Back, a sheet or a dialog. Check section 55 if it is a setting and section 54 if it has to reach a partner who is away.
4. **Compose it from the kit.** Use parts from Components, Shell, Chat, Worker and Credits. Each part's section lists its props, variants and states. Reach for a token, never a raw value. Add a kit part only when nothing fits (step 8).
   - Wrap a whole screen in `V2Screens.ScreenFrame`, the one frame for every signed-in screen (core, account and system states). Pass `tab` for the lit tab by the rule in section 32 (a top-bar door keeps the tab you came from), `worker` for the top bar, `onNavigate(id, opts)` for every chrome event, and `frame={false}` to drop the chrome inside a guide specimen.
   - If the screen confirms its changes with a toast, wrap it in `V2Screens.ToastScope` and call `useScreenToast().show()`; AppFrame draws the window's one live region, so every toast is announced.
5. **Write the copy.** Use the glossary in section 70: Always ask and Automatic, AI credits, Sign in and Sign out, job and run. Say the consequence before the choice (P3). Mark every new string Proposed until the PM approves it. No em dash.
6. **Cover every state.** Loading (50), empty, error and offline (51), confirm or undo (52), consent (53). Then the floor: visible focus, labels on icon buttons, 4.5:1 text, 32px targets, reduced motion.
7. **Add it to the guide.** A section file in `guide/sections/`, its entry in `guide/catalog.jsx`, a partial in `design-md/`, a script line in `index.html`, and a ref in `guide/refs/` for every V2 value or string it quotes.
   - Names follow the catalog's contract (`guide/catalog.jsx:3-6`): the section file is `guide/sections/<group>-<id>.jsx` and calls `V2Guide.register('<id>', Component)`; the partial is `design-md/<number>-<id>.md` and starts with `## <number> <title>`.
   - A new kit part or screen also gets a row in the catalog's `kit` or `screens` array (name, file, stylesheet, status), which ds-check reads to prove it is on `window.V2Kit` or `window.V2Screens`.
8. **If it needs a new kit part.** One IIFE file `kit/<name>.jsx` that does `Object.assign(window.V2Kit, { Part })`, reads other parts lazily at render, `v2-` classes in a kit stylesheet, hover, focus, active, disabled, loading and error in CSS, tokens only, 300 lines at most.
9. **Run the checks.** `node tools/ds-check.js` to 0 errors and `node tools/build-design-md.js`. Then look at it in the guide by eye: the checks read files, not pixels.
10. **Merge into V2.** V2 here is a port of the PM's own source, so merge there. Load `tokens.css`, `kit/base.css`, `kit/motion.css` and the kit stylesheets you use, then the kit scripts after React and Babel and before the screens that use them. AppFrame holds the window's one toast region, so screens need no host of their own beyond ToastScope. Build the screen with `window.V2Kit` parts, delete the V2 code the matching recommendation in section 73 names, and keep V2's URL states working (section 72) so review links still open the right state.
11. **Close the loop.** Once it ships in V2, change the part's status to In V2, move its row out of Recommendations, and add a line to the changelog (section 77).

### Worked example: Pause daily runs

How section 62's pause row was built, step by step, so each step can be checked against a part that exists. Proposed copy throughout, as in section 62.

- **Job:** keep the partner in control (P4: every promise has a control). V2 promises "You can pause, stop, or disconnect anytime." (`blueai/worker_flow.jsx:67`) and has no control for it (R05).
- **State:** the record's `paused` field (null, or {until}), section 41. The WorkerCard, the top bar status chip and Settings all read it; `numbers()` gives the cost (`toGo`, `daysLeft`).
- **Place:** a row in Settings > Worker (section 62), a pushed screen; the change applies at once (section 55).
- **Parts:** `ListRow` "Daily runs" with a `Switch`. Turning it off opens a `Dialog` (task variant, md) with a `Select` "Pause until"; turning it on resumes at once. A `Toast` confirms each change, with no Undo: the dialog already asked, and turning the switch back on is the way back (section 52, rule 1: a choice that costs days is said and confirmed first; Undo is only for cheap actions that skip the question, rule 4).
- **Copy:** section 62 owns every string; the example only shows where each sits. The dialog title is the question ("Pause daily runs?"); the body says the cost in days from `numbers()` before the buttons; the Select says until when; the actions are Keep running and Pause (primary); a toast says what changed ("Daily runs paused.", "Daily runs are back on."); the row says until when and what it costs while paused.
- **States:** running daily (the switch on, the next run time); pause dialog open (the switch busy while it decides); paused until a date (the row says until when and what it costs); resumed.
- **Checks:** the switch is role=switch named "Daily runs"; dialog focus moves in and returns to the switch; the cost is in the dialog body, read before the buttons; ds-check to 0.

### Do / Don't

- **Do:** start from the Worker record and the job the feature serves; use a kit part as it is and pass props; say what a choice costs before the partner makes it; run ds-check before handing anything over.
- **Don't:** keep the worker's state inside a screen; restyle a kit part in the screen with inline colours; invent a synonym for a glossary word; edit DESIGN.md by hand (edit the partial and rebuild).
