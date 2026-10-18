// Français. Termes méthodologiques LCA/LCC/S-LCA + sigles ILCD/PEF/CSRD/MFCA
// /CBA/TEA conservés (normatifs).

import type { Locale } from './en'

const fr: Locale = {
  common: {
    run: 'Exécuter',
    reset: 'Réinitialiser',
    close: 'Fermer',
    add: 'Ajouter',
    remove: 'Supprimer',
    cancel: 'Annuler',
    notSet: '(non défini)',
    optional: 'optionnel',
    skip: '(passer)',
    required: 'Requis',
    examplesAndContext: 'Exemples et contexte',
    methodologicalNote: 'Note méthodologique complète',
    yes: 'oui',
    no: 'non',
  },

  // Funding acknowledgement, worded as on the SYMBA website footer.
  eu: {
    emblemAlt: 'Financé par l\'Union européenne',
    fundingStatement: 'Financé par l\'Union européenne au titre de la convention de subvention N. 101135562.',
    disclaimer:
      'Les opinions exprimées ne sont toutefois que celles du ou des auteurs et ne reflètent pas nécessairement celles de l\'Union européenne. Ni l\'Union européenne ni l\'Agence exécutive européenne pour la recherche ne peuvent en être tenues responsables.',
  },

  footer: {
    logoAlt: 'Symba Project',
    logoTitle: 'Aller au site du projet SYMBA',
    toolLine: 'Monitoring & Reporting System · Tâche T4.6',
    followUs: 'Suivez-nous',
    projectInfo: 'Informations sur le projet',
    projectWebsite: 'Site du projet',
    publicDeliverables: 'Livrables publics',
    copyright: 'Copyright © {{year}} Symba Project, tous droits réservés.',
    privacy: 'Politique de confidentialité',
    cookies: 'Stockage dans le navigateur',
  },

  siteHeader: {
    logoAlt: 'Symba Project',
    logoTitle: 'Aller au site du projet SYMBA',
    navLabel: 'Site du projet SYMBA',
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    backToSite: 'Site du projet',
    tool: 'Outil de suivi',
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
    brandTag: 'Système de Suivi et de Reporting pour la Symbiose Industrielle',
    about: 'À propos',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Appuyez sur {{key}} pour les raccourcis',
  },

  share: {
    buttonLabel: 'Partager le rapport', title: 'Partager ce rapport',
    lead: 'Envoyez l\'un de ces URLs à une partie prenante. Même cas, cadrage différent pour chaque audience.',
    close: 'Fermer', done: 'Terminé', copy: 'Copier', copied: 'Copié ✓',
    copyFailed: 'Copie impossible — copiez l\'URL manuellement.',
    saveFirstTitle: 'Sauvegardez d\'abord le cas',
    saveFirstBody: 'Les URLs nécessitent un case id sauvegardé.',
    audience: { industry: '🏭 Industrie', community: '🌳 Communauté', authority: '🏛 Autorité locale', enduser: '👤 Utilisateur' },
  },

  reader: {
    tagline: 'Rapport public',
    loading: 'Chargement du rapport…',
    notFoundTitle: 'Rapport introuvable',
    notFoundBody: 'Le lien peut être incorrect ou le cas a été supprimé.',
    aboutLink: 'Découvrir SYMBA',
    eyebrow: 'Rapport partagé · {{name}}',
    summaryTitle: 'Résumé de la configuration',
    summary: { ilcd: 'Situation ILCD', lcc: 'Type LCC', slca: 'État S-LCA', sector: 'Secteur', scope: 'Concentration des interactions' },
    scoringTitle: 'Scoring',
    complianceTitle: 'Signaux de conformité',
    compliance: {
      peer: { name: 'Revue par les pairs', desc: 'Q4 = E · éligibilité ISO 14044' },
      pef: { name: 'Alignement EU PEF', desc: 'Q4 = D · Circular Footprint Formula' },
      public: { name: 'Revendication publique', desc: 'Q4 = C · panel ISO obligatoire' },
      dnsh: { name: 'Vérification DNSH', desc: 'EU Taxonomy art. 17' },
    },
    audience: {
      showingFor: 'Vue pour — {{name}}',
      industry: { short: '🏭 Industrie', name: 'Industrie', title: 'Vue opérateur', body: 'Vue technique complète pour les opérateurs.' },
      community: { short: '🌳 Communauté', name: 'Communauté', title: 'Vue impact local', body: 'Qualité environnementale et bénéfices sociaux pour le territoire.' },
      authority: { short: '🏛 Autorité', name: 'Autorité locale', title: 'Vue réglementaire', body: 'Conformité, revue par les pairs, PEF, DNSH.' },
      enduser: { short: '👤 Utilisateur', name: 'Utilisateur final', title: 'Résumé', body: 'Points clés sur les produits issus de la symbiose.' },
    },
    note: 'Ce rapport est généré par le moteur SYMBA T4.6.',
    about: {
      eyebrow: 'À propos de SYMBA T4.6',
      title: 'Rapports publics · en bref',
      lead:
        "Quelqu'un a partagé un cas avec vous.",
      whoTitle: 'Qui est derrière ?',
      whoBody: 'SYMBA est un projet Horizon Europe (GA 101135562, M22–M36).',
      whatTitle: 'Qu\'est-ce qu\'un rapport ?',
      whatBody: 'Un rapport décrit un cas de symbiose industrielle.',
      whereTitle: 'Où en savoir plus ?',
      whereBody: 'Visitez le site du projet',
      enterTool: 'Entrer dans l\'outil',
    },
    region: {
      eyebrow: 'Région · {{code}}', title: 'Tableau de bord régional', lead: 'Vue agrégée des cas IS.', total: 'Cas', situations: 'Situations ILCD', sectors: 'Secteurs couverts',
      bySituationTitle: 'Par situation ILCD', bySectorTitle: 'Par secteur', tableKey: 'Valeur', tableCount: 'Nombre',
      errorTitle: 'Région indisponible', errorBody: 'Impossible de charger les données.',
    },
  },

  welcome: {
    title: 'Bienvenue sur SYMBA T4.6',
    lead: "Cet outil détermine quelle méthodologie votre cas de symbiose industrielle exige et quelles données vous devez collecter. Il ne calcule pas les résultats environnementaux, économiques ou sociaux. Deux questions rapides et nous vous emmenons au bon endroit — vous pourrez les modifier plus tard, depuis le menu à l'intérieur de l'outil.",
    step1: { title: 'Qui êtes-vous ?' },
    step2: { title: 'Que souhaitez-vous faire ?' },
    back: 'Retour',
    next: 'Continuer',
    finish: 'C\'est parti',
    skip: 'Passer pour l\'instant',
    roles: {
      analyst: { name: 'Analyste de durabilité', desc: 'Praticien IS, relecteur LCA/LCC/S-LCA, méthodologue.' },
      industry: { name: 'Opérateur industriel', desc: 'Vous gérez une usine ou un site dans un réseau IS.' },
      authority: { name: 'Autorité locale', desc: 'Municipalité, région, analyste politique du territoire.' },
      community: { name: 'Représentant de communauté', desc: 'Association, ONG, groupe de citoyens du territoire hôte.' },
      enduser: { name: 'Utilisateur / citoyen', desc: 'Vous utilisez des produits ou services issus de la symbiose.' },
      unknown: { name: 'Pas sûr encore', desc: 'C\'est bien — nous vous emmenons sur la page de vue d\'ensemble.' },
    },
    tasks: {
      assess: { name: 'Démarrer une nouvelle évaluation', desc: 'Configurer la méthodologie pour un cas IS en dix questions.' },
      read: { name: 'Lire un rapport partagé', desc: 'Ouvrir un cas partagé avec moi et voir le rapport.' },
      explore: { name: 'Explorer une région / secteur', desc: 'Parcourir les insights agrégés pour ma zone.' },
      browse: { name: 'Juste regarder', desc: 'Pas d\'objectif précis — je veux voir ce que fait l\'outil.' },
    },
  },

  adminShell: {
    searchLabel: 'Rechercher',
    searchPlaceholder: 'Rechercher des cas, partenaires… (⌘K)',
    footerGa: 'GA',
    footerProgramme: 'Horizon Europe · M22–M36',
    groups: {
      workspace: 'Espace de travail',
      reports: 'Rapports',
      system: 'Système',
    },
    nav: {
      home: 'Accueil',
      questionnaire: 'Nouvelle évaluation',
      cases: 'Mes cas',
      recentResult: 'Résultat récent',
      stakeholder: 'Rapports parties prenantes',
      aggregate: 'Tableau de bord régional',
      dcf: 'Data Collection File',
      about: 'À propos',
      changeRole: 'Changer de rôle',
    },
  },

  health: {
    backendLabel: 'Backend',
    checking: 'vérification',
    ok: 'OK',
    unreachable: 'inaccessible',
    bannerPart1: 'Le backend à',
    bannerPart2:
      "est inaccessible. Le questionnaire fonctionne mais les exécutions de pipeline échoueront tant que le backend n'est pas en ligne.",
  },

  savedStatus: {
    empty: 'Aucun brouillon',
    justNow: 'Brouillon enregistré · à l\'instant',
    secondsAgo: 'Brouillon enregistré · il y a {{n}}s',
    minutesAgo: 'Brouillon enregistré · il y a {{n}}m',
    hoursAgo: 'Brouillon enregistré · il y a {{n}}h',
  },

  home: {
    title: "SYMBA T4.6 — Outil d'évaluation IS",
    tagline: 'Sélection méthodologique pour la Symbiose Industrielle (LCA / LCC / S-LCA).',
    description:
      "Répondez à dix questions sur votre cas d'étude de symbiose industrielle. Le moteur de décision dérive la configuration méthodologique (situation ILCD, structure LCC, horizon de l'étude, scénario de référence) à partir des 186 nœuds Phase 1 des livrables D4.1, D4.2 et D4.3, plus les 40 règles cross-method.",
    startButton: 'Démarrer une nouvelle évaluation',
    modeLabel: 'Mode UX',
    modeExpert: 'Expert',
    modeGuided: 'Guidé',
    modeHint: {
      expert: "Questionnaire rapide pour les analystes IS et relecteurs familiers avec la terminologie ILCD / LCSA.",
      guided: "Mode pas-à-pas pour les industriels, représentants de communautés et décideurs. Chaque question est accompagnée d'une explication en mots simples ; la note méthodologique complète reste à un clic.",
    },
    hero: { title: 'Démarrer une nouvelle évaluation IS' },
    openCasesLink: 'Ou ouvrir un cas sauvegardé',
    kpi: {
      savedCases: 'Cas sauvegardés',
      savedCasesDetail: 'tous utilisateurs confondus',
      configured: 'Configurés',
      configuredDetail: '{{total}} au total',
      situations: 'Situations ILCD',
      situationsDetail: 'A · B · C1 · C2',
      language: 'Disponible en',
      languageDetail: '5 langues',
    },
    presetsTitle: 'Études de cas validées',
    presetsMeta: '13 fixtures issues d\'articles peer-reviewed',
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
    title: 'À propos',
    p1:
      "SYMBA T4.6 aide celui qui met en place une évaluation de durabilité du cycle de vie d'une symbiose industrielle : à partir de dix questions sur le cas, il déduit quelle méthodologie s'applique, quelles pratiques documenter et quelles données collecter auprès des partenaires du réseau. Il ne calcule pas les résultats — les scores quantitatifs sont produits hors de l'outil et s'affichent ici une fois livrés.",
    p2:
      "Le questionnaire (Q1-Q11 ; Q9 fixe la situation ILCD, Q10 l'ACC sociétal) déclenche l'activation des 186 nœuds Phase 1 plus 40 règles cross-method (18 IR + 10 CIR + 5 FU + 7 B). L'enforcement L3 au moment du reporting (IR-04 + IR-10) plus 12 Critical Decision Points font émerger les tensions cross-method.",
    p3:
      'Affichage de la configuration par pillar, overrides avancés et panneau « Show reasoning » sont tous opérationnels.',
  },

  error: {
    title: "Quelque chose s'est mal passé",
    backHome: "Retour à l'accueil",
    fallback: 'Erreur inattendue',
  },

  questionnaire: {
    scopeNote: "Cet outil ne calcule pas les chiffres ACV/LCC/S-ACV. Il dérive la configuration méthodologique requise par votre cas et les données à collecter ; le scoring quantitatif est produit à l'extérieur et s'affiche ici une fois livré.",
    title: 'Questionnaire',
    guidedBannerTitle: 'Mode guidé actif',
    guidedBannerBody:
      "Chaque question s'ouvre sur une explication courte, en mots simples. La note méthodologique complète, dans la formulation des livrables du projet, reste à un clic sous chaque question. Les dix réponses déterminent la configuration méthodologique et le plan de collecte de données que vous recevrez à la fin.",
    intro:
      "Dix questions sur votre cas de symbiose industrielle. Q1 et au moins une dimension Q3 sont requises ; le reste est optionnel mais améliore la sortie du moteur.",
    runButton: 'Calculer la configuration',
    runningButton: 'Calcul en cours…',
    resetButton: 'Réinitialiser le brouillon',
    confirmReset: 'Effacer toutes les réponses et recommencer ? Opération irréversible.',
    q1Required: 'Q1 est requise.',
    shortcutTip: 'Astuce : Ctrl/⌘+Entrée pour exécuter',

    q1: {
      title: "Q1 — Qu'analysez-vous ? *",
      help:
        'Choisissez la correspondance la plus proche : ce qui compte est le sujet de l\'étude, pas son commanditaire. Elle décrit le système et sa frontière ; la modélisation de l\'étude découle de Q9 et des questions suivantes. (Obligatoire.)',
      details:
        "A — échange bilatéral (ex. chaleur fatale de l'Usine X vers l'Usine Y, ou gypse co-produit d'une centrale thermique vers une cimenterie). Le sujet est le FLUX PARTAGÉ entre deux entreprises. " +
        'B — parc éco-industriel ou réseau symbiotique avec 3+ acteurs (ex. Kalundborg, cluster NISP, masterplan de parc industriel). Le sujet est le RÉSEAU comme système. ' +
        "C — décision de politique ou programme public à l'échelle régionale/nationale (ex. schéma de subvention IS, cadre réglementaire, stratégie industrielle UE). Le sujet est la DÉCISION/PROGRAMME, pas une usine spécifique. " +
        'D — entreprise unique quantifiant sa contribution symbiotique pour reporting ESG / CSRD / durabilité (ex. « nous avons vendu 12 kt de laitier aux cimentiers, voici notre crédit »). Le sujet est UNE SEULE ENTREPRISE. ' +
        "E — suivi périodique d'une symbiose déjà opérationnelle (mises à jour KPI annuelles, surveillance post-implémentation). Le sujet est la SÉRIE TEMPORELLE, pas une étude ponctuelle.",
      options: {
        A: { label: 'A. Échange spécifique', description: 'Un échange symbiotique entre deux entreprises existantes.' },
        B: { label: 'B. Eco-park / réseau', description: 'Un parc éco-industriel ou un réseau symbiotique multi-acteurs.' },
        C: { label: 'C. Politique / programme', description: "Une décision de politique ou programme à l'échelle régionale ou nationale." },
        D: { label: 'D. Rapport entreprise', description: "La contribution symbiotique d'une seule entreprise pour reporting ESG/CSRD." },
        E: { label: 'E. Suivi', description: "Suivi temporel d'une symbiose déjà opérationnelle." },
      },
      plain:
        'Dites ce que vous examinez : un échange, un parc, un programme, une entreprise, une symbiose suivie dans le temps. La réponse décrit le système et sa frontière ; la manière de modéliser l\'étude est décidée par les questions suivantes, à commencer par la finalité de l\'étude (Q9). Si vous hésitez entre deux options, gardez celle qui décrit la chose dont vous voulez mesurer les effets.',
    },

    q2: {
      title: 'Q2 — Les échanges mesurés par l\'étude ont-ils déjà lieu ?',
      details:
        'Répondez sur les échanges symbiotiques, pas sur les installations : une installation peut exister alors que l\'échange étudié n\'est encore qu\'un projet. A — oui : les échanges ont lieu aujourd\'hui et leurs flux peuvent être mesurés (ex. Kalundborg ; le district des tanneries de Daddi 2017). La référence est ce que chaque entreprise ferait aujourd\'hui si les liens étaient rompus (HNSRS, D4.1 §11.1). Si le réseau fonctionne depuis de nombreuses années, cette référence est un contrefactuel moderne, pas la configuration des entreprises d\'il y a des décennies (D4.1 §11.2.2) : la question de suivi le demande. B — pas encore : les échanges sont prévus, conçus, hypothétiques ou tout juste démarrés, même entre des installations qui fonctionnent déjà. La référence est la situation actuelle sans eux, y compris les échanges qui fonctionnent déjà (CNSRS, D4.1 §11.1). Comparer des alternatives (une extension, une nouvelle technologie) est ouvert à toute étude : ajoutez-les comme scénarios ci-dessous (D4.1 §4.3.3). Le moment où le système fonctionne est demandé en Q8.',
      options: {
        A: { label: 'A. Oui, ils ont déjà lieu', description: 'Les échanges ont lieu aujourd\'hui : leurs flux peuvent être mesurés.' },
        B: { label: 'B. Pas encore', description: 'Prévus, conçus ou tout juste démarrés, même entre des installations qui existent déjà.' },
      },
      longStanding: {
        label: 'Le réseau fonctionne-t-il depuis de nombreuses années, au point que les installations qu\'il a remplacées ne seraient plus construites aujourd\'hui ?',
        yes: 'Oui — la référence est un contrefactuel moderne (D4.1 §11.2.2)',
        no: 'Non — le réseau est récent',
      },
      plain:
        'Pensez aux échanges, pas aux installations. Si les flux entre les entreprises ont déjà lieu, vous pouvez les mesurer. S\'ils ne sont encore qu\'une idée, même entre des installations qui fonctionnent déjà, vous pouvez seulement les estimer. Vous voulez comparer des alternatives, comme une extension ou une nouvelle technologie ? Ajoutez-les comme scénarios ci-dessous, quelle que soit votre réponse ici.',
    },

    q3: {
      title: 'Q3 — Quelles dimensions de durabilité inclure ? *',
      help: "Au moins une est requise. Environnementale et économique sont l'appariement habituel.",
      details:
        "ENV — Life Cycle Assessment environnementale (LCA) : impacts climat, écosystèmes, ressources. Presque toujours sélectionnée. " +
        "ECO — dimension économique, évaluée par Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) est une technique utilisée dans la LCC (activée par ECO et par les flux contestés en Q5), pas une alternative ; CBA et TEA ne sont pas proposées par ce moteur. " +
        "SOC — S-LCA. La sélectionner active une chaîne de règles plus longue (catégories stakeholder worker / communauté locale / value chain) et force L1 BLOCK 2 si l'override avancé slca_framework_override vaut « absolute ». " +
        "La plupart des papiers IS publiés font ENV uniquement (ex. Sokka, Daddi) ; quelques-uns couplent ENV+ECO (Hashimoto, Wiktor) ; rares sont ceux qui ajoutent SOC.",
      warning: 'Sélectionnez au moins une dimension pour continuer.',
      env: 'Environnementale (LCA)',
      eco: 'Économique (LCC)',
      soc: 'Sociale (S-LCA)',
      plain:
        "Trois évaluations distinctes, chacune avec sa méthode et ses données : environnementale, économique — les coûts sur tout le cycle de vie, pas une analyse coûts-bénéfices — et sociale. Choisissez celles que vous comptez livrer. La plupart des études publiées ne font que l'environnementale, et ajouter l'économique est l'étape suivante habituelle ; la sociale demande bien plus d'informations auprès des personnes concernées, prévoyez donc d'aller les recueillir.",
    },

    q4: {
      title: 'Q4 — À quoi servira cette étude ?',
      help: 'Multi-sélection. Certains usages se combinent (ex. D + E pour un papier EU PEF).',
      details:
        "A — usage interne : dashboards de management, screening R&D, décisions au niveau usine. Peu de contraintes méthodologiques. " +
        "B — communication externe SANS claim comparatif (rapports de durabilité, brochures marketing sans phrase « meilleur que X »). " +
        "C — CLAIM public que le système est meilleur qu'une alternative de même fonction, ou équivalent à elle (ex. « ce ciment est plus vert que l'OPC »), rendu public sous quelque forme que ce soit : rapport, site ou article scientifique (comparative assertion, ISO 14040 §3.6 ; D4.1 §15.3.4). Active la critical review obligatoire ISO 14044 par 3+ experts indépendants et désactive la pondération. À utiliser avec précaution. " +
        "D — alignement avec les instruments de politique UE (digital product passport ESPR, règles de catégorie PEFCR). Force la PEF Circular Footprint Formula via CIR-05. Le rapport strict d'une seule entreprise (CSRD, ESG) se déclare en Q9, pas ici : il utilise l'allocation, pas la CFF. " +
        "E — publication académique peer-reviewed. Exige une transparence totale (sources de données, choix d'allocation, sensibilité). Souvent combinée avec B ou D. Si l'article affirme qu'un système est meilleur qu'une alternative concurrente ou équivalent à elle, cochez aussi C ; une comparaison qui ne désigne pas de gagnant reste E (lecture T4.6). " +
        "Multi-sélection possible : un papier PEF typique choisit D + E.",
      options: {
        A: { label: 'A. Interne', description: 'Usage interne (managérial, R&D, planification).' },
        B: { label: 'B. Externe (sans claim)', description: 'Communication externe sans affirmations comparatives.' },
        C: {
          label: 'C. Claim public de supériorité',
          description: 'Affirmation publique de supériorité ou d\'équivalence face à une alternative de même fonction, sous toute forme (articles compris).',
          warn: 'Active la revue OBLIGATOIRE par panel de 3+ experts indépendants (ISO 14044), pondération non autorisée.',
        },
        D: {
          label: "D. Alignement politique UE",
          description: 'Alignement politique UE (ESPR, PEF/PEFCR).',
          warn: 'Active la PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Publication académique', description: 'Publication académique peer-reviewed (ajoutez C si elle affirme qu\'un système l\'emporte sur une alternative concurrente ou l\'égale).' },
      },
      plain:
        "Qui lira le résultat, et ce qu'il en fera, détermine la sévérité de la méthode. Une note interne est le cas le plus léger. S'aligner sur les instruments de l'UE (passeport produit, PEF) impose la manière européenne de compter la matière recyclée et récupérée. Affirmer publiquement que votre produit est meilleur qu'un autre est le cas le plus lourd : cela exige une revue indépendante par des experts extérieurs. Cela vaut où que vous le disiez, y compris dans un article scientifique. Vous pouvez en choisir plusieurs.",
    },

    q5: {
      title: 'Q5 — Nature de chaque flux symbiotique (par flux)',
      help:
        "Ajoutez une ligne par flux symbiotique principal et choisissez sa catégorie Q5. Obligatoire pour Q1 ∈ {A, B, D} ; optionnel sinon.",
      details:
        'Pour chaque flux principal échangé entre acteurs (chaleur, CO₂, laitier, eaux usées, hydrogène…), indiquez qui paie qui : ' +
        'a — A paie B pour reprendre le flux (un tarif de prise en charge : valeur de marché négative, un DÉCHET pour A, D4.1 §8.3.2). Le zéro-charge s\'applique à partir du point où le résidu atteint pour la première fois une valeur non négative, pas à la porte. Payer ne veut pas dire inévitable : D4.2 §6.2 exige aussi le test causal d\'évitabilité, déclaré par flux dans le Data Collection File. ' +
        'b — flux échangé GRATUITEMENT (statut ambigu) : le moteur oriente vers la chaîne de désambiguïsation des flux gratuits. ' +
        'c — B paie A pour le flux (valeur de marché positive : un CO-PRODUIT pour A) : substitution de la matière vierge déplacée, avec un ratio corrigé de la qualité. La Circular Footprint Formula du PEF n\'est pas liée à Q5 : elle vient de Q4=D. Si aucun tiers ne paierait pour le flux (test de Freedom-to-Act, D4.1 §8.3.3), le prix est administratif et le flux est modélisé comme un déchet. ' +
        'd — flux INTERDÉPENDANT : A a délibérément modifié son procédé (qualité, quantité, post-traitement) pour fournir B ; un co-produit quel que soit le prix, jamais zéro-charge. ' +
        'e — AGRÉGÉ / boîte noire : la source ne donne pas de détail par flux (typique des travaux agrégés comme Sokka 2011). C\'est une limite de la source, pas un choix de modélisation : D4.1 §8.3.1 interdit une règle unique pour tout le réseau, le Data Collection File demande donc quand même la classification de chaque flux que vous pouvez nommer. ' +
        'Q5 enregistre qui paie qui ; les tests juridiques et économiques (Freedom-to-Act, End-of-Waste, classe de sous-produit, évitabilité, point de zéro-charge) se déclarent par flux dans la section Flow classification du Data Collection File. Pour les études de politique Q1=C, Q5 est généralement facultative.',
      plain:
        "Pour chaque chose qui circule entre les entreprises — chaleur, eau, scories, CO₂ — la question ici est seulement qui paie qui : l'expéditeur paie pour s'en débarrasser, personne ne paie, ou le destinataire paie pour l'obtenir. Si l'expéditeur a délibérément modifié son propre procédé pour le fournir, choisissez cette option quoi que dise l'argent. Si votre source ne donne qu'un chiffre pour tout le réseau, choisissez la dernière option : on vous interrogera tout de même sur chaque flux que vous savez nommer, car une règle unique pour tout le réseau n'est pas admise. Savoir si un flux est un déchet au sens du droit se décide plus tard, dans le fichier de collecte de données, pas ici.",
    },

    q6a: {
      title: 'Q6a — Secteur',
      help: 'Le secteur principal du cas, à titre descriptif. Les règles sectorielles de la D4.1 Part 2 suivent le secteur de chaque flux échangé, déclaré dans le tableau des flux.',
      details:
        'Le secteur décrit le cas et ouvre quelques champs spécifiques dans le Data Collection File ; les règles sectorielles de la D4.1 Part 2 suivent le secteur déclaré pour chaque flux, car les chapitres suivent ce qui est échangé. Choisissez la correspondance la plus proche du secteur dominant du cas (l\'acteur qui contribue le plus en masse/énergie/valeur). ' +
        'Exemples : pulp_paper pour Sokka 2011 (UPM Kymi) ; cement_construction pour Hashimoto 2010 (Kawasaki) ; textile_leather pour Daddi 2017 (district des tanneries) ; wastewater_sludge_biofactories pour Wiktor 2018 ; chemicals_fertilizers pour Leiva 2025 Escombreras ; biobased_polymers pour Briassoulis. ' +
        "Pour les cas mixtes, utilisez multi_sector. Les entrées « (legacy) » en bas existent pour le chargement backward-compatible des anciennes fixtures — préférez la nouvelle liste à 14 secteurs.",
      options: {
        none: '(aucun)',
        agriculture_agrifood_biorefineries: 'Agriculture / agroalimentaire / bioraffineries',
        biobased_polymers: 'Polymères bio-sourcés',
        plastics_packaging: 'Plastiques et emballages',
        pulp_paper: 'Pâte et papier',
        chemicals_fertilizers: 'Chimie / engrais',
        cement_construction: 'Ciment / construction',
        steel_metals: 'Acier et métaux',
        energy_utilities: 'Énergie / utilities',
        wastewater_sludge_biofactories: 'Eaux usées / boues / biofactories',
        textile_leather: 'Textile / cuir',
        waste_valorization: 'Valorisation des déchets',
        food_production: 'Production alimentaire',
        multi_tenant_urban_building: 'Bâtiment urbain multi-locataires',
        multi_sector: 'Multi-secteur',
        other: 'Autre (spécifier)',
        wastewater_biofactories: 'Eaux usées / boues / biofactories (legacy)',
        agri_food: 'Agroalimentaire / bioraffineries (legacy)',
        process_industry: 'Industrie de process (legacy)',
      },
      plain:
        'Le secteur principal du cas : l\'activité de l\'entreprise qui pèse le plus en masse, énergie ou valeur. Il décrit le cas ; les règles sectorielles des lignes directrices suivent la nature de chaque flux, que vous déclarez dans le tableau des flux. Si le cas couvre plusieurs secteurs, choisissez Multi-secteur et ignorez les entrées (legacy).',
    },

    q6b: {
      title: 'Q6b — Niveau de maturité technologique (TRL)',
      details:
        "TRL de la technologie dominante ou critique du réseau symbiotique. Détermine le choix de la qualité des données d'inventaire (mesurées vs littérature vs estimation d'ingénierie) et le budget d'incertitude downstream. " +
        "C'est le TRL de la technologie clé elle-même, non de son adoption : une technologie mature qui traite le même type d'intrant à la même échelle qu'ailleurs, utilisée pour la première fois dans ce réseau ou cette région, reste TRL 9, et la nouveauté se voit dans la qualité des données (lecture T4.6) ; un procédé mature appliqué à un intrant jamais traité à l'échelle est un échange à faible TRL (D4.1 §9.3.5). " +
        "TRL 9 = pleine exploitation commerciale (Kalundborg, Sokka). " +
        "TRL 7-8 = pilote first-of-a-kind / unité pré-commerciale. " +
        "TRL 5-6 = prototype validé en laboratoire, démo à l'échelle pertinente. " +
        "TRL <5 = R&D précoce, paillasse uniquement — grande incertitude, scénarios recommandés.",
      options: {
        TRL9: 'TRL 9 — pleinement opérationnel',
        'TRL7-8': 'TRL 7-8 — pilote / pré-commercial',
        'TRL5-6': 'TRL 5-6 — prototype',
        'TRL<5': 'TRL <5 — R&D précoce',
      },
      plain:
        "Le degré de maturité de la technologie clé : en exploitation commerciale, premier pilote, prototype, ou encore en laboratoire. Moins elle est mature, plus vos chiffres seront des estimations et non des mesures, et plus le résultat doit porter sa propre incertitude. Jugez la technologie elle-même, non sa nouveauté ici : un procédé éprouvé utilisé pour la première fois dans votre région reste mature, pourvu qu'il traite le même type de matière qu'ailleurs.",
    },

    q7: {
      title: 'Q7 — À quel point les interactions clés sont-elles concentrées ?',
      help: 'Elle fixe la régionalisation de l\'évaluation des impacts. Le transport est modélisé explicitement pour chaque échange, quelle que soit la réponse ; la distance d\'équilibre est demandée pour chaque flux dans le Data Collection File.',
      details:
        'D4.1 §12.2.3 : un facteur de caractérisation moyen mondial ou national ne saisit pas la portée d\'un système dont les interactions clés sont intensément locales (ex. une synergie de partage d\'eau dans une région aride). A — un site ou des installations adjacentes : facteurs spécifiques au lieu pour la rareté de l\'eau, l\'eutrophisation et l\'acidification, et le décalage d\'échelle signalé là où des facteurs régionaux sont appliqués au niveau du site (§12.3.3). B — au sein d\'une région : facteurs régionalisés, ex. les facteurs par pays de Seppälä / Posch pour un cluster régional (§12.3.3). C — entre régions ou par-delà les frontières : facteurs spatialement explicites au lieu de chaque émission. Le transport ne dépend jamais de cette réponse : chaque liaison est un processus unitaire distinct du premier plan avec des données primaires, et un SIG ou un outil de calcul d\'itinéraires est recommandé pour chaque échange (§12.3.1). La seconde partie demande le marché d\'où viennent les produits remplacés : les mix d\'arrière-plan et le scénario de référence s\'y rapportent, national ou infranational en règle générale, continental seulement pour les produits échangés à l\'échelle mondiale sans marché infra-continental (§11.3.1).',
      options: {
        A: { label: 'A. Un site', description: 'Un site ou des installations adjacentes : les interactions sont intensément locales.' },
        B: { label: 'B. Régional', description: 'Plusieurs sites au sein d\'une région.' },
        C: { label: 'C. Entre régions', description: 'Sites entre régions ou par-delà les frontières.' },
      },
      market: {
        label: 'Marché de référence : d\'où viendraient les produits remplacés ?',
        help: 'Le marché auquel puiserait le contrefactuel, pas le marché des produits de la symbiose. Facultatif.',
        region: 'Pays ou région',
        regionPlaceholder: 'ex. Italie, Catalogne, UE',
        scope: {
          unset: 'Sans réponse',
          national: 'National',
          sub_national: 'Infranational (une région dans un pays)',
          continental: 'Continental (seulement pour les biens échangés dans le monde entier)',
        },
      },
      plain:
        'À quel point les interactions clés entre les entreprises sont proches : sur un site, au sein d\'une région, ou entre régions ou par-delà les frontières. Cela décide à quelle échelle locale les impacts environnementaux sont évalués : une pollution de l\'eau ou de l\'air à côté d\'un site ne pèse pas comme la même quantité répartie sur un pays. Le transport est compté dans tous les cas. Indiquez ensuite d\'où viendraient sinon les produits que la symbiose remplace : un pays, une région ou, pour les biens échangés dans le monde entier, un continent.',
    },
    q8: {
      title: 'Q8 — Horizon temporel de l\'étude',
      help: 'Facultative. Un seul horizon pour l\'ACV et l\'ACC.',
      details: 'Les livrables exigent un seul horizon temporel pour l\'ACV, l\'ACC et l\'ACV-S (D4.2 §11, D4.1 §14). Des scénarios d\'arrière-plan futurs (SSP/RCP) sont ajoutés aux deux lorsque le système fonctionne une année future (D4.1 §9.3.5, §12.3.2), lorsque la technologie clé est en dessous de TRL 7 (Q6b) ou lorsque la période d\'analyse ou la durée de vie des actifs principaux dépasse 15 ans (D4.2 §9.3, qui donne ce chiffre sans source ; il peut être modifié dans les réglages avancés). Sans réponse, l\'année d\'exploitation est celle de l\'étude. La période d\'analyse est la durée couverte par l\'étude ; en règle générale, elle coïncide avec la durée de vie technique des actifs principaux (D4.2 §9). La durée de vie des actifs principaux est aussi la période d\'amortissement de leurs biens d\'équipement, la même en ACV et en ACC (D4.1 §6.3.3, §14.2.2) ; les actifs d\'une autre durée de vie vont dans le fichier de collecte de données.',
      start: {
        label: 'En quelle année le système fonctionne-t-il, ou est-il censé fonctionner ?',
        options: {
          unset: 'Sans réponse (l\'année de l\'étude)',
          now: 'Maintenant : l\'année de l\'étude',
          future: 'Une année future',
        },
        yearPlaceholder: 'ex. 2030',
      },
      period: {
        label: 'Pendant combien d\'années l\'étude suit-elle le système (période d\'analyse ou horizon du projet) ?',
        placeholder: 'ex. 25 ; vide pour une photographie d\'une année',
      },
      lifetime: {
        label: 'Durée de vie technique des actifs principaux : combien de temps les installations durent physiquement, pas l\'horizon du projet (aussi leur période d\'amortissement)',
      },
      placeholder: 'ex. 20',
      unit: 'ans',
      plain:
        'Sur quelles années l\'étude regarde-t-elle le système ? Si elle décrit comment les choses fonctionnent aujourd\'hui, une photographie du présent suffit. Si elle porte sur une installation qui fonctionnera une année ultérieure, ou suit le système sur des décennies, le résultat dépend de l\'évolution de l\'électricité, des carburants et des marchés, et l\'outil vous demande de vous prononcer sur cet avenir : le même avenir pour la lecture environnementale et pour la lecture économique.',
    },
    q9: {
      title: 'Q9 — À quoi sert l\'étude, et jusqu\'où vont ses effets ? *',
      help: 'Obligatoire. Elle fixe la situation de modélisation (ILCD A, B, C1 ou C2) ; Q1 décrit seulement le sujet.',
      details: 'Le Tableau 1 de D4.1 classe l\'étude selon la décision qu\'elle soutient et l\'échelle de ses conséquences, non selon son sujet (D4.1 §4.2.3). Micro (Situation A) est le défaut pour les échanges isolés et les projets de parc ou d\'installation, même sans décideur nommé (§4.3.4). Structurelle (Situation B) exige la preuve que le changement déplace la capacité installée du marché concerné, par exemple environ 1 % ou plus des nouvelles installations (§4.3.4, §11.3.1) ; sans preuve, l\'étude reste A, avec B en sensibilité. Documenter un réseau existant relève de la Situation C1 (substitution, §7.2.3) ; le rapport d\'une seule entreprise isolée relève de C2 (allocation, sans crédits, §7.2.3), avec des coûts au seul niveau de l\'entreprise (choix de conception T4.6).',
      options: {
        micro: 'Elle explore ou soutient un choix, même hypothétique et sans décideur nommé, et ses effets restent dans les installations concernées (Situation A)',
        structural: 'Elle soutient un choix dont les effets changent ce que produit tout un marché ou secteur (Situation B ; la preuve doit être documentée)',
        none: 'Aucun choix : elle documente ce qu\'un réseau ou un système existant apporte, tel qu\'il est (Situation C1)',
        corporate_report: 'Rapport d\'une seule entreprise isolée (ESG / CSRD), sans crédit pour ce que la symbiose évite ailleurs (Situation C2)',
      },
      screening: {
        label: 'Est-il documenté que le changement déplace environ 1 % ou plus de la nouvelle capacité du marché concerné ?',
        yes: 'Oui, c\'est documenté (Situation B)',
        no: 'Non (Situation A, avec la Situation B en analyse de sensibilité)',
      },
      plain:
        'À quoi sert l\'étude ? Le plus souvent, elle explore ou soutient un choix dont les effets restent dans les installations concernées, même si personne ne doit encore décider. Ce n\'est que lorsque le changement est assez grand pour modifier ce que produit tout un marché, et qu\'on peut le montrer, que l\'étude change de nature. Si vous décrivez seulement un réseau qui fonctionne déjà, ou les chiffres d\'une seule entreprise, dites-le : chaque cas se modélise différemment.',
    },
    q10: {
      title: 'Q10 — L\'étude sert-elle un objectif public ou un décideur public ? *',
      help: 'Obligatoire quand la dimension économique est active : elle décide si l\'ACC sociétal est ajouté.',
      details: 'La D4.2 §2.3 ajoute un ACC sociétal (facteur fiscal net, externalités monétisées, taux d\'actualisation social) lorsque l\'étude sert un objectif de politique publique ou d\'aménagement du territoire, et le §2.2 lie le choix du type d\'ACC à la perspective du décideur : une municipalité, un service public ou un régulateur adopte le point de vue public, quel que soit le sujet de l\'étude (la D4.2 §9.2 indique 3-5 % comme taux d\'un partenaire municipal ou d\'un service public). Une municipalité qui planifie un éco-parc ou un service public qui dimensionne une liaison de chauffage urbain répond oui. Le rapport strict d\'une seule entreprise (Q9 : rapport d\'entreprise, situation C2) garde le coût au niveau de l\'entreprise (choix de conception T4.6), et l\'outil le signale.',
      options: {
        yes: 'Oui — un objectif de politique publique ou d\'aménagement, ou un décideur public (ajoute l\'ACC sociétal)',
        no: 'Non — une décision privée ou le compte propre d\'une entreprise',
      },
      plain:
        'Répondez oui si l\'étude doit alimenter une décision publique, ou si un organisme public la commande : une municipalité, une région, un service public, un régulateur, un plan. Une seconde lecture économique s\'ajoute alors, du point de vue de la société : les taxes comptées autrement, et les effets que personne ne paie en argent. Pour le compte propre d\'une entreprise, la lecture économique reste au niveau de l\'entreprise.',
    },

    q11: {
      title: "Q11 — Que compare l'étude ?",
      help: "Facultative. Elle fixe la base de l'unité fonctionnelle ; sans réponse, l'unité orientée fonction de la D4.1 Part 1 s'applique.",
      details: "La D4.1 Part 2 demande que l'unité fonctionnelle reflète la fonction principale du système (§4.3, §6.3, §8.3) : une unité basée sur l'intrant (p. ex. traitement d'une tonne de déchet) lorsque l'étude compare des filières de gestion d'un déchet ou la performance d'une installation ou d'un service ; une unité basée sur l'extrant (p. ex. 1 kg de produit, 1 MJ d'énergie) lorsqu'elle compare des produits à leurs alternatives de marché ou étaye une allégation de substitution ; un système d'unités fonctionnelles lorsque les deux fonctions sont co-principales (Part 1 §5.3.2). La D4.2 §3.1 demande pour la LCC une unité double (déchet traité + produit obtenu) lorsque la substitution de produit guide l'étude : les deux livrables divergent, l'outil suit la Part 2 pour l'ACV et signale l'écart.",
      options: {
        unset: "Pas de réponse (unité orientée fonction, D4.1 Part 1)",
        waste_treatment: "La gestion d'un déchet — filières, performance d'une installation ou d'un service (unité basée sur l'intrant)",
        product_substitution: "Des produits face aux alternatives du marché — ce que remplace le produit récupéré (unité basée sur l'extrant)",
        co_primary: "Les deux : le service de traitement et les produits comptent autant (système d'unités fonctionnelles)",
      },
      plain:
        "Sur quoi porte vraiment la comparaison ? Si la question est de savoir comment traiter au mieux un déchet — le brûler, le méthaniser, le composter —, le résultat se compte par tonne de déchet traité. Si la question est de savoir si le produit récupéré vaut mieux que celui qu'il remplace, il se compte par unité de produit. Si les deux comptent autant, on les compte côte à côte.",
    },

    q2dCard: {
      title: 'Scénarios alternatifs (facultatif)',
      help:
        'Toute étude peut comparer des alternatives à sa situation de départ (D4.1 §4.3.3).',
    },

    advancedCard: {
      title: 'Overrides avancés (mode expert)',
      activeKeys_one: '{{count}} clé active',
      activeKeys_other: '{{count}} clés actives',
    },
  },

  flows: {
    q5Note: "Répondez selon l'arrangement actuel — convenu, ou prévu si l'échange n'existe pas encore. C'est une hypothèse de départ, pas un résultat : si l'étude change qui paie qui, revenez le modifier. Choisissez « gratuit / ambigu » quand c'est réellement indécis.",
    emptyHint: 'Aucun flux. Ajoutez-en au moins un pour caractériser la Q5 par-flux.',
    headers: { id: 'ID', name: 'Nom', q5: 'Q5', sellable: 'Vendable à d\'autres ?', sector: 'Secteur (Partie 2)', configuration: "Configuration (Partie 2)" },
    sellable: { unset: '— sans réponse', yes: 'Oui', no: 'Non' },
    sellableHint: 'Si le partenaire ne prenait pas ce flux, le générateur pourrait-il le vendre à quelqu\'un d\'autre à un prix positif ? Oui en fait un coproduit, non un déchet, quel que soit le prix convenu (D4.1 §8.3.3). Facultatif : le résultat signale un désaccord avec Q5.',
    sectorHint: "Choisissez le chapitre de la D4.1 Part 2 de ce qui est échangé, pas de l'entreprise : résidus agricoles et agro-industriels → Agroalimentaire (§4) ; déchets municipaux ou mélangés, biodéchets compris (fraction organique des OMR, déchets alimentaires ménagers) → Valorisation des déchets (§8) ; boues et eaux usées traitées, même réutilisées comme eau → Eaux usées (§6) ; un produit ou vecteur énergétique tiré d'un flux (biométhane, digestat, électricité) → le chapitre de ce flux. Là où §4 et §8 se recoupent pour les biodéchets, l'origine décide (lecture T4.6 de la Part 2 §3.3). Facultatif : le résultat liste les règles du chapitre.",
    sectorNone: '— aucun de ceux-ci',
    configurationHint: "La configuration type du flux dans son chapitre de la Part 2 (D4.1 Part 2 §4.1-§8.1) : le résultat indique le produit conventionnel qu'il remplace. Choisissez d'abord le secteur.",
    configurationNone: "— pas de réponse",
    configurations: {
      agrifood_ad_bioenergy_fertiliser: "Déchets organiques en bioénergie et engrais (méthanisation/compostage)",
      agrifood_feed_bioconversion: "Coproduits agroalimentaires en alimentation animale (bioconversion)",
      agrifood_platform_chemicals: "Résidus agricoles en produits chimiques de base / bioplastiques",
      agrifood_high_value_compounds: "Résidus agro-industriels en composés à haute valeur",
      agrifood_nutrient_recovery: "Récupération de nutriments en amendement / engrais",
      plastics_mechanical_recycling: "Recyclage mécanique (boucle ouverte ou fermée)",
      plastics_chemical_recycling: "Recyclage chimique (thermochimique/dépolymérisation)",
      plastics_reusable_packaging: "Emballages réutilisables (PSS)",
      plastics_biobased_packaging: "Emballages biosourcés / biodégradables",
      plastics_upcycling: "Surcyclage et décontamination pour boucles à haute valeur",
      wastewater_nutrient_recovery: "Récupération de nutriments (P et N) en engrais",
      wastewater_sludge_to_energy: "Eaux usées/boues en énergie (biogaz/cogénération ou épuration)",
      wastewater_sludge_pyrolysis: "Pyrolyse des boues en biochar et vecteurs énergétiques",
      wastewater_water_reuse: "Récupération et réutilisation de l'eau",
      wastewater_screening_srf: "Refus de dégrillage en CSR pour l'industrie",
      wastewater_microalgae: "Bioraffineries de microalgues sur eaux usées",
      textiles_fibre_to_fibre: "Recyclage fibre à fibre (boucle fermée)",
      textiles_downcycling: "Décyclage en non-tissés et composites (boucle ouverte)",
      textiles_chemical_valorisation: "Valorisation chimique en produits biochimiques/monomères",
      textiles_recycled_carbon_fibre: "Fibre de carbone recyclée pour textiles techniques",
      textiles_pss_reuse: "Systèmes produit-service (PSS) et réemploi",
      wv_srf_coprocessing: "OMR/CSR en énergie (co-incinération)",
      wv_biowaste_nutrients_energy: "Biodéchets en nutriments et énergie",
      wv_tailings_construction: "Résidus industriels/stériles en matériaux de construction et métaux",
      wv_weee_urban_mining: "DEEE et mine urbaine",
      wv_plastic_upcycling: "Surcyclage de déchets plastiques (mécanique/thermochimique)",
    },
    namePlaceholder: 'ex. chaleur, CO2',
    addButton: 'Ajouter un flux',
    removeAria: 'Supprimer {{id}}',
    options: {
      a: 'a — A paie B (déchet)',
      b: 'b — Échange gratuit (ambigu)',
      c: 'c — B paie A (co-produit)',
      d: 'd — Interdépendant',
      e: 'e — Agrégé / black-box',
    },
  },

  scenarios: {
    intro:
      "Un scénario fait ici varier les réponses *méthodologiques*, pas le réseau physique : il hérite de Q1–Q7 de la référence et ne diffère que par le dict d'overrides. Comparer où va un flux, sur quelle distance ou à quel prix est une comparaison de réseau — ces variantes se dessinent dans l'éditeur de réseau, et le moteur ne les compare pas encore.",
    emptyHint: 'Aucun scénario alternatif.',
    headers: { id: 'ID', label: 'Étiquette' },
    labelPlaceholder: 'ex. Expansion future / TRL9 ramp-up',
    addButton: 'Ajouter un scénario',
    removeAria: 'Supprimer {{id}}',
  },

  advanced: {
    intro:
      "Overrides mode expert. Chaque clé est lue par le moteur via dict.get ; les clés manquantes signifient « utilise le défaut ». Les valeurs sont coercées en true/false/nombre/chaîne selon le besoin.",
    headers: { key: 'Clé', value: 'Valeur', hint: 'Astuce', custom: 'custom' },
    addCustom: 'Ajouter une clé custom',
    clearAria: 'Effacer {{key}}',
    removeAria: 'Supprimer {{key}}',
    hints: {
      slca_framework_override: "Mettre à 'absolute' pour tester L1 BLOCK 2 (avec Q3.soc=true)",
      asset_lifetime: 'Années (ancien ; utilisé si la durée de vie de Q8 est vide) ; un horizon au-delà du seuil (15 par défaut) ajoute l\'arrière-plan futur à l\'ACV et à l\'ACC (lca_mc_21, lcc_hc_23, CIR-01)',
      future_background_threshold_years:
        'Années. L\'horizon d\'étude au-delà duquel l\'ACV et l\'ACC exigent un arrière-plan futur (lca_mc_21, lcc_hc_23, CIR-01). Par défaut 15, le chiffre que le D4.2 §9.3 donne sans source ; si vous le changez, justifiez-le dans la charte méthodologique',
      transport_sensitive: 'Booléen ; true active CIR-03',
      network_nodes: 'Entier ; ≥3 (avec Q1=B + interdependent_flows) active CIR-04',
      interdependent_flows: 'Booléen ; true (avec Q1=B + network_nodes≥3) active CIR-04',
      frontier_categories_active: 'Booléen ; true active CIR-06',
      is_specific_capital_goods: 'Booléen ; true active IR-13 / B-06 / CIR-08',
      multi_actor: 'Booléen ; true (avec Q1∈{B,C}) active FU-02',
    },
  },

  narrative: {
    ilcd: {
      'ILCD Situation A': {
        title: 'Aide à la décision aux conséquences limitées (situation ILCD A)',
        short: 'Aide à la décision au niveau micro : l\'échange est trop petit pour modifier le système d\'arrière-plan. Modélisation attributionnelle, avec substitution sur le mix de marché moyen.',
        detail: 'The exchange affects the actors involved, not what the wider economy produces or how. You therefore model with average, accounting-style data, and represent what the symbiosis displaces by substituting the average market mix — the national grid mix for electricity, average virgin production for a material. D4.1 warns explicitly against reaching for consequential modelling merely because a decision is being taken.',
      },
      'ILCD Situation B': {
        title: 'Aide à la décision aux conséquences structurelles (situation ILCD B)',
        short: 'Aide à la décision au niveau méso/macro : la décision provoque un changement structurel de l\'arrière-plan, donc modélisation conséquentielle sur la technologie marginale. Le D4.1 demande de prouver cette échelle avant de la choisir.',
        detail: 'The decision is large enough to shift installed capacity or the output of a specific technology. Modelling goes consequential, and what the symbiosis displaces is the marginal technology, identified through a market analysis rather than taken as the average mix. The burden of proof is on you: this route has to be demonstrated, not assumed.',
      },
      'ILCD Situation C1': {
        title: 'Documenter un réseau existant (situation ILCD C1)',
        short: 'Comptabilité avec interactions — documenter ce qu\'un réseau existant apporte à l\'économie au sens large. Substitution sur le mix de marché moyen, comme en Situation A.',
        detail: 'You are documenting a network that exists rather than supporting a decision, so the study is descriptive. But since the point is to show what the network gives the wider economy, multifunctionality is still resolved by substitution at the average market mix — operationally the same rule as Situation A.',
      },
      'ILCD Situation C2': {
        title: 'Comptabilité stricte d’une seule entreprise (situation ILCD C2)',
        short: 'Comptabilité stricte pour un seul partenaire isolé : allocation, sans crédits de substitution.',
        detail: 'Strict accounting for a single partner on its own, typically corporate reporting. Multifunctionality is resolved by allocation, and no credit is claimed for what the symbiosis displaces elsewhere: the number describes that partner\'s share of the burdens, not the benefit the network produces.',
      },
    },
    lcc: {
      'deactivated': {
        short: 'Pas d\'analyse économique — la dimension économique est désactivée en Q3.',
        detail: 'Q3 has no economic dimension selected, so the engine configures no costing at all. If the case needs a business case — and for a symbiosis that has to be signed by several firms it usually does — go back to Q3 and switch the economic dimension on.',
      },
      'C+E': {
        short: 'LCC conventionnel (les flux de trésorerie réels de l\'entreprise) plus LCC environnemental (la chaîne de valeur, sur les mêmes frontières que l\'ACV).',
        detail: 'Two views run together. The conventional LCC answers whether it pays for the individual firm: real cash flows, taxes and fees as costs, subsidies as reductions. The environmental LCC widens the boundary to every actor in the life cycle and is kept consistent with the parallel LCA, so the two can be read side by side. Watch for double counting: a carbon or landfill tax already in the cash flows must not reappear as a monetised externality.',
      },
      'C+E+S': {
        short: 'LCC conventionnel et environnemental plus LCC sociétal : taxes et subventions ajustées par le Net Tax Factor, impacts environnementaux monétisés.',
        detail: 'On top of the firm and value-chain views comes the welfare view. Taxes and subsidies are transfers inside society rather than real costs to it, so they are excluded or converted into shadow prices through the Net Tax Factor, and the environmental impacts from the parallel LCA are monetised. This is the configuration a public decision needs, which is why a public or policy objective brings it in.',
      },
      'C-LCC': {
        short: 'LCC conventionnel uniquement — la perspective de l\'entreprise, équivalente à une analyse du coût total de possession.',
        detail: 'Only the firm\'s own perspective. Every policy instrument is a real cash flow: taxes and fees are costs, subsidies reduce capex or opex. It is the right frame for corporate reporting, and it deliberately says nothing about value-chain or societal effects — claiming those would overstate what a single-actor account can support.',
      },
      'C+N': {
        short: 'LCC conventionnel pour chaque partenaire, consolidé au niveau du réseau. Pas de LCC environnemental : le cas n\'a pas d\'ACV avec laquelle rester cohérent.',
        detail: 'D\'abord les flux de trésorerie réels de chaque entreprise, puis les mêmes comptes additionnés sur le réseau, où les paiements entre partenaires s\'annulent. Le LCC environnemental est laissé de côté car le D4.2 le construit sur la frontière d\'une ACV parallèle, et le cas n\'évalue pas la dimension environnementale. Activez la dimension environnementale en Q3 si l\'étude a besoin de la vue chaîne de valeur.',
      },
      'C+N+S': {
        short: 'LCC conventionnel par partenaire et pour le réseau, plus LCC sociétal avec le Net Tax Factor. Sans ACV, les impacts environnementaux ne sont pas monétisés.',
        detail: 'Les comptes de l\'entreprise et du réseau comme ci-dessus, plus la vue du bien-être dont une décision publique a besoin : taxes et subventions converties par le Net Tax Factor, un taux d\'actualisation social et une frontière qui va jusqu\'à la fin de vie. Il manque la monétisation des impacts environnementaux, qui exige les résultats d\'une ACV parallèle : activez la dimension environnementale en Q3 pour l\'ajouter.',
      },
    },
    slca: {
      'active': {
        short: 'S-ACV active : indicateurs sociaux par groupe de parties prenantes.',
        detail: 'The social dimension is on. Each stakeholder group — workers, consumers, local communities, value-chain actors — is mapped to the processes it is affected by, and from there to impact subcategories and indicators. The mapping is only as good as the engagement behind it, so talking to the groups involved is part of the data collection, not an optional extra.',
      },
      'deactivated': {
        short: 'S-ACV non activée — la dimension sociale est désactivée en Q3.',
        detail: 'Q3 has no social dimension selected, so no stakeholder mapping and no social indicator are configured. Switch it on in Q3 if the case has to say anything about workers or local communities — which is usually the case when a symbiosis is presented to a municipality or a community.',
      },
    },
  },

  result: {
    notes: { title: 'Remarques sur vos réponses' },
    engineNotes: {
      q9_unanswered: "Q9 est sans réponse : la situation ILCD (situation {{situation}}) est donc déduite de Q1, comme pour les cas enregistrés avant l'existence de Q9. Répondez à Q9 : le tableau 1 de la D4.1 fixe la situation selon la décision et l'ampleur de ses conséquences, pas selon le sujet de l'étude.",
      q10_unanswered: {
        yes: "Q10 est sans réponse : le fait que l'étude serve un objectif public est donc déduit de Q1 : l'ACC sociétal est ajouté, comme pour les cas enregistrés avant l'existence de Q10. Répondez à Q10 : la D4.2 §2.3 ajoute l'ACC sociétal pour un objectif de politique publique ou d'aménagement ou pour un décideur public, quel que soit le sujet de l'étude.",
        no: "Q10 est sans réponse : le fait que l'étude serve un objectif public est donc déduit de Q1 : l'ACC sociétal n'est pas ajouté, comme pour les cas enregistrés avant l'existence de Q10. Répondez à Q10 : la D4.2 §2.3 ajoute l'ACC sociétal pour un objectif de politique publique ou d'aménagement ou pour un décideur public, quel que soit le sujet de l'étude.",
      },
      structural_without_screening: "Q9 indique des effets structurels, mais le criblage du marché n'est pas documenté : l'étude est traitée en Situation ILCD A, et la Situation B doit être testée en sensibilité (D4.1 §4.3.4, §11.3.1).",
      structural_screening_missing: "La Situation B exige la preuve que le changement déplace environ 1 % ou plus des nouvelles capacités du marché concerné (D4.1 §11.3.1) ; documentez-la, sinon l'étude est en Situation A avec B en sensibilité (D4.1 §4.3.4).",
      decision_scale_vs_q1: {
        c_micro: "Q1 (préfaisabilité sectorielle) implique d'ordinaire des conséquences à l'échelle structurelle ; vous avez répondu conséquences limitées, l'étude est donc traitée en Situation ILCD A. D4.1 §4.3.4 : ne pas choisir l'ACV conséquentielle au seul motif qu'une décision est prise.",
        e_micro: "Q1=E (suivi) n'implique aucune décision ; vous avez répondu que l'étude appuie une décision aux conséquences limitées, elle est donc traitée en Situation ILCD A.",
        e_structural: "Q1=E (suivi) n'implique aucune décision ; vous avez répondu que l'étude appuie une décision aux conséquences structurelles, elle est donc traitée en Situation ILCD B.",
      },
      q1_d_not_corporate: "Q1=D décrit le reporting de durabilité d'une entreprise, mais Q9 indique que l'étude n'est pas un rapport d'entreprise ; la situation ILCD suit Q9. Le reporting d'entreprise strict (allocation, sans crédits) est la Situation ILCD C2 (D4.1 §7.2.3).",
      documentation_vs_ex_ante: 'La situation ILCD C documente des échanges qui ont déjà lieu, mais Q2 indique qu\'ils n\'ont pas encore lieu. Vérifiez que la situation est bien celle que vous visez.',
      c2_keeps_c_lcc: "Le reporting strict d'une seule entreprise (Situation ILCD C2) conserve le coût au niveau de l'entreprise (C-LCC seul) quelle que soit la réponse à Q10 : c'est un choix de conception T4.6, une seule entreprise n'ayant pas de niveau réseau.",
      policy_no_but_q1_c: "Q1=C (préfaisabilité sectorielle) sert d'ordinaire une politique publique ; vous avez répondu que non, le coût sociétal (S-LCC, net tax factor, taux d'actualisation social) n'est donc pas ajouté.",
      lcc_without_lca: {
        plain: "Q3 n'inclut pas la dimension environnementale, il n'y a donc pas d'ACV parallèle : le coût est la LCC conventionnelle de chaque partenaire, consolidée au niveau du réseau (D4.2 §4.1), sans LCC environnementale, que la D4.2 construit sur la frontière de l'ACV.",
        policy: "Q3 n'inclut pas la dimension environnementale, il n'y a donc pas d'ACV parallèle : le coût est la LCC conventionnelle de chaque partenaire, consolidée au niveau du réseau (D4.2 §4.1), sans LCC environnementale, que la D4.2 construit sur la frontière de l'ACV. La LCC sociétale conserve le net tax factor et le taux d'actualisation social, mais sans résultats d'ACV les externalités ne peuvent pas être monétisées (D4.2 §11.2).",
      },
      c2_allocation_over_pef: "Le reporting strict d'une seule entreprise (Situation ILCD C2) utilise l'allocation sans crédits de substitution (D4.1 §7.2.3) ; la Circular Footprint Formula de la PEF demandée par Q4=D ne s'applique donc pas : la CFF est une méthode produit. Si l'étude est une empreinte de produit et non un rapport d'entreprise, revoyez Q9.",
      slca_alone: "Q3 ne sélectionne que la dimension sociale. La D4.3 §3.1 construit l'ACV sociale sur l'unité fonctionnelle et les frontières d'une ACV ou d'une LCC ; si aucune n'est sélectionnée, documentez l'unité de référence et la frontière dans la charte méthodologique.",
      flow_sellable_but_waste: "Flux « {{flow}} » : Q5 indique que le producteur paie pour s'en débarrasser (déchet), mais un tiers le paierait. D4.1 §8.3.3 et §8.3.6 étape 1 : un flux ayant une valeur de marché positive et indépendante est un coproduit, et sa charge amont est partagée (substitution ou allocation), pas coupée. Vérifiez Q5 pour ce flux.",
      flow_price_without_market: "Flux « {{flow}} » : Q5 indique que le destinataire le paie (coproduit), mais aucun tiers ne le paierait. D4.1 §8.3.3 : sans marché indépendant, le prix est une redevance administrative et le flux est un déchet, à charge nulle à partir du point où il atteint pour la première fois une valeur non négative (§8.3.6 étape 4). L'exception est un producteur qui modifie son procédé pour le partenaire (Q5 = d).",
      flow_freedom_to_act_settles: {
        co_product: "Flux « {{flow}} » : Q5 laisse ouvert qui paie qui ; la réponse Freedom-to-Act (D4.1 §8.3.3) le lit comme un coproduit (§8.3.2, charge partagée).",
        waste: "Flux « {{flow}} » : Q5 laisse ouvert qui paie qui ; la réponse Freedom-to-Act (D4.1 §8.3.3) le lit comme un déchet (charge nulle à partir du point où il atteint pour la première fois une valeur non négative, §8.3.6 étape 4).",
      },
      flow_part2_chapter: "Flux « {{flow}} » : les règles sectorielles de la D4.1 Part 2 {{chapter}} s'y appliquent ; elles figurent sous Règles sectorielles.",
      case_sector_without_flow: "Le secteur du cas relève de la D4.1 Part 2 {{chapter}}, mais aucun flux ne déclare ce chapitre : ses règles sectorielles ne sont donc pas listées. Les chapitres suivent ce qui est échangé : déclarez le secteur de la Part 2 de chaque flux dans le tableau des flux.",
      flow_configuration_unknown: "Flux « {{flow}} » : la configuration « {{configuration}} » ne fait pas partie de la D4.1 Part 2.",
      flow_configuration_other_chapter: "Flux « {{flow}} » : sa configuration relève de {{chapter}}, pas du chapitre déclaré {{declared}} ; les règles des deux chapitres sont listées.",
    },
    sectorChapters: { '§4': "§4 Agroalimentaire et bioraffineries", '§5': "§5 Plastiques et emballages", '§6': "§6 Eaux usées et bio-usines", '§7': "§7 Textile et textiles techniques", '§8': "§8 Valorisation des déchets" },
    sectorRules: {
      title: 'Règles sectorielles (D4.1 Part 2)',
      lead: "Les règles que la D4.1 Part 2 donne pour les secteurs touchés par votre cas. L'outil ne les applique pas à votre place : documentez dans l'étude comment chacune a été respectée.",
      activatedBy: 'S’appliquent en raison de : {{reasons}}',
      byFlow: 'le flux « {{name}} »',
      byCaseSector: 'le secteur du cas (Q6a)',
      configurationLine: "Flux « {{flow}} » — {{configuration}} : le produit conventionnel qu'il remplace est {{substitutes}}.",
      c2NoCredit: "Situation C2 : aucun crédit de substitution n'est appliqué (D4.1 §7.2.3) ; le produit ne fait que décrire la configuration.",
      count: '{{count}} règles',
      strength: { must: 'obligatoire', should: 'recommandé', descriptive: 'pratique' },
    },
    verdict: {
      moreInfo: 'En savoir plus sur cette configuration',
    },
    next: {
      obligations: "{{count}} pratiques méthodologiques concernent vos réponses. Elles sont listées, avec ce qui les a déclenchées, dans le Data Collection File.",
      title: 'Que faire maintenant',
      lead:
        "Pratiques méthodologiques rendues obligatoires par vos réponses, plus les décisions encore ouvertes. Chacune indique pourquoi elle concerne votre cas.",
      provenance:
        "Les intitulés des règles et des points de décision sont traduits depuis la table anglaise du moteur. Le code à côté de chaque élément — IR-01, CDP-02 — est la référence qui ne change pas d'une langue à l'autre, et le nom anglais reste à côté.",
      allClear:
        "Aucune obligation méthodologique ne s'applique à ces réponses et aucun point de décision critique n'est apparu. Étape suivante : collecter les données d'inventaire.",
      ctaHint: 'Le Data Collection File est calibré sur cette configuration : il ne demande que ce dont votre cas a besoin.',
    },
    actionKind: {
      block: 'Bloquant',
      obligation: 'À documenter',
      decision: 'À décider',
    },
    severity: {
      HIGH: 'Élevée',
      MEDIUM: 'Moyenne',
      LOW: 'Faible',
    },
    action: {
      appliesToCase: "S'applique à ce cas.",
      resolution: "Comment cela se résout",
      why: 'Pourquoi cela vous concerne',
      todo: "Ce qu'il faut documenter",
    },
    technical: {
      title: 'Détail technique (sortie du moteur)',
      lead: 'Tout ce que le pipeline a produit, pour revue et traçabilité.',
    },
    title: 'Sortie du moteur',
    summary: {
      ilcdSituation: 'Situation ILCD',
      lccType: 'Type LCC',
      slca: 'S-LCA',
      activatedNodes: 'Nœuds activés',
      l1Blocks: 'BLOCK L1 déclenchés',
      l2Violations: "Échecs d'assertion L2 (diagnostic)",
      l3Cdps: 'CDP L3 émergés',
      extended: '(étendu)',
    },
    blocked: {
      title: 'Pipeline bloquée à L1',
      desc: "Le moteur s'est arrêté à L1. Aucune logique d'activation, L2 ou L3 n'a tourné. Résolvez la/les contrainte(s) bloquante(s) ci-dessous et ré-exécutez :",
    },
    toggleShow: 'Afficher le raisonnement',
    toggleHide: 'Masquer le raisonnement',
    rawJson: 'Réponse JSON brute',
    actions: {
      adjust: 'Modifier les réponses',
      startFresh: 'Recommencer (tout effacer)',
      downloadJson: 'Télécharger le cas (.json)',
      downloadReport: 'Télécharger le rapport (.docx)',
      downloadingReport: 'Génération du rapport…',
      reportError: 'Échec de la génération du rapport',
      runScenarios: 'Exécuter les scénarios',
      runningScenarios: 'Exécution des scénarios…',
    },
    confirmStartFresh: 'Effacer le cas actuel et en démarrer un nouveau ? Opération irréversible.',
    noResult: { title: 'Aucun résultat', desc: 'Soumettez un questionnaire pour voir la sortie du moteur ici.', cta: 'Ouvrir le questionnaire' },
    error: { title: 'Erreur de pipeline', back: 'Retour au questionnaire' },
  },

  scenariosResult: {
    title: 'Comparaison de scénarios',
    empty: 'Pas encore de comparaison de scénarios. Dans le questionnaire, définissez un ou plusieurs scénarios alternatifs, puis cliquez sur « Exécuter les scénarios » sur la page de résultat.',
    description: 'Pipeline exécutée pour la baseline + {{n}} scénarios alternatifs. Différences mises en évidence vs baseline.',
    backToResult: 'Retour au résultat unique',
    columns: {
      scenario: 'Scénario',
      ilcd: 'ILCD',
      lccType: 'Type LCC',
      slca: 'S-LCA',
      activated: 'Activés',
      blocks: 'BLOCK L1',
      violations: 'Violations L2',
      cdps: 'CDPs L3',
    },
    baselineLabel: 'Baseline',
    diffSuffix: '(diff)',
    overrideHelp: 'Chaque scénario hérite Q1-Q7 de la baseline ; remplissez overrides (dict JSON) par scénario pour différer. Overrides vides → même cas que la baseline.',
    overridesPlaceholder: 'ex. {"q1": "C"} ou {"q3": {"env": true, "eco": true}}',
    overridesParseError: 'Les overrides doivent être du JSON valide pour {{id}}',
  },


  reasoning: {
    activatedNodes: 'Nœuds activés ({{count}})',
    pillarConfigs: 'Configurations par pillar',
    noPillarValues: 'Aucune valeur de pillar écrite.',
    l2Violations: 'Violations de règles L2 ({{count}})',
    noViolations: 'Aucune violation.',
    l3Cdps: 'Critical Decision Points L3 ({{count}})',
    noCdps: 'Aucun CDP émergé.',
    pillarKeys: '{{count}} clés',
    resolution: 'Résolution',
    filterPlaceholder: 'Filtrer par ID de nœud…',
    noMatch: 'Aucun nœud ne correspond au filtre.',
    showingFiltered: '{{shown}} sur {{total}} affichés',
  },

  loading: { default: 'Exécution de la pipeline…' },

  shortcuts: {
    title: 'Raccourcis clavier',
    closeHint: 'Appuyez sur {{esc}} ou cliquez à l\'extérieur pour fermer.',
    items: {
      help: "Afficher cette aide raccourcis",
      run: 'Calculer la configuration',
      runContext: 'Questionnaire',
      toggleReasoning: 'Afficher/masquer le panneau reasoning',
      toggleReasoningContext: 'Résultat',
      print: 'Imprimer la page de résultat',
      printContext: 'Résultat',
      esc: 'Fermer cette boîte de dialogue',
    },
  },

  preset: {
    title: 'Charger un cas publié comme preset',
    help:
      '13 fixtures de l\'échantillon de validation (12 papers + Leiva Escombreras / Frövi). Charge les Q1-Q7 + Q5 par-flux dans le questionnaire pour inspecter et exécuter le moteur end-to-end.',
    loadButton: 'Charger preset',
    rationaleToggle: 'Pourquoi ces réponses ? (rationale de compilation)',
  },

  toast: {
    pipelineCompleted: 'Pipeline complétée en {{ms}} ms — {{situation}}',
    pipelineError: 'Erreur pipeline — {{detail}}',
    scenariosCompleted: '{{n}} scénarios exécutés',
    scenariosError: 'Exécution des scénarios échouée — {{detail}}',
  },

  language: {
    label: 'Langue',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },

  auth: {
    title: 'Se connecter',
    subtitle: 'Facultatif pour consulter les cas legacy / publics. Requis pour créer des cas privés que vous seul pouvez modifier.',
    tabLogin: 'Se connecter',
    tabRegister: 'Créer un compte',
    emailLabel: 'Email',
    passwordLabel: 'Mot de passe',
    passwordHelp: 'Au moins 8 caractères.',
    submitLogin: 'Se connecter',
    submitRegister: 'Créer un compte',
    submitting: 'Envoi…',
    skipLink: 'Continuer sans se connecter',
    signIn: 'Se connecter',
    logout: 'Se déconnecter',
    errors: {
      registrationClosed: 'L\'inscription est fermée sur cette instance. Demandez un compte à l\'administrateur.',
      emailTaken: 'Un compte existe déjà avec cet email. Essayez de vous connecter.',
      invalidCredentials: 'Email ou mot de passe incorrect.',
    },
  },

  scoringPending: {
    title: "En attente des résultats chiffrés",
    body:
      "Les résultats quantitatifs LCSA de ce cas n'ont pas encore été livrés. À leur arrivée, les indicateurs environnementaux, économiques et sociaux apparaîtront ici.",
    lastChecked: "Dernière vérification : {{date}}",
  },

  compliance: {
    status: {
      ok: "oui",
      no: "non déclaré",
      pending: "en attente",
      na: "sans objet",
    },
  },
  stakeholder: {
    audience: {
      industry: {
        whatYouSee:
          "Ce que cette page vous dit aujourd'hui : quelle méthodologie l'évaluation suivra, et donc quelles données vous seront demandées. La demande elle-même, c'est le Data Collection File.",
        whenScoring:
          "À l'arrivée des résultats chiffrés, vous verrez les indicateurs environnementaux et économiques du cas, de quoi juger si l'échange est rentable.",
      },
      community: {
        whatYouSee:
          "Ce que cette page vous dit aujourd'hui : quels flux les entreprises échangent, et si cette étude examine ou non les effets sociaux.",
        whenScoring:
          "À l'arrivée des résultats chiffrés, vous verrez les indicateurs sociaux — travailleurs, communauté locale — et les indicateurs environnementaux, chacun avec le groupe qu'il concerne.",
      },
      authority: {
        whatYouSee:
          "Ce que cette page vous dit aujourd'hui : comment l'évaluation est cadrée, quels signaux de conformité le cas déclare, et à quel point les interactions clés sont concentrées.",
        whenScoring:
          "À l'arrivée des résultats chiffrés, vous verrez les valeurs environnementales et, lorsque l'étude les inclut, les coûts sociétaux — les deux piliers d'une décision publique.",
        scope: "Concentration des interactions clés : {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "Ce que cette page vous dit aujourd'hui : quels matériaux cette symbiose remet en usage, et si les effets environnementaux et sociaux sont examinés.",
        whenScoring:
          "À l'arrivée des résultats chiffrés, vous verrez les indicateurs environnementaux et sociaux de la filière derrière le produit.",
        productCaveat:
          "Cette évaluation décrit l'échange entre les entreprises, pas le produit final que vous achetez : l'outil ne demande jamais quel est le produit.",
      },
    },
    noVerdict: "Aucune configuration dérivée pour ce cas.",
    notAssessed: {
      social: "Cette étude n'évalue pas les impacts sociaux : la dimension sociale a été désactivée à la configuration du cas. Demandez à l'analyste de l'activer si les travailleurs ou la communauté locale font partie de la question.",
      economic: "Cette étude n'évalue pas les coûts : la dimension économique a été désactivée à la configuration du cas.",
    },
    flowsLine_one: "{{count}} flux échangé : {{names}}.",
    flowsLine_other: "{{count}} flux échangés : {{names}}.",
    navLink: 'Rapport parties prenantes',
    title: 'Rapport parties prenantes',
    subtitle:
      'Vue multi-parties prenantes du cas. Changez d\'onglet pour voir les informations adaptées à chaque public le long de la chaîne de valeur bio-sourcée.',
    openButton: 'Ouvrir le rapport',
    backToResult: 'Retour au résultat',
    openDcf: 'Ouvrir Data Collection File',
    loadingScoring: 'Chargement des données de notation…',
    tabs: {
      industry: 'Industrie',
      community: 'Communauté',
      authority: 'Autorité locale',
      'end-user': 'Utilisateur final',
    },
    framing: {
      industry:
        'Vue technique complète de la configuration méthodologique et du scoring quantitatif, produit hors de cet outil par le partenaire SYMBA CIRCE.',
      community:
        'Vue d\'impact local axée sur la qualité environnementale et les bénéfices sociaux pour le territoire.',
      authority:
        'Vue réglementaire et de politique : configuration méthodologique, statut de relecture, alignement EU PEF.',
      'end-user':
        'Vue résumée pour les utilisateurs finaux des produits issus de la symbiose.',
    },
    verdictTitle: 'Configuration méthodologique',
    labels: {
      ilcd: 'Situation ILCD',
      lcc: 'Type LCC',
      slca: 'Activation S-LCA',
    },
    scoringTitle: 'Scoring (CIRCE)',
    scoringPendingTitle: 'Données de scoring pas encore disponibles',
    scoringPendingBody:
      'Le scoring LCSA produit par CIRCE pour ce cas n\'a pas encore été ingéré. Quand CIRCE livrera la charge utile quantitative, les indicateurs apparaîtront ici groupés par pertinence pour les parties prenantes.',
    scoringEmpty: 'Aucun indicateur pertinent pour cette partie prenante.',
    indicatorPending: 'en attente',
    engineDetailsTitle: 'Détails du pipeline',
    activatedNodesCount_one: '{{count}} nœud méthodologique activé',
    activatedNodesCount_other: '{{count}} nœuds méthodologiques activés',
    obligations_one: "{{count}} pratique méthodologique à documenter",
    obligations_other: "{{count}} pratiques méthodologiques à documenter",
    cdpFlagsCount_one: '{{count}} tension inter-dimensions',
    cdpFlagsCount_other: '{{count}} tensions inter-dimensions',
    complianceTitle: 'Signaux de conformité',
    compliance: {
      peerReview: 'Relecture indépendante par les pairs : {{status}}',
      pef: 'Alignement EU PEF (Q4=D) : {{status}}',
      publicClaim: 'Revendication publique (Q4=C) : {{status}}',
    },
  },

  aggregate: {
    navLink: 'Tableau de bord régional',
    title: 'Tableau de bord régional / sectoriel',
    subtitle:
      'Répartition de tous les cas sauvegardés par situation ILCD, structure LCC, secteur et concentration des interactions clés. Pour autorités locales et analystes politiques.',
    openButton: 'Ouvrir le tableau de bord',
    backToCases: 'Retour aux cas',
    loading: 'Chargement des données agrégées…',
    errorTitle: 'Échec du chargement des données agrégées',
    errorNoData: 'Le serveur n\'a pas renvoyé de données.',
    totalLabel: 'Total des cas sauvegardés',
    noData: '(aucune donnée)',
    tableKey: 'Valeur',
    tableCount: 'Nombre',
    breakdownTitle: {
      byLccType: 'Par structure LCC',
      bySector: 'Par secteur (Q6a)',
      byScope: 'Par concentration des interactions (Q7)',
      byIlcd: 'Par situation ILCD',
    },
  },

  obligations: {
    empty: "Rien à documenter pour ce cas.",
    lead:
      "{{total}} éléments concernent ce cas : {{mandates}} mandats méthodologiques et {{rules}} règles inter-méthodes déclenchées par vos réponses. Chacun est un engagement à documenter dans le rapport ACV-D.",
    because: "S'applique parce que :",
    notApplicable: "Ne s'applique pas ici : {{fields}} — cette méthode est désactivée en Q3.",
    origin: {
      mandate: "Mandat",
      rule: "Règle inter-méthodes",
    },
  },
  dcf: {
    noCase: { title: 'Aucun cas pour l\'instant', desc: 'Le Data Collection File se construit à partir de votre évaluation : remplissez d\'abord le questionnaire (ou ouvrez un cas enregistré), puis revenez ici.', cta: 'Ouvrir le questionnaire' },
    derivedField: "rempli par le moteur",
    obligationsTitle: "Choix méthodologiques à documenter",
    navLink: 'Collecte de données',
    title: 'Data Collection File',
    subtitle:
      'Calibré sur la configuration dérivée. Téléchargez le fichier Excel pour collecter les données d\'inventaire avec les partenaires de la symbiose, puis revenez pour le rapport final.',
    loading: 'Composition du Data Collection File…',
    errorTitle: 'Échec de la génération du Data Collection File',
    errorNoPayload: 'Le serveur n\'a pas renvoyé de payload.',
    backToResult: 'Retour au résultat',
    networkTitle: 'Diagramme de réseau',
    downloadXlsx: 'Télécharger Excel (.xlsx)',
    downloadingXlsx: 'Préparation Excel…',
    downloadDocx: 'Télécharger le document (.docx)',
    downloadingDocx: 'Préparation document…',
    downloadError: 'Échec du téléchargement',
    footerNote:
      'Le Data Collection File est une feuille de collecte prête à l\'export. Remplissez les lignes vides hors ligne (ou distribuez-le aux partenaires du réseau) et restituez les données à l\'analyste responsable de l\'LCSA.',
    openButton: 'Ouvrir Data Collection File',
    tabOverview: "Vue d'ensemble",
    tabNetworkBuilder: 'Éditeur de réseau',
  },

  networkDiagram: {
    counts: '{{actors}} acteurs · {{flows}} flux',
    placeholder:
      "Aperçu seulement — ceci est un substitut construit à partir des flux déclarés dans le questionnaire. Dessinez le vrai réseau dans l'onglet Éditeur de réseau et il apparaîtra ici, dans l'Excel et dans le rapport.",
  },

  networkBuilder: {
    loadExample: 'Charger un exemple',
    exampleReplaceConfirm:
      "Cela remplace le réseau actuellement sur le canevas par l'exemple. Continuer ?",
    whyAsked: 'Demandé parce que :',
    hint: {
      step1: "Ajoutez un acteur par participant à la symbiose — une usine, un service public, une commune.",
      step2: "Faites glisser du bord d'un nœud vers un autre pour les relier : cette flèche est une ligne de la matrice des flux.",
      step3: 'Sélectionnez un nœud ou une flèche et remplissez ses champs dans le panneau latéral. Seuls les champs utiles à votre configuration sont affichés.',
      dismiss: "J'ai compris",
    },
    empty: {
      title: "Rien n'a encore été dessiné",
      body: "Ajoutez votre premier acteur, ou chargez un exemple avec trois acteurs et deux flux pour voir comment un réseau se construit.",
    },
    example: {
      producer: 'Usine productrice',
      consumer: 'Usine réceptrice',
      facilitator: 'Gestionnaire du parc industriel',
      flow: 'Flux exemple',
    },
    title: 'Éditeur de réseau',
    subtitle:
      "Dessinez le réseau de symbiose : chaque nœud est un acteur, chaque flèche une ligne de la matrice des flux. Ce que vous dessinez ici alimente l'Excel et le rapport.",
    addActor: 'Ajouter un acteur',
    actor: 'Acteur',
    noRole: 'rôle non défini',
    save: 'Enregistrer le réseau',
    saving: 'Enregistrement…',
    synced: 'Enregistré sur le serveur',
    unsavedChanges: 'Modifications non enregistrées',
    unsavedCase: 'Brouillon local — enregistrez le cas pour synchroniser',
    saveCaseFirst:
      "Ce cas n'est pas encore enregistré sur le serveur. Vous pouvez dessiner le réseau maintenant ; enregistrez le cas depuis la page de résultat pour le conserver.",
    missingRequired_one: '{{count}} champ obligatoire encore vide',
    missingRequired_other: '{{count}} champs obligatoires encore vides',
    selectHint: 'Sélectionnez un acteur ou un flux pour modifier ses champs.',
    removeRow: 'Supprimer',
    unwiredTitle: 'Flux pas encore dessinés',
    unwiredHint:
      'Ces flux proviennent de vos réponses Q5. Reliez deux acteurs sur le canevas pour raccorder le suivant.',
  },

  cases: {
    navLink: 'Mes cas',
    title: 'Mes cas',
    intro: 'Cas sauvegardés sur le serveur. Chargez pour remplir le questionnaire, ou supprimez pour retirer définitivement.',
    empty: 'Aucun cas sauvegardé. Sauvegardez un cas depuis le questionnaire ou la page de résultat.',
    columns: {
      name: 'Nom',
      situation: 'Situation ILCD',
      updated: 'Mis à jour',
    },
    loadButton: 'Charger',
    deleteButton: 'Supprimer',
    confirmDelete: 'Supprimer "{{name}}" définitivement ? Opération irréversible.',
    saveButton: 'Sauvegarder',
    saveAsButton: 'Sauvegarder comme nouveau…',
    saveTitle: 'Sauvegarder le cas',
    namePlaceholder: 'Nom de mon cas',
    saveDialog: 'Sauvegarder le cas actuel sur le serveur. Choisissez un nom pour l\'identifier plus tard.',
    saving: 'Sauvegarde…',
    saveError: 'Échec de la sauvegarde — {{detail}}',
    saveSuccess: 'Sauvegardé sous "{{name}}"',
    loadError: 'Échec du chargement — {{detail}}',
    deleteError: 'Échec de la suppression — {{detail}}',
  },
}

export default fr
