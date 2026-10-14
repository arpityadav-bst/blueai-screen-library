/* Section 77: Changelog (compose slice). Dated, newest first. Add an entry at the top for every
   change to tokens, a kit part's API or a screen, and mirror it in design-md/77-changelog.md. */
(function () {
  const G = window.V2Guide;

  const ENTRIES = [
    ['2026-10-14', 'V2 today re-synced to the PM’s 14 Oct design', [
      'Run-complete popup: an outlined green circle with one green tick, “Today’s run is done.” and “Day 7 of 20. Pending verification” (no full stop), then Got it; dialog sm 320 from v2_tokens.jsx; Day 1 shows it too; confetti on Day 20 only. The home strip, the 20-segment bar and the verification note are gone: day-by-day progress lives on the partner dashboard.',
      'Modes: one app, YouTube. Always ask / Automatic is picked from the composer’s mode chip, which opens a popover (not a sheet); Automatic asks for consent first; no worker question offers Automatic (the job ask is Yes / Not now). The Automatic ribbon is archived (code kept, not rendered); the per-app switch list, the bottom sheet and the plain ModalOverlay frame are gone; Settings has no Worker card.',
      'Answers: chips, and the composer stays open while a question waits (“Or type your answer…”); the Other chip and the docked answer panel are archived.',
      'Sign-in: one not-enrolled case; the gate says “Let’s switch accounts” (no pill, no App Player line); option B (Continue as) is gone.',
      'The PM now builds from this system’s tokens: blueai/v2_tokens.jsx (window.V2Tokens) mirrors tokens-v2-today.css.',
      'Preview panel: the Returning, Change mode from, Card, Own key and Setup question rows and their params are gone. Earnings opens the partner dashboard (../experiments/onblue-vesper/apply.html?creator=in&account=one).',
      'Partner dashboard: “Days run” is 20 pills (filled verified, outlined pending) with a Verified / Pending verification legend; cash out has no period lock, only the $10 minimum (“Payment minimum: $10”; disabled with “You need $10 to cash out.”).',
      'Docs: refs re-pointed or removed, sections and partials that described the old V2 now say what V2 does.',
      'Cash out follows the site: from $10 any time; the system no longer ties it to the program’s end.',
    ]],
    ['2026-10-14', 'Review round 2 of V3, pass B: the strip offers Retry on a failed day', [
      'Kit: ProgramStrip gains onRetry. Given it, a failed today (workerState failed) is the receipt in the danger ink, ‘Today’s job didn’t finish.’, with a quiet Retry, for a screen with no WorkerCard to say it (V3’s Jobs tab and home); without it the strip is unchanged and the WorkerCard’s Try again stays the home’s action.',
      'Why: review round 2 of BlueAI Product V3, pass B (UX and state), R4: a failed day shows Retry in the strip. Section 43 updated.',
    ]],
    ['2026-10-14', 'Review round 2 of V3, pass A: screen header, hover hooks, edges, type, briefcase', [
      'New tokens: --v2-button-secondary-hover-fill and -hover-line, --v2-button-danger-hover-line and -hover-ink (the hover look hooks: Target the sunken surface, the 20% line, the strong danger edge and ink; V2 today keeps its slate-50 hover, slate-200 edge, red-200 edge and red-600 label), --v2-greeting-weight (Target 500, V2 today 800), --v2-empty-title-weight (600) and --v2-mark-glow (the spark’s glow colour). Re-valued in V2 today: --v2-tracking-eyebrow 0.08em (V2’s own; Target keeps the site’s 0.14em) and --v2-switch-knob-shadow 0 1px 3px rgba(0,0,0,0.25) (byok_settings.jsx:26-27).',
      'Kit: ScreenHeader takes the greeting’s 24/500/-0.04em title on a 36 line with 16 above, below and at the gutter (content-box, so a trailing 36px button never grows it); the failed notice takes --v2-danger-edge and a waiting RunCard --v2-waiting-line; a message’s time is a 12 ink-3 caption; body text tracks -0.01em; the eyebrow is ink-4; the nav badge is the solid ink; the EmptyState lifts by --v2-shadow-0, reads its title weight from a hook and its body measure is --v2-measure (280); a bare select’s placeholder is ink-4; destructive commits the confirms that lose something (Delete, Remove key, Disconnect), Sign out’s confirm commits with the primary; the icon set gains briefcase.',
      'Why: review round 2 of BlueAI Product V3, pass A (visual and system); V3 now takes the kit’s ScreenHeader, DayBar, Tooltip, ListRow, RadioCard, ProgressBar, bubbles, notices, AskCard, compact Banner, chip and Icon instead of its own copies. Sections 04, 08, 11, 13, 22, 31, 32, 35, 36 and 38 updated.',
    ]],
    ['2026-10-14', 'Review round 1 of V3, pass B: waiting state, focus, composer status, switch rows', [
      'New token: --v2-waiting-line (the edge of a message waiting on you: the attention ink in Target, V2’s pale yellow in V2 today). Re-valued: --v2-waiting-fill is the attention tint in Target too (it was the surface), so a pending AskCard and a needs-input notice take the attention fill and edge.',
      'Kit: AskCard keeps the chosen chip as a selected pill once answered (no user bubble echo); Composer says what the run is doing in a muted status line above the field (.v2-composer-status), never in the placeholder; ModeRows gains control ‘switch’ (V2’s one switch per app) with the mode in words as the row’s state line, and a bare Switch keeps a caller’s aria-describedby; Menu items take an element as their icon; useFocusTrap treats a product window marked data-v2-bounds as the frame it makes inert.',
      'Why: review round 1 of BlueAI Product V3, pass B (UX and interaction); V3 now uses the kit’s focus hook and Menu. Sections 14, 25, 27, 35, 37, 38 and 46 updated.',
    ]],
    ['2026-10-14', 'Review round 1 of V3: switch, destructive confirm, look hooks, titles', [
      'New tokens: --v2-tracking-hero -0.04em (titles 24 and up, at weight 500: .v2-text-greeting and the welcome title), --v2-em-glow (the serif em’s glow), and look hooks so V2 today keeps V2’s own secondary, danger, destructive confirm, switch, empty state and chips (--v2-button-secondary-*, --v2-button-danger-*, --v2-button-destructive-fill and -hover, --v2-switch-off-fill, --v2-switch-knob-shadow, --v2-empty-*, --v2-chip-*).',
      'Re-valued: --v2-tracking-eyebrow is the site’s 0.14em in both looks (was 0.08em).',
      'Kit: Switch off is a 20% fill the white knob reads on, on is --v2-action (the sunken off track left the knob at 1.08:1); Button gains variant destructive (a destructive confirm’s commit); Spinner gains a 24 size; dialogs centre with a symmetric 20 inset; the serif em takes --v2-em-glow.',
      'Why: review round 1 of BlueAI Product V3, which now consumes the kit’s stylesheets instead of re-implementing them.',
    ]],
    ['2026-10-14', 'Target look aligned with the onBlue Agentic site after the V3 restyle', [
      'Target look aligned with the onBlue Agentic site after the V3 restyle: the committing action is the site’s solid ink button (new --v2-solid, --v2-solid-hover, --v2-shadow-btn, --v2-shadow-btn-hover; decision D1 settled), the ghost presses to new --v2-surface-press, chips rest on new --v2-wash-tint, and blue is held to focus, selection, progress, links and the spark.',
      'New tokens: --v2-text-18 (dialog and sheet titles, .v2-text-title-dialog), --v2-tracking-figure (big figures), --v2-radius-dialog 20 (every dialog and the sheet’s top edge), --v2-shadow-2-up (sheets), --v2-scrim-light (a sheet’s veil), --v2-ring-select (highlight on arrival), and look hooks --v2-waiting-fill and --v2-brand-word-fill; each also in tokens-v2-today.css with V2’s value.',
      'Re-valued: the user bubble is the grey surface with a hairline (--v2-bubble-user-fill, -line); --v2-attention-line is the attention ink at 32% like the other tone lines; a needs-input notice and the AskCard sit on the surface with the tone on the edge, and a failed notice takes the danger edge.',
      'Kit: Button primary is the solid ink, secondary the ghost, danger a ghost red on hover (no red solid; destructive confirms commit with the solid primary, ConfirmDialog drops its tone prop); one Switch (40x24, sunken off, blue on, lined knob); Select placeholder in placeholder ink; Badge busy is blue; a ListRow with a value draws the site’s ledger; EmptyState is a 56 sunken mark, 20/600 title, one muted line; dialogs and sheets take radius 20 and 18/600 titles; the credits glyph is V2’s own asset as an image (no mask) and the BrandMark word is ink.',
      'Decided: rows keep radius 10; one field (40 tall, 13/500 label); icon stroke 1.75 for every product set; zero credits is a wait (neutral plus the chip’s dot); no serif em in working-tab empty states; pill and caret geometry stay in their parts. The spark ships as assets/spark.svg. Sections 03, 04, 06, 08, 11 to 16, 18, 22, 23, 25, 26, 30, 33, 35, 37, 38, 47 to 49, 52, 70, 73 and 76 updated.',
    ]],
    ['2026-10-14', 'Minimal progress card and plain consent frame in V2', [
      'Consent dialog, wording and spacing: body "BlueAI will take paid {app} jobs on its own and like, comment, follow and post from your account.", note "Switch back anytime in Settings." set 12px apart, title 10px above the body, buttons 20px below, plain frame corners 20 to match the run-complete popup and the mode sheet.',
      'V2’s home progress card is minimal (day + Earnings, 20 thin day segments, one verified line) and the consent dialog uses a plain frame (no header, divider or X); refs and sections updated.',
    ]],
    ['2026-10-14', 'Mode sheet, one-line ribbon and Settings > Worker in V2', [
      'V2’s per-app mode is now one switch per app (on = Automatic; on asks for consent, off applies at once) in a bottom sheet opened by the composer chip or the ribbon’s Change; the ribbon is one line (Automatic on YouTube, or a count); Settings has a Worker card with the same apps list; the Preview panel’s Version row is Change mode from, plus a Mode row. Refs and sections 14, 21, 26, 27, 38, 42, 46, 53, 57, 61, 62 and 72 updated.',
    ]],
    ['2026-10-14', 'Minimal consent in V2', [
      'V2’s consent dialog is now minimal (title, one paragraph, Cancel / I agree, turn on); refs and sections updated.',
    ]],
    ['2026-10-14', 'Minimal day-done in V2', [
      'V2’s run-complete popup is now minimal (one tick, title, one status line, Got it); refs and section 44 updated.',
    ]],
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
