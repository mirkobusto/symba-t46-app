"""Metadata guards on phase1_nodes.json (not behaviour)."""
from __future__ import annotations

import re


def test_renumbered_source_sections_keep_the_old_reference(schemas):
    """Audit I-15: 69 nodes (56 LCA, 13 LCC) were renumbered to the REVISED
    deliverables; each keeps the number the 2026-05-08 extraction cited."""
    renumbered = [n for n in schemas.phase1_nodes
                  if "renumbered to the REVISED" in (n.get("extraction_notes") or "")]
    assert len(renumbered) == 69
    for n in renumbered:
        assert n["source_section"].split(" §")[0] in {"D4.1", "D4.2"}
        old = re.search(r"cited (.+?)\);", n["extraction_notes"]).group(1)
        assert old != n["source_section"]   # the note holds the number it had, not the new one


def test_source_sections_follow_the_final_v2_numbering(schemas):
    """Review 2026-10-15: 65 nodes (57 LCA, 8 LCC) point at the FINAL v2 deliverables.
    Each note keeps the section it cited before; lca_mc_06 and lca_mc_23 have no basis in
    the text and keep their old number until they are reformulated."""
    nodes = {n["id"]: n for n in schemas.phase1_nodes}
    moved = [n for n in nodes.values()
             if "FINAL v2 numbering, review 2026-10-15" in (n.get("extraction_notes") or "")]
    assert len(moved) == 65
    assert sum(n["method"] == "LCA" for n in moved) == 57
    for n in moved:
        old = re.search(r"FINAL v2 numbering, review 2026-10-15 \(was (.+?)\)", n["extraction_notes"]).group(1)
        assert old != n["source_section"]
        assert n["source_section"].split(" §")[0] in {"D4.1", "D4.2"}
    # one plain shift and the moves made on content in the node review
    assert nodes["lca_t1"]["source_section"] == "D4.1 §4.2.3"
    assert nodes["lca_mc_25"]["source_section"] == "D4.1 §12.3.3"
    assert nodes["lca_mc_03"]["source_section"] == "D4.1 §14.3.2"
    assert nodes["lcc_hc_22"]["source_section"] == "D4.2 §9.3"
    assert nodes["lca_mc_06"]["source_section"] == "D4.1 §4.2"
    assert nodes["lca_mc_23"]["source_section"] == "D4.1 §5.5"
