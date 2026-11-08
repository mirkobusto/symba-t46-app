"""Every "Lnnnnn" line citation points at the right line of the FINAL v2 texts.

The citations are line numbers of the Markdown FINAL v2 deliverables kept outside
the repository (finalv2_work/testo). Until November 2026 the sector rules cited
the numbering of an earlier conversion of the same text, shifted by 25 to 37
lines (UX round 6, P6-02). These tests catch a future shift: each cited line
must hold the rule's verbatim quote or a stored anchor. They skip when the texts
are not on the machine (CI); set SYMBA_DELIVERABLE_TEXTS to point at the folder.
"""
from __future__ import annotations

import json
import os
import re
import unicodedata
from functools import cache
from pathlib import Path

import pytest

BACKEND = Path(__file__).resolve().parents[1]
REPO = BACKEND.parent
OVERLAYS = BACKEND / "app" / "schemas" / "sector_overlays.json"
NODES = BACKEND / "app" / "schemas" / "phase1_nodes.json"
SECTOR_TERMS = REPO / "frontend" / "src" / "i18n" / "sectorTerms.json"

FILES = {
    "P1": "D4.1_Part1_LCA_Guidelines_FINAL_v2.md",
    "P2": "D4.1_Part2_Sector_Specific_FINAL_V2.md",
    "D42": "D4.2_LCC_Guidelines_FINAL_v2.md",
}


def _texts_dir() -> Path | None:
    if os.environ.get("SYMBA_DELIVERABLE_TEXTS"):
        candidates = [Path(os.environ["SYMBA_DELIVERABLE_TEXTS"])]
    else:
        # the repository sits next to finalv2_work in Symba_VCS (also from a worktree)
        candidates = [parent / "finalv2_work" / "testo" for parent in REPO.parents]
    for c in candidates:
        if all((c / f).is_file() for f in FILES.values()):
            return c
    return None


TEXTS = _texts_dir()
pytestmark = pytest.mark.skipif(TEXTS is None, reason="FINAL v2 deliverable texts not available")


def _norm(s: str) -> str:
    """Compare on letters and digits only: the Markdown escapes quotes, marks
    emphasis with asterisks and writes dashes as '---'."""
    s = unicodedata.normalize("NFKC", s).replace("\\", "")
    s = re.sub(r"\[([^\]]*)\]\{[^}]*\}", r"\1", s)
    s = re.sub(r"[^a-z0-9]+", " ", s.lower())
    return s.strip()


@cache
def _lines(doc: str) -> tuple[str, ...]:
    assert TEXTS is not None
    return tuple(_norm(row) for row in (TEXTS / FILES[doc]).read_text(encoding="utf-8").split("\n"))


def _line(doc: str, n: int) -> str:
    lines = _lines(doc)
    return lines[n - 1] if 0 < n <= len(lines) else ""


def _numbers(s: str | None) -> list[int]:
    return [int(x) for x in re.findall(r"L0*(\d+)", s or "")]


# Part 2 lines cited by a rule beside the line of its verbatim quote: the §9
# introduction and the "Dominant Impact Categories" line of each sector (§9.1-§9.5).
P2_ANCHORS = {
    795: "practitioners shall tailor their lcia to capture the specific burden shifting",
    799: "dominant impact categories global warming potential gwp eutrophication terrestrial",
    807: "dominant impact categories climate change gwp abiotic resource depletion",
    819: "dominant impact categories global warming potential eutrophication freshwater marine",
    827: "dominant impact categories climate change gwp water use scarcity human toxicity",
    839: "dominant impact categories global warming potential human toxicity terrestrial",
}

# Part 1 lines cited by the notes of the sector rules (and their translations).
P1_ANCHORS = {
    915: "a quality correction factor q must be applied to the substitution",
    925: "mandatory for eu policy aligned studies",
    945: "is a valid alternative",
    1047: "step 4 zero burden boundary",
    1246: "the four categories below should be reported",
    1256: "should appear in the interpretation as an explicit known blind spot",
    1330: "for situation b macro level use a marginal technology mix",
}


def _items():
    data = json.loads(OVERLAYS.read_text(encoding="utf-8"))
    for chapter, overlay in data["overlays"].items():
        for item in overlay["rules"] + overlay["configurations"]:
            yield chapter, item


def test_each_rule_and_configuration_cites_the_line_of_its_quote():
    wrong = []
    for chapter, item in _items():
        quote = _norm(item["verbatim"])
        if not any(quote in _line("P2", n) for n in _numbers(item["lines"])):
            wrong.append(f"{chapter}/{item['id']} {item['lines']}")
    assert not wrong, f"verbatim quote not on any cited line of Part 2: {wrong}"


def test_every_cited_part2_line_holds_a_quote_or_an_anchor():
    """A rule citing several lines quotes only one: the others hold the quote of
    another rule (the census row it shares) or an anchor of P2_ANCHORS."""
    quotes = [_norm(item["verbatim"]) for _chapter, item in _items()]
    wrong = []
    for chapter, item in _items():
        for n in _numbers(item["lines"]):
            text = _line("P2", n)
            if any(q in text for q in quotes):
                continue
            anchor = P2_ANCHORS.get(n)
            if anchor is None or anchor not in text:
                wrong.append(f"{chapter}/{item['id']} L{n:05d}")
    assert not wrong, f"Part 2 lines without their quote or a matching anchor: {wrong}"


def test_part1_lines_in_the_notes_of_the_sector_rules():
    cited = set()
    for _chapter, item in _items():
        cited |= set(_numbers(item.get("note")))
    terms = json.loads(SECTOR_TERMS.read_text(encoding="utf-8"))
    for lang in ("en", "it", "fr", "de", "es"):
        for text in terms[lang]["notes"].values():
            cited |= set(_numbers(text))
    unknown = sorted(cited - set(P1_ANCHORS))
    assert not unknown, f"add an anchor to P1_ANCHORS for {unknown}"
    wrong = [n for n in sorted(cited) if P1_ANCHORS[n] not in _line("P1", n)]
    assert not wrong, f"Part 1 lines that no longer hold their anchor: {wrong}"


# "Lnnnnn ('quote')" in the extraction notes of the nodes: the quote is on that
# line or within two lines of it, in one of the three texts. Three quotes are not
# taken from the line they follow (a list heading, a paraphrase, T4.6 wording).
_NOT_FROM_THE_CITED_LINE = {
    "fallback defaults, not prescriptive values",
    "whether the network requires new dedicated shared assets",
    "that the partner is the critical node of a bilateral",
}


def test_quoted_node_citations_point_at_their_quote():
    text = NODES.read_text(encoding="utf-8")
    checked, wrong = 0, []
    for m in re.finditer(r"L0(\d{4})(?:-L0\d{4})? \('([^']{12,})'", text):
        n, quote = int(m.group(1)), m.group(2)
        if any(quote.startswith(q) for q in _NOT_FROM_THE_CITED_LINE):
            continue
        head = _norm(quote.split("...")[0])[:45]
        near = range(max(1, n - 2), n + 3)
        if not any(head in _line(doc, k) for doc in FILES for k in near):
            wrong.append(f"L{n:05d} '{quote[:50]}'")
        checked += 1
    assert checked > 40
    assert not wrong, f"quoted citations not found at their line: {wrong}"
