"""report_terms.json is a copy of the app's translations the .docx case report
needs (the backend image does not ship the frontend sources). It must match
the locales: after changing them, run scripts/sync_report_terms.py."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "scripts"))

import sync_report_terms  # noqa: E402


def test_report_terms_match_the_frontend_locales():
    stored = json.loads((ROOT / "backend/app/data/report_terms.json").read_text(encoding="utf-8"))
    assert stored == sync_report_terms.extract(), (
        "report_terms.json is stale: run `PYTHONPATH=. python scripts/sync_report_terms.py` in backend/"
    )
