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

  // src/pages.ts
  var esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var svg = (d, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  var ARROW = "M19 12H5M12 19l-7-7 7-7";
  var CHECK = "M20 6L9 17l-5-5";
  var backBtn = (t = "\u2190 Volver") => `<button class="lnk back2" data-back>${t}</button>`;
  var IC = {
    search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    ticket: "M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9zM12 3v18",
    card: "M1 4h22v16H1zM1 10h22",
    dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.84 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
  };
  var STEPS = [
    [IC.search, "Explora los eventos", "Navega por nuestro cat\xE1logo de congresos, conferencias, simposios y galas. Filtra por ciudad, fecha o categor\xEDa para encontrar el evento que m\xE1s te convenga.", ["Usa la barra de b\xFAsqueda para buscar por nombre o ponente", "Filtra por ciudad y fecha desde el panel principal", "Haz clic en cualquier tarjeta para ver el detalle completo"]],
    [IC.user, "Crea tu cuenta o inicia sesi\xF3n", "Para reservar una entrada debes tener cuenta en SIX EVENT. El registro es gratuito y toma menos de 2 minutos. Solo necesitas tu documento de identidad y correo electr\xF3nico.", ["Puedes registrarte como cliente, agente o administrador", "Agentes requieren una clave de acceso especial", "Tu cuenta permite rastrear todas tus reservas"]],
    [IC.ticket, "Selecciona tus entradas", "Elige la categor\xEDa de entrada que mejor se adapte a tus necesidades (VIP Ejecutivo, General, Estudiante Afiliado). Indica la cantidad y revisa la disponibilidad en tiempo real.", ["M\xE1ximo 10 entradas por transacci\xF3n", "Verifica la disponibilidad antes de pagar", "Acumulas puntos con cada compra"]],
    [IC.card, "Realiza el pago", "Acepta tarjetas Visa, Mastercard, d\xE9bito y PSE. Todas las transacciones est\xE1n cifradas con tecnolog\xEDa SSL. El cargo por servicio es del 4% sobre el subtotal.", ["Pago 100% seguro con certificaci\xF3n PCI-DSS", "Opci\xF3n de pago con PSE para transferencia bancaria", "Factura electr\xF3nica enviada al correo registrado"]],
    [IC.dl, "Descarga tus boletas", "Recibir\xE1s las boletas en tu correo electr\xF3nico inmediatamente despu\xE9s del pago. Tambi\xE9n puedes descargarlas desde tu perfil en 'Mis Reservas' en cualquier momento.", ["Boleta en formato PDF con c\xF3digo QR \xFAnico", "V\xE1lida solo con documento de identidad del titular", "Descarga disponible hasta 30 d\xEDas despu\xE9s del evento"]],
    [IC.star, "Acumula y canjea puntos", "Por cada $1.000 COP en compras ganas 1 punto SIX EVENT. Canj\xE9alos por cupones de descuento en futuras reservas. Tu nivel depende de los puntos acumulados en total, no del saldo disponible.", ["Niveles: Bronce, Plata, Oro, Platino, Diamante y Plus", "Cada nivel exige muchos m\xE1s puntos que el anterior", "Canjea tus puntos por cupones de descuento del 10%, 25% o 50%"]]
  ];
  var RULES = [
    [IC.shield, "Identidad verificada", "Toda compra requiere documento de identidad v\xE1lido. El ingreso al evento se verifica con documento original."],
    [IC.alert, "Una compra a la vez", "Para garantizar disponibilidad, el sistema reserva temporalmente las entradas durante el proceso de pago (15 minutos)."],
    [CHECK, "Confirmaci\xF3n inmediata", "Una vez aprobado el pago, recibir\xE1s la confirmaci\xF3n y tus boletas en menos de 2 minutos en tu correo."],
    [IC.phone, "Soporte antes del evento", "Nuestro equipo est\xE1 disponible de lunes a s\xE1bado de 8 a.m. a 8 p.m. para resolver dudas sobre tu reserva."]
  ];
  var FAQS = [
    ["\xBFPuedo transferir mis entradas a otra persona?", "Las entradas son personales e intransferibles. Est\xE1n vinculadas al documento de identidad registrado en la compra y se validar\xE1n con documento al ingreso."],
    ["\xBFQu\xE9 pasa si el evento se cancela?", "Si el organizador cancela el evento, recibir\xE1s el reembolso total en 5 a 10 d\xEDas h\xE1biles. SIX EVENT no cobra comisi\xF3n por reembolsos por cancelaci\xF3n."],
    ["\xBFCu\xE1nto tiempo antes del evento puedo solicitar un reembolso?", "Puedes solicitar reembolso hasta 48 horas antes del evento con deducci\xF3n del 10% por gastos administrativos. Pasada esa fecha, no se procesar\xE1n reembolsos."],
    ["\xBFC\xF3mo verifico la autenticidad de mi boleta?", "Cada boleta lleva un c\xF3digo QR \xFAnico que se escanea en la puerta del evento. Nuestros organizadores disponen de lectores certificados que verifican la validez en tiempo real."],
    ["\xBFPuedo comprar entradas sin registrarme?", "No. Para proteger la seguridad de las transacciones y garantizar la identidad de los asistentes, es obligatorio tener cuenta en SIX EVENT para realizar compras."],
    ["\xBFC\xF3mo me convierto en organizador?", "Si eres agente autorizado (c\xF3digo de acceso 007\u2013010) o administrador, puedes crear y gestionar eventos desde el panel correspondiente."]
  ];
  function renderHowItWorks(root, onBack) {
    root.innerHTML = `<div class="how"><header class="top"><div class="container top__in"><button class="tbtn" data-back>${svg(ARROW, 14)} Volver al inicio</button><img src="${logo_new_default}" alt="6ixEvent logo" height="36" style="mix-blend-mode:screen"></div></header>
  <section class="how__hero"><span class="eyebrow">Gu\xEDa de uso</span><h1>\xBFC\xF3mo funciona SIX EVENT?</h1><p>Todo lo que necesitas saber para encontrar, comprar y disfrutar eventos corporativos en Colombia con total seguridad.</p></section>
  <section class="container steps2">${STEPS.map(([ic2, t, d, tips], i) => `<article class="step"><div class="step__n"><span>${svg(ic2, 22)}</span><b>0${i + 1}</b></div><div><h3>${t}</h3><p>${d}</p><ul>${tips.map((x) => `<li>${svg(CHECK, 12)}${x}</li>`).join("")}</ul></div></article>`).join("")}</section>
  <section class="how__rules"><div class="container"><h2>Normas de uso</h2><p class="sub">Reglas que garantizan una experiencia segura y justa para todos.</p><div class="rules">${RULES.map(([ic2, t, d]) => `<div class="rule"><span>${svg(ic2, 24)}</span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>
  <section class="container faq"><h2>Preguntas frecuentes</h2><p class="sub">Todo lo que necesitas saber antes de tu primera compra.</p>${FAQS.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>
  <section class="how__cta"><h2>\xBFListo para tu pr\xF3ximo evento?</h2><p>Explora el cat\xE1logo y reserva tus entradas con total confianza.</p><button class="btn btn--cream" data-back>Explorar eventos</button></section></div>`;
    root.onclick = (e) => {
      if (e.target.closest("[data-back]")) onBack();
    };
    root.oninput = null;
    root.onsubmit = null;
  }
  var ABOUT = { h: "Nuestra Historia", p: ["SIX EVENT nace con la misi\xF3n de revolucionar la gesti\xF3n y asistencia a eventos corporativos en Colombia. Hemos transformado la forma en que los profesionales descubren oportunidades de networking, capacitaci\xF3n y negocios.", "M\xE1s de 4.200 eventos gestionados nos respaldan como la plataforma l\xEDder y m\xE1s confiable para congresos, foros y ferias en todo el pa\xEDs."] };
  var TERMS = { h: "T\xE9rminos del Servicio", p: ["Al acceder y utilizar SIX EVENT, aceptas estar sujeto a los siguientes t\xE9rminos: la plataforma act\xFAa como intermediario tecnol\xF3gico para la venta de boletas. El organizador del evento es el \xFAnico responsable de la ejecuci\xF3n del mismo.", "Nos reservamos el derecho de suspender cuentas por comportamientos fraudulentos o reventa no autorizada."] };
  var DOCS = {
    "Precios": {
      h: "Nuestros Planes y Tarifas",
      p: ["Para organizadores de eventos, ofrecemos estructuras de precios escalables y transparentes. Para los asistentes, el precio final depende del evento, a\xF1adiendo un 4% de cargo por servicio sobre el valor de la boleta para garantizar transacciones seguras."],
      ul: ["<strong>Cuenta Cliente:</strong> Gratuita. Paga solo por las boletas que reservas.", "<strong>Cuenta Agente:</strong> Planes por comisi\xF3n desde 3.5% por boleta vendida + $500 COP fijos.", "<strong>Cuenta Admin/Enterprise:</strong> Contacta a nuestro equipo para despliegues a gran escala."]
    },
    "Empresa": ABOUT,
    "Acerca de nosotros": ABOUT,
    "Legal": TERMS,
    "T\xE9rminos y condiciones": TERMS,
    "Prensa": { h: "Sala de Prensa", p: ["Encuentra aqu\xED nuestros \xFAltimos comunicados, kit de marca y menciones en medios.", "Para consultas de medios, entrevistas o solicitudes de assets corporativos, escr\xEDbenos directamente a <strong>prensa@sixevent.co</strong>."] },
    "Alianzas": { h: "Programa de Partners", p: ["Construimos relaciones s\xF3lidas con recintos, hoteles, gremios y agencias de producci\xF3n. Ser un aliado de SIX EVENT significa potenciar tu alcance y brindar beneficios exclusivos a tus clientes."], cta: "Contactar equipo de Alianzas" },
    "Trabaja con nosotros": { h: "\xDAnete al equipo", p: ["Buscamos talento apasionado por la tecnolog\xEDa y la experiencia del usuario. Somos un equipo \xE1gil, innovador y orientado a resultados.", "Actualmente tenemos vacantes en: <strong>Ingenier\xEDa, Ventas Corporativas y Soporte B2B</strong>. Env\xEDa tu CV a <em>talento@sixevent.co</em>."] },
    "Pol\xEDtica de privacidad": { h: "Protecci\xF3n de Datos (Ley 1581 de 2012)", p: ["En SIX EVENT garantizamos la confidencialidad, libertad y seguridad de tus datos personales. La informaci\xF3n recolectada se usa exclusivamente para la gesti\xF3n de reservas, validaci\xF3n de identidad y env\xEDo de notificaciones importantes sobre tus eventos.", "No comercializamos tu informaci\xF3n con terceros no involucrados en la prestaci\xF3n del servicio."] },
    "Pol\xEDtica de reembolsos": {
      h: "Devoluciones y Cancelaciones",
      p: ["Los reembolsos est\xE1n sujetos a las pol\xEDticas espec\xEDficas de cada organizador. Por norma general:"],
      ul: ["Si un evento es cancelado, se reembolsar\xE1 el 100% del valor de la boleta (excluyendo el fee de servicio tecnol\xF3gico).", "Tienes derecho al retracto dentro de los primeros 5 d\xEDas h\xE1biles tras la compra, siempre que no falten menos de 48h para el evento."]
    },
    "Cookies": { h: "Uso de Cookies", p: ["Nuestra plataforma utiliza cookies t\xE9cnicas estrictamente necesarias para mantener tu sesi\xF3n activa y proteger tus reservas (como el token de carrito). Tambi\xE9n usamos cookies anal\xEDticas (anonimizadas) para entender c\xF3mo interact\xFAas con la web y mejorar la experiencia.", "Puedes gestionar tus preferencias desde la configuraci\xF3n de tu navegador."] }
  };
  function renderStatic(root, title, onBack) {
    const d = DOCS[title] ?? { h: "Informaci\xF3n no disponible", p: [`El contenido solicitado para "${esc(title)}" est\xE1 siendo actualizado. Disculpa las molestias.`] };
    root.innerHTML = `<div class="page"><div class="wrap">${backBtn(`${svg(ARROW)} Volver`)}<h1>${esc(title)}</h1><div class="doc"><h3>${d.h}</h3>${(d.p ?? []).map((x) => `<p>${x}</p>`).join("")}
    ${d.ul ? `<ul>${d.ul.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}${d.cta ? `<a class="btn btn--navy" href="mailto:contacto@sixevent.co">${d.cta}</a>` : ""}</div></div></div>`;
    root.onclick = (e) => {
      if (e.target.closest("[data-back]")) onBack();
    };
    root.oninput = null;
    root.onsubmit = null;
  }

  // src/main.ts
  var esc2 = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
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
    <a href="#" data-go="home"><img src="${logo_new_default}" alt="6ix Event logo" height="40"></a>
    <nav class="nav__links"><a class="hide-sm" href="#eventos">Eventos</a>
      <button class="link hide-sm" data-go="how">C\xF3mo funciona</button></nav></div></header>`;
  }
  var select = (id, ico, opts, val, cls = "") => `<div class="field ${cls}">${icon(ico)}<select id="${id}" aria-label="${id}">${opts.map((o) => `<option${o === val ? " selected" : ""}>${esc2(o)}</option>`).join("")}</select></div>`;
  function hero() {
    const stats = [["1.8M+", "Boletas vendidas"], ["4.200+", "Eventos gestionados"], ["620", "Organizadores activos"], ["38", "Ciudades en Colombia"]];
    return `<section><div class="hero__img">
    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&h=500&fit=crop&auto=format" alt="Auditorio corporativo">
    <div class="hero__shade"></div>
    <div class="hero__txt"><h1>Encuentra tu pr\xF3ximo evento</h1>
      <p>Congresos, conferencias y foros empresariales en toda Colombia. Boletas seguras en minutos.</p>
      <div class="stats">${stats.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div></div></div>
    <div class="container searchbox"><div class="search">
      <div class="field">${icon(ic.search)}<input id="q" type="text" placeholder="Nombre del evento o ponente\u2026" value="${esc2(state.q)}"></div>
      ${select("city", ic.location, cityList(), state.city, "sm")}
      <div class="field sm" style="flex:0 0 200px">${icon(ic.calendar)}<select id="date" aria-label="Fecha">${DATES.map((o) => `<option${o === state.date ? " selected" : ""}>${o}</option>`).join("")}</select>
        <div class="range${state.date === DATES[3] ? " is-open" : ""}" id="range"><input type="date" id="start" value="${state.start}"><input type="date" id="end" value="${state.end}"></div></div>
      <button class="btn btn--navy" id="btn-search">${icon(ic.search, 15)} Buscar eventos</button></div>
      <div class="chips" id="chips"></div></div></section>`;
  }
  function card(e) {
    return `<div class="card-wrap">
    <article class="card" tabindex="0" role="button" data-event="${e.id}" aria-label="Ver detalles de ${esc2(e.title)}">
      <div class="card__img"><img src="${esc2(e.img)}" alt="${esc2(e.title)}" loading="lazy"><span class="badge">${esc2(e.category)}</span>
        <div class="card__tr"><span class="rating">${icon(ic.star, 12)}${e.rating}</span></div></div>
      <div class="card__body"><h3>${esc2(e.title)}</h3>
        <p class="meta">${icon(ic.location, 14)}${esc2(placeLabel(e))}</p><p class="meta">${icon(ic.calendar, 14)}${formatDateString(e.date)}</p><hr>
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
  function render(page, title) {
    window.scrollTo({ top: 0 });
    if (page === "home") return renderHome();
    if (page === "how" || page === "static") {
      app.innerHTML = `<main id="pg-root" style="flex:1"></main>${footer()}`;
      const root = $("#pg-root");
      if (page === "how") return renderHowItWorks(root, () => go("home"));
      return renderStatic(root, title ?? "", () => go("home"));
    }
  }
  var HASH = { home: "#/", how: "#/como-funciona" };
  function hashFor(page, title) {
    if (page === "static") return `#/info/${encodeURIComponent(title ?? "")}`;
    return HASH[page] ?? "#/";
  }
  function go(page, title) {
    const h = hashFor(page, title);
    if (location.hash === h || h === "#/" && !location.hash) render(page, title);
    else location.hash = h;
  }
  function route() {
    const [a = "", b = ""] = location.hash.replace(/^#\/?/, "").split("/");
    switch (a) {
      case "como-funciona":
        return render("how");
      case "info":
        return render("static", decodeURIComponent(b));
      default:
        return render("home");
    }
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
    const nav = t.closest("[data-go]");
    if (nav) {
      ev.preventDefault();
      return go(nav.dataset.go);
    }
    const foot = t.closest("[data-footer]")?.dataset.footer;
    if (foot) {
      if (foot === "Buscar eventos") {
        go("home");
        return void setTimeout(() => $("#eventos")?.scrollIntoView({ behavior: "smooth" }), 60);
      }
      return go("static", foot);
    }
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
  window.addEventListener("hashchange", route);
  route();
  cookieBanner();
})();
