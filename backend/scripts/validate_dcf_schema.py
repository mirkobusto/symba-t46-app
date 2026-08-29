"""Sanity-check dcf_schema.json against the 13 paper fixtures.

For each fixture, runs the full pipeline to derive pathway_id, ilcd_situation,
lcc_type, slca_activation_state, is_01_extended, then evaluates every field's
activation_predicate in dcf_schema.json and prints a table of active fields
per section per paper.

Intent: catch obvious schema mistakes (no paper activates a given field,
all papers activate every field, predicate string fails to parse) before
the Phase 2 evaluator implementation.

The predicate evaluator here is a temporary helper for this validation
only — it uses Python's eval with a restricted namespace. The production
evaluator (DATA_COLLECTION_FILE_v1.md §11 D1) will be a mini-DSL
implemented in Phase 2.

Usage:
    cd backend && PYTHONPATH=. python scripts/validate_dcf_schema.py
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path

# Make `app.*` importable when run from backend/
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.domain.enums import (  # noqa: E402
    Q1,
    Q2,
    Q4,
    Q5,
    Q7,
    Q6a,
    Q6b,
)
from app.domain.models import Q3, Case, Flow  # noqa: E402
from app.engine.loader import load_schemas  # noqa: E402
from app.engine.pipeline import run as pipeline_run  # noqa: E402

# ---------------------------------------------------------------------------
# Fixtures — mirrored from tests/test_12_papers_regression.py (subset of
# fields needed to build a Case). Duplication is intentional: this script
# stays runnable even if test layout changes.
# ---------------------------------------------------------------------------

def _flows(*qs):
    return [Flow(id=f"f{i+1}", name=f"flow{i+1}", q5=q) for i, q in enumerate(qs)]


FIXTURES = [
    {"id": "sokka_2011", "q1": Q1.B, "q2": Q2.D, "q3": Q3(env=True),
     "q4": {Q4.E}, "flows": _flows(Q5.e), "q6a": Q6a.PULP_PAPER, "q6b": Q6b.TRL9, "q7": Q7.B},
    {"id": "hashimoto_2010", "q1": Q1.B, "q2": Q2.D, "q3": Q3(env=True),
     "q4": {Q4.E}, "flows": _flows(Q5.a, Q5.c), "q6a": Q6a.CEMENT_CONSTRUCTION, "q6b": Q6b.TRL9, "q7": Q7.B},
    {"id": "daddi_2017", "q1": Q1.B, "q2": Q2.D, "q3": Q3(env=True),
     "q4": {Q4.E}, "flows": _flows(Q5.b, Q5.c), "q6a": Q6a.TEXTILE_LEATHER, "q6b": Q6b.TRL9, "q7": Q7.B},
    {"id": "paulu_2022", "q1": Q1.C, "q2": Q2.D, "q3": Q3(env=True),
     "q4": {Q4.D, Q4.E}, "flows": _flows(Q5.e), "q6a": Q6a.WASTE_VALORIZATION, "q6b": Q6b.TRL9, "q7": Q7.D},
    {"id": "arce_bastias_2023", "q1": Q1.B, "q2": Q2.A, "q3": Q3(env=True),
     "q4": {Q4.E}, "flows": _flows(Q5.b, Q5.c), "q6a": Q6a.PLASTICS_PACKAGING, "q6b": Q6b.TRL9, "q7": Q7.A},
    {"id": "wiktor_2018", "q1": Q1.B, "q2": Q2.D, "q3": Q3(env=True, eco=True),
     "q4": {Q4.E}, "flows": _flows(Q5.a, Q5.c, Q5.c),
     "q6a": Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, "q6b": Q6b.TRL7_8, "q7": Q7.B},
    {"id": "leiva_2025_escombreras", "q1": Q1.A, "q2": Q2.D, "q3": Q3(eco=True),
     "q4": {Q4.E}, "flows": _flows(Q5.b, Q5.c),
     "q6a": Q6a.CHEMICALS_FERTILIZERS, "q6b": Q6b.TRL9, "q7": Q7.B},
    {"id": "leiva_2025_frovi", "q1": Q1.B, "q2": Q2.D, "q3": Q3(eco=True),
     "q4": {Q4.E}, "flows": _flows(Q5.b, Q5.c),
     "q6a": Q6a.PULP_PAPER, "q6b": Q6b.TRL7_8, "q7": Q7.B},
    {"id": "danielsson_2018", "q1": Q1.B, "q2": Q2.D, "q3": Q3(env=True, eco=True),
     "q4": {Q4.C}, "flows": _flows(Q5.e), "q6a": Q6a.ENERGY_UTILITIES, "q6b": Q6b.TRL9, "q7": Q7.B},
    {"id": "kerdlap_2024", "q1": Q1.B, "q2": Q2.C, "q3": Q3(env=True, eco=True),
     "q4": {Q4.E}, "flows": _flows(Q5.b, Q5.c),
     "q6a": Q6a.AGRICULTURE_AGRIFOOD_BIOREFINERIES, "q6b": Q6b.TRL9, "q7": Q7.A},
    {"id": "subramanian_2021", "q1": Q1.B, "q2": Q2.D, "q3": Q3(env=True, eco=True, soc=True),
     "q4": {Q4.E}, "flows": _flows(Q5.b, Q5.c),
     "q6a": Q6a.MULTI_TENANT_URBAN_BUILDING, "q6b": Q6b.TRL9, "q7": Q7.A},
    {"id": "zhu_2013", "q1": Q1.A, "q2": Q2.C, "q3": Q3(env=True, eco=True),
     "q4": {Q4.E}, "flows": _flows(Q5.c), "q6a": Q6a.MULTI_SECTOR, "q6b": Q6b.TRL9, "q7": Q7.A},
    {"id": "briassoulis_2023", "q1": Q1.C, "q2": Q2.C, "q3": Q3(env=True, eco=True, soc=True),
     "q4": {Q4.E}, "flows": _flows(Q5.b, Q5.c),
     "q6a": Q6a.BIOBASED_POLYMERS, "q6b": Q6b.TRL9, "q7": None},
]


# ---------------------------------------------------------------------------
# Temporary predicate evaluator (Phase 1 only — Phase 2 replaces this)
# ---------------------------------------------------------------------------

@dataclass
class Q3Proxy:
    env: bool
    eco: bool
    soc: bool


def _build_eval_context(case: Case) -> dict:
    """Convert a post-pipeline Case to a flat namespace for predicate eval."""
    return {
        "q1": case.q1.value if case.q1 else None,
        "q2": case.q2.value if case.q2 else None,
        "q3": Q3Proxy(env=case.q3.env, eco=case.q3.eco, soc=case.q3.soc),
        "q4": {q.value for q in case.q4},
        "q6a": case.q6a.value if case.q6a else None,
        "q6b": case.q6b.value if case.q6b else None,
        "q7": case.q7.value if case.q7 else None,
        "pathway_id": case.pathway_id.value if case.pathway_id else None,
        "ilcd_situation": case.ilcd_situation.value if case.ilcd_situation else None,
        "lcc_type": case.lcc_type.value if case.lcc_type else None,
        "slca_activation_state": case.slca_activation_state.value if case.slca_activation_state else None,
        "is_01_extended": case.is_01_extended,
        "always": True,
    }


_ALLOWED_GLOBALS = {"__builtins__": {}}


def _eval_predicate(predicate: str, ctx: dict) -> bool:
    if predicate == "always":
        return True
    try:
        result = eval(predicate, _ALLOWED_GLOBALS, ctx)  # noqa: S307 — script-only
    except Exception as e:
        raise ValueError(f"Predicate failed: {predicate!r} → {e}") from e
    return bool(result)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    schemas = load_schemas(Path(__file__).resolve().parents[1] / "app" / "schemas")
    dcf_path = Path(__file__).resolve().parents[1] / "app" / "schemas" / "dcf_schema.json"
    with open(dcf_path) as f:
        dcf = json.load(f)

    sections = dcf["sections"]
    # Sections that have a "fields" array (non-derived sections only)
    data_sections = [s for s in sections if "fields" in s]

    # Build all cases through the pipeline first
    cases = {}
    for fix in FIXTURES:
        case = Case(q1=fix["q1"], q2=fix["q2"], q3=fix["q3"], q4=fix["q4"],
                    q6a=fix["q6a"], q6b=fix["q6b"], q7=fix["q7"], flows=fix["flows"])
        pipeline_run(case, schemas)
        cases[fix["id"]] = case

    # Per-section active counts per paper
    print("=" * 100)
    print("DCF Schema validation — active fields per section per paper")
    print("=" * 100)
    header_papers = [fix["id"][:16] for fix in FIXTURES]
    print(f"{'Section':<22} {'Total':>6} | " + " ".join(f"{p:>16}" for p in header_papers))
    print("-" * 100)

    issues: list[str] = []
    for sec in data_sections:
        sec_id = sec["id"]
        fields = sec["fields"]
        total = len(fields)
        sec_predicate = sec.get("applies_when", "always")

        per_paper_counts = []
        per_paper_active_fields = {}
        for fix in FIXTURES:
            case = cases[fix["id"]]
            ctx = _build_eval_context(case)

            sec_applies = _eval_predicate(sec_predicate, ctx)
            if not sec_applies:
                per_paper_counts.append(0)
                per_paper_active_fields[fix["id"]] = []
                continue

            active = []
            for f in fields:
                pred = f.get("activation_predicate", "always")
                if _eval_predicate(pred, ctx):
                    active.append(f["id"])
            per_paper_counts.append(len(active))
            per_paper_active_fields[fix["id"]] = active

        counts_str = " ".join(f"{c:>16d}" for c in per_paper_counts)
        print(f"{sec_id:<22} {total:>6d} | {counts_str}")

        # Sanity checks
        for f in fields:
            pred = f.get("activation_predicate", "always")
            active_for = [fix["id"] for fix in FIXTURES
                          if f["id"] in per_paper_active_fields.get(fix["id"], [])]
            if pred == "always":
                if len(active_for) != len(FIXTURES) and sec_predicate == "always":
                    issues.append(f"[{sec_id}.{f['id']}] always-on but inactive for some papers: section-gated by {sec_predicate}")
            else:
                if len(active_for) == 0:
                    issues.append(f"[{sec_id}.{f['id']}] predicate {pred!r} matches NO paper — dead field?")
                if len(active_for) == len(FIXTURES) and sec_predicate == "always":
                    issues.append(f"[{sec_id}.{f['id']}] predicate {pred!r} matches ALL papers — consider 'always'")

    print("=" * 100)
    print()

    # Derived/auto sections
    auto_sections = [s for s in sections if "fields" not in s]
    if auto_sections:
        print("Auto/derived sections (no fields array):")
        for s in auto_sections:
            print(f"  - {s['id']}: {s.get('description_en', '')[:80]}")
        print()

    # Issues report
    if issues:
        print(f"ISSUES detected ({len(issues)}):")
        for i in issues:
            print(f"  - {i}")
        sys.exit(1)
    else:
        print("OK — no schema issues detected on the 13-paper fixture set.")
        sys.exit(0)


if __name__ == "__main__":
    main()
