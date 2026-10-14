/* Section 17 Avatar (display-feedback slice). Kit: window.V2Kit.Avatar (kit/display.jsx). */
(function () {
  const G = window.V2Guide;
  const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--v2-space-3)' };

  function V2Profile() {
    const P = window.Profile;
    return <G.Stage width="shell"><P.ProfileScreen onSignOut={function () {}} /></G.Stage>;
  }

  function AvatarSection() {
    const K = window.V2Kit || {};
    const A = K.Avatar;
    const Card = K.Card;
    const Row = K.ListRow;
    return (
      <G.Section id="avatar">
        <G.Part name="Avatar" status="changed" role="Who is signed in, and which account an app row is about. A photo, initials or an app mark, always round.">
          <G.Stage ground="surface">
            <div style={row}>
              <A name="Alex Rivera" id="primary" size={56} />
              <A name="Sam Okafor" size={40} />
              <A app="youtube" size={40} status="success" />
              <A name="Alex Rivera" id="primary" size={32} />
              <A name="Alex Rivera" id="primary" size={24} />
            </div>
          </G.Stage>
          <ul className="g-list">
            <li>Round, 24 (menus), 32 (rows), 40 (account rows), 56 (sign-in and account).</li>
            <li>Initials 600 in white: one letter up to 32, two from 40. The fill is one of two hues picked from the account id: action blue or ink (both clear 4.5:1 with white).</li>
            <li>A photo covers the initials when there is one, and falls back to them if it fails to load.</li>
            <li>App mark: the app's glyph in ink-2 on a sunken disc with a 1px line. No brand colours.</li>
            <li>Status dot: 28% of the size (8 at least), bottom right, 2px surface ring, in the tone colour.</li>
          </ul>

          <G.StateGrid states={[
            { label: 'Initials, hue 0', note: 'action blue', node: <A name="Alex Rivera" id="primary" size={40} /> },
            { label: 'Initials, hue 1', note: 'ink', node: <A name="Sam Okafor" size={40} /> },
            { label: 'Photo', note: 'a V2 asset here', node: <A name="BlueStacks" src="assets/BlueStacks.png" size={40} /> },
            { label: 'Photo failed', note: 'falls back to initials', node: <A name="Alex Rivera" id="primary" src="assets/no-such-photo.png" size={40} /> },
            { label: 'App: YouTube', node: <A app="youtube" size={40} /> },
            { label: 'App: Instagram', node: <A app="instagram" size={40} /> },
            { label: 'App: Telegram', node: <A app="telegram" size={40} /> },
            { label: 'Status: connected', node: <A app="youtube" size={40} status="success" /> },
            { label: 'Status: needs you', node: <A app="youtube" size={40} status="attention" /> },
            { label: 'Status: signed out', node: <A app="youtube" size={40} status="danger" /> },
            { label: 'Loading', note: 'skeleton circle', node: <A name="Alex Rivera" size={40} loading /> },
            { label: 'Sizes', note: '24, 32, 40, 56', node: <div style={row}><A name="Alex Rivera" id="primary" size={24} /><A name="Alex Rivera" id="primary" size={32} /><A name="Alex Rivera" id="primary" size={40} /><A name="Alex Rivera" id="primary" size={56} /></div> },
          ]} />

          <G.CompareRow
            v2={<G.Live label="Profile.ProfileScreen" get={function () { return window.Profile ? V2Profile : null; }} />}
            system={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)', width: '100%' }}>
                <Card padding="none">
                  <Row leading={<A name="Alex Rivera" id="primary" size={40} decorative />} label="Alex Rivera"
                    description="alex.rivera@gmail.com" divider={false} />
                </Card>
                <Card padding="none">
                  <Row leading={<A app="youtube" size={32} status="success" decorative />} label="YouTube"
                    description="Always ask" badge={<K.Badge tone="success" dot>Connected</K.Badge>} />
                  <Row leading={<A app="instagram" size={32} decorative />} label="Instagram"
                    description="Coming soon" badge={<K.Badge tone="neutral">Soon</K.Badge>} />
                </Card>
              </div>
            }
            changed="Profile puts a 92px bat emoji on a green disc over a gradient banner, where the partner's identity goes. The sign-in gate already does it right: an initial on the account's hue. The system keeps the gate's idea at four sizes, adds a photo and app marks for Connected apps, and drops the banner. V2's sign-in hue #156efe gives white initials 4.47:1, so hue 0 is action blue." />

          <G.SpecDrawer rows={[
            { part: 'Shape', token: '--v2-radius-round', value: '50%', ref: 'display-feedback.avatar.gate-34' },
            { part: 'Sizes', token: null, value: '24, 32, 40, 56px', ref: ['display-feedback.avatar.gate-34', 'display-feedback.avatar.emoji-disc'] },
            { part: 'Hue 0', token: '--v2-action', value: '#1268f0 (white 4.92:1)', ref: 'display-feedback.avatar.hue-blue' },
            { part: 'Hue 1', token: '--v2-ink', value: '#0b0b0d', ref: 'display-feedback.avatar.hue-ink' },
            { part: 'Initials', token: '--v2-on-color / --v2-weight-semibold', value: 'white, 600; 11 / 13 / 14 / 20px by size', ref: 'display-feedback.avatar.gate-34' },
            { part: 'App mark', token: '--v2-surface-sunken / --v2-line / --v2-ink-2', value: 'glyph 16 / 16 / 20 / 24 by size' },
            { part: 'Status ring', token: '--v2-surface', value: '2px ring, dot 28% (min 8px)' },
            { part: 'Removed', token: null, value: 'emoji on a #A3D977 disc', ref: ['display-feedback.avatar.emoji-disc', 'display-feedback.avatar.emoji'] },
            { part: 'Removed', token: null, value: '96px gradient banner', ref: 'display-feedback.avatar.banner' },
            { part: 'Copy', token: null, value: 'Alex Rivera, alex.rivera@gmail.com (V2 sign-in fixture)', ref: 'display-feedback.avatar.hue-blue' },
          ]} />

          <G.DoDont
            do={['Put the name next to the avatar; mark the avatar decorative there.', 'Use the account photo when the account has one.', 'Say a status in words too (a badge or the description); the dot only repeats it.']}
            dont={['Emoji, mascots or illustrations in place of a person.', 'Brand colours on app marks.', 'More hues: two is enough to tell two accounts apart at a glance, and the email says which.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('avatar', AvatarSection);
})();
