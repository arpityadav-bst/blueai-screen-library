/* Section 64: Account and privacy (screens-account slice). Screen: screens/account.jsx
   (V2Screens.Account). V2's Profile carries a real staff member's details: the guide describes
   them and never quotes them; the live V2 specimen below is V2's own component, as it ships. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const v2Box = { position: 'relative', display: 'flex', flexDirection: 'column', width: 'var(--v2-shell-w)', maxWidth: '100%', height: 560, overflow: 'hidden' };

  function Screens({ states }) {
    return (
      <div className="g-states" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(453px, 1fr))', overflowX: 'auto' }}>
        {states.map(function (s, i) {
          return (
            <figure className="g-state" key={s.label + i}>
              <div className="g-state-stage">{s.node}</div>
              <figcaption className="g-state-label">{s.label}{s.note ? <span className="g-state-note">{s.note}</span> : null}</figcaption>
            </figure>
          );
        })}
      </div>
    );
  }

  function AccountSection() {
    const S = window.V2Screens || {};
    if (!S.Account) return <G.Section id="account"><G.Warn>screens/account.jsx is not loaded.</G.Warn></G.Section>;
    const scr = function (p) { return <S.Account preview compact landmark={false} onBack={noop} onNavigate={noop} {...(p || {})} />; };
    const v2 = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
        <div style={v2Box}>
          <G.Live get={function () { return window.Profile && window.Profile.ProfileScreen; }} props={{ onSignOut: noop }} label="window.Profile.ProfileScreen" />
        </div>
        <div style={Object.assign({}, v2Box, { height: 260 })}>
          <G.Live get={function () { return window.Profile && window.Profile.LogoutModal; }} props={{ isOpen: true, onCancel: noop, onConfirm: noop }} label="window.Profile.LogoutModal" />
        </div>
      </div>
    );
    return (
      <G.Section id="account">
        <G.Part name="Account" status="changed"
          role="Who is signed in, the program, the account BlueAI acts on, what it keeps and what was agreed, legal, and a Sign out that signs out.">
          <p><strong>Anatomy.</strong> ScreenHeader 'Account' with Back. Identity on the canvas (Avatar 56, name, email), then
            SettingsSection cards Program (external row to the site), Connected account (YouTube) and Privacy (Interest
            profile, Watch history, What you agreed to), the two legal links, and Sign out as a one-row card.</p>
          <Screens states={[
            { label: 'View', note: 'pushed from Settings or More > Account', node: scr() },
            { label: 'Sign out confirm', note: 'what signing out costs, before the choice', node: scr({ state: 'signout' }) },
            { label: 'Signed out', note: 'the worker is paused; lands on Welcome (section 67)', node: scr({ state: 'signed-out' }) },
          ]} />
          <G.CompareRow v2={v2} system={scr()}
            changed={'V2\'s Profile opens on a 96px gradient banner and a 92px emoji avatar, then shows a real staff member\'s '
              + 'name, email and handle (R39), plus Handle, Country and Mobile rows the product never uses. Its "Logout" confirm '
              + 'closes the dialog and returns to chat: the partner stays signed in (R03), and the menu says Logout while the row '
              + 'says Sign out. The system shows one neutral fixture identity (Avatar 56 initials, name, email), the program in the '
              + 'site\'s words, the connected YouTube account, a Privacy section that lists what BlueAI keeps (interest profile, '
              + 'watch history) and what the partner agreed to and when, the two legal links, and a Sign out that says the worker '
              + 'pauses and days stop counting, then really signs out and lands on Welcome.'} />
          <G.Warn>Program money terms wait on decision D3, so the program row says days ("7 of 20 days. Ends Nov 1."), never
            dollars. The agreed dates are fixture values; the real record comes from the acceptance log legal asked for.</G.Warn>
          <G.DoDont
            do={['Show the account the partner applied with, exactly as the site shows it.',
              'List what BlueAI keeps, each with the way to change it.',
              'Say in the confirm that signing out pauses the worker and that days stop counting.',
              'Use "Sign out" everywhere: the More menu, the row, the dialog, the button.']}
            dont={['Put real people\'s details in a prototype.', 'Decorate identity with a banner, gradient or emoji.',
              'Make a confirm that does nothing.', 'Show account fields the product never uses.']} />
          <G.SpecDrawer rows={[
            { part: 'Title', token: 'ScreenHeader with Back', value: '"Account"; More menu item "Account" replaces "Profile"', ref: 'screens-account.profile.menu-profile' },
            { part: 'Identity', token: 'Avatar 56, --v2-text-16 600, --v2-text-13 ink-3', value: 'initials on a hue, name 16/600, email 13; no banner', ref: ['screens-account.profile.banner', 'screens-account.profile.avatar', 'screens-account.profile.name'] },
            { part: 'Fixture', token: 'V2Kit.workerFixtures account', value: 'one neutral identity everywhere', ref: 'screens-account.profile.identity' },
            { part: 'Fields dropped', token: null, value: 'Account Information: Handle, Country, Mobile', ref: ['screens-account.profile.info-title', 'screens-account.profile.handle'] },
            { part: 'Program', token: 'ListRow external', value: '"Partner Starter Program", days and end date, opens the site', ref: ['screens-account.program.name', 'screens-account.program.ends'] },
            { part: 'Privacy', token: 'ListRow nav + expandable', value: 'Interest profile, Watch history, What you agreed to' },
            { part: 'Legal', token: 'Link external', value: '"Program Terms", "Privacy Policy" on /onblue/terms', ref: ['screens-account.legal.url', 'screens-account.legal.program', 'screens-account.legal.privacy'] },
            { part: 'Sign out row', token: 'Card padding none + ListRow', value: 'sign-out 16, "Sign out" 14/500; CSS hover and focus', ref: ['screens-account.profile.signout-row', 'screens-account.profile.hover-js'] },
            { part: 'Confirm', token: 'Dialog alert sm', value: '"Sign out?" + the cost; Cancel / Sign out (primary)', ref: ['screens-account.profile.logout-title', 'screens-account.profile.logout-body', 'screens-account.profile.logout-button', 'screens-account.profile.menu-logout'] },
            { part: 'After', token: 'Welcome (section 67)', value: 'signed out, worker paused', ref: 'screens-account.profile.logout-noop' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('account', AccountSection);
})();
