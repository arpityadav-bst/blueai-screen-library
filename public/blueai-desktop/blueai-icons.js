/* ============================================================================
   blueAI on Desktop — icon set (single source of truth)

   Generated from the paths already used in index.html, then adopted BY it:
   index.html assigns its named *_PATH constants from this object, and
   style-guide.html renders its icon specimens from the same object. Neither
   file keeps its own copy, so the style guide cannot show a glyph the product
   does not actually use (it did, before this file existed).

   Convention: 24x24 viewBox, fill:none, stroke:currentColor, stroke-width 1.8,
   round caps/joins — applied by iconSvg(path, size) in index.html.

   TWO KNOWN INCONSISTENCIES, recorded rather than silently tidied (unifying them
   is a product change, not a documentation one):
     - `close` and `closeAlt` are two different paths for the same X glyph, both
       live in the product today.
     - FOUR stroke weights are in play. iconSvg() uses 1.8; the header/sidebar
       icons (gear, help) are authored in static markup at 1.6; chevron/search at
       2; the search-clear X at 2.2. Rendering any of these THROUGH iconSvg (as the
       style guide does) shows them at 1.8, i.e. very slightly lighter than the
       product does in those specific places.
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
  gear: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\"/>",
};
