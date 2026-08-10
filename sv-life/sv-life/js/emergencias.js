/* ============================================================
   SV LIFE — Emergencias
   Los números salen SIEMPRE de SV_CONFIG.EMERGENCY_NUMBERS
   (js/config.js) — nunca se inventan aquí.
   ============================================================ */
(function () {
  "use strict";
  function render() {
    const el = document.getElementById("emergenciasGrid");
    el.innerHTML = SV_CONFIG.EMERGENCY_NUMBERS.map(n => `
      <div class="emg-card" data-tel="${n.number}">
        <span class="emoji">${n.emoji}</span>
        <strong>${n.label}</strong>
        <span class="num">${n.number}</span>
      </div>
    `).join("");
    el.querySelectorAll(".emg-card").forEach(card => {
      card.addEventListener("click", () => {
        window.location.href = "tel:" + card.dataset.tel.replace(/[^0-9+]/g, "");
      });
    });
  }
  document.addEventListener("DOMContentLoaded", render);
})();
