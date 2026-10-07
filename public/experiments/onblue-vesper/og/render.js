// Renders the two share cards to 1200 x 630 PNGs.
//
//   1. serve the onblue-vesper folder on :8412 (scripts/nocache_static_server.py)
//   2. node og/render.js
//
// IT WAITS FOR THE FONTS, NOT FOR A NUMBER OF MILLISECONDS. A card captured
// before Instrument Serif arrives sets the accent in the fallback serif, and
// nothing about the PNG would say so; this asks the font set whether both faces
// are in and stops with an error if they are not.
// THE PAUSE AFTER THAT IS FOR THE GLYPH FIELD, which draws on animation frames
// and has nothing to await.
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(require('path').join(process.env.APPDATA || '', 'npm/node_modules/playwright'))); }
const path = require('path');

const BASE = process.env.OG_BASE || 'http://localhost:8412/og/';
const CARDS = [
  ['og-creators.html', 'og-creators.png'],
  ['og-business.html', 'og-business.png'],
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  for (const [src, out] of CARDS) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(BASE + src, { waitUntil: 'networkidle' });
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      const imgs = Array.from(document.images);
      await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
      return {
        inter: document.fonts.check('500 58px Inter'),
        serif: document.fonts.check('italic 400 62px "Instrument Serif"'),
        brokenImages: imgs.filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')),
      };
    });
    if (!fonts.inter || !fonts.serif) { throw new Error(src + ': fonts not loaded ' + JSON.stringify(fonts)); }
    if (fonts.brokenImages.length) { throw new Error(src + ': images failed ' + fonts.brokenImages.join(', ')); }
    await page.waitForTimeout(1200);
    const file = path.join(__dirname, out);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log('rendered', out, JSON.stringify(fonts));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
