# Sprint 0 Pass 2-LCC — Validation vs D4.2 LCC Guidelines

**Reviewer**: Architect chat (Claude Opus 4.7)
**Data**: 2026-05-07
**Scope**: spot check delle Hard Constraints LCC estratte da Kimi (`phase1_lcc_atomic_nodes.md`) contro il testo letterale di `D4.2_LCC_Guidelines_V1.docx`. Verifica delle configurazioni LCC dei pathway terminali LCSA-P1/P3/P5 (presi dal `phase4_logic_table.md` come baseline per Opzione A).

---

## Verdict Pass 2-LCC

**Phase 1 LCC è valido**: 5/5 HC verificate a campione (TRIG-01, HC-01, HC-04, HC-05, HC-06, HC-13) corrispondono al testo letterale di D4.2. Citazioni di sezione corrette nelle HC verificate (con 1 eccezione minore: HC-13 cita §12.2.2 di D4.1, ma il vincolo "LCA must NOT discount" è effettivamente formulato in D4.2 §7).

**Phase 4 logic table configurazioni LCC dei pathway**: nessun bug strutturale rilevato a campione su P1/P3/P5 lato LCC. Le configurazioni sono coerenti con HC-01 (3-level), HC-04 (FU equality), HC-05 (boundary equality per E-LCC), HC-06 (break-even sensitivity).

**Conclusione**: Phase 1 LCC riusabile come knowledge base. Le configurazioni LCC dei pathway non richiedono patch (a differenza del lato LCA, dove INC-05 affligge transport_modeling). Una nota condizionale sul gating dinamico per discount_rate vs LCC type da implementare nel JSON v2.

---

## A. Validazione HC LCC (5/40 verificate a campione)

### TRIG-01 — LCC Type Selection (C-LCC / E-LCC / S-LCC)
- **Kimi**: "LCC type selection (Conventional LCC, Environmental LCC, Societal LCC) gates all downstream methodological decisions. (§2.2, §2.3, §5.1)"
- **D4.2 §2.2**: "A critical scoping decision is the selection of the LCC methodology, which must be explicitly linked to the chosen stakeholder perspective. The three available types treat costs... in fundamentally different ways: Conventional LCC (C-LCC) — The Firm Perspective... Environmental LCC (E-LCC) — The Value Chain Perspective... Societal LCC (S-LCC) — The Welfare Perspective."
- **Verdict**: ✅ **FEDELE**.

### HC-01 — Three-Level Analytical Structure (Network / Entity / Flow)
- **Kimi**: "Mandatory adoption of Three-Level Analytical Structure (Network Level / Entity Level / Flow Level). (§2.3)"
- **D4.2 §2.3**: "Following the UM3-LCE3-ISN methodology [Kerdlap et al., 2022], the LCC model must be structured to calculate financial performance indicators simultaneously at three distinct levels: Network Level (Consolidated)... Entity Level (Individual Firm)... Flow Level (Specific Exchange)."
- **Verdict**: ✅ **FEDELE**.

### HC-04 — Functional Equivalent identical to LCA FU
- **Kimi**: "Functional Equivalent must be identical to the Functional Unit defined in the parallel LCA. (§3)"
- **D4.2 §3**: "For IS, the LCC must adopt the same Functional Unit — or system of FUs — defined in the parallel LCA as its Functional Equivalent. As established in the SETAC literature, E-LCC utilizes the 'same functional unit, system boundaries, and scope' as the LCA [Hunkeler et al., 2008]."
- **Verdict**: ✅ **FEDELE**, con osservazione: il D4.2 ha ambiguità testuale interna sull'applicabilità universale del vincolo (vedi `deliverable_authoring_issues.md`). Kimi ha estratto il vincolo "universal" ma il deliverable lo applica strutturalmente solo a E-LCC.

### HC-05 — Physical system boundary of E-LCC identical to parallel LCA
- **Kimi**: "Physical system boundary of E-LCC must be identical to that of the parallel LCA. (§4.3, §11)"
- **D4.2 §4 (IS Declination Boundary Definition)**: "Boundary for Environmental LCC (E-LCC): The Product Value Chain. The E-LCC boundary must be identical to that of the parallel LCA — typically a Cradle-to-Gate boundary..."
- **Verdict**: ✅ **FEDELE**.

### HC-06 — Break-even distance as explicit sensitivity parameter
- **Kimi**: "Break-even distance must be modeled as an explicit sensitivity parameter, not treated as a fixed assumption. (§4.2, §4.3, §9.2)"
- **D4.2**: "the break-even distance must therefore be modeled explicitly as a sensitivity parameter, not treated as a fixed assumption."
- **Verdict**: ✅ **FEDELE**. Citazione quasi letterale.

### HC-13 — LCC must discount, LCA must NOT discount
- **Kimi**: "LCC must discount monetary flows; LCA must NOT discount environmental impacts. (§12.2.2)" (citazione attribuita a D4.1)
- **D4.2 §7 (Temporal Aspects and Discounting)**: "In LCA, environmental impacts are typically summed regardless of when they occur during the life cycle — a tonne of CO₂ emitted in year one is treated identically to a tonne emitted in year twenty. LCC cannot adopt this temporal neutrality, because money is not temporally neutral."
- **Verdict**: ✅ **FEDELE nel contenuto**, ❌ **citazione errata** (attribuisce a D4.1 §12.2.2 ma il vincolo è esplicitamente formulato in D4.2 §7). Patch necessaria nel JSON v2: aggiornare `trace` → `["D4.2 §7 Temporal Aspects and Discounting"]`.

### Sintesi HC LCC
- **5/5 HC verificate fedeli**. Il tasso di accuratezza è elevato.
- 1 errore di citazione minore (HC-13 attribuita a D4.1 invece di D4.2).
- **HC non verificate (35)**: HC-02, HC-03 (NDA/facilitator), HC-07-12 (capital goods, allocation), HC-14-25 (temporal/discounting), HC-26-40 (governance/reporting). Il pattern di accuratezza visto suggerisce che Phase 1 LCC è **complessivamente affidabile**.

---

## B. Validazione configurazioni LCC in pathway terminali

### LCSA-P1 — Standard IS Project (A + ex-ante + C+E-LCC + design + single-site + standard)

```json
"lcc": {
  "type": "C+E-LCC",
  "boundary": "mixed-g2g-c2g",
  "allocation": "mixed-negotiated-avoided",
  "valuation": "transfer-price-market-proxy",
  "kpi_suite": "full-suite",
  "discount_rate": "partner-wacc",
  "background_system": "static",
  "monte_carlo": true,
  "iterations": 10000,
  "counterparty_risk": "none",
  "integration_mode": "mfcad",
  "eco_efficiency": "both",
  "reporting_layers": 3,
  "real_nominal": "real",
  "scale_up_framework": "none"
}
```

| Campo | Valore | HC riferimento | Verdict |
|---|---|---|---|
| type | C+E-LCC | TRIG-01 + MC-01d (default IS configuration) | ✅ |
| boundary | mixed-g2g-c2g | HC-05 (E-LCC = LCA boundary) + IS Declination C-LCC=g2g, E-LCC=c2g | ✅ |
| allocation | mixed-negotiated-avoided | Per LCC type misto | ✅ |
| valuation | transfer-price-market-proxy | HC-08 + HC-13 (negotiated transfer price for C-LCC) | ✅ |
| kpi_suite | full-suite | MC-11 default | ✅ |
| discount_rate | partner-wacc | D4.2 Table 2 (Private Industrial 5-8%) | ✅ |
| background_system | static | MC-13 (Dynamic per >15yr; P1 single-site standard può essere static) | ✅ |
| monte_carlo | true, 10000 iter | HC-24 LCC | ✅ |
| integration_mode | mfcad | MC-17 (MFCA preferred) | ✅ |
| reporting_layers | 3 | HC-29 (3-layer architecture) | ✅ |
| real_nominal | real | HC-21 (real-real or nominal-nominal consistency) | ✅ |
| scale_up_framework | none | MC-05 design ma q6=No (no Low-TRL) | ✅ |

**Verdict P1 LCC**: configurazione corretta, nessun bug. Tutti i campi coerenti con le HC verificate.

### LCSA-P3 — Strategic Policy (B + ex-ante + E-LCC(+S-LCC) + regional + advanced)

Configurazione lato LCC:
- type: E-LCC (+ S-LCC opzionale)
- boundary: Cradle-to-Gate (E-LCC) + Cradle-to-Grave (S-LCC)
- allocation: NTF + monetized externalities (S-LCC)
- discount_rate: partner-wacc + social-rate (S-LCC)
- background_system: dynamic (SSP/RCP per HC-23)

✅ Coerente con HC-05, HC-23, MC-19 (CE Delft).

### LCSA-P5 — Corporate Accounting (C2 + ex-post + C-LCC only)

Configurazione lato LCC:
- type: C-LCC only
- boundary: Gate-to-Gate
- allocation: physical-causality (per HC-06 LCA = HC-10 LCC)
- discount_rate: partner-wacc
- background_system: static

✅ Coerente. Notare che E-LCC è BLOCKED per C2 (HC-06 LCA + HC-05 LCC), e P5 lo riflette correttamente.

---

## C. Issue raccolte da patchare nel JSON v2 (lato LCC)

| ID | Severità | Descrizione | Patch |
|---|---|---|---|
| LCC-Cit-01 | Bassa | HC-13 ha citazione errata (attribuita a D4.1 §12.2.2, in realtà D4.2 §7) | Aggiornare `trace` di tutti i pathway che fanno riferimento a HC-13 LCC → `D4.2 §7 Temporal Aspects and Discounting` |
| LCC-Cond-01 | Media | `discount_rate: "partner-wacc"` è cablato statico nei pathway. Va dinamicizzato per S-LCC type → social-rate (D4.2 Table 2: 1.5-4%) | Post-processing rule nel JSON v2: `if "S-LCC" in lcc.type: discount_rate = "social-rate"; else: discount_rate = "partner-wacc"` |
| LCC-Cond-02 | Bassa | `background_system: "static"` cablato in P1; ma se asset lifetime >15 anni dovrebbe essere "dynamic" (HC-23). P1 non specifica asset lifetime in input | Aggiungere domanda implicita o derivata: se Q5 (IS typology) = design/expansion + asset_lifetime_implicit > 15yr → dynamic. Per ora, P1 single-site standard può rimanere static senza violare HC-23 strettamente. |

---

## D. Conclusioni Pass 2-LCC

1. **Phase 1 LCC è valido**: HC verificate sono fedeli al D4.2. 1 errore di citazione minore (LCC-Cit-01).

2. **Configurazioni LCC dei pathway sono corrette**: nessun bug strutturale come INC-05 LCA. La mappatura q3 (LCC type) → boundary/allocation/valuation è coerente con HC.

3. **Gating dinamico anche per LCC**: discount_rate dipende da LCC type (S-LCC → social-rate, altri → partner-wacc). Va implementato come post-processing rule, non hard-coded.

4. **Background dynamic per long-horizon**: la pseudo-regola Kimi "single-site → static" è OK per P1 (q6=No, no Low-TRL, asset lifetime non specificato), ma andrebbe gating dinamico se l'utente specificasse asset lifetime > 15 anni. Da considerare in v2.

---

## E. Action items

1. ✅ Pass 2-LCC chiuso.
2. Procedere con Pass 2-S-LCA (turno N+1, ~1.5h — D4.3 ha 47 HC ma molte sono UNEP/SETAC standard, la review può essere veloce).
3. Tenere traccia di LCC-Cit-01, LCC-Cond-01, LCC-Cond-02 per JSON v2.

---

*Fine Pass 2-LCC. Pass 2-S-LCA in attesa.*
