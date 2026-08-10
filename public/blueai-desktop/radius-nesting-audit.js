/* NESTED-RADIUS AUDIT — the designer's rule: when a rounded element sits inside another rounded
   element near its corners, the inner radius must be smaller (concentric: r_inner ≈ r_outer − inset),
   or the curves read as non-parallel. Runtime scan: for every visible element with a border-radius
   and a visible edge (bg/border/shadow), find its nearest rounded ancestor; if the element sits CLOSE
   to that ancestor's corner (inset < outer radius + 6px) and r_inner >= r_outer − inset + 1, flag it. */
const { chromium } = require('C:\\Users\\hello\\AppData\\Roaming\\npm\\node_modules\\playwright');

const SURFACES = ['chat', 'skills', 'scheduled', 'settings', 'jobs'];

async function scan(p) {
  return p.evaluate(() => {
    const seen = new Map();
    const visible = el => {
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return false;
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05;
    };
    const edge = cs => (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent')
      || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
    const rad = cs => parseFloat(cs.borderTopLeftRadius) || 0;
    document.querySelectorAll('*').forEach(el => {
      if (!visible(el)) return;
      const cs = getComputedStyle(el);
      const ri = rad(cs);
      if (!ri || !edge(cs)) return;
      if (cs.borderTopLeftRadius.includes('%')) return;          // circles are shapes, not scale steps
      // nearest rounded ancestor with an edge
      let a = el.parentElement;
      while (a && a !== document.body) {
        const acs = getComputedStyle(a);
        if (rad(acs) > 0 && edge(acs) && visible(a) && !acs.borderTopLeftRadius.includes('%')) break;
        a = a.parentElement;
      }
      if (!a || a === document.body) return;
      // The style guide's OWN chrome is not a product container (2026-08-11). `.sg-spec`/`.sg-canvas` are
      // documentation cards that wrap product components purely to display them — a `.bai-side-item` does not
      // owe its radius to the doc card it is being demonstrated inside, and rule 44 is about curves that MEET
      // in the real product. Left unfiltered, this reported 2 permanent "mismatches" demanding a 1px radius on
      // a sidebar row, which is the kind of standing noise that teaches you to skim a gate's output — the
      // inverse of the "green light over an unexamined area" problem this project already names, and just as
      // corrosive. Product pairs inside the guide are still caught: only the guide's own wrapper is skipped,
      // so the scan walks PAST it to the next rounded ancestor rather than stopping.
      if (/\bsg-(spec|canvas)\b/.test(String(a.className || ''))) return;
      const acs = getComputedStyle(a);
      const ro = rad(acs);
      const er = el.getBoundingClientRect(), ar = a.getBoundingClientRect();
      const inset = Math.min(er.left - ar.left, er.top - ar.top, ar.right - er.right, ar.bottom - er.bottom);
      if (inset < 0) return;                                      // overflowing/absolute — different problem
      if (inset >= ro) return;   // curves only MEET when the inner element sits inside the outer curve zone — deeper than the radius, any inner radius is fine
      const ideal = Math.max(0, ro - inset);
      if (ri >= ideal + 1.5) {
        const key = (el.className && String(el.className).split(/\s+/)[0] || el.tagName) + '<' +
                    (a.className && String(a.className).split(/\s+/)[0] || a.tagName);
        if (!seen.has(key)) seen.set(key, {
          child: String(el.className || el.tagName).slice(0, 44), rIn: ri,
          parent: String(a.className || a.tagName).slice(0, 44), rOut: ro,
          inset: Math.round(inset * 10) / 10, ideal: Math.round(ideal * 10) / 10,
        });
      }
    });
    return [...seen.values()];
  });
}

(async () => {
  const b = await chromium.launch();
  const found = new Map();
  for (const s of SURFACES) {
    const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
    await p.goto('http://localhost:8410/blueai-desktop/index.html');
    await p.evaluate(() => {
      localStorage.setItem('baiWin', JSON.stringify({ d: 1, l: 40, t: 20, w: 430, h: 880 }));
      localStorage.setItem('baiTheme', 'light'); localStorage.setItem('baiPageState', 'loggedin');
    });
    await p.reload(); await p.waitForTimeout(700);
    await p.locator('#bsWindow').click({ force: true }); await p.waitForTimeout(4200);
    await p.evaluate((s) => { const el = document.querySelector('.bai-side-item[data-mode="' + s + '"], .bai-tab[data-mode="' + s + '"]'); if (el) el.click(); }, s);
    await p.waitForTimeout(900);
    // also open the skill-create + a My Skills subpane on skills for deeper coverage
    if (s === 'skills') { await p.evaluate(() => { const c = document.getElementById('baiSkillCta'); if (c) c.click(); }); await p.waitForTimeout(700); }
    (await scan(p)).forEach(f => { const k = f.child + '<' + f.parent; if (!found.has(k)) found.set(k, { ...f, on: s }); });
    await p.close();
  }
  // the guide too — the designer's example was its theme toggle... actually the product Settings seg; scan guide anyway
  const gp = await b.newPage({ viewport: { width: 1500, height: 1100 } });
  await gp.goto('http://localhost:8410/blueai-desktop/style-guide.html');
  await gp.waitForTimeout(2500);
  (await scan(gp)).forEach(f => { const k = f.child + '<' + f.parent; if (!found.has(k)) found.set(k, { ...f, on: 'guide' }); });
  await gp.close();
  console.log('NESTED-RADIUS MISMATCHES (inner too round for its container):');
  [...found.values()].sort((a, b) => (b.rIn - b.ideal) - (a.rIn - a.ideal)).forEach(f =>
    console.log('  [' + f.on + '] ' + f.child + '  r=' + f.rIn + '  inside  ' + f.parent + '  r=' + f.rOut +
      '  inset=' + f.inset + '  → ideal ≤ ' + f.ideal));
  console.log(found.size + ' distinct pair(s)');
  await b.close();
})().catch(e => { console.error('ERR ' + e.message); process.exit(1); });
