// Français. Termes méthodologiques LCA/LCC/S-LCA + sigles ILCD/PEF/CSRD/MFCA
// /CBA/TEA/IS-01..05 conservés (normatifs).

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
  },

  layout: {
    brand: 'SYMBA T4.6',
    about: 'À propos',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Appuyez sur {{key}} pour les raccourcis',
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
      "Répondez à sept questions sur votre cas d'étude de symbiose industrielle. Le moteur de décision dérive le pathway IS terminal (IS-01..IS-05) et une configuration méthodologique complète à partir des 186 nœuds Phase 1 des livrables D4.1, D4.2 et D4.3, plus les 40 règles cross-method.",
    startButton: 'Démarrer une nouvelle évaluation',
  },

  about: {
    title: 'À propos',
    p1:
      "SYMBA T4.6 — IS Assessment App est l'outil opérationnel du WP4 / T4.6 du projet SYMBA Horizon Europe. Il implémente le moteur de décision à nœuds atomiques Phase 1 dérivé des livrables D4.1 (LCA), D4.2 (LCC) et D4.3 (S-LCA), classifiant un cas d'étude de symbiose industrielle dans l'un des cinq pathways IS terminaux (IS-01..IS-05) et retournant une configuration méthodologique complète pour LCA, LCC et S-LCA.",
    p2:
      "Les 7 questions utilisateur (Q1-Q7) déclenchent l'activation des 186 nœuds Phase 1 plus 40 règles cross-method (18 IR + 10 CIR + 5 FU + 7 B). L'enforcement L3 au moment du reporting (IR-04 + IR-10) plus 12 Critical Decision Points font émerger les tensions cross-method.",
    p3:
      'Cette build MVP relie le questionnaire à POST /api/pipeline/run. Affichage de la configuration par pillar, overrides avancés et panneau « Show reasoning » sont tous opérationnels.',
  },

  error: {
    title: "Quelque chose s'est mal passé",
    backHome: "Retour à l'accueil",
    fallback: 'Erreur inattendue',
  },

  questionnaire: {
    title: 'Questionnaire',
    intro:
      "Sept questions sur votre cas de symbiose industrielle. Q1 et au moins une dimension Q3 sont requises ; le reste est optionnel mais améliore la sortie du moteur.",
    runButton: 'Exécuter la pipeline',
    runningButton: 'Exécution…',
    resetButton: 'Réinitialiser le brouillon',
    confirmReset: 'Effacer toutes les réponses et recommencer ? Opération irréversible.',
    q1Required: 'Q1 est requise.',
    shortcutTip: 'Astuce : Ctrl/⌘+Entrée pour exécuter',

    q1: {
      title: 'Q1 — Que analysez-vous ? *',
      help:
        "Choisissez la correspondance la plus proche. En cas d'ambiguïté, demandez-vous : qui est le SUJET du rapport ? (Requis.)",
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
    },

    q2: {
      title: 'Q2 — Dans quelle phase est le système ?',
      details:
        'A — échange ou parc existant en exploitation depuis des années ; données primaires usine disponibles. (Ex. Kalundborg aujourd\'hui, Sokka 2011 décrivant un IES existant.) ' +
        'B — construit récemment ou en commissioning ; données partiellement mesurées, partiellement estimées par ingénierie. ' +
        "C — étude de design pré-construction ; aucune donnée opérationnelle mesurée ; uniquement modèles d'ingénierie. (Ex. étude ex-ante Daddi 2017.) " +
        "D — baseline opérationnelle + un ou plusieurs scénarios « what-if » futurs à comparer (ex. expansion, ramp-up TRL, mix électrique décarboné). Choisir D active l'éditeur de scénarios alternatifs ci-dessous.",
      options: {
        A: { label: 'A. Opérationnel', description: 'Existe et opère depuis des années (données opérationnelles réelles).' },
        B: { label: 'B. En construction', description: 'En construction ou récemment commissionné.' },
        C: { label: 'C. Phase de conception', description: 'Uniquement en phase de conception (aucune donnée opérationnelle).' },
        D: { label: 'D. Baseline + alternatives', description: 'Baseline existante + N scénarios alternatifs futurs.' },
      },
    },

    q3: {
      title: 'Q3 — Quelles dimensions de durabilité inclure ? *',
      help: 'Au moins une est requise. Défaut : ENV + ECO.',
      details:
        "ENV — Life Cycle Assessment environnementale (LCA) : impacts climat, écosystèmes, ressources. Presque toujours sélectionnée. " +
        "ECO — dimension économique ; l'outil par défaut est LCC (Life Cycle Costing), mais le moteur accepte aussi MFCA (Material Flow Cost Accounting), CBA (Cost-Benefit Analysis), ou TEA (Techno-Economic Analysis) selon Q4 et le contexte de reporting. " +
        "SOC — S-LCA. La sélectionner active une chaîne de règles plus longue (catégories stakeholder worker / communauté locale / value chain) et force L1 BLOCK 2 si l'override avancé slca_framework_override vaut « absolute ». " +
        "La plupart des papiers IS publiés font ENV uniquement (ex. Sokka, Daddi) ; quelques-uns couplent ENV+ECO (Hashimoto, Wiktor) ; rares sont ceux qui ajoutent SOC.",
      warning: 'Sélectionnez au moins une dimension pour continuer.',
      env: 'Environnementale (LCA)',
      eco: 'Économique (LCC / MFCA / CBA / TEA)',
      soc: 'Sociale (S-LCA)',
    },

    q4: {
      title: 'Q4 — À quoi sert le rapport ?',
      help: 'Multi-sélection. Certains usages se combinent (ex. D + E pour un papier EU PEF).',
      details:
        "A — usage interne : dashboards de management, screening R&D, décisions au niveau usine. Peu de contraintes méthodologiques. " +
        "B — communication externe SANS claim comparatif (rapports de durabilité, brochures marketing sans phrase « meilleur que X »). " +
        "C — CLAIM public de supériorité environnementale vs une alternative (ex. « ce ciment est plus vert que l'OPC »). Active la critical review obligatoire ISO 14044 par 3+ experts indépendants et désactive la pondération. À utiliser avec précaution. " +
        "D — alignement avec les instruments de politique UE (disclosure CSRD, digital product passport ESPR, règles de catégorie PEFCR). Force la PEF Circular Footprint Formula via CIR-05. " +
        "E — publication académique peer-reviewed. Exige une transparence totale (sources de données, choix d'allocation, sensibilité). Souvent combinée avec B ou D. " +
        "Multi-sélection possible : un papier PEF typique choisit D + E.",
      options: {
        A: { label: 'A. Interne', description: 'Usage interne (managérial, R&D, planification).' },
        B: { label: 'B. Externe (sans claim)', description: 'Communication externe sans affirmations comparatives.' },
        C: {
          label: 'C. Claim public de supériorité',
          description: 'Affirmation publique de supériorité environnementale.',
          warn: 'Active la revue OBLIGATOIRE par panel de 3+ experts indépendants (ISO 14044), pondération non autorisée.',
        },
        D: {
          label: "D. Alignement politique UE",
          description: 'Alignement politique UE (CSRD, ESPR, PEFCR).',
          warn: 'Active la PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Publication académique', description: 'Publication académique peer-reviewed.' },
      },
    },

    q5: {
      title: 'Q5 — Nature de chaque flux symbiotique (par flux)',
      help:
        "Ajoutez une ligne par flux symbiotique principal et choisissez sa catégorie Q5. Obligatoire pour Q1 ∈ {A, B, D} ; optionnel sinon.",
      details:
        "Pour chaque flux principal échangé entre acteurs (chaleur, CO₂, laitier, eaux usées, hydrogène…), choisissez la relation économique : " +
        "a — A paie B pour évacuer le flux (le flux est un DÉCHET pour A) : contrat d'élimination typique. Active les règles d'allocation paradigme-déchet. " +
        "b — flux échangé GRATUITEMENT (statut ambigu) : le moteur route vers la chaîne de désambiguïsation free-flow. " +
        "c — B paie A pour le flux (le flux est un CO-PRODUIT pour A) : active les règles d'allocation économique et le path PEF Circular Footprint Formula. " +
        "d — flux INTERDÉPENDANT : aucune des deux parties ne pourrait fonctionner sans l'autre ; traité comme système intégré, souvent avec system expansion. " +
        "e — AGRÉGÉ / black-box : le cas publié ne donne pas le détail par-flux (typique des papiers IES agrégés comme Sokka 2011). " +
        "Pour les études de policy Q1=C, Q5 est généralement optionnel.",
    },

    q6a: {
      title: 'Q6a — Secteur',
      help:
        '14 secteurs canoniques selon WorkingDoc §3 + Autre. Les activations sector-specific des nœuds (ex. lca_mc_30 wastewater) lisent cet enum.',
      details:
        "Le secteur contrôle un petit ensemble d'activations sector-specific de nœuds et les défauts d'overlay. Choisissez la correspondance la plus proche du secteur dominant du cas (l'acteur qui contribue le plus en masse/énergie/valeur). " +
        "Exemples : pulp_paper pour Sokka 2011 (UPM Kymi) ; chemicals_fertilizers pour Hashimoto / Wiktor ; cement_construction pour Leiva 2025 Escombreras ; biobased_polymers pour Briassoulis ; food_production / agri-food pour Daddi. " +
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
    },

    q6b: {
      title: 'Q6b — Niveau de maturité technologique (TRL)',
      details:
        "TRL de la technologie dominante ou critique du réseau symbiotique. Détermine le choix de la qualité des données d'inventaire (mesurées vs littérature vs estimation d'ingénierie) et le budget d'incertitude downstream. " +
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
    },

    q7: {
      title: 'Q7 — Distribution géographique',
      help: 'Si les coordonnées des acteurs sont chargées plus tard, peut être auto-inférée et affichée comme info.',
      details:
        "La distribution géographique modifie le poids relatif des transports dans l'inventaire et peut activer CIR-03 si l'override avancé transport_sensitive=true. " +
        "A — co-localisés sur un même site (<5 km, ex. Kalundborg, parc éco-industriel). Les transports sont essentiellement négligeables. " +
        "B — cluster régional (5-100 km, même région — typique Sokka 2011 / Hashimoto). " +
        "C — zone étendue, cross-régions ou transfrontalier (>100 km). Mode et distance de transport deviennent des postes d'inventaire non triviaux. " +
        "D — programmes multi-échelle nationaux ou industrie-wide (études de policy Q1=C, géographiquement variables).",
      options: {
        A: { label: 'A. Co-localisés', description: 'Eco-park, <5 km entre acteurs.' },
        B: { label: 'B. Régional', description: '5-100 km, même région.' },
        C: { label: 'C. Zone étendue', description: '>100 km, cross-régions ou transfrontalier.' },
        D: { label: 'D. Multi-échelle', description: "National / industrie-wide, distances variables." },
      },
    },

    q2dCard: {
      title: 'Q2-D — Scénarios alternatifs',
      help:
        'Définissez un ou plusieurs scénarios alternatifs futurs à comparer à la baseline. Active le background dynamique SSP/RCP et le support matrice-scénarios downstream.',
    },

    advancedCard: {
      title: 'Overrides avancés (mode expert)',
      activeKeys_one: '{{count}} clé active',
      activeKeys_other: '{{count}} clés actives',
    },
  },

  flows: {
    emptyHint: 'Aucun flux. Ajoutez-en au moins un pour caractériser la Q5 par-flux.',
    headers: { id: 'ID', name: 'Nom', q5: 'Q5' },
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
      "Ajoutez une ligne par scénario alternatif à comparer à la baseline. Le dict d'overrides (deltas de réponses Q vs baseline) est configuré dans l'éditeur avancé ; pour l'instant chaque scénario porte une map d'overrides vide.",
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
      asset_lifetime: 'Années ; >15 active lca_mc_21, lcc_hc_23, CIR-01',
      transport_sensitive: 'Booléen ; true active CIR-03',
      network_nodes: 'Entier ; ≥3 (avec Q1=B + interdependent_flows) active CIR-04',
      interdependent_flows: 'Booléen ; true (avec Q1=B + network_nodes≥3) active CIR-04',
      frontier_categories_active: 'Booléen ; true active CIR-06',
      is_specific_capital_goods: 'Booléen ; true active IR-13 / B-06 / CIR-08',
      multi_actor: 'Booléen ; true (avec Q1∈{B,C}) active FU-02',
    },
  },

  result: {
    title: 'Sortie du moteur',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'Situation ILCD',
      lccType: 'Type LCC',
      slca: 'S-LCA',
      activatedNodes: 'Nœuds activés',
      l1Blocks: 'BLOCK L1 déclenchés',
      l2Violations: 'Violations L2',
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
    description: 'Pipeline exécutée pour la baseline + {{n}} scénarios alternatifs. Différences mises en évidence vs baseline.',
    backToResult: 'Retour au résultat unique',
    columns: {
      scenario: 'Scénario',
      pathway: 'Pathway',
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
      run: 'Exécuter la pipeline',
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
    pipelineCompleted: 'Pipeline complétée en {{ms}} ms — pathway {{pathway}}',
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

  cases: {
    navLink: 'Mes cas',
    title: 'Mes cas',
    intro: 'Cas sauvegardés sur le serveur. Chargez pour remplir le questionnaire, ou supprimez pour retirer définitivement.',
    empty: 'Aucun cas sauvegardé. Sauvegardez un cas depuis le questionnaire ou la page de résultat.',
    columns: {
      name: 'Nom',
      pathway: 'Pathway',
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
