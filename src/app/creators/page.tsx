import CreatorsHome from '@/components/creators/CreatorsHome'

// Thin orchestrator — the page is one client component because the whole surface is animation-
// driven (boot intro on a canvas, a perpetual task loop mutating DOM). See CreatorsHome.tsx.
export default function CreatorsPage() {
  return <CreatorsHome />
}
