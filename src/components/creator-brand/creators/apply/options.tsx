import type { Choice } from '../../controls/ChoiceGroup'
import { BriefcaseIcon, CapIcon, CreatorIcon, DotsIcon, LaptopIcon, NoIcon, YesIcon } from '../../controls/choiceIcons'

// The application's option sets, split out of Steps.tsx to keep that file under this project's
// 300-line rule. Data plus the glyph each option carries — no behaviour.
//
// CARDS vs CHIPS is decided per QUESTION, and option COUNT is very much part of that call, not
// separate from it (revised 2026-08-13 — the line this replaced said the opposite, and it was wrong in
// a way that cost a real bug: DESCRIBES_OPTS spent months as `variant="cards"` on the theory that "who
// you are" deserves the weight, and five options stacked one-per-row on mobile made step 1 the single
// tallest step in the form, next to step 2's ~220px with nothing yet answered — a gap no min-height
// floor can close, since a floor pads a shorter step up and cannot shrink a taller one down.
// The rule that actually holds: cards for a SHORT list (two, maybe three) where full weight per option
// is affordable — hasYouTube is the one left in this file — chips for anything longer, REGARDLESS of
// how much the question matters. Five mostly one-word options (Student, Employed, Freelancer, Other)
// is "the small factual ones... where a card row would inflate three words into a wall" (ChoiceGroup.tsx's
// own phrase for yes/no) just as much as a two-item question is — it was simply never named as the
// same case.
//
// The hints under the channel options are doing real work, not decoration: they answer the "wait,
// does this disqualify me?" beat at the exact moment it lands, which is otherwise a question somebody
// leaves the form to go and answer.
export const DESCRIBES_OPTS: Choice[] = [
  { value: 'Student', icon: <CapIcon /> },
  { value: 'Employed', icon: <BriefcaseIcon /> },
  { value: 'Full-time creator', icon: <CreatorIcon /> },
  { value: 'Freelancer', icon: <LaptopIcon /> },
  { value: 'Other', icon: <DotsIcon /> },
]
export const HAS_YT_OPTS: Choice[] = [
  { value: 'Yes', icon: <YesIcon />, hint: 'I have a channel', tone: 'ok' },
  { value: 'No', icon: <NoIcon />, hint: 'Not yet', tone: 'danger' },
]
export const YES_NO_CHIPS: Choice[] = [
  { value: 'Yes', icon: <YesIcon size={15} />, tone: 'ok' },
  { value: 'No', icon: <NoIcon size={15} />, tone: 'danger' },
]

// "Not sure" stays untoned on purpose. It is neither an affirm nor a deny, and giving it a colour to
// avoid looking odd next to two that have one would be inventing a third semantic.
export const FULL_RUN_OPTS: Choice[] = [
  { value: 'Yes', tone: 'ok' },
  { value: 'Not sure' },
  { value: 'No', tone: 'danger' },
]
