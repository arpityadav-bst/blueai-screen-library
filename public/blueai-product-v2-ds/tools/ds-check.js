#!/usr/bin/env node
/* BlueAI Product V2 Design System: the gate. Node plus one dependency, Babel's parser: the repo's
   node_modules, the main blueai checkout's, or a @babel/parser build named in DS_BABEL_PARSER.
   Usage: node tools/ds-check.js [--missing-ok]
   Checks, each reported per file:
   1. refs     every guide/refs/*.js entry's needle is on its V2 line (drift up to 3 lines passes and
               is reported; further or gone fails); ids unique; fields present; every ref id a
               guide section names exists: ref: and refs= values, ref() and refText() calls, and any
               ref-shaped string (a refs namespace plus two or more dots) in its data arrays.
   2. em dash  no U+2014 character, its HTML entities or its JS escapes in any system file.
   3. parse    every .jsx/.js parses (babel parser, plugin jsx, as a strict script: Babel standalone
               compiles text/babel as a module, which is strict, so with, legacy octals, duplicate
               parameters and reserved words such as package fail here, not in the browser; import
               and export stay errors). It parses; it does not compile, so a transform error only
               Babel standalone raises can pass. No parser found is an error, never a silent skip.
   4. lines    every .jsx/.js/.css is at most 300 lines (index.html and .md exempt).
   5. sync     catalog sections, guide/sections files (and their register id), design-md partials
               and index.html's script/stylesheet list agree, in a safe load order.
   6. colour   raw colour only in tokens.css and tokens-v2-today.css: #hex, rgb(a), hsl(a), hwb, lab,
               lch, oklab, oklch and color() fail on any line of kit/, screens/ or another root .css;
               named and system colours, read from values, in tools/ds-check-more.js. No stylesheet
               but those two defines a --v2- property; 11 (more.js) holds them to the same names.
   7. kit      every kit component and screen the catalog names is put on window.V2Kit / V2Screens.
   8. sizes    Icon and Avatar SIZES equal their tokens, each size class reads its token, no caller
               passes a size off the list, and no kit/ or screens/ rule types a Size token raw
               or borrows a Space token (var(--v2-space-N)) in its place.
   9. rest     no object rest destructuring in kit/, screens/ or guide/ .jsx (Babel's hoisted
               _excluded is shared across files).
   10. iife    kit/, screens/ and guide/ files hold only IIFEs at top level (refs may assign
               window.V2Refs), so nothing lands on window. 8 to 11 live in tools/ds-check-more.js.
   --missing-ok turns "planned file does not exist yet" (and "file not loaded by index.html") into
   warnings, so slice builders can run it before every file exists; planned-but-absent files are
   then counted in one line (add --verbose to list them). Exit 1 on any error. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DS = path.resolve(__dirname, '..');
const PUB = path.resolve(DS, '..');
const V2 = path.join(PUB, 'blueai-product-v2');
const ONBLUE = path.join(PUB, 'experiments', 'onblue-vesper');
const MISSING_OK = process.argv.includes('--missing-ok');
const VERBOSE = process.argv.includes('--verbose');
const pending = new Set();
const PARSERS = [
  process.env.DS_BABEL_PARSER,
  path.join(PUB, '..', 'node_modules', 'next', 'dist', 'compiled', 'babel', 'parser.js'),
  path.join(PUB, '..', 'node_modules', '@babel', 'parser', 'lib', 'index.js'),
  'N:/Antigravity Main/blueai/node_modules/next/dist/compiled/babel/parser.js',
].filter(Boolean);
const PREFIX = '../blueai-product-v2-ds/';
const NOT_SOURCES = ['credits_widget', 'skills', 'onboarding', 'product_home', 'chat_product', 'jobs', 'schedule'];
const DRIFT = 3;
const MAX_LINES = 300;

const report = {};
const notes = [];
function entry(f) { return (report[f] = report[f] || { errors: [], warns: [] }); }
function err(f, m) { entry(f).errors.push(m); }
function warn(f, m) { entry(f).warns.push(m); }
function missing(f, m) {
  if (!MISSING_OK) return err(f, m);
  if (VERBOSE) return warn(f, m);
  pending.add(f);
}

function walk(dir, rel, out) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (d.name === 'node_modules' || d.name.startsWith('.')) continue;
    const r = rel ? rel + '/' + d.name : d.name;
    if (d.isDirectory()) walk(path.join(dir, d.name), r, out); else out.push(r);
  }
  return out;
}
const FILES = walk(DS, '', []);
const has = (rel) => fs.existsSync(path.join(DS, rel));
const read = (rel) => fs.readFileSync(path.join(DS, rel), 'utf8');
const ext = (f) => path.extname(f).toLowerCase();
const lineOf = (src, i) => src.slice(0, i).split('\n').length;

// 2. em dash in any form (patterns built so this file never contains one)
const DASH = [
  [String.fromCharCode(0x2014), 'em dash character'],
  ['&' + 'mdash;', 'HTML entity'],
  ['&#' + '8212;', 'HTML entity'],
  ['&#x' + '2014;', 'HTML entity'],
  ['\\' + 'u2014', 'JS escape'],
  ['\\' + 'u{2014}', 'JS escape'],
];
const TEXT = ['.js', '.jsx', '.css', '.html', '.md', '.json', '.txt', '.svg'];
for (const f of FILES.filter((x) => TEXT.includes(ext(x)))) {
  const lines = read(f).split('\n');
  lines.forEach((l, i) => {
    const low = l.toLowerCase();
    for (const [p, what] of DASH) if (low.includes(p.toLowerCase())) err(f, 'line ' + (i + 1) + ': em dash (' + what + ')');
  });
}

// 3. parse and 4. lines
const parserPath = PARSERS.find((p) => fs.existsSync(p));
const parser = parserPath ? require(parserPath) : null;
if (parser) notes.push('parser: ' + parserPath + ' (parses only, does not compile)');
else err('tools/ds-check.js', 'parse check cannot run: no Babel parser found. Run npm install in the repo, or set DS_BABEL_PARSER to a @babel/parser build');
const ASTS = {};
for (const f of FILES) {
  const e = ext(f);
  if (!['.js', '.jsx', '.css'].includes(e)) continue;
  const src = read(f);
  const n = src.replace(/\r?\n$/, '').split(/\r?\n/).length;
  if (n > MAX_LINES) err(f, n + ' lines, over the ' + MAX_LINES + '-line rule: split it');
  if (parser && e !== '.css') {
    try { ASTS[f] = parser.parse(src, { sourceType: 'script', strictMode: true, plugins: ['jsx'] }); } catch (x) { err(f, 'does not parse: ' + x.message); }
  }
}

// 6. raw colour outside the two token files: kit/, screens/, root .css (named: tools/ds-check-more.js)
const HEX = /(^|[^\w&#/-])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/i;
const FN = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/i;
for (const f of FILES.filter((x) => (/^(kit|screens)\//.test(x) || /^[^/]+\.css$/.test(x)) && !/^tokens(-v2-today)?\.css$/.test(x) && ['.js', '.jsx', '.css'].includes(ext(x)))) {
  read(f).split('\n').forEach((l, i) => {
    const m = l.match(HEX) || l.match(FN);
    if (m) err(f, 'line ' + (i + 1) + ': raw colour "' + m[0].trim() + '": use a --v2-* token');
  });
}
// ...and the --v2- prefix means the two token files: no other stylesheet defines one
for (const f of FILES.filter((x) => ext(x) === '.css' && !/^tokens(-v2-today)?\.css$/.test(x))) {
  read(f).split('\n').forEach((l, i) => {
    const m = l.match(/(?:^|[;{\s])(--v2-[\w-]+)\s*:/);
    if (m) err(f, 'line ' + (i + 1) + ': defines ' + m[1] + ', but only tokens.css and tokens-v2-today.css define --v2- properties: name a part-local one without the prefix (' + m[1].replace('--v2-', '--') + ')');
  });
}

// Catalog
let C = null;
try {
  const ctx = { window: {} };
  vm.runInNewContext(read('guide/catalog.jsx'), ctx, { filename: 'catalog.jsx' });
  C = ctx.window.V2Catalog;
  if (!C || !Array.isArray(C.sections)) throw new Error('window.V2Catalog.sections missing');
} catch (x) { err('guide/catalog.jsx', 'cannot load the catalog: ' + x.message); C = null; }

// 1. refs
const REFS = {};
const v2Cache = {};
function v2File(file) {
  const cands = file.startsWith('onblue/') ? [path.join(ONBLUE, file.slice(7))] : [path.join(V2, file), path.join(V2, 'blueai', file)];
  const hit = cands.find((p) => fs.existsSync(p));
  if (!hit) return null;
  if (!v2Cache[hit]) v2Cache[hit] = fs.readFileSync(hit, 'utf8').split(/\r?\n/);
  return v2Cache[hit];
}
for (const f of FILES.filter((x) => /^guide\/refs\/[^/]+\.js$/.test(x))) {
  const ctx = { window: {} };
  try { vm.runInNewContext(read(f), ctx, { filename: f }); } catch (x) { err(f, 'cannot run: ' + x.message); continue; }
  const list = ctx.window.V2Refs;
  if (!Array.isArray(list)) { err(f, 'does not concat onto window.V2Refs'); continue; }
  for (const r of list) {
    const id = r && r.id;
    if (!id || !r.file || !r.line || !r.needle) { err(f, 'ref ' + (id || '(no id)') + ': needs id, file, line and needle'); continue; }
    if (REFS[id]) { err(f, 'ref ' + id + ': duplicate id (also in ' + REFS[id].from + ')'); continue; }
    REFS[id] = { from: f };
    const lines = v2File(r.file);
    if (!lines) { err(f, 'ref ' + id + ': V2 file not found: ' + r.file); continue; }
    if ((lines[r.line - 1] || '').includes(r.needle)) continue;
    let found = 0;
    for (let d = 1; d <= DRIFT && !found; d++) {
      if ((lines[r.line - 1 - d] || '').includes(r.needle)) found = r.line - d;
      else if ((lines[r.line - 1 + d] || '').includes(r.needle)) found = r.line + d;
    }
    if (found) warn(f, 'ref ' + id + ': needle found at ' + r.file + ':' + found + ' (drift ' + (found - r.line > 0 ? '+' : '') + (found - r.line) + '), update line');
    else err(f, 'ref ' + id + ': needle not at ' + r.file + ':' + r.line + ' (+-' + DRIFT + '): "' + r.needle + '"');
  }
}
notes.push('refs: ' + Object.keys(REFS).length + ' checked');
const REF_USE = /\b(?:ref\s*:|refs\s*=\s*\{?)\s*(\[[^\]]*\]|'[^']*'|"[^"]*")|\bref(?:Text)?\(\s*('[^']*'|"[^"]*")/g;
const REF_NS = new Set(Object.keys(REFS).map((id) => id.split('.')[0]));
const REF_SHAPED = /(['"])([a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*){2,})\1/g;
for (const f of FILES.filter((x) => /^guide\/sections\/.+\.jsx$/.test(x))) {
  const src = read(f);
  const seen = new Set();
  const use = (id, at) => {
    if (!id || REFS[id] || seen.has(id)) return;
    seen.add(id);
    err(f, 'line ' + lineOf(src, at) + ': ref "' + id + '" is not in any guide/refs/*.js');
  };
  for (const m of src.matchAll(REF_USE)) for (const q of (m[1] || m[2]).match(/'[^']*'|"[^"]*"/g) || []) use(q.slice(1, -1), m.index);
  for (const m of src.matchAll(REF_SHAPED)) if (REF_NS.has(m[2].split('.')[0])) use(m[2], m.index);
}

// 5. sync: catalog, section files, partials, index.html
const RANK = (p) => {
  if (p.startsWith('blueai/')) return 0;
  if (p.startsWith('kit/')) return 1;
  if (p.startsWith('screens/')) return 2;
  if (p.startsWith('guide/refs/')) return 3;
  if (p === 'guide/kit-guide.jsx') return 4;
  if (p === 'guide/spec.jsx') return 5;
  if (p.startsWith('guide/sections/')) return 7;
  if (p === 'guide/catalog.jsx') return 8;
  if (p === 'guide/app.jsx') return 9;
  return 6;
};
if (C) {
  const secFiles = new Set();
  const partFiles = new Set();
  for (const s of C.sections) {
    const sf = C.sectionFile(s);
    const pf = C.partialFile(s);
    secFiles.add(sf); partFiles.add(pf);
    if (!has(sf)) missing(sf, 'section ' + s.number + ' ' + s.id + ' (' + s.owner + ') has no guide file yet');
    else if (!new RegExp('register\\(\\s*[\'"]' + s.id.replace(/-/g, '\\-') + '[\'"]').test(read(sf))) err(sf, 'does not call V2Guide.register(\'' + s.id + '\', ...)');
    if (!has(pf)) missing(pf, 'section ' + s.number + ' ' + s.id + ' (' + s.owner + ') has no design-md partial yet');
    else {
      const first = read(pf).split(/\r?\n/).find((l) => l.trim()) || '';
      if (!first.startsWith('## ' + s.number + ' ')) err(pf, 'must start with "## ' + s.number + ' <title>", found "' + first.slice(0, 60) + '"');
    }
  }
  FILES.filter((x) => /^guide\/sections\//.test(x) && !secFiles.has(x)).forEach((x) => err(x, 'not a catalog section (expected guide/sections/<group>-<id>.jsx)'));
  FILES.filter((x) => /^design-md\//.test(x) && !partFiles.has(x)).forEach((x) => err(x, 'not a catalog section partial (expected design-md/<number>-<id>.md)'));

  // index.html
  const html = has('index.html') ? read('index.html') : '';
  if (!html) err('index.html', 'missing');
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  const links = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"|<link\b[^>]*href="([^"]+)"[^>]*rel="stylesheet"/g)].map((m) => m[1] || m[2]);
  const loaded = new Set();
  const order = [];
  for (const src of scripts.concat(links)) {
    if (/^https?:/.test(src)) {
      if (/tailwind/i.test(src)) err('index.html', 'loads Tailwind (' + src + '): the system page does not');
      continue;
    }
    if (src.startsWith(PREFIX)) {
      const rel = src.slice(PREFIX.length);
      loaded.add(rel);
      if (!has(rel)) missing(rel, 'index.html loads it, but it does not exist yet');
      if (src.endsWith('.jsx') || src.endsWith('.js')) order.push(rel);
    } else if (src.startsWith('blueai/')) {
      const name = src.replace(/^blueai\/|\.jsx$/g, '');
      if (NOT_SOURCES.includes(name)) err('index.html', 'loads ' + src + ', which is not a source (plan scope rules)');
      if (!fs.existsSync(path.join(V2, src))) err('index.html', 'loads V2 file ' + src + ', which does not exist');
      order.push(src);
    } else err('index.html', 'unexpected path ' + src + ' (system files are ' + PREFIX + '<path>)');
  }
  for (let i = 1; i < order.length; i++) {
    if (RANK(order[i]) < RANK(order[i - 1])) err('index.html', 'load order: ' + order[i] + ' comes after ' + order[i - 1]);
  }
  if (order.length && order[order.length - 1] !== 'guide/app.jsx') err('index.html', 'guide/app.jsx must be the last script');
  const cssOrder = links.filter((l) => l.startsWith(PREFIX)).map((l) => l.slice(PREFIX.length));
  if (cssOrder[0] !== 'tokens.css' || cssOrder[1] !== 'tokens-v2-today.css') err('index.html', 'tokens.css then tokens-v2-today.css must be the first two system stylesheets');
  if (cssOrder[cssOrder.length - 1] !== 'guide/guide.css') err('index.html', 'guide/guide.css must be the last stylesheet');
  ['kit/base.css', 'kit/motion.css'].forEach((b) => {
    const i = cssOrder.indexOf(b);
    if (i < 0) err('index.html', 'does not load ' + b);
    else if (cssOrder.slice(0, i).some((x) => x.startsWith('kit/') && x !== 'kit/base.css')) err('index.html', b + ' must load before the other kit stylesheets');
  });
  const expected = [...secFiles, ...C.kit.map((k) => k.file), ...C.screens.map((k) => k.file), 'guide/catalog.jsx', 'guide/app.jsx', 'guide/kit-guide.jsx', 'guide/spec.jsx', 'tokens.css', 'tokens-v2-today.css', 'guide/guide.css'];
  expected.forEach((x) => { if (!loaded.has(x)) err('index.html', 'does not load ' + x); });
  FILES.filter((x) => /^(kit|screens|guide)\//.test(x) && ['.js', '.jsx', '.css'].includes(ext(x)) && !loaded.has(x))
    .forEach((x) => (MISSING_OK ? warn : err)(x, 'exists but index.html does not load it'));
  try {
    const v2 = fs.readFileSync(path.join(V2, 'index.html'), 'utf8').split(/\r?\n/);
    [20, 21, 22].forEach((i) => { if (!html.includes(v2[i].trim())) err('index.html', 'V2 index.html line ' + (i + 1) + ' (React/ReactDOM/Babel tag) is not copied verbatim'); });
  } catch (x) { err('index.html', 'cannot read V2 index.html: ' + x.message); }

  // 7. kit components and screens on their globals
  const check = (rows, global) => {
    for (const k of rows) {
      if (!has(k.file)) { missing(k.file, 'planned file for ' + k.name + ' does not exist yet'); continue; }
      const src = read(k.file);
      const blocks = [...src.matchAll(new RegExp('Object\\.assign\\(\\s*window\\.' + global + '[^,]*,\\s*\\{([\\s\\S]*?)\\}\\s*\\)', 'g'))].map((m) => m[1]).join('\n');
      for (const name of k.name.split('/').map((x) => x.trim()).filter(Boolean)) {
        const direct = new RegExp('\\b' + global + '\\.' + name + '\\s*=').test(src);
        if (!direct && !new RegExp('\\b' + name + '\\b').test(blocks)) err(k.file, name + ' is not put on window.' + global);
      }
    }
  };
  check(C.kit, 'V2Kit');
  check(C.screens, 'V2Screens');
}

// 6 (named colours), 8. sizes, 9. rest and 10. iife (tools/ds-check-more.js)
require('./ds-check-more.js')({ files: FILES, read, has, err, asts: ASTS });

// Report
let errors = 0;
let warns = 0;
for (const f of Object.keys(report).sort()) {
  const r = report[f];
  if (!r.errors.length && !r.warns.length) continue;
  console.log(f);
  r.errors.forEach((m) => { errors++; console.log('  error  ' + m); });
  r.warns.forEach((m) => { warns++; console.log('  warn   ' + m); });
}
if (pending.size) notes.push(pending.size + ' planned files not created yet (--verbose lists them)');
notes.forEach((n) => console.log('note: ' + n));
console.log('ds-check' + (MISSING_OK ? ' (--missing-ok)' : '') + ': ' + errors + ' errors, ' + warns + ' warnings, ' + FILES.length + ' files');
process.exit(errors ? 1 : 0);
