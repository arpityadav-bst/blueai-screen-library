## 35 Message bubbles and notices

**Status:** Changed from V2 (all three parts).
**Why:** V2 has six bubble looks in five colours, each with a shadow, and the loudest is the partner's own message (an indigo gradient with a 30% glow, chat_bubbles.jsx:30). The system is quiet by default (P5): white with a 1px line, colour carried by an icon, one attention fill for "needs you".

### MessageBubble, user (Changed from V2)
- **Purpose:** What the partner said, or the answer chip they tapped (echoed).
- **Anatomy:** Right-aligned; blue tint fill (`--v2-blue-tint`), 1px `--v2-blue-tint-line`, radius 16, padding 12 16, max 300, text 14/1.5 ink, no shadow; optional time under it.
- **Variants:** One.
- **Sizes:** Max 300, hugs short text.
- **States:** Rest; with time (last of a group). V2: `?start=worker&ask=<text>`, or the Preview panel's Chat states row.
- **Props:** `MessageBubble {from: 'user', time, groupStart, children}`.
- **Motion:** Arrives with the shared fade-up when the screen animates it; none of its own.
- **Accessibility:** Hidden "You:" prefix; ink on the tint is above 15:1.
- **Responsive:** Wraps; long words break.
- **Do / Don't:** Do keep it the quietest bubble. Don't use the brand gradient on it (gradient is for the mark and credits glyph only).

### MessageBubble, worker (Changed from V2)
- **Purpose:** A plain sentence from the worker. Run progress is not here; it is in the RunCard.
- **Anatomy:** Left-aligned; white, 1px `--v2-line`, radius 16, padding 12 16, max 300, text 14/1.5 ink-2. Thinking: Spinner 16 + "Working on it…" ink-3.
- **Variants:** Plain; thinking (last step only); plan (title + numbered list).
- **Sizes:** Max 300.
- **States:** Rest; with time; thinking. V2: any running script (`?day=next`).
- **Props:** `MessageBubble {from: 'worker', time, groupStart, children}`; thinking via `renderMessage({role: 'thinking'})`.
- **Motion:** Spinner spins at 800ms; slowed by the global reduced-motion rule.
- **Accessibility:** Hidden "BlueAI:" prefix; ink-2 is 10:1; thinking caption is 6.0:1 (V2's was 2.56:1).
- **Responsive:** Wraps.
- **Do / Don't:** Do keep it plain. Don't add fills or shadows to say anything.

### NoticeBubble (Changed from V2)
- **Purpose:** An outcome or a heads-up the partner should read.
- **Anatomy:** White, 1px line, radius 16, padding 12 16, max 300; icon 16 in tone, optional title 14/600 ink, body 14 ink-2 (one line per item when given `lines`); optional action row under it and feedback below the bubble.
- **Variants:** `kind` is one of the five token tones (`kit/thread.jsx` NOTICE): `info` (info, blue-ink; DependencyCard), `success` (check, success-ink), `attention` (alert, attention-ink), `danger` (x-circle, danger-ink), `neutral` (info, ink-3). Aliases kept for older callers: `headsup` is attention, `fail` is danger, and `needsInput` is attention (help icon) on the PM's yellow (`--v2-attention-tint` / `--v2-attention-line`), the one attention fill.
- **Sizes:** Max 300.
- **States:** Static. V2: Preview panel, Chat states On shows success, heads-up, needs input and fail; Scheduled job Out of credits shows the titled heads-up.
- **Props:** `NoticeBubble {kind, title, lines, children, action, feedback, time, groupStart, className}`.
- **Motion:** None of its own.
- **Accessibility:** Without a title, a hidden word says the tone ("Heads up:", "Done:"), so colour never carries meaning alone.
- **Responsive:** Wraps.
- **Do / Don't:** Do let the icon carry the tone. Don't tint a bubble green or red; don't use a notice for run steps.
