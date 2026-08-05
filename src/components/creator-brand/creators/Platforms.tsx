import Reveal from '../Reveal'

// Same stroke-glyph family as AmbientOrbit (play/camera/soundwave), plus a distinct
// cross for X and an upvote arrow for Reddit — no two channels share a glyph.
const CHANNELS = [
  { label: 'YouTube', body: 'Watch, like, and comment jobs — live right now.', color: '#FF5A5A', path: 'M9 8l7 4-7 4V8Z', live: true },
  { label: 'Instagram', body: 'Reels and posts.', color: '#7B4CFF', path: 'M4 8h4l1.5-2h5L16 8h4v11H4V8Z M12 10.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', live: false },
  { label: 'TikTok', body: 'Any clip that hits the brief.', color: '#0B0E1A', path: 'M6 16V9M10 18V6M14 18V9M18 15v-3', live: false },
  { label: 'X', body: 'Threads and posts.', color: '#1F2937', path: 'M6 6l12 12M18 6 6 18', live: false },
  { label: 'Reddit', body: 'Comments and upvotes.', color: '#F97316', path: 'M12 5v13M7 10l5-5 5 5', live: false },
]

export default function Platforms() {
  return (
    <section id="platforms" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="bai-eyebrow uppercase text-iris">Your channels</p>
          <h2 className="mt-3 max-w-[22ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            YouTube is live. Everything else is coming.
          </h2>
          <p className="bai-body mt-4 max-w-[46ch] text-ink-body-2">
            BlueAI runs real jobs on YouTube today. Instagram, TikTok, X, and Reddit are next — join
            the waitlist now and you&apos;ll be first in line when they open.
          </p>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CHANNELS.map((c) => (
            <div
              key={c.label}
              data-reveal-item
              className={`rounded-chat border border-stroke-warm bg-white p-6 ${!c.live ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-circle" style={{ background: c.color }}>
                  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={c.path} />
                  </svg>
                </span>
                {!c.live && <span className="rounded-pill bg-canvas px-2 py-0.5 text-[10px] font-semibold text-ink-muted">Soon</span>}
              </div>
              <h3 className="mt-4 font-head text-[18px] font-semibold text-ink-display">{c.label}</h3>
              <p className="mt-1.5 text-[13px] text-ink-body-2">{c.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
