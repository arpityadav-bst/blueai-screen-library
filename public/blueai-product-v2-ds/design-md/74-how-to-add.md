## 74 How to add a feature

**Status:** Meta (no parts).

**Why:** The system only pays off if the next feature is built from it. These are the steps from a new task to a screen merged into V2.

### From a new task to a screen in V2

1. **Name the job it serves.** One line: which of the three jobs in section 01 it serves, and which principle in section 02 it leans on. If it serves none, question the feature before designing it.
2. **Find its state in the Worker record.** Everything about the worker's day lives in one record (section 41). Name the fields the feature reads or writes and add them to the fixtures in `kit/worker-data.jsx`, never to a screen's local state, so no navigation can lose them (P1).
3. **Place it.** Pick the level from the navigation model in section 32: a tab, a pushed screen with Back, a sheet or a dialog. Check section 55 if it is a setting and section 54 if it has to reach a partner who is away.
4. **Compose it from the kit.** Use parts from Components, Shell, Chat, Worker and Credits. Each part's section lists its props, variants and states. Reach for a token, never a raw value. Add a kit part only when nothing fits (step 8).
5. **Write the copy.** Use the glossary in section 70: Always ask and Automatic, AI credits, Sign in and Sign out, job and run. Say the consequence before the choice (P3). Mark every new string Proposed until the PM approves it. No em dash.
6. **Cover every state.** Loading (50), empty, error and offline (51), confirm or undo (52), consent (53). Then the floor: visible focus, labels on icon buttons, 4.5:1 text, 32px targets, reduced motion.
7. **Add it to the guide.** A section file in `guide/sections/`, its entry in `guide/catalog.jsx`, a partial in `design-md/`, a script line in `index.html`, and a ref in `guide/refs/` for every V2 value or string it quotes.
8. **If it needs a new kit part.** One IIFE file `kit/<name>.jsx` that does `Object.assign(window.V2Kit, { Part })`, reads other parts lazily at render, `v2-` classes in a kit stylesheet, hover, focus, active, disabled, loading and error in CSS, tokens only, 300 lines at most.
9. **Run the checks.** `node tools/ds-check.js` to 0 errors and `node tools/build-design-md.js`. Then look at it in the guide by eye: the checks read files, not pixels.
10. **Merge into V2.** V2 here is a port of the PM's own source, so merge there. Load `tokens.css`, `kit/base.css`, `kit/motion.css` and the kit stylesheets you use, then the kit scripts after React and Babel and before the screens that use them. Build the screen with `window.V2Kit` parts, delete the V2 code the matching recommendation in section 73 names, and keep V2's URL states working (section 72) so review links still open the right state.
11. **Close the loop.** Once it ships in V2, change the part's status to In V2, move its row out of Recommendations, and add a line to the changelog (section 77).

### Worked example: Pause until tomorrow

Proposed copy throughout; it is here to show the steps, not to decide the feature.

- **Job:** keep the partner in control (P4: every promise has a control). V2 promises "You can pause, stop, or disconnect anytime." (`blueai/worker_flow.jsx:67`) and has no control for it (R05).
- **State:** the record's pause field: paused until a time, or not. The home WorkerCard, the top bar status chip and the tray all read it.
- **Place:** a row in Settings, Worker (section 62): a pushed screen, apply on change.
- **Parts:** ListRow with a Switch; a Dialog in its alert variant when pausing costs today's day; a Toast with Undo.
- **Copy:** confirm title "Pause today's run?", body "Today won't count toward your 20 days.", buttons Cancel and Pause.
- **States:** running (pause stops the run, so confirm), done today (no cost, no confirm), paused (Resume), offline (the change waits and says so).
- **Checks:** focus returns to the switch after the dialog; the switch has a visible label; ds-check to 0.

### Do / Don't

- **Do:** start from the Worker record and the job the feature serves; use a kit part as it is and pass props; say what a choice costs before the partner makes it; run ds-check before handing anything over.
- **Don't:** keep the worker's state inside a screen; restyle a kit part in the screen with inline colours; invent a synonym for a glossary word; edit DESIGN.md by hand (edit the partial and rebuild).
