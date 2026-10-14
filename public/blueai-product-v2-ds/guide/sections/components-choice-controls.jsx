/* Section 14: Switch, checkbox, radio card, segmented (actions-inputs slice). Kit: window.V2Kit
   Switch, Checkbox, RadioCard, Segmented (kit/choice.jsx, kit/inputs.css). Spec: design-md/14. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  /* V2 copy, quoted (refs below). Proposed copy is not written here: it is read from where the product
     says it, so it exists once. AI mode and own-key strings: kit/advanced.jsx (V2Kit.AI_COPY,
     V2Kit.BYOK_COPY); run-window options: kit/worker-data.jsx (V2Kit.RUN_WINDOW_OPTIONS, which the
     Worker settings screen reads, section 62). With an export missing, its specimens say so. */
  const NO_HW = "This PC doesn't meet the requirements for Hybrid.";
  const MODES = [{ value: 'always', label: 'Always ask', icon: 'shield-check' }, { value: 'auto', label: 'Automatic', icon: 'zap' }];
  function copy() {
    const K = window.V2Kit || {};
    const ai = K.AI_COPY || {}, byok = K.BYOK_COPY || {};
    return {
      CLOUD: { value: 'cloud', title: 'Cloud', sub: ai.cloudSub },
      HYBRID: { value: 'hybrid', title: 'Hybrid', sub: ai.hybridSub },
      AUTO: { value: 'auto', title: 'Auto', sub: 'BlueAI runs a local model for you.', badge: 'Recommended' },
      RUN_WINDOW: K.RUN_WINDOW_OPTIONS || [],
      KEY_ROW: { label: byok.switchLabel, description: byok.switchDesc },
    };
  }
  // A specimen whose copy the kit does not export is not drawn from a second copy: it says what is missing.
  function missing(name, file) {
    return (window.V2Kit || {})[name] ? null
      : <div className="g-missing">{'V2Kit.' + name + ' is not exported (' + file + '), so this specimen is not drawn.'}</div>;
  }

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
    return missing('BYOK_COPY', 'kit/advanced.jsx') || <K.Switch {...copy().KEY_ROW} checked={on} onChange={setOn} />;
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
            <span>BlueAI will take paid YouTube jobs on its own and like, comment, follow and post from your account.</span>
            <span className="g-muted">Switch back anytime in Settings.</span>
            <div className="v2-hstack v2-gap-2"><K.Button onClick={function () { answer(false); }}>Cancel</K.Button><K.Button variant="primary" onClick={function () { answer(true); }}>I agree, turn on</K.Button></div>
          </div>
        ) : null}
      </div>
    );
  }

  function ChoiceSection() {
    const K = window.V2Kit;
    const { CLOUD, HYBRID, AUTO, RUN_WINDOW, KEY_ROW } = copy();
    const sw = function (extra) { return Object.assign({ label: KEY_ROW.label, hideLabel: true, onChange: noop }, extra); };
    // A disabled switch always says why, in its description (proposed copy).
    const off = { label: 'Use my watch history', description: 'Connect YouTube to turn this on.', disabled: true, onChange: noop };
    const rc = function (o, value) { return <div style={{ width: '100%' }}><K.RadioCard label="AI mode" options={[o]} value={value} onChange={noop} /></div>; };
    const seg = function (extra, opts) { return <K.Segmented ariaLabel="YouTube mode" options={opts || MODES} value="always" onChange={noop} {...extra} />; };
    const mark = function (o, cls) { return MODES.map(function (m) { return m.value === o ? Object.assign({}, m, { className: cls }) : m; }); };
    return (
      <G.Section id="choice-controls">
        <G.Note>V3 restyle (2026-10-14): one switch for the product: 40x24, off a 20% fill (--v2-switch-off-fill; review round 1: the sunken track left the knob at 1.08:1), on --v2-action carrying the white knob, a knob ring and no cast; role switch with aria-checked. The off edge is a recorded exception like the field edge (the knob and the label carry the state). RadioCard pending is the selection edge dashed.</G.Note>
        <G.Part name="Switch" status="changed" role="On or off, applied at once. A switch only enables or disables; it never deletes anything.">
          {missing('BYOK_COPY', 'kit/advanced.jsx') || <G.StateGrid states={[
            { label: 'Off', node: <K.Switch {...sw()} /> },
            { label: 'On', node: <K.Switch {...sw({ checked: true })} /> },
            { label: 'Hover, off', node: <K.Switch {...sw({ className: 'is-hover' })} /> },
            { label: 'Hover, on', node: <K.Switch {...sw({ checked: true, className: 'is-hover' })} /> },
            { label: 'Focus-visible', node: <K.Switch {...sw({ checked: true, className: 'is-focus' })} /> },
            { label: 'Disabled, off', note: 'the description says why', node: <K.Switch {...off} /> },
            { label: 'Disabled, on', note: 'the description says why', node: <K.Switch {...off} checked description="YouTube is signed out. Sign in to YouTube again to change this." /> },
            { label: 'Busy', note: 'waiting on consent or a check', node: <K.Switch {...sw({ busy: true })} /> },
          ]} />}
          <G.Stage ground="surface" width="shell"><SwitchRow /></G.Stage>
          <ul className="g-list">
            <li>Track 40 by 24, pill. Off: a 20% fill, no edge, an 18px white knob with a 1px ring. On: the action blue, the knob slides.</li>
            <li>Row: label 14/500 ink and description 13 ink-3 on the left, the switch on the right; the label is clickable. role=switch, a 32px target. The row's copy is the own-key panel's (section 49); the disabled rows' reasons are proposed.</li>
          </ul>
          <G.CompareRow
            v2={<G.Live get={function () { return (window.Toggle || window.Byok) && V2Toggles; }} label="Toggle and Byok.ByokSettings" />}
            system={<SwitchRow />}
            changed="Three switches (32x18 with a spring, 46x26 as a pressed button, and since 2026-10-14 the 40x24 per-app mode switch, the one real role=switch) become one role=switch. Off gets an edge that can be seen (V2's grey tracks are 1.48:1). And a switch never deletes: in V2, switching Bring Your Own Key off removes the saved key. Try it on the left." />
          <G.SpecDrawer rows={[
            { part: 'Track', token: '--v2-radius-pill', value: '40x24 (V2: 32x18, 46x26 and 40x24)', ref: ['actions-inputs.switch.shared', 'actions-inputs.switch.byok', 'actions-inputs.switch.mode'] },
            { part: 'Off', token: '--v2-switch-off-fill, --v2-switch-knob-shadow', value: '20% black fill, no edge, white knob with a 1px ring (V2: fill #d1d5db / #cbd5e1, a knob cast)', ref: ['actions-inputs.switch.shared-colours', 'actions-inputs.switch.byok-colours', 'actions-inputs.switch.mode-colours'] },
            { part: 'On', token: '--v2-action, --v2-surface', value: '#1268f0 fill, knob 18 white (V2 #1990FF)' },
            { part: 'Motion', token: '--v2-dur-2, --v2-ease-out', value: 'thumb slides 180ms, no overshoot (V2: a spring)', ref: 'actions-inputs.switch.shared-spring' },
            { part: 'Role', token: null, value: 'role=switch, aria-checked (V2 BYOK: aria-pressed button; V2 mode: already role=switch, named per app)', ref: ['actions-inputs.switch.shared-role', 'actions-inputs.switch.byok-pressed', 'actions-inputs.switch.mode-role'] },
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
            { label: 'Disabled with reason', note: 'aria-disabled, focusable; Proposed copy', node: <K.Checkbox label="Include diagnostic info" disabled disabledReason="There’s no run to attach yet." /> },
            { label: 'Disabled with reason, checked', node: <K.Checkbox label="A job is waiting for you" disabled disabledReason="BlueAI always tells you when a job waits for your OK." defaultChecked /> },
            { label: 'Invalid', note: 'Proposed copy', node: <K.Checkbox label="Include diagnostic info" error="Needed to look into a failed run." /> },
          ]} />
          <G.Stage ground="surface" width="shell">
            <fieldset className="v2-fieldset">
              <legend className="v2-legend">Tell me when</legend>
              <K.Checkbox label="A job is waiting for you" defaultChecked />
              <K.Checkbox label="Today’s run is done" defaultChecked />
              <K.Checkbox label="A day is verified" />
              <K.Checkbox label="Include diagnostic info" description="Adds this run’s log to your report." />
            </fieldset>
          </G.Stage>
          <G.Note>New, and why: notification preferences (section 60) and Report a problem (section 65) are lists of independent choices saved together. All copy in this part is proposed.</G.Note>
          <G.SpecDrawer rows={[
            { part: 'Box', token: '--v2-radius-xs, --v2-ink-4', value: '18, radius 4, 1px #6e737c (site: 19, radius 6; V2 review panel: 13)', ref: ['actions-inputs.onblue.check-box', 'actions-inputs.checkbox.dev-box'] },
            { part: 'Checked', token: '--v2-action, --v2-on-color', value: 'action fill, white tick drawn in CSS', ref: ['actions-inputs.onblue.check-on', 'actions-inputs.checkbox.dev-on'] },
            { part: 'Indeterminate', token: '--v2-action', value: 'action fill, white 10x2 bar' },
            { part: 'Hover', token: '--v2-ink-3, --v2-wash-hover, --v2-action-hover', value: 'edge to ink-3 + wash; checked deepens' },
            { part: 'Row', token: '--v2-hit-min, --v2-text-14, --v2-text-13', value: 'min 32, gap 12, label 14 ink, description 13 ink-3; whole row toggles' },
            { part: 'Invalid', token: '--v2-danger-edge, --v2-danger-ink', value: '#d0454a box edge + message under the label' },
            { part: 'Disabled', token: '--v2-opacity-disabled, --v2-ink-2', value: 'aria-disabled, stays focusable, row at 0.45; disabledReason under it (lock 16, caption in ink-2), tied with aria-describedby' },
            { part: 'Semantics', token: null, value: 'native input type=checkbox (V2 has only a dev-panel button role=checkbox)', ref: 'actions-inputs.checkbox.dev-role' },
          ]} />
        </G.Part>

        <G.Part name="RadioCard" status="changed" role="One of a few options the partner compares, each with a line of why. The base of AI mode and of the run-window setting.">
          {missing('AI_COPY', 'kit/advanced.jsx') || <G.StateGrid wide states={[
            { label: 'Rest', node: rc(CLOUD, null) },
            { label: 'Hover', node: rc(Object.assign({ className: 'is-hover' }, CLOUD), null) },
            { label: 'Selected', node: rc(CLOUD, 'cloud') },
            { label: 'Focus-visible', node: rc(Object.assign({ className: 'is-focus' }, CLOUD), 'cloud') },
            { label: 'Pending', note: 'picked, setup still to finish', node: rc(Object.assign({ pending: 'Setup needed' }, HYBRID), null) },
            { label: 'Disabled with reason', node: rc(Object.assign({ disabled: true, disabledReason: NO_HW }, HYBRID), null) },
            { label: 'With a badge', node: rc(AUTO, null) },
          ]} />}
          <G.Stage ground="surface" width="shell">
            {missing('RUN_WINDOW_OPTIONS', 'kit/worker-data.jsx') || <K.RadioCard label="When BlueAI runs" variant="list" options={RUN_WINDOW} defaultValue="window" />}
          </G.Stage>
          <G.Note>Hybrid's line says "AI credits" where V2 says "tokens" (a banned word), read from the AI mode panel (section 49); the run-window options are the Worker settings screen's (section 62), proposed copy built on V2's schedule question; the rest is V2 copy.</G.Note>
          <G.CompareRow
            v2={<G.Live get={function () { return window.AiMode && window.AiMode.useAiMode && V2AiMode; }} label="AiMode.AIModeCard" />}
            system={missing('AI_COPY', 'kit/advanced.jsx') || <K.RadioCard label="AI mode" options={[CLOUD, HYBRID]} defaultValue="cloud" />}
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
            { label: 'Disabled with reason', note: 'disabledReason, tied with aria-describedby', node: seg({ disabled: true, disabledReason: 'Connect YouTube to choose a mode.' }) },
            { label: 'Gated (consent open)', note: 'selection waits', node: seg({ options: mark('auto', 'is-pending') }) },
            { label: 'Small, text only', node: seg({ size: 'sm' }, MODES.map(function (m) { return { value: m.value, label: m.label }; })) },
          ]} />
          <G.Stage ground="surface"><GatedMode /></G.Stage>
          <G.Note>Try it: pick Automatic. The consent opens and the selection waits; Cancel leaves Always ask. With a gate, arrow keys only move focus and Space asks, so no dialog opens from a stray key.</G.Note>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker&v=1" label="V2: the composer chip opens the mode sheet, one switch per app" height={830} />}
            system={<div className="v2-hstack v2-hstack--between" style={{ maxWidth: 'var(--v2-shell-w)' }}><span className="v2-text-label">YouTube</span>{seg()}</div>}
            changed="V2 has no segmented control since 2026-10-14: each app became one switch (on = Automatic) in the mode sheet and in Settings > Worker, and the switch keeps the gate (on asks for consent, off applies at once). The system keeps the two named options, so a row says which mode is on without decoding a switch: one tab stop, arrows, Home and End; the selected segment is the select fill with a blue edge; beforeChange keeps the Automatic consent gate." />
          <G.SpecDrawer rows={[
            { part: 'Track', token: '--v2-surface-sunken, --v2-line, --v2-radius-md', value: 'sunken, 1px 10% edge, radius 10, padding 2', ref: 'actions-inputs.onblue.tabs-track' },
            { part: 'Segment', token: '--v2-hit-min, --v2-radius-sm, --v2-text-13', value: '32 (sm 28), radius 6, 13/500 ink-3, icon 16' },
            { part: 'Selected', token: '--v2-select, --v2-blue, --v2-stroke-selected', value: 'select fill, 1.5px blue edge (4.15:1 on the track), ink', ref: 'actions-inputs.onblue.tab-on' },
            { part: 'Hover', token: '--v2-wash-hover, --v2-ink', value: 'wash + ink' },
            { part: 'Keys', token: null, value: 'radiogroup, roving tabindex, arrows, Home, End' },
            { part: 'Gate', token: '--v2-select-line', value: 'beforeChange(value) resolves true to apply; dashed edge while waiting' },
            { part: 'Disabled', token: '--v2-opacity-disabled', value: 'aria-disabled, stays focusable; disabledReason printed once under the control (caption) and tied with aria-describedby' },
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
