/** Botón de ayuda flotante: chat con el asistente + manual de usuario. */
import "./help.css";
import robot from "../assets/robot-ayuda.png";

/* ───────────────────────── Utilidades ───────────────────────── */
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const ico = (d: string, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const I = {
  close: "M18 6L6 18M6 6l12 12",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
};

/* ───────────────────────── Chat: respuestas del asistente ───────────────────────── */

interface Accion { label: string; hash?: string; fn?: () => void }
interface Respuesta { html: string; acciones?: Accion[] }

const DESCRIPCION: Respuesta = {
  html: `<p><b>SIX EVENT</b> es una plataforma colombiana de venta de boletas para <b>eventos corporativos</b>: congresos, conferencias, foros, simposios, ferias, galas, conciertos y más.</p>
    <ul><li>Explora el catálogo y filtra por ciudad, fecha o categoría.</li>
    <li>Reserva tus entradas pagando con tarjeta o PSE.</li>
    <li>Descarga tus boletas con código QR desde tu perfil.</li>
    <li>Gana puntos en cada compra y cámbialos por cupones de descuento.</li></ul>
    <p>Pronto podré responder muchas más preguntas. 🙂</p>`,
};

const VENTAJAS_AGENTE: Respuesta = {
  html: `<p>Ser <b>agente</b> (organizador) en SIX EVENT te permite:</p>
    <ul><li><b>Publicar tus eventos:</b> define tipos de boleta con su precio y aforo, agenda, horarios, recinto e imagen.</li>
    <li><b>Editar o eliminar</b> tus eventos cuando lo necesites.</li>
    <li><b>Ver tus ventas</b> en un panel: ingresos estimados, boletas vendidas, ocupación y detalle por evento.</li>
    <li><b>Controlar el acceso:</b> cada boleta lleva un código QR único.</li>
    <li><b>Acceso seguro:</b> entras con un código propio de tu empresa.</li>
    <li><b>Tarifa por comisión:</b> desde 3,5 % por boleta vendida + $500 COP fijos.</li></ul>`,
  acciones: [{ label: "Registrarme como agente", hash: "#/registro" }, { label: "Cómo crear un evento", fn: () => showTab("manual", "crear-evento") }],
};

const MANUAL_PISTA: Respuesta = {
  html: `<p>En el <b>manual de usuario</b> tienes el paso a paso para comprar boletas, descargarlas, usar tus puntos y crear eventos. 📖 Pulsa <b>Ver el manual</b> aquí abajo.</p>`,
};

/** AQUÍ se agregan los diálogos: `claves` se compara con lo que escribe la persona (sin tildes ni mayúsculas). */
const DIALOGOS: { claves: RegExp; responder: Respuesta }[] = [
  { claves: /agente|organizador|organizar|vender|publicar|crear (un )?evento|comision|ventaja|beneficio/, responder: VENTAJAS_AGENTE },
  { claves: /manual|guia|ayuda|paso a paso|como (compro|reservo|funciona)/, responder: MANUAL_PISTA },
];
const POR_DEFECTO: Respuesta = DESCRIPCION;

const answer = (text: string): Respuesta => {
  const t = norm(text);
  return DIALOGOS.find(d => d.claves.test(t))?.responder ?? POR_DEFECTO;
};

const SUGERENCIAS: Accion[] = [{ label: "¿Qué es SIX EVENT?" }, { label: "Ventajas de ser agente" }, { label: "Ver el manual", fn: () => showTab("manual") }];

/* ───────────────────────── Manual de usuario ───────────────────────── */
interface Tema { id: string; q: string; html: string }
interface Seccion { titulo: string; temas: Tema[] }
const L = (hash: string, label: string) => `<a href="${hash}">${label}</a>`;

const MANUAL: Seccion[] = [
  { titulo: "Primeros pasos", temas: [
    { id: "que-es", q: "¿Qué es SIX EVENT?", html: `<p>Es una plataforma de venta de boletas para eventos corporativos en Colombia: congresos, conferencias, foros, simposios, ferias, galas y más. Aquí encuentras el evento, reservas tus entradas, pagas en línea y descargas tus boletas con código QR.</p><p>${L("#/como-funciona", "Ver la guía «Cómo funciona»")}</p>` },
    { id: "cuenta", q: "Crear mi cuenta", html: `<ol><li>Pulsa <b>Registro</b> (arriba a la derecha).</li><li>Elige el tipo de cuenta: <b>Cliente</b> (usuario, correo, celular, ciudad y contraseña) o <b>Agente</b> (nombre, correo, empresa, cédula, celular, ciudad y contraseña).</li><li>Pulsa el botón para crear la cuenta. Es gratis.</li></ol><p>Para comprar boletas necesitas haber iniciado sesión.</p>` },
    { id: "sesion", q: "Iniciar y cerrar sesión", html: `<p>Pulsa <b>Entrar</b> e ingresa tu correo o usuario y tu contraseña. Si eres <b>agente</b> o administrador, la página te pedirá además tu <b>código de acceso</b>.</p><p>Para salir, abre tu perfil (tu nombre, arriba a la derecha) y pulsa <b>Cerrar sesión</b>.</p>` },
    { id: "modos", q: "Cambiar el modo de color", html: `<p>Con el botón de la <b>luna</b> (arriba a la derecha) eliges entre modo <b>claro</b>, <b>oscuro</b> y <b>exótico</b>. La página recuerda tu elección.</p>` },
  ] },
  { titulo: "Encontrar eventos", temas: [
    { id: "buscar", q: "Buscar y filtrar eventos", html: `<p>En el inicio usa la barra de búsqueda para escribir el nombre del evento y elige la <b>ciudad</b> o la <b>fecha</b> (esta semana, este mes o un rango). Debajo hay chips de <b>categorías</b> para filtrar con un clic. Todos los filtros se combinan.</p>` },
    { id: "destacados", q: "Eventos destacados y próximos", html: `<p>El carrusel de arriba y la sección <b>Eventos destacados</b> muestran la selección especial. En <b>Próximos eventos</b> aparece el resto, ordenado por fecha; usa <b>Ver más eventos</b> para cargar más.</p>` },
    { id: "categorias", q: "Categorías", html: `<p>Al final del inicio está la sección <b>Categorías</b>: cada recuadro lleva a una página con todos los eventos de esa categoría (conferencias, congresos, foros, galas, conciertos, deportes y más).</p>` },
    { id: "favoritos", q: "Guardar favoritos", html: `<p>Toca el <b>corazón</b> de una tarjeta para guardar el evento. Necesitas haber iniciado sesión.</p>` },
    { id: "compartir", q: "Compartir un evento", html: `<p>Dentro del evento pulsa <b>Compartir</b>: se copia el enlace para que lo envíes a quien quieras.</p>` },
  ] },
  { titulo: "Comprar boletas", temas: [
    { id: "reservar", q: "Reservar paso a paso", html: `<ol><li>Abre el evento que te interesa.</li><li>Pulsa <b>Reservar entradas</b> (inicia sesión si te lo pide).</li><li>Elige el <b>tipo de entrada</b> y la <b>cantidad</b> (máximo 10 por transacción).</li><li>Si tienes un cupón, selecciónalo.</li><li>Elige el medio de pago y completa tus datos.</li><li>Confirma el pago y revisa el resumen.</li></ol>` },
    { id: "pago", q: "Medios de pago y cargos", html: `<p>Puedes pagar con <b>tarjeta de crédito o débito</b> o por <b>PSE / transferencia</b>. Sobre el subtotal se suma un <b>cargo por servicio del 4 %</b>, que ves en el resumen antes de pagar.</p>` },
    { id: "cupones", q: "Usar un cupón de descuento", html: `<p>Los cupones se consiguen canjeando puntos (ver <i>Puntos y cupones</i>). En el pago aparece el selector <b>Cupón de descuento</b>; solo puedes usar uno por compra.</p>` },
    { id: "tiempo", q: "Tiempo para completar el pago", html: `<p>Según las normas de uso de la plataforma, mientras pagas las entradas se reservan temporalmente (15 minutos) para que no se agoten. Si se acaba el tiempo, vuelve a elegir tus entradas.</p>` },
  ] },
  { titulo: "Mis boletas", temas: [
    { id: "mis-reservas", q: "Dónde veo mis reservas y boletas", html: `<p>Abre tu perfil y entra a <b>Mis Reservas</b>: allí está el historial con su estado. Al abrir una reserva ves tu boleta con el <b>código QR</b> y el botón <b>Descargar boleta</b>. También puedes <b>Exportar CSV</b> con el historial.</p>` },
    { id: "ingreso", q: "Entrar al evento", html: `<p>Presenta tu <b>código QR</b> junto con tu documento de identidad. Las entradas son personales e intransferibles: están ligadas al titular de la compra.</p>` },
    { id: "autentica", q: "¿Cómo sé que mi boleta es auténtica?", html: `<p>Cada boleta tiene un <b>código QR único</b> que se verifica en la puerta del evento.</p>` },
  ] },
  { titulo: "Puntos y cupones", temas: [
    { id: "ganar", q: "Cómo gano puntos", html: `<p>Ganas <b>1 punto por cada $1.000 COP</b> pagados en cada compra. Tu saldo y tu historial están en <b>Mis Puntos</b>, dentro de tu perfil.</p>` },
    { id: "niveles", q: "Niveles", html: `<p>Tu nivel depende de los puntos <b>acumulados</b> en total (canjear no te baja de nivel):</p><ul><li>Bronce: desde 0</li><li>Plata: 5.000</li><li>Oro: 25.000</li><li>Platino: 100.000</li><li>Diamante: 500.000</li><li>Plus: 2.000.000</li></ul>` },
    { id: "canjear", q: "Canjear puntos por cupones", html: `<p>En <b>Mis Puntos → Canjear puntos</b> eliges tu cupón:</p><ul><li>10 % de descuento: 200 puntos</li><li>25 % de descuento: 600 puntos</li><li>50 % de descuento: 1.500 puntos</li></ul>` },
  ] },
  { titulo: "Cancelaciones y reembolsos", temas: [
    { id: "cancelan", q: "Si cancelan el evento", html: `<p>Si el organizador cancela, recibes el reembolso del valor de tu boleta en un plazo de 5 a 10 días hábiles.</p>` },
    { id: "retracto", q: "Retracto y otros casos", html: `<p>Tienes derecho a retracto dentro de los 5 días hábiles siguientes a la compra, siempre que falten 48 horas o más para el evento. Cada organizador puede tener condiciones propias.</p><p>${L("#/info/" + encodeURIComponent("Política de reembolsos"), "Leer la política de reembolsos")}</p>` },
  ] },
  { titulo: "Para agentes (organizadores)", temas: [
    { id: "ser-agente", q: "Cómo ser agente", html: `<p>En el registro elige <b>Agente</b>, selecciona tu <b>empresa</b> e ingresa tu cédula. Cuando inicies sesión, la página te pedirá el <b>código de acceso</b> de tu empresa.</p>` },
    { id: "crear-evento", q: "Crear un evento", html: `<ol><li>En el inicio pulsa <b>Crear nuevo evento</b>.</li><li>Completa título, descripción, categoría, ubicación, fecha, horario, recinto y aforo.</li><li>Agrega tus <b>tipos de boleta</b> con su precio, la agenda y la imagen.</li><li>Pulsa <b>Crear Evento</b> <b>una sola vez</b> y espera a que termine de guardar.</li></ol>` },
    { id: "editar", q: "Editar o eliminar mis eventos", html: `<p>En las tarjetas de tus eventos aparecen los botones de <b>editar</b> (lápiz) y <b>eliminar</b> (X). Solo puedes modificar los eventos que creaste.</p>` },
    { id: "panel", q: "Panel de ventas", html: `<p>Entra a <b>Panel</b> (menú superior) para ver los <b>ingresos estimados</b>, las boletas vendidas, la ocupación, los ingresos por evento, por categoría y por ciudad, y una tabla con el detalle de cada evento de tu empresa.</p>` },
    { id: "tarifas", q: "Tarifas", html: `<p>La cuenta de agente funciona por comisión: desde <b>3,5 % por boleta vendida + $500 COP fijos</b>.</p><p>${L("#/info/Precios", "Ver precios y tarifas")}</p>` },
  ] },
  { titulo: "Contacto y soporte", temas: [
    { id: "contacto", q: "Hablar con nosotros", html: `<p>Nuestro equipo atiende de <b>lunes a sábado, de 8 a. m. a 8 p. m.</b></p><ul><li>Correo: <a href="mailto:contacto@sixevent.co">contacto@sixevent.co</a></li><li>Teléfono: +57 601 744 0000</li><li>O escríbenos aquí, en el chat.</li></ul>` },
  ] },
];

/* ───────────────────────── Interfaz ───────────────────────── */
let root: HTMLElement;
let busy = false;
let greeted = false;
const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;

const bubbleBot = (r: Respuesta) =>
  `<div class="msg msg--bot"><img class="msg__av" src="${robot}" alt=""><div class="msg__b">${r.html}${r.acciones?.length ? `<div class="msg__acts">${r.acciones.map((a, i) => `<button type="button" class="msg__act" data-act="${i}">${esc(a.label)}</button>`).join("")}</div>` : ""}</div></div>`;

let actionsStore: Accion[][] = [];

function addBot(r: Respuesta) {
  const box = q("#help-msgs");
  const wrap = document.createElement("div");
  actionsStore.push(r.acciones ?? []);
  wrap.innerHTML = bubbleBot(r).replace(/data-act="(\d+)"/g, `data-act="$1" data-set="${actionsStore.length - 1}"`);
  box.append(...Array.from(wrap.children));
  scrollDown();
}
function addUser(text: string) {
  const el = document.createElement("div");
  el.className = "msg msg--user";
  el.innerHTML = `<div class="msg__b">${esc(text)}</div>`;
  q("#help-msgs").append(el);
  scrollDown();
}
const scrollDown = () => { const m = q("#help-msgs"); m.scrollTop = m.scrollHeight; };

function renderChips() {
  q("#help-chips").innerHTML = SUGERENCIAS.map((a, i) => `<button type="button" class="chip2" data-chip="${i}">${esc(a.label)}</button>`).join("");
}

function ask(text: string) {
  text = text.trim().slice(0, 300);
  if (!text || busy) return;
  busy = true;
  addUser(text);
  const typing = document.createElement("div");
  typing.className = "msg msg--bot";
  typing.innerHTML = `<img class="msg__av" src="${robot}" alt=""><div class="msg__b typing" aria-label="El asistente está escribiendo"><i></i><i></i><i></i></div>`;
  q("#help-msgs").append(typing); scrollDown();
  window.setTimeout(() => {
    typing.remove();
    addBot(answer(text));
    busy = false;
  }, 700 + Math.min(text.length * 8, 500));
  while (q("#help-msgs").children.length > 80) q("#help-msgs").firstElementChild!.remove();
}

function runAction(a: Accion) {
  if (a.hash) { closePanel(); location.hash = a.hash; }
  else if (a.fn) a.fn();
  else ask(a.label);
}

/* Manual */
function renderManual() {
  q("#help-manual-list").innerHTML = MANUAL.map(s => `<section class="man__sec"><h3>${esc(s.titulo)}</h3>${s.temas.map(t =>
    `<details class="man__t" id="man-${t.id}" data-text="${esc(norm(t.q + " " + t.html.replace(/<[^>]+>/g, " ")))}"><summary>${esc(t.q)}</summary><div class="man__b">${t.html}</div></details>`).join("")}</section>`).join("");
}

function filterManual(term: string) {
  const t = norm(term.trim());
  let hits = 0;
  q("#help-manual-list").querySelectorAll<HTMLElement>(".man__sec").forEach(sec => {
    let any = 0;
    sec.querySelectorAll<HTMLDetailsElement>(".man__t").forEach(d => {
      const ok = !t || t.split(/\s+/).every(w => d.dataset.text!.includes(w));
      d.hidden = !ok;
      if (t) d.open = ok;
      if (ok) any++;
    });
    sec.hidden = !any; hits += any;
  });
  q("#help-manual-empty").hidden = hits > 0;
}

/* Pestañas y panel */
function showTab(tab: "chat" | "manual", topicId?: string) {
  openPanel();
  root.querySelectorAll<HTMLElement>("[data-tab]").forEach(b => { const on = b.dataset.tab === tab; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", String(on)); });
  q("#help-view-chat").hidden = tab !== "chat";
  q("#help-view-manual").hidden = tab !== "manual";
  if (tab === "manual" && topicId) {
    const s = q<HTMLInputElement>("#help-search"); s.value = ""; filterManual("");
    const d = root.querySelector<HTMLDetailsElement>(`#man-${topicId}`);
    if (d) { d.open = true; d.scrollIntoView({ block: "center" }); }
  } else if (tab === "chat" && matchMedia("(pointer: fine)").matches) q<HTMLInputElement>("#help-input").focus({ preventScroll: true }); // en celular no se abre el teclado solo
}

function openPanel() {
  const panel = q("#help-panel");
  if (!panel.hidden) return;
  panel.hidden = false;
  root.classList.add("is-open");
  q("#help-fab").setAttribute("aria-expanded", "true");
  q("#help-bubble").hidden = true;
  sessionStorage.setItem("sixevent_help_greeted", "1");
}
function closePanel() {
  q("#help-panel").hidden = true;
  root.classList.remove("is-open");
  q("#help-fab").setAttribute("aria-expanded", "false");
}

export function mountHelp() {
  if (document.getElementById("help")) return;
  root = document.createElement("div");
  root.id = "help"; root.className = "help";
  root.innerHTML = `
    <div class="help__bubble" id="help-bubble" role="status" hidden><button type="button" class="help__bubble-x" data-bx aria-label="Cerrar saludo">${ico(I.close, 12)}</button>¡Hola! ¿Cómo podemos ayudarte?</div>
    <section class="help__panel" id="help-panel" role="dialog" aria-label="Centro de ayuda de SIX EVENT" hidden>
      <header class="help__head"><img src="${robot}" alt="" class="help__av"><div><b>Asistente SIX EVENT</b><small><i class="dot"></i> En línea</small></div>
        <button type="button" class="help__x" data-close aria-label="Cerrar ayuda">${ico(I.close, 20)}</button></header>
      <div class="help__tabs" role="tablist">
        <button type="button" role="tab" class="is-on" aria-selected="true" data-tab="chat">${ico(I.chat, 16)} Chat</button>
        <button type="button" role="tab" aria-selected="false" data-tab="manual">${ico(I.book, 16)} Manual de usuario</button></div>
      <div class="help__body">
        <div class="help__view" id="help-view-chat">
          <div class="help__msgs" id="help-msgs" role="log" aria-live="polite"></div>
          <div class="help__chips" id="help-chips"></div>
          <form class="help__form" id="help-form" autocomplete="off"><input id="help-input" type="text" maxlength="300" placeholder="Escribe tu pregunta…" aria-label="Tu mensaje"><button type="submit" aria-label="Enviar mensaje">${ico(I.send, 18)}</button></form>
        </div>
        <div class="help__view" id="help-view-manual" hidden>
          <div class="man__search">${ico(I.search, 16)}<input id="help-search" type="search" placeholder="Buscar en el manual…" aria-label="Buscar en el manual"></div>
          <div class="man__scroll"><div id="help-manual-list"></div>
            <p class="man__empty" id="help-manual-empty" hidden>No encontramos ese tema. <button type="button" class="msg__act" data-tab-go="chat">Pregúntale al asistente</button></p>
            <div class="man__foot"><a class="msg__act" href="#/como-funciona">Guía «Cómo funciona»</a><a class="msg__act" href="#/info/${encodeURIComponent("Política de privacidad")}">Privacidad</a><a class="msg__act" href="#/info/${encodeURIComponent("Términos y condiciones")}">Términos</a></div></div>
        </div>
      </div>
    </section>
    <button type="button" class="help__fab" id="help-fab" aria-label="Abrir ayuda" aria-expanded="false" aria-controls="help-panel"><img src="${robot}" alt=""></button>`;
  document.body.append(root);

  renderManual(); renderChips();
  addBot({ html: `<p>¡Hola! Soy el asistente de <b>SIX EVENT</b>. 👋 ¿En qué te puedo ayudar?</p><p>Por ahora puedo contarte qué es la página y qué ventajas tiene ser agente. También tienes el manual de usuario en la otra pestaña.</p>` });

  root.addEventListener("click", e => {
    const t = e.target as HTMLElement;
    if (t.closest("#help-fab")) return root.classList.contains("is-open") ? closePanel() : showTab("chat");
    if (t.closest("[data-close]")) { closePanel(); q("#help-fab").focus(); return; }
    if (t.closest("[data-bx]")) { q("#help-bubble").hidden = true; sessionStorage.setItem("sixevent_help_greeted", "1"); return; }
    if (t.closest("#help-bubble")) return showTab("chat");
    const tab = t.closest<HTMLElement>("[data-tab]") ?? t.closest<HTMLElement>("[data-tab-go]");
    if (tab) return showTab((tab.dataset.tab ?? tab.dataset.tabGo) as "chat" | "manual");
    const chip = t.closest<HTMLElement>("[data-chip]");
    if (chip) return runAction(SUGERENCIAS[Number(chip.dataset.chip)]);
    const act = t.closest<HTMLElement>("[data-act]");
    if (act) { const a = actionsStore[Number(act.dataset.set)]?.[Number(act.dataset.act)]; if (a) runAction(a); return; }
    if (t.closest("a[href^='#/']")) closePanel(); // al ir a otra página se cierra el panel
  });
  q("#help-form").addEventListener("submit", e => { e.preventDefault(); const i = q<HTMLInputElement>("#help-input"); ask(i.value); i.value = ""; });
  q("#help-search").addEventListener("input", e => filterManual((e.target as HTMLInputElement).value));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && root.classList.contains("is-open")) { closePanel(); q("#help-fab").focus(); } });

  // Saludo flotante (una vez por sesión), como los botones de ayuda de otras páginas
  if (!sessionStorage.getItem("sixevent_help_greeted")) {
    window.setTimeout(() => {
      if (greeted || root.classList.contains("is-open")) return;
      greeted = true; q("#help-bubble").hidden = false;
      window.setTimeout(() => { q("#help-bubble").hidden = true; }, 12000);
    }, 3000);
  }
}
