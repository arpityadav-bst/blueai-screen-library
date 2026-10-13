## 51 Errors and offline

**Status:** Changed from V2 (error scopes); New (offline).

**Why:** V2 designed only its scripted failures: the run that fails (`worker_flow.jsx:132`, red bubble `chat_bubbles.jsx:88`, then Retry and Not now) and three AI-mode banners (`ai_mode.jsx:169, 205`). A failed save, a rejected field, a screen that cannot load, a lost connection and a service outage have no place and no words. Nothing checks connectivity, and a scheduled run that silently fails to start costs a counted day.

### Error scopes (Changed from V2)

- **Purpose:** an error goes where its scope is; every message says what happened, what it means for today, and the one next step.
- **Anatomy (scope: where it goes):**
  1. Field: message under the field (TextField `error`), red border plus 3px ring. Never a toast.
  2. Action: Toast error with Try again (assertive; with its action it stays until Dismiss, Try again, the next toast, or the screen calls `dismiss()` on leaving, section 24).
  3. Section: Banner danger at the top of the section (V2's AI-mode banners, kept word for word).
  4. Run: RunCard failed and WorkerCard failed, with the deadline and Try again ("Today’s job didn’t finish. Try again by 9 pm to count the day.").
  5. Screen: EmptyState error in the content band; top bar and nav stay (SystemStates `error`). A list screen that failed to load uses `V2Screens.LoadError {what, onRetry, busy}` ("Couldn’t load your notifications" / "Nothing is lost: your runs and days are not affected. Try again in a moment." + Try again), as Activity, Run detail, Notifications and AI credits do; Settings, Worker settings, Connected apps and Account reach it through `V2Screens.pendingBody`.
  6. App: offline banner under the top bar (below); a full state only when nothing is cached.
- **Variants:** the six scopes.
- **Sizes:** inherits each part's size.
- **States:** shown, retrying (the button loads), recovered (the message goes; a toast only if the partner acted).
- **Props:** none of its own; see TextField, Toast, Banner, RunCard, EmptyState.
- **Motion:** inherits each part (toast rise 180 ms; banner and card appear in place).
- **Accessibility:** field messages and danger banners are `role=alert`; toasts announce through the ToastHost live region; error text is danger ink 5.36:1 or ink on a tint.
- **Responsive:** fits the column at any width.
- **Do / Don't:** Do say what it means for today's run or the 20 days; name the next step for what it does (Try again, Switch account); keep the partner's input. Don't show codes; don't use a toast for a field or a full screen for a section; don't stop at "Something went wrong". Use Try again everywhere (V2 also says Retry, `worker_flow.jsx:127`, PM copy, flagged).

### Offline (New)

- **Purpose:** losing the connection shows at once, says what will not happen today, and recovers by itself.
- **Anatomy:** Banner tone `offline` (neutral fill, wifi-off icon, ink words) sticky under the top bar (`--v2-z-sticky`). `V2Screens.ScreenFrame` draws it whenever the record says `online: false`, on every signed-in screen but Home, so no screen builds its own; the top bar's WorkerStatusChip says `offline`. In Chat the Composer locks with the neutral placeholder every locked composer uses, `disabledReason` "You can’t send messages right now" (section 38), and the offline ComposerNotice above it says why and until when. On Home the WorkerCard `offline` says it instead, and its Try again reconnects in place (Home `onReconnect`, `screens/home.jsx:251-256`).
- **Variants (proposed copy):** offline: "You’re offline" / "Today’s run starts when you’re back online." + Try again. Reconnecting: "Reconnecting…". Back online: Toast success "You’re back online." Service down: "BlueAI can’t reach its service" / "This is on our side, not your PC. Today’s run starts as soon as it’s back."
- **Sizes:** full column width.
- **States:** offline, reconnecting (checks every 30 s and at once on Try again), back online, service down.
- **Props:** none on a screen: ScreenFrame reads `worker.online`. The Banner it draws is `{tone: 'offline', title, action}`; Chat passes the Composer `disabledReason` and the notice.
- **Motion:** the banner appears in place; the recovery toast rises 180 ms.
- **Accessibility:** banner `role=status`; the composer's placeholder is the neutral reason and the notice says the cause, so the field is disabled, not hidden, and described by the notice.
- **Responsive:** the banner stays pinned while the content band scrolls (compact 640 too).
- **Do / Don't:** Do show it as soon as it is known and keep it until it ends; start the missed run when the connection returns. Don't blank the window; don't ask the partner to restart BlueAI; don't blame the partner's connection for a service outage.
