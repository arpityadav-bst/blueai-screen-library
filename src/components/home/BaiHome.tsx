import '@/styles/homepage.css'
import { FeatureRows } from './FeatureRows'
import { AllSkills } from './AllSkills'
import { DownloadCta } from './DownloadCta'

// The shared homepage body (everything below the hero) — ported from
// homepage-sections.html. Rendered under every hero variant. Visuals live in
// src/styles/homepage.css (scoped to .bai-home; built on the --bai-* tokens, with
// a few marketing-only --bh-* locals). intro → features → skills → all-skills →
// powered-by → footer.
export function BaiHome() {
  return (
    <div className="bai-home">
      {/* WHAT BLUEAI DOES */}
      <section className="intro">
        <div className="wrap">
          <p className="h-eyebrow">What BlueAI does</p>
          <h2 className="h-title">Less switching. More action.</h2>
          <p className="h-sub">Search, Shop, play, and do more with BlueAI.</p>
        </div>
      </section>

      <FeatureRows />

      {/* SKILLS */}
      <section className="skills">
        <div className="wrap">
          <p className="h-eyebrow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sparkle-filled.svg" alt="" aria-hidden="true" />Skills
          </p>
          <h2 className="h-title">Skills make <span className="grad">BlueAI</span> do more</h2>
          <p className="h-sub">
            Skills are ready-made abilities that help BlueAI handle specific tasks. Add Skills for games, rewards,
            search, shopping, replies, creator prep, scheduling, text, images, and more.
          </p>
          <DownloadCta />
        </div>
      </section>

      <AllSkills />

      {/* POWERED BY (closing CTA) */}
      <section className="powered">
        <div className="wrap">
          <h2 className="h-title">Powered by <span className="grad">BlueStacks AI</span>.</h2>
          <p className="h-sub">Join the community and be first in line when BlueAI opens up.</p>
          <DownloadCta />
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <p>© 2026 BlueStacks names and logos are registered trademarks of now.gg, Inc.</p>
        </div>
      </footer>
    </div>
  )
}
