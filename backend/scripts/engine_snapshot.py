"""Engine output snapshot and diff, to see what an engine or schema change moves.

    PYTHONPATH=backend python backend/scripts/engine_snapshot.py snapshot out.json.gz
    PYTHONPATH=backend python backend/scripts/engine_snapshot.py diff before.json.gz after.json.gz \
        [--prefix g|s6a|sadv|paper] [--max N]

`snapshot` runs the pipeline on
  - the 13 paper fixtures of tests/test_12_papers_regression.py   (prefix `paper`)
  - a Q1 x Q2 x Q3 x Q4-subset x Q6b x Q7 grid, Q6a fixed, one flow per
    Q5 value so every per-flow branch is exercised                 (prefix `g`)
  - sweeps over Q6a and over advanced.asset_lifetime               (`s6a`, `sadv`)
and stores everything the engine writes per case (about 20,000 cases, a few
seconds). `diff` summarises, per output field, each distinct old -> new value
with its count and the answers the changed cases span.

Typical use: snapshot on main, snapshot on the branch, diff. It is how the
before/after numbers quoted in the engine PRs were produced.
"""
from __future__ import annotations

import collections
import gzip
import itertools
import json
import sys

from app.domain.enums import Q1, Q2, Q4, Q5, Q7, Q6a, Q6b
from app.domain.models import Q3, Case, Flow
from app.engine import pipeline

PILLARS = ("lca", "lcc", "slca", "report", "governance", "methodological_charter", "review", "system")
Q3S = [t for t in itertools.product([False, True], repeat=3) if any(t)]
Q4S = [(), ("A",), ("B",), ("C",), ("D",), ("E",), ("C", "D"), ("D", "E")]
Q3_NAMES = {"env": (True, False, False), "envecosoc": (True, True, True),
            "eco": (False, True, False), "enveco": (True, True, False)}


def _q3_label(q3: tuple[bool, bool, bool]) -> str:
    return "".join(n for n, b in zip(("env", "eco", "soc"), q3, strict=True) if b)


def _flows() -> list[Flow]:
    return [Flow(id=f"f_{q.value}", name=f"flow_{q.value}", q5=q) for q in Q5]


def _dump(c: Case) -> dict:
    out = {
        "blocked": sorted(c.blocked_by),
        "ilcd": str(c.ilcd_situation), "lcc_type": str(c.lcc_type),
        "slca_state": str(c.slca_activation_state), "pathway": str(c.pathway_id),
        "nodes": sorted(c.activated_nodes),
        "rules": sorted(r["rule_id"] if isinstance(r, dict) else str(r) for r in c.applicable_rules),
        "viol": sorted(str(v.get("rule_id") if isinstance(v, dict) else v) for v in c.rule_violations),
        "cdp": sorted(str(f.get("cdp_id") if isinstance(f, dict) else f) for f in c.cdp_flags),
    }
    for p in PILLARS:
        for k, v in getattr(c, p).items():
            out[f"{p}.{k}"] = json.loads(json.dumps(v, default=str))
    return out


def _run(c: Case) -> dict:
    try:
        pipeline.run(c)
        return _dump(c)
    except Exception as e:  # noqa: BLE001 - a crash is data in a snapshot
        return {"ERR": f"{type(e).__name__}: {e}"}


def _papers() -> dict:
    from tests.test_12_papers_regression import _PAPERS, _build_case

    return {f"paper:{fx['id']}": {"inputs": {"id": fx["id"]}, "out": _run(_build_case(fx))}
            for fx in _PAPERS}


def _grid() -> dict:
    res = {}
    for q1, q2, q3, q4, q6b, q7 in itertools.product(list(Q1), list(Q2), Q3S, Q4S, list(Q6b), list(Q7)):
        inputs = {"q1": q1.value, "q2": q2.value, "q3": _q3_label(q3), "q4": "".join(q4) or "-",
                  "q6b": q6b.value, "q7": q7.value}
        key = "g|" + "|".join(f"{k}={v}" for k, v in inputs.items())
        c = Case(q1=q1, q2=q2, q3=Q3(env=q3[0], eco=q3[1], soc=q3[2]), q4={Q4(x) for x in q4},
                 q6a=Q6a.PLASTICS_PACKAGING, q6b=q6b, q7=q7, flows=_flows())
        res[key] = {"inputs": inputs, "out": _run(c)}
    return res


def _sweeps() -> dict:
    res = {}
    for q6a, q1, q2, (n3, q3) in itertools.product(list(Q6a), list(Q1), list(Q2), Q3_NAMES.items()):
        c = Case(q1=q1, q2=q2, q3=Q3(env=q3[0], eco=q3[1], soc=q3[2]), q4={Q4.A}, q6a=q6a,
                 q6b=Q6b.TRL9, q7=Q7.B, flows=_flows())
        res[f"s6a|q6a={q6a.value}|q1={q1.value}|q2={q2.value}|q3={n3}"] = {
            "inputs": {"q6a": q6a.value, "q1": q1.value, "q2": q2.value, "q3": n3}, "out": _run(c)}
    for al, q1, q2, (n3, q3) in itertools.product((None, 0, 10, 15, 16, 30, "20"), list(Q1), list(Q2),
                                                   Q3_NAMES.items()):
        c = Case(q1=q1, q2=q2, q3=Q3(env=q3[0], eco=q3[1], soc=q3[2]), q4={Q4.A},
                 q6a=Q6a.PLASTICS_PACKAGING, q6b=Q6b.TRL9, q7=Q7.B, flows=_flows(),
                 advanced={} if al is None else {"asset_lifetime": al})
        res[f"sadv|al={al!r}|q1={q1.value}|q2={q2.value}|q3={n3}"] = {
            "inputs": {"asset_lifetime": repr(al), "q1": q1.value, "q2": q2.value, "q3": n3},
            "out": _run(c)}
    return res


def snapshot(path: str) -> None:
    data = {**_papers(), **_grid(), **_sweeps()}
    with gzip.open(path, "wt") as f:
        json.dump(data, f, sort_keys=True)
    errs = sum(1 for v in data.values() if "ERR" in v["out"])
    print(f"{len(data)} cases, {errs} errors -> {path}")


def _load(path: str) -> dict:
    with gzip.open(path, "rt") as f:
        return json.load(f)


def _short(v: object, n: int = 70) -> str:
    s = json.dumps(v, ensure_ascii=False, default=str)
    return s if len(s) <= n else s[: n - 1] + "…"


def diff(before: str, after: str, prefix: str | None = None, max_rows: int = 40) -> None:
    a, b = _load(before), _load(after)
    keys = [k for k in a if k in b and (prefix is None or k.startswith(prefix))]
    changed = 0
    trans: dict = collections.defaultdict(lambda: collections.defaultdict(list))
    added: dict = collections.defaultdict(list)
    removed: dict = collections.defaultdict(list)
    for k in keys:
        oa, ob = a[k]["out"], b[k]["out"]
        if oa == ob:
            continue
        changed += 1
        for f in sorted(set(oa) | set(ob)):
            if f == "nodes":
                sa, sb = set(oa.get(f, [])), set(ob.get(f, []))
                for n in sb - sa:
                    added[n].append(k)
                for n in sa - sb:
                    removed[n].append(k)
            elif oa.get(f, "<absent>") != ob.get(f, "<absent>"):
                trans[f][(json.dumps(oa.get(f, "<absent>"), default=str),
                          json.dumps(ob.get(f, "<absent>"), default=str))].append(k)

    domain = {q: {str(a[k]["inputs"].get(q)) for k in keys} for q in {q for k in keys for q in a[k]["inputs"]}}

    def span(ks: list[str]) -> str:
        seen: dict = collections.defaultdict(set)
        for k in ks:
            for q, v in a[k]["inputs"].items():
                seen[q].add(str(v))
        return " ".join(f"{q}∈{{{','.join(sorted(v))}}}" for q, v in seen.items()
                        if len(v) < len(domain.get(q, ())))

    print(f"cases compared: {len(keys)}   changed: {changed}")
    for title, nodes, sign in (("nodes newly activated", added, "+"), ("nodes no longer activated", removed, "-")):
        print(f"\n== {title}")
        for n, ks in sorted(nodes.items()):
            print(f"  {sign} {n:10} in {len(ks):5} cases | {span(ks)[:150]}")
    print("\n== output fields")
    for f, tr in sorted(trans.items()):
        print(f"\n[{f}]  {sum(len(v) for v in tr.values())} case-changes")
        for (o, n), ks in sorted(tr.items(), key=lambda x: -len(x[1]))[:max_rows]:
            print(f"   {_short(json.loads(o))}  ->  {_short(json.loads(n))}   x{len(ks)} | {span(ks)[:140]}")


def main(argv: list[str]) -> int:
    if len(argv) >= 3 and argv[1] == "snapshot":
        snapshot(argv[2])
        return 0
    if len(argv) >= 4 and argv[1] == "diff":
        opt = lambda flag, default=None: argv[argv.index(flag) + 1] if flag in argv else default  # noqa: E731
        diff(argv[2], argv[3], opt("--prefix"), int(opt("--max", 40)))
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
