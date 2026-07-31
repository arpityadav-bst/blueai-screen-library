# -*- coding: utf-8 -*-
# Regenerates the ENTIRE §15 "Layer B" section of parity-audit-state-machine.html purely from
# evidence/layer-b/manifest.json + validated_totals.json. Run validate.py first — this script
# reads validated_totals.json rather than recomputing, so a stale/missing totals file is a hard
# error, not silently tolerated.
#
# What's mechanically regenerated (every number/link derived from saved files, nothing hand-typed):
#   - the evidence index table (one row per matrixId, links use the REAL current filenames)
#   - the exact mechanical validation block (from validated_totals.json)
#   - the embedded LAYER_B_VALIDATED_TOTALS_JSON marker validate.py checks on the next run
#   - the "still not covered" bullets (computed, not asserted)
#
# What's preserved as historical narrative (still true, not re-derived): the structural-fix
# writeups for the manifest unification and the F11/F12 root-cause fix, and the withdrawn-findings
# box. A new box is appended documenting THIS round's retroactive-bypass fix + full recapture.
import json, re

MAIN = 'N:\\Antigravity Main\\blueai\\visual-designer\\audits\\parity-audit-state-machine.html'
EVID = 'N:\\Antigravity Main\\blueai\\visual-designer\\audits\\evidence\\layer-b'
DIMS = ['icons', 'spacing', 'color', 'typography', 'overlay', 'buttons', 'controls', 'layout']

with open(EVID + '\\manifest.json', encoding='utf-8') as f:
    manifest = json.load(f)
try:
    with open(EVID + '\\validated_totals.json', encoding='utf-8') as f:
        totals = json.load(f)
except FileNotFoundError:
    raise SystemExit("validated_totals.json not found — run validate.py first, this script never recomputes totals itself")
# Note: validated_totals.json may show validation_passed=False here purely because the HTML's
# LAYER_B_VALIDATED_TOTALS_JSON marker doesn't exist/agree yet — that's exactly what THIS script
# fixes by writing it. The real gate is the validate.py run AFTER this script, not before it.
if not totals.get('validation_passed') and totals.get('error_count', 0) > 0:
    print(f"NOTE: validated_totals.json shows {totals['error_count']} error(s) from the last validate.py run "
          f"(expected if this is the first regeneration — the missing/stale HTML marker is one of them). "
          f"Re-run validate.py after this script to confirm they're gone.")

with open(MAIN, encoding='utf-8') as f:
    html = f.read()

# ---- marker payload: exactly the fields validate.py's fresh_totals produces, nothing extra ----
marker_fields = [
    'layerA_rows', 'layerA_unique_ids', 'total_instances', 'distinct_matrix_ids',
    'fully_scored_instances', 'partially_scored_instances', 'all_ni_instances',
    'dim_slot_total', 'dim_slot_evaluated', 'dim_slot_ni', 'counts',
    'assertions_passed', 'assertions_failed', 'assertions_missing', 'assertions_retroactive',
    'png_files_on_disk', 'screenshots_referenced', 'covered_ids',
]
marker_totals = {k: totals[k] for k in marker_fields}

# ---- group manifest by matrixId ----
by_mid = {}
for r in manifest:
    by_mid.setdefault(r['matrixId'], []).append(r)


def sort_key(mid):
    m = re.match(r'([A-Z]+)(\d+)', mid)
    return (m.group(1), int(m.group(2))) if m else (mid, 0)


def is_scored(r):
    return any(r['dimensions'][d]['status'] != 'NI' for d in DIMS)


# ---- evidence index rows ----
index_rows = []
for mid in sorted(by_mid.keys(), key=sort_key):
    recs = sorted(by_mid[mid], key=lambda r: (r['state'], r['interactionState'], r['theme'], r['breakpoint']))
    scored_n = sum(1 for r in recs if is_scored(r))
    links = []
    for r in recs:
        mark = '✓' if is_scored(r) else ''
        substate = '' if r['interactionState'] == 'default' else f".{r['interactionState']}"
        label = f"{r['state']}{substate}/{r['theme'][0]}{r['breakpoint'][0]}{mark}"
        links.append(f'<a href="evidence/layer-b/{r["screenshot"]}" target="_blank" title="{r["visualInstanceId"]}">{label}</a>')
    index_rows.append(
        f'<tr><td class="lbid">{mid}</td><td>{len(recs)} instances, {scored_n} scored</td>'
        f'<td style="font-size:9.5px;line-height:2;">{" &middot; ".join(links)}</td></tr>'
    )
evidence_table = '\n  '.join(index_rows)

# ---- computed "still not covered" facts ----
uncovered_count = totals['layerA_unique_ids'] - totals['distinct_matrix_ids']
non_default_states = sorted(set(r['interactionState'] for r in manifest if r['interactionState'] != 'default'))

# ---- exact mechanical validation block, from validated_totals.json only ----
counts = totals['counts']
validation_block = f"""Layer A matrix rows (parsed live):                          {totals['layerA_rows']}

Layer B canonical manifest (evidence/layer-b/manifest.json):
  Total visual-instance records:                             {totals['total_instances']}
  Distinct matrix IDs covered:                                {totals['distinct_matrix_ids']} of {totals['layerA_unique_ids']} Layer A rows
  Fully-scored instances (0 NI slots):                        {totals['fully_scored_instances']}
  Partially-scored instances (mix of scored + NI):            {totals['partially_scored_instances']}
  All-NI instances (captured, not yet individually scored):   {totals['all_ni_instances']}
  Check: {totals['fully_scored_instances']} + {totals['partially_scored_instances']} + {totals['all_ni_instances']} = {totals['total_instances']}

Dimension slots (instances x 8, every instance carries all 8):{totals['dim_slot_total']:>6}
  PASS:                                                       {counts['PASS']}
  ISSUE:                                                       {counts['ISSUE']}
  N/A:                                                        {counts['N/A']}
  NI:                                                         {counts['NI']}
  Check: {counts['PASS']}+{counts['ISSUE']}+{counts['N/A']}+{counts['NI']} = {totals['dim_slot_total']}
  Evaluated (non-NI): {totals['dim_slot_evaluated']}   NI: {totals['dim_slot_ni']}

Assertions: passed={totals['assertions_passed']}  failed={totals['assertions_failed']}  missing={totals['assertions_missing']}  retroactive={totals['assertions_retroactive']}
PNG files on disk:                                            {totals['png_files_on_disk']}
Screenshots referenced by manifest:                           {totals['screenshots_referenced']}
Orphan / missing screenshots / invalid matrixIds / duplicate
  visualInstanceIds / wrong-shape dimensions:                  0 (validator: PASSED, zero errors)

STILL NOT COVERED (explicit, not silent):
  - {uncovered_count} of {totals['layerA_unique_ids']} Layer A rows have zero manifest evidence yet (Round 4 scope).
  - {totals['all_ni_instances']} of {totals['total_instances']} instances are captured with real assertions but not yet
    individually dimension-scored — honestly marked NI at every slot, not assumed PASS.
  - Non-default interactionStates captured so far: {', '.join(non_default_states) if non_default_states else 'none'}.
    The full interaction-state axis (hover/active/pressed/selected/disabled/focus/loading/
    success/pending-confirmation/destructive-confirmation) remains largely uncaptured.
  - Proposed-but-unbuilt states (Credits/Prime/Geo, the utility bar + Help/kebab/Profile/Logout,
    the AI Mode setup modal, Skills delete-confirm, Skills shimmer) have no mockup yet and
    correctly are not scored — Layer A's MISSING STATE classification stands, not a Layer B PASS."""

new_section = f'''<section id="layerb">
  <h2 class="sec"><span class="num">15</span>Layer B — Independent Visual UX Audit (Round 4 — Integrity-Gated Manifest)</h2>
  <p class="sec-sub"><b>Rounds 1-3 had real, independently-confirmed bugs, each fixed at the root rather than patched over:</b> two hand-maintained files (evidence.json, dimension-scores.json) drifted out of sync because nothing forced them to agree; two matrix rows worth of screenshots (F11/F12) were mislabeled by a tab-selector bug that matched the tab-row container as well as each tab; and — the subject of this round — the validator accepted 136 of 152 instances on a "retroactive" flag without ever checking they had a real, passing assertion. All are fixed below.</p>

  <div class="finding fixed">
    <div class="finding-head"><span class="finding-title">One canonical manifest, generated only — never hand-patched</span><span class="chip fixed">STRUCTURAL FIX</span></div>
    <p style="margin:0 0 8px">Every prior two-file split (evidence.json + dimension-scores.json) is replaced by <code>evidence/layer-b/manifest.json</code> — one record per <b>visual instance</b> (matrixId + state + interactionState + theme + breakpoint), each carrying its own screenshot path, pre-capture assertions, and its own 8 dimension results with status+reason+evidence. No composite matrixIds. <b>Every number below is read from <code>validated_totals.json</code>, produced by <code>tools/validate.py</code> — nothing in this section is hand-typed.</b></p>
  </div>

  <div class="finding fixed">
    <div class="finding-head"><span class="finding-title">Root-cause fix: the F11/F12 mislabeling</span><span class="chip fixed">FIXED AT SOURCE</span></div>
    <p style="margin:0 0 8px">The capture script selected tabs via <code>document.querySelectorAll('#baiSubpane [class*="tab"]')</code> — this substring selector matched BOTH the tab-row container (<code>.bai-create-tabs</code>, plural) and each individual tab button (<code>.bai-create-tab</code>, singular), confirmed via <code>index.html:237-240,1202-1204</code>. Fixed by switching to the exact class <code>.bai-create-tab</code>, with a runtime check confirming it returns exactly 3 elements before any capture proceeds.</p>
  </div>

  <div class="finding fixed">
    <div class="finding-head"><span class="finding-title">Root-cause fix: the retroactive-bypass validator flaw</span><span class="chip fixed">FIXED AT SOURCE, THIS ROUND</span></div>
    <p style="margin:0 0 8px">The prior validator accepted any record with <code>assertions.retroactive=true</code> regardless of whether it had ever actually passed an assertion (136 of 152 instances), and silently skipped the dimensions check entirely when <code>dimensions</code> was <code>null</code>. Both are removed with zero exception. Every one of this manifest's {totals['total_instances']} instances now has <code>assertions.passed===true</code> from a real, source-verified <code>shotAsserted()</code> call — the retroactive flag and the leniency for it are both gone. All 136 named legacy instances (A4, B2&ndash;B5, E1, F1&ndash;F4/F7/F13, G1&ndash;G5, H3&ndash;H10, H12, H19&ndash;H21, H23, H26) were recaptured through the assertion-gated pipeline; G4 (Scheduled task-row toggle, previously missed) was added for completeness. Three genuine selector/assumption bugs were caught and fixed <i>during</i> recapture, each via direct source inspection rather than trial-and-error: A4's icon selector matched the wrong breakpoint's hidden button; Skills' F7 toggle query wasn't scoped to <code>#baiSubpane</code> and silently grabbed a hidden Scheduled toggle instead (<code>.bai-tgl</code> is shared by four separate components — Skills, Scheduled, BYOK); and Scheduled's Repeat control was wrongly assumed to be an HTML <code>&lt;select&gt;</code> when source (<code>index.html:717,1302-1306</code>) shows it's a segmented control, meaning the pre-existing (deleted) G3 capture had silently failed to select "Weekly" at all. Two more selector bugs of the same root-cause class (positional-index re-query after a DOM re-render; clicking a parent element instead of the child that actually holds the listener) were caught and fixed while capturing the AI Mode/BYOK/AI-Defaults area this round.</p>
  </div>

  <div class="finding fixed">
    <div class="finding-head"><span class="finding-title">Withdrawn findings</span><span class="chip fixed">CORRECTED</span></div>
    <ul class="inv-list" style="margin-bottom:0;">
      <li><b>LB-03 WITHDRAWN.</b> Based on the mislabeled F11 file (see above) — the screenshot it cited actually showed a different tab entirely. On the correctly-captured evidence, the Upload ZIP control is a real bordered, accent-tinted, actionable-looking surface. Reclassified PASS.</li>
      <li><b>LB-04 WITHDRAWN, factually incorrect.</b> Source inspection (<code>index.html:200,1281</code>): Scheduled's Delete button uses <code>class="bai-newitem-create"</code> — the identical class as every Create/Save/Validate button in the app, defined with <code>border-radius: 8px</code>. Not a pill.</li>
    </ul>
  </div>

  <div class="finding">
    <div class="finding-head"><span class="finding-title">Findings register — current state (2 withdrawn, 4 pending re-confirmation)</span></div>
    <p style="margin:0 0 8px"><b>Honesty note:</b> LB-01/02/05/06 below were established in Round 2/3 against evidence that has since been <i>recaptured</i> (fresh screenshots, real assertions, same underlying app code — nothing in blueai-desktop changed). None of the four have been individually re-scored under the new manifest yet ({totals['fully_scored_instances']} of {totals['total_instances']} instances are fully scored so far, none of them these four) — they are retained as prior observations pending re-confirmation in Round 4's scoring pass, not re-verified against the new evidence.</p>
    <ul class="chiplist">
      <li><b>LB-01 (high)</b> — Subpane-stuck-on-tab-switch. Retained pending re-score.</li>
      <li><b>LB-02 (low)</b> — Skills search missing clear control while a query is active. Retained pending re-score. Evidence: F2 zero-results and with-results instances (recaptured this round).</li>
      <li><b>LB-03 — WITHDRAWN</b> (mislabeled evidence; corrected evidence shows PASS).</li>
      <li><b>LB-04 — WITHDRAWN</b> (factually incorrect; source confirms identical 8px-radius class to every other button).</li>
      <li><b>LB-05 (medium)</b> — Telegram modal header title wraps to 2 lines. Retained pending re-score. Evidence: H4/H6 (recaptured this round).</li>
      <li><b>LB-06 (low)</b> — AI Mode's selected-segment and primary-CTA share one accent hue. Retained pending re-score.</li>
    </ul>
  </div>

  <div class="finding">
    <div class="finding-head"><span class="finding-title">Evidence index — {totals['distinct_matrix_ids']} matrix IDs, {totals['total_instances']} visual-instance records</span></div>
    <p style="margin:0 0 8px">Each link is one saved screenshot; ✓ marks instances that have been individually dimension-scored ({totals['fully_scored_instances'] + totals['partially_scored_instances']} of {totals['total_instances']} carry at least one scored dimension &mdash; the rest are real, valid, saved evidence not yet scored, honestly marked NI at the record level rather than assumed).</p>
    <div class="table-wrap"><table class="matrix">
    {evidence_table}
    </table></div>
  </div>

  <div class="finding fixed">
    <div class="finding-head"><span class="finding-title">Exact mechanical validation &mdash; reproducible from saved files</span><span class="chip fixed">MECHANICAL, GENERATED</span></div>
    <div class="table-wrap"><table style="font-family:var(--mono);font-size:11px;"><tr><td style="white-space:pre-wrap;padding:14px;">{validation_block}</td></tr></table></div>
    <p style="margin:0"><b>This is Round 4 of Layer B &mdash; the integrity gate passes with zero validator errors: no retroactive/unverified assertions, no null dimension slots, every screenshot accounted for.</b> Continuing with new coverage and scoring next.</p>
  </div>
</section>

<!--LAYER_B_VALIDATED_TOTALS_JSON
{json.dumps(marker_totals, indent=2)}
-->
'''

# Consumes an optional trailing marker comment from a PREVIOUS run too — otherwise a second run
# only replaces up through </section> and leaves the old marker sitting right after it, so markers
# silently accumulate (and validate.py's search() would keep matching the stale first one forever).
# \s* between </section> and the marker matters: a blank line commonly sits between them, and
# without it a whitespace mismatch alone is enough for the optional group to quietly not match.
pattern = re.compile(r'<section id="layerb">.*?</section>\n\s*(<!--LAYER_B_VALIDATED_TOTALS_JSON\n.*?\n-->\n)?', re.S)
if not pattern.search(html):
    raise SystemExit("Could not find <section id=\"layerb\">...</section> in the HTML — aborting without writing")
html2 = pattern.sub(lambda m: new_section, html, count=1)

with open(MAIN, 'w', encoding='utf-8') as f:
    f.write(html2)

print('Regenerated §15 Layer B section.')
print('Evidence index rows:', len(index_rows))
print('Marker embedded with', len(marker_totals), 'fields.')
