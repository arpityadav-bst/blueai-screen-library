/* ICON-TARGET AUDIT — the container law (taste rule 48). Runtime, because this is a law about computed
   geometry: a static read of the stylesheet cannot see that `height: auto` + `align-items: stretch` in one
   toolbar produced a 24x32 box. Sibling of radius-nesting-audit.js, same shape and same reason.

   THE LAW, in three clauses:
     1. ASPECT IS AN OUTPUT, NOT A CHOICE. A control's box is its content plus one uniform padding, with the
        cross-axis size set by the row. Text is wide -> landscape. A glyph as wide as the row allows -> square.
        A narrower glyph under the same padding -> portrait. Nobody picks "square" or "rectangle"; you pick the
        padding and the row height and the aspect falls out. So the audit never asserts "must be square" — it
        asserts the one thing the output must satisfy:
     2. GENEROUS ALONG THE TRAVEL AXIS. Acquisition cost depends on the target's extent along the direction the
        pointer approaches from (Fitts). In a horizontal row the pointer arrives horizontally, so width is the
        deciding dimension and height is the cheap one; in a vertical list it is the reverse. Therefore an
        icon-only control in a horizontal row must be AT LEAST SQUARE — landscape is fine and often better
        (the titlebar buttons are 26x22 on purpose), portrait is a defect, because it spends the free axis and
        starves the one that decides whether the click lands.
     3. A FLOOR, APPLIED PER AXIS — 22px, this app's own smallest deliberate control size (.bai-send,
        .bai-fb-btn, .bai-dt-navbtn), so it is arguable but not arbitrary. It is NOT axis-blind, and the first
        version of this audit was: it flagged #baiModelBtn at 61x20 in the status strip as a failure. But 61px
        along the axis the pointer travels is generous, 20px is the cheap axis, and .bai-status declares
        `height: 20px` — so "raise the button" really means "make the button taller than the strip it lives in",
        which is meaningless. The honest split:
          - TRAVEL AXIS < 22  -> FAIL for every control. This is the dimension that decides the click.
          - CROSS AXIS < 22 on an ICON-ONLY control -> FAIL. Both its axes are the same order of magnitude and
            the whole small box is the target, so a thin cross axis really does shrink it.
          - CROSS AXIS < 22 on a TEXT control -> INFO, not FAIL. That height is set by the row's typographic
            density (a deliberately recessive 20px status strip), which is a different decision from target
            size — but it is REPORTED, because an exception that leaves no trace is how a floor quietly dies.

   EXEMPT, explicitly rather than silently — a control whose SHAPE IS ITS SEMANTICS. A toggle switch is 28x16
   because a switch depicts a track with a knob travelling along it; that landscape is the control, not a
   padding decision, so clauses 2 and 3 do not apply to its cross-axis. Anything added here must be a shape
   that MEANS something, not merely a box someone wanted smaller. */
const { chromium } = require('C:\\Users\\hello\\AppData\\Roaming\\npm\\node_modules\\playwright');

const URL = 'http://localhost:8410/blueai-desktop/index.html';
const FLOOR = 22;
const SHAPE_IS_SEMANTICS = ['bai-tgl'];   // see EXEMPT above — add only with a reason in this file

const SCAN = (label) => {
  const out = [];
  const sel = 'button, [role="button"], .bai-tgl, .bai-cat-row, .bai-menu-item, .bai-opt-row';
  [...document.querySelectorAll(sel)].forEach(el => {
    if (!el.offsetParent) return;
    if (el.closest('#baiPreview')) return;                       // dev-only panel, not product surface
    /* BLUESTACKS' OWN CHROME — out of this design system entirely, so out of this gate too (designer's
       ruling, 2026-08-11: the install dialog "shouldn't be a part of any Audit or style guide or DS or
       VDA for blueAI desktop"). Its buttons are 26×26 BlueStacks icon buttons at BlueStacks' own metrics;
       judging them against rule 48's floor would be measuring third-party software against our rules and
       reporting the mismatch as our defect. This is a REAL exemption, not a convenience one — which is why
       it names the boundary prefix rather than a single id: `.bs-*` means "not ours". */
    if (el.closest('.bs-ui, #bsInstallHost, .bs-window')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return;
    const svg = el.querySelector('svg'), cv = el.querySelector('canvas');
    const glyph = svg ? svg.getBoundingClientRect() : (cv ? cv.getBoundingClientRect() : null);
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const par = el.parentElement, ps = par ? getComputedStyle(par) : null;
    let axis = 'block';
    if (ps && ps.display.indexOf('flex') >= 0) axis = ps.flexDirection.indexOf('column') >= 0 ? 'vertical' : 'horizontal';
    // offsetWidth/offsetHeight, NOT getBoundingClientRect: #scaler puts a CSS transform on the whole app, so
    // rect values are SCALED viewport pixels — at compact width (scale ~0.33) every real 22px control measured
    // 7.2px and the first run of this audit reported 54 false failures, including controls it had just passed
    // at wide width. offset* are unscaled layout pixels, which is the space the design is authored in and the
    // only space in which a px floor means anything. (The same scaled-vs-local divide bit placeFloating.)
    out.push({
      ctx: label,
      sel: (el.id ? '#' + el.id : '') + '.' + (el.className || '').split(' ').filter(Boolean).join('.'),
      classes: (el.className || '').split(' ').filter(Boolean),
      text: text.slice(0, 20),
      iconOnly: text.length === 0 && !!glyph,
      w: el.offsetWidth, h: el.offsetHeight,
      rectW: Math.round(r.width * 10) / 10, rectH: Math.round(r.height * 10) / 10,
      axis
    });
  });
  return out;
};

async function surfaces(p, push) {
  const alive = () => p.evaluate(() => {
    const ui = document.getElementById('baiUi');
    return !!ui && ui.classList.contains('show') && ui.getBoundingClientRect().height > 50;
  });
  const closeOverlays = () => p.evaluate(() => {
    ['baiDialog', 'baiTgModal', 'baiAiModal', 'baiOocModal'].forEach(id => { const e = document.getElementById(id); if (e) e.classList.remove('on'); });
    const n = document.getElementById('baiCreditNote'); if (n) n.classList.remove('on');
    const d = document.getElementById('baiDtPicker'); if (d) d.style.display = 'none';
  });
  const tab = (m) => p.evaluate((mm) => {
    const t = document.querySelector('.bai-tab[data-mode="' + mm + '"]') || document.querySelector('.bai-side-item[data-mode="' + mm + '"]');
    if (t) t.click();
  }, m);
  const step = async (label, fn) => {
    try { await fn(); } catch (e) { push.fail('THREW in ' + label + ': ' + e.message); return; }
    await p.waitForTimeout(650);
    // A surface that yields nothing must be reported, never counted as clean — a silent zero here once let a
    // whole run of contexts read as passing when the app had actually gone hidden.
    if (!(await alive())) { push.fail('app not visible at surface "' + label + '" — not audited'); return; }
    const rows = await p.evaluate(SCAN, label);
    if (!rows.length) { push.fail('zero controls found at surface "' + label + '" — not audited'); return; }
    push.rows(rows);
  };

  await step('chat', async () => {});
  await step('menu:model', async () => p.evaluate(() => document.getElementById('baiModelBtn').click()));
  await step('menu:help', async () => { await closeOverlays(); await p.evaluate(() => document.getElementById('baiHelpBtn').click()); });
  await step('menu:acct', async () => { await closeOverlays(); await p.evaluate(() => document.getElementById('baiAcctBtn').click()); });
  await step('skills', async () => { await closeOverlays(); await tab('skills'); });
  await step('skills:mine', async () => p.evaluate(() => { const r = [...document.querySelectorAll('#paneSkills .bai-cat-row')].find(e => /My Skills/i.test(e.textContent)); if (r) r.click(); }));
  await step('skills:new', async () => {
    await p.evaluate(() => { const bk = document.querySelector('.bai-subpane-back'); if (bk) bk.click(); });
    await p.waitForTimeout(400);
    await p.evaluate(() => document.getElementById('baiSkillCta').click());
  });
  await step('sched', async () => tab('scheduled'));
  await step('sched:new', async () => p.evaluate(() => document.getElementById('baiSchedAdd').click()));
  await step('sched:picker', async () => p.evaluate(() => document.getElementById('baiDtField').click()));
  await step('jobs', async () => { await closeOverlays(); await tab('jobs'); });
  await step('settings', async () => { await closeOverlays(); await p.evaluate(() => { const s = document.getElementById('baiSettingsBtn') || document.querySelector('.bai-side-item[data-mode="settings"]'); if (s) s.click(); }); });
  await step('settings:hybrid', async () => p.evaluate(() => { const c = [...document.querySelectorAll('#baiAiModeCard .bai-optcard')].find(x => x.textContent.trim().indexOf('Hybrid') === 0); if (c) c.click(); }));
  await step('aimodal', async () => p.evaluate(() => { const c = [...document.querySelectorAll('#baiAiModeCard .bai-optcard')].find(x => x.textContent.trim().indexOf('Auto') === 0); if (c) c.click(); }));
  await step('tgmodal', async () => {
    await closeOverlays();
    await p.evaluate(() => { const b = [...document.querySelectorAll('#baiNotifyCard button')].find(x => /Connect Telegram/i.test(x.textContent)); if (b) b.click(); });
  });
  await step('dialog', async () => { await closeOverlays(); await p.evaluate(() => document.getElementById('baiTbClose').click()); });
  await step('creditnote', async () => {
    await closeOverlays();
    await p.evaluate(() => { const f = document.getElementById('baiPreviewFab'); if (f && !f.classList.contains('hidden')) f.click(); });
    await p.waitForTimeout(300);
    await p.evaluate(() => { const rows = [...document.querySelectorAll('#baiPreviewRows .bai-preview-row')]; const r = rows.find(x => /Credits added/.test(x.textContent)); if (r) r.querySelector('.bai-preview-action').click(); });
    await p.evaluate(() => { const c = document.getElementById('baiPreviewCollapse'); if (c) c.click(); });
  });
  await step('donecard', async () => {
    await closeOverlays(); await tab('chat'); await p.waitForTimeout(400);
    await p.evaluate(() => { const f = document.getElementById('baiPreviewFab'); if (f && !f.classList.contains('hidden')) f.click(); });
    await p.waitForTimeout(300);
    await p.evaluate(() => { const rows = [...document.querySelectorAll('#baiPreviewRows .bai-preview-row')]; const h = rows.find(x => /Chat states/.test(x.textContent)); if (h) h.click(); });
    await p.waitForTimeout(300);
    await p.evaluate(() => { const rows = [...document.querySelectorAll('#baiPreviewRows .bai-preview-row')]; const r = rows.find(x => x.textContent.trim().indexOf('Success') === 0); if (r) r.querySelector('.bai-preview-action').click(); });
    await p.waitForTimeout(1600);
    await p.evaluate(() => { const c = document.getElementById('baiPreviewCollapse'); if (c) c.click(); });
  });
}

(async () => {
  const b = await chromium.launch({ channel: 'msedge' });
  const results = [];
  const infra = [];
  const pageErrs = [];

  for (const vp of [{ width: 1400, height: 950, tag: 'wide' }, { width: 520, height: 950, tag: 'compact' }]) {
    const p = await b.newPage({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
    p.on('pageerror', e => pageErrs.push(vp.tag + ': ' + e.message));
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.evaluate(() => { try { localStorage.removeItem('baiWinGeom') } catch (e) {} });
    await p.click('.bs-window', { position: { x: 40, y: 40 } });
    await p.waitForTimeout(1200);
    await surfaces(p, {
      rows: rs => rs.forEach(r => results.push(Object.assign(r, { vp: vp.tag }))),
      fail: m => infra.push(vp.tag + ': ' + m)
    });
    await p.close();
  }
  await b.close();

  // Deduplicate to one row per (selector, viewport) — the worst measurement wins, so a control that is fine
  // on one surface and broken on another is judged on the broken one.
  const worst = new Map();
  results.forEach(r => {
    const k = r.sel + '|' + r.vp;
    const prev = worst.get(k);
    const score = Math.min(r.w, r.h) - (r.iconOnly && r.axis === 'horizontal' && r.w < r.h ? 1000 : 0);
    if (!prev || score < prev.score) worst.set(k, { r, score });
  });
  const rows = [...worst.values()].map(v => v.r);

  const exempt = r => r.classes.some(c => SHAPE_IS_SEMANTICS.indexOf(c) >= 0);
  const portrait = rows.filter(r => !exempt(r) && r.iconOnly && r.axis === 'horizontal' && r.w < r.h - 0.5);
  // travel axis = along the row: horizontal row -> width; vertical list -> height
  const travel = r => (r.axis === 'vertical' ? r.h : r.w);
  const cross = r => (r.axis === 'vertical' ? r.w : r.h);
  const thinTravel = rows.filter(r => !exempt(r) && travel(r) < FLOOR - 0.5);
  const thinCrossIcon = rows.filter(r => !exempt(r) && r.iconOnly && cross(r) < FLOOR - 0.5);
  const tooSmall = thinTravel.concat(thinCrossIcon.filter(r => thinTravel.indexOf(r) < 0));
  const crossInfo = rows.filter(r => !exempt(r) && !r.iconOnly && cross(r) < FLOOR - 0.5);

  const line = '='.repeat(78);
  console.log(line);
  console.log('ICON-TARGET AUDIT (taste rule 48) — ' + rows.length + ' control instances over ' +
    new Set(results.map(r => r.ctx)).size + ' surfaces x 2 widths');
  console.log(line);

  console.log('\nCLAUSE 2 — icon-only control in a horizontal row must be at least square');
  if (!portrait.length) console.log('  OK — no portrait icon buttons.');
  portrait.forEach(r => console.log('  FAIL  ' + r.w + 'x' + r.h + '  ' + r.sel + '   [' + r.vp + '/' + r.ctx + ']'));

  console.log('\nCLAUSE 3 — ' + FLOOR + 'px floor: travel axis for every control, both axes for icon-only');
  if (!tooSmall.length) console.log('  OK — every control clears ' + FLOOR + 'px on the axis that decides the click.');
  tooSmall.forEach(r => console.log('  FAIL  ' + r.w + 'x' + r.h + ' (' + r.axis + ' row, travel=' + travel(r) +
    ')  ' + r.sel + '  "' + r.text + '"   [' + r.vp + '/' + r.ctx + ']'));
  if (crossInfo.length) {
    console.log('\n  INFO — text controls thinner than ' + FLOOR + 'px on the CHEAP axis. Not failures (see clause 3),');
    console.log('  reported so the exception stays visible instead of silently becoming the norm:');
    [...new Set(crossInfo.map(r => '    ' + r.w + 'x' + r.h + '  ' + r.sel + '  "' + r.text + '"'))].forEach(s => console.log(s));
  }

  const ex = rows.filter(exempt);
  if (ex.length) {
    console.log('\nEXEMPT (shape is semantics — listed so the OK above is not read as "everything conforms")');
    [...new Set(ex.map(r => r.sel + ' ' + r.w + 'x' + r.h))].forEach(s => console.log('  ' + s));
  }

  if (infra.length) {
    console.log('\nSURFACES NOT AUDITED — these are not passes:');
    infra.forEach(m => console.log('  ' + m));
  }
  if (pageErrs.length) {
    console.log('\nPAGE ERRORS:');
    pageErrs.forEach(m => console.log('  ' + m));
  }

  const bad = portrait.length + tooSmall.length + infra.length + pageErrs.length;
  console.log('\n' + line);
  console.log(bad ? 'FAIL — ' + bad + ' problem(s).' : 'PASS — every audited control satisfies clauses 2 and 3.');
  console.log(line);
  console.log('WHAT THIS DOES NOT CHECK: clause 1 is a reasoning rule, not a measurable one — a box CAN be');
  console.log('  square for the wrong reason (a hard-coded width that happens to match) and pass here. It also');
  console.log('  says nothing about padding uniformity, glyph optical centring, or hover-ink extent, and it');
  console.log('  only sees surfaces this script knows how to open.');
  process.exit(bad ? 1 : 0);
})();
