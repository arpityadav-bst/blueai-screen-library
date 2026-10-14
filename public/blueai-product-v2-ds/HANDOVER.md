# BlueAI Product V2: handover

For Abhisht. Short on purpose.

## What we did

1. **Your worker work is in V2.** Your branch `worker-day-done-and-modes` (a1108a8) was copied into V2 file for file. The only change: em dashes removed.
2. **V1 is gone.** V2 is the one product, at `/blueai-product-v2`.
3. **Your cash-out spec is in.** The $10 minimum is on the onBlue Agentic partner dashboard and in the Program Terms (marked as not legal's wording yet).
4. **We made a design system for V2.** It sits next to V2.
5. **V2 now equals your 14 Oct branch.** Your version won, so nothing needs copying back; the design system is re-synced to it (changelog, 14 Oct).

## How the system was made

Agents read every V2 file and listed every colour, size, screen and state. One plan came out of that. Builders made the parts, screens and docs from it. Reviewers then checked it in rounds and fixed what they found.

## What's in this folder

- `index.html`: the live guide. Every part, every state.
- `DESIGN.md`: the rules. Start here.
- `tokens.css` and `tokens-v2-today.css`: colours, type and spacing, as variables.
- `kit/`: ready parts (`window.V2Kit`), same tech as V2.
- `screens/`: whole screens built from the kit.
- `tools/ds-check.js`: checks the system still matches V2.

Every part is labelled **In V2** (already there), **Changed from V2** (a better version, with why) or **New** (not in V2 yet).

## How to use it

1. **Two looks.** "V2 today" matches V2 as it is. "Target" is the cleaner look. Build in "V2 today" so new screens match the rest of V2. Switch to "Target" once, when all of V2 uses the kit.
2. **New feature?** Read its part in DESIGN.md, use kit parts and tokens, start from the closest screen. Section 74 has the steps.
3. **Improving V2?** Section 73 lists recommendations, most important first, and the decisions that are yours (D1 to D19).
4. **After you change V2**, run `node tools/ds-check.js` in this folder. If it fails, the guide no longer matches V2: update it or tell Appy.
5. **Where to work.** You are a collaborator on this repo. Make a branch, change `public/blueai-product-v2/`, open a pull request.

## Links

- Guide: https://blueai-screen-library.vercel.app/blueai-product-v2-ds/index.html
- DESIGN.md: https://github.com/arpityadav-bst/blueai-screen-library/blob/main/public/blueai-product-v2-ds/DESIGN.md
- Folder: https://github.com/arpityadav-bst/blueai-screen-library/tree/main/public/blueai-product-v2-ds
