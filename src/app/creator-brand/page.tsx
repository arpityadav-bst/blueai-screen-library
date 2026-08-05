import { redirect } from 'next/navigation'

// Creator page is the default entry point for /creator-brand.
export default function CreatorBrandIndex() {
  redirect('/creator-brand/creators')
}
