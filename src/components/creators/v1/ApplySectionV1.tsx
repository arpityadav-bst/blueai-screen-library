import ApplyForm from '../flow/apply/ApplyForm'

// VERSION B (2026-08-26, Abhisht: a variant with no 'program' vocabulary anywhere — the term
// arrived late via engg and was never agreed internally). This is the ORIGINAL v1 signed-in
// landing, restored from origin/main: sign in, meet the application, no picker in between and no
// unit noun at all — you apply, you're in, you run BlueAI, you earn. Version A's program-titled
// ApplySection lives in ../flow/ApplySection.tsx untouched; the shared ApplyForm swaps its
// "Program Terms" strings to "the Terms" when this variant is active (see CrxState's variant).
export default function ApplySectionV1() {
  return (
    <section className="crx-apply">
      <div className="crx-apply-col">
        {/* The PM's canonical headline (2026-08-20, after the Aug 18 CEO review) — in v1 it lives
            HERE; in Version A it moved to the programs home. Both are true in their own variant. */}
        <h1>
          Get your worker <span className="grad">hired.</span>
        </h1>
        <p className="sub">One short application. We review every one and email you when your access is approved.</p>

        <div id="apply" className="crx-apply-form">
          <ApplyForm />
        </div>
      </div>
    </section>
  )
}
