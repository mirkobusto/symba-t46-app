"""Country codes of the network's actors (UX round 6, P7-09).

/api/public/region/{code} counts a shared case by the country given to each
actor in the network editor: "cz" and "CZE" went in unchecked, and a partner
with "CZE" was not counted. The value is stored trimmed and in capitals, and
anything that is not two letters is refused.
"""
from __future__ import annotations

import pytest

from tests.test_dcf_data_api import _create_case, _two_actors_one_flow

pytestmark = pytest.mark.usefixtures("anonymous_save_on")


def _with_country(case_id: str, value: str) -> dict:
    body = _two_actors_one_flow(case_id)
    body["rows_by_section"]["actors"][0]["values"]["actor.country_iso2"] = value
    return body


def test_country_code_stored_in_capitals(client):
    case_id = _create_case(client)
    r = client.put(f"/api/dcf/{case_id}/data", json=_with_country(case_id, " cz "))
    assert r.status_code == 200, r.text
    actors = client.get(f"/api/dcf/{case_id}/data").json()["data"]["rows_by_section"]["actors"]
    assert actors[0]["values"]["actor.country_iso2"] == "CZ"


@pytest.mark.parametrize("value", ["CZE", "C", "1Z"])
def test_country_code_that_is_not_two_letters_is_refused(client, value):
    case_id = _create_case(client)
    r = client.put(f"/api/dcf/{case_id}/data", json=_with_country(case_id, value))
    assert r.status_code == 422
    assert [i["code"] for i in r.json()["detail"]] == ["invalid_country_code"]


def test_empty_country_is_fine(client):
    case_id = _create_case(client)
    r = client.put(f"/api/dcf/{case_id}/data", json=_with_country(case_id, ""))
    assert r.status_code == 200, r.text
