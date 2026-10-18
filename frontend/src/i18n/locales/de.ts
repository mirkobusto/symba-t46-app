// Deutsch. Methodische Begriffe LCA/LCC/S-LCA + Akronyme ILCD/PEF/CSRD/MFCA
// /CBA/TEA unverändert (normativ).

import type { Locale } from './en'

const de: Locale = {
  common: {
    run: 'Ausführen',
    reset: 'Zurücksetzen',
    close: 'Schließen',
    add: 'Hinzufügen',
    remove: 'Entfernen',
    cancel: 'Abbrechen',
    notSet: '(nicht gesetzt)',
    optional: 'optional',
    skip: '(überspringen)',
    required: 'Erforderlich',
    examplesAndContext: 'Beispiele und Kontext',
    methodologicalNote: 'Vollständige methodische Anmerkung',
    yes: 'ja',
    no: 'nein',
  },

  // Funding acknowledgement, worded as on the SYMBA website footer.
  eu: {
    emblemAlt: 'Finanziert von der Europäischen Union',
    fundingStatement: 'Finanziert von der Europäischen Union im Rahmen der Finanzhilfevereinbarung Nr. 101135562.',
    disclaimer:
      'Die geäußerten Ansichten und Meinungen sind jedoch ausschließlich die der Autor(inn)en und spiegeln nicht unbedingt die der Europäischen Union wider. Weder die Europäische Union noch die Europäische Exekutivagentur für die Forschung können dafür verantwortlich gemacht werden.',
  },

  footer: {
    logoAlt: 'Symba Project',
    logoTitle: 'Zur Website des SYMBA-Projekts',
    toolLine: 'Monitoring & Reporting System · Aufgabe T4.6',
    followUs: 'Folgen Sie uns',
    projectInfo: 'Projektinformationen',
    projectWebsite: 'Projekt-Website',
    publicDeliverables: 'Öffentliche Deliverables',
    copyright: 'Copyright © {{year}} Symba Project, alle Rechte vorbehalten.',
    privacy: 'Datenschutzerklärung',
    cookies: 'Browser-Speicher',
  },

  siteHeader: {
    logoAlt: 'Symba Project',
    logoTitle: 'Zur Website des SYMBA-Projekts',
    navLabel: 'Website des SYMBA-Projekts',
    menuOpen: 'Menü öffnen',
    menuClose: 'Menü schließen',
    backToSite: 'Projekt-Website',
    tool: 'Monitoring-Tool',
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
    brandTag: 'Monitoring- und Reporting-System für industrielle Symbiose',
    about: 'Über',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Drücken Sie {{key}} für Tastenkürzel',
  },

  share: {
    buttonLabel: 'Bericht teilen', title: 'Diesen Bericht teilen',
    lead: 'Senden Sie eine dieser URLs an einen Stakeholder. Gleicher Fall, unterschiedliche Rahmung pro Zielgruppe.',
    close: 'Schließen', done: 'Fertig', copy: 'Kopieren', copied: 'Kopiert ✓',
    copyFailed: 'Kopieren nicht möglich — bitte manuell kopieren.',
    saveFirstTitle: 'Fall zuerst speichern',
    saveFirstBody: 'Die URLs benötigen eine gespeicherte Fall-ID.',
    audience: { industry: '🏭 Industrie', community: '🌳 Gemeinschaft', authority: '🏛 Lokale Behörde', enduser: '👤 Endnutzer' },
  },

  reader: {
    tagline: 'Öffentlicher Bericht',
    loading: 'Lade Bericht…',
    notFoundTitle: 'Bericht nicht gefunden',
    notFoundBody: 'Der Link ist möglicherweise fehlerhaft.',
    aboutLink: 'SYMBA kennenlernen',
    eyebrow: 'Geteilter Bericht · {{name}}',
    summaryTitle: 'Konfigurationsübersicht',
    summary: { ilcd: 'ILCD-Situation', lcc: 'LCC-Typ', slca: 'S-LCA-Status', sector: 'Sektor', scope: 'Geografischer Umfang' },
    scoringTitle: 'Scoring',
    complianceTitle: 'Compliance-Signale',
    compliance: {
      peer: { name: 'Peer-Review-Anspruch', desc: 'Q4 = E · ISO 14044' },
      pef: { name: 'EU-PEF-Ausrichtung', desc: 'Q4 = D · Circular Footprint Formula' },
      public: { name: 'Öffentlicher Anspruch', desc: 'Q4 = C · ISO-Panel-Review' },
      dnsh: { name: 'DNSH-Prüfung', desc: 'EU Taxonomy art. 17' },
    },
    audience: {
      showingFor: 'Ansicht für — {{name}}',
      industry: { short: '🏭 Industrie', name: 'Industrie', title: 'Betreiberansicht', body: 'Vollständige technische Übersicht.' },
      community: { short: '🌳 Gemeinschaft', name: 'Gemeinschaft', title: 'Lokale Auswirkungen', body: 'Umweltqualität und soziale Vorteile.' },
      authority: { short: '🏛 Behörde', name: 'Lokale Behörde', title: 'Regulatorische Ansicht', body: 'Compliance, Peer-Review, PEF, DNSH.' },
      enduser: { short: '👤 Endnutzer', name: 'Endnutzer', title: 'Zusammenfassung', body: 'Einfache Erkenntnisse.' },
    },
    note: 'Dieser Bericht wird von der SYMBA T4.6-Engine generiert.',
    about: {
      eyebrow: 'Über SYMBA T4.6', title: 'Öffentliche Berichte', lead: 'Jemand hat einen Fall mit Ihnen geteilt.',
      whoTitle: 'Wer steckt dahinter?', whoBody: 'SYMBA ist ein Horizon-Europe-Projekt (GA 101135562).',
      whatTitle: 'Was ist ein Bericht?', whatBody: 'Ein Bericht beschreibt einen Fall industrieller Symbiose.',
      whereTitle: 'Mehr erfahren?', whereBody: 'Besuchen Sie die Projekt-Website',
      enterTool: 'Zum Tool',
    },
    region: {
      eyebrow: 'Region · {{code}}', title: 'Regionales Dashboard', lead: 'Aggregierte Ansicht.', total: 'Fälle', situations: 'ILCD-Situationen', sectors: 'Sektoren',
      bySituationTitle: 'Nach ILCD-Situation', bySectorTitle: 'Nach Sektor', tableKey: 'Wert', tableCount: 'Anzahl',
      errorTitle: 'Region nicht verfügbar', errorBody: 'Daten konnten nicht geladen werden.',
    },
  },

  welcome: {
    title: 'Willkommen bei SYMBA T4.6',
    lead: "Dieses Werkzeug ermittelt, welche Methodik Ihr Fall industrieller Symbiose verlangt und welche Daten Sie erheben müssen. Es berechnet keine ökologischen, ökonomischen oder sozialen Ergebnisse. Zwei kurze Fragen, dann bringen wir Sie an die richtige Stelle — beides lässt sich später im Menü des Werkzeugs ändern.",
    step1: { title: 'Wer sind Sie?' },
    step2: { title: 'Was möchten Sie tun?' },
    back: 'Zurück',
    next: 'Weiter',
    finish: 'Los geht\'s',
    skip: 'Vorerst überspringen',
    roles: {
      analyst: { name: 'Nachhaltigkeitsanalyst', desc: 'IS-Praktiker, LCA/LCC/S-LCA-Prüfer, Methodologe.' },
      industry: { name: 'Industrieller Betreiber', desc: 'Sie leiten eine Anlage oder einen Standort in einem IS-Netzwerk.' },
      authority: { name: 'Lokale Behörde', desc: 'Gemeinde, Region, politischer Analyst für das Gebiet.' },
      community: { name: 'Gemeinschaftsvertreter', desc: 'Verein, NGO, Bürgergruppe des Gastgebiets.' },
      enduser: { name: 'Endnutzer / Bürger', desc: 'Sie nutzen Produkte oder Dienste aus der Symbiose.' },
      unknown: { name: 'Noch nicht sicher', desc: 'Kein Problem — wir bringen Sie auf die Übersichtsseite.' },
    },
    tasks: {
      assess: { name: 'Neue Bewertung starten', desc: 'Methodik für einen IS-Fall in zehn Fragen konfigurieren.' },
      read: { name: 'Geteilten Bericht lesen', desc: 'Einen mit mir geteilten Fall öffnen und den Bericht sehen.' },
      explore: { name: 'Region / Sektor erkunden', desc: 'Aggregierte Einblicke für mein Gebiet durchsuchen.' },
      browse: { name: 'Nur umschauen', desc: 'Kein bestimmtes Ziel — ich möchte sehen, was das Tool tut.' },
    },
  },

  adminShell: {
    searchLabel: 'Suchen',
    searchPlaceholder: 'Fälle, Partner suchen… (⌘K)',
    footerGa: 'GA',
    footerProgramme: 'Horizon Europe · M22–M36',
    groups: {
      workspace: 'Arbeitsbereich',
      reports: 'Berichte',
      system: 'System',
    },
    nav: {
      home: 'Startseite',
      questionnaire: 'Neue Bewertung',
      cases: 'Meine Fälle',
      recentResult: 'Letztes Ergebnis',
      stakeholder: 'Stakeholder-Berichte',
      aggregate: 'Regionales Dashboard',
      dcf: 'Data Collection File',
      about: 'Über',
      changeRole: 'Rolle ändern',
    },
  },

  health: {
    backendLabel: 'Backend',
    checking: 'wird geprüft',
    ok: 'OK',
    unreachable: 'nicht erreichbar',
    bannerPart1: 'Das Backend unter',
    bannerPart2:
      'ist nicht erreichbar. Der Fragebogen funktioniert, aber Pipeline-Läufe schlagen fehl, bis das Backend wieder online ist.',
  },

  savedStatus: {
    empty: 'Noch kein Entwurf',
    justNow: 'Entwurf gespeichert · gerade eben',
    secondsAgo: 'Entwurf gespeichert · vor {{n}}s',
    minutesAgo: 'Entwurf gespeichert · vor {{n}}m',
    hoursAgo: 'Entwurf gespeichert · vor {{n}}h',
  },

  home: {
    title: 'SYMBA T4.6 — IS-Bewertungstool',
    tagline: 'Methodische Auswahl für Industrielle Symbiose (LCA / LCC / S-LCA).',
    description:
      'Beantworten Sie zehn kurze Fragen zu Ihrer industriellen Symbiose-Fallstudie. Die Entscheidungs-Engine leitet die methodische Konfiguration (ILCD-Situation, LCC-Struktur, Studienhorizont, Referenzszenario) aus den 186 Phase-1-Knoten der Deliverables D4.1, D4.2 und D4.3 sowie den 40 Cross-Method-Validierungsregeln ab.',
    startButton: 'Neue Bewertung starten',
    modeLabel: 'UX-Modus',
    modeExpert: 'Experte',
    modeGuided: 'Geführt',
    modeHint: {
      expert: 'Schneller Fragebogen für IS-Analysten und Prüfer, die mit der ILCD / LCSA-Terminologie vertraut sind.',
      guided: 'Schritt-für-Schritt-Modus für Industrielle, Gemeindevertreter und politische Entscheidungsträger. Jede Frage hat eine Erklärung in einfachen Worten; die vollständige methodische Anmerkung bleibt einen Klick entfernt.',
    },
    hero: { title: 'Neue IS-Bewertung starten' },
    openCasesLink: 'Oder gespeicherten Fall öffnen',
    kpi: {
      savedCases: 'Gespeicherte Fälle',
      savedCasesDetail: 'alle Nutzer',
      configured: 'Konfiguriert',
      configuredDetail: '{{total}} insgesamt',
      situations: 'ILCD-Situationen',
      situationsDetail: 'A · B · C1 · C2',
      language: 'Verfügbar in',
      languageDetail: '5 Sprachen',
    },
    presetsTitle: 'Validierte Fallstudien',
    presetsMeta: '13 Fixtures aus peer-reviewten Artikeln',
  },

  // DRAFT: English until the notice has been through legal review and is translated.
  privacy: {
    "title": "Privacy and data storage",
    "draft": "DRAFT for legal review — not yet the privacy notice of record. Items in [square brackets] are for the controller of this deployment to complete.",
    "updated": "Version: draft 1, 2026-10-04.",
    "sections": [
      {
        "id": "controller",
        "title": "1. Who is responsible",
        "paragraphs": [
          "[PLACEHOLDER — the SYMBA partner that operates this subdomain: name, address, contact. To be completed by the owner.]",
          "The project website https://www.symbaproject.eu/ has its own privacy policy, which covers the website. This page covers this tool."
        ],
        "items": []
      },
      {
        "id": "what",
        "title": "2. What this tool does",
        "paragraphs": [
          "It helps practitioners configure the methodology of a life-cycle study of an industrial symbiosis (Horizon Europe project SYMBA, Grant Agreement 101135562, task T4.6) and prepare the data collection file and reports. It does not compute environmental, cost or social results."
        ],
        "items": []
      },
      {
        "id": "data",
        "title": "3. What we keep",
        "paragraphs": [],
        "items": [
          "Your account: email address, a bcrypt hash of your password (never the password itself), your role and the creation date. The email also sits inside the sign-in token (valid 12 hours) that your browser keeps. Registration is open to anyone unless the operator has closed it; only the operator's address becomes administrator.",
          "The cases you save: name, questionnaire answers, flows, optional sites (coordinates, country), the content of the data collection file (actor names, contact roles, costs), scoring data, the owner, and a public link name if you share a report.",
          "Technical logs: the server's access log records the visitor's IP address, the time, the path and the status of each request; it goes to the container log of the host, rotated at 5 files of 10 MB. [PLACEHOLDER — logs of the reverse proxy or TLS terminator in front of the tool.]",
          "In your browser (local storage, not cookies): symba-auth (sign-in), symba-case-draft and symba-dcf-draft (unsaved work), symba-preferences and symba-language. The tool sets no cookies and loads its fonts from its own server, with no request to third parties."
        ]
      },
      {
        "id": "purposes",
        "title": "4. Why, and on what legal basis",
        "paragraphs": [
          "[PLACEHOLDER — purposes and legal basis, to be completed by the controller: operating the tool and its accounts for the SYMBA project (GA 101135562), security of the service.]"
        ],
        "items": []
      },
      {
        "id": "recipients",
        "title": "5. Who can see it",
        "paragraphs": [
          "Hosting provider: [PLACEHOLDER]. Links of the form /r/… are unlisted, not private: anyone who has the link can read that report. Cases saved without signing in can currently be read and changed by anyone who can reach the tool, and the administrator (the first account registered) can read and change every case, including those owned by others: do not enter personal data of third parties."
        ],
        "items": []
      },
      {
        "id": "storage",
        "title": "6. How long, and how to delete",
        "paragraphs": [
          "Nothing is deleted automatically. You can delete your cases and the data collection content of a case from the tool. Deleting your account is not self-service yet: write to [PLACEHOLDER — contact]. Backups: [PLACEHOLDER — frequency and retention]."
        ],
        "items": []
      },
      {
        "id": "rights",
        "title": "7. Your rights",
        "paragraphs": [
          "Under the GDPR (articles 15 to 22) you can ask for access, rectification, erasure, restriction, portability and object to processing: [PLACEHOLDER — contact]. You can complain to the supervisory authority: [PLACEHOLDER — authority]."
        ],
        "items": []
      }
    ]
  },
  about: {
    title: 'Über',
    p1:
      "SYMBA T4.6 unterstützt alle, die eine Lebenszyklus-Nachhaltigkeitsbewertung einer industriellen Symbiose aufsetzen: aus zehn Fragen zum Fall leitet es ab, welche Methodik gilt, welche Praktiken zu dokumentieren sind und welche Daten bei den Netzwerkpartnern zu erheben sind. Es berechnet die Ergebnisse nicht — die quantitativen Kennzahlen entstehen außerhalb des Werkzeugs und erscheinen hier, sobald sie vorliegen.",
    p2:
      'Die 7 Kernfragen (Q1-Q7) und drei optionale (Q8-Q10) steuern die Aktivierung der 186 Phase-1-Knoten plus 40 Cross-Method-Validierungsregeln (18 IR + 10 CIR + 5 FU + 7 B). Die L3-Durchsetzung zur Reporting-Zeit (IR-04 + IR-10) plus 12 Critical Decision Points machen Cross-Method-Spannungen sichtbar.',
    p3:
      'Pillar-Konfigurationsanzeige, erweiterte Overrides und das „Show reasoning"-Panel sind alle aktiv.',
  },

  error: {
    title: 'Etwas ist schiefgelaufen',
    backHome: 'Zurück zur Startseite',
    fallback: 'Unerwarteter Fehler',
  },

  questionnaire: {
    scopeNote: "Dieses Werkzeug berechnet keine Ökobilanz-/LCC-/S-LCA-Zahlen. Es leitet die methodische Konfiguration Ihres Falls und die zu erhebenden Daten ab; das quantitative Scoring entsteht extern und erscheint hier, sobald es vorliegt.",
    title: 'Fragebogen',
    guidedBannerTitle: 'Geführter Modus aktiv',
    guidedBannerBody:
      "Jede Frage beginnt mit einer kurzen Erklärung in einfachen Worten. Die vollständige methodische Anmerkung, im Wortlaut der Projekt-Deliverables, bleibt unter jeder Frage einen Klick entfernt. Die zehn Antworten bestimmen die methodische Konfiguration und den Datenerhebungsplan, den Sie am Ende erhalten.",
    intro:
      'Zehn Fragen zu Ihrer industriellen Symbiose-Fallstudie. Q1 und mindestens eine Q3-Dimension sind erforderlich; der Rest ist optional, verbessert aber die Engine-Ausgabe.',
    runButton: 'Konfiguration ermitteln',
    runningButton: 'Wird berechnet…',
    resetButton: 'Entwurf zurücksetzen',
    confirmReset: 'Alle Antworten verwerfen und neu beginnen? Dies kann nicht rückgängig gemacht werden.',
    q1Required: 'Q1 ist erforderlich.',
    shortcutTip: 'Tipp: Strg/⌘+Eingabe zum Ausführen',

    q1: {
      title: 'Q1 — Was analysieren Sie? *',
      help:
        "Wählen Sie die nächstliegende Antwort: Es zählt der Gegenstand der Studie, nicht wer sie beauftragt hat. (Erforderlich.)",
      details:
        'A — bilateraler Austausch (z. B. Abwärme von Werk X zu Werk Y, oder Gips als Nebenprodukt von Kraftwerk zu Zementwerk). Subjekt ist der GETEILTE FLUSS zwischen zwei Unternehmen. ' +
        'B — Öko-Industriepark oder symbiotisches Netzwerk mit 3+ Akteuren (z. B. Kalundborg, NISP-Cluster, Industriepark-Masterplan). Subjekt ist das NETZWERK als System. ' +
        'C — politische oder programmatische Entscheidung auf regionaler/nationaler Ebene (z. B. ein IS-Förderprogramm, ein Regulierungsrahmen, eine EU-Industriestrategie). Subjekt ist die ENTSCHEIDUNG/PROGRAMM, nicht eine spezifische Anlage. ' +
        'D — einzelnes Unternehmen quantifiziert seinen symbiotischen Beitrag für ESG / CSRD / Nachhaltigkeitsberichte (z. B. „Wir haben 12 kt Schlacke an Zementhersteller verkauft, hier ist unsere Gutschrift"). Subjekt ist EIN UNTERNEHMEN. ' +
        'E — periodisches Monitoring einer bereits operativen Symbiose (jährliche KPI-Updates, Post-Implementation-Überwachung). Subjekt ist die ZEITREIHE, nicht eine einmalige Studie.',
      options: {
        A: { label: 'A. Spezifischer Austausch', description: 'Ein symbiotischer Austausch zwischen zwei bestehenden Unternehmen.' },
        B: { label: 'B. Eco-park / Netzwerk', description: 'Ein Öko-Industriepark oder ein symbiotisches Multi-Akteurs-Netzwerk.' },
        C: { label: 'C. Politik / Programm', description: 'Eine Politik- oder Programmentscheidung auf regionaler oder nationaler Ebene.' },
        D: { label: 'D. Unternehmensbericht', description: 'Der symbiotische Beitrag eines einzelnen Unternehmens für ESG/CSRD-Reporting.' },
        E: { label: 'E. Monitoring', description: 'Zeitliches Monitoring einer bereits operativen Symbiose.' },
      },
      plain:
        "Das ist die Frage, die alle anderen steuert: Aus ihr erkennt das Werkzeug, welches System Sie untersuchen, und damit, welche Daten es später von Ihnen verlangt. Schwanken Sie zwischen zwei Optionen, nehmen Sie die, die das beschreibt, dessen Wirkungen Sie messen wollen.",
    },

    q2: {
      title: 'Q2 — Finden die Austausche, die die Studie misst, bereits statt?',
      details:
        'Antworten Sie zu den symbiotischen Austauschen, nicht zu den Anlagen: Eine Anlage kann existieren, während der untersuchte Austausch noch ein Plan ist. A — ja: Die Austausche finden heute statt und ihre Flüsse lassen sich messen (z. B. Kalundborg; das Gerbereicluster von Daddi 2017). Die Referenz ist, was jedes Unternehmen heute täte, wenn die Verbindungen getrennt würden (HNSRS, D4.1 §11.1). Läuft das Netzwerk seit vielen Jahren, ist diese Referenz ein modernes Kontrafaktum, nicht die Konfiguration der Unternehmen vor Jahrzehnten (D4.1 §11.2.2): Danach fragt die Folgefrage. B — noch nicht: Die Austausche sind geplant, entworfen, hypothetisch oder beginnen gerade erst, auch zwischen bereits laufenden Anlagen. Die Referenz ist die heutige Situation ohne sie, einschließlich bereits laufender Austausche (CNSRS, D4.1 §11.1). Alternativen zu vergleichen (eine Erweiterung, eine neue Technologie) steht jeder Studie offen: Fügen Sie sie unten als Szenarien hinzu (D4.1 §4.3.3). Wann das System betrieben wird, fragt Q8.',
      options: {
        A: { label: 'A. Ja, sie finden bereits statt', description: 'Die Austausche laufen heute: Ihre Flüsse lassen sich messen.' },
        B: { label: 'B. Noch nicht', description: 'Geplant, entworfen oder gerade erst beginnend, auch zwischen bereits bestehenden Anlagen.' },
      },
      longStanding: {
        label: 'Läuft das Netzwerk seit vielen Jahren, sodass die Anlagen, die es ersetzt hat, heute nicht mehr gebaut würden?',
        yes: 'Ja — die Referenz ist ein modernes Kontrafaktum (D4.1 §11.2.2)',
        no: 'Nein — das Netzwerk ist jung',
      },
      plain:
        'Denken Sie an die Austausche, nicht an die Anlagen. Finden die Flüsse zwischen den Unternehmen bereits statt, können Sie sie messen. Sind sie noch eine Idee, auch zwischen bereits laufenden Anlagen, können Sie sie nur schätzen. Sie möchten Alternativen vergleichen, etwa eine Erweiterung oder eine neue Technologie? Fügen Sie sie unten als Szenarien hinzu, unabhängig von Ihrer Antwort hier.',
    },

    q3: {
      title: 'Q3 — Welche Nachhaltigkeitsdimensionen einbeziehen? *',
      help: 'Mindestens eine ist erforderlich. Umwelt und Ökonomie sind die übliche Paarung.',
      details:
        'ENV — Umwelt-Lebenszyklusanalyse (LCA): Auswirkungen auf Klima, Ökosysteme, Ressourcennutzung. Fast immer ausgewählt. ' +
        'ECO — ökonomische Dimension, bewertet mit Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) ist eine Technik innerhalb der LCC (aktiviert durch ECO und durch umstrittene Stoffströme in Q5), keine Alternative dazu; CBA und TEA bietet diese Engine nicht an. ' +
        'SOC — S-LCA. Aktivierung löst eine längere Regelkette aus (Stakeholder-Kategorien Worker / lokale Gemeinschaft / Wertschöpfungskette) und erzwingt L1 BLOCK 2, wenn der erweiterte Override slca_framework_override auf „absolute" gesetzt ist. ' +
        'Die meisten veröffentlichten IS-Papers laufen nur mit ENV (z. B. Sokka, Daddi); einige koppeln ENV+ECO (Hashimoto, Wiktor); nur eine Handvoll fügt SOC hinzu.',
      warning: 'Mindestens eine Dimension auswählen, um fortzufahren.',
      env: 'Umwelt (LCA)',
      eco: 'Ökonomisch (LCC)',
      soc: 'Sozial (S-LCA)',
      plain:
        "Drei getrennte Bewertungen, jede mit eigener Methode und eigenen Daten: ökologisch, wirtschaftlich — Kosten über den ganzen Lebensweg, keine Kosten-Nutzen-Analyse — und sozial. Wählen Sie die, die Sie abliefern wollen. Die meisten veröffentlichten Studien machen nur die ökologische, und die ökonomische dazuzunehmen ist der übliche nächste Schritt; die soziale verlangt viel mehr Auskunft von den beteiligten Menschen, rechnen Sie also damit, sie einzuholen.",
    },

    q4: {
      title: 'Q4 — Wofür wird diese Studie verwendet?',
      help: 'Mehrfachauswahl. Einige Verwendungen kombinieren sich (z. B. D + E für ein EU-PEF-Paper).',
      details:
        'A — interne Nutzung: Management-Dashboards, F&E-Screening, Werks-Entscheidungen. Wenige methodische Einschränkungen. ' +
        'B — externe Kommunikation OHNE vergleichende Aussagen (Nachhaltigkeitsberichte, Marketing-Broschüren ohne „besser als X"-Aussage). ' +
        'C — öffentliche AUSSAGE, dass das System besser als eine Alternative mit derselben Funktion oder ihr gleichwertig ist (z. B. „dieser Zement ist grüner als OPC"), in jeder Form veröffentlicht: Bericht, Website oder wissenschaftlicher Artikel (comparative assertion, ISO 14040 §3.6; D4.1 §15.3.4). Aktiviert die obligatorische ISO-14044-Critical-Review durch 3+ unabhängige Experten und deaktiviert Gewichtung. Mit Vorsicht verwenden. ' +
        'D — Alignment mit EU-Politikinstrumenten (ESPR-Digital-Product-Passport, PEFCR-Kategorieregeln). Erzwingt die PEF Circular Footprint Formula via CIR-05. Die strikte Berichterstattung eines einzelnen Unternehmens (CSRD, ESG) wird in Q9 angegeben, nicht hier: sie nutzt Allokation, nicht die CFF. ' +
        'E — akademische peer-reviewte Publikation. Erfordert volle Transparenz (Datenquellen, Allokationsentscheidungen, Sensitivität). Oft mit B oder D kombiniert. Wenn der Artikel behauptet, ein System sei einer konkurrierenden Alternative überlegen oder gleichwertig, wählen Sie auch C; ein Vergleich ohne erklärten Sieger bleibt E (Lesart T4.6). ' +
        'Mehrfachauswahl möglich: Ein typisches PEF-Paper wählt D + E.',
      options: {
        A: { label: 'A. Intern', description: 'Interne Nutzung (Management, F&E, Planung).' },
        B: { label: 'B. Extern (kein Claim)', description: 'Externe Kommunikation ohne vergleichende Aussagen.' },
        C: {
          label: 'C. Öffentlicher Überlegenheits-Claim',
          description: 'Öffentliche Aussage der Überlegenheit oder Gleichwertigkeit gegenüber einer Alternative mit derselben Funktion, in jeder Form (auch Artikel).',
          warn: 'Aktiviert die OBLIGATORISCHE Panel-Review von 3+ unabhängigen Experten (ISO 14044), keine Gewichtung erlaubt.',
        },
        D: {
          label: 'D. EU-Politik-Alignment',
          description: 'EU-Politik-Alignment (ESPR, PEF/PEFCR).',
          warn: 'Aktiviert die PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Akademische Publikation', description: 'Akademische peer-reviewte Publikation (zusätzlich C, wenn sie ein System über eine konkurrierende Alternative stellt oder ihr gleichstellt).' },
      },
      plain:
        "Wer das Ergebnis liest und was damit geschieht, entscheidet, wie streng die Methode sein muss. Eine interne Notiz ist der leichteste Fall. Die Ausrichtung an EU-Instrumenten (Produktpass, PEF) schreibt die EU-eigene Zählweise für recyceltes und zurückgewonnenes Material fest. Öffentlich zu behaupten, Ihr Produkt sei besser als ein anderes, ist der schwerste Fall: das verlangt eine unabhängige Prüfung durch externe Fachleute. Das gilt, wo immer Sie es sagen, auch in einem wissenschaftlichen Artikel. Mehrfachauswahl ist möglich.",
    },

    q5: {
      title: 'Q5 — Art jedes symbiotischen Flusses (pro Fluss)',
      help:
        'Fügen Sie eine Zeile pro symbiotischem Hauptfluss hinzu und wählen Sie dessen Q5-Kategorie. Pflicht für Q1 ∈ {A, B, D}; sonst optional.',
      details:
        'Wählen Sie für jeden Hauptstrom zwischen Akteuren (Wärme, CO₂, Schlacke, Abwasser, Wasserstoff…), wer wen bezahlt: ' +
        'a — A zahlt B für die Abnahme des Flusses (eine Annahmegebühr: negativer Marktwert, ein ABFALL für A, D4.1 §8.3.2). Zero-Burden gilt ab dem Punkt, an dem der Reststoff erstmals einen nicht negativen Wert erreicht, nicht am Werkstor. Zahlen heißt nicht unvermeidbar: D4.2 §6.2 verlangt zusätzlich den kausalen Vermeidbarkeitstest, je Fluss im Data Collection File erklärt. ' +
        'b — der Fluss wird KOSTENLOS abgegeben (unklarer Status): Die Engine leitet in die Klärungskette für kostenlose Flüsse. ' +
        'c — B zahlt A für den Fluss (positiver Marktwert: ein KOPPELPRODUKT für A): Substitution des verdrängten Primärmaterials mit qualitätskorrigiertem Verhältnis. Die PEF-Circular-Footprint-Formel hängt nicht an Q5: Sie kommt aus Q4=D. Würde kein Dritter für den Fluss zahlen (Freedom-to-Act-Test, D4.1 §8.3.3), ist der Preis administrativ und der Fluss wird als Abfall modelliert. ' +
        'd — INTERDEPENDENTER Fluss: A hat seinen Prozess bewusst verändert (Qualität, Menge, Nachbehandlung), um B zu beliefern; ein Koppelprodukt unabhängig vom Preis, nie Zero-Burden. ' +
        'e — AGGREGIERT / Black-Box: Die Quelle liefert keine Details je Fluss (typisch für aggregierte Arbeiten wie Sokka 2011). Das ist eine Grenze der Quelle, keine Modellierungsentscheidung: D4.1 §8.3.1 verbietet eine einzige netzwerkweite Regel, daher fragt das Data Collection File die Klassifikation jedes benennbaren Flusses trotzdem ab. ' +
        'Q5 hält fest, wer wen bezahlt; die rechtlichen und wirtschaftlichen Tests (Freedom-to-Act, End-of-Waste, Nebenproduktklasse, Vermeidbarkeit, Zero-Burden-Punkt) werden je Fluss im Abschnitt Flow classification des Data Collection File erklärt. Bei Politikstudien mit Q1=C ist Q5 meist optional.',
      plain:
        "Für jede Sache, die zwischen den Unternehmen bewegt wird — Wärme, Wasser, Schlacke, CO₂ — lautet die Frage hier nur: wer zahlt wem? Der Absender zahlt, um sie loszuwerden, niemand zahlt, oder der Empfänger zahlt dafür. Hat der Absender seinen eigenen Prozess absichtlich geändert, um sie zu liefern, wählen Sie diese Option, was immer das Geld sagt. Gibt Ihre Quelle nur eine Zahl für das ganze Netz, wählen Sie die letzte Option: Sie werden dennoch nach jedem Fluss gefragt, den Sie benennen können, denn eine einzige Regel für das ganze Netz ist nicht zulässig. Ob ein Fluss rechtlich Abfall ist, wird später im Data Collection File entschieden, nicht hier.",
    },

    q6a: {
      title: 'Q6a — Sektor',
      help: 'Der Hauptsektor des Falls. Er schaltet einige sektorspezifische Anforderungen ein.',
      details:
        'Der Sektor steuert eine kleine Menge sektor-spezifischer Knotenaktivierungen und Overlay-Defaults. Wählen Sie die nächste Übereinstimmung zum dominanten Sektor des Falls (Akteur mit größtem Beitrag in Masse/Energie/Wert). ' +
        'Beispiele: pulp_paper für Sokka 2011 (UPM Kymi); chemicals_fertilizers für Hashimoto / Wiktor; cement_construction für Leiva 2025 Escombreras; biobased_polymers für Briassoulis; food_production / agri-food für Daddi. ' +
        'Für gemischte Fälle multi_sector verwenden. Die „(legacy)"-Einträge unten existieren für rückwärtskompatibles Laden alter Fixtures — bevorzugen Sie die neue 14-Sektor-Liste.',
      options: {
        none: '(keiner)',
        agriculture_agrifood_biorefineries: 'Landwirtschaft / Agri-Food / Bioraffinerien',
        biobased_polymers: 'Bio-basierte Polymere',
        plastics_packaging: 'Kunststoffe und Verpackung',
        pulp_paper: 'Zellstoff und Papier',
        chemicals_fertilizers: 'Chemie / Düngemittel',
        cement_construction: 'Zement / Bau',
        steel_metals: 'Stahl und Metalle',
        energy_utilities: 'Energie / Versorgung',
        wastewater_sludge_biofactories: 'Abwasser / Schlämme / Biofactories',
        textile_leather: 'Textil / Leder',
        waste_valorization: 'Abfallvalorisierung',
        food_production: 'Lebensmittelproduktion',
        multi_tenant_urban_building: 'Mehrmieter-Stadtgebäude',
        multi_sector: 'Multi-Sektor',
        other: 'Sonstige (angeben)',
        wastewater_biofactories: 'Abwasser / Schlämme / Biofactories (legacy)',
        agri_food: 'Agri-Food / Bioraffinerien (legacy)',
        process_industry: 'Prozessindustrie (legacy)',
      },
      plain:
        "Der Hauptsektor des Falls: die Tätigkeit des Unternehmens, das den größten Teil der Masse, der Energie oder des Werts beiträgt. Er schaltet einige sektorspezifische Anforderungen und Voreinstellungen ein. Liegt der Fall quer zu mehreren Sektoren, wählen Sie Multi-Sektor, und lassen Sie die mit (legacy) markierten Einträge beiseite.",
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL der dominanten oder kritischen Technologie im symbiotischen Netzwerk. Bestimmt die Wahl der Inventory-Datenqualität (gemessen vs Literatur vs Engineering-Schätzung) und das Unsicherheitsbudget downstream. ' +
        'Gemeint ist der TRL der Schlüsseltechnologie selbst, nicht ihrer Einführung: eine ausgereifte Technologie, die dieselbe Art von Input im selben Maßstab wie anderswo behandelt und in diesem Netzwerk oder dieser Region erstmals eingesetzt wird, bleibt TRL 9, und die Neuheit zeigt sich in der Datenqualität (Lesart T4.6); ein ausgereiftes Verfahren, angewandt auf einen nie im großen Maßstab behandelten Input, ist ein Austausch mit niedrigem TRL (D4.1 §9.3.5). ' +
        'TRL 9 = voller kommerzieller Betrieb (Kalundborg, Sokka). ' +
        'TRL 7-8 = First-of-a-Kind-Pilot / vorkommerzielle Einheit. ' +
        'TRL 5-6 = laborvalidierter Prototyp, Demo in relevantem Maßstab. ' +
        'TRL <5 = frühe F&E, nur Bench-Scale — große Unsicherheit, Szenarien empfohlen.',
      options: {
        TRL9: 'TRL 9 — vollständig operativ',
        'TRL7-8': 'TRL 7-8 — Pilot / vorkommerziell',
        'TRL5-6': 'TRL 5-6 — Prototyp',
        'TRL<5': 'TRL <5 — frühe F&E',
      },
      plain:
        "Wie ausgereift die Schlüsseltechnologie ist: im kommerziellen Betrieb, erste Pilotanlage, Prototyp, oder noch im Labor. Je weniger ausgereift, desto mehr sind Ihre Zahlen Schätzungen statt Messungen, und desto mehr muss das Ergebnis seine eigene Unsicherheit mittragen. Beurteilen Sie die Technologie selbst, nicht ob sie hier neu ist: ein erprobtes Verfahren, das in Ihrer Region erstmals eingesetzt wird, bleibt ausgereift, sofern es dieselbe Art von Material wie anderswo behandelt.",
    },

    q7: {
      title: 'Q7 — Geografische Verteilung',
      help: 'Qualitative Anordnung des Netzwerks. Der Transport wird unabhängig von der Antwort explizit modelliert; die Break-even-Distanz hängt vom Flusstyp ab und wird für jeden Fluss im Data Collection File (Logistik) abgefragt — Sie tragen dort den Wert aus Ihrer eigenen Sensitivitätsanalyse ein.',
      details:
        'Die Antwort ändert, wie Logistikdaten abgefragt werden (GIS-Kopplung, räumliche Sensitivität), nicht ob der Transport modelliert wird: D4.1 §12.3.1 verlangt, dass jede Transportverbindung ein eigener Einheitsprozess des Vordergrunds ist, mit Primärdaten zu Entfernung, Route und Verkehrsträger sowie einer Sensitivitätsanalyse der Entfernung zur Bestimmung des Break-even-Punkts. Hinter den vier Optionen steht keine Entfernungsschwelle: Der Break-even hängt vom Flusstyp und von der verdrängten Alternative ab (D4.1 §12.2.1 und D4.2 nennen Richtwerte zur Plausibilisierung eines Modells, nie als Eingaben); jede Studie berechnet ihren eigenen, Fluss für Fluss. ' +
        'A — am selben Standort: ein Standort oder benachbarte Anlagen (Ökoindustriepark). Die Verbindungen sind kurz (Rohrleitung, Förderband, innerbetrieblicher Transport), werden aber modelliert; bei Wärme, Dampf und Wasser in Rohrleitungen dominiert meist die dedizierte Infrastruktur. ' +
        'B — regionaler Cluster: mehrere Standorte in derselben Region (typisch Sokka 2011 / Hashimoto). ' +
        'C — großräumig: überregional oder grenzüberschreitend; Verkehrsträger und Routen werden zu wichtigen Inventar- und Kostenposten. ' +
        'D — mehrskalig: nationale oder branchenweite Programme (typisch Politikstudien mit Q1=C). Von B bis D wird CIR-03 (GIS-Kopplung) aktiviert; von C bis D zusätzlich lca_mc_29 und der GIS-Zweig von lcc_mc_14.',
      options: {
        A: { label: 'A. Co-located', description: 'Ein Standort oder benachbarte Anlagen (Ökoindustriepark).' },
        B: { label: 'B. Regional', description: 'Mehrere Standorte in derselben Region.' },
        C: { label: 'C. Weiträumig', description: 'Überregional oder grenzüberschreitend.' },
        D: { label: 'D. Multi-Skala', description: 'National / industrieweit, variable Distanzen.' },
      },
      plain:
        "Wie die Standorte liegen: ein einziger Standort, mehrere Standorte in einer Region, Standorte über Regionen oder Grenzen hinweg, oder ein landesweites oder branchenweites Programm. Der Transport wird in jedem Fall gerechnet; die Antwort ändert nur, wie viel Detail zu Routen und Verkehrsmitteln von Ihnen verlangt wird. Hinter den vier Optionen steht keine Entfernungsschwelle: jeder Fluss hat seine eigene Rentabilitätsentfernung, und der Data Collection File fragt sie bei Ihnen ab, Fluss für Fluss, aus Ihrer eigenen Sensitivitätsanalyse.",
    },
    q8: {
      title: 'Q8 — Zeithorizont der Studie',
      help: 'Optional. Ein Horizont für LCA und LCC gleichermaßen.',
      details: 'Die Deliverables verlangen einen Zeithorizont für LCA, LCC und S-LCA (D4.2 §11, D4.1 §14). Zukünftige Hintergrundszenarien (SSP/RCP) kommen in beiden hinzu, wenn das System in einem zukünftigen Jahr betrieben wird (D4.1 §9.3.5, §12.3.2), wenn die Schlüsseltechnologie unter TRL 7 liegt (Q6b) oder wenn der Analysezeitraum oder die Lebensdauer der Hauptanlagen 15 Jahre übersteigt (D4.2 §9.3, das den Wert ohne Quelle angibt; er lässt sich in den erweiterten Einstellungen ändern). Ohne Antwort gilt als Betriebsjahr das Jahr der Studie. Der Analysezeitraum ist die von der Studie abgedeckte Zeitspanne; in der Regel entspricht er der technischen Lebensdauer der Hauptanlagen (D4.2 §9). Die Lebensdauer der Hauptanlagen ist zugleich der Abschreibungszeitraum ihrer Investitionsgüter, gleich in LCA und LCC (D4.1 §6.3.3, §14.2.2); Anlagen mit anderer Lebensdauer gehören in die Datenerhebungsdatei.',
      start: {
        label: 'In welchem Jahr wird das System betrieben, oder in welchem Jahr soll es betrieben werden?',
        options: {
          unset: 'Keine Antwort (das Jahr der Studie; ein zukünftiges Jahr bei Q2 = D)',
          now: 'Jetzt: das Jahr der Studie',
          future: 'Ein zukünftiges Jahr',
        },
        yearPlaceholder: 'z. B. 2030',
      },
      period: {
        label: 'Wie viele Jahre verfolgt die Studie das System (Analysezeitraum oder Projekthorizont)?',
        placeholder: 'z. B. 25; leer für ein Bild eines Jahres',
      },
      lifetime: {
        label: 'Technische Lebensdauer der Hauptanlagen: wie lange die Anlagen physisch halten, nicht der Projekthorizont (zugleich ihr Abschreibungszeitraum)',
      },
      placeholder: 'z. B. 20',
      unit: 'Jahre',
      plain:
        'Über welche Jahre betrachtet die Studie das System? Beschreibt sie, wie die Dinge heute funktionieren, genügt ein Bild der Gegenwart. Geht es um eine Anlage, die erst in einem späteren Jahr läuft, oder verfolgt sie das System über Jahrzehnte, hängt das Ergebnis davon ab, wie sich Strom, Brennstoffe und Märkte verändern, und das Werkzeug bittet Sie um eine Einschätzung dieser Zukunft: dieselbe Zukunft für die ökologische und die wirtschaftliche Betrachtung.',
    },
    q9: {
      title: 'Q9 — Wozu dient die Studie, und wie weit reichen ihre Wirkungen? *',
      help: 'Pflicht. Sie legt die Modellierungssituation fest (ILCD A, B, C1 oder C2); Q1 beschreibt nur den Gegenstand.',
      details: 'Tabelle 1 in D4.1 klassifiziert die Studie nach der unterstützten Entscheidung und der Größe ihrer Folgen, nicht nach ihrem Gegenstand (D4.1 §4.2.3). Mikro (Situation A) ist der Standard für einzelne Austausche und Park- oder Anlagenplanungen, auch ohne benannten Entscheider (§4.3.4). Strukturell (Situation B) verlangt den Nachweis, dass die Änderung installierte Kapazität im betroffenen Markt verschiebt, etwa 1 % oder mehr der Neuinstallationen (§4.3.4, §11.3.1); ohne Nachweis bleibt die Studie A, mit B als Sensitivität. Ein bestehendes Netzwerk zu dokumentieren ist Situation C1 (Substitution, §7.2.3); die strikte Berichterstattung eines einzelnen Unternehmens ist C2 (Allokation, keine Gutschriften, §7.2.3), mit Kosten nur auf Unternehmensebene (T4.6-Designentscheidung).',
      options: {
        micro: 'Sie untersucht oder unterstützt eine Wahl, auch eine hypothetische ohne benannten Entscheider, und ihre Wirkungen bleiben in den beteiligten Anlagen (Situation A)',
        structural: 'Sie unterstützt eine Wahl, deren Wirkungen verändern, was ein ganzer Markt oder Sektor produziert (Situation B; der Nachweis muss dokumentiert sein)',
        none: 'Keine Wahl: Sie dokumentiert, was ein bestehendes Netzwerk oder System leistet, so wie es ist (Situation C1)',
        corporate_report: 'Strikte Berichterstattung eines einzelnen Unternehmens (ESG / CSRD), ohne Gutschrift für das, was die Symbiose anderswo vermeidet (Situation C2)',
      },
      screening: {
        label: 'Ist dokumentiert, dass die Änderung etwa 1 % oder mehr der Neukapazität im betroffenen Markt verdrängt?',
        yes: 'Ja, es ist dokumentiert (Situation B)',
        no: 'Nein (Situation A, mit Situation B als Sensitivitätsanalyse)',
      },
      plain:
        'Wozu dient die Studie? Meistens untersucht oder stützt sie eine Wahl, deren Wirkungen in den beteiligten Anlagen bleiben, auch wenn noch niemand entscheiden muss. Erst wenn die Änderung groß genug ist, um zu verändern, was ein ganzer Markt produziert, und man das zeigen kann, ändert die Studie ihre Art. Beschreiben Sie nur ein Netzwerk, das schon läuft, oder die Zahlen eines einzelnen Unternehmens, sagen Sie es: Jeder Fall wird anders modelliert.',
    },
    q10: {
      title: 'Q10 — Dient die Studie einem Ziel der öffentlichen Politik oder der Raumplanung?',
      help: 'Optional. Ohne Antwort leitet die Engine sie aus Q1 ab (ja nur bei Q1 = C).',
      details: 'D4.2 §2.3 ergänzt eine gesellschaftliche LCC (Net-Tax-Faktor, monetarisierte Externalitäten, sozialer Diskontsatz), wenn die Studie einem Ziel der öffentlichen Politik oder der Raumplanung dient, unabhängig von Q1 oder Q4. Eine Gemeinde, die einen Ökoindustriepark plant (Q1 = B), oder eine Behörde, die einen Sektor überwacht (Q1 = E), kann mit Ja antworten, ohne Q1 = C zu sein. Bei Q1 = D behält das Werkzeug die konventionelle LCC auf Unternehmensebene (T4.6-Designentscheidung) und weist darauf hin.',
      options: {
        unset: 'Nicht beantwortet (aus Q1 abgeleitet)',
        yes: 'Ja — Ziel der öffentlichen Politik oder der Raumplanung (ergänzt die gesellschaftliche LCC)',
        no: 'Nein — kein Ziel der Politik oder Raumplanung',
      },
      plain:
        "Antworten Sie ja, wenn die Studie einer öffentlichen Entscheidung dienen soll — einer Gemeinde, einer Region, einer Aufsichtsbehörde, einem Plan. Dann kommt eine zweite wirtschaftliche Lesart aus Sicht der Gesellschaft hinzu: anders gerechnete Steuern und Folgen, die niemand in Geld bezahlt. Für die eigene Rechenschaft eines einzelnen Unternehmens bleibt die wirtschaftliche Lesart auf Unternehmensebene, und das Werkzeug sagt es Ihnen. Ohne Antwort liest das Werkzeug sie aus der ersten Frage ab.",
    },

    q11: {
      title: "Q11 — Was vergleicht die Studie?",
      help: "Optional. Sie legt die Basis der funktionellen Einheit fest; ohne Antwort gilt die funktionsorientierte Einheit von D4.1 Part 1.",
      details: "D4.1 Part 2 verlangt, dass die funktionelle Einheit die Hauptfunktion des Systems widerspiegelt (§4.3, §6.3, §8.3): eine inputbasierte Einheit (z. B. Behandlung von 1 Tonne Abfall), wenn die Studie Entsorgungswege oder die Leistung einer Anlage oder Dienstleistung vergleicht; eine outputbasierte Einheit (z. B. 1 kg Produkt, 1 MJ Energie), wenn sie Produkte mit Marktalternativen vergleicht oder eine Substitutionsaussage stützt; ein System funktioneller Einheiten, wenn beide Funktionen gleichrangig sind (Part 1 §5.3.2). D4.2 §3.1 verlangt für die LCC eine doppelte Einheit (behandelter Abfall + erzeugter Output), wenn die Produktsubstitution die Studie leitet: Die beiden Deliverables weichen ab; das Tool folgt für die Ökobilanz der Part 2 und weist auf den Unterschied hin.",
      options: {
        unset: "Nicht beantwortet (funktionsorientierte Einheit, D4.1 Part 1)",
        waste_treatment: "Wie ein Abfall behandelt wird — Entsorgungswege, Leistung einer Anlage oder Dienstleistung (inputbasierte Einheit)",
        product_substitution: "Produkte gegenüber Marktalternativen — was das zurückgewonnene Produkt ersetzt (outputbasierte Einheit)",
        co_primary: "Beides: Behandlungsleistung und Produkte zählen gleich viel (System funktioneller Einheiten)",
      },
      plain:
        "Worum geht es beim Vergleich wirklich? Lautet die Frage, wie ein Abfall am besten behandelt wird — verbrennen, vergären, kompostieren —, wird das Ergebnis pro Tonne behandelten Abfalls gezählt. Lautet sie, ob das zurückgewonnene Produkt besser ist als das, was es ersetzt, wird pro Produkteinheit gezählt. Zählt beides gleich viel, werden beide nebeneinander gezählt.",
    },

    q2dCard: {
      title: 'Alternative Szenarien (optional)',
      help:
        'Jede Studie kann Alternativen mit ihrer Ausgangssituation vergleichen (D4.1 §4.3.3). Hier ändert ein Szenario einige Ihrer Antworten; das Netzwerk selbst (Flüsse, Entfernungen, Mengen) kann es noch nicht ändern.',
    },

    advancedCard: {
      title: 'Erweiterte Overrides (Expertenmodus)',
      activeKeys_one: '{{count}} aktiver Schlüssel',
      activeKeys_other: '{{count}} aktive Schlüssel',
    },
  },

  flows: {
    q5Note: "Antworten Sie mit der heutigen Regelung — vereinbart oder vorgesehen, wenn der Austausch noch nicht läuft. Das ist eine Ausgangsannahme, kein Ergebnis: ändert die Studie, wer wen bezahlt, kommen Sie zurück und passen Sie es an. Wählen Sie „kostenlos / mehrdeutig“, wenn es wirklich offen ist.",
    emptyHint: 'Keine Flüsse. Fügen Sie mindestens einen hinzu, um Q5 pro Fluss zu charakterisieren.',
    headers: { id: 'ID', name: 'Name', q5: 'Q5', sellable: 'An Dritte verkaufbar?', sector: 'Sektor (Teil 2)', configuration: "Konfiguration (Teil 2)" },
    sellable: { unset: '— nicht beantwortet', yes: 'Ja', no: 'Nein' },
    sellableHint: 'Würde der Partner diesen Fluss nicht abnehmen: Könnte der Erzeuger ihn an jemand anderen zu einem positiven Preis verkaufen? Ja macht ihn zum Koppelprodukt, nein zum Abfall, unabhängig vom vereinbarten Preis (D4.1 §8.3.3). Optional: Das Ergebnis vermerkt Widersprüche zu Q5.',
    sectorHint: "Wählen Sie das Kapitel von D4.1 Part 2 nach dem, was ausgetauscht wird, nicht nach dem Unternehmen: landwirtschaftliche und agroindustrielle Reststoffe → Agrar/Lebensmittel (§4); Siedlungs- oder gemischte Abfälle einschließlich Bioabfall (organische Fraktion des Restmülls, Lebensmittelabfälle aus Haushalten) → Abfallverwertung (§8); Klärschlamm und behandeltes Abwasser, auch als Wasser wiederverwendet → Abwasser (§6); ein aus einem Fluss gewonnenes Produkt oder ein Energieträger (Biomethan, Gärrest, Strom) → das Kapitel dieses Flusses. Wo sich §4 und §8 beim Bioabfall überschneiden, entscheidet die Herkunft (Lesart T4.6 von Part 2 §3.3). Optional: Das Ergebnis listet die Regeln des Kapitels.",
    sectorNone: '— keiner davon',
    configurationHint: "Die typische Konfiguration des Flusses in seinem Kapitel der Part 2 (D4.1 Part 2 §4.1-§8.1): Das Ergebnis nennt das konventionelle Produkt, das er ersetzt. Wählen Sie zuerst den Sektor.",
    configurationNone: "— nicht beantwortet",
    configurations: {
      agrifood_ad_bioenergy_fertiliser: "Organische Abfälle zu Bioenergie und Dünger (Vergärung/Kompostierung)",
      agrifood_feed_bioconversion: "Agrar- und Lebensmittelnebenprodukte zu Futtermitteln (Biokonversion)",
      agrifood_platform_chemicals: "Agrarreststoffe zu Plattformchemikalien / Biokunststoffen",
      agrifood_high_value_compounds: "Agroindustrielle Reststoffe zu hochwertigen Verbindungen",
      agrifood_nutrient_recovery: "Nährstoffrückgewinnung als Bodenverbesserer / Dünger",
      plastics_mechanical_recycling: "Mechanisches Recycling (offener oder geschlossener Kreislauf)",
      plastics_chemical_recycling: "Chemisches Recycling (thermochemisch/Depolymerisation)",
      plastics_reusable_packaging: "Mehrwegverpackungssysteme (PSS)",
      plastics_biobased_packaging: "Biobasierte / biologisch abbaubare Verpackungen",
      plastics_upcycling: "Upcycling und Dekontamination für hochwertige Kreisläufe",
      wastewater_nutrient_recovery: "Nährstoffrückgewinnung (P und N) zu Düngern",
      wastewater_sludge_to_energy: "Abwasser/Klärschlamm zu Energie (Biogas/KWK oder Aufbereitung)",
      wastewater_sludge_pyrolysis: "Klärschlammpyrolyse zu Biokohle und Energieträgern",
      wastewater_water_reuse: "Wasserrückgewinnung und -wiederverwendung",
      wastewater_screening_srf: "Rechengut zu Ersatzbrennstoff für die Industrie",
      wastewater_microalgae: "Mikroalgen-Bioraffinerien auf Abwasser",
      textiles_fibre_to_fibre: "Faser-zu-Faser-Recycling (geschlossener Kreislauf)",
      textiles_downcycling: "Downcycling zu Vliesstoffen und Verbundwerkstoffen (offener Kreislauf)",
      textiles_chemical_valorisation: "Chemische Verwertung zu Biochemikalien/Monomeren",
      textiles_recycled_carbon_fibre: "Recycelte Carbonfaser für technische Textilien",
      textiles_pss_reuse: "Produkt-Service-Systeme (PSS) und Wiederverwendung",
      wv_srf_coprocessing: "Siedlungsabfall/EBS zu Energie (Mitverbrennung)",
      wv_biowaste_nutrients_energy: "Bioabfall zu Nährstoffen und Energie",
      wv_tailings_construction: "Industrielle Reststoffe/Bergbaurückstände zu Baustoffen und Metallen",
      wv_weee_urban_mining: "Elektroaltgeräte und Urban Mining",
      wv_plastic_upcycling: "Upcycling von Kunststoffabfällen (mechanisch/thermochemisch)",
    },
    namePlaceholder: 'z. B. Wärme, CO2',
    addButton: 'Fluss hinzufügen',
    removeAria: '{{id}} entfernen',
    options: {
      a: 'a — A zahlt B (Abfall)',
      b: 'b — Freier Tausch (mehrdeutig)',
      c: 'c — B zahlt A (Co-Produkt)',
      d: 'd — Interdependent',
      e: 'e — Aggregiert / Black-box',
    },
  },

  scenarios: {
    intro:
      "Ein Szenario variiert hier die *methodischen* Antworten, nicht das physische Netzwerk: es erbt Q1–Q7 von der Baseline und unterscheidet sich nur über das Overrides-Dict. Wohin ein Fluss geht, über welche Distanz oder zu welchem Preis, ist ein Netzwerkvergleich — solche Varianten zeichnet man im Netzwerk-Editor, und die Engine vergleicht sie noch nicht.",
    emptyHint: 'Noch keine alternativen Szenarien.',
    headers: { id: 'ID', label: 'Bezeichnung' },
    labelPlaceholder: 'z. B. Zukünftige Erweiterung / TRL9 Ramp-up',
    addButton: 'Szenario hinzufügen',
    removeAria: '{{id}} entfernen',
  },

  advanced: {
    intro:
      'Expertenmodus-Overrides. Jeder Schlüssel wird von der Engine via dict.get gelesen; fehlende Schlüssel bedeuten „verwende den Default". Werte werden zu true/false/Zahl/String je nach Bedarf konvertiert.',
    headers: { key: 'Schlüssel', value: 'Wert', hint: 'Hinweis', custom: 'custom' },
    addCustom: 'Custom-Schlüssel hinzufügen',
    clearAria: '{{key}} löschen',
    removeAria: '{{key}} entfernen',
    hints: {
      slca_framework_override: "Auf 'absolute' setzen, um L1 BLOCK 2 zu testen (mit Q3.soc=true)",
      asset_lifetime: 'Jahre (alt; genutzt, wenn die Lebensdauer in Q8 leer ist); ein Horizont über der Schwelle (standardmäßig 15) ergänzt LCA und LCC um zukünftigen Hintergrund (lca_mc_21, lcc_hc_23, CIR-01)',
      future_background_threshold_years:
        'Jahre. Der Studienhorizont, ab dem LCA und LCC einen zukünftigen Hintergrund brauchen (lca_mc_21, lcc_hc_23, CIR-01). Standard 15, der Wert, den D4.2 §9.3 ohne Quelle angibt; wenn Sie ihn ändern, begründen Sie es in der methodischen Charta',
      transport_sensitive: 'Boolean; true aktiviert CIR-03',
      network_nodes: 'Integer; ≥3 (mit Q1=B + interdependent_flows) aktiviert CIR-04',
      interdependent_flows: 'Boolean; true (mit Q1=B + network_nodes≥3) aktiviert CIR-04',
      frontier_categories_active: 'Boolean; true aktiviert CIR-06',
      is_specific_capital_goods: 'Boolean; true aktiviert IR-13 / B-06 / CIR-08',
      multi_actor: 'Boolean; true (mit Q1∈{B,C}) aktiviert FU-02',
    },
  },

  narrative: {
    ilcd: {
      'ILCD Situation A': {
        title: 'Entscheidungsunterstützung mit begrenzten Folgen (ILCD-Situation A)',
        short: 'Entscheidungsunterstützung auf Mikroebene: der Austausch ist zu klein, um das Hintergrundsystem zu verändern. Attributionelle Modellierung mit Substitution am durchschnittlichen Marktmix.',
        detail: 'The exchange affects the actors involved, not what the wider economy produces or how. You therefore model with average, accounting-style data, and represent what the symbiosis displaces by substituting the average market mix — the national grid mix for electricity, average virgin production for a material. D4.1 warns explicitly against reaching for consequential modelling merely because a decision is being taken.',
      },
      'ILCD Situation B': {
        title: 'Entscheidungsunterstützung mit strukturellen Folgen (ILCD-Situation B)',
        short: 'Entscheidungsunterstützung auf Meso-/Makroebene: die Entscheidung verändert das Hintergrundsystem strukturell, daher konsequenzielle Modellierung gegen die marginale Technologie. D4.1 verlangt den Nachweis dieser Größenordnung.',
        detail: 'The decision is large enough to shift installed capacity or the output of a specific technology. Modelling goes consequential, and what the symbiosis displaces is the marginal technology, identified through a market analysis rather than taken as the average mix. The burden of proof is on you: this route has to be demonstrated, not assumed.',
      },
      'ILCD Situation C1': {
        title: 'Dokumentation eines bestehenden Netzwerks (ILCD-Situation C1)',
        short: 'Bilanzierung mit Wechselwirkungen — dokumentiert, was ein bestehendes Netzwerk der Wirtschaft insgesamt bringt. Substitution am durchschnittlichen Marktmix, wie in Situation A.',
        detail: 'You are documenting a network that exists rather than supporting a decision, so the study is descriptive. But since the point is to show what the network gives the wider economy, multifunctionality is still resolved by substitution at the average market mix — operationally the same rule as Situation A.',
      },
      'ILCD Situation C2': {
        title: 'Strikte Bilanzierung eines einzelnen Unternehmens (ILCD-Situation C2)',
        short: 'Strenge Bilanzierung für einen einzelnen Partner isoliert: Allokation, keine Substitutionsgutschriften.',
        detail: 'Strict accounting for a single partner on its own, typically corporate reporting. Multifunctionality is resolved by allocation, and no credit is claimed for what the symbiosis displaces elsewhere: the number describes that partner\'s share of the burdens, not the benefit the network produces.',
      },
    },
    lcc: {
      'deactivated': {
        short: 'Keine ökonomische Analyse — die ökonomische Dimension ist in Q3 deaktiviert.',
        detail: 'Q3 has no economic dimension selected, so the engine configures no costing at all. If the case needs a business case — and for a symbiosis that has to be signed by several firms it usually does — go back to Q3 and switch the economic dimension on.',
      },
      'C+E': {
        short: 'Konventionelle LCC (die realen Zahlungsströme des Unternehmens) plus ökologische LCC (die Wertschöpfungskette, auf denselben Grenzen wie die Ökobilanz).',
        detail: 'Two views run together. The conventional LCC answers whether it pays for the individual firm: real cash flows, taxes and fees as costs, subsidies as reductions. The environmental LCC widens the boundary to every actor in the life cycle and is kept consistent with the parallel LCA, so the two can be read side by side. Watch for double counting: a carbon or landfill tax already in the cash flows must not reappear as a monetised externality.',
      },
      'C+E+S': {
        short: 'Konventionelle und ökologische LCC plus gesellschaftliche LCC: Steuern und Subventionen über den Net Tax Factor angepasst, Umweltwirkungen monetarisiert.',
        detail: 'On top of the firm and value-chain views comes the welfare view. Taxes and subsidies are transfers inside society rather than real costs to it, so they are excluded or converted into shadow prices through the Net Tax Factor, and the environmental impacts from the parallel LCA are monetised. This is the configuration a public decision needs, which is why a public or policy objective brings it in.',
      },
      'C-LCC': {
        short: 'Nur konventionelle LCC — die Unternehmensperspektive, entspricht einer Total-Cost-of-Ownership-Analyse.',
        detail: 'Only the firm\'s own perspective. Every policy instrument is a real cash flow: taxes and fees are costs, subsidies reduce capex or opex. It is the right frame for corporate reporting, and it deliberately says nothing about value-chain or societal effects — claiming those would overstate what a single-actor account can support.',
      },
      'C+N': {
        short: 'Konventionelle LCC je Partner, auf Netzwerkebene konsolidiert. Keine ökologische LCC: Der Fall hat keine Ökobilanz, mit der sie konsistent sein könnte.',
        detail: 'Zuerst die realen Zahlungsströme jedes Unternehmens, dann dieselben Konten über das Netzwerk summiert, wobei sich die Zahlungen zwischen Partnern aufheben. Die ökologische LCC entfällt, weil D4.2 sie auf der Systemgrenze einer parallelen Ökobilanz aufbaut und der Fall keine Umweltdimension bewertet. Aktivieren Sie die Umweltdimension in Q3, wenn die Studie die Sicht der Wertschöpfungskette braucht.',
      },
      'C+N+S': {
        short: 'Konventionelle LCC je Partner und für das Netzwerk, plus gesellschaftliche LCC mit dem Net Tax Factor. Ohne Ökobilanz werden Umweltwirkungen nicht monetarisiert.',
        detail: 'Unternehmens- und Netzwerkkonten wie oben, plus die Wohlfahrtssicht, die eine öffentliche Entscheidung braucht: Steuern und Subventionen über den Net Tax Factor umgerechnet, ein sozialer Diskontsatz und eine Systemgrenze bis zum Lebensende. Es fehlt die Monetarisierung der Umweltwirkungen, die die Ergebnisse einer parallelen Ökobilanz erfordert: Aktivieren Sie die Umweltdimension in Q3, um sie hinzuzufügen.',
      },
    },
    slca: {
      'active': {
        short: 'S-LCA aktiv: soziale Indikatoren je Stakeholder-Gruppe.',
        detail: 'The social dimension is on. Each stakeholder group — workers, consumers, local communities, value-chain actors — is mapped to the processes it is affected by, and from there to impact subcategories and indicators. The mapping is only as good as the engagement behind it, so talking to the groups involved is part of the data collection, not an optional extra.',
      },
      'deactivated': {
        short: 'S-LCA nicht aktiviert — die soziale Dimension ist in Q3 deaktiviert.',
        detail: 'Q3 has no social dimension selected, so no stakeholder mapping and no social indicator are configured. Switch it on in Q3 if the case has to say anything about workers or local communities — which is usually the case when a symbiosis is presented to a municipality or a community.',
      },
    },
  },

  result: {
    notes: { title: 'Hinweise zu Ihren Antworten' },
    engineNotes: {
      structural_without_screening: "Q9 nennt strukturelle Auswirkungen, aber das Markt-Screening ist nicht dokumentiert: Die Studie wird als ILCD-Situation A behandelt, und Situation B ist als Sensitivität zu prüfen (D4.1 §4.3.4, §11.3.1).",
      structural_screening_missing: "Situation B verlangt den Nachweis, dass die Änderung etwa 1 % oder mehr der neuen Kapazität im betroffenen Markt verdrängt (D4.1 §11.3.1); dokumentieren Sie ihn, sonst ist die Studie Situation A mit B als Sensitivität (D4.1 §4.3.4).",
      decision_scale_vs_q1: {
        c_micro: "Q1 (sektorweite Vorstudie) bedeutet meist Folgen in struktureller Größenordnung; Sie haben begrenzte Folgen angegeben, daher wird die Studie als ILCD-Situation A behandelt. D4.1 §4.3.4: Wählen Sie die konsequenzielle Ökobilanz nicht allein deshalb, weil eine Entscheidung getroffen wird.",
        e_micro: "Q1=E (Monitoring) setzt keine Entscheidung voraus; Sie haben angegeben, dass die Studie eine Entscheidung mit begrenzten Folgen stützt, daher wird sie als ILCD-Situation A behandelt.",
        e_structural: "Q1=E (Monitoring) setzt keine Entscheidung voraus; Sie haben angegeben, dass die Studie eine Entscheidung mit strukturellen Folgen stützt, daher wird sie als ILCD-Situation B behandelt.",
      },
      q1_d_not_corporate: "Q1=D beschreibt die Nachhaltigkeitsberichterstattung eines Unternehmens, aber laut Q9 ist die Studie kein Unternehmensbericht; die ILCD-Situation folgt Q9. Strikte Unternehmensberichterstattung (Allokation, keine Gutschriften) ist ILCD-Situation C2 (D4.1 §7.2.3).",
      documentation_vs_ex_ante: 'ILCD-Situation C dokumentiert Austausche, die bereits stattfinden, aber Q2 sagt, dass sie noch nicht stattfinden. Prüfen Sie, ob die Situation die gemeinte ist.',
      c2_keeps_c_lcc: "Die strikte Berichterstattung eines einzelnen Unternehmens (ILCD-Situation C2) behält die Kostenrechnung auf Unternehmensebene (nur C-LCC), was immer Q10 sagt: eine Entwurfsentscheidung von T4.6, da ein einzelnes Unternehmen keine Netzwerkebene hat.",
      policy_no_but_q1_c: "Q1=C (sektorweite Vorstudie) dient meist einer öffentlichen Politik; Sie haben dies verneint, daher wird die gesellschaftliche Kostenrechnung (S-LCC, Net Tax Factor, sozialer Diskontsatz) nicht hinzugefügt.",
      lcc_without_lca: {
        plain: "Q3 enthält keine Umweltdimension, es gibt also keine parallele Ökobilanz: Die Kostenrechnung ist die konventionelle LCC jedes Partners, auf Netzwerkebene konsolidiert (D4.2 §4.1), ohne die ökologische LCC, die D4.2 auf der Systemgrenze der Ökobilanz aufbaut.",
        policy: "Q3 enthält keine Umweltdimension, es gibt also keine parallele Ökobilanz: Die Kostenrechnung ist die konventionelle LCC jedes Partners, auf Netzwerkebene konsolidiert (D4.2 §4.1), ohne die ökologische LCC, die D4.2 auf der Systemgrenze der Ökobilanz aufbaut. Die gesellschaftliche LCC behält Net Tax Factor und sozialen Diskontsatz, aber ohne Ökobilanzergebnisse lassen sich Externalitäten nicht monetarisieren (D4.2 §11.2).",
      },
      c2_allocation_over_pef: "Die strikte Berichterstattung eines einzelnen Unternehmens (ILCD-Situation C2) verwendet Allokation und keine Substitutionsgutschriften (D4.1 §7.2.3); die von Q4=D verlangte Circular Footprint Formula der PEF wird daher nicht angewandt: Die CFF ist eine Produktmethode. Ist die Studie ein Produkt-Fußabdruck und kein Unternehmensbericht, prüfen Sie Q9.",
      slca_alone: "Q3 wählt nur die soziale Dimension. D4.3 §3.1 baut die S-LCA auf der funktionellen Einheit und den Systemgrenzen einer Ökobilanz oder LCC auf; ist keine gewählt, dokumentieren Sie Bezugseinheit und Systemgrenze in der methodischen Charta.",
      flow_sellable_but_waste: "Fluss „{{flow}}“: Laut Q5 zahlt der Erzeuger für die Entsorgung (Abfall), aber ein Dritter würde dafür bezahlen. D4.1 §8.3.3 und §8.3.6 Schritt 1: Ein Fluss mit unabhängigem positivem Marktwert ist ein Koppelprodukt, und seine Vorkettenlast wird geteilt (Substitution oder Allokation), nicht abgeschnitten. Prüfen Sie Q5 für diesen Fluss.",
      flow_price_without_market: "Fluss „{{flow}}“: Laut Q5 bezahlt der Empfänger dafür (Koppelprodukt), aber kein Dritter würde das tun. D4.1 §8.3.3: Ohne unabhängigen Markt ist der Preis eine Verwaltungsgebühr und der Fluss ein Abfall, lastenfrei ab dem Punkt, an dem er erstmals einen nicht negativen Wert erreicht (§8.3.6 Schritt 4). Ausnahme ist ein Erzeuger, der seinen Prozess für den Partner ändert (Q5 = d).",
      flow_freedom_to_act_settles: {
        co_product: "Fluss „{{flow}}“: Q5 lässt offen, wer wen bezahlt; die Freedom-to-Act-Antwort (D4.1 §8.3.3) liest ihn als Koppelprodukt (§8.3.2, Last geteilt).",
        waste: "Fluss „{{flow}}“: Q5 lässt offen, wer wen bezahlt; die Freedom-to-Act-Antwort (D4.1 §8.3.3) liest ihn als Abfall (lastenfrei ab dem Punkt, an dem er erstmals einen nicht negativen Wert erreicht, §8.3.6 Schritt 4).",
      },
      flow_part2_chapter: "Fluss „{{flow}}“: Für ihn gelten die Sektorregeln von D4.1 Part 2 {{chapter}}; sie stehen unter Sektorregeln.",
      flow_configuration_unknown: "Fluss „{{flow}}“: Die Konfiguration „{{configuration}}“ gehört nicht zu D4.1 Part 2.",
      flow_configuration_other_chapter: "Fluss „{{flow}}“: Seine Konfiguration gehört zu {{chapter}}, nicht zum angegebenen {{declared}}; die Regeln beider Kapitel werden aufgeführt.",
    },
    sectorChapters: { '§4': "§4 Agrar, Lebensmittel und Bioraffinerien", '§5': "§5 Kunststoffe und Verpackungen", '§6': "§6 Abwasser und Biofabriken", '§7': "§7 Textil und technische Textilien", '§8': "§8 Abfallverwertung" },
    sectorRules: {
      title: 'Sektorregeln (D4.1 Part 2)',
      lead: 'Die Regeln, die D4.1 Part 2 für die Sektoren Ihres Falls vorgibt. Das Tool wendet sie nicht für Sie an: Dokumentieren Sie in der Studie, wie jede eingehalten wurde.',
      activatedBy: 'Gelten wegen: {{reasons}}',
      byFlow: 'den Fluss „{{name}}“',
      byCaseSector: 'den Sektor des Falls (Q6a)',
      configurationLine: "Fluss „{{flow}}“ — {{configuration}}: Das konventionelle Produkt, das er ersetzt, ist {{substitutes}}.",
      c2NoCredit: "Situation C2: Es wird keine Substitutionsgutschrift angewandt (D4.1 §7.2.3); das Produkt beschreibt nur die Konfiguration.",
      count: '{{count}} Regeln',
      strength: { must: 'Pflicht', should: 'empfohlen', descriptive: 'Praxis' },
    },
    verdict: {
      moreInfo: 'Mehr zu dieser Konfiguration',
    },
    next: {
      obligations: "{{count}} methodische Praktiken betreffen Ihre Antworten. Sie sind mit ihrem Auslöser im Data Collection File aufgeführt.",
      title: 'Was jetzt zu tun ist',
      lead:
        'Methodische Praktiken, die Ihre Antworten verbindlich machen, plus offene Entscheidungen. Jede nennt den Grund für Ihren Fall.',
      provenance:
        "Die Bezeichnungen der Regeln und Entscheidungspunkte sind aus der englischen Tabelle des Motors übersetzt. Der Code neben jedem Eintrag — IR-01, CDP-02 — ist die Referenz, die in allen Sprachen gleich bleibt, und der englische Name steht daneben.",
      allClear:
        'Für diese Antworten gilt keine methodische Verpflichtung, und es wurde kein kritischer Entscheidungspunkt aufgeworfen. Nächster Schritt: Inventardaten erheben.',
      ctaHint: 'Das Data Collection File ist auf diese Konfiguration kalibriert: es fragt nur ab, was Ihr Fall braucht.',
    },
    actionKind: {
      block: 'Blockierend',
      obligation: 'Zu dokumentieren',
      decision: 'Zu entscheiden',
    },
    severity: {
      HIGH: 'Hoch',
      MEDIUM: 'Mittel',
      LOW: 'Niedrig',
    },
    action: {
      appliesToCase: "Gilt für diesen Fall.",
      resolution: "Wie das aufgelöst wird",
      why: 'Warum es Sie betrifft',
      todo: 'Was zu dokumentieren ist',
    },
    technical: {
      title: 'Technisches Detail (Engine-Ausgabe)',
      lead: 'Alles, was die Pipeline erzeugt hat — für Review und Nachvollziehbarkeit.',
    },
    title: 'Engine-Ausgabe',
    summary: {
      ilcdSituation: 'ILCD-Situation',
      lccType: 'LCC-Typ',
      slca: 'S-LCA',
      activatedNodes: 'Aktivierte Knoten',
      l1Blocks: 'Ausgelöste L1-BLOCK',
      l2Violations: "Fehlgeschlagene L2-Assertions (Diagnose)",
      l3Cdps: 'L3-CDPs aufgetreten',
      extended: '(erweitert)',
    },
    blocked: {
      title: 'Pipeline bei L1 blockiert',
      desc: 'Die Engine hat bei L1 gestoppt. Keine Aktivierung, L2 oder L3 Logik wurde ausgeführt. Lösen Sie die blockierende(n) Constraint(s) unten und führen Sie erneut aus:',
    },
    toggleShow: 'Reasoning anzeigen',
    toggleHide: 'Reasoning ausblenden',
    rawJson: 'Rohe JSON-Antwort',
    actions: {
      adjust: 'Antworten anpassen',
      startFresh: 'Neu starten (alles löschen)',
      downloadJson: 'Fall herunterladen (.json)',
      downloadReport: 'Bericht herunterladen (.docx)',
      downloadingReport: 'Bericht wird generiert…',
      reportError: 'Berichtserstellung fehlgeschlagen',
      runScenarios: 'Szenarien ausführen',
      runningScenarios: 'Szenarien werden ausgeführt…',
    },
    confirmStartFresh: 'Aktuellen Fall verwerfen und einen neuen starten? Dies kann nicht rückgängig gemacht werden.',
    noResult: { title: 'Noch kein Ergebnis', desc: 'Senden Sie einen Fragebogen ab, um die Engine-Ausgabe hier zu sehen.', cta: 'Fragebogen öffnen' },
    error: { title: 'Pipeline-Fehler', back: 'Zurück zum Fragebogen' },
  },

  scenariosResult: {
    title: 'Szenarienvergleich',
    description: 'Pipeline für die Baseline + {{n}} alternative Szenarien ausgeführt. Unterschiede vs Baseline hervorgehoben.',
    backToResult: 'Zurück zum Einzelergebnis',
    columns: {
      scenario: 'Szenario',
      ilcd: 'ILCD',
      lccType: 'LCC-Typ',
      slca: 'S-LCA',
      activated: 'Aktiviert',
      blocks: 'L1-BLOCK',
      violations: 'L2-Verletzungen',
      cdps: 'L3-CDPs',
    },
    baselineLabel: 'Baseline',
    diffSuffix: '(Diff)',
    overrideHelp: 'Jedes Szenario erbt Q1-Q7 von der Baseline; befüllen Sie overrides (JSON-Dict) pro Szenario, um zu differieren. Leere Overrides → gleicher Fall wie Baseline.',
    overridesPlaceholder: 'z. B. {"q1": "C"} oder {"q3": {"env": true, "eco": true}}',
    overridesParseError: 'Overrides müssen gültiges JSON für {{id}} sein',
  },


  reasoning: {
    activatedNodes: 'Aktivierte Knoten ({{count}})',
    pillarConfigs: 'Pillar-Konfigurationen',
    noPillarValues: 'Keine Pillar-Werte geschrieben.',
    l2Violations: 'L2-Regelverletzungen ({{count}})',
    noViolations: 'Keine Verletzungen.',
    l3Cdps: 'L3 Critical Decision Points ({{count}})',
    noCdps: 'Keine CDPs aufgetreten.',
    pillarKeys: '{{count}} Schlüssel',
    resolution: 'Lösung',
    filterPlaceholder: 'Nach Knoten-ID filtern…',
    noMatch: 'Keine Knoten entsprechen dem Filter.',
    showingFiltered: '{{shown}} von {{total}} angezeigt',
  },

  loading: { default: 'Pipeline läuft…' },

  shortcuts: {
    title: 'Tastenkürzel',
    closeHint: 'Drücken Sie {{esc}} oder klicken Sie außerhalb, um zu schließen.',
    items: {
      help: 'Diese Tastenkürzel-Hilfe anzeigen',
      run: 'Konfiguration ermitteln',
      runContext: 'Fragebogen',
      toggleReasoning: 'Reasoning-Panel umschalten',
      toggleReasoningContext: 'Ergebnis',
      print: 'Ergebnisseite drucken',
      printContext: 'Ergebnis',
      esc: 'Diesen Dialog schließen',
    },
  },

  preset: {
    title: 'Veröffentlichten Fall als Preset laden',
    help:
      '13 Fixtures aus dem Validierungs-Sample (12 Papers + Leiva Escombreras / Frövi). Lädt die Q1-Q7 + Q5 pro Fluss in den Fragebogen, um die Engine end-to-end zu inspizieren und auszuführen.',
    loadButton: 'Preset laden',
    rationaleToggle: 'Warum diese Antworten? (Compilation-Rationale)',
  },

  toast: {
    pipelineCompleted: 'Pipeline abgeschlossen in {{ms}} ms — {{situation}}',
    pipelineError: 'Pipeline-Fehler — {{detail}}',
    scenariosCompleted: '{{n}} Szenarien ausgeführt',
    scenariosError: 'Szenarienausführung fehlgeschlagen — {{detail}}',
  },

  language: {
    label: 'Sprache',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },

  auth: {
    title: 'Anmelden',
    subtitle: 'Optional zum Durchsuchen von Legacy-/öffentlichen Fällen. Erforderlich, um private Fälle zu erstellen.',
    tabLogin: 'Anmelden',
    tabRegister: 'Konto erstellen',
    emailLabel: 'E-Mail',
    passwordLabel: 'Passwort',
    passwordHelp: 'Mindestens 8 Zeichen.',
    submitLogin: 'Anmelden',
    submitRegister: 'Konto erstellen',
    submitting: 'Senden…',
    skipLink: 'Ohne Anmeldung fortfahren',
    signIn: 'Anmelden',
    logout: 'Abmelden',
    errors: {
      registrationClosed: 'Die Registrierung ist auf dieser Instanz geschlossen. Bitten Sie den Administrator um ein Konto.',
      emailTaken: 'Mit dieser E-Mail-Adresse existiert bereits ein Konto. Versuchen Sie, sich anzumelden.',
      invalidCredentials: 'E-Mail oder Passwort falsch.',
    },
  },

  scoringPending: {
    title: "Warten auf die Kennzahlen",
    body:
      "Die quantitativen LCSA-Kennzahlen für diesen Fall liegen noch nicht vor. Sobald sie eintreffen, erscheinen hier die ökologischen, ökonomischen und sozialen Indikatoren.",
    lastChecked: "Zuletzt geprüft: {{date}}",
  },

  compliance: {
    status: {
      ok: "ja",
      no: "nicht angegeben",
      pending: "ausstehend",
      na: "nicht zutreffend",
    },
  },
  stakeholder: {
    audience: {
      industry: {
        whatYouSee:
          "Was diese Seite Ihnen heute sagt: welcher Methodik die Bewertung folgt und welche Daten deshalb von Ihnen verlangt werden. Die Abfrage selbst ist das Data Collection File.",
        whenScoring:
          "Sobald die Kennzahlen vorliegen, sehen Sie die ökologischen und ökonomischen Kennzahlen des Falls und können beurteilen, ob sich der Austausch rechnet.",
      },
      community: {
        whatYouSee:
          "Was diese Seite Ihnen heute sagt: welche Flüsse die Unternehmen austauschen, und ob diese Studie soziale Wirkungen überhaupt untersucht.",
        whenScoring:
          "Sobald die Kennzahlen vorliegen, sehen Sie die sozialen Indikatoren — Beschäftigte, lokale Gemeinschaft — und die ökologischen, jeweils mit der betroffenen Gruppe.",
      },
      authority: {
        whatYouSee:
          "Was diese Seite Ihnen heute sagt: wie die Bewertung angelegt ist, welche Compliance-Signale der Fall angibt und welchen geografischen Umfang er abdeckt.",
        whenScoring:
          "Sobald die Kennzahlen vorliegen, sehen Sie die Umweltwerte und, wo die Studie sie einschließt, die gesellschaftlichen Kosten — die beiden Grundlagen einer öffentlichen Entscheidung.",
        scope: "Für den Fall angegebener geografischer Umfang: {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "Was diese Seite Ihnen heute sagt: welche Materialien diese Symbiose wieder in Umlauf bringt und ob ökologische und soziale Wirkungen untersucht werden.",
        whenScoring:
          "Sobald die Kennzahlen vorliegen, sehen Sie die ökologischen und sozialen Indikatoren der Kette hinter dem Produkt.",
        productCaveat:
          "Diese Bewertung beschreibt den Austausch zwischen den Unternehmen, nicht das Endprodukt, das Sie kaufen: das Werkzeug fragt nie, welches Produkt es ist.",
      },
    },
    noVerdict: "Für diesen Fall wurde noch keine Konfiguration abgeleitet.",
    notAssessed: {
      social: "Diese Studie bewertet keine sozialen Wirkungen: die soziale Dimension wurde bei der Fallkonfiguration deaktiviert. Bitten Sie die Analystin oder den Analysten, sie zu aktivieren, wenn Beschäftigte oder die lokale Gemeinschaft zur Frage gehören.",
      economic: "Diese Studie bewertet keine Kosten: die ökonomische Dimension wurde bei der Fallkonfiguration deaktiviert.",
    },
    flowsLine_one: "{{count}} ausgetauschter Fluss: {{names}}.",
    flowsLine_other: "{{count}} ausgetauschte Flüsse: {{names}}.",
    navLink: 'Stakeholder-Bericht',
    title: 'Stakeholder-Bericht',
    subtitle:
      'Multi-Stakeholder-Ansicht des Falls. Wechseln Sie die Registerkarten, um Informationen zu sehen, die auf jede Zielgruppe entlang der biobasierten Wertschöpfungskette zugeschnitten sind.',
    openButton: 'Stakeholder-Bericht öffnen',
    backToResult: 'Zurück zum Ergebnis',
    openDcf: 'Data Collection File öffnen',
    loadingScoring: 'Scoring-Daten werden geladen…',
    tabs: {
      industry: 'Industrie',
      community: 'Gemeinschaft',
      authority: 'Lokale Behörde',
      'end-user': 'Endnutzer',
    },
    framing: {
      industry:
        'Vollständige technische Ansicht der methodischen Konfiguration und der quantitativen Bewertung, die außerhalb dieses Werkzeugs vom SYMBA-Partner CIRCE erstellt wird.',
      community:
        'Lokale Auswirkungsansicht: Umweltqualität und soziale Vorteile für das Gastgebiet.',
      authority:
        'Regulatorische und politische Ansicht: Methodische Konfiguration, Peer-Review-Status, EU-PEF-Ausrichtung.',
      'end-user':
        'Zusammenfassende Ansicht für Endnutzer der symbiose-derivierten Produkte.',
    },
    verdictTitle: 'Methodische Konfiguration',
    labels: {
      ilcd: 'ILCD-Situation',
      lcc: 'LCC-Typ',
      slca: 'S-LCA-Aktivierung',
    },
    scoringTitle: 'Scoring (CIRCE)',
    scoringPendingTitle: 'Scoring-Daten noch nicht verfügbar',
    scoringPendingBody:
      'Das von CIRCE produzierte LCSA-Scoring für diesen Fall wurde noch nicht eingegeben. Sobald CIRCE die quantitative Nutzlast liefert, erscheinen die Indikatoren hier, gruppiert nach Stakeholder-Relevanz.',
    scoringEmpty: 'Keine für diesen Stakeholder relevanten Indikatoren.',
    indicatorPending: 'ausstehend',
    engineDetailsTitle: 'Engine-Pipeline-Details',
    activatedNodesCount_one: '{{count}} aktivierter methodischer Knoten',
    activatedNodesCount_other: '{{count}} aktivierte methodische Knoten',
    obligations_one: "{{count}} zu dokumentierende methodische Praktik",
    obligations_other: "{{count}} zu dokumentierende methodische Praktiken",
    cdpFlagsCount_one: '{{count}} dimensionsübergreifende Spannung',
    cdpFlagsCount_other: '{{count}} dimensionsübergreifende Spannungen',
    complianceTitle: 'Compliance-Signale',
    compliance: {
      peerReview: 'Unabhängige Begutachtung: {{status}}',
      pef: 'EU-PEF-Ausrichtung (Q4=D): {{status}}',
      publicClaim: 'Öffentlicher Überlegenheitsanspruch (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Regionales Dashboard',
    title: 'Regionales / sektorales Dashboard',
    subtitle:
      'Aufschlüsselung aller gespeicherten Fälle nach ILCD-Situation, LCC-Struktur, Sektor und geografischem Umfang. Für lokale Behörden und politische Analysten.',
    openButton: 'Regionales Dashboard öffnen',
    backToCases: 'Zurück zu den Fällen',
    loading: 'Aggregierte Daten werden geladen…',
    errorTitle: 'Aggregierte Daten konnten nicht geladen werden',
    errorNoData: 'Der Server hat keine Daten zurückgegeben.',
    totalLabel: 'Gespeicherte Fälle insgesamt',
    noData: '(keine Daten)',
    tableKey: 'Wert',
    tableCount: 'Anzahl',
    breakdownTitle: {
      byLccType: 'Nach LCC-Struktur',
      bySector: 'Nach Sektor (Q6a)',
      byScope: 'Nach geografischem Umfang (Q7)',
      byIlcd: 'Nach ILCD-Situation',
    },
  },

  obligations: {
    empty: "Für diesen Fall ist nichts zu dokumentieren.",
    lead:
      "{{total}} Punkte betreffen diesen Fall: {{mandates}} methodische Vorgaben und {{rules}} methodenübergreifende Regeln, ausgelöst durch Ihre Antworten. Jeder ist eine im LCSA-Bericht zu dokumentierende Verpflichtung.",
    because: "Gilt, weil:",
    notApplicable: "Hier nicht anwendbar: {{fields}} — diese Methode ist in Q3 deaktiviert.",
    origin: {
      mandate: "Vorgabe",
      rule: "Methodenübergreifende Regel",
    },
  },
  dcf: {
    noCase: { title: 'Noch kein Fall', desc: 'Das Data Collection File wird aus Ihrer Bewertung erstellt: Füllen Sie zuerst den Fragebogen aus (oder öffnen Sie einen gespeicherten Fall) und kommen Sie dann hierher zurück.', cta: 'Fragebogen öffnen' },
    derivedField: "von der Engine gefüllt",
    obligationsTitle: "Zu dokumentierende methodische Entscheidungen",
    navLink: 'Datenerhebung',
    title: 'Data Collection File',
    subtitle:
      'Auf die abgeleitete Konfiguration zugeschnitten. Laden Sie die Excel-Datei herunter, um Inventardaten mit den Symbiose-Partnern zu sammeln, und kehren Sie für den finalen Report zurück.',
    loading: 'Erstelle Data Collection File…',
    errorTitle: 'Erstellung des Data Collection File fehlgeschlagen',
    errorNoPayload: 'Der Server hat keine Antwort zurückgegeben.',
    backToResult: 'Zurück zum Ergebnis',
    networkTitle: 'Netzwerkdiagramm',
    downloadXlsx: 'Excel (.xlsx) herunterladen',
    downloadingXlsx: 'Excel wird vorbereitet…',
    downloadDocx: 'Begleitdokument (.docx) herunterladen',
    downloadingDocx: 'Dokument wird vorbereitet…',
    downloadError: 'Download fehlgeschlagen',
    footerNote:
      'Das Data Collection File ist ein exportfertiges Inventarblatt. Füllen Sie die leeren Zeilen offline aus (oder verteilen Sie sie an die Netzwerkpartner) und übergeben Sie die Daten an den für die LCSA verantwortlichen Analysten.',
    openButton: 'Data Collection File öffnen',
    tabOverview: 'Übersicht',
    tabNetworkBuilder: 'Netzwerk-Editor',
  },

  networkDiagram: {
    counts: '{{actors}} Akteure · {{flows}} Flüsse',
    placeholder:
      'Nur Vorschau — dies ist ein Platzhalter aus den im Fragebogen deklarierten Flüssen. Zeichnen Sie das echte Netzwerk im Tab Netzwerk-Editor, dann erscheint es hier, in der Excel-Datei und im Bericht.',
  },

  networkBuilder: {
    loadExample: 'Beispiel laden',
    exampleReplaceConfirm:
      'Dies ersetzt das aktuell gezeichnete Netzwerk durch das Beispiel. Fortfahren?',
    whyAsked: 'Abgefragt, weil:',
    hint: {
      step1: 'Fügen Sie je einen Akteur pro Teilnehmer der Symbiose hinzu — ein Werk, einen Versorger, eine Kommune.',
      step2: 'Ziehen Sie vom Rand eines Knotens zu einem anderen, um sie zu verbinden: dieser Pfeil ist eine Zeile der Flussmatrix.',
      step3: 'Wählen Sie einen Knoten oder einen Pfeil und füllen Sie die Felder im Seitenpanel aus. Angezeigt werden nur die Felder, die Ihre Konfiguration benötigt.',
      dismiss: 'Verstanden',
    },
    empty: {
      title: 'Noch nichts gezeichnet',
      body: 'Fügen Sie den ersten Akteur hinzu, oder laden Sie ein Beispiel mit drei Akteuren und zwei Flüssen, um den Aufbau eines Netzwerks zu sehen.',
    },
    example: {
      producer: 'Erzeugerwerk',
      consumer: 'Empfangendes Werk',
      facilitator: 'Betreiber des Industrieparks',
      flow: 'Beispielfluss',
    },
    title: 'Netzwerk-Editor',
    subtitle:
      'Zeichnen Sie das Symbiose-Netzwerk: jeder Knoten ist ein Akteur, jeder Pfeil eine Zeile der Flussmatrix. Was Sie hier zeichnen, landet in der Excel-Datei und im Bericht.',
    addActor: 'Akteur hinzufügen',
    actor: 'Akteur',
    noRole: 'Rolle nicht gesetzt',
    save: 'Netzwerk speichern',
    saving: 'Wird gespeichert…',
    synced: 'Auf dem Server gespeichert',
    unsavedChanges: 'Nicht gespeicherte Änderungen',
    unsavedCase: 'Lokaler Entwurf — Fall speichern zum Synchronisieren',
    saveCaseFirst:
      'Dieser Fall ist noch nicht auf dem Server gespeichert. Sie können das Netzwerk jetzt zeichnen; speichern Sie den Fall auf der Ergebnisseite, um es zu sichern.',
    missingRequired_one: '{{count}} Pflichtfeld noch leer',
    missingRequired_other: '{{count}} Pflichtfelder noch leer',
    selectHint:
      'Wählen Sie einen Akteur oder einen Fluss, um dessen Felder zu bearbeiten.',
    removeRow: 'Entfernen',
    unwiredTitle: 'Noch nicht gezeichnete Flüsse',
    unwiredHint:
      'Diese Flüsse stammen aus Ihren Q5-Antworten. Verbinden Sie zwei Akteure auf der Arbeitsfläche, um den nächsten anzuschließen.',
  },

  cases: {
    navLink: 'Meine Fälle',
    title: 'Meine Fälle',
    intro: 'Auf dem Server gespeicherte Fälle. Laden, um den Fragebogen zu befüllen, oder löschen, um endgültig zu entfernen.',
    empty: 'Noch keine gespeicherten Fälle. Speichern Sie einen Fall aus dem Fragebogen oder der Ergebnisseite.',
    columns: {
      name: 'Name',
      situation: 'ILCD-Situation',
      updated: 'Aktualisiert',
    },
    loadButton: 'Laden',
    deleteButton: 'Löschen',
    confirmDelete: '"{{name}}" endgültig löschen? Dies kann nicht rückgängig gemacht werden.',
    saveButton: 'Fall speichern',
    saveAsButton: 'Als neu speichern…',
    saveTitle: 'Fall speichern',
    namePlaceholder: 'Name meines Falls',
    saveDialog: 'Aktuellen Fall auf dem Server speichern. Wählen Sie einen Namen zur späteren Identifikation.',
    saving: 'Speichern…',
    saveError: 'Speichern fehlgeschlagen — {{detail}}',
    saveSuccess: 'Gespeichert als "{{name}}"',
    loadError: 'Laden fehlgeschlagen — {{detail}}',
    deleteError: 'Löschen fehlgeschlagen — {{detail}}',
  },
}

export default de
