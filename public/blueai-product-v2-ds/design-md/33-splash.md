## 33 Splash and cold start

**Status:** Splash: Changed from V2.

**Why:** A partner opens BlueAI most days to check one run. V2's splash says "Loading your skills…" (boot_splash.jsx:25), naming a feature the partner never sees, puts its status in #94a3b8 at 2.56:1 (boot_splash.jsx:73), bounces its dots with no reduced-motion rule (boot_splash.jsx:66), and replays for about 3.5 s every time the window opens (2650 ms, boot_splash.jsx:33, plus an 850 ms skeleton, index.html:735).

### Splash (Changed from V2)

**Purpose.** A short branded launch on a true cold start (the app process starting), in words that say what the app is doing.

**Anatomy.** Centred on the surface: BrandMark stacked (logo 48, wordmark 24/600 in the brand gradient), three 6px blue dots, one status line 13/400 in ink-3.

**Variants.** Cold start only. Reopening the window from the tray, taskbar or a notification restores the last screen at once, with no splash.

**Sizes.** Fills the frame (absolute, inset 0), above every overlay (`--v2-z-splash`, 200). Dots 6, gap 6, 40 below the brand; status 12 below the dots.

**States.**

| Moment | V2 today | System |
|---|---|---|
| Message 1 | 0 ms "Starting BlueAI…" (boot_splash.jsx:24) | 0 ms "Starting BlueAI…" (kept) |
| Message 2 | 1050 ms "Loading your skills…" | 600 ms "Checking today's run…" (proposed copy), signed in only |
| Fading | from 2150 ms, 500 ms ease | from 900 ms, 320 ms `--v2-ease-in` |
| Content | about 3.5 s | about 1.2 s; then the worker-home skeleton only while the record loads |
| Reduced motion | dots bounce forever | static dots, no fade, done at 900 ms |

V2: every page load and every window reopen shows it. The real app calls `onDone` when the Worker record has loaded, never later than this budget plus the skeleton.

**Props.** `Splash { messages = SPLASH_MESSAGES, onDone, coldStart = true, state, reduced }`. `coldStart: false` renders nothing and calls `onDone` at once. `state` ('message-1' | 'message-2' | 'fading') and `reduced` freeze a state for guide specimens.

**Motion.** Dots: `v2-pulse` over `--v2-dur-pulse` (1200 ms), staggered by a sixth; they loop only while the splash is up (about a second). Fade: opacity over `--v2-dur-4`. Both stop under `prefers-reduced-motion`.

**Accessibility.** The status line is `role="status"`, so each message is announced once; the splash is `aria-busy` until it fades. Status ink-3 is 6.0:1. The wordmark is a logo (exempt from contrast).

**Responsive.** Centred at both window heights.

**Do / Don't.** Do show it only when the process starts. Do hand over to the skeleton if loading takes longer. Don't replay it on reopen. Don't name features or versions in the status line. Don't loop the dots under reduced motion.
