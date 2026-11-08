"""One vocabulary for "who pays whom" (Q5), round-6 UX audit, theme D
(P1-02, P3-06, P6-11, P7-06, P8-12, P2-01).

The questionnaire, the flows table in both registers, the network editor,
the scenario editor, the Word case report and the Data Collection File
named the same five answers in three ways, and the questionnaire's menu
called a flow "waste" or "co-product" from the payment direction alone.
Decided by Fable: one label set per language, the DCF's, letter included;
the method's class is said as what the model does ("modelled as a waste"),
never as the legal status of the material."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend" / "scripts"))

import sync_report_terms  # noqa: E402

LANGUAGES = ("en", "it", "fr", "de", "es")
LOCALES = ROOT / "frontend/src/i18n/locales"
COMPONENTS = ROOT / "frontend/src/components"
DCF_TERMS = json.loads((ROOT / "backend/app/data/dcf_terms.json").read_text(encoding="utf-8"))
REPORT_TERMS = json.loads((ROOT / "backend/app/data/report_terms.json").read_text(encoding="utf-8"))

# a legal class pronounced as the answer or as the head of a treatment row
LEGAL_CLASS = {
    "en": ("waste", "co-product", "by-product", "free"),
    "it": ("rifiuto", "co-prodotto", "sottoprodotto", "gratuito"),
    "fr": ("déchet", "coproduit", "co-produit", "sous-produit", "gratuit"),
    "de": ("abfall", "koppelprodukt", "co-produkt", "nebenprodukt", "kostenlos"),
    "es": ("residuo", "coproducto", "co-producto", "subproducto", "gratuito"),
}


def _tree(lang: str) -> dict:
    text = (LOCALES / f"{lang}.ts").read_text(encoding="utf-8")
    return sync_report_terms._Parser(text, text.index("{", text.index("const "))).obj()


def test_the_q5_labels_agree_in_every_language():
    for lang in LANGUAGES:
        tree = _tree(lang)
        app = tree["flows"]["options"]
        dcf = DCF_TERMS[lang]["enum_refs"]["Q5"]
        word = REPORT_TERMS[lang]["options"]["q5"]
        assert app == dcf == word, lang
        # no second set for the guided register: that is how the three drifted
        assert "plainOptions" not in tree["flows"], lang
        # the guide under the table quotes an answer the menu has
        assert any(label.partition(". ")[2] in tree["flows"]["q5Note"] for label in app.values()), lang


def test_every_screen_takes_the_q5_labels_from_one_key():
    for name in ("FlowsEditor.tsx", "NetworkBuilder.tsx", "ScenariosEditor.tsx", "scenarioChanges.ts"):
        source = (COMPONENTS / name).read_text(encoding="utf-8")
        assert "flows.options." in source, name
        assert "plainOptions" not in source, name


def test_no_q5_label_or_treatment_row_pronounces_a_legal_class():
    for lang in LANGUAGES:
        tree = _tree(lang)
        values = tree["result"]["config"]["values"]
        for label in tree["flows"]["options"].values():
            words = re.findall(r"[\w-]+", label.lower())
            assert not set(words) & set(LEGAL_CLASS[lang]), (lang, label)
        for row in [*values["flowTreatment"].values(), *values["flowCost"].values()]:
            head = row.partition(":")[0].strip().lower()
            assert head not in LEGAL_CLASS[lang], (lang, row)
