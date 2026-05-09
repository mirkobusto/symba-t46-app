"""Enumerated valid values for the IS-case answer space.

These enums encode the 7 user-facing questions' answer domains plus the
derived states (lcc_type, study_phase, slca_activation_state, ilcd_situation).

References:
- v2 §3 (the 7 user-facing questions)
- v2 §9 (JSON-exportable schema)
- field_gaps.md (round 2 closure log) for the derived-state enums
"""
from __future__ import annotations

from enum import StrEnum

# =============================================================================
# Q1-Q7 user-facing answer domains
# =============================================================================


class Q1(StrEnum):
    """Q1 — IS scenario archetype (single select). Drives ILCD situation."""

    A = "A"  # specific exchange between two companies
    B = "B"  # eco-park / pre-formed network
    C = "C"  # sector-wide pre-feasibility
    D = "D"  # corporate ESG (single firm in network context)
    E = "E"  # public-sector / regulator perspective


class Q2(StrEnum):
    """Q2 — Temporal stance (single select). Drives ex-post / ex-ante / dynamic."""

    A = "A"  # ex-post (operating IS, retrospective)
    B = "B"  # ex-ante mainly, static parameters
    C = "C"  # ex-ante with dynamic scenarios (no baseline)
    D = "D"  # ex-ante baseline + N alternative scenarios


# Q3 is multi-checkbox: any subset of {ENV, ECO, SOC} can be active.
# Modeled as 3 booleans on the Case object, not as an Enum.


class Q4(StrEnum):
    """Q4 — Use-of-results (multi-select). Drives review and disclosure."""

    A = "A"  # internal-only (R&D / decision support)
    B = "B"  # business-to-business (no public claim)
    C = "C"  # public superiority claim (panel review mandatory)
    D = "D"  # EU policy alignment / PEF
    E = "E"  # academic publication (peer review)


class Q5(StrEnum):
    """Q5 — Per-flow valuation type (one row per IS-flow)."""

    a = "a"  # waste/by-product, zero burden
    b = "b"  # contested EVT (economic vs technical)
    c = "c"  # substitution / Q-correction
    d = "d"  # interdependent multifunctional production
    e = "e"  # aggregated / black-box


class Q6a(StrEnum):
    """Q6a — Sector overlay (single select).

    TODO(sprint4-step3): v2 §3 enumerates 14 sectors. Current scaffold
    has only 5 + NONE + OTHER as placeholder. Expand to the full 14
    when sector_overlays.json (v2 §7) is wired in. Sector-specific
    activations (e.g., lca_mc_30 wastewater AWARE) read this enum.
    """

    NONE = "none"
    WASTEWATER_BIOFACTORIES = "wastewater_biofactories"
    AGRI_FOOD = "agri_food"
    PROCESS_INDUSTRY = "process_industry"
    OTHER = "other"


class Q6b(StrEnum):
    """Q6b — TRL band (single select). Drives scale-up frameworks."""

    TRL9 = "TRL9"
    TRL7_8 = "TRL7-8"
    TRL5_6 = "TRL5-6"
    TRL_LT_5 = "TRL<5"


class Q7(StrEnum):
    """Q7 — Geographic spread (single select). Drives transport+spatial coupling."""

    A = "A"  # single site / co-located
    B = "B"  # within metropolitan area
    C = "C"  # regional / national
    D = "D"  # cross-border / multi-country


# =============================================================================
# Derived states (computed from Q1-Q3 by L0 trigger nodes)
# =============================================================================


class IlcdSituation(StrEnum):
    """Set by lca_t1 (and co-asserted by lca_mc_01).

    Values are parens-free for clean URL/JSON serialization. Display labels
    with parens (e.g. 'Situation A (multi-actor)') are a frontend concern.
    """

    SITUATION_A = "ILCD Situation A"
    SITUATION_A_MULTI = "ILCD Situation A multi-actor"
    SITUATION_B = "ILCD Situation B"
    SITUATION_C1 = "ILCD Situation C1"
    SITUATION_C2 = "ILCD Situation C2"


class LccType(StrEnum):
    """Set by lcc_trig_01."""

    DEACTIVATED = "deactivated"           # Q3.ECO=false
    C_LCC_PLUS_E_LCC = "C+E"              # Q1∈{A,B,E} AND Q3.ECO=true
    E_LCC_PLUS_S_LCC_PLUS_NTF = "C+E+S"   # Q1=C AND Q3.ECO=true
    C_LCC_ONLY = "C-LCC"                  # Q1=D AND Q3.ECO=true


class SlcaActivationState(StrEnum):
    """Set by slca_t_01."""

    ACTIVE = "active"
    DEACTIVATED = "deactivated"


class StudyPhase(StrEnum):
    """system_fields.study.phase — case lifecycle phase (call 4 = simple)."""

    SCREENING = "screening"
    DETAILED = "detailed"


# =============================================================================
# Pathway IDs (from §3 user-facing questions × Q1×Q2)
# =============================================================================


class PathwayId(StrEnum):
    """The 5 IS pathways derived from Q1 × Q2."""

    IS_01 = "IS-01"
    IS_02 = "IS-02"
    IS_03 = "IS-03"
    IS_04 = "IS-04"
    IS_05 = "IS-05"
