/* BlueAI Product V2 Design System: the checks tools/ds-check.js hands off, split out to keep that
   file under the 300-line rule. ds-check.js calls this with its helpers and the ASTs it parsed.
   6. colour (named half)  a CSS named or system colour, read from values, so a comment, a class
             name or copy never matches. In kit/ and screens/ .css: every declaration's value, local
             custom properties included (properties that take names, not colours, such as
             font-family, animation, transition, grid-* and content, are skipped). In their
             .jsx/.js, from the AST: the value of any colour-bearing key in camelCase or kebab-case
             (color, backgroundColor, borderColor, boxShadow, backgroundImage, fill, stroke, ...),
             of every key of a style= object and of a custom property key ('--c'), and of the
             attributes fill=, stroke=, color= and stopColor=. Strings and template text anywhere
             in the value count, so both branches of a ternary are read. transparent and
             currentColor pass; system colours (CanvasText, ...) pass only inside an
             @media (forced-colors: active) block, the one place a token cannot serve.
             ds-check.js does #hex and the colour functions line by line.
   8. sizes  the size lists the JSX copies (Icon and Avatar SIZES) equal their tokens' px values;
             each size's class rule sets width and height to its token (the default size in the
             base rule); no <Icon> or <Avatar> gets a literal size outside the list (it would fall
             back to the default); and no kit/ or screens/ rule types a Size token's value raw, or
             borrows a Space token for it: a square of a mark size, a badge height, a rail height
             (a square dot is not a rail), the row minimum, the popover width, a measure. Each
             part-local property tokens.css's header cites as the pattern is defined where cited.
   9. rest   no object rest destructuring ({ a, ...rest }) in any .jsx in kit/, screens/ or guide/:
             Babel hoists the key list of each one to a program-level _excluded, so the next file
             that compiles one overwrites it and every earlier part forwards the wrong props.
   10. iife  every kit/, screens/ and guide/ .jsx program is IIFE expression statements only, and
             every guide/refs/*.js an IIFE or a window.V2Refs assignment: each file runs as a
             classic script, so a top-level declaration lands on window and can overwrite a V2
             global the live specimens read (Toggle, ModalOverlay, SettingsScreen). */
'use strict';
const NAMED = ('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown '
  + 'burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan '
  + 'darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred '
  + 'darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue '
  + 'dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray '
  + 'green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen '
  + 'lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink '
  + 'lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen '
  + 'linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue '
  + 'mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy '
  + 'oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip '
  + 'peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown '
  + 'seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal '
  + 'thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' ');
const SYSTEM = ('accentcolor accentcolortext activetext buttonborder buttonface buttontext canvas canvastext field '
  + 'fieldtext graytext highlight highlighttext linktext mark marktext selecteditem selecteditemtext visitedtext').split(' ');
const word = (list) => new RegExp('(?<![\\w.#$-])(' + list.join('|') + ')(?![\\w-])', 'i');
const NAMED_RE = word(NAMED.concat(SYSTEM));
const NAMED_ONLY = word(NAMED);
const NOT_COLOUR = /^(?:font-family|font|animation(?:-name)?|transition(?:-property)?|will-change|grid(?:-[a-z-]+)?|content|counter-[a-z]+|list-style(?:-type)?|font-feature-settings|font-variation-settings|quotes|container(?:-name)?)$/;
const COLOUR_KEY = /^(?:color|background(?:-color|-image)?|border(?:-[a-z]+)*|outline(?:-color)?|fill|stroke|(?:box|text)-shadow|caret-color|accent-color|text-decoration(?:-color)?|text-emphasis(?:-color)?|column-rule(?:-color)?|stop-color|flood-color|lighting-color|scrollbar-color|mask(?:-image)?|filter|text-fill-color|text-stroke(?:-color)?|tap-highlight-color)$/;
const COLOUR_ATTR = /^(?:fill|stroke|color|stopColor|stop-color|floodColor|flood-color|lightingColor|lighting-color)$/;
const kebab = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-?(?:webkit|moz|ms)-/, '');
const strip = (v) => v.replace(/url\([^)]*\)/gi, ' ').replace(/'[^']*'|"[^"]*"/g, ' ');

// Innermost CSS rules, comments blanked so indexes (and lines) still match the source; forced is
// true inside an @media (forced-colors: ...) block.
function rules(src) {
  const s = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const line = (i) => s.slice(0, i).split('\n').length;
  const forced = [];
  for (const m of s.matchAll(/@media[^{]*forced-colors[^{]*\{/g)) {
    let depth = 1, i = m.index + m[0].length;
    for (; i < s.length && depth; i++) depth += s[i] === '{' ? 1 : s[i] === '}' ? -1 : 0;
    forced.push([m.index, i]);
  }
  const out = [];
  for (const b of s.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const base = b.index + b[1].length + 1;
    const decls = [...b[2].matchAll(/([-\w]+)\s*:\s*([^;]*)/g)].map((d) => ({ prop: d[1].toLowerCase(), value: d[2].trim(), line: line(base + d.index) }));
    out.push({ sels: b[1].trim().split(',').map((x) => x.trim()), decls, line: line(base),
      forced: forced.some(([a, z]) => base > a && base < z) });
  }
  return out;
}
const rawPx = (v) => [...v.matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)px\b/g)].map((m) => parseFloat(m[1]));

function walk(node, visit) {
  const stack = [node];
  while (stack.length) {
    const n = stack.pop();
    if (!n || typeof n !== 'object') continue;
    if (Array.isArray(n)) { for (const c of n) stack.push(c); continue; }
    if (n.type) visit(n);
    for (const k in n) {
      if (k === 'loc' || k === 'start' || k === 'end' || k === 'extra' || /Comments$/.test(k)) continue;
      const v = n[k];
      if (v && typeof v === 'object') stack.push(v);
    }
  }
}

module.exports = function more({ files, read, has, err, asts }) {
  // 6. colour, named half
  const UI = files.filter((x) => /^(kit|screens)\//.test(x));
  for (const f of UI.filter((x) => x.endsWith('.css'))) {
    for (const r of rules(read(f))) for (const d of r.decls) {
      if (NOT_COLOUR.test(d.prop)) continue;
      const m = strip(d.value).match(r.forced ? NAMED_ONLY : NAMED_RE);
      if (m) err(f, 'line ' + d.line + ': raw colour "' + m[1] + '" in ' + d.prop + ': use a --v2-* token');
    }
  }
  for (const f of UI.filter((x) => asts[x])) {
    const seen = new Set();
    const scan = (value, key) => walk(value, (n) => {
      const text = n.type === 'StringLiteral' ? n.value : n.type === 'TemplateElement' ? n.value.cooked || '' : null;
      if (text === null || seen.has(n.start)) return;
      seen.add(n.start);
      const m = strip(text).match(NAMED_RE);
      if (m) err(f, 'line ' + n.loc.start.line + ': raw colour "' + m[1] + '" in ' + key + ': use a --v2-* token');
    });
    walk(asts[f].program, (n) => {
      if (n.type === 'ObjectProperty' && !n.computed) {
        const k = n.key.name || n.key.value;
        if (typeof k === 'string' && (k.startsWith('--') || COLOUR_KEY.test(kebab(k)))) scan(n.value, k);
      } else if (n.type === 'JSXAttribute' && n.name.type === 'JSXIdentifier') {
        const k = n.name.name;
        if (COLOUR_ATTR.test(k)) scan(n.value, k + '=');
        const o = k === 'style' && n.value && n.value.expression;
        if (o && o.type === 'ObjectExpression') {
          for (const p of o.properties) {
            const pk = p.type === 'ObjectProperty' && (p.key.name || p.key.value);
            if (typeof pk === 'string' && !NOT_COLOUR.test(kebab(pk))) scan(p.value, 'style ' + pk);
          }
        }
      }
    });
  }

  // 8. sizes
  const TOKENS = {};
  for (const m of read('tokens.css').matchAll(/(--v2-[\w-]+)\s*:\s*([^;]+);/g)) TOKENS[m[1]] = m[2].trim();
  const px = (n) => parseFloat(TOKENS[n]);
  const LISTS = [
    { jsx: 'kit/icons.jsx', css: 'kit/base.css', cls: 'v2-icon', base: '--v2-icon-sm', tags: /^(?:Icon|Ico|Ic)$/,
      names: ['--v2-icon-sm', '--v2-icon-md', '--v2-icon-lg'] },
    { jsx: 'kit/display.jsx', css: 'kit/display.css', cls: 'v2-avatar', base: '--v2-mark-md', tags: /^Avatar$/,
      names: ['--v2-mark-sm', '--v2-mark-md', '--v2-mark-lg', '--v2-mark-xl'] },
  ];
  for (const L of LISTS.filter((x) => has(x.jsx))) {
    const want = L.names.map(px);
    const m = read(L.jsx).match(/\bconst SIZES = \[([^\]]*)\]/);
    const got = m ? m[1].split(',').map((x) => parseFloat(x)).join(', ') : 'none';
    if (got !== want.join(', ')) err(L.jsx, 'SIZES is [' + got + '] but ' + L.names.join(', ') + ' in tokens.css are [' + want.join(', ') + ']: keep them equal');
    const rs = has(L.css) ? rules(read(L.css)) : [];
    for (const n of L.names) {
      const sel = '.' + L.cls + (n === L.base ? '' : '--' + px(n));
      const r = rs.find((x) => x.sels.includes(sel));
      const sets = (p) => r && r.decls.some((d) => d.prop === p && d.value === 'var(' + n + ')');
      if (!sets('width') || !sets('height')) err(L.css, (r ? 'line ' + r.line + ': ' : '') + sel + ' must set width and height to var(' + n + '), the size ' + px(n) + ' the JSX emits');
    }
    for (const f of Object.keys(asts).filter((x) => /^(kit|screens|guide)\/.+\.jsx$/.test(x))) {
      walk(asts[f].program, (n) => {
        if (n.type !== 'JSXOpeningElement') return;
        const tag = n.name.type === 'JSXMemberExpression' ? n.name.property.name : n.name.name;
        if (!L.tags.test(tag || '')) return;
        const a = n.attributes.find((x) => x.type === 'JSXAttribute' && x.name.name === 'size');
        const v = a && a.value && (a.value.type === 'StringLiteral' ? a.value : a.value.expression);
        const s = v && (v.type === 'NumericLiteral' || v.type === 'StringLiteral') ? parseFloat(v.value) : null;
        if (s !== null && !want.includes(s)) err(f, 'line ' + n.loc.start.line + ': <' + tag + ' size={' + s + '}> is not one of [' + want.join(', ') + '], so it renders at the default size');
      });
    }
  }
  const SIZE_USE = [
    [['--v2-mark-sm', '--v2-mark-md', '--v2-mark-lg', '--v2-mark-xl'], ['width', 'height'], 'square'],
    [['--v2-badge-h'], ['height']],
    [['--v2-row-min-h'], ['min-height']],
    [['--v2-rail', '--v2-rail-thin'], ['height'], 'line'],
    [['--v2-popover-w'], ['width', 'max-width']],
    [['--v2-measure', '--v2-measure-tip'], ['max-width']],
  ];
  // A Space token is a gap, not a size: a whole value of var(--v2-space-N) counts as its px here, so
  // a rail drawn at var(--v2-space-15) or a disc at var(--v2-space-8) fails like a typed 6px or 32px.
  const SPACE = /^var\((--v2-space-[\w-]+)\)$/;
  const val = (d) => { const s = d.value.match(SPACE); return s ? [px(s[1])] : rawPx(d.value); };
  for (const f of files.filter((x) => /^(kit|screens)\/.+\.css$/.test(x))) {
    for (const r of rules(read(f))) {
      const last = {};
      r.decls.forEach((d) => { last[d.prop] = d; });
      const has2 = (p, v) => !!last[p] && val(last[p]).includes(v);
      const said = new Set();
      for (const [names, props, shape] of SIZE_USE) for (const n of names) {
        const v = px(n);
        if (shape === 'square' && !(has2('width', v) && has2('height', v))) continue;
        if (shape === 'line' && has2('width', v)) continue;
        for (const p of props.filter((x) => has2(x, v) && !said.has(x))) {
          said.add(p);
          const sp = last[p].value.match(SPACE);
          err(f, 'line ' + last[p].line + ': ' + p + ' ' + (sp ? last[p].value + ' (a Space token, for gaps) reads ' : '')
            + v + 'px, which is ' + n + ' (Size, tokens.css): use var(' + n + ')');
        }
      }
    }
  }

  // ...and every part-local property tokens.css's header cites as the pattern is defined where it says
  const tokHead = (read('tokens.css').match(/^\/\*[\s\S]*?\*\//) || [''])[0];
  for (const m of tokHead.matchAll(/(--(?!v2-)[a-z][\w-]*), ((?:kit|screens)\/[\w-]+\.css)/g)) {
    if (!has(m[2]) || !new RegExp('(?:^|[;{\\s])' + m[1] + '\\s*:').test(read(m[2]))) {
      err(m[2], 'tokens.css cites ' + m[1] + ' here as its part-local property, but this file does not define it');
    }
  }

  // 9. rest: walk every parsed AST for an ObjectPattern holding a RestElement
  const MSG = 'object rest destructuring: Babel hoists its key list to a program-level _excluded that the next file overwrites; use a local omit(props, KEYS)';
  for (const f of Object.keys(asts).filter((x) => /^(kit|screens|guide)\/.+\.jsx$/.test(x))) {
    walk(asts[f].program, (n) => {
      if (n.type === 'ObjectPattern' && (n.properties || []).some((p) => p && p.type === 'RestElement')) {
        err(f, 'line ' + (n.loc ? n.loc.start.line : '?') + ': ' + MSG);
      }
    });
  }

  // 10. iife: nothing at a browser file's top level but IIFEs (and, in refs, the V2Refs assignment)
  const iife = (s) => s.type === 'ExpressionStatement' && s.expression.type === 'CallExpression'
    && /^(?:FunctionExpression|ArrowFunctionExpression)$/.test(s.expression.callee.type);
  const refsSet = (s) => {
    const e = s.type === 'ExpressionStatement' && s.expression;
    return !!e && e.type === 'AssignmentExpression' && e.left.type === 'MemberExpression'
      && e.left.object.name === 'window' && e.left.property.name === 'V2Refs';
  };
  for (const f of Object.keys(asts)) {
    const ref = /^guide\/refs\/[^/]+\.js$/.test(f);
    if (!ref && !/^(kit|screens|guide)\/.+\.jsx$/.test(f)) continue;
    for (const s of asts[f].program.body) {
      if (iife(s) || (ref && refsSet(s))) continue;
      err(f, 'line ' + s.loc.start.line + ': top-level ' + s.type + ': wrap the file in (function () { ... })()'
        + (ref ? ' or assign window.V2Refs' : '') + ', or it lands on window and can overwrite a V2 global');
    }
  }
};
