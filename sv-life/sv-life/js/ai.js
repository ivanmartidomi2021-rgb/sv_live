/* ============================================================
   SV LIFE — SV AI (Google Gemini API)
   Reglas duras del prompt: responder en español, contexto SV,
   NUNCA inventar info legal/gubernamental/de emergencia — remitir
   a la fuente oficial cuando aplique.
   ============================================================ */
(function () {
  "use strict";

  const SYSTEM_PROMPT = `Eres SV AI, el asistente de la app SV Life para la vida cotidiana en El Salvador.
Responde SIEMPRE en español, de forma breve, cálida y útil, con contexto salvadoreño (lugares, cultura, moneda USD, trámites, clima).
REGLAS IMPORTANTES:
- NUNCA inventes información legal, gubernamental, de trámites o de emergencia. Si no estás seguro o la información puede cambiar (requisitos, costos, leyes, números oficiales), dilo claramente y recomienda verificar en la fuente oficial correspondiente (ej. RNPN, Ministerio de Hacienda, PNC, DGME, VMT).
- No des consejos médicos ni legales definitivos; orienta a buscar ayuda profesional u oficial.
- Sé práctico y concreto (ej. sugerencias de lugares, rutas, actividades, presupuestos aproximados) pero deja claro cuándo un dato es aproximado.
- Mantén las respuestas en un máximo de ~120 palabras salvo que se pida más detalle.`;

  const SUGGESTIONS = [
    "¿Qué puedo hacer este fin de semana en San Salvador?",
    "¿Qué documentos necesito para sacar el DUI?",
    "¿Cuánto gastaría de gasolina de San Salvador a Santa Ana?",
    "Recomiéndame un lugar turístico cerca de la playa",
    "¿Qué puedo hacer hoy en mi ciudad?"
  ];

  let history = svStore.get("sv_chat", []);
  let initialized = false;

  function bubble(role, text) {
    const div = document.createElement("div");
    div.className = "msg " + (role === "user" ? "user" : "ai");
    div.textContent = text;
    return div;
  }

  function renderHistory() {
    const log = document.getElementById("chatLog");
    log.innerHTML = "";
    if (history.length === 0) {
      log.appendChild(bubble("ai", "¡Hola! 👋 Soy SV AI. Pregúntame sobre trámites, turismo, clima, gastos o cualquier duda de la vida diaria en El Salvador."));
    } else {
      history.forEach(m => log.appendChild(bubble(m.role, m.text)));
    }
    log.scrollTop = log.scrollHeight;
  }

  function renderSuggestions() {
    const wrap = document.getElementById("chatSuggestions");
    wrap.innerHTML = "";
    SUGGESTIONS.forEach(s => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.textContent = s;
      chip.addEventListener("click", () => sendMessage(s));
      wrap.appendChild(chip);
    });
  }

  function demoReply(question) {
    const q = question.toLowerCase();
    if (q.includes("dui")) {
      return "Para el DUI necesitas hacer el trámite en el RNPN. Los requisitos exactos pueden cambiar, así que te recomiendo verificarlos en rnpn.gob.sv antes de ir. 🪪 (Respuesta en modo demo — configura tu clave de Gemini en Ajustes para respuestas completas.)";
    }
    if (q.includes("fin de semana") || q.includes("hacer hoy") || q.includes("turis")) {
      return "Podrías visitar el Centro Histórico de San Salvador, la Puerta del Diablo o escaparte a la Ruta de las Flores (Juayúa, Ataco). 🌴 (Modo demo: activa tu clave de Gemini en Ajustes para recomendaciones personalizadas.)";
    }
    if (q.includes("gasolina") || q.includes("santa ana")) {
      return "La distancia San Salvador–Santa Ana es de unos 65 km. Con un vehículo promedio (~35 km/galón) serían aprox. 2 galones, según el precio vigente del galón. Verifica el precio actual en surtidores oficiales. ⛽ (Modo demo)";
    }
    return "Estoy en modo demostración porque no hay una clave de Gemini configurada. Ve a Ajustes ⚙️ y agrega tu clave para obtener respuestas completas de SV AI. Mientras tanto: recuerda siempre verificar información legal, de trámites o de emergencia en fuentes oficiales. 🇸🇻";
  }

  async function callGeminiDirect(userText) {
    const key = svGetKeys().gemini;
    const model = SV_CONFIG.GEMINI_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const contents = history.slice(-8).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));
    contents.push({ role: "user", parts: [{ text: userText }] });
    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Gemini API " + res.status);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No obtuve respuesta, intenta de nuevo.";
  }

  async function callGeminiViaBackend(userText) {
    const res = await fetch(SV_CONFIG.BACKEND_URL.replace(/\/$/, "") + "/gemini-proxy.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, history: history.slice(-8) })
    });
    if (!res.ok) throw new Error("Backend " + res.status);
    const data = await res.json();
    return data.reply || "No obtuve respuesta, intenta de nuevo.";
  }

  async function sendMessage(text) {
    text = text.trim();
    if (!text) return;
    const input = document.getElementById("chatInput");
    input.value = "";
    history.push({ role: "user", text });
    renderHistory();
    svStore.set("sv_chat", history);

    const log = document.getElementById("chatLog");
    const typing = document.createElement("div");
    typing.className = "msg ai typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    let reply;
    try {
      const keys = svGetKeys();
      if (SV_CONFIG.BACKEND_URL) {
        reply = await callGeminiViaBackend(text);
      } else if (keys.gemini) {
        reply = await callGeminiDirect(text);
      } else {
        await new Promise(r => setTimeout(r, 500));
        reply = demoReply(text);
      }
    } catch (err) {
      console.warn("SV AI error", err);
      reply = "⚠️ No pude conectar con SV AI en este momento (revisa tu conexión o tu clave de Gemini en Ajustes). " + demoReply(text);
    }

    typing.remove();
    history.push({ role: "ai", text: reply });
    svStore.set("sv_chat", history);
    renderHistory();
  }

  document.getElementById("chatSend").addEventListener("click", () => sendMessage(document.getElementById("chatInput").value));
  document.getElementById("chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(e.target.value);
  });

  window.svInitChat = function () {
    if (!initialized) {
      renderSuggestions();
      initialized = true;
    }
    renderHistory();
  };
})();
