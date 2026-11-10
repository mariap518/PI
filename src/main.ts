import "./styles.css";
import logo from "./assets/logo-new.png";
import { getEvents, initEvents, deleteEvent, formatDateString, placeLabel, type EventItem } from "./services/db";
import { getCurrentUser, updateUser } from "./services/auth";
import { renderLogin } from "./views/login";
import { renderEventDetail, renderCheckout } from "./views/screens";
import { renderProfile } from "./views/profile";
import { renderDashboard } from "./views/dashboard";
import { renderCreateEvent, renderEditEvent, renderHowItWorks, renderStatic } from "./views/pages";
import { mountHelp } from "./views/help";
import { themesFor, MOON, getTheme, setTheme, initTheme, type Theme } from "./services/theme";
import { CATEGORIES, POPULAR, catPlural, catSlug, catBySlug, catStyle, type Cat } from "./services/categories";

/* ── Utilidades ── */
const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const cop = (n: number) => "$ " + n.toLocaleString("es-CO");
const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel);
const app = $("#app")!;
let current: EventItem | null = null;

const ic = {
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.84 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.18 1 12 1 12s0 3.82.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.82 23 12 23 12s0-3.82-.46-5.58zM9.5 15.5v-7l6.5 3.5-6.5 3.5z",
  twitter: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z",
};
const icon = (d: string, size = 16, fill = "none") =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

/* ── Estado ── */
const ALL = "Todas las ciudades";
const cityList = () => [ALL, ...Array.from(new Set(state.all.map(e => e.city))).sort((a, b) => a.localeCompare(b, "es"))];
const DATES = ["Cualquier fecha", "Esta semana", "Este mes", "Personalizado..."];
const PAGE_SIZE = 6;

const state = {
  all: getEvents(), filtered: getEvents(), visible: PAGE_SIZE,
  category: null as string | null,
  q: "", city: ALL, date: DATES[0], start: "", end: "",
};

/* ── Vistas ── */
/** Botón de luna con mini menú de modos (claro, oscuro, exótico) */
function themeMenu() {
  const cur = getTheme();
  return `<div class="theme"><button class="theme__btn" data-theme-toggle aria-haspopup="menu" aria-expanded="false" aria-label="Cambiar modo de color" title="Modo de color">${icon(MOON, 18)}</button>
    <div class="theme__menu" role="menu" hidden>${themesFor().map(t => `<button class="theme__opt theme__opt--${t.id}${t.id === cur ? " is-on" : ""}" role="menuitemradio" aria-checked="${t.id === cur}" data-theme-set="${t.id}"><span>${t.label}</span><i>${icon(t.icon, 18)}</i></button>`).join("")}</div></div>`;
}
const closeThemeMenu = () => document.querySelectorAll<HTMLElement>(".theme__menu").forEach(m => {
  m.hidden = true; m.parentElement?.querySelector(".theme__btn")?.setAttribute("aria-expanded", "false");
});

function navbar() {
  const u = getCurrentUser();
  const right = u
    ? `<button class="user-chip" data-go="profile"><span class="avatar">${esc(u.name.charAt(0).toUpperCase())}</span><span class="hide-sm">${esc(u.name.split(" ")[0])}</span></button>`
    : `<button class="link" data-go="login">Entrar</button><button class="btn btn--cream" data-go="register">Registro</button>`;
  return `<header class="nav"><div class="container nav__in">
    <a href="#" data-go="home"><img src="${logo}" alt="6ix Event logo" height="40"></a>
    <nav class="nav__links"><button class="link hide-sm" data-scroll="events">Eventos</button>
      <button class="link hide-sm" data-go="how">Cómo funciona</button>${u && u.role !== "cliente" ? `<button class="link" data-go="dashboard">Panel</button>` : ""}${right}${themeMenu()}</nav></div></header>`;
}

const select = (id: string, ico: string, opts: string[], val: string, cls = "") =>
  `<div class="field ${cls}">${icon(ico)}<select id="${id}" aria-label="${id}">${opts
    .map(o => `<option${o === val ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;

/** Eventos del carrusel. Para cambiarlos basta con editar esta lista de ids (o las imágenes en db.ts). */
const FEATURED_IDS = [3, 6, 7, 17, 18, 19];
const featured = () => {
  const list = FEATURED_IDS.map(id => state.all.find(e => e.id === id)).filter((e): e is EventItem => !!e);
  return list.length ? list : state.all.slice(0, 6);
};
const bigImg = (u: string) => u.replace("w=600&h=380", "w=1920&h=800");
const chevron = (dir: 1 | -1) => icon(dir === 1 ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6", 22);

function carousel() {
  const list = featured();
  if (!list.length) return `<div class="hero-gap"></div>`;
  return `<div class="hero" id="hero" role="region" aria-roledescription="carrusel" aria-label="Eventos destacados">
    ${list.map((e, i) => `<article class="slide${i === 0 ? " is-active" : ""}" data-hero-ev="${e.id}" aria-hidden="${i !== 0}" aria-label="${esc(e.title)}">
      <img class="slide__img" src="${esc(bigImg(e.img))}" alt=""${i ? ' loading="lazy"' : ""} onerror="this.style.display='none'">
      <div class="slide__shade"></div>
      <div class="container slide__in"><div class="slide__txt" style="${catStyle(e.category)}">
        <span class="slide__tag">${esc(e.category)}</span>
        <h2>${esc(e.title)}</h2>
        <p class="slide__meta"><span>${icon(ic.calendar, 16)}${formatDateString(e.date)}</span><span>${icon(ic.location, 16)}${esc(placeLabel(e))}</span></p>
        <div class="slide__cta"><button class="btn btn--cream" data-hero-ev="${e.id}">Ver evento</button><span class="slide__price">Desde <b>${cop(e.price)}</b></span></div>
      </div></div></article>`).join("")}
    ${list.length > 1 ? `<button class="hero__arrow hero__arrow--prev" data-hero-dir="-1" aria-label="Evento anterior">${chevron(-1)}</button>
    <button class="hero__arrow hero__arrow--next" data-hero-dir="1" aria-label="Evento siguiente">${chevron(1)}</button>
    <div class="hero__dots">${list.map((e, i) => `<button class="hero__dot${i === 0 ? " is-on" : ""}" data-hero-dot="${i}" aria-label="Ir a ${esc(e.title)}" aria-current="${i === 0}"></button>`).join("")}</div>` : ""}
  </div>`;
}

function hero() {
  return `<section>${carousel()}
    <div class="container searchbox"><div class="search">
      <div class="field">${icon(ic.search)}<input id="q" type="text" placeholder="Nombre del evento o ponente…" value="${esc(state.q)}"></div>
      ${select("city", ic.location, cityList(), state.city, "sm")}
      <div class="field sm">${icon(ic.calendar)}<select id="date" aria-label="Fecha">${DATES.map(o => `<option${o === state.date ? " selected" : ""}>${o}</option>`).join("")}</select>
        <div class="range${state.date === DATES[3] ? " is-open" : ""}" id="range"><input type="date" id="start" value="${state.start}"><input type="date" id="end" value="${state.end}"></div></div>
      <button class="btn btn--navy" id="btn-search">${icon(ic.search, 15)} Buscar eventos</button></div>
      <div class="chips" id="chips"></div></div></section>`;
}

/* ── Carrusel: movimiento ── */
let heroIdx = 0, heroTimer: number | undefined, heroPaused = false;
const HERO_MS = 6500;
function heroShow(i: number) {
  const slides = document.querySelectorAll<HTMLElement>("#hero .slide");
  if (!slides.length) return;
  heroIdx = (i + slides.length) % slides.length;
  slides.forEach((el, k) => { el.classList.toggle("is-active", k === heroIdx); el.setAttribute("aria-hidden", String(k !== heroIdx)); });
  document.querySelectorAll<HTMLElement>("#hero [data-hero-dot]").forEach((d, k) => { d.classList.toggle("is-on", k === heroIdx); d.setAttribute("aria-current", String(k === heroIdx)); });
}
function heroStop() { if (heroTimer !== undefined) clearInterval(heroTimer); heroTimer = undefined; }
function heroPlay() {
  heroStop();
  if (document.querySelectorAll("#hero .slide").length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  heroTimer = window.setInterval(() => {
    if (!$("#hero")) return heroStop();
    if (!heroPaused && !document.hidden) heroShow(heroIdx + 1);
  }, HERO_MS);
}
function startHero() {
  heroIdx = 0; heroPaused = false;
  const h = $("#hero");
  if (!h) return heroStop();
  const pause = () => { heroPaused = true; }, resume = () => { heroPaused = false; };
  h.addEventListener("mouseenter", pause); h.addEventListener("mouseleave", resume);
  h.addEventListener("focusin", pause); h.addEventListener("focusout", resume);
  let x0 = 0;
  h.addEventListener("touchstart", ev => { x0 = ev.touches[0].clientX; pause(); }, { passive: true });
  h.addEventListener("touchend", ev => {
    const dx = ev.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { heroShow(heroIdx + (dx < 0 ? 1 : -1)); heroPlay(); }
    resume();
  }, { passive: true });
  heroPlay();
}

function card(e: EventItem) {
  const u = getCurrentUser();
  const fav = !!u?.favorites?.includes(e.id);
  const canDel = u?.role === "admin" || (u?.role === "agente" && e.createdBy === u.id);
  return `<div class="card-wrap">
    ${canDel ? `<button class="card__edit" data-editev="${e.id}" title="Editar evento" aria-label="Editar evento">✎</button><button class="card__del" data-del="${e.id}" title="Eliminar evento" aria-label="Eliminar evento">✕</button>` : ""}
    <article class="card" style="${catStyle(e.category)}" tabindex="0" role="button" data-event="${e.id}" aria-label="Ver detalles de ${esc(e.title)}">
      <div class="card__img"><img src="${esc(e.img)}" alt="${esc(e.title)}" loading="lazy" onerror="this.style.display='none'"><span class="badge">${esc(e.category)}</span>
        <div class="card__tr"><button class="fav${fav ? " is-on" : ""}" data-fav="${e.id}" aria-pressed="${fav}" aria-label="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}">${icon(ic.heart, 16, fav ? "currentColor" : "none")}</button>
        <span class="rating">${icon(ic.star, 12)}${String(e.rating).replace(".", ",")}</span></div></div>
      <div class="card__body"><h3>${esc(e.title)}</h3>
        <p class="meta">${icon(ic.location, 14)}${esc(placeLabel(e))}</p><p class="meta">${icon(ic.calendar, 14)}${formatDateString(e.date)}</p></div></article></div>`;
}

function eventsSection() {
  return `<section id="destacados" class="sec"><div class="container"><h2>Eventos destacados</h2>
    <div class="evlist" id="feat-root"></div></div><div class="sec__line" aria-hidden="true"></div></section>
    <section id="eventos" class="sec sec--next"><div class="container"><h2 id="sec-title">Próximos eventos</h2>
    <div class="evlist" id="grid-root"></div><div class="more" id="more"></div></div></section>
    <section id="categorias" class="sec sec--cats"><div class="container"><h2>Categorías</h2>${catTiles()}</div></section>`;
}

/** Recuadros de categorías: cada uno enlaza a su página (#/categoria/xxx) */
function catTiles(except?: string) {
  const n = (c: string) => state.all.filter(e => e.category === c).length;
  return `<div class="cat-grid">${CATEGORIES.filter(c => c.name !== except).map(c => `<a class="cat-tile" href="#/categoria/${catSlug(c.name)}" style="${catStyle(c.name)}">
    <span class="cat-tile__name">${esc(c.plural)}</span><span class="cat-tile__n">${n(c.name)} eventos</span><span class="cat-tile__go" aria-hidden="true">${icon("M5 12h14M12 5l7 7-7 7", 18)}</span></a>`).join("")}</div>`;
}

/** Próximos primero (por fecha); los que ya pasaron, al final */
const byDate = (list: EventItem[]) => {
  const today = new Date(); const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const key = (e: EventItem) => { const t = localDate(e.date).getTime(); return t >= t0 ? t : t + 1e13; };
  return [...list].sort((a, b) => key(a) - key(b));
};

function footer() {
  const cols: [string, string[]][] = [
    ["Plataforma", ["Buscar eventos", "Mis boletas", "Crear evento", "Precios"]],
    ["Empresa", ["Acerca de nosotros", "Prensa", "Alianzas", "Trabaja con nosotros"]],
    ["Legal", ["Términos y condiciones", "Política de privacidad", "Política de reembolsos", "Cookies"]],
  ];
  const social = [["YouTube", ic.youtube, "https://www.youtube.com/@orslokXX"], ["Twitter/X", ic.twitter, "https://x.com/orslok"], ["Instagram", ic.instagram, "https://www.instagram.com/orslokx/"]];
  return `<footer class="footer"><div class="container footer__in"><div class="footer__cols">
    <div><img src="${logo}" alt="6ixEvent logo" height="40" style="mix-blend-mode:screen">
      <p>Plataforma líder de venta de boletas y gestión de eventos corporativos en Colombia.</p>
      <a href="tel:+5716074400">${icon(ic.phone, 14)} +57 601 744 0000</a><a href="mailto:contacto@sixevent.co">${icon(ic.mail, 14)} contacto@sixevent.co</a></div>
    ${cols.map(([t, ls]) => `<div><h4>${t}</h4><ul>${ls.map(l => `<li><button data-footer="${l}">${l}</button></li>`).join("")}</ul></div>`).join("")}</div>
    <div class="footer__bar"><span>© 2026 SIX EVENT S.A.S. · NIT 900.123.456-7 · Bogotá, Colombia</span>
      <div class="footer__right">${social.map(([l, d, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${l}">${icon(d, 15)}</a>`).join("")}
      ${["Visa", "Mastercard", "PSE", "Nequi"].map(p => `<span class="pay">${p}</span>`).join("")}</div></div></div></footer>`;
}

/* ── Pintado parcial (evita perder el foco de los inputs) ── */
function paintChips() {
  $("#chips")!.innerHTML = `<span>Categorías populares:</span>` + POPULAR.map(c =>
    `<button class="chip${state.category === c ? " is-on" : ""}" style="${catStyle(c)}" data-cat="${esc(c)}" aria-pressed="${state.category === c}">${esc(catPlural(c))}</button>`).join("");
}

/** ¿Hay buscador, ciudad, fecha o categoría aplicados? */
const filtersActive = () => !!(state.q.trim() || state.city !== ALL || state.date !== DATES[0] || state.category);

function paintGrid() {
  const active = filtersActive();
  const feat = featured();
  const ids = new Set(feat.map(e => e.id));
  // Sin filtros: "Eventos destacados" (los del carrusel) y "Próximos eventos" (el resto).
  // Con filtros: se oculta la sección destacada y se muestran todos los resultados.
  const pool = byDate(active ? state.filtered : state.filtered.filter(e => !ids.has(e.id)));
  $("#destacados")!.hidden = active || !feat.length;
  $("#feat-root")!.innerHTML = active ? "" : `<div class="grid">${feat.map(card).join("")}</div>`;
  $("#sec-title")!.textContent = active ? `Resultados (${state.filtered.length})` : "Próximos eventos";
  const list = pool.slice(0, state.visible);
  $("#grid-root")!.innerHTML = pool.length
    ? `<div class="grid">${list.map(card).join("")}</div>`
    : `<div class="empty">${active ? "No se encontraron eventos con los filtros seleccionados." : "Por ahora no hay más eventos programados."}</div>`;
  const u = getCurrentUser();
  const canCreate = u?.role === "admin" || u?.role === "agente";
  $("#more")!.innerHTML =
    (state.visible < pool.length ? `<button class="btn btn--ghost" id="btn-more">Ver más eventos</button>` : "") +
    (canCreate ? `<button class="btn btn--cream" data-go="create-event">Crear nuevo evento</button>` : "");
}

/* ── Página de categoría ── */
let catPage: Cat | null = null;
function paintCategory() {
  if (!catPage) return;
  const list = byDate(state.all.filter(e => e.category === catPage!.name));
  $("#cat-root")!.innerHTML = list.length
    ? `<div class="grid">${list.slice(0, state.visible).map(card).join("")}</div>`
    : `<div class="empty">Todavía no hay eventos en esta categoría.</div>`;
  const u = getCurrentUser();
  $("#more")!.innerHTML =
    (state.visible < list.length ? `<button class="btn btn--ghost" id="btn-more">Ver más eventos</button>` : "") +
    (u?.role === "admin" || u?.role === "agente" ? `<button class="btn btn--cream" data-go="create-event">Crear nuevo evento</button>` : "");
}
const repaint = () => (catPage && $("#cat-root") ? paintCategory() : paintGrid());

function renderCategory(slug: string) {
  state.all = getEvents();
  const c = catBySlug(slug);
  if (!c) return go("home");
  catPage = c; state.visible = PAGE_SIZE;
  const total = state.all.filter(e => e.category === c.name).length;
  app.innerHTML = `${navbar()}<main><section class="cathead" style="${catStyle(c.name)}"><div class="container">
    <button class="link cathead__back" data-go="home">← Volver al inicio</button>
    <span class="cathead__tag">Categoría</span><h1>${esc(c.plural)}</h1>
    <p>${total} ${total === 1 ? "evento" : "eventos"} · ordenados por fecha</p></div></section>
    <section class="sec sec--cat"><div class="container"><div class="evlist" id="cat-root"></div><div class="more" id="more"></div></div></section>
    <section class="sec sec--cats"><div class="container"><h2>Otras categorías</h2>${catTiles(c.name)}</div></section></main>${footer()}`;
  paintCategory();
}

/* ── Navegación ── */
type Page = "category" | "dashboard" | "edit-event" | "home" | "login" | "register" | "how" | "profile" | "event" | "checkout" | "create-event" | "static";

function render(page: Page, title?: string) {
  window.scrollTo({ top: 0 });
  heroStop();
  initTheme();
  catPage = null;
  if (page === "category") return renderCategory(title ?? "");
  if (page === "home") return renderHome();
  if (page === "login" || page === "register") {
    app.innerHTML = `<main id="auth-root" style="flex:1"></main>${footer()}`;
    return renderLogin($("#auth-root")!, page, () => go("home"), () => go("home"));
  }
  if (page === "how" || page === "create-event" || page === "edit-event" || page === "static") {
    app.innerHTML = `<main id="pg-root" style="flex:1"></main>${footer()}`;
    const root = $("#pg-root")!;
    if (page === "how") return renderHowItWorks(root, () => go("home"));
    if (page === "static") return renderStatic(root, title ?? "", () => go("home"));
    const done = () => { state.all = state.filtered = getEvents(); state.category = null; state.visible = PAGE_SIZE; go("home"); };
    if (page === "edit-event") return current ? renderEditEvent(root, current, done) : go("home");
    return renderCreateEvent(root, done);
  }
  if (page === "dashboard") {
    app.innerHTML = `<main id="dash-root" style="flex:1"></main>${footer()}`;
    return renderDashboard($("#dash-root")!, () => go("home"));
  }
  if (page === "profile") {
    app.innerHTML = `<main id="prof-root" style="flex:1"></main>${footer()}`;
    return renderProfile($("#prof-root")!, () => go("home"));
  }
  if ((page === "event" || page === "checkout") && current) {
    app.innerHTML = `<main id="scr"></main>${footer()}`;
    const root = $("#scr")!;
    return page === "event"
      ? renderEventDetail(root, current, () => go("home"), () => go("checkout"), () => go("login"))
      : renderCheckout(root, current, () => go("event"), () => go("profile"));
  }
  // TODO: migrar estas pantallas ( EventDetail, Checkout, ClientProfile, CreateEvent, HowItWorks, StaticPage)
  const name = title ?? ({ login: "Iniciar sesión", register: "Registro", how: "Cómo funciona", profile: "Mi perfil", event: "Detalle del evento", checkout: "Pago", "create-event": "Crear evento", static: "Información" } as Record<string, string>)[page];
  app.innerHTML = `${navbar()}<main><section class="placeholder"><h1>${esc(name)}</h1><p>Esta pantalla está pendiente de migrar.</p><button class="btn btn--cream" data-go="home">Volver al inicio</button></section></main>${footer()}`;
}

const HASH: Partial<Record<Page, string>> = { home: "#/", login: "#/login", register: "#/registro", how: "#/como-funciona", profile: "#/perfil", "create-event": "#/crear-evento", dashboard: "#/panel" };
function hashFor(page: Page, title?: string) {
  if (page === "event") return `#/evento/${current?.id}`;
  if (page === "edit-event") return `#/editar-evento/${current?.id}`;
  if (page === "checkout") return `#/checkout/${current?.id}`;
  if (page === "static") return `#/info/${encodeURIComponent(title ?? "")}`;
  if (page === "category") return `#/categoria/${title ?? ""}`;
  return HASH[page] ?? "#/";
}
/** Navega cambiando la URL (así funciona el botón "atrás" y los enlaces compartidos) */
function go(page: Page, title?: string) {
  const h = hashFor(page, title);
  if (location.hash === h || (h === "#/" && !location.hash)) render(page, title); else location.hash = h;
}
function route() {
  const [a = "", b = ""] = location.hash.replace(/^#\/?/, "").split("/");
  const u = getCurrentUser();
  const ev = state.all.find(e => String(e.id) === b) ?? null;
  switch (a) {
    case "login": return u ? void location.replace("#/") : render("login");
    case "registro": return u ? void location.replace("#/") : render("register");
    case "categoria": return catBySlug(b) ? render("category", b) : go("home");
    case "como-funciona": return render("how");
    case "info": return render("static", decodeURIComponent(b));
    case "perfil": return u ? render("profile") : go("login");
    case "crear-evento": return u ? render("create-event") : go("login");
    case "panel": return u && u.role !== "cliente" ? render("dashboard") : go("home");
    case "editar-evento": current = ev; return u && ev ? render("edit-event") : go(u ? "home" : "login");
    case "evento": current = ev; return ev ? render("event") : go("home");
    case "checkout": current = ev; return !ev ? go("home") : u ? render("checkout") : go("login");
    default: return render("home");
  }
}

function renderHome() {
  state.all = getEvents();   // por si cambió algo (por ejemplo, una calificación nueva)
  app.innerHTML = `${navbar()}<main>${hero()}${eventsSection()}</main>${footer()}`;
  paintChips(); paintGrid(); startHero();
}

/** "2026-10-05" → fecha local (evita el desfase de zona horaria de new Date("2026-10-05")) */
const localDate = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

/** Lleva a la primera sección de eventos visible (destacados, o resultados si hay filtros) */
const scrollToEvents = () => {
  const feat = $("#destacados");
  (feat && !feat.hidden ? feat : $("#eventos"))?.scrollIntoView({ behavior: "smooth" });
};

/** Aplica buscador, ciudad, fecha y categoría a la vez */
function filterEvents() {
  const q = state.q.trim().toLowerCase();
  const now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return state.all.filter(e => {
    const d = localDate(e.date);
    let okDate = true;
    if (state.date === "Esta semana") okDate = d >= t0 && d <= new Date(t0.getTime() + 7 * 86400000);
    else if (state.date === "Este mes") okDate = d.getMonth() === t0.getMonth() && d.getFullYear() === t0.getFullYear();
    else if (state.date === DATES[3]) okDate = (!state.start || d >= localDate(state.start)) && (!state.end || d <= localDate(state.end));
    const okQ = !q || [e.title, e.city, e.venue ?? "", e.category].some(t => t.toLowerCase().includes(q));
    return okQ && (state.city === ALL || e.city === state.city) && okDate && (!state.category || e.category === state.category);
  });
}

function applyFilters() {
  state.visible = PAGE_SIZE;
  state.filtered = filterEvents();
  paintChips(); paintGrid();
  scrollToEvents();
}

/* ── Eventos de usuario (delegación) ── */
document.addEventListener("click", ev => {
  const t = ev.target as HTMLElement;
  const fav = t.closest<HTMLElement>(".evlist [data-fav]");
  if (fav) {
    const u = getCurrentUser();
    if (!u) return go("login");
    const id = Number(fav.dataset.fav), favs = u.favorites ?? [];
    updateUser({ favorites: favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id] });
    return repaint();
  }
  const del = t.closest<HTMLElement>(".evlist [data-del]");
  if (del) {
    if (confirm("¿Estás seguro de eliminar este evento?")) {
      deleteEvent(Number(del.dataset.del))
        .then(() => { state.all = state.filtered = getEvents(); repaint(); })
        .catch(err => alert("No se pudo eliminar: " + (err as Error).message));
    }
    return;
  }
  const tset = t.closest<HTMLElement>("[data-theme-set]");
  if (tset) {
    setTheme(tset.dataset.themeSet as Theme, true);
    document.querySelectorAll<HTMLElement>("[data-theme-set]").forEach(b => { const on = b === tset; b.classList.toggle("is-on", on); b.setAttribute("aria-checked", String(on)); });
    return closeThemeMenu();
  }
  const ttog = t.closest<HTMLElement>("[data-theme-toggle]");
  if (ttog) {
    const menu = ttog.parentElement!.querySelector<HTMLElement>(".theme__menu")!;
    const open = menu.hidden; closeThemeMenu(); menu.hidden = !open; ttog.setAttribute("aria-expanded", String(open));
    return;
  }
  if (!t.closest(".theme")) closeThemeMenu();
  const hdir = t.closest<HTMLElement>("#hero [data-hero-dir]");
  if (hdir) { heroShow(heroIdx + Number(hdir.dataset.heroDir)); return heroPlay(); }
  const hdot = t.closest<HTMLElement>("#hero [data-hero-dot]");
  if (hdot) { heroShow(Number(hdot.dataset.heroDot)); return heroPlay(); }
  const hev = t.closest<HTMLElement>("#hero [data-hero-ev]");
  if (hev) { current = state.all.find(e => e.id === Number(hev.dataset.heroEv)) ?? null; return go("event"); }
  const cat = t.closest<HTMLElement>("#chips [data-cat]");
  if (cat) {
    const c = cat.dataset.cat!;
    state.category = state.category === c ? null : c;
    state.visible = PAGE_SIZE;
    state.filtered = filterEvents();
    paintChips(); return paintGrid();
  }
  const edit = t.closest<HTMLElement>(".evlist [data-editev]");
  if (edit) { current = state.all.find(e => e.id === Number(edit.dataset.editev)) ?? null; return go("edit-event"); }
  const card = t.closest<HTMLElement>(".evlist [data-event]");
  if (card) { current = state.all.find(e => e.id === Number(card.dataset.event)) ?? null; return go("event"); }
  if (t.closest("[data-scroll]")) { if ($("#eventos")) return scrollToEvents(); go("home"); return void setTimeout(scrollToEvents, 150); }
  const nav = t.closest<HTMLElement>("[data-go]");
  if (nav) { ev.preventDefault(); return go(nav.dataset.go as Page); }
  const foot = t.closest<HTMLElement>("[data-footer]")?.dataset.footer;
  if (foot) {
    const u = getCurrentUser();
    if (foot === "Buscar eventos") { go("home"); return void setTimeout(scrollToEvents, 60); }
    if (foot === "Mis boletas") return go(u ? "profile" : "login");
    if (foot === "Crear evento") {
      if (!u) return go("login");
      return u.role === "cliente" ? alert("Necesitas permisos de administrador o agente para crear un evento.") : go("create-event");
    }
    return go("static", foot);
  }
  if (t.closest("#btn-search")) return applyFilters();
  if (t.closest("#btn-more")) { state.visible += PAGE_SIZE; repaint(); }
});

document.addEventListener("input", ev => {
  const t = ev.target as HTMLInputElement;
  const map: Record<string, () => void> = {
    q: () => (state.q = t.value), city: () => (state.city = t.value), start: () => (state.start = t.value), end: () => (state.end = t.value),
    date: () => { state.date = t.value; $("#range")?.classList.toggle("is-open", t.value === DATES[3]); },
  };
  map[t.id]?.();
});

document.addEventListener("keydown", ev => {
  const t = ev.target as HTMLElement;
  if (t.id === "q" && ev.key === "Enter") applyFilters();
  if ((ev.key === "Enter" || ev.key === " ") && t.matches?.("[data-event]")) { ev.preventDefault(); t.click(); }
  if (ev.key === "Escape") closeThemeMenu();
});

/* ── Banner de cookies ── */
function cookieBanner() {
  if (localStorage.getItem("sixevent_cookies")) return;
  const box = $("#cookie")!;
  const cats = [["Esenciales", "Necesarias para el funcionamiento del sitio. No se pueden desactivar."], ["Analíticas", "Nos ayudan a entender cómo interactúas con la plataforma."], ["Marketing", "Permiten mostrar anuncios relevantes según tu actividad."]];
  box.innerHTML = `<div class="cookie"><div class="cookie__in"><div class="cookie__txt">
    <h3>Usamos cookies en SIX EVENT <span>GDPR</span></h3>
    <p>Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar contenido y publicidad. Al continuar navegando, aceptas nuestra <a href="#">Política de cookies</a> y nuestra <a href="#">Política de privacidad</a>.</p>
    <div class="cookie__cats" id="cookie-cats">${cats.map(([n, d]) => `<div><b>${n}</b>${d}</div>`).join("")}</div></div>
    <div class="cookie__act"><button class="btn btn--ghost" id="ck-cfg">Configurar</button>
    <button class="btn btn--navy" data-ck>✓ Aceptar todas</button><button class="btn btn--cream" data-ck>Aceptar selección</button></div></div></div>`;
  box.addEventListener("click", ev => {
    const t = ev.target as HTMLElement;
    if (t.id === "ck-cfg") { const o = $("#cookie-cats")!.classList.toggle("is-open"); t.textContent = o ? "Ocultar" : "Configurar"; }
    if (t.hasAttribute("data-ck")) { localStorage.setItem("sixevent_cookies", "1"); box.innerHTML = ""; }
  });
}

initTheme();
cookieBanner();
mountHelp();
initEvents()
  .then(() => {
    state.all = state.filtered = getEvents();
    window.addEventListener("hashchange", route);
    route();
  })
  .catch(err => {
    app.innerHTML = `<p style="padding:2rem">No se pudieron cargar los eventos: ${esc(String((err as Error).message))}</p>`;
  });
