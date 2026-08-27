'use client'

import { useEffect, useState, type ReactNode } from 'react'
import ApplySection from '../flow/ApplySection'
import { useCrx } from '../flow/CrxState'
import { STARTER_PROGRAM, type Program, type ProgramItem } from './programData'

const DEFAULT_OPEN: ProgramItem[] = [{ program: STARTER_PROGRAM, relation: 'open' }]

// The signed-in home — the screen every sign-in lands on, replacing the dev build's bare
// "Pick a program to apply to" picker. THE REFRAME (2026-08-24 review, Abhisht): the post-login
// screen answers "where do I stand?", not "which one do you want?" — a picker is embarrassing with
// one program (a menu of one) and this screen has to exist in four states regardless of how many
// programs are open. Three of those states live here (open / pending / none); enrolled is the
// dashboard journey and stays its own view.
//
// ONE RICH CARD, NOT A LIST ROW: with a single program at launch, a bare title+price row reads as
// a broken list. The card carries everything the dev build buries a click deeper (reward, what the
// AI does, spots, end date) so applying starts from an informed place — and when N>1 the same card
// repeats and the screen is already a picker.
//
// THE COMING-SOON GHOST under the card is what makes this screen's existence self-explanatory at
// N=1: it pre-trains the reader that programs are the unit of this product (same pattern as the old
// landing's YouTube LIVE / Instagram SOON row) without inventing fake program names that would
// read as promises.
//
// PAYOUT COPY RULE (meeting note 4 + 5): money is paid when the PROGRAM ENDS, not monthly — and
// the word is "earn"/"paid", never "payout" (ops vocabulary). Every money line here says so; if
// the model changes, this file and StepIntro are where the copy lives.

export type ProgramsMode = 'open' | 'pending' | 'none'

export default function ProgramsHome({ mode, items = DEFAULT_OPEN }: { mode: ProgramsMode; items?: ProgramItem[] }) {
  // The application renders IN PLACE of the home (same <main> slot) rather than as a route — the
  // page's other flows already work this way (sign-in swaps the hero for the form). Back returns
  // to the card, so "what was I applying to" is one click away, never a browser-back gamble.
  // Program-valued, not boolean (2026-08-24, the multi-program state): WHICH card was clicked is
  // what the application's headline names.
  const [applying, setApplying] = useState<Program | null>(null)

  // The home↔application swap is a NAVIGATION, so it lands at the top — clicking Apply from a
  // scrolled card otherwise mounts the form with its headline and back link above the viewport
  // (found live, 2026-08-24). This does not touch ApplyForm's own no-auto-scroll rule: that rule
  // is about steps WITHIN the form, where the button under the cursor must not move.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [applying])

  if (mode === 'open' && applying) {
    return <ApplySection onBack={() => setApplying(null)} programTitle={applying.title} />
  }

  return (
    <section className="crx-apply crx-programs">
      <div className="crx-apply-col">
        {mode === 'open' && <ListView items={items} onApply={setApplying} />}
        {/* The pending card comes from items now, not from a hardcoded STARTER_PROGRAM — Version C
            (2026-08-27) hands this screen its own noun-free card, and Version A's callers pass
            nothing, so the default keeps them exactly as before. */}
        {mode === 'pending' && <PendingView program={items[0]?.program ?? STARTER_PROGRAM} />}
        {mode === 'none' && <NoneView />}
      </div>
    </section>
  )
}

// The unit noun, read from the review variant (Version C, 2026-08-27 — Gaurav's chooser concern:
// the listing page survives, only the word goes). Version A says "program"; C says "offer". B
// never renders this screen. ONE helper rather than four inline ternaries, so a future rename is
// one line — the whole point of C is that this word is swappable.
function useNoun() {
  const { variant } = useCrx()
  return variant === 'offers' ? 'offer' : 'program'
}

/* ---------------- open — a program is accepting applications ---------------- */

function ListView({ items, onApply }: { items: ProgramItem[]; onApply: (p: Program) => void }) {
  const { account, setNav } = useCrx()
  const noun = useNoun()
  const openCount = items.filter((i) => i.relation === 'open').length

  return (
    <>
      {/* HEADLINE SWAP (Abhisht, 2026-08-24): "Get your worker hired." moved HERE from the
          application page — the pitch belongs where the choice is made, and "hired" pairs with
          what the cards below are: openings your worker gets hired into. The teaching line
          ("your AI earns through programs") demoted into the sub, where it defines the noun and
          ends on the action. The action verb tracks the OPEN inventory (join for one, choose for
          a menu); a list with nothing left to apply to drops the pitch entirely — "get hired" is
          a strange thing to say to someone hired everywhere — and becomes the member's index. */}
      {openCount > 0 ? (
        <>
          <h1>
            Get your worker <span className="grad">hired.</span>
          </h1>
          <p className="sub">
            Your AI earns through {noun}s: simple goals with fixed rewards. It does the work, you get paid.
            {openCount > 1 ? ' Choose one below to get started.' : ' Join one below to get started.'}
          </p>
        </>
      ) : (
        <>
          <h1>
            Your <span className="grad">{noun}s.</span>
          </h1>
          <p className="sub">You&apos;re in every open {noun} right now. New ones open in waves.</p>
        </>
      )}

      {/* MIXED RELATIONS ON ONE SCREEN (Abhisht, 2026-08-24): a member can be in one program,
          waiting on another, and free to apply to a third — each card states ITS relationship.
          Open cards keep the no-fact-rows rule (the application's intro walks the terms); applied
          and enrolled cards trade the Apply button for their status. */}
      {items.map(({ program, relation }) => (
        <ProgramCard
          key={program.id}
          program={program}
          chip={
            relation === 'applied' ? (
              <span className="crx-chip iris">In review</span>
            ) : relation === 'enrolled' ? (
              <span className="crx-chip mint">Active</span>
            ) : undefined
          }
        >
          {relation === 'open' && (
            <div className="crx-prog-foot">
              <button type="button" className="btn crx-grow" onClick={() => onApply(program)}>
                Apply now
              </button>
            </div>
          )}
          {relation === 'applied' && (
            <div className="crx-prog-facts">
              <FactRow icon={<MailIcon />}>
                Application received. We&apos;ll email <b>{account.email}</b> when your spot opens.
              </FactRow>
            </div>
          )}
          {relation === 'enrolled' && (
            <>
              <div className="crx-prog-facts">
                <FactRow icon={<CheckIcon />}>
                  You&apos;re in. Your AI is working on this {noun}.
                </FactRow>
              </div>
              <div className="crx-prog-foot">
                <button type="button" className="crx-btn-quiet crx-grow" onClick={() => setNav('dashboard')}>
                  Track on dashboard
                </button>
              </div>
            </>
          )}
        </ProgramCard>
      ))}

      <ComingSoon />
    </>
  )
}

/* ---------------- pending — applied, review underway ---------------- */

function PendingView({ program }: { program: Program }) {
  const { account } = useCrx()
  return (
    <>
      <h1>
        Application received.
        <br />
        <span className="grad">Now we review.</span>
      </h1>
      {/* "Waitlist", said in so many words (Ashish, 2026-08-27 sync): review copy alone reads as
          "expect an answer tomorrow". Naming the waitlist and that review takes time is the whole
          job of this line; the card's mail row below already carries the email promise. */}
      <p className="sub">You&apos;re on the waitlist. We review every application in detail, so this can take some time.</p>

      <ProgramCard program={program} chip={<span className="crx-chip iris">In review</span>}>
        <div className="crx-prog-facts">
          <FactRow icon={<MailIcon />}>
            We&apos;ll email <b>{account.email}</b> when your spot opens.
          </FactRow>
          <FactRow icon={<CheckIcon />}>
            Your answers are saved. There&apos;s nothing more to do.
          </FactRow>
        </div>
      </ProgramCard>
    </>
  )
}

/* ---------------- none — nothing open right now ---------------- */

function NoneView() {
  const noun = useNoun()
  return (
    <>
      <h1>
        Nothing open
        <br />
        <span className="grad">right now.</span>
      </h1>
      <p className="sub">{noun === 'offer' ? 'Offers' : 'Programs'} open in waves. We&apos;ll email you the moment one does.</p>

      <ComingSoon />
    </>
  )
}

/* ---------------- shared pieces ---------------- */

// The card shell — DELIBERATELY NOT .crx-panel (2026-08-24, Abhisht: "this UI is very similar to
// the next screen... does not look like a standalone card"): the application form and this card
// shared the same flat panel recipe at the same width, so applying felt like staying on one
// screen. The card now has its own surface (iris-washed, iris-tinted border, r20) and its own
// anatomy: the REWARD is the visual anchor, top-right in mint at stat-card weight, because the
// reward is why the card exists. Each view composes what sits under the head via children.
function ProgramCard({ program, chip, children }: { program: Program; chip?: ReactNode; children?: ReactNode }) {
  return (
    <article className="crx-prog">
      <div className="crx-prog-head">
        <div className="crx-prog-headmain">
          {chip ?? <span className="crx-chip mint">Open</span>}
          <h2 className="crx-prog-title">{program.title}</h2>
          <p className="crx-prog-desc">{program.description}</p>
        </div>
        {/* JUST THE NUMBER (Abhisht, 2026-08-24): the card shows the amount, and the cadence is
            explained in the program details — the application's intro step already says "$30
            every month, paid via PayPal", so the card doesn't pre-chew it. */}
        <div className="crx-prog-reward">
          <span className="crx-prog-reward-label">Reward</span>
          <span className="crx-prog-reward-amount">
            {program.rewardModel.type === 'per-task' ? 'Per job' : `$${program.rewardModel.amount}`}
          </span>
        </div>
      </div>

      {children}
    </article>
  )
}

function FactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="crx-intro-row">
      <span className="crx-intro-ic">{icon}</span>
      <span className="crx-intro-body">{children}</span>
    </div>
  )
}

// Honest about the future without inventing it: no fake program names, no fake rewards — those
// read as promises on a money product. A dashed ghost + one sentence is the whole message.
//
// CHIP ABOVE THE TEXT, NOT BESIDE IT (Appy, 2026-08-25: "coming badge should come later right?").
// It led a flex row, which gave the strongest slot on the block — first fixation, uppercase mono,
// bordered — to the one element carrying no information: the sentence under it opened "More
// programs are on the way", saying the same thing again. The fix is not to move the chip to the
// end, which leaves the duplication and only hides it. The chip now stacks above the copy exactly
// as it does on a real program card (.crx-prog-headmain: chip, then title, then description), and
// the sentence drops its repeated opening. Chip carries the "coming"; the sentence carries what is
// coming; neither repeats the other.
function ComingSoon() {
  return (
    <div className="crx-prog-soon">
      <span className="crx-chip ghost">Coming soon</span>
      <p>Different goals, different rewards. You&apos;ll get an email when one opens.</p>
    </div>
  )
}

/* Local icons — introIcons' stroke voice (currentColor, 1.8, round caps), drawn here because the
   intro set has no jobs/spots/mail glyphs and reaching into it to add some would grow a file whose
   comment says it exists only for StepIntro. */

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 7.5l8 6 8-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.4l2.4 2.4 4.6-5.2" />
    </svg>
  )
}
