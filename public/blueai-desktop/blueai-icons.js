/* ============================================================================
   blueAI on Desktop — icon set (single source of truth)

   Generated from the paths already used in index.html, then adopted BY it.

   SCOPE — read this precisely; a looser version of it has been wrong three times.

   What IS true: every path **in this module** is reached by name in both files.
   Zero of them are duplicated as an inline literal in index.html.

   What is NOT true: that every glyph in the product lives here. index.html still
   contains inline <svg> bodies for glyphs this module does not carry — gamepad,
   database, chevron-down/left, the kebab, and others — and several of those are
   duplicated among *themselves*. They are anonymous, so no tool can ask whether
   the right one is used where. **§6 prints both numbers every run. Read them
   there; do not restate them here.**
     - style-guide.html renders every icon specimen from this object and THROWS on
       an unknown name, so the guide cannot show a glyph the product lacks.
     - index.html reaches every path through a name too. Three call shapes, all
       equivalent in output and each chosen for where it sits:
         * `iconSvg(BAI_ICONS.x, n)` — the common case.
         * `'…<svg …>' + BAI_ICONS.x + '</svg>…'` — spliced into JS-built HTML that
           needs its OWN svg attributes rather than iconSvg()'s.
         * `<svg … data-bai-icon="x"></svg>` in static markup, filled at boot.
           Static sites keep their authored attributes, and that matters: the
           hydrated nodes alone carry FIVE different stroke weights
           (1.6, 1.7, 1.8, 2, 2.2) while iconSvg() hardcodes 1.8 — routing them
           through it would silently restyle the header and sidebar.
           (index.html as a whole uses EIGHT: 1.3 1.4 1.6 1.7 1.8 2 2.2 2.4.
           An earlier version of this note said "four" in two places, with two
           DIFFERENT lists of four, neither complete. Counted, not recalled.)

   THREE HEADER CLAIMS HAVE BEEN WRONG — this is why the numbers now live in §6.
   v1: "neither file keeps its own copy", while 23 paths were still inline.
   v2: "most sit in static markup", while 27 of 44 were ordinary JS literals — an
       estimate that made the migration look harder than it was and left the
       duplication open for weeks.
   v3: "a true single source of truth for BOTH files", written immediately after
       the migration. Narrowly true of the paths in this object, false as a
       statement about the product, which still draws dozens of glyphs that never
       made it here. Each version was written by someone who had just done real
       work and rounded the result up.
   All three were caught by an independent audit, never by re-reading. The pattern
   is the point: a summary of your own work, written from satisfaction rather than
   measurement, is the least reliable sentence in any file.

   WHY THIS MATTERS BEYOND TIDINESS: a path with no name cannot be cross-checked.
   While 15 icons were anonymous literals, "is this the RIGHT icon for this
   component?" was unanswerable by any tool, and the guide showed a `gear` on the
   Ask-BlueAI tab for weeks with every check green. Naming them is what made
   ds-drift-check.js §9 possible.

   Convention: 24x24 viewBox, fill:none, stroke:currentColor, stroke-width 1.8,
   round caps/joins — applied by iconSvg(path, size) in index.html.

   TWO KNOWN INCONSISTENCIES, recorded rather than silently tidied (unifying them
   is a product change, not a documentation one):
     - `close` and `closeAlt` are two different paths for the same X glyph, both
       live in the product today.
     - Stroke weights are NOT unified: eight distinct values across index.html
       (1.3 1.4 1.6 1.7 1.8 2 2.2 2.4), five of them on the static icon nodes.
       iconSvg() uses 1.8; the header/sidebar gear+help are authored at 1.6, the
       sidebar nav items at 1.7, chevron/search at 2, the search-clear X at 2.2.
       Rendering any of these THROUGH iconSvg (as the style guide does) shows them
       at 1.8 — very slightly off from the product in those specific places.
     - The account "kebab" glyph is NOT here: it is fill-based (fill:currentColor,
       three circles, no stroke), so it cannot go through iconSvg at all. It stays
       inline in index.html as the documented exception to the stroke convention.
   The sparkle is deliberately absent: the product uses the text glyph "✦", not
   an SVG, so it belongs to the type layer rather than the icon set.
   ============================================================================ */
var BAI_ICONS = {
  bolt: "<path d=\"M13 2L3 14h7l-1 8 10-12h-7z\"/>",
  clock: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
  calendar: "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/>",
  edit: "<path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"/><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z\"/>",
  trash: "<path d=\"M3 6h18\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"/><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"/>",
  telegram: "<path d=\"M22 2 11 13\"/><path d=\"M22 2 15 22l-4-9-9-4 20-7z\"/>",
  cpu: "<rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"2\"/><path d=\"M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3\"/>",
  key: "<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M10.5 12.5L20 3M17 6l3 3M14 9l2 2\"/>",
  refresh: "<path d=\"M21 12a9 9 0 1 1-3-6.7\"/><path d=\"M21 3v6h-6\"/>",
  copy: "<rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/>",
  close: "<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/>",
  closeAlt: "<path d=\"M18 6 6 18\"/><path d=\"M6 6l12 12\"/>",
  check: "<path d=\"M20 6 9 17l-5-5\"/>",
  external: "<path d=\"M7 17 17 7M7 7h10v10\"/>",
  info: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>",
  warn: "<path d=\"M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"/><path d=\"M12 9v4M12 17h.01\"/>",
  help: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"/>",
  user: "<path d=\"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>",
  logout: "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><path d=\"M16 17l5-5-5-5\"/><path d=\"M21 12H9\"/>",
  mail: "<path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"/><polyline points=\"22,6 12,13 2,6\"/>",
  globe: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/>",
  phone: "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" ry=\"2\"/><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"/>",
  upload: "<path d=\"M12 16V4M7 9l5-5 5 5\"/><path d=\"M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3\"/>",
  thumbUp: "<path d=\"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3\"/>",
  thumbDown: "<path d=\"M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3\"/>",
  share: "<circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"/><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"/>",
  chevron: "<path d=\"M9 18l6-6-6-6\"/>",
  search: "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M21 21l-4.3-4.3\"/>",
  // 8-spoke asterisk — the "BlueAI does it for you" glyph on the skill-create method switcher and its
  // handoff pane. It was missing from this module, so the style guide substituted `gear` and showed the
  // wrong glyph in that specimen. Added here and consumed by both product sites via SPARK_PATH.
  // Distinct from the sparkle note above: that one really is a text character, this one is a path.
  spark: "<path d=\"M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8\"/>",
  // EXCEPTION to the convention above: a FILLED 100x100 glyph, not a 24x24 stroked one.
  // Recorded in BAI_ICON_META below so the style guide can render it correctly instead of
  // silently substituting a same-shaped stroked icon — which is what happened: the guide showed
  // a pencil (`edit`) at both "New chat" sites because this glyph had no name to refer to.
  newChat: "<path d=\"M83,49v18c0,8.8222656-7.1777344,16-16,16H24.2817383l-12.9570312,9.2548828c-.690918.4936523-1.5063477.7451172-2.3251953.7451172-.6254883,0-1.2529297-.1464844-1.8300781-.4433594-1.3320312-.6855469-2.1694336-2.0581055-2.1694336-3.5566406v-54c0-8.8222656,7.1777344-16,16-16h32c2.2089844,0,4,1.7910156,4,4s-1.7910156,4-4,4H21c-4.4111328,0-8,3.5888672-8,8v46.2270508l7.675293-5.4819336c.6782227-.4848633,1.4912109-.7451172,2.324707-.7451172h44c4.4111328,0,8-3.5888672,8-8v-18c0-2.2089844,1.7910156-4,4-4s4,1.7910156,4,4ZM91,19h-8v-8c0-2.2089844-1.7910156-4-4-4s-4,1.7910156-4,4v8h-8c-2.2089844,0-4,1.7910156-4,4s1.7910156,4,4,4h8v8c0,2.2089844,1.7910156,4,4,4s4-1.7910156,4-4v-8h8c2.2089844,0,4-1.7910156,4-4s-1.7910156-4-4-4ZM23,51c0,2.7614136,2.2385864,5,5,5s5-2.2385864,5-5-2.2385864-5-5-5-5,2.2385864-5,5ZM39,51c0,2.7614136,2.2385864,5,5,5s5-2.2385864,5-5-2.2385864-5-5-5-5,2.2385864-5,5ZM55,51c0,2.7614136,2.2385864,5,5,5s5-2.2385864,5-5-2.2385864-5-5-5-5,2.2385864-5,5Z\"/>",
  catGames: "<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\"/><path d=\"M12 8v13\"/><path d=\"M19 12v9H5v-9\"/><path d=\"M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5\"/>",
  catProductivity: "<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2\"/>",
  catExplore: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"/>",
  catOther: "<polygon points=\"12 2 2 7 12 12 22 7 12 2\"/><polyline points=\"2 17 12 22 22 17\"/><polyline points=\"2 12 12 17 22 12\"/>",
  catMine: "<path d=\"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z\"/>",
  reward: "<polyline points=\"16 18 22 12 16 6\"/><polyline points=\"8 6 2 12 8 18\"/>",
  gear: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\"/>",
};

/* Icons whose wrapper differs from the 24x24 / fill:none / stroke:currentColor default.
   iconSvg() in the product is not involved (these sites author their own <svg>), but the style
   guide builds its wrapper, so it must be told. Missing metadata = the guide renders a filled
   glyph as an invisible stroked one. */
var BAI_ICON_META = {
  newChat: { viewBox: '0 0 100 100', fill: 'currentColor', stroke: 'none' },
};
