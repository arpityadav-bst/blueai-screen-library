// Homepage content — ported verbatim from the Claude-design export
// (homepage-sections.html). Design-only mock copy.

export type Feature = { num: number; cat: string; title: string; desc: string; quote: string; img: string }

export const FEATURES: Feature[] = [
  { num: 1, cat: 'Search', title: 'Find anything across your apps.', desc: 'Search messages, emails, files, game guides, redeem codes, and answers — all in one place.', quote: 'Find the latest codes for this game.', img: '/feat-search.png' },
  { num: 2, cat: 'Shop', title: 'Compare prices in one glance.', desc: 'Check deals, compare options, and find better choices across supported apps and sites.', quote: 'Compare these prices for me.', img: '/feat-shop.png' },
  { num: 3, cat: 'DM', title: 'Reply faster, in your tone.', desc: 'Draft messages, clean up replies, and respond faster without switching around apps.', quote: 'Reply that I’ll send it today.', img: '/feat-dm.png' },
  { num: 4, cat: 'Play', title: 'Level up your game.', desc: 'Launch games, find tips, check events, and claim available rewards without leaving play.', quote: 'Check rewards and new events.', img: '/feat-play.png' },
  { num: 5, cat: 'Catch up', title: 'Get the gist in seconds.', desc: 'Summarize updates from chats, communities, creators, notifications, and pages you missed.', quote: 'Catch me up today.', img: '/feat-catchup.png' },
]

export type Skill = { icon: string; iconBg: string; cat: string; featured?: boolean; title: string; desc: string; rating: string; count: string }

export const SKILLS: Skill[] = [
  { icon: '💬', iconBg: '#e6eeff', cat: 'Productivity', featured: true, title: 'Catch up on every chat in 30 seconds', desc: 'Scans unread messages across WhatsApp, Telegram, Signal, Messenger & Instagram and surfaces only what needs you — with ready-to-send replies.', rating: '4.8', count: '5.5k' },
  { icon: '🧭', iconBg: '#ebe6ff', cat: 'Gaming', featured: true, title: 'Never get stuck on a quest again', desc: 'Searches any quest, reads the AI overview and best guide site, pulls the top Reddit tip, and hands you a 3-line strategy — without leaving your game.', rating: '4.7', count: '2.4k' },
  { icon: '📖', iconBg: '#ebe6ff', cat: 'Gaming', title: 'Instant guides for any game you play', desc: 'A universal game companion — strategies, full clear guides, community threads and video info for any game, while you play.', rating: '4.5', count: '1.6k' },
  { icon: '📊', iconBg: '#ebe6ff', cat: 'Gaming', title: 'A one-page brief on any mobile game', desc: 'Combines Medium long-form, Game8/GameWith/Fandom and recent patch notes into a single intel brief — saved as a PDF.', rating: '4.6', count: '980' },
  { icon: '⏰', iconBg: '#ebe6ff', cat: 'Gaming', title: 'Never miss a limited-time event', desc: 'One digest of every time-limited event across all your installed games, sorted by urgency — ends today, this week, or later.', rating: '4.7', count: '1.3k' },
  { icon: '🎁', iconBg: '#ebe6ff', cat: 'Gaming', title: 'Auto-claim daily game rewards', desc: 'Opens your games one by one and collects daily login rewards, bonus chests, free spins, hourly coins, and any timed in-game reward.', rating: '4.6', count: '2.8k' },
  { icon: '🎮', iconBg: '#ebe6ff', cat: 'Gaming', title: 'Run your daily game routine', desc: 'A single profile-driven loop across Whiteout Survival, Evony, RAID, Summoners War, and Roblox. Claims rewards and runs one safe auto-battle loop.', rating: '4.5', count: '1.9k' },
  { icon: '🎟️', iconBg: '#ebe6ff', cat: 'Gaming', title: 'Redeem every gift code automatically', desc: 'Detects installed games, scrapes gift codes from official and trusted sources, and redeems them in-game or via web — skipping any used or invalid codes.', rating: '4.6', count: '1.4k' },
  { icon: '🎨', iconBg: '#ffe4f1', cat: 'Creative', featured: true, title: 'Generate AI images in under a minute', desc: 'AI image generation inside BlueAI — no browser or API key. Refines the prompt, picks the right model and dimensions, and saves straight to your library.', rating: '4.8', count: '2.1k' },
  { icon: '🔍', iconBg: '#e6eeff', cat: 'Productivity', featured: true, title: 'Find anything across your apps', desc: 'Sweeps WhatsApp, Telegram, Instagram, Discord, Reddit, and Gmail at once — surfacing exactly what you half-remember, without leaving your PC.', rating: '4.9', count: '4.3k' },
  { icon: '👗', iconBg: '#dcf4f5', cat: 'Explore', title: 'Outfit ideas for any occasion', desc: 'Suggests 2-3 outfit directions for an occasion using Pinterest and Instagram inspiration, then delivers 4 images per outfit — references and on-person visuals.', rating: '4.6', count: '1.1k' },
  { icon: '📰', iconBg: '#e7e9ff', cat: 'Social', title: 'Daily creator digest from people you follow', desc: 'Follows people, not feeds. Checks each creator’s YouTube and blog activity from the last week and produces a 30-second read.', rating: '4.5', count: '820' },
  { icon: '🎬', iconBg: '#e7e9ff', cat: 'Social', title: 'Reshape your Instagram Reels feed', desc: 'Shifts your Reels recommendations toward any topic in ~10 minutes using watch-time, Like, Save, and Not Interested signals — with a measurable match score.', rating: '4.4', count: '760' },
  { icon: '🎮', iconBg: '#dcf4f5', cat: 'Explore', title: 'Claim free & discounted games daily', desc: 'Claims free or temporarily discounted games from the Google Play promotional collection and downloads them straight to BlueStacks.', rating: '4.7', count: '1.1k' },
  { icon: '✨', iconBg: '#e6eeff', cat: 'Productivity', title: 'Create new skills just by chatting', desc: 'Describe what you want BlueAI to do in plain language and turn it into a reusable skill — no code, no setup, no marketplace wait.', rating: '4.8', count: '2.6k' },
]
