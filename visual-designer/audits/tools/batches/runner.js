// Shared runner for every area's capture plan — the ONLY place that owns the browser lifecycle,
// the combo loop (compact/wide × dark/light), and the manifest load/save. Area files never repeat
// this boilerplate: each exports { name, run(page, combo, helpers) } — a small, linear, readable
// action sequence for THAT area only. This is what makes a plan reproducible by a different
// reviewer: read the area file top to bottom and you have the exact sequence used to reach every
// captured state, with no shared mutable setup hidden elsewhere.
const { chromium, loadManifest, saveManifest, openApp, shotAsserted, assertState, niDimensions, EVID_DIR } = require('../capture.js');
const path = require('path');
const fs = require('fs');

const DEFAULT_COMBOS = [
  { key: 'compact', theme: 'dark', w: 380, h: 900 },
  { key: 'compact', theme: 'light', w: 380, h: 900 },
  { key: 'wide', theme: 'dark', w: 900, h: 900 },
  { key: 'wide', theme: 'light', w: 900, h: 900 },
];

// One-off exception for capture targets that live OUTSIDE .drawer in the DOM (e.g. the dev-only
// #baiPreview panel) — see areas/chat.js for the concrete case. Everything shotAsserted() captures
// is clipped to the drawer's own bounding box; this takes a full-page shot instead when a spec
// needs to prove text is visible somewhere the drawer-scoped text check can never see.
async function shotFullPage(page, spec, extraTextCheck) {
  if (extraTextCheck) {
    const ok = await page.evaluate((sel) => {
      const el = document.querySelector(sel.selector);
      return el ? el.innerText.includes(sel.text) : false;
    }, extraTextCheck);
    if (!ok) throw new Error(`ASSERTION FAILED for ${spec.visualInstanceId}: expected '${extraTextCheck.text}' inside '${extraTextCheck.selector}'`);
  }
  const check = await assertState(page, spec);
  if (!check.passed) throw new Error(`ASSERTION FAILED for ${spec.visualInstanceId}: ${check.failures.join('; ')}`);
  const filename = spec.visualInstanceId.replace(/\./g, '-') + '.png';
  await page.screenshot({ path: path.join(EVID_DIR, filename), fullPage: true });
  const stat = fs.statSync(path.join(EVID_DIR, filename));
  if (stat.size < 2000) throw new Error('suspiciously tiny screenshot: ' + filename);
  return {
    visualInstanceId: spec.visualInstanceId, matrixId: spec.matrixId, state: spec.state,
    interactionState: spec.interactionState || 'default', theme: spec.theme, breakpoint: spec.breakpoint,
    screenshot: filename,
    assertions: { spec: { ...spec, matrixId: undefined, visualInstanceId: undefined }, observed: { ...check.observed, ...(extraTextCheck ? { fullPageTextCheck: extraTextCheck } : {}) }, passed: true, retroactive: false },
    dimensions: niDimensions(filename),
    notes: (spec.notes || '') + ' [Full-page screenshot, not drawer-clipped — subject lives outside .drawer.]',
  };
}

async function runArea(areaModule, { save = true } = {}) {
  const browser = await chromium.launch();
  const manifest = loadManifest();
  const records = [];
  const combos = areaModule.combos || DEFAULT_COMBOS;
  for (const combo of combos) {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    await openApp(page, combo);
    const localRecords = await areaModule.run(page, combo, { shotAsserted, shotFullPage });
    records.push(...localRecords);
    await page.close();
  }
  await browser.close();
  if (save) {
    saveManifest(manifest.concat(records));
    console.log(`${areaModule.name}: DONE. Records:`, records.length);
  }
  return records;
}

module.exports = { runArea, shotFullPage, DEFAULT_COMBOS };
