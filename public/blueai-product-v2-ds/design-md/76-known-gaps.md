## 76 Known gaps

**Status:** Meta (no parts).

**Why:** A system is only trustworthy if it says what it cannot prove. These are the limits of the guide and its checks, the open items the build left for the part that owns them, and the V2 code that is not a source.

### What the guide cannot catch

- **How it looks:** Nothing here takes screenshots, by design. ds-check reads files, not pixels; layout, spacing and stroke weight are checked by eye in this guide.
- **Contrast over real pixels:** Ratios are computed from token pairs. Text over an image, a gradient or a blur is not measured.
- **V2 without Tailwind:** V2 loads the Tailwind CDN; this page does not (R26). Live V2 parts sit in a v2-preflight wrapper whose scoped reset mirrors Tailwind’s preflight, but V2’s few Tailwind utility classes (worker_cards.jsx) do nothing here.
- **V2’s own style block:** V2 index.html’s keyframes and ba-* classes are copied into guide/v2-live.css so live parts animate. If V2 changes that block, re-copy it; no check compares them.
- **Scene styles:** product-scene.css is not loaded, so the desktop, the Windows toast and the install dialog are shown as V2 URL states in a frame, not live.
- **URL states and localStorage:** Some V2 states read localStorage (the consent record, the mode per app, sign-in). A framed state can open on what an earlier visit stored rather than what its URL says. Open it in a private window to be sure.
- **Shared V2 stores on this page:** Live parts share V2’s in-page stores: section 46’s specimens set the AgentPermissions mode, which chat’s AutoRibbon (section 38) then shows as Automatic. Use section 46’s Reset.
- **V2 modal markup:** The live V2 TermsSheet (section 26) renders V2’s own role=dialog aria-modal markup, so a screen reader may treat the rest of the guide as inert while it is mounted.
- **What a ref proves:** A ref proves a piece of text is still on its V2 line. It does not prove V2 renders it, or renders it the way the guide describes.
- **Recommendation wording:** Each recommendation’s V2 location is proved, and so is every string its “today” text quotes exactly. Paraphrases are the architect’s reading of V2 and are not machine-checked.

### Open items

Each is a small change in one place; none blocks reading or using the system.

| Area | Item | Closes it |
|---|---|---|
| Kit | JobPreviewCard receipt always shows “Ask me first next time”; it should only show when the job ran on Automatic (section 59 flags it). | worker kit |
| Kit | WorkerStatusChip has no out-of-credits status; ScreenFrame maps it to paused with “Waiting for credits” (proposed). | shell kit |
| Kit | RunCard’s out-of-credits line and the composer’s disabled reason should read from OutOfCreditsNotice (OOC_COPY and creditsTime.formatClock) so every zero moment says the same time. | chat kit |
| Kit | credits.refillAt in the Worker fixtures is a display string, so the countdown falls back to the next 00:00 UTC. Store a time. | worker kit |
| Kit | TopBar passes balance and state to CreditsChip but not runCost, so “low” shows only when state is passed. | shell kit |
| Kit | Banner has no neutral tone (the AI mode heads-up uses offline) and the offline tone has no rule of its own. | display kit |
| Kit | SettingsSection runs ListRows to the card edge but not ModeRows; screens/account.css works around it. | credits kit |
| Kit | The icon set has eye but no eye-off; the secret field shows its state with aria-pressed and a wash. | foundations |
| Kit | Numbered step discs and the one-serif-word title live in screens/entry.css; promote them if Help or ProgramSummary needs them. | display kit |
| Kit | AppFrame does not mount ToastHost; screens that toast draw their own host. Mount one ToastHost per window when V2 adopts the kit. | shell kit |
| Screens | Two frame helpers, ScreenFrame and AccountFrame (both read topBarProps). Merge them. | screens |
| Screens | The Notifications unread count has no place in the chrome (More carries no badge). | section 54 |
| Screens | The app router must map “report” to ReportProblemSheet; Activity’s rejected day and a failed RunCard should open it with the run attached. | screens |
| Data | The Worker record has no run date, BlueStacks or App Player preflight result, or Telegram link state; screens take them as props. | worker kit |
| Data | Only one account fixture: the account gate hard-codes a second address in two screens. Add an other-account fixture. | worker kit |
| Data | One real dashboard URL for Earnings (R29); the FAQ link is a stand-in next to it. | product team |
| Product | Welcome has no “signed out after a session” variant that says the worker is paused. | entry patterns |
| Product | “BlueAI starts with Windows into the tray” (section 29) needs a switch in Settings, Worker. | PM |
| Copy | Every string marked Proposed in DESIGN.md waits for the PM; decisions D1 to D13 wait for the PM and legal (section 73). | PM |

### Dead code in V2 (not a source)

About 3,000 of V2’s lines never render. They are listed here and never specimened as product, because building from them would bring back what V2 already left behind.

| V2 file | What it is |
|---|---|
| `credits_widget.jsx` | Hidden earn-credits sheet: invisible focus stops, writes localStorage, the abandoned violet language (R41). |
| `skills.jsx, chat.jsx` | Unreachable screens. |
| `tweaks-panel.jsx (both copies)` | Review tooling, not product. |
| `shared.jsx:84-298 (TopNavbar, compact BottomNavbar)` | Never rendered. |
| `login.jsx:88-223` | Three LoginModal variants no path opens. |
| `chat_compare.jsx` | Except IntroCard and ChatCatIcon, which move into the chat module first. |
| `product_home.jsx, onboarding.jsx` | ProductHome and OnboardingWelcome; the Onboarding and Default sessions retire. |
| `credits-popup-options.html, credits_page_options.jsx, credits_popup_frame.jsx, credits_popup_options.jsx` | The credits comparison pages. The shipping popup content (credits_popup_parts.jsx) is a source. |

### Live in V2, fenced out of the product system

| V2 file | Why it is fenced |
|---|---|
| `chat_product.jsx, jobs.jsx, schedule.jsx` | Live in V2 but not loaded on this page: the chat screen needs the whole app; Jobs and Schedule retire (R04, R50). |
| `product-scene.css, desktop_scene.jsx, desktop_toast.jsx chrome, browser_window.jsx` | The fake Windows desktop: scene, fenced out of product tokens (section 71). |
| `install_dialog.jsx skin` | BlueStacks’ installer look, not BlueAI’s. |
| `site_kit.jsx, site_signin.jsx, signin_page.jsx` | The site and Google pages inside V2: the site’s language, used as the family reference. |
| `index.html:867-1237` | The dark Preview panel: review tooling (section 72). |
