// Data for the overhauled AI Video Creator landing (/ai-video-creator) — a creative-tool
// "studio" page (invideo / Nim / Higgsfield-style) on the blueAI light DS. Design-only:
// the prompt + generation are mocked. Gallery tiles use brand-tinted placeholders + our own
// 3 videos (public/videos) — swap for real BlueAI assets later. Tints are Tier-3 decorative.

export const CREATOR_HERO = {
  eyebrow: 'AI Video Creator',
  title: ['Create a video in ', 'one shot'] as const, // 2nd part gets the gradient
  sub: 'Describe it in any language — BlueAI scripts, generates, voices, captions and posts it. Up to 30 minutes, end to end.',
  // Typewriter examples — typed out and cleared in a loop in the hero prompt (reduced-motion → first one, static).
  examples: [
    'Create a faceless video about chasing a bike dream',
    'Make an Appy Fizz ad for Instagram',
    'A 3-part mafia micro-drama about a betrayal',
    '5 mind-blowing space facts as a faceless short',
    'Explain how a black hole works in 60 seconds',
    'Turn my newsletter into a TikTok',
  ] as const,
}

// Art-style picker in the hero — the look BlueAI renders in (design-only). `value` = the style name
// shown in the trigger + tagged on each generation; `hint` = a short descriptor. (Sparkle on the trigger.)
// Style is a generation-time choice (lives in the bar); music/SFX/captions are auto/post-production.
export const HERO_STYLES = [
  { value: 'Cinematic', hint: 'Filmic, graded' },
  { value: 'Anime', hint: 'Hand-drawn 2D' },
  { value: '3D animation', hint: 'Pixar-style' },
  { value: 'Cel-shaded', hint: 'Bold outlines' },
  { value: 'Claymation', hint: 'Stop-motion' },
  { value: 'Realistic', hint: 'Photoreal' },
] as const

// Aspect-ratio picker in the hero — sets the output format/platform (design-only). value = the
// canonical key shown in the trigger; label = the friendly name; hint = the ratio. (Icons in the hero.)
export const HERO_ASPECTS = [
  { value: 'Auto', label: 'Auto', hint: '' },
  { value: '9:16', label: 'Story', hint: '9:16' },
  { value: '1:1', label: 'Square', hint: '1:1' },
  { value: '16:9', label: 'Widescreen', hint: '16:9' },
] as const

// Quick-start format pills under the prompt — clicking one drops its `prompt` into the field.
export const HERO_PILLS = [
  { icon: '🎬', label: 'AI short', prompt: 'Create a snappy 30-second AI short on a trending topic' },
  { icon: '👻', label: 'Faceless video', prompt: 'Create a faceless video about chasing a bike dream' },
  { icon: '🎭', label: 'Micro-drama', prompt: 'A 3-part mafia micro-drama about a betrayal' },
  { icon: '📣', label: 'UGC ad', prompt: 'Make a UGC-style ad for Appy Fizz for Instagram' },
  { icon: '🧠', label: 'Explainer', prompt: 'Explain how a black hole works in 60 seconds' },
  { icon: '📄', label: 'Use my script', prompt: 'Paste your script and BlueAI will produce the video' },
] as const

// Format example galleries — auto-scrolling rows. `video` = one of our own clips (poster shown),
// else `tint` renders a brand-duotone placeholder tile with the title overlaid.
// `video` = the poster/clip slug (poster at /videos/<slug>.jpg always; tint stays as the
// fallback beneath it). `clip: true` means a /videos/<slug>.mp4 exists → the tile plays on hover.
// Sample gallery cards. `prompt` = the example prompt that "made" this clip (shown + copyable in the
// sample popup). `clip: true` = a real /videos/<slug>.mp4 plays on hover; the rest are poster stills.
type Card = { title: string; meta: string; tint?: string; video?: string; clip?: boolean; prompt: string }

export const SHORTS: Card[] = [
  { title: 'He Thought He Bought His Bride', meta: 'Micro-drama · 1:02', video: 'kai-bride', clip: true, tint: 'linear-gradient(160deg,#2a1d4d,#7b4cff)', prompt: 'A cel-shaded micro-drama: a man realizes the bride he thought he bought is playing a longer game. Hook in the first 3 seconds.' },
  { title: '5 Space Facts That Break Your Brain', meta: 'Faceless · 0:38', video: 'space-facts', tint: 'linear-gradient(160deg,#1b1e38,#3a2d6b)', prompt: '5 mind-blowing space facts as a faceless short — fast cuts, bold captions, a punchy voiceover.' },
  { title: 'Why Rome Really Fell', meta: 'History · 0:51', video: 'rome-fell', tint: 'linear-gradient(160deg,#2a1d4d,#0e3a52)', prompt: 'Why Rome really fell — a punchy 60-second faceless history short with map animations.' },
  { title: 'The $2 Trade That Made Millions', meta: 'Finance · 0:44', video: 'trade-millions', tint: 'linear-gradient(160deg,#0e3a52,#13614f)', prompt: 'The $2 options trade that made millions — a faceless finance short with chart overlays.' },
  { title: 'Morning Routine of a Monk', meta: 'Lifestyle · 0:33', video: 'monk-routine', tint: 'linear-gradient(160deg,#4a2d5e,#7b4cff)', prompt: 'The 5am morning routine of a Himalayan monk — a calm, faceless lifestyle short.' },
  { title: 'The CEO Who Married His Rival', meta: 'Micro-drama · 1:00', video: 'ceo-married-rival', clip: true, tint: 'linear-gradient(160deg,#1b1e38,#3a2d6b)', prompt: 'A micro-drama: two rival CEOs forced into a marriage of convenience that turns real. Episode 1.' },
  { title: 'This Habit Rewires Your Brain', meta: 'Science · 0:41', video: 'rewire-brain', tint: 'linear-gradient(160deg,#23284a,#0ea4c5)', prompt: 'One daily habit that rewires your brain — a faceless science short, snappy and captioned.' },
]

export const LONGFORM: Card[] = [
  { title: 'How a Steam Engine Works', meta: 'Explainer · 0:30', video: 'steam-engine', clip: true, tint: 'linear-gradient(120deg,#1b1e38,#0e3a52)', prompt: 'How a steam engine works — a cutaway explainer with labelled diagrams and a clear voiceover.' },
  { title: 'The Untold History of the Silk Road', meta: 'Documentary · 12:40', video: 'silk-road', tint: 'linear-gradient(120deg,#1b1e38,#0e3a52)', prompt: 'The untold history of the Silk Road — a long-form documentary with maps and archival-style visuals.' },
  { title: 'Inside the Mind of a Chess Grandmaster', meta: 'Deep dive · 18:05', video: 'chess-mind', tint: 'linear-gradient(120deg,#2a1d4d,#434664)', prompt: 'Inside the mind of a chess grandmaster — a deep-dive documentary on how they think.' },
  { title: 'Black Holes, Explained in 30 Minutes', meta: 'Science · 29:50', video: 'black-holes', tint: 'linear-gradient(120deg,#0e2a52,#7b4cff)', prompt: 'Black holes explained in 30 minutes — a long-form science documentary, accessible but rigorous.' },
  { title: 'The Rise and Fall of the Roman Navy', meta: 'History · 14:20', video: 'roman-navy', tint: 'linear-gradient(120deg,#13614f,#0ea4c5)', prompt: 'The rise and fall of the Roman navy — a narrated history documentary with battle maps.' },
]

// "Start from a template" gallery — clicking one drops its `prompt` into the hero (ready to Generate).
export const TEMPLATES = [
  { icon: '👻', name: 'Faceless short', tag: 'Shorts · YouTube/TikTok', prompt: 'A faceless short about 3 mind-blowing science facts' },
  { icon: '🎭', name: 'Micro-drama', tag: 'Episodic · cel-shaded', prompt: 'A 3-part cel-shaded micro-drama about a betrayal' },
  { icon: '🧠', name: 'Explainer', tag: 'Cutaway · educational', prompt: 'An educational cutaway explainer on how the stock market works' },
  { icon: '📣', name: 'UGC ad', tag: 'Creator-style ad', prompt: 'A creator-style UGC ad for a new skincare serum' },
  { icon: '🛍️', name: 'Product ad', tag: 'E-commerce', prompt: 'A punchy product ad for an e-commerce sneaker drop' },
  { icon: '🎙️', name: 'Talking-head reel', tag: 'Avatar presenter', prompt: 'A talking-head reel with an AI avatar presenting today’s tech news' },
  { icon: '📊', name: 'Listicle', tag: 'Top-N countdown', prompt: 'A Top-10 countdown of the most underrated travel destinations' },
  { icon: '🎞️', name: 'Documentary', tag: 'Long-form narrative', prompt: 'A long-form documentary on the rise and fall of an empire' },
] as const

// "How it works" — the v2 flow (prompt → sign in → generate into your library → promote). v2-specific
// so it matches what this page actually does (the original /ai-video-creator page keeps its own steps).
export const HOW_IT_WORKS = {
  heading: 'From prompt to posted',
  steps: [
    { t: 'Describe your video', d: 'Type a prompt or pick a template — topic, format and the platform you want.' },
    { t: 'Sign in — first one is free', d: 'Continue with Google and your first generation is on us, no card needed.' },
    { t: 'BlueAI generates it', d: 'It scripts, generates the visuals and voiceover, captions and edits — your video lands in your library.' },
    { t: 'Promote it everywhere', d: 'Share to YouTube, TikTok and Instagram — BlueAI’s creator agent posts it for you.' },
  ],
} as const
