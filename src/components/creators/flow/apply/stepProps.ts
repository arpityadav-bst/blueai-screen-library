import type { Dispatch, SetStateAction } from 'react'
import type { Draft } from './spec'

// Split out of Steps.tsx on 2026-08-27, when the Version B strings pushed that file to 318 lines
// and StepFour moved to its own file. Both files need this type and this helper, and importing them
// back out of Steps.tsx would make the pair circular - Steps re-exports StepFour, so StepFour must
// not import Steps. A third module with no JSX and no dependencies is the shape that has neither
// problem, and it is where any future step file gets them too.

export type Props = {
  d: Draft
  setD: Dispatch<SetStateAction<Draft>>
  /** Only the errors that should currently be VISIBLE - the parent decides that, not the field. */
  err: Record<string, string | undefined>
  /** Marks a field touched, so its error can appear once the reader has left it. */
  touch: (k: string) => void
}

// A chip group answers on CLICK, so there is no blur to wait for - picking an option is both the
// answer and the departure. Touching on change is what lets a satisfied group stop showing its error
// the moment it's satisfied, instead of holding the red until the next Continue.
//
// Deliberately NOT named use* - it holds no state and calls no hook, and a `use` prefix would put it
// under the react-hooks lint rules it has no business being governed by.
export function choiceSetter({ setD, touch }: Props) {
  return (k: keyof Draft) => (v: string) => {
    touch(k)
    setD((p) => ({ ...p, [k]: v }))
  }
}
