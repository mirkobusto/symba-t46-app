"""Copy the frontend's translations the .docx case report needs into
backend/app/data/report_terms.json.

The app's locales (frontend/src/i18n/locales/*.ts) are the one source of the
translated verdicts, engine notes and report wording; the backend image does
not ship the frontend sources, so the report reads this copy. A test fails when
the copy and the locales differ: run this script after changing them.

    cd backend && PYTHONPATH=. python scripts/sync_report_terms.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
LOCALES = ROOT / "frontend" / "src" / "i18n" / "locales"
SCHEMA_TERMS = ROOT / "frontend" / "src" / "i18n" / "schemaTerms.ts"
OUT = ROOT / "backend" / "app" / "data" / "report_terms.json"
LANGUAGES = ("en", "it", "fr", "de", "es")

_TOKEN = re.compile(r"""
    (?P<ws>\s+|//[^\n]*|/\*.*?\*/)
  | (?P<str>'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)
  | (?P<ident>[A-Za-z_$][\w$]*)
  | (?P<num>-?\d+(?:\.\d+)?)
  | (?P<punct>[{}\[\]:,+])
""", re.S | re.X)


def _unquote(tok: str) -> str:
    body = tok[1:-1]
    return re.sub(r"\\(.)", lambda m: {"n": "\n", "t": "\t"}.get(m.group(1), m.group(1)), body)


class _Parser:
    """Just enough of a TypeScript object-literal reader for the locales:
    nested objects, arrays, string literals joined with `+`."""

    def __init__(self, text: str, pos: int):
        self.tokens: list[tuple[str, str]] = []
        for m in _TOKEN.finditer(text, pos):
            kind = m.lastgroup
            if kind != "ws":
                self.tokens.append((kind, m.group()))
        self.i = 0

    def peek(self) -> tuple[str, str]:
        return self.tokens[self.i]

    def take(self) -> tuple[str, str]:
        tok = self.tokens[self.i]
        self.i += 1
        return tok

    def value(self) -> Any:
        kind, tok = self.peek()
        if tok == "{":
            return self.obj()
        if tok == "[":
            self.take()
            out = []
            while self.peek()[1] != "]":
                out.append(self.value())
                if self.peek()[1] == ",":
                    self.take()
            self.take()
            return out
        if kind == "str":
            parts = [_unquote(self.take()[1])]
            while self.peek()[1] == "+":
                self.take()
                parts.append(_unquote(self.take()[1]))
            return "".join(parts)
        self.take()
        return tok

    def obj(self) -> dict[str, Any]:
        assert self.take()[1] == "{"
        out: dict[str, Any] = {}
        while self.peek()[1] != "}":
            kind, key = self.take()
            key = _unquote(key) if kind == "str" else key
            assert self.take()[1] == ":", key
            out[key] = self.value()
            if self.peek()[1] == ",":
                self.take()
        self.take()
        return out


def _block(text: str, path: list[str]) -> Any:
    """The object at `path` (top-level key first) of a locale file."""
    start = text.index("{", text.index("const "))
    tree = _Parser(text, start).obj()
    for key in path:
        tree = tree[key]
    return tree


def _labels(options: dict[str, Any]) -> dict[str, str]:
    """{value: label} whether an option is a string or {label, description}."""
    return {k: (v["label"] if isinstance(v, dict) else v) for k, v in options.items()}


def _options(tree: dict[str, Any]) -> dict[str, dict[str, str]]:
    q = tree["questionnaire"]
    return {
        "q0": _labels(q["q0"]["options"]), "q1": _labels(q["q1"]["options"]),
        "q2": _labels(q["q2"]["options"]), "q4": _labels(q["q4"]["options"]),
        "q3": {k: q["q3"][k] for k in ("env", "eco", "soc")},
        "q5": _labels(tree["flows"]["options"]), "q6a": _labels(q["q6a"]["options"]),
        "q6b": _labels(q["q6b"]["options"]), "q7": _labels(q["q7"]["options"]),
        "q8start": _labels(q["q8"]["start"]["options"]), "q9": _labels(q["q9"]["options"]),
        "q11": _labels(q["q11"]["options"]), "scope": _labels(q["q7"]["market"]["scope"]),
    }


def _schema_terms() -> dict[str, Any]:
    """Rule, CDP and block names and texts, translated in schemaTerms.ts
    (UX round 2026-11-03: the report printed them in English)."""
    text = SCHEMA_TERMS.read_text(encoding="utf-8")
    return _Parser(text, text.index("{", text.index("SCHEMA_TERMS"))).obj()


def extract() -> dict[str, Any]:
    out: dict[str, Any] = {}
    schema = _schema_terms()
    for lang in LANGUAGES:
        text = (LOCALES / f"{lang}.ts").read_text(encoding="utf-8")
        start = text.index("{", text.index("const "))
        tree = _Parser(text, start).obj()
        out[lang] = {
            "docx": tree["docxReport"],
            "narrative": {k: {s: {f: v for f, v in row.items() if f in ("title", "short", "detail")}
                              for s, row in tree["narrative"][k].items()}
                          for k in ("ilcd", "lcc", "slca")},
            "engineNotes": tree["result"]["engineNotes"],
            "actionKind": tree["result"]["actionKind"],
            "chapters": tree["result"]["sectorChapters"],
            "common": {"yes": tree["common"]["yes"], "no": tree["common"]["no"]},
            "options": _options(tree),
            "schema": schema[lang],
            # labels shared with the result page, so the document and the screen agree
            "page": {"configTitle": tree["result"]["config"]["title"],
                     "why": tree["result"]["config"]["why"]["label"],
                     "resolution": tree["result"]["action"]["resolution"]},
        }
    return out


if __name__ == "__main__":
    OUT.write_text(json.dumps(extract(), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"written {OUT}")
