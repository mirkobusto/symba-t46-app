"""Metadata guards on phase1_nodes.json (not behaviour)."""
from __future__ import annotations

import re


def test_renumbered_source_sections_keep_the_old_reference(schemas):
    """Audit I-15: 63 nodes (56 LCA, 7 LCC) were renumbered to the REVISED
    deliverables; each keeps the number the 2026-05-08 extraction cited."""
    renumbered = [n for n in schemas.phase1_nodes
                  if "renumbered to the REVISED" in (n.get("extraction_notes") or "")]
    assert len(renumbered) == 63
    for n in renumbered:
        assert n["source_section"].split(" §")[0] in {"D4.1", "D4.2"}
        old = re.search(r"cited (.+?)\);", n["extraction_notes"]).group(1)
        assert old != n["source_section"]   # the note holds the number it had, not the new one
