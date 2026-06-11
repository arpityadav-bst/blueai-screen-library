import { HeroCards } from '@/components/hero/HeroCards'
import { BaiHome } from '@/components/home/BaiHome'

// Hero direction #1 — "Three Cards" (legacy scenes, all 3 agents side by side).
export default function ThreeCardsPage() {
  return (
    <div className="hero-page">
      <HeroCards />
      <BaiHome />
    </div>
  )
}
