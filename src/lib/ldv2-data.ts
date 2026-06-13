// Live Demo Homepage (DS redesign) — content. The PM's copy kept verbatim (his funnel,
// his claims), brand-normalized: "Blue AI" → "BlueAI" (taste 19), curly quotes (taste 25).
// Workers carry BOTH the live agent scene (key) AND the PM's result chip (the receipt).

export const LDV2_STATS = [
  { n: 7.6, decimals: 1, suffix: 'M', label: 'run apps on BlueStacks' },
  { n: 4, decimals: 0, suffix: '', label: 'workers live today' },
  { n: 30, decimals: 0, suffix: '+', label: 'money-making skills' },
  { n: 100, decimals: 0, suffix: '%', label: 'of spends you approve' },
] as const

export const LDV2_WORKERS = [
  { key: 'creator', icon: '🎬', title: 'AI Video Creator', desc: 'Writes, generates, and posts faceless short videos to YouTube, TikTok, and Reels.', result: '📈 12,400 views in week one' },
  { key: 'career', icon: '💼', title: 'Apply to Jobs', desc: 'Searches LinkedIn overnight and matches real roles to your resume.', result: '✅ 3 replies, 1 interview booked' },
  { key: 'finance', icon: '📈', title: 'AI Trading Agent', desc: 'Runs paper portfolios and a daily brief on real US stocks. Data, not advice.', result: '📊 Momentum +13.2% since Apr 27' },
  { key: 'markets', icon: '🔮', title: 'Prediction Market Agent', desc: 'Scans Polymarket and compares the odds against the underlying data.', result: '🎯 Flagged 3 markets mispriced 8%+' },
] as const

export const LDV2_STEPS = [
  { t: 'Name your worker', d: 'Give it a name and a face. It is yours from here, and it remembers you.' },
  { t: 'It learns you, builds a plan', d: 'A short chat, then it proposes the 3 highest value money tasks for you.' },
  { t: 'Fund a budget you control', d: 'Set a monthly budget. It never spends a cent without your tap, unspent stays yours.' },
  { t: 'Download BlueAI', d: 'Install it on your PC. Your worker runs daily and reports the wins back to you.' },
] as const

export const LDV2_WHY = [
  { icon: '📱', t: 'Works in real apps', d: 'It taps and reads screens like a person, so it does not break when an app updates.' },
  { icon: '💻', t: 'Runs on your PC', d: 'No battery drain, no phone tied up. Run several workers at once inside BlueStacks.' },
  { icon: '✋', t: 'You stay in control', d: 'It never spends money or posts anything without your explicit tap to approve.', accent: true },
  { icon: '🧠', t: 'Gets better over time', d: 'It learns your apps, your accounts, and what actually pays off for you.' },
  { icon: '🛡️', t: '50% money-back guarantee', d: 'Not happy with the work in your first month? Get half your money back, no hassle.' },
  { icon: '⚡', t: 'Set up in minutes', d: 'Name it, answer a few questions, fund a budget. It starts on the fastest win.' },
] as const

export const LDV2_QUOTES = [
  { q: '“I named mine Penny and set a $50 budget. First week it found a cheaper renewal and stacked cashback. It already paid for itself.”', nm: 'Riya M.', rl: 'Online shopper', av: 'R', grad: 'linear-gradient(135deg,#8b5cf6,#d946ef)' },
  { q: '“It applied to 15 roles while I slept and lined up an interview. I just approved the ones I liked in the morning.”', nm: 'Daniel K.', rl: 'Job seeker', av: 'D', grad: 'linear-gradient(135deg,#3a6bff,#7a3cff)' },
  { q: '“The morning portfolio brief is the thing I open first now. It flags my earnings and risk before the market opens.”', nm: 'Aisha T.', rl: 'Retail investor', av: 'A', grad: 'linear-gradient(135deg,#13b16e,#0a8f86)' },
] as const

export const LDV2_NAV = [
  ['#workers', 'Workers'], ['#how', 'How it works'], ['#why', 'Why BlueAI'], ['#reviews', 'Reviews'],
] as const

export const LDV2_FOOTER = {
  blurb: 'AI workers that use real apps to make and save money for you, on your PC inside BlueStacks.',
  cols: [
    { head: 'Product', links: [['#workers', 'Workers'], ['#how', 'How it works'], ['#why', 'Why BlueAI'], ['#hire', 'Pricing']] },
    { head: 'Company', links: [['#', 'About'], ['#', 'Careers'], ['#', 'Blog'], ['#', 'Contact']] },
    { head: 'Legal', links: [['#', 'Privacy'], ['#', 'Terms'], ['#', 'Guarantee'], ['#', 'Security']] },
  ],
} as const
