/* ============================================================
   SV LIFE — Actualidad (demo)
   Para conectar una API real: reemplaza SV_NOTICIAS_DEMO por
   una función async que haga fetch a tu proveedor de noticias
   y llama a renderNoticias(datos) con el mismo formato.
   ============================================================ */
(function () {
  "use strict";

  function card(n) {
    return `
      <div class="panel">
        <div class="flex-between">
          <strong style="font-size:14px;">${n.titulo}</strong>
          ${n.demo ? `<span class="badge warn">Demo</span>` : ""}
        </div>
        <p class="text-dim mt-8" style="font-size:13px;">${n.resumen}</p>
        <small class="text-dim">${n.fuente}</small>
      </div>`;
  }

  function render() {
    document.getElementById("noticiasList").innerHTML = SV_NOTICIAS_DEMO.map(card).join("");
    document.getElementById("noticiasPreview").innerHTML = SV_NOTICIAS_DEMO.slice(0, 1).map(card).join("");
  }

  document.addEventListener("DOMContentLoaded", render);
})();
