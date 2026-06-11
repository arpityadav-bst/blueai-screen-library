// Screenshot a specific element by selector after scrolling to it.
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')
const SHOTS = 'N:/Antigravity Main/blueai/__preview'
fs.mkdirSync(SHOTS, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const url = process.argv[2]
const sel = process.argv[3]
const name = process.argv[4] || 'el'
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'center' }), sel)
  await sleep(1000)
  const el = await page.$(sel)
  if (el) await el.screenshot({ path: path.join(SHOTS, `${name}.png`) })
  else console.log('NOT FOUND', sel)
  await ctx.close(); await b.close()
  console.log('DONE', name)
})().catch((e) => { console.error(e); process.exit(1) })
