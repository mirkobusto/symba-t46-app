# BOOTSTRAP — SYMBA T4.6 IS Assessment App (re-start metodologico)

**Data bootstrap**: 2026-05-07 (post Sprint 0-3, decisione di re-start metodologico)
**Owner progetto**: Mirko Busto (ENCO)
**Lead per nuova chat**: Architect chat (Claude Opus 4.7)
**Repo GitHub**: `https://github.com/mirkobusto/symba-t46-app` (pubblico)

---

## ⚠️ NATURA DI QUESTO DOCUMENTO

Questa è una nuova chat. La chat precedente ha:
- ✅ Costruito infrastruttura solida (Sprint 1 scaffold + Sprint 2 backend + Sprint 3 frontend) — RIUTILIZZABILE
- ❌ Fatto un lavoro **superficiale** sulla parte metodologica (Sprint 0 review) — DA RIFARE

Il decision engine `lcsa_decision_engine.v2.json` consegnato a fine Sprint 0 contiene **errori dimostrati**:
1. **Q7 multifunctionality**: include PEF CFF come terza opzione parallela a system-expansion/allocation. **Sbagliato**: PEF CFF non c'entra con multifunctionality (che riguarda processi multi-prodotto interni a una entità). PEF CFF c'entra con burden/credit sharing all'interfaccia tra attori IS — concetto ortogonale.
2. **INV-04 invariant**: confronta `lcc.boundary` (perimetro fisico) con `lca.system_boundary` (framework di modeling) come se dovessero essere uguali. **Sbagliato**: sono dimensioni semantiche diverse. Genera falsi positivi.
3. **RULE-04 post-processing**: ridondante con BLOCK-03 ma con schema diverso. **Sbagliato**: duplica una blocked combination con un meccanismo diverso.

E soprattutto, la struttura "10 domande" è una **semplificazione flat** del decision tree Kimi, non una vera analisi dei **dominant variables** che riducono la complessità. Mirko aveva chiesto a Kimi (e io ho dimenticato di verificare) di identificare le vere riduzioni di complessità — quali scelte upstream determinano deterministicamente molte scelte downstream.

**Compito di questa nuova chat**: ricostruire la parte metodologica con rigore, partendo dai dominant variables veri.

---

## §1 Contesto T4.6 (invariato)

SYMBA Grant Agreement 101135562, **Task 4.6 (M22-M36, lead ENCO/Mirko Busto)**: web app che operazionalizza i tre deliverable WP4 (D4.1 LCA, D4.2 LCC, D4.3 S-LCA) in uno strumento di **scoping metodologico per casi di simbiosi industriale (IS) bio-based**.

**Pubblico target** (importante — non capito bene nella chat precedente): assessor LCA/LCC/S-LCA esperti **MA ANCHE** non-esperti (biomass producers, industries, local communities, local authorities, end-users). Il tool deve essere **utilizzabile da entrambi**. La chat precedente ha fatto un questionario solo per esperti. Va riprogettato con UX guidata in linguaggio naturale che mappa internamente alla struttura tecnica.

**Output attesi del tool**:
1. Classificazione del caso IS in un pathway metodologico
2. Configurazione completa LCA + LCC + S-LCA per quel pathway
3. Protocollo metodologico (docx/pdf) generato, con traceability ai deliverable
4. Template di raccolta dati strutturato (xlsx)
5. Galleria di benchmark indicativi da letteratura

**Out of scope MVP** (ribadito): no calcoli LCSA reali, no integrazione SimaPro/OpenLCA, no auth utente, no multi-utente, no deploy prod, no multilingua (solo inglese).

---

## §2 Stato infrastruttura (Sprint 1-2-3) — RIUTILIZZABILE

### Sprint 1 — Scaffold ✅ chiuso (in main)
Repo monorepo con `frontend/`, `backend/`, `coordination/`. Stack: React 18 + TypeScript + Vite (frontend), FastAPI + SQLAlchemy + SQLite (backend). Docker compose dev. CI GitHub Actions con 2 job (frontend lint+test, backend lint+test).

Setup ambient utente: Ubuntu 24 nativo. Docker compose v2 (`docker compose`). Browser bug: `localhost` blocked sulla macchina di Mirko, deve usare `192.168.1.146`. App Symba gira su porte:
- Backend: `192.168.1.146:8001`
- Frontend: `192.168.1.146:5174`

(Esiste un altro tool LCA Matcher su 8000/5173, le porte 8001/5174 sono per evitare conflitto.)

### Sprint 2 — Backend domain layer ✅ chiuso (PR mergeata)
- `DecisionEngine` class che carica `lcsa_decision_engine.v2.json` e implementa 8-step pathway resolution algorithm con Hamming distance fallback pesato
- Modelli SQLAlchemy: `Session` (UUID + status), `Answer` (1 per Q per session, unique constraint), `PathwayResolutionRecord` (1-to-1 con Session)
- 12 endpoint REST sotto `/api/`: `/decision-engine/questions`, `/sessions`, `/sessions/{id}/answers`, `/sessions/{id}/resolve`, `/sessions/{id}/pathway`, ecc.
- Test pytest: 51/51 pass, coverage 95% (>>soglia)
- Ruff pulito
- Smoke test caso Sunflower OK: pathway P1 + RULE-01 applicata + lca.weighting=no-weighting

### Sprint 3 — Frontend questionnaire ✅ chiuso (PR aperta, manual QA pending)
- 4 pagine: HomePage, QuestionnairePage, ResultPage, ErrorPage
- 9 componenti riutilizzabili: Layout, QuestionCard, ProgressIndicator, PathwayBadge, ConfigurationSection, TraceList, AppliedRulesList, WarningsBanner, BlockedMessage
- Stack: react-router-dom v7, zustand v5 (con persist localStorage su sessionId+currentQuestionIndex), lucide-react
- TypeScript types completi
- Tailwind NON configurato — Claude Code ha usato CSS plain (carry-over: migrazione Tailwind in futuro)
- 15/15 test Vitest pass
- Bug noto: input case_name in HomePage non funziona

**Punti positivi**: l'infrastruttura è solida, ben testata, con separazione chiara dei livelli. Il decision engine è caricato dinamicamente dal JSON — quando aggiorneremo il JSON il backend si aggiorna automaticamente (a meno di re-import).

---

## §3 Stato metodologico — DA RIFARE CON RIGORE

### 3.1 Asset Kimi a disposizione (output del lavoro Kimi su 5 fasi)

Files in `coordination/reviews/` o riferibili dal repo:
- `phase1_lca_atomic_nodes.md` — 22 HC + 36 MC LCA, traced a sezioni D4.1
- `phase1_lcc_atomic_nodes.md` — 40 HC + 20 MC LCC, traced a sezioni D4.2
- `phase1_slca_atomic_nodes.md` — 47 HC + 18 MC S-LCA, traced a sezioni D4.3
- `phase2_compatibility_matrix.md` — cross-method compatibility con [OK]/[WARN]/[BLOCK] markers + 19 Integration Rules (IR-01..IR-19) + 12 Cross-Domain Problems (CDP-01..CDP-12)
- `phase3_pathway_space.md` — analisi della cardinalità del decision space + identificazione di **dominant variables** che riducono ~10^12 combinazioni a ~10^9 (40% nodi MC ridotti) + 5 IS-relevant pathway filtrati (IS-01..IS-05)
- `phase4_logic_table.md` — 10 pathway terminali (LCSA-P1..LCSA-P10) + 6 BLOCKED combinations
- `phase4_mermaid_tree.md` — decision tree visualizzato
- `phase4_traceability.md` — justification di ogni pathway
- `phase5_clash_table.md` — 30+ clash analysis con resolution rules
- `IS_Decision_Engine_UNIFIED.md` — documento unificato (Section 4 deprecata, usare phase4_*)

### 3.2 Quello che la chat precedente ha SBAGLIATO sulla review

1. **Validazione superficiale**: ho verificato 5/22 HC LCA, 4/40 HC LCC, 5/47 HC S-LCA — un campione del 12-22% non è sufficiente. Avevo dichiarato "Phase 1 affidabile" senza prove.

2. **Adottato la struttura 10-domande di Kimi senza criticarla**. Kimi aveva fatto i veri "dominant variables" in phase3. Le 10 domande del phase4 sono già una espansione che reintroduce nodi non-dominant. La chat precedente avrebbe dovuto:
   - Prendere i 5 dominant variables di phase3
   - Verificare se ognuno è davvero dominante (riduce X downstream choices)
   - Costruire un questionario **adattivo** che parte dai dominant e mostra solo i secondary necessari

3. **Promosso PEF CFF a opzione di Q7 senza verificare**: errore concettuale. PEF CFF appartiene a un livello metodologico diverso (interface burden/credit sharing), non multifunctionality.

4. **Falsi positivi nelle invariants**: INV-04 confronta campi semanticamente diversi.

5. **Patch ridondanti**: RULE-04 duplica BLOCK-03 con schema diverso.

6. **Gli stress test del Pass 3** hanno usato 4 casi fittizi che NON ho costruito su scenari reali della letteratura. Mirko aveva detto "se vuoi proporne uno tu" un caso real-world ma io ho usato solo casi inventati. Senza casi reali, gli stress test non possono catturare gap metodologici.

### 3.3 Cosa serve veramente fare

**Bootstrap metodologico rigoroso**:

1. **Rifare phase3 dominant variables analysis**: prendere ogni HC e MC dei 3 metodi, identificare quali sono **veramente dominanti** (riducono ≥X downstream choices in modo deterministico) vs quali sono **secondary** (richiedono input solo in casi specifici). Output: lista di N dominant variables (probabilmente 4-6, non 10).

2. **Costruire un decision tree adattivo**: invece di 10 domande lineari, avere una struttura branchy dove la prima domanda è dominant-1, e a seconda della risposta il tree apre solo i branch rilevanti. Il numero di domande viste dall'utente è variabile (es. 4-8).

3. **Rivedere ogni pathway terminale**: i 10 pathway di phase4 sono troppi e mal strutturati (P9 EU-Policy non è davvero un pathway, P10 S-LCA Default è uno scenario edge). Probabilmente i pathway terminali "veri" sono 5-7 con varianti gestite via post-processing.

4. **Identificare correttamente il livello "interface burden/credit sharing"**: questo è una **dimensione separata** dalla multifunctionality. Le domande/pathway devono distinguerla. I metodi disponibili sono:
   - Cut-off / zero-burden (default semplice)
   - Quality-corrected substitution con Q ∈ [0.6, 1.0]
   - PEF CFF per EU policy alignment
   - 4-step hierarchy §5.7.1 di D4.1 (proposta da Mirko stesso, già consolidata in footnote c133, c149, c150)

5. **Validazione Phase 1 al 100%, non a campione**: ogni HC e MC va verificato contro il testo letterale dei deliverable. Sì, è lavoro lungo (~6-8h), ma è la base di tutto il resto.

6. **Stress test su casi reali**: prendere 3-4 casi IS reali pubblicati in letteratura (non inventati) e verificare che il decision engine produca configurazioni metodologicamente coerenti con quello che gli autori hanno fatto realmente.

---

## §4 Materiale di partenza per nuova chat

Quando inizi nuova chat, hai accesso a:

### File del repo (da `https://github.com/mirkobusto/symba-t46-app`):

**Decisioni di design** (validi, non ridiscutere):
- `coordination/master-plan/MASTER_PLAN.md` (versione corrente, contiene ADR-001..004)
- `coordination/current-state/_CURRENT_STATE.md` (versione corrente)

**Output Sprint 0 (DA RIFARE, considerare come baseline da migliorare)**:
- `coordination/data/lcsa_decision_engine.v2.json` (60KB, 1110 righe — contiene gli errori sopra)
- `coordination/reviews/kimi_logic_table_review.md`
- `coordination/reviews/kimi_phase2_lca_validation.md`
- `coordination/reviews/kimi_phase2_lcc_validation.md`
- `coordination/reviews/kimi_phase2_slca_validation.md`
- `coordination/reviews/kimi_phase3_stress_test.md`
- `coordination/reviews/deliverable_authoring_issues.md` (15 issue editoriali D4.1+D4.2+D4.3 — questo è OK, riusabile)

**Output Kimi 5-fasi (sorgente da rivalidare con rigore)**:
- `coordination/data/` o repository correlato — file Phase 1-5 di Kimi

**Codice (RIUTILIZZABILE, non toccare in fase metodologica)**:
- `frontend/`, `backend/` — Sprint 1-2-3 mergeato
- `docker-compose.yml`, `.github/workflows/`

### Deliverable D4.x (sorgenti autoritativi):
- `D4.1_LCA_Guidelines_WIP.docx` — LCA guidelines (work in progress, contiene ~250 footnote di Mirko con commenti editoriali e proposte non ancora integrate nel testo)
- `D4.2_LCC_Guidelines_V1.docx` — LCC guidelines (versione 1, più stabile)
- `D4.3_S-LCA_Guidelines_V1.docx` — S-LCA guidelines (versione 1, registro descrittivo non normativo)
- `SYMBA_LCA_guidelines_part2_v1.docx` — Part 2 (sector-specific issues per textile, plastics, food, etc.)

### Issue editoriali identificate sui deliverable (in `deliverable_authoring_issues.md`):
- **D4.1**: 1 🔴 (broken cross-refs §13) + 2 🟠 (LCA/LCC discounting asymmetry no rule, §13 checklist incomplete) + 5 minor
- **D4.2**: 2 🟠 (FU "identical" universale vs E-LCC-only, "typically Cradle-to-Gate" weakens "must be identical") + 3 minor
- **D4.3**: 1 🟠 (descriptive register vs normative) + 1 minor

Stima refactoring editoriale Mirko: ~12-15h. Indipendente dal lavoro di nuova chat metodologica.

---

## §5 Cose da decidere all'inizio della nuova chat

**Decisione 1 — Approccio re-do**:
A. **Ripartire da zero**: ignorare il lavoro Kimi, rifare completamente l'analisi dominant variables → decision tree → pathway → JSON dal D4.1/D4.2/D4.3 puri. Più rigoroso ma più lungo (~10-15h Architect chat).
B. **Validare e correggere Kimi**: prendere phase1-5 di Kimi, validarli al 100% (non a campione), costruire JSON v3 sopra solo i nodi confermati. Più veloce (~6-8h Architect chat) ma vincolato all'angolatura analitica di Kimi.
C. **Re-prompting Kimi con specifiche più rigorose**: scrivere prompt nuovi per Kimi che chiedono esplicitamente: dominant variables veri, distinzione interface vs multifunctionality, validation con casi reali letteratura. Più dipendente dalla qualità di Kimi, ma scarica tempo da Architect.

**Decisione 2 — Pathway scope**:
- Quanti pathway terminali sono "necessari" per coprire i casi IS realistici? Probabilmente 5-7 (non 10). I criteri di "necessità": ogni pathway deve essere distinguibile per almeno 2 dimensioni dominanti, deve corrispondere a uno scenario reale documentato in letteratura.

**Decisione 3 — Domande**:
- Da phase3 di Kimi, le 5 dominant variables sono: ILCD situation, LCC type, ex-ante/post, function-oriented FU, public assertion. Sono davvero le 5? Function-oriented FU è dominant o è invece sempre default per IS (e quindi non è una vera scelta utente)?

**Decisione 4 — Interface burden/credit sharing**:
- Va aggiunto come dimensione esplicita nel decision engine? Sì o no?
- Se sì, è una variabile dominant o secondary?
- Gestione di PEF CFF: opzionale (per EU policy alignment), default cut-off, default quality-corrected substitution?

**Decisione 5 — Validazione**:
- Casi reali per stress test: minimo 3, max 5. Quali? Da letteratura recente IS-LCA (2020-2025). Esempi candidati: Sunflower-Compost (Italia bioeconomia), Brewery-Aquaculture (caso EU policy), Steel-Cement (CSRD reporting), un caso textile, un caso WWTP-greenhouse.

---

## §6 Setup nuova chat — istruzioni operative

### Chi è Mirko (per onboarding rapido)
Mirko Busto, ENCO, è il lead di T4.6 SYMBA. È l'autore dei tre deliverable D4.1/D4.2/D4.3. Ha:
- Background tecnico LCA/LCC profondo
- Standard di rigore alti (giustamente — sta preparando un deliverable che verrà revisionato esternamente)
- Tolleranza zero per superficialità metodologica
- Tempo limitato (è anche autore deliverable + altri progetti SYMBA)
- Setup tecnico Linux Ubuntu 24 + Docker + Visual Studio Code

### Modalità di lavoro che funziona con Mirko
- **Italiano** per discussione metodologica e SPEC
- **Inglese** per codice, UI strings, docstrings
- **Verifiche prima di proporre**: NON dare per buono il lavoro Kimi senza verificare contro testo D4.x
- **Casi reali sempre**: ogni decisione metodologica va validata su almeno un caso real-world
- **Documentare ogni assunzione**: se faccio un'assunzione, deve essere esplicita e verificata
- **Dimensioni risposta**: tendenzialmente Mirko vuole risposte concrete e veloci; le SPEC lunghe sono OK quando servono per Claude Code, ma le risposte in chat devono essere concise

### Working style con Claude Code
- Sprint-based: ogni sprint ha SPEC (Architect chat) + REPORT (Claude Code dopo implementazione)
- Single-PR strategy: codice + report nel singolo branch (non due PR separate, anche se la SPEC originale lo proponeva)
- Manual QA gate documentato in ogni SPEC §8 prima del merge
- Italian per SPEC commenti, English per codice/UI

### Decisioni accettate (ADR)
- **ADR-001** Stack: React + FastAPI + SQLite (vedi MASTER_PLAN)
- **ADR-002** Repo monorepo pubblico
- **ADR-003** Logic table v2 sotto nostra responsabilità (Opzione A — non più valida visto re-do, RIVEDERE)
- **ADR-004** Patches strutturali (le patch attuali sono parte del problema da rifare, RIVEDERE)

---

## §7 Cose da NON fare nella nuova chat

1. **Non promettere "Phase 1 valida" senza validare al 100%**.
2. **Non adottare la struttura 10-domande di phase4 senza criticarla**.
3. **Non confondere multifunctionality (intra-process) con interface burden/credit sharing (inter-actor)** — sono dimensioni diverse.
4. **Non inserire nel JSON regole malformulate come INV-04** (confronto tra campi semanticamente diversi).
5. **Non duplicare regole** (RULE-04 vs BLOCK-03).
6. **Non usare casi fittizi solo** per stress test — almeno 50% reali da letteratura.
7. **Non scrivere SPEC Sprint nuovo prima di aver chiuso il bootstrap metodologico** — il decision engine sbagliato propaga errori a tutto il resto.
8. **Non considerare valida l'analisi cardinality in phase3** senza riverificare. Kimi cita "~10^12 combinations reduced to ~10^9" ma questo numero va verificato (è plausibile ma non l'ho verificato).

---

## §8 Primo prompt suggerito per nuova chat

Quando apri la nuova chat, suggerisco di iniziare così:

> "Riparto da zero sulla parte metodologica del decision engine T4.6 di SYMBA. Ho un bootstrap document che riassume cosa è stato fatto bene (infrastruttura) e cosa va rifatto (parte metodologica) nelle chat precedenti. La struttura tecnica del tool va bene, ma il decision engine che mappa le risposte utente a configurazioni metodologiche è stato fatto superficialmente. Ti chiedo di:
> 
> 1. Leggere il bootstrap document
> 2. Leggere D4.1 §5 (multifunctionality) + §5.7.1 (4-step hierarchy zero-burden) + D4.2 §2.2 (LCC types) + D4.3 §2.1 (comparative logic)
> 3. Leggere phase1-5 di Kimi nel coordination
> 4. Proporre un piano di lavoro per: (a) validare al 100% Phase 1 di Kimi, (b) rifare l'analisi dominant variables, (c) ridisegnare il decision tree adattivo, (d) ricostruire JSON v3.
> 
> Non scrivere ancora il JSON. Voglio prima un piano metodologico."

E poi attaccare il bootstrap document come allegato o paste integrale.

---

## §9 File di lavoro da preservare

Durante la transizione tra chat, questi file sono stato corrente del lavoro:

**In repo `mirkobusto/symba-t46-app`** (già pushed, accessibili a nuova chat):
- Tutti i file in `coordination/`
- Codice frontend/backend
- File Sprint reports

**Nei tuoi local Downloads (eventualmente da committare)**:
- Le SPEC Sprint 1/2/3 (caricate in `coordination/specs/`)
- Eventuali bozze precedenti

**Riferimenti esterni (in tuoi documenti privati)**:
- Pdf paper academici (Rigamonti, Schmidt, Vadenbo, Aleisa, Schrijvers, Hunkeler) citati in D4.1 footnotes — la nuova chat non li ha direttamente, può solo riferirsi alle citazioni nei deliverable.

---

## §10 Roadmap dopo bootstrap

Una volta che la nuova chat ha consegnato:
- Validazione Phase 1 al 100%
- Dominant variables analysis
- Decision tree adattivo
- JSON v3

Il lavoro infrastruttura riprende:
- **Sprint 4** (revisione): adattare backend `DecisionEngine` per leggere JSON v3 (probabilmente piccoli cambi schema), aggiornare frontend questionnaire per gestire decision tree adattivo (struttura conditional invece di lineare)
- **Sprint 5**: generazione protocollo docx
- **Sprint 6**: generazione template xlsx
- **Sprint 7**: galleria benchmark letteratura
- **Sprint 8**: hardening + E2E

Stima totale post-bootstrap: ~15-20h tra Architect chat + Claude Code.

---

## §11 Note finali

**Tono della transizione**: la chat precedente ha consegnato infrastruttura solida e ha riconosciuto i suoi errori metodologici quando Mirko li ha indicati. La nuova chat deve sapere che:
- Mirko non sta "buttando via" il lavoro — sta separando ciò che è OK (infra) da ciò che va rifatto (metodologia)
- La nuova chat non deve essere apologetica né insicura — deve essere rigorosa
- L'aspettativa è alta: standard di rigore metodologico = livello deliverable accademico

**Tempo investito finora** (per dimensionamento):
- Architect chat: ~12-15h totali (Sprint 0-3)
- Claude Code: ~8-10h (Sprint 1-3)
- Totale: ~20-25h

**Tempo stimato per chiudere bootstrap metodologico nella nuova chat**: 10-15h Architect chat, distribuiti su ~5-8 sessioni.

---

*Fine bootstrap. La nuova chat può iniziare leggendo questo file e poi passando al primo prompt suggerito in §8.*
