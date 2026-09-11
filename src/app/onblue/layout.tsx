import type { Metadata } from 'next'
import './onblue.css'

// /onblue — A COMPLETE FORK OF /creators UNDER THE onBlue BRAND (Appy, 2026-09-08).
//
// Same site, one difference: the logo is the onBlue wordmark (no symbol) and every mention of the
// product reads onBlue. It is a literal duplicate - src/app/onblue + src/components/onblue - because
// the brief
// ruled out touching the live creators site, and parameterising that site with a brand token would
// have meant editing every file of it.
//
// THE COST, STATED ONCE: there are now two copies of 50 components and a 2,600-line stylesheet.
// Every future fix to one has to be applied to the other, and nothing enforces that. If the two are
// still both wanted in a month, merging them behind a brand prop is the change to make.
//
// The stylesheet keeps the .crx scope rather than being renamed: both routes' CSS defines the same
// selectors with the same rules, they are never loaded as one page's styling, and renaming ~500
// selectors plus every className across 50 files is the largest possible way to break a copy that
// is otherwise exact.
export const metadata: Metadata = {
  title: 'The AI You Own',
  // The hero's sentence verbatim, and it has to stay that way: a description that still named the
  // counterparty after the page stopped doing so would be the search result contradicting the page
  // it is for (Appy, 2026-08-27).
  description:
    /* THE THREE NAMES, AND WHICH ONE GOES WHERE (Appy, 2026-09-11). They are not
       interchangeable and this fork had been using them as if they were:
         · BlueAI  - THE PRODUCT. Anything you install, run, own, or that completes work is
                     BlueAI. Every sentence on this site that has a verb attached to the thing
                     uses this name.
         · onblue.ai - the website.
         · onBlue  - the site's NAME, and it earns a capital B because that is how the mark is
                     drawn. It belongs to the top-left label, the legal documents, the Partner
                     Program, and your account. Nothing runs on your PC called onBlue.
       The PM's 2026-09-11 copy pass renamed the hero to BlueAI and the rest of the fork was
       still saying onBlue in 21 places, which is what forced the rule to be written down. If a
       new line is about something a reader DOES with the software, it says BlueAI. */
    'BlueAI is an AI worker you own. It finds real work, completes it, and pays you.',
}

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return children
}
