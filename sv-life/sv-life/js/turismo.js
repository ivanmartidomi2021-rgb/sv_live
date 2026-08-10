/* ============================================================
   SV LIFE — Descubre El Salvador (turismo)
   ============================================================ */
(function () {
  "use strict";

  function placeCard(p, mini) {
    return `
      <div class="${mini ? "place-card" : "card"}" style="${mini ? "" : "min-height:auto;"}">
        <div class="${mini ? "img" : "emoji"}">${p.emoji}</div>
        <div class="${mini ? "body" : ""}">
          <strong>${p.nombre}</strong>
          ${mini ? `<small>${p.desc}</small>` : `<small>${p.desc}</small>`}
          <button class="btn sm secondary mt-8" data-lat="${p.lat}" data-lon="${p.lon}" data-name="${p.nombre}">🗺️ Ver mapa</button>
        </div>
      </div>`;
  }

  function renderPreview() {
    const el = document.getElementById("turismoPreview");
    if (!el) return;
    el.innerHTML = SV_TURISMO.slice(0, 6).map(p => placeCard(p, true)).join("");
    bindMapButtons(el);
  }

  function renderGrid(cat) {
    const el = document.getElementById("turismoGrid");
    const items = cat === "all" ? SV_TURISMO : SV_TURISMO.filter(p => p.cat === cat);
    el.innerHTML = items.map(p => placeCard(p, false)).join("");
    bindMapButtons(el);
  }

  function bindMapButtons(container) {
    container.querySelectorAll("[data-lat]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.svGoTo("mapa");
        setTimeout(() => {
          if (window.svInitMap) window.svInitMap();
        }, 50);
      });
    });
  }

  document.getElementById("turismoFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll("#turismoFilters .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    renderGrid(chip.dataset.cat);
  });

  document.addEventListener("DOMContentLoaded", () => {
    renderPreview();
    renderGrid("all");
  });
})();
