// Deterministic test of the "just-left card re-animates" bug.
// Hover card0 (it plays + completes), then hover card1 → card0 goes idle.
// Capture card0 at +80ms and +400ms: it must stay at the completed state (static), not replay.
const { chromium } = require('playwright')
const path = require('path')
const SHOTS = 'N:/Antigravity Main/blueai/__preview'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = async (page, sel, name) => { const el = await page.$(sel); if (el) await el.screenshot({ path: path.join(SHOTS, name + '.png') }) }
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/hero/3-cards', { waitUntil: 'networkidle' }).catch(() => {})
  await sleep(800)
  const c1 = '.agents .card:nth-child(1)'
  const c2 = '.agents .card:nth-child(2)'
  // hover card0 → it replays from scratch; wait for it to finish
  await page.hover(c1); await sleep(3200)
  await shot(page, c1, 'ho-before')      // card0 completed (Applied ✓), still hovered
  // move hover to card1 → card0 should snap to completed (NOT re-animate)
  await page.hover(c2)
  await sleep(80);  await shot(page, c1, 'ho-leave80')
  await sleep(320); await shot(page, c1, 'ho-leave400')
  await ctx.close(); await b.close()
  console.log('DONE')
})().catch((e) => { console.error(e); process.exit(1) })
