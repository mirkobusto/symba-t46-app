"""The Data Collection File in the reader's language (UX round 2026-11-02):
the page, the network editor, the Excel and the Word document were in
English inside an Italian app, with developer notes and raw predicates."""
from __future__ import annotations

import json
import re
from io import BytesIO
from pathlib import Path

import pytest
from openpyxl import load_workbook

from app.domain.dcf_data import DcfData, DcfRow
from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.dcf_compose import compose_dcf
from app.engine.pipeline import run as pipeline_run
from app.services.dcf_excel import render_xlsx
from app.services.dcf_terms import LANGUAGES, _terms, language, localize

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = json.loads((ROOT / "backend/app/schemas/dcf_schema.json").read_text())
CENSUS = json.loads((ROOT / "backend/coordination/dcf_mandates_census.json").read_text())


@pytest.fixture()
def payload(schemas):
    case = Case(q1=Q1.B, q2=Q2.B, q3=Q3(env=True, eco=True), q4={Q4.E},
                q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, q6b=Q6b.TRL7_8, q7=Q7.B,
                flows=[Flow(id="f1", name="sludge", q5=Q5.a)])
    pipeline_run(case, schemas)
    return compose_dcf(case, SCHEMA, CENSUS)


def test_every_language_covers_the_schema():
    fields = {f["id"] for s in SCHEMA["sections"] for f in s.get("fields", [])}
    enums = {e for s in SCHEMA["sections"] for f in s.get("fields", []) for e in f.get("enum_values") or []}
    preds = ({f["activation_predicate"] for s in SCHEMA["sections"] for f in s.get("fields", [])}
             | {s["applies_when"] for s in SCHEMA["sections"]}) - {"always"}
    sections = {s["id"] for s in SCHEMA["sections"]}
    for lang in LANGUAGES:
        t = _terms()[lang]
        assert sections <= set(t["sections"]), lang
        assert fields <= set(t["fields"]), lang
        assert enums - {e for e in enums if e.startswith("SSP")} <= set(t["enums"]), lang
        assert preds <= set(t["reasons"]), lang
        assert set(t["ui"]) == set(_terms()["en"]["ui"]), lang


def test_no_developer_notes_reach_the_reader():
    for lang in LANGUAGES:
        t = _terms()[lang]
        # what a reader sees: the predicates themselves are only lookup keys
        shown = json.dumps([t["sections"], t["fields"], t["enums"], list(t["reasons"].values()), t["ui"]],
                           ensure_ascii=False)
        for phrase in ("first-class concept", "Case model", "Flow model", "q3.eco", "lcc_type in", "React Flow"):
            assert phrase not in shown, (lang, phrase)


def test_the_questionnaire_vocabularies_match_the_app_locale():
    """Q6a and Q5 labels are copied from the app's locales; keep them equal."""
    for lang in LANGUAGES:
        ts = (ROOT / f"frontend/src/i18n/locales/{lang}.ts").read_text()
        refs = _terms()[lang]["enum_refs"]
        # Q5: the guided questionnaire's wording, after the letter; "a waste" /
        # "a product" left to the classification (UX round 5, D5)
        start = ts.index("    plainOptions: {")
        block = ts[start:ts.index("\n    },", start)].replace("\\'", "'")
        for value, label in refs["Q5"].items():
            prefix, _, body = label.partition(". ")
            assert prefix == value, (lang, value)
            assert re.search(rf"\n      {value}: '{re.escape(body)}", block) or \
                re.search(rf"\n      {value}: '{re.escape(body[0].lower() + body[1:])}", block), (lang, value, body)
        assert refs["Q6a"]["steel_metals"] in ts


def test_language_codes():
    assert language("it-IT") == "it" and language("pt") == "en" and language(None) == "en"


def test_localize_fills_the_reader_fields_and_keeps_the_schema_text(payload):
    it = localize(payload, "it")
    actors = next(s for s in it.sections if s.id == "actors")
    assert actors.title == "Attori" and actors.title_en == "Actors"
    role = next(f for f in actors.fields if f.id == "actor.role")
    assert role.label == "Ruolo" and role.enum_labels["producer"] == "produttore"
    size = next(f for f in actors.fields if f.id == "actor.public_private")
    # no "(Q3)": the companies never saw the questionnaire (UX round 5)
    assert size.reason == "lo studio ha la dimensione economica o quella sociale"


def test_the_italian_workbook_reads_in_italian_with_names_not_ids(payload):
    data = DcfData(case_id="c", rows_by_section={
        "actors": [DcfRow(row_id="a1", values={"actor.name": "Depuratore Alfa", "actor.role": "producer"}),
                   DcfRow(row_id="a2", values={"actor.name": "Biogas Beta", "actor.role": "consumer"})],
        "flow_matrix": [DcfRow(row_id="f1", values={"flow.name": "fanghi", "flow.origin_actor_id": "a1",
                                                     "flow.dest_actor_id": "a2", "flow.type": "waste"})],
    })
    wb = load_workbook(BytesIO(render_xlsx(localize(payload, "it"), data, "Caso", lang="it")))
    assert wb.sheetnames[:4] == ["Copertina", "Istruzioni", "Diagramma della rete", "Attori"]
    actors = wb["Attori"]
    assert actors["A1"].value == "Attori"
    values = {c.value for row in actors.iter_rows(min_row=5, max_row=6) for c in row}
    # retired roles read as "partner", flagged for a check (UX round 6, P2-02)
    assert "partner" in values and "produttore" not in values
    flows = wb["Matrice dei flussi"]
    row = [c.value for c in flows[5]]
    assert "Depuratore Alfa" in row and "Biogas Beta" in row and "materiale" in row and "rifiuto" not in row
    assert "a1" not in row and "F1" in row
    assert any("_lists" in dv.formula1 for dv in flows.data_validations.dataValidation)


def test_the_reference_scenario_sheet_asks_what_each_actor_would_do(payload):
    """PR 8 (owner-approved schema change, 2026-11-03): the DCF asks the data the
    substitution and the reference scenario need, which no sheet asked before."""
    wb = load_workbook(BytesIO(render_xlsx(localize(payload, "it"), lang="it")))
    ref = wb["Scenario di riferimento"]
    headers = [c.value for c in ref[4]]
    # one row per actor and per flow it gives or receives (UX round 5, D6)
    assert headers[:4] == ["Attore *", "Flusso", "Lato del flusso",
                           "Che cosa fa, o farebbe, questo attore senza questo flusso *"]
    classif = [c.value for c in wb["Classificazione flussi"][4]]
    assert "Prodotto o processo che il flusso sostituisce" in classif
    assert "Fattore di qualità Q (0-1)" in classif
