# ADR-005 — Matrice Q1×Q2 → PathwayId: opzione γ

**Status**: accepted (2026-05-09)
**Owner**: Mirko Busto + Architect chat (Claude Opus 4.7)
**Related**: SPRINT4_BOOTSTRAP_v2.md §3 §8; SYMBA_T46_Validation_WorkingDoc_v1.md §3.3; phase3_pathway_space.md §3.2; IS_Decision_Engine_UNIFIED.md §3.3.2; commit `feat(engine): implement pathway derivation Q1×Q2 → IS-01..IS-05`

---

## Context

Lo schema dei 7 user-facing questions (Sprint 4 v3) dichiara in `MINIMAL_QUESTION_SET_PROPOSAL.md §7 punto 1` che "Q1 + Q2 generano un pathway_id deterministicamente", con Q1 a 5 valori (A=specific exchange, B=eco-park, C=policy, D=corporate, E=monitoring) e Q2 a 4 valori (A=existing, B=construction, C=design, D=baseline+alternatives). La regola completa per le 20 celle non è però mai stata esplicitata.

I tre deliverable autoritativi del progetto — D4.1 (LCA), D4.2 (LCC), D4.3 (S-LCA) — **non enumerano i pathway IS-01..IS-05** né la matrice di derivazione. Questi pathway sono un costrutto introdotto a valle in `IS_Decision_Engine_UNIFIED.md §3.3.2` e replicato in `phase3_pathway_space.md §3.2`.

L'unica fonte parziale è `SYMBA_T46_Validation_WorkingDoc_v1.md §3.3`, che propone 6 righe ambigue:
- A or B → A → IS-01
- A or B → D → IS-01 (extended)
- C → any → IS-02
- D → any → IS-03
- C or any → C → IS-04
- E or A/B → A (monitoring) → IS-05

Inventariando le 20 celle, 12 sono univocamente determinate dalle 6 righe; 8 sono ambigue, non coperte, o in collisione esplicita ((C,C), (D,C), (A,C), (B,C), (E,B), (E,C), (E,D), (A,B), (B,B)).

Lo Sprint 4 Step 3 commit 1 introduce `backend/app/engine/pathway.py`, che richiede la matrice come funzione pura `derive(Q1, Q2) → PathwayId`. Una decisione di principio è quindi necessaria prima di implementare.

## Decision

**Adottare la matrice "opzione γ"**: Q1 ha precedenza assoluta tranne nel caso Q1∈{A,B} ∧ Q2=C, che attiva IS-04.

|         | Q2=A   | Q2=B   | Q2=C   | Q2=D   |
|---------|--------|--------|--------|--------|
| **Q1=A** | IS-01 | IS-01 | IS-04 | IS-01 |
| **Q1=B** | IS-01 | IS-01 | IS-04 | IS-01 |
| **Q1=C** | IS-02 | IS-02 | IS-02 | IS-02 |
| **Q1=D** | IS-03 | IS-03 | IS-03 | IS-03 |
| **Q1=E** | IS-05 | IS-05 | IS-05 | IS-05 |

Regola in prosa:
- Q1=C → IS-02 (sempre)
- Q1=D → IS-03 (sempre)
- Q1=E → IS-05 (sempre; cella E×C è permessa con warning, non bloccata)
- Q1∈{A,B} ∧ Q2=C → IS-04
- Q1∈{A,B} ∧ Q2∈{A,B,D} → IS-01

**Annotazione "IS-01 extended"**: catturata come flag booleano separato `case.is_01_extended`, vero se e solo se `pathway_id == IS-01 ∧ q2 == D`. Non è un valore distinto di `PathwayId`.

**Firma di derivazione**: `derive(case, schemas) → case` con dipendenza solo da Q1 e Q2. Q6b (TRL band) non entra nella firma. La configurazione "ex-ante con scale-up" che caratterizzava IS-04 nei documenti Kimi è già attivata a livello di nodo da CIR-07 (Q6b≤TRL7), CIR-09 (Q6b≤TRL7 ∧ Q2∈{C,D}) e MC-21 (futurised background), indipendentemente dal pathway scelto. La promessa "Q1+Q2 deterministicamente" è preservata.

## Alternatives considered

**(α) Q1 ha precedenza assoluta · 4 pathway · IS-04 sparisce.** Pathway = funzione di Q1 solo. IS-04 rimosso dall'enum, sostituito da flag interni (`scale_up_active`, `futurised_background`) già attivati dai CIR. Pro: massima onestà metodologica (i deliverable non riconoscono "design-only" come decision context distinto). Contro: rompe la documentazione esistente che enumera 5 pathway (UNIFIED, phase3, BOOTSTRAP, STRESS_TEST); richiede refactor di doc che potrebbero essere stati comunicati a supervisor.

**(β) Q2=C forza IS-04 indipendentemente da Q1.** Pro: ortogonalità inversa Q2>Q1 implementabile. Contro: produce celle metodologicamente assurde come (D,C)→IS-04 (corporate ESG report su sistema in progettazione). Contraddice la riga "D → any → IS-03" del WorkingDoc. Nessun argomento positivo identificato.

**(γ) IS-04 sopravvive solo per Q1∈{A,B}.** *Scelta adottata.* Pro: mantiene 5 pathway nominalmente, risolve le celle ambigue del WorkingDoc per induzione, copre il caso Zhu (unico testimone empirico di IS-04 nei 12 paper benchmark, con Q1=A e Q2=C), mantiene la firma `derive(Q1, Q2)`, dà valore comunicativo distinto al frontend ("Emerging IS Network — ex-ante design"). Contro: non-ortogonalità Q1/Q2 controllata (regola condizionale anziché prodotto cartesiano puro); cella E×C resta semanticamente strana (monitoring di un sistema in progettazione) e va gestita come warning.

**(δ) IS-04 nell'enum ma `derive` non lo restituisce mai (deprecato silenzioso).** Pro: zero refactor doc esistente. Contro: codice morto attira regressioni; un valore enum mai prodotto dalla funzione di derivazione confonde reviewer e attira branch non testati; ipocrisia metodologica documentale.

## Consequences

### Positive
- Implementazione concreta in 5 if/elif (vedi `backend/app/engine/pathway.py`); 27 test unitari coprono tutte le 20 celle, il flag `is_01_extended`, l'invalid-input handling e il contratto di mutazione.
- Compatibilità con i 12-paper validation reports futuri: Zhu (Q1=A, Q2=C, TRL variabile) → IS-04; Wiktor (Q1=B, Q2=D) → IS-01 con `is_01_extended=True` (coerente con WorkingDoc §3.3 mapping table riga 6, contro la classificazione "IS-04" che appare in `STRESS_TEST_6_CASI.md §D` — quest'ultima è da considerarsi superata).
- Promessa "Q1+Q2 deterministicamente" di `MINIMAL_QUESTION_SET §7 punto 1` mantenuta.
- Documentazione esistente nominalmente ancora valida (5 pathway IS-01..IS-05).

### Negative / Risks
- **Cella E×C** è permessa ma semanticamente fragile (monitoring di un sistema in progettazione). La gestione attuale è un warning soft, non un blocco. Una L1 [BLOCK] cell potrebbe essere più rigorosa; rinviato a Sprint 4 Step 3 commit successivi se emerge come problema.
- **Non-ortogonalità Q1/Q2 controllata**: la regola "Q2=C → IS-04 ma solo se Q1∈{A,B}" non si esprime come prodotto cartesiano puro. Ogni futura modifica della matrice deve tener conto di questo caso speciale.
- **STRESS_TEST_6_CASI.md §D contiene un'incoerenza interna** rispetto al WorkingDoc §3.3 sulla classificazione di Wiktor (IS-04 vs IS-01 extended). Questo ADR adotta la classificazione del WorkingDoc §3.3 mapping table. Lo `STRESS_TEST` non viene corretto in questo commit ma andrà allineato quando saranno generati i 12 validation reports.
- **IS-04 ha base empirica debole**: 1/12 paper benchmark (Zhu, con etichetta "depending on scenario"). Se in futuro pilot reali non producono casi IS-04, valutare migrazione a opzione α in un ADR successivo. La sostituzione sarebbe non-breaking per i pathway IS-01/02/03/05.

### Implementation
- File toccati nel commit di riferimento: `backend/app/engine/pathway.py` (impl), `backend/tests/test_pathway.py` (27 test, 1 skip), `backend/app/domain/models.py` (campo `is_01_extended: bool = False` aggiunto a `Case`).
- Nessuna modifica ai JSON schema (`backend/app/data/*.json`), ai CIR rules, all'L1/L2 logic, al frontend.
- Suite backend: 77 → 104 passing, 1 skipped (placeholder 12-paper benchmark), 0 regressioni. Ruff clean sui file nuovi.

### Documentation actions queued (separate commits/PR)
1. Aggiornare `_CURRENT_STATE.md` § ADR cumulativi: aggiungere ADR-005.
2. Aggiungere nota in `MASTER_PLAN.md` §3 che rimanda a questo ADR per la matrice.
3. Quando i 12 validation reports verranno generati, applicare la classificazione γ a Zhu (IS-04) e Wiktor (IS-01 + `is_01_extended`), rendendo obsoleta la riga "Wiktor IS-04" di `STRESS_TEST_6_CASI.md §D`.
4. Quando la SPRINT4_BOOTSTRAP arriverà a v3, includere la matrice γ esplicita in §3 invece del solo riferimento a `MINIMAL_QUESTION_SET`.

### Reversibility
Reversibile a costo basso fintanto che IS-04 non è citato in deliverable esterni o paper sottomessi. Migrazione γ→α in futuro: rimuovere `IS_04` dall'enum `PathwayId`, rimappare le celle (A,C) e (B,C) a IS-01 con flag `case.scale_up_active=True` (già impostabile via CIR-07). I test esistenti vanno aggiornati su 2 celle.
