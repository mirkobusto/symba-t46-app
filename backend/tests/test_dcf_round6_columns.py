"""DCF columns of UX round 6 (2026-11-08, decided by Fable; P2-03/04/05/07,
P6-03, P6-07): a unit for each avoided cost, who organises the transport and
the unit of its cost, the route volumes retired in favour of the Flow Matrix,
what each asset is and which flow it serves, and the CFF parameters with
Q4 = D outside Situation C2."""
from __future__ import annotations

import io

from openpyxl import load_workbook

from app.domain.dcf_data import DcfData, DcfRow
from app.domain.enums import Q4
from app.domain.models import Q3, Case, Flow
from app.engine.dcf_data_validate import validate_dcf_data
from app.routers.dcf import _get_schemas, _load_dcf_schema, _run_and_compose
from app.services.dcf_excel import render_xlsx
from app.services.dcf_terms import LANGUAGES, _terms


def _payload(**kw):
    kw.setdefault("q3", Q3(env=True, eco=True))
    kw.setdefault("decision_context", "micro")
    case = Case(q1="B", q2="A", flows=[Flow(id="f1", name="whey", q5="c")], **kw)
    return case, _run_and_compose(case, _get_schemas())


def _ids(payload, section):
    return [f.id for f in next(s for s in payload.sections if s.id == section).fields]


def test_each_avoided_cost_has_its_own_unit():
    _, payload = _payload()
    ids = _ids(payload, "costs")
    # each unit right after the figure it qualifies
    assert ids.index("cost.disposal_cost_unit") == ids.index("cost.current_disposal_cost") + 1
    assert ids.index("cost.avoided_procurement_unit") == ids.index("cost.avoided_procurement_cost") + 1
    for lang in LANGUAGES:
        assert "two avoided" not in _terms()[lang]["fields"]["cost.disposal_cost_unit"]["label"]


def test_the_transport_names_who_organises_it_and_the_unit_of_its_cost():
    _, payload = _payload()
    ids = _ids(payload, "logistics")
    assert ids[1] == "route.organised_by"
    assert ids.index("route.transport_cost_unit") == ids.index("route.transport_cost_per_unit") + 1
    _, env_only = _payload(q3=Q3(env=True))
    assert "route.transport_cost_unit" not in _ids(env_only, "logistics")
    for lang in LANGUAGES:
        fields = _terms()[lang]["fields"]
        assert fields["route.organised_by"]["label"] in fields["route.distance_km"]["description"]


def test_the_quantity_is_asked_once_in_the_flow_matrix():
    case, payload = _payload()
    ids = _ids(payload, "logistics")
    assert "route.measured_volume_year" not in ids and "route.projected_volume_year" not in ids
    # a value saved before stays, dormant: no error, never exported
    row = DcfRow(row_id="r1", values={"route.flow_id": "f1", "route.measured_volume_year": 120})
    flow = DcfRow(row_id="f1", values={"flow.name": "whey"})
    data = DcfData(case_id="c", rows_by_section={"flow_matrix": [flow], "logistics": [row]})
    result = validate_dcf_data(data, payload, _load_dcf_schema(), case)
    assert not result.errors
    assert ("field_not_active", "route.measured_volume_year") in [(i.code, i.field_id) for i in result.dormant]


def test_an_asset_says_what_it_is_and_which_flow_it_serves():
    _, payload = _payload(dedicated_shared_assets=True)
    ids = _ids(payload, "infrastructure")
    assert ids[:2] == ["infra.id", "infra.description"]
    assert "infra.flow_id" in ids
    section = next(s for s in payload.sections if s.id == "infrastructure")
    assert "main production line" in section.description_en
    lifetime = next(f for f in section.fields if f.id == "infra.amortization_period_y")
    assert lifetime.label_en == "Technical lifetime (years)"


def test_the_flow_an_asset_serves_is_picked_from_the_flow_matrix():
    case, payload = _payload(dedicated_shared_assets=True)
    flow = DcfRow(row_id="f1", values={"flow.name": "whey"})
    data = DcfData(case_id="c", rows_by_section={"flow_matrix": [flow]})
    wb = load_workbook(io.BytesIO(render_xlsx(payload, data)))
    ws = next(wb[n] for n in wb.sheetnames if "nfrastruct" in n)
    headers = [c.value for c in ws[4]]
    letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[headers.index("Flow served")]
    assert any(any(str(r).startswith(f"{letter}5") for r in dv.sqref.ranges)
               for dv in ws.data_validations.dataValidation)


def test_cff_parameters_only_with_q4_d_and_an_lca_outside_c2():
    cff = {"classif.cff_a", "classif.cff_r1", "classif.cff_qsin_qp", "classif.cff_source"}
    _, with_d = _payload(q4={Q4.D})
    assert cff <= set(_ids(with_d, "flow_classification"))
    _, without_d = _payload(q4={Q4.B})
    assert not cff & set(_ids(without_d, "flow_classification"))
    _, c2 = _payload(q4={Q4.D}, decision_context="corporate_report")
    assert not cff & set(_ids(c2, "flow_classification"))
    _, eco_only = _payload(q4={Q4.D}, q3=Q3(eco=True))
    assert not cff & set(_ids(eco_only, "flow_classification"))
