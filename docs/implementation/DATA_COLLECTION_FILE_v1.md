# DATA_COLLECTION_FILE — Methodological spec v1 (DRAFT)

> **Status:** DRAFT — in attesa di review metodologica di Mirko.
> **Data:** 2026-05-22.
> **Dipendenze documentali:** `PHASE1_NODE_MAPPING_v2.md`, `SYMBA_T46_Validation_WorkingDoc_v1.md`, 5 JSON schemas in `backend/app/schemas/`.
> **Non-doc autoritativo finché non approvato da Mirko.**

---

## 1. Scopo

Il **Data Collection File (DCF)** è un artefatto generato dal tool **dopo** che la pipeline ha derivato il pathway metodologico (IS-01..IS-05) e l'ILCD Situation. Il suo scopo è **guidare l'analista LCSA nella raccolta dati a valle** del questionario Q1-Q7, fornendo un foglio strutturato di campi pronti — con header, validazioni e celle vuote — calibrati sul tipo di studio dichiarato.

Il DCF non è un input del questionario: il questionario resta breve (Q1-Q7 + flows di base). Il DCF nasce a valle, riflette le scelte fatte, e accompagna l'analista nella fase di inventory.

### 1.1 Cosa NON è il DCF (non-goals v1)

- Non è un meccanismo di calcolo LCSA (rimane out-of-scope MVP per il numerical replication).
- Non è un input re-importabile: l'analista può scaricarlo (export-ready) ma il tool **non** legge indietro Excel modificati esternamente.
- Non è un editor della rete: il diagramma è view-only in v1.

---

## 2. Workflow utente

```
   ┌─────────────────────┐
   │  Q1-Q7 + base flows │   (input minimo, come oggi)
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐
   │  pipeline.run()     │   L0 → L1 → pathway → activate → L2 → L3
   └──────────┬──────────┘
              │  pathway_id, ilcd_situation, lcc_type, slca_state,
              │  activated_nodes, blocked_by, cdp_flags
              ▼
   ┌─────────────────────┐
   │  dcf_compose()      │   nuovo: applica activation predicates
   └──────────┬──────────┘
              │
      ┌───────┼────────────────────┐
      ▼       ▼                    ▼
   Excel    .docx          UI interactive page
   (.xlsx)  (narrative)    (NetworkDiagram + section checklist)
      │       │                    │
      └───────┴────────────────────┘
              │
              ▼
   Analista raccoglie i dati offline (Excel)
   o in dialogo coi partner del network.
   Il DCF "scaricato" è la dispensa di campo.
```

---

## 3. Principi di design

| # | Principio | Conseguenza |
|---|---|---|
| P1 | **Predicate-driven composition** | Ogni campo dichiara un `activation_predicate` (stringa booleana). Il DCF finale è il subset dei campi `True` per il Case corrente. Coerente con il pattern di `phase1_nodes.json`. |
| P2 | **Variabilità multi-asse** | Predicate possono referenziare: `q1`, `q2`, `q3.{env,eco,soc}`, `q4`, `q5` (per flow), `q6a`, `q6b`, `q7`, `pathway_id`, `ilcd_situation`, `lcc_type`, `slca_activation_state`, `is_01_extended`. |
| P3 | **Export-ready** | Excel e .docx sono read-only export. Niente re-import in v1. |
| P4 | **Diagramma view-only in v1** | Editing-as-input è candidato per v2 (modifica grafica del network ↔ aggiorna Flow Matrix). |
| P5 | **Coerenza naming** | Dotted-path tail per ogni field, come nei phase1_nodes (`dcf.actor.role`, `dcf.flow.quantity_measured`, ...). |
| P6 | **Schema engineering first** | Lo schema DCF è il nuovo JSON autoritativo. Codice e UI lo leggono, non lo definiscono. |
| P7 | **Sector overlay opt-in per sezione** | I 14 settori (Q6a) possono attivare campi addizionali specifici, non rimuovere quelli base. |

---

## 4. Assi di variabilità — riassunto operativo

Dal mapping in `PHASE1_NODE_MAPPING_v2.md` + `WorkingDoc §3.1-3.3`:

| Asse | Driver | Implicazione raccolta dati |
|---|---|---|
| **Modeling framework** | `q1` | A/B/D/E → attributional (avg mix). C → consequential (marginal mix, policy BAU). |
| **Temporal frame** | `q2` | A → ex-post (measured). B/C → ex-ante (assumptions, CAPEX, SSP/RCP). D → both (baseline measured + alternative projected). |
| **Dimensions** | `q3` | env/eco/soc accendono pillar diversi → campi diversi (LCC chiede CAPEX/OPEX, S-LCA chiede stakeholder mapping). |
| **Sector overlay** | `q6a` | Aggiunge campi sector-specific (es. waste_valorization → contamination, energy_utilities → capacity factor, multi_tenant → tenant matrix). |
| **Geographic scope** | `q7` | A → no transport. B/C/D → distance_km, transport_mode obbligatori. |

ILCD Situation (A / A_multi / B / C1 / C2) è una **label riassuntiva** dei tre assi sopra, non un asse indipendente. Pathway IS-01..05 idem.

---

## 5. Sezioni del DCF

Sei sezioni canoniche. Ogni sezione ha un `id`, un titolo localizzabile, un elenco di campi con activation predicate.

### 5.1 § Actors

Tabella attori partecipanti. Non esisteva nel modello dati: è una promozione del concetto a first-class.

| field | type | activation_predicate | note |
|---|---|---|---|
| `actor.id` | string | always | stable id |
| `actor.name` | string | always | |
| `actor.role` | enum {producer, consumer, facilitator, regulator, intermediary} | always | |
| `actor.sector` | enum Q6a | always | sector dell'attore (può differire dal Q6a del Case se multi-sector) |
| `actor.site_id` | FK → Site | `q7 in ["B","C","D"]` | |
| `actor.country_iso2` | string | `q7 in ["B","C","D"]` | |
| `actor.size_class` | enum {micro, SME, mid, large} | `q3.soc or pathway_id == "IS-02"` | S-LCA & policy contexts |
| `actor.public_private` | enum {public, private, mixed} | `pathway_id in ["IS-02","IS-05"]` | policy/monitoring contexts |
| `actor.contact_role` | string | always (optional) | per workflow di raccolta |

### 5.2 § Flow Matrix

Una riga per scambio attore→attore. Estende il `Flow` model esistente.

| field | type | activation_predicate | note |
|---|---|---|---|
| `flow.id` | string | always | |
| `flow.origin_actor_id` | FK | always | |
| `flow.dest_actor_id` | FK | always | |
| `flow.name` | string | always | |
| `flow.type` | enum {material, energy, water, waste, by_product, utility, service, info} | always | |
| `flow.q5_class` | enum a..e | always | mantiene compat con q5 esistente |
| `flow.unit` | string | always | |
| `flow.regime` | enum {continuous, batch, intermittent} | always | |
| `flow.quantity_measured` | float | `q2 == "A" or (q2 == "D" and scenario.is_baseline)` | ex-post / baseline |
| `flow.quantity_projected` | float (per scenario) | `q2 in ["C"] or (q2 == "D" and not scenario.is_baseline)` | ex-ante / alternative |
| `flow.quality.purity_pct` | float 0-100 | `q6a in ["chemicals_fertilizers","plastics_packaging","biobased_polymers"]` | sector overlay |
| `flow.quality.contamination_level` | enum {low, med, high, unknown} | `q6a in ["waste_valorization","wastewater_sludge_biofactories","agriculture_agrifood_biorefineries"]` | sector overlay |
| `flow.quality.reliability_of_supply` | enum {low, med, high} | `pathway_id in ["IS-01"]` | per gli scambi operativi |
| `flow.uncertainty.type` | enum {point, range, distribution, qualitative} | always | |
| `flow.uncertainty.value` | dipende da type | always | |
| `flow.marginal_market_ref` | string (doc ref) | `q1 == "C"` | consequential |
| `flow.scenario_assumptions` | text | `q2 in ["C","D"]` | ex-ante |
| `flow.lci_dataset_ref` | string | `q3.env` | LCI background |

### 5.3 § Logistics

Una riga per **rotta** (= per flow se Q7≠A). Auto-derivata dalla Flow Matrix.

| field | type | activation_predicate | note |
|---|---|---|---|
| `route.flow_id` | FK | `q7 in ["B","C","D"]` | tutta la sezione gated da Q7 |
| `route.distance_km` | float | `q7 in ["B","C","D"]` | |
| `route.transport_mode` | enum {truck, rail, ship, pipeline, cable, conveyor, onsite_none} | `q7 in ["B","C","D"]` | |
| `route.frequency` | enum {continuous, daily, weekly, monthly, ad_hoc} | `q7 in ["B","C","D"]` | |
| `route.measured_volume_year` | float | `q7 in ["B","C","D"] and (q2 == "A" or scenario.is_baseline)` | |
| `route.projected_volume_year` | float (per scenario) | `q7 in ["B","C","D"] and q2 in ["C","D"] and not scenario.is_baseline` | |
| `route.backhaul_strategy` | enum {none, partial, full} | `q7 in ["B","C","D"] and q6a in ["waste_valorization","energy_utilities","pulp_paper","cement_construction"]` | sector overlay |
| `route.transport_lci_dataset` | string | `q7 in ["B","C","D"] and q3.env` | |
| `route.transport_cost_per_unit` | float | `q7 in ["B","C","D"] and q3.eco` | |

### 5.4 § Infrastructure

Strutture coinvolte. Una riga per asset.

| field | type | activation_predicate | note |
|---|---|---|---|
| `infra.id` | string | always | |
| `infra.linked_actor_id` | FK | always | |
| `infra.purpose` | enum {production, treatment, transport, storage, conversion, supporting} | always | |
| `infra.status` | enum {existing, new, replaced, upgraded, decommissioned} | always | |
| `infra.capacity_value` | float | always | |
| `infra.capacity_unit` | string | always | |
| `infra.year_built` | int | `infra.status in ["existing","replaced","upgraded"]` | |
| `infra.expected_lifetime_remaining_y` | int | `infra.status in ["existing","replaced","upgraded"]` | |
| `infra.capex_amount` | float | `infra.status == "new" or q2 in ["C","D"]` | CAPEX raccolto se nuova o se ex-ante |
| `infra.capex_currency_year` | string | `infra.status == "new" or q2 in ["C","D"]` | |
| `infra.amortization_period_y` | int | `infra.status == "new" or q2 in ["C","D"]` | default 20 da `lcc_hc_07` |
| `infra.discount_rate_pct` | float | `infra.status == "new" and q3.eco` | LCC-side |
| `infra.salvage_value` | float | `infra.status == "replaced" and q3.eco` | |
| `infra.avoided_lifetime_y` | int | `infra.status == "replaced"` | per substitution accounting |
| `infra.decommissioning_cost` | float | `q1 == "C" or infra.status == "decommissioned"` | policy lifecycle completo |
| `infra.ssp_rcp_scenario` | enum SSP1-26..SSP5-85 | `q2 in ["C","D"]` | dynamic background, da `lcc_mc_13` |
| `infra.ownership` | enum {single_actor, joint_venture, third_party, public} | `pathway_id in ["IS-01","IS-02"]` | governance |

### 5.5 § Methodological Choices to Document

**Auto-popolato** dai `procedural_mandate` nodes attivati per il Case. Per ogni nodo attivato:

- `mandate.node_id` (es. `slca_mc_11`)
- `mandate.statement` (testo dal phase1_nodes)
- `mandate.deliverable` (dove va documentato: report section, allegato, ecc.)
- `mandate.category` — gruppo derivato: `data_sources`, `allocation`, `reference_scenario`, `stakeholder_mapping`, `uncertainty`, `sector_addenda`
- `mandate.assignee` (free text, optional)
- `mandate.status` (checklist: pending/done)

**Decisione aperta D2**: tutti i procedural_mandate attivati appaiono qui, o solo un subset curato per categoria. Vedi §11.

### 5.6 § Network Diagram (derivato)

**Non un input.** Auto-renderizzato da Actors + Flow Matrix. Spec rendering:

- **Nodes**: uno per Actor. Colore = palette per Q6a `actor.sector`. Forma = role (cerchio producer, quadrato consumer, esagono facilitator).
- **Edges**: uno per Flow Matrix entry. Spessore ∝ quantity normalizzata. Colore = `flow.type`. Direzione = origin→dest.
- **Annotations**: badge `pathway_id`, badge `ilcd_situation`, icone Q3 dim attive.
- **Layout**: force-directed default, toggle gerarchico.
- **Export**: SVG inline nell'UI + PNG embeddato in .docx.

Candidata libreria: **React Flow** (drag&drop nativo, edge typing, attivo nel 2026, license MIT). Vedi §10 dipendenze.

---

## 6. Algoritmo di composizione

```python
def compose_dcf(case: Case, schemas: LoadedSchemas, dcf_schema: dict) -> DcfPayload:
    eval_ctx = build_eval_context(case)  # q1, q2, q3.env, ..., pathway_id, ...

    sections = []
    for sec in dcf_schema["sections"]:
        active_fields = [
            f for f in sec["fields"]
            if predicate_eval(f["activation_predicate"], eval_ctx)
        ]
        if not active_fields:
            continue  # sezione interamente disattivata (es. Logistics quando q7=A)
        sections.append({"id": sec["id"], "title": sec["title"], "fields": active_fields})

    # § 5.5 — auto-pull procedural_mandate
    sections.append(compose_mandate_section(case.activated_nodes, schemas))

    # § 5.6 — derive network diagram payload
    sections.append(derive_network(case.flows, eval_ctx))

    return DcfPayload(case_id=case.id, pathway=case.pathway_id, sections=sections)
```

Il `predicate_eval` è un sub-DSL ristretto — decisione aperta D1 (§11).

---

## 7. Esempio applicato — Wiktor 2018

Fixture: `q1=B, q2=D, q3=ENV+ECO, q4={E}, q6a=wastewater_sludge_biofactories, q6b=TRL7-8, q7=B`.
Derivato: `pathway_id=IS-01, is_01_extended=True, ilcd_situation=SITUATION_A_MULTI, lcc_type=C_LCC_PLUS_E_LCC`.

**Sezioni risultanti** (campi attivi, estratto):

- **Actors**: id, name, role, sector, **site_id**, **country_iso2** (q7=B), `size_class=False` (q3.soc=false), `public_private=False` (pathway IS-01).
- **Flow Matrix**: id, origin, dest, name, type, q5, unit, regime, **measured (baseline)** + **projected (12 alternative scenari)** (q2=D), **contamination_level** (wastewater overlay), `purity_pct=False`, reliability_of_supply (IS-01), uncertainty, lci_dataset_ref (q3.env). `marginal_market_ref=False` (q1≠C).
- **Logistics**: TUTTA attiva (q7=B). distance, mode, frequency, measured baseline + projected alternative, **backhaul_strategy** (wastewater overlay), transport_lci_dataset, transport_cost_per_unit (q3.eco).
- **Infrastructure**: id, linked_actor, purpose, status, capacity. Per status=new (alternative scenari): **capex_amount, amortization_period, discount_rate** (q3.eco), **ssp_rcp_scenario** (q2=D). decommissioning_cost=False (q1=B).
- **Methodological choices**: ~30-40 procedural_mandate nodes (stima da contare nei test esistenti; sezione popolata automaticamente).
- **Network diagram**: nodi colorati per sector (paper mill, WWTP, mono-incin boiler, district heating, ash recipient), edges typed per material/water/energy.

---

## 8. Output formats

### 8.1 Excel (.xlsx)

- Multi-tab: una tab per sezione attiva + tab "Cover" (case metadata, pathway, ILCD) + tab "Mandates checklist".
- Header pre-popolato con field labels (i18n: en/it minimo, altre lingue se time-allows).
- Celle pre-create per attori/flussi già dichiarati nel questionario.
- Data validation: dropdown per enum, type-check per numerici, conditional formatting per richiesta CAPEX.
- No macro, no VBA. Compatibile Excel/LibreOffice/Google Sheets.
- Libreria backend: **openpyxl** (Python, MIT, mainstream — nessuna ragione per inventare altro).

### 8.2 .docx (narrative)

Estensione di `services/reports.py`. Aggiunge dopo le 8 sezioni esistenti:

- Sez. 9 — DCF Cover (pathway, ILCD, scope)
- Sez. 10 — Methodological Checklist (sez. 5.5 in forma narrativa)
- Sez. 11 — Network Diagram (PNG embed)
- Sez. 12 — Riferimento allegato Excel + istruzioni d'uso

### 8.3 UI interactive (in-app)

Nuova pagina post-`/result`: `/data-collection`.

- Header: pathway/ILCD/scope summary.
- Sidebar: lista sezioni con counter di campi attivi ("Actors: 0/8 fields filled", letto in v1 come "0/8 fields TO fill" perché export-only).
- Main: NetworkDiagram component (React Flow) interattivo (zoom/pan, hover info, click su nodo/edge).
- Footer: pulsanti `Download xlsx` / `Download docx`.

---

## 9. Architettura tecnica

### 9.1 Nuovi artefatti

**Backend:**
- `backend/app/schemas/dcf_schema.json` — schema autoritativo del DCF (sezioni + fields + activation_predicates). 6° JSON dopo i 5 esistenti.
- `backend/app/engine/dcf_compose.py` — pure function `compose_dcf(case, schemas, dcf_schema) → DcfPayload`.
- `backend/app/engine/predicate.py` — DSL eval ristretto (decisione D1).
- `backend/app/services/dcf_excel.py` — DcfPayload → openpyxl workbook → bytes.
- `backend/app/services/dcf_docx.py` (o estensione di `reports.py`) — DcfPayload → docx bytes.
- `backend/app/api/dcf.py` — endpoint `/api/dcf/preview` (JSON), `/api/dcf/export/xlsx`, `/api/dcf/export/docx`.

**Frontend:**
- `frontend/src/pages/DataCollection.tsx` — nuova pagina.
- `frontend/src/components/NetworkDiagram.tsx` — wrapper React Flow.
- `frontend/src/components/DcfSection.tsx` — generic section renderer (read-only in v1).
- `frontend/src/types/dcf.ts` — TS mirror del DcfPayload.

### 9.2 File modificati

- `backend/app/api/__init__.py` — registra il nuovo router.
- `frontend/src/App.tsx` — route `/data-collection`.
- `frontend/src/pages/Result.tsx` — bottone "Generate Data Collection File" → naviga a `/data-collection`.

### 9.3 Nuove dipendenze (richiedono approvazione esplicita — vedi CLAUDE.md)

- **openpyxl** (Python): generazione xlsx. Mainstream, MIT.
- **reactflow** (frontend): network diagram. MIT, attivo, già usato in molti progetti enterprise.

Entrambe minori. Da confermare con Mirko prima dell'installazione.

### 9.4 Test strategy

- Per ogni fixture dei 13 papers: snapshot test del `DcfPayload` (sezioni e campi attivi atteso).
- Unit test del predicate evaluator (DSL coverage).
- Round-trip test export: xlsx e docx generati devono essere parseable e contenere i nomi dei campi attesi.
- No test sul valore raccolto (è user-side, fuori scope).

---

## 10. Compatibilità con engine esistente

- **Non tocca** la pipeline `engine/pipeline.py`. Il DCF è un *consumer* del Case finale, non un *contributor*.
- **Non aggiunge field_paths** ai 5 JSON esistenti. `dcf_schema.json` è separato, vive nel proprio namespace (`dcf.*`).
- **Riusa** `Case.activated_nodes` per popolare la sezione 5.5.
- **Riusa** `Case.flows` e `Case.sites` come dati base; aggiunge Actors come *nuovo* concetto via DCF (non retrofit nel `Case`).
- **Nessuna migrazione DB**: il DCF è generato on-demand, non persistito (in v1).

---

## 11. Decisioni aperte (richiedono input Mirko)

| ID | Decisione | Opzioni | Mia raccomandazione |
|---|---|---|---|
| **D1** | Predicate language | (a) Python `eval` con namespace ristretto. (b) Mini-DSL custom (parser ad hoc). (c) JSONLogic. | (b) mini-DSL coerente con cross_method_rules.json — Kimi naming. Eval esterno è troppo aperto, JSONLogic introduce dipendenza. |
| **D2** | Granularità sezione 5.5 | (a) Tutti i procedural_mandate attivati. (b) Subset curato per categoria. (c) Tutti, ma raggruppati. | (c) — niente perdita info, leggibilità OK. |
| **D3** | Granularità Network Diagram | (a) Un edge per flow. (b) Aggregazione multi-flow tra stessa coppia attori. | (a) — fedele al dato, UI può collassare se serve. |
| **D4** | Validation rules in Excel | (a) Solo dropdown + type-check. (b) Cross-field (es. status=new → capex obbligatorio). | (b) limitato — solo le 5-10 relazioni più ovvie. |
| **D5** | Linguaggio output Excel/docx | (a) Solo EN. (b) Multi-lingua come UI (en/it/fr/de/es). | (a) per v1. Multi-lingua può venire dopo. |
| **D6** | Persistenza DcfPayload | (a) Non persistito, ri-generato on-demand. (b) Salvato in `cases` accanto a result. | (a) per v1. Il Case ha già tutto per ri-generarlo. |

---

## 12. Roadmap implementativa (high-level — no commitment)

| Fase | Lavoro | Stima |
|---|---|---|
| **Phase 1 — Schema engineering** | Scrivere `dcf_schema.json` completo, validare contro 13 fixtures, censimento `procedural_mandate` per categoria 5.5 | 1-2 settimane |
| **Phase 2 — Backend** | predicate DSL, dcf_compose, excel writer, docx writer, API | 1-2 settimane |
| **Phase 3 — Frontend** | DataCollection page, NetworkDiagram, section renderer, download UI | 1-2 settimane |
| **Phase 4 — Integration & polish** | i18n minima, validation cross-field, snapshot tests sui 13 papers | 1 settimana |

Totale stimato: **4-7 settimane** di lavoro effettivo, dipendente dal time-to-decision sulle 6 decisioni aperte (§11) e dalla validazione metodologica continua di Mirko.

---

## 13. Review checklist (per Mirko)

- [ ] §3 P1-P7 — i principi di design sono accettabili?
- [ ] §4 — la tabella assi di variabilità è completa o manca qualcosa?
- [ ] §5.1-§5.4 — le tabelle di campi sono il superset corretto? Manca qualche campo? Predicate scritti correttamente?
- [ ] §5.5 — la categorizzazione `data_sources / allocation / reference_scenario / stakeholder_mapping / uncertainty / sector_addenda` è la giusta granularità?
- [ ] §5.6 — diagramma view-only va bene per v1, o editing è blocking?
- [ ] §7 — l'esempio Wiktor riflette quello che ti aspetti?
- [ ] §11 D1-D6 — decisioni aperte: quale opzione per ciascuna?

---

*Fine draft v1.*
