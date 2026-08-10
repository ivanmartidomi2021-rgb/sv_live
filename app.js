/* ============================================================
   SV LIFE — App core: navegación, tema, saludo y arranque
   ============================================================ */
(function () {
  "use strict";

  // ---------- Navegación entre vistas ----------
  function goTo(viewId) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById("view-" + viewId);
    if (target) target.classList.add("active");
    document.querySelectorAll(".nav-item").forEach(n => {
      n.classList.toggle("active", n.dataset.nav === viewId);
    });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (viewId === "mapa" && window.svInitMap) window.svInitMap();
    if (viewId === "ai" && window.svInitChat) window.svInitChat();
    location.hash = viewId;
  }
  window.svGoTo = goTo;

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-nav]");
    if (el) goTo(el.dataset.nav);
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (id) goTo(id);
  });

  // ---------- Tema claro/oscuro ----------
  function applyTheme(mode) {
    const real = mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : mode;
    document.documentElement.setAttribute("data-theme", real);
    document.getElementById("themeToggle").textContent = real === "dark" ? "☀️" : "🌙";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", real === "dark" ? "#0b1720" : "#123a52");
  }
  function getThemePref() {
    return localStorage.getItem("sv_theme") || "system";
  }
  function setThemePref(mode) {
    localStorage.setItem("sv_theme", mode);
    applyTheme(mode);
    const sel = document.getElementById("themeSelect");
    if (sel) sel.value = mode;
  }
  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setThemePref(current === "dark" ? "light" : "dark");
  });
  document.getElementById("themeSelect").addEventListener("change", (e) => setThemePref(e.target.value));

  // ---------- Saludo + fecha/hora ----------
  function updateGreeting() {
    const name = localStorage.getItem("sv_name") || "";
    const h = new Date().getHours();
    const saludo = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
    document.getElementById("greeting").textContent = `${saludo}${name ? ", " + name : ""} 👋`;
  }
  function updateClock() {
    const now = new Date();
    const fecha = now.toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long" });
    const hora = now.toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit" });
    document.getElementById("dateTimeLine").textContent = `${fecha.charAt(0).toUpperCase() + fecha.slice(1)} · ${hora}`;
  }

  // ---------- Ajustes: nombre y claves ----------
  function loadSettingsForm() {
    document.getElementById("settingName").value = localStorage.getItem("sv_name") || "";
    const keys = svGetKeys();
    document.getElementById("geminiKey").value = keys.gemini;
    document.getElementById("owKey").value = keys.openweather;
    document.getElementById("themeSelect").value = getThemePref();
  }
  document.getElementById("saveName").addEventListener("click", () => {
    localStorage.setItem("sv_name", document.getElementById("settingName").value.trim());
    updateGreeting();
    svToast("Nombre guardado ✅");
  });
  document.getElementById("saveKeys").addEventListener("click", () => {
    svSaveKeys(document.getElementById("geminiKey").value.trim(), document.getElementById("owKey").value.trim());
    svToast("Claves guardadas en este dispositivo 🔒");
    if (window.svRefreshWeather) window.svRefreshWeather();
  });
  document.getElementById("btnResetData").addEventListener("click", () => {
    if (confirm("¿Seguro que deseas borrar todos tus datos guardados en este dispositivo? Esta acción no se puede deshacer.")) {
      svStore.clearAll();
      svToast("Datos borrados 🗑️");
      location.reload();
    }
  });
  document.getElementById("settingsBtn").addEventListener("click", () => goTo("ajustes"));

  // ---------- Detección de conexión ----------
  function updateOnlineStatus() {
    document.body.classList.toggle("is-offline", !navigator.onLine);
  }
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // ---------- Service worker + instalación PWA ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(err => console.warn("SW error", err));
    });
  }
  let deferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    svToast("💡 Puedes instalar SV Life desde el menú ⋮ o el ícono de instalar del navegador");
  });
  window.svTriggerInstall = async function () {
    if (!deferredInstallPrompt) {
      svToast("Usa el menú del navegador → 'Instalar aplicación'");
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  };

  // ---------- Inicio ----------
  function init() {
    applyTheme(getThemePref());
    updateGreeting();
    updateClock();
    setInterval(updateClock, 30000);
    loadSettingsForm();
    updateOnlineStatus();

    const startView = location.hash ? location.hash.replace("#", "") : "dashboard";
    goTo(document.getElementById("view-" + startView) ? startView : "dashboard");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
