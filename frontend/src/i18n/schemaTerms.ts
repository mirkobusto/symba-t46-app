// Rule, decision-point and block wording, in five languages.
//
// This text is not written here: it lives in the engine's rule table
// (backend/app/schemas/cross_method_rules.json) and reaches the client
// through the pipeline response, in English only. Before this module the
// result page showed it raw, so a reader working in German or Spanish
// met a page half in their language and half not.
//
// What is traceable is the CODE — IR-01, CDP-02, block_… — which the
// card keeps next to every item. The English names are the project's own
// labels, taken from docs/implementation/PHASE1_NODE_MAPPING_v2.md, not
// wording quoted from D4.1 or D4.2, so translating them loses no
// reference a reviewer could follow. (Contrast i18n/narrativeSources.ts,
// where the quotes stay English because a citation in translation is not
// a citation.)
//
// The `en` entries below must match the schema verbatim: a vitest fails
// if they drift, which is the signal that a translation needs revisiting.

export interface SchemaTerm {
  name: string
  body: string
  /** CDPs only: how the engine resolves the tension. */
  resolution?: string
}

export type SchemaTermKind = 'rule' | 'cdp' | 'block'

type Bag = Record<string, SchemaTerm>

export interface SchemaTerms {
  rule: Bag
  cdp: Bag
  block: Bag
}

export const SCHEMA_TERMS: Record<string, SchemaTerms> = {
  en: {
    rule: {
      'IR-01': {
        name: 'Shared Functional Unit',
        body: 'Functional Unit must be identical across active dimensions per IR-01.',
      },
      'IR-02': {
        name: 'Consistent System Boundaries',
        body: 'LCA system boundary and E-LCC physical boundary must be identical per IR-02.',
      },
      'IR-03': {
        name: 'S-LCA Comparative',
        body: 'S-LCA must be Comparative when active in IS context (no Absolute mode in user-mode) per IR-03.',
      },
      'IR-04': {
        name: 'Parallel Interpretation',
        body: 'Parallel interpretation enforced: no single-score aggregation across dimensions per IR-04.',
      },
      'IR-05': {
        name: 'Methodological Autonomy',
        body: 'Each dimension must retain its own units per IR-05 (no cross-dimensional unit normalization).',
      },
      'IR-06': {
        name: 'Unified Data Governance',
        body: 'Multi-actor IS multi-dim assessments require facilitator + signed NDAs per IR-06.',
      },
      'IR-07': {
        name: 'Identical Reference Scenarios',
        body: 'Reference scenario type (FU+boundary+temporal+geographic) must be identical across active dimensions per IR-07.',
      },
      'IR-08': {
        name: 'MFCA/MFA Common Backbone',
        body: 'When LCA and LCC both active, MFA/MFCA must be the common physical backbone per IR-08.',
      },
      'IR-09': {
        name: 'Multifunctionality Alignment',
        body: 'Quality correction factor must be identical across LCA and LCC for substitution flows per IR-09.',
      },
      'IR-10': {
        name: 'Anti-Aggregation',
        body: 'Public-facing reports cannot use aggregated single scores per IR-10.',
      },
      'IR-11': {
        name: 'Layered Reporting Isomorphism',
        body: 'Three-layer reporting structure must be isomorphic across active dimensions per IR-11.',
      },
      'IR-12': {
        name: 'Transport-Spatial Co-Modeling',
        body: 'Transport modeling must be coupled across all active dimensions, whatever the geographic spread, per IR-12.',
      },
      'IR-13': {
        name: 'Capital Goods Alignment',
        body: 'IS-unique capital goods must be amortized identically across LCA and LCC per IR-13.',
      },
      'IR-14': {
        name: 'Uncertainty Complementarity',
        body: 'Each dimension must use its proper uncertainty paradigm; cross-dim normalization not allowed per IR-14.',
      },
      'IR-15': {
        name: 'Zero-Valuation Hierarchy',
        body: 'LCA 4-step zero-burden hierarchy and LCC avoidable/unavoidable test must yield same classification per flow per IR-15.',
      },
      'IR-16': {
        name: 'Entity-First Calculation',
        body: 'Calculation must proceed entity-first within each method per IR-16.',
      },
      'IR-17': {
        name: 'Screening Before Detail',
        body: 'Screening study must precede detailed study per IR-17.',
      },
      'IR-18': {
        name: 'Critical Review for Public Assertions',
        body: 'Public superiority claims (Q4=C) require panel of 3+ independent experts covering all active dimensions per IR-18.',
      },
      'IR-19': {
        name: 'Comparative Framing',
        body: 'All IS reports must be framed as comparative outcomes (NOT absolute) per IR-19.',
      },
      'IR-20': {
        name: 'Three-Level Analytical Isomorphism',
        body: 'Each method must expose three analytical levels for cross-method comparison per IR-20.',
      },
      'CIR-01': {
        name: 'Dynamic Climate Scenarios LCA-LCC',
        body: '',
      },
      'CIR-02': {
        name: 'Pedigree Matrix LCA+LCC',
        body: '',
      },
      'CIR-03': {
        name: 'GIS-Coupled Spatial Modeling',
        body: '',
      },
      'CIR-04': {
        name: 'Percolation Counterparty Risk',
        body: '',
      },
      'CIR-05': {
        name: 'PEF CFF Activation',
        body: '',
      },
      'CIR-06': {
        name: 'Frontier Categories Cascade',
        body: '',
      },
      'CIR-07': {
        name: 'Engineering Scale-up Frameworks',
        body: '',
      },
      'CIR-08': {
        name: 'Shared CAPEX Stakeholder Indicators',
        body: '',
      },
      'CIR-09': {
        name: 'Iterative Update Protocol',
        body: '',
      },
      'CIR-10': {
        name: 'Real-World Failure Modes',
        body: '',
      },
      'FU-01': {
        name: 'Function-Oriented FU Default',
        body: 'LCA Functional Unit must be function-oriented (LCA MC-07 authoritative) per FU-01.',
      },
      'FU-02': {
        name: 'System of Functional Units (Multi-Actor)',
        body: 'Multi-actor IS networks require System of Functional Units (SFU) for aggregation per FU-02.',
      },
      'FU-03': {
        name: 'FE-FU Equality (LCA+LCC)',
        body: 'When LCA+LCC active, FE must be documented in charter and identical to LCA FU per FU-03.',
      },
      'FU-04': {
        name: 'S-LCA Dual Unit Layer',
        body: 'S-LCA must populate both shared FU and stakeholder-based unit per FU-04.',
      },
      'FU-05': {
        name: 'Reference Scenario Uniformity',
        body: 'Reference scenario type must be uniform across active methods for FU benchmarks per FU-05.',
      },
      'B-01': {
        name: 'E-LCC Physical Boundary Equals LCA',
        body: 'E-LCC physical boundary must equal LCA system boundary per B-01.',
      },
      'B-02': {
        name: 'Cross-Method System Boundary Consistency',
        body: 'System boundaries across active methods must be consistent per B-02.',
      },
      'B-03': {
        name: 'S-LCA Boundary Alignment',
        body: 'S-LCA boundary must be aligned with LCA system boundary and LCC physical boundary when E-LCC active per B-03.',
      },
      'B-04': {
        name: 'S-LCA Territorial Dimension Mandatory',
        body: 'S-LCA territorial dimension is mandatory in addition to organizational per B-04.',
      },
      'B-05': {
        name: 'Geographic Spread Transport Coupling',
        body: 'Explicit transport in both the LCA foreground and the LCC costs, whatever the geographic spread, per B-05 (D4.1 §13.3.1, D4.2 §4.3).',
      },
      'B-06': {
        name: 'Capital Goods Amortization Alignment',
        body: 'Capital goods must be included in both LCA and LCC AND amortization periods must match per B-06.',
      },
      'B-07': {
        name: 'Boundary Truncation Documentation',
        body: 'Boundary truncations must be transparently declared in blind_spots for each active dimension per B-07.',
      },
    },
    cdp: {
      'CDP-01': {
        name: 'Displaced Products Divergence',
        body: 'LCA/LCC system expansion may use different displaced products',
        resolution: 'Identical reference scenario + identical Q factor enforced (IR-09)',
      },
      'CDP-02': {
        name: 'Discounting Mismatch',
        body: 'LCA forbids discounting; LCC mandates it',
        resolution: 'Each retains own convention (IR-05); LCC uses annualized costs for eco-efficiency',
      },
      'CDP-03': {
        name: 'Single-Score vs NPV',
        body: 'S-LCA prohibits single-score; LCC produces NPV',
        resolution: 'Parallel interpretation per IR-04; NPV reported as economic dim only',
      },
      'CDP-04': {
        name: 'Uncertainty Paradigm Mismatch',
        body: 'Different uncertainty propagation paradigms',
        resolution: 'Quantitative for LCA/LCC, qualitative for S-LCA reported side-by-side',
      },
      'CDP-05': {
        name: 'Zero-Burden vs Avoidable Test',
        body: 'LCA zero-burden hierarchy vs LCC avoidable test divergence',
        resolution: 'Consolidated 4-step decision tree per IR-15; resolved by neutral facilitator',
      },
      'CDP-06': {
        name: 'FU Definition Tri-Method Divergence',
        body: 'LCA function-oriented vs LCC flow-oriented vs S-LCA stakeholder-based FU',
        resolution: 'FU-01 to FU-05 applied; LCA function-oriented authoritative',
      },
      'CDP-07': {
        name: 'Reporting Architecture Divergence',
        body: 'Three different reporting architectures',
        resolution: 'Unified 3-layer reporting per IR-11 + multi-level disaggregation per IR-20',
      },
      'CDP-08': {
        name: 'Weighting/Aggregation Tension',
        body: 'LCA bans weighting (public); S-LCA bans single-score; users want single scores',
        resolution: 'No single-score for public disclosure per IR-10; internal dashboards remain 3 separate',
      },
      'CDP-09': {
        name: 'Futurization Asymmetry',
        body: 'LCA/LCC futurization paradigms differ; S-LCA has no futurization',
        resolution: 'LCA and LCC use identical SSP/RCP per CIR-01; S-LCA uses current-period',
      },
      'CDP-10': {
        name: 'Computational Intensity Variance',
        body: 'Different computational intensity across methods',
        resolution: 'Runs are additive, not multiplicative',
      },
      'CDP-11': {
        name: 'Governance Structure Divergence',
        body: 'Three different governance structures (panel, facilitator, engagement)',
        resolution: 'Facilitator coordinates; panel reviews independently; engagement parallel',
      },
      'CDP-12': {
        name: 'MFCA/MFA Cross-Method Alignment',
        body: 'MFCA/MFA may not match LCA process tree or S-LCA stakeholder groups',
        resolution: 'MFCA/MFA for LCA-LCC only; S-LCA uses parallel interpretation',
      },
    },
    block: {
      'block_C2_plus_E-LCC': {
        name: '',
        body: 'Corporate reporting (Q1=D) is costed at company level only (C-LCC) in this tool, so network-level E-LCC cannot be combined with it. This is a T4.6 design choice: D4.2 ties the LCC type to the study\'s purpose, not to Q1. To cost the network, use Q1=A/B/C/E.',
      },
      'block_anyQ1_plus_AbsoluteSLCA': {
        name: '',
        body: 'S-LCA in Industrial Symbiosis context must be Comparative (default). Absolute mode disables IS-specific methodology. Select Comparative S-LCA or remove SOC from Q3.',
      },
      'block_Q3_emptySelection': {
        name: '',
        body: 'Select at least one sustainability dimension (Environmental, Economic, or Social) to proceed.',
      },
      'block_Q1A_plus_Q5e': {
        name: '',
        body: 'A specific exchange between two companies cannot be analyzed as black-box aggregated. Specify the nature of each flow (a/b/c/d) in Q5, or change Q1 to B/C.',
      },
    },
  },
  it: {
    rule: {
      'IR-01': {
        name: 'Unità funzionale condivisa',
        body: 'L\'unità funzionale deve essere identica in tutte le dimensioni attive (IR-01).',
      },
      'IR-02': {
        name: 'Confini del sistema coerenti',
        body: 'Il confine del sistema dell\'LCA e il confine fisico dell\'E-LCC devono coincidere (IR-02).',
      },
      'IR-03': {
        name: 'S-LCA comparativa',
        body: 'In contesto di simbiosi industriale l\'S-LCA deve essere comparativa: la modalità assoluta non è disponibile (IR-03).',
      },
      'IR-04': {
        name: 'Interpretazione parallela',
        body: 'Interpretazione parallela obbligatoria: nessun punteggio unico che aggreghi dimensioni diverse (IR-04).',
      },
      'IR-05': {
        name: 'Autonomia metodologica',
        body: 'Ogni dimensione mantiene le proprie unità di misura: nessuna normalizzazione fra dimensioni (IR-05).',
      },
      'IR-06': {
        name: 'Governance unificata dei dati',
        body: 'Le valutazioni multi-dimensione su reti con più attori richiedono un facilitatore e accordi di riservatezza firmati (IR-06).',
      },
      'IR-07': {
        name: 'Scenari di riferimento identici',
        body: 'Il tipo di scenario di riferimento (unità funzionale, confini, orizzonte temporale, ambito geografico) deve essere identico in tutte le dimensioni attive (IR-07).',
      },
      'IR-08': {
        name: 'Ossatura comune MFCA/MFA',
        body: 'Quando LCA e LCC sono entrambe attive, l\'MFA/MFCA deve essere l\'ossatura fisica comune (IR-08).',
      },
      'IR-09': {
        name: 'Allineamento della multifunzionalità',
        body: 'Il fattore di correzione della qualità deve essere identico in LCA e LCC per i flussi di sostituzione (IR-09).',
      },
      'IR-10': {
        name: 'Divieto di aggregazione',
        body: 'I report destinati al pubblico non possono usare punteggi unici aggregati (IR-10).',
      },
      'IR-11': {
        name: 'Isomorfismo del reporting a strati',
        body: 'La struttura di reporting a tre strati deve essere la stessa in tutte le dimensioni attive (IR-11).',
      },
      'IR-12': {
        name: 'Modellazione congiunta di trasporto e spazio',
        body: 'Il trasporto va modellato in modo coordinato in tutte le dimensioni attive, qualunque sia la distribuzione geografica (IR-12).',
      },
      'IR-13': {
        name: 'Allineamento dei beni capitali',
        body: 'I beni capitali propri della simbiosi vanno ammortizzati allo stesso modo in LCA e in LCC (IR-13).',
      },
      'IR-14': {
        name: 'Complementarità dell\'incertezza',
        body: 'Ogni dimensione usa il proprio paradigma di incertezza; non è ammessa una normalizzazione fra dimensioni (IR-14).',
      },
      'IR-15': {
        name: 'Gerarchia della valorizzazione nulla',
        body: 'La gerarchia zero-burden in quattro passi dell\'LCA e il test di evitabilità dell\'LCC devono portare alla stessa classificazione, flusso per flusso (IR-15).',
      },
      'IR-16': {
        name: 'Calcolo per entità',
        body: 'Il calcolo procede per entità all\'interno di ciascun metodo (IR-16).',
      },
      'IR-17': {
        name: 'Screening prima del dettaglio',
        body: 'Lo studio di screening deve precedere lo studio di dettaglio (IR-17).',
      },
      'IR-18': {
        name: 'Revisione critica per le affermazioni pubbliche',
        body: 'Le affermazioni pubbliche di superiorità (Q4=C) richiedono un panel di almeno 3 esperti indipendenti che copra tutte le dimensioni attive (IR-18).',
      },
      'IR-19': {
        name: 'Impostazione comparativa',
        body: 'Tutti i report di simbiosi industriale vanno presentati come esiti comparativi, non assoluti (IR-19).',
      },
      'IR-20': {
        name: 'Isomorfismo analitico su tre livelli',
        body: 'Ogni metodo deve esporre tre livelli analitici, perché i metodi siano confrontabili fra loro (IR-20).',
      },
      'CIR-01': {
        name: 'Scenari climatici dinamici LCA-LCC',
        body: '',
      },
      'CIR-02': {
        name: 'Matrice pedigree LCA+LCC',
        body: '',
      },
      'CIR-03': {
        name: 'Modellazione spaziale con GIS',
        body: '',
      },
      'CIR-04': {
        name: 'Rischio di controparte e percolazione',
        body: '',
      },
      'CIR-05': {
        name: 'Attivazione della formula PEF (CFF)',
        body: '',
      },
      'CIR-06': {
        name: 'Cascata delle categorie di frontiera',
        body: '',
      },
      'CIR-07': {
        name: 'Metodi di scale-up ingegneristico',
        body: '',
      },
      'CIR-08': {
        name: 'Indicatori per stakeholder su CAPEX condiviso',
        body: '',
      },
      'CIR-09': {
        name: 'Protocollo di aggiornamento iterativo',
        body: '',
      },
      'CIR-10': {
        name: 'Modalità di guasto nel mondo reale',
        body: '',
      },
      'FU-01': {
        name: 'Unità funzionale orientata alla funzione',
        body: 'L\'unità funzionale dell\'LCA deve essere orientata alla funzione (fa fede il nodo LCA MC-07) (FU-01).',
      },
      'FU-02': {
        name: 'Sistema di unità funzionali (più attori)',
        body: 'Le reti di simbiosi con più attori richiedono un sistema di unità funzionali (SFU) per l\'aggregazione (FU-02).',
      },
      'FU-03': {
        name: 'Uguaglianza FE-UF (LCA+LCC)',
        body: 'Con LCA e LCC attive, l\'equivalente funzionale va documentato nella charter e deve coincidere con l\'unità funzionale dell\'LCA (FU-03).',
      },
      'FU-04': {
        name: 'Doppio strato di unità per l\'S-LCA',
        body: 'L\'S-LCA deve riempire sia l\'unità funzionale condivisa sia l\'unità riferita agli stakeholder (FU-04).',
      },
      'FU-05': {
        name: 'Uniformità dello scenario di riferimento',
        body: 'Il tipo di scenario di riferimento deve essere uniforme fra i metodi attivi, perché i confronti sull\'unità funzionale siano validi (FU-05).',
      },
      'B-01': {
        name: 'Confine fisico E-LCC uguale all\'LCA',
        body: 'Il confine fisico dell\'E-LCC deve coincidere con il confine del sistema dell\'LCA (B-01).',
      },
      'B-02': {
        name: 'Coerenza dei confini fra i metodi',
        body: 'I confini del sistema devono essere coerenti fra tutti i metodi attivi (B-02).',
      },
      'B-03': {
        name: 'Allineamento del confine S-LCA',
        body: 'Il confine dell\'S-LCA va allineato al confine del sistema dell\'LCA e, con E-LCC attiva, al suo confine fisico (B-03).',
      },
      'B-04': {
        name: 'Dimensione territoriale obbligatoria nell\'S-LCA',
        body: 'Nell\'S-LCA la dimensione territoriale è obbligatoria, oltre a quella organizzativa (B-04).',
      },
      'B-05': {
        name: 'Trasporto esplicito qualunque sia la distribuzione geografica',
        body: 'Trasporto esplicito sia nel foreground dell\'LCA sia nei costi dell\'LCC, qualunque sia la distribuzione geografica (B-05; D4.1 §13.3.1, D4.2 §4.3).',
      },
      'B-06': {
        name: 'Allineamento dell\'ammortamento dei beni capitali',
        body: 'I beni capitali vanno inclusi sia nell\'LCA sia nell\'LCC, e i periodi di ammortamento devono coincidere (B-06).',
      },
      'B-07': {
        name: 'Documentazione dei troncamenti di confine',
        body: 'I troncamenti dei confini vanno dichiarati in modo trasparente in blind_spots per ogni dimensione attiva (B-07).',
      },
    },
    cdp: {
      'CDP-01': {
        name: 'Divergenza sui prodotti sostituiti',
        body: 'LCA e LCC, espandendo il sistema, possono usare prodotti sostituiti diversi',
        resolution: 'Stesso scenario di riferimento e stesso fattore di qualità, imposti da IR-09',
      },
      'CDP-02': {
        name: 'Disaccordo sull\'attualizzazione',
        body: 'L\'LCA vieta l\'attualizzazione; l\'LCC la impone',
        resolution: 'Ciascuna tiene la propria convenzione (IR-05); l\'LCC usa costi annualizzati per l\'eco-efficienza',
      },
      'CDP-03': {
        name: 'Punteggio unico contro NPV',
        body: 'L\'S-LCA vieta il punteggio unico; l\'LCC produce un NPV',
        resolution: 'Interpretazione parallela secondo IR-04; l\'NPV resta un risultato della sola dimensione economica',
      },
      'CDP-04': {
        name: 'Paradigmi di incertezza diversi',
        body: 'I metodi propagano l\'incertezza in modi diversi',
        resolution: 'Quantitativa per LCA e LCC, qualitativa per l\'S-LCA, riportate affiancate',
      },
      'CDP-05': {
        name: 'Zero-burden contro test di evitabilità',
        body: 'La gerarchia zero-burden dell\'LCA e il test di evitabilità dell\'LCC possono divergere',
        resolution: 'Albero decisionale unico in quattro passi secondo IR-15; dirime un facilitatore neutrale',
      },
      'CDP-06': {
        name: 'Unità funzionale divergente fra i tre metodi',
        body: 'LCA orientata alla funzione, LCC al flusso, S-LCA agli stakeholder',
        resolution: 'Si applicano FU-01…FU-05; fa fede l\'unità funzionale orientata alla funzione dell\'LCA',
      },
      'CDP-07': {
        name: 'Architetture di reporting divergenti',
        body: 'Tre architetture di reporting diverse',
        resolution: 'Reporting unico a 3 strati secondo IR-11, con disaggregazione su più livelli secondo IR-20',
      },
      'CDP-08': {
        name: 'Tensione su pesatura e aggregazione',
        body: 'L\'LCA vieta la pesatura in pubblico, l\'S-LCA il punteggio unico; gli utenti vogliono un numero solo',
        resolution: 'Nessun punteggio unico nella comunicazione pubblica (IR-10); i cruscotti interni restano 3 separati',
      },
      'CDP-09': {
        name: 'Asimmetria nella proiezione al futuro',
        body: 'LCA e LCC proiettano al futuro in modo diverso; l\'S-LCA non lo fa affatto',
        resolution: 'LCA e LCC usano gli stessi scenari SSP/RCP secondo CIR-01; l\'S-LCA resta al periodo corrente',
      },
      'CDP-10': {
        name: 'Costo di calcolo diverso fra i metodi',
        body: 'I metodi hanno un costo di calcolo molto diverso',
        resolution: 'Le esecuzioni si sommano, non si moltiplicano',
      },
      'CDP-11': {
        name: 'Strutture di governance divergenti',
        body: 'Tre strutture di governance diverse (panel, facilitatore, coinvolgimento)',
        resolution: 'Il facilitatore coordina; il panel rivede in modo indipendente; il coinvolgimento procede in parallelo',
      },
      'CDP-12': {
        name: 'Allineamento MFCA/MFA fra i metodi',
        body: 'L\'MFCA/MFA può non corrispondere all\'albero di processo dell\'LCA né ai gruppi di stakeholder dell\'S-LCA',
        resolution: 'MFCA/MFA solo per LCA e LCC; l\'S-LCA resta in interpretazione parallela',
      },
    },
    block: {
      'block_C2_plus_E-LCC': {
        name: '',
        body: 'In questo strumento il rendiconto aziendale (Q1=D) è costeggiato solo a livello di impresa (C-LCC), quindi non si può combinare con un E-LCC di rete. È una scelta di progetto di T4.6: D4.2 lega il tipo di LCC allo scopo dello studio, non a Q1. Per costeggiare la rete, usa Q1=A/B/C/E.',
      },
      'block_anyQ1_plus_AbsoluteSLCA': {
        name: '',
        body: 'In contesto di simbiosi industriale l\'S-LCA deve essere comparativa (impostazione predefinita). La modalità assoluta disattiva la metodologia specifica della simbiosi. Scegli l\'S-LCA comparativa oppure togli SOC da Q3.',
      },
      'block_Q3_emptySelection': {
        name: '',
        body: 'Seleziona almeno una dimensione della sostenibilità (ambientale, economica o sociale) per procedere.',
      },
      'block_Q1A_plus_Q5e': {
        name: '',
        body: 'Uno scambio specifico fra due aziende non può essere analizzato come aggregato a scatola nera. Specifica la natura di ogni flusso (a/b/c/d) in Q5, oppure cambia Q1 in B/C.',
      },
    },
  },
  fr: {
    rule: {
      'IR-01': {
        name: 'Unité fonctionnelle partagée',
        body: 'L\'unité fonctionnelle doit être identique dans toutes les dimensions actives (IR-01).',
      },
      'IR-02': {
        name: 'Frontières du système cohérentes',
        body: 'La frontière du système de la LCA et la frontière physique de l\'E-LCC doivent coïncider (IR-02).',
      },
      'IR-03': {
        name: 'S-LCA comparative',
        body: 'En contexte de symbiose industrielle, la S-LCA doit être comparative : le mode absolu n\'est pas disponible (IR-03).',
      },
      'IR-04': {
        name: 'Interprétation parallèle',
        body: 'Interprétation parallèle obligatoire : aucun score unique agrégeant plusieurs dimensions (IR-04).',
      },
      'IR-05': {
        name: 'Autonomie méthodologique',
        body: 'Chaque dimension conserve ses propres unités : aucune normalisation entre dimensions (IR-05).',
      },
      'IR-06': {
        name: 'Gouvernance unifiée des données',
        body: 'Les évaluations multidimensionnelles sur des réseaux à plusieurs acteurs exigent un facilitateur et des accords de confidentialité signés (IR-06).',
      },
      'IR-07': {
        name: 'Scénarios de référence identiques',
        body: 'Le type de scénario de référence (unité fonctionnelle, frontières, horizon temporel, périmètre géographique) doit être identique dans toutes les dimensions actives (IR-07).',
      },
      'IR-08': {
        name: 'Ossature commune MFCA/MFA',
        body: 'Lorsque la LCA et la LCC sont toutes deux actives, la MFA/MFCA doit être l\'ossature physique commune (IR-08).',
      },
      'IR-09': {
        name: 'Alignement de la multifonctionnalité',
        body: 'Le facteur de correction de la qualité doit être identique en LCA et en LCC pour les flux de substitution (IR-09).',
      },
      'IR-10': {
        name: 'Interdiction d\'agrégation',
        body: 'Les rapports destinés au public ne peuvent pas utiliser de score unique agrégé (IR-10).',
      },
      'IR-11': {
        name: 'Isomorphisme du reporting en couches',
        body: 'La structure de reporting en trois couches doit être la même dans toutes les dimensions actives (IR-11).',
      },
      'IR-12': {
        name: 'Modélisation conjointe du transport et de l\'espace',
        body: 'Le transport doit être modélisé de façon coordonnée dans toutes les dimensions actives, quelle que soit la répartition géographique (IR-12).',
      },
      'IR-13': {
        name: 'Alignement des biens d\'équipement',
        body: 'Les biens d\'équipement propres à la symbiose doivent être amortis de la même manière en LCA et en LCC (IR-13).',
      },
      'IR-14': {
        name: 'Complémentarité de l\'incertitude',
        body: 'Chaque dimension utilise son propre paradigme d\'incertitude ; aucune normalisation entre dimensions n\'est admise (IR-14).',
      },
      'IR-15': {
        name: 'Hiérarchie de la valorisation nulle',
        body: 'La hiérarchie zero-burden en quatre étapes de la LCA et le test d\'évitabilité de la LCC doivent aboutir à la même classification, flux par flux (IR-15).',
      },
      'IR-16': {
        name: 'Calcul par entité',
        body: 'Le calcul procède par entité à l\'intérieur de chaque méthode (IR-16).',
      },
      'IR-17': {
        name: 'Screening avant le détail',
        body: 'L\'étude de screening doit précéder l\'étude détaillée (IR-17).',
      },
      'IR-18': {
        name: 'Revue critique pour les affirmations publiques',
        body: 'Les affirmations publiques de supériorité (Q4=C) exigent un panel d\'au moins 3 experts indépendants couvrant toutes les dimensions actives (IR-18).',
      },
      'IR-19': {
        name: 'Cadrage comparatif',
        body: 'Tous les rapports de symbiose industrielle doivent être présentés comme des résultats comparatifs, non absolus (IR-19).',
      },
      'IR-20': {
        name: 'Isomorphisme analytique à trois niveaux',
        body: 'Chaque méthode doit exposer trois niveaux d\'analyse, afin que les méthodes soient comparables entre elles (IR-20).',
      },
      'CIR-01': {
        name: 'Scénarios climatiques dynamiques LCA-LCC',
        body: '',
      },
      'CIR-02': {
        name: 'Matrice pedigree LCA+LCC',
        body: '',
      },
      'CIR-03': {
        name: 'Modélisation spatiale couplée au SIG',
        body: '',
      },
      'CIR-04': {
        name: 'Risque de contrepartie et percolation',
        body: '',
      },
      'CIR-05': {
        name: 'Activation de la formule PEF (CFF)',
        body: '',
      },
      'CIR-06': {
        name: 'Cascade des catégories de frontière',
        body: '',
      },
      'CIR-07': {
        name: 'Méthodes d\'extrapolation d\'échelle',
        body: '',
      },
      'CIR-08': {
        name: 'Indicateurs parties prenantes sur CAPEX partagé',
        body: '',
      },
      'CIR-09': {
        name: 'Protocole de mise à jour itérative',
        body: '',
      },
      'CIR-10': {
        name: 'Modes de défaillance en conditions réelles',
        body: '',
      },
      'FU-01': {
        name: 'Unité fonctionnelle orientée fonction',
        body: 'L\'unité fonctionnelle de la LCA doit être orientée fonction (le nœud LCA MC-07 fait foi) (FU-01).',
      },
      'FU-02': {
        name: 'Système d\'unités fonctionnelles (multi-acteurs)',
        body: 'Les réseaux de symbiose à plusieurs acteurs exigent un système d\'unités fonctionnelles (SFU) pour l\'agrégation (FU-02).',
      },
      'FU-03': {
        name: 'Égalité EF-UF (LCA+LCC)',
        body: 'Avec LCA et LCC actives, l\'équivalent fonctionnel doit être documenté dans la charte et coïncider avec l\'unité fonctionnelle de la LCA (FU-03).',
      },
      'FU-04': {
        name: 'Double couche d\'unités pour la S-LCA',
        body: 'La S-LCA doit renseigner à la fois l\'unité fonctionnelle partagée et l\'unité rapportée aux parties prenantes (FU-04).',
      },
      'FU-05': {
        name: 'Uniformité du scénario de référence',
        body: 'Le type de scénario de référence doit être uniforme entre les méthodes actives, pour que les comparaisons sur l\'unité fonctionnelle soient valides (FU-05).',
      },
      'B-01': {
        name: 'Frontière physique E-LCC égale à la LCA',
        body: 'La frontière physique de l\'E-LCC doit être égale à la frontière du système de la LCA (B-01).',
      },
      'B-02': {
        name: 'Cohérence des frontières entre méthodes',
        body: 'Les frontières du système doivent être cohérentes entre toutes les méthodes actives (B-02).',
      },
      'B-03': {
        name: 'Alignement de la frontière S-LCA',
        body: 'La frontière de la S-LCA doit être alignée sur la frontière du système de la LCA et, si l\'E-LCC est active, sur sa frontière physique (B-03).',
      },
      'B-04': {
        name: 'Dimension territoriale obligatoire en S-LCA',
        body: 'En S-LCA, la dimension territoriale est obligatoire, en plus de la dimension organisationnelle (B-04).',
      },
      'B-05': {
        name: 'Transport explicite quelle que soit la répartition géographique',
        body: 'Transport explicite à la fois dans le premier plan de la LCA et dans les coûts de la LCC, quelle que soit la répartition géographique (B-05 ; D4.1 §13.3.1, D4.2 §4.3).',
      },
      'B-06': {
        name: 'Alignement de l\'amortissement des biens d\'équipement',
        body: 'Les biens d\'équipement doivent être inclus en LCA comme en LCC, et les durées d\'amortissement doivent coïncider (B-06).',
      },
      'B-07': {
        name: 'Documentation des troncatures de frontière',
        body: 'Les troncatures de frontière doivent être déclarées de façon transparente dans blind_spots pour chaque dimension active (B-07).',
      },
    },
    cdp: {
      'CDP-01': {
        name: 'Divergence sur les produits substitués',
        body: 'En élargissant le système, la LCA et la LCC peuvent retenir des produits substitués différents',
        resolution: 'Même scénario de référence et même facteur de qualité, imposés par IR-09',
      },
      'CDP-02': {
        name: 'Désaccord sur l\'actualisation',
        body: 'La LCA interdit l\'actualisation ; la LCC l\'impose',
        resolution: 'Chacune garde sa convention (IR-05) ; la LCC utilise des coûts annualisés pour l\'éco-efficacité',
      },
      'CDP-03': {
        name: 'Score unique contre NPV',
        body: 'La S-LCA interdit le score unique ; la LCC produit un NPV',
        resolution: 'Interprétation parallèle selon IR-04 ; le NPV reste un résultat de la seule dimension économique',
      },
      'CDP-04': {
        name: 'Paradigmes d\'incertitude différents',
        body: 'Les méthodes propagent l\'incertitude différemment',
        resolution: 'Quantitative pour la LCA et la LCC, qualitative pour la S-LCA, présentées côte à côte',
      },
      'CDP-05': {
        name: 'Zero-burden contre test d\'évitabilité',
        body: 'La hiérarchie zero-burden de la LCA et le test d\'évitabilité de la LCC peuvent diverger',
        resolution: 'Arbre de décision unique en quatre étapes selon IR-15 ; tranché par un facilitateur neutre',
      },
      'CDP-06': {
        name: 'Unité fonctionnelle divergente entre les trois méthodes',
        body: 'LCA orientée fonction, LCC orientée flux, S-LCA orientée parties prenantes',
        resolution: 'FU-01 à FU-05 s\'appliquent ; l\'unité fonctionnelle orientée fonction de la LCA fait foi',
      },
      'CDP-07': {
        name: 'Architectures de reporting divergentes',
        body: 'Trois architectures de reporting différentes',
        resolution: 'Reporting unique en 3 couches selon IR-11, avec désagrégation à plusieurs niveaux selon IR-20',
      },
      'CDP-08': {
        name: 'Tension sur la pondération et l\'agrégation',
        body: 'La LCA interdit la pondération en public, la S-LCA le score unique ; les utilisateurs veulent un seul chiffre',
        resolution: 'Pas de score unique dans la communication publique (IR-10) ; les tableaux de bord internes restent 3 séparés',
      },
      'CDP-09': {
        name: 'Asymétrie de la projection dans le futur',
        body: 'La LCA et la LCC projettent différemment dans le futur ; la S-LCA ne le fait pas',
        resolution: 'LCA et LCC utilisent les mêmes scénarios SSP/RCP selon CIR-01 ; la S-LCA reste sur la période courante',
      },
      'CDP-10': {
        name: 'Coût de calcul inégal entre méthodes',
        body: 'Les méthodes n\'ont pas le même coût de calcul',
        resolution: 'Les exécutions s\'additionnent, elles ne se multiplient pas',
      },
      'CDP-11': {
        name: 'Structures de gouvernance divergentes',
        body: 'Trois structures de gouvernance différentes (panel, facilitateur, engagement)',
        resolution: 'Le facilitateur coordonne ; le panel examine de façon indépendante ; l\'engagement se déroule en parallèle',
      },
      'CDP-12': {
        name: 'Alignement MFCA/MFA entre méthodes',
        body: 'La MFCA/MFA peut ne correspondre ni à l\'arbre de procédés de la LCA ni aux groupes de parties prenantes de la S-LCA',
        resolution: 'MFCA/MFA pour la LCA et la LCC uniquement ; la S-LCA reste en interprétation parallèle',
      },
    },
    block: {
      'block_C2_plus_E-LCC': {
        name: '',
        body: 'Dans cet outil, le reporting d\'entreprise (Q1=D) est chiffré au seul niveau de l\'entreprise (C-LCC) ; il ne peut donc pas être combiné à une E-LCC de réseau. C\'est un choix de conception de T4.6 : D4.2 rattache le type de LCC à la finalité de l\'étude, et non à Q1. Pour chiffrer le réseau, utilisez Q1=A/B/C/E.',
      },
      'block_anyQ1_plus_AbsoluteSLCA': {
        name: '',
        body: 'En contexte de symbiose industrielle, la S-LCA doit être comparative (réglage par défaut). Le mode absolu désactive la méthodologie propre à la symbiose. Choisissez la S-LCA comparative ou retirez SOC de Q3.',
      },
      'block_Q3_emptySelection': {
        name: '',
        body: 'Sélectionnez au moins une dimension de la durabilité (environnementale, économique ou sociale) pour continuer.',
      },
      'block_Q1A_plus_Q5e': {
        name: '',
        body: 'Un échange précis entre deux entreprises ne peut pas être analysé comme un agrégat en boîte noire. Précisez la nature de chaque flux (a/b/c/d) en Q5, ou changez Q1 en B/C.',
      },
    },
  },
  de: {
    rule: {
      'IR-01': {
        name: 'Gemeinsame funktionelle Einheit',
        body: 'Die funktionelle Einheit muss in allen aktiven Dimensionen identisch sein (IR-01).',
      },
      'IR-02': {
        name: 'Übereinstimmende Systemgrenzen',
        body: 'Die Systemgrenze der LCA und die physische Grenze der E-LCC müssen übereinstimmen (IR-02).',
      },
      'IR-03': {
        name: 'Vergleichende S-LCA',
        body: 'Im Kontext industrieller Symbiose muss die S-LCA vergleichend sein; der absolute Modus steht nicht zur Verfügung (IR-03).',
      },
      'IR-04': {
        name: 'Parallele Auswertung',
        body: 'Parallele Auswertung ist zwingend: kein Einzelwert, der mehrere Dimensionen zusammenfasst (IR-04).',
      },
      'IR-05': {
        name: 'Methodische Eigenständigkeit',
        body: 'Jede Dimension behält ihre eigenen Einheiten; eine Normierung über Dimensionen hinweg ist ausgeschlossen (IR-05).',
      },
      'IR-06': {
        name: 'Einheitliche Daten-Governance',
        body: 'Mehrdimensionale Bewertungen von Netzen mit mehreren Akteuren verlangen eine moderierende Stelle und unterzeichnete Vertraulichkeitsvereinbarungen (IR-06).',
      },
      'IR-07': {
        name: 'Identische Referenzszenarien',
        body: 'Der Typ des Referenzszenarios (funktionelle Einheit, Grenzen, Zeithorizont, geografischer Bezug) muss in allen aktiven Dimensionen identisch sein (IR-07).',
      },
      'IR-08': {
        name: 'Gemeinsames Rückgrat MFCA/MFA',
        body: 'Sind LCA und LCC beide aktiv, muss die MFA/MFCA das gemeinsame physische Rückgrat bilden (IR-08).',
      },
      'IR-09': {
        name: 'Abstimmung der Multifunktionalität',
        body: 'Der Qualitätskorrekturfaktor muss für Substitutionsflüsse in LCA und LCC identisch sein (IR-09).',
      },
      'IR-10': {
        name: 'Aggregationsverbot',
        body: 'Für die Öffentlichkeit bestimmte Berichte dürfen keine aggregierten Einzelwerte verwenden (IR-10).',
      },
      'IR-11': {
        name: 'Isomorphie der geschichteten Berichterstattung',
        body: 'Die dreischichtige Berichtsstruktur muss in allen aktiven Dimensionen dieselbe sein (IR-11).',
      },
      'IR-12': {
        name: 'Gemeinsame Modellierung von Transport und Raum',
        body: 'Der Transport ist in allen aktiven Dimensionen abgestimmt zu modellieren, unabhängig von der räumlichen Verteilung (IR-12).',
      },
      'IR-13': {
        name: 'Abstimmung der Investitionsgüter',
        body: 'Die symbiosespezifischen Investitionsgüter sind in LCA und LCC gleich abzuschreiben (IR-13).',
      },
      'IR-14': {
        name: 'Komplementarität der Unsicherheit',
        body: 'Jede Dimension verwendet ihr eigenes Unsicherheitsparadigma; eine Normierung über Dimensionen hinweg ist nicht zulässig (IR-14).',
      },
      'IR-15': {
        name: 'Hierarchie der Nullbewertung',
        body: 'Die vierstufige Zero-Burden-Hierarchie der LCA und der Vermeidbarkeitstest der LCC müssen je Fluss zur selben Einstufung führen (IR-15).',
      },
      'IR-16': {
        name: 'Berechnung nach Entitäten',
        body: 'Die Berechnung erfolgt innerhalb jeder Methode entitätsweise (IR-16).',
      },
      'IR-17': {
        name: 'Screening vor Detailstudie',
        body: 'Die Screening-Studie muss der Detailstudie vorausgehen (IR-17).',
      },
      'IR-18': {
        name: 'Kritische Prüfung öffentlicher Aussagen',
        body: 'Öffentliche Überlegenheitsaussagen (Q4=C) verlangen ein Gremium aus mindestens 3 unabhängigen Fachleuten, das alle aktiven Dimensionen abdeckt (IR-18).',
      },
      'IR-19': {
        name: 'Vergleichende Rahmung',
        body: 'Alle Berichte zur industriellen Symbiose sind als vergleichende Ergebnisse darzustellen, nicht als absolute (IR-19).',
      },
      'IR-20': {
        name: 'Analytische Isomorphie auf drei Ebenen',
        body: 'Jede Methode muss drei Analyseebenen ausweisen, damit die Methoden untereinander vergleichbar sind (IR-20).',
      },
      'CIR-01': {
        name: 'Dynamische Klimaszenarien LCA-LCC',
        body: '',
      },
      'CIR-02': {
        name: 'Pedigree-Matrix LCA+LCC',
        body: '',
      },
      'CIR-03': {
        name: 'GIS-gekoppelte räumliche Modellierung',
        body: '',
      },
      'CIR-04': {
        name: 'Gegenparteirisiko und Perkolation',
        body: '',
      },
      'CIR-05': {
        name: 'Aktivierung der PEF-Formel (CFF)',
        body: '',
      },
      'CIR-06': {
        name: 'Kaskade der Grenzkategorien',
        body: '',
      },
      'CIR-07': {
        name: 'Verfahren zur technischen Hochskalierung',
        body: '',
      },
      'CIR-08': {
        name: 'Stakeholder-Indikatoren für gemeinsames CAPEX',
        body: '',
      },
      'CIR-09': {
        name: 'Protokoll der iterativen Aktualisierung',
        body: '',
      },
      'CIR-10': {
        name: 'Ausfallarten im realen Betrieb',
        body: '',
      },
      'FU-01': {
        name: 'Funktionsorientierte funktionelle Einheit',
        body: 'Die funktionelle Einheit der LCA muss funktionsorientiert sein (maßgeblich ist der Knoten LCA MC-07) (FU-01).',
      },
      'FU-02': {
        name: 'System funktioneller Einheiten (mehrere Akteure)',
        body: 'Symbiosenetze mit mehreren Akteuren verlangen für die Aggregation ein System funktioneller Einheiten (SFU) (FU-02).',
      },
      'FU-03': {
        name: 'Gleichheit von FE und funktioneller Einheit (LCA+LCC)',
        body: 'Sind LCA und LCC aktiv, ist das funktionelle Äquivalent in der Charta zu dokumentieren und muss mit der funktionellen Einheit der LCA übereinstimmen (FU-03).',
      },
      'FU-04': {
        name: 'Doppelte Einheitenebene der S-LCA',
        body: 'Die S-LCA muss sowohl die gemeinsame funktionelle Einheit als auch die stakeholderbezogene Einheit füllen (FU-04).',
      },
      'FU-05': {
        name: 'Einheitlichkeit des Referenzszenarios',
        body: 'Der Typ des Referenzszenarios muss über die aktiven Methoden hinweg einheitlich sein, damit Vergleiche über die funktionelle Einheit tragen (FU-05).',
      },
      'B-01': {
        name: 'Physische E-LCC-Grenze gleich der LCA-Grenze',
        body: 'Die physische Grenze der E-LCC muss der Systemgrenze der LCA entsprechen (B-01).',
      },
      'B-02': {
        name: 'Grenzkonsistenz zwischen den Methoden',
        body: 'Die Systemgrenzen müssen über alle aktiven Methoden hinweg konsistent sein (B-02).',
      },
      'B-03': {
        name: 'Abstimmung der S-LCA-Grenze',
        body: 'Die Grenze der S-LCA ist auf die Systemgrenze der LCA und, bei aktiver E-LCC, auf deren physische Grenze auszurichten (B-03).',
      },
      'B-04': {
        name: 'Territoriale Dimension in der S-LCA verpflichtend',
        body: 'In der S-LCA ist die territoriale Dimension zusätzlich zur organisatorischen verpflichtend (B-04).',
      },
      'B-05': {
        name: 'Expliziter Transport unabhängig von der räumlichen Verteilung',
        body: 'Expliziter Transport sowohl im Vordergrund der LCA als auch in den Kosten der LCC, unabhängig von der räumlichen Verteilung (B-05; D4.1 §13.3.1, D4.2 §4.3).',
      },
      'B-06': {
        name: 'Abstimmung der Abschreibung von Investitionsgütern',
        body: 'Investitionsgüter sind in LCA und LCC einzubeziehen, und die Abschreibungszeiträume müssen übereinstimmen (B-06).',
      },
      'B-07': {
        name: 'Dokumentation abgeschnittener Grenzen',
        body: 'Abschneidungen an den Grenzen sind für jede aktive Dimension transparent in blind_spots zu erklären (B-07).',
      },
    },
    cdp: {
      'CDP-01': {
        name: 'Abweichung bei den verdrängten Produkten',
        body: 'LCA und LCC können bei der Systemerweiterung unterschiedliche verdrängte Produkte ansetzen',
        resolution: 'Gleiches Referenzszenario und gleicher Qualitätsfaktor, durchgesetzt über IR-09',
      },
      'CDP-02': {
        name: 'Uneinigkeit über die Diskontierung',
        body: 'Die LCA verbietet die Diskontierung, die LCC schreibt sie vor',
        resolution: 'Jede behält ihre Konvention (IR-05); die LCC nutzt annualisierte Kosten für die Öko-Effizienz',
      },
      'CDP-03': {
        name: 'Einzelwert gegen NPV',
        body: 'Die S-LCA verbietet den Einzelwert, die LCC liefert einen NPV',
        resolution: 'Parallele Auswertung nach IR-04; der NPV bleibt ein Ergebnis allein der ökonomischen Dimension',
      },
      'CDP-04': {
        name: 'Unterschiedliche Unsicherheitsparadigmen',
        body: 'Die Methoden pflanzen Unsicherheit unterschiedlich fort',
        resolution: 'Quantitativ für LCA und LCC, qualitativ für die S-LCA, nebeneinander berichtet',
      },
      'CDP-05': {
        name: 'Zero-Burden gegen Vermeidbarkeitstest',
        body: 'Die Zero-Burden-Hierarchie der LCA und der Vermeidbarkeitstest der LCC können auseinandergehen',
        resolution: 'Ein einziger vierstufiger Entscheidungsbaum nach IR-15; entschieden durch eine neutrale moderierende Stelle',
      },
      'CDP-06': {
        name: 'Funktionelle Einheit in den drei Methoden verschieden',
        body: 'LCA funktionsorientiert, LCC flussorientiert, S-LCA stakeholderbezogen',
        resolution: 'FU-01 bis FU-05 greifen; maßgeblich ist die funktionsorientierte funktionelle Einheit der LCA',
      },
      'CDP-07': {
        name: 'Abweichende Berichtsarchitekturen',
        body: 'Drei verschiedene Berichtsarchitekturen',
        resolution: 'Einheitliche dreischichtige Berichterstattung nach IR-11, mit mehrstufiger Aufgliederung nach IR-20',
      },
      'CDP-08': {
        name: 'Spannung um Gewichtung und Aggregation',
        body: 'Die LCA verbietet die Gewichtung in der Öffentlichkeit, die S-LCA den Einzelwert; Nutzende wollen eine einzige Zahl',
        resolution: 'Kein Einzelwert in der öffentlichen Kommunikation (IR-10); interne Dashboards bleiben 3 getrennte',
      },
      'CDP-09': {
        name: 'Asymmetrie der Zukunftsprojektion',
        body: 'LCA und LCC projizieren unterschiedlich in die Zukunft; die S-LCA tut es gar nicht',
        resolution: 'LCA und LCC nutzen dieselben SSP/RCP-Szenarien nach CIR-01; die S-LCA bleibt im laufenden Zeitraum',
      },
      'CDP-10': {
        name: 'Ungleicher Rechenaufwand der Methoden',
        body: 'Die Methoden haben sehr unterschiedlichen Rechenaufwand',
        resolution: 'Die Läufe addieren sich, sie multiplizieren sich nicht',
      },
      'CDP-11': {
        name: 'Abweichende Governance-Strukturen',
        body: 'Drei verschiedene Governance-Strukturen (Gremium, Moderation, Beteiligung)',
        resolution: 'Die moderierende Stelle koordiniert; das Gremium prüft unabhängig; die Beteiligung läuft parallel',
      },
      'CDP-12': {
        name: 'Abstimmung von MFCA/MFA zwischen den Methoden',
        body: 'MFCA/MFA passen womöglich weder zum Prozessbaum der LCA noch zu den Stakeholdergruppen der S-LCA',
        resolution: 'MFCA/MFA nur für LCA und LCC; die S-LCA bleibt bei der parallelen Auswertung',
      },
    },
    block: {
      'block_C2_plus_E-LCC': {
        name: '',
        body: 'In diesem Werkzeug wird die Unternehmensberichterstattung (Q1=D) allein auf Unternehmensebene bepreist (C-LCC) und lässt sich daher nicht mit einer E-LCC auf Netzebene verbinden. Das ist eine Entwurfsentscheidung von T4.6: D4.2 knüpft den LCC-Typ an den Zweck der Studie, nicht an Q1. Um das Netz zu bepreisen, verwenden Sie Q1=A/B/C/E.',
      },
      'block_anyQ1_plus_AbsoluteSLCA': {
        name: '',
        body: 'Im Kontext industrieller Symbiose muss die S-LCA vergleichend sein (Voreinstellung). Der absolute Modus schaltet die symbiosespezifische Methodik ab. Wählen Sie die vergleichende S-LCA oder nehmen Sie SOC aus Q3 heraus.',
      },
      'block_Q3_emptySelection': {
        name: '',
        body: 'Wählen Sie mindestens eine Nachhaltigkeitsdimension (Umwelt, Ökonomie oder Soziales), um fortzufahren.',
      },
      'block_Q1A_plus_Q5e': {
        name: '',
        body: 'Ein konkreter Austausch zwischen zwei Unternehmen lässt sich nicht als aggregierte Black Box analysieren. Geben Sie in Q5 die Art jedes Flusses an (a/b/c/d) oder ändern Sie Q1 auf B/C.',
      },
    },
  },
  es: {
    rule: {
      'IR-01': {
        name: 'Unidad funcional compartida',
        body: 'La unidad funcional debe ser idéntica en todas las dimensiones activas (IR-01).',
      },
      'IR-02': {
        name: 'Límites del sistema coherentes',
        body: 'El límite del sistema del LCA y el límite físico del E-LCC deben coincidir (IR-02).',
      },
      'IR-03': {
        name: 'S-LCA comparativo',
        body: 'En contexto de simbiosis industrial el S-LCA debe ser comparativo: el modo absoluto no está disponible (IR-03).',
      },
      'IR-04': {
        name: 'Interpretación paralela',
        body: 'Interpretación paralela obligatoria: ningún puntaje único que agregue dimensiones distintas (IR-04).',
      },
      'IR-05': {
        name: 'Autonomía metodológica',
        body: 'Cada dimensión conserva sus propias unidades: ninguna normalización entre dimensiones (IR-05).',
      },
      'IR-06': {
        name: 'Gobernanza unificada de los datos',
        body: 'Las evaluaciones multidimensionales sobre redes con varios actores exigen un facilitador y acuerdos de confidencialidad firmados (IR-06).',
      },
      'IR-07': {
        name: 'Escenarios de referencia idénticos',
        body: 'El tipo de escenario de referencia (unidad funcional, límites, horizonte temporal, ámbito geográfico) debe ser idéntico en todas las dimensiones activas (IR-07).',
      },
      'IR-08': {
        name: 'Armazón común MFCA/MFA',
        body: 'Cuando el LCA y el LCC están ambos activos, el MFA/MFCA debe ser el armazón físico común (IR-08).',
      },
      'IR-09': {
        name: 'Alineación de la multifuncionalidad',
        body: 'El factor de corrección de la calidad debe ser idéntico en LCA y LCC para los flujos de sustitución (IR-09).',
      },
      'IR-10': {
        name: 'Prohibición de agregar',
        body: 'Los informes dirigidos al público no pueden usar puntajes únicos agregados (IR-10).',
      },
      'IR-11': {
        name: 'Isomorfismo del reporte por capas',
        body: 'La estructura de reporte en tres capas debe ser la misma en todas las dimensiones activas (IR-11).',
      },
      'IR-12': {
        name: 'Modelización conjunta de transporte y espacio',
        body: 'El transporte debe modelizarse de forma coordinada en todas las dimensiones activas, sea cual sea la distribución geográfica (IR-12).',
      },
      'IR-13': {
        name: 'Alineación de los bienes de capital',
        body: 'Los bienes de capital propios de la simbiosis deben amortizarse igual en LCA y en LCC (IR-13).',
      },
      'IR-14': {
        name: 'Complementariedad de la incertidumbre',
        body: 'Cada dimensión usa su propio paradigma de incertidumbre; no se admite normalización entre dimensiones (IR-14).',
      },
      'IR-15': {
        name: 'Jerarquía de la valoración nula',
        body: 'La jerarquía zero-burden de cuatro pasos del LCA y la prueba de evitabilidad del LCC deben dar la misma clasificación, flujo por flujo (IR-15).',
      },
      'IR-16': {
        name: 'Cálculo por entidad',
        body: 'El cálculo procede por entidad dentro de cada método (IR-16).',
      },
      'IR-17': {
        name: 'Screening antes del detalle',
        body: 'El estudio de screening debe preceder al estudio detallado (IR-17).',
      },
      'IR-18': {
        name: 'Revisión crítica para afirmaciones públicas',
        body: 'Las afirmaciones públicas de superioridad (Q4=C) exigen un panel de al menos 3 personas expertas independientes que cubra todas las dimensiones activas (IR-18).',
      },
      'IR-19': {
        name: 'Encuadre comparativo',
        body: 'Todos los informes de simbiosis industrial deben presentarse como resultados comparativos, no absolutos (IR-19).',
      },
      'IR-20': {
        name: 'Isomorfismo analítico de tres niveles',
        body: 'Cada método debe exponer tres niveles de análisis, para que los métodos sean comparables entre sí (IR-20).',
      },
      'CIR-01': {
        name: 'Escenarios climáticos dinámicos LCA-LCC',
        body: '',
      },
      'CIR-02': {
        name: 'Matriz pedigree LCA+LCC',
        body: '',
      },
      'CIR-03': {
        name: 'Modelización espacial acoplada a SIG',
        body: '',
      },
      'CIR-04': {
        name: 'Riesgo de contraparte y percolación',
        body: '',
      },
      'CIR-05': {
        name: 'Activación de la fórmula PEF (CFF)',
        body: '',
      },
      'CIR-06': {
        name: 'Cascada de las categorías de frontera',
        body: '',
      },
      'CIR-07': {
        name: 'Métodos de escalado de ingeniería',
        body: '',
      },
      'CIR-08': {
        name: 'Indicadores de partes interesadas sobre CAPEX compartido',
        body: '',
      },
      'CIR-09': {
        name: 'Protocolo de actualización iterativa',
        body: '',
      },
      'CIR-10': {
        name: 'Modos de fallo en condiciones reales',
        body: '',
      },
      'FU-01': {
        name: 'Unidad funcional orientada a la función',
        body: 'La unidad funcional del LCA debe estar orientada a la función (manda el nodo LCA MC-07) (FU-01).',
      },
      'FU-02': {
        name: 'Sistema de unidades funcionales (varios actores)',
        body: 'Las redes de simbiosis con varios actores exigen un sistema de unidades funcionales (SFU) para agregar (FU-02).',
      },
      'FU-03': {
        name: 'Igualdad EF-UF (LCA+LCC)',
        body: 'Con LCA y LCC activos, el equivalente funcional debe documentarse en la carta del estudio y coincidir con la unidad funcional del LCA (FU-03).',
      },
      'FU-04': {
        name: 'Doble capa de unidades en el S-LCA',
        body: 'El S-LCA debe cumplimentar tanto la unidad funcional compartida como la unidad referida a las partes interesadas (FU-04).',
      },
      'FU-05': {
        name: 'Uniformidad del escenario de referencia',
        body: 'El tipo de escenario de referencia debe ser uniforme entre los métodos activos, para que las comparaciones sobre la unidad funcional sean válidas (FU-05).',
      },
      'B-01': {
        name: 'Límite físico del E-LCC igual al del LCA',
        body: 'El límite físico del E-LCC debe ser igual al límite del sistema del LCA (B-01).',
      },
      'B-02': {
        name: 'Coherencia de límites entre métodos',
        body: 'Los límites del sistema deben ser coherentes entre todos los métodos activos (B-02).',
      },
      'B-03': {
        name: 'Alineación del límite del S-LCA',
        body: 'El límite del S-LCA debe alinearse con el límite del sistema del LCA y, con E-LCC activo, con su límite físico (B-03).',
      },
      'B-04': {
        name: 'Dimensión territorial obligatoria en el S-LCA',
        body: 'En el S-LCA la dimensión territorial es obligatoria, además de la organizativa (B-04).',
      },
      'B-05': {
        name: 'Transporte explícito sea cual sea la distribución geográfica',
        body: 'Transporte explícito tanto en el primer plano del LCA como en los costes del LCC, sea cual sea la distribución geográfica (B-05; D4.1 §13.3.1, D4.2 §4.3).',
      },
      'B-06': {
        name: 'Alineación de la amortización de los bienes de capital',
        body: 'Los bienes de capital deben incluirse tanto en el LCA como en el LCC, y los periodos de amortización deben coincidir (B-06).',
      },
      'B-07': {
        name: 'Documentación de los truncamientos de límite',
        body: 'Los truncamientos de los límites deben declararse de forma transparente en blind_spots para cada dimensión activa (B-07).',
      },
    },
    cdp: {
      'CDP-01': {
        name: 'Divergencia en los productos desplazados',
        body: 'Al ampliar el sistema, el LCA y el LCC pueden usar productos desplazados distintos',
        resolution: 'Mismo escenario de referencia y mismo factor de calidad, impuestos por IR-09',
      },
      'CDP-02': {
        name: 'Desacuerdo sobre el descuento',
        body: 'El LCA prohíbe el descuento; el LCC lo exige',
        resolution: 'Cada uno mantiene su convención (IR-05); el LCC usa costes anualizados para la ecoeficiencia',
      },
      'CDP-03': {
        name: 'Puntaje único frente a NPV',
        body: 'El S-LCA prohíbe el puntaje único; el LCC produce un NPV',
        resolution: 'Interpretación paralela según IR-04; el NPV queda como resultado solo de la dimensión económica',
      },
      'CDP-04': {
        name: 'Paradigmas de incertidumbre distintos',
        body: 'Los métodos propagan la incertidumbre de maneras distintas',
        resolution: 'Cuantitativa para LCA y LCC, cualitativa para el S-LCA, presentadas una al lado de la otra',
      },
      'CDP-05': {
        name: 'Zero-burden frente a prueba de evitabilidad',
        body: 'La jerarquía zero-burden del LCA y la prueba de evitabilidad del LCC pueden divergir',
        resolution: 'Un único árbol de decisión de cuatro pasos según IR-15; lo dirime un facilitador neutral',
      },
      'CDP-06': {
        name: 'Unidad funcional divergente entre los tres métodos',
        body: 'LCA orientado a la función, LCC al flujo, S-LCA a las partes interesadas',
        resolution: 'Se aplican FU-01 a FU-05; manda la unidad funcional orientada a la función del LCA',
      },
      'CDP-07': {
        name: 'Arquitecturas de reporte divergentes',
        body: 'Tres arquitecturas de reporte distintas',
        resolution: 'Reporte único de 3 capas según IR-11, con desagregación en varios niveles según IR-20',
      },
      'CDP-08': {
        name: 'Tensión sobre ponderación y agregación',
        body: 'El LCA prohíbe la ponderación en público y el S-LCA el puntaje único; la gente quiere una sola cifra',
        resolution: 'Ningún puntaje único en la comunicación pública (IR-10); los paneles internos siguen siendo 3 separados',
      },
      'CDP-09': {
        name: 'Asimetría en la proyección al futuro',
        body: 'El LCA y el LCC proyectan al futuro de forma distinta; el S-LCA no lo hace',
        resolution: 'LCA y LCC usan los mismos escenarios SSP/RCP según CIR-01; el S-LCA se queda en el periodo actual',
      },
      'CDP-10': {
        name: 'Coste de cálculo desigual entre métodos',
        body: 'Los métodos tienen un coste de cálculo muy distinto',
        resolution: 'Las ejecuciones se suman, no se multiplican',
      },
      'CDP-11': {
        name: 'Estructuras de gobernanza divergentes',
        body: 'Tres estructuras de gobernanza distintas (panel, facilitador, participación)',
        resolution: 'El facilitador coordina; el panel revisa de forma independiente; la participación va en paralelo',
      },
      'CDP-12': {
        name: 'Alineación MFCA/MFA entre métodos',
        body: 'El MFCA/MFA puede no corresponder al árbol de procesos del LCA ni a los grupos de partes interesadas del S-LCA',
        resolution: 'MFCA/MFA solo para LCA y LCC; el S-LCA se queda en interpretación paralela',
      },
    },
    block: {
      'block_C2_plus_E-LCC': {
        name: '',
        body: 'En esta herramienta el informe corporativo (Q1=D) se costea solo a nivel de empresa (C-LCC), así que no puede combinarse con un E-LCC de red. Es una decisión de diseño de T4.6: D4.2 ata el tipo de LCC a la finalidad del estudio, no a Q1. Para costear la red, usa Q1=A/B/C/E.',
      },
      'block_anyQ1_plus_AbsoluteSLCA': {
        name: '',
        body: 'En contexto de simbiosis industrial el S-LCA debe ser comparativo (ajuste por defecto). El modo absoluto desactiva la metodología propia de la simbiosis. Elige el S-LCA comparativo o quita SOC de Q3.',
      },
      'block_Q3_emptySelection': {
        name: '',
        body: 'Selecciona al menos una dimensión de la sostenibilidad (ambiental, económica o social) para continuar.',
      },
      'block_Q1A_plus_Q5e': {
        name: '',
        body: 'Un intercambio concreto entre dos empresas no puede analizarse como un agregado de caja negra. Especifica la naturaleza de cada flujo (a/b/c/d) en Q5, o cambia Q1 a B/C.',
      },
    },
  },
}

/** Two-letter code: i18next may hand back `it-IT` or `de-AT`. */
function base(lang: string): string {
  return (lang || 'en').split('-')[0].toLowerCase()
}

/**
 * The wording for one schema item in the reader's language, falling back
 * to English for a language we do not carry and for an id the table does
 * not know (a rule added to the schema before this file catches up).
 */
export function schemaTerm(
  lang: string,
  kind: SchemaTermKind,
  id: string,
): SchemaTerm | null {
  const table = SCHEMA_TERMS[base(lang)] ?? SCHEMA_TERMS.en
  return table[kind][id] ?? SCHEMA_TERMS.en[kind][id] ?? null
}
