"""The picture of the network in both files (owner decision 2026-11-03: a
faithful image of the editor, captured by the browser, in Word and Excel)."""
from __future__ import annotations

import base64
import io
import struct
import zlib

from docx import Document
from openpyxl import load_workbook


def _png(width: int = 40, height: int = 20) -> bytes:
    def chunk(kind: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))
    raw = b"".join(b"\x00" + b"\xff\xff\xff" * width for _ in range(height))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))


CASE = {"q1": "B", "q2": "B", "decision_context": "micro", "q3": {"env": True, "eco": True, "soc": False},
        "flows": [{"id": "f1", "name": "whey", "q5": "a"}]}


def test_the_word_document_carries_the_network_picture(client):
    png = base64.b64encode(_png()).decode()
    r = client.post("/api/dcf/export/docx", json={"case": CASE, "network_png": f"data:image/png;base64,{png}"})
    assert r.status_code == 200, r.text
    assert len(Document(io.BytesIO(r.content)).inline_shapes) == 1


def test_the_excel_network_sheet_carries_the_picture(client):
    r = client.post("/api/dcf/export/xlsx", json={"case": CASE, "network_png": base64.b64encode(_png()).decode()})
    assert r.status_code == 200, r.text
    wb = load_workbook(io.BytesIO(r.content))
    assert sum(len(ws._images) for ws in wb.worksheets) == 1


def test_without_a_picture_the_files_are_as_before(client):
    r = client.post("/api/dcf/export/docx", json={"case": CASE})
    assert len(Document(io.BytesIO(r.content)).inline_shapes) == 0


def test_something_that_is_not_a_png_is_refused(client):
    r = client.post("/api/dcf/export/docx", json={"case": CASE, "network_png": base64.b64encode(b"GIF89a").decode()})
    assert r.status_code == 422
