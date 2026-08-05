'use client'

import { useState } from 'react'

export type FAQItem = { q: string; a: string }

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-divider rounded-field border border-stroke-warm bg-white">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-medium text-ink-heading">{item.q}</span>
              <span
                className={`shrink-0 text-[18px] text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
              >
                +
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="bai-body px-6 pb-5 text-ink-body-2">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
