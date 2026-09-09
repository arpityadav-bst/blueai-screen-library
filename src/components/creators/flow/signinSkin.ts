// THE SIGN-IN DIALOG'S PALETTE, shared by both of its levels (2026-09-02).
//
// It lived inside SignInDialog.tsx until the dialog grew a first level (Expectations.tsx) that has
// to look like the same card - same surface, same ink tiers, same field and CTA treatment - because
// the two slide into each other. Two components each holding a copy of these values is how the two
// halves of one dialog start disagreeing about what "muted" means.
//
// A PALETTE OBJECT RATHER THAN CSS TOKENS, still. Both levels paint with inline styles and Tailwind
// utilities rather than the .crx kit, so var(--sur) would resolve to nothing on most of these and
// CSS overrides would be fighting utility specificity. Two literal sets, taken from the same DS
// values the light block uses, is the honest shape for components built this way.

export const SKIN = {
  dark: {
    card: '#1F1F23',
    ink: '#fff',
    ink70: 'rgba(255,255,255,0.7)',   // sub-heading
    ink80: 'rgba(255,255,255,0.8)',   // field label
    ink40: 'rgba(255,255,255,0.4)',   // separator + legal
    rule: 'rgba(255,255,255,0.2)',    // hairlines
    tileLine: 'transparent',          // the white provider tiles need no edge on a dark card
    accent: '#7B4CFF',
    wash: 'rgba(123,76,255,0.16)',    // the tint behind an icon
    field:
      'border-white/50 bg-black/20 text-white placeholder:text-white/40 hover:border-white/80' +
      ' focus:border-[#7B4CFF] focus:shadow-[0_0_0_3px_rgba(123,76,255,0.25)]',
  },
  light: {
    card: '#ffffff',
    ink: 'rgb(8,10,31)',
    ink70: 'rgb(55,58,88)',
    ink80: 'rgb(43,46,76)',
    ink40: 'rgb(106,110,136)',
    rule: 'rgb(223,228,238)',
    // On white, the Apple and Google tiles ARE white - without an edge they are two invisible
    // buttons in a row of four. Discord and Facebook keep their brand fills and ignore this.
    tileLine: 'rgb(223,228,238)',
    accent: '#7B4CFF',
    wash: 'rgba(123,76,255,0.08)',
    field:
      'border-[#cdd4e2] bg-white text-[rgb(8,10,31)] placeholder:text-[rgb(106,110,136)] hover:border-[#7B4CFF]' +
      ' focus:border-[#7B4CFF] focus:shadow-[0_0_0_3px_rgba(123,76,255,0.18)]',
  },
} as const

export type Skin = (typeof SKIN)[keyof typeof SKIN]

/** The 0.8px ring around the card - the one visual the card kept from the now.gg original. */
export const RING = '#7B4CFF'

/** THE PAGE'S PRIMARY, not the replica's (Appy, 2026-09-02: "is it the same as the primary cta on
 *  hero page?" - it was not). The dialog carried now.gg's own auth button: a two-stop iris -> cyan
 *  gradient at 270deg, an 8px radius, 600 weight, no shadow. It survived because everything about
 *  the card was once a faithful copy; with the branding, the waves and the dark surface all gone, it
 *  was the last piece still speaking now.gg's design language.
 *  These three are creators.css's --cta-grad, .btn's radius and .btn's shadow, copied as literals
 *  because this card paints outside the .crx scope with inline styles and cannot reach a CSS token.
 *  THE TOKEN IS THE SOURCE OF TRUTH: if --cta-grad or .btn's shadow changes, change these with it. */
export const CTA = 'linear-gradient(105deg, #1a90ff 0%, #6b53ff 55%, #7b4cff 100%)'
export const CTA_SHADOW = '0 10px 30px -6px rgba(95, 70, 255, 0.65)'

/**
 * TWO WIDTHS NOW, and the shared one is gone (Appy, 2026-09-09: "the login and sign up width is
 * pretty big... we need the same width which was there earlier").
 *
 * The history is worth keeping because it explains why they were ever one number. 360 was the
 * now.gg original's measured width; 400 came on 2026-09-02 when level 1 needed room for three
 * explained rows; both levels moved together on the argument that a width changing mid-slide would
 * jar. Level 1 then became three side-by-side cards and needed 540 to hold a sentence in each, and
 * dragging the sign-in card to 540 with it made a single email field and one button sit in a box
 * nearly half again too wide - which jars more than the slide ever did.
 *
 * SO THE RULE IS RETIRED, not bent: the two levels are no longer the same object at two stages,
 * they are a row of cards and a form, and a form has its own right measure. The slide between them
 * now resizes, which is the cost and is visible; it is the smaller of the two.
 */
export const CARD_WIDTH = 'max-w-[660px]'      // level 1, the three expectation cards
export const FORM_WIDTH = 'max-w-[400px]'      // level 2, the sign-in form

/** Poppins is the card's face because the now.gg original set it; both levels share it so the slide
 *  between them does not change typeface mid-dialog. Whether the dialog should move to the site's
 *  own Inter now that it is no longer a replica is a separate call, not made here. */
export const CARD_FONT = "'Poppins', sans-serif"
