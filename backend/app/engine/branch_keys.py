"""Branch-key grammar for discriminative `default_value` dicts.

A discriminative node in `phase1_nodes.json` carries a dict
`{branch_key: value, ..., "default": value}`. `activate` picks the value of
the first branch whose key matches the case's answers. The keys are written
in the notation of the original extraction, not in one syntax, so this module
is the single place that says what each of them means.

Grammar (anything else raises `BranchKeyError`; it is never skipped):

    qX=V                    q1 q2 q4 q5 q6a q6b q7; V is one enum value.
                            For the multi-select q4 it means "V is selected".
    qX in {V1,V2,...}       any of the listed values (q4: any is selected)
    q4 includes 'V'         same as q4=V, the spelling the schema also uses
    q6b<TRLn                q6b is below TRL n (TRL5-6 and TRL<5 for n=7)
    q3.F=true | false       Q3 dimension F in {env, eco, soc} on / off
    q3.F-only               F on, the other two dimensions off
    q3.F+G[+H]              all the named dimensions on, the rest ignored
    sector=V                alias of q6a=V
    contested               recognised, never matches (see below)

Conventions, decided with the node owner:

  - First match wins, in the dict's own order (what the resolver already did
    for the `qX=V` keys). Q4 is multi-select, so several branches of one node
    can match; `tests/test_branch_keys.py` pins which nodes do.
  - `q3.F-only` is strict (the other two off) and `q3.F+G` is loose (the
    third dimension is ignored), matching the hand-coded predicates
    lcc_hc_38 and lcc_hc_27 in `activate._PREDICATES`.
  - `contested` (lcc_mc_04, lcc_mc_08) is inert on purpose. It is a flow
    state, not an answer, and Q5=b ("contested EVT") already has its own
    explicit branch in both nodes, so mapping it to Q5=b would be a branch
    that can never be reached. It stays in the grammar so the node does not
    break, and in the test's allow-list so a new inert key cannot slip in.

`default` is not a branch key; the caller handles it.
"""
from __future__ import annotations

import re
from collections.abc import Callable
from dataclasses import dataclass
from enum import StrEnum
from functools import cache

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
from app.domain.models import Case, Flow


class BranchKeyError(ValueError):
    """A discriminative branch key the grammar does not understand."""


_ENUMS: dict[str, type[StrEnum]] = {
    "q1": Q1, "q2": Q2, "q4": Q4, "q5": Q5, "q6a": Q6a, "q6b": Q6b, "q7": Q7,
}

# Highest TRL each Q6b band reaches; "below TRLn" means that ceiling < n.
_TRL_CEILING = {"TRL9": 9, "TRL7-8": 8, "TRL5-6": 6, "TRL<5": 4}

_Q_NAMES = "|".join(_ENUMS)
_DIMS = "env|eco|soc"
_EQ = re.compile(rf"^({_Q_NAMES})=(\S+)$")
_IN = re.compile(rf"^({_Q_NAMES})\s+in\s+\{{([^}}]*)\}}$")
_INCLUDES = re.compile(r"^q4\s+includes\s+'([^']+)'$")
_TRL_BELOW = re.compile(r"^q6b<TRL(\d)$")
_Q3_FLAG = re.compile(rf"^q3\.({_DIMS})=(true|false)$")
_Q3_ONLY = re.compile(rf"^q3\.({_DIMS})-only$")
_Q3_ALL = re.compile(rf"^q3\.((?:{_DIMS})(?:\+(?:{_DIMS}))+)$")
_SECTOR = re.compile(r"^sector=(\S+)$")


@dataclass(frozen=True)
class Answers:
    """The case's answers as branch keys see them (one flow's Q5 at a time)."""

    q1: str | None
    q2: str | None
    q4: frozenset[str]
    q5: str | None
    q6a: str | None
    q6b: str | None
    q7: str | None
    env: bool
    eco: bool
    soc: bool

    @classmethod
    def from_case(cls, case: Case, flow: Flow | None = None) -> Answers:
        """Answers of `case`; Q5 comes from `flow` when given, else from the
        legacy case-level Q5."""
        q5 = flow.q5 if flow is not None else case.q5
        return cls(
            q1=case.q1.value if case.q1 else None,
            q2=case.q2.value if case.q2 else None,
            q4=frozenset(q.value for q in case.q4),
            q5=q5.value if q5 else None,
            q6a=case.q6a.value if case.q6a else None,
            q6b=case.q6b.value if case.q6b else None,
            q7=case.q7.value if case.q7 else None,
            env=case.q3.env, eco=case.q3.eco, soc=case.q3.soc,
        )

    def dim(self, name: str) -> bool:
        return getattr(self, name)


@dataclass(frozen=True)
class BranchKey:
    raw: str
    # Answers the key reads ("sector" counts as q6a, "contested" as q5).
    variables: frozenset[str]
    matches: Callable[[Answers], bool]
    inert: bool = False


def _check_values(var: str, values: list[str], raw: str) -> None:
    valid = {m.value for m in _ENUMS[var]}
    unknown = [v for v in values if v not in valid]
    if unknown:
        raise BranchKeyError(
            f"branch key {raw!r}: {unknown} not valid for {var} (valid: {sorted(valid)})"
        )


def _any_of(var: str, values: frozenset[str]) -> Callable[[Answers], bool]:
    if var == "q4":
        return lambda a: bool(a.q4 & values)
    return lambda a: getattr(a, var) in values


@cache
def parse_branch_key(key: str) -> BranchKey:
    """Parse one branch key; raise `BranchKeyError` if it is not in the grammar."""
    raw = key
    key = key.strip()

    if key == "contested":
        return BranchKey(raw, frozenset({"q5"}), lambda a: False, inert=True)

    if m := _EQ.match(key):
        var, value = m.groups()
        _check_values(var, [value], raw)
        return BranchKey(raw, frozenset({var}), _any_of(var, frozenset({value})))

    if m := _IN.match(key):
        var, body = m.groups()
        values = [v.strip() for v in body.split(",") if v.strip()]
        if not values:
            raise BranchKeyError(f"branch key {raw!r}: empty value set")
        _check_values(var, values, raw)
        return BranchKey(raw, frozenset({var}), _any_of(var, frozenset(values)))

    if m := _INCLUDES.match(key):
        (value,) = m.groups()
        _check_values("q4", [value], raw)
        return BranchKey(raw, frozenset({"q4"}), _any_of("q4", frozenset({value})))

    if m := _TRL_BELOW.match(key):
        limit = int(m.group(1))
        below = frozenset(v for v, ceiling in _TRL_CEILING.items() if ceiling < limit)
        return BranchKey(raw, frozenset({"q6b"}), lambda a: a.q6b in below)

    if m := _Q3_FLAG.match(key):
        dim, flag = m.groups()
        want = flag == "true"
        return BranchKey(raw, frozenset({"q3"}), lambda a: a.dim(dim) is want)

    if m := _Q3_ONLY.match(key):
        (dim,) = m.groups()
        others = [d for d in _DIMS.split("|") if d != dim]
        return BranchKey(
            raw, frozenset({"q3"}),
            lambda a: a.dim(dim) and not any(a.dim(o) for o in others),
        )

    if m := _Q3_ALL.match(key):
        dims = m.group(1).split("+")
        if len(set(dims)) != len(dims):
            raise BranchKeyError(f"branch key {raw!r}: repeated Q3 dimension")
        return BranchKey(raw, frozenset({"q3"}), lambda a: all(a.dim(d) for d in dims))

    if m := _SECTOR.match(key):
        (value,) = m.groups()
        _check_values("q6a", [value], raw)
        return BranchKey(raw, frozenset({"q6a"}), _any_of("q6a", frozenset({value})))

    raise BranchKeyError(
        f"branch key {raw!r} is not in the grammar of engine/branch_keys.py "
        "(qX=V | qX in {..} | q4 includes 'V' | q6b<TRLn | q3.F=true|false | "
        "q3.F-only | q3.F+G | sector=V | contested)"
    )


def pick_branch(default_value: dict, answers: Answers) -> tuple[bool, object]:
    """First branch whose key matches `answers`, else `default`, else no match.

    Returns `(matched, value)`; `(False, None)` means the node is dormant.
    """
    for key, value in default_value.items():
        if key == "default":
            continue
        if parse_branch_key(key).matches(answers):
            return True, value
    if "default" in default_value:
        return True, default_value["default"]
    return False, None
