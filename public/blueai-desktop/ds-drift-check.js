#!/usr/bin/env node
/* ============================================================================
   ds-drift-check.js — mechanical drift detector between the product and its
   design system. Run from this folder:  node ds-drift-check.js

   WHY THIS EXISTS
   The product and the style guide share their CSS and their icon set, so the
   VALUES in those two cannot drift. What the guide still authors by hand can:
     1. COPY      — a specimen can show invented strings. This happened twice
                    (a whole invented login-gate flow; a wrong OOC CTA) and both
                    times it took a human comparing screenshots to catch it.
     2. COVERAGE  — a new component can ship with no specimen at all.
     3. ICONS     — the guide can name a glyph the product does not have, or name
                    a real glyph that is the WRONG one for that component (§9).

   HOW MUCH OF THAT IS ACTUALLY GATED — read the scope footer this prints at the
   end, not this paragraph. An earlier header claimed it "turns all three into
   pass/fail"; an audit showed §1 samples two element types, coverage is a floor
   rather than a check on correctness, and markup and STATES are not covered at
   all. That last gap is where the worst of the three historical defects lived,
   so the honest framing is: this narrows the gap, it does not close it.
   Exits non-zero on any finding, so it can gate a commit.
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
  /* Say "all N" only about the strings actually compared. GUIDE_OWN entries are EXEMPTED precisely
     because they do NOT exist in index.html, so counting them into an "all N verified" line made this
     section print a false claim on every run — inside the file whose whole purpose is stopping those. */
  const exempt = [...strings].filter(s => GUIDE_OWN.some(re => re.test(s))).length;
  console.log('OK — ' + (strings.size - exempt) + ' of ' + strings.size +
              ' specimen button labels / placeholders exist verbatim in the product.');
  if (exempt) console.log('   ' + exempt + ' exempted as the guide\'s own comparison labels, not product quotes: ' +
                          [...strings].filter(s => GUIDE_OWN.some(re => re.test(s))).map(s => '"' + s + '"').join(', '));
  console.log('   SCOPE: <button> text and placeholder= only. Markup, states and non-button copy are NOT checked here.');
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
/* The original regex was `var ([A-Z_]+_PATH)\s*=\s*'` — it could only see a `var` whose NAME ended in
   _PATH holding a single-quoted string. An audit found `CAT_ICONS`, an object literal five raw paths
   deep, sailing past it while this section printed OK. Match the SHAPE of the data (an SVG element in
   a string) rather than a naming convention the next author has no reason to follow. */
const relit = [...PROD.matchAll(/(?:var|const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*'\s*<(?:path|circle|rect|line|polyline|polygon)\b/g)]
  .map(m => m[1]);
const inObj = [...PROD.matchAll(/([A-Za-z_$][\w$]*)\s*:\s*'\s*<(?:path|circle|rect|line|polyline|polygon)\b/g)]
  .map(m => m[1]);
const offenders = [...new Set([...relit, ...inObj])];
if (offenders.length) {
  console.log('FAIL — index.html holds icon path literals instead of BAI_ICONS references: ' + offenders.join(', '));
  console.log('   Any glyph worth storing in a variable is worth naming in the module — an anonymous');
  console.log('   path cannot be cross-checked by §9, which is how a wrong icon shipped unnoticed.');
  fail++;
} else {
  console.log('OK — no icon path literals bound to variables or object keys in index.html.');
  console.log('   SCOPE: this reads index.html only. It does not open blueai-icons.js, so it is not a');
  console.log('   cross-reference — §6 is what measures module-vs-product duplication.');
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
const viaData = new Set([...PROD.matchAll(/data-bai-icon="(\w+)"/g)].map(m => m[1]));
console.log('consumed from the module: ' + new Set([...consumed, ...viaData]).size + '/' + iconEntries.length +
            '  |  also inline in index.html: ' + inlineDupes + '/' + iconEntries.length);
if (worst.length) console.log('  most duplicated: ' + worst.join(', '));

/* The number above only covers glyphs the module KNOWS. An independent audit found the header
   claiming "a true single source of truth for BOTH files" while the product still drew dozens of
   glyphs that were never added here — anonymous, therefore uncheckable by §9 or anything else.
   That omission is the more useful figure, so it is printed rather than described. */
const knownBodies = new Set(iconEntries.map(e => e[1]));
const inlineBodies = [...PROD.matchAll(/<svg\b(?![^>]*data-bai-icon)[^>]*>([\s\S]{5,1400}?)<\/svg>/g)]
  .map(m => m[1].trim()).filter(b => b && !knownBodies.has(b));
const tally = {};
inlineBodies.forEach(b => { tally[b] = (tally[b] || 0) + 1; });
const repeated = Object.values(tally).filter(v => v > 1);
console.log('  UNNAMED glyphs still inline (not in the module at all): ' + inlineBodies.length +
            ' occurrence(s), ' + Object.keys(tally).length + ' distinct' +
            (repeated.length ? '; ' + repeated.length + ' of them duplicated among themselves (' +
              repeated.reduce((a, b) => a + b, 0) + ' occurrences)' : ''));
console.log('  An anonymous path cannot be cross-checked by §9 — naming one is what turns');
console.log('  "is this the right icon here?" from unanswerable into a test.');

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
  /* Say what was actually checked. "every product size" was false on two counts an audit caught:
     the dev Preview panel is exempted wholesale (and holds several raw literals), and the regex only
     ever matched the `font-size`/`border-radius` SHORTHANDS in px — so a longhand corner slipped by. */
  const exemptRaw = CSS.split(/\r?\n/).filter(l => l.indexOf('.bai-preview') === 0 && /(font-size|border-radius):\s*[\d.]+px/.test(l)).length;
  const longhand = [...CSS.matchAll(/border-(?:top|bottom)-(?:left|right)-radius:\s*([\d.]+px)/g)].map(m => m[0]);
  console.log('OK — no raw font-size/border-radius px in the checked scope (' + fsTok.size +
              ' size tokens, ' + rTok.size + ' radius tokens in use).');
  console.log('   SCOPE: shorthand `font-size` and `border-radius` in px only. Widths, padding, gap,');
  console.log('   rem/em and the RIGHT-token question are all outside it.');
  if (exemptRaw) console.log('   ' + exemptRaw + ' raw literal(s) exempted inside .bai-preview (dev panel, documented).');
  if (longhand.length) {
    console.log('   NOTE — ' + longhand.length + ' raw radius LONGHAND(s) the shorthand regex cannot see: ' +
                longhand.join(', ') + '. Reported, not failed: these were invisible until an audit found them.');
  }
}

/* ---------------------------------------------------------------------------
   9. ICON CHOICE — not just "is this a real icon", but "is it the icon the product
      uses HERE". §3 only checks the name exists in the vocabulary, so the guide
      rendered a `gear` on the Ask-BlueAI tab for weeks: gear is a real icon, just
      the wrong one, and every check stayed green. Existence checks cannot catch a
      wrong-but-valid value; only a cross-reference can.

      Method: anchor on the LABEL. Where a specimen pairs an icon with visible text,
      find that same text in the product and read the icon named next to it. Works
      because the icon migration gave every path a name — before it, 15 of 24 icons
      were anonymous path literals and this check was impossible to write.
   --------------------------------------------------------------------------- */
section('9. ICON CHOICE (specimen icon vs the product\'s own icon)');
const pathConst = {};                                    // FOO_PATH -> icon name
[...PROD.matchAll(/var\s+([A-Z][A-Z0-9_]*)\s*=\s*BAI_ICONS\.(\w+)/g)].forEach(m => { pathConst[m[1]] = m[2]; });
const nameOf = tok => (tok in pathConst ? pathConst[tok] : tok);

/* An independent audit took this section apart and found four ways it could pass while wrong. All four
   are fixed below, because a check that can quietly succeed is the failure mode this whole file exists
   to prevent — and §9 was written precisely to close that class.
     (1) the label character class dropped anything with ':' , '›', ',' or over 40 chars — silently, so
         the printed denominator hid the exclusions. Widened, and the drops are now COUNTED.
     (2) if the regex matched nothing at all, `mism` was empty and the section printed OK 0/0 and
         passed. One markup reformat in the guide would have turned it into a permanent green no-op.
         There is now a floor.
     (3) `unverifiable` only ever printed. The single entry most in need of a human look was the one
         waved through — and that is exactly where the "New chat" wrong-glyph hid.
     (4) the ±320-char window around EVERY occurrence of a label was so wide that "Settings" pulled in
         5 icons across 64 sites, and Write/Upload/Ask BlueAI shared one identical candidate set
         because they sit in the same tabDefs array — so any permutation of those three passed.
         The window is now tight, and a label whose sites are all ambiguous is reported, not passed. */
const LABEL_RE = /data-icon="(\w+)"[^>]*>\s*<\/(?:span|div)>\s*([A-Za-z][^<]{2,60}?)\s*</g;
const rawPairs = [...GUIDE.matchAll(LABEL_RE)].map(m => ({ icon: m[1], label: m[2].trim() }));
const pairs = rawPairs.filter(x => x.label.length > 2);
const candidateIcons = (GUIDE.match(/data-icon="/g) || []).length;

const mism = [], unverifiable = [];
pairs.forEach(({ icon, label }) => {
  // EVERY occurrence, not the first. Checking only PROD.indexOf(label) made "Write" resolve to a code
  // comment that happened to start with the word — the same first-instance-wins mistake that produced
  // false positives in the specimen-fidelity audit. A label is verified if ANY of its sites agrees.
  const sites = [];
  for (let i = PROD.indexOf(label); i !== -1; i = PROD.indexOf(label, i + 1)) sites.push(i);
  if (!sites.length) { unverifiable.push(label + ' (label not found in product)'); return; }
  /* Tight window, and per-site rather than unioned. A site "agrees" only if the NEAREST named icon to
     that label is the specimen's icon. Unioning a wide window is what let three sibling tab labels
     share one candidate set and validate each other's glyph. */
  const WIN = 110;
  const verdicts = sites.map(at => {
    const from = Math.max(0, at - WIN), win = PROD.slice(from, at + WIN);
    const hits = [...win.matchAll(/BAI_ICONS\.(\w+)|data-bai-icon="(\w+)"|\b([A-Z][A-Z0-9_]*_PATH)\b/g)]
      .map(m => ({ name: nameOf(m[1] || m[2] || m[3]), d: Math.abs((from + m.index) - at) }))
      .sort((a, b) => a.d - b.d);
    return hits.length ? hits[0].name : null;
  }).filter(Boolean);
  if (!verdicts.length) {
    unverifiable.push(label + ' (no named icon within ' + WIN + ' chars of any of its ' + sites.length + ' site(s)) — ' +
      'likely an ANONYMOUS inline glyph in the product; name it and this becomes checkable');
    return;
  }
  if (verdicts.indexOf(icon) === -1) {
    mism.push('"' + label + '" — guide shows `' + icon + '`, nearest named icon in the product is `' +
      [...new Set(verdicts)].join('/') + '`');
  }
});
const PAIR_FLOOR = 6;   // below this, the matcher has stopped matching rather than the guide got clean
if (mism.length) {
  console.log('FAIL — specimen renders a different icon than the product does:');
  mism.forEach(m => console.log('   ' + m));
  fail++;
} else if (pairs.length < PAIR_FLOOR) {
  console.log('FAIL — only ' + pairs.length + ' icon+label pair(s) matched, below the floor of ' + PAIR_FLOOR + '.');
  console.log('   This check verifies nothing when it finds nothing. A guide-markup change has almost');
  console.log('   certainly broken the matcher — fix the matcher; do not lower the floor.');
  fail++;
} else {
  console.log('OK — ' + (pairs.length - unverifiable.length) + '/' + pairs.length +
              ' icon+label specimens match the nearest named icon the product uses for that component.');
}
console.log('   COVERAGE OF THIS CHECK: ' + pairs.length + ' of ' + candidateIcons + ' data-icon renders in the guide' +
            ' carry an adjacent text label, which is the only anchor §9 can use.');
console.log('   The other ' + (candidateIcons - pairs.length) + ' are icon-only specimens and are NOT verified by anything.');
if (unverifiable.length) {
  console.log('   not cross-checkable (' + unverifiable.length + ') — listed so the OK above is not read as full coverage:');
  unverifiable.slice(0, 6).forEach(u => console.log('     ' + u));
  if (unverifiable.length > 6) console.log('     ... +' + (unverifiable.length - 6) + ' more');
}

console.log('\n' + '='.repeat(64));
console.log(fail === 0
  ? 'PASS — no drift detected in what is checked below.'
  : 'FAIL — ' + fail + ' drift finding(s) above.');
console.log('='.repeat(64));
/* The scope footer exists because the old banner read "no drift detected" full stop, over a suite that
   is mostly plausibility checks. A green light over an unexamined area is worse than no light: it
   discourages the human check that WOULD have caught the thing. State the limits next to the verdict. */
console.log('WHAT THIS DOES AND DOES NOT VERIFY');
console.log('  genuinely cross-referenced against the product:');
console.log('    §1 specimen <button> text + placeholders — must exist verbatim in index.html');
console.log('    §9 icon choice, for the subset of specimens carrying an adjacent text label');
console.log('    §6 module paths vs inline literals');
console.log('  NOT cross-references, though an earlier version of this footer listed them as such:');
console.log('    §4 reads index.html alone — it never opens blueai-icons.js');
console.log('    §5 reads style-guide.html alone — it checks for a <link> tag, not that the sheet matches');
console.log('  plausibility only — a WRONG-but-valid value passes:');
console.log('    §3 the icon name exists in the set; it is not checked against the component using it');
console.log('       unless §9 could anchor that component on a label');
console.log('    §8 sizes go through a token; the RIGHT token is not checked — a caption set to');
console.log('       --bai-fs-d46 passes this check');
console.log('    §2 counts covered classes; says nothing about whether a specimen is correct');
console.log('  not checked at all: layout, spacing, colour choice, state coverage, copy TONE,');
console.log('    and anything only visible when a component is interacted with.');
console.log('  => PASS means "no drift of the kinds listed above", never "the guide is correct".');
process.exit(fail === 0 ? 0 : 1);
