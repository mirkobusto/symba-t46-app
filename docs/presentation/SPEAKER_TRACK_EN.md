# SYMBA T4.6 — Speaker track (EN)

> For a ~7-slide talk of 6-8 minutes to the SYMBA consortium and its reviewers.
> Same slides as `COWORK_SCRIPT_DETAILED.md` and `build_deck.py`. Rewritten on 2026-10-18 after the
> rebuild; the earlier track (pathways, seven questions, violations) is retired.
> Cite sections as written here; do not round or change the numbers.

---

## SLIDE 1 — Title: SYMBA T4.6, Monitoring & Reporting System for Industrial Symbiosis

Good morning. This is the tool of Task 4.6, deliverable D4.6, led by ENCO with CIRCE and CET.

Let me say first what it is not. It is not an LCA or LCC calculator: it computes no kilograms of CO2
equivalent, no net present value, no social indicator. Those numbers come from the partners of T4.1
to T4.3, and the tool integrates them in the reporting once they are delivered.

What it does: it takes an industrial-symbiosis case and returns the methodological configuration
that our own guidelines require for it, D4.1 for LCA, Part 1 and the sector chapters of Part 2, and
D4.2 for LCC, together with the data the analyst has to collect.

On 18 October we rebuilt it so that its questions are the variables the deliverables actually use.

---

## SLIDE 2 — The problem: the set-up is fixed before any number

The hard part of a life-cycle sustainability assessment of a symbiosis is not the arithmetic. It is
fixing the set-up before any number is produced, and our deliverables say precisely what drives it:

- the **ILCD situation** follows the decision the study supports and the scale of its consequences,
  D4.1 Table 1, not the subject of the study;
- the **reference scenario** follows whether the exchanges already take place, D4.1 §11.1;
- LCA and LCC share **one study horizon**, D4.2 §11;
- the **societal LCC** follows the perspective of the decision-maker, D4.2 §2.2 and §2.3;
- the **functional unit** follows what is being compared, D4.1 Part 2.

The cleanest example is a single flow. If the sender pays to get rid of it, it is a waste and enters
with zero burden. If the receiver pays for it, it is a co-product, modelled by substitution, D4.1
§8.3. Same residue, opposite attribution.

Left implicit, these variables let two competent analysts set up the same case differently, and the
results cannot be compared. The earlier version of the tool routed every case on five "pathways"
built from two questions. The deliverables do not know them. We removed them.

---

## SLIDE 3 — The questions are the deliverables' variables

The questionnaire has three parts, numbered on screen. The codes, Q0 to Q12, are kept, because saved
cases, tests and schemas use them. Four answers are required: the dimensions, Q3; the decision and
its scale, Q9; the subject, Q1; and, when the economic dimension is on, the public objective, Q10.
The rest is optional, and when it is missing the engine applies the general rule of the deliverable.

**The study.**
- Q0, the kind of study, after Mattila et al. as D4.1 §4.3.2 asks: analysis, improvement,
  expansion, design, restructuring. It derives nothing; it goes into the goal and the report.
- Q1, the subject: an exchange, a park, a programme, a company, a monitoring series. It describes the
  form of the network and its boundary, and feeds three boundary nodes only.
- Q3, the dimensions: environmental, economic, social.
- Q9 decides the ILCD situation, as in D4.1 Table 1. Effects that stay in the plants involved:
  Situation A. Effects that change what a market produces: Situation B, but only with a documented
  market screening of about one per cent of new capacity, D4.1 §11.3.1; otherwise A, with B as a
  sensitivity. Documenting an existing network: C1. Strict reporting of one company: C2.
- Q2 asks whether the exchanges the study measures already take place. Yes: the hypothetical reference
  scenario, HNSRS, what each firm would do today without the links. Not yet: the current
  non-symbiotic scenario over the study horizon, CNSRS, D4.1 §11.1. A follow-up for long-standing
  networks gives a modern counterfactual, D4.1 §11.2.2.
- Q8 sets one horizon for LCA and LCC: the operating year, the analysis period, the technical lifetime
  of the main assets. A future operating year, a TRL below 7, or a horizon beyond fifteen years adds
  future background scenarios, SSP and RCP. The fifteen years can be adjusted.
- Q6b, the TRL of the key technology.
- Q10: does the study serve a public objective or a public decision-maker? Yes adds the societal LCC.
- Q4, the use of results. C, a public claim of superiority or equivalence in any form, papers
  included, brings panel review and no weighting. D, EU policy alignment, brings PEF with the
  Circular Footprint Formula and EF 3.1.
- Q11, what the study compares: waste treatment gives an input-based functional unit, product
  substitution an output-based one, both a system of functional units.

**The exchanges.**
- Q5, for each flow: who pays whom, or whether the flow is interdependent. Optional per flow: could it
  be sold elsewhere, which Part 2 sector it belongs to, its typical configuration.
- Q7, how concentrated the key interactions are: one site, one region, across regions. It sets the
  regionalised characterisation, D4.1 §12.2.3 and §12.3.3. Transport is explicit for every exchange,
  whatever the answer.
- Q7b, the reference market: the region and its scope, national, sub-national or continental,
  D4.1 §11.3.1.
- Q12, new dedicated shared assets: their CAPEX and OPEX are shared among the partners, D4.2 §4.2,
  and the capital goods enter the LCA, D4.1 §6.3.3.

**Description.** Q6a, the company sector, only describes the case. The Part 2 chapters follow what
the flows are, not the company.

---

## SLIDE 4 — The engine: schema-driven, answers to nodes

The methodology lives in versioned JSON schemas, not in code, so it can be read and audited.

A run has six steps:

1. **L0** derives three states: the ILCD situation from Q9; the LCC type from Q3, the situation and
   Q10; the S-LCA state from Q3.
2. **L1** checks four blocking combinations, for example no dimension selected.
3. **Activation** goes through **186 atomic nodes** extracted from D4.1, D4.2 and D4.3: 59 LCA,
   61 LCC, 66 S-LCA. 95 carry a value, 91 are procedural mandates.
4. The **D4.1 Part 2 sector rules**: 64 rules and 26 typical configurations over five chapters, §4 to
   §8, listed for the chapters the flows declare.
5. **L2**, the cross-method rules.
6. **L3**, the twelve critical decision points.

How do answers reach a node? Three ways.

- **Branch keys.** A discriminative node has a value per branch, such as `ilcd=C2`, `lcc_type=C+N`,
  `comparison_goal=waste_treatment`. The first match wins; a key the engine cannot read is an error,
  never a skipped branch.
- **Answer-dependent phrases.** Where an answer is orthogonal to the node's branches, the text
  carries a placeholder filled from the answer: the reference market from Q7b, the scale of the
  interactions from Q7, shared assets from Q12.
- **Notes.** When two answers contradict each other, for instance a programme in Q1 with micro
  effects in Q9, the engine writes a note. It never blocks on it and never changes an answer silently.

Part 2 rules are filtered so they never loosen Part 1: no substitution in C2, no "Situation A"
background in B, scale-up only below TRL 7.

---

## SLIDE 5 — The configuration on screen

The result page leads with the ILCD situation and the rows of "Your configuration":

- **Costing.** With an LCA: a C-LCC per partner and an E-LCC of the network, C+E; with a public
  objective, plus the societal LCC, C+E+S. Without an LCA there is no E-LCC, D4.2 §4.1: the network
  level is a consolidation of the company LCCs, C+N or C+N+S. Strict reporting of one company: the
  C-LCC only, a declared T4.6 design choice.
- **Study horizon**: present-day or future background, with its cause.
- **Reference scenario**: HNSRS, modern counterfactual or CNSRS, with the market from Q7b.
- **Functional unit**: function-oriented by default, input-based, output-based, or a system.
- **Local impacts**: site-specific, regional, or per territory of emission.
- **Sector rules**: the Part 2 chapters, with the flows that open them.
- **Shared assets**: CAPEX and OPEX shared among the partners that use them.
- **Public claim**: with Q4 = C, a critical review by a panel of at least three independent experts and no
  weighting; otherwise none.

Each row says why. Opening a row shows the engine's text in English with the section of the
deliverable it comes from, so a reviewer can check every value against D4.1 or D4.2.

---

## SLIDE 6 — What to do next: obligations, decision points, data

"What to do next" lists two things.

- **Critical decision points**: tensions between methods that the analyst resolves and justifies.
  They appear only when all the methods involved are on.
- **Obligations**, counted by family: integration of the methods, rules switched on by the answers,
  functional unit, boundaries. The full list, with what triggered each one, is in the Data Collection
  File. They are obligations to document, not violations: the tool cannot see
  what the analyst does outside it, so it says what has to be documented instead of pretending to
  check it. No rule overwrites the text of a node, and three rules that read attributes the case
  never had were retired, each with its reason in the schema.

Then the data: the **Data Collection File**, in Excel and Word, asks only for what this configuration
needs, and the network builder draws actors and flows. The **case report** comes as a Word file. Four
**audience views**, for industry, local community, authority and end user, and public share links
reuse the same configuration. The interface runs in five languages.

---

## SLIDE 7 — Validation and status

We ran the tool on **eight real cases** from the literature corpus.

- On **69 study-level choice points**, **63 agree** with what the authors did and **6 differ**. All six
  are documented, decided divergences: the single study horizon, three times; the rule on public
  comparative claims; one paper with an ambiguous functional unit; one artefact of the verification
  script.
- The Part 2 chapter of each flow matches in **37 of 53** flows.
- The code carries **826 backend and 185 frontend** automated tests.

Status: the tool is online at biobasedisadvisor.symbaproject.eu, still under construction with a team
preview. Open points: the input-output specification of the CIRCE scoring, the public opening, and the
alignment with D4.1 and D4.2 as their revision completes.

Thank you. I am happy to take questions.

---

## Quick reference — numbers (do not alter)

| Item | Value |
|---|---|
| Questionnaire | Q0-Q12 in three parts (incl. Q6a/Q6b, Q7b; follow-ups Q2b, Q9b) |
| Required answers | Q3, Q9, Q1; Q10 when the economic dimension is on |
| ILCD situations | A, B, C1, C2 (D4.1 Table 1) |
| LCC types | C+E, C+E+S, C+N, C+N+S, C-LCC only |
| Atomic nodes | 186 = LCA 59 + LCC 61 + S-LCA 66; 95 fielded + 91 procedural mandates |
| Blocks | 4 |
| L2 rules | 40 (18 IR + 10 CIR + 5 FU + 7 B); IR-04 and IR-10 at L3 |
| Retired rules | 3 (CIR-03, CIR-04, CIR-06), reasons in the schema |
| Critical decision points | 12 |
| Rule schema total | 58 (4 + 20 + 10 + 5 + 7 + 12) |
| D4.1 Part 2 | 5 chapters (§4-§8), 64 rules, 26 typical configurations |
| Future background threshold | 15 years, adjustable |
| Validation | 8 cases; 69 choice points, 63 agree / 6 differ; Part 2 chapter per flow 37/53 |
| Tests | 826 backend + 185 frontend |
| Audience views | 4 (industry, community, authority, end user) |
| Languages | 5 (EN, IT, FR, DE, ES) |
| Deployment | biobasedisadvisor.symbaproject.eu (under construction, team preview) |
