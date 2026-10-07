// Captures the creators hero's agent on a transparent ground, for og-creators.
//
//   1. serve the onblue-vesper folder on :8412
//   2. node og/agent-cut.js        (writes og/agent-raw.png, then crop to ink)
//
// THE SETTINGS ARE THE ONES THAT FIT. At the hero's own scale the head ran off
// the top of the canvas box; scale 4.4 with the model lowered 0.25 is what put
// the whole figure inside it with room at both ends. ?model= pins the agent
// and stops the swap cycle, which a still needs. ?op= is the glyph opacity,
// raised from the page's 0.5 so the figure holds at feed size.
// THE GROUND IS REMOVED BY STYLE, NOT BY KEYING. Everything but the model's
// canvas is hidden and every background cleared, so the PNG's alpha is the
// renderer's own rather than a guess at which pixels were the page.
// Crop the result to its alpha bounding box with 20px of padding to get
// og/agent.png (Pillow: Image.getchannel('A').getbbox()).
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { ({ chromium } = require(require('path').join(process.env.APPDATA || '', 'npm/node_modules/playwright'))); }
const path = require('path');

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1032, height: 1376 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8412/index.html?model=robot100&scale=4.4&y=-0.25&op=0.92', { waitUntil: 'networkidle' });
  await p.waitForTimeout(4500);
  await p.addStyleTag({ content: `
    html, body, body * { background: transparent !important; box-shadow: none !important; }
    body * { visibility: hidden !important; }
    #hero-ascii { visibility: visible !important; }
  ` });
  await p.waitForTimeout(400);
  await (await p.$('#hero-ascii')).screenshot({ path: path.join(__dirname, 'agent-raw.png'), omitBackground: true });
  await b.close();
  console.log('captured og/agent-raw.png');
})();
