/* BlueAI Product V2 Design System: spec blocks (adds to window.V2Guide; load after kit-guide.jsx).

   ref(id)       the V2Refs entry for a ref id ({id, file, line, needle, value}) or null.
   refText(id)   'file:line' for a ref id, or the id itself marked missing.
   SpecDrawer    {rows: [{part, token, value, ref}], title?, open?}  closed by default. One row per
                 value: the part it styles, the token that now holds it, the value, and the V2
                 source. ref is a ref id or an array of ids from guide/refs/*.js; each resolves to
                 'file:line' plus the needle text. A row with no V2 source (a New value) leaves ref
                 out and reads 'New'.
   TokenTable    {family | names, roles?}  reads token names in source order from tokens.css (CSSOM)
                 and their live values with getComputedStyle. family is one of the keys of
                 V2Guide.FAMILIES; names is an explicit list. roles maps a name to its role text.
   Swatch        {token, label?, note?}  a colour or gradient token as a chip with its live value. */
(function () {
  const G = window.V2Guide = window.V2Guide || {};

  const FAMILIES = {
    ink: ['--v2-ink', '--v2-on-color'],
    surface: ['--v2-canvas', '--v2-surface', '--v2-wash'],
    line: ['--v2-line', '--v2-link'],
    blue: ['--v2-blue', '--v2-action', '--v2-select'],
    status: ['--v2-success', '--v2-danger', '--v2-attention'],
    brand: ['--v2-gradient'],
    type: ['--v2-font', '--v2-text-', '--v2-weight', '--v2-leading', '--v2-tracking'],
    space: ['--v2-space', '--v2-gutter'],
    radius: ['--v2-radius'],
    stroke: ['--v2-stroke'],
    elevation: ['--v2-shadow'],
    overlay: ['--v2-scrim'],
    z: ['--v2-z-'],
    motion: ['--v2-dur', '--v2-ease'],
    focus: ['--v2-focus'],
    opacity: ['--v2-opacity'],
    icon: ['--v2-icon'],
    shell: ['--v2-shell', '--v2-titlebar', '--v2-topbar', '--v2-nav-h', '--v2-bubble', '--v2-dialog', '--v2-control', '--v2-field', '--v2-hit'],
    size: ['--v2-mark', '--v2-badge-h', '--v2-row-min-h', '--v2-rail', '--v2-popover-w', '--v2-measure'],
    scrollbar: ['--v2-scroll'],
  };

  function allRefs() { return Array.isArray(window.V2Refs) ? window.V2Refs : []; }
  function ref(id) {
    const list = allRefs();
    for (let i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }
  function refText(id) {
    const r = ref(id);
    return r ? r.file + ':' + r.line : id + ' (ref missing)';
  }

  let tokenCache = null;
  function rootTokens() {
    if (tokenCache) return tokenCache;
    const names = [];
    const seen = {};
    function walk(rules) {
      for (let i = 0; i < rules.length; i++) {
        const r = rules[i];
        if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; }
        if (r.selectorText !== ':root' || !r.style) continue;
        for (let j = 0; j < r.style.length; j++) {
          const n = r.style[j];
          if (n.indexOf('--v2-') === 0 && !seen[n]) { seen[n] = true; names.push(n); }
        }
      }
    }
    Array.prototype.forEach.call(document.styleSheets, function (sheet) {
      try { walk(sheet.cssRules || []); } catch (e) { /* cross-origin sheet (fonts): skip */ }
    });
    if (names.length) tokenCache = names;
    return names;
  }
  function tokenValue(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  function isPaint(v) { return /^(#|rgba?\(|hsla?\(|linear-gradient|radial-gradient)/i.test(v); }

  function RefCell({ refs }) {
    const ids = refs == null ? [] : (Array.isArray(refs) ? refs : [refs]);
    if (!ids.length) return <span className="g-muted">New</span>;
    return (
      <div className="g-refs">
        {ids.map(function (id) {
          const r = ref(id);
          if (!r) return <div key={id} className="g-ref g-ref--missing">{id} (ref missing)</div>;
          return (
            <div key={id} className="g-ref">
              <span className="g-ref-loc">{r.file}:{r.line}</span>
              <code className="g-code g-ref-needle">{r.needle}</code>
            </div>
          );
        })}
      </div>
    );
  }

  function SpecDrawer({ rows, title, open }) {
    const list = rows || [];
    return (
      <details className="g-spec" open={!!open}>
        <summary className="g-spec-summary">{title || 'Spec'} <span className="g-muted">({list.length} values)</span></summary>
        <div className="g-table-wrap">
          <table className="g-table">
            <thead><tr><th scope="col">Part</th><th scope="col">Token</th><th scope="col">Value</th><th scope="col">V2 source</th></tr></thead>
            <tbody>
              {list.map(function (r, i) {
                return (
                  <tr key={i}>
                    <td>{r.part}</td>
                    <td>{r.token ? <code className="g-code">{r.token}</code> : <span className="g-muted">none</span>}</td>
                    <td><code className="g-code">{r.value}</code></td>
                    <td><RefCell refs={r.ref} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    );
  }

  function Swatch({ token, label, note }) {
    const v = tokenValue(token);
    return (
      <div className="g-swatch">
        <div className="g-swatch-chip" style={{ background: 'var(' + token + ')' }} aria-hidden="true" />
        <div className="g-swatch-text">
          <div className="g-swatch-label">{label || token}</div>
          <code className="g-code">{label ? token : v}</code>
          {label ? <code className="g-code g-muted">{v}</code> : null}
          {note ? <div className="g-swatch-note">{note}</div> : null}
        </div>
      </div>
    );
  }

  function TokenTable({ family, names, roles }) {
    let list = names;
    if (!list) {
      const pre = FAMILIES[family] || [];
      list = rootTokens().filter(function (n) { return pre.some(function (p) { return n.indexOf(p) === 0; }); });
    }
    if (!list.length) return <div className="g-missing">No tokens found for {family || 'this list'} (is tokens.css loaded?).</div>;
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          <thead><tr><th scope="col">Token</th><th scope="col">Value</th>{roles ? <th scope="col">Role</th> : null}</tr></thead>
          <tbody>
            {list.map(function (n) {
              const v = tokenValue(n);
              return (
                <tr key={n}>
                  <td><code className="g-code">{n}</code></td>
                  <td>
                    <span className="g-token-val">
                      {isPaint(v) ? <span className="g-token-chip" style={{ background: 'var(' + n + ')' }} aria-hidden="true" /> : null}
                      <code className="g-code">{v || 'unset'}</code>
                    </span>
                  </td>
                  {roles ? <td>{roles[n] || ''}</td> : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  Object.assign(G, { FAMILIES, ref, refText, rootTokens, tokenValue, SpecDrawer, Swatch, TokenTable, RefCell });
})();
