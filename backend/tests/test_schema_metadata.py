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
    Each note keeps the section it cited before; lca_mc_06 and lca_mc_23 had no basis in
    the text and were reformulated on 2026-10-15 (see the test below)."""
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
    assert nodes["lca_mc_06"]["source_section"] == "D4.1 §11.3.1"   # was D4.1 §4.2, no basis
    assert nodes["lca_mc_23"]["source_section"] == "D4.1 §6"        # was D4.1 §5.5, T4.6 choice


def test_nodes_rewritten_on_the_final_v2_text_keep_their_lines(schemas):
    """Phase A of the FINAL v2 review (2026-10-15): a node rewritten on the text names
    its section in the value and the FINAL v2 lines in the note, so a later change to the
    deliverables shows which nodes to realign."""
    nodes = {n["id"]: n for n in schemas.phase1_nodes}
    rewritten = [n for n in nodes.values()
                 if "Rewritten on FINAL v2 text" in (n.get("extraction_notes") or "")]
    assert {n["id"] for n in rewritten} >= {
        "lca_hc_19", "lca_mc_31",                                        # PR #123
        "lcc_mc_03", "lcc_mc_04", "lcc_mc_08", "lcc_mc_16", "lcc_mc_18",  # PR #124
        "lca_mc_05", "lca_mc_06", "lca_mc_23", "lca_mc_27", "lcc_mc_05",  # PR #125
        "lca_hc_08", "lca_mc_29", "lca_mc_35", "lca_mc_36",                # design-choice nodes
        "lcc_hc_06", "lcc_hc_13", "lcc_hc_38", "lcc_mc_19",
    }
    for n in rewritten:
        assert re.search(r"L\d{5}", n["extraction_notes"].split("Rewritten on FINAL v2 text")[1])
        values = n["default_value"] if isinstance(n["default_value"], dict) else {"": n["default_value"]}
        # every sentence cites the section; a token such as "aligned_to_lca" cannot
        assert all(n["source_section"] in v for v in values.values() if v and " " in v)

    # D4.1 §10.3.5 L01214-L01222: four categories, iLUC among them, biodiversity not
    frontier = nodes["lca_hc_19"]["default_value"]
    for category in ("marine litter", "soil carbon", "iLUC", "fibre shedding"):
        assert category in frontier
    assert "Biodiversity loss is not one of the four" in frontier
    # D4.1 §15.1 L01539: a single aggregated result is insufficient
    levels = nodes["lca_mc_31"]["default_value"]
    assert "three levels" in levels and "preferred" not in levels
