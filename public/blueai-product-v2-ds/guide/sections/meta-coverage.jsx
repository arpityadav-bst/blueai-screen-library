/* Section 75: Coverage (compose slice). Counts of In V2 / Changed / New parts, read live from the
   catalog, so they never go stale; the kit, screens and helpers with their status; sections
   registered; refs checked; the recommendation and decision tallies, read from section 73's lists
   (G.recommendations); and which V2 window exports the guide shows live. The export lists were
   measured from the 28 V2 files index.html loads, on 2026-10-14 (re-measure when V2 changes); the
   counts in the prose are the lengths of these lists. */
(function () {
  const G = window.V2Guide;
  const KEYS = ['in_v2', 'changed', 'new'];

  // Exports of the V2 files this page loads: the ones the guide renders live (<Live> or a direct
  // read), and the ones it does not, with why. Then exports of live V2 files it does not load.
  const LIVE = ['AccountGate', 'AgentPermissions', 'AiMode', 'BootSplash', 'BottomNavbar', 'Byok', 'ChatBubbles', 'ChatCompare', 'ChatFeedback', 'ChatHistory', 'CreditsPopupParts', 'HomeSkeleton', 'IcoCalendar', 'IcoChatBubble', 'IcoGear', 'IcoHistory', 'IcoXClose', 'LoginModal', 'ModalOverlay', 'MoneyMaker', 'NeedsBluestacks', 'Profile', 'SignInPage', 'TermsSheet', 'Toggle', 'WorkerCards', 'WorkerDayDone'];
  const NOT_LIVE = [
    ['SiteKit', 'The site’s own page kit inside V2; sign-in is shown through SignInPage and V2 URL states (section 56).'],
    ['MoneyMakerBackdrop, MoneyMakerHomeCard, MoneyMakerIcons, MoneyMakerLogo, MoneyMakerSteps, Shimmer', 'Inner pieces of parts the guide shows whole (MoneyMaker, the home card, HomeSkeleton).'],
    ['WorkerFlow', 'Data (the scripted conversation), quoted through refs rather than rendered.'],
    ['IcoArrowLeft, IcoBriefcase, IcoLightbulb, IcoPencilEdit, IcoPlusSmall, IcoTrashBin', 'Icons the system replaces with the one named set (section 08).'],
    ['TopNavbar', 'Dead code: never rendered by V2 (section 76).'],
  ];
  const NOT_LOADED = [
    ['DesktopScene, DesktopToast, BrowserWindow, InstallDialog', 'Scene, not product: shown as V2 URL states (FrameState) because product-scene.css is not loaded here (section 71).'],
    ['SiteSignIn', 'The site’s sign-in page, drawn only inside SignInPage’s browser; shown through V2 URL states (section 56).'],
    ['ProductChat', 'V2’s chat screen (blueai/chat_product.jsx:294, loaded by V2’s index.html:159). It needs the whole app, so it is shown only as V2 URL states (FrameState), as in section 57 (section 76).'],
  ];
  const names = function (rows) { return rows.reduce(function (n, r) { return n + r[0].split(', ').length; }, 0); };

  // Section 73's lists, tallied here so this count cannot drift from them.
  function recCounts() {
    const R = G.recommendations;
    if (!R) return <span className="g-muted">Section 73 is not loaded.</span>;
    const n = function (p) { return R.recs.filter(function (r) { return r[1] === p; }).length; };
    return R.recs.length + ' (' + n('P1') + ' P1, ' + n('P2') + ' P2, ' + n('P3') + ' P3) and ' + R.decisions.length + ' decisions';
  }

  function tally(parts) {
    const n = { in_v2: 0, changed: 0, new: 0 };
    parts.forEach(function (p) { if (n[p.status] !== undefined) n[p.status] += 1; });
    return n;
  }
  function Counts({ n }) {
    return <span>{KEYS.map(function (k) { return <span key={k} className="g-counts-item"><G.StatusTag status={k} /> <span className="g-num">{n[k]}</span>{'  '}</span>; })}</span>;
  }

  function CoverageSection() {
    const C = window.V2Catalog;
    const all = [];
    C.sections.forEach(function (s) { s.parts.forEach(function (p) { all.push(p); }); });
    const total = tally(all);
    const registered = G.ids().filter(function (id) { return !!C.byId(id); }).length;
    const refs = Array.isArray(window.V2Refs) ? window.V2Refs.length : 0;
    return (
      <G.Section id="coverage">
        <G.Part name="At a glance">
          <G.Table head={['What', 'Count']} rows={[
            ['Sections in the catalog', C.sections.length],
            ['Sections registered in this guide', registered + ' of ' + C.sections.length],
            ['Parts (in sections)', <span>{all.length}{'  '}<Counts n={total} /></span>],
            ['Kit components (window.V2Kit)', <span>{C.kit.length}{'  '}<Counts n={tally(C.kit)} /></span>],
            ['Screens (window.V2Screens)', <span>{C.screens.length}{'  '}<Counts n={tally(C.screens)} /></span>],
            ['Shared screen helpers', (C.helpers || []).length],
            ['V2 references the checks prove', refs],
            ['Recommendations for V2', recCounts()],
          ]} />
          <G.Note>Most parts are Changed, on purpose: the system keeps what V2 does and changes how it looks, reads and behaves. The six In V2 parts are the PM’s copy register and the scene and review tools, which are not product.</G.Note>
        </G.Part>

        <G.Part name="Parts by group">
          <G.Table head={['Group', 'Sections', 'Parts', 'Status']} rows={C.groups.map(function (g) {
            const secs = C.inGroup(g.id);
            const parts = [];
            secs.forEach(function (s) { s.parts.forEach(function (p) { parts.push(p); }); });
            return [g.title, g.numbers, parts.length, parts.length ? <Counts n={tally(parts)} /> : <span className="g-muted">Meta, no parts</span>];
          })} />
        </G.Part>

        <G.Part name="Kit and screens">
          <G.Table head={['Part', 'File', 'Status']} rows={C.kit.concat(C.screens).map(function (k) {
            return [k.name, <code className="g-code">{k.file}</code>, <G.StatusTag status={k.status} />];
          })} />
          <p className="g-role">Shared helpers on window.V2Screens that are not screens:</p>
          <G.Table head={['Helper', 'File', 'Use']} rows={(C.helpers || []).map(function (h) {
            return [h.name, <code className="g-code">{h.file}</code>, h.use];
          })} />
        </G.Part>

        <G.Part name="V2 shown live">
          <p className="g-role">Of the {LIVE.length + names(NOT_LIVE)} window exports in the V2 files this page loads, the guide renders {LIVE.length} live as “V2 today”:</p>
          <p>{LIVE.join(', ')}.</p>
          <p className="g-role">It also renders top-level components V2 declares without an export: SettingsScreen, AISettingsCard, BluestacksCard and TelegramCard.</p>
          <p className="g-role">Loaded but not rendered live, and why:</p>
          <G.Table head={['V2 export', 'Why not']} rows={NOT_LIVE} />
          <p className="g-role">Exports of live V2 files this page does not load:</p>
          <G.Table head={['V2 export', 'Why not loaded']} rows={NOT_LOADED} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('coverage', CoverageSection);
})();
