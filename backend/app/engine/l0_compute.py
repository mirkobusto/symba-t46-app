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

from app.domain.enums import Q1, Q2, DecisionContext, IlcdSituation, LccType, SlcaActivationState
from app.domain.models import Case
from app.engine.loader import LoadedSchemas

_VALID_Q1 = frozenset({Q1.A, Q1.B, Q1.C, Q1.D, Q1.E})

_ILCD_BY_Q1: dict[Q1, IlcdSituation] = {
    Q1.A: IlcdSituation.SITUATION_A,
    Q1.B: IlcdSituation.SITUATION_A_MULTI,
    Q1.C: IlcdSituation.SITUATION_B,
    Q1.D: IlcdSituation.SITUATION_C2,
    Q1.E: IlcdSituation.SITUATION_C1,
}


def _compute_ilcd_situation(q1: Q1 | None) -> IlcdSituation:
    if q1 not in _VALID_Q1:
        raise ValueError(f"Invalid Q1: {q1!r}")
    return _ILCD_BY_Q1[q1]


# Q9 (D4.1 Table 1): the situation follows the decision and its scale, not the
# subject of the study. Rows are Q1, columns the Q9 answer. Q1=D is Situation C2
# whatever Q9 says: "C-LCC only / C2" is a declared T4.6 choice.
_S = IlcdSituation
_N, _M, _X = DecisionContext.NONE, DecisionContext.MICRO, DecisionContext.STRUCTURAL
_ILCD_BY_DECISION: dict[Q1, dict[DecisionContext, IlcdSituation]] = {
    Q1.A: {_N: _S.SITUATION_C1, _M: _S.SITUATION_A, _X: _S.SITUATION_B},
    Q1.B: {_N: _S.SITUATION_C1, _M: _S.SITUATION_A_MULTI, _X: _S.SITUATION_B},
    Q1.C: {_N: _S.SITUATION_C1, _M: _S.SITUATION_A, _X: _S.SITUATION_B},
    Q1.D: {_N: _S.SITUATION_C2, _M: _S.SITUATION_C2, _X: _S.SITUATION_C2},
    Q1.E: {_N: _S.SITUATION_C1, _M: _S.SITUATION_A, _X: _S.SITUATION_B},
}

# Where the explicit answer contradicts what Q1 implies the engine says so (a
# warning, never a block, never a silent change). Q1 implies: A/B limited
# consequences, C structural, D/E no decision.
_DECISION_WARNINGS: dict[tuple[Q1, DecisionContext], tuple[str, str]] = {
    (Q1.C, _M): ("decision_scale_vs_q1", "Q1 (sector-wide pre-feasibility) usually means consequences at "
                 "structural scale; you answered limited consequences, so the study is treated as ILCD "
                 "Situation A. D4.1 §5.3.4: do not choose Consequential LCA simply because a decision is "
                 "being made."),
    (Q1.D, _M): ("q1_d_fixed", "Q1=D (corporate reporting) stays ILCD Situation C2 whatever Q9 says: it is a "
                 "T4.6 design choice."),
    (Q1.D, _X): ("q1_d_fixed", "Q1=D (corporate reporting) stays ILCD Situation C2 whatever Q9 says: it is a "
                 "T4.6 design choice."),
    (Q1.E, _M): ("decision_scale_vs_q1", "Q1=E (monitoring) implies no decision; you answered that a decision "
                 "with limited consequences is supported, so the study is treated as ILCD Situation A."),
    (Q1.E, _X): ("decision_scale_vs_q1", "Q1=E (monitoring) implies no decision; you answered that a decision "
                 "with structural consequences is supported, so the study is treated as ILCD Situation B."),
}


def _derive_ilcd_situation(case: Case) -> tuple[IlcdSituation, list[dict[str, str]]]:
    """ILCD situation and the notes about it.

    Q9 unanswered: the Q1 mapping, no notes (the engine behaves as before Q9
    existed). Q9 answered: D4.1 Table 1, plus a note when it contradicts Q1 and
    when "no decision" (a documented, existing network) meets an ex-ante Q2.
    """
    base = _compute_ilcd_situation(case.q1)   # raises on an invalid Q1
    decision = case.decision_context
    if decision is None:
        return base, []
    situation = _ILCD_BY_DECISION[case.q1][decision]
    notes: list[dict[str, str]] = []
    if (case.q1, decision) in _DECISION_WARNINGS:
        code, message = _DECISION_WARNINGS[(case.q1, decision)]
        notes.append({"code": code, "message": message})
    # Q2=B is "under construction or recently commissioned" (the questionnaire's own
    # wording): the network exists or nearly does, so documenting it is coherent and
    # no note is left. Q2=C (design phase, no operating data) and Q2=D (baseline plus
    # alternatives, which imply a decision) are the ones that contradict "no decision".
    if situation in {_S.SITUATION_C1, _S.SITUATION_C2} and case.q2 in {Q2.C, Q2.D}:
        notes.append({
            "code": "documentation_vs_ex_ante",
            "message": "ILCD Situation C documents a network that already exists, but Q2 describes an "
                       "ex-ante study (the network is not operating yet, or alternatives are compared). "
                       "Check that the situation is the one you mean.",
        })
    return situation, notes


def _compute_lcc_type(q1: Q1 | None, eco: bool) -> LccType:
    if not eco:
        # Q1 irrelevant when LCC pillar is off.
        return LccType.DEACTIVATED
    if q1 not in _VALID_Q1:
        raise ValueError(f"Invalid Q1: {q1!r}")
    if q1 == Q1.C:
        return LccType.E_LCC_PLUS_S_LCC_PLUS_NTF
    if q1 == Q1.D:
        return LccType.C_LCC_ONLY
    # q1 ∈ {A, B, E}
    return LccType.C_LCC_PLUS_E_LCC


def _derive_lcc_type(case: Case) -> tuple[LccType, list[dict[str, str]]]:
    """LCC type and the notes about it.

    Q10 unanswered: the Q1 mapping, no notes (as before Q10 existed). Q10
    answered (D4.2 §2.3: an S-LCC is added when the study serves a public policy
    or territorial planning objective): the answer wins over Q1, except Q1=D,
    which stays "C-LCC only" (declared T4.6 choice; it also keeps
    block_C2_plus_E-LCC from firing). Contradictions leave a note.
    """
    base = _compute_lcc_type(case.q1, case.q3.eco)   # raises on an invalid Q1 when eco is on
    policy = case.policy_objective
    if base == LccType.DEACTIVATED or policy is None:
        return base, []
    notes: list[dict[str, str]] = []
    if case.q1 == Q1.D:
        if policy:
            notes.append({"code": "q1_d_fixed_lcc", "message": "Q1=D (corporate reporting) keeps the "
                          "conventional company-level costing (C-LCC only) whatever Q10 says: it is a T4.6 "
                          "design choice."})
        return base, notes
    if policy:
        return LccType.E_LCC_PLUS_S_LCC_PLUS_NTF, notes
    if case.q1 == Q1.C:
        notes.append({"code": "policy_no_but_q1_c", "message": "Q1=C (sector-wide pre-feasibility) usually serves "
                      "a public policy; you answered that it does not, so the societal costing (S-LCC, net tax "
                      "factor, social discount rate) is not added."})
    return LccType.C_LCC_PLUS_E_LCC, notes


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
    return case
