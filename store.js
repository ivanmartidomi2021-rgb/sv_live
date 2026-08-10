/* ============================================================
   SV LIFE — Almacenamiento local (localStorage)
   Capa mínima para leer/escribir listas JSON por clave.
   ============================================================ */
const svStore = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (fallback ?? []);
    } catch (e) {
      console.warn("svStore.get error", key, e);
      return fallback ?? [];
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("svStore.set error", key, e);
      return false;
    }
  },
  push(key, item) {
    const arr = svStore.get(key, []);
    arr.unshift(item);
    svStore.set(key, arr);
    return arr;
  },
  remove(key, predicateId) {
    const arr = svStore.get(key, []).filter(i => i.id !== predicateId);
    svStore.set(key, arr);
    return arr;
  },
  clearAll() {
    ["sv_gastos", "sv_fuel", "sv_eventos", "sv_chat", "sv_budget", "sv_name"]
      .forEach(k => localStorage.removeItem(k));
  }
};

function svUid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function svToast(msg, ms = 2600) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(svToast._h);
  svToast._h = setTimeout(() => t.classList.remove("show"), ms);
}
function svFmtUSD(n) {
  return "$" + (Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
