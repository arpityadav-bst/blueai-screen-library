## 03 Colour

**Status:** Ink ramp, Surfaces and lines, Action blue, Status tones, Brand gradient: all Changed from V2.

**Why:** BlueAI is a quiet control room for an agent working on the partner's own accounts, and the partner moves between it and the onBlue site every day. V2 paints with two Tailwind grey ramps split 178/178, seven blue fills, an indigo nav, four parallel status maps and the brand gradient in three places on one top bar; its primary blue fails contrast with its own white labels (3.24:1, index.html:351) and its faintest text carries its most important caveats (2.5:1, chat_bubbles.jsx:124, account_gate.jsx:31). The system keeps one hue per job and shares the site's neutrals, lines, blue, greens and reds, so the app and the site read as one family (P5, P6, P7).

### Ink ramp (Changed from V2)

**Purpose.** All text and idle icon colour, in one hue.

**Anatomy.** Four steps plus placeholder and on-colour: `--v2-ink` #0b0b0d (titles, figures, money), `--v2-ink-2` #3c4049 (body, labels), `--v2-ink-3` #5f636b (descriptions, notes, idle icons, every consequence line), `--v2-ink-4` #6e737c (meta only), `--v2-ink-placeholder` #9ca2ad, `--v2-on-color` #ffffff, `--v2-on-color-muted`.

**Variants.** None: a role picks the step.

**Sizes.** Not applicable.

**States.** On surface: ink 19.67, ink-2 10.39, ink-3 6.03, ink-4 4.77 (:1). ink-4 on canvas 4.60, on panel 4.69. Everywhere else ink-4 drops under 4.5:1: sunken 4.42, blue tint 4.29, selected 4.06, success tint 4.36, attention tint 4.37, danger tint 4.17, hover wash 4.32, press wash 4.08. So ink-4 sits only on surface, panel or canvas at rest; meta on anything tinted, sunken, selected, hovered or pressed is ink-3 (the menu's hint already does this, kit/overlays.css:114; the type style for it is `.v2-text-caption`, section 04). V2 today: `'Working on it…'` in #94a3b8 (ChatBubbles.ThinkingBubble, any chat run), `'App Player will be signed out too.'` in #9ca3af (the sign-in gate, `?signin=browser&player=other`).

**Props.** Tokens only. Text styles carry their ink (section 04); override with a token, never a hex.

**Motion.** Colour changes use `--v2-dur-1` and `--v2-ease-standard`.

**Accessibility.** Body text 4.5:1 at least on its ground (section 09 computes every pair). ink-4 is never the only carrier of a consequence: a line that says what happens next ("signed out too", "won’t count") is ink-3 or stronger. Placeholder is never text that must be read.

**Responsive.** Not applicable.

**Do / Don't.** Do pick the step by role. Do put money and credits figures in ink. Don't use ink-4 for a caveat, or on anything but surface, panel or canvas at rest. Don't add a grey for one screen.

### Surfaces and lines (Changed from V2)

**Purpose.** Grounds a fraction of a percent apart, separated by 1px alpha-black lines (the site's line values, shared). The site pairs those lines with faint resting card shadows; the product drops the shadows and lets the lines alone separate in-flow surfaces (section 02, P6: adapted).

**Anatomy.** Grounds: `--v2-canvas` #fafbfb (window), `--v2-surface` #fff (cards, bubbles, bars, dialogs), `--v2-surface-panel` #fdfdfd (inset panel inside a card), `--v2-surface-sunken` #f6f6f8 (wells, tracks, neutral chips). Lines: `--v2-line` 10% (every edge), `--v2-line-strong` 15% (fields, secondary buttons), `--v2-line-hair` 8% (dividers inside a card), `--v2-line-hover` 20% (hover firm-up), `--v2-link-underline` 32% (the resting underline under an ink link, the site's own value). Washes: `--v2-wash-hover` 4.5%, `--v2-wash-press` 7%, layered over the fill.

**Variants.** Alternation: canvas, then a white card, then a panel one step down, then rows back to white.

**Sizes.** All lines 1px (`--v2-stroke`).

**States.** Rest; hover (wash over the fill); pressed (press wash); pressable card hover (line to `--v2-line-hover`). V2 today: the Settings tab cards (BluestacksCard, shadow plus border) at `?start=worker`, then Settings.

**Props.** Tokens only.

**Motion.** Background and border colour over `--v2-dur-1`.

**Accessibility.** Hover never lowers opacity (V2 does, index.html:352), so contrast holds while hovering.

**Responsive.** Not applicable.

**Do / Don't.** Do separate in-flow surfaces with a line. Do hover with a wash. Don't add a shadow to a card. Don't hover by opacity.

### Action blue (Changed from V2)

**Purpose.** One blue hue in roles, so action, selection and focus are one colour family without failing contrast.

**Anatomy.** `--v2-blue` #156efe (focus, selected border, progress, current step, lit nav: the site's blue), `--v2-action` #1268f0 (filled buttons, send: 4.92:1 with white), `--v2-action-hover` #0f5ad4 (6.12:1), `--v2-blue-ink` #0d5ad6 (blue text on tints: 6.09:1), `--v2-blue-tint` and `--v2-blue-tint-line` (info notice, user bubble), `--v2-select` and `--v2-select-line` (selected chip, choice card, segmented on).

**Variants.** Fill, text, tint, selected.

**Sizes.** Not applicable.

**States.** Rest, hover (`--v2-action-hover`), focus (2px `--v2-blue` outline, offset 2), disabled (`--v2-opacity-disabled` with a visible reason). V2 today: every primary is #1990FF with white (3.24:1): New chat on the top bar, Switch account on the gate (`?signin=browser&player=other`).

**Props.** Tokens only; the Button reads them (section 11).

**Motion.** Fill colour over `--v2-dur-1`.

**Accessibility.** White text goes on `--v2-action`, never on `--v2-blue` (4.47:1). Blue text uses `--v2-blue-ink`.

**Responsive.** Not applicable.

**Do / Don't.** Do keep brand blue for focus, selection and progress. Do use action blue only for fills. Don't bring back the indigo nav (#4f46e5 on #eef2ff, shared.jsx:305). Don't use a warm colour for link text.

### Status tones (Changed from V2)

**Purpose.** Five tones every badge, banner, notice, tick, day bar and run card read from one table.

**Anatomy.** Each tone is tint, line, ink (and icon where it differs). Neutral: `--v2-surface-sunken`, `--v2-line`, `--v2-ink-2`. Info: `--v2-blue-tint`, `--v2-blue-tint-line`, `--v2-blue-ink`. Success: `--v2-success-tint`, `--v2-success-line`, `--v2-success-ink` #15803d (icon `--v2-success` #16a34a). Attention (the worker needs your answer, the PM's yellow): `--v2-attention-tint` #fdf6cf, `--v2-attention-line` #f3e8a8, `--v2-attention-ink` #8a6116. Danger: `--v2-danger-tint` #fdecec, `--v2-danger-line` rgba(208,69,74,0.32) (the pale banner and P1 tag edge, like the other tones' lines), `--v2-danger-ink` #c03a40 (also the destructive fill), plus one strong stroke, `--v2-danger-edge` #d0454a (4.53:1 on white, so it reads at 1px): the edge of an invalid TextField, Select or Checkbox (`kit/inputs.css:31, 149`).

**Variants.** Five tones. Orange heads-up is not a tone: it is a neutral notice whose icon is attention-coloured.

**Sizes.** Not applicable.

**States.** Neutral (paused, skipped, pending verification, out of credits in the composer), info (running, checking, a fact with nothing to do), success (verified, done, connected), attention (needs you, and nothing has gone wrong: a waiting job, a run that didn't start because the PC was off, out of credits on the RunCard, an account signed out), danger (something went wrong or a day is lost: failed, can't run, not counted). One rule picks between the last two: danger when the run failed, cannot start or the day is lost, even while Try again or a fix can still save today; attention when nothing failed and the partner's answer or action is what is needed. Out of credits in the composer is neutral: it explains a locked field, it does not ask.

**Pending verification, one rule.** A pending day is neutral wherever it is a status: one tick in `--v2-ink-4` (StatusTick, section 43), a neutral Badge with the `check` mark (section 16), the RunCard's Done badge (section 36). Blue touches it in exactly three places, all meaning "in, not yet checked" rather than a status: the DayBar's pending segment (1.5 `--v2-blue` inset outline, section 43), the run chip's pending dot (the same 1.5 blue ring, `kit/shell.css:76`, section 30) and the DayDone badge (`--v2-blue-tint` with its tick in `--v2-blue-ink`, section 44). Never green until verified. V2 today: the dev Preview's Chat states row (ChatBubbles.ChatStatesPreview); the AI Credits banner at `?credits=0`.

**Props.** The five tones are the table every part reads, but each part names its own prop (check this list before passing one):
- Badge `tone`: the five; anything else is neutral (`kit/display.jsx:21-26`).
- Banner `tone`: info, success, attention, danger, and `offline` for its neutral (sunken, line, ink-3 icon; section 21); anything else is info, so a neutral banner is `tone="offline"` with its own icon (the AI-mode conflict uses `alert`, section 49) (`kit/notice.jsx:16-18`).
- NoticeBubble `kind`: the five, plus the aliases headsup (attention), fail (danger) and needsInput (attention with the help glyph) for older callers; anything else is attention (`kit/thread.jsx:72-86`).
- ComposerNotice `tone`: drawn by the Banner, so the Banner's tones, plus `neutral`, its own name for the Banner's offline look with a pause glyph (`kit/composer.jsx:38-46`).
- Toast `tone`: success, info, error, loading; danger is read as error, so it is announced assertively (section 24, `kit/toast.jsx`).
- ProgressBar: no tone prop for status; `error` and `paused` booleans freeze it red or grey, and it turns success at max (`kit/progress.jsx:20-26`).

**Motion.** None of its own.

**Accessibility.** Each ink passes 4.5:1 on its own tint and on white. Tone never travels by colour alone: an icon or a word goes with it.

**Responsive.** Not applicable.

**Do / Don't.** Do use success for a reached state, matching the site's dashboard. Do keep money in ink ($6 earned). Don't paint dollars green (V2 stopped on 2026-10-14). Don't invent a sixth tone for one screen.

### Brand gradient (Changed from V2)

**Purpose.** Identity, not action.

**Anatomy.** `--v2-gradient-brand`, linear-gradient(90deg, #0EA4C5, #7B4CFF).

**Variants.** The BlueAI mark and wordmark; the credits glyph (`<Icon name="credits" />`, the gradient through V2's star).

**Sizes.** Mark per section 30; glyph 16, 20, 24.

**States.** Mark, credits glyph. V2 today: the top bar at `?start=worker` shows it three times (wordmark, pill ring, pill number, index.html:335-346), and the user bubble uses a cousin gradient with an indigo glow (chat_bubbles.jsx:30).

**Props.** None: use BrandMark or the credits Icon.

**Motion.** None. The gradient never animates.

**Accessibility.** Never carries text that must be read: the credits number next to the glyph is ink.

**Responsive.** Not applicable.

**Do / Don't.** Do keep it on the mark and the credits glyph. Don't use it as a ring, number, bubble, button, border or text fill. Which mark the family uses is decision D8.
