# BlueAI PM — Design System

**BlueAI** is an AI-powered worker platform built by **BlueStacks / now.gg**. It allows users to control their BlueStacks Android App Player through natural language commands, manage AI-driven skills, accept paid jobs, and schedule recurring automation tasks. The product ships as both a **web application** and an **Electron desktop app**.

---

## Sources

- **Frontend codebase**: Attached as `frontend/` (read-only mount via File System Access API). React 19, TypeScript, Tailwind CSS v4, TanStack Router, Firebase.
- No Figma link was provided. All design tokens and patterns extracted directly from source code.
- No slide deck provided.

---

## Products / Surfaces

| Surface | Description |
|---|---|
| **Web App / Desktop App** | Main product UI — chat, jobs, skills, schedule, wallet, settings, profile |
| **Electron wrapper** | Extends the web app with native AI execution, agent control, nowgg sign-in |

---

## CONTENT FUNDAMENTALS

### Tone & Voice
- **Direct, functional, friendly.** The product talks to workers completing tasks — copy is plain and action-oriented.
- Uses **"you"** (second person) consistently: "You don't have enough credits", "Your scheduled tasks will appear here".
- **No first-person "I"** in UI copy (the AI assistant says "I'm BlueAI…" in the chat intro, but that is the agent speaking).
- **Sentence case** throughout — headings, buttons, labels all use sentence case (not Title Case or ALL CAPS), except short abbreviations like "BCX", "ENGG", "Admin".
- **No emoji** in the main product UI. The sole exception is the login screen's promotional line: "Get up to ✦ 300 AI Credits on your first login." (using ✦ as a decorative accent, not a true emoji).
- **Action-oriented CTAs**: "Submit Task", "Start New Chat", "Accept Job", "Create Schedule", "Manage".
- **Neutral error messages**: Errors reference the problem and a remedy, no blame. E.g. "Failed to create job. An error occurred while creating the job."
- **Concise labels**: Nav items are single words — "Chat", "Jobs", "Skills", "Schedule", "Wallet".

### Casing Rules
| Context | Rule | Example |
|---|---|---|
| Page headings | Sentence case | "Manage Skills", "Scheduled Tasks" |
| Navigation | Sentence case | "Chat History", "Report Issue" |
| Buttons | Sentence case | "Start new chat", "+ New" |
| Status badges | Lowercase / capitalize first | "assigned", "in-progress", "Completed" |
| Error codes | ALL_CAPS (API level only) | `MISSING_SKILL_NAME` |

### Copy Patterns
- **Empty states**: Two-line pattern — bold summary + soft description. "No active jobs available / Check back later for new job assignments."
- **Loading states**: Minimalist — "Loading…", "Loading jobs…", "Fetching details…"
- **Validation errors**: Inline, plain language. "Budget must be a whole number greater than 0."
- **Currency**: BCX (BlueStacks Credits). Written as `{amount} BCX`.

---

## VISUAL FOUNDATIONS

### Color System

**Primary brand gradient** (logo text, credits button, sign-in buttons):
`from-[#0EA4C5] to-[#7B4CFF]` — cyan → purple

**Accent (interactive primary)**: `#1990FF` — the Tailwind `--color-accent` custom property. Used for primary buttons, send button, search icon, input focus border.

**Indigo (secondary interactive)**: Tailwind `indigo-*` scale. `indigo-600` (#4F46E5) is the main interactive hue for cards, nav hover states, skill/job action buttons, overview icon backgrounds.

**Neutrals**: Tailwind `gray-*` and `slate-*`. Card borders are `slate-200`; body text is `gray-900`; secondary text is `gray-600`; tertiary is `gray-500`; backgrounds are `white` or `gray-50`.

**Semantic / status colors**:
| Semantic | Tailwind | Use |
|---|---|---|
| Success | `green-*` / `emerald-*` | Job completed, success button |
| Warning | `amber-*` | Credit warnings, await-input messages |
| Danger | `rose-*` / `red-*` | Danger button, failed jobs, error messages |
| Info / in-progress | `blue-*` | In-progress job badge, agent started |
| Scheduled | `purple-*` | Scheduled tasks, calendar icon bg |
| Jobs / available | `orange-*` | Jobs overview card icon bg |

**Dashboard CTA gradient**: `from-indigo-600 to-purple-600` — used for the "Start a Chat" hero band. Solid fill on important inline CTA elements. Hover darkens: `hover:from-indigo-700 hover:to-purple-700`.

### Typography

**Font family**: SF Pro Display / SF Pro (`-apple-system, BlinkMacSystemFont, sans-serif`). This is Apple's system font — it renders natively on macOS/iOS. On other platforms it falls back to the OS default. *This design system substitutes **Plus Jakarta Sans** from Google Fonts as the closest cross-platform match; see flag below.*

**Type scale** (Tailwind):
| Role | Class | Size |
|---|---|---|
| Display / brand | `text-2xl font-bold` | 24px |
| Page heading (H1) | `text-xl font-bold text-gray-900` | 20px |
| Section heading (H2) | `text-xl font-bold text-gray-900` | 20px |
| Card title (H3) | `text-xl font-bold text-gray-900` | 20px |
| Sub-heading | `text-lg font-semibold text-gray-900` | 18px |
| Body | `text-sm text-gray-600` | 14px |
| Small / label | `text-xs text-gray-600 font-medium` | 12px |
| Micro / timestamp | `text-[11px]` | 11px |

**Weight**: `font-bold` (700) for headings, `font-semibold` (600) for sub-headings and button text, `font-medium` (500) for labels/nav items, normal (400) for body.

### Spacing & Layout

- **Content area padding**: `p-4 sm:p-6 md:p-8` — scales up with viewport.
- **Navbar height**: Fixed top bar, ~`py-3` + logo = ~56px.
- **Card gap**: `gap-3` or `gap-4` in grids.
- **Section gap**: `mb-8` between major sections.
- **Component inner padding**: `p-4` (compact cards), `p-6` (standard cards), `p-8` (empty-state cards).

### Corner Radii
| Element | Class | Radius |
|---|---|---|
| Cards | `rounded-xl` | 12px |
| Modals | `rounded-xl` | 12px |
| Buttons (primary) | `rounded-lg` | 8px |
| Inputs (standard) | `rounded-lg` | 8px |
| Inputs (pill/search) | `rounded-full` | 9999px |
| Chat input | `rounded-2xl` | 16px |
| Chat bubbles | `rounded-2xl` | 16px |
| Status badges | `rounded-sm` | 2px |
| Pill badges | `rounded-full` | 9999px |
| Credits button | `rounded-3xl` | 24px |
| Icon containers | `rounded-lg` | 8px |
| Avatar | `rounded-full` | 9999px |

### Shadows
| Level | Class | Use |
|---|---|---|
| Base | `shadow-sm` | Default cards |
| Hover | `shadow-md` | Card hover, modal |
| Large | `shadow-xl` | Modals, overlays |
| Colored | `shadow-indigo-500/20` | User chat bubbles |

### Backgrounds
- **Page background**: `bg-white` with `overflow-x: hidden` on root
- **Chat message area**: `bg-gradient-to-b from-gray-50/50 to-white` — subtle top-to-bottom fade
- **Empty state sections**: `bg-gray-50`
- **Icon containers on cards**: `bg-indigo-600`, `bg-green-500`, `bg-orange-500`, `bg-purple-500`
- **No full-bleed imagery**, no repeating patterns, no textures — clean white surfaces

### Borders
- Cards: `border border-slate-200`
- Inputs: `border border-gray-200` or `border border-blue-400` (chat input focused)
- Modals: Sticky header has `border-b border-gray-200`
- Nav: `border-b-2 border-slate-200`

### Animations & Transitions
- **Standard transition**: `transition-all duration-200`
- **Press state**: `active:scale-95` on buttons; `disabled:active:scale-100` cancels it
- **Hover lift**: `hover:shadow-md` on cards
- **Hover border change**: `hover:border-indigo-300`
- **Hover bg tint**: `hover:bg-indigo-50/30` or `hover:bg-gray-50`
- **Spinner**: `animate-spin` (Tailwind) — used for loading states
- **Reverse spin**: Custom `animate-spin-reverse` (0.6s linear) — used in refresh animations
- **No bounce, no elastic, no page transitions** — clean, utilitarian micro-interactions

### Hover & Press States
- **Buttons**: Background darkens or bg-tint added; `active:scale-95` shrinks slightly on press
- **Nav menu items**: `hover:bg-indigo-50 hover:text-indigo-600`
- **Cards**: `hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50/30`
- **Text links**: `hover:text-indigo-700`

### Imagery & Illustration
- No decorative illustrations or full-bleed images in the current product.
- Functional status icons only: `CheckmarkGreen.svg`, `Warning.svg`, `WarningOrange.svg`.
- `BlueStacks.png` — BlueStacks logo used in settings.
- `Browser.svg` — browser icon used in settings.
- `Logo.png` — the BlueAI app logo (h-8 w-8 in navbar).

### Scrollbar Style
Custom thin scrollbar (`scrollbar-width: thin`), slate-200 track, rgba(0,0,0,0.25) thumb, 8px width, 4px border-radius on thumb.

### Iconography
See **ICONOGRAPHY** section below.

### Use of Transparency / Blur
- Overlay backdrops: `bg-black/50` (modals)
- White overlay on terminated chat session: `bg-white/60` (soft screen)
- Gradient button bg at 20% opacity: `bg-white/20` (icon container inside gradient band)
- Credits button inner: `bg-white` inside a gradient-bordered pill
- No backdrop-blur in current codebase

---

## ICONOGRAPHY

### System
BlueAI uses **custom inline SVG icons** — all stroke-based, 24×24 viewBox, `strokeWidth={2}`, `strokeLinecap="round"`, `strokeLinejoin="round"`. They follow the Heroicons v2 design language (outline style).

Icons are defined in `frontend/src/components/common/Icons.tsx` and used via named exports throughout the app.

### Icon List
| Name | Usage |
|---|---|
| `ChevronDownIcon` | Dropdowns, accordion toggles |
| `SendIcon` | Chat send button (special: filled #1990FF circle) |
| `StopIcon` | Agent stop button (special: filled gray circle + stop square) |
| `ThreeDotIcon` | Vertical ellipsis / overflow menu |
| `HamburgerIcon` | Mobile menu (legacy, replaced by ThreeDot) |
| `TrashIcon` | Delete action |
| `EditIcon` | Edit / pencil action |
| `UserIcon` | Filled user silhouette |
| `ProfileIcon` | Outlined user / profile |
| `LightningIcon` | Quick action / automation |
| `CalendarIcon` | Scheduled tasks |
| `BriefcaseIcon` | Jobs |
| `CoinIcon` | Payment / credits |
| `CheckCircleIcon` | Success / tasks done |
| `WalletIcon` | Wallet / payment |
| `LightbulbIcon` | Skills |
| `SettingsIcon` | Gear / settings |
| `ChatIcon` | Chat / messaging |
| `ExternalLinkIcon` | Open external URL |
| `DownloadIcon` | Download |
| `SearchIcon` | Search |
| `RefreshIcon` | Refresh / reload |

### CDN Availability
Icons are hand-authored inline SVGs. The design system follows the **Heroicons outline** style — if CDN icons are needed, use [Heroicons](https://heroicons.com/) (v2, outline set).

### Special Icons (non-standard)
- **SendIcon** (`Credits.svg` adjacent): Blue circle (#1990FF) with arrow path — not a standard Heroicon. Defined inline in Icons.tsx.
- **StopIcon**: Gray bordered circle with a rounded-rectangle stop shape. Defined inline.
- **Credits.svg**: A star/credit currency icon — part of the credits button UI. Stored in `assets/Credits.svg`.

### Emoji
No emoji used in production UI. The login promo uses `✦` (unicode FOUR POINTED BLACK STAR, U+2726) as a decorative glyph.

---

## File Index

```
/
├── README.md                  ← This file
├── SKILL.md                   ← Claude Code skill descriptor
├── colors_and_type.css        ← Design tokens as CSS custom properties
├── assets/
│   ├── Logo.png               ← BlueAI app logo (32×32 in navbar)
│   ├── BlueStacks.png         ← BlueStacks brand logo
│   ├── Credits.svg            ← AI Credits currency icon
│   ├── Browser.svg            ← Browser icon (settings)
│   ├── CheckmarkGreen.svg     ← Success checkmark
│   ├── Warning.svg            ← Warning icon
│   └── WarningOrange.svg      ← Orange warning icon
├── preview/                   ← Design system card previews (Design System tab)
│   ├── 01-brand-colors.html
│   ├── 02-semantic-colors.html
│   ├── 03-gradients.html
│   ├── 04-type-scale.html
│   ├── 05-type-specimens.html
│   ├── 06-spacing-radius.html
│   ├── 07-shadows.html
│   ├── 08-buttons.html
│   ├── 09-badges-status.html
│   ├── 10-cards.html
│   ├── 11-inputs.html
│   ├── 12-nav.html
│   ├── 13-chat-bubbles.html
│   ├── 14-overview-cards.html
│   ├── 15-icons.html
│   └── 16-credits-button.html
└── ui_kits/
    └── webapp/
        ├── README.md
        ├── index.html         ← Full interactive UI prototype
        ├── Navbar.jsx
        ├── Dashboard.jsx
        ├── Chat.jsx
        ├── Jobs.jsx
        └── Skills.jsx
```

---

## Font Substitution Notice

⚠️ **SF Pro is not available on Google Fonts.** The production app uses `-apple-system, BlinkMacSystemFont, sans-serif` (SF Pro on Apple devices). This design system uses **Plus Jakarta Sans** from Google Fonts as the closest cross-platform substitute (geometric humanist sans, similar weight/character). For pixel-perfect fidelity on macOS/iOS, use the system font stack directly in production code.
