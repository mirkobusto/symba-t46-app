"""Case lifecycle phase semantics.

Per Mirko design call 4 = simple: the case lifecycle is encoded as a single
field `Case.study_phase: StudyPhase` (values 'screening' | 'detailed').
There is NO state machine, NO enforced transitions, NO event handlers.

Rationale: a full FSM is premature optimization for Sprint 4. Phase 1 of
the engine deals exclusively with screening; the detailed phase will be
added in a later sprint when the reporting layer is built. Until then,
`study_phase` is just a recorded value the engine reads to decide which
rules apply (e.g., IR-17: 'screening must precede detailed').

If a state machine is needed later, this module is the place to grow it.
"""
from __future__ import annotations

from app.domain.enums import StudyPhase

# Reserved for future FSM. Currently empty by design.
__all__ = ["StudyPhase"]
