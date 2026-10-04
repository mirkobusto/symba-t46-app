"""Tests for scripts/rerun_saved_cases.py (re-run the engine on saved cases)."""
from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.domain.enums import Q1, Q2, Q4
from app.domain.models import Q3, Case
from app.engine import pipeline
from app.models import CaseRecord

_SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "rerun_saved_cases.py"
_spec = importlib.util.spec_from_file_location("rerun_saved_cases", _SCRIPT)
script = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(script)


def _stale_case_json() -> str:
    """A case saved by an older engine: stale allocation value and a key the
    engine no longer writes."""
    case = Case(q1=Q1.D, q2=Q2.A, q3=Q3(env=True), q4={Q4.A})
    pipeline.run(case)
    case.lca["allocation_method"] = "substitution"   # what the old engine stored
    case.lca["removed_in_new_engine"] = "stale"
    return case.model_dump_json()


def test_rerun_replaces_stale_outputs_and_drops_removed_keys():
    fresh = script.rerun(_stale_case_json())
    assert fresh.lca["allocation_method"] == "allocation"   # Q1=D, not Q4=D
    assert "removed_in_new_engine" not in fresh.lca
    assert fresh.q1 == Q1.D and fresh.q4 == {Q4.A}


def test_rerun_keeps_the_case_identity():
    stored = Case.model_validate_json(_stale_case_json())
    assert script.rerun(stored.model_dump_json()).id == stored.id


@pytest.fixture()
def db_url(tmp_path, monkeypatch):
    url = f"sqlite:///{tmp_path / 'app.db'}"
    eng = create_engine(url, future=True)
    Base.metadata.create_all(eng)
    with sessionmaker(bind=eng, future=True)() as s:
        s.add(CaseRecord(id="c1", name="stale", case_json=_stale_case_json(), pathway_id="IS-03"))
        s.commit()
    monkeypatch.setenv("SYMBA_DB_URL", url)
    return url


def _stored(url: str) -> CaseRecord:
    with sessionmaker(bind=create_engine(url, future=True), future=True)() as s:
        rec = s.get(CaseRecord, "c1")
        s.expunge(rec)
        return rec


def test_dry_run_writes_nothing(db_url):
    before = _stored(db_url).case_json
    assert script.main([]) == 0
    assert _stored(db_url).case_json == before


def test_apply_writes_the_fresh_result(db_url):
    assert script.main(["--apply"]) == 0
    stored = Case.model_validate_json(_stored(db_url).case_json)
    assert stored.lca["allocation_method"] == "allocation"
    assert "removed_in_new_engine" not in stored.lca
    assert script.main(["--apply"]) == 0   # idempotent: a second run changes nothing
    assert _stored(db_url).case_json == stored.model_dump_json()
