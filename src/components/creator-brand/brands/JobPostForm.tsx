'use client'

import { useState } from 'react'
import Reveal from '../Reveal'

const AVG_RATE_PER_CREATOR = 6.5 // illustrative — matches the flat per-job rate shown on the creator side

export default function JobPostForm() {
  const [budget, setBudget] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const reach = budget ? Math.max(1, Math.floor(Number(budget) / AVG_RATE_PER_CREATOR)) : null

  return (
    <section id="post-a-job" className="px-6 py-24">
      <div className="mx-auto max-w-content grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="bai-eyebrow uppercase text-iris">Post a job</p>
          <h2 className="mt-3 font-head text-3xl font-bold text-ink-display sm:text-4xl">
            Set the terms once. We&apos;ll run it from here.
          </h2>
          <p className="bai-body mt-4 text-ink-body-2">
            Nothing is charged when you post this — you&apos;re only defining the job so BlueAI can
            start matching creators to it the moment we launch.
          </p>
        </Reveal>

        <Reveal>
          {submitted ? (
            <div className="shadow-float rounded-credits border border-stroke-warm bg-white p-10 text-center">
              <h3 className="font-head text-[22px] font-semibold text-ink-display">Your job is queued.</h3>
              <p className="mx-auto mt-2 max-w-[38ch] text-[14px] text-ink-body-2">
                BlueAI will start matching creators to it the moment jobs go live. We&apos;ll email
                you as soon as it&apos;s running.
              </p>
            </div>
          ) : (
            <form
              className="shadow-float rounded-credits border border-stroke-warm bg-white p-6 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              <label className="block">
                <span className="text-[12px] font-medium text-ink-muted">Brand name</span>
                <input
                  required
                  placeholder="e.g. Fernweh Coffee"
                  className="mt-1 w-full rounded-field border border-stroke-warm px-3 py-2.5 text-[14px] outline-none focus:border-iris"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-[12px] font-medium text-ink-muted">What&apos;s the goal?</span>
                <input
                  required
                  placeholder="e.g. awareness for our new product launch"
                  className="mt-1 w-full rounded-field border border-stroke-warm px-3 py-2.5 text-[14px] outline-none focus:border-iris"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-[12px] font-medium text-ink-muted">YouTube video URL</span>
                <input
                  required
                  type="url"
                  placeholder="https://youtube.com/watch?v=…"
                  className="mt-1 w-full rounded-field border border-stroke-warm px-3 py-2.5 text-[14px] outline-none focus:border-iris"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-[12px] font-medium text-ink-muted">Total budget</span>
                <div className="mt-1 flex items-center rounded-field border border-stroke-warm px-3 focus-within:border-iris">
                  <span className="text-[14px] text-ink-muted">$</span>
                  <input
                    required
                    type="number"
                    min={1}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="2,500"
                    className="w-full bg-transparent py-2.5 pl-1.5 text-[14px] outline-none"
                  />
                </div>
                {reach && (
                  <p className="mt-1.5 text-[12px] text-iris">≈ {reach.toLocaleString()} creators will watch, like &amp; comment on this budget</p>
                )}
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[12px] font-medium text-ink-muted">Start date</span>
                  <input required type="date" className="mt-1 w-full rounded-field border border-stroke-warm px-3 py-2.5 text-[14px] outline-none focus:border-iris" />
                </label>
                <label className="block">
                  <span className="text-[12px] font-medium text-ink-muted">End date</span>
                  <input required type="date" className="mt-1 w-full rounded-field border border-stroke-warm px-3 py-2.5 text-[14px] outline-none focus:border-iris" />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-[12px] font-medium text-ink-muted">Where should we send updates?</span>
                <input required type="email" placeholder="you@brand.com" className="mt-1 w-full rounded-field border border-stroke-warm px-3 py-2.5 text-[14px] outline-none focus:border-iris" />
              </label>

              <button
                type="submit"
                className="mt-6 w-full rounded-pill bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-transform hover:-translate-y-0.5 hover:shadow-cta-hover"
              >
                Post this job
              </button>
              <p className="mt-3 text-center text-[12px] text-ink-muted">No payment happens now — you&apos;re only defining the job.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
