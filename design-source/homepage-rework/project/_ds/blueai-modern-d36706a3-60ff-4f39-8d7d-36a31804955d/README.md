# BlueAI Design System

BlueAI is the AI assistant built into **BlueStacks App Player** — the desktop platform that lets users run Android apps and games on a PC. BlueAI lives in a slim right-side panel (294×593) and acts as a co-pilot for the emulator: it can teach new *Skills*, take *Jobs* (to earn rewards), *Schedule* automations, run pre-canned actions ("✦ Search for racing games on Play Store", "✦ Play Whiteout Survival for 10 minutes"), and chat like a normal assistant. Credits ("4.9k") are the gamified token shown in the header.

The system the current Figma ships is a single-product in-app panel with four primary surfaces:

1. **Dashboard** — welcome state; feature cards grid (Skills / Jobs / Schedule / Personalize) + suggested actions + "New Chat" CTA
2. **Chat Home** — empty chat with suggested actions and the prompt window docked at bottom
3. **Explore & Chat** — hybrid: feature pills + suggested actions stacked above the prompt window
4. **Chat UI** — conversation state; the current task title is pinned in the header with a "New" pill CTA, message bubbles render as a radiused 12/12/128/12 speech shape, and the composer sits at the bottom

## Sources given

- **Figma:** `BlueAI.fig` — 1 page `BlueAI`, 1 top-level frame `New UX` (node `1:942`). Contains 6 local symbols (`TypeChatHome`, `TypeChatUI`, `TypeDashboard`, `TypeExploreChat`, `TypeHome`, `TypeHomeList`) and 17 page-scoped library externals (`BAILogo`, `CreditsIcon`, `StateDefaultTypePrimary`, `SizesLarge`, `_Label`, `TypeFeatureCardStateDefault`, `TypeChat`, `Property1Variant2` = BlueAI wordmark, `Property1Default` = prompt/composer layout, plus icon symbols `16px/Menu`, `16px/RightArrow`, `12px/Add`, `12px/Caret Down`, `20px/Keyline Grid`).
- **No codebase attached.** No supplemental decks, brand guide, or marketing assets were provided.

See `/Figma-notes.md` for the list of every symbol referenced.

## Content fundamentals

The tone is **warm, concise, sentence-case, second-person**. Copy is short — almost every string in the file is ≤6 words. Emoji are a first-class part of the visual language, not decoration: a waving hand opens the greeting, and each feature category gets a fixed emoji prefix (🧠 Skills, 💼 Jobs, 🗓️ Schedule, ⚙️ Personalize). A **✦ sparkle** (U+2726) prefixes *suggested actions*, signaling "AI-suggested, one-tap".

- **Greeting**: `👋🏻 Hello Taroon,` + `Where should we start?` — personal, friendly, never marketing-y
- **Section eyebrows**: `Explore features`, `suggested actions` — 10px SF Pro Display, 10% letter-spaced tracking, sentence-case (the lowercase "suggested actions" is intentional in the file)
- **Feature cards** use a two-line pattern: `<emoji> <Noun>` title + one-line verb-first description ("Teach new skills to BlueAI", "Complete jobs to make money", "Automate tasks on a fixed schedule", "Change BlueAI's settings")
- **Suggested actions** are imperative, one-tap commands prefixed `✦ ` (`✦ Open Settings`, `✦ Search for racing games on Play Store`)
- **Primary CTAs** are 1–2 words, Title Case (`New Chat`, `New`, `Continue`)
- **"I" vs "you"**: BlueAI doesn't refer to itself as "I" in UI strings — it's named in the third person ("Send a message to BlueAI", "Teach new skills to BlueAI"). Use "you" sparingly; prefer verb-first.
- **Brand signature**: the wordmark is `BlueAI by now.gg` in Bricolage Grotesque Bold — the product sits under the `now.gg` parent brand

No exclamation marks, no em-dashes, no corporate fluff. Casing is sentence-case throughout except button labels (Title Case) and the occasional TRACKING eyebrow (which stays lowercase here).

## Visual foundations

**Palette.** Two chromatic accents — **Iris `#7B4CFF`** and **Cyan `#0EA4C5`** — that only ever appear together as a **linear gradient** (0° top→bottom; `linear-gradient(rgb(123,76,255) 0%, rgb(14,164,197) 99%)`). The gradient is used on the logo tile, the circular send button, and as a **10%-alpha wash** (`linear-gradient(rgba(123,76,255,.1), rgba(14,164,197,.1))`) for the ✦ suggested-action pills. Never use either stop as a solid fill on its own.

Everything else is a cool near-black neutral ramp tuned to a slight blue cast: `#080A1F` (display), `#1B1E38` (headings), `#2B2E4C` / `#373A58` (body), `#434664` (secondary), `#B6B8CC` / `#B6B8CD` (stroke/disabled), `#DFE4EE` (divider), `#F7FAFF` (surface). White is the canvas; there is no dark mode in the current file.

**Type.** `SF Pro Display` for titles & eyebrows, `SF Pro` for UI/body. Logo wordmark in `Bricolage Grotesque 700`. There is **no serif** and no monospace in the system. Scale is tight: 20 / 16 / 14 / 12 / 10 — designed for a 294px-wide panel.

**Layout.** The in-app surface is **294×593**, structured `32px button rail (dashboard only) → 46px header (1px `#DFE4EE` border) → 16px padded body → 72px prompt window`. Feature cards are 126×60 in a 2-column grid with 10px gutter.

**Backgrounds.** Flat white surfaces, no imagery, no full-bleed photography, no noise, no hand-drawn illustrations. The only decoration is the 10% gradient wash on pills. Cards use `#F7FAFF` (a 1% blue-tinted near-white).

**Radii.** Consistent progression: `8` (feature cards) · `12` (composer) · `128` (pills, fully rounded) · `130` (send button, a perfect circle). The assistant message bubble uses an asymmetric `12 12 128 12` — rounded on three corners, a big soft curve on the bottom-right (because it's a user-sent message landing from the right edge).

**Borders.** Hairlines, not thick lines: `0.5px` on cards and the composer, `1px` on the header. Border color is `#B6B8CD` (buttons/composer) or `#DFE4EE` (header divider).

**Shadows.** None in the current file. The system relies entirely on hairline borders and surface color for elevation — do not add drop-shadows unless introducing a floating/menu layer (in which case: soft, cool-tinted, e.g. `0 4px 16px -4px rgba(8,10,31,.08)`).

**Animation.** Not specified in the Figma. Recommended defaults: 150ms fades on hover (→ `opacity: 0.8` on pills/cards; → slightly deeper gradient on the send button), 200ms `ease-out` on press (scale `0.97`), no bouncy springs. BlueAI is a utility assistant, not a playful toy — motion should feel calm.

**Hover / press.** Pills darken their wash from 10% to ~18% alpha. Cards shift their surface from `#F7FAFF` to white and bring the border up from 0.5 to 1px. The circular send button keeps its gradient but lifts ~2% (shadow or scale 1.02). Press states use scale 0.97 + a momentary 20% wash.

**Transparency & blur.** No blurs, no frosted panels — the panel itself is opaque white. The only transparency in the system is the 10% gradient wash on ✦ pills.

**Imagery.** None. If photography is added, recommend cool-tinted, moderate-contrast, no grain, with a slight desaturation — to sit alongside the neutrals.

## Iconography

Two stroke styles coexist in the Figma:

1. **Monochrome 12/16/20px line icons** — all drawn at a 1px stroke weight at 16px canvas (Menu ≡, Right Arrow, Add `+`, Caret Down, Keyline Grid). Default color is `#B6B8CC` (inactive) or `#1B1E38` when active/primary.
2. **A single gradient symbol** — the ✦ sparkle, used inline in chip labels to mark AI suggestions. This is the ONLY icon that ever carries the brand gradient (other than the logo and send button).

Emoji are used as category markers (🧠 🗓️ 💼 ⚙️ 👋🏻). Treat these as part of the copy, not as decorative icons. Keep them at the text's own size.

**We use Lucide** as the closest-match CDN substitute for the unresolved Figma vector icons (menu, arrow-up, plus, chevron-down, sliders) — stroke weight 1.5, 16px. The Figma-native SVGs themselves weren't extractable, so Lucide stands in. **→ flag for user review.**

## Fonts

SF Pro / SF Pro Display are Apple system fonts and can't be redistributed. On the web we substitute with the closest Google Fonts match: **Inter** for UI/body (matches SF Pro's x-height and neutral character) and **Bricolage Grotesque** (which IS on Google Fonts) for the wordmark. **→ flag for user review; if a real SF Pro license is available, drop the `.ttf` files into `fonts/` and they'll be picked up by `colors_and_type.css`.**

## Index

- **`README.md`** — this file
- **`colors_and_type.css`** — CSS custom properties for colors, type, spacing, radii, shadows
- **`SKILL.md`** — Agent-Skill-compatible entry point
- **`Figma-notes.md`** — list of Figma symbols this system references
- **`assets/`** — logo (`logo.svg`, `logo-mark.svg`), background token files if added later
- **`fonts/`** — webfont files (currently empty; Bricolage Grotesque + Inter loaded from Google Fonts)
- **`preview/`** — Design-System-tab card HTML files (colors, type, spacing, components, brand)
- **`ui_kits/blueai-panel/`** — high-fidelity recreation of the in-app panel (Dashboard, Chat Home, Explore & Chat, Chat UI) with an interactive click-through in `index.html`
