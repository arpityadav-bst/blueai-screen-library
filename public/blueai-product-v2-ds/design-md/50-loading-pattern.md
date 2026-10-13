## 50 Loading

**Status:** Changed from V2.

**Why:** V2 stages its cold start (splash until 2650 ms, then an 850 ms skeleton, `boot_splash.jsx:31-33`, `index.html:745`), but the skeleton is the retired category list, the splash replays on every window open, and no button has a loading state, so Agree and continue, I agree, turn on, Validate & Save and Save settings can each be pressed twice while their work is in flight. A partner waiting on a consent or a save must see that it is happening, and fast work must never flash.

### Loading by duration (Changed from V2)

- **Purpose:** what the partner sees while waiting, chosen by how long the wait is.
- **Anatomy:** no new part. The rule picks between the kit's Spinner, Skeleton, Button `loading`, Banner and the run's own cards.
- **Variants (by wait):**
  - under 300 ms: nothing. Spinner waits 300 ms before it appears and holds its space meanwhile.
  - 300 ms to 2 s: a Spinner 16 inside the control that started it (label kept, clicks ignored, `aria-busy`), or a Skeleton composite in the shape of what arrives (the worker home: a 40 circle and two lines in a Card, then a Card of three lines).
  - over 2 s: say what is happening in words beside the spinner ("Checking that this account is in the program.", proposed copy).
  - over 10 s: say it is still going and give the way out: keep going in the background, or Cancel (Banner info: "Still checking your key" / "This is taking longer than usual." + Cancel, proposed copy).
  - a run (minutes): never block. The RunCard, the WorkerCard and the top bar's WorkerStatusChip carry it; the partner can leave.
- **Sizes:** Spinner 16 in buttons and inline, 32 alone (sign-in). Skeletons take the size of the content they stand for.
- **States:** cold start (Splash, section 33, true cold start only), screen (skeleton), action (button loading), background run.
- **Props:** none of its own. Use `Button loading`, `Spinner {size, delay, label}`, `Skeleton {shape, width, height, lines}`. A list screen's default loading block is `V2Screens.ListSkeleton {rows, label}` (Activity, Run detail, Notifications, AI credits), and Home's is `V2Screens.HomeSkeleton`, both in `screens/home.jsx` with their styles in `screens/core.css`. When the data does not arrive, the same screens show `V2Screens.LoadError` ("Couldn’t load <what>" / "Nothing is lost: your runs and days are not affected. Try again in a moment." + Try again, section 51).
- **Motion:** spinner `--v2-dur-spin` 800 ms linear; skeleton shimmer `--v2-dur-shimmer` 1400 ms. Under reduced motion the shimmer stops and the spinner turns at half speed.
- **Accessibility:** a loading button keeps its name and sets `aria-busy`; a standalone spinner with a label is `role=status`; skeletons are `aria-hidden`; a waiting caveat is ink-3 (6.0:1), not V2's `#94a3b8` (2.56:1, `chat_bubbles.jsx:124`).
- **Responsive:** skeletons follow the column width; nothing is fixed to 419.
- **Do / Don't:** Do keep the label in a loading button; draw skeletons in the shape of what replaces them; say what is happening after 2 s. Don't flash a spinner for work under 300 ms; don't block the window while a run plays; don't let a consent or save be pressed twice.
