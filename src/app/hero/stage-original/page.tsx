import { HeroStageOriginal } from '@/components/hero/HeroStageOriginal'
import { BaiHome } from '@/components/home/BaiHome'

// Hero direction #2 — "Stage + Thumbnails (original)" — big stage + side rail, legacy scenes.
export default function StageOriginalPage() {
  return (
    <div className="hero-page">
      <HeroStageOriginal />
      <BaiHome />
    </div>
  )
}
