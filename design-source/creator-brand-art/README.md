# /creator-brand creators art — originals

The **unmodified** PNGs the shipped WebP files were derived from. Nothing here is served: this folder
is outside `public/`, so Next never bundles it. It exists so the derivatives can be regenerated, which
is not possible from the WebP alone — both transforms below are lossy and one of them is a colour
change that cannot be undone by eye.

They were previously untracked files in the shared `blueai/` checkout, i.e. one `git clean -fd` away
from gone, with no backup anywhere. That is the whole reason they are committed.

## What maps to what

| original (here) | ships as | transform |
|---|---|---|
| `hero-v5.png` | `public/creator-brand/creator-00-hero.webp` | background retone, then WebP q90 |
| `creator-01-apply.png` | `public/creator-brand/steps/creator-01-apply.webp` | WebP q90 |
| `creator-02-selected.png` | `public/creator-brand/steps/creator-02-selected.webp` | WebP q90 |
| `creator-03-setup-blueai.png` | `public/creator-brand/steps/creator-03-setup-blueai.webp` | WebP q90 |
| `creator-04-earn-monthly.png` | `public/creator-brand/steps/creator-04-earn-monthly.webp` | WebP q90 |

## The hero's retone, and why it is not optional

The delivered hero's background measured ~253 against this route's page colour of `#F9F9FA`
(249/249/250). The card sits on a radial mask whose alpha **never reaches 0 horizontally** — it bottoms
out at 0.686 — so a background brighter than the page stays at least 69% present all the way to the
edge, and it rendered as visible white bands down the left and right. Vertically the mask does reach
0, which is why only the sides showed it.

Fixed in the asset, not the mask: a linear per-channel scale mapping the measured background to the
page colour, with 0 held at 0. That lands the background on the page exactly and darkens everything
else by a uniform ~1.5%, which does not read. Edge delta went from about +3.0 to under 1 unit.

The mask is shared with the brands hero (`heroImageMask.ts`), whose own background is correctly inside
tolerance — changing it there to fix this would have moved a signed-off surface.

```python
from PIL import Image
import numpy as np
PAGE = np.array([249, 249, 250], float)          # layout.tsx page background
im  = Image.open('hero-v5.png').convert('RGB')
a   = np.asarray(im, float)
bg  = a[:10, :10].reshape(-1, 3).mean(0)          # measure, never assume
Image.fromarray(np.clip(a * (PAGE / bg), 0, 255).astype('uint8')) \
     .save('creator-00-hero.webp', 'WEBP', quality=90, method=6)
```

Step art needs no retone: it sits full-bleed inside a white card behind a hairline, where its own tone
reads as the media panel.

## If the hero is ever replaced

Re-measure both things, because a new asset has broken one or the other three times running:

1. **Background vs page** — sample the corner and compare to `#F9F9FA`.
2. **Subject vs frame** — check the mid-height composite at x=0 and x=20. An earlier version ran the
   subject and a shelving unit into the left edge and composited to −18.7 against the page, a visible
   vertical step where the subject simply stopped.

## Deliberately not kept

`step-images-v1` and `v2`, and the v3/v4 heroes, are all superseded and were left out — v2 is the set
rejected for drawing the engagement mechanics as labelled icons, which the brief rules out. They are
history, not provenance, and they were ~25 MB. If they are wanted, they were last in the shared
`blueai/` checkout under `public/creator-brand/`.
