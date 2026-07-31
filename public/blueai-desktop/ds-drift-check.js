#!/usr/bin/env node
/* ============================================================================
   ds-drift-check.js — mechanical drift detector between the product and its
   design system. Run from this folder:  node ds-drift-check.js

   WHY THIS EXISTS
   The product and the style guide already share their CSS and their icon set,
   so those two cannot drift. Three things still CAN, because the guide authors
   them by hand:
     1. COPY      — a specimen can show invented strings. This happened twice
                    (a whole invented login-gate flow; a wrong OOC CTA) and both
                    times it took a human comparing screenshots to catch it.
     2. COVERAGE  — a new component can ship with no specimen at all.
     3. ICONS     — the guide could name a glyph the product does not have.

   This turns all three into pass/fail instead of a promise. Exits non-zero on
   any finding, so it can gate a commit.
   ============================================================================ */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const read = f => fs.readFileSync(path.join(DIR, f), 'utf8');
const PROD = read('index.html');
const GUIDE = read('style-guide.html');
const CSS = read('blueai-desktop.css');
const ICONS = read('blueai-icons.js');

let fail = 0;
const section = t => console.log('\n' + t + '\n' + '-'.repeat(t.length));

// Normalise entity/quote/ellipsis variants so we compare meaning, not encoding.
const norm = s => s
  .replace(/&rsaquo;/g, '›').replace(/&lsaquo;/g, '‹').replace(/&hellip;/g, '…')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&times;/g, '×')
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/\s+/g, ' ').trim();

const prodText = norm(PROD);

/* ---------- 1. COPY ---------- */
section('1. SPECIMEN COPY (button labels + placeholders)');
/* Scope is deliberately narrow: button labels and input placeholders, not all specimen text.
   Prose in the guide's own notes is legitimately the guide's, and sample data (names, emails,
   dates, counts) is legitimately fake. Button labels and placeholders are the copy a developer
   transcribes verbatim as if it were product copy — and they are exactly what was wrong both
   times this failed ("Continue with Google", "Maybe later", "Get Prime" vs "Try for $3.99").
   Narrow and certain beats broad and noisy. */
const strings = new Set();
const BTN_RE = new RegExp('<button\\b([^>]*)>([\\s\\S]*?)<\\/button>', 'g');
for (const m of GUIDE.matchAll(BTN_RE)) {
  if (/id="sg[A-Z]/.test(m[1])) continue;                 // the guide's own theme controls
  /* Compare each TEXT SEGMENT separately, not the button's flattened text. A button that wraps
     child elements (title + sub-label + badge) has a concatenation that appears nowhere in the
     product even when every part is verbatim — the first version of this check reported four such
     false positives. Splitting on tags keeps the check precise. */
  m[2].split(/<[^>]+>/).forEach(seg => {
    const label = norm(seg);
    if (label.length > 2 && /[a-zA-Z]{3}/.test(label)) strings.add(label);
  });
}
for (const m of GUIDE.matchAll(/placeholder="([^"]+)"/g)) {
  const s = norm(m[1]);
  if (s.length > 2) strings.add(s);
}
// Generic demo labels the guide writes for its own comparison rows, not quotes from the product.
const GUIDE_OWN = [
  /^Secondary$/, /^Primary$/, /^Primary · hero$/, /^Secondary · hero$/,
];
const suspicious = [...strings].filter(s => !GUIDE_OWN.some(re => re.test(s)) && prodText.indexOf(s) === -1);
if (suspicious.length) {
  console.log('SUSPICIOUS — present in a specimen, absent from index.html. Either the product changed');
  console.log('and the specimen went stale, or the copy was invented:');
  suspicious.forEach(s => console.log('   "' + s + '"'));
  fail += suspicious.length;
} else {
  console.log('OK — all ' + strings.size + ' specimen button labels / placeholders exist in the product.');
}

/* ---------- 2. COVERAGE ---------- */
section('2. SPECIMEN COVERAGE');
const selectorsOnly = CSS.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^}]*\}/g, '|');
const defined = new Set();
for (const m of selectorsOnly.matchAll(/(^|[\s,>+~|])\.([a-zA-Z][\w-]*)/g)) {
  if (m[2].indexOf('sg-') !== 0) defined.add(m[2]);
}
const rendered = new Set();
for (const m of GUIDE.matchAll(/class="([^"]+)"/g)) {
  m[1].split(/\s+/).forEach(c => { if (c && c.indexOf('sg-') !== 0 && c !== 'bai-scope') rendered.add(c); });
}
const uncovered = [...defined].filter(c => !rendered.has(c)).sort();
const pct = Math.round((defined.size - uncovered.length) / defined.size * 100);
const FLOOR = 74;   // a regression floor, not a target
console.log('coverage: ' + (defined.size - uncovered.length) + '/' + defined.size + ' (' + pct + '%)');
if (pct < FLOOR) {
  console.log('FAIL — below the ' + FLOOR + '% floor. A new component shipped without a specimen.');
  console.log('  uncovered: ' + uncovered.join(' '));
  fail++;
} else {
  console.log('OK — at or above the ' + FLOOR + '% floor. ' + uncovered.length + ' classes uncovered (expected; the guide lists them).');
}

/* ---------- 3. ICONS: guide must not name a glyph outside the shared set ---------- */
section('3. ICON SET');
const iconNames = new Set([...ICONS.matchAll(/^ {2}([a-zA-Z]\w*):/gm)].map(m => m[1]));
const used = new Set(
  [...GUIDE.matchAll(/data-icon="([^"]+)"/g)].map(m => m[1])
    .concat([...GUIDE.matchAll(/icon\('([^']+)'/g)].map(m => m[1]))
);
const unknown = [...used].filter(n => !iconNames.has(n) && n !== 'definitelyNotAnIcon');
if (unknown.length) {
  console.log('FAIL — guide names icons absent from blueai-icons.js: ' + unknown.join(', '));
  fail++;
} else {
  console.log('OK — all ' + used.size + ' referenced icons are in the shared set of ' + iconNames.size + '.');
}

/* ---------- 4. ICON SSOT: product must consume the module, not re-declare paths ---------- */
section('4. ICON SSOT');
const relit = [...PROD.matchAll(/var ([A-Z_]+_PATH)\s*=\s*'/g)].map(m => m[1]);
if (relit.length) {
  console.log('FAIL — index.html re-declares icon paths as literals instead of BAI_ICONS: ' + relit.join(', '));
  fail++;
} else {
  console.log('OK — index.html takes its named icon constants from BAI_ICONS.');
}

/* ---------- 5. The guide must LINK the product CSS, never copy it ---------- */
section('5. SHARED STYLESHEET');
const linksCss = /<link[^>]+href="blueai-desktop\.css"/.test(GUIDE);
const hasOwnStyle = (GUIDE.match(/<style>/g) || []).length;
const styleLen = (GUIDE.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1].length;
const leaksBai = /<style>[\s\S]*?\.bai-(?!scope)[\w-]+\s*\{/.test(GUIDE);
console.log('links blueai-desktop.css: ' + linksCss + ' | own <style> blocks: ' + hasOwnStyle + ' (' + styleLen + ' chars, sg- chrome)');
if (!linksCss || leaksBai) {
  console.log('FAIL — the guide must link the product stylesheet and must not restyle .bai-* itself.');
  fail++;
} else {
  console.log('OK — styles come from the product sheet; the guide only defines its own sg- chrome.');
}

/* ---------- 6. ICON DUPLICATION: how much of the set is still inlined in the product? ---------- */
section('6. ICON DUPLICATION (reported, not failed)');
/* Not a failure: most inline copies live in STATIC markup, which cannot reference a JS variable
   without changing how those icons render — a product refactor, not a docs fix. Reported so the
   number is visible and cannot quietly grow, and so blueai-icons.js's header stays honest. */
const iconEntries = [...ICONS.matchAll(/^ {2}(\w+): "(.+)",$/gm)].map(m => [m[1], m[2].replace(/\\"/g, '"')]);
const consumed = new Set([...PROD.matchAll(/BAI_ICONS\.(\w+)/g)].map(m => m[1]));
let inlineDupes = 0, worst = [];
iconEntries.forEach(([k, v]) => {
  const n = PROD.split(v).length - 1;
  if (n > 0) { inlineDupes++; if (n >= 3) worst.push(k + '×' + n); }
});
console.log('consumed from the module: ' + consumed.size + '/' + iconEntries.length +
            '  |  also inline in index.html: ' + inlineDupes + '/' + iconEntries.length);
if (worst.length) console.log('  most duplicated: ' + worst.join(', '));
console.log('  (editing an inline copy can leave the module stale — see the header note in blueai-icons.js)');

/* ---------- 7. DEAD CSS: classes in the stylesheet with no call site anywhere ---------- */
section('7. DEAD CSS (reported, not failed)');
/* Dead classes inflate the coverage denominator, so "what's left to document" mixes real gaps with
   garbage. Reported rather than failed because deleting a rule is a product change. */
const sources = PROD + (fs.existsSync(path.join(DIR, 'boot.js')) ? read('boot.js') : '') +
                (fs.existsSync(path.join(DIR, 'flows.js')) ? read('flows.js') : '');
const NOT_DEAD = ['bai-scope'];   // the style guide's intentional tokens-only alias; never in the product by design
const dead = [...defined].filter(c => {
  if (NOT_DEAD.indexOf(c) !== -1) return false;
  if (c.indexOf('bai-') !== 0 && c.indexOf('lg-') !== 0 && c.indexOf('cr-') !== 0 &&
      c.indexOf('aic-') !== 0 && c.indexOf('ooc-') !== 0 && c.indexOf('tgm-') !== 0) return false;
  return sources.indexOf(c) === -1;
}).sort();
if (dead.length) {
  console.log(dead.length + ' class(es) styled but never referenced by index.html / boot.js / flows.js:');
  console.log('  ' + dead.join(' '));
  console.log('  These inflate the coverage denominator. Either delete the rules or mark them CSS-only.');
} else {
  console.log('OK — every styled class has a call site.');
}

/* ---------- 8. SIZE SCALE: no raw px sizes outside the allowed exceptions ---------- */
section('8. SIZE SCALE');
/* Without this the scale decays inside a week — the next component copies whatever literal is nearest,
   which is exactly how the file reached 20 font-sizes and 15 radii. Two allowed exceptions:
   the token declarations themselves, and the dev Preview panel (position:fixed outside .drawer, so
   .drawer-scoped tokens cannot resolve there — see the note above its block). */
function rawSizes(text, file) {
  const out = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (/--bai-(fs|r|glyph)-[a-z0-9]+:\s*[\d.]+px/.test(line)) return;      // the token block itself
    if (line.indexOf('.bai-preview') === 0) return;                          // documented exception
    const m = line.match(/(font-size|border-radius):\s*([\d.]+px)/);
    if (m) out.push(file + ':' + (i + 1) + '  ' + m[0].trim());
  });
  return out;
}
const rawFound = rawSizes(CSS, 'blueai-desktop.css').concat(rawSizes(PROD, 'index.html'));
if (rawFound.length) {
  console.log('FAIL — raw px size(s) outside the token scale. Use a --bai-fs-* / --bai-r-* token:');
  rawFound.slice(0, 12).forEach(r => console.log('   ' + r));
  if (rawFound.length > 12) console.log('   ... +' + (rawFound.length - 12) + ' more');
  fail++;
} else {
  const fsTok = new Set([...CSS.matchAll(/font-size:\s*var\((--bai-(?:fs|glyph)-[a-z0-9-]+)\)/g)].map(m => m[1]));
  const rTok = new Set([...CSS.matchAll(/border-radius:\s*var\((--bai-r-[a-z0-9-]+)\)/g)].map(m => m[1]));
  console.log('OK — every product size goes through a token (' + fsTok.size + ' size tokens, ' + rTok.size + ' radius tokens in use).');
}

console.log('\n' + '='.repeat(64));
console.log(fail === 0
  ? 'PASS — no drift detected between the product and its design system.'
  : 'FAIL — ' + fail + ' drift finding(s) above.');
console.log('='.repeat(64));
process.exit(fail === 0 ? 0 : 1);
