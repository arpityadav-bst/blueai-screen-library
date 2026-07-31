# -*- coding: utf-8 -*-
# Regenerates the MECHANICAL blocks of §2 "Reconciled Row Accounting" purely by parsing the live
# §3 matrix — the raw validation-output block, the status-count table, and the area-count table.
# The historical narrative paragraphs (what changed 115->125->124->125 and why) are a changelog of
# one-time past deltas, not re-derived data, and are left untouched.
#
# Idempotent: if §3 hasn't changed since the last run, this produces byte-identical numbers.
import re
from collections import Counter

MAIN = 'N:\\Antigravity Main\\blueai\\visual-designer\\audits\\parity-audit-state-machine.html'
EXPECTED_ROWS = 125

AREA_NAMES = {
    'A': 'A &middot; Global Chrome',
    'B': 'B &middot; Authentication',
    'C': 'C &middot; Credits &amp; Account Status',
    'D': 'D &middot; Chat',
    'E': 'E &middot; Jobs',
    'F': 'F &middot; Skills',
    'G': 'G &middot; Schedule',
    'H': 'H &middot; Settings incl. Telegram &amp; AI Mode',
    'I': 'I &middot; Account &amp; Help',
    'J': 'J &middot; Boot &amp; Onboarding',
}
AREA_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

with open(MAIN, encoding='utf-8') as f:
    html = f.read()

rows = re.findall(r'<tr><td class="id">([^<]+)</td>(.*?)</tr>', html)
ids = [r[0] for r in rows]
dupes = sorted(set(i for i in ids if ids.count(i) > 1))

status_by_id = {}
no_primary, multi_primary = [], []
for rid, rest in rows:
    tds = re.findall(r'<td class="chip ([a-z-]+)">', rest)
    if len(tds) == 0:
        no_primary.append(rid)
        status_by_id[rid] = None
    else:
        if len(tds) > 1:
            multi_primary.append((rid, tds))
        status_by_id[rid] = tds[0]

# Slugs confirmed against the file's OWN .chip.<slug> CSS rules (lines ~70-84) — not guessed.
# Note CSS also defines .chip.adapt, which is unused dead CSS; the matrix actually uses .chip.visadapt.
STATUS_LABELS = {
    'present': 'PRESENT', 'mstate': 'MISSING STATE', 'mentry': 'MISSING ENTRY',
    'partial': 'PARTIAL', 'obsolete': 'OBSOLETE', 'mtrans': 'MISSING TRANSITION',
    'dev': 'DEV-ONLY', 'visadapt': 'PRESENT VISUALLY ADAPTED',
    'incomplete': 'REFERENCE INCOMPLETE', 'unreach': 'SOURCE-DESIGNED, UNREACHABLE',
    'mexit': 'MISSING EXIT-CANCEL', 'entry': 'PRESENT DIFFERENT ENTRY',
    'mresult': 'MISSING RESULT STATE', 'decision': 'DECISION REQUIRED',
}
# Fixed presentation order (curated, NOT sort-by-count — e.g. PARTIAL=5 intentionally precedes
# OBSOLETE=6 in the established table). Every one of these 14 always renders, even at count 0
# (DECISION REQUIRED is meant to visibly read "0" as proof it was resolved, not disappear).
STATUS_ORDER = [
    'PRESENT', 'MISSING STATE', 'MISSING ENTRY', 'PARTIAL', 'OBSOLETE', 'MISSING TRANSITION',
    'DEV-ONLY', 'PRESENT VISUALLY ADAPTED', 'REFERENCE INCOMPLETE', 'SOURCE-DESIGNED, UNREACHABLE',
    'MISSING EXIT-CANCEL', 'PRESENT DIFFERENT ENTRY', 'MISSING RESULT STATE', 'DECISION REQUIRED',
]


def id_sort_key(rid):
    m = re.match(r'^([A-Z]+)(\d+)$', rid)
    if m:
        return (m.group(1), 0, int(m.group(2)), '')
    m2 = re.match(r'^([A-Z]+)-(.+)$', rid)
    if m2:
        return (m2.group(1), 1, 0, m2.group(2))
    return (rid, 2, 0, '')


by_status = {}
for rid, slug in status_by_id.items():
    label = STATUS_LABELS.get(slug, slug or 'UNKNOWN')
    by_status.setdefault(label, []).append(rid)

area_by_id = {rid: (re.match(r'([A-Z]+)', rid).group(1) if re.match(r'([A-Z]+)', rid) else rid) for rid in ids}
area_counts = Counter(area_by_id.values())

status_sum = sum(len(v) for v in by_status.values())
area_sum = sum(area_counts.values())

# ---- raw validation block ----
raw_block = f"""Total matrix rows found: {len(rows)}
Unique IDs: {len(set(ids))}
Duplicate IDs: {dupes}
Rows with NO primary status: {no_primary}
Rows with MULTIPLE primary statuses: {multi_primary}

Status-count sum:  {status_sum}
Area-count sum:    {area_sum}
Grand total match: {status_sum} == {area_sum} == {len(rows)}  {'✓ CONFIRMED EQUAL' if status_sum == area_sum == len(rows) else '✗ MISMATCH'}

(Parsed from the live file via regex: rows = findall(r'&lt;tr&gt;&lt;td class="id"&gt;([^&lt;]+)&lt;/td&gt;(.*?)&lt;/tr&gt;'); primary status = the sole findall(r'&lt;td class="chip ([a-z-]+)"&gt;') match per row. Re-run: tools/generate_layer_a.py against parity-audit-state-machine.html.)"""

# ---- status table, fixed curated order, every known status shown even at count 0 ----
unknown_labels = set(by_status.keys()) - set(STATUS_ORDER)
if unknown_labels:
    raise SystemExit(f"Found status label(s) not in STATUS_ORDER — add them before trusting this output: {unknown_labels}")

status_rows_html = []
for label in STATUS_ORDER:
    rids = by_status.get(label, [])
    ids_str = ', '.join(sorted(rids, key=id_sort_key)) if rids else '&mdash;'
    status_rows_html.append(
        f'<tr><td>{label}</td><td class="num">{len(rids)}</td>'
        f'<td style="text-align:left;font-family:var(--mono);font-size:10px;">{ids_str}</td></tr>'
    )
status_table = '\n  '.join(status_rows_html)

# ---- area table ----
area_rows_html = []
for letter in AREA_ORDER:
    if letter in area_counts:
        area_rows_html.append(f'<tr><td>{AREA_NAMES[letter]}</td><td class="num">{area_counts[letter]}</td></tr>')
area_table = '\n  '.join(area_rows_html)

# ---- splice into the HTML ----
html2 = html
# raw validation output block
html2 = re.sub(
    r'(<div class="finding-head"><span class="finding-title">Raw validation output</span>.*?padding:14px;">)(.*?)(</td></tr></table></div>)',
    lambda m: m.group(1) + raw_block + m.group(3), html2, count=1, flags=re.S,
)
# status table (also rewrites "Sum of all N status rows above = M" — not left as stale static text)
html2 = re.sub(
    r'(<tr><th>Status</th><th>Count</th><th>Row IDs</th></tr>\n  )(.*?)'
    r'(\n  <tr><td><b>Grand total</b></td><td class="num"><b>)\d+(</b></td><td><b>Sum of all )\d+( status rows above = )\d+( )',
    lambda m: m.group(1) + status_table + m.group(3) + str(status_sum) + m.group(4) + str(len(STATUS_ORDER)) + m.group(5) + str(status_sum) + ' ',
    html2, count=1, flags=re.S,
)
# area table
html2 = re.sub(
    r'(<tr><th>Area</th><th>Count</th></tr>\n  )(.*?)(\n  <tr><td><b>Grand total</b></td><td class="num"><b>Sum of all )\d+( areas above = )\d+( ✓)',
    lambda m: m.group(1) + area_table + m.group(3) + str(len(area_counts)) + m.group(4) + str(area_sum) + m.group(5),
    html2, count=1, flags=re.S,
)

if html2 == html:
    print('No changes — §2 already matches a fresh parse (idempotent no-op).')
else:
    with open(MAIN, 'w', encoding='utf-8') as f:
        f.write(html2)
    print('§2 regenerated.')

print(f'Rows: {len(rows)} | unique: {len(set(ids))} | duplicates: {dupes}')
print(f'Status sum: {status_sum} | Area sum: {area_sum} | match: {status_sum == area_sum == len(rows)}')
if len(rows) != EXPECTED_ROWS:
    print(f'WARNING: expected {EXPECTED_ROWS} rows, found {len(rows)} — Layer A matrix changed, review before trusting downstream Layer B validation')
