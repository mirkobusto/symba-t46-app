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
    confirm: 'Weiter',
    save: 'Speichern',
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
    lead: 'Senden Sie eine dieser URLs an einen Stakeholder. Gleicher Fall, unterschiedliche Rahmung pro Zielgruppe. Für ein Produktetikett teilen Sie den End-user-Link.',
    close: 'Schließen', done: 'Fertig', copy: 'Kopieren', copied: 'Kopiert ✓',
    copyFailed: 'Kopieren nicht möglich — bitte manuell kopieren.',
    saveFirstTitle: 'Fall zuerst speichern',
    saveFirstBody: 'Zum Teilen muss der Fall auf dem Server gespeichert sein, und zum Speichern braucht es ein Konto. Melden Sie sich an, speichern Sie den Fall mit „Als neu speichern…“ und öffnen Sie dieses Fenster erneut.',
    audience: { industry: '🏭 Industrie', community: '🌳 Gemeinschaft', authority: '🏛 Lokale Behörde', enduser: '👤 Endnutzer' },
    publicToggle: 'Diesen Bericht für alle mit dem Link lesbar machen',
    preparedByLabel: 'Erstellt von (im Bericht angezeigt)',
    contactLabel: 'Kontakt für Fragen zu diesem Fall (optional)',
    saveSharing: 'Name und Kontakt speichern',
    notSharedBody: 'Der Bericht ist nicht öffentlich: Nur Sie können diesen Fall öffnen. Schalten Sie das Teilen ein, um die Links zu erhalten.',
    sharedBody: 'Der Bericht ist öffentlich: Wer einen dieser Links hat, kann ihn lesen, ohne die Notizen und Mengen der Flüsse.',
    signInButton: 'Anmelden, um zu speichern und zu teilen',
  },

  reader: {
    tagline: 'Öffentlicher Bericht',
    // plain titles for the public views (decided by Fable, UX round 2026-11-03)
    verdict: {
      A: { title: 'Ein lokaler Austausch, bewertet mit Durchschnittsdaten', body: 'Der Austausch ist klein im Vergleich zur Wirtschaft insgesamt: Die Studie beschreibt, was er ersetzt, mit durchschnittlichen Marktdaten (dem nationalen Strommix, dem durchschnittlichen Primärmaterial). Das sagt nichts darüber, wie groß seine Wirkungen auf die Anlagen oder die Region sind: Die misst die Studie.' },
      B: { title: 'Eine Entscheidung im großen Maßstab, bewertet mit den Marktveränderungen, die sie auslöst', body: 'Die Entscheidung ist groß genug, um zu verändern, was die Wirtschaft baut oder stilllegt: Die Studie modelliert diese Veränderungen statt Durchschnittsdaten zu verwenden.' },
      C1: { title: 'Ein bestehendes Netzwerk, beschrieben, wie es läuft', body: 'Es wird keine Entscheidung getroffen: Die Studie dokumentiert, was das Netzwerk bereits leistet, verglichen mit dem, was jedes Unternehmen ohne es täte.' },
      C2: { title: 'Die eigene Bilanz eines Unternehmens', body: 'Die Studie berichtet den Lastenanteil eines einzelnen Unternehmens, ohne Gutschrift für das, was sein Austausch anderswo einspart.' },
    },
    labelLine: 'Kommt dieser Link von einem Produktetikett? Diese Seite beschreibt, wie der Austausch zwischen den Unternehmen untersucht wird. Über das Produkt, das Sie gekauft haben, sagt sie noch nichts.',
    loading: 'Lade Bericht…',
    notFoundTitle: 'Bericht nicht gefunden',
    notFoundBody: 'Zu diesem Code gibt es keinen Bericht. Prüfen Sie, ob Sie den ganzen Link kopiert haben, oder bitten Sie die Person, die ihn geschickt hat, erneut darum.',
    tryAnother: 'Anderen Link oder Code versuchen',
    aboutLink: 'SYMBA kennenlernen',
    open: {
      eyebrow: "Geteilter Bericht",
      title: "Einen erhaltenen Bericht öffnen",
      lead: 'Fügen Sie den Link ein, den Sie bekommen haben, oder nur den Fallcode an seinem Ende (ein Code wie agri-b-sita-1a2b3c4d).',
      label: "Link oder Fallcode",
      placeholder: "https://…/r/…",
      invalid: "Das sieht nicht wie ein Berichtslink aus. Fügen Sie den ganzen Link ein oder den Code nach /r/.",
      submit: "Bericht öffnen",
      noLink: "Kein Link? Fragen Sie, wer Ihnen von dem Fall erzählt hat. Was SYMBA ist:",
    },
    eyebrow: 'Geteilter Bericht · {{name}}',
    summaryTitle: "Wie die Bewertung durchgeführt wird",
    scoringTitle: "Ergebnisse",
    complianceTitle: 'Compliance-Signale',
    whatTitle: "Was diese Seite ist",
    whatBody: "Wie dieser Fall industrieller Symbiose zu bewerten ist: welche methodischen Entscheidungen gelten und welche Daten zu erheben sind. Sie enthält noch keine Ergebnisse (keine Emissionen, Kosten oder sozialen Kennzahlen) und ist keine Zertifizierung eines Unternehmens oder Produkts. Die Zahlen berechnet separat, wer die Studie durchführt.",
    caseTitle: "Der Fall",
    running: { yes: "Diese Austausche finden bereits statt.", no: "Diese Austausche sind geplant oder laufen gerade an." },
    market: "Referenzmarkt: {{market}}",
    updated: "Gespeichert am {{date}}",
    methodEyebrow: "Wie bewertet wird",
    sectorTag: "Sektor: {{sector}}",
    scaleTag: "Interaktionen: {{scale}}",
    compliance: {
      peer: { name: "Unabhängige Begutachtung", desc: "Ein Gutachter prüft die Studie nach ISO 14044, wie bei einer wissenschaftlichen Veröffentlichung." },
      pef: { name: "EU-Produktumweltfußabdruck (PEF)", desc: "Die Studie folgt der EU-Fußabdruckmethode einschließlich der Circular Footprint Formula.", descC2: "Nicht anwendbar: die Bilanz eines einzelnen Unternehmens nutzt Allokation, nicht die Circular Footprint Formula (ILCD C2).", descB: 'Als Sensitivitätsanalyse durchgeführt: Situation B wird konsequenziell modelliert.' },
      public: { name: 'Zur Veröffentlichung bestimmte vergleichende Aussage', desc: "Öffentlich zu behaupten, ein Produkt sei besser als oder gleichwertig mit einem anderen, erfordert ein ISO-Prüfgremium." },
      dnsh: { name: "EU-Taxonomie „keine erhebliche Beeinträchtigung“ (DNSH)", desc: "Eine eigene Prüfung für Finanzierungen nach der EU-Taxonomie (Art. 17); dieses Tool führt sie nicht durch." },
      slcc: { name: 'Für eine öffentliche Entscheidung angelegt (gesellschaftliche LCC)', yes: 'Ja: Die Kostenrechnung enthält die gesellschaftliche Sicht, die eine öffentliche Entscheidung braucht (Steuern und Subventionen bereinigt, Umweltwirkungen bewertet) — D4.2 §2.3.', no: 'Nein: Die Kostenrechnung bleibt auf Ebene von Unternehmen und Wertschöpfungskette. Soll eine öffentliche Stelle über diesen Fall entscheiden, bitten Sie den Analysten, die Studie für ein öffentliches Ziel anzulegen.', c2: 'Nicht zutreffend: Die Bilanz eines einzelnen Unternehmens wird nur auf Unternehmensebene gerechnet.', off: 'Nicht bewertet: Die Studie hat keine ökonomische Dimension.' },
      notPlanned: "in dieser Studie nicht vorgesehen",
      notAssessed: "von diesem Tool nicht bewertet",
    },
    audience: {
      showingFor: 'Ansicht für — {{name}}',
      industry: { short: '🏭 Industrie', name: 'Industrie', title: 'Betreiberansicht', body: 'Vollständige technische Übersicht.' },
      community: { short: '🌳 Gemeinschaft', name: 'Gemeinschaft', title: 'Lokale Auswirkungen', body: 'Wie die Wirkungen auf die Gegend und auf die Menschen in der Nähe der Anlagen untersucht werden: Transporte, lokale Luft, Wasser und Boden, was auf Felder ausgebracht wird, ob Anwohner gehört werden. Es gibt noch keine Ergebnisse.' },
      authority: { short: '🏛 Behörde', name: 'Lokale Behörde', title: 'Regulatorische Ansicht', body: "Wie die Bewertung angelegt ist: Kosten, gemeinsame Anlagen, Referenzszenario, öffentliche Aussagen, Zeithorizont, soziale Wirkungen." },
      enduser: { short: '👤 Endnutzer', name: 'Endnutzer', title: 'Zusammenfassung', body: "Worum es in diesem Fall geht und was bewertet wird. Ergebnisse gibt es noch nicht." },
    },
    note: "Jeder Reiter zeigt denselben Fall aus einem anderen Blickwinkel; die Fakten sind in allen vier gleich.",
    about: {
      isTitle: "Was ist industrielle Symbiose?",
      isBody: "Wenn die Reste eines Unternehmens (Molke, Sägemehl, Wärme, Wasser) zum Rohstoff eines anderen werden, statt weggeworfen zu werden.",
      eyebrow: 'Über SYMBA T4.6', title: 'Öffentliche Berichte', lead: 'Jemand hat einen Fall mit Ihnen geteilt.',
      whoTitle: 'Wer steckt dahinter?', whoBody: "SYMBA ist ein von der Europäischen Union gefördertes Forschungsprojekt (Horizon Europe, Finanzhilfevereinbarung 101135562), das offene Werkzeuge für industrielle Symbiose in der biobasierten Industrie entwickelt. Dieses Tool wurde von ENCO mit CIRCE und CET entwickelt; es gehört keinem der Unternehmen, deren Fälle es beschreibt.",
      whatTitle: 'Was ist ein Bericht?', whatBody: "Ein geteilter Bericht beschreibt, wie ein Fall industrieller Symbiose zu bewerten ist: welche Austausche zwischen Unternehmen er umfasst und welche methodischen Entscheidungen für seine ökologische, ökonomische und soziale Bewertung gelten. Die vier Reiter erzählen denselben Fall vier Arten von Lesern.",
      whereTitle: 'Mehr erfahren?', whereBody: 'Besuchen Sie die Projekt-Website',
      enterTool: 'Zum Tool',
      backToReport: "Zurück zum Bericht",
    },
    region: {
      eyebrow: 'Region · {{code}}', title: 'Regionales Dashboard', lead: 'Aggregierte Ansicht.', total: 'Fälle', situations: 'ILCD-Situationen', sectors: 'Sektoren',
      bySituationTitle: 'Nach ILCD-Situation', bySectorTitle: 'Nach Sektor', tableKey: 'Wert', tableCount: 'Anzahl',
      errorTitle: 'Region nicht verfügbar', errorBody: 'Daten konnten nicht geladen werden.',
    },
    preparedBy: 'Erstellt von {{name}} — Antworten vom Autor des Falls eingegeben, nicht von SYMBA geprüft.',
    contact: 'Für Fragen zu diesem Fall: {{contact}}',
    noContact: 'Für Fragen zu diesem Fall wenden Sie sich an die Person, die Ihnen den Link geschickt hat. SYMBA hat das Tool gebaut; es führt diese Studie nicht durch.',
    whatYouCanDo: 'Diese Studie wird noch vorbereitet. Wenn Anwohner gehört werden sollen (Interviews, Fragebögen) oder wenn Verkehr, Gerüche oder das Ausbringen auf Felder Sie beunruhigen, schreiben Sie an die Person, die sie vorbereitet hat: {{contact}}. Die Ergebnisse erscheinen, sobald sie geladen sind, auf dieser Seite unter demselben Link.',
    whatYouCanDoTitle: 'Was Sie tun können',
    dataRequestTitle: 'Wenn Daten von Ihnen verlangt werden',
    dataRequest: 'Wer die Studie durchführt, schickt jedem Unternehmen eine Excel-Arbeitsmappe, das Data Collection File: Ihre Zeilen sind die Flüsse, die Ihr Unternehmen abgibt oder aufnimmt (Mengen, Transport, Kosten, beteiligte Anlagen). Füllen Sie sie aus und senden Sie sie an {{contact}} zurück. Nur wer die Studie durchführt, erstellt und ändert sie; sie wird nicht auf dieser Seite ausgefüllt.',
    dataRequestNoContact: 'Wer die Studie durchführt, schickt jedem Unternehmen eine Excel-Arbeitsmappe, das Data Collection File: Ihre Zeilen sind die Flüsse, die Ihr Unternehmen abgibt oder aufnimmt (Mengen, Transport, Kosten, beteiligte Anlagen). Füllen Sie sie aus und senden Sie sie an die Person zurück, die sie Ihnen geschickt hat. Nur wer die Studie durchführt, erstellt und ändert sie; sie wird nicht auf dieser Seite ausgefüllt.',
  },

  welcome: {
    title: "Willkommen bei SYMBA",
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
      assess: { name: 'Neue Bewertung starten', desc: 'Methodik für einen IS-Fall mit einem kurzen Fragebogen konfigurieren.' },
      read: { name: 'Geteilten Bericht lesen', desc: 'Einen mit mir geteilten Fall öffnen und den Bericht sehen.' },
      explore: { name: 'Region / Sektor erkunden', desc: "Sehen Sie, wie sich die gespeicherten Fälle auf Methoden und Sektoren verteilen." },
      browse: { name: 'Nur umschauen', desc: 'Kein bestimmtes Ziel — ich möchte sehen, was das Tool tut.' },
    },
  },

  adminShell: {
    menuOpen: "Menü",
    menuClose: "Schließen",
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
    intro: {
      what: { title: "Was es tut", body: "Es sagt Ihnen, wie die Bewertung eines Austauschs industrieller Symbiose nach den SYMBA-Leitlinien anzulegen ist und welche Daten bei den beteiligten Unternehmen zu erheben sind." },
      not: { title: "Was es nicht tut", body: "Es berechnet keine Ergebnisse: keine Emissionen, Kosten oder sozialen Kennzahlen. Diese berechnet, wer die Studie durchführt, mit den Daten, die das Tool erfragt." },
      who: { title: "Für wen", body: "Nachhaltigkeitsanalysten und Berater legen hier ihre Studien an; Unternehmen, Behörden und Verbände lesen die Berichte und sehen, welche Daten von ihnen erfragt werden." },
    },
    title: "SYMBA — industrielle Symbiose bewerten",
    tagline: "Wie man die ökologische, ökonomische und soziale Bewertung eines Austauschs zwischen Unternehmen anlegt, und welche Daten zu erheben sind.",
    description: "Beantworten Sie Fragen zu Ihrem Fall: Abfall, Nebenprodukt, Wärme oder Wasser eines Unternehmens werden zum Rohstoff eines anderen. Sie erhalten die methodische Konfiguration, der die Studie folgen muss, und ein Data Collection File für die Partner.",
    startButton: 'Neue Bewertung starten',
    modeLabel: "Wie Sie antworten möchten",
    modeExpert: 'Experte',
    modeGuided: 'Geführt',
    modeHint: {
      expert: 'Schneller Fragebogen für IS-Analysten und Prüfer, die mit der ILCD / LCSA-Terminologie vertraut sind.',
      guided: 'Schritt-für-Schritt-Modus für Industrielle, Gemeindevertreter und politische Entscheidungsträger. Jede Frage hat eine Erklärung in einfachen Worten; die vollständige methodische Anmerkung bleibt einen Klick entfernt.',
    },
    hero: { title: 'Neue IS-Bewertung starten' },
    openCasesLink: 'Oder gespeicherten Fall öffnen',
    presetsTitle: "Veröffentlichte Beispiele",
    presetsMeta: "13 Fälle aus begutachteten Fachartikeln",
  },

  // DRAFT: English until the notice has been through legal review and is translated.
  docxReport: {
    title: "Fallbericht",
    intro: "Erzeugt vom SYMBA-Tool. Er hält die Antworten fest, die daraus abgeleitete Konfiguration und was die Studie dokumentieren muss: derselbe Inhalt wie die Ergebnisseite.",
    verdict: "Ergebnis",
    meaning: "Was diese Konfiguration bedeutet",
    next: "Was jetzt zu tun ist",
    nextNone: "Für diese Antworten gilt keine methodische Verpflichtung, und es wurde kein kritischer Entscheidungspunkt aufgeworfen. Nächster Schritt: die Daten erheben (siehe Data Collection File).",
    whyHere: "Warum sie hier gilt:",
    toDocument: "Was zu dokumentieren ist:",
    answers: "1. Die Antworten",
    config: "2. Die vom Tool abgeleitete Konfiguration",
    situation: "ILCD-Situation",
    lccType: "LCC-Typ",
    slca: "Soziale Bewertung (S-LCA)",
    nodes: "Aktivierte Knoten",
    blocks: "Blockaden",
    obligations: "Zu dokumentierende Verpflichtungen",
    cdps: "Kritische Entscheidungspunkte",
    none: "(keine)",
    notSet: "(nicht beantwortet)",
    notes: "Anmerkungen zu den Antworten",
    sectorRules: "Sektorregeln (D4.1 Part 2)",
    appliesBecause: "gilt wegen",
    flow: "Fluss",
    caseSector: "der Sektor des Falls (Q6a)",
    pillars: "Ausgabe der Engine, Schlüssel für Schlüssel (Englisch, wie in den Deliverables verankert)",
    noPillars: "(keine Werte geschrieben)",
    summary: "3. Zusammenfassung",
    blocked: "Blockiert: die Antworten lösen die oben genannten Blockaden aus; überarbeiten Sie sie.",
    complete: "Konfiguration vollständig: {{obligations}} zu dokumentierende Verpflichtungen und {{cdps}} zu klärende kritische Entscheidungspunkte, oben aufgeführt.",
    appendix: "4. Anhang: aktivierte Knoten",
    countsByPrefix: "Anzahl nach Präfix",
    scenarios: "Definierte alternative Szenarien",
    advanced: "Erweiterte Einstellungen",
    q: {
      q0: "Q0 Art der Studie",
      q1: "Q1 was Sie untersuchen",
      q2: "Q2 die Austausche finden bereits statt",
      q2b: "Q2b langjähriges Netz",
      q3: "Q3 Dimensionen",
      q4: "Q4 Nutzung der Ergebnisse",
      q5: "Q5 wer wen bezahlt, je Fluss",
      q5extra: "Je Fluss: an Dritte verkaufbar / Sektor Part 2",
      q6a: "Q6a Sektor",
      q6b: "Q6b Technologiereife",
      q7: "Q7 Konzentration der Schlüsselinteraktionen",
      q7b: "Q7b Referenzmarkt",
      q8a: "Q8a Betriebsjahr",
      q8b: "Q8b Analysezeitraum (Jahre)",
      q8c: "Q8c Lebensdauer der Anlagen (Jahre)",
      q9: "Q9 Entscheidung und Ausmaß",
      q9b: "Q9b Marktscreening dokumentiert",
      q10: "Q10 öffentliches Ziel",
      q11: "Q11 was die Studie vergleicht",
      q12: "Q12 eigens gebaute, gemeinsame Anlagen",
    },
  },
  privacy: {
    "title": "Privacy and data storage",
    "draft": "DRAFT for legal review — not yet the privacy notice of record. Items in [square brackets] are for the controller of this deployment to complete.",
    "updated": "Version: draft 2, 2026-11-03.",
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
          "Hosting provider: [PLACEHOLDER]. A saved case is not public: its report can be read at a link of the form /r/… only after its owner turns sharing on in the Share dialog, and stops being readable when sharing is turned off. While shared, anyone who has the link can read the report: the answers and the names of the flows, without flow notes, quantities, sites or scenarios. The name and the contact written in \"Prepared by\" and \"Contact for this case\" are published on the report by the user's choice; leave them empty to publish neither. Saving a case on the server requires an account; each saved case can be read and changed only by its owner and by the administrator (the first account registered), who can read and change every case: do not enter personal data of third parties."
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
    whoTitle: "Wer es gemacht hat",
    whoBody: "Das Tool wurde von ENCO mit CIRCE und CET als Task T4.6 von SYMBA entwickelt, einem vom Programm Horizon Europe der Europäischen Union geförderten Projekt (Finanzhilfevereinbarung 101135562). Es gehört keinem der Unternehmen, deren Fälle es bewertet.",
    sourcesTitle: "Worauf es beruht",
    sourcesBody: "Fragen, Regeln und Datenanforderungen folgen den methodischen Deliverables von Arbeitspaket 4 von SYMBA: D4.1 (Ökobilanz industrieller Symbiose, mit ihren Sektorkapiteln), D4.2 (Lebenszykluskosten) und D4.3 (soziale Ökobilanz). Jede Zeile des Ergebnisses nennt den Abschnitt, aus dem sie stammt.",
    notTitle: "Was es nicht tut",
    notBody: "Es berechnet keine ökologischen, ökonomischen oder sozialen Ergebnisse (keine kg CO2eq, keinen Kapitalwert, keine sozialen Indikatoren): Es sagt, wie die Studie anzulegen ist und welche Daten zu erheben sind. Die Zahlen berechnet, wer die Studie durchführt, mit eigener Software für Ökobilanz und Kostenrechnung.",
    divergencesTitle: "Wo es bewusst von den Deliverables abweicht",
    divergencesLead: "Einige Entscheidungen sind die des Tools, hier genannt, damit ein Gutachter sie sieht:",
    divergences: {
      c2: "Die Bilanz eines einzelnen Unternehmens (ILCD-Situation C2) wird nur auf Unternehmensebene gerechnet: eine Entscheidung des Tools, keine Regel von D4.2.",
      situation: 'Eine Studie über ein bestehendes Netzwerk, die eine Option dafür bewertet (eine Verbesserung, eine Erweiterung), gilt als Situation A; eine, die das Netzwerk nur dokumentiert, als Situation C1 (T4.6-Lesart von Tabelle 1 und §4.3.2 der D4.1).',
      uncertainty: 'Die Pedigree-Matrix ist verpflichtend, wenn die Ergebnisse an ein Review-Panel, an die Ausrichtung auf EU-Politiken oder in eine Veröffentlichung gehen (Q4 = C, D oder E), sonst empfohlen, und sie wird für Ökobilanz und LCC aktiviert, wenn der Austausch noch nicht stattfindet (Q2 = B, Regel CIR-02); Monte Carlo wird für die Ökobilanz unter eigenen Bedingungen verlangt (Q4 = C, D oder E oder Technologie unter TRL 9) und für die Kostenrechnung immer. D4.1 §13.3.2 und D4.2 §7.1, §10.3 verlangen beides in jeder Studie.',
      policy: "Die Ausrichtung an EU-Politik (Q4 = D) bringt CE-Delft-Preise und die Allokation nach Net Tax Factor, die D4.2 an das gesellschaftliche LCC knüpft.",
      assets: 'Q12 zählt die für den Austausch gebauten Anlagen, heute oder vor Jahren, auch wenn nur ein Unternehmen sie nutzt (D4.1 §6.3.3: dem Symbiose-Szenario eigen), wo D4.2 §4.2 von neuen, gemeinsam genutzten spricht.',
      interdependent: 'Für einen interdependenten Fluss (Q5 = d) nennt D4.2 §6.2 einen Allokationsschlüssel in der E-LCC, während D4.1 §8.3.6 von der Substitution ausgeht; das Tool lässt die E-LCC der Ökobilanz folgen (D4.2 §6.3) und weist auf den Unterschied hin.',
      lccB: 'In Situation B ist die Ökobilanz konsequenziell, und die Circular Footprint Formula des PEF läuft, wenn verlangt (Q4 = D), als Sensitivitätsanalyse; kein Knoten der Kostenrechnung hat bisher eine konsequenzielle Fassung, daher folgt die LCC ihrem Typ (D4.2 §2.2 verlangt ein Paradigma je Studie).',
    },
    contactTitle: "Kontakt",
    contactBody: "Für Fragen zum Tool oder zum Projekt schreiben Sie über die Kontaktseite der SYMBA-Website:",
    technicalTitle: "Technische Details (für Fachleute)",
    title: 'Über',
    p1:
      'SYMBA T4.6 unterstützt alle, die eine Lebenszyklus-Nachhaltigkeitsbewertung einer industriellen Symbiose aufsetzen: aus einem Fragebogen zum Fall leitet es ab, welche Methodik gilt, welche Praktiken zu dokumentieren sind und welche Daten bei den Netzwerkpartnern zu erheben sind. Es berechnet die Ergebnisse nicht — die Zahlen berechnet außerhalb des Werkzeugs, wer die Studie durchführt, und sie können hier geladen werden; niemand berechnet sie automatisch.',
    p2:
      'Der Fragebogen (Q0-Q12; Q9 bestimmt die ILCD-Situation, Q10 die gesellschaftliche LCC) steuert die Aktivierung der 186 Phase-1-Knoten plus 40 Cross-Method-Validierungsregeln (18 IR + 10 CIR + 5 FU + 7 B). Die L3-Durchsetzung zur Reporting-Zeit (IR-04 + IR-10) plus 11 Critical Decision Points machen Cross-Method-Spannungen sichtbar.',
  },

  error: {
    title: 'Etwas ist schiefgelaufen',
    backHome: 'Zurück zur Startseite',
    fallback: 'Unerwarteter Fehler',
  },

  questionnaire: {
    parts: {
      study: 'Die Studie',
      exchanges: 'Die Austausche',
      description: 'Beschreibung des Falls',
    },
    scopeNote: "Dieses Werkzeug berechnet keine Ökobilanz-/LCC-/S-LCA-Zahlen. Es leitet die methodische Konfiguration Ihres Falls und die zu erhebenden Daten ab; das quantitative Scoring entsteht extern und erscheint hier, sobald es vorliegt.",
    title: 'Fragebogen',
    guidedBannerTitle: 'Geführter Modus aktiv',
    guidedBannerBody:
      "Jede Frage beginnt mit einer kurzen Erklärung in einfachen Worten. Die vollständige methodische Anmerkung, im Wortlaut der Projekt-Deliverables, bleibt unter jeder Frage einen Klick entfernt. Die Antworten bestimmen die methodische Konfiguration und den Datenerhebungsplan, den Sie am Ende erhalten.",
    intro:
      'Fragen zu Ihrem Fall industrieller Symbiose, in drei Teilen: die Studie, die Austausche und eine Beschreibung des Falls. Pflicht: die Dimensionen (Q3), die Entscheidung und ihr Ausmaß (Q9), der Gegenstand (Q1) und, mit der ökonomischen Dimension, das öffentliche Ziel (Q10); der Rest ist optional und schärft die Konfiguration.',
    introPlain: "Fragen zu Ihrem Austausch zwischen Unternehmen, in drei Teilen. Die mit * sind Pflicht; die anderen machen das Ergebnis genauer. Unter jeder Frage finden Sie eine kurze Erklärung in einfachen Worten.",
    runButton: 'Konfiguration ermitteln',
    runningButton: 'Wird berechnet…',
    resetButton: 'Entwurf zurücksetzen',
    confirmReset: 'Alle Antworten verwerfen und neu beginnen? Dies kann nicht rückgängig gemacht werden.',
    stepper: {
      progress: "Frage {{n}} von {{total}} · {{part}}",
      back: "← Zurück",
      next: "Weiter →",
      showAll: "Alle Fragen auf einer Seite zeigen",
      showSteps: "Eine Frage nach der anderen",
      navLabel: "Fragen",
      totalChanges: 'Die Zahl der Fragen ändert sich mit Ihren Antworten.',
    },
    examplesLink: "Wie antwortet eine echte Studie? Ein veröffentlichtes Beispiel laden",
    stillRequired: "Noch offen:",
    flowsMissingQ5: "wer wen bezahlt, für jeden Fluss",
    shortcutTip: 'Tipp: Strg/⌘+Eingabe zum Ausführen',

    q0: {
      title: 'Q0 — Welche Art von Symbiose-Studie ist es: Analyse, Verbesserung, Erweiterung, Planung oder Umstrukturierung?',
      help: 'Optional. Die Art der Studie, wie D4.1 sie im Ziel anzugeben verlangt. Allein ändert sie nichts.',
      details: 'D4.1 §4.3.2 verlangt im Anschluss an Mattila et al. (2012), das Ziel nach einem etablierten Rahmen einzuordnen. Analyse bewertet ein bestehendes Netzwerk, um seine Leistung zu verstehen; Verbesserung ermittelt Hotspots in einem bestehenden Netzwerk, um es zu optimieren; Erweiterung bewertet die Wirkungen eines neuen Partners oder Austauschs; Planung vergleicht technische und logistische Optionen für ein neues, geplantes Netzwerk; Umstrukturierung bewertet eine größere Neuordnung eines etablierten Netzwerks. Die Antwort geht in den Bericht und das Data Collection File; wie die Studie modelliert wird, entscheiden weiterhin die folgenden Fragen. Die Engine meldet nur zwei Widersprüche: eine Analyse, deren Austausche noch nicht stattfinden, und eine Planung, deren Austausche bereits stattfinden (Q2).',
      options: {
        unset: { label: 'Keine Antwort' },
        analysis: { label: 'Analyse', description: 'Ein bestehendes Netzwerk bewerten, um seine Leistung zu verstehen.' },
        improvement: { label: 'Verbesserung', description: 'Die Hotspots eines bestehenden Netzwerks finden, um es zu optimieren.' },
        expansion: { label: 'Erweiterung', description: 'Die Wirkungen eines neuen Partners oder Austauschs bewerten.' },
        design: { label: 'Planung', description: 'Technische und logistische Optionen für ein neues, geplantes Netzwerk vergleichen.' },
        restructuring: { label: 'Umstrukturierung', description: 'Eine größere Neuordnung eines etablierten Netzwerks bewerten.' },
      },
      plain:
        'Wählen Sie die Art der Studie: verstehen, wie ein bestehendes Netzwerk arbeitet, finden, wo es besser werden kann, einen Partner oder Austausch hinzufügen, ein neues Netzwerk planen oder ein etabliertes neu denken. Die Antwort wird mit der Studie festgehalten; allein ändert sie die Methode nicht.',
    },

    q1: {
      title: 'Q1 — Was analysieren Sie? *',
      help:
        'Wählen Sie die nächstliegende Option: Entscheidend ist der Gegenstand der Studie, nicht der Auftraggeber. Sie beschreibt das System und seine Grenze; wie die Studie modelliert wird, ergibt sich aus Q9 und den folgenden Fragen. (Pflichtfeld.)',
      details:
        'A — bilateraler Austausch (z. B. Abwärme von Werk X zu Werk Y, oder Gips als Nebenprodukt von Kraftwerk zu Zementwerk). Subjekt ist der GETEILTE FLUSS zwischen zwei Unternehmen. ' +
        'B — Öko-Industriepark oder symbiotisches Netzwerk mit 3+ Akteuren (z. B. Kalundborg, NISP-Cluster, Industriepark-Masterplan). Subjekt ist das NETZWERK als System. ' +
        'C — politische oder programmatische Entscheidung auf regionaler/nationaler Ebene (z. B. ein IS-Förderprogramm, ein Regulierungsrahmen, eine EU-Industriestrategie). Subjekt ist die ENTSCHEIDUNG/PROGRAMM, nicht eine spezifische Anlage. ' +
        'D — einzelnes Unternehmen quantifiziert seinen symbiotischen Beitrag für ESG / CSRD / Nachhaltigkeitsberichte (z. B. „Wir haben 12 kt Schlacke an Zementhersteller verkauft, hier ist unsere Gutschrift"). Subjekt ist EIN UNTERNEHMEN. ' +
        'E — periodisches Monitoring einer bereits operativen Symbiose (jährliche KPI-Updates, Post-Implementation-Überwachung). Subjekt ist die ZEITREIHE, nicht eine einmalige Studie.',
      options: {
        A: { label: 'A. Spezifischer Austausch', description: "Ein symbiotischer Austausch zwischen zwei Unternehmen, für sich betrachtet, bestehend oder geplant." },
        B: { label: 'B. Eco-park / Netzwerk', description: "Ein Öko-Industriepark oder ein symbiotisches Multi-Akteurs-Netzwerk, oder ein Unternehmen, das zwei oder mehr Partner beliefert." },
        C: { label: 'C. Politik / Programm', description: 'Eine Politik- oder Programmentscheidung auf regionaler oder nationaler Ebene.' },
        D: { label: 'D. Unternehmensbericht', description: 'Der symbiotische Beitrag eines einzelnen Unternehmens für ESG/CSRD-Reporting.' },
        E: { label: 'E. Monitoring', description: 'Zeitliches Monitoring einer bereits operativen Symbiose.' },
      },
      plain:
        'Sagen Sie, was Sie untersuchen: einen Austausch, einen Park, ein Programm, ein Unternehmen, eine Symbiose, die Sie über die Zeit verfolgen. Die Antwort beschreibt das System und seine Grenze; wie die Studie modelliert wird, entscheiden die folgenden Fragen, beginnend mit dem Zweck der Studie. Wenn Sie zwischen zwei Optionen schwanken, nehmen Sie diejenige, die beschreibt, wessen Wirkungen Sie messen wollen. Ein Unternehmen, das zwei oder mehr Partner beliefert, zählt als Netzwerk (B).',
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
        label: "Läuft das Netz schon so lange, dass die Alternativen, die es ersetzt hat (z. B. die Kessel, die die Fernwärme sonst nutzen würde), heute nicht mehr gebaut würden?",
        yes: 'Ja — die Referenz ist ein modernes Kontrafaktum: Die Situation vor der Symbiose ist ausgeschlossen (D4.1 §11.2.2)',
        no: 'Nein — das Netzwerk ist jung',
        unknown: 'Weiß nicht — die Situation vor der Symbiose bleibt zulässig, wenn sie heute noch das wäre, was jedes Unternehmen vernünftigerweise täte',
      },
      plain:
        'Denken Sie an die Austausche, nicht an die Anlagen. Finden die Flüsse zwischen den Unternehmen bereits statt, können Sie sie messen. Sind sie noch eine Idee, auch zwischen bereits laufenden Anlagen, können Sie sie nur schätzen. Sie möchten Alternativen vergleichen, etwa eine Erweiterung oder eine neue Technologie? Sie werden im Expertenmodus als Szenarien am Ende des Fragebogens hinzugefügt, unabhängig von Ihrer Antwort hier.',
    },

    q3: {
      title: 'Q3 — Welche Nachhaltigkeitsdimensionen einbeziehen? *',
      help: 'Mindestens eine ist erforderlich. Umwelt und Ökonomie sind die übliche Paarung.',
      details:
        'ENV — Umwelt-Lebenszyklusanalyse (LCA): Auswirkungen auf Klima, Ökosysteme, Ressourcennutzung. Fast immer ausgewählt. ' +
        'ECO — ökonomische Dimension, bewertet mit Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) ist eine Technik innerhalb des LCC, keine Alternative dazu; CBA und TEA bietet dieses Tool nicht an. ' +
        'SOC — S-LCA. Die Auswahl fügt die sozialen Regeln hinzu (Stakeholder-Kategorien: Beschäftigte, lokale Gemeinschaft, Wertschöpfungskette). ' +
        'Die meisten veröffentlichten IS-Papers laufen nur mit ENV (z. B. Sokka, Daddi); einige koppeln ENV+ECO (Hashimoto, Wiktor); nur eine Handvoll fügt SOC hinzu.',
      warning: 'Mindestens eine Dimension auswählen, um fortzufahren.',
      env: 'Umwelt (LCA)',
      eco: 'Ökonomisch (LCC)',
      soc: 'Sozial (S-LCA)',
      plain:
        "Drei getrennte Bewertungen, jede mit eigener Methode und eigenen Daten: ökologisch, wirtschaftlich — Kosten über den ganzen Lebensweg, keine Kosten-Nutzen-Analyse — und sozial. Wählen Sie die, die Sie abliefern wollen. Die meisten veröffentlichten Studien machen nur die ökologische, und die ökonomische dazuzunehmen ist der übliche nächste Schritt; die soziale verlangt viel mehr Auskunft von den beteiligten Menschen, rechnen Sie also damit, sie einzuholen.",
    },

    q4: {
      title: "Q4 — Wie werden Sie die Ergebnisse nutzen und kommunizieren?",
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
        B: { label: 'B. Extern (ohne Vergleich mit anderen Produkten)', description: 'Externe Kommunikation ohne vergleichende Aussagen.' },
        C: {
          label: 'C. Zur Veröffentlichung bestimmte vergleichende Aussage',
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
        "Fügen Sie pro symbiotischem Hauptfluss eine Zeile hinzu und geben Sie an, wer wen bezahlt. Pflicht, wenn Sie einen Austausch, ein Netz oder ein einzelnes Unternehmen untersuchen (Q1 = A, B oder D); sonst optional.",
      details:
        'Wählen Sie für jeden Hauptstrom zwischen Akteuren (Wärme, CO₂, Schlacke, Abwasser, Wasserstoff…), wer wen bezahlt: ' +
        'a — A zahlt B für die Abnahme des Flusses (eine Annahmegebühr: negativer Marktwert, ein ABFALL für A, D4.1 §8.3.2). Zero-Burden gilt ab dem Punkt, an dem der Reststoff erstmals einen nicht negativen Wert erreicht, nicht am Werkstor. Zahlen heißt nicht unvermeidbar: D4.2 §6.2 verlangt zusätzlich den kausalen Vermeidbarkeitstest, je Fluss im Data Collection File erklärt. ' +
        'b — der Fluss wird KOSTENLOS abgegeben (unklarer Status): der ökonomische Werttest entscheidet, ob er Abfall oder Koppelprodukt ist, mit Sensitivitätsanalyse. ' +
        'c — B zahlt A für den Fluss (positiver Marktwert: ein KOPPELPRODUKT für A): Substitution des verdrängten Primärmaterials mit qualitätskorrigiertem Verhältnis. Die PEF-Circular-Footprint-Formel hängt nicht an Q5: Sie kommt aus Q4=D. Würde kein Dritter für den Fluss zahlen (Freedom-to-Act-Test, D4.1 §8.3.3), ist der Preis administrativ und der Fluss wird als Abfall modelliert. ' +
        'd — INTERDEPENDENTER Fluss: A hat seinen Prozess bewusst verändert (Qualität, Menge, Nachbehandlung), um B zu beliefern; ein Koppelprodukt unabhängig vom Preis, nie Zero-Burden. ' +
        'e — AGGREGIERT / Black-Box: Die Quelle liefert keine Details je Fluss (typisch für aggregierte Arbeiten wie Sokka 2011). Das ist eine Grenze der Quelle, keine Modellierungsentscheidung: D4.1 §8.3.1 verbietet eine einzige netzwerkweite Regel, daher fragt das Data Collection File die Klassifikation jedes benennbaren Flusses trotzdem ab. ' +
        'Q5 hält fest, wer wen bezahlt; die rechtlichen und wirtschaftlichen Tests (Freedom-to-Act, End-of-Waste, Nebenproduktklasse, Vermeidbarkeit, Zero-Burden-Punkt) werden je Fluss im Abschnitt Flow classification des Data Collection File erklärt. Bei Politikstudien mit Q1=C ist Q5 meist optional.',
      plain:
        'Für jede Sache, die zwischen den Unternehmen bewegt wird — Wärme, Wasser, Schlacke, CO₂ — lautet die Frage hier nur: wer zahlt wem? Der Absender zahlt, um sie loszuwerden, niemand zahlt, oder der Empfänger zahlt dafür. Hat der Absender seinen eigenen Prozess absichtlich geändert, um sie zu liefern, wählen Sie diese Option, was immer das Geld sagt. Allerdings für diesen Partner: Ein Trockner, gebaut, um den Fluss an beliebige Käufer zu verkaufen, ist keine Interdependenz — wählen Sie „der Empfänger zahlt“ und geben Sie ihn bei den eigens errichteten Anlagen an. Gibt Ihre Quelle nur eine Zahl für das ganze Netz, wählen Sie die letzte Option — jeder benennbare Fluss wird trotzdem abgefragt. Ob ein Fluss rechtlich Abfall ist, klärt später das Data Collection File.',
    },

    q6a: {
      title: 'Q6a — Sektor',
      help: 'Der Hauptsektor des Falls, als Beschreibung. Die Sektorregeln von D4.1 Part 2 folgen dem Sektor jedes ausgetauschten Flusses, der in der Flusstabelle angegeben wird.',
      details:
        'Der Sektor beschreibt den Fall und öffnet einige sektorspezifische Felder im Data Collection File; die Sektorregeln von D4.1 Part 2 folgen dem für jeden Fluss angegebenen Sektor, weil die Kapitel dem folgen, was ausgetauscht wird. Wählen Sie die nächste Übereinstimmung zum dominanten Sektor des Falls (Akteur mit größtem Beitrag in Masse/Energie/Wert). ' +
        'Beispiele: Zellstoff und Papier für Sokka 2011 (UPM Kymi); Zement / Bau für Hashimoto 2010 (Kawasaki); Textil / Leder für Daddi 2017 (Gerbereicluster); Abwasser / Schlamm / Biofactories für Wiktor 2018; Chemie / Düngemittel für Leiva 2025 Escombreras; Biobasierte Polymere für Briassoulis. ' +
        'Für gemischte Fälle Multi-Sektor verwenden.',
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
        other: "Sonstige",
        wastewater_biofactories: 'Abwasser / Schlämme / Biofactories (legacy)',
        agri_food: 'Agri-Food / Bioraffinerien (legacy)',
        process_industry: 'Prozessindustrie (legacy)',
      },
      plain:
        'Der Hauptsektor des Falls: die Tätigkeit des Unternehmens mit dem größten Anteil an Masse, Energie oder Wert. Er beschreibt den Fall; die Sektorregeln der Leitlinien folgen dem, was jeder Fluss ist, und das geben Sie in der Flusstabelle an. Erstreckt sich der Fall über mehrere Sektoren, wählen Sie Multi-Sektor.',
    },

    q6b: {
      title: 'Q6b — Technologiereife (TRL)',
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
      title: 'Q7 — Wie konzentriert sind die wichtigsten Wechselwirkungen?',
      help: 'Sie bestimmt, wie die Wirkungsabschätzung regionalisiert wird. Der Transport wird für jeden Austausch explizit modelliert, unabhängig von der Antwort; die Break-even-Distanz wird im Data Collection File für jeden Fluss abgefragt. Partner in verschiedenen Regionen oder Ländern: C; B nur, wenn alle Standorte in einer Region liegen.',
      details:
        'D4.1 §12.2.3: Ein globaler oder nationaler Durchschnitts-Charakterisierungsfaktor erfasst die Bedeutung eines Systems nicht, dessen wichtigste Wechselwirkungen stark lokal sind (z. B. eine Wasserteilungs-Synergie in einer trockenen Region). A — ein Standort oder benachbarte Anlagen: standortspezifische Faktoren für Wasserknappheit, Eutrophierung und Versauerung, und die Maßstabsabweichung wird angezeigt, wo regionale Faktoren auf Standortebene angewandt werden (§12.3.3). B — innerhalb einer Region: regionalisierte Faktoren, z. B. die länderspezifischen Faktoren nach Seppälä / Posch für ein regionales Cluster (§12.3.3). C — über Regionen oder Grenzen hinweg: räumlich explizite Faktoren am Ort jeder Emission. Der Transport hängt nie von dieser Antwort ab: Jede Verbindung ist ein eigener Prozess im Vordergrundsystem mit Primärdaten, und GIS oder Routenplanung wird für jeden Austausch empfohlen (§12.3.1). Der zweite Teil fragt nach dem Markt, aus dem die ersetzten Produkte stammen: Hintergrund-Mixe und Referenzszenario werden darauf bezogen, in der Regel national oder subnational, kontinental nur für weltweit gehandelte Güter ohne subkontinentalen Markt (§11.3.1).',
      options: {
        A: { label: 'A. Ein Standort', description: 'Ein Standort oder benachbarte Anlagen: Die Wechselwirkungen sind stark lokal.' },
        B: { label: 'B. Regional', description: 'Mehrere Standorte innerhalb einer Region.' },
        C: { label: 'C. Überregional', description: 'Standorte über Regionen oder Grenzen hinweg.' },
      },
      market: {
        label: 'Referenzmarkt: Woher kämen die ersetzten Produkte?',
        help: 'Wo die Unternehmen ohne die Austausche kaufen würden, was die Austausche ersetzen – nicht der Markt der Symbioseprodukte. Optional. Beispiel: Für ein Nebenprodukt, das als Futter dient, woher das Sojaschrot käme, das es ersetzt.',
        region: 'Land oder Region',
        regionPlaceholder: 'z. B. Italien, Katalonien, EU',
        scope: {
          unset: 'Keine Antwort',
          national: 'National',
          sub_national: 'Subnational (eine Region innerhalb eines Landes)',
          continental: 'Kontinental (nur für weltweit gehandelte Güter)',
        },
      },
      plain:
        'Wie nah die wichtigsten Wechselwirkungen zwischen den Unternehmen beieinander liegen: an einem Standort, innerhalb einer Region oder über Regionen oder Grenzen hinweg. Das entscheidet, wie lokal die Umweltwirkungen bewertet werden: Wasser- oder Luftverschmutzung neben einem Standort zählt anders als dieselbe Menge über ein Land verteilt. Der Transport wird in jedem Fall gezählt. Sagen Sie dann, woher die Produkte, die die Symbiose ersetzt, sonst kämen: aus einem Land, einer Region oder, bei weltweit gehandelten Gütern, einem Kontinent. Partner in verschiedenen Regionen oder Ländern: C; B nur, wenn alle Standorte in einer Region liegen.',
    },
    q8: {
      title: 'Q8 — Zeithorizont der Studie',
      help: 'Optional. Ein Horizont für LCA und LCC gleichermaßen.',
      horizonWarning: 'Über {{threshold}} Jahre: Die Studie muss abschätzen, wie sich Energie und Märkte verändern (zukünftiger Hintergrund für Ökobilanz und Lebenszykluskostenrechnung).',
      details: 'Die Deliverables verlangen einen Zeithorizont für LCA, LCC und S-LCA (D4.2 §11, D4.1 §14). Zukünftige Hintergrundszenarien (SSP/RCP) kommen in beiden hinzu, wenn das System in einem zukünftigen Jahr betrieben wird (D4.1 §9.3.5, §12.3.2), wenn die Schlüsseltechnologie unter TRL 7 liegt (Q6b) oder wenn der Analysezeitraum oder die Lebensdauer der Hauptanlagen 15 Jahre übersteigt (D4.2 §9.3, das den Wert ohne Quelle angibt; er lässt sich in den erweiterten Einstellungen ändern). Ohne Antwort gilt als Betriebsjahr das Jahr der Studie. Der Analysezeitraum ist die von der Studie abgedeckte Zeitspanne; in der Regel entspricht er der technischen Lebensdauer der Hauptanlagen (D4.2 §9). Die Lebensdauer der Hauptanlagen ist zugleich der Abschreibungszeitraum ihrer Investitionsgüter, gleich in LCA und LCC (D4.1 §6.3.3, §14.2.2); Anlagen mit anderer Lebensdauer gehören in die Datenerhebungsdatei.',
      start: {
        label: 'In welchem Jahr wird das System betrieben, oder in welchem Jahr soll es betrieben werden?',
        options: {
          unset: 'Keine Antwort (das Jahr der Studie)',
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
        'Über welche Jahre betrachtet die Studie das System? Beschreibt sie, wie die Dinge heute funktionieren, genügt ein Bild der Gegenwart. Geht es um eine Anlage, die erst in einem späteren Jahr läuft, oder verfolgt sie das System über Jahrzehnte, hängt das Ergebnis davon ab, wie sich Strom, Brennstoffe und Märkte verändern, und das Werkzeug bittet Sie um eine Einschätzung dieser Zukunft: dieselbe Zukunft für die ökologische und die wirtschaftliche Betrachtung. Halten die Anlagen länger als 15 Jahre, muss die Studie berücksichtigen, wie sich Energie und Märkte in diesen Jahren verändern.',
    },
    q9: {
      title: "Q9 — Welche Entscheidung unterstützt die Studie, und wie weit reichen ihre Folgen? *",
      help: 'Pflicht. Sie legt die Modellierungssituation fest (ILCD A, B, C1 oder C2); Q1 beschreibt nur den Gegenstand.',
      details: "Tabelle 1 in D4.1 klassifiziert die Studie nach der unterstützten Entscheidung und der Größenordnung ihrer Folgen, nicht nach ihrem Gegenstand (D4.1 §4.2.3). Mikro (Situation A) ist der Standard für Entscheidungen über einzelne Austausche und Anlagen. Strukturell (Situation B) gilt, wenn die Entscheidung die installierte Kapazität eines Marktes verändert: Das ILCD Handbook nimmt das an, wenn die jährliche Nachfrage oder das jährliche Angebot, das die Entscheidung einem Markt hinzufügt oder entzieht, die Kapazität übersteigt, die dieser Markt jedes Jahr erneuert, gerechnet mit höchstens 5 % (z. B. erneuern 10 Mt Anlagen mit 25 Jahren Lebensdauer 0,4 Mt pro Jahr). Die Planung eines neuen Parks, eine regionale Umstrukturierung oder ein Programm brauchen dieses Screening (Mattila et al. 2012); ohne es bleibt die Studie A, mit B als Sensitivitätsanalyse. Ein bestehendes Netzwerk zu dokumentieren, oder ein Unternehmensbericht, der anrechnet, was seine Austausche anderswo einsparen, ist Situation C1 (Substitution, §7.2.3); der Bericht eines einzelnen Unternehmens, der jede Gutschrift für seine Austausche ausschließt, ist C2 (Allokation, keine Gutschriften, §7.2.3), mit Kosten nur auf Unternehmensebene (Entwurfsentscheidung von T4.6).",
      examples: {
        micro: "Zum Beispiel: Sie möchten wissen, ob es sich lohnt, Ihr Sägemehl an das benachbarte Pelletwerk abzugeben, um den Austausch zu beginnen, fortzuführen oder zu ändern.",
        structural: "Zum Beispiel: ein regionales Programm, groß genug, um zu ändern, wie viel der Markt der Region produziert. Ein Analyst muss die Marktprüfung dokumentieren.",
        none: "Zum Beispiel: Sie möchten beschreiben, was ein bestehendes Austauschnetz heute leistet, für einen Bericht, ohne etwas zu entscheiden.",
        corporate_report: "Zum Beispiel: der Nachhaltigkeitsbericht nur Ihres Unternehmens (CSRD, die EU-Richtlinie zur Nachhaltigkeitsberichterstattung): der Nutzen Ihrer Austausche für andere wird nicht gezählt.",
      },
      options: {
        micro: 'Sie untersucht oder unterstützt eine Wahl, auch eine hypothetische ohne benannten Entscheider, und ihre Wirkungen bleiben in den beteiligten Anlagen (Situation A)',
        structural: "Sie unterstützt eine Wahl, die verändert, wie viel ein Markt oder Sektor produziert, über die jährlich erneuerte Kapazität hinaus (Situation B; das Screening muss dokumentiert sein)",
        none: "Keine Wahl: Sie dokumentiert, was ein bestehendes Netzwerk oder System leistet, einschließlich dessen, was es anderswo einspart (Situation C1)",
        corporate_report: "Bericht eines einzelnen Unternehmens, der jede Gutschrift für das ausschließt, was seine Austausche anderswo vermeiden, z. B. strikte ESG-/CSRD-Bilanzierung (Situation C2)",
      },
      screening: {
        label: 'Ist dokumentiert, dass die jährliche Menge, die die Entscheidung dem betroffenen Markt hinzufügt oder entzieht, die Kapazität übersteigt, die dieser Markt jedes Jahr erneuert (höchstens 5 %)? Ohne Antwort gilt sie als Nein.',
        yes: 'Ja, es ist dokumentiert (Situation B)',
        no: 'Nein (Situation A, mit Situation B als Sensitivitätsanalyse)',
      },
      plain:
        "Wozu dient die Studie? Meistens untersucht oder stützt sie eine Wahl, deren Wirkungen in den beteiligten Anlagen bleiben, auch wenn noch niemand entscheiden muss. Erst wenn die Änderung größer ist als das, was der Markt jedes Jahr erneuert, und Sie das zeigen können, ändert sich die Art der Studie; die Planung eines neuen Parks braucht diese Prüfung. Wenn Sie nur ein bereits laufendes Netzwerk beschreiben oder die Zahlen eines Unternehmens ohne Gutschrift für seine Austausche berichten, sagen Sie es: Jeder Fall wird anders modelliert.",
    },
    q10: {
      title: 'Q10 — Dient die Studie einem öffentlichen Ziel oder einem öffentlichen Entscheidungsträger? *',
      help: 'Pflicht, wenn die ökonomische Dimension aktiv ist: Sie entscheidet, ob die gesellschaftliche LCC ergänzt wird.',
      details: 'D4.2 §2.3 ergänzt eine gesellschaftliche LCC (Net Tax Factor, monetarisierte Externalitäten, sozialer Diskontsatz), wenn die Studie einem Ziel der öffentlichen Politik oder der Raumplanung dient, und §2.2 bindet die Wahl des LCC-Typs an die Perspektive des Entscheiders. Wer entscheidet: die Stelle, die die Studie beauftragt oder nutzen wird. Ein öffentlicher Partner im Netzwerk (ein kommunaler Fernwärmebetrieb, eine öffentliche Kläranlage) macht das Ziel nicht von sich aus öffentlich: Seine öffentlichen Kapitalkosten gehen auf Ebene der einzelnen Einheit (D4.2 §9.2) in eine Kostenrechnung auf Unternehmensebene ein. Antworten Sie mit Ja, wenn diese öffentliche Stelle über den Fall entscheidet oder ein öffentlicher Plan oder eine Politik die Studie nutzen wird. Eine Gemeinde, die einen Ökopark plant, oder ein Versorger, der eine Fernwärmeanbindung auslegt, antworten mit Ja. Die strikte Berichterstattung eines einzelnen Unternehmens (Q9: Unternehmensbericht, Situation C2) behält die Kostenrechnung auf Unternehmensebene (eine Designentscheidung von T4.6), und das Tool sagt es Ihnen.',
      options: {
        yes: 'Ja — ein Ziel der öffentlichen Politik oder Planung oder ein öffentlicher Entscheidungsträger (ergänzt die gesellschaftliche LCC)',
        no: 'Nein — eine private Entscheidung oder die eigene Rechnung eines Unternehmens, auch mit einer öffentlichen Stelle unter den Partnern',
      },
      plain:
        'Antworten Sie mit Ja, wenn die Studie eine öffentliche Entscheidung vorbereiten soll oder von einer öffentlichen Stelle beauftragt wird: einer Gemeinde, einer Region, einem öffentlichen Versorger, einer Regulierungsbehörde, einem Plan. Dann kommt eine zweite ökonomische Lesart aus Sicht der Gesellschaft hinzu: Steuern werden anders gezählt, und Wirkungen, die niemand in Geld bezahlt. Für die eigene Bilanz eines Unternehmens bleibt die ökonomische Lesart auf Unternehmensebene. Entscheidend ist, wer die Studie beauftragt oder nutzen wird, nicht ob eine öffentliche Stelle im Netzwerk ist. Beispiel: Ein Stahlwerk untersucht den Verkauf von Wärme an das kommunale Netz — nein; die Gemeinde entscheidet, ob sie sich anschließt — ja.',
    },

    q11: {
      title: "Q11 — Was vergleicht die Studie?",
      help: "Optional. Sie legt die Basis der funktionellen Einheit fest; ohne Antwort gilt die funktionsorientierte Einheit von D4.1 Part 1.",
      details: "D4.1 Part 2 verlangt, dass die funktionelle Einheit die Hauptfunktion des Systems widerspiegelt (§4.3, §6.3, §8.3): eine inputbasierte Einheit (z. B. Behandlung von 1 Tonne Abfall), wenn die Studie Entsorgungswege oder die Leistung einer Anlage oder Dienstleistung vergleicht; eine outputbasierte Einheit (z. B. 1 kg Produkt, 1 MJ Energie), wenn sie Produkte mit Marktalternativen vergleicht oder eine Substitutionsaussage stützt; ein System funktioneller Einheiten, wenn beide Funktionen gleichrangig sind (Part 1 §5.3.2). D4.2 §3.1 verlangt für die LCC eine doppelte Einheit (behandelter Abfall + erzeugter Output), wenn die Produktsubstitution die Studie leitet: Die beiden Deliverables weichen ab; das Tool folgt für die Ökobilanz der Part 2 und weist auf den Unterschied hin.",
      options: {
        unset: 'Weiß nicht / nichts wird verglichen (das Tool nutzt eine Einheit, die auf der erbrachten Leistung beruht)',
        waste_treatment: "Wie ein Abfall behandelt wird — Entsorgungswege, Leistung einer Anlage oder Dienstleistung (inputbasierte Einheit)",
        product_substitution: "Produkte gegenüber Marktalternativen — was das zurückgewonnene Produkt ersetzt (outputbasierte Einheit)",
        co_primary: "Beides: Behandlungsleistung und Produkte zählen gleich viel (System funktioneller Einheiten)",
      },
      plain:
        "Worum geht es beim Vergleich wirklich? Lautet die Frage, wie ein Abfall am besten behandelt wird — verbrennen, vergären, kompostieren —, wird das Ergebnis pro Tonne behandelten Abfalls gezählt. Lautet sie, ob das zurückgewonnene Produkt besser ist als das, was es ersetzt, wird pro Produkteinheit gezählt. Zählt beides gleich viel, werden beide nebeneinander gezählt.",
    },
    q12: {
      title: 'Q12 — Nutzt die Symbiose eigens errichtete Anlagen?',
      help: 'Optional, gefragt, wenn Ökobilanz oder LCC aktiv sind: Leitungen, Anlagen, Lager oder Ausrüstung, die für den Austausch gebaut wurden, heute oder vor Jahren, ob sie ein Unternehmen nutzt oder mehrere.',
      details: 'D4.2 §4.2 fragt, ob das Netzwerk neue, eigens errichtete und gemeinsam genutzte Anlagen braucht: Wenn ja, gehören deren CAPEX und laufende OPEX in die Kostenaufstellung und werden auf die begünstigten Partner verteilt. D4.1 §6.3.3 schließt die für das Symbioseszenario spezifischen Investitionsgüter und Infrastrukturen ein, abgeschrieben über die technische Lebensdauer jeder Anlage (Q8). Sind Ökobilanz und LCC beide aktiv, aktiviert ein Ja außerdem die Regeln, die Investitionsgüter zwischen beiden abgleichen (IR-13, B-06); für Parks und Programme mit sozialer Dimension die S-LCA-Indikatoren für gemeinsame Investitionen (CIR-08). Der profitierende Partner kann ein einzelnes Unternehmen sein.',
      options: {
        unset: 'Keine Antwort',
        yes: 'Ja — für den Austausch wurde etwas gebaut (eine Leitung, eine Anlage, ein Trockner, ein Tank), auch wenn es nur ein Unternehmen nutzt',
        no: 'Nein — der Austausch nutzt nur Anlagen, die es ohnehin gäbe',
      },
      plain:
        'Antworten Sie mit Ja, wenn etwas gebaut wurde oder gebaut werden muss, damit der Austausch stattfindet: eine Leitung, eine Aufbereitungsanlage, ein Tank, ein Trockner, auch wenn es vor Jahren gebaut wurde. Seine Kosten und sein Fußabdruck gehen dann in die Studie ein und werden dem zugerechnet, der davon profitiert: ganz einem Unternehmen, wenn nur es die Anlage nutzt, aufgeteilt, wenn mehrere sie nutzen.',
    },

    q2dCard: {
      title: 'Alternative Szenarien (optional)',
      help:
        'Jede Studie kann Alternativen mit ihrer Ausgangssituation vergleichen (D4.1 §4.3.3).',
    },

    advancedCard: {
      title: 'Erweiterte Overrides (Expertenmodus)',
      activeKeys_one: '{{count}} aktiver Schlüssel',
      activeKeys_other: '{{count}} aktive Schlüssel',
    },
    scopeNotePlain: 'Das Tool rechnet nicht: Es sagt Ihnen, wie die Studie zu machen ist und welche Daten zu sammeln sind. Die Berechnungen macht danach ein Analyst.',
  },

  flows: {
    // guided-mode wording of the flows table (UX round 2026-11-03)
    plainHeaders: {
      q5: 'Wer zahlt wem',
      sector: 'Sektor des Ausgetauschten (optional)',
      configuration: 'Art der Wiederverwendung (optional)',
    },
    plainOptions: {
      a: 'Wer es abgibt, zahlt dem Empfänger für die Abnahme (für den Abgebenden ein Abfall)',
      b: 'Niemand zahlt, oder es ist noch nicht klar',
      c: 'Der Empfänger zahlt dem Abgebenden (für den Abgebenden ein Produkt)',
      d: 'Die beiden Anlagen hängen voneinander ab (eine wurde für die Belieferung der anderen umgebaut)',
      e: 'Nur eine Gesamtzahl für das ganze Netzwerk',
    },
    q5Note: 'Antworten Sie mit der heutigen Regelung — vereinbart oder vorgesehen, wenn der Austausch noch nicht läuft. Das ist eine Ausgangsannahme, kein Ergebnis: ändert die Studie, wer wen bezahlt, kommen Sie zurück und passen Sie es an. Wählen Sie „Niemand zahlt, oder es ist noch nicht klar“, wenn es wirklich offen ist.',
    emptyHint: 'Keine Flüsse. Fügen Sie mindestens einen hinzu, um Q5 pro Fluss zu charakterisieren.',
    headers: { id: 'ID', name: 'Name', q5: "Wer zahlt wen (Q5)", sellable: 'An Dritte verkaufbar?', sector: 'Sektor (Teil 2)', configuration: "Konfiguration (Teil 2)" },
    q5Unset: "— wählen, wer wen bezahlt",
    sellable: { unset: '— nicht beantwortet', yes: 'Ja', no: 'Nein' },
    sellableHint: "Würde der Partner diesen Fluss nicht abnehmen, könnte der Erzeuger ihn an jemand anderen zu einem positiven Preis verkaufen? Ja macht ihn zum Koppelprodukt. Nein macht ihn nicht schon zu Abfall: Ein einziger Abnehmer, der zahlt, was ein unabhängiger Käufer zahlen würde (der Preis des Produkts, das der Fluss ersetzt, abzüglich seiner Mehrkosten für die Nutzung), macht ihn trotzdem zum Koppelprodukt; ein kostenlos abgegebener Fluss oder eine Zahlung, die nur Kosten teilt, macht ihn zu Abfall (D4.1 §8.3.3). Optional: Das Ergebnis vermerkt, wenn die Antwort nicht zu Q5 passt.",
    sectorHint: 'Wählen Sie das Kapitel von D4.1 Part 2 nach dem, was ausgetauscht wird, nicht nach dem Unternehmen: landwirtschaftliche und agroindustrielle Reststoffe → Agrar/Lebensmittel (§4); Siedlungs- oder gemischte Abfälle einschließlich Bioabfall (organische Fraktion des Restmülls, Lebensmittelabfälle aus Haushalten) → Abfallverwertung (§8); Klärschlamm und behandeltes Abwasser, auch als Wasser wiederverwendet → Abwasser (§6); ein aus einem Fluss gewonnenes Produkt oder ein Energieträger (Biomethan, Gärrest, Strom) → das Kapitel dieses Flusses. Wo sich §4 und §8 beim Bioabfall überschneiden, entscheidet die Herkunft (Lesart T4.6 von Part 2 §3.3). Optional: Das Ergebnis listet die Regeln des Kapitels. D4.1 Part 2 hat nur für diese biobasierten Sektoren Kapitel: für Stahl, Zement, Wärme, Papier oder Chemie wählen Sie „— keiner davon“, dann gilt nur Part 1. Holz und Waldreststoffe (Sägemehl, Rinde, Lignin, Schwarzlauge) haben kein Kapitel in Part 2: Wählen Sie „— keiner davon“.',
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
      a: "a — der Abgeber (A) zahlt den Abnehmer (B): Abfall",
      b: 'b — Freier Tausch (mehrdeutig)',
      c: "c — der Abnehmer (B) zahlt den Abgeber (A): Co-Produkt",
      d: 'd — Interdependent',
      e: 'e — Aggregiert / Black-box',
    },
    plainEmpty: 'Noch kein Austausch. Fügen Sie alles hinzu, was zwischen den Unternehmen fließt (Molke, Sägemehl, Wärme, Wasser …).',
    plainSectorHint: 'Optional. Wählen Sie einen Sektor nur, wenn das Ausgetauschte zu einem der aufgeführten biobasierten Sektoren gehört (Agrar/Lebensmittel, Kunststoffe, Abwasser, Textilien, Abfall). Für Holz, Sägemehl, Wald- oder Papierfabrikreststoffe, Stahl, Zement oder Wärme lassen Sie „— keiner davon“. Im Zweifel lassen Sie es: Der Analyst kann es festlegen.',
  },

  scenarios: {
    intro: 'Ein Szenario ändert einige Antworten des Fragebogens, und die Engine berechnet es neben dem Fall: Die Ergebnisseite zeigt dann, was die Änderung an der Konfiguration und den Pflichten bewirkt. Es kann nicht ändern, wohin ein einzelner Fluss geht, wie weit oder zu welchem Preis: Der Netzwerk-Editor enthält ein Netzwerk pro Fall, notieren Sie eine solche Alternative also in den Szenarioannahmen des Flusses im Data Collection File (gefragt, wenn die Austausche noch nicht stattfinden oder ein Szenario definiert ist); das Tool vergleicht noch keine verschiedenen Netzwerke.',
    emptyHint: 'Noch keine alternativen Szenarien.',
    headers: { id: 'ID', label: 'Bezeichnung' },
    labelPlaceholder: 'z. B. Zukünftige Erweiterung / TRL9 Ramp-up',
    addButton: 'Szenario hinzufügen',
    removeAria: '{{id}} entfernen',
    addChange: "Änderung hinzufügen",
    pickQuestion: "Frage",
    newAnswer: "Neue Antwort",
    flowQ5Title: 'Wer zahlt wem, je Fluss',
    removeChange: "Diese Änderung entfernen",
    noChanges: "Noch keine Änderung: das Szenario entspricht dem Fall.",
    jsonToggle: "Als JSON bearbeiten (Fachleute)",
    otherKeys_one: "{{count}} weitere Änderung als JSON",
    otherKeys_other: "{{count}} weitere Änderungen als JSON",
    changesCount_one: "{{count}} Änderung",
    changesCount_other: "{{count}} Änderungen",
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
    },
  },

  narrative: {
    ilcd: {
      'ILCD Situation A': {
        title: 'Entscheidungsunterstützung mit begrenzten Folgen (ILCD-Situation A)',
        short: 'Entscheidungsunterstützung auf Mikroebene: der Austausch ist zu klein, um das Hintergrundsystem zu verändern. Attributionelle Modellierung mit Substitution am durchschnittlichen Marktmix.',
        detail: 'Der Austausch betrifft die beteiligten Akteure, nicht das, was die Wirtschaft insgesamt produziert oder wie. Modelliert wird daher mit durchschnittlichen, bilanziellen Daten, und was die Symbiose verdrängt, wird durch Substitution mit dem durchschnittlichen Marktmix abgebildet: dem nationalen Netzmix für Strom, der durchschnittlichen Primärproduktion für ein Material. D4.1 warnt ausdrücklich davor, nur deshalb zur konsequenziellen Modellierung zu greifen, weil eine Entscheidung getroffen wird.',
      },
      'ILCD Situation B': {
        title: 'Entscheidungsunterstützung mit strukturellen Folgen (ILCD-Situation B)',
        short: 'Entscheidungsunterstützung auf Meso-/Makroebene: die Entscheidung verändert das Hintergrundsystem strukturell, daher konsequenzielle Modellierung gegen die marginale Technologie. D4.1 verlangt den Nachweis dieser Größenordnung.',
        detail: 'Die Entscheidung ist groß genug, um installierte Kapazität oder die Produktion einer bestimmten Technologie zu verschieben. Die Modellierung wird konsequenziell, und was die Symbiose verdrängt, ist die marginale Technologie, ermittelt durch eine Marktanalyse statt als Durchschnittsmix angenommen. Die Beweislast liegt bei Ihnen: Dieser Weg muss belegt, nicht unterstellt werden.',
      },
      'ILCD Situation C1': {
        title: 'Dokumentation eines bestehenden Netzwerks (ILCD-Situation C1)',
        short: 'Bilanzierung mit Wechselwirkungen — dokumentiert, was ein bestehendes Netzwerk der Wirtschaft insgesamt bringt. Substitution am durchschnittlichen Marktmix, wie in Situation A.',
        detail: 'Sie dokumentieren ein bestehendes Netzwerk, statt eine Entscheidung zu unterstützen; die Studie ist also beschreibend. Da sie aber zeigen soll, was das Netzwerk der Wirtschaft insgesamt bringt, wird die Multifunktionalität trotzdem durch Substitution mit dem durchschnittlichen Marktmix aufgelöst, praktisch dieselbe Regel wie in Situation A.',
      },
      'ILCD Situation C2': {
        title: 'Strikte Bilanzierung eines einzelnen Unternehmens (ILCD-Situation C2)',
        short: 'Strenge Bilanzierung für einen einzelnen Partner isoliert: Allokation, keine Substitutionsgutschriften.',
        detail: 'Strikte Bilanzierung eines einzelnen Partners für sich, typischerweise Unternehmensberichterstattung. Die Multifunktionalität wird durch Allokation aufgelöst, und für das, was die Symbiose anderswo verdrängt, wird keine Gutschrift beansprucht: Die Zahl beschreibt den Lastenanteil dieses Partners, nicht den Nutzen, den das Netzwerk erzeugt.',
      },
    },
    lcc: {
      'deactivated': {
        short: 'Keine ökonomische Analyse — die ökonomische Dimension ist in Q3 deaktiviert.',
        detail: 'In Q3 ist keine ökonomische Dimension gewählt, daher konfiguriert das Tool keine Kostenrechnung. Braucht der Fall einen Business Case, was bei einer Symbiose, die mehrere Unternehmen unterschreiben müssen, meist zutrifft, gehen Sie zurück zu Q3 und aktivieren Sie die ökonomische Dimension.',
      },
      'C+E': {
        short: 'Konventionelle LCC (die realen Zahlungsströme des Unternehmens) plus ökologische LCC (die Wertschöpfungskette, auf denselben Grenzen wie die Ökobilanz).',
        detail: 'Zwei Sichten laufen parallel. Die konventionelle LCC beantwortet, ob es sich für das einzelne Unternehmen rechnet: reale Zahlungsströme, Steuern und Gebühren als Kosten, Subventionen als Minderungen. Die ökologische LCC erweitert die Grenze auf alle Akteure im Lebenszyklus und bleibt mit der parallelen Ökobilanz konsistent, sodass beide nebeneinander gelesen werden können. Vorsicht vor Doppelzählung: Eine CO2- oder Deponiesteuer, die schon in den Zahlungsströmen steht, darf nicht noch einmal als monetarisierte Externalität auftauchen.',
      },
      'C+E+S': {
        short: 'Konventionelle und ökologische LCC plus gesellschaftliche LCC: Steuern und Subventionen über den Net Tax Factor angepasst, Umweltwirkungen monetarisiert.',
        detail: 'Zu Unternehmens- und Wertschöpfungskettensicht kommt die Wohlfahrtssicht. Steuern und Subventionen sind Transfers innerhalb der Gesellschaft und keine realen Kosten für sie; sie werden daher ausgeschlossen oder über den Net Tax Factor in Schattenpreise umgerechnet, und die Umweltwirkungen aus der parallelen Ökobilanz werden monetarisiert. Das ist die Konfiguration, die eine öffentliche Entscheidung braucht, und deshalb bringt ein öffentliches oder politisches Ziel sie mit.',
      },
      'C-LCC': {
        short: 'Nur konventionelle LCC — die Unternehmensperspektive, entspricht einer Total-Cost-of-Ownership-Analyse.',
        detail: 'Nur die Sicht des Unternehmens. Jedes Politikinstrument ist ein realer Zahlungsstrom: Steuern und Gebühren sind Kosten, Subventionen senken Capex oder Opex. Das ist der richtige Rahmen für die Unternehmensberichterstattung, und er sagt bewusst nichts über Wirkungen in der Wertschöpfungskette oder in der Gesellschaft: Sie zu behaupten, ginge über das hinaus, was eine Rechnung für einen einzelnen Akteur tragen kann.',
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
        detail: 'Die soziale Dimension ist aktiv. Jede Stakeholdergruppe (Beschäftigte, Verbraucher, lokale Gemeinschaften, Akteure der Wertschöpfungskette) wird den Prozessen zugeordnet, die sie betreffen, und von dort den Wirkungsunterkategorien und Indikatoren. Diese Zuordnung ist nur so gut wie die Beteiligung dahinter: Mit den betroffenen Gruppen zu sprechen gehört zur Datenerhebung und ist kein optionaler Zusatz.',
      },
      'deactivated': {
        short: 'S-LCA nicht aktiviert — die soziale Dimension ist in Q3 deaktiviert.',
        detail: 'In Q3 ist keine soziale Dimension gewählt, daher sind weder eine Stakeholder-Zuordnung noch soziale Indikatoren konfiguriert. Aktivieren Sie sie in Q3, wenn der Fall etwas über Beschäftigte oder lokale Gemeinschaften sagen muss, was meist zutrifft, wenn eine Symbiose einer Gemeinde oder einer Gemeinschaft vorgestellt wird.',
      },
    },
  },

  result: {
    // guided mode: notes in plain words (UX round 4)
    engineNotesPlain: {
      flow_freedom_to_act_settles: {
        co_product: 'Fluss „{{flow}}“: Sie sagten, niemand zahlt (oder es ist noch unklar), aber jemand anderes würde ihn kaufen: Dann ist er kein Abfall. Das ist in Ordnung; der Analyst entscheidet, wie er gezählt wird.',
        waste: 'Fluss „{{flow}}“: Sie sagten, niemand zahlt und niemand sonst würde ihn kaufen: Er kann als Abfall zählen, ohne Last auf Ihrer Seite. Der Analyst prüft das.',
      },
    },
    // guided mode: what the result means for a non-analyst (UX round 2026-11-03)
    guided: {
      title: 'Was das für Sie bedeutet',
      lead: 'Das Tool hat festgelegt, wie die Studie zu Ihrem Fall angelegt werden muss und welche Daten sie braucht. Es berechnet nicht, ob sich der Austausch lohnt oder der Umwelt nützt: Das macht ein Analyst oder Berater mit den Daten, die Sie sammeln.',
      step1: 'Speichern Sie den Fall, um ihn wiederzufinden. Dafür braucht es ein kostenloses Konto; ohne Konto bleibt der Fall nur in diesem Browser.',
      step2: 'Öffnen Sie das Data Collection File, zeichnen Sie die Unternehmen und die Austausche und laden Sie dann die Excel-Datei herunter: Ihre Fachleute füllen die Blätter zu Akteuren, Flüssen, Logistik und Kosten aus.',
      step3: 'Geben Sie Datei und Bericht an die Person, die die Studie durchführt (Analyst, Berater, Hochschule): Die technischen Punkte weiter unten sind für sie.',
      analystTitle: 'Punkte für den Analysten ({{count}})',
      step1Saved: '✓ Gespeichert als „{{name}}“: Sie finden ihn unter Meine Fälle.',
      step1SignedIn: 'Speichern Sie den Fall, um ihn unter Meine Fälle wiederzufinden.',
    },
    // a study with no LCA is headed by its costing (decided by Fable, UX round 2026-11-03)
    lccTitle: {
      'C+N': 'Konventionelle LCC je Partner, auf Netzwerkebene konsolidiert',
      'C+N+S': 'Konventionelle LCC je Partner und Netzwerk, dazu gesellschaftliche LCC',
      'C-LCC': 'Konventionelle LCC eines einzelnen Unternehmens',
      'C+E': 'Konventionelle und ökologische LCC',
      'C+E+S': 'Konventionelle, ökologische und gesellschaftliche LCC',
    },
    lccBadge: {
      'C+E': 'C-LCC + E-LCC',
      'C+E+S': 'C-LCC + E-LCC + S-LCC',
      'C+N': 'C-LCC je Partner + Netzwerk',
      'C+N+S': 'C-LCC je Partner + Netzwerk + S-LCC',
      'C-LCC': 'C-LCC',
    },
    situationBadge: {
      A: 'ILCD-Situation A',
      B: 'ILCD-Situation B',
      C1: 'ILCD-Situation C1',
      C2: 'ILCD-Situation C2',
    },
    verdictWhy: "Warum: Sie haben „{{answer}}“ geantwortet (Q9)",
    verdictWhyQ1: "Warum: Q9 ist nicht beantwortet, daher folgt die Situation aus dem Untersuchungsgegenstand (Q1)",
    config: {
      title: 'Ihre Konfiguration',
      lead: 'Was Ihre Antworten entschieden haben, in den Begriffen der Deliverables. Öffnen Sie eine Zeile, um den Text der Engine auf Englisch mit seinem Abschnitt zu lesen.',
      nodeText: 'Text der Engine (Englisch)',
      labels: {
        flows: "Behandlung der Flüsse",
        claim: 'Vergleichende Aussage',
        purpose: 'Art der Studie',
        lcc: 'Kosten',
        slca: 'Soziale Bewertung',
        horizon: 'Studienhorizont',
        prospective: 'Prospektive Daten',
        reference: 'Referenzszenario',
        fu: 'Funktionelle Einheit',
        regional: 'Lokale Wirkungen',
        sectors: 'Sektorregeln',
        shared: 'Eigens errichtete Anlagen',
        sharedLca: 'Ihre Herstellung und ihr Lebensende werden in der Ökobilanz inventarisiert und über die technische Lebensdauer jedes Guts abgeschrieben (D4.1 §6.3.3)',
        claimPublic: 'Vergleiche',
        multifunctionality: 'Multifunktionalität',
        flowsLcc: 'Kosten jedes Flusses',
        fuLcc: 'Funktionales Äquivalent',
        communityRegional: 'Wirkungen in der Nähe der Anlagen',
        transport: 'Transporte',
        fieldSpreading: 'Was auf Felder ausgebracht wird',
        notCovered: 'Nicht abgedeckt',
      },
      values: {
        community: {
          slcaOn: 'Ja: Soziale Wirkungen werden Gruppe für Gruppe bewertet: Beschäftigte, lokale Gemeinschaft, Verbraucher. Welche Gruppen befragt werden, entscheidet, wer die Studie durchführt (D4.3 §5.1, §6.2).',
          slcaOff: 'Nein: Soziale Wirkungen werden nicht bewertet. Wenn Anwohner gehört werden wollen, fragen Sie den Kontakt auf dieser Seite.',
          regional: 'Lokale Wirkungen auf Luft, Wasser und Boden (Feinstaub, Versauerung, Nährstoffüberschuss, Wasserverbrauch) werden mit Daten {{where}} bewertet, nicht mit Weltdurchschnitten (D4.1 §13.3.3).',
          where_A: 'des Standorts',
          where_B: 'Ihrer Region oder Ihres Landes',
          where_C: 'des Gebiets jeder Emission',
          where_unset: 'des Landes',
          transport: 'Jeder Austausch wird mit seinem Transport untersucht: Lkw oder Leitungen, reale Routen und Entfernungen, Ladungen und Leerfahrten, und die Entfernung, ab der der Lkw-Transport den Nutzen aufhebt (D4.1 §13.3.1).',
          transportLcc: 'Die Transportkosten jedes Austauschs und die Entfernung, ab der er sich nicht mehr lohnt (D4.2 §4.3).',
          fieldSpreading: 'Die Studie zählt, was passiert, wenn Gärrest, Kompost oder zurückgewonnener Dünger auf Felder ausgebracht werden: Ammoniak in die Luft, Nitrat ins Wasser (D4.1 Part 2 §4.3.3, §6.3.3).',
          notCovered: 'Geruch und Lärm sind keine Wirkungskategorien dieser Leitlinien (Part 2 §9.3 nennt sie unter den meist ausgelassenen Wirkungen); lokale Luft, Wasser und Toxizität sind es. Jede lokale Wirkung, die die Studie auslässt, muss als bekannter blinder Fleck erklärt werden (D4.1 §12.3.5).',
        },
        flowCost: {
          a: 'Abfall: die ausgehandelte Annahmegebühr; Nullkosten nur, wenn der Rückstand unvermeidbar ist (D4.2 §6.3)',
          b: 'kostenlos: Verrechnungspreis null; Nullkosten nur, wenn unvermeidbar, sonst Koppelprodukt',
          c: 'Koppelprodukt: der ausgehandelte Preis',
          d: 'interdependent: ein bestimmendes Koppelprodukt zum ausgehandelten Verrechnungspreis; Nullkosten gelten nicht (D4.1 §8.3.6, Schritt 2)',
          e: 'aggregiert: jeden benennbaren Fluss bepreisen',
        },
        noChapter: "Kein Kapitel von D4.1 Part 2 betrifft die angegebenen Flüsse: es gilt nur Part 1",
        flowTreatment: {
          waste: 'Abfall: Nulllast ab dem Punkt, an dem der Reststoff erstmals einen nicht negativen Wert erreicht, nach dem Vermeidbarkeitstest (D4.1 §8.3.6 Schritt 4)',
          evt: 'unentschieden: Test des wirtschaftlichen Werts mit Sensitivitätsanalyse (D4.1 §8.3.2)',
          coproduct: 'Koppelprodukt: keine Nulllast; Substitution des ersetzten Produkts mit dem Qualitätsfaktor Q (D4.1 §8.3.6 Schritt 3)',
          integrated: 'voneinander abhängig: ein bestimmendes Koppelprodukt, nie Nulllast; ein erweitertes multifunktionales System (D4.1 §8.3.6 Schritt 2); die E-LCC folgt derselben Aufteilung und bewertet den Fluss zum Marktpreis dessen, was er ersetzt; die C-LCC nutzt den ausgehandelten Verrechnungspreis',
          integratedLca: 'voneinander abhängig: ein bestimmendes Koppelprodukt, nie Nulllast; ein erweitertes multifunktionales System (D4.1 §8.3.6 Schritt 2)',
          allocation: 'Allokation: keine Nulllast und keine Substitutionsgutschriften, die Bilanz eines einzelnen Unternehmens (D4.1 §7.2.3)',
          aggregated: 'aggregiert: jeden benennbaren Fluss klassifizieren, keine netzwerkweite Regel (D4.1 §8.3.1)',
        },
        claim: 'Zur Veröffentlichung bestimmte vergleichende Aussage (Überlegenheit oder Gleichwertigkeit): kritische Prüfung durch ein Panel aus mindestens drei unabhängigen Fachleuten, keine Gewichtung',
        claimNone: 'Keine zur Veröffentlichung bestimmte vergleichende Aussage',
        claimPolicy: 'Keine zur Veröffentlichung bestimmte vergleichende Aussage; Ausrichtung auf EU-Politiken (Q4 = D): Prüfung durch ein unabhängiges Panel, eine Wahl von T4.6',
        claimPublic: { none: 'Diese Studie soll nicht sagen, dass ein Produkt besser als ein anderes oder gleichwertig ist.', claim: 'Die Studie wird eine öffentliche Aussage stützen, dass dieser Austausch besser als eine Alternative oder gleichwertig ist; unabhängige Fachleute müssen sie zuerst prüfen.', policy: 'Die Studie folgt der EU-Methode des Umweltfußabdrucks; sie behauptet nicht, dass ein Produkt besser als ein anderes ist.' },
        scope_continental: 'kontinental',
        scope_sub_national: 'subnational',
        scope_national: 'national',
        slcaOff: 'Nicht enthalten',
        reference_c2: 'Nicht für Gutschriften genutzt: Allokation, keine Substitution',
        horizonFuture: 'Zukünftiger Hintergrund: Strom, Brennstoffe und Materialien, wie sie in den kommenden Jahren erwartet werden (Klima- und Wirtschaftsszenarien SSP/RCP)',
        prospectiveScaleUp: 'Labor- oder Pilotdaten auf industriellen Maßstab hochgerechnet, nicht linear',
        prospectivePedigree: 'Qualität jedes Eintrags auf den fünf Pedigree-Indikatoren bewertet',
        horizonPresent: 'Heutiger Hintergrund',
        reference_hnsrs: 'Was jedes Unternehmen heute ohne die Verbindungen täte (hypothetisches nicht-symbiotisches Referenzszenario, HNSRS)',
        reference_modern: 'Ein modernes Kontrafaktum: was jedes Unternehmen heute ohne die Verbindungen täte (hypothetisches nicht-symbiotisches Referenzszenario, HNSRS)',
        reference_cnsrs: 'Das Szenario ohne die Symbiose, über den Studienhorizont (aktuelles nicht-symbiotisches Referenzszenario, CNSRS)',
        market: 'Markt: {{market}}',
        fu_waste_treatment: 'Inputbasiert: die Behandlung des Abfalls',
        fu_product_substitution: 'Outputbasiert: die Produkte und was sie ersetzen',
        fu_co_primary: 'Ein System funktioneller Einheiten: Behandlung und Produkte zusammen',
        fu_function: 'Funktionsorientiert, um die erbrachte Leistung',
        regional_A: 'Standortspezifische Charakterisierungsfaktoren für Wasser, Eutrophierung und Versauerung',
        regional_B: 'Regionale oder länderspezifische Charakterisierungsfaktoren',
        regional_C: 'Länder- oder regionsspezifische Faktoren für das Gebiet jeder Emission',
        regional_unset: 'Standortspezifische Faktoren, wo die wichtigsten Wechselwirkungen stark lokal sind',
        shared: 'Ihr CAPEX und OPEX in der Kostenaufstellung, den Partnern zugerechnet, die davon profitieren (ganz einem Unternehmen, wenn nur es sie nutzt)',
        multiSubstitution: 'Substitution (Systemerweiterung) gegen den durchschnittlichen Marktmix, mit dem Qualitätsfaktor Q',
        multiConsequential: 'Konsequenziell: Substitution gegen die marginale Technologie',
        multiAllocation: 'Allokation: keine Substitutionsgutschriften',
        multiPefSubstitution: ' — aufgeteilt mit der Circular Footprint Formula des PEF (Q4 = D)',
        multiPefConsequential: ' — PEF-CFF als Sensitivitätsanalyse (Q4 = D)',
        multiPefAllocation: ' — die CFF wird nicht angewendet',
        fuLcc_waste_treatment: 'Inputbasiert: die Behandlung des Abfalls (D4.2 §3.1)',
        fuLcc_dual: 'Doppelt: der behandelte Abfall und das erzeugte Produkt, jeweils mit vermiedenen Kosten und Erlösen (D4.2 §3.1)',
        fuLcc_function: 'Das Bündel der Funktionen, die das Netzwerk erbringt, jeweils mit vermiedenen Kosten und Erlösen (D4.2 §3.1)',
      },
      why: {
        noChapter: "Part 2 deckt fünf biobasierte Sektoren ab, und kein Fluss ist einem davon zugeordnet",
        flows: "wer wen bezahlt, je Fluss (Q5)",
        horizonUnanswered: "kein Betriebsjahr, Zeitraum, Lebensdauer oder Technologiereife angegeben, daher wird die Gegenwart angenommen; laufen die Anlagen länger als {{threshold}} Jahre, beantworten Sie Q8",
        lccNoPolicyNoLca: "kein öffentliches Ziel (Q10): die Kosten jedes Partners, für das Netz konsolidiert",
        slcaOff: 'die soziale Dimension ist nicht ausgewählt (Q3)',
        claim: 'die Ergebnisse stützen eine zur Veröffentlichung bestimmte vergleichende Aussage über Überlegenheit oder Gleichwertigkeit (Q4 = C)',
        horizonFutureGeneric: 'der Studienhorizont reicht in die Zukunft',
        horizonFutureYear: 'das System wird in einem zukünftigen Jahr betrieben',
        label: 'Warum:',
        lccC2: 'strikte Bilanzierung eines einzelnen Unternehmens: nur Kosten auf Unternehmensebene',
        referenceC2: "strikte Bilanzierung eines einzelnen Unternehmens: Allokation, keine Gutschrift für das, was die Symbiose ersetzt (D4.1 §7.2.3)",
        claimPolicy: "die Ergebnisse sollen die Ausrichtung an der EU-Politik stützen (Q4 = D)",
        lccNoLca: 'keine Umweltdimension: keine ökologische LCC abzugleichen',
        lccPolicy: 'Sie haben angegeben, dass die Studie einem öffentlichen Ziel dient (Q10)',
        lccPolicyInferred: 'aus Q1 abgeleitet, da Q10 nicht beantwortet ist',
        lccNoPolicy: 'kein öffentliches Ziel (Q10): Sicht von Unternehmen und Wertschöpfungskette',
        horizonYear: 'das System wird {{year}} betrieben',
        horizonTrl: 'die Schlüsseltechnologie liegt unter TRL 7',
        horizonPeriod: 'die Studie verfolgt das System {{years}} Jahre, mehr als {{threshold}}',
        horizonLifetime: 'die Anlagen halten {{years}} Jahre, mehr als {{threshold}}',
        horizonPresent: 'heutiges Jahr, Technologie ab TRL 7 und ein Horizont innerhalb von {{threshold}} Jahren',
        referenceNotYet: 'die Austausche finden noch nicht statt (Q2)',
        referenceRunning: 'die Austausche finden bereits statt (Q2)',
        referenceLongStanding: 'das Netzwerk läuft seit vielen Jahren (Q2)',
        fuGoal: 'die Studie vergleicht: {{goal}}',
        fuDefault: 'was die Studie vergleicht, ist nicht beantwortet (Q11)',
        regionalUnset: 'die Konzentration der Wechselwirkungen ist nicht beantwortet (Q7)',
        sectors: 'die Kapitel folgen dem für jeden Fluss angegebenen Sektor',
        shared: 'die Symbiose nutzt eigens errichtete Anlagen (Q12)',
        multifunctionality: 'die ILCD-Situation (Q9)',
        horizonLifetimeOnly: 'die Anlagen halten {{years}} Jahre, mehr als {{threshold}}: Der Hintergrund wird über ihre Abschreibung projiziert, auch wenn die Studie das aktuelle Jahr beschreibt (D4.2 §9.3; die Schwelle lässt sich in den erweiterten Einstellungen ändern)',
        referenceNoLca: 'die Kostenrechnung nutzt das Referenzszenario, das eine Ökobilanz in ILCD-Situation {{situation}} verwenden würde (D4.2 §4.1); die Situation schreibt kein Kostenmodell vor',
      },
    },
    notes: { title: 'Hinweise zu Ihren Antworten' },
    engineNotes: {
      study_purpose_vs_q2: {
        analysis: "Zweck der Studie: die Studie bewertet ein bestehendes Netzwerk, aber Q2 sagt, dass die gemessenen Austausche noch nicht stattfinden. Prüfen Sie die beiden Antworten (D4.1 §4.3.2).",
        design: "Zweck der Studie: die Studie vergleicht Optionen für ein neues, geplantes Netzwerk, aber Q2 sagt, dass die Austausche bereits stattfinden. Prüfen Sie die beiden Antworten (D4.1 §4.3.2).",
      },
      q9_unanswered: "Q9 ist nicht beantwortet, daher wird die ILCD-Situation (Situation {{situation}}) aus Q1 abgeleitet, wie bei Fällen, die vor Q9 gespeichert wurden. Beantworten Sie Q9: D4.1 Tabelle 1 bestimmt die Situation nach der Entscheidung und dem Ausmaß ihrer Folgen, nicht nach dem Gegenstand der Studie.",
      q10_unanswered: {
        yes: "Q10 ist nicht beantwortet, daher wird aus Q1 abgeleitet, ob die Studie einem öffentlichen Ziel dient: Die gesellschaftliche LCC wird ergänzt, wie bei Fällen, die vor Q10 gespeichert wurden. Beantworten Sie Q10: D4.2 §2.3 ergänzt die gesellschaftliche LCC für ein Ziel der öffentlichen Politik oder Planung oder einen öffentlichen Entscheidungsträger, unabhängig vom Gegenstand der Studie.",
        no: "Q10 ist nicht beantwortet, daher wird aus Q1 abgeleitet, ob die Studie einem öffentlichen Ziel dient: Die gesellschaftliche LCC wird nicht ergänzt, wie bei Fällen, die vor Q10 gespeichert wurden. Beantworten Sie Q10: D4.2 §2.3 ergänzt die gesellschaftliche LCC für ein Ziel der öffentlichen Politik oder Planung oder einen öffentlichen Entscheidungsträger, unabhängig vom Gegenstand der Studie.",
      },
      structural_without_screening: "Q9 nennt strukturelle Auswirkungen, aber das Markt-Screening ist nicht dokumentiert: Die Studie wird als ILCD-Situation A behandelt, und Situation B muss als Sensitivitätsanalyse geprüft werden (ILCD Handbook 2010, §5.3).",
      structural_screening_missing: 'Q9 nennt strukturelle Wirkungen, aber ob das Markt-Screening dokumentiert ist, ist nicht beantwortet: Die Studie wird als ILCD-Situation A behandelt, mit Situation B als Sensitivitätsanalyse, bis das Screening dokumentiert ist (D4.1 §4.3.4; ILCD Handbook 2010, §5.3). Beantworten Sie die Folgefrage zu Q9, sobald es so weit ist.',
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
      flow_price_without_market: "Fluss „{{flow}}“: Q5 sagt, der Empfänger zahlt (Koppelprodukt), aber kein Dritter würde ihn kaufen. Bei einem einzigen Abnehmer entscheidet der Preis (D4.1 §8.3.3): Der Fluss ist ein Koppelprodukt, wenn der Empfänger zahlt, was ein unabhängiger Käufer zahlen würde, also den Preis des Produkts, das der Fluss ersetzt, abzüglich seiner Mehrkosten für die Nutzung; teilt die Zahlung nur Kosten, ist der Fluss Abfall, lastenfrei ab dem Punkt, an dem er erstmals einen nicht negativen Wert erreicht (§8.3.6 Step 4). Prüfen Sie den Preis gegen diesen Maßstab.",
      flow_freedom_to_act_settles: {
        co_product: "Fluss „{{flow}}“: Q5 lässt offen, wer wen bezahlt, und die Freedom-to-Act-Antwort (D4.1 §8.3.3) deutet auf ein Koppelprodukt (§8.3.2, Last geteilt). Die Konfiguration behält den ökonomischen Werttest mit Sensitivitätsanalyse, bis die Studie es bestätigt: Ändern Sie nicht, wer wen bezahlt; halten Sie diese Lesart in der Flussklassifizierung des Data Collection File fest (Freedom-to-Act und Schritt des Entscheidungsbaums), die die Studie dokumentiert.",
        waste: "Fluss „{{flow}}“: Q5 lässt offen, wer wen bezahlt, und die Freedom-to-Act-Antwort (D4.1 §8.3.3) deutet auf Abfall (lastenfrei ab dem Punkt, an dem er erstmals einen nicht negativen Wert erreicht, §8.3.6 Schritt 4). Die Konfiguration behält den ökonomischen Werttest mit Sensitivitätsanalyse, bis die Studie es bestätigt: Ändern Sie nicht, wer wen bezahlt; halten Sie diese Lesart in der Flussklassifizierung des Data Collection File fest (Freedom-to-Act und Schritt des Entscheidungsbaums), die die Studie dokumentiert.",
      },
      running_but_future: "Q2 sagt, dass die Austausche bereits stattfinden, aber Q8 legt den Betrieb in ein künftiges Jahr oder Q6b stuft die Schlüsseltechnologie unter TRL 7 ein. Ein laufender Austausch wird heute gemessen: prüfen Sie Q2, Q8 und Q6b. Bis dahin folgen das Referenzszenario und der Zeitpunkt der Kostenbewertung Q2, der künftige Hintergrund Q8 und Q6b.",
      design_without_screening: "Die Studie plant, erweitert oder restrukturiert ein Netz und wird als Situation A modelliert. D4.1 §4.2.3: solche Studien brauchen das ILCD-Marktscreening (Mattila et al. 2012); ohne es bleibt die Studie A, mit Situation B als Sensitivitätsanalyse. Dokumentieren Sie das Screening oder rechnen Sie B als Sensitivität.",
      flow_part2_chapter: "Fluss „{{flow}}“: Für ihn gelten die Sektorregeln von D4.1 Part 2 {{chapter}}; sie stehen unter Sektorregeln.",
      case_sector_without_flow: "Der Sektor des Falls gehört zu D4.1 Part 2 {{chapter}}, aber kein Fluss gibt dieses Kapitel an, daher werden seine Sektorregeln nicht aufgeführt. Die Kapitel folgen dem, was ausgetauscht wird: Geben Sie in der Flusstabelle für jeden Fluss den Part-2-Sektor an.",
      flow_configuration_unknown: "Fluss „{{flow}}“: Die Konfiguration „{{configuration}}“ gehört nicht zu D4.1 Part 2.",
      flow_configuration_other_chapter: "Fluss „{{flow}}“: Seine Konfiguration gehört zu {{chapter}}, nicht zum angegebenen {{declared}}; die Regeln beider Kapitel werden aufgeführt.",
      b_consequential_over_pef: 'Situation B verlangt eine konsequenzielle Modellierung gegen die marginale Technologie (D4.1 Tabelle 1), während die Ausrichtung auf EU-Politiken (Q4 = D) die Circular Footprint Formula des PEF verlangt, eine attributive Aufteilung. Das konsequenzielle Modell hat Vorrang; führen Sie die CFF als Sensitivitätsanalyse durch und erklären Sie beides in der Methodencharta (D4.1 §7.3.3; D4.2 §2.2).',
      b_lcc_not_consequential: 'Situation B: Die Ökobilanz substituiert die marginale Technologie (D4.1 Tabelle 1), während die ökologische LCC verdrängte Produkte zum durchschnittlichen Marktpreis dessen bewertet, was sie ersetzen (D4.2 §6.2): Dieses Tool hat keine konsequenzielle Fassung der Kostenrechnung. D4.2 §2.2 verlangt ein Paradigma, identisch zwischen Ökobilanz und LCC: Erklären Sie den Unterschied in der Methodencharta als methodische Abweichung und bewerten Sie die verdrängten Produkte in einer Sensitivitätsanalyse zum Preis des marginalen Anbieters.',
      flow_interdependent_but_marketable: 'Fluss „{{flow}}“: Q5 sagt, der Abgebende habe seinen Prozess für diesen Partner geändert, und der Fluss würde sich auch an andere verkaufen. Beides kann bei einem bestimmenden Koppelprodukt zutreffen (D4.1 §8.3.6, Schritt 2). Prüfen Sie: Wurde die Änderung für die Spezifikation dieses Partners vorgenommen, bleibt d; wurde sie für beliebige Käufer vorgenommen (ein Trockner, der die Pülpe zu handelbarem Futter macht), ist der Fluss ein abhängiges Koppelprodukt (Q5 = c, Substitution mit dem Qualitätsfaktor Q) und die Anlage eine eigens errichtete Anlage (Q12). Eine Notiz ändert Q5 nie.',
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
      obligations: "{{count}} zu dokumentierende Verpflichtungen ({{groups}}), ausgelöst durch Ihre Antworten. Das Data Collection File listet sie mit ihrem Auslöser auf, zusammen mit den Praktiken, die die Methode von jeder solchen Studie verlangt.",
      families: {
        IR: '{{count}} zur Integration der Methoden',
        CIR: '{{count}} durch Ihre Antworten ausgelöst',
        FU: '{{count}} zur funktionellen Einheit',
        B: '{{count}} zu den Grenzen',
      },
      title: 'Was jetzt zu tun ist',
      lead:
        'Methodische Praktiken, die Ihre Antworten verbindlich machen, plus offene Entscheidungen. Jede nennt den Grund für Ihren Fall.',
      provenance:
        "Die Bezeichnungen der Regeln und Entscheidungspunkte sind aus der englischen Tabelle des Motors übersetzt. Der Code neben jedem Eintrag — IR-01, CDP-02 — ist die Referenz, die in allen Sprachen gleich bleibt, und der englische Name steht daneben.",
      noTensions:
        "Für diese Antworten wurde kein kritischer Entscheidungspunkt zwischen den Methoden aufgeworfen. Die Verpflichtungen unten gelten trotzdem.",
      allClear:
        'Für diese Antworten gilt keine methodische Verpflichtung, und es wurde kein kritischer Entscheidungspunkt aufgeworfen. Nächster Schritt: Öffnen Sie das Data Collection File.',
      ctaHint: 'Das Data Collection File ist auf diese Konfiguration kalibriert: es fragt nur ab, was Ihr Fall braucht.',
      glossary: 'Drei Arten von Punkten, überall gleich benannt: Verpflichtungen sind Praktiken, die Ihre Antworten auslösen; Standardpraktiken werden von jeder Studie verlangt und im Data Collection File aufgeführt; Entscheidungspunkte sind Spannungen zwischen den Methoden, jeweils mit der Konvention, die das Tool vorschlägt.',
    },
    actionKind: {
      block: 'Blockierend',
      obligation: 'Zu dokumentieren',
      decision: 'Zu entscheiden',
      decisionResolved: 'Vom Tool vorgeschlagene Konvention — bestätigen Sie sie oder begründen Sie eine andere Wahl',
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
    title: 'Ihr Ergebnis',
    summary: {
      ilcdSituation: 'ILCD-Situation',
      lccType: 'LCC-Typ',
      slca: 'S-LCA',
      activatedNodes: 'Aktivierte Knoten',
      l1Blocks: 'Ausgelöste L1-BLOCK',
      obligations: 'Zu dokumentierende Pflichten',
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
    saveHint: 'Um den Fall auf dem Server zu behalten, braucht es ein kostenloses Konto; ohne Konto bleibt er nur in diesem Browser.',
    scenariosBox: 'Definierte Alternativszenarien: {{count}}. Vergleichen Sie sie mit dem Fall:',
  },

  scenariosResult: {
    title: 'Szenarienvergleich',
    flowQ5Row: 'Wer zahlt wem: {{flow}}',
    empty: 'Noch kein Szenariovergleich. Definieren Sie im Fragebogen ein oder mehrere alternative Szenarien und klicken Sie dann auf der Ergebnisseite auf „Szenarien ausführen“.',
    description: "Der Fall und {{n}} alternative(s) Szenario(s), jeweils von der Engine gerechnet. Zellen, die vom Fall abweichen, sind hervorgehoben.",
    backToResult: 'Zurück zum Einzelergebnis',
    columns: {
      scenario: 'Szenario',
      ilcd: 'ILCD',
      lccType: 'LCC-Typ',
      slca: 'S-LCA',
      activated: "Methodische Knoten",
      blocks: "Blockaden",
      obligations: 'Zu dokumentierende Pflichten',
      cdps: "Entscheidungspunkte",
    },
    baselineLabel: "Der Fall",
    diffSuffix: '(Diff)',
    overridesPlaceholder: "z. B. {\"q2\": \"B\"} oder {\"q3\": {\"env\": true, \"eco\": true}}",
    overridesParseError: 'Overrides müssen gültiges JSON für {{id}} sein',
    overridesNotAllowed: 'Ein Szenario ändert nur Antworten des Fragebogens (die unter „Frage“ aufgeführten): Die Flüsse und das, was die Engine schreibt, lassen sich hier nicht ändern. Um einen Fluss zu beschreiben, der anderswohin geht, notieren Sie ihn in den Szenarioannahmen dieses Flusses im Data Collection File.',
    failed: 'Dieses Szenario konnte nicht berechnet werden, es gibt also nichts zu vergleichen: {{detail}}',
    whatChanges: "was sich gegenüber dem Fall ändert",
    noChange: "An Konfiguration und Verpflichtungen ändert sich nichts.",
    addedRules: "Hinzugekommene Verpflichtungen",
    removedRules: "Weggefallene Verpflichtungen",
    description_one: 'Der Fall und {{count}} Alternativszenario, jeweils vom Motor berechnet. Zellen, die vom Fall abweichen, sind hervorgehoben.',
    description_other: 'Der Fall und {{count}} Alternativszenarien, jeweils vom Motor berechnet. Zellen, die vom Fall abweichen, sind hervorgehoben.',
  },


  reasoning: {
    activatedNodes: 'Aktivierte Knoten ({{count}})',
    pillarConfigs: 'Pillar-Konfigurationen',
    noPillarValues: 'Keine Pillar-Werte geschrieben.',
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
    title: "Ein veröffentlichtes Beispiel laden",
    help: "Lädt die Antworten eines veröffentlichten Falls in den Fragebogen, damit Sie sehen, was das Tool aus einer echten Studie ableitet.",
    loadButton: 'Preset laden',
    rationaleToggle: 'Warum diese Antworten? (Compilation-Rationale)',
    replaceConfirm: "Das Laden dieses Beispiels ersetzt die Antworten, an denen Sie arbeiten. Speichern Sie Ihren Fall zuerst, wenn Sie ihn behalten möchten. Beispiel laden?",
    loaded: "Beispiel geladen: {{name}}",
  },

  toast: {
    pipelineCompleted: "Konfiguration bereit",
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
    subtitle: 'Zum Speichern von Fällen auf dem Server und zum Teilen braucht es ein Konto. Einen gespeicherten Fall liest nur, wer seinen Link hat, und erst nachdem Sie ihn geteilt haben.',
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
      invalidEmail: 'Ungültige E-Mail-Adresse: Prüfen Sie den Teil nach dem @ (z. B. name@firma.de).',
      invalidInput: 'Prüfen Sie E-Mail und Passwort (mindestens 8 Zeichen).',
    },
    roles: {
      admin: 'Administrator',
      analyst: 'Konto',
    },
  },

  scoringPending: {
    title: "Noch keine Ergebnisse",
    body:
      "Dieses Tool berechnet keine Umwelt-, Kosten- oder Sozialkennzahlen. Wer die Studie durchführt, berechnet sie; werden sie diesem Fall hinzugefügt, erscheinen sie hier.",
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
          'Dieses Tool berechnet die Zahlen nicht, und niemand berechnet sie automatisch für Ihren Fall. Wenn ein Analyst die Studie mit dem Data Collection File durchführt, können seine Ergebnisse hier geladen werden: Umwelt- und Wirtschaftsindikatoren, um zu beurteilen, ob sich der Austausch lohnt.',
      },
      community: {
        whatYouSee:
          "Was diese Seite Ihnen heute sagt: welche Flüsse die Unternehmen austauschen, und ob diese Studie soziale Wirkungen überhaupt untersucht.",
        whenScoring:
          'Dieses Tool berechnet die Zahlen nicht, und niemand berechnet sie automatisch für Ihren Fall. Wenn ein Analyst die Studie mit dem Data Collection File durchführt, können seine Ergebnisse hier geladen werden: soziale Indikatoren — Beschäftigte, lokale Gemeinschaft — und Umweltindikatoren, jeweils mit der Gruppe, die sie betreffen.',
      },
      authority: {
        whatYouSee:
          "Was diese Seite Ihnen heute sagt: wie die Bewertung angelegt ist, welche Compliance-Signale der Fall angibt und wie konzentriert die wichtigsten Wechselwirkungen sind.",
        whenScoring:
          'Dieses Tool berechnet die Zahlen nicht, und niemand berechnet sie automatisch für Ihren Fall. Wenn ein Analyst die Studie mit dem Data Collection File durchführt, können seine Ergebnisse hier geladen werden: die Umweltzahlen und, wo die Studie sie enthält, die gesellschaftlichen Kosten.',
        scope: "Wie konzentriert die wichtigsten Wechselwirkungen sind: {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "Was diese Seite Ihnen heute sagt: welche Materialien diese Symbiose wieder in Umlauf bringt und ob ökologische und soziale Wirkungen untersucht werden.",
        whenScoring:
          'Dieses Tool berechnet die Zahlen nicht, und niemand berechnet sie automatisch für Ihren Fall. Wenn ein Analyst die Studie mit dem Data Collection File durchführt, können seine Ergebnisse hier geladen werden: die Umwelt- und Sozialindikatoren der Kette hinter dem Produkt.',
        productCaveat:
          "Diese Bewertung beschreibt den Austausch zwischen den Unternehmen, nicht das Endprodukt, das Sie kaufen: das Werkzeug fragt nie, welches Produkt es ist.",
      },
    },
    noVerdict: "Kein Fall geöffnet. Füllen Sie den Fragebogen aus oder laden Sie einen gespeicherten Fall, um diese Ansicht zu sehen.",
    notAssessed: {
      environmental: 'Diese Studie bewertet keine Umweltwirkungen: Die Umweltdimension wurde beim Anlegen des Falls ausgeschaltet.',
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
        'Vollständige technische Sicht auf die methodische Konfiguration. Die Zahlen (Emissionen, Kosten) entstehen nicht hier: Wer die Studie durchführt, berechnet sie aus dem Data Collection File, und sie können in diesen Fall geladen werden.',
      community:
        'Wie die Wirkungen auf die Gegend und auf die Menschen in der Nähe der Anlagen untersucht werden: Transporte, lokale Luft, Wasser und Boden, was auf Felder ausgebracht wird, ob Anwohner gehört werden. Es gibt noch keine Ergebnisse.',
      authority:
        'Wie die Bewertung angelegt ist: Kosten, gemeinsame Anlagen, Referenzszenario, öffentliche Aussagen, Zeithorizont, soziale Wirkungen.',
      'end-user':
        'Worum es in diesem Fall geht und was bewertet wird. Ergebnisse gibt es noch nicht.',
    },
    verdictTitle: 'Methodische Konfiguration',
    configTitle: 'Worauf diese Studie ausgelegt ist',
    labels: {
      ilcd: 'ILCD-Situation',
      lcc: 'LCC-Typ',
      slca: 'S-LCA-Aktivierung',
    },
    scoringTitle: 'Ergebnisse',
    scoringPendingTitle: 'Noch keine Ergebnisse',
    scoringPendingBody:
      'Dieses Tool berechnet keine Umwelt-, Kosten- oder Sozialkennzahlen. Wer die Studie durchführt, berechnet sie; werden sie diesem Fall hinzugefügt, erscheinen sie hier.',
    scoringEmpty: 'Keine für diesen Stakeholder relevanten Indikatoren.',
    indicatorPending: 'ausstehend',
    engineDetailsTitle: 'Was die Analyse für Sie dokumentiert',
    obligations_one: "{{count}} zu dokumentierende Verpflichtung",
    obligations_other: "{{count}} zu dokumentierende Verpflichtungen",
    cdpFlagsCount_one: '{{count}} Entscheidungspunkt, den die Analyse klären muss',
    cdpFlagsCount_other: '{{count}} Entscheidungspunkte, die die Analyse klären muss',
    complianceTitle: 'Compliance-Signale',
    compliance: {
      peerReview: 'Unabhängige Begutachtung: {{status}}',
      pef: 'EU-PEF-Ausrichtung (Q4=D): {{status}}',
      pefC2: "EU-PEF-Ausrichtung (Q4=D): nicht angewandt, der Bericht eines Unternehmens nutzt Allokation statt der Circular Footprint Formula (ILCD-Situation C2)",
      publicClaim: 'Zur Veröffentlichung bestimmte vergleichende Aussage (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Regionales Dashboard',
    title: 'Regionales / sektorales Dashboard',
    subtitle:
      'Wie viele in diesem Tool gespeicherte Fälle in jede Situation, jeden Kostenrechnungstyp, jeden Sektor und jede Konzentration der Interaktionen fallen. Alle gespeicherten Fälle aus allen Regionen: Ein Filter nach Region ist noch nicht verfügbar.',
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
      byLccType: 'Nach Kostenrechnungstyp',
      bySector: 'Nach Sektor',
      byScope: 'Nach Konzentration der Interaktionen',
      byIlcd: 'Nach ILCD-Situation',
    },
    mostCommon: 'Am häufigsten',
    noneKey: 'nicht beantwortet',
    noCosting: 'keine Kostenrechnung',
  },

  obligations: {
    empty: "Für diesen Fall ist nichts zu dokumentieren.",
    lead:
      "{{total}} zu dokumentierende Punkte für diesen Fall: die {{rules}} durch Ihre Antworten ausgelösten Verpflichtungen (die auf der Ergebnisseite gezählten) und {{mandates}} Praktiken, die die Methode von jeder solchen Studie verlangt. Jeder ist eine Verpflichtung, im LCSA-Bericht dokumentiert zu werden.",
    because: "Gilt, weil:",
    notApplicable: "Hier nicht anwendbar: {{fields}} — diese Methode ist in Q3 deaktiviert.",
    origin: {
      mandate: 'Von der Methode verlangt',
      rule: 'Zwischen den Methoden verlangt',
    },
  },
  dcf: {
    viewer: {
      notActive: "Dieser Abschnitt ist für diesen Fall nicht aktiv.",
      nodeId: "Code",
      method: "Methode",
      statement: "Aussage (Text der Deliverables, Englisch)",
      seeAbove: "Siehe das Diagramm oben.",
      fieldsCount_one: "({{count}} Feld)",
      fieldsCount_other: "({{count}} Felder)",
      colField: "Angabe",
      colRequired: "Pflicht",
      colValues: "Mögliche Werte",
      colWhy: "Warum gefragt",
      always: "immer",
      whoCompanies: 'Wird von den Mitarbeitenden der Unternehmen ausgefüllt',
      whoAnalyst: 'Entscheidet der Analyst, der die Studie durchführt',
      whoBoth: 'Die Unternehmen antworten, es entscheidet die Person, die die Studie durchführt',
      forAnalyst: 'für die Person, die die Studie durchführt',
    },
    diagram: { whoGives: "Wer gibt es ab?\n({{flow}})", whoReceives: "Wer nimmt es an?\n({{flow}})" },
    noCase: { title: 'Noch kein Fall', desc: 'Das Data Collection File wird aus Ihrer Bewertung erstellt: Füllen Sie zuerst den Fragebogen aus (oder öffnen Sie einen gespeicherten Fall) und kommen Sie dann hierher zurück.', cta: 'Fragebogen öffnen', received: 'Haben Sie die Arbeitsmappe von einer Analystin oder einem Analysten erhalten? Dann gibt es hier nichts zu tun: Füllen Sie die Excel-Datei aus und schicken Sie sie zurück.' },
    derivedField: "von der Engine gefüllt",
    obligationsTitle: "Zu dokumentierende methodische Entscheidungen",
    navLink: 'Datenerhebung',
    title: 'Data Collection File',
    subtitle:
      'Auf die abgeleitete Konfiguration abgestimmt. Laden Sie die Excel-Datei herunter, um mit den Partnern die Daten zum Austausch und zur Referenz jedes Akteurs zu erheben; das Prozessinventar jeder Anlage wird getrennt erhoben.',
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
      'Das Data Collection File beschreibt den Austausch, nicht die Prozesse: Füllen Sie die leeren Zeilen offline aus (oder verteilen Sie sie an die Partner) und geben Sie die Datei an den Analysten zurück, der die Studie leitet und die Anlageninventare mit der Ökobilanz- und Kostensoftware erhebt.',
    openButton: 'Data Collection File öffnen',
    tabOverview: 'Übersicht',
    tabNetworkBuilder: 'Netzwerk-Editor',
    socialDeferred: 'Das soziale Inventar wird nicht in dieser Datei erhoben: Es folgt D4.3 mit eigenen Instrumenten (Fragebögen, Interviews je Stakeholdergruppe).',
    guidedIntro: 'Hier sehen Sie die Fragen, die die Excel-Datei den Unternehmen stellt. Sie müssen sie jetzt nicht ausfüllen: Laden Sie die Datei herunter und geben Sie sie weiter.',
    unsavedCase: 'Die Dateien enthalten das gezeichnete Netzwerk noch nicht: Speichern Sie den Fall (ein Konto ist nötig), um es aufzunehmen.',
    unsavedNetwork: 'Das Netzwerk hat ungespeicherte Änderungen: Speichern Sie das Netzwerk, um sie in die Dateien aufzunehmen.',
    filesNote: 'Excel: die Arbeitsmappe, die die Unternehmen ausfüllen (mit Excel oder LibreOffice öffnen, am besten am Computer). Word: das Begleitdokument, das sie erklärt.',
    savedDiverged: 'Diese Dateien folgen der gespeicherten Version des Falls. Speichern Sie Ihre Änderungen auf der Ergebnisseite, um Dateien herunterzuladen, die dieser Seite entsprechen.',
    changes: 'Gegenüber der gespeicherten Version: {{removed}} zu dokumentierende Entscheidungen entfallen, {{added}} kommen hinzu.',
    changesFieldsGone: 'Nicht mehr abgefragte Felder: {{fields}} — die eingegebenen Werte bleiben erhalten, werden aber nicht exportiert.',
    changesFieldsNew: 'Jetzt abgefragte Felder: {{fields}}.',
    changesNone: 'Das Data Collection File fragt dasselbe ab wie die gespeicherte Version.',
    goSaveChanges: 'Zum Ergebnis, um die Änderungen zu speichern',
  },

  networkDiagram: {
    counts: '{{actors}} Akteure · {{flows}} Flüsse',
    actors_one: '{{count}} Akteur',
    actors_other: '{{count}} Akteure',
    flows_one: '{{count}} Fluss',
    flows_other: '{{count}} Flüsse',
    inactive: 'Das Netzwerkdiagramm gehört nicht zur Konfiguration dieses Falls.',
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
      step2: 'Klicken Sie einen Fluss in der Liste unter der Zeichnung an und ziehen Sie dann vom unteren Punkt des abgebenden Akteurs zum oberen Punkt des aufnehmenden: Dieser Pfeil ist eine Zeile der Flussmatrix.',
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
    whichFlow: 'Welcher Fluss ist dieser Pfeil?',
    allDrawn: 'Alle Flüsse des Fragebogens sind gezeichnet. Um einen hinzuzufügen, ergänzen Sie ihn in der Flusstabelle des Fragebogens und ermitteln Sie die Konfiguration neu.',
    sameActor: 'Ein Pfeil führt von einem Akteur zu einem anderen: Herkunft und Ziel müssen verschiedene Akteure sein.',
    armed: 'Nächster Pfeil: „{{name}}“. Ziehen Sie vom unteren Punkt des abgebenden Akteurs zum oberen Punkt des aufnehmenden Akteurs, oder wählen Sie die beiden Akteure im Seitenfeld.',
    drawnTitle: 'Gezeichnete Flüsse',
    strayTitle: 'Nicht im Fragebogen',
    strayHint: 'Die Konfiguration deckt diese Flüsse nicht ab. Ergänzen Sie sie in der Flusstabelle des Fragebogens oder entfernen Sie sie.',
    fromQuestionnaire: 'Name und „wer zahlt wen“ werden im Fragebogen festgelegt: Ändern Sie sie dort und ermitteln Sie die Konfiguration neu.',
    notInQuestionnaire: 'Nicht im Fragebogen: Die Konfiguration deckt diesen Fluss nicht ab. Ergänzen Sie ihn dort und entfernen Sie diesen Pfeil.',
    reverse: 'Richtung umkehren',
    unwire: 'Pfeil aus der Zeichnung nehmen',
    confirmRemoveFlow: '„{{name}}“ und die eingegebenen Werte entfernen?',
    confirmRemoveActor: '„{{name}}“ entfernen?',
    confirmRemoveActorFlows_one: '„{{name}}“ entfernen? Sein Pfeil kommt mit seinen Werten zurück zu den noch nicht gezeichneten Flüssen.',
    confirmRemoveActorFlows_other: '„{{name}}“ entfernen? Seine {{count}} Pfeile kommen mit ihren Werten zurück zu den noch nicht gezeichneten Flüssen.',
    panelActor: 'Akteur',
    panelFlow: 'Fluss',
    panelClassification: 'Einstufung und Substitution (entscheidet die Analyse)',
    classificationNote: 'Rechtliche und wirtschaftliche Prüfungen dieses Flusses und, falls er ein Produkt ersetzt, was er ersetzt. Dieselben Spalten stehen in der Excel-Datei.',
    signInToSave: 'Melden Sie sich mit dem Konto an, das diesen Fall gespeichert hat, um das Netzwerk zu speichern.',
    missingGoTo: 'Zum ersten leeren Pflichtfeld',
    givesReceives: 'gibt {{gives}} ab · nimmt {{receives}} auf',
    selectHint:
      'Wählen Sie einen Akteur oder einen Fluss, um dessen Felder zu bearbeiten.',
    removeRow: 'Entfernen',
    unwiredTitle: 'Noch nicht gezeichnete Flüsse',
    unwiredHint: 'Diese Flüsse stammen aus dem Fragebogen. Klicken Sie einen an und verbinden Sie dann den abgebenden mit dem aufnehmenden Akteur, oder klicken Sie ihn an und wählen Sie die beiden Akteure im Seitenfeld (so geht es auf dem Telefon).',
    roles: {
      partner: 'Partner',
      producer: 'Erzeuger',
      consumer: 'Abnehmer',
      facilitator: 'Vermittler',
      regulator: 'Behörde',
      intermediary: 'Zwischenhändler',
    },
  },

  cases: {
    signInToSave: 'Zum Speichern eines Falls auf dem Server braucht es ein Konto. Melden Sie sich hier an oder registrieren Sie sich; Ihr Entwurf bleibt in diesem Browser. Ein gespeicherter Fall ist nur öffentlich, wenn Sie ihn teilen.',
    signInToList: "Ihre gespeicherten Fälle erscheinen hier nach der Anmeldung. Geteilte Berichte öffnen Sie über den erhaltenen Link.",
    publicLink: "Öffentlicher Link",
    navLink: 'Meine Fälle',
    title: 'Meine Fälle',
    intro: 'Auf dem Server gespeicherte Fälle. „Öffnen“ zeigt den Fall (sein Ergebnis, wenn es schon ermittelt ist); „Antworten anpassen“ öffnet seinen Fragebogen, und „Änderungen speichern“ im Ergebnis sichert, was Sie ändern. Löschen entfernt einen Fall endgültig.',
    loadReplaceConfirm: 'Das Laden dieses Falls ersetzt die Antworten, an denen Sie arbeiten und die nicht gespeichert sind. Fortfahren?',
    empty: 'Noch keine gespeicherten Fälle. Speichern Sie einen Fall aus dem Fragebogen oder der Ergebnisseite.',
    columns: {
      name: 'Name',
      situation: 'ILCD-Situation',
      updated: 'Aktualisiert',
    },
    loadButton: 'Öffnen',
    editButton: 'Antworten anpassen',
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
    saveFirstButton: 'Fall speichern…',
    saveChanges: 'Änderungen speichern',
    saveChangesConfirm: 'Den gespeicherten Fall „{{name}}“ mit dieser Konfiguration überschreiben? Das gezeichnete Netzwerk bleibt erhalten.',
    saveChangesSuccess: 'Änderungen in „{{name}}“ gespeichert',
    saveChangesForbidden: 'Sie können nur Ihre eigenen Fälle aktualisieren: Speichern Sie ihn als neuen Fall.',
    saveAsDialog: 'Als neuen Fall speichern. Das für „{{name}}“ gezeichnete Netzwerk wird mitkopiert. Wählen Sie einen Namen für den neuen Fall.',
    networkNotCopied: 'Der Fall ist gespeichert, aber das Netzwerk konnte nicht kopiert werden: Öffnen Sie das Data Collection File und speichern Sie das Netzwerk.',
    sharedYes: 'Geteilt: öffentlicher Link aktiv',
    sharedNo: 'Privat',
  },
}

export default de
