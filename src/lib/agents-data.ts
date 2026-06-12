// Shared data for the 4 BlueAI agent pages (bluestacks.ai). Copy is from the live pages.
export type Agent = { slug: string; icon: string; label: string; title: string; ic: string }
export const AGENTS: Record<string, Agent> = {
  career:  { slug: 'apply-to-jobs',            icon: '💼', label: 'Career',  title: 'Auto apply to jobs',        ic: 'ic-career' },
  creator: { slug: 'ai-video-creator',         icon: '🎬', label: 'Creator', title: 'A faceless video creator',  ic: 'ic-creator' },
  finance: { slug: 'ai-trading-agent',         icon: '📈', label: 'Finance', title: 'An AI trading agent',       ic: 'ic-finance' },
  markets: { slug: 'prediction-market-agent',  icon: '🎯', label: 'Markets', title: 'A prediction market agent', ic: 'ic-markets' },
}

export type AgentData = {
  key: keyof typeof AGENTS
  eyebrow: string
  h1: [string, string, string] // [pre, gradient, post]
  sub: string
  disclaimer?: string
  whatIsHeading?: string
  whatIs?: string[]
  seoBlocks?: { h: string; p: string }[]
  hiwHeading?: string
  hiw: { t: string; d: string }[]
  faq: { q: string; a: string }[]
  cta: { h: string; sub: string; btn: string }
}

export const CAREER: AgentData = {
  key: 'career',
  eyebrow: 'BlueAI Agent · Job Search',
  h1: ['Auto apply to jobs with an ', 'AI agent', ' that does the clicking'],
  sub: 'Tell us the roles you want. Our agent searches Indeed, LinkedIn and company sites and emails you matching openings. Want it to apply for you? Download BlueAI.',
  whatIsHeading: 'What is an AI job application agent?',
  whatIs: [
    'An AI job application agent applies to jobs the way a person would: it opens a job app, reads a listing, decides if it fits your criteria, fills in the form, answers the screening questions, and submits. BlueAI is a real agent that runs inside an Android session, so it operates the actual Indeed, LinkedIn and company career apps on screen rather than scraping a website or calling an API that can break.',
  ],
  seoBlocks: [
    { h: 'Which job boards does it work with?', p: 'Because BlueAI drives the real app on screen, it works with any job platform that runs on Android, not just the ones that expose an API. It starts with Indeed, then LinkedIn, including multi-step external applications, then company career portals that open in the in-app browser.' },
    { h: 'Is it safe for my accounts?', p: 'When you run it yourself, BlueAI acts inside your own logged-in session and never hands your data to a third party. You stay in control: approve each submit, set a daily cap, and stop the run any time. It applies only to roles that match your criteria, so it does not mass-spam, which protects your standing with recruiters.' },
    { h: 'Will it tailor my resume and answers to each job?', p: 'Yes. The AI job application worker reads each job description and adjusts your professional summary, the skills it highlights, and the answers to free-text screening questions so they match what the listing asks for. It works from the resume and profile you provide, so the facts stay yours and only the emphasis changes per role. You can review every tailored application before it is sent.' },
    { h: 'How is this different from a Chrome extension or Easy Apply bot?', p: 'Most extensions and LinkedIn Easy Apply bots only work on one site and break the moment the page layout changes. BlueAI is a general agent: it sees the screen, plans its next step, and recovers from errors, so it handles the messy multi-step external applications that one-click bots cannot, across Indeed, LinkedIn and company career portals rather than just one.' },
    { h: 'How many jobs can it apply to in a day?', p: 'You set the cap. Many people run 20 to 40 tailored applications a day, far more than is realistic by hand but well below the volume that gets accounts flagged. We recommend a daily limit and review-before-submit on at least the first batch, so you can confirm the quality before letting it run on its own.' },
    { h: 'What do I need, and how much does it cost?', p: 'Getting matches by email is free. To run the agent yourself you need BlueAI on BlueStacks (a real phone is coming soon), your resume, your logins for the job apps you want to use, and an LLM of your choice plugged in once. You pay only for the tokens each run uses, and new accounts start with free credits.' },
  ],
  hiw: [
    { t: 'Tell us your targets', d: 'Roles, locations, and seniority. Add a resume to sharpen the match.' },
    { t: 'We run the agent', d: 'The agent searches Indeed, LinkedIn and company sites for live roles that fit.' },
    { t: 'Matches by email', d: 'You get a shortlist with apply links, sent to your inbox.' },
    { t: 'Apply on autopilot', d: 'Download BlueAI to have the agent fill and submit applications for you.' },
  ],
  faq: [
    { q: 'What is an AI job application agent?', a: 'An AI job application agent applies to jobs the way a person would — it opens a job app, reads a listing, decides if it fits, fills in the form, answers screening questions, and submits. BlueAI runs inside a real Android session and operates the actual apps on screen.' },
    { q: 'Can AI really auto apply to jobs for me?', a: 'Yes. BlueAI reads each listing, tailors your answers, fills the form and submits — just like a person. You approve each submit, set a daily cap, and can stop a run any time.' },
    { q: 'Which job boards does it work with?', a: 'Because BlueAI drives the real app on screen, it works with any job platform that runs on Android, not just the ones that expose an API. It starts with Indeed, then LinkedIn — including multi-step external applications — then company career portals that open in the in-app browser.' },
    { q: 'Will it tailor my resume and answers to each job?', a: 'Yes. The agent reads each job description and adjusts your professional summary, the skills it highlights, and your free-text screening answers to match the listing. It works from the resume and profile you provide, so the facts stay yours and only the emphasis changes per role. You can review every tailored application before it is sent.' },
    { q: 'How is this different from a Chrome extension or LinkedIn Easy Apply bot?', a: 'Most extensions and Easy Apply bots only work on one site and break the moment the layout changes. BlueAI is a general agent: it sees the screen, plans its next step, and recovers from errors, so it handles the messy multi-step external applications that one-click bots cannot — across Indeed, LinkedIn and company career portals.' },
    { q: 'How many jobs can it apply to in a day?', a: 'You set the cap. Many people run 20 to 40 tailored applications a day — far more than is realistic by hand, but well below the volume that gets accounts flagged. We recommend a daily limit and review-before-submit on the first batch.' },
    { q: 'Is auto applying to jobs safe for my accounts?', a: 'When you run it yourself, BlueAI acts inside your own logged-in session and never hands your data to a third party. You stay in control: approve each submit, set a daily cap, and stop the run any time. It applies only to roles that match your criteria, so it does not mass-spam.' },
    { q: 'Do you apply on my behalf, and how much does it cost?', a: 'Getting matches by email is free. To run the agent yourself you need BlueAI on BlueStacks (a real phone is coming soon), your resume, your logins for the job apps, and an LLM of your choice plugged in once. You pay only for the tokens each run uses, and new accounts start with free credits.' },
  ],
  cta: { h: 'Stop filling out the same form', sub: 'Let BlueAI search, tailor and apply while you focus on the interviews.', btn: 'Get BlueAI free' },
}

export const CREATOR: AgentData = {
  key: 'creator',
  eyebrow: 'BlueAI Agent · Creator',
  h1: ['An ', 'AI video creator', ' for faceless YouTube channels'],
  sub: 'Describe the video you want. The agent scripts it, generates the visuals and voiceover, captions and edits it, and emails you a link to the finished short. Faceless shorts, reels and micro dramas.',
  seoBlocks: [
    { h: 'What is a micro drama, and can AI make one?', p: 'A micro drama is a short, episodic story told in vertical clips, the format powering the fast-growing short-drama apps. Most AI video tools can only stitch stock footage over a voiceover. BlueAI can also generate character-driven micro dramas, scripted scene by scene and posted as a series, so the same agent that runs a faceless facts channel can run a serialized drama channel.' },
    { h: 'How do I make a faceless YouTube channel with AI?', p: 'Set a channel theme and a posting schedule once. When you run BlueAI yourself, it produces each video end to end and uploads it from inside the YouTube app on a device you control, so the channel keeps publishing without you filming or editing. One AI video worker does the script, the visuals, the voiceover, the edit and the upload, so you skip the usual five-tool stack.' },
    { h: 'Does it post and schedule to YouTube, TikTok and Instagram?', p: 'Yes. Each video is reformatted and posted to YouTube Shorts, TikTok and Instagram Reels, with the caption and hashtags tuned per platform, on the schedule you set. BlueAI posts from inside each native app, so every short-form format is supported and you are not limited by what a posting API allows. This is YouTube and TikTok automation handled by the same agent that made the video.' },
    { h: 'What is YouTube automation?', p: 'YouTube automation means running a channel where production and posting are handled by tools or agents rather than filmed by hand. BlueAI is an end-to-end version: it creates the videos and posts them, so the channel runs on the schedule you set instead of demanding daily editing.' },
    { h: 'Does a faceless YouTube channel make money?', p: 'Faceless channels can earn through ads, sponsorships and affiliate links once they meet a platform’s monetization bar, the same as any channel. Results vary widely and depend on niche, consistency and quality, with no guarantees. Where BlueAI helps is consistency: it keeps producing and posting on a schedule, which is the part most faceless channels stall on.' },
    { h: 'Is AI-generated content allowed on YouTube, TikTok and Instagram?', p: 'Faceless and AI-assisted content is allowed. Platforms do require videos to be original and add value, and some ask creators to disclose synthetic or altered media. BlueAI helps you produce original, on-theme videos, and you stay responsible for following each platform’s current content and disclosure policies.' },
    { h: 'How much does it cost to make AI videos?', p: 'Submitting a request here is free. When you run BlueAI yourself, you bring your own LLM and pay only for the tokens and generation each run uses, routed through BlueAI. Producing a short costs a small number of credits, and new accounts start with free credits to try it.' },
  ],
  hiwHeading: 'How does it make AI videos?',
  hiw: [
    { t: 'You describe it', d: 'A topic or channel theme, the style, the platforms, and how long.' },
    { t: 'It creates the video', d: 'Scripts, generates visuals and voiceover, captions and edits to a proven template.' },
    { t: 'You get a link', d: 'We email you the finished video to review before it goes anywhere.' },
    { t: 'Run the channel', d: 'Download BlueAI to have the agent post and repeat on a schedule you set.' },
  ],
  faq: [
    { q: 'How does the AI video creator make videos?', a: 'It scripts the video, generates the visuals and voiceover, captions and edits to a proven template, then emails you a link to review. Download BlueAI to have it upload and repeat on the schedule you set.' },
    { q: 'What can the BlueAI video creator make?', a: 'Faceless shorts (space, history, finance and science), reels and TikToks tuned per platform, and character-driven micro dramas — the hook most AI video tools cannot do.' },
    { q: 'How do I make a faceless YouTube channel with AI?', a: 'Set a channel theme and a posting schedule once. When you run BlueAI yourself, it produces each video end to end and uploads it from inside the YouTube app on a device you control, so the channel keeps publishing without you filming or editing. One agent does the script, visuals, voiceover, edit and upload.' },
    { q: 'Does it post and schedule to YouTube, TikTok and Instagram?', a: 'Yes. Each video is reformatted and posted to YouTube Shorts, TikTok and Instagram Reels, with the caption and hashtags tuned per platform, on the schedule you set. BlueAI posts from inside each native app, so every short-form format is supported.' },
    { q: 'What is YouTube automation?', a: 'Running a channel where production and posting are handled by tools or agents rather than filmed by hand. BlueAI is an end-to-end version: it creates the videos and posts them, so the channel runs on the schedule you set instead of demanding daily editing.' },
    { q: 'What is a micro drama, and can AI make one?', a: 'A micro drama is a short, episodic story told in vertical clips — the format powering the fast-growing short-drama apps. Most AI video tools can only stitch stock footage over a voiceover; BlueAI can also generate character-driven micro dramas, scripted scene by scene and posted as a series.' },
    { q: 'Does a faceless YouTube channel make money?', a: 'Faceless channels can earn through ads, sponsorships and affiliate links once they meet a platform’s monetization bar, like any channel. Results vary widely and depend on niche, consistency and quality. Where BlueAI helps is consistency — it keeps producing and posting on a schedule.' },
    { q: 'Is AI-generated content allowed on YouTube, TikTok and Instagram?', a: 'Faceless and AI-assisted content is allowed. Platforms require videos to be original and add value, and some ask creators to disclose synthetic media. BlueAI helps you produce original, on-theme videos, and you stay responsible for following each platform’s policies.' },
    { q: 'How much does it cost to make AI videos?', a: 'Submitting a request here is free. When you run BlueAI yourself, you bring your own LLM and pay only for the tokens and generation each run uses. Producing a short costs a small number of credits, and new accounts start with free credits.' },
  ],
  cta: { h: 'Launch a channel that runs itself', sub: 'Describe it once. BlueAI makes the videos and posts them, every day, on every platform.', btn: 'Get BlueAI free' },
}

export const FINANCE: AgentData = {
  key: 'finance',
  eyebrow: 'BlueAI Agent · Markets',
  h1: ['An ', 'AI trading agent', ' that runs live market analysis'],
  sub: 'Upload a screenshot or report of your holdings, or ask about any US stock. The agent pulls live market data, runs the numbers, and emails you a clear breakdown.',
  disclaimer: 'Data analysis for education only, not investment advice. The agent does not place trades or recommend buying or selling any security.',
  whatIsHeading: 'What is an AI trading agent?',
  whatIs: ['An AI trading agent reads markets the way an analyst would: it pulls live US market data, runs momentum, RSI, ADX, volatility and 52-week-high readings across your holdings or any ticker, and explains what the numbers show — position by position. BlueAI runs as a real agent operating the apps on a device you control, so it works from live data, not a stale snapshot. It reports and explains the data for education only; it does not place trades or tell you what to buy or sell.'],
  seoBlocks: [
    { h: 'What data and indicators does it use?', p: 'It works from live US market data: price and trend, 12-month momentum, RSI and ADX, distance from the 52-week high, volatility compression, and relative volume. For a portfolio it reads each position and rolls them up. It surfaces descriptive readings, what is trending, what is extended, what is compressing, not buy or sell signals.' },
    { h: 'Which US stocks and markets does it cover?', p: 'US-listed equities across the major exchanges, large-cap through small and mid-cap, including the AI and semiconductor names many portfolios hold today. You can point it at a single ticker, a watchlist, or your whole portfolio.' },
    { h: 'Is AI trading legit, legal and safe?', p: 'Using AI to analyze markets is legal and increasingly common. What matters is the line the agent stays on: BlueAI provides data analysis for education, it does not give investment advice and it does not execute trades. Your uploaded holdings go to private storage, are used only to produce your analysis, and are never sold or shared. You stay in control of every decision.' },
    { h: 'How to build your own AI trading agent, no coding required', p: 'Download BlueAI and describe, in plain language, the market or watchlist you want analyzed. The AI trading worker pulls the live data and runs the analysis on a schedule you set, no code and no API wiring. It is the same agent behind this page, pointed at your own tickers instead of ours.' },
    { h: 'Is this financial advice?', p: 'No. Everything here is market-data analysis for information and education only. It is not investment advice, not a recommendation to buy or sell any security, and not a solicitation. BlueAI does not place trades. Past performance and momentum readings do not predict future results. Always do your own research or talk to a licensed advisor.' },
  ],
  hiwHeading: 'From holdings to inbox',
  hiw: [
    { t: 'Upload or ask', d: 'Send a screenshot or report of your holdings, or ask about any US stock.' },
    { t: 'It pulls live data', d: 'Prices, momentum, RSI, ADX, distance from 52-week highs, volume and compression.' },
    { t: 'It runs the numbers', d: 'A clear, plain-language breakdown of what the data shows, position by position.' },
    { t: 'You get it by email', d: 'The full analysis lands in your inbox. Data only, no buy or sell calls.' },
  ],
  faq: [
    { q: 'What is an AI trading agent?', a: 'It pulls live US market data, runs the numbers across your holdings or any ticker, and explains what the data shows position by position. It reports descriptive readings for education only — it does not place trades or tell you what to buy or sell.' },
    { q: 'How does AI trading and AI stock analysis work?', a: 'It works from live US market data — price and trend, 12-month momentum, RSI and ADX, distance from the 52-week high, volatility compression and relative volume. For a portfolio it reads each position and rolls them up, surfacing what is trending, extended or compressing — not buy or sell signals.' },
    { q: 'Does it tell me what to buy or sell?', a: 'No. BlueAI provides data analysis for education only. It surfaces descriptive readings, never buy or sell calls, and it does not execute trades.' },
    { q: 'Is AI trading legit, legal and safe?', a: 'Using AI to analyze markets is legal and increasingly common. BlueAI provides data analysis for education — it does not give investment advice and does not execute trades. Your uploaded holdings go to private storage, are used only to produce your analysis, and are never sold or shared.' },
    { q: 'Can I just upload a screenshot of my portfolio?', a: 'Yes. A broker screenshot, a portfolio export, or a PDF statement all work — the agent reads each position and rolls them up into one analysis.' },
    { q: 'Which stocks and markets does it cover?', a: 'US-listed equities across the major exchanges, large-cap through small and mid-cap, including the AI and semiconductor names many portfolios hold today. Point it at a single ticker, a watchlist, or your whole portfolio.' },
    { q: 'How do I build my own AI trading agent, no coding?', a: 'Download BlueAI and describe, in plain language, the market or watchlist you want analyzed. It pulls the live data and runs the analysis on a schedule you set — no code and no API wiring.' },
    { q: 'Is it free, and what does it cost?', a: 'Getting an analysis by email is free. To run the agent yourself you bring your own LLM and pay only for the tokens each run uses; new accounts start with free credits.' },
  ],
  cta: { h: 'Put the number-crunching on autopilot', sub: 'Run live market analysis on your own watchlist, every day, with BlueAI.', btn: 'Get BlueAI free' },
}

export const MARKETS: AgentData = {
  key: 'markets',
  eyebrow: 'BlueAI Agent · Prediction Markets',
  h1: ['A ', 'prediction market agent', ' that watches the odds for you'],
  sub: 'Point it at Polymarket and Kalshi markets, including the 2026 World Cup, and the agent reads the live odds, tracks every move, and emails you the moment an outcome swings past your threshold.',
  disclaimer: 'Prediction markets involve real money and risk. The agent reads and explains odds for information only. It does not place bets, and it does not tell you what to bet.',
  whatIsHeading: 'What is a prediction market agent?',
  whatIs: ['A prediction market agent reads markets like Polymarket and Kalshi the way a person would: it opens the market, reads the current price and implied probability for each outcome, and tracks how they move over time. BlueAI runs as a real agent that operates the apps on a device you control, so it works from the live market rather than a stale snapshot. It reports the odds and explains them; it does not place bets and it does not tell you what to bet.'],
  seoBlocks: [
    { h: 'Which markets does it watch?', p: 'Any market on Polymarket or Kalshi that you can access: the 2026 World Cup winner, group winners, golden boot, individual match markets, plus the wider world of politics, economics and culture markets. Point it at a single market or a whole watchlist. For the World Cup it reads the implied probability for every team and tracks how the field moves through the tournament.' },
    { h: 'Polymarket vs Kalshi, what is the difference?', p: 'Both are prediction markets where a price reflects the implied probability of an outcome. Kalshi is a US-regulated (CFTC) exchange; Polymarket is a large crypto-settled market that has faced US access restrictions. The same outcome can be priced a little differently on each, and the agent reads both and surfaces the gap. It reports that difference as data so you can see where the two venues disagree, never as a bet to place.' },
    { h: 'Is it legal and safe to use?', p: 'Reading and analyzing public market odds is information, and that is all this agent does by default. Whether you can use a given prediction market depends on where you are: access to some markets, including Polymarket, is restricted for US users, while Kalshi is US-regulated. The agent only reads markets you can already access on your own device, never tries to bypass a platform’s location rules, and never creates accounts, deposits funds, or places bets. You stay in control of every decision.' },
    { h: 'How to build your own prediction market watchlist, no coding required', p: 'Download BlueAI and name, in plain language, the markets you want watched and when to alert you. The agent reads the live odds and tracks them on a schedule you set, no code and no API wiring. It is the same agent behind this page, pointed at your own watchlist instead of ours.' },
    { h: 'Is this betting advice?', p: 'No. Everything here is prediction-market odds and analysis for information and education only. It is not betting advice, not a recommendation to place any bet, and not a solicitation. BlueAI does not place bets. Prediction markets involve real money and risk, access is restricted in some places, and past odds do not predict outcomes. Use only markets that are legal and available where you are, and only ever risk what you can afford to lose.' },
  ],
  hiwHeading: 'From markets to alerts',
  hiw: [
    { t: 'Pick your markets', d: 'Name the markets to watch: World Cup 2026 winner, a group, a match, or any Polymarket or Kalshi market.' },
    { t: 'It reads the live odds', d: 'The agent opens each market and reads the current price and implied probability for every outcome.' },
    { t: 'It tracks every move', d: 'It compares against the last reading and watches for swings past the threshold you set.' },
    { t: 'You get an alert', d: 'A clear summary and an alert land in your inbox. Odds and context only, no bets and no tips.' },
  ],
  faq: [
    { q: 'What is a prediction market agent?', a: 'It reads markets like Polymarket and Kalshi the way a person would — opens the market, reads the price and implied probability for each outcome, and tracks how they move. It reports and explains the odds; it does not place bets or tell you what to bet.' },
    { q: 'Can it track World Cup 2026 odds on Polymarket?', a: 'Yes. Point it at the 2026 World Cup winner market and it reads the implied probability for every team, tracking how the field moves through the tournament — on Polymarket, Kalshi, or both.' },
    { q: 'Does it compare Polymarket and Kalshi?', a: 'Yes. The same outcome can be priced a little differently on each venue; the agent reads both and surfaces the gap as descriptive data so you can see where they disagree — never as a bet to place.' },
    { q: 'Does it place bets for me?', a: 'No. BlueAI reads and explains odds for information only. It never places bets, creates accounts, or deposits funds — you stay in control of every decision.' },
    { q: 'Is it legal to use Polymarket in the US?', a: 'Access to some markets, including Polymarket, is restricted for US users, while Kalshi is US-regulated (CFTC). The agent only reads markets you can already access on your own device and never tries to bypass a platform’s location rules.' },
    { q: 'How fast does it catch an odds swing?', a: 'It re-reads on the schedule you set and compares against the last reading, so it flags a swing past your threshold on the next pass and emails you a clear summary.' },
    { q: 'How do I build my own prediction market watchlist agent?', a: 'Download BlueAI and name, in plain language, the markets you want watched and when to alert you. The agent reads the live odds and tracks them on a schedule you set — no code and no API wiring.' },
    { q: 'Is it free, and what does it cost?', a: 'Getting alerts by email is free. To run the agent yourself you bring your own LLM and pay only for the tokens each run uses; new accounts start with free credits.' },
  ],
  cta: { h: 'Never miss an odds swing again', sub: 'Watch your own prediction markets through the whole World Cup, and beyond, with BlueAI.', btn: 'Get BlueAI free' },
}
