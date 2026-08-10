/* ============================================================
   SV LIFE — Dinero / gastos
   ============================================================ */
(function () {
  "use strict";
  const KEY = "sv_gastos";
  const BKEY = "sv_budget";

  function isThisMonth(dateStr) {
    const d = new Date(dateStr);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }

  function render() {
    const gastos = svStore.get(KEY, []);
    const mesActual = gastos.filter(g => isThisMonth(g.fecha));
    const total = mesActual.reduce((s, g) => s + g.monto, 0);
    document.getElementById("totalMes").textContent = svFmtUSD(total);
    document.getElementById("miniGastos").textContent = svFmtUSD(total) + " este mes";

    const budget = svStore.get(BKEY, { amount: 0 });
    const bar = document.getElementById("budgetBar");
    if (budget.amount > 0) {
      const pct = Math.min(100, Math.round((total / budget.amount) * 100));
      const over = total > budget.amount;
      bar.innerHTML = `
        <div style="height:8px; background:var(--bg-sunken); border-radius:99px; overflow:hidden; margin-top:6px;">
          <div style="height:100%; width:${pct}%; background:${over ? "var(--danger)" : "var(--accent-2)"};"></div>
        </div>
        <small class="text-dim">${svFmtUSD(total)} de ${svFmtUSD(budget.amount)} presupuestados ${over ? "⚠️ superado" : ""}</small>`;
    } else {
      bar.innerHTML = `<small class="text-dim">No has definido un presupuesto mensual.</small>`;
    }

    const list = document.getElementById("gastosList");
    if (gastos.length === 0) {
      list.innerHTML = `<div class="empty-state"><span class="emoji">💵</span>Aún no has registrado gastos.</div>`;
      return;
    }
    list.innerHTML = `<div class="panel">` + gastos.slice(0, 40).map(g => `
      <div class="list-item">
        <div>
          <strong style="font-size:13.5px;">${g.categoria}</strong><br>
          <small class="text-dim">${g.desc || "Sin descripción"} · ${new Date(g.fecha).toLocaleDateString("es-SV")}</small>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <strong>${svFmtUSD(g.monto)}</strong>
          <button class="icon-btn" style="width:30px;height:30px;font-size:13px;" data-del="${g.id}">✕</button>
        </div>
      </div>`).join("") + `</div>`;

    list.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        svStore.remove(KEY, btn.dataset.del);
        render();
        svToast("Gasto eliminado");
      });
    });
  }

  document.getElementById("formGasto").addEventListener("submit", (e) => {
    e.preventDefault();
    const monto = parseFloat(document.getElementById("gastoMonto").value);
    if (!monto || monto <= 0) { svToast("Ingresa un monto válido"); return; }
    svStore.push(KEY, {
      id: svUid(),
      monto,
      categoria: document.getElementById("gastoCategoria").value,
      desc: document.getElementById("gastoDesc").value.trim(),
      fecha: new Date().toISOString()
    });
    e.target.reset();
    render();
    svToast("Gasto registrado ✅");
  });

  document.getElementById("btnPresupuesto").addEventListener("click", () => {
    const current = svStore.get(BKEY, { amount: 0 }).amount;
    const val = prompt("Presupuesto mensual (USD):", current || "");
    if (val === null) return;
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) { svToast("Monto inválido"); return; }
    svStore.set(BKEY, { amount: num });
    render();
  });

  document.addEventListener("DOMContentLoaded", render);
  window.svRenderDinero = render;
})();
