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
    examplesAndContext: 'Examples & context',
    yes: 'yes',
    no: 'no',
  },

  layout: {
    brand: 'SYMBA T4.6',
    brandTag: 'Monitoring & Reporting System for Industrial Symbiosis',
    about: 'About',
    footer: 'SYMBA T4.6 — Monitoring & Reporting System · MVP',
    shortcutsHint: 'Press {{key}} for shortcuts',
  },

  welcome: {
    title: 'Welcome to SYMBA T4.6',
    lead:
      'Two quick questions and we\'ll take you to the right place. You can change your answers any time from the sidebar.',
    step1: { title: 'Who are you?' },
    step2: { title: 'What would you like to do?' },
    back: 'Back',
    next: 'Continue',
    finish: 'Take me in',
    skip: 'Skip for now',
    roles: {
      analyst: { name: 'Sustainability analyst', desc: 'IS practitioner, LCA/LCC/S-LCA reviewer, methodologist.' },
      industry: { name: 'Industrial operator', desc: 'You run a plant or a site inside an IS network.' },
      authority: { name: 'Local authority', desc: 'Municipality, region, policy analyst overseeing the territory.' },
      community: { name: 'Community representative', desc: 'Association, NGO, host-territory citizens\' group.' },
      enduser: { name: 'End user / citizen', desc: 'You use products or services derived from the symbiosis.' },
      unknown: { name: 'Not sure yet', desc: 'That\'s fine — we\'ll give you a curated tour.' },
    },
    tasks: {
      assess: { name: 'Start a new assessment', desc: 'Configure the methodology for an IS case via 7 questions.' },
      read: { name: 'Read a shared report', desc: 'Open a case someone shared with me and see the report.' },
      explore: { name: 'Explore a region / sector', desc: 'Browse aggregate insights for my area or industry.' },
      browse: { name: 'Just look around', desc: 'No specific goal — I want to see what the tool does.' },
    },
  },

  adminShell: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search cases, pathways, partners… (⌘K)',
    footerGa: 'GA',
    footerProgramme: 'Horizon Europe · M22–M36',
    groups: {
      workspace: 'Workspace',
      reports: 'Reports',
      system: 'System',
    },
    nav: {
      home: 'Home',
      questionnaire: 'New assessment',
      cases: 'My cases',
      recentResult: 'Recent result',
      stakeholder: 'Stakeholder views',
      aggregate: 'Regional dashboard',
      dcf: 'Data Collection File',
      about: 'About',
    },
  },

  eu: {
    fundingStatement:
      "This project has received funding from the European Union's Horizon Europe Research and Innovation Programme under Grant Agreement N. 101135562.",
    disclaimer:
      'Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union. The European Union cannot be held responsible for them.',
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
    title: 'SYMBA T4.6 — Monitoring & Reporting System',
    tagline: 'Industrial Symbiosis methodology, inventory and multi-stakeholder reporting for LCA / LCC / S-LCA along the bio-based value chain.',
    description:
      'Answer seven short questions about your industrial-symbiosis case study. The decision engine derives the terminal IS pathway (IS-01..IS-05) and a complete methodological configuration from the 186 Phase 1 nodes of deliverables D4.1, D4.2 and D4.3, plus the 40 cross-method validation rules. Then collect inventory data with the partners of the symbiosis network and surface the multi-stakeholder report.',
    startButton: 'Start new assessment',
    modeLabel: 'UX mode',
    modeExpert: 'Expert',
    modeGuided: 'Guided',
    modeHint: {
      expert: 'Fast questionnaire for IS analysts and reviewers familiar with ILCD / LCSA terminology.',
      guided: 'Step-by-step mode for industrial managers, community representatives and policymakers. Examples are expanded by default and an intro banner explains the questionnaire flow.',
    },
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
    guidedBannerTitle: 'Guided mode active',
    guidedBannerBody:
      'Examples and contextual explanations are expanded by default. Read each block carefully — the seven questions drive the methodological pathway and the data-collection plan you will receive at the end.',
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
      details:
        'A — bilateral exchange (e.g. waste heat from Plant X to Plant Y, or by-product gypsum from a power plant to a cement kiln). The subject is the SHARED FLOW between two companies. ' +
        'B — eco-industrial park or symbiotic network with 3+ actors (e.g. Kalundborg, NISP cluster, an industrial park master plan). The subject is the NETWORK as a system. ' +
        'C — public-policy or programme decision at regional/national scale (e.g. an IS subsidy scheme, a regulatory framework, an EU industrial strategy). The subject is the DECISION/PROGRAMME, not a specific plant. ' +
        'D — a single company quantifying its symbiotic contribution for ESG / CSRD / sustainability reporting (e.g. "we sold 12 kt of slag to cement makers, here is our credit"). The subject is ONE COMPANY. ' +
        'E — periodic monitoring of an already-operating symbiosis (annual KPI updates, post-implementation surveillance). The subject is the TIME SERIES, not a one-off study.',
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
      details:
        'A — existing exchange or park running for years; primary plant data is available. (e.g. Kalundborg today, Sokka 2011 reporting an existing IES.) ' +
        'B — built recently or in commissioning; data is partly measured, partly engineering estimate. ' +
        'C — pre-construction design study; no measured operating data; engineering models only. (e.g. Daddi 2017 ex-ante study.) ' +
        'D — operational baseline + one or more future "what-if" scenarios you want to compare (e.g. expansion, TRL ramp-up, decarbonised electricity grid). Choosing D enables the alternative-scenarios editor below.',
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
      details:
        'ENV — Environmental Life Cycle Assessment (LCA): impacts on climate, ecosystems, resource use. Almost always selected. ' +
        'ECO — economic dimension; default tool is LCC (Life Cycle Costing), but the engine also accepts MFCA (Material Flow Cost Accounting), CBA (Cost-Benefit Analysis), or TEA (Techno-Economic Analysis) depending on Q4 and reporting context. ' +
        'SOC — Social LCA. Selecting it activates a longer rule chain (worker / local-community / value-chain stakeholder categories) and forces L1 BLOCK 2 if the advanced override slca_framework_override is set to "absolute". ' +
        'Most published IS papers run ENV-only (e.g. Sokka, Daddi); a few couple ENV+ECO (Hashimoto, Wiktor); only a handful add SOC.',
      warning: 'Select at least one dimension to proceed.',
      env: 'Environmental (LCA)',
      eco: 'Economic (LCC / MFCA / CBA / TEA)',
      soc: 'Social (S-LCA)',
    },

    q4: {
      title: 'Q4 — What is the report for?',
      help: 'Multi-select. Some uses combine (e.g. D + E for an EU PEF paper).',
      details:
        'A — internal use: management dashboards, R&D screening, plant-level decisions. Few methodological constraints. ' +
        'B — external communication WITHOUT comparative claims (sustainability reports, marketing brochures with no "better than X" statement). ' +
        'C — public CLAIM of environmental superiority vs an alternative product (e.g. "this cement is greener than OPC"). Activates the mandatory ISO 14044 critical review by 3+ independent experts and disables weighting. Use with care. ' +
        'D — alignment with EU policy instruments (CSRD disclosure, ESPR digital product passport, PEFCR category rules). Forces the PEF Circular Footprint Formula via CIR-05. ' +
        'E — academic peer-reviewed publication. Requires full transparency (data sources, allocation choices, sensitivity). Often combined with B or D. ' +
        'You can multi-select: a typical PEF paper picks D + E.',
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
      details:
        'For each main flow exchanged between actors (heat, CO₂, slag, wastewater, hydrogen…) pick the economic relationship: ' +
        'a — A pays B to take the flow (the flow is a WASTE for A): typical waste-disposal contract. Triggers waste-paradigm allocation rules. ' +
        'b — flow exchanged for FREE (ambiguous status): the engine routes to the free-flow disambiguation chain. ' +
        'c — B pays A for the flow (the flow is a CO-PRODUCT for A): triggers economic-allocation rules and the PEF Circular Footprint Formula path. ' +
        'd — INTERDEPENDENT flow: neither side could operate without the other; treated as an integrated system, often with system expansion. ' +
        'e — AGGREGATED / black-box: the published case does not give per-flow detail (typical of aggregate IES papers like Sokka 2011). ' +
        'For policy-level Q1=C studies, Q5 is usually optional.',
    },

    q6a: {
      title: 'Q6a — Sector',
      help:
        '14 canonical sectors per WorkingDoc §3 + Other. Sector-specific node activations (e.g. lca_mc_30 wastewater) read this enum.',
      details:
        'Sector controls a small set of sector-specific node activations and overlay defaults. Pick the closest match to the dominant sector of the case (the actor that contributes most mass/energy/value). ' +
        'Examples: pulp_paper for Sokka 2011 (UPM Kymi); chemicals_fertilizers for Hashimoto / Wiktor; cement_construction for Leiva 2025 Escombreras; biobased_polymers for Briassoulis; food_production / agri-food for Daddi. ' +
        'For mixed cases use multi_sector. The "(legacy)" entries at the bottom exist for backward-compatible loading of older fixtures — prefer the new 14-sector list.',
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
      details:
        'TRL of the dominant or critical technology in the symbiotic network. Drives the choice of inventory data quality (measured vs literature vs engineering estimate) and the uncertainty budget downstream. ' +
        'TRL 9 = full commercial operation (Kalundborg, Sokka). ' +
        'TRL 7-8 = first-of-a-kind pilot / pre-commercial unit. ' +
        'TRL 5-6 = lab-validated prototype, demo at relevant scale. ' +
        'TRL <5 = early R&D, bench-scale only — large uncertainty, scenarios recommended.',
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
      details:
        'Geographic spread changes the relative weight of transport in the inventory and may activate CIR-03 if the advanced override transport_sensitive=true. ' +
        'A — co-located inside one site (<5 km, e.g. Kalundborg, eco-industrial park). Transport is essentially negligible. ' +
        'B — regional cluster (5-100 km, same region — typical Sokka 2011 / Hashimoto). ' +
        'C — wide-area, cross-region or cross-border (>100 km). Transport mode and distance become non-trivial inventory items. ' +
        'D — multi-scale national or industry-wide programmes (Q1=C policy studies, geographically variable).',
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
      runScenarios: 'Run scenarios',
      runningScenarios: 'Running scenarios…',
    },
    confirmStartFresh: 'Discard the current case and start a new one? This cannot be undone.',
    noResult: { title: 'No result yet', desc: 'Submit a questionnaire to see the engine output here.', cta: 'Open questionnaire' },
    error: { title: 'Pipeline error', back: 'Back to questionnaire' },
  },

  scenariosResult: {
    title: 'Scenario comparison',
    description: 'Pipeline run for the baseline + {{n}} alternative scenario(s). Diffs highlighted vs baseline.',
    backToResult: 'Back to single result',
    columns: {
      scenario: 'Scenario',
      pathway: 'Pathway',
      ilcd: 'ILCD',
      lccType: 'LCC type',
      slca: 'S-LCA',
      activated: 'Activated',
      blocks: 'L1 blocks',
      violations: 'L2 violations',
      cdps: 'L3 CDPs',
    },
    baselineLabel: 'Baseline',
    diffSuffix: '(diff)',
    overrideHelp: 'Each scenario inherits Q1-Q7 from the baseline; populate `overrides` (JSON dict) per scenario to differ. Empty overrides → same case as baseline.',
    overridesPlaceholder: 'e.g. {"q1": "C"} or {"q3": {"env": true, "eco": true}}',
    overridesParseError: 'Overrides must be valid JSON for {{id}}',
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
    rationaleToggle: 'Why these answers? (compilation rationale)',
  },

  toast: {
    pipelineCompleted: 'Pipeline completed in {{ms}} ms — pathway {{pathway}}',
    pipelineError: 'Pipeline error — {{detail}}',
    scenariosCompleted: '{{n}} scenarios run',
    scenariosError: 'Scenarios run failed — {{detail}}',
  },

  language: {
    label: 'Language',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },

  auth: {
    title: 'Sign in',
    subtitle:
      'Optional for browsing legacy / public cases. Required to create private cases or use the regional dashboard on behalf of an organisation.',
    tabLogin: 'Sign in',
    tabRegister: 'Create account',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    passwordHelp: 'At least 8 characters.',
    submitLogin: 'Sign in',
    submitRegister: 'Create account',
    submitting: 'Submitting…',
    skipLink: 'Continue without signing in',
    signIn: 'Sign in',
    logout: 'Sign out',
  },

  stakeholder: {
    navLink: 'Stakeholder report',
    title: 'Stakeholder report',
    subtitle:
      'Multi-stakeholder view of the case. Switch tabs to see the information tailored for each audience along the bio-based value chain.',
    openButton: 'Open stakeholder report',
    backToResult: 'Back to result',
    openDcf: 'Open Data Collection File',
    loadingScoring: 'Loading scoring data…',
    tabs: {
      industry: 'Industry',
      community: 'Community',
      authority: 'Local authority',
      'end-user': 'End user',
    },
    framing: {
      industry:
        'Full technical view of the methodological configuration and the quantitative scoring produced by CIRCE. Intended for the IS analyst and the methodology reviewer.',
      community:
        'Local-impact view focused on environmental quality and social benefits the symbiosis brings to the host territory.',
      authority:
        'Regulatory and policy view: pathway compliance, peer-review status, public-superiority claims, EU PEF alignment.',
      'end-user':
        'Summary view for end users of the IS-derived products and services.',
    },
    pathwaySummaryTitle: 'Pathway summary',
    labels: {
      pathway: 'Pathway',
      ilcd: 'ILCD Situation',
      lcc: 'LCC type',
      slca: 'S-LCA activation',
    },
    scoringTitle: 'Scoring (CIRCE)',
    scoringPendingTitle: 'Scoring data not yet available',
    scoringPendingBody:
      'The CIRCE-produced LCSA scoring for this case has not been ingested yet. Once CIRCE delivers the quantitative payload, the indicators will appear here grouped by stakeholder relevance.',
    scoringEmpty: 'No indicators relevant for this stakeholder.',
    indicatorPending: 'pending',
    engineDetailsTitle: 'Engine pipeline details',
    activatedNodesCount: '{{count}} activated methodological node(s)',
    ruleViolations: '{{count}} rule violation(s)',
    cdpFlagsCount: '{{count}} cross-dimension tension flag(s)',
    complianceTitle: 'Compliance signals',
    compliance: {
      peerReview: 'Peer-review claim (Q4=E): {{status}}',
      pef: 'EU PEF alignment (Q4=D): {{status}}',
      publicClaim: 'Public superiority claim (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Regional dashboard',
    title: 'Regional / sectoral dashboard',
    subtitle:
      'Breakdown of all saved cases by pathway, sector, geographic scope, and ILCD situation. Intended for local authorities and policy analysts.',
    openButton: 'Open regional dashboard',
    backToCases: 'Back to cases',
    loading: 'Loading aggregate data…',
    errorTitle: 'Could not load aggregate data',
    errorNoData: 'No data returned by the server.',
    totalLabel: 'Total saved cases',
    noData: '(no data)',
    tableKey: 'Value',
    tableCount: 'Count',
    breakdownTitle: {
      byPathway: 'By pathway (IS-01 … IS-05)',
      bySector: 'By sector (Q6a)',
      byScope: 'By geographic scope (Q7)',
      byIlcd: 'By ILCD situation',
    },
  },

  dcf: {
    navLink: 'Data Collection',
    title: 'Data Collection File',
    subtitle:
      "Calibrated on the derived pathway. Download the Excel companion to collect inventory data with the symbiosis partners, then return for the final report.",
    loading: 'Composing the Data Collection File…',
    errorTitle: 'Could not generate Data Collection File',
    errorNoPayload: 'No payload returned by the server.',
    backToResult: 'Back to result',
    networkTitle: 'Network diagram',
    downloadXlsx: 'Download Excel (.xlsx)',
    downloadingXlsx: 'Preparing Excel…',
    downloadDocx: 'Download companion document (.docx)',
    downloadingDocx: 'Preparing document…',
    downloadError: 'Download failed',
    footerNote:
      'The Data Collection File is an export-ready inventory worksheet. Fill the empty rows offline (or distribute to your network partners) and return the data to the analyst leading the LCSA.',
    openButton: 'Open Data Collection File',
  },

  cases: {
    navLink: 'My cases',
    title: 'My cases',
    intro: 'Cases saved on the server. Load to populate the questionnaire, or delete to remove permanently.',
    empty: 'No saved cases yet. Save one from the questionnaire or result page.',
    columns: {
      name: 'Name',
      pathway: 'Pathway',
      updated: 'Updated',
    },
    loadButton: 'Load',
    deleteButton: 'Delete',
    confirmDelete: 'Delete "{{name}}" permanently? This cannot be undone.',
    saveButton: 'Save case',
    saveAsButton: 'Save as new…',
    saveTitle: 'Save case',
    namePlaceholder: 'My case name',
    saveDialog: 'Save the current case to the server. Pick a name to identify it later.',
    saving: 'Saving…',
    saveError: 'Save failed — {{detail}}',
    saveSuccess: 'Saved as "{{name}}"',
    loadError: 'Load failed — {{detail}}',
    deleteError: 'Delete failed — {{detail}}',
  },
}

export default en
export type Locale = typeof en
