// BlueAI: Chat history (in-app screen; accordion of past sessions). Since review round 2 the rows are
// the kit's expandable ListRow (.v2-row in one pad-none card) and the transcript the kit's bubbles;
// chat.css keeps only the panel's scroll. The header is the kit's ScreenHeader (shared.jsx ScreenHead).
// Matches the live product: the app header + bottom nav stay, there is NO overlay,
// NO close "X", and NO composer, the screen replaces the whole chat area.
// Each row is an accordion: tap to expand the FULL past conversation inline. The
// expanded transcript matches the row's message count and scrolls (subtle scrollbar)
// when long. (Data is best-effort, matched to the live screenshots.)
(function () {
  const { useState } = React;

  // Generic agent step lines used to pad a transcript up to its message count.
  const GENERIC_POOL = [
    'Analyzing your request…', 'Opening the required app…', 'Navigating to the right screen…',
    'Reading the on-screen content…', 'Performing the next action…', 'Waiting for the page to respond…',
    'Verifying the result so far…', 'Continuing to the next step…',
  ];
  const GENSHIN_POOL = [
    'Checking HoYoLAB for the latest codes…', 'Reading the redeem-code list…',
    'Cross-checking which codes are still active…', 'Filtering out expired codes…',
    'Copying the active codes…', 'Verifying each code on the redemption page…',
    'Noting the rewards for each code…',
  ];

  // Past sessions (newest first). `base` = first message time; `when` = header time.
  const HISTORY_ITEMS = [
    { id: 'ig', title: "Scan my girlfriend's Instagram profile and suggest what I can gift her",
      n: 1, when: 'Jun 13, 05:24 PM', base: { date: 'Jun 13', h: 5, m: 24, ap: 'PM' }, steps: [] },
    { id: 'hi1', title: 'hi', n: 3, when: 'Jun 13, 02:47 PM', base: { date: 'Jun 13', h: 2, m: 47, ap: 'PM' },
      steps: ["Hey! I'm BlueAI, your AI worker for BlueStacks."], result: "Tell me a task and I'll handle it for you." },
    { id: 'hi2', title: 'hi', n: 3, when: 'Jun 11, 11:02 AM', base: { date: 'Jun 11', h: 11, m: 2, ap: 'AM' },
      steps: ['Hi there! What can I help you automate today?'], result: "Just type a task and I'll take it from here." },
    { id: 'gen', title: 'find all active redeem codes for genshin impact', n: 17, when: 'May 27, 02:16 AM',
      base: { date: 'May 27', h: 2, m: 13, ap: 'AM' }, pool: GENSHIN_POOL,
      steps: ['Agent started…', 'Opening Chrome to search for codes…', 'Scrolling to find active codes…'],
      result: 'Done. I found 3 active codes and listed them for you. Want me to redeem them?' },
    { id: 'fake', title: 'redeem this code: FAKE123NOTAREAL', n: 62, when: 'May 27, 02:12 AM',
      base: { date: 'May 27', h: 2, m: 12, ap: 'AM' },
      steps: ['Agent started…', 'Opening the redemption page to enter the code…'],
      result: "That code wasn't valid. It looks like a placeholder. Double-check the source and I'll try again." },
    { id: 'build', title: 'show me the recommended build for Anemo characters', n: 28, when: 'May 26, 11:55 PM',
      base: { date: 'May 26', h: 11, m: 55, ap: 'PM' },
      steps: ['Agent started…', 'Searching for the recommended Anemo build…'],
      result: 'Here are the recommended weapons, artifacts, and main stats for your Anemo characters.' },
    { id: 'gallery', title: "what's in my gallery?", n: 33, when: 'May 26, 11:47 PM',
      base: { date: 'May 26', h: 11, m: 47, ap: 'PM' },
      steps: ['Agent started…', 'Opening your gallery…', 'Scanning recent media…'],
      result: 'You have 248 photos and 32 videos. Want me to organize or share any?' },
  ];

  function pad2(x) { return (x < 10 ? '0' : '') + x; }
  // 12-hour clock stepper: returns "MMM D, hh:mm AM/PM" for the base time + `add` minutes.
  function stepTime(b, add) {
    const h24 = (b.h % 12) + (b.ap === 'PM' ? 12 : 0);
    const total = (((h24 * 60 + b.m + add) % 1440) + 1440) % 1440;
    const hh = Math.floor(total / 60), mm = total % 60;
    const ap = hh >= 12 ? 'PM' : 'AM';
    let h12 = hh % 12; if (h12 === 0) h12 = 12;
    return b.date + ', ' + pad2(h12) + ':' + pad2(mm) + ' ' + ap;
  }

  // Build the full transcript: 1 user message + (n-1) agent messages, ending on the result.
  // Timestamps advance ~1 minute every 3 messages (matches the live grouping).
  function buildConvo(it) {
    const agentCount = Math.max(0, it.n - 1);
    const pool = it.pool || GENERIC_POOL;
    const seq = [...(it.steps || [])];
    let pi = 0;
    while (seq.length < agentCount - 1) seq.push(pool[pi++ % pool.length]);
    if (agentCount >= 1) seq.push(it.result || 'Done. Task completed.');
    const lines = seq.slice(0, agentCount);
    const msgs = [{ r: 'user', c: it.title, t: stepTime(it.base, 0) }];
    lines.forEach((c, i) => msgs.push({ r: 'agent', c, t: stepTime(it.base, Math.floor((i + 1) / 3)) }));
    return msgs;
  }

  // The live chat's bubbles (the kit's MessageBubble): the user's on the grey surface, the agent's
  // on the white surface with a 1px line, the time a caption under each.
  function HistMsg({ m }) {
    const isUser = m.r === 'user';
    return (
      <div className={'v2-msg ' + (isUser ? 'v2-msg--user' : 'v2-msg--worker')}>
        <div className={'v2-bubble v2-text-body' + (isUser ? ' v2-bubble--user' : '')}>{m.c}</div>
        <span className="v2-msg-time v2-text-caption">{m.t}</span>
      </div>
    );
  }

  function ChatHistoryScreen() {
    const [openId, setOpenId] = useState(null);
    return (
      <div className="v2-anim-fade-up v3-screen">
        <ScreenHead title="Chat history" />
        <div className="v3-screen-body v3-screen-body--fit">
          <div className="v2-card v2-card--pad-none">
            {HISTORY_ITEMS.map((it) => {
              const isOpen = openId === it.id;
              const panel = 'hist-' + it.id;
              return (
                <div key={it.id} className="v2-row-group v2-row--divider">
                  <button type="button" className="v2-row v2-row--nav" aria-expanded={isOpen} aria-controls={isOpen ? panel : undefined} onClick={() => setOpenId(isOpen ? null : it.id)}>
                    <span className="v2-row-text">
                      <span className="v2-row-label">{it.title}</span>
                      <span className="v2-row-desc v2-text-body-sm">{it.n} messages · {it.when}</span>
                    </span>
                    <span className="v2-row-chevron" aria-hidden="true"><window.V2Kit.Icon name="chevron-down" /></span>
                  </button>
                  {isOpen &&
                    <div id={panel} className="v2-row-panel">
                      <div className="v2-anim-pop-in v3-hist-scroll">
                        {buildConvo(it).map((m, i) => <HistMsg key={i} m={m} />)}
                      </div>
                    </div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  window.ChatHistory = { ChatHistoryScreen };
})();
