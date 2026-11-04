"""Projection of stored DCF content onto a composed section descriptor.

The writers (xlsx, docx) and the reporting surfaces all need the same
thing: given a section of the DcfPayload and the rows the analyst
entered, produce the cell values in the descriptor's column order.

The one subtlety is the identity field. `actor.id` / `flow.id` /
`infra.id` are declared in the schema but never typed by the analyst —
they are derived from the row_id the client assigned (see
`app.domain.dcf_data`). So the projection fills them from `row_id`
rather than from `values`.
"""
from __future__ import annotations

from typing import Any

from app.domain.dcf_data import DcfData, DcfRow
from app.domain.models import Case
from app.engine.dcf_compose import DcfSection


def rows_for(data: DcfData | None, section_id: str) -> list[DcfRow]:
    """Stored rows of a section, or an empty list when nothing is stored."""
    if data is None:
        return []
    return data.rows_by_section.get(section_id, [])


def with_case_flows(data: DcfData | None, case: Case, case_id: str) -> DcfData:
    """Stored content plus a row for every questionnaire flow it lacks.

    The flows declared in the questionnaire belong in the Flow Matrix of
    every file, drawn or not: a row per flow (its id is the case flow id)
    with name, payment class, unit and quantity, and the Flow
    Classification row the Freedom-to-Act answer starts. Stored rows keep
    what was entered in them, except name and payment class: those are set
    in the questionnaire and always follow it, so a file cannot say "c" in
    the Flow Matrix and "d" in the methodological choices (UX round 5, D2).
    The browser seeds the same rows for the editor, but the files must not
    depend on the network having been saved (D3/D4).
    """
    base = data or DcfData(case_id=case_id)
    sections = {k: list(v) for k, v in base.rows_by_section.items()}
    matrix = sections.setdefault("flow_matrix", [])
    by_id = {flow.id: flow for flow in case.flows if flow.id}
    for i, row in enumerate(matrix):
        flow = by_id.get(row.row_id)
        if flow is None:
            continue
        fixed = {"flow.name": flow.name, "flow.q5_class": flow.q5.value}
        if any(row.values.get(k) != v for k, v in fixed.items()):
            matrix[i] = row.model_copy(update={"values": {**row.values, **fixed}})
    have = {r.row_id for r in matrix}
    for flow in case.flows:
        if not flow.id or flow.id in have:
            continue
        values: dict[str, Any] = {"flow.name": flow.name, "flow.q5_class": flow.q5.value}
        if flow.physical_unit:
            values["flow.unit"] = flow.physical_unit
        if flow.physical_quantity is not None:
            values["flow.quantity_measured"] = flow.physical_quantity
        matrix.append(DcfRow(row_id=flow.id, values=values))
    classification = sections.setdefault("flow_classification", [])
    classified = {r.values.get("classif.flow_id") for r in classification}
    for flow in case.flows:
        if not flow.id or flow.sellable_elsewhere is None or flow.id in classified:
            continue
        classification.append(
            DcfRow(
                row_id=f"classif-{flow.id}",
                values={
                    "classif.flow_id": flow.id,
                    "classif.independent_market": "yes" if flow.sellable_elsewhere else "no",
                },
            )
        )
    # a scenario's network follows the questionnaire too: names, and who pays
    # whom as the scenario sets it (flow_q5 override), else as the case does
    networks = {}
    for scenario in case.alternative_scenarios:
        variant = base.networks_by_scenario.get(scenario.id)
        if variant is None:
            continue
        q5_override = scenario.overrides.get("flow_q5") if isinstance(scenario.overrides, dict) else None
        q5_override = q5_override if isinstance(q5_override, dict) else {}
        rows = []
        for row in variant.rows_by_section.get("flow_matrix", []):
            flow = by_id.get(row.row_id)
            if flow is not None:
                fixed = {"flow.name": flow.name, "flow.q5_class": str(q5_override.get(flow.id, flow.q5.value))}
                row = row.model_copy(update={"values": {**row.values, **fixed}})
            rows.append(row)
        networks[scenario.id] = variant.model_copy(
            update={"rows_by_section": {**variant.rows_by_section, "flow_matrix": rows}})
    if networks:
        return base.model_copy(update={"rows_by_section": sections,
                                       "networks_by_scenario": {**base.networks_by_scenario, **networks}})
    return base.model_copy(update={"rows_by_section": sections})


def derived_id_field(section: DcfSection) -> str | None:
    """The `<prefix>.id` column of a section, if it declares one."""
    for field in section.fields:
        if field.id.endswith(".id"):
            return field.id
    return None


def cell_values(section: DcfSection, row: DcfRow) -> list[Any]:
    """Row values in the section's column order, `None` where unfilled."""
    id_field = derived_id_field(section)
    out: list[Any] = []
    for field in section.fields:
        if field.id == id_field:
            out.append(row.row_id)
        elif not row_condition_holds(field, row):
            # dormant on this row (e.g. CAPEX on an existing asset): kept, not exported
            out.append(None)
        else:
            out.append(row.values.get(field.id))
    return out


def row_condition_holds(field: Any, row: DcfRow) -> bool:
    """False when the field is asked only on rows whose condition field takes
    other values (DcfFieldDescriptor.row_condition_values)."""
    values = getattr(field, "row_condition_values", None)
    if values is None:
        return True
    current = row.values.get(field.row_condition_field)
    return current in (None, "") or current in values


def actor_label(row: DcfRow, fallback: str | None = None) -> str:
    """Human-readable name of an actor row, falling back to its id."""
    name = row.values.get("actor.name")
    if isinstance(name, str) and name.strip():
        return name
    return fallback or row.row_id


def _number(value: Any) -> float | int | None:
    """A quantity as stored: a number, or a numeric string typed in a text
    field; never a boolean."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        try:
            return float(value.replace(",", ".")) if value.strip() else None
        except ValueError:
            return None
    return None


def _quantity(row: DcfRow) -> Any:
    """Measured quantity, else the projected one (a number, or the first
    numeric value of a per-scenario mapping, the baseline first)."""
    measured = row.values.get("flow.quantity_measured")
    if measured not in (None, ""):
        return measured
    projected = row.values.get("flow.quantity_projected")
    if isinstance(projected, dict):
        for key in ("baseline", *projected.keys()):
            value = _number(projected.get(key))
            if value is not None:
                return value
        return None
    return _number(projected)


def edge_list(data: DcfData | None) -> list[dict[str, Any]]:
    """Flow-matrix rows that are wired up, resolved to actor labels.

    Rows without both endpoints are skipped: they are flows the analyst
    has declared but not yet drawn, and an edge with one end missing is
    not a graph edge.
    """
    if data is None:
        return []
    return edge_list_rows(rows_for(data, "actors"), rows_for(data, "flow_matrix"))


def edge_list_rows(actor_rows: list[DcfRow], flow_rows: list[DcfRow]) -> list[dict[str, Any]]:
    """`edge_list` on given rows: the case's network or a scenario's."""
    actors = {r.row_id: r for r in actor_rows}
    edges: list[dict[str, Any]] = []
    for row in flow_rows:
        origin = row.values.get("flow.origin_actor_id")
        dest = row.values.get("flow.dest_actor_id")
        if not isinstance(origin, str) or not isinstance(dest, str):
            continue
        origin_row = actors.get(origin)
        dest_row = actors.get(dest)
        edges.append(
            {
                "flow_id": row.row_id,
                "origin_id": origin,
                "destination_id": dest,
                "name": row.values.get("flow.name") or row.row_id,
                "origin": actor_label(origin_row, origin) if origin_row else origin,
                "destination": actor_label(dest_row, dest) if dest_row else dest,
                "type": row.values.get("flow.type"),
                # a flow that does not run yet has only a projected quantity (P7-12)
                "quantity": _quantity(row),
                "unit": row.values.get("flow.unit"),
            }
        )
    return edges


# ---------------------------------------------------------------------------
# A scenario's network against the case's, in words (no arithmetic)
# ---------------------------------------------------------------------------

DIFF_VALUE_FIELDS = ("flow.quantity_measured", "flow.quantity_projected", "flow.unit", "flow.type")


def _wired(row: DcfRow) -> tuple[str, str] | None:
    origin, dest = row.values.get("flow.origin_actor_id"), row.values.get("flow.dest_actor_id")
    return (origin, dest) if isinstance(origin, str) and origin and isinstance(dest, str) and dest else None


def network_diff(
    base_actors: list[DcfRow], base_flows: list[DcfRow],
    var_actors: list[DcfRow], var_flows: list[DcfRow],
) -> dict[str, list[dict[str, Any]]]:
    """What a scenario's network changes against the case's, matched by row
    id (never by name): actors added, removed or renamed; flows sent from or
    to another actor, flows that do not take place in the scenario, flows that
    take place only there; quantity, unit and type as entered. The same rules
    as frontend/src/pages/networkDiff.ts (shared fixtures in the tests)."""
    base_a = {r.row_id: r for r in base_actors}
    var_a = {r.row_id: r for r in var_actors}

    def name_in(actors: dict[str, DcfRow], actor_id: str) -> str:
        row = actors.get(actor_id)
        return actor_label(row, actor_id) if row else actor_id

    diff: dict[str, list[dict[str, Any]]] = {
        "actors_added": [], "actors_removed": [], "actors_renamed": [],
        "flows_rerouted": [], "flows_dropped": [], "flows_only_in_scenario": [], "value_changes": [],
    }
    for actor_id, row in var_a.items():
        if actor_id not in base_a:
            diff["actors_added"].append({"actor": actor_label(row, actor_id)})
        elif actor_label(row, actor_id) != actor_label(base_a[actor_id], actor_id):
            diff["actors_renamed"].append({"before": actor_label(base_a[actor_id], actor_id), "after": actor_label(row, actor_id)})
    for actor_id, row in base_a.items():
        if actor_id not in var_a:
            diff["actors_removed"].append({"actor": actor_label(row, actor_id)})

    base_f = {r.row_id: r for r in base_flows}
    var_f = {r.row_id: r for r in var_flows}
    for flow_id, row in base_f.items():
        before = _wired(row)
        if before is None:
            continue
        name = row.values.get("flow.name") or flow_id
        other = var_f.get(flow_id)
        after = _wired(other) if other else None
        if after is None:
            diff["flows_dropped"].append({"flow": name})
            continue
        if after != before:
            diff["flows_rerouted"].append({
                "flow": name,
                "from_before": name_in(base_a, before[0]), "to_before": name_in(base_a, before[1]),
                "from_after": name_in(var_a, after[0]), "to_after": name_in(var_a, after[1]),
            })
        for field in DIFF_VALUE_FIELDS:
            was, now = row.values.get(field), other.values.get(field)
            if was in ("", None) and now in ("", None):
                continue
            if was != now:
                diff["value_changes"].append({"flow": name, "field": field, "before": was, "after": now})
    for flow_id, row in var_f.items():
        wired = _wired(row)
        if wired is None or (flow_id in base_f and _wired(base_f[flow_id]) is not None):
            continue
        diff["flows_only_in_scenario"].append({
            "flow": row.values.get("flow.name") or flow_id,
            "from": name_in(var_a, wired[0]), "to": name_in(var_a, wired[1]),
        })
    return diff


def scenario_networks(data: DcfData | None, scenarios: list[tuple[str, str]] | None) -> list[tuple[str, Any]]:
    """(label, network) of each scenario of the case that has a network of its
    own, in the questionnaire's order; a network whose scenario left the
    questionnaire is dormant and not exported."""
    if data is None or not scenarios:
        return []
    return [(label, data.networks_by_scenario[sid]) for sid, label in scenarios if sid in data.networks_by_scenario]
