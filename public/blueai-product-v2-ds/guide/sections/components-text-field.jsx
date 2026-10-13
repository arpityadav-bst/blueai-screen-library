/* Section 12: Text field and text area (actions-inputs slice). Kit: window.V2Kit.TextField,
   TextArea (kit/fields.jsx, kit/inputs.css). Spec: design-md/12-text-field.md. */
(function () {
  const G = window.V2Guide;
  const { useState, useEffect } = React;
  /* V2 copy, quoted (refs below). */
  const ENDPOINT = 'VLM endpoint';
  const ENDPOINT_EX = 'http://127.0.0.1:11434/api/chat';
  const MODEL = 'VLM model';
  const KEY_NOTE = 'Your key is stored encrypted on this device only.';
  const KEY_HINT = 'Find at https://console.anthropic.com/settings';
  const FEEDBACK_PH = 'Provide additional feedback';
  /* Proposed own-key copy is the panel's (kit/advanced.jsx, V2Kit.BYOK_COPY, section 49), so it exists once.
     With the export missing, the specimens that need it say so instead of drawing a second copy. */
  function byok() { return (window.V2Kit || {}).BYOK_COPY || null; }
  const LOST = <div className="g-missing">V2Kit.BYOK_COPY is not exported (kit/advanced.jsx), so this specimen is not drawn.</div>;
  /* A made-up key for specimens: not a real credential. */
  const FAKE_KEY = 'sk-ant-example-0000-0000';
  const LONG = 'The worker opened YouTube, then stopped on the sign-in page.\nIt said App Player was signed out.\nI signed in again.\nThe run did not restart.\nToday still shows one tick.\nI tried again at 9 pm.\nSame thing.\nNo error on screen.';

  /* V2 today: AI Mode, switched to Hybrid > Custom so its two hand-built fields show. */
  function V2Vlm() {
    const A = window.AiMode;
    const p = A.useAiMode();
    useEffect(function () { p.onPickHybrid(); }, []);
    useEffect(function () { if (p.outer === 'hybrid' && p.method === null) p.onPickCustom(); }, [p.outer]);
    return <A.AIModeCard {...p} />;
  }
  /* V2 today: Bring Your Own Key, switched on with no key saved. */
  function V2Byok() {
    const B = window.Byok;
    const [on, setOn] = useState(true);
    const [info, setInfo] = useState(null);
    return <B.ByokSettings on={on} setOn={setOn} keyAdded={!!info} keyInfo={info} onSave={setInfo} onRemove={function () { setInfo(null); }} />;
  }
  /* V2 today: thumbs down, so the reasons show; picking Other opens the text area. It starts
     closed because V2's text area takes focus when it opens, which would scroll the guide. */
  function V2Feedback() {
    const F = window.ChatFeedback;
    const [vote, setVote] = useState('down');
    const [reason, setReason] = useState(null);
    return <F.FeedbackThumbs tone="success" placement="below" vote={vote} onVote={setVote} reason={reason} onReason={setReason} />;
  }

  function TextFieldSection() {
    const K = window.V2Kit;
    const ep = function (extra) { return Object.assign({ label: ENDPOINT, placeholder: ENDPOINT_EX, width: '100%' }, extra); };
    return (
      <G.Section id="text-field">
        <G.Part name="TextField" status="changed" role="One question: a label above, one box, and a message line that says what is wrong, what is happening, or what to type.">
          <ul className="g-list">
            <li>Label 13/500 ink, 6 above the box. Optional or Required as a quiet 12px flag beside it.</li>
            <li>Box 40 tall (32 small), radius 6, 1px line-strong, padding 0 12; value 14/1.35 ink. Leading and trailing slots hold a 16px icon, a spinner or a 28px icon button.</li>
            <li>Placeholder is an example of the answer, never the label (the site's rule).</li>
            <li>Message line 12/1.35, 6 below; it exists only when it may hold something, so pass error=&#123;null&#125; on a field that validates later.</li>
          </ul>
          <G.StateGrid wide states={[
            { label: 'Rest', node: <K.TextField {...ep()} /> },
            { label: 'Hover', note: 'edge firms to 20%', node: <K.TextField {...ep({ className: 'is-hover' })} /> },
            { label: 'Focus', note: 'blue edge + 3px ring', node: <K.TextField {...ep({ className: 'is-focus' })} /> },
            { label: 'Filled', node: <K.TextField {...ep({ defaultValue: ENDPOINT_EX })} /> },
            { label: 'Disabled', note: 'Proposed copy', node: <K.TextField {...ep({ disabled: true, helper: 'Pick Custom to set your own endpoint.' })} /> },
            { label: 'Read-only', note: 'selectable, sunken', node: <K.TextField {...ep({ readOnly: true, defaultValue: ENDPOINT_EX })} /> },
            { label: 'Invalid + message', note: 'Proposed copy', node: <K.TextField {...ep({ defaultValue: '127.0.0.1', error: 'Enter the full address, starting with http://' })} /> },
            { label: 'Invalid + focus', node: <K.TextField {...ep({ defaultValue: '127.0.0.1', error: 'Enter the full address, starting with http://', className: 'is-focus' })} /> },
            { label: 'Validating', note: 'Proposed copy', node: <K.TextField {...ep({ defaultValue: ENDPOINT_EX, status: 'validating', helper: 'Checking the endpoint…' })} /> },
            { label: 'Validated', note: 'Proposed copy', node: <K.TextField {...ep({ defaultValue: ENDPOINT_EX, status: 'validated', helper: 'Connected.' })} /> },
            { label: 'Required', node: <K.TextField label={MODEL} placeholder="qwen3-vl:4b-instruct" required error={null} width="100%" /> },
            { label: 'Optional, small, leading icon', node: <K.TextField label={MODEL} placeholder="qwen3-vl:4b-instruct" optional size="sm" leading="link" width="100%" /> },
            { label: 'No visible label', note: 'placeholder steps up to ink-4', node: <K.TextField label={ENDPOINT} hideLabel placeholder={ENDPOINT_EX} width="100%" /> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.AiMode && window.AiMode.useAiMode && V2Vlm; }} label="AiMode.AIModeCard (Hybrid, Custom)" />}
            system={<div className="v2-stack"><K.TextField {...ep()} /><K.TextField label={MODEL} placeholder="qwen3-vl:4b-instruct" /><K.Button variant="primary" disabled disabledReason="Add the endpoint and the model first.">Apply</K.Button></div>}
            changed="Five hand-rolled fields with three focus treatments (a shared ring on .ba-field, a JS border swap, nothing) and zero error states become one field. The site's error line and ring give the invalid state V2 never had; validating and validated give Check and save (V2: Validate & Save) something true to show." />
          <G.SpecDrawer rows={[
            { part: 'Box', token: '--v2-field-h, --v2-radius-sm', value: '40 (sm 32), radius 6, padding 0 12 (V2: radius 8 and 10, 9 to 11 padding)', ref: ['actions-inputs.field.schedule', 'actions-inputs.field.vlm', 'actions-inputs.field.key'] },
            { part: 'Edge', token: '--v2-line-strong', value: '1px 15% black (V2 #d1d5db, #e3e7ee)', ref: ['actions-inputs.field.schedule', 'actions-inputs.field.vlm'] },
            { part: 'Hover', token: '--v2-line-hover', value: '1px 20% black (V2: none)' },
            { part: 'Focus', token: '--v2-blue, --v2-focus-ring', value: 'blue edge + 3px ring at 16% (V2: 12% ring on .ba-field only, a JS border swap elsewhere)', ref: ['actions-inputs.field.focus', 'actions-inputs.field.vlm-focus', 'actions-inputs.onblue.field-focus'] },
            { part: 'Label', token: '--v2-text-13, --v2-weight-medium, --v2-ink', value: '13/500 ink (V2: 13/500, 12.5/600, 12.5/700 in three greys)', ref: ['actions-inputs.field.label', 'actions-inputs.field.vlm-label', 'actions-inputs.field.key-label'] },
            { part: 'Value', token: '--v2-text-14, --v2-ink', value: '14/1.35 (V2: 13 to 14)' },
            { part: 'Placeholder', token: '--v2-ink-placeholder, --v2-ink-4', value: '#9ca2ad under a label, #6e737c when it is the only name', ref: ['actions-inputs.onblue.placeholder', 'actions-inputs.onblue.ph-ink', 'actions-inputs.field.vlm-placeholder'] },
            { part: 'Required', token: '--v2-ink-4', value: '"Required" flag + native required (V2: red asterisk #ef4444, 3.76:1)', ref: 'actions-inputs.field.required' },
            { part: 'Invalid', token: '--v2-danger-line, --v2-danger-ring, --v2-danger-ink', value: '#d0454a edge, 16% red ring on focus, message with alert icon (V2: none)', ref: ['actions-inputs.onblue.field-err', 'actions-inputs.onblue.err-line', 'actions-inputs.onblue.err-ring'] },
            { part: 'Validating / validated', token: '--v2-success', value: 'spinner 16, then check 16, in the trailing slot; message says it (V2: never validates)', ref: 'actions-inputs.field.fake-key' },
            { part: 'Read-only / disabled', token: '--v2-surface-sunken, --v2-line', value: 'sunken fill, 10% edge; disabled also 0.45' },
            { part: 'Message line', token: '--v2-text-12, --v2-ink-3', value: '12/1.35, 6 below, aria-describedby, polite live region' },
            { part: 'Copy', token: null, value: 'labels, placeholders and Apply are V2 copy; messages are proposed', ref: ['actions-inputs.field.vlm-label', 'actions-inputs.field.vlm-placeholder', 'actions-inputs.field.vlm-model-label', 'actions-inputs.field.vlm-model-placeholder', 'actions-inputs.button.apply'] },
          ]} />
          <G.DoDont
            do={['Keep a visible label on every field.', 'Say what is wrong and how to fix it, under the box.', 'Validate before saying saved.']}
            dont={['Use the placeholder as the label or the hint.', 'Remove the focus outline without the ring.', 'Pretend to validate (V2’s Validate & Save makes up a key today).']} />
        </G.Part>

        <G.Part name="Secret field" status="changed" role="An API key: hidden by default, mono, with a reveal button, checked before it is saved.">
          <G.StateGrid wide states={[
            { label: 'Hidden', node: <K.TextField label="API key" width="100%" secret defaultValue={FAKE_KEY} helper={KEY_NOTE} /> },
            { label: 'Revealed', note: 'reveal pressed', node: <K.TextField label="API key" width="100%" secret defaultRevealed defaultValue={FAKE_KEY} helper={KEY_NOTE} /> },
            { label: 'Validating', note: 'Proposed copy', node: byok() ? <K.TextField label="API key" width="100%" secret defaultValue={FAKE_KEY} status="validating" helper={byok().checking('Anthropic')} /> : LOST },
            { label: 'Invalid key', note: 'Proposed copy', node: byok() ? <K.TextField label="API key" width="100%" secret defaultValue={FAKE_KEY} error={byok().invalid} /> : LOST },
            { label: 'Validated', note: 'Proposed copy', node: <K.TextField label="API key" width="100%" secret defaultValue={FAKE_KEY} status="validated" helper="Key works." /> },
            { label: 'Empty, hint as helper', note: 'V2 copy, moved out of the placeholder', node: <K.TextField label="API key" width="100%" secret helper={KEY_HINT + '. ' + KEY_NOTE} /> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.Byok && window.Byok.ByokSettings && V2Byok; }} label="Byok.ByokSettings" />}
            system={byok() ? <div className="v2-stack"><K.TextField label="API key" width="100%" secret helper={KEY_HINT + '. ' + KEY_NOTE} /><div className="v2-hstack v2-hstack--end v2-gap-2"><K.Button>Cancel</K.Button><K.Button variant="primary">{byok().save}</K.Button></div></div> : LOST}
            changed="The key showed in clear text right under 'stored encrypted on this device only', and the where-to-find hint vanished as you typed because it was the placeholder. Now it is hidden with a reveal button, the hint is a helper that stays, and V2's Validate & Save (which makes up a key when the field is empty) becomes Check and save, which really checks the key. Try V2: pick a provider and type a key." />
          <G.SpecDrawer rows={[
            { part: 'Type', token: null, value: 'password, reveal button (eye, 28, aria-pressed, "Show API key") (V2: type text)', ref: 'actions-inputs.field.key-clear' },
            { part: 'Face', token: '--v2-font-mono, --v2-text-13', value: 'mono 13, spellcheck and autocomplete off', ref: 'actions-inputs.field.key-mono' },
            { part: 'Hint', token: '--v2-ink-3', value: 'helper, not placeholder', ref: 'actions-inputs.field.key-hint' },
            { part: 'Storage note', token: '--v2-text-12, --v2-ink-3', value: '#5f636b 6.0:1 (V2 #9ca3af, 2.54:1)', ref: ['actions-inputs.field.key-note', 'actions-inputs.field.key-note-colour'] },
            { part: 'Validation', token: null, value: 'validating, invalid, validated before saving (V2 invents a key when empty)', ref: 'actions-inputs.field.fake-key' },
          ]} />
        </G.Part>

        <G.Part name="TextArea" status="changed" role="Longer answers (feedback, Report a problem): grows with what you type up to its cap, then scrolls, never clips.">
          <G.StateGrid wide states={[
            { label: 'Rest, 3 rows', node: <K.TextArea label="What happened?" width="100%" placeholder="The run stopped on the sign-in page." /> },
            { label: 'Focus', node: <K.TextArea label="What happened?" width="100%" className="is-focus" /> },
            { label: 'Auto-grow', note: 'grows a line at a time', node: <K.TextArea label="What happened?" width="100%" defaultValue={LONG.split('\n').slice(0, 4).join('\n')} /> },
            { label: 'Max rows, then scroll', note: 'maxRows 4', node: <K.TextArea label="What happened?" width="100%" maxRows={4} defaultValue={LONG} /> },
            { label: 'Counter near the limit', note: 'from 90%', node: <K.TextArea label="What happened?" width="100%" maxLength={140} showCount defaultValue={LONG.slice(0, 130)} /> },
            { label: 'Counter over the limit', note: 'field turns invalid', node: <K.TextArea label="What happened?" width="100%" maxLength={140} showCount defaultValue={LONG.slice(0, 160)} /> },
          ]} />
          <G.Note>Specimen copy here is proposed: it belongs to the Report a problem sheet (section 65).</G.Note>
          <G.CompareRow
            v2={<G.Live get={function () { return window.ChatFeedback && window.ChatFeedback.FeedbackThumbs && V2Feedback; }} label="ChatFeedback.FeedbackThumbs" />}
            system={<K.TextArea label="Feedback" hideLabel placeholder={FEEDBACK_PH} rows={2} maxRows={4} />}
            changed="Pick Other on the left to open V2's text area. The system uses the same field box, 14px instead of 12, with a focus ring (V2 removes the outline). It grows to its cap and then scrolls; the V2 composer instead grows to 120px and clips what is past it." />
          <G.SpecDrawer rows={[
            { part: 'Box', token: '--v2-radius-sm, --v2-line-strong', value: 'the field box, min 84 (3 rows) (V2 feedback: 31 tall, radius 10, outline none)', ref: ['actions-inputs.textarea.feedback', 'actions-inputs.textarea.schedule'] },
            { part: 'Text', token: '--v2-text-14, --v2-leading-body', value: '14/1.5, padding 8 12 (V2: 12/17px)', ref: 'actions-inputs.textarea.feedback' },
            { part: 'Growth', token: null, value: 'auto-grow to maxRows (6), then scroll; no drag handle (V2: 48px cap; composer 120px then clips)', ref: ['actions-inputs.textarea.cap', 'actions-inputs.textarea.composer', 'actions-inputs.textarea.schedule'] },
            { part: 'Counter', token: '--v2-ink-4, --v2-attention-ink, --v2-danger-ink', value: '12 tabular, right of the message; attention from 90%, danger and invalid past the limit' },
            { part: 'Placeholder', token: '--v2-ink-4', value: FEEDBACK_PH + ' (bare field: the only name)', ref: 'actions-inputs.textarea.placeholder' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('text-field', TextFieldSection);
})();
