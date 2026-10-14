/* BlueAI: the BlueAI worker, end to end (ROB-21350, "Agent should ask for permission once").

   Mirrors the live worker skill's chat (blueai-worker v57, Abhisht's Oct 2026 sessions):
     Day 1, ONCE      plan card, setup pitch, confirm the YouTube handle, daily run time, interest
                      profile, then the warm-up routine. Asking here is fair: it happens one time.
     Every day after  a scheduled run in its own chat with nobody watching: warm-up routine, then a
                      paid job. Live, it stops at "Paid job available… Want me to take this one?"
                      and waits (25 min in the Oct 4 log). That daily ask is what gets automated.

   WHERE the person picks between the two modes is a preview toggle, so both shapes can be
   compared (Abhisht, 2026-10-05):
     'onboarding'  one extra setup question after the run time: Automatic, or Always ask. The daily
                   job ask still offers the switch to Automatic.
     'jobcard'     onboarding exactly as live; the daily job ask offers this job / switch to Automatic.
   The mode is PER APP (Abhisht, 2026-10-12): this skill works YouTube, so every mode call here
   names 'youtube'. Wording everywhere is "Always ask" and "Automatic", nothing else.
   Where it is changed LATER is still open: the worker-card row was taken back out (2026-10-05).
   The pitch's first bullet no longer promises a yes before every job, which Automatic contradicts
   (review round 1, U4; proposed to the PM): it says the person decides whether BlueAI checks first.
   The daily run time is kept here (getRunTime) for the home greeting and Settings > Worker.

   Steps play through ChatScreen's own engine (d = ms after the previous step). 'ask' steps end a
   segment; the answer pushes the next one through next(). Live copy is verbatim
   except em dashes, which become commas or colons (house rule). Quick-reply chips stand in for
   the free-text replies people type live ("ye", "ok"), so a demo never needs the keyboard.

   HOW THE DAY ENDS (Oct 2026 worker sheet row 2, 2026-10-12): every daily run closes on the
   day-done card from worker_day_done.jsx. Which end it is (job / no job / day 20 / failed) is the
   preview's "Day end" pick; a failed job asks to retry, and the retry always succeeds.

   ONCE A DAY (review round 2, R2, R3, R11): setup is not a counted day; the 20 days start with
   tomorrow's run at the Daily run time, and the closing lines say so. Once today has counted (or
   today was the setup), the home's Run waits for tomorrow and runLock() says why; a skipped or failed
   day offers a run again. A scheduled run's day-done, retry and job-ask steps carry `notify` (the
   Windows notification: nobody is watching); `daily` marks today's run, `record` what a step means
   for today (chat_store.jsx reads both).

   Exposes window.WorkerFlow = { PLAN, JOB, RUN_TIMES, HOLD, makeWorkerRun, makeDailyRun, makeRetryRun,
   next, setChoicePoint, setOnboarded, isOnboarded, getRunTime, setRunTime, tomorrowRun, nextRunLine,
   nextRunShort, runLock }. */
(function () {
  const AP = () => window.AgentPermissions;
  const DD = () => window.WorkerDayDone;
  let lastRunScheduled = false;   // was the run now playing the scheduled one (nobody watching)?
  let choicePoint = 'onboarding';
  let onboarded = false;
  /* The daily run time, the schedule ask's answer (default: the live example, 11 am). The home
     greeting, the closing lines, Schedule's worker entry and Settings > Worker's Daily run row read
     it, so nothing hard-codes a time. `at` is the time as it follows "tomorrow's run". */
  const RUN_TIMES = [
    { id: '11am', label: '11 am', at: ' at 11 am', next: 'Your next run is at 11 am.' },
    { id: 'window', label: '9am–9pm', at: ' between 9 am and 9 pm', next: 'Your next run is between 9 am and 9 pm.' },
    { id: 'any', label: 'Leave it to me', at: '', next: 'I’ll pick the time of your next run.' }];
  let runTime = '11am';
  const getRunTime = () => RUN_TIMES.find((t) => t.id === runTime) || RUN_TIMES[0];
  const setRunTime = (v) => { if (RUN_TIMES.some((t) => t.id === v)) runTime = v; };
  const setChoicePoint = (v) => { choicePoint = v; };
  const setOnboarded = (v) => { onboarded = v; };
  const isOnboarded = () => onboarded;
  const HOLD = '9 pm';   // how long an unanswered paid job is held (the kit's 9 pm deadline)
  // Today's run has happened (any end), or today was the setup: the next run is tomorrow's.
  const ranToday = () => DD().getToday() !== null;
  const tomorrowRun = () => 'tomorrow’s run' + getRunTime().at;
  const nextRunLine = () => (ranToday() ? 'Your next run is tomorrow' + getRunTime().at + '.' : getRunTime().next);
  const nextRunShort = () => (ranToday() ? 'Tomorrow' : 'Today') + getRunTime().at;
  // Why the home's Run waits for tomorrow, or null while today still offers a run.
  function runLock() {
    const t = DD().getToday();
    if (t === 'job' || t === 'nojob' || t === 'day20') return 'Today’s run is done. Next run tomorrow' + getRunTime().at + '.';
    if (t === 'setup') return 'Your 20 days start with ' + tomorrowRun() + '.';
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
  // `worker: true` on a run's first step tells ChatScreen the worker has started in this chat (Version 2's ribbon waits for it).
  function makeOnboarding(text) {
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
  // The 'onboarding' variant's one new question. Its Automatic answer goes through the consent dialog.
  const jobChoiceAsk = () => ({ role: 'ask', id: 'jobchoice', d: 1000,
    lead: 'One more thing. When I find a paid YouTube job on my daily run, should I take it on my own, or check with you first?',
    options: [{ id: 'auto', label: 'Automatic', consent: true }, { id: 'ask', label: 'Always ask', mode: 'always' }] });
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
     2026-10-05: the earlier card said too much). Review round 1 (U5, proposed to the PM): the plain
     yes leads, the mode switch is a second yes (it goes through the consent dialog before it
     answers), and what skipping costs is said before the tap, as the skip chip's description.
     Asked on a scheduled run, nobody is watching: it raises a notification and says how long the job
     is held (R8). */
  const SKIP_COST = 'Skipping means today won’t count toward your 20 days.';
  const jobAsk = () => ({ role: 'ask', id: 'job', d: 900, notify: lastRunScheduled ? 'waiting' : null,
    title: JOB.label,
    lead: JOB.title + '.',
    question: 'Want me to take this one?' + (lastRunScheduled ? ' I’ll hold it until ' + HOLD + '.' : ''),
    options: [{ id: 'once', label: 'Yes, take this job' }, { id: 'always', label: 'Yes, and switch to Automatic', consent: true }, { id: 'deny', label: 'Not now', consequence: SKIP_COST }] });
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
      { role: 'final', tone: 'success', content: DD().doneLine(end === 'day20' ? 'day20' : 'job', JOB.title), d: 900 },   // the plain option adds its sentence here
      dayDone(end === 'day20' ? 'day20' : 'job')];
  };

  const makeWorkerRun = (text) => (onboarded ? makeDailyRun({ text }) : makeOnboarding(text));
  // The strip's Retry once the failed run's question is no longer in the chat (R4): the job again.
  const makeRetryRun = () => { lastRunScheduled = false; return [{ ...say('Retrying the job…', 600), worker: true, daily: true }, ...jobSteps(true)]; };

  /* What an answer plays next. The answer itself is echoed by the question, as its chosen chip left
     as a selected pill (review round 1, the kit's AskCard), so no user bubble repeats it. */
  function next(step, a) {
    switch (step.id) {
      case 'job':
        if (a === 'deny') return [say('Okay, I’ll skip this one. I’ll check with you when the next paid job comes up.', 600), dayDone('declined')];
        return [...(a === 'always' ? [say('Got it. Automatic is on for YouTube. I’ll take paid YouTube jobs on my own from now on.', 500)] : []), ...jobSteps()];
      case 'retry':
        return a === 'retry'
          ? [say('Retrying the job…', 600), ...jobSteps(true)]
          : [{ ...say('Okay. I’ll check with you on ' + tomorrowRun() + '. Today won’t count.', 600), record: 'declined' }];
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
        return [say('Saving your preferred run window…'), say('Creating your daily schedule…'), ...(choicePoint === 'onboarding' ? [jobChoiceAsk()] : profileSteps())];
      case 'jobchoice':
        return [say(a === 'auto' ? 'Got it. Automatic is on for YouTube. I’ll take paid jobs on my own.' : 'Got it. Always ask is on for YouTube. I’ll check with you before each paid job.', 700), ...profileSteps()];
      case 'profile': {
        onboarded = true;
        const close = AP().getMode('youtube') === 'auto' ? 'When a paid job comes up, I’ll take it on my own.' : 'When a paid job comes up, I’ll check with you first.';
        // Setup is today's run: the 20 days start with tomorrow's (R2), so the close says when.
        return [...(a === 'no' ? [say('Thanks. I’ll keep learning from what you watch.', 700)] : []), say('Saving your interest profile…'), ...routineSteps(),
          { role: 'final', tone: 'success', record: 'setup', content: 'You’re all set. Your 20 days start with ' + tomorrowRun() + ', and I’ll run every day after that. ' + close, d: 900 }];
      }
      default: return [];
    }
  }

  window.WorkerFlow = { PLAN, JOB, RUN_TIMES, HOLD, makeWorkerRun, makeDailyRun, makeRetryRun, next, setChoicePoint, setOnboarded, isOnboarded, getRunTime, setRunTime, tomorrowRun, nextRunLine, nextRunShort, runLock };
})();
