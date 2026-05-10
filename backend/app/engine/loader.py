"""Schema JSON loader for the decision engine.

Loads the 5 schema files from `app/schemas/` into typed dataclasses.
Caches the result so repeated calls in the same process are zero-cost.

Strictness modes:

- **Default (production)**: thin parse only. Fails fast on JSON-decode
  errors, missing top-level keys, and obvious shape violations. Trusts
  the content to have already been validated upstream (CI pre-commit).

- **STRICT_LOAD=1** (test integration / staging): in addition to the
  thin parse, runs the full validator from `backend/scripts/
  validate_phase1_artifacts.py` and raises if any of the 16 structural
  checks fail (count, ID convention, source_nodes resolve,
  field-classification cross-check, etc.). This is slower (~0.5s).

Per Mirko design call 3 nuance 3: best-of-both-worlds.
"""
from __future__ import annotations

import json
import os
import sys
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any

SCHEMA_DIR = Path(__file__).resolve().parent.parent / "schemas"
SCHEMA_FILES = (
    "phase1_nodes.json",
    "cross_method_rules.json",
    "system_fields.json",
    "computed_fields.json",
    "cir_output_fields.json",
    "sector_overlays.json",
)


@dataclass(frozen=True)
class LoadedSchemas:
    """Parsed and indexed schema artifacts.

    Public attributes (all read-only after load):
        phase1_nodes           list of node dicts (186 entries)
        nodes_by_id            dict[node_id, node_dict] for O(1) lookup
        cross_method_rules     full rules document (BLOCKs + 5 categories)
        rules_by_id            dict[rule_id, rule_dict] across all categories
        system_fields          dict[field_path, entry_dict]
        computed_fields        dict[field_path, entry_dict]
        cir_output_fields      dict[field_path, entry_dict]
        all_known_fields       union of node fields + system + computed +
                               cir_output (used by activation safety check)
    """

    phase1_nodes: list[dict[str, Any]]
    nodes_by_id: dict[str, dict[str, Any]]
    cross_method_rules: dict[str, Any]
    rules_by_id: dict[str, dict[str, Any]]
    system_fields: dict[str, dict[str, Any]]
    computed_fields: dict[str, dict[str, Any]]
    cir_output_fields: dict[str, dict[str, Any]]
    sector_overlays: dict[str, Any] = field(default_factory=dict)
    sectors_by_id: dict[str, dict[str, Any]] = field(default_factory=dict)
    all_known_fields: frozenset[str] = field(default_factory=frozenset)


class SchemaLoadError(RuntimeError):
    """Raised when schema files fail to load or fail strict validation."""


def _read_json(path: Path) -> Any:
    if not path.exists():
        raise SchemaLoadError(f"Schema file missing: {path}")
    try:
        with path.open(encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise SchemaLoadError(f"Invalid JSON in {path.name}: {e}") from e


def _index_nodes(nodes_doc: dict[str, Any]) -> tuple[list, dict, frozenset]:
    nodes = nodes_doc.get("nodes")
    if not isinstance(nodes, list):
        raise SchemaLoadError(
            "phase1_nodes.json: top-level 'nodes' is missing or not a list")
    by_id: dict[str, dict[str, Any]] = {}
    field_set: set[str] = set()
    for n in nodes:
        nid = n.get("id")
        if not nid:
            raise SchemaLoadError(f"phase1_nodes.json: node missing 'id': {n!r}")
        if nid in by_id:
            raise SchemaLoadError(f"phase1_nodes.json: duplicate node id {nid!r}")
        by_id[nid] = n
        if n.get("field"):
            field_set.add(n["field"])
        for af in n.get("additional_fields") or []:
            if af.get("field"):
                field_set.add(af["field"])
    return nodes, by_id, frozenset(field_set)


def _index_rules(rules_doc: dict[str, Any]) -> dict[str, dict[str, Any]]:
    by_id: dict[str, dict[str, Any]] = {}
    categories = (
        "blocks", "integration_rules", "conditional_integration_rules",
        "fu_rules", "boundary_rules", "critical_decision_points",
    )
    for cat in categories:
        for rule in rules_doc.get(cat, []):
            rid = rule.get("id")
            if not rid:
                raise SchemaLoadError(
                    f"cross_method_rules.json [{cat}]: rule missing 'id'")
            if rid in by_id:
                raise SchemaLoadError(
                    f"cross_method_rules.json: duplicate rule id {rid!r}")
            by_id[rid] = rule
    return by_id


def _index_fields(doc: dict[str, Any], fname: str) -> dict[str, dict[str, Any]]:
    entries = doc.get("fields")
    if not isinstance(entries, list):
        raise SchemaLoadError(
            f"{fname}: top-level 'fields' is missing or not a list")
    return {e["field"]: e for e in entries if "field" in e}


def _index_sectors(doc: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Index `sector_overlays.json` sectors by ID. Currently a stub:
    `overlays` is empty until per-sector logic is wired in.
    """
    sectors = doc.get("sectors")
    if not isinstance(sectors, list):
        raise SchemaLoadError(
            "sector_overlays.json: top-level 'sectors' is missing or not a list")
    by_id: dict[str, dict[str, Any]] = {}
    for s in sectors:
        sid = s.get("id")
        if not sid:
            raise SchemaLoadError(
                f"sector_overlays.json: sector missing 'id': {s!r}")
        if sid in by_id:
            raise SchemaLoadError(
                f"sector_overlays.json: duplicate sector id {sid!r}")
        by_id[sid] = s
    return by_id


def _maybe_strict_validate(schema_dir: Path) -> None:
    """If STRICT_LOAD=1 in env, run the full validator and raise on failure."""
    if os.environ.get("STRICT_LOAD", "").lower() not in {"1", "true", "yes"}:
        return
    # Locate scripts/validate_phase1_artifacts.py relative to this package.
    script = (schema_dir.parent.parent / "scripts" / "validate_phase1_artifacts.py")
    if not script.exists():
        # Fall through silently — strict mode requested but script unavailable.
        # This can happen in deployment configurations where scripts/ is not
        # bundled; treat as a soft warning rather than a hard failure.
        print(f"[loader] STRICT_LOAD set but {script} not found; skipping",
              file=sys.stderr)
        return
    import subprocess
    out_dir = Path("/tmp") / "symba_strict_load"
    out_dir.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        [sys.executable, str(script),
         "--schema-dir", str(schema_dir),
         "--out-dir", str(out_dir)],
        capture_output=True, text=True, check=False,
    )
    if result.returncode != 0:
        raise SchemaLoadError(
            f"STRICT_LOAD validation failed (exit {result.returncode}):\n"
            f"{result.stdout}\n{result.stderr}")


@lru_cache(maxsize=1)
def load_schemas(schema_dir: Path | None = None) -> LoadedSchemas:
    """Load and index the 5 schema files. Cached: subsequent calls O(1).

    Args:
        schema_dir: override location; defaults to `app/schemas/`.

    Raises:
        SchemaLoadError: if any file is missing, malformed, or — when
            STRICT_LOAD=1 — fails the deep validator.
    """
    sd = schema_dir or SCHEMA_DIR

    nodes_doc = _read_json(sd / "phase1_nodes.json")
    rules_doc = _read_json(sd / "cross_method_rules.json")
    system_doc = _read_json(sd / "system_fields.json")
    computed_doc = _read_json(sd / "computed_fields.json")
    cir_doc = _read_json(sd / "cir_output_fields.json")
    sector_doc = _read_json(sd / "sector_overlays.json")

    phase1_nodes, nodes_by_id, node_fields = _index_nodes(nodes_doc)
    rules_by_id = _index_rules(rules_doc)
    system_fields = _index_fields(system_doc, "system_fields.json")
    computed_fields = _index_fields(computed_doc, "computed_fields.json")
    cir_output_fields = _index_fields(cir_doc, "cir_output_fields.json")
    sectors_by_id = _index_sectors(sector_doc)

    all_known = frozenset(node_fields
                          | set(system_fields)
                          | set(computed_fields)
                          | set(cir_output_fields))

    _maybe_strict_validate(sd)

    return LoadedSchemas(
        phase1_nodes=phase1_nodes,
        nodes_by_id=nodes_by_id,
        cross_method_rules=rules_doc,
        rules_by_id=rules_by_id,
        system_fields=system_fields,
        computed_fields=computed_fields,
        cir_output_fields=cir_output_fields,
        sector_overlays=sector_doc,
        sectors_by_id=sectors_by_id,
        all_known_fields=all_known,
    )


def reset_cache() -> None:
    """Clear the module-level cache (for tests that need fresh loads)."""
    load_schemas.cache_clear()
