/* Section 10 Tokens reference (foundations slice). Every --v2- token, grouped by its family in
   tokens.css, with its live value (getComputedStyle), its role and the V2 values it absorbs (both
   read from the comment on its line in tokens.css), plus an orphan report: tokens that no kit or
   screen stylesheet reaches, directly or through another token. */
(function () {
  const { useState, useEffect } = React;
  const G = window.V2Guide;
  const SRC = '../blueai-product-v2-ds/tokens.css';

  // tokens.css -> [{family, role, tokens: [{name, def, role, absorbs}]}]
  function parseTokens(text) {
    const fams = [];
    let cur = null;
    text.split(/\r?\n/).forEach(function (line) {
      const head = line.match(/^\s*\/\*\s*([A-Z][A-Za-z ]*)\.\s*Role:\s*(.*)$/);
      if (head) { cur = { family: head[1], role: head[2].replace(/\*\/\s*$/, '').trim(), tokens: [] }; fams.push(cur); return; }
      const m = line.match(/^\s*(--v2-[a-z0-9-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/);
      if (!m) return;
      if (!cur) { cur = { family: 'Other', role: '', tokens: [] }; fams.push(cur); }
      const note = m[3] || '';
      const i = note.indexOf('Absorbs');
      cur.tokens.push({ name: m[1], def: m[2].trim(), role: (i >= 0 ? note.slice(0, i) : note).replace(/[.\s]+$/, ''), absorbs: i >= 0 ? note.slice(i + 8).trim() : '' });
    });
    return fams;
  }

  // Every var(--v2-*) a kit or screen stylesheet uses, closed over token-to-token references.
  function usedTokens(fams) {
    const used = {};
    Array.prototype.forEach.call(document.styleSheets, function (sheet) {
      const href = sheet.href || '';
      if (!/\/blueai-product-v2-ds\/(kit|screens)\//.test(href)) return;
      let rules = [];
      try { rules = sheet.cssRules || []; } catch (e) { return; }
      (function walk(list) {
        Array.prototype.forEach.call(list, function (r) {
          if (r.cssRules) walk(r.cssRules);
          (r.cssText.match(/var\(\s*--v2-[a-z0-9-]+/g) || []).forEach(function (v) { used[v.replace(/var\(\s*/, '')] = true; });
        });
      })(rules);
    });
    const defs = {};
    fams.forEach(function (f) { f.tokens.forEach(function (t) { defs[t.name] = t.def; }); });
    let grew = true;
    while (grew) {
      grew = false;
      Object.keys(used).forEach(function (n) {
        (String(defs[n] || '').match(/--v2-[a-z0-9-]+/g) || []).forEach(function (d) { if (!used[d]) { used[d] = true; grew = true; } });
      });
    }
    return used;
  }
  function isPaint(v) { return /^(#|rgba?\(|hsla?\(|linear-gradient|radial-gradient)/i.test(v); }

  function TokensSection() {
    const [fams, setFams] = useState(null);
    const [failed, setFailed] = useState(false);
    const [q, setQ] = useState('');
    useEffect(function () {
      let live = true;
      fetch(SRC).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (t) { if (live) setFams(parseTokens(t)); })
        .catch(function () { if (live) setFailed(true); });
      return function () { live = false; };
    }, []);
    const used = fams ? usedTokens(fams) : {};
    const all = fams ? fams.reduce(function (n, f) { return n + f.tokens.length; }, 0) : 0;
    const orphans = fams ? fams.reduce(function (list, f) { return list.concat(f.tokens.filter(function (t) { return !used[t.name]; }).map(function (t) { return t.name; })); }, []) : [];
    const needle = q.trim().toLowerCase();
    const match = function (t) { return !needle || (t.name + ' ' + t.role + ' ' + t.absorbs + ' ' + t.def).toLowerCase().indexOf(needle) >= 0; };
    return (
      <G.Section id="tokens-reference">
        <G.Part name="Token table" status="new" role="Every --v2- token in one place, read live from tokens.css: what it holds now, what it is for, and which V2 values it replaces.">
          <G.Note>Why the product needs it: V2 has five runtime CSS variables and none of them are design tokens. Its values are typed inline, and local constants (ACCENT, INK, MUTED, FAINT, repeated across five files) were the system trying to exist. tokens.css is now the one source; this table is a view of it, so it cannot drift from it.</G.Note>
          {failed ? (
            <div className="v2-stack">
              <G.Warn>tokens.css could not be read as text here, so roles and absorbed values are missing. Live values still show below.</G.Warn>
              {Object.keys(G.FAMILIES).map(function (f) { return <div key={f} className="v2-stack v2-gap-2"><span className="v2-text-eyebrow">{f}</span><G.TokenTable family={f} /></div>; })}
            </div>
          ) : !fams ? <div className="g-missing">Reading tokens.css…</div> : (
            <div className="v2-stack v2-gap-5">
              <div className="v2-hstack v2-wrap v2-gap-4">
                <label className="v2-hstack v2-gap-2"><span className="v2-text-label">Find a token</span>
                  <input type="search" value={q} onChange={function (e) { setQ(e.target.value); }} placeholder="blue, radius, 1990FF"
                    style={{ height: 'var(--v2-control-md)', padding: '0 var(--v2-space-3)', borderRadius: 'var(--v2-radius-sm)', border: 'var(--v2-stroke) solid var(--v2-line-strong)', background: 'var(--v2-surface)', color: 'var(--v2-ink)', font: 'inherit', fontSize: 'var(--v2-text-13)', width: 220 }} />
                </label>
                <span className="v2-text-meta v2-tabular">{all} tokens in {fams.length} families</span>
              </div>
              {fams.map(function (f) {
                const rows = f.tokens.filter(match);
                if (!rows.length) return null;
                return (
                  <div key={f.family} className="v2-stack v2-gap-2">
                    <div><span className="v2-text-title">{f.family}</span> <span className="v2-text-body-sm">{f.role}</span></div>
                    <div className="g-table-wrap">
                      <table className="g-table">
                        <thead><tr><th scope="col">Token</th><th scope="col">Value</th><th scope="col">Role</th><th scope="col">Absorbs from V2</th></tr></thead>
                        <tbody>{rows.map(function (t) {
                          const v = G.tokenValue(t.name);
                          return (
                            <tr key={t.name}>
                              <td><code className="g-code">{t.name}</code>{used[t.name] ? null : <div className="v2-text-meta">orphan</div>}</td>
                              <td><span className="g-token-val">{isPaint(v) ? <span className="g-token-chip" style={{ background: 'var(' + t.name + ')' }} aria-hidden="true" /> : null}<code className="g-code">{v || t.def}</code></span></td>
                              <td>{t.role}</td>
                              <td className="v2-text-meta">{t.absorbs}</td>
                            </tr>
                          );
                        })}</tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
              <div className="v2-stack v2-gap-2">
                <span className="v2-text-title">Orphan report</span>
                <p className="v2-text-body-sm">Tokens no kit or screen stylesheet reaches, directly or through another token ({orphans.length} of {all}). Inline styles in kit and screen JSX are not scanned. An orphan is either waiting for the part that needs it or a candidate to delete; it is never a reason to invent a use.</p>
                {orphans.length ? <div className="v2-hstack v2-wrap v2-gap-2">{orphans.map(function (n) { return <code key={n} className="g-code">{n}</code>; })}</div> : <p className="v2-text-body-sm">None: every token is used.</p>}
              </div>
            </div>
          )}
          <G.SpecDrawer rows={[
            { part: 'Source', token: null, value: 'tokens.css: one :root block, prefix --v2-, light theme only' },
            { part: 'Local constants it replaces', token: null, value: 'ACCENT, INK, MUTED, FAINT', ref: ['foundations.tokens.ai-mode-accent', 'foundations.ink.ai-mode-faint'] },
            { part: 'V2Tokens (the PM)', token: null, value: 'since 2026-10-14 the PM builds from this system: blueai/v2_tokens.jsx mirrors the "V2 today" tokens as one JS object, read by the worker files', ref: 'foundations.tokens.v2-tokens' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('tokens-reference', TokensSection);
})();
