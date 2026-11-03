// Italian. Termini metodologici LCA/LCC/S-LCA + sigle ILCD/PEF/CSRD/MFCA
// /CBA/TEA lasciati invariati (sono normativi).

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
    open: {
      eyebrow: "Report condiviso",
      title: "Apri un report che hai ricevuto",
      lead: "Incolla il link che ti hanno mandato, oppure solo il codice del caso alla sua fine (per esempio valle-del-formaggio).",
      label: "Link o codice del caso",
      placeholder: "https://…/r/…",
      invalid: "Non sembra il link di un report. Incolla tutto il link che hai ricevuto, oppure il codice dopo /r/.",
      submit: "Apri il report",
      noLink: "Non hai un link? Chiedilo a chi ti ha parlato del caso. Per sapere che cos'è SYMBA:",
    },
    eyebrow: 'Report condiviso · {{name}}',
    summaryTitle: "Come verrà fatta la valutazione",
    scoringTitle: "Risultati",
    complianceTitle: 'Segnali di compliance',
    whatTitle: "Che cos'è questa pagina",
    whatBody: "Come va valutato questo caso di simbiosi industriale: quali scelte di metodo valgono e quali dati vanno raccolti. Non contiene ancora risultati (né emissioni, né costi, né dati sociali) e non è una certificazione di nessuna azienda o prodotto. I numeri li calcola a parte chi esegue lo studio.",
    caseTitle: "Il caso",
    running: { yes: "Questi scambi avvengono già.", no: "Questi scambi sono in progetto o appena avviati." },
    market: "Mercato di riferimento: {{market}}",
    updated: "Salvato il {{date}}",
    methodEyebrow: "Come verrà valutato",
    sectorTag: "Settore: {{sector}}",
    scaleTag: "Interazioni: {{scale}}",
    compliance: {
      peer: { name: "Revisione indipendente", desc: "Un revisore controlla lo studio secondo la ISO 14044, come per una pubblicazione scientifica." },
      pef: { name: "Impronta ambientale di prodotto UE (PEF)", desc: "Lo studio segue il metodo UE dell'impronta ambientale, compresa la Circular Footprint Formula.", descC2: "Non applicabile: il rendiconto di una sola azienda usa l'allocazione, non la Circular Footprint Formula (ILCD C2)." },
      public: { name: "Affermazione comparativa pubblica", desc: "Dire in pubblico che un prodotto è migliore o equivalente a un altro richiede un panel di revisione ISO." },
      dnsh: { name: "Tassonomia UE, \"non arrecare danno significativo\" (DNSH)", desc: "Una verifica a parte per i finanziamenti legati alla tassonomia UE (art. 17); questo strumento non la esegue." },
      notPlanned: "non prevista in questo studio",
      notAssessed: "non valutata da questo strumento",
    },
    audience: {
      showingFor: 'Vista per — {{name}}',
      industry: { short: '🏭 Industria', name: 'Industria', title: 'Vista operatore', body: 'Quadro tecnico completo della configurazione metodologica per chi gestisce la simbiosi.' },
      community: { short: '🌳 Comunità', name: 'Comunità', title: 'Vista impatto locale', body: "Che cosa cambia per chi vive vicino agli impianti: effetti sull'ambiente della zona e sulle persone, positivi e negativi." },
      authority: { short: '🏛 Autorità', name: 'Autorità locale', title: 'Vista regolatoria e di policy', body: "Come è impostata la valutazione: costi, beni condivisi, scenario di riferimento, affermazioni pubbliche, orizzonte, effetti sociali." },
      enduser: { short: '👤 End user', name: 'End user', title: 'Riassunto end-user', body: "Di che cosa parla questo caso e che cosa verrà valutato. I risultati non ci sono ancora." },
    },
    note: "Ogni scheda mostra lo stesso caso da un punto di vista diverso; i fatti sono gli stessi in tutte e quattro.",
    about: {
      isTitle: "Che cos'è la simbiosi industriale?",
      isBody: "Quando gli scarti di un'azienda (siero, segatura, calore, acqua) diventano la materia prima di un'altra invece di essere buttati.",
      eyebrow: 'Cos\'è SYMBA T4.6',
      title: 'Report pubblici · in breve',
      lead:
        'Qualcuno ha condiviso un caso con te.',
      whoTitle: 'Chi c\'è dietro?',
      whoBody: "SYMBA è un progetto di ricerca finanziato dall'Unione Europea (Horizon Europe, Grant Agreement 101135562) che sviluppa strumenti aperti per la simbiosi industriale nell'industria bio-based. Questo strumento è stato sviluppato da ENCO, con CIRCE e CET; non appartiene a nessuna delle aziende di cui descrive i casi.",
      whatTitle: 'Cos\'è un "report"?',
      whatBody: "Un report condiviso descrive come va valutato un caso di simbiosi industriale: quali scambi fra aziende comprende e quali scelte di metodo valgono per la sua valutazione ambientale, economica e sociale. Le quattro schede raccontano lo stesso caso a quattro tipi di lettore.",
      whereTitle: 'Dove trovo altre informazioni?',
      whereBody: 'Visita il sito del progetto o leggi le deliverable su',
      enterTool: 'Entra nel tool',
      backToReport: "Torna al report",
    },
    region: {
      eyebrow: 'Regione · {{code}}',
      title: 'Dashboard regionale',
      lead: 'Vista aggregata di tutti i casi IS di questa regione. I numeri si aggiornano quando nuovi casi vengono salvati.',
      total: 'Casi',
      situations: 'Situazioni ILCD',
      sectors: 'Settori coperti',
      bySituationTitle: 'Per situazione ILCD',
      bySectorTitle: 'Per settore',
      tableKey: 'Valore',
      tableCount: 'Conteggio',
      errorTitle: 'Regione non disponibile',
      errorBody: 'Impossibile ottenere i dati aggregati per questa regione.',
    },
  },

  welcome: {
    title: "Benvenuto in SYMBA",
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
      assess: { name: 'Avvia una nuova valutazione', desc: 'Configura la metodologia per un caso IS con un breve questionario.' },
      read: { name: 'Leggi un report condiviso', desc: 'Apri un caso che qualcuno ha condiviso e leggi il report.' },
      explore: { name: 'Esplora una regione / settore', desc: "Vedi come si distribuiscono i casi salvati fra metodi e settori." },
      browse: { name: 'Solo dare un\'occhiata', desc: 'Nessun obiettivo specifico — voglio vedere cosa fa il tool.' },
    },
  },

  adminShell: {
    menuOpen: "Menu",
    menuClose: "Chiudi",
    searchLabel: 'Cerca',
    searchPlaceholder: 'Cerca casi, partner… (⌘K)',
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
    intro: {
      what: { title: "Che cosa fa", body: "Ti dice come va impostata la valutazione di uno scambio di simbiosi industriale, secondo le linee guida SYMBA, e quali dati raccogliere dalle aziende coinvolte." },
      not: { title: "Che cosa non fa", body: "Non calcola i risultati: niente emissioni, costi o dati sociali. Li calcola chi esegue lo studio, con i dati che lo strumento chiede." },
      who: { title: "Per chi è", body: "Analisti di sostenibilità e consulenti qui impostano i loro studi; aziende, enti pubblici e associazioni leggono i report e vedono quali dati verranno chiesti." },
    },
    title: "SYMBA — valutare la simbiosi industriale",
    tagline: "Come impostare la valutazione ambientale, economica e sociale di uno scambio fra aziende, e quali dati raccogliere.",
    description: "Rispondi a domande sul tuo caso: lo scarto, il sottoprodotto, il calore o l'acqua di un'azienda che diventano materia prima per un'altra. Ottieni la configurazione metodologica che lo studio deve seguire e un Data Collection File da mandare ai partner.",
    startButton: 'Avvia nuova valutazione',
    modeLabel: "Come vuoi rispondere",
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
    presetsTitle: "Esempi pubblicati",
    presetsMeta: "13 casi da articoli scientifici con revisione",
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
          "Aiuta chi si occupa di simbiosi industriale a configurare la metodologia di uno studio di ciclo di vita e a preparare il file di raccolta dati e i report (progetto Horizon Europe SYMBA, Grant Agreement 101135562, task T4.6). Non calcola risultati ambientali, economici o sociali."
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
          "Fornitore di hosting: [SEGNAPOSTO]. I link del tipo /r/… sono non elencati, non privati: chiunque abbia il link può leggere quel report. Per salvare un caso sul server serve un account; ogni caso salvato può essere letto e modificato solo da chi lo ha salvato e dall'amministratore (il primo account registrato), che può leggere e modificare ogni caso: non inserire dati personali di terzi."
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
    whoTitle: "Chi l'ha fatto",
    whoBody: "Lo strumento è stato sviluppato da ENCO, con CIRCE e CET, come task T4.6 di SYMBA, un progetto finanziato dal programma Horizon Europe dell'Unione Europea (Grant Agreement 101135562). Non appartiene a nessuna delle aziende di cui valuta i casi.",
    sourcesTitle: "Su che cosa si basa",
    sourcesBody: "Domande, regole e richieste di dati seguono i deliverable metodologici del work package 4 di SYMBA: D4.1 (valutazione del ciclo di vita della simbiosi industriale, con i capitoli di settore), D4.2 (costi lungo il ciclo di vita) e D4.3 (valutazione sociale del ciclo di vita). Ogni riga del risultato cita la sezione da cui viene.",
    notTitle: "Che cosa non fa",
    notBody: "Non calcola risultati ambientali, economici o sociali (niente kg CO2eq, VAN o indicatori sociali): dice come va impostato lo studio e quali dati raccogliere. I numeri li calcola chi esegue lo studio, con software dedicati di LCA e di analisi dei costi.",
    divergencesTitle: "Dove si discosta dai deliverable, di proposito",
    divergencesLead: "Alcune scelte sono dello strumento, dichiarate qui perché un revisore le veda:",
    divergences: {
      c2: "Il rendiconto di una sola azienda (Situazione ILCD C2) ha solo costi a livello d'azienda: una scelta dello strumento, non una regola della D4.2.",
      uncertainty: "Matrice Pedigree e analisi Monte Carlo seguono le risposte (dichiarazione pubblica, maturità della tecnologia), mentre la D4.1 e la D4.2 le chiedono in ogni studio.",
      policy: "L'allineamento alle politiche UE (Q4 = D) porta i prezzi CE Delft e l'allocazione con il net tax factor, che la D4.2 lega all'LCC sociale.",
      assets: "Q12 conta i beni dedicati e condivisi costruiti per gli scambi, oggi o anni fa (D4.1 §6.3.3), dove la D4.2 §4.2 parla di beni nuovi.",
    },
    contactTitle: "Contatti",
    contactBody: "Per domande sullo strumento o sul progetto, scrivi dalla pagina contatti del sito SYMBA:",
    technicalTitle: "Dettagli tecnici (per specialisti)",
    title: 'Informazioni',
    p1:
      "SYMBA T4.6 aiuta chi imposta una valutazione di sostenibilità del ciclo di vita di una simbiosi industriale: da un questionario sul caso deriva quale metodologia si applica, quali pratiche vanno documentate e quali dati raccogliere dai partner della rete. Non calcola i risultati — i punteggi quantitativi sono prodotti fuori dallo strumento e compaiono qui quando arrivano.",
    p2:
      'Il questionario (Q0-Q12; Q9 fissa la situazione ILCD, Q10 l\'LCC sociale) attiva i 186 nodi Phase 1 più 40 regole cross-method (18 IR + 10 CIR + 5 FU + 7 B). L\'enforcement L3 in fase di reporting (IR-04 + IR-10) più 12 Critical Decision Points emergono per evidenziare tensioni cross-method.',
  },

  error: {
    title: 'Si è verificato un problema',
    backHome: 'Torna alla home',
    fallback: 'Errore inatteso',
  },

  questionnaire: {
    parts: {
      study: 'Lo studio',
      exchanges: 'Gli scambi',
      description: 'Descrizione del caso',
    },
    scopeNote: "Questo strumento non calcola i numeri di LCA/LCC/S-LCA. Deriva la configurazione metodologica che il tuo caso richiede e i dati che devi raccogliere; lo scoring quantitativo è prodotto esternamente e compare qui quando arriva.",
    title: 'Questionario',
    guidedBannerTitle: 'Modalità guidata attiva',
    guidedBannerBody:
      "Ogni domanda si apre con una spiegazione breve, in parole semplici. La nota metodologica completa, nella formulazione dei deliverable di progetto, resta a un click sotto ogni domanda. Le risposte determinano la configurazione metodologica e il piano di raccolta dati che riceverai al termine.",
    intro:
      'Domande sul tuo caso di simbiosi industriale, in tre parti: lo studio, gli scambi e una descrizione del caso. Obbligatorie: le dimensioni (Q3), la decisione e la sua scala (Q9), il soggetto (Q1) e, con la dimensione economica, l\'obiettivo pubblico (Q10); il resto è facoltativo e rende più precisa la configurazione.',
    introPlain: "Domande sul tuo scambio fra aziende, in tre parti. Quelle con * sono obbligatorie; le altre rendono il risultato più preciso. Sotto ogni domanda trovi una spiegazione breve, in parole semplici.",
    runButton: 'Calcola la configurazione',
    runningButton: 'Sto calcolando…',
    resetButton: 'Reset bozza',
    confirmReset: 'Scartare tutte le risposte e ricominciare? Operazione non reversibile.',
    stepper: {
      progress: "Domanda {{n}} di {{total}} · {{part}}",
      back: "← Indietro",
      next: "Avanti →",
      showAll: "Mostra tutte le domande in una pagina",
      showSteps: "Una domanda alla volta",
      navLabel: "Domande",
    },
    stillRequired: "Mancano ancora:",
    flowsMissingQ5: "chi paga chi, per ogni flusso",
    shortcutTip: 'Suggerimento: Ctrl/⌘+Enter per eseguire',

    q0: {
      title: 'Q0 — Che tipo di studio di simbiosi è: analisi, miglioramento, espansione, progettazione o ristrutturazione?',
      help: 'Facoltativa. Il tipo di studio, come D4.1 chiede di dichiararlo nell\'obiettivo. Da solo non cambia nulla.',
      details: 'D4.1 §4.3.2, sulla scorta di Mattila et al. (2012), chiede di classificare l\'obiettivo secondo un quadro consolidato. Analisi valuta una rete esistente per capirne le prestazioni; Miglioramento individua i punti critici di una rete esistente per ottimizzarla; Espansione valuta gli impatti dell\'aggiunta di un nuovo partner o scambio; Progettazione confronta opzioni tecnologiche e logistiche per una rete nuova, pianificata; Ristrutturazione valuta una riconfigurazione importante di una rete consolidata. La risposta va nel report e nel Data Collection File; come si modella lo studio lo decidono sempre le domande seguenti. Il motore segnala solo due contraddizioni: un\'analisi i cui scambi non avvengono ancora, e una progettazione i cui scambi avvengono già (Q2).',
      options: {
        unset: { label: 'Non risposta' },
        analysis: { label: 'Analisi', description: 'Valutare una rete esistente per capirne le prestazioni.' },
        improvement: { label: 'Miglioramento', description: 'Trovare i punti critici di una rete esistente per ottimizzarla.' },
        expansion: { label: 'Espansione', description: 'Valutare gli impatti dell\'aggiunta di un nuovo partner o scambio.' },
        design: { label: 'Progettazione', description: 'Confrontare opzioni tecnologiche e logistiche per una rete nuova, pianificata.' },
        restructuring: { label: 'Ristrutturazione', description: 'Valutare una riconfigurazione importante di una rete consolidata.' },
      },
      plain:
        'Scegli il tipo di studio: capire come funziona una rete esistente, trovare dove può migliorare, aggiungere un partner o uno scambio, progettare una rete nuova, o ripensarne una consolidata. La risposta resta registrata con lo studio; da sola non cambia il metodo.',
    },

    q1: {
      title: 'Q1 — Cosa stai analizzando? *',
      help:
        'Scegli la voce più vicina: conta il soggetto dello studio, non chi lo commissiona. Descrive il sistema e il suo confine; come si modella lo studio lo decidono Q9 e le domande successive. (Obbligatoria.)',
      details:
        'A — scambio bilaterale (es. calore di scarto da Impianto X a Impianto Y, o gesso by-product da una centrale termoelettrica a un cementificio). Il soggetto è il FLUSSO CONDIVISO tra due aziende. ' +
        'B — parco eco-industriale o rete simbiotica con 3+ attori (es. Kalundborg, cluster NISP, masterplan di un parco industriale). Il soggetto è la RETE come sistema. ' +
        'C — decisione di policy o programma pubblico a scala regionale/nazionale (es. uno schema di sussidi IS, una cornice regolatoria, una strategia industriale UE). Il soggetto è la DECISIONE/PROGRAMMA, non un impianto specifico. ' +
        'D — singola azienda che quantifica il proprio contributo simbiotico per reportistica ESG / CSRD / sostenibilità (es. "abbiamo venduto 12 kt di scoria ai cementifici, ecco il nostro credito"). Il soggetto è UNA SOLA AZIENDA. ' +
        'E — monitoraggio periodico di una simbiosi già operativa (aggiornamenti KPI annuali, sorveglianza post-implementazione). Il soggetto è la SERIE STORICA, non uno studio una tantum.',
      options: {
        A: { label: 'A. Scambio specifico', description: "Uno scambio simbiotico tra due aziende, esistenti o in progetto." },
        B: { label: 'B. Eco-park / rete', description: 'Un parco eco-industriale o una rete simbiotica multi-attore.' },
        C: { label: 'C. Policy / programma', description: 'Una decisione di policy o programma a scala regionale o nazionale.' },
        D: { label: 'D. Report aziendale', description: "Il contributo simbiotico di una singola azienda per reportistica ESG/CSRD." },
        E: { label: 'E. Monitoraggio', description: 'Monitoraggio temporale di una simbiosi già operativa.' },
      },
      plain:
        'Di\' che cosa stai esaminando: uno scambio, un parco, un programma, un\'azienda, una simbiosi che segui nel tempo. La risposta descrive il sistema e il suo confine; come si modella lo studio lo decidono le domande seguenti, a partire da a che cosa serve lo studio (Q9). Se esiti fra due opzioni, tieni quella che descrive la cosa di cui vuoi misurare gli effetti.',
    },

    q2: {
      title: 'Q2 — Gli scambi che lo studio misura avvengono già?',
      details:
        'Rispondi sugli scambi simbiotici, non sugli impianti: un impianto può esistere mentre lo scambio che studi è ancora un progetto. A — sì: gli scambi avvengono oggi e i loro flussi si possono misurare (es. Kalundborg; il distretto conciario di Daddi 2017). Il riferimento è che cosa farebbe oggi ogni azienda se i collegamenti si interrompessero (HNSRS, D4.1 §11.1). Se la rete opera da molti anni, quel riferimento è un controfattuale moderno, non la configurazione delle aziende di decenni fa (D4.1 §11.2.2): lo chiede la domanda di seguito. B — non ancora: gli scambi sono progettati, in disegno, ipotetici o appena avviati, anche fra impianti che funzionano già. Il riferimento è la situazione attuale senza di loro, compresi gli scambi che già funzionano (CNSRS, D4.1 §11.1). Confrontare alternative (un\'espansione, una tecnologia nuova) è possibile in ogni studio: aggiungile come scenari qui sotto (D4.1 §4.3.3). Quando il sistema opera lo chiede Q8.',
      options: {
        A: { label: 'A. Sì, avvengono già', description: 'Gli scambi avvengono oggi: i loro flussi si possono misurare.' },
        B: { label: 'B. Non ancora', description: 'Progettati, in disegno o appena avviati, anche fra impianti che esistono già.' },
      },
      longStanding: {
        label: "La rete funziona da così tanto tempo che le alternative che ha sostituito (per esempio le caldaie che il teleriscaldamento userebbe) oggi non si costruirebbero più?",
        yes: 'Sì — il riferimento è un controfattuale moderno (D4.1 §11.2.2)',
        no: 'No — la rete è recente',
        unknown: "Non lo so — il riferimento è che cosa farebbe oggi ogni azienda senza i collegamenti",
      },
      plain:
        'Pensa agli scambi, non agli impianti. Se i flussi fra le aziende avvengono già, li puoi misurare. Se sono ancora un\'idea, anche fra impianti che funzionano già, li puoi solo stimare. Vuoi confrontare alternative, come un\'espansione o una tecnologia nuova? Aggiungile come scenari qui sotto, qualunque sia la risposta qui.',
    },

    q3: {
      title: 'Q3 — Quali dimensioni della sostenibilità includere? *',
      help: "Almeno una è obbligatoria. Ambientale ed economica sono l'abbinamento abituale.",
      details:
        'ENV — Life Cycle Assessment ambientale (LCA): impatti su clima, ecosistemi, uso di risorse. Quasi sempre selezionata. ' +
        'ECO — dimensione economica, valutata con Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) è una tecnica usata dentro l\'LCC, non un\'alternativa; CBA e TEA non sono offerte da questo strumento. ' +
        'SOC — S-LCA. Selezionarla aggiunge le regole sociali (categorie di stakeholder: lavoratori, comunità locale, catena del valore). ' +
        'La maggior parte dei paper IS pubblicati esegue solo ENV (es. Sokka, Daddi); pochi accoppiano ENV+ECO (Hashimoto, Wiktor); solo una manciata aggiunge SOC.',
      warning: 'Seleziona almeno una dimensione per procedere.',
      env: 'Ambientale (LCA)',
      eco: 'Economica (LCC)',
      soc: 'Sociale (S-LCA)',
      plain:
        "Tre valutazioni distinte, ognuna con il suo metodo e i suoi dati: ambientale, economica — i costi lungo tutto il ciclo di vita, non un'analisi costi-benefici — e sociale. Scegli quelle che intendi consegnare. La maggior parte degli studi pubblicati fa solo quella ambientale, e aggiungere l'economica è il passo successivo abituale; quella sociale richiede molte più informazioni dalle persone coinvolte, quindi mettiti in conto di andare a raccoglierle.",
    },

    q4: {
      title: "Q4 — Come userai e comunicherai i risultati?",
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
        "Aggiungi una riga per ogni flusso simbiotico principale e indica chi paga chi. Obbligatorio quando analizzi uno scambio, una rete o una sola azienda (Q1 = A, B o D); facoltativo altrimenti.",
      details:
        'Per ogni flusso principale scambiato tra attori (calore, CO₂, scorie, acque reflue, idrogeno…) scegli chi paga chi: ' +
        'a — A paga B per ritirare il flusso (una tariffa di conferimento: valore di mercato negativo, un RIFIUTO per A, D4.1 §8.3.2). Lo zero-burden vale dal punto in cui il residuo raggiunge per la prima volta un valore non negativo, non al cancello. Pagare non significa inevitabile: D4.2 §6.2 richiede anche il test causale di evitabilità, dichiarato per flusso nel Data Collection File. ' +
        'b — flusso scambiato GRATIS (stato ambiguo): il test del valore economico decide se è un rifiuto o un co-prodotto, con un\'analisi di sensibilità. ' +
        'c — B paga A per il flusso (valore di mercato positivo: un CO-PRODOTTO per A): sostituzione del materiale vergine spiazzato, con un rapporto corretto per qualità. La Circular Footprint Formula del PEF non dipende da Q5: viene da Q4=D. Se nessun terzo pagherebbe per il flusso (test di Freedom-to-Act, D4.1 §8.3.3), il prezzo è amministrativo e il flusso è modellato come rifiuto. ' +
        'd — flusso INTERDIPENDENTE: A ha modificato deliberatamente il proprio processo (qualità, quantità, post-trattamento) per fornire B; un co-prodotto qualunque sia il prezzo, mai zero-burden. ' +
        'e — AGGREGATO / black-box: la fonte non dà dettaglio per flusso (tipico dei lavori aggregati come Sokka 2011). È un limite della fonte, non una scelta di modellazione: D4.1 §8.3.1 vieta una regola unica per tutta la rete, quindi il Data Collection File chiede comunque la classificazione di ogni flusso che puoi nominare. ' +
        'Q5 registra chi paga chi; i test giuridici ed economici (Freedom-to-Act, End-of-Waste, classe di sottoprodotto, evitabilità, punto dello zero-burden) si dichiarano per flusso nella sezione Flow classification del Data Collection File. Per gli studi di policy con Q1=C, Q5 è di solito facoltativa.',
      plain:
        "Per ogni cosa che si muove fra le aziende — calore, acqua, scorie, CO₂ — qui la domanda è soltanto chi paga chi: chi manda il flusso paga per liberarsene, nessuno paga, oppure chi lo riceve lo paga. Se chi manda ha cambiato di proposito il proprio processo per fornirlo, scegli quella voce qualunque cosa dica il denaro. Se la tua fonte dà un unico numero per tutta la rete, scegli l'ultima opzione: ti verrà comunque chiesto di ogni flusso che sai nominare, perché una regola unica per tutta la rete non è ammessa. Se un flusso sia un rifiuto per la legge si decide dopo, nel file di raccolta dati, non qui.",
    },

    q6a: {
      title: 'Q6a — Settore',
      help: 'Il settore principale del caso, come descrizione. Le regole di settore della D4.1 Part 2 seguono il settore di ogni flusso scambiato, dichiarato nella tabella dei flussi.',
      details:
        'Il settore descrive il caso e apre alcuni campi specifici nel Data Collection File; le regole di settore della D4.1 Part 2 seguono il settore dichiarato per ogni flusso, perché i capitoli seguono ciò che si scambia. Scegli la corrispondenza più vicina al settore dominante del caso (l\'attore che contribuisce più massa/energia/valore). ' +
        'Esempi: Carta e cellulosa per Sokka 2011 (UPM Kymi); Cemento / costruzioni per Hashimoto 2010 (Kawasaki); Tessile / pelletteria per Daddi 2017 (distretto conciario); Acque reflue / fanghi / biofactories per Wiktor 2018; Chimica / fertilizzanti per Leiva 2025 Escombreras; Polimeri bio-based per Briassoulis. ' +
        'Per casi misti usa Multi-settore.',
      options: {
        none: '(nessuno)',
        agriculture_agrifood_biorefineries: 'Agricoltura / agroalimentare / bioraffinerie',
        biobased_polymers: 'Polimeri bio-based',
        plastics_packaging: 'Plastiche e packaging',
        pulp_paper: "Carta e cellulosa",
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
        other: "Altro",
        wastewater_biofactories: 'Acque reflue / fanghi / biofactories (legacy)',
        agri_food: 'Agroalimentare / bioraffinerie (legacy)',
        process_industry: 'Industria di processo (legacy)',
      },
      plain:
        'Il settore principale del caso: l\'attività dell\'azienda che pesa di più in massa, energia o valore. Descrive il caso; le regole di settore delle linee guida seguono che cosa è ogni flusso, e lo dichiari nella tabella dei flussi. Se il caso sta a cavallo di più settori scegli Multi-settore e ignora le voci (legacy).',
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
      title: 'Q7 — Quanto sono concentrate le interazioni chiave?',
      help: 'Decide come si regionalizza la valutazione degli impatti. Il trasporto si modella in modo esplicito per ogni scambio, qualunque sia la risposta; la distanza di pareggio si chiede per ogni flusso nel Data Collection File.',
      details:
        'D4.1 §12.2.3: un fattore di caratterizzazione medio globale o nazionale non coglie il significato di un sistema le cui interazioni chiave sono intensamente locali (es. una sinergia di condivisione dell\'acqua in una regione arida). A — un sito o impianti adiacenti: fattori specifici per il luogo per scarsità idrica, eutrofizzazione e acidificazione, e il disallineamento di scala segnalato dove fattori regionali si applicano a livello di sito (§12.3.3). B — dentro una regione: fattori regionalizzati, es. i fattori per paese di Seppälä / Posch per un cluster regionale (§12.3.3). C — fra regioni o oltre confine: fattori spazialmente espliciti nel luogo di ogni emissione. Il trasporto non dipende mai da questa risposta: ogni collegamento è un processo unitario distinto del foreground con dati primari, e GIS o strumenti di calcolo dei percorsi sono raccomandati per ogni scambio (§12.3.1). La seconda parte chiede il mercato da cui vengono i prodotti sostituiti: su di esso si risolvono i mix del background e lo scenario di riferimento, di regola nazionale o sub-nazionale, continentale solo per merci scambiate su scala globale senza un mercato sub-continentale (§11.3.1).',
      options: {
        A: { label: 'A. Un sito', description: 'Un sito o impianti adiacenti: le interazioni sono intensamente locali.' },
        B: { label: 'B. Regionale', description: 'Più siti dentro una regione.' },
        C: { label: 'C. Fra regioni', description: 'Siti fra regioni o oltre confine.' },
      },
      market: {
        label: 'Mercato di riferimento: da dove verrebbero i prodotti sostituiti?',
        help: 'Il mercato da cui attingerebbe il controfattuale, non il mercato dei prodotti della simbiosi. Facoltativo.',
        region: 'Paese o regione',
        regionPlaceholder: 'es. Italia, Catalogna, UE',
        scope: {
          unset: 'Non risposta',
          national: 'Nazionale',
          sub_national: 'Sub-nazionale (una regione dentro un paese)',
          continental: 'Continentale (solo per merci scambiate in tutto il mondo)',
        },
      },
      plain:
        'Quanto sono vicine le interazioni chiave fra le aziende: su un sito, dentro una regione, o fra regioni o oltre confine. Decide quanto localmente si valutano gli impatti ambientali: l\'inquinamento dell\'acqua o dell\'aria accanto a un sito pesa diversamente dalla stessa quantità sparsa in un paese. Il trasporto si conta comunque. Poi di\' da dove verrebbero altrimenti i prodotti che la simbiosi sostituisce: un paese, una regione o, per le merci scambiate in tutto il mondo, un continente.',
    },
    q8: {
      title: 'Q8 — Orizzonte temporale dello studio',
      help: 'Facoltativa. Un solo orizzonte per LCA e LCC.',
      details: 'I deliverable chiedono un solo orizzonte temporale per LCA, LCC e S-LCA (D4.2 §11, D4.1 §14). Gli scenari di background futuri (SSP/RCP) si aggiungono a entrambe quando il sistema opera in un anno futuro (D4.1 §9.3.5, §12.3.2), quando la tecnologia chiave è sotto TRL 7 (Q6b) o quando il periodo di analisi o la vita degli asset principali supera 15 anni (D4.2 §9.3, che dà la cifra senza fonte; si può cambiare fra le impostazioni avanzate). Senza risposta, l\'anno di esercizio è quello dello studio. Il periodo di analisi è l\'arco di tempo coperto dallo studio; di norma coincide con la vita tecnica degli asset principali (D4.2 §9). La vita degli asset principali è anche il periodo su cui si ammortizzano i loro beni capitali, lo stesso in LCA e LCC (D4.1 §6.3.3, §14.2.2); gli asset con una vita diversa vanno nel file di raccolta dati.',
      start: {
        label: 'In quale anno opera il sistema, o si assume che operi?',
        options: {
          unset: 'Non risposta (l\'anno dello studio)',
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
      title: "Q9 — Quale decisione sostiene lo studio, e fin dove arrivano le sue conseguenze? *",
      help: 'Obbligatoria. Decide la situazione di modellazione (ILCD A, B, C1 o C2); Q1 descrive solo il soggetto.',
      details: "La Tabella 1 di D4.1 classifica lo studio in base alla decisione che sostiene e alla scala delle sue conseguenze, non in base al soggetto (D4.1 §4.2.3). Micro (Situazione A) è il default per le decisioni su singoli scambi e impianti. Strutturale (Situazione B) vale quando la decisione cambia la capacità installata in un mercato: l'ILCD Handbook lo assume quando la domanda o l'offerta annua che la decisione aggiunge o toglie a un mercato supera la capacità che quel mercato rinnova ogni anno, contando al massimo il 5 % (es. 10 Mt di impianti che durano 25 anni rinnovano 0,4 Mt l'anno). La progettazione di un nuovo parco, una ristrutturazione regionale o un programma richiedono questo screening (Mattila et al. 2012); senza, lo studio resta A, con B come analisi di sensibilità. Documentare una rete esistente, o un rendiconto aziendale che conta ciò che i suoi scambi fanno risparmiare altrove, è Situazione C1 (sostituzione, §7.2.3); il rendiconto di una sola azienda che esclude ogni credito per i suoi scambi è C2 (allocazione, nessun credito, §7.2.3), con costi solo a livello d'impresa (scelta di progetto T4.6).",
      examples: {
        micro: "Per esempio: vuoi sapere se conviene dare la segatura al pellettificio vicino, per avviare, continuare o cambiare lo scambio.",
        structural: "Per esempio: un programma regionale abbastanza grande da cambiare quanto produce il mercato della regione. Un analista deve documentare la verifica del mercato.",
        none: "Per esempio: vuoi descrivere che cosa rende oggi una rete di scambi esistente, per un rapporto, senza nulla da decidere.",
        corporate_report: "Per esempio: il bilancio di sostenibilità della tua sola azienda (CSRD, la direttiva UE sui bilanci di sostenibilità): i benefici che i tuoi scambi portano ad altri non si contano.",
      },
      options: {
        micro: 'Esplora o sostiene una scelta, anche ipotetica e senza un decisore nominato, e i suoi effetti restano negli impianti coinvolti (Situazione A)',
        structural: "Sostiene una scelta che cambia quanto produce un mercato o un settore, oltre la capacità che rinnova ogni anno (Situazione B; lo screening va documentato)",
        none: "Nessuna scelta: documenta ciò che una rete o un sistema esistente rende, compreso ciò che fa risparmiare altrove (Situazione C1)",
        corporate_report: "Rendiconto di una sola azienda che esclude ogni credito per ciò che i suoi scambi evitano altrove, es. contabilità ESG / CSRD rigorosa (Situazione C2)",
      },
      screening: {
        label: "È documentato che la quantità annua che la decisione aggiunge o toglie al mercato interessato supera la capacità che quel mercato rinnova ogni anno (al massimo il 5 %)?",
        yes: 'Sì, è documentato (Situazione B)',
        no: 'No (Situazione A, con la Situazione B come analisi di sensibilità)',
      },
      plain:
        "A cosa serve lo studio? Quasi sempre esplora o sostiene una scelta i cui effetti restano negli impianti coinvolti, anche quando nessuno deve ancora decidere. Solo quando il cambiamento supera ciò che il mercato rinnova ogni anno, e lo puoi dimostrare, lo studio cambia tipo; progettare un nuovo parco richiede questa verifica. Se descrivi soltanto una rete che funziona già, o il rendiconto di un'azienda senza crediti per i suoi scambi, dillo: ogni caso si modella in modo diverso.",
    },
    q10: {
      title: 'Q10 — Lo studio serve un obiettivo pubblico o un decisore pubblico? *',
      help: 'Obbligatoria quando c\'è la dimensione economica: decide se si aggiunge l\'LCC sociale.',
      details: 'D4.2 §2.3 aggiunge un LCC sociale (net tax factor, esternalità monetizzate, tasso di sconto sociale) quando lo studio serve un obiettivo di politica pubblica o di pianificazione territoriale, e §2.2 lega la scelta del tipo di LCC alla prospettiva del decisore: un comune, un\'utility pubblica o un ente regolatore assumono il punto di vista pubblico, qualunque sia il soggetto dello studio (D4.2 §9.2 indica 3-5 % come tasso di un partner comunale o di un\'utility pubblica). Un comune che pianifica un eco-parco o un\'utility che dimensiona un collegamento di teleriscaldamento rispondono sì. Il rendiconto rigoroso di una sola azienda (Q9: rendiconto aziendale, Situazione C2) tiene il costing a livello d\'impresa (scelta di progetto T4.6), e il tool lo dice.',
      options: {
        yes: 'Sì — un obiettivo di politica pubblica o di pianificazione, o un decisore pubblico (aggiunge l\'LCC sociale)',
        no: 'No — una decisione privata o il rendiconto di un\'azienda',
      },
      plain:
        'Rispondi sì se lo studio deve alimentare una decisione pubblica, o lo commissiona un ente pubblico: un comune, una regione, un\'utility pubblica, un regolatore, un piano. Si aggiunge allora una seconda lettura economica dal punto di vista della società: le tasse contate in un altro modo, e gli effetti che nessuno paga in denaro. Per il rendiconto di un\'azienda la lettura economica resta a livello d\'impresa.',
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
    q12: {
      title: "Q12 — La simbiosi usa beni dedicati e condivisi?",
      help: "Facoltativa, chiesta con LCA o LCC: condotte, impianti o stoccaggi costruiti per gli scambi, oggi o anni fa.",
      details: 'D4.2 §4.2 chiede se la rete richiede nuovi beni dedicati e condivisi: in tal caso il loro CAPEX e l\'OPEX corrente vanno inclusi nel prospetto dei costi e ripartiti fra i partner che ne beneficiano. D4.1 §6.3.3 include i beni capitali e le infrastrutture propri dello scenario di simbiosi, ammortizzati sulla vita tecnica di ogni bene (Q8). Con LCA e LCC entrambi attivi, un sì accende anche le regole che allineano i beni capitali fra i due (IR-13, B-06); per parchi e programmi con la dimensione sociale, gli indicatori S-LCA per l\'investimento condiviso (CIR-08).',
      options: {
        unset: 'Non risposta',
        yes: "Sì — condotte, impianti o stoccaggi costruiti per gli scambi, oggi o anni fa",
        no: "No — gli scambi usano solo beni che servirebbero comunque",
      },
      plain:
        "Rispondi sì se qualcosa è stato costruito, o va costruito, perché gli scambi avvengano: una condotta, un impianto di trattamento comune, un serbatoio, anche costruito anni fa. Il suo costo e la sua impronta ambientale entrano allora nello studio e si dividono fra le aziende che lo usano.",
    },

    q2dCard: {
      title: 'Scenari alternativi (facoltativo)',
      help:
        'Ogni studio può confrontare alternative con la propria situazione di partenza (D4.1 §4.3.3).',
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
    headers: { id: 'ID', name: 'Nome', q5: "Chi paga chi (Q5)", sellable: 'Vendibile ad altri?', sector: 'Settore (Parte 2)', configuration: "Configurazione (Parte 2)" },
    q5Unset: "— scegli chi paga chi",
    sellable: { unset: '— senza risposta', yes: 'Sì', no: 'No' },
    sellableHint: "Se il partner non prendesse questo flusso, chi lo genera potrebbe venderlo a qualcun altro a un prezzo positivo? Sì lo rende un co-prodotto. No non lo rende da solo un rifiuto: un unico acquirente che paga quanto pagherebbe un compratore indipendente (il prezzo del prodotto che il flusso sostituisce, al netto dei suoi costi in più per usarlo) lo rende comunque un co-prodotto; un flusso ceduto gratis, o un pagamento che divide solo i costi, lo rende un rifiuto (D4.1 §8.3.3). Facoltativa: il risultato segnala quando non concorda con Q5.",
    sectorHint: "Scegli il capitolo della D4.1 Part 2 di ciò che si scambia, non dell'azienda: residui agricoli e agroindustriali → Agroalimentare (§4); rifiuti urbani o misti, biorifiuti compresi (FORSU, scarti alimentari domestici) → Valorizzazione dei rifiuti (§8); fanghi e acque reflue trattate, anche quando riusate come acqua → Acque reflue (§6); un prodotto o un vettore energetico ottenuto da un flusso (biometano, digestato, elettricità) → il capitolo di quel flusso. Dove §4 e §8 si sovrappongono sui biorifiuti, decide l'origine (lettura T4.6 della Part 2 §3.3). Facoltativa: il risultato elenca le regole del capitolo. La D4.1 Part 2 ha capitoli solo per questi settori bio-based: per acciaio, cemento, calore, carta o chimica scegli «— nessuno di questi» e vale solo la Part 1.",
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
      a: "a — chi cede (A) paga chi riceve (B): rifiuto",
      b: 'b — Scambio gratuito (ambiguo)',
      c: "c — chi riceve (B) paga chi cede (A): co-prodotto",
      d: 'd — Interdipendente',
      e: 'e — Aggregato / black-box',
    },
  },

  scenarios: {
    intro:
      "Uno scenario qui fa variare le risposte *metodologiche*, non la rete fisica: eredita le risposte della baseline e differisce solo tramite il dict di override (\"e se fosse ex-post\", \"e se il settore fosse un altro\"). Confrontare dove va un flusso, a che distanza o a che prezzo è un confronto di rete — quelle alternative si disegnano nel Network Builder, e il motore non le confronta ancora.",
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
    },
  },

  narrative: {
    ilcd: {
      'ILCD Situation A': {
        title: 'Supporto decisionale con conseguenze limitate (Situazione ILCD A)',
        short: 'Supporto a decisione micro: lo scambio è troppo piccolo per cambiare il sistema di background. Modellazione attribuzionale, con sostituzione sul mix di mercato medio.',
        detail: 'Lo scambio riguarda gli attori coinvolti, non cosa l\'economia più ampia produce o come. Modelli quindi con dati medi, di tipo contabile, e rappresenti ciò che la simbiosi sostituisce usando il mix di mercato medio — il mix di rete nazionale per l\'elettricità, la produzione vergine media per un materiale. Il D4.1 mette esplicitamente in guardia dal passare al consequenziale solo perché c\'è una decisione di mezzo.',
      },
      'ILCD Situation B': {
        title: 'Supporto decisionale con conseguenze strutturali (Situazione ILCD B)',
        short: 'Supporto a decisione meso/macro: la decisione causa un cambiamento strutturale nel background, quindi modellazione consequenziale sulla tecnologia marginale. Il D4.1 chiede di dimostrare quella scala prima di sceglierla.',
        detail: 'La decisione è abbastanza grande da spostare capacità installata o produzione di una tecnologia specifica. La modellazione diventa consequenziale e ciò che la simbiosi sostituisce è la tecnologia marginale, identificata con un\'analisi di mercato e non presa come mix medio. L\'onere della prova è tuo: questa strada va dimostrata, non assunta.',
      },
      'ILCD Situation C1': {
        title: 'Documentare una rete esistente (Situazione ILCD C1)',
        short: 'Contabilità con interazioni — documentare cosa una rete esistente restituisce all\'economia più ampia. Sostituzione sul mix di mercato medio, come nella Situation A.',
        detail: 'Stai documentando una rete che esiste, non supportando una decisione, quindi lo studio è descrittivo. Ma dato che il punto è mostrare cosa la rete restituisce all\'economia più ampia, la multifunzionalità si risolve comunque per sostituzione sul mix di mercato medio — operativamente la stessa regola della Situation A.',
      },
      'ILCD Situation C2': {
        title: 'Rendiconto rigoroso di una sola azienda (Situazione ILCD C2)',
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
        detail: 'Sopra la vista d\'impresa e quella di catena del valore arriva quella di benessere collettivo. Tasse e sussidi sono trasferimenti interni alla società più che costi reali per essa, quindi vengono esclusi o convertiti in prezzi ombra con il Net Tax Factor, e gli impatti ambientali della LCA parallela vengono monetizzati. È la configurazione che serve a una decisione pubblica, ed è per questo che la porta un obiettivo pubblico o di policy.',
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
    verdictWhy: "Perché: hai risposto «{{answer}}» (Q9)",
    verdictWhyQ1: "Perché: Q9 non ha risposta, quindi la situazione si ricava da che cosa stai analizzando (Q1)",
    config: {
      title: 'La tua configurazione',
      lead: 'Che cosa hanno deciso le tue risposte, nei termini dei deliverable. Apri una riga per leggere il testo del motore, in inglese, con la sezione da cui viene.',
      nodeText: 'Testo del motore (inglese)',
      labels: {
        flows: "Trattamento dei flussi",
        claim: 'Dichiarazione pubblica',
        purpose: 'Tipo di studio',
        lcc: 'Costi',
        slca: 'Valutazione sociale',
        horizon: 'Orizzonte dello studio',
        reference: 'Scenario di riferimento',
        fu: 'Unità funzionale',
        regional: 'Impatti locali',
        sectors: 'Regole di settore',
        shared: 'Beni condivisi',
      },
      values: {
        noChapter: "Nessun capitolo della D4.1 Part 2 riguarda i flussi dichiarati: vale solo la Part 1",
        flowTreatment: {
          waste: "rifiuto: nessun carico fino al punto in cui acquista valore (carico zero)",
          evt: "incerto: test del valore economico, con analisi di sensibilità",
          coproduct: "co-prodotto: sostituzione del prodotto che rimpiazza, con fattore di qualità Q",
          integrated: "interdipendente: un unico processo multifunzionale, modellato per intero",
          allocation: "allocazione (rendiconto di una sola azienda: nessun credito di sostituzione)",
          aggregated: "aggregato: classificare ogni flusso che si può nominare",
        },
        claim: 'Dichiarazione comparativa al pubblico: revisione critica di un panel di almeno tre esperti indipendenti, niente pesatura',
        claimNone: 'Nessuna dichiarazione comparativa pubblica',
        claimPolicy: "Nessuna dichiarazione comparativa pubblica; allineamento alle politiche UE (Q4 = D): revisione di un panel indipendente, scelta T4.6",
        scope_continental: 'continentale',
        scope_sub_national: 'sub-nazionale',
        scope_national: 'nazionale',
        slcaOff: 'Non inclusa',
        reference_c2: 'Non usato per crediti: allocazione, niente sostituzione',
        horizonFuture: 'Background futuro (scenari SSP/RCP)',
        horizonPresent: 'Background attuale',
        reference_hnsrs: 'Che cosa farebbe oggi ogni azienda senza i collegamenti (HNSRS)',
        reference_modern: 'Un controfattuale moderno: che cosa farebbe oggi ogni azienda senza i collegamenti (HNSRS)',
        reference_cnsrs: 'Lo scenario senza la simbiosi, sull\'orizzonte dello studio (CNSRS)',
        market: 'mercato: {{market}}',
        fu_waste_treatment: 'Basata sull\'input: il trattamento del rifiuto',
        fu_product_substitution: 'Basata sull\'output: i prodotti e ciò che sostituiscono',
        fu_co_primary: 'Un sistema di unità funzionali: trattamento e prodotti insieme',
        fu_function: 'Orientata alla funzione, attorno al servizio reso',
        regional_A: 'Fattori di caratterizzazione specifici per il luogo per acqua, eutrofizzazione e acidificazione',
        regional_B: 'Fattori di caratterizzazione regionali o per paese',
        regional_C: 'Fattori per paese o regione per il territorio di ogni emissione',
        regional_unset: 'Fattori specifici per il luogo dove le interazioni chiave sono intensamente locali',
        shared: 'CAPEX e OPEX nel prospetto dei costi, ripartiti fra i partner che li usano',
      },
      why: {
        noChapter: "la Part 2 copre cinque settori bio-based e nessun flusso è dichiarato in uno di essi",
        flows: "chi paga chi per ogni flusso (Q5)",
        horizonUnanswered: "nessun anno di esercizio, periodo, vita degli asset o maturità della tecnologia indicati, quindi si assume il presente; se gli impianti funzioneranno oltre {{threshold}} anni, rispondi a Q8",
        lccNoPolicyNoLca: "nessun obiettivo pubblico (Q10): i costi di ogni partner, consolidati per la rete",
        slcaOff: 'la dimensione sociale non è selezionata (Q3)',
        claim: 'i risultati sosterranno una dichiarazione pubblica di superiorità o equivalenza (Q4 = C)',
        horizonFutureGeneric: 'l\'orizzonte dello studio arriva nel futuro',
        horizonFutureYear: 'il sistema opera in un anno futuro',
        label: 'Perché:',
        lccC2: 'rendiconto rigoroso di una sola azienda: solo costi a livello d\'impresa',
        referenceC2: "rendiconto rigoroso di una sola azienda: allocazione, nessun credito per ciò che la simbiosi sostituisce (D4.1 §7.2.3)",
        claimPolicy: "i risultati sosterranno l'allineamento alle politiche UE (Q4 = D)",
        lccNoLca: 'senza dimensione ambientale: nessun LCC ambientale da allineare',
        lccPolicy: 'hai risposto che lo studio serve un obiettivo pubblico (Q10)',
        lccPolicyInferred: 'letto da Q1, perché Q10 non ha risposta',
        lccNoPolicy: 'nessun obiettivo pubblico (Q10): punto di vista d\'impresa e di catena del valore',
        horizonYear: 'il sistema opera nel {{year}}',
        horizonTrl: 'la tecnologia chiave è sotto TRL 7',
        horizonPeriod: 'lo studio segue il sistema per {{years}} anni, più di {{threshold}}',
        horizonLifetime: 'i beni durano {{years}} anni, più di {{threshold}}',
        horizonPresent: 'anno attuale, tecnologia matura e orizzonte entro {{threshold}} anni',
        referenceNotYet: 'gli scambi non avvengono ancora (Q2)',
        referenceRunning: 'gli scambi avvengono già (Q2)',
        referenceLongStanding: 'la rete opera da molti anni (Q2)',
        fuGoal: 'lo studio confronta: {{goal}}',
        fuDefault: 'che cosa si confronta non ha risposta (Q11)',
        regionalUnset: 'la concentrazione delle interazioni non ha risposta (Q7)',
        sectors: 'i capitoli seguono il settore dichiarato su ogni flusso',
        shared: "la simbiosi usa beni dedicati e condivisi (Q12)",
      },
    },
    notes: { title: 'Note sulle tue risposte' },
    engineNotes: {
      study_purpose_vs_q2: {
        analysis: "Scopo dello studio: lo studio valuta una rete esistente, ma Q2 dice che gli scambi che misura non avvengono ancora. Controlla le due risposte (D4.1 §4.3.2).",
        design: "Scopo dello studio: lo studio confronta opzioni per una rete nuova, pianificata, ma Q2 dice che gli scambi avvengono già. Controlla le due risposte (D4.1 §4.3.2).",
      },
      q9_unanswered: "Q9 non ha risposta, quindi la situazione ILCD (Situazione {{situation}}) è letta da Q1, come per i casi salvati prima che Q9 esistesse. Rispondi a Q9: la Tabella 1 di D4.1 fissa la situazione in base alla decisione e alla scala delle sue conseguenze, non al soggetto dello studio.",
      q10_unanswered: {
        yes: "Q10 non ha risposta, quindi se lo studio serve un obiettivo pubblico è letto da Q1: l'LCC sociale viene aggiunto, come per i casi salvati prima che Q10 esistesse. Rispondi a Q10: D4.2 §2.3 aggiunge l'LCC sociale per un obiettivo di politica pubblica o di pianificazione o per un decisore pubblico, qualunque sia il soggetto dello studio.",
        no: "Q10 non ha risposta, quindi se lo studio serve un obiettivo pubblico è letto da Q1: l'LCC sociale non viene aggiunto, come per i casi salvati prima che Q10 esistesse. Rispondi a Q10: D4.2 §2.3 aggiunge l'LCC sociale per un obiettivo di politica pubblica o di pianificazione o per un decisore pubblico, qualunque sia il soggetto dello studio.",
      },
      structural_without_screening: "Q9 dice che gli effetti sono strutturali, ma lo screening di mercato non è documentato: lo studio è trattato come Situazione ILCD A, e la Situazione B va provata come analisi di sensibilità (ILCD Handbook 2010, §5.3).",
      structural_screening_missing: "La Situazione B richiede uno screening di mercato documentato: la quantità annua che la decisione aggiunge o toglie al mercato interessato deve superare la capacità che quel mercato rinnova ogni anno, contando al massimo il 5 % (ILCD Handbook 2010, §5.3); documentalo, oppure lo studio è in Situazione A con B come analisi di sensibilità.",
      decision_scale_vs_q1: {
        c_micro: "Q1 (pre-fattibilità di settore) di solito comporta conseguenze su scala strutturale; hai risposto conseguenze limitate, quindi lo studio è trattato come Situazione ILCD A. D4.1 §4.3.4: non scegliere l'LCA consequenziale solo perché si prende una decisione.",
        e_micro: "Q1=E (monitoraggio) non comporta decisioni; hai risposto che lo studio sostiene una decisione con conseguenze limitate, quindi è trattato come Situazione ILCD A.",
        e_structural: "Q1=E (monitoraggio) non comporta decisioni; hai risposto che lo studio sostiene una decisione con conseguenze strutturali, quindi è trattato come Situazione ILCD B.",
      },
      q1_d_not_corporate: "Q1=D descrive la rendicontazione di sostenibilità di un'azienda, ma Q9 dice che lo studio non è un rendiconto aziendale; la situazione ILCD segue Q9. Il rendiconto aziendale rigoroso (allocazione, niente crediti) è la Situazione ILCD C2 (D4.1 §7.2.3).",
      documentation_vs_ex_ante: 'La Situazione ILCD C documenta scambi che avvengono già, ma Q2 dice che non avvengono ancora. Controlla che la situazione sia quella che intendi.',
      c2_keeps_c_lcc: "Il rendiconto rigoroso di una sola azienda (Situazione ILCD C2) tiene il costing a livello d'impresa (solo C-LCC) qualunque sia la risposta a Q10: è una scelta di progetto T4.6, perché una sola azienda non ha un livello di rete.",
      policy_no_but_q1_c: "Q1=C (pre-fattibilità di settore) di solito serve una politica pubblica; hai risposto di no, quindi il costing sociale (S-LCC, net tax factor, tasso di sconto sociale) non viene aggiunto.",
      lcc_without_lca: {
        plain: "Q3 non comprende la dimensione ambientale, quindi non c'è un'LCA parallela: il costing è l'LCC convenzionale di ogni partner, consolidato a livello di rete (D4.2 §4.1), senza l'LCC ambientale, che D4.2 costruisce sul confine dell'LCA.",
        policy: "Q3 non comprende la dimensione ambientale, quindi non c'è un'LCA parallela: il costing è l'LCC convenzionale di ogni partner, consolidato a livello di rete (D4.2 §4.1), senza l'LCC ambientale, che D4.2 costruisce sul confine dell'LCA. L'LCC sociale mantiene il net tax factor e il tasso di sconto sociale, ma senza i risultati dell'LCA le esternalità non si possono monetizzare (D4.2 §11.2).",
      },
      c2_allocation_over_pef: "Il rendiconto rigoroso di una sola azienda (Situazione ILCD C2) usa l'allocazione e nessun credito di sostituzione (D4.1 §7.2.3), quindi la Circular Footprint Formula della PEF chiesta da Q4=D non si applica: la CFF è un metodo di prodotto. Se lo studio è un'impronta di prodotto e non un rendiconto aziendale, rivedi Q9.",
      slca_alone: "Q3 seleziona solo la dimensione sociale. D4.3 §3.1 costruisce l'S-LCA sull'unità funzionale e sui confini di un'LCA o di un LCC; se nessuno dei due è selezionato, documenta l'unità di riferimento e il confine nel charter metodologico.",
      flow_sellable_but_waste: "Flusso «{{flow}}»: Q5 dice che chi lo genera paga per disfarsene (rifiuto), ma un terzo lo pagherebbe. D4.1 §8.3.3 e §8.3.6 Step 1: un flusso con un valore di mercato positivo e indipendente è un co-prodotto, e il suo carico a monte si ripartisce (sostituzione o allocazione), non si taglia. Controlla Q5 per questo flusso.",
      flow_price_without_market: "Flusso «{{flow}}»: Q5 dice che chi riceve paga (co-prodotto), ma nessun terzo lo comprerebbe. Con un solo acquirente decide il prezzo (D4.1 §8.3.3): il flusso è un co-prodotto se chi riceve paga quanto pagherebbe un compratore indipendente, cioè il prezzo del prodotto che il flusso sostituisce al netto dei suoi costi in più per usarlo; se il pagamento divide solo i costi, il flusso è un rifiuto, a carico zero dal punto in cui raggiunge per la prima volta un valore non negativo (§8.3.6 Step 4). Confronta il prezzo con questo riferimento.",
      flow_freedom_to_act_settles: {
        co_product: "Flusso «{{flow}}»: Q5 lascia aperto chi paga chi, e la risposta Freedom-to-Act (D4.1 §8.3.3) indica un co-prodotto (§8.3.2, carico ripartito). La configurazione tiene il test del valore economico con analisi di sensibilità finché lo studio non lo conferma; per applicare subito questa lettura, imposta Q5 su c.",
        waste: "Flusso «{{flow}}»: Q5 lascia aperto chi paga chi, e la risposta Freedom-to-Act (D4.1 §8.3.3) indica un rifiuto (carico zero dal punto in cui raggiunge per la prima volta un valore non negativo, §8.3.6 Step 4). La configurazione tiene il test del valore economico con analisi di sensibilità finché lo studio non lo conferma; per applicare subito questa lettura, imposta Q5 su a.",
      },
      running_but_future: "Q2 dice che gli scambi avvengono già, ma Q8 colloca l'esercizio in un anno futuro o Q6b mette la tecnologia chiave sotto TRL 7. Uno scambio in corso si misura oggi: controlla Q2, Q8 e Q6b. Intanto lo scenario di riferimento e i tempi della valutazione dei costi seguono Q2, il background futuro segue Q8 e Q6b.",
      design_without_screening: "Lo studio progetta, espande o ristruttura una rete ed è modellato come Situazione A. D4.1 §4.2.3: questi studi richiedono lo screening di mercato ILCD (Mattila et al. 2012); senza, lo studio resta A, con la Situazione B come analisi di sensibilità. Documenta lo screening, oppure esegui B come sensibilità.",
      flow_part2_chapter: "Flusso «{{flow}}»: gli si applicano le regole di settore della D4.1 Part 2 {{chapter}}; sono elencate in Regole di settore.",
      case_sector_without_flow: "Il settore del caso appartiene alla D4.1 Part 2 {{chapter}}, ma nessun flusso dichiara quel capitolo, quindi le sue regole di settore non sono elencate. I capitoli seguono ciò che si scambia: dichiara il settore della Part 2 di ogni flusso nella tabella dei flussi.",
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
      configurationLine: "Flusso «{{flow}}» — {{configuration}}: il prodotto convenzionale che sostituisce è {{substitutes}}.",
      c2NoCredit: "Situazione C2: non si applica alcun credito di sostituzione (D4.1 §7.2.3); il prodotto descrive solo la configurazione.",
      count: '{{count}} regole',
      strength: { must: 'obbligo', should: 'raccomandato', descriptive: 'prassi' },
    },
    verdict: {
      moreInfo: 'Approfondisci questa configurazione',
    },
    next: {
      obligations: "{{count}} obblighi da documentare ({{groups}}), attivati dalle tue risposte. Il Data Collection File li elenca, con quello che ha attivato ciascuno, insieme alle pratiche che il metodo chiede a ogni studio come il tuo.",
      families: {
        IR: '{{count}} sull\'integrazione dei metodi',
        CIR: '{{count}} accesi dalle tue risposte',
        FU: '{{count}} sull\'unità funzionale',
        B: '{{count}} sui confini',
      },
      title: 'Cosa fare adesso',
      lead: 'Punti sollevati dal motore sulle tue risposte. Ognuno dice perché riguarda il tuo caso e, dove il motore lo risolve, come.',
      provenance:
        "I nomi e gli enunciati delle regole sono tradotti dalla tabella inglese del motore. Il codice accanto a ogni voce — IR-01, CDP-02 — è il riferimento che non cambia da una lingua all'altra, e accanto resta il nome inglese.",
      noTensions:
        "Per queste risposte non è emerso nessun punto di decisione critico fra i metodi. Gli obblighi qui sotto valgono comunque.",
      allClear:
        'Nessun obbligo metodologico si applica a queste risposte e nessun punto di decisione critico è emerso. Prossimo passo: raccogliere i dati di inventario.',
      ctaHint: 'Il Data Collection File è calibrato su questa configurazione: ti chiede solo quello che serve al tuo caso.',
    },
    actionKind: {
      block: 'Bloccante',
      obligation: 'Da documentare',
      decision: 'Da decidere',
      decisionResolved: "Risolto dal motore: da verificare",
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
      ilcdSituation: 'Situazione ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activatedNodes: 'Nodi attivati',
      l1Blocks: 'BLOCK L1 attivati',
      obligations: 'Obblighi da documentare',
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
    empty: 'Nessun confronto fra scenari ancora. Nel questionario definisci uno o più scenari alternativi, poi clicca "Esegui scenari" nella pagina risultato.',
    description: 'Pipeline eseguita per la baseline + {{n}} scenari alternativi. Differenze evidenziate vs baseline.',
    backToResult: 'Torna al risultato singolo',
    columns: {
      scenario: 'Scenario',
      ilcd: 'ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activated: 'Attivati',
      blocks: 'BLOCK L1',
      obligations: 'Obblighi da documentare',
      cdps: 'CDP L3',
    },
    baselineLabel: 'Baseline',
    diffSuffix: '(diff)',
    overrideHelp: 'Ogni scenario eredita le risposte della baseline; popola overrides (dict JSON) per scenario per differenziare. Overrides vuoti → stesso caso della baseline.',
    overridesPlaceholder: 'es. {"q1": "C"} oppure {"q3": {"env": true, "eco": true}}',
    overridesParseError: 'Overrides devono essere JSON valido per {{id}}',
  },


  reasoning: {
    activatedNodes: 'Nodi attivati ({{count}})',
    pillarConfigs: 'Configurazioni per pillar',
    noPillarValues: 'Nessun valore di pillar scritto.',
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
      run: 'Calcola la configurazione',
      runContext: 'Questionario',
      toggleReasoning: 'Mostra/nascondi pannello reasoning',
      toggleReasoningContext: 'Risultato',
      print: 'Stampa pagina risultato',
      printContext: 'Risultato',
      esc: 'Chiudi questa finestra',
    },
  },

  preset: {
    title: "Carica un esempio pubblicato",
    help: "Carica nel questionario le risposte di un caso pubblicato, così vedi che cosa ricava lo strumento da uno studio vero.",
    loadButton: 'Carica preset',
    rationaleToggle: 'Perché queste risposte? (rationale di compilazione)',
    replaceConfirm: "Caricare questo esempio sostituisce le risposte su cui stai lavorando. Se vuoi tenerle, salva prima il caso. Caricare l'esempio?",
    loaded: "Esempio caricato: {{name}}",
  },

  toast: {
    pipelineCompleted: "Configurazione pronta",
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
    title: "Ancora nessun risultato",
    body:
      "Questo strumento non calcola i numeri ambientali, economici o sociali. Li calcola chi esegue lo studio; se vengono aggiunti a questo caso, compaiono qui.",
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
          "Cosa ti dice questa pagina oggi: come è impostata la valutazione, quali segnali di conformità il caso dichiara, e quanto sono concentrate le interazioni chiave.",
        whenScoring:
          "Quando arriveranno i punteggi vedrai i valori ambientali e, dove lo studio li include, i costi societali — i due su cui si regge una decisione pubblica.",
        scope: "Quanto sono concentrate le interazioni chiave: {{scope}}",
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
    noVerdict: "Nessun caso aperto. Compila il questionario o carica un caso salvato per vedere questa vista.",
    notAssessed: {
      environmental: 'Questo studio non valuta gli impatti ambientali: la dimensione ambientale è stata esclusa quando il caso è stato impostato.',
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
        'Vista regolatoria e di policy: configurazione metodologica, peer-review, claim pubblici, allineamento EU PEF.',
      'end-user':
        'Vista riassuntiva per gli end user dei prodotti e servizi derivati dalla simbiosi.',
    },
    verdictTitle: 'Configurazione metodologica',
    configTitle: 'Che cosa guarda questo studio',
    labels: {
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
    obligations_one: "{{count}} obbligo da documentare",
    obligations_other: "{{count}} obblighi da documentare",
    cdpFlagsCount_one: '{{count}} tensione cross-dimensionale',
    cdpFlagsCount_other: '{{count}} tensioni cross-dimensionali',
    complianceTitle: 'Segnali di compliance',
    compliance: {
      peerReview: 'Revisione indipendente fra pari: {{status}}',
      pef: 'Allineamento EU PEF (Q4=D): {{status}}',
      pefC2: "Allineamento EU PEF (Q4=D): non applicato, il rendiconto di un'azienda usa l'allocazione e non la Circular Footprint Formula (Situazione ILCD C2)",
      publicClaim: 'Claim pubblico di superiorità (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Dashboard regionale',
    title: 'Dashboard regionale / settoriale',
    subtitle:
      'Breakdown di tutti i casi salvati per situazione ILCD, struttura LCC, settore e concentrazione delle interazioni chiave. Per autorità locali e analisti di policy.',
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
      byLccType: 'Per struttura LCC',
      bySector: 'Per settore (Q6a)',
      byScope: 'Per concentrazione delle interazioni (Q7)',
      byIlcd: 'Per situazione ILCD',
    },
  },

  obligations: {
    empty: "Niente da documentare per questo caso.",
    lead:
      "{{total}} voci da documentare per questo caso: i {{rules}} obblighi attivati dalle tue risposte (quelli contati nella pagina risultato) e {{mandates}} pratiche che il metodo chiede a ogni studio come questo. Ognuna è un impegno da documentare nel report LCSA.",
    because: "Si applica perché:",
    notApplicable: "Qui non si applica: {{fields}} — quel metodo è spento in Q3.",
    origin: {
      mandate: "Mandato",
      rule: "Regola cross-method",
    },
  },
  dcf: {
    viewer: {
      notActive: "Questa sezione non è attiva per questo caso.",
      nodeId: "Codice",
      method: "Metodo",
      statement: "Enunciato (testo dei deliverable, in inglese)",
      seeAbove: "Vedi il diagramma qui sopra.",
      fieldsCount_one: "({{count}} campo)",
      fieldsCount_other: "({{count}} campi)",
      colField: "Dato",
      colRequired: "Obbligatorio",
      colValues: "Valori possibili",
      colWhy: "Perché lo chiediamo",
      always: "sempre",
    },
    diagram: { whoGives: "Chi lo cede?\n({{flow}})", whoReceives: "Chi lo riceve?\n({{flow}})" },
    noCase: { title: 'Nessun caso', desc: 'Il Data Collection File si costruisce dalla tua valutazione: compila prima il questionario (o apri un caso salvato) e poi torna qui.', cta: 'Apri il questionario' },
    derivedField: "compilato dal motore",
    obligationsTitle: "Scelte metodologiche da documentare",
    navLink: 'Raccolta dati',
    title: 'Data Collection File',
    subtitle:
      'Calibrato sulla configurazione derivata. Scarica il foglio Excel per raccogliere i dati di inventario con i partner della simbiosi, poi torna qui per il report finale.',
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
      step3: 'Seleziona un nodo o una freccia e compila i campi nel pannello laterale. Vedi solo i campi che servono alla tua configurazione.',
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
    signInToSave: "Per salvare un caso sul server serve un account. Accedi o registrati qui; la bozza resta in questo browser.",
    signInToList: "I tuoi casi salvati compaiono qui dopo l'accesso. I report condivisi si aprono dal link che hai ricevuto.",
    publicLink: "Link pubblico",
    navLink: 'I miei casi',
    title: 'I miei casi',
    intro: 'Casi salvati sul server. Carica per popolare il questionario, o elimina per rimuovere definitivamente.',
    empty: 'Nessun caso salvato. Salva un caso dal questionario o dalla result page.',
    columns: {
      name: 'Nome',
      situation: 'Situazione ILCD',
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
