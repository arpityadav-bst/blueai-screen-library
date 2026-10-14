// Out-of-credits popup options (2026-10-06), from the credits-cases review:
//   1. say WHEN credits refresh (a timer), and
//   2. explain what credits are (an (i), plus the FAQ), or drop the word altogether.
//
// Every option gets the same `t` (time) object, so they count down in step:
//   t.left     ms until the refill        t.leftText  "6h 42m"
//   t.clock    "5:30 AM tomorrow"         t.refreshed true once the timer has run out
//
// The refreshed state ASSUMES case 8 is fixed, i.e. the app asks for the daily refill when the
// timer ends. Today it only asks at launch, so a real timer would hit zero and nothing would happen.
// "Now" deliberately keeps today's behavior: it never changes.
//
// Exposes window.CreditsPopupOptions = [{ id, label, note, render }].
// Explainer copy and the Learn more link live in credits_popup_parts.jsx (EXPLAIN_CREDITS).
(function () {
  const { useState } = React;
  const P = window.CreditsPopupParts;
  const { Hero, Rule, Title, Body, Strong, GotIt, InfoTip, TextLink, Explainer, Card, CreditsIcon, ClockIcon, DAILY } = P;

  const USED = 'You’ve used all of today’s AI credits.';

  // Shared "it worked" card for A to C, shown once the timer runs out.
  function Refreshed({ close, words = 'credits' }) {
    const credits = words === 'credits';
    return (
      <Card>
        <Hero icon={<CreditsIcon />} value={DAILY.toLocaleString()} />
        <Rule />
        <Title>{credits ? 'New credits are here' : 'Ready to work again'}</Title>
        <Body lines={[credits ? `You have ${DAILY.toLocaleString()} credits for today.` : 'BlueAI can take on new jobs now.']} />
        <GotIt onClick={close} />
      </Card>
    );
  }

  // Now: exactly the live card.
  function Now({ close }) {
    return (
      <Card>
        <Hero icon={<CreditsIcon />} value="0" />
        <Rule />
        <Title>Out of credits</Title>
        <Body lines={[USED, 'Credits will be refreshed tomorrow.']} />
        <GotIt onClick={close} />
      </Card>
    );
  }

  // A: the meeting's own line, "Credits will be refreshed in [TIMER]". Nothing else moves.
  function OptionA({ close, t }) {
    if (t.refreshed) return <Refreshed close={close} />;
    return (
      <Card>
        <Hero icon={<CreditsIcon />} value="0" />
        <Rule />
        <Title>Out of credits</Title>
        <Body lines={[USED, <span>Credits will be refreshed in <Strong>{t.leftText}</Strong>.</span>]} />
        <GotIt onClick={close} />
      </Card>
    );
  }

  // B: A, plus an (i) beside the title. Hovering it shows what credits are (InfoTip).
  function OptionB({ close, t }) {
    if (t.refreshed) return <Refreshed close={close} />;
    return (
      <Card>
        <Hero icon={<CreditsIcon />} value="0" />
        <Rule />
        <Title>Out of credits <InfoTip /></Title>
        <Body lines={[USED, <span>Credits will be refreshed in <Strong>{t.leftText}</Strong>.</span>]} />
        <GotIt onClick={close} />
      </Card>
    );
  }

  // C: the countdown is the hero (the 0 is already in the header pill). The copy carries the
  // clock time instead, and the explanation sits behind a link under the button.
  function OptionC({ close, t }) {
    const [info, setInfo] = useState(false);
    if (t.refreshed) return <Refreshed close={close} />;
    return (
      <Card>
        <Hero label="New credits in" value={t.leftText} />
        <Rule />
        <Title>Out of credits</Title>
        <Body lines={[USED, <span>Credits will be refreshed at <Strong>{t.clock}</Strong>.</span>]} />
        {info && <Explainer />}
        <GotIt onClick={close} />
        <TextLink open={info} onClick={() => setInfo(!info)}>{info ? 'Hide' : 'What are credits?'}</TextLink>
      </Card>
    );
  }

  // D: no credits vocabulary at all, a daily limit instead. Only works if the header pill and the
  // AI Credits page drop the word too, which is a bigger change than this popup.
  function OptionD({ close, t }) {
    const [info, setInfo] = useState(false);
    if (t.refreshed) return <Refreshed close={close} words="limit" />;
    return (
      <Card>
        <Hero icon={<ClockIcon size={52} />} />
        <Rule />
        <Title>Done for today</Title>
        <Body lines={['You’ve reached today’s limit.', <span>BlueAI can work again in <Strong>{t.leftText}</Strong>.</span>]} />
        {info && <Explainer words="limit" />}
        <GotIt onClick={close} />
        <TextLink open={info} onClick={() => setInfo(!info)}>{info ? 'Hide' : 'Why is there a limit?'}</TextLink>
      </Card>
    );
  }

  window.CreditsPopupOptions = [
    { id: 'now', label: 'Now', note: 'Live today. No time, no explanation.', render: (close, t) => <Now close={close} t={t} /> },
    { id: 'a', label: 'Option A', note: 'Adds the time to the second line. Smallest change.', render: (close, t) => <OptionA close={close} t={t} /> },
    { id: 'b', label: 'Option B', note: 'A, plus an (i) by the title. Hover it to see what credits are.', render: (close, t) => <OptionB close={close} t={t} /> },
    { id: 'c', label: 'Option C', note: 'Leads with the countdown. Clock time in the copy, explanation behind a link.', render: (close, t) => <OptionC close={close} t={t} /> },
    { id: 'd', label: 'Option D', note: 'Drops the word credits. Talks about a daily limit instead.', render: (close, t) => <OptionD close={close} t={t} /> },
  ];
})();
