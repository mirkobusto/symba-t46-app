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
    """One field row in a DCF section that survived the activation filter.

    `derived` marks a column the analyst does not fill in: the schema
    declares `actor.id` / `flow.id` / `infra.id` as required fields, but
    since the Network Builder they are filled from the row id the client
    assigns, and submitting them is rejected. Marking them here keeps the
    descriptor from asking for something the API refuses.
    """

    model_config = ConfigDict(extra="ignore")

    id: str
    label_en: str
    type: str
    required: bool = False
    activation_predicate: str
    derived: bool = False
    enum_values: list[str] | None = None
    enum_ref: str | None = None
    description_en: str | None = None
    default: Any = None
    min: float | None = None
    max: float | None = None
    row_condition: str | None = None
    source_ref: str | None = None
    # in the reader's language (services.dcf_terms.localize); None until then
    label: str | None = None
    help: str | None = None
    reason: str | None = None
    enum_labels: dict[str, str] | None = None


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
    # who fills the section in: "company", "analyst" or "both" (UX round 5,
    # D4/D10; from a code table until the schema carries it)
    filled_by: str | None = None
    row_collection: str
    active: bool
    fields: list[DcfFieldDescriptor] = Field(default_factory=list)
    # in the reader's language (services.dcf_terms.localize); None until then
    title: str | None = None
    description: str | None = None


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


# The rules and the mandates are the same kind of thing — practices this
# case has to document — arriving from two different files. The DCF is
# where documenting happens, so they are merged into one list here rather
# than shown twice in two formats.
CROSS_METHOD_CATEGORY = "Cross-method consistency"


class DcfObligation(BaseModel):
    """One practice the case has to document.

    `origin` says where it comes from: a procedural_mandate node of
    Phase 1, or a cross-method rule whose trigger fired for this case.
    Keeping the distinction visible matters for traceability — a reviewer
    checks a rule differently from a mandate — but the analyst's job is
    the same for both.
    """

    model_config = ConfigDict(extra="forbid")

    id: str
    origin: str  # "mandate" | "rule"
    title: str | None = None
    statement: str
    method: str
    category: str
    trigger: str | None = None
    fields: list[str] = Field(default_factory=list)
    fields_not_applicable: list[str] = Field(default_factory=list)
    source_section: str | None = None
    # reader-facing, filled by dcf_terms.localize / compose (UX round 4): the
    # category and the kind of item in words, and why it applies in answers
    # rather than as a trigger expression
    category_label: str | None = None
    origin_label: str | None = None
    because: str | None = None


class DcfPayload(BaseModel):
    """Full DCF descriptor for a single Case.

    Contains everything an xlsx writer / docx writer / UI renderer needs
    to produce its artefact, with the activation filtering already
    applied. Not persisted (regenerated on demand, per DCF spec §11 D6).
    """

    model_config = ConfigDict(extra="forbid")

    schema_version: str
    case_id: str
    ilcd_situation: str | None = None
    lcc_type: str | None = None
    slca_activation_state: str | None = None
    # charter answers shown on the cover (2026-10-18)
    study_purpose: str | None = None
    reference_market: str | None = None
    # a costing-only study has no ILCD situation to show (UX round 5, P3-04)
    costing_only: bool = False

    sections: list[DcfSection] = Field(default_factory=list)
    mandates_by_category: dict[str, list[DcfMandate]] = Field(default_factory=dict)
    obligations: list[DcfObligation] = Field(default_factory=list)
    network_render_spec: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# Compose
# ---------------------------------------------------------------------------


# Sentinel section ids that get derived treatment.
_METHODOLOGICAL_SECTION_ID = "methodological_choices"
_NETWORK_SECTION_ID = "network_diagram"

# Sector values kept in the schema for cases saved before the Q6a list was
# rebuilt; they are not offered in the DCF dropdowns any more, where they read
# as "(legacy)" duplicates of current sectors (UX round 2026-11-03).
_LEGACY_ENUM_VALUES = {"wastewater_biofactories", "agri_food", "process_industry"}

# Values a field no longer offers but still accepts from stored content: the
# flow type is the physical nature of the flow; waste or by-product is the
# classification's judgement, and the two contradicted each other in one row
# (UX round 5, D5, P2-09 / P3-13). The schema keeps them.
_RETIRED_ENUM_VALUES: dict[str, set[str]] = {"flow.type": {"waste", "by_product"}}

# Who fills each section in (D4): the companies supply primary data on flows,
# transport, costs and assets (D4.1 §9.3.2; D4.2 §7.1); the classification is
# the analyst's judgement; the reference scenario is answered by the companies
# and decided by the analyst.
_SECTION_FILLED_BY = {
    "actors": "company", "flow_matrix": "company", "logistics": "company",
    "costs": "company", "infrastructure": "company",
    "flow_classification": "analyst", "methodological_choices": "analyst",
    "reference_scenario": "both",
}

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
            `app.engine.pipeline.run` — ilcd_situation /
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
                    if clean.get("enum_values"):
                        retired = _LEGACY_ENUM_VALUES | _RETIRED_ENUM_VALUES.get(clean["id"], set())
                        clean["enum_values"] = [v for v in clean["enum_values"] if v not in retired]
                    active_fields.append(DcfFieldDescriptor(**clean))

        _mark_derived_ids(active_fields)
        sections_out.append(DcfSection(
            id=sec_id,
            filled_by=_SECTION_FILLED_BY.get(sec_id),
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
        ilcd_situation=case.ilcd_situation.value if case.ilcd_situation else None,
        costing_only=bool(case.q3 and case.q3.eco and not case.q3.env),
        study_purpose=case.study_purpose.value.capitalize() if case.study_purpose else None,
        reference_market=(" ".join(x for x in (
            case.reference_market_region,
            f"({case.reference_market_scope.value.replace('_', '-')})" if case.reference_market_scope else None)
            if x) or None),
        lcc_type=case.lcc_type.value if case.lcc_type else None,
        slca_activation_state=(
            case.slca_activation_state.value if case.slca_activation_state else None
        ),
        sections=sections_out,
        mandates_by_category=mandates_by_category,
        obligations=_compose_obligations(case, mandates_by_category),
        network_render_spec=network_render_spec,
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _mark_derived_ids(fields: list[DcfFieldDescriptor]) -> None:
    """Flag the section's `<prefix>.id` column as engine-filled."""
    for field in fields:
        if field.id.endswith(".id"):
            field.derived = True
            field.required = False


def _make_derived_section(sec_schema: dict[str, Any], active: bool) -> DcfSection:
    return DcfSection(
        id=sec_schema["id"],
        filled_by=_SECTION_FILLED_BY.get(sec_schema["id"]),
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
                statement=_case_statement(item["id"], case) or item["statement"],
                category=category,
                trigger_q=item.get("trigger_q"),
                trigger_condition=item.get("trigger_condition"),
                source_section=item.get("source_section"),
            ))
    return by_category


def _case_statement(node_id: str, case: Case) -> str | None:
    """The branch of a discriminative mandate that holds for this case.

    The census joins every branch with " | " ("NO zero-burden allowed
    (interdependent) | Standard zero-burden test"), so the DCF a partner
    receives listed alternatives as if all applied, while the result page
    said one thing per flow (UX round 4, P2-05). A per-flow node gives one
    line per flow, named; the others the branch of the case."""
    from app.engine.answer_phrases import fill
    from app.engine.branch_keys import Answers, pick_branch
    from app.engine.loader import load_schemas

    node = load_schemas().nodes_by_id.get(node_id)
    default = node.get("default_value") if node else None
    if not isinstance(default, dict):
        return None
    if node.get("per_flow") and case.flows:
        lines = []
        for flow in case.flows:
            matched, value = pick_branch(default, Answers.from_case(case, flow))
            if matched and value:
                lines.append(f"{flow.name or flow.id}: {fill(str(value), case)}")
        return "; ".join(lines) or None
    matched, value = pick_branch(default, Answers.from_case(case))
    return fill(str(value), case) if matched and value else None


def _method_of(fields: list[str]) -> str:
    """Which pillar(s) a rule governs, from its field paths."""
    prefixes = {f.split(".")[0].upper() for f in fields}
    known = {p for p in prefixes if p in {"LCA", "LCC", "SLCA"}}
    if len(known) == 1:
        return known.pop()
    return "cross-method"


def _because(trigger: str | None, case: Case) -> str | None:
    """Why an item applies, in the answers it reads ("Q3 = env + eco"), not
    as a trigger expression ("Q3 has ≥2 dims active", "flow.q5 == 'b'")."""
    from app.services.narrative import answers_in
    if not trigger:
        return None
    answers = answers_in(trigger.replace("flow.q5", "Q5").replace("case.q", "Q"), case)
    return ", ".join(f"{label} = {value}" for label, value in answers) or None


def _compose_obligations(
    case: Case, by_category: dict[str, list[DcfMandate]]
) -> list[DcfObligation]:
    """Merge the procedural mandates with the cross-method rules that
    fired, in that order: the mandates describe the practice of each
    method, the rules describe what has to line up between them."""
    out = [
        DcfObligation(
            id=mandate.node_id,
            origin="mandate",
            statement=mandate.statement,
            method=mandate.method,
            category=category,
            trigger=mandate.trigger_condition,
            source_section=mandate.source_section,
            because=_because(mandate.trigger_condition, case),
        )
        for category, mandates in by_category.items()
        for mandate in mandates
    ]
    out.extend(
        DcfObligation(
            id=str(rule.get("rule_id", "")),
            origin="rule",
            title=rule.get("name"),
            statement=str(rule.get("statement", "")),
            method=_method_of(list(rule.get("fields") or [])),
            category=CROSS_METHOD_CATEGORY,
            trigger=rule.get("trigger"),
            because=_because(rule.get("trigger"), case),
            fields=list(rule.get("fields") or []),
            fields_not_applicable=list(rule.get("fields_not_applicable") or []),
        )
        for rule in case.applicable_rules
    )
    return out


def _case_id_str(case_id: UUID | str) -> str:
    return str(case_id)
