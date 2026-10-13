/* Section 45: the job preview (New, proposal R07). Owner: worker slice. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};

  // V2's daily job ask as the live AskBubble draws it, built from V2's own step (worker_flow.jsx:117-121).
  const V2_STEP = {
    id: 'job', title: 'Paid job available', lead: 'Watch the video and provide feedback.', question: 'Want me to take this one?',
    options: [{ id: 'always', label: 'Yes, switch to Automatic', consent: true }, { id: 'once', label: 'Just this job' }, { id: 'deny', label: 'Not now' }],
  };

  function TakeDemo() {
    const K = window.V2Kit || {};
    const [taking, setTaking] = useState(false);
    return <K.JobPreviewCard taking={taking} onTake={function () { setTaking(true); setTimeout(function () { setTaking(false); }, 1600); }} onSkip={noop} onStopAsking={noop} />;
  }

  function JobAskSection() {
    const K = window.V2Kit || {};
    if (!K.JobPreviewCard) return <G.Section id="job-ask"><div className="g-missing">kit/job.jsx is not loaded.</div></G.Section>;
    return (
      <G.Section id="job-ask">
        <G.Part name="JobPreviewCard" status="new" role="Before a paid job runs under the partner's name: which video, which channel, what will be done, the exact comment, and what skipping costs.">
          <G.Warn>
            Why the product needs it: the riskiest moment in the product is agreeing to a public comment under your
            name, and today the ask shows only '{V2_STEP.lead}' ({G.refText('worker.flow.job-title')}). The comment is
            posted but never shown ({G.refText('worker.flow.comment')}). The first chip, 'Yes, switch to Automatic', bundles
            yes with a standing consent ({G.refText('worker.flow.ask-options')}), and the cost of 'Not now' (the day) is told
            only afterwards ({G.refText('worker.flow.skip-after')}). This card is a proposal (R07); the PM's job-ask copy
            stays in V2's AskCard (section 37) until he decides.
          </G.Warn>
          <p><strong>Anatomy.</strong> Card radius 16, max 300 (the thread width). Head 13/500 with the app mark, 'Paid job
            available' and when: attention tint while it waits for the partner, panel grey after. Thumbnail 16:9 radius 10
            with the duration. Video title 14/600, channel 13 ink-3. What I'll do: a plain list with 16 icons (not chips:
            these are facts, not buttons). The exact comment in a quote block 13 ink. The deadline and its cost. Then
            'Take this job' (primary), 'Skip today (today won’t count)' (secondary) and 'Stop asking for YouTube jobs'
            (quiet, opens the consent for Automatic). All three are 36 tall and full width.</p>
          <G.StateGrid wide states={[
            { label: 'Ask (Always ask, partner here)', node: <K.JobPreviewCard onTake={noop} onSkip={noop} onStopAsking={noop} /> },
            { label: 'Waiting since 11:04 am, expires 9 pm', note: 'the partner was away; the Windows notification brings them here', node: <K.JobPreviewCard waitingSince="11:04 am" expiresAt="9 pm" onTake={noop} onSkip={noop} onStopAsking={noop} /> },
            { label: 'Taking', note: 'Take this job is busy; the other two wait', node: <TakeDemo /> },
            { label: 'Expired', note: 'no answer by 9 pm: the day did not count', node: <K.JobPreviewCard expired expiresAt="9 pm" /> },
            { label: 'Receipt (Automatic, after the fact)', note: 'the same facts, past tense, with the way back', node: <K.JobPreviewCard mode="receipt" doneAt="11:12 am" onChangeMode={noop} /> },
          ]} />
          <G.CompareRow
            v2Label="V2 today: the ask it would replace"
            v2={<G.Live get={function () { return window.WorkerCards && window.WorkerCards.AskBubble; }} props={{ step: V2_STEP, answer: null, onAnswer: noop }} label="WorkerCards.AskBubble" />}
            system={<K.JobPreviewCard onTake={noop} onSkip={noop} onStopAsking={noop} />}
            changed="Not a restyle: a proposal. The partner sees the job before agreeing to it, the cost of skipping sits on the skip button, and saying yes once no longer switches on Automatic: 'Stop asking' is its own quiet action and goes through the consent." />
          <G.FrameState url="index.html?day=next&end=job" label="V2: the next day's run asks about the job (Always ask)" height={830} />
          <G.SpecDrawer rows={[
            { part: 'Card', token: '--v2-bubble-max, --v2-radius-lg, --v2-line', value: 'max 300, 16, 1px line (attention line while waiting)' },
            { part: 'Head', token: '--v2-attention-tint, --v2-attention-ink', value: 'Paid job available', ref: 'worker.flow.job-label' },
            { part: 'What V2 shows today', token: 'none', value: 'Watch the video and provide feedback.', ref: ['worker.flow.job-title', 'worker.flow.ask-lead'] },
            { part: 'Thumbnail', token: '--v2-surface-sunken, --v2-radius-md', value: '16:9, duration 11/500 on ink' },
            { part: 'Title / channel', token: '--v2-text-14 600 ink / --v2-text-13 ink-3', value: 'from the job record' },
            { part: 'Comment', token: '--v2-surface-sunken, 2px --v2-line-strong edge', value: 'exact text, 13/1.5 ink', ref: 'worker.flow.comment' },
            { part: 'Deadline', token: '--v2-text-13, clock --v2-attention-ink', value: 'Answer by 9 pm or today won’t count.' },
            { part: 'Take', token: 'Button primary md, full', value: 'Take this job', ref: 'worker.flow.ask-question' },
            { part: 'Skip', token: 'Button secondary md, full', value: 'Skip today (today won’t count)', ref: 'worker.flow.skip-after' },
            { part: 'Automatic', token: 'Button quiet md, full', value: 'Stop asking for YouTube jobs (opens consent)', ref: 'worker.flow.ask-options' },
            { part: 'Receipt', token: 'StatusTick pending + quiet Button', value: 'Pending verification / Ask me first next time' },
          ]} />
          <G.DoDont
            do={['Show the exact comment before the partner agrees.', 'Put the cost on the skip button itself.', 'Keep the standing consent (Automatic) a separate, quieter action.']}
            dont={['Bundle yes with switching to Automatic.', 'Tell the cost of skipping after the tap.', 'Draw the actions as chips: they are facts, not choices.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('job-ask', JobAskSection);
})();
