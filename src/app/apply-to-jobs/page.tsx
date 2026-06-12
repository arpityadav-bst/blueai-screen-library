import type { Metadata } from 'next'
import { AgentShell } from '@/components/agent/AgentShell'
import { CareerForm } from '@/components/agent/CareerForm'
import { CAREER } from '@/lib/agents-data'

export const metadata: Metadata = {
  title: 'Auto Apply to Jobs: AI Job Application Agent | BlueAI',
  description:
    'Tell BlueAI the roles you want. The agent searches Indeed, LinkedIn and company sites, emails you matches, and can fill and submit applications for you.',
}

const JOBS = [
  { src: 'LinkedIn', rem: true, t: 'AI/ML Data Contributor', co: 'TSMG Holding', loc: 'United States (Remote)' },
  { src: 'LinkedIn', rem: true, t: 'Internet Data Annotators', co: 'Welo Data', loc: 'United States (Remote)' },
  { src: 'LinkedIn', rem: true, t: 'Language Data Annotator (US)', co: 'RWS Group', loc: 'Dallas, TX (Remote)' },
  { src: 'LinkedIn', rem: false, t: 'Senior Product Designer, Agentic AI', co: 'Atlassian', loc: 'San Francisco (Hybrid)' },
  { src: 'LinkedIn', rem: true, t: 'Senior AI Product Manager', co: 'Notion', loc: 'Remote (US)' },
  { src: 'LinkedIn', rem: false, t: 'Graphic Designer, Social', co: 'Canva', loc: 'Austin, TX (Hybrid)' },
  { src: 'LinkedIn', rem: false, t: 'Principal Product Manager, AI Platform', co: 'Microsoft', loc: 'Hyderabad (Hybrid)' },
  { src: 'LinkedIn', rem: false, t: 'Senior Product Manager, AI', co: 'Microsoft', loc: 'Bengaluru (Hybrid)' },
  { src: 'LinkedIn', rem: true, t: 'Video Shot Annotation Artist', co: 'Welo Data', loc: 'Remote' },
]

function HeroOpenings() {
  return (
    <div className="ag-hero-jobs">
      <div className="ag-hero-jobs-top">
        <span className="ag-hero-jobs-lbl"><span className="dot" />Latest openings, found by the agent</span>
        <a className="ag-hero-jobs-all" href="#openings">See all 24 ↓</a>
      </div>
      <div className="ag-hero-jobs-rows">
        {JOBS.slice(0, 3).map((j) => (
          <div className="ag-hero-job" key={j.t + j.co}>
            <div className="ag-hero-job-tx"><b>{j.t}</b><span>{j.co} · {j.loc}</span></div>
            <span className="ag-hero-job-badge">{j.src}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Openings() {
  return (
    <section className="ag-section is-anchor" id="openings">
      <div className="site-wrap" data-reveal>
        <span className="site-eyebrow">Found by the agent</span>
        <h2 className="site-h2">All openings</h2>
        <p className="site-sub">24 live roles. The agent runs daily across Indeed, LinkedIn and company sites and posts what it finds here.</p>
        <div className="ag-openings">
          {JOBS.map((j) => (
            <div className="ag-job" key={j.t + j.co}>
              <div className="ag-job-badges">
                <span className="ag-tag src">{j.src}</span>
                {j.rem && <span className="ag-tag rem">Remote</span>}
              </div>
              <h4>{j.t}</h4>
              <p className="co">{j.co} · {j.loc}</p>
              <span className="ag-job-link">View role →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ApplyToJobsPage() {
  return <AgentShell data={CAREER} demo={<CareerForm />} feature={<Openings />} heroAside={<HeroOpenings />} />
}
