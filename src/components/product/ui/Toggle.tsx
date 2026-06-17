'use client'

// Product DS — on/off switch. Accent fill when on, all states keyboard-focusable.
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label}
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      className={`relative h-[18px] w-8 shrink-0 rounded-circle transition-colors duration-base ${checked ? 'bg-accent' : 'bg-stroke'}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
    >
      <span className={`absolute top-0.5 size-3.5 rounded-circle bg-white shadow transition-[left] duration-base ${checked ? 'left-[16px]' : 'left-0.5'}`} />
    </button>
  )
}
