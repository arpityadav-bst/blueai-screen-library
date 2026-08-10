import Reveal from '../Reveal'
import CommentApprovalDemo from './CommentApprovalDemo'

const STEPS = [
  { n: '01', title: 'Paste your handle', body: 'BlueAI reads your channel in seconds. No application, no waiting on a reply.' },
  { n: '02', title: 'Accept a job that fits', body: 'BlueAI already knows what you’re into — from your watch history, or a few quick questions if you’re new — so every job it shows fits what you’d actually watch. You still decide.' },
  { n: '03', title: 'BlueAI takes it from there', body: 'It handles the brand’s video on your account from start to finish, then verifies everything before it counts.' },
  { n: '04', title: 'Get paid, on repeat', body: 'You get paid once it clears, and BlueAI schedules the next cycle automatically — no re-accepting anything.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-content">
        <Reveal>
          <p className="bai-eyebrow uppercase text-iris">How it works</p>
          <h2 className="mt-3 max-w-[34ch] font-head text-3xl font-bold text-ink-display sm:text-4xl">
            You don&apos;t have to do a thing — BlueAI takes it from there.
          </h2>
          <p className="bai-body mt-4 max-w-[58ch] text-ink-body-2">
            Accept a job and BlueAI handles it, end to end. Nothing to schedule, nothing
            to remember, nothing to negotiate.
          </p>
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} data-reveal-item className="rounded-chat border border-stroke-warm bg-white p-6">
              <span className="font-head text-[13px] font-medium text-ink-muted">{s.n}</span>
              <h3 className="mt-3 font-head text-[19px] font-semibold text-ink-display">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-body-2">{s.body}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <h3 className="font-head text-[22px] font-semibold text-ink-display">You&apos;re always in the loop.</h3>
            <p className="bai-body mt-3 max-w-[48ch] text-ink-body-2">
              Every comment BlueAI wants to post shows up on your screen first, before it goes out
              under your name. Approve it, edit it, or switch on auto-approve if you&apos;d rather not
              be asked every time.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <CommentApprovalDemo />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
