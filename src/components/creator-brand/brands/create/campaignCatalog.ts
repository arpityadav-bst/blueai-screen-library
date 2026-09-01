import { KARMA, PACING, PLATFORMS, type CampaignType } from './campaignSpec'

// THE NINE CAMPAIGNS. Copy is the dev prototype's verbatim (Abhisht, 2026-09-01) - it was written
// to a deliberate reading level, "a 12 year old should get it", and rewording it here would fork
// the wording from the version the PM is showing people. Two edits only, both structural:
//
//   1. `ex` is plain text, not HTML, and drops the source's leading "Example: ". The source embedded
//      <b> tags in the string and injected them; BriefStage emphasises the money figures itself, and
//      it labels the block "Example" in the chrome - so the data stays data and the hedge is stated
//      once rather than nine times. A parity check against the source therefore shows exactly nine
//      differences, all of them this prefix, and nothing else.
//   2. `sample` is new - an illustrative running state per type, which is what the catalogue card
//      shows instead of an illustration. See CatalogueStage for the argument.
//
// Every figure is illustrative, like every other number on this site. The bids are not a rate card.

export const CAMPAIGN_TYPES: readonly CampaignType[] = [
  {
    id: 'engagement-boost',
    family: 'Get more views',
    name: 'Boost a post',
    one: 'Real people watch and like a video you already posted.',
    tag: 'You already posted a video. We send real people to watch it, like it, and comment on it, from their own phones and their own accounts.',
    steps: [
      'Paste the link to your video.',
      'Community members open it and watch it, like normal viewers.',
      'You pay only for views that are checked and real.',
    ],
    ex: 'You set a $200 budget and bid $4 per 1,000 views. If it all fills, that is about 50,000 checked views.',
    outcome: { label: 'Bid per 1,000 verified views', unit: 'checked views', per: 1000, ph: '4' },
    gen: null,
    review: 'auto',
    sample: { done: 212, target: 500, note: '7 days left' },
    fields: [
      { key: 'postUrl', label: 'Post URL', kind: 'text', ph: 'https://youtube.com/watch?v=...', hint: 'The public video to boost.' },
      { key: 'actions', label: 'Actions', kind: 'chips', options: ['Watch', 'Like', 'Comment'], hint: 'What each member does.' },
    ],
  },
  {
    id: 'video-distribution',
    family: 'Get more views',
    name: 'Distribute one video',
    one: 'Your best video, posted again and again by many real accounts.',
    tag: 'You give us one finished video. Many community members post that same video from their own real accounts, so it shows up all over.',
    steps: [
      'Upload your video once.',
      'Members post it from their own accounts, with their own captions.',
      'You pay for the views all those posts get, checked first.',
    ],
    ex: '$500 at $5 per 1,000 views is about 100,000 checked views across every post.',
    outcome: { label: 'Bid per 1,000 verified views', unit: 'checked views', per: 1000, ph: '5' },
    gen: null,
    review: 'first',
    sample: { done: 61, target: 100, note: '18 accounts posting' },
    fields: [
      { key: 'videoAsset', label: 'Your video', kind: 'filelink', ph: 'or paste a link to it', hint: 'The one video everyone posts.' },
      { key: 'platforms', label: 'Platforms', kind: 'chips', options: PLATFORMS, hint: 'Where members post it.' },
      { key: 'captionMode', label: 'Captions', kind: 'chips', options: ['Same caption', 'Varied per account'], hint: 'Varied reads more natural.' },
    ],
  },
  {
    id: 'template-creators',
    family: 'Get videos made',
    name: 'Creators make videos',
    one: 'Creators copy your winning video style and post their own versions.',
    tag: 'You found a video style that works. Show it to us once, and creators make their own versions of it and post them from their accounts.',
    steps: [
      'Share the example video and say what must stay the same.',
      'Each creator films their own version and posts it.',
      'You pay a little for each video made, plus the views it earns.',
    ],
    ex: '10 creators make a video each at your $20 per video bid, then every 1,000 checked views costs your view bid on top.',
    outcome: { label: 'Bid per 1,000 verified views', unit: 'checked views', per: 1000, ph: '5' },
    gen: { label: 'Bid per video a creator makes', ph: '20' },
    review: 'first',
    sample: { done: 7, target: 10, note: '3 awaiting your review' },
    fields: [
      { key: 'referenceUrl', label: 'Example video', kind: 'filelink', ph: 'or paste a link to it', hint: 'The style creators copy.' },
      { key: 'templateBrief', label: 'What must stay the same', kind: 'textarea', ph: 'The hook, the length, what must appear, what to avoid.' },
      { key: 'platforms', label: 'Platforms', kind: 'chips', options: PLATFORMS },
      { key: 'perWorker', label: 'Videos per creator', kind: 'number', ph: '3' },
    ],
  },
  {
    id: 'template-blueai',
    family: 'Get videos made',
    name: 'BlueAI makes videos',
    one: 'BlueAI makes the videos for you, creators post them.',
    tag: 'You show one example. BlueAI generates many versions of it, you can check them first, and creators post them from their own accounts.',
    steps: [
      'Share the example video or template.',
      'BlueAI generates the versions. You can review them before anything posts.',
      'Creators post them. You pay per video generated, plus checked views.',
    ],
    ex: '$300 could generate 15 videos at an $8 per video bid and still leave budget for views.',
    outcome: { label: 'Bid per 1,000 verified views', unit: 'checked views', per: 1000, ph: '5' },
    gen: { label: 'Bid per video BlueAI generates', ph: '8' },
    review: 'first',
    sample: { done: 15, target: 15, note: '15 generated, 11 posted' },
    fields: [
      { key: 'referenceUrl', label: 'Example video or template', kind: 'filelink', ph: 'or paste a link to it', hint: 'BlueAI makes versions of this.' },
      { key: 'templateBrief', label: 'What the videos must do', kind: 'textarea', ph: 'The hook, the length, what must appear, what to avoid.' },
      { key: 'platforms', label: 'Platforms', kind: 'chips', options: PLATFORMS },
    ],
  },
  {
    id: 'ugc-deliverable',
    family: 'Get videos made',
    name: 'Get content made',
    one: 'Creators make videos and hand you the files. Nothing is posted.',
    tag: 'Creators make content for you and send you the files. Nothing gets posted anywhere. You use it however you like.',
    steps: [
      'Write down what you need and the style you want.',
      'Creators make it and send in their files.',
      'You pay per finished piece you accept.',
    ],
    ex: '10 short videos at a $25 per video bid is $250.',
    outcome: { label: 'Bid per finished piece', unit: 'finished pieces', per: 1, ph: '25' },
    gen: null,
    review: 'all',
    sample: { done: 4, target: 10, note: '2 awaiting your review' },
    fields: [
      { key: 'deliverableType', label: 'What kind', kind: 'select', options: ['Short-form video', 'Long-form video', 'Image set', 'Written copy'], ph: 'Pick a format' },
      { key: 'brief', label: 'The brief', kind: 'textarea', ph: 'What you need made, the style, the references.' },
      { key: 'quantity', label: 'How many', kind: 'number', ph: '10' },
    ],
  },
  {
    id: 'reddit-comments',
    family: 'Get talked about',
    name: 'Reddit comments',
    one: 'Strong Reddit accounts mention you inside real conversations.',
    tag: 'Members with strong, old Reddit accounts talk about you inside real conversations, in their own words, where people already ask about things like yours.',
    steps: [
      'Tell us the subreddits or threads, and what to get across.',
      'High karma members write their own comments there.',
      'You pay per comment that is still up after 3 days.',
    ],
    ex: '$150 at $3 per surviving comment is up to 50 comments.',
    outcome: { label: 'Bid per surviving comment', unit: 'surviving comments', per: 1, ph: '3' },
    gen: null,
    review: 'all',
    sample: { done: 38, target: 50, note: '3-day hold, 2 pending' },
    fields: [
      { key: 'targets', label: 'Threads or subreddits', kind: 'textarea', ph: 'r/coffee, r/espresso, or paste thread links.' },
      { key: 'messageIntent', label: 'What to get across', kind: 'textarea', ph: 'The point to make, not word-for-word copy.', hint: 'Identical text from many accounts looks fake.' },
      { key: 'minKarma', label: 'Minimum account karma', kind: 'select', options: KARMA, ph: 'Pick a karma floor' },
      { key: 'pacing', label: 'Pacing', kind: 'select', options: PACING, ph: 'How fast comments land' },
    ],
  },
  {
    id: 'reddit-thread',
    family: 'Get talked about',
    name: 'Reddit thread',
    one: 'One strong account starts a thread, others keep it alive.',
    tag: 'One member with a strong account starts a conversation about your topic, and other members reply over time so it reads like a real, living thread.',
    steps: [
      'Pick the subreddit and the topic.',
      'A high karma member starts the thread. Others reply over hours or days.',
      'You pay per reply that is still up after 3 days.',
    ],
    ex: '$100 at $2 per surviving reply is up to 50 replies under your thread.',
    outcome: { label: 'Bid per surviving reply', unit: 'surviving replies', per: 1, ph: '2' },
    gen: null,
    review: 'all',
    sample: { done: 22, target: 50, note: 'thread live 2 days' },
    fields: [
      { key: 'subreddit', label: 'Subreddit', kind: 'text', ph: 'r/smallbusiness' },
      { key: 'topicAngle', label: 'Topic and angle', kind: 'textarea', ph: 'What the thread is about and what it should surface.' },
      { key: 'minKarma', label: 'Minimum karma for the starter', kind: 'select', options: KARMA, ph: 'Pick a karma floor' },
      { key: 'pacing', label: 'Pacing', kind: 'select', options: PACING, ph: 'How replies spread out' },
    ],
  },
  {
    id: 'research',
    family: 'Learn from real people',
    name: 'Product research',
    one: 'Real people try your product and tell you the truth.',
    tag: 'Real people use your product on their own devices, then answer your questions honestly. You get structured reports, not guesses.',
    steps: [
      'Tell us what to try and what to ask.',
      'Members use your product like normal users.',
      'You pay per finished report you receive.',
    ],
    ex: '$160 at $8 per report gets you 20 honest write-ups.',
    outcome: { label: 'Bid per completed report', unit: 'reports', per: 1, ph: '8' },
    gen: null,
    review: 'auto',
    sample: { done: 13, target: 20, note: '13 reports in' },
    fields: [
      { key: 'taskScript', label: 'What to try', kind: 'textarea', ph: 'The task or flow you want each member to run.' },
      { key: 'questions', label: 'Questions to answer', kind: 'textarea', ph: 'One per line.' },
    ],
  },
  {
    id: 'community-retainer',
    family: 'Learn from real people',
    name: 'Community presence',
    one: 'A small team keeps you part of the conversation, every month.',
    tag: 'A small pod of members stays active in the communities that matter to you, answers where you are relevant, and sends you a digest.',
    steps: [
      'List the communities that matter to you.',
      'A pod of members stays present there and joins in where you fit.',
      'You pay one monthly amount. Stop any month you like.',
    ],
    ex: '$300 a month keeps a pod present in 3 communities.',
    outcome: { label: 'Monthly retainer bid', unit: 'months of presence', per: 1, ph: '300' },
    gen: null,
    review: 'all',
    sample: { done: 1, target: 3, note: '3 communities covered' },
    fields: [
      { key: 'communities', label: 'Communities to cover', kind: 'textarea', ph: 'Subreddits, forums, or Discords.' },
      { key: 'cadence', label: 'Digest cadence', kind: 'select', options: ['Weekly', 'Bi-weekly', 'Monthly'], ph: 'How often we report back' },
    ],
  },
]

export const findType = (id: string | null) => CAMPAIGN_TYPES.find((t) => t.id === id) ?? null
