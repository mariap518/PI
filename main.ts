import "./styles.css";
import logo from "./assets/logo-new.png";
import { getEvents, deleteEvent, formatDateString, placeLabel, type EventItem } from "./db";
import { getCurrentUser, updateUser } from "./auth";
import { renderLogin } from "./login";
import { renderEventDetail, renderCheckout } from "./screens";
import { renderProfile } from "./profile";
import { renderDashboard } from "./dashboard";
import { renderCreateEvent, renderEditEvent, renderHowItWorks, renderStatic } from "./pages";

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
const TAGS = ["Conferencias", "Congresos", "Exposiciones", "Galas", "Foros"];
const PAGE_SIZE = 6;

const state = {
  all: getEvents(), filtered: getEvents(), visible: PAGE_SIZE,
  category: null as string | null,
  q: "", city: ALL, date: DATES[0], start: "", end: "",
};

/* ── Vistas ── */
function navbar() {
  const u = getCurrentUser();
  const right = u
    ? `<button class="user-chip" data-go="profile"><span class="avatar">${esc(u.name.charAt(0).toUpperCase())}</span><span class="hide-sm">${esc(u.name.split(" ")[0])}</span></button>`
    : `<button class="link" data-go="login">Entrar</button><button class="btn btn--cream" data-go="register">Registro</button>`;
  return `<header class="nav"><div class="container nav__in">
    <a href="#" data-go="home"><img src="${logo}" alt="6ix Event logo" height="40"></a>
    <nav class="nav__links"><a class="hide-sm" href="#eventos">Eventos</a>
      <button class="link hide-sm" data-go="how">Cómo funciona</button>${u && u.role !== "cliente" ? `<button class="link" data-go="dashboard">Panel</button>` : ""}${right}</nav></div></header>`;
}

const select = (id: string, ico: string, opts: string[], val: string, cls = "") =>
  `<div class="field ${cls}">${icon(ico)}<select id="${id}" aria-label="${id}">${opts
    .map(o => `<option${o === val ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;

function hero() {
  const stats = [["1.8M+", "Boletas vendidas"], ["4.200+", "Eventos gestionados"], ["620", "Organizadores activos"], ["38", "Ciudades en Colombia"]];
  return `<section><div class="hero__img">
    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=500&fit=crop&auto=format" alt="Auditorio corporativo">
    <div class="hero__shade"></div>
    <div class="hero__txt"><h1>Encuentra tu próximo evento</h1>
      <p>Congresos, conferencias y foros empresariales en toda Colombia. Boletas seguras en minutos.</p>
      <div class="stats">${stats.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div></div></div>
    <div class="container searchbox"><div class="search">
      <div class="field">${icon(ic.search)}<input id="q" type="text" placeholder="Nombre del evento o ponente…" value="${esc(state.q)}"></div>
      ${select("city", ic.location, cityList(), state.city, "sm")}
      <div class="field sm" style="flex:0 0 200px">${icon(ic.calendar)}<select id="date" aria-label="Fecha">${DATES.map(o => `<option${o === state.date ? " selected" : ""}>${o}</option>`).join("")}</select>
        <div class="range${state.date === DATES[3] ? " is-open" : ""}" id="range"><input type="date" id="start" value="${state.start}"><input type="date" id="end" value="${state.end}"></div></div>
      <button class="btn btn--navy" id="btn-search">${icon(ic.search, 15)} Buscar eventos</button></div>
      <div class="chips" id="chips"></div></div></section>`;
}

function card(e: EventItem) {
  const u = getCurrentUser();
  const fav = !!u?.favorites?.includes(e.id);
  const canDel = u?.role === "admin" || (u?.role === "agente" && e.createdBy === u.id);
  return `<div class="card-wrap">
    ${canDel ? `<button class="card__edit" data-editev="${e.id}" title="Editar evento" aria-label="Editar evento">✎</button><button class="card__del" data-del="${e.id}" title="Eliminar evento" aria-label="Eliminar evento">✕</button>` : ""}
    <article class="card" tabindex="0" role="button" data-event="${e.id}" aria-label="Ver detalles de ${esc(e.title)}">
      <div class="card__img"><img src="${esc(e.img)}" alt="${esc(e.title)}" loading="lazy"><span class="badge">${esc(e.category)}</span>
        <div class="card__tr"><button class="fav${fav ? " is-on" : ""}" data-fav="${e.id}" aria-pressed="${fav}" aria-label="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}">${icon(ic.heart, 16, fav ? "currentColor" : "none")}</button>
        <span class="rating">${icon(ic.star, 12)}${e.rating}</span></div></div>
      <div class="card__body"><h3>${esc(e.title)}</h3>
        <p class="meta">${icon(ic.location, 14)}${esc(placeLabel(e))}</p><p class="meta">${icon(ic.calendar, 14)}${formatDateString(e.date)}</p><hr>
        <div class="price"><small>Precio desde</small><strong>${cop(e.price)}</strong></div></div></article></div>`;
}

function eventsSection() {
  return `<section id="eventos"><div class="container"><div class="eyebrow">Próximas fechas</div><h2>Eventos destacados</h2>
    <div id="grid-root"></div><div class="more" id="more"></div></div></section>`;
}

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
  $("#chips")!.innerHTML = `<span>Categorías Populares:</span>` + TAGS.map(t => {
    const on = state.category === t.slice(0, -1);
    return `<button class="chip${on ? " is-on" : ""}" data-cat="${t.slice(0, -1)}">${t}</button>`;
  }).join("");
}

function paintGrid() {
  const list = state.filtered.slice(0, state.visible);
  $("#grid-root")!.innerHTML = state.filtered.length
    ? `<div class="grid">${list.map(card).join("")}</div>`
    : `<div class="empty">No se encontraron eventos con los filtros seleccionados.</div>`;
  const u = getCurrentUser();
  const canCreate = u?.role === "admin" || u?.role === "agente";
  $("#more")!.innerHTML =
    (state.visible < state.filtered.length ? `<button class="btn btn--ghost" id="btn-more">Ver más eventos</button>` : "") +
    (canCreate ? `<button class="btn btn--cream" data-go="create-event">Crear nuevo evento</button>` : "");
}

/* ── Navegación ── */
type Page = "dashboard" | "edit-event" | "home" | "login" | "register" | "how" | "profile" | "event" | "checkout" | "create-event" | "static";

function render(page: Page, title?: string) {
  window.scrollTo({ top: 0 });
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
    app.innerHTML = `<main id="scr" style="flex:1;background:linear-gradient(135deg,#1E3A5F,#3B6EA5)"></main>${footer()}`;
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
    case "login": return render("login");
    case "registro": return render("register");
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
  app.innerHTML = `${navbar()}<main>${hero()}${eventsSection()}</main>${footer()}`;
  paintChips(); paintGrid();
}

function applyFilters() {
  const q = state.q.trim().toLowerCase();
  const today = new Date();
  state.category = null; state.visible = PAGE_SIZE;
  state.filtered = state.all.filter(e => {
    const d = new Date(e.date);
    let okDate = true;
    if (state.date === "Esta semana") okDate = d >= today && d.getTime() <= today.getTime() + 7 * 86400000;
    else if (state.date === "Este mes") okDate = d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    else if (state.date === DATES[3] && state.start && state.end) okDate = d >= new Date(state.start) && d <= new Date(state.end);
    return (!q || e.title.toLowerCase().includes(q)) && (state.city === ALL || e.city === state.city) && okDate;
  });
  paintChips(); paintGrid();
  $("#eventos")?.scrollIntoView({ behavior: "smooth" });
}

/* ── Eventos de usuario (delegación) ── */
document.addEventListener("click", ev => {
  const t = ev.target as HTMLElement;
  const fav = t.closest<HTMLElement>("#grid-root [data-fav]");
  if (fav) {
    const u = getCurrentUser();
    if (!u) return go("login");
    const id = Number(fav.dataset.fav), favs = u.favorites ?? [];
    updateUser({ favorites: favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id] });
    return paintGrid();
  }
  const del = t.closest<HTMLElement>("#grid-root [data-del]");
  if (del) {
    if (confirm("¿Estás seguro de eliminar este evento?")) {
      deleteEvent(Number(del.dataset.del));
      state.all = state.filtered = getEvents();
      paintGrid();
    }
    return;
  }
  const cat = t.closest<HTMLElement>("#chips [data-cat]");
  if (cat) {
    const c = cat.dataset.cat!;
    state.category = state.category === c ? null : c;
    state.visible = PAGE_SIZE;
    state.filtered = state.category ? state.all.filter(e => e.category.startsWith(state.category!)) : state.all;
    paintChips(); return paintGrid();
  }
  const edit = t.closest<HTMLElement>("#grid-root [data-editev]");
  if (edit) { current = state.all.find(e => e.id === Number(edit.dataset.editev)) ?? null; return go("edit-event"); }
  const card = t.closest<HTMLElement>("#grid-root [data-event]");
  if (card) { current = state.all.find(e => e.id === Number(card.dataset.event)) ?? null; return go("event"); }
  const nav = t.closest<HTMLElement>("[data-go]");
  if (nav) { ev.preventDefault(); return go(nav.dataset.go as Page); }
  const foot = t.closest<HTMLElement>("[data-footer]")?.dataset.footer;
  if (foot) {
    const u = getCurrentUser();
    if (foot === "Buscar eventos") { go("home"); return void setTimeout(() => $("#eventos")?.scrollIntoView({ behavior: "smooth" }), 60); }
    if (foot === "Mis boletas") return go(u ? "profile" : "login");
    if (foot === "Crear evento") {
      if (!u) return go("login");
      return u.role === "cliente" ? alert("Necesitas permisos de administrador o agente para crear un evento.") : go("create-event");
    }
    return go("static", foot);
  }
  if (t.closest("#btn-search")) return applyFilters();
  if (t.closest("#btn-more")) { state.visible += PAGE_SIZE; paintGrid(); }
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
  if (t.matches?.("[data-event]") && t === ev.currentTarget || (t.matches?.("[data-event]") && (ev.key === "Enter" || ev.key === " "))) {
    if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); t.click(); }
  }
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

window.addEventListener("hashchange", route);
route();
cookieBanner();
