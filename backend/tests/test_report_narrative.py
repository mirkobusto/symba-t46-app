"""The .docx report opens with the same verdict the result page shows.

Before this, the report went straight into the WorkingDoc §6 layout —
right for a reviewer checking whether the configuration is defensible,
useless to a reader asking what they got and what to do next.
"""
from __future__ import annotations

from io import BytesIO

import pytest
from docx import Document

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine.pipeline import run as pipeline_run
from app.services.narrative import action_items, answers_in, verdict_for
from app.services.reports import generate_case_report_bytes


@pytest.fixture()
def wiktor(schemas) -> Case:
    case = Case(
        q1=Q1.B, q2=Q2.B, q3=Q3(env=True, eco=True), q4={Q4.E},
        q6a=Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, q6b=Q6b.TRL7_8, q7=Q7.B,
        flows=[Flow(id="f1", name="sludge", q5=Q5.a)],
    )
    pipeline_run(case, schemas)
    return case


def _text(case: Case) -> str:
    doc = Document(BytesIO(generate_case_report_bytes(case, "test")))
    parts = [p.text for p in doc.paragraphs]
    for table in doc.tables:
        for row in table.rows:
            parts.extend(c.text for c in row.cells)
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# The composed verdict
# ---------------------------------------------------------------------------


def test_verdict_reads_as_a_sentence_not_a_code(wiktor):
    verdict = verdict_for(wiktor)
    assert verdict is not None
    # the verdict leads with the ILCD situation, not with a pathway (retired 2026-10-18)
    assert verdict.title == "Decision support with limited consequences (ILCD Situation A)"
    assert verdict.body.startswith("Micro-level decision support")
    assert verdict.codes[0] == "ILCD Situation A"


def test_verdict_sections_carry_their_citation(wiktor):
    sections = {s.code: s for s in verdict_for(wiktor).sections}
    assert "ILCD Situation A" in sections
    assert sections["ILCD Situation A"].source.startswith("D4.1")
    # a deactivated state is engine behaviour, not methodology: no citation
    assert sections["deactivated"].quote == ""


def test_answers_in_resolves_the_trigger_against_the_case(wiktor):
    assert answers_in("Q7 ∈ {B, C, D}", wiktor) == [("Q7", "B")]
    assert answers_in("Q3 has ≥2 dims active", wiktor) == [("Q3", "env + eco")]
    assert answers_in(None, wiktor) == []


def test_action_items_are_ordered_hardest_stop_first(wiktor):
    kinds = [item.kind for item in action_items(wiktor)]
    assert kinds == sorted(
        kinds, key=lambda k: {"block": 0, "obligation": 1, "decision": 2}[k]
    )


def test_obligations_come_from_triggered_rules_not_failed_assertions(wiktor):
    """A rule applies because its trigger fired. Presenting only the
    assertion failures would hide most of the practices the case owes and
    would rest on assertions that compare engine-written prose."""
    codes = {item.code for item in action_items(wiktor) if item.kind == "obligation"}
    assert codes == {r["rule_id"] for r in wiktor.applicable_rules}
    assert len(codes) > len(wiktor.rule_violations)   # the diagnostics are a subset, never shown


# ---------------------------------------------------------------------------
# The rendered document
# ---------------------------------------------------------------------------


def test_report_follows_the_order_a_reader_asks_in(wiktor):
    """Summary, the answers, the configuration, the decision points, the
    obligations, then the appendix, numbered from the first section (the
    numbering started half-way down and the answers came last, P8-05)."""
    text = _text(wiktor)
    assert "Decision support with limited consequences (ILCD Situation A)" in text
    assert "What this configuration means" in text
    order = ["1. Summary", "2. The answers", "3. Your configuration", "4. Notes on the answers",
             "5. Decision points", "6. What the study has to document", "Acknowledgements",
             "Appendix: technical detail for the analyst"]
    positions = [text.index(h) for h in order]
    assert positions == sorted(positions)
    for gone in ("3. Summary", "2. The configuration derived by the tool", "What to do next"):
        assert gone not in text


def test_report_prints_the_deliverable_citation_in_full(wiktor):
    text = _text(wiktor)
    assert "Attributional Modeling with Substitution" in text
    assert "D4.1 Part 1 §7.2.1" in text


def test_report_says_why_a_rule_applies_in_words(wiktor):
    text = _text(wiktor)
    assert "Why it applies here" in text
    assert "Q3 dimensions: Environmental (LCA) + Economic (LCC)" in text
    assert "Q3 = env + eco" not in text
    # the field paths sit in the appendix only, labelled for the analyst
    body = text[:text.index("Appendix: technical detail for the analyst")]
    assert "lca.functional_unit" not in body and "What to document" not in body
    assert "lca.functional_unit" in text


def test_report_has_no_paper_placeholders(wiktor):
    """The paper-validation sections were empty placeholders for a user's case
    and a third of the document (UX round 2026-11-02)."""
    text = _text(wiktor)
    for gone in ("Bibliographic reference", "adopted by the authors", "paper configuration vs tool"):
        assert gone not in text


def test_report_in_italian(wiktor):
    from app.services.reports import generate_case_report_bytes
    text = "\n".join(p.text for p in Document(BytesIO(generate_case_report_bytes(wiktor, lang="it"))).paragraphs)
    assert "1. Sintesi" in text and "2. Le risposte" in text
    assert "Supporto decisionale con conseguenze limitate (Situazione ILCD A)" in text
    assert "Q2 gli scambi avvengono già: B. Non ancora" in text


def test_a_clean_case_says_so_instead_of_listing_nothing(schemas):
    case = Case(
        q1=Q1.A, q2=Q2.A, q3=Q3(env=True), q4={Q4.E},
        q6a=Q6a.PLASTICS_PACKAGING, q6b=Q6b.TRL9, q7=Q7.A,
        flows=[Flow(id="f1", name="scrap", q5=Q5.b)],
    )
    pipeline_run(case, schemas)
    if action_items(case):
        pytest.skip("fixture is not clean; the empty-state path is covered elsewhere")
    assert "Nothing to fix" in _text(case)


def test_the_report_shows_obligations_not_l2_violations():
    """R4 (2026-10-18): the L2 assertions are diagnostics, never shown; the
    verdict counts obligations and decision points instead."""
    from io import BytesIO

    from docx import Document

    from app.domain.enums import Q1
    from app.domain.models import Q3, Case
    from app.engine.pipeline import run
    from app.services.reports import generate_case_report_bytes
    case = run(Case(q1=Q1.B, q3=Q3(env=True, eco=True), decision_context="micro", policy_objective=False,
                    dedicated_shared_assets=True))
    doc = Document(BytesIO(generate_case_report_bytes(case)))
    text = "\n".join(p.text for p in doc.paragraphs)
    assert "violation" not in text.lower()
    assert f"Obligations to document: {len(case.applicable_rules)}." in text


# UX round 2026-11-03: the analyst and the reviewer found the document half
# English and without the page's "Your configuration".
def _text_with(case: Case, lang: str, rows: list[dict] | None = None) -> str:
    doc = Document(BytesIO(generate_case_report_bytes(case, "test", lang=lang, rows=rows)))
    parts = [p.text for p in doc.paragraphs]
    for table in doc.tables:
        for row in table.rows:
            parts.extend(c.text for c in row.cells)
    return "\n".join(parts)


def test_report_carries_the_page_configuration_rows(wiktor):
    rows = [{"label": "Orizzonte dello studio", "value": "Background attuale", "why": "anno corrente"}]
    text = _text_with(wiktor, "it", rows)
    assert "La tua configurazione" in text
    assert "Orizzonte dello studio" in text and "Perché: anno corrente" in text
    assert text.index("Le risposte") < text.index("La tua configurazione") < text.index("Punti in cui i metodi")


def test_rule_and_cdp_names_follow_the_language(wiktor):
    text = _text_with(wiktor, "it")
    assert "Unità funzionale condivisa" in text
    assert "Shared Functional Unit" not in text
    assert "dims active" not in text          # no raw trigger expression


def test_verdict_detail_is_translated_and_not_repeated(wiktor):
    from app.services.reports import _t
    text = _text_with(wiktor, "fr")
    assert "You are documenting" not in text and "The exchange affects" not in text
    detail = _t("fr", f"narrative.ilcd.{wiktor.ilcd_situation.value}.detail")
    assert text.count(detail) == 1


def test_engine_output_is_left_to_the_case_file(wiktor):
    """The key-by-key output carried flow ids and dated development notes
    ("T4.6 divergence kept on 2026-10-04", P3-05): it stays in the .json."""
    text = _text_with(wiktor, "en")
    assert "Engine output, key by key" not in text
    assert "divergence kept on" not in text
    assert "case file (.json)" in text
    assert "{'" not in text


def test_report_endpoint_takes_a_bare_case_or_case_and_rows():
    from fastapi.testclient import TestClient

    from app.main import app
    client = TestClient(app)
    case = {"q1": "B", "decision_context": "micro", "q2": "A", "q3": {"env": True, "eco": False, "soc": False},
            "q4": ["E"], "flows": [{"id": "f1", "name": "heat", "q5": "b"}]}
    assert client.post("/api/pipeline/report", json=case).status_code == 200
    resp = client.post("/api/pipeline/report?lang=it",
                       json={"case": case, "rows": [{"label": "Riga", "value": "valore"}]})
    assert resp.status_code == 200
    assert "Riga" in "\n".join(c.text for t in Document(BytesIO(resp.content)).tables for r in t.rows for c in r.cells)
