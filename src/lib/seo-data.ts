// SEO Homepage content — copy extracted verbatim from the PM's SEO mock
// (mockup-homepage-seo). Centralized so the page markup stays thin and the FAQ
// JSON-LD can be generated from the same source as the visible accordion.

export const SEO_META = {
  title: 'BlueAI: A Personal Assistant App That Does Tasks for You',
  description:
    'BlueAI is an AI personal assistant that works like an AI worker. It opens apps, types, and finishes tasks for you. Free on PC.',
}

export const NAV_LINKS = [
  { label: 'What is BlueAI', href: '#what-is' },
  { label: 'Tasks', href: '#tasks' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
]

export const HERO = {
  eyebrow: 'A personal assistant app for Windows and Mac',
  h1: ['The AI assistant that ', 'finishes the job', ' for you.'] as const, // middle span = gradient
  subhead:
    'An AI assistant tells you what to do. BlueAI is an AI worker: it opens the apps, taps, types, and gets the task done while you watch. It runs inside BlueStacks on your PC today, and connects to your phone soon.',
  primaryCta: 'Download BlueAI for PC',
  secondaryCta: 'Watch a worker run live',
  microcopy: 'Free to download · Windows and Mac · You approve anything sensitive',
  agentsLabel: '4 agents live now. Watch them work.',
}

// The 4 hero agent cards reuse our animated legacy scenes (Career/Creator/Finance/Markets).
export const HERO_AGENTS = [
  { key: 'career', scene: 'CareerLegacy', eyebrow: 'Career', title: 'Apply to jobs', desc: 'Finds matching roles, fills each application, and submits across job boards. You review, it taps.' },
  { key: 'creator', scene: 'CreatorLegacy', eyebrow: 'Creator', title: 'A video creator', desc: 'Finds a trend, writes the script, builds the short, and posts it for you.' },
  { key: 'finance', scene: 'FinanceLegacy', eyebrow: 'Finance', title: 'AI trading agent', desc: 'Scans US markets daily with live agent portfolios you can watch. Data analysis, not advice.' },
  { key: 'markets', scene: 'MarketsLegacy', eyebrow: 'Markets', title: 'Prediction markets', desc: 'Tracks Polymarket and Kalshi odds and alerts you when they swing. Odds info, not advice.' },
] as const

export const WHAT_IS = {
  eyebrow: 'What is BlueAI',
  h2: 'What is BlueAI?',
  snippet:
    'BlueAI is an AI worker that completes tasks for you by using real mobile apps. Give it a task in plain language, and it picks the right skill, opens the app, and does the work: replying, posting, applying, booking. You review the result.',
  cards: [
    { icon: '⚡', title: 'A worker, not a chatbot', desc: 'It does not stop at a draft or a to-do list. BlueAI taps, types, scrolls, and finishes the task end to end, and you watch it happen.' },
    { icon: '🧩', title: 'Powered by skills', desc: 'Skills are tested, reusable abilities for one specific job in one app. They are why a run works the same way the tenth time as the first.' },
    { icon: '💻', title: 'On your PC today, your phone soon', desc: 'BlueAI runs inside BlueStacks on Windows and Mac and uses Android apps to do the work. Connecting your own phone is coming soon.' },
  ],
}

export const COMPARE = {
  eyebrow: 'Why it is different',
  h2: 'Chatbot, assistant, worker: know the difference',
  stages: [
    { tag: 'Stage 1', title: 'A chatbot talks', desc: 'It answers your question. The task is still 100% yours to do.' },
    { tag: 'Stage 2', title: 'An assistant drafts', desc: 'It writes the reply or the plan. You still open the app and do the doing.' },
    { tag: 'Stage 3 · BlueAI', title: 'A worker finishes', desc: 'BlueAI opens the app and completes the task itself. The only thing left for you is the review.', highlight: true },
  ],
}

export const TASKS = {
  eyebrow: 'Tasks',
  h2: 'What can your AI assistant do today?',
  subhead: 'One killer task per skill. Pick a job, hand it off, and review the result.',
  cards: [
    { icon: '💬', title: 'Auto-reply to messages', desc: 'Triages WhatsApp and Instagram, drafts every reply in your tone, sends the ones you approve.', slug: '/auto-reply-messages' },
    { icon: '✍️', title: 'Generate captions', desc: 'Turns a photo or an idea into ready-to-post captions and hashtags, then posts for you.', slug: '/generate-captions' },
    { icon: '💼', title: 'Apply to jobs', desc: 'Finds matching roles, fills each application, and submits across job boards. You review, it taps.', slug: '/apply-to-jobs', live: true },
    { icon: '🗓️', title: 'Schedule social posts', desc: 'Plans the week, writes the posts, and queues them across your accounts.', slug: '/schedule-social-posts' },
    { icon: '🖼️', title: 'Edit photos', desc: 'Prompt-based edits inside real editing apps, saved straight back to your library.', slug: '/edit-photos' },
    { icon: '📅', title: 'Book appointments', desc: 'Finds the slot, fills the form, and confirms the booking for you.', slug: '/book-appointments' },
    { icon: '🧵', title: 'Summarize chats', desc: 'One digest of every group chat, channel, and inbox you fell behind on.', slug: '/summarize-chats' },
    { icon: '🛠️', title: 'Build your own', desc: 'Describe any task in plain language and turn it into a reusable skill. No code.', slug: '#', cta: 'Create a skill' },
  ],
}

export const STEPS = {
  eyebrow: 'How it works',
  h2: 'From "do this" to done in four steps',
  steps: [
    { n: 1, title: 'Tell it the task', desc: 'Type what you want done, in plain language. No setup, no flowcharts.' },
    { n: 2, title: 'It picks a skill', desc: 'BlueAI matches your task to a tested skill from the library, built for that exact job.' },
    { n: 3, title: 'It does the work', desc: 'The worker opens the app, taps, types, and completes every step while you watch.' },
    { n: 4, title: 'You review', desc: 'See exactly what was done. Anything sensitive waits for your approval first.' },
  ],
  safety: 'BlueAI always confirms before anything destructive: payments, account changes, deletions.',
}

export const FAQ = {
  eyebrow: 'FAQ',
  h2: 'Questions about your AI assistant, answered',
  items: [
    { q: 'What is BlueAI?', a: 'BlueAI is an AI worker that completes tasks for you by using real mobile apps. Give it a task in plain language and it picks the right skill, opens the app, and does the work: replying, posting, applying, booking. You review the result. It runs inside BlueStacks on Windows and Mac.' },
    { q: 'Is BlueAI an AI assistant or an AI agent?', a: 'Both terms fit, but "AI worker" is the most precise. A typical AI assistant drafts and suggests; BlueAI goes further and operates real apps to finish the task, with you approving anything sensitive.' },
    { q: 'What is an AI worker?', a: 'An AI worker is an agent that completes a job end to end inside real apps — opening them, tapping, typing, and submitting — instead of only answering questions or writing drafts.' },
    { q: 'What devices does BlueAI run on?', a: 'BlueAI runs inside BlueStacks on Windows and Mac today and uses real Android apps to do the work. Connecting your own phone is coming soon.' },
    { q: 'How does BlueAI complete a task?', a: 'You describe the task in plain language. BlueAI matches it to a tested skill, opens the right app, and completes every step while you watch. You review the result before anything sensitive is finalized.' },
    { q: 'Is BlueAI free?', a: 'Yes — BlueAI is free to download on Windows and Mac.' },
    { q: 'Is it safe to let BlueAI use my apps?', a: 'You watch every run and approve anything sensitive. BlueAI always confirms before destructive actions like payments, account changes, or deletions.' },
  ],
}

export const CLOSE = {
  h2: 'Stop doing the busywork. Start reviewing it.',
  sub: 'Hand your first task to an AI worker today. Free on Windows and Mac, inside BlueStacks.',
  cta: 'Download BlueAI for PC',
}

export const FOOTER = {
  tagline: 'An AI worker by Now.gg, Inc.',
  cols: [
    { head: 'Live agents', links: ['Apply to jobs', 'AI video creator', 'AI trading agent', 'Prediction market agent'] },
    { head: 'Tasks', links: ['Auto-reply to messages', 'Generate captions', 'Apply to jobs', 'Schedule social posts'] },
    { head: 'Learn', links: ['What is BlueAI', 'FAQ', 'What is AI automation'] },
    { head: 'Company', links: ['BlueStacks', 'now.gg'] },
  ],
}
