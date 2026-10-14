/* Refs owned by the screens-core slice (sections 57 to 60). Format: guide/refs/README.md. */
window.V2Refs = (window.V2Refs || []).concat([
  /* 57 Home: V2's home is the chat's pre-conversation view (greeting + worker card). */
  { id: 'screens-core.home.greeting-gate', file: 'chat_product.jsx', line: 204, needle: '{!started &&', value: 'the greeting shows only before a conversation starts' },
  { id: 'screens-core.home.greeting-title', file: 'chat_product.jsx', line: 206, needle: "title={sessionMode === 'moneymaker' && !isOnboarding ? 'Hi, Alex ", value: "greeting 'Hi, Alex' with a waving-hand emoji" },
  { id: 'screens-core.home.returning-line', file: 'chat_product.jsx', line: 213, needle: "'Welcome back. Your next run is at 11 am.'", value: 'Welcome back. Your next run is at 11 am. (time hard-coded)' },
  { id: 'screens-core.home.first-line', file: 'chat_product.jsx', line: 213, needle: "You're all set. The BlueAI worker is all it takes to start earning.", value: "You're all set. The BlueAI worker is all it takes to start earning." },
  { id: 'screens-core.home.skeleton', file: 'chat_product.jsx', line: 222, needle: 'loading ? <window.HomeSkeleton />', value: 'cold-start skeleton: the old five-card ProductHome list' },
  { id: 'screens-core.home.component', file: 'moneymaker_home.jsx', line: 101, needle: 'function MoneyMakerHome({ onRun })', value: 'the worker home: one card, one Run' },
  { id: 'screens-core.home.coach-local', file: 'moneymaker_home.jsx', line: 105, needle: 'const [coaching, setCoaching] = useState(!back);', value: 'coach dismissal kept in local state' },
  { id: 'screens-core.home.scrim', file: 'moneymaker_home.jsx', line: 117, needle: "background: 'rgba(11,18,32,0.52)'", value: 'coach scrim rgba(11,18,32,0.52)' },
  { id: 'screens-core.home.strip-returning', file: 'moneymaker_home.jsx', line: 120, needle: '{back && <window.WorkerDayDone.EarningsStrip />}', value: 'the progress strip shows only for a returning partner' },
  { id: 'screens-core.home.card-title', file: 'moneymaker_home.jsx', line: 137, needle: '>BlueAI worker</p>', value: 'BlueAI worker' },
  { id: 'screens-core.home.strip-day', file: 'worker_day_done.jsx', line: 153, needle: 'Day {n.day} of {n.target}', value: 'Day 7 of 20 (from DONE_BEFORE, not a ledger)' },
  { id: 'screens-core.home.strip-verified', file: 'worker_day_done.jsx', line: 157, needle: 'Yesterday’s run verified.', value: 'Yesterday’s run verified.' },
  { id: 'screens-core.home.strip-earnings', file: 'worker_day_done.jsx', line: 154, needle: 'href="https://bluestacks.ai/dashboard"', value: 'Earnings link to bluestacks.ai/dashboard (the second Earnings URL)' },

  /* 57 Chat (reached from Home). */
  { id: 'screens-core.chat.new-chat', file: 'index.html', line: 350, needle: '<button onClick={onNewChat}', value: 'New Chat: the filled pill in the top bar' },
  { id: 'screens-core.chat.new-chat-label', file: 'index.html', line: 355, needle: 'New Chat', value: 'New Chat' },
  { id: 'screens-core.chat.mounted-as-tab', file: 'index.html', line: 975, needle: ') : isChat ? (', value: 'the chat (and the run in it) exists only while its tab is open' },
  { id: 'screens-core.chat.scheduled-start', file: 'worker_flow.jsx', line: 102, needle: "say('Scheduled run started.', 600)", value: 'Scheduled run started.' },
  { id: 'screens-core.chat.job-label', file: 'worker_flow.jsx', line: 50, needle: "label: 'Paid job available'", value: 'Paid job available' },
  { id: 'screens-core.chat.job-title', file: 'worker_flow.jsx', line: 51, needle: "title: 'Watch the video and provide feedback'", value: 'Watch the video and provide feedback' },
  { id: 'screens-core.chat.job-question', file: 'worker_flow.jsx', line: 120, needle: "question: 'Want me to take this one?'", value: 'Want me to take this one?' },
  { id: 'screens-core.chat.job-options', file: 'worker_flow.jsx', line: 121, needle: "label: 'Yes, switch to Automatic', consent: true }, { id: 'once', label: 'Just this job' }, { id: 'deny', label: 'Not now' }", value: 'Yes, switch to Automatic / Just this job / Not now' },
  { id: 'screens-core.chat.auto-ribbon', file: 'agent_permissions.jsx', line: 62, needle: "'Automatic on ' + (auto.length === 1 ? auto[0].name : auto.length + ' apps')", value: 'Automatic on YouTube' },
  { id: 'screens-core.chat.auto-change', file: 'agent_permissions.jsx', line: 218, needle: '>Change</button>', value: 'Change, which opens the mode sheet' },

  /* 58 Activity: what V2 has instead. */
  { id: 'screens-core.jobs.nav-jobs', file: 'shared.jsx', line: 222, needle: "{ id: 'jobs', label: 'Jobs', Icon: IcoBriefcase }", value: 'Jobs, the first tab' },
  { id: 'screens-core.jobs.nav-chat', file: 'shared.jsx', line: 223, needle: "{ id: 'chat', label: 'Chat', Icon: IcoChatBubble }", value: 'Chat' },
  { id: 'screens-core.jobs.nav-schedule', file: 'shared.jsx', line: 224, needle: "{ id: 'schedule', label: 'Schedule', Icon: IcoCalendar }", value: 'Schedule' },
  { id: 'screens-core.jobs.title', file: 'jobs.jsx', line: 140, needle: '>Coming Soon</h2>', value: 'Coming Soon' },
  { id: 'screens-core.jobs.body', file: 'jobs.jsx', line: 142, needle: 'We are working on this section to bring you new opportunities. Check back soon for updates!', value: 'We are working on this section to bring you new opportunities. Check back soon for updates!' },
  { id: 'screens-core.history.title', file: 'history.jsx', line: 91, needle: '>Chat History</h1>', value: 'Chat History' },
  { id: 'screens-core.history.list', file: 'history.jsx', line: 93, needle: '{HISTORY_ITEMS.map((it) => {', value: 'past chats as an accordion, not runs' },
  { id: 'screens-core.history.sample', file: 'history.jsx', line: 31, needle: "title: 'find all active redeem codes for genshin impact'", value: 'find all active redeem codes for genshin impact' },
  { id: 'screens-core.ledger.ticks', file: 'worker_day_done.jsx', line: 11, needle: 'ONE tick = the run is done and submitted,', value: 'one tick pending, two ticks verified' },
  { id: 'screens-core.ledger.done-before', file: 'worker_day_done.jsx', line: 40, needle: 'const DONE_BEFORE = 6;', value: 'days verified before today: a constant, not a ledger' },
  { id: 'screens-core.ledger.declined', file: 'worker_day_done.jsx', line: 78, needle: "sub: 'Today doesn’t count toward your 20 days.'", value: 'Today doesn’t count toward your 20 days.' },

  /* 59 Run detail: the run exists only as chat steps. */
  { id: 'screens-core.run.render-step', file: 'chat_product.jsx', line: 159, needle: 'const renderStep = (step, i) => {', value: 'each run step is a chat bubble' },
  { id: 'screens-core.run.open-steps', file: 'worker_flow.jsx', line: 130, needle: "say('Opening the job’s video on YouTube…', 1000)", value: 'Opening the job’s video on YouTube…' },
  { id: 'screens-core.run.like-step', file: 'worker_flow.jsx', line: 135, needle: "say('Liking the video…')", value: 'Liking the video…' },
  { id: 'screens-core.run.comment-step', file: 'worker_flow.jsx', line: 136, needle: "say('Leaving a comment…', 1000)", value: 'Leaving a comment… (the comment itself is never shown)' },
  { id: 'screens-core.run.fail-reason', file: 'worker_flow.jsx', line: 132, needle: 'App Player closed during the job.', value: 'App Player closed during the job.' },
  { id: 'screens-core.run.no-job', file: 'worker_flow.jsx', line: 111, needle: "say('No paid job on the board today.')", value: 'No paid job on the board today.' },
  { id: 'screens-core.run.done-title', file: 'worker_day_done.jsx', line: 74, needle: "job:      { title: 'Today’s run is done.' }", value: 'Today’s run is done.' },
  { id: 'screens-core.run.pending', file: 'worker_day_done.jsx', line: 80, needle: "const PENDING = 'Pending verification';", value: 'Pending verification' },

  /* 60 Notifications: the words exist as an 8 second Windows toast. */
  { id: 'screens-core.notif.toast', file: 'desktop_toast.jsx', line: 12, needle: 'function DesktopToast({ title, body, onOpen, onClose, ms = 8000 })', value: 'Windows toast, gone after 8 s' },
  { id: 'screens-core.notif.declined-silent', file: 'worker_day_done.jsx', line: 161, needle: '`declined` never toasts', value: 'a skipped day never notifies' },
  { id: 'screens-core.notif.toast-fn', file: 'worker_day_done.jsx', line: 163, needle: 'function toastFor(e) {', value: 'the toast words per run end' },
  { id: 'screens-core.notif.day-line', file: 'worker_day_done.jsx', line: 165, needle: "const dayLine = 'Day ' + n.day + ' of ' + n.target + '.';", value: 'Day 7 of 20.' },
  { id: 'screens-core.notif.days-body', file: 'worker_day_done.jsx', line: 168, needle: "job: dayLine + ' Pending verification.'", value: 'Day 7 of 20. Pending verification.' },
  { id: 'screens-core.notif.job-title', file: 'worker_day_done.jsx', line: 172, needle: "job:    { title: 'Today’s run is done.', body: body.job }", value: 'Today’s run is done.' },
  { id: 'screens-core.notif.nojob-title', file: 'worker_day_done.jsx', line: 173, needle: "title: 'Your run counts today.'", value: 'Your run counts today.' },
  { id: 'screens-core.notif.failed', file: 'worker_day_done.jsx', line: 175, needle: "failed: { title: 'Today’s job didn’t finish.', body: 'Open BlueAI to retry and count the day.' }", value: 'Today’s job didn’t finish. / Open BlueAI to retry and count the day.' },
  { id: 'screens-core.notif.taskbar', file: 'chat_product.jsx', line: 89, needle: "An unanswered job ask lights up BlueAI's taskbar button", value: 'a waiting job only flashes the taskbar button' },
  { id: 'screens-core.notif.taskbar-delay', file: 'chat_product.jsx', line: 97, needle: 'setTimeout(() => onJobWaiting(true), 4000)', value: 'after 4 s, with no expiry' },
]);
