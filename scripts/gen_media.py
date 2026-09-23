"""Generate abstract placeholder imagery (concrete / ochre / ink palette).
Purely procedural so the build has real pixels to push through WebGL.
"""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "media")
os.makedirs(OUT, exist_ok=True)

PALETTES = [
    # (base, mid, accent, deep)
    ((214, 210, 201), (150, 146, 137), (176, 118, 42), (18, 20, 24)),
    ((196, 197, 193), (110, 118, 118), (198, 143, 66), (12, 14, 16)),
    ((223, 217, 205), (163, 140, 108), (120, 92, 52), (24, 22, 20)),
    ((186, 190, 190), (96, 106, 110), (176, 118, 42), (14, 16, 18)),
    ((205, 200, 190), (128, 124, 116), (150, 96, 40), (20, 20, 22)),
    ((176, 178, 176), (88, 94, 96), (190, 134, 58), (10, 11, 12)),
]


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def vertical_gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", (1, h))
    px = img.load()
    for y in range(h):
        px[0, y] = lerp(top, bottom, y / max(1, h - 1))
    return img.resize(size, Image.BICUBIC)


def soft_shape(img, palette, seed):
    rnd = random.Random(seed)
    w, h = img.size
    layer = Image.new("RGB", (w, h), palette[1])
    d = ImageDraw.Draw(layer)
    for i in range(rnd.randint(3, 6)):
        cx = rnd.uniform(-0.2, 1.2) * w
        cy = rnd.uniform(-0.2, 1.2) * h
        r = rnd.uniform(0.25, 0.8) * min(w, h)
        col = [palette[2], palette[3], palette[0], palette[1]][i % 4]
        d.ellipse([cx - r, cy - r * rnd.uniform(0.5, 1.3), cx + r, cy + r], fill=col)
    layer = layer.filter(ImageFilter.GaussianBlur(radius=min(w, h) * 0.09))
    return Image.blend(img, layer, 0.62)


def architecture_bands(img, palette, seed):
    """Horizontal slab / louvre structure — reads as building section."""
    rnd = random.Random(seed + 99)
    w, h = img.size
    over = img.copy()
    d = ImageDraw.Draw(over, "RGBA")
    y = rnd.uniform(0.18, 0.34) * h
    while y < h * 0.95:
        thick = rnd.uniform(0.012, 0.05) * h
        inset = rnd.uniform(0.0, 0.22) * w
        shade = rnd.choice([palette[3], palette[1], palette[2]])
        alpha = rnd.randint(40, 165)
        d.rectangle([inset, y, w - rnd.uniform(0.0, 0.18) * w, y + thick],
                    fill=shade + (alpha,))
        y += thick + rnd.uniform(0.03, 0.12) * h
    over = over.filter(ImageFilter.GaussianBlur(radius=max(1, min(w, h) * 0.004)))
    return Image.blend(img, over, 0.9)


def light_sweep(img, seed):
    w, h = img.size
    rnd = random.Random(seed + 7)
    grad = Image.new("L", (w, h), 0)
    gd = ImageDraw.Draw(grad)
    x0 = rnd.uniform(-0.3, 0.7) * w
    for i in range(60):
        t = i / 59
        gd.polygon([
            (x0 + t * 0.5 * w, 0),
            (x0 + t * 0.5 * w + 0.08 * w, 0),
            (x0 + t * 0.5 * w + 0.34 * w, h),
            (x0 + t * 0.5 * w + 0.26 * w, h),
        ], fill=int(80 * (1 - abs(t - 0.5) * 2)))
    grad = grad.filter(ImageFilter.GaussianBlur(radius=w * 0.06))
    white = Image.new("RGB", (w, h), (255, 252, 245))
    return Image.composite(Image.blend(img, white, 0.35), img, grad)


def grain(img, amount=9, seed=0):
    w, h = img.size
    rnd = random.Random(seed)
    noise = Image.new("L", (w // 2, h // 2))
    noise.putdata([128 + int(rnd.gauss(0, amount)) for _ in range((w // 2) * (h // 2))])
    noise = noise.resize((w, h), Image.BILINEAR).convert("RGB")
    return ImageChops.overlay(img, noise)


def make(name, size, palette_idx, seed, dark=False):
    p = PALETTES[palette_idx % len(PALETTES)]
    top, bottom = (p[3], p[1]) if dark else (p[0], p[1])
    img = vertical_gradient(size, top, bottom)
    img = soft_shape(img, p, seed)
    img = architecture_bands(img, p, seed)
    img = light_sweep(img, seed)
    img = grain(img, 7, seed)
    img.save(os.path.join(OUT, name), quality=82, optimize=True, progressive=True)
    print(name, size)


PORTRAIT = (1200, 1600)
WIDE = (1920, 1080)
SQUARE = (1200, 1200)

for i in range(1, 7):
    make(f"p{i}.jpg", PORTRAIT, i - 1, i * 17)
    make(f"p{i}-wide.jpg", WIDE, i - 1, i * 31, dark=(i % 2 == 0))
    make(f"p{i}-still.jpg", (1600, 1000), i - 1, i * 53, dark=True)

for i in range(1, 13):
    make(f"c{i}.jpg", WIDE if i % 3 else PORTRAIT, i % 6, 500 + i * 13, dark=(i % 4 == 0))

for i in range(1, 7):
    make(f"g{i}.jpg", SQUARE, (i + 2) % 6, 900 + i * 7)

make("portrait-mb.jpg", (1200, 1500), 2, 4242)
