import type { Metadata } from 'next'
import '@/styles/site.css'
import '@/styles/developer.css'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Wordmark } from '@/components/Wordmark'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'
import { DOWNLOAD_URL } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Developer | BlueStacks AI',
  description:
    'Build with BlueAI. Get early access and up to 25,000 BlueAI Credits to start creating Skills for apps, games, and workflows.',
}

export default function DeveloperPage() {
  return (
    <div className="v-site v-dev">
      <MarketingHeader />
      <main>
        <section className="dev-hero">
          <span className="dev-lockup">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/blueai-icon-RzIisCsb.png" alt="" />
            <Wordmark />
          </span>
          <h1 className="dev-h1">Build with BlueAI</h1>
          <p className="dev-sub">Get early access and up to 25,000 BlueAI Credits to start creating Skills for apps, games, and workflows.</p>
          <a className="site-btn dev-cta" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"><Sparkle size={18} />Claim up to 25,000 Credits<Arrow /></a>
        </section>
      </main>
      <MarketingFooter />
    </div>
  )
}
