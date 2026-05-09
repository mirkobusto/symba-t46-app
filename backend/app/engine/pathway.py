"""Pathway derivation — IS-01..IS-05 from Q1 × Q2.

Project convention "option γ" (architectural decision documented in the
methodology repo; the source-of-truth deliverables D4.1/D4.2/D4.3 do not
enumerate this 5×4 matrix). Each combination of Q1 (IS scenario archetype)
and Q2 (temporal stance) maps deterministically to one pathway ID:

    Q1\\Q2 |  A      B      C      D
    -------+--------------------------------
      A    | IS-01  IS-01  IS-04  IS-01
      B    | IS-01  IS-01  IS-04  IS-01
      C    | IS-02  IS-02  IS-02  IS-02
      D    | IS-03  IS-03  IS-03  IS-03
      E    | IS-05  IS-05  IS-05  IS-05

Plain rule:
- Q1 == C → IS-02 (always)
- Q1 == D → IS-03 (always)
- Q1 == E → IS-05 (always)
- Q1 ∈ {A,B} ∧ Q2 == C → IS-04 (design-only override)
- Q1 ∈ {A,B} ∧ Q2 ∈ {A,B,D} → IS-01

Side flag (set by `derive`, NOT a separate PathwayId value):
- case.is_01_extended = True iff (pathway_id == IS-01 ∧ q2 == Q2.D),
  capturing the "IS-01 extended" annotation (baseline + N alternative
  scenarios; requires scenario-matrix support downstream).

Extracted from activate.py per Mirko nuance (Step 2 sub-issue 3): keeping
pathway logic in its own module makes it cheap to grow it later (e.g.,
pathway-specific defaults, pathway × Q3 interaction tables).
"""
from __future__ import annotations

from app.domain.enums import Q1, Q2, PathwayId
from app.domain.models import Case
from app.engine.loader import LoadedSchemas

_VALID_Q1 = frozenset({Q1.A, Q1.B, Q1.C, Q1.D, Q1.E})
_VALID_Q2 = frozenset({Q2.A, Q2.B, Q2.C, Q2.D})


def derive(case: Case, schemas: LoadedSchemas) -> Case:
    """Set `case.pathway_id` and `case.is_01_extended` from Q1 × Q2.

    Mutates `case` in place and returns it (matches the pipeline's
    fluent-mutation convention; see app/engine/pipeline.py).

    The `schemas` argument is reserved for future pathway × overlay
    interaction tables; it is not consulted in this commit.

    Raises:
        ValueError: if `case.q1` is not one of {Q1.A..Q1.E} or
            `case.q2` is not one of {Q2.A..Q2.D}. This covers the
            `case.q1 is None` / `case.q2 is None` path; the pipeline
            must collect Q1 and Q2 before calling derive.
    """
    q1 = case.q1
    q2 = case.q2

    if q1 not in _VALID_Q1:
        raise ValueError(f"Invalid Q1: {q1!r}")
    if q2 not in _VALID_Q2:
        raise ValueError(f"Invalid Q2: {q2!r}")

    if q1 == Q1.C:
        pathway_id = PathwayId.IS_02
    elif q1 == Q1.D:
        pathway_id = PathwayId.IS_03
    elif q1 == Q1.E:
        pathway_id = PathwayId.IS_05
    elif q2 == Q2.C:  # q1 ∈ {A, B} ∧ q2 == C → design-only override
        pathway_id = PathwayId.IS_04
    else:  # q1 ∈ {A, B} ∧ q2 ∈ {A, B, D}
        pathway_id = PathwayId.IS_01

    case.pathway_id = pathway_id
    case.is_01_extended = (pathway_id == PathwayId.IS_01 and q2 == Q2.D)

    # TODO(sprint4-step3-commit2): once Case.warnings is added, emit a
    # soft warning for cell (Q1=E, Q2=C): "monitoring a system in design
    # phase is semantically unusual; verify scoping."
    return case
