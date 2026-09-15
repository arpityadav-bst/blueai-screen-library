import type { Metadata } from 'next'
import { Wordmark } from '@/components/Wordmark'

// Root Screen Library — the handoff index (like WSUP's). Links to every blueAI page via
// full-page <a> (each route loads its own scoped CSS, so this avoids cross-route accumulation).
//
// REORGANISED 2026-08-01 around the scope pivot: this page used to list nine cards flat, with the
// ACTIVE surface (blueai-desktop) buried sixth and described as a "JS experiment", and the pinned
// design-system card pointing at the DORMANT marketing style guide. An index that misstates which
// work is current misleads every reviewer who lands here — grouping by status IS the information.
//
// REORGANISED AGAIN 2026-09-14 (Abhisht): the acquisition surfaces now group by AUDIENCE — creator
// page experiments and brand page experiments — because that is how they are reviewed. Nothing is
// deleted while its deployed page is still used for comparison: earlier creator/partner pages stay
// listed, including the frozen creator side of the creator-brand shell, which returns to the index
// after being dropped from it on 2026-08-19.
export const metadata: Metadata = {
  title: 'BlueAI — Screen Library',
  description:
    'Design-only handoff — the active BlueAI Terminal Modern prototype + its design system, the creator and brand page experiments, and the maintained product replicas.',
}

const ACTIVE = [
  {
    href: '/blueai-desktop',
    name: 'BlueAI Terminal Modern',
    desc: 'The product prototype — a BlueStacks window on the desktop; click it to slide out the terminal drawer. Login gate, chat, skills, scheduled tasks, credits, Telegram pairing, all states reachable via the dev preview panel.',
  },
  {
    href: '/blueai-desktop/style-guide.html',
    name: 'Terminal Modern — Design System',
    desc: 'Live style guide onto the product’s own stylesheet and icon set — tokens, scales and specimens are computed from the real files at load, and ds-drift-check.js gates every change.',
    ds: true,
  },
]

// BRAND PAGE EXPERIMENTS — the brand/agency-facing acquisition pages.
const BRAND_EXPERIMENTS = [
  {
    // RENAMED + RE-POINTED 2026-08-19 (Appy): was "Creator ↔ Brand" -> /creator-brand/creators,
    // describing both audiences under one shell. The creator side of that shell moved to its own
    // group below; this card narrows to the brand side and points straight at its own route.
    href: '/creator-brand/brands',
    name: 'Brand website',
    desc: 'The brand-side acquisition flow: post a job, outcome-based pricing, a live job-post form. On the blueai-modern marketing design system. Now carries the agent-made 9:16 sample-video strip under review: three placements (after the hero, after How it works, in the hero) switchable from the gear at bottom left.',
  },
]

// CREATOR PAGE EXPERIMENTS — every creator/partner/worker-facing page, the current sites first,
// then the standalone hero experiments (each owns its own stylesheet and README; the .html hrefs
// are deliberate — those pages use relative asset paths, and an extensionless rewrite would
// resolve them against /experiments/ and serve the page unstyled), then the frozen page kept for
// comparison.
const CREATOR_EXPERIMENTS = [
  {
    // "Partner", not "Creator" (Appy, 2026-08-25), following the audience rename on the route
    // itself. DELIBERATELY NOT PROPAGATED to /creator-brand, whose cards, copy and whole
    // For Creators / For Brands axis keep the old word: that site is frozen, and its two-audience
    // split is its proposition rather than a label.
    // TWO VERSIONS, ONE CARD (Appy, 2026-08-27): A and B are one route with two vocabularies, so a
    // second card implied a second site. The switch lives in the page's own toggler.
    href: '/creators',
    name: 'Partner website',
    desc: 'The full partner side: an AI-worker homepage ("The AI You Own"), sign in, a 5-step application, a returning-partner dashboard with cash-out, and logout — all in its own dark, futuristic design language. Two versions under review: this is A, and ?v=b opens Version B, the same site with the word "program" gone (the month is the unit) — flip either way from the gear, bottom-left. Design-only, same convention as every other page here.',
  },
  {
    // THE onBlue FORK (Appy, 2026-09-08). Its own card because it is a second route and a second
    // brand: two entries is the honest shape when there are genuinely two sites.
    href: '/onblue',
    name: 'Partner website — onBlue',
    desc: 'The Partner website under the new onBlue brand: the wordmark replaces the BlueAI lockup (no symbol) and every mention of the product reads onBlue. A complete duplicate otherwise — same hero, application, dashboard, legal page, dialogs and A/B/C versions, and the same ?theme= switch — so the two can be compared screen for screen.',
  },
  {
    // THE onBlue HERO EXPERIMENT (Appy, 2026-09-11; rewritten 2026-09-15 after the terminal and
    // the agent carousel were removed and the page was rebased onto the Cinematic light theme).
    href: '/experiments/onblue-vesper/index.html',
    name: 'onBlue Agentic Hero',
    desc: 'One agentic hero on the Cinematic light theme. The hero is a sampled-clay gradient field, an ambient ascii glyph field that brightens and churns in a pool around the cursor, and six ascii-rendered 3D models that exchange under a travelling ascii sweep band, the swap point solved from the shader’s own equation against each model’s projected x so it happens while the band covers it; one of the six is a rigged arm that hangs from the top of frame and reaches for the cursor on a hinge-constrained IK chain measured out of its own animation clip. Everything below is the Cinematic system verbatim: the economy panels with per-agent illustration swapping, partnered agents with looping terminals, three self-demonstrating how-it-works steps, a wired dispatch diagram whose spark splits its channels along the cursor-to-mark line, FAQs, a typed closing line and a cropped oversized footer wordmark. Standalone HTML plus one ES module, three.js pinned via importmap. Its design system is the next entry.',
  },
  {
    // ITS DESIGN SYSTEM (Appy, 2026-09-15). Its own entry, beside the page rather than only
    // linked from it: a reference nobody can find is a reference nobody reads.
    href: '/experiments/onblue-vesper/style-guide.html',
    name: 'onBlue Agentic Design System',
    desc: 'The design reference for the onBlue Agentic homepage, built the way blueai-desktop’s is: a view onto the page’s own CSS rather than a second copy of it. The guide fetches index.html at load, lifts its inline stylesheet and its shared icon sprite into itself, then renders real components with real class names, so a restyle lands here on reload with nothing to propagate. Every number is measured, not transcribed: token values via getComputedStyle, the radius scale tallied off the live sheet, the type specimens reporting their own rendered metrics, and a self-measured class coverage that lists by name every class the sheet styles and the guide does not. Sections for tokens, type and the responsive ladder, scales, motion, icons, the four background effect systems, fourteen component families, and a known-gaps note saying what this kind of guide structurally cannot catch.',
  },
  {
    // THE onBlue LANDING (Appy, 2026-09-11). Built outside this repo at N:\Antigravity Main\
    // onblue-landing and copied in, so the source of truth is there, not here.
    href: '/experiments/onblue-dark-v1/index.html',
    name: 'onBlue Cinematic Hero',
    desc: 'The onBlue marketing landing, in two themes off one token set: a particle hands layer over the hero, the digital/physical agent cards with per-agent illustration swapping, a wired dispatch diagram, terminal agents, FAQ, and an oversized footer wordmark. The header toggle switches the page whole, dark by default. Light is not the negative of dark: surfaces separate by elevation rather than by lightness, hovers cast a shadow rather than emit a glow, the brand mark goes blue, six illustrations have their own light twins, and the glows run one pass instead of two because white shows the seam. One static HTML file, inline CSS and a single IIFE, its own design language.',
  },
  {
    href: '/experiments/intelligence-hero/index.html',
    name: 'Own an AI That Works For You',
    desc: 'The BlueAI worker page: deploy a worker on your own PC, it finds real work from brands, completes it, and pays you $30 a month via PayPal. Four machines (PC earning now, the rest soon), a four-step apply flow, and a scroll-scrubbed overnight scene. Vanilla HTML/CSS/JS, its own design language.',
  },
  {
    // RETURNED TO THE INDEX 2026-09-14 (Abhisht): dropped on 2026-08-19 as superseded by the
    // Partner website, but the deployed page is still used for comparison and the ask is that
    // nothing already live disappears from the index yet. Frozen: changes belong to the sites above.
    href: '/creator-brand/creators',
    name: 'Creator website — creator-brand shell (frozen)',
    desc: 'The original creator side of the two-audience creator-brand shell: apply flow, dashboard, cash-out, on the blueai-modern marketing design system. Superseded by the Partner website above; kept listed while the deployed page is still compared against.',
  },
]

// MAINTAINED — not where new work happens, but updated from time to time as the real product
// and the marketing system move. Distinct from DORMANT: these are expected to change again.
const MAINTAINED = [
  { href: '/style-guide', name: 'Marketing Design System', desc: 'Tokens, type and components behind the marketing pages below. Governs those pages only — the active prototype has its own design system, linked at the top.' },
  {
    // THE V2 FORK (Appy, 2026-09-09). Its own card, not a line on V1's, for the same reason the
    // onBlue fork above has one: there are genuinely two surfaces now, so two entries is the
    // honest shape. V1 stays listed because it is the rollback point, not because it is current.
    href: '/blueai-product-v2',
    name: 'BlueAI Product V2',
    desc: 'Where product-clone work happens now. Forked as a byte-identical duplicate of V1 below (only the base href differs, so each serves correctly at its own clean URL) and diverges from here: the new-variant chat, task-progress + feedback, all five tabs. Standalone replica, not on the marketing design system.',
  },
  {
    // FROZEN 2026-09-09 when V2 forked off it. Deliberately not deleted and deliberately not
    // updated: it is the comparison point and the way back. Changes belong in V2 above.
    href: '/blueai-product',
    name: 'BlueAI Product (V1, frozen)',
    desc: 'V1 as it stood when V2 forked off it, kept as the backup: the new-variant chat, task-progress + feedback, all five tabs, Skills hidden and the BlueAI worker session. Nothing here changes again. Standalone replica, not on the marketing design system.',
  },
]


/* COMPACT ROWS (Appy, 2026-09-09). Titles only. With descriptions each row ran about 90px, so
   roughly six fitted in a viewport and every group below Active needed scrolling to find. A row
   is now a single line at about 40px, so the whole library reads at a glance, which is the job
   of an index page.

   The desc strings are deliberately NOT deleted. They move to the title attribute and surface on
   hover, because they carry real handoff context (why a surface exists, what superseded what,
   which of two versions is current) and trading permanent information for vertical space is a bad
   swap. Keeping them addressable also stops them going dead in the arrays above.

   The design-system row also drops its "Design system" eyebrow: it forced a second line, and the
   name it sat above already ends in "Design System". */
function Card({ p }: { p: { href: string; name: string; desc: string; ds?: boolean } }) {
  const row =
    'group flex items-center justify-between gap-4 rounded-card px-4 py-2.5 transition-all hover:-translate-y-px'
  const title = 'min-w-0 truncate font-head text-h4 font-semibold tracking-tight text-ink-display'
  const link = 'shrink-0 font-mono text-sm transition-transform group-hover:translate-x-0.5'

  if (p.ds) {
    return (
      <a
        href={p.href}
        title={p.desc}
        className={`${row} bg-bai-wash ring-1 ring-inset ring-[rgba(var(--bai-iris-rgb),.22)] hover:shadow-float`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-6 shrink-0 place-items-center rounded-badge bg-bai-gradient text-white">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
          </span>
          <span className={title}>{p.name}</span>
        </span>
        <span className={`${link} text-iris`}>{p.href} →</span>
      </a>
    )
  }
  return (
    <a
      href={p.href}
      title={p.desc}
      className={`${row} border border-divider bg-canvas shadow-hairline hover:border-[rgba(var(--bai-iris-rgb),.35)] hover:shadow-float`}
    >
      <span className={title}>{p.name}</span>
      <span className={`${link} text-ink-muted group-hover:text-iris`}>{p.href} →</span>
    </a>
  )
}

export default function Home() {
  return (
    <main
      className="min-h-screen font-sans"
      style={{ background: 'radial-gradient(1100px 620px at 50% -12%, rgba(var(--bai-iris-rgb),.07), transparent 60%), var(--bai-page-grad)' }}
    >
      <div className="mx-auto max-w-[920px] px-6 py-16 md:py-24">
        <header className="mb-10">
          <Wordmark size={26} />
          <h1 className="mt-3 font-head text-4xl font-semibold tracking-tight-3 text-ink-display">Screen Library</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Design-only handoff. Product work lives in the Terminal Modern prototype. The
            acquisition pages are grouped by audience below, creator first, and earlier pages
            stay listed while they are still compared against.
          </p>
        </header>

        <p className="bai-section-label mb-2 text-iris">Active — the product prototype</p>
        <div className="space-y-1.5">
          {ACTIVE.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-2 mt-8 text-ink-muted">Creator page experiments</p>
        <div className="space-y-1.5">
          {CREATOR_EXPERIMENTS.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-2 mt-8 text-ink-muted">Brand page experiments</p>
        <div className="space-y-1.5">
          {BRAND_EXPERIMENTS.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-2 mt-8 text-ink-muted">Maintained — updated from time to time</p>
        <div className="space-y-1.5">
          {MAINTAINED.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <footer className="mt-10 text-2xs text-ink-muted">An AI worker by now.gg, Inc. · design-only handoff replica</footer>
      </div>
    </main>
  )
}
