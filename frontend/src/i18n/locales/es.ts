// Español. Términos metodológicos LCA/LCC/S-LCA + siglas ILCD/PEF/CSRD/MFCA
// /CBA/TEA sin traducir (normativos).

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
    summaryTitle: 'Resumen de la configuración',
    summary: { ilcd: 'Situación ILCD', lcc: 'Tipo LCC', slca: 'Estado S-LCA', sector: 'Sector', scope: 'Ámbito geográfico' },
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
      eyebrow: 'Región · {{code}}', title: 'Panel regional', lead: 'Vista agregada.', total: 'Casos', situations: 'Situaciones ILCD', sectors: 'Sectores',
      bySituationTitle: 'Por situación ILCD', bySectorTitle: 'Por sector', tableKey: 'Valor', tableCount: 'Cantidad',
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
    searchPlaceholder: 'Buscar casos, socios… (⌘K)',
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
      'Responde a diez preguntas breves sobre tu caso de simbiosis industrial. El motor de decisión deriva la configuración metodológica (situación ILCD, estructura LCC, horizonte del estudio, escenario de referencia) a partir de los 186 nodos Phase 1 de los entregables D4.1, D4.2 y D4.3, más las 40 reglas cross-method.',
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
      configured: 'Configurados',
      configuredDetail: '{{total}} en total',
      situations: 'Situaciones ILCD',
      situationsDetail: 'A · B · C1 · C2',
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
    title: 'Acerca de',
    p1:
      "SYMBA T4.6 ayuda a quien plantea una evaluación de sostenibilidad del ciclo de vida de una simbiosis industrial: a partir de diez preguntas sobre el caso deduce qué metodología se aplica, qué prácticas hay que documentar y qué datos recoger de los socios de la red. No calcula los resultados — la puntuación cuantitativa se produce fuera de la herramienta y aparece aquí cuando llega.",
    p2:
      'El cuestionario (Q1-Q11; Q9 fija la situación ILCD, Q10 el ACC societal) impulsa la activación de los 186 nodos Phase 1 más 40 reglas cross-method (18 IR + 10 CIR + 5 FU + 7 B). El enforcement L3 en tiempo de reporting (IR-04 + IR-10) más 12 Critical Decision Points hacen aflorar las tensiones cross-method.',
    p3:
      'La visualización de configuración por pillar, los overrides avanzados y el panel "Show reasoning" están todos operativos.',
  },

  error: {
    title: 'Algo salió mal',
    backHome: 'Volver al inicio',
    fallback: 'Error inesperado',
  },

  questionnaire: {
    scopeNote: "Esta herramienta no calcula las cifras de ACV/LCC/S-ACV. Deriva la configuración metodológica que tu caso requiere y los datos que debes recoger; la puntuación cuantitativa se produce externamente y aparece aquí cuando llega.",
    title: 'Cuestionario',
    guidedBannerTitle: 'Modo guiado activo',
    guidedBannerBody:
      "Cada pregunta empieza con una explicación breve, en palabras sencillas. La nota metodológica completa, con la redacción de los entregables del proyecto, queda a un clic debajo de cada pregunta. Las diez respuestas determinan la configuración metodológica y el plan de recolección de datos que recibirás al final.",
    intro:
      'Diez preguntas sobre tu caso de simbiosis industrial. Q1 y al menos una dimensión Q3 son obligatorias; el resto es opcional pero mejora la salida del motor.',
    runButton: 'Calcular la configuración',
    runningButton: 'Calculando…',
    resetButton: 'Reiniciar borrador',
    confirmReset: '¿Descartar todas las respuestas y empezar de nuevo? No se puede deshacer.',
    q1Required: 'Q1 es obligatoria.',
    shortcutTip: 'Tip: Ctrl/⌘+Enter para ejecutar',

    q1: {
      title: 'Q1 — ¿Qué estás analizando? *',
      help:
        'Elige la opción más cercana: cuenta el sujeto del estudio, no quien lo encarga. Describe el sistema y su límite; cómo se modela el estudio lo deciden Q9 y las preguntas siguientes. (Obligatoria.)',
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
        'Di qué estás examinando: un intercambio, un parque, un programa, una empresa, una simbiosis que sigues en el tiempo. La respuesta describe el sistema y su límite; cómo se modela el estudio lo deciden las preguntas siguientes, empezando por para qué sirve el estudio (Q9). Si dudas entre dos opciones, quédate con la que describe aquello cuyos efectos quieres medir.',
    },

    q2: {
      title: 'Q2 — ¿Los intercambios que mide el estudio ya tienen lugar?',
      details:
        'Responde sobre los intercambios simbióticos, no sobre las plantas: una planta puede existir mientras el intercambio que estudias es todavía un proyecto. A — sí: los intercambios ocurren hoy y sus flujos se pueden medir (p. ej. Kalundborg; el distrito curtidor de Daddi 2017). La referencia es lo que haría hoy cada empresa si se cortaran los vínculos (HNSRS, D4.1 §11.1). Si la red funciona desde hace muchos años, esa referencia es un contrafactual moderno, no la configuración de las empresas de hace décadas (D4.1 §11.2.2): de eso trata la pregunta de seguimiento. B — todavía no: los intercambios están previstos, diseñados, son hipotéticos o acaban de empezar, aunque sea entre plantas que ya funcionan. La referencia es la situación actual sin ellos, incluidos los intercambios que ya funcionan (CNSRS, D4.1 §11.1). Comparar alternativas (una ampliación, una tecnología nueva) está abierto a todo estudio: añádelas como escenarios abajo (D4.1 §4.3.3). Cuándo opera el sistema se pregunta en Q8.',
      options: {
        A: { label: 'A. Sí, ya tienen lugar', description: 'Los intercambios ocurren hoy: sus flujos se pueden medir.' },
        B: { label: 'B. Todavía no', description: 'Previstos, diseñados o recién iniciados, incluso entre plantas que ya existen.' },
      },
      longStanding: {
        label: '¿La red funciona desde hace muchos años, de modo que las plantas que sustituyó hoy ya no se construirían?',
        yes: 'Sí — la referencia es un contrafactual moderno (D4.1 §11.2.2)',
        no: 'No — la red es reciente',
      },
      plain:
        'Piensa en los intercambios, no en las plantas. Si los flujos entre las empresas ya ocurren, puedes medirlos. Si todavía son una idea, aunque sea entre plantas que ya funcionan, solo puedes estimarlos. ¿Quieres comparar alternativas, como una ampliación o una tecnología nueva? Añádelas como escenarios abajo, sea cual sea tu respuesta aquí.',
    },

    q3: {
      title: 'Q3 — ¿Qué dimensiones de sostenibilidad incluir? *',
      help: 'Al menos una es obligatoria. Ambiental y económica son la pareja habitual.',
      details:
        'ENV — Análisis de Ciclo de Vida ambiental (LCA): impactos en clima, ecosistemas, uso de recursos. Casi siempre seleccionada. ' +
        'ECO — dimensión económica, evaluada con Life Cycle Costing (LCC, D4.2). MFCA (Material Flow Cost Accounting, ISO 14051) es una técnica usada dentro del LCC (activada por ECO y por los flujos discutidos en Q5), no una alternativa; CBA y TEA no las ofrece este motor. ' +
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
        'C — CLAIM público de que el sistema es mejor que una alternativa con la misma función, o equivalente a ella (p. ej. "este cemento es más verde que el OPC"), hecho público en cualquier forma: informe, web o artículo científico (comparative assertion, ISO 14040 §3.6; D4.1 §15.3.4). Activa la critical review obligatoria ISO 14044 por 3+ expertos independientes y desactiva la ponderación. Usar con cuidado. ' +
        'D — alineamiento con instrumentos de política UE (digital product passport ESPR, reglas de categoría PEFCR). Fuerza la PEF Circular Footprint Formula vía CIR-05. El informe estricto de una sola empresa (CSRD, ESG) se declara en Q9, no aquí: usa allocation, no la CFF. ' +
        'E — publicación académica peer-reviewed. Requiere transparencia total (fuentes de datos, decisiones de allocation, sensibilidad). A menudo combinada con B o D. Si el artículo afirma que un sistema es mejor que una alternativa competidora o equivalente a ella, marca también C; una comparación que no declara un ganador sigue siendo E (lectura T4.6). ' +
        'Selección múltiple posible: un paper PEF típico elige D + E.',
      options: {
        A: { label: 'A. Interno', description: 'Uso interno (gestión, I+D, planificación).' },
        B: { label: 'B. Externo (sin claim)', description: 'Comunicación externa sin afirmaciones comparativas.' },
        C: {
          label: 'C. Claim público de superioridad',
          description: 'Afirmación pública de superioridad o equivalencia frente a una alternativa con la misma función, en cualquier forma (artículos incluidos).',
          warn: 'Activa la revisión OBLIGATORIA por panel de 3+ expertos independientes (ISO 14044), no se permite ponderación.',
        },
        D: {
          label: 'D. Alineamiento con política UE',
          description: 'Alineamiento con política UE (ESPR, PEF/PEFCR).',
          warn: 'Activa la PEF Circular Footprint Formula (CIR-05).',
        },
        E: { label: 'E. Publicación académica', description: 'Publicación académica peer-reviewed (añade C si afirma que un sistema supera o iguala a una alternativa competidora).' },
      },
      plain:
        "Quién leerá el resultado, y qué hará con él, decide cuán estricto debe ser el método. Una nota interna es el caso más ligero. Alinearse con los instrumentos de la UE (pasaporte de producto, PEF) impone la manera europea de contar el material reciclado y recuperado. Afirmar en público que tu producto es mejor que otro es el caso más pesado: exige una revisión independiente por expertos externos. Vale dondequiera que lo digas, también en un artículo científico. Puedes elegir más de una.",
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
      help: 'El sector principal del caso, como descripción. Las reglas sectoriales de la D4.1 Part 2 siguen el sector de cada flujo intercambiado, declarado en la tabla de flujos.',
      details:
        'El sector describe el caso y abre algunos campos específicos en el Data Collection File; las reglas sectoriales de la D4.1 Part 2 siguen el sector declarado para cada flujo, porque los capítulos siguen lo que se intercambia. Elige la coincidencia más cercana al sector dominante del caso (el actor que aporta más masa/energía/valor). ' +
        'Ejemplos: pulp_paper para Sokka 2011 (UPM Kymi); cement_construction para Hashimoto 2010 (Kawasaki); textile_leather para Daddi 2017 (distrito curtidor); wastewater_sludge_biofactories para Wiktor 2018; chemicals_fertilizers para Leiva 2025 Escombreras; biobased_polymers para Briassoulis. ' +
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
        'El sector principal del caso: la actividad de la empresa que más pesa en masa, energía o valor. Describe el caso; las reglas sectoriales de las guías siguen lo que es cada flujo, que declaras en la tabla de flujos. Si el caso abarca varios sectores, elige Multisector e ignora las entradas (legacy).',
    },

    q6b: {
      title: 'Q6b — Technology Readiness Level (TRL)',
      details:
        'TRL de la tecnología dominante o crítica en la red simbiótica. Determina la elección de la calidad de los datos de inventory (medidos vs literatura vs estimación de ingeniería) y el presupuesto de incertidumbre downstream. ' +
        'Es el TRL de la tecnología clave en sí, no de su adopción: una tecnología madura que trata el mismo tipo de insumo a la misma escala que en otros lugares, usada por primera vez en esta red o región, sigue siendo TRL 9, y la novedad se ve en la calidad de los datos (lectura T4.6); un proceso maduro aplicado a un insumo nunca tratado a escala es un intercambio de bajo TRL (D4.1 §9.3.5). ' +
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
        "Cuán madura es la tecnología clave: en explotación comercial, primera planta piloto, prototipo, o todavía en laboratorio. Cuanto menos madura, más serán tus cifras estimaciones y no medidas, y más tendrá el resultado que cargar con su propia incertidumbre. Juzga la tecnología en sí, no si es nueva aquí: un proceso probado usado por primera vez en tu región sigue siendo maduro, siempre que trate el mismo tipo de material que en otros lugares.",
    },

    q7: {
      title: 'Q7 — ¿Qué tan concentradas están las interacciones clave?',
      help: 'Fija cómo se regionaliza la evaluación de impactos. El transporte se modela de forma explícita para cada intercambio, sea cual sea la respuesta; la distancia de equilibrio se pide para cada flujo en el Data Collection File.',
      details:
        'D4.1 §12.2.3: un factor de caracterización medio global o nacional no capta la relevancia de un sistema cuyas interacciones clave son intensamente locales (p. ej. una sinergia de uso compartido del agua en una región árida). A — un emplazamiento o plantas contiguas: factores específicos del lugar para escasez de agua, eutrofización y acidificación, y el desajuste de escala señalado donde se aplican factores regionales a nivel de emplazamiento (§12.3.3). B — dentro de una región: factores regionalizados, p. ej. los factores por país de Seppälä / Posch para un clúster regional (§12.3.3). C — entre regiones o más allá de las fronteras: factores espacialmente explícitos en el lugar de cada emisión. El transporte nunca depende de esta respuesta: cada enlace es un proceso unitario distinto del primer plano con datos primarios, y se recomienda SIG o cálculo de rutas para cada intercambio (§12.3.1). La segunda parte pregunta el mercado del que vienen los productos sustituidos: los mix de fondo y el escenario de referencia se resuelven sobre él, por regla nacional o subnacional, continental solo para bienes comercializados a escala mundial sin mercado subcontinental (§11.3.1).',
      options: {
        A: { label: 'A. Un emplazamiento', description: 'Un emplazamiento o plantas contiguas: las interacciones son intensamente locales.' },
        B: { label: 'B. Regional', description: 'Varios emplazamientos dentro de una región.' },
        C: { label: 'C. Entre regiones', description: 'Emplazamientos entre regiones o más allá de las fronteras.' },
      },
      market: {
        label: 'Mercado de referencia: ¿de dónde vendrían los productos sustituidos?',
        help: 'El mercado del que tomaría el contrafactual, no el mercado de los productos de la simbiosis. Opcional.',
        region: 'País o región',
        regionPlaceholder: 'p. ej. Italia, Cataluña, UE',
        scope: {
          national: 'Nacional',
          sub_national: 'Subnacional (una región dentro de un país)',
          continental: 'Continental (solo para bienes comercializados en todo el mundo)',
        },
      },
      plain:
        'Qué tan cerca ocurren las interacciones clave entre las empresas: en un emplazamiento, dentro de una región, o entre regiones o más allá de las fronteras. Decide a qué escala local se evalúan los impactos ambientales: la contaminación del agua o del aire junto a un emplazamiento no pesa igual que la misma cantidad repartida por un país. El transporte se cuenta en todo caso. Después di de dónde vendrían si no los productos que la simbiosis sustituye: un país, una región o, para bienes comercializados en todo el mundo, un continente.',
    },
    q8: {
      title: 'Q8 — Horizonte temporal del estudio',
      help: 'Opcional. Un solo horizonte para el ACV y el ACC.',
      details: 'Los entregables exigen un solo horizonte temporal para el ACV, el ACC y el ACV-S (D4.2 §11, D4.1 §14). Los escenarios de fondo futuros (SSP/RCP) se añaden a ambos cuando el sistema funciona en un año futuro (D4.1 §9.3.5, §12.3.2), cuando la tecnología clave está por debajo de TRL 7 (Q6b) o cuando el periodo de análisis o la vida útil de los activos principales supera 15 años (D4.2 §9.3, que da la cifra sin fuente; se puede cambiar en los ajustes avanzados). Sin respuesta, el año de funcionamiento es el del estudio. El periodo de análisis es el lapso que cubre el estudio; por norma coincide con la vida útil técnica de los activos principales (D4.2 §9). La vida útil de los activos principales es también el periodo de amortización de sus bienes de capital, el mismo en ACV y ACC (D4.1 §6.3.3, §14.2.2); los activos con otra vida útil van en el archivo de recogida de datos.',
      start: {
        label: '¿En qué año funciona el sistema, o se supone que funciona?',
        options: {
          unset: 'Sin respuesta (el año del estudio)',
          now: 'Ahora: el año del estudio',
          future: 'Un año futuro',
        },
        yearPlaceholder: 'p. ej. 2030',
      },
      period: {
        label: '¿Durante cuántos años sigue el estudio al sistema (periodo de análisis u horizonte del proyecto)?',
        placeholder: 'p. ej. 25; vacío para la fotografía de un año',
      },
      lifetime: {
        label: 'Vida útil técnica de los activos principales: cuánto duran físicamente las plantas, no el horizonte del proyecto (también su periodo de amortización)',
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
      title: 'Q10 — ¿El estudio sirve a un objetivo público o a un decisor público? *',
      help: 'Obligatoria cuando la dimensión económica está activa: decide si se añade el ACC societal.',
      details: 'La D4.2 §2.3 añade un ACC societal (factor fiscal neto, externalidades monetizadas, tasa de descuento social) cuando el estudio sirve a un objetivo de política pública u ordenación territorial, y el §2.2 vincula la elección del tipo de ACC a la perspectiva del decisor: un municipio, una empresa de servicios públicos o un regulador adoptan el punto de vista público, sea cual sea el sujeto del estudio (la D4.2 §9.2 indica un 3-5 % como tasa de un socio municipal o de una empresa de servicios públicos). Un municipio que planifica un ecoparque o una empresa pública que dimensiona una conexión de calefacción urbana responde que sí. El informe estricto de una sola empresa (Q9: informe corporativo, situación C2) mantiene el costeo a nivel de empresa (elección de diseño de T4.6), y la herramienta lo indica.',
      options: {
        yes: 'Sí — un objetivo de política pública u ordenación, o un decisor público (añade el ACC societal)',
        no: 'No — una decisión privada o la cuenta propia de una empresa',
      },
      plain:
        'Responde que sí si el estudio debe alimentar una decisión pública, o lo encarga un organismo público: un municipio, una región, una empresa de servicios públicos, un regulador, un plan. Se añade entonces una segunda lectura económica desde el punto de vista de la sociedad: los impuestos contados de otra manera, y los efectos que nadie paga en dinero. Para la cuenta propia de una empresa, la lectura económica se queda a nivel de empresa.',
    },

    q11: {
      title: "Q11 — ¿Qué compara el estudio?",
      help: "Opcional. Fija la base de la unidad funcional; sin respuesta, se aplica la unidad orientada a la función de la D4.1 Part 1.",
      details: "La D4.1 Part 2 pide que la unidad funcional refleje la función principal del sistema (§4.3, §6.3, §8.3): una unidad basada en la entrada (p. ej. tratamiento de 1 tonelada de residuo) cuando el estudio compara vías de gestión de un residuo o el desempeño de una planta o servicio; una unidad basada en la salida (p. ej. 1 kg de producto, 1 MJ de energía) cuando compara productos con alternativas de mercado o respalda una afirmación de sustitución; un sistema de unidades funcionales cuando ambas funciones son coprincipales (Part 1 §5.3.2). La D4.2 §3.1 pide para el LCC una unidad doble (residuo tratado + producto obtenido) cuando la sustitución de producto guía el estudio: los dos entregables difieren; la herramienta sigue la Part 2 para el ACV e indica la diferencia.",
      options: {
        unset: "Sin respuesta (unidad orientada a la función, D4.1 Part 1)",
        waste_treatment: "Cómo se gestiona un residuo — vías de gestión, desempeño de una planta o servicio (unidad basada en la entrada)",
        product_substitution: "Productos frente a alternativas de mercado — qué sustituye el producto recuperado (unidad basada en la salida)",
        co_primary: "Ambas: el servicio de tratamiento y los productos cuentan por igual (sistema de unidades funcionales)",
      },
      plain:
        "¿Sobre qué trata realmente la comparación? Si la pregunta es cómo tratar mejor un residuo — quemarlo, digerirlo, compostarlo —, el resultado se cuenta por tonelada de residuo tratado. Si la pregunta es si el producto recuperado es mejor que el que sustituye, se cuenta por unidad de producto. Si ambas cuentan por igual, se cuentan una al lado de la otra.",
    },

    q2dCard: {
      title: 'Escenarios alternativos (opcional)',
      help:
        'Todo estudio puede comparar alternativas con su situación de partida (D4.1 §4.3.3).',
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
    headers: { id: 'ID', name: 'Nombre', q5: 'Q5', sellable: '¿Vendible a otros?', sector: 'Sector (Parte 2)', configuration: "Configuración (Parte 2)" },
    sellable: { unset: '— sin respuesta', yes: 'Sí', no: 'No' },
    sellableHint: 'Si el socio no tomara este flujo, ¿podría quien lo genera venderlo a otro a un precio positivo? Sí lo convierte en coproducto, no en residuo, sea cual sea el precio acordado (D4.1 §8.3.3). Opcional: el resultado señala cuándo no concuerda con Q5.',
    sectorHint: "Elige el capítulo de la D4.1 Part 2 de lo que se intercambia, no de la empresa: residuos agrícolas y agroindustriales → Agroalimentario (§4); residuos municipales o mezclados, biorresiduos incluidos (fracción orgánica de los RSU, restos de comida domésticos) → Valorización de residuos (§8); lodos y aguas residuales tratadas, también cuando se reutilizan como agua → Aguas residuales (§6); un producto o vector energético obtenido de un flujo (biometano, digestato, electricidad) → el capítulo de ese flujo. Donde §4 y §8 se solapan en los biorresiduos, decide el origen (lectura T4.6 de la Part 2 §3.3). Opcional: el resultado lista las reglas del capítulo.",
    sectorNone: '— ninguno de estos',
    configurationHint: "La configuración típica del flujo dentro de su capítulo de la Part 2 (D4.1 Part 2 §4.1-§8.1): el resultado indica el producto convencional que sustituye. Elige primero el sector.",
    configurationNone: "— sin respuesta",
    configurations: {
      agrifood_ad_bioenergy_fertiliser: "Residuos orgánicos a bioenergía y fertilizante (digestión/compostaje)",
      agrifood_feed_bioconversion: "Subproductos agroalimentarios a pienso (bioconversión)",
      agrifood_platform_chemicals: "Residuos agrícolas a químicos de base / bioplásticos",
      agrifood_high_value_compounds: "Residuos agroindustriales a compuestos de alto valor",
      agrifood_nutrient_recovery: "Recuperación de nutrientes como enmienda / fertilizante",
      plastics_mechanical_recycling: "Reciclaje mecánico (ciclo abierto o cerrado)",
      plastics_chemical_recycling: "Reciclaje químico (termoquímico/despolimerización)",
      plastics_reusable_packaging: "Envases reutilizables (PSS)",
      plastics_biobased_packaging: "Envases de base biológica / biodegradables",
      plastics_upcycling: "Supraciclaje y descontaminación para ciclos de alto valor",
      wastewater_nutrient_recovery: "Recuperación de nutrientes (P y N) como fertilizantes",
      wastewater_sludge_to_energy: "Aguas residuales/lodos a energía (biogás/cogeneración o upgrading)",
      wastewater_sludge_pyrolysis: "Pirólisis de lodos a biochar y vectores energéticos",
      wastewater_water_reuse: "Regeneración y reutilización del agua",
      wastewater_screening_srf: "Residuos de desbaste a CSR para la industria",
      wastewater_microalgae: "Biorrefinerías de microalgas en aguas residuales",
      textiles_fibre_to_fibre: "Reciclaje fibra a fibra (ciclo cerrado)",
      textiles_downcycling: "Infraciclaje a no tejidos y compuestos (ciclo abierto)",
      textiles_chemical_valorisation: "Valorización química a bioquímicos/monómeros",
      textiles_recycled_carbon_fibre: "Fibra de carbono reciclada para textiles técnicos",
      textiles_pss_reuse: "Sistemas producto-servicio (PSS) y reutilización",
      wv_srf_coprocessing: "RSU/CDR/CSR a energía (coprocesamiento)",
      wv_biowaste_nutrients_energy: "Biorresiduos a nutrientes y energía",
      wv_tailings_construction: "Residuos industriales/relaves a materiales de construcción y metales",
      wv_weee_urban_mining: "RAEE y minería urbana",
      wv_plastic_upcycling: "Supraciclaje de residuos plásticos (mecánico/termoquímico)",
    },
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
      asset_lifetime: 'Años (heredado; se usa si la vida útil de Q8 está vacía); un horizonte por encima del umbral (15 por defecto) añade el fondo futuro al ACV y al ACC (lca_mc_21, lcc_hc_23, CIR-01)',
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
    ilcd: {
      'ILCD Situation A': {
        title: 'Apoyo a la decisión con consecuencias limitadas (situación ILCD A)',
        short: 'Apoyo a la decisión a nivel micro: el intercambio es demasiado pequeño para cambiar el sistema de fondo. Modelización atribucional, con sustitución sobre el mix de mercado medio.',
        detail: 'The exchange affects the actors involved, not what the wider economy produces or how. You therefore model with average, accounting-style data, and represent what the symbiosis displaces by substituting the average market mix — the national grid mix for electricity, average virgin production for a material. D4.1 warns explicitly against reaching for consequential modelling merely because a decision is being taken.',
      },
      'ILCD Situation B': {
        title: 'Apoyo a la decisión con consecuencias estructurales (situación ILCD B)',
        short: 'Apoyo a la decisión a nivel meso/macro: la decisión provoca un cambio estructural en el sistema de fondo, por tanto modelización consecuencial sobre la tecnología marginal. El D4.1 pide demostrar esa escala antes de elegirla.',
        detail: 'The decision is large enough to shift installed capacity or the output of a specific technology. Modelling goes consequential, and what the symbiosis displaces is the marginal technology, identified through a market analysis rather than taken as the average mix. The burden of proof is on you: this route has to be demonstrated, not assumed.',
      },
      'ILCD Situation C1': {
        title: 'Documentar una red existente (situación ILCD C1)',
        short: 'Contabilidad con interacciones — documentar lo que una red existente aporta a la economía en general. Sustitución sobre el mix de mercado medio, como en la Situation A.',
        detail: 'You are documenting a network that exists rather than supporting a decision, so the study is descriptive. But since the point is to show what the network gives the wider economy, multifunctionality is still resolved by substitution at the average market mix — operationally the same rule as Situation A.',
      },
      'ILCD Situation C2': {
        title: 'Contabilidad estricta de una sola empresa (situación ILCD C2)',
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
        detail: 'On top of the firm and value-chain views comes the welfare view. Taxes and subsidies are transfers inside society rather than real costs to it, so they are excluded or converted into shadow prices through the Net Tax Factor, and the environmental impacts from the parallel LCA are monetised. This is the configuration a public decision needs, which is why a public or policy objective brings it in.',
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
    engineNotes: {
      q9_unanswered: "Q9 no tiene respuesta, así que la situación ILCD (situación {{situation}}) se deduce de Q1, como en los casos guardados antes de que existiera Q9. Responde a Q9: la Tabla 1 de la D4.1 fija la situación según la decisión y la escala de sus consecuencias, no según el sujeto del estudio.",
      q10_unanswered: {
        yes: "Q10 no tiene respuesta, así que si el estudio sirve a un objetivo público se deduce de Q1: se añade el ACC societal, como en los casos guardados antes de que existiera Q10. Responde a Q10: la D4.2 §2.3 añade el ACC societal para un objetivo de política pública u ordenación o para un decisor público, sea cual sea el sujeto del estudio.",
        no: "Q10 no tiene respuesta, así que si el estudio sirve a un objetivo público se deduce de Q1: no se añade el ACC societal, como en los casos guardados antes de que existiera Q10. Responde a Q10: la D4.2 §2.3 añade el ACC societal para un objetivo de política pública u ordenación o para un decisor público, sea cual sea el sujeto del estudio.",
      },
      structural_without_screening: "Q9 indica efectos estructurales, pero el cribado de mercado no está documentado: el estudio se trata como Situación ILCD A, y la Situación B debe probarse como sensibilidad (D4.1 §4.3.4, §11.3.1).",
      structural_screening_missing: "La Situación B exige probar que el cambio desplaza alrededor del 1 % o más de la nueva capacidad del mercado afectado (D4.1 §11.3.1); documéntalo, o el estudio queda en Situación A con B como sensibilidad (D4.1 §4.3.4).",
      decision_scale_vs_q1: {
        c_micro: "Q1 (prefactibilidad sectorial) suele implicar consecuencias a escala estructural; has respondido consecuencias limitadas, así que el estudio se trata como Situación ILCD A. D4.1 §4.3.4: no elijas el ACV consecuencial solo porque se toma una decisión.",
        e_micro: "Q1=E (seguimiento) no implica decisiones; has respondido que el estudio respalda una decisión de consecuencias limitadas, así que se trata como Situación ILCD A.",
        e_structural: "Q1=E (seguimiento) no implica decisiones; has respondido que el estudio respalda una decisión de consecuencias estructurales, así que se trata como Situación ILCD B.",
      },
      q1_d_not_corporate: "Q1=D describe el reporte de sostenibilidad de una empresa, pero Q9 dice que el estudio no es un informe corporativo; la situación ILCD sigue a Q9. El reporte corporativo estricto (asignación, sin créditos) es la Situación ILCD C2 (D4.1 §7.2.3).",
      documentation_vs_ex_ante: 'La situación ILCD C documenta intercambios que ya tienen lugar, pero Q2 dice que todavía no tienen lugar. Comprueba que la situación es la que pretendes.',
      c2_keeps_c_lcc: "El reporte estricto de una sola empresa (Situación ILCD C2) mantiene el costeo a nivel de empresa (solo C-LCC) diga lo que diga Q10: es una decisión de diseño de T4.6, porque una sola empresa no tiene nivel de red.",
      policy_no_but_q1_c: "Q1=C (prefactibilidad sectorial) suele servir a una política pública; has respondido que no, así que no se añade el costeo social (S-LCC, net tax factor, tasa de descuento social).",
      lcc_without_lca: {
        plain: "Q3 no incluye la dimensión ambiental, así que no hay un ACV paralelo: el costeo es el LCC convencional de cada socio, consolidado a nivel de red (D4.2 §4.1), sin el LCC ambiental, que la D4.2 construye sobre el límite del ACV.",
        policy: "Q3 no incluye la dimensión ambiental, así que no hay un ACV paralelo: el costeo es el LCC convencional de cada socio, consolidado a nivel de red (D4.2 §4.1), sin el LCC ambiental, que la D4.2 construye sobre el límite del ACV. El LCC social mantiene el net tax factor y la tasa de descuento social, pero sin resultados de ACV las externalidades no se pueden monetizar (D4.2 §11.2).",
      },
      c2_allocation_over_pef: "El reporte estricto de una sola empresa (Situación ILCD C2) usa asignación y ningún crédito de sustitución (D4.1 §7.2.3), así que la Circular Footprint Formula de la PEF que pide Q4=D no se aplica: la CFF es un método de producto. Si el estudio es una huella de producto y no un informe corporativo, revisa Q9.",
      slca_alone: "Q3 selecciona solo la dimensión social. La D4.3 §3.1 construye el ACV social sobre la unidad funcional y los límites de un ACV o un LCC; si no se selecciona ninguno, documenta la unidad de referencia y el límite en la carta metodológica.",
      flow_sellable_but_waste: "Flujo «{{flow}}»: Q5 dice que el generador paga por deshacerse de él (residuo), pero un tercero pagaría por él. D4.1 §8.3.3 y §8.3.6 paso 1: un flujo con un valor de mercado positivo e independiente es un coproducto, y su carga aguas arriba se reparte (sustitución o asignación), no se corta. Revisa Q5 para este flujo.",
      flow_price_without_market: "Flujo «{{flow}}»: Q5 dice que el receptor paga por él (coproducto), pero ningún tercero lo haría. D4.1 §8.3.3: sin un mercado independiente el precio es una tasa administrativa y el flujo es un residuo, con carga cero desde el punto en que alcanza por primera vez un valor no negativo (§8.3.6 paso 4). La excepción es un generador que modifica su proceso para el socio (Q5 = d).",
      flow_freedom_to_act_settles: {
        co_product: "Flujo «{{flow}}»: Q5 deja abierto quién paga a quién; la respuesta Freedom-to-Act (D4.1 §8.3.3) lo lee como coproducto (§8.3.2, carga repartida).",
        waste: "Flujo «{{flow}}»: Q5 deja abierto quién paga a quién; la respuesta Freedom-to-Act (D4.1 §8.3.3) lo lee como residuo (carga cero desde el punto en que alcanza por primera vez un valor no negativo, §8.3.6 paso 4).",
      },
      flow_part2_chapter: "Flujo «{{flow}}»: se le aplican las reglas sectoriales de la D4.1 Part 2 {{chapter}}; aparecen en Reglas sectoriales.",
      case_sector_without_flow: "El sector del caso pertenece a la D4.1 Part 2 {{chapter}}, pero ningún flujo declara ese capítulo, así que sus reglas sectoriales no se listan. Los capítulos siguen lo que se intercambia: declara el sector de la Part 2 de cada flujo en la tabla de flujos.",
      flow_configuration_unknown: "Flujo «{{flow}}»: la configuración «{{configuration}}» no es una de la D4.1 Part 2.",
      flow_configuration_other_chapter: "Flujo «{{flow}}»: su configuración pertenece a {{chapter}}, no al capítulo declarado {{declared}}; se listan las reglas de ambos capítulos.",
    },
    sectorChapters: { '§4': "§4 Agroalimentario y biorrefinerías", '§5': "§5 Plásticos y envases", '§6': "§6 Aguas residuales y biofactorías", '§7': "§7 Textil y textiles técnicos", '§8': "§8 Valorización de residuos" },
    sectorRules: {
      title: 'Reglas sectoriales (D4.1 Part 2)',
      lead: 'Las reglas que la D4.1 Part 2 da para los sectores que toca tu caso. La herramienta no las aplica por ti: documenta en el estudio cómo se cumplió cada una.',
      activatedBy: 'Se aplican por: {{reasons}}',
      byFlow: 'el flujo «{{name}}»',
      byCaseSector: 'el sector del caso (Q6a)',
      configurationLine: "Flujo «{{flow}}» — {{configuration}}: el producto convencional que sustituye es {{substitutes}}.",
      c2NoCredit: "Situación C2: no se aplica ningún crédito de sustitución (D4.1 §7.2.3); el producto solo describe la configuración.",
      count: '{{count}} reglas',
      strength: { must: 'obligatorio', should: 'recomendado', descriptive: 'práctica' },
    },
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
      ctaHint: 'El Data Collection File está calibrado en esta configuración: solo pide lo que tu caso necesita.',
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
    empty: 'Todavía no hay comparación de escenarios. En el cuestionario define uno o más escenarios alternativos y luego pulsa «Ejecutar escenarios» en la página de resultados.',
    description: 'Pipeline ejecutada para la baseline + {{n}} escenarios alternativos. Diferencias destacadas vs baseline.',
    backToResult: 'Volver al resultado único',
    columns: {
      scenario: 'Escenario',
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
      run: 'Calcular la configuración',
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
    pipelineCompleted: 'Pipeline completada en {{ms}} ms — {{situation}}',
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
    noVerdict: "Todavía no se ha derivado ninguna configuración para este caso.",
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
        'Vista regulatoria y de política: configuración metodológica, peer-review, alineación EU PEF.',
      'end-user':
        'Vista resumen para usuarios finales de los productos derivados de la simbiosis.',
    },
    verdictTitle: 'Configuración metodológica',
    labels: {
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
      'Desglose de todos los casos guardados por situación ILCD, estructura LCC, sector y ámbito geográfico. Para autoridades locales y analistas de políticas.',
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
      byLccType: 'Por estructura LCC',
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
      'Calibrado sobre la configuración derivada. Descarga el archivo Excel para recolectar datos de inventario con los socios de la simbiosis, y vuelve aquí para el informe final.',
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
      step3: 'Selecciona un nodo o una flecha y rellena sus campos en el panel lateral. Solo se muestran los campos que necesita tu configuración.',
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
      situation: 'Situación ILCD',
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
