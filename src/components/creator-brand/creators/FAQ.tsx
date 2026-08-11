import Reveal from '../Reveal'
import FAQAccordion from '../FAQAccordion'

// Copy note, and it applies to every string on this page:
//
// 1. No em dashes. Each was rewritten into a real sentence rather than swapped for a colon
//    or a comma, because a dash-spliced clause and a finished sentence don't read the same.
// 2. The last two words of every body string are joined by a literal non-breaking space
//    (U+00A0), so a paragraph can never end on one stranded word. It IS an invisible
//    character in the source, which is a real downside — but it has to be the literal
//    character, not a   escape: several of these strings are passed as JSX attributes
//    (see Platforms.tsx `intro=`), and JSX attribute values are literal, so an escape would
//    render as the visible text " " instead of a space.
//    Grep for it with: grep -P 'Â ' <file>
// 3. The rest of the line-breaking is done by the browser — see the text-wrap rules in
//    creator-brand.css.

const ITEMS = [
  {
    q: 'Do I need a lot of subscribers to join?',
    a: 'No. The flat rate is the same regardless of your channel size.',
  },
  {
    q: 'How does BlueAI pick which jobs I see?',
    a: 'Not randomly. It learns your interests from a couple of quick questions when you join, or automatically from your existing watch history, and only shows jobs that match what you already watch.',
  },
  {
    q: 'Do I have to write the comments myself?',
    a: 'No. BlueAI drafts a genuine comment for the video and shows it to you before posting. Approve it, edit it, or turn on auto-approve if you would rather not be asked every time.',
  },
  {
    q: 'Is it only YouTube right now?',
    a: 'Yes. YouTube jobs are live today. Instagram, TikTok, X, and Reddit are coming soon, and joining the waitlist now puts you first in line when they open.',
  },
  {
    q: 'How long does verification take?',
    a: 'BlueAI confirms your engagement shortly after it happens, and pays out automatically once the job clears.',
  },
  {
    q: 'What happens after I accept a job?',
    a: 'BlueAI handles it on your account from start to finish. You approve the comment before it posts, and the next cycle is scheduled automatically.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-[22ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Questions creators
            <span className="block text-gradient italic pr-[0.2em]">actually ask.</span>
          </h2>
        </Reveal>
        <Reveal className="mt-10">
          <FAQAccordion items={ITEMS} />
        </Reveal>
      </div>
    </section>
  )
}
