"""Extract structured vessel specifications from the NT fleet spec sheets.

The sheets are two-column tables (label left, value right) grouped under
all-caps section headers that span only the left column.
"""
import json
import re
from collections import defaultdict

import pdfplumber

from ligatures import repair

FOOTER = re.compile(
    r'Dubai:|Abu Dhabi:|Ashgabat:|Turkmenbashy:|Hazar:|VESSEL SPECIFICATION|'
    r'The information contained|subject to change|P\.?O\.?BOX|'
    r'Tel:\s*\+|Fax:\s*\+|\|', re.I)

SKIP_SECTIONS = {'VESSEL SPECIFICATION SHEET'}


def group_lines(page):
    """Cluster words into visual rows by vertical overlap.

    Superscript units (the '3' of m³) sit higher than their baseline, so
    bucketing on rounded 'top' tears them off onto a row of their own.
    """
    words = sorted(page.extract_words(use_text_flow=False), key=lambda w: w['top'])
    rows = []
    for w in words:
        for row in rows:
            height = min(row['bottom'], w['bottom']) - max(row['top'], w['top'])
            if height > 0.35 * min(row['bottom'] - row['top'], w['bottom'] - w['top']):
                row['words'].append(w)
                row['top'] = min(row['top'], w['top'])
                row['bottom'] = max(row['bottom'], w['bottom'])
                break
        else:
            rows.append({'top': w['top'], 'bottom': w['bottom'], 'words': [w]})
    rows.sort(key=lambda r: r['top'])
    return [sorted(r['words'], key=lambda w: w['x0']) for r in rows]


def value_column_x(lines):
    """Find the x where the value column starts, from the widest intra-line gap."""
    gaps = []
    for ws in lines:
        for a, b in zip(ws, ws[1:]):
            gap = b['x0'] - a['x1']
            if gap > 25:
                gaps.append(round(b['x0']))
    if not gaps:
        return None
    gaps.sort()
    return gaps[len(gaps) // 2]


def join(words):
    return repair(' '.join(w['text'] for w in words)).strip()


def is_split_layout(lines, page_width):
    """True when the sheet packs two independent label/value tables side by side.

    The usual sheet has one value column; a split sheet shows column gaps on
    both halves of the page.
    """
    mid = page_width / 2
    left = right = 0
    for ws in lines:
        for a, b in zip(ws, ws[1:]):
            if b['x0'] - a['x1'] > 20:
                if b['x0'] < mid:
                    left += 1
                else:
                    right += 1
    return left >= 4 and right >= 4


def parse_page(page):
    lines = group_lines(page)
    if is_split_layout(lines, page.width):
        mid = page.width / 2
        halves = ([[w for w in ws if w['x0'] < mid] for ws in lines],
                  [[w for w in ws if w['x0'] >= mid] for ws in lines])
        out = []
        for half in halves:
            half = [ws for ws in half if ws]
            out.extend(parse_rows(half, value_column_x(half)))
        return out
    return parse_rows(lines, value_column_x(lines))


def parse_rows(lines, split_x):
    if split_x is None:
        return []
    out, section = [], None
    for ws in lines:
        left = [w for w in ws if w['x0'] < split_x - 12]
        right = [w for w in ws if w['x0'] >= split_x - 12]
        ltxt, rtxt = join(left), join(right)
        if not ltxt and not rtxt:
            continue
        if FOOTER.search(ltxt) or FOOTER.search(rtxt):
            continue
        letters = re.sub(r'[^A-Za-z]', '', ltxt)
        # all-caps line with nothing in the value column = section header
        if ltxt and not rtxt and letters and letters.isupper() and len(letters) > 3:
            if ltxt.upper() not in SKIP_SECTIONS:
                section = ltxt
            continue
        if ltxt and rtxt:
            out.append((section, ltxt, rtxt))
        elif rtxt and out:
            # continuation of the previous value
            sec, k, v = out[-1]
            out[-1] = (sec, k, f'{v} {rtxt}')
    return out


def extract(path):
    sections = {}
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            for section, key, value in parse_page(page):
                sec = section or 'General'
                key = key.rstrip(':').strip()
                if not key or not value:
                    continue
                bucket = sections.setdefault(sec, {})
                bucket[key] = f'{bucket[key]} {value}'.strip() if key in bucket else value
    return sections


if __name__ == '__main__':
    manifest = json.load(open('fleet_manifest.json'))
    results, missing = [], []
    for v in manifest:
        path = 'pdfs_fixed/' + v['pdf']
        try:
            spec = extract(path)
        except FileNotFoundError:
            missing.append(v['name'])
            spec = {}
        except Exception as exc:
            print(f"  ERROR {v['name']}: {exc}")
            spec = {}
        fields = sum(len(s) for s in spec.values())
        results.append({**v, 'specSections': spec, 'fieldCount': fields})
        flag = '  (spec sheet 404 on live site)' if v['name'] in missing else ''
        print(f"  {v['name']:<22} sections={len(spec):<2} fields={fields:<3}{flag}")

    json.dump(results, open('fleet_specs.json', 'w'), indent=2, ensure_ascii=False)
    total = sum(r['fieldCount'] for r in results)
    print(f'\ntotal fields: {total}  |  vessels with specs: '
          f'{sum(1 for r in results if r["fieldCount"])}/{len(results)}')
    print(f'missing spec sheets (404): {missing}')
