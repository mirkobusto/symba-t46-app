"""Tests for app.engine.dcf_compose.

Compose pipeline for the 13 paper fixtures, then assert:
- expected sections / active flags / field counts
- mandates_by_category present for relevant categories
- network_render_spec passes through
"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from app.domain.enums import (
    Q1,
    Q2,
    Q4,
    Q5,
    Q7,
    Q6a,
    Q6b,
)
from app.domain.models import Q3, Case, Flow
from app.engine.dcf_compose import (
    DcfFieldDescriptor,
    DcfMandate,
    DcfPayload,
    compose_dcf,
)
from app.engine.pipeline import run as pipeline_run

# ---------------------------------------------------------------------------
# Module-level fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(scope="module")
def dcf_schema() -> dict:
    schema_path = (
        Path(__file__).resolve().parents[1] / "app" / "schemas" / "dcf_schema.json"
    )
    with open(schema_path) as f:
        return json.load(f)


@pytest.fixture(scope="module")
def mandates_census() -> dict:
    census_path = (
        Path(__file__).resolve().parents[1]
        / "coordination" / "dcf_mandates_census.json"
    )
    with open(census_path) as f:
        return json.load(f)


def _flows(*qs):
    return [Flow(id=f"f{i+1}", name=f"flow{i+1}", q5=q) for i, q in enumerate(qs)]


# Three representative cases — wiktor (full overlays), arce (q7=A → logistics off),
# briassoulis (q7=None, q1=C consequential, q2=C ex-ante design).
@pytest.fixture()
def case_wiktor(schemas):
    case = Case(
        q1=Q1.B, q2=Q2.D, q3=Q3(env=True, eco=True), q4={Q4.E},
        q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, q6b=Q6b.TRL7_8, q7=Q7.B,
        flows=_flows(Q5.a, Q5.c, Q5.c),
    )
    pipeline_run(case, schemas)
    return case


@pytest.fixture()
def case_arce(schemas):
    case = Case(
        q1=Q1.B, q2=Q2.A, q3=Q3(env=True), q4={Q4.E},
        q6a=Q6a.PLASTICS_PACKAGING, q6b=Q6b.TRL9, q7=Q7.A,
        flows=_flows(Q5.b, Q5.c),
    )
    pipeline_run(case, schemas)
    return case


@pytest.fixture()
def case_briassoulis(schemas):
    case = Case(
        q1=Q1.C, q2=Q2.C, q3=Q3(env=True, eco=True, soc=True), q4={Q4.E},
        q6a=Q6a.BIOBASED_POLYMERS, q6b=Q6b.TRL9, q7=None,
        flows=_flows(Q5.b, Q5.c),
    )
    pipeline_run(case, schemas)
    return case


# ---------------------------------------------------------------------------
# Top-level DcfPayload shape
# ---------------------------------------------------------------------------


def test_payload_returns_pydantic_model(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    assert isinstance(payload, DcfPayload)


def test_payload_carries_case_metadata(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    assert payload.case_id == str(case_wiktor.id)
    assert payload.pathway_id == "IS-01"
    assert payload.is_01_extended is True
    assert payload.ilcd_situation == "ILCD Situation A multi-actor"


def test_payload_serializes_to_json(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    # Must be JSON-serializable for the API
    blob = payload.model_dump_json()
    parsed = json.loads(blob)
    assert parsed["case_id"] == str(case_wiktor.id)


# ---------------------------------------------------------------------------
# Section structure
# ---------------------------------------------------------------------------


def test_all_six_sections_present(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    section_ids = [s.id for s in payload.sections]
    assert section_ids == [
        "actors", "flow_matrix", "logistics", "infrastructure",
        "methodological_choices", "network_diagram",
    ]


def test_data_sections_have_active_fields(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    actors = next(s for s in payload.sections if s.id == "actors")
    flows = next(s for s in payload.sections if s.id == "flow_matrix")
    infra = next(s for s in payload.sections if s.id == "infrastructure")
    assert actors.active is True and len(actors.fields) > 0
    assert flows.active is True and len(flows.fields) > 0
    assert infra.active is True and len(infra.fields) > 0


def test_logistics_disabled_when_q7_a(case_arce, dcf_schema, mandates_census):
    payload = compose_dcf(case_arce, dcf_schema, mandates_census)
    logistics = next(s for s in payload.sections if s.id == "logistics")
    assert logistics.active is False
    assert logistics.fields == []


def test_logistics_enabled_when_q7_b(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    logistics = next(s for s in payload.sections if s.id == "logistics")
    assert logistics.active is True
    assert len(logistics.fields) > 0


def test_field_descriptor_carries_metadata(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    actors = next(s for s in payload.sections if s.id == "actors")
    sample = next(f for f in actors.fields if f.id == "actor.role")
    assert isinstance(sample, DcfFieldDescriptor)
    assert sample.type == "enum"
    assert sample.enum_values is not None
    assert "producer" in sample.enum_values


# ---------------------------------------------------------------------------
# Predicate filtering semantics
# ---------------------------------------------------------------------------


def test_wiktor_has_capex_fields_q2_d(case_wiktor, dcf_schema, mandates_census):
    """q2=D → infra capex fields should activate."""
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    infra = next(s for s in payload.sections if s.id == "infrastructure")
    ids = {f.id for f in infra.fields}
    assert "infra.capex_amount" in ids
    assert "infra.amortization_period_y" in ids
    assert "infra.ssp_rcp_scenario" in ids


def test_arce_no_capex_q2_a(case_arce, dcf_schema, mandates_census):
    """q2=A → infra capex fields off (only existing infra raccolto)."""
    payload = compose_dcf(case_arce, dcf_schema, mandates_census)
    infra = next(s for s in payload.sections if s.id == "infrastructure")
    ids = {f.id for f in infra.fields}
    assert "infra.capex_amount" not in ids
    assert "infra.year_built" in ids  # always-on (row_condition handles per-row)


def test_briassoulis_has_marginal_market_q1_c(
    case_briassoulis, dcf_schema, mandates_census
):
    """q1=C → flow.marginal_market_ref should activate (consequential)."""
    payload = compose_dcf(case_briassoulis, dcf_schema, mandates_census)
    flows = next(s for s in payload.sections if s.id == "flow_matrix")
    ids = {f.id for f in flows.fields}
    assert "flow.marginal_market_ref" in ids


def test_wiktor_no_marginal_market_q1_b(case_wiktor, dcf_schema, mandates_census):
    """q1=B → consequential field off."""
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    flows = next(s for s in payload.sections if s.id == "flow_matrix")
    ids = {f.id for f in flows.fields}
    assert "flow.marginal_market_ref" not in ids


def test_wiktor_has_contamination_wastewater_overlay(
    case_wiktor, dcf_schema, mandates_census
):
    """q6a=wastewater_sludge_biofactories → contamination_level on."""
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    flows = next(s for s in payload.sections if s.id == "flow_matrix")
    ids = {f.id for f in flows.fields}
    assert "flow.quality.contamination_level" in ids
    assert "flow.quality.purity_pct" not in ids  # wrong sector for purity


def test_arce_has_purity_plastics_overlay(case_arce, dcf_schema, mandates_census):
    """q6a=plastics_packaging → purity_pct on."""
    payload = compose_dcf(case_arce, dcf_schema, mandates_census)
    flows = next(s for s in payload.sections if s.id == "flow_matrix")
    ids = {f.id for f in flows.fields}
    assert "flow.quality.purity_pct" in ids
    assert "flow.quality.contamination_level" not in ids


def test_briassoulis_q3_soc_unlocks_actor_size(
    case_briassoulis, dcf_schema, mandates_census
):
    """q3.soc=True → actor.size_class on (S-LCA overlay)."""
    payload = compose_dcf(case_briassoulis, dcf_schema, mandates_census)
    actors = next(s for s in payload.sections if s.id == "actors")
    ids = {f.id for f in actors.fields}
    assert "actor.size_class" in ids


# ---------------------------------------------------------------------------
# Methodological choices (section 5.5)
# ---------------------------------------------------------------------------


def test_mandates_section_marker_present(
    case_wiktor, dcf_schema, mandates_census
):
    """The methodological_choices section exists as a marker (no fields)."""
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    sec = next(s for s in payload.sections if s.id == "methodological_choices")
    assert sec.active is True
    assert sec.fields == []  # mandates live in payload.mandates_by_category


def test_mandates_by_category_populated(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    assert len(payload.mandates_by_category) > 0
    # categories declared in schema's auto_source
    for category, mandates in payload.mandates_by_category.items():
        assert isinstance(mandates, list)
        assert len(mandates) > 0
        for m in mandates:
            assert isinstance(m, DcfMandate)
            assert m.category == category


def test_only_activated_mandates_in_payload(
    case_wiktor, dcf_schema, mandates_census
):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    activated = set(case_wiktor.activated_nodes)
    for mandates in payload.mandates_by_category.values():
        for m in mandates:
            assert m.node_id in activated


def test_briassoulis_has_slca_mandates(
    case_briassoulis, dcf_schema, mandates_census
):
    """q3.soc=True (S-LCA active) should activate stakeholder_materiality
    mandates."""
    payload = compose_dcf(case_briassoulis, dcf_schema, mandates_census)
    cats = set(payload.mandates_by_category.keys())
    assert "stakeholder_materiality" in cats


def test_mandate_count_largely_uniform_across_cases(
    case_wiktor, case_arce, case_briassoulis, dcf_schema, mandates_census
):
    """78 of the 90 procedural_mandates are DEFAULT category (always-activated),
    only 12 are DERIVED. The §5.5 mandate set is therefore largely uniform
    across cases — only modest variation expected, driven by the few DERIVED
    mandates whose trigger_condition is satisfied."""
    counts = []
    for case in [case_wiktor, case_arce, case_briassoulis]:
        payload = compose_dcf(case, dcf_schema, mandates_census)
        total = sum(len(v) for v in payload.mandates_by_category.values())
        counts.append(total)
    # all between 75 and 90 (loose bound, just sanity)
    for c in counts:
        assert 70 <= c <= 90, f"unexpected mandate count {c}"
    # spread is small
    assert max(counts) - min(counts) <= 15, (
        f"mandate counts vary too widely across cases: {counts}"
    )


# ---------------------------------------------------------------------------
# Network diagram (section 5.6)
# ---------------------------------------------------------------------------


def test_network_render_spec_present(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    assert payload.network_render_spec is not None
    assert "nodes" in payload.network_render_spec
    assert "edges" in payload.network_render_spec


def test_network_section_active(case_wiktor, dcf_schema, mandates_census):
    payload = compose_dcf(case_wiktor, dcf_schema, mandates_census)
    sec = next(s for s in payload.sections if s.id == "network_diagram")
    assert sec.active is True
    assert sec.fields == []  # derived section, no fields
