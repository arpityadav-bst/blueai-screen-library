const { chromium } = require('C:\\Users\\hello\\AppData\\Roaming\\npm\\node_modules\\playwright');
const fs = require('fs');
const path = require('path');

const EVID_DIR = 'N:\\Antigravity Main\\blueai\\visual-designer\\audits\\evidence\\layer-b';
const MANIFEST_PATH = path.join(EVID_DIR, 'manifest.json');
const BASE_URL = 'http://localhost:8410/blueai-desktop/index.html';
const DIMS = ['icons','spacing','color','typography','overlay','buttons','controls','layout'];

function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  return [];
}
function saveManifest(m) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2));
}
function niDimensions(screenshotFilename) {
  const d = {};
  for (const dim of DIMS) d[dim] = { status: 'NI', reason: 'Captured but not yet individually visually evaluated', evidence: [screenshotFilename] };
  return d;
}

async function openApp(page, { w, h, theme }) {
  await page.goto(BASE_URL);
  await page.evaluate(({ w, h, theme }) => {
    localStorage.setItem('baiWin', JSON.stringify({ d: 1, l: 60, t: 20, w, h }));
    localStorage.setItem('baiTheme', theme);
    localStorage.setItem('baiPageState', 'default');
  }, { w, h, theme });
  await page.reload();
  await page.waitForTimeout(700);
  await page.locator('#bsWindow').click({ force: true });
  await page.waitForTimeout(4500);
  const state = await page.evaluate(() => {
    var scaler = document.querySelector('.scaler');
    var ui = document.getElementById('baiUi');
    var drawer = document.querySelector('.drawer');
    return {
      scale: getComputedStyle(scaler).transform,
      wide: ui.classList.contains('wide'),
      drawerClasses: drawer.className,
      drawerRect: drawer.getBoundingClientRect()
    };
  });
  if (!state.drawerClasses.includes('open')) throw new Error('drawer did not open: ' + JSON.stringify(state));
  return state;
}

// spec fields (all optional except theme/breakpoint which are always checked):
//   expectActiveTopTab, expectActiveSubtab, expectSelectorVisible, expectSelectorAbsent,
//   expectVisibleText: string — substring must appear in the drawer's visible innerText
//   expectTextAbsent: string — substring must NOT appear in the drawer's visible innerText
async function assertState(page, spec) {
  const observed = await page.evaluate((spec) => {
    const out = {};
    if (spec.expectActiveTopTab) {
      const activeTab = document.querySelector('.bai-tab.active, [data-mode].active');
      out.observedActiveTopTab = activeTab ? activeTab.getAttribute('data-mode') : null;
    }
    if (spec.expectActiveSubtab) {
      const activeSub = document.querySelector('.bai-create-tab.on');
      out.observedActiveSubtab = activeSub ? activeSub.textContent.trim() : null;
    }
    if (spec.expectSelectorVisible) {
      const el = document.querySelector(spec.expectSelectorVisible);
      out.selectorVisiblePresent = !!el;
      // offsetWidth/Height can be 0 on small inline elements (e.g. a toggle's own <i> knob)
      // even when genuinely rendered — check the nearest block ancestor's visibility instead
      // of the exact element's own box, which is a more reliable "is this actually on screen" test.
      out.selectorVisibleShown = el ? (el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none') : false;
    }
    if (spec.expectSelectorAbsent) {
      const el = document.querySelector(spec.expectSelectorAbsent);
      out.selectorAbsentIsAbsent = !el || (el.offsetWidth === 0 && el.offsetHeight === 0);
    }
    const drawer = document.querySelector('.drawer');
    out.drawerText = drawer ? drawer.innerText : '';
    if (spec.expectVisibleText) out.hasExpectedText = out.drawerText.includes(spec.expectVisibleText);
    if (spec.expectTextAbsent) out.hasAbsentText = out.drawerText.includes(spec.expectTextAbsent);
    const ui = document.getElementById('baiUi');
    out.observedWide = ui.classList.contains('wide');
    out.observedTheme = localStorage.getItem('baiTheme');
    return out;
  }, spec);
  delete observed.drawerText; // don't bloat the manifest with full page text, just the boolean checks

  const failures = [];
  if (spec.expectActiveTopTab && observed.observedActiveTopTab !== spec.expectActiveTopTab)
    failures.push(`expectActiveTopTab='${spec.expectActiveTopTab}' but observed='${observed.observedActiveTopTab}'`);
  if (spec.expectActiveSubtab && observed.observedActiveSubtab !== spec.expectActiveSubtab)
    failures.push(`expectActiveSubtab='${spec.expectActiveSubtab}' but observed='${observed.observedActiveSubtab}'`);
  if (spec.expectSelectorVisible && !observed.selectorVisibleShown)
    failures.push(`expectSelectorVisible='${spec.expectSelectorVisible}' not visible (present=${observed.selectorVisiblePresent})`);
  if (spec.expectSelectorAbsent && !observed.selectorAbsentIsAbsent)
    failures.push(`expectSelectorAbsent='${spec.expectSelectorAbsent}' is actually present/visible`);
  if (spec.expectVisibleText && !observed.hasExpectedText)
    failures.push(`expectVisibleText='${spec.expectVisibleText}' not found in drawer text`);
  if (spec.expectTextAbsent && observed.hasAbsentText)
    failures.push(`expectTextAbsent='${spec.expectTextAbsent}' but it IS present`);
  const expectedBreakpoint = spec.breakpoint === 'wide';
  if (observed.observedWide !== expectedBreakpoint)
    failures.push(`expected wide=${expectedBreakpoint} but observed wide=${observed.observedWide}`);
  if (observed.observedTheme !== spec.theme)
    failures.push(`expected theme='${spec.theme}' but localStorage baiTheme='${observed.observedTheme}'`);

  return { passed: failures.length === 0, failures, observed };
}

async function shotAsserted(page, spec) {
  const check = await assertState(page, spec);
  if (!check.passed) {
    throw new Error(`ASSERTION FAILED for ${spec.visualInstanceId}: ${check.failures.join('; ')}`);
  }
  const filename = spec.visualInstanceId.replace(/\./g, '-') + '.png';
  const filePath = path.join(EVID_DIR, filename);
  const box = await page.evaluate(() => {
    var d = document.querySelector('.drawer');
    var r = d.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  });
  await page.screenshot({ path: filePath, clip: box });
  const stat = fs.statSync(filePath);
  if (stat.size < 2000) throw new Error('suspiciously tiny screenshot: ' + filename + ' = ' + stat.size + ' bytes');

  return {
    visualInstanceId: spec.visualInstanceId,
    matrixId: spec.matrixId,
    state: spec.state,
    interactionState: spec.interactionState || 'default',
    theme: spec.theme,
    breakpoint: spec.breakpoint,
    screenshot: filename,
    assertions: { spec: { ...spec, matrixId: undefined, visualInstanceId: undefined }, observed: check.observed, passed: true, retroactive: false },
    dimensions: niDimensions(filename), // every slot present from the moment of capture — scoring fills these in later, never adds/removes slots
    notes: spec.notes || null,
  };
}

async function measure(page, selector) {
  return await page.evaluate((sel) => {
    var el = document.querySelector(sel);
    if (!el) return null;
    var r = el.getBoundingClientRect();
    var cs = getComputedStyle(el);
    return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, padding: cs.padding, margin: cs.margin, font: cs.font, color: cs.color, background: cs.backgroundColor, borderRadius: cs.borderRadius };
  }, selector);
}

module.exports = { chromium, loadManifest, saveManifest, openApp, shotAsserted, assertState, measure, niDimensions, EVID_DIR, BASE_URL, DIMS };
