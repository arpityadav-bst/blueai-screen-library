// The step shape, in its own module so StepCards.tsx, StepCell.tsx and both pages' step data can
// share it without a circular import. StepCards re-exports it, so the two existing consumers
// (`import StepCards, { type Step } from '../StepCards'`) keep working unchanged.
export type Step = {
  n: string
  title: string
  body: string
  /**
   * Optional since 2026-08-13. The creators page went from three steps to four and its art is being
   * re-drawn from scratch (the delivered set draws the engagement mechanics as labelled icons, which
   * the current brief rules out), so all four cards render a neutral media panel until the new files
   * land — see StepCell.tsx. Omitting `img` is a DECLARED pending state, not a missing value: a card
   * with no art still gets a panel of the right proportion, so the row's geometry is identical
   * before and after the swap and nothing needs re-tuning when the images arrive.
   */
  img?: string
  /** Required whenever `img` is set; meaningless without it, since a placeholder panel is decorative. */
  alt?: string
}
