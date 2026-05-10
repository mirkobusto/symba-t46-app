// Deutsch. Methodische Begriffe LCA/LCC/S-LCA + Akronyme ILCD/PEF/CSRD/MFCA
// /CBA/TEA/IS-01..05 unverändert (normativ).

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
  },

  layout: {
    brand: 'SYMBA T4.6',
    about: 'Über',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Drücken Sie {{key}} für Tastenkürzel',
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
      'Beantworten Sie sieben kurze Fragen zu Ihrer industriellen Symbiose-Fallstudie. Die Entscheidungs-Engine leitet den terminalen IS-Pathway (IS-01..IS-05) und eine vollständige methodische Konfiguration aus den 186 Phase-1-Knoten der Deliverables D4.1, D4.2 und D4.3 sowie den 40 Cross-Method-Validierungsregeln ab.',
    startButton: 'Neue Bewertung starten',
  },

  about: {
    title: 'Über',
    p1:
      'SYMBA T4.6 — IS Assessment App ist das operative Werkzeug von WP4 / T4.6 des SYMBA Horizon Europe Projekts. Es implementiert die Phase-1-Atomknoten-Entscheidungs-Engine, abgeleitet aus den Deliverables D4.1 (LCA), D4.2 (LCC) und D4.3 (S-LCA), und klassifiziert eine industrielle Symbiose-Fallstudie in einen von fünf terminalen IS-Pathways (IS-01..IS-05) und liefert eine vollständige methodische Konfiguration für LCA, LCC und S-LCA.',
    p2:
      'Die 7 Benutzerfragen (Q1-Q7) steuern die Aktivierung der 186 Phase-1-Knoten plus 40 Cross-Method-Validierungsregeln (18 IR + 10 CIR + 5 FU + 7 B). Die L3-Durchsetzung zur Reporting-Zeit (IR-04 + IR-10) plus 12 Critical Decision Points machen Cross-Method-Spannungen sichtbar.',
    p3:
      'Dieser MVP-Build verbindet den Fragebogen mit POST /api/pipeline/run. Pillar-Konfigurationsanzeige, erweiterte Overrides und das „Show reasoning"-Panel sind alle aktiv.',
  },

  error: {
    title: 'Etwas ist schiefgelaufen',
    backHome: 'Zurück zur Startseite',
    fallback: 'Unerwarteter Fehler',
  },

  questionnaire: {
    title: 'Fragebogen',
    intro:
      'Sieben Fragen zu Ihrer industriellen Symbiose-Fallstudie. Q1 und mindestens eine Q3-Dimension sind erforderlich; der Rest ist optional, verbessert aber die Engine-Ausgabe.',
    runButton: 'Pipeline ausführen',
    runningButton: 'Läuft…',
    resetButton: 'Entwurf zurücksetzen',
    confirmReset: 'Alle Antworten verwerfen und neu beginnen? Dies kann nicht rückgängig gemacht werden.',
    q1Required: 'Q1 ist erforderlich.',
    shortcutTip: 'Tipp: Strg/⌘+Eingabe zum Ausführen',

    q1: {
      title: 'Q1 — Was analysieren Sie? *',
      help:
        'Wählen Sie die nächste Übereinstimmung. Bei Mehrdeutigkeit fragen Sie: Wer ist das SUBJEKT des Berichts? (Erforderlich.)',
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
    },

    q2: {
      title: 'Q2 — In welcher Phase befindet sich das System?',
      details:
        'A — bestehender Austausch oder Park, der seit Jahren läuft; primäre Werksdaten verfügbar. (Z. B. Kalundborg heute, Sokka 2011 berichtet ein bestehendes IES.) ' +
        'B — kürzlich gebaut oder in Inbetriebnahme; Daten teilweise gemessen, teilweise Engineering-Schätzung. ' +
        'C — Pre-Construction-Designstudie; keine gemessenen Betriebsdaten; nur Engineering-Modelle. (Z. B. Daddi 2017 Ex-ante-Studie.) ' +
        'D — operative Baseline + ein oder mehrere Zukunfts-„What-if"-Szenarien zum Vergleich (z. B. Erweiterung, TRL-Ramp-up, dekarbonisiertes Stromnetz). Bei D wird der Editor für alternative Szenarien unten aktiviert.',
      options: {
        A: { label: 'A. Operativ', description: 'Existiert und läuft seit Jahren (echte operative Daten).' },
        B: { label: 'B. Im Bau', description: 'Im Bau oder kürzlich in Betrieb genommen.' },
        C: { label: 'C. Designphase', description: 'Nur in der Designphase (keine operativen Daten).' },
        D: { label: 'D. Baseline + Alternativen', description: 'Bestehende Baseline + N alternative Zukunftsszenarien.' },
      },
    },

    q3: {
      title: 'Q3 — Welche Nachhaltigkeitsdimensionen einbeziehen? *',
      help: 'Mindestens eine ist erforderlich. Standard: ENV + ECO.',
      details:
        'ENV — Umwelt-Lebenszyklusanalyse (LCA): Auswirkungen auf Klima, Ökosysteme, Ressourcennutzung. Fast immer ausgewählt. ' +
        'ECO — ökonomische Dimension; Standard-Tool ist LCC (Life Cycle Costing), aber die Engine akzeptiert auch MFCA (Material Flow Cost Accounting), CBA (Cost-Benefit Analysis) oder TEA (Techno-Economic Analysis), je nach Q4 und Reporting-Kontext. ' +
        'SOC — S-LCA. Aktivierung löst eine längere Regelkette aus (Stakeholder-Kategorien Worker / lokale Gemeinschaft / Wertschöpfungskette) und erzwingt L1 BLOCK 2, wenn der erweiterte Override slca_framework_override auf „absolute" gesetzt ist. ' +
        'Die meisten veröffentlichten IS-Papers laufen nur mit ENV (z. B. Sokka, Daddi); einige koppeln ENV+ECO (Hashimoto, Wiktor); nur eine Handvoll fügt SOC hinzu.',
      warning: 'Mindestens eine Dimension auswählen, um fortzufahren.',
      env: 'Umwelt (LCA)',
      eco: 'Ökonomisch (LCC / MFCA / CBA / TEA)',
      soc: 'Sozial (S-LCA)',
    },

    q4: {
      title: 'Q4 — Wofür ist der Bericht?',
      help: 'Mehrfachauswahl. Einige Verwendungen kombinieren sich (z. B. D + E für ein EU-PEF-Paper).',
      details:
        'A — interne Nutzung: Management-Dashboards, F&E-Screening, Werks-Entscheidungen. Wenige methodische Einschränkungen. ' +
        'B — externe Kommunikation OHNE vergleichende Aussagen (Nachhaltigkeitsberichte, Marketing-Broschüren ohne „besser als X"-Aussage). ' +
        'C — öffentliche AUSSAGE zur Umweltüberlegenheit gegenüber einer Alternative (z. B. „dieser Zement ist grüner als OPC"). Aktiviert die obligatorische ISO-14044-Critical-Review durch 3+ unabhängige Experten und deaktiviert Gewichtung. Mit Vorsicht verwenden. ' +
        'D — Alignment mit EU-Politikinstrumenten (CSRD-Disclosure, ESPR-Digital-Product-Passport, PEFCR-Kategorieregeln). Erzwingt die PEF Circular Footprint Formula via CIR-05. ' +
        'E — akademische peer-reviewte Publikation. Erfordert volle Transparenz (Datenquellen, Allokationsentscheidungen, Sensitivität). Oft mit B oder D kombiniert. ' +
        'Mehrfachauswahl möglich: Ein typisches PEF-Paper wählt D + E.',
      options: {
        A: { label: 'A. Intern', description: 'Interne Nutzung (Management, F&E, Planung).' },
        B: { label: 'B. Extern (kein Claim)', description: 'Externe Kommunikation ohne vergleichende Aussagen.' },
        C: {
          label: 'C. Öffentlicher Überlegenheits-Claim',
          description: 'Öffentliche Aussage zur Umweltüberlegenheit.',
          warn: 'Aktiviert die OBLIGATORISCHE Panel-Review von 3+ unabhängigen Experten (ISO 14044), keine Gewichtung erlaubt.',
        },
        D: {
          label: 'D. EU-Politik-Alignment',
          description: 'EU-Politik-Alignment (CSRD, ESPR, PEFCR).',
          warn: 'Aktiviert die PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Akademische Publikation', description: 'Akademische peer-reviewte Publikation.' },
      },
    },

    q5: {
      title: 'Q5 — Art jedes symbiotischen Flusses (pro Fluss)',
      help:
        'Fügen Sie eine Zeile pro symbiotischem Hauptfluss hinzu und wählen Sie dessen Q5-Kategorie. Pflicht für Q1 ∈ {A, B, D}; sonst optional.',
      details:
        'Wählen Sie für jeden Hauptfluss zwischen Akteuren (Wärme, CO₂, Schlacke, Abwasser, Wasserstoff…) die ökonomische Beziehung: ' +
        'a — A zahlt B, um den Fluss abzunehmen (Fluss ist ABFALL für A): typischer Entsorgungsvertrag. Aktiviert Allokationsregeln im Abfall-Paradigma. ' +
        'b — Fluss KOSTENFREI ausgetauscht (mehrdeutiger Status): Engine routet zur Free-Flow-Disambiguierungskette. ' +
        'c — B zahlt A für den Fluss (Fluss ist CO-PRODUKT für A): aktiviert ökonomische Allokationsregeln und den PEF Circular Footprint Formula Pfad. ' +
        'd — INTERDEPENDENTER Fluss: keine Seite könnte ohne die andere arbeiten; als integriertes System behandelt, oft mit System Expansion. ' +
        'e — AGGREGIERT / Black-box: der veröffentlichte Fall liefert keine Pro-Fluss-Details (typisch für aggregierte IES-Papers wie Sokka 2011). ' +
        'Für Policy-Studien Q1=C ist Q5 üblicherweise optional.',
    },

    q6a: {
      title: 'Q6a — Sektor',
      help:
        '14 kanonische Sektoren laut WorkingDoc §3 + Sonstige. Sektor-spezifische Knotenaktivierungen (z. B. lca_mc_30 wastewater) lesen dieses Enum.',
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
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL der dominanten oder kritischen Technologie im symbiotischen Netzwerk. Bestimmt die Wahl der Inventory-Datenqualität (gemessen vs Literatur vs Engineering-Schätzung) und das Unsicherheitsbudget downstream. ' +
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
    },

    q7: {
      title: 'Q7 — Geografische Verteilung',
      help: 'Wenn Akteur-Koordinaten später geladen werden, kann dies automatisch abgeleitet und als Info angezeigt werden.',
      details:
        'Die geografische Verteilung verändert das relative Gewicht der Transporte im Inventory und kann CIR-03 aktivieren, wenn der erweiterte Override transport_sensitive=true ist. ' +
        'A — co-located in einem Standort (<5 km, z. B. Kalundborg, Öko-Industriepark). Transport ist im Wesentlichen vernachlässigbar. ' +
        'B — regionales Cluster (5-100 km, gleiche Region — typisch Sokka 2011 / Hashimoto). ' +
        'C — weiträumig, regionsübergreifend oder grenzüberschreitend (>100 km). Transportmodus und -distanz werden zu nicht-trivialen Inventory-Posten. ' +
        'D — multi-skalige nationale oder industrieweite Programme (Q1=C-Politikstudien, geografisch variabel).',
      options: {
        A: { label: 'A. Co-located', description: 'Eco-park, <5 km zwischen Akteuren.' },
        B: { label: 'B. Regional', description: '5-100 km, gleiche Region.' },
        C: { label: 'C. Weiträumig', description: '>100 km, regionsübergreifend oder grenzüberschreitend.' },
        D: { label: 'D. Multi-Skala', description: 'National / industrieweit, variable Distanzen.' },
      },
    },

    q2dCard: {
      title: 'Q2-D — Alternative Szenarien',
      help:
        'Definieren Sie ein oder mehrere alternative Zukunftsszenarien zum Vergleich mit der Baseline. Aktiviert den dynamischen SSP/RCP-Background und die Szenarien-Matrix-Unterstützung downstream.',
    },

    advancedCard: {
      title: 'Erweiterte Overrides (Expertenmodus)',
      activeKeys_one: '{{count}} aktiver Schlüssel',
      activeKeys_other: '{{count}} aktive Schlüssel',
    },
  },

  flows: {
    emptyHint: 'Keine Flüsse. Fügen Sie mindestens einen hinzu, um Q5 pro Fluss zu charakterisieren.',
    headers: { id: 'ID', name: 'Name', q5: 'Q5' },
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
      "Fügen Sie eine Zeile pro alternativem Szenario hinzu, das mit der Baseline verglichen werden soll. Das Overrides-Dict (Q-Antwort-Deltas vs Baseline) wird im erweiterten Editor konfiguriert; vorerst trägt jedes Szenario eine leere Overrides-Map.",
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
      asset_lifetime: 'Jahre; >15 aktiviert lca_mc_21, lcc_hc_23, CIR-01',
      transport_sensitive: 'Boolean; true aktiviert CIR-03',
      network_nodes: 'Integer; ≥3 (mit Q1=B + interdependent_flows) aktiviert CIR-04',
      interdependent_flows: 'Boolean; true (mit Q1=B + network_nodes≥3) aktiviert CIR-04',
      frontier_categories_active: 'Boolean; true aktiviert CIR-06',
      is_specific_capital_goods: 'Boolean; true aktiviert IR-13 / B-06 / CIR-08',
      multi_actor: 'Boolean; true (mit Q1∈{B,C}) aktiviert FU-02',
    },
  },

  result: {
    title: 'Engine-Ausgabe',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'ILCD-Situation',
      lccType: 'LCC-Typ',
      slca: 'S-LCA',
      activatedNodes: 'Aktivierte Knoten',
      l1Blocks: 'Ausgelöste L1-BLOCK',
      l2Violations: 'L2-Verletzungen',
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
      pathway: 'Pathway',
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
      run: 'Pipeline ausführen',
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
    pipelineCompleted: 'Pipeline abgeschlossen in {{ms}} ms — Pathway {{pathway}}',
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

  cases: {
    navLink: 'Meine Fälle',
    title: 'Meine Fälle',
    intro: 'Auf dem Server gespeicherte Fälle. Laden, um den Fragebogen zu befüllen, oder löschen, um endgültig zu entfernen.',
    empty: 'Noch keine gespeicherten Fälle. Speichern Sie einen Fall aus dem Fragebogen oder der Ergebnisseite.',
    columns: {
      name: 'Name',
      pathway: 'Pathway',
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
