# Layer B evidence pipeline

Four scripts, one canonical manifest. Nothing here ever edits `blueai-desktop` — every script
only reads it (to build assertions/selectors) or writes to `visual-designer/audits/` (the audit
HTML, the manifest, screenshots, and generated reports).

## Files

- **`capture.js`** — Playwright helpers: `openApp()` (boots the terminal at a given theme/breakpoint,
  throws if the drawer never opens), `shotAsserted()` (asserts real DOM/text state, throws on any
  mismatch, screenshots ONLY on success, returns a manifest record with all 8 dimension slots
  pre-filled as NI), `assertState()`, `measure()`. Exports `EVID_DIR`/`BASE_URL`/`DIMS` too.
- **`validate.py`** — the strict gate. No exceptions for retroactive/unverified records, no null
  dimensions, no composite matrixIds, no orphan/missing screenshots, no HTML/manifest disagreement.
  Exits non-zero on any error. Writes `evidence/layer-b/validated_totals.json` and
  `evidence/layer-b/validation-report.txt` every run (both success and failure).
- **`generate_layer_a.py`** — reparses the live §3 matrix and rewrites §2's raw-validation block,
  status-count table, and area-count table. Idempotent if §3 hasn't changed.
- **`generate_layer_b.py`** — rewrites all of §15 (Layer B) from `manifest.json` +
  `validated_totals.json` only: evidence index, mechanical validation block, and the
  `LAYER_B_VALIDATED_TOTALS_JSON` HTML comment marker that `validate.py` checks on its next run.
  Requires `validated_totals.json` to exist (run `validate.py` first).

## Prerequisites

A local server must be serving `blueai/public` (not `blueai/public/blueai-desktop` — the app's own
`boot.js`/`flows.js` are loaded via relative paths and 404 silently otherwise):

```bash
python -m http.server 8410 --directory "N:\Antigravity Main\blueai\public"
```

`capture.js` expects it at `http://localhost:8410/blueai-desktop/index.html` (see `BASE_URL`).

## Commands

Run in this order. All are safe to re-run — nothing here is destructive.

**1. Capture new evidence** (write a small batch script per area, using `capture.js`'s helpers):

```bash
node your_capture_batch.js
```

Minimal template for a new batch:

```js
const { chromium, loadManifest, saveManifest, openApp, shotAsserted } = require('./capture.js');

(async () => {
  const browser = await chromium.launch();
  const manifest = loadManifest();
  const records = [];

  for (const combo of [
    { key: 'compact', theme: 'dark', w: 380, h: 900 },
    { key: 'compact', theme: 'light', w: 380, h: 900 },
    { key: 'wide', theme: 'dark', w: 900, h: 900 },
    { key: 'wide', theme: 'light', w: 900, h: 900 },
  ]) {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    await openApp(page, combo);
    // ... navigate to the state you want, using stable IDs/exact classes — never a positional
    // index into a live-re-rendered list, never an unscoped class shared by other components ...
    records.push(await shotAsserted(page, {
      visualInstanceId: `XN.somestate.default.${combo.theme}.${combo.key}`,
      matrixId: 'XN', state: 'somestate', theme: combo.theme, breakpoint: combo.key,
      expectVisibleText: 'some real text on screen',
    }));
    await page.close();
  }

  saveManifest(manifest.concat(records));
  await browser.close();
  console.log('DONE. Records:', records.length);
})().catch(e => { console.error('CAPTURE ERROR:', e.message); process.exit(1); });
```

**2. Validate the manifest** (also refreshes `validated_totals.json` + `validation-report.txt`):

```bash
python "N:\Antigravity Main\blueai\visual-designer\audits\tools\validate.py"
```

**3. Regenerate Layer A** (only needed if §3's matrix itself changed):

```bash
python "N:\Antigravity Main\blueai\visual-designer\audits\tools\generate_layer_a.py"
```

**4. Regenerate Layer B HTML** (needs a fresh `validated_totals.json` from step 2):

```bash
python "N:\Antigravity Main\blueai\visual-designer\audits\tools\generate_layer_b.py"
```

**5. Re-validate** to confirm the newly-embedded HTML marker agrees with the manifest
(closes the loop — this is the run whose exit code is the real integrity gate):

```bash
python "N:\Antigravity Main\blueai\visual-designer\audits\tools\validate.py"
```

## Notes for future capture batches

Three real bugs were caught this way and are worth re-reading before writing a new batch:

- **Scope every selector.** `.bai-tgl` alone is shared by Skills, Scheduled, and BYOK toggles —
  an unscoped query silently grabs whichever is first in DOM order, not necessarily the visible one.
- **Never index into a container that gets re-rendered.** `document.querySelectorAll(sel)[i]` breaks
  the moment a sibling control (e.g. a second segmented control) gets inserted into the same
  container after a click — re-query by exact text/id instead of a positional index.
- **Click the element that actually holds the listener**, not a parent wrapper — clicking a parent
  never triggers a child's own click handler.
- **Check source before writing an assertion string.** Case, exact wording, and control type
  (e.g. a segmented control that looks like it could be a `<select>`) are easy to get wrong from
  memory; grep `index.html` for the literal text/selector first.
