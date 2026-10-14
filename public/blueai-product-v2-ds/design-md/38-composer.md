## 38 Composer

**Status:** Changed from V2 (Composer, ComposerNotice, Stop).
**Why:** V2 clips text past 120px (chat_product.jsx:78, 284), rests on a blue-tinted 1.5px border at 1.40:1 that reads as focus (chat_product.jsx:260), mixes "..." and "…" in placeholders (266, 278, 283), reveals zero credits only after Send (124), and stops a paid job on one click with no trace (141). Its Automatic ribbon was the right pattern and is generalised here; V2 archived it on 2026-10-14 (code kept, not rendered), and its box now carries the mode chip in a bottom bar.

**V3 restyle (2026-10-14).** Send is the solid ink button; Stop is the ghost (the ladder's second step); Stop run in the confirm is the solid primary.

### Composer (Changed from V2)
- **Purpose:** One field to talk to the worker, with Send that becomes Stop.
- **Anatomy:** Block padding 4 16 12; optional notice and stop-confirm above; while busy, a status line 12/1.35 ink-3 above the box (`.v2-composer-status`, role status: 'BlueAI is working…', 'Answer with the buttons above.'), so the placeholder never carries status (V3 review round 1, 2026-10-14); box radius 10, 1px `--v2-line-strong`, white, padding 4 4 4 12; textarea 14/1.5 ink, placeholder ink-4; SendStop 36 round on the right, bottom-aligned.
- **Variants:** Default; with a notice.
- **Sizes:** Field grows from 1 to 6 lines (`maxRows`), then scrolls.
- **States:** Rest; hover (line 20%); focus (1.5px blue + 3px 16% ring); typing; running (read-only, the status line "BlueAI is working…", Stop); awaiting a choice (read-only, the status line "Answer with the buttons above.", Stop); disabled with a reason (a neutral placeholder, "You can’t send messages right now", paired with the notice that says why and until when); max height then scroll. Forced with `.is-hover`, `.is-focus`. V2: `?start=worker` (rest, typing), Run (running, awaiting), Preview Scheduled job Out of credits (disabled).
- **Props:** `Composer {value, defaultValue, onChange(text), onSend(text), onStop, running, awaiting, costsDay, paidJob, confirming, disabledReason, placeholder, notice, maxRows, className}`; `notice` is a ComposerNotice props object or an element.
- **Motion:** Border and ring 120ms.
- **Accessibility:** Labelled "Message BlueAI"; described by the notice; read-only (not disabled) while busy, so it stays reachable; Enter sends, Shift+Enter is a new line; the status line is a live region, so a change of state is announced; placeholder 4.77:1 on the read-only fill.
- **Responsive:** Full width of the window; pinned above the nav at the compact height.
- **Do / Don't:** Do show standing conditions before typing. Do use "…" only for work in progress. Don't clip text. Don't use a blue border at rest.

### ComposerNotice (Changed from V2)
- **Purpose:** A condition that holds before the partner types, with its one action.
- **Anatomy:** A compact Banner: tone in the fill, the edge and the icon, words ink-2. Radius 10, 1px line in tone, padding 2 4 2 12; icon 16; text 13/1.35; the action is `V2Kit.Link` standalone (underlined ink, 32px tall, blue-ink on hover; `kit/composer.jsx:38-46`).
- **Variants:** `info` (blue tint, blue-ink icon: Automatic on, BlueStacks needed), `attention` (yellow, attention-ink icon: the partner must answer before the run can go on), `neutral` (sunken, ink-3 icon: paused; out of AI credits until a time, section 48). The words stay ink-2 in every tone.
- **Sizes:** Composer width.
- **States:** Shown while the condition holds; action hover, focus. V2: none since the ribbon was archived (2026-10-14).
- **Props:** `ComposerNotice {tone, icon, text, children, action: {label, onClick}, id, className}`.
- **Motion:** None of its own.
- **Accessibility:** Text 13 ink-2 on every tone's fill (above 9:1); the action is the shared Link (a real button); links are never warm-coloured (ink in every tone).
- **Copy:** "Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking." and "Change" are V2's former words; the ribbon that last said "Automatic on YouTube" is archived since 2026-10-14 (agent_permissions.jsx:16-18). The out-of-credits line is owned by section 48 ("Out of AI credits until **5:30 am tomorrow**.", `V2Kit.OOC_COPY.until`); the locked field's placeholder is neutral ("You can’t send messages right now"), so the time is said once, in the notice. Proposed: "Today’s run needs BlueStacks App Player." / "Get BlueStacks", "The BlueAI worker is paused until tomorrow." / "Resume".
- **Do / Don't:** Do keep one notice at a time, the most urgent. Don't announce zero credits only after Send.

### Stop (SendStop) (Changed from V2)
- **Purpose:** Send the message, or stop the run.
- **Anatomy:** 36 round. Send: `--v2-solid` fill with `--v2-shadow-btn`, white send glyph 16. Stop: the ghost, `--v2-surface-panel`, 1px line-strong, ink stop glyph 16. Stop confirm (today not counted yet, `costsDay`): attention panel above the field, "Stop now? Today counts only if you run again by 9 pm." (the stopped RunCard and WorkerCard say the same); with a paid job under way (`paidJob`) it says "Stop now? The paid job won’t finish. Today counts only if you run again by 9 pm."; Keep running (secondary md) / Stop run (primary md). The confirm is role=alertdialog labelled by its question and takes focus on Keep running; while it is open, Stop moves focus back to it, so a double press never stops a paid run (`kit/composer.jsx:102-135`).
- **Variants:** send, stop.
- **Sizes:** 36 (control-md).
- **States:** Send ready, hover (`--v2-solid-hover`, the cast pulled in), focus, pressed (1px down), disabled (sunken + ink-4, not pale blue); Stop, hover (wash + line), pressed; stop confirm.
- **Props:** `SendStop {mode, disabled, onClick, className}`; Composer `costsDay` (running, retrying or waiting, before the day counts) turns the confirm on, `paidJob` does too and names the job, `confirming` forces it.
- **Motion:** Colour 120ms, press 120ms.
- **Accessibility:** Labels "Send message" / "Stop the run" (V2 said "Stop task"; "task" is banned for paid work); visible focus ring; 36px target.
- **Responsive:** Fixed size.
- **Do / Don't:** Do ask before stopping a paid job and leave the stopped RunCard with its day status. Don't show hover by opacity (V2 used onMouseEnter opacity 0.85).
