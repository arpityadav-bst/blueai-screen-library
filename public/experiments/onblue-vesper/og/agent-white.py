# Builds og/agent-white.png, the cutout the blue cards use, from og/agent.png.
#
#   python og/agent-white.py
#
# WHITE, WITH THE ALPHA LIFTED. The agent is drawn in thin ASCII glyphs whose
# alpha is mostly partial (median 121 of 255). As grey ink on the light card
# that reads; as white on the blue band the same alpha is a faint haze. So the
# colour goes to pure white and the alpha is stretched: anything at or below 12
# is dropped as fringe, and the rest is scaled by 2.1, so the cores of the
# glyphs reach full white while their anti-aliased edges stay soft.
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
src = Image.open(os.path.join(HERE, "agent.png")).convert("RGBA")
alpha = src.getchannel("A").point(lambda v: 0 if v <= 12 else min(255, int((v - 12) * 2.1)))
out = Image.new("RGBA", src.size, (255, 255, 255, 0))
out.putalpha(alpha)
out.save(os.path.join(HERE, "agent-white.png"), optimize=True)
print("og/agent-white.png", out.size)
