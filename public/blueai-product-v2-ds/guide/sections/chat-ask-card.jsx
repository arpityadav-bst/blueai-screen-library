/* Section 37: Ask card (chat slice). AskCard. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};

  /* V2's copy, quoted exactly (worker_flow.jsx:66-69, 50-51, 120-121; worker_day_done.jsx:94). */
  const PITCH = {
    lead: 'Here’s the idea: I’ll use your YouTube account like a genuine fan, watching things you’re actually into and keeping it active on its own, and you earn when I finish a paid job.',
    bullets: ['I only run a paid job after you say yes to that specific job.', 'You can pause, stop, or disconnect anytime.', 'I never see or type your password.'],
    question: 'Want to set this up?',
    options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'Not now' }],
  };
  const JOB = {
    title: 'Paid job available', lead: 'Watch the video and provide feedback.', question: 'Want me to take this one?',
    options: [{ id: 'always', label: 'Yes, switch to Automatic', consent: true }, { id: 'once', label: 'Just this job' }, { id: 'deny', label: 'Not now', consequence: 'today won’t count toward your 20 days.' }],
  };
  const FAILED = { title: 'Today’s job didn’t finish.', lead: 'Retry to count the day.', options: [{ id: 'retry', label: 'Retry' }, { id: 'later', label: 'Not now' }] };

  function Playable() {
    const K = window.V2Kit;
    const [answer, setAnswer] = useState(null);
    const picked = JOB.options.find(function (o) { return o.id === answer; });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
        <K.AskCard step={JOB} answer={answer} onAnswer={function (id) { setAnswer(id); }} />
        {picked ? <K.MessageBubble from="user" time="11:05 am">{picked.label}</K.MessageBubble> : null}
        {answer ? <button type="button" className="g-btn" onClick={function () { setAnswer(null); }}>Ask again</button> : null}
      </div>
    );
  }

  function AskSection() {
    const K = window.V2Kit;
    const V2 = function () { return window.WorkerCards && window.WorkerCards.AskBubble; };
    return (
      <G.Section id="ask-card">
        <G.Part name="AskCard" status="changed" role="The worker's question, answered with chips, with what each answer costs visible before you tap. Yellow only while it waits for you.">
          <G.StateGrid wide states={[
            { label: 'Pending: title, lead, bullets, question', note: 'Onboarding pitch, V2 copy.', node: <K.AskCard step={PITCH} onAnswer={noop} /> },
            { label: 'Pending: the daily job ask', note: 'Consent chip carries the zap; the consequence is proposed copy (R06).', node: <K.AskCard step={JOB} onAnswer={noop} /> },
            { label: 'Answered (echo as your bubble)', node: <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}><K.AskCard step={JOB} answer="once" /><K.MessageBubble from="user" time="11:05 am">Just this job</K.MessageBubble></div> },
            { label: 'Stopped (Stop pressed while waiting)', node: <K.AskCard step={JOB} state="stopped" /> },
            { label: 'Expired (no answer by the end of the window)', note: 'Proposed with R08.', node: <K.AskCard step={Object.assign({ expiresAt: '9 pm' }, JOB)} state="expired" /> },
            { label: 'Failed-day ask', note: 'PM copy kept; "Retry" is flagged, not changed.', node: <K.AskCard step={FAILED} onAnswer={noop} /> },
            { label: 'Neutral tone (decision D13, option B)', note: 'Asks while the partner is watching, in onboarding.', node: <K.AskCard step={PITCH} tone="neutral" onAnswer={noop} /> },
          ]} />
          <G.Note>Try it: answer the job ask. The chips go, the card settles to white, and your answer shows as your own bubble.</G.Note>
          <Playable />
          <G.CompareRow
            v2={<G.Live get={V2} props={{ step: { lead: 'Want to set this up?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'Not now' }] }, answer: null, onAnswer: noop }} label="WorkerCards.AskBubble" />}
            system={<K.AskCard step={{ lead: 'Want to set this up?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'Not now' }] }} onAnswer={noop} />}
            changed="Keeps V2's one-shape-for-every-question idea and its copy. The chips become the shared Chip (one look, a visible hover, 3.24:1 blue text gone); bullet markers come back (the Tailwind preflight hid them); text moves to ink on the yellow; the card settles to white once answered so yellow keeps meaning 'needs you' (decision D13); a consequence line shows before the choice." />
          <G.SpecDrawer rows={[
            { part: 'Fill and line (pending)', token: '--v2-attention-tint, --v2-attention-line', value: '#fdf6cf, 1px #f3e8a8', ref: 'chat.ask.input-colours' },
            { part: 'Fill and line (settled)', token: '--v2-surface, --v2-line', value: 'white, 1px line' },
            { part: 'Shape', token: '--v2-radius-lg, --v2-bubble-max', value: 'radius 16, max 300, padding 12 16, no shadow', ref: ['chat.ask.bubble', 'chat.ask.shadow'] },
            { part: 'Title', token: '--v2-text-14, --v2-weight-semibold, --v2-ink', value: '14/600 ink (was 13.5/800 #8a6116)', ref: 'chat.ask.title' },
            { part: 'Lead, question', token: '--v2-text-14, --v2-ink-2', value: '14/1.5' },
            { part: 'Bullets', token: '--v2-space-5, --v2-ink-3', value: 'disc markers on, indent 20, marker ink-3', ref: ['chat.ask.bullets', 'chat.ask.plan-list'] },
            { part: 'Chips', token: 'Chip (section 15)', value: 'shared Chip, gap 8; consent option shows zap', ref: ['chat.ask.chip', 'chat.ask.chip-size'] },
            { part: 'Consequence', token: '--v2-text-13, --v2-attention-ink', value: '"Not now: today won’t count toward your 20 days."', ref: 'chat.ask.job-deny' },
            { part: 'Hint, settled line', token: '--v2-text-13, --v2-ink-3', value: '13 #5f636b (was 11.5 #9ca3af, 2.54:1)', ref: 'chat.ask.hint' },
            { part: 'Consent', token: null, value: 'option.consent opens ConsentDialog (section 46) before answering', ref: 'chat.ask.consent' },
            { part: 'Answered', token: null, value: 'chips go, the label echoes as a user bubble', ref: 'chat.ask.echo' },
            { part: 'Stopped', token: null, value: 'chips go, one line says the run stopped', ref: 'chat.ask.stopped' },
            { part: 'Copy', token: null, value: 'V2 copy, quoted', ref: ['chat.ask.pitch-lead', 'chat.ask.pitch-bullets', 'chat.ask.pitch-question', 'chat.ask.pitch-options', 'chat.ask.job-label', 'chat.run.job-title', 'chat.ask.job-question', 'chat.ask.job-options', 'chat.ask.failed-title', 'chat.ask.retry-options'] },
          ]} />
          <G.Warn>PM decisions open here: D13 (yellow on every ask, or only on unattended job and retry asks), R06 (say what "Not now" costs on the option), R07 (the job ask shows only "Watch the video and provide feedback."; the JobPreviewCard in section 45 is the proposal), R11 (the first bullet is broken by Automatic).</G.Warn>
          <G.DoDont
            do={['Say the consequence before the choice.', 'Settle the card once answered.', 'Route a consent chip through the consent dialog.']}
            dont={['Bundle a mode switch into "Yes" silently.', 'Leave yellow on an answered question.', 'Put the hint in a caption grey under 4.5:1.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('ask-card', AskSection);
})();
