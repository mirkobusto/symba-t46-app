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
  },

  layout: {
    brand: 'SYMBA T4.6',
    about: 'Info',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Premi {{key}} per le scorciatoie',
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
    title: 'SYMBA T4.6 — Strumento di valutazione IS',
    tagline: 'Selezione metodologica per Simbiosi Industriale (LCA / LCC / S-LCA).',
    description:
      'Rispondi a sette domande sul tuo caso di simbiosi industriale. Il motore decisionale deriva il pathway IS terminale (IS-01..IS-05) e una configurazione metodologica completa dai 186 nodi Phase 1 dei deliverable D4.1, D4.2 e D4.3, più le 40 regole cross-method.',
    startButton: 'Avvia nuova valutazione',
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
      warning: 'Seleziona almeno una dimensione per procedere.',
      env: 'Ambientale (LCA)',
      eco: 'Economica (LCC / MFCA / CBA / TEA)',
      soc: 'Sociale (S-LCA)',
    },

    q4: {
      title: 'Q4 — A cosa serve il report?',
      help: 'Selezione multipla. Alcuni usi si combinano (es. D + E per un paper EU PEF).',
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
    },

    q6a: {
      title: 'Q6a — Settore',
      help:
        'Attualmente 5 valori segnaposto; i 14 settori completi arriveranno con il wiring di sector_overlays.json.',
      options: {
        none: '(nessuno)',
        wastewater_biofactories: 'Acque reflue / fanghi / biofactories',
        agri_food: 'Agroalimentare / bioraffinerie',
        process_industry: 'Industria di processo (chimica, cemento, acciaio, ecc.)',
        other: 'Altro (specificare)',
      },
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
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
    },
    confirmStartFresh: 'Scartare il caso corrente e ricominciare? Operazione non reversibile.',
    noResult: { title: 'Nessun risultato', desc: 'Invia un questionario per vedere l\'output del motore qui.', cta: 'Apri questionario' },
    error: { title: 'Errore della pipeline', back: 'Torna al questionario' },
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
  },

  toast: {
    pipelineCompleted: 'Pipeline completata in {{ms}} ms — pathway {{pathway}}',
    pipelineError: 'Errore pipeline — {{detail}}',
  },

  language: {
    label: 'Lingua',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },
}

export default it
