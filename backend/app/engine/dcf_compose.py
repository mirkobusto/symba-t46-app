"""DCF compose — assemble a DcfPayload from a post-pipeline Case.

Pure function over the immutable inputs (Case, dcf_schema dict, mandates
census dict). No side effects, no I/O. Output is a Pydantic model ready
to be serialized to JSON (API response), or handed to the xlsx/docx
writers.

The compose step:
1. Build the eval context from the Case (`predicate.build_context_from_case`).
2. For each section in `dcf_schema.sections`:
   - Evaluate `applies_when` to decide if the section is active.
   - For data sections: evaluate each field's `activation_predicate` and
     keep only the True ones.
   - For section "methodological_choices": pull the procedural_mandate
     nodes from `Case.activated_nodes`, intersect with the census, group
     by category.
   - For section "network_diagram": pass through the render_spec.
3. Return a DcfPayload with case-level metadata + the assembled sections.
"""
from __future__ import annotations

from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.domain.models import Case
from app.engine.predicate import build_context_from_case, evaluate


# ---------------------------------------------------------------------------
# Output models (Pydantic v2)
# ---------------------------------------------------------------------------


class DcfFieldDescriptor(BaseModel):
    """One field row in a DCF section that survived the activation filter."""

    model_config = ConfigDict(extra="ignore")

    id: str
    label_en: str
    type: str
    required: bool = False
    activation_predicate: str
    enum_values: list[str] | None = None
    enum_ref: str | None = None
    description_en: str | None = None
    default: Any = None
    min: float | None = None
    max: float | None = None
    row_condition: str | None = None
    source_ref: str | None = None


class DcfSection(BaseModel):
    """A section in the DcfPayload. `active` is False when the section's
    own `applies_when` evaluated False (e.g. logistics when q7=A).

    For derived sections (methodological_choices, network_diagram) the
    `fields` list is empty; payload lives in the DcfPayload-level
    `mandates_by_category` and `network_render_spec`.
    """

    model_config = ConfigDict(extra="forbid")

    id: str
    title_en: str
    description_en: str
    applies_when: str
    row_collection: str
    active: bool
    fields: list[DcfFieldDescriptor] = Field(default_factory=list)


class DcfMandate(BaseModel):
    """One procedural_mandate node activated for this case."""

    model_config = ConfigDict(extra="forbid")

    node_id: str
    method: str
    statement: str
    category: str
    trigger_q: list[str] | None = None
    trigger_condition: str | None = None
    source_section: str | None = None


class DcfPayload(BaseModel):
    """Full DCF descriptor for a single Case.

    Contains everything an xlsx writer / docx writer / UI renderer needs
    to produce its artefact, with the activation filtering already
    applied. Not persisted (regenerated on demand, per DCF spec §11 D6).
    """

    model_config = ConfigDict(extra="forbid")

    schema_version: str
    case_id: str
    pathway_id: str | None = None
    ilcd_situation: str | None = None
    lcc_type: str | None = None
    slca_activation_state: str | None = None
    is_01_extended: bool = False

    sections: list[DcfSection] = Field(default_factory=list)
    mandates_by_category: dict[str, list[DcfMandate]] = Field(default_factory=dict)
    network_render_spec: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# Compose
# ---------------------------------------------------------------------------


# Sentinel section ids that get derived treatment.
_METHODOLOGICAL_SECTION_ID = "methodological_choices"
_NETWORK_SECTION_ID = "network_diagram"

# Keys we pass through from the JSON field schema into DcfFieldDescriptor.
_FIELD_KEYS = {
    "id", "label_en", "type", "required", "activation_predicate",
    "enum_values", "enum_ref", "description_en", "default",
    "min", "max", "row_condition", "source_ref",
}


def compose_dcf(
    case: Case,
    dcf_schema: dict[str, Any],
    mandates_census: dict[str, Any],
) -> DcfPayload:
    """Build a DcfPayload from a post-pipeline Case.

    Args:
        case: a Case that has already been processed by
            `app.engine.pipeline.run` — pathway_id / ilcd_situation /
            activated_nodes etc. must be populated.
        dcf_schema: the JSON loaded from `app/schemas/dcf_schema.json`.
        mandates_census: the JSON loaded from
            `coordination/dcf_mandates_census.json` — used to pull the
            procedural_mandate nodes for section 5.5.

    Returns: DcfPayload.
    """
    ctx = build_context_from_case(case)

    sections_out: list[DcfSection] = []
    mandates_by_category: dict[str, list[DcfMandate]] = {}
    network_render_spec: dict[str, Any] | None = None

    for sec_schema in dcf_schema["sections"]:
        sec_id = sec_schema["id"]
        applies_when = sec_schema.get("applies_when", "always")
        sec_active = evaluate(applies_when, ctx)

        if sec_id == _METHODOLOGICAL_SECTION_ID:
            if sec_active:
                mandates_by_category = _compose_mandates(
                    case, mandates_census, sec_schema
                )
            sections_out.append(_make_derived_section(sec_schema, sec_active))
            continue

        if sec_id == _NETWORK_SECTION_ID:
            if sec_active:
                network_render_spec = sec_schema.get("render_spec")
            sections_out.append(_make_derived_section(sec_schema, sec_active))
            continue

        # Regular section with fields.
        active_fields: list[DcfFieldDescriptor] = []
        if sec_active:
            for field_schema in sec_schema.get("fields", []):
                pred = field_schema.get("activation_predicate", "always")
                if evaluate(pred, ctx):
                    clean = {k: v for k, v in field_schema.items() if k in _FIELD_KEYS}
                    active_fields.append(DcfFieldDescriptor(**clean))

        sections_out.append(DcfSection(
            id=sec_id,
            title_en=sec_schema["title_en"],
            description_en=sec_schema["description_en"],
            applies_when=applies_when,
            row_collection=sec_schema.get("row_collection", "user_added"),
            active=sec_active,
            fields=active_fields,
        ))

    return DcfPayload(
        schema_version=dcf_schema.get("meta", {}).get("schema_version", "unknown"),
        case_id=_case_id_str(case.id),
        pathway_id=case.pathway_id.value if case.pathway_id else None,
        ilcd_situation=case.ilcd_situation.value if case.ilcd_situation else None,
        lcc_type=case.lcc_type.value if case.lcc_type else None,
        slca_activation_state=(
            case.slca_activation_state.value if case.slca_activation_state else None
        ),
        is_01_extended=case.is_01_extended,
        sections=sections_out,
        mandates_by_category=mandates_by_category,
        network_render_spec=network_render_spec,
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_derived_section(sec_schema: dict[str, Any], active: bool) -> DcfSection:
    return DcfSection(
        id=sec_schema["id"],
        title_en=sec_schema["title_en"],
        description_en=sec_schema["description_en"],
        applies_when=sec_schema.get("applies_when", "always"),
        row_collection=sec_schema.get("row_collection", "derived"),
        active=active,
        fields=[],
    )


def _compose_mandates(
    case: Case,
    mandates_census: dict[str, Any],
    sec_schema: dict[str, Any],
) -> dict[str, list[DcfMandate]]:
    """Pull procedural_mandate nodes activated for this case and group by
    the categories declared in `sec_schema.auto_source.categories`.

    A mandate is included iff its node_id appears in `case.activated_nodes`.
    Categories with no surviving mandate are omitted from the output dict
    (keeps the report concise).
    """
    activated = set(case.activated_nodes)
    declared_categories = sec_schema.get("auto_source", {}).get("categories", [])
    buckets = mandates_census.get("buckets", {})

    by_category: dict[str, list[DcfMandate]] = {}
    for category in declared_categories:
        for item in buckets.get(category, []):
            if item["id"] not in activated:
                continue
            by_category.setdefault(category, []).append(DcfMandate(
                node_id=item["id"],
                method=item["method"],
                statement=item["statement"],
                category=category,
                trigger_q=item.get("trigger_q"),
                trigger_condition=item.get("trigger_condition"),
                source_section=item.get("source_section"),
            ))
    return by_category


def _case_id_str(case_id: UUID | str) -> str:
    return str(case_id)
