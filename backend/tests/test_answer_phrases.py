"""Answer-dependent phrases in node values (engine/answer_phrases.py, 2026-10-18):
the reference market (Q7b) and the concentration of the key interactions (Q7)."""
from __future__ import annotations

import json
import re

import pytest

from app.domain.enums import Q1, Q7, ReferenceMarketScope
from app.domain.models import Q3, Case
from app.engine.answer_phrases import PLACEHOLDERS, fill, reference_market
from app.engine.pipeline import run


def _run(**kw) -> Case:
    return run(Case(q1=Q1.A, q3=Q3(env=True), decision_context="micro", **kw))


def test_every_placeholder_in_the_schema_is_known(schemas):
    found = set(re.findall(r"\{([a-z_]+)\}", json.dumps([n["default_value"] for n in schemas.phase1_nodes])))
    assert found and found <= set(PLACEHOLDERS)


@pytest.mark.parametrize("region, scope, expected", [
    (None, None, "the market the counterfactual would draw on"),
    ("Italy", ReferenceMarketScope.NATIONAL, "the national market of Italy"),
    ("Tuscany", ReferenceMarketScope.SUB_NATIONAL, "the sub-national market of Tuscany"),
    ("Europe", ReferenceMarketScope.CONTINENTAL, "the continental market of Europe (only for globally traded"),
    ("Italy", None, "the market of Italy (typically national or sub-national"),
    (None, ReferenceMarketScope.NATIONAL, "the national market"),
])
def test_reference_market_phrase(region, scope, expected):
    phrase = reference_market(Case(reference_market_region=region, reference_market_scope=scope))
    assert phrase.startswith(expected)


def test_the_reference_market_reaches_background_and_reference_scenario():
    case = _run(reference_market_region="Italy", reference_market_scope=ReferenceMarketScope.NATIONAL)
    assert "matched to the national market of Italy" in case.lca["background_database"]
    assert "in the national market of Italy" in case.lca["reference_scenario.content"]


def test_no_placeholder_is_left_in_any_written_value():
    for q7 in (None, *Q7):
        case = _run(q7=q7)
        for pillar in (case.lca, case.lcc, case.slca, case.system):
            for value in pillar.values():
                assert not re.search(r"\{(" + "|".join(PLACEHOLDERS) + r")\}", str(value))


def test_fill_leaves_other_values_alone():
    case = Case()
    assert fill(25.0, case) == 25.0
    assert fill("no braces", case) == "no braces"
    assert fill("{unknown}", case) == "{unknown}"


def test_retired_q7_d_loads_as_c():
    assert Case(q7="D").q7 is Q7.C
