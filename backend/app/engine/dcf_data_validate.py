"""Validate persisted DCF content against the case's composed descriptor.

The composed `DcfPayload` already answers "which sections and fields does
*this* case have to fill in" (activation predicates applied). This module
answers the complementary question: "is what the analyst entered legal
for that descriptor".

Two severities, deliberately:

- **errors** — structural problems that would corrupt the file: rows in a
  section the case does not have, values for a field the pathway did not
  activate, values outside an inline enum, foreign keys pointing nowhere,
  duplicate row ids. These block the write.
- **missing_required** — required fields that are still empty. A Data
  Collection File is filled in over days, in dialogue with the network
  partners; a half-filled row is the normal intermediate state, so this
  is reported for the progress indicator and never blocks a save.
"""
from __future__ import annotations

from typing import Any

from app.domain.dcf_data import (
    DcfData,
    DcfDataIssue,
    DcfDataValidation,
    DcfSectionCompleteness,
)
from app.domain.models import Case
from app.engine.dcf_compose import DcfPayload, DcfSection

# Sections whose rows come from the analyst (directly or seeded from the
# Case). Everything else in the schema is derived by the engine and must
# not accept stored rows.
EDITABLE_ROW_COLLECTIONS = frozenset(
    {"user_added", "pre_seeded_from_case_flows", "auto_from_flow_matrix"}
)

# type -> section whose row_ids the value must reference.
_FK_TARGET_SECTION = {"fk_actor": "actors", "fk_flow": "flow_matrix"}


def _is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, (list, dict)):
        return len(value) == 0
    return False


def _derived_id_field(section_id: str, field_ids: set[str]) -> str | None:
    """The `<prefix>.id` field of a section, if it declares one.

    It is filled from the row_id on export rather than typed by the
    analyst, so a submission must not carry it.
    """
    for fid in sorted(field_ids):
        if fid.endswith(".id"):
            return fid
    return None


def validate_dcf_data(
    data: DcfData,
    payload: DcfPayload,
    raw_schema: dict[str, Any],
    case: Case,
) -> DcfDataValidation:
    """Check `data` against the descriptor composed for the same case."""
    errors: list[DcfDataIssue] = []
    missing: list[DcfDataIssue] = []
    completeness: list[DcfSectionCompleteness] = []

    sections: dict[str, DcfSection] = {s.id: s for s in payload.sections}
    raw_sections: dict[str, dict[str, Any]] = {
        s["id"]: s for s in raw_schema.get("sections", [])
    }

    # row_ids present per section — needed to resolve foreign keys.
    row_ids_by_section = {
        sid: {r.row_id for r in rows} for sid, rows in data.rows_by_section.items()
    }
    site_ids = {s.id for s in case.sites}

    for section_id, rows in data.rows_by_section.items():
        section = sections.get(section_id)
        if section is None:
            errors.append(
                DcfDataIssue(
                    code="unknown_section",
                    section_id=section_id,
                    detail=f"Section {section_id!r} is not part of the DCF schema",
                )
            )
            continue
        if not section.active:
            errors.append(
                DcfDataIssue(
                    code="section_inactive",
                    section_id=section_id,
                    detail=(
                        f"Section {section_id!r} does not apply to this case "
                        f"(applies_when: {section.applies_when})"
                    ),
                )
            )
            continue
        if section.row_collection not in EDITABLE_ROW_COLLECTIONS:
            errors.append(
                DcfDataIssue(
                    code="section_not_editable",
                    section_id=section_id,
                    detail=(
                        f"Section {section_id!r} is derived "
                        f"({section.row_collection}) and stores no rows"
                    ),
                )
            )
            continue

        active_fields = {f.id: f for f in section.fields}
        all_field_ids = {
            f["id"] for f in raw_sections.get(section_id, {}).get("fields", [])
        }
        id_field = _derived_id_field(section_id, all_field_ids)
        required_ids = [
            fid for fid, f in active_fields.items() if f.required and fid != id_field
        ]

        seen: set[str] = set()
        filled_required = 0

        for row in rows:
            if row.row_id in seen:
                errors.append(
                    DcfDataIssue(
                        code="duplicate_row_id",
                        section_id=section_id,
                        row_id=row.row_id,
                        detail=f"row_id {row.row_id!r} appears more than once",
                    )
                )
            seen.add(row.row_id)

            for field_id, value in row.values.items():
                if field_id == id_field:
                    errors.append(
                        DcfDataIssue(
                            code="derived_field",
                            section_id=section_id,
                            row_id=row.row_id,
                            field_id=field_id,
                            detail=(
                                f"{field_id!r} is derived from row_id and must "
                                f"not be submitted"
                            ),
                        )
                    )
                    continue
                if field_id not in all_field_ids:
                    errors.append(
                        DcfDataIssue(
                            code="unknown_field",
                            section_id=section_id,
                            row_id=row.row_id,
                            field_id=field_id,
                            detail=f"{field_id!r} is not declared in section "
                            f"{section_id!r}",
                        )
                    )
                    continue
                if field_id not in active_fields:
                    errors.append(
                        DcfDataIssue(
                            code="field_not_active",
                            section_id=section_id,
                            row_id=row.row_id,
                            field_id=field_id,
                            detail=(
                                f"{field_id!r} is not activated for this case's "
                                f"pathway and must stay empty"
                            ),
                        )
                    )
                    continue

                _check_enum(
                    field=active_fields[field_id],
                    value=value,
                    section_id=section_id,
                    row_id=row.row_id,
                    errors=errors,
                )
                _check_foreign_key(
                    field=active_fields[field_id],
                    value=value,
                    section_id=section_id,
                    row_id=row.row_id,
                    row_ids_by_section=row_ids_by_section,
                    site_ids=site_ids,
                    errors=errors,
                )

            for field_id in required_ids:
                if _is_empty(row.values.get(field_id)):
                    missing.append(
                        DcfDataIssue(
                            code="missing_required",
                            section_id=section_id,
                            row_id=row.row_id,
                            field_id=field_id,
                            detail=(
                                f"{active_fields[field_id].label_en} is required "
                                f"for this case"
                            ),
                        )
                    )
                else:
                    filled_required += 1

        completeness.append(
            DcfSectionCompleteness(
                section_id=section_id,
                rows=len(rows),
                required_fields=len(required_ids) * len(rows),
                filled_required=filled_required,
            )
        )

    _check_layout(data, row_ids_by_section, errors)

    return DcfDataValidation(
        errors=errors, missing_required=missing, completeness=completeness
    )


def _check_enum(
    *,
    field: Any,
    value: Any,
    section_id: str,
    row_id: str,
    errors: list[DcfDataIssue],
) -> None:
    """Reject values outside an inline enum.

    Only inline `enum_values` are checked: fields declaring an
    `enum_ref` point at an engine enum (Q6a sectors, …) resolved
    elsewhere, and duplicating that resolution here would be a second
    source of truth.
    """
    if _is_empty(value) or not field.enum_values:
        return
    if value not in field.enum_values:
        errors.append(
            DcfDataIssue(
                code="invalid_enum",
                section_id=section_id,
                row_id=row_id,
                field_id=field.id,
                detail=(
                    f"{value!r} is not one of the allowed values for "
                    f"{field.id!r}"
                ),
            )
        )


def _check_foreign_key(
    *,
    field: Any,
    value: Any,
    section_id: str,
    row_id: str,
    row_ids_by_section: dict[str, set[str]],
    site_ids: set[str],
    errors: list[DcfDataIssue],
) -> None:
    """Resolve fk_actor / fk_flow (against DCF row_ids) and fk_site
    (against the Case's own sites)."""
    if _is_empty(value):
        return

    target_section = _FK_TARGET_SECTION.get(field.type)
    if target_section is not None:
        if value not in row_ids_by_section.get(target_section, set()):
            errors.append(
                DcfDataIssue(
                    code="broken_reference",
                    section_id=section_id,
                    row_id=row_id,
                    field_id=field.id,
                    detail=(
                        f"{value!r} does not match any row in section "
                        f"{target_section!r}"
                    ),
                )
            )
        return

    if field.type == "fk_site" and value not in site_ids:
        errors.append(
            DcfDataIssue(
                code="broken_reference",
                section_id=section_id,
                row_id=row_id,
                field_id=field.id,
                detail=f"{value!r} does not match any site declared on the case",
            )
        )


def _check_layout(
    data: DcfData,
    row_ids_by_section: dict[str, set[str]],
    errors: list[DcfDataIssue],
) -> None:
    """Canvas positions may only reference actor rows that exist."""
    actor_ids = row_ids_by_section.get("actors", set())
    for node_id in data.layout:
        if node_id not in actor_ids:
            errors.append(
                DcfDataIssue(
                    code="unknown_layout_ref",
                    section_id="actors",
                    row_id=node_id,
                    detail=(
                        f"layout references {node_id!r}, which is not an actor row"
                    ),
                )
            )
