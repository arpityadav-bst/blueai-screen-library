// Quick render check for the blueAI dev server (desktop). Run from Port (playwright).
const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')
const SHOTS = 'N:/Antigravity Main/blueai/__preview'
fs.mkdirSync(SHOTS, { recursive: true })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const url = process.argv[2] || 'http://localhost:3000/'
const name = process.argv[3] || 'home'
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {})
  await sleep(3500)
  await page.screenshot({ path: path.join(SHOTS, `${name}-top.png`) })
  await page.screenshot({ path: path.join(SHOTS, `${name}-full.png`), fullPage: true })
  await ctx.close()
  await b.close()
  console.log('DONE', name)
})().catch((e) => { console.error(e); process.exit(1) })
