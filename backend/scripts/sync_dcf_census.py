"""Keep coordination/dcf_mandates_census.json in step with phase1_nodes.json.

The DCF takes the statement, trigger and source section of every procedural
mandate from this census, not from the schema (engine/dcf_compose.py), so a
change to a procedural_mandate node does not reach the Data Collection File
until the census is refreshed. The census was first generated once, by keyword
match, from the nodes with field_status=procedural_mandate.

For every such node (L0 excluded) this refreshes the node-derived keys of its
census item (method, type, lifecycle_layer, source_section, trigger_q,
trigger_condition, statement) and keeps its bucket and keyword data. A node that
is not in the census yet needs `--assign <id>=<bucket>`; an item whose node is no
longer a procedural mandate is dropped. `meta.total_procedural_mandates` is
recomputed. Dry run unless --apply; exits 1 if the census is out of date.

Usage:
    cd backend && PYTHONPATH=. python scripts/sync_dcf_census.py            # check
    cd backend && PYTHONPATH=. python scripts/sync_dcf_census.py --apply [--assign lcc_hc_06=uncertainty_sensitivity]
"""
from __future__ import annotations

import copy
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NODES = ROOT / "app" / "schemas" / "phase1_nodes.json"
CENSUS = ROOT / "coordination" / "dcf_mandates_census.json"


def _statement(node: dict) -> str:
    """The text the DCF shows: the node's value, or for a node that picks among
    several values (a dict) the values joined with ' | ', as the census had them."""
    value = node["default_value"]
    return value if isinstance(value, str) else " | ".join(str(v) for v in value.values())


def _item_from(node: dict) -> dict:
    return {
        "id": node["id"],
        "method": node["method"],
        "type": node["type"],
        "lifecycle_layer": node["lifecycle_layer"],
        "source_section": node["source_section"],
        "trigger_q": node["trigger_q"],
        "trigger_condition": node["trigger_condition"],
        "statement": _statement(node),
    }


def sync(census: dict, nodes: list[dict], assign: dict[str, str]) -> tuple[dict, list[str]]:
    """Return (new census, human-readable list of changes). The input is not modified."""
    census = copy.deepcopy(census)
    procedural = {n["id"]: n for n in nodes
                  if n.get("field_status") == "procedural_mandate" and n.get("lifecycle_layer") != "L0"}
    changes: list[str] = []
    seen: set[str] = set()
    for bucket, items in census["buckets"].items():
        kept = []
        for item in items:
            node = procedural.get(item["id"])
            if node is None:
                changes.append(f"drop {item['id']} (no longer a procedural mandate)")
                continue
            seen.add(item["id"])
            fresh = _item_from(node)
            updated = {**item, **{k: v for k, v in fresh.items()}}
            if updated != item:
                diff = [k for k in fresh if item.get(k) != fresh[k]]
                changes.append(f"update {item['id']}: {', '.join(diff)}")
            kept.append(updated)
        census["buckets"][bucket] = kept
    for nid, node in procedural.items():
        if nid in seen:
            continue
        bucket = assign.get(nid)
        if bucket is None or bucket not in census["buckets"]:
            raise SystemExit(f"{nid} is a procedural mandate missing from the census: "
                             f"pass --assign {nid}=<bucket> (one of {sorted(census['buckets'])})")
        census["buckets"][bucket].append({**_item_from(node), "all_matched_categories": [bucket],
                                          "matched_keywords": []})
        changes.append(f"add {nid} to {bucket}")
    total = sum(len(v) for v in census["buckets"].values())
    if census["meta"]["total_procedural_mandates"] != total:
        changes.append(f"total {census['meta']['total_procedural_mandates']} -> {total}")
        census["meta"]["total_procedural_mandates"] = total
    return census, changes


def dump(census: dict) -> str:
    return json.dumps(census, indent=2)   # ASCII-escaped, no trailing newline: as generated


def main(argv: list[str]) -> int:
    assign = {}
    for i, a in enumerate(argv):
        if a == "--assign":
            k, _, v = argv[i + 1].partition("=")
            assign[k] = v
    nodes = json.loads(NODES.read_text(encoding="utf-8"))["nodes"]
    census = json.loads(CENSUS.read_text(encoding="utf-8"))
    new, changes = sync(census, nodes, assign)
    for c in changes:
        print(" ", c)
    print(f"{len(changes)} change(s)")
    if "--apply" in argv:
        CENSUS.write_text(dump(new), encoding="utf-8")
        print("written")
        return 0
    return 1 if changes else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
