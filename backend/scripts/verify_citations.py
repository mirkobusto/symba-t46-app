"""Check every narrative.json citation against the deliverables.

Two things are verified per citation: that the quoted sentence appears
**verbatim** in the named document, and that the section number we file
it under is the section that actually contains it.

Usage:

    python backend/scripts/verify_citations.py D4.1.json D4.2.json D4.3.json

Each argument is a JSON file of the shape {"fileContent": "..."} holding
the extracted text of the deliverable. The deliverables themselves are
consortium documents and are deliberately NOT in this repo; extract them
from the shared drive when a citation changes.

Note on the section mapping: TOC titles repeat across chapters ("Key
Complexities and Methodological Nuances" appears four times in D4.2), so
body headings are aligned to the table of contents *in order* rather than
looked up by title — looking them up by title silently files every LCC
citation under §12.2 instead of §2.2.
"""
import json
import re
import sys


def load(path):
    raw = json.load(open(path))["fileContent"]
    toc_end = raw.rfind("](#_Toc")
    toc = [(m.group(1), m.group(2).strip().rstrip(':'), m.group(3))
           for m in re.finditer(r"\[(\d+(?:\.\d+)*)\.?\s+([^\]]{3,90}?)\s*\]\(#_Toc\d+\)\[(\d+)\]", raw[:toc_end + 200])]
    body_start = toc_end
    heads, ti = [], 0
    for m in re.finditer(r"#{1,4}\s+([^\n#]{3,90})", raw[body_start:]):
        title = m.group(1).strip().rstrip(':').lower()
        for j in range(ti, len(toc)):
            if toc[j][1].lower() == title:
                prefix = " ".join(raw[:body_start + m.start()].split())
                heads.append((len(prefix), toc[j][0], toc[j][1], toc[j][2]))
                ti = j + 1
                break
    return " ".join(raw.split()), heads

DOCS = {n: load(p) for n, p in (("D4.1", sys.argv[1]), ("D4.2", sys.argv[2]), ("D4.3", sys.argv[3]))}

def section_at(doc, pos):
    best = None
    for off, num, title, page in DOCS[doc][1]:
        if off <= pos:
            best = (num, title, page)
    return best

nar = json.load(open("backend/app/data/narrative.json"))
rows, problems = [], []
for section in ("ilcd", "lcc", "slca"):
    for code, entry in nar[section].items():
        quote, src = entry.get("quote"), entry.get("source", "")
        if not quote:
            rows.append(("—", code, "nessuna citazione"))
            continue
        doc = src.split()[0]
        flat = DOCS[doc][0]
        positions = []
        for part in [p.strip() for p in quote.split("[…]")]:
            i = flat.find(" ".join(part.split()))
            positions.append(i)
        if any(i == -1 for i in positions):
            problems.append((code, "NON verbatim"))
            rows.append(("✗", code, "testo non trovato verbatim"))
            continue
        secs = sorted({section_at(doc, i) for i in positions}, key=lambda s: s[0])
        shown = " + ".join(f"§{s[0]} {s[1]} (p.{s[2]})" for s in secs)
        declared = re.search(r"§([\d.]+)", src)
        ok = declared and all(s[0] == declared.group(1) for s in secs)
        if not ok:
            problems.append((code, shown))
        rows.append(("✓" if ok else "≠", code, shown))

for mark, code, note in rows:
    print(f"{mark:<3} {code:<32} {note}")
print("\nDa correggere:" if problems else "\nTutte verificate.")
for c, s in problems:
    print(" -", c, "→", s)
