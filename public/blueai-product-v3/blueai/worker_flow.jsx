/* BlueAI: the BlueAI worker, end to end (ROB-21350, "Agent should ask for permission once").

   Mirrors the live worker skill's chat (blueai-worker v57, Abhisht's Oct 2026 sessions):
     Day 1, ONCE      plan card, setup pitch, confirm the YouTube handle, daily run time, interest
                      profile, then the warm-up routine. Asking here is fair: it happens one time.
     Every day after  a scheduled run in its own chat with nobody watching: warm-up routine, then a
                      paid job. Live, it stops at "Paid job available… Want me to take this one?"
                      and waits (25 min in the Oct 4 log). That daily ask is what gets automated.

   AUTOMATIC IS NOT IN THE QUESTIONS (PM, 2026-10-14): no question offers it. The person switches
   modes only from the chip next to the chat box (agent_permissions.jsx). The daily run still reads
   the mode: on Automatic it takes the job without asking. Every line that says what happens next
   reads the mode too, so none promises a check-in on Automatic. The mode is named per app
   ('youtube'); wording is "Always ask" and "Automatic", nothing else.
   The pitch's first bullet no longer promises a yes before every job, which Automatic contradicts
   (review round 1, U4; proposed to the PM): it says the person decides whether BlueAI checks first.
   The daily run time is kept here (getRunTime) for the home greeting and Schedule's daily run.

   Steps play through ChatScreen's own engine (d = ms after the previous step). 'ask' steps end a
   segment; the answer pushes the next one through next(). Live copy is verbatim
   except em dashes, which become commas or colons (house rule). Quick-reply chips stand in for
   the free-text replies people type live ("ye", "ok"), so a demo never needs the keyboard.

   HOW THE DAY ENDS (Oct 2026 worker sheet row 2, 2026-10-12): every daily run closes on the
   day-done card from worker_day_done.jsx. Which end it is (job / no job / day 20 / failed) is the
   preview's "Day end" pick; a failed job asks to retry, and the retry always succeeds.

   DAY 1 (PM, 2026-10-14): the setup run counts as Day 1 and closes on the same centre moment.
   ONCE A DAY (review round 2, R3, R11): once today has counted, the home's Run waits for tomorrow
   and runLock() says why; a skipped or failed day offers a run again. A scheduled run's day-done, retry and job-ask steps carry `notify` (the
   Windows notification: nobody is watching); `daily` marks today's run, `record` what a step means
   for today (chat_store.jsx reads both).

   TYPED ANSWERS (PM, 2026-10-14): a question is answered with its chips, or by typing in the chat
   box, which stays open while it waits. interpret() stands in for the agent reading that text: an
   option's own words, then yes / no words; the schedule question takes any text as its answer.
   Anything else gets UNCLEAR and the question stays open.

   Exposes window.WorkerFlow = { PLAN, JOB, RUN_TIMES, HOLD, makeWorkerRun, makeDailyRun, makeRetryRun,
   next, interpret, UNCLEAR, setOnboarded, isOnboarded, getRunTime, setRunTime, tomorrowRun,
   nextRunLine, nextRunShort, runLock }. */
(function () {
  const AP = () => window.AgentPermissions;
  const DD = () => window.WorkerDayDone;
  let lastRunScheduled = false;   // was the run now playing the scheduled one (nobody watching)?
  let onboarded = false;
  /* The daily run time, the schedule ask's answer (default: the live example, 11 am). The home
     greeting, the closing lines and Schedule's daily run (where it is changed) read
     it, so nothing hard-codes a time. `at` is the time as it follows "tomorrow's run". */
  const RUN_TIMES = [
    { id: '11am', label: '11 am', at: ' at 11 am', next: 'Your next run is at 11 am.' },
    { id: 'window', label: '9am–9pm', at: ' between 9 am and 9 pm', next: 'Your next run is between 9 am and 9 pm.' },
    { id: 'any', label: 'Leave it to me', at: '', next: 'I’ll pick the time of your next run.' }];
  let runTime = '11am';
  const getRunTime = () => RUN_TIMES.find((t) => t.id === runTime) || RUN_TIMES[0];
  const setRunTime = (v) => { if (RUN_TIMES.some((t) => t.id === v)) runTime = v; };
  const setOnboarded = (v) => { onboarded = v; };
  const isOnboarded = () => onboarded;
  const HOLD = '9 pm';   // how long an unanswered paid job is held (the kit's 9 pm deadline)
  // Today's run has happened (any end): the next run is tomorrow's.
  const ranToday = () => DD().getToday() !== null;
  const tomorrowRun = () => 'tomorrow’s run' + getRunTime().at;
  const nextRunLine = () => (ranToday() ? 'Your next run is tomorrow' + getRunTime().at + '.' : getRunTime().next);
  const nextRunShort = () => (ranToday() ? 'Tomorrow' : 'Today') + getRunTime().at;
  // Why the home's Run waits for tomorrow, or null while today still offers a run.
  function runLock() {
    const t = DD().getToday();
    if (t === 'job' || t === 'nojob' || t === 'day20') return 'Today’s run is done. Next run tomorrow' + getRunTime().at + '.';
    return null;
  }

  const PLAN = {
    summary: 'You want to start your BlueAI Worker to automatically complete social media tasks and earn rewards.',
    steps: ['Access the BlueAI jobs board to check for available tasks', 'Present the found jobs to you for a quick approval', 'Open the relevant social media apps on your device', 'Complete the engagement or posting tasks as specified', 'Verify and record the completed jobs to secure your rewards'],
    skill: 'blueai-worker'
  };
  const JOB = {
    label: 'Paid job available',
    title: 'Watch the video and provide feedback'
  };

  const say = (content, d = 900) => ({ role: 'status', content, d });
  const YES_NO = [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }];

  /* ── Day 1: onboarding ── */
  // `worker: true` on a run's first step tells ChatScreen the worker has started in this chat.
  function makeOnboarding(text) {
    lastRunScheduled = false;   // they pressed Run and are watching: no Windows notification
    return [
      { role: 'user', content: text, d: 250, worker: true },
      { role: 'plan', d: 900 },
      say('Loading BlueAI Worker v57 skill…'),
      say('Welcome! Let’s set up your BlueAI Worker.'),
      { role: 'ask', id: 'pitch', d: 1100,
        lead: 'Here’s the idea: I’ll use your YouTube account like a genuine fan, watching things you’re actually into and keeping it active on its own, and you earn when I finish a paid job.',
        bullets: ['You decide whether I check with you before each paid job.','You can pause, stop, or disconnect anytime.', 'I never see or type your password.'],
        question: 'Want to set this up?',
        options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'Not now' }] }];
  }
  const handleAsk = () => ({ role: 'ask', id: 'handle', d: 1000, lead: 'Looks like you’re signed in as @bluestacksfan, is that right?', options: YES_NO });
  const scheduleAsk = () => ({ role: 'ask', id: 'schedule', d: 1000,
    lead: 'When would you like me to run each day? Give me a time, like 11 am, and I’ll start within that hour. Or give me a window, like 9am–9pm, and I’ll pick a different moment in it each day. Or leave it to me.',
    options: RUN_TIMES.map((t) => ({ id: t.id, label: t.label })) });
  const profileSteps = () => [
    say('Accessing your watch history…'),
    say('Analyzing your watch history…', 1000),
    say('Summarizing your interests…'),
    { role: 'ask', id: 'profile', d: 1100,
      lead: 'I’ve analyzed your recommendations and history. Here’s the interest profile I’ve built for you:',
      bullets: ['Tech & Smartphones (Samsung/iPhone comparisons, new features)', 'Automotive (Luxury cars, performance, drifting)', 'Motivation & Finance (Success stories, mindset)', 'Entertainment (Humorous sketches, POV content)'],
      question: 'Does this look like a good reflection of what you’re into?',
      options: [{ id: 'yes', label: 'Looks right' }, { id: 'no', label: 'Not quite' }] }];
  const routineSteps = () => [
    say('Starting your daily routine…'),
    say('Watching a car Short…', 1000),
    say('Building your daily routine: Watching video 2/5…', 1000),
    say('Skipping sponsored ad…', 800),
    say('Watching a tech Short…', 1000),
    say('Liking this tech Short…')];

  /* ── Every day after: the scheduled run ── `scheduled` = its own chat with no user message
     (the real daily run); otherwise someone pressed Run on the worker card after onboarding. */
  function makeDailyRun({ scheduled, text } = {}) {
    const auto = AP().getMode('youtube') === 'auto';
    lastRunScheduled = !!scheduled;
    DD().setToday(null);   // today's run is under way: the 20-day strip waits for how it ends
    const head = scheduled
      ? [{ ...say('Scheduled run started.', 600), worker: true, daily: true }, say('Starting your daily routine…')]
      : [{ role: 'user', content: text, d: 250, worker: true, daily: true }, say('Starting your daily routine…')];
    return [
      ...head,
      say('Watching a tech Short…', 1000),
      say('Liking this tech Short…'),
      say('Checking the jobs board…', 1000),
      { role: 'thinking', d: 1200 },
      ...(DD().getEnd() === 'nojob'
        ? [say('No paid job on the board today.'), dayDone('nojob')]
        : (auto ? [say(JOB.label + ': ' + JOB.title + '. Starting it now.'), ...jobSteps()] : [jobAsk()]))];
  }
  /* The daily job ask, as a plain worker question with quick replies like onboarding's (Abhisht,
     2026-10-05: the earlier card said too much). Yes / Not now (PM, 2026-10-14: no Automatic in
     any question). What skipping costs is said before the tap, as the skip chip's description
     (review round 1, U5).
     Asked on a scheduled run, nobody is watching: it raises a notification and says how long the job
     is held (R8). */
  const SKIP_COST = 'Skipping means today won’t count toward your 20 days.';
  const jobAsk = () => ({ role: 'ask', id: 'job', d: 900, notify: lastRunScheduled ? 'waiting' : null,
    title: JOB.label,
    lead: JOB.title + '.',
    question: 'Want me to take this one?' + (lastRunScheduled ? ' I’ll hold it until ' + HOLD + '.' : ''),
    options: [{ id: 'once', label: 'Yes' }, { id: 'deny', label: 'Not now', consequence: SKIP_COST }] });
  /* The day-done card closes every run. `failed` is a worker question (Retry / Not now), so it is
     an 'ask' step drawn by the same card. A scheduled run's carries `notify`, so the desktop raises
     the Windows notification (nobody is watching). */
  const dayDone = (end) => ({ role: 'daydone', end, notify: lastRunScheduled ? end : null, d: 900 });
  const retryAsk = () => ({ role: 'ask', id: 'retry', card: 'daydone', end: 'failed', notify: lastRunScheduled ? 'failed' : null, d: 900,
    options: [{ id: 'retry', label: 'Retry' }, { id: 'later', label: 'Not now', consequence: SKIP_COST }] });
  const jobSteps = (retrying) => {
    const end = retrying ? 'job' : DD().getEnd();
    const open = [say('Opening the job’s video on YouTube…', 1000), say('Watching the video…', 1100)];
    if (end === 'failed') return [...open,
      { role: 'final', tone: 'fail', content: 'I couldn’t finish “' + JOB.title + '”. App Player closed during the job.', d: 900 },
      retryAsk()];
    return [...open,
      say('Liking the video…'),
      say('Leaving a comment…', 1000),
      { role: 'final', tone: 'success', content: DD().doneLine(JOB.title), d: 900 },
      dayDone(end === 'day20' ? 'day20' : 'job')];
  };

  const makeWorkerRun = (text) => (onboarded ? makeDailyRun({ text }) : makeOnboarding(text));
  // The strip's Retry once the failed run's question is no longer in the chat (R4): the job again.
  const makeRetryRun = () => { lastRunScheduled = false; return [{ ...say('Retrying the job…', 600), worker: true, daily: true }, ...jobSteps(true)]; };

  /* A typed answer to a worker question: the option it means, or null when it can't tell. */
  const UNCLEAR = 'Sorry, I didn’t get that. Pick an option, or tell me in other words.';
  const words = (x) => ' ' + x.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  function interpret(step, text) {
    const t = words(text);
    const opts = step.options || [];
    const named = opts.find((o) => t.includes(words(o.label)));
    if (named) return named.id;
    if (step.id === 'schedule') return 'any';   // whatever time or window they type is the answer
    const no = opts.find((o) => ['no', 'deny', 'later'].includes(o.id));
    const yes = opts.find((o) => o !== no);
    if (no && / (no|nope|nah|not now|not today|skip|later|pass|don t|dont) /.test(t)) return no.id;
    if (yes && / (yes|yeah|yep|ye|yup|ok|okay|sure|go|go ahead|do it|take it|sounds good|looks good|looks right|right|correct|try again) /.test(t)) return yes.id;
    return null;
  }

  /* What an answer plays next. A chip answer is echoed by the question, as its chosen chip left as
     a selected pill (review round 1, the kit's AskCard); a typed one by the person's own bubble
     (chat_store.jsx), so nothing here repeats it. On Automatic nothing promises a check-in. */
  const auto = () => AP().getMode('youtube') === 'auto';
  function next(step, a) {
    switch (step.id) {
      case 'job':
        if (a === 'deny') return [say(auto() ? 'Okay, I’ll skip this one.' : 'Okay, I’ll skip this one. I’ll check with you when the next paid job comes up.', 600), dayDone('declined')];
        return jobSteps();
      case 'retry':
        return a === 'retry'
          ? [say('Retrying the job…', 600), ...jobSteps(true)]
          : [{ ...say('Okay. I’ll ' + (auto() ? 'try again on ' : 'check with you on ') + tomorrowRun() + '. Today won’t count.', 600), record: 'declined' }];
      case 'pitch':
        return a === 'yes'
          ? [say('Opening YouTube to find your handle…'), say('Checking your YouTube account…', 1000), say('Confirming your YouTube handle…'), handleAsk()]
          : [say('No problem. Run the BlueAI worker whenever you’re ready to set it up.', 700)];
      case 'handle':
        return a === 'yes'
          ? [say('Reading your channel’s joined date and stats…', 1000), say('Checking your subscriptions…'), say('Saving your account details…', 800), say('Setting your daily schedule…'), scheduleAsk()]
          : [say('Okay. Sign in to the YouTube account you want me to use in App Player, then run the BlueAI worker again.', 700)];
      case 'schedule':
        setRunTime(a);
        return [say('Saving your preferred run window…'), say('Creating your daily schedule…'), ...profileSteps()];
      case 'profile': {
        onboarded = true;
        const close = auto() ? 'When a paid job comes up, I’ll take it on my own.' : 'When a paid job comes up, I’ll check with you first.';
        // Day 1's run is done too (PM, 2026-10-14): the same centre moment, counted as Day 1.
        return [...(a === 'no' ? [say('Thanks. I’ll keep learning from what you watch.', 700)] : []), say('Saving your interest profile…'), ...routineSteps(),
          { role: 'final', tone: 'success', content: 'You’re all set. I’ll run every day' + getRunTime().at + ' and keep your account active. ' + close, d: 900 },
          dayDone('job')];
      }
      default: return [];
    }
  }

  window.WorkerFlow = { PLAN, JOB, RUN_TIMES, HOLD, makeWorkerRun, makeDailyRun, makeRetryRun, next, interpret, UNCLEAR, setOnboarded, isOnboarded, getRunTime, setRunTime, tomorrowRun, nextRunLine, nextRunShort, runLock };
})();
