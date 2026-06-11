// Mobile element capture: scroll to a selector at 390px and shoot just that element.
const { chromium } = require('playwright')
const path = require('path')
const SHOTS = 'N:/Antigravity Main/blueai/__preview'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const url = process.argv[2], sel = process.argv[3], name = process.argv[4] || 'mel'
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await sleep(1200)
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel)
  await sleep(800)
  const el = await page.$(sel)
  if (el) await el.screenshot({ path: path.join(SHOTS, `${name}.png`) }); else console.log('NF', sel)
  await ctx.close(); await b.close()
  console.log('DONE', name)
})().catch((e) => { console.error(e); process.exit(1) })
