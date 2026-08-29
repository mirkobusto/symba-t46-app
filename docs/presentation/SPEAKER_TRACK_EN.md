# SYMBA T4.6 — Detailed speaker track (EN)

> Verbose draft for a ~7-slide talk. Deliberately over-detailed — cut down to taste.
> Facts verified against the engine schemas (validation PASS).

---

## SLIDE 1 — Title: "SYMBA T4.6 — IS Assessment Tool"

Good [morning/afternoon]. I'll introduce SYMBA T4.6, the decision-support tool we built
in Task 4.6.

Let me be precise about what it is — and what it is *not* — from the start. It is **not**
an LCA calculator: it does not compute environmental impacts, costs or social scores. What
it does is decide **how** a sustainability assessment of an industrial-symbiosis case should
be set up — which methodology to apply, which rules are mandatory, which choices are
forbidden — and it does this automatically, deterministically, and traceably.

Think of it as a methodological co-pilot for the sustainability analyst.

---

## SLIDE 2 — The problem

In industrial symbiosis, one company's waste or by-product becomes another company's input.
To judge whether that exchange is genuinely sustainable, we don't run one analysis — we run
three, on the same product system:

- **LCA** — environmental impacts
- **LCC** — life-cycle costs
- **S-LCA** — social impacts

Together these form **LCSA**, Life Cycle Sustainability Assessment.

Here is the real difficulty. The hard part is not doing the maths — it's **setting up** the
study correctly. That setup requires hundreds of subtle methodological decisions: how to
allocate impacts between the two companies; whether a waste stream enters with "zero burden";
whether to project parameters into the future; whether an independent review panel is
required; whether you're even allowed to aggregate the three pillars into a single score.

If you count the combinations of these choices, you reach the order of **one million** — and
that is *before* you account for the individual material flows, which push it effectively
unbounded. Today these decisions rest on the experience of the individual analyst. Two
competent experts can set up the *same* case differently. That means the methodology is
**not reproducible** — and a study you can't reproduce is a study you can't defend.

---

## SLIDE 3 — The core idea: complexity reducers

Our central idea is to invert the problem. Instead of asking the analyst to master that
million-way decision space, we ask **seven simple questions** about their case. We call them
**complexity reducers**, and the name is literal: each question prunes an entire branch of
the methodological tree.

A concrete example. The moment the analyst answers *"this is a corporate ESG study"* to
question 1, the engine already knows — without being told anything else — that the LCA
context is ILCD Situation C2, that environmental LCC is forbidden for this case, and that the
routing is pathway IS-03. One answer, dozens of downstream decisions resolved automatically.

The seven questions cover:

1. **Q1 — the type of symbiosis** (bilateral exchange? eco-park? sector-wide study? corporate ESG? public/regulator view?)
2. **Q2 — temporal stance** (already operating, or still at design stage? with or without a baseline?)
3. **Q3 — which dimensions** to assess (environment / cost / social)
4. **Q4 — intended use** of the results (internal? business-to-business? public claim? EU policy?)
5. **Q5 — the nature of each exchanged flow** (waste? by-product? substitution?) — answered *per flow*
6. **Q6 — sector and technology readiness level**
7. **Q7 — geographic spread** (one site? regional? cross-border?)

Seven answers, and a space of a million collapses into **one** precise, coherent
configuration. That is the whole philosophy of the tool in one sentence.

---

## SLIDE 4 — How it works: the engine

Behind those seven questions sits a **schema-driven engine**. The methodological logic is not
hard-coded in software — it lives in declarative rule files that are independently validated.
That matters: a methodologist can read and audit the logic without reading code.

The best analogy is a **satellite navigator**. You state where you start and where you want to
go — the seven answers — and it computes the route, flagging prohibitions and warnings along
the way. It doesn't drive the car for you (it doesn't run the LCA), but it gives you the
correct itinerary and stops you taking a forbidden road.

Under the hood a single run goes through six stages:

1. **L0 — derive** the base state of the three pillars (the ILCD situation, the LCC type, the S-LCA state)
2. **L1 — block** absolute incompatibilities; impossible combinations are stopped immediately
3. **Pathway** — assign one of five routing archetypes from the Q1×Q2 matrix
4. **Activate** — switch on the relevant methodological choices
5. **L2 — validate** the cross-pillar consistency rules
6. **L3 — report** the critical decision points the analyst must be aware of

In total the engine carries **186 atomic methodological nodes** and **58 cross-method rules**,
all closed and validated — zero unknowns.

---

## SLIDE 5 — A key clarification: "5 pathways" is only the outer layer

One point worth making explicit, because it's easy to misread. People hear "five pathways"
and think the tool only produces five methodologies. That's wrong.

The **five IS pathways** (IS-01 to IS-05) are only the *outermost routing decision* — the
first fork in the road. The actual methodological configuration is a high-dimensional object,
layered like this:

- **Routing:** 5 IS pathways (the Q1×Q2 matrix)
- **Pillar states:** 5 ILCD situations × 4 LCC types × 2 S-LCA states
- **Node activation:** 186 nodes switched on or off by the answers
- **Per-flow choices:** 5 valuation types for *each* exchanged flow

So the configuration space is not five — it is effectively unbounded. The five pathways are
just the first signpost; the full methodology is assembled node by node beneath it. This is
exactly why the tool is schema-driven rather than a lookup table: you cannot tabulate a space
this large, but you *can* derive any single point in it deterministically.

*(If you simplify the deck, this can be folded into slide 3 or 4 — but it's the point most
likely to be challenged in Q&A, so keep it somewhere.)*

---

## SLIDE 6 — The outcome, part 1: the configuration

So what does the analyst actually get? Not a score — a **complete, justified methodological
recipe**. Concretely, for every case the tool returns:

- the **assigned pathway** — one of IS-01…IS-05
- the **configuration of the three pillars** — for example "environment: ILCD Situation A
  multi-actor", the costing type, the social-assessment state
- the **full list of activated choices** — on a real case we'll show, that's **over 150
  methodological decisions** derived automatically
- and crucially, **every choice is linked back to the question that generated it**

That last point is the heart of it. The analyst doesn't just see *what* was decided — they see
*why*. That traceability is what makes the resulting study defensible in front of a reviewer
or an auditor: there are no silent assumptions, every decision has a documented origin.

---

## SLIDE 7 — The outcome, part 2: checks, blocks, and export

The second half of the outcome is quality control. The engine doesn't only say what to do — it
also catches what you must *not* do:

- **Blocks** — forbidden combinations, stopped before the analysis even starts (for example,
  pairing an environmental LCC with a corporate-ESG framing, which the ILCD framework
  prohibits)
- **Warnings** — cross-method consistency flags. For instance: *"your case is geographically
  dispersed, therefore transport must be explicitly declared in both the costs and the
  environmental inventory."* These are precisely the points where studies usually go wrong,
  made explicit and unavoidable.
- **Critical decision points** — the methodological tensions the analyst should consciously
  resolve rather than stumble into.

And finally, the whole thing is **exportable to a formal report**, ready for the case
documentation. So the output is not just a decision — it is decision **plus** justification
**plus** quality checks **plus** documentation, produced in a single pass.

---

## SLIDE 8 (optional close) — Why it matters / status

The value proposition is simple: we turn a slow, expert-dependent, non-reproducible decision
into a fast, coherent, traceable process. Three concrete benefits for the consortium:

1. **Standardisation** — every partner sets up studies the same way.
2. **Defensibility** — every choice is motivated and recorded, so studies survive review.
3. **Lower barrier to entry** — even a less experienced analyst produces a methodologically
   sound study.

Status: it is a **complete, working MVP** — React front-end in five languages, FastAPI
back-end, methodology engine fully validated. The next step is to put it through real partner
case studies.

Thank you — happy to take questions.

---

### Quick-reference numbers (for Q&A)

| | |
|---|---|
| Input questions | 7 (Q1–Q7) |
| IS pathways (routing) | 5 (IS-01…IS-05) |
| ILCD situations (LCA) | 5 |
| LCC types | 4 |
| S-LCA states | 2 |
| Atomic methodological nodes | 186 (LCA 59 · LCC 61 · S-LCA 66) |
| Cross-method rules | 58 (4 blocks + 20 IR + 10 CIR + 5 FU + 7 B + 12 CDP) |
| Input combination space | ~10⁶ (unbounded with per-flow choices) |
| Pipeline stages | L0 → L1 → pathway → activate → L2 → L3 |
</content>
