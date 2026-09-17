"""Pull the vessel photograph and deck plan out of each spec sheet.

Every sheet opens with a full-width photo of the vessel; some carry a general
arrangement drawing on a later page. Both are owned artwork we can publish.
"""
import io
import json
import os

from PIL import Image
from pypdf import PdfReader

OUT_PHOTO = 'images/vessels'
OUT_PLAN = 'images/plans'
MIN_PIXELS = 150_000


def is_line_drawing(img):
    """General arrangement drawings are ink on white: mostly blank, no colour."""
    small = img.convert('RGB').resize((96, 96), Image.BILINEAR)
    pixels = list(small.getdata())
    white = sum(1 for r, g, b in pixels if r > 225 and g > 225 and b > 225)
    saturation = sum(max(p) - min(p) for p in pixels) / len(pixels)
    # Scanned drawings are effectively greyscale; a pale photograph of a white
    # hull under overcast sky still carries real colour.
    return white / len(pixels) > 0.45 and saturation < 6


def is_photograph(img):
    """Photos are opaque RGB in a camera-like aspect; logos and the ISO badge
    carry an alpha channel, and header bands are far wider than they are tall.
    """
    w, h = img.size
    if img.mode != 'RGB' or w * h < MIN_PIXELS:
        return False
    if not 1.05 <= w / h <= 2.6:
        return False
    return not is_line_drawing(img)


def best_images(path):
    """Return (hero photo, deck plan, extra photos) from one spec sheet."""
    reader = PdfReader(path)
    photo = plan = None
    photo_area = plan_area = 0
    extras = []

    for index, page in enumerate(reader.pages):
        for image in page.images:
            try:
                img = Image.open(io.BytesIO(image.data))
            except Exception:
                continue
            w, h = img.size
            area = w * h

            if index == 0 and is_photograph(img):
                if area > photo_area:
                    if photo is not None:
                        extras.append(photo)
                    photo, photo_area = img, area
                continue

            if index > 0 and area >= MIN_PIXELS and img.mode == 'RGB':
                # A general arrangement drawing is the biggest later-page
                # drawing; further photographs go to the gallery.
                if is_line_drawing(img):
                    if area > plan_area:
                        plan, plan_area = img, area
                elif is_photograph(img):
                    extras.append(img)
    return photo, plan, extras


def save(img, path, max_width, quality=82):
    if img.mode not in ('RGB', 'L'):
        img = img.convert('RGB')
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, round(img.height * ratio)), Image.LANCZOS)
    img.save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
    return os.path.getsize(path)


def main():
    os.makedirs(OUT_PHOTO, exist_ok=True)
    os.makedirs(OUT_PLAN, exist_ok=True)
    fleet = json.load(open('fleet.json'))
    manifest = {v['name']: v for v in json.load(open('fleet_manifest.json'))}

    results = {}
    for vessel in fleet:
        entry = manifest.get(vessel['name'].upper()) or next(
            (m for k, m in manifest.items()
             if k.replace(' ', '') == vessel['name'].upper().replace(' ', '')),
            None,
        )
        if not entry:
            continue
        pdf = 'pdfs_fixed/' + entry['pdf']
        if not os.path.exists(pdf):
            print(f'  {vessel["slug"]:<22} no spec sheet')
            continue

        photo, plan, extras = best_images(pdf)
        record = {}
        if photo:
            save(photo, f'{OUT_PHOTO}/{vessel["slug"]}.jpg', 1600)
            record['photo'] = f'/images/vessels/{vessel["slug"]}.jpg'
            record['photoWidth'], record['photoHeight'] = photo.size
        if plan:
            save(plan, f'{OUT_PLAN}/{vessel["slug"]}.jpg', 1400, 78)
            record['plan'] = f'/images/plans/{vessel["slug"]}.jpg'
        if extras:
            record['extras'] = []
            for n, extra in enumerate(extras, start=2):
                name = f'{vessel["slug"]}-{n}.jpg'
                save(extra, f'{OUT_PHOTO}/{name}', 1600)
                record['extras'].append(f'/images/vessels/{name}')
        results[vessel['slug']] = record
        print(
            f'  {vessel["slug"]:<22} photo={"yes" if photo else "-":<4}'
            f' plan={"yes" if plan else "-":<4} extras={len(extras)}'
        )

    json.dump(results, open('vessel_images.json', 'w'), indent=2)
    have = sum(1 for r in results.values() if r.get('photo'))
    print(f'\nphotos: {have}/{len(fleet)}   plans: '
          f'{sum(1 for r in results.values() if r.get("plan"))}')


if __name__ == '__main__':
    main()
