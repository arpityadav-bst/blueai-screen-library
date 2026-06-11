// BlueAI PM — Chat Component
// Matches frontend/src/components/chat/Chat.tsx + Message.tsx

const { useState, useRef, useEffect } = React;

const SUGGESTIONS = [
  'Play Whiteout Survival as persona_TeacherPet',
  'Collect my daily coins',
  'Complete the alliance tasks',
  'Farm resources on the world map',
];

const INITIAL_MSG = { id: '1', role: 'assistant', content: 'intro', ts: Date.now() };

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: '#F3F4F6', borderRadius: 16, width: 'fit-content', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#9CA3AF', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

function Message({ msg, userName }) {
  const isUser = msg.role === 'user';

  if (msg.content === 'intro') {
    return (
      <div style={{ marginBottom: 4 }}>
        <div style={{ background: '#F3F4F6', borderRadius: 16, padding: '14px 16px', maxWidth: '95%' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Hello{userName ? `, ${userName}` : ''}</h2>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>I'm BlueAI, your AI assistant for BlueStacks App Player. I can help you control apps and perform tasks inside BlueStacks using natural language.</p>
        </div>
      </div>
    );
  }

  const bubbleStyle = () => {
    if (isUser) return { background: 'linear-gradient(to bottom right,#6366F1,#4F46E5)', color: '#fff', boxShadow: '0 4px 6px rgba(79,70,229,0.20)' };
    const map = {
      success: { background: '#DCFCE7', color: '#166534' },
      error:   { background: '#FEE2E2', color: '#991B1B' },
      warning: { background: '#FEF3C7', color: '#92400E' },
      info:    { background: '#DBEAFE', color: '#1E40AF' },
    };
    return map[msg.type] || { background: '#F3F4F6', color: '#1F2937' };
  };

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
      <div style={{ maxWidth: '75%', borderRadius: 16, padding: '10px 14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', ...bubbleStyle() }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</p>
        <p style={{ fontSize: 10, marginTop: 4, opacity: 0.65, textAlign: isUser ? 'right' : 'left' }}>
          {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.parentNode.scrollTop = bottomRef.current.offsetTop;
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '';
      if (input.trim()) textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate agent response
    await new Promise(r => setTimeout(r, 1800));

    const responses = [
      { content: 'Starting task execution. Launching BlueStacks App Player…', type: 'info' },
      { content: 'Task completed successfully! All actions have been performed as requested.', type: 'success' },
      { content: 'I need a bit more information to proceed. Could you clarify which game instance to use?', type: 'warning' },
      { content: 'Here is a summary of what was accomplished:\n\n• Opened the target app\n• Completed the daily login\n• Collected 1,200 coins\n• Submitted alliance tasks', type: null },
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: reply.content, type: reply.type, ts: Date.now() }]);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', borderRadius: 16, border: '1px solid rgba(229,231,235,0.8)', background: 'linear-gradient(to bottom, rgba(249,250,251,0.5),#fff)', padding: 20, marginBottom: 14, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {messages.map(msg => <Message key={msg.id} msg={msg} userName="Alex" />)}

          {/* Suggestions — only show after intro with no further messages */}
          {messages.length === 1 && !loading && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', marginBottom: 8 }}>Try asking me:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', background: '#fff', borderRadius: 999, padding: '6px 12px', fontSize: 12, color: '#374151', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontFamily: 'inherit', transition: 'all 200ms' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#A5B4FC'; e.currentTarget.style.background = 'rgba(238,242,255,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#fff'; }}>
                    <svg width="10" height="10" fill="none" stroke="#4F46E5" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && <LoadingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 16, border: '1px solid #60A5FA', background: '#fff', padding: '8px 14px 8px 8px', transition: 'border-color 200ms' }}>
        <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder="Type your message…" rows={1}
          style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontSize: 14, color: '#374151', fontFamily: 'inherit', padding: '4px 6px', maxHeight: 120, overflowY: 'auto' }} />
        {loading ? (
          <button onClick={() => setLoading(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(182,184,204,0.2)', border: '1px solid #B6B8CC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, background: '#7F82A0', borderRadius: 2 }} />
          </button>
        ) : (
          <button onClick={() => sendMessage(input)} disabled={!input.trim()} style={{ width: 32, height: 32, borderRadius: '50%', background: input.trim() ? '#1990FF' : '#1990FF', opacity: input.trim() ? 1 : 0.4, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 200ms' }}>
            <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Chat });
