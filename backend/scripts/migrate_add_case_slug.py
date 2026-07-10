"""One-shot SQLite migration — add case_records.slug + backfill.

Run on any live database created before Phase 8 (the ORM model was
extended but Base.metadata.create_all does NOT alter existing tables).
Idempotent: safe to re-run; if the column or index already exists,
the script skips that step.

Usage:
    cd backend && PYTHONPATH=. python scripts/migrate_add_case_slug.py
    # or with a custom DB path:
    SYMBA_DB_URL="sqlite:///data/app.db" \\
        PYTHONPATH=. python scripts/migrate_add_case_slug.py
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

# Make `app.*` importable when run from backend/
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine, inspect, text  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app.domain.models import Case  # noqa: E402
from app.models import CaseRecord  # noqa: E402
from app.services.naming import assign_unique_slug  # noqa: E402


def _default_db_url() -> str:
    # Match app.db.default_url() behaviour without importing get_engine
    # (which would try to create tables against a possibly-stale schema).
    return os.environ.get("SYMBA_DB_URL", "sqlite:///data/app.db")


def main() -> None:
    url = _default_db_url()
    print(f"→ database: {url}")
    eng = create_engine(url, future=True)
    insp = inspect(eng)

    existing_cols = {c["name"] for c in insp.get_columns("case_records")}
    if "slug" not in existing_cols:
        print("  · adding column case_records.slug …")
        with eng.begin() as conn:
            conn.execute(text(
                "ALTER TABLE case_records ADD COLUMN slug VARCHAR(96)"
            ))
    else:
        print("  · column case_records.slug already present")

    # Best-effort unique index; SQLite requires a separate statement.
    idx_names = {i["name"] for i in insp.get_indexes("case_records")}
    if "ix_case_records_slug" not in idx_names:
        print("  · creating UNIQUE INDEX ix_case_records_slug …")
        with eng.begin() as conn:
            conn.execute(text(
                "CREATE UNIQUE INDEX ix_case_records_slug "
                "ON case_records(slug) WHERE slug IS NOT NULL"
            ))
    else:
        print("  · index ix_case_records_slug already present")

    # Backfill: assign a slug to every row that currently has NULL.
    Session = sessionmaker(bind=eng, autoflush=False, future=True)
    session = Session()
    try:
        pending = session.query(CaseRecord).filter(CaseRecord.slug.is_(None)).all()
        print(f"  · backfilling {len(pending)} row(s) …")
        for rec in pending:
            try:
                case = Case.model_validate_json(rec.case_json)
            except Exception:
                # corrupted row; skip but keep migrating others
                continue
            rec.slug = assign_unique_slug(session, case, rec.id)
        session.commit()
    finally:
        session.close()

    print("✓ migration done")


if __name__ == "__main__":
    main()
