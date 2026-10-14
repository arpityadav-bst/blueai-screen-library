/* Section 13: Select (actions-inputs slice). Kit: window.V2Kit.Select (kit/fields.jsx,
   kit/inputs.css). Spec: design-md/13-select.md. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  /* V2 copy, quoted (refs below). */
  const ADD = 'Add a provider';
  const PROVIDERS = ['Anthropic', 'Azure OpenAI', 'Gemini (AI Studio)', 'Google Vertex AI', 'OpenAI']
    .map(function (p) { return { value: p, label: p }; });
  const MODELS = ['claude-haiku-4-5', 'claude-sonnet-5', 'claude-opus-4-8'].map(function (m) { return { value: m, label: m }; });

  /* V2 today: two of the Settings screen's selects, as they sit two cards apart. */
  function V2Selects() {
    const B = window.Byok;
    const [on, setOn] = useState(true);
    const AISettingsCard = window.AISettingsCard;
    return (
      <div className="v2-stack">
        {B && B.ByokSettings ? <B.ByokSettings on={on} setOn={setOn} keyAdded={false} keyInfo={null} onSave={function () {}} onRemove={function () {}} /> : null}
        {AISettingsCard ? <AISettingsCard /> : null}
      </div>
    );
  }

  function SelectSection() {
    const K = window.V2Kit;
    const prov = function (extra) { return Object.assign({ label: 'Provider', placeholder: ADD, options: PROVIDERS, width: '100%' }, extra); };
    return (
      <G.Section id="select">
        <G.Note>V3 restyle (2026-10-14): the placeholder takes --v2-ink-placeholder like a field's (it sits under a visible label); the chevron stays 16 in ink-3.</G.Note>
        <G.Part name="Select" status="changed" role="Pick one from a short plain list. The native control in the field box, so keyboard, screen readers and the open list come from the system.">
          <ul className="g-list">
            <li>The field box (40, sm 32, radius 6, 1px line-strong) with the label above and the message line below, exactly as TextField.</li>
            <li>chevron-down 16 in ink-3, 12 from the right edge; the whole box opens the list.</li>
            <li>Placeholder ("Add a provider"): a disabled first option in the placeholder ink, under the visible label. The open list is drawn by the operating system.</li>
          </ul>
          <G.StateGrid wide states={[
            { label: 'Placeholder', node: <K.Select {...prov()} /> },
            { label: 'Hover', node: <K.Select {...prov({ className: 'is-hover' })} /> },
            { label: 'Focus', node: <K.Select {...prov({ className: 'is-focus' })} /> },
            { label: 'Filled', node: <K.Select {...prov({ defaultValue: 'Anthropic' })} /> },
            { label: 'Open (native)', note: 'Click it: the list is the operating system\'s', node: <K.Select {...prov()} /> },
            { label: 'Disabled', note: 'Proposed copy', node: <K.Select {...prov({ disabled: true, helper: 'Turn on Use my own key first.' })} /> },
            { label: 'Invalid', note: 'Proposed copy', node: <K.Select {...prov({ error: 'Pick a provider to add your key.' })} /> },
            { label: 'Small, filled', node: <K.Select label="AI model" size="sm" options={MODELS} defaultValue="claude-haiku-4-5" width="100%" /> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return (window.Byok || window.AISettingsCard) && V2Selects; }} label="Byok.ByokSettings and AISettingsCard" />}
            system={<div className="v2-stack"><K.Select {...prov()} /><K.Select label="AI model" options={MODELS} defaultValue="claude-haiku-4-5" /></div>}
            changed="Three looks on one screen (radius 10 with a custom chevron, radius 8 with the OS arrow) and a BYOK select that removes its focus outline with nothing in its place become one select in the field box, with the field's focus ring. The provider select gains a label; its placeholder moves from 2.54:1 to ink-3." />
          <G.SpecDrawer rows={[
            { part: 'Box', token: '--v2-field-h, --v2-radius-sm, --v2-line-strong', value: '40 (sm 32), radius 6, 1px 15% black (V2: radius 10 and 8)', ref: ['actions-inputs.select.byok', 'actions-inputs.select.model'] },
            { part: 'Chevron', token: '--v2-icon-sm, --v2-ink-3', value: 'chevron-down 16, right 12 (V2: #64748b stroke 2.2 on one, the OS arrow on two)', ref: ['actions-inputs.select.chevron', 'actions-inputs.select.model', 'actions-inputs.select.schedule'] },
            { part: 'Focus', token: '--v2-blue, --v2-focus-ring', value: 'blue edge + 3px 16% ring (V2 BYOK: outline none, nothing in its place)', ref: ['actions-inputs.select.byok-outline', 'actions-inputs.field.focus'] },
            { part: 'Placeholder', token: '--v2-ink-placeholder', value: 'disabled first option, #9ca2ad under a visible label (V2 #9ca3af)', ref: ['actions-inputs.select.placeholder', 'actions-inputs.select.placeholder-colour'] },
            { part: 'Value and options', token: '--v2-text-14, --v2-ink', value: '14 ink; options always ink' },
            { part: 'Invalid, disabled', token: '--v2-danger-edge, --v2-opacity-disabled', value: 'as TextField: #d0454a edge; disabled 0.45' },
            { part: 'Copy', token: null, value: 'provider and model names are V2 data', ref: ['actions-inputs.select.provider-anthropic', 'actions-inputs.select.provider-azure', 'actions-inputs.select.provider-gemini', 'actions-inputs.select.provider-vertex', 'actions-inputs.select.provider-openai', 'actions-inputs.select.models'] },
          ]} />
          <G.DoDont
            do={['Use the native select for a short plain list.', 'Give it a visible label, even when a placeholder says what to do.']}
            dont={['Build a custom list for plain text options.', 'Use a select for two or three options the partner should compare: use RadioCard or Segmented.']} />
          <G.Note>Options that need an icon or a second line (which app, which account) belong in a Menu (section 27), not here.</G.Note>
        </G.Part>
      </G.Section>
    );
  }

  G.register('select', SelectSection);
})();
