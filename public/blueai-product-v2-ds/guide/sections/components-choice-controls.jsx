/* Section 14: Switch, checkbox, radio card, segmented (actions-inputs slice). Kit: window.V2Kit
   Switch, Checkbox, RadioCard, Segmented (kit/choice.jsx, kit/inputs.css). Spec: design-md/14. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  /* V2 copy, quoted (refs below). Proposed copy is marked where it is used. */
  const NO_HW = "This PC doesn't meet the requirements for Hybrid.";
  const CLOUD = { value: 'cloud', title: 'Cloud', sub: 'Default. Uses cloud AI.' };
  const HYBRID = { value: 'hybrid', title: 'Hybrid', sub: 'Uses your PC and saves AI credits.' };
  const AUTO = { value: 'auto', title: 'Auto', sub: 'BlueAI runs a local model for you.', badge: 'Recommended' };
  const MODES = [{ value: 'always', label: 'Always ask', icon: 'shield-check' }, { value: 'auto', label: 'Automatic', icon: 'zap' }];
  const RUN_WINDOW = [
    { value: 'time', title: 'At a set time', sub: 'Starts within the hour you pick, like 11 am.' },
    { value: 'window', title: 'In a window', sub: 'A different moment each day, like 9 am to 9 pm.' },
    { value: 'any', title: 'Leave it to me', sub: 'BlueAI picks a time each day.' },
  ];
  const KEY_ROW = { label: 'Use my own key', description: 'Your key stays saved when this is off.' };

  function V2Toggles() {
    const [on, setOn] = useState(true);
    const [byok, setByok] = useState(true);
    const [info, setInfo] = useState({ provider: 'Anthropic', model: 'claude-haiku-4-5', key: 'sk-ant-example-0000' });
    const T = window.Toggle;
    const B = window.Byok;
    return (
      <div className="v2-stack">
        {T ? <T enabled={on} onToggle={function () { setOn(!on); }} /> : null}
        {B && B.ByokSettings ? <B.ByokSettings on={byok} setOn={setByok} keyAdded={!!info} keyInfo={info} onSave={setInfo} onRemove={function () { setInfo(null); }} /> : null}
      </div>
    );
  }
  function V2AiMode() { const A = window.AiMode; const p = A.useAiMode(); return <A.AIModeCard {...p} />; }

  function SwitchRow() {
    const K = window.V2Kit;
    const [on, setOn] = useState(false);
    return <K.Switch {...KEY_ROW} checked={on} onChange={setOn} />;
  }
  function GatedMode() {
    const K = window.V2Kit;
    const [mode, setMode] = useState('always');
    const [ask, setAsk] = useState(null);
    function gate(v) { return v !== 'auto' ? true : new Promise(function (res) { setAsk(function () { return res; }); }); }
    function answer(ok) { if (ask) ask(ok); setAsk(null); }
    return (
      <div className="v2-stack" style={{ maxWidth: 'var(--v2-shell-w)' }}>
        <div className="v2-hstack v2-hstack--between"><span className="v2-text-label">YouTube</span>
          <K.Segmented ariaLabel="YouTube mode" options={MODES} value={mode} onChange={setMode} beforeChange={gate} /></div>
        {ask ? (
          <div className="g-callout v2-stack">
            <strong>Run YouTube jobs automatically?</strong>
            <span>By turning this on, you agree to let BlueAI do this for you on YouTube. You can turn it off anytime.</span>
            <div className="v2-hstack v2-gap-2"><K.Button onClick={function () { answer(false); }}>Cancel</K.Button><K.Button variant="primary" onClick={function () { answer(true); }}>I agree, turn on</K.Button></div>
          </div>
        ) : null}
      </div>
    );
  }

  function ChoiceSection() {
    const K = window.V2Kit;
    const sw = function (extra) { return Object.assign({ label: KEY_ROW.label, hideLabel: true, onChange: noop }, extra); };
    const rc = function (o, value) { return <div style={{ width: '100%' }}><K.RadioCard label="AI mode" options={[o]} value={value} onChange={noop} /></div>; };
    const seg = function (extra, opts) { return <K.Segmented ariaLabel="YouTube mode" options={opts || MODES} value="always" onChange={noop} {...extra} />; };
    const mark = function (o, cls) { return MODES.map(function (m) { return m.value === o ? Object.assign({}, m, { className: cls }) : m; }); };
    return (
      <G.Section id="choice-controls">
        <G.Part name="Switch" status="changed" role="On or off, applied at once. A switch only enables or disables; it never deletes anything.">
          <G.StateGrid states={[
            { label: 'Off', node: <K.Switch {...sw()} /> },
            { label: 'On', node: <K.Switch {...sw({ checked: true })} /> },
            { label: 'Hover, off', node: <K.Switch {...sw({ className: 'is-hover' })} /> },
            { label: 'Hover, on', node: <K.Switch {...sw({ checked: true, className: 'is-hover' })} /> },
            { label: 'Focus-visible', node: <K.Switch {...sw({ checked: true, className: 'is-focus' })} /> },
            { label: 'Disabled', node: <div className="v2-hstack v2-gap-3"><K.Switch {...sw({ disabled: true })} /><K.Switch {...sw({ disabled: true, checked: true })} /></div> },
            { label: 'Busy', note: 'waiting on consent or a check', node: <K.Switch {...sw({ busy: true })} /> },
          ]} />
          <G.Stage ground="surface" width="shell"><SwitchRow /></G.Stage>
          <ul className="g-list">
            <li>Track 36 by 20, pill. Off: 1px ink-4 edge, white, a 12px ink-4 thumb. On: action fill, a 16px white thumb. Both clear 3:1 on white.</li>
            <li>Row: label 14/500 ink and description 13 ink-3 on the left, the switch on the right; the label is clickable. role=switch, a 32px target. The row's copy is proposed.</li>
          </ul>
          <G.CompareRow
            v2={<G.Live get={function () { return (window.Toggle || window.Byok) && V2Toggles; }} label="Toggle and Byok.ByokSettings" />}
            system={<SwitchRow />}
            changed="Two switches (32x18 with a spring, 46x26 as a pressed button) become one role=switch. Off gets an edge that can be seen (V2's grey tracks are 1.48:1). And a switch never deletes: in V2, switching Bring Your Own Key off removes the saved key. Try it on the left." />
          <G.SpecDrawer rows={[
            { part: 'Track', token: '--v2-radius-pill', value: '36x20 (V2: 32x18 and 46x26)', ref: ['actions-inputs.switch.shared', 'actions-inputs.switch.byok'] },
            { part: 'Off', token: '--v2-ink-4, --v2-surface', value: '1px #6e737c edge, white, thumb 12 ink-4 (V2: fill #d1d5db / #cbd5e1)', ref: ['actions-inputs.switch.shared-colours', 'actions-inputs.switch.byok-colours'] },
            { part: 'On', token: '--v2-action, --v2-surface', value: '#1268f0 fill, thumb 16 white (V2 #1990FF)' },
            { part: 'Motion', token: '--v2-dur-2, --v2-ease-out', value: 'thumb slides 180ms, no overshoot (V2: a spring)', ref: 'actions-inputs.switch.shared-spring' },
            { part: 'Role', token: null, value: 'role=switch, aria-checked (V2 BYOK: aria-pressed button)', ref: ['actions-inputs.switch.shared-role', 'actions-inputs.switch.byok-pressed'] },
            { part: 'Busy', token: null, value: 'aria-busy, the thumb becomes a 12 spinner, clicks ignored' },
            { part: 'Never destroys', token: null, value: 'off disables only (V2 BYOK off deletes the key, R30)', ref: 'actions-inputs.switch.byok-delete' },
          ]} />
        </G.Part>

        <G.Part name="Checkbox" status="new" role="Many-of-many inside a form that saves together: notification choices, include diagnostic info. Not for consent: the agreement is the button.">
          <G.StateGrid states={[
            { label: 'Unchecked', node: <K.Checkbox label="Include diagnostic info" /> },
            { label: 'Hover', node: <K.Checkbox label="Include diagnostic info" className="is-hover" /> },
            { label: 'Focus-visible', node: <K.Checkbox label="Include diagnostic info" className="is-focus" /> },
            { label: 'Checked', node: <K.Checkbox label="Include diagnostic info" defaultChecked /> },
            { label: 'Indeterminate', note: 'some of a group', node: <K.Checkbox label="All notifications" indeterminate /> },
            { label: 'Disabled', node: <K.Checkbox label="Include diagnostic info" disabled /> },
            { label: 'Disabled, checked', node: <K.Checkbox label="Include diagnostic info" disabled defaultChecked /> },
            { label: 'Invalid', note: 'Proposed copy', node: <K.Checkbox label="Include diagnostic info" error="Needed to look into a failed run." /> },
          ]} />
          <G.Stage ground="surface" width="shell">
            <fieldset className="v2-fieldset">
              <legend className="v2-legend">Tell me when</legend>
              <K.Checkbox label="A job is waiting for you" defaultChecked />
              <K.Checkbox label="Today's run is done" defaultChecked />
              <K.Checkbox label="A day is verified" />
              <K.Checkbox label="Include diagnostic info" description="Adds this run's log to your report." />
            </fieldset>
          </G.Stage>
          <G.Note>New, and why: notification preferences (section 60) and Report a problem (section 65) are lists of independent choices saved together. All copy in this part is proposed.</G.Note>
          <G.SpecDrawer rows={[
            { part: 'Box', token: '--v2-radius-xs, --v2-ink-4', value: '18, radius 4, 1px #6e737c (site: 19, radius 6; V2 review panel: 13)', ref: ['actions-inputs.onblue.check-box', 'actions-inputs.checkbox.dev-box'] },
            { part: 'Checked', token: '--v2-action, --v2-on-color', value: 'action fill, white tick drawn in CSS', ref: ['actions-inputs.onblue.check-on', 'actions-inputs.checkbox.dev-on'] },
            { part: 'Indeterminate', token: '--v2-action', value: 'action fill, white 10x2 bar' },
            { part: 'Hover', token: '--v2-ink-3, --v2-wash-hover, --v2-action-hover', value: 'edge to ink-3 + wash; checked deepens' },
            { part: 'Row', token: '--v2-hit-min, --v2-text-14, --v2-text-13', value: 'min 32, gap 12, label 14 ink, description 13 ink-3; whole row toggles' },
            { part: 'Invalid', token: '--v2-danger-line, --v2-danger-ink', value: 'red edge + message under the label' },
            { part: 'Semantics', token: null, value: 'native input type=checkbox (V2 has only a dev-panel button role=checkbox)', ref: 'actions-inputs.checkbox.dev-role' },
          ]} />
        </G.Part>

        <G.Part name="RadioCard" status="changed" role="One of a few options the partner compares, each with a line of why. The base of AI mode and of the run-window setting.">
          <G.StateGrid wide states={[
            { label: 'Rest', node: rc(CLOUD, null) },
            { label: 'Hover', node: rc(Object.assign({ className: 'is-hover' }, CLOUD), null) },
            { label: 'Selected', node: rc(CLOUD, 'cloud') },
            { label: 'Focus-visible', node: rc(Object.assign({ className: 'is-focus' }, CLOUD), 'cloud') },
            { label: 'Pending', note: 'picked, setup still to finish', node: rc(Object.assign({ pending: 'Setup needed' }, HYBRID), null) },
            { label: 'Disabled with reason', node: rc(Object.assign({ disabled: true, disabledReason: NO_HW }, HYBRID), null) },
            { label: 'With a badge', node: rc(AUTO, null) },
          ]} />
          <G.Stage ground="surface" width="shell">
            <K.RadioCard label="When to run" variant="list" options={RUN_WINDOW} defaultValue="window" />
          </G.Stage>
          <G.Note>Hybrid's line says "AI credits" where V2 says "tokens" (a banned word), and the run-window options are proposed copy built on V2's schedule question; the rest is V2 copy.</G.Note>
          <G.CompareRow
            v2={<G.Live get={function () { return window.AiMode && window.AiMode.useAiMode && V2AiMode; }} label="AiMode.AIModeCard" />}
            system={<K.RadioCard label="AI mode" options={[CLOUD, HYBRID]} defaultValue="cloud" />}
            changed="OptionCard was a row of plain buttons: no radio role, no arrow keys, no focus, and the reason Hybrid is unavailable lived only in a hover title. It becomes a real radio group with the family's chosen look and the reason printed on the card." />
          <G.SpecDrawer rows={[
            { part: 'Card', token: '--v2-radius-md, --v2-line', value: 'radius 10, padding 12, 1px 10% black (V2: radius 12, 1.5px #e3e7ee)', ref: ['actions-inputs.radio-card.shape', 'actions-inputs.radio-card.border'] },
            { part: 'Title, sub', token: '--v2-text-14, --v2-text-13', value: '14/600 ink, 13 ink-3 (V2 title 15/700)', ref: 'actions-inputs.radio-card.title' },
            { part: 'Hover', token: '--v2-line-hover, --v2-wash-hover', value: '20% edge + wash (V2: JS border swap)', ref: 'actions-inputs.radio-card.hover' },
            { part: 'Selected', token: '--v2-select, --v2-select-line, --v2-stroke-selected', value: 'blue 12% fill, 50% edge at 1.5, check 16 blue-ink (V2 #eef6ff, 1.5px #1990FF)', ref: ['actions-inputs.radio-card.fill', 'actions-inputs.radio-card.border', 'actions-inputs.onblue.choice-on'] },
            { part: 'Pending', token: '--v2-select-line', value: 'dashed edge + attention badge (V2: dashed blue + amber tag)', ref: ['actions-inputs.radio-card.border', 'actions-inputs.radio-card.pending-tag'] },
            { part: 'Disabled', token: '--v2-surface-sunken, --v2-opacity-disabled', value: 'sunken, title and sub at 0.45, reason in ink-2 with a lock (V2: 0.5, reason in a title)', ref: ['actions-inputs.radio-card.disabled', 'actions-inputs.radio-card.reason'] },
            { part: 'Semantics', token: null, value: 'native radios: arrow keys, one tab stop, focus ring on the card (V2: plain buttons)', ref: ['actions-inputs.radio-card.button', 'actions-inputs.radio-card.signature'] },
            { part: 'Copy', token: null, value: 'V2 titles and subs', ref: ['actions-inputs.radio-card.cloud', 'actions-inputs.radio-card.hybrid', 'actions-inputs.radio-card.auto', 'actions-inputs.radio-card.badge', 'actions-inputs.radio-card.run-window', 'actions-inputs.radio-card.run-window-options'] },
          ]} />
        </G.Part>

        <G.Part name="Segmented" status="changed" role="Two or three short options in one line: the per-app Always ask / Automatic. A gate can hold a change until the partner agrees.">
          <G.StateGrid wide states={[
            { label: 'Rest', node: seg() },
            { label: 'Hover (Automatic)', node: seg({ options: mark('auto', 'is-hover') }) },
            { label: 'Selected (Automatic)', node: seg({ value: 'auto' }) },
            { label: 'Focus-visible', node: seg({ options: mark('always', 'is-focus') }) },
            { label: 'Disabled', note: 'say why beside it', node: seg({ disabled: true }) },
            { label: 'Gated (consent open)', note: 'selection waits', node: seg({ options: mark('auto', 'is-pending') }) },
            { label: 'Small, text only', node: seg({ size: 'sm' }, MODES.map(function (m) { return { value: m.value, label: m.label }; })) },
          ]} />
          <G.Stage ground="surface"><GatedMode /></G.Stage>
          <G.Note>Try it: pick Automatic. The consent opens and the selection waits; Cancel leaves Always ask. With a gate, arrow keys only move focus and Space asks, so no dialog opens from a stray key.</G.Note>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker&v=1" label="V2: the Mode chip in the composer (open it)" height={830} />}
            system={<div className="v2-hstack v2-hstack--between" style={{ maxWidth: 'var(--v2-shell-w)' }}><span className="v2-text-label">YouTube</span>{seg()}</div>}
            changed="It declared a radiogroup but answered clicks only; now arrows, Home and End move between options with one tab stop. The selected segment is an edge and ink, not a white chip with a shadow; labels go from 11.5/700 to 13/500. beforeChange keeps the Automatic consent gate." />
          <G.SpecDrawer rows={[
            { part: 'Track', token: '--v2-surface-sunken, --v2-line, --v2-radius-md', value: 'sunken, 1px 10% edge, radius 10, padding 2 (V2 #f1f5f9, radius 8, width 172)', ref: ['actions-inputs.segmented.track', 'actions-inputs.onblue.tabs-track'] },
            { part: 'Segment', token: '--v2-hit-min, --v2-radius-sm, --v2-text-13', value: '32 (sm 28), radius 6, 13/500 ink-3, icon 16 (V2: 11.5/700)', ref: 'actions-inputs.segmented.segment' },
            { part: 'Selected', token: '--v2-surface, --v2-line, --v2-ink', value: 'white, 1px edge, ink, no shadow (V2: a shadow)', ref: ['actions-inputs.segmented.selected', 'actions-inputs.onblue.tab-on'] },
            { part: 'Hover', token: '--v2-wash-hover, --v2-ink', value: 'wash + ink' },
            { part: 'Keys', token: null, value: 'radiogroup, roving tabindex, arrows, Home, End (V2: clicks only)', ref: ['actions-inputs.segmented.role', 'actions-inputs.segmented.radio'] },
            { part: 'Gate', token: '--v2-select-line', value: 'beforeChange(value) resolves true to apply; dashed edge while waiting' },
            { part: 'Copy', token: null, value: 'V2 copy', ref: ['actions-inputs.segmented.always', 'actions-inputs.segmented.auto', 'actions-inputs.segmented.youtube', 'actions-inputs.segmented.consent-title', 'actions-inputs.segmented.consent-copy', 'actions-inputs.button.consent', 'actions-inputs.button.cancel'] },
          ]} />
          <G.DoDont
            do={['Use Segmented for two or three short, equal options.', 'Gate a change that needs consent with beforeChange.']}
            dont={['Use it for navigation between views: that is Tabs (section 28).', 'Apply Automatic before the partner agrees.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('choice-controls', ChoiceSection);
})();
