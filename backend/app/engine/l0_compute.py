"""L0 — Trigger node computation.

Derives the 3 L0 trigger nodes from Q1-Q3 BEFORE any L1/L2/L3 logic runs.
These are deterministic functions of the user answers; they have no
violation semantics — they simply COMPUTE state that downstream phases
read. By convention these are the only 3 nodes with lifecycle_layer=L0.

    lca_t1         (Q1)        -> Case.ilcd_situation
    lcc_trig_01    (Q1,Q3.eco) -> Case.lcc_type
    slca_t_01      (Q3.soc)    -> Case.slca_activation_state

Mapping source: backend/app/schemas/phase1_nodes.json — entries
`lca_t1`, `lcc_trig_01`, `slca_t_01`. The JSON `default_value` blocks
encode the mapping in human-readable strings; this module re-encodes
the same logic against the typed enums in app.domain.enums (which is
the source of truth for serialized values; the JSON strings are
documentation).

Note on `lca_t1`: schemas list `q2` in `trigger_q` but the
`default_value` table only discriminates on `q1`; `q2` is therefore
not consulted here. If a future revision makes Q2 discriminative for
ILCD situation, update this module and the JSON together.
"""
from __future__ import annotations

from app.domain.enums import Q1, IlcdSituation, LccType, SlcaActivationState
from app.domain.models import Case
from app.engine.loader import LoadedSchemas

_VALID_Q1 = frozenset({Q1.A, Q1.B, Q1.C, Q1.D, Q1.E})

_ILCD_BY_Q1: dict[Q1, IlcdSituation] = {
    Q1.A: IlcdSituation.SITUATION_A,
    Q1.B: IlcdSituation.SITUATION_A_MULTI,
    Q1.C: IlcdSituation.SITUATION_B,
    Q1.D: IlcdSituation.SITUATION_C2,
    Q1.E: IlcdSituation.SITUATION_C1,
}


def _compute_ilcd_situation(q1: Q1 | None) -> IlcdSituation:
    if q1 not in _VALID_Q1:
        raise ValueError(f"Invalid Q1: {q1!r}")
    return _ILCD_BY_Q1[q1]


def _compute_lcc_type(q1: Q1 | None, eco: bool) -> LccType:
    if not eco:
        # Q1 irrelevant when LCC pillar is off.
        return LccType.DEACTIVATED
    if q1 not in _VALID_Q1:
        raise ValueError(f"Invalid Q1: {q1!r}")
    if q1 == Q1.C:
        return LccType.E_LCC_PLUS_S_LCC_PLUS_NTF
    if q1 == Q1.D:
        return LccType.C_LCC_ONLY
    # q1 ∈ {A, B, E}
    return LccType.C_LCC_PLUS_E_LCC


def _compute_slca_state(soc: bool) -> SlcaActivationState:
    return SlcaActivationState.ACTIVE if soc else SlcaActivationState.DEACTIVATED


def run(case: Case, schemas: LoadedSchemas) -> Case:
    """Compute L0 trigger node outputs and write them onto `case`.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention; see app/engine/pipeline.py).

    The `schemas` argument is reserved for future schema-driven L0
    logic; it is not consulted in this commit.

    Raises:
        ValueError: if `case.q1` is not one of {Q1.A..Q1.E} (covers
            `case.q1 is None`). The pipeline must collect Q1 before
            calling run.
    """
    case.ilcd_situation = _compute_ilcd_situation(case.q1)
    case.lcc_type = _compute_lcc_type(case.q1, case.q3.eco)
    case.slca_activation_state = _compute_slca_state(case.q3.soc)
    return case
