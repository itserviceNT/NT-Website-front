"""Compose the site-wide Open Graph card from the fleet's own photography.

Built offline rather than with next/og so the build needs no font downloads.
"""
from PIL import Image, ImageDraw, ImageFont

SRC = '/Users/meret/NT-landing/public/images/gallery/ahts-platforms.jpg'
OUT = '/Users/meret/NT-landing/public/images/og-default.jpg'
W, H = 1200, 630

CONDENSED = '/System/Library/Fonts/Avenir Next Condensed.ttc'
MONO = '/System/Library/Fonts/Menlo.ttc'

img = Image.open(SRC).convert('RGB')

# cover-crop to the OG aspect
ratio = max(W / img.width, H / img.height)
img = img.resize((round(img.width * ratio), round(img.height * ratio)), Image.LANCZOS)
left = (img.width - W) // 2
top = max(0, (img.height - H) // 2)
img = img.crop((left, top, left + W, top + H))

# bottom-weighted scrim so the wordmark reads over any part of the photo
scrim = Image.new('L', (1, H))
for y in range(H):
    t = y / H
    scrim.putpixel((0, y), int(10 + 245 * (t ** 1.7)))
scrim = scrim.resize((W, H))
img = Image.composite(Image.new('RGB', (W, H), (6, 17, 26)), img, scrim)

draw = ImageDraw.Draw(img)
title = ImageFont.truetype(CONDENSED, 82, index=2)  # Demi Bold, upright
label = ImageFont.truetype(MONO, 23)

draw.text((72, H - 252), 'NURLY TOLKUN', font=label, fill=(239, 91, 53))
draw.line([(72, H - 214), (136, H - 214)], fill=(217, 59, 24), width=3)
draw.text((72, H - 188), 'Offshore marine support', font=title, fill=(255, 255, 255))
draw.text(
    (72, H - 82),
    'AHTS  ·  DSV  ·  CREW BOATS  ·  LIFTBOATS  ·  ROV',
    font=label,
    fill=(206, 219, 228),
)

img.save(OUT, 'JPEG', quality=88, optimize=True, progressive=True)
print(f'wrote {OUT} ({img.size[0]}x{img.size[1]})')
