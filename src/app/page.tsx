import { redirect } from 'next/navigation'

// Default address points at the style guide (design phase). When a hero direction is
// finalized, this will instead render that hero as the canonical homepage.
export default function Home() {
  redirect('/style-guide')
}
