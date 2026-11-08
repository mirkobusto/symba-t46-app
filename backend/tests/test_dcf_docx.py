"""Tests for app.services.dcf_docx."""
from __future__ import annotations

import json
from io import BytesIO
from pathlib import Path

import pytest
from docx import Document

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.dcf_compose import compose_dcf
from app.engine.pipeline import run as pipeline_run
from app.services.dcf_docx import EU_FOOTER, generate_dcf_docx_bytes


@pytest.fixture(scope="module")
def dcf_schema() -> dict:
    p = (
        Path(__file__).resolve().parents[1] / "app" / "schemas" / "dcf_schema.json"
    )
    with open(p) as f:
        return json.load(f)


@pytest.fixture(scope="module")
def mandates_census() -> dict:
    p = (
        Path(__file__).resolve().parents[1]
        / "coordination" / "dcf_mandates_census.json"
    )
    with open(p) as f:
        return json.load(f)


def _flows(*qs):
    return [Flow(id=f"f{i+1}", name=f"flow{i+1}", q5=q) for i, q in enumerate(qs)]


@pytest.fixture()
def payload_wiktor(schemas, dcf_schema, mandates_census):
    case = Case(
        q1=Q1.B, q2=Q2.B, q3=Q3(env=True, eco=True), q4={Q4.E},
        q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, q6b=Q6b.TRL7_8, q7=Q7.B,
        flows=_flows(Q5.a, Q5.c, Q5.c),
    )
    pipeline_run(case, schemas)
    return compose_dcf(case, dcf_schema, mandates_census)


def test_returns_bytes(payload_wiktor):
    blob = generate_dcf_docx_bytes(payload_wiktor)
    assert isinstance(blob, bytes)
    assert len(blob) > 2500


def test_docx_parses_back(payload_wiktor):
    blob = generate_dcf_docx_bytes(payload_wiktor)
    doc = Document(BytesIO(blob))
    # at least a few paragraphs
    assert len(doc.paragraphs) > 5


def test_docx_contains_title(payload_wiktor):
    blob = generate_dcf_docx_bytes(payload_wiktor)
    doc = Document(BytesIO(blob))
    text = "\n".join(p.text for p in doc.paragraphs)
    assert "Data Collection File" in text or "SYMBA T4.6" in text


def test_docx_cover_names_the_ilcd_situation_not_a_pathway(payload_wiktor):
    blob = generate_dcf_docx_bytes(payload_wiktor)
    doc = Document(BytesIO(blob))
    all_text = "\n".join(p.text for p in doc.paragraphs)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                all_text += "\n" + cell.text
    assert "ILCD Situation A" in all_text
    assert "IS-01" not in all_text and "Pathway" not in all_text


def test_docx_contains_eu_footer(payload_wiktor):
    blob = generate_dcf_docx_bytes(payload_wiktor)
    doc = Document(BytesIO(blob))
    text = "\n".join(p.text for p in doc.paragraphs)
    assert "101135562" in text
    assert "www.symbaproject.eu" in text or "Horizon" in text


def test_docx_points_to_the_checklist_instead_of_repeating_it(payload_wiktor):
    """The 60-120 rows were repeated in the case report, this annex and the
    workbook: the workbook's sheet is the one full list (B7, P8-06)."""
    doc = Document(BytesIO(generate_dcf_docx_bytes(payload_wiktor)))
    assert not any("Origin" in " ".join(c.text for c in t.rows[0].cells) for t in doc.tables)
    text = "\n".join(p.text for p in doc.paragraphs)
    total = len(payload_wiktor.obligations) + len(payload_wiktor.decision_points) + len(payload_wiktor.sector_rules)
    assert f"({total} items" in text and "“Methodological Choices”" in text


def test_docx_is_a4_with_page_numbers_and_ends_with_the_project_data(payload_wiktor):
    """P8-08, P8-07, P8-01: A4, "page X of Y", the project data and the
    acknowledgement at the end, a title and an author in the properties."""
    doc = Document(BytesIO(generate_dcf_docx_bytes(payload_wiktor, "Wiktor", lang="it")))
    section = doc.sections[0]
    assert abs(section.page_width.mm - 210) < 1 and abs(section.page_height.mm - 297) < 1
    assert "NUMPAGES" in section.footer._element.xml and "Wiktor" in section.footer.paragraphs[0].text
    headings = [p.text for p in doc.paragraphs if p.style.name.startswith("Heading")]
    assert headings[-2:] == ["Dati del progetto", "Ringraziamenti e avvertenza"]
    text = "\n".join(p.text for p in doc.paragraphs)
    assert "Questo progetto ha ricevuto finanziamenti" in text and "This Project has received" not in text
    assert doc.core_properties.title.endswith("Wiktor") and doc.core_properties.author == "SYMBA T4.6"


def test_eu_footer_text_constants():
    assert "101135562" in EU_FOOTER
    assert "www.symbaproject.eu" in EU_FOOTER


def test_docx_disclaimer_names_the_executive_agency_like_the_website():
    from app.services.dcf_docx import EU_DISCLAIMER

    assert "European Research Executive Agency" in EU_DISCLAIMER
    assert EU_DISCLAIMER.startswith("Funded by the European Union.")
