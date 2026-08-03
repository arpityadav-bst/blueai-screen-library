"""Shared warm grade for all site props — DESIGN.md 'Texture'.
Takes a matted RGBA PNG, trims to content, applies ONE consistent warm grade,
resizes to web scale, exports .webp (+ .png fallback) into assets/cut/.

Usage: python grade.py <in_rgba.png> <out_basename>
"""
import sys
from pathlib import Path
from PIL import Image, ImageEnhance

MAX_EDGE = 880  # web display scale; props render <=440px, so 2x for retina

def grade(img: Image.Image) -> Image.Image:
    r, g, b, a = img.split()
    # warm grade: gentle lift in red, tiny cut in blue — same numbers for every asset
    r = r.point(lambda v: min(255, int(v * 1.035 + 2)))
    b = b.point(lambda v: max(0, int(v * 0.965)))
    out = Image.merge("RGBA", (r, g, b, a))
    out = ImageEnhance.Color(out).enhance(1.06)      # slight richness
    out = ImageEnhance.Contrast(out).enhance(1.03)   # slight snap
    return out

def main():
    src, name = Path(sys.argv[1]), sys.argv[2]
    outdir = Path(__file__).resolve().parent.parent / "cut"
    outdir.mkdir(exist_ok=True)
    img = Image.open(src).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    if max(img.size) > MAX_EDGE:
        s = MAX_EDGE / max(img.size)
        img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    img = grade(img)
    img.save(outdir / f"{name}.webp", "WEBP", quality=88, method=6)
    img.save(outdir / f"{name}.png", "PNG", optimize=True)
    print(f"GRADED {name} {img.size[0]}x{img.size[1]}")

if __name__ == "__main__":
    main()
