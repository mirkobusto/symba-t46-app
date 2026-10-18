# SYMBA T4.6 — Dalle linee guida D4.1/D4.2 alla configurazione di uno studio di simbiosi industriale

> Documento teorico (sorgente del deck e delle note del relatore).
> Versione: 2026-10-18, dopo la rifondazione (R1-R5). Sostituisce per intero la versione del 2026-06-11.
> Fonti nel codice: `backend/app/domain/enums.py`, `models.py`, `backend/app/engine/`, `backend/app/schemas/`,
> `frontend/src/i18n/locales/en.ts`, `frontend/src/pages/configurationRows.ts`.

---

## 1. Che cosa è, che cosa non è

SYMBA T4.6 è un'applicazione web del progetto Horizon Europe SYMBA (GA 101135562, task T4.6,
deliverable D4.6). Prende un caso di simbiosi industriale (IS) e restituisce la **configurazione
metodologica** che le linee guida del progetto richiedono per quel caso: D4.1 (LCA, Part 1 generale e
Part 2 per settore), D4.2 (LCC), D4.3 (S-LCA). Restituisce anche i dati da raccogliere.

Che cosa **non** fa:

- **non calcola numeri** LCA, LCC o S-LCA: niente kg CO2eq, niente VAN, niente indicatori sociali;
- lo scoring quantitativo arriva dai partner (CIRCE e gli altri partner di T4.1-T4.3) e il tool lo
  integra nel reporting; la specifica di input/output dello scoring CIRCE è **ancora da definire**;
- non sostituisce il giudizio dell'analista: dice che cosa va deciso e documentato, e perché.

---

## 2. Perché è stato rifatto (2026-10-18)

Fino al 18 ottobre 2026 il motore instradava ogni caso su cinque "pathway" IS-01…IS-05, ricavati da una matrice
Q1×Q2. Era un costrutto di T4.6: D4.1 e D4.2 non lo conoscono. La revisione dei deliverable sul testo
FINAL v2 (ottobre 2026) e un test del questionario su casi reali hanno mostrato che le scelte di
modellazione dipendono da altre variabili: la decisione che lo studio sostiene e la scala delle sue
conseguenze (D4.1 Tabella 1), se gli scambi avvengono già (D4.1 §11.1), l'orizzonte di studio (D4.2 §11),
la prospettiva del decisore (D4.2 §2.2-2.3), che cosa si confronta (D4.1 Part 2).

La rifondazione ha quindi ricostruito il questionario **sulle variabili che i deliverable usano**:

- i pathway IS-01…IS-05 sono stati tolti; i casi salvati si caricano lo stesso, senza quel campo;
- la "Situazione A multi-actor" non è più prodotta: D4.1 Tabella 1 conosce solo A, B e C;
- Q2 ha due risposte invece di quattro (le vecchie C e D si leggono come "non ancora");
- Q7 ha tre risposte invece di quattro (la vecchia D si legge come C);
- le regole cross-method non sono più presentate come "violazioni" ma come obblighi da documentare;
- nessuna regola sovrascrive più il testo di un nodo; tre regole che leggevano attributi inesistenti
  sono state ritirate, con il motivo scritto nello schema.

---

## 3. Il questionario in tre parti

Le domande sono numerate sullo schermo nell'ordine delle tre parti; i codici (Q0…Q12) restano quelli
storici, perché compaiono nei casi salvati, nei test e negli schemi. Obbligatorie: Q3, Q9, Q1 e, con la
dimensione economica, Q10. Le altre sono facoltative: senza risposta il motore applica la regola generale
del deliverable e lo dice.

### 3.1 Lo studio

| Codice | Domanda | Che cosa decide | Fonte |
|---|---|---|---|
| Q0 | Che tipo di studio è: analisi, miglioramento, espansione, progettazione, ristrutturazione | Nulla: entra nel goal, nel report e nel DCF; il motore segnala le risposte che non tornano (es. "analisi" con scambi non ancora attivi) | D4.1 §4.3.2, da Mattila et al. (2012) |
| Q1 | Che cosa si analizza: scambio, parco, programma, azienda, monitoraggio | Descrive la forma della rete e il suo confine; alimenta solo tre nodi di confine. Non decide la situazione ILCD | — |
| Q3 | Dimensioni: ambientale, economica, sociale | Accende LCA, LCC, S-LCA; i nodi di un metodo spento non si attivano | — |
| Q9 | A che cosa serve lo studio e fin dove arrivano i suoi effetti | La situazione ILCD: micro → A; strutturale → B solo con lo screening di mercato documentato (circa 1 % della nuova capacità), altrimenti A con B come sensitività; documentare una rete → C1; rendiconto stretto di una sola azienda → C2 | D4.1 Tabella 1, §4.3.4, §11.3.1 |
| Q2 | Gli scambi che lo studio misura avvengono già? | Sì → HNSRS, scenario ipotetico senza simbiosi: che cosa farebbe oggi ogni azienda senza i collegamenti; non ancora → CNSRS, lo scenario senza simbiosi sull'orizzonte dello studio. Domanda di seguito: rete attiva da molti anni → l'HNSRS si costruisce come controfattuale moderno | D4.1 §11.1, §11.2.2 |
| Q8 | Orizzonte di studio: anno di esercizio, periodo di analisi, vita tecnica degli asset | Un solo orizzonte per LCA e LCC; background futuro (scenari SSP/RCP) se l'anno è futuro, se il TRL è sotto 7, o se periodo o vita superano 15 anni (soglia modificabile) | D4.2 §11, D4.1 §9.3.5, §12.3.2 |
| Q6b | TRL della tecnologia chiave | Sotto TRL 7: background futuro e tecniche di scale-up | D4.1 §9.3.5 |
| Q10 | Lo studio serve un obiettivo pubblico o un decisore pubblico? | Con l'LCC è obbligatoria: sì aggiunge l'LCC societario (S-LCC) | D4.2 §2.2-2.3 |
| Q4 | Uso dei risultati (scelta multipla) | C, affermazione comparativa pubblica di superiorità o equivalenza → revisione critica con panel, niente pesatura; D, allineamento alle politiche UE → PEF, Circular Footprint Formula, EF 3.1 | ISO 14044; PEF |
| Q11 | Che cosa confronta lo studio | Trattamento di un rifiuto → unità funzionale input-based; sostituzione di prodotto → output-based; entrambi → sistema di unità funzionali | D4.1 Part 2 §4.3, §6.3, §8.3 |

### 3.2 Gli scambi

| Codice | Domanda | Che cosa decide | Fonte |
|---|---|---|---|
| Q5 | Per ogni flusso: chi paga chi | a: chi cede paga (rifiuto, zero-burden dal punto in cui il residuo raggiunge valore non negativo); b: gratuito o ambiguo; c: chi riceve paga (co-prodotto, sostituzione con rapporto corretto per qualità); d: interdipendente (co-prodotto, mai zero-burden); e: aggregato o black-box (limite della fonte, non scelta) | D4.1 §8.3.1-§8.3.3 |
| Q5, facoltativi per flusso | Vendibile ad altri a prezzo positivo? Settore della Part 2. Configurazione tipica | Test Freedom-to-Act confrontato con Q5 (solo nota); capitolo della Part 2; prodotto convenzionale sostituito | D4.1 §8.3.3; Part 2 §4.1-§8.1 |
| Q7 | Quanto sono concentrate le interazioni chiave: un sito, una regione, più regioni | La regionalizzazione della caratterizzazione LCIA. Non il trasporto: il trasporto è esplicito per ogni scambio, qualunque sia la risposta | D4.1 §12.2.3, §12.3.3, §12.3.1 |
| Q7b | Mercato di riferimento: regione e ambito (nazionale, sub-nazionale, continentale) | Da dove verrebbero i prodotti sostituiti; continentale solo per merci scambiate a livello globale | D4.1 §11.3.1 |
| Q12 | Servono nuovi asset condivisi dedicati (condotte, impianti, stoccaggi)? | CAPEX e OPEX nel breakdown dei costi, ripartiti tra i partner che ne beneficiano; beni capitali inclusi nell'LCA | D4.2 §4.2, D4.1 §6.3.3 |

### 3.3 Descrizione del caso

| Codice | Domanda | Che cosa decide | Fonte |
|---|---|---|---|
| Q6a | Settore principale dell'azienda | Solo descrizione e qualche campo del DCF. I capitoli della Part 2 seguono i flussi, non l'azienda; una nota segnala un settore della Part 2 che nessun flusso dichiara | D4.1 Part 2 |

Fuori dalle tre parti restano gli scenari alternativi (ogni studio può confrontare alternative con la sua
baseline, D4.1 §4.3.3) e gli override avanzati per esperti.

---

## 4. La configurazione derivata

Dalle risposte il primo strato del motore (L0) ricava tre stati:

- **Situazione ILCD** (A, B, C1, C2) da Q9; Q1 serve solo per i casi salvati prima di Q9, con una nota.
- **Tipo di LCC**, da Q3, dalla situazione e da Q10:
  - con LCA: C-LCC per partner + E-LCC di rete (`C+E`); con obiettivo pubblico + S-LCC (`C+E+S`);
  - senza LCA non c'è E-LCC (D4.2 §4.1): C-LCC + consolidamento di rete (`C+N`, `C+N+S`);
  - rendiconto stretto di una sola azienda (C2): solo C-LCC. È una **scelta dichiarata di T4.6**, non
    una regola di D4.2.
- **Stato S-LCA** (attivo / spento) da Q3.

La pagina risultato apre con questi stati e con le righe di **"La tua configurazione"**, ciascuna con il
suo "perché" e, su richiesta, il testo del motore in inglese con la sezione del deliverable:

| Riga | Valori possibili |
|---|---|
| Tipo di studio | Q0, se data |
| Costi | tipo di LCC, con il motivo (C2, niente LCA, Q10) |
| Valutazione sociale | attiva o non inclusa |
| Orizzonte di studio | background attuale o futuro (SSP/RCP), con la causa: anno, TRL, periodo, vita degli asset |
| Scenario di riferimento | HNSRS, controfattuale moderno o CNSRS, con il mercato di Q7b; in C2 niente crediti: allocazione, nessuna sostituzione |
| Unità funzionale | funzionale (default Part 1), input-based, output-based, sistema di unità |
| Impatti locali | fattori sito-specifici, regionali o per territorio di emissione |
| Regole di settore | i capitoli della Part 2 toccati, con i flussi che li attivano |
| Dichiarazione pubblica | con Q4 = C, revisione critica di un panel di almeno tre esperti indipendenti e niente pesatura; altrimenti nessuna |
| Beni condivisi | CAPEX e OPEX ripartiti tra i partner che li usano |

---

## 5. Come le risposte arrivano ai nodi

Il motore è schema-driven: la metodologia sta in file JSON versionati, non nel codice. Il nucleo sono
**186 nodi atomici** estratti da D4.1, D4.2 e D4.3 (LCA 59, LCC 61, S-LCA 66): 95 hanno un valore da
scrivere, 91 sono mandati procedurali (una pratica da seguire, senza valore).

La pipeline è sempre la stessa:

```
L0 stati derivati → L1 blocchi → attivazione dei nodi → regole di settore Part 2 → L2 regole cross-method → L3 punti di decisione
```

- **L1, blocchi** (4): C2 con E-LCC, S-LCA "assoluta" forzata da override, nessuna dimensione in Q3,
  Q1=A con tutti i flussi aggregati. Se uno scatta, la pipeline si ferma e lo dice.
- **Chiavi di ramo.** Un nodo discriminativo ha un valore per ramo: `q2=A`, `q3.eco=true`, `ilcd=C2`,
  `lcc_type=C+N`, `comparison_goal=waste_treatment`, `shared_assets=true`, `long_standing=true`. Vince
  il primo ramo che corrisponde. Una chiave che il motore non sa leggere è un errore, mai un ramo saltato.
- **Frasi che dipendono dalla risposta.** Dove una risposta è ortogonale ai rami del nodo, il valore
  contiene un segnaposto (`{reference_market}`, `{affected_market}`, `{interaction_scale}`,
  `{shared_assets}`) che il motore riempie con una frase costruita da Q7b, Q7 o Q12. Senza risposta, la
  frase enuncia la regola in termini generali.
- **Note** (`Case.warnings`). Quando due risposte si contraddicono (Q1 programma e Q9 micro; Q9
  strutturale senza screening; Q1 azienda e Q9 non rendiconto; Q0 analisi e Q2 non ancora) il motore lo
  scrive. Le note non bloccano e non cambiano mai una risposta in silenzio.

---

## 6. Le regole di settore della D4.1 Part 2

`sector_overlays.json` raccoglie i cinque capitoli della Part 2, con le categorie LCIA di §9:

| Capitolo | Regole nello schema | Configurazioni tipiche |
|---|---|---|
| §4 Agri-Food and Biorefineries | 13 | 5 |
| §5 Plastics and Packaging | 13 | 5 |
| §6 Wastewater and Biofactories | 12 | 6 |
| §7 Textile and Technical Textiles | 13 | 5 |
| §8 Waste Valorisation | 13 | 5 |
| **Totale** | **64** | **26** |

Un caso mostra di solito meno regole di quelle nello schema: sono filtrate sulle risposte.

Un capitolo si applica quando un flusso lo dichiara (settore o configurazione). Le regole arrivano come
mandati da documentare, filtrate sulle risposte, perché la Part 2 non allenti mai la Part 1: niente
sostituzione in C2, niente background "Situazione A" in B, scale-up solo sotto TRL 7. La configurazione
tipica nomina il prodotto convenzionale che il flusso sostituisce.

---

## 7. Regole cross-method: obblighi, non violazioni

Lo schema delle regole ha 58 voci: 4 blocchi, 20 regole di integrazione (IR), 10 condizionali (CIR),
5 sull'unità funzionale (FU), 7 sui confini (B), 12 punti di decisione critici (CDP).

- Le 40 regole di L2 (18 IR, 10 CIR, 5 FU, 7 B) scattano sulle risposte; IR-04 e IR-10 si applicano a L3.
  Quando una regola scatta, entra tra gli **obblighi** che il caso deve documentare, raggruppati per
  famiglia (IR, CIR, FU, B): la pagina risultato ne dà il conto, il Data Collection File li elenca con
  quello che ha attivato ciascuno.
- Non sono mostrate come errori: le asserzioni confrontano testo scritto dal motore e non possono
  verificare che cosa l'analista ha fatto fuori dal tool.
- Nessuna regola sovrascrive il testo di un nodo.
- Ritirate, con il motivo nello schema: CIR-03 (trasporto esplicito già per ogni scambio), CIR-04
  (percolazione già per ogni rete non bilaterale), CIR-06 (categorie di frontiera già chieste in ogni
  studio).
- I 12 **CDP** descrivono tensioni tra metodi e come si risolvono; compaiono solo quando tutti i metodi
  coinvolti sono attivi.

---

## 8. Che cosa produce

- **Pagina risultato**: situazione ILCD, "La tua configurazione", note sulle risposte, "Cosa fare adesso"
  (punti di decisione da risolvere, conto degli obblighi per famiglia), regole di settore per capitolo.
- **Data Collection File** (xlsx e docx) calibrato sulla configurazione, con il Network Builder per
  disegnare attori e flussi; la classificazione giuridica ed economica dei flussi (End-of-Waste,
  evitabilità, punto dello zero-burden) è una sezione del DCF.
- **Report del caso** in .docx.
- **Quattro viste di pubblico**: industria, comunità locale, autorità, utente finale; link di
  condivisione pubblici in sola lettura.
- **Cinque lingue**: inglese, italiano, francese, tedesco, spagnolo.

---

## 9. Validazione su casi reali

Otto casi reali del corpus bibliografico, confrontati con quello che il tool configura:

- **69 punti di scelta** a livello di studio: **63 concordano, 6 differiscono**. Tutte e sei le
  differenze sono divergenze documentate e decise: orizzonte di studio unico (3 casi), regola
  sull'affermazione comparativa pubblica, un'unità funzionale ambigua in un articolo, un artefatto dello
  script di verifica.
- **Capitolo della Part 2 per flusso**: 37 su 53.
- Test automatici: **826 backend + 185 frontend**.

---

## 10. Stato e punti aperti

- **Deploy**: `biobasedisadvisor.symbaproject.eu`, oggi "in costruzione" (pagina di cortesia, accesso del
  team in anteprima).
- **Specifica I/O dello scoring CIRCE**: da definire; finché manca, la pagina admin per la coda di
  scoring resta ferma.
- **Apertura al pubblico**: da decidere; richiede prima la registrazione dell'account admin.
  L'informativa privacy è una bozza che attende revisione legale.
- **Revisione di D4.1/D4.2** in corso: i testi dei nodi seguono la numerazione FINAL v2 e andranno
  riallineati alla versione finale.

---

## 11. Glossario

- **Situazioni ILCD** (D4.1 Tabella 1): **A**, supporto a decisioni con conseguenze limitate agli
  impianti coinvolti; **B**, decisioni con conseguenze strutturali sul mercato (da dimostrare); **C1**,
  documentazione di un sistema esistente con le sue interazioni; **C2**, rendiconto stretto di una sola
  azienda, con allocazione e senza crediti.
- **HNSRS / CNSRS** (D4.1 §11.1): scenario di riferimento senza simbiosi. HNSRS (*Hypothetical*), per
  scambi già attivi: che cosa farebbe oggi ogni azienda senza i collegamenti. CNSRS (*Current*), per scambi
  non ancora attivi: lo scenario senza simbiosi sull'orizzonte dello studio.
- **C-LCC / E-LCC / S-LCC** (D4.2): LCC convenzionale per azienda; LCC ambientale di rete, allineato
  all'LCA; LCC societario, con esternalità monetizzate e tasso di sconto sociale.
- **CFF**: Circular Footprint Formula del metodo PEF, per riciclo e recupero.
- **CDP**: punto di decisione critico, una tensione tra metodi che l'analista deve risolvere e motivare.
