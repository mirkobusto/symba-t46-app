"""L0 — Trigger node computation.

Derives the 3 L0 trigger nodes from Q1-Q3 BEFORE any L1/L2/L3 logic runs.
These are deterministic functions of the user answers; they have no
violation semantics — they simply COMPUTE state that downstream phases
read. By convention these are the only 3 nodes with lifecycle_layer=L0.

    lca_t1         (Q1, Q9)    -> Case.ilcd_situation   (Q9 optional; unanswered = Q1 alone)
    lcc_trig_01    (Q1,Q3.eco,Q10) -> Case.lcc_type  (Q10 optional; unanswered = Q1 alone)
    slca_t_01      (Q3.soc)    -> Case.slca_activation_state

Mapping source: backend/app/schemas/phase1_nodes.json — entries
`lca_t1`, `lcc_trig_01`, `slca_t_01`. The JSON `default_value` blocks
encode the mapping in human-readable strings; this module re-encodes
the same logic against the typed enums in app.domain.enums (which is
the source of truth for serialized values; the JSON strings are
documentation).

Note on `lca_t1`: its JSON table only discriminates on `q1` and lists `q2`
in `trigger_q`; that table documents the Q1-only mapping, which is what
applies when the optional Q9 (decision and scale) is unanswered. With Q9
answered the situation comes from `_derive_ilcd_situation` (D4.1 Table 1),
and Q2 is consulted only for a note. The same holds for `lcc_trig_01` and the
optional Q10. Nodes that read the situation or the LCC type use the derived
state through the `ilcd=` / `lcc_type=` branch keys. Update the JSON tables
and this module together.
"""
from __future__ import annotations

from typing import Any

from app.domain.enums import Q1, Q2, Q4, Q5, DecisionContext, IlcdSituation, LccType, Q6a, SlcaActivationState
from app.domain.models import Case
from app.engine.loader import LoadedSchemas

_VALID_Q1 = frozenset({Q1.A, Q1.B, Q1.C, Q1.D, Q1.E})

_ILCD_BY_Q1: dict[Q1, IlcdSituation] = {
    Q1.A: IlcdSituation.SITUATION_A,
    Q1.B: IlcdSituation.SITUATION_A,   # "A multi-actor" retired 2026-10-15: not a D4.1 category
    Q1.C: IlcdSituation.SITUATION_B,
    Q1.D: IlcdSituation.SITUATION_C2,
    Q1.E: IlcdSituation.SITUATION_C1,
}


def _compute_ilcd_situation(q1: Q1 | None) -> IlcdSituation:
    if q1 not in _VALID_Q1:
        raise ValueError(f"Invalid Q1: {q1!r}")
    return _ILCD_BY_Q1[q1]


# Q9 (D4.1 Table 1): the situation follows the decision and its scale, not the
# subject of the study (owner decision 2026-10-15: Q9 wins over Q1, Q1=D included).
# Q1 is only the fallback for cases saved without Q9. "A multi-actor" is no longer
# produced: D4.1 Table 1 has Situations A, B and C only (L00574-576).
_S = IlcdSituation
_N, _M, _X, _R = (DecisionContext.NONE, DecisionContext.MICRO, DecisionContext.STRUCTURAL,
                  DecisionContext.CORPORATE_REPORT)


def _micro(q1: Q1) -> IlcdSituation:
    return _S.SITUATION_A


# Where the explicit answer contradicts what Q1 implies the engine says so (a
# warning, never a block, never a silent change). Q1 implies: A/B limited
# consequences, C structural, D company reporting, E no decision.
_DECISION_WARNINGS: dict[tuple[Q1, DecisionContext], tuple[str, str, str]] = {
    (Q1.C, _M): ("decision_scale_vs_q1", "c_micro", "Q1 (sector-wide pre-feasibility) usually means consequences at "
                 "structural scale; you answered limited consequences, so the study is treated as ILCD "
                 "Situation A. D4.1 §4.3.4: do not choose Consequential LCA simply because a decision is "
                 "being made."),
    (Q1.E, _M): ("decision_scale_vs_q1", "e_micro", "Q1=E (monitoring) implies no decision; you answered that a decision "
                 "with limited consequences is supported, so the study is treated as ILCD Situation A."),
    (Q1.E, _X): ("decision_scale_vs_q1", "e_structural", "Q1=E (monitoring) implies no decision; you answered that a decision "
                 "with structural consequences is supported, so the study is treated as ILCD Situation B."),
}
_Q1_D_NOT_CORPORATE = ("q1_d_not_corporate", "Q1=D describes one company's sustainability reporting, but Q9 "
                       "says the study is not a corporate report; the ILCD situation follows Q9. Strict "
                       "corporate reporting (allocation, no credits) is ILCD Situation C2 (D4.1 §7.2.3).")


def _derive_ilcd_situation(case: Case) -> tuple[IlcdSituation, list[dict[str, Any]]]:
    """ILCD situation and the notes about it.

    Q9 unanswered: the Q1 mapping (cases saved before Q9 keep their values). Q9
    answered: D4.1 Table 1 and §7.2.3, plus a note when it contradicts Q1. A
    structural answer needs the market screening (Q9b): without it the study stays
    Situation A, B being a sensitivity (L00632). In every case a note when
    Situation C meets an ex-ante Q2 (audit I-06).
    """
    base = _compute_ilcd_situation(case.q1)   # raises on an invalid Q1
    decision = case.decision_context
    notes: list[dict[str, Any]] = []
    if decision is None:
        situation = base
    else:
        if decision == _X:
            if case.market_screening_documented is False:
                situation = _micro(case.q1)
                notes.append({"code": "structural_without_screening", "message": (
                    "Q9 says the effects are structural, but the market screening is not documented: the "
                    "study is treated as ILCD Situation A, and Situation B must be tested as a sensitivity "
                    "(D4.1 §4.3.4, §11.3.1).")})
            else:
                situation = _S.SITUATION_B
                if case.market_screening_documented is None:
                    notes.append({"code": "structural_screening_missing", "message": (
                        "Situation B needs proof that the change displaces about 1% or more of new capacity "
                        "in the affected market (D4.1 §11.3.1); document it, or the study is Situation A "
                        "with B as a sensitivity (D4.1 §4.3.4).")})
        elif decision == _M:
            situation = _micro(case.q1)
        elif decision == _N:
            situation = _S.SITUATION_C1
        else:
            situation = _S.SITUATION_C2
        if (case.q1, decision) in _DECISION_WARNINGS:
            code, variant, message = _DECISION_WARNINGS[(case.q1, decision)]
            notes.append({"code": code, "message": message, "params": {"variant": variant}})
        if case.q1 == Q1.D and decision != _R:
            notes.append({"code": _Q1_D_NOT_CORPORATE[0], "message": _Q1_D_NOT_CORPORATE[1]})
    # "No decision" presupposes an existing network (D4.1 L00576): Situation C with
    # exchanges that do not take place yet is a contradiction worth a note.
    if situation in {_S.SITUATION_C1, _S.SITUATION_C2} and case.q2 == Q2.B:
        notes.append({
            "code": "documentation_vs_ex_ante",
            "message": "ILCD Situation C documents exchanges that already take place, but Q2 says they "
                       "do not take place yet. Check that the situation is the one you mean.",
        })
    return situation, notes


def _derive_lcc_type(case: Case) -> tuple[LccType, list[dict[str, Any]]]:
    """LCC type and the notes about it. Runs after the ILCD situation.

    Strict reporting of one company (Situation C2) keeps the company-level costing,
    "C-LCC only" (declared T4.6 choice: no network level). Otherwise C-LCC per
    partner + E-LCC at network level, plus the S-LCC when the study serves a public
    policy or planning objective (D4.2 §2.3, L00473). Without the environmental
    dimension there is no E-LCC: C-LCC per partner + network consolidation (C+N),
    plus the S-LCC on a policy objective (C+N+S). Q10 unanswered: inferred from
    Q1 (yes only for Q1=C), as before Q10 existed.
    """
    if not case.q3.eco:
        return LccType.DEACTIVATED, []
    if case.q1 not in _VALID_Q1:
        raise ValueError(f"Invalid Q1: {case.q1!r}")
    notes: list[dict[str, Any]] = []
    policy = case.policy_objective
    if case.ilcd_situation == _S.SITUATION_C2:
        if policy:
            notes.append({"code": "c2_keeps_c_lcc", "message": "Strict reporting of one company (ILCD "
                          "Situation C2) keeps the company-level costing (C-LCC only) whatever Q10 says: it "
                          "is a T4.6 design choice, since a single company has no network level."})
        return LccType.C_LCC_ONLY, notes
    if policy is None:
        policy = case.q1 == Q1.C
    elif not policy and case.q1 == Q1.C:
        notes.append({"code": "policy_no_but_q1_c", "message": "Q1=C (sector-wide pre-feasibility) usually serves "
                      "a public policy; you answered that it does not, so the societal costing (S-LCC, net tax "
                      "factor, social discount rate) is not added."})
    if not case.q3.env:
        # No parallel LCA: the E-LCC has nothing to stay consistent with (D4.2 §4.1,
        # L00551); the network level is the C-LCC consolidation (L00547, L00601).
        notes.append({"code": "lcc_without_lca", "params": {"variant": "policy" if policy else "plain"}, "message": (
            "Q3 has no environmental dimension, so there is no parallel LCA: the costing is the "
            "conventional LCC of each partner, consolidated at network level (D4.2 §4.1), without the "
            "environmental LCC, which D4.2 builds on the LCA boundary." + (
                " The societal LCC keeps the net tax factor and the social discount rate, but "
                "externalities cannot be monetised without the LCA results (D4.2 §11.2)." if policy else ""))})
        return (LccType.C_LCC_PLUS_NETWORK_PLUS_S_LCC if policy else LccType.C_LCC_PLUS_NETWORK), notes
    return (LccType.E_LCC_PLUS_S_LCC_PLUS_NTF if policy else LccType.C_LCC_PLUS_E_LCC), notes


def _c2_pef_notes(case: Case) -> list[dict[str, Any]]:
    """Q4=D asks for the PEF Circular Footprint Formula, a product method; strict
    accounting of one partner (Situation C2) uses allocation and no substitution
    credits (D4.1 §7.2.3). Allocation wins (lca_mc_13/14, CIR-05); say so."""
    if case.ilcd_situation == _S.SITUATION_C2 and Q4.D in case.q4 and case.q3.env:
        return [{"code": "c2_allocation_over_pef", "message": (
            "Strict reporting of one company (ILCD Situation C2) uses allocation and no substitution "
            "credits (D4.1 §7.2.3), so the PEF Circular Footprint Formula asked by Q4=D is not applied: "
            "the CFF is a product method. If the study is a product footprint rather than a corporate "
            "report, review Q9.")}]
    return []


def _slca_notes(case: Case) -> list[dict[str, Any]]:
    """S-LCA alone (Q3 = social only) is accepted, but D4.3 §3.1 presupposes the
    functional unit and boundaries of an LCA or an LCC to build on (audit I-14).
    A note, not a block: nothing is invented, and slca_hc_06 stays off."""
    q3 = case.q3
    if q3.soc and not q3.env and not q3.eco:
        return [{"code": "slca_alone", "message": "Q3 selects the social dimension only. D4.3 §3.1 builds the "
                 "S-LCA on the functional unit and the boundaries of an LCA or LCC; with none selected, "
                 "document the reference unit and the boundary in the methodological charter."}]
    return []


# D4.1 Part 2 sector chapters (FINAL v2 numbering, §3.3 L00349-359). Biobased
# polymers sit in §5 ("bio-based alternatives", L00353), food production in §4.
PART2_CHAPTER: dict[Q6a, str] = {
    Q6a.AGRICULTURE_AGRIFOOD_BIOREFINERIES: "§4 Agri-Food and Biorefineries",
    Q6a.FOOD_PRODUCTION: "§4 Agri-Food and Biorefineries",
    Q6a.PLASTICS_PACKAGING: "§5 Plastics and Packaging",
    Q6a.BIOBASED_POLYMERS: "§5 Plastics and Packaging",
    Q6a.WASTEWATER_SLUDGE_BIOFACTORIES: "§6 Wastewater and Biofactories",
    Q6a.TEXTILE_LEATHER: "§7 Textile and Technical Textiles",
    Q6a.WASTE_VALORIZATION: "§8 Waste Valorisation",
}


def _flow_notes(case: Case) -> list[dict[str, Any]]:
    """Per-flow notes from the two optional flow answers; unanswered = none.

    Freedom-to-Act (D4.1 §8.3.3, L00990-994): a flow a third party would buy is a
    co-product, one nobody would buy is a waste whatever the nominal price. The
    test is checked against who pays whom (Q5): a = generator pays, c = recipient
    pays, b = undecided. Q5 = d is left alone because interdependent production
    makes the flow a co-product regardless of price (L00974, L00996); Q5 = e
    aggregates the flow away. A note never changes Q5.
    """
    notes: list[dict[str, Any]] = []
    for f in case.flows:
        label = f"Flow '{f.name or f.id}'"
        sell = f.sellable_elsewhere
        if sell is True and f.q5 == Q5.a:
            notes.append({"code": "flow_sellable_but_waste", "params": {"flow": f.name or f.id}, "message": (
                f"{label}: Q5 says the generator pays to get rid of it (waste), but a third party would "
                "pay for it. D4.1 §8.3.3 and §8.3.6 Step 1: a flow with an independent positive market "
                "value is a co-product, and its upstream burden is shared (substitution or allocation), "
                "not cut off. Check Q5 for this flow.")})
        elif sell is False and f.q5 == Q5.c:
            notes.append({"code": "flow_price_without_market", "params": {"flow": f.name or f.id}, "message": (
                f"{label}: Q5 says the recipient pays for it (co-product), but no third party would. "
                "D4.1 §8.3.3: without an independent market the price is an administrative fee and the "
                "flow is a waste, with zero burden from where it first reaches a non-negative value "
                "(§8.3.6 Step 4). The exception is a generator that changes its process for the partner "
                "(Q5 = d).")})
        elif sell is not None and f.q5 == Q5.b:
            reading = ("a co-product (§8.3.2, burden shared)" if sell else
                       "a waste (zero burden from where it first reaches a non-negative value, §8.3.6 Step 4)")
            notes.append({"code": "flow_freedom_to_act_settles",
                          "params": {"flow": f.name or f.id, "variant": "co_product" if sell else "waste"}, "message": (
                f"{label}: Q5 leaves who pays whom open; the Freedom-to-Act answer (D4.1 §8.3.3) "
                f"reads it as {reading}.")})
        chapter = PART2_CHAPTER.get(f.sector) if f.sector else None
        if chapter:
            notes.append({"code": "flow_part2_chapter",
                          "params": {"flow": f.name or f.id, "chapter": chapter.split(" ")[0]}, "message": (
                f"{label}: the sector rules of D4.1 Part 2 {chapter} apply to it; they are listed under Sector rules.")})
    return notes


def _compute_slca_state(soc: bool) -> SlcaActivationState:
    return SlcaActivationState.ACTIVE if soc else SlcaActivationState.DEACTIVATED


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Compute L0 trigger node outputs and write them onto `case`.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention; see app/engine/pipeline.py).

    The `schemas` argument is reserved for future schema-driven L0
    logic; it is not consulted in this commit.

    Raises:
        ValueError: if `case.q1` is not one of {Q1.A..Q1.E} (covers
            `case.q1 is None`). The pipeline must collect Q1 before
            calling run.
    """
    case.ilcd_situation, case.warnings = _derive_ilcd_situation(case)   # warnings rebuilt on every run
    case.lcc_type, lcc_notes = _derive_lcc_type(case)
    case.warnings += lcc_notes
    case.slca_activation_state = _compute_slca_state(case.q3.soc)
    case.warnings += _c2_pef_notes(case)
    case.warnings += _slca_notes(case)
    case.warnings += _flow_notes(case)
    return case
