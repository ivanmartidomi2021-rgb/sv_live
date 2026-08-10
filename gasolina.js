/* ============================================================
   SV LIFE — Combustible
   ============================================================ */
(function () {
  "use strict";
  const KEY = "sv_fuel";

  function isThisMonth(dateStr) {
    const d = new Date(dateStr);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }

  function render() {
    const regs = svStore.get(KEY, []).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const mes = regs.filter(r => isThisMonth(r.fecha));
    const gastoMes = mes.reduce((s, r) => s + r.precio * r.galones, 0);
    const promPrecio = regs.length ? regs.reduce((s, r) => s + r.precio, 0) / regs.length : 0;

    document.getElementById("fuelMes").textContent = svFmtUSD(gastoMes);
    document.getElementById("fuelProm").textContent = svFmtUSD(promPrecio);

    let rendimiento = "—";
    const conKm = regs.filter(r => r.km).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    if (conKm.length >= 2) {
      const diffKm = conKm[conKm.length - 1].km - conKm[0].km;
      const totalGal = conKm.slice(1).reduce((s, r) => s + r.galones, 0);
      if (totalGal > 0 && diffKm > 0) rendimiento = (diffKm / totalGal).toFixed(1) + " km/gal";
    }
    document.getElementById("fuelRend").textContent = rendimiento;

    const chart = document.getElementById("fuelChart");
    if (regs.length === 0) {
      chart.innerHTML = "";
    } else {
      const last6 = regs.slice(0, 6).reverse();
      const max = Math.max(...last6.map(r => r.precio * r.galones), 1);
      chart.innerHTML = `<small class="text-dim">Últimos registros (USD gastados)</small>
        <div style="display:flex; align-items:flex-end; gap:8px; height:100px; margin-top:10px;">
          ${last6.map(r => {
            const total = r.precio * r.galones;
            const h = Math.max(6, Math.round((total / max) * 90));
            return `<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
              <div style="width:100%; height:${h}px; background:linear-gradient(180deg,var(--accent-2),var(--primary)); border-radius:6px 6px 0 0;"></div>
              <small style="font-size:10px;">${svFmtUSD(total)}</small>
            </div>`;
          }).join("")}
        </div>`;
    }

    const list = document.getElementById("fuelList");
    if (regs.length === 0) {
      list.innerHTML = `<div class="empty-state"><span class="emoji">⛽</span>Aún no has registrado compras de combustible.</div>`;
      return;
    }
    list.innerHTML = `<div class="panel">` + regs.slice(0, 30).map(r => `
      <div class="list-item">
        <div>
          <strong style="font-size:13.5px;">${r.vehiculo || "Vehículo"}</strong><br>
          <small class="text-dim">${r.galones} gal · ${svFmtUSD(r.precio)}/gal · ${new Date(r.fecha).toLocaleDateString("es-SV")}</small>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <strong>${svFmtUSD(r.precio * r.galones)}</strong>
          <button class="icon-btn" style="width:30px;height:30px;font-size:13px;" data-del="${r.id}">✕</button>
        </div>
      </div>`).join("") + `</div>`;

    list.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => { svStore.remove(KEY, btn.dataset.del); render(); svToast("Registro eliminado"); });
    });
  }

  document.getElementById("formGasolina").addEventListener("submit", (e) => {
    e.preventDefault();
    const precio = parseFloat(document.getElementById("fPrecio").value);
    const galones = parseFloat(document.getElementById("fGalones").value);
    if (!precio || !galones) { svToast("Completa precio y galones"); return; }
    svStore.push(KEY, {
      id: svUid(),
      precio, galones,
      km: parseFloat(document.getElementById("fKm").value) || null,
      vehiculo: document.getElementById("fVehiculo").value.trim(),
      fecha: document.getElementById("fFecha").value ? new Date(document.getElementById("fFecha").value).toISOString() : new Date().toISOString()
    });
    e.target.reset();
    render();
    svToast("Registrado ⛽");
  });

  document.addEventListener("DOMContentLoaded", render);
})();
