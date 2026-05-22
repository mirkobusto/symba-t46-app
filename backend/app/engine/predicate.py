"""DCF activation-predicate mini-DSL evaluator.

Implements the predicate language declared in `dcf_schema.json` (see
`docs/implementation/DATA_COLLECTION_FILE_v1.md` §3 P1, §6, §11 D1).

Allowed grammar:
    expr        := 'always' | bool_expr
    bool_expr   := compare (('and' | 'or') compare)*
                 | 'not' bool_expr
                 | '(' bool_expr ')'
    compare     := identifier (op identifier_or_literal)?
                 | literal
    op          := '==' | '!=' | 'in' | 'not in'
    identifier  := name ('.' name)?    # single-level attribute (e.g. q3.env)
    literal     := string | bool | None | int | float | list | tuple

Allowed identifiers (built by `build_context_from_case`):
    q1, q2, q6a, q6b, q7         — str | None (enum .value)
    q3                           — namespace with .env, .eco, .soc booleans
    q4                           — set[str] (use 'E' in q4)
    q5                           — None at Case level (per-flow contexts override)
    pathway_id, ilcd_situation,
    lcc_type, slca_activation_state — str | None
    is_01_extended               — bool
    always                       — bool (True)

Security: implementation walks the parsed AST and rejects every node
type outside an explicit allowlist (no Call, no Subscript, no BinOp,
no Lambda, no Comprehension, no f-strings, ...) before handing off to
`eval()` with `__builtins__` cleared. The DSL is intended for predicates
that ship inside the project's own schema JSON, not for user input —
but the validation pass is the line of defence even if the schema
gets edited externally.
"""
from __future__ import annotations

import ast
from dataclasses import dataclass
from typing import Any


class PredicateError(ValueError):
    """Raised when a predicate cannot be parsed, validated, or evaluated."""


# AST node types accepted by the DSL.
_ALLOWED_NODES: tuple[type[ast.AST], ...] = (
    ast.Expression,
    # Boolean composition
    ast.BoolOp, ast.UnaryOp,
    ast.And, ast.Or, ast.Not,
    # Comparison
    ast.Compare,
    ast.Eq, ast.NotEq, ast.In, ast.NotIn,
    # Atoms
    ast.Name, ast.Constant,
    ast.Attribute,
    ast.Tuple, ast.List,
    ast.Load,
)


def _validate_ast(node: ast.AST, predicate: str) -> None:
    """Walk the AST and raise PredicateError on any disallowed construct."""
    if not isinstance(node, _ALLOWED_NODES):
        raise PredicateError(
            f"Predicate {predicate!r}: disallowed construct "
            f"{type(node).__name__!r}"
        )
    # Restrict attribute access to one level deep (e.g. q3.env, not q3.foo.bar).
    if isinstance(node, ast.Attribute) and not isinstance(node.value, ast.Name):
        raise PredicateError(
            f"Predicate {predicate!r}: only single-level attribute access "
            f"is allowed (e.g. q3.env)"
        )
    for child in ast.iter_child_nodes(node):
        _validate_ast(child, predicate)


def evaluate(predicate: str, context: dict[str, Any]) -> bool:
    """Evaluate a DCF activation_predicate string against a context dict.

    Returns a boolean. Raises PredicateError on parse, validation, or
    runtime failure.

    The special token ``"always"`` evaluates to True without parsing.
    Empty / None predicates raise PredicateError — schema authors should
    write ``"always"`` to mean "always-on" explicitly.
    """
    if predicate is None:
        raise PredicateError("Predicate is None — schemas must use 'always' explicitly")
    predicate = predicate.strip()
    if not predicate:
        raise PredicateError("Predicate is empty — schemas must use 'always' explicitly")
    if predicate == "always":
        return True

    try:
        tree = ast.parse(predicate, mode="eval")
    except SyntaxError as e:
        raise PredicateError(f"Predicate {predicate!r}: syntax error: {e.msg}") from e

    _validate_ast(tree, predicate)

    code = compile(tree, "<predicate>", "eval")
    try:
        # AST has been validated; __builtins__ cleared. Identifier lookup
        # happens in `context` only.
        result = eval(code, {"__builtins__": {}}, context)  # noqa: S307
    except NameError as e:
        raise PredicateError(
            f"Predicate {predicate!r}: unknown identifier ({e})"
        ) from e
    except Exception as e:
        raise PredicateError(
            f"Predicate {predicate!r}: runtime error ({type(e).__name__}: {e})"
        ) from e

    return bool(result)


# ---------------------------------------------------------------------------
# Context builder
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Q3Proxy:
    """Read-only namespace for q3 attribute access (q3.env, q3.eco, q3.soc).

    The Case model carries q3 as a Pydantic sub-model; we expose it to the
    predicate DSL as a frozen dataclass so attribute reads work but
    assignments do not.
    """

    env: bool
    eco: bool
    soc: bool


def build_context_from_case(case: Any) -> dict[str, Any]:
    """Convert a post-pipeline `Case` (from app.domain.models) into the flat
    namespace that `evaluate` consumes.

    Enum values are unwrapped to their `.value` (strings) so predicates
    can write `q1 == "B"` rather than `q1 == Q1.B`. `q4` is exposed as
    a set of strings so `"E" in q4` works directly.

    `q5` is set to None at Case level (it is a per-flow property and
    per-flow predicates can override this key when iterating Flows).
    """
    return {
        "q1": case.q1.value if case.q1 else None,
        "q2": case.q2.value if case.q2 else None,
        "q3": Q3Proxy(env=case.q3.env, eco=case.q3.eco, soc=case.q3.soc),
        "q4": {q.value for q in case.q4},
        "q5": None,
        "q6a": case.q6a.value if case.q6a else None,
        "q6b": case.q6b.value if case.q6b else None,
        "q7": case.q7.value if case.q7 else None,
        "pathway_id": case.pathway_id.value if case.pathway_id else None,
        "ilcd_situation": case.ilcd_situation.value if case.ilcd_situation else None,
        "lcc_type": case.lcc_type.value if case.lcc_type else None,
        "slca_activation_state": (
            case.slca_activation_state.value if case.slca_activation_state else None
        ),
        "is_01_extended": case.is_01_extended,
        "always": True,
    }
