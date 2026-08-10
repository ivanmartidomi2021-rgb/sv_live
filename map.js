/* ============================================================
   SV LIFE — Mapa (Leaflet + OpenStreetMap, sin APIs de pago)
   Búsqueda de lugares vía Nominatim; categorías rápidas vía
   Overpass API (restaurantes, hospitales, gasolineras, etc.)
   ============================================================ */
(function () {
  "use strict";

  let map = null;
  let markersLayer = null;
  let userMarker = null;
  let activeCat = "all";

  const OVERPASS_TAGS = {
    hospital: 'amenity=hospital',
    restaurant: 'amenity=restaurant',
    fuel: 'amenity=fuel',
    bank: 'amenity=bank',
    supermarket: 'shop=supermarket',
    tourism: 'tourism=attraction'
  };
  const CAT_EMOJI = { hospital: "🏥", restaurant: "🍽️", fuel: "⛽", bank: "🏦", supermarket: "🛒", tourism: "🌴" };

  function ensureMap() {
    if (map) return;
    const start = SV_CONFIG.DEFAULT_LOCATION;
    map = L.map("map").setView([start.lat, start.lon], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
        userMarker = L.circleMarker([latitude, longitude], {
          radius: 8, color: "#1b5f83", fillColor: "#4fc3b6", fillOpacity: 0.9, weight: 2
        }).addTo(map).bindPopup("📍 Estás aquí");
      });
    }
  }

  function clearMarkers() {
    markersLayer.clearLayers();
  }

  function addMarker(lat, lon, title, emoji, extra) {
    const icon = L.divIcon({
      html: `<div style="font-size:22px; transform:translate(-50%,-100%);">${emoji}</div>`,
      className: "", iconSize: [0, 0]
    });
    const m = L.marker([lat, lon], { icon }).addTo(markersLayer);
    m.bindPopup(`<strong>${title}</strong>${extra ? "<br>" + extra : ""}`);
    return m;
  }

  async function loadCategory(cat) {
    ensureMap();
    clearMarkers();
    document.getElementById("mapResults").innerHTML = `<div class="spinner" style="margin:20px auto;"></div>`;
    if (cat === "all") {
      document.getElementById("mapResults").innerHTML = "";
      return;
    }
    const center = map.getCenter();
    const radius = 6000;
    const tag = OVERPASS_TAGS[cat];
    const query = `[out:json][timeout:15];node[${tag}](around:${radius},${center.lat},${center.lng});out 30;`;
    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: "data=" + encodeURIComponent(query)
      });
      if (!res.ok) throw new Error("Overpass " + res.status);
      const data = await res.json();
      const emoji = CAT_EMOJI[cat] || "📍";
      let listHtml = "";
      (data.elements || []).forEach(el => {
        const name = el.tags?.name || "Sin nombre";
        addMarker(el.lat, el.lon, name, emoji);
        listHtml += `<div class="list-item"><span>${emoji} ${name}</span></div>`;
      });
      document.getElementById("mapResults").innerHTML = listHtml
        ? `<div class="panel">${listHtml}</div>`
        : `<div class="empty-state"><span class="emoji">🔍</span>No se encontraron lugares cercanos en el mapa visible. Mueve o acerca el mapa e intenta de nuevo.</div>`;
    } catch (err) {
      console.warn("Overpass error", err);
      document.getElementById("mapResults").innerHTML = `<div class="notice">⚠️ No se pudo consultar OpenStreetMap en este momento. Intenta de nuevo más tarde.</div>`;
    }
  }

  async function searchPlace(q) {
    if (!q.trim()) return;
    document.getElementById("mapResults").innerHTML = `<div class="spinner" style="margin:20px auto;"></div>`;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ", El Salvador")}&limit=8`;
      const res = await fetch(url, { headers: { "Accept-Language": "es" } });
      const data = await res.json();
      ensureMap();
      clearMarkers();
      let html = "";
      data.forEach(place => {
        addMarker(parseFloat(place.lat), parseFloat(place.lon), place.display_name.split(",")[0], "📍");
        html += `<div class="list-item" style="cursor:pointer;" data-lat="${place.lat}" data-lon="${place.lon}"><span>📍 ${place.display_name}</span></div>`;
      });
      document.getElementById("mapResults").innerHTML = html
        ? `<div class="panel">${html}</div>`
        : `<div class="empty-state"><span class="emoji">🔍</span>Sin resultados para "${q}".</div>`;
      document.querySelectorAll("#mapResults .list-item[data-lat]").forEach(item => {
        item.addEventListener("click", () => {
          map.setView([parseFloat(item.dataset.lat), parseFloat(item.dataset.lon)], 15);
        });
      });
      if (data[0]) map.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 14);
    } catch (err) {
      console.warn("Nominatim error", err);
      document.getElementById("mapResults").innerHTML = `<div class="notice">⚠️ No se pudo buscar en este momento. Revisa tu conexión.</div>`;
    }
  }

  document.getElementById("mapFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll("#mapFilters .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeCat = chip.dataset.cat;
    loadCategory(activeCat);
  });

  document.getElementById("mapSearchBtn").addEventListener("click", () => searchPlace(document.getElementById("mapSearch").value));
  document.getElementById("mapSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchPlace(e.target.value);
  });

  window.svInitMap = function () {
    ensureMap();
    setTimeout(() => map.invalidateSize(), 150);
  };
})();
