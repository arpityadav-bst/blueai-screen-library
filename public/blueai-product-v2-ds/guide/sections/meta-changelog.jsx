/* Section 77: Changelog (compose slice). Dated, newest first. Add an entry at the top for every
   change to tokens, a kit part's API or a screen, and mirror it in design-md/77-changelog.md. */
(function () {
  const G = window.V2Guide;

  const ENTRIES = [
    ['2026-10-14', 'Two looks', [
      'tokens-v2-today.css adds the "V2 today" look: every token re-valued to what V2 ships now, under [data-v2-look="today"], while tokens.css stays Target. Eight look-hook tokens let the kit restore V2’s gradient user bubble, indigo nav pill and soft in-flow shadows; the guide header switches the look; ds-check fails if the two files define different token names.',
    ]],
    ['2026-10-13', 'First version', [
      'The system and its live guide, built next to V2 without changing V2: 78 sections (start, foundations, components, shell, chat, worker, credits and settings, patterns, screens, copy and voice, scene and review, meta).',
      'tokens.css: every --v2-* token, each with its role, its onBlue Agentic family link and the V2 values it absorbs.',
      'The kit on window.V2Kit and 14 screens on window.V2Screens, one catalog row per component, each marked In V2, Changed from V2 or New (section 75 lists them; the guide counts them live).',
      'Every V2 value and string the guide prints carries a ref to its V2 line; tools/ds-check.js proves them and enforces tokens only, no em dash, 300 lines a file and a catalog in sync.',
      'DESIGN.md generated from one partial per section (tools/build-design-md.js).',
      '51 recommendations for V2 (20 P1, 21 P2, 10 P3) and 19 decisions pending for the PM.',
      'Compose fixes: --v2-success-tint is 8% (not the site’s 10%) so green text on it passes 4.5:1; new --v2-link-underline (the site’s 32%) under ink links; live V2 parts render inside a v2-preflight wrapper and with V2’s own keyframes (guide/v2-live.css); the catalog lists the shared screen helpers; Help is a menu and a sheet, not a pushed screen.',
    ]],
  ];

  function ChangelogSection() {
    return (
      <G.Section id="changelog">
        {ENTRIES.map(function (e) {
          return (
            <G.Part key={e[0] + e[1]} name={e[0] + ': ' + e[1]}>
              <ul className="g-list">{e[2].map(function (t) { return <li key={t}>{t}</li>; })}</ul>
            </G.Part>
          );
        })}
        <G.Note>How to add an entry: the date, one line per change, what it means for someone building a screen. Status changes (a part becoming In V2 once merged) belong here too.</G.Note>
      </G.Section>
    );
  }
  G.register('changelog', ChangelogSection);
})();
