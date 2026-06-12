import type { Metadata } from 'next'
import { AgentShell } from '@/components/agent/AgentShell'
import { CreatorForm } from '@/components/agent/CreatorForm'
import { VideoCard } from '@/components/agent/VideoCard'
import { CREATOR } from '@/lib/agents-data'

export const metadata: Metadata = {
  title: 'AI Video Creator for Faceless YouTube Channels | BlueAI',
  description:
    'Describe a video and BlueAI scripts it, generates the visuals and voiceover, captions and edits it, then posts to YouTube, TikTok and Instagram on your schedule.',
}

const VIDS = [
  { badge: 'Micro Drama', t: 'He Thought He Bought His Bride', meta: 'Kai · Ep. 1 · 1:02', file: 'kai-bride' },
  { badge: 'Micro Drama', t: 'The CEO Who Married His Rival', meta: '1:00 · cel-shaded', file: 'ceo-married-rival' },
  { badge: 'Explainer', t: 'How a Steam Engine Works', meta: '0:30 · cutaway explainer', exp: true, file: 'steam-engine' },
]
const CAPS = [
  { e: '🌍', t: 'Faceless shorts', d: 'Space, history, finance and science clips — the classic faceless YouTube and Shorts formats.' },
  { e: '🎬', t: 'Reels and TikToks', d: 'Vertical short-form tuned per platform, captioned and ready to post.' },
  { e: '🎭', t: 'Micro dramas', d: 'Character-driven episodic stories — the hook most AI video tools cannot do.' },
]
function CreatorFeature() {
  return (
    <>
      <section className="ag-section is-anchor" id="made">
        <div className="site-wrap" data-reveal>
          <span className="site-eyebrow">Made by the agent</span>
          <h2 className="site-h2">Made by the agent, end to end</h2>
          <p className="site-sub">Real clips BlueAI produced: scripted, generated, voiced, captioned and cut — no camera and no editing timeline. Cel-shaded micro-dramas and a cutaway explainer.</p>
          <div className="ag-vids">
            {VIDS.map((v) => <VideoCard v={v} key={v.t} />)}
          </div>
        </div>
      </section>
      <section className="ag-section">
        <div className="site-wrap" data-reveal>
          <span className="site-eyebrow">What it makes</span>
          <h2 className="site-h2">What can the BlueAI video creator make?</h2>
          <div className="ag-caps">
            {CAPS.map((c) => (
              <div className="ag-cap" key={c.t}><span className="ag-cap-emoji">{c.e}</span><h4>{c.t}</h4><p>{c.d}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default function VideoCreatorPage() {
  return <AgentShell data={CREATOR} demo={<CreatorForm />} feature={<CreatorFeature />} />
}
