"""Tests for scripts/generate_validation_reports.py — Sprint 4 Step 5.

Smoke tests that exercise the report generator end-to-end into a tmp
directory: each of the 13 fixtures produces a non-empty .docx whose
internal structure includes the canonical Section 1-8 headings.
"""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

# Make scripts/ importable so the test can call main()
SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

# python-docx is an optional dep at the dev level; skip the whole module
# if it isn't available (e.g. in a stripped-down CI image).
docx = pytest.importorskip("docx")

from generate_validation_reports import PAPERS, main  # noqa: E402


def test_generates_one_docx_per_paper(tmp_path: Path):
    written = main(out_dir=tmp_path)
    assert len(written) == len(PAPERS)
    assert len(written) == 13
    # Every file exists and has non-zero size
    for p in written:
        assert p.exists()
        assert p.stat().st_size > 1000  # docx zip overhead alone exceeds this
    # Filenames follow T46_VR_<short_ref>.docx
    names = {p.name for p in written}
    expected = {f"T46_VR_{paper['short_ref']}.docx" for paper in PAPERS}
    assert names == expected


def test_first_report_has_canonical_section_headings(tmp_path: Path):
    """Verify Section 1-8 headings exist in the first generated report."""
    written = main(out_dir=tmp_path)
    doc = docx.Document(str(written[0]))
    paragraph_texts = [p.text for p in doc.paragraphs]
    # Canonical section headings (per WorkingDoc §6)
    expected_starts = (
        "1. Bibliographic",
        "2. Case study",
        "3. Methodological configuration adopted",
        "4. Compilation of the seven",
        "5. Methodological configuration derived",
        "6. Comparison",
        "7. Validation verdict",
        "8. Appendix",
    )
    for prefix in expected_starts:
        assert any(t.startswith(prefix) for t in paragraph_texts), (
            f"Missing section heading starting with {prefix!r} in "
            f"{written[0].name}; have: {[t for t in paragraph_texts if t]}"
        )


def test_kerdlap_verdict_documents_is_04_divergence(tmp_path: Path):
    """The Kerdlap report's Section 5 records IS-04 (matches engine,
    not the WorkingDoc §3.3 mapping table)."""
    written = main(out_dir=tmp_path)
    kerdlap = next(p for p in written if "Kerdlap" in p.name)
    doc = docx.Document(str(kerdlap))
    full_text = "\n".join(p.text for p in doc.paragraphs)
    assert "IS-04" in full_text


def test_paulu_q4_multiselect_reflected(tmp_path: Path):
    """Paulu has Q4=D+E (multi-select); both letters appear in
    Section 4."""
    written = main(out_dir=tmp_path)
    paulu = next(p for p in written if "Paulu" in p.name)
    doc = docx.Document(str(paulu))
    full_text = "\n".join(p.text for p in doc.paragraphs)
    # The Q4 line should list both D and E (sorted)
    assert "D, E" in full_text


def _docx_text(case) -> str:
    from io import BytesIO

    from docx import Document

    from app.engine.pipeline import run
    from app.services.reports import generate_case_report_bytes

    run(case)
    return "\n".join(p.text for p in Document(BytesIO(generate_case_report_bytes(case))).paragraphs)


def test_report_lists_q8_q9_q10_and_the_notes_only_when_answered():
    from app.domain.enums import Q1, Q2, DecisionContext
    from app.domain.models import Q3, Case

    base = dict(q1=Q1.E, q2=Q2.A, q3=Q3(env=True, eco=True))
    plain = _docx_text(Case(**base))
    assert "Q8 asset lifetime" not in plain and "Q9 decision" not in plain
    assert "Q10 public policy" not in plain and "Notes on the answers" not in plain

    answered = _docx_text(Case(**base, asset_lifetime_years=20, decision_context=DecisionContext.STRUCTURAL,
                               policy_objective=True))
    assert "Q8 asset lifetime (years): 20" in answered
    assert "Q9 decision and scale: structural" in answered
    assert "Q10 public policy / planning objective: yes" in answered
    assert "Notes on the answers" in answered       # Q1=E with a structural decision is noted
    assert "ILCD Situation B" in answered
