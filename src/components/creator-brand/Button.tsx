import Link from 'next/link'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-semibold ' +
  'transition-all duration-fast ease-out-bai select-none whitespace-nowrap'

const sizes = {
  md: 'px-5 py-2.5 text-[14px]',
  lg: 'px-7 py-3.5 text-[15px]',
}

const variants: Record<Variant, string> = {
  primary: 'bg-cta-gradient text-white shadow-cta hover:-translate-y-0.5 hover:shadow-cta-hover active:translate-y-0',
  secondary:
    'bg-white text-ink-heading border border-stroke-warm hover:border-ink-heading hover:bg-surface active:scale-[0.98]',
}

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: keyof typeof sizes
  className?: string
}

export function CBButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function CBLinkButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}
