"""Domain models for the IS assessment case object.

After Sprint 4 commit 1, the legacy modules in this package (engine.py,
validators.py, models_domain.py) are shims that re-export from
`app/_legacy/`. They will be removed in commit 5.

The new domain models live in `models.py` and `enums.py`. The case
state-machine semantics live in `case_state.py`.
"""
