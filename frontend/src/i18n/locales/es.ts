// Español. Términos metodológicos LCA/LCC/S-LCA + siglas ILCD/PEF/CSRD/MFCA
// /CBA/TEA/IS-01..05 sin traducir (normativos).

import type { Locale } from './en'

const es: Locale = {
  common: {
    run: 'Ejecutar',
    reset: 'Reiniciar',
    close: 'Cerrar',
    add: 'Añadir',
    remove: 'Eliminar',
    cancel: 'Cancelar',
    notSet: '(no establecido)',
    optional: 'opcional',
    skip: '(saltar)',
    required: 'Obligatorio',
    examplesAndContext: 'Ejemplos y contexto',
    yes: 'sí',
    no: 'no',
  },

  eu: {
    fundingStatement:
      'Este proyecto ha recibido financiación del programa Horizon Europe de Investigación e Innovación de la Unión Europea en el marco del Acuerdo de Subvención N. 101135562.',
    disclaimer:
      'Financiado por la Unión Europea. Sin embargo, las opiniones expresadas son las del autor o autores únicamente y no reflejan necesariamente las de la Unión Europea. Ni la Unión Europea ni la autoridad que concede la financiación pueden ser consideradas responsables.',
  },

  layout: {
    brand: 'SYMBA T4.6',
    brandTag: 'Sistema de Monitoreo e Informe para la Simbiosis Industrial',
    about: 'Acerca de',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Pulsa {{key}} para los atajos',
  },

  health: {
    backendLabel: 'Backend',
    checking: 'comprobando',
    ok: 'OK',
    unreachable: 'inaccesible',
    bannerPart1: 'El backend en',
    bannerPart2:
      'no está disponible. El cuestionario funciona pero las ejecuciones de la pipeline fallarán hasta que el backend vuelva a estar online.',
  },

  savedStatus: {
    empty: 'Sin borrador',
    justNow: 'Borrador guardado · ahora',
    secondsAgo: 'Borrador guardado · hace {{n}}s',
    minutesAgo: 'Borrador guardado · hace {{n}}m',
    hoursAgo: 'Borrador guardado · hace {{n}}h',
  },

  home: {
    title: 'SYMBA T4.6 — Herramienta de evaluación IS',
    tagline: 'Selección metodológica para Simbiosis Industrial (LCA / LCC / S-LCA).',
    description:
      'Responde a siete preguntas breves sobre tu caso de simbiosis industrial. El motor de decisión deriva el pathway IS terminal (IS-01..IS-05) y una configuración metodológica completa a partir de los 186 nodos Phase 1 de los entregables D4.1, D4.2 y D4.3, más las 40 reglas cross-method.',
    startButton: 'Iniciar nueva evaluación',
    modeLabel: 'Modo UX',
    modeExpert: 'Experto',
    modeGuided: 'Guiado',
    modeHint: {
      expert: 'Cuestionario rápido para analistas IS y revisores familiarizados con la terminología ILCD / LCSA.',
      guided: 'Modo paso a paso para industriales, representantes comunitarios y responsables políticos. Los ejemplos están expandidos por defecto.',
    },
  },

  about: {
    title: 'Acerca de',
    p1:
      'SYMBA T4.6 — IS Assessment App es la herramienta operativa del WP4 / T4.6 del proyecto SYMBA Horizon Europe. Implementa el motor de decisión de nodos atómicos Phase 1 derivado de los entregables D4.1 (LCA), D4.2 (LCC) y D4.3 (S-LCA), clasificando un caso de simbiosis industrial en uno de cinco pathways IS terminales (IS-01..IS-05) y devolviendo una configuración metodológica completa para LCA, LCC y S-LCA.',
    p2:
      'Las 7 preguntas de usuario (Q1-Q7) impulsan la activación de los 186 nodos Phase 1 más 40 reglas cross-method (18 IR + 10 CIR + 5 FU + 7 B). El enforcement L3 en tiempo de reporting (IR-04 + IR-10) más 12 Critical Decision Points hacen aflorar las tensiones cross-method.',
    p3:
      'Esta build MVP conecta el cuestionario con POST /api/pipeline/run. La visualización de configuración por pillar, los overrides avanzados y el panel "Show reasoning" están todos operativos.',
  },

  error: {
    title: 'Algo salió mal',
    backHome: 'Volver al inicio',
    fallback: 'Error inesperado',
  },

  questionnaire: {
    title: 'Cuestionario',
    guidedBannerTitle: 'Modo guiado activo',
    guidedBannerBody:
      'Los ejemplos y explicaciones contextuales están expandidos por defecto. Lee cada bloque con atención — las siete preguntas determinan el pathway metodológico y el plan de recolección de datos que recibirás al final.',
    intro:
      'Siete preguntas sobre tu caso de simbiosis industrial. Q1 y al menos una dimensión Q3 son obligatorias; el resto es opcional pero mejora la salida del motor.',
    runButton: 'Ejecutar pipeline',
    runningButton: 'Ejecutando…',
    resetButton: 'Reiniciar borrador',
    confirmReset: '¿Descartar todas las respuestas y empezar de nuevo? No se puede deshacer.',
    q1Required: 'Q1 es obligatoria.',
    shortcutTip: 'Tip: Ctrl/⌘+Enter para ejecutar',

    q1: {
      title: 'Q1 — ¿Qué estás analizando? *',
      help:
        '¿Selecciona la coincidencia más cercana. En caso de ambigüedad pregúntate: ¿quién es el SUJETO del informe? (Obligatorio.)',
      details:
        'A — intercambio bilateral (p. ej. calor residual de Planta X a Planta Y, o yeso subproducto de una térmica a una cementera). El sujeto es el FLUJO COMPARTIDO entre dos empresas. ' +
        'B — parque eco-industrial o red simbiótica con 3+ actores (p. ej. Kalundborg, cluster NISP, masterplan de un parque industrial). El sujeto es la RED como sistema. ' +
        'C — decisión de política o programa público a escala regional/nacional (p. ej. un esquema de subvención IS, un marco regulatorio, una estrategia industrial UE). El sujeto es la DECISIÓN/PROGRAMA, no una planta concreta. ' +
        'D — empresa única que cuantifica su contribución simbiótica para reporting ESG / CSRD / sostenibilidad (p. ej. "vendimos 12 kt de escoria a cementeras, este es nuestro crédito"). El sujeto es UNA SOLA EMPRESA. ' +
        'E — monitorización periódica de una simbiosis ya operativa (actualizaciones KPI anuales, vigilancia post-implementación). El sujeto es la SERIE TEMPORAL, no un estudio puntual.',
      options: {
        A: { label: 'A. Intercambio específico', description: 'Un intercambio simbiótico entre dos empresas existentes.' },
        B: { label: 'B. Eco-park / red', description: 'Un parque eco-industrial o una red simbiótica multi-actor.' },
        C: { label: 'C. Política / programa', description: 'Una decisión de política o programa a escala regional o nacional.' },
        D: { label: 'D. Informe corporativo', description: 'La contribución simbiótica de una sola empresa para reporting ESG/CSRD.' },
        E: { label: 'E. Monitorización', description: 'Monitorización temporal de una simbiosis ya operativa.' },
      },
    },

    q2: {
      title: 'Q2 — ¿En qué fase está el sistema?',
      details:
        'A — intercambio o parque existente operando desde hace años; hay datos primarios de planta. (Ej. Kalundborg hoy, Sokka 2011 reportando un IES existente.) ' +
        'B — construido recientemente o en commissioning; los datos son en parte medidos, en parte estimación de ingeniería. ' +
        'C — estudio de diseño pre-construcción; sin datos operativos medidos; solo modelos de ingeniería. (Ej. estudio ex-ante Daddi 2017.) ' +
        'D — baseline operativa + uno o más escenarios "what-if" futuros a comparar (p. ej. expansión, ramp-up TRL, mix eléctrico descarbonizado). Elegir D habilita el editor de escenarios alternativos abajo.',
      options: {
        A: { label: 'A. Operativo', description: 'Existe y opera desde hace años (datos operativos reales).' },
        B: { label: 'B. En construcción', description: 'En construcción o recientemente puesto en marcha.' },
        C: { label: 'C. Fase de diseño', description: 'Solo en fase de diseño (sin datos operativos).' },
        D: { label: 'D. Baseline + alternativas', description: 'Baseline existente + N escenarios alternativos futuros.' },
      },
    },

    q3: {
      title: 'Q3 — ¿Qué dimensiones de sostenibilidad incluir? *',
      help: 'Al menos una es obligatoria. Predeterminado: ENV + ECO.',
      details:
        'ENV — Análisis de Ciclo de Vida ambiental (LCA): impactos en clima, ecosistemas, uso de recursos. Casi siempre seleccionada. ' +
        'ECO — dimensión económica; la herramienta por defecto es LCC (Life Cycle Costing), pero el motor también acepta MFCA (Material Flow Cost Accounting), CBA (Cost-Benefit Analysis) o TEA (Techno-Economic Analysis) según Q4 y contexto de reporting. ' +
        'SOC — S-LCA. Seleccionarla activa una cadena de reglas más larga (categorías stakeholder worker / comunidad local / cadena de valor) y fuerza L1 BLOCK 2 si el override avanzado slca_framework_override está en "absolute". ' +
        'La mayoría de papers IS publicados ejecutan solo ENV (p. ej. Sokka, Daddi); algunos acoplan ENV+ECO (Hashimoto, Wiktor); solo unos pocos añaden SOC.',
      warning: 'Selecciona al menos una dimensión para continuar.',
      env: 'Ambiental (LCA)',
      eco: 'Económica (LCC / MFCA / CBA / TEA)',
      soc: 'Social (S-LCA)',
    },

    q4: {
      title: 'Q4 — ¿Para qué es el informe?',
      help: 'Selección múltiple. Algunos usos se combinan (ej. D + E para un paper EU PEF).',
      details:
        'A — uso interno: dashboards de gestión, screening I+D, decisiones a nivel de planta. Pocas restricciones metodológicas. ' +
        'B — comunicación externa SIN claims comparativos (informes de sostenibilidad, brochures de marketing sin afirmación "mejor que X"). ' +
        'C — CLAIM público de superioridad ambiental frente a una alternativa (p. ej. "este cemento es más verde que el OPC"). Activa la critical review obligatoria ISO 14044 por 3+ expertos independientes y desactiva la ponderación. Usar con cuidado. ' +
        'D — alineamiento con instrumentos de política UE (disclosure CSRD, digital product passport ESPR, reglas de categoría PEFCR). Fuerza la PEF Circular Footprint Formula vía CIR-05. ' +
        'E — publicación académica peer-reviewed. Requiere transparencia total (fuentes de datos, decisiones de allocation, sensibilidad). A menudo combinada con B o D. ' +
        'Selección múltiple posible: un paper PEF típico elige D + E.',
      options: {
        A: { label: 'A. Interno', description: 'Uso interno (gestión, I+D, planificación).' },
        B: { label: 'B. Externo (sin claim)', description: 'Comunicación externa sin afirmaciones comparativas.' },
        C: {
          label: 'C. Claim público de superioridad',
          description: 'Afirmación pública de superioridad ambiental.',
          warn: 'Activa la revisión OBLIGATORIA por panel de 3+ expertos independientes (ISO 14044), no se permite ponderación.',
        },
        D: {
          label: 'D. Alineamiento con política UE',
          description: 'Alineamiento con política UE (CSRD, ESPR, PEFCR).',
          warn: 'Activa la PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Publicación académica', description: 'Publicación académica peer-reviewed.' },
      },
    },

    q5: {
      title: 'Q5 — Naturaleza de cada flujo simbiótico (por flujo)',
      help:
        'Añade una fila por cada flujo simbiótico principal y elige su categoría Q5. Obligatorio para Q1 ∈ {A, B, D}; opcional en otros casos.',
      details:
        'Para cada flujo principal intercambiado entre actores (calor, CO₂, escoria, aguas residuales, hidrógeno…) elige la relación económica: ' +
        'a — A paga a B para que se lleve el flujo (el flujo es un RESIDUO para A): contrato típico de gestión de residuos. Activa reglas de allocation paradigma-residuo. ' +
        'b — flujo intercambiado de FORMA GRATUITA (estatus ambiguo): el motor encamina a la cadena de desambiguación free-flow. ' +
        'c — B paga a A por el flujo (el flujo es un CO-PRODUCTO para A): activa reglas de allocation económica y la ruta PEF Circular Footprint Formula. ' +
        'd — flujo INTERDEPENDIENTE: ninguna parte podría operar sin la otra; tratado como sistema integrado, a menudo con system expansion. ' +
        'e — AGREGADO / black-box: el caso publicado no aporta detalle por flujo (típico de papers IES agregados como Sokka 2011). ' +
        'Para estudios de policy Q1=C, Q5 suele ser opcional.',
    },

    q6a: {
      title: 'Q6a — Sector',
      help:
        '14 sectores canónicos según WorkingDoc §3 + Otro. Las activaciones sector-specific de los nodos (p. ej. lca_mc_30 wastewater) leen este enum.',
      details:
        'El sector controla un pequeño conjunto de activaciones sector-specific de nodos y los defaults de overlay. Elige la coincidencia más cercana al sector dominante del caso (el actor que aporta más masa/energía/valor). ' +
        'Ejemplos: pulp_paper para Sokka 2011 (UPM Kymi); chemicals_fertilizers para Hashimoto / Wiktor; cement_construction para Leiva 2025 Escombreras; biobased_polymers para Briassoulis; food_production / agri-food para Daddi. ' +
        'Para casos mixtos usa multi_sector. Las entradas "(legacy)" abajo existen para la carga backward-compatible de fixtures antiguas — prefiere la nueva lista de 14 sectores.',
      options: {
        none: '(ninguno)',
        agriculture_agrifood_biorefineries: 'Agricultura / agroalimentario / biorrefinerías',
        biobased_polymers: 'Polímeros de base biológica',
        plastics_packaging: 'Plásticos y envases',
        pulp_paper: 'Pulpa y papel',
        chemicals_fertilizers: 'Química / fertilizantes',
        cement_construction: 'Cemento / construcción',
        steel_metals: 'Acero y metales',
        energy_utilities: 'Energía / utilities',
        wastewater_sludge_biofactories: 'Aguas residuales / lodos / biofactories',
        textile_leather: 'Textil / cuero',
        waste_valorization: 'Valorización de residuos',
        food_production: 'Producción alimentaria',
        multi_tenant_urban_building: 'Edificio urbano multi-tenant',
        multi_sector: 'Multi-sector',
        other: 'Otro (especificar)',
        wastewater_biofactories: 'Aguas residuales / lodos / biofactories (legacy)',
        agri_food: 'Agroalimentario / biorrefinerías (legacy)',
        process_industry: 'Industria de proceso (legacy)',
      },
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL de la tecnología dominante o crítica en la red simbiótica. Determina la elección de la calidad de los datos de inventory (medidos vs literatura vs estimación de ingeniería) y el presupuesto de incertidumbre downstream. ' +
        'TRL 9 = pleno funcionamiento comercial (Kalundborg, Sokka). ' +
        'TRL 7-8 = piloto first-of-a-kind / unidad pre-comercial. ' +
        'TRL 5-6 = prototipo validado en laboratorio, demo a escala relevante. ' +
        'TRL <5 = I+D temprana, solo bench-scale — gran incertidumbre, escenarios recomendados.',
      options: {
        TRL9: 'TRL 9 — plenamente operativo',
        'TRL7-8': 'TRL 7-8 — piloto / pre-comercial',
        'TRL5-6': 'TRL 5-6 — prototipo',
        'TRL<5': 'TRL <5 — I+D temprana',
      },
    },

    q7: {
      title: 'Q7 — Distribución geográfica',
      help: 'Si las coordenadas de los actores se cargan más tarde, esto puede inferirse automáticamente y mostrarse como info.',
      details:
        'La distribución geográfica modifica el peso relativo del transporte en el inventory y puede activar CIR-03 si el override avanzado transport_sensitive=true. ' +
        'A — co-localizados en un mismo emplazamiento (<5 km, p. ej. Kalundborg, parque eco-industrial). El transporte es esencialmente despreciable. ' +
        'B — cluster regional (5-100 km, misma región — típico Sokka 2011 / Hashimoto). ' +
        'C — área amplia, transregional o transfronterizo (>100 km). El modo y la distancia de transporte se vuelven partidas no triviales del inventory. ' +
        'D — programas multi-escala nacionales o industria-wide (estudios de policy Q1=C, geográficamente variables).',
      options: {
        A: { label: 'A. Co-localizados', description: 'Eco-park, <5 km entre actores.' },
        B: { label: 'B. Regional', description: '5-100 km, misma región.' },
        C: { label: 'C. Área amplia', description: '>100 km, transregional o transfronterizo.' },
        D: { label: 'D. Multi-escala', description: 'Nacional / industria-wide, distancias variables.' },
      },
    },

    q2dCard: {
      title: 'Q2-D — Escenarios alternativos',
      help:
        'Define uno o más escenarios alternativos futuros para comparar con la baseline. Activa el background dinámico SSP/RCP y el soporte matriz-escenarios downstream.',
    },

    advancedCard: {
      title: 'Overrides avanzados (modo experto)',
      activeKeys_one: '{{count}} clave activa',
      activeKeys_other: '{{count}} claves activas',
    },
  },

  flows: {
    emptyHint: 'Sin flujos. Añade al menos uno para caracterizar la Q5 por flujo.',
    headers: { id: 'ID', name: 'Nombre', q5: 'Q5' },
    namePlaceholder: 'ej. calor, CO2',
    addButton: 'Añadir flujo',
    removeAria: 'Eliminar {{id}}',
    options: {
      a: 'a — A paga a B (residuo)',
      b: 'b — Intercambio gratuito (ambiguo)',
      c: 'c — B paga a A (co-producto)',
      d: 'd — Interdependiente',
      e: 'e — Agregado / black-box',
    },
  },

  scenarios: {
    intro:
      'Añade una fila por cada escenario alternativo a comparar con la baseline. El dict de overrides (deltas de respuestas Q vs baseline) se configura en el editor avanzado; por ahora cada escenario lleva un mapa de overrides vacío.',
    emptyHint: 'Sin escenarios alternativos.',
    headers: { id: 'ID', label: 'Etiqueta' },
    labelPlaceholder: 'ej. Expansión futura / TRL9 ramp-up',
    addButton: 'Añadir escenario',
    removeAria: 'Eliminar {{id}}',
  },

  advanced: {
    intro:
      'Overrides en modo experto. Cada clave es leída por el motor mediante dict.get; las claves ausentes significan "usar el default". Los valores se convierten a true/false/número/cadena según corresponda.',
    headers: { key: 'Clave', value: 'Valor', hint: 'Pista', custom: 'custom' },
    addCustom: 'Añadir clave custom',
    clearAria: 'Limpiar {{key}}',
    removeAria: 'Eliminar {{key}}',
    hints: {
      slca_framework_override: "Establecer a 'absolute' para probar L1 BLOCK 2 (con Q3.soc=true)",
      asset_lifetime: 'Años; >15 activa lca_mc_21, lcc_hc_23, CIR-01',
      transport_sensitive: 'Booleano; true activa CIR-03',
      network_nodes: 'Entero; ≥3 (con Q1=B + interdependent_flows) activa CIR-04',
      interdependent_flows: 'Booleano; true (con Q1=B + network_nodes≥3) activa CIR-04',
      frontier_categories_active: 'Booleano; true activa CIR-06',
      is_specific_capital_goods: 'Booleano; true activa IR-13 / B-06 / CIR-08',
      multi_actor: 'Booleano; true (con Q1∈{B,C}) activa FU-02',
    },
  },

  result: {
    title: 'Salida del motor',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'Situación ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activatedNodes: 'Nodos activados',
      l1Blocks: 'BLOCK L1 disparados',
      l2Violations: 'Violaciones L2',
      l3Cdps: 'CDPs L3 aflorados',
      extended: '(extendido)',
    },
    blocked: {
      title: 'Pipeline bloqueada en L1',
      desc: 'El motor se detuvo en L1. No se ejecutó lógica de activación, L2 ni L3. Resuelve la(s) restricción(es) bloqueante(s) abajo y vuelve a ejecutar:',
    },
    toggleShow: 'Mostrar razonamiento',
    toggleHide: 'Ocultar razonamiento',
    rawJson: 'Respuesta JSON cruda',
    actions: {
      adjust: 'Ajustar respuestas',
      startFresh: 'Empezar de cero (limpiar todo)',
      downloadJson: 'Descargar caso (.json)',
      downloadReport: 'Descargar informe (.docx)',
      downloadingReport: 'Generando informe…',
      reportError: 'Generación del informe fallida',
      runScenarios: 'Ejecutar escenarios',
      runningScenarios: 'Ejecutando escenarios…',
    },
    confirmStartFresh: '¿Descartar el caso actual y empezar uno nuevo? No se puede deshacer.',
    noResult: { title: 'Aún sin resultado', desc: 'Envía un cuestionario para ver la salida del motor aquí.', cta: 'Abrir cuestionario' },
    error: { title: 'Error de pipeline', back: 'Volver al cuestionario' },
  },

  scenariosResult: {
    title: 'Comparación de escenarios',
    description: 'Pipeline ejecutada para la baseline + {{n}} escenarios alternativos. Diferencias destacadas vs baseline.',
    backToResult: 'Volver al resultado único',
    columns: {
      scenario: 'Escenario',
      pathway: 'Pathway',
      ilcd: 'ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activated: 'Activados',
      blocks: 'BLOCK L1',
      violations: 'Violaciones L2',
      cdps: 'CDPs L3',
    },
    baselineLabel: 'Baseline',
    diffSuffix: '(diff)',
    overrideHelp: 'Cada escenario hereda Q1-Q7 de la baseline; rellena overrides (dict JSON) por escenario para diferir. Overrides vacíos → mismo caso que la baseline.',
    overridesPlaceholder: 'p. ej. {"q1": "C"} o {"q3": {"env": true, "eco": true}}',
    overridesParseError: 'Los overrides deben ser JSON válido para {{id}}',
  },


  reasoning: {
    activatedNodes: 'Nodos activados ({{count}})',
    pillarConfigs: 'Configuraciones por pillar',
    noPillarValues: 'No se han escrito valores de pillar.',
    l2Violations: 'Violaciones de reglas L2 ({{count}})',
    noViolations: 'Sin violaciones.',
    l3Cdps: 'Critical Decision Points L3 ({{count}})',
    noCdps: 'No se han aflorado CDPs.',
    pillarKeys: '{{count}} claves',
    resolution: 'Resolución',
    filterPlaceholder: 'Filtrar por ID de nodo…',
    noMatch: 'Ningún nodo coincide con el filtro.',
    showingFiltered: '{{shown}} de {{total}} mostrados',
  },

  loading: { default: 'Ejecutando pipeline…' },

  shortcuts: {
    title: 'Atajos de teclado',
    closeHint: 'Pulsa {{esc}} o haz clic fuera para cerrar.',
    items: {
      help: 'Mostrar esta ayuda de atajos',
      run: 'Ejecutar pipeline',
      runContext: 'Cuestionario',
      toggleReasoning: 'Alternar panel de razonamiento',
      toggleReasoningContext: 'Resultado',
      print: 'Imprimir página de resultado',
      printContext: 'Resultado',
      esc: 'Cerrar este diálogo',
    },
  },

  preset: {
    title: 'Cargar un caso publicado como preset',
    help:
      '13 fixtures del sample de validación (12 papers + Leiva Escombreras / Frövi). Carga las Q1-Q7 + Q5 por flujo en el cuestionario para inspeccionar y ejecutar el motor end-to-end.',
    loadButton: 'Cargar preset',
    rationaleToggle: '¿Por qué estas respuestas? (rationale de compilación)',
  },

  toast: {
    pipelineCompleted: 'Pipeline completada en {{ms}} ms — pathway {{pathway}}',
    pipelineError: 'Error de pipeline — {{detail}}',
    scenariosCompleted: '{{n}} escenarios ejecutados',
    scenariosError: 'Ejecución de escenarios fallida — {{detail}}',
  },

  language: {
    label: 'Idioma',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },

  auth: {
    title: 'Iniciar sesión',
    subtitle: 'Opcional para consultar casos legacy / públicos. Necesario para crear casos privados.',
    tabLogin: 'Iniciar sesión',
    tabRegister: 'Crear cuenta',
    emailLabel: 'Email',
    passwordLabel: 'Contraseña',
    passwordHelp: 'Al menos 8 caracteres.',
    submitLogin: 'Iniciar sesión',
    submitRegister: 'Crear cuenta',
    submitting: 'Enviando…',
    skipLink: 'Continuar sin iniciar sesión',
    signIn: 'Iniciar sesión',
    logout: 'Cerrar sesión',
  },

  stakeholder: {
    navLink: 'Informe stakeholder',
    title: 'Informe stakeholder',
    subtitle:
      'Vista multi-stakeholder del caso. Cambia de pestaña para ver la información adaptada a cada audiencia a lo largo de la cadena de valor biobasada.',
    openButton: 'Abrir informe stakeholder',
    backToResult: 'Volver al resultado',
    openDcf: 'Abrir Data Collection File',
    loadingScoring: 'Cargando datos de scoring…',
    tabs: {
      industry: 'Industria',
      community: 'Comunidad',
      authority: 'Autoridad local',
      'end-user': 'Usuario final',
    },
    framing: {
      industry:
        'Vista técnica completa de la configuración metodológica y del scoring cuantitativo producido por CIRCE.',
      community:
        'Vista de impacto local centrada en calidad ambiental y beneficios sociales para el territorio anfitrión.',
      authority:
        'Vista regulatoria y de política: cumplimiento del pathway, peer-review, alineación EU PEF.',
      'end-user':
        'Vista resumen para usuarios finales de los productos derivados de la simbiosis.',
    },
    pathwaySummaryTitle: 'Resumen del pathway',
    labels: {
      pathway: 'Pathway',
      ilcd: 'Situación ILCD',
      lcc: 'Tipo LCC',
      slca: 'Activación S-LCA',
    },
    scoringTitle: 'Scoring (CIRCE)',
    scoringPendingTitle: 'Datos de scoring no disponibles aún',
    scoringPendingBody:
      'El scoring LCSA producido por CIRCE para este caso aún no ha sido ingerido. Cuando CIRCE entregue el payload cuantitativo, los indicadores aparecerán aquí agrupados por relevancia para los stakeholders.',
    scoringEmpty: 'No hay indicadores relevantes para este stakeholder.',
    indicatorPending: 'pendiente',
    engineDetailsTitle: 'Detalles del pipeline',
    activatedNodesCount: '{{count}} nodo(s) metodológico(s) activado(s)',
    ruleViolations: '{{count}} violación(es) de regla',
    cdpFlagsCount: '{{count}} tensión(es) cross-dimensional(es)',
    complianceTitle: 'Señales de cumplimiento',
    compliance: {
      peerReview: 'Reclamación peer-review (Q4=E): {{status}}',
      pef: 'Alineación EU PEF (Q4=D): {{status}}',
      publicClaim: 'Reclamación pública (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Panel regional',
    title: 'Panel regional / sectorial',
    subtitle:
      'Desglose de todos los casos guardados por pathway, sector, ámbito geográfico y situación ILCD. Para autoridades locales y analistas de políticas.',
    openButton: 'Abrir panel regional',
    backToCases: 'Volver a los casos',
    loading: 'Cargando datos agregados…',
    errorTitle: 'Carga de datos agregados fallida',
    errorNoData: 'El servidor no devolvió datos.',
    totalLabel: 'Total de casos guardados',
    noData: '(sin datos)',
    tableKey: 'Valor',
    tableCount: 'Cantidad',
    breakdownTitle: {
      byPathway: 'Por pathway (IS-01 … IS-05)',
      bySector: 'Por sector (Q6a)',
      byScope: 'Por ámbito geográfico (Q7)',
      byIlcd: 'Por situación ILCD',
    },
  },

  dcf: {
    navLink: 'Recolección de datos',
    title: 'Data Collection File',
    subtitle:
      'Calibrado sobre el pathway derivado. Descarga el archivo Excel para recolectar datos de inventario con los socios de la simbiosis, y vuelve aquí para el informe final.',
    loading: 'Componiendo el Data Collection File…',
    errorTitle: 'Generación del Data Collection File fallida',
    errorNoPayload: 'El servidor no devolvió un payload.',
    backToResult: 'Volver al resultado',
    networkTitle: 'Diagrama de red',
    downloadXlsx: 'Descargar Excel (.xlsx)',
    downloadingXlsx: 'Preparando Excel…',
    downloadDocx: 'Descargar documento (.docx)',
    downloadingDocx: 'Preparando documento…',
    downloadError: 'Descarga fallida',
    footerNote:
      'El Data Collection File es una hoja de recolección lista para exportar. Rellena las filas vacías sin conexión (o distribúyelo a los socios de la red) y devuelve los datos al analista responsable de la LCSA.',
    openButton: 'Abrir Data Collection File',
  },

  cases: {
    navLink: 'Mis casos',
    title: 'Mis casos',
    intro: 'Casos guardados en el servidor. Carga para rellenar el cuestionario, o elimina para borrar permanentemente.',
    empty: 'Sin casos guardados aún. Guarda uno desde el cuestionario o la página de resultado.',
    columns: {
      name: 'Nombre',
      pathway: 'Pathway',
      updated: 'Actualizado',
    },
    loadButton: 'Cargar',
    deleteButton: 'Eliminar',
    confirmDelete: '¿Eliminar "{{name}}" permanentemente? No se puede deshacer.',
    saveButton: 'Guardar caso',
    saveAsButton: 'Guardar como nuevo…',
    saveTitle: 'Guardar caso',
    namePlaceholder: 'Nombre de mi caso',
    saveDialog: 'Guardar el caso actual en el servidor. Elige un nombre para identificarlo después.',
    saving: 'Guardando…',
    saveError: 'Guardado fallido — {{detail}}',
    saveSuccess: 'Guardado como "{{name}}"',
    loadError: 'Carga fallida — {{detail}}',
    deleteError: 'Eliminación fallida — {{detail}}',
  },
}

export default es
