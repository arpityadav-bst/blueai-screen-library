# -*- coding: utf-8 -*-
# Strict validator. Exits non-zero and prints every violation if anything is inconsistent.
# This is the gate that must pass before any HTML is generated from the manifest.
#
# Rev 2 (integrity fix): the previous version had a RETROACTIVE BYPASS — a record with
# assertions.retroactive=True was accepted regardless of assertions.passed, and a record with
# dimensions=None was silently skipped rather than flagged. Both are removed. Every record must
# now have assertions.passed===True with zero exceptions, and every record must carry all 8
# dimension slots (never null). There is no "grandfathered" category anymore.
import json, re, os, sys

MAIN = 'N:\\Antigravity Main\\blueai\\visual-designer\\audits\\parity-audit-state-machine.html'
EVID = 'N:\\Antigravity Main\\blueai\\visual-designer\\audits\\evidence\\layer-b'
REPORT_PATH = EVID + '\\validation-report.txt'
DIMS = ['icons', 'spacing', 'color', 'typography', 'overlay', 'buttons', 'controls', 'layout']
VALID_STATUS = {'PASS', 'ISSUE', 'N/A', 'NI'}
EXPECTED_LAYER_A_ROWS = 125
LAYER_B_MARKER_RE = re.compile(r'<!--LAYER_B_VALIDATED_TOTALS_JSON\n(.*?)\n-->', re.S)

# Report file is written directly with explicit UTF-8 encoding — never via shell stdout
# redirection, which depends on the ambient console codepage and can silently mangle non-ASCII
# characters (confirmed: an em-dash came through as a replacement character via `> file.txt`
# under the Windows terminal's default codepage even though this script's own source is UTF-8).
_report_lines = []


def log(msg=''):
    print(msg)
    _report_lines.append(str(msg))


def flush_report():
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(_report_lines) + '\n')


errors = []

# ============================================================================
# LAYER A — parse the live matrix, check internal consistency
# ============================================================================
with open(MAIN, encoding='utf-8') as f:
    html = f.read()
rows = re.findall(r'<tr><td class="id">([^<]+)</td>(.*?)</tr>', html)
layerA_ids = set()
layerA_status = {}
layerA_dupes = []
for rid, rest in rows:
    tds = re.findall(r'<td class="chip ([a-z-]+)">', rest)
    if rid in layerA_ids:
        layerA_dupes.append(rid)
        errors.append(f"Layer A: duplicate matrixId {rid}")
    layerA_ids.add(rid)
    layerA_status[rid] = tds[0] if tds else None
if len(rows) != EXPECTED_LAYER_A_ROWS:
    errors.append(f"Layer A: expected {EXPECTED_LAYER_A_ROWS} rows, found {len(rows)}")

# ============================================================================
# LAYER B — load manifest, validate every record
# ============================================================================
with open(EVID + '\\manifest.json', encoding='utf-8') as f:
    manifest = json.load(f)

seen_vids = set()
seen_screenshots_referenced = set()
retroactive_count = 0
failed_assertion_count = 0
missing_assertion_count = 0
passed_assertion_count = 0
missing_dims_count = 0
wrong_dim_shape_count = 0
unexplained_dim_result_count = 0
invalid_id_count = 0
duplicate_vid_count = 0

for i, r in enumerate(manifest):
    ctx = f"record[{i}] ({r.get('visualInstanceId', '?')})"
    vid = r.get('visualInstanceId')
    if not vid:
        errors.append(f"{ctx}: missing visualInstanceId")
    elif vid in seen_vids:
        duplicate_vid_count += 1
        errors.append(f"{ctx}: duplicate visualInstanceId {vid}")
    else:
        seen_vids.add(vid)

    mid = r.get('matrixId', '')
    if not re.match(r'^[A-Z]\d+$', mid):
        invalid_id_count += 1
        errors.append(f"{ctx}: matrixId '{mid}' is not a valid single-letter+number Layer A ID")
    elif mid not in layerA_ids:
        invalid_id_count += 1
        errors.append(f"{ctx}: matrixId '{mid}' does not exist in Layer A's {EXPECTED_LAYER_A_ROWS} rows")

    # filename/manifest field agreement
    fname = r.get('screenshot')
    if not fname:
        errors.append(f"{ctx}: no screenshot field")
    else:
        seen_screenshots_referenced.add(fname)
        fpath = os.path.join(EVID, fname)
        if not os.path.exists(fpath):
            errors.append(f"{ctx}: screenshot file missing on disk: {fname}")
        if r.get('theme') and r['theme'] not in fname:
            errors.append(f"{ctx}: filename '{fname}' does not contain theme '{r['theme']}'")
        if r.get('breakpoint') and r['breakpoint'] not in fname:
            errors.append(f"{ctx}: filename '{fname}' does not contain breakpoint '{r['breakpoint']}'")

    # --- assertions: NO retroactive bypass. Every record must have passed===True. ---
    assertions = r.get('assertions')
    if assertions is None:
        missing_assertion_count += 1
        errors.append(f"{ctx}: no assertions field at all — every instance must carry real, passed assertions")
    elif assertions.get('retroactive'):
        retroactive_count += 1
        errors.append(f"{ctx}: assertions.retroactive=True — retroactive/unverified records are NOT accepted, must be recaptured")
    elif assertions.get('passed') is not True:
        failed_assertion_count += 1
        errors.append(f"{ctx}: assertions.passed is not True (value={assertions.get('passed')!r})")
    else:
        passed_assertion_count += 1
        observed = assertions.get('observed') or {}
        spec = assertions.get('spec') or {}
        # required observed fields always present regardless of spec shape
        if 'observedWide' not in observed:
            errors.append(f"{ctx}: assertions.observed missing breakpoint/.wide check")
        if 'observedTheme' not in observed:
            errors.append(f"{ctx}: assertions.observed missing theme check")
        if spec.get('expectActiveTopTab') and 'observedActiveTopTab' not in observed:
            errors.append(f"{ctx}: spec required expectActiveTopTab but no observedActiveTopTab recorded")
        if spec.get('expectActiveSubtab') and 'observedActiveSubtab' not in observed:
            errors.append(f"{ctx}: spec required expectActiveSubtab but no observedActiveSubtab recorded")
        if spec.get('expectSelectorVisible') and 'selectorVisibleShown' not in observed:
            errors.append(f"{ctx}: spec required expectSelectorVisible but no selectorVisibleShown recorded")
        if spec.get('expectSelectorAbsent') and 'selectorAbsentIsAbsent' not in observed:
            errors.append(f"{ctx}: spec required expectSelectorAbsent but no selectorAbsentIsAbsent recorded")

    # --- dimensions: NEVER null. Exactly the 8 expected keys, no more, no less. ---
    dims = r.get('dimensions')
    if dims is None:
        missing_dims_count += 1
        errors.append(f"{ctx}: dimensions is null — every instance must carry all 8 dimension slots")
    else:
        keys = set(dims.keys())
        if keys != set(DIMS):
            wrong_dim_shape_count += 1
            missing = set(DIMS) - keys
            extra = keys - set(DIMS)
            errors.append(f"{ctx}: dimensions has wrong key set (missing={sorted(missing)}, extra={sorted(extra)})")
        for d in DIMS:
            if d not in dims:
                continue
            entry = dims[d]
            status = entry.get('status')
            if status not in VALID_STATUS:
                unexplained_dim_result_count += 1
                errors.append(f"{ctx}.{d}: invalid/missing status '{status}'")
                continue
            if status in ('PASS', 'ISSUE') and not entry.get('evidence'):
                unexplained_dim_result_count += 1
                errors.append(f"{ctx}.{d}: {status} with no evidence reference")
            if status in ('N/A', 'NI') and not entry.get('reason'):
                unexplained_dim_result_count += 1
                errors.append(f"{ctx}.{d}: {status} with no reason")

# ============================================================================
# Cross-checks: orphan / missing screenshots
# ============================================================================
all_pngs = set(f for f in os.listdir(EVID) if f.endswith('.png'))
unreferenced = all_pngs - seen_screenshots_referenced
missing_files = seen_screenshots_referenced - all_pngs
if unreferenced:
    errors.append(f"Orphan PNG files on disk (not referenced by any manifest record): {sorted(unreferenced)}")
if missing_files:
    errors.append(f"Manifest references screenshots missing on disk: {sorted(missing_files)}")

# ============================================================================
# Compute exact totals (single source of truth for the HTML generator)
# ============================================================================
by_mid = {}
for r in manifest:
    by_mid.setdefault(r['matrixId'], []).append(r)

total_instances = len(manifest)
scored_instances = [r for r in manifest if r.get('dimensions') and not any(
    d not in r['dimensions'] for d in DIMS) and any(r['dimensions'][d]['status'] != 'NI' for d in DIMS)]
all_ni_instances = [r for r in manifest if r.get('dimensions') and all(
    r['dimensions'].get(d, {}).get('status') == 'NI' for d in DIMS)]
fully_scored_instances = [r for r in manifest if r.get('dimensions') and all(
    r['dimensions'].get(d, {}).get('status') != 'NI' for d in DIMS)]
partially_scored_instances = [r for r in scored_instances if r not in fully_scored_instances]

dim_slot_total = total_instances * len(DIMS)
counts = {'PASS': 0, 'ISSUE': 0, 'N/A': 0, 'NI': 0}
for r in manifest:
    if not r.get('dimensions'):
        continue
    for d in DIMS:
        st = r['dimensions'].get(d, {}).get('status')
        if st in counts:
            counts[st] += 1

fresh_totals = {
    'layerA_rows': len(rows),
    'layerA_unique_ids': len(layerA_ids),
    'total_instances': total_instances,
    'distinct_matrix_ids': len(by_mid),
    'fully_scored_instances': len(fully_scored_instances),
    'partially_scored_instances': len(partially_scored_instances),
    'all_ni_instances': len(all_ni_instances),
    'dim_slot_total': dim_slot_total,
    'dim_slot_evaluated': dim_slot_total - counts['NI'],
    'dim_slot_ni': counts['NI'],
    'counts': counts,
    'assertions_passed': passed_assertion_count,
    'assertions_failed': failed_assertion_count,
    'assertions_missing': missing_assertion_count,
    'assertions_retroactive': retroactive_count,
    'png_files_on_disk': len(all_pngs),
    'screenshots_referenced': len(seen_screenshots_referenced),
    'covered_ids': sorted(by_mid.keys()),
}

# ============================================================================
# HTML-vs-manifest agreement: the published audit HTML must embed a machine-readable
# totals marker that agrees EXACTLY with this run's fresh calculation. If the marker is
# absent, that itself is an error (means the HTML was never regenerated from validated
# data, or was hand-edited since) — not treated as a soft/first-run exemption.
# ============================================================================
html_mismatch_count = 0
m = LAYER_B_MARKER_RE.search(html)
if not m:
    html_mismatch_count += 1
    errors.append("Generated HTML has no LAYER_B_VALIDATED_TOTALS_JSON marker — run generate_layer_b.py to regenerate from this validated manifest")
else:
    try:
        html_totals = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        html_mismatch_count += 1
        errors.append(f"Generated HTML's totals marker is not valid JSON: {e}")
        html_totals = None
    if html_totals is not None and html_totals != fresh_totals:
        html_mismatch_count += 1
        diffs = []
        keys = set(html_totals.keys()) | set(fresh_totals.keys())
        for k in sorted(keys):
            if html_totals.get(k) != fresh_totals.get(k):
                diffs.append(f"{k}: html={html_totals.get(k)!r} vs fresh={fresh_totals.get(k)!r}")
        errors.append("Generated HTML totals mismatch vs fresh calculation: " + '; '.join(diffs))

# ============================================================================
# Report
# ============================================================================
log('=== LAYER A ===')
log(f'Rows: {len(rows)} | unique: {len(layerA_ids)} | duplicates: {len(layerA_dupes)}')
log()
log('=== LAYER B MANIFEST ===')
for k, v in fresh_totals.items():
    log(f'{k}: {v}')
log()
log('=== INTEGRITY CHECKLIST (all must be 0) ===')
checklist = {
    'layerA_mismatches': (1 if len(rows) != EXPECTED_LAYER_A_ROWS else 0) + len(layerA_dupes),
    'manifest_duplicate_vids': duplicate_vid_count,
    'invalid_matrix_ids': invalid_id_count,
    'missing_screenshot_refs': len(missing_files),
    'orphan_screenshots': len(unreferenced),
    'failed_assertions': failed_assertion_count,
    'missing_assertions': missing_assertion_count,
    'retroactive_unverified_assertions': retroactive_count,
    'missing_dimension_slots': missing_dims_count,
    'wrong_shape_dimension_slots': wrong_dim_shape_count,
    'unexplained_dimension_results': unexplained_dim_result_count,
    'generated_html_mismatch': html_mismatch_count,
}
for k, v in checklist.items():
    flag = 'OK' if v == 0 else 'FAIL'
    log(f'  [{flag}] {k}: {v}')
log()

if errors:
    log(f'=== {len(errors)} VALIDATION ERRORS ===')
    for e in errors:
        log(f' - {e}')
    log()
    log('=== VALIDATION FAILED ===')
    with open(EVID + '\\validated_totals.json', 'w', encoding='utf-8') as f:
        json.dump({**fresh_totals, 'validation_passed': False, 'error_count': len(errors)}, f, indent=2)
    flush_report()
    sys.exit(1)

log('=== VALIDATION PASSED — zero errors, all integrity checks OK ===')
with open(EVID + '\\validated_totals.json', 'w', encoding='utf-8') as f:
    json.dump({**fresh_totals, 'validation_passed': True, 'error_count': 0}, f, indent=2)
flush_report()
sys.exit(0)
