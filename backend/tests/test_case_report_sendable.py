"""The case report can be sent as it is (UX round 2026-11-08, theme B).

Eight testers found the Word report impossible to attach to an e-mail: no case
name, date or author, "python-docx" and 2013 in the properties, US Letter
pages without numbers, field paths and flow ids in the body, the sector rules
in English, an expert register in guided mode, and decision-point texts about
answers the case did not give.
"""
from __future__ import annotations

import re
from io import BytesIO

import pytest
from docx import Document
from fastapi.testclient import TestClient

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, DecisionContext, Q6a, Q6b
from app.domain.models import Q3, AlternativeScenario, Case, Flow
from app.engine.pipeline import run
from app.services.reports import generate_case_report_bytes

META = {"case_name": "Valle del Formaggio", "case_ref": "agri-b-sita-a839e04a", "prepared_by": "Giulia Rinaldi",
        "contact": "giulia@example.org", "generated_on": "8 novembre 2026", "saved_on": "7 novembre 2026",
        "state": "saved"}


@pytest.fixture()
def dairy() -> Case:
    return run(Case(
        q1=Q1.B, q2=Q2.A, q3=Q3(env=True, eco=True, soc=True), q4={Q4.B},
        q6a=Q6a.AGRICULTURE_AGRIFOOD_BIOREFINERIES, q6b=Q6b.TRL9, q7=Q7.B,
        decision_context=DecisionContext.MICRO, policy_objective=False, dedicated_shared_assets=True,
        flows=[Flow(id="fmw7pwkwe", name="Cheese whey", q5=Q5.a, sector=Q6a.AGRICULTURE_AGRIFOOD_BIOREFINERIES),
               Flow(id="fmw7pyuaq", name="Digestate", q5=Q5.b)],
        alternative_scenarios=[AlternativeScenario(id="sc1", label="Digestate sold as fertiliser",
                                                   overrides={"flow_q5": {"fmw7pyuaq": "c"}})],
    ))


def _doc(case: Case, lang: str = "en", **kw) -> Document:
    return Document(BytesIO(generate_case_report_bytes(case, lang=lang, **kw)))


def _text(doc: Document) -> str:
    """Paragraphs and table cells in document order."""
    from docx.table import Table
    from docx.text.paragraph import Paragraph
    out = []
    for child in doc.element.body.iterchildren():
        tag = child.tag.split("}")[1]
        if tag == "p":
            out.append(Paragraph(child, doc).text)
        elif tag == "tbl":
            out.extend(c.text for row in Table(child, doc).rows for c in row.cells)
    return "\n".join(out)


def _body(text: str, appendix: str = "Appendix: technical detail for the analyst") -> str:
    return text[:text.index(appendix)]


def test_the_cover_says_which_case_who_and_when(dairy):
    doc = _doc(dairy, "it", meta=META)
    text = _text(doc)
    assert doc.paragraphs[0].text == "Report del caso: Valle del Formaggio"
    for expected in ("Preparato da\nGiulia Rinaldi", "Contatto\ngiulia@example.org", "Generato il\n8 novembre 2026",
                     "Riferimento del caso\nagri-b-sita-a839e04a", "come salvate (7 novembre 2026)",
                     "non è una certificazione"):
        assert expected in text
    # the funding acknowledgement, in the reader's language (P8-09)
    assert "Finanziato dall'Unione Europea" in text
    assert "This Project has received funding" not in text


def test_the_file_is_a4_numbered_and_has_real_properties(dairy):
    doc = _doc(dairy, meta=META)
    section = doc.sections[0]
    assert (round(section.page_width.mm), round(section.page_height.mm)) == (210, 297)
    footer = section.footer.paragraphs[0]._p.xml
    assert 'w:instr="PAGE"' in footer and 'w:instr="NUMPAGES"' in footer
    assert "Valle del Formaggio" in section.footer.paragraphs[0].text
    props = doc.core_properties
    assert props.title == "Case report: Valle del Formaggio"
    assert props.author == "Giulia Rinaldi" and "python-docx" not in (props.comments or "")
    assert props.created.year >= 2026
    # the obligations table repeats its header row on every page
    assert any("w:tblHeader" in t._tbl.xml for t in doc.tables)


def test_no_internal_codes_before_the_appendix(dairy):
    text = _text(_doc(dairy, meta=META))
    body = _body(text)
    for leak in ("lca.functional_unit", "lcc.functional_equivalent", "blind_spots", "study.phase", "Q3 = ",
                 "Q12 = ", "flow_q5", "fmw7pwkwe", "fmw7pyuaq", "[C+E]", "[deactivated]", "[must]", "[should]"):
        assert leak not in body, leak
    # the field paths are kept for the analyst, at the end
    assert "lca.functional_unit" in text[text.index("Appendix: technical detail"):]


def test_obligations_are_grouped_with_the_answers_in_words(dairy):
    text = _text(_doc(dairy))
    assert "on integrating the methods" in text and "on boundaries" in text
    assert "Shared Functional Unit (IR-01)" in text
    assert "Q12 dedicated shared assets: yes" in text
    assert "Data Collection File lists them again" in text


def test_scenarios_say_what_they_change_in_words(dairy):
    sent = [{"id": "sc1", "config": ["Horizon: present → future"], "network": ["Actor “Farm B” is added."]}]
    text = _text(_doc(dairy, scenarios=sent))
    scenario = text[text.index("Digestate sold as fertiliser"):]
    assert "Who pays whom for “Digestate”: b." in scenario
    assert "Horizon: present → future" in scenario and "Actor “Farm B” is added." in scenario
    assert text.index("Alternative scenarios") < text.index("Appendix: technical detail")


def test_scenario_overrides_of_any_kind_are_worded_as_answers(dairy):
    """Booleans and nulls in the overrides (Q2b, Q7b, Q9b) read as answers in
    words, never as key names or "None" (note from the scenario PR, #244)."""
    dairy.alternative_scenarios = [AlternativeScenario(id="sc2", label="Long-standing", overrides={
        "network_long_standing": True, "reference_market_scope": None, "reference_market_region": "Italy"})]
    text = _text(_doc(dairy))
    scenario = text[text.index("Long-standing"):text.index("Acknowledgements")]
    assert "Q2b long-standing network: (not answered) → yes" in scenario
    assert "Q7b reference market: (not answered) → Italy" in scenario
    for leak in ("network_long_standing", "reference_market", "None"):
        assert leak not in scenario


def test_decision_points_drop_the_branch_that_does_not_apply(dairy):
    text = _text(_doc(dairy))
    # a case in Situation A, without Q4 = D and with a present-day background
    assert "in Situation B the LCA substitutes" not in text
    assert "Same reference scenario and same quality factor Q in the LCA and in the LCC" in text
    assert "Under EU policy alignment (Q4 = D)" not in text
    assert "the point matters only if the study adopts a future one" in text


def test_situation_b_keeps_its_branch():
    case = run(Case(q1=Q1.B, q2=Q2.A, q3=Q3(env=True, eco=True), q4={Q4.D},
                    decision_context=DecisionContext.STRUCTURAL, market_screening_documented=True,
                    flows=[Flow(id="f1", name="heat", q5=Q5.c)]))
    text = _text(_doc(case))
    if "CDP-01" in text:
        assert "in Situation B the LCA substitutes" in text
    if "CDP-08" in text:
        assert "Under EU policy alignment (Q4 = D)" in text


def test_the_guided_register_is_kept(dairy):
    text = _text(_doc(dairy, "fr", guided=True))
    assert "Un échange local, évalué avec des données moyennes" in text
    assert "Ce que cela signifie pour vous" in text
    body = _body(text, "Annexe : détail technique")
    assert not re.search(r"\nQ\d+[a-c]? ", body)        # no Q-codes in front of the questions
    # the deliverable's own words (English) move to the appendix
    assert "Apply Attributional Modeling" not in body
    assert "Apply Attributional Modeling" in text


def test_the_verdict_sentence_is_not_repeated(dairy):
    from app.services.reports import _t
    text = _text(_doc(dairy))
    short = _t("en", f"narrative.ilcd.{dairy.ilcd_situation.value}.short")
    assert text.count(short) == 1


def test_sector_rules_come_in_the_words_the_page_sends(dairy):
    sector = [{"chapter": "§4 Agroalimentare e bioraffinerie", "reason": "Valgono per: il flusso «Cheese whey»",
               "rules": [{"strength": "obbligo", "text": "Il confine del sistema deve comprendere il tessuto connettivo.",
                          "source": "D4.1 Part 2 §4.2"}]}]
    text = _text(_doc(dairy, "it", sector=sector))
    assert "obbligo: Il confine del sistema deve comprendere il tessuto connettivo. (D4.1 Part 2 §4.2)" in text
    assert "The system boundary must encompass" not in text


def test_without_the_page_the_sector_rules_drop_the_line_numbers(dairy):
    text = _text(_doc(dairy))
    rules = text[text.index("Sector rules (D4.1 Part 2)"):text.index("Alternative scenarios")]
    assert "must: " in rules
    assert not re.search(r"\bL0\d{4}\b", rules.split("Read as")[0].split("Part 1")[0])


def test_a_blocked_case_says_what_blocks_it_and_skips_the_configuration():
    case = run(Case(q1=Q1.A, q2=Q2.A, q3=Q3(env=True), q4={Q4.A}, decision_context=DecisionContext.MICRO,
                    flows=[Flow(id="f1", name="mixed residues", q5=Q5.e)]))
    assert case.blocked_by
    text = _text(_doc(case, meta=META))
    assert "Blocked: the answers trigger the blocks listed below" in text
    assert "Your configuration" not in text
    assert "2. The answers" in text and "Acknowledgements" in text


def test_the_endpoint_names_the_file_after_the_case():
    from app.main import app
    client = TestClient(app)
    case = {"q1": "B", "decision_context": "micro", "q2": "A", "q3": {"env": True, "eco": False, "soc": False},
            "q4": ["E"], "flows": [{"id": "f1", "name": "heat", "q5": "b"}]}
    resp = client.post("/api/pipeline/report?lang=it", json={"case": case, "meta": {
        "case_name": "Parc éco-industriel Dunkerque", "prepared_by": "Claire", "state": "unsaved"}, "guided": True})
    assert resp.status_code == 200
    assert re.search(r'filename="Report_Parc-eco-industriel-Dunkerque_\d{4}-\d\d-\d\d\.docx"',
                     resp.headers["content-disposition"])
    text = _text(Document(BytesIO(resp.content)))
    assert "Report del caso: Parc éco-industriel Dunkerque" in text
    assert "non salvate nello strumento" in text
