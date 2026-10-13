## 75 Coverage

**Status:** Meta (no parts).

**Why:** What exists, and where each count comes from. The guide's section 75 counts everything live from the catalog (`guide/catalog.jsx`) and the refs, so its numbers never go stale; this partial does not copy them, because a typed count is wrong after the next change. It lists what is counted, in the same unit the live section uses, and every kit part and screen with its status.

| What | Counted from |
|---|---|
| Sections | the catalog's sections, one per partial in `design-md/` |
| Parts, by status (In V2, Changed from V2, New) | the parts each catalog section names |
| Kit components on window.V2Kit, by status | the catalog's `kit` rows: one row per component, never a bundle of names under one status, the same rows as the table below |
| Screens on window.V2Screens, by status | the catalog's `screens` rows |
| Shared screen helpers | the catalog's `helpers` rows |
| V2 references the checks prove | `node tools/ds-check.js` prints the number it checked ("refs: N checked") |
| Recommendations and decisions | section 73 (P1, P2 and P3 counts, and Decisions pending) |

Most parts are Changed on purpose: the system keeps what V2 does and changes how it looks, reads and behaves. The parts marked In V2 are the PM's copy register and the scene and review tools, which are not product.

### Kit and screens

| Part | File | Status |
|---|---|---|
| Icon | `kit/icons.jsx` | Changed from V2 |
| Button | `kit/button.jsx` | Changed from V2 |
| IconButton | `kit/button.jsx` | Changed from V2 |
| Link | `kit/button.jsx` | Changed from V2 |
| TextField | `kit/fields.jsx` | Changed from V2 |
| TextArea | `kit/fields.jsx` | Changed from V2 |
| Select | `kit/fields.jsx` | Changed from V2 |
| Switch | `kit/choice.jsx` | Changed from V2 |
| Checkbox | `kit/choice.jsx` | New |
| RadioCard | `kit/choice.jsx` | Changed from V2 |
| Segmented | `kit/choice.jsx` | Changed from V2 |
| Chip | `kit/choice.jsx` | Changed from V2 |
| Badge | `kit/display.jsx` | Changed from V2 |
| Avatar | `kit/display.jsx` | Changed from V2 |
| ListRow | `kit/display.jsx` | Changed from V2 |
| Card | `kit/display.jsx` | Changed from V2 |
| StatCard | `kit/display.jsx` | Changed from V2 |
| ProgressBar | `kit/progress.jsx` | Changed from V2 |
| Spinner | `kit/progress.jsx` | Changed from V2 |
| Skeleton | `kit/progress.jsx` | Changed from V2 |
| Banner | `kit/notice.jsx` | Changed from V2 |
| EmptyState | `kit/notice.jsx` | Changed from V2 |
| Scrim | `kit/dialog.jsx` | Changed from V2 |
| Dialog | `kit/dialog.jsx` | Changed from V2 |
| Sheet | `kit/dialog.jsx` | Changed from V2 |
| Menu | `kit/menu.jsx` | Changed from V2 |
| Popover | `kit/menu.jsx` | Changed from V2 |
| Tooltip | `kit/menu.jsx` | Changed from V2 |
| Toast | `kit/toast.jsx` | New |
| ToastHost | `kit/toast.jsx` | New |
| useToast | `kit/toast.jsx` | New |
| Tabs | `kit/tabs.jsx` | New |
| TabPanel | `kit/tabs.jsx` | New |
| AppFrame | `kit/shell.jsx` | Changed from V2 |
| TrayMenu | `kit/shell.jsx` | New |
| TopBar | `kit/topbar.jsx` | Changed from V2 |
| WorkerStatusChip | `kit/topbar.jsx` | New |
| BrandMark | `kit/topbar.jsx` | Changed from V2 |
| BottomNav | `kit/nav.jsx` | Changed from V2 |
| ScreenHeader | `kit/nav.jsx` | Changed from V2 |
| Splash | `kit/splash.jsx` | Changed from V2 |
| Thread | `kit/thread.jsx` | Changed from V2 |
| DaySeparator | `kit/thread.jsx` | New |
| JumpToLatest | `kit/thread.jsx` | New |
| MessageBubble | `kit/thread.jsx` | Changed from V2 |
| NoticeBubble | `kit/thread.jsx` | Changed from V2 |
| RunCard | `kit/run-card.jsx` | New |
| AskCard | `kit/ask.jsx` | Changed from V2 |
| FeedbackThumbs | `kit/ask.jsx` | Changed from V2 |
| DependencyCard | `kit/ask.jsx` | Changed from V2 |
| Composer | `kit/composer.jsx` | Changed from V2 |
| ComposerNotice | `kit/composer.jsx` | Changed from V2 |
| SendStop | `kit/composer.jsx` | Changed from V2 |
| workerFixtures | `kit/worker-data.jsx` | New |
| numbers | `kit/worker-data.jsx` | New |
| WorkerCard | `kit/worker-card.jsx` | Changed from V2 |
| CoachMark | `kit/worker-card.jsx` | Changed from V2 |
| StatusTick | `kit/program.jsx` | Changed from V2 |
| DayBar | `kit/program.jsx` | Changed from V2 |
| ProgramStrip | `kit/program.jsx` | Changed from V2 |
| ProgramSummary | `kit/program.jsx` | New |
| DayDone | `kit/day-done.jsx` | Changed from V2 |
| JobPreviewCard | `kit/job.jsx` | New |
| ModeRows | `kit/permissions.jsx` | Changed from V2 |
| ConsentDialog | `kit/permissions.jsx` | Changed from V2 |
| PermissionRequest | `kit/permissions.jsx` | New |
| CreditsChip | `kit/credits.jsx` | Changed from V2 |
| CreditsMeter | `kit/credits.jsx` | New |
| useCountdown | `kit/credits.jsx` | New |
| OutOfCreditsNotice | `kit/out-of-credits.jsx` | New |
| OOC_COPY | `kit/out-of-credits.jsx` | Changed from V2 |
| SettingsSection | `kit/settings.jsx` | Changed from V2 |
| AdvancedDisclosure | `kit/settings.jsx` | Changed from V2 |
| ByokPanel | `kit/advanced.jsx` | Changed from V2 |
| AiModePanel | `kit/advanced.jsx` | Changed from V2 |
| Home | `screens/home.jsx` | Changed from V2 |
| Activity | `screens/activity.jsx` | New |
| RunDetail | `screens/run-detail.jsx` | New |
| Notifications | `screens/notifications.jsx` | New |
| Chat | `screens/chat.jsx` | Changed from V2 |
| Settings | `screens/settings.jsx` | Changed from V2 |
| WorkerSettings | `screens/worker-settings.jsx` | New |
| ConnectedApps | `screens/connected-apps.jsx` | New |
| Account | `screens/account.jsx` | Changed from V2 |
| Help | `screens/help.jsx` | New |
| Credits | `screens/credits.jsx` | Changed from V2 |
| Welcome | `screens/welcome.jsx` | Changed from V2 |
| SignIn | `screens/sign-in.jsx` | Changed from V2 |
| SystemStates | `screens/system-states.jsx` | New |

Shared helpers on window.V2Screens that are not screens:

| Helper | File | Use |
|---|---|---|
| ScreenFrame / topBarProps | `screens/home.jsx` | The one frame for every signed-in screen (core, account, system states): topBarProps chip, scrollTo, openMenu, status/credits/nav overrides; every chrome event goes to onNavigate(id, opts). |
| ToastScope / useScreenToast | `screens/home.jsx` | Wrap a screen in ToastScope and call useScreenToast().show(); AppFrame draws the one live region. |
| ListSkeleton / LoadError / HomeSkeleton | `screens/home.jsx` | Loading and load-failed blocks for screens that read server data. |
| CONFIRM_COPY | `screens/settings.jsx` | One title, body, primary and failure title per destructive confirm (sign out, disconnect, leave, delete data). |
| useConfirmStep / ConfirmDialog / pendingBody | `screens/settings.jsx` | `useConfirmStep(forced) -> {busy, failed, run(done), reset()}`; `ConfirmDialog {copy, tone, step, preview, onCancel, onConfirm}`, the AlertDialog for one CONFIRM_COPY entry; `pendingBody(state, what, onRetry)`, the loading and error bodies (section 52). |
| rowTarget / reportAbout | `screens/activity.jsx, screens/help.jsx` | Where a ledger row opens; the about/topic a report opens with. |
| ConnectedAppRows | `screens/connected-apps.jsx` | The connected-account rows, reused by Settings. |
| accountStates / fixBlocked | `screens/connected-apps.jsx` | the record's YouTube and BlueStacks state, and a blocked run's one fix behaviour |
| ReportProblemSheet | `screens/help.jsx` | Report a problem; open it with about: {label, detail} to attach a run. |
| TermsSheet / TERMS_URL | `screens/welcome.jsx` | The Program Terms sheet (first run and update); reuse it, never a second sheet. |

### V2 shown live

Of the 47 window exports in the V2 files the guide loads, 27 render live as "V2 today": AccountGate, AgentPermissions, AiMode, BootSplash, BottomNavbar, Byok, ChatBubbles, ChatCompare, ChatFeedback, ChatHistory, CreditsPopupParts, HomeSkeleton, five Ico* icons, LoginModal, ModalOverlay, MoneyMaker, NeedsBluestacks, Profile, SignInPage, TermsSheet, Toggle, WorkerCards, WorkerDayDone. The guide also renders top-level components V2 declares without an export: SettingsScreen, AISettingsCard, BluestacksCard, TelegramCard.

Not live, and why:

- DesktopScene, DesktopToast, BrowserWindow, InstallDialog: scene, shown as V2 URL states because product-scene.css is not loaded (section 71).
- SiteKit, SiteSignIn: the site’s pages inside V2; sign-in is shown through SignInPage and URL states (section 56).
- MoneyMakerBackdrop, MoneyMakerHomeCard, MoneyMakerIcons, MoneyMakerLogo, MoneyMakerSteps, Shimmer: inner pieces of parts shown whole.
- WorkerFlow: data (the scripted conversation), quoted through refs.
- IcoArrowLeft, IcoBriefcase, IcoLightbulb, IcoPencilEdit, IcoPlusSmall, IcoTrashBin: replaced by the one named icon set (section 08).
- TopNavbar: dead code (section 76).
