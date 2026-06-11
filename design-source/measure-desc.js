// Measure where each agent description wraps (line count) in Stage Original.
const { chromium } = require('playwright')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/hero/stage-original', { waitUntil: 'networkidle' }).catch(() => {})
  await sleep(600)
  const thumbs = await page.$$('.rail .thumb')
  const out = []
  for (let i = 0; i < thumbs.length; i++) {
    await thumbs[i].click()
    await sleep(500)
    const info = await page.evaluate(() => {
      const el = document.querySelector('.pane-desc')
      if (!el) return null
      const txt = el.textContent
      // count visual lines via Range client rects
      const r = document.createRange(); r.selectNodeContents(el)
      const rects = Array.from(r.getClientRects()).filter(x => x.width > 1)
      const lh = parseFloat(getComputedStyle(el).lineHeight)
      const lines = Math.round(el.getBoundingClientRect().height / lh)
      return { txt, rectLines: rects.length, lines, widthPx: Math.round(el.getBoundingClientRect().width) }
    })
    out.push(info)
  }
  console.log(JSON.stringify(out, null, 2))
  await ctx.close(); await b.close()
})().catch((e) => { console.error(e); process.exit(1) })
