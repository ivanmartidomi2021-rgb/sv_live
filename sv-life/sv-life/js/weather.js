/* ============================================================
   SV LIFE — Clima (OpenWeather + Geolocation API)
   Si no hay clave de OpenWeather configurada, se muestra un
   estado de demostración claramente identificado, nunca datos
   inventados presentados como reales.
   ============================================================ */
(function () {
  "use strict";

  const WEATHER_ICONS = {
    "01d": "☀️", "01n": "🌕", "02d": "🌤️", "02n": "☁️", "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️", "50d": "🌫️", "50n": "🌫️"
  };

  let lastCoords = null;

  async function fetchOpenWeather(lat, lon) {
    const key = svGetKeys().openweather;
    if (!key) return null;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${key}`;
    const fUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${key}`;
    const [cur, fc] = await Promise.all([fetch(url), fetch(fUrl)]);
    if (!cur.ok) throw new Error("OpenWeather: " + cur.status);
    const curData = await cur.json();
    const fcData = fc.ok ? await fc.json() : null;
    return { current: curData, forecast: fcData };
  }

  function demoWeather(cityName) {
    return {
      demo: true,
      name: cityName || "San Salvador",
      temp: 27, feels_like: 30, humidity: 65, wind: 9,
      desc: "Parcialmente nublado", icon: "02d"
    };
  }

  function renderHero(w) {
    const heroEl = document.getElementById("heroWeather");
    const mini = document.getElementById("miniWeather");
    if (!w) {
      heroEl.innerHTML = `<span>No se pudo cargar el clima</span>`;
      return;
    }
    const icon = WEATHER_ICONS[w.icon] || "🌡️";
    heroEl.innerHTML = `<span style="font-size:22px;">${icon}</span><span class="temp">${Math.round(w.temp)}°C</span><span>${w.desc}</span>`;
    document.getElementById("locationLine").textContent = `${w.name}${w.demo ? " · demo" : ""}`;
    mini.textContent = `${Math.round(w.temp)}°C · ${w.desc}`;
  }

  function renderClimaView(w, forecast) {
    const el = document.getElementById("climaContent");
    if (!w) {
      el.innerHTML = `<div class="empty-state"><span class="emoji">🌦️</span>No se pudo obtener el clima.</div>`;
      return;
    }
    const icon = WEATHER_ICONS[w.icon] || "🌡️";
    let html = `
      <div class="panel" style="text-align:center;">
        <div style="font-size:44px;">${icon}</div>
        <h2 style="font-size:32px;">${Math.round(w.temp)}°C</h2>
        <p class="text-dim">${w.desc} · ${w.name}</p>
        ${w.demo ? `<span class="badge warn mt-8">Datos de demostración — configura tu clave OpenWeather en Ajustes</span>` : ""}
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;">
        <div class="panel"><small class="text-dim">Sensación térmica</small><h3>${Math.round(w.feels_like)}°C</h3></div>
        <div class="panel"><small class="text-dim">Humedad</small><h3>${w.humidity}%</h3></div>
        <div class="panel"><small class="text-dim">Viento</small><h3>${w.wind} km/h</h3></div>
        <div class="panel"><small class="text-dim">Actualizado</small><h3 style="font-size:14px;">${new Date().toLocaleTimeString("es-SV",{hour:'2-digit',minute:'2-digit'})}</h3></div>
      </div>`;
    if (forecast && forecast.list) {
      const days = {};
      forecast.list.forEach(item => {
        const d = item.dt_txt.split(" ")[0];
        if (!days[d]) days[d] = item;
      });
      const arr = Object.values(days).slice(0, 5);
      html += `<div class="section-title"><h2>Próximos días</h2></div><div class="hscroll">`;
      arr.forEach(item => {
        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString("es-SV", { weekday: "short" });
        const ic = WEATHER_ICONS[item.weather[0].icon] || "🌡️";
        html += `<div class="place-card" style="min-width:110px;">
          <div class="body" style="text-align:center;">
            <strong style="text-transform:capitalize;">${dayName}</strong>
            <div style="font-size:26px;margin:6px 0;">${ic}</div>
            <small>${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°</small>
          </div></div>`;
      });
      html += `</div>`;
    } else if (w.demo) {
      html += `<div class="notice">📅 El pronóstico de varios días requiere una clave de OpenWeather válida.</div>`;
    }
    el.innerHTML = html;
  }

  async function loadWeather(lat, lon, cityName) {
    try {
      const data = await fetchOpenWeather(lat, lon);
      if (!data) {
        const demo = demoWeather(cityName);
        renderHero(demo);
        renderClimaView(demo, null);
        return;
      }
      const c = data.current;
      const w = {
        name: cityName || c.name,
        temp: c.main.temp, feels_like: c.main.feels_like,
        humidity: c.main.humidity, wind: Math.round(c.wind.speed * 3.6),
        desc: c.weather[0].description, icon: c.weather[0].icon
      };
      renderHero(w);
      renderClimaView(w, data.forecast);
    } catch (err) {
      console.warn("Weather error", err);
      const demo = demoWeather(cityName);
      renderHero(demo);
      renderClimaView(demo, null);
      svToast("⚠️ No se pudo conectar con OpenWeather, mostrando modo demo");
    }
  }

  window.svRefreshWeather = function () {
    if (lastCoords) loadWeather(lastCoords.lat, lastCoords.lon, lastCoords.name);
  };

  function requestGeolocation() {
    if (!navigator.geolocation) {
      lastCoords = { ...SV_CONFIG.DEFAULT_LOCATION };
      loadWeather(lastCoords.lat, lastCoords.lon, lastCoords.name);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lastCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude, name: "Tu ubicación" };
        loadWeather(lastCoords.lat, lastCoords.lon, lastCoords.name);
      },
      () => {
        lastCoords = { ...SV_CONFIG.DEFAULT_LOCATION };
        loadWeather(lastCoords.lat, lastCoords.lon, lastCoords.name);
      },
      { timeout: 8000 }
    );
  }

  document.getElementById("citySelect").addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "auto") { requestGeolocation(); return; }
    const [name, lat, lon] = val.split(",");
    lastCoords = { lat: parseFloat(lat), lon: parseFloat(lon), name };
    loadWeather(lastCoords.lat, lastCoords.lon, name);
  });

  document.addEventListener("DOMContentLoaded", requestGeolocation);
})();
