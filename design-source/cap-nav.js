// Zoomed shot of the hero nav social-icon cluster (verify reddit size).
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')
const SHOTS = 'N:/Antigravity Main/blueai/__preview'
fs.mkdirSync(SHOTS, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const url = process.argv[2] || 'http://localhost:3000/hero/3-cards'
const name = process.argv[3] || 'nav-social'
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await sleep(800)
  const el = await page.$('.nav-right')
  if (el) await el.screenshot({ path: path.join(SHOTS, `${name}.png`) })
  await ctx.close(); await b.close()
  console.log('DONE')
})().catch((e) => { console.error(e); process.exit(1) })
