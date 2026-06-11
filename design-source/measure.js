// Measure each card's stage height vs its scene content height + footer gap.
const { chromium } = require('playwright')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ headless: true })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/hero/3-cards', { waitUntil: 'networkidle' }).catch(() => {})
  await sleep(4000) // let things settle
  const data = await page.evaluate(() => {
    const out = []
    document.querySelectorAll('.agents .card').forEach((card, i) => {
      const stage = card.querySelector('.stage')
      const sb = stage.getBoundingClientRect()
      // footer = the last flowed child likely (submit/views/port)
      const footer = stage.querySelector('.cr-submit, .cv-views, .fn-port')
      const fb = footer ? footer.getBoundingClientRect() : null
      // the element just above the footer in flow
      const kids = [...stage.children].filter(c => getComputedStyle(c).position !== 'absolute')
      const beforeFooter = kids.length >= 2 ? kids[kids.length - 2] : null
      const bb = beforeFooter ? beforeFooter.getBoundingClientRect() : null
      out.push({
        card: i,
        stageH: Math.round(sb.height),
        footer: footer ? footer.className : null,
        footerTop: fb ? Math.round(fb.top - sb.top) : null,
        contentBottom: bb ? Math.round(bb.bottom - sb.top) : null,
        gapAboveFooter: (fb && bb) ? Math.round(fb.top - bb.bottom) : null,
        bottomPad: fb ? Math.round(sb.bottom - fb.bottom) : null,
      })
    })
    return out
  })
  console.log(JSON.stringify(data, null, 2))
  await ctx.close(); await b.close()
})().catch((e) => { console.error(e); process.exit(1) })
