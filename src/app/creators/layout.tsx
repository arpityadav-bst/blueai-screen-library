import type { Metadata } from 'next'
import './creators.css'

// /creators — the NEW creators website (see public/experiments/robots/PLAN.md for the whole
// program). Its own top-level shell on purpose: this surface replaces the creator half of
// /creator-brand, which is FROZEN — nothing here may import from or edit that tree. The stylesheet
// is route-scoped (every selector under .crx), same pattern as the hero variants' scoped CSS, so
// nothing leaks into the rest of the Screen Library.
export const metadata: Metadata = {
  title: 'The AI You Own',
  description:
    'BlueAI is an AI worker you own. It finds real work from agencies, completes it, and pays you.',
}

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return children
}
