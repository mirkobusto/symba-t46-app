# Stress-test del set di 6 domande su 6 casi reali

**Obiettivo**: per ognuno dei 6 paper IS-LCA/LCC del documento di schede tecniche, simulo le risposte di un utente non-esperto alle 6 domande proposte (Q1..Q6 + Q7 condizionale) e verifico se il pathway che il motore genererebbe coincide con quello che gli autori hanno effettivamente applicato. Lo scopo è far emergere i **gap concreti**: domande che non coprono il caso, opzioni che mancano, casi che cadono tra due opzioni, configurazioni reali che il motore non sa rappresentare.

**I 6 casi in una riga**:

| # | Paper | Caso | Tipo metodologico |
|---|---|---|---|
| 1 | Sokka 2011 | Kymenlaakso forest IES (cartiera + CHP + CaCO₃ + ClO₂ + WWTP + città) | LCA only, attribuzionale, system expansion, ReCiPe FI-adapted, ex-post |
| 2 | Hashimoto 2010 | Kawasaki Eco-town cement (D.C. Cement + JFE Steel + paper recycler + WWTP) | LCCO₂ (solo CO₂), 4 scenari geographic spread, ex-post |
| 3 | Daddi 2017 | Cluster concerie Santa Croce sull'Arno (PMI multi-attore) | LCA, ILCD, system expansion, ex-post + 2 futuri, allineato a PCR EPD |
| 4 | Paulu 2022 | Gestione rifiuti Cechia (CCP + C&DW) | LCA scala nazionale, EF method (PEF), policy-level, scenario optimization |
| 5 | Arce Bastias 2023 | Madera Plástica Mendoza (rete 3 entità) | LCA + nuovo indicatore SPI; 3 metodi di allocazione tra entità testati |
| 6 | Wiktor 2018 | Fango depurazione Malmö (VA Syd + Sysav + Norcarb) | LCA + LCC, **ex-ante**, 13 scenari combinatori, marginal electricity, 30y horizon |

---

## Caso 1 — Sokka 2011 Kymenlaakso

### Simulazione risposte

| Q | Risposta | Note |
|---|---|---|
| Q1 (cosa analizzi?) | **B** (eco-park multi-attore) | 6+ attori in interazione spontanea dal 2005 |
| Q2 (fase?) | **A** (esiste e opera) | Operativo dal 2005, dati primari + database VAHTI Finlandia |
| Q3 (aspetti?) | **A** (solo ambientale) | Paper è LCA-only |
| Q4 (uso report?) | **A o B** (interno o comunicazione esterna no-claim) | Paper accademico, non public comparative assertion ISO |
| Q5 (natura flussi) | Tipicamente **(a) gate fee** o **(b) gratuito** per la maggior parte (residui legno, fango WWTP, cenere legna, calce) | Esempio chiaro: cenere legna → fertilizzante forestale è (b) free |
| Q6 (settore + TRL) | **Forestry/pulp&paper, TRL 9** | ⚠️ Settore non in elenco esplicito |
| Q7 (spread) | Co-located + regional misti | Cartiera + città co-located, fertilizzante forestale regionale |

### Pathway generato dal motore: IS-01 (Standard, ex-post, multi-attore, LCA-only)

### Match con quello che gli autori hanno fatto

| Aspetto | Gli autori | Motore | Match? |
|---|---|---|---|
| Modeling framework | Attribuzionale | Default IS-01: attribuzionale | ✅ |
| Multifunctionality | System expansion | Derivato da Q1=B + Q5 misti: system expansion | ✅ |
| Software | KCL-ECO + Ecoinvent | Motore non vincola software, ma raccomanda Ecoinvent | ✅ |
| LCIA method | ReCiPe midpoint **adattato Finlandia** | Default ReCiPe 2016 / EF 3.1 | ⚠️ **GAP 1** |
| FU | "1 anno produzione IES (2005)" | Motore ha "function-oriented FU" mandatorio (LCA HC-22) ma 1 anno di sistema è una FU function-oriented valida (multi-output portfolio) | ✅ |
| Scenari di riferimento | **3 reference + 1 potenziale** (RS1 calore gas, RS2 calore torba, RS3 future improvements) | Motore genera UN reference scenario (HNSRS) | ⚠️ **GAP 2** |

### Gap identificati

**GAP 1 — Adattamento regionale dei fattori LCIA**: Sokka usa fattori di caratterizzazione adattati alla Finlandia (Seppälä 2008 per acidificazione/eutrofizzazione, particolato). Il motore default è "ReCiPe 2016 globale". Per studi nordici, mediterranei, tropicali, ecc., serve un'opzione **regional LCIA adaptation**. Suggerisco di rendere derivabile da Q6a (settore + paese) con default override esperto.

**GAP 2 — Multi-reference scenario analysis**: il paper testa **3 baseline alternativi** (gas, torba, miglioramento futuro) per dare robustezza alla conclusione. È pratica avanzata di sensitivity. Il motore va arricchito per offrire "vuoi testare più di un reference scenario?" — ma questa è una scelta di approfondimento, non una scelta primaria. Probabilmente da inserire come **option in advanced settings** dopo Q1+Q2, non come domanda principale.

---

## Caso 2 — Hashimoto 2010 Kawasaki cement

### Simulazione risposte

| Q | Risposta | Note |
|---|---|---|
| Q1 | **B** (eco-park multi-attore) | Kawasaki Eco-town, D.C. Cement + JFE Steel + Corelex + WWTP + città |
| Q2 | **A** (esiste e opera) | Eco-town dal 1997, dati 2004-2007 |
| Q3 | **A** (solo ambientale) | Solo CO₂ |
| Q4 | **B** (comunicazione esterna no-claim) | Journal paper |
| Q5 | (a) gate fee per i waste streams (plastiche, BF slag, fango cartario, cenere) | Cementificio guadagna a co-processarle |
| Q6 | **Cement/construction, TRL 9** | ⚠️ Settore non esplicito |
| Q7 | Misto co-located + regional + extended | Esattamente lo scope dei 4 scenari S1/S2/S3/S4 |

### Pathway generato: IS-01

### Match

| Aspetto | Gli autori | Motore | Match? |
|---|---|---|---|
| Multi-attore + ex-post | ✓ | ✓ | ✅ |
| **Single-impact-category (CO₂ only)** | LCCO₂, solo CO₂ | Motore default = full LCIA (16 categorie ReCiPe / 18 EF) | ⚠️ **GAP 3** |
| **Distanze trasporto come variabile di scenario** | 4 scenari (locale/cluster/regionale/esteso) discriminati primariamente da distanze trasporto | Motore: Q7 è condizionale ("spread geografico") con 3 opzioni discrete. Non offre "voglio testare distanze come scenario variable" | ⚠️ **GAP 4** |
| Cradle-to-gate boundary | ✓ | Default per IS-01 | ✅ |

### Gap identificati

**GAP 3 — Single-impact-category analysis (LCCO₂)**: molti studi industriali (e quasi tutti i corporate ESG) si limitano a CO₂. Il motore deve offrire come opzione di Q4 o come advanced setting: "Limitare l'analisi a categorie specifiche (es. solo cambiamento climatico, solo carbon footprint)". È un caso d'uso reale e frequente, va supportato esplicitamente.

**GAP 4 — Trasporto come variabile di scenario**: Hashimoto **costruisce 4 scenari interamente sul trasporto** (locale → cluster → regionale → esteso). Q7 condizionale dice "qual è lo spread geografico" come singola domanda, ma il caso reale qui è "voglio testare diversi spread geografici come opzioni di scenario". Suggerimento: rendere Q7 più ricco — invece di chiedere "quanto è esteso?", chiedere "il trasporto è una variabile di scenario? si/no" → se sì, attiva scenario analysis su distanze (CIR-03 GIS-coupled).

---

## Caso 3 — Daddi 2017 Conceria Santa Croce

### Simulazione risposte

| Q | Risposta | Note |
|---|---|---|
| Q1 | **B** (eco-park multi-attore PMI) | Cluster di concerie con depurazione, recupero, logistica condivisi |
| Q2 | **A** (esiste e opera) | Stato attuale + 2 scenari futuri (riutilizzo acqua) |
| Q3 | **A** (solo ambientale) | LCA only |
| Q4 | **B** (comunicazione esterna no-claim) | Paper accademico ma esplicitamente per "comunicazione con stakeholder locali" |
| Q5 | Misti: acque reflue trattate (b) gratuite, fango concia → settori altri (a) gate fee | |
| Q6 | **Textile (leather sub-category) / TRL 9** | ⚠️ Leather non esplicito ma assimilabile a textile |
| Q7 | Co-located | 6 comuni, ~240 km² |

### Pathway generato: IS-01

### Match

| Aspetto | Gli autori | Motore | Match? |
|---|---|---|---|
| Multi-attore + ex-post + LCA-only | ✓ | ✓ | ✅ |
| **Allineamento a PCR EPD** "International EPD® per finished bovine leather" | Sì, esplicito | Q4-D (policy/standard alignment) attiva PCR/PEF compliance | ✅ |
| ILCD method (advanced) | Sì | Default sarebbe ReCiPe; ILCD richiede override esperto | ✅ con caveat |
| FU = 1 m² pelle finita | ✓ | "Function-oriented FU" lascia all'utente la definizione concreta nei dati del caso | ✅ |
| **Scenari futuri** (3a, 3b riutilizzo acqua) | ✓ | Motore può gestire scenari futuri come variazioni del modello | ✅ ma vedi GAP 2 |

### Gap identificati

Nessun gap nuovo. Il caso è pulito e ben coperto, **ma**:
- Conferma **GAP 1** (regional LCIA) — settore textile/leather italiano potrebbe richiedere fattori adattati EU south.
- Conferma **GAP 2** (multi-reference) — gli scenari futuri sono trattati come scenari aggiuntivi al baseline, non come reference alternative.
- Settore "leather/concerie" non esplicito in Q6a — va aggiunto come sub-categoria di textile, o come voce separata.

---

## Caso 4 — Paulu 2022 Cechia (industry-wide)

### Simulazione risposte

| Q | Risposta | Note |
|---|---|---|
| Q1 | **C** (policy/programma scala regionale/nazionale) | Esplicitamente "industry-wide", scala nazionale Cechia, "informare policy pubbliche" |
| Q2 | **A** (esiste/opera) per stato attuale | Mix di utilizzi rifiuti già in essere |
| Q3 | **A** (solo ambientale) | LCA only |
| Q4 | **D** (allineamento policy EU) | Esplicito uso EF method PEF/OEF |
| Q5 | A livello industry-wide ogni flusso è macro: fly ash → calcestruzzo (c) vendita o (a) gate fee dipende da regione, slag (a/c), gesso FGD (c) | ⚠️ Q5 difficile a livello macro |
| Q6 | **Multi-settore (waste valorization + construction + energy) / TRL 9** | ⚠️ Multi-settore non gestito esplicitamente |
| Q7 | Wide-area (cross-region nazionale) | Cechia intera |

### Pathway generato: **IS-02 (Strategic IS Policy)**

### Match

| Aspetto | Gli autori | Motore | Match? |
|---|---|---|---|
| **Policy-level scope** | ✓ Industry-wide, nazionale | Q1-C → IS-02 → consequential modeling, marginal technology, dynamic background | ✅ |
| **EF / PEF method** | ✓ esplicito | Q4-D triggera PEF CFF + NTF + monetized externality | ✅ |
| Cradle-to-grave per allocation rifiuti | ✓ | IS-02 default Cradle-to-Gate; **per waste valorization potrebbe servire C-to-G estesa** | ⚠️ **GAP 5** |
| **3 opzioni × 2 categorie materiali con scenario optimization** | Multi-criteria optimization tra A/B/C per ogni materiale | Motore genera UN single configuration con sensitivity, NON gestisce esplicitamente multi-option optimization | ⚠️ **GAP 6** |
| **Distanze massime ammissibili come output** | Calcolate esplicitamente per ogni opzione | CIR-03 GIS-coupled attivato, ma output "distanza max" non esplicitato | ⚠️ **GAP 7** |
| Q5 a livello macro | Difficile rispondere | | ⚠️ **GAP 8** |

### Gap identificati

**GAP 5 — Boundary cradle-to-grave per studi waste-management policy**: per studi industry-wide su gestione rifiuti, il boundary tipico è cradle-to-grave (include disposal). IS-02 in Phase 3 di Kimi non specifica cradle-to-grave default. Va affinato: per Q1=C + waste valorization sector → boundary = cradle-to-grave.

**GAP 6 — Scenario optimization multi-criteria**: Paulu testa **2³ × n_materiali** opzioni e seleziona quella ottimale. Il motore non gestisce questo. **Soluzione minima**: il motore deve poter generare una "scenario matrix" (es. 3 opzioni × 2 materiali = 6 scenari) e produrre il report comparativo. Non è una scelta utente, è una funzionalità del motore. Da specificare per Sprint 4.

**GAP 7 — Output "distanza massima trasporto ammissibile"**: è un output policy-relevant esplicito di Paulu (e di alcuni studi GIS-coupled). Va aggiunto come reporting variable per IS-02 + GIS attivato.

**GAP 8 — Q5 (natura economica del flusso) a livello macro**: Q5 è formulata bilateralmente ("flusso da A a B"). A scala nazionale i flussi sono aggregati e tipologici, non bilaterali. Suggerimento: per Q1=C, Q5 si trasforma in "Per ogni categoria di flusso, qual è la **modalità economica dominante** sul mercato nazionale?" con stesse opzioni. Differenziazione di Q5 in base a Q1 è naturale e non aggiunge complessità per l'utente.

---

## Caso 5 — Arce Bastias 2023 Mendoza plastica

### Simulazione risposte

| Q | Risposta | Note |
|---|---|---|
| Q1 | **A** (scambio specifico) o **B** (eco-park) | Borderline: 3 entità in rete reale, è "specifico" ma multi-attore |
| Q2 | **A** (esiste e opera) | Rete reale operativa |
| Q3 | **A** (solo ambientale) | LCA + nuovo indicatore SPI |
| Q4 | **B** (comunicazione esterna) | Paper accademico |
| Q5 | Generator → Intermediary: (a) gate fee tipica; Intermediary → User: (c) vendita | |
| Q6 | **Plastics/packaging, TRL 9** | ✓ |
| Q7 | Co-located/regional | Mendoza area |

### Pathway generato: IS-01

### Match

| Aspetto | Gli autori | Motore | Match? |
|---|---|---|---|
| Multi-attore (3) ex-post LCA-only | ✓ | ✓ | ✅ |
| **Indicatore SPI (Symbiotic Performance Indicator) — nuovo metodo** | Indicatore originale per quantificare benefici a livello entità | Motore non genera SPI ma può generare contribution analysis per entità (default IS-01 + multi-level) | ✅ con caveat |
| **Allocazione benefici tra entità della rete** | Testati 3 metodi: full / partial / system expansion | Q5 chiede "natura economica del flusso" (waste/co-product), NON "come distribuisci il beneficio ambientale tra gli attori della rete" | ⚠️⚠️ **GAP 9 IMPORTANTE** |
| CEENE (esergia) + IPCC GWP100 | LCIA non-default | Override advanced settings | ✅ |

### Gap identificati

**GAP 9 — Allocazione benefici cross-entità (cruciale)**: questo è il **vero contributo metodologico di Arce Bastias** ed è una decisione che il motore attualmente non cattura. Il caso reale: in una rete simbiotica con N attori, i benefici ambientali (e i costi nel caso LCC) possono essere attribuiti in modi diversi:
- **Full allocation**: 100% a una singola entità (tipicamente quella che riceve il riciclato)
- **Partial allocation**: distribuito proporzionalmente alla partecipazione fisica/economica
- **System expansion**: confronto IS vs non-IS per ogni entità in parallelo

Q5 cattura il "se è waste o co-product" ma non "come dividi i benefici tra i partner". Sono **due decisioni distinte**.

**Soluzione proposta**: aggiungere una sotto-domanda condizionale, mostrata SOLO quando Q1=B (eco-park multi-attore) o Q1=A con esplicitato >2 entità: **"In una rete con più aziende, come vuoi attribuire i benefici dello scambio?"** con 3 opzioni (full a chi riceve / proporzionale alla partecipazione / system expansion in parallelo). Questa è una vera scelta metodologica utente che il motore non può inferire.

Lo chiamo Q5b o Q8 (numerazione da decidere). Mappa a LCA HC-07 (multifunctionality), LCC HC-10 (allocation rule in Charter), HC-34 (transfer price as sensitivity), e attiva calcoli a livello entità (HC-09 LCC).

---

## Caso 6 — Wiktor & Johansson 2018 Malmö fango (caso più complesso)

### Simulazione risposte

| Q | Risposta | Note |
|---|---|---|
| Q1 | **A** (scambio specifico) o **B** (eco-park 3 entità) | Borderline. 3 entità (VA Syd + Sysav + Norcarb) localizzate, scambi specifici |
| Q2 | **C (solo in progettazione)** | ⚠️ Tesi di master che valuta scenari **non operativi** — "planning industrial symbiosis" |
| Q3 | **B** (ambientale + economico) | LCA + LCC entrambi |
| Q4 | **A** (uso interno) | Tesi master, decisione interna a VA Syd |
| Q5 | Fango VA Syd → Sysav (a) gate fee; Calore Norcarb → essiccazione (a) gate fee modesta o (b) free; Cenere fango → P recovery (c) vendita | Misti |
| Q6 | **Wastewater/biofactories, TRL 7-8** | ASH DEC e EcoPhos sono early-commercial |
| Q7 | Co-located (Northern Harbour Malmö) | Compatto |

### Pathway generato: **IS-04 (Emerging IS Network, ex-ante)**

### Match

| Aspetto | Gli autori | Motore | Match? |
|---|---|---|---|
| **Ex-ante con scale-up parziale** | TRL 7-8 → engineering scale-up parziale | Q2-C + Q6-TRL → Six-Tenths/Lang/CEPCI + Pedigree mandatory | ✅ |
| **30 anni horizon** | ✓ | Asset lifetime > 15y (derivabile da Q6 wastewater = lunga vita) → CIR-01 SSP/RCP attivato | ✅ |
| **Discount rate 3,5%** (svedese tecnico) | ✓ | LCC default partner-specific; per ex-ante e single-firm (VA Syd è ente pubblico) → social discount appropriate | ✅ |
| **Marginal electricity = coal** | Scelta esplicita di scenario | IS-04 in Phase 3 Kimi: "System Expansion + Avg Mix" — **ma per ex-ante 30y la marginal è più appropriata** | ⚠️ **GAP 10** |
| **13 scenari combinatori** (P recovery × heat × timing × capacity) | 4 scelte tecniche × 2-3 opzioni → 13 combinazioni | Motore genera UN single configuration; non gestisce "scenario design combinatorio" | ⚠️ **GAP 11** |
| **Sensitivity gas vs coal su marginal** | Esplicito | Default sensitivity in HC-14 LCA + HC-40 LCC, ma utente non specifica "gas vs coal" come variabile | ⚠️ Coperto in default |
| **Allocazione costi multi-attore** ("la maggior parte dei costi è allocata a VA Syd") | Esplicita | Q5 (waste/co-product) NON copre allocazione costi LCC tra attori. Stesso GAP 9. | ⚠️ **GAP 9 confermato** |
| **Single-impact-category subset** (3 categorie scelte: Acid + Eutroph + GWP, non full ReCiPe) | Studio limita a 3 categorie | Default motore = full LCIA | ⚠️ **GAP 3 confermato** |

### Gap identificati

**GAP 10 — Marginal vs Average mix per ex-ante 30y**: Phase 3 Kimi specifica per IS-04 "System Expansion + Avg Mix", ma è inappropriato per studi ex-ante a lungo orizzonte (>15-20 anni) dove il mix elettrico cambia. Per ex-ante long-horizon, **la scelta corretta è marginal technology long-term** (consistente con IS-02). Va corretto in Phase 3 spec di IS-04: "System Expansion + Marginal Technology + SSP/RCP".

**GAP 11 — Scenario design combinatorio**: Wiktor testa 4 dimensioni × 2-3 opzioni = 13 scenari. È pratica standard in studi di engineering optimization. Stesso problema di GAP 6 (Paulu). **Conferma che il motore deve supportare scenario matrix design** come funzionalità interna (non come domanda utente — l'utente esprime *cosa* vuole testare nei "dati del caso", il motore lo configura).

**GAP 12 — Single-firm dominante in rete multi-attore**: VA Syd è il "promotore" (paga la maggior parte dei costi); Sysav e Norcarb partecipano marginalmente. Q1 non distingue tra "rete con tutti partner equal" e "promotore + secondari". È una distinzione importante per LCC allocation e S-LCA stakeholder weighting. Probabilmente non da chiedere esplicitamente, ma il motore deve **inferire dal pattern dei flussi e dei costi** chi è il promotore.

---

## §A Sintesi gap identificati e modifiche proposte

| Gap | Severity | Soluzione |
|---|---|---|
| **GAP 1** Regional LCIA adaptation | Medio | Derivabile da Q6a (settore + paese, dati del caso). Default = global; advanced setting = regional |
| **GAP 2** Multi-reference scenario analysis | Medio | Advanced setting "scenari di riferimento alternativi" (default 1 scenario, esperto può aggiungerne) |
| **GAP 3** Single-impact-category analysis (es. CO₂-only) | **Alto** | Aggiungere a Q4 una sotto-opzione: "Limitare l'analisi a indicatori specifici? (es. solo carbon footprint per ESG)" sì/no. Triggera subset ReCiPe |
| **GAP 4** Trasporto come variabile di scenario | Medio | Q7 va riformulata: invece di "qual è lo spread geografico" → "il trasporto/distanza è una variabile critica del tuo studio? si/no" |
| **GAP 5** Boundary cradle-to-grave per policy waste | Basso | Derivabile da Q1=C + Q6 sector=waste valorization; default cradle-to-grave |
| **GAP 6, 11** Scenario matrix design (combinatorio) | **Alto** | Funzionalità del motore, non domanda utente. Sprint 4 backend deve supportare "scenario matrix" come tipo di studio |
| **GAP 7** Output "distanza max ammissibile" per studi GIS-coupled | Basso | Aggiungere come reporting variable derivata; non chiedere |
| **GAP 8** Q5 a livello industry-wide (Q1=C) | Medio | Riformulare Q5 in modo Q1-aware: per Q1=A/B/E "flusso bilaterale", per Q1=C "modalità dominante mercato nazionale", per Q1=D "flussi che entrano/escono dall'azienda" |
| **GAP 9** Allocazione benefici cross-entità (multi-attore) | **Alto** | **Aggiungere domanda condizionale Q8** mostrata se Q1=B o Q1=A con >2 entità: "Come distribuire i benefici dello scambio tra le aziende della rete?" — full / partial proporzionale / system expansion in parallelo |
| **GAP 10** Marginal vs Average mix per ex-ante long-horizon | Medio | Correzione Phase 3 IS-04 spec: marginal + SSP/RCP per IS-04 |
| **GAP 12** Distinzione promotore vs partner secondari in rete | Basso | Derivabile dai dati del caso (chi paga CAPEX maggiori, chi è "trigger" della rete) |
| **Settori non esplicitati**: forestry/pulp&paper, leather, cement | Medio | Estendere lista Q6a a 10-12 settori coprendo i casi reali identificati |

### Severity legend
- **Alto**: il gap impedisce di replicare correttamente un caso reale presente nei 6 paper
- **Medio**: il gap costringe l'utente a usare advanced settings o produce un modello sub-ottimale
- **Basso**: il gap è cosmetico o derivabile

---

## §B Set di domande aggiornato

Sulla base dello stress-test, il set passa da **6 + 1 condizionale** a **6 + 2 condizionali**, con riformulazioni mirate:

### Q1 — Cosa stai analizzando?
**Invariata.** Le 5 opzioni (A scambio specifico / B eco-park / C policy / D corporate / E monitoring) coprono tutti i 6 casi senza forzature. Conferma la solidità delle 5 pathway IS-01..IS-05 di Kimi.

### Q2 — In che fase è il sistema?
**Invariata.** Le 3 opzioni (A esiste / B in costruzione / C in progettazione) coprono tutti i casi.

### Q3 — Quali aspetti di sostenibilità includere?
**Invariata** (3 opzioni A/B/C).

### Q4 — A cosa ti serve il report finale?
**Modificata**: aggiungere sotto-opzione "Limitare l'analisi a indicatori specifici (es. solo carbon footprint, solo acidificazione+eutrofizzazione)?" → coverage GAP 3 (Hashimoto LCCO₂, Wiktor 3 categorie).

### Q5 — Per ogni flusso simbiotico, com'è scambiato?
**Riformulata in modo Q1-aware**:
- Se Q1 ∈ {A, B, E}: "Per ogni flusso bilaterale, il flusso da A a B è scambiato come..." (4 opzioni invariate)
- Se Q1 = C (policy): "Per ogni categoria di flusso, qual è la modalità economica dominante sul mercato nazionale/regionale?"
- Se Q1 = D (corporate): "Per ogni flusso che entra/esce dalla tua azienda, come avviene lo scambio?"

→ Coverage GAP 8.

### Q6 — Settore + TRL
**Modificata**:
- Q6a settori: estendere da 7 a 10-12 voci aggiungendo: forestry/pulp&paper, leather/concerie, cement/construction, multi-settore. Mantenere "altro" come escape.
- Q6b TRL: invariata.

### Q7 (condizionale) — Trasporto
**Riformulata da "spread geografico" a "criticità trasporto"**:
- Vecchia: "Quanto sono distribuiti i siti?" (co-located / regional / wide-area)
- Nuova: **"Il trasporto è una variabile critica del tuo studio?"**
  - "No, distanze stabili e brevi (eco-park, sito unico)" → no GIS, transport background
  - "Sì, distanze sono moderate e potrebbero variare" → break-even sensitivity (LCC HC-06) ma no GIS
  - "Sì, voglio testare diversi scenari di trasporto / mappare distanze massime ammissibili" → CIR-03 GIS-coupled + output "distanza max"

→ Coverage GAP 4 + GAP 7.

### Q8 (condizionale, NUOVA) — Allocazione benefici cross-entità
**Mostrata solo se** Q1 ∈ {B} OR (Q1=A AND >2 entità dichiarate nei dati del caso):

**"In una rete con più aziende, come vuoi attribuire i benefici (e nel caso LCC i costi) dello scambio simbiotico tra le aziende?"**

- (a) **Full allocation**: il 100% del beneficio va a una singola entità (es. quella che riceve il materiale riciclato)
- (b) **Allocazione proporzionale**: il beneficio è distribuito tra le aziende in base alla loro partecipazione fisica/economica nello scambio
- (c) **System expansion in parallelo**: ogni azienda è valutata separatamente confrontando "con simbiosi" vs "senza simbiosi" per quel partecipante
- (d) **Negoziato**: i partecipanti hanno concordato una distribuzione specifica (l'utente carica i pesi di allocazione)

→ Coverage GAP 9 (cruciale, dimostrato da Arce Bastias 2023 + Wiktor 2018).

### Riassunto: 6 domande core + 2 condizionali = max 8 domande viste dall'utente
- Q1, Q2, Q3, Q4, Q5 (iterativa per flusso), Q6 (a+b) sempre
- Q7 condizionale su Q1 e dati caricati
- Q8 condizionale su Q1=B o multi-entità
- Caso più semplice: ~6 schermate
- Caso più complesso: ~9 schermate (eco-park multi-entità ex-ante con LCSA pieno)

---

## §C Modifiche al motore (non visibili all'utente)

Indipendentemente dalle domande, lo stress-test rivela **funzionalità del motore** che vanno aggiunte per coprire i casi reali:

| Funzionalità | Trigger | Casi coperti |
|---|---|---|
| **Scenario matrix design** | quando l'utente specifica nei dati del caso N "scelte tecniche" con K opzioni → genera N×K scenari + report comparativo | Hashimoto (4 scenari trasporto), Paulu (3×2 opzioni materiali), Wiktor (13 combinazioni) |
| **Single-impact-category subset** | trigger Q4 sub-opzione | Hashimoto LCCO₂, Wiktor (Acid+Eutroph+GWP) |
| **Multi-reference scenario** | advanced setting | Sokka (RS1/RS2/RS3), Paulu (current vs optimized) |
| **Output "distanza max ammissibile"** | Q7 opzione c (GIS attivato) | Paulu, Hashimoto |
| **Allocation matrix** (chi-paga-cosa per LCC multi-attore) | Q3=B/C + Q1=B + Q8 risposta | Wiktor (allocazione VA Syd dominante), Arce Bastias |
| **Regional LCIA factors** | derivabile da Q6 settore + paese (advanced override) | Sokka (Finlandia adapted), Daddi (potenziale EU south) |
| **Marginal technology long-term** per IS-04 | correzione spec Phase 3 Kimi | Wiktor (coal marginal a 30y) |

---

## §D Validazione complessiva

| Caso | Pathway atteso | Pathway generato | Match | Severity gap |
|---|---|---|---|---|
| 1. Sokka 2011 | IS-01 multi-attore ex-post | IS-01 ✅ | ✅ con 2 medi | OK |
| 2. Hashimoto 2010 | IS-01 multi-attore ex-post focus CO₂ | IS-01 ✅ | ⚠️ con 1 alto (LCCO₂) | OK con GAP 3 risolto |
| 3. Daddi 2017 | IS-01 multi-attore ex-post + PCR EPD | IS-01 ✅ | ✅ | OK |
| 4. Paulu 2022 | IS-02 policy + PEF | IS-02 ✅ | ⚠️ con 1 alto (scenario matrix) | OK con GAP 6 risolto |
| 5. Arce Bastias 2023 | IS-01 con allocazione cross-entità innovativa | IS-01 ✅ ma manca allocazione | ⚠️ con 1 alto (allocazione) | OK con Q8 nuovo |
| 6. Wiktor 2018 | IS-04 ex-ante LCA+LCC + scenario matrix | IS-04 ✅ ma manca matrix | ⚠️ con 2 alti | OK con GAP 6+9 risolti |

**Bottom line**: i 5 pathway IS-01..IS-05 di Kimi reggono lo stress-test. Le 6 domande user-facing reggono per i 6 casi con **3 modifiche concrete** (Q4 sub-opzione single-category, Q5 Q1-aware, Q7 riformulato) e **1 nuova domanda condizionale** (Q8 allocazione cross-entità). La maggior parte dei gap restanti sono **funzionalità del motore**, non domande utente.

---

## §E Cosa propongo per il prossimo turno

Tre opzioni:

**A. Iterazione sul wording**: tu critichi le domande Q1-Q8 con le modifiche proposte (esempi, opzioni, framing) e iteriamo. Time-cheap, output diretto al frontend.

**B. Mapping nodo-per-nodo dettagliato**: per ognuno dei 186 nodi validati, etichettatura DEFAULT/DERIVED/DOMINANT con condizioni esplicite di trigger. Necessario per Sprint 4 backend refactor. Time-medio.

**C. Specifica funzionale del motore v3**: un documento operativo che descrive (1) lo schema JSON v3 del decision engine, (2) le funzionalità "scenario matrix" + "allocation matrix", (3) le regole di derivazione domanda→nodi, (4) il flusso dati frontend↔backend per il questionario adattivo. Time-alto ma è la spec che serve per partire con Sprint 4.

Mia raccomandazione: **A prima** (1-2 turni di iterazione su wording, output rapido), poi **B** (mapping completo come ground truth), poi **C** (spec funzionale per Sprint 4). Ma se vuoi puntare diretto a Sprint 4 senza affinare il wording, possiamo invertire B/C.

Decidi tu come procedere.
