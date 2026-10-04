"""Tests for engine.branch_keys — the grammar of discriminative branch keys.

The point of the schema-wide tests is that the validation script does not
look at branch keys at all, and the resolver used to skip any key it did not
understand: 25 nodes lost rules that way and nothing failed. These tests fail
the moment a node carries a key the grammar cannot read.
"""
from __future__ import annotations

import itertools
import json

import pytest

from app.domain.enums import Q1, Q2, Q5, Q7, Q6a, Q6b
from app.engine.branch_keys import (
    Answers,
    BranchKeyError,
    parse_branch_key,
    pick_branch,
)


def _answers(**kw) -> Answers:
    base = dict(q1=None, q2=None, q4=frozenset(), q5=None, q6a=None, q6b=None,
                q7=None, env=False, eco=False, soc=False)
    base.update(kw)
    return Answers(**base)


# ---------------------------------------------------------------------------
# 1. Grammar — one case per notation
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "key, answers, expected",
    [
        ("q1=C", dict(q1="C"), True),
        ("q1=C", dict(q1="D"), False),
        ("q1=C", dict(), False),
        ("q4=D", dict(q4=frozenset({"A", "D"})), True),
        ("q4=D", dict(q4=frozenset({"A"})), False),
        ("q1 in {A,B,E}", dict(q1="E"), True),
        ("q1 in {A,B,E}", dict(q1="C"), False),
        ("q4 in {C,D,E}", dict(q4=frozenset({"A", "E"})), True),
        ("q4 in {C,D,E}", dict(q4=frozenset({"A", "B"})), False),
        ("q4 in {C,D,E}", dict(), False),
        ("q4 includes 'D'", dict(q4=frozenset({"D"})), True),
        ("q4 includes 'D'", dict(q4=frozenset({"C"})), False),
        ("q5 in {c,d}", dict(q5="d"), True),
        ("q5 in {c,d}", dict(q5="a"), False),
        ("q6b in {TRL7-8, TRL5-6, TRL<5}", dict(q6b="TRL7-8"), True),
        ("q6b in {TRL7-8, TRL5-6, TRL<5}", dict(q6b="TRL9"), False),
        ("q6b<TRL7", dict(q6b="TRL5-6"), True),
        ("q6b<TRL7", dict(q6b="TRL<5"), True),
        ("q6b<TRL7", dict(q6b="TRL7-8"), False),
        ("q6b<TRL7", dict(q6b="TRL9"), False),
        ("q6b<TRL9", dict(q6b="TRL7-8"), True),
        ("q3.env-only", dict(env=True), True),
        ("q3.env-only", dict(env=True, eco=True), False),
        ("q3.eco-only", dict(eco=True), True),
        ("q3.eco-only", dict(eco=True, soc=True), False),
        ("q3.env+eco", dict(env=True, eco=True), True),
        ("q3.env+eco", dict(env=True, eco=True, soc=True), True),  # soc ignored
        ("q3.env+eco", dict(env=True), False),
        ("q3.eco=false", dict(env=True), True),
        ("q3.eco=false", dict(eco=True), False),
        ("q3.soc=true", dict(soc=True), True),
        ("q3.soc=true", dict(), False),
        ("q3.soc=false", dict(), True),
        ("sector=textile_leather", dict(q6a="textile_leather"), True),
        ("sector=textile_leather", dict(q6a="pulp_paper"), False),
        ("contested", dict(q5="b"), False),
        ("contested", dict(q5="e"), False),
    ],
)
def test_branch_key_matching(key, answers, expected):
    assert parse_branch_key(key).matches(_answers(**answers)) is expected


def test_variables_name_the_answers_a_key_reads():
    assert parse_branch_key("q4 includes 'D'").variables == {"q4"}
    assert parse_branch_key("q3.env+eco").variables == {"q3"}
    assert parse_branch_key("sector=textile_leather").variables == {"q6a"}
    assert parse_branch_key("contested").variables == {"q5"}
    assert parse_branch_key("contested").inert is True
    assert parse_branch_key("q1=C").inert is False


@pytest.mark.parametrize(
    "bad",
    [
        "q9=A",                          # unknown question
        "q3=env",                        # q3 is not an enum
        "q1=Z",                          # value not in the enum
        "q4 in {C,Z}",                   # one bad value in a set
        "q1 in {}",                      # empty set
        "q4 includes 'Z'",
        "sector=not_a_sector",
        "q3.foo-only",
        "q3.env+env",                    # repeated dimension
        "q1 in {A,B,E} AND q3.eco=true",  # AND is for L0 nodes, hand-coded there
        "default",                       # not a branch key
        "",
    ],
)
def test_unknown_keys_raise_instead_of_being_skipped(bad):
    with pytest.raises(BranchKeyError):
        parse_branch_key(bad)


def test_pick_branch_first_match_wins_then_default():
    dv = {"q4 in {A,B}": "first", "q4 includes 'B'": "second", "default": "fallback"}
    assert pick_branch(dv, _answers(q4=frozenset({"B"}))) == (True, "first")
    assert pick_branch(dv, _answers(q4=frozenset({"C"}))) == (True, "fallback")
    assert pick_branch({"q1=A": "x"}, _answers(q1="B")) == (False, None)


# ---------------------------------------------------------------------------
# 2. Schema-wide — every key of every node the resolver reads
# ---------------------------------------------------------------------------


def _branch_nodes(schemas) -> list[dict]:
    """Discriminative nodes with a branch dict that `activate.run` resolves.

    L0 nodes are out: `activate.run` skips them (lca_t1, lcc_trig_01 and
    slca_t_01 are hand-coded in l0_compute, and lcc_trig_01 joins conditions with AND, which
    the resolver's grammar deliberately does not have). lca_hc_19 is
    discriminative but carries a static mandate string, not a dict."""
    return [
        n for n in schemas.phase1_nodes
        if n.get("trigger_logic") == "discriminative"
        and n.get("lifecycle_layer") != "L0"
        and isinstance(n.get("default_value"), dict)
    ]


def _keys(node: dict) -> list[str]:
    return [k for k in node["default_value"] if k != "default"]


def test_schema_has_the_expected_number_of_branch_nodes(schemas):
    """Guards the tests below against silently iterating nothing: 42
    discriminative nodes, minus 3 at L0 (lca_t1, lcc_trig_01, slca_t_01) and
    lca_hc_19, whose default_value is a string."""
    assert len(_branch_nodes(schemas)) == 38


def test_every_branch_key_in_the_schema_is_interpretable(schemas):
    bad = {}
    for node in _branch_nodes(schemas):
        for key in _keys(node):
            try:
                parse_branch_key(key)
            except BranchKeyError as e:
                bad.setdefault(node["id"], []).append(str(e))
    assert not bad, f"branch keys the resolver cannot read: {json.dumps(bad, indent=1)}"


# lcc_mc_03 reads the sector (`sector=textile_leather`, i.e. Q6a) but its
# `trigger_q` lists only q1. The schema is authoritative, so the gap is
# recorded here instead of fixed.
_TRIGGER_Q_GAPS = {"lcc_mc_03": {"q6a"}}


def test_branch_keys_read_only_the_questions_the_node_declares(schemas):
    undeclared = {}
    for node in _branch_nodes(schemas):
        declared = set(node.get("trigger_q") or []) | _TRIGGER_Q_GAPS.get(node["id"], set())
        read = set().union(*(parse_branch_key(k).variables for k in _keys(node)))
        if read - declared:
            undeclared[node["id"]] = sorted(read - declared)
    assert not undeclared, f"keys read questions not in trigger_q: {undeclared}"


def test_inert_keys_are_the_known_ones(schemas):
    """`contested` parses but never matches (see branch_keys.py). A new inert
    key would be a rule that never applies, so it must be a conscious change."""
    inert = {
        (n["id"], k) for n in _branch_nodes(schemas) for k in _keys(n)
        if parse_branch_key(k).inert
    }
    assert inert == {("lcc_mc_04", "contested"), ("lcc_mc_08", "contested")}


_DOMAINS = {
    "q1": [{"q1": v.value} for v in Q1],
    "q2": [{"q2": v.value} for v in Q2],
    "q4": [{"q4": frozenset(c)} for r in range(6) for c in itertools.combinations("ABCDE", r)],
    "q5": [{"q5": v.value} for v in Q5],
    "q6a": [{"q6a": v.value} for v in Q6a],
    "q6b": [{"q6b": v.value} for v in Q6b],
    "q7": [{"q7": v.value} for v in Q7],
    "q3": [dict(zip(("env", "eco", "soc"), t, strict=True))
           for t in itertools.product([False, True], repeat=3)],
}


def _overlapping(node: dict) -> bool:
    """True if some answers match two branches with different values."""
    parsed = [(k, parse_branch_key(k)) for k in _keys(node)]
    read = sorted(set().union(*(bk.variables for _, bk in parsed)))
    for combo in itertools.product(*(_DOMAINS[v] for v in read)):
        answers = _answers(**{k: v for part in combo for k, v in part.items()})
        values = {json.dumps(node["default_value"][k]) for k, bk in parsed if bk.matches(answers)}
        if len(values) > 1:
            return True
    return False


# First match wins (branch_keys.py). Q4 is multi-select and some nodes mix
# discriminants, so these nodes have answers where two branches disagree and
# the dict order decides. Pinned so that a new overlapping node, or one that
# stops overlapping, shows up here. For the Q4-only nodes the order is also
# pinned below: strictest first.
_OVERLAPPING_NODES = {
    "lca_hc_08", "lca_mc_05", "lca_mc_32", "lca_mc_36",
    "lcc_mc_01", "lcc_mc_03", "lcc_mc_05", "slca_mc_04",
}


def test_overlapping_branches_are_the_known_ones(schemas):
    overlapping = {n["id"] for n in _branch_nodes(schemas) if _overlapping(n)}
    assert overlapping == _OVERLAPPING_NODES


# Strictness of each Q4 value, lowest first, per node (PHASE1_NODE_MAPPING_v2
# §5.2.3: the more specific Q wins). The schema must list branches so that
# first-match picks the strictest selected one.
_Q4_STRICTNESS = {
    "lca_hc_08": ["D", "C"],
    "lca_mc_32": ["A", "B", "C", "D", "E"],   # {A,B} Morris first < {C,D,E} full Sobol
    "lca_mc_36": ["A", "B", "E", "C", "D"],
}


def _q4_subsets():
    return [frozenset(c) for r in range(1, 6) for c in itertools.combinations("ABCDE", r)]


@pytest.mark.parametrize("node_id", sorted(_Q4_STRICTNESS))
def test_q4_overlaps_resolve_to_the_strictest_selected_value(schemas, node_id):
    node = next(n for n in schemas.phase1_nodes if n["id"] == node_id)
    rank = {q: i for i, q in enumerate(_Q4_STRICTNESS[node_id])}
    for selected in _q4_subsets():
        relevant = [q for q in selected if q in rank]
        if not relevant:
            continue
        got = pick_branch(node["default_value"], _answers(q4=selected))[1]
        # the value that the strictest selected Q4 gets when it is selected alone
        strictest = max(relevant, key=rank.__getitem__)
        alone = pick_branch(node["default_value"], _answers(q4=frozenset({strictest})))[1]
        assert got == alone, f"{node_id}: Q4={sorted(selected)} gives {got!r}, strictest {strictest} gives {alone!r}"
