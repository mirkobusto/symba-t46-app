"""Smoke tests — Sprint 4 Step 2.

Verifies that the 5 schema JSON files are present, parseable, and indexed
correctly by the loader. NO logical tests of engine behavior — those
arrive in Sprint 4 Step 3 as each phase module is implemented.
"""
from __future__ import annotations

import json

import pytest

from app.engine.loader import (
    SCHEMA_FILES,
    LoadedSchemas,
    SchemaLoadError,
    load_schemas,
    reset_cache,
)


def test_all_5_json_files_exist(schemas_dir):
    for fname in SCHEMA_FILES:
        path = schemas_dir / fname
        assert path.exists(), f"missing schema file: {path}"
        assert path.stat().st_size > 0, f"empty schema file: {path}"


def test_all_5_json_files_parse(schemas_dir):
    for fname in SCHEMA_FILES:
        with (schemas_dir / fname).open(encoding="utf-8") as f:
            doc = json.load(f)
        assert isinstance(doc, dict), f"{fname}: top-level must be an object"


def test_loader_returns_loaded_schemas(schemas: LoadedSchemas):
    assert isinstance(schemas, LoadedSchemas)


def test_loader_indexes_186_phase1_nodes(schemas: LoadedSchemas):
    assert len(schemas.phase1_nodes) == 186
    assert len(schemas.nodes_by_id) == 186


def test_loader_indexes_58_cross_method_rules(schemas: LoadedSchemas):
    # 4 BLOCK + 20 IR + 10 CIR + 5 FU + 7 B + 12 CDP = 58
    assert len(schemas.rules_by_id) == 58


def test_loader_indexes_field_allowlists(schemas: LoadedSchemas):
    # Counts per field_gaps.md round-2-final closure log
    assert len(schemas.system_fields) == 16        # 15 + methodological_charter.signed
    assert len(schemas.computed_fields) == 12      # 10 + 2 derived amortized
    assert len(schemas.cir_output_fields) == 20    # 19 + case.iterative_update_triggers


def test_all_known_fields_is_union(schemas: LoadedSchemas):
    assert isinstance(schemas.all_known_fields, frozenset)
    # Sanity: must contain a representative from each source
    assert "lca.functional_unit" in schemas.all_known_fields              # node
    assert "governance.facilitator" in schemas.all_known_fields           # system
    assert "lca.calculation_order" in schemas.all_known_fields            # computed
    assert "lca.background_futurisation" in schemas.all_known_fields     # cir_output


def test_loader_is_cached(schemas: LoadedSchemas):
    """Repeated calls return the same object (cache hit)."""
    again = load_schemas()
    assert again is schemas


def test_reset_cache_returns_fresh_object(schemas: LoadedSchemas):
    reset_cache()
    fresh = load_schemas()
    assert fresh is not schemas
    assert fresh.nodes_by_id.keys() == schemas.nodes_by_id.keys()


def test_load_raises_on_missing_directory(tmp_path):
    reset_cache()
    with pytest.raises(SchemaLoadError, match="missing"):
        load_schemas(schema_dir=tmp_path)


def test_pipeline_orchestrator_exists():
    """The pipeline module is importable and exposes run()."""
    from app.engine import pipeline
    assert callable(pipeline.run)


def test_pipeline_runs_end_to_end(schemas):
    """All 6 phases (l0/l1/pathway/activate/l2/l3) implemented after
    Sprint 4 Step 3 commits 1-6. Pipeline.run on a minimal valid case
    completes without raising and populates derived state."""
    from app.domain.enums import Q1, Q2
    from app.domain.models import Q3, Case
    from app.engine.pipeline import run as run_pipeline

    case = Case(q1=Q1.A, q2=Q2.A, q3=Q3(env=True))
    result = run_pipeline(case, schemas)
    assert result is case
    assert case.ilcd_situation is not None
    assert case.pathway_id is not None
    assert len(case.activated_nodes) > 0


def test_pathway_module_exists():
    """The pathway module is separated from activate (Step 2 sub-issue 3)."""
    from app.engine import pathway
    assert callable(pathway.derive)
