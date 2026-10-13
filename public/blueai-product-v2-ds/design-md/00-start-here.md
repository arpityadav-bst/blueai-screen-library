## 00 Start here

**Status:** Meta (no parts).

**Why:** One page that says what this is, who it is for and how to use it, so nobody has to reverse-engineer the folder.

### What this is

The target design system for BlueAI Product V2: the parts, colours, words and screens the next iterations of V2 are built from. It is minimal on purpose, every decision is argued from the product concept (section 01), and it is one family with the onBlue Agentic site the partner comes from and goes back to.

It is built for the PM building V2 next, and for anyone who picks up a V2 screen after him. V2's own files were not changed: the system sits next to V2 (`public/blueai-product-v2-ds/`) and shows V2 live where it can.

### How to read a part

Every part carries one status; section headers count them.

| Status | What it means | What the section shows |
|---|---|---|
| In V2 | Carried from V2 as it is. | V2 rendered live where possible, its copy quoted exactly, with the V2 file and line. |
| Changed from V2 | V2 has it, the system changes it. | "V2 today" on the left, the system on the right, then what changed and why. |
| New | V2 has no equivalent. | Why the product needs it, and the copy marked Proposed. |

A value shown as `file:line` is a V2 source. The Spec drawer under a part lists each value, the token that now holds it and the V2 line it came from, and `tools/ds-check.js` proves that line still says it.

### Where to start

1. 01 The product concept and 02 Principles: the frame every decision is judged against.
2. 73 Recommendations for V2: every V2 difference as a fix list, P1 first, plus the decisions only the PM can make.
3. 74 How to add a feature: from a new task to a screen merged into V2.
4. Then the part or screen you need. 75 Coverage says what exists; 76 Known gaps says what the guide cannot prove.

### Where things live

All under `public/blueai-product-v2-ds/`. V2 itself is `public/blueai-product-v2/`.

| Path | What it holds |
|---|---|
| `index.html` | The live guide. Every section, live parts, V2 today next to the system. |
| `DESIGN.md` | This file: the same content as Markdown, generated from `design-md/`. |
| `tokens.css` | Every colour, size, radius, shadow, layer and timing as a `--v2-*` custom property. The only place raw values live. |
| `kit/` | The parts, on `window.V2Kit` (`button.jsx`, `run-card.jsx`, ...), and their `v2-*` styles (`actions.css`, `chat.css`, ...). |
| `screens/` | Whole screens composed from the kit, on `window.V2Screens`. |
| `guide/` | The guide's own chrome: `catalog.jsx` (the section list), `sections/`, `refs/` (the V2 sources), `app.jsx`. |
| `design-md/` | One partial per section; edit these, then rebuild DESIGN.md. |
| `tools/` | `ds-check.js` (the gate) and `build-design-md.js`. |
| `HANDOVER.md` | The one-page handover in plain words. |

### How to run the checks

From `public/blueai-product-v2-ds/`, with Node and nothing to install:

- `node tools/ds-check.js` before every hand-off; it must end with 0 errors (add `--missing-ok` only while files are still being written). It proves: every V2 value or string the guide quotes still sits on its V2 line; no em dash in any form; every .jsx and .js parses; every .jsx, .js and .css is 300 lines or fewer; the catalog, section files, partials and index.html agree; no raw colour in `kit/` or `screens/`; every kit part and screen the catalog names is on its global.
- `node tools/build-design-md.js` after editing anything in `design-md/`. Never edit DESIGN.md by hand.

The checks read files, not pixels. How a part looks is checked by eye in the guide.

### House rules

- Tokens only: a colour or size in `kit/` or `screens/` is a `--v2-*` token, never a raw value.
- Kit classes start `v2-`, guide classes `g-`. Hover, focus-visible, active, disabled, loading and error live in CSS, not in mouse handlers.
- Files are IIFEs for the browser's Babel: no import or export. Kit parts go on `window.V2Kit`, screens on `window.V2Screens`.
- At most 300 lines per .jsx, .js or .css file. Split before you pass it.
- Copy: quote V2 exactly where a part is In V2; use the glossary (section 70): Always ask and Automatic, AI credits, Sign in and Sign out. New copy is marked Proposed until the PM approves it. No em dash.
- Accessibility floor: visible focus, labels on icon buttons, 4.5:1 for text, 32px targets, reduced motion respected.
