# Review Sprint 0 — Kimi Logic Table Critical Review

**Reviewer**: Architect chat (Claude Opus 4.7)
**Data**: 2026-05-07
**Oggetto**: Validazione critica del decision engine prodotto da Kimi
**Files in review**:
- `IS_Decision_Engine_UNIFIED.md` (documento finale Kimi)
- `phase1_lca_atomic_nodes.md`, `phase1_lcc_atomic_nodes.md`, `phase1_slca_atomic_nodes.md`
- `phase2_compatibility_matrix.md`
- `phase3_pathway_space.md`
- `phase4_logic_table.md`, `phase4_mermaid_tree.md`, `phase4_traceability.md`
- `phase5_clash_table.md`

---

## Verdict

**OK CON PATCH SIGNIFICATIVE** — il materiale Kimi NON è implementabile "as is". Contiene una **incoerenza strutturale bloccante** (due decision tree diversi con gli stessi nomi pathway) e altre 3 incoerenze minori. Serve consolidamento prima di qualsiasi codifica.

**Tuttavia**: il lavoro di base (Phase 1 deconstruction, Phase 2 compatibility matrix, Phase 5 clash analysis) è di buona qualità e riutilizzabile come knowledge base. Il problema è isolato alla **Phase 4 (decision tree + logic table)**, che esiste in due versioni divergenti.

**Strategia consigliata**: usare i file Phase 4 originali (`phase4_*`) come baseline, scartare la Section 4.2/4.3 di `IS_Decision_Engine_UNIFIED.md`, riscrivere il logic table v2 sotto la nostra responsabilità con validazione spot-check vs deliverable. Nessun copy-paste cieco da Kimi nel codice.

---

## Pass 1 — Coerenza interna fasi Kimi

### Risultati sintetici

| Check | Risultato |
|---|---|
| Phase 1 LCA: 22 HC + 36 MC dichiarati | OK (verificato in phase1_lca_atomic_nodes) |
| Phase 1 LCC: 40 HC + 20 MC dichiarati | OK (verificato in phase1_lcc_atomic_nodes) |
| Phase 1 S-LCA: 47 HC + 18 MC dichiarati | **INCOERENTE** (vedi INC-02) |
| Phase 3 totali nodi (109 HC + 74 MC = 183) | Dipende da S-LCA; aritmetica errata se S-LCA != 47/18 |
| Phase 4 logic table struttura 10 Q | Esiste in **due versioni divergenti** (vedi INC-01) |
| Phase 4 ↔ Phase 3 coerenza opzioni Q1 ILCD | **INCOERENTE** (vedi INC-03) |
| Phase 4 logic table ↔ Phase 4 mermaid coerenza pathway | OK (i file phase4_* sono coerenti tra loro) |
| Phase 4 file fase ↔ IS_Decision_Engine_UNIFIED Section 4 | **INCOERENTE** (vedi INC-01) |
| Phase 5: 39 conflitti dichiarati | Da verificare in Pass 2 (8+8+7+9+7 = 39 OK aritmeticamente) |

### INC-01 — BLOCKING — Due decision tree divergenti con stessi nomi pathway

**Severità**: CRITICA. Bloccante per implementazione.

**Descrizione**:

I file fase 4 (`phase4_mermaid_tree.md`, `phase4_logic_table.md`, `phase4_traceability.md`) e la Section 4.2/4.3 di `IS_Decision_Engine_UNIFIED.md` definiscono **alberi decisionali completamente diversi** ma usano **gli stessi identificatori LCSA-P1..P10**.

#### Tabella comparativa delle 10 domande

| # | phase4_*.md (file fase) | IS_Decision_Engine_UNIFIED Section 4 |
|---|---|---|
| Q1 | ILCD context (A/B/C1/C2) | ILCD context (A/B/C1/C2) ← stesso |
| Q2 | Temporal (ex-ante/ex-post) | LCC type (C-LCC / C+E-LCC / E-LCC / C+E+S-LCC) |
| Q3 | LCC type (5 opzioni) | Temporal (ex-ante/ex-post) |
| Q4 | FU orientation (function/flow) | Public assertion (yes/no) |
| Q5 | IS typology (Analysis/Improvement/Expansion/Design/Restructuring) | Transport modeling (explicit/generic) |
| Q6 | Low-TRL (yes/no) | Reference scenario (modern+sector / sector_only / counterfactual) |
| Q7 | Multifunctionality (system-expansion/allocation/PEF-CFF) | Uncertainty (oat+gsa / oat / gsa) |
| Q8 | Public assertion (yes/no) | LCA-LCC integration (MFCA/LCI/Parallel) |
| Q9 | Spatial scope (single/regional/national) | Stakeholder engagement (full_participatory / actor_consulted / analytical_only) |
| Q10 | Uncertainty (standard/advanced/basic) | Frontier categories (report/omit) |

**Solo Q1 coincide.** Le altre 9 domande sono completamente diverse.

#### Tabella comparativa dei 10 pathway terminali

| # | phase4_*.md (file fase) | IS_Decision_Engine_UNIFIED Section 4 |
|---|---|---|
| LCSA-P1 | Standard IS Project | Standard IS A+C+E |
| LCSA-P2 | Full LCSA Triple Assessment | Standard IS (truncated) |
| LCSA-P3 | Strategic Policy Assessment | Strategic B+E(+S) |
| LCSA-P4 | Monitoring with Interactions | Strategic B (truncated) |
| LCSA-P5 | Corporate Accounting | Monitoring C1+C+E |
| LCSA-P6 | Low-TRL Prospective | Monitoring C1 (truncated) |
| LCSA-P7 | Improvement Assessment | Corporate C2+C-LCC |
| LCSA-P8 | Network Expansion | Corporate C2 (truncated) |
| LCSA-P9 | EU-Policy Aligned | [WARN] C-LCC only — no network eco-efficiency |
| LCSA-P10 | S-LCA Default | [WARN] No avoided cost — lost market-consequence |

**Sostanzialmente disgiunti.** Solo P1, P3, P5 hanno semantica vagamente sovrapponibile; gli altri 7 sono pathway diversi con scopi diversi.

#### Quale dei due è "il vero"?

A mio giudizio, **i file fase 4 originali sono la baseline corretta** per queste ragioni:

1. **Maggiore aderenza ai nodi atomici di Phase 1**: il phase4 cattura IS typology (MC-05 LCA), Low-TRL (MC-20 LCA + HC-15/HC-39 LCC), multifunctionality (HC-07 LCA), che sono identificati come dependency-critical nei file Phase 1. La versione UNIFIED li ha eliminati e introdotto domande "secondarie" (transport, reference scenario, frontier categories) che sono in realtà parametri configurabili dentro lo scenario, non discriminanti tra scenari.

2. **Pathway terminali più rappresentativi della casistica IS**: i nomi P1..P10 del phase4 (Standard, Full LCSA, Strategic, Monitoring, Corporate, Low-TRL, Improvement, Network Expansion, EU-Policy, S-LCA Default) coprono i casi d'uso reali del progetto SYMBA. Quelli del UNIFIED sono in metà casi "truncated" version dello stesso scenario (P2, P4, P6, P8 sono semplicemente la versione "frontier omitted" di P1, P3, P5, P7) — è un'astrazione povera, perché Q10 frontier-categories non discrimina scenari, è una scelta indipendente.

3. **JSON logic table effettivamente utilizzabile**: il `phase4_logic_table.md` ha il mapping completo answer-fingerprint → configurazione (lca/lcc/slca config) per tutti e 10 i pathway. La Section 4.3 del UNIFIED è incompleta (P5-P10 hanno solo descrizione testuale, non JSON config completo).

**Quindi: scartare Section 4.2/4.3 del documento UNIFIED. Usare phase4_logic_table + phase4_mermaid_tree come baseline.**

### INC-02 — Conteggio nodi S-LCA contraddittorio (interno al file phase1)

**Severità**: media. Non bloccante ma sintomo di sloppy authoring.

In `phase1_slca_atomic_nodes.md`:
- **Header (linea 5)**: "45 atomic nodes extracted (27 Hard Constraints + 18 Methodological Choices)"
- **Summary Statistics (fondo file)**: "47 HC + 18 MC = 66 totali" (anche la somma è errata: 47+18=65, non 66)
- **Le HC effettive citate nel file arrivano fino a HC-47** → quindi il conteggio reale è 47 HC

`IS_Decision_Engine_UNIFIED.md` aggrega: 47 HC + 18 MC = 65 nodi → coerente con il body del phase1, ma incoerente con header e summary del phase1.

**Patch necessaria**: aggiornare header e summary di phase1_slca_atomic_nodes.md a "47 HC + 18 MC = 65 totali". Verificare che HC-23..HC-47 siano effettivamente tutti 25 nodi distinti e ben formati (non duplicati o vuoti).

### INC-03 — Opzioni Q1 ILCD: 3 vs 4

**Severità**: bassa. Risolvibile per disambiguazione.

- Phase 3 `MC-01 (ILCD Situation)`: dichiara 3 opzioni (A / B / C)
- Phase 4 file fase: Q1 con 4 opzioni (A / B / C1 / C2) dopo sub-question split
- IS_Decision_Engine_UNIFIED Q1: 4 opzioni (A / B / C1 / C2)

**Risoluzione corretta**: la ILCD Situation primaria è 3 (A/B/C), ma C ha sub-variants C1/C2 (vedi HC-05 e HC-06 di Phase 1 LCA). Quando si presenta all'utente, sono 4 opzioni effettive perché lo split C→C1/C2 è metodologicamente forzato. Phase 3 è formalmente corretto in fase combinatoria (la situation primaria è A/B/C, e poi C ha attributi sub-tipo). Phase 4 è pragmaticamente corretto in fase UI (l'utente sceglie tra 4).

**Patch necessaria**: documentare esplicitamente che Q1 nel UI ha 4 opzioni (A/B/C1/C2), e che phase 3 conta 3 opzioni primarie + 2 sub-variants di C come dimensione separata. Nessun cambio strutturale richiesto, solo annotazione.

### INC-04 — LCSA-P10 ha semantica completamente diversa nei due alberi

**Severità**: critica (subset di INC-01 ma vale la pena evidenziarla).

- phase4: LCSA-P10 = "S-LCA Default" — pathway per chi vuole solo S-LCA standalone (S-LCC only + basic uncertainty)
- UNIFIED: LCSA-P10 = "[WARN] No avoided cost" — warning per B + C-LCC only (scenario problematico)

Sono **scenari completamente diversi** con stesso ID. Implementare uno o l'altro produce app radicalmente diverse.

---

## Pass 2 — Spot check vs deliverable D4.1/D4.2/D4.3 (NON ESEGUITO)

**Motivazione**: il Pass 2 ha senso solo dopo aver deciso quale dei due alberi decisionali (file fase vs UNIFIED Section 4) è quello da validare. Validare entrambi raddoppia il lavoro.

**Quando eseguirlo**: dopo che Mirko sceglie strategia di consolidamento (vedi raccomandazione sotto). Stima ~2h Architect chat.

**Cosa fare quando si eseguirà**:
1. Aprire D4.1 (LCA Guidelines) e cercare i riferimenti diretti a Section 2.3.4 (ILCD), §5.3.1 (multifunctionality), §6.3.1 (zero-burden hierarchy), §10.3.1 (transport).
2. Verificare che i HC LCA in phase1_lca riportino testualmente le costrizioni di queste sezioni.
3. Stesso esercizio su D4.2 sezioni §2.3 (3-level structure), §4.3 (boundary), §5.1 (LCC type).
4. Stesso esercizio su D4.3 sezioni §2.1 (comparative logic), §5.1 (UNEP/SETAC), §13.1 (comparative framing).
5. Per IS-01 e IS-04 (i due scenari più rappresentativi): verificare che la configurazione metodologica proposta sia coerente con la lettera dei deliverable.
6. Per 3 conflitti dei 39 (uno logico, uno temporale, uno mathematical): verificare che la risoluzione proposta sia consistente coi deliverable e non introduca interpretazioni indebite.

---

## Pass 3 — Stress test logic table su caso fittizio (NON ESEGUITO)

**Motivazione**: stesso del Pass 2. Senza decision tree consolidato, il test non è eseguibile.

**Quando eseguirlo**: dopo Pass 2. Stima ~1h.

**Caso di test proposto** (da congelare ora):

> **Caso fittizio "Sunflower-Compost-Park"**: una raffineria di olio di girasole produce sansa esausta (panello). Un impianto di compostaggio adiacente (raggio 10 km) la riceve come input per produrre ammendante organico. Lo studio è ex-ante, condotto dal consorzio del distretto agroindustriale per supportare la decisione di firmare un contratto di scambio annuale tra le due aziende. Si vuole dimostrare il beneficio ambientale ed economico della sinergia. Pubblicazione del report sul sito del distretto. Anno base 2026, orizzonte 5 anni.

Risposte attese (sotto albero phase4):
- Q1=A (micro-level decision)
- Q2=ex-ante
- Q3=C+E-LCC (firm + network)
- Q4=function-oriented (servizio di gestione + co-produzione)
- Q5=design (nuova sinergia)
- Q6=No (TRL alto su entrambi i processi)
- Q7=system-expansion
- Q8=Yes (pubblicazione → public assertion)
- Q9=single-site (10 km è single park)
- Q10=standard

**Pathway atteso**: LCSA-P1 (Standard IS Project) o LCSA-P8 (Network Expansion) — verificare che la logic table risolva correttamente. Se ambiguo, è un bug.

---

## Raccomandazione strategica

### Opzione A — Riscrittura logic table v2 (consigliata)

**Cosa**: usare phase4_logic_table.md + phase4_mermaid_tree.md + phase4_traceability.md come **input di riferimento** ma **non come codice**. L'app implementa un proprio JSON logic table v2, scritto in `backend/app/data/lcsa_decision_engine.json`, sotto la nostra responsabilità, con i seguenti requisiti:

1. **Validazione esplicita** di ogni pathway terminale (LCSA-P1..P10) contro almeno una sezione di un deliverable per ogni metodologia (LCA, LCC, S-LCA).
2. **Traceability machine-readable**: ogni answer→config map ha un campo `trace` con array di riferimenti (es. `["D4.1 §2.3.4 HC-03", "D4.2 §5.1 MC-01b", "D4.3 §2.1 HC-01"]`).
3. **Validation gate** in Pass 2: per ogni pathway, l'Architect (io) o un esperto SYMBA verifica testualmente la trace prima del merge.
4. **Versioning**: il file ha campo `version`, e ogni patch è ADR documentato.

**Pro**: ownership completa del decision engine. Niente bug nascosti ereditati. Validabile in CI.
**Contro**: ~3-5h Architect chat aggiuntive (Pass 2 + Pass 3 + stesura JSON v2 + verifica spot).

### Opzione B — Tentativo di patch del materiale Kimi

**Cosa**: scegliere phase4_*.md come authority, riscrivere/scartare Section 4.2/4.3 del UNIFIED, completare i pathway P5-P10 nel JSON con le configurazioni mancanti, sistemare INC-02 (conteggi S-LCA) e INC-03 (opzioni Q1).

**Pro**: meno lavoro upfront.
**Contro**: si eredita il debito tecnico delle scelte Kimi. La validazione vs deliverable resta da fare comunque. Rischio che emergano altri bug in produzione.

### Opzione C — Buttare via Kimi e ricominciare l'analisi

**Cosa**: rifare la deconstruzione dei 3 deliverable da zero con un altro approccio (multi-agent, LLM diverso, manuale).

**Pro**: pulizia totale.
**Contro**: ~10-20h di lavoro. Reinvento la ruota — il materiale Phase 1, 2, 5 di Kimi è complessivamente valido.

---

## Mia raccomandazione

**Opzione A.** Phase 1, 2, 5 di Kimi sono buoni e si tengono come knowledge base. Phase 4 è sostanzialmente da riscrivere comunque per arrivare a un JSON validato e implementabile, quindi è conveniente farlo bene una sola volta sotto il nostro controllo, con validazione esplicita vs deliverable. Pass 2 + Pass 3 diventano parte del lavoro di stesura del JSON v2.

**Tempo stimato per chiusura Sprint 0 con Opzione A**: ~3.5-5h Architect chat (questo report = 1.5h già fatto + Pass 2 = 2h + Pass 3 = 1h + stesura JSON v2 = 1.5h). Distribuibile su 2-3 turni di chat.

---

## Action items per Mirko

1. **Decisione strategica**: Opzione A / B / C? Consiglio A.
2. **Se A**: parto con Pass 2 (spot check vs deliverable, leggo D4.1/D4.2/D4.3 a campione, scrivo report di verifica). Output: `coordination/reviews/kimi_phase2_validation.md`.
3. **In ogni caso**: la SPEC del Sprint 2 (Domain layer backend) NON deve hardcodare il JSON Kimi. Deve aspettare il JSON v2.
4. **Aggiornamento docs**: dopo decisione, aggiorno `coordination/master-plan/MASTER_PLAN.md` ADR-003 con la strategia scelta e `coordination/current-state/_CURRENT_STATE.md` con stato Sprint 0.

---

*Fine review report Sprint 0 (Pass 1 chiuso, Pass 2/3 in attesa di decisione Mirko).*
