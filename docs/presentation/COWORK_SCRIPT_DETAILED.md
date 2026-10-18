# Cowork script — SYMBA T4.6 GA deck (after the rebuild of 2026-10-18)

**Instruction to cowork:** use the branded template `SYMBA_T46_GA_v9.pptx` (keep its blue chevron
banner, SYMBA logo, yellow rule and EU funding footer on every slide). Replace the content of the
slides with the text below, verbatim. Language: English. Tone: dry, technical, no marketing
adjectives, no exclamation marks. One idea per slide. Screenshots are in `screenshots/` next to
this file (captured 2026-10-18).

All figures come from the code, the schemas and the validation run of 2026-10-18. Do not alter
numbers. Do not reintroduce "pathways", "IS-01…IS-05", "seven questions" or "violations": they
belong to the design retired on 2026-10-18.

---

## SLIDE 1 — Title

**Title:** SYMBA T4.6 — Monitoring & Reporting System for Industrial Symbiosis

**Subtitle:** Configuring industrial-symbiosis studies on the variables of D4.1 and D4.2

**Line under subtitle:** WP4 · Task 4.6 · Deliverable D4.6 · ENCO, with CIRCE and CET

**Image:** `01-home.png` (right half)

**Speaker notes:**
This is the tool of Task 4.6. It takes an industrial-symbiosis case and returns the methodological
configuration that our own guidelines, D4.1 for LCA and D4.2 for LCC, require for that case,
together with the data to collect. It does not compute impacts or costs. On 18 October we rebuilt
it so that the questions are the variables the deliverables actually use.

---

## SLIDE 2 — "The problem: the set-up is fixed before any number"

**Lead line (bold):**
D4.1 and D4.2 make the modelling depend on a few case variables.

**Bullets:**
- ILCD situation follows the decision and its scale (D4.1 Table 1)
- Reference scenario follows whether exchanges already run (D4.1 §11.1)
- One study horizon for LCA and LCC (D4.2 §11)
- Societal LCC follows the decision-maker's perspective (D4.2 §2.2-2.3)
- Functional unit follows what is compared (D4.1 Part 2)

**Green example box (right):**
*e.g.* Same residue: sender pays → waste, zero burden. Receiver pays → co-product, substitution
(D4.1 §8.3).

**Bottom banner (blue):**
Two analysts, two set-ups: results that cannot be compared.

**Speaker notes:**
The hard part of an LCSA of a symbiosis is not the arithmetic, it is fixing the set-up first.
Our deliverables are clear that a few case variables drive that set-up: the decision the study
supports and how far its effects reach, whether the exchanges already take place, the time horizon,
who the decision-maker is, what the study compares. Leave them implicit and two competent analysts
configure the same case differently. The example is the cleanest: who pays whom for a flow decides
whether it enters with zero burden or as a co-product with substitution. The earlier version of the
tool routed cases on five T4.6 "pathways" that the deliverables do not know; that is what we removed.

---

## SLIDE 3 — "The questions are the deliverables' variables"

**Lead line (bold):**
Three parts, numbered on screen; required: Q3, Q9, Q1, Q10 with LCC.

**Column 1 — The study:**
- Q0 Kind of study: analysis … restructuring (D4.1 §4.3.2)
- Q1 Subject: describes the network form and boundary
- Q3 Dimensions: environmental, economic, social
- Q9 Decision and scale → ILCD A, B, C1, C2
- Q2 Exchanges already running? → HNSRS or CNSRS (§11.1)
- Q8 One horizon: operating year, analysis period, asset lifetime
- Q6b TRL of the key technology
- Q10 Public objective or decision-maker → societal LCC
- Q4 Use: public comparative claim, EU policy alignment
- Q11 What is compared → basis of the functional unit

**Column 2 — The exchanges:**
- Q5 Per flow: who pays whom, interdependence
- Optional per flow: sellable elsewhere, Part 2 sector, configuration
- Q7 Concentration of key interactions → regionalised LCIA
- Q7b Reference market: region and scope (§11.3.1)
- Q12 New dedicated shared assets → CAPEX/OPEX shared (D4.2 §4.2)

**Column 3 — Description:**
- Q6a Company sector: describes only

**Image:** `02-questionnaire.png`

**Speaker notes:**
The questionnaire comes in three parts. The study: Q9 decides the ILCD situation as in D4.1 Table 1,
micro effects give A, structural effects give B only with a documented market screening of about
one per cent of new capacity, documenting a network gives C1, strict reporting of one company gives
C2. Q2 asks whether the exchanges the study measures already take place: yes gives the hypothetical
reference HNSRS (what each firm would do today without the links), not yet gives the current
non-symbiotic scenario CNSRS over the study horizon. Q8 sets one horizon for LCA and LCC; a
future operating year, a TRL below 7 or a horizon beyond fifteen years adds future background
scenarios. Q10 adds the societal LCC. Q4 C, a public comparative claim, brings panel review and no
weighting; Q4 D brings PEF and the Circular Footprint Formula. Q11 sets the functional unit. Then the
exchanges: Q5 per flow, Q7 for regionalised characterisation, with transport explicit for every
exchange whatever the answer, Q7b for the reference market, Q12 for shared assets. Q1 and Q6a only
describe the case. The codes are kept because saved cases and tests use them.

---

## SLIDE 4 — "Engine: schema-driven, answers to nodes"

**Lead line (bold):**
The methodology lives in versioned JSON schemas, not in code.

**Pipeline (six chevrons):**
L0 derived states · L1 blocks · Activate nodes · Part 2 sector rules · L2 obligations · L3 decision points

**Three cards:**
- **186** atomic nodes — LCA 59 · LCC 61 · S-LCA 66 (95 fielded, 91 procedural mandates)
- **64** D4.1 Part 2 sector rules — 5 chapters (§4-§8) · 26 typical configurations
- **12** critical decision points — shown when all their methods are on

**Bullets under cards:**
- Branch keys pick a node's value from the answers
- Answer-dependent phrases fill reference market, interactions, shared assets
- Notes flag contradictions; never change an answer silently

**Speaker notes:**
L0 derives three states: the ILCD situation from Q9, the LCC type from Q3, the situation and Q10,
and the S-LCA state. L1 checks four blocking combinations. Activation goes through 186 atomic nodes
extracted from D4.1, D4.2 and D4.3; a discriminative node has one value per branch key, such as
ilcd equals C2 or lcc_type equals C+N, and the first match wins. Where an answer is orthogonal to the
branches, the node text carries a placeholder filled from the answer: the reference market from Q7b,
the scale of interactions from Q7, shared assets from Q12. The D4.1 Part 2 sector rules come next,
listed for the chapters that the flows declare and filtered so that Part 2 never loosens Part 1.
L2 runs the cross-method rules and L3 surfaces the critical decision points. When two answers
contradict each other, the engine writes a note; it never blocks on it and never changes an answer.

---

## SLIDE 5 — "The configuration on screen"

**Lead line (bold):**
Each row says what the answers decided, and why.

**Bullets (left of screenshot):**
- Costing: C+E, C+E+S, C+N, C+N+S, or C-LCC only
- Study horizon: present-day or future background (SSP/RCP)
- Reference scenario: HNSRS, modern counterfactual, or CNSRS, plus market
- Functional unit: function-oriented, input-based, output-based, or system
- Local impacts: site-specific, regional, or per emission territory
- Sector rules: Part 2 chapters, with the flows that open them
- Shared assets: CAPEX and OPEX shared among partners
- Public claim: panel review, no weighting (Q4 = C)

**Green box:**
Open a row: the engine's text, in English, with its deliverable section.

**Image:** `03-result.png`

**Speaker notes:**
The result page leads with the ILCD situation and the rows of "Your configuration". Costing: with an
LCA, a C-LCC per partner and an E-LCC of the network, plus the societal LCC when Q10 says yes;
without an LCA there is no E-LCC, so the network level is a consolidation of the company LCCs, as
D4.2 §4.1 says; for strict reporting of one company only the C-LCC, which is a declared T4.6 design
choice. Each row carries its reason, and opening it shows the node text in English with the section
of the deliverable it comes from, so a reviewer can check every value against D4.1 or D4.2.

---

## SLIDE 6 — "What to do next: obligations, decision points, data"

**Lead line (bold):**
The configuration becomes a work plan and a data request.

**Bullets:**
- Decision points: cross-method tensions the analyst resolves and justifies
- Obligations by family (IR, CIR, FU, B), listed in the DCF
- Obligations are documented, not reported as errors
- No rule overwrites a node; three retired rules keep their reasons
- Data Collection File, xlsx and docx, calibrated on the configuration
- Network builder: actors and flows, round-trip to the files
- Case report (.docx); four audience views; public share links
- Five languages: EN · IT · FR · DE · ES

**Image:** `04-cases.png`

**Speaker notes:**
"What to do next" lists the critical decision points to resolve, and counts the obligations by family:
method integration, rules switched on by the answers, functional unit, boundaries; the full list, with
what triggered each one, is in the Data Collection File. They are presented as
obligations to document, not as violations: the tool cannot see what the analyst does outside it,
so it says what must be documented instead of pretending to check it. Three rules that read
attributes the case never had were retired, each with its reason in the schema. The Data Collection
File, in Excel and Word, asks only for the data this configuration needs, and the network builder
draws the actors and flows. The case report and the four audience views, for industry, local
community, authority and end user, reuse the same configuration.

---

## SLIDE 7 — "Validation and status"

**Lead line (bold):**
Tested on 8 real cases from the literature corpus.

**Two columns:**

*Validation*
- 69 study-level choice points: 63 agree, 6 differ
- All 6 differences are documented, decided divergences
- Part 2 chapter per flow: 37 of 53
- 826 backend + 185 frontend automated tests

*Status*
- Online at biobasedisadvisor.symbaproject.eu, team preview
- Computes no LCA/LCC/S-LCA numbers; scoring from partners
- Open: CIRCE scoring I/O specification
- Open: public opening; D4.1/D4.2 revision in progress

**Bottom banner (blue):**
WP4 · Task 4.6 (ENCO) · SYMBA · Grant Agreement 101135562

**Image (small):** `05-about.png`

**Speaker notes:**
We ran the tool on eight real cases from the literature corpus. On sixty-nine study-level choice
points, sixty-three agree with what the authors did and six differ. All six are divergences we
decided and documented: the single study horizon in three cases, the rule on public comparative
claims, one paper with an ambiguous functional unit, and one artefact of the verification script.
For the Part 2 chapter of each flow the match is 37 of 53. The
code carries 826 backend and 185 frontend tests. The tool is online at
biobasedisadvisor.symbaproject.eu, still in team preview. It computes no numbers: scoring comes
from the partners, and the CIRCE input-output specification is the main open point, together with
the public opening and the alignment with the revised D4.1 and D4.2.

---

### Numbers — quick reference (do not alter)

Questions Q0-Q12 in 3 parts (incl. Q6a/Q6b and Q7b; follow-ups Q2b, Q9b) · required: Q3, Q9,
Q1, Q10 with LCC · 4 ILCD situations (A, B, C1, C2) · LCC types C+E, C+E+S, C+N, C+N+S, C-LCC only ·
186 atomic nodes (LCA 59 / LCC 61 / S-LCA 66; 95 fielded + 91 procedural mandates) · 4 blocks ·
40 L2 rules (18 IR + 10 CIR + 5 FU + 7 B) + IR-04/IR-10 at L3 · 3 rules retired (CIR-03, CIR-04,
CIR-06) · 12 critical decision points · rule schema 58 entries (4 + 20 + 10 + 5 + 7 + 12) ·
D4.1 Part 2: 5 chapters (§4-§8), 64 rules, 26 typical configurations · future-background threshold
15 years (adjustable) · validation: 8 cases, 69 choice points, 63 agree / 6 differ; Part 2 chapter
per flow 37/53 · tests: 826 backend + 185 frontend · 4 audience views · 5 languages.
