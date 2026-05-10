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
      warning: 'Mindestens eine Dimension auswählen, um fortzufahren.',
      env: 'Umwelt (LCA)',
      eco: 'Ökonomisch (LCC / MFCA / CBA / TEA)',
      soc: 'Sozial (S-LCA)',
    },

    q4: {
      title: 'Q4 — Wofür ist der Bericht?',
      help: 'Mehrfachauswahl. Einige Verwendungen kombinieren sich (z. B. D + E für ein EU-PEF-Paper).',
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
    },

    q6a: {
      title: 'Q6a — Sektor',
      help:
        'Aktuell 5 Platzhalterwerte; die vollen 14 Sektoren kommen mit dem sector_overlays.json-Wiring.',
      options: {
        none: '(keiner)',
        wastewater_biofactories: 'Abwasser / Schlämme / Biofactories',
        agri_food: 'Agrar/Lebensmittel / Bioraffinerien',
        process_industry: 'Prozessindustrie (Chemie, Zement, Stahl, etc.)',
        other: 'Andere (bitte angeben)',
      },
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
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
    },
    confirmStartFresh: 'Aktuellen Fall verwerfen und einen neuen starten? Dies kann nicht rückgängig gemacht werden.',
    noResult: { title: 'Noch kein Ergebnis', desc: 'Senden Sie einen Fragebogen ab, um die Engine-Ausgabe hier zu sehen.', cta: 'Fragebogen öffnen' },
    error: { title: 'Pipeline-Fehler', back: 'Zurück zum Fragebogen' },
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
  },

  loading: { default: 'Pipeline läuft…' },

  shortcuts: {
    title: 'Tastenkürzel',
    closeHint: 'Drücken Sie {{esc}} oder klicken Sie außerhalb, um zu schließen.',
    items: {
      help: 'Diese Tastenkürzel-Hilfe anzeigen',
      run: 'Pipeline ausführen',
      runContext: 'Fragebogen',
      esc: 'Diesen Dialog schließen',
    },
  },

  preset: {
    title: 'Veröffentlichten Fall als Preset laden',
    help:
      '13 Fixtures aus dem Validierungs-Sample (12 Papers + Leiva Escombreras / Frövi). Lädt die Q1-Q7 + Q5 pro Fluss in den Fragebogen, um die Engine end-to-end zu inspizieren und auszuführen.',
    loadButton: 'Preset laden',
  },

  toast: {
    pipelineCompleted: 'Pipeline abgeschlossen in {{ms}} ms — Pathway {{pathway}}',
    pipelineError: 'Pipeline-Fehler — {{detail}}',
  },

  language: {
    label: 'Sprache',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },
}

export default de
