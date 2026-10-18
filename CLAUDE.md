# CLAUDE.md — Working agreement con Claude Code

Questo file viene letto automaticamente da Claude Code all'inizio di ogni sessione.
Definisce vincoli permanenti, convenzioni del progetto e regole di workflow.

---

## Lingua

Rispondi **sempre in italiano** salvo richiesta esplicita di passare ad altra lingua.
Codice, commenti nel codice, commit message, e nomi di file restano in inglese.

---

## Contesto del progetto

Il progetto è **SYMBA T4.6 — Monitoring & Reporting System for Industrial Symbiosis**:
applicazione web multi-stakeholder del progetto Horizon Europe **SYMBA** (GA 101135562,
HORIZON-CL6-2023-CIRCBIO-01), task T4.6 (M22–M36), deliverable **D4.6** (PU). Lead ENCO,
contribuiscono CIRCE e CET.

Mandato GA (verbatim Annex 1): *"a monitoring system supporting all the actors along the
biobased value chain (biomass producers; industries, local communities, local authorities,
end-users, etc.) to evaluate the environmental, social and economic benefits of using SYMBA
IS methodology"*. È parte di un PhD su simbiosi industriale di Mirko Busto (ENCO).

**Audience layered** (decisione di framing 2026-05-22, Opzione B):
- **Layer 1 (MVP corrente)** — IS practitioner / sustainability analyst / reviewer:
  risponde al questionario (Q0-Q12, costruito dal 2026-10-18 sulle variabili dei deliverable),
  ottiene la configurazione metodologica (situazione ILCD, struttura LCC, orizzonte, scenario di
  riferimento, capitoli della Part 2) e il Data Collection File (DCF) calibrato su di essa.
- **Layer 2 (in costruzione, Fasi A-C della roadmap T4.6)** — full stakeholder spectrum
  (industrie, comunità locali, autorità, end-users): viste report dedicate per tipologia
  di stakeholder, accessibilità non-specialista (wizard), deployment pubblico.

**Cosa il tool NON fa**: le analisi numeriche LCSA (kg CO2eq, NPV, social indicators
quantitativi) **non sono calcolate dal tool**. Lo scoring system è prodotto esternamente
(CIRCE/altri partner T4.1–T4.3 via SimaPro/OpenLCA/strumenti dedicati). Il tool integra
i risultati scoring nel reporting multi-stakeholder ma non li computa. **Specifica I/O
scoring CIRCE: TBD** (in attesa documento CIRCE — punto aperto).

**Auth multi-utente: TBD** — MVP single-user pubblico per Fase A-C; auth/ruoli rinviati
a Fase D opzionale post-MVP (rivedere se demo regions inseriranno dati sensibili → GDPR).

**D4.3 S-LCA Guidelines (CIRCE/Leiva)**: V1 esiste, contenuto assumiamo già integrato
nei nodi `slca_*` dei 5 JSON (verifica posticipata a Fase B quando disegneremo le viste
S-LCA del reporting multi-stakeholder).

Project context legale/funding: vedi `~/.claude/projects/.../memory/project_symba_context.md`.
Visual identity (palette white/blue/green, EU footer obbligatorio, struttura deliverable V3):
vedi `~/.claude/projects/.../memory/project_visual_identity.md`.

Stack:
- Backend: FastAPI (Python 3.12) + SQLAlchemy 2.0 + Pydantic v2
- Frontend: React 19 + TypeScript + Vite 8 + Zustand 5 + react-router-dom v7 + react-i18next (in `frontend/`, stesso repo)
- Engine decisionale: schema-driven (6 JSON files dopo dcf_schema, separato namespace) + activation pipeline + sector overlays (regole e configurazioni della D4.1 Part 2, dal 2026-10-18)
- Persistence: SQLite via SQLAlchemy (server-side cases) + localStorage via Zustand persist (client-side draft)
- Dev ports: backend 8088, frontend 5180

Stato al **2026-10-04**: roadmap T4.6 Fasi A-D **tutta mergiata su `main`**, incluso il
rework di visual identity (PR #42, "Data Dashboard"). Il 2026-10-04 è stata mergiata anche la
verifica app-vs-deliverable (PR #89, 36 commit; I-01…I-19 tranne i punti elencati sotto), insieme a
tre domande opzionali (Q8-Q10), `Case.warnings`, la nuova sezione DCF `flow_classification`, il
branding del sito symbaproject.eu con font in locale e una bozza di informativa privacy (PR #88).

Il **2026-10-13** è stato mergiato il round di audit UX (PR #95-#102), nato da sei agenti
tester lanciati in quattro lingue sul sito pubblico. In sintesi: promesse dei testi allineate
a quello che l'app fa davvero; il ruolo scelto nel wizard ora decide la scheda di atterraggio;
le quattro viste di pubblico (industria, comunità, autorità, end-user) dicono cose diverse
invece di essere due coppie identiche; la **modalità guidata ha un registro suo**
(`questionnaire.qN.plain`, 5 lingue) e non apre più d'ufficio la nota da analisti; e il testo
che arriva dagli schemi (42 nomi di regola, 32 enunciati, 12 CDP, 4 messaggi di blocco) è
tradotto in `frontend/src/i18n/schemaTerms.ts`, con il codice IR-/CDP- che resta il
riferimento e il nome inglese accanto per chi non legge in inglese.

Il **2026-10-14/15** è stata mergiata la **revisione sul FINAL v2** dei deliverable (PR #109-#121),
nata dalla revisione di D4.1/D4.2 (report locali sulla branch `review/wp4-finalv2-2026-10`, **mai
pushata**: il repo è pubblico) e da un test del questionario su casi reali del corpus. In sintesi:
`source_section` dei nodi e citazioni in-app sulla numerazione FINAL v2 (#109, #111); scenario di
riferimento per ogni Q2 (#112: A → HNSRS, B/C → CNSRS, D → entrambi; D4.2 L00217/L00725 scambia le
due sigle per errore, vale D4.1 §11.1); **un solo orizzonte di studio** per il background futuro di
LCA e LCC (#110, #113: anno di esercizio futuro, TRL < 7, o orizzonte > 15 anni; Q8 ha tre parti);
**Q9 obbligatoria e primaria** per la situazione ILCD (#114: micro → A, strutturale → B solo con lo
screening di mercato documentato, documentare una rete → C1, rendiconto di una sola azienda → C2;
Q1 resta solo come ripiego per i casi salvati senza Q9); ritirata la "Situazione A multi-actor",
che D4.1 non conosce (#115); allocazione, tipo e tasso di sconto LCC per tipo di LCC (#116, D4.2
§5.1/§9.3); **Q2 chiede se gli scambi studiati avvengono già**, non in che fase è il sistema (#117);
per ogni flusso, risposta facoltativa Freedom-to-Act e settore della Part 2 (#118, solo note);
**senza LCA niente E-LCC** (#119: tipi `C+N` e `C+N+S`, C-LCC per partner + consolidamento di rete, D4.2
§4.1); le cifre senza fonte diventano forbici o parametri (#120: soglia dei 15 anni modificabile in
`advanced`, Monte Carlo 1.000-10.000 decisa dalla convergenza, 1-5 % fissato dall'analista, tolto il
default di 20 anni di ammortamento a favore della vita tecnica di ogni asset); la soglia scatta
se la supera il periodo di analisi **o** la vita degli asset, e la vita degli asset di Q8 è scritta come
periodo di ammortamento in LCA e LCC (#121).
La sera del **2026-10-15** è stata mergiata la **fase A, passi 1-2** (PR #123-#126): i 10 nodi ALTA dello
sprint 3 e i nodi "scelta di progetto" riscritti sul testo FINAL v2, ciascuno con le righe del testo nelle
`extraction_notes` ("Rewritten on FINAL v2 text, review 2026-10-15: Lnnnnn", fissato da un test) e le scelte
T4.6 dichiarate nel valore. In sintesi: valutazione LCC per flusso con chiave Q5 e valore per livello
(`lcc_mc_04/08`); scenario di uscita per ogni nodo critico (`lcc_mc_16`); niente ECOF/IEE senza LCA o con il solo
C-LCC (`lcc_mc_18`); confini LCA organizzativi con copertura dichiarata e confine LCC per tipo (`lca_mc_05`,
`lcc_mc_05`); database e contenuto dello scenario di riferimento per situazione ILCD, C1/C2 compresi
(`lca_mc_06`, `lca_mc_27`); panel obbligatorio per l'asserzione comparativa pubblica anche con Q4=D
(`lca_mc_36`); ogni flusso classificato evitabile/inevitabile, Q5=e compreso (`lcc_hc_13`); MFCA solo per Q5=b
(`lcc_hc_38`); monetizzazione obbligatoria nell'S-LCC e assente senza LCA, anche per CIR-05 (`lcc_mc_19`). La
chiave `contested` è uscita dalla grammatica. `PHASE1_NODE_MAPPING_v2.md` ha un avviso in testa e un §0 con le
modifiche dopo maggio 2026 (gli schemi fanno fede). Ogni passo è stato rivisto da Fable in sola lettura.
Poi, la stessa sera (PR #127-#132): **passo 3** testi delle domande (#128: Q4 C = dichiarazione pubblica di
superiorità **o equivalenza** in qualunque forma, articoli compresi; Q6b = TRL della tecnologia; Q8 periodo
di analisi contro vita tecnica; N8 "funzione primaria" rinviata al passo Part 2); **passo 4** caso di prova
della Situazione C2 (#129, `tests/test_situation_c2_case.py`, zuccherificio con rendiconto CSRD): in C2
vince l'allocazione anche con Q4=D (la CFF non si applica, nota `c2_allocation_over_pef`), "CSRD" tolto da
Q4=D; un rifiuto resta a carico zero anche in C2 (#130); **passo 4b** i nodi MEDIA/BASSA dello sprint 3
(#131 LCA, #132 LCC). CIR-07 scrive ora per l'LCA le tecniche di D4.1 §9.3.5 e lascia Six-Tenths/Lang/CEPCI
all'LCC. Restavano note e rinviate a I-17 (risolte in R3, #149): CIR-02, CIR-03 e CIR-05 sovrascrivono il testo di alcuni nodi
(CIR-03 sempre `lca_mc_29`), CIR-05 scrive NTF e CE Delft anche su un C-LCC.
Il **2026-10-18** è stato mergiato il **passo 5, la D4.1 Part 2** (PR #134-#138): `sector_overlays.json` ha ora,
per i cinque capitoli (§4-§8 con le categorie LCIA di §9), 64 regole di settore e 26 configurazioni tipiche;
`engine/sector_rules.py` le elenca in `Case.sector_rules` per i capitoli toccati (settore dichiarato sul flusso,
configurazione del flusso o Q6a), filtrate con `when_key` (grammatica delle chiavi di ramo) perché la Part 2
non allenti mai la Part 1 (niente sostituzione in C2, background "Situazione A" non in B, scale-up solo sotto
TRL 7); pagina risultato (sezione richiudibile per capitolo) e report. Nuova domanda facoltativa **Q11**
(`comparison_goal`: trattamento / sostituzione di prodotto / entrambi) che decide la base dell'unità funzionale
in `lca_mc_07` (input-based, output-based, sistema di unità; la "doppia" di D4.2 resta una nota). Nuovo campo
facoltativo `Flow.configuration` (colonna nella tabella dei flussi) che nomina il prodotto sostituito. Verifica
sugli 8 casi del corpus (script fuori dal repo): 64 sì / 5 no sui punti di studio, 37/53 sui capitoli per flusso;
le discordanze sono divergenze decise o classificazioni dei flussi, da cui la guida sotto la tabella dei flussi
(#138). **#135 è stata mergiata con il lint backend rosso** (corretto in #136): prima di ogni merge controllare
`gh pr checks`. Il passo 6 (note del motore e testi delle regole di settore tradotti) è #140-#141.

Il **2026-10-18** è partita la **rifondazione** (decisione del proprietario: "non salvare qualcosa solo perché
esiste già"): l'app si costruisce sulle variabili che i deliverable usano, non sulla struttura ereditata. Piano:
R1 togliere i percorsi, R2 questionario ricostruito, R3 regole CIR (I-17), R4 via le "violazioni" L2 dai report,
R5 pagina risultato e modalità guidata, R6 deck e documenti da zero; poi nuovo passaggio sui casi reali con Fable.
Fatto e in linea lo stesso giorno (ogni passo rivisto da Fable in sola lettura, corpus sempre a 63 sì / 6 no):
- **R1** (#142): **via i percorsi IS-01..IS-05** (costrutto T4.6 che i deliverable non conoscono) da motore, API,
  report, DCF, viste e casi salvati (`scripts/migrate_remove_pathway.py`, eseguito sul server; via anche le tabelle
  legacy `sessions` / `answers` / `pathway_resolutions`). In testa al risultato c'è la situazione ILCD in parole.
- **R2 passo 1** (#143): **Q2 a due risposte** (gli scambi misurati avvengono già → HNSRS / non ancora → CNSRS;
  le vecchie C e D si leggono B) con la domanda di seguito `network_long_standing` (controfattuale moderno, D4.1
  §11.2.2, chiave di ramo `long_standing=true`); scenari alternativi aperti a ogni studio (`has_scenarios` nel DCF).
- **R2 passo 2** (#144): **Q1 e Q6a descrivono, Q9 e Q10 decidono**. Senza Q9/Q10 il motore ripiega su Q1 con una
  nota (`q9_unanswered`, `q10_unanswered`); Q10 obbligatoria con l'economico e allargata al decisore pubblico; i
  capitoli della Part 2 e AWARE seguono i flussi (nota `case_sector_without_flow`). Q1 descrive ancora la forma
  della rete per i tre nodi di confine (`lca_mc_05`, `slca_mc_04`, `lcc_mc_16`).
- **R2 passo 3** (#145): **Q7 = concentrazione delle interazioni chiave** (un sito / regionale / fra regioni; la
  vecchia D si legge C), decide la caratterizzazione regionalizzata della LCIA (D4.1 §12.2.3, §12.3.3), non il
  trasporto (esplicito e con GIS raccomandato per ogni scambio); **Q7b mercato di riferimento**
  (`reference_market_region` / `reference_market_scope`, D4.1 §11.3.1). Le risposte entrano nei nodi con **frasi
  composte** (`engine/answer_phrases.py`, segnaposto `{reference_market}`, `{affected_market}`,
  `{interaction_scale}`, `{shared_assets}` riempiti in `activate._write`; decisione del proprietario, opzione 1).
  CIR-05 conserva la regionalizzazione; CIR-03 non legge più Q7.
- **R2 passo 4** (#146): **Q12 beni capitali dedicati e condivisi** (`dedicated_shared_assets`, chiesta con LCA o
  LCC; chiave `shared_assets=true`), che accende IR-13, B-06 e CIR-08 (questa solo con il sociale) e converte una
  volta la vecchia chiave avanzata `is_specific_capital_goods`.
- **R2 passo 5** (#147): **Q0 scopo dello studio** (D4.1 §4.3.2, dopo Mattila et al. 2012; analisi /
  miglioramento / espansione / progettazione / ristrutturazione), non deriva niente: report, copertina del DCF e
  una nota solo per analisi senza scambi in corso o progettazione con scambi in corso.
- **R3** (#149): **ogni regola L2 legge una risposta vera o è ritirata, e nessuna CIR sovrascrive un nodo**
  (`_write_unless_set`: le azioni CIR scrivono solo dove il nodo non ha valore). Ritirate CIR-03, CIR-04 e CIR-06
  (trigger `"false"`, chiave `review_note` con il perché); FU-02 = LCA e Q11 "entrambi"; IR-06 = almeno due
  dimensioni e non C2; CIR-08 = Q12 e sociale; CIR-02 e CIR-09 su Q2=B. I-17 è chiuso.
- **R4** (#150): **le "violazioni" L2 escono da ogni vista** (pagina risultato, pannello del ragionamento, report
  .docx, scenari, viste di pubblico). `case.rule_violations` resta diagnostica interna; IR-04 e IR-10 (L3) entrano in
  `applicable_rules` come gli altri obblighi.
- **R5** (#151): **la pagina risultato parte dalla configurazione**: verdetto → "La tua configurazione"
  (`pages/configurationRows.ts`, righe tradotte, testo dei nodi in inglese aprendo la riga; decisione del
  proprietario) → note → cosa fare ora, con gli obblighi per famiglia di regola (IR / CIR / FU / B) → regole di
  settore → dettagli tecnici. Il questionario è in tre parti (lo studio, gli scambi, la descrizione del caso) con
  i passi numerati; il report .docx ha la compilazione delle risposte e il conteggio degli obblighi.
- **R6** (#152, #153): **viste di pubblico e report pubblico mostrano le loro righe della configurazione**
  (`AUDIENCE_ROWS`: industria costi/asset/orizzonte/riferimento, comunità regionalizzazione/sociale/settori,
  autorità costi/riferimento/asserzione/orizzonte/sociale, end-user unità funzionale/asserzione/sociale); deck,
  teoria, speaker track e screenshot riscritti da zero sull'app ricostruita (`docs/presentation/`), §0 di
  `PHASE1_NODE_MAPPING_v2.md` con una riga per ogni PR #142-#150, indice `docs/README.md`.
Rifondazione chiusa il 2026-10-18 (server a `6c5ddc1`, #153). Poi una **revisione complessiva di Fable** su tutte
le PR insieme, con ogni punto verificato facendo girare il motore, ha prodotto quattro PR (#154-#157):
- **#154 Situazione C2 coerente**: un C-LCC di una sola azienda non riceve più prezzi CE Delft né Net Tax Factor
  (`lcc_mc_19` con il ramo C-LCC prima di Q4=D; CIR-05 scrive le due azioni LCC solo fuori dal C-LCC); facilitatore
  e NDA tra partner con un ramo C2 (`lcc_hc_02/03`, ora DERIVED); viste di pubblico senza "PEF: sì" in C2; riga
  dell'asserzione con la revisione del panel per Q4=D; Q2b e Q7b non chieste quando Q9 = rendiconto di un'azienda.
- **#155 DCF allineato**: nuovo identificatore `future_background` nel DSL; SSP/RCP segue l'orizzonte di studio,
  capex e ammortamenti anche Q12; purezza, contaminazione e viaggio di ritorno chiesti sempre (Q6a non decide più
  niente). Il validatore del DCF ha un caso sintetico che opera dal 2028 (nessun paper risponde a Q8).
- **#156 niente LCA dove non è chiesta** (decisione del proprietario): senza ambientale i nodi LCA si spengono come
  quelli di LCC e S-LCA, e non si elencano le regole della Part 2 (sono tutte regole di modellazione LCA). Restano,
  con l'LCC, lo scenario di riferimento e la classificazione dei flussi (`lca_mc_26/27`, `lca_mc_17`: la D4.2 li
  chiede anche all'LCC, L00725 e §6.3; il corpus l'ha mostrato su Catalano 2024) e sempre revisione critica e carta
  metodologica. Casi vecchi: bozza con la vecchia chiave dei beni condivisi convertita (store v3), "Situazione A
  multi-actor" letta come A, uno scenario con una chiave non più ammessa non fa più fallire tutta la richiesta.
- **#157 pulizia**: README pubblici riscritti, testo del DCF consegnato senza "Q1–Q7", note di schema e commenti
  stantii, `_attr` tolto, questo file.
Corpus degli 8 casi a 63 sì / 6 no (le stesse divergenze decise), CP10 12/18, CP11 35/53 (Catalano, studio solo LCC,
perde di proposito i due capitoli della Part 2). Fase B (revisione dei deliverable) ferma sul modulo di errata e sul
responsabile della D4.1 Part 1.

Cronologia sintetica (tutto su `main`):
- Sprint 4 Step 2 (scaffold) chiuso 2026-05-08
- Sprint 4 Step 3 (engine) chiuso: 7 commit + regression suite 12-paper, tutti i moduli phase implementati
- Step 4 (frontend Q1-Q7 + reasoning panel) chiuso
- Step 5 (12 .docx validation reports) chiuso
- 6 round di UX polish + i18n 5 lingue (en/it/fr/de/es)
- Features A-D + Follow-ups E-G (export/report, Q6a 14 settori, scenarios runner, cases CRUD, JSON overrides editor, port change, rich help & rationale)
- Rimozione `backend/app/_legacy/` + superficie engine v2 (PR #34-35)
- DCF Phase 1-4 (PR #36-39): schema engineering, predicate DSL + `dcf_compose` + writer xlsx/docx + API, DataCollectionPage + NetworkDiagram, reporting multi-stakeholder + placeholder scoring + aggregate
- Fase C (PR #40): wizard mode + deployment produzione (`Dockerfile.prod`, `docker-compose.prod.yml`, `docs/DEPLOY.md`)
- Fase D (PR #41): auth JWT + bcrypt, cases ownership-aware (primo utente registrato = admin)
- Visual identity "Data Dashboard" (PR #42, merge 2026-08-29): design token `--dd-*`, AdminShell, libreria `dd/*`, wizard `/welcome`, reader shell + rotte pubbliche `/r/*`, ShareReportModal, slug leggibili dei case

**Lavoro aperto (nessuno bloccante sul codice)**:
- Filtro region reale su `/api/public/region/{code}` (oggi echo del codice)
- i18n: `en.ts` è la source of truth; `de`/`es` indietro di ~50 chiavi sui namespace `reader.*` / `share.*`, `it` di ~20
- Network Builder: completo (persistenza, editor drag-drop, round-trip su xlsx/docx + diagramma reale, guidance in-app con esempio caricabile)
- Pagina admin per la coda scoring CIRCE — bloccata sulla specifica I/O CIRCE (TBD)
- **Deploy pubblico D4.6 (PU): è in piedi** su `biobasedisadvisor.symbaproject.eu` (VPS Contabo, Ubuntu 24.04), in **modalità "in costruzione"**: chi arriva vede una pagina di cortesia (503), il team entra con `?preview=<SYMBA_PREVIEW_TOKEN>` (il token sta nel `.env` del server). DNS creato il 2026-10-12, certificato Let's Encrypt valido fino al 2027-01-10 con rinnovo automatico, backup del DB ogni notte alle 3:30 con copia giornaliera sul Mac Studio. Caddy gira con tre file: `docker compose -f docker-compose.prod.yml -f docker-compose.public.yml -f docker-compose.construction.yml up -d`; per aprire al pubblico, lo stesso comando **senza** il terzo `-f`, dopo aver registrato l'account admin (il primo che si registra diventa admin). La build dell'immagine e il Caddyfile sono stati eseguiti sul server più volte (ultima: 2026-10-18, `main` a #153); sulla macchina di sviluppo il demone Docker non risponde, quindi **l'unico posto dove si scopre se `Dockerfile.prod` regge è il server**: `tsc -b` compila anche i test, e un test che legge un file del backend fuori da `frontend/` rompe la build senza che nulla se ne accorga in locale (è successo due volte: PR #95 e #104). Dettagli operativi e lista dei pendenti: `~/.claude/projects/.../memory/project_deploy_contabo.md`. Non fatti di proposito: rate limiting di login/registrazione, salvataggio anonimo configurabile (`SYMBA_ANON_SAVE`)
- `rerun_saved_cases.py` va eseguito sul server dopo ogni deploy che tocchi il motore (prima senza `--apply` per vedere quanti casi cambiano). Dopo ogni deploy fino al 2026-10-18 (#153) ha riportato 0 casi: il database del server è ancora vuoto
- **Informativa privacy** (`/privacy`): è una bozza con segnaposto per titolare, base giuridica, hosting, log del proxy, backup, contatto e autorità; serve revisione legale. Il footer non rimanda più alle policy del sito principale
- Da guardare a occhio dopo il branding: proporzioni del logo, emblema UE a 300 px, hover/focus, 1201-1320 px in ES/FR su `/welcome`, Safari/Firefox, telefono reale, stampa della pagina risultato
- Decisioni residue dell'audit: `contested` in `lcc_mc_04/08` resta inerte (D4.2 §3.2: è uno stato negoziale per flusso, non Q5=b); `infra.decommissioning_cost.row_condition` nel DCF non è valutato da nessun codice; I-17 chiuso in R3 (2026-10-18); I-18 (anno di Kerdlap) da verificare sul DOI

---

## Documenti autoritative

**NON modificare senza esplicita approvazione**:

- `docs/implementation/SPRINT4_BOOTSTRAP_v2.md` — il piano Sprint 4 (auto-contenuto)
- `docs/implementation/PHASE1_NODE_MAPPING_v2.md` — il design metodologico Phase 1
- `backend/app/schemas/phase1_nodes.json` — 186 nodi atomici
- `backend/app/schemas/cross_method_rules.json` — 4 BLOCK + 54 regole
- `backend/app/schemas/system_fields.json` — 16 system fields
- `backend/app/schemas/computed_fields.json` — 12 computed fields
- `backend/app/schemas/cir_output_fields.json` — 20 cir_output fields
- `backend/app/schemas/dcf_schema.json` — namespace DCF separato (8 sezioni: `costs` aggiunta il 2026-08-30, `flow_classification` il 2026-10-04, entrambe approvate)

I 5 JSON sono **closure ufficiale** post-round-2 (vedi `field_gaps.md`):
- 95 nodi FIELDED + 91 procedural_mandate = 186 (erano 96 + 90 fino al 2026-10-04: `lcc_hc_06` è diventato un puro mandato, vedi audit I-08)
- 0 unknown fields nelle cross-method rules
- Schema engineering CLOSED.

---

## Workflow git

- **Una branch per ogni feature/follow-up** (`feature-X-…`, `followup-X-…`).
- **Mai commit diretto su main**.
- Branch → push → PR → merge.
- Stile commit: `chore(area):`, `feat(area):`, `test(area):`, `docs(area):`.
- Body 1-2 paragrafi, riferimenti a doc autoritative dove applicabile.
- Mai squash silenzioso — un commit = una unità logica.
- Stacked PR ammessi (base = branch precedente). Attenzione: GitHub non cascata sul merge di main — al termine dello stack, retargetare l'ultimo PR aperto direttamente su `main` per flush in un colpo.

## Workflow di sviluppo

- Prima di modificare un file in `backend/app/schemas/` chiedi conferma con un breve diff.
- Test devono sempre passare prima del commit. Baseline corrente (`main` al 2026-10-18, dopo #154-#157): **836 backend (pytest, +1 skipped) + 193 frontend (vitest)**. Il numero sale a ogni PR che aggiunge test: confrontare con `main`, non con questo valore.
- Comando test backend: `cd backend && PYTHONPATH=. python -m pytest tests/ -q` (su Windows: `$env:PYTHONPATH = "."` prima del comando).
- Comando test frontend: `cd frontend && npm test -- --run`.
- Lint frontend: `cd frontend && npm run lint` (eslint).
- Build frontend: `cd frontend && npm run build` (tsc + vite).
- Validation script: `python backend/scripts/validate_phase1_artifacts.py --schema-dir backend/app/schemas --out-dir backend/coordination`
  Atteso: 0 critical / 0 warning / 0 UNKNOWN / status PASS.

---

## Architettura engine (per orientarsi nel codebase)

```
backend/app/
├── schemas/                    5 JSON schema files (data, NOT Python) + sector_overlays.json
├── domain/
│   ├── enums.py               Q0-Q12 answers + derived states (IlcdSituation, LccType, ecc.)
│   ├── models.py              Case, Flow, Site (Pydantic v2 con extra='forbid')
│   └── case_state.py          StudyPhase reference (no FSM, design call 4)
├── engine/
│   ├── loader.py              Carica i 5 JSON in LoadedSchemas
│   ├── pipeline.py            Orchestrator L0→L1→activate→sector rules→L2→L3 + mutation contract
│   ├── l0_compute.py          3 trigger nodes deterministici
│   ├── l1_blocks.py           4 BLOCK cells
│   ├── activate.py            186 nodi, dotted-path → pillar dict, per_flow handling
│   ├── branch_keys.py         grammatica delle chiavi di ramo dei nodi discriminativi
│   ├── answer_phrases.py      frasi composte dalle risposte ({reference_market}, {interaction_scale}, …)
│   ├── sector_rules.py        regole e configurazioni della D4.1 Part 2 per i capitoli toccati
│   ├── l2_validate.py         40 regole (trigger / assertion / actions parsing)
│   └── l3_report.py           IR-04 + IR-10 enforcement + 12 CDP surfacing
│   ├── predicate.py           DSL dei predicati DCF (Phase 2)
│   └── dcf_compose.py         Composizione del Data Collection File
├── auth/
│   ├── security.py            JWT + bcrypt (Fase D)
│   ├── deps.py                get_current_user / get_current_user_optional
│   └── ownership.py           can_view / can_modify su CaseRecord (condiviso cases+scoring)
├── routers/                   health, auth, pipeline, cases, dcf, scoring, public
└── services/                  reports.py (.docx), dcf_excel.py, dcf_docx.py, naming.py (slug)

frontend/src/
├── pages/                     Welcome, Home, Questionnaire, Result, ScenariosResult, CasesList,
│                              DataCollection, StakeholderReport, Aggregate, Login, About, Error
│                              + pages/reader/ (viste pubbliche /r/*)
├── components/                QuestionCard, FlowsEditor, ScenariosEditor, AdvancedEditor,
│                              NetworkDiagram (view), NetworkBuilder + DcfRowFields (editor),
│                              StakeholderView, DcfSectionViewer, …
│                              + admin/ · dd/ (design system) · reader/ (shell pubblica)
├── store/                     caseStore.ts (Zustand + persist) + preferenceStore (ruolo/task/onboarding)
│                              + dcfDataStore (bozza Network Builder, sync su /api/dcf/{id}/data)
├── i18n/locales/              en.ts (source of truth) + it/fr/de/es
├── presets/papers.ts          13 fixture (12 papers + Leiva Escombreras/Frövi)
└── types/api.ts               TS mirror dei DTO Pydantic
```

Tutti i moduli engine sono implementati. Endpoint HTTP: `/api/pipeline/*` (run / report /
run-scenarios), `/api/cases` (CRUD + `/aggregate/breakdown`), `/api/dcf/*`, `/api/scoring/{case_id}`
(GET/PUT/DELETE), `/api/auth/*` (register / login / me), `/api/public/*` (share link reader).
Il modello di autorizzazione è tabellato in `docs/DEPLOY.md` § Authorization model.

---

## Vincoli metodologici (importanti)

- **Schema engineering è CLOSED**. Non inventare nuovi field paths senza approvazione.
- Il validation script è la fonte autoritativa di "cosa è coerente".
- I 24 NEW field paths approvati sono in `field_gaps.md` round 2 closure log.
- I 91 nodi `procedural_mandate` non hanno un valore da settare — sono mandati di pratica metodologica, NON cercare di assegnare loro un field.
- La rule normalization usa Kimi naming verbatim (IR-XX, CIR-XX, FU-XX, B-XX, CDP-XX, block_*) — mai INV-XX o RULE-NN.

---

## Quando fermarsi e chiedere

- Dubbi sul field naming → STOP e chiedi.
- Edge case nei JSON che `field_gaps.md` non copre → STOP e chiedi.
- Discrepanze v1↔v2↔Kimi atomic_nodes → STOP e chiedi.
- Scelte architetturali che richiedono più strade non equivalenti (es. parsing di trigger_condition raw string: regex vs eval-sicuro vs mini-DSL) → STOP, descrivi le opzioni con pro/contro, aspetta decisione.
- Codice che richiede una dipendenza esterna nuova → STOP, motiva la scelta della libreria.

---

## Lavoro deferito noto

- **Scenari di rete** (deciso 2026-08-30, "entrambi in due tempi"): oggi uno scenario può variare solo le risposte del questionario tramite `overrides`, quindi non può esprimere "flusso in discarica vs flusso al partner" — il confronto che un analista cerca quando studia scambi che non avvengono ancora (Q2=B). Fase 1 fatta: l'editor lo dice esplicitamente invece di promettere un confronto che non fa. Fase 2 da progettare: uno scenario come variante della rete disegnata (stessi attori, flussi/distanze/quantità diverse), il che sposta gli scenari dal Case al DCF e richiede di ripensare il runner.

- Monitoring / telemetry non presenti — da aggiungere quando il tool entrerà in uso reale.
- **I nodi di un metodo spento non si attivano** (fix 2026-08-30): `lcc_trig_01` dichiara "q3.eco=false → all LCC nodes deactivated" e `slca_t_01` l'analogo per il sociale, ma l'engine attivava comunque tutti i 61 nodi LCC e 66 SLCA. Ora `activate._method_is_off` salta il metodo e `_write` scarta le scritture nei pilastri spenti (coprendo anche le azioni CIR dell'L2). Conseguenza: il numero di nodi attivati e i mandati del DCF **dipendono da Q3** — l'invariante "almeno 116 nodi DEFAULT" non vale più ed è stato sostituito nei test da asserzioni method-aware.
- **Le regole L2 sono obblighi metodologici da documentare, non errori** (decisione 2026-08-30, completata in R4 il 2026-10-18). `case.applicable_rules` è emesso sul *trigger* ed è l'unica cosa che app, report e viste mostrano; `case.rule_violations` (assertion fallita) è diagnostica interna e non è affidabile: le assertion confrontano valori che l'engine scrive come prosa, e 13 sono stub `True`. Renderle controlli veri richiede un posto dove l'analista dichiari quelle scelte — non esiste oggi.
- **I-17 chiuso in R3** (2026-10-18): nessuna regola L2 legge più attributi che `Case` non ha. IR-13, B-06 e CIR-08 leggono Q12 (`dedicated_shared_assets`), FU-02 legge Q11 (`comparison_goal`), CIR-03, CIR-04 e CIR-06 sono ritirate perché i nodi coprono già ogni caso (trasporto esplicito, percolazione per ogni rete non bilaterale, categorie di frontiera in ogni studio). Restano lette da `case.advanced` solo `asset_lifetime` (ripiego di Q8), `future_background_threshold_years` e `slca_framework_override`.
- **Flow classification è solo nel DCF** (audit I-09, 2026-10-04): i test giuridici ed economici per flusso (Freedom-to-Act, End-of-Waste, classe di sottoprodotto, evitabilità, punto dello zero-burden) sono campi della sezione `flow_classification`, giudizi dell'analista. La pipeline non legge i dati del DCF, quindi nessun nodo li consuma e IR-15/CDP-05 restano non verificati. Dal 2026-10-15 (#118) il test Freedom-to-Act si può dare anche per flusso nella tabella Q5 (`Flow.sellable_elsewhere`, facoltativo): il motore lo confronta con Q5 e lascia una nota se non concordano (mai su Q5=d, D4.1 L00996), e il valore inizializza una volta sola `classif.independent_market` nel DCF. Per Q5=e `lcc_hc_12` non scatta e `lcc_hc_13` scrive un valore proprio (dal 2026-10-15): i flussi aggregati non possono avere costo zero finché ognuno non è classificato evitabile/inevitabile (D4.2 §6.3, L00751).
- **Ingressi che nessuna domanda imposta** (revisione 2026-10-18): `Case.study_phase` (letto da IR-17) e `Case.sites`
  restano ai default; `infra.decommissioning_cost.row_condition` e le altre `row_condition` del DCF non sono valutate
  da nessun codice. Il campo API `by_q7_geographic_scope` dell'aggregato ha ancora il vecchio nome (l'etichetta è
  giusta), e `activated_by.kind = 'case_sector'` compare solo nei risultati salvati prima del 2026-10-18.
- 13 assertion "NLP-style" in `l2_validate.py` sono stub `True` con `# TODO(nlp-assertion)` (IR-05/11/17/20, FU-03/05, B-02/07, …) + 2 `TODO(symbolic-action)`. Il gap è metodologicamente noto, non un bug.
- Nessuna migrazione Alembic: le migrazioni sono script one-shot in `backend/scripts/` (es. `migrate_add_case_slug.py`, idempotente, da eseguire dopo il deploy).
- Bundle frontend ~674 kB senza code-splitting (warning Vite, non bloccante).
- `coordination/current-state/_CURRENT_STATE.md` è storico (fermo a Sprint 0/1): lo stato corrente è **questo file**.
- **Divergenze dai deliverable tenute di proposito** (decisione 2026-10-04, dalla verifica app-vs-deliverable; versione di riferimento: REVISED del 30/06/2026):
  - **Situazione C2 → "C-LCC only"** è una scelta dichiarata di T4.6, non derivata da D4.2 (fino al 2026-10-15 seguiva Q1=D; ora segue Q9 e la situazione derivata). BLOCK 1 non può mai scattare, perché in C2 il tipo è già forzato a company-only; il suo messaggio dice che è una scelta di progetto, non una regola ILCD.
  - **Q4=D** attiva in CIR-05 i prezzi CE Delft e l'allocazione NTF, che D4.2 lega all'S-LCC (Q1=C). Regola Kimi tenuta; impatto basso.
  - **Pedigree e Monte Carlo** restano condizionati dalle risposte (Q4, TRL), mentre D4.1/D4.2 li dicono "sempre". Si segue il deliverable dove dice "senza eccezioni" (i tre strati di reporting, `lcc_hc_29`) e dove il testo non lascia scelta: **trasporto esplicito e break-even della distanza valgono ora per ogni Q7** (`lca_hc_21`, `lcc_hc_06`, D4.1 §13.3.1 e D4.2 §4.3; Q7 non ha soglie di distanza).
  - **Domande nuove oltre le sette originali** (decisione del proprietario, 2026-10-04; dal 2026-10-18 il questionario è ricostruito su Q0-Q12 e Q1/Q6a descrivono soltanto, vedi lo stato sopra: il testo che segue è la storia di Q8-Q10; senza risposta il motore si comporta esattamente come prima, verificato con lo snapshot): **Q8** vita tecnica degli asset (`asset_lifetime_years`, sopra 15 anni attiva il background futuro), **Q9** decisione e scala (`decision_context`: none/micro/structural/corporate_report, deriva la situazione ILCD secondo D4.1 Tabella 1), **Q10** scopo di policy o pianificazione (`policy_objective`, aggiunge l'S-LCC secondo D4.2 §2.3). Una risposta esplicita vince su Q1, tranne Q1=D che resta C2 / "C-LCC only"; le contraddizioni non bloccano e non cambiano nulla in silenzio: finiscono in `Case.warnings` (note nella pagina risultato). I nodi che leggono la situazione o il tipo LCC leggono lo stato derivato (`ilcd=`, `lcc_type=` nelle chiavi di ramo), quelli sul soggetto dello studio restano su Q1. Per flusso (natura fisica, evitabilità, End-of-Waste) restano campi del DCF, non domande; Freedom-to-Act è diventato anche una risposta facoltativa per flusso (#118). **Aggiornamento 2026-10-14/15**: Q8 è ora in tre parti (anno di esercizio, periodo di analisi, vita degli asset: un solo orizzonte per LCA e LCC) e **Q9 è obbligatoria e decide la situazione ILCD**, anche contro Q1=D (#114); il "C-LCC only" e il BLOCK C2 + E-LCC seguono la Situazione C2, non più Q1=D.

---

## Stile di lavoro

- Onestà sul livello di confidenza: se non sei sicuro di una scelta metodologica, dillo invece di tirare a indovinare.
- Niente sicofantia: se Mirko propone un approccio che ha problemi tecnici, segnalali prima di procedere.
- Conciso. Niente "Great question!" né preamboli decorativi.
- Quando proponi codice esteso, mostra prima un piano breve (file da toccare, struttura), aspetta OK, poi scrivi il codice.
