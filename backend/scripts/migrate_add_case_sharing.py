"""One-shot SQLite migration — add case_records.shared_at, prepared_by,
case_contact (UX round 2026-11-03, sharing decided by Fable).

The public report answers only for shared cases (shared_at set). Existing rows
are NOT backfilled: every case starts unshared and its owner shares it from
the Share dialog. Idempotent: a column already present is skipped.

Usage:
    cd backend && PYTHONPATH=. python scripts/migrate_add_case_sharing.py
    # the database is read from DATABASE_URL / SYMBA_DB_URL, as the app does
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine, inspect, text  # noqa: E402

COLUMNS = {
    "shared_at": "DATETIME",
    "prepared_by": "VARCHAR(120)",
    "case_contact": "VARCHAR(200)",
}


def main() -> None:
    url = os.environ.get("DATABASE_URL") or os.environ.get("SYMBA_DB_URL") or "sqlite:///data/app.db"
    print(f"→ database: {url}")
    eng = create_engine(url, future=True)
    insp = inspect(eng)
    if "case_records" not in insp.get_table_names():
        print("  · no case_records table yet: the app creates it with the new columns")
        return
    existing = {c["name"] for c in insp.get_columns("case_records")}
    for name, sql_type in COLUMNS.items():
        if name in existing:
            print(f"  · column case_records.{name} already present")
            continue
        print(f"  · adding column case_records.{name} …")
        with eng.begin() as conn:
            conn.execute(text(f"ALTER TABLE case_records ADD COLUMN {name} {sql_type}"))
    print("done: existing cases stay unshared until their owner shares them")


if __name__ == "__main__":
    main()
