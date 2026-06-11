import { HeroStage } from '@/components/hero/HeroStage'
import { BaiHome } from '@/components/home/BaiHome'

// ★ Recommended hero direction — "Stage" (rich 2-scene agents) + the homepage body.
// Moved off `/` (which now points to the style guide). Becomes the canonical homepage
// once the designer finalizes this direction.
export default function StageHeroPage() {
  return (
    <div className="hero-page v-stage">
      <HeroStage />
      <BaiHome />
    </div>
  )
}
