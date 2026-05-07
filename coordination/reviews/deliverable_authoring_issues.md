# Deliverable Authoring Issues — Running Log v2

**Audience**: Mirko Busto (autore SYMBA WP4 deliverable)
**Reviewer**: Architect chat (Claude Opus 4.7)
**Status**: COMPLETO per Sprint 0 review (Pass 2 LCA + LCC + S-LCA + scan footnote D4.1).
**Scope coperti**: D4.1 LCA (sezioni chiave + scan footnote-flagged issues), D4.2 LCC (sezioni chiave), D4.3 S-LCA (sezioni chiave).
**Aggiornamento**: 2026-05-07 dopo Pass 2-S-LCA + scan D4.1 footnotes.

---

## Note d'uso

Issue testuali nei deliverable (NON bug del decision engine Kimi). Catalogate per gravità:

- **🔴 Inconsistenza logica/contraddizione/errore strutturale**: il testo afferma due cose incompatibili o ha errori nei riferimenti
- **🟠 Ambiguità interpretativa/lacuna metodologica**: leggibile in più modi o manca regola operativa
- **🟡 Terminologia non-standard / citazione mancante**: introduce termini senza definizione o cita range/valori senza fonte
- **🟢 Refactoring suggerito**: corretto ma riformulabile per chiarezza

**Importante**: molte issue D4.1 sono già **flagged in commenti footnote** del documento stesso (es. c222, c232, c234, c256, c261, c262). Sono "known issues" già in coda editoriale. Le riporto qui per consolidamento.

---

## D4.1 LCA Guidelines

### Issue D4.1-001 🟢 — Decision tree 4-step da consolidare in figura 1-page

**Descrizione**: Il decision tree consolidato a 4 step (Economic Value Test → Interdependence → Q-corrected Substitution → Zero-Burden) è formulato bene nei testi §6.3.1 e nelle footnote c133, ma manca una rappresentazione visiva unica.

**Status**: già flagged in footnote c133: "Recommend converting this into a one-page decision tree (figure)".

**Proposta**: Figura 1-page con i 4 step + edge cases (negotiated transfer prices, zero-priced high-utility flows, regulated wastes). Aggiungere callout box per gli edge case.

**Severità**: 🟢

---

### Issue D4.1-002 🟠 — Asimmetria temporale LCA/LCC discounting senza regola operativa

**Descrizione**: Il D4.1 identifica correttamente l'asimmetria LCA-non-discount vs LCC-discount ma non fornisce la regola di gestione operativa per gli IS-LCSA.

**Status**: già flagged in footnote c232 ("METHODOLOGICAL — TEMPORAL INCONSISTENCY: The doc correctly identifies the LCA/LCC discounting asymmetry but gives NO RULE for handling it") + footnote c233 (proposed solution).

**Proposta** (già abbozzata nelle tue footnote c233): adottare convenzione esplicita aligned con JRC LCC + SETAC:
- LCA: NO discount, dynamic LCA per GWP time-differentiated
- LCC: discount con declining social discount rate (DEFRA Green Book) o fixed per giurisdizione
- Capital goods: amortizzazione lineare in entrambi
- Documentare scelte nel methodological charter

Il phase5 di Kimi (`TMC-02 Discounting Paradox`) propone la stessa cosa: "Discounting Firewall" con LCA undiscounted + LCC discounted + eco-efficiency ratio etichettato come "discounted cost per undiscounted impact". Coerente con la tua proposta c233.

**Severità**: 🟠 (issue metodologica importante, da risolvere prima della consegna finale).

---

### Issue D4.1-003 🟡 — Discount rate range 0–7% senza autorità citata

**Descrizione**: Il range 0–7% per discount rate è citato senza riferimento normativo.

**Status**: già flagged in footnote c234.

**Proposta** (dalla tua footnote c234): citare almeno una di queste authority:
- EU BEI Guide to CBA (European Commission, 2014): 3% social discount per progetti di coesione
- Stern Review (2006): ~1.4%
- US OMB Circular A-4: 3% / 7%

**Severità**: 🟡

---

### Issue D4.1-004 🟢 — Pedigree Matrix vs Monte Carlo: wording da rifinire

**Descrizione**: La frase "the three techniques are complementary" è migliorata, ma il top sentence "each addressing a specific kind of uncertainty" è ancora ambiguo.

**Status**: già flagged in footnote c222 + c223 + c224.

**Proposta** (dalla tua footnote c224): rewording esplicito:
> "The Pedigree Matrix (Weidema & Wesnaes 1996; Ciroth et al. 2016 update) converts qualitative data-quality scores into quantitative uncertainty factors (geometric standard deviations) that feed Monte Carlo or analytical uncertainty propagation. It is complementary to, not a substitute for, stochastic methods."

**Severità**: 🟢

---

### Issue D4.1-005 🔴 — §13 Checklist con cross-references rotti

**Descrizione**: Il checklist di §13 referenzia sezioni con numerazione che non corrisponde a quella attuale del documento.

**Status**: già flagged in footnote c262: "STRUCTURAL — BROKEN CROSS-REFS: The §13 checklist references (§2.4.4, §3, §4, §6, §7, §8, §9, §§10–12) do not match the current chapter numbering."

**Proposta** (dalla tua footnote c262): rimappare ogni reference. I target intesi sono:
- Framework: §2.4.4 ✓ / §5.4.1 ✓
- FU: §3 ✓
- Counterfactual: §8 (non §4 — §4 è System Boundaries)
- Matrix model: §6 o §12.4.1 (non §6 LCI)
- LCIA: §7 ✓
- Spatial/temporal: §9 (non §8)
- Uncertainty: §10 (non §9)
- Documentation: §12 (non §§10–12, che includerebbero LCC)

**Severità**: 🔴 (bug strutturale: i lettori che usano il checklist per navigare il documento finiscono in sezioni sbagliate. Da risolvere prima della circolazione del WIP).

---

### Issue D4.1-006 🟠 — §13 Checklist incompleta (skip §5 multifunctionality + §11 LCC/S-LCA integration)

**Descrizione**: Il checklist promette copertura di §§2-12 ma salta §5 (Multifunctionality) e §11 (LCC/S-LCA integration).

**Status**: già flagged in footnote c261.

**Proposta** (dalla tua footnote c261): aggiungere tenets:
- (a) **Multifunctionality**: "Have you defaulted to Substitution with a quality-corrected ratio, and documented any departure?"
- (b) **LCSA consistency**: "Are FU, boundaries, time horizon, and scenarios identical across LCA, LCC, and S-LCA?"

**Severità**: 🟠 (skip di §5 è particolarmente grave — è "the single most consequential methodological chapter of Part 1" come dici tu in c261).

---

### Issue D4.1-007 🟡 — Duplicazione "Shared Methodological Charter" (§11.3.4 vs §12.6)

**Descrizione**: Il principio "Shared Methodological Charter" è ripetuto in due sezioni con stesso titolo e stessa sostanza.

**Status**: già flagged in footnote c256.

**Proposta** (dalla tua footnote c256): cancellare §11.3.4 (visto che §12.6 è la sezione di sintesi/chiusura) o trasformare uno dei due in cross-reference.

**Severità**: 🟡

---

### Issue D4.1-008 🟡 — MFCA come bridge LCA/LCC/MFA: solo concettuale, manca how-to

**Descrizione**: MFCA è raccomandato come bridge tra LCA/LCC/MFA ma non c'è guidance pratica su come strutturare il link.

**Status**: già flagged in footnote c239 ("conceptually strong but practically thin") + footnote c240 (proposed solution).

**Proposta** (dalla tua footnote c240): aggiungere mini-guida 1-page con i 3 step di linking:
1. MFCA material-flow quantification (ISO 14051:2011) come SHARED foreground inventory
2. Mappare MFCA "material loss cost" → LCA "avoided burdens"
3. Reconcile FU (MFCA = organizational/period-based, LCA = product-based) con bridging step

Citation refs già presenti in footnote: Christ & Burritt 2015; Nakajima et al. 2015; Schmidt & Nakajima 2013; ISO 14051:2011; ISO 14052:2017.

**Severità**: 🟡

---

## D4.2 LCC Guidelines

### Issue D4.2-001 🟡 — Terminologia "Entry-to-Gate" non-standard ISO

**Descrizione**: Il D4.2 introduce "Entry-to-Gate" come boundary del C-LCC consolidato a livello network. Non è ISO 14040/14044 né letteratura mainstream.

**Estratto** (§4 IS Declination): "expanding the boundary to **Entry-to-Gate**, encompassing the entire group of collaborating firms."

**Proposta**:
- Opzione 1: glossa esplicita la prima volta che il termine compare ("Entry-to-Gate is a custom IS-specific boundary defined as...")
- Opzione 2: rinominare "Network-Boundary C-LCC" o "Aggregated Firm Boundary" — autoesplicativi senza nomenclatura ad-hoc
- Aggiornare il glossario all'inizio del documento.

**Severità**: 🟡

---

### Issue D4.2-002 🟠 — Ambiguità sull'applicabilità universale del vincolo "FU identical to LCA"

**Descrizione**: §3 dice "the LCC must adopt the same FU... defined in the parallel LCA" (lettura universale), ma §11 chiarisce che C-LCC è strutturalmente misaligned con LCA cradle-to-gate. Il vincolo "FU identical" si applica strutturalmente solo a E-LCC.

**Proposta**: riscrivere §3 come **type-specific**:
> "For IS, the LCC must define a Functional Equivalent that is **type-coherent with the parallel LCA**:
> - **E-LCC**: Functional Equivalent IDENTICAL to the LCA Functional Unit (per Hunkeler et al. 2008). Prerequisito per eco-efficiency calculation.
> - **C-LCC**: Functional Equivalent ALIGNED to the LCA Functional Unit at firm gate level (gate-to-gate). Cross-pillar comparison limitato a presentazioni non-eco-efficiency.
> - **S-LCC**: Functional Equivalent EXTENDED beyond LCA FU per includere cradle-to-grave societal cost flows."

E aggiornare HC-04 LCC nel deliverable in modo che sia type-specific oppure riservato all'E-LCC.

**Severità**: 🟠 (impatta anche estrazione Kimi: HC-04 è applicato come universale su tutti i pathway).

---

### Issue D4.2-003 🟠 — "Typically Cradle-to-Gate" indebolisce un vincolo "must be identical"

**Descrizione**: §4 dice "E-LCC boundary must be identical to LCA — typically a Cradle-to-Gate boundary". L'avverbio "typically" indebolisce il vincolo. Se LCA non è cradle-to-gate (es. cradle-to-grave per S-LCC, gate-to-gate per C2), che fa l'E-LCC?

**Proposta**: rimuovere "typically a Cradle-to-Gate" o trasformarlo in nota informativa separata:
> "Boundary for Environmental LCC (E-LCC): The Product Value Chain. The E-LCC boundary must be identical to that of the parallel LCA. *(In most IS studies focused on producing a marketable product or substituting a virgin material, this is a Cradle-to-Gate boundary; for studies with cradle-to-grave LCA scope, the E-LCC extends correspondingly.)*"

**Severità**: 🟠

---

### Issue D4.2-004 🟢 — Numerazione HC duplicata cross-document (D4.1 vs D4.2 entrambi hanno HC-13)

**Descrizione**: Sia D4.1 che D4.2 usano HC-13 per costrizioni diverse. Legittimo (numerazione interna), ma confonde.

**Proposta**: nelle sezioni cross-method (§12 LCSA integration), usare prefissi metodologici (LCA-HC-13, LCC-HC-13). Oppure cross-reference table all'inizio del documento integrato finale.

**Severità**: 🟢

---

### Issue D4.2-005 🟡 — Discount rate ranges in Tabella 2 senza giurisdizione/anno

**Descrizione**: Tabella 2 (Societal/S-LCC 1.5-4%, etc.) non specifica giurisdizione né anno di riferimento. I tassi sono time-dependent.

**Proposta**: aggiungere note di contesto (UE 2022-2024 reference period, citation EU CBA Guide, periodicità di update).

**Severità**: 🟡

---

## D4.3 S-LCA Guidelines

### Issue D4.3-001 🟠 — Registro descrittivo vs normativo: ambiguità sistemica

**Descrizione**: Il D4.3 usa registro descrittivo ("the assessment adopts...", "scenarios are defined...", "results are presented...") quasi ovunque. D4.1 e D4.2 usano sistematicamente registro normativo ("must", "shall", "should"). Questo crea ambiguità sistemica nel D4.3: alcune frasi descrittive sono Hard Constraints (vincoli inderogabili), altre sono good practice (raccomandazioni). Il lettore non può distinguerle dal solo registro testuale.

**Esempi specifici**:

| Estratto D4.3 (descrittivo) | Re-frasing normativo equivalente | Status reale (HC vs MC) |
|---|---|---|
| "The objective of the assessment is not to quantify absolute social impacts, but to evaluate relative changes" (§2.1) | "The assessment **shall** evaluate relative changes in social performance, not absolute impacts" | HC (foundational) |
| "Both scenarios are defined consistently to ensure comparability" (§2.2) | "Both scenarios **shall** be defined consistently" | HC |
| "The functional unit defined in LCA and LCC is retained as a common reference" (§3.1) | "The functional unit defined in LCA and LCC **shall** be retained as a common reference" | HC |
| "A materiality assessment is applied to identify and prioritize..." (§6.2) | "A materiality assessment **shall** be applied..." | HC |
| "Stakeholder engagement is integrated across different stages..." (§14.1) | "Stakeholder engagement **should** be integrated across different stages..." | MC (good practice) |

**Proposta**: revisione editoriale sistematica del D4.3 per esplicitare il registro normativo dei vincoli (must/shall per HC, should/recommended per MC). Il D4.3 ha già una struttura di "principi metodologici" in §14.2 — quei principi possono fungere da guida per identificare quali frasi descrittive precedenti corrispondono effettivamente a HC.

**Severità**: 🟠 (la mancanza di registro normativo è il motivo per cui Kimi ha avuto bisogno di "promuovere" sistematicamente le frasi a HC — un revisore esterno ISO/UNEP/SETAC potrebbe leggere alcuni vincoli come opzionali).

---

### Issue D4.3-002 🟡 — Terminologia "aggregation" usata in due sensi opposti

**Descrizione**: Il termine "aggregation" è usato nel D4.3 con due significati diversi e non chiaramente distinti:

1. **Aggregation = strutturazione multi-level (PERMESSA)**:
   - §8.2 fine: "supporting subsequent **aggregation** and analysis"
   - §9 titolo: "**Aggregation**, Interpretation and Trade-off Analysis"

2. **Aggregation = single-score collapse (VIETATA)**:
   - §9.3: "Rather than producing a single **aggregated** score..."
   - HC-33 Kimi: "shall NOT be **aggregated** into single metric"

Questo crea confusione: il lettore può interpretare "aggregation" come l'azione vietata e quindi confondere multi-level structuring con single-score aggregation.

**Proposta**: introdurre due termini distinti:
- "**Multi-level structuring**" o "**Hierarchical aggregation**" per il processo permesso (organizing scores at indicator → stakeholder → system levels)
- "**Single-score aggregation**" o "**Cross-dimensional collapse**" per quello vietato (combining different dimensions into one metric)

Aggiornare titolo §9: "Hierarchical Structuring, Interpretation and Trade-off Analysis" oppure mantenerlo ma chiarire in apertura che "in this section, 'aggregation' refers to multi-level structuring, NOT to single-score collapse, which is explicitly prohibited."

**Severità**: 🟡 (terminologia ambigua può portare a misapplicazione del framework).

---

## Riepilogo issue raccolte

| Documento | Severità 🔴 | Severità 🟠 | Severità 🟡 | Severità 🟢 | TOTALE |
|---|---|---|---|---|---|
| **D4.1** | 1 (D4.1-005 broken cross-refs) | 2 (D4.1-002, D4.1-006) | 3 (D4.1-003, D4.1-007, D4.1-008) | 2 (D4.1-001, D4.1-004) | **8** |
| **D4.2** | 0 | 2 (D4.2-002, D4.2-003) | 2 (D4.2-001, D4.2-005) | 1 (D4.2-004) | **5** |
| **D4.3** | 0 | 1 (D4.3-001) | 1 (D4.3-002) | 0 | **2** |
| **TOTALE** | **1** | **5** | **6** | **3** | **15** |

---

## Raccomandazioni operative per Mirko (autore)

### Priorità ALTA — risolvere prima della consegna finale

1. **D4.1-005 🔴 (broken cross-refs §13)**: bug strutturale di navigazione. Mezz'ora di fix.
2. **D4.1-002 🟠 (temporal asymmetry LCA/LCC discounting)**: lacuna metodologica importante. Adottare la convenzione "Discounting Firewall" che sia tu (footnote c233) che Kimi (Phase 5 TMC-02) hanno indipendentemente proposto. ~2h scrittura.
3. **D4.1-006 🟠 (checklist incompleta)**: aggiungere 2 tenets su multifunctionality + LCSA consistency. ~30 min.
4. **D4.2-002 🟠 + D4.2-003 🟠 (FU identical universale vs E-LCC-only)**: refactoring §3 + §4 + §11 con type-specific specifications. ~2h.
5. **D4.3-001 🟠 (registro descrittivo)**: revisione editoriale sistematica per esplicitare must/shall. ~3-4h.

### Priorità MEDIA — nice-to-have

6. **D4.1-001 🟢 (decision tree figure)**: 1-page visual figure. ~1h con tool grafico.
7. **D4.1-008 🟡 (MFCA mini-guide)**: 1-page how-to per linking LCA/LCC/MFA. ~1.5h.
8. **D4.2-001 🟡 (Entry-to-Gate)**: rinominare o glossare. ~30 min.
9. **D4.3-002 🟡 (aggregation terminology)**: introdurre distinzione multi-level vs single-score. ~30 min.

### Priorità BASSA — refactoring cosmetico

10. **D4.1-003 🟡 (citation discount range)**: aggiungere 1 reference. ~10 min.
11. **D4.1-004 🟢 (Pedigree wording)**: adottare la riformulazione di footnote c224. ~10 min.
12. **D4.1-007 🟡 (duplicazione Shared Charter)**: scegliere quale eliminare. ~15 min.
13. **D4.2-005 🟡 (discount rate context)**: aggiungere note di contesto. ~15 min.
14. **D4.2-004 🟢 (numerazione HC duplicata)**: cross-reference table. ~30 min se si fa documento integrato.

**Totale stima refactoring editoriale**: ~12-15h per arrivare a versione consolidata "ready for review esterna".

---

## Metodologia di review

Le issue sono emerse:
- **Pass 2-LCA**: lettura §2.3.4 (ILCD), §3.2.1 (FU), §5.3.1 (Multifunctionality), §6.3.1 (Zero-burden), §10.3.1 (Transport), §11 (Uncertainty), §12 (LCSA integration)
- **Pass 2-LCC**: lettura §2.2-2.3 (LCC Type, 3-Level), §3 (FU/Functional Equivalent), §4 (Boundary by LCC type), §7 (Discounting), §11 (LCA-LCC integration)
- **Pass 2-S-LCA**: lettura §2.1-2.2 (Goal/Scope, comparative logic), §6 (Materiality), §8.2 (Scoring), §9 (Aggregation/Interpretation)
- **Scan footnote D4.1**: estratto issue già flagged in commenti c133, c222-224, c232-234, c239-240, c256, c261-262

**Per una review sistematica completa** (lettura sezione per sezione di tutti i deliverable, non solo le sezioni che impattano il decision engine), serve uno sprint dedicato (~4-6h Architect chat per documento). Da considerare se Mirko vuole arrivare a una versione "polished" pre-consegna finale.

---

## Status documenti

| Documento | Versione corrente | Issue 🔴 aperte | Pronta per consegna? |
|---|---|---|---|
| **D4.1** | WIP (file marker `_WIP`) | 1 (broken cross-refs §13) | NO — fix 🔴 + 🟠 prima |
| **D4.2** | V1 | 0 | Quasi — fix 🟠 raccomandato |
| **D4.3** | V1 | 0 | Quasi — fix 🟠 D4.3-001 raccomandato |

---

*Running log v2 — finale per Sprint 0 review. Prossimi update solo se emergono issue durante stesura JSON v2 o stress test Pass 3.*
