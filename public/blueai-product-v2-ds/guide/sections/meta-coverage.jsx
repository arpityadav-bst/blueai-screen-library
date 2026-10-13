/* Section 75: Coverage (compose slice). Counts of In V2 / Changed / New parts, read live from the
   catalog, so they never go stale; the kit, screens and helpers with their status; sections
   registered; refs checked; and which V2 window exports the guide shows live. The export lists were
   measured from the V2 files index.html loads, on 2026-10-13 (re-measure when V2 changes). */
(function () {
  const G = window.V2Guide;
  const KEYS = ['in_v2', 'changed', 'new'];

  // V2 window exports the guide renders live (<Live> or a direct read), and the ones it does not, with why.
  const LIVE = ['AccountGate', 'AgentPermissions', 'AiMode', 'BootSplash', 'BottomNavbar', 'Byok', 'ChatBubbles', 'ChatCompare', 'ChatFeedback', 'ChatHistory', 'CreditsPopupParts', 'HomeSkeleton', 'Ico* (5 icons)', 'LoginModal', 'ModalOverlay', 'MoneyMaker', 'NeedsBluestacks', 'Profile', 'SignInPage', 'TermsSheet', 'Toggle', 'WorkerCards', 'WorkerDayDone'];
  const NOT_LIVE = [
    ['DesktopScene, DesktopToast, BrowserWindow, InstallDialog', 'Scene, not product: shown as V2 URL states (FrameState) because product-scene.css is not loaded here (section 71).'],
    ['SiteKit, SiteSignIn', 'The site’s own pages inside V2; sign-in is shown through SignInPage and V2 URL states (section 56).'],
    ['MoneyMakerBackdrop, MoneyMakerHomeCard, MoneyMakerIcons, MoneyMakerLogo, MoneyMakerSteps, Shimmer', 'Inner pieces of parts the guide shows whole (MoneyMaker, the home card, HomeSkeleton).'],
    ['WorkerFlow', 'Data (the scripted conversation), quoted through refs rather than rendered.'],
    ['IcoArrowLeft, IcoBriefcase, IcoLightbulb, IcoPencilEdit, IcoPlusSmall, IcoTrashBin', 'Icons the system replaces with the one named set (section 08).'],
    ['TopNavbar', 'Dead code: never rendered by V2 (section 76).'],
  ];

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
            ['Recommendations for V2', '50 (19 P1, 21 P2, 10 P3) and 13 decisions'],
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
          <p className="g-role">Of the 47 window exports in the V2 files this page loads, the guide renders 27 live as “V2 today”:</p>
          <p>{LIVE.join(', ')}.</p>
          <p className="g-role">It also renders top-level components V2 declares without an export: SettingsScreen, AISettingsCard, BluestacksCard and TelegramCard.</p>
          <p className="g-role">Not rendered live, and why:</p>
          <G.Table head={['V2 export', 'Why not']} rows={NOT_LIVE} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('coverage', CoverageSection);
})();
