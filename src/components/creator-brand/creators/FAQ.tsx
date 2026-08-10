import Reveal from '../Reveal'
import FAQAccordion from '../FAQAccordion'

const ITEMS = [
  { q: 'Do I need a lot of subscribers to join?', a: 'No — the flat rate is the same regardless of your channel size.' },
  { q: 'How does BlueAI pick which jobs I see?', a: 'Not randomly — it learns your interests, from a couple of quick questions when you join or automatically from your existing watch history, and only shows jobs that match what you’re already watching.' },
  { q: 'Do I have to write the comments myself?', a: 'No — BlueAI drafts a genuine comment for the video and shows it to you before posting. Approve it, edit it, or turn on auto-approve if you don’t want to be asked every time.' },
  { q: 'Is it only YouTube right now?', a: 'Yes — YouTube jobs are live today. Instagram, TikTok, X, and Reddit are coming soon; joining the waitlist now puts you first in line when they open.' },
  { q: 'How long does verification take?', a: 'BlueAI confirms your engagement shortly after it happens, and pays out automatically once the job clears.' },
  { q: 'What happens after I accept a job?', a: 'BlueAI handles it on your account from start to finish — with your approval on the comment — then schedules the next cycle automatically.' },
]

export default function FAQ() {
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Questions creators actually ask.
          </h2>
        </Reveal>
        <Reveal className="mt-10">
          <FAQAccordion items={ITEMS} />
        </Reveal>
      </div>
    </section>
  )
}
