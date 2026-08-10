// Scripted, design-only guided flows for the two BlueAI workers.
// The engine in index.html interprets these step objects. {key} tokens in `say`/`ask`
// strings are substituted with earlier answers (ctx[key]).
//
// Step types:
//   { ask, key?, options:[{label, desc?}], allowText? }   -> question + clickable options (+ optional type-your-own) — "Input needed" state
//   { say, think? }                                        -> BlueAI line (typewriter); think = ms to show a working spinner after — the spinner is the "intermediate" state
//   { results:{ kind:'jobs'|'plan', items:[...] }, cost? } -> a result list (job cards / labeled "Plan" rows)
//   { upload:{ label, accept } }                           -> an attach affordance; resolves when clicked — also an "Input needed" state
//   { parse:{ kind:'resume', think?, fields:[{k,v}] }, cost? } -> "reading…" then an extracted-details card
//   { warn }                                                -> non-blocking amber heads-up, doesn't stop the task
//   { done }                                                -> terminal "Task completed" card (use instead of a closing `say`)
window.BlueAIFlows = {
  jobs: [
    {
      ask: 'What roles are you targeting?', key: 'role', allowText: 'Type a role…',
      options: [
        { label: 'Product Designer' },
        { label: 'UX Designer' },
        { label: 'UX Researcher' },
        { label: 'Design Lead' }
      ]
    },
    { say: 'Scanning LinkedIn · Indeed · Wellfound · Glassdoor for {role} roles…', think: 1600 },
    {
      results: {
        kind: 'jobs', items: [
          { title: 'Senior Product Designer', company: 'Notion', source: 'LinkedIn', meta: 'Remote · $150–180k', match: '94% match' },
          { title: 'Product Designer', company: 'Linear', source: 'Wellfound', meta: 'Remote (EU) · €90–110k', match: '91% match' },
          { title: 'UX Designer, Growth', company: 'Figma', source: 'Indeed', meta: 'Hybrid · London', match: '88% match' },
          { title: 'Senior UX Designer', company: 'Vercel', source: 'Glassdoor', meta: 'Remote · $140–165k', match: '85% match' }
        ]
      }, cost: 180
    },
    { say: 'Found 4 strong matches. Upload your resume and I’ll tailor every application to each role.' },
    { upload: { label: 'Attach resume', accept: 'PDF · DOCX' } },
    {
      parse: {
        kind: 'resume', think: 1700, fields: [
          { k: 'Name', v: 'Arpit Yadav' },
          { k: 'Title', v: 'Senior Product Designer' },
          { k: 'Experience', v: '7 yrs · 4 companies' },
          { k: 'Top skills', v: 'Design systems · Figma · UX research · 0→1' },
          { k: 'Location', v: 'Remote · open to relocate' }
        ]
      }, cost: 240
    },
    {
      results: {
        kind: 'plan', items: [
          { step: 'Tailor resume per role', detail: 'Rewrite summary + skills to match each listing' },
          { step: 'Submit applications', detail: '4 applications, one per matched role' },
          { step: 'Log everything in Jobs', detail: 'Status + link for every application' }
        ]
      }
    },
    { warn: 'Auto-applying to all 4 roles will use more credits than a single search.' },
    { done: 'Applied to all 4 roles and logged them in Jobs. ✦' }
  ],

  content: [
    {
      ask: 'What’s the topic?', key: 'topic', allowText: 'Type a topic…',
      options: [
        { label: 'AI news roundup' },
        { label: 'Product launch' },
        { label: 'How-to / tutorial' }
      ]
    },
    {
      ask: 'What format?', key: 'format',
      options: [
        { label: 'Carousel', desc: 'Multi-slide image post · 1080×1350' },
        { label: 'Video', desc: 'Short-form vertical · narrated' }
      ]
    },
    {
      ask: 'Pick a theme.', key: 'theme',
      options: [
        { label: 'Bold & bright' },
        { label: 'Minimal mono' },
        { label: 'Editorial' },
        { label: 'Playful' }
      ]
    },
    { say: 'Drafting your {format} on “{topic}” with a {theme} look…', think: 1700 },
    {
      results: {
        kind: 'plan', items: [
          { step: 'Hook', detail: 'Scroll-stopping opener' },
          { step: '3 context slides', detail: 'The what · why · proof' },
          { step: 'Branded cover + CTA', detail: 'On-brand, ready to post' }
        ]
      }, cost: 320
    },
    { say: 'On it. I’ll generate the drafts and publish across your channels. ✦' }
  ],
  // Item 8 (designer, 2026-08-10): "multiple responses from AI in chat with plan steps and success —
  // typing 'plan my day' should produce more than one reply." It used to produce exactly one: the plan card
  // and nothing else, so the agent appeared to stop the moment it finished thinking out loud. This is a
  // FLOW rather than a new chain of setTimeouts in index.html because the engine that runs these already
  // emits one message per step, with the working spinners and the terminal card, and duplicating that
  // sequencing by hand is how the two would drift.
  // No `ask`/`upload` step on purpose: "plan my day" is not a question to hand back, so this plays start to
  // finish without ever parking on `pending` — the user can keep typing while it runs.
  plan: [
    { say: 'Let me check what’s already running before I put anything new on the list.', think: 1500 },
    {
      results: {
        kind: 'plan',
        intro: 'Here’s what I’d do today, in order — nothing has started yet.',
        items: [
          { text: 'Check Jobs and Scheduled for anything already in progress, so I don’t duplicate work.' },
          { text: 'Claim today’s rewards and check your streaks before they reset.' },
          { text: 'Pick up the most useful thing you asked for recently and run the right skill for it.' },
          { text: 'Report back here as each step finishes, and flag anything that needs your OK first.' }
        ]
      }, cost: 60
    },
    // The middle is deliberately UNEVEN in line length (designer, 2026-08-10: "some with longer lines some
    // with smaller"). A run of same-length lines reads as a template being filled in; real work reports
    // itself at whatever length the step deserves — a two-word acknowledgement, then a sentence that has to
    // explain something, then a short result. The `think` values vary with it, so the pauses aren't metronomic
    // either: a lookup is quick, claiming rewards across games is not.
    { say: 'On it.', think: 900 },
    { say: 'Nothing running in Jobs or Scheduled right now, so there’s no overlap to work around — I’ll take the list from the top.', think: 2000 },
    { say: 'Claiming today’s rewards across your installed games.', think: 2400 },
    { say: 'Two claimed, one had already reset. Checking streaks.', think: 1600 },
    { warn: 'Your Genshin streak resets in about 3 hours — I’ve moved it ahead of the rest.' },
    { say: 'Streaks are safe. Queueing the remaining two steps so they run without you.', think: 1500 },
    { done: 'Rewards claimed and streaks checked. The rest is scheduled — I’ll report back as each step finishes.' }
  ]
};
