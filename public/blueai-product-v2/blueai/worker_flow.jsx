/* BlueAI — the BlueAI worker, end to end (ROB-21350, "Agent should ask for permission once").

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
     'jobcard'     onboarding exactly as live; the daily job ask offers Automatic / Just this job.
   The mode is PER APP (Abhisht, 2026-10-12): this skill works YouTube, so every mode call here
   names 'youtube'. Wording everywhere is "Always ask" and "Automatic", nothing else.
   Where it is changed LATER is still open: the worker-card row was taken back out (2026-10-05).
   The pitch's "I only run a paid job after you say yes" bullet stays as live, by Abhisht's call.

   Steps play through ChatScreen's own engine (d = ms after the previous step). 'ask' steps end a
   segment; the answer pushes the next one through next(). Live copy is verbatim
   except em dashes, which become commas or colons (house rule). Quick-reply chips stand in for
   the free-text replies people type live ("ye", "ok"), so a demo never needs the keyboard.

   HOW THE DAY ENDS (Oct 2026 worker sheet row 2, 2026-10-12): every daily run closes on the
   day-done card from worker_day_done.jsx. Which end it is (job / no job / day 20 / failed) is the
   preview's "Day end" pick; a failed job asks to retry, and the retry always succeeds.

   Exposes window.WorkerFlow = { PLAN, JOB, makeWorkerRun, makeDailyRun, next, setChoicePoint,
   setOnboarded, isOnboarded, claimDailyRun }. */
(function () {
  const AP = () => window.AgentPermissions;
  const DD = () => window.WorkerDayDone;
  let lastRunScheduled = false;   // was the run now playing the scheduled one (nobody watching)?
  let choicePoint = 'onboarding';
  let onboarded = false;
  let claimed = 0;
  const setChoicePoint = (v) => { choicePoint = v; };
  const setOnboarded = (v) => { onboarded = v; };
  const isOnboarded = () => onboarded;
  // The "Next day" run plays once per preview click, not again on every remount of the chat.
  const claimDailyRun = (k) => { if (!k || k === claimed) return false; claimed = k; return true; };

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
        bullets: ['I only run a paid job after you say yes to that specific job.', 'You can pause, stop, or disconnect anytime.', 'I never see or type your password.'],
        question: 'Want to set this up?',
        options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'Not now' }] }];
  }
  const handleAsk = () => ({ role: 'ask', id: 'handle', d: 1000, lead: 'Looks like you’re signed in as @bluestacksfan, is that right?', options: YES_NO });
  const scheduleAsk = () => ({ role: 'ask', id: 'schedule', d: 1000,
    lead: 'When would you like me to run each day? Give me a time, like 11 am, and I’ll start within that hour. Or give me a window, like 9am–9pm, and I’ll pick a different moment in it each day. Or leave it to me.',
    options: [{ id: '11am', label: '11 am' }, { id: 'window', label: '9am–9pm' }, { id: 'any', label: 'Leave it to me' }] });
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
    const head = scheduled
      ? [{ ...say('Scheduled run started.', 600), worker: true }, say('Starting your daily routine…')]
      : [{ role: 'user', content: text, d: 250, worker: true }, say('Starting your daily routine…')];
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
     2026-10-05: the earlier card said too much). "Yes, switch to Automatic" turns Automatic on for
     YouTube, so it goes through the consent dialog before it answers. */
  const jobAsk = () => ({ role: 'ask', id: 'job', d: 900,
    title: JOB.label,
    lead: JOB.title + '.',
    question: 'Want me to take this one?',
    options: [{ id: 'always', label: 'Yes, switch to Automatic', consent: true }, { id: 'once', label: 'Just this job' }, { id: 'deny', label: 'Not now' }] });
  /* The day-done card closes every run. `failed` is a worker question (Retry / Not now), so it is
     an 'ask' step drawn by the same card. `scheduled` rides along so the desktop knows whether to
     raise the Windows notification. */
  const dayDone = (end) => ({ role: 'daydone', end, scheduled: lastRunScheduled, d: 900 });
  const retryAsk = () => ({ role: 'ask', id: 'retry', card: 'daydone', end: 'failed', scheduled: lastRunScheduled, d: 900,
    options: [{ id: 'retry', label: 'Retry' }, { id: 'later', label: 'Not now' }] });
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

  // What an answer plays next. Every answer echoes as the person's own reply, the way a typed reply shows live.
  function next(step, a) {
    const opt = (step.options || []).find((o) => o.id === a);
    const reply = { role: 'user', content: opt ? opt.label : a, d: 250 };
    switch (step.id) {
      case 'job':
        if (a === 'deny') return [reply, say('Okay, I’ll skip this one. I’ll check with you when the next paid job comes up.', 600), dayDone('declined')];
        return [reply, ...(a === 'always' ? [say('Got it. Automatic is on for YouTube. I’ll take paid YouTube jobs on my own from now on.', 500)] : []), ...jobSteps()];
      case 'retry':
        return a === 'retry'
          ? [reply, say('Retrying the job…', 600), ...jobSteps(true)]
          : [reply, say('Okay. I’ll try again on tomorrow’s run.', 600)];
      case 'pitch':
        return a === 'yes'
          ? [reply, say('Opening YouTube to find your handle…'), say('Checking your YouTube account…', 1000), say('Confirming your YouTube handle…'), handleAsk()]
          : [reply, say('No problem. Run the BlueAI worker whenever you’re ready to set it up.', 700)];
      case 'handle':
        return a === 'yes'
          ? [reply, say('Reading your channel’s joined date and stats…', 1000), say('Checking your subscriptions…'), say('Saving your account details…', 800), say('Setting your daily schedule…'), scheduleAsk()]
          : [reply, say('Okay. Sign in to the YouTube account you want me to use in App Player, then run the BlueAI worker again.', 700)];
      case 'schedule':
        return [reply, say('Saving your preferred run window…'), say('Creating your daily schedule…'), ...(choicePoint === 'onboarding' ? [jobChoiceAsk()] : profileSteps())];
      case 'jobchoice':
        return [reply, say(a === 'auto' ? 'Got it. Automatic is on for YouTube. I’ll take paid jobs on my own.' : 'Got it. Always ask is on for YouTube. I’ll check with you before each paid job.', 700), ...profileSteps()];
      case 'profile': {
        onboarded = true;
        const close = AP().getMode('youtube') === 'auto' ? 'When a paid job comes up, I’ll take it on my own.' : 'When a paid job comes up, I’ll check with you first.';
        return [reply, ...(a === 'no' ? [say('Thanks. I’ll keep learning from what you watch.', 700)] : []), say('Saving your interest profile…'), ...routineSteps(),
          { role: 'final', tone: 'success', content: 'You’re all set. I’ll run every day in your window and keep your account active. ' + close, d: 900 }];
      }
      default: return [reply];
    }
  }

  window.WorkerFlow = { PLAN, JOB, makeWorkerRun, makeDailyRun, next, setChoicePoint, setOnboarded, isOnboarded, claimDailyRun };
})();
