// English locale — source of truth. Other locales mirror this structure.
// Keys are flat with dot-notation; nested objects below are organisational.
//
// Methodology terms kept in English in all locales (LCA/LCC/S-LCA acronyms,
// "function-oriented", PEF, ILCD, MFCA/CBA/TEA, etc.).

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
    summaryTitle: 'Configuration summary',
    scoringTitle: 'Scoring',
    complianceTitle: 'Compliance signals',
    compliance: {
      peer: { name: 'Peer-review claim', desc: 'Q4 = E · ISO 14044 reviewer eligibility' },
      pef: { name: 'EU PEF alignment', desc: 'Q4 = D · Circular Footprint Formula', descC2: "Q4 = D · CFF not applied: one company's accounts use allocation (ILCD C2)" },
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
        body: 'Methodological configuration, peer-review status, public-superiority claims, EU PEF alignment, DNSH screening.',
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
      situations: 'ILCD situations',
      sectors: 'Sectors covered',
      bySituationTitle: 'By ILCD situation',
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
      assess: { name: 'Start a new assessment', desc: 'Configure the methodology for an IS case through a short questionnaire.' },
      read: { name: 'Read a shared report', desc: 'Open a case someone shared with me and see the report.' },
      explore: { name: 'Explore a region / sector', desc: 'Browse aggregate insights for my area or industry.' },
      browse: { name: 'Just look around', desc: 'No specific goal — I want to see what the tool does.' },
    },
  },

  adminShell: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search cases, partners… (⌘K)',
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
      'Answer a short questionnaire about your industrial-symbiosis case study. The decision engine derives the methodological configuration (ILCD situation, LCC structure, study horizon, reference scenario) from the 186 Phase 1 nodes of deliverables D4.1, D4.2 and D4.3, plus the 40 cross-method validation rules. Then collect inventory data with the partners of the symbiosis network and surface the multi-stakeholder report.',
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
      configured: 'Configured',
      configuredDetail: '{{total}} total',
      situations: 'ILCD situations',
      situationsDetail: 'A · B · C1 · C2',
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
    title: 'About',
    p1:
      "SYMBA T4.6 helps whoever sets up a life-cycle sustainability assessment of an industrial symbiosis: it derives, from a questionnaire about the case, which methodology applies, which practices have to be documented, and which data to collect from the partners of the network. It does not compute the results — the quantitative scoring is produced outside the tool and shown here once delivered.",
    p2:
      'The questionnaire (Q0-Q12; Q9 sets the ILCD situation, Q10 the societal LCC) drives the activation of 186 Phase 1 nodes plus 40 cross-method validation rules (18 IR + 10 CIR + 5 FU + 7 B). Reporting-time L3 enforcement (IR-04 + IR-10) plus 12 Critical Decision Points surface cross-method tensions to the user.',
    p3:
      'Per-pillar config display, advanced overrides, and the "Show reasoning" panel are all live.',
  },

  error: {
    title: 'Something went wrong',
    backHome: 'Back home',
    fallback: 'Unexpected error',
  },

  questionnaire: {
    parts: {
      study: 'The study',
      exchanges: 'The exchanges',
      description: 'Description of the case',
    },
    scopeNote: "This tool does not compute LCA/LCC/S-LCA numbers. It derives the methodological configuration your case requires and the data you have to collect; the quantitative scoring is produced externally and shown here once delivered.",
    title: 'Questionnaire',
    intro:
      'Questions about your industrial-symbiosis case, in three parts: the study, the exchanges, and a description of the case. Required: the dimensions (Q3), the decision and its scale (Q9), the subject (Q1) and, with the economic dimension, the public objective (Q10); the rest is optional and sharpens the configuration.',
    guidedBannerTitle: 'Guided mode active',
    guidedBannerBody:
      'Each question opens with a short explanation in plain words. The full methodological note, in the wording of the project deliverables, stays one click away under each question. The answers decide the methodological configuration and the data-collection plan you receive at the end.',
    runButton: 'Work out the configuration',
    runningButton: 'Working it out…',
    resetButton: 'Reset draft',
    confirmReset: 'Discard all answers and start over? This cannot be undone.',
    q1Required: 'Q1 is required.',
    shortcutTip: 'Tip: Ctrl/⌘+Enter to run',

    q0: {
      title: 'Q0 — Which kind of IS study is it: analysis, improvement, expansion, design or restructuring?',
      help: 'Optional. The kind of study, as D4.1 asks to declare it in the goal. It changes nothing by itself.',
      details: 'D4.1 §4.3.2, after Mattila et al. (2012), asks to classify the goal according to an established framework. Analysis evaluates an existing network to understand its performance; Improvement identifies hotspots within an existing network to optimise it; Expansion assesses the impacts of adding a new partner or exchange; Design compares technological and logistical options for a new, planned network; Restructuring evaluates a major reconfiguration of an established network. The answer goes into the report and the Data Collection File; how the study is modelled is still decided by the questions that follow. The engine notes only two contradictions: an analysis whose exchanges do not take place yet, and a design whose exchanges already do (Q2).',
      options: {
        unset: { label: 'Not answered' },
        analysis: { label: 'Analysis', description: 'Evaluate an existing network to understand its performance.' },
        improvement: { label: 'Improvement', description: 'Find the hotspots of an existing network to optimise it.' },
        expansion: { label: 'Expansion', description: 'Assess the impacts of adding a new partner or exchange.' },
        design: { label: 'Design', description: 'Compare technological and logistical options for a new, planned network.' },
        restructuring: { label: 'Restructuring', description: 'Evaluate a major reconfiguration of an established network.' },
      },
      plain:
        'Pick the kind of study: understanding how an existing network performs, finding where it can improve, adding a partner or an exchange, designing a new network, or rethinking an established one. The answer is recorded with the study; it does not change the method by itself.',
    },

    q1: {
      title: 'Q1 — What are you analyzing? *',
      help:
        'Pick the closest match: what counts is the subject of the study, not who commissioned it. It describes the system and its boundary; how the study is modelled comes from Q9 and the questions after it. (Required.)',
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
        'Say what you are examining: one exchange, a park, a programme, one company, a symbiosis you follow over time. The answer describes the system and its boundary; how the study is modelled is decided by the questions that follow, starting with what the study is for (Q9). If you hesitate between two options, keep the one that describes the thing whose effects you want to measure.',
    },

    q2: {
      title: 'Q2 — Do the exchanges the study measures already take place?',
      details:
        'Answer about the symbiotic exchanges, not about the plants: a plant can exist while the exchange you study is still a plan. A — yes: the exchanges run today and their flows can be measured (e.g. Kalundborg; the tannery cluster of Daddi 2017). The reference is what each firm would do today if the links were severed (HNSRS, D4.1 §11.1). If the network has run for many years, that reference is a modern counterfactual, not the firms\' configuration of decades ago (D4.1 §11.2.2): the follow-up question asks this. B — not yet: the exchanges are planned, designed, hypothetical or only just starting, even between plants that already run. The reference is today\'s business-as-usual without them, including any exchanges that already run (CNSRS, D4.1 §11.1). Comparing alternatives (an expansion, a new technology) is open to every study: add them as scenarios below (D4.1 §4.3.3). When the system operates is asked in Q8.',
      options: {
        A: { label: 'A. Yes, they already take place', description: 'The exchanges run today: their flows can be measured.' },
        B: { label: 'B. Not yet', description: 'Planned, designed or only just starting, even between plants that already exist.' },
      },
      longStanding: {
        label: 'Has the network run for many years, so that the plants it replaced would no longer be built today?',
        yes: 'Yes — the reference is a modern counterfactual (D4.1 §11.2.2)',
        no: 'No — the network is recent',
      },
      plain:
        'Think of the exchanges, not of the plants. If the flows between the companies already happen, you can measure them. If they are still an idea, even between plants that already run, you can only estimate them. Want to compare alternatives, such as an expansion or a new technology? Add them as scenarios below, whatever you answer here.',
    },

    q3: {
      title: 'Q3 — Which sustainability dimensions to include? *',
      help: 'At least one is required. Environmental and economic are the usual pairing.',
      details:
        'ENV — Environmental Life Cycle Assessment (LCA): impacts on climate, ecosystems, resource use. Almost always selected. ' +
        'ECO — economic dimension, assessed with Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) is a technique used inside the LCC (activated by ECO and by contested flows in Q5), not an alternative to it; CBA and TEA are not offered by this engine. ' +
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
        'E — academic peer-reviewed publication. Requires full transparency (data sources, allocation choices, sensitivity). Often combined with B or D. If the paper claims that one system is better than or equivalent to a competing alternative, also select C; a comparison that does not declare a winner stays E (T4.6 reading). ' +
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
        E: { label: 'E. Academic publication', description: 'Academic peer-reviewed publication (add C if it claims one system beats or matches a competing one).' },
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
      help: 'The main sector of the case, as a description. The sector rules of D4.1 Part 2 follow the sector of each exchanged flow, declared in the flows table.',
      details:
        'The sector describes the case and opens a few sector-specific fields in the Data Collection File; the sector rules of D4.1 Part 2 follow the sector declared for each flow, because the chapters follow what is exchanged. Pick the closest match to the dominant sector of the case (the actor that contributes most mass/energy/value). ' +
        'Examples: pulp_paper for Sokka 2011 (UPM Kymi); cement_construction for Hashimoto 2010 (Kawasaki); textile_leather for Daddi 2017 (tannery cluster); wastewater_sludge_biofactories for Wiktor 2018; chemicals_fertilizers for Leiva 2025 Escombreras; biobased_polymers for Briassoulis. ' +
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
        'The main sector of the case: the activity of the company that contributes most of the mass, energy or value. It describes the case; the sector rules of the guidelines follow what each flow is, which you declare in the flows table. If the case straddles several sectors, pick Multi-sector, and ignore the entries marked (legacy).',
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL of the dominant or critical technology in the symbiotic network. Drives the choice of inventory data quality (measured vs literature vs engineering estimate) and the uncertainty budget downstream. ' +
        'It is the TRL of the key technology itself, not of its adoption: a mature technology that treats the same kind of input at the same scale as elsewhere, used for the first time in this network or region, is still TRL 9, and the novelty shows in the data quality (T4.6 reading); a mature process applied to an input never treated at scale is a low-TRL exchange (D4.1 §9.3.5). ' +
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
        "How mature the key technology is: in commercial operation, a first pilot, a prototype, or still in the laboratory. The less mature it is, the more your figures will be estimates rather than measurements, and the more the result has to carry its own uncertainty. Judge the technology itself, not whether it is new here: a proven process used for the first time in your region is still mature, as long as it treats the same kind of material as elsewhere.",
    },

    q7: {
      title: 'Q7 — How concentrated are the key interactions?',
      help: 'It sets how the impact assessment is regionalised. Transport is modelled explicitly for every exchange whatever you answer; the break-even distance is asked for every flow in the Data Collection File.',
      details:
        'D4.1 §12.2.3: a global or national average characterisation factor fails to capture the significance of a system whose key interactions are intensely local (e.g. a water-sharing synergy in an arid region). A — one site or adjacent plants: spatially specific factors for water scarcity, eutrophication and acidification, and the scale mismatch flagged where regional factors are applied at site level (§12.3.3). B — within one region: regionalised factors, e.g. the Seppälä / Posch country-dependent factors for a regional cluster (§12.3.3). C — across regions or borders: spatially explicit factors at the location of each emission. Transport never depends on this answer: every link is a distinct foreground unit process with primary data, and GIS or routing is recommended for every exchange (§12.3.1). The second part asks for the market the replaced products come from: background mixes and the reference scenario are resolved on it, national or sub-national as a rule, continental only for globally traded commodities with no sub-continental market (§11.3.1).',
      options: {
        A: { label: 'A. One site', description: 'One site or adjacent plants: the interactions are intensely local.' },
        B: { label: 'B. Regional', description: 'Several sites within one region.' },
        C: { label: 'C. Across regions', description: 'Sites across regions or borders.' },
      },
      market: {
        label: 'Reference market: where would the replaced products come from?',
        help: 'The market the counterfactual would draw on, not the market of the symbiosis products. Optional.',
        region: 'Country or region',
        regionPlaceholder: 'e.g. Italy, Catalonia, EU',
        scope: {
          unset: 'Not answered',
          national: 'National',
          sub_national: 'Sub-national (a region inside a country)',
          continental: 'Continental (only for goods traded worldwide)',
        },
      },
      plain:
        'How close together the companies\' key interactions happen: on one site, within one region, or across regions or borders. It decides how locally the environmental impacts are assessed: water or air pollution next to one site counts differently from the same amount spread over a country. Transport is counted whatever you answer. Then say where the products the symbiosis replaces would otherwise come from: a country, a region or, for goods traded worldwide, a continent.',
    },
    q8: {
      title: 'Q8 — Time horizon of the study',
      help: 'Optional. One horizon for LCA and LCC alike.',
      details: 'The deliverables require one time horizon for LCA, LCC and S-LCA (D4.2 §11, D4.1 §14). Future background scenarios (SSP/RCP) are added to both when the system operates in a future year (D4.1 §9.3.5, §12.3.2), when the key technology is below TRL 7 (Q6b), or when the analysis period or the lifetime of the main assets exceeds 15 years (D4.2 §9.3, which gives the figure without a source; it can be changed among the advanced settings). Left unanswered, the operating year counts as the year of the study. The analysis period is the time span the study covers; as a rule it matches the technical lifetime of the main assets (D4.2 §9). The lifetime of the main assets is also the period over which their capital goods are amortised, the same in LCA and LCC (D4.1 §6.3.3, §14.2.2); assets with a different lifetime go in the data collection file.',
      start: {
        label: 'In which year does the system operate, or is it assumed to operate?',
        options: {
          unset: 'Not answered (the year of the study)',
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
      title: 'Q10 — Does the study serve a public objective or a public decision-maker? *',
      help: 'Required when the economic dimension is on: it decides whether the societal LCC is added.',
      details: 'D4.2 §2.3 adds a societal LCC (net tax factor, monetised externalities, social discount rate) when the study serves a public policy or territorial planning objective, and §2.2 ties the choice of LCC type to the perspective of the decision-maker: a municipality, a public utility or a regulator takes the public view, whatever the subject of the study (D4.2 §9.2 gives 3-5 % as the rate of a municipal or public-utility partner). A municipality planning an eco-park or a utility sizing a district-heating link answers yes. Strict reporting of one company (Q9: corporate report, Situation C2) keeps the company-level costing (a T4.6 design choice), and the tool tells you.',
      options: {
        yes: 'Yes — a public policy or planning objective, or a public decision-maker (adds the societal LCC)',
        no: 'No — a private decision or a company\'s own account',
      },
      plain:
        'Answer yes if the study is meant to feed a public decision, or is commissioned by a public body: a municipality, a region, a public utility, a regulator, a plan. It then adds a second economic reading taken from the point of view of society: taxes counted differently, and effects nobody pays for in money. For a company\'s own account the economic reading stays at company level.',
    },

    q11: {
      title: "Q11 — What does the study compare?",
      help: "Optional. It sets the basis of the functional unit; unanswered, the function-oriented unit of D4.1 Part 1 applies.",
      details: "D4.1 Part 2 asks the functional unit to reflect the primary function of the system (§4.3, §6.3, §8.3): an input-based unit (e.g. treatment of 1 tonne of waste) when the study compares waste management routes or the performance of a plant or service; an output-based unit (e.g. 1 kg of product, 1 MJ of energy) when it compares products against market alternatives or supports a substitution claim; a system of functional units when both functions are co-primary (Part 1 §5.3.2). D4.2 §3.1 asks a dual unit (waste treated + output generated) for the LCC when product substitution drives the study: the two deliverables differ, and the tool follows Part 2 for the LCA and reports the difference.",
      options: {
        unset: "Not answered (function-oriented unit, D4.1 Part 1)",
        waste_treatment: "How a waste is managed — waste routes, plant or service performance (input-based unit)",
        product_substitution: "Products against market alternatives — what the recovered output replaces (output-based unit)",
        co_primary: "Both: the treatment service and the products matter equally (system of functional units)",
      },
      plain:
        "What is the comparison really about? If the question is how best to deal with a waste — burn it, digest it, compost it — the result is counted per tonne of waste treated. If the question is whether the recovered product is better than the one it replaces, it is counted per unit of product. If both matter equally, both are counted side by side.",
    },
    q12: {
      title: 'Q12 — Does the symbiosis need new dedicated shared assets?',
      help: 'Optional, asked when LCA or LCC is on: pipelines, plants or storage built for the symbiosis.',
      details: 'D4.2 §4.2 asks whether the network requires new dedicated shared assets: if it does, their CAPEX and ongoing OPEX must be included in the cost breakdown and allocated among the partners that benefit from them. D4.1 §6.3.3 includes the capital goods and infrastructure unique to the IS scenario, amortised over each asset\'s technical lifetime (Q8). With both LCA and LCC on, a yes also switches on the rules that align capital goods between the two (IR-13, B-06); for parks and programmes with the social dimension, the S-LCA indicators for shared investment (CIR-08).',
      options: {
        unset: 'Not answered',
        yes: 'Yes — new pipelines, plants or storage are built for the symbiosis',
        no: 'No — the exchanges use existing assets',
      },
      plain:
        'Answer yes if something new has to be built for the exchanges to happen: a pipeline, a shared treatment plant, a storage tank. Its cost and its environmental footprint are then counted in the study and shared among the companies that use it.',
    },

    q2dCard: {
      title: 'Alternative scenarios (optional)',
      help:
        'Every study can compare alternatives with its baseline (D4.1 §4.3.3).',
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
    headers: { id: 'ID', name: 'Name', q5: 'Q5', sellable: 'Sellable to others?', sector: 'Sector (Part 2)', configuration: "Configuration (Part 2)" },
    sellable: { unset: '— not answered', yes: 'Yes', no: 'No' },
    sellableHint: 'If the partner did not take this flow, could the generator sell it to someone else at a positive price? Yes makes it a co-product, no makes it a waste whatever the agreed price (D4.1 §8.3.3). Optional: the result notes when it disagrees with Q5.',
    sectorHint: "Pick the D4.1 Part 2 chapter of what is exchanged, not of the company: agricultural and agro-industrial residues → Agri-food (§4); municipal or mixed waste, biowaste included (organic fraction of MSW, household food waste) → Waste valorisation (§8); sludge and treated wastewater, also when reused as water → Wastewater (§6); a product or energy carrier made from a flow (biomethane, digestate, electricity) → the chapter of that flow. Where §4 and §8 overlap on biowaste, the origin decides (T4.6 reading of Part 2 §3.3). Optional: the result lists the rules of the chapter.",
    sectorNone: '— none of these',
    configurationHint: "The typical configuration of the flow within its Part 2 chapter (D4.1 Part 2 §4.1-§8.1): the result names the conventional product it substitutes. Pick the sector first.",
    configurationNone: "— not answered",
    configurations: {
      agrifood_ad_bioenergy_fertiliser: "Organic waste to bioenergy & fertiliser (AD/composting)",
      agrifood_feed_bioconversion: "Food/agri by-products to animal feed (bioconversion)",
      agrifood_platform_chemicals: "Agro-residues to platform chemicals / bioplastics",
      agrifood_high_value_compounds: "Agro-industrial residues to high-value compounds",
      agrifood_nutrient_recovery: "Nutrient recovery to soil amendment / fertiliser",
      plastics_mechanical_recycling: "Mechanical recycling (open-/closed-loop)",
      plastics_chemical_recycling: "Chemical recycling (thermochemical/depolymerisation)",
      plastics_reusable_packaging: "Reusable packaging systems (PSS)",
      plastics_biobased_packaging: "Bio-based / biodegradable packaging",
      plastics_upcycling: "Upcycling and decontamination for high-value loops",
      wastewater_nutrient_recovery: "Nutrient recovery (P & N) to fertiliser products",
      wastewater_sludge_to_energy: "Wastewater/sludge to energy (biogas/CHP or upgrading)",
      wastewater_sludge_pyrolysis: "Sludge pyrolysis to biochar + energy carriers",
      wastewater_water_reuse: "Water reclamation and reuse",
      wastewater_screening_srf: "Screening waste to SRF for industry",
      wastewater_microalgae: "Microalgae-based wastewater biorefineries",
      textiles_fibre_to_fibre: "Fibre-to-fibre recycling (closed-loop)",
      textiles_downcycling: "Downcycling to non-wovens and composites (open-loop)",
      textiles_chemical_valorisation: "Chemical valorisation to biochemicals/monomers",
      textiles_recycled_carbon_fibre: "Recycled carbon fibre for technical textiles",
      textiles_pss_reuse: "Product-service systems (PSS) and reuse",
      wv_srf_coprocessing: "MSW/RDF/SRF to energy (co-processing)",
      wv_biowaste_nutrients_energy: "Biowaste to nutrients and energy",
      wv_tailings_construction: "Industrial residues/tailings to construction materials and metals",
      wv_weee_urban_mining: "WEEE and urban mining",
      wv_plastic_upcycling: "Plastic waste upcycling (mechanical/thermochemical)",
    },
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
      "A scenario here varies the *methodological* answers, not the physical network: each one inherits the answers of the baseline and differs only through the overrides dict (\"what if this were ex-post\", \"what if the sector were different\"). Comparing where a flow goes, over what distance, or at what price is a network comparison — draw those alternatives in the Network Builder; the engine does not compare them yet.",
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
    },
  },

  narrative: {
    ilcd: {
      'ILCD Situation A': {
        title: 'Decision support with limited consequences (ILCD Situation A)',
        short: 'Micro-level decision support: the exchange is too small to change the background system. Attributional modelling, with substitution against the average market mix.',
        detail: 'The exchange affects the actors involved, not what the wider economy produces or how. You therefore model with average, accounting-style data, and represent what the symbiosis displaces by substituting the average market mix — the national grid mix for electricity, average virgin production for a material. D4.1 warns explicitly against reaching for consequential modelling merely because a decision is being taken.',
      },
      'ILCD Situation B': {
        title: 'Decision support with structural consequences (ILCD Situation B)',
        short: 'Meso/macro-level decision support: the decision causes structural change in the background system, so consequential modelling against the marginal technology. D4.1 asks you to prove that scale before choosing it.',
        detail: 'The decision is large enough to shift installed capacity or the output of a specific technology. Modelling goes consequential, and what the symbiosis displaces is the marginal technology, identified through a market analysis rather than taken as the average mix. The burden of proof is on you: this route has to be demonstrated, not assumed.',
      },
      'ILCD Situation C1': {
        title: 'Documenting an existing network (ILCD Situation C1)',
        short: 'Accounting with interactions — documenting what an existing network gives the wider economy. Substitution at the average market mix, as in Situation A.',
        detail: 'You are documenting a network that exists rather than supporting a decision, so the study is descriptive. But since the point is to show what the network gives the wider economy, multifunctionality is still resolved by substitution at the average market mix — operationally the same rule as Situation A.',
      },
      'ILCD Situation C2': {
        title: 'Strict reporting of one company (ILCD Situation C2)',
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
        detail: 'On top of the firm and value-chain views comes the welfare view. Taxes and subsidies are transfers inside society rather than real costs to it, so they are excluded or converted into shadow prices through the Net Tax Factor, and the environmental impacts from the parallel LCA are monetised. This is the configuration a public decision needs, which is why a public or policy objective brings it in.',
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
    config: {
      title: 'Your configuration',
      lead: 'What your answers decided, in the terms of the deliverables. Open a row to read the engine\'s text, in English, with the section it comes from.',
      nodeText: 'Engine text (English)',
      labels: {
        claim: 'Public claim',
        purpose: 'Kind of study',
        lcc: 'Costing',
        slca: 'Social assessment',
        horizon: 'Study horizon',
        reference: 'Reference scenario',
        fu: 'Functional unit',
        regional: 'Local impacts',
        sectors: 'Sector rules',
        shared: 'Shared assets',
      },
      values: {
        claim: 'Comparative claim to the public: critical review by a panel of at least three independent experts, no weighting',
        claimNone: 'No public comparative claim',
        claimPolicy: "No public comparative claim; EU policy alignment (Q4 = D): independent panel review, a T4.6 choice",
        scope_continental: 'continental',
        scope_sub_national: 'sub-national',
        scope_national: 'national',
        slcaOff: 'Not included',
        reference_c2: 'Not used for credits: allocation, no substitution',
        horizonFuture: 'Future background (SSP/RCP scenarios)',
        horizonPresent: 'Present-day background',
        reference_hnsrs: 'What each firm would do today without the links (HNSRS)',
        reference_modern: 'A modern counterfactual: what each firm would do today without the links (HNSRS)',
        reference_cnsrs: 'Business as usual without the symbiosis, over the study\'s time horizon (CNSRS)',
        market: 'market: {{market}}',
        fu_waste_treatment: 'Input-based: the treatment of the waste',
        fu_product_substitution: 'Output-based: the products and what they replace',
        fu_co_primary: 'A system of functional units: treatment and products together',
        fu_function: 'Function-oriented, around the service delivered',
        regional_A: 'Site-specific characterisation factors for water, eutrophication and acidification',
        regional_B: 'Regional or country-dependent characterisation factors',
        regional_C: 'Country- or region-dependent factors for the territory of each emission',
        regional_unset: 'Site-specific factors where the key interactions are intensely local',
        shared: 'Their CAPEX and OPEX in the cost breakdown, shared among the partners that use them',
      },
      why: {
        slcaOff: 'the social dimension is not selected (Q3)',
        claim: 'the results will support a public claim of superiority or equivalence (Q4 = C)',
        horizonFutureGeneric: 'the study horizon reaches the future',
        horizonFutureYear: 'the system operates in a future year',
        label: 'Why:',
        lccC2: 'strict reporting of one company: company-level costing only',
        referenceC2: "strict reporting of one company: allocation, no credit for what the symbiosis displaces (D4.1 §7.2.3)",
        claimPolicy: "the results will support EU policy alignment (Q4 = D)",
        lccNoLca: 'no environmental dimension: no environmental LCC to align',
        lccPolicy: 'you answered that the study serves a public objective (Q10)',
        lccPolicyInferred: 'read off Q1, since Q10 is not answered',
        lccNoPolicy: 'no public objective (Q10): firm and value-chain views',
        horizonYear: 'the system operates in {{year}}',
        horizonTrl: 'the key technology is below TRL 7',
        horizonPeriod: 'the study follows the system for {{years}} years, more than {{threshold}}',
        horizonLifetime: 'the assets last {{years}} years, more than {{threshold}}',
        horizonPresent: 'present year, mature technology and a horizon within {{threshold}} years',
        referenceNotYet: 'the exchanges do not take place yet (Q2)',
        referenceRunning: 'the exchanges already take place (Q2)',
        referenceLongStanding: 'the network has run for many years (Q2)',
        fuGoal: 'the study compares: {{goal}}',
        fuDefault: 'what the study compares is not answered (Q11)',
        regionalUnset: 'the concentration of the interactions is not answered (Q7)',
        sectors: 'the chapters follow the sector declared on each flow',
        shared: 'the symbiosis needs new dedicated shared assets (Q12)',
      },
    },
    notes: { title: 'Notes on your answers' },
    engineNotes: {
      study_purpose_vs_q2: {
        analysis: "Study purpose: the study evaluates an existing network, but Q2 says the exchanges it measures do not take place yet. Check the two answers (D4.1 §4.3.2).",
        design: "Study purpose: the study compares options for a new, planned network, but Q2 says the exchanges already take place. Check the two answers (D4.1 §4.3.2).",
      },
      q9_unanswered: "Q9 is not answered, so the ILCD situation (Situation {{situation}}) is read off Q1, as for cases saved before Q9 existed. Answer Q9: D4.1 Table 1 sets the situation by the decision and the scale of its consequences, not by the subject of the study.",
      q10_unanswered: {
        yes: "Q10 is not answered, so whether the study serves a public objective is read off Q1: the societal LCC is added, as for cases saved before Q10 existed. Answer Q10: D4.2 §2.3 adds the societal LCC for a public policy or planning objective or a public decision-maker, whatever the subject of the study.",
        no: "Q10 is not answered, so whether the study serves a public objective is read off Q1: the societal LCC is not added, as for cases saved before Q10 existed. Answer Q10: D4.2 §2.3 adds the societal LCC for a public policy or planning objective or a public decision-maker, whatever the subject of the study.",
      },
      structural_without_screening: "Q9 says the effects are structural, but the market screening is not documented: the study is treated as ILCD Situation A, and Situation B must be tested as a sensitivity (D4.1 §4.3.4, §11.3.1).",
      structural_screening_missing: "Situation B needs proof that the change displaces about 1% or more of new capacity in the affected market (D4.1 §11.3.1); document it, or the study is Situation A with B as a sensitivity (D4.1 §4.3.4).",
      decision_scale_vs_q1: {
        c_micro: "Q1 (sector-wide pre-feasibility) usually means consequences at structural scale; you answered limited consequences, so the study is treated as ILCD Situation A. D4.1 §4.3.4: do not choose Consequential LCA simply because a decision is being made.",
        e_micro: "Q1=E (monitoring) implies no decision; you answered that a decision with limited consequences is supported, so the study is treated as ILCD Situation A.",
        e_structural: "Q1=E (monitoring) implies no decision; you answered that a decision with structural consequences is supported, so the study is treated as ILCD Situation B.",
      },
      q1_d_not_corporate: "Q1=D describes one company's sustainability reporting, but Q9 says the study is not a corporate report; the ILCD situation follows Q9. Strict corporate reporting (allocation, no credits) is ILCD Situation C2 (D4.1 §7.2.3).",
      documentation_vs_ex_ante: 'ILCD Situation C documents exchanges that already take place, but Q2 says they do not take place yet. Check that the situation is the one you mean.',
      c2_keeps_c_lcc: "Strict reporting of one company (ILCD Situation C2) keeps the company-level costing (C-LCC only) whatever Q10 says: it is a T4.6 design choice, since a single company has no network level.",
      policy_no_but_q1_c: "Q1=C (sector-wide pre-feasibility) usually serves a public policy; you answered that it does not, so the societal costing (S-LCC, net tax factor, social discount rate) is not added.",
      lcc_without_lca: {
        plain: "Q3 has no environmental dimension, so there is no parallel LCA: the costing is the conventional LCC of each partner, consolidated at network level (D4.2 §4.1), without the environmental LCC, which D4.2 builds on the LCA boundary.",
        policy: "Q3 has no environmental dimension, so there is no parallel LCA: the costing is the conventional LCC of each partner, consolidated at network level (D4.2 §4.1), without the environmental LCC, which D4.2 builds on the LCA boundary. The societal LCC keeps the net tax factor and the social discount rate, but externalities cannot be monetised without the LCA results (D4.2 §11.2).",
      },
      c2_allocation_over_pef: "Strict reporting of one company (ILCD Situation C2) uses allocation and no substitution credits (D4.1 §7.2.3), so the PEF Circular Footprint Formula asked by Q4=D is not applied: the CFF is a product method. If the study is a product footprint rather than a corporate report, review Q9.",
      slca_alone: "Q3 selects the social dimension only. D4.3 §3.1 builds the S-LCA on the functional unit and the boundaries of an LCA or LCC; with none selected, document the reference unit and the boundary in the methodological charter.",
      flow_sellable_but_waste: "Flow '{{flow}}': Q5 says the generator pays to get rid of it (waste), but a third party would pay for it. D4.1 §8.3.3 and §8.3.6 Step 1: a flow with an independent positive market value is a co-product, and its upstream burden is shared (substitution or allocation), not cut off. Check Q5 for this flow.",
      flow_price_without_market: "Flow '{{flow}}': Q5 says the recipient pays for it (co-product), but no third party would. D4.1 §8.3.3: without an independent market the price is an administrative fee and the flow is a waste, with zero burden from where it first reaches a non-negative value (§8.3.6 Step 4). The exception is a generator that changes its process for the partner (Q5 = d).",
      flow_freedom_to_act_settles: {
        co_product: "Flow '{{flow}}': Q5 leaves who pays whom open; the Freedom-to-Act answer (D4.1 §8.3.3) reads it as a co-product (§8.3.2, burden shared).",
        waste: "Flow '{{flow}}': Q5 leaves who pays whom open; the Freedom-to-Act answer (D4.1 §8.3.3) reads it as a waste (zero burden from where it first reaches a non-negative value, §8.3.6 Step 4).",
      },
      flow_part2_chapter: "Flow '{{flow}}': the sector rules of D4.1 Part 2 {{chapter}} apply to it; they are listed under Sector rules.",
      case_sector_without_flow: "The case sector belongs to D4.1 Part 2 {{chapter}}, but no flow declares that chapter, so its sector rules are not listed. The chapters follow what is exchanged: declare the Part 2 sector of each flow in the flows table.",
      flow_configuration_unknown: "Flow '{{flow}}': configuration '{{configuration}}' is not one of D4.1 Part 2.",
      flow_configuration_other_chapter: "Flow '{{flow}}': its configuration belongs to {{chapter}}, not to the declared {{declared}}; the rules of both chapters are listed.",
    },
    sectorChapters: { '§4': "§4 Agri-Food and Biorefineries", '§5': "§5 Plastics and Packaging", '§6': "§6 Wastewater and Biofactories", '§7': "§7 Textile and Technical Textiles", '§8': "§8 Waste Valorisation" },
    sectorRules: {
      title: 'Sector rules (D4.1 Part 2)',
      lead: 'The rules D4.1 Part 2 gives for the sectors your case touches. The tool does not apply them for you: document in the study how each one was met.',
      activatedBy: 'Applies because of: {{reasons}}',
      byFlow: 'the flow “{{name}}”',
      byCaseSector: 'the case sector (Q6a)',
      configurationLine: "Flow “{{flow}}” — {{configuration}}: the conventional product it substitutes is {{substitutes}}.",
      c2NoCredit: "Situation C2: no substitution credit is applied (D4.1 §7.2.3); the product only describes the configuration.",
      count: '{{count}} rules',
      strength: { must: 'must', should: 'should', descriptive: 'practice' },
    },
    verdict: {
      moreInfo: 'More on this configuration',
    },
    next: {
      obligations: '{{count}} obligations to document ({{groups}}): they are listed, with what triggered each one, in the Data Collection File.',
      families: {
        IR: '{{count}} on integrating the methods',
        CIR: '{{count}} switched on by your answers',
        FU: '{{count}} on the functional unit',
        B: '{{count}} on boundaries',
      },
      title: 'What to do next',
      lead: 'Items the engine raised on your answers. Each one says why it applies to your case and, where the engine settles it, how.',
      provenance:
        "Rule and decision wording is translated from the engine's English table. The code next to each item — IR-01, CDP-02 — is the reference that does not change between languages.",
      allClear:
        'No methodological obligation applies to these answers, and no critical decision point was surfaced. Next step: collect the inventory data.',
      ctaHint: 'The Data Collection File is calibrated on this configuration: it only asks for what your case needs.',
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
      ilcdSituation: 'ILCD situation',
      lccType: 'LCC type',
      slca: 'S-LCA',
      activatedNodes: 'Activated nodes',
      l1Blocks: 'L1 blocks fired',
      obligations: 'Obligations to document',
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
    empty: 'No scenarios result yet. In the questionnaire, define one or more alternative scenarios, then click "Run scenarios" on the result page.',
    description: 'Pipeline run for the baseline + {{n}} alternative scenario(s). Diffs highlighted vs baseline.',
    backToResult: 'Back to single result',
    columns: {
      scenario: 'Scenario',
      ilcd: 'ILCD',
      lccType: 'LCC type',
      slca: 'S-LCA',
      activated: 'Activated',
      blocks: 'L1 blocks',
      obligations: 'Obligations to document',
      cdps: 'L3 CDPs',
    },
    baselineLabel: 'Baseline',
    diffSuffix: '(diff)',
    overrideHelp: 'Each scenario inherits the answers of the baseline; populate `overrides` (JSON dict) per scenario to differ. Empty overrides → same case as baseline.',
    overridesPlaceholder: 'e.g. {"q1": "C"} or {"q3": {"env": true, "eco": true}}',
    overridesParseError: 'Overrides must be valid JSON for {{id}}',
  },

  reasoning: {
    activatedNodes: 'Activated nodes ({{count}})',
    pillarConfigs: 'Pillar configurations',
    noPillarValues: 'No pillar values written.',
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
      run: 'Work out the configuration',
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
      '13 fixtures from the validation sample (12 papers + Leiva Escombreras / Frövi). Loads the answers, flows included, into the questionnaire so you can inspect and run the engine end-to-end.',
    loadButton: 'Load preset',
    rationaleToggle: 'Why these answers? (compilation rationale)',
  },

  toast: {
    pipelineCompleted: 'Pipeline completed in {{ms}} ms — {{situation}}',
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
          "What this page tells you today: how the assessment is framed, which compliance signals the case declares, and how concentrated the key interactions are.",
        whenScoring:
          "Once the scoring arrives you will see the environmental figures and, where the study includes them, the societal costs — the two a public decision rests on.",
        scope: "How concentrated the key interactions are: {{scope}}",
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
    noVerdict: "No configuration derived yet for this case.",
    notAssessed: {
      environmental: 'This study does not assess environmental impacts: the environmental dimension was switched off when the case was set up.',
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
        'Regulatory and policy view: methodological configuration, peer-review status, public-superiority claims, EU PEF alignment.',
      'end-user':
        'Summary view for end users of the IS-derived products and services.',
    },
    verdictTitle: 'Methodological configuration',
    configTitle: 'What this study is set up to look at',
    labels: {
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
      pefC2: "EU PEF alignment (Q4=D): not applied, one company's accounts use allocation instead of the Circular Footprint Formula (ILCD Situation C2)",
      publicClaim: 'Public superiority claim (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Regional dashboard',
    title: 'Regional / sectoral dashboard',
    subtitle:
      'Breakdown of all saved cases by ILCD situation, LCC structure, sector and concentration of the key interactions. Intended for local authorities and policy analysts.',
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
      byLccType: 'By LCC structure',
      bySector: 'By sector (Q6a)',
      byScope: 'By concentration of the interactions (Q7)',
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
      "Calibrated on the derived configuration. Download the Excel companion to collect inventory data with the symbiosis partners, then return for the final report.",
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
      step3: 'Select a node or an arrow and fill its fields in the side panel. Only the fields your configuration needs are shown.',
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
      situation: 'ILCD situation',
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
