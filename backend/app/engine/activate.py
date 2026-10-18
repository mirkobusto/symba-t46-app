"""Phase 1 node activation.

Iterates the 186 Phase 1 nodes from `phase1_nodes.json`, evaluates each
node's activation condition against the case, and writes the activated
nodes' fields into the appropriate pillar dict on `case`.

Activation breakdown (per `phase1_nodes.json`, post-round-2 closure):

    Total          186 nodes
    By layer       183 L2 + 3 L0  (L0 handled by l0_compute, skipped here)
    By category    117 DEFAULT (always activate) + 69 DERIVED (conditional)
    By field       95 fielded + 91 procedural_mandate (no field to write)
    Per_flow        11 nodes flagged per_flow=true (iterate case.flows)

DERIVED activation by `trigger_logic`:

    discriminative  43  default_value is dict {branch_key: value, ...}; the
                        first branch whose key matches the case wins (grammar in
                        engine/branch_keys.py); "default" key is fallback.
                        No match + no default → node DORMANT.

    simple/conjunctive/disjunctive  26 (13+11+2)  Boolean trigger_condition;
                        evaluated by hand-coded predicates in _PREDICATES
                        (one entry per node_id). The JSON `trigger_condition`
                        strings are documentation; the typed predicates
                        below are the source of truth (same convention as
                        l0_compute / l1_blocks).

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
"""
from __future__ import annotations

import math
from collections.abc import Callable
from typing import Any

from app.domain.enums import (
    Q1,
    Q2,
    Q5,
    LccType,
    OperatingStart,
    Q6a,
    Q6b,
    SlcaActivationState,
)
from app.domain.models import Case, Flow
from app.engine import answer_phrases
from app.engine.branch_keys import Answers, pick_branch
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

    Writes into a method the L0 trigger switched off are dropped. This
    also covers the L2 cross-method actions (CIR-02 pedigree, CIR-03 GIS
    coupling, …), which otherwise leave a handful of keys in a pillar the
    case does not have — the reason `case.lcc` still held four entries on
    an environment-only case after the node gate was added.
    """
    if "." not in field:
        raise ValueError(f"field path lacks pillar prefix: {field!r}")
    prefix, tail = field.split(".", 1)
    if prefix == "study":
        # study fields are stored under system, full dotted key preserved
        case.system[field] = answer_phrases.fill(value, case)
        return
    if prefix not in _PILLAR_ATTRS:
        raise ValueError(f"unknown pillar prefix in field {field!r}: {prefix!r}")
    if _pillar_is_off(case, prefix) and not (
            prefix == "lca" and tail in _LCA_KEYS_SHARED_WITH_LCC and case.q3.eco):
        return
    pillar: dict[str, Any] = getattr(case, prefix)
    pillar[tail] = answer_phrases.fill(value, case)


def _pillar_is_off(case: Case, prefix: str) -> bool:
    """True when the pillar belongs to a method switched off at L0."""
    if prefix == "lcc":
        return case.lcc_type == LccType.DEACTIVATED
    if prefix == "slca":
        return case.slca_activation_state == SlcaActivationState.DEACTIVATED
    if prefix == "lca":
        return not case.q3.env
    return False


# What the LCC takes from the LCA even when no LCA is done: the same reference
# scenario (D4.2 L00725) and the same classification of each flow (D4.2 §6.3,
# L00729). Owner decision 2026-10-18, after the corpus run on Catalano 2024.
_LCA_NODES_SHARED_WITH_LCC = frozenset({"lca_mc_26", "lca_mc_27", "lca_mc_17"})
_LCA_KEYS_SHARED_WITH_LCC = frozenset({
    "reference_scenario.type", "reference_scenario.content", "zero_burden_classification"})


# ---------------------------------------------------------------------------
# Discriminative branch resolver
# ---------------------------------------------------------------------------

def _resolve_discriminative(
    case: Case, default_value: Any, trigger_q: list[str]
) -> tuple[bool, Any]:
    """Pick a branch from a discriminative `default_value` dict.

    Branch keys follow the grammar of `engine/branch_keys.py` (`qX=V`,
    `qX in {..}`, `q4 includes 'V'`, `q6b<TRLn`, the `q3.*` forms, `ilcd=C`,
    `lcc_type=T`, `sector=V`). The first matching branch in the dict's order wins; the
    `default` key is the fallback. A key the grammar does not know raises
    `BranchKeyError` instead of being skipped: skipping is how 25 nodes lost
    their rules without anyone noticing.

    Returns `(activated, value)`. If no branch matches and no `default`
    key exists, returns `(False, None)` — the node is dormant.

    Defensive: if `default_value` is not a dict (e.g. lca_hc_19, marked
    discriminative but with logic deferred to sector_overlays.json),
    treat it as a static mandate string and always activate.
    """
    if not isinstance(default_value, dict):
        return True, default_value
    return pick_branch(default_value, Answers.from_case(case))


# ---------------------------------------------------------------------------
# Boolean predicates for the 26 non-discriminative DERIVED nodes
# ---------------------------------------------------------------------------


def _q4_intersects(case: Case, members: set[str]) -> bool:
    return any(q.value in members for q in case.q4)


def asset_lifetime_years(case: Case) -> float:
    """Asset lifetime in years: the Q8 answer, else the advanced override.

    `Case.asset_lifetime_years` (Q8) wins when answered. Until Q8 existed the
    Advanced editor stored the value under `case.advanced["asset_lifetime"]`,
    which the engine could not see (it read `getattr(case, "asset_lifetime")`
    on an `extra='forbid'` model), so the `> 15` triggers (lca_mc_21,
    lcc_hc_23, CIR-01) never fired. That key is still read as a fallback for
    cases saved before Q8.

    A missing, boolean, non-numeric or non-finite fallback reads as 0, which
    keeps those triggers inert. Numeric strings are accepted: the editor
    coerces them, but a case posted straight to the API may still carry "20".
    """
    if case.asset_lifetime_years is not None:
        return float(case.asset_lifetime_years)
    raw = case.advanced.get("asset_lifetime")
    if raw is None or isinstance(raw, bool):
        return 0.0
    try:
        years = float(raw)
    except (TypeError, ValueError):
        return 0.0
    return years if math.isfinite(years) else 0.0


# Length of the study horizon (analysis period, else asset lifetime) above which
# future background is required: D4.2 §9.3 L01131 ("asset lifetimes exceeding
# fifteen years"), which cites no source behind the figure. Default of a parameter
# the analyst can change through `advanced["future_background_threshold_years"]`.
FUTURE_BACKGROUND_LIFETIME_YEARS = 15.0
THRESHOLD_KEY = "future_background_threshold_years"


def future_background_threshold_years(case: Case) -> float:
    """The analyst's threshold if it is a positive finite number, else D4.2's 15."""
    raw = case.advanced.get(THRESHOLD_KEY)
    if raw is None or isinstance(raw, bool):
        return FUTURE_BACKGROUND_LIFETIME_YEARS
    try:
        years = float(raw)
    except (TypeError, ValueError):
        return FUTURE_BACKGROUND_LIFETIME_YEARS
    return years if math.isfinite(years) and years > 0 else FUTURE_BACKGROUND_LIFETIME_YEARS

LOW_TRL = frozenset({Q6b.TRL5_6, Q6b.TRL_LT_5})


def horizon_exceeds_threshold(case: Case) -> bool:
    """D4.2 L01131 speaks of asset lifetimes, the study of its analysis period
    (L01044 aligns the two): either one beyond the threshold is enough (owner
    decision 2026-10-15, after Fable's review)."""
    threshold = future_background_threshold_years(case)
    period = case.analysis_period_years
    return (period is not None and float(period) > threshold) or asset_lifetime_years(case) > threshold


def operates_in_future(case: Case) -> bool:
    """Q8a. Unanswered: the year of the study. (Until 2026-10-18 an unanswered
    Q8a counted as future for the former Q2=D, baseline plus future alternatives;
    that option is gone, see enums.Q2.)"""
    return case.operating_start == OperatingStart.FUTURE


def needs_future_background(case: Case) -> bool:
    """One study horizon for LCA and LCC (D4.2 L01261, L01277; D4.1 L01521):
    future background (SSP/RCP) when the system operates in a future year
    (D4.1 L01100, L01393), when the key technology is below TRL 7 (L01100), or
    when the analysis period or the asset lifetime runs beyond the threshold
    (D4.2 L01131, 15 years by default, changeable by the analyst). Read by lca_mc_21,
    lcc_hc_23 and CIR-01 (owner decision 2026-10-15, replacing ex-ante OR
    lifetime)."""
    return (operates_in_future(case) or case.q6b in LOW_TRL
            or horizon_exceeds_threshold(case))


_E_LCC_FAMILY = {LccType.E_LCC_PLUS_S_LCC_PLUS_NTF, LccType.C_LCC_PLUS_E_LCC}

# lca_mc_30 keys AWARE on water exchanges (D4.1 L01401): since 2026-10-18 it
# reads the sector declared on the flows, not the case sector (Q6a). The legacy
# alias is kept for stored cases and old fixtures.
_WASTEWATER_SECTORS = {Q6a.WASTEWATER_SLUDGE_BIOFACTORIES, Q6a.WASTEWATER_BIOFACTORIES}

_PREDICATES: dict[str, Callable[..., bool]] = {
    # disjunctive
    "lca_hc_14": lambda c: _q4_intersects(c, {"C", "D", "E"}) or (c.q6b is not None and c.q6b != Q6b.TRL9),
    # conjunctive
    "lca_mc_03": lambda c: c.q3.env and c.lcc_type in _E_LCC_FAMILY,   # an E-LCC to integrate (D4.1 §14.3.2)
    # simple
    "lca_mc_20": lambda c: c.q6b in {Q6b.TRL5_6, Q6b.TRL_LT_5},
    # static LCC background only when the study horizon stays in the present (R3, 2026-10-18)
    "lcc_mc_13": lambda c: not needs_future_background(c),
    # disjunctive — future operating year OR TRL < 7 OR horizon above the threshold
    "lca_mc_21": needs_future_background,
    # simple
    # simple
    "lca_mc_30": lambda c: any(f.sector in _WASTEWATER_SECTORS for f in c.flows),   # flows, not Q6a (2026-10-18)
    # simple
    "lca_mc_33": lambda c: c.q3.eco,
    # conjunctive
    "lcc_hc_04": lambda c: c.q3.env and c.lcc_type in _E_LCC_FAMILY,
    "lcc_hc_05": lambda c: c.q3.env and c.lcc_type in _E_LCC_FAMILY,
    "lcc_hc_10": lambda c: c.q3.eco,
    # per_flow simple
    "lcc_hc_12": lambda c, f: True,   # every secondary flow, aggregated ones included (D4.2 §6.3)
    # simple
    "lcc_hc_15": lambda c: c.q6b in {Q6b.TRL5_6, Q6b.TRL_LT_5} or c.q2 == Q2.B,   # planning stage (D4.2 §7.3)
    # disjunctive — same rule as lca_mc_21
    "lcc_hc_23": needs_future_background,
    # conjunctive
    "lcc_hc_27": lambda c: c.q3.env and c.q3.eco,
    "lcc_hc_28": lambda c: c.q3.env and c.q3.eco,
    # per_flow simple
    "lcc_hc_34": lambda c, f: f.q5 in {Q5.a, Q5.b, Q5.c, Q5.d},
    # per_flow disjunctive
    "lcc_hc_35": lambda c, f: f.q5 in {Q5.a, Q5.b},
    # per_flow simple
    "lcc_hc_36": lambda c, f: f.q5 == Q5.d,
    # simple
    "lcc_hc_37": lambda c: c.q2 == Q2.B,
    # per_flow simple
    "lcc_hc_38": lambda c, f: f.q5 == Q5.b,   # the eco-only branch had no basis (2026-10-15)
    # conjunctive
    "lcc_mc_17": lambda c: c.q3.env and c.lcc_type in _E_LCC_FAMILY,
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
    """Per-flow discriminative node: build a {flow_id: branch_value} dict.

    Each flow is resolved on its own Q5 with the same grammar and the same
    first-match rule as the case-level nodes (`pick_branch`)."""
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
    for flow in case.flows:
        matched, value = pick_branch(default_value, Answers.from_case(case, flow))
        if matched:
            per_flow_values[flow.id] = value
    if per_flow_values:
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


def _method_is_off(case: Case, method: str | None) -> bool:
    """True when the L0 trigger switched this whole method off.

    `phase1_nodes.json` states the rule in the trigger nodes themselves:
    `lcc_trig_01` maps "q3.eco=false" to "all LCC nodes deactivated", and
    `slca_t_01` maps "q3.soc=false" to "all S-LCA nodes deactivated".
    Without this gate the engine wrote all 61 LCC and 66 S-LCA nodes on a
    case that had switched those dimensions off, so the verdict said "no
    economic analysis" over a fully configured LCC pillar, and the DCF
    asked for economic data nobody had asked for.
    """
    if method == "LCC":
        return case.lcc_type == LccType.DEACTIVATED
    if method == "SLCA":
        return case.slca_activation_state == SlcaActivationState.DEACTIVATED
    if method == "LCA":
        # no trigger node states it, but an LCA nobody asked for is the same
        # contradiction (end-to-end review, 2026-10-18); the ILCD situation is
        # still derived at L0, since the LCC structure reads it
        return not case.q3.env
    return False


# LCA nodes whose value governs the study as a whole, not the LCA alone: the
# critical review of a public comparative claim (lca_mc_36, lca_hc_08) and the
# methodological charter (lca_hc_16). They stay on without the LCA.
_STUDY_WIDE_PREFIXES = ("review.", "methodological_charter.")


def _skipped(case: Case, node: dict[str, Any]) -> bool:
    if not _method_is_off(case, node.get("method")):
        return False
    if node.get("method") != "LCA":
        return True
    if (node.get("field") or "").startswith(_STUDY_WIDE_PREFIXES):
        return False
    # an LCC without LCA still needs its reference scenario and flow classification
    return not (case.q3.eco and node["id"] in _LCA_NODES_SHARED_WITH_LCC)


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Activate Phase 1 nodes and write their field values onto `case`.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention; see app/engine/pipeline.py).

    Skips nodes with `lifecycle_layer == 'L0'` (handled upstream by
    `l0_compute.run`), and skips a whole method when its L0 trigger
    switched it off — see `_method_is_off`.

    For each activated node, appends its ID to `case.activated_nodes`.
    Fielded nodes also write their resolved value into the appropriate
    pillar dict (per `_write`); procedural-mandate nodes only register
    activation.
    """
    # Defensive: Q1 must be set before activation runs (matches l0_compute
    # and l0_compute conventions).
    if case.q1 not in {Q1.A, Q1.B, Q1.C, Q1.D, Q1.E}:
        raise ValueError(f"Invalid Q1: {case.q1!r}")

    for node in schemas.phase1_nodes:
        if node.get("lifecycle_layer") == "L0":
            continue
        if _skipped(case, node):
            continue
        _activate_node(case, node)
    _write_amortisation_period(case)
    return case


# Capital goods are amortised over the technical lifetime of each asset, the same
# period in LCA and LCC (D4.1 §6.3.3, §14.2.2; D4.2 §4.2 L00575). The Q8 asset
# lifetime is the primary asset's; per-asset periods belong to the DCF.
_AMORTISATION_FIELDS = (("lca_hc_18", "lca.capital_goods.amortization_period"),
                        ("lcc_hc_07", "lcc.capital_goods.amortization_period"))


def _write_amortisation_period(case: Case) -> None:
    years = asset_lifetime_years(case)
    if years <= 0:
        return
    for node_id, field in _AMORTISATION_FIELDS:
        if node_id in case.activated_nodes:
            _write(case, field, years)
