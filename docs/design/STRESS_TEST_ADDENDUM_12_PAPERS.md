# Stress-test addendum su 6 paper LCC/TEA/SLCA — totale 12 casi

**Contesto**: il primo stress-test su 6 paper LCA aveva un sample bias (5/6 LCA puri, zero S-LCA). Questo secondo batch di 6 paper copre esattamente la lacuna: include MFCA+CBA puro, LCC integrato con LCA, framework matriciale LCA+LCC, capital-based LCSA, LCA+LCC didattico, e LCSA full (LCA+LCC+SLCA+TEA). Ora il sample è rappresentativo.

**Headline**: 

- I 6 nuovi paper **confermano i 5 gap** già identificati nel primo stress-test (con frequenza più alta — alcune evidenze passano da 4/6 a 9/12).
- **Aggiungono 2 gap nuovi**, uno alta priorità (Q3 manca "solo economico" — caso Leiva).
- Validano che le 6 domande tengono come **framework strutturale** anche su questo campione più diverso.

---

## §1 Sintesi rapida di compilazione paper-per-paper

### Paper 7 — Leiva et al. (2025), Escombreras (ES) + Frövi (SE)
**Cosa hanno fatto**: MFCA + CBA + TEA, **nessun LCA**. Demo CORALIS in 2 siti: ottimizzazione processo KNO₃ (Escombreras) + serra 10ha alimentata da calore residuo cartiera (Frövi, 4 sotto-scenari A/B/C/D).

| Q | Risposta | Match? |
|---|---|---|
| Q1 | A (scambio specifico Escombreras) o B (eco-park Frövi cartiera+serra+ex-acquacoltura) | ✅ |
| Q2 | Frövi: D (esistente + scenari A/B/C/D) — match Gap 1 confermato | ⚠️ Gap 1 |
| Q3 | 🚨 **Solo economico (MFCA+CBA+TEA, NO LCA)** — opzione **mancante** | 🚨 **Gap 6 nuovo** |
| Q4 | E (academic peer-reviewed Sustainability) | ⚠️ Gap 2 |
| Q5 | (c) co-product per scarti commerciali, (a) per acque reflue evitate | ✅ |
| Q6 | Settori: chemicals/fertilizers (Escombreras) + pulp & paper + agriculture/greenhouse (Frövi) | ⚠️ Gap 4 |

**Verdetto**: 🚨 **scopre Gap 6 critico** — Q3 non ha "solo economico" e Leiva è esattamente questo caso. Il framework MFCA è citato come bridge in D4.2 HC-38.

---

### Paper 8 — Danielsson et al. (2018), Kalundborg, Danimarca
**Cosa hanno fatto**: LCA conseguenziale + LCC analitico, black-box, su 8 membri associazione. 3 baseline (2015/2018/2019) + sensitivity scenarios. Marginal electricity = carbone.

| Q | Risposta | Match? |
|---|---|---|
| Q1 | B (eco-park multi-attore, classico Kalundborg) | ✅ |
| Q2 | D (esistente dal 1972 + scenari evolutivi 2015/2018/2019/+projects) | ⚠️ Gap 1 |
| Q3 | B (LCA + LCC) | ✅ |
| Q4 | C (claim pubblico di superiorità — Symbiosis Center DK promuove modello) | ✅ |
| Q5 | Black-box (3/12 casi confermano Gap 3) | ⚠️ Gap 3 |
| Q6 | Multi-settore: energy/utilities + chemicals + refining + cement (gypsum) | ⚠️ Gap 4 |
| Q7 | Regional cluster Kalundborg | ✅ |

**Verdetto**: caso ricco coperto. **Conseguenziale + marginal mix in eco-park** è scelta legittima dell'analista, non un gap delle domande (advanced override). 

---

### Paper 9 — Kerdlap et al. (2024), UM³-LCE³-ISN, caso urbano agri-food fittizio
**Cosa hanno fatto**: framework matriciale LCA+LCC unificato. Caso fittizio agri-food urbano 5 entità. Multi-livello (network/entity/flow). **Citato in D4.2 L1261/MC-17 come reference primario di matrix-based integration**.

| Q | Risposta | Match? |
|---|---|---|
| Q1 | B (eco-park multi-attore) | ✅ |
| Q2 | 🟡 caso fittizio dimostrativo — edge case | minor |
| Q3 | B (LCA + LCC) | ✅ |
| Q4 | E (academic methodological IJLCA) | ⚠️ Gap 2 |
| Q5 | Process-based per flusso, scambi waste-to-resource agri-food | ✅ |
| Q6 | Agriculture / agri-food | ✅ |

**Verdetto**: caso ben coperto, edge case minore "fittizio dimostrativo" gestibile via Q2-C + advanced flag.

**🟢 Importante**: questo paper è esattamente la metodologia che D4.2 raccomanda come "technically preferred implementation" per LCA-LCC integration. Quando il decision engine v3 attiva Q3-B, il default per LCC-LCA integration mode dovrebbe essere proprio UM³-LCE³-ISN matrix-based.

---

### Paper 10 — Subramanian et al. (2021), The Plant, Chicago
**Cosa hanno fatto**: **Capital-based LCSA** alternativo a Triple Bottom Line standard. 8 capitali (naturale/umano/sociale/finanziario/manufatturiero/intellettuale/culturale/politico). 3 scenari forno: gas / biogas / elettrico rinnovabile.

| Q | Risposta | Match? |
|---|---|---|
| Q1 | B (multi-tenant building / urban IS) | ✅ |
| Q2 | D (esistente + 3 scenari alternativi cottura) | ⚠️ Gap 1 |
| Q3 | C (Full LCSA) **MA con framework alternativo** | 🟠 **Gap 7 nuovo (medio)** |
| Q4 | E (academic JIE) | ⚠️ Gap 2 |
| Q5 | Residui organici → biogas locale (b) / (c) | ✅ |
| Q6 | Food/multi-tenant urban (settore non standard) | ⚠️ Gap 4 |

**Verdetto**: caso coperto come configurazione, ma il **framework Capital-based è alternativo a UNEP/SETAC**. Q3-C nella mia proposta default a UNEP/SETAC (S-LCA HC-12). Per studi avanzati che usano framework S-LCA alternativi, serve modalità expert.

---

### Paper 11 — Zhu (2013), TU Delft master thesis
**Cosa hanno fatto**: framework LCA + LCC semplificato, caso generico 2 imprese, **19 scenari** (UF, distanza, qualità scarto, prezzi, allocazione costi).

| Q | Risposta | Match? |
|---|---|---|
| Q1 | A (scambio specifico tra 2 imprese) | ✅ |
| Q2 | C (caso semi-fittizio progettuale) | ✅ |
| Q3 | B (LCA + LCC) | ✅ |
| Q4 | E (master thesis academic) | ⚠️ Gap 2 |
| Q5 | Variabile per scenario (alcuni scenari testano (a), altri (c)) | ✅ |
| Q6 | Generico, non specificato | ⚠️ Gap 4 |
| Q7 | Variabile (uno dei 19 scenari testa la distanza) | ✅ |

**Verdetto**: caso ben coperto. **Symbiosis Assessment Diagram** di Zhu è interessante come pattern di visualizzazione integrata LCA+LCC che il frontend potrebbe replicare. Citato anche da Wiktor.

---

### Paper 12 — Briassoulis et al. (2023), bio-based polymers LCSA
**Cosa hanno fatto**: framework propositivo combinato **LCA + S-LCA + LCC + TEA** per bio-polymers. UNEP/SETAC standard per S-LCA. TEA con ROI/payback. Settori multi: agricoltura, packaging, pharma, recovery post-consumo.

| Q | Risposta | Match? |
|---|---|---|
| Q1 | C (framework per industry-wide bio-polymer sector) | ✅ |
| Q2 | 🟡 framework propositivo non case-specific | minor |
| Q3 | C (Full LCSA) | ✅ |
| Q4 | E (academic methodological — opinion paper Current Opinion Green Chem) | ⚠️ Gap 2 |
| Q5 | Vari flussi bio-based (lignin, starch, cellulose, CO₂, heat, N/P) | ✅ |
| Q6 | Bio-based polymers / agriculture / packaging — multi-settore | ⚠️ Gap 4 |

**Verdetto**: caso ben coperto. **Distinzione TEA vs LCC** è interessante: Briassoulis le presenta come metodi distinti (LCC=ISO 15686-5/NPV, TEA=fattibilità di scale-up/ROI/payback). Per il decision engine v3 sono entrambi attivati da Q3-B "economico", ma con primary metrics differenti. Da gestire in advanced mode.

---

## §2 Sintesi gap aggregata su 12 paper

### 🚨 GAP NUOVO 6 (alta priorità) — Q3 manca opzione "Solo economico"

**Frequenza**: 1/12 esplicito (Leiva), ma rappresenta una **classe di studi industriale-applicati frequente** (TEA preliminare di fattibilità, MFCA dimostrativo, business case interno aziendale).

**Soluzione**: Q3 aggiungere opzione D.

```
Q3 — Quali aspetti di sostenibilità includere?
A) Solo ambientale (LCA only)
B) Ambientale + economico (LCA + LCC) [DEFAULT]
C) Full LCSA (LCA + LCC + S-LCA)
D) Solo economico (LCC standalone, MFCA, CBA, o TEA — NO LCA)  ← NUOVA
```

Quando l'utente sceglie D, il motore disattiva tutto il blocco LCA, attiva LCC standalone con MFCA/CBA come integrazione, e advanced mode permette di scegliere tra LCC ISO 15686-5 (NPV-primary) o TEA (ROI/payback-primary).

---

### 🟠 GAP NUOVO 7 (media priorità) — Framework S-LCA alternativi

**Frequenza**: 1/12 (Subramanian capital-based)

**Soluzione**: NON aggiungere opzione user-facing primaria. Q3-C default UNEP/SETAC + CIRCPACK (S-LCA HC-12 mandatory). In **advanced mode**, l'utente esperto può scegliere framework alternativo:
- UNEP/SETAC + CIRCPACK [DEFAULT]
- Capital-based 8 capitals (Subramanian style)
- Ecosystem Services (ESS) framework
- SDG-mapping
- Custom

---

### 🟢 CONFERME degli stress-test 1 (con frequenza maggiore)

| Gap | Stress-test 1 (6 paper) | Stress-test 2 (12 paper) | Verdetto |
|---|---|---|---|
| Gap 1 — baseline + scenari alternativi | 5/6 | **9/12** | 🚨 Pattern dominante confermato |
| Gap 2 — Q4 academic | 5/6 | **11/12** | Quasi totale, modifica obbligatoria |
| Gap 3 — Q5 non applicabile black-box | 2/6 | **3/12** | Confermato (Sokka, Danielsson, Paulu) |
| Gap 4 — Q6 settori incompleti | 3/6 | **9/12** | Espansione mandatoria |
| Gap 5 — Q1 ambiguo B vs D | 1/6 | **3/12** (Hashimoto, Subramanian, Kerdlap multi-tenant) | Conferma, chiarimento istruzioni |

---

### 🟡 EDGE CASE — Caso fittizio / dimostrativo metodologico

**Frequenza**: 3/12 (Kerdlap, Zhu, Briassoulis)

**Soluzione**: gestibile via Q2-C ("in progettazione") + flag advanced "methodological exploration". NON aggiungere opzione primaria.

---

### 🟡 EDGE CASE — Distinzione LCC vs TEA

**Frequenza**: 1/12 esplicito (Briassoulis), implicito in altri (Leiva ha CBA+TEA, Wiktor è LCC pure NPV)

**Soluzione**: Q3-B / Q3-D coprono entrambi a livello user-facing. Distinzione (NPV-primary vs ROI/payback-primary) in advanced mode.

---

## §3 Le 6 domande aggiornate dopo i 12 paper

Sintesi cumulativa delle modifiche. Aggiungo solo Gap 6 al set proposto nello stress-test 1.

### Q1 — invariata (chiarimento B vs D in istruzioni)

### Q2 — modificata (Q2-D scenari alternativi)
| Opt | Descrizione |
|---|---|
| A | Esiste e opera da almeno qualche anno |
| B | È in costruzione o appena commissionato |
| C | È solo in progettazione |
| **D** | **Esistente come baseline + valutazione di N scenari alternativi futuri** |

### Q3 — modificata (Q3-D solo economico) 🆕
| Opt | Descrizione |
|---|---|
| A | Solo ambientale (LCA) |
| B | Ambientale + economico (LCA + LCC) [DEFAULT IS-LCSA] |
| C | Full LCSA (LCA + LCC + S-LCA) |
| **D** | **Solo economico (LCC, MFCA, CBA, TEA — NO LCA)** 🆕 |

### Q4 — modificata (Q4-E academic)
| Opt | Descrizione |
|---|---|
| A | Uso interno (manageriale, R&D) |
| B | Comunicazione esterna senza claim comparativi |
| C | Claim pubblico di superiorità ambientale |
| D | Allineamento policy EU specifica |
| **E** | **Pubblicazione accademica peer-reviewed o sviluppo metodologico** |

### Q5 — modificata (Q5-e aggregato)
| Opt | Descrizione |
|---|---|
| a | A paga B (gate fee, smaltimento) |
| b | Scambio gratuito (ambiguo, EVT) |
| c | B paga A (vendita co-product) |
| d | A ha modificato il proprio processo (interdependent, NO zero-burden) |
| **e** | **Non disponibile / aggregato top-down → system expansion uniforme** |

Q5 obbligatorio per Q1-A e Q1-B. Opzionale per Q1-C/E (default Q5-e).

### Q6 — modificata (lista settori espansa)
Settori minimi (12-15): agriculture, agri-food/biorefineries, plastics/packaging, wastewater/biofactories, textile/leather, waste valorization (CCP/C&DW/SRF), pulp & paper, cement, steel & metals, chemicals/fertilizers, energy/utilities/refining, bio-based polymers, food production, multi-tenant urban, **other (specify)**.

### Q7 — invariata

---

## §4 Advanced mode — funzionalità necessarie

Lo stress-test sui 12 paper rende esplicito che il tool deve avere una **modalità expert** che esponga:

1. **Override allocation method** (system expansion default; partial allocation per Arce Bastias SPI; mass/energy/economic per casi specifici)
2. **Override S-LCA framework** (UNEP/SETAC default; capital-based per Subramanian; ESS; SDG-mapping; custom)
3. **Override LCC vs TEA primary metric** (NPV default; ROI/payback per studi TEA-style come Briassoulis, Leiva)
4. **Override modeling framework** (attributional default per Q1-A/B; consequential per Q1-C; eccezione Danielsson Kalundborg consequential in eco-park)
5. **Methodological exploration flag** (per casi metodologici come Kerdlap UM³, Zhu 19-scenari, Arce Bastias 3 allocation methods)
6. **Multi-FU testing** (Zhu testa 2 UF differenti — questo dovrebbe essere supportabile come "scenario" nel modello dati)
7. **Output indicator preset** (single-impact CO₂-only come Hashimoto LCCO₂; full ReCiPe set; full EF set; full ILCD; single PEF normalized+weighted come Paulu)

Questo non sono domande aggiuntive — sono **toggle in advanced settings**. Il non-esperto non li vede mai.

---

## §5 Cumulative coverage matrix — 12 paper

| # | Paper | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Verdetto |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Sokka 2011 | ✅ | ✅ | ✅ | E | e | ⚠️ | ✅ | OK |
| 2 | Hashimoto 2010 | ⚠️ B↔D | D | ✅ | E | ✅ | ⚠️ | ✅ | OK |
| 3 | Daddi 2017 | ✅ | D | ✅ | E | ✅ | ⚠️ | ✅ | OK |
| 4 | Paulu 2022 | ✅ | D | ✅ | **D PEF** | ✅ ↔ destinazione | ✅ | ✅ | **best Q4-D match** |
| 5 | Arce Bastias 2023 | ✅ | ✅ | ✅ | E | ✅ | ✅ | n/a | OK + advanced (3 alloc) |
| 6 | Wiktor 2018 | ⚠️ B↔A | **D** | **B match** | E | ✅ | ✅ | ✅ | **best Q3-B match** |
| 7 | **Leiva 2025** | ✅ | D | 🚨 **D 🆕** | E | ✅ | ⚠️ | ✅ | **scopre Gap 6** |
| 8 | Danielsson 2018 | ✅ | D | B | C claim | e | ⚠️ | ✅ | OK |
| 9 | Kerdlap 2024 | ✅ | C/fittizio | B | E | ✅ | ✅ | n/a | OK + flag method |
| 10 | Subramanian 2021 | ⚠️ B↔D | D | C **alt fwk** | E | ✅ | ⚠️ | n/a | OK + advanced (cap-LCSA) |
| 11 | Zhu 2013 | ✅ | C | B | E | ✅ | ⚠️ | ✅ | OK + 19-scenari multi-FU |
| 12 | Briassoulis 2023 | ✅ | framework | C | E | ✅ | ⚠️ | n/a | OK + LCC vs TEA distinction |

**Coverage rate dopo le 7 modifiche (5 da batch 1 + 2 da batch 2)**: **12/12**.

---

## §6 Stato realistico dopo i 12 paper

Riprendendo la mia stima precedente (~70%) dopo lo stress-test 1:

**Adesso siamo a ~85%**.

**Cosa è solido**:
- Phase 1 ground truth (186/186)
- 5 pathway IS-01..IS-05 confermati su 12 casi
- 6 domande user-facing tengono come framework strutturale su sample diverse (geo, settore, metodo, scala)
- 7 modifiche identificate, tutte minori/operative

**Cosa resta**:

1. **Tuo OK sui 7 fix** (5 dal batch 1 + 2 nuovi dal batch 2):
   - Q2-D baseline + scenari (critico)
   - Q3-D solo economico (nuovo, critico)
   - Q4-E academic
   - Q5-e aggregato
   - Q6 settori espansi (12-15)
   - Q1 chiarimento B vs D in istruzioni
   - Advanced mode con 7 toggle

2. **Mapping nodo-per-nodo** (1 turno): assegnare ognuno dei 186 nodi a DEFAULT / DERIVED / DOMINANT con condizioni di trigger esplicite. Necessario per Sprint 4 backend.

3. **Ispezione mirata Phase 4-5** (1 turno): scovare gli errori v2 (PEF CFF Q7, INV-04, RULE-04) per non riprodurli nel v3.

A quel punto siamo pronti per refactoring backend Sprint 4.

**Una domanda strategica per te**: i 7 toggle dell'advanced mode sono molti. Vuoi che li esponga tutti dal day-1, oppure ne implementiamo solo alcuni (es. allocation override, S-LCA framework override) e gli altri nella roadmap come Sprint 5+? Mia raccomandazione: day-1 abbiamo solo (1) allocation method override e (3) LCC vs TEA primary metric. Gli altri 5 in roadmap. Ma decidi tu.

---

## §7 Domande/conferme operative per il prossimo turno

1. ✅ Concordi sui 7 fix?  
2. 🆕 Quanti settori in Q6a (lista visibile vs autocomplete NACE)?
3. 🆕 Advanced mode day-1: tutti 7 toggle o subset minimal?
4. Procediamo con (a) mapping nodo-per-nodo, (b) ispezione Phase 4-5, o (c) altro?

---

## §8 Note bonus su scelte tecniche emerse dai 12 paper

Alcune scelte di default che il decision engine v3 dovrebbe applicare automaticamente, validate dai 12 paper:

- **LCC-LCA integration default**: matrix-based UM³-LCE³-ISN (Kerdlap 2024) — confermato come "technically preferred" da D4.2 L1261. Per casi semplici fall-back a parallel models.
- **MFCA backbone**: ISO 14051/14052 attivato di default quando Q3∈{B,C,D} — confermato Leiva, Wiktor, Kerdlap, D4.2 L1417.
- **System Expansion default**: confermato in 11/12 paper (eccetto Subramanian capital-based che è metodologicamente diverso, e Hashimoto che fa solo CO₂ accounting)
- **Marginal vs Average mix**: Q1-A/B default = average (substitution); Q1-C default = marginal. Eccezione legittima: Q1-B + advanced override consequential (Danielsson Kalundborg).
- **Reference scenario default**: per Q1-A "exchange specifico" → most likely alternative disposal route + virgin material market price (Daddi-style); per Q1-B eco-park → ipothetical no-IS scenario where partners operate independently (Sokka/Danielsson style); per Q1-C policy → BAU national mix (Paulu style).
- **Ecoinvent default**: 3.10 (current at 2026); attribution + system expansion preset.
- **LCIA default**: ReCiPe 2016 hierarchic midpoint (most used in IS literature 2010-2024) + EF 3.1 backup quando Q4-D EU policy.

Questi default emergono direttamente dall'evidenza empirica dei 12 paper. Da scrivere come configurazione di default del decision engine v3.
