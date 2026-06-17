'use client'
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

// Product DS — form field molecules. One shared control class with the DS focus ring.
const fieldCls =
  'w-full rounded-card border border-stroke bg-canvas px-3 py-2.5 text-base text-ink-heading outline-none ' +
  'transition-shadow duration-fast placeholder:text-ink-muted ' +
  'focus:border-accent focus:shadow-[0_0_0_3px_rgba(var(--bai-accent-rgb),0.14)]'

export function Field({ label, required, hint, counter, children }: {
  label: string; required?: boolean; hint?: string; counter?: ReactNode; children: ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="text-h5 font-medium text-ink-body-2">
          {label}{required && <span className="text-status-danger">*</span>}
        </label>
        {counter != null && <span className="text-2xs text-ink-muted">{counter}</span>}
      </div>
      {children}
      {hint && <p className="mt-2 text-sm leading-snug text-ink-muted">{hint}</p>}
    </div>
  )
}

export function TextField({ className = '', ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldCls} ${className}`} {...p} />
}
export function TextAreaField({ className = '', ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldCls} resize-y leading-normal ${className}`} {...p} />
}
export function SelectField({ className = '', children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldCls} cursor-pointer ${className}`} {...p}>{children}</select>
}
