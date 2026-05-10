# T4.6 Validation Reports

Auto-generated `.docx` validation reports for the 13 case-study fixtures
(12 papers + Leiva 2025 split into Escombreras and Frövi sub-cases).
Per `SPRINT4_BOOTSTRAP_v2.md` §7 Step 5 + `SYMBA_T46_Validation_WorkingDoc_v1.md`
§6 canonical 8-section structure.

## Files (not committed)

The generated `.docx` files are gitignored — they are regenerable from
the fixtures and the engine, and would otherwise pollute git history with
binary blobs. To produce them locally:

```powershell
cd backend
$env:PYTHONPATH = "."
python scripts/generate_validation_reports.py
```

Output is written to this directory:

```
T46_VR_<short_ref>.docx
```

For the 13 short refs see `backend/scripts/generate_validation_reports.py:PAPERS`
or the test fixture list in `backend/tests/test_12_papers_regression.py`.

## Section structure (per WorkingDoc §6)

1. Bibliographic reference and IS context
2. Case study summary
3. Methodological configuration adopted by the authors
4. Compilation of the seven user-facing tool questions
5. Methodological configuration derived by the tool
6. Comparison: paper configuration vs tool configuration
7. Validation verdict (preliminary)
8. Appendix: full node activation list

Section 5 + 7 + 8 are populated automatically from the engine output;
sections 1–4 + 6 are derived from `PAPERS` metadata in the script.
For final reports, sections 6–7 require human review/editorial work
beyond what the auto-generator covers.

## Verification

The generator is covered by `backend/tests/test_validation_reports.py`:
4 smoke tests that build into a temporary directory and assert
file count, file size, canonical headings, and known-divergence
content (Kerdlap → IS-04, Paulu → Q4=D,E).
