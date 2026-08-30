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
from app.engine.dcf_compose import DcfSection


def rows_for(data: DcfData | None, section_id: str) -> list[DcfRow]:
    """Stored rows of a section, or an empty list when nothing is stored."""
    if data is None:
        return []
    return data.rows_by_section.get(section_id, [])


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
        else:
            out.append(row.values.get(field.id))
    return out


def actor_label(row: DcfRow, fallback: str | None = None) -> str:
    """Human-readable name of an actor row, falling back to its id."""
    name = row.values.get("actor.name")
    if isinstance(name, str) and name.strip():
        return name
    return fallback or row.row_id


def edge_list(data: DcfData | None) -> list[dict[str, Any]]:
    """Flow-matrix rows that are wired up, resolved to actor labels.

    Rows without both endpoints are skipped: they are flows the analyst
    has declared but not yet drawn, and an edge with one end missing is
    not a graph edge.
    """
    if data is None:
        return []
    actors = {r.row_id: r for r in rows_for(data, "actors")}
    edges: list[dict[str, Any]] = []
    for row in rows_for(data, "flow_matrix"):
        origin = row.values.get("flow.origin_actor_id")
        dest = row.values.get("flow.dest_actor_id")
        if not isinstance(origin, str) or not isinstance(dest, str):
            continue
        origin_row = actors.get(origin)
        dest_row = actors.get(dest)
        edges.append(
            {
                "flow_id": row.row_id,
                "name": row.values.get("flow.name") or row.row_id,
                "origin": actor_label(origin_row, origin) if origin_row else origin,
                "destination": actor_label(dest_row, dest) if dest_row else dest,
                "type": row.values.get("flow.type"),
                "quantity": row.values.get("flow.quantity_measured"),
                "unit": row.values.get("flow.unit"),
            }
        )
    return edges
