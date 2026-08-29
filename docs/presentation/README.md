# Presentation material — SYMBA T4.6

Source material for the GA / consortium deck about the T4.6 Monitoring &
Reporting System. Tracked here so the deck stays reproducible; the built
artefacts are **not** tracked (see `.gitignore`).

| File | What it is |
|---|---|
| `SYMBA_T46_teoria.md` | Theory document (IT) — the methodological narrative the deck is cut from |
| `SPEAKER_TRACK_EN.md` | Verbose speaker track (EN) for a ~7-slide talk |
| `COWORK_SCRIPT_DETAILED.md` | Slide-by-slide verbatim content for the branded `SYMBA_T46_GA_v9.pptx` template |
| `COWORK_PROMPT.md` | Short prompt variant of the same |
| `build_deck.py` | Generates an unbranded approximation of the deck |
| `screenshots/` | UI captures embedded by `build_deck.py` |

## Rebuild the deck

```bash
pip install python-pptx          # only dependency
python docs/presentation/build_deck.py
# -> docs/presentation/SYMBA_T46_GA_corrected.pptx (git-ignored)
```

`build_deck.py` only *approximates* the SYMBA visual identity. For the
official look, paste the content of `COWORK_SCRIPT_DETAILED.md` into the
branded `SYMBA_T46_GA_v9.pptx` master.

## Known staleness

`screenshots/` was captured on 2026-06-11, i.e. **before** the Data
Dashboard visual identity landed (PR #42, admin shell + reader shell +
onboarding wizard). Re-capture Home / Questionnaire / Result / Cases /
About before the deck is shown again.
