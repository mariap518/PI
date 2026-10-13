"use strict";
(() => {
  // src/assets/logo-new.png
  var logo_new_default = "./assets/logo-new.png";

  // src/db.ts
  function loadEvents() {
    try {
      const data = localStorage.getItem("sixevent_events");
      if (data) return JSON.parse(data).map(normalize);
    } catch (e) {
    }
    return initialEvents.map(normalize);
  }
  var DESC = {
    "1": "Encuentro regional que re\xFAne a CEOs, inversionistas y l\xEDderes de m\xE1s de 15 pa\xEDses para discutir expansi\xF3n de mercados, alianzas estrat\xE9gicas y el futuro de la econom\xEDa latinoamericana. Incluye ruedas de negocios y cena de networking.",
    "2": "Dos jornadas de paneles y demostraciones sobre inteligencia artificial, computaci\xF3n en la nube y transformaci\xF3n digital, con startups invitadas y espacio para conectar con aceleradoras y fondos de capital de riesgo.",
    "3": "Especialistas en tesorer\xEDa, fusiones y gesti\xF3n de riesgos presentan casos reales de empresas colombianas. Las sesiones t\xE9cnicas abordan valoraci\xF3n, financiaci\xF3n y cumplimiento normativo para directores financieros.",
    "4": "Magistrados, abogados y acad\xE9micos analizan las reformas m\xE1s recientes en derecho societario, contrataci\xF3n y arbitraje comercial, con sesiones de preguntas y casos pr\xE1cticos.",
    "5": "Feria con m\xE1s de cien expositores de maquinaria, materiales y software de ingenier\xEDa. Habr\xE1 demostraciones en vivo, charlas sobre obra sostenible y encuentros con constructoras y proveedores.",
    "6": "Noche de reconocimiento a las empresas con mayor impacto social y ambiental del a\xF1o. Incluye cena de gala, presentaci\xF3n de los proyectos ganadores y una subasta ben\xE9fica.",
    "7": "Seminario pr\xE1ctico para profesionales que quieren aplicar IA en sus equipos: modelos de lenguaje, automatizaci\xF3n de procesos, \xE9tica y gobernanza de datos, con talleres guiados.",
    "8": "Estudiantes y j\xF3venes emprendedores muestran sus proyectos ante mentores e inversionistas. Hay pitches de tres minutos, stands de incubadoras y premios para las mejores ideas.",
    "9": "Taller intensivo de un d\xEDa sobre comunicaci\xF3n, toma de decisiones y gesti\xF3n de equipos de alto desempe\xF1o, con ejercicios en grupos peque\xF1os y retroalimentaci\xF3n personalizada.",
    "10": "Expertos en posicionamiento, anal\xEDtica y publicidad en redes comparten estrategias para crecer en entornos digitales. Incluye talleres de contenido, comercio electr\xF3nico y marca personal.",
    "11": "Espacio para mujeres directivas y emprendedoras: conversatorios sobre liderazgo, equidad salarial y acceso a financiaci\xF3n, con mentor\xEDas abiertas y una red de contactos.",
    "12": "Empresas, gobierno y organizaciones debaten metas de descarbonizaci\xF3n, econom\xEDa circular y reportes ESG, con casos de \xE9xito y mesas de trabajo sobre financiaci\xF3n verde.",
    "13": "Desarrolladores y empresarios exploran contratos inteligentes, tokenizaci\xF3n y finanzas descentralizadas, con demostraciones t\xE9cnicas y un panel sobre regulaci\xF3n en Am\xE9rica Latina.",
    "14": "Muestra de obras de artistas colombianos y latinoamericanos en distintos formatos, con visitas guiadas, charlas con los creadores y un espacio dedicado a coleccionistas.",
    "15": "Ceremonia que premia a los proyectos, empresas y talentos m\xE1s innovadores del a\xF1o en software, hardware y emprendimiento, con c\xF3ctel, presentaciones y m\xFAsica en vivo.",
    "16": "Psic\xF3logos y l\xEDderes de talento humano presentan estrategias para prevenir el agotamiento, mejorar el clima laboral y construir programas de bienestar que funcionen."
  };
  function normalize(e) {
    let r = e;
    if (!r.description) r = { ...r, description: DESC[r.id] ?? `${r.title} es un evento de ${r.category.toLowerCase()} que se realizar\xE1 en ${r.city}. Re\xFAne a profesionales y organizaciones del sector para compartir experiencias, conocimiento y oportunidades de negocio.` };
    return r;
  }
  function placeLabel(e, full = false) {
    return [e.city, e.department, full ? e.country : ""].filter(Boolean).join(", ");
  }
  var mockCategories = (price, cap) => [
    { name: "VIP Ejecutivo", price: Math.round(price * 2.03), capacity: Math.round(cap * 0.1), available: Math.round(cap * 0.1) },
    { name: "General", price, capacity: Math.round(cap * 0.6), available: Math.round(cap * 0.6) },
    { name: "Estudiante Afiliado", price: Math.round(price * 0.28), capacity: Math.round(cap * 0.3), available: Math.round(cap * 0.3) }
  ];
  var initialEvents = [
    { id: 1, title: "Cumbre Empresarial Latinoam\xE9rica 2026", category: "Conferencia", city: "Medell\xEDn", date: "2026-10-15", price: 32e4, img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", startTime: "09:00", endTime: "18:30", venue: "Centro de Convenciones Medell\xEDn", capacity: 500, availableTickets: 48, agenda: "09:00 - Registro\n10:00 - Conferencia inaugural", ticketCategories: mockCategories(32e4, 500) },
    { id: 2, title: "Foro Internacional de Innovaci\xF3n y Tecnolog\xEDa", category: "Foro", city: "Bogot\xE1", date: "2026-10-22", price: 18e4, img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", startTime: "08:30", endTime: "17:00", venue: "Hotel Tequendama", capacity: 300, availableTickets: 120, agenda: "08:30 - Registro\n09:30 - Panel", ticketCategories: mockCategories(18e4, 300) },
    { id: 3, title: "Congreso Nacional de Finanzas Corporativas", category: "Congreso", city: "Cali", date: "2026-11-03", price: 25e4, img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", startTime: "10:00", endTime: "18:00", venue: "Palacio de Exposiciones", capacity: 200, availableTickets: 30, agenda: "10:00 - Inicio\n12:00 - Almuerzo", ticketCategories: mockCategories(25e4, 200) },
    { id: 4, title: "Simposio de Derecho Corporativo 2026", category: "Simposio", city: "Bogot\xE1", date: "2026-11-10", price: 9e4, img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=380&fit=crop&auto=format", rating: 4.6, createdBy: "system", startTime: "09:00", endTime: "16:00", venue: "U. de los Andes", capacity: 400, availableTickets: 200, agenda: "09:00 - Apertura\n15:00 - Cierre", ticketCategories: mockCategories(9e4, 400) },
    { id: 5, title: "Expo Construcci\xF3n e Infraestructura 2026", category: "Exposici\xF3n", city: "Bogot\xE1", date: "2026-11-18", price: 6e4, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=380&fit=crop&auto=format", rating: 4.5, createdBy: "system", startTime: "08:00", endTime: "19:00", venue: "Corferias", capacity: 2e3, availableTickets: 800, agenda: "08:00 - Apertura stands", ticketCategories: mockCategories(6e4, 2e3) },
    { id: 6, title: "Gala Anual de Responsabilidad Social Empresarial", category: "Gala", city: "Bogot\xE1", date: "2026-11-25", price: 45e4, img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", startTime: "19:00", endTime: "23:30", venue: "Club El Nogal", capacity: 150, availableTickets: 15, agenda: "19:00 - C\xF3ctel\n20:30 - Premiaci\xF3n", ticketCategories: mockCategories(45e4, 150) },
    { id: 7, title: "Seminario de Inteligencia Artificial", category: "Seminario", city: "Medell\xEDn", date: "2026-12-05", price: 12e4, img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", capacity: 500, availableTickets: 500, startTime: "09:00", endTime: "17:00", venue: "Ruta N", agenda: "09:00 - Registro", ticketCategories: mockCategories(12e4, 500) },
    { id: 8, title: "Feria de Emprendimiento Universitario", category: "Feria", city: "Cali", date: "2026-12-12", price: 45e3, img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=380&fit=crop&auto=format", rating: 4.4, createdBy: "system", capacity: 1e3, availableTickets: 1e3, startTime: "10:00", endTime: "18:00", venue: "Centro de Eventos Valle del Pac\xEDfico", agenda: "10:00 - Apertura", ticketCategories: mockCategories(45e3, 1e3) },
    { id: 9, title: "Taller de Liderazgo Ejecutivo", category: "Taller", city: "Bogot\xE1", date: "2026-12-15", price: 21e4, img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 100, availableTickets: 100, startTime: "08:00", endTime: "12:00", venue: "Hotel W", agenda: "08:00 - Desayuno", ticketCategories: mockCategories(21e4, 100) },
    { id: 10, title: "Congreso de Marketing Digital", category: "Congreso", city: "Barranquilla", date: "2027-01-20", price: 15e4, img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", capacity: 300, availableTickets: 300, startTime: "09:00", endTime: "18:00", venue: "Puerta de Oro", agenda: "09:00 - Registro", ticketCategories: mockCategories(15e4, 300) },
    { id: 11, title: "Encuentro de Mujeres L\xEDderes", category: "Encuentro", city: "Cartagena", date: "2027-02-10", price: 13e4, img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 250, availableTickets: 250, startTime: "14:00", endTime: "20:00", venue: "Centro de Convenciones", agenda: "14:00 - Registro", ticketCategories: mockCategories(13e4, 250) },
    { id: 12, title: "Foro de Sostenibilidad Ambiental", category: "Foro", city: "Bogot\xE1", date: "2027-02-18", price: 8e4, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=380&fit=crop&auto=format", rating: 4.6, createdBy: "system", capacity: 400, availableTickets: 400, startTime: "08:00", endTime: "14:00", venue: "Auditorio Principal", agenda: "08:00 - Registro", ticketCategories: mockCategories(8e4, 400) },
    { id: 13, title: "Conferencia de Blockchain y Web3", category: "Conferencia", city: "Medell\xEDn", date: "2027-03-05", price: 195e3, img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", capacity: 350, availableTickets: 350, startTime: "09:00", endTime: "18:00", venue: "Plaza Mayor", agenda: "09:00 - Registro", ticketCategories: mockCategories(195e3, 350) },
    { id: 14, title: "Exposici\xF3n de Arte Contempor\xE1neo", category: "Exposici\xF3n", city: "Bogot\xE1", date: "2027-03-15", price: 35e3, img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&h=380&fit=crop&auto=format", rating: 4.5, createdBy: "system", capacity: 1500, availableTickets: 1500, startTime: "10:00", endTime: "20:00", venue: "Museo de Arte Moderno", agenda: "10:00 - Apertura", ticketCategories: mockCategories(35e3, 1500) },
    { id: 15, title: "Gala de Premios Tecnol\xF3gicos", category: "Gala", city: "Cali", date: "2027-03-25", price: 3e5, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 200, availableTickets: 200, startTime: "19:00", endTime: "00:00", venue: "Centro de Eventos Valle del Pac\xEDfico", agenda: "19:00 - Alfombra roja", ticketCategories: mockCategories(3e5, 200) },
    { id: 16, title: "Simposio de Salud Mental en el Trabajo", category: "Simposio", city: "Medell\xEDn", date: "2027-04-10", price: 75e3, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", capacity: 300, availableTickets: 300, startTime: "08:00", endTime: "16:00", venue: "Auditorio Ruta N", agenda: "08:00 - Registro", ticketCategories: mockCategories(75e3, 300) }
  ];
  var eventsDB = loadEvents();
  function getEvents() {
    return [...eventsDB];
  }
  function formatDateString(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  // src/main.ts
  var esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var cop = (n) => "$ " + n.toLocaleString("es-CO");
  var $ = (sel) => document.querySelector(sel);
  var app = $("#app");
  var ic = {
    search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.84 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
    youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.18 1 12 1 12s0 3.82.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.82 23 12 23 12s0-3.82-.46-5.58zM9.5 15.5v-7l6.5 3.5-6.5 3.5z",
    twitter: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"
  };
  var icon = (d, size = 16, fill = "none") => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  var ALL = "Todas las ciudades";
  var cityList = () => [ALL, ...Array.from(new Set(state.all.map((e) => e.city))).sort((a, b) => a.localeCompare(b, "es"))];
  var DATES = ["Cualquier fecha", "Esta semana", "Este mes", "Personalizado..."];
  var TAGS = ["Conferencias", "Congresos", "Exposiciones", "Galas", "Foros"];
  var PAGE_SIZE = 6;
  var state = {
    all: getEvents(),
    filtered: getEvents(),
    visible: PAGE_SIZE,
    category: null,
    q: "",
    city: ALL,
    date: DATES[0],
    start: "",
    end: ""
  };
  function navbar() {
    return `<header class="nav"><div class="container nav__in">
    <a href="#"><img src="${logo_new_default}" alt="6ix Event logo" height="40"></a>
    <nav class="nav__links"><a class="hide-sm" href="#eventos">Eventos</a></nav></div></header>`;
  }
  var select = (id, ico, opts, val, cls = "") => `<div class="field ${cls}">${icon(ico)}<select id="${id}" aria-label="${id}">${opts.map((o) => `<option${o === val ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;
  function hero() {
    const stats = [["1.8M+", "Boletas vendidas"], ["4.200+", "Eventos gestionados"], ["620", "Organizadores activos"], ["38", "Ciudades en Colombia"]];
    return `<section><div class="hero__img">
    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=500&fit=crop&auto=format" alt="Auditorio corporativo">
    <div class="hero__shade"></div>
    <div class="hero__txt"><h1>Encuentra tu pr\xF3ximo evento</h1>
      <p>Congresos, conferencias y foros empresariales en toda Colombia. Boletas seguras en minutos.</p>
      <div class="stats">${stats.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div></div></div>
    <div class="container searchbox"><div class="search">
      <div class="field">${icon(ic.search)}<input id="q" type="text" placeholder="Nombre del evento o ponente\u2026" value="${esc(state.q)}"></div>
      ${select("city", ic.location, cityList(), state.city, "sm")}
      <div class="field sm" style="flex:0 0 200px">${icon(ic.calendar)}<select id="date" aria-label="Fecha">${DATES.map((o) => `<option${o === state.date ? " selected" : ""}>${o}</option>`).join("")}</select>
        <div class="range${state.date === DATES[3] ? " is-open" : ""}" id="range"><input type="date" id="start" value="${state.start}"><input type="date" id="end" value="${state.end}"></div></div>
      <button class="btn btn--navy" id="btn-search">${icon(ic.search, 15)} Buscar eventos</button></div>
      <div class="chips" id="chips"></div></div></section>`;
  }
  function card(e) {
    return `<div class="card-wrap">
    <article class="card" tabindex="0" role="button" data-event="${e.id}" aria-label="Ver detalles de ${esc(e.title)}">
      <div class="card__img"><img src="${esc(e.img)}" alt="${esc(e.title)}" loading="lazy"><span class="badge">${esc(e.category)}</span>
        <div class="card__tr"><span class="rating">${icon(ic.star, 12)}${e.rating}</span></div></div>
      <div class="card__body"><h3>${esc(e.title)}</h3>
        <p class="meta">${icon(ic.location, 14)}${esc(placeLabel(e))}</p><p class="meta">${icon(ic.calendar, 14)}${formatDateString(e.date)}</p><hr>
        <div class="price"><small>Precio desde</small><strong>${cop(e.price)}</strong></div></div></article></div>`;
  }
  function eventsSection() {
    return `<section id="eventos"><div class="container"><div class="eyebrow">Pr\xF3ximas fechas</div><h2>Eventos destacados</h2>
    <div id="grid-root"></div><div class="more" id="more"></div></div></section>`;
  }
  function footer() {
    const cols = [
      ["Plataforma", ["Buscar eventos", "Mis boletas", "Crear evento", "Precios"]],
      ["Empresa", ["Acerca de nosotros", "Prensa", "Alianzas", "Trabaja con nosotros"]],
      ["Legal", ["T\xE9rminos y condiciones", "Pol\xEDtica de privacidad", "Pol\xEDtica de reembolsos", "Cookies"]]
    ];
    const social = [["YouTube", ic.youtube, "https://www.youtube.com/@orslokXX"], ["Twitter/X", ic.twitter, "https://x.com/orslok"], ["Instagram", ic.instagram, "https://www.instagram.com/orslokx/"]];
    return `<footer class="footer"><div class="container footer__in"><div class="footer__cols">
    <div><img src="${logo_new_default}" alt="6ixEvent logo" height="40" style="mix-blend-mode:screen">
      <p>Plataforma l\xEDder de venta de boletas y gesti\xF3n de eventos corporativos en Colombia.</p>
      <a href="tel:+5716074400">${icon(ic.phone, 14)} +57 601 744 0000</a><a href="mailto:contacto@sixevent.co">${icon(ic.mail, 14)} contacto@sixevent.co</a></div>
    ${cols.map(([t, ls]) => `<div><h4>${t}</h4><ul>${ls.map((l) => `<li><button data-footer="${l}">${l}</button></li>`).join("")}</ul></div>`).join("")}</div>
    <div class="footer__bar"><span>\xA9 2026 SIX EVENT S.A.S. \xB7 NIT 900.123.456-7 \xB7 Bogot\xE1, Colombia</span>
      <div class="footer__right">${social.map(([l, d, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${l}">${icon(d, 15)}</a>`).join("")}
      ${["Visa", "Mastercard", "PSE", "Nequi"].map((p) => `<span class="pay">${p}</span>`).join("")}</div></div></div></footer>`;
  }
  function paintChips() {
    $("#chips").innerHTML = `<span>Categor\xEDas Populares:</span>` + TAGS.map((t) => {
      const on = state.category === t.slice(0, -1);
      return `<button class="chip${on ? " is-on" : ""}" data-cat="${t.slice(0, -1)}">${t}</button>`;
    }).join("");
  }
  function paintGrid() {
    const list = state.filtered.slice(0, state.visible);
    $("#grid-root").innerHTML = state.filtered.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty">No se encontraron eventos con los filtros seleccionados.</div>`;
    $("#more").innerHTML = state.visible < state.filtered.length ? `<button class="btn btn--ghost" id="btn-more">Ver m\xE1s eventos</button>` : "";
  }
  function renderHome() {
    app.innerHTML = `${navbar()}<main>${hero()}${eventsSection()}</main>${footer()}`;
    paintChips();
    paintGrid();
  }
  function applyFilters() {
    const q = state.q.trim().toLowerCase();
    const today = /* @__PURE__ */ new Date();
    state.category = null;
    state.visible = PAGE_SIZE;
    state.filtered = state.all.filter((e) => {
      const d = new Date(e.date);
      let okDate = true;
      if (state.date === "Esta semana") okDate = d >= today && d.getTime() <= today.getTime() + 7 * 864e5;
      else if (state.date === "Este mes") okDate = d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      else if (state.date === DATES[3] && state.start && state.end) okDate = d >= new Date(state.start) && d <= new Date(state.end);
      return (!q || e.title.toLowerCase().includes(q)) && (state.city === ALL || e.city === state.city) && okDate;
    });
    paintChips();
    paintGrid();
    $("#eventos")?.scrollIntoView({ behavior: "smooth" });
  }
  document.addEventListener("click", (ev) => {
    const t = ev.target;
    const cat = t.closest("#chips [data-cat]");
    if (cat) {
      const c = cat.dataset.cat;
      state.category = state.category === c ? null : c;
      state.visible = PAGE_SIZE;
      state.filtered = state.category ? state.all.filter((e) => e.category.startsWith(state.category)) : state.all;
      paintChips();
      return paintGrid();
    }
    const foot = t.closest("[data-footer]")?.dataset.footer;
    if (foot === "Buscar eventos") return void $("#eventos")?.scrollIntoView({ behavior: "smooth" });
    if (t.closest("#btn-search")) return applyFilters();
    if (t.closest("#btn-more")) {
      state.visible += PAGE_SIZE;
      paintGrid();
    }
  });
  document.addEventListener("input", (ev) => {
    const t = ev.target;
    const map = {
      q: () => state.q = t.value,
      city: () => state.city = t.value,
      start: () => state.start = t.value,
      end: () => state.end = t.value,
      date: () => {
        state.date = t.value;
        $("#range")?.classList.toggle("is-open", t.value === DATES[3]);
      }
    };
    map[t.id]?.();
  });
  document.addEventListener("keydown", (ev) => {
    const t = ev.target;
    if (t.id === "q" && ev.key === "Enter") applyFilters();
    if (t.matches?.("[data-event]") && t === ev.currentTarget || t.matches?.("[data-event]") && (ev.key === "Enter" || ev.key === " ")) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        t.click();
      }
    }
  });
  function cookieBanner() {
    if (localStorage.getItem("sixevent_cookies")) return;
    const box = $("#cookie");
    const cats = [["Esenciales", "Necesarias para el funcionamiento del sitio. No se pueden desactivar."], ["Anal\xEDticas", "Nos ayudan a entender c\xF3mo interact\xFAas con la plataforma."], ["Marketing", "Permiten mostrar anuncios relevantes seg\xFAn tu actividad."]];
    box.innerHTML = `<div class="cookie"><div class="cookie__in"><div class="cookie__txt">
    <h3>Usamos cookies en SIX EVENT <span>GDPR</span></h3>
    <p>Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tr\xE1fico y personalizar contenido y publicidad. Al continuar navegando, aceptas nuestra <a href="#">Pol\xEDtica de cookies</a> y nuestra <a href="#">Pol\xEDtica de privacidad</a>.</p>
    <div class="cookie__cats" id="cookie-cats">${cats.map(([n, d]) => `<div><b>${n}</b>${d}</div>`).join("")}</div></div>
    <div class="cookie__act"><button class="btn btn--ghost" id="ck-cfg">Configurar</button>
    <button class="btn btn--navy" data-ck>\u2713 Aceptar todas</button><button class="btn btn--cream" data-ck>Aceptar selecci\xF3n</button></div></div></div>`;
    box.addEventListener("click", (ev) => {
      const t = ev.target;
      if (t.id === "ck-cfg") {
        const o = $("#cookie-cats").classList.toggle("is-open");
        t.textContent = o ? "Ocultar" : "Configurar";
      }
      if (t.hasAttribute("data-ck")) {
        localStorage.setItem("sixevent_cookies", "1");
        box.innerHTML = "";
      }
    });
  }
  renderHome();
  cookieBanner();
})();
