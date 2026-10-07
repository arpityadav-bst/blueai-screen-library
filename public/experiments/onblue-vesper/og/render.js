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
// node og/render.js                   renders both
// node og/render.js og-business.html  renders just the one named
const ALL = [
  ['og-creators.html', 'og-creators.png'],
  ['og-business.html', 'og-business.png'],
  ['og-creators-b.html', 'og-creators-b.png'],
  ['og-business-b.html', 'og-business-b.png'],
];
const ASKED = process.argv.slice(2);
const CARDS = ASKED.length ? ASKED.map((f) => [f, f.replace(/\.html$/, '.png')]) : ALL;

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

    /* THE LAYOUT IS CHECKED, NOT TRUSTED. Every box on these cards has a fixed
       size so the card cannot reflow; the cost is that too much copy runs off
       its column without anything looking broken in the source. This fails the
       render instead: each line of copy must fit the column it sits in, and
       everything drawn must stay 40px inside the card's edges, where feeds and
       phone previews crop.
       IT FAILS ON AN EMPTY PAGE TOO. A check that matches nothing passes by
       saying nothing, which is how the step-strip version of these checks
       would have outlived the step strip; so it requires the copy it checks. */
    const faults = await page.evaluate(() => {
      const out = [];
      /* NO SCROLLBAR GUTTER. A reserved gutter once painted a 10px strip of
         page white down the right of every card. It is read from the style, not
         measured: the gutter is painted over the content without changing
         layout, so clientWidth, innerWidth and every element's rect still say
         1200 while the strip is on screen. A width check was written first and
         passed a card with the strip showing; this one was tested against it. */
      const gutter = getComputedStyle(document.documentElement).scrollbarGutter;
      if (gutter !== 'auto') { out.push('html has scrollbar-gutter: ' + gutter + ', which paints a strip down the right edge'); }
      const lines = document.querySelectorAll('.og-promise, .og-sub');
      if (!lines.length) { out.push('no .og-promise found to check'); }
      lines.forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 1) {
          out.push(el.className + ' runs past its column by ' + (el.scrollWidth - el.clientWidth) + 'px');
        }
      });
      /* data-bleed marks a picture that is meant to run off the card, like a
         portrait cropped by the frame; everything else keeps the margin */
      document.querySelectorAll('.og-top > *, .og-copy > *, .og-art > *:not([data-bleed])').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.left < 40 || r.top < 40 || r.right > 1160 || r.bottom > 590) {
          out.push((el.className || el.tagName.toLowerCase()) + ' reaches into the crop margin ('
            + [r.left, r.top, r.right, r.bottom].map(Math.round).join(', ') + ')');
        }
      });
      return out;
    });
    if (faults.length) { throw new Error(src + ': ' + faults.join('; ')); }
    await page.waitForTimeout(1200);
    const file = path.join(__dirname, out);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log('rendered', out, JSON.stringify(fonts));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
