"""Answer-dependent phrases inside node values.

Some node values depend on an answer that is orthogonal to the node's own
branches: the reference market (lca_mc_06 / lca_mc_27 already branch on the
ILCD situation) and the concentration of the key interactions (lca_mc_25
already branches on Q4, and CIR-05 rewrites it for EU policy alignment). The branch-key grammar has no AND, and writing every
combination would multiply the branches, so these values carry a placeholder,
`{reference_market}`, `{affected_market}` or `{interaction_scale}`, that `fill` replaces with a
phrase built from the answer (owner decision 2026-10-18). Without an answer the
phrase states the rule in general terms, as the node did before.
"""
from __future__ import annotations

import re
from typing import Any

from app.domain.enums import Q7, ReferenceMarketScope
from app.domain.models import Case

PLACEHOLDERS = ("reference_market", "affected_market", "interaction_scale")
_TOKEN = re.compile(r"\{(" + "|".join(PLACEHOLDERS) + r")\}")

# D4.1 §11.3.1 (L01291): the average matches the market the counterfactual would
# draw on, typically national or sub-national; continental averages only for
# globally traded commodities with no sub-continental market.
_SCOPE = {
    ReferenceMarketScope.NATIONAL: "the national market",
    ReferenceMarketScope.SUB_NATIONAL: "the sub-national market",
    ReferenceMarketScope.CONTINENTAL: "the continental market",
}
_GENERIC_MARKET = ("the market the counterfactual would draw on (typically national or sub-national; "
                   "continental only for globally traded commodities, D4.1 §11.3.1)")

# D4.1 §12.2.3 (L01365) and §12.3.3 (L01403, L01415).
_INTERACTIONS = {
    Q7.A: ("key interactions are intensely local (one site): spatially specific characterisation factors "
           "for water scarcity, eutrophication and acidification, and the scale mismatch flagged where "
           "regional factors are applied at site level (D4.1 §12.2.3, §12.3.3)"),
    Q7.B: ("key interactions are regional: spatially explicit factors, and for a regional cluster with "
           "characterised soil sensitivity the Seppälä / Posch country-dependent factors for acidification "
           "and eutrophication (D4.1 §12.3.3)"),
    Q7.C: ("key interactions span regions or borders: country- or region-dependent factors matched to the "
           "territory of each emission (D4.1 §12.3.3)"),
}
_GENERIC_INTERACTIONS = ("spatially specific characterisation factors where key interactions are intensely "
                         "local (D4.1 §12.2.3)")


def reference_market(case: Case) -> str:
    region = (case.reference_market_region or "").strip()
    if case.reference_market_scope is None:
        if not region:
            return _GENERIC_MARKET
        return (f"the market of {region} (typically national or sub-national; continental only for "
                "globally traded commodities, D4.1 §11.3.1)")
    phrase = _SCOPE[case.reference_market_scope] + (f" of {region}" if region else "")
    if case.reference_market_scope == ReferenceMarketScope.CONTINENTAL:
        phrase += " (only for globally traded commodities with no sub-continental market, D4.1 §11.3.1)"
    return phrase


def affected_market(case: Case) -> str:
    """The market named for a marginal (consequential) reference: the name and
    scope only, without the averaging rule of L01291, which is for averages."""
    region = (case.reference_market_region or "").strip()
    scope = case.reference_market_scope.value.replace("_", "-") if case.reference_market_scope else None
    detail = ", ".join(x for x in (region, f"{scope} scope" if scope else None) if x)
    return "the affected market" + (f" ({detail})" if detail else "")


def interaction_scale(case: Case) -> str:
    return _INTERACTIONS.get(case.q7, _GENERIC_INTERACTIONS) if case.q7 else _GENERIC_INTERACTIONS


_FILL = {"reference_market": reference_market, "affected_market": affected_market,
         "interaction_scale": interaction_scale}


def fill(value: Any, case: Case) -> Any:
    """Replace the placeholders in a string value; other values pass through."""
    if not isinstance(value, str) or "{" not in value:
        return value
    return _TOKEN.sub(lambda m: _FILL[m.group(1)](case), value)
