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
  },

  layout: {
    brand: 'SYMBA T4.6',
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

  home: {
    title: 'SYMBA T4.6 — Herramienta de evaluación IS',
    tagline: 'Selección metodológica para Simbiosis Industrial (LCA / LCC / S-LCA).',
    description:
      'Responde a siete preguntas breves sobre tu caso de simbiosis industrial. El motor de decisión deriva el pathway IS terminal (IS-01..IS-05) y una configuración metodológica completa a partir de los 186 nodos Phase 1 de los entregables D4.1, D4.2 y D4.3, más las 40 reglas cross-method.',
    startButton: 'Iniciar nueva evaluación',
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
      warning: 'Selecciona al menos una dimensión para continuar.',
      env: 'Ambiental (LCA)',
      eco: 'Económica (LCC / MFCA / CBA / TEA)',
      soc: 'Social (S-LCA)',
    },

    q4: {
      title: 'Q4 — ¿Para qué es el informe?',
      help: 'Selección múltiple. Algunos usos se combinan (ej. D + E para un paper EU PEF).',
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
    },

    q6a: {
      title: 'Q6a — Sector',
      help:
        'Actualmente 5 valores placeholder; los 14 sectores completos llegarán con el wiring de sector_overlays.json.',
      options: {
        none: '(ninguno)',
        wastewater_biofactories: 'Aguas residuales / lodos / biofactories',
        agri_food: 'Agroalimentario / biorrefinerías',
        process_industry: 'Industria de proceso (química, cemento, acero, etc.)',
        other: 'Otro (especificar)',
      },
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
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
    },
    confirmStartFresh: '¿Descartar el caso actual y empezar uno nuevo? No se puede deshacer.',
    noResult: { title: 'Aún sin resultado', desc: 'Envía un cuestionario para ver la salida del motor aquí.', cta: 'Abrir cuestionario' },
    error: { title: 'Error de pipeline', back: 'Volver al cuestionario' },
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
  },

  loading: { default: 'Ejecutando pipeline…' },

  shortcuts: {
    title: 'Atajos de teclado',
    closeHint: 'Pulsa {{esc}} o haz clic fuera para cerrar.',
    items: {
      help: 'Mostrar esta ayuda de atajos',
      run: 'Ejecutar pipeline',
      runContext: 'Cuestionario',
      esc: 'Cerrar este diálogo',
    },
  },

  preset: {
    title: 'Cargar un caso publicado como preset',
    help:
      '13 fixtures del sample de validación (12 papers + Leiva Escombreras / Frövi). Carga las Q1-Q7 + Q5 por flujo en el cuestionario para inspeccionar y ejecutar el motor end-to-end.',
    loadButton: 'Cargar preset',
  },

  toast: {
    pipelineCompleted: 'Pipeline completada en {{ms}} ms — pathway {{pathway}}',
    pipelineError: 'Error de pipeline — {{detail}}',
  },

  language: {
    label: 'Idioma',
    en: 'English',
    it: 'Italiano',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
  },
}

export default es
