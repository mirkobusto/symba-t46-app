"""12-paper regression suite — Sprint 4 Step 3 commit 7.

Validates the engine's end-to-end behaviour against the 13 fixtures
extracted from `docs/implementation/SYMBA_T46_Validation_WorkingDoc_v1.md`
§3.1 (Q1-Q7 compilation) and §3.3 (pathway mapping). One fixture per
paper; Leiva 2025 has two sub-cases (Escombreras + Frövi) that exercise
different Q1 values, so the count is 13 instead of 12.

Validation philosophy (per WorkingDoc §1.2): methodological configuration
coherence, NOT numerical replication. We assert that the pipeline
produces the expected:

    pathway_id, is_01_extended, ilcd_situation, lcc_type,
    slca_activation_state, no L1 BLOCK fires, ≥116 activated nodes

We do NOT assert exact `activated_nodes` set membership per paper — that
is the territory of the per-paper Word .docx validation reports
(post-Sprint-4 deliverable, see WorkingDoc §6).

Known divergence — Kerdlap (Paper 9): WorkingDoc §3.3 mapping table
lists IS-01, but the §3.3 derivation rule "Q2=C → IS-04 (any Q1)" plus
the γ matrix (ADR-005) both produce IS-04. The mapping table is
inconsistent with its own rule. Engine follows the rule (IS-04). The
fixture below reflects engine behaviour with an inline note.

Q6a note: the sector enum currently has 5 placeholder values; the full
14 sectors arrive with `sector_overlays.json` wiring (post-Step-3). All
fixtures here use `Q6a.OTHER` except Wiktor (`WASTEWATER_BIOFACTORIES`)
and Kerdlap (`AGRI_FOOD`).
"""
from __future__ import annotations

from collections import Counter
from typing import Any

import pytest

from app.domain.enums import (
    Q1,
    Q2,
    Q4,
    Q5,
    Q7,
    IlcdSituation,
    LccType,
    PathwayId,
    Q6a,
    Q6b,
    SlcaActivationState,
)
from app.domain.models import Q3, Case, Flow
from app.engine.pipeline import run as pipeline_run

# ---------------------------------------------------------------------------
# Fixture definitions — 13 papers (12 + Leiva split)
# ---------------------------------------------------------------------------


def _flows(*qs: Q5) -> list[Flow]:
    """Build a list of Flow objects with auto-generated IDs."""
    return [Flow(id=f"f{i+1}", name=f"flow{i+1}", q5=q) for i, q in enumerate(qs)]


_PAPERS: list[dict[str, Any]] = [
    # 1. Sokka 2011 — Kymenlaakso pulp & paper, ENV-only, black-box
    {
        "id": "sokka_2011",
        "q1": Q1.B, "q2": Q2.D,
        "q3": Q3(env=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.e),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.B,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.DEACTIVATED,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 2. Hashimoto 2010 — Kawasaki cement, ENV-only, mixed flows
    {
        "id": "hashimoto_2010",
        "q1": Q1.B, "q2": Q2.D,
        "q3": Q3(env=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.a, Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.B,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.DEACTIVATED,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 3. Daddi 2017 — Santa Croce tannery cluster
    {
        "id": "daddi_2017",
        "q1": Q1.B, "q2": Q2.D,
        "q3": Q3(env=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.b, Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.B,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.DEACTIVATED,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 4. Paulu 2022 — Czech industry-wide policy assessment
    {
        "id": "paulu_2022",
        "q1": Q1.C, "q2": Q2.D,
        "q3": Q3(env=True),
        "q4": {Q4.D, Q4.E},  # multi-select: PEF + academic
        "flows": _flows(Q5.e),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.D,
        "expected_pathway": PathwayId.IS_02,
        "expected_extended": False,
        "expected_ilcd": IlcdSituation.SITUATION_B,
        "expected_lcc_type": LccType.DEACTIVATED,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 5. Arce Bastias 2023 — Mendoza plastic recycling, ex-post
    {
        "id": "arce_bastias_2023",
        "q1": Q1.B, "q2": Q2.A,
        "q3": Q3(env=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.b, Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.A,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": False,  # Q2=A, not D
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.DEACTIVATED,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 6. Wiktor & Johansson 2018 — Malmö sewage sludge, ENV+ECO
    {
        "id": "wiktor_2018",
        "q1": Q1.B, "q2": Q2.D,
        "q3": Q3(env=True, eco=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.a, Q5.c, Q5.c),
        "q6a": Q6a.WASTEWATER_BIOFACTORIES, "q6b": Q6b.TRL7_8, "q7": Q7.B,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.C_LCC_PLUS_E_LCC,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 7a. Leiva 2025 (Escombreras) — Q1=A specific exchange, ECO-only
    {
        "id": "leiva_2025_escombreras",
        "q1": Q1.A, "q2": Q2.D,
        "q3": Q3(eco=True),  # ECO-only per WorkingDoc §3.1
        "q4": {Q4.E},
        "flows": _flows(Q5.b, Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.B,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A,
        "expected_lcc_type": LccType.C_LCC_PLUS_E_LCC,  # Q1∈{A,B,E} + eco
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 7b. Leiva 2025 (Frövi) — Q1=B eco-park
    {
        "id": "leiva_2025_frovi",
        "q1": Q1.B, "q2": Q2.D,
        "q3": Q3(eco=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.b, Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL7_8, "q7": Q7.B,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.C_LCC_PLUS_E_LCC,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 8. Danielsson 2018 — Kalundborg, ENV+ECO, public-claim Q4=C
    {
        "id": "danielsson_2018",
        "q1": Q1.B, "q2": Q2.D,
        "q3": Q3(env=True, eco=True),
        "q4": {Q4.C},
        "flows": _flows(Q5.e),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.B,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.C_LCC_PLUS_E_LCC,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 9. Kerdlap 2024 — fictional urban agri-food
    # NOTE: WorkingDoc §3.3 mapping table lists IS-01 but its own derivation
    # rule "Q2=C → IS-04 (any Q1)" + γ matrix (ADR-005) both yield IS-04.
    # The mapping table contradicts its own rule. Engine follows the rule.
    {
        "id": "kerdlap_2024",
        "q1": Q1.B, "q2": Q2.C,
        "q3": Q3(env=True, eco=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.b, Q5.c),
        "q6a": Q6a.AGRI_FOOD, "q6b": Q6b.TRL9, "q7": Q7.A,
        "expected_pathway": PathwayId.IS_04,  # γ rule, NOT WorkingDoc mapping
        "expected_extended": False,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.C_LCC_PLUS_E_LCC,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 10. Subramanian 2021 — The Plant Chicago, full LCSA (ENV+ECO+SOC)
    {
        "id": "subramanian_2021",
        "q1": Q1.B, "q2": Q2.D,
        "q3": Q3(env=True, eco=True, soc=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.b, Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.A,
        "expected_pathway": PathwayId.IS_01,
        "expected_extended": True,
        "expected_ilcd": IlcdSituation.SITUATION_A_MULTI,
        "expected_lcc_type": LccType.C_LCC_PLUS_E_LCC,
        "expected_slca": SlcaActivationState.ACTIVE,
    },
    # 11. Zhu 2013 — generic 2-firm, design-only, ENV+ECO
    # WorkingDoc says "varies per scenario"; we use a representative scenario.
    {
        "id": "zhu_2013",
        "q1": Q1.A, "q2": Q2.C,
        "q3": Q3(env=True, eco=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": Q7.A,
        "expected_pathway": PathwayId.IS_04,  # Q2=C with Q1=A
        "expected_extended": False,
        "expected_ilcd": IlcdSituation.SITUATION_A,
        "expected_lcc_type": LccType.C_LCC_PLUS_E_LCC,
        "expected_slca": SlcaActivationState.DEACTIVATED,
    },
    # 12. Briassoulis 2023 — bio-based polymers framework, full LCSA
    # WorkingDoc Q7=n/a → None
    {
        "id": "briassoulis_2023",
        "q1": Q1.C, "q2": Q2.C,
        "q3": Q3(env=True, eco=True, soc=True),
        "q4": {Q4.E},
        "flows": _flows(Q5.b, Q5.c),
        "q6a": Q6a.OTHER, "q6b": Q6b.TRL9, "q7": None,
        "expected_pathway": PathwayId.IS_02,  # Q1=C → IS-02 (Q2 ignored)
        "expected_extended": False,
        "expected_ilcd": IlcdSituation.SITUATION_B,
        "expected_lcc_type": LccType.E_LCC_PLUS_S_LCC_PLUS_NTF,  # Q1=C + eco
        "expected_slca": SlcaActivationState.ACTIVE,
    },
]


def _build_case(fixture: dict[str, Any]) -> Case:
    return Case(
        q1=fixture["q1"],
        q2=fixture["q2"],
        q3=fixture["q3"],
        q4=fixture["q4"],
        q6a=fixture["q6a"],
        q6b=fixture["q6b"],
        q7=fixture["q7"],
        flows=fixture["flows"],
    )


# ---------------------------------------------------------------------------
# Per-paper parameterized regression
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("fixture", _PAPERS, ids=[p["id"] for p in _PAPERS])
def test_paper_pipeline_consistency(fixture, schemas):
    case = _build_case(fixture)
    result = pipeline_run(case, schemas)

    assert result is case
    assert case.pathway_id == fixture["expected_pathway"], (
        f"{fixture['id']}: pathway mismatch")
    assert case.is_01_extended == fixture["expected_extended"], (
        f"{fixture['id']}: is_01_extended mismatch")
    assert case.ilcd_situation == fixture["expected_ilcd"], (
        f"{fixture['id']}: ilcd_situation mismatch")
    assert case.lcc_type == fixture["expected_lcc_type"], (
        f"{fixture['id']}: lcc_type mismatch")
    assert case.slca_activation_state == fixture["expected_slca"], (
        f"{fixture['id']}: slca_activation_state mismatch")
    # No L1 BLOCK should fire on a properly-configured paper case
    assert case.blocked_by == [], (
        f"{fixture['id']}: unexpected L1 blocks {case.blocked_by}")
    # At least all 116 DEFAULT nodes must have activated
    assert len(case.activated_nodes) >= 116, (
        f"{fixture['id']}: only {len(case.activated_nodes)} nodes activated")


# ---------------------------------------------------------------------------
# Aggregate sanity checks across the suite
# ---------------------------------------------------------------------------


def test_pathway_distribution_matches_workingdoc(schemas):
    """Empirical distribution per WorkingDoc §3.3:
    9 IS-01, 2 IS-02, 2 IS-04, 0 IS-03, 0 IS-05 (under-sampled)."""
    pathways = []
    for fixture in _PAPERS:
        case = _build_case(fixture)
        pipeline_run(case, schemas)
        pathways.append(case.pathway_id)
    counts = Counter(pathways)
    assert counts[PathwayId.IS_01] == 9
    assert counts[PathwayId.IS_02] == 2
    assert counts[PathwayId.IS_04] == 2
    assert counts[PathwayId.IS_03] == 0
    assert counts[PathwayId.IS_05] == 0


def test_extended_flag_count(schemas):
    """is_01_extended fires on IS-01 + Q2=D. From the 13 fixtures:
    8 papers have IS-01 + Q2=D (Sokka, Hashimoto, Daddi, Wiktor,
    Leiva-Esc, Leiva-Frövi, Danielsson, Subramanian); Arce is IS-01
    but Q2=A so flag is False."""
    n_extended = 0
    for fixture in _PAPERS:
        case = _build_case(fixture)
        pipeline_run(case, schemas)
        if case.is_01_extended:
            n_extended += 1
    assert n_extended == 8


def test_cdp_surfaces_for_multi_dim_papers(schemas):
    """Papers with Q3 ≥2 active dims should surface ≥1 CDP. From fixtures:
    Wiktor, Leiva-Esc/Frövi (eco only = 1 dim → no CDP), Danielsson,
    Kerdlap, Subramanian, Zhu, Briassoulis."""
    multi_dim_count = 0
    cdp_present_count = 0
    for fixture in _PAPERS:
        q3 = fixture["q3"]
        n_dims = sum([q3.env, q3.eco, q3.soc])
        if n_dims < 2:
            continue
        multi_dim_count += 1
        case = _build_case(fixture)
        pipeline_run(case, schemas)
        if len(case.cdp_flags) > 0:
            cdp_present_count += 1
    # Every multi-dim case must surface at least one CDP
    assert multi_dim_count > 0
    assert cdp_present_count == multi_dim_count


def test_no_paper_triggers_l1_block(schemas):
    """All 13 papers are real, properly-configured studies; none should
    trigger an L1 BLOCK cell."""
    for fixture in _PAPERS:
        case = _build_case(fixture)
        pipeline_run(case, schemas)
        assert case.blocked_by == [], (
            f"{fixture['id']}: unexpected blocks {case.blocked_by}")


def test_fixture_count_is_13(schemas):
    """Sanity: 12 papers + 1 Leiva sub-case = 13 fixtures."""
    assert len(_PAPERS) == 13
    assert len({p["id"] for p in _PAPERS}) == 13  # IDs unique
