import json, re

src = open('press.js', encoding='utf-8', errors='replace').read()

start = src.find('const e=[{name:"Caspian Sea"')
if start == -1:
    start = src.find('[{name:"Caspian Sea"')
start = src.index('[', start)

# walk braces/brackets respecting string literals to find the array end
depth = 0
i = start
in_str = None
while i < len(src):
    c = src[i]
    if in_str:
        if c == '\\':
            i += 2
            continue
        if c == in_str:
            in_str = None
    else:
        if c in '"\'`':
            in_str = c
        elif c in '[{':
            depth += 1
        elif c in ']}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    i += 1

raw = src[start:end]

# quote bare keys
out = re.sub(r'([{,])([A-Za-z_$][\w$]*):', r'\1"\2":', raw)
# replace bare identifier values (image:BC) with null
out = re.sub(r':\s*([A-Za-z_$][\w$]*)\s*([,}])', lambda m: ':null' + m.group(2)
             if m.group(1) not in ('true', 'false', 'null') else m.group(0), out)

data = json.loads(out)

vessels = []
for region in data:
    for v in region.get('vessels', []):
        v['region'] = region.get('name')
        v['regionContact'] = region.get('contact')
        vessels.append(v)

json.dump(data, open('press_regions.json', 'w'), indent=2, ensure_ascii=False)
json.dump(vessels, open('press_vessels.json', 'w'), indent=2, ensure_ascii=False)

print(f'regions: {len(data)} -> {[r["name"] for r in data]}')
print(f'vessels: {len(vessels)}')
keys = sorted({k for v in vessels for k in v})
print('fields:', keys)
for v in vessels:
    print(f'  {v["name"]:<18} {v.get("type",""):<32} {v.get("status","")}')
