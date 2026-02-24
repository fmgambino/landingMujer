/* =========================
   CONFIG
========================= */

// 1) Endpoint de leads (TU endpoint real)
const LEADS_ENDPOINT = "https://elinversorg.info/wp-json/eig-leads/v1/lead";

// 2) Acciones post-submit (editá a tus URLs reales)
const EBOOK_URL = "https://elinversorg.info/ebook-gratis.pdf";
const WHATSAPP_CHANNEL_URL = "https://chat.whatsapp.com/TU-CANAL";

// 3) Fecha objetivo para el contador (ajustala)
// Formato: "YYYY-MM-DDTHH:MM:SS-03:00"
const EVENT_DATETIME = "2026-03-10T11:30:00-03:00";

// 4) TikToks (verticales). Para reproducir dentro del sitio:
// - Pegar el "videoId" del enlace largo de TikTok (no el vt.tiktok.com corto)
// - Si no lo tenés, dejá videoId: "" y se abrirá el link en otra pestaña.
const TIKTOKS = [
  {
    title: "Finanzas sin humo",
    sub: "Criterio antes de invertir",
    url: "https://www.tiktok.com/@elinversorg/video/7609745219994651924?is_from_webapp=1&sender_device=pc",
    videoId: "7609745219994651924" // <- poné el ID real aquí (ej: "7481234567890123456")
  },
  {
    title: "Errores comunes",
    sub: "Lo que te hace perder dinero",
    url: "https://www.tiktok.com/",
    videoId: ""
  },
  {
    title: "Riesgo real",
    sub: "Cómo controlarlo",
    url: "https://www.tiktok.com/",
    videoId: ""
  },
  {
    title: "Plan simple",
    sub: "Próximos pasos",
    url: "https://www.tiktok.com/",
    videoId: ""
  }
];

// 5) Reviews (mujeres + países) con fotos femeninas
const REVIEWS = [
  {
    name: "Lucía M.",
    country: "Argentina",
    stars: 5,
    text: "Me ordenó la cabeza. Ahora sé qué mirar y qué ignorar.",
    img: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    name: "Camila R.",
    country: "Chile",
    stars: 5,
    text: "Cero humo. Explica con lógica y ejemplos claros.",
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Valentina G.",
    country: "Colombia",
    stars: 4,
    text: "Lo mejor: el criterio para decidir sin depender de otros.",
    img: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "Ana P.",
    country: "Perú",
    stars: 5,
    text: "Me dio tranquilidad para empezar sin miedo.",
    img: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    name: "Sofía L.",
    country: "Argentina",
    stars: 5,
    text: "Entendí la diferencia entre apostar y planificar.",
    img: "https://randomuser.me/api/portraits/women/25.jpg"
  }
];

/* =========================
   HELPERS
========================= */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function pad2(n){ return String(n).padStart(2, "0"); }
function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function buildCalendarLink({ title, details, startISO, endISO, email }){
  const fmt = (d) => d.toISOString().replace(/-|:|\.\d{3}/g, "");
  const start = fmt(new Date(startISO));
  const end = fmt(new Date(endISO));
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: details,
    dates: `${start}/${end}`,
    add: email || ""
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

/* =========================
   THEME (fix real)
========================= */
(function initTheme(){
  const btn = $("#themeToggle");
  const icon = $("#themeIcon");

  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.replace("theme-dark","theme-light");
  if (saved === "dark") document.body.classList.replace("theme-light","theme-dark");

  const isLight = document.body.classList.contains("theme-light");
  icon.textContent = isLight ? "🌞" : "🌙";

  btn.addEventListener("click", () => {
    const light = document.body.classList.toggle("theme-light");
    document.body.classList.toggle("theme-dark", !light);
    localStorage.setItem("theme", light ? "light" : "dark");
    icon.textContent = light ? "🌞" : "🌙";
  });
})();

/* =========================
   SCROLL
========================= */
$$("[data-scroll]").forEach(btn=>{
  btn.addEventListener("click", () => {
    const sel = btn.getAttribute("data-scroll");
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  });
});

/* =========================
   COUNTDOWN
========================= */
(function initCountdown(){
  const dEl = $("#cdDays");
  const hEl = $("#cdHours");
  const mEl = $("#cdMins");
  const sEl = $("#cdSecs");

  const target = new Date(EVENT_DATETIME).getTime();

  function tick(){
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const totalSec = Math.floor(diff / 1000);

    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    dEl.textContent = pad2(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(mins);
    sEl.textContent = pad2(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* =========================
   FAQ Accordion
========================= */
(function initFAQ(){
  $$(".faq__item").forEach(item=>{
    item.addEventListener("click", () => {
      const open = item.getAttribute("aria-expanded") === "true";
      // cerrar otros (estilo profesional)
      $$(".faq__item").forEach(x => x.setAttribute("aria-expanded", "false"));
      item.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });
})();

/* =========================
   TikTok slider (vertical cards)
========================= */
(function renderTikToks(){
  const host = $("#tiktokSlider");
  if (!host) return;

  host.innerHTML = TIKTOKS.map((t, idx) => {
    const title = escapeHtml(t.title);
    const sub = escapeHtml(t.sub);
    const url = escapeHtml(t.url);
    const vid = escapeHtml(t.videoId || "");
    return `
      <article class="story" data-idx="${idx}" data-url="${url}" data-videoid="${vid}">
        <div class="story__frame">
          <div class="story__meta">
            <div>
              <div class="story__title">${title}</div>
              <div class="story__sub">${sub}</div>
            </div>
            <button class="playbtn" type="button" aria-label="Reproducir">
              <span>▶</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // click to play
  host.addEventListener("click", (e) => {
    const card = e.target.closest(".story");
    if (!card) return;

    const videoId = card.getAttribute("data-videoid");
    const url = card.getAttribute("data-url");

    if (videoId && videoId.trim().length > 5) {
      openVideoModal(videoId);
    } else {
      // fallback: abrir link
      window.open(url, "_blank", "noopener");
    }
  });
})();

/* =========================
   Reviews slider
========================= */
(function renderReviews(){
  const host = $("#reviewsSlider");
  if (!host) return;

  const starsStr = (n) => "★★★★★☆☆☆☆☆".slice(0, Math.min(5,n)) + "☆☆☆☆☆".slice(0, 5-Math.min(5,n));
  host.innerHTML = REVIEWS.map(r => {
    const name = escapeHtml(r.name);
    const country = escapeHtml(r.country);
    const text = escapeHtml(r.text);
    const img = escapeHtml(r.img);
    const stars = starsStr(r.stars);
    return `
      <article class="review">
        <div class="review__top">
          <img class="avatar" src="${img}" alt="${name}" loading="lazy" />
          <div>
            <div class="review__name">${name}</div>
            <div class="review__meta">${country}</div>
            <div class="stars" aria-label="${r.stars} estrellas">${stars}</div>
          </div>
        </div>
        <p class="review__text">“${text}”</p>
      </article>
    `;
  }).join("");
})();

/* =========================
   Form modal + Post actions
========================= */
const formModal = $("#formModal");
const leadForm = $("#leadForm");
const postActions = $("#postActions");
const submitBtn = $("#submitBtn");

function openFormModal(){
  formModal.classList.add("is-open");
  formModal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  // focus first input for mobile
  const first = leadForm?.querySelector("input[name='nombre']");
  setTimeout(() => first?.focus(), 80);
}
function closeFormModal(){
  formModal.classList.remove("is-open");
  formModal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

$$("[data-open-form]").forEach(btn => btn.addEventListener("click", openFormModal));
$$("[data-close]").forEach(btn => btn.addEventListener("click", closeFormModal));

document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape"){
    if (formModal.classList.contains("is-open")) closeFormModal();
    if ($("#videoModal").classList.contains("is-open")) closeVideoModal();
  }
});

leadForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(leadForm);
  const payload = {
    nombre: String(formData.get("nombre") || "").trim(),
    whatsapp: String(formData.get("whatsapp") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    origen: "Landing Masterclass Mujeres (Seminario)"
  };

  // UX: loading
  submitBtn.disabled = true;
  submitBtn.textContent = "Confirmando…";

  try{
    const res = await fetch(LEADS_ENDPOINT, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("No se pudo enviar el lead (HTTP " + res.status + ")");
    }

    // Build calendar link: start = EVENT_DATETIME; end = + 1h
    const start = new Date(EVENT_DATETIME);
    const end = new Date(start.getTime() + 60*60*1000);

    const calendar = buildCalendarLink({
      title: "Masterclass en Vivo – El Inversor G",
      details: "Masterclass gratuita en vivo. Recordatorio + materiales.",
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      email: payload.email
    });

    $("#calendarLink").href = calendar;
    $("#ebookLink").href = EBOOK_URL;
    $("#waLink").href = WHATSAPP_CHANNEL_URL;

    // hide form, show post actions inside same modal
    leadForm.classList.add("hidden");
    postActions.classList.remove("hidden");

  } catch(err){
    alert("Error al confirmar. Revisá tu conexión o el endpoint.\n\nDetalle: " + (err?.message || err));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirmar inscripción";
  }
});

/* =========================
   Video modal (TikTok embed)
========================= */
const videoModal = $("#videoModal");
const videoContainer = $("#videoContainer");

function openVideoModal(videoId){
  // TikTok embed blockquote requires script loaded (we already included embed.js)
  // We'll inject the blockquote and re-run embed if available.
  videoContainer.innerHTML = `
    <blockquote class="tiktok-embed"
      cite="https://www.tiktok.com/@elinversorg/video/${videoId}"
      data-video-id="${videoId}"
      style="max-width: 560px; min-width: 280px; margin: 0 auto;">
      <section></section>
    </blockquote>
  `;

  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";

  // Attempt to re-process embeds
  if (window.tiktok && typeof window.tiktok?.load === "function") {
    window.tiktok.load();
  }
}
function closeVideoModal(){
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  videoContainer.innerHTML = "";
}

$$("[data-close-video]").forEach(btn => btn.addEventListener("click", closeVideoModal));