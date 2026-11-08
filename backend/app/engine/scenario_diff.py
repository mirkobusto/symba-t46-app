"""Which methodological nodes a scenario adds, removes or changes against the case.

The scenario comparison showed only the count of activated nodes ("177 → 174"),
which told a reviewer nothing about which practice went away (UX round of
2026-11-08, P6-09). This module names them: for each node, the text it carries
on the run, in English as traced on the deliverables, with its section. Nothing
is decided here: it reads two pipeline results and the node schema.

- A fielded node's text is the value the engine wrote in its pillar (per-flow
  values are listed by flow name).
- A procedural mandate has no field: its text is its default value, or, for a
  discriminative mandate, the branch the run's answers select.
"""
from __future__ import annotations

from typing import Any

from app.domain.models import Case
from app.engine import answer_phrases
from app.engine.branch_keys import Answers, pick_branch
from app.engine.loader import LoadedSchemas

_PILLARS = {"lca", "lcc", "slca", "report", "governance", "methodological_charter", "review", "system"}


def _field_value(case: Case, field: str) -> Any:
    prefix, tail = field.split(".", 1)
    if prefix == "study":
        return case.system.get(field)
    if prefix not in _PILLARS:
        return None
    return getattr(case, prefix).get(tail)


def _as_text(case: Case, value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, dict):
        names = {f.id: f.name or f.id for f in case.flows}
        return "; ".join(f"{names.get(k, k)}: {_as_text(case, v)}" for k, v in value.items())
    if isinstance(value, (list, tuple, set)):
        return "; ".join(_as_text(case, v) for v in value)
    return str(value)


def node_text(case: Case, node: dict[str, Any]) -> str:
    """The text `node` carries on `case`, a pipeline result."""
    field = node.get("field")
    if field and node.get("field_status") != "procedural_mandate":
        value = _field_value(case, field)
        if value is not None:
            return _as_text(case, value)
    default = node.get("default_value")
    if isinstance(default, dict):
        if node.get("per_flow"):
            values = {}
            for flow in case.flows:
                matched, value = pick_branch(default, Answers.from_case(case, flow))
                if matched:
                    values[flow.id] = answer_phrases.fill(value, case)
            return _as_text(case, values)
        matched, value = pick_branch(default, Answers.from_case(case))
        return _as_text(case, answer_phrases.fill(value, case)) if matched else ""
    return _as_text(case, answer_phrases.fill(default, case))


def _entry(case: Case, node: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": node["id"],
        "method": node.get("method"),
        "source_section": node.get("source_section"),
        "text": node_text(case, node),
    }


def node_changes(baseline: Case, scenario: Case, schemas: LoadedSchemas) -> dict[str, list[dict[str, Any]]]:
    """Nodes active only in the scenario (`added`), only in the case
    (`removed`), and active in both with a different text (`changed`, with
    the case's text as `before`). Both arguments are pipeline results."""
    before, after = set(baseline.activated_nodes), set(scenario.activated_nodes)
    nodes = schemas.nodes_by_id
    order = [n["id"] for n in schemas.phase1_nodes]
    added = [_entry(scenario, nodes[i]) for i in order if i in after and i not in before]
    removed = [_entry(baseline, nodes[i]) for i in order if i in before and i not in after]
    changed = []
    for i in order:
        if i in before and i in after:
            was, now = node_text(baseline, nodes[i]), node_text(scenario, nodes[i])
            if was != now:
                changed.append({**_entry(scenario, nodes[i]), "before": was})
    return {"added": added, "removed": removed, "changed": changed}
