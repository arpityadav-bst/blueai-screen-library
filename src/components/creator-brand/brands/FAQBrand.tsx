import Reveal from '../Reveal'
import FAQAccordion from '../FAQAccordion'

// Same copy rules as the creators page — see the note in creators/FAQ.tsx for the full
// reasoning. In short: no em dashes (rewritten into real sentences, not swapped for a colon),
// and the last two words of each answer are joined by a literal non-breaking space so an
// answer can't end on one stranded word.
const ITEMS = [
  {
    q: 'Does posting a job cost anything?',
    a: 'No. Posting a job only defines the terms. Your budget is only ever spent against engagement that BlueAI actually verifies.',
  },
  {
    q: 'What exactly does a creator do?',
    a: 'They genuinely engage with your YouTube video, and BlueAI verifies every one before it counts against your budget.',
  },
  {
    q: 'Is this only for YouTube?',
    a: 'For now, yes. YouTube jobs are live today, and Instagram, TikTok, X, and Reddit are coming soon.',
  },
  {
    q: 'What stops a creator from faking it?',
    a: 'BlueAI checks every single interaction directly. Anything that doesn’t meet the bar simply doesn’t get paid.',
  },
  {
    q: 'Can I run more than one job at a time?',
    a: 'Yes. Each job has its own budget and window, so you can run several in parallel.',
  },
]

export default function FAQBrand() {
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-[22ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Questions brands
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
