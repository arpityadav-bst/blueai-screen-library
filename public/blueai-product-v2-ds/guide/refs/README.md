# V2 refs

Every V2 value or string the guide prints (a colour, a size, a line of copy, a URL state) carries a
**ref**: the V2 file, the line, and an exact piece of text from that line (the needle).
`tools/ds-check.js` re-reads V2 and proves each needle still holds, so the guide can never quietly
describe a V2 that no longer exists.

## One file per slice

Each slice owns `guide/refs/<slice-id>.js` and never edits another slice's file. Every file has the
same shape:

```js
/* Refs owned by the chat slice. Format: guide/refs/README.md. */
window.V2Refs = (window.V2Refs || []).concat([
  {
    id: 'chat.user-bubble.gradient',
    file: 'blueai/chat_bubbles.jsx',
    line: 30,
    needle: "background: 'linear-gradient(135deg,#5158ee,#7b4cff)'",
    value: 'user bubble fill, gradient #5158ee to #7b4cff',
  },
]);
```

| Field | What it holds |
|---|---|
| `id` | `<slice>.<part>.<what>`, lowercase with dashes, unique across all refs files. |
| `file` | Path relative to `public/blueai-product-v2/`, for example `index.html` or `blueai/byok.jsx`. A bare `byok.jsx` is also found in `blueai/`. onBlue sources start with `onblue/` (meaning `public/experiments/onblue-vesper/`). |
| `line` | 1-based line number in that file. |
| `needle` | Exact text copied from that line (a substring, not the whole line). Short and distinctive: the value itself plus a few characters around it. |
| `value` | What the guide prints for it, in plain words (optional but recommended). |

## Using a ref in a section

Pass the id, never the raw location:

```jsx
<G.SpecDrawer rows={[
  { part: 'Fill', token: '--v2-action', value: '#1268f0', ref: 'actions-inputs.button.fill' },
  { part: 'Label', token: '--v2-on-color', value: '#ffffff', ref: ['actions-inputs.button.label', 'actions-inputs.button.size'] },
  { part: 'Loading', token: null, value: 'spinner 16', /* New: no ref */ },
]} />
```

`window.V2Guide.ref(id)` returns the entry; `window.V2Guide.refText(id)` returns `file:line`.

## What ds-check does with them

- The needle must be on its line. If it sits up to 3 lines away the check passes and reports the
  drift (update `line`); further away, or gone, is an error.
- Ids must be unique and every field above except `value` must be present.
- A `ref: '<id>'` written in a guide section must exist in some refs file.

Copy rules apply here too: no em dash in any form. V2's own text has none (every port strips them).
