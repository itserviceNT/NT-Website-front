"""Repair ligature corruption in the NT vessel spec PDFs.

Each PDF embeds a subset font whose ToUnicode CMap maps ligature glyphs to
arbitrary ASCII, and the chosen character differs per document: 'Dra5', 'Dra6'
and 'Dra9' all mean 'Draft'; 'Foo?ng', 'SeaHng' and 'LaVce' mean 'Footing',
'Seating' and 'Lattice'. Rather than hardcode every pair, substitute each
candidate ligature and keep the reading that is a real word.
"""
import re
from functools import lru_cache

CANDIDATES = ('ti', 'tt', 'tti', 'ft', 'fi', 'fl', 'ff', 'ffi', 'tu', 'ttu')

DOMAIN_WORDS = {
    'draft', 'aft', 'footing', 'seating', 'lattice', 'afloat', 'lifting',
    'positioning', 'conditioning', 'conditioned', 'conditions', 'estimated',
    'consumption', 'certification', 'classification', 'specification',
    'registration', 'accommodation', 'accommodations', 'circulation',
    'operations', 'navigation', 'capacities', 'vertical', 'office',
    'reduction', 'rating', 'quantity', 'magnetic', 'lifeboat', 'firefighting',
    'certified', 'identification', 'information', 'protection', 'detection',
    'section', 'suction', 'friction', 'notation', 'rotation', 'station',
    'stations', 'multiplier', 'fitted', 'fittings', 'outfitting', 'shifting',
    'floating', 'flat', 'fixed', 'efficiency', 'anti', 'continuous',
}


@lru_cache(maxsize=1)
def _dictionary():
    words = set(DOMAIN_WORDS)
    try:
        with open('/usr/share/dict/words', encoding='utf-8', errors='ignore') as fh:
            words.update(w.strip().lower() for w in fh if len(w.strip()) > 2)
    except OSError:
        pass
    return words


def _is_word(token):
    return token.lower() in _dictionary()


# A stray char sitting inside a lowercase run ('Foo?ng', 'SeaHng') is almost
# always a mangled ligature. The same char at the end of a run ('Dra5') may
# instead be legitimate ('m2', 'C9'), so those are only repaired on a
# dictionary hit.
INNER = re.compile(r'(?<=[a-z])([A-Z0-9?&$@%*V])(?=[a-z])')
TRAILING = re.compile(r'(?<=[a-z])([A-Z0-9?&$@%*V])(?![A-Za-z])')

EXPLICIT = {'consumpaon': 'consumption', 'Consumpaon': 'Consumption'}


def _dictionary_fix(token, pattern):
    for match in pattern.finditer(token):
        i = match.start(1)
        for lig in CANDIDATES:
            cand = token[:i] + lig + token[i + 1:]
            if _is_word(cand) or _is_word(cand.rstrip('s')):
                return cand
    return None


def repair_word(token):
    if token in EXPLICIT:
        return EXPLICIT[token]
    fixed = _dictionary_fix(token, INNER)
    if fixed:
        return fixed
    fixed = _dictionary_fix(token, TRAILING)
    if fixed:
        return fixed
    # Without a dictionary hit, only non-letter strays ('Foo?ng') are safe to
    # assume corrupt. A capital mid-word is usually deliberate CamelCase -
    # 'ComNav' and 'McMurdo' are equipment brands, not broken ligatures.
    match = INNER.search(token)
    if match and not match.group(1).isalpha():
        return token[:match.start(1)] + 'ti' + token[match.end(1):]
    return token


LIG_CHARS = {'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl',
             'ﬃ': 'ffi', 'ﬄ': 'ffl'}


def repair(text):
    if not text:
        return text
    for k, v in LIG_CHARS.items():
        text = text.replace(k, v)
    text = text.replace('Of#ice', 'Office').replace('of#ice', 'office')
    text = re.sub(r'#(?=(loor|lat|ight|ag\b))', 'fl', text)
    out = re.sub(r"[A-Za-z][A-Za-z0-9?&$@%*]*", lambda m: repair_word(m.group(0)), text)
    return out.replace('–', '-').replace('’', "'")


if __name__ == '__main__':
    tests = ['Dra5 (Max)', 'Dra6 (Max)', 'Dra9 (Max)', 'Foo?ng Length',
             'Passenger SeaHng Area', 'LaVce Boom', 'Reduc?on Gear',
             'Es?mated Service Speed', 'Air CondiHoning', 'MagneHc Compass',
             'Quan?ty', 'Total Jacking / Holding Ra?ng', 'Max. Sea Condi?ons',
             'Crew Accommoda?ons', 'A/Econsumpaon', 'Aﬂoat', 'posiMoning',
             'Length Overall', 'Bollard Pull', '5150 BHP', '2 x CAT 3516 B-TA']
    for t in tests:
        print(f'  {t:<34} -> {repair(t)}')
