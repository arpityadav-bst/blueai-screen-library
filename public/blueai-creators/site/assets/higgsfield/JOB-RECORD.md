# Higgsfield job record — Blue AI Creators site props

**Date:** 2026-08-03 · **Model:** `gpt_image_2` · 1:1 · 2k · quality high · 10 jobs
**Runner:** `../tools/hf_queue.sh` (respects the 4-concurrent plan limit; state in `jobs.tsv`, prompts in `prompts.tsv`)

Shared prompt tail: *"floating against a seamless pale warm-gray studio background, bright
high-key daylight, crisp sharp focus, soft gentle shadow, photographic, slightly playful
floating angle, no text, no logos, no labels, no watermark"* — plain bg for u2net matting,
blank surfaces because all text/data is CSS-overlaid, never model-rendered (carousel rule).

| Prop | Job id | Post |
|---|---|---|
| bills-fan | a00d1576-96aa-4515-bdf8-63e3485a2266 | matte f2/t0 |
| bill-roll | 31bd60f6-b121-411d-888e-c6e63deadba4 | matte f2/t0 |
| coin | c3fe4daa-7446-42f3-a5fd-345dfeff646f | re-matte f1/t0.45 (halo) |
| iced-coffee | 7c7f47f0-cecc-4846-b1d1-173760d5839c | matte f2/t0 |
| receipt · phone · soda-can · ringlight · tripod-phone · bag | see `jobs.tsv` | soda-can re-matte f1/t0.45 (halo) |

**Pipeline:** `raw/<n>.png` (2048² download) → `matte_u2net.py` → `matted/<n>.png` (RGBA)
→ `tools/grade.py` (trim, ≤880px, shared warm grade) → `cut/<n>.webp` + `.png`.
`raw/` and `matted/` are intermediates, deleted before commit — regenerate from the job ids
(results re-downloadable) or rerun the queue with the same prompts.
