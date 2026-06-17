// BlueAI — Chat History (in-app screen; accordion of past sessions).
// Matches the live product: the app header + bottom nav stay, there is NO overlay,
// NO close "X", and NO composer — the screen replaces the whole chat area.
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
      steps: ["Hey! I'm BlueAI — your AI worker for BlueStacks."], result: "Tell me a task and I'll handle it for you." },
    { id: 'hi2', title: 'hi', n: 3, when: 'Jun 11, 11:02 AM', base: { date: 'Jun 11', h: 11, m: 2, ap: 'AM' },
      steps: ['Hi there! What can I help you automate today?'], result: "Just type a task and I'll take it from here." },
    { id: 'gen', title: 'find all active redeem codes for genshin impact', n: 17, when: 'May 27, 02:16 AM',
      base: { date: 'May 27', h: 2, m: 13, ap: 'AM' }, pool: GENSHIN_POOL,
      steps: ['Agent started…', 'Opening Chrome to search for codes…', 'Scrolling to find active codes…'],
      result: 'Done — I found 3 active codes and listed them for you. Want me to redeem them?' },
    { id: 'fake', title: 'redeem this code: FAKE123NOTAREAL', n: 62, when: 'May 27, 02:12 AM',
      base: { date: 'May 27', h: 2, m: 12, ap: 'AM' },
      steps: ['Agent started…', 'Opening the redemption page to enter the code…'],
      result: "That code wasn't valid — it looks like a placeholder. Double-check the source and I'll try again." },
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
    if (agentCount >= 1) seq.push(it.result || 'Done — task completed.');
    const lines = seq.slice(0, agentCount);
    const msgs = [{ r: 'user', c: it.title, t: stepTime(it.base, 0) }];
    lines.forEach((c, i) => msgs.push({ r: 'agent', c, t: stepTime(it.base, Math.floor((i + 1) / 3)) }));
    return msgs;
  }

  function HistMsg({ m }) {
    const isUser = m.r === 'user';
    return (
      <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: 280, background: isUser ? 'linear-gradient(135deg,#5158ee,#7b4cff)' : '#f1f5f9', border: isUser ? 'none' : '1px solid #e8edf3', borderRadius: 16, padding: '10px 13px 8px' }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.45, color: isUser ? 'white' : '#475569', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.c}</p>
          <p style={{ fontSize: 10.5, color: isUser ? 'rgba(255,255,255,0.75)' : '#94a3b8', marginTop: 5 }}>{m.t}</p>
        </div>
      </div>
    );
  }

  function ChatHistoryScreen() {
    const [openId, setOpenId] = useState(null);
    return (
      <div className="tab-anim" style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', padding: '14px 16px 10px' }}>Chat History</h1>
        <div style={{ padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HISTORY_ITEMS.map((it) => {
            const isOpen = openId === it.id;
            return (
              <div key={it.id} style={{ background: 'white', border: '1px solid #e8edf3', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <button onClick={() => setOpenId(isOpen ? null : it.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', padding: '14px 15px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{it.n} messages · {it.when}</p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen &&
                  <div className="ba-msg-in" style={{ borderTop: '1px solid #eef2f6', padding: '14px 15px 10px', maxHeight: 360, overflowY: 'auto', scrollbarWidth: 'thin' }}>
                    {buildConvo(it).map((m, i) => <HistMsg key={i} m={m} />)}
                  </div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  window.ChatHistory = { ChatHistoryScreen };
})();
