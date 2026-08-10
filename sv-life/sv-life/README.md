# 🇸🇻 SV Life

Asistente digital para la vida cotidiana en El Salvador: clima, IA (SV AI), mapa, trámites, emergencias, gastos, combustible y calendario — todo en una PWA instalable, ligera y sin backend obligatorio.

## 📁 Estructura

```
sv-life/
├── index.html
├── manifest.json
├── service-worker.js
├── .env.example
├── css/
│   └── style.css
├── js/
│   ├── config.js      ← constantes editables (números de emergencia, backend URL, etc.)
│   ├── data.js         ← trámites, turismo y noticias demo
│   ├── store.js         ← almacenamiento local (localStorage)
│   ├── app.js            ← navegación, tema, ajustes, PWA
│   ├── weather.js
│   ├── ai.js
│   ├── map.js
│   ├── tramites.js
│   ├── emergencias.js
│   ├── dinero.js
│   ├── gasolina.js
│   ├── calendario.js
│   ├── turismo.js
│   └── noticias.js
├── assets/icons/        ← íconos PWA (192, 512, maskable)
└── backend/
    └── gemini-proxy.php  ← proxy OPCIONAL para ocultar tu clave de Gemini
```

No hay build ni framework: es HTML + CSS + JS puro, así que se puede editar y desplegar directamente.

---

## ▶️ 1. Ejecutar en local (para probar)

Como es una PWA, el navegador necesita servir los archivos por HTTP (no abrir el `index.html` con doble clic, porque el Service Worker y `fetch()` no funcionan bien con `file://`).

Opción más simple, con Python (ya viene instalado en la mayoría de sistemas):

```bash
cd sv-life
python3 -m http.server 8080
```

Luego abre: `http://localhost:8080`

Alternativas: `npx serve .` (Node) o la extensión "Live Server" de VS Code.

La app funciona de inmediato con **datos de demostración** (clima demo, SV AI en modo demo, trámites, turismo y emergencias reales/estáticos) — no necesitas ninguna clave para probarla.

---

## 🚀 2. Subir a Apache / hosting compartido (cPanel, etc.)

1. Sube **todo el contenido** de la carpeta `sv-life/` a la carpeta pública de tu hosting (normalmente `public_html/` o una subcarpeta si usas un subdominio, ej. `public_html/svlife/`).
2. Asegúrate de que el sitio se sirva por **HTTPS** (obligatorio para que el Service Worker y la geolocalización funcionen). La mayoría de hostings con cPanel dan un certificado SSL gratis (Let's Encrypt / AutoSSL) — actívalo desde el panel.
3. Abre `https://tu-dominio.com/` (o `/svlife/`) desde el celular o la computadora — listo, ya está en producción.
4. Si usarás el proxy PHP opcional para Gemini (ver sección 4), tu hosting debe soportar PHP (la gran mayoría de Apache compartido lo trae por defecto).

No necesitas Node, bases de datos ni build: son archivos estáticos + un PHP opcional.

---

## 🌦️ 3. Configurar OpenWeather (clima real)

1. Crea una cuenta gratis en https://openweathermap.org/api
2. Genera una **API key** (tarda unos minutos en activarse tras crearla).
3. Dentro de la app, ve a **⚙️ Ajustes → Claves de API** y pega tu clave en "OpenWeather API Key" → **Guardar claves**.
4. La clave queda guardada solo en el navegador del usuario (`localStorage`), nunca se sube a ningún servidor de SV Life.

Sin clave configurada, la sección de Clima muestra datos de **demostración**, claramente marcados como "Demo".

---

## 🤖 4. Configurar Google Gemini (SV AI)

Tienes dos formas de usarlo:

### Opción A — Directo desde el navegador (más simple)
1. Consigue una clave gratuita en https://aistudio.google.com/app/apikey
2. En **⚙️ Ajustes → Claves de API**, pega tu clave en "Gemini API Key" → Guardar.
3. Listo: SV AI llamará a Gemini directamente desde el navegador del usuario.

⚠️ Con esta opción, cualquiera que abra las herramientas de desarrollador del navegador podría ver la clave guardada en `localStorage`. Es aceptable para uso personal o de un grupo cerrado, pero **no recomendable** si vas a compartir la app públicamente con muchas personas.

### Opción B — Con el proxy PHP incluido (más seguro, recomendado para producción pública)
1. Copia `.env.example` a `backend/.env` y coloca tu clave real:
   ```
   GEMINI_API_KEY=tu_clave_real_aqui
   GEMINI_MODEL=gemini-2.0-flash
   ```
2. Sube la carpeta `backend/` a tu hosting con PHP (junto al resto de la app o en una ruta protegida).
3. Edita `js/config.js` y define:
   ```js
   BACKEND_URL: "https://tu-dominio.com/backend"
   ```
4. Deja vacío el campo "Gemini API Key" en Ajustes: la app detectará automáticamente que hay `BACKEND_URL` configurado y usará el proxy en vez de llamar a Gemini directamente.

Con esta opción, la clave de Gemini **nunca** llega al navegador del usuario.

---

## 📄 5. Trámites, emergencias y turismo

- **Emergencias 🚨**: los números están en `js/config.js` → `SV_CONFIG.EMERGENCY_NUMBERS`. Edítalos ahí si cambian; nunca se inventan en el código.
- **Trámites 📄** y **Turismo 🌴**: los datos están en `js/data.js`. Puedes agregar, quitar o corregir entradas directamente en ese archivo. Los trámites siempre muestran un aviso de "verificar información oficial" porque requisitos y costos cambian con frecuencia.
- **Noticias 📰**: sección de demostración lista para conectar una API de noticias real en `js/noticias.js`.

---

## 📲 6. Instalar la PWA en el celular / escritorio

**Android (Chrome):**
1. Abre la app desde el navegador (debe ser HTTPS).
2. Toca el menú ⋮ → **"Instalar aplicación"** o **"Agregar a pantalla de inicio"**.
3. Aparecerá el ícono de SV Life en tu pantalla de inicio, como una app nativa.

**iPhone (Safari):**
1. Abre la app en Safari.
2. Toca el botón de compartir (cuadro con flecha) → **"Agregar a pantalla de inicio"**.

**Escritorio (Chrome / Edge):**
1. Abre la app.
2. Haz clic en el ícono de instalación (⊕ o pantalla con flecha) en la barra de direcciones, o en el menú ⋮ → **"Instalar SV Life"**.

Una vez instalada, la app abre en su propia ventana, sin barra del navegador, y funciona parcialmente sin conexión gracias al Service Worker (`service-worker.js`), que guarda en caché el "app shell" (HTML, CSS, JS e íconos). Las funciones que dependen de internet (clima en vivo, SV AI, mapa) requieren conexión; el resto (gastos, gasolina, calendario, trámites, emergencias) sigue funcionando offline porque se guarda en `localStorage`.

---

## 🔐 Seguridad — resumen

- Ninguna clave real está escrita en el código fuente.
- `js/config.js` solo trae **placeholders/estructura**, no claves.
- Las claves que el usuario ingresa en Ajustes se guardan únicamente en su propio navegador.
- Si necesitas que la clave de Gemini nunca toque el navegador, usa el proxy PHP (`backend/gemini-proxy.php` + `backend/.env`), que **no se sube** a repositorios gracias a `.gitignore`.

---

## 🧪 Datos de demostración incluidos

Para que puedas probar la app de inmediato sin configurar nada:
- **Clima**: modo demo con temperatura/humedad simuladas y aviso visible.
- **SV AI**: responde con ejemplos preprogramados de El Salvador (DUI, turismo, gasolina) cuando no hay clave de Gemini.
- **Turismo**: 14 lugares reales de El Salvador (playas, volcanes, pueblos, miradores, sitios históricos).
- **Trámites**: 8 categorías con información general verificada (DUI, NIT, pasaporte, licencia, matrícula, solvencias, antecedentes, otros).
- **Emergencias**: números configurables desde `js/config.js`.
- **Noticias**: contenido claramente marcado como "Demo".

---

## 🛠️ Prioridades cubiertas en esta primera versión

1. ✅ Dashboard
2. ✅ SV AI (Gemini, con modo demo)
3. ✅ Clima (OpenWeather, con modo demo)
4. ✅ Mapa (Leaflet + OpenStreetMap + Overpass/Nominatim)
5. ✅ Trámites
6. ✅ Emergencias
7. ✅ Gastos (dinero + combustible)
8. ✅ PWA instalable con funcionamiento offline básico

Hecho con 🇸🇻 para la vida cotidiana en El Salvador.
