"""D4.1 Part 2 sector rules (phase A, step 5, 2026-10-15).

The rules live in schemas/sector_overlays.json, one entry per Part 2 chapter;
engine/sector_rules lists those of the chapters a case touches.
"""
from __future__ import annotations

import io
import json

import pytest
from docx import Document

from app.domain.enums import Q1, Q2, Q5, DecisionContext, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.l0_compute import PART2_CHAPTER
from app.engine.loader import SchemaLoadError, _check_overlays
from app.engine.pipeline import run
from app.services.reports import generate_case_report_bytes


def _case(**kw) -> Case:
    base = dict(q1=Q1.A, q2=Q2.A, q3=Q3(env=True, eco=True), q6a=Q6a.OTHER, q6b=Q6b.TRL9)
    base.update(kw)
    return run(Case(**base))


def _ids(case: Case) -> set[str]:
    return {r["id"] for r in case.sector_rules}


def test_no_part2_chapter_no_rules():
    assert _case().sector_rules == []
    assert _case(flows=[Flow(id="f1", name="Heat", q5=Q5.c)]).sector_rules == []


def _food(**kw) -> Case:
    """A case whose flow is in the agri-food chapter (§4)."""
    grain = Flow(id="g", name="Spent grain", q5=Q5.b, sector=Q6a.FOOD_PRODUCTION)
    return _case(flows=[grain], **kw)


def test_the_case_sector_alone_activates_nothing_but_a_note():
    """Since 2026-10-18 Q6a describes the case; the chapters follow the flows."""
    case = _case(q6a=Q6a.FOOD_PRODUCTION)
    assert case.sector_rules == []
    note = next(w for w in case.warnings if w["code"] == "case_sector_without_flow")
    assert note["params"] == {"chapter": "§4"}
    flowed = _food(q6a=Q6a.FOOD_PRODUCTION)
    assert {r["chapter_key"] for r in flowed.sector_rules} == {"agrifood"}
    assert flowed.sector_rules[0]["activated_by"] == [{"kind": "flow", "name": "Spent grain"}]
    assert {"strength", "statement", "source", "lines", "note"} <= set(flowed.sector_rules[0])
    assert "case_sector_without_flow" not in {w["code"] for w in flowed.warnings}


def test_a_flow_activates_its_chapter_whatever_the_case_sector():
    """The chapters follow what is exchanged, not the industry of the company."""
    sludge = Flow(id="s", name="Sewage sludge", q5=Q5.a, sector=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES)
    case = _case(q6a=Q6a.CEMENT_CONSTRUCTION, flows=[sludge])
    assert {r["chapter_key"] for r in case.sector_rules} == {"wastewater"}
    assert case.sector_rules[0]["activated_by"] == [{"kind": "flow", "name": "Sewage sludge"}]
    both = _case(q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, flows=[sludge])
    assert both.sector_rules[0]["activated_by"] == [{"kind": "flow", "name": "Sewage sludge"}]


def test_substitution_rules_follow_part1_in_situation_c2():
    """Part 1 L00868: strict accounting of one partner uses allocation, no credits."""
    network = _food()
    report = _food(decision_context=DecisionContext.CORPORATE_REPORT)
    assert "p2_agrifood_06" in _ids(network)
    assert "p2_agrifood_06" not in _ids(report)


@pytest.mark.parametrize("sector,rules", [
    (Q6a.PLASTICS_PACKAGING, {"p2_plastics_06", "p2_plastics_08"}),
    (Q6a.TEXTILE_LEATHER, {"p2_textiles_05"}),
    (Q6a.WASTE_VALORIZATION, {"p2_waste_valorisation_04", "p2_waste_valorisation_06"}),
])
def test_quality_factor_cff_and_reference_rules_are_not_listed_in_situation_c2(sector, rules):
    """The quality factor and the CFF belong to substitution, and the reference scenario gives
    no credit, in strict accounting of one partner (Part 1 §7.2.3; review of 2026-10-19)."""
    flow = [Flow(id="f", name="Residual", q5=Q5.b, sector=sector)]
    assert rules <= _ids(_case(flows=flow))
    assert not rules & _ids(_case(flows=flow, decision_context=DecisionContext.CORPORATE_REPORT))


def test_the_waste_reference_rule_says_which_scenario_part1_asks():
    flow = [Flow(id="f", name="Residual", q5=Q5.a, sector=Q6a.WASTE_VALORIZATION)]
    rule = next(r for r in _case(flows=flow).sector_rules if r["id"] == "p2_waste_valorisation_04")
    assert "HNSRS when the exchanges already take place" in rule["note"]


def test_background_rules_framed_on_situation_a_are_not_shown_for_situation_b():
    """Part 1 L01293: Situation B uses long-run marginal technologies."""
    structural = _food(decision_context=DecisionContext.STRUCTURAL,
                       market_screening_documented=True)
    assert structural.ilcd_situation.value == "ILCD Situation B"
    assert "p2_agrifood_05" not in _ids(structural)
    assert "p2_agrifood_05" in _ids(_food())


def test_scale_up_rules_only_below_trl_7():
    """Lab or pilot data = below TRL 7 (Part 1 L01100)."""
    assert {"p2_agrifood_09", "p2_agrifood_10"} <= _ids(_food(q6b=Q6b.TRL5_6))
    assert not {"p2_agrifood_09", "p2_agrifood_10"} & _ids(_food())


def test_overlays_match_the_chapter_map_of_the_flow_notes(schemas):
    """l0_compute.PART2_CHAPTER (the flow note of #118) and the overlays agree."""
    overlays = schemas.sector_overlays["overlays"]
    from_overlays = {sector: o["chapter"] for o in overlays.values() for sector in o["q6a"]}
    assert from_overlays == {k.value: v for k, v in PART2_CHAPTER.items()}


def test_every_rule_cites_part2_lines(schemas):
    for chapter in schemas.sector_overlays["overlays"].values():
        for rule in chapter["rules"]:
            assert rule["source"].startswith("D4.1 Part 2 §")
            assert rule["lines"].startswith("L0")
            assert rule["verbatim"]


@pytest.mark.parametrize("mutate, message", [
    (lambda o: o["agrifood"]["rules"][0].update(when_key="q99=Z"), "branch key"),
    (lambda o: o["agrifood"]["rules"].append(dict(o["agrifood"]["rules"][0])), "duplicate rule id"),
    (lambda o: o["agrifood"]["q6a"].append("no_such_sector"), "unknown sector"),
    (lambda o: o["agrifood"]["rules"][0].update(strength="maybe"), "strength"),
])
def test_loader_rejects_malformed_overlays(schemas, mutate, message):
    doc = json.loads(json.dumps(schemas.sector_overlays))
    mutate(doc["overlays"])
    with pytest.raises(SchemaLoadError, match=message):
        _check_overlays(doc, {s["id"] for s in doc["sectors"]})


def test_report_lists_the_sector_rules():
    case = _food()
    text = "\n".join(p.text for p in Document(io.BytesIO(generate_case_report_bytes(case))).paragraphs)
    assert "Sector rules (D4.1 Part 2)" in text
    assert "§4 Agri-Food and Biorefineries — applies because of: flow Spent grain" in text


# --- PR 3: typical configuration per flow (§4.1-§8.1) ---------------------


def test_a_configuration_names_the_substituted_product():
    digestate = Flow(id="d", name="Digestate", q5=Q5.b, sector=Q6a.AGRICULTURE_AGRIFOOD_BIOREFINERIES,
                     configuration="agrifood_ad_bioenergy_fertiliser")
    case = _case(flows=[digestate])
    first = case.sector_rules[0]
    assert first["group"] == "configuration" and first["lines"] == "L00381"
    assert "mineral NPK fertilisers" in first["statement"] and first["note"] is None


def test_a_configuration_activates_its_chapter_without_a_declared_sector():
    srf = Flow(id="s", name="SRF", q5=Q5.c, configuration="wv_srf_coprocessing")
    assert {r["chapter_key"] for r in _case(flows=[srf]).sector_rules} == {"waste_valorisation"}


def test_situation_c2_says_the_substitution_is_not_credited():
    bagasse = Flow(id="b", name="Bagasse", q5=Q5.c, configuration="agrifood_platform_chemicals")
    case = _case(flows=[bagasse], decision_context=DecisionContext.CORPORATE_REPORT)
    assert case.sector_rules[0]["note"].startswith("Situation C2: no substitution credit")


def test_configuration_notes_for_another_chapter_or_an_unknown_id():
    other = Flow(id="o", name="Sludge", q5=Q5.a, sector=Q6a.TEXTILE_LEATHER,
                 configuration="wastewater_sludge_pyrolysis")
    case = _case(flows=[other])
    assert "flow_configuration_other_chapter" in {w["code"] for w in case.warnings}
    assert {r["chapter_key"] for r in case.sector_rules} == {"wastewater", "textiles"}
    unknown = _case(flows=[Flow(id="u", name="X", q5=Q5.a, configuration="no_such_configuration")])
    assert "flow_configuration_unknown" in {w["code"] for w in unknown.warnings}


def test_frontend_configuration_map_matches_the_overlays(schemas):
    """frontend/src/presets/part2Configurations.ts mirrors the overlays (the frontend
    cannot read backend files: its Docker build compiles only frontend/)."""
    import re
    from pathlib import Path
    ts = (Path(__file__).resolve().parents[2] / "frontend/src/presets/part2Configurations.ts").read_text()
    overlays = schemas.sector_overlays["overlays"]
    for key, chapter in overlays.items():
        block = re.search(rf"  {key}: \[(.*?)\],", ts, re.S).group(1)
        assert re.findall(r"'([a-z0-9_]+)'", block) == [c["id"] for c in chapter["configurations"]]
        for sector in chapter["q6a"]:
            assert f"  {sector}: '{key}'," in ts
