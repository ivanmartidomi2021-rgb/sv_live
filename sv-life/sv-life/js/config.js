/* ============================================================
   SV LIFE — Configuración
   ------------------------------------------------------------
   Aquí se definen valores por defecto. Las claves de API reales
   NUNCA se escriben en este archivo: el usuario las ingresa una
   vez desde Ajustes ⚙️ y quedan guardadas solo en su navegador
   (localStorage), nunca se suben a ningún repositorio ni servidor.

   Si prefieres no escribir tu clave en el navegador (por ejemplo,
   en un teléfono compartido), usa el mini-backend opcional que
   se incluye en /backend (ver README.md).
   ============================================================ */

const SV_CONFIG = {
  APP_NAME: "SV Life",

  // Si usas el backend opcional (/backend), pon aquí su URL, ej:
  // "https://tu-dominio.com/backend" — así la clave de Gemini
  // nunca viaja al navegador. Déjalo vacío para modo 100% frontend.
  BACKEND_URL: "",

  // Modelo de Gemini a utilizar
  GEMINI_MODEL: "gemini-2.0-flash",

  // Coordenadas por defecto (Plaza Cívica, San Salvador) si no hay geolocalización
  DEFAULT_LOCATION: { name: "San Salvador", lat: 13.6929, lon: -89.2182 },

  // Números de emergencia de El Salvador — EDITA AQUÍ si cambian.
  // Fuente sugerida para verificar: sitios oficiales de PNC, Cuerpo de
  // Bomberos y Cruz Roja Salvadoreña.
  EMERGENCY_NUMBERS: [
    { label: "Emergencias (PNC / general)", number: "911", emoji: "🚨" },
    { label: "Policía Nacional Civil", number: "911", emoji: "👮" },
    { label: "Cuerpo de Bomberos", number: "913", emoji: "🚒" },
    { label: "Cruz Roja Salvadoreña", number: "2222-5155", emoji: "🩹" },
    { label: "Fuerza Armada (COMURES/emergencia)", number: "911", emoji: "🎖️" }
  ]
};

function svGetKeys() {
  return {
    gemini: localStorage.getItem("sv_gemini_key") || "",
    openweather: localStorage.getItem("sv_ow_key") || ""
  };
}
function svSaveKeys(gemini, openweather) {
  if (gemini !== undefined) localStorage.setItem("sv_gemini_key", gemini);
  if (openweather !== undefined) localStorage.setItem("sv_ow_key", openweather);
}
