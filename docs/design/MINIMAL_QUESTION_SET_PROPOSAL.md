# Set minimo di domande user-facing — proposta

**Obiettivo (per come l'ho capito)**: il tool deve poter essere usato da non-esperti (biomass producers, industrie, comunità locali, autorità) tanto quanto da assessor LCA/LCC/S-LCA. Le domande devono essere formulate in linguaggio del caso IS reale, mai in linguaggio metodologico. Il sistema deduce internamente le configurazioni LCA/LCC/S-LCA dalla risposta.

**Stato di partenza**:
- Phase 1 di Kimi validata 100% (186 nodi).
- Phase 3 di Kimi ha già fatto l'analisi strutturale: 30/74 MC nodes (40.5%) sono derivati deterministicamente da 5 dominant variables.
- **Ma** le 12 "key questions" di Phase 3 §2.2 sono ancora in linguaggio metodologico ("ILCD situation A/B/C1/C2?", "LCIA method family ReCiPe/EF/IMPACT?", "Uncertainty propagation OAT/GSA/both?"). È esattamente l'errore replicato dalla chat precedente.

**Quello che faccio in questo turno**: trasformare le dominant variables di Kimi in domande in linguaggio caso IS, classificare i 186 nodi in DEFAULT / DERIVED / DOMINANT, e mostrare il mapping interno domanda→nodi per il motore v3.

---

## §1 Inventario nodi: 3 categorie

Sui 186 nodi validati (LCA 59 + LCC 61 + S-LCA 66), la classificazione operativa è:

| Categoria | Cosa significa | # stimato | Esempi rappresentativi |
|---|---|---|---|
| **DEFAULT** | Default forte per IS bio-based: il sistema lo asserisce a priori, l'utente lo vede solo se vuole override | ~115 nodi | Function-oriented FU (LCA HC-22, MC-07), Hybrid LCA (LCA MC-02, MC-09), Capital goods amortized (LCA HC-18, LCC HC-07), MFA backbone (LCC L1255, LCA MC-19), Methodological Charter (LCA HC-20, LCC HC-31), NDAs + neutral facilitator (LCC HC-02, HC-03), Pedigree+Monte Carlo for LCA/LCC (LCA HC-14, LCC HC-24/HC-25), 3-level analysis (LCC HC-01, S-LCA HC-31), 5-level S-LCA scoring (S-LCA HC-26), UNEP/SETAC + CIRCPACK subcategories (S-LCA MC-07b), no single-metric aggregation (S-LCA HC-35, HC-42 — IR-04, IR-10) |
| **DERIVED** | Deterministicamente impostato dalla risposta a una dominant question; non chiesto separatamente | ~55 nodi | Modeling framework (LCA MC-02, MC-12) ← deriva da Q1; Boundary type (LCC MC-05) ← deriva da Q1+Q3; Scale-up techniques (LCA MC-20, LCC HC-15) ← derivano da Q5+Q6; Background futurisation (LCA MC-21, LCC MC-13) ← deriva da Q2; Reference scenario type (LCA MC-26 HNSRS/CNSRS) ← deriva da Q2; Critical review (LCA MC-36, S-LCA via IR-18) ← deriva da Q4; Allocation rule (LCC MC-07) ← deriva da Q1+Q3 |
| **DOMINANT** | Vera scelta utente; non derivabile, non default forte; va chiesta in linguaggio caso IS | ~16 nodi | I "trigger" e poche scelte ortogonali (vedi §3) |

Il rapporto è ~62% DEFAULT + ~30% DERIVED + ~8% DOMINANT. **Il tool deve esporre solo i ~8% all'utente in linguaggio IS-friendly.**

---

## §2 Mapping dominant Kimi → dominant utente

Phase 3 di Kimi identifica 5 dominant variables strutturali che riducono il decision space di ~10^12 e poi propone 12 domande in linguaggio metodologico. Il riframing in linguaggio caso IS è:

| Dominant Kimi (linguaggio metodologico) | Domanda utente in linguaggio caso IS | Note |
|---|---|---|
| 1. ILCD Situation A / B / C1 / C2 | **Q1: "Cosa stai analizzando?"** (4 opzioni con esempi concreti) | La cosa che chiarisce di più |
| 2. LCC Type C / E / S / C+E / C+E+S | **Q3: "Quali aspetti di sostenibilità servono al tuo studio?"** | Non si chiede "che tipo di LCC", si chiede a quale dimensione si è interessati |
| 3. Ex-ante vs Ex-post | **Q2: "In che fase è il sistema?"** (esiste / costruzione / progetto) | Naturalmente in linguaggio caso |
| 4. Function-oriented FU | (NON una domanda — è default mandatorio per IS) | Kimi stesso lo nota: option count = 1 |
| 5. Public Comparative Assertion (yes/no) | **Q4: "A cosa ti serve il report finale?"** (3 opzioni) | "Claim pubblico di superiorità" è una delle tre |

Le 12 questions Kimi includevano anche scelte come "LCIA method family", "uncertainty propagation method", "GSA tier", "reference scenario strategy" — **tutte da declassare a DEFAULT con override esperto**, non da chiedere al non-esperto. Il sistema applica defaults forti (ReCiPe 2016 + EF 3.1 backup; OAT + Morris-first GSA per modelli complessi; modern replacements counterfactual) e l'esperto può cliccare "advanced settings" per cambiarli. Il non-esperto non li vede.

**Rimangono però 2-3 dimensioni ortogonali che il sistema non può inferire da Q1-Q4** e che vanno chieste:
- **Q5: nature of the symbiotic flow** (per ogni flusso principale): waste / co-product / interdependent → discrimina §6.3 LCA hierarchy steps + LCC HC-12 avoidability
- **Q6: settore + maturità tecnologica** → attiva sector-specific guidance Part 2 + CIR-07 scale-up
- **Q7 (opzionale, derivabile): geographic spread** → ma probabilmente derivabile dai dati di localizzazione siti che l'utente carica come dato del caso, non come scelta di scoping

Quindi totale: **6 domande core + 1 condizionale**.

---

## §3 Le 6 domande proposte (con wording, opzioni, esempi, mapping interno)

Per ogni domanda: (a) wording user-facing in italiano (l'inglese è meccanico), (b) opzioni con esempi concreti, (c) cosa attiva nel motore (mapping nodi).

### Q1 — "Cosa stai analizzando?"

> *"Descrivi cosa il tuo studio deve coprire. Scegli l'opzione che corrisponde meglio al tuo caso. Se sei a metà tra due opzioni, ti chiediamo di sceglierne una principale."*

| Opzione utente (con esempi concreti) | Cosa attiva nel motore |
|---|---|
| **A. Uno scambio simbiotico specifico tra aziende esistenti** ("es. il cementificio della valle ABC userà fly ash dell'acciaieria XYZ"; "una bio-refinery che riceverà digestato da un impianto di trattamento acque locale") | LCA Situation A; default attributional + system expansion + average mix; LCC C-LCC at entity + E-LCC at network (default IS-LCSA combo); pathway IS-01 |
| **B. Un eco-industrial park o rete simbiotica multi-attore** ("es. il cluster bio-economico di X con 5 aziende in interazione"; "una zona industriale dove coordineremo flussi di vapore, acqua e residui organici") | LCA Situation A; LCC C-LCC + E-LCC; multi-level interpretation mandatory; pathway IS-01 con multi-actor focus |
| **C. Una policy, programma o decisione strategica a scala regionale/nazionale** ("es. valutare l'effetto di un programma di incentivazione delle simbiosi bio-based in Lombardia"; "un piano industriale nazionale per il riuso di residui agricoli") | LCA Situation B (consequential + long-term marginal); LCC E-LCC + S-LCC with NTF; SSP/RCP dynamic background; pathway IS-02 |
| **D. Il contributo simbiotico di una singola azienda al proprio bilancio sostenibilità** ("es. report ESG/CSRD di un'azienda partecipante a una IS"; "rendicontazione del contributo della nostra fabbrica al cluster") | LCA Situation C2 (allocation, no substitution credits); LCC C-LCC only with negotiated transfer prices; pathway IS-03 |
| **E. Monitoraggio nel tempo di una simbiosi già operativa** ("es. tracking annuale dei benefici di Kalundborg"; "report quinquennale del nostro eco-park") | LCA Situation C1 (substitution + average mix, monitoring frame); LCC C-LCC + E-LCC con dati storici da accounting; pathway IS-05 |

**Numero di nodi attivati/disattivati**: tra 25 e 40 a seconda della scelta. È la singola domanda con il più alto reduction factor (~10^4–10^5).

**Note di design**:
- Fornire un breve aiuto contestuale: "Se non sei sicuro tra A e B, scegli A (caso più comune). Se non sei sicuro tra D ed E, D è per report aziendali singoli, E per monitoraggio di rete."
- L'opzione "non lo so / non so quale scegliere" porta a un mini-wizard di 2-3 domande di chiarimento (es. "il sistema esiste o lo stai progettando?", "quanti soggetti partecipanti?").

---

### Q2 — "In che fase è il sistema simbiotico?"

> *"Stiamo definendo che tipo di dati il tuo studio richiederà e che tipo di scenario di riferimento andrà costruito."*

| Opzione utente | Cosa attiva nel motore |
|---|---|
| **A. Esiste e opera da almeno qualche anno** ("ho dati operativi reali, accounting reports, misure dirette") | Ex-post; HNSRS reference scenario; primary data dominant; static background OK (con override per asset >15y); pathway IS-01 o IS-05 (a seconda di Q1) |
| **B. È in costruzione o appena commissionato** ("opererà presto, ho dati di design + prime misure di pilota/early-stage operation") | Ex-post→Ex-ante transition; iterative update protocol (LCC HC-37) attivato; Pedigree Matrix scoring on data tier |
| **C. È solo in progettazione** ("nessun dato operativo, solo stime ingegneristiche da letteratura/ingegneria di processo") | Ex-ante; CNSRS with futurised background; engineering scale-up (Six-Tenths/Lang/CEPCI) attivato se TRL<7; pathway IS-04 |

**Numero di nodi attivati/disattivati**: ~15-20 (data strategy, reference scenario, scale-up frameworks).

---

### Q3 — "Quali aspetti di sostenibilità includere?"

> *"L'analisi può coprire fino a tre dimensioni. Scegli quale combinazione ti serve. Default: ambientale + economico (i due si rafforzano a vicenda)."*

| Opzione utente | Cosa attiva nel motore |
|---|---|
| **A. Solo ambientale** ("voglio capire i benefici ambientali della simbiosi, niente dimensione economica/sociale") | LCA solo; skip LCC + S-LCA blocks; ridotto significativamente il footprint del questionario successivo |
| **B. Ambientale + economico (default)** ("voglio sapere se la simbiosi conviene anche dal punto di vista finanziario, non solo ambientale") | LCA + LCC (C-LCC entity + E-LCC network if Q1 ∈ {A,B,E}); MFCA backbone activated; ECOF + IEE eco-efficiency indicators |
| **C. Ambientale + economico + sociale** ("voglio una valutazione completa LCSA che includa l'impatto su lavoratori, comunità locali, consumatori") | LCA + LCC + S-LCA; full LCSA charter; UNEP/SETAC stakeholder framework; comparative S-LCA scoring; parallel interpretation mandatory |

**Numero di nodi attivati/disattivati**: ~30-60 (intere "colonne" del modello).

---

### Q4 — "A cosa ti serve il report finale?"

> *"Diversi usi del report richiedono diversi livelli di rigore metodologico. Le opzioni di pubblicazione hanno costi crescenti."*

| Opzione utente | Cosa attiva nel motore |
|---|---|
| **A. Uso interno** ("decisioni manageriali, R&D, pianificazione strategica; il report non lascia l'azienda/il consorzio") | Layer 1 confidential report only; standard rigor; no panel review; weighting allowed se utile |
| **B. Comunicazione esterna senza claim comparativi** ("brochure, sito web, presentazioni a stakeholder esterni; comunichiamo i risultati ma non diciamo 'siamo migliori della via tradizionale'") | Layer 1 + Layer 3 (anonimized public summary); no panel review obbligatorio; weighting evitato per cautela |
| **C. Claim pubblico di superiorità ambientale** ("dichiariamo pubblicamente che la nostra simbiosi è più sostenibile dell'alternativa convenzionale; il report verrà revisionato esternamente") | **Trigger HC-08 / IR-18**: panel review 3+ esperti indipendenti mandatory; HC-09 weighting prohibited; IR-10 no single-score; full 3-layer reporting; ISO 14044 §6.2 critical review compliance |
| **D. Allineamento policy EU specifica** ("CSRD, ESPR, PEFCR esistente per il nostro settore, normativa italiana sulla bioeconomia") | C as a baseline + PEF CFF activation (LCA MC-14:PEFCFF) if PEFCR exists; CIR-05 NTF + monetized externality; potenzialmente trigger di S-LCC mandatory |

**Numero di nodi attivati/disattivati**: ~10-15 (review level, weighting, PEF, reporting layers).

**Note di design**: questa è la domanda più sottovalutata. "C" e "D" hanno conseguenze metodologiche e legali pesanti (panel review costoso, mandatory). Il tool deve avvisare esplicitamente: *"Scegliendo C, il tuo report richiederà revisione esterna da panel di 3+ esperti indipendenti come da ISO 14044. Stima di costo aggiuntivo: X. Procedi?"*

---

### Q5 — "Per ogni flusso simbiotico principale, com'è scambiato?"

> *"Per ciascun flusso simbiotico (es. fly ash → cementificio, vapore → serra, digestato → agricoltura), descrivi come avviene lo scambio economicamente. Questo determina come quantificare il beneficio. Puoi avere flussi diversi gestiti diversamente."*

| Opzione utente per flusso X (da A → B) | Cosa attiva nel motore |
|---|---|
| **a. A paga B per smaltirlo** ("noi paghiamo il ricevitore una gate fee per prendersi i nostri scarti, perché altrimenti dovremmo smaltirli") | EVT step 1: NEGATIVE → waste; LCA Step 4 zero-burden; LCC zero-cost assumption + sensitivity to market price proxy (HC-35); avoidability test Step 2 (HC-12) |
| **b. Lo scambio è gratuito** ("non ci sono pagamenti, è un accordo di mutua convenienza") | EVT step 1: ZERO → ambiguous edge case; trigger sensitivity analysis (HC-35 mandatory); MFCA-derived embedded cost recommended (HC-38); flag explicit assumption |
| **c. B paga A per acquistarlo** ("è un prodotto secondario con valore di mercato; il ricevitore lo compra a un prezzo concordato") | EVT step 1: POSITIVE → co-product; LCA Step 3 substitution + Q correction (Rigamonti 0.6-1.0); LCC C-LCC = negotiated transfer price (HC-13); LCC sensitivity to negotiation space (HC-34) |
| **d. A ha modificato il proprio processo apposta per produrre il flusso adatto a B** ("es. il cementificio richiede una specifica granulometria, e l'acciaieria ha cambiato il proprio raffreddamento del slag per soddisfarla") | **Interdependence test (Step 2 LCA, HC-17, LCC HC-36): YES** → forced co-product, NO zero-burden allowed; remodel as integrated multifunctional process; allocate upstream burdens between primary product and co-product; CIR sensitive |

**Numero di nodi attivati/disattivati**: dipende dal numero di flussi, ma per ogni flusso principale ~5-8 nodi.

**Note di design**:
- È l'unica domanda iterativa: si ripete per ogni flusso principale dichiarato dall'utente nei "dati del caso".
- Aiuto contestuale forte: "Non sicuro tra (a) e (b)? Cerca i contratti: c'è una clausola di pagamento? In che direzione va il pagamento?"
- L'opzione (d) è la più rara ma **la più pericolosa metodologicamente** (zero-burden inappropriato): il tool deve attivamente sollecitare un check ("Il generatore ha modificato il proprio processo per migliorare questo flusso? Esempi: cambio specifica di raffreddamento, granulometria, purezza, qualità").

---

### Q6 — "In che settore opera il sistema, e con che maturità tecnologica?"

> *"Selezioniamo la guida settoriale specifica e gli strumenti di scale-up appropriati."*

#### Q6a (Settore principale)

| Settore | Cosa attiva |
|---|---|
| Agri-food / biorefineries | Part 2 §X agri-food guidance (D4.1 Part 2 sector-specific); reference benchmarks da letteratura |
| Plastics / packaging | Part 2 §X; iLUC categoria mandatory (HC-19); microplastic frontier category active |
| Wastewater / biofactories | Part 2 §X; AWARE water stress mandatory (LCA MC-30); marine eutrophication blind-spot flag |
| Textile / technical textiles | Part 2 §X; PSS configuration check (LCC MC-03d); microplastic frontier category active |
| Waste valorization (urban mining, slags, SRF) | Part 2 §X; metals flow Q correction guidance |
| Energy / bioenergy | iLUC mandatory; biochar/soil sequestration consideration |
| Altro / multi-settore | Standard guidance; nessuna sector-specific overlay |

#### Q6b (TRL della tecnologia principale)

| Opzione | Cosa attiva |
|---|---|
| **TRL 9** — operativa industrialmente, dati storici disponibili | Standard data; no scale-up framework needed; static background OK |
| **TRL 7-8** — pilota/demo, dati limitati ma reali | Pedigree Matrix mandatory; partial scale-up; data tier flagging |
| **TRL 5-6** — sviluppo iniziale, lab + early pilot | CIR-07: Six-Tenths Rule + Lang Factors + CEPCI mandatory; Pedigree+Monte Carlo on estimates; iterative protocol |
| **TRL <5** — solo lab/concept | Low-TRL inventory protocol + literature curve learning; uncertainty dominated by epistemic; conservative scoring |

**Numero di nodi attivati/disattivati**: ~15-20 tra sector overlay e scale-up.

---

### Q7 (condizionale) — "Quanto sono distribuiti geograficamente i siti coinvolti?"

> *Mostrata solo se il sistema risponde "Sì" alla heuristic interna "i flussi simbiotici sono trasportati tra siti diversi?" (verificabile dai dati del caso che l'utente ha già caricato — coordinate dei siti).*

| Opzione | Cosa attiva |
|---|---|
| **Co-located** (eco-park, <5 km tra siti) | Break-even distance non critico; transport modeling minimo |
| **Regional** (5-100 km) | Break-even distance sensitivity mandatory (LCA HC-21, LCC HC-06); explicit foreground transport |
| **Wide-area** (>100 km, cross-region o cross-border) | CIR-03: GIS-coupled spatial modeling activated (LCC MC-14b + LCA MC-29); territorial dimension S-LCA (HC-10) explicit |

In molti casi questa domanda è derivabile dai siti che l'utente carica come "dati del caso" (geocoordinate). Mostrare la domanda solo se l'inferenza fallisce o se l'utente non ha caricato i dati.

---

## §4 Cosa sparisce dal v2

Le seguenti domande del decision engine v2 NON vanno più chieste all'utente. Diventano DEFAULT (con override esperto) o DERIVED:

| v2 question | Status nel v3 | Motivo |
|---|---|---|
| Q (v2) "ILCD situation A/B/C?" | **REPLACED by Q1** | Linguaggio metodologico inaccessibile a non-esperti. Q1 ottiene la stessa info. |
| Q (v2) "Function-oriented vs Flow-oriented FU?" | **DEFAULT (function-oriented)** | Kimi stesso nota option count = 1 per IS. Mai chiedere. |
| Q (v2) "LCIA method family?" | **DEFAULT (ReCiPe 2016 + EF 3.1 backup)** | Non-esperto non sa cosa scegliere. Esperto può override in advanced. |
| Q (v2) "Weighting yes/no?" | **DERIVED da Q4** | Public assertion → weighting prohibited (HC-09). Internal → allowed but discouraged. Mai chiedere direttamente. |
| Q (v2) "Multifunctionality: System Expansion vs Allocation?" | **DERIVED da Q1** | Situation A/B/C1 → Sub; C2 → Alloc. Non chiedere. |
| Q (v2) "Substitution data: Average vs Marginal?" | **DERIVED da Q1** | A/C1 → Avg; B → Marginal. Non chiedere. |
| Q (v2) "PEF CFF as third option for multifunctionality" | **ELIMINATED** | Q7 v2 conflateva 2 decisioni (vedi LCA report §B). Sostituire con: Q4 → policy alignment (D) attiva PEF CFF. PEF CFF non è opzione di Q1, è derivata da Q4. |
| Q (v2) "Hybrid technique: Tiered/Integrated/Path-exchange/HPIMO?" | **DEFAULT (Integrated for IS multi-actor)** | Non-esperto non distingue. Esperto override. |
| Q (v2) "IO database EXIOBASE/FIGARO/Eora?" | **DEFAULT (EXIOBASE per Europe)** | Settore-derivable, geo-derivable. Non chiedere. |
| Q (v2) "Uncertainty propagation OAT/GSA/both?" | **DEFAULT (Both: OAT first + GSA Morris on critical)** | Non chiedere. |
| Q (v2) "GSA tier Morris/Sobol/PAWN/delta?" | **DEFAULT (Morris→Sobol cascade)** | Non chiedere. |
| Q (v2) "Reference scenario strategy modern/sector avg/...?" | **DERIVED da Q1+Q2** | Q1=A/Q2=ex-post → modern replacements + sector avg. Q1=B → semi-consequential. Etc. |
| INV-04 invariant (boundary cross-method) | **REPLACED by IR-01..IR-20 from Phase 2** | INV-04 era malformulato (vedi LCA report bootstrap §3.2). I veri invariant sono nelle Hard IR rules. |
| RULE-04 post-processing | **REMOVED (duplicato BLOCK-03)** | Vedi LCA report bootstrap. Non più necessario. |

In totale: **dal v2 spariscono ~10 domande**, e le rimanenti sono riformulate in linguaggio caso IS.

---

## §5 Stato bootstrap §5 dopo questo turno

Le decisioni residue del bootstrap:

| Decisione | Status | Risoluzione proposta |
|---|---|---|
| D1 — Approccio re-do (A/B/C) | **Risolta**: B confermato (rework rate 0% su 186 nodi) | — |
| D2 — Numero pathway terminali | **Provvisoriamente risolta**: 5 pathway IS-01..IS-05 di Kimi sono solidi | Aspettare convalida Mirko su Q1; se Q1 funziona, i 5 pathway sono naturalmente generati da Q1×Q2 |
| D3 — Quali sono le vere 5 dominant variables | **Risolta**: Kimi ha trovato le strutturali, qui le ho riformulate in linguaggio utente come Q1-Q4 + Q5-Q6 ortogonali | — |
| D4 — Interface burden/credit sharing come dimensione esplicita? | **Da risolvere**: la decisione si riduce a "Q4-D PEF CFF è una sotto-opzione di Q4 (policy alignment) o è una dimensione separata?" | Mia raccomandazione: Q4-D **attiva** PEF CFF come modalità di allocation con parametri A/B/R1/R2 esposti come advanced settings. Non serve farne una domanda primaria. |
| D5 — Casi reali per stress test | **Da affrontare prossimo turno** | Servono 3-5 casi pubblicati 2020-2025 per validare che le 6 domande coprano i casi reali. |

---

## §6 Cosa propongo per il prossimo turno

Tre opzioni:

**A. Stress-test delle 6 domande su casi reali** (3-5 paper IS-LCA recenti). Verificare che ogni caso reale possa essere "rispondendo" alle 6 domande e che l'output del motore sia coerente con cosa gli autori hanno effettivamente fatto. Più efficace per scovare gap.

**B. Iterazione sul wording delle domande**. Tu critichi il wording di Q1-Q7, gli esempi concreti, le opzioni; io itero. Più rapido ma richiede tempo tuo.

**C. Costruire il mapping nodi-per-nodo dettagliato** (i 186 nodi assegnati esplicitamente a DEFAULT/DERIVED/DOMINANT con le condizioni di trigger). Fondamentale per Sprint 4 (riadattamento backend al nuovo schema), ma macchinoso.

Mia raccomandazione: **A prima** (3 casi reali), poi **B** sul wording, poi **C** quando ci sentiamo solidi sulla struttura. Per A mi servirebbe da te 3 reference paper che conosci bene — autori, journal, anno, una riga sul perché lo proponi (cfr. bootstrap §5 D5: candidati Sunflower-Compost, Brewery-Aquaculture, Steel-Cement, textile, WWTP-greenhouse).

Se invece preferisci B prima (è più cheap), procediamo dal wording.

---

## §7 Note di metodo per l'implementazione

Quando questa struttura andrà nel Sprint 4 backend:

1. **Q1 + Q2 generano un `pathway_id` ∈ {IS-01..IS-05}** che è la radice del decision tree (deterministica, non probabilistica).
2. **Q3, Q4 sono filtri ortogonali** che attivano/disattivano interi blocchi (LCC presence, S-LCA presence, panel review trigger, PEF CFF trigger).
3. **Q5 è iterativa per flusso** e genera una sotto-sezione del modello per ogni flusso.
4. **Q6, Q7 sono context overlay** che caricano sector-specific rules e spatial differentiation.
5. **Tutti gli altri 170+ nodi sono caricati dal motore in base alle risposte** — l'utente non li vede mai a meno di entrare in "advanced settings".
6. **Il "dato del caso"** (siti, flussi, partner, masse, energie) è separato dal questionario di scoping e va costruito in un step precedente o parallelo (l'attuale frontend Sprint 3 ha già la struttura di base).
7. **L'utente esperto** può saltare Q1-Q7 e andare direttamente alla configurazione tecnica via "advanced mode" — ma il default è il questionario user-friendly.

---

*Fine proposta. Aspetto tua conferma su (a) wording delle 6 domande / (b) opzioni e esempi / (c) quale next step preferisci tra A/B/C in §6.*
