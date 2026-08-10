import Reveal from '../Reveal'
import FAQAccordion from '../FAQAccordion'

const ITEMS = [
  { q: 'Does posting a job cost anything?', a: 'No. Posting a job only defines the terms — your budget is only ever spent against engagement that BlueAI actually verifies.' },
  { q: 'What exactly does a creator do?', a: 'They genuinely engage with your YouTube video — all verified by BlueAI before it counts against your budget.' },
  { q: 'Is this only for YouTube?', a: 'Yes, for now — YouTube jobs are live today. Instagram, TikTok, X, and Reddit are coming soon.' },
  { q: 'What stops a creator from faking it?', a: 'BlueAI checks every single interaction directly — anything that doesn’t meet the bar simply doesn’t get paid.' },
  { q: 'Can I run more than one job at a time?', a: 'Yes — each job has its own budget and window, so you can run several in parallel.' },
]

export default function FAQBrand() {
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="bai-eyebrow uppercase text-iris">FAQ</p>
          <h2 className="mt-3 font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Questions brands actually ask.
          </h2>
        </Reveal>
        <Reveal className="mt-10">
          <FAQAccordion items={ITEMS} />
        </Reveal>
      </div>
    </section>
  )
}
