import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

// Product DS — Button + IconButton. All color/size/radius from --bai-* DS utilities.
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const VARIANT: Record<Variant, string> = {
  primary:   'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-canvas text-ink-body border border-stroke hover:bg-surface',
  ghost:     'bg-transparent text-ink-muted hover:bg-surface',
  danger:    'bg-status-danger text-white hover:brightness-95',
}
const SIZE: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-10 gap-2 px-4 text-base',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  pill?: boolean
  leftIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', pill = true, leftIcon, className = '', children, ...props }, ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex shrink-0 items-center justify-center font-semibold transition-colors duration-fast ease-out-bai
        ${pill ? 'rounded-pill' : 'rounded-card'} ${SIZE[size]} ${VARIANT[variant]}
        disabled:cursor-not-allowed disabled:opacity-50
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  )
})

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label: string
}

// Icon-only control (header help/kebab, modal refresh, etc.) — hover bg + accent on active.
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { active = false, label, className = '', children, ...props }, ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      className={`inline-flex size-9 items-center justify-center rounded-card transition-colors duration-fast
        ${active ? 'bg-surface text-accent' : 'text-ink-muted hover:bg-surface hover:text-accent'}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})
