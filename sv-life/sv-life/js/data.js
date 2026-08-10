/* ============================================================
   SV LIFE — Datos de contenido
   Los trámites incluyen SOLO información general y estable
   (qué es, para qué sirve, institución). Requisitos y costos
   cambian con frecuencia: siempre se marcan para verificar en
   la fuente oficial en vez de inventarse.
   ============================================================ */

const SV_TRAMITES = [
  {
    id: "dui",
    emoji: "🪪",
    nombre: "DUI (Documento Único de Identidad)",
    que_es: "Documento oficial de identificación para todos los salvadoreños mayores de edad.",
    para_que: "Identificarte legalmente, votar, abrir cuentas bancarias, firmar contratos y más.",
    institucion: "RNPN (Registro Nacional de las Personas Naturales)",
    enlace: "https://www.rnpn.gob.sv",
    verificar: true
  },
  {
    id: "nit",
    emoji: "🧾",
    nombre: "NIT (Número de Identificación Tributaria)",
    que_es: "Número que te identifica ante el Ministerio de Hacienda para fines fiscales.",
    para_que: "Trabajar formalmente, facturar, declarar impuestos y realizar trámites tributarios.",
    institucion: "Ministerio de Hacienda",
    enlace: "https://www.mh.gob.sv",
    verificar: true
  },
  {
    id: "pasaporte",
    emoji: "🛂",
    nombre: "Pasaporte",
    que_es: "Documento de viaje internacional que te identifica fuera del país.",
    para_que: "Viajar al extranjero y como identificación adicional.",
    institucion: "Dirección General de Migración y Extranjería (DGME)",
    enlace: "https://www.migracion.gob.sv",
    verificar: true
  },
  {
    id: "licencia",
    emoji: "🚗",
    nombre: "Licencia de conducir",
    que_es: "Autorización legal para conducir vehículos según la categoría obtenida.",
    para_que: "Conducir de forma legal en El Salvador.",
    institucion: "VMT (Vice Ministerio de Transporte) / SERTRACEN",
    enlace: "https://www.vmt.gob.sv",
    verificar: true
  },
  {
    id: "matricula",
    emoji: "🚙",
    nombre: "Matrícula vehicular",
    que_es: "Trámite de registro e impuesto anual de circulación de un vehículo.",
    para_que: "Circular legalmente y renovar la tarjeta de circulación.",
    institucion: "VMT / SERTRACEN",
    enlace: "https://www.vmt.gob.sv",
    verificar: true
  },
  {
    id: "solvencias",
    emoji: "📃",
    nombre: "Solvencias",
    que_es: "Constancias que certifican que estás al día con una institución (municipal, PNC, etc.).",
    para_que: "Requisito para muchos trámites legales, laborales o de viaje.",
    institucion: "Alcaldía municipal / PNC / otras según el tipo",
    enlace: "https://www.gobiernoabierto.gob.sv",
    verificar: true
  },
  {
    id: "antecedentes",
    emoji: "🔍",
    nombre: "Antecedentes penales / policiales",
    que_es: "Constancia que certifica si tienes o no registros penales o policiales.",
    para_que: "Trámites laborales, migratorios o legales que lo requieran.",
    institucion: "Policía Nacional Civil (PNC)",
    enlace: "https://www.pnc.gob.sv",
    verificar: true
  },
  {
    id: "otros",
    emoji: "🏛️",
    nombre: "Otros trámites gubernamentales",
    que_es: "Portal centralizado con distintos trámites del Gobierno de El Salvador.",
    para_que: "Consultar y realizar trámites en línea de varias instituciones.",
    institucion: "Gobierno de El Salvador",
    enlace: "https://www.gobiernoabierto.gob.sv",
    verificar: true
  }
];

const SV_TURISMO = [
  { id:1, cat:"playas", emoji:"🏖️", nombre:"El Tunco", desc:"Playa icónica para surfear, con ambiente bohemio y buena gastronomía.", lat:13.4926, lon:-89.3833 },
  { id:2, cat:"playas", emoji:"🏖️", nombre:"El Sunzal", desc:"Playa de olas suaves, ideal para aprender a surfear.", lat:13.4958, lon:-89.3708 },
  { id:3, cat:"playas", emoji:"🏖️", nombre:"Playa Los Cóbanos", desc:"Zona de arrecife coralino y aguas tranquilas para nadar.", lat:13.5233, lon:-89.7936 },
  { id:4, cat:"montanas", emoji:"⛰️", nombre:"Volcán de Izalco", desc:"Volcán conocido como 'Faro del Pacífico', dentro del Parque Nacional Los Volcanes.", lat:13.8144, lon:-89.6331 },
  { id:5, cat:"montanas", emoji:"⛰️", nombre:"Cerro Verde", desc:"Mirador natural con vista al Izalco y al lago de Coatepeque.", lat:13.8125, lon:-89.6300 },
  { id:6, cat:"montanas", emoji:"⛰️", nombre:"Volcán de Santa Ana (Ilamatepec)", desc:"El volcán más alto del país, con laguna cratérica turquesa.", lat:13.8536, lon:-89.6297 },
  { id:7, cat:"pueblos", emoji:"🏘️", nombre:"Suchitoto", desc:"Pueblo colonial junto al lago Suchitlán, arte y cultura.", lat:13.9383, lon:-89.0286 },
  { id:8, cat:"pueblos", emoji:"🏘️", nombre:"Ataco (Concepción de Ataco)", desc:"Pueblo de la Ruta de las Flores, murales y café de altura.", lat:13.8722, lon:-89.8500 },
  { id:9, cat:"pueblos", emoji:"🏘️", nombre:"Juayúa", desc:"Conocido por su feria gastronómica de fin de semana.", lat:13.8419, lon:-89.7539 },
  { id:10, cat:"miradores", emoji:"🔭", nombre:"Puerta del Diablo", desc:"Formación rocosa con vistas panorámicas hacia el lago de Ilopango.", lat:13.6167, lon:-89.1408 },
  { id:11, cat:"miradores", emoji:"🔭", nombre:"Mirador Los Pintos", desc:"Vista privilegiada del Volcán de San Salvador.", lat:13.7333, lon:-89.2833 },
  { id:12, cat:"historicos", emoji:"🏛️", nombre:"Sitio arqueológico Joya de Cerén", desc:"Patrimonio de la Humanidad UNESCO, 'la Pompeya de América'.", lat:13.8228, lon:-89.3606 },
  { id:13, cat:"historicos", emoji:"🏛️", nombre:"Centro Histórico de San Salvador", desc:"Catedral Metropolitana, Palacio Nacional y Teatro Nacional.", lat:13.6989, lon:-89.1914 },
  { id:14, cat:"historicos", emoji:"🏛️", nombre:"Ruinas de Tazumal", desc:"Complejo arqueológico maya en Chalchuapa.", lat:13.9758, lon:-89.6797 }
];

const SV_NOTICIAS_DEMO = [
  { titulo:"Bienvenido a la sección de Actualidad", resumen:"Aquí verás noticias relevantes de El Salvador una vez que conectes una API de noticias real.", fuente:"SV Life", demo:true },
  { titulo:"Configura tu fuente de noticias", resumen:"Edita js/noticias.js para conectar una API (por ejemplo NewsAPI o una fuente local) y reemplazar este contenido de demostración.", fuente:"SV Life", demo:true },
  { titulo:"Recuerda verificar fuentes oficiales", resumen:"Para trámites, emergencias o información legal, siempre confirma en el sitio oficial correspondiente.", fuente:"SV Life", demo:true }
];
