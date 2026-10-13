/* BlueAI Product V2 Design System: the guide's building blocks and section registry.

   HOW A SLICE ADDS A SECTION
   1. Create guide/sections/<group>-<id>.jsx (names come from guide/catalog.jsx; ds-check enforces them).
   2. Write it as an IIFE, read kit parts at render time, and register under the catalog id:

        (function () {
          const G = window.V2Guide;
          function ButtonSection() {
            const K = window.V2Kit;
            return (
              <G.Section id="button">
                <G.Part name="Button" status="changed" role="One action ladder, one shape.">
                  <G.StateGrid states={[
                    { label: 'Rest', node: <K.Button>Save</K.Button> },
                    { label: 'Hover', node: <K.Button className="is-hover">Save</K.Button> },
                  ]} />
                  <G.CompareRow
                    v2={<G.Live get={() => window.Byok && window.Byok.OutOfCreditsCard} props={{ onDismiss() {} }} />}
                    system={<K.Button variant="primary">Use my own key</K.Button>}
                    changed="Pill + 15/700 + 3.24:1 label becomes radius 6 + 13/500 + 4.92:1." />
                  <G.SpecDrawer rows={[
                    { part: 'Fill', token: '--v2-action', value: '#1268f0', ref: 'actions-inputs.button.fill' },
                  ]} />
                </G.Part>
              </G.Section>
            );
          }
          G.register('button', ButtonSection);
        })();

   API (window.V2Guide)
   register(id, Component)   id = catalog section id ('button', 'run-card'). Last registration wins.
   get(id), ids()            the registered component for an id; every registered id.
   subscribe(fn)             fn() runs after each register (the app uses it to redraw).
   STATUS                    { in_v2: 'In V2', changed: 'Changed from V2', new: 'New' }

   Blocks (all plain function components, props listed):
   Section   {id, number?, title?, purpose?, status?, children}  number/title/purpose default to the
             catalog entry for id. Renders the heading, purpose and a count of part statuses.
   Part      {name, status, role, children}  one card per part; role is 25 words at most.
   StatusTag {status}  'in_v2' | 'changed' | 'new', labelled In V2 / Changed from V2 / New.
   StateGrid {states: [{label, node, note?}], wide?}  every state side by side. Force a state with a
             prop or with the classes the kit honours next to the real pseudo-class:
             .is-hover (:hover), .is-focus (:focus-visible), .is-active (:active). Kit CSS must write
             both, for example `.v2-button:hover, .v2-button.is-hover { ... }`.
   CompareRow {v2, system, changed, v2Label?, systemLabel?}  'V2 today' left, 'System' right, then
             'What changed and why'. v2 is usually <Live> or <FrameState>.
   FrameState {url, label?, height?}  a V2 URL state (relative to V2, for example
             'index.html?end=job') loaded in an iframe only when the reader clicks.
   Live      {get, props?, label?}  renders a live V2 component: get() returns it (read lazily, it
             may be missing); shows a quiet note instead of crashing when it is absent.
             The wrapper carries v2-preflight, so the kit's scoped reset stands in for V2's preflight.
   Stage     {width?: 'shell' | number, ground?: 'canvas' | 'surface' | 'sunken', children}
             a neutral specimen area; 'shell' is the 419px window width.
   DoDont    {do, dont}  each a node, a string or an array of strings.
   Note {children}, Warn {children}  quiet callouts (Warn for a known V2 problem or a decision).
   Table     {head: [string], rows: [[node]], caption?}  a plain reading table (g-table).
   Boundary  {children}  error boundary; the app wraps every section in one.
   From guide/spec.jsx: SpecDrawer {rows: [{part, token, value, ref}]}, TokenTable {family | names,
   roles?}, Swatch {token, label?, note?}, ref(id), refText(id). See that file's header.

   hashHref(id)   href for a link to another guide section. The page has <base href="/blueai-product-v2/">,
                  so relative URLs resolve into V2 (right for FrameState and V2 assets) and a bare '#id'
                  would leave the guide.

   Classes: guide chrome only uses g-*; kit parts keep their own v2-* classes. */
(function () {
  const { useState } = React;
  const registry = {};
  const listeners = [];
  const STATUS = { in_v2: 'In V2', changed: 'Changed from V2', new: 'New' };

  function register(id, Component) {
    registry[id] = Component;
    listeners.forEach(function (fn) { try { fn(id); } catch (e) { /* a listener must not break registration */ } });
  }
  function subscribe(fn) {
    listeners.push(fn);
    return function () { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };
  }
  function catalogEntry(id) {
    const C = window.V2Catalog;
    return C && C.byId ? C.byId(id) : null;
  }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  function StatusTag({ status }) {
    const label = STATUS[status] || status || 'Unknown';
    return <span className={cx('g-tag', 'g-tag--' + (STATUS[status] ? status : 'unknown'))}>{label}</span>;
  }

  function StatusCounts({ parts }) {
    if (!parts || !parts.length) return null;
    const n = { in_v2: 0, changed: 0, new: 0 };
    parts.forEach(function (p) { if (n[p.status] !== undefined) n[p.status] += 1; });
    return (
      <div className="g-counts" aria-label="Part statuses">
        {Object.keys(n).filter(function (k) { return n[k]; }).map(function (k) {
          return <span key={k} className="g-counts-item"><StatusTag status={k} /> <span className="g-num">{n[k]}</span></span>;
        })}
      </div>
    );
  }

  function Section({ id, number, title, purpose, status, children }) {
    const entry = catalogEntry(id) || {};
    const num = number || entry.number;
    const ttl = title || entry.title || id;
    const why = purpose || entry.purpose;
    return (
      <section className="g-section" id={'s-' + id} aria-labelledby={'h-' + id}>
        <header className="g-section-head">
          {num ? <div className="g-eyebrow">Section {num}</div> : null}
          <h1 className="g-h1" id={'h-' + id} tabIndex={-1}>{ttl}</h1>
          {status ? <StatusTag status={status} /> : null}
          {why ? <p className="g-lede">{why}</p> : null}
          <StatusCounts parts={entry.parts} />
        </header>
        <div className="g-section-body">{children}</div>
      </section>
    );
  }

  function Part({ name, status, role, children }) {
    return (
      <article className="g-part">
        <header className="g-part-head">
          <h2 className="g-h2">{name}</h2>
          {status ? <StatusTag status={status} /> : null}
        </header>
        {role ? <p className="g-role">{role}</p> : null}
        <div className="g-part-body">{children}</div>
      </article>
    );
  }

  function StateGrid({ states, wide }) {
    return (
      <div className={cx('g-states', wide && 'g-states--wide')}>
        {(states || []).map(function (s, i) {
          return (
            <figure className="g-state" key={s.label + i}>
              <div className="g-state-stage">{s.node}</div>
              <figcaption className="g-state-label">{s.label}{s.note ? <span className="g-state-note">{s.note}</span> : null}</figcaption>
            </figure>
          );
        })}
      </div>
    );
  }

  function CompareRow({ v2, system, changed, v2Label, systemLabel }) {
    return (
      <div className="g-compare">
        <div className="g-compare-cols">
          <div className="g-compare-col">
            <div className="g-eyebrow">{v2Label || 'V2 today'}</div>
            <div className="g-compare-stage g-compare-stage--v2">{v2}</div>
          </div>
          <div className="g-compare-col">
            <div className="g-eyebrow">{systemLabel || 'System'}</div>
            <div className="g-compare-stage">{system}</div>
          </div>
        </div>
        {changed ? <p className="g-compare-why"><strong>What changed and why. </strong>{changed}</p> : null}
      </div>
    );
  }

  function FrameState({ url, label, height }) {
    const [open, setOpen] = useState(false);
    const h = height || 600;
    if (!open) {
      return (
        <div className="g-frame g-frame--idle">
          <div className="g-frame-text">
            <div className="g-frame-label">{label || 'V2 state'}</div>
            <code className="g-code">{url}</code>
          </div>
          <button type="button" className="g-btn" onClick={function () { setOpen(true); }}>Load this V2 state</button>
        </div>
      );
    }
    return (
      <div className="g-frame">
        <iframe className="g-frame-iframe" src={url} title={label || ('V2 at ' + url)} style={{ height: h + 'px' }} />
        <div className="g-frame-foot">
          <code className="g-code">{url}</code>
          <a className="g-link" href={url} target="_blank" rel="noopener">Open in a new tab</a>
        </div>
      </div>
    );
  }

  class Boundary extends React.Component {
    constructor(p) { super(p); this.state = { error: null }; }
    static getDerivedStateFromError(error) { return { error: error }; }
    componentDidCatch(error) { if (window.console) console.error('[V2Guide]', error); }
    render() {
      if (this.state.error) {
        return <div className="g-callout g-callout--warn" role="alert">This part failed to render: {String(this.state.error && this.state.error.message || this.state.error)}</div>;
      }
      return this.props.children;
    }
  }

  function Live({ get, props, label }) {
    let Comp = null;
    try { Comp = typeof get === 'function' ? get() : get; } catch (e) { Comp = null; }
    if (!Comp) return <div className="g-missing">{label || 'This V2 component'} is not loaded on this page.</div>;
    // v2-preflight: matches kit/base.css's scoped reset (:where([class*="v2-"])), which mirrors the
    // Tailwind preflight V2 renders on, so live V2 parts get V2's real margins and list styles here.
    return <div className="g-live v2-preflight"><Boundary><Comp {...(props || {})} /></Boundary></div>;
  }

  function Stage({ width, ground, children }) {
    const w = width === 'shell' ? 'var(--v2-shell-w)' : (typeof width === 'number' ? width + 'px' : undefined);
    return <div className={cx('g-stage', 'g-stage--' + (ground || 'canvas'))} style={w ? { width: w } : undefined}>{children}</div>;
  }

  function list(x) {
    if (x == null) return null;
    if (Array.isArray(x)) return <ul className="g-list">{x.map(function (t, i) { return <li key={i}>{t}</li>; })}</ul>;
    return typeof x === 'string' ? <p>{x}</p> : x;
  }
  function DoDont(props) {
    return (
      <div className="g-dodont">
        <div className="g-do"><div className="g-dodont-head">Do</div>{list(props.do)}</div>
        <div className="g-dont"><div className="g-dodont-head">Don't</div>{list(props.dont)}</div>
      </div>
    );
  }
  function Table({ head, rows, caption }) {
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          {caption ? <caption className="g-muted">{caption}</caption> : null}
          <thead><tr>{head.map(function (h) { return <th scope="col" key={h}>{h}</th>; })}</tr></thead>
          <tbody>{rows.map(function (r, i) { return <tr key={i}>{r.map(function (c, j) { return <td key={j}>{c}</td>; })}</tr>; })}</tbody>
        </table>
      </div>
    );
  }
  function Note({ children }) { return <div className="g-callout">{children}</div>; }
  function Warn({ children }) { return <div className="g-callout g-callout--warn">{children}</div>; }

  const G = window.V2Guide = window.V2Guide || {};
  Object.assign(G, {
    STATUS: STATUS,
    register: register,
    subscribe: subscribe,
    get: function (id) { return registry[id] || null; },
    ids: function () { return Object.keys(registry); },
    cx: cx,
    hashHref: function (id) { return location.pathname + location.search + '#' + id; },
    StatusTag, StatusCounts, Section, Part, StateGrid, CompareRow, FrameState,
    Boundary, Live, Stage, DoDont, Note, Warn, Table,
  });
})();
