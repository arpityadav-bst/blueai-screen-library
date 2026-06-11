// Mobile capture: hero (top) + full page for a route.
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')
const SHOTS = 'N:/Antigravity Main/blueai/__preview'
fs.mkdirSync(SHOTS, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const url = process.argv[2]
const name = process.argv[3] || 'm'
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await sleep(1500)
  await page.screenshot({ path: path.join(SHOTS, `${name}-hero.png`) }) // top viewport
  await page.screenshot({ path: path.join(SHOTS, `${name}-full.png`), fullPage: true })
  await ctx.close(); await b.close()
  console.log('DONE', name)
})().catch((e) => { console.error(e); process.exit(1) })
