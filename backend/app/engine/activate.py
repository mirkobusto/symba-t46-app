"""Phase 1 node activation.

Iterates the 186 Phase 1 nodes from `phase1_nodes.json`, evaluates each
node's activation condition against the case, and writes the activated
nodes' fields into the appropriate pillar dict on `case`.

Activation breakdown (per `phase1_nodes.json`, post-round-2 closure):

    Total          186 nodes
    By layer       183 L2 + 3 L0  (L0 handled by l0_compute, skipped here)
    By category    116 DEFAULT (always activate) + 70 DERIVED (conditional)
    By field       96 fielded + 90 procedural_mandate (no field to write)
    Per_flow        11 nodes flagged per_flow=true (iterate case.flows)

DERIVED activation by `trigger_logic`:

    discriminative  42  default_value is dict {"qX=V": value, ...}; pick
                        branch matching case.qX.value; "default" key is
                        fallback. No match + no default → node DORMANT.

    simple/conjunctive/disjunctive  28 (14+11+3)  Boolean trigger_condition;
                        evaluated by hand-coded predicates in _PREDICATES
                        (one entry per node_id). The JSON `trigger_condition`
                        strings are documentation; the typed predicates
                        below are the source of truth (same convention as
                        l0_compute / l1_blocks / pathway).

Pillar dispatcher: field paths are flat dotted strings; the prefix
before the first `.` selects the pillar dict on `case`; the rest is
the dict key (verbatim, including any further dots). E.g.
`review.panel.experts` -> `case.review["panel.experts"]`. Per the
domain model docstring ([models.py]: "keys are dotted-path tails after
'lca.'").

Per-flow value structure: for fielded per_flow nodes the pillar value
is a `dict[flow_id, branch_value]` so callers can look up per-flow
results by ID. Procedural per_flow nodes (no field) activate once if
at least one flow matches.

Out of scope for this commit (documented for future work):
- override_path semantics (Step 4 advanced-overrides layer)
- sector_overlays.json wiring for `lca_hc_19` (the node still
  activates with its generic mandate string)
- `case.asset_lifetime` referenced by lca_mc_21 / lcc_hc_23: not yet
  on the Case model; defensive `getattr(case, 'asset_lifetime', 0)`
  keeps those predicates inert today, auto-active when the field lands
"""
from __future__ import annotations

from collections.abc import Callable
from typing import Any

from app.domain.enums import Q1, Q2, Q5, Q7, LccType, Q6a, Q6b
from app.domain.models import Case, Flow
from app.engine.loader import LoadedSchemas

# ---------------------------------------------------------------------------
# Pillar dispatcher
# ---------------------------------------------------------------------------

_PILLAR_ATTRS = frozenset({
    "lca", "lcc", "slca", "report", "governance",
    "review", "methodological_charter", "system",
})


def _write(case: Case, field: str, value: Any) -> None:
    """Write `value` to the pillar dict implied by `field`.

    The prefix before the first '.' selects the pillar; the remainder
    becomes the flat dict key. `study.X` is routed to `case.system`
    keyed as `study.X` (study fields live in the system pillar).
    """
    if "." not in field:
        raise ValueError(f"field path lacks pillar prefix: {field!r}")
    prefix, tail = field.split(".", 1)
    if prefix == "study":
        # study fields are stored under system, full dotted key preserved
        case.system[field] = value
        return
    if prefix not in _PILLAR_ATTRS:
        raise ValueError(f"unknown pillar prefix in field {field!r}: {prefix!r}")
    pillar: dict[str, Any] = getattr(case, prefix)
    pillar[tail] = value


# ---------------------------------------------------------------------------
# Discriminative branch resolver
# ---------------------------------------------------------------------------

_Q_LOOKUP: dict[str, Callable[[Case], Any]] = {
    "q1": lambda c: c.q1.value if c.q1 else None,
    "q2": lambda c: c.q2.value if c.q2 else None,
    "q4": lambda c: {q.value for q in c.q4},
    "q5": lambda c: c.q5.value if c.q5 else None,
    "q6a": lambda c: c.q6a.value if c.q6a else None,
    "q6b": lambda c: c.q6b.value if c.q6b else None,
    "q7": lambda c: c.q7.value if c.q7 else None,
}


def _resolve_discriminative(
    case: Case, default_value: Any, trigger_q: list[str]
) -> tuple[bool, Any]:
    """Pick a branch from a discriminative `default_value` dict.

    Keys are formatted `"qX=V"` (single match) or `"default"` (fallback).
    For multi-select Q4 the key matches if its value is contained in the
    Q4 set; for single-select Q1/Q2/Q5/Q6a/Q6b/Q7 the value must equal.

    Returns `(activated, value)`. If no branch matches and no `default`
    key exists, returns `(False, None)` — the node is dormant.

    Defensive: if `default_value` is not a dict (e.g. lca_hc_19, marked
    discriminative but with logic deferred to sector_overlays.json),
    treat it as a static mandate string and always activate.
    """
    if not isinstance(default_value, dict):
        return True, default_value
    matched_value: Any = None
    matched: bool = False
    for key, branch_value in default_value.items():
        if key == "default":
            continue
        if "=" not in key:
            continue
        q_name, expected = key.split("=", 1)
        q_name = q_name.strip()
        expected = expected.strip()
        accessor = _Q_LOOKUP.get(q_name)
        if accessor is None:
            continue
        actual = accessor(case)
        if actual is None:
            continue
        if isinstance(actual, set):
            if expected in actual:
                return True, branch_value
        elif actual == expected:
            return True, branch_value
    if "default" in default_value:
        return True, default_value["default"]
    return matched, matched_value


# ---------------------------------------------------------------------------
# Boolean predicates for the 28 non-discriminative DERIVED nodes
# ---------------------------------------------------------------------------


def _q4_intersects(case: Case, members: set[str]) -> bool:
    return any(q.value in members for q in case.q4)


def _asset_lifetime(case: Case) -> float:
    """Defensive: case.asset_lifetime is not yet on the Case model
    (Step 4 territory). Returns 0 today so > 15 predicates stay False."""
    return getattr(case, "asset_lifetime", 0)


_E_LCC_FAMILY = {LccType.E_LCC_PLUS_S_LCC_PLUS_NTF, LccType.C_LCC_PLUS_E_LCC}

_PREDICATES: dict[str, Callable[..., bool]] = {
    # disjunctive
    "lca_hc_14": lambda c: _q4_intersects(c, {"C", "D", "E"}) or (c.q6b is not None and c.q6b != Q6b.TRL9),
    # simple
    "lca_hc_21": lambda c: c.q7 in {Q7.B, Q7.C, Q7.D},
    # conjunctive
    "lca_mc_03": lambda c: c.q3.eco and c.q3.env,
    # simple
    "lca_mc_20": lambda c: c.q6b in {Q6b.TRL7_8, Q6b.TRL5_6, Q6b.TRL_LT_5},
    # conjunctive — case.asset_lifetime defensive
    "lca_mc_21": lambda c: c.q2 == Q2.D and _asset_lifetime(c) > 15,
    # simple
    "lca_mc_29": lambda c: c.q7 in {Q7.C, Q7.D},
    # simple
    "lca_mc_30": lambda c: c.q6a == Q6a.WASTEWATER_BIOFACTORIES,
    # simple
    "lca_mc_33": lambda c: c.q3.eco,
    # conjunctive
    "lcc_hc_04": lambda c: c.q3.env and c.lcc_type in _E_LCC_FAMILY,
    "lcc_hc_05": lambda c: c.q3.env and c.lcc_type in _E_LCC_FAMILY,
    # simple
    "lcc_hc_06": lambda c: c.q7 in {Q7.B, Q7.C, Q7.D},
    "lcc_hc_10": lambda c: c.q3.eco,
    # per_flow simple
    "lcc_hc_12": lambda c, f: f.q5 != Q5.e,
    # simple
    "lcc_hc_15": lambda c: c.q6b in {Q6b.TRL5_6, Q6b.TRL_LT_5},
    # conjunctive — asset_lifetime defensive
    "lcc_hc_23": lambda c: c.q2 in {Q2.C, Q2.D} and _asset_lifetime(c) > 15,
    # conjunctive
    "lcc_hc_27": lambda c: c.q3.env and c.q3.eco,
    "lcc_hc_28": lambda c: c.q3.env and c.q3.eco,
    # per_flow simple
    "lcc_hc_34": lambda c, f: f.q5 == Q5.c,
    # per_flow disjunctive
    "lcc_hc_35": lambda c, f: f.q5 in {Q5.a, Q5.b},
    # per_flow simple
    "lcc_hc_36": lambda c, f: f.q5 == Q5.d,
    # simple
    "lcc_hc_37": lambda c: c.q2 in {Q2.B, Q2.C, Q2.D},
    # per_flow disjunctive
    "lcc_hc_38": lambda c, f: (f.q5 == Q5.b) or (c.q3.eco and not c.q3.env and not c.q3.soc),
    # conjunctive
    "lcc_mc_17": lambda c: c.q3.env and c.q3.eco,
    "slca_hc_06": lambda c: c.q3.soc and (c.q3.env or c.q3.eco),
    "slca_hc_09": lambda c: c.q3.soc and (c.q3.env or c.q3.eco),
    # simple
    "slca_hc_10": lambda c: c.q3.soc,
    # conjunctive
    "slca_hc_41": lambda c: c.q3.env and c.q3.eco and c.q3.soc,
    # simple
    "slca_hc_42": lambda c: c.q3.soc,
}


# ---------------------------------------------------------------------------
# Main activation loop
# ---------------------------------------------------------------------------


def _activate_node(case: Case, node: dict[str, Any]) -> None:
    """Activate a single node: compute value (if any), write to pillar
    (if fielded), append node ID to `case.activated_nodes`."""
    nid = node["id"]
    field = node.get("field")
    field_status = node.get("field_status")
    is_per_flow = bool(node.get("per_flow"))
    category = node.get("category")
    trigger_logic = node.get("trigger_logic")

    if category == "DEFAULT":
        # Always-active node; write the literal default_value if fielded.
        case.activated_nodes.append(nid)
        if field and field_status != "procedural_mandate":
            _write(case, field, node["default_value"])
        return

    # DERIVED — depends on trigger_logic
    if trigger_logic == "discriminative":
        if is_per_flow:
            _activate_discriminative_per_flow(case, node)
        else:
            activated, value = _resolve_discriminative(
                case, node["default_value"], node.get("trigger_q") or []
            )
            if activated:
                case.activated_nodes.append(nid)
                if field and field_status != "procedural_mandate":
                    _write(case, field, value)
        return

    # simple / conjunctive / disjunctive — predicate-driven
    predicate = _PREDICATES.get(nid)
    if predicate is None:
        # No predicate registered — node stays dormant. Defensive: a
        # missing predicate would otherwise silently mis-activate.
        return

    if is_per_flow:
        _activate_predicate_per_flow(case, node, predicate)
    else:
        if predicate(case):
            case.activated_nodes.append(nid)
            if field and field_status != "procedural_mandate":
                _write(case, field, node["default_value"])


def _activate_discriminative_per_flow(case: Case, node: dict[str, Any]) -> None:
    """Per-flow discriminative node: build a {flow_id: branch_value} dict."""
    nid = node["id"]
    field = node.get("field")
    field_status = node.get("field_status")
    default_value = node["default_value"]
    if not isinstance(default_value, dict):
        # Same defensive path as _resolve_discriminative
        case.activated_nodes.append(nid)
        if field and field_status != "procedural_mandate":
            _write(case, field, default_value)
        return
    per_flow_values: dict[str, Any] = {}
    any_matched = False
    for flow in case.flows:
        # discriminative per-flow always discriminates on q5 (the only
        # per-flow Q in the schema); branch keys are "q5=X"
        flow_q5_value = flow.q5.value if flow.q5 else None
        for key, branch_value in default_value.items():
            if key == "default":
                continue
            if "=" not in key:
                continue
            _, expected = key.split("=", 1)
            if expected.strip() == flow_q5_value:
                per_flow_values[flow.id] = branch_value
                any_matched = True
                break
        else:
            if "default" in default_value:
                per_flow_values[flow.id] = default_value["default"]
                any_matched = True
    if any_matched:
        case.activated_nodes.append(nid)
        if field and field_status != "procedural_mandate":
            _write(case, field, per_flow_values)


def _activate_predicate_per_flow(
    case: Case, node: dict[str, Any], predicate: Callable[[Case, Flow], bool]
) -> None:
    """Per-flow predicate node: activate once if at least one flow matches.

    For fielded nodes, write a `{flow_id: default_value}` dict containing
    only the matching flows. For procedural mandates (no field), activation
    is binary (one entry in activated_nodes regardless of how many flows
    matched)."""
    nid = node["id"]
    field = node.get("field")
    field_status = node.get("field_status")
    matching_flows = [f for f in case.flows if predicate(case, f)]
    if not matching_flows:
        return
    case.activated_nodes.append(nid)
    if field and field_status != "procedural_mandate":
        _write(case, field, {f.id: node["default_value"] for f in matching_flows})


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Activate Phase 1 nodes and write their field values onto `case`.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention; see app/engine/pipeline.py).

    Skips nodes with `lifecycle_layer == 'L0'` (handled upstream by
    `l0_compute.run`).

    For each activated node, appends its ID to `case.activated_nodes`.
    Fielded nodes also write their resolved value into the appropriate
    pillar dict (per `_write`); procedural-mandate nodes only register
    activation.
    """
    # Defensive: Q1 must be set before activation runs (matches pathway
    # and l0_compute conventions).
    if case.q1 not in {Q1.A, Q1.B, Q1.C, Q1.D, Q1.E}:
        raise ValueError(f"Invalid Q1: {case.q1!r}")

    for node in schemas.phase1_nodes:
        if node.get("lifecycle_layer") == "L0":
            continue
        _activate_node(case, node)
    return case
