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
# User-facing answer domains (Q0-Q12)
# =============================================================================


class Q1(StrEnum):
    """Q1 — IS scenario archetype (single select). Drives ILCD situation."""

    A = "A"  # specific exchange between two companies
    B = "B"  # eco-park / pre-formed network
    C = "C"  # sector-wide pre-feasibility
    D = "D"  # corporate ESG (single firm in network context)
    E = "E"  # public-sector / regulator perspective


class Q2(StrEnum):
    """Q2 — Do the symbiotic exchanges the study measures already take place?
    The only timing D4.1 §11.1 and D4.2 §7.1 know: ex-post or ex-ante. Until
    2026-10-18 Q2 had four options; the former C (design phase) and D (baseline
    plus alternatives) are read as B, since scenarios belong to every study
    (D4.1 §4.3.3) and the CNSRS of an ex-ante study already holds what operates
    today."""

    A = "A"  # yes: ex-post (HNSRS, D4.1 §11.1)
    B = "B"  # not yet: ex-ante (CNSRS, D4.1 §11.1)


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
    """Q6a — Sector overlay (single select). 14 official sectors per
    SPRINT4_BOOTSTRAP_v2 §3 + NONE + OTHER, mirroring the IDs in
    backend/app/schemas/sector_overlays.json. Sector-specific
    activations (e.g., lca_mc_30 wastewater AWARE) read this enum.
    """

    # Special placeholders
    NONE = "none"
    OTHER = "other"

    # 14 canonical sectors (snake_case stable IDs)
    AGRICULTURE_AGRIFOOD_BIOREFINERIES = "agriculture_agrifood_biorefineries"
    BIOBASED_POLYMERS = "biobased_polymers"
    PLASTICS_PACKAGING = "plastics_packaging"
    PULP_PAPER = "pulp_paper"
    CHEMICALS_FERTILIZERS = "chemicals_fertilizers"
    CEMENT_CONSTRUCTION = "cement_construction"
    STEEL_METALS = "steel_metals"
    ENERGY_UTILITIES = "energy_utilities"
    WASTEWATER_SLUDGE_BIOFACTORIES = "wastewater_sludge_biofactories"
    TEXTILE_LEATHER = "textile_leather"
    WASTE_VALORIZATION = "waste_valorization"
    FOOD_PRODUCTION = "food_production"
    MULTI_TENANT_URBAN_BUILDING = "multi_tenant_urban_building"
    MULTI_SECTOR = "multi_sector"

    # --- Legacy aliases (Step 4 placeholders, kept for backwards-
    # compatibility of stored cases / older fixtures) ---
    WASTEWATER_BIOFACTORIES = "wastewater_biofactories"
    AGRI_FOOD = "agri_food"
    PROCESS_INDUSTRY = "process_industry"


class Q6b(StrEnum):
    """Q6b — TRL band (single select). Drives scale-up frameworks."""

    TRL9 = "TRL9"
    TRL7_8 = "TRL7-8"
    TRL5_6 = "TRL5-6"
    TRL_LT_5 = "TRL<5"


class Q7(StrEnum):
    """Q7 — How concentrated are the key interactions? It sets the regionalised
    characterisation of the LCIA (D4.1 §12.2.3, §12.3.3), not the transport,
    which is explicit for every exchange (§12.3.1). No distance threshold stands
    behind the values. Until 2026-10-18 there was a D (multi-scale programmes);
    it loads as C."""

    A = "A"  # one site or adjacent plants: intensely local interactions
    B = "B"  # within one region
    C = "C"  # across regions or borders


class StudyPurpose(StrEnum):
    """Q0 (optional) — the purpose of the study in the IS typology D4.1 §4.3.2
    asks to declare in the goal (Mattila et al., 2012). It derives nothing: it
    goes into the charter, the report and the DCF, and the engine notes answers
    that do not fit it (owner decision 2026-10-18)."""

    ANALYSIS = "analysis"            # evaluate an existing network's performance
    IMPROVEMENT = "improvement"      # hotspots within an existing network, to optimise it
    EXPANSION = "expansion"          # adding a new partner or exchange
    DESIGN = "design"                # options for a new, planned network
    RESTRUCTURING = "restructuring"  # a major reconfiguration of an established network


class ReferenceMarketScope(StrEnum):
    """Spatial scope of the market the reference (displaced) products come from
    (D4.1 §11.3.1, L01291): national or sub-national as a rule, continental only
    for globally traded commodities with no sub-continental market."""

    NATIONAL = "national"
    SUB_NATIONAL = "sub_national"
    CONTINENTAL = "continental"


# =============================================================================
# Derived states (computed from Q1-Q3 by L0 trigger nodes)
# =============================================================================


class DecisionContext(StrEnum):
    """Q9 — does the study support a decision, and at what scale? Required in the
    questionnaire since #114; saved cases without it fall back on Q1.

    D4.1 Table 1 derives the ILCD situation from this, not from the subject
    of the study: MICRO explores or supports a choice, even a hypothetical one,
    with effects that stay in the plants involved (A, L00624); STRUCTURAL one
    whose effects change what a market produces (B, proof required, L00632);
    NONE documents an existing network (C1); CORPORATE_REPORT is the strict
    reporting of one company in isolation, with no credits (C2, L00868).
    """

    NONE = "none"
    MICRO = "micro"
    STRUCTURAL = "structural"
    CORPORATE_REPORT = "corporate_report"


class ComparisonGoal(StrEnum):
    """Q11 (optional) — what the study compares, which sets the basis of the
    functional unit (D4.1 Part 2 §4.3, §6.3, §8.3; Part 1 §5.2.1, §5.3.2).

    WASTE_TREATMENT: waste management routes or plant/service performance →
    input-based FU. PRODUCT_SUBSTITUTION: products against market alternatives or
    substitution claims → output-based FU. CO_PRIMARY: both functions matter →
    system of functional units.
    """

    WASTE_TREATMENT = "waste_treatment"
    PRODUCT_SUBSTITUTION = "product_substitution"
    CO_PRIMARY = "co_primary"


class OperatingStart(StrEnum):
    """Q8a (optional) — when does the assessed system operate?

    NOW: the year of the study (background of that year, near-term projections
    in sensitivity, D4.1 §11.3.1). FUTURE: a future operating year, which calls
    for future-projected background in LCA and LCC alike (D4.1 §9.3.5, §12.3.2;
    D4.2 §11 requires the same time horizon in both).
    """

    NOW = "now"
    FUTURE = "future"


class IlcdSituation(StrEnum):
    """Set by lca_t1 (and co-asserted by lca_mc_01).

    Values are parens-free for clean URL/JSON serialization. Display labels
    with parens (e.g. 'Situation A (multi-actor)') are a frontend concern.
    """

    SITUATION_A = "ILCD Situation A"
    # No longer produced (2026-10-15): not a D4.1 category, parks are Situation A.
    # Kept so that cases saved with it still load.
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
    # Q3.ENV=false: no parallel LCA, so no E-LCC (D4.2 §4.1, L00551). The network
    # level is the Entry-to-Gate consolidation of the C-LCC (L00547, L00601).
    C_LCC_PLUS_NETWORK = "C+N"
    C_LCC_PLUS_NETWORK_PLUS_S_LCC = "C+N+S"  # + S-LCC and NTF, no monetised externalities (L01293)


class SlcaActivationState(StrEnum):
    """Set by slca_t_01."""

    ACTIVE = "active"
    DEACTIVATED = "deactivated"


class StudyPhase(StrEnum):
    """system_fields.study.phase — case lifecycle phase (call 4 = simple)."""

    SCREENING = "screening"
    DETAILED = "detailed"
