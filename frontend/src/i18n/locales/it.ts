// Italian. Termini metodologici LCA/LCC/S-LCA + sigle ILCD/PEF/CSRD/MFCA
// /CBA/TEA/IS-01..05 lasciati invariati (sono normativi).

import type { Locale } from './en'

const it: Locale = {
  common: {
    run: 'Esegui',
    reset: 'Reset',
    close: 'Chiudi',
    add: 'Aggiungi',
    remove: 'Rimuovi',
    cancel: 'Annulla',
    notSet: '(non impostato)',
    optional: 'opzionale',
    skip: '(salta)',
    required: 'Obbligatorio',
    examplesAndContext: 'Esempi e contesto',
    yes: 'sì',
    no: 'no',
  },

  eu: {
    fundingStatement:
      'Questo progetto ha ricevuto finanziamento dal programma Horizon Europe Research and Innovation dell\'Unione Europea ai sensi del Grant Agreement N. 101135562.',
    disclaimer:
      'Finanziato dall\'Unione Europea. Le opinioni espresse sono tuttavia quelle dell\'autore o degli autori e non riflettono necessariamente quelle dell\'Unione Europea. Né l\'Unione Europea né l\'autorità che concede il finanziamento possono essere ritenute responsabili.',
  },

  layout: {
    brand: 'SYMBA T4.6',
    brandTag: 'Sistema di Monitoraggio e Reporting per la Simbiosi Industriale',
    about: 'Info',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Premi {{key}} per le scorciatoie',
  },

  adminShell: {
    searchLabel: 'Cerca',
    searchPlaceholder: 'Cerca casi, pathway, partner… (⌘K)',
    footerGa: 'GA',
    footerProgramme: 'Horizon Europe · M22–M36',
    groups: {
      workspace: 'Workspace',
      reports: 'Report',
      system: 'Sistema',
    },
    nav: {
      home: 'Home',
      questionnaire: 'Nuova valutazione',
      cases: 'I miei casi',
      recentResult: 'Ultimo risultato',
      stakeholder: 'Report stakeholder',
      aggregate: 'Dashboard regionale',
      dcf: 'Data Collection File',
      about: 'Info',
    },
  },

  health: {
    backendLabel: 'Backend',
    checking: 'verifica',
    ok: 'OK',
    unreachable: 'irraggiungibile',
    bannerPart1: 'Il backend a',
    bannerPart2:
      "non è raggiungibile. Il questionario funziona ma le esecuzioni della pipeline falliranno finché il backend non torna online.",
  },

  savedStatus: {
    empty: 'Nessuna bozza',
    justNow: 'Bozza salvata · adesso',
    secondsAgo: 'Bozza salvata · {{n}}s fa',
    minutesAgo: 'Bozza salvata · {{n}}m fa',
    hoursAgo: 'Bozza salvata · {{n}}h fa',
  },

  home: {
    title: 'SYMBA T4.6 — Sistema di Monitoraggio e Reporting',
    tagline: 'Metodologia, raccolta dati e report multi-stakeholder per Simbiosi Industriale (LCA / LCC / S-LCA) lungo la value chain bio-based.',
    description:
      'Rispondi a sette domande sul tuo caso di simbiosi industriale. Il motore decisionale deriva il pathway IS terminale (IS-01..IS-05) e una configurazione metodologica completa dai 186 nodi Phase 1 dei deliverable D4.1, D4.2 e D4.3, più le 40 regole cross-method. Poi raccogli i dati con i partner della simbiosi e ottieni il report multi-stakeholder.',
    startButton: 'Avvia nuova valutazione',
    modeLabel: 'Modalità UX',
    modeExpert: 'Esperto',
    modeGuided: 'Guidato',
    modeHint: {
      expert: 'Questionario rapido per analisti IS e revisori che conoscono la terminologia ILCD / LCSA.',
      guided: 'Modalità passo-passo per industriali, rappresentanti di comunità e decisori. Gli esempi sono espansi di default e un banner introduttivo spiega il flusso del questionario.',
    },
  },

  about: {
    title: 'Informazioni',
    p1:
      "SYMBA T4.6 — IS Assessment App è lo strumento operativo del WP4 / T4.6 del progetto SYMBA Horizon Europe. Implementa il motore decisionale a nodi atomici Phase 1 derivato dai deliverable D4.1 (LCA), D4.2 (LCC) e D4.3 (S-LCA), classificando un caso di simbiosi industriale in uno dei cinque pathway IS terminali (IS-01..IS-05) e restituendo una configurazione metodologica completa per LCA, LCC e S-LCA.",
    p2:
      'Le 7 domande utente (Q1-Q7) attivano i 186 nodi Phase 1 più 40 regole cross-method (18 IR + 10 CIR + 5 FU + 7 B). L\'enforcement L3 in fase di reporting (IR-04 + IR-10) più 12 Critical Decision Points emergono per evidenziare tensioni cross-method.',
    p3:
      'Questa build MVP collega il questionario a POST /api/pipeline/run. Display configurazione per pillar, override avanzati e pannello "Mostra ragionamento" sono tutti operativi.',
  },

  error: {
    title: 'Si è verificato un problema',
    backHome: 'Torna alla home',
    fallback: 'Errore inatteso',
  },

  questionnaire: {
    title: 'Questionario',
    guidedBannerTitle: 'Modalità guidata attiva',
    guidedBannerBody:
      'Gli esempi e le spiegazioni contestuali sono espansi di default. Leggi ogni blocco con attenzione — le sette domande determinano il pathway metodologico e il piano di raccolta dati che riceverai al termine.',
    intro:
      'Sette domande sul tuo caso di simbiosi industriale. Q1 e almeno una dimensione Q3 sono obbligatorie; il resto è opzionale ma migliora l\'output del motore.',
    runButton: 'Esegui pipeline',
    runningButton: 'Esecuzione…',
    resetButton: 'Reset bozza',
    confirmReset: 'Scartare tutte le risposte e ricominciare? Operazione non reversibile.',
    q1Required: 'Q1 è obbligatoria.',
    shortcutTip: 'Suggerimento: Ctrl/⌘+Enter per eseguire',

    q1: {
      title: 'Q1 — Cosa stai analizzando? *',
      help:
        "Scegli la corrispondenza più vicina. In caso di ambiguità chiediti: chi è il SOGGETTO del report? (Obbligatorio.)",
      details:
        'A — scambio bilaterale (es. calore di scarto da Impianto X a Impianto Y, o gesso by-product da una centrale termoelettrica a un cementificio). Il soggetto è il FLUSSO CONDIVISO tra due aziende. ' +
        'B — parco eco-industriale o rete simbiotica con 3+ attori (es. Kalundborg, cluster NISP, masterplan di un parco industriale). Il soggetto è la RETE come sistema. ' +
        'C — decisione di policy o programma pubblico a scala regionale/nazionale (es. uno schema di sussidi IS, una cornice regolatoria, una strategia industriale UE). Il soggetto è la DECISIONE/PROGRAMMA, non un impianto specifico. ' +
        'D — singola azienda che quantifica il proprio contributo simbiotico per reportistica ESG / CSRD / sostenibilità (es. "abbiamo venduto 12 kt di scoria ai cementifici, ecco il nostro credito"). Il soggetto è UNA SOLA AZIENDA. ' +
        'E — monitoraggio periodico di una simbiosi già operativa (aggiornamenti KPI annuali, sorveglianza post-implementazione). Il soggetto è la SERIE STORICA, non uno studio una tantum.',
      options: {
        A: { label: 'A. Scambio specifico', description: 'Uno scambio simbiotico tra due aziende esistenti.' },
        B: { label: 'B. Eco-park / rete', description: 'Un parco eco-industriale o una rete simbiotica multi-attore.' },
        C: { label: 'C. Policy / programma', description: 'Una decisione di policy o programma a scala regionale o nazionale.' },
        D: { label: 'D. Report aziendale', description: "Il contributo simbiotico di una singola azienda per reportistica ESG/CSRD." },
        E: { label: 'E. Monitoraggio', description: 'Monitoraggio temporale di una simbiosi già operativa.' },
      },
    },

    q2: {
      title: 'Q2 — In quale fase si trova il sistema?',
      details:
        'A — scambio o parco esistente operativo da anni; sono disponibili dati primari di impianto. (Es. Kalundborg oggi, Sokka 2011 che riporta un IES esistente.) ' +
        'B — costruito di recente o in commissioning; i dati sono in parte misurati, in parte stime ingegneristiche. ' +
        'C — studio di design pre-costruzione; nessun dato operativo misurato; solo modelli ingegneristici. (Es. studio ex-ante Daddi 2017.) ' +
        'D — baseline operativa + uno o più scenari "what-if" futuri da confrontare (es. espansione, ramp-up TRL, mix elettrico decarbonizzato). Scegliendo D si abilita l\'editor degli scenari alternativi sotto.',
      options: {
        A: { label: 'A. Operativo', description: 'Esiste e opera da anni (dati operativi reali).' },
        B: { label: 'B. In costruzione', description: 'In costruzione o appena commissionato.' },
        C: { label: 'C. Fase di progettazione', description: 'Solo in fase di progettazione (nessun dato operativo).' },
        D: { label: 'D. Baseline + alternative', description: 'Baseline esistente + N scenari alternativi futuri.' },
      },
    },

    q3: {
      title: 'Q3 — Quali dimensioni della sostenibilità includere? *',
      help: 'Almeno una è obbligatoria. Default: ENV + ECO.',
      details:
        'ENV — Life Cycle Assessment ambientale (LCA): impatti su clima, ecosistemi, uso di risorse. Quasi sempre selezionata. ' +
        'ECO — dimensione economica; lo strumento di default è LCC (Life Cycle Costing), ma il motore accetta anche MFCA (Material Flow Cost Accounting), CBA (Cost-Benefit Analysis), o TEA (Techno-Economic Analysis) a seconda di Q4 e contesto di reporting. ' +
        'SOC — S-LCA. Selezionarla attiva una catena di regole più lunga (categorie stakeholder worker / community locale / value chain) e forza L1 BLOCK 2 se l\'override avanzato slca_framework_override è impostato a "absolute". ' +
        'La maggior parte dei paper IS pubblicati esegue solo ENV (es. Sokka, Daddi); pochi accoppiano ENV+ECO (Hashimoto, Wiktor); solo una manciata aggiunge SOC.',
      warning: 'Seleziona almeno una dimensione per procedere.',
      env: 'Ambientale (LCA)',
      eco: 'Economica (LCC / MFCA / CBA / TEA)',
      soc: 'Sociale (S-LCA)',
    },

    q4: {
      title: 'Q4 — A cosa serve il report?',
      help: 'Selezione multipla. Alcuni usi si combinano (es. D + E per un paper EU PEF).',
      details:
        'A — uso interno: dashboard di management, screening R&S, decisioni a livello di impianto. Pochi vincoli metodologici. ' +
        'B — comunicazione esterna SENZA claim comparativi (report di sostenibilità, brochure marketing senza affermazioni di tipo "meglio di X"). ' +
        'C — CLAIM pubblico di superiorità ambientale rispetto a un\'alternativa (es. "questo cemento è più verde dell\'OPC"). Attiva la critical review obbligatoria ISO 14044 da 3+ esperti indipendenti e disabilita la pesatura. Usare con cautela. ' +
        'D — allineamento con strumenti di policy UE (disclosure CSRD, digital product passport ESPR, regole di categoria PEFCR). Forza la PEF Circular Footprint Formula via CIR-05. ' +
        'E — pubblicazione accademica peer-reviewed. Richiede piena trasparenza (fonti dati, scelte di allocazione, sensitività). Spesso combinato con B o D. ' +
        'È possibile selezione multipla: un tipico paper PEF sceglie D + E.',
      options: {
        A: { label: 'A. Interno', description: 'Uso interno (gestionale, R&S, pianificazione).' },
        B: { label: 'B. Esterno (no claim)', description: 'Comunicazione esterna senza affermazioni comparative.' },
        C: {
          label: 'C. Claim pubblico di superiorità',
          description: 'Affermazione pubblica di superiorità ambientale.',
          warn: 'Attiva la revisione OBBLIGATORIA del panel di 3+ esperti indipendenti (ISO 14044), pesatura non consentita.',
        },
        D: {
          label: 'D. Allineamento policy UE',
          description: 'Allineamento policy UE (CSRD, ESPR, PEFCR).',
          warn: 'Attiva la PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Pubblicazione accademica', description: 'Pubblicazione peer-reviewed accademica.' },
      },
    },

    q5: {
      title: 'Q5 — Natura di ogni flusso simbiotico (per flusso)',
      help:
        'Aggiungi una riga per ogni flusso simbiotico principale e scegli la categoria Q5. Obbligatorio per Q1 ∈ {A, B, D}; opzionale altrimenti.',
      details:
        'Per ogni flusso principale scambiato tra attori (calore, CO₂, scoria, acque reflue, idrogeno…) scegli la relazione economica: ' +
        'a — A paga B per portare via il flusso (il flusso è un RIFIUTO per A): tipico contratto di smaltimento. Attiva regole di allocazione paradigma-rifiuto. ' +
        'b — flusso scambiato GRATUITAMENTE (status ambiguo): il motore instrada alla catena di disambiguazione free-flow. ' +
        'c — B paga A per il flusso (il flusso è un CO-PRODOTTO per A): attiva regole di allocazione economica e il path PEF Circular Footprint Formula. ' +
        'd — flusso INTERDIPENDENTE: nessuna delle due parti potrebbe operare senza l\'altra; trattato come sistema integrato, spesso con system expansion. ' +
        'e — AGGREGATO / black-box: il caso pubblicato non fornisce dettaglio per-flusso (tipico dei paper IES aggregati come Sokka 2011). ' +
        'Per studi di policy a livello Q1=C, Q5 è di solito opzionale.',
    },

    q6a: {
      title: 'Q6a — Settore',
      help:
        '14 settori canonici secondo WorkingDoc §3 + Altro. Le attivazioni sector-specific dei nodi (es. lca_mc_30 wastewater) leggono questo enum.',
      details:
        'Il settore controlla un piccolo set di attivazioni sector-specific dei nodi e i default di overlay. Scegli la corrispondenza più vicina al settore dominante del caso (l\'attore che contribuisce più massa/energia/valore). ' +
        'Esempi: pulp_paper per Sokka 2011 (UPM Kymi); chemicals_fertilizers per Hashimoto / Wiktor; cement_construction per Leiva 2025 Escombreras; biobased_polymers per Briassoulis; food_production / agri-food per Daddi. ' +
        'Per casi misti usa multi_sector. Le voci "(legacy)" in fondo esistono per il caricamento backward-compatible delle vecchie fixture — preferisci la nuova lista a 14 settori.',
      options: {
        none: '(nessuno)',
        agriculture_agrifood_biorefineries: 'Agricoltura / agroalimentare / bioraffinerie',
        biobased_polymers: 'Polimeri bio-based',
        plastics_packaging: 'Plastiche e packaging',
        pulp_paper: 'Pulp & paper',
        chemicals_fertilizers: 'Chimica / fertilizzanti',
        cement_construction: 'Cemento / costruzioni',
        steel_metals: 'Acciaio e metalli',
        energy_utilities: 'Energia / utilities',
        wastewater_sludge_biofactories: 'Acque reflue / fanghi / biofactories',
        textile_leather: 'Tessile / pelletteria',
        waste_valorization: 'Valorizzazione rifiuti',
        food_production: 'Produzione alimentare',
        multi_tenant_urban_building: 'Edificio urbano multi-tenant',
        multi_sector: 'Multi-settore',
        other: 'Altro (specificare)',
        wastewater_biofactories: 'Acque reflue / fanghi / biofactories (legacy)',
        agri_food: 'Agroalimentare / bioraffinerie (legacy)',
        process_industry: 'Industria di processo (legacy)',
      },
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL della tecnologia dominante o critica nella rete simbiotica. Determina la scelta della qualità dei dati di inventory (misurati vs letteratura vs stima ingegneristica) e il budget di incertezza downstream. ' +
        'TRL 9 = pieno funzionamento commerciale (Kalundborg, Sokka). ' +
        'TRL 7-8 = pilota first-of-a-kind / unità pre-commerciale. ' +
        'TRL 5-6 = prototipo lab-validated, demo a scala rilevante. ' +
        'TRL <5 = R&S iniziale, solo bench-scale — grande incertezza, scenari raccomandati.',
      options: {
        TRL9: 'TRL 9 — pienamente operativo',
        'TRL7-8': 'TRL 7-8 — pilota / pre-commerciale',
        'TRL5-6': 'TRL 5-6 — prototipo',
        'TRL<5': 'TRL <5 — R&S iniziale',
      },
    },

    q7: {
      title: 'Q7 — Distribuzione geografica',
      help: 'Se le coordinate degli attori vengono caricate in seguito, può essere auto-inferita e mostrata come info.',
      details:
        'La distribuzione geografica modifica il peso relativo dei trasporti in inventory e può attivare CIR-03 se l\'override avanzato transport_sensitive=true. ' +
        'A — co-locati nello stesso sito (<5 km, es. Kalundborg, parco eco-industriale). I trasporti sono essenzialmente trascurabili. ' +
        'B — cluster regionale (5-100 km, stessa regione — tipico Sokka 2011 / Hashimoto). ' +
        'C — area ampia, cross-regione o transfrontaliero (>100 km). Modalità e distanza di trasporto diventano voci di inventory non-banali. ' +
        'D — programmi multi-scala nazionali o industria-wide (studi di policy Q1=C, geograficamente variabili).',
      options: {
        A: { label: 'A. Co-locati', description: 'Eco-park, <5 km tra gli attori.' },
        B: { label: 'B. Regionale', description: '5-100 km, stessa regione.' },
        C: { label: 'C. Area ampia', description: '>100 km, cross-regione o transfrontaliero.' },
        D: { label: 'D. Multi-scala', description: 'Nazionale / industria-wide, distanze variabili.' },
      },
    },

    q2dCard: {
      title: 'Q2-D — Scenari alternativi',
      help:
        'Definisci uno o più scenari alternativi futuri da confrontare con la baseline. Attiva il background dinamico SSP/RCP e il supporto matrice-scenari downstream.',
    },

    advancedCard: {
      title: 'Override avanzati (modalità esperto)',
      activeKeys_one: '{{count}} chiave attiva',
      activeKeys_other: '{{count}} chiavi attive',
    },
  },

  flows: {
    emptyHint: 'Nessun flusso. Aggiungine almeno uno per caratterizzare la Q5 per-flusso.',
    headers: { id: 'ID', name: 'Nome', q5: 'Q5' },
    namePlaceholder: 'es. calore, CO2',
    addButton: 'Aggiungi flusso',
    removeAria: 'Rimuovi {{id}}',
    options: {
      a: 'a — A paga B (rifiuto)',
      b: 'b — Scambio gratuito (ambiguo)',
      c: 'c — B paga A (co-prodotto)',
      d: 'd — Interdipendente',
      e: 'e — Aggregato / black-box',
    },
  },

  scenarios: {
    intro:
      'Aggiungi una riga per ogni scenario alternativo da confrontare con la baseline. Il dict di overrides (delta delle risposte Q vs baseline) viene configurato nell\'editor avanzato; per ora ogni scenario porta una mappa di overrides vuota.',
    emptyHint: 'Nessuno scenario alternativo.',
    headers: { id: 'ID', label: 'Etichetta' },
    labelPlaceholder: 'es. Espansione futura / TRL9 ramp-up',
    addButton: 'Aggiungi scenario',
    removeAria: 'Rimuovi {{id}}',
  },

  advanced: {
    intro:
      'Override modalità esperto. Ogni chiave è letta dal motore via dict.get; le chiavi mancanti significano "usa il default". I valori vengono coerciti a true/false/numero/stringa secondo necessità.',
    headers: { key: 'Chiave', value: 'Valore', hint: 'Suggerimento', custom: 'custom' },
    addCustom: 'Aggiungi chiave custom',
    clearAria: 'Pulisci {{key}}',
    removeAria: 'Rimuovi {{key}}',
    hints: {
      slca_framework_override: "Imposta a 'absolute' per testare L1 BLOCK 2 (con Q3.soc=true)",
      asset_lifetime: 'Anni; >15 attiva lca_mc_21, lcc_hc_23, CIR-01',
      transport_sensitive: 'Booleano; true attiva CIR-03',
      network_nodes: 'Intero; ≥3 (con Q1=B + interdependent_flows) attiva CIR-04',
      interdependent_flows: 'Booleano; true (con Q1=B + network_nodes≥3) attiva CIR-04',
      frontier_categories_active: 'Booleano; true attiva CIR-06',
      is_specific_capital_goods: 'Booleano; true attiva IR-13 / B-06 / CIR-08',
      multi_actor: 'Booleano; true (con Q1∈{B,C}) attiva FU-02',
    },
  },

  result: {
    title: 'Output del motore',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'Situazione ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activatedNodes: 'Nodi attivati',
      l1Blocks: 'BLOCK L1 attivati',
      l2Violations: 'Violazioni L2',
      l3Cdps: 'CDP L3 emersi',
      extended: '(esteso)',
    },
    blocked: {
      title: 'Pipeline bloccata a L1',
      desc: 'Il motore si è fermato a L1. Nessuna logica di attivazione, L2 o L3 è stata eseguita. Risolvi il/i vincolo/i bloccante/i sotto e ri-esegui:',
    },
    toggleShow: 'Mostra ragionamento',
    toggleHide: 'Nascondi ragionamento',
    rawJson: 'Risposta JSON grezza',
    actions: {
      adjust: 'Modifica risposte',
      startFresh: 'Ricomincia (cancella tutto)',
      downloadJson: 'Scarica caso (.json)',
      downloadReport: 'Scarica report (.docx)',
      downloadingReport: 'Generazione report…',
      reportError: 'Generazione report fallita',
      runScenarios: 'Esegui scenari',
      runningScenarios: 'Esecuzione scenari…',
    },
    confirmStartFresh: 'Scartare il caso corrente e ricominciare? Operazione non reversibile.',
    noResult: { title: 'Nessun risultato', desc: 'Invia un questionario per vedere l\'output del motore qui.', cta: 'Apri questionario' },
    error: { title: 'Errore della pipeline', back: 'Torna al questionario' },
  },

  scenariosResult: {
    title: 'Confronto scenari',
    description: 'Pipeline eseguita per la baseline + {{n}} scenari alternativi. Differenze evidenziate vs baseline.',
    backToResult: 'Torna al risultato singolo',
    columns: {
      scenario: 'Scenario',
      pathway: 'Pathway',
      ilcd: 'ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activated: 'Attivati',
      blocks: 'BLOCK L1',
      violations: 'Violazioni L2',
      cdps: 'CDP L3',
    },
    baselineLabel: 'Baseline',
    diffSuffix: '(diff)',
    overrideHelp: 'Ogni scenario eredita Q1-Q7 dalla baseline; popola overrides (dict JSON) per scenario per differenziare. Overrides vuoti → stesso caso della baseline.',
    overridesPlaceholder: 'es. {"q1": "C"} oppure {"q3": {"env": true, "eco": true}}',
    overridesParseError: 'Overrides devono essere JSON valido per {{id}}',
  },


  reasoning: {
    activatedNodes: 'Nodi attivati ({{count}})',
    pillarConfigs: 'Configurazioni per pillar',
    noPillarValues: 'Nessun valore di pillar scritto.',
    l2Violations: 'Violazioni regole L2 ({{count}})',
    noViolations: 'Nessuna violazione.',
    l3Cdps: 'Critical Decision Points L3 ({{count}})',
    noCdps: 'Nessun CDP emerso.',
    pillarKeys: '{{count}} chiavi',
    resolution: 'Risoluzione',
    filterPlaceholder: 'Filtra per ID nodo…',
    noMatch: 'Nessun nodo corrisponde al filtro.',
    showingFiltered: '{{shown}} di {{total}} mostrati',
  },

  loading: { default: 'Esecuzione pipeline…' },

  shortcuts: {
    title: 'Scorciatoie da tastiera',
    closeHint: 'Premi {{esc}} o clicca fuori per chiudere.',
    items: {
      help: 'Mostra questo aiuto scorciatoie',
      run: 'Esegui pipeline',
      runContext: 'Questionario',
      toggleReasoning: 'Mostra/nascondi pannello reasoning',
      toggleReasoningContext: 'Risultato',
      print: 'Stampa pagina risultato',
      printContext: 'Risultato',
      esc: 'Chiudi questa finestra',
    },
  },

  preset: {
    title: 'Carica un caso pubblicato come preset',
    help:
      '13 fixture dal sample di validazione (12 paper + Leiva Escombreras / Frövi). Carica le risposte Q1-Q7 + Q5 per-flusso nel questionario per ispezionare ed eseguire il motore end-to-end.',
    loadButton: 'Carica preset',
    rationaleToggle: 'Perché queste risposte? (rationale di compilazione)',
  },

  toast: {
    pipelineCompleted: 'Pipeline completata in {{ms}} ms — pathway {{pathway}}',
    pipelineError: 'Errore pipeline — {{detail}}',
    scenariosCompleted: '{{n}} scenari eseguiti',
    scenariosError: 'Esecuzione scenari fallita — {{detail}}',
  },

  language: {
    label: 'Lingua',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },

  auth: {
    title: 'Accedi',
    subtitle:
      'Opzionale per consultare i casi legacy / pubblici. Necessario per creare casi privati o utilizzare la dashboard regionale per conto di un\'organizzazione.',
    tabLogin: 'Accedi',
    tabRegister: 'Crea account',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    passwordHelp: 'Almeno 8 caratteri.',
    submitLogin: 'Accedi',
    submitRegister: 'Crea account',
    submitting: 'Invio in corso…',
    skipLink: 'Continua senza accedere',
    signIn: 'Accedi',
    logout: 'Esci',
  },

  stakeholder: {
    navLink: 'Report stakeholder',
    title: 'Report stakeholder',
    subtitle:
      'Vista multi-stakeholder del caso. Cambia tab per vedere le informazioni adattate per ogni audience lungo la value chain bio-based.',
    openButton: 'Apri report stakeholder',
    backToResult: 'Torna al risultato',
    openDcf: 'Apri Data Collection File',
    loadingScoring: 'Caricamento dati di scoring…',
    tabs: {
      industry: 'Industria',
      community: 'Comunità',
      authority: 'Autorità locale',
      'end-user': 'End user',
    },
    framing: {
      industry:
        'Vista tecnica completa della configurazione metodologica e dello scoring quantitativo prodotto da CIRCE. Per analista IS e revisore metodologico.',
      community:
        'Vista impatto locale focalizzata su qualità ambientale e benefici sociali che la simbiosi porta al territorio ospitante.',
      authority:
        'Vista regolatoria e di policy: compliance del pathway, peer-review, claim pubblici, allineamento EU PEF.',
      'end-user':
        'Vista riassuntiva per gli end user dei prodotti e servizi derivati dalla simbiosi.',
    },
    pathwaySummaryTitle: 'Riassunto pathway',
    labels: {
      pathway: 'Pathway',
      ilcd: 'Situazione ILCD',
      lcc: 'Tipo LCC',
      slca: 'Attivazione S-LCA',
    },
    scoringTitle: 'Scoring (CIRCE)',
    scoringPendingTitle: 'Dati di scoring non ancora disponibili',
    scoringPendingBody:
      'Lo scoring LCSA prodotto da CIRCE per questo caso non è ancora stato consegnato. Quando CIRCE caricherà il payload quantitativo, gli indicatori appariranno qui raggruppati per rilevanza per stakeholder.',
    scoringEmpty: 'Nessun indicatore rilevante per questo stakeholder.',
    indicatorPending: 'in attesa',
    engineDetailsTitle: 'Dettagli pipeline engine',
    activatedNodesCount: '{{count}} nodo/i metodologico/i attivato/i',
    ruleViolations: '{{count}} violazione/i di regola',
    cdpFlagsCount: '{{count}} tensione/i cross-dimensionale/i',
    complianceTitle: 'Segnali di compliance',
    compliance: {
      peerReview: 'Claim peer-review (Q4=E): {{status}}',
      pef: 'Allineamento EU PEF (Q4=D): {{status}}',
      publicClaim: 'Claim pubblico di superiorità (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Dashboard regionale',
    title: 'Dashboard regionale / settoriale',
    subtitle:
      'Breakdown di tutti i casi salvati per pathway, settore, ambito geografico e situazione ILCD. Per autorità locali e analisti di policy.',
    openButton: 'Apri dashboard regionale',
    backToCases: 'Torna ai casi',
    loading: 'Caricamento dati aggregati…',
    errorTitle: 'Caricamento dati aggregati fallito',
    errorNoData: 'Il server non ha restituito dati.',
    totalLabel: 'Totale casi salvati',
    noData: '(nessun dato)',
    tableKey: 'Valore',
    tableCount: 'Conteggio',
    breakdownTitle: {
      byPathway: 'Per pathway (IS-01 … IS-05)',
      bySector: 'Per settore (Q6a)',
      byScope: 'Per ambito geografico (Q7)',
      byIlcd: 'Per situazione ILCD',
    },
  },

  dcf: {
    navLink: 'Raccolta dati',
    title: 'Data Collection File',
    subtitle:
      'Calibrato sul pathway derivato. Scarica il foglio Excel per raccogliere i dati di inventario con i partner della simbiosi, poi torna qui per il report finale.',
    loading: 'Sto componendo il Data Collection File…',
    errorTitle: 'Generazione Data Collection File fallita',
    errorNoPayload: 'Il server non ha restituito un payload.',
    backToResult: 'Torna al risultato',
    networkTitle: 'Diagramma di rete',
    downloadXlsx: 'Scarica Excel (.xlsx)',
    downloadingXlsx: 'Preparazione Excel…',
    downloadDocx: 'Scarica documento di accompagnamento (.docx)',
    downloadingDocx: 'Preparazione documento…',
    downloadError: 'Download fallito',
    footerNote:
      'Il Data Collection File è un foglio di raccolta dati pronto per l\'export. Compila le righe vuote offline (o distribuiscilo ai partner del network) e restituisci i dati all\'analista responsabile dell\'LCSA.',
    openButton: 'Apri Data Collection File',
  },

  cases: {
    navLink: 'I miei casi',
    title: 'I miei casi',
    intro: 'Casi salvati sul server. Carica per popolare il questionario, o elimina per rimuovere definitivamente.',
    empty: 'Nessun caso salvato. Salva un caso dal questionario o dalla result page.',
    columns: {
      name: 'Nome',
      pathway: 'Pathway',
      updated: 'Aggiornato',
    },
    loadButton: 'Carica',
    deleteButton: 'Elimina',
    confirmDelete: 'Eliminare "{{name}}" definitivamente? Operazione non reversibile.',
    saveButton: 'Salva caso',
    saveAsButton: 'Salva come nuovo…',
    saveTitle: 'Salva caso',
    namePlaceholder: 'Nome del mio caso',
    saveDialog: 'Salva il caso corrente sul server. Scegli un nome per identificarlo in futuro.',
    saving: 'Salvataggio…',
    saveError: 'Salvataggio fallito — {{detail}}',
    saveSuccess: 'Salvato come "{{name}}"',
    loadError: 'Caricamento fallito — {{detail}}',
    deleteError: 'Eliminazione fallita — {{detail}}',
  },
}

export default it
