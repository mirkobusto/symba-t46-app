"""The DCF reads statements, triggers and section numbers of the procedural
mandates from coordination/dcf_mandates_census.json, not from the schema. This
keeps the census in step with phase1_nodes.json: if a procedural_mandate node
changes, `scripts/sync_dcf_census.py --apply` has to be run."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

_SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "sync_dcf_census.py"
_spec = importlib.util.spec_from_file_location("sync_dcf_census", _SCRIPT)
script = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(script)


def test_census_is_in_step_with_the_procedural_mandate_nodes(schemas):
    census = json.loads(script.CENSUS.read_text(encoding="utf-8"))
    _, changes = script.sync(census, schemas.phase1_nodes, {})
    assert not changes, ("census out of date; run scripts/sync_dcf_census.py --apply:\n  "
                         + "\n  ".join(changes))


def test_census_total_matches_the_nodes(schemas):
    census = json.loads(script.CENSUS.read_text(encoding="utf-8"))
    procedural = [n for n in schemas.phase1_nodes
                  if n.get("field_status") == "procedural_mandate" and n.get("lifecycle_layer") != "L0"]
    assert census["meta"]["total_procedural_mandates"] == len(procedural)
    assert sum(len(v) for v in census["buckets"].values()) == len(procedural)


def test_sync_adds_a_new_mandate_only_with_an_explicit_bucket(schemas):
    import pytest
    census = json.loads(script.CENSUS.read_text(encoding="utf-8"))
    nodes = [dict(n) for n in schemas.phase1_nodes]
    victim = next(n for n in nodes if n["id"] == "lca_hc_07")
    victim["id"] = "lca_hc_07_copy"   # a mandate the census has never seen
    nodes.append(dict(victim))
    with pytest.raises(SystemExit, match="--assign"):
        script.sync(census, nodes, {})
    _, changes = script.sync(census, nodes, {"lca_hc_07_copy": "allocation_substitution"})
    assert "add lca_hc_07_copy to allocation_substitution" in changes


def test_sync_does_not_modify_its_input(schemas):
    census = json.loads(script.CENSUS.read_text(encoding="utf-8"))
    before = json.dumps(census)
    nodes = [dict(n) for n in schemas.phase1_nodes if n["id"] != "lca_hc_07"]   # forces a "drop"
    _, changes = script.sync(census, nodes, {})
    assert any("drop lca_hc_07" in c for c in changes)
    assert json.dumps(census) == before
