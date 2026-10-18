"""Every engine note code (and text variant) has an English entry in the client
locale (frontend/src/i18n/locales/en.ts, result.engineNotes), so the result page
can translate it. The client keeps the engine's English message as fallback; this
test catches a new note before it ships untranslated."""
from __future__ import annotations

import re
from pathlib import Path

from app.engine import l0_compute

ROOT = Path(__file__).resolve().parents[2]
VARIANTS = {
    "decision_scale_vs_q1": {v for _, v, _ in l0_compute._DECISION_WARNINGS.values()},
    "lcc_without_lca": {"plain", "policy"},
    "flow_freedom_to_act_settles": {"co_product", "waste"},
    "q10_unanswered": {"yes", "no"},
}


def _codes() -> set[str]:
    src = "".join((ROOT / "backend/app/engine" / f).read_text() for f in ("l0_compute.py", "sector_rules.py"))
    codes = set(re.findall(r'"code": "([a-z0-9_]+)"', src))
    codes |= {c for c, _, _ in l0_compute._DECISION_WARNINGS.values()} | {l0_compute._Q1_D_NOT_CORPORATE[0]}
    return codes


def _en_block() -> str:
    ts = (ROOT / "frontend/src/i18n/locales/en.ts").read_text()
    start = ts.index("    engineNotes: {")
    return ts[start:ts.index("\n    sectorChapters:", start)]


def test_every_note_code_has_an_english_entry():
    block = _en_block()
    keys = set(re.findall(r"^      ([a-z0-9_]+):", block, re.M))
    assert _codes() <= keys
    assert keys <= _codes(), "entries for codes the engine no longer emits"


def test_every_variant_has_an_english_entry():
    block = _en_block()
    for code, variants in VARIANTS.items():
        sub = block[block.index(f"      {code}: {{"):]
        sub = sub[: sub.index("\n      },")]
        assert set(re.findall(r"^        ([a-z_]+):", sub, re.M)) == variants, code
