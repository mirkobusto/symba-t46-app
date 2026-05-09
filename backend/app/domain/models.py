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

from typing import Any, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field

from app.domain.enums import (
    Q1,
    Q2,
    Q4,
    Q5,
    Q6a,
    Q6b,
    Q7,
    IlcdSituation,
    LccType,
    PathwayId,
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
    physical_quantity: Optional[float] = None
    physical_unit: Optional[str] = None
    notes: Optional[str] = None


class Site(BaseModel):
    """A geographic site participating in the IS network. Optional —
    populated when Q7 in {B,C,D} for transport / spatial-coupling logic.
    """

    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    country_iso2: Optional[str] = None


class AlternativeScenario(BaseModel):
    """One alternative scenario (Q2=D). Each holds its own Q1-Q7 overrides
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
    - Pathway: `pathway_id` (set by `engine.activate.derive_pathway`)
    - Engine-written config: `lca`, `lcc`, `slca`, `report`, `governance`,
      `methodological_charter`, `review`, `system` — each is a free-form
      dict[str, Any] keyed by the dotted-path tail (e.g.,
      case.lca["functional_unit"], case.report["framing"]).

    The outer `extra='forbid'` catches typos like `case.q8` or `case.flow`.
    """

    model_config = ConfigDict(extra="forbid", validate_assignment=True)

    # --- Identity / lifecycle ---
    id: UUID = Field(default_factory=uuid4)
    study_phase: StudyPhase = StudyPhase.SCREENING

    # --- User answers (Q1-Q7) ---
    q1: Optional[Q1] = None
    q2: Optional[Q2] = None
    q3: Q3 = Field(default_factory=Q3)
    # Q4 is multi-select: stored as a set of Q4 values
    q4: set[Q4] = Field(default_factory=set)
    q5: Optional[Q5] = None  # legacy single-flow fallback; per-flow primary
    q6a: Optional[Q6a] = None
    q6b: Optional[Q6b] = None
    q7: Optional[Q7] = None

    # --- Tabular answers ---
    flows: list[Flow] = Field(default_factory=list)
    sites: list[Site] = Field(default_factory=list)
    alternative_scenarios: list[AlternativeScenario] = Field(default_factory=list)

    # --- Derived state (set by L0 triggers in app/engine/l0_compute.py) ---
    ilcd_situation: Optional[IlcdSituation] = None
    lcc_type: Optional[LccType] = None
    slca_activation_state: Optional[SlcaActivationState] = None

    # --- Pathway (set by app/engine/pathway.py:derive) ---
    pathway_id: Optional[PathwayId] = None
    is_01_extended: bool = Field(default=False,
        description="True iff pathway_id is IS-01 AND q2 is Q2.D — captures "
                    "the 'IS-01 extended' annotation (baseline + N alternative "
                    "scenarios; WorkingDoc §3.3). Set by pathway.derive.")

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

    # --- Engine output (populated as pipeline runs) ---
    activated_nodes: list[str] = Field(default_factory=list,
        description="Phase 1 node IDs that have been activated for this case")
    blocked_by: list[str] = Field(default_factory=list,
        description="L1 BLOCK IDs that fired (non-empty means STOP)")
    rule_violations: list[dict[str, Any]] = Field(default_factory=list,
        description="L2 rule violations raised during validation")
    cdp_flags: list[dict[str, Any]] = Field(default_factory=list,
        description="L3 CDP tensions surfaced at reporting")
