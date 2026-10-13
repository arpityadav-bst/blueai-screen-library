/* Section 76: Known gaps (compose slice). What the guide and its checks cannot catch, the open items
   the slices left for each other, and the V2 code that is not a source (dead or fenced out). */
(function () {
  const G = window.V2Guide;

  const CANNOT = [
    ['How it looks', 'Nothing here takes screenshots, by design. ds-check reads files, not pixels; layout, spacing and stroke weight are checked by eye in this guide.'],
    ['Contrast over real pixels', 'Ratios are computed from token pairs. Text over an image, a gradient or a blur is not measured.'],
    ['V2 without Tailwind', 'V2 loads the Tailwind CDN; this page does not (R26). Live V2 parts sit in a v2-preflight wrapper whose scoped reset mirrors Tailwind’s preflight, but V2’s few Tailwind utility classes (worker_cards.jsx) do nothing here.'],
    ['V2’s own style block', 'V2 index.html’s keyframes and ba-* classes are copied into guide/v2-live.css so live parts animate. If V2 changes that block, re-copy it; no check compares them.'],
    ['Scene styles', 'product-scene.css is not loaded, so the desktop, the Windows toast and the install dialog are shown as V2 URL states in a frame, not live.'],
    ['URL states and localStorage', 'V2 reads two Preview panel rows from localStorage (index.html:261-265): bai_proto_start (land signed in on the worker, or the real sign-in cold start) and bai_proto_version (which control opens the mode sheet: the composer chip or the ribbon). A link that sets its own start (start, day, end or signin) or version (v) wins (index.html:246-254); a framed state without them opens on what an earlier visit stored. Open it in a private window to be sure. The consent record is only written (agent_permissions.jsx:85) and the mode per app lives in memory, so neither carries over.'],
    ['Shared V2 stores on this page', 'Live parts share V2’s in-page stores: section 46’s specimens set the AgentPermissions mode, which chat’s AutoRibbon (section 38) then shows as Automatic. Use section 46’s Reset.'],
    ['V2 modal markup', 'The live V2 TermsSheet (section 26) renders V2’s own role=dialog aria-modal markup, so a screen reader may treat the rest of the guide as inert while it is mounted.'],
    ['What a ref proves', 'A ref proves a piece of text is still on its V2 line. It does not prove V2 renders it, or renders it the way the guide describes.'],
    ['Recommendation wording', 'Each recommendation’s V2 location is proved, and so is every string its “today” text quotes exactly. Paraphrases are the architect’s reading of V2 and are not machine-checked.'],
  ];

  // [area, item, who closes it]
  const OPEN = [
    ['Kit', 'TopBar passes balance and state to CreditsChip but not runCost, so “low” shows only when state is passed.', 'shell kit'],
    ['Kit', 'Decision D6 is not built: no part holds back the credits today\'s run needs. The composer locks only at zero (section 38) and the credits chip turns low once fewer than the run\'s cost are left, so a chat can spend today\'s paid run. To build option A: CreditsMeter shows a held segment ("360 held for today’s run") and the composer gets a notice and locks at what is left minus the run\'s cost until today\'s run is done.', 'credits kit'],
    ['Kit', 'The icon set has eye but no eye-off; the secret field shows its state with aria-pressed and a wash.', 'foundations'],
    ['Kit', 'Numbered step discs and the one-serif-word title live in screens/entry.css; promote them if Help or ProgramSummary needs them.', 'display kit'],
    ['Screens', 'The Notifications unread count has no place in the chrome (More carries no badge); what needs the partner is counted on Activity.', 'section 54'],
    ['Screens', 'The Notifications items are fixtures in screens/notifications.jsx, outside the Worker record. Give the record an inbox list when V2 adopts the kit.', 'section 41'],
    ['Screens', 'A failed RunCard has no Report a problem entry yet; Activity and Run detail open the sheet with the run attached (V2Screens.reportAbout).', 'screens'],
    ['Screens', 'Search and load more are deferred. Chat History, V2’s one long list, retires (R04); Activity’s This program tab is at most 20 days and Past adds one row per program. Notifications grows with every event: before a partner’s second program, give it a “Show earlier” row or keep only the current program.', 'screens'],
    ['Data', 'The Worker record has no Telegram link state; Settings and Connected apps take it as a prop (telegram).', 'worker kit'],
    ['Screens', 'The sign-in mismatch screens type the second address instead of reading V2Kit.WORKER_OTHER_ACCOUNT (screens/sign-in.jsx:27, screens/system-states.jsx:133).', 'screens'],
    ['Data', 'One real dashboard URL for Earnings (R29); the FAQ link is a stand-in next to it.', 'product team'],
    ['Product', 'Whether feedback (thumbs) is offered on a failed job (decision D18) and whether a partner can turn an interest topic off (decision D19), section 73.', 'PM'],
    ['Product', 'Whether Telegram carries the day-losing events (a job waiting, a run that didn’t start or can’t start) to a partner away from the PC; today it carries only the partner\'s commands (section 54).', 'PM'],
    ['Product', 'How support replies to Report a problem and how soon; the sheet promises email only (section 65).', 'support'],
    ['Copy', 'Every string marked Proposed in DESIGN.md waits for the PM; decisions D1 to D19 wait for the PM and legal (section 73).', 'PM'],
    ['Site', 'The site\'s Cash out and program sheets set backdrop-filter: var(--gate-blur), a bare length (14px), which is invalid, so they draw no blur (onblue-vesper/onblue.css:1365, onblue-vesper/apply.html:634). Wrap it in blur(). The app is not affected: its sign-in gate uses --v2-scrim-blur inside blur().', 'onBlue owner'],
    ['Site', 'The site sets small text in its dim ink #767b85, about 4.2:1 on white (section 02): .progtab-n 12px (onblue-vesper/apply.html:474), .progtile-ends 12.5px (:566), .txn-date in 13.5px rows (:603, 610) and the field helper .msg 12.5px (onblue-vesper/onblue.css:1331). Move that text to a 4.5:1 ink, the system\'s #6e737c (--v2-ink-4).', 'onBlue owner'],
    ['Site', 'Dates differ: the site writes \'Ends Nov 1, 2026\' (onblue-vesper/apply.html:1404); the app writes \'Ends Nov 1\', a year only when it is not this one (section 70). Agree one date rule for the family.', 'onBlue owner'],
  ];

  const DEAD = [
    ['credits_widget.jsx', 'Hidden earn-credits sheet: invisible focus stops, writes localStorage, the abandoned violet language (R41).'],
    ['skills.jsx, chat.jsx', 'Unreachable screens.'],
    ['tweaks-panel.jsx (both copies)', 'Review tooling, not product.'],
    ['shared.jsx:84-298 (TopNavbar, compact BottomNavbar)', 'Never rendered.'],
    ['login.jsx:88-223', 'Three LoginModal variants no path opens.'],
    ['chat_compare.jsx', 'Except IntroCard and ChatCatIcon, which move into the chat module first.'],
    ['product_home.jsx, onboarding.jsx', 'ProductHome and OnboardingWelcome; the Onboarding and Default sessions retire.'],
    ['credits-popup-options.html, credits_page_options.jsx, credits_popup_frame.jsx, credits_popup_options.jsx', 'The credits comparison pages. The shipping popup content (credits_popup_parts.jsx) is a source.'],
  ];
  const FENCED = [
    ['chat_product.jsx, jobs.jsx, schedule.jsx', 'Live in V2 but not loaded on this page: the chat screen needs the whole app; Jobs and Schedule retire (R04, R50).'],
    ['product-scene.css, desktop_scene.jsx, desktop_toast.jsx chrome, browser_window.jsx', 'The fake Windows desktop: scene, fenced out of product tokens (section 71).'],
    ['install_dialog.jsx skin', 'BlueStacks’ installer look, not BlueAI’s.'],
    ['site_kit.jsx, site_signin.jsx, signin_page.jsx', 'The site and Google pages inside V2: the site’s language, used as the family reference.'],
    ['index.html:877-1252', 'The dark Preview panel: review tooling (section 72).'],
  ];

  function KnownGapsSection() {
    return (
      <G.Section id="known-gaps">
        <G.Part name="What the guide cannot catch">
          <G.Table head={['Limit', 'What it means']} rows={CANNOT} />
        </G.Part>
        <G.Part name="Open items">
          <p className="g-role">Left by the build for the part that owns them. None blocks reading or using the system; each is a small change in one place.</p>
          <G.Table head={['Area', 'Item', 'Closes it']} rows={OPEN} />
        </G.Part>
        <G.Part name="Dead code in V2 (not a source)">
          <p className="g-role">About 3,000 of V2’s lines never render. They are listed here and never specimened as product, because building from them would bring back what V2 already left behind.</p>
          <G.Table head={['V2 file', 'What it is']} rows={DEAD} />
        </G.Part>
        <G.Part name="Live in V2, fenced out of the product system">
          <G.Table head={['V2 file', 'Why it is fenced']} rows={FENCED} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('known-gaps', KnownGapsSection);
})();
