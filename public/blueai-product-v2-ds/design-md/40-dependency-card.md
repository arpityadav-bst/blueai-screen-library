## 40 Dependency card

**Status:** Changed from V2.
**Why:** V2 answers in the thread when a task needs BlueStacks, with the fix as a button and the install inline (needs_bluestacks.jsx:77, 106): the right idea, kept. It is a fifth tinted surface with an opacity hover and a 3.24:1 button, and it never gates the worker (needs_bluestacks.jsx:40), which narrates App Player steps on PCs that do not have it (R13).

### DependencyCard (Changed from V2)
- **Purpose:** The reply where the question was when a run needs BlueStacks or App Player; also the worker's preflight before every run.
- **Anatomy:** An info NoticeBubble (white, 1px line, radius 16, width 300, info icon 16 blue-ink) with one line 14 ink-2, and under it a full-width Button md, or the shared ProgressBar 6 with label "Getting ready" and value "42%".
- **Variants (phase):** `needs` (Get BlueStacks, primary), `installing` (title "Installing BlueStacks" + ProgressBar), `done` (success notice "BlueStacks is ready."), `signedOut` (Open App Player, secondary).
- **Sizes:** 300 wide; button 36.
- **States:** As the phases. V2: `?start=worker&ask=Play%20Whiteout%20Survival%20for%2010%20min` (needs install), then Get BlueStacks (installing, done).
- **Props:** `DependencyCard {app, phase, progress (0 to 100), onGet, onOpen, className}`. The caller swaps the phase; the button is gone once installing (V2 hides it after one click).
- **Motion:** Progress fill moves with the shared ProgressBar transition; 3000ms install in the prototype.
- **Accessibility:** ProgressBar is role=progressbar with a value text; the button label says the fix; the notice's hidden "Info:" prefix keeps tone off colour alone.
- **Responsive:** Full bubble width at any window size.
- **Copy:** "This one runs inside BlueStacks App Player. I drive YouTube there, and BlueStacks isn’t installed on this PC yet.", "Get BlueStacks", "Getting ready", "BlueStacks is ready." are V2's. Proposed: "Installing BlueStacks", "App Player isn’t signed in to YouTube. Sign in there, then I’ll pick today’s run back up." / "Open App Player" (V2's only signed-out line, worker_flow.jsx:162, is a dead end).
- **Do / Don't:** Do answer in the thread with one button, and run the same check before every worker run. Don't open a modal for a missing dependency.
