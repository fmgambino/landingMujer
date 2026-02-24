/* =========================
   CONFIG
========================= */

// 1) Endpoint de leads (TU endpoint real)
const LEADS_ENDPOINT = "https://elinversorg.info/wp-json/eig-leads/v1/lead";

// 2) Acciones post-submit (editá a tus URLs reales)
const EBOOK_URL = "https://elinversorg.info/ebook-gratis.pdf";
const WHATSAPP_CHANNEL_URL = "https://chat.whatsapp.com/TU-CANAL";

// 3) Fecha objetivo para el contador (ajustala)
const EVENT_DATETIME = "2026-03-10T11:30:00-03:00";

// 4) TikToks (verticales) + thumbnail (imagen previa)
// 👉 thumb: poné una imagen tuya (recomendado 1080x1920) o screenshot del video.
// 👉 videoId: si está, se reproduce embebido; si no, abre el link.
const TIKTOKS = [
  {
    title: "Mis 3 tips Rentables",
    sub: "Criterio antes de invertir",
    url: "https://www.tiktok.com/@elinversorg/video/7609745219994651924?is_from_webapp=1&sender_device=pc",
    videoId: "7609745219994651924",
    thumb: "https://i.ibb.co/wNYypNLY/C674-A837-C3-CF-46-D2-AEF5-8-C047-C5-FB4-BE.png"
  },
  {
    title: "Errores comunes",
    sub: "Lo que te hace perder dinero",
    url: "https://www.tiktok.com/@elinversorg/video/7608037687638969621?_r=1&_t=ZS-94BpuABQ1av",
    videoId: "7608037687638969621",
    thumb: "https://i.ibb.co/9m1gvg95/B1067366-066-D-4-EB2-BC99-6-BDD6-A548-C00.png"
  },
  {
    title: "Riesgo real",
    sub: "Cómo controlarlo",
    url: "https://www.tiktok.com/@elinversorg/video/7605270862782123285",
    videoId: "7605270862782123285",
    thumb: "https://i.ibb.co/LDcZZ7Y6/478-EA9-D6-2856-4088-B938-56-BA3-DB0-DB73.png"
  },
  {
    title: "Plan simple",
    sub: "Próximos pasos",
    url: "https://www.tiktok.com/",
    videoId: "",
    thumb: "/elinversorg.info/wp-content/uploads/2026/02/tiktok-thumb-4.jpg"
  }
];

// 5) Reviews (mujeres + países) con fotos femeninas
const REVIEWS = [
  { name: "Lucía M.", country: "Argentina", stars: 5, text: "Me ordenó la cabeza. Ahora sé qué mirar y qué ignorar.", img: "https://randomuser.me/api/portraits/women/32.jpg" },
  { name: "Camila R.", country: "Chile", stars: 5, text: "Cero humo. Explica con lógica y ejemplos claros.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Valentina G.", country: "Colombia", stars: 4, text: "Lo mejor: el criterio para decidir sin depender de otros.", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Ana P.", country: "Perú", stars: 5, text: "Me dio tranquilidad para empezar sin miedo.", img: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Sofía L.", country: "Argentina", stars: 5, text: "Entendí la diferencia entre apostar y planificar.", img: "https://randomuser.me/api/portraits/women/25.jpg" }
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
   THEME (robusto)
========================= */
(function initTheme(){
  const btn = $("#themeToggle");
  const icon = $("#themeIcon");
  if (!btn || !icon) return;

  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("theme-light");
    document.body.classList.remove("theme-dark");
  } else {
    document.body.classList.add("theme-dark");
    document.body.classList.remove("theme-light");
  }

  const syncIcon = () => {
    const isLight = document.body.classList.contains("theme-light");
    icon.textContent = isLight ? "🌞" : "🌙";
  };
  syncIcon();

  btn.addEventListener("click", () => {
    const willBeLight = !document.body.classList.contains("theme-light");
    document.body.classList.toggle("theme-light", willBeLight);
    document.body.classList.toggle("theme-dark", !willBeLight);
    localStorage.setItem("theme", willBeLight ? "light" : "dark");
    syncIcon();
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
  if (!dEl || !hEl || !mEl || !sEl) return;

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
      $$(".faq__item").forEach(x => x.setAttribute("aria-expanded", "false"));
      item.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });
})();

/* =========================
   TikTok slider (con thumbnail)
========================= */
(function renderTikToks(){
  const host = $("#tiktokSlider");
  if (!host) return;

  const fallbackThumb =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1920'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stop-color='#111118'/>
          <stop offset='1' stop-color='#000000'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#ffffff' font-family='Arial' font-size='64'>El Inversor G</text>
    </svg>`);

  host.innerHTML = TIKTOKS.map((t, idx) => {
    const title = escapeHtml(t.title);
    const sub = escapeHtml(t.sub);
    const url = escapeHtml(t.url);
    const vid = escapeHtml(t.videoId || "");
    const thumb = escapeHtml(t.thumb || fallbackThumb);

    return `
      <article class="story" data-idx="${idx}" data-url="${url}" data-videoid="${vid}">
        <div class="story__frame">
          <div class="story__thumb" style="background-image:url('${thumb}')"></div>
          <div class="story__overlay"></div>

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

  host.addEventListener("click", (e) => {
    const card = e.target.closest(".story");
    if (!card) return;

    const videoId = card.getAttribute("data-videoid");
    const url = card.getAttribute("data-url");

    if (videoId && videoId.trim().length > 5) {
      openVideoModal(videoId);
    } else {
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
  if (!formModal) return;
  formModal.classList.add("is-open");
  formModal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  const first = leadForm?.querySelector("input[name='nombre']");
  setTimeout(() => first?.focus(), 80);
}
function closeFormModal(){
  if (!formModal) return;
  formModal.classList.remove("is-open");
  formModal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

$$("[data-open-form]").forEach(btn => btn.addEventListener("click", openFormModal));
$$("[data-close]").forEach(btn => btn.addEventListener("click", closeFormModal));

document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape"){
    if (formModal?.classList.contains("is-open")) closeFormModal();
    if ($("#videoModal")?.classList.contains("is-open")) closeVideoModal();
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

  submitBtn.disabled = true;
  submitBtn.textContent = "Confirmando…";

  try{
    const res = await fetch(LEADS_ENDPOINT, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("No se pudo enviar el lead (HTTP " + res.status + ")");

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
  if (!videoModal || !videoContainer) return;

  // Embed robusto por iframe (funciona aunque embed.js no cargue)
  const src = `https://www.tiktok.com/embed/v2/${encodeURIComponent(videoId)}`;

  videoContainer.innerHTML = `
    <div class="tiktokFrame">
      <iframe
        src="${src}"
        title="TikTok video"
        frameborder="0"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowfullscreen
        scrolling="no"
      ></iframe>
    </div>
  `;

  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeVideoModal(){
  if (!videoModal || !videoContainer) return;
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  videoContainer.innerHTML = "";
}

$$("[data-close-video]").forEach(btn => btn.addEventListener("click", closeVideoModal));