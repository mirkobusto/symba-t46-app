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
    confirm: 'Continuar',
    save: 'Guardar',
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
    lead: 'Envía una de estas URLs a un stakeholder. Mismo caso, encuadre diferente para cada audiencia. Para la etiqueta de un producto, comparte el enlace End user.',
    close: 'Cerrar', done: 'Hecho', copy: 'Copiar', copied: 'Copiado ✓',
    copyFailed: 'No se pudo copiar — copia la URL manualmente.',
    saveFirstTitle: 'Guarda primero el caso',
    saveFirstBody: 'Para compartir, el caso tiene que estar guardado en el servidor, y para guardarlo hace falta una cuenta. Inicia sesión, guarda el caso con «Guardar como nuevo…» y vuelve a abrir esta ventana.',
    audience: { industry: '🏭 Industria', community: '🌳 Comunidad', authority: '🏛 Autoridad local', enduser: '👤 Usuario' },
  },

  reader: {
    tagline: 'Informe público',
    // plain titles for the public views (decided by Fable, UX round 2026-11-03)
    verdict: {
      A: { title: 'Un intercambio local, evaluado con datos medios', body: 'El intercambio es pequeño frente a la economía en su conjunto: el estudio describe lo que sustituye con datos medios de mercado (el mix eléctrico nacional, el material virgen medio). Esto no dice nada sobre lo grandes que son sus efectos en las plantas o en el territorio: eso es lo que medirá el estudio.' },
      B: { title: 'Una decisión a gran escala, evaluada con los cambios de mercado que provoca', body: 'La decisión es lo bastante grande como para cambiar lo que la economía construye o cierra: el estudio modela esos cambios en lugar de usar datos medios.' },
      C1: { title: 'Una red existente, descrita tal como funciona', body: 'No se toma ninguna decisión: el estudio documenta lo que la red ya aporta, frente a lo que cada empresa haría sin ella.' },
      C2: { title: 'Las cuentas propias de una sola empresa', body: 'El estudio informa de la parte de las cargas de una sola empresa, sin crédito por lo que sus intercambios ahorran en otra parte.' },
    },
    labelLine: '¿Este enlace viene de la etiqueta de un producto? Esta página describe cómo se estudiarán los intercambios entre las empresas. Todavía no dice nada sobre el producto que has comprado.',
    loading: 'Cargando el informe…',
    notFoundTitle: 'Informe no encontrado',
    notFoundBody: 'No hay ningún informe con este código. Comprueba que has copiado el enlace completo, o pídeselo de nuevo a quien te lo envió.',
    tryAnother: 'Probar otro enlace o código',
    aboutLink: 'Conocer SYMBA',
    open: {
      eyebrow: "Informe compartido",
      title: "Abrir un informe que has recibido",
      lead: "Pega el enlace que te enviaron, o solo el código del caso al final (por ejemplo agri-b-sita-19a8).",
      label: "Enlace o código del caso",
      placeholder: "https://…/r/…",
      invalid: "No parece el enlace de un informe. Pega el enlace completo que recibiste, o el código después de /r/.",
      submit: "Abrir el informe",
      noLink: "¿No tienes enlace? Pídeselo a quien te habló del caso. Para saber qué es SYMBA:",
    },
    eyebrow: 'Informe compartido · {{name}}',
    summaryTitle: "Cómo se hará la evaluación",
    scoringTitle: "Resultados",
    complianceTitle: 'Señales de cumplimiento',
    whatTitle: "Qué es esta página",
    whatBody: "Cómo debe evaluarse este caso de simbiosis industrial: qué decisiones de método se aplican y qué datos hay que recoger. Todavía no contiene resultados (ni emisiones, ni costes, ni datos sociales) y no es una certificación de ninguna empresa ni producto. Las cifras las calcula aparte quien realiza el estudio.",
    caseTitle: "El caso",
    running: { yes: "Estos intercambios ya tienen lugar.", no: "Estos intercambios están previstos o acaban de empezar." },
    market: "Mercado de referencia: {{market}}",
    updated: "Guardado el {{date}}",
    methodEyebrow: "Cómo se evaluará",
    sectorTag: "Sector: {{sector}}",
    scaleTag: "Interacciones: {{scale}}",
    compliance: {
      peer: { name: "Revisión independiente", desc: "Un revisor comprueba el estudio según la ISO 14044, como en una publicación científica." },
      pef: { name: "Huella ambiental de producto UE (PEF)", desc: "El estudio sigue el método europeo de huella, incluida la Circular Footprint Formula.", descC2: "No aplicable: las cuentas de una sola empresa usan asignación, no la Circular Footprint Formula (ILCD C2)." },
      public: { name: "Afirmación comparativa pública", desc: "Afirmar en público que un producto es mejor o equivalente a otro exige un panel de revisión ISO." },
      dnsh: { name: "Taxonomía UE «no causar un perjuicio significativo» (DNSH)", desc: "Una verificación aparte para la financiación ligada a la taxonomía (art. 17); esta herramienta no la realiza." },
      slcc: { name: 'Planteado para una decisión pública (LCC social)', yes: 'Sí: el cálculo de costes incluye la lectura de la sociedad que necesita una decisión pública (impuestos y subvenciones corregidos, efectos ambientales valorados) — D4.2 §2.3.', no: 'No: el cálculo de costes se queda a nivel de empresa y de cadena de valor. Si un organismo público tiene que decidir sobre este caso, pide al analista que plantee el estudio para un objetivo público (Q10).', c2: 'No aplicable: las cuentas de una sola empresa se calculan solo a nivel de empresa.', off: 'No evaluado: el estudio no tiene dimensión económica.' },
      notPlanned: "no prevista en este estudio",
      notAssessed: "no evaluada por esta herramienta",
    },
    audience: {
      showingFor: 'Vista para — {{name}}',
      industry: { short: '🏭 Industria', name: 'Industria', title: 'Vista operador', body: 'Vista técnica completa.' },
      community: { short: '🌳 Comunidad', name: 'Comunidad', title: 'Impacto local', body: "Qué cambia para quienes viven cerca de las plantas: efectos sobre el entorno local y sobre las personas, positivos y negativos." },
      authority: { short: '🏛 Autoridad', name: 'Autoridad local', title: 'Vista regulatoria', body: "Cómo se plantea la evaluación: costes, bienes compartidos, escenario de referencia, afirmaciones públicas, horizonte, efectos sociales." },
      enduser: { short: '👤 Usuario', name: 'Usuario final', title: 'Resumen', body: "De qué trata este caso y qué se evaluará. Todavía no hay resultados." },
    },
    note: "Cada pestaña muestra el mismo caso desde un punto de vista distinto; los hechos son los mismos en las cuatro.",
    about: {
      isTitle: "¿Qué es la simbiosis industrial?",
      isBody: "Cuando los restos de una empresa (suero, serrín, calor, agua) se convierten en la materia prima de otra en lugar de tirarse.",
      eyebrow: 'Acerca de SYMBA T4.6', title: 'Informes públicos', lead: 'Alguien compartió un caso contigo.',
      whoTitle: '¿Quién está detrás?', whoBody: "SYMBA es un proyecto de investigación financiado por la Unión Europea (Horizon Europe, acuerdo de subvención 101135562) que desarrolla herramientas abiertas para la simbiosis industrial en la industria de base biológica. Esta herramienta la ha desarrollado ENCO, con CIRCE y CET; no pertenece a ninguna de las empresas cuyos casos describe.",
      whatTitle: '¿Qué es un informe?', whatBody: "Un informe compartido describe cómo debe evaluarse un caso de simbiosis industrial: qué intercambios entre empresas abarca y qué decisiones de método se aplican a su evaluación ambiental, económica y social. Las cuatro pestañas cuentan el mismo caso a cuatro tipos de lector.",
      whereTitle: '¿Dónde saber más?', whereBody: 'Visita el sitio del proyecto',
      enterTool: 'Entrar en la herramienta',
      backToReport: "Volver al informe",
    },
    region: {
      eyebrow: 'Región · {{code}}', title: 'Panel regional', lead: 'Vista agregada.', total: 'Casos', situations: 'Situaciones ILCD', sectors: 'Sectores',
      bySituationTitle: 'Por situación ILCD', bySectorTitle: 'Por sector', tableKey: 'Valor', tableCount: 'Cantidad',
      errorTitle: 'Región no disponible', errorBody: 'No se pudieron cargar los datos.',
    },
  },

  welcome: {
    title: "Bienvenido a SYMBA",
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
      assess: { name: 'Iniciar una nueva evaluación', desc: 'Configura la metodología para un caso IS con un breve cuestionario.' },
      read: { name: 'Leer un informe compartido', desc: 'Abre un caso compartido y ve el informe.' },
      explore: { name: 'Explorar una región / sector', desc: "Mira cómo se reparten los casos guardados entre métodos y sectores." },
      browse: { name: 'Solo mirar', desc: 'Sin objetivo específico — quiero ver qué hace la herramienta.' },
    },
  },

  adminShell: {
    menuOpen: "Menú",
    menuClose: "Cerrar",
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
    intro: {
      what: { title: "Qué hace", body: "Te dice cómo debe plantearse la evaluación de un intercambio de simbiosis industrial, según las directrices SYMBA, y qué datos recoger de las empresas implicadas." },
      not: { title: "Qué no hace", body: "No calcula los resultados: ni emisiones, ni costes, ni datos sociales. Los calcula quien realiza el estudio, con los datos que pide la herramienta." },
      who: { title: "Para quién es", body: "Analistas de sostenibilidad y consultores plantean aquí sus estudios; empresas, organismos públicos y asociaciones leen los informes y ven qué datos se les pedirán." },
    },
    title: "SYMBA — evaluar la simbiosis industrial",
    tagline: "Cómo plantear la evaluación ambiental, económica y social de un intercambio entre empresas, y qué datos recoger.",
    description: "Responde a preguntas sobre tu caso: el residuo, el subproducto, el calor o el agua de una empresa que se convierten en materia prima de otra. Obtienes la configuración metodológica que debe seguir el estudio y un Data Collection File para enviar a los socios.",
    startButton: 'Iniciar nueva evaluación',
    modeLabel: "Cómo quieres responder",
    modeExpert: 'Experto',
    modeGuided: 'Guiado',
    modeHint: {
      expert: 'Cuestionario rápido para analistas IS y revisores familiarizados con la terminología ILCD / LCSA.',
      guided: 'Modo paso a paso para industriales, representantes comunitarios y responsables políticos. Cada pregunta lleva una explicación en palabras sencillas; la nota metodológica completa queda a un clic.',
    },
    hero: { title: 'Iniciar una nueva evaluación IS' },
    openCasesLink: 'O abrir un caso guardado',
    presetsTitle: "Ejemplos publicados",
    presetsMeta: "13 casos de artículos científicos revisados por pares",
  },

  // DRAFT: English until the notice has been through legal review and is translated.
  docxReport: {
    title: "Informe del caso",
    intro: "Generado por la herramienta SYMBA. Recoge las respuestas, la configuración que la herramienta ha deducido de ellas y lo que el estudio debe documentar: el mismo contenido que la página de resultado.",
    verdict: "Veredicto",
    meaning: "Qué significa esta configuración",
    next: "Qué hacer ahora",
    nextNone: "A estas respuestas no se aplica ninguna obligación metodológica y no ha surgido ningún punto de decisión crítico. Siguiente paso: recoger los datos (ver el Data Collection File).",
    whyHere: "Por qué se aplica aquí:",
    toDocument: "Qué documentar:",
    answers: "1. Las respuestas",
    config: "2. La configuración deducida por la herramienta",
    situation: "Situación ILCD",
    lccType: "Tipo de LCC",
    slca: "Evaluación social (S-LCA)",
    nodes: "Nodos activados",
    blocks: "Bloqueos",
    obligations: "Obligaciones por documentar",
    cdps: "Puntos de decisión críticos",
    none: "(ninguno)",
    notSet: "(sin respuesta)",
    notes: "Notas sobre las respuestas",
    sectorRules: "Reglas sectoriales (D4.1 Part 2)",
    appliesBecause: "se aplica por",
    flow: "el flujo",
    caseSector: "el sector del caso (Q6a)",
    pillars: "Salida del motor, clave por clave (en inglés, como se traza en los entregables)",
    noPillars: "(ningún valor escrito)",
    summary: "3. Resumen",
    blocked: "Bloqueado: las respuestas activan los bloqueos indicados arriba; revísalas.",
    complete: "Configuración completa: {{obligations}} obligaciones por documentar y {{cdps}} puntos de decisión críticos por resolver, indicados arriba.",
    appendix: "4. Anexo: nodos activados",
    countsByPrefix: "Recuento por prefijo",
    scenarios: "Escenarios alternativos definidos",
    advanced: "Ajustes avanzados",
    q: {
      q0: "Q0 tipo de estudio",
      q1: "Q1 qué analizas",
      q2: "Q2 los intercambios ya tienen lugar",
      q2b: "Q2b red de larga duración",
      q3: "Q3 dimensiones",
      q4: "Q4 uso de los resultados",
      q5: "Q5 quién paga a quién, por flujo",
      q5extra: "Por flujo: vendible a otros / sector Part 2",
      q6a: "Q6a sector",
      q6b: "Q6b madurez tecnológica",
      q7: "Q7 concentración de las interacciones clave",
      q7b: "Q7b mercado de referencia",
      q8a: "Q8a año de operación",
      q8b: "Q8b periodo de análisis (años)",
      q8c: "Q8c vida de los activos (años)",
      q9: "Q9 decisión y escala",
      q9b: "Q9b cribado de mercado documentado",
      q10: "Q10 objetivo público",
      q11: "Q11 qué compara el estudio",
      q12: "Q12 bienes dedicados y compartidos",
    },
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
          "Hosting provider: [PLACEHOLDER]. Links of the form /r/… are unlisted, not private: anyone who has the link can read that report. Saving a case on the server requires an account; each saved case can be read and changed only by its owner and by the administrator (the first account registered), who can read and change every case: do not enter personal data of third parties."
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
    whoTitle: "Quién la ha hecho",
    whoBody: "La herramienta la ha desarrollado ENCO, con CIRCE y CET, como tarea T4.6 de SYMBA, un proyecto financiado por el programa Horizon Europe de la Unión Europea (acuerdo de subvención 101135562). No pertenece a ninguna de las empresas cuyos casos evalúa.",
    sourcesTitle: "En qué se basa",
    sourcesBody: "Preguntas, reglas y peticiones de datos siguen los entregables metodológicos del paquete de trabajo 4 de SYMBA: D4.1 (análisis del ciclo de vida de la simbiosis industrial, con sus capítulos sectoriales), D4.2 (coste del ciclo de vida) y D4.3 (análisis social del ciclo de vida). Cada fila del resultado cita la sección de la que procede.",
    notTitle: "Qué no hace",
    notBody: "No calcula resultados ambientales, económicos ni sociales (ni kg CO2eq, ni VAN, ni indicadores sociales): dice cómo plantear el estudio y qué datos recoger. Las cifras las calcula quien realiza el estudio, con programas dedicados de ACV y de costes.",
    divergencesTitle: "Dónde se aparta de los entregables, a propósito",
    divergencesLead: "Algunas decisiones son de la herramienta, indicadas aquí para que un revisor las vea:",
    divergences: {
      c2: "Las cuentas de una sola empresa (Situación ILCD C2) solo se valoran a nivel de empresa: una decisión de la herramienta, no una regla de la D4.2.",
      situation: 'Un estudio de una red existente que evalúa una opción para ella (una mejora, una ampliación) se lee como Situación A; uno que solo documenta la red es Situación C1 (lectura T4.6 de la tabla 1 y del §4.3.2 de la D4.1).',
      uncertainty: 'La matriz Pedigree se escribe como obligatoria cuando los resultados van a un panel de revisión, a la alineación con las políticas de la UE o a una publicación (Q4 = C, D o E) y como recomendada en los demás casos, y se activa tanto para el ACV como para el LCC cuando los intercambios aún no se producen (Q2 = B, regla CIR-02); el Monte Carlo se pide para el ACV con sus propias condiciones (Q4 = C, D o E, o tecnología por debajo de TRL 9) y siempre para el cálculo de costes. La D4.1 §13.3.2 y la D4.2 §7.1, §10.3 piden ambos en todo estudio.',
      policy: "La alineación con las políticas de la UE (Q4 = D) introduce los precios CE Delft y la asignación por net tax factor, que la D4.2 vincula al LCC social.",
      assets: 'Q12 cuenta los bienes construidos para los intercambios, hoy o hace años, aunque los use una sola empresa (D4.1 §6.3.3: propios del escenario de simbiosis), donde la D4.2 §4.2 habla de bienes nuevos y compartidos.',
    },
    contactTitle: "Contacto",
    contactBody: "Para preguntas sobre la herramienta o el proyecto, escribe desde la página de contacto del sitio de SYMBA:",
    technicalTitle: "Detalles técnicos (para especialistas)",
    title: 'Acerca de',
    p1:
      "SYMBA T4.6 ayuda a quien plantea una evaluación de sostenibilidad del ciclo de vida de una simbiosis industrial: a partir de un cuestionario sobre el caso deduce qué metodología se aplica, qué prácticas hay que documentar y qué datos recoger de los socios de la red. No calcula los resultados — la puntuación cuantitativa se produce fuera de la herramienta y aparece aquí cuando llega.",
    p2:
      'El cuestionario (Q0-Q12; Q9 fija la situación ILCD, Q10 el ACC societal) impulsa la activación de los 186 nodos Phase 1 más 40 reglas cross-method (18 IR + 10 CIR + 5 FU + 7 B). El enforcement L3 en tiempo de reporting (IR-04 + IR-10) más 12 Critical Decision Points hacen aflorar las tensiones cross-method.',
  },

  error: {
    title: 'Algo salió mal',
    backHome: 'Volver al inicio',
    fallback: 'Error inesperado',
  },

  questionnaire: {
    parts: {
      study: 'El estudio',
      exchanges: 'Los intercambios',
      description: 'Descripción del caso',
    },
    scopeNote: "Esta herramienta no calcula las cifras de ACV/LCC/S-ACV. Deriva la configuración metodológica que tu caso requiere y los datos que debes recoger; la puntuación cuantitativa se produce externamente y aparece aquí cuando llega.",
    title: 'Cuestionario',
    guidedBannerTitle: 'Modo guiado activo',
    guidedBannerBody:
      "Cada pregunta empieza con una explicación breve, en palabras sencillas. La nota metodológica completa, con la redacción de los entregables del proyecto, queda a un clic debajo de cada pregunta. Las respuestas determinan la configuración metodológica y el plan de recolección de datos que recibirás al final.",
    intro:
      'Preguntas sobre tu caso de simbiosis industrial, en tres partes: el estudio, los intercambios y una descripción del caso. Obligatorias: las dimensiones (Q3), la decisión y su escala (Q9), el sujeto (Q1) y, con la dimensión económica, el objetivo público (Q10); el resto es opcional y afina la configuración.',
    introPlain: "Preguntas sobre tu intercambio entre empresas, en tres partes. Las marcadas con * son obligatorias; las demás hacen el resultado más preciso. Bajo cada pregunta encontrarás una breve explicación en palabras sencillas.",
    runButton: 'Calcular la configuración',
    runningButton: 'Calculando…',
    resetButton: 'Reiniciar borrador',
    confirmReset: '¿Descartar todas las respuestas y empezar de nuevo? No se puede deshacer.',
    stepper: {
      progress: "Pregunta {{n}} de {{total}} · {{part}}",
      back: "← Atrás",
      next: "Siguiente →",
      showAll: "Mostrar todas las preguntas en una página",
      showSteps: "Una pregunta cada vez",
      navLabel: "Preguntas",
    },
    examplesLink: "¿Quieres ver cómo responde un estudio real? Carga un ejemplo publicado",
    stillRequired: "Falta responder:",
    flowsMissingQ5: "quién paga a quién, para cada flujo",
    shortcutTip: 'Tip: Ctrl/⌘+Enter para ejecutar',

    q0: {
      title: 'Q0 — ¿Qué tipo de estudio de simbiosis es: análisis, mejora, ampliación, diseño o reestructuración?',
      help: 'Opcional. El tipo de estudio, tal como la D4.1 pide declararlo en el objetivo. Por sí solo no cambia nada.',
      details: 'La D4.1 §4.3.2, siguiendo a Mattila et al. (2012), pide clasificar el objetivo según un marco consolidado. Análisis evalúa una red existente para entender su desempeño; Mejora identifica los puntos críticos de una red existente para optimizarla; Ampliación evalúa los impactos de añadir un nuevo socio o intercambio; Diseño compara opciones tecnológicas y logísticas para una red nueva, planificada; Reestructuración evalúa una reconfiguración importante de una red consolidada. La respuesta va en el informe y en el Data Collection File; cómo se modela el estudio lo siguen decidiendo las preguntas siguientes. El motor solo señala dos contradicciones: un análisis cuyos intercambios todavía no tienen lugar, y un diseño cuyos intercambios ya tienen lugar (Q2).',
      options: {
        unset: { label: 'Sin respuesta' },
        analysis: { label: 'Análisis', description: 'Evaluar una red existente para entender su desempeño.' },
        improvement: { label: 'Mejora', description: 'Encontrar los puntos críticos de una red existente para optimizarla.' },
        expansion: { label: 'Ampliación', description: 'Evaluar los impactos de añadir un nuevo socio o intercambio.' },
        design: { label: 'Diseño', description: 'Comparar opciones tecnológicas y logísticas para una red nueva, planificada.' },
        restructuring: { label: 'Reestructuración', description: 'Evaluar una reconfiguración importante de una red consolidada.' },
      },
      plain:
        'Elige el tipo de estudio: entender cómo funciona una red existente, encontrar dónde puede mejorar, añadir un socio o un intercambio, diseñar una red nueva o replantear una consolidada. La respuesta queda registrada con el estudio; por sí sola no cambia el método.',
    },

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
        A: { label: 'A. Intercambio específico', description: "Un intercambio simbiótico entre dos empresas, existentes o en proyecto." },
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
        label: "¿La red funciona desde hace tanto tiempo que las alternativas que sustituyó (p. ej. las calderas que usaría la calefacción urbana) hoy ya no se construirían?",
        yes: 'Sí — la referencia es un contrafactual moderno (D4.1 §11.2.2)',
        no: 'No — la red es reciente',
        unknown: "No lo sé — la referencia es lo que haría hoy cada empresa sin los vínculos",
      },
      plain:
        'Piensa en los intercambios, no en las plantas. Si los flujos entre las empresas ya ocurren, puedes medirlos. Si todavía son una idea, aunque sea entre plantas que ya funcionan, solo puedes estimarlos. ¿Quieres comparar alternativas, como una ampliación o una tecnología nueva? Añádelas como escenarios abajo, sea cual sea tu respuesta aquí.',
    },

    q3: {
      title: 'Q3 — ¿Qué dimensiones de sostenibilidad incluir? *',
      help: 'Al menos una es obligatoria. Ambiental y económica son la pareja habitual.',
      details:
        'ENV — Análisis de Ciclo de Vida ambiental (LCA): impactos en clima, ecosistemas, uso de recursos. Casi siempre seleccionada. ' +
        'ECO — dimensión económica, evaluada con Life Cycle Costing (LCC, D4.2). La MFCA (Material Flow Cost Accounting, ISO 14051) es una técnica usada dentro del LCC, no una alternativa; esta herramienta no ofrece ACB ni TEA. ' +
        'SOC — ACV social. Seleccionarla añade las reglas sociales (categorías de partes interesadas: trabajadores, comunidad local, cadena de valor). ' +
        'La mayoría de papers IS publicados ejecutan solo ENV (p. ej. Sokka, Daddi); algunos acoplan ENV+ECO (Hashimoto, Wiktor); solo unos pocos añaden SOC.',
      warning: 'Selecciona al menos una dimensión para continuar.',
      env: 'Ambiental (LCA)',
      eco: 'Económica (LCC)',
      soc: 'Social (S-LCA)',
      plain:
        "Tres evaluaciones distintas, cada una con su método y sus datos: ambiental, económica — los costes a lo largo de todo el ciclo de vida, no un análisis coste-beneficio — y social. Elige las que piensas entregar. La mayoría de los estudios publicados hacen solo la ambiental, y añadir la económica es el paso siguiente habitual; la social exige mucha más información de las personas implicadas, así que cuenta con ir a recogerla.",
    },

    q4: {
      title: "Q4 — ¿Cómo usarás y comunicarás los resultados?",
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
        "Añade una fila por cada flujo simbiótico principal e indica quién paga a quién. Obligatorio cuando analizas un intercambio, una red o una sola empresa (Q1 = A, B o D); opcional en otro caso.",
      details:
        'Para cada flujo principal intercambiado entre actores (calor, CO₂, escoria, aguas residuales, hidrógeno…) indica quién paga a quién: ' +
        'a — A paga a B por llevarse el flujo (una tarifa de admisión: valor de mercado negativo, un RESIDUO para A, D4.1 §8.3.2). El cero-carga se aplica desde el punto en que el residuo alcanza por primera vez un valor no negativo, no en la puerta. Pagar no significa inevitable: D4.2 §6.2 exige además la prueba causal de evitabilidad, declarada por flujo en el Data Collection File. ' +
        'b — flujo intercambiado GRATIS (estado ambiguo): la prueba del valor económico decide si es un residuo o un coproducto, con un análisis de sensibilidad. ' +
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
        'Ejemplos: Pulpa y papel para Sokka 2011 (UPM Kymi); Cemento / construcción para Hashimoto 2010 (Kawasaki); Textil / cuero para Daddi 2017 (clúster de curtidurías); Aguas residuales / lodos / biofactories para Wiktor 2018; Química / fertilizantes para Leiva 2025 Escombreras; Polímeros de base biológica para Briassoulis. ' +
        'Para casos mixtos usa Multi-sector.',
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
        other: "Otro",
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
      title: 'Q7 — ¿Cuán concentradas están las interacciones clave?',
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
          unset: 'Sin respuesta',
          national: 'Nacional',
          sub_national: 'Subnacional (una región dentro de un país)',
          continental: 'Continental (solo para bienes comercializados en todo el mundo)',
        },
      },
      plain:
        'Cuán cerca ocurren las interacciones clave entre las empresas: en un emplazamiento, dentro de una región, o entre regiones o más allá de las fronteras. Decide a qué escala local se evalúan los impactos ambientales: la contaminación del agua o del aire junto a un emplazamiento no pesa igual que la misma cantidad repartida por un país. El transporte se cuenta en todo caso. Después di de dónde vendrían si no los productos que la simbiosis sustituye: un país, una región o, para bienes comercializados en todo el mundo, un continente.',
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
      title: "Q9 — ¿Qué decisión respalda el estudio y hasta dónde llegan sus consecuencias? *",
      help: 'Obligatoria. Fija la situación de modelado (ILCD A, B, C1 o C2); Q1 solo describe el objeto.',
      details: "La Tabla 1 de D4.1 clasifica el estudio por la decisión que respalda y la escala de sus consecuencias, no por su objeto (D4.1 §4.2.3). Micro (Situación A) es el valor por defecto para decisiones sobre intercambios e instalaciones concretos. Estructural (Situación B) se aplica cuando la decisión cambia la capacidad instalada de un mercado: el ILCD Handbook lo supone cuando la demanda u oferta anual que la decisión añade o retira de un mercado supera la capacidad que ese mercado renueva cada año, contando como máximo el 5 % (p. ej., 10 Mt de plantas con 25 años de vida renuevan 0,4 Mt al año). El diseño de un parque nuevo, una reestructuración regional o un programa requieren este cribado (Mattila et al. 2012); sin él, el estudio sigue siendo A, con B como análisis de sensibilidad. Documentar una red existente, o un informe de empresa que cuenta lo que sus intercambios ahorran en otros lugares, es Situación C1 (sustitución, §7.2.3); el informe de una sola empresa que excluye todo crédito por sus intercambios es C2 (asignación, sin créditos, §7.2.3), con costes solo a nivel de empresa (decisión de diseño de T4.6).",
      examples: {
        micro: "Por ejemplo: quieres saber si compensa dar tu serrín a la planta de pellets vecina, para empezar, mantener o cambiar el intercambio.",
        structural: "Por ejemplo: un programa regional lo bastante grande como para cambiar cuánto produce el mercado de la región. Un analista debe documentar la comprobación del mercado.",
        none: "Por ejemplo: quieres describir lo que una red de intercambios existente aporta hoy, para un informe, sin nada que decidir.",
        corporate_report: "Por ejemplo: el informe de sostenibilidad solo de tu empresa (CSRD, la directiva europea sobre información de sostenibilidad): los beneficios que tus intercambios aportan a otros no se cuentan.",
      },
      options: {
        micro: 'Explora o respalda una elección, aunque sea hipotética y sin un decisor nombrado, y sus efectos se quedan en las plantas implicadas (Situación A)',
        structural: "Respalda una elección que cambia cuánto produce un mercado o sector, más allá de la capacidad que renueva cada año (Situación B; el cribado debe documentarse)",
        none: "Ninguna elección: documenta lo que aporta una red o un sistema existente, incluido lo que ahorra en otros lugares (Situación C1)",
        corporate_report: "Informe de una sola empresa que excluye todo crédito por lo que sus intercambios evitan en otros lugares, p. ej. contabilidad ESG / CSRD estricta (Situación C2)",
      },
      screening: {
        label: "¿Está documentado que la cantidad anual que la decisión añade o retira del mercado afectado supera la capacidad que ese mercado renueva cada año (como máximo el 5 %)?",
        yes: 'Sí, está documentado (Situación B)',
        no: 'No (Situación A, con la Situación B como análisis de sensibilidad)',
      },
      plain:
        "¿Para qué sirve el estudio? Casi siempre explora o respalda una elección cuyos efectos se quedan en las plantas implicadas, aunque nadie tenga que decidir todavía. Solo cuando el cambio supera lo que el mercado renueva cada año, y puedes demostrarlo, el estudio cambia de tipo; diseñar un parque nuevo requiere esa comprobación. Si solo describes una red que ya funciona, o el informe de una empresa sin créditos por sus intercambios, dilo: cada caso se modela de forma distinta.",
    },
    q10: {
      title: 'Q10 — ¿El estudio sirve a un objetivo público o a un decisor público? *',
      help: 'Obligatoria cuando la dimensión económica está activa: decide si se añade el ACC societal.',
      details: 'La D4.2 §2.3 añade un LCC social (net tax factor, externalidades monetizadas, tasa de descuento social) cuando el estudio sirve a un objetivo de política pública o de planificación territorial, y el §2.2 vincula la elección del tipo de LCC a la perspectiva de quien decide. Quién decide: el organismo que encarga o usará el estudio. Un socio público dentro de la red (una empresa municipal de calefacción urbana, una depuradora pública) no hace pública por sí solo el objetivo: su coste público del capital entra a nivel de entidad (D4.2 §9.2) dentro de un cálculo de costes a nivel de empresa. Responde sí cuando sea ese organismo público quien decide sobre el caso, o cuando un plan o una política pública vaya a usar el estudio. Un municipio que planifica un ecoparque o un servicio público que dimensiona una conexión de calefacción urbana responden sí. El informe estricto de una sola empresa (Q9: informe corporativo, Situación C2) mantiene el cálculo de costes a nivel de empresa (una decisión de diseño de T4.6), y la herramienta te lo dice.',
      options: {
        yes: 'Sí — un objetivo de política pública u ordenación, o un decisor público (añade el ACC societal)',
        no: 'No — una decisión privada o la cuenta propia de una empresa, aunque haya un organismo público entre los socios',
      },
      plain:
        'Responde que sí si el estudio debe alimentar una decisión pública, o lo encarga un organismo público: un municipio, una región, una empresa de servicios públicos, un regulador, un plan. Se añade entonces una segunda lectura económica desde el punto de vista de la sociedad: los impuestos contados de otra manera, y los efectos que nadie paga en dinero. Para la cuenta propia de una empresa, la lectura económica se queda a nivel de empresa. Cuenta quién encarga o usará el estudio, no que haya un organismo público en la red. Ejemplo: una acería estudia vender calor a la red municipal — no; el municipio decide si conectarse — sí.',
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
    q12: {
      title: 'Q12 — ¿La simbiosis usa bienes dedicados?',
      help: 'Opcional, se pregunta cuando el ACV o el LCC están activos: conducciones, plantas, almacenes o equipos construidos para los intercambios, hoy o hace años, los use una sola empresa o varias.',
      details: 'La D4.2 §4.2 pregunta si la red requiere nuevos activos dedicados y compartidos: en tal caso, su CAPEX y su OPEX corriente deben incluirse en el desglose de costes y repartirse entre los socios que se benefician de ellos. La D4.1 §6.3.3 incluye los bienes de capital e infraestructuras propios del escenario de simbiosis, amortizados a lo largo de la vida técnica de cada activo (Q8). Con ACV y ACC activos, un sí activa también las reglas que alinean los bienes de capital entre ambos (IR-13, B-06); para parques y programas con la dimensión social, los indicadores S-ACV de inversión compartida (CIR-08). El socio beneficiario puede ser una sola empresa.',
      options: {
        unset: 'Sin respuesta',
        yes: 'Sí — se construyó algo para los intercambios (una conducción, una planta, un secadero, un depósito), aunque lo use una sola empresa',
        no: 'No — los intercambios solo usan bienes que existirían de todos modos',
      },
      plain:
        'Responde sí si se construyó algo, o hay que construirlo, para que los intercambios ocurran: una conducción, una planta de tratamiento, un depósito, un secadero, aunque se construyera hace años. Su coste y su huella entran entonces en el estudio y se imputan a quien se beneficia de ello: todo a una sola empresa si solo ella lo usa, repartidos si lo usan varias.',
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
    headers: { id: 'ID', name: 'Nombre', q5: "Quién paga a quién (Q5)", sellable: '¿Vendible a otros?', sector: 'Sector (Parte 2)', configuration: "Configuración (Parte 2)" },
    q5Unset: "— elige quién paga a quién",
    sellable: { unset: '— sin respuesta', yes: 'Sí', no: 'No' },
    sellableHint: "Si el socio no tomara este flujo, ¿podría el generador venderlo a otro a un precio positivo? Sí lo convierte en coproducto. No, por sí solo, no lo convierte en residuo: un único comprador que paga lo que pagaría un comprador independiente (el precio del producto que el flujo sustituye, descontados sus costes adicionales para usarlo) lo sigue convirtiendo en coproducto; un flujo cedido gratis, o un pago que solo reparte costes, lo convierte en residuo (D4.1 §8.3.3). Opcional: el resultado señala cuando no coincide con Q5.",
    sectorHint: "Elige el capítulo de la D4.1 Part 2 de lo que se intercambia, no de la empresa: residuos agrícolas y agroindustriales → Agroalimentario (§4); residuos municipales o mezclados, biorresiduos incluidos (fracción orgánica de los RSU, restos de comida domésticos) → Valorización de residuos (§8); lodos y aguas residuales tratadas, también cuando se reutilizan como agua → Aguas residuales (§6); un producto o vector energético obtenido de un flujo (biometano, digestato, electricidad) → el capítulo de ese flujo. Donde §4 y §8 se solapan en los biorresiduos, decide el origen (lectura T4.6 de la Part 2 §3.3). Opcional: el resultado lista las reglas del capítulo. La D4.1 Part 2 solo tiene capítulos para estos sectores de base biológica: para acero, cemento, calor, papel o química elige «— ninguno de estos» y solo se aplica la Part 1.",
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
      a: "a — quien cede (A) paga a quien recibe (B): residuo",
      b: 'b — Intercambio gratuito (ambiguo)',
      c: "c — quien recibe (B) paga a quien cede (A): co-producto",
      d: 'd — Interdependiente',
      e: 'e — Agregado / black-box',
    },
  },

  scenarios: {
    intro: "Un escenario cambia algunas respuestas del cuestionario y el motor lo ejecuta junto al caso: la comparación muestra después qué cambia en la configuración y en las obligaciones. Comparar redes distintas (adónde va un flujo, a qué distancia, a qué precio) es otra comparación: dibuja las alternativas en el editor de red; la herramienta aún no las compara.",
    emptyHint: 'Sin escenarios alternativos.',
    headers: { id: 'ID', label: 'Etiqueta' },
    labelPlaceholder: 'ej. Expansión futura / TRL9 ramp-up',
    addButton: 'Añadir escenario',
    removeAria: 'Eliminar {{id}}',
    addChange: "Añadir un cambio",
    pickQuestion: "Pregunta",
    newAnswer: "Nueva respuesta",
    removeChange: "Quitar este cambio",
    noChanges: "Ningún cambio: el escenario es igual al caso.",
    jsonToggle: "Editar como JSON (expertos)",
    otherKeys_one: "{{count}} cambio más definido como JSON",
    otherKeys_other: "{{count}} cambios más definidos como JSON",
    changesCount_one: "{{count}} cambio",
    changesCount_other: "{{count}} cambios",
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
    },
  },

  narrative: {
    ilcd: {
      'ILCD Situation A': {
        title: 'Apoyo a la decisión con consecuencias limitadas (situación ILCD A)',
        short: 'Apoyo a la decisión a nivel micro: el intercambio es demasiado pequeño para cambiar el sistema de fondo. Modelización atribucional, con sustitución sobre el mix de mercado medio.',
        detail: 'El intercambio afecta a los actores implicados, no a lo que la economía en su conjunto produce ni a cómo lo produce. Por eso se modela con datos medios, de tipo contable, y lo que la simbiosis desplaza se representa por sustitución con el mix medio del mercado: el mix eléctrico nacional para la electricidad, la producción virgen media para un material. La D4.1 advierte expresamente contra recurrir a la modelización consecuencial solo porque se está tomando una decisión.',
      },
      'ILCD Situation B': {
        title: 'Apoyo a la decisión con consecuencias estructurales (situación ILCD B)',
        short: 'Apoyo a la decisión a nivel meso/macro: la decisión provoca un cambio estructural en el sistema de fondo, por tanto modelización consecuencial sobre la tecnología marginal. El D4.1 pide demostrar esa escala antes de elegirla.',
        detail: 'La decisión es lo bastante grande como para mover la capacidad instalada o la producción de una tecnología concreta. La modelización pasa a ser consecuencial, y lo que la simbiosis desplaza es la tecnología marginal, identificada mediante un análisis de mercado en lugar de tomarse como el mix medio. La carga de la prueba es tuya: esta vía hay que demostrarla, no suponerla.',
      },
      'ILCD Situation C1': {
        title: 'Documentar una red existente (situación ILCD C1)',
        short: 'Contabilidad con interacciones — documentar lo que una red existente aporta a la economía en general. Sustitución sobre el mix de mercado medio, como en la Situation A.',
        detail: 'Estás documentando una red que existe en lugar de apoyar una decisión, así que el estudio es descriptivo. Pero como se trata de mostrar lo que la red aporta a la economía en general, la multifuncionalidad se resuelve igualmente por sustitución con el mix medio del mercado, en la práctica la misma regla que la Situación A.',
      },
      'ILCD Situation C2': {
        title: 'Contabilidad estricta de una sola empresa (situación ILCD C2)',
        short: 'Contabilidad estricta para un solo socio aislado: asignación, sin créditos por sustitución.',
        detail: 'Contabilidad estricta de un solo socio por separado, normalmente el informe corporativo. La multifuncionalidad se resuelve por asignación, y no se reclama ningún crédito por lo que la simbiosis desplaza en otra parte: la cifra describe la parte de las cargas de ese socio, no el beneficio que produce la red.',
      },
    },
    lcc: {
      'deactivated': {
        short: 'Sin análisis económico — la dimensión económica está desactivada en Q3.',
        detail: 'En Q3 no está seleccionada la dimensión económica, así que la herramienta no configura ningún cálculo de costes. Si el caso necesita un business case, como suele ocurrir con una simbiosis que deben firmar varias empresas, vuelve a Q3 y activa la dimensión económica.',
      },
      'C+E': {
        short: 'LCC convencional (los flujos de caja reales de la empresa) más LCC ambiental (la cadena de valor, sobre los mismos límites que la ACV).',
        detail: 'Dos vistas en paralelo. El LCC convencional responde si le compensa a cada empresa: flujos de caja reales, impuestos y tasas como costes, subvenciones como reducciones. El LCC ambiental amplía el límite a todos los actores del ciclo de vida y se mantiene coherente con el ACV paralelo, para que ambos se lean lado a lado. Cuidado con el doble cómputo: un impuesto al carbono o al vertedero que ya está en los flujos de caja no debe reaparecer como externalidad monetizada.',
      },
      'C+E+S': {
        short: 'LCC convencional y ambiental más LCC societal: impuestos y subvenciones ajustados con el Net Tax Factor, impactos ambientales monetizados.',
        detail: 'A las vistas de la empresa y de la cadena de valor se suma la del bienestar social. Impuestos y subvenciones son transferencias dentro de la sociedad y no costes reales para ella, así que se excluyen o se convierten en precios sombra mediante el Net Tax Factor, y los impactos ambientales del ACV paralelo se monetizan. Es la configuración que necesita una decisión pública, y por eso la introduce un objetivo público o de política.',
      },
      'C-LCC': {
        short: 'Solo LCC convencional — la perspectiva de la empresa, equivalente a un análisis de coste total de propiedad.',
        detail: 'Solo la perspectiva de la empresa. Cada instrumento de política es un flujo de caja real: impuestos y tasas son costes, las subvenciones reducen el capex o el opex. Es el marco adecuado para el informe corporativo, y no dice nada a propósito sobre los efectos en la cadena de valor o en la sociedad: afirmarlos iría más allá de lo que puede sostener la cuenta de un solo actor.',
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
        detail: 'La dimensión social está activa. Cada grupo de partes interesadas (trabajadores, consumidores, comunidades locales, actores de la cadena de valor) se vincula a los procesos que le afectan y, desde ahí, a las subcategorías de impacto y los indicadores. Ese vínculo vale lo que vale la participación que lo respalda: hablar con los grupos implicados forma parte de la recogida de datos, no es un extra opcional.',
      },
      'deactivated': {
        short: 'S-ACV no activada — la dimensión social está desactivada en Q3.',
        detail: 'En Q3 no está seleccionada la dimensión social, así que no se configura ni un mapa de partes interesadas ni ningún indicador social. Actívala en Q3 si el caso tiene que decir algo sobre trabajadores o comunidades locales, lo que suele ocurrir cuando una simbiosis se presenta a un municipio o a una comunidad.',
      },
    },
  },

  result: {
    // a study with no LCA is headed by its costing (decided by Fable, UX round 2026-11-03)
    lccTitle: {
      'C+N': 'LCC convencional por socio, consolidado a nivel de red',
      'C+N+S': 'LCC convencional por socio y red, más LCC social',
      'C-LCC': 'LCC convencional de una sola empresa',
      'C+E': 'LCC convencional y ambiental',
      'C+E+S': 'LCC convencional, ambiental y social',
    },
    lccBadge: {
      'C+E': 'C-LCC + E-LCC',
      'C+E+S': 'C-LCC + E-LCC + S-LCC',
      'C+N': 'C-LCC por socio + red',
      'C+N+S': 'C-LCC por socio + red + S-LCC',
      'C-LCC': 'C-LCC',
    },
    situationBadge: {
      A: 'Situación ILCD A',
      B: 'Situación ILCD B',
      C1: 'Situación ILCD C1',
      C2: 'Situación ILCD C2',
    },
    verdictWhy: "Por qué: respondiste «{{answer}}» (Q9)",
    verdictWhyQ1: "Por qué: Q9 no tiene respuesta, así que la situación se deduce de lo que analizas (Q1)",
    config: {
      title: 'Tu configuración',
      lead: 'Lo que tus respuestas han decidido, en los términos de los entregables. Abre una fila para leer el texto del motor, en inglés, con la sección de la que procede.',
      nodeText: 'Texto del motor (inglés)',
      labels: {
        flows: "Tratamiento de cada flujo",
        claim: 'Declaración pública',
        purpose: 'Tipo de estudio',
        lcc: 'Costes',
        slca: 'Evaluación social',
        horizon: 'Horizonte del estudio',
        reference: 'Escenario de referencia',
        fu: 'Unidad funcional',
        regional: 'Impactos locales',
        sectors: 'Reglas sectoriales',
        shared: 'Bienes dedicados',
        claimPublic: 'Comparaciones',
      },
      values: {
        noChapter: "Ningún capítulo de la D4.1 Part 2 cubre los flujos declarados: solo se aplica la Part 1",
        flowTreatment: {
          waste: "residuo: sin carga hasta el punto en que adquiere valor (carga cero)",
          evt: "indeciso: prueba del valor económico, con análisis de sensibilidad",
          coproduct: "coproducto: sustitución del producto que reemplaza, con factor de calidad Q",
          integrated: "interdependiente: un único proceso multifuncional, modelado entero",
          allocation: "asignación (cuentas de una sola empresa: sin créditos de sustitución)",
          aggregated: "agregado: clasificar cada flujo que se pueda nombrar",
        },
        claim: 'Declaración comparativa al público: revisión crítica por un panel de al menos tres expertos independientes, sin ponderación',
        claimNone: 'Sin declaración comparativa pública',
        claimPolicy: "Sin declaración comparativa pública; alineación con las políticas de la UE (Q4 = D): revisión por un panel independiente, elección de T4.6",
        claimPublic: { none: 'Este estudio no sirve para decir que un producto es mejor que otro, o equivalente.', claim: 'El estudio respaldará una afirmación pública de que este intercambio es mejor que una alternativa, o equivalente; antes deben revisarlo expertos independientes.', policy: 'El estudio sigue el método de huella ambiental de la UE; no afirma que un producto sea mejor que otro.' },
        scope_continental: 'continental',
        scope_sub_national: 'subnacional',
        scope_national: 'nacional',
        slcaOff: 'No incluida',
        reference_c2: 'No se usa para créditos: asignación, sin sustitución',
        horizonFuture: 'Fondo futuro (escenarios SSP/RCP)',
        horizonPresent: 'Fondo actual',
        reference_hnsrs: 'Lo que haría hoy cada empresa sin los vínculos (HNSRS)',
        reference_modern: 'Un contrafactual moderno: lo que haría hoy cada empresa sin los vínculos (HNSRS)',
        reference_cnsrs: 'El escenario sin la simbiosis, sobre el horizonte del estudio (CNSRS)',
        market: 'mercado: {{market}}',
        fu_waste_treatment: 'Basada en la entrada: el tratamiento del residuo',
        fu_product_substitution: 'Basada en la salida: los productos y lo que sustituyen',
        fu_co_primary: 'Un sistema de unidades funcionales: tratamiento y productos juntos',
        fu_function: 'Orientada a la función, en torno al servicio prestado',
        regional_A: 'Factores de caracterización específicos del lugar para agua, eutrofización y acidificación',
        regional_B: 'Factores de caracterización regionales o por país',
        regional_C: 'Factores por país o región para el territorio de cada emisión',
        regional_unset: 'Factores específicos del lugar donde las interacciones clave son intensamente locales',
        shared: 'Su CAPEX y OPEX en el desglose de costes, imputados a los socios que se benefician de ellos (todo a una sola empresa si solo ella los usa)',
      },
      why: {
        noChapter: "la Part 2 cubre cinco sectores de base biológica y ningún flujo está declarado en uno de ellos",
        flows: "quién paga a quién en cada flujo (Q5)",
        horizonUnanswered: "no se ha indicado año de operación, periodo, vida de los activos ni madurez tecnológica, así que se supone el presente; si las plantas funcionarán más de {{threshold}} años, responde a Q8",
        lccNoPolicyNoLca: "sin objetivo público (Q10): los costes de cada socio, consolidados para la red",
        slcaOff: 'la dimensión social no está seleccionada (Q3)',
        claim: 'los resultados respaldarán una declaración pública de superioridad o equivalencia (Q4 = C)',
        horizonFutureGeneric: 'el horizonte del estudio llega al futuro',
        horizonFutureYear: 'el sistema opera en un año futuro',
        label: 'Por qué:',
        lccC2: 'informe estricto de una sola empresa: solo costes a nivel de empresa',
        referenceC2: "informe estricto de una sola empresa: asignación, ningún crédito por lo que la simbiosis sustituye (D4.1 §7.2.3)",
        claimPolicy: "los resultados respaldarán la alineación con las políticas de la UE (Q4 = D)",
        lccNoLca: 'sin dimensión ambiental: no hay ACC ambiental que alinear',
        lccPolicy: 'has respondido que el estudio sirve a un objetivo público (Q10)',
        lccPolicyInferred: 'deducido de Q1, porque Q10 no tiene respuesta',
        lccNoPolicy: 'sin objetivo público (Q10): perspectivas de empresa y de cadena de valor',
        horizonYear: 'el sistema opera en {{year}}',
        horizonTrl: 'la tecnología clave está por debajo de TRL 7',
        horizonPeriod: 'el estudio sigue el sistema durante {{years}} años, más de {{threshold}}',
        horizonLifetime: 'los activos duran {{years}} años, más de {{threshold}}',
        horizonPresent: 'año actual, tecnología en TRL 7 o superior y horizonte dentro de {{threshold}} años',
        referenceNotYet: 'los intercambios todavía no tienen lugar (Q2)',
        referenceRunning: 'los intercambios ya tienen lugar (Q2)',
        referenceLongStanding: 'la red funciona desde hace muchos años (Q2)',
        fuGoal: 'el estudio compara: {{goal}}',
        fuDefault: 'lo que compara el estudio no tiene respuesta (Q11)',
        regionalUnset: 'la concentración de las interacciones no tiene respuesta (Q7)',
        sectors: 'los capítulos siguen el sector declarado en cada flujo',
        shared: 'la simbiosis usa bienes dedicados (Q12)',
      },
    },
    notes: { title: 'Notas sobre tus respuestas' },
    engineNotes: {
      study_purpose_vs_q2: {
        analysis: "Finalidad del estudio: el estudio evalúa una red existente, pero Q2 dice que los intercambios que mide todavía no tienen lugar. Comprueba las dos respuestas (D4.1 §4.3.2).",
        design: "Finalidad del estudio: el estudio compara opciones para una red nueva, planificada, pero Q2 dice que los intercambios ya tienen lugar. Comprueba las dos respuestas (D4.1 §4.3.2).",
      },
      q9_unanswered: "Q9 no tiene respuesta, así que la situación ILCD (situación {{situation}}) se deduce de Q1, como en los casos guardados antes de que existiera Q9. Responde a Q9: la Tabla 1 de la D4.1 fija la situación según la decisión y la escala de sus consecuencias, no según el sujeto del estudio.",
      q10_unanswered: {
        yes: "Q10 no tiene respuesta, así que si el estudio sirve a un objetivo público se deduce de Q1: se añade el ACC societal, como en los casos guardados antes de que existiera Q10. Responde a Q10: la D4.2 §2.3 añade el ACC societal para un objetivo de política pública u ordenación o para un decisor público, sea cual sea el sujeto del estudio.",
        no: "Q10 no tiene respuesta, así que si el estudio sirve a un objetivo público se deduce de Q1: no se añade el ACC societal, como en los casos guardados antes de que existiera Q10. Responde a Q10: la D4.2 §2.3 añade el ACC societal para un objetivo de política pública u ordenación o para un decisor público, sea cual sea el sujeto del estudio.",
      },
      structural_without_screening: "Q9 indica efectos estructurales, pero el cribado de mercado no está documentado: el estudio se trata como Situación ILCD A, y la Situación B debe probarse como análisis de sensibilidad (ILCD Handbook 2010, §5.3).",
      structural_screening_missing: "La Situación B exige un cribado de mercado documentado: la cantidad anual que la decisión añade o retira del mercado afectado debe superar la capacidad que ese mercado renueva cada año, contando como máximo el 5 % (ILCD Handbook 2010, §5.3); documéntalo, o el estudio es Situación A con B como análisis de sensibilidad.",
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
      flow_price_without_market: "Flujo «{{flow}}»: Q5 dice que el receptor paga (coproducto), pero ningún tercero lo compraría. Con un único comprador decide el precio (D4.1 §8.3.3): el flujo es un coproducto si el receptor paga lo que pagaría un comprador independiente, es decir, el precio del producto que el flujo sustituye descontados sus costes adicionales para usarlo; si el pago solo reparte costes, el flujo es un residuo, con carga cero desde donde alcanza por primera vez un valor no negativo (§8.3.6 Step 4). Compara el precio con esa referencia.",
      flow_freedom_to_act_settles: {
        co_product: "Flujo «{{flow}}»: Q5 deja abierto quién paga a quién, y la respuesta Freedom-to-Act (D4.1 §8.3.3) apunta a un coproducto (§8.3.2, carga repartida). La configuración mantiene la prueba del valor económico con análisis de sensibilidad hasta que el estudio lo confirme: no cambies quién paga a quién; registra esta lectura en la clasificación de flujos del Data Collection File (Freedom-to-Act y paso del árbol de decisión), que el estudio documenta.",
        waste: "Flujo «{{flow}}»: Q5 deja abierto quién paga a quién, y la respuesta Freedom-to-Act (D4.1 §8.3.3) apunta a un residuo (carga cero desde el punto en que alcanza por primera vez un valor no negativo, §8.3.6 paso 4). La configuración mantiene la prueba del valor económico con análisis de sensibilidad hasta que el estudio lo confirme: no cambies quién paga a quién; registra esta lectura en la clasificación de flujos del Data Collection File (Freedom-to-Act y paso del árbol de decisión), que el estudio documenta.",
      },
      running_but_future: "Q2 dice que los intercambios ya tienen lugar, pero Q8 sitúa la operación en un año futuro o Q6b pone la tecnología clave por debajo de TRL 7. Un intercambio en curso se mide hoy: revisa Q2, Q8 y Q6b. Mientras tanto, el escenario de referencia y el calendario de la evaluación de costes siguen Q2, y el fondo futuro sigue Q8 y Q6b.",
      design_without_screening: "El estudio diseña, amplía o reestructura una red y se modela como Situación A. D4.1 §4.2.3: estos estudios requieren el cribado de mercado ILCD (Mattila et al. 2012); sin él, el estudio sigue en A, con la Situación B como análisis de sensibilidad. Documenta el cribado o ejecuta B como sensibilidad.",
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
      obligations: "{{count}} obligaciones por documentar ({{groups}}), activadas por tus respuestas. El Data Collection File las enumera, con lo que activó cada una, junto con las prácticas que el método pide a todo estudio como el tuyo.",
      families: {
        IR: '{{count}} sobre la integración de los métodos',
        CIR: '{{count}} activadas por tus respuestas',
        FU: '{{count}} sobre la unidad funcional',
        B: '{{count}} sobre los límites',
      },
      title: 'Qué hacer ahora',
      lead:
        'Prácticas metodológicas que tus respuestas hacen obligatorias, más las decisiones aún abiertas. Cada una dice por qué afecta a tu caso.',
      provenance:
        "Los nombres y enunciados de las reglas están traducidos de la tabla inglesa del motor. El código junto a cada elemento — IR-01, CDP-02 — es la referencia que no cambia de un idioma a otro, y el nombre en inglés se mantiene al lado.",
      noTensions:
        "Para estas respuestas no ha surgido ningún punto de decisión crítico entre los métodos. Las obligaciones de abajo se aplican igualmente.",
      allClear:
        'Ninguna obligación metodológica se aplica a estas respuestas y no ha surgido ningún punto de decisión crítico. Siguiente paso: abre el Data Collection File.',
      ctaHint: 'El Data Collection File está calibrado en esta configuración: solo pide lo que tu caso necesita.',
    },
    actionKind: {
      block: 'Bloqueante',
      obligation: 'Por documentar',
      decision: 'Por decidir',
      decisionResolved: "Resuelto por el motor: a revisar",
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
      obligations: 'Obligaciones a documentar',
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
    description: "El caso y {{n}} escenario(s) alternativo(s), cada uno ejecutado por el motor. Las celdas que difieren del caso aparecen resaltadas.",
    backToResult: 'Volver al resultado único',
    columns: {
      scenario: 'Escenario',
      ilcd: 'ILCD',
      lccType: 'Tipo LCC',
      slca: 'S-LCA',
      activated: "Nodos metodológicos",
      blocks: "Bloqueos",
      obligations: 'Obligaciones a documentar',
      cdps: "Puntos de decisión",
    },
    baselineLabel: "El caso",
    diffSuffix: '(diff)',
    overridesPlaceholder: "p. ej. {\"q2\": \"B\"} o {\"q3\": {\"env\": true, \"eco\": true}}",
    overridesParseError: 'Los overrides deben ser JSON válido para {{id}}',
    whatChanges: "qué cambia respecto al caso",
    noChange: "No cambia nada en la configuración ni en las obligaciones.",
    addedRules: "Obligaciones añadidas",
    removedRules: "Obligaciones quitadas",
  },


  reasoning: {
    activatedNodes: 'Nodos activados ({{count}})',
    pillarConfigs: 'Configuraciones por pillar',
    noPillarValues: 'No se han escrito valores de pillar.',
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
    title: "Cargar un ejemplo publicado",
    help: "Carga en el cuestionario las respuestas de un caso publicado, para ver qué deduce la herramienta de un estudio real.",
    loadButton: 'Cargar preset',
    rationaleToggle: '¿Por qué estas respuestas? (rationale de compilación)',
    replaceConfirm: "Cargar este ejemplo sustituye las respuestas en las que estás trabajando. Guarda primero tu caso si quieres conservarlo. ¿Cargar el ejemplo?",
    loaded: "Ejemplo cargado: {{name}}",
  },

  toast: {
    pipelineCompleted: "Configuración lista",
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
      invalidEmail: 'Dirección de correo no válida: revisa la parte después de la @ (p. ej. nombre@empresa.es).',
      invalidInput: 'Revisa el correo y la contraseña (al menos 8 caracteres).',
    },
  },

  scoringPending: {
    title: "Todavía no hay resultados",
    body:
      "Esta herramienta no calcula las cifras ambientales, de costes o sociales. Las calcula quien realiza el estudio; si se añaden a este caso, aparecen aquí.",
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
          'Esta herramienta no calcula las cifras, y nadie las calcula automáticamente para tu caso. Si un analista realiza el estudio con el Data Collection File, sus resultados pueden cargarse aquí: indicadores ambientales y económicos, para juzgar si el intercambio compensa.',
      },
      community: {
        whatYouSee:
          "Lo que esta página te dice hoy: qué flujos intercambian las empresas y si este estudio examina o no los efectos sociales.",
        whenScoring:
          'Esta herramienta no calcula las cifras, y nadie las calcula automáticamente para tu caso. Si un analista realiza el estudio con el Data Collection File, sus resultados pueden cargarse aquí: indicadores sociales — trabajadores, comunidad local — y ambientales, cada uno con el grupo al que afecta.',
      },
      authority: {
        whatYouSee:
          "Lo que esta página te dice hoy: cómo está planteada la evaluación, qué señales de conformidad declara el caso y cuán concentradas están las interacciones clave.",
        whenScoring:
          'Esta herramienta no calcula las cifras, y nadie las calcula automáticamente para tu caso. Si un analista realiza el estudio con el Data Collection File, sus resultados pueden cargarse aquí: las cifras ambientales y, cuando el estudio las incluye, los costes para la sociedad.',
        scope: "Cuán concentradas están las interacciones clave: {{scope}}",
      },
      'end-user': {
        whatYouSee:
          "Lo que esta página te dice hoy: qué materiales devuelve al uso esta simbiosis y si se examinan los efectos ambientales y sociales.",
        whenScoring:
          'Esta herramienta no calcula las cifras, y nadie las calcula automáticamente para tu caso. Si un analista realiza el estudio con el Data Collection File, sus resultados pueden cargarse aquí: los indicadores ambientales y sociales de la cadena detrás del producto.',
        productCaveat:
          "Esta evaluación describe el intercambio entre las empresas, no el producto final que compras: la herramienta nunca pregunta cuál es el producto.",
      },
    },
    noVerdict: "No hay ningún caso abierto. Rellena el cuestionario o carga un caso guardado para ver esta vista.",
    notAssessed: {
      environmental: 'Este estudio no evalúa los impactos ambientales: la dimensión ambiental se desactivó al configurar el caso.',
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
        'Vista técnica completa de la configuración metodológica. Las cifras (emisiones, costes) no se producen aquí: quien realiza el estudio las calcula a partir del Data Collection File, y pueden cargarse en este caso.',
      community:
        'Qué cambia para quienes viven cerca de las plantas: efectos sobre el entorno local y sobre las personas, positivos y negativos.',
      authority:
        'Cómo se plantea la evaluación: costes, bienes compartidos, escenario de referencia, afirmaciones públicas, horizonte, efectos sociales.',
      'end-user':
        'De qué trata este caso y qué se evaluará. Todavía no hay resultados.',
    },
    verdictTitle: 'Configuración metodológica',
    configTitle: 'Qué está preparado para mirar este estudio',
    labels: {
      ilcd: 'Situación ILCD',
      lcc: 'Tipo LCC',
      slca: 'Activación S-LCA',
    },
    scoringTitle: 'Resultados',
    scoringPendingTitle: 'Todavía no hay resultados',
    scoringPendingBody:
      'Esta herramienta no calcula las cifras ambientales, de costes o sociales. Las calcula quien realiza el estudio; si se añaden a este caso, aparecen aquí.',
    scoringEmpty: 'No hay indicadores relevantes para este stakeholder.',
    indicatorPending: 'pendiente',
    engineDetailsTitle: 'Detalles del pipeline',
    activatedNodesCount_one: '{{count}} nodo metodológico activado',
    activatedNodesCount_other: '{{count}} nodos metodológicos activados',
    obligations_one: "{{count}} obligación por documentar",
    obligations_other: "{{count}} obligaciones por documentar",
    cdpFlagsCount_one: '{{count}} tensión transversal',
    cdpFlagsCount_other: '{{count}} tensiones transversales',
    complianceTitle: 'Señales de cumplimiento',
    compliance: {
      peerReview: 'Revisión independiente por pares: {{status}}',
      pef: 'Alineación EU PEF (Q4=D): {{status}}',
      pefC2: "Alineación EU PEF (Q4=D): no aplicada, el informe de una empresa usa asignación y no la Circular Footprint Formula (Situación ILCD C2)",
      publicClaim: 'Afirmación pública (Q4=C): {{status}}',
    },
  },

  aggregate: {
    navLink: 'Panel regional',
    title: 'Panel regional / sectorial',
    subtitle:
      'Desglose de todos los casos guardados por situación ILCD, estructura LCC, sector y concentración de las interacciones clave. Para autoridades locales y analistas de políticas.',
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
      byScope: 'Por concentración de las interacciones (Q7)',
      byIlcd: 'Por situación ILCD',
    },
  },

  obligations: {
    empty: "Nada que documentar para este caso.",
    lead:
      "{{total}} elementos por documentar en este caso: las {{rules}} obligaciones activadas por tus respuestas (las contadas en la página de resultado) y {{mandates}} prácticas que el método pide a todo estudio como este. Cada uno es un compromiso que documentar en el informe LCSA.",
    because: "Se aplica porque:",
    notApplicable: "Aquí no se aplica: {{fields}} — ese método está desactivado en Q3.",
    origin: {
      mandate: "Mandato",
      rule: "Regla entre métodos",
    },
  },
  dcf: {
    viewer: {
      notActive: "Esta sección no está activa para este caso.",
      nodeId: "Código",
      method: "Método",
      statement: "Enunciado (texto de los entregables, en inglés)",
      seeAbove: "Ver el diagrama de arriba.",
      fieldsCount_one: "({{count}} campo)",
      fieldsCount_other: "({{count}} campos)",
      colField: "Dato",
      colRequired: "Obligatorio",
      colValues: "Valores posibles",
      colWhy: "Por qué se pide",
      always: "siempre",
    },
    diagram: { whoGives: "¿Quién lo cede?\n({{flow}})", whoReceives: "¿Quién lo recibe?\n({{flow}})" },
    noCase: { title: 'Aún no hay caso', desc: 'El Data Collection File se construye a partir de tu evaluación: responde primero el cuestionario (o abre un caso guardado) y vuelve aquí.', cta: 'Abrir el cuestionario' },
    derivedField: "rellenado por el motor",
    obligationsTitle: "Decisiones metodológicas por documentar",
    navLink: 'Recolección de datos',
    title: 'Data Collection File',
    subtitle:
      'Calibrado sobre la configuración derivada. Descarga el Excel para recoger, con los socios, los datos sobre los intercambios y sobre la referencia de cada actor; el inventario de procesos de cada planta se recoge aparte.',
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
      'El Data Collection File describe los intercambios, no los procesos: rellena las filas vacías sin conexión (o repártelas entre los socios) y devuelve el archivo al analista que dirige el estudio, que recoge los inventarios de las plantas con el software de ACV y de costes.',
    openButton: 'Abrir Data Collection File',
    tabOverview: 'Resumen',
    tabNetworkBuilder: 'Editor de red',
    socialDeferred: 'El inventario social no se recoge en este archivo: sigue la D4.3 con sus propios instrumentos (cuestionarios, entrevistas por grupo de partes interesadas).',
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
    signInToSave: "Guardar un caso en el servidor requiere una cuenta. Inicia sesión o regístrate aquí; tu borrador se queda en este navegador.",
    signInToList: "Tus casos guardados aparecen aquí cuando inicias sesión. Los informes compartidos se abren desde el enlace que recibiste.",
    publicLink: "Enlace público",
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
