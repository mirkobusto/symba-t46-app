"""One-shot: re-run the engine on every saved case and store the fresh result.

A case is stored AFTER the pipeline ran (case_json holds the engine's output)
and the app shows that stored output as is, so a change to the engine or to the
schemas does not reach a saved case until it is run again. Run this once after
deploying an engine change that moves outputs (for instance the branch-key fix
and the allocation_method fix, which change values on existing cases).

The case is rebuilt from its INPUTS only (every Case field the engine does not
write: the questions, flows, sites, scenarios, advanced overrides, id, study phase) and run on a fresh object, so a pillar key
that the new engine no longer writes does not survive from the old run.

Dry run by default; nothing is written without --apply. Cases that fail to
validate or to run are reported and left untouched.

Usage:
    cd backend && PYTHONPATH=. python scripts/rerun_saved_cases.py            # report only
    cd backend && PYTHONPATH=. python scripts/rerun_saved_cases.py --apply    # write
    # custom DB:  SYMBA_DB_URL="sqlite:///data/app.db" PYTHONPATH=. python scripts/rerun_saved_cases.py
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

# Make `app.*` importable when run from backend/
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app.domain.models import Case  # noqa: E402
from app.engine import pipeline  # noqa: E402
from app.models import CaseRecord  # noqa: E402

# What the engine writes. Every other Case field is something the user supplied,
# so a question added to Case later (Q8 asset_lifetime_years, ...) is carried over
# by default instead of being silently reset to None by a stale input list.
_OUTPUT_FIELDS = frozenset({
    "ilcd_situation", "lcc_type", "slca_activation_state", "pathway_id", "is_01_extended",
    "lca", "lcc", "slca", "report", "governance", "methodological_charter", "review", "system",
    "activated_nodes", "blocked_by", "rule_violations", "applicable_rules", "cdp_flags", "warnings",
})
_INPUT_FIELDS = tuple(f for f in Case.model_fields if f not in _OUTPUT_FIELDS)


def rerun(stored_json: str) -> Case:
    """Fresh run of the stored case's inputs."""
    stored = Case.model_validate_json(stored_json)
    inputs = {name: getattr(stored, name) for name in _INPUT_FIELDS}
    fresh = Case(**inputs)
    return pipeline.run(fresh)


def main(argv: list[str]) -> int:
    apply = "--apply" in argv
    url = os.environ.get("SYMBA_DB_URL", "sqlite:///data/app.db")
    print(f"→ database: {url}   mode: {'APPLY' if apply else 'dry run (use --apply to write)'}")
    session = sessionmaker(bind=create_engine(url, future=True), future=True)()
    changed = unchanged = failed = 0
    try:
        for rec in session.query(CaseRecord).all():
            try:
                case = rerun(rec.case_json)
            except Exception as e:  # noqa: BLE001 - report and keep going
                failed += 1
                print(f"  ✗ {rec.id} {rec.name!r}: {type(e).__name__}: {e}")
                continue
            new_json = case.model_dump_json()
            if new_json == rec.case_json:
                unchanged += 1
                continue
            changed += 1
            print(f"  ~ {rec.id} {rec.name!r}")
            if apply:
                rec.case_json = new_json
                rec.pathway_id = case.pathway_id.value if case.pathway_id else None
        if apply:
            session.commit()
    finally:
        session.close()
    print(f"done: {changed} changed, {unchanged} unchanged, {failed} failed"
          + ("" if apply else "  (nothing written)"))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
