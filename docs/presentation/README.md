# Presentation material — SYMBA T4.6

Source material for the consortium / GA deck about the T4.6 Monitoring & Reporting System. Tracked
here so the deck stays reproducible; the built artefacts are **not** tracked (see `.gitignore`).

Rewritten from scratch on 2026-10-18 after the rebuild of the app on the variables of D4.1 and D4.2
(no IS pathways, questionnaire in three parts, L2 rules shown as obligations). Earlier versions
describe a retired design.

| File | What it is |
|---|---|
| `SYMBA_T46_teoria.md` | Theory document (IT): the methodological narrative the deck is cut from |
| `SPEAKER_TRACK_EN.md` | Speaker track (EN) for the 7-slide talk, with a quick-reference numbers table |
| `COWORK_SCRIPT_DETAILED.md` | Slide-by-slide verbatim content for the branded `SYMBA_T46_GA_v9.pptx` template |
| `COWORK_PROMPT.md` | Short prompt variant of the same |
| `build_deck.py` | Generates an unbranded approximation of the same 7 slides |
| `screenshots/` | UI captures embedded by `build_deck.py` (`01-home.png` … `05-about.png`) |

The speaker track, the slide script, the prompt and `build_deck.py` carry the same slides in the same order (the theory document is the narrative they are cut from); change them together.

## Rebuild the deck

```bash
pip install python-pptx          # only dependency
python docs/presentation/build_deck.py
# -> docs/presentation/SYMBA_T46_GA_corrected.pptx (git-ignored)
```

`build_deck.py` only *approximates* the SYMBA visual identity. For the official look, paste the
content of `COWORK_SCRIPT_DETAILED.md` into the branded `SYMBA_T46_GA_v9.pptx` master. A missing
screenshot is skipped, not an error.

## Known staleness

- `screenshots/` re-captured on 2026-10-18, after the rebuild (R1-R5, `main` at #151). Re-capture
  Home / Questionnaire / Result / Cases / About whenever the questionnaire or the result page change.
- The numbers (tests, validation, rule and node counts) are those of 2026-10-18. Tests grow with every
  PR: check them against `main` before the deck is shown.
- Open points named on the last slide (CIRCE scoring I/O specification, public opening, D4.1/D4.2
  revision) were open on 2026-10-18.
