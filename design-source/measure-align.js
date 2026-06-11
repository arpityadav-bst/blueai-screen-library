// Verify nav / hero / body container left-edges align on all 3 homepages.
const { chromium } = require('playwright')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const ROUTES = ['/hero/stage', '/hero/stage-original', '/hero/3-cards']
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  for (const r of ROUTES) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle' }).catch(() => {})
    await sleep(500)
    const m = await page.evaluate(() => {
      const pick = (sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) } }
      return { nav: pick('.nav'), hero: pick('.hero'), wrap: pick('.bai-home .wrap') }
    })
    console.log(r, JSON.stringify(m))
  }
  await ctx.close(); await b.close()
})().catch((e) => { console.error(e); process.exit(1) })
