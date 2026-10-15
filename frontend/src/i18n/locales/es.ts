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
    methodologicalNote: 'Nota metodológica completa',
    yes: 'sí',
    no: 'no',
  },

  // Funding acknowledgement, worded as on the SYMBA website footer.
  eu: {
    emblemAlt: 'Financiado por la Unión Europea',
    fundingStatement: 'Financiado por la Unión Europea en virtud del Acuerdo de Subvención N. 101135562.',
    disclaimer:
      'Sin embargo, las opiniones expresadas son las del autor o autores únicamente y no reflejan necesariamente las de la Unión Europea. Ni la Unión Europea ni la Agencia Ejecutiva Europea de Investigación pueden ser consideradas responsables.',
  },

  footer: {
    logoAlt: 'Symba Project',
    logoTitle: 'Ir al sitio web del proyecto SYMBA',
    toolLine: 'Monitoring & Reporting System · Tarea T4.6',
    followUs: 'Síguenos',
    projectInfo: 'Información del proyecto',
    projectWebsite: 'Sitio web del proyecto',
    publicDeliverables: 'Entregables públicos',
    copyright: 'Copyright © {{year}} Symba Project, todos los derechos reservados.',
    privacy: 'Política de privacidad',
    cookies: 'Almacenamiento del navegador',
  },

  siteHeader: {
    logoAlt: 'Symba Project',
    logoTitle: 'Ir al sitio web del proyecto SYMBA',
    navLabel: 'Sitio web del proyecto SYMBA',
    menuOpen: 'Abrir el menú',
    menuClose: 'Cerrar el menú',
    backToSite: 'Sitio web del proyecto',
    tool: 'Seguimiento',
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
    brandTag: 'Sistema de Monitoreo e Informe para la Simbiosis Industrial',
    about: 'Acerca de',
    footer: 'SYMBA T4.6 — IS Assessment Tool · MVP',
    shortcutsHint: 'Pulsa {{key}} para los atajos',
  },

  share: {
    buttonLabel: 'Compartir informe', title: 'Compartir este informe',
    lead: 'Envía una de estas URLs a un stakeholder. Mismo caso, encuadre diferente para cada audiencia.',
    close: 'Cerrar', done: 'Hecho', copy: 'Copiar', copied: 'Copiado ✓',
    copyFailed: 'No se pudo copiar — copia la URL manualmente.',
    saveFirstTitle: 'Guarda primero el caso',
    saveFirstBody: 'Las URLs requieren un case id guardado.',
    audience: { industry: '🏭 Industria', community: '🌳 Comunidad', authority: '🏛 Autoridad local', enduser: '👤 Usuario' },
  },

  reader: {
    tagline: 'Informe público',
    loading: 'Cargando el informe…',
    notFoundTitle: 'Informe no encontrado',
    notFoundBody: 'El enlace puede estar roto.',
    aboutLink: 'Conocer SYMBA',
    eyebrow: 'Informe compartido · {{name}}',
    summaryTitle: 'Resumen del pathway',
    summary: { pathway: 'Pathway', ilcd: 'Situación ILCD', lcc: 'Tipo LCC', slca: 'Estado S-LCA', sector: 'Sector', scope: 'Ámbito geográfico' },
    scoringTitle: 'Scoring',
    complianceTitle: 'Señales de cumplimiento',
    compliance: {
      peer: { name: 'Peer-review', desc: 'Q4 = E · ISO 14044' },
      pef: { name: 'Alineación EU PEF', desc: 'Q4 = D · Circular Footprint Formula' },
      public: { name: 'Afirmación pública', desc: 'Q4 = C · panel ISO obligatorio' },
      dnsh: { name: 'Verificación DNSH', desc: 'EU Taxonomy art. 17' },
    },
    audience: {
      showingFor: 'Vista para — {{name}}',
      industry: { short: '🏭 Industria', name: 'Industria', title: 'Vista operador', body: 'Vista técnica completa.' },
      community: { short: '🌳 Comunidad', name: 'Comunidad', title: 'Impacto local', body: 'Calidad ambiental y beneficios sociales.' },
      authority: { short: '🏛 Autoridad', name: 'Autoridad local', title: 'Vista regulatoria', body: 'Cumplimiento, peer-review, PEF, DNSH.' },
      enduser: { short: '👤 Usuario', name: 'Usuario final', title: 'Resumen', body: 'Puntos clave.' },
    },
    note: 'Este informe se genera con el motor SYMBA T4.6.',
    about: {
      eyebrow: 'Acerca de SYMBA T4.6', title: 'Informes públicos', lead: 'Alguien compartió un caso contigo.',
      whoTitle: '¿Quién está detrás?', whoBody: 'SYMBA es un proyecto Horizon Europe (GA 101135562).',
      whatTitle: '¿Qué es un informe?', whatBody: 'Describe un caso de simbiosis industrial.',
      whereTitle: '¿Dónde saber más?', whereBody: 'Visita el sitio del proyecto',
      enterTool: 'Entrar en la herramienta',
    },
    region: {
      eyebrow: 'Región · {{code}}', title: 'Panel regional', lead: 'Vista agregada.', total: 'Casos', pathways: 'Pathways', sectors: 'Sectores',
      byPathwayTitle: 'Por pathway', bySectorTitle: 'Por sector', tableKey: 'Valor', tableCount: 'Cantidad',
      errorTitle: 'Región no disponible', errorBody: 'No se pudieron cargar los datos.',
    },
  },

  welcome: {
    title: 'Bienvenido a SYMBA T4.6',
    lead: "Esta herramienta determina qué metodología exige tu caso de simbiosis industrial y qué datos debes recoger. No calcula los resultados ambientales, económicos ni sociales. Dos preguntas rápidas y te llevamos al sitio adecuado — puedes cambiarlas después, desde el menú dentro de la herramienta.",
    step1: { title: '¿Quién eres?' },
    step2: { title: '¿Qué te gustaría hacer?' },
    back: 'Atrás',
    next: 'Continuar',
    finish: 'Entrar',
    skip: 'Omitir por ahora',
    roles: {
      analyst: { name: 'Analista de sostenibilidad', desc: 'Practicante IS, revisor LCA/LCC/S-LCA, metodólogo.' },
      industry: { name: 'Operador industrial', desc: 'Diriges una planta o un sitio en una red IS.' },
      authority: { name: 'Autoridad local', desc: 'Municipio, región, analista de políticas del territorio.' },
      community: { name: 'Representante de comunidad', desc: 'Asociación, ONG, grupo de ciudadanos del territorio anfitrión.' },
      enduser: { name: 'Usuario final / ciudadano', desc: 'Usas productos o servicios derivados de la simbiosis.' },
      unknown: { name: 'Aún no lo sé', desc: 'Está bien — te llevamos a la página de panorámica.' },
    },
    tasks: {
      assess: { name: 'Iniciar una nueva evaluación', desc: 'Configura la metodología para un caso IS en diez preguntas.' },
      read: { name: 'Leer un informe compartido', desc: 'Abre un caso compartido y ve el informe.' },
      explore: { name: 'Explorar una región / sector', desc: 'Navega insights agregados de tu zona.' },
      browse: { name: 'Solo mirar', desc: 'Sin objetivo específico — quiero ver qué hace la herramienta.' },
    },
  },

  adminShell: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar casos, pathways, socios… (⌘K)',
    footerGa: 'GA',
    footerProgramme: 'Horizon Europe · M22–M36',
    groups: {
      workspace: 'Espacio de trabajo',
      reports: 'Informes',
      system: 'Sistema',
    },
    nav: {
      home: 'Inicio',
      questionnaire: 'Nueva evaluación',
      cases: 'Mis casos',
      recentResult: 'Último resultado',
      stakeholder: 'Informes stakeholder',
      aggregate: 'Panel regional',
      dcf: 'Data Collection File',
      about: 'Acerca de',
      changeRole: 'Cambiar de rol',
    },
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
      'Responde a diez preguntas breves sobre tu caso de simbiosis industrial. El motor de decisión deriva el pathway IS terminal (IS-01..IS-05) y una configuración metodológica completa a partir de los 186 nodos Phase 1 de los entregables D4.1, D4.2 y D4.3, más las 40 reglas cross-method.',
    startButton: 'Iniciar nueva evaluación',
    modeLabel: 'Modo UX',
    modeExpert: 'Experto',
    modeGuided: 'Guiado',
    modeHint: {
      expert: 'Cuestionario rápido para analistas IS y revisores familiarizados con la terminología ILCD / LCSA.',
      guided: 'Modo paso a paso para industriales, representantes comunitarios y responsables políticos. Cada pregunta lleva una explicación en palabras sencillas; la nota metodológica completa queda a un clic.',
    },
    hero: { title: 'Iniciar una nueva evaluación IS' },
    openCasesLink: 'O abrir un caso guardado',
    kpi: {
      savedCases: 'Casos guardados',
      savedCasesDetail: 'de todos los usuarios',
      withPathway: 'Con pathway',
      withPathwayDetail: '{{total}} en total',
      uniquePathways: 'Pathways únicos',
      uniquePathwaysDetail: 'IS-01 … IS-05',
      language: 'Disponible en',
      languageDetail: '5 idiomas',
    },
    presetsTitle: 'Casos de estudio validados',
    presetsMeta: '13 fixtures de artículos peer-reviewed',
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
    title: 'Acerca de',
    p1:
      "SYMBA T4.6 ayuda a quien plantea una evaluación de sostenibilidad del ciclo de vida de una simbiosis industrial: a partir de diez preguntas sobre el caso deduce qué metodología se aplica, qué prácticas hay que documentar y qué datos recoger de los socios de la red. No calcula los resultados — la puntuación cuantitativa se produce fuera de la herramienta y aparece aquí cuando llega.",
    p2:
      'Las 7 preguntas principales (Q1-Q7), más tres opcionales (Q8-Q10), impulsan la activación de los 186 nodos Phase 1 más 40 reglas cross-method (18 IR + 10 CIR + 5 FU + 7 B). El enforcement L3 en tiempo de reporting (IR-04 + IR-10) más 12 Critical Decision Points hacen aflorar las tensiones cross-method.',
    p3:
      'La visualización de configuración por pillar, los overrides avanzados y el panel "Show reasoning" están todos operativos.',
  },

  error: {
    title: 'Algo salió mal',
    backHome: 'Volver al inicio',
    fallback: 'Error inesperado',
  },

  questionnaire: {
    scopeNote: "Esta herramienta no calcula las cifras de ACV/LCC/S-ACV. Deriva la ruta metodológica que tu caso requiere y los datos que debes recoger; la puntuación cuantitativa se produce externamente y aparece aquí cuando llega.",
    title: 'Cuestionario',
    guidedBannerTitle: 'Modo guiado activo',
    guidedBannerBody:
      "Cada pregunta empieza con una explicación breve, en palabras sencillas. La nota metodológica completa, con la redacción de los entregables del proyecto, queda a un clic debajo de cada pregunta. Las diez respuestas determinan el pathway metodológico y el plan de recolección de datos que recibirás al final.",
    intro:
      'Diez preguntas sobre tu caso de simbiosis industrial. Q1 y al menos una dimensión Q3 son obligatorias; el resto es opcional pero mejora la salida del motor.',
    runButton: 'Calcular la ruta',
    runningButton: 'Calculando…',
    resetButton: 'Reiniciar borrador',
    confirmReset: '¿Descartar todas las respuestas y empezar de nuevo? No se puede deshacer.',
    q1Required: 'Q1 es obligatoria.',
    shortcutTip: 'Tip: Ctrl/⌘+Enter para ejecutar',

    q1: {
      title: 'Q1 — ¿Qué estás analizando? *',
      help:
        "Elige la opción más cercana: lo que cuenta es el sujeto del estudio, no quién lo encarga. (Obligatorio.)",
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
      plain:
        "Es la pregunta que manda sobre las demás: de ella la herramienta deduce qué sistema estás examinando y, por tanto, qué datos te pedirá más adelante. Si dudas entre dos opciones, quédate con la que describe aquello cuyos efectos quieres medir.",
    },

    q2: {
      title: 'Q2 — ¿Los intercambios que mide el estudio ya tienen lugar?',
      details:
        'Responde sobre los intercambios simbióticos, no sobre las plantas: una planta puede existir mientras el intercambio que estudias es todavía un proyecto. A — los intercambios tienen lugar desde hace tiempo; hay datos operativos primarios (p. ej. Kalundborg hoy, Sokka 2011). La referencia es lo que cada empresa haría hoy si se cortaran los vínculos (HNSRS, D4.1 §11.1). B — los intercambios acaban de empezar, o las plantas están en puesta en marcha; datos en parte medidos, en parte estimados. C — los intercambios aún no tienen lugar: previstos, diseñados o hipotéticos, aunque las plantas ya funcionen (p. ej. Daddi 2017, residuos reutilizados en una explotación existente). La referencia es la situación actual sin los intercambios (CNSRS, D4.1 §11.1). D — los intercambios tienen lugar y el estudio compara también alternativas futuras (ampliación, nueva tecnología, red eléctrica descarbonizada): la red existente frente al HNSRS, cada alternativa frente al CNSRS. D abre el editor de escenarios alternativos de abajo. Cuándo funciona el sistema se pregunta en Q8.',
      options: {
        A: { label: 'A. Ya en marcha', description: 'Los intercambios ya tienen lugar (datos operativos reales).' },
        B: { label: 'B. Recién iniciados', description: 'Los intercambios acaban de empezar, o las plantas están en puesta en marcha.' },
        C: { label: 'C. Todavía no', description: 'Intercambios previstos, diseñados o hipotéticos, incluso entre plantas que ya existen.' },
        D: { label: 'D. En marcha, más alternativas', description: 'Los intercambios están en marcha y el estudio los compara con alternativas futuras.' },
      },
      plain:
        'Piensa en los intercambios, no en las plantas. Si los flujos entre las empresas ya ocurren, puedes medirlos. Si todavía son una idea, aunque sea entre plantas que ya funcionan, solo puedes estimarlos. Elige la última opción si quieres comparar los intercambios de hoy con uno o más futuros posibles: abre el editor de escenarios de abajo.',
    },

    q3: {
      title: 'Q3 — ¿Qué dimensiones de sostenibilidad incluir? *',
      help: 'Al menos una es obligatoria. Ambiental y económica son la pareja habitual.',
      details:
        'ENV — Análisis de Ciclo de Vida ambiental (LCA): impactos en clima, ecosistemas, uso de recursos. Casi siempre seleccionada. ' +
        'ECO — dimensión económica, evaluada con Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) es una técnica usada dentro de la ruta LCC (activada por ECO y por los flujos discutidos en Q5), no una alternativa; CBA y TEA no las ofrece este motor. ' +
        'SOC — S-LCA. Seleccionarla activa una cadena de reglas más larga (categorías stakeholder worker / comunidad local / cadena de valor) y fuerza L1 BLOCK 2 si el override avanzado slca_framework_override está en "absolute". ' +
        'La mayoría de papers IS publicados ejecutan solo ENV (p. ej. Sokka, Daddi); algunos acoplan ENV+ECO (Hashimoto, Wiktor); solo unos pocos añaden SOC.',
      warning: 'Selecciona al menos una dimensión para continuar.',
      env: 'Ambiental (LCA)',
      eco: 'Económica (LCC)',
      soc: 'Social (S-LCA)',
      plain:
        "Tres evaluaciones distintas, cada una con su método y sus datos: ambiental, económica — los costes a lo largo de todo el ciclo de vida, no un análisis coste-beneficio — y social. Elige las que piensas entregar. La mayoría de los estudios publicados hacen solo la ambiental, y añadir la económica es el paso siguiente habitual; la social exige mucha más información de las personas implicadas, así que cuenta con ir a recogerla.",
    },

    q4: {
      title: 'Q4 — ¿Para qué se usará este estudio?',
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
      plain:
        "Quién leerá el resultado, y qué hará con él, decide cuán estricto debe ser el método. Una nota interna es el caso más ligero. Alinearse con los instrumentos de la UE (CSRD, pasaporte de producto, PEF) impone la manera europea de contar el material reciclado y recuperado. Afirmar en público que tu producto es mejor que otro es el caso más pesado: exige una revisión independiente por expertos externos. Puedes elegir más de una.",
    },

    q5: {
      title: 'Q5 — Naturaleza de cada flujo simbiótico (por flujo)',
      help:
        'Añade una fila por cada flujo simbiótico principal y elige su categoría Q5. Obligatorio para Q1 ∈ {A, B, D}; opcional en otros casos.',
      details:
        'Para cada flujo principal intercambiado entre actores (calor, CO₂, escoria, aguas residuales, hidrógeno…) indica quién paga a quién: ' +
        'a — A paga a B por llevarse el flujo (una tarifa de admisión: valor de mercado negativo, un RESIDUO para A, D4.1 §8.3.2). El cero-carga se aplica desde el punto en que el residuo alcanza por primera vez un valor no negativo, no en la puerta. Pagar no significa inevitable: D4.2 §6.2 exige además la prueba causal de evitabilidad, declarada por flujo en el Data Collection File. ' +
        'b — flujo intercambiado GRATIS (estado ambiguo): el motor lo encamina a la cadena de desambiguación de flujos gratuitos. ' +
        'c — B paga a A por el flujo (valor de mercado positivo: un COPRODUCTO para A): sustitución del material virgen desplazado, con una razón corregida por calidad. La Circular Footprint Formula del PEF no depende de Q5: viene de Q4=D. Si ningún tercero pagaría por el flujo (prueba de Freedom-to-Act, D4.1 §8.3.3), el precio es administrativo y el flujo se modela como residuo. ' +
        'd — flujo INTERDEPENDIENTE: A modificó deliberadamente su proceso (calidad, cantidad, postratamiento) para abastecer a B; un coproducto sea cual sea el precio, nunca cero-carga. ' +
        'e — AGREGADO / caja negra: la fuente no da detalle por flujo (típico de trabajos agregados como Sokka 2011). Es una limitación de la fuente, no una decisión de modelado: D4.1 §8.3.1 prohíbe una regla única para toda la red, así que el Data Collection File pide igualmente la clasificación de cada flujo que puedas nombrar. ' +
        'Q5 registra quién paga a quién; las pruebas jurídicas y económicas (Freedom-to-Act, End-of-Waste, clase de subproducto, evitabilidad, punto de cero-carga) se declaran por flujo en la sección Flow classification del Data Collection File. En estudios de política con Q1=C, Q5 suele ser opcional.',
      plain:
        "Para cada cosa que se mueve entre las empresas — calor, agua, escorias, CO₂ — aquí la pregunta es solo quién paga a quién: quien lo envía paga por deshacerse de ello, nadie paga, o quien lo recibe lo paga. Si quien lo envía cambió a propósito su propio proceso para suministrarlo, elige esa opción diga lo que diga el dinero. Si tu fuente da una sola cifra para toda la red, elige la última opción: se te preguntará igualmente por cada flujo que sepas nombrar, porque no se admite una regla única para toda la red. Si un flujo es residuo a efectos legales se decide después, en el archivo de recogida de datos, no aquí.",
    },

    q6a: {
      title: 'Q6a — Sector',
      help: 'El sector principal del caso. Activa unos pocos requisitos propios del sector.',
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
      plain:
        "El sector principal del caso: la actividad de la empresa que aporta la mayor parte de la masa, la energía o el valor. Activa unos pocos requisitos y valores por defecto propios del sector. Si el caso abarca varios sectores, elige Multi-sector, y deja de lado las entradas marcadas (legacy).",
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
      plain:
        "Cuán madura es la tecnología clave: en explotación comercial, primera planta piloto, prototipo, o todavía en laboratorio. Cuanto menos madura, más serán tus cifras estimaciones y no medidas, y más tendrá el resultado que cargar con su propia incertidumbre.",
    },

    q7: {
      title: 'Q7 — Distribución geográfica',
      help: 'Disposición cualitativa de la red. El transporte se modela explícitamente respondas lo que respondas; la distancia de equilibrio depende del tipo de flujo y se te pide para cada flujo en el Data Collection File (Logística), donde registras la que haya dado tu propio análisis de sensibilidad.',
      details:
        'La respuesta cambia cómo se piden los datos logísticos (acoplamiento SIG, sensibilidad espacial), no si se modela el transporte: D4.1 §12.3.1 exige que cada enlace de transporte sea un proceso unitario distinto del primer plano, con datos primarios de distancia, ruta y modo, y un análisis de sensibilidad de la distancia para hallar el punto de equilibrio. Detrás de las cuatro opciones no hay ningún umbral de distancia: el punto de equilibrio depende del tipo de flujo y de la alternativa que desplaza (D4.1 §12.2.1 y D4.2 dan rangos indicativos, para comprobar la verosimilitud de un modelo, nunca como entradas); cada estudio calcula el suyo, flujo a flujo. ' +
        'A — colocalizada: un solo emplazamiento o plantas contiguas (parque ecoindustrial). Los enlaces son cortos (tubería, cinta, manipulación interna) pero se modelan; para calor, vapor y agua en tubería suele dominar la infraestructura dedicada. ' +
        'B — clúster regional: varios emplazamientos de la misma región (típico Sokka 2011 / Hashimoto). ' +
        'C — área amplia: interregional o transfronteriza; el modo de transporte y las rutas pasan a ser partidas importantes del inventario y de los costes. ' +
        'D — multiescala: programas nacionales o sectoriales (típicamente estudios de política con Q1=C). De B a D se activa CIR-03 (acoplamiento SIG); de C a D también lca_mc_29 y la rama SIG de lcc_mc_14.',
      options: {
        A: { label: 'A. Co-localizados', description: 'Un solo emplazamiento o plantas contiguas (parque ecoindustrial).' },
        B: { label: 'B. Regional', description: 'Varios emplazamientos de la misma región.' },
        C: { label: 'C. Área amplia', description: 'Interregional o transfronteriza.' },
        D: { label: 'D. Multi-escala', description: 'Nacional / industria-wide, distancias variables.' },
      },
      plain:
        "Cómo están repartidos los emplazamientos: uno solo, varios en una misma región, emplazamientos entre regiones o más allá de las fronteras, o un programa nacional o de todo un sector. El transporte se cuenta cualquiera sea tu respuesta; la respuesta solo cambia cuánto detalle se te pedirá sobre rutas y modos. Detrás de las cuatro opciones no hay ningún umbral de distancia: cada flujo tiene su propia distancia de rentabilidad, y el archivo de recogida de datos te la pide, flujo por flujo, a partir de tu propio análisis de sensibilidad.",
    },
    q8: {
      title: 'Q8 — Horizonte temporal del estudio',
      help: 'Opcional. Un solo horizonte para el ACV y el ACC.',
      details: 'Los entregables exigen un solo horizonte temporal para el ACV, el ACC y el ACV-S (D4.2 §11, D4.1 §14). Los escenarios de fondo futuros (SSP/RCP) se añaden a ambos cuando el sistema funciona en un año futuro (D4.1 §9.3.5, §12.3.2), cuando la tecnología clave está por debajo de TRL 7 (Q6b) o cuando el estudio sigue el sistema durante más de 15 años (D4.2 §9; los 15 años son un valor por defecto de T4.6 sin fuente). Sin respuesta, el año de funcionamiento es el del estudio, salvo con Q2 = D (alternativas futuras), que cuenta como futuro. El periodo de análisis es el lapso que cubre el estudio; si está vacío se usa la vida útil de los activos principales (D4.2 §9.1).',
      start: {
        label: '¿En qué año funciona el sistema, o se supone que funciona?',
        options: {
          unset: 'Sin respuesta (el año del estudio; un año futuro si Q2 = D)',
          now: 'Ahora: el año del estudio',
          future: 'Un año futuro',
        },
        yearPlaceholder: 'p. ej. 2030',
      },
      period: {
        label: '¿Durante cuántos años sigue el estudio al sistema (periodo de análisis)?',
        placeholder: 'p. ej. 25; vacío para la fotografía de un año',
      },
      lifetime: {
        label: 'Vida útil técnica de los activos principales (solo si el periodo de análisis está vacío)',
      },
      placeholder: 'p. ej. 20',
      unit: 'años',
      plain:
        '¿Sobre qué años mira el estudio el sistema? Si describe cómo funcionan las cosas hoy, basta una fotografía del presente. Si trata de una planta que funcionará en un año posterior, o sigue el sistema durante décadas, el resultado depende de cómo cambien la electricidad, los combustibles y los mercados, y la herramienta te pide tomar posición sobre ese futuro: el mismo futuro para la lectura ambiental y para la económica.',
    },
    q9: {
      title: 'Q9 — ¿Para qué sirve el estudio y hasta dónde llegan sus efectos? *',
      help: 'Obligatoria. Fija la situación de modelado (ILCD A, B, C1 o C2); Q1 solo describe el objeto.',
      details: 'La Tabla 1 de D4.1 clasifica el estudio por la decisión que respalda y la escala de sus consecuencias, no por su objeto (D4.1 §4.2.3). Micro (Situación A) es el valor por defecto para intercambios concretos y diseños de parque o de planta, aunque no haya un decisor nombrado (§4.3.4). Estructural (Situación B) exige la prueba de que el cambio desplaza capacidad instalada en el mercado afectado, por ejemplo un 1 % o más de las nuevas instalaciones (§4.3.4, §11.3.1); sin prueba el estudio sigue siendo A, con B como sensibilidad. Documentar una red existente es la Situación C1 (sustitución, §7.2.3); el informe de una sola empresa aislada es C2 (asignación, sin créditos, §7.2.3), con costes solo a nivel de empresa (decisión de diseño de T4.6).',
      options: {
        micro: 'Explora o respalda una elección, aunque sea hipotética y sin un decisor nombrado, y sus efectos se quedan en las plantas implicadas (Situación A)',
        structural: 'Respalda una elección cuyos efectos cambian lo que produce todo un mercado o sector (Situación B; la prueba debe documentarse)',
        none: 'Ninguna elección: documenta lo que aporta una red o un sistema existente, tal como es (Situación C1)',
        corporate_report: 'Informe de una sola empresa aislada (ESG / CSRD), sin créditos por lo que la simbiosis evita en otro lugar (Situación C2)',
      },
      screening: {
        label: '¿Está documentado que el cambio desplaza un 1 % o más de la nueva capacidad del mercado afectado?',
        yes: 'Sí, está documentado (Situación B)',
        no: 'No (Situación A, con la Situación B como análisis de sensibilidad)',
      },
      plain:
        '¿Para qué sirve el estudio? Casi siempre explora o respalda una elección cuyos efectos se quedan en las plantas implicadas, aunque nadie tenga que decidir todavía. Solo cuando el cambio es lo bastante grande como para alterar lo que produce todo un mercado, y se puede demostrar, el estudio cambia de naturaleza. Si solo describes una red que ya funciona, o las cifras de una sola empresa, dilo: cada caso se modela de forma distinta.',
    },
    q10: {
      title: 'Q10 — ¿El estudio sirve a un objetivo de política pública u ordenación territorial?',
      help: 'Opcional. Sin respuesta, el motor la deduce de Q1 (sí solo para Q1 = C).',
      details: 'D4.2 §2.3 añade un ACC societal (factor fiscal neto, externalidades monetizadas, tasa de descuento social) cuando el estudio sirve a un objetivo de política pública u ordenación territorial, sea cual sea Q1 o Q4. Un municipio que planifica un parque ecoindustrial (Q1 = B) o un regulador que supervisa un sector (Q1 = E) puede responder sí sin ser Q1 = C. Con Q1 = D la herramienta mantiene el ACC convencional a nivel de empresa (decisión de diseño T4.6) y te lo avisa.',
      options: {
        unset: 'Sin respuesta (deducida de Q1)',
        yes: 'Sí — objetivo de política pública u ordenación territorial (añade el ACC societal)',
        no: 'No — no sirve a un objetivo de política u ordenación',
      },
      plain:
        "Responde sí si el estudio sirve a una decisión pública — un municipio, una región, un regulador, un plan. Añade entonces una segunda lectura económica desde el punto de vista de la sociedad: impuestos contados de otro modo, y efectos que nadie paga en dinero. Para la cuenta propia de una sola empresa la lectura económica se queda a nivel de empresa, y la herramienta te lo dice. Sin respuesta, la herramienta la deduce de la primera pregunta.",
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
    q5Note: "Responde con el acuerdo tal como está hoy — pactado, o previsto si el intercambio aún no existe. Es una hipótesis de partida, no un resultado: si el estudio cambia quién paga a quién, vuelve y cámbialo. Elige «gratuito / ambiguo» cuando esté realmente sin decidir.",
    emptyHint: 'Sin flujos. Añade al menos uno para caracterizar la Q5 por flujo.',
    headers: { id: 'ID', name: 'Nombre', q5: 'Q5', sellable: '¿Vendible a otros?', sector: 'Sector (Parte 2)' },
    sellable: { unset: '— sin respuesta', yes: 'Sí', no: 'No' },
    sellableHint: 'Si el socio no tomara este flujo, ¿podría quien lo genera venderlo a otro a un precio positivo? Sí lo convierte en coproducto, no en residuo, sea cual sea el precio acordado (D4.1 §8.3.3). Opcional: el resultado señala cuándo no concuerda con Q5.',
    sectorHint: 'Qué es el flujo, si entra en uno de los sectores con reglas propias en la Parte 2 del D4.1. Opcional: el resultado indica el capítulo a seguir.',
    sectorNone: '— ninguno de estos',
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
      "Aquí un escenario varía las respuestas *metodológicas*, no la red física: hereda Q1–Q7 de la línea base y solo difiere por el dict de overrides. Comparar a dónde va un flujo, a qué distancia o a qué precio es una comparación de red — esas variantes se dibujan en el editor de red, y el motor todavía no las compara.",
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
      asset_lifetime: 'Años (heredado; se usa si el periodo de análisis y la vida útil de Q8 están vacíos); un horizonte por encima del umbral (15 por defecto) añade el fondo futuro al ACV y al ACC (lca_mc_21, lcc_hc_23, CIR-01)',
      future_background_threshold_years:
        'Años. El horizonte de estudio a partir del cual el ACV y el ACC requieren fondo futuro (lca_mc_21, lcc_hc_23, CIR-01). Por defecto 15, la cifra que el D4.2 §9.3 da sin fuente; si la cambias, justifícala en la carta metodológica',
      transport_sensitive: 'Booleano; true activa CIR-03',
      network_nodes: 'Entero; ≥3 (con Q1=B + interdependent_flows) activa CIR-04',
      interdependent_flows: 'Booleano; true (con Q1=B + network_nodes≥3) activa CIR-04',
      frontier_categories_active: 'Booleano; true activa CIR-06',
      is_specific_capital_goods: 'Booleano; true activa IR-13 / B-06 / CIR-08',
      multi_actor: 'Booleano; true (con Q1∈{B,C}) activa FU-02',
    },
  },

  narrative: {
    pathway: {
      'IS-01': {
        title: 'Simbiosis operativa — apoyo a la decisión',
        body: 'Un intercambio simbiótico entre dos empresas, o dentro de un eco-parque, evaluado para decidir si realizarlo y cómo.',
        detail: 'Q1 says the object is a specific exchange or a park; Q2 says you are deciding rather than reporting. The pipeline therefore configures decision support: by default attributional modelling with substitution and an LCC tied to the perspective you chose (the ILCD situation and the LCC type below show what applies to your answers) and — when Q2 is a baseline plus alternatives — a comparison across scenarios.',
      },
      'IS-02': {
        title: 'Prefactibilidad sectorial — política pública',
        body: 'Una decisión de política o de programa a escala regional o nacional, cuyas consecuencias son estructurales y no marginales.',
        detail: 'Because the object is a public decision, everything downstream is scaled to consequences the background system will actually feel: by default the ILCD situation moves to B and the LCC gains the societal perspective, since a policy has to account for welfare and not only for the firms taking part. If you answered Q9 or Q10, the sections below show the situation and the costing that apply.',
      },
      'IS-03': {
        title: 'Contribución corporativa — reporte',
        body: 'La contribución simbiótica de una sola empresa dentro de una red, para reportes ESG / CSRD.',
        detail: 'The engine narrows to strict accounting: allocation rather than substitution credits (ILCD C2) and conventional LCC alone. The figure has to describe one company\'s own position in a way an auditor can trace, not the benefit the network produces collectively.',
      },
      'IS-04': {
        title: 'Red IS emergente — diseño ex-ante',
        body: 'Una red aún en diseño, evaluada con escenarios dinámicos y sin línea base operativa.',
        detail: 'Q1 is an exchange or a park, but Q2 says the system is still on the drawing board and is explored through dynamic scenarios rather than against an operating baseline. ADR-005 keeps this as its own pathway only for Q1 ∈ {A, B}: for a policy or a corporate report the object of study dominates the temporal stance.',
      },
      'IS-05': {
        title: 'Monitoreo — simbiosis en operación',
        body: 'Monitoreo de series temporales de una simbiosis ya operativa.',
        detail: 'No decision is on the table: the study documents a network that already runs. That puts it, by default, in ILCD C1 — accounting that still shows what the network gives the wider economy — and the value of the exercise is the time series, so the data collection has to be repeatable period after period.',
      },
    },
    extendedSuffix: 'La evaluación compara una línea base con escenarios alternativos.',
    ilcd: {
      'ILCD Situation A': {
        short: 'Apoyo a la decisión a nivel micro: el intercambio es demasiado pequeño para cambiar el sistema de fondo. Modelización atribucional, con sustitución sobre el mix de mercado medio.',
        detail: 'The exchange affects the actors involved, not what the wider economy produces or how. You therefore model with average, accounting-style data, and represent what the symbiosis displaces by substituting the average market mix — the national grid mix for electricity, average virgin production for a material. D4.1 warns explicitly against reaching for consequential modelling merely because a decision is being taken.',
      },
      'ILCD Situation A multi-actor': {
        short: 'Apoyo a la decisión a nivel micro en una red multiactor: la misma regla que la Situation A, aplicada a todo el parque en vez de a un solo intercambio.',
        detail: 'The modelling rule does not change — consequences stay micro-level, so average data and substitution at the market mix. What changes is the bookkeeping: several partners share one system, so the boundary and the shared flows have to be agreed between them before modelling starts, otherwise the same flow is counted twice or a partner\'s contribution disappears.',
      },
      'ILCD Situation B': {
        short: 'Apoyo a la decisión a nivel meso/macro: la decisión provoca un cambio estructural en el sistema de fondo, por tanto modelización consecuencial sobre la tecnología marginal. El D4.1 pide demostrar esa escala antes de elegirla.',
        detail: 'The decision is large enough to shift installed capacity or the output of a specific technology. Modelling goes consequential, and what the symbiosis displaces is the marginal technology, identified through a market analysis rather than taken as the average mix. The burden of proof is on you: this route has to be demonstrated, not assumed.',
      },
      'ILCD Situation C1': {
        short: 'Contabilidad con interacciones — documentar lo que una red existente aporta a la economía en general. Sustitución sobre el mix de mercado medio, como en la Situation A.',
        detail: 'You are documenting a network that exists rather than supporting a decision, so the study is descriptive. But since the point is to show what the network gives the wider economy, multifunctionality is still resolved by substitution at the average market mix — operationally the same rule as Situation A.',
      },
      'ILCD Situation C2': {
        short: 'Contabilidad estricta para un solo socio aislado: asignación, sin créditos por sustitución.',
        detail: 'Strict accounting for a single partner on its own, typically corporate reporting. Multifunctionality is resolved by allocation, and no credit is claimed for what the symbiosis displaces elsewhere: the number describes that partner\'s share of the burdens, not the benefit the network produces.',
      },
    },
    lcc: {
      'deactivated': {
        short: 'Sin análisis económico — la dimensión económica está desactivada en Q3.',
        detail: 'Q3 has no economic dimension selected, so the engine configures no costing at all. If the case needs a business case — and for a symbiosis that has to be signed by several firms it usually does — go back to Q3 and switch the economic dimension on.',
      },
      'C+E': {
        short: 'LCC convencional (los flujos de caja reales de la empresa) más LCC ambiental (la cadena de valor, sobre los mismos límites que la ACV).',
        detail: 'Two views run together. The conventional LCC answers whether it pays for the individual firm: real cash flows, taxes and fees as costs, subsidies as reductions. The environmental LCC widens the boundary to every actor in the life cycle and is kept consistent with the parallel LCA, so the two can be read side by side. Watch for double counting: a carbon or landfill tax already in the cash flows must not reappear as a monetised externality.',
      },
      'C+E+S': {
        short: 'LCC convencional y ambiental más LCC societal: impuestos y subvenciones ajustados con el Net Tax Factor, impactos ambientales monetizados.',
        detail: 'On top of the firm and value-chain views comes the welfare view. Taxes and subsidies are transfers inside society rather than real costs to it, so they are excluded or converted into shadow prices through the Net Tax Factor, and the environmental impacts from the parallel LCA are monetised. This is the configuration a public decision needs, which is why it comes with the policy pathway.',
      },
      'C-LCC': {
        short: 'Solo LCC convencional — la perspectiva de la empresa, equivalente a un análisis de coste total de propiedad.',
        detail: 'Only the firm\'s own perspective. Every policy instrument is a real cash flow: taxes and fees are costs, subsidies reduce capex or opex. It is the right frame for corporate reporting, and it deliberately says nothing about value-chain or societal effects — claiming those would overstate what a single-actor account can support.',
      },
      'C+N': {
        short: 'LCC convencional para cada socio, consolidado a nivel de red. Sin LCC ambiental: el caso no tiene un ACV con el que mantener la coherencia.',
        detail: 'Primero los flujos de caja reales de cada empresa, luego las mismas cuentas sumadas en la red, donde los pagos entre socios se anulan. El LCC ambiental queda fuera porque el D4.2 lo construye sobre la frontera de un ACV paralelo, y el caso no evalúa la dimensión ambiental. Activa la dimensión ambiental en Q3 si el estudio necesita la vista de cadena de valor.',
      },
      'C+N+S': {
        short: 'LCC convencional por socio y para la red, más LCC social con el Net Tax Factor. Sin un ACV, los impactos ambientales no se monetizan.',
        detail: 'Las cuentas de empresa y de red como arriba, más la vista de bienestar que necesita una decisión pública: impuestos y subvenciones convertidos con el Net Tax Factor, una tasa de descuento social y una frontera que llega al fin de vida. Falta la monetización de los impactos ambientales, que requiere los resultados de un ACV paralelo: activa la dimensión ambiental en Q3 para añadirla.',
      },
    },
    slca: {
      'active': {
        short: 'S-ACV activa: indicadores sociales por grupo de partes interesadas.',
        detail: 'The social dimension is on. Each stakeholder group — workers, consumers, local communities, value-chain actors — is mapped to the processes it is affected by, and from there to impact subcategories and indicators. The mapping is only as good as the engagement behind it, so talking to the groups involved is part of the data collection, not an optional extra.',
      },
      'deactivated': {
        short: 'S-ACV no activada — la dimensión social está desactivada en Q3.',
        detail: 'Q3 has no social dimension selected, so no stakeholder mapping and no social indicator are configured. Switch it on in Q3 if the case has to say anything about workers or local communities — which is usually the case when a symbiosis is presented to a municipality or a community.',
      },
    },
  },

  result: {
    notes: { title: 'Notas sobre tus respuestas' },
    verdict: {
      moreInfo: 'Más sobre esta configuración',
    },
    next: {
      obligations: "{{count}} prácticas metodológicas afectan a tus respuestas. Están listadas, con lo que las ha activado, en el Data Collection File.",
      title: 'Qué hacer ahora',
      lead:
        'Prácticas metodológicas que tus respuestas hacen obligatorias, más las decisiones aún abiertas. Cada una dice por qué afecta a tu caso.',
      provenance:
        "Los nombres y enunciados de las reglas están traducidos de la tabla inglesa del motor. El código junto a cada elemento — IR-01, CDP-02 — es la referencia que no cambia de un idioma a otro, y el nombre en inglés se mantiene al lado.",
      allClear:
        'Ninguna obligación metodológica se aplica a estas respuestas y no ha surgido ningún punto de decisión crítico. Siguiente paso: recoger los datos de inventario.',
      ctaHint: 'El Data Collection File está calibrado en este pathway: solo pide lo que tu caso necesita.',
    },
    actionKind: {
      block: 'Bloqueante',
      obligation: 'Por documentar',
      decision: 'Por decidir',
    },
    severity: {
      HIGH: 'Alta',
      MEDIUM: 'Media',
      LOW: 'Baja',
    },
    action: {
      appliesToCase: "Se aplica a este caso.",
      resolution: "Cómo se resuelve",
      why: 'Por qué te afecta',
      todo: 'Qué documentar',
    },
    technical: {
      title: 'Detalle técnico (salida del motor)',
      lead: 'Todo lo que la pipeline ha producido, para revisión y trazabilidad.',
    },
    title: 'Salida del motor',
    summary: {
      pathway: 'Pathway',
      ilcdSituation: 'Situación ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activatedNodes: 'Nodos activados',
      l1Blocks: 'BLOCK L1 disparados',
      l2Violations: "Fallos de aserción L2 (diagnóstico)",
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
      run: 'Calcular la ruta',
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
    errors: {
      registrationClosed: 'El registro está cerrado en esta instancia. Pide una cuenta al administrador.',
      emailTaken: 'Ya existe una cuenta con este email. Intenta iniciar sesión.',
      invalidCredentials: 'Email o contraseña incorrectos.',
    },
  },

  scoringPending: {
    title: "A la espera de los resultados",
    body:
      "Los resultados cuantitativos LCSA de este caso aún no se han entregado. Cuando lleguen, los indicadores ambientales, económicos y sociales aparecerán aquí.",
    lastChecked: "Última comprobación: {{date}}",
  },

  compliance: {
    status: {
      ok: "sí",
      no: "no declarado",
      pending: "pendiente",
      na: "no aplicable",
    },
  },
  stakeholder: {
    audience: {
      industry: {
        whatYouSee:
          "Lo que esta página te dice hoy: qué metodología seguirá la evaluación y, por tanto, qué datos se te pedirán. La petición en sí es el Data Collection File.",
        whenScoring:
          "Cuando lleguen los resultados verás los indicadores ambientales y económicos del caso, para juzgar si el intercambio compensa.",
      },
      community: {
        whatYouSee:
          "Lo que esta página te dice hoy: qué flujos intercambian las empresas y si este estudio examina o no los efectos sociales.",
        whenScoring:
          "Cuando lleguen los resultados verás los indicadores sociales — trabajadores, comunidad local — y los ambientales, cada uno con el grupo al que afecta.",
      },
      authority: {
        whatYouSee:
          "Lo que esta página te dice hoy: cómo está planteada la evaluación, qué señales de conformidad declara el caso y qué ámbito geográfico cubre.",
        whenScoring:
          "Cuando lleguen los resultados verás los valores ambientales y, donde el estudio los incluya, los costes societales — los dos pilares de una decisión pública.",
        scope: "Ámbito geográfico declarado para el caso: {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "Lo que esta página te dice hoy: qué materiales devuelve al uso esta simbiosis y si se examinan los efectos ambientales y sociales.",
        whenScoring:
          "Cuando lleguen los resultados verás los indicadores ambientales y sociales de la cadena que hay detrás del producto.",
        productCaveat:
          "Esta evaluación describe el intercambio entre las empresas, no el producto final que compras: la herramienta nunca pregunta cuál es el producto.",
      },
    },
    noVerdict: "Todavía no se ha derivado ninguna ruta para este caso.",
    notAssessed: {
      social: "Este estudio no evalúa impactos sociales: la dimensión social se desactivó al configurar el caso. Pide al analista que la active si los trabajadores o la comunidad local forman parte de la pregunta.",
      economic: "Este estudio no evalúa costes: la dimensión económica se desactivó al configurar el caso.",
    },
    flowsLine_one: "{{count}} flujo intercambiado: {{names}}.",
    flowsLine_other: "{{count}} flujos intercambiados: {{names}}.",
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
        'Vista técnica completa de la configuración metodológica y de la puntuación cuantitativa, producida fuera de esta herramienta por el socio de SYMBA CIRCE.',
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
    activatedNodesCount_one: '{{count}} nodo metodológico activado',
    activatedNodesCount_other: '{{count}} nodos metodológicos activados',
    obligations_one: "{{count}} práctica metodológica por documentar",
    obligations_other: "{{count}} prácticas metodológicas por documentar",
    cdpFlagsCount_one: '{{count}} tensión transversal',
    cdpFlagsCount_other: '{{count}} tensiones transversales',
    complianceTitle: 'Señales de cumplimiento',
    compliance: {
      peerReview: 'Revisión independiente por pares: {{status}}',
      pef: 'Alineación EU PEF (Q4=D): {{status}}',
      publicClaim: 'Afirmación pública (Q4=C): {{status}}',
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

  obligations: {
    empty: "Nada que documentar para este caso.",
    lead:
      "{{total}} elementos afectan a este caso: {{mandates}} mandatos metodológicos y {{rules}} reglas entre métodos activadas por tus respuestas. Cada uno es un compromiso que documentar en el informe LCSA.",
    because: "Se aplica porque:",
    notApplicable: "Aquí no se aplica: {{fields}} — ese método está desactivado en Q3.",
    origin: {
      mandate: "Mandato",
      rule: "Regla entre métodos",
    },
  },
  dcf: {
    noCase: { title: 'Aún no hay caso', desc: 'El Data Collection File se construye a partir de tu evaluación: responde primero el cuestionario (o abre un caso guardado) y vuelve aquí.', cta: 'Abrir el cuestionario' },
    derivedField: "rellenado por el motor",
    obligationsTitle: "Decisiones metodológicas por documentar",
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
    tabOverview: 'Resumen',
    tabNetworkBuilder: 'Editor de red',
  },

  networkDiagram: {
    counts: '{{actors}} actores · {{flows}} flujos',
    placeholder:
      'Solo vista previa — esto es un marcador construido con los flujos declarados en el cuestionario. Dibuja la red real en la pestaña Editor de red y aparecerá aquí, en el Excel y en el informe.',
  },

  networkBuilder: {
    loadExample: 'Cargar ejemplo',
    exampleReplaceConfirm:
      'Esto sustituye la red que hay ahora en el lienzo por el ejemplo. ¿Continuar?',
    whyAsked: 'Se pide porque:',
    hint: {
      step1: 'Añade un actor por cada participante en la simbiosis — una planta, una utility, un ayuntamiento.',
      step2: 'Arrastra desde el borde de un nodo hasta otro para conectarlos: esa flecha es una fila de la matriz de flujos.',
      step3: 'Selecciona un nodo o una flecha y rellena sus campos en el panel lateral. Solo se muestran los campos que necesita tu pathway.',
      dismiss: 'Entendido',
    },
    empty: {
      title: 'Todavía no has dibujado nada',
      body: 'Añade tu primer actor, o carga un ejemplo con tres actores y dos flujos para ver cómo se monta una red.',
    },
    example: {
      producer: 'Planta productora',
      consumer: 'Planta receptora',
      facilitator: 'Gestor del parque industrial',
      flow: 'Flujo de ejemplo',
    },
    title: 'Editor de red',
    subtitle:
      'Dibuja la red de simbiosis: cada nodo es un actor, cada flecha una fila de la matriz de flujos. Lo que dibujes aquí es lo que llevarán el Excel y el informe.',
    addActor: 'Añadir actor',
    actor: 'Actor',
    noRole: 'rol sin definir',
    save: 'Guardar red',
    saving: 'Guardando…',
    synced: 'Guardada en el servidor',
    unsavedChanges: 'Cambios sin guardar',
    unsavedCase: 'Borrador local — guarda el caso para sincronizar',
    saveCaseFirst:
      'Este caso todavía no está guardado en el servidor. Puedes dibujar la red ahora; guarda el caso desde la página de resultado para conservarla.',
    missingRequired_one: '{{count}} campo obligatorio aún vacío',
    missingRequired_other: '{{count}} campos obligatorios aún vacíos',
    selectHint: 'Selecciona un actor o un flujo para editar sus campos.',
    removeRow: 'Eliminar',
    unwiredTitle: 'Flujos aún no dibujados',
    unwiredHint:
      'Estos flujos provienen de tus respuestas Q5. Conecta dos actores en el lienzo para enlazar el siguiente.',
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
