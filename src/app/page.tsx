import type { Metadata } from 'next'
import { Wordmark } from '@/components/Wordmark'

// Root Screen Library: the handoff index (like WSUP's). Links to every blueAI page via
// full-page <a> (each route loads its own scoped CSS, so this avoids cross-route accumulation).
//
// REORGANISED 2026-08-01 around the scope pivot: this page used to list nine cards flat, with the
// ACTIVE surface (blueai-desktop) buried sixth and described as a "JS experiment", and the pinned
// design-system card pointing at the DORMANT marketing style guide. An index that misstates which
// work is current misleads every reviewer who lands here, so grouping by status IS the information.
//
// REORGANISED AGAIN 2026-09-14 (Abhisht): the acquisition surfaces now group by AUDIENCE (creator
// page experiments and brand page experiments) because that is how they are reviewed. Nothing is
// deleted while its deployed page is still used for comparison: earlier creator/partner pages stay
// listed, including the frozen creator side of the creator-brand shell, which returns to the index
// after being dropped from it on 2026-08-19.
//
// REORDERED 2026-09-15 (Appy): the audience groups stay, two things change inside them.
// ORDER is now newest first within every group, so the work under review is the work you land on
// and nothing current sits below something frozen. TYPE is now carried by the row itself: there
// are exactly two kinds of destination here, a surface and the design system that documents one,
// and every design system takes the tinted row with the grid mark while every surface takes the
// plain bordered one. That treatment existed already but only one of the three design systems
// wore it, which made it read as a highlight on the active prototype rather than as a type.
//
// REORGANISED 2026-10-13 (Appy): one MAIN group now, and everything else is an extra. BlueAI
// Product V2 is the main running product, no longer a maintained replica, and the two onBlue
// Agentic sites are its fronts: onBlue Agentic is the partner (creator) website, where people
// run the jobs and cash out, and onBlue Agentic for business is where businesses start the
// campaigns and set the budgets those jobs are paid from. Terminal Modern, which led this page
// as ACTIVE since 2026-08-06, moved down to the extras.
//
// TRIMMED the same day (Appy): the extra websites came off the index, because none of them is in
// use any more. UNLISTED, NOT DELETED: /onblue, /creators, /experiments/intelligence-hero,
// /creator-brand/creators, /creator-brand/brands and /style-guide (the Marketing Design System,
// which documents the creator-brand shell and the dormant marketing site, so nothing still listed
// here) are all still in the repo and still served. Two extras stay: the onBlue Cinematic Hero,
// and Terminal Modern with its design system.
export const metadata: Metadata = {
  title: 'BlueAI | Screen Library',
  description:
    'Design-only handoff. The main BlueAI product, its two onBlue Agentic sites (partner and business) and their design system, then the two extras still in use: the onBlue Cinematic Hero and the earlier Terminal Modern prototype.',
}

const MAIN = [
  {
    // V1 DELETED 2026-10-13 (Appy). It had been frozen since V2 forked off it on 2026-09-09, with
    // zero commits after the fork, so V2 is now the only product clone. V1 is recoverable from git
    // history (last present at 34027ca). The URL deliberately stays /blueai-product-v2 rather than
    // moving back to /blueai-product: the PM's prototype links and review URLs already use it.
    // PROMOTED TO MAIN the same day. Its worker flow is the PM's (Abhisht), ported byte-for-byte
    // from his branch worker-day-done-and-modes @ a1108a8 so the next port diffs cleanly: a bug in
    // that code goes back to him rather than being fixed here.
    href: '/blueai-product-v2',
    name: 'BlueAI Product V2',
    desc: 'The main BlueAI product, the desktop app replica. The BlueAI worker session end to end: sign in, terms and per-app permissions, Automatic or ask-first mode per app, the run, its verification and the day-done states, plus the chat, task progress and feedback, credits with the out-of-credits popup, and Settings. Standalone replica, not on the marketing design system.',
  },
  {
    // ADDED 2026-10-13: V2's design system, directly under V2 because it describes it.
    href: '/blueai-product-v2-ds/index.html',
    name: 'BlueAI Product V2 Design System',
    desc: 'The target design system for BlueAI Product V2, the one the PM builds V2’s next iterations from: tokens, a kit of parts, whole screens and the patterns between them, one family with the onBlue Agentic site. A live guide shows every part with its status, In V2, Changed from V2 (V2 today beside the system version, with what changed and why) or New, each V2 value tied to its V2 line and proved by a checker, plus prioritised recommendations for V2 and the PM’s pending decisions. DESIGN.md carries the same content as one Markdown file. V2 itself is unchanged.',
    ds: true,
  },
  {
    // RENAMED 2026-10-13 (Appy): was "onBlue Agentic Hero", from when this page was one hero
    // experiment (2026-09-11, rebased onto the Cinematic light theme 2026-09-15). It is now the
    // whole partner site: the homepage, the apply flow and the partner dashboard behind it.
    href: '/experiments/onblue-vesper/index.html',
    name: 'onBlue Agentic',
    desc: 'The partner (creator) website: people apply to run jobs with their agent, then earn from the campaigns businesses fund on onBlue Agentic for business, tracked and cashed out from the partner dashboard. The homepage is an agentic hero on the Cinematic light theme (a sampled-clay gradient field, an ascii glyph field that churns around the cursor, and six ascii-rendered 3D models exchanging under a travelling sweep band, one a rigged arm that reaches for the cursor), then the economy panels, partnered agents with looping terminals, three self-demonstrating how-it-works steps, the wired dispatch diagram, FAQs and a cropped oversized footer wordmark. apply.html behind it holds the application and the dashboard. Standalone HTML plus one ES module, three.js pinned via importmap. Its design system, shared with the business site, closes this group.',
  },
  {
    href: '/experiments/onblue-vesper/brands.html',
    name: 'onBlue Agentic for business',
    desc: 'The business website: businesses start a campaign and set its budget, and the partners on onBlue Agentic run the jobs it pays for. Built 2026-09-17 as a third page JOINING onblue.css rather than a second implementation of it, so every token, the grain, the card sheen, the button ladder and both themes arrive already correct and cannot drift. It is the destination the homepage’s own “For businesses” link points at, and it opens on that section’s own words: “Bring work to onBlue. Agents take it from there.” Every device is the homepage’s read from the buyer’s end: the rail runs brief to charged, the three agent terminals show work being bought rather than earned from, the step demos re-aim to brief, match and pay, and the spark lens follows its filter onto the closing mark. Behind the access gate, campaign.html is the logged-in half: a catalogue of campaign kinds, a four-step brief, and a dashboard that mirrors the partner one section for section, because a business and a partner are reading two ends of the same ledger: spend where that has earnings, budget remaining where that has balance, Add budget where that has Cash out.',
  },
  {
    // THE SITES' DESIGN SYSTEM, under BOTH sites since 2026-10-13 (Appy), because it documents
    // both: onblue.css is the one sheet the homepage, the application and the business site share.
    // Directly under the partner site it read as that site's alone. Still in this group rather
    // than a design-systems group of its own: a reference is found by the person already looking
    // at the thing it describes, and the row style is what says which of the two kinds it is.
    href: '/experiments/onblue-vesper/style-guide.html',
    name: 'onBlue Agentic Design System',
    desc: 'The design reference for both onBlue Agentic sites, built the way Terminal Modern’s is: a view onto the real CSS rather than a second copy of it. It links onblue.css, the one stylesheet the homepage, the application and the business site share, fetches index.html only for its icon sprite, then renders real components with real class names, so a restyle lands here on reload with nothing to propagate. Every number is measured, not transcribed: token values via getComputedStyle, the radius scale tallied off the live sheet, the type specimens reporting their own rendered metrics, and a self-measured class coverage that lists by name every class the sheet styles and the guide does not. Sections for tokens, type and the responsive ladder, scales, motion, icons, the four background effect systems, fourteen component families, and a known-gaps note saying what this kind of guide structurally cannot catch.',
    ds: true,
  },
]

// EXTRAS, the two still in use. Newest first, each design system directly under its surface. The
// .html href is deliberate: that page uses relative asset paths, and an extensionless rewrite
// would resolve them against /experiments/ and serve the page unstyled.
const EXTRAS = [
  {
    // THE onBlue LANDING (Appy, 2026-09-11). Built outside this repo, at the onblue-landing
    // folder in the workspace root, and copied in: the source of truth is there, not here.
    href: '/experiments/onblue-dark-v1/index.html',
    name: 'onBlue Cinematic Hero',
    desc: 'The onBlue marketing landing, in two themes off one token set: a particle hands layer over the hero, the digital/physical agent cards with per-agent illustration swapping, a wired dispatch diagram, terminal agents, FAQ, and an oversized footer wordmark. The header toggle switches the page whole, dark by default. Light is not the negative of dark: surfaces separate by elevation rather than by lightness, hovers cast a shadow rather than emit a glow, the brand mark goes blue, six illustrations have their own light twins, and the glows run one pass instead of two because white shows the seam. One static HTML file, inline CSS and a single IIFE, its own design language.',
  },
  {
    // Moved out of ACTIVE 2026-10-13 (Appy) when V2 became the main product.
    href: '/blueai-desktop',
    name: 'BlueAI Terminal Modern',
    desc: 'The earlier product prototype: a BlueStacks window on the desktop; click it to slide out the terminal drawer. Login gate, chat, skills, scheduled tasks, credits, Telegram pairing, all states reachable via the dev preview panel.',
  },
  {
    href: '/blueai-desktop/style-guide.html',
    name: 'Terminal Modern Design System',
    desc: 'Live style guide onto the product’s own stylesheet and icon set: tokens, scales and specimens are computed from the real files at load, and ds-drift-check.js gates every change.',
    ds: true,
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
            Design-only handoff. Main is the BlueAI product and its two onBlue Agentic sites: the
            partner website, where people run the jobs and cash out, and the business website,
            where campaigns and budgets start. Below it are the two extras still in use. A tinted
            row with a grid mark is a design system; a plain row is a surface.
          </p>
        </header>

        <p className="bai-section-label mb-2 text-iris">Main: the BlueAI product and its two sites</p>
        <div className="space-y-1.5">
          {MAIN.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <p className="bai-section-label mb-2 mt-8 text-ink-muted">Extras</p>
        <div className="space-y-1.5">
          {EXTRAS.map((p) => <Card key={p.href} p={p} />)}
        </div>

        <footer className="mt-10 text-2xs text-ink-muted">An AI worker by now.gg, Inc. · design-only handoff replica</footer>
      </div>
    </main>
  )
}
