// Test the mobile style-guide chip nav: top state + jump-to-a-section.
const { chromium } = require('playwright')
const path = require('path')
const SHOTS = 'N:/Antigravity Main/blueai/__preview'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/style-guide', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await sleep(1200)
  await page.screenshot({ path: path.join(SHOTS, 'chipnav-top.png') }) // chip bar at top
  // tap a mid section chip and verify it jumps + bar stays sticky + chip active
  await page.click('[data-chip="composer"]')
  await sleep(1000)
  await page.screenshot({ path: path.join(SHOTS, 'chipnav-jump.png') })
  await ctx.close(); await b.close()
  console.log('DONE')
})().catch((e) => { console.error(e); process.exit(1) })
