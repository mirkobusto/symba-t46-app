"""engine.scenario_diff: the nodes a scenario adds, removes or words differently
(UX round of 2026-11-08, P6-09)."""
from __future__ import annotations

from app.domain.models import Case
from app.engine.loader import load_schemas
from app.engine.pipeline import run
from app.engine.scenario_diff import node_changes, node_text

_BASE = {"q1": "B", "q2": "A", "q3": {"env": True, "eco": True, "soc": False},
         "decision_context": "micro", "policy_objective": False,
         "flows": [{"id": "f1", "name": "Slag", "q5": "a"}]}


def test_same_answers_change_nothing():
    schemas = load_schemas()
    a, b = run(Case(**_BASE), schemas), run(Case(**_BASE), schemas)
    assert node_changes(a, b, schemas) == {"added": [], "removed": [], "changed": []}


def test_a_method_switched_off_removes_its_nodes():
    schemas = load_schemas()
    a = run(Case(**_BASE), schemas)
    b = run(Case(**{**_BASE, "q3": {"env": True, "eco": False, "soc": False}}), schemas)
    out = node_changes(a, b, schemas)
    assert out["removed"] and all(n["text"] for n in out["removed"])
    assert any(n["id"].startswith("lcc_") for n in out["removed"])


def test_every_active_node_has_a_text():
    """Fielded nodes read the pillar, mandates their default or the selected
    branch (discriminative and per-flow ones included)."""
    schemas = load_schemas()
    case = run(Case(**{**_BASE, "q3": {"env": True, "eco": True, "soc": True}}), schemas)
    empty = [nid for nid in case.activated_nodes if not node_text(case, schemas.nodes_by_id[nid])]
    assert empty == []


def test_per_flow_values_are_named_by_flow():
    schemas = load_schemas()
    case = run(Case(**_BASE), schemas)
    texts = [node_text(case, schemas.nodes_by_id[nid]) for nid in case.activated_nodes
             if schemas.nodes_by_id[nid].get("per_flow")
             and schemas.nodes_by_id[nid].get("field_status") != "procedural_mandate"]
    assert texts and all(t.startswith("Slag: ") for t in texts)
