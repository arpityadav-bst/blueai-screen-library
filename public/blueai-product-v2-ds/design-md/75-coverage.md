## 75 Coverage

**Status:** Meta (no parts).

**Why:** What exists, counted. The guide’s section 75 reads these live from the catalog; the figures below are as of 2026-10-13.

| What | Count |
|---|---|
| Sections in the catalog | 78 |
| Parts (in sections) | 123 (In V2 6, Changed 91, New 26) |
| Kit components (window.V2Kit) | 56 (In V2 0, Changed 48, New 8) |
| Screens (window.V2Screens) | 14 (In V2 0, Changed 7, New 7) |
| Shared screen helpers | 5 |
| V2 references the checks prove | 1406 |
| Recommendations for V2 | 50 (19 P1, 21 P2, 10 P3) and 13 decisions |

Most parts are Changed on purpose: the system keeps what V2 does and changes how it looks, reads and behaves. The six In V2 parts are the PM’s copy register and the scene and review tools, which are not product.

### Parts by group

| Group | Sections | Parts | Status |
|---|---|---|---|
| Start | 00-02 | 0 | Meta, no parts |
| Foundations | 03-10 | 21 | In V2 0, Changed 18, New 3 |
| Components | 11-28 | 31 | In V2 0, Changed 28, New 3 |
| Shell | 29-33 | 10 | In V2 0, Changed 8, New 2 |
| Chat | 34-40 | 13 | In V2 0, Changed 10, New 3 |
| Worker | 41-46 | 13 | In V2 0, Changed 9, New 4 |
| Credits and settings | 47-49 | 7 | In V2 0, Changed 5, New 2 |
| Patterns | 50-56 | 8 | In V2 0, Changed 7, New 1 |
| Screens | 57-69 | 13 | In V2 0, Changed 6, New 7 |
| Copy and voice | 70 | 2 | In V2 1, Changed 0, New 1 |
| Scene and review | 71-72 | 5 | In V2 5, Changed 0, New 0 |
| Meta | 73-77 | 0 | Meta, no parts |

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
| Toast / ToastHost / useToast | `kit/toast.jsx` | New |
| Tabs | `kit/tabs.jsx` | New |
| AppFrame | `kit/shell.jsx` | Changed from V2 |
| TrayMenu | `kit/shell.jsx` | New |
| TopBar | `kit/topbar.jsx` | Changed from V2 |
| WorkerStatusChip | `kit/topbar.jsx` | New |
| BrandMark | `kit/topbar.jsx` | Changed from V2 |
| BottomNav | `kit/nav.jsx` | Changed from V2 |
| ScreenHeader | `kit/nav.jsx` | Changed from V2 |
| Splash | `kit/splash.jsx` | Changed from V2 |
| Thread / DaySeparator / JumpToLatest | `kit/thread.jsx` | Changed from V2 |
| MessageBubble | `kit/thread.jsx` | Changed from V2 |
| NoticeBubble | `kit/thread.jsx` | Changed from V2 |
| RunCard | `kit/run-card.jsx` | New |
| AskCard | `kit/ask.jsx` | Changed from V2 |
| FeedbackThumbs | `kit/ask.jsx` | Changed from V2 |
| DependencyCard | `kit/ask.jsx` | Changed from V2 |
| Composer / ComposerNotice / SendStop | `kit/composer.jsx` | Changed from V2 |
| workerFixtures / numbers | `kit/worker-data.jsx` | New |
| WorkerCard / CoachMark | `kit/worker-card.jsx` | Changed from V2 |
| StatusTick / DayBar / ProgramStrip / ProgramSummary | `kit/program.jsx` | Changed from V2 |
| DayDone | `kit/day-done.jsx` | Changed from V2 |
| JobPreviewCard | `kit/job.jsx` | New |
| ModeRows / ConsentDialog / PermissionRequest | `kit/permissions.jsx` | Changed from V2 |
| CreditsChip / CreditsMeter / useCountdown | `kit/credits.jsx` | Changed from V2 |
| OutOfCreditsDialog / OutOfCreditsNotice | `kit/out-of-credits.jsx` | Changed from V2 |
| SettingsSection / AdvancedDisclosure | `kit/settings.jsx` | Changed from V2 |
| ByokPanel / AiModePanel | `kit/advanced.jsx` | Changed from V2 |
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
| ScreenFrame / topBarProps | `screens/home.jsx` | The product frame for a screen; topBarProps(worker) gives every screen the same top bar and status chip. |
| AccountFrame | `screens/settings.jsx` | ScreenFrame plus scrollTo, openMenu and onAction for the Settings family; reads topBarProps. |
| ConnectedAppRows | `screens/connected-apps.jsx` | The connected-account rows, reused by Settings. |
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
