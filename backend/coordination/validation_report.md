# Phase 1 Artifacts — Validation Report

**Critical issues**: 0 | **Warnings**: 0 | **Info checks passed**: 25

**Overall status**: ✅ **PASS** (no critical issues; warnings may exist)


## Field classification summary

- Total distinct field references in rules: **65**
- Resolved to Phase 1 node field: **38**
- system_fields.json (governance/system/charter/review/study/report): **9**
- computed_fields.json (calculation_order/analytical_levels/classifications/derived booleans): **8**
- cir_output_fields.json (CIR action side-effects): **10**
- **UNKNOWN** (real bugs → field_gaps.md): **0**

## ✅ INFO findings (25)


### `node_total_count` — 1 item(s)

- 186 nodes total ✓

### `node_method_count` — 3 item(s)

- LCA: 59 ✓
- LCC: 61 ✓
- SLCA: 66 ✓

### `node_id_uniqueness` — 1 item(s)

- All 186 IDs unique ✓

### `node_id_convention` — 1 item(s)

- All IDs match convention ✓

### `node_category_consistency` — 1 item(s)

- DEFAULT/DERIVED pattern consistent ✓

### `node_lifecycle_layer` — 1 item(s)

- Trigger=L0, HC/MC=L2 ✓

### `node_simple_logic_orphan` — 1 item(s)

- All simple-logic nodes have populated trigger_condition ✓

### `node_field_status_consistency` — 1 item(s)

- field XOR field_status ✓

### `node_per_flow_set` — 1 item(s)

- Per-flow set matches v1 §5.4 (11 nodes) ✓

### `rule_count` — 6 item(s)

- blocks: 4 ✓
- integration_rules: 20 ✓
- conditional_integration_rules: 10 ✓
- fu_rules: 5 ✓
- boundary_rules: 7 ✓
- critical_decision_points: 12 ✓

### `rule_id_uniqueness` — 1 item(s)

- All 58 rule IDs unique ✓

### `rule_id_convention` — 1 item(s)

- All rule IDs match Kimi convention ✓

### `rule_layer` — 1 item(s)

- Lifecycle layers match v2 §2 architectural invariants ✓

### `rule_schema_completeness` — 1 item(s)

- All rules have required fields ✓

### `source_nodes_resolve` — 1 item(s)

- 108/108 source_nodes references resolve to valid Phase 1 IDs ✓

### `related_rules_resolve` — 1 item(s)

- All CDP related_rules references resolve ✓

### `field_unknown` — 1 item(s)

- ZERO unknown fields ✓ (all references classified)

### `field_classification_summary` — 1 item(s)

- Field references: 38 node + 9 system + 8 computed + 10 cir_output + 0 UNKNOWN = 65 total
