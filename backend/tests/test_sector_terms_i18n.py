"""frontend/src/i18n/sectorTerms.json carries the translations of the D4.1 Part 2
sector rules, notes and substituted products. Its `en` block must copy the
overlays verbatim, so a change in sector_overlays.json fails here until the
translations are reviewed; every language must have every key."""
from __future__ import annotations

import json
from pathlib import Path

TERMS = Path(__file__).resolve().parents[2] / "frontend/src/i18n/sectorTerms.json"


def test_english_copy_matches_the_overlays(schemas):
    terms = json.loads(TERMS.read_text())
    overlays = schemas.sector_overlays["overlays"].values()
    rules = {r["id"]: r for o in overlays for r in o["rules"]}
    assert terms["en"]["rules"] == {i: r["statement"] for i, r in rules.items()}
    assert terms["en"]["substitutes"] == {c["id"]: c["substitutes"] for o in overlays for c in o["configurations"]}
    for owner, ids in terms["note_owners"].items():
        assert terms["en"]["notes"][owner] == rules[owner]["note"]
        assert all(rules[i]["note"] == rules[owner]["note"] for i in ids)
    assert {i for ids in terms["note_owners"].values() for i in ids} == {i for i, r in rules.items() if r.get("note")}


def test_every_language_has_every_key():
    terms = json.loads(TERMS.read_text())
    for lang in ("it", "fr", "de", "es"):
        for group in ("rules", "notes", "substitutes"):
            assert set(terms[lang][group]) == set(terms["en"][group]), (lang, group)
            assert all(v.strip() for v in terms[lang][group].values())
