## 12 Text field and text area

**Status:** TextField, Secret field, TextArea: all Changed from V2.

**Why:** Typing is rare in a worker the partner sets up once, so every field the partner does meet (an API key, a feedback note, Report a problem, the advanced endpoint) has to be right first time and say what went wrong. V2 hand-builds five fields with three focus treatments and no error state at all; its key field shows the key in clear text and its Validate & Save never validates (byok_settings.jsx:54, 93). The system takes the site's question shape: a label, one box, a message line that exists only when it may hold something, the site's error line and ring, and "a placeholder is an example, not a watermark" (onblue/onblue.css:3654, 3703-3709; P6, P7).

### TextField (Changed from V2)

**Purpose.** One line of typed input with a visible label and a place to say what is wrong or what is happening.

**Anatomy.** Label 13/500 ink, 6 above the box, with an optional 12px ink-4 flag ("Required" or "Optional"). Box: 40 tall (`--v2-field-h`), radius 6, 1px `--v2-line-strong`, white, padding 0 12; value 14/1.35 ink. Leading and trailing slots (16px icon in ink-3, a Spinner, or a 28px IconButton), gap 8. Message line: 12/1.35 ink-3, 6 below, with a 16px alert icon when it is an error; a counter at its right when counting.

**Variants.** Text; `mono` (`--v2-font-mono` 13, for model ids and endpoints); `secret` (next part); no visible label (`hideLabel`: the label goes to screen readers and the placeholder steps up to ink-4, the site's rule for a field with no caption).

**Sizes.** md 40 (default), sm 32 (`--v2-hit-min`) for dense rows.

**States.** Rest; hover (edge `--v2-line-hover`); focus (edge `--v2-blue` + `--v2-focus-ring` 3px at 16%); filled (no change); disabled (sunken fill, 10% edge, 0.45, helper says why); read-only (sunken fill, 10% edge, still selectable and focusable); invalid + message (edge `--v2-danger-edge` #d0454a, 4.53:1, `--v2-danger-ring` on focus, message in `--v2-danger-ink`, `aria-invalid`); validating (spinner in the trailing slot, `aria-busy`, helper says "Checking…"); validated (check in `--v2-success`, helper in `--v2-success-ink`); required (flag + native `required`). In V2 today: Settings, AI Mode, Hybrid, Custom shows two fields with a JS border swap and no ring (ai_mode.jsx:179-186); the shared `.ba-field:focus` ring exists only on the Settings number inputs and the schedule form (index.html:57); no field has an error state.

**Props.** `label`, `hideLabel`, `value` / `defaultValue`, `onChange(value, event)`, `placeholder`, `helper`, `error` (a string makes it invalid; `error={null}` reserves the message line on a field that validates later), `required`, `optional`, `disabled`, `readOnly`, `size`, `width`, `leading`, `trailing`, `mono`, `secret`, `defaultRevealed`, `maxLength` + `showCount` (a soft limit: counter turns attention from 90%, the field turns invalid past it), `status` ('validating' | 'validated'), `id`, `className`; other props reach the input.

**Motion.** Edge and ring over `--v2-dur-1`. Nothing else moves. Reduced motion: no transitions.

**Accessibility.** The label is a real label element. Message and counter are linked by `aria-describedby`; the message line is a polite live region, so a new error is announced once. Focus is the edge plus ring, never removed without replacement. Placeholder ink is only for examples under a visible label.

**Responsive.** Fields fill their column in the 419px window; `width` fixes one only beside a label in a settings row.

**Do / Don't.** Do keep a visible label. Do say what is wrong and how to fix it under the box. Do validate before saying saved. Don't use the placeholder as the label or the hint. Don't remove the outline without the ring. Don't pretend to validate.

### Secret field (Changed from V2)

**Purpose.** An API key: hidden by default, checked before it is saved.

**Anatomy.** TextField with `secret`: password type, mono 13, a trailing eye IconButton 28 (`aria-pressed`, labelled "Show API key"), spellcheck and autocomplete off. Helper carries the where-to-find hint and the storage note.

**Variants.** None.

**Sizes.** md.

**States.** Hidden; revealed (eye pressed); validating ("Checking your key with Anthropic…"); invalid key ("That key didn’t work. Check it and paste it again."); validated ("Key works."); all proposed copy, owned by section 49 (`kit/advanced.jsx:37-42`), so this field never words them differently. In V2 today: Settings, Bring Your Own Key on, Add a provider, pick one: the key is typed in clear text (byok_settings.jsx:93), the hint "Find at https://console.anthropic.com/settings" is the placeholder and vanishes as you type (byok_settings.jsx:15), and the note "Your key is stored encrypted on this device only." is #9ca3af at 2.54:1 (byok_settings.jsx:96, 12).

**Props.** As TextField; `secret`, `defaultRevealed`, `status`, `error`.

**Motion.** As TextField.

**Accessibility.** The reveal button has a stable name and `aria-pressed`. The storage note is ink-3 (6.0:1).

**Responsive.** As TextField.

**Do / Don't.** Do validate with the provider before saving and say the result. Don't make up a key when the field is empty (V2 does). Don't show a key in clear text by default.

### TextArea (Changed from V2)

**Purpose.** Longer answers: the feedback note, Report a problem.

**Anatomy.** The field box with the textarea inside: padding 8 12, 14/1.5, min 84 (3 rows), no drag handle. Counter optional.

**Variants.** Plain; with counter (`maxLength` + `showCount`).

**Sizes.** One; `rows` sets the starting height, `maxRows` the cap.

**States.** As TextField, plus auto-grow (grows a line at a time), max rows then scroll (past `maxRows`, default 6), counter near the limit (attention ink from 90%), counter over the limit (danger ink, field invalid). In V2 today: thumbs down on a finished run, reason Other: a 12px box, 31 tall, radius 10, outline removed, growing to 48px then scrolling (chat_feedback.jsx:96-102); the composer grows to 120px and then clips what is past it (chat_product.jsx:284).

**Props.** As TextField (no slots), plus `autoGrow` (true), `maxRows` (6), `rows` (3).

**Motion.** Height follows content with no animation.

**Accessibility.** Never clips: past the cap it scrolls. The counter is linked to the field.

**Responsive.** Full column width.

**Do / Don't.** Do let it grow, then scroll. Don't clip text past a fixed height. Don't shrink the text to 12px to fit.
