#!/usr/bin/env python3
"""validate_phase1_artifacts.py

Validates `phase1_nodes.json` and `cross_method_rules.json` for structural integrity,
schema consistency, and cross-reference correctness against the SYMBA T4.6 design
documents.

Field references in cross-method rules are classified into 4 categories using
schema files loaded from --schema-dir:
    node       -> set by a Phase 1 node (primary field or additional_fields[].field)
    system     -> declared in system_fields.json (engine-level state)
    computed   -> declared in computed_fields.json (pipeline-derived)
    cir_output -> declared in cir_output_fields.json (CIR action side-effect)
    UNKNOWN    -> NOT in any of the above; this is a bug.

Exit codes:
    0  no critical issues AND no UNKNOWN fields (warnings may exist for soft items)
    1  critical issues OR UNKNOWN fields found (fix before proceeding to backend ingestion)

Usage:
    python validate_phase1_artifacts.py [--schema-dir DIR] [--out-dir DIR]

Default DIRs: --schema-dir = . (current working dir), --out-dir = ./validation_output

Required schema files in --schema-dir:
    phase1_nodes.json, cross_method_rules.json,
    system_fields.json, computed_fields.json, cir_output_fields.json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path

# =============================================================================
# Architectural invariants (NOT field allowlists — those are loaded from JSON)
# =============================================================================
#
# Field allowlists are now LOADED from schema JSON files at runtime; they are no
# longer hard-coded constants. See `load_field_allowlists()` below.

# Architectural invariants on the rule lifecycle layer (v2 §2):
EXPECTED_LAYER = {
    "blocks": "L1",
    "integration_rules.default": "L2",
    "integration_rules.l3_set": {"IR-04", "IR-10"},
    "conditional_integration_rules": "L2",
    "fu_rules": "L2",
    "boundary_rules": "L2",
    "critical_decision_points": "L3",
}

# v1 §5.4 declares exactly these 11 nodes as per-flow:
EXPECTED_PER_FLOW = {
    "lca_hc_17", "lca_mc_17",
    "lcc_hc_12", "lcc_hc_13", "lcc_hc_34", "lcc_hc_35", "lcc_hc_36", "lcc_hc_38",
    "lcc_mc_04", "lcc_mc_08", "lcc_mc_09",
}

EXPECTED_NODE_COUNTS = {"LCA": 59, "LCC": 61, "SLCA": 66}
EXPECTED_RULE_COUNTS = {
    "blocks": 4,
    "integration_rules": 20,
    "conditional_integration_rules": 10,
    "fu_rules": 5,
    "boundary_rules": 7,
    "critical_decision_points": 12,
}


# =============================================================================
# Finding model
# =============================================================================

@dataclass
class Finding:
    severity: str           # "CRITICAL" | "WARNING" | "INFO"
    check: str              # short identifier (e.g., "node_count")
    message: str
    where: str | None = None        # node id / rule id / global

    def to_dict(self) -> dict:
        return {"severity": self.severity, "check": self.check,
                "where": self.where, "message": self.message}


@dataclass
class Report:
    findings: list[Finding] = field(default_factory=list)
    stats: dict = field(default_factory=dict)
    field_gaps: list[dict] = field(default_factory=list)  # for field_gaps.md

    def add(self, severity: str, check: str, message: str, where: str | None = None) -> None:
        self.findings.append(Finding(severity, check, message, where))

    @property
    def critical_count(self) -> int:
        return sum(1 for f in self.findings if f.severity == "CRITICAL")

    @property
    def warning_count(self) -> int:
        return sum(1 for f in self.findings if f.severity == "WARNING")

    @property
    def info_count(self) -> int:
        return sum(1 for f in self.findings if f.severity == "INFO")


# =============================================================================
# Loaders
# =============================================================================

def load_artifacts(schema_dir: Path) -> tuple[dict, dict, dict, dict, dict]:
    """Load all 5 schema files. Exits if any required file is missing."""
    paths = {
        "nodes": schema_dir / "phase1_nodes.json",
        "rules": schema_dir / "cross_method_rules.json",
        "system": schema_dir / "system_fields.json",
        "computed": schema_dir / "computed_fields.json",
        "cir_output": schema_dir / "cir_output_fields.json",
    }
    for label, p in paths.items():
        if not p.exists():
            sys.exit(f"FATAL: {p.name} not found at {p}")
    docs = {}
    for label, p in paths.items():
        with p.open() as f:
            docs[label] = json.load(f)
    return docs["nodes"], docs["rules"], docs["system"], docs["computed"], docs["cir_output"]


def collect_node_fields(nodes_doc: dict) -> set[str]:
    """Collect ALL fields populated by Phase 1 nodes (primary + additional_fields)."""
    fields = set()
    for n in nodes_doc["nodes"]:
        if n.get("field"):
            fields.add(n["field"])
        for af in n.get("additional_fields", []) or []:
            if af.get("field"):
                fields.add(af["field"])
    return fields


def build_field_allowlists(system_doc: dict, computed_doc: dict, cir_doc: dict
                           ) -> tuple[set[str], set[str], set[str]]:
    """Extract field-name sets from the 3 schema files."""
    system_fields = {entry["field"] for entry in system_doc.get("fields", [])}
    computed_fields = {entry["field"] for entry in computed_doc.get("fields", [])}
    cir_output_fields = {entry["field"] for entry in cir_doc.get("fields", [])}
    return system_fields, computed_fields, cir_output_fields


def validate_field_reference(field_name: str, node_fields: set[str],
                             system_fields: set[str], computed_fields: set[str],
                             cir_output_fields: set[str]) -> str:
    """Classify a field reference into one of: node | system | computed | cir_output | UNKNOWN."""
    if field_name in node_fields:
        return "node"
    if field_name in system_fields:
        return "system"
    if field_name in computed_fields:
        return "computed"
    if field_name in cir_output_fields:
        return "cir_output"
    return "UNKNOWN"


def parse_cir_action_field(action: str) -> str | None:
    """Extract the LHS dotted-path field from a CIR action string like
       'lca.allocation_method = pef_cff'. Returns None if not parseable."""
    m = re.match(r"^\s*([a-z_][a-z0-9_.\[\]*]+)\s*[=+]", action, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return None


# =============================================================================
# Phase 1 node checks
# =============================================================================

def check_phase1_counts(nodes_doc: dict, r: Report) -> None:
    """Total = 186 = 59 LCA + 61 LCC + 66 S-LCA."""
    nodes = nodes_doc["nodes"]
    if len(nodes) != 186:
        r.add("CRITICAL", "node_total_count",
              f"Expected 186 nodes, got {len(nodes)}", where="phase1_nodes.json")
    else:
        r.add("INFO", "node_total_count", f"186 nodes total ✓")
    by_method = Counter(n["method"] for n in nodes)
    for method, expected in EXPECTED_NODE_COUNTS.items():
        actual = by_method.get(method, 0)
        if actual != expected:
            r.add("CRITICAL", "node_method_count",
                  f"{method}: expected {expected} got {actual}", where="phase1_nodes.json")
        else:
            r.add("INFO", "node_method_count", f"{method}: {actual} ✓")


def check_phase1_id_uniqueness(nodes_doc: dict, r: Report) -> None:
    ids = [n["id"] for n in nodes_doc["nodes"]]
    dups = [i for i, c in Counter(ids).items() if c > 1]
    if dups:
        r.add("CRITICAL", "node_id_uniqueness",
              f"Duplicate IDs: {dups}", where="phase1_nodes.json")
    else:
        r.add("INFO", "node_id_uniqueness", f"All {len(ids)} IDs unique ✓")


def check_phase1_id_convention(nodes_doc: dict, r: Report) -> None:
    """IDs match lowercase snake_case with method prefix."""
    import re
    pattern = re.compile(r"^(lca|lcc|slca)_(t1|trig_01|t_01|hc_\d{2}|mc_\d{2})$")
    bad = [n["id"] for n in nodes_doc["nodes"] if not pattern.match(n["id"])]
    if bad:
        r.add("CRITICAL", "node_id_convention",
              f"IDs not matching convention: {bad}", where="phase1_nodes.json")
    else:
        r.add("INFO", "node_id_convention", "All IDs match convention ✓")


def check_phase1_category_consistency(nodes_doc: dict, r: Report) -> None:
    """DEFAULT -> trigger_q is null; DERIVED -> trigger_q non-empty."""
    bad = []
    for n in nodes_doc["nodes"]:
        if n["category"] == "DEFAULT" and n["trigger_q"] is not None:
            bad.append(f"{n['id']}: DEFAULT but trigger_q={n['trigger_q']}")
        if n["category"] == "DERIVED" and (n["trigger_q"] is None or len(n["trigger_q"]) == 0):
            bad.append(f"{n['id']}: DERIVED but trigger_q empty/null")
    if bad:
        for b in bad:
            r.add("CRITICAL", "node_category_consistency", b, where="phase1_nodes.json")
    else:
        r.add("INFO", "node_category_consistency", "DEFAULT/DERIVED pattern consistent ✓")


def check_phase1_lifecycle_layer(nodes_doc: dict, r: Report) -> None:
    """Trigger -> L0; HC/MC -> L2."""
    bad = []
    for n in nodes_doc["nodes"]:
        if n["type"] == "Trigger" and n["lifecycle_layer"] != "L0":
            bad.append(f"{n['id']}: Trigger but layer={n['lifecycle_layer']}")
        if n["type"] in {"HC", "MC"} and n["lifecycle_layer"] != "L2":
            bad.append(f"{n['id']}: {n['type']} but layer={n['lifecycle_layer']}")
    if bad:
        for b in bad:
            r.add("CRITICAL", "node_lifecycle_layer", b, where="phase1_nodes.json")
    else:
        r.add("INFO", "node_lifecycle_layer", "Trigger=L0, HC/MC=L2 ✓")


def check_phase1_simple_logic_has_condition(nodes_doc: dict, r: Report) -> None:
    """trigger_logic='simple' must have non-null trigger_condition."""
    bad = [n["id"] for n in nodes_doc["nodes"]
           if n["trigger_logic"] == "simple" and n["trigger_condition"] is None]
    if bad:
        for b in bad:
            r.add("CRITICAL", "node_simple_logic_orphan",
                  f"{b}: trigger_logic='simple' but trigger_condition is null", where="phase1_nodes.json")
    else:
        r.add("INFO", "node_simple_logic_orphan",
              "All simple-logic nodes have populated trigger_condition ✓")


def check_phase1_field_status_consistency(nodes_doc: dict, r: Report) -> None:
    """field xor field_status: exactly one of them is null."""
    bad = []
    for n in nodes_doc["nodes"]:
        if n["field"] is not None and n["field_status"] is not None:
            bad.append(f"{n['id']}: BOTH field and field_status set")
        if n["field"] is None and n["field_status"] is None:
            bad.append(f"{n['id']}: NEITHER field nor field_status set")
    if bad:
        for b in bad:
            r.add("CRITICAL", "node_field_status_consistency", b, where="phase1_nodes.json")
    else:
        r.add("INFO", "node_field_status_consistency", "field XOR field_status ✓")


def check_phase1_per_flow(nodes_doc: dict, r: Report) -> None:
    """Per-flow nodes match exactly the v1 §5.4 list (11 nodes)."""
    found = {n["id"] for n in nodes_doc["nodes"] if n.get("per_flow")}
    if found != EXPECTED_PER_FLOW:
        missing = EXPECTED_PER_FLOW - found
        extra = found - EXPECTED_PER_FLOW
        if missing:
            r.add("CRITICAL", "node_per_flow_set",
                  f"per_flow nodes missing: {sorted(missing)}", where="phase1_nodes.json")
        if extra:
            r.add("CRITICAL", "node_per_flow_set",
                  f"per_flow nodes unexpected: {sorted(extra)}", where="phase1_nodes.json")
    else:
        r.add("INFO", "node_per_flow_set",
              f"Per-flow set matches v1 §5.4 (11 nodes) ✓")


# =============================================================================
# Cross-method rule checks
# =============================================================================

def check_rule_counts(rules_doc: dict, r: Report) -> None:
    """Counts per category match expected."""
    for cat, expected in EXPECTED_RULE_COUNTS.items():
        actual = len(rules_doc.get(cat, []))
        if actual != expected:
            r.add("CRITICAL", "rule_count",
                  f"{cat}: expected {expected} got {actual}", where="cross_method_rules.json")
        else:
            r.add("INFO", "rule_count", f"{cat}: {actual} ✓")


def check_rule_id_uniqueness(rules_doc: dict, r: Report) -> None:
    all_ids = []
    for cat in EXPECTED_RULE_COUNTS:
        for rule in rules_doc.get(cat, []):
            all_ids.append(rule["id"])
    dups = [i for i, c in Counter(all_ids).items() if c > 1]
    if dups:
        r.add("CRITICAL", "rule_id_uniqueness",
              f"Duplicate rule IDs: {dups}", where="cross_method_rules.json")
    else:
        r.add("INFO", "rule_id_uniqueness", f"All {len(all_ids)} rule IDs unique ✓")


def check_rule_id_convention(rules_doc: dict, r: Report) -> None:
    """Rule IDs match Kimi convention (IR-XX, CIR-XX, FU-XX, B-XX, CDP-XX, block_*)."""
    import re
    patterns = {
        "blocks": re.compile(r"^block_[A-Za-z0-9_+\-]+$"),
        "integration_rules": re.compile(r"^IR-\d{2}$"),
        "conditional_integration_rules": re.compile(r"^CIR-\d{2}$"),
        "fu_rules": re.compile(r"^FU-\d{2}$"),
        "boundary_rules": re.compile(r"^B-\d{2}$"),
        "critical_decision_points": re.compile(r"^CDP-\d{2}$"),
    }
    for cat, pat in patterns.items():
        for rule in rules_doc.get(cat, []):
            if not pat.match(rule["id"]):
                r.add("CRITICAL", "rule_id_convention",
                      f"{rule['id']}: doesn't match {pat.pattern}", where=cat)
    if not any(f.check == "rule_id_convention" and f.severity == "CRITICAL" for f in r.findings):
        r.add("INFO", "rule_id_convention", "All rule IDs match Kimi convention ✓")


def check_rule_lifecycle_layer(rules_doc: dict, r: Report) -> None:
    """L1=BLOCKs, L2=IR(except 04/10)+CIR+FU+B, L3=IR-04+IR-10+CDPs."""
    # BLOCKs -> L1
    for rule in rules_doc.get("blocks", []):
        if rule.get("lifecycle_layer") != "L1":
            r.add("CRITICAL", "rule_layer_l1",
                  f"{rule['id']}: BLOCK should be L1, got {rule.get('lifecycle_layer')}", where="blocks")
    # IRs -> mostly L2, IR-04/IR-10 -> L3
    for rule in rules_doc.get("integration_rules", []):
        expected = "L3" if rule["id"] in EXPECTED_LAYER["integration_rules.l3_set"] else "L2"
        if rule.get("lifecycle_layer") != expected:
            r.add("CRITICAL", "rule_layer_ir",
                  f"{rule['id']}: expected {expected} got {rule.get('lifecycle_layer')}",
                  where="integration_rules")
    # CIR/FU/B -> L2
    for cat in ("conditional_integration_rules", "fu_rules", "boundary_rules"):
        for rule in rules_doc.get(cat, []):
            if rule.get("lifecycle_layer") != "L2":
                r.add("CRITICAL", "rule_layer_l2",
                      f"{rule['id']}: should be L2, got {rule.get('lifecycle_layer')}", where=cat)
    # CDPs -> L3
    for rule in rules_doc.get("critical_decision_points", []):
        if rule.get("lifecycle_layer") != "L3":
            r.add("CRITICAL", "rule_layer_l3",
                  f"{rule['id']}: CDP should be L3, got {rule.get('lifecycle_layer')}",
                  where="critical_decision_points")
    if not any(f.check.startswith("rule_layer_") and f.severity == "CRITICAL" for f in r.findings):
        r.add("INFO", "rule_layer", "Lifecycle layers match v2 §2 architectural invariants ✓")


def check_rule_schema_completeness(rules_doc: dict, r: Report) -> None:
    """Each rule type has required fields."""
    schema = {
        "blocks": {"id", "lifecycle_layer", "trigger_condition", "user_message", "action_on_violation"},
        "integration_rules": {"id", "name", "lifecycle_layer", "trigger_condition", "assertion",
                              "fields", "source_nodes", "violation_message"},
        "conditional_integration_rules": {"id", "name", "lifecycle_layer",
                                          "trigger_condition", "actions", "source_nodes"},
        "fu_rules": {"id", "name", "lifecycle_layer", "trigger_condition",
                     "assertion", "fields", "source_nodes", "violation_message"},
        "boundary_rules": {"id", "name", "lifecycle_layer", "trigger_condition",
                           "assertion", "fields", "source_nodes", "violation_message"},
        "critical_decision_points": {"id", "name", "lifecycle_layer", "tension", "severity",
                                     "methods", "resolution_at_l3", "related_rules"},
    }
    issues_count = 0
    for cat, required in schema.items():
        for rule in rules_doc.get(cat, []):
            missing = required - set(rule.keys())
            if missing:
                issues_count += 1
                r.add("CRITICAL", "rule_schema_completeness",
                      f"{rule['id']}: missing fields {sorted(missing)}", where=cat)
    if issues_count == 0:
        r.add("INFO", "rule_schema_completeness", "All rules have required fields ✓")


def check_source_nodes_resolve(nodes_doc: dict, rules_doc: dict, r: Report) -> None:
    """Every source_nodes ref resolves to a real Phase 1 node ID."""
    valid_ids = {n["id"] for n in nodes_doc["nodes"]}
    invalid = []
    total = 0
    for cat in EXPECTED_RULE_COUNTS:
        for rule in rules_doc.get(cat, []):
            for ref in rule.get("source_nodes", []):
                total += 1
                if ref not in valid_ids:
                    invalid.append((rule["id"], ref))
    if invalid:
        for rid, ref in invalid:
            r.add("CRITICAL", "source_nodes_resolve",
                  f"{rid} -> {ref}: not in phase1_nodes", where="cross_method_rules.json")
    else:
        r.add("INFO", "source_nodes_resolve",
              f"{total}/{total} source_nodes references resolve to valid Phase 1 IDs ✓")


def check_related_rules_resolve(rules_doc: dict, r: Report) -> None:
    """CDP related_rules refs resolve to valid rule IDs."""
    valid_rule_ids = set()
    for cat in EXPECTED_RULE_COUNTS:
        for rule in rules_doc.get(cat, []):
            valid_rule_ids.add(rule["id"])
    invalid = []
    for cdp in rules_doc.get("critical_decision_points", []):
        for ref in cdp.get("related_rules", []):
            if ref not in valid_rule_ids:
                invalid.append((cdp["id"], ref))
    if invalid:
        for cid, ref in invalid:
            r.add("CRITICAL", "related_rules_resolve",
                  f"{cid} related_rules -> {ref}: not a valid rule ID",
                  where="critical_decision_points")
    else:
        r.add("INFO", "related_rules_resolve",
              "All CDP related_rules references resolve ✓")


# =============================================================================
# Field cross-check (the core deliverable)
# =============================================================================

def cross_check_fields(nodes_doc: dict, rules_doc: dict,
                       system_fields: set[str], computed_fields: set[str],
                       cir_output_fields: set[str], r: Report) -> None:
    """Classify every field referenced in rules into 5 categories:
       node | system | computed | cir_output | UNKNOWN.

       UNKNOWN is treated as CRITICAL (this is what real bugs look like).
       Targets ZERO unknown post-bugfix per Mirko's spec.
    """
    node_fields = collect_node_fields(nodes_doc)

    # Collect (rule_id, field, source_kind) tuples across all rule categories.
    # source_kind: 'fields_list' | 'cir_action_lhs'
    rule_field_refs: dict[str, list[tuple[str, str]]] = defaultdict(list)

    for cat in ("integration_rules", "fu_rules", "boundary_rules"):
        for rule in rules_doc.get(cat, []):
            for f in rule.get("fields", []):
                rule_field_refs[f].append((rule["id"], "fields_list"))

    # CIR rules use 'actions' instead of 'fields' — parse LHS field names
    for rule in rules_doc.get("conditional_integration_rules", []):
        for action in rule.get("actions", []):
            lhs = parse_cir_action_field(action)
            if lhs:
                rule_field_refs[lhs].append((rule["id"], "cir_action_lhs"))

    classification: dict[str, dict[str, list[tuple[str, str]]]] = {
        "node": {}, "system": {}, "computed": {}, "cir_output": {}, "unknown": {},
    }
    for f, used_by in rule_field_refs.items():
        cat = validate_field_reference(f, node_fields, system_fields,
                                       computed_fields, cir_output_fields)
        bucket = "unknown" if cat == "UNKNOWN" else cat
        classification[bucket][f] = used_by

    total = sum(len(v) for v in classification.values())
    r.stats["field_classification"] = {
        "total_distinct_fields_in_rules": total,
        "resolved_to_phase1_node": len(classification["node"]),
        "system_fields_allowlist": len(classification["system"]),
        "computed_fields_allowlist": len(classification["computed"]),
        "cir_output_fields_allowlist": len(classification["cir_output"]),
        "unknown": len(classification["unknown"]),
    }
    r.stats["field_classification_detail"] = {
        cat: {f: [list(t) for t in users] for f, users in items.items()}
        for cat, items in classification.items()
    }

    # UNKNOWN are CRITICAL bugs (target: zero)
    if classification["unknown"]:
        for f, users in sorted(classification["unknown"].items()):
            user_ids = sorted({rid for rid, _ in users})
            r.add("CRITICAL", "field_unknown",
                  f"{f} (used by {user_ids}): not in node_fields / system / computed / cir_output. "
                  f"Bug — fix the rule's field name OR add the field to the appropriate allowlist.",
                  where="cross_method_rules.json")
            r.field_gaps.append({
                "field": f,
                "used_by": user_ids,
                "diagnosis": _diagnose_gap(f),
            })
    else:
        r.add("INFO", "field_unknown", "ZERO unknown fields ✓ (all references classified)")

    r.add("INFO", "field_classification_summary",
          f"Field references: {len(classification['node'])} node + "
          f"{len(classification['system'])} system + "
          f"{len(classification['computed'])} computed + "
          f"{len(classification['cir_output'])} cir_output + "
          f"{len(classification['unknown'])} UNKNOWN = {total} total")


def _diagnose_gap(field_name: str) -> str:
    """Heuristic diagnosis for field_gaps.md."""
    if field_name in {"lcc.reference_scenario", "slca.reference_scenario"}:
        return ("v2 §8 declares lca.reference_scenario but NOT the LCC/SLCA equivalents. "
                "Asymmetric. Resolution: either declare in §8.2/§8.3 + assign to a Phase 1 "
                "node (lcc_hc_11 / slca_hc_37 are the natural candidates), or rewrite the "
                "rules to reference the asserted-aligned LCA field.")
    if "amortization_period" in field_name:
        return ("Declared in v2 §8 but no Phase 1 node sets it. lca_hc_18 / lcc_hc_07 "
                "(capital_goods.included) are the natural assignees but their default_value "
                "describes inclusion not period. Resolution: either add a sub-field on those "
                "nodes (extending default_value to dict), or split into two nodes "
                "(included + amortization_period), or remove from §8 if not Phase 1 scope.")
    if field_name == "lca.system_boundary_physical":
        return ("Declared in v2 §8.1 but no Phase 1 node sets it. v2 §4.1 IR-02 references it. "
                "Likely should be a derived sub-field of lca.system_boundary (set by lca_mc_05 "
                "when q1=A/B/etc.). Resolution: either declare derivation rule (boundary_physical "
                "is the gate-to-gate restriction of system_boundary), or assign to a new Phase 1 "
                "node, or rewrite IR-02 to compare on lca.system_boundary directly.")
    return "No automatic diagnosis. Manual review required."


# =============================================================================
# Reporters
# =============================================================================

def write_markdown_report(r: Report, out_path: Path) -> None:
    sev_emoji = {"CRITICAL": "❌", "WARNING": "⚠️ ", "INFO": "✅"}
    lines = []
    lines.append("# Phase 1 Artifacts — Validation Report\n")
    lines.append(f"**Critical issues**: {r.critical_count} | "
                 f"**Warnings**: {r.warning_count} | "
                 f"**Info checks passed**: {r.info_count}\n")
    if r.critical_count == 0:
        lines.append("**Overall status**: ✅ **PASS** (no critical issues; warnings may exist)\n")
    else:
        lines.append("**Overall status**: ❌ **FAIL** (critical issues block backend ingestion)\n")

    if "field_classification" in r.stats:
        fc = r.stats["field_classification"]
        lines.append("\n## Field classification summary\n")
        lines.append(f"- Total distinct field references in rules: **{fc['total_distinct_fields_in_rules']}**")
        lines.append(f"- Resolved to Phase 1 node field: **{fc['resolved_to_phase1_node']}**")
        lines.append(f"- system_fields.json (governance/system/charter/review/study/report): **{fc['system_fields_allowlist']}**")
        lines.append(f"- computed_fields.json (calculation_order/analytical_levels/classifications/derived booleans): **{fc['computed_fields_allowlist']}**")
        lines.append(f"- cir_output_fields.json (CIR action side-effects): **{fc['cir_output_fields_allowlist']}**")
        lines.append(f"- **UNKNOWN** (real bugs → field_gaps.md): **{fc['unknown']}**")

    by_sev = {"CRITICAL": [], "WARNING": [], "INFO": []}
    for f in r.findings:
        by_sev[f.severity].append(f)
    for sev in ("CRITICAL", "WARNING", "INFO"):
        if not by_sev[sev]:
            continue
        lines.append(f"\n## {sev_emoji[sev]} {sev} findings ({len(by_sev[sev])})\n")
        by_check = defaultdict(list)
        for f in by_sev[sev]:
            by_check[f.check].append(f)
        for check, items in by_check.items():
            lines.append(f"\n### `{check}` — {len(items)} item(s)\n")
            for f in items:
                where = f" `[{f.where}]`" if f.where else ""
                lines.append(f"- {f.message}{where}")

    out_path.write_text("\n".join(lines) + "\n")


def write_json_report(r: Report, out_path: Path) -> None:
    payload = {
        "summary": {
            "critical": r.critical_count,
            "warning": r.warning_count,
            "info": r.info_count,
            "status": "PASS" if r.critical_count == 0 else "FAIL",
        },
        "stats": r.stats,
        "findings": [f.to_dict() for f in r.findings],
    }
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")


def write_field_gaps_md(r: Report, out_path: Path,
                        system_fields: set[str], computed_fields: set[str],
                        cir_output_fields: set[str]) -> None:
    lines = []
    lines.append("# field_gaps.md — UNKNOWN field references in cross-method rules\n")
    lines.append("Generated by `validate_phase1_artifacts.py`. ")
    lines.append("These are field references in cross-method rules that resolve to ")
    lines.append("**neither a Phase 1 node, nor system_fields.json, nor computed_fields.json, ")
    lines.append("nor cir_output_fields.json**. Each is a real bug — fix the rule's field ")
    lines.append("name OR add the field to the appropriate allowlist.\n")
    if not r.field_gaps:
        lines.append("**ZERO unknown.** All field references successfully classified.\n")
    else:
        lines.append(f"**{len(r.field_gaps)} unknown field(s) — bugs to fix.**\n")
        lines.append("\n## Unknown fields\n")
        for i, gap in enumerate(r.field_gaps, 1):
            lines.append(f"\n### {i}. `{gap['field']}`\n")
            lines.append(f"- **Used by**: {', '.join(gap['used_by'])}")
            lines.append(f"- **Diagnosis**: {gap['diagnosis']}")
            lines.append(f"- **Resolution**: _to be filled by Mirko_")
    lines.append("\n---\n")
    lines.append("\n## Allowlists loaded by the validator\n")
    lines.append(f"\n### system_fields.json ({len(system_fields)})\n")
    for f in sorted(system_fields):
        lines.append(f"- `{f}`")
    lines.append(f"\n### computed_fields.json ({len(computed_fields)})\n")
    for f in sorted(computed_fields):
        lines.append(f"- `{f}`")
    lines.append(f"\n### cir_output_fields.json ({len(cir_output_fields)})\n")
    for f in sorted(cir_output_fields):
        lines.append(f"- `{f}`")
    out_path.write_text("\n".join(lines) + "\n")


def print_console_summary(r: Report) -> None:
    print("=" * 70)
    print("Phase 1 Artifacts — Validation")
    print("=" * 70)
    print(f"  Critical: {r.critical_count}")
    print(f"  Warning:  {r.warning_count}")
    print(f"  Info:     {r.info_count}")
    if "field_classification" in r.stats:
        fc = r.stats["field_classification"]
        print()
        print("Field classification:")
        print(f"  node:       {fc['resolved_to_phase1_node']}")
        print(f"  system:     {fc['system_fields_allowlist']}")
        print(f"  computed:   {fc['computed_fields_allowlist']}")
        print(f"  cir_output: {fc['cir_output_fields_allowlist']}")
        print(f"  UNKNOWN:    {fc['unknown']}")
    print()
    if r.critical_count > 0:
        print("STATUS: FAIL")
        for f in r.findings:
            if f.severity == "CRITICAL":
                w = f" [{f.where}]" if f.where else ""
                print(f"  ❌ {f.check}: {f.message}{w}")
    else:
        print("STATUS: PASS")
    print("=" * 70)


# =============================================================================
# Main
# =============================================================================

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--schema-dir", type=Path, default=Path("."),
                        help="Directory containing the 5 schema JSON files")
    parser.add_argument("--out-dir", type=Path, default=Path("./validation_output"),
                        help="Directory to write reports (validation_report.md / .json + field_gaps.md)")
    args = parser.parse_args()

    nodes_doc, rules_doc, system_doc, computed_doc, cir_doc = load_artifacts(args.schema_dir)
    system_fields, computed_fields, cir_output_fields = build_field_allowlists(
        system_doc, computed_doc, cir_doc)

    r = Report()
    r.stats["allowlist_sizes"] = {
        "system_fields_loaded": len(system_fields),
        "computed_fields_loaded": len(computed_fields),
        "cir_output_fields_loaded": len(cir_output_fields),
    }

    # Phase 1 node checks
    check_phase1_counts(nodes_doc, r)
    check_phase1_id_uniqueness(nodes_doc, r)
    check_phase1_id_convention(nodes_doc, r)
    check_phase1_category_consistency(nodes_doc, r)
    check_phase1_lifecycle_layer(nodes_doc, r)
    check_phase1_simple_logic_has_condition(nodes_doc, r)
    check_phase1_field_status_consistency(nodes_doc, r)
    check_phase1_per_flow(nodes_doc, r)

    # Rule checks
    check_rule_counts(rules_doc, r)
    check_rule_id_uniqueness(rules_doc, r)
    check_rule_id_convention(rules_doc, r)
    check_rule_lifecycle_layer(rules_doc, r)
    check_rule_schema_completeness(rules_doc, r)
    check_source_nodes_resolve(nodes_doc, rules_doc, r)
    check_related_rules_resolve(rules_doc, r)

    # Field cross-check (the core deliverable, now with 4-dict dispatch)
    cross_check_fields(nodes_doc, rules_doc, system_fields, computed_fields,
                       cir_output_fields, r)

    # Reports
    args.out_dir.mkdir(parents=True, exist_ok=True)
    write_markdown_report(r, args.out_dir / "validation_report.md")
    write_json_report(r, args.out_dir / "validation_report.json")
    write_field_gaps_md(r, args.out_dir / "field_gaps.md", system_fields,
                        computed_fields, cir_output_fields)

    print_console_summary(r)
    print(f"\nReports written to: {args.out_dir}/")
    print(f"  - validation_report.md")
    print(f"  - validation_report.json")
    print(f"  - field_gaps.md ({len(r.field_gaps)} unknown field(s))")

    return 1 if r.critical_count > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
