"""One-shot, idempotent migration for the removal of the IS-01..IS-05 pathways
(2026-10-18): the pathways were a T4.6 construct the deliverables do not know;
the configuration now leads with the ILCD situation.

- case_records.pathway_id is renamed to ilcd_situation and filled from each
  saved case's JSON;
- the retired keys `pathway_id` and `is_01_extended` are removed from the saved
  case JSON (the Case model also drops them on load, so this is tidiness);
- the legacy tables of the old session flow (sessions, answers,
  pathway_resolutions), registered but never used by an endpoint, are dropped.

Dry run unless --apply. Run after the deploy, like migrate_add_case_slug.py:

    cd backend && PYTHONPATH=. python scripts/migrate_remove_pathway.py [--apply]
"""
from __future__ import annotations

import json
import sqlite3
import sys

from app.db import get_engine

LEGACY_TABLES = ("pathway_resolutions", "answers", "sessions")


def _db_path() -> str:
    url = str(get_engine().url)
    if not url.startswith("sqlite:///"):
        raise SystemExit(f"only SQLite is supported, got {url}")
    return url.removeprefix("sqlite:///")


def main(apply: bool) -> None:
    con = sqlite3.connect(_db_path())
    cur = con.cursor()
    tables = {r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    cols = {r[1] for r in cur.execute("PRAGMA table_info(case_records)")} if "case_records" in tables else set()
    plan = []
    if "pathway_id" in cols and "ilcd_situation" not in cols:
        plan.append("rename case_records.pathway_id -> ilcd_situation")
    rows = cur.execute("SELECT id, case_json FROM case_records").fetchall() if "case_records" in tables else []
    to_clean = []
    for rid, blob in rows:
        data = json.loads(blob or "{}")
        if "pathway_id" in data or "is_01_extended" in data or "ilcd_situation" in data:
            to_clean.append((rid, data))
    plan.append(f"clean the JSON of {sum(1 for _, d in to_clean if 'pathway_id' in d or 'is_01_extended' in d)} "
                f"case(s) and fill ilcd_situation for {len(to_clean)}")
    plan += [f"drop legacy table {t}" for t in LEGACY_TABLES if t in tables]
    print("\n".join(plan))
    if not apply:
        print("(dry run: nothing written; use --apply)")
        return
    if "pathway_id" in cols and "ilcd_situation" not in cols:
        cur.execute("ALTER TABLE case_records RENAME COLUMN pathway_id TO ilcd_situation")
    for rid, data in to_clean:
        situation = data.get("ilcd_situation")
        data.pop("pathway_id", None)
        data.pop("is_01_extended", None)
        cur.execute("UPDATE case_records SET case_json = ?, ilcd_situation = ? WHERE id = ?",
                    (json.dumps(data), situation, rid))
    for t in LEGACY_TABLES:
        if t in tables:
            cur.execute(f"DROP TABLE {t}")
    con.commit()
    print("applied")


if __name__ == "__main__":
    main("--apply" in sys.argv)
