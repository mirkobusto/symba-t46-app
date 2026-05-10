export default function AboutPage() {
  return (
    <div className="about">
      <h1>About</h1>
      <p>
        SYMBA T4.6 — IS Assessment App is the operational tool of WP4 /
        T4.6 of the SYMBA Horizon Europe project. It implements the
        Phase&nbsp;1 atomic-node decision engine derived from
        deliverables D4.1 (LCA), D4.2 (LCC) and D4.3 (S-LCA), classifying
        an industrial-symbiosis case study into one of five terminal IS
        pathways (IS-01..IS-05) and returning a complete methodological
        configuration for LCA, LCC and S-LCA.
      </p>
      <p>
        The 7 user-facing questions (Q1-Q7) drive the activation of 186
        Phase&nbsp;1 nodes plus 40 cross-method validation rules
        (18&nbsp;IR + 10&nbsp;CIR + 5&nbsp;FU + 7&nbsp;B). Reporting-time
        L3 enforcement (IR-04 + IR-10) plus 12 Critical Decision Points
        surface cross-method tensions to the user.
      </p>
      <p className="muted">
        This MVP build wires the questionnaire to{' '}
        <code>POST /api/pipeline/run</code>. Per-pillar config display,
        advanced overrides, and the "Show reasoning" panel arrive in
        subsequent commits.
      </p>
    </div>
  )
}
