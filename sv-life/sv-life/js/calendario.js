/* ============================================================
   SV LIFE — Mi día (calendario simple)
   ============================================================ */
(function () {
  "use strict";
  const KEY = "sv_eventos";
  const TIPO_ICON = { evento: "📌", tarea: "✅", recordatorio: "⏰" };

  function render() {
    const eventos = svStore.get(KEY, []).slice().sort((a, b) =>
      new Date(a.fecha + "T" + a.hora) - new Date(b.fecha + "T" + b.hora)
    );
    const hoy = new Date().toISOString().slice(0, 10);
    const eventosHoy = eventos.filter(e => e.fecha === hoy);
    document.getElementById("miniEventos").textContent = eventosHoy.length
      ? `${eventosHoy.length} evento(s) hoy` : "Sin eventos hoy";

    const list = document.getElementById("eventosList");
    const futuros = eventos.filter(e => e.fecha >= hoy);
    if (futuros.length === 0) {
      list.innerHTML = `<div class="empty-state"><span class="emoji">📅</span>No tienes eventos próximos.</div>`;
      return;
    }
    list.innerHTML = `<div class="panel">` + futuros.map(e => `
      <div class="list-item">
        <div>
          <strong style="font-size:13.5px;">${TIPO_ICON[e.tipo] || "📌"} ${e.titulo}</strong><br>
          <small class="text-dim">${new Date(e.fecha).toLocaleDateString("es-SV", { weekday:"short", day:"numeric", month:"short" })} · ${e.hora}</small>
        </div>
        <button class="icon-btn" style="width:30px;height:30px;font-size:13px;" data-del="${e.id}">✕</button>
      </div>`).join("") + `</div>`;

    list.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => { svStore.remove(KEY, btn.dataset.del); render(); svToast("Eliminado"); });
    });
  }

  document.getElementById("formEvento").addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("evTitulo").value.trim();
    const fecha = document.getElementById("evFecha").value;
    const hora = document.getElementById("evHora").value;
    if (!titulo || !fecha || !hora) { svToast("Completa todos los campos"); return; }
    svStore.push(KEY, { id: svUid(), titulo, fecha, hora, tipo: document.getElementById("evTipo").value });
    e.target.reset();
    render();
    svToast("Evento agregado ✅");
  });

  document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("evFecha").value = today;
    render();
  });
})();
