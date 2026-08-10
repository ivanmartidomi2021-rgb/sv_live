/* ============================================================
   SV LIFE — Trámites
   ============================================================ */
(function () {
  "use strict";
  function render() {
    const el = document.getElementById("tramitesList");
    el.innerHTML = SV_TRAMITES.map(t => `
      <div class="panel">
        <div class="flex-between">
          <strong style="font-size:15px;">${t.emoji} ${t.nombre}</strong>
        </div>
        <p class="text-dim mt-8" style="font-size:13px;">${t.que_es}</p>
        <p style="font-size:13px; margin-top:6px;"><strong>¿Para qué sirve?</strong> ${t.para_que}</p>
        <p style="font-size:13px; margin-top:6px;"><strong>Institución:</strong> ${t.institucion}</p>
        ${t.verificar ? `<div class="notice">📌 Requisitos, pasos y costos pueden cambiar. Verifica la información oficial antes de tu trámite.</div>` : ""}
        <a href="${t.enlace}" target="_blank" rel="noopener"><button class="btn secondary full mt-16">🔗 Ir al sitio oficial</button></a>
      </div>
    `).join("");
  }
  document.addEventListener("DOMContentLoaded", render);
})();
