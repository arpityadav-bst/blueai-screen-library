/* Section 71: Scene (not product) (shell slice). Parts: Desktop scene, Taskbar attention and OS
   toast, BlueStacks install dialog (all In V2). The scene is review scenery: its values never become
   tokens, and product-scene.css is not loaded on this page, so every part is shown in V2 itself.
   Refs: guide/refs/shell.js. */
(function () {
  const G = window.V2Guide;

  function Rows({ rows, head }) {
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          <thead><tr>{head.map(function (h) { return <th scope="col" key={h}>{h}</th>; })}</tr></thead>
          <tbody>
            {rows.map(function (r) {
              return (
                <tr key={r[0]}>
                  {r.slice(0, -1).map(function (c, i) { return <td key={i}>{c}</td>; })}
                  <td><G.RefCell refs={r[r.length - 1]} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function SceneSection() {
    return (
      <G.Section id="scene">
        <G.Note>The desktop, the BlueStacks window, the browser, the Windows toast, the taskbar and the BlueStacks installer are <strong>scenery for review</strong>: they make the product read as installed Windows software. Their colours, sizes and fonts are OS or BlueStacks chrome and are fenced out of the product tokens. What this section carries into the product is behaviour and words: when the taskbar asks for attention, what a notification says and what clicking it opens.</G.Note>

        <G.Part name="Desktop scene" status="in_v2" role="A Windows desktop that fits the visible windows into the browser at true proportions, never above 1x.">
          <G.FrameState url="index.html" label="BlueAI alone (the bare URL, the canonical start)" height={720} />
          <G.FrameState url="index.html?bs=1" label="BlueStacks + BlueAI" height={720} />
          <G.FrameState url="index.html?signin=browser" label="Browser beside BlueAI (the sign-in handoff)" height={720} />
          <Rows head={['Window', 'Size', 'V2 source']} rows={[
            ['BlueAI', '421 x 866 (830 content + 34 caption + 2 border)', 'shell.scene.win-size'],
            ['BlueStacks App Player', '1000 x 573', 'shell.scene.bs-size'],
            ['Browser', '820 x 700', 'shell.scene.side-size'],
            ['Row and scale', 'gap 16, padding 48, scale between 0.3 and 1', 'shell.scene.scale'],
          ]} />
          <G.Note>The scene's auto-scale hides one product problem: an 866 tall window does not fit a 1366 x 768 laptop. The product answer is the compact frame (section 29), not a change to the scene.</G.Note>
        </G.Part>

        <G.Part name="Taskbar attention and OS toast" status="in_v2" role="The two channels that reach a partner who is not looking at BlueAI: the taskbar button and the Windows notification.">
          <G.FrameState url="index.html?end=failed" label="Next day's run ends in 'didn't finish' and raises the toast (bottom right of the frame)" height={720} />
          <Rows head={['Taskbar state', 'Look (scene)', 'When', 'V2 source']} rows={[
            ['Running', 'short grey dash', 'BlueAI is installed and running', 'shell.scene.tb-dash'],
            ['Open', 'longer pill', 'the window is up', 'shell.scene.tb-open'],
            ['Attention', '7 amber flashes, then held', 'a worker job ask is waiting', ['shell.scene.tb-flash', 'shell.scene.tb-attn', 'shell.scene.attention']],
          ]} />
          <Rows head={['Toast', 'Words (PM copy, quoted)', 'V2 source']} rows={[
            ['Run done (job or no job)', 'Today’s run is done. / Day {n} of {target}. Pending verification.', ['shell.scene.toast-job', 'shell.scene.toast-days']],
            ['Day 20', 'All 20 days done, pending verification.', 'shell.scene.toast-day20'],
            ['Didn’t finish', 'Today’s job didn’t finish. / Open BlueAI to retry and count the day.', 'shell.scene.toast-failed'],
            ['Shape (scene)', 'Segoe UI, 364 wide, bottom right above the taskbar, 8 s', ['shell.scene.toast-font', 'shell.scene.toast-w', 'shell.scene.toast-pos', 'shell.scene.toast-ms']],
          ]} />
          <G.Warn>Two product behaviours ride on these channels and are not right yet. Clicking the toast opens BlueAI as a cold start with no Retry on screen (<G.RefCell refs="shell.scene.toast-open" />): it should open the persistent Today record, where Try again and its deadline live (R15). And a job that waits on Always ask has only the taskbar flash: it needs its own notification with the deadline (R08, Notifications pattern section 54). Both toasts can only fire while the window exists, which the tray fixes (section 29).</G.Warn>
        </G.Part>

        <G.Part name="BlueStacks install dialog" status="in_v2" role="BlueStacks' own prompt to install BlueAI, drawn in BlueStacks' visual voice, by designer rule.">
          <G.FrameState url="index.html?bs=1&bai=0&dlg=blueai" label="Flow A: BlueStacks offers BlueAI" height={720} />
          <Rows head={['Part', 'Value (BlueStacks skin)', 'V2 source']} rows={[
            ['Card', '420 wide, square corners, dark BlueStacks surface', 'shell.scene.install-card'],
            ['Type', 'Poppins (BlueStacks), never in the product', 'shell.scene.install-font'],
            ['Title', 'Meet BlueAI', 'shell.scene.install-title'],
            ['Subtitle', 'Your AI worker that gets things done.', 'shell.scene.install-sub'],
            ['Meta', '182 MB · One-time setup', 'shell.scene.install-meta'],
            ['Primary', 'Download BlueAI', 'shell.scene.install-cta'],
            ['Timing', 'downloading 2.8 s, done 0.9 s', 'shell.scene.install-timing'],
          ]} />
          <G.Warn>The skin stays. The words do not fit the product: the body pitches a general assistant that "finds deals, claims rewards" (<G.RefCell refs="shell.scene.install-body" />), not the paid worker the partner was accepted for. R43 asks for a worker pitch in BlueStacks' voice, or for Flow A to go (decision D9).</G.Warn>
        </G.Part>
      </G.Section>
    );
  }

  G.register('scene', SceneSection);
})();
