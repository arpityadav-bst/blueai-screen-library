// Showcases the blueai-modern in-panel components on the DS tokens. Light theme.
import { HeroNav } from '@/components/hero/HeroNav'
import { Wordmark } from '@/components/Wordmark'
import { DownloadCta } from '@/components/home/DownloadCta'
import { PreviewAnatomy, Tok } from '@/components/style-guide/Anatomy'
import '@/styles/homepage.css' // scoped under .bai-home — styles the real <DownloadCta/> below

function Card({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 rounded-field border border-divider bg-surface p-5">
      <p className="bai-section-label mb-4">{title}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  )
}

const Spark = () => <span className="text-gradient font-bold">✦</span>

export function ComponentsSection() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Marketing nav (hero header) — ONE shared component across all 3 hero variants */}
      <section id="hero-nav" className="scroll-mt-8 rounded-field border border-divider bg-surface p-5 lg:col-span-2">
        <p className="bai-section-label mb-1">Hero nav <span className="font-normal normal-case tracking-normal text-ink-muted">· legacy</span></p>
        <p className="mb-4 text-2xs text-ink-muted">Used only by the 3 hero prototypes. The production header is Marketing header (Site chrome &amp; patterns).</p>
        <div className="overflow-hidden rounded-card border border-divider bg-canvas">
          <HeroNav />
        </div>
      </section>

      {/* Download CTA — the canonical brand button. Full PREVIEW + ANATOMY treatment:
          the recipe a dev needs lives in the table, the role stays a terse note. */}
      <PreviewAnatomy
        id="download-cta"
        title="Download CTA"
        scope="bai-home"
        note="The canonical brand button — a cta-gradient pill carrying the Sparkle primitive + label, with an arrow that slides on hover."
        preview={<DownloadCta />}
        rows={[
          { code: <>.dl-cta · <Tok to="tok-cta-gradient">--bai-cta-gradient</Tok> · <Tok to="tok-radius-pill">radius-pill</Tok> · h-54 px-28</>, role: 'Container — gradient pill, fixed 54px height, generous padding' },
          { code: <>inline-flex · gap-9 · 17px / 600 · text-white</>, role: 'Layout + label — flex row, white semibold label on the gradient' },
          { code: <><Tok to="icons">Sparkle</Tok> .spark 18×18</>, role: 'Leading mark — the canonical Sparkle primitive (SSOT)' },
          { code: <><Tok to="icons">Arrow</Tok> .arrow 18×18 · hover translateX(3px)</>, role: 'Trailing arrow — slides right on hover' },
          { code: <><Tok to="tok-shadow-cta">shadow-cta</Tok> → shadow-cta-hover · translateY(-2px)</>, role: 'Elevation + hover — brand glow, lifts on hover' },
          { code: <>active scale(.98) · reduced-motion → none</>, role: 'Press + a11y — tactile press, honors reduced-motion' },
        ]}
      />

      {/* Buttons */}
      <Card id="buttons" title="Buttons — gradient · accent · hairline">
        <button className="inline-flex h-11 items-center gap-2 rounded-pill bg-bai-gradient px-5 text-sm font-semibold text-white shadow-cta">New Chat</button>
        <button className="inline-flex h-10 items-center gap-2 rounded-field bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">Submit task</button>
        <button className="inline-flex h-10 items-center gap-2 rounded-field border border-stroke bg-canvas px-5 text-sm font-semibold text-ink-heading">Continue</button>
        <button disabled className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-field bg-accent px-5 text-sm font-semibold text-white opacity-50">Disabled</button>
      </Card>

      {/* Status badges (PM design system — fills modern's semantic gap) */}
      <Card id="status" title="Status badges — semantic system (from PM DS)">
        <span className="rounded-sm bg-status-warning-soft px-2 py-1 text-2xs font-semibold text-status-warning-ink">assigned</span>
        <span className="rounded-sm bg-status-info-soft px-2 py-1 text-2xs font-semibold text-status-info-ink">in-progress</span>
        <span className="rounded-sm bg-status-success-soft px-2 py-1 text-2xs font-semibold text-status-success-ink">completed</span>
        <span className="rounded-sm bg-status-danger-soft px-2 py-1 text-2xs font-semibold text-status-danger-ink">failed</span>
        <span className="rounded-sm bg-status-scheduled-soft px-2 py-1 text-2xs font-semibold text-status-scheduled-ink">scheduled</span>
        <span className="rounded-sm bg-status-jobs-soft px-2 py-1 text-2xs font-semibold text-status-jobs-ink">available</span>
      </Card>

      {/* Pill badges (round, filled + outlined) · outline tags */}
      <Card id="pill-badges" title="Pill badges · outline tags">
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-status-info-soft px-2.5 py-1 text-2xs font-semibold text-status-info-ink"><span className="size-1.5 rounded-circle bg-status-info" />Active</span>
        <span className="inline-flex items-center gap-1 rounded-pill border border-status-success bg-status-success-soft px-2.5 py-1 text-2xs font-semibold text-status-success-ink">✓ Verified</span>
        <span className="inline-flex items-center gap-1 rounded-pill border border-status-scheduled bg-status-scheduled-soft px-2.5 py-1 text-2xs font-semibold text-status-scheduled-ink">Scheduled</span>
        <span className="rounded-pill bg-status-success-soft px-2.5 py-1 text-2xs font-semibold text-status-success-ink">5/10 skills active</span>
        <span className="rounded-card border border-status-scheduled px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-status-scheduled">Admin</span>
        <span className="rounded-card border border-status-warning px-2 py-0.5 text-2xs font-bold uppercase tracking-wide text-status-warning-ink">ENGG</span>
      </Card>

      {/* Credits pill — heavy treatment: the gradient-border trick isn't self-evident */}
      <PreviewAnatomy
        id="credits"
        title="Credits pill"
        note="The gradient-border credits chip — a padded gradient parent + a solid inner pill (no border-image)."
        preview={
          <span className="inline-block rounded-pill bg-bai-gradient p-px">
            <span className="block rounded-pill bg-canvas px-3 py-1 text-xs font-bold"><span className="text-gradient">✦ 2,450</span></span>
          </span>
        }
        rows={[
          { code: <>outer · rounded-pill · <Tok to="tok-gradient">bg-bai-gradient</Tok> · p-px</>, role: 'Gradient border — full-pill gradient; the 1px padding becomes the ring' },
          { code: <>inner · rounded-pill · bg-canvas · px-3 py-1</>, role: 'Fill — canvas pill inset by 1px, leaving a gradient hairline' },
          { code: <>.text-gradient · ✦ · 12px / 700</>, role: 'Content — gradient-clipped spark + credit count' },
        ]}
      />

      {/* Suggested-action pills */}
      <Card id="pills" title="Suggested-action pills — ✦ on 10% wash">
        <span className="inline-flex items-center gap-2 rounded-pill border border-divider bg-bai-wash px-4 py-2 text-sm font-medium text-ink-body"><Spark /> Open Settings</span>
        <span className="inline-flex items-center gap-2 rounded-pill border border-divider bg-bai-wash px-4 py-2 text-sm font-medium text-ink-body"><Spark /> Search Play Store</span>
      </Card>

      {/* Feature cards */}
      <Card id="feature-cards" title="Feature cards — 2-col dashboard grid">
        <div className="grid w-full grid-cols-2 gap-2.5">
          {[['🧠', 'Skills', 'Teach new skills to BlueAI'], ['💼', 'Jobs', 'Complete jobs to make money'], ['🗓️', 'Schedule', 'Automate tasks on a schedule'], ['⚙️', 'Personalize', "Change BlueAI's settings"]].map(([e, t, d]) => (
            <div key={t} className="rounded-card border border-stroke-warm bg-surface px-3 py-2.5">
              <p className="text-h5 font-semibold text-ink-heading">{e} {t}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Message bubbles — heavy treatment: the asymmetric radius is the non-obvious recipe */}
      <PreviewAnatomy
        id="bubbles"
        title="Message bubbles"
        note="Chat bubbles with an asymmetric radius — one corner stays sharp, pointing back toward the sender."
        preview={
          <div className="flex w-full max-w-[340px] flex-col items-end gap-2.5">
            <div className="max-w-[85%] rounded-bubble-sent bg-bai-gradient px-3.5 py-2 text-sm text-white">Search for racing games on Play Store</div>
            <div className="max-w-[85%] self-start rounded-bubble-recv border border-divider bg-surface px-3.5 py-2 text-sm text-ink-body">On it, here are the top racing games right now.</div>
          </div>
        }
        rows={[
          { code: <>rounded-bubble-sent (12 12 0 12) · <Tok to="tok-gradient">bg-bai-gradient</Tok> · self-end</>, role: 'Sent — gradient bubble, sharp bottom-right, right-aligned' },
          { code: <>rounded-bubble-recv (12 12 12 0) · border-divider · bg-surface · self-start</>, role: 'Received — light bubble, sharp bottom-left, left-aligned' },
          { code: <>max-w-[80%] · px-3.5 py-2 · text-sm</>, role: 'Width — caps at 80% so a bubble never spans the full column' },
        ]}
      />

      {/* Composer */}
      <Card id="composer" title="Prompt composer">
        <div className="flex w-full items-center gap-2 rounded-field border border-stroke bg-canvas py-2 pl-4 pr-2">
          <span className="flex-1 text-sm text-ink-muted">Send a message to BlueAI</span>
          <button className="flex size-8 items-center justify-center rounded-circle bg-bai-gradient text-white" aria-label="Send">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        </div>
      </Card>

      {/* Panel header */}
      <Card id="header" title="Panel header — 294×46">
        <div className="flex w-[294px] max-w-full items-center gap-2.5 rounded-field border border-divider bg-canvas px-3 py-2">
          <svg viewBox="0 0 24 24" className="size-4 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          <Wordmark size={15} />
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold"><Spark /><span className="text-gradient">4.9k</span></span>
        </div>
      </Card>
    </div>
  )
}
