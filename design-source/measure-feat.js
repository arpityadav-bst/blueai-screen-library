// Measure all feature-image widths + which side they're on (verify ALL got bigger).
const { chromium } = require('playwright')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/hero/stage', { waitUntil: 'networkidle' }).catch(() => {})
  await sleep(600)
  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.feat')).map((feat, i) => {
      const vis = feat.querySelector('.feat-visual')
      const txt = feat.querySelector('.feat-text')
      const vr = vis.getBoundingClientRect(), tr = txt.getBoundingClientRect()
      return {
        row: i + 1,
        reverse: feat.classList.contains('reverse'),
        imageWidth: Math.round(vr.width),
        textWidth: Math.round(tr.width),
        imageSide: vr.left < tr.left ? 'left' : 'right',
      }
    })
  })
  console.log(JSON.stringify(data, null, 2))
  await ctx.close(); await b.close()
})().catch((e) => { console.error(e); process.exit(1) })
