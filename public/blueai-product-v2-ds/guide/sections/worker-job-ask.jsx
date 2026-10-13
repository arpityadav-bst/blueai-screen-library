/* Section 45: the job preview (New, proposal R07). Owner: worker slice. */
(function () {
  const G = window.V2Guide;
  const { useState, useEffect } = React;
  const noop = function () {};

  // V2's daily job ask as the live AskBubble draws it, built from V2's own step (worker_flow.jsx:117-121).
  const V2_STEP = {
    id: 'job', title: 'Paid job available', lead: 'Watch the video and provide feedback.', question: 'Want me to take this one?',
    options: [{ id: 'always', label: 'Yes, switch to Automatic', consent: true }, { id: 'once', label: 'Just this job' }, { id: 'deny', label: 'Not now' }],
  };

  /* V2's first chip asks for Automatic through V2's own consent (AgentPermissions.AutoConfirm), which
     only section 46 mounts, so it is mounted here beside the bubble and the tap does what it does in V2.
     Leaving the section puts YouTube's mode back, which also drops a consent left open. */
  function V2Ask() {
    const AP = window.AgentPermissions;
    const [answer, setAnswer] = useState(null);
    useEffect(function () {
      if (!AP) return undefined;
      const before = AP.getMode('youtube');
      return function () { AP.setMode('youtube', before); };
    }, []);
    return (
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 'var(--v2-shell-w)', minHeight: 560, padding: 'var(--v2-space-3)', background: 'var(--v2-canvas)' }}>
        <G.Live get={function () { return window.WorkerCards && window.WorkerCards.AskBubble; }} props={{ step: V2_STEP, answer: answer, onAnswer: setAnswer }} label="WorkerCards.AskBubble" />
        {answer ? <button type="button" className="g-btn" onClick={function () { setAnswer(null); }}>Ask again</button> : null}
        <G.Live get={function () { return AP && AP.AutoConfirm; }} label="AgentPermissions.AutoConfirm" />
      </div>
    );
  }

  function TakeDemo() {
    const K = window.V2Kit || {};
    const [taking, setTaking] = useState(false);
    return <K.JobPreviewCard taking={taking} onTake={function () { setTaking(true); setTimeout(function () { setTaking(false); }, 1600); }} onSkip={noop} onStopAsking={noop} />;
  }

  // Text the system does not control, at its longest: YouTube caps a title at 100 characters, and a
  // channel name and the job's comment come from outside too. Nothing on this card is clamped: the
  // partner agrees to exactly what it says.
  function longJob(K) {
    const j = K.WORKER_JOB || {};
    return Object.assign({}, j, {
      video: Object.assign({}, j.video, {
        title: 'Galaxy S26 Ultra vs iPhone 17 Pro Max: the full night camera test, 40 shots in five cities, ranked',
        channel: 'TechLine Reviews, Comparisons and Long-Term Tests',
      }),
      comment: 'The low-light shots at 4:10 surprised me. Did not expect the S26 to hold up that well against the iPhone, especially in the street scene at 6:45 where the neon signs usually blow out. Would love a zoom test next.',
    });
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
            'Take this job' (primary), 'Skip: today won’t count' (secondary) and 'Switch YouTube to Automatic'
            (quiet, zap, opens the consent for Automatic). All three are 36 tall and full width.</p>
          <G.StateGrid wide states={[
            { label: 'Ask (Always ask, partner here)', node: <K.JobPreviewCard onTake={noop} onSkip={noop} onStopAsking={noop} /> },
            { label: 'Waiting since 11:04 am, expires 9 pm', note: 'the partner was away; the Windows notification brings them here', node: <K.JobPreviewCard waitingSince="11:04 am" expiresAt="9 pm" onTake={noop} onSkip={noop} onStopAsking={noop} /> },
            { label: 'Taking', note: 'Take this job is busy; the other two wait', node: <TakeDemo /> },
            { label: 'Expired', note: 'no answer by 9 pm: the day did not count', node: <K.JobPreviewCard expired expiresAt="9 pm" /> },
            { label: 'Long content', note: 'a 100-character title, a long channel and comment: everything wraps, nothing is clamped', node: <K.JobPreviewCard job={longJob(K)} onTake={noop} onSkip={noop} onStopAsking={noop} /> },
            { label: 'Receipt (Automatic, after the fact)', note: 'the same facts, past tense, with the way back', node: <K.JobPreviewCard mode="receipt" doneAt="11:12 am" onChangeMode={noop} /> },
            { label: 'Receipt, verified (Always ask)', note: 'two ticks; no way back to offer, the partner approved it', node: <K.JobPreviewCard mode="receipt" verify="verified" ranOn="ask" doneAt="11:12 am" /> },
            { label: 'Receipt, not counted', note: 'rejected: the cross, no way back on Always ask', node: <K.JobPreviewCard mode="receipt" verify="rejected" ranOn="ask" doneAt="11:12 am" /> },
            { label: 'Receipt in Run detail', note: 'verify null: the Verification card says the day once; Automatic offers the way back', node: <K.JobPreviewCard mode="receipt" verify={null} ranOn="auto" doneAt="11:12 am" onChangeMode={noop} /> },
          ]} />
          <G.CompareRow
            v2Label="V2 today: the ask it would replace"
            v2={<V2Ask />}
            system={<K.JobPreviewCard onTake={noop} onSkip={noop} onStopAsking={noop} />}
            changed="Not a restyle: a proposal. The partner sees the job before agreeing to it, the cost of skipping sits on the skip button, and saying yes once no longer switches on Automatic: 'Switch YouTube to Automatic' is its own quiet action and goes through the consent." />
          <G.FrameState url="index.html?day=next&end=job" label="V2: the next day's run asks about the job (Always ask)" height={830} />
          <G.SpecDrawer rows={[
            { part: 'Card', token: '--v2-bubble-max, --v2-radius-lg, --v2-line', value: 'max 300, 16, 1px line (attention line while waiting)' },
            { part: 'Head', token: '--v2-attention-tint, --v2-attention-ink', value: 'Paid job available', ref: 'worker.flow.job-label' },
            { part: 'What V2 shows today', token: 'none', value: 'Watch the video and provide feedback.', ref: ['worker.flow.job-title', 'worker.flow.ask-lead'] },
            { part: 'Thumbnail', token: '--v2-surface-sunken, --v2-radius-md', value: '16:9, duration 11/500 on ink' },
            { part: 'Title / channel', token: '--v2-text-14 600 ink / --v2-text-13 ink-3', value: 'from the job record; wraps, never clamped (YouTube caps a title at 100 characters)' },
            { part: 'Comment', token: '--v2-surface-sunken, 2px --v2-line-strong edge', value: 'exact text, 13/1.5 ink, never clamped', ref: 'worker.flow.comment' },
            { part: 'Deadline', token: '--v2-text-13, clock --v2-attention-ink', value: 'Answer by 9 pm or today won’t count.' },
            { part: 'Take', token: 'Button primary md, full', value: 'Take this job', ref: 'worker.flow.ask-question' },
            { part: 'Skip', token: 'Button secondary md, full', value: 'Skip: today won’t count', ref: 'worker.flow.skip-after' },
            { part: 'Automatic', token: 'Button quiet md, full, zap', value: 'Switch YouTube to Automatic (opens the consent)', ref: 'worker.flow.ask-options' },
            { part: 'Receipt', token: 'StatusTick + quiet Button (shield-check)', value: 'StatusTick from verify (pending by default, null in Run detail) + quiet "Switch back to Always ask", only when ranOn is auto' },
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
