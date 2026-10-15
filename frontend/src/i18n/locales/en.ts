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
    methodologicalNote: 'Full methodological note',
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

  share: {
    buttonLabel: 'Share report',
    title: 'Share this report',
    lead: 'Send one of these URLs to a stakeholder. Same case, different framing for each audience — no login required to open.',
    close: 'Close',
    done: 'Done',
    copy: 'Copy',
    copied: 'Copied ✓',
    copyFailed: 'Could not copy — please copy the URL manually.',
    saveFirstTitle: 'Save the case first',
    saveFirstBody: 'The share URLs need a persisted case id. Click "Save as new…" below, then reopen the share dialog.',
    audience: {
      industry: '🏭 Industry',
      community: '🌳 Community',
      authority: '🏛 Local authority',
      enduser: '👤 End user',
    },
  },

  reader: {
    tagline: 'Public report',
    loading: 'Loading the report…',
    notFoundTitle: 'Report not found',
    notFoundBody: 'The link you followed may be broken or the case may have been removed.',
    aboutLink: 'Learn about SYMBA',
    eyebrow: 'Shared report · {{name}}',
    summaryTitle: 'Pathway summary',
    summary: {
      pathway: 'Pathway',
      ilcd: 'ILCD situation',
      lcc: 'LCC type',
      slca: 'S-LCA state',
      sector: 'Sector',
      scope: 'Geographic scope',
    },
    scoringTitle: 'Scoring',
    complianceTitle: 'Compliance signals',
    compliance: {
      peer: { name: 'Peer-review claim', desc: 'Q4 = E · ISO 14044 reviewer eligibility' },
      pef: { name: 'EU PEF alignment', desc: 'Q4 = D · Circular Footprint Formula' },
      public: { name: 'Public superiority claim', desc: 'Q4 = C · mandatory ISO panel review' },
      dnsh: { name: 'DNSH check', desc: 'Do No Significant Harm · EU Taxonomy art. 17' },
    },
    audience: {
      showingFor: 'Showing for — {{name}}',
      industry: {
        short: '🏭 Industry',
        name: 'Industry',
        title: 'Operator view',
        body: 'Full technical picture of the methodological configuration for the operators running the symbiosis.',
      },
      community: {
        short: '🌳 Community',
        name: 'Community',
        title: 'Local-impact view',
        body: 'Environmental quality and social benefits the symbiosis brings to the host territory.',
      },
      authority: {
        short: '🏛 Authority',
        name: 'Local authority',
        title: 'Regulatory and policy view',
        body: 'Pathway compliance, peer-review status, public-superiority claims, EU PEF alignment, DNSH screening.',
      },
      enduser: {
        short: '👤 End user',
        name: 'End user',
        title: 'End-user summary',
        body: 'Simple takeaways about the products and services derived from the symbiosis.',
      },
    },
    note: 'This report is generated from the SYMBA T4.6 engine. The narrative framing changes by audience; the underlying data is the same.',
    about: {
      eyebrow: 'About SYMBA T4.6',
      title: 'Public reports · at a glance',
      lead:
        'Someone shared a case with you.',
      whoTitle: 'Who\'s behind this?',
      whoBody: 'SYMBA is a Horizon Europe project (GA 101135562, M22–M36) building open, methodologically-sound tools for industrial symbiosis in the bio-based industrial ecosystem. Task T4.6 is the monitoring & reporting system.',
      whatTitle: 'What is a "report"?',
      whatBody: 'A shared report describes one case of industrial symbiosis: which actors cooperate, how the environmental / economic / social benefits are assessed, and which methodological choices were made. Same case, four different framings for four audiences.',
      whereTitle: 'Where can I learn more?',
      whereBody: 'Visit the project website or read the deliverables at',
      enterTool: 'Enter the tool',
    },
    region: {
      eyebrow: 'Region · {{code}}',
      title: 'Regional dashboard',
      lead: 'Aggregate view of all IS cases matching this region. Numbers refresh as new cases are saved.',
      total: 'Cases',
      pathways: 'Pathways covered',
      sectors: 'Sectors covered',
      byPathwayTitle: 'By pathway',
      bySectorTitle: 'By sector',
      tableKey: 'Value',
      tableCount: 'Count',
      errorTitle: 'Region not available',
      errorBody: 'Could not fetch aggregate data for this region.',
    },
  },

  welcome: {
    title: 'Welcome to SYMBA T4.6',
    lead:
      "This tool works out which methodology your industrial-symbiosis case requires and which data you have to collect. It does not compute the environmental, cost or social results. Two quick questions and we take you to the right place — you can change both later, from the menu inside the tool.",
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
      unknown: { name: 'Not sure yet', desc: 'That\'s fine — we start you on the overview page.' },
    },
    tasks: {
      assess: { name: 'Start a new assessment', desc: 'Configure the methodology for an IS case via ten questions.' },
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
      changeRole: 'Change role',
    },
  },

  // Funding acknowledgement, worded as on the SYMBA website footer.
  eu: {
    emblemAlt: 'Funded by the European Union',
    fundingStatement: 'Funded by the European Union under G.A. 101135562.',
    disclaimer:
      'Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union. Neither the European Union nor the European Research Executive Agency can be held responsible for them.',
  },

  // Footer (EuFooter) — mirrors the structure of the project website footer.
  footer: {
    logoAlt: 'Symba Project',
    logoTitle: 'Go to the SYMBA project website',
    toolLine: 'Monitoring & Reporting System · Task T4.6',
    followUs: 'Follow us',
    projectInfo: 'Project information',
    projectWebsite: 'Project website',
    publicDeliverables: 'Public deliverables',
    copyright: 'Copyright © {{year}} Symba Project, All Rights Reserved.',
    privacy: 'Privacy policy',
    cookies: 'Browser storage',
  },

  // Header (SiteHeader) — website-style navigation back to symbaproject.eu.
  siteHeader: {
    logoAlt: 'Symba Project',
    logoTitle: 'Go to the SYMBA project website',
    navLabel: 'SYMBA project website',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    backToSite: 'Project website',
    tool: 'Monitoring tool',
    nav: {
      about: 'About',
      project: 'Project',
      partners: 'Partners',
      news: 'News & Events',
      download: 'Download',
      contact: 'Contact Us',
    },
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
      'Answer ten short questions about your industrial-symbiosis case study. The decision engine derives the terminal IS pathway (IS-01..IS-05) and a complete methodological configuration from the 186 Phase 1 nodes of deliverables D4.1, D4.2 and D4.3, plus the 40 cross-method validation rules. Then collect inventory data with the partners of the symbiosis network and surface the multi-stakeholder report.',
    startButton: 'Start new assessment',
    modeLabel: 'UX mode',
    modeExpert: 'Expert',
    modeGuided: 'Guided',
    modeHint: {
      expert: 'Fast questionnaire for IS analysts and reviewers familiar with ILCD / LCSA terminology.',
      guided: 'Step-by-step mode for industrial managers, community representatives and policymakers. Each question comes with a plain-language explanation; the full methodological note stays one click away.',
    },
    hero: {
      title: 'Start a new IS assessment',
    },
    openCasesLink: 'Or open a saved case',
    kpi: {
      savedCases: 'Saved cases',
      savedCasesDetail: 'across all users',
      withPathway: 'With pathway',
      withPathwayDetail: '{{total}} total',
      uniquePathways: 'Unique pathways',
      uniquePathwaysDetail: 'IS-01 … IS-05',
      language: 'Available in',
      languageDetail: '5 UI languages',
    },
    presetsTitle: 'Validated case studies',
    presetsMeta: '13 fixtures from peer-reviewed papers',
  },

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
          "It helps practitioners configure the methodological pathway of a life-cycle study of an industrial symbiosis (Horizon Europe project SYMBA, Grant Agreement 101135562, task T4.6) and prepare the data collection file and reports. It does not compute environmental, cost or social results."
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
    title: 'About',
    p1:
      "SYMBA T4.6 helps whoever sets up a life-cycle sustainability assessment of an industrial symbiosis: it derives, from ten questions about the case, which methodology applies, which practices have to be documented, and which data to collect from the partners of the network. It does not compute the results — the quantitative scoring is produced outside the tool and shown here once delivered.",
    p2:
      'The 7 core questions (Q1-Q7), plus three optional ones (Q8-Q10), drive the activation of 186 Phase 1 nodes plus 40 cross-method validation rules (18 IR + 10 CIR + 5 FU + 7 B). Reporting-time L3 enforcement (IR-04 + IR-10) plus 12 Critical Decision Points surface cross-method tensions to the user.',
    p3:
      'Per-pillar config display, advanced overrides, and the "Show reasoning" panel are all live.',
  },

  error: {
    title: 'Something went wrong',
    backHome: 'Back home',
    fallback: 'Unexpected error',
  },

  questionnaire: {
    scopeNote: "This tool does not compute LCA/LCC/S-LCA numbers. It derives the methodological pathway your case requires and the data you have to collect; the quantitative scoring is produced externally and shown here once delivered.",
    title: 'Questionnaire',
    intro:
      'Ten questions about your industrial-symbiosis case. Q1 and at least one Q3 dimension are required; the rest is optional but improves the engine output.',
    guidedBannerTitle: 'Guided mode active',
    guidedBannerBody:
      'Each question opens with a short explanation in plain words. The full methodological note, in the wording of the project deliverables, stays one click away under each question. The ten answers decide the methodological pathway and the data-collection plan you receive at the end.',
    runButton: 'Work out the pathway',
    runningButton: 'Working it out…',
    resetButton: 'Reset draft',
    confirmReset: 'Discard all answers and start over? This cannot be undone.',
    q1Required: 'Q1 is required.',
    shortcutTip: 'Tip: Ctrl/⌘+Enter to run',

    q1: {
      title: 'Q1 — What are you analyzing? *',
      help:
        "Pick the closest match: what counts is the subject of the study, not who commissioned it. (Required.)",
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
      plain:
        "This is the question that governs the others: from it the tool works out which system you are examining, and therefore which data it will ask you for later. If you hesitate between two options, keep the one that describes the thing whose effects you want to measure.",
    },

    q2: {
      title: 'Q2 — Do the exchanges the study measures already take place?',
      details:
        'Answer about the symbiotic exchanges, not about the plants: a plant can exist while the exchange you study is still a plan. A — the exchanges take place and have for some time; primary operating data is available (e.g. Kalundborg today, Sokka 2011). The reference is what each firm would do today if the links were severed (HNSRS, D4.1 §11.1). B — the exchanges have just started, or the plants are being commissioned; data partly measured, partly estimated. C — the exchanges do not take place yet: planned, designed or hypothetical, even if the plants already run (e.g. Daddi 2017, residues reused in an existing farm). The reference is the current situation without the exchanges (CNSRS, D4.1 §11.1). D — the exchanges take place and the study also compares future alternatives (expansion, new technology, decarbonised grid): the existing network against the HNSRS, each alternative against the CNSRS. D opens the alternative-scenarios editor below. When the system operates is asked in Q8.',
      options: {
        A: { label: 'A. Already running', description: 'The exchanges already take place (real operating data).' },
        B: { label: 'B. Just started', description: 'The exchanges have just started, or the plants are being commissioned.' },
        C: { label: 'C. Not yet', description: 'Planned, designed or hypothetical exchanges, even between plants that already exist.' },
        D: { label: 'D. Running, plus alternatives', description: 'The exchanges run, and the study compares them with future alternatives.' },
      },
      plain:
        'Think of the exchanges, not of the plants. If the flows between the companies already happen, you can measure them. If they are still an idea, even between plants that already run, you can only estimate them. Pick the last option if you want to compare today\'s exchanges with one or more possible futures: it opens the scenarios editor below.',
    },

    q3: {
      title: 'Q3 — Which sustainability dimensions to include? *',
      help: 'At least one is required. Environmental and economic are the usual pairing.',
      details:
        'ENV — Environmental Life Cycle Assessment (LCA): impacts on climate, ecosystems, resource use. Almost always selected. ' +
        'ECO — economic dimension, assessed with Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) is a technique used inside the LCC pathway (activated by ECO and by contested flows in Q5), not an alternative to it; CBA and TEA are not offered by this engine. ' +
        'SOC — Social LCA. Selecting it activates a longer rule chain (worker / local-community / value-chain stakeholder categories) and forces L1 BLOCK 2 if the advanced override slca_framework_override is set to "absolute". ' +
        'Most published IS papers run ENV-only (e.g. Sokka, Daddi); a few couple ENV+ECO (Hashimoto, Wiktor); only a handful add SOC.',
      warning: 'Select at least one dimension to proceed.',
      env: 'Environmental (LCA)',
      eco: 'Economic (LCC)',
      soc: 'Social (S-LCA)',
      plain:
        "Three separate assessments, each with its own method and its own data: environmental, economic — costs over the whole life cycle, not a cost-benefit analysis — and social. Pick the ones you intend to deliver. Most published studies cover the environmental one alone, and adding the economic one is the usual next step; the social one needs a great deal more information from the people involved, so expect to go and collect it.",
    },

    q4: {
      title: 'Q4 — What will this study be used for?',
      help: 'Multi-select. Some uses combine (e.g. D + E for an EU PEF paper).',
      details:
        'A — internal use: management dashboards, R&D screening, plant-level decisions. Few methodological constraints. ' +
        'B — external communication WITHOUT comparative claims (sustainability reports, marketing brochures with no "better than X" statement). ' +
        'C — public CLAIM that the system is better than, or equivalent to, an alternative with the same function (e.g. "this cement is greener than OPC"), disclosed to the public in any form: report, website or scientific article (comparative assertion, ISO 14040 §3.6; D4.1 §15.3.4). Activates the mandatory ISO 14044 critical review by 3+ independent experts and disables weighting. Use with care. ' +
        'D — alignment with EU policy instruments (ESPR digital product passport, PEFCR category rules). Forces the PEF Circular Footprint Formula via CIR-05. Strict reporting of one company (CSRD, ESG) is declared in Q9, not here: it uses allocation, not the CFF. ' +
        'E — academic peer-reviewed publication. Requires full transparency (data sources, allocation choices, sensitivity). Often combined with B or D. If the paper claims that one system is better than or equivalent to a competing alternative, also select C; a comparison that does not declare a winner stays E. ' +
        'You can multi-select: a typical PEF paper picks D + E.',
      options: {
        A: { label: 'A. Internal', description: 'Internal use (managerial, R&D, planning).' },
        B: { label: 'B. External (no claim)', description: 'External communication without comparative claims.' },
        C: {
          label: 'C. Public superiority claim',
          description: 'Public claim of superiority or equivalence over an alternative with the same function, in any form (papers included).',
          warn: 'Activates MANDATORY panel review of 3+ independent experts (ISO 14044), no weighting allowed.',
        },
        D: {
          label: 'D. EU policy alignment',
          description: 'EU policy alignment (ESPR, PEF/PEFCR).',
          warn: 'Activates PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Academic publication', description: 'Academic peer-reviewed publication (add C if it claims one system beats a competing one).' },
      },
      plain:
        "Who will read the result, and what they will do with it, decides how strict the method has to be. An internal note is the lightest. Aligning with EU instruments (the product passport, PEF) locks in the EU's own way of counting recycled and recovered material. Stating in public that your product is better than someone else's is the heaviest: it requires an independent review by outside experts. That holds wherever you say it, a scientific article included. You can pick more than one.",
    },

    q5: {
      title: 'Q5 — Nature of each symbiotic flow (per flow)',
      help:
        'Add one row per main symbiotic flow and pick its Q5 category. Mandatory for Q1 ∈ {A, B, D}; optional otherwise.',
      details:
        'For each main flow exchanged between actors (heat, CO₂, slag, wastewater, hydrogen…) pick who pays whom: ' +
        'a — A pays B to take the flow (a gate fee: negative market value, a WASTE for A, D4.1 §8.3.2). Zero-burden applies from the point where the residue first reaches non-negative value, not at the gate. Paying is not the same as unavoidable: D4.2 §6.2 also requires the causal avoidability test, declared per flow in the Data Collection File. ' +
        'b — flow exchanged for FREE (ambiguous status): the engine routes to the free-flow disambiguation chain. ' +
        'c — B pays A for the flow (positive market value: a CO-PRODUCT for A): substitution against the displaced virgin material, with a quality-corrected ratio. The PEF Circular Footprint Formula is not tied to Q5: it comes from Q4=D. If no third party would pay for the flow (Freedom-to-Act test, D4.1 §8.3.3), the price is administrative and the flow is modeled as waste. ' +
        'd — INTERDEPENDENT flow: A deliberately altered its process (quality, quantity, post-treatment) to supply B; a co-product whatever the price, never zero-burden. ' +
        'e — AGGREGATED / black-box: the source gives no per-flow detail (typical of aggregate IES papers like Sokka 2011). That is a limitation of the source, not a modeling choice: D4.1 §8.3.1 forbids one network-wide rule, so the Data Collection File still asks for the classification of every flow you can name. ' +
        'Q5 records who pays whom; the legal and economic tests (Freedom-to-Act, End-of-Waste, by-product class, avoidability, zero-burden point) are declared per flow in the Flow classification section of the Data Collection File. For policy-level Q1=C studies, Q5 is usually optional.',
      plain:
        "For each thing that moves between the companies — heat, water, slag, CO₂ — the question here is only who pays whom: the sender pays to be rid of it, nobody pays, or the receiver pays for it. If the sender deliberately changed its own process in order to supply it, pick that whatever the money says. If your source gives one figure for the whole network, pick the last option — but you will still be asked about every flow you can name, because one rule for the whole network is not allowed. Whether a flow counts as waste in law is settled later, in the data collection file, not here.",
    },

    q6a: {
      title: 'Q6a — Sector',
      help: 'The main sector of the case. It switches on a few sector-specific requirements.',
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
      plain:
        "The main sector of the case: the activity of the company that contributes most of the mass, energy or value. It switches on a few sector-specific requirements and defaults. If the case straddles several sectors, pick Multi-sector, and ignore the entries marked (legacy).",
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL of the dominant or critical technology in the symbiotic network. Drives the choice of inventory data quality (measured vs literature vs engineering estimate) and the uncertainty budget downstream. ' +
        'It is the TRL of the key technology itself, not of its adoption: a mature technology used for the first time in this network or region is still TRL 9; the novelty of the application shows in the data quality, not in the TRL (T4.6 reading). ' +
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
      plain:
        "How mature the key technology is: in commercial operation, a first pilot, a prototype, or still in the laboratory. The less mature it is, the more your figures will be estimates rather than measurements, and the more the result has to carry its own uncertainty. Judge the technology itself, not whether it is new here: a proven process used for the first time in your region is still mature.",
    },

    q7: {
      title: 'Q7 — Geographic spread',
      help: 'Qualitative layout of the network. Transport is modeled explicitly whatever you answer; the break-even distance is flow-type specific and is asked for every flow in the Data Collection File (Logistics), where you record the one your own sensitivity run produced.',
      details:
        'The answer changes how logistics data are asked for (GIS coupling, spatial sensitivity), not whether transport is modeled: D4.1 §12.3.1 requires every transport link to be a distinct unit process of the foreground, with primary data on distance, route and mode, and a sensitivity on distance to find the break-even point. No distance threshold sits behind the four options: the break-even depends on the flow type and on the alternative it displaces (D4.1 §12.2.1 and D4.2 give indicative ranges, to sense-check a model, never as inputs); every study computes its own, flow by flow. ' +
        'A — co-located: one site or adjacent plants (eco-industrial park). Links are short (pipeline, conveyor, on-site handling) but still modeled; for piped heat, steam and water the dedicated infrastructure usually dominates. ' +
        'B — regional cluster: several sites in the same region (typical Sokka 2011 / Hashimoto). ' +
        'C — wide-area: cross-region or cross-border; transport mode and routing become major inventory and cost items. ' +
        'D — multi-scale: national or industry-wide programmes (typically Q1=C policy studies). B–D activate CIR-03 (GIS coupling); C–D also lca_mc_29 and the GIS-coupled branch of lcc_mc_14.',
      options: {
        A: { label: 'A. Co-located', description: 'One site or adjacent plants (eco-industrial park).' },
        B: { label: 'B. Regional', description: 'Several sites in the same region.' },
        C: { label: 'C. Wide-area', description: 'Cross-region or cross-border.' },
        D: { label: 'D. Multi-scale', description: 'National / industry-wide, variable distances.' },
      },
      plain:
        "How the sites are laid out: a single site, several sites in one region, sites across regions or borders, or a national or industry-wide programme. Transport is counted whatever you answer; the answer only changes how much detail you will be asked for about routes and modes. No distance cut-off sits behind the four options — each flow has its own pay-off distance, and the data collection file asks you for it, flow by flow, from your own sensitivity run.",
    },
    q8: {
      title: 'Q8 — Time horizon of the study',
      help: 'Optional. One horizon for LCA and LCC alike.',
      details: 'The deliverables require one time horizon for LCA, LCC and S-LCA (D4.2 §11, D4.1 §14). Future background scenarios (SSP/RCP) are added to both when the system operates in a future year (D4.1 §9.3.5, §12.3.2), when the key technology is below TRL 7 (Q6b), or when the analysis period or the lifetime of the main assets exceeds 15 years (D4.2 §9.3, which gives the figure without a source; it can be changed among the advanced settings). Left unanswered, the operating year counts as the year of the study, except with Q2 = D (future alternatives), which counts as future. The analysis period is the time span the study covers. The lifetime of the main assets is also the period over which their capital goods are amortised, the same in LCA and LCC (D4.1 §6.3.3, §14.2.2); assets with a different lifetime go in the data collection file.',
      start: {
        label: 'In which year does the system operate, or is it assumed to operate?',
        options: {
          unset: 'Not answered (the year of the study; a future year if Q2 = D)',
          now: 'Now: the year of the study',
          future: 'A future year',
        },
        yearPlaceholder: 'e.g. 2030',
      },
      period: {
        label: 'For how many years does the study follow the system (analysis period or project horizon)?',
        placeholder: 'e.g. 25; empty for a one-year picture',
      },
      lifetime: {
        label: 'Technical lifetime of the main assets: how long the plants physically last, not the project horizon (also their amortisation period)',
      },
      placeholder: 'e.g. 20',
      unit: 'years',
      plain:
        'Over which years does the study look at the system? If it describes how things work today, a picture of the present is enough. If it is about a plant that will run in a later year, or it follows the system for decades, the result depends on how electricity, fuels and markets will change, and the tool asks you to take a view on that future: the same future for the environmental and the economic reading.',
    },
    q9: {
      title: 'Q9 — What is the study for, and how far do its effects reach? *',
      help: 'Required. It sets the modelling situation (ILCD A, B, C1 or C2); Q1 only describes the subject.',
      details: 'D4.1 Table 1 classifies the study by the decision it supports and the scale of its consequences, not by its subject (D4.1 §4.2.3). Micro (Situation A) is the default for single exchanges and park or plant designs, even with no named decision-maker (§4.3.4). Structural (Situation B) needs proof that the change shifts installed capacity in the affected market, e.g. about 1% or more of new build (§4.3.4, §11.3.1); without it the study stays A, with B as a sensitivity. Documenting an existing network is Situation C1 (substitution, §7.2.3); strict reporting of one company in isolation is C2 (allocation, no credits, §7.2.3), costed at company level only (a T4.6 design choice).',
      options: {
        micro: 'It explores or supports a choice, even a hypothetical one with no named decision-maker, and its effects stay within the plants involved (Situation A)',
        structural: 'It supports a choice whose effects change what a whole market or sector produces (Situation B; the proof must be documented)',
        none: 'No choice: it documents what an existing network or system delivers, as it is (Situation C1)',
        corporate_report: 'Strict reporting of one company in isolation (ESG / CSRD), with no credit for what the symbiosis avoids elsewhere (Situation C2)',
      },
      screening: {
        label: 'Is it documented that the change displaces about 1% or more of the new capacity in the affected market?',
        yes: 'Yes, it is documented (Situation B)',
        no: 'No (Situation A, with Situation B tested as a sensitivity)',
      },
      plain:
        'What is the study for? Most studies explore or back a choice whose effects stay inside the plants involved, even when nobody has to decide yet. Only when the change is big enough to shift what a whole market produces, and you can show it, does the study change kind. If you are only describing a network that already runs, or reporting one company\'s own figures, say so: each case is modelled differently.',
    },
    q10: {
      title: 'Q10 — Does the study serve a public policy or territorial planning objective?',
      help: 'Optional. Unanswered, the engine infers it from Q1 (yes only for Q1 = C).',
      details: 'D4.2 §2.3 adds a societal LCC (net tax factor, monetised externalities, social discount rate) when the study serves a public policy or territorial planning objective, whatever Q1 or Q4. A municipality planning an eco-park (Q1 = B) or a regulator monitoring a sector (Q1 = E) can answer yes without being Q1 = C. With Q1 = D the tool keeps the conventional company-level LCC (a T4.6 design choice) and tells you.',
      options: {
        unset: 'Not answered (inferred from Q1)',
        yes: 'Yes — a public policy or territorial planning objective (adds the societal LCC)',
        no: 'No — it does not serve a public policy or planning objective',
      },
      plain:
        "Answer yes if the study is meant to feed a public decision — a municipality, a region, a regulator, a plan. It then adds a second economic reading taken from the point of view of society: taxes counted differently, and effects nobody pays for in money. For a single company's own account the economic reading stays at company level, and the tool tells you. Leave it unanswered and the tool reads it off the first question.",
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
    q5Note: "Answer with the arrangement as it stands today — agreed, or intended if the exchange is not running yet. It is a starting assumption, not a finding: if the study changes who pays whom, come back and change it. Pick \"free / ambiguous\" when it is genuinely undecided rather than forcing a direction.",
    emptyHint: 'No flows yet. Add at least one to characterise per-flow Q5.',
    headers: { id: 'ID', name: 'Name', q5: 'Q5', sellable: 'Sellable to others?', sector: 'Sector (Part 2)' },
    sellable: { unset: '— not answered', yes: 'Yes', no: 'No' },
    sellableHint: 'If the partner did not take this flow, could the generator sell it to someone else at a positive price? Yes makes it a co-product, no makes it a waste whatever the agreed price (D4.1 §8.3.3). Optional: the result notes when it disagrees with Q5.',
    sectorHint: 'What the flow is, if it falls in one of the sectors with their own rules in D4.1 Part 2. Optional: the result names the chapter to follow.',
    sectorNone: '— none of these',
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
      "A scenario here varies the *methodological* answers, not the physical network: each one inherits Q1–Q7 from the baseline and differs only through the overrides dict (\"what if this were ex-post\", \"what if the sector were different\"). Comparing where a flow goes, over what distance, or at what price is a network comparison — draw those alternatives in the Network Builder; the engine does not compare them yet.",
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
      asset_lifetime: 'Years (legacy; used when the Q8 lifetime is empty); a horizon beyond the threshold (15 by default) adds future background to LCA and LCC (lca_mc_21, lcc_hc_23, CIR-01)',
      future_background_threshold_years:
        'Years. The study horizon above which LCA and LCC need future background (lca_mc_21, lcc_hc_23, CIR-01). Default 15, the figure D4.2 §9.3 gives without a source; change it and justify it in the methodological charter',
      transport_sensitive: 'Boolean; true activates CIR-03',
      network_nodes: 'Integer; ≥3 (with Q1=B + interdependent_flows) activates CIR-04',
      interdependent_flows: 'Boolean; true (with Q1=B + network_nodes≥3) activates CIR-04',
      frontier_categories_active: 'Boolean; true activates CIR-06',
      is_specific_capital_goods: 'Boolean; true activates IR-13 / B-06 / CIR-08',
      multi_actor: 'Boolean; true (with Q1∈{B,C}) activates FU-02',
    },
  },

  narrative: {
    pathway: {
      'IS-01': {
        title: 'Operational symbiosis — decision support',
        body: 'A symbiotic exchange between two companies, or inside an eco-park, assessed to decide whether and how to run it.',
        detail: 'Q1 says the object is a specific exchange or a park; Q2 says you are deciding rather than reporting. The pipeline therefore configures decision support: by default attributional modelling with substitution and an LCC tied to the perspective you chose (the ILCD situation and the LCC type below show what applies to your answers) and — when Q2 is a baseline plus alternatives — a comparison across scenarios.',
      },
      'IS-02': {
        title: 'Sector-wide pre-feasibility — policy',
        body: 'A policy or programme decision at regional or national scale, where the consequences are structural rather than marginal.',
        detail: 'Because the object is a public decision, everything downstream is scaled to consequences the background system will actually feel: by default the ILCD situation moves to B and the LCC gains the societal perspective, since a policy has to account for welfare and not only for the firms taking part. If you answered Q9 or Q10, the sections below show the situation and the costing that apply.',
      },
      'IS-03': {
        title: 'Corporate contribution — reporting',
        body: 'The symbiotic contribution of a single company inside a network, for ESG / CSRD reporting.',
        detail: 'The engine narrows to strict accounting: allocation rather than substitution credits (ILCD C2) and conventional LCC alone. The figure has to describe one company\'s own position in a way an auditor can trace, not the benefit the network produces collectively.',
      },
      'IS-04': {
        title: 'Emerging IS network — ex-ante design',
        body: 'A network still being designed, assessed on dynamic scenarios with no operating baseline.',
        detail: 'Q1 is an exchange or a park, but Q2 says the system is still on the drawing board and is explored through dynamic scenarios rather than against an operating baseline. ADR-005 keeps this as its own pathway only for Q1 ∈ {A, B}: for a policy or a corporate report the object of study dominates the temporal stance.',
      },
      'IS-05': {
        title: 'Monitoring — symbiosis in operation',
        body: 'Time-series monitoring of an already operational symbiosis.',
        detail: 'No decision is on the table: the study documents a network that already runs. That puts it, by default, in ILCD C1 — accounting that still shows what the network gives the wider economy — and the value of the exercise is the time series, so the data collection has to be repeatable period after period.',
      },
    },
    extendedSuffix: 'The assessment compares a baseline against alternative scenarios.',
    ilcd: {
      'ILCD Situation A': {
        short: 'Micro-level decision support: the exchange is too small to change the background system. Attributional modelling, with substitution against the average market mix.',
        detail: 'The exchange affects the actors involved, not what the wider economy produces or how. You therefore model with average, accounting-style data, and represent what the symbiosis displaces by substituting the average market mix — the national grid mix for electricity, average virgin production for a material. D4.1 warns explicitly against reaching for consequential modelling merely because a decision is being taken.',
      },
      'ILCD Situation A multi-actor': {
        short: 'Micro-level decision support across a multi-actor network: the same modelling rule as Situation A, applied to the whole park rather than to a single exchange.',
        detail: 'The modelling rule does not change — consequences stay micro-level, so average data and substitution at the market mix. What changes is the bookkeeping: several partners share one system, so the boundary and the shared flows have to be agreed between them before modelling starts, otherwise the same flow is counted twice or a partner\'s contribution disappears.',
      },
      'ILCD Situation B': {
        short: 'Meso/macro-level decision support: the decision causes structural change in the background system, so consequential modelling against the marginal technology. D4.1 asks you to prove that scale before choosing it.',
        detail: 'The decision is large enough to shift installed capacity or the output of a specific technology. Modelling goes consequential, and what the symbiosis displaces is the marginal technology, identified through a market analysis rather than taken as the average mix. The burden of proof is on you: this route has to be demonstrated, not assumed.',
      },
      'ILCD Situation C1': {
        short: 'Accounting with interactions — documenting what an existing network gives the wider economy. Substitution at the average market mix, as in Situation A.',
        detail: 'You are documenting a network that exists rather than supporting a decision, so the study is descriptive. But since the point is to show what the network gives the wider economy, multifunctionality is still resolved by substitution at the average market mix — operationally the same rule as Situation A.',
      },
      'ILCD Situation C2': {
        short: 'Strict accounting for one partner in isolation: allocation, and no substitution credits.',
        detail: 'Strict accounting for a single partner on its own, typically corporate reporting. Multifunctionality is resolved by allocation, and no credit is claimed for what the symbiosis displaces elsewhere: the number describes that partner\'s share of the burdens, not the benefit the network produces.',
      },
    },
    lcc: {
      'deactivated': {
        short: 'No economic analysis — the economic dimension is off in Q3.',
        detail: 'Q3 has no economic dimension selected, so the engine configures no costing at all. If the case needs a business case — and for a symbiosis that has to be signed by several firms it usually does — go back to Q3 and switch the economic dimension on.',
      },
      'C+E': {
        short: 'Conventional LCC (the firm\'s real cash flows) plus environmental LCC (the value chain, on the same boundary as the LCA).',
        detail: 'Two views run together. The conventional LCC answers whether it pays for the individual firm: real cash flows, taxes and fees as costs, subsidies as reductions. The environmental LCC widens the boundary to every actor in the life cycle and is kept consistent with the parallel LCA, so the two can be read side by side. Watch for double counting: a carbon or landfill tax already in the cash flows must not reappear as a monetised externality.',
      },
      'C+E+S': {
        short: 'Conventional and environmental LCC plus societal LCC: taxes and subsidies adjusted through the Net Tax Factor, environmental impacts monetised.',
        detail: 'On top of the firm and value-chain views comes the welfare view. Taxes and subsidies are transfers inside society rather than real costs to it, so they are excluded or converted into shadow prices through the Net Tax Factor, and the environmental impacts from the parallel LCA are monetised. This is the configuration a public decision needs, which is why it comes with the policy pathway.',
      },
      'C-LCC': {
        short: 'Conventional LCC only — the firm perspective, equivalent to a total cost of ownership analysis.',
        detail: 'Only the firm\'s own perspective. Every policy instrument is a real cash flow: taxes and fees are costs, subsidies reduce capex or opex. It is the right frame for corporate reporting, and it deliberately says nothing about value-chain or societal effects — claiming those would overstate what a single-actor account can support.',
      },
      'C+N': {
        short: 'Conventional LCC for each partner, consolidated at network level. No environmental LCC: the case has no LCA to keep it consistent with.',
        detail: 'Each firm\'s real cash flows first, then the same accounts added up across the network, where the payments between partners cancel out. The environmental LCC is left out because D4.2 builds it on the boundary of a parallel LCA, and the case assesses no environmental dimension. Switch the environmental dimension on in Q3 if the study needs the value-chain view.',
      },
      'C+N+S': {
        short: 'Conventional LCC per partner and for the network, plus societal LCC with the Net Tax Factor. Without an LCA, environmental impacts are not monetised.',
        detail: 'The firm and network accounts as above, plus the welfare view a public decision needs: taxes and subsidies converted through the Net Tax Factor, a social discount rate, and a boundary that reaches end of life. What is missing is the monetisation of environmental impacts, which needs the results of a parallel LCA: switch the environmental dimension on in Q3 to add it.',
      },
    },
    slca: {
      'active': {
        short: 'S-LCA active: social indicators per stakeholder group.',
        detail: 'The social dimension is on. Each stakeholder group — workers, consumers, local communities, value-chain actors — is mapped to the processes it is affected by, and from there to impact subcategories and indicators. The mapping is only as good as the engagement behind it, so talking to the groups involved is part of the data collection, not an optional extra.',
      },
      'deactivated': {
        short: 'S-LCA not activated — the social dimension is off in Q3.',
        detail: 'Q3 has no social dimension selected, so no stakeholder mapping and no social indicator are configured. Switch it on in Q3 if the case has to say anything about workers or local communities — which is usually the case when a symbiosis is presented to a municipality or a community.',
      },
    },
  },

  result: {
    notes: { title: 'Notes on your answers' },
    verdict: {
      moreInfo: 'More on this configuration',
    },
    next: {
      obligations: "{{count}} methodological practices apply to your answers. They are listed, with what triggered each one, in the Data Collection File.",
      title: 'What to do next',
      lead: 'Items the engine raised on your answers. Each one says why it applies to your case and, where the engine settles it, how.',
      provenance:
        "Rule and decision wording is translated from the engine's English table. The code next to each item — IR-01, CDP-02 — is the reference that does not change between languages.",
      allClear:
        'No methodological obligation applies to these answers, and no critical decision point was surfaced. Next step: collect the inventory data.',
      ctaHint: 'The Data Collection File is calibrated on this pathway: it only asks for what your case needs.',
    },
    actionKind: {
      block: 'Blocking',
      obligation: 'To document',
      decision: 'To decide',
    },
    severity: {
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low',
    },
    action: {
      appliesToCase: "Applies to this case.",
      resolution: "How it is resolved",
      why: 'Why it applies to you',
      todo: 'What to document',
    },
    technical: {
      title: 'Technical detail (engine output)',
      lead: 'Everything the pipeline produced, for review and traceability.',
    },
    title: 'Engine output',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'ILCD situation',
      lccType: 'LCC type',
      slca: 'S-LCA',
      activatedNodes: 'Activated nodes',
      l1Blocks: 'L1 blocks fired',
      l2Violations: "L2 assertion failures (diagnostic)",
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
      run: 'Work out the pathway',
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
      'Optional for browsing legacy / public cases. Required to create private cases that only you can change.',
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
    errors: {
      registrationClosed: 'Registration is closed on this instance. Ask the administrator for an account.',
      emailTaken: 'An account with this email already exists. Try signing in.',
      invalidCredentials: 'Wrong email or password.',
    },
  },

  scoringPending: {
    title: "Awaiting the scoring",
    body:
      "The quantitative LCSA scoring for this case has not been delivered yet. When it arrives, the environmental, economic and social indicators appear here.",
    lastChecked: "Last checked: {{date}}",
  },

  compliance: {
    status: {
      ok: "yes",
      no: "not declared",
      pending: "pending",
      na: "not applicable",
    },
  },
  stakeholder: {
    audience: {
      industry: {
        whatYouSee:
          "What this page tells you today: which methodology the assessment will follow, and therefore which data you will be asked for. The data request itself is the Data Collection File.",
        whenScoring:
          "Once the scoring arrives you will see the environmental and economic indicators for the case, so you can judge whether the exchange pays off.",
      },
      community: {
        whatYouSee:
          "What this page tells you today: which flows the companies exchange, and whether this study examines social effects at all.",
        whenScoring:
          "Once the scoring arrives you will see the social indicators — workers, local community — and the environmental ones, each with the group it concerns.",
      },
      authority: {
        whatYouSee:
          "What this page tells you today: how the assessment is framed, which compliance signals the case declares, and the geographic scope it covers.",
        whenScoring:
          "Once the scoring arrives you will see the environmental figures and, where the study includes them, the societal costs — the two a public decision rests on.",
        scope: "Geographic scope declared for the case: {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "What this page tells you today: which materials this symbiosis puts back into use, and whether environmental and social effects are examined.",
        whenScoring:
          "Once the scoring arrives you will see the environmental and social indicators of the chain behind the product.",
        productCaveat:
          "This assessment describes the exchange between the companies, not the final product you buy: the tool does not ask what the product is.",
      },
    },
    noVerdict: "No pathway derived yet for this case.",
    notAssessed: {
      social: "This study does not assess social impacts: the social dimension was switched off when the case was set up. Ask the analyst to turn it on if workers or the local community are part of the question.",
      economic: "This study does not assess costs: the economic dimension was switched off when the case was set up.",
    },
    flowsLine_one: "{{count}} flow exchanged: {{names}}.",
    flowsLine_other: "{{count}} flows exchanged: {{names}}.",
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
        'Full technical view of the methodological configuration and of the quantitative scoring, which is produced outside this tool by the SYMBA partner CIRCE. For whoever runs the site, and for the analyst behind the study.',
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
    activatedNodesCount_one: '{{count}} activated methodological node',
    activatedNodesCount_other: '{{count}} activated methodological nodes',
    obligations_one: "{{count}} methodological practice to document",
    obligations_other: "{{count}} methodological practices to document",
    cdpFlagsCount_one: '{{count}} cross-dimension tension flag',
    cdpFlagsCount_other: '{{count}} cross-dimension tension flags',
    complianceTitle: 'Compliance signals',
    compliance: {
      peerReview: 'Independent peer review: {{status}}',
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

  obligations: {
    empty: "Nothing to document for this case.",
    lead:
      "{{total}} items apply to this case: {{mandates}} methodological mandates and {{rules}} cross-method rules triggered by your answers. Each one is a commitment to document in the LCSA report.",
    because: "Applies because:",
    notApplicable: "Does not apply here: {{fields}} — that method is switched off in Q3.",
    origin: {
      mandate: "Mandate",
      rule: "Cross-method rule",
    },
  },
  dcf: {
    noCase: { title: 'No case yet', desc: 'The Data Collection File is built from your assessment: answer the questionnaire first (or open a saved case), then come back here.', cta: 'Open questionnaire' },
    derivedField: "engine-filled",
    obligationsTitle: "Methodological choices to document",
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
    tabOverview: 'Overview',
    tabNetworkBuilder: 'Network builder',
  },

  networkDiagram: {
    counts: '{{actors}} actors · {{flows}} flows',
    placeholder:
      'Preview only — this is a placeholder built from the flows declared in the questionnaire. Draw the real network in the Network builder tab and it appears here, in the Excel and in the report.',
  },

  networkBuilder: {
    loadExample: 'Load example',
    exampleReplaceConfirm:
      'This replaces the network currently on the canvas with the example. Continue?',
    whyAsked: 'Asked because:',
    hint: {
      step1: 'Add one actor per participant in the symbiosis — a plant, a utility, a municipality.',
      step2: 'Drag from the edge of a node to another to connect them: that arrow is a row of the flow matrix.',
      step3: 'Select a node or an arrow and fill its fields in the side panel. Only the fields your pathway needs are shown.',
      dismiss: 'Got it',
    },
    empty: {
      title: 'Nothing drawn yet',
      body: 'Add your first actor, or load a worked example with three actors and two flows to see how a network is put together.',
    },
    example: {
      producer: 'Producer plant',
      consumer: 'Receiving plant',
      facilitator: 'Industrial park operator',
      flow: 'Example flow',
    },
    title: 'Network builder',
    subtitle:
      'Draw the symbiosis network: every node is an actor, every arrow a row of the flow matrix. What you draw here is what the Excel and the report will carry.',
    addActor: 'Add actor',
    actor: 'Actor',
    noRole: 'role not set',
    save: 'Save network',
    saving: 'Saving…',
    synced: 'Saved on the server',
    unsavedChanges: 'Unsaved changes',
    unsavedCase: 'Local draft — save the case to sync',
    saveCaseFirst:
      'This case is not saved on the server yet. You can draw the network now; save the case from the result page to store it.',
    missingRequired_one: '{{count}} required field still empty',
    missingRequired_other: '{{count}} required fields still empty',
    selectHint: 'Select an actor or a flow to edit its fields.',
    removeRow: 'Remove',
    unwiredTitle: 'Flows not yet drawn',
    unwiredHint:
      'These flows come from your Q5 answers. Connect two actors on the canvas to wire the next one up.',
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
