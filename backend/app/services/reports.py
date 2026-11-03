"""Ad-hoc .docx report generation for arbitrary user cases.

This module powers POST /api/pipeline/report. The 12-paper batch script in
backend/scripts/generate_validation_reports.py is a separate generator with
paper-specific bibliographic sections; this one writes a user's case.

Since the agent UX round of 2026-11-02 it is written in the interface
language and no longer carries the paper-validation sections (bibliography,
the authors' configuration, paper vs tool), which were empty placeholders for
a user's case and a third of the document. The verdict, the engine notes and
the answer labels come from the app's own translations
(app/data/report_terms.json, copied from the frontend locales by
scripts/sync_report_terms.py); rule titles, sector-rule statements and the
engine's key-by-key output stay in English, as traced on the deliverables
(owner decision, R5).
"""
from __future__ import annotations

import json
import re
from collections import Counter
from functools import lru_cache
from io import BytesIO
from pathlib import Path
from typing import Any

from docx import Document
from docx.shared import Pt

from app.domain.enums import Q4
from app.domain.models import Q3, Case
from app.services.dcf_terms import language
from app.services.narrative import ActionItem, Verdict, action_items, verdict_for


@lru_cache(maxsize=1)
def _terms() -> dict[str, Any]:
    path = Path(__file__).resolve().parents[1] / "data" / "report_terms.json"
    return json.loads(path.read_text(encoding="utf-8"))


def _lookup(lang: str, path: str) -> Any:
    node: Any = _terms()[language(lang)]
    for part in path.split("."):
        if not isinstance(node, dict) or part not in node:
            return None
        node = node[part]
    return node


def _t(lang: str, path: str, default: str | None = None, **params: Any) -> str:
    """i18next-style lookup in report_terms.json: {{name}} placeholders,
    English, then `default`, then the path itself as fallbacks."""
    text = _lookup(lang, path)
    if not isinstance(text, str):
        text = _lookup("en", path)
    if not isinstance(text, str):
        text = default if default is not None else path
    return re.sub(r"\{\{(\w+)\}\}", lambda m: str(params.get(m.group(1), m.group(0))), text)


def _format_q3(q3: Q3, lang: str = "en") -> str:
    parts = [_t(lang, f"options.q3.{d}") for d in ("env", "eco", "soc") if getattr(q3, d)]
    return " + ".join(parts) or _t(lang, "docx.none")


def _format_q4(q4: set[Q4], lang: str = "en") -> str:
    return "; ".join(_t(lang, f"options.q4.{q.value}", q.value) for q in sorted(q4, key=lambda x: x.value)) \
        or _t(lang, "docx.none")


def _add_kv(doc: Document, key: str, value: str) -> None:
    p = doc.add_paragraph()
    p.add_run(f"{key}: ").bold = True
    p.add_run(value)




def _write_verdict(doc: Document, verdict: Verdict, lang: str = "en", case: Case | None = None) -> None:
    """The answer first: what the configuration is, and what it means.

    The detail and the deliverable citation are printed in full rather
    than folded away — a document is read once, often by someone who was
    not at the keyboard when it was generated.
    """
    doc.add_heading(_t(lang, "docx.verdict"), level=1)
    situation = case.ilcd_situation.value if case is not None and case.ilcd_situation else None
    lead = doc.add_paragraph()
    lead.add_run(_t(lang, f"narrative.ilcd.{situation}.title", verdict.title)).bold = True
    doc.add_paragraph(_t(lang, f"narrative.ilcd.{situation}.short", verdict.body))
    if verdict.codes:
        codes = doc.add_paragraph()
        run = codes.add_run(" · ".join(verdict.codes))
        run.italic = True
        run.font.size = Pt(9)
    if verdict.detail:
        doc.add_paragraph(verdict.detail)

    if not verdict.sections:
        return

    doc.add_heading(_t(lang, "docx.meaning"), level=2)
    # the sections follow the case's ilcd / lcc / slca states, in that order
    states = [(kind, value.value) for kind, value in (
        ("ilcd", case.ilcd_situation if case else None),
        ("lcc", case.lcc_type if case else None),
        ("slca", case.slca_activation_state if case else None)) if value is not None]
    for section in verdict.sections:
        kind = next((k for k, v in states if v == section.code), "ilcd")
        states = [s for s in states if s != (kind, section.code)]
        para = doc.add_paragraph()
        para.add_run(f"{_t(lang, f'narrative.{kind}.{section.code}.short', section.short)} ").bold = True
        code_run = para.add_run(f"[{section.code}]")
        code_run.font.size = Pt(9)
        if section.detail:
            doc.add_paragraph(section.detail)
        if section.quote:
            quoted = doc.add_paragraph(style="Intense Quote")
            quoted.add_run(f"\u201c{section.quote}\u201d").italic = True
            cite = doc.add_paragraph()
            cite_run = cite.add_run(section.source)
            cite_run.font.size = Pt(9)


def _write_next_steps(
    doc: Document, items: list[ActionItem], lang: str = "en", resolved: set[str] | None = None,
) -> None:
    """Blocks, methodological obligations and open decisions as one
    ordered list, each saying why it applies to this case and what has to
    be documented."""
    doc.add_heading(_t(lang, "docx.next"), level=1)
    if not items:
        doc.add_paragraph(_t(lang, "docx.nextNone"))
        return

    for item in items:
        head = doc.add_paragraph()
        # a decision the engine has settled is not "to decide" (result page, PR #165)
        kind = "decisionResolved" if item.kind == "decision" and item.code in (resolved or set()) else item.kind
        head.add_run(f"[{_t(lang, f'actionKind.{kind}', item.kind)}] ").bold = True
        head.add_run(item.title).bold = True
        code_run = head.add_run(f"  {item.code}")
        code_run.font.size = Pt(9)

        if item.answers:
            why = doc.add_paragraph()
            why.add_run(f"{_t(lang, 'docx.whyHere')} ").italic = True
            why.add_run(", ".join(f"{label} = {value}" for label, value in item.answers))
            if item.trigger:
                trigger_run = why.add_run(f"  ({item.trigger})")
                trigger_run.font.size = Pt(9)

        if item.fields:
            todo = doc.add_paragraph()
            todo.add_run(f"{_t(lang, 'docx.toDocument')} ").italic = True
            todo.add_run(", ".join(item.fields))

        if item.detail:
            detail = doc.add_paragraph()
            detail_run = detail.add_run(item.detail)
            detail_run.font.size = Pt(9)


def _note(lang: str, w: dict[str, Any]) -> str:
    """An engine note in the reader's language, as the result page shows it."""
    p = w.get("params") or {}
    key = f"engineNotes.{w['code']}" + (f".{p['variant']}" if p.get("variant") else "")

    def chapter(c: str | None) -> str | None:
        return _t(lang, f"chapters.{c.split(' ')[0]}", c) if c else None
    return _t(lang, key, w.get("message", ""), flow=p.get("flow"), configuration=p.get("configuration"),
              situation=p.get("situation"), chapter=chapter(p.get("chapter")), declared=chapter(p.get("declared")))


def _yes_no(lang: str, value: bool) -> str:
    return _t(lang, "common.yes" if value else "common.no")


def generate_case_report_bytes(case: Case, title: str | None = None, lang: str = "en") -> bytes:
    """Build a .docx for `case` (assumed already pipeline-run) in `lang` and
    return the bytes for streaming via FastAPI Response."""
    doc = Document()
    doc.styles["Normal"].font.size = Pt(11)
    q = lambda key: _t(lang, f"docx.q.{key}")  # noqa: E731
    not_set = _t(lang, "docx.notSet")

    heading = doc.add_heading(title or _t(lang, "docx.title"), level=0)
    heading.runs[0].font.size = Pt(20)
    doc.add_paragraph(_t(lang, "docx.intro")).italic = True

    verdict = verdict_for(case)
    if verdict is not None:
        _write_verdict(doc, verdict, lang, case)
    resolved = {str(c.get("cdp_id")) for c in case.cdp_flags if c.get("resolution")}
    _write_next_steps(doc, action_items(case), lang, resolved)

    # ----- 1. The answers -----
    doc.add_heading(_t(lang, "docx.answers"), level=1)
    if case.study_purpose is not None:
        _add_kv(doc, q("q0"), _t(lang, f"options.q0.{case.study_purpose.value}", case.study_purpose.value))
    _add_kv(doc, q("q1"), _t(lang, f"options.q1.{case.q1.value}", case.q1.value) if case.q1 else not_set)
    _add_kv(doc, q("q2"), _t(lang, f"options.q2.{case.q2.value}", case.q2.value) if case.q2 else not_set)
    if case.q2 is not None and case.q2.value == "A" and case.network_long_standing is not None:
        _add_kv(doc, q("q2b"), _yes_no(lang, case.network_long_standing))
    _add_kv(doc, q("q3"), _format_q3(case.q3, lang))
    _add_kv(doc, q("q4"), _format_q4(case.q4, lang))
    if case.flows:
        _add_kv(doc, q("q5"), "; ".join(
            f"{f.name or f.id}: {_t(lang, f'options.q5.{f.q5.value}', f.q5.value)}" for f in case.flows))
        answered = [f for f in case.flows if f.sellable_elsewhere is not None or f.sector]
        if answered:
            _add_kv(doc, q("q5extra"), "; ".join(
                f"{f.name or f.id}: "
                f"{'—' if f.sellable_elsewhere is None else _yes_no(lang, f.sellable_elsewhere)}"
                f" / {_t(lang, f'options.q6a.{f.sector.value}', f.sector.value) if f.sector else '—'}"
                for f in answered))
    else:
        _add_kv(doc, q("q5"), _t(lang, "docx.none"))
    _add_kv(doc, q("q6a"), _t(lang, f"options.q6a.{case.q6a.value}", case.q6a.value) if case.q6a else not_set)
    _add_kv(doc, q("q6b"), _t(lang, f"options.q6b.{case.q6b.value}", case.q6b.value) if case.q6b else not_set)
    _add_kv(doc, q("q7"), _t(lang, f"options.q7.{case.q7.value}", case.q7.value) if case.q7 else not_set)
    if case.reference_market_region or case.reference_market_scope:
        _add_kv(doc, q("q7b"), " — ".join(x for x in (
            case.reference_market_region,
            _t(lang, f"options.scope.{case.reference_market_scope.value}", case.reference_market_scope.value)
            if case.reference_market_scope else None) if x))
    # Optional questions: listed only when answered.
    if case.operating_start is not None:
        start = _t(lang, f"options.q8start.{case.operating_start.value}", case.operating_start.value)
        if case.operating_start_year is not None:
            start += f" ({case.operating_start_year})"
        _add_kv(doc, q("q8a"), start)
    if case.analysis_period_years is not None:
        _add_kv(doc, q("q8b"), f"{case.analysis_period_years:g}")
    if case.asset_lifetime_years is not None:
        _add_kv(doc, q("q8c"), f"{case.asset_lifetime_years:g}")
    if case.decision_context is not None:
        _add_kv(doc, q("q9"), _t(lang, f"options.q9.{case.decision_context.value}", case.decision_context.value))
    if case.market_screening_documented is not None:
        _add_kv(doc, q("q9b"), _yes_no(lang, case.market_screening_documented))
    if case.policy_objective is not None:
        _add_kv(doc, q("q10"), _yes_no(lang, case.policy_objective))
    if case.comparison_goal is not None:
        _add_kv(doc, q("q11"), _t(lang, f"options.q11.{case.comparison_goal.value}", case.comparison_goal.value))
    if case.dedicated_shared_assets is not None:
        _add_kv(doc, q("q12"), _yes_no(lang, case.dedicated_shared_assets))
    if case.alternative_scenarios:
        _add_kv(doc, _t(lang, "docx.scenarios"), str(len(case.alternative_scenarios)))
    if case.advanced:
        _add_kv(doc, _t(lang, "docx.advanced"), ", ".join(f"{k}={v}" for k, v in case.advanced.items()))

    # ----- 2. The configuration derived by the tool -----
    doc.add_heading(_t(lang, "docx.config"), level=1)
    _add_kv(doc, _t(lang, "docx.situation"),
            _t(lang, f"narrative.ilcd.{case.ilcd_situation.value}.title", case.ilcd_situation.value)
            if case.ilcd_situation else "—")
    _add_kv(doc, _t(lang, "docx.lccType"), case.lcc_type.value if case.lcc_type else "—")
    _add_kv(doc, _t(lang, "docx.slca"),
            _t(lang, f"narrative.slca.{case.slca_activation_state.value}.short", case.slca_activation_state.value)
            if case.slca_activation_state else "—")
    _add_kv(doc, _t(lang, "docx.nodes"), str(len(case.activated_nodes)))
    _add_kv(doc, _t(lang, "docx.blocks"), ", ".join(case.blocked_by) if case.blocked_by else _t(lang, "docx.none"))
    _add_kv(doc, _t(lang, "docx.obligations"), str(len(case.applicable_rules)))
    _add_kv(doc, _t(lang, "docx.cdps"), str(len(case.cdp_flags)))
    if case.warnings:
        doc.add_heading(_t(lang, "docx.notes"), level=3)
        for w in case.warnings:
            doc.add_paragraph(_note(lang, w), style="List Bullet")
    if case.sector_rules:
        doc.add_heading(_t(lang, "docx.sectorRules"), level=3)
        chapter = None
        for r in case.sector_rules:
            if r["chapter"] != chapter:
                chapter = r["chapter"]
                reasons = ", ".join(f"{_t(lang, 'docx.flow')} {a['name']}" if a["kind"] == "flow"
                                    else _t(lang, "docx.caseSector") for a in r["activated_by"])
                name = _t(lang, f"chapters.{chapter.split(' ')[0]}", chapter)
                doc.add_paragraph(f"{name} — {_t(lang, 'docx.appliesBecause')}: {reasons}")
            note = f" Note: {r['note']}" if r.get("note") else ""
            doc.add_paragraph(f"[{r['strength']}] {r['statement']} ({r['source']}, {r['lines']}){note}",
                              style="List Bullet")

    doc.add_heading(_t(lang, "docx.pillars"), level=2)
    pillar_pairs = [
        ("LCA", case.lca), ("LCC", case.lcc), ("S-LCA", case.slca), ("Report", case.report),
        ("Governance", case.governance), ("Methodological charter", case.methodological_charter),
        ("Review", case.review), ("System", case.system),
    ]
    any_written = False
    for name, pillar in pillar_pairs:
        if not pillar:
            continue
        any_written = True
        doc.add_heading(name, level=3)
        for k, v in pillar.items():
            doc.add_paragraph(f"  {k} = {v}")
    if not any_written:
        doc.add_paragraph(_t(lang, "docx.noPillars"))

    # ----- 3. Summary -----
    doc.add_heading(_t(lang, "docx.summary"), level=1)
    doc.add_paragraph(_t(lang, "docx.blocked") if case.blocked_by else
                      _t(lang, "docx.complete", obligations=len(case.applicable_rules), cdps=len(case.cdp_flags)))

    # ----- 4. Appendix: activated nodes -----
    doc.add_heading(_t(lang, "docx.appendix"), level=1)
    grouped: dict[str, list[str]] = {}
    for nid in case.activated_nodes:
        grouped.setdefault(nid.split("_")[0], []).append(nid)
    counts = Counter({k: len(v) for k, v in grouped.items()})
    _add_kv(doc, _t(lang, "docx.countsByPrefix"), ", ".join(f"{k}={n}" for k, n in counts.most_common()))
    for prefix in sorted(grouped):
        doc.add_heading(f"{prefix} ({len(grouped[prefix])})", level=2)
        doc.add_paragraph(", ".join(grouped[prefix]))

    buf = BytesIO()
    doc.save(buf)
    return buf.getvalue()
