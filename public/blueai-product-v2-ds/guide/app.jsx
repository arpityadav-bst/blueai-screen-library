/* BlueAI Product V2 Design System: the guide shell (loads last).
   Left navigation by catalog group, a header with the system name, the status legend and links,
   one section at a time chosen by the URL hash (#<section id>), previous / next at the foot.
   A section nobody has registered yet renders a quiet placeholder built from the catalog.
   The header's Look switch (V2 today / Target) sets data-v2-look on the wrapper around the section,
   so specimens and screens take tokens-v2-today.css while the guide chrome stays on tokens.css. */
(function () {
  const { useState, useEffect, useRef } = React;
  const G = window.V2Guide;
  const C = window.V2Catalog;
  const NAME = (C && C.name) || 'BlueAI Product V2 Design System';

  const toHash = G.hashHref;
  const LOOK_KEY = 'v2ds-look';
  const LOOKS = [{ id: 'today', label: 'V2 today' }, { id: 'target', label: 'Target' }];

  function readLook() {
    try { return localStorage.getItem(LOOK_KEY) === 'target' ? 'target' : 'today'; } catch (e) { return 'today'; }
  }
  function saveLook(v) {
    try { localStorage.setItem(LOOK_KEY, v); } catch (e) { /* storage blocked: the switch still works for this visit */ }
  }

  function currentId() {
    const h = decodeURIComponent((location.hash || '').replace(/^#\/?/, ''));
    return C.byId(h) ? h : C.sections[0].id;
  }

  function useRegistryTick() {
    const [, setTick] = useState(0);
    useEffect(function () { return G.subscribe(function () { setTick(function (t) { return t + 1; }); }); }, []);
  }

  function Nav({ current }) {
    return (
      <nav className="g-nav" aria-label="Sections">
        <a className="g-nav-brand" href={toHash(C.sections[0].id)}>
          <span className="g-nav-brand-name">BlueAI Product V2</span>
          <span className="g-nav-brand-sub">Design System</span>
        </a>
        {C.groups.map(function (g) {
          const list = C.inGroup(g.id);
          return (
            <div className="g-nav-group" key={g.id}>
              <div className="g-nav-title" id={'nav-' + g.id}>{g.title}</div>
              <ul className="g-nav-list" aria-labelledby={'nav-' + g.id}>
                {list.map(function (s) {
                  const on = s.id === current;
                  const built = !!G.get(s.id);
                  return (
                    <li key={s.id}>
                      <a className={G.cx('g-nav-link', on && 'is-current', !built && 'is-empty')} href={toHash(s.id)} aria-current={on ? 'page' : undefined}>
                        <span className="g-nav-num">{s.number}</span>
                        <span className="g-nav-text">{s.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    );
  }

  function Header({ look, onLook }) {
    return (
      <header className="g-header">
        <div className="g-header-row">
          <div>
            <div className="g-eyebrow">BlueAI desktop app</div>
            <div className="g-title">{NAME}</div>
          </div>
          <div className="g-header-links">
            <div className="g-filter g-look-switch" role="group" aria-label="Look">
              <span className="g-muted">Look:</span>
              {LOOKS.map(function (l) {
                return <button type="button" key={l.id} className="g-btn" aria-pressed={look === l.id} onClick={function () { onLook(l.id); }}>{l.label}</button>;
              })}
            </div>
            <a className="g-link" href="index.html" target="_blank" rel="noopener">Open V2</a>
            <a className="g-link" href="../blueai-product-v2-ds/DESIGN.md" target="_blank" rel="noopener">DESIGN.md</a>
          </div>
        </div>
        <dl className="g-legend" aria-label="Status legend">
          {['in_v2', 'changed', 'new'].map(function (k) {
            const text = (C.legend[k] || '').replace(/^[^:]*:\s*/, '');
            return (
              <div className="g-legend-item" key={k}>
                <dt><G.StatusTag status={k} /></dt>
                <dd>{text}</dd>
              </div>
            );
          })}
        </dl>
      </header>
    );
  }

  function Placeholder({ section }) {
    return (
      <G.Section id={section.id}>
        <div className="g-placeholder">
          <p className="g-placeholder-text">Not built yet. Owner: {section.owner}.</p>
          {section.parts.length ? (
            <ul className="g-placeholder-parts">
              {section.parts.map(function (p) {
                return <li key={p.name}><span className="g-placeholder-name">{p.name}</span><G.StatusTag status={p.status} /></li>;
              })}
            </ul>
          ) : null}
        </div>
      </G.Section>
    );
  }

  function Pager({ id }) {
    const i = C.sections.findIndex(function (s) { return s.id === id; });
    const prev = C.sections[i - 1];
    const next = C.sections[i + 1];
    return (
      <nav className="g-pager" aria-label="Previous and next section">
        {prev ? <a className="g-pager-link" href={toHash(prev.id)}><span className="g-muted">Previous</span><span>{prev.number} {prev.title}</span></a> : <span />}
        {next ? <a className="g-pager-link g-pager-link--next" href={toHash(next.id)}><span className="g-muted">Next</span><span>{next.number} {next.title}</span></a> : <span />}
      </nav>
    );
  }

  function App() {
    const [id, setId] = useState(currentId);
    const [look, setLook] = useState(readLook);
    function pickLook(v) { setLook(v); saveLook(v); }
    const mainRef = useRef(null);
    const first = useRef(true);
    useRegistryTick();
    useEffect(function () {
      function onHash() { setId(currentId()); }
      window.addEventListener('hashchange', onHash);
      return function () { window.removeEventListener('hashchange', onHash); };
    }, []);
    useEffect(function () {
      const s = C.byId(id);
      document.title = (s ? s.number + ' ' + s.title + ' | ' : '') + NAME;
      if (first.current) { first.current = false; return; }
      window.scrollTo(0, 0);
      const h = document.getElementById('h-' + id);
      if (h) h.focus({ preventScroll: true });
    }, [id]);
    const section = C.byId(id);
    const Comp = G.get(id);
    return (
      <div className="g-app">
        <a className="g-skip" href="#g-main" onClick={function (e) { e.preventDefault(); if (mainRef.current) mainRef.current.focus(); }}>Skip to content</a>
        <Nav current={id} />
        <main className="g-main" id="g-main" ref={mainRef} tabIndex={-1}>
          <Header look={look} onLook={pickLook} />
          <div className="g-look" data-v2-look={look === 'today' ? 'today' : undefined}>
            <G.Boundary key={id}>{Comp ? <Comp /> : <Placeholder section={section} />}</G.Boundary>
          </div>
          <Pager id={id} />
        </main>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('g-root')).render(<App />);
})();
