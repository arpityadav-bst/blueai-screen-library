/* Section 09 Focus and accessibility (foundations slice). The focus ring, a contrast table computed
   live from tokens (helpers from section 03, window.V2Foundations), targets and the keyboard model. */
(function () {
  const G = window.V2Guide;
  const TEXTS = ['--v2-ink', '--v2-ink-2', '--v2-ink-3', '--v2-ink-4', '--v2-blue-ink', '--v2-success-ink', '--v2-attention-ink', '--v2-danger-ink'];
  const GROUNDS = [
    ['--v2-surface', 'surface'], ['--v2-canvas', 'canvas'], ['--v2-surface-panel', 'panel'], ['--v2-surface-sunken', 'sunken'],
    ['--v2-blue-tint', 'blue tint'], ['--v2-select', 'selected'], ['--v2-success-tint', 'success tint'],
    ['--v2-attention-tint', 'attention tint'], ['--v2-danger-tint', 'danger tint'],
  ];
  const FILLS = [['--v2-action', 'action'], ['--v2-action-hover', 'action hover'], ['--v2-danger-ink', 'danger'], ['--v2-ink', 'ink'], ['--v2-blue', 'brand blue (not a fill)']];
  // V2 pairs that fail, each quoted from its line.
  const V2_PAIRS = [
    ['#94a3b8', '#ffffff', "'Working on it…'", 'foundations.ink.thinking', '--v2-ink-4', '--v2-surface'],
    ['#60a5fa', '#eef5ff', "'PLAN' eyebrow", ['foundations.type.eyebrow', 'foundations.a11y.plan-card-bg'], '--v2-ink-3', '--v2-surface'],
    ['#f59e0b', '#ffffff', 'amber sign-in link', 'foundations.a11y.amber-link', '--v2-ink', '--v2-surface'],
    ['#ffffff', '#1990FF', 'every primary button label', 'foundations.blue.new-chat', '--v2-on-color', '--v2-action'],
    ['#ffffff', '#ef4444', 'Logout button label', 'foundations.status.logout-red', '--v2-on-color', '--v2-danger-ink'],
    ['#4ade80', '#d9fbe4', 'success stamp icon (needs 3:1)', 'foundations.status.final-success', '--v2-success', '--v2-success-tint'],
  ];
  const KEYS = [
    ['Menus', 'Trigger has aria-haspopup and aria-expanded. Enter, Space or Down opens and focuses the first item; Up and Down move, Home and End jump; Enter picks; Esc or Tab closes and focus returns to the trigger.'],
    ['Dialogs', 'Focus moves in on open, by kind: the panel takes it for a dialog read before acting (task, consent, day done), the first field takes it through initialFocus for a form dialog, Cancel takes it for an alert. Tab stays inside; Esc closes unless the dialog blocks (terms); focus returns to what opened it. The title labels the dialog.'],
    ['Sheets', 'Same as dialogs. The blocking terms sheet has no close and no Esc: its one way out is the agreement button.'],
    ['Tabs', 'One tab stop; Left and Right move and select; the panel follows.'],
    ['Thread', "role='log' with aria-live='polite': new worker messages are read once, never the whole history."],
    ['Toast', "The toast host keeps two aria-live regions: polite for most toasts, assertive for errors (danger reads as error). A toast with an action (Undo) has no timer: it stays until it is used or dismissed, so the action never leaves on its own."],
    ['Errors', "Field errors sit under the field with aria-describedby; a run or screen error uses role='alert' once."],
  ];
  const TARGETS = [
    [24, 'absolute floor', 'nothing pressable is smaller'],
    [32, '--v2-hit-min', 'consent, money and every control in a row of controls'],
    [36, '--v2-control-md', 'default button, icon button, send'],
    [44, '--v2-control-lg', 'full-width dialog and sheet actions, sign-in doors'],
  ];

  function A11ySection() {
    const K = window.V2Kit || {};
    const F = window.V2Foundations;
    const field = { width: 180, height: 'var(--v2-field-h)', padding: '0 var(--v2-space-3)', borderRadius: 'var(--v2-radius-sm)', border: 'var(--v2-stroke) solid var(--v2-blue)', boxShadow: 'var(--v2-focus-ring)', background: 'var(--v2-surface)', display: 'flex', alignItems: 'center' };
    const R = F ? F.Ratio : function () { return <span className="g-missing">contrast helpers not loaded</span>; };
    return (
      <G.Section id="accessibility">
        <G.Part name="Focus ring" status="changed" role="Every interactive part shows the same focus: a 2px brand-blue outline 2px out; fields show a blue border and a 3px ring instead.">
          <G.StateGrid states={[
            { label: 'Button', note: ':focus-visible', node: K.Button ? <K.Button variant="secondary" className="is-focus">Try again</K.Button> : <button type="button" className="g-btn is-focus">Try again</button> },
            { label: 'Primary button', note: 'outline sits off the fill', node: K.Button ? <K.Button variant="primary" className="is-focus">Try again</K.Button> : null },
            { label: 'Chip', node: K.Chip ? <K.Chip className="is-focus">Not now</K.Chip> : <span className="g-missing">Chip is not loaded</span> },
            { label: 'Field', note: 'border + --v2-focus-ring', node: K.TextField ? <K.TextField label="API key" className="is-focus" /> : <span style={field} className="v2-text-body">API key</span> },
            { label: 'Icon button', node: K.IconButton ? <K.IconButton icon="help" label="Help" className="is-focus" /> : null },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="Press Tab in V2: the browser default ring on most controls; the BYOK select in Settings shows none" height={560} />}
            system={<div className="v2-stack" style={{ alignItems: 'flex-start' }}>{K.Button ? <K.Button variant="primary" className="is-focus">Try again</K.Button> : null}<span style={field} className="v2-text-body">API key</span></div>}
            changed="V2 ships one :focus rule (fields: #1990FF border and a 12% ring) and removes the BYOK select's outline with nothing in its place. One global :focus-visible rule in kit/base.css, the site's own values, so no part can opt out by accident; fields keep a border plus ring." />
          <G.SpecDrawer rows={[
            { part: 'Outline', token: '--v2-focus-outline / --v2-focus-offset', value: '2px solid #156efe, offset 2px', ref: 'foundations.a11y.onblue-focus' },
            { part: 'Field ring', token: '--v2-focus-ring', value: 'border #156efe + 0 0 0 3px rgba(21,110,254,0.16)', ref: ['foundations.blue.field-focus', 'foundations.a11y.onblue-field-ring'] },
            { part: 'Removed outline', token: null, value: "outline: 'none' with no replacement", ref: 'foundations.a11y.select-outline' },
            { part: 'Script focus', token: null, value: "[tabindex='-1'] shows no ring (dialog titles, screen titles)" },
            { part: 'Copy shown', token: null, value: "'Not now'", ref: 'foundations.a11y.not-now' },
          ]} />
        </G.Part>

        <G.Part name="Contrast table" status="changed" role="Every text token on every ground, computed live: body text needs 4.5:1, icons and large text 3:1. A cell that fails is a pairing the system forbids.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Text</th>{GROUNDS.map(function (g) { return <th key={g[0]} scope="col">{g[1]}</th>; })}</tr></thead>
              <tbody>{TEXTS.map(function (t) {
                return <tr key={t}><td><code className="g-code">{t.replace('--v2-', '')}</code></td>{GROUNDS.map(function (g) { return <td key={g[0]} style={{ background: 'var(' + g[0] + ')' }}><R fg={t} bg={g[0]} /></td>; })}</tr>;
              })}</tbody>
            </table>
          </div>
          <div className="v2-hstack v2-wrap v2-gap-4">{FILLS.map(function (f) {
            return <span key={f[0]} className="v2-hstack v2-gap-2"><span style={{ background: 'var(' + f[0] + ')', color: 'var(--v2-on-color)', padding: '2px var(--v2-space-2)', borderRadius: 'var(--v2-radius-xs)', fontSize: 'var(--v2-text-13)' }}>on-color on {f[1]}</span><R fg="--v2-on-color" bg={f[0]} /></span>;
          })}</div>
          <G.Warn>Rules the table enforces: ink-4 is meta only and only on surface, panel or canvas at rest (it is under 4.5:1 on sunken, every tint, selected, and the hover and press washes), placeholder is never text that must be read, status inks go on their own tint or on white, and white labels go on action, never on brand blue.</G.Warn>
          <G.CompareRow
            v2={<div className="g-table-wrap"><table className="g-table"><tbody>{V2_PAIRS.map(function (p) {
              return <tr key={p[2]}><td><span style={{ color: p[0], background: p[1], padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>Aa</span></td><td className="v2-text-meta">{p[2]}</td><td><R fg={p[0]} bg={p[1]} /></td></tr>;
            })}</tbody></table></div>}
            system={<div className="g-table-wrap"><table className="g-table"><tbody>{V2_PAIRS.map(function (p) {
              return <tr key={p[2]}><td><span style={{ color: 'var(' + p[4] + ')', background: 'var(' + p[5] + ')', padding: '2px 6px', borderRadius: 'var(--v2-radius-xs)', border: 'var(--v2-stroke) solid var(--v2-line-hair)' }}>Aa</span></td><td className="v2-text-meta">{p[4].replace('--v2-', '')} on {p[5].replace('--v2-', '')}</td><td><R fg={p[4]} bg={p[5]} /></td></tr>;
            })}</tbody></table></div>}
            changed="V2's faintest text carries its most important caveats, and its primary and destructive labels fail. Each pair moves to the token that passes; the stamp becomes a 3:1 icon on its tint." />
          <G.SpecDrawer rows={V2_PAIRS.map(function (p) {
            return { part: p[2], token: p[4] + ' on ' + p[5], value: 'V2 ' + p[0] + ' on ' + p[1], ref: p[3] };
          })} />
        </G.Part>

        <G.Part name="Targets and keyboard" status="new" role="Hit targets sized for a mouse on a small window, and one keyboard model for menus, dialogs, sheets, tabs and live updates.">
          <G.Note>Why the product needs it: the partner agrees to an agent acting on their accounts through these controls, so consent and money controls must be easy to hit and reachable without a mouse. In V2 no overlay moves focus, the header menus open and close on the mouse only, and the consent and coach controls are 21 to 22px tall.</G.Note>
          <G.StateGrid states={TARGETS.map(function (t) {
            return { label: t[0] + 'px: ' + t[1], note: t[2], node: <span style={{ width: t[0], height: t[0], borderRadius: 'var(--v2-radius-sm)', border: 'var(--v2-stroke) dashed var(--v2-blue)', background: 'var(--v2-blue-tint)' }} aria-hidden="true" /> };
          })} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Part</th><th scope="col">Keyboard and announcement</th></tr></thead>
              <tbody>{KEYS.map(function (k) { return <tr key={k[0]}><td className="v2-text-label" style={{ color: 'var(--v2-ink)' }}>{k[0]}</td><td>{k[1]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.SpecDrawer rows={[
            { part: 'Consent and money controls', token: '--v2-hit-min', value: '32px minimum (V2 21 to 22px)', ref: ['foundations.a11y.okay-21', 'foundations.a11y.info-22'] },
            { part: 'Default control', token: '--v2-control-md', value: '36px' },
            { part: 'Menus', token: null, value: 'aria-haspopup, aria-expanded, arrows, Esc, focus return (V2: mousedown only)', ref: 'foundations.a11y.menu-mousedown' },
            { part: 'Reduced motion', token: null, value: 'see section 07' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('accessibility', A11ySection);
})();
