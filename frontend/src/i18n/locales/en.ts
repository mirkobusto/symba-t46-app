// English locale — source of truth. Other locales mirror this structure.
// Keys are flat with dot-notation; nested objects below are organisational.
//
// Methodology terms kept in English in all locales (LCA/LCC/S-LCA acronyms,
// "function-oriented", PEF, ILCD, MFCA/CBA/TEA, IS-01..IS-05, etc.).

const en = {
  common: {
    run: 'Run',
    reset: 'Reset',
    close: 'Close',
    add: 'Add',
    remove: 'Remove',
    cancel: 'Cancel',
    notSet: '(not set)',
    optional: 'optional',
    skip: '(skip)',
    required: 'Required',
  },

  layout: {
    brand: 'SYMBA T4.6',
    about: 'About',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Press {{key}} for shortcuts',
  },

  health: {
    backendLabel: 'Backend',
    checking: 'checking',
    ok: 'OK',
    unreachable: 'unreachable',
    bannerPart1: 'Backend at',
    bannerPart2:
      'is unreachable. The questionnaire works but pipeline runs will fail until the backend is back online.',
  },

  savedStatus: {
    empty: 'No draft yet',
    justNow: 'Draft saved · just now',
    secondsAgo: 'Draft saved · {{n}}s ago',
    minutesAgo: 'Draft saved · {{n}}m ago',
    hoursAgo: 'Draft saved · {{n}}h ago',
  },

  home: {
    title: 'SYMBA T4.6 — IS Assessment Tool',
    tagline: 'Industrial Symbiosis methodology selection for LCA / LCC / S-LCA.',
    description:
      'Answer seven short questions about your industrial-symbiosis case study. The decision engine derives the terminal IS pathway (IS-01..IS-05) and a complete methodological configuration from the 186 Phase 1 nodes of deliverables D4.1, D4.2 and D4.3, plus the 40 cross-method validation rules.',
    startButton: 'Start new assessment',
  },

  about: {
    title: 'About',
    p1:
      'SYMBA T4.6 — IS Assessment App is the operational tool of WP4 / T4.6 of the SYMBA Horizon Europe project. It implements the Phase 1 atomic-node decision engine derived from deliverables D4.1 (LCA), D4.2 (LCC) and D4.3 (S-LCA), classifying an industrial-symbiosis case study into one of five terminal IS pathways (IS-01..IS-05) and returning a complete methodological configuration for LCA, LCC and S-LCA.',
    p2:
      'The 7 user-facing questions (Q1-Q7) drive the activation of 186 Phase 1 nodes plus 40 cross-method validation rules (18 IR + 10 CIR + 5 FU + 7 B). Reporting-time L3 enforcement (IR-04 + IR-10) plus 12 Critical Decision Points surface cross-method tensions to the user.',
    p3:
      'This MVP build wires the questionnaire to POST /api/pipeline/run. Per-pillar config display, advanced overrides, and the "Show reasoning" panel are all live.',
  },

  error: {
    title: 'Something went wrong',
    backHome: 'Back home',
    fallback: 'Unexpected error',
  },

  questionnaire: {
    title: 'Questionnaire',
    intro:
      'Seven questions about your industrial-symbiosis case. Q1 and at least one Q3 dimension are required; the rest is optional but improves the engine output.',
    runButton: 'Run pipeline',
    runningButton: 'Running…',
    resetButton: 'Reset draft',
    confirmReset: 'Discard all answers and start over? This cannot be undone.',
    q1Required: 'Q1 is required.',
    shortcutTip: 'Tip: Ctrl/⌘+Enter to run',

    q1: {
      title: 'Q1 — What are you analyzing? *',
      help:
        'Pick the closest match. If ambiguous, ask: who is the SUBJECT of the report? (Required.)',
      options: {
        A: { label: 'A. Specific exchange', description: 'A symbiotic exchange between two existing companies.' },
        B: { label: 'B. Eco-park / network', description: 'An eco-industrial park or multi-actor symbiotic network.' },
        C: { label: 'C. Policy / programme', description: 'A policy or programme decision at regional or national scale.' },
        D: { label: 'D. Corporate report', description: "A single company's symbiotic contribution for ESG/CSRD reporting." },
        E: { label: 'E. Monitoring', description: 'Time-series monitoring of an already operational symbiosis.' },
      },
    },

    q2: {
      title: 'Q2 — What phase is the system in?',
      options: {
        A: { label: 'A. Operational', description: 'Exists and has been operating for years (real operational data).' },
        B: { label: 'B. Under construction', description: 'Under construction or recently commissioned.' },
        C: { label: 'C. Design phase', description: 'Only in design phase (no operational data).' },
        D: { label: 'D. Baseline + alternatives', description: 'Existing baseline + N alternative future scenarios.' },
      },
    },

    q3: {
      title: 'Q3 — Which sustainability dimensions to include? *',
      help: 'At least one is required. Default: ENV + ECO.',
      warning: 'Select at least one dimension to proceed.',
      env: 'Environmental (LCA)',
      eco: 'Economic (LCC / MFCA / CBA / TEA)',
      soc: 'Social (S-LCA)',
    },

    q4: {
      title: 'Q4 — What is the report for?',
      help: 'Multi-select. Some uses combine (e.g. D + E for an EU PEF paper).',
      options: {
        A: { label: 'A. Internal', description: 'Internal use (managerial, R&D, planning).' },
        B: { label: 'B. External (no claim)', description: 'External communication without comparative claims.' },
        C: {
          label: 'C. Public superiority claim',
          description: 'Public claim of environmental superiority.',
          warn: 'Activates MANDATORY panel review of 3+ independent experts (ISO 14044), no weighting allowed.',
        },
        D: {
          label: 'D. EU policy alignment',
          description: 'EU policy alignment (CSRD, ESPR, PEFCR).',
          warn: 'Activates PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Academic publication', description: 'Academic peer-reviewed publication.' },
      },
    },

    q5: {
      title: 'Q5 — Nature of each symbiotic flow (per flow)',
      help:
        'Add one row per main symbiotic flow and pick its Q5 category. Mandatory for Q1 ∈ {A, B, D}; optional otherwise.',
    },

    q6a: {
      title: 'Q6a — Sector',
      help:
        '14 canonical sectors per WorkingDoc §3 + Other. Sector-specific node activations (e.g. lca_mc_30 wastewater) read this enum.',
      options: {
        none: '(none)',
        agriculture_agrifood_biorefineries: 'Agriculture / agri-food / biorefineries',
        biobased_polymers: 'Bio-based polymers',
        plastics_packaging: 'Plastics & packaging',
        pulp_paper: 'Pulp & paper',
        chemicals_fertilizers: 'Chemicals / fertilizers',
        cement_construction: 'Cement / construction',
        steel_metals: 'Steel & metals',
        energy_utilities: 'Energy / utilities',
        wastewater_sludge_biofactories: 'Wastewater / sludge / biofactories',
        textile_leather: 'Textile / leather',
        waste_valorization: 'Waste valorization',
        food_production: 'Food production',
        multi_tenant_urban_building: 'Multi-tenant urban building',
        multi_sector: 'Multi-sector',
        other: 'Other (specify)',
        wastewater_biofactories: 'Wastewater / sludge / biofactories (legacy)',
        agri_food: 'Agri-food / biorefineries (legacy)',
        process_industry: 'Process industry (legacy)',
      },
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      options: {
        TRL9: 'TRL 9 — fully operational',
        'TRL7-8': 'TRL 7-8 — pilot / pre-commercial',
        'TRL5-6': 'TRL 5-6 — prototype',
        'TRL<5': 'TRL <5 — early R&D',
      },
    },

    q7: {
      title: 'Q7 — Geographic spread',
      help: 'If actor coordinates are loaded later, this can be auto-inferred and shown as info.',
      options: {
        A: { label: 'A. Co-located', description: 'Eco-park, <5 km between actors.' },
        B: { label: 'B. Regional', description: '5-100 km, same region.' },
        C: { label: 'C. Wide-area', description: '>100 km, cross-region or cross-border.' },
        D: { label: 'D. Multi-scale', description: 'National / industry-wide, variable distances.' },
      },
    },

    q2dCard: {
      title: 'Q2-D — Alternative scenarios',
      help:
        'Define one or more future alternative scenarios to compare against the baseline. Triggers the dynamic SSP/RCP background and scenario-matrix support downstream.',
    },

    advancedCard: {
      title: 'Advanced overrides (expert mode)',
      activeKeys_one: '{{count}} active key',
      activeKeys_other: '{{count}} active keys',
    },
  },

  flows: {
    emptyHint: 'No flows yet. Add at least one to characterise per-flow Q5.',
    headers: { id: 'ID', name: 'Name', q5: 'Q5' },
    namePlaceholder: 'e.g. heat, CO2',
    addButton: 'Add flow',
    removeAria: 'Remove {{id}}',
    options: {
      a: 'a — A pays B (waste)',
      b: 'b — Free (ambiguous)',
      c: 'c — B pays A (co-product)',
      d: 'd — Interdependent',
      e: 'e — Aggregated / black-box',
    },
  },

  scenarios: {
    intro:
      'Add one row per alternative scenario you want to compare against the baseline. The overrides dict (Q-answer deltas vs baseline) is configured in the advanced editor; for now each scenario carries an empty overrides map.',
    emptyHint: 'No alternative scenarios yet.',
    headers: { id: 'ID', label: 'Label' },
    labelPlaceholder: 'e.g. Future expansion / TRL9 ramp-up',
    addButton: 'Add scenario',
    removeAria: 'Remove {{id}}',
  },

  advanced: {
    intro:
      "Expert-mode overrides. Each key is read by the engine via dict.get; missing keys mean \"use the default\". Values are coerced to true/false/number/string as appropriate.",
    headers: { key: 'Key', value: 'Value', hint: 'Hint', custom: 'custom' },
    addCustom: 'Add custom key',
    clearAria: 'Clear {{key}}',
    removeAria: 'Remove {{key}}',
    hints: {
      slca_framework_override: "Set to 'absolute' to test L1 BLOCK 2 (with Q3.soc=true)",
      asset_lifetime: 'Years; >15 activates lca_mc_21, lcc_hc_23, CIR-01',
      transport_sensitive: 'Boolean; true activates CIR-03',
      network_nodes: 'Integer; ≥3 (with Q1=B + interdependent_flows) activates CIR-04',
      interdependent_flows: 'Boolean; true (with Q1=B + network_nodes≥3) activates CIR-04',
      frontier_categories_active: 'Boolean; true activates CIR-06',
      is_specific_capital_goods: 'Boolean; true activates IR-13 / B-06 / CIR-08',
      multi_actor: 'Boolean; true (with Q1∈{B,C}) activates FU-02',
    },
  },

  result: {
    title: 'Engine output',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'ILCD situation',
      lccType: 'LCC type',
      slca: 'S-LCA',
      activatedNodes: 'Activated nodes',
      l1Blocks: 'L1 blocks fired',
      l2Violations: 'L2 violations',
      l3Cdps: 'L3 CDPs surfaced',
      extended: '(extended)',
    },
    blocked: {
      title: 'Pipeline blocked at L1',
      desc: 'The engine stopped at L1. No activation, L2 or L3 logic ran. Resolve the blocking constraint(s) below and re-run:',
    },
    toggleShow: 'Show reasoning',
    toggleHide: 'Hide reasoning',
    rawJson: 'Raw JSON response',
    actions: {
      adjust: 'Adjust answers',
      startFresh: 'Start fresh (clear all)',
      downloadJson: 'Download case (.json)',
      downloadReport: 'Download report (.docx)',
      downloadingReport: 'Generating report…',
      reportError: 'Report generation failed',
    },
    confirmStartFresh: 'Discard the current case and start a new one? This cannot be undone.',
    noResult: { title: 'No result yet', desc: 'Submit a questionnaire to see the engine output here.', cta: 'Open questionnaire' },
    error: { title: 'Pipeline error', back: 'Back to questionnaire' },
  },

  reasoning: {
    activatedNodes: 'Activated nodes ({{count}})',
    pillarConfigs: 'Pillar configurations',
    noPillarValues: 'No pillar values written.',
    l2Violations: 'L2 rule violations ({{count}})',
    noViolations: 'No violations.',
    l3Cdps: 'L3 critical decision points ({{count}})',
    noCdps: 'No CDPs surfaced.',
    pillarKeys: '{{count}} keys',
    resolution: 'Resolution',
    filterPlaceholder: 'Filter by node ID…',
    noMatch: 'No nodes match the filter.',
    showingFiltered: '{{shown}} of {{total}} shown',
  },

  loading: { default: 'Running pipeline…' },

  shortcuts: {
    title: 'Keyboard shortcuts',
    closeHint: 'Press {{esc}} or click outside to close.',
    items: {
      help: 'Show this shortcuts help',
      run: 'Run pipeline',
      runContext: 'Questionnaire',
      toggleReasoning: 'Toggle reasoning panel',
      toggleReasoningContext: 'Result',
      print: 'Print result page',
      printContext: 'Result',
      esc: 'Close this dialog',
    },
  },

  preset: {
    title: 'Load a published case as preset',
    help:
      '13 fixtures from the validation sample (12 papers + Leiva Escombreras / Frövi). Loads the Q1-Q7 + per-flow Q5 into the questionnaire so you can inspect and run the engine end-to-end.',
    loadButton: 'Load preset',
  },

  toast: {
    pipelineCompleted: 'Pipeline completed in {{ms}} ms — pathway {{pathway}}',
    pipelineError: 'Pipeline error — {{detail}}',
  },

  language: {
    label: 'Language',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },
}

export default en
export type Locale = typeof en
