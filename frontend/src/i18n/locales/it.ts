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
    methodologicalNote: 'Nota metodologica completa',
    yes: 'sì',
    no: 'no',
  },

  // Funding acknowledgement, worded as on the SYMBA website footer.
  eu: {
    emblemAlt: 'Finanziato dall\'Unione europea',
    fundingStatement: 'Finanziato dall\'Unione Europea ai sensi del Grant Agreement N. 101135562.',
    disclaimer:
      'Le opinioni espresse sono tuttavia quelle dell\'autore o degli autori e non riflettono necessariamente quelle dell\'Unione Europea. Né l\'Unione Europea né l\'Agenzia esecutiva europea per la ricerca possono essere ritenute responsabili.',
  },

  footer: {
    logoAlt: 'Symba Project',
    logoTitle: 'Vai al sito del progetto SYMBA',
    toolLine: 'Monitoring & Reporting System · Task T4.6',
    followUs: 'Seguici',
    projectInfo: 'Informazioni sul progetto',
    projectWebsite: 'Sito del progetto',
    publicDeliverables: 'Deliverable pubblici',
    copyright: 'Copyright © {{year}} Symba Project, tutti i diritti riservati.',
    privacy: 'Informativa sulla privacy',
    cookies: 'Archiviazione nel browser',
  },

  siteHeader: {
    logoAlt: 'Symba Project',
    logoTitle: 'Vai al sito del progetto SYMBA',
    navLabel: 'Sito del progetto SYMBA',
    menuOpen: 'Apri il menu',
    menuClose: 'Chiudi il menu',
    backToSite: 'Sito del progetto',
    tool: 'Monitoraggio',
    // Labels of the sections of the project website, which is in English.
    nav: {
      about: 'About',
      project: 'Project',
      partners: 'Partners',
      news: 'News & Events',
      download: 'Download',
      contact: 'Contact Us',
    },
  },

  layout: {
    brand: 'SYMBA T4.6',
    brandTag: 'Sistema di Monitoraggio e Reporting per la Simbiosi Industriale',
    about: 'Info',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Premi {{key}} per le scorciatoie',
  },

  share: {
    buttonLabel: 'Condividi report',
    title: 'Condividi questo report',
    lead: 'Manda uno di questi URL a uno stakeholder. Stesso caso, cornice diversa per ogni audience — nessun login necessario per aprirli.',
    close: 'Chiudi',
    done: 'Fatto',
    copy: 'Copia',
    copied: 'Copiato ✓',
    copyFailed: 'Copia fallita — copia l\'URL manualmente.',
    saveFirstTitle: 'Salva prima il caso',
    saveFirstBody: 'Gli URL di condivisione richiedono un case id salvato. Clicca "Salva come nuovo…" qui sotto, poi riapri la finestra di condivisione.',
    audience: {
      industry: '🏭 Industria',
      community: '🌳 Comunità',
      authority: '🏛 Autorità locale',
      enduser: '👤 End user',
    },
  },

  reader: {
    tagline: 'Report pubblico',
    loading: 'Caricamento del report…',
    notFoundTitle: 'Report non trovato',
    notFoundBody: 'Il link che hai seguito potrebbe essere errato o il caso è stato rimosso.',
    aboutLink: 'Scopri SYMBA',
    eyebrow: 'Report condiviso · {{name}}',
    summaryTitle: 'Riassunto del pathway',
    summary: {
      pathway: 'Pathway',
      ilcd: 'Situazione ILCD',
      lcc: 'Tipo LCC',
      slca: 'Stato S-LCA',
      sector: 'Settore',
      scope: 'Ambito geografico',
    },
    scoringTitle: 'Scoring',
    complianceTitle: 'Segnali di compliance',
    compliance: {
      peer: { name: 'Claim peer-review', desc: 'Q4 = E · idoneità revisore ISO 14044' },
      pef: { name: 'Allineamento EU PEF', desc: 'Q4 = D · Circular Footprint Formula' },
      public: { name: 'Claim pubblico di superiorità', desc: 'Q4 = C · panel ISO obbligatorio' },
      dnsh: { name: 'Verifica DNSH', desc: 'Do No Significant Harm · EU Taxonomy art. 17' },
    },
    audience: {
      showingFor: 'Vista per — {{name}}',
      industry: { short: '🏭 Industria', name: 'Industria', title: 'Vista operatore', body: 'Quadro tecnico completo della configurazione metodologica per chi gestisce la simbiosi.' },
      community: { short: '🌳 Comunità', name: 'Comunità', title: 'Vista impatto locale', body: 'Qualità ambientale e benefici sociali che la simbiosi porta al territorio ospitante.' },
      authority: { short: '🏛 Autorità', name: 'Autorità locale', title: 'Vista regolatoria e di policy', body: 'Compliance del pathway, peer-review, claim pubblici, allineamento EU PEF, DNSH.' },
      enduser: { short: '👤 End user', name: 'End user', title: 'Riassunto end-user', body: 'Take-away semplici sui prodotti e servizi derivati dalla simbiosi.' },
    },
    note: 'Questo report è generato dal motore SYMBA T4.6. La cornice narrativa cambia per audience; i dati sottostanti sono gli stessi.',
    about: {
      eyebrow: 'Cos\'è SYMBA T4.6',
      title: 'Report pubblici · in breve',
      lead:
        'Qualcuno ha condiviso un caso con te.',
      whoTitle: 'Chi c\'è dietro?',
      whoBody: 'SYMBA è un progetto Horizon Europe (GA 101135562, M22–M36) che sviluppa strumenti aperti e metodologicamente solidi per la simbiosi industriale nell\'ecosistema bio-based. Il task T4.6 è il sistema di monitoraggio e reporting.',
      whatTitle: 'Cos\'è un "report"?',
      whatBody: 'Un report condiviso descrive un caso di simbiosi industriale: chi coopera, come sono valutati i benefici ambientali / economici / sociali, quali scelte metodologiche sono state fatte. Stesso caso, quattro cornici narrative per quattro audience.',
      whereTitle: 'Dove trovo altre informazioni?',
      whereBody: 'Visita il sito del progetto o leggi le deliverable su',
      enterTool: 'Entra nel tool',
    },
    region: {
      eyebrow: 'Regione · {{code}}',
      title: 'Dashboard regionale',
      lead: 'Vista aggregata di tutti i casi IS di questa regione. I numeri si aggiornano quando nuovi casi vengono salvati.',
      total: 'Casi',
      pathways: 'Pathway coperti',
      sectors: 'Settori coperti',
      byPathwayTitle: 'Per pathway',
      bySectorTitle: 'Per settore',
      tableKey: 'Valore',
      tableCount: 'Conteggio',
      errorTitle: 'Regione non disponibile',
      errorBody: 'Impossibile ottenere i dati aggregati per questa regione.',
    },
  },

  welcome: {
    title: 'Benvenuto in SYMBA T4.6',
    lead:
      "Questo strumento capisce quale metodologia richiede il tuo caso di simbiosi industriale e quali dati devi raccogliere. Non calcola i risultati ambientali, economici o sociali. Due domande veloci e ti portiamo dove serve — puoi cambiarle dopo, dal menu dentro lo strumento.",
    step1: { title: 'Chi sei?' },
    step2: { title: 'Cosa vuoi fare?' },
    back: 'Indietro',
    next: 'Continua',
    finish: 'Portami dentro',
    skip: 'Salta per ora',
    roles: {
      analyst: { name: 'Analista di sostenibilità', desc: 'Practitioner IS, revisore LCA/LCC/S-LCA, metodologo.' },
      industry: { name: 'Operatore industriale', desc: 'Gestisci un impianto o un sito in una rete IS.' },
      authority: { name: 'Autorità locale', desc: 'Comune, regione, analista di policy per il territorio.' },
      community: { name: 'Rappresentante di comunità', desc: 'Associazione, ONG, gruppo di cittadini del territorio ospitante.' },
      enduser: { name: 'End user / cittadino', desc: 'Usi prodotti o servizi derivati dalla simbiosi.' },
      unknown: { name: 'Non lo so ancora', desc: 'Va bene — ti portiamo sulla pagina di panoramica.' },
    },
    tasks: {
      assess: { name: 'Avvia una nuova valutazione', desc: 'Configura la metodologia per un caso IS in dieci domande.' },
      read: { name: 'Leggi un report condiviso', desc: 'Apri un caso che qualcuno ha condiviso e leggi il report.' },
      explore: { name: 'Esplora una regione / settore', desc: 'Naviga insights aggregati per la tua zona o industria.' },
      browse: { name: 'Solo dare un\'occhiata', desc: 'Nessun obiettivo specifico — voglio vedere cosa fa il tool.' },
    },
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
      changeRole: 'Cambia ruolo',
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
      'Rispondi a dieci domande sul tuo caso di simbiosi industriale. Il motore decisionale deriva il pathway IS terminale (IS-01..IS-05) e una configurazione metodologica completa dai 186 nodi Phase 1 dei deliverable D4.1, D4.2 e D4.3, più le 40 regole cross-method. Poi raccogli i dati con i partner della simbiosi e ottieni il report multi-stakeholder.',
    startButton: 'Avvia nuova valutazione',
    modeLabel: 'Modalità UX',
    modeExpert: 'Esperto',
    modeGuided: 'Guidato',
    modeHint: {
      expert: 'Questionario rapido per analisti IS e revisori che conoscono la terminologia ILCD / LCSA.',
      guided: 'Modalità passo-passo per industriali, rappresentanti di comunità e decisori. Ogni domanda ha una spiegazione in parole semplici; la nota metodologica completa resta a un click.',
    },
    hero: {
      title: 'Avvia una nuova valutazione IS',
    },
    openCasesLink: 'Oppure apri un caso salvato',
    kpi: {
      savedCases: 'Casi salvati',
      savedCasesDetail: 'di tutti gli utenti',
      withPathway: 'Con pathway',
      withPathwayDetail: '{{total}} totali',
      uniquePathways: 'Pathway unici',
      uniquePathwaysDetail: 'IS-01 … IS-05',
      language: 'Disponibile in',
      languageDetail: '5 lingue UI',
    },
    presetsTitle: 'Casi di studio validati',
    presetsMeta: '13 fixture da paper peer-reviewed',
  },

  privacy: {
    "title": "Privacy e conservazione dei dati",
    "draft": "BOZZA per revisione legale — non è ancora l'informativa definitiva. Le voci tra [parentesi quadre] devono essere completate dal titolare di questa installazione.",
    "updated": "Versione: bozza 1, 2026-10-04.",
    "sections": [
      {
        "id": "controller",
        "title": "1. Chi è responsabile",
        "paragraphs": [
          "[SEGNAPOSTO — il partner SYMBA che gestisce questo sottodominio: nome, indirizzo, contatto. Da completare a cura del proprietario.]",
          "Il sito del progetto https://www.symbaproject.eu/ ha una propria informativa, che riguarda il sito. Questa pagina riguarda questo strumento."
        ],
        "items": []
      },
      {
        "id": "what",
        "title": "2. Cosa fa questo strumento",
        "paragraphs": [
          "Aiuta chi si occupa di simbiosi industriale a configurare il percorso metodologico di uno studio di ciclo di vita e a preparare il file di raccolta dati e i report (progetto Horizon Europe SYMBA, Grant Agreement 101135562, task T4.6). Non calcola risultati ambientali, economici o sociali."
        ],
        "items": []
      },
      {
        "id": "data",
        "title": "3. Cosa conserviamo",
        "paragraphs": [],
        "items": [
          "Il tuo account: indirizzo email, un hash bcrypt della password (mai la password), il ruolo e la data di creazione. L'email è anche dentro il token di accesso (valido 12 ore) che il browser conserva. La registrazione è aperta a tutti salvo che il gestore la chiuda; solo l'indirizzo del gestore diventa amministratore.",
          "I casi che salvi: nome, risposte al questionario, flussi, siti facoltativi (coordinate, paese), il contenuto del file di raccolta dati (nomi degli attori, ruoli di contatto, costi), i dati di scoring, il proprietario e il nome del link pubblico se condividi un report.",
          "Log tecnici: il log di accesso del server registra l'indirizzo IP del visitatore, l'ora, il percorso e lo stato di ogni richiesta; finisce nel log del container dell'host, ruotato su 5 file da 10 MB. [SEGNAPOSTO — log del reverse proxy o del terminatore TLS davanti allo strumento.]",
          "Nel tuo browser (local storage, non cookie): symba-auth (accesso), symba-case-draft e symba-dcf-draft (lavoro non salvato), symba-preferences e symba-language. Lo strumento non imposta cookie e carica i font dal proprio server, senza richieste a terzi."
        ]
      },
      {
        "id": "purposes",
        "title": "4. Perché, e su quale base giuridica",
        "paragraphs": [
          "[SEGNAPOSTO — finalità e base giuridica, da completare a cura del titolare: gestione dello strumento e degli account per il progetto SYMBA (GA 101135562), sicurezza del servizio.]"
        ],
        "items": []
      },
      {
        "id": "recipients",
        "title": "5. Chi può vederli",
        "paragraphs": [
          "Fornitore di hosting: [SEGNAPOSTO]. I link del tipo /r/… sono non elencati, non privati: chiunque abbia il link può leggere quel report. I casi salvati senza accedere possono oggi essere letti e modificati da chiunque raggiunga lo strumento, e l'amministratore (il primo account registrato) può leggere e modificare ogni caso, anche quelli di altri: non inserire dati personali di terzi."
        ],
        "items": []
      },
      {
        "id": "storage",
        "title": "6. Per quanto tempo, e come cancellare",
        "paragraphs": [
          "Nulla viene cancellato automaticamente. Puoi cancellare i tuoi casi e il contenuto del file di raccolta dati di un caso dallo strumento. La cancellazione dell'account non è ancora in autonomia: scrivi a [SEGNAPOSTO — contatto]. Backup: [SEGNAPOSTO — frequenza e conservazione]."
        ],
        "items": []
      },
      {
        "id": "rights",
        "title": "7. I tuoi diritti",
        "paragraphs": [
          "Ai sensi del GDPR (articoli da 15 a 22) puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opporti al trattamento: [SEGNAPOSTO — contatto]. Puoi proporre reclamo all'autorità di controllo: [SEGNAPOSTO — autorità]."
        ],
        "items": []
      }
    ]
  },
  about: {
    title: 'Informazioni',
    p1:
      "SYMBA T4.6 aiuta chi imposta una valutazione di sostenibilità del ciclo di vita di una simbiosi industriale: da dieci domande sul caso deriva quale metodologia si applica, quali pratiche vanno documentate e quali dati raccogliere dai partner della rete. Non calcola i risultati — i punteggi quantitativi sono prodotti fuori dallo strumento e compaiono qui quando arrivano.",
    p2:
      'Le 7 domande principali (Q1-Q7), più tre facoltative (Q8-Q10), attivano i 186 nodi Phase 1 più 40 regole cross-method (18 IR + 10 CIR + 5 FU + 7 B). L\'enforcement L3 in fase di reporting (IR-04 + IR-10) più 12 Critical Decision Points emergono per evidenziare tensioni cross-method.',
    p3:
      'Display configurazione per pillar, override avanzati e pannello "Mostra ragionamento" sono tutti operativi.',
  },

  error: {
    title: 'Si è verificato un problema',
    backHome: 'Torna alla home',
    fallback: 'Errore inatteso',
  },

  questionnaire: {
    scopeNote: "Questo strumento non calcola i numeri di LCA/LCC/S-LCA. Deriva il percorso metodologico che il tuo caso richiede e i dati che devi raccogliere; lo scoring quantitativo è prodotto esternamente e compare qui quando arriva.",
    title: 'Questionario',
    guidedBannerTitle: 'Modalità guidata attiva',
    guidedBannerBody:
      "Ogni domanda si apre con una spiegazione breve, in parole semplici. La nota metodologica completa, nella formulazione dei deliverable di progetto, resta a un click sotto ogni domanda. Le dieci risposte determinano il pathway metodologico e il piano di raccolta dati che riceverai al termine.",
    intro:
      'Dieci domande sul tuo caso di simbiosi industriale. Q1 e almeno una dimensione Q3 sono obbligatorie; il resto è opzionale ma migliora l\'output del motore.',
    runButton: 'Calcola il percorso',
    runningButton: 'Sto calcolando…',
    resetButton: 'Reset bozza',
    confirmReset: 'Scartare tutte le risposte e ricominciare? Operazione non reversibile.',
    q1Required: 'Q1 è obbligatoria.',
    shortcutTip: 'Suggerimento: Ctrl/⌘+Enter per eseguire',

    q1: {
      title: 'Q1 — Cosa stai analizzando? *',
      help:
        "Scegli la corrispondenza più vicina: conta il soggetto dello studio, non chi lo commissiona. (Obbligatorio.)",
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
      plain:
        "È la domanda che comanda tutte le altre: da qui lo strumento capisce quale sistema stai esaminando, e quindi quali dati ti chiederà più avanti. Se esiti fra due opzioni, tieni quella che descrive la cosa di cui vuoi misurare gli effetti.",
    },

    q2: {
      title: 'Q2 — Gli scambi che lo studio misura avvengono già?',
      details:
        'Rispondi sugli scambi simbiotici, non sugli impianti: un impianto può esistere mentre lo scambio che studi è ancora un progetto. A — gli scambi avvengono da tempo; ci sono dati operativi primari (es. Kalundborg oggi, Sokka 2011). Il riferimento è ciò che ogni azienda farebbe oggi se i legami si interrompessero (HNSRS, D4.1 §11.1). B — gli scambi sono appena partiti, o gli impianti sono in avviamento; dati in parte misurati, in parte stimati. C — gli scambi non avvengono ancora: progettati, in fase di disegno o ipotetici, anche se gli impianti funzionano già (es. Daddi 2017, residui riutilizzati in un\'azienda esistente). Il riferimento è la situazione attuale senza gli scambi (CNSRS, D4.1 §11.1). D — gli scambi avvengono e lo studio confronta anche alternative future (espansione, nuova tecnologia, rete elettrica decarbonizzata): la rete esistente contro l\'HNSRS, ogni alternativa contro il CNSRS. D apre l\'editor degli scenari alternativi qui sotto. Quando opera il sistema si chiede in Q8.',
      options: {
        A: { label: 'A. Già in corso', description: 'Gli scambi avvengono già (dati operativi reali).' },
        B: { label: 'B. Appena partiti', description: 'Gli scambi sono appena partiti, o gli impianti sono in avviamento.' },
        C: { label: 'C. Non ancora', description: 'Scambi progettati, in disegno o ipotetici, anche fra impianti che esistono già.' },
        D: { label: 'D. In corso, più alternative', description: 'Gli scambi sono in corso e lo studio li confronta con alternative future.' },
      },
      plain:
        'Pensa agli scambi, non agli impianti. Se i flussi fra le aziende avvengono già, li puoi misurare. Se sono ancora un\'idea, anche fra impianti che funzionano già, li puoi solo stimare. Scegli l\'ultima opzione se vuoi confrontare gli scambi di oggi con uno o più futuri possibili: apre l\'editor degli scenari qui sotto.',
    },

    q3: {
      title: 'Q3 — Quali dimensioni della sostenibilità includere? *',
      help: "Almeno una è obbligatoria. Ambientale ed economica sono l'abbinamento abituale.",
      details:
        'ENV — Life Cycle Assessment ambientale (LCA): impatti su clima, ecosistemi, uso di risorse. Quasi sempre selezionata. ' +
        'ECO — dimensione economica, valutata con Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) è una tecnica usata dentro il percorso LCC (attivata da ECO e dai flussi contestati in Q5), non come alternativa; CBA e TEA non sono offerte da questo motore. ' +
        'SOC — S-LCA. Selezionarla attiva una catena di regole più lunga (categorie stakeholder worker / community locale / value chain) e forza L1 BLOCK 2 se l\'override avanzato slca_framework_override è impostato a "absolute". ' +
        'La maggior parte dei paper IS pubblicati esegue solo ENV (es. Sokka, Daddi); pochi accoppiano ENV+ECO (Hashimoto, Wiktor); solo una manciata aggiunge SOC.',
      warning: 'Seleziona almeno una dimensione per procedere.',
      env: 'Ambientale (LCA)',
      eco: 'Economica (LCC)',
      soc: 'Sociale (S-LCA)',
      plain:
        "Tre valutazioni distinte, ognuna con il suo metodo e i suoi dati: ambientale, economica — i costi lungo tutto il ciclo di vita, non un'analisi costi-benefici — e sociale. Scegli quelle che intendi consegnare. La maggior parte degli studi pubblicati fa solo quella ambientale, e aggiungere l'economica è il passo successivo abituale; quella sociale richiede molte più informazioni dalle persone coinvolte, quindi mettiti in conto di andare a raccoglierle.",
    },

    q4: {
      title: 'Q4 — A cosa servirà questo studio?',
      help: 'Selezione multipla. Alcuni usi si combinano (es. D + E per un paper EU PEF).',
      details:
        'A — uso interno: dashboard di management, screening R&S, decisioni a livello di impianto. Pochi vincoli metodologici. ' +
        'B — comunicazione esterna SENZA claim comparativi (report di sostenibilità, brochure marketing senza affermazioni di tipo "meglio di X"). ' +
        'C — CLAIM pubblico che il sistema è migliore di, o equivalente a, un\'alternativa con la stessa funzione (es. "questo cemento è più verde dell\'OPC"), reso pubblico in qualunque forma: rapporto, sito o articolo scientifico (comparative assertion, ISO 14040 §3.6; D4.1 §15.3.4). Attiva la critical review obbligatoria ISO 14044 da 3+ esperti indipendenti e disabilita la pesatura. Usare con cautela. ' +
        'D — allineamento con strumenti di policy UE (digital product passport ESPR, regole di categoria PEFCR). Forza la PEF Circular Footprint Formula via CIR-05. Il rendiconto rigoroso di una sola azienda (CSRD, ESG) si dichiara in Q9, non qui: usa l\'allocazione, non la CFF. ' +
        'E — pubblicazione accademica peer-reviewed. Richiede piena trasparenza (fonti dati, scelte di allocazione, sensitività). Spesso combinato con B o D. Se l\'articolo dichiara che un sistema è migliore di un\'alternativa concorrente o equivalente a essa, scegli anche C; un confronto che non proclama un vincitore resta E (lettura T4.6). ' +
        'È possibile selezione multipla: un tipico paper PEF sceglie D + E.',
      options: {
        A: { label: 'A. Interno', description: 'Uso interno (gestionale, R&S, pianificazione).' },
        B: { label: 'B. Esterno (no claim)', description: 'Comunicazione esterna senza affermazioni comparative.' },
        C: {
          label: 'C. Claim pubblico di superiorità',
          description: 'Affermazione pubblica di superiorità o equivalenza rispetto a un\'alternativa con la stessa funzione, in qualunque forma (articoli compresi).',
          warn: 'Attiva la revisione OBBLIGATORIA del panel di 3+ esperti indipendenti (ISO 14044), pesatura non consentita.',
        },
        D: {
          label: 'D. Allineamento policy UE',
          description: 'Allineamento policy UE (ESPR, PEF/PEFCR).',
          warn: 'Attiva la PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Pubblicazione accademica', description: 'Pubblicazione accademica peer-reviewed (aggiungi C se dichiara che un sistema batte o eguaglia un\'alternativa concorrente).' },
      },
      plain:
        "Chi leggerà il risultato, e cosa ne farà, decide quanto deve essere severo il metodo. Una nota interna è il caso più leggero. Allinearsi agli strumenti UE (passaporto di prodotto, PEF) impone il modo di contare il materiale riciclato e recuperato stabilito dall'UE. Dichiarare in pubblico che il tuo prodotto è migliore di un altro è il caso più pesante: richiede una revisione indipendente da parte di esperti esterni. Vale ovunque lo dichiari, anche in un articolo scientifico. Puoi scegliere più di una voce.",
    },

    q5: {
      title: 'Q5 — Natura di ogni flusso simbiotico (per flusso)',
      help:
        'Aggiungi una riga per ogni flusso simbiotico principale e scegli la categoria Q5. Obbligatorio per Q1 ∈ {A, B, D}; opzionale altrimenti.',
      details:
        'Per ogni flusso principale scambiato tra attori (calore, CO₂, scorie, acque reflue, idrogeno…) scegli chi paga chi: ' +
        'a — A paga B per ritirare il flusso (una tariffa di conferimento: valore di mercato negativo, un RIFIUTO per A, D4.1 §8.3.2). Lo zero-burden vale dal punto in cui il residuo raggiunge per la prima volta un valore non negativo, non al cancello. Pagare non significa inevitabile: D4.2 §6.2 richiede anche il test causale di evitabilità, dichiarato per flusso nel Data Collection File. ' +
        'b — flusso scambiato GRATIS (stato ambiguo): il motore instrada verso la catena di disambiguazione dei flussi gratuiti. ' +
        'c — B paga A per il flusso (valore di mercato positivo: un CO-PRODOTTO per A): sostituzione del materiale vergine spiazzato, con un rapporto corretto per qualità. La Circular Footprint Formula del PEF non dipende da Q5: viene da Q4=D. Se nessun terzo pagherebbe per il flusso (test di Freedom-to-Act, D4.1 §8.3.3), il prezzo è amministrativo e il flusso è modellato come rifiuto. ' +
        'd — flusso INTERDIPENDENTE: A ha modificato deliberatamente il proprio processo (qualità, quantità, post-trattamento) per fornire B; un co-prodotto qualunque sia il prezzo, mai zero-burden. ' +
        'e — AGGREGATO / black-box: la fonte non dà dettaglio per flusso (tipico dei lavori aggregati come Sokka 2011). È un limite della fonte, non una scelta di modellazione: D4.1 §8.3.1 vieta una regola unica per tutta la rete, quindi il Data Collection File chiede comunque la classificazione di ogni flusso che puoi nominare. ' +
        'Q5 registra chi paga chi; i test giuridici ed economici (Freedom-to-Act, End-of-Waste, classe di sottoprodotto, evitabilità, punto dello zero-burden) si dichiarano per flusso nella sezione Flow classification del Data Collection File. Per gli studi di policy con Q1=C, Q5 è di solito facoltativa.',
      plain:
        "Per ogni cosa che si muove fra le aziende — calore, acqua, scorie, CO₂ — qui la domanda è soltanto chi paga chi: chi manda il flusso paga per liberarsene, nessuno paga, oppure chi lo riceve lo paga. Se chi manda ha cambiato di proposito il proprio processo per fornirlo, scegli quella voce qualunque cosa dica il denaro. Se la tua fonte dà un unico numero per tutta la rete, scegli l'ultima opzione: ti verrà comunque chiesto di ogni flusso che sai nominare, perché una regola unica per tutta la rete non è ammessa. Se un flusso sia un rifiuto per la legge si decide dopo, nel file di raccolta dati, non qui.",
    },

    q6a: {
      title: 'Q6a — Settore',
      help: 'Il settore principale del caso. Accende qualche requisito specifico di settore.',
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
      plain:
        "Il settore principale del caso: l'attività dell'azienda che contribuisce con la quota maggiore di massa, energia o valore. Accende qualche requisito e qualche default specifici di settore. Se il caso è a cavallo di più settori scegli Multi-settore, e ignora le voci marcate (legacy).",
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL della tecnologia dominante o critica nella rete simbiotica. Determina la scelta della qualità dei dati di inventory (misurati vs letteratura vs stima ingegneristica) e il budget di incertezza downstream. ' +
        'È il TRL della tecnologia chiave in sé, non della sua adozione: una tecnologia matura che tratta lo stesso tipo di input alla stessa scala che altrove, usata per la prima volta in questa rete o regione, resta TRL 9, e la novità si vede nella qualità dei dati (lettura T4.6); un processo maturo applicato a un input mai trattato su scala è uno scambio a basso TRL (D4.1 §9.3.5). ' +
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
      plain:
        "Quanto è matura la tecnologia chiave: in esercizio commerciale, primo impianto pilota, prototipo, o ancora in laboratorio. Meno è matura, più i tuoi numeri saranno stime e non misure, e più il risultato deve portarsi dietro la propria incertezza. Giudica la tecnologia in sé, non se è nuova qui: un processo collaudato usato per la prima volta nella tua regione resta maturo, purché tratti lo stesso tipo di materiale che altrove.",
    },

    q7: {
      title: 'Q7 — Distribuzione geografica',
      help: 'Disposizione qualitativa della rete. Il trasporto è modellato in modo esplicito qualunque sia la risposta; la distanza di break-even dipende dal tipo di flusso e viene chiesta per ogni flusso nel Data Collection File, dove annoti quella che hai ricavato dalla tua analisi di sensibilità (Logistica).',
      details:
        'La risposta cambia come si chiedono i dati logistici (accoppiamento GIS, sensibilità spaziale), non se il trasporto viene modellato: D4.1 §12.3.1 richiede che ogni collegamento di trasporto sia un processo unitario distinto del foreground, con dati primari su distanza, percorso e modo, e un\'analisi di sensibilità sulla distanza per trovare il punto di break-even. Dietro le quattro opzioni non c\'è nessuna soglia di distanza: il break-even dipende dal tipo di flusso e dall\'alternativa che sostituisce (D4.1 §12.2.1 e D4.2 danno intervalli indicativi, per verificare la plausibilità di un modello, mai come input); ogni studio calcola il proprio, flusso per flusso. ' +
        'A — co-locata: un solo sito o impianti adiacenti (parco eco-industriale). I collegamenti sono brevi (tubazione, nastro, movimentazione interna) ma comunque modellati; per calore, vapore e acqua in tubazione di solito domina l\'infrastruttura dedicata. ' +
        'B — cluster regionale: più siti nella stessa regione (tipico Sokka 2011 / Hashimoto). ' +
        'C — area vasta: tra regioni o transfrontaliera; modo di trasporto e percorsi diventano voci importanti dell\'inventario e dei costi. ' +
        'D — multi-scala: programmi nazionali o di settore (tipicamente studi di policy con Q1=C). Da B a D si attiva CIR-03 (accoppiamento GIS); da C a D anche lca_mc_29 e il ramo GIS di lcc_mc_14.',
      options: {
        A: { label: 'A. Co-locati', description: 'Un solo sito o impianti adiacenti (parco eco-industriale).' },
        B: { label: 'B. Regionale', description: 'Più siti nella stessa regione.' },
        C: { label: 'C. Area ampia', description: 'Tra regioni o transfrontaliera.' },
        D: { label: 'D. Multi-scala', description: 'Nazionale / industria-wide, distanze variabili.' },
      },
      plain:
        "Come sono disposti i siti: un unico sito, più siti nella stessa regione, siti fra regioni o oltre confine, o un programma nazionale o di settore. Il trasporto si conta qualunque cosa rispondi; la risposta cambia solo quanto dettaglio ti verrà chiesto su percorsi e modalità. Dietro le quattro opzioni non c'è nessuna soglia di distanza: ogni flusso ha la sua distanza di convenienza, e il file di raccolta dati te la chiede, flusso per flusso, dalla tua analisi di sensibilità.",
    },
    q8: {
      title: 'Q8 — Orizzonte temporale dello studio',
      help: 'Facoltativa. Un solo orizzonte per LCA e LCC.',
      details: 'I deliverable chiedono un solo orizzonte temporale per LCA, LCC e S-LCA (D4.2 §11, D4.1 §14). Gli scenari di background futuri (SSP/RCP) si aggiungono a entrambe quando il sistema opera in un anno futuro (D4.1 §9.3.5, §12.3.2), quando la tecnologia chiave è sotto TRL 7 (Q6b) o quando il periodo di analisi o la vita degli asset principali supera 15 anni (D4.2 §9.3, che dà la cifra senza fonte; si può cambiare fra le impostazioni avanzate). Senza risposta, l\'anno di esercizio è quello dello studio, tranne con Q2 = D (alternative future), che vale come futuro. Il periodo di analisi è l\'arco di tempo coperto dallo studio; di norma coincide con la vita tecnica degli asset principali (D4.2 §9). La vita degli asset principali è anche il periodo su cui si ammortizzano i loro beni capitali, lo stesso in LCA e LCC (D4.1 §6.3.3, §14.2.2); gli asset con una vita diversa vanno nel file di raccolta dati.',
      start: {
        label: 'In quale anno opera il sistema, o si assume che operi?',
        options: {
          unset: 'Non risposta (l\'anno dello studio; un anno futuro se Q2 = D)',
          now: 'Adesso: l\'anno dello studio',
          future: 'Un anno futuro',
        },
        yearPlaceholder: 'es. 2030',
      },
      period: {
        label: 'Per quanti anni lo studio segue il sistema (periodo di analisi o orizzonte di progetto)?',
        placeholder: 'es. 25; vuoto per la fotografia di un anno',
      },
      lifetime: {
        label: 'Vita tecnica degli asset principali: quanto durano fisicamente gli impianti, non l\'orizzonte di progetto (anche il loro periodo di ammortamento)',
      },
      placeholder: 'es. 20',
      unit: 'anni',
      plain:
        'Su quali anni lo studio guarda il sistema? Se descrive come funzionano le cose oggi basta una fotografia del presente. Se riguarda un impianto che funzionerà in un anno successivo, o segue il sistema per decenni, il risultato dipende da come cambieranno elettricità, combustibili e mercati, e il tool ti chiede di prendere posizione su quel futuro: lo stesso futuro per la lettura ambientale e per quella economica.',
    },
    q9: {
      title: 'Q9 — A cosa serve lo studio, e fin dove arrivano i suoi effetti? *',
      help: 'Obbligatoria. Decide la situazione di modellazione (ILCD A, B, C1 o C2); Q1 descrive solo il soggetto.',
      details: 'La Tabella 1 di D4.1 classifica lo studio in base alla decisione che sostiene e alla scala delle sue conseguenze, non in base al soggetto (D4.1 §4.2.3). Micro (Situazione A) è il default per singoli scambi e progetti di parco o impianto, anche senza un decisore nominato (§4.3.4). Strutturale (Situazione B) richiede la prova che il cambiamento sposta capacità installata nel mercato interessato, per esempio circa l\'1% o più delle nuove installazioni (§4.3.4, §11.3.1); senza prova lo studio resta A, con la B come sensibilità. Documentare una rete esistente è la Situazione C1 (sostituzione, §7.2.3); il rendiconto di una sola azienda isolata è C2 (allocazione, nessun credito, §7.2.3), con costi solo a livello d\'impresa (scelta di progetto T4.6).',
      options: {
        micro: 'Esplora o sostiene una scelta, anche ipotetica e senza un decisore nominato, e i suoi effetti restano negli impianti coinvolti (Situazione A)',
        structural: 'Sostiene una scelta i cui effetti cambiano ciò che produce un intero mercato o settore (Situazione B; la prova va documentata)',
        none: 'Nessuna scelta: documenta ciò che una rete o un sistema esistente rende, così com\'è (Situazione C1)',
        corporate_report: 'Rendiconto di una sola azienda isolata (ESG / CSRD), senza crediti per ciò che la simbiosi evita altrove (Situazione C2)',
      },
      screening: {
        label: 'È documentato che il cambiamento sposta circa l\'1% o più della nuova capacità nel mercato interessato?',
        yes: 'Sì, è documentato (Situazione B)',
        no: 'No (Situazione A, con la Situazione B come analisi di sensibilità)',
      },
      plain:
        'A cosa serve lo studio? Quasi sempre esplora o sostiene una scelta i cui effetti restano negli impianti coinvolti, anche se nessuno deve ancora decidere. Solo quando il cambiamento è abbastanza grande da spostare ciò che produce un intero mercato, e lo si può dimostrare, lo studio cambia natura. Se descrivi soltanto una rete che già funziona, o i numeri di una sola azienda, dillo: ogni caso si modella in modo diverso.',
    },
    q10: {
      title: 'Q10 — Lo studio serve un obiettivo di policy pubblica o di pianificazione territoriale?',
      help: 'Facoltativa. Se non rispondi, il motore la deduce da Q1 (sì solo per Q1 = C).',
      details: 'D4.2 §2.3 aggiunge un LCC sociale (net tax factor, esternalità monetizzate, tasso di sconto sociale) quando lo studio serve un obiettivo di policy pubblica o di pianificazione territoriale, qualunque siano Q1 o Q4. Un comune che pianifica un parco eco-industriale (Q1 = B) o un regolatore che monitora un settore (Q1 = E) può rispondere sì senza essere Q1 = C. Con Q1 = D lo strumento mantiene l\'LCC convenzionale a livello di azienda (scelta di progetto T4.6) e te lo segnala.',
      options: {
        unset: 'Non risposta (dedotta da Q1)',
        yes: 'Sì — obiettivo di policy pubblica o di pianificazione territoriale (aggiunge l\'LCC sociale)',
        no: 'No — non serve un obiettivo di policy o di pianificazione',
      },
      plain:
        "Rispondi sì se lo studio serve a una decisione pubblica — un comune, una regione, un'autorità di regolazione, un piano. Aggiunge allora una seconda lettura economica dal punto di vista della società: imposte contate in modo diverso, ed effetti che nessuno paga in denaro. Per il rendiconto di una singola azienda la lettura economica resta a livello aziendale, e il tool te lo dice. Lascia senza risposta e il tool la ricava dalla prima domanda.",
    },

    q11: {
      title: "Q11 — Che cosa confronta lo studio?",
      help: "Facoltativa. Decide la base dell'unità funzionale; senza risposta vale l'unità orientata alla funzione della D4.1 Part 1.",
      details: "La D4.1 Part 2 chiede che l'unità funzionale rifletta la funzione primaria del sistema (§4.3, §6.3, §8.3): un'unità basata sull'input (es. trattamento di 1 tonnellata di rifiuto) quando lo studio confronta modi di gestire un rifiuto o le prestazioni di un impianto o servizio; un'unità basata sull'output (es. 1 kg di prodotto, 1 MJ di energia) quando confronta prodotti con le alternative di mercato o sostiene un'affermazione di sostituzione; un sistema di unità funzionali quando le due funzioni sono co-primarie (Part 1 §5.3.2). La D4.2 §3.1 chiede per l'LCC un'unità doppia (rifiuto trattato + prodotto ottenuto) quando a guidare lo studio è la sostituzione di prodotto: i due deliverable divergono, e il tool segue la Part 2 per l'LCA e segnala la differenza.",
      options: {
        unset: "Non risposta (unità orientata alla funzione, D4.1 Part 1)",
        waste_treatment: "Come si gestisce un rifiuto — vie di gestione, prestazioni di un impianto o servizio (unità basata sull'input)",
        product_substitution: "Prodotti contro alternative di mercato — che cosa sostituisce il prodotto recuperato (unità basata sull'output)",
        co_primary: "Entrambe: il servizio di trattamento e i prodotti contano allo stesso modo (sistema di unità funzionali)",
      },
      plain:
        "Su che cosa verte davvero il confronto? Se la domanda è come trattare al meglio un rifiuto — bruciarlo, digerirlo, compostarlo — il risultato si conta per tonnellata di rifiuto trattato. Se la domanda è se il prodotto recuperato è migliore di quello che sostituisce, si conta per unità di prodotto. Se contano tutte e due, si contano una accanto all'altra.",
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
    q5Note: "Rispondi con l'assetto attuale — quello concordato, o quello previsto se lo scambio non è ancora in essere. È un'ipotesi di partenza, non un risultato: se lo studio cambia chi paga chi, torna qui e cambialo. Scegli \"gratuito / ambiguo\" quando è davvero indeciso, invece di forzare una direzione.",
    emptyHint: 'Nessun flusso. Aggiungine almeno uno per caratterizzare la Q5 per-flusso.',
    headers: { id: 'ID', name: 'Nome', q5: 'Q5', sellable: 'Vendibile ad altri?', sector: 'Settore (Parte 2)', configuration: "Configurazione (Parte 2)" },
    sellable: { unset: '— senza risposta', yes: 'Sì', no: 'No' },
    sellableHint: 'Se il partner non prendesse questo flusso, chi lo genera potrebbe venderlo a qualcun altro a un prezzo positivo? Sì lo rende un coprodotto, no un rifiuto, qualunque sia il prezzo concordato (D4.1 §8.3.3). Facoltativo: il risultato segnala quando non concorda con Q5.',
    sectorHint: "Scegli il capitolo della D4.1 Part 2 di ciò che si scambia, non dell'azienda: residui agricoli e agroindustriali → Agroalimentare (§4); rifiuti urbani o misti, biorifiuti compresi (FORSU, scarti alimentari domestici) → Valorizzazione dei rifiuti (§8); fanghi e acque reflue trattate, anche quando riusate come acqua → Acque reflue (§6); un prodotto o un vettore energetico ottenuto da un flusso (biometano, digestato, elettricità) → il capitolo di quel flusso. Dove §4 e §8 si sovrappongono sui biorifiuti, decide l'origine (lettura T4.6 della Part 2 §3.3). Facoltativa: il risultato elenca le regole del capitolo.",
    sectorNone: '— nessuno di questi',
    configurationHint: "La configurazione tipica del flusso dentro il suo capitolo della Part 2 (D4.1 Part 2 §4.1-§8.1): il risultato indica il prodotto convenzionale che sostituisce. Scegli prima il settore.",
    configurationNone: "— non risposta",
    configurations: {
      agrifood_ad_bioenergy_fertiliser: "Rifiuto organico a bioenergia e fertilizzante (digestione/compostaggio)",
      agrifood_feed_bioconversion: "Sottoprodotti agroalimentari a mangime (bioconversione)",
      agrifood_platform_chemicals: "Residui agricoli a chimici di base / bioplastiche",
      agrifood_high_value_compounds: "Residui agroindustriali a composti ad alto valore",
      agrifood_nutrient_recovery: "Recupero di nutrienti come ammendante / fertilizzante",
      plastics_mechanical_recycling: "Riciclo meccanico (ciclo aperto o chiuso)",
      plastics_chemical_recycling: "Riciclo chimico (termochimico/depolimerizzazione)",
      plastics_reusable_packaging: "Imballaggi riutilizzabili (PSS)",
      plastics_biobased_packaging: "Imballaggi bio-based / biodegradabili",
      plastics_upcycling: "Upcycling e decontaminazione per cicli ad alto valore",
      wastewater_nutrient_recovery: "Recupero di nutrienti (P e N) come fertilizzanti",
      wastewater_sludge_to_energy: "Acque reflue/fanghi a energia (biogas/cogenerazione o upgrading)",
      wastewater_sludge_pyrolysis: "Pirolisi dei fanghi a biochar e vettori energetici",
      wastewater_water_reuse: "Recupero e riuso dell'acqua",
      wastewater_screening_srf: "Grigliato a CSS per l'industria",
      wastewater_microalgae: "Bioraffinerie a microalghe su acque reflue",
      textiles_fibre_to_fibre: "Riciclo fibra-a-fibra (ciclo chiuso)",
      textiles_downcycling: "Downcycling in non-tessuti e compositi (ciclo aperto)",
      textiles_chemical_valorisation: "Valorizzazione chimica a biochimici/monomeri",
      textiles_recycled_carbon_fibre: "Fibra di carbonio riciclata per tessili tecnici",
      textiles_pss_reuse: "Sistemi prodotto-servizio (PSS) e riuso",
      wv_srf_coprocessing: "RSU/CDR/CSS a energia (co-incenerimento)",
      wv_biowaste_nutrients_energy: "Biorifiuti a nutrienti ed energia",
      wv_tailings_construction: "Residui industriali/sterili a materiali da costruzione e metalli",
      wv_weee_urban_mining: "RAEE e urban mining",
      wv_plastic_upcycling: "Upcycling di rifiuti plastici (meccanico/termochimico)",
    },
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
      "Uno scenario qui fa variare le risposte *metodologiche*, non la rete fisica: eredita Q1–Q7 dalla baseline e differisce solo tramite il dict di override (\"e se fosse ex-post\", \"e se il settore fosse un altro\"). Confrontare dove va un flusso, a che distanza o a che prezzo è un confronto di rete — quelle alternative si disegnano nel Network Builder, e il motore non le confronta ancora.",
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
      asset_lifetime: 'Anni (storico; usato se in Q8 la vita è vuota); un orizzonte oltre la soglia (15 di default) aggiunge il background futuro a LCA e LCC (lca_mc_21, lcc_hc_23, CIR-01)',
      future_background_threshold_years:
        'Anni. L\'orizzonte di studio oltre il quale LCA e LCC richiedono il background futuro (lca_mc_21, lcc_hc_23, CIR-01). Default 15, la cifra che il D4.2 §9.3 dà senza fonte; se la cambi, giustificala nella carta metodologica',
      transport_sensitive: 'Booleano; true attiva CIR-03',
      network_nodes: 'Intero; ≥3 (con Q1=B + interdependent_flows) attiva CIR-04',
      interdependent_flows: 'Booleano; true (con Q1=B + network_nodes≥3) attiva CIR-04',
      frontier_categories_active: 'Booleano; true attiva CIR-06',
      is_specific_capital_goods: 'Booleano; true attiva IR-13 / B-06 / CIR-08',
      multi_actor: 'Booleano; true (con Q1∈{B,C}) attiva FU-02',
    },
  },

  narrative: {
    pathway: {
      'IS-01': {
        title: 'Simbiosi operativa — supporto alla decisione',
        body: 'Uno scambio simbiotico tra due aziende, o dentro un eco-parco, valutato per decidere se e come realizzarlo.',
        detail: 'Q1 dice che l\'oggetto è uno scambio specifico o un parco; Q2 dice che stai decidendo, non rendicontando. La pipeline configura quindi un supporto alla decisione: per impostazione predefinita modellazione attribuzionale con sostituzione e un LCC legato alla prospettiva che hai scelto (la situazione ILCD e il tipo di LCC qui sotto mostrano cosa vale per le tue risposte) e — quando Q2 è baseline più alternative — un confronto tra scenari.',
      },
      'IS-02': {
        title: 'Pre-fattibilità settoriale — policy',
        body: 'Una decisione di policy o di programma su scala regionale o nazionale, dove le conseguenze sono strutturali e non marginali.',
        detail: 'Poiché l\'oggetto è una decisione pubblica, tutto a valle è dimensionato su conseguenze che il sistema di background sentirà davvero: per impostazione predefinita la situazione ILCD passa a B e l\'LCC acquisisce la prospettiva societale, perché una policy deve rendere conto del benessere collettivo e non solo delle imprese coinvolte. Se hai risposto a Q9 o Q10, le sezioni qui sotto mostrano la situazione e il costing che valgono.',
      },
      'IS-03': {
        title: 'Contributo aziendale — rendicontazione',
        body: 'Il contributo simbiotico di una singola azienda dentro un network, per rendicontazione ESG / CSRD.',
        detail: 'Il motore stringe sulla contabilità stretta: allocazione anziché crediti da sostituzione (ILCD C2) e solo LCC convenzionale. Il numero deve descrivere la posizione della singola azienda in modo che un auditor possa ricostruirla, non il beneficio che la rete produce collettivamente.',
      },
      'IS-04': {
        title: 'Rete IS emergente — progettazione ex-ante',
        body: 'Una rete ancora in progettazione, valutata su scenari dinamici senza una baseline operativa.',
        detail: 'Q1 è uno scambio o un parco, ma Q2 dice che il sistema è ancora sulla carta ed è esplorato con scenari dinamici invece che contro una baseline operativa. L\'ADR-005 lo tiene come pathway a sé solo per Q1 ∈ {A, B}: per una policy o un report aziendale è l\'oggetto di studio a prevalere sulla postura temporale.',
      },
      'IS-05': {
        title: 'Monitoraggio — simbiosi in esercizio',
        body: 'Monitoraggio a serie storica di una simbiosi già operativa.',
        detail: 'Non c\'è nessuna decisione sul tavolo: lo studio documenta una rete che già funziona. Questo lo colloca, per impostazione predefinita, in ILCD C1 — contabilità che mostra comunque cosa la rete restituisce all\'economia più ampia — e il valore dell\'esercizio è la serie storica, quindi la raccolta dati deve essere ripetibile periodo dopo periodo.',
      },
    },
    extendedSuffix: 'La valutazione confronta una baseline con scenari alternativi.',
    ilcd: {
      'ILCD Situation A': {
        short: 'Supporto a decisione micro: lo scambio è troppo piccolo per cambiare il sistema di background. Modellazione attribuzionale, con sostituzione sul mix di mercato medio.',
        detail: 'Lo scambio riguarda gli attori coinvolti, non cosa l\'economia più ampia produce o come. Modelli quindi con dati medi, di tipo contabile, e rappresenti ciò che la simbiosi sostituisce usando il mix di mercato medio — il mix di rete nazionale per l\'elettricità, la produzione vergine media per un materiale. Il D4.1 mette esplicitamente in guardia dal passare al consequenziale solo perché c\'è una decisione di mezzo.',
      },
      'ILCD Situation A multi-actor': {
        short: 'Supporto a decisione micro su una rete multi-attore: stessa regola della Situation A, applicata all\'intero parco anziché a un singolo scambio.',
        detail: 'La regola di modellazione non cambia: le conseguenze restano micro, quindi dati medi e sostituzione sul mix di mercato. Cambia la contabilità: più partner condividono un sistema, quindi confini e flussi condivisi vanno concordati tra loro prima di modellare, altrimenti lo stesso flusso viene contato due volte o il contributo di un partner sparisce.',
      },
      'ILCD Situation B': {
        short: 'Supporto a decisione meso/macro: la decisione causa un cambiamento strutturale nel background, quindi modellazione consequenziale sulla tecnologia marginale. Il D4.1 chiede di dimostrare quella scala prima di sceglierla.',
        detail: 'La decisione è abbastanza grande da spostare capacità installata o produzione di una tecnologia specifica. La modellazione diventa consequenziale e ciò che la simbiosi sostituisce è la tecnologia marginale, identificata con un\'analisi di mercato e non presa come mix medio. L\'onere della prova è tuo: questa strada va dimostrata, non assunta.',
      },
      'ILCD Situation C1': {
        short: 'Contabilità con interazioni — documentare cosa una rete esistente restituisce all\'economia più ampia. Sostituzione sul mix di mercato medio, come nella Situation A.',
        detail: 'Stai documentando una rete che esiste, non supportando una decisione, quindi lo studio è descrittivo. Ma dato che il punto è mostrare cosa la rete restituisce all\'economia più ampia, la multifunzionalità si risolve comunque per sostituzione sul mix di mercato medio — operativamente la stessa regola della Situation A.',
      },
      'ILCD Situation C2': {
        short: 'Contabilità stretta su un singolo partner isolato: allocazione, senza crediti da sostituzione.',
        detail: 'Contabilità stretta su un singolo partner isolato, tipicamente rendicontazione aziendale. La multifunzionalità si risolve per allocazione e non si rivendica alcun credito per ciò che la simbiosi sostituisce altrove: il numero descrive la quota di carichi di quel partner, non il beneficio prodotto dalla rete.',
      },
    },
    lcc: {
      'deactivated': {
        short: 'Nessuna analisi economica — la dimensione economica non è attiva in Q3.',
        detail: 'In Q3 non è selezionata la dimensione economica, quindi il motore non configura alcun costing. Se il caso ha bisogno di un business case — e per una simbiosi che deve essere firmata da più imprese di solito serve — torna su Q3 e attiva la dimensione economica.',
      },
      'C+E': {
        short: 'LCC convenzionale (i flussi di cassa reali dell\'impresa) più LCC ambientale (la catena del valore, sugli stessi confini della LCA).',
        detail: 'Due viste in parallelo. L\'LCC convenzionale risponde se conviene alla singola impresa: flussi di cassa reali, tasse e oneri come costi, sussidi come riduzioni. L\'LCC ambientale allarga il confine a tutti gli attori del ciclo di vita e resta coerente con la LCA parallela, così le due si leggono affiancate. Attenzione al doppio conteggio: una carbon tax o una tassa di discarica già nei flussi di cassa non deve ricomparire come esternalità monetizzata.',
      },
      'C+E+S': {
        short: 'LCC convenzionale e ambientale più LCC societale: tasse e sussidi corretti con il Net Tax Factor, impatti ambientali monetizzati.',
        detail: 'Sopra la vista d\'impresa e quella di catena del valore arriva quella di benessere collettivo. Tasse e sussidi sono trasferimenti interni alla società più che costi reali per essa, quindi vengono esclusi o convertiti in prezzi ombra con il Net Tax Factor, e gli impatti ambientali della LCA parallela vengono monetizzati. È la configurazione che serve a una decisione pubblica, ed è per questo che arriva col pathway di policy.',
      },
      'C-LCC': {
        short: 'Solo LCC convenzionale — la prospettiva dell\'impresa, equivalente a un\'analisi del costo totale di possesso.',
        detail: 'Solo la prospettiva dell\'impresa. Ogni strumento di policy è un flusso di cassa reale: tasse e oneri sono costi, i sussidi riducono capex o opex. È il taglio giusto per la rendicontazione aziendale, e deliberatamente non dice nulla sugli effetti di catena del valore o societali — rivendicarli sovrastimerebbe ciò che un conto mono-attore può sostenere.',
      },
      'C+N': {
        short: 'LCC convenzionale per ogni partner, consolidato a livello di rete. Nessun LCC ambientale: il caso non ha un\'LCA con cui restare coerente.',
        detail: 'Prima i flussi di cassa reali di ogni impresa, poi gli stessi conti sommati sulla rete, dove i pagamenti fra partner si annullano. L\'LCC ambientale resta fuori perché il D4.2 lo costruisce sul confine di un\'LCA parallela, e il caso non valuta la dimensione ambientale. Attiva la dimensione ambientale in Q3 se lo studio ha bisogno della vista di catena del valore.',
      },
      'C+N+S': {
        short: 'LCC convenzionale per partner e per la rete, più LCC sociale con il Net Tax Factor. Senza un\'LCA, gli impatti ambientali non sono monetizzati.',
        detail: 'I conti di impresa e di rete come sopra, più la vista di benessere che serve a una decisione pubblica: tasse e sussidi convertiti con il Net Tax Factor, un tasso di sconto sociale e un confine che arriva al fine vita. Manca la monetizzazione degli impatti ambientali, che richiede i risultati di un\'LCA parallela: attiva la dimensione ambientale in Q3 per aggiungerla.',
      },
    },
    slca: {
      'active': {
        short: 'S-LCA attiva: indicatori sociali per gruppo di stakeholder.',
        detail: 'La dimensione sociale è attiva. Ogni gruppo di stakeholder — lavoratori, consumatori, comunità locali, attori della catena del valore — viene mappato sui processi da cui è interessato, e da lì su sottocategorie di impatto e indicatori. La mappatura vale quanto l\'ascolto che c\'è dietro, quindi parlare con i gruppi coinvolti fa parte della raccolta dati, non è un extra.',
      },
      'deactivated': {
        short: 'S-LCA non attivata — la dimensione sociale non è attiva in Q3.',
        detail: 'In Q3 non è selezionata la dimensione sociale, quindi non viene configurata né mappatura degli stakeholder né alcun indicatore sociale. Attivala in Q3 se il caso deve dire qualcosa su lavoratori o comunità locali — cosa che di solito serve quando una simbiosi viene presentata a un comune o a una comunità.',
      },
    },
  },

  result: {
    notes: { title: 'Note sulle tue risposte' },
    engineNotes: {
      structural_without_screening: "Q9 dice che gli effetti sono strutturali, ma lo screening di mercato non è documentato: lo studio è trattato come Situazione ILCD A, e la Situazione B va provata come sensitività (D4.1 §4.3.4, §11.3.1).",
      structural_screening_missing: "La Situazione B richiede la prova che il cambiamento sposta circa l'1% o più della nuova capacità nel mercato interessato (D4.1 §11.3.1); documentala, altrimenti lo studio è in Situazione A con B come sensitività (D4.1 §4.3.4).",
      decision_scale_vs_q1: {
        c_micro: "Q1 (pre-fattibilità di settore) di solito comporta conseguenze su scala strutturale; hai risposto conseguenze limitate, quindi lo studio è trattato come Situazione ILCD A. D4.1 §4.3.4: non scegliere l'LCA consequenziale solo perché si prende una decisione.",
        e_micro: "Q1=E (monitoraggio) non comporta decisioni; hai risposto che lo studio sostiene una decisione con conseguenze limitate, quindi è trattato come Situazione ILCD A.",
        e_structural: "Q1=E (monitoraggio) non comporta decisioni; hai risposto che lo studio sostiene una decisione con conseguenze strutturali, quindi è trattato come Situazione ILCD B.",
      },
      q1_d_not_corporate: "Q1=D descrive la rendicontazione di sostenibilità di un'azienda, ma Q9 dice che lo studio non è un rendiconto aziendale; la situazione ILCD segue Q9. Il rendiconto aziendale rigoroso (allocazione, niente crediti) è la Situazione ILCD C2 (D4.1 §7.2.3).",
      documentation_vs_ex_ante: "La Situazione ILCD C documenta una rete che esiste già, ma Q2 descrive uno studio ex-ante (la rete non opera ancora, o si confrontano alternative). Verifica che la situazione sia quella che intendi.",
      c2_keeps_c_lcc: "Il rendiconto rigoroso di una sola azienda (Situazione ILCD C2) tiene il costing a livello d'impresa (solo C-LCC) qualunque sia la risposta a Q10: è una scelta di progetto T4.6, perché una sola azienda non ha un livello di rete.",
      policy_no_but_q1_c: "Q1=C (pre-fattibilità di settore) di solito serve una politica pubblica; hai risposto di no, quindi il costing sociale (S-LCC, net tax factor, tasso di sconto sociale) non viene aggiunto.",
      lcc_without_lca: {
        plain: "Q3 non comprende la dimensione ambientale, quindi non c'è un'LCA parallela: il costing è l'LCC convenzionale di ogni partner, consolidato a livello di rete (D4.2 §4.1), senza l'LCC ambientale, che D4.2 costruisce sul confine dell'LCA.",
        policy: "Q3 non comprende la dimensione ambientale, quindi non c'è un'LCA parallela: il costing è l'LCC convenzionale di ogni partner, consolidato a livello di rete (D4.2 §4.1), senza l'LCC ambientale, che D4.2 costruisce sul confine dell'LCA. L'LCC sociale mantiene il net tax factor e il tasso di sconto sociale, ma senza i risultati dell'LCA le esternalità non si possono monetizzare (D4.2 §11.2).",
      },
      c2_allocation_over_pef: "Il rendiconto rigoroso di una sola azienda (Situazione ILCD C2) usa l'allocazione e nessun credito di sostituzione (D4.1 §7.2.3), quindi la Circular Footprint Formula della PEF chiesta da Q4=D non si applica: la CFF è un metodo di prodotto. Se lo studio è un'impronta di prodotto e non un rendiconto aziendale, rivedi Q9.",
      slca_alone: "Q3 seleziona solo la dimensione sociale. D4.3 §3.1 costruisce l'S-LCA sull'unità funzionale e sui confini di un'LCA o di un LCC; se nessuno dei due è selezionato, documenta l'unità di riferimento e il confine nel charter metodologico.",
      flow_sellable_but_waste: "Flusso «{{flow}}»: Q5 dice che chi lo genera paga per disfarsene (rifiuto), ma un terzo lo pagherebbe. D4.1 §8.3.3 e §8.3.6 Step 1: un flusso con un valore di mercato positivo e indipendente è un co-prodotto, e il suo carico a monte si ripartisce (sostituzione o allocazione), non si taglia. Controlla Q5 per questo flusso.",
      flow_price_without_market: "Flusso «{{flow}}»: Q5 dice che chi lo riceve lo paga (co-prodotto), ma nessun terzo lo pagherebbe. D4.1 §8.3.3: senza un mercato indipendente il prezzo è un corrispettivo amministrativo e il flusso è un rifiuto, a carico zero dal punto in cui raggiunge per la prima volta un valore non negativo (§8.3.6 Step 4). Fa eccezione chi modifica il proprio processo per il partner (Q5 = d).",
      flow_freedom_to_act_settles: {
        co_product: "Flusso «{{flow}}»: Q5 lascia aperto chi paga chi; la risposta Freedom-to-Act (D4.1 §8.3.3) lo legge come co-prodotto (§8.3.2, carico ripartito).",
        waste: "Flusso «{{flow}}»: Q5 lascia aperto chi paga chi; la risposta Freedom-to-Act (D4.1 §8.3.3) lo legge come rifiuto (carico zero dal punto in cui raggiunge per la prima volta un valore non negativo, §8.3.6 Step 4).",
      },
      flow_part2_chapter: "Flusso «{{flow}}»: gli si applicano le regole di settore della D4.1 Part 2 {{chapter}}; sono elencate in Regole di settore.",
      flow_configuration_unknown: "Flusso «{{flow}}»: la configurazione «{{configuration}}» non è una di quelle della D4.1 Part 2.",
      flow_configuration_other_chapter: "Flusso «{{flow}}»: la sua configurazione appartiene a {{chapter}}, non al capitolo dichiarato {{declared}}; sono elencate le regole di entrambi i capitoli.",
    },
    sectorChapters: { '§4': "§4 Agroalimentare e bioraffinerie", '§5': "§5 Plastica e imballaggi", '§6': "§6 Acque reflue e biofabbriche", '§7': "§7 Tessile e tessili tecnici", '§8': "§8 Valorizzazione dei rifiuti" },
    sectorRules: {
      title: 'Regole di settore (D4.1 Part 2)',
      lead: 'Le regole che la D4.1 Part 2 dà per i settori toccati dal tuo caso. Il tool non le applica al posto tuo: documenta nello studio come hai rispettato ciascuna.',
      activatedBy: 'Valgono per: {{reasons}}',
      byFlow: 'il flusso «{{name}}»',
      byCaseSector: 'il settore del caso (Q6a)',
      count: '{{count}} regole',
      strength: { must: 'obbligo', should: 'raccomandato', descriptive: 'prassi' },
    },
    verdict: {
      moreInfo: 'Approfondisci questa configurazione',
    },
    next: {
      obligations: "{{count}} pratiche metodologiche riguardano le tue risposte. Sono elencate, con quello che le ha attivate, nel Data Collection File.",
      title: 'Cosa fare adesso',
      lead: 'Punti sollevati dal motore sulle tue risposte. Ognuno dice perché riguarda il tuo caso e, dove il motore lo risolve, come.',
      provenance:
        "I nomi e gli enunciati delle regole sono tradotti dalla tabella inglese del motore. Il codice accanto a ogni voce — IR-01, CDP-02 — è il riferimento che non cambia da una lingua all'altra, e accanto resta il nome inglese.",
      allClear:
        'Nessun obbligo metodologico si applica a queste risposte e nessun punto di decisione critico è emerso. Prossimo passo: raccogliere i dati di inventario.',
      ctaHint: 'Il Data Collection File è calibrato su questo pathway: ti chiede solo quello che serve al tuo caso.',
    },
    actionKind: {
      block: 'Bloccante',
      obligation: 'Da documentare',
      decision: 'Da decidere',
    },
    severity: {
      HIGH: 'Alta',
      MEDIUM: 'Media',
      LOW: 'Bassa',
    },
    action: {
      appliesToCase: "Si applica a questo caso.",
      resolution: "Come si risolve",
      why: 'Perché riguarda te',
      todo: 'Cosa documentare',
    },
    technical: {
      title: 'Dettaglio tecnico (output del motore)',
      lead: 'Tutto quello che la pipeline ha prodotto, per revisione e tracciabilità.',
    },
    title: 'Output del motore',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'Situazione ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activatedNodes: 'Nodi attivati',
      l1Blocks: 'BLOCK L1 attivati',
      l2Violations: "Assertion L2 fallite (diagnostica)",
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
      run: 'Calcola il percorso',
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
      'Opzionale per consultare i casi legacy / pubblici. Necessario per creare casi privati che solo tu puoi modificare.',
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
    errors: {
      registrationClosed: 'La registrazione è chiusa su questa istanza. Chiedi un account all\'amministratore.',
      emailTaken: 'Esiste già un account con questa email. Prova ad accedere.',
      invalidCredentials: 'Email o password errate.',
    },
  },

  scoringPending: {
    title: "In attesa dei punteggi",
    body:
      "I punteggi quantitativi LCSA di questo caso non sono ancora stati consegnati. Quando arriveranno, gli indicatori ambientali, economici e sociali compariranno qui.",
    lastChecked: "Ultimo controllo: {{date}}",
  },

  compliance: {
    status: {
      ok: "sì",
      no: "non dichiarato",
      pending: "in attesa",
      na: "non applicabile",
    },
  },
  stakeholder: {
    audience: {
      industry: {
        whatYouSee:
          "Cosa ti dice questa pagina oggi: quale metodologia seguirà la valutazione, e quindi quali dati ti verranno chiesti. La richiesta vera e propria è il Data Collection File.",
        whenScoring:
          "Quando arriveranno i punteggi vedrai gli indicatori ambientali ed economici del caso, così da giudicare se lo scambio conviene.",
      },
      community: {
        whatYouSee:
          "Cosa ti dice questa pagina oggi: quali flussi le aziende si scambiano, e se questo studio esamina o no gli effetti sociali.",
        whenScoring:
          "Quando arriveranno i punteggi vedrai gli indicatori sociali — lavoratori, comunità locale — e quelli ambientali, ciascuno con il gruppo che riguarda.",
      },
      authority: {
        whatYouSee:
          "Cosa ti dice questa pagina oggi: come è impostata la valutazione, quali segnali di conformità il caso dichiara, e qual è l'ambito geografico coperto.",
        whenScoring:
          "Quando arriveranno i punteggi vedrai i valori ambientali e, dove lo studio li include, i costi societali — i due su cui si regge una decisione pubblica.",
        scope: "Ambito geografico dichiarato per il caso: {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "Cosa ti dice questa pagina oggi: quali materiali questa simbiosi rimette in uso, e se gli effetti ambientali e sociali sono esaminati.",
        whenScoring:
          "Quando arriveranno i punteggi vedrai gli indicatori ambientali e sociali della filiera dietro al prodotto.",
        productCaveat:
          "Questa valutazione descrive lo scambio tra le aziende, non il prodotto finale che compri: lo strumento non chiede quale sia il prodotto.",
      },
    },
    noVerdict: "Nessun pathway ancora derivato per questo caso.",
    notAssessed: {
      social: "Questo studio non valuta gli impatti sociali: la dimensione sociale è stata disattivata alla configurazione del caso. Chiedi all'analista di attivarla se lavoratori o comunità locale fanno parte della domanda.",
      economic: "Questo studio non valuta i costi: la dimensione economica è stata disattivata alla configurazione del caso.",
    },
    flowsLine_one: "{{count}} flusso scambiato: {{names}}.",
    flowsLine_other: "{{count}} flussi scambiati: {{names}}.",
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
        "Vista tecnica completa della configurazione metodologica e dei punteggi quantitativi, prodotti fuori da questo strumento dal partner SYMBA CIRCE. Per chi gestisce il sito e per l'analista dietro allo studio.",
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
    activatedNodesCount_one: '{{count}} nodo metodologico attivato',
    activatedNodesCount_other: '{{count}} nodi metodologici attivati',
    obligations_one: "{{count}} pratica metodologica da documentare",
    obligations_other: "{{count}} pratiche metodologiche da documentare",
    cdpFlagsCount_one: '{{count}} tensione cross-dimensionale',
    cdpFlagsCount_other: '{{count}} tensioni cross-dimensionali',
    complianceTitle: 'Segnali di compliance',
    compliance: {
      peerReview: 'Revisione indipendente fra pari: {{status}}',
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

  obligations: {
    empty: "Niente da documentare per questo caso.",
    lead:
      "{{total}} voci riguardano questo caso: {{mandates}} mandati metodologici e {{rules}} regole cross-method attivate dalle tue risposte. Ognuna è un impegno da documentare nel report LCSA.",
    because: "Si applica perché:",
    notApplicable: "Qui non si applica: {{fields}} — quel metodo è spento in Q3.",
    origin: {
      mandate: "Mandato",
      rule: "Regola cross-method",
    },
  },
  dcf: {
    noCase: { title: 'Nessun caso', desc: 'Il Data Collection File si costruisce dalla tua valutazione: compila prima il questionario (o apri un caso salvato) e poi torna qui.', cta: 'Apri il questionario' },
    derivedField: "compilato dal motore",
    obligationsTitle: "Scelte metodologiche da documentare",
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
    tabOverview: 'Panoramica',
    tabNetworkBuilder: 'Editor di rete',
  },

  networkDiagram: {
    counts: '{{actors}} attori · {{flows}} flussi',
    placeholder:
      "Solo anteprima — questo è un segnaposto costruito dai flussi dichiarati nel questionario. Disegna la rete vera nel tab Editor di rete e comparirà qui, nell'Excel e nel report.",
  },

  networkBuilder: {
    loadExample: 'Carica esempio',
    exampleReplaceConfirm:
      'Questo sostituisce la rete attualmente sul canvas con l\'esempio. Procedo?',
    whyAsked: 'Richiesto perché:',
    hint: {
      step1: 'Aggiungi un attore per ogni partecipante alla simbiosi — un impianto, una utility, un comune.',
      step2: 'Trascina dal bordo di un nodo a un altro per collegarli: quella freccia è una riga della flow matrix.',
      step3: 'Seleziona un nodo o una freccia e compila i campi nel pannello laterale. Vedi solo i campi che servono al tuo pathway.',
      dismiss: 'Ho capito',
    },
    empty: {
      title: 'Non hai ancora disegnato niente',
      body: 'Aggiungi il primo attore, oppure carica un esempio con tre attori e due flussi per vedere com\'è fatta una rete.',
    },
    example: {
      producer: 'Impianto produttore',
      consumer: 'Impianto ricevente',
      facilitator: 'Gestore area industriale',
      flow: 'Flusso di esempio',
    },
    title: 'Editor di rete',
    subtitle:
      'Disegna la rete di simbiosi: ogni nodo è un attore, ogni freccia una riga della flow matrix. Quello che disegni qui è quello che finirà nell\'Excel e nel report.',
    addActor: 'Aggiungi attore',
    actor: 'Attore',
    noRole: 'ruolo non impostato',
    save: 'Salva rete',
    saving: 'Salvataggio…',
    synced: 'Salvata sul server',
    unsavedChanges: 'Modifiche non salvate',
    unsavedCase: 'Bozza locale — salva il caso per sincronizzare',
    saveCaseFirst:
      'Questo caso non è ancora salvato sul server. Puoi disegnare la rete adesso; salva il caso dalla pagina del risultato per conservarla.',
    missingRequired_one: '{{count}} campo obbligatorio ancora vuoto',
    missingRequired_other: '{{count}} campi obbligatori ancora vuoti',
    selectHint: 'Seleziona un attore o un flusso per modificarne i campi.',
    removeRow: 'Rimuovi',
    unwiredTitle: 'Flussi non ancora disegnati',
    unwiredHint:
      'Questi flussi vengono dalle risposte a Q5. Collega due attori sul canvas per agganciare il prossimo.',
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
