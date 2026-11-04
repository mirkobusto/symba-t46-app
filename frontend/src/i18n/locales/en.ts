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
    pageLoading: 'Loading…',
    add: 'Add',
    remove: 'Remove',
    cancel: 'Cancel',
    confirm: 'Continue',
    save: 'Save',
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
    lead: 'Send one of these URLs to a stakeholder. Same case, different framing for each audience — no login required to open. For a product label, share the End-user link.',
    close: 'Close',
    done: 'Done',
    copy: 'Copy',
    copied: 'Copied ✓',
    copyFailed: 'Could not copy — please copy the URL manually.',
    saveFirstTitle: 'Save the case first',
    saveFirstBody: 'Sharing needs the case saved on the server, and saving needs an account. Sign in, save the case with "Save as new…", then reopen this dialog.',
    audience: {
      industry: '🏭 Industry',
      community: '🌳 Community',
      authority: '🏛 Local authority',
      enduser: '👤 End user',
    },
    publicToggle: 'Make this report readable by anyone with the link',
    preparedByLabel: 'Prepared by (shown on the report)',
    contactLabel: 'Contact for questions about this case (optional)',
    saveSharing: 'Save name and contact',
    notSharedBody: 'The report is not public: only you can open this case. Turn sharing on to get the links.',
    sharedBody: 'The report is public: anyone with one of these links can read it, without the flow notes and quantities.',
    signInButton: 'Sign in to save and share',
  },

  reader: {
    tagline: 'Public report',
    // plain titles for the public views (decided by Fable, UX round 2026-11-03)
    verdict: {
      A: { title: 'A local exchange, assessed with average data', body: 'The exchange is small compared with the wider economy, so the study describes what it replaces with average market data (the national electricity mix, the average virgin material). This says nothing about how large its effects are on the plants or the area: those are what the study will measure.' },
      B: { title: 'A large-scale decision, assessed with the market changes it causes', body: 'The decision is big enough to change what the wider economy builds or shuts down, so the study models those changes instead of average data.' },
      C1: { title: 'An existing network, described as it runs', body: 'No decision is being taken: the study documents what the network already gives, compared with what each company would do without it.' },
      C2: { title: 'One company\'s own accounts', body: 'The study reports one company\'s share of the burdens, with no credit for what its exchanges save elsewhere.' },
    },
    labelLine: 'Did this link come from a product label? This page describes how the companies\' exchanges will be studied. It says nothing yet about the product you bought.',
    loading: 'Loading the report…',
    notFoundTitle: 'Report not found',
    notFoundBody: 'No report has this code. Check that you copied the whole link, or ask whoever sent it for it again.',
    tryAnother: 'Try another link or code',
    aboutLink: 'Learn about SYMBA',
    open: {
      eyebrow: "Shared report",
      title: "Open a report you received",
      lead: 'Paste the link someone sent you, or just the case code at its end (a code like agri-b-sita-1a2b3c4d).',
      label: "Link or case code",
      placeholder: "https://…/r/…",
      invalid: "That does not look like a report link. Paste the whole link you received, or the code after /r/.",
      submit: "Open the report",
      noLink: "No link? Ask whoever told you about the case. To find out what SYMBA is:",
    },
    eyebrow: 'Shared report · {{name}}',
    summaryTitle: "How the assessment will be done",
    scoringTitle: "Results",
    complianceTitle: 'Compliance signals',
    whatTitle: "What this page is",
    whatBody: "How this case of industrial symbiosis is to be assessed: which methodological choices apply and which data must be collected. It contains no results yet (no emissions, costs or social figures) and it is not a certification of any company or product. The figures are calculated separately by whoever carries out the study.",
    caseTitle: "The case",
    running: { yes: "These exchanges already take place.", no: "These exchanges are planned or just starting." },
    market: "Reference market: {{market}}",
    updated: "Saved on {{date}}",
    methodEyebrow: "How it will be assessed",
    sectorTag: "Sector: {{sector}}",
    scaleTag: "Interactions: {{scale}}",
    compliance: {
      peer: { name: "Independent peer review", desc: "A reviewer checks the study against ISO 14044, as for a scientific publication." },
      pef: { name: "EU Product Environmental Footprint (PEF)", desc: "The study follows the EU footprint method, including its Circular Footprint Formula.", descC2: "Not applicable: one company's accounts use allocation, not the Circular Footprint Formula (ILCD C2).", descB: 'Run as a sensitivity: Situation B is modelled consequentially.' },
      public: { name: 'Comparative assertion disclosed to the public', desc: "A public claim that a product is better than, or equivalent to, an alternative needs an ISO review panel." },
      dnsh: { name: "EU Taxonomy \"Do No Significant Harm\" (DNSH)", desc: "A separate screening for EU-taxonomy funding (art. 17); this tool does not perform it." },
      slcc: { name: 'Set up for a public decision (societal LCC)', yes: 'Yes: the costing includes the societal view a public policy or planning decision needs (taxes and subsidies corrected, environmental effects priced) — D4.2 §2.3.', no: 'No: the costing stays at company and value-chain level. If a public body is to decide on this case, ask the analyst to set the study up for a public objective.', c2: 'Not applicable: one company\'s own accounts are costed at company level only.', off: 'Not assessed: the study has no economic dimension.' },
      notPlanned: "not planned in this study",
      notAssessed: "not assessed by this tool",
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
        body: 'How the effects on the area and on the people near the plants will be studied: transport, local air, water and soil, what is spread on fields, whether residents are heard. There are no results yet.',
      },
      authority: {
        short: '🏛 Authority',
        name: 'Local authority',
        title: 'Regulatory and policy view',
        body: "How the assessment is framed: costs, shared assets, reference scenario, public claims, time horizon, social effects.",
      },
      enduser: {
        short: '👤 End user',
        name: 'End user',
        title: 'End-user summary',
        body: "What this case is about and what will be assessed. There are no results yet.",
      },
    },
    note: "Each tab shows the same case from a different point of view; the facts are the same in all four.",
    about: {
      isTitle: "What is industrial symbiosis?",
      isBody: "When one company's leftovers (whey, sawdust, heat, water) become another company's raw material instead of being thrown away.",
      eyebrow: 'About SYMBA T4.6',
      title: 'Public reports · at a glance',
      lead:
        'Someone shared a case with you.',
      whoTitle: 'Who\'s behind this?',
      whoBody: "SYMBA is a research project funded by the European Union (Horizon Europe, Grant Agreement 101135562) that develops open tools for industrial symbiosis in bio-based industry. This tool was developed by ENCO, with CIRCE and CET; it belongs to none of the companies whose cases it describes.",
      whatTitle: 'What is a "report"?',
      whatBody: "A shared report describes how one case of industrial symbiosis is to be assessed: which exchanges between companies it covers, and which method choices apply to its environmental, economic and social assessment. The four tabs tell the same case to four kinds of reader.",
      whereTitle: 'Where can I learn more?',
      whereBody: 'Visit the project website or read the deliverables at',
      enterTool: 'Enter the tool',
      backToReport: "Back to the report",
    },
    region: {
      eyebrow: 'Region · {{code}}',
      title: 'Regional dashboard',
      lead: 'Shared cases with at least one partner in {{code}}, from the country given to each company in the network editor. A case whose network is not drawn does not count.',
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
    preparedBy: 'Prepared by {{name}} — answers entered by the author of the case, not checked by SYMBA.',
    contact: 'For questions about this case: {{contact}}',
    noContact: 'For questions about this case, ask whoever sent you the link. SYMBA built the tool; it does not carry out this study.',
    whatYouCanDo: 'This study is still being set up. If you want residents to be heard (interviews, questionnaires), or if traffic, odours or what is spread on fields worry you, write to whoever prepared it: {{contact}}. Results, once loaded, appear on this same page at this same link.',
    whatYouCanDoTitle: 'What you can do',
    dataRequestTitle: 'If you are asked for data',
    dataRequest: 'Whoever carries out the study sends each company an Excel workbook, the Data Collection File: your rows are the flows your company gives or receives (quantities, transport, costs, the equipment involved). Fill it in and send it back to {{contact}}. Only whoever carries out the study creates and changes it; it is not filled in on this page.',
    dataRequestNoContact: 'Whoever carries out the study sends each company an Excel workbook, the Data Collection File: your rows are the flows your company gives or receives (quantities, transport, costs, the equipment involved). Fill it in and send it back to whoever sent it to you. Only whoever carries out the study creates and changes it; it is not filled in on this page.',
  },

  welcome: {
    title: "Welcome to SYMBA",
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
      explore: { name: 'Explore a region / sector', desc: "See how the saved cases are spread across methods and sectors." },
      browse: { name: 'Just look around', desc: 'No specific goal — I want to see what the tool does.' },
    },
  },

  adminShell: {
    menuOpen: "Menu",
    menuClose: "Close",
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
    intro: {
      what: { title: "What it does", body: "Tells you how the assessment of an industrial-symbiosis exchange has to be set up, following the SYMBA guidelines, and which data to collect from the companies involved." },
      not: { title: "What it does not do", body: "It does not compute the results: no emissions, costs or social figures. Whoever carries out the study calculates them with the data the tool asks for." },
      who: { title: "Who it is for", body: "Sustainability analysts and consultants set up their studies here; companies, public bodies and associations read the reports and see which data they will be asked for." },
    },
    title: "SYMBA — assessing industrial symbiosis",
    tagline: "How to set up the environmental, cost and social assessment of an exchange between companies, and which data to collect.",
    description: "Answer questions about your case: one company's waste, by-product, heat or water becoming another's input. You get the methodological configuration the study has to follow and a Data Collection File to send to the partners.",
    startButton: 'Start new assessment',
    modeLabel: "How you want to answer",
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
    presetsTitle: "Published examples",
    presetsMeta: "13 cases from peer-reviewed papers",
  },

  docxReport: {
    title: "Case report",
    intro: "Generated by the SYMBA tool. It records the answers, the configuration the tool derived from them and what the study has to document: the same content as the result page.",
    verdict: "Verdict",
    meaning: "What this configuration means",
    next: "What to do next",
    nextNone: "No methodological obligation applies to these answers and no critical decision point was surfaced. Next step: collect the data (see the Data Collection File).",
    whyHere: "Why it applies here:",
    toDocument: "What to document:",
    answers: "1. The answers",
    config: "2. The configuration derived by the tool",
    situation: "ILCD situation",
    lccType: "LCC type",
    slca: "Social assessment (S-LCA)",
    nodes: "Activated nodes",
    blocks: "Blocks",
    obligations: "Obligations to document",
    cdps: "Critical decision points",
    none: "(none)",
    notSet: "(not answered)",
    notes: "Notes on the answers",
    sectorRules: "Sector rules (D4.1 Part 2)",
    appliesBecause: "applies because of",
    flow: "flow",
    caseSector: "the case sector (Q6a)",
    pillars: "Engine output, key by key (English, as traced on the deliverables)",
    noPillars: "(no values written)",
    summary: "3. Summary",
    blocked: "Blocked: the answers trigger the blocks listed above; revise them.",
    complete: "Configuration complete: {{obligations}} obligations to document and {{cdps}} critical decision points to settle, listed above.",
    appendix: "4. Appendix: activated nodes",
    countsByPrefix: "Counts by prefix",
    scenarios: "Alternative scenarios defined",
    advanced: "Advanced settings",
    q: {
      q0: "Q0 kind of study",
      q1: "Q1 what you are analysing",
      q2: "Q2 the exchanges already take place",
      q2b: "Q2b long-standing network",
      q3: "Q3 dimensions",
      q4: "Q4 use of the results",
      q5: "Q5 who pays whom, per flow",
      q5extra: "Per flow: sellable to others / Part 2 sector",
      q6a: "Q6a sector",
      q6b: "Q6b technology maturity",
      q7: "Q7 concentration of the key interactions",
      q7b: "Q7b reference market",
      q8a: "Q8a operating year",
      q8b: "Q8b analysis period (years)",
      q8c: "Q8c asset lifetime (years)",
      q9: "Q9 decision and scale",
      q9b: "Q9b market screening documented",
      q10: "Q10 public objective",
      q11: "Q11 what the study compares",
      q12: "Q12 dedicated shared assets",
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
    whoTitle: "Who made it",
    whoBody: "The tool was developed by ENCO, with CIRCE and CET, as task T4.6 of SYMBA, a project funded by the European Union's Horizon Europe programme (Grant Agreement 101135562). It belongs to none of the companies whose cases it assesses.",
    sourcesTitle: "What it rests on",
    sourcesBody: "The questions, rules and data requests follow the methodological deliverables of SYMBA work package 4: D4.1 (life cycle assessment of industrial symbiosis, with its sector chapters), D4.2 (life cycle costing) and D4.3 (social life cycle assessment). Every row of the result names the section it comes from.",
    notTitle: "What it does not do",
    notBody: "It does not compute environmental, cost or social results (no kg CO2eq, no NPV, no social indicators): it says how the study has to be set up and which data to collect. The figures are calculated by whoever carries out the study, with dedicated LCA and costing software.",
    divergencesTitle: "Where it departs from the deliverables, on purpose",
    divergencesLead: "A few choices are the tool's own, stated here so that a reviewer can see them:",
    divergences: {
      c2: "One company's accounts (ILCD Situation C2) are costed at company level only: a choice of this tool, not a rule of D4.2.",
      situation: 'A study of an existing network that evaluates an option for it (an improvement, an expansion) is read as Situation A; one that only documents the network is Situation C1 (T4.6 reading of D4.1 Table 1 and §4.3.2).',
      uncertainty: 'The Pedigree matrix is written as mandatory when the results go to a review panel, to EU policy alignment or to a publication (Q4 = C, D or E) and as recommended otherwise, and it is switched on for both LCA and LCC when the exchanges do not take place yet (Q2 = B, rule CIR-02); Monte Carlo is asked for the LCA with its own conditions (Q4 = C, D or E, or technology below TRL 9) and always for the costing. D4.1 §13.3.2 and D4.2 §7.1, §10.3 ask both in every study.',
      policy: "EU policy alignment (Q4 = D) brings in CE Delft prices and net-tax-factor allocation, which D4.2 ties to the societal LCC.",
      assets: 'Q12 counts the assets built for the exchanges, now or years ago, even when only one company uses them (D4.1 §6.3.3: unique to the IS scenario), where D4.2 §4.2 speaks of new shared ones.',
      interdependent: 'For an interdependent flow (Q5 = d) D4.2 §6.2 names an allocation key in the E-LCC, while D4.1 §8.3.6 defaults to substitution; the tool asks the E-LCC to follow the LCA (D4.2 §6.3) and reports the difference.',
      lccB: 'In Situation B the LCA is consequential and the PEF Circular Footprint Formula, when asked (Q4 = D), runs as a sensitivity; no costing node has a consequential formulation yet, so the LCC follows its type (D4.2 §2.2 asks one paradigm per study).',
    },
    contactTitle: "Contact",
    contactBody: "For questions about the tool or the project, write through the contact page of the SYMBA website:",
    technicalTitle: "Technical details (for specialists)",
    title: 'About',
    p1:
      'SYMBA T4.6 helps whoever sets up a life-cycle sustainability assessment of an industrial symbiosis: it derives, from a questionnaire about the case, which methodology applies, which practices have to be documented, and which data to collect from the partners of the network. It does not compute the results — the figures are calculated outside the tool by whoever carries out the study, and can be loaded here; nobody calculates them automatically.',
    p2:
      'The questionnaire (Q0-Q12; Q9 sets the ILCD situation, Q10 the societal LCC) drives the activation of 186 Phase 1 nodes plus 40 cross-method validation rules (18 IR + 10 CIR + 5 FU + 7 B). Reporting-time L3 enforcement (IR-04 + IR-10) plus 11 Critical Decision Points surface cross-method tensions to the user.',
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
    introPlain: "Questions about your exchange between companies, in three parts. Those marked * are required; the others make the result more precise. Under each question you find a short explanation in plain words.",
    guidedBannerTitle: 'Guided mode active',
    guidedBannerBody:
      'Each question opens with a short explanation in plain words. The full methodological note, in the wording of the project deliverables, stays one click away under each question. The answers decide the methodological configuration and the data-collection plan you receive at the end.',
    runButton: 'Work out the configuration',
    runningButton: 'Working it out…',
    resetButton: 'Reset draft',
    confirmReset: 'Discard all answers and start over? This cannot be undone.',
    stepper: {
      progress: "Question {{n}} of {{total}} · {{part}}",
      back: "← Back",
      next: "Next →",
      showAll: "Show all the questions on one page",
      showSteps: "One question at a time",
      navLabel: "Questions",
      totalChanges: 'The number of questions changes with your answers.',
    },
    examplesLink: "Want to see how a real study answers? Load a published example",
    stillRequired: "Still to answer:",
    flowsMissingQ5: "who pays whom, for every flow",
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
        A: { label: 'A. Specific exchange', description: "A symbiotic exchange between two companies, studied on its own, existing or planned." },
        B: { label: 'B. Eco-park / network', description: "An eco-industrial park or multi-actor symbiotic network, or one company supplying two or more partners." },
        C: { label: 'C. Policy / programme', description: 'A policy or programme decision at regional or national scale.' },
        D: { label: 'D. Corporate report', description: "A single company's symbiotic contribution for ESG/CSRD reporting." },
        E: { label: 'E. Monitoring', description: 'Time-series monitoring of an already operational symbiosis.' },
      },
      plain:
        'Say what you are examining: one exchange, a park, a programme, one company, a symbiosis you follow over time. The answer describes the system and its boundary; how the study is modelled is decided by the questions that follow, starting with what the study is for. If you hesitate between two options, keep the one that describes the thing whose effects you want to measure. One company supplying two or more partners counts as a network (B).',
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
        label: "Has the network run for so long that the alternatives it replaced (e.g. the boilers the district heating would otherwise use) would no longer be built today?",
        yes: 'Yes — the reference is a modern counterfactual: the pre-symbiosis set-up is excluded (D4.1 §11.2.2)',
        no: 'No — the network is recent',
        unknown: 'I don\'t know — the pre-symbiosis set-up stays admissible if it is still what each firm would rationally do today',
      },
      plain:
        'Think of the exchanges, not of the plants. If the flows between the companies already happen, you can measure them. If they are still an idea, even between plants that already run, you can only estimate them. Want to compare alternatives, such as an expansion or a new technology? They are added as scenarios in expert mode, at the bottom of the questionnaire, whatever you answer here.',
    },

    q3: {
      title: 'Q3 — Which sustainability dimensions to include? *',
      help: 'At least one is required. Environmental and economic are the usual pairing.',
      details:
        'ENV — Environmental Life Cycle Assessment (LCA): impacts on climate, ecosystems, resource use. Almost always selected. ' +
        'ECO — economic dimension, assessed with Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) is a technique used inside the LCC, not an alternative to it; CBA and TEA are not offered by this tool. ' +
        'SOC — Social LCA. Selecting it adds the social rules (worker, local-community and value-chain stakeholder categories). ' +
        'Most published IS papers run ENV-only (e.g. Sokka, Daddi); a few couple ENV+ECO (Hashimoto, Wiktor); only a handful add SOC.',
      warning: 'Select at least one dimension to proceed.',
      env: 'Environmental (LCA)',
      eco: 'Economic (LCC)',
      soc: 'Social (S-LCA)',
      plain:
        "Three separate assessments, each with its own method and its own data: environmental, economic — costs over the whole life cycle, not a cost-benefit analysis — and social. Pick the ones you intend to deliver. Most published studies cover the environmental one alone, and adding the economic one is the usual next step; the social one needs a great deal more information from the people involved, so expect to go and collect it.",
    },

    q4: {
      title: "Q4 — How will you use and communicate the results?",
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
        B: { label: 'B. External (no comparison with other products)', description: 'External communication without comparative claims.' },
        C: {
          label: 'C. Comparative assertion disclosed to the public',
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
        "Add one row per main symbiotic flow and say who pays whom. Required when you analyse an exchange, a network or one company (Q1 = A, B or D); optional otherwise.",
      details:
        'For each main flow exchanged between actors (heat, CO₂, slag, wastewater, hydrogen…) pick who pays whom: ' +
        'a — A pays B to take the flow (a gate fee: negative market value, a WASTE for A, D4.1 §8.3.2). Zero-burden applies from the point where the residue first reaches non-negative value, not at the gate. Paying is not the same as unavoidable: D4.2 §6.2 also requires the causal avoidability test, declared per flow in the Data Collection File. ' +
        'b — flow exchanged for FREE (ambiguous status): the economic value test decides whether it is a waste or a co-product, with a sensitivity analysis. ' +
        'c — B pays A for the flow (positive market value: a CO-PRODUCT for A): substitution against the displaced virgin material, with a quality-corrected ratio. The PEF Circular Footprint Formula is not tied to Q5: it comes from Q4=D. If no third party would pay for the flow (Freedom-to-Act test, D4.1 §8.3.3), the price is administrative and the flow is modeled as waste. ' +
        'd — INTERDEPENDENT flow: A deliberately altered its process (quality, quantity, post-treatment) to supply B; a co-product whatever the price, never zero-burden. ' +
        'e — AGGREGATED / black-box: the source gives no per-flow detail (typical of aggregate IES papers like Sokka 2011). That is a limitation of the source, not a modeling choice: D4.1 §8.3.1 forbids one network-wide rule, so the Data Collection File still asks for the classification of every flow you can name. ' +
        'Q5 records who pays whom; the legal and economic tests (Freedom-to-Act, End-of-Waste, by-product class, avoidability, zero-burden point) are declared per flow in the Flow classification section of the Data Collection File. For policy-level Q1=C studies, Q5 is usually optional.',
      plain:
        'For each thing that moves between the companies — heat, water, slag, CO₂ — the question here is only who pays whom: the sender pays to be rid of it, nobody pays, or the receiver pays for it. If the sender deliberately changed its own process in order to supply it, pick that whatever the money says. For that partner, though: a dryer built to sell the flow to anyone is not interdependence — pick \'the receiver pays\' and declare the dryer under dedicated assets. If your source gives one figure for the whole network, pick the last option — but you will still be asked about every flow you can name, because one rule for the whole network is not allowed. Whether a flow counts as waste in law is settled later, in the data collection file, not here.',
    },

    q6a: {
      title: 'Q6a — Sector',
      help: 'The main sector of the case, as a description. The sector rules of D4.1 Part 2 follow the sector of each exchanged flow, declared in the flows table.',
      details:
        'The sector describes the case and opens a few sector-specific fields in the Data Collection File; the sector rules of D4.1 Part 2 follow the sector declared for each flow, because the chapters follow what is exchanged. Pick the closest match to the dominant sector of the case (the actor that contributes most mass/energy/value). ' +
        'Examples: Pulp & paper for Sokka 2011 (UPM Kymi); Cement / construction for Hashimoto 2010 (Kawasaki); Textile / leather for Daddi 2017 (tannery cluster); Wastewater / sludge / biofactories for Wiktor 2018; Chemicals / fertilizers for Leiva 2025 Escombreras; Bio-based polymers for Briassoulis. ' +
        'For mixed cases use Multi-sector.',
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
        other: "Other",
        wastewater_biofactories: 'Wastewater / sludge / biofactories (legacy)',
        agri_food: 'Agri-food / biorefineries (legacy)',
        process_industry: 'Process industry (legacy)',
      },
      plain:
        'The main sector of the case: the activity of the company that contributes most of the mass, energy or value. It describes the case; the sector rules of the guidelines follow what each flow is, which you declare in the flows table. If the case straddles several sectors, pick Multi-sector.',
    },

    q6b: {
      title: 'Q6b — Technology maturity (TRL)',
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
      help: 'It sets how the impact assessment is regionalised. Transport is modelled explicitly for every exchange whatever you answer; the break-even distance is asked for every flow in the Data Collection File. Partners in different regions or countries: C; B only if every site is in one region.',
      details:
        'D4.1 §12.2.3: a global or national average characterisation factor fails to capture the significance of a system whose key interactions are intensely local (e.g. a water-sharing synergy in an arid region). A — one site or adjacent plants: spatially specific factors for water scarcity, eutrophication and acidification, and the scale mismatch flagged where regional factors are applied at site level (§12.3.3). B — within one region: regionalised factors, e.g. the Seppälä / Posch country-dependent factors for a regional cluster (§12.3.3). C — across regions or borders: spatially explicit factors at the location of each emission. Transport never depends on this answer: every link is a distinct foreground unit process with primary data, and GIS or routing is recommended for every exchange (§12.3.1). The second part asks for the market the replaced products come from: background mixes and the reference scenario are resolved on it, national or sub-national as a rule, continental only for globally traded commodities with no sub-continental market (§11.3.1).',
      options: {
        A: { label: 'A. One site', description: 'One site or adjacent plants: the interactions are intensely local.' },
        B: { label: 'B. Regional', description: 'Several sites within one region.' },
        C: { label: 'C. Across regions', description: 'Sites across regions or borders.' },
      },
      market: {
        label: 'Reference market: where would the replaced products come from?',
        help: 'Where the companies would buy, without the exchanges, what the exchanges replace — not the market of the symbiosis products. Optional. Example: for a by-product used as feed, where the soy meal it replaces would come from.',
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
        'How close together the companies\' key interactions happen: on one site, within one region, or across regions or borders. It decides how locally the environmental impacts are assessed: water or air pollution next to one site counts differently from the same amount spread over a country. Transport is counted whatever you answer. Then say where the products the symbiosis replaces would otherwise come from: a country, a region or, for goods traded worldwide, a continent. Partners in different regions or countries: C; B only if every site is in one region.',
    },
    q8: {
      title: 'Q8 — Time horizon of the study',
      help: 'Optional. One horizon for LCA and LCC alike.',
      horizonWarning: 'Over {{threshold}} years: the study will have to take a view on how energy and markets change (future background for LCA and LCC).',
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
        'Over which years does the study look at the system? If it describes how things work today, a picture of the present is enough. If it is about a plant that will run in a later year, or it follows the system for decades, the result depends on how electricity, fuels and markets will change, and the tool asks you to take a view on that future: the same future for the environmental and the economic reading. If the plants last more than 15 years, the study has to consider how energy and markets will change over those years.',
    },
    q9: {
      title: "Q9 — Which decision does the study support, and how far do its consequences reach? *",
      help: 'Required. It sets the modelling situation (ILCD A, B, C1 or C2); Q1 only describes the subject.',
      details: "D4.1 Table 1 classifies the study by the decision it supports and the scale of its consequences, not by its subject (D4.1 §4.2.3). Micro (Situation A) is the default for decisions on single exchanges and plants. Structural (Situation B) applies when the decision changes the capacity installed in a market: the ILCD Handbook assumes it when the yearly demand or supply the decision adds to or withdraws from a market exceeds the capacity that market replaces every year, counting at most 5 % (e.g. 10 Mt of plants lasting 25 years replace 0.4 Mt a year). The design of a new park, a regional restructuring or a programme needs this screening (Mattila et al. 2012); without it the study stays A, with B as a sensitivity. Documenting an existing network, or a company report that counts what its exchanges save elsewhere, is Situation C1 (substitution, §7.2.3); a report of one company that excludes any credit for its exchanges is C2 (allocation, no credits, §7.2.3), costed at company level only (a T4.6 design choice).",
      examples: {
        micro: "For example: you want to know whether giving your sawdust to the pellet plant next door is worth it, to start, keep or change the exchange.",
        structural: "For example: a regional programme large enough to change how much the region's market produces. An analyst has to document the market check.",
        none: "For example: you want to describe what an existing network of exchanges delivers today, for a report, with nothing to decide.",
        corporate_report: "For example: your own company's sustainability report (CSRD, the EU directive on sustainability reporting): the benefits your exchanges bring to others are not counted.",
      },
      options: {
        micro: 'It explores or supports a choice, even a hypothetical one with no named decision-maker, and its effects stay within the plants involved (Situation A)',
        structural: "It supports a choice that changes how much a market or sector produces, beyond the capacity it replaces every year (Situation B; the screening must be documented)",
        none: "No choice: it documents what an existing network or system delivers, including what it saves elsewhere (Situation C1)",
        corporate_report: "Reporting of one company that excludes any credit for what its exchanges avoid elsewhere, e.g. strict ESG / CSRD accounting (Situation C2)",
      },
      screening: {
        label: 'Is it documented that the yearly quantity the decision adds to or withdraws from the affected market exceeds the capacity that market replaces every year (at most 5 %)? Left unanswered, it counts as no.',
        yes: 'Yes, it is documented (Situation B)',
        no: 'No (Situation A, with Situation B tested as a sensitivity)',
      },
      plain:
        "What is the study for? Most studies explore or back a choice whose effects stay inside the plants involved, even when nobody has to decide yet. Only when the change is bigger than what the market renews every year, and you can show it, does the study change kind; designing a new park needs that check. If you are only describing a network that already runs, or reporting one company's own figures without crediting its exchanges, say so: each case is modelled differently.",
    },
    q10: {
      title: 'Q10 — Does the study serve a public objective or a public decision-maker? *',
      help: 'Required when the economic dimension is on: it decides whether the societal LCC is added.',
      details: 'D4.2 §2.3 adds a societal LCC (net tax factor, monetised externalities, social discount rate) when the study serves a public policy or territorial planning objective, and §2.2 ties the choice of LCC type to the perspective of the decision-maker. Who decides: the body that commissions or will use the study. A public partner inside the network (a municipal district-heating company, a public treatment plant) does not by itself make the objective public: its public cost of capital enters at entity level (D4.2 §9.2) inside a company-level costing. Answer yes when that public body is the one deciding on the case, or when a public plan or policy will use the study. A municipality planning an eco-park or a utility sizing a district-heating link answers yes. Strict reporting of one company (Q9: corporate report, Situation C2) keeps the company-level costing (a T4.6 design choice), and the tool tells you.',
      options: {
        yes: 'Yes — a public policy or planning objective, or a public decision-maker (adds the societal LCC)',
        no: 'No — a private decision or a company\'s own account, even with a public body among the partners',
      },
      plain:
        'Answer yes if the study is meant to feed a public decision, or is commissioned by a public body: a municipality, a region, a public utility, a regulator, a plan. It then adds a second economic reading taken from the point of view of society: taxes counted differently, and effects nobody pays for in money. For a company\'s own account the economic reading stays at company level. Example: a steelworks commissions a study on selling heat to the municipal network — answer no; the municipality decides whether to connect — answer yes.',
    },

    q11: {
      title: "Q11 — What does the study compare?",
      help: "Optional. It sets the basis of the functional unit; unanswered, the function-oriented unit of D4.1 Part 1 applies.",
      details: "D4.1 Part 2 asks the functional unit to reflect the primary function of the system (§4.3, §6.3, §8.3): an input-based unit (e.g. treatment of 1 tonne of waste) when the study compares waste management routes or the performance of a plant or service; an output-based unit (e.g. 1 kg of product, 1 MJ of energy) when it compares products against market alternatives or supports a substitution claim; a system of functional units when both functions are co-primary (Part 1 §5.3.2). D4.2 §3.1 asks a dual unit (waste treated + output generated) for the LCC when product substitution drives the study: the two deliverables differ, and the tool follows Part 2 for the LCA and reports the difference.",
      options: {
        unset: 'I don\'t know / nothing is compared (the tool uses a unit built on the service delivered)',
        waste_treatment: "How a waste is managed — waste routes, plant or service performance (input-based unit)",
        product_substitution: "Products against market alternatives — what the recovered output replaces (output-based unit)",
        co_primary: "Both: the treatment service and the products matter equally (system of functional units)",
      },
      plain:
        "What is the comparison really about? If the question is how best to deal with a waste — burn it, digest it, compost it — the result is counted per tonne of waste treated. If the question is whether the recovered product is better than the one it replaces, it is counted per unit of product. If both matter equally, both are counted side by side.",
    },
    q12: {
      title: 'Q12 — Does the symbiosis use dedicated assets?',
      help: 'Optional, asked when LCA or LCC is on: pipelines, plants, storage or equipment built for the exchanges, now or years ago, whether one company or several use them.',
      details: 'D4.2 §4.2 asks whether the network requires new dedicated shared assets: if it does, their CAPEX and ongoing OPEX must be included in the cost breakdown and allocated among the partners that benefit from them. D4.1 §6.3.3 includes the capital goods and infrastructure unique to the IS scenario, amortised over each asset\'s technical lifetime (Q8). With both LCA and LCC on, a yes also switches on the rules that align capital goods between the two (IR-13, B-06); for parks and programmes with the social dimension, the S-LCA indicators for shared investment (CIR-08). One company can be the only benefiting partner.',
      options: {
        unset: 'Not answered',
        yes: 'Yes — something was built for the exchanges (a pipeline, a plant, a dryer, a tank), even if only one company uses it',
        no: 'No — the exchanges use only assets that would exist anyway',
      },
      plain:
        'Answer yes if something was built, or has to be built, for the exchanges to happen: a pipeline, a treatment plant, a storage tank, a dryer, even one built years ago. Its cost and its footprint are then counted in the study and charged to whoever benefits from it: all to one company if only it uses it, shared if several do.',
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
    scopeNotePlain: 'The tool does not do the calculations: it tells you how the study has to be done and which data to collect. An analyst does the calculations afterwards.',
  },

  flows: {
    // guided-mode wording of the flows table (UX round 2026-11-03)
    plainHeaders: {
      q5: 'Who pays whom',
      sector: 'Sector of what is exchanged (optional)',
      configuration: 'Type of reuse (optional)',
    },
    plainOptions: {
      a: 'Whoever gives it pays the receiver to take it away (a waste for the giver)',
      b: 'Nobody pays, or it is not clear yet',
      c: 'The receiver pays whoever gives it (a product for the giver)',
      d: 'The two plants depend on each other (one was changed to supply the other)',
      e: 'Only one total figure for the whole network',
    },
    q5Note: 'Answer with the arrangement as it stands today — agreed, or intended if the exchange is not running yet. It is a starting assumption, not a finding: if the study changes who pays whom, come back and change it. Pick “Nobody pays, or it is not clear yet” when it is genuinely undecided rather than forcing a direction.',
    emptyHint: 'No flows yet. Add at least one to characterise per-flow Q5.',
    headers: { id: 'ID', name: 'Name', q5: "Who pays whom (Q5)", sellable: 'Sellable to others?', sector: 'Sector (Part 2)', configuration: "Configuration (Part 2)" },
    q5Unset: "— choose who pays whom",
    sellable: { unset: '— not answered', yes: 'Yes', no: 'No' },
    sellableHint: "If the partner did not take this flow, could the generator sell it to someone else at a positive price? Yes makes it a co-product. No does not make it a waste by itself: a single taker that pays what an independent buyer would pay (the price of the product the flow replaces, net of its extra costs to use it) still makes it a co-product; a free flow, or a payment that only shares costs, makes it a waste (D4.1 §8.3.3). Optional: the result notes when it disagrees with Q5.",
    sectorHint: 'Pick the D4.1 Part 2 chapter of what is exchanged, not of the company: agricultural and agro-industrial residues → Agri-food (§4); municipal or mixed waste, biowaste included (organic fraction of MSW, household food waste) → Waste valorisation (§8); sludge and treated wastewater, also when reused as water → Wastewater (§6); a product or energy carrier made from a flow (biomethane, digestate, electricity) → the chapter of that flow. Where §4 and §8 overlap on biowaste, the origin decides (T4.6 reading of Part 2 §3.3). Optional: the result lists the rules of the chapter. D4.1 Part 2 has chapters only for these bio-based sectors: for steel, cement, heat, pulp and paper or chemicals pick "— none of these", and only Part 1 applies. Wood and forest residues (sawdust, bark, lignin, black liquor) have no Part 2 chapter: pick "— none of these".',
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
      a: "a — the supplier (A) pays the receiver (B): waste",
      b: 'b — Free (ambiguous)',
      c: "c — the receiver (B) pays the supplier (A): co-product",
      d: 'd — Interdependent',
      e: 'e — Aggregated / black-box',
    },
    plainEmpty: 'No exchanges yet. Add each thing that moves between the companies (whey, sawdust, heat, water…).',
    plainSectorHint: 'Optional. Pick a sector only if what is exchanged belongs to one of the listed bio-based sectors (agri-food, plastics, wastewater, textiles, waste). For wood, sawdust, forest or paper-mill residues, steel, cement or heat, leave “— none of these”. If you are not sure, leave it: the analyst can set it.',
  },

  scenarios: {
    intro: 'A scenario changes a few answers of the questionnaire, and the engine runs it next to the case: the result page then shows what the change does to the configuration and to the obligations. It cannot change where a single flow goes, how far or at what price: the network editor holds one network per case, so note such an alternative in the scenario assumptions of the flow in the Data Collection File (asked when the exchanges do not run yet or a scenario is defined); the tool does not compare networks yet.',
    emptyHint: 'No alternative scenarios yet.',
    headers: { id: 'ID', label: 'Label' },
    labelPlaceholder: 'e.g. Future expansion / TRL9 ramp-up',
    addButton: 'Add scenario',
    removeAria: 'Remove {{id}}',
    addChange: "Add a change",
    pickQuestion: "Question",
    newAnswer: "New answer",
    flowQ5Title: 'Who pays whom, per flow',
    removeChange: "Remove this change",
    noChanges: "No change yet: the scenario is the same as the case.",
    jsonToggle: "Edit as JSON (experts)",
    otherKeys_one: "{{count}} other change set as JSON",
    otherKeys_other: "{{count}} other changes set as JSON",
    changesCount_one: "{{count}} change",
    changesCount_other: "{{count}} changes",
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
    // guided mode: notes in plain words (UX round 4)
    engineNotesPlain: {
      flow_freedom_to_act_settles: {
        co_product: 'Flow \'{{flow}}\': you said nobody pays (or it is not clear yet), but that someone else would buy it: then it is not a waste. That is fine; the analyst decides how to count it.',
        waste: 'Flow \'{{flow}}\': you said nobody pays and nobody else would buy it: it may count as a waste, with no burden from your side. The analyst checks it.',
      },
    },
    // guided mode: what the result means for a non-analyst (UX round 2026-11-03)
    guided: {
      title: 'What this means for you',
      lead: 'The tool has worked out how the study of your case has to be set up and which data it needs. It does not calculate whether the exchange pays off or helps the environment: an analyst or a consultant does that, with the data you collect.',
      step1: 'Save the case so you can find it again. It needs a free account; without one, the case stays only in this browser.',
      step2: 'Open the Data Collection File, draw the companies and the exchanges, then download the Excel: your staff fill in the sheets on the actors, the flows, logistics and costs.',
      step3: 'Give the file and the report to whoever will carry out the study (an analyst, a consultant, a university): the technical points further down are for them.',
      analystTitle: 'Points for the analyst ({{count}})',
      step1Saved: '✓ Saved as «{{name}}»: you find it in My cases.',
      step1SignedIn: 'Save the case so you can find it again in My cases.',
    },
    // a study with no LCA is headed by its costing (decided by Fable, UX round 2026-11-03)
    lccTitle: {
      'C+N': 'Conventional LCC per partner, consolidated at network level',
      'C+N+S': 'Conventional LCC per partner and network, plus societal LCC',
      'C-LCC': 'Conventional LCC of one company',
      'C+E': 'Conventional and environmental LCC',
      'C+E+S': 'Conventional, environmental and societal LCC',
    },
    lccBadge: {
      'C+E': 'C-LCC + E-LCC',
      'C+E+S': 'C-LCC + E-LCC + S-LCC',
      'C+N': 'C-LCC per partner + network',
      'C+N+S': 'C-LCC per partner + network + S-LCC',
      'C-LCC': 'C-LCC',
    },
    situationBadge: {
      A: 'ILCD Situation A',
      B: 'ILCD Situation B',
      C1: 'ILCD Situation C1',
      C2: 'ILCD Situation C2',
    },
    verdictWhy: "Why: you answered “{{answer}}” (Q9)",
    verdictWhyQ1: "Why: Q9 is not answered, so the situation is read off what you are analysing (Q1)",
    config: {
      title: 'Your configuration',
      lead: 'What your answers decided, in the terms of the deliverables. Open a row to read the engine\'s text, in English, with the section it comes from.',
      nodeText: 'Engine text (English)',
      labels: {
        flows: "Treatment of each flow",
        claim: 'Comparative assertion',
        purpose: 'Kind of study',
        lcc: 'Costing',
        slca: 'Social assessment',
        horizon: 'Study horizon',
        prospective: 'Prospective data',
        reference: 'Reference scenario',
        fu: 'Functional unit',
        regional: 'Local impacts',
        sectors: 'Sector rules',
        shared: 'Dedicated assets',
        sharedLca: 'Their production and end of life inventoried in the LCA and amortised over each asset\'s technical lifetime (D4.1 §6.3.3)',
        claimPublic: 'Comparisons',
        multifunctionality: 'Multifunctionality',
        flowsLcc: 'Cost of each flow',
        fuLcc: 'Functional equivalent',
        communityRegional: 'Effects near the plants',
        transport: 'Transport',
        fieldSpreading: 'What is spread on fields',
        notCovered: 'Not covered',
      },
      values: {
        community: {
          slcaOn: 'Yes: social effects are assessed group by group — workers, the local community, consumers. Which groups are interviewed is decided by whoever carries out the study (D4.3 §5.1, §6.2).',
          slcaOff: 'No: social effects are not assessed. If residents want to be heard, ask the contact on this page to add them.',
          regional: 'Local air, water and soil effects (fine particles, acidification, excess nutrients, water use) are assessed with data for {{where}}, not world averages (D4.1 §13.3.3).',
          where_A: 'this site',
          where_B: 'your region or country',
          where_C: 'the territory of each emission',
          where_unset: 'the country',
          transport: 'Every exchange is studied with its own transport: lorries or pipelines, real routes and distances, loads and empty return trips, and the distance beyond which trucking cancels the benefit (D4.1 §13.3.1).',
          transportLcc: 'The cost of transporting every exchange, and the distance beyond which it no longer pays (D4.2 §4.3).',
          fieldSpreading: 'The study counts what happens when digestate, compost or recovered fertiliser is spread on fields: ammonia to the air, nitrates to water (D4.1 Part 2 §4.3.3, §6.3.3).',
          notCovered: 'Odour and noise are not impact categories of these guidelines (D4.1 Part 2 §9.3 lists them among the effects usually left out); local air, water and toxicity are. Any local effect the study leaves out must be declared as a known blind spot (D4.1 §12.3.5).',
        },
        flowCost: {
          a: 'waste: the gate fee as negotiated; zero cost only if the residual is unavoidable (D4.2 §6.3)',
          b: 'free: zero transfer price; zero cost only if unavoidable, otherwise a co-product',
          c: 'co-product: the negotiated price',
          d: 'interdependent: a determining co-product at the negotiated transfer price; zero cost does not apply (D4.1 §8.3.6 Step 2)',
          e: 'aggregated: price each flow that can be named',
        },
        noChapter: "No chapter of D4.1 Part 2 covers the declared flows: only Part 1 applies",
        flowTreatment: {
          waste: 'waste: zero burden from the point where the residue first reaches non-negative value, after the avoidability test (D4.1 §8.3.6 Step 4)',
          evt: 'undecided: economic value test with a sensitivity analysis (D4.1 §8.3.2)',
          coproduct: 'co-product: no zero burden; substitution of the product it replaces with the quality factor Q (D4.1 §8.3.6 Step 3)',
          integrated: 'interdependent: a determining co-product, never zero burden; one expanded multifunctional system (D4.1 §8.3.6 Step 2); the E-LCC follows the same partition, valuing the flow at the market price of what it replaces; the C-LCC uses the negotiated transfer price',
          integratedLca: 'interdependent: a determining co-product, never zero burden; one expanded multifunctional system (D4.1 §8.3.6 Step 2)',
          allocation: 'allocation: no zero burden and no substitution credits, one company\'s accounts (D4.1 §7.2.3)',
          aggregated: 'aggregated: classify each flow that can be named, no network-wide rule (D4.1 §8.3.1)',
        },
        claim: 'Comparative assertion disclosed to the public (superiority or equivalence): critical review by a panel of at least three independent experts, no weighting',
        claimNone: 'No comparative assertion disclosed to the public',
        claimPolicy: 'No comparative assertion disclosed to the public; EU policy alignment (Q4 = D): independent panel review, a T4.6 choice',
        claimPublic: { none: 'This study is not meant to say that one product is better than, or as good as, another.', claim: 'The study will support a public claim that this exchange is better than, or as good as, an alternative; independent experts must review it first.', policy: 'The study follows the EU footprint method; it makes no claim that one product is better than another.' },
        scope_continental: 'continental',
        scope_sub_national: 'sub-national',
        scope_national: 'national',
        slcaOff: 'Not included',
        reference_c2: 'Not used for credits: allocation, no substitution',
        horizonFuture: 'Future background: electricity, fuels and materials as expected in the years ahead (SSP/RCP climate-economic scenarios)',
        prospectiveScaleUp: 'Lab or pilot data scaled up to industrial scale, not linearly',
        prospectivePedigree: 'Data quality of every entry scored on the five Pedigree indicators',
        horizonPresent: 'Present-day background',
        reference_hnsrs: 'What each firm would do today without the links (Hypothetical Non-Symbiotic Reference Scenario, HNSRS)',
        reference_modern: 'A modern counterfactual: what each firm would do today without the links (Hypothetical Non-Symbiotic Reference Scenario, HNSRS)',
        reference_cnsrs: 'Business as usual without the symbiosis, over the study\'s time horizon (Current Non-Symbiotic Reference Scenario, CNSRS)',
        market: 'market: {{market}}',
        fu_waste_treatment: 'Input-based: the treatment of the waste',
        fu_product_substitution: 'Output-based: the products and what they replace',
        fu_co_primary: 'A system of functional units: treatment and products together',
        fu_function: 'Function-oriented, around the service delivered',
        regional_A: 'Site-specific characterisation factors for water, eutrophication and acidification',
        regional_B: 'Regional or country-dependent characterisation factors',
        regional_C: 'Country- or region-dependent factors for the territory of each emission',
        regional_unset: 'Site-specific factors where the key interactions are intensely local',
        shared: 'Their CAPEX and OPEX in the cost breakdown, charged to the partners that benefit from them (all to one company when only it uses them)',
        multiSubstitution: 'Substitution (system expansion) against the average market mix, with the quality factor Q',
        multiConsequential: 'Consequential: substitution against the marginal technology',
        multiAllocation: 'Allocation: no substitution credits',
        multiPefSubstitution: ' — partitioned with the PEF Circular Footprint Formula (Q4 = D)',
        multiPefConsequential: ' — PEF CFF as a sensitivity (Q4 = D)',
        multiPefAllocation: ' — the CFF is not applied',
        fuLcc_waste_treatment: 'Input-based: the treatment of the waste (D4.2 §3.1)',
        fuLcc_dual: 'Dual: the waste treated and the output generated, each with its avoided costs and revenues (D4.2 §3.1)',
        fuLcc_function: 'The portfolio of functions the network delivers, each with its avoided costs and revenues (D4.2 §3.1)',
      },
      why: {
        noChapter: "Part 2 covers five bio-based sectors; no flow is declared in one of them",
        flows: "who pays whom for each flow (Q5)",
        horizonUnanswered: "no operating year, analysis period, asset lifetime or technology maturity given, so the present is assumed; if the plants will run beyond {{threshold}} years, answer Q8",
        lccNoPolicyNoLca: "no public objective (Q10): each partner's costs, consolidated for the network",
        slcaOff: 'the social dimension is not selected (Q3)',
        claim: 'the results will support a comparative assertion disclosed to the public, of superiority or equivalence (Q4 = C)',
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
        horizonPresent: 'present year, technology at TRL 7 or above and a horizon within {{threshold}} years',
        referenceNotYet: 'the exchanges do not take place yet (Q2)',
        referenceRunning: 'the exchanges already take place (Q2)',
        referenceLongStanding: 'the network has run for many years (Q2)',
        fuGoal: 'the study compares: {{goal}}',
        fuDefault: 'what the study compares is not answered (Q11)',
        regionalUnset: 'the concentration of the interactions is not answered (Q7)',
        sectors: 'the chapters follow the sector declared on each flow',
        shared: 'the symbiosis uses dedicated assets (Q12)',
        multifunctionality: 'the ILCD situation (Q9)',
        horizonLifetimeOnly: 'the assets last {{years}} years, more than {{threshold}}: the background is projected over their amortisation even though the study describes the present year (D4.2 §9.3; the threshold can be changed in the advanced settings)',
        referenceNoLca: 'the costing uses the reference scenario an LCA in ILCD Situation {{situation}} would use (D4.2 §4.1); the situation prescribes no costing model',
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
      structural_without_screening: "Q9 says the effects are structural, but the market screening is not documented: the study is treated as ILCD Situation A, and Situation B must be tested as a sensitivity (ILCD Handbook 2010, §5.3).",
      structural_screening_missing: 'Q9 says the effects are structural, but whether the market screening is documented is not answered: the study is treated as ILCD Situation A, with Situation B as a sensitivity, until the screening is documented (D4.1 §4.3.4; ILCD Handbook 2010, §5.3). Answer the follow-up to Q9 once it is.',
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
      flow_price_without_market: "Flow '{{flow}}': Q5 says the recipient pays for it (co-product), but no third party would. With a single taker the price decides (D4.1 §8.3.3): the flow is a co-product if the recipient pays what an independent buyer would pay, the price of the product the flow replaces net of its extra costs to use it; if the payment only shares costs, the flow is a waste, with zero burden from where it first reaches a non-negative value (§8.3.6 Step 4). Check the price against that benchmark.",
      flow_freedom_to_act_settles: {
        co_product: "Flow '{{flow}}': Q5 leaves who pays whom open, and the Freedom-to-Act answer (D4.1 §8.3.3) points to a co-product (§8.3.2, burden shared). The configuration keeps the economic value test with a sensitivity analysis until the study confirms it: do not change who pays whom; record this reading in the flow classification of the Data Collection File (Freedom-to-Act and the step of the decision tree), which the study documents.",
        waste: "Flow '{{flow}}': Q5 leaves who pays whom open, and the Freedom-to-Act answer (D4.1 §8.3.3) points to a waste (zero burden from where it first reaches a non-negative value, §8.3.6 Step 4). The configuration keeps the economic value test with a sensitivity analysis until the study confirms it: do not change who pays whom; record this reading in the flow classification of the Data Collection File (Freedom-to-Act and the step of the decision tree), which the study documents.",
      },
      running_but_future: "Q2 says the exchanges already take place, but Q8 places operation in a future year or Q6b puts the key technology below TRL 7. A running exchange is measured today: check Q2, Q8 and Q6b. Meanwhile the reference scenario and the timing of the costing follow Q2, the future background follows Q8 and Q6b.",
      design_without_screening: "The study designs, expands or restructures a network and is modelled as Situation A. D4.1 §4.2.3: such studies need the ILCD market screening (Mattila et al. 2012); without it the study stays A, with Situation B as a sensitivity analysis. Document the screening, or run B as a sensitivity.",
      flow_part2_chapter: "Flow '{{flow}}': the sector rules of D4.1 Part 2 {{chapter}} apply to it; they are listed under Sector rules.",
      case_sector_without_flow: "The case sector belongs to D4.1 Part 2 {{chapter}}, but no flow declares that chapter, so its sector rules are not listed. The chapters follow what is exchanged: declare the Part 2 sector of each flow in the flows table.",
      flow_configuration_unknown: "Flow '{{flow}}': configuration '{{configuration}}' is not one of D4.1 Part 2.",
      flow_configuration_other_chapter: "Flow '{{flow}}': its configuration belongs to {{chapter}}, not to the declared {{declared}}; the rules of both chapters are listed.",
      b_consequential_over_pef: 'Situation B asks for consequential modelling against the marginal technology (D4.1 Table 1), while EU policy alignment (Q4 = D) asks for the PEF Circular Footprint Formula, an attributional partition. The consequential model governs; run the CFF as a sensitivity and declare both in the methodological charter (D4.1 §7.3.3; D4.2 §2.2).',
      b_lcc_not_consequential: 'Situation B: the LCA substitutes the marginal technology (D4.1 Table 1), while the environmental LCC values displaced products at the average market price of what they replace (D4.2 §6.2): this tool has no consequential costing formulation. D4.2 §2.2 asks one paradigm, identical between LCA and LCC: declare the difference in the methodological charter as a methodological deviation, and price the displaced products at the marginal supplier\'s price in a sensitivity.',
      flow_interdependent_but_marketable: 'Flow \'{{flow}}\': Q5 says the sender changed its process for this partner, and the flow would also sell to others. Both can be true for a determining co-product (D4.1 §8.3.6 Step 2). Check which it is: if the change was made to meet this partner\'s specification, keep d; if it was made to reach any buyer (a dryer that turns the pulp into a tradable feed), the flow is a dependent co-product (Q5 = c, substitution with the quality factor Q) and the equipment is a dedicated asset (Q12). A note never changes Q5.',
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
      obligations: "{{count}} obligations to document ({{groups}}), triggered by your answers. The Data Collection File lists them, with what triggered each one, together with the practices the method asks of every study like yours.",
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
      noTensions:
        "No critical decision point between the methods was surfaced for these answers. The obligations below still apply.",
      allClear:
        'No methodological obligation applies to these answers, and no critical decision point was surfaced. Next step: open the Data Collection File.',
      ctaHint: 'The Data Collection File is calibrated on this configuration: it only asks for what your case needs.',
      glossary: 'Three kinds of item, named the same everywhere: obligations are practices your answers switch on; standard practices are asked of every study and listed in the Data Collection File; decision points are tensions between the methods, each with the convention the tool proposes.',
    },
    actionKind: {
      block: 'Blocking',
      obligation: 'To document',
      decision: 'To decide',
      decisionResolved: 'Convention proposed by the tool — confirm it or justify another choice',
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
    title: 'Your result',
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
    saveHint: 'To keep the case on the server you need a free account; without one it stays only in this browser.',
    scenariosBox: 'Alternative scenarios defined: {{count}}. Compare them with the case:',
  },

  scenariosResult: {
    title: 'Scenario comparison',
    flowQ5Row: 'Who pays whom: {{flow}}',
    empty: 'No scenarios result yet. In the questionnaire, define one or more alternative scenarios, then click "Run scenarios" on the result page.',
    description: "The case and {{n}} alternative scenario(s), each run through the engine. Cells that differ from the case are highlighted.",
    backToResult: 'Back to single result',
    columns: {
      scenario: 'Scenario',
      ilcd: 'ILCD',
      lccType: 'LCC type',
      slca: 'S-LCA',
      activated: "Methodological nodes",
      blocks: "Blocks",
      obligations: 'Obligations to document',
      cdps: "Decision points",
    },
    baselineLabel: "The case",
    diffSuffix: '(diff)',
    overridesPlaceholder: "e.g. {\"q2\": \"B\"} or {\"q3\": {\"env\": true, \"eco\": true}}",
    overridesParseError: 'Overrides must be valid JSON for {{id}}',
    overridesNotAllowed: 'A scenario changes answers of the questionnaire only (the ones listed under "Question"): the flows and what the engine writes cannot be changed here. To describe a flow going elsewhere, note it in the scenario assumptions of that flow in the Data Collection File.',
    failed: 'This scenario could not be run, so there is nothing to compare: {{detail}}',
    whatChanges: "what changes compared with the case",
    noChange: "Nothing changes in the configuration or in the obligations.",
    addedRules: "Obligations added",
    removedRules: "Obligations removed",
    description_one: 'The case and {{count}} alternative scenario, each run through the engine. Cells that differ from the case are highlighted.',
    description_other: 'The case and {{count}} alternative scenarios, each run through the engine. Cells that differ from the case are highlighted.',
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
    title: "Load a published example",
    help: "Loads the answers of a published case into the questionnaire, so you can see what the tool derives from a real study.",
    loadButton: 'Load preset',
    rationaleToggle: 'Why these answers? (compilation rationale)',
    replaceConfirm: "Loading this example replaces the answers you are working on. Save your case first if you want to keep it. Load the example?",
    loaded: "Example loaded: {{name}}",
  },

  toast: {
    pipelineCompleted: "Configuration ready",
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
      'An account is needed to save cases on the server and to share them. A saved case is read only by people who have its link, and only after you share it.',
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
      invalidEmail: 'This email address is not valid: check the part after the @ (e.g. name@company.com).',
      invalidInput: 'Check the email and the password (at least 8 characters).',
    },
    roles: {
      admin: 'administrator',
      analyst: 'account',
    },
  },

  scoringPending: {
    title: "No results yet",
    body:
      "This tool does not calculate the environmental, cost or social figures. Whoever carries out the study calculates them; if they are added to this case, they appear here.",
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
          'This tool does not calculate the figures, and nobody calculates them automatically for your case. If an analyst carries out the study with the Data Collection File, their results can be loaded here: environmental and economic indicators, to judge whether the exchange pays off.',
      },
      community: {
        whatYouSee:
          "What this page tells you today: which flows the companies exchange, and whether this study examines social effects at all.",
        whenScoring:
          'This tool does not calculate the figures, and nobody calculates them automatically for your case. If an analyst carries out the study with the Data Collection File, their results can be loaded here: social indicators — workers, local community — and environmental ones, each with the group it concerns.',
      },
      authority: {
        whatYouSee:
          "What this page tells you today: how the assessment is framed, which compliance signals the case declares, and how concentrated the key interactions are.",
        whenScoring:
          'This tool does not calculate the figures, and nobody calculates them automatically for your case. If an analyst carries out the study with the Data Collection File, their results can be loaded here: the environmental figures and, where the study includes them, the societal costs.',
        scope: "How concentrated the key interactions are: {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "What this page tells you today: which materials this symbiosis puts back into use, and whether environmental and social effects are examined.",
        whenScoring:
          'This tool does not calculate the figures, and nobody calculates them automatically for your case. If an analyst carries out the study with the Data Collection File, their results can be loaded here: the environmental and social indicators of the chain behind the product.',
        productCaveat:
          "This assessment describes the exchange between the companies, not the final product you buy: the tool does not ask what the product is.",
      },
    },
    noVerdict: "No case is open. Answer the questionnaire or load a saved case to see this view.",
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
        'Full technical view of the methodological configuration. The figures (emissions, costs) are not produced here: whoever carries out the study calculates them from the Data Collection File, and they can be loaded into this case.',
      community:
        'How the effects on the area and on the people near the plants will be studied: transport, local air, water and soil, what is spread on fields, whether residents are heard. There are no results yet.',
      authority:
        'How the assessment is framed: costs, shared assets, reference scenario, public claims, time horizon, social effects.',
      'end-user':
        'What this case is about and what will be assessed. There are no results yet.',
    },
    verdictTitle: 'Methodological configuration',
    configTitle: 'What this study is set up to look at',
    labels: {
      ilcd: 'ILCD Situation',
      lcc: 'LCC type',
      slca: 'S-LCA activation',
    },
    scoringTitle: 'Results',
    scoringPendingTitle: 'No results yet',
    scoringPendingBody:
      'This tool does not calculate the environmental, cost or social figures. Whoever carries out the study calculates them; if they are added to this case, they appear here.',
    scoringEmpty: 'No indicators relevant for this stakeholder.',
    indicatorPending: 'pending',
    engineDetailsTitle: 'What the analyst will document for you',
    obligations_one: "{{count}} obligation to document",
    obligations_other: "{{count}} obligations to document",
    cdpFlagsCount_one: '{{count}} decision point the analyst must settle',
    cdpFlagsCount_other: '{{count}} decision points the analyst must settle',
    complianceTitle: 'Compliance signals',
    compliance: {
      peerReview: 'Independent peer review: {{status}}',
      pef: 'EU PEF alignment (Q4=D): {{status}}',
      pefC2: "EU PEF alignment (Q4=D): not applied, one company's accounts use allocation instead of the Circular Footprint Formula (ILCD Situation C2)",
      publicClaim: 'Comparative assertion disclosed to the public (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Regional dashboard',
    title: 'Regional / sectoral dashboard',
    subtitle:
      'How many cases saved in this tool fall in each situation, costing type, sector and concentration of the interactions. All saved cases, from any region: a filter by region is not available yet.',
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
      byLccType: 'By costing type',
      bySector: 'By sector',
      byScope: 'By concentration of the interactions',
      byIlcd: 'By ILCD situation',
    },
    mostCommon: 'Most common',
    noneKey: 'not answered',
    noCosting: 'no costing',
  },

  obligations: {
    empty: "Nothing to document for this case.",
    lead:
      "{{total}} items to document for this case: the {{rules}} obligations triggered by your answers (the ones counted on the result page) and {{mandates}} practices the method asks of every study like this one. Each one is a commitment to document in the LCSA report.",
    because: "Applies because:",
    notApplicable: "Does not apply here: {{fields}} — that method is switched off in Q3.",
    origin: {
      mandate: 'Required by the method',
      rule: 'Required between the methods',
    },
  },
  dcf: {
    viewer: {
      notActive: "This section is not active for this case.",
      nodeId: "Code",
      method: "Method",
      statement: "Statement (deliverable text, English)",
      seeAbove: "See the diagram above.",
      fieldsCount_one: "({{count}} field)",
      fieldsCount_other: "({{count}} fields)",
      colField: "Datum",
      colRequired: "Required",
      colValues: "Possible values",
      colWhy: "Why it is asked",
      always: "always",
      whoCompanies: 'Filled in by the companies\' staff',
      whoAnalyst: 'Decided by the analyst who carries out the study',
      whoBoth: 'Answered by the companies, decided by the analyst who carries out the study',
      forAnalyst: 'for the analyst',
    },
    diagram: { whoGives: "Who gives it?\n({{flow}})", whoReceives: "Who receives it?\n({{flow}})" },
    noCase: { title: 'No case yet', desc: 'The Data Collection File is built from your assessment: answer the questionnaire first (or open a saved case), then come back here.', cta: 'Open questionnaire', received: 'Did you receive the workbook from an analyst? Then there is nothing to do here: fill in the Excel file and send it back to them.' },
    derivedField: "engine-filled",
    obligationsTitle: "Methodological choices to document",
    navLink: 'Data Collection',
    title: 'Data Collection File',
    subtitle:
      'Calibrated on the derived configuration. Download the Excel to collect, with the partners, the data on the exchanges and on each actor\'s reference; the process inventory of each plant is collected separately.',
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
      'The Data Collection File describes the exchanges, not the processes: fill the empty rows offline (or distribute them to the partners) and return the file to the analyst leading the study, who collects the plant inventories with the LCA and costing software.',
    openButton: 'Open Data Collection File',
    tabOverview: 'Overview',
    tabNetworkBuilder: 'Network builder',
    socialDeferred: 'Social inventory is not collected in this file: it follows D4.3 with its own instruments (questionnaires, interviews per stakeholder group).',
    guidedIntro: 'Here you see the questions the Excel file will ask the companies. You do not have to fill them in now: download the file and pass it on.',
    unsavedCase: 'The files do not contain the network you drew yet: save the case (an account is needed) to include it.',
    unsavedNetwork: 'The network has unsaved changes: save the network to include them in the files.',
    filesNote: 'Excel: the workbook the companies fill in (open it with Excel or LibreOffice, better on a computer). Word: the companion document that explains it.',
    savedDiverged: 'These files follow the saved version of the case. Save your changes on the result page to download files that match this page.',
    changes: 'Since the saved version: {{removed}} choices to document no longer apply, {{added}} added.',
    changesFieldsGone: 'Fields no longer asked: {{fields}} — the values entered are kept but not exported.',
    changesFieldsNew: 'Fields now asked: {{fields}}.',
    changesNone: 'The Data Collection File asks the same things as the saved version.',
    goSaveChanges: 'Go to the result to save the changes',
  },

  networkDiagram: {
    counts: '{{actors}} actors · {{flows}} flows',
    actors_one: '{{count}} actor',
    actors_other: '{{count}} actors',
    flows_one: '{{count}} flow',
    flows_other: '{{count}} flows',
    inactive: 'The network diagram is not part of this case\'s configuration.',
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
      step2: 'Click a flow in the list below the canvas, then drag from the bottom dot of the actor that gives it to the top dot of the actor that receives it: that arrow is a row of the Flow Matrix.',
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
      'Draw the symbiosis network: every node is an actor, every arrow a row of the Flow Matrix. What you draw here is what the Excel and the report will carry.',
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
    whichFlow: 'Which flow is this arrow?',
    allDrawn: 'All the flows of the questionnaire are drawn. To add one, add it to the flows table of the questionnaire and work out the configuration again.',
    sameActor: 'An arrow goes from one actor to another: origin and destination must be different actors.',
    armed: 'Next arrow: "{{name}}". Drag from the bottom dot of the actor that gives it to the top dot of the actor that receives it — or pick the two actors in the panel.',
    drawnTitle: 'Flows drawn',
    strayTitle: 'Not in the questionnaire',
    strayHint: 'The configuration does not cover these flows. Add them to the flows table of the questionnaire, or remove them.',
    fromQuestionnaire: 'Name and "who pays whom" are set in the questionnaire: change them there and work out the configuration again.',
    notInQuestionnaire: 'Not in the questionnaire: the configuration does not cover this flow. Add it there and remove this arrow.',
    reverse: 'Reverse direction',
    unwire: 'Take the arrow off the canvas',
    confirmRemoveFlow: 'Remove "{{name}}" and the values entered for it?',
    confirmRemoveActor: 'Remove "{{name}}"?',
    confirmRemoveActorFlows_one: 'Remove "{{name}}"? Its {{count}} arrow goes back to the flows not yet drawn, with its values.',
    confirmRemoveActorFlows_other: 'Remove "{{name}}"? Its {{count}} arrows go back to the flows not yet drawn, with their values.',
    panelActor: 'Actor',
    panelFlow: 'Flow',
    scenarioPick: 'Network of',
    scenarioCase: 'The case',
    scenarioOrphan: '{{id}} (no longer in the questionnaire)',
    scenarioReadThrough: 'This scenario uses the case\'s network. Change something (an actor, where a flow goes, a quantity) to give it its own: the case\'s network stays as it is.',
    scenarioOwn: 'This scenario has its own network: changes here do not touch the case\'s, and changes to the case\'s do not carry over. Classification and substitution belong to the case. Who pays whom for a flow is changed in the scenario\'s answers (Who pays whom, per flow).',
    scenarioDrop: 'Use the case\'s network again',
    scenarioDropConfirm: 'Drop this scenario\'s own network? It will use the case\'s network again.',
    arrange: 'Arrange automatically',
    arrangeConfirm: 'Arrange the diagram by flow direction? It replaces the positions you set by hand.',
    panelClassification: 'Classification and substitution (the analyst decides)',
    classificationNote: 'Legal and economic tests of this flow and, if it replaces a product, what it replaces. The same columns are in the Excel file.',
    signInToSave: 'Sign in with the account that saved this case to save the network.',
    missingGoTo: 'Go to the first empty required field',
    givesReceives: 'gives {{gives}} · receives {{receives}}',
    selectHint: 'Select an actor or a flow to edit its fields.',
    removeRow: 'Remove',
    unwiredTitle: 'Flows not yet drawn',
    unwiredHint: 'These flows come from the questionnaire. Click one, then connect the actor that gives it to the one that receives it — or click it and pick the two actors in the panel (the way to do it on a phone).',
    roles: {
      partner: 'partner',
      producer: 'producer',
      consumer: 'consumer',
      facilitator: 'facilitator',
      regulator: 'regulator',
      intermediary: 'intermediary',
    },
  },

  cases: {
    signInToSave: 'Saving a case on the server needs an account. Sign in or register here; your draft stays in this browser. A saved case is public only if you share it.',
    signInToList: "Your saved cases appear here once you sign in. Shared reports open from the link you received.",
    publicLink: "Public link",
    navLink: 'My cases',
    title: 'My cases',
    intro: 'Cases saved on the server. "Open" shows the case (its result, once worked out); "Adjust answers" opens its questionnaire, and "Save changes" on the result stores what you change. Delete removes a case permanently.',
    loadReplaceConfirm: 'Loading this case replaces the answers you are working on, which are not saved. Continue?',
    empty: 'No saved cases yet. Save one from the questionnaire or result page.',
    columns: {
      name: 'Name',
      situation: 'ILCD situation',
      updated: 'Updated',
    },
    loadButton: 'Open',
    editButton: 'Adjust answers',
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
    saveFirstButton: 'Save the case…',
    saveChanges: 'Save changes',
    saveChangesConfirm: 'Overwrite the saved case "{{name}}" with this configuration? The network drawn for it stays.',
    saveChangesSuccess: 'Changes saved in "{{name}}"',
    saveChangesForbidden: 'You can only update your own cases: save it as a new case.',
    saveAsDialog: 'Save as a new case. The network drawn for "{{name}}" is copied with it. Pick a name for the new case.',
    networkNotCopied: 'The case is saved, but the network could not be copied: open the Data Collection File and save the network.',
    sharedYes: 'Shared: public link on',
    sharedNo: 'Private',
  },
}

export default en
export type Locale = typeof en
