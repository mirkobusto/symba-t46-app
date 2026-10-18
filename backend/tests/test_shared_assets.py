"""Q12 — new dedicated shared assets (2026-10-18). D4.2 §4.2 (L00567): their
CAPEX and OPEX go in the cost breakdown, allocated among the benefiting
partners; D4.1 §6.3.3: capital goods unique to the IS scenario are included.
The answer wires IR-13, B-06 and CIR-08, which read an attribute the case never
had (I-17)."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from app.domain.enums import Q1
from app.domain.models import Q3, Case
from app.engine.dcf_compose import compose_dcf
from app.engine.pipeline import run


def _run(**kw) -> Case:
    base = dict(q1=Q1.B, q3=Q3(env=True, eco=True), decision_context="micro", policy_objective=False)
    base.update(kw)
    return run(Case(**base))


def _rules(case: Case) -> set[str]:
    return {r["rule_id"] for r in case.applicable_rules}


def test_shared_assets_put_capex_and_opex_in_the_cost_breakdown():
    case = _run(dedicated_shared_assets=True)
    assert case.lcc["capital_goods.included"].startswith("The new dedicated shared assets")
    assert "allocated among the benefiting partners" in case.lcc["capital_goods.included"]
    assert "the new dedicated shared assets of this symbiosis" in case.lca["capital_goods.included"]
    for answer in (False, None):
        other = _run(dedicated_shared_assets=answer)
        assert other.lcc["capital_goods.included"].startswith("Capital goods included unless")
        assert "{shared_assets}" not in other.lca["capital_goods.included"]
        assert "dedicated shared assets" not in other.lca["capital_goods.included"]


def test_the_three_capital_goods_rules_now_fire_and_are_not_violations():
    case = _run(dedicated_shared_assets=True)
    assert {"IR-13", "B-06"} <= _rules(case)
    assert not {"IR-13", "B-06"} & {v["rule_id"] for v in case.rule_violations}
    assert not {"IR-13", "B-06", "CIR-08"} & _rules(_run(dedicated_shared_assets=False))
    # CIR-08 writes S-LCA indicators: only with the social dimension
    assert "CIR-08" not in _rules(case)
    assert "CIR-08" in _rules(_run(dedicated_shared_assets=True, q3=Q3(env=True, eco=True, soc=True)))


def test_q12_is_shown_in_the_obligations_and_the_report():
    from io import BytesIO

    from docx import Document

    from app.services.narrative import answers_in
    from app.services.reports import generate_case_report_bytes
    case = _run(dedicated_shared_assets=True)
    assert answers_in("Q3.ENV+ECO AND new dedicated shared assets (Q12)", case) == [
        ("Q3", "env + eco"), ("Q12", "yes")]
    text = "\n".join(p.text for p in Document(BytesIO(generate_case_report_bytes(case))).paragraphs)
    assert "Q12 new dedicated shared assets: yes" in text


@pytest.mark.parametrize("raw, expected", [(True, True), ("true", True), ("false", False), (0, False)])
def test_the_inert_advanced_key_becomes_q12(raw, expected):
    migrated = Case(advanced={"is_specific_capital_goods": raw, "asset_lifetime": 20})
    assert migrated.dedicated_shared_assets is expected
    assert migrated.advanced == {"asset_lifetime": 20}     # once: the key leaves `advanced`
    assert Case(dedicated_shared_assets=False, advanced={"is_specific_capital_goods": True}) \
        .dedicated_shared_assets is False


def test_infrastructure_ownership_is_asked_unless_no_shared_asset():
    root = Path(__file__).resolve().parents[1]
    dcf_schema = json.loads((root / "app/schemas/dcf_schema.json").read_text())
    mandates_census = json.loads((root / "coordination/dcf_mandates_census.json").read_text())

    def fields(answer):
        case = _run(dedicated_shared_assets=answer)
        return {f.id for s in compose_dcf(case, dcf_schema, mandates_census).sections for f in s.fields}
    assert "infra.ownership" in fields(True)
    assert "infra.ownership" in fields(None)
    assert "infra.ownership" not in fields(False)
