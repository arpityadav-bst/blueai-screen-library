## 67 Welcome (signed out)

**Status:** Changed from V2.

**Why:** V2's welcome is dressed in a third visual family, creator-brand (`moneymaker.jsx:15-21`): Space Grotesk 27/700 (`:153`), a perspective grid, orbs and grain (`:135-137`), a hero logo with a cursor morph (`:142`), a gradient pill with a glow (`:184`), and a 5.9 s intro (`:125-128`) that plays behind the terms sheet where nobody sees it. Its "Terms & Conditions" link is a dead button at 2.41:1 (`:200-204`). A partner meets three typographic identities in their first minute. The PM's two steps are the right amount of explanation and stay word for word.

### Welcome (Changed from V2)

- **Purpose:** the signed-out start, on the site's DNA: one promise, two steps, one action; the Program Terms sheet over it on first run.
- **Anatomy:**
  1. Ground `--v2-canvas`, padding 40 24 16; no decoration. AppFrame chrome-free (no top bar, no nav).
  2. BrandMark 48, logo only (the title does the talking).
  3. Title 24/600 ink, leading 1.2, `-0.02em`, balanced, at most 320 wide, with one serif italic word in blue ink (`--v2-font-serif`, `--v2-blue-ink`, 1.06em: the site's title em, `onblue/onblue.css:1446-1453`).
  4. Steps: one Card (radius 16, 1px line, padding 16) holding an ordered list of two rows. Each row: a 28 step disc (`--v2-select` fill, `--v2-select-line` edge, ink figure 13/600, the site's step-num) and the step text 14 ink-2, first line centred on the disc.
  5. One Button, primary lg (44) full width: "Sign in to get started".
  6. Foot: a muted standalone Link "Program Terms" (13/500 ink-3, 32 target) that opens the legal page in a new tab.
- **Copy:** PM copy, verbatim. Title "An AI that turns your social accounts *into income.*" (`moneymaker.jsx:154`; decision D3: the site pays $30 for 20 days and the glossary bans "income"; if D3 follows the site, use the proposed "Put your BlueAI worker *to work.*"). Steps "Sign in with the same account you applied with." and "Run the BlueAI worker: it finds jobs and runs them for you." (`:51, 55`). Action "Sign in to get started" (`:187`). The link says Program Terms (glossary), not "Terms & Conditions".
- **Variants:** `headline` pm (default) or proposed.
- **Sizes:** the 419 window; compact 640 centres the same column in less height.
- **States:** first run (the Program Terms sheet over it, section 53); agreeing (sheet button loading); not saved (sheet error banner); after terms; reduced motion. In V2: the bare URL `index.html` (terms sheet), then Agree and continue.
- **Props:** `Welcome {terms: null | 'firstrun' | 'update', termsBusy, termsError, headline, onSignIn, onAgree, compact, reduced, preview, landmark}`; `Welcome.Body {headline, onSignIn, animate}` for screens drawn over it (sign-in).
- **Motion:** title, steps and action rise once with `.v2-anim-fade-up` (180 ms, `--v2-ease-out`), 120 ms apart (`.v2-delay-1`, `.v2-delay-2`); everything is in place by about 420 ms. Under reduced motion it is simply there.
- **Accessibility:** the title is the page h1; the list says "Step 1:" and "Step 2:" to screen readers (the discs are decorative); the action label is 4.92:1; the terms link is 6.0:1 (V2 2.41:1) with a 32 target and "(opens in a new tab)".
- **Responsive:** one centred column; the title balances its lines at any width.
- **Do / Don't:** Do keep the PM's steps and their order; open the Program Terms from the foot link; let the terms sheet come first on a first run. Don't add backdrop effects, a cursor morph or a gradient button; don't make the intro longer than reading the title takes; don't promise income (D3).
