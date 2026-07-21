// Scripted, design-only guided flows for the two BlueAI workers.
// The engine in index.html interprets these step objects. {key} tokens in `say`/`ask`
// strings are substituted with earlier answers (ctx[key]).
//
// Step types:
//   { ask, key?, options:[{label, desc?}], allowText? }   -> question + clickable options (+ optional type-your-own)
//   { say, think? }                                        -> BlueAI line (typewriter); think = ms to show a working spinner after
//   { results:{ kind:'jobs'|'plan', items:[...] }, cost? } -> a result list (job cards / plan rows)
//   { upload:{ label, accept } }                           -> an attach affordance; resolves when clicked
//   { parse:{ kind:'resume', think?, fields:[{k,v}] }, cost? } -> "reading…" then an extracted-details card
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
    { say: 'Locked in. I’ll auto-apply to the strongest matches and log every application in Jobs. ✦' }
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
  ]
};
