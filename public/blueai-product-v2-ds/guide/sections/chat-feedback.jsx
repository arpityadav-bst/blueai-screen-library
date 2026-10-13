/* Section 39: Feedback (chat slice). FeedbackThumbs, below placement only. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};

  /* Both sides playable: each keeps its own vote and reason. */
  function V2Thumbs() {
    const [vote, setVote] = useState(null);
    const [reason, setReason] = useState(null);
    return <G.Live get={function () { return window.ChatFeedback && window.ChatFeedback.FeedbackThumbs; }} label="ChatFeedback.FeedbackThumbs"
      props={{ tone: 'success', placement: 'below', vote: vote, onVote: setVote, reason: reason, onReason: setReason }} />;
  }
  function SystemThumbs() {
    const K = window.V2Kit;
    const [vote, setVote] = useState(null);
    const [reason, setReason] = useState(null);
    return <K.FeedbackThumbs vote={vote} onVote={setVote} reason={reason} onReason={setReason} onSubmitOther={noop} />;
  }

  function FeedbackSection() {
    const K = window.V2Kit;
    const fb = function (p) { return <div style={{ width: '100%' }}><K.FeedbackThumbs onVote={noop} onReason={noop} {...p} /></div>; };
    return (
      <G.Section id="feedback">
        <G.Part name="FeedbackThumbs" status="changed" role="Thumbs under a finished outcome; a thumbs down asks what went wrong with the shared chips.">
          <G.StateGrid wide states={[
            { label: 'Idle', node: fb({ vote: null }) },
            { label: 'Up (Thanks for 2200ms)', node: fb({ vote: 'up', thanks: true }) },
            { label: 'Down (reasons)', node: fb({ vote: 'down', reason: null }) },
            { label: 'Reason picked', note: 'Picking a reason other than Other closes the chips and says thanks: the pressed thumb and the thanks line.', node: fb({ vote: 'down', reason: 'Wrong result', thanks: true }) },
            { label: 'Other: text and submit', node: fb({ vote: 'down', reason: 'Other' }) },
            { label: 'Under a run card', node: <K.RunCard state="done-pending" feedback={<K.FeedbackThumbs vote={null} onVote={noop} />} /> },
          ]} />
          <G.CompareRow
            v2={<V2Thumbs />}
            system={<SystemThumbs />}
            changed="The unused inside and stamp placements are dropped. The buttons become the shared IconButton (no shadow, no fade on the unvoted thumb, selection shown as pressed with aria-pressed). Reasons use the shared Chip instead of a third chip look (#334155 selected). The 2.56:1 grey label becomes ink-3. Copy is V2's, quoted exactly." />
          <G.SpecDrawer rows={[
            { part: 'Buttons', token: 'IconButton 32 outlined (section 11), --v2-surface, --v2-line-strong', value: '32px, glyph 20 ink-3 (thumb-up / thumb-down), 1px line-strong edge on white; selected = pressed wash, ink', ref: ['chat.feedback.button', 'chat.feedback.button-shadow', 'chat.feedback.icon'] },
            { part: 'Unvoted thumb', token: null, value: 'stays at full contrast (V2 fades it to 0.55)', ref: 'chat.feedback.fade' },
            { part: 'Labels', token: null, value: '"Good result" / "Bad result"', ref: 'chat.feedback.aria' },
            { part: 'Thanks', token: '--v2-text-12, --v2-weight-medium, --v2-ink-3', value: '"Thanks for the feedback" for 2200ms, role=status', ref: ['chat.feedback.thanks', 'chat.feedback.thanks-ms', 'chat.feedback.label-colour'] },
            { part: 'Prompt', token: '--v2-text-12, --v2-ink-3', value: '"What went wrong?"', ref: 'chat.feedback.prompt' },
            { part: 'Reasons', token: 'Chip (section 15)', value: 'five reasons, selected = select fill', ref: ['chat.feedback.reasons', 'chat.feedback.reason-selected'] },
            { part: 'Other', token: 'TextArea sm (section 12), IconButton 32', value: 'placeholder "Provide additional feedback", send "Submit feedback"', ref: ['chat.feedback.other-placeholder', 'chat.feedback.submit'] },
            { part: 'Placement', token: '--v2-space-2', value: 'below the outcome only', ref: ['chat.feedback.placement', 'chat.feedback.placements'] },
            { part: 'When', token: null, value: 'success outcomes only (PM config)', ref: 'chat.feedback.success-only' },
          ]} />
          <G.Warn>Decision for the PM: V2 offers feedback on successful outcomes only. A failed job is where a partner most wants to report a problem; offering it there is a PM call, not a style change.</G.Warn>
          <G.DoDont
            do={['Keep both thumbs readable after a vote.', 'Close the reasons once one is picked, and say thanks.']}
            dont={['Fade the other thumb.', 'Invent a new chip look for reasons.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('feedback', FeedbackSection);
})();
