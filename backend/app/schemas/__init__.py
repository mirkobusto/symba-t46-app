"""Engine schema-data package.

Contains the 5 JSON files that drive the decision engine:

- phase1_nodes.json        — 186 atomic decision nodes
- cross_method_rules.json  — 4 BLOCKs + 20 IR + 10 CIR + 5 FU + 7 B + 12 CDP
- system_fields.json       — engine-level state (governance/report/study/...)
- computed_fields.json     — pipeline-derived state (calculation_order/...)
- cir_output_fields.json   — CIR action LHS fields

Loaded by `app/engine/loader.py`. NOT importable as Python; access via the
loader. This `__init__.py` exists only so `pkgutil` / setuptools can locate
the package data when the wheel is built.
"""
