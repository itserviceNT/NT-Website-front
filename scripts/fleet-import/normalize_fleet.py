"""Merge extracted PDF specs with the charter availability data into fleet.json."""
import json
import re
import unicodedata

PDF_BASE = 'https://nurlytolkun.com/wp-content/uploads/nt/fleet/'

CATEGORY_SLUG = {
    'LIFTBOATS & JACKUP BARGES': 'liftboats-jackup-barges',
    'CREW BOATS': 'crew-boats',
    'DSV-DP2 VESSELS': 'dsv-dp2-vessels',
    'AHTS VESSELS': 'ahts-vessels',
    'AHT & TUG VESSELS': 'aht-tug-vessels',
    'BARGES': 'barges',
    'CRANE VESSELS': 'crane-vessels',
    'ERR VESSELS': 'err-vessels',
    'ROV FLEET': 'rov-fleet',
}

CATEGORY_TYPE = {
    'LIFTBOATS & JACKUP BARGES': 'Liftboat / Jackup Barge',
    'CREW BOATS': 'Crew Boat',
    'DSV-DP2 VESSELS': 'DSV DP2',
    'AHTS VESSELS': 'AHTS',
    'AHT & TUG VESSELS': 'AHT / Tug',
    'BARGES': 'Barge',
    'CRANE VESSELS': 'Crane Vessel',
    'ERR VESSELS': 'ERRV',
    'ROV FLEET': 'ROV',
}

# Label variants across sheets -> canonical key. First match wins.
KEY_PATTERNS = [
    ('built', r'^built$'),
    ('classSociety', r'^class\b'),
    ('flag', r'^flag$'),
    ('lengthOverall', r'^length\s*(overall|o\.?a)'),
    ('beam', r'^(beam|breadth)\b'),
    ('depth', r'^depth\b'),
    ('draft', r'^draft\s*\(max\)|^draft$'),
    ('grt', r'^(grt|gross tonnage)\b'),
    ('nrt', r'^(nrt|net tonnage)\b'),
    ('dwt', r'^dwt\b'),
    ('mainEngines', r'^main\s*engines?\b'),
    ('bhp', r'horsepower|^bhp\b'),
    ('bollardPull', r'^bollard pull'),
    # 'Free/Open deck' rows give an area in m2; 'Clear deck space' often gives
    # LxW dimensions instead, so it is only a fallback.
    ('deckArea', r'(free|open) deck'),
    ('deckArea', r'deck (space|area)'),
    ('deckCargo', r'deck cargo|cargo capacity'),
    ('deckStrength', r'deck strength|allowable loading'),
    ('maxSpeed', r'^max(imum|\.)?\s*speed'),
    ('serviceSpeed', r'service speed'),
    ('dynamicPositioning', r'dynamic positioning'),
    ('fifi', r'^fire monitor|^fi-?fi'),
    ('berths', r'^berths|^total$|accommodations?$'),
]

NUMERIC = ('lengthOverall', 'beam', 'depth', 'draft', 'grt', 'nrt', 'dwt',
           'bhp', 'bollardPull', 'deckArea', 'deckCargo', 'maxSpeed',
           'serviceSpeed')


def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', text.lower())).strip('-')


def match_key(label):
    """Return (key, rank) for the highest-priority pattern this label matches."""
    low = label.lower().strip()
    for rank, (key, pattern) in enumerate(KEY_PATTERNS):
        if re.search(pattern, low):
            return key, rank
    return None, None


def to_number(value):
    # A label's parenthetical sometimes bleeds into the value
    # ('(approx. 35m x12.8m) 450 m2'); the real figure follows it.
    value = re.sub(r'^\s*\([^)]*\)\s*', '', value)
    # ',' is a thousands separator in '2,720 BHP' but a decimal point in
    # '59,25 m' - tell them apart by the digit count that follows.
    value = re.sub(r'(\d),(\d{3})(?!\d)', r'\1\2', value)
    value = re.sub(r'(\d),(\d{1,2})(?!\d)', r'\1.\2', value)

    # 'N x 1350 BHP' states a per-unit figure; the vessel total is the product.
    mult = re.match(r'\s*(\d{1,2})\s*[xX]\s*(\d{3,}(?:\.\d+)?)', value)
    if mult:
        return float(mult.group(1)) * float(mult.group(2))

    m = re.search(r'\d+(?:\.\d+)?', value)
    return float(m.group(0)) if m else None


def key_specs(sections):
    best = {}
    for fields in sections.values():
        for label, value in fields.items():
            key, rank = match_key(label)
            if key is None:
                continue
            value = value.strip()
            # Prefer the better-ranked pattern, and among equals prefer a value
            # carrying a unit over a bare dimension string.
            scored = (rank, 0 if re.search(r'm\s*[²2³3]|ton|knot', value, re.I) else 1)
            if key not in best or scored < best[key][0]:
                best[key] = (scored, value)
    specs = {k: v for k, (_, v) in best.items()}
    for key in NUMERIC:
        if key in specs:
            num = to_number(specs[key])
            if num is not None:
                specs[key + 'Value'] = num
    return specs


KEEP_UPPER = {'NT', 'NTMS', 'ROV', 'I', 'II', 'III', 'GAC', '300FT'}


def title_case(name):
    words = []
    for w in name.split():
        up = w.upper()
        words.append(up if up in KEEP_UPPER else w.capitalize())
    return ' '.join(words)


def norm_name(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())


ALIASES = {
    'tugboatntms12': 'ntms12',
    '300ftbargentms01': 'ntms01',
    'nttrip': 'gactrip',
    'pacificii': 'pasificii',
    'rovmohican': 'mohican',
    'rovdeeptrekker': 'deeptrekker',
    'rovseaeye': 'seaeye',
}


def press_index(vessels):
    idx = {}
    for v in vessels:
        key = norm_name(v['name'])
        idx[key] = v
    return idx


def main():
    specs = json.load(open('fleet_specs.json'))
    press = json.load(open('press_vessels.json'))
    pidx = press_index(press)

    fleet = []
    for item in specs:
        name = title_case(item['name'])
        key = norm_name(item['name'])
        p = pidx.get(key) or pidx.get(ALIASES.get(key, ''))
        sections = item['specSections']
        has_spec = bool(sections)

        entry = {
            'slug': slugify(item['name']),
            'name': name,
            'category': item['category'],
            'categorySlug': CATEGORY_SLUG[item['category']],
            'specSheetUrl': PDF_BASE + item['pdf'] if has_spec else None,
            'specSheetMissing': not has_spec,
            'keySpecs': key_specs(sections),
            'specSections': sections,
        }
        if p:
            # The charter sheet carries figures some spec sheets omit.
            ks = entry['keySpecs']
            for key, val in (('bhp', p.get('bhp')),
                             ('bollardPull', p.get('bpt') or p.get('bp')),
                             ('dynamicPositioning', p.get('dp')),
                             ('deckArea', p.get('deckArea'))):
                if val and key not in ks:
                    ks[key] = str(val)
                    num = to_number(str(val))
                    if num is not None and key in NUMERIC:
                        ks[key + 'Value'] = num
            entry['charter'] = {
                'type': p.get('type'),
                'status': p.get('status'),
                'region': p.get('region'),
                'location': p.get('location'),
                'bhp': p.get('bhp'),
                'bollardPull': p.get('bpt') or p.get('bp'),
                'dp': p.get('dp'),
                'deckArea': p.get('deckArea'),
                'cranes': p.get('cranes') or p.get('crane'),
                'equipment': p.get('equipment'),
            }
        entry['type'] = (p or {}).get('type') or CATEGORY_TYPE[item['category']]
        fleet.append(entry)

    json.dump(fleet, open('fleet.json', 'w'), indent=2, ensure_ascii=False)

    matched = sum(1 for f in fleet if 'charter' in f)
    print(f'vessels: {len(fleet)}  charter-data matched: {matched}')
    print(f'missing spec sheets: {[f["name"] for f in fleet if f["specSheetMissing"]]}')
    print('\nkey-spec coverage:')
    for key, _ in KEY_PATTERNS:
        n = sum(1 for f in fleet if key in f['keySpecs'])
        print(f'   {key:<20} {n}/{len(fleet)}')
    print('\nunmatched press vessels:',
          [p['name'] for p in press
           if norm_name(p['name']) not in {norm_name(f['name']) for f in fleet}
           and norm_name(p['name']) not in set(ALIASES.values())])


if __name__ == '__main__':
    main()
