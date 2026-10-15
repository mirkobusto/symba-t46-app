"""Tests for engine.l0_compute.run — Sprint 4 Step 3 commit 2.

Covers the 3 L0 trigger nodes (lca_t1, lcc_trig_01, slca_t_01),
their per-Q1 / per-Q3.eco / per-Q3.soc tables, the Q1=None
failure path, and the mutation contract that pipeline.run() relies on.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, IlcdSituation, LccType, SlcaActivationState
from app.domain.models import Q3, Case
from app.engine.l0_compute import run

# ---------------------------------------------------------------------------
# 1. lca_t1 — ILCD situation per Q1
# ---------------------------------------------------------------------------

_ILCD_CELLS = [
    (Q1.A, IlcdSituation.SITUATION_A),
    (Q1.B, IlcdSituation.SITUATION_A),
    (Q1.C, IlcdSituation.SITUATION_B),
    (Q1.D, IlcdSituation.SITUATION_C2),
    (Q1.E, IlcdSituation.SITUATION_C1),
]


@pytest.mark.parametrize("q1,expected", _ILCD_CELLS,
                         ids=[q1.value for q1, _ in _ILCD_CELLS])
def test_ilcd_situation_per_q1(q1, expected, schemas):
    case = Case(q1=q1)
    run(case, schemas)
    assert case.ilcd_situation is expected


# ---------------------------------------------------------------------------
# 2. lcc_trig_01 — LCC type per (Q1, Q3.eco)
# ---------------------------------------------------------------------------


def test_lcc_deactivated_when_eco_false_overrides_any_q1(schemas):
    """eco=false short-circuits Q1: LCC pillar is off."""
    case = Case(q1=Q1.A, q3=Q3(eco=False))
    run(case, schemas)
    assert case.lcc_type is LccType.DEACTIVATED


@pytest.mark.parametrize("q1", [Q1.A, Q1.B, Q1.E],
                         ids=lambda q: q.value)
def test_lcc_C_plus_E_for_q1_in_ABE_with_eco(q1, schemas):
    case = Case(q1=q1, q3=Q3(env=True, eco=True))
    run(case, schemas)
    assert case.lcc_type is LccType.C_LCC_PLUS_E_LCC


def test_lcc_C_plus_E_plus_S_for_q1_C_with_eco(schemas):
    case = Case(q1=Q1.C, q3=Q3(env=True, eco=True))
    run(case, schemas)
    assert case.lcc_type is LccType.E_LCC_PLUS_S_LCC_PLUS_NTF


@pytest.mark.parametrize(
    "q1, q3, policy, expected",
    [(Q1.A, Q3(eco=True), None, LccType.C_LCC_PLUS_NETWORK),
     (Q1.C, Q3(eco=True), None, LccType.C_LCC_PLUS_NETWORK_PLUS_S_LCC),
     (Q1.A, Q3(eco=True, soc=True), True, LccType.C_LCC_PLUS_NETWORK_PLUS_S_LCC),
     (Q1.C, Q3(eco=True), False, LccType.C_LCC_PLUS_NETWORK),
     (Q1.D, Q3(eco=True), True, LccType.C_LCC_ONLY)],   # C2 keeps the company-only costing
)
def test_no_lca_means_no_e_lcc(q1, q3, policy, expected):
    """D4.2 §4.1: the E-LCC is built on the parallel LCA boundary (L00551); without
    it the network level is the C-LCC consolidation (L00547, L00601)."""
    case = Case(q1=q1, q3=q3, policy_objective=policy)
    run(case, None)
    assert case.lcc_type is expected
    noted = [w["message"] for w in case.warnings if w["code"] == "lcc_without_lca"]
    assert len(noted) == (0 if expected is LccType.C_LCC_ONLY else 1)
    if expected is LccType.C_LCC_PLUS_NETWORK_PLUS_S_LCC:
        assert "externalities cannot be monetised" in noted[0]


def test_lcc_C_only_for_q1_D_with_eco(schemas):
    case = Case(q1=Q1.D, q3=Q3(eco=True))
    run(case, schemas)
    assert case.lcc_type is LccType.C_LCC_ONLY


# ---------------------------------------------------------------------------
# 3. slca_t_01 — S-LCA activation per Q3.soc (independent of Q1)
# ---------------------------------------------------------------------------


def test_slca_active_when_soc_true(schemas):
    case = Case(q1=Q1.A, q3=Q3(soc=True))
    run(case, schemas)
    assert case.slca_activation_state is SlcaActivationState.ACTIVE


def test_slca_deactivated_when_soc_false(schemas):
    case = Case(q1=Q1.A, q3=Q3(soc=False))
    run(case, schemas)
    assert case.slca_activation_state is SlcaActivationState.DEACTIVATED


# ---------------------------------------------------------------------------
# 4. Invalid input — Q1 None raises (pipeline must collect Q1 first)
# ---------------------------------------------------------------------------


def test_q1_none_raises(schemas):
    case = Case()  # q1 left as None
    with pytest.raises(ValueError, match="Invalid Q1"):
        run(case, schemas)


# ---------------------------------------------------------------------------
# 5. Mutation contract — run mutates and returns the same instance
# ---------------------------------------------------------------------------


def test_run_mutates_and_returns_same_instance(schemas):
    case = Case(q1=Q1.B, q3=Q3(env=True, eco=True, soc=True))
    assert case.ilcd_situation is None
    assert case.lcc_type is None
    assert case.slca_activation_state is None

    result = run(case, schemas)

    assert result is case
    assert case.ilcd_situation is IlcdSituation.SITUATION_A
    assert case.lcc_type is LccType.C_LCC_PLUS_E_LCC
    assert case.slca_activation_state is SlcaActivationState.ACTIVE


# ---------------------------------------------------------------------------
# 6. End-to-end — all 3 triggers populated together for a realistic case
# ---------------------------------------------------------------------------


def test_all_three_triggers_for_q1D_eco_only_case(schemas):
    """Q1=D (corporate) + ECO-only Q3 → C-LCC, no S-LCA, ILCD C2."""
    case = Case(q1=Q1.D, q3=Q3(env=True, eco=True, soc=False))
    run(case, schemas)
    assert case.ilcd_situation is IlcdSituation.SITUATION_C2
    assert case.lcc_type is LccType.C_LCC_ONLY
    assert case.slca_activation_state is SlcaActivationState.DEACTIVATED


# ---------------------------------------------------------------------------
# Case.warnings — rebuilt by every L0 run, empty when nothing is flagged
# ---------------------------------------------------------------------------


def test_warnings_start_empty_and_are_rebuilt_on_every_run():
    case = Case(q1=Q1.A, q3=Q3(env=True))
    assert case.warnings == []
    case.warnings = [{"code": "stale", "message": "from an earlier run"}]
    run(case, None)
    assert case.warnings == []


def test_a_case_saved_before_warnings_existed_still_loads():
    """case_json from an older engine has no `warnings` key."""
    stored = Case(q1=Q1.A, q3=Q3(env=True)).model_dump_json()
    import json
    legacy = json.loads(stored)
    legacy.pop("warnings")
    assert Case.model_validate_json(json.dumps(legacy)).warnings == []


# ---------------------------------------------------------------------------
# Q9 — decision and scale (D4.1 Table 1) derive the ILCD situation
# ---------------------------------------------------------------------------

from app.domain.enums import Q2, DecisionContext  # noqa: E402

_S = IlcdSituation
_N, _M, _X, _R = (DecisionContext.NONE, DecisionContext.MICRO, DecisionContext.STRUCTURAL,
                  DecisionContext.CORPORATE_REPORT)
# Q9 wins over Q1, Q1=D included (owner decision 2026-10-15). Structural cells
# assume the market screening is documented (Q9b); see the screening tests.
_ILCD_TABLE = {
    #        none            micro                 structural      corporate report
    Q1.A: (_S.SITUATION_C1, _S.SITUATION_A,       _S.SITUATION_B, _S.SITUATION_C2),
    Q1.B: (_S.SITUATION_C1, _S.SITUATION_A, _S.SITUATION_B, _S.SITUATION_C2),
    Q1.C: (_S.SITUATION_C1, _S.SITUATION_A,       _S.SITUATION_B, _S.SITUATION_C2),
    Q1.D: (_S.SITUATION_C1, _S.SITUATION_A,       _S.SITUATION_B, _S.SITUATION_C2),
    Q1.E: (_S.SITUATION_C1, _S.SITUATION_A,       _S.SITUATION_B, _S.SITUATION_C2),
}
_Q1_ONLY = {Q1.A: _S.SITUATION_A, Q1.B: _S.SITUATION_A, Q1.C: _S.SITUATION_B,
            Q1.D: _S.SITUATION_C2, Q1.E: _S.SITUATION_C1}


@pytest.mark.parametrize(
    "q1, decision, expected",
    [(q1, d, row[i]) for q1, row in _ILCD_TABLE.items() for i, d in enumerate((_N, _M, _X, _R))],
)
def test_q9_table_all_twenty_cells(q1, decision, expected):
    case = Case(q1=q1, q3=Q3(env=True), decision_context=decision, market_screening_documented=True)
    run(case, None)
    assert case.ilcd_situation == expected


@pytest.mark.parametrize("q1", list(Q1))
def test_q9_unanswered_is_exactly_the_q1_mapping(q1):
    case = Case(q1=q1, q2=Q2.A, q3=Q3(env=True))
    run(case, None)
    assert case.ilcd_situation == _Q1_ONLY[q1]
    assert case.warnings == []


@pytest.mark.parametrize("q1", list(Q1))
@pytest.mark.parametrize("q2", [Q2.B, Q2.C, Q2.D])
def test_q9_unanswered_values_never_depend_on_q2_only_the_note_does(q1, q2):
    """Audit I-06: Situation C (Q1=D or E) on a system that does not exist yet
    (Q2=C design phase, Q2=D baseline plus alternatives) is noted, never changed."""
    case = Case(q1=q1, q2=q2, q3=Q3(env=True))
    run(case, None)
    assert case.ilcd_situation == _Q1_ONLY[q1]
    noted = [w["code"] for w in case.warnings]
    expected = ["documentation_vs_ex_ante"] if q1 in (Q1.D, Q1.E) and q2 in (Q2.C, Q2.D) else []
    assert noted == expected


@pytest.mark.parametrize(
    "q1, decision, codes",
    [
        (Q1.C, _M, ["decision_scale_vs_q1"]),
        (Q1.E, _M, ["decision_scale_vs_q1"]),
        (Q1.E, _X, ["decision_scale_vs_q1"]),
        (Q1.D, _M, ["q1_d_not_corporate"]),
        (Q1.D, _N, ["q1_d_not_corporate"]),
        (Q1.D, _X, ["q1_d_not_corporate"]),
    ],
)
def test_q9_answers_that_contradict_q1_leave_a_note(q1, decision, codes):
    case = Case(q1=q1, q2=Q2.A, q3=Q3(env=True), decision_context=decision, market_screening_documented=True)
    run(case, None)
    assert [w["code"] for w in case.warnings] == codes


@pytest.mark.parametrize(
    "q1, decision",
    [(Q1.A, _M), (Q1.A, _X), (Q1.B, _M), (Q1.B, _X), (Q1.C, _X), (Q1.A, _N), (Q1.D, _R), (Q1.A, _R)],
)
def test_q9_answers_consistent_with_q1_leave_no_note(q1, decision):
    case = Case(q1=q1, q2=Q2.A, q3=Q3(env=True), decision_context=decision, market_screening_documented=True)
    run(case, None)
    assert case.warnings == []


@pytest.mark.parametrize("screening, situation, code", [
    (True, _S.SITUATION_B, None),
    (None, _S.SITUATION_B, "structural_screening_missing"),
    (False, _S.SITUATION_A, "structural_without_screening"),
])
def test_q9_structural_needs_the_market_screening(screening, situation, code):
    """D4.1 L00632: the burden of proof is on Situation B; L01293: the screening."""
    case = Case(q1=Q1.A, q2=Q2.A, q3=Q3(env=True), decision_context=_X, market_screening_documented=screening)
    run(case, None)
    assert case.ilcd_situation == situation
    assert [w["code"] for w in case.warnings] == ([code] if code else [])


@pytest.mark.parametrize("q2, noted", [(Q2.A, False), (Q2.B, False), (Q2.C, True), (Q2.D, True), (None, False)])
def test_q9_no_decision_with_an_ex_ante_q2_leaves_a_note(q2, noted):
    case = Case(q1=Q1.A, q2=q2, q3=Q3(env=True), decision_context=_N)
    run(case, None)
    assert ("documentation_vs_ex_ante" in [w["code"] for w in case.warnings]) is noted


def test_q9_c2_keeps_c_lcc_only_and_never_blocks():
    """C2 comes from Q9 (or from Q1=D when Q9 is unanswered): C-LCC only, no block.
    Q1=D with another Q9 answer is not a C2 study: C-LCC + E-LCC, no block either."""
    from app.engine.l1_blocks import run as l1_run
    for q1 in Q1:
        case = Case(q1=q1, q3=Q3(env=True, eco=True), decision_context=_R)
        run(case, None)
        assert case.ilcd_situation == _S.SITUATION_C2 and case.lcc_type == LccType.C_LCC_ONLY
        l1_run(case, None)
        assert case.blocked_by == []
    case = Case(q1=Q1.D, q3=Q3(env=True, eco=True), decision_context=_M)
    run(case, None)
    l1_run(case, None)
    assert case.ilcd_situation == _S.SITUATION_A and case.lcc_type == LccType.C_LCC_PLUS_E_LCC
    assert case.blocked_by == []


def test_q9_rejects_an_unknown_answer():
    with pytest.raises(ValueError):
        Case(q1=Q1.A, decision_context="huge")


# ---------------------------------------------------------------------------
# Q10 — public policy / territorial planning objective (D4.2 §2.3) adds the S-LCC
# ---------------------------------------------------------------------------

_Y, _NO, _UNSET = True, False, None
_CE, _CES, _CC = LccType.C_LCC_PLUS_E_LCC, LccType.E_LCC_PLUS_S_LCC_PLUS_NTF, LccType.C_LCC_ONLY
_LCC_TABLE = {
    #         unanswered  yes   no
    Q1.A: (_CE,  _CES, _CE),
    Q1.B: (_CE,  _CES, _CE),
    Q1.C: (_CES, _CES, _CE),
    Q1.D: (_CC,  _CC,  _CC),
    Q1.E: (_CE,  _CES, _CE),
}


@pytest.mark.parametrize(
    "q1, policy, expected",
    [(q1, p, row[i]) for q1, row in _LCC_TABLE.items() for i, p in enumerate((_UNSET, _Y, _NO))],
)
def test_q10_table_all_fifteen_cells(q1, policy, expected):
    case = Case(q1=q1, q3=Q3(env=True, eco=True), policy_objective=policy)
    run(case, None)
    assert case.lcc_type == expected


@pytest.mark.parametrize("q1", list(Q1))
@pytest.mark.parametrize("policy", [True, False, None])
def test_q10_with_the_economic_dimension_off_the_lcc_stays_deactivated(q1, policy):
    case = Case(q1=q1, q3=Q3(env=True), policy_objective=policy)
    run(case, None)
    assert case.lcc_type == LccType.DEACTIVATED and case.warnings == []


@pytest.mark.parametrize(
    "q1, policy, codes",
    [(Q1.C, False, ["policy_no_but_q1_c"]), (Q1.D, True, ["c2_keeps_c_lcc"]),
     (Q1.A, True, []), (Q1.A, False, []), (Q1.B, True, []), (Q1.E, True, []),
     (Q1.C, True, []), (Q1.D, False, []), (Q1.C, None, [])],
)
def test_q10_notes_only_for_contradictions(q1, policy, codes):
    case = Case(q1=q1, q3=Q3(env=True, eco=True), policy_objective=policy)
    run(case, None)
    assert [w["code"] for w in case.warnings] == codes


def test_q9_and_q10_notes_accumulate_and_are_rebuilt():
    case = Case(q1=Q1.C, q2=Q2.A, q3=Q3(env=True, eco=True),
                decision_context=DecisionContext.MICRO, policy_objective=False)
    run(case, None)
    assert sorted(w["code"] for w in case.warnings) == ["decision_scale_vs_q1", "policy_no_but_q1_c"]
    run(case, None)   # a second run replaces the notes, it does not stack them
    assert len(case.warnings) == 2


def test_q10_q1_d_with_policy_never_blocks():
    from app.engine.l1_blocks import run as l1_run
    case = Case(q1=Q1.D, q3=Q3(env=True, eco=True), policy_objective=True)
    run(case, None)
    l1_run(case, None)
    assert case.lcc_type == LccType.C_LCC_ONLY and case.blocked_by == []


# ---------------------------------------------------------------------------
# I-14 — S-LCA on its own
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "q3, noted",
    [(Q3(soc=True), True), (Q3(soc=True, env=True), False), (Q3(soc=True, eco=True), False),
     (Q3(env=True), False), (Q3(env=True, eco=True, soc=True), False)],
)
def test_slca_alone_leaves_a_note_and_changes_nothing(q3, noted):
    case = Case(q1=Q1.A, q2=Q2.A, q3=q3)
    run(case, None)
    assert ("slca_alone" in [w["code"] for w in case.warnings]) is noted
    assert case.slca_activation_state == (SlcaActivationState.ACTIVE if q3.soc else SlcaActivationState.DEACTIVATED)


# ---------------------------------------------------------------------------
# Per-flow answers: Freedom-to-Act against Q5, and the D4.1 Part 2 chapter
# ---------------------------------------------------------------------------

_FLOW_CODES = {"flow_sellable_but_waste", "flow_price_without_market", "flow_freedom_to_act_settles"}


@pytest.mark.parametrize(
    "q5, sellable, code",
    [("a", True, "flow_sellable_but_waste"), ("a", False, None), ("a", None, None),
     ("c", False, "flow_price_without_market"), ("c", True, None), ("c", None, None),
     ("b", True, "flow_freedom_to_act_settles"), ("b", False, "flow_freedom_to_act_settles"), ("b", None, None),
     # interdependent production is a co-product whatever the price (D4.1 L00996)
     ("d", False, None), ("d", True, None), ("e", False, None), ("e", True, None)],
)
def test_freedom_to_act_is_checked_against_q5(q5, sellable, code):
    case = Case(q1=Q1.A, q2=Q2.A, q3=Q3(env=True),
                flows=[{"id": "f1", "name": "sludge", "q5": q5, "sellable_elsewhere": sellable}])
    run(case, None)
    codes = [w["code"] for w in case.warnings if w["code"] in _FLOW_CODES]
    assert codes == ([code] if code else [])
    assert all("'sludge'" in w["message"] for w in case.warnings if w["code"] in _FLOW_CODES)
    assert case.flows[0].q5 == q5          # a note never changes Q5


@pytest.mark.parametrize(
    "sector, chapter",
    [("agriculture_agrifood_biorefineries", "§4"), ("food_production", "§4"), ("plastics_packaging", "§5"),
     ("biobased_polymers", "§5"), ("wastewater_sludge_biofactories", "§6"), ("textile_leather", "§7"),
     ("waste_valorization", "§8"), ("steel_metals", None), (None, None)],
)
def test_flow_sector_names_the_part2_chapter(sector, chapter):
    case = Case(q1=Q1.A, q2=Q2.A, q3=Q3(env=True),
                flows=[{"id": "f1", "name": "x", "q5": "c", "sector": sector}])
    run(case, None)
    notes = [w["message"] for w in case.warnings if w["code"] == "flow_part2_chapter"]
    assert len(notes) == (1 if chapter else 0)
    if chapter:
        assert f"Part 2 {chapter} " in notes[0]
