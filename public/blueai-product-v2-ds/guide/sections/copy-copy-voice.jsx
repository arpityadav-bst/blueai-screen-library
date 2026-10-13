/* Section 70: Copy and voice (entry-patterns slice). Parts: Glossary (New), PM copy register (In V2).
   Data from the plan's copy_and_voice; drift and ownership cited from V2.
   Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;
  const P = 'entry-patterns.';
  function refs(list) { return list ? list.map(function (x) { return P + x; }) : null; }

  // term, use, banned synonyms, where V2 drifts
  const GLOSSARY = [
    ['BlueAI', 'The product and brand on screen.', 'onBlue (internal only), BlueAI Worker v57', ['copy.v57']],
    ['BlueAI worker', 'The thing that runs; lowercase worker (decision D2: worker or agent).', 'BlueAI Worker, AI worker, MoneyMaker, skill, blueai-worker, agent (until D2)', ['copy.summary', 'copy.skills']],
    ['job, paid job', 'One paid unit of work.', 'task (for paid work), campaign (the site should align), gig, opportunity', ['copy.tasks', 'copy.summary']],
    ['run, today’s run', 'The daily session.', 'routine, session, scheduled task', null],
    ['day, your 20 days', 'The program unit.', 'program days, qualifying day', null],
    ['program, period, your 20 days', 'The program is what the partner joins and what ends on a date (“This program ended on Nov 1”); the period is its dates, used with cash out (“after the period”); “your 20 days” is the count.', 'the 20 days ended (the count never ends)', null],
    ['pending verification, verified', 'One tick, two ticks.', 'confirmed, approved, validated (for days)', ['copy.pending']],
    ['Always ask, Automatic', 'The mode per app (the PM’s names).', 'Mode (as a label), auto mode, autopilot, Just this job (as a mode)', ['copy.modes']],
    ['Sign in, Sign out', 'Account entry and exit.', 'Log in, Login, Logout, Log out (the site should align), logging in', ['copy.logout', 'copy.sign-out-row', 'signin.browser-body', 'signin.success-title']],
    ['AI credits', 'The daily allowance; the title is AI credits, sentence case.', 'tokens, coins, free credits, claim, earn (for credits), balance (say left today)', ['copy.tokens']],
    ['Earnings', 'Money, opened on the site’s dashboard.', 'income, rewards (the site should align), wallet, BCX, a ↗ character for the link (use the icon)', ['copy.earnings-arrow', 'welcome.headline-em']],
    ['cash out, Cash out', 'Taking earnings out, on the site’s dashboard, from $10 after the period ends.', 'withdraw (the site should align: its sheet says “Withdraw”, apply.html:1445, 1532, 1541), claim, redeem', ['copy.cashout']],
    ['Program Terms', 'The agreement.', 'Terms of Use (unless that document changed), Terms & Conditions', ['welcome.terms-label']],
    ['connected account, Disconnect', 'The accounts BlueAI uses.', 'Unlink, ID, enrolled, Not enrolled (say in the program)', ['copy.unlink', 'signin.not-enrolled', 'signin.different-id']],
    ['Try again', 'The system retry.', 'Retry (the PM’s failed-day ask is flagged, not changed)', ['copy.retry', 'copy.try-again']],
    ['BlueStacks, App Player', 'The dependency.', 'emulator, player app', null],
  ];
  const TONE = [
    'Second person, present tense, short declaratives. Give a reason, not an adjective (the site’s voice).',
    'Say the consequence for today’s day or money on the control, before the choice.',
    'Errors: what happened, what it means for today, the one next step.',
    'Empty states name what will appear; disabled states say what unlocks them.',
    'Sentence case for labels and titles; uppercase only for 11px eyebrows.',
    'No emoji in headings; greet by first name or not at all.',
    'Never promise income; say the program in the site’s own words once D3 is decided.',
    'No version strings, slugs or internal names in partner copy.',
    'No em dash anywhere: use a comma, a colon, a full stop or brackets.',
    'The PM’s strings are quoted exactly; anything else is marked Proposed copy in DESIGN.md.',
  ];
  const FORMATS = [
    ['Dates', 'Nov 1, Oct 12. A year only when it is not this one.'],
    ['Times', '11 am, 9 pm, 9 am to 8 pm; the partner’s local time; no :00.'],
    ['Days', '7 of 20 days; Day 7 of 20.'],
    ['Money', '$1, $30, in ink, never painted green while pending.'],
    ['Credits', '1,640 AI credits left today; a thousands comma.'],
    ['Ellipsis', 'The … character, only for work in progress (Signing in…); never three dots, never on a button.', ['copy.dots', 'loading.working']],
    ['Quotes', 'Curly: ’ “ ”.'],
  ];
  // string, owner, refs, status
  const REGISTER = [
    ['I only run a paid job after you say yes to that specific job.', 'PM (Abhisht)', ['copy.pitch', 'copy.pitch-owner'], 'Live by the PM’s call; conflicts with Automatic (R11)'],
    ['Today’s run is done.', 'PM', ['copy.day-job', 'copy.draft'], 'DRAFT'],
    ['No paid job today, but your run counts.', 'PM', ['copy.day-nojob', 'copy.draft'], 'DRAFT'],
    ['Day 20 done. / That’s every day for this month.', 'PM', ['copy.day20', 'copy.day20-sub'], 'DRAFT'],
    ['Pending verification', 'PM', ['copy.pending'], 'DRAFT'],
    ['We check every run within a day. The tick doubles once it’s verified.', 'PM', ['copy.verify-note'], 'DRAFT'],
    ['Run this to begin / Okay', 'PM', ['copy.coach', 'copy.coach-owner'], 'Live (settled after three rounds)'],
    ['An AI that turns your social accounts into income.', 'PM', ['welcome.headline', 'welcome.headline-em'], 'Live; decision D3'],
    ['Sign in with the same account you applied with.', 'PM', ['welcome.step1'], 'Live'],
    ['Run the BlueAI worker: it finds jobs and runs them for you.', 'PM', ['welcome.step2'], 'Live'],
    ['Sign in to get started', 'PM', ['welcome.cta'], 'Live'],
    ['Use the account you applied with', 'PM', ['signin.notice'], 'Live'],
    ['By continuing, you agree to the Program Terms and acknowledge the Privacy Policy and Cookie Policy.', 'Legal (Ashish)', ['terms.body', 'terms.body-2', 'terms.body-3', 'terms.split'], 'Legal'],
    ['Agree and continue', 'PM', ['terms.cta', 'terms.cta-owner'], 'Live'],
    ['Run YouTube jobs automatically? / By turning this on, you agree to let BlueAI do this for you on YouTube. You can turn it off anytime. / I agree, turn on', 'PM', ['consent.title', 'consent.line', 'consent.agree'], 'Live'],
    ['Always ask / Automatic', 'PM', ['copy.modes'], 'Live'],
    ['BlueAI will accept YouTube jobs and finish them on your YouTube account without asking you first, including posting videos and other content. Proposed change (R51): BlueAI will take YouTube jobs and do them on your account without asking first: watching, liking and posting comments in your name.', 'PM and legal', ['worker.permissions.consent-body'], 'Live, change proposed'],
  ];

  function Table({ head, rows, render }) {
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          <thead><tr>{head.map(function (h) { return <th scope="col" key={h}>{h}</th>; })}</tr></thead>
          <tbody>{rows.map(render)}</tbody>
        </table>
      </div>
    );
  }

  function CopyVoiceSection() {
    return (
      <G.Section id="copy-voice">
        <G.Part name="Glossary" status="new" role="One word per thing, shared with the onBlue site, with the words that must not stand in for it.">
          <G.Note>Why the product needs it. A partner moves between the site and the app every day; the same thing named five ways (worker, Worker, AI worker, skill, agent) reads as five things, and the money words are the ones that drift most.</G.Note>
          <Table head={['Term', 'Use', 'Never', 'Where V2 drifts']} rows={GLOSSARY} render={function (r) {
            return <tr key={r[0]}><td><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td><td><G.RefCell refs={refs(r[3])} /></td></tr>;
          }} />
          <h3 className="g-h2">Tone</h3>
          <ul className="g-list">{TONE.map(function (t) { return <li key={t}>{t}</li>; })}</ul>
          <h3 className="g-h2">Formats</h3>
          <Table head={['What', 'Write it', 'V2 source']} rows={FORMATS} render={function (r) {
            return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><G.RefCell refs={refs(r[2])} /></td></tr>;
          }} />
          <G.DoDont
            do={['Look a word up here before writing it.', 'Use the site’s word when the site already has one.', 'Mark new copy as Proposed until the PM approves it.']}
            dont={['Invent a synonym for variety.', 'Put a version, slug or internal name on screen.', 'Write money words for AI credits (earn, claim, balance).']} />
        </G.Part>
        <G.Part name="PM copy register" status="in_v2" role="The strings the PM or legal own: design may restyle them, never rewrite them; changes go to the owner as proposals.">
          <Table head={['String', 'Owner', 'Where', 'Status']} rows={REGISTER} render={function (r) {
            return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><G.RefCell refs={refs(r[2])} /></td><td>{r[3]}</td></tr>;
          }} />
          <G.Note>DRAFT means the PM has not approved it yet (worker_day_done.jsx says every string there is a draft until he does). Legal means the wording is legal’s and changes only through legal review.</G.Note>
        </G.Part>
      </G.Section>
    );
  }

  G.register('copy-voice', CopyVoiceSection);
})();
