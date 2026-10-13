import logo from "../assets/logo-new.png";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const svg = (d: string, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const ARROW = "M19 12H5M12 19l-7-7 7-7", CHECK = "M20 6L9 17l-5-5";
const backBtn = (t = "← Volver") => `<button class="lnk back2" data-back>${t}</button>`;

/* ───────── Cómo funciona ───────── */
const IC = { search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z", user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  ticket: "M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9zM12 3v18", card: "M1 4h22v16H1zM1 10h22", dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.84 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" };
const STEPS: [string, string, string, string[]][] = [
  [IC.search, "Explora los eventos", "Navega por nuestro catálogo de congresos, conferencias, simposios y galas. Filtra por ciudad, fecha o categoría para encontrar el evento que más te convenga.", ["Usa la barra de búsqueda para buscar por nombre o ponente", "Filtra por ciudad y fecha desde el panel principal", "Haz clic en cualquier tarjeta para ver el detalle completo"]],
  [IC.user, "Crea tu cuenta o inicia sesión", "Para reservar una entrada debes tener cuenta en SIX EVENT. El registro es gratuito y toma menos de 2 minutos. Solo necesitas tu documento de identidad y correo electrónico.", ["Puedes registrarte como cliente, agente o administrador", "Agentes requieren una clave de acceso especial", "Tu cuenta permite rastrear todas tus reservas"]],
  [IC.ticket, "Selecciona tus entradas", "Elige la categoría de entrada que mejor se adapte a tus necesidades (VIP Ejecutivo, General, Estudiante Afiliado). Indica la cantidad y revisa la disponibilidad en tiempo real.", ["Máximo 10 entradas por transacción", "Verifica la disponibilidad antes de pagar", "Acumulas puntos con cada compra"]],
  [IC.card, "Realiza el pago", "Acepta tarjetas Visa, Mastercard, débito y PSE. Todas las transacciones están cifradas con tecnología SSL. El cargo por servicio es del 4% sobre el subtotal.", ["Pago 100% seguro con certificación PCI-DSS", "Opción de pago con PSE para transferencia bancaria", "Factura electrónica enviada al correo registrado"]],
  [IC.dl, "Descarga tus boletas", "Recibirás las boletas en tu correo electrónico inmediatamente después del pago. También puedes descargarlas desde tu perfil en 'Mis Reservas' en cualquier momento.", ["Boleta en formato PDF con código QR único", "Válida solo con documento de identidad del titular", "Descarga disponible hasta 30 días después del evento"]],
  [IC.star, "Acumula y canjea puntos", "Por cada $1.000 COP en compras ganas 1 punto SIX EVENT. Canjéalos por cupones de descuento en futuras reservas. Tu nivel depende de los puntos acumulados en total, no del saldo disponible.", ["Niveles: Bronce, Plata, Oro, Platino, Diamante y Plus", "Cada nivel exige muchos más puntos que el anterior", "Canjea tus puntos por cupones de descuento del 10%, 25% o 50%"]],
];
const RULES: [string, string, string][] = [
  [IC.shield, "Identidad verificada", "Toda compra requiere documento de identidad válido. El ingreso al evento se verifica con documento original."],
  [IC.alert, "Una compra a la vez", "Para garantizar disponibilidad, el sistema reserva temporalmente las entradas durante el proceso de pago (15 minutos)."],
  [CHECK, "Confirmación inmediata", "Una vez aprobado el pago, recibirás la confirmación y tus boletas en menos de 2 minutos en tu correo."],
  [IC.phone, "Soporte antes del evento", "Nuestro equipo está disponible de lunes a sábado de 8 a.m. a 8 p.m. para resolver dudas sobre tu reserva."],
];
const FAQS: [string, string][] = [
  ["¿Puedo transferir mis entradas a otra persona?", "Las entradas son personales e intransferibles. Están vinculadas al documento de identidad registrado en la compra y se validarán con documento al ingreso."],
  ["¿Qué pasa si el evento se cancela?", "Si el organizador cancela el evento, recibirás el reembolso total en 5 a 10 días hábiles. SIX EVENT no cobra comisión por reembolsos por cancelación."],
  ["¿Cuánto tiempo antes del evento puedo solicitar un reembolso?", "Puedes solicitar reembolso hasta 48 horas antes del evento con deducción del 10% por gastos administrativos. Pasada esa fecha, no se procesarán reembolsos."],
  ["¿Cómo verifico la autenticidad de mi boleta?", "Cada boleta lleva un código QR único que se escanea en la puerta del evento. Nuestros organizadores disponen de lectores certificados que verifican la validez en tiempo real."],
  ["¿Puedo comprar entradas sin registrarme?", "No. Para proteger la seguridad de las transacciones y garantizar la identidad de los asistentes, es obligatorio tener cuenta en SIX EVENT para realizar compras."],
  ["¿Cómo me convierto en organizador?", "Si eres agente autorizado (código de acceso 007–010) o administrador, puedes crear y gestionar eventos desde el panel correspondiente."],
];

export function renderHowItWorks(root: HTMLElement, onBack: () => void) {
  root.innerHTML = `<div class="how"><header class="top"><div class="container top__in"><button class="tbtn" data-back>${svg(ARROW, 14)} Volver al inicio</button><img src="${logo}" alt="6ixEvent logo" height="36" style="mix-blend-mode:screen"></div></header>
  <section class="how__hero"><span class="eyebrow">Guía de uso</span><h1>¿Cómo funciona SIX EVENT?</h1><p>Todo lo que necesitas saber para encontrar, comprar y disfrutar eventos corporativos en Colombia con total seguridad.</p></section>
  <section class="container steps2">${STEPS.map(([ic, t, d, tips], i) => `<article class="step"><div class="step__n"><span>${svg(ic, 22)}</span><b>0${i + 1}</b></div><div><h3>${t}</h3><p>${d}</p><ul>${tips.map(x => `<li>${svg(CHECK, 12)}${x}</li>`).join("")}</ul></div></article>`).join("")}</section>
  <section class="how__rules"><div class="container"><h2>Normas de uso</h2><p class="sub">Reglas que garantizan una experiencia segura y justa para todos.</p><div class="rules">${RULES.map(([ic, t, d]) => `<div class="rule"><span>${svg(ic, 24)}</span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div></div></section>
  <section class="container faq"><h2>Preguntas frecuentes</h2><p class="sub">Todo lo que necesitas saber antes de tu primera compra.</p>${FAQS.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>
  <section class="how__cta"><h2>¿Listo para tu próximo evento?</h2><p>Explora el catálogo y reserva tus entradas con total confianza.</p><button class="btn btn--cream" data-back>Explorar eventos</button></section></div>`;
  root.onclick = e => { if ((e.target as HTMLElement).closest("[data-back]")) onBack(); };
  root.oninput = null; root.onsubmit = null;
}

/* ───────── Páginas estáticas ───────── */
type Doc = { h: string; p?: string[]; ul?: string[]; cta?: string };
const ABOUT: Doc = { h: "Nuestra Historia", p: ["SIX EVENT nace con la misión de revolucionar la gestión y asistencia a eventos corporativos en Colombia. Hemos transformado la forma en que los profesionales descubren oportunidades de networking, capacitación y negocios.", "Más de 4.200 eventos gestionados nos respaldan como la plataforma líder y más confiable para congresos, foros y ferias en todo el país."] };
const TERMS: Doc = { h: "Términos del Servicio", p: ["Al acceder y utilizar SIX EVENT, aceptas estar sujeto a los siguientes términos: la plataforma actúa como intermediario tecnológico para la venta de boletas. El organizador del evento es el único responsable de la ejecución del mismo.", "Nos reservamos el derecho de suspender cuentas por comportamientos fraudulentos o reventa no autorizada."] };
const DOCS: Record<string, Doc> = {
  "Precios": { h: "Nuestros Planes y Tarifas", p: ["Para organizadores de eventos, ofrecemos estructuras de precios escalables y transparentes. Para los asistentes, el precio final depende del evento, añadiendo un 4% de cargo por servicio sobre el valor de la boleta para garantizar transacciones seguras."],
    ul: ["<strong>Cuenta Cliente:</strong> Gratuita. Paga solo por las boletas que reservas.", "<strong>Cuenta Agente:</strong> Planes por comisión desde 3.5% por boleta vendida + $500 COP fijos.", "<strong>Cuenta Admin/Enterprise:</strong> Contacta a nuestro equipo para despliegues a gran escala."] },
  "Empresa": ABOUT, "Acerca de nosotros": ABOUT, "Legal": TERMS, "Términos y condiciones": TERMS,
  "Prensa": { h: "Sala de Prensa", p: ["Encuentra aquí nuestros últimos comunicados, kit de marca y menciones en medios.", "Para consultas de medios, entrevistas o solicitudes de assets corporativos, escríbenos directamente a <strong>prensa@sixevent.co</strong>."] },
  "Alianzas": { h: "Programa de Partners", p: ["Construimos relaciones sólidas con recintos, hoteles, gremios y agencias de producción. Ser un aliado de SIX EVENT significa potenciar tu alcance y brindar beneficios exclusivos a tus clientes."], cta: "Contactar equipo de Alianzas" },
  "Trabaja con nosotros": { h: "Únete al equipo", p: ["Buscamos talento apasionado por la tecnología y la experiencia del usuario. Somos un equipo ágil, innovador y orientado a resultados.", "Actualmente tenemos vacantes en: <strong>Ingeniería, Ventas Corporativas y Soporte B2B</strong>. Envía tu CV a <em>talento@sixevent.co</em>."] },
  "Política de privacidad": { h: "Protección de Datos (Ley 1581 de 2012)", p: ["En SIX EVENT garantizamos la confidencialidad, libertad y seguridad de tus datos personales. La información recolectada se usa exclusivamente para la gestión de reservas, validación de identidad y envío de notificaciones importantes sobre tus eventos.", "No comercializamos tu información con terceros no involucrados en la prestación del servicio."] },
  "Política de reembolsos": { h: "Devoluciones y Cancelaciones", p: ["Los reembolsos están sujetos a las políticas específicas de cada organizador. Por norma general:"],
    ul: ["Si un evento es cancelado, se reembolsará el 100% del valor de la boleta (excluyendo el fee de servicio tecnológico).", "Tienes derecho al retracto dentro de los primeros 5 días hábiles tras la compra, siempre que no falten menos de 48h para el evento."] },
  "Cookies": { h: "Uso de Cookies", p: ["Nuestra plataforma utiliza cookies técnicas estrictamente necesarias para mantener tu sesión activa y proteger tus reservas (como el token de carrito). También usamos cookies analíticas (anonimizadas) para entender cómo interactúas con la web y mejorar la experiencia.", "Puedes gestionar tus preferencias desde la configuración de tu navegador."] },
};

export function renderStatic(root: HTMLElement, title: string, onBack: () => void) {
  const d: Doc = DOCS[title] ?? { h: "Información no disponible", p: [`El contenido solicitado para "${esc(title)}" está siendo actualizado. Disculpa las molestias.`] };
  root.innerHTML = `<div class="page"><div class="wrap">${backBtn(`${svg(ARROW)} Volver`)}<h1>${esc(title)}</h1><div class="doc"><h3>${d.h}</h3>${(d.p ?? []).map(x => `<p>${x}</p>`).join("")}
    ${d.ul ? `<ul>${d.ul.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}${d.cta ? `<a class="btn btn--navy" href="mailto:contacto@sixevent.co">${d.cta}</a>` : ""}</div></div></div>`;
  root.onclick = e => { if ((e.target as HTMLElement).closest("[data-back]")) onBack(); };
  root.oninput = null; root.onsubmit = null;
}
