import type { Config } from 'tailwindcss'

// ───────────────────────────────────────────────────────────────────────────
// blueAI "blueai-modern" design tokens — ported from the Claude-design export
// (design-source/homepage-rework/project/_ds/blueai-modern/colors_and_type.css +
// _ds_manifest.json, from BlueAI.fig node 1:942 "New UX").
// SOURCE OF TRUTH = the --bai-* CSS vars in globals.css; Tailwind maps utilities
// (bg-iris, text-ink-heading, bg-bai-gradient, …) onto them so new utility-class
// code stays on-token. BlueAI is "BlueAI by now.gg" — light theme, no dark mode.
// Marketing pages (hero + homepage) add a Space Grotesk display font (`font-head`)
// on top of the in-panel DS.
// ───────────────────────────────────────────────────────────────────────────

// hoverOnlyWhenSupported compiles every `hover:` utility inside `@media (hover: hover)`. Without it,
// Android Chrome and iOS latch the hover state after a tap and it stays until you tap elsewhere — so
// a tapped chip, calendar day or card keeps its hover fill and reads as selected when it isn't.
// One flag, every `hover:` on the site.
const config: Config = {
  future: { hoverOnlyWhenSupported: true },
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Fonts ─────────────────────────────────────────────
      fontFamily: {
        sans: ['SF Pro', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        head: ['"Space Grotesk"', 'SF Pro Display', 'Inter', 'sans-serif'], // marketing display headings
        brand: ['"Bricolage Grotesque"', 'Inter', 'sans-serif'],            // wordmark
      },

      // ─── Type scale — DS panel scale (10→28) + marketing display (34→60) ──
      fontSize: {
        '2xs': ['11px', { lineHeight: '1.5' }],   // fine print — SG notes / anatomy roles / counts
        'xs':  ['10px', { lineHeight: '1.4' }],   // caption / eyebrow
        '11':  ['11px', { lineHeight: '1' }],
        'sm':  ['12px', { lineHeight: '1.6' }],   // body-sm / label
        'h5':  ['13px', { lineHeight: '1.2' }],
        'base':['14px', { lineHeight: '1.6' }],   // body
        'h4':  ['15px', { lineHeight: '1.2' }],
        'md':  ['16px', { lineHeight: '1.6' }],   // body-lg
        'h3':  ['17px', { lineHeight: '1.2' }],
        'lg':  ['20px', { lineHeight: '1.1' }],   // h2
        'xl':  ['24px', { lineHeight: '1.05' }],  // h1 / display
        '2xl': ['28px', { lineHeight: '1.05' }],  // hero (panel)
        '3xl': ['34px', { lineHeight: '1.05' }],  // marketing hero min
        '4xl': ['42px', { lineHeight: '1.04' }],
        '5xl': ['48px', { lineHeight: '1.12' }],  // only used by the two creator-brand Hero H1s — loosened from 1.03 for the same descender-clipping reason as 6xl
        '6xl': ['60px', { lineHeight: '1.15' }],  // marketing hero max — oversized display moments; kept looser than 4xl/5xl on purpose, 1.02-1.04 clips descenders (g/y/p) at this size
      },

      // ─── Colors — mapped to the --bai-* token vars (globals.css) ──
      colors: {
        iris:    { DEFAULT: 'var(--bai-iris)', light: 'var(--bai-iris-2)' },
        cyan:    'var(--bai-cyan)',
        ink: {
          display:  'var(--bai-ink-display)',
          heading:  'var(--bai-ink-heading)',
          body:     'var(--bai-ink-body)',
          'body-2': 'var(--bai-ink-body-2)',
          muted:    'var(--bai-ink-muted)',
        },
        stroke:  { DEFAULT: 'var(--bai-stroke)', warm: 'var(--bai-stroke-warm)' },
        divider: 'var(--bai-divider)',
        surface: 'var(--bai-surface)',
        canvas:  'var(--bai-canvas)',
        'legacy-blue': 'var(--bai-legacy-blue)',
        // PM-supplement: interactive accent (app surfaces) + semantic status system.
        accent: { DEFAULT: 'var(--bai-accent)', hover: 'var(--bai-accent-hover)' },
        indigo: { DEFAULT: 'var(--bai-indigo)', soft: 'var(--bai-indigo-soft)', ink: 'var(--bai-indigo-ink)' },
        status: {
          success: 'var(--bai-success)', 'success-soft': 'var(--bai-success-soft)', 'success-ink': 'var(--bai-success-ink)',
          warning: 'var(--bai-warning)', 'warning-soft': 'var(--bai-warning-soft)', 'warning-ink': 'var(--bai-warning-ink)',
          danger: 'var(--bai-danger)', 'danger-soft': 'var(--bai-danger-soft)', 'danger-ink': 'var(--bai-danger-ink)',
          info: 'var(--bai-info)', 'info-soft': 'var(--bai-info-soft)', 'info-ink': 'var(--bai-info-ink)',
          scheduled: 'var(--bai-scheduled)', 'scheduled-soft': 'var(--bai-scheduled-soft)', 'scheduled-ink': 'var(--bai-scheduled-ink)',
          jobs: 'var(--bai-jobs)', 'jobs-soft': 'var(--bai-jobs-soft)', 'jobs-ink': 'var(--bai-jobs-ink)',
        },
      },

      // ─── Brand gradient + 10% wash (never a solid stop on its own) ──
      backgroundImage: {
        'bai-gradient':   'var(--bai-gradient)',
        'bai-wash':       'var(--bai-gradient-wash)',
        'bai-wash-hover': 'var(--bai-gradient-wash-hover)',
        'cta-gradient':   'var(--bai-cta-gradient)',  // the "Download BlueAI" tri-stop gradient
        'cta-band':       'var(--bai-cta-band)',       // dark closing-CTA band (live-demo-v2)
      },

      // ─── Radii — DS progression (8 · 12 · 128 pill · asymmetric bubble) ──
      borderRadius: {
        'badge': '2px',    // squared status chips
        'card':  '8px',    // feature cards, logo tile, buttons
        'field': '12px',   // composer, panels, cards
        'chat':  '16px',   // chat input + chat bubbles
        'credits': '24px', // credits / wallet pill
        'pill':  '128px',  // chips, suggested actions (stadium on wide elements)
        'circle': '9999px', // send button, avatars, status dots, toggle knobs
        'bubble-sent': '12px 12px 0px 12px',
        'bubble-recv': '12px 12px 12px 0px',
      },

      // ─── Spacing — the DS's 4pt scale (globals.css --space-1..8), namespaced "ds-*" so it
      // extends (not overrides) Tailwind's own default numeric spacing scale used everywhere else.
      spacing: {
        'ds-1': 'var(--space-1)', // 4px
        'ds-2': 'var(--space-2)', // 8px
        'ds-3': 'var(--space-3)', // 10px
        'ds-4': 'var(--space-4)', // 12px
        'ds-5': 'var(--space-5)', // 16px
        'ds-6': 'var(--space-6)', // 20px
        'ds-7': 'var(--space-7)', // 32px
        'ds-8': 'var(--space-8)', // 36px
      },

      // ─── Shadows — border-driven system; float/overlay reserved for menus ──
      boxShadow: {
        'float':    'var(--shadow-float)',           // SSOT in globals.css (was a duplicated literal)
        'overlay':  'var(--shadow-overlay)',
        'hairline': 'var(--bai-shadow-hairline)',    // resting cards
        'cta':       'var(--bai-shadow-cta)',        // brand glow under the Download CTA
        'cta-hover': 'var(--bai-shadow-cta-hover)',
        'brand-sm':  'var(--bai-shadow-brand-sm)',   // colored, for elevated brand chips
      },

      // ─── Letter spacing — eyebrow tracking + display negatives ──
      letterSpacing: {
        eyebrow:   '0.10em',
        label:     '0.12em',
        'tight-1': '-0.01em',
        'tight-2': '-0.02em',
        'tight-3': '-0.03em',
      },

      // ─── Motion — calm, no springs ──
      transitionTimingFunction: { 'out-bai': 'cubic-bezier(0.22, 0.61, 0.36, 1)' },
      transitionDuration: { fast: '120ms', base: '180ms', slow: '240ms' },

      // ─── Content column (hero + homepage) ──
      maxWidth: { content: '1180px' },
    },
  },
  plugins: [],
}

export default config
