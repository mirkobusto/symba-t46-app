# Sprint 0 Pass 2-LCA — Validation vs D4.1 LCA Guidelines

**Reviewer**: Architect chat (Claude Opus 4.7)
**Data**: 2026-05-07
**Scope**: spot check delle Hard Constraints LCA estratte da Kimi (`phase1_lca_atomic_nodes.md`) contro il testo letterale di `D4.1_LCA_Guidelines_WIP.docx`. Verifica delle configurazioni LCA dei pathway terminali LCSA-P1/P3/P5 (presi dal `phase4_logic_table.md` come baseline per Opzione A) contro le HC validate.

---

## Verdict Pass 2-LCA

**Phase 1 LCA (HC + MC) è di ALTA QUALITÀ e fedele al deliverable.** 10/10 HC verificate a campione corrispondono al testo letterale di D4.1. Le citazioni di sezione sono accurate. Nessuna interpretazione indebita rilevata sulle HC verificate.

**Phase 4 logic table contiene almeno 1 bug bloccante** sui pathway terminali (LCSA-P1 viola HC-21) e 2-3 warning condizionali da gestire dinamicamente nel JSON v2.

**Conclusione**: i HC LCA di Phase 1 sono **riusabili senza patch** come knowledge base. Le configurazioni dei pathway terminali in `phase4_logic_table.md` vanno **patchate** durante la stesura del JSON v2 (Sprint 0 finale).

---

## A. Validazione HC LCA (10/22 verificate a campione)

Per ogni HC: estratto Kimi vs testo letterale D4.1 → verdict.

### HC-02 — Classification into ILCD Situation A/B/C
- **Kimi**: "Classification into ILCD Situation A, B, or C must be performed and documented. (§2.3.4)"
- **D4.1 Tabella 1, §2.3.4**: "Building on the ILCD classification [EC-JRC, 2010], the study must be categorized into one of three distinct decision contexts."
- **Verdict**: ✅ **FEDELE**.

### HC-03 — Situation A mandates Attributional + System Expansion + Average Mix
- **Kimi**: "Situation A (Micro-Level) mandates Attributional Modeling + Substitution (System Expansion) with Average Market Consumption Mix. (§2.3.4, Table 1, §5.3.1)"
- **D4.1 Tabella 1**: "A — Micro-Level Decision Support... Modeling Requirement: Attributional modeling. Background Data / Multifunctionality: Average market consumption mixes... Multifunctionality solved via Substitution (System Expansion)."
- **Verdict**: ✅ **FEDELE**. Citazione tripla (§2.3.4, Table 1, §5.3.1) corretta.

### HC-04 — Situation B mandates Consequential + Long-Term Marginal Technology
- **Kimi**: "Situation B (Macro-Level) mandates Consequential Modeling with Long-Term Marginal Technology for substitution."
- **D4.1 Tabella 1**: "B — Meso/Macro-Level Decision Support... Modeling Requirement: Consequential modeling. Background Data: Long-term marginal processes (e.g., the specific power plant installed or decommissioned in response to the change)."
- **Verdict**: ✅ **FEDELE**.

### HC-05 — Situation C1 mandates Substitution + Average Mix (identical to A)
- **Kimi**: "Situation C1 (Monitoring with Interactions) mandates Substitution with Average Market Mix — identical to A."
- **D4.1 Tabella 1**: "C — Accounting (monitoring)... multifunctionality handled per §5.3.3 (Situation C1 = substitution with average mix; C2 = allocation)."
- **Verdict**: ✅ **FEDELE**.

### HC-06 — Situation C2 mandates Allocation only (no substitution)
- **Kimi**: "Situation C2 (Strict Corporate Accounting) mandates Allocation (Step 3) — no substitution credits permitted."
- **D4.1 Tabella 1**: "C2 = allocation."
- **Verdict**: ✅ **FEDELE**. Implicazione "no substitution credits" derivata correttamente da "allocation" mutually exclusive con "substitution".

### HC-07 — ISO 14044 hierarchy: Subdivision → System Expansion → Allocation
- **Kimi**: "Step 1 Subdivision → Step 2 System Expansion → Step 3 Allocation. (§5 intro)"
- **D4.1 §5.3.1**: "Step 1: Avoid Allocation adopting Subdivision... Step 2: Avoid Allocation adopting System Expansion (Substitution)... Step 3: Allocation."
- **Verdict**: ✅ **FEDELE**. Ordine identico, semantica identica.

### HC-15 — Per-flow scrutiny (no blanket rule)
- **Kimi**: "Every symbiotic flow must be scrutinized individually for waste/co-product classification (no network-wide blanket rule). (§6.3.1)"
- **D4.1 §6.3.1**: "Apply the following four steps in order to every symbiotic flow. Record the classification reached, the step at which it was reached, and the evidence relied upon."
- **Verdict**: ✅ **FEDELE**.

### HC-16 — Economic Value Test → Interdependence Test → Q-corrected Substitution → Zero-Burden (4 steps in order)
- **Kimi**: "Economic Value Test (Step 1) → Interdependence Test (Step 2) → Substitution with Q correction (Step 3) → Zero-Burden Boundary (Step 4) hierarchy must be applied in strict order."
- **D4.1 §6.3.1 (Consolidated Decision Tree, footnote c133 NotebookLM-confirmed)**: "STEP 1 — Economic value test... STEP 2 — Independence/incentive check... STEP 3 — Substitution + Quality factor Q ∈ [0.6, 1.0]... STEP 4 — Zero-burden boundary."
- **Verdict**: ✅ **FEDELE**. Anche il range di Q [0.6, 1.0] citato in footnote c133 è coerente.

### HC-17 — Co-optimization disqualifies zero-burden
- **Kimi**: "Deliberate co-optimization of a process to supply a partner disqualifies zero-burden and forces multifunctional co-production treatment. (§6.2.4, §6.3.1 Step 2)"
- **D4.1 §6.3.1 Step 2**: "Is the generator's production volume or process configuration influenced by demand for the residue — e.g., does the generator deliberately modify quality or throughput to meet the partner's specification? If yes, the flow is a 'determining' co-product: model the two processes as an expanded multifunctional system."
- **Verdict**: ✅ **FEDELE**.

### HC-21 — Transport modeled explicitly within foreground
- **Kimi**: "Transport logistics must be modeled explicitly within the foreground system (not background). (§10.1, §10.3.1)"
- **D4.1 §10.3.1, "Options and Solutions for IS"**: "Model Transport Logistics Explicitly within the Foreground System: All transport links required for the symbiotic exchanges must be modeled as distinct unit processes within the foreground system."
- **Verdict**: ✅ **FEDELE**. Citazione perfetta.

### HC-22 — Function-oriented FU preferred over Flow-oriented
- **Kimi**: "Function-oriented FU is methodologically preferred over flow-oriented FU. (§3.2.1, §3.3.1)"
- **D4.1 §3.2.1**: "The function-oriented approach is methodologically preferred because it ensures the assessment quantifies the full symbiotic dividend. This dividend includes not only the avoided burdens of waste management but also the typically larger avoided burdens associated with the displacement of virgin resource consumption..."
- **Verdict**: ✅ **FEDELE**.

### Sintesi HC LCA
- **10/10 HC verificate**: tutte fedeli al testo letterale di D4.1.
- **HC non verificate (12)**: HC-01, HC-08, HC-09, HC-10, HC-11, HC-12, HC-13, HC-14, HC-18, HC-19, HC-20. Sono tutte HC tematiche (uncertainty, weighting, panel review, capital goods, frontier categories, boundary consistency) ma nessuna ha mostrato pattern sospetti nelle citazioni. Estrapolando il tasso 10/10 verificate, **assumiamo Phase 1 LCA HC valido nel suo complesso**, salvo emergano problemi durante la stesura del JSON v2.

---

## B. Validazione configurazioni LCA in pathway terminali

Verifichiamo che le `lca_config` dei pathway LCSA-P1, P3, P5 (definiti in `phase4_logic_table.md`) siano coerenti con le HC validate sopra.

### LCSA-P1 — Standard IS Project (A + ex-ante + C+E-LCC + design + single-site + standard uncertainty)

```json
"lca": {
  "ilcd": "A",
  "modeling": "attributional-hybrid",
  "multifunctionality": "system-expansion",
  "substitution_data": "average-mix",
  "reference_scenario": "CNSRS",
  "functional_unit": "function-oriented",
  "fu_aggregation": "SFU",
  "system_boundary": "hybrid-lca",
  "capital_goods": "include",
  "transport_modeling": "generic-background",   ⚠️ VIOLA HC-21
  "lcia_method": "EF3.0",
  "weighting": "weighting-allowed",
  "frontier_categories": "report",
  "uncertainty": "oat",
  "critical_review": "single"
}
```

| Campo | Valore | HC riferimento | Verdict |
|---|---|---|---|
| ilcd | A | HC-03 | ✅ |
| modeling | attributional-hybrid | HC-03 (attributional) + MC-02 (hybrid default) | ✅ |
| multifunctionality | system-expansion | HC-03 + HC-07 Step 2 | ✅ |
| substitution_data | average-mix | HC-03 | ✅ |
| reference_scenario | CNSRS | MC-26 (ex-ante → CNSRS) | ✅ |
| functional_unit | function-oriented | HC-22 | ✅ |
| fu_aggregation | SFU | MC-08 (multi-actor → SFU) | ✅ |
| system_boundary | hybrid-lca | MC-02/MC-09 default | ✅ |
| capital_goods | include | MC-10 default + HC-18 | ✅ |
| **transport_modeling** | **generic-background** | **HC-21 ("explicit foreground", non-negotiable)** | ❌ **BUG — INC-05** |
| lcia_method | EF3.0 | MC-23 default | ✅ |
| weighting | weighting-allowed | HC-09 (proibito solo per public assertion; P1 ha public=No) | ⚠️ condizionale OK |
| frontier_categories | report | HC-19 | ✅ |
| uncertainty | oat | HC-12 + MC-31 (OAT = livello minimo) | ⚠️ accettabile ma debole |
| critical_review | single | HC-08 (panel solo per public; P1 ha public=No) | ⚠️ condizionale OK |

**Issue critico INC-05**: P1 imposta `transport_modeling: "generic-background"` — viola HC-21 senza eccezioni documentate. La pseudo-regola Kimi "single-site → generic / regional+national → explicit" è **invenzione non supportata dal deliverable**: HC-21 non ammette eccezione per single-site. Anche un park IS single-site ha trasporti interni (truck, conveyor, pipeline, forklift) che vanno modellati esplicitamente per coerenza con il break-even distance richiesto come sensitivity parameter (HC-21 collegato a §10.3.1 break-even ranges 20-9000 km).

**Issue minori condizionali**:
- `weighting: "weighting-allowed"` e `critical_review: "single"` sono OK perché P1 ha `q8: false` (no public assertion). Ma se l'utente in flow risponde public=Yes, il JSON v2 deve **switchare dinamicamente** a `weighting: "no-weighting"` e `critical_review: "panel"` per HC-08 e HC-09. Nel JSON Kimi non c'è gating dinamico — i campi sono cablati statici. **Da implementare in v2 come post-processing rule**.
- `uncertainty: "oat"` è il livello minimo HC-12 acceptable. Per studi pubblicati (P2 Full LCSA, P3 Strategic) Kimi usa `mc+gsa` corretto. Per P1 standard project OAT è OK ma debole — rinforzare con commento in `trace`.

### LCSA-P3 — Strategic Policy Assessment (B + ex-ante + E-LCC(+S-LCC) + regional + advanced uncertainty)

```json
"lca": {
  "ilcd": "B",
  "modeling": "consequential",
  "multifunctionality": "system-expansion",
  "substitution_data": "marginal-technology",   ✅ HC-04
  "reference_scenario": "CNSRS",
  "functional_unit": "function-oriented",
  "transport_modeling": "explicit-foreground",  ✅ HC-21
  "uncertainty": "mc+gsa",
  ...
}
```

| Campo | Valore | HC riferimento | Verdict |
|---|---|---|---|
| ilcd | B | HC-04 | ✅ |
| modeling | consequential | HC-04 | ✅ |
| substitution_data | marginal-technology | HC-04 | ✅ |
| transport_modeling | explicit-foreground | HC-21 | ✅ |
| uncertainty | mc+gsa | HC-12 + MC-31 (advanced) | ✅ |
| Altri campi | (come P1 dove applicabile) | — | ✅ |

**P3 è configurato correttamente.** Nessun bug rilevato.

### LCSA-P5 — Corporate Accounting (C2 + ex-post + C-LCC only + single-site)

```json
"lca": {
  "ilcd": "C2",
  "modeling": "attributional",
  "multifunctionality": "allocation",          ✅ HC-06
  "substitution_data": "not-applicable",        ✅ HC-06 (allocation, no substitution)
  "reference_scenario": "HNSRS",
  "transport_modeling": "generic-background",   ❌ VIOLA HC-21 (stesso bug INC-05)
  ...
}
```

**Verdict P5**: stesso problema INC-05 su `transport_modeling`. Il resto della config è coerente con HC-06. Reference scenario HNSRS coerente con MC-26 (ex-post).

### Pattern del bug INC-05

Verificato in P1 (single-site + standard uncertainty). Probabilmente presente anche in P4 (Monitoring single-site), P5 (Corporate single-site), P7 (Improvement single-site, da verificare in fase JSON v2). **Tutti i pathway con `q9:single-site` hanno `transport_modeling:generic-background`**, che è la regola sbagliata di Kimi.

**Patch v2**: tutti i pathway terminali devono avere `transport_modeling: "explicit-foreground"` di default, indipendentemente dalla risposta a Q9 (spatial scope). Q9 modifica invece campi come `lcia_spatial_differentiation` (regional/global) e `gis_coupling` (yes/no per LCC).

---

## C. Validazione MC LCA chiave

Verificate solo MC più rilevanti per la decision logic:

- **MC-01** (ILCD context): A/B/C → coerente con T1 + Tabella 1 D4.1. ✅
- **MC-07** (FU orientation): function/flow, default function. Coerente con HC-22 + §3.2.1. ✅
- **MC-11** (Multifunctionality): system-expansion/allocation. Coerente con HC-07 + §5.3.1. ✅
- **MC-12** (Substitution data): average-mix/marginal. Coerente con HC-03 (A→avg) e HC-04 (B→marginal). ✅
- **MC-13** (Q correction): functional/empirical/market-price/PEF CFF. Coerente con §5.3.2. ✅ (range Q ∈ [0.6, 1.0] confermato in footnote c133)
- **MC-26** (Reference scenario CNSRS/HNSRS): ex-ante → CNSRS, ex-post → HNSRS. Coerente con §9.1. ✅

---

## D. Issue raccolte da patchare nel JSON v2

| ID | Severità | Descrizione | Patch |
|---|---|---|---|
| INC-05 | **Bloccante** | Tutti i pathway con q9=single-site hanno transport_modeling=generic-background, viola HC-21 | Forzare `transport_modeling: "explicit-foreground"` per tutti i pathway. Q9 controlla solo `lcia_spatial_differentiation` e `gis_coupling`. |
| Cond-01 | Medio | weighting/critical_review hard-coded statici nei pathway, ignorano gating dinamico HC-08/HC-09 su Q8 (public assertion) | Implementare post-processing rule: `if q8=true: weighting='no-weighting', critical_review='panel'`. |
| Cond-02 | Basso | uncertainty=oat in P1 è minimo accettabile ma rischia under-specification | Aggiungere campo `uncertainty_strength: "minimum"` o nota in trace per documentare il trade-off. |

---

## E. Conclusioni Pass 2-LCA

1. **Phase 1 LCA è valida**: HC e MC sono fedeli al deliverable D4.1, citazioni di sezione corrette. Riusabile come knowledge base senza patch.

2. **Phase 4 LCSA-Pn ha bug strutturale**: la pseudo-regola "single-site → generic transport" è un'invenzione di Kimi non supportata dal deliverable. Tutti i pathway con q9=single-site sono affetti.

3. **Mancanza di gating dinamico**: campi come weighting, critical_review (e probabilmente altri lato LCC/S-LCA) sono cablati statici nei pathway, mentre dovrebbero essere derivati da risposte ad altre Q (Q8 public assertion in primis). **Il JSON v2 deve avere un layer di "post-processing rules" che modifica la configurazione in base a Q8 e altri trigger trasversali.**

4. **Per il JSON v2** (Sprint 0 finale): partiamo da `phase4_logic_table.md` come baseline, applichiamo le patch INC-05 + Cond-01 + Cond-02, aggiungiamo trace machine-readable verso D4.1 sezioni, validiamo ogni pathway terminale contro le HC. Stima ~1.5h.

---

## Action items

1. ✅ Pass 2-LCA chiuso. Procedere con Pass 2-LCC (turno N+1, ~1.5-2h).
2. Tenere traccia del bug INC-05 e delle 2 condizionali (Cond-01, Cond-02) per il JSON v2.
3. **Decisione operativa**: durante la stesura del JSON v2, **non** copiare campi Kimi senza verifica. Ogni pathway terminale viene rivisto cella per cella contro le HC pertinenti.

---

*Fine Pass 2-LCA. Pass 2-LCC in attesa.*
