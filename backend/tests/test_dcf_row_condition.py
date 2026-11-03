"""DCF fields asked on some rows only (`row_condition`, e.g. CAPEX for a new
asset): the condition was declared in the schema and evaluated by no code
(audit leftover, decided by Fable on 2026-11-03)."""
from __future__ import annotations

import io

from openpyxl import load_workbook

from app.domain.dcf_data import DcfData, DcfRow
from app.domain.models import Q3, Case
from app.engine.dcf_data_validate import validate_dcf_data
from app.engine.dcf_rows import cell_values
from app.routers.dcf import _get_schemas, _load_dcf_schema, _run_and_compose
from app.services.dcf_excel import render_xlsx


def _payload(**kw):
    case = Case(q1="B", q2="B", q3=Q3(env=True, eco=True), decision_context="micro", **kw)
    return case, _run_and_compose(case, _get_schemas())


def _infra(payload):
    return next(s for s in payload.sections if s.id == "infrastructure")


def test_compose_lists_the_rows_a_field_is_asked_on():
    _, payload = _payload(policy_objective=False)
    fields = {f.id: f for f in _infra(payload).fields}
    assert fields["infra.capex_amount"].row_condition_values == ["new"]
    assert fields["infra.year_built"].row_condition_values == ["existing", "replaced", "upgraded"]
    # decommissioning is asked only with an S-LCC, which asks it on every row
    assert "infra.decommissioning_cost" not in fields
    assert fields["infra.status"].row_condition_values is None


def test_a_case_level_condition_asks_the_field_on_every_row():
    # `… or lcc_type in ["C+E+S", "C+N+S"]`: an S-LCC asks decommissioning everywhere
    _, payload = _payload(policy_objective=True)
    fields = {f.id: f for f in _infra(payload).fields}
    assert fields["infra.decommissioning_cost"].row_condition_values is None


def test_a_value_on_a_row_where_the_field_is_not_asked_is_dormant_and_not_exported():
    case, payload = _payload(policy_objective=False)
    row = DcfRow(row_id="i1", values={"infra.status": "existing", "infra.capex_amount": 5000,
                                      "infra.year_built": 1998})
    data = DcfData(case_id="c", rows_by_section={"infrastructure": [row]})
    result = validate_dcf_data(data, payload, _load_dcf_schema(), case)
    assert [(i.code, i.field_id) for i in result.dormant] == [("row_condition_false", "infra.capex_amount")]
    assert not result.errors
    section = _infra(payload)
    values = dict(zip([f.id for f in section.fields], cell_values(section, row), strict=True))
    assert values["infra.capex_amount"] is None
    assert values["infra.year_built"] == 1998


def test_the_excel_header_says_which_rows():
    _, payload = _payload(policy_objective=False)
    wb = load_workbook(io.BytesIO(render_xlsx(payload)))
    ws = next(wb[n] for n in wb.sheetnames if "nfrastruct" in n)
    notes = [c.comment.text for c in ws[4] if c.comment]
    assert any("Only for rows with Status: new" in n for n in notes)
