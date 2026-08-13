import Reveal from '../Reveal'
import FAQAccordion from '../FAQAccordion'

// Copy note, and it applies to every string on this page:
//
// 1. No em dashes. Each was rewritten into a real sentence rather than swapped for a colon
//    or a comma, because a dash-spliced clause and a finished sentence don't read the same.
// 2. The last two words of every body string are joined by a literal non-breaking space
//    (U+00A0), so a paragraph can never end on one stranded word. It IS an invisible
//    character in the source, which is a real downside — but it has to be the literal
//    character, not a &nbsp; escape: several of these strings are passed as JSX attributes
//    (see Platforms.tsx `intro=`), and JSX attribute values are literal, so an escape would
//    render as the visible text "&nbsp;" instead of a space.
//    Grep for it with: grep -P '\xc2\xa0' <file>
// 3. The rest of the line-breaking is done by the browser — see the text-wrap rules in
//    creator-brand.css.
//
// REPLACED WHOLESALE 2026-08-13. These five are the PM's, and they answer a different set of
// questions than the six before them, because the model changed: the old set explained a per-job loop
// (how jobs get picked, who writes the comments, how long verification takes) that no longer exists.
// Two of those old answers had also become outright wrong — payouts are monthly via PayPal, not "as
// soon as the job clears", and the entry point is an application, not a waitlist signup.
//
// This section also absorbed the "Nothing happens on your channel without you" section, removed per
// the PM (screenshot item 7) on the grounds that its content belongs in the FAQ. It does, and it is
// here: the safety answer below carries what that section's four cards were saying.
const ITEMS = [
  {
    q: 'What exactly will BlueAI do on my account?',
    a: 'BlueAI completes brand campaigns on your behalf. You can see every job it runs.',
  },
  {
    q: 'Is my account safe? Can I see what it’s doing?',
    a: 'Yes. BlueAI runs on your own computer and only performs the jobs shown to you. You stay in control and can stop it at any time.',
  },
  {
    q: 'How much can I earn?',
    // TODO(PM): the brief ends this answer with a bracketed "[Add per-job payout range]" — a
    // placeholder for a figure that has not been supplied. It is deliberately NOT rendered: shipping
    // a visible "[Add …]" to the page is worse than shipping the answer one sentence shorter, and
    // inventing a range would put a made-up rate in front of applicants. Drop the number in here when
    // it exists; every other dollar figure on this site is marked illustrative, and a payout range in
    // an FAQ would be the first one a reader takes literally.
    a: 'Each job pays a fixed amount. Earnings depend on the jobs available to you.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'Via PayPal, at the end of each month.',
  },
  {
    q: 'Why is there a waitlist?',
    // The word "waitlist" survives the switch to an application on purpose, and it is the PM's: you
    // apply, and the batched onboarding behind that application is the queue. What changed is the
    // ACTION on the page (apply, not join a list), not the fact that there is a queue.
    a: 'We onboard members in batches so everyone gets a smooth start. We’ll email you as soon as your spot opens.',
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
