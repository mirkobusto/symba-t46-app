"""Domain models for the IS-case object.

Architecture (Mirko design call 2c, round 2 nuance 2): typed shell
on the outer level with `model_config = ConfigDict(extra='forbid')`
to catch structural typos (`case.q8`, `case.flow`); inside each
pillar the config carrier is `dict[str, Any]` for flexibility, since
the engine writes ~150 dotted-path fields and Pydantic-typing every
one of them would be both verbose and constantly out-of-sync with
the schema JSONs.

The `dict[str, Any]` flexibility is bounded by the field-classification
allowlist in `validate_phase1_artifacts.py`: the validator confirms
that every dotted-path the engine writes is declared somewhere
(node / system / computed / cir_output). Type-safety at the field
level is a CI concern, not a runtime one.
"""
from __future__ import annotations

from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.domain.enums import (
    Q1,
    Q2,
    Q4,
    Q5,
    Q7,
    ComparisonGoal,
    DecisionContext,
    IlcdSituation,
    LccType,
    OperatingStart,
    Q6a,
    Q6b,
    ReferenceMarketScope,
    SlcaActivationState,
    StudyPhase,
)

# =============================================================================
# Sub-models
# =============================================================================


class Q3(BaseModel):
    """Q3 multi-checkbox: any subset of {ENV, ECO, SOC} can be active."""

    model_config = ConfigDict(extra="forbid")

    env: bool = False
    eco: bool = False
    soc: bool = False


class Flow(BaseModel):
    """A single IS-flow (input/output to be exchanged in the symbiosis).

    One per row of the Q5 tabular question. The `q5` value classifies the
    flow's valuation type (a..e); the engine uses this per-flow during
    activation of per_flow nodes.
    """

    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., description="Stable string identifier for this flow")
    name: str = Field(..., description="Human-readable flow name")
    q5: Q5

    # Optional descriptors (engine consumes if present)
    physical_quantity: float | None = None
    physical_unit: str | None = None
    notes: str | None = None

    # Optional, unanswered = no effect. Freedom-to-Act test (D4.1 §8.3.3): could
    # the generator sell this flow to a third party at a positive price? Read
    # only for notes against Q5; the DCF field classif.independent_market is
    # seeded from it.
    sellable_elsewhere: bool | None = None
    # What the flow is, among the five D4.1 Part 2 sectors (Q6a IDs, see
    # l0_compute.PART2_CHAPTER): names the sector chapter in a note.
    sector: Q6a | None = None
    # Optional: the typical IS configuration of the flow within its D4.1 Part 2
    # chapter (§4.1-§8.1, ids in sector_overlays.json `configurations`), which
    # names the conventional product the flow substitutes.
    configuration: str | None = None


class Site(BaseModel):
    """A geographic site participating in the IS network. Optional —
    populated for transport / spatial-coupling logic (the DCF Logistics section
    is open for every case since audit I-08, so co-located links are rows too).
    """

    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    latitude: float | None = None
    longitude: float | None = None
    country_iso2: str | None = None


class AlternativeScenario(BaseModel):
    """One alternative scenario. Each holds its own Q1-Q7 overrides
    relative to the baseline. v2 §3 dual data model.
    """

    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    overrides: dict[str, Any] = Field(default_factory=dict,
        description="Sparse dict of Q-answer overrides vs baseline")


# =============================================================================
# The Case object
# =============================================================================


class Case(BaseModel):
    """The IS-case object the user fills out and the engine processes.

    Field layout:

    - Identity / lifecycle: `id`, `created_at`, `study`
    - User answers: `q1`..`q7` + `flows` + `sites` + `alternative_scenarios`
    - Derived state (set by L0 triggers): `ilcd_situation`, `lcc_type`,
      `slca_activation_state`
    - Engine-written config: `lca`, `lcc`, `slca`, `report`, `governance`,
      `methodological_charter`, `review`, `system` — each is a free-form
      dict[str, Any] keyed by the dotted-path tail (e.g.,
      case.lca["functional_unit"], case.report["framing"]).

    The outer `extra='forbid'` catches typos like `case.q8` or `case.flow`.
    """

    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    @model_validator(mode="before")
    @classmethod
    def _read_retired_answers(cls, data: Any) -> Any:
        """Cases saved or exported before 2026-10-18 load unchanged:
        - the IS-01..IS-05 pathway (`pathway_id`, `is_01_extended`), a T4.6
          construct the deliverables do not know, is dropped;
        - the former Q2 options C (design phase) and D (baseline plus
          alternatives) are read as B, "not yet" (see enums.Q2);
        - the former Q7 option D (multi-scale programmes) is read as C."""
        if not isinstance(data, dict):
            return data
        if "pathway_id" in data or "is_01_extended" in data:
            data = {k: v for k, v in data.items() if k not in ("pathway_id", "is_01_extended")}
        if data.get("q2") in ("C", "D"):
            data = {**data, "q2": "B"}
        if data.get("q7") == "D":   # former multi-scale option (2026-10-18)
            data = {**data, "q7": "C"}
        return data

    # --- Identity / lifecycle ---
    id: UUID = Field(default_factory=uuid4)
    study_phase: StudyPhase = StudyPhase.SCREENING

    # --- User answers (Q1-Q7) ---
    q1: Q1 | None = None
    q2: Q2 | None = None
    # Q2b (only with Q2 = A) — has the network run for many years, so that the
    # plants it replaced would no longer be built today? True: the HNSRS is a
    # modern counterfactual built with the strategies of D4.1 §11.2.2 (L01250).
    # None = not answered: the plain HNSRS of §11.1.
    network_long_standing: bool | None = None
    q3: Q3 = Field(default_factory=Q3)
    # Q4 is multi-select: stored as a set of Q4 values
    q4: set[Q4] = Field(default_factory=set)
    q5: Q5 | None = None  # legacy single-flow fallback; per-flow primary
    q6a: Q6a | None = None
    q6b: Q6b | None = None
    q7: Q7 | None = None
    # Q7b — the market the reference (displaced) products come from (D4.1
    # §11.3.1): its name, free text, and its scope. Not the market of the
    # symbiosis products, nor ecoinvent's "reference product". Read through the
    # {reference_market} phrase of lca_mc_06 / lca_mc_27 (engine/answer_phrases.py).
    reference_market_region: str | None = Field(default=None, max_length=120)
    reference_market_scope: ReferenceMarketScope | None = None
    # Q8 (optional) — the study's time horizon, one for LCA and LCC (D4.2 §11,
    # L01261). Q8a: when the system operates (now / a future year); Q8b: how many
    # years the study follows it (analysis period); Q8c: technical lifetime of the
    # main assets, used only when the analysis period is not given (D4.2 §9.1).
    # None = not answered. Future background (lca_mc_21, lcc_hc_23, CIR-01) is
    # decided by activate.needs_future_background.
    operating_start: OperatingStart | None = None
    operating_start_year: int | None = Field(default=None, ge=1900, le=2200)
    analysis_period_years: float | None = Field(default=None, ge=0, le=500)
    # Q8c. None = not answered: the engine then reads the legacy advanced
    # override `asset_lifetime`.
    asset_lifetime_years: float | None = Field(default=None, ge=0, le=500)
    # Q9 (optional) — decision supported and scale of its consequences (D4.1
    # Table 1). None = not answered: the ILCD situation is inferred from Q1,
    # exactly as before Q9 existed.
    decision_context: DecisionContext | None = None
    # Q9b (only with Q9 = structural) — is it documented that the change displaces
    # about 1% or more of new capacity in the affected market (D4.1 §11.3.1,
    # L01293)? False: Situation A with B as a sensitivity (L00632). None: B, with a
    # note asking for the proof.
    market_screening_documented: bool | None = None
    # Q10 (optional) — does the study serve a public policy or territorial
    # planning objective? D4.2 §2.3 adds an S-LCC in that case. None = not
    # answered: the LCC type is inferred from Q1 (policy only for Q1=C).
    policy_objective: bool | None = None
    # Q11 (optional) — what the study compares: waste treatment, product
    # substitution or both (D4.1 Part 2 §4.3, §6.3, §8.3). Sets the basis of the
    # functional unit (lca_mc_07). None = not answered: the function-oriented FU
    # of Part 1 §5.2.1, as before Q11 existed.
    comparison_goal: ComparisonGoal | None = None

    # --- Tabular answers ---
    flows: list[Flow] = Field(default_factory=list)
    sites: list[Site] = Field(default_factory=list)
    alternative_scenarios: list[AlternativeScenario] = Field(default_factory=list)

    # --- Derived state (set by L0 triggers in app/engine/l0_compute.py) ---
    ilcd_situation: IlcdSituation | None = None
    lcc_type: LccType | None = None
    slca_activation_state: SlcaActivationState | None = None

    # --- Engine-written config (free-form dotted-path-keyed dicts per pillar) ---
    lca: dict[str, Any] = Field(default_factory=dict,
        description="LCA pillar config; keys are dotted-path tails after 'lca.'")
    lcc: dict[str, Any] = Field(default_factory=dict)
    slca: dict[str, Any] = Field(default_factory=dict)
    report: dict[str, Any] = Field(default_factory=dict)
    governance: dict[str, Any] = Field(default_factory=dict)
    methodological_charter: dict[str, Any] = Field(default_factory=dict)
    review: dict[str, Any] = Field(default_factory=dict)
    system: dict[str, Any] = Field(default_factory=dict)

    # --- Advanced overrides (Step 4 layer; defensive readers in
    #     l1_blocks/activate/l2_validate already handle missing keys) ---
    advanced: dict[str, Any] = Field(default_factory=dict,
        description="Advanced expert-mode overrides. Free-form dict keyed "
                    "by override name (e.g. 'slca_framework_override', "
                    "'allocation_method_override', 'asset_lifetime'). "
                    "Engine modules read this via getattr/dict.get; missing "
                    "keys mean 'use the default'.")

    # --- Engine output (populated as pipeline runs) ---
    activated_nodes: list[str] = Field(default_factory=list,
        description="Phase 1 node IDs that have been activated for this case")
    blocked_by: list[str] = Field(default_factory=list,
        description="L1 BLOCK IDs that fired (non-empty means STOP)")
    rule_violations: list[dict[str, Any]] = Field(default_factory=list,
        description="L2 rule violations raised during validation")
    applicable_rules: list[dict[str, Any]] = Field(default_factory=list,
        description=("L2 rules whose trigger fired for this case — the "
                     "methodological practices the case has to document. "
                     "Emitted on the trigger, not on the assertion: the "
                     "assertions compare engine-written prose and cannot "
                     "verify what the analyst did outside the tool."))
    warnings: list[dict[str, Any]] = Field(default_factory=list,
        description=("Notes about the user's answers, each {'code', 'message'}: a new "
                     "question that contradicts what Q1 implies, a combination the "
                     "deliverables treat as unusual. Informational: they never block "
                     "the run and never change a value on their own. Rebuilt on every "
                     "run by l0_compute (the first phase), later phases append. Optional "
                     "'params' (flow, chapter, variant) let the client translate the note "
                     "by code; 'message' stays the English text."))
    cdp_flags: list[dict[str, Any]] = Field(default_factory=list,
        description="L3 CDP tensions surfaced at reporting")
    sector_rules: list[dict[str, Any]] = Field(default_factory=list,
        description=("D4.1 Part 2 sector rules of the chapters the case touches (a flow's "
                     "declared sector or Q6a), as mandates to document: each with chapter, "
                     "strength, condition, statement and deliverable lines. Rebuilt on every "
                     "run by engine/sector_rules."))
