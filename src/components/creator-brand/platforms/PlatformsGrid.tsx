import Reveal from '../Reveal'
import { CHANNELS } from './channels'

type Props = {
  heading: React.ReactNode
  intro: React.ReactNode
  /** Per-channel body copy, keyed by label — the one thing that differs per audience. */
  bodies: Record<string, string>
}

/**
 * Shared platform grid for both audiences. Hierarchy note, because it's a deliberate
 * reversal of what was here before: the live card is ELEVATED rather than the "soon" cards
 * being faded out. The previous version put `opacity-60` on the whole soon card, which
 * dimmed its heading and body text too — that's a legibility regression, and it made four
 * of five cards harder to read in order to make one stand out. Now the distinction is
 * carried by things that aren't text: the live card gets an iris-tinted border, real
 * elevation and a Live pip; the soon cards keep full-contrast text and only mute their
 * LOGO tile (the brand presence is the thing that isn't active yet) and sit back very
 * slightly on a translucent white.
 */
export default function PlatformsGrid({ heading, intro, bodies }: Props) {
  return (
    <section id="platforms" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-[24ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">{heading}</h2>
          {/* bai-body-lg (16px), not bai-body (14px) — a section lead at 14px was the same
              size as the card body text below it, leaving no hierarchy between the two.
              Matches the hero and step leads. */}
          <p className="bai-body-lg mx-auto mt-4 max-w-[56ch] text-ink-body-2">{intro}</p>
        </Reveal>

        <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CHANNELS.map((c) => (
            <div
              key={c.label}
              data-reveal-item
              className={`relative rounded-chat border p-5 transition-all duration-base ease-out-bai hover:-translate-y-1 ${
                c.live
                  ? 'shadow-float border-[rgba(123,76,255,.28)] bg-white'
                  : 'border-divider bg-white/70 hover:border-stroke-warm hover:bg-white'
              }`}
            >
              {c.live ? (
                <span className="absolute right-3.5 top-3.5 flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-circle bg-[var(--cb-accent)] opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-circle bg-[var(--cb-accent)]" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-label text-[var(--cb-accent)]">Live</span>
                </span>
              ) : (
                <span className="absolute right-3.5 top-3.5 rounded-pill border border-divider bg-canvas px-2 py-0.5 text-[10px] font-semibold uppercase tracking-label text-ink-muted">
                  Soon
                </span>
              )}

              <span
                className="shadow-hairline flex h-12 w-12 items-center justify-center rounded-field"
                style={{ background: c.color, opacity: c.live ? 1 : 0.5 }}
              >
                <svg viewBox="0 0 24 24" width={20} height={20} fill="white" aria-hidden="true">
                  <path d={c.path} />
                </svg>
              </span>

              <h3 className="mt-5 font-head text-[17px] font-semibold text-ink-display">{c.label}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-body-2">{bodies[c.label]}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
