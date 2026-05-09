"""Tests for engine.l3_report.run — Sprint 4 Step 3 commit 6.

Covers IR-04 / IR-10 L3 assertions, the 12-CDP surfacing with
"all-methods-active" filter (option α), missing-data inconclusive
policy, and the mutation contract.
"""
from __future__ import annotations

import pytest

from app.domain.enums import Q1, Q2, Q4
from app.domain.models import Q3, Case
from app.engine.l3_report import _METHOD_TO_Q3, run

# ---------------------------------------------------------------------------
# 1. IR-04 — Parallel Interpretation (no single_score when Q3 ≥2 dims)
# ---------------------------------------------------------------------------


def test_ir04_no_fire_when_q3_single_dim(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True))
    case.report["aggregation_method"] = "single_score"  # would violate if fired
    run(case, schemas)
    assert all(v["rule_id"] != "IR-04" for v in case.rule_violations)


def test_ir04_violates_when_single_score_with_multi_dim(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True, eco=True))
    case.report["aggregation_method"] = "single_score"
    run(case, schemas)
    assert any(v["rule_id"] == "IR-04" for v in case.rule_violations)


def test_ir04_passes_with_multi_dim_no_aggregation_set(schemas):
    """Missing aggregation_method = inconclusive (no violation)."""
    case = Case(q1=Q1.A, q3=Q3(env=True, eco=True))
    run(case, schemas)
    assert all(v["rule_id"] != "IR-04" for v in case.rule_violations)


def test_ir04_passes_with_non_single_score(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True, eco=True))
    case.report["aggregation_method"] = "parallel"
    run(case, schemas)
    assert all(v["rule_id"] != "IR-04" for v in case.rule_violations)


# ---------------------------------------------------------------------------
# 2. IR-10 — Anti-Aggregation (no public aggregation when Q4 in B/C/D)
# ---------------------------------------------------------------------------


def test_ir10_no_fire_when_q4_internal_only(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True), q4={Q4.A})  # internal only
    case.report["public_disclosure.aggregation"] = "weighted_sum"
    run(case, schemas)
    assert all(v["rule_id"] != "IR-10" for v in case.rule_violations)


def test_ir10_violates_when_public_aggregation_with_q4_C(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True), q4={Q4.C})
    case.report["public_disclosure.aggregation"] = "weighted_sum"
    run(case, schemas)
    assert any(v["rule_id"] == "IR-10" for v in case.rule_violations)


def test_ir10_passes_when_q4_external_but_no_aggregation(schemas):
    """Default state: no aggregation set → assertion holds (= None)."""
    case = Case(q1=Q1.A, q3=Q3(env=True), q4={Q4.B})
    run(case, schemas)
    assert all(v["rule_id"] != "IR-10" for v in case.rule_violations)


def test_ir10_violates_for_q4_D_too(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True), q4={Q4.D})
    case.report["public_disclosure.aggregation"] = "single_score"
    run(case, schemas)
    assert any(v["rule_id"] == "IR-10" for v in case.rule_violations)


# ---------------------------------------------------------------------------
# 3. CDP surfacing — option α: all listed methods must be active
# ---------------------------------------------------------------------------


def test_cdp_no_surfacing_when_q3_single_dim(schemas):
    """All 12 CDPs require ≥2 methods; a single-dim case surfaces none."""
    case = Case(q1=Q1.A, q3=Q3(env=True))
    run(case, schemas)
    assert case.cdp_flags == []


def test_cdp_surfaces_for_lca_lcc_case(schemas):
    """Q3 ENV+ECO → CDPs whose methods are exactly {LCA, LCC} surface."""
    case = Case(q1=Q1.A, q3=Q3(env=True, eco=True))
    run(case, schemas)
    # At least one LCA+LCC CDP must surface (CDP-01 'Displaced Products')
    surfaced_ids = {f["cdp_id"] for f in case.cdp_flags}
    assert "CDP-01" in surfaced_ids
    # And every surfaced CDP's methods are subset of {LCA, LCC}
    for entry in case.cdp_flags:
        for m in entry["methods"]:
            attr = _METHOD_TO_Q3.get(m)
            if attr is None:
                continue
            assert getattr(case.q3, attr) is True, (
                f"CDP {entry['cdp_id']} surfaced but method {m} inactive")


def test_cdp_surfaces_all_relevant_for_tri_method(schemas):
    """Tri-method case (env+eco+soc) surfaces CDPs from all combinations."""
    case = Case(q1=Q1.A, q3=Q3(env=True, eco=True, soc=True))
    run(case, schemas)
    assert len(case.cdp_flags) > 0
    surfaced_methods = {m for f in case.cdp_flags for m in f["methods"]}
    # Should include at least one CDP touching each method family
    for known in ("LCA", "LCC"):
        assert known in surfaced_methods


def test_cdp_filter_excludes_lcc_only_when_eco_off(schemas):
    """A CDP requiring LCC must NOT surface when Q3.eco is False."""
    case = Case(q1=Q1.A, q3=Q3(env=True, soc=True))  # no eco
    run(case, schemas)
    for entry in case.cdp_flags:
        if "LCC" in entry["methods"]:
            pytest.fail(
                f"{entry['cdp_id']} surfaced with LCC method but eco is off")


def test_cdp_entry_shape(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True, eco=True))
    run(case, schemas)
    assert len(case.cdp_flags) > 0
    entry = case.cdp_flags[0]
    assert set(entry.keys()) == {
        "cdp_id", "name", "tension", "severity", "methods", "resolution_at_l3"
    }
    assert isinstance(entry["methods"], list)
    assert entry["severity"] in {"HIGH", "MEDIUM", "LOW"}


# ---------------------------------------------------------------------------
# 4. Defensive Q1=None
# ---------------------------------------------------------------------------


def test_q1_none_raises(schemas):
    case = Case(q3=Q3(env=True))
    with pytest.raises(ValueError, match="Invalid Q1"):
        run(case, schemas)


# ---------------------------------------------------------------------------
# 5. Mutation contract
# ---------------------------------------------------------------------------


def test_run_mutates_and_returns_same_instance(schemas):
    case = Case(q1=Q1.A, q3=Q3(env=True))
    result = run(case, schemas)
    assert result is case


# ---------------------------------------------------------------------------
# 6. End-to-end pipeline now completes (the headline test of commit 6)
# ---------------------------------------------------------------------------


def test_full_pipeline_runs_without_raising(schemas):
    """All 6 phases real after commit 6 — pipeline.run no longer raises
    NotImplementedError on a valid case."""
    from app.engine.pipeline import run as pipeline_run
    case = Case(q1=Q1.A, q2=Q2.A, q3=Q3(env=True, eco=True))
    result = pipeline_run(case, schemas)
    assert result is case
    assert case.ilcd_situation is not None
    assert case.lcc_type is not None
    assert case.pathway_id is not None
    assert len(case.activated_nodes) > 0
    # CDPs should surface for env+eco
    assert len(case.cdp_flags) > 0
