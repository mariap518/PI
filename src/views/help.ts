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
  expand: "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7",
  shrink: "M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7",
};

/* ───────────────────────── Chat: respuestas del asistente ─────────────────────────
 *  Por ahora responde con la descripción de la página y las ventajas de ser agente.
 *  Para agregar diálogos nuevos basta con añadir un elemento a DIALOGOS (más abajo). */
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
import { MANUAL } from "../services/manual-data";

/* ───────────────────────── Interfaz ───────────────────────── */
let root: HTMLElement;
let busy = false;
let greeted = false;
let aiEnabled = false;                    // el servidor tiene la clave de IA configurada
let aiPausedUntil = 0;                    // si se agota el cupo, se usan las respuestas de siempre un rato
const history: { role: "user" | "bot"; text: string }[] = [];   // conversación que se envía a la IA

/** Convierte la respuesta de la IA (texto con **negritas** y listas "- ") en HTML seguro */
function mdLite(text: string): string {
  const inline = (t: string) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const out: string[] = []; let list = false;
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim().replace(/^#{1,6}\s+/, "");
    const li = /^[-*•]\s+(.*)$/.exec(line);
    if (li) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${inline(li[1])}</li>`); continue; }
    if (list) { out.push("</ul>"); list = false; }
    if (line) out.push(`<p>${inline(line)}</p>`);
  }
  if (list) out.push("</ul>");
  return out.join("");
}
const toPlain = (html: string) => html.replace(/<li>/g, "\n- ").replace(/<\/(p|li)>/g, "\n").replace(/<[^>]+>/g, "").trim();
const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;

const bubbleBot = (r: Respuesta) =>
  `<div class="msg msg--bot"><img class="msg__av" src="${robot}" alt=""><div class="msg__b">${r.html}${r.acciones?.length ? `<div class="msg__acts">${r.acciones.map((a, i) => `<button type="button" class="msg__act" data-act="${i}">${esc(a.label)}</button>`).join("")}</div>` : ""}</div></div>`;

let actionsStore: Accion[][] = [];

function addBot(r: Respuesta, ai = false) {
  const box = q("#help-msgs");
  const wrap = document.createElement("div");
  actionsStore.push(r.acciones ?? []);
  wrap.innerHTML = bubbleBot(r).replace(/data-act="(\d+)"/g, `data-act="$1" data-set="${actionsStore.length - 1}"`);
  if (ai) wrap.querySelector(".msg__b")?.insertAdjacentHTML("beforeend", `<small class="msg__note">Respuesta generada con IA; puede equivocarse.</small>`);
  box.append(...Array.from(wrap.children));
  history.push({ role: "bot", text: toPlain(r.html) });
  scrollDown();
}
function addUser(text: string) {
  history.push({ role: "user", text });
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

/** Pregunta a la IA (servidor → Gemini). Devuelve null si hay que usar las respuestas de siempre. */
async function askAI(): Promise<string | null> {
  if (!aiEnabled || Date.now() < aiPausedUntil) return null;
  try {
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-8) }), signal: AbortSignal.timeout(25000) });
    if (!res.ok) return null;
    const data = await res.json() as { reply?: string; fallback?: boolean; reason?: string };
    if (data.fallback && (data.reason === "cupo" || data.reason === "limite")) aiPausedUntil = Date.now() + 10 * 60_000;
    return data.reply?.trim() || null;
  } catch { return null; }
}

/** `local`: respuesta inmediata sin IA (sugerencias y botones); si no, la escribe la IA y, si falla, el respaldo local. */
async function ask(text: string, local = false) {
  text = text.trim().slice(0, 300);
  if (!text || busy) return;
  busy = true;
  addUser(text);
  const typing = document.createElement("div");
  typing.className = "msg msg--bot";
  typing.innerHTML = `<img class="msg__av" src="${robot}" alt=""><div class="msg__b typing" aria-label="El asistente está escribiendo"><i></i><i></i><i></i></div>`;
  q("#help-msgs").append(typing); scrollDown();
  const delay = new Promise(r => window.setTimeout(r, 700 + Math.min(text.length * 8, 500)));
  const ai = local ? null : await askAI();
  await delay;
  typing.remove();
  if (ai) addBot({ html: mdLite(ai) }, true); else addBot(answer(text));
  busy = false;
  while (q("#help-msgs").children.length > 80) q("#help-msgs").firstElementChild!.remove();
}

function runAction(a: Accion) {
  if (a.hash) { closePanel(); location.hash = a.hash; }
  else if (a.fn) a.fn();
  else ask(a.label, true);
}

/* Manual */
function renderManual() {
  q("#help-man-nav").innerHTML = MANUAL.map((s, i) => `<button type="button" data-man-go="${i}">${esc(s.titulo)}</button>`).join("");
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
    q("#help-man-nav").children[Array.from(sec.parentElement!.children).indexOf(sec)]?.toggleAttribute("hidden", !any);
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

/** Ventana pequeña (por defecto) o cajón grande. Se recuerda durante la sesión una vez que la persona lo elige. */
let big = sessionStorage.getItem("sixevent_help_big") === "1";
function applySize() {
  const open = root.classList.contains("is-open");
  root.classList.toggle("is-big", big);
  q("#help-backdrop").hidden = !(open && big);                        // el fondo atenuado solo va con el cajón grande
  document.documentElement.classList.toggle("help-open", open && big); // y solo entonces se bloquea el scroll de la página
  const b = q("#help-size");
  b.innerHTML = ico(big ? I.shrink : I.expand, 18);
  b.setAttribute("aria-label", big ? "Reducir la ventana de ayuda" : "Agrandar la ventana de ayuda");
  b.setAttribute("aria-pressed", String(big));
  b.title = big ? "Reducir" : "Agrandar";
}
function toggleSize() {
  big = !big;
  sessionStorage.setItem("sixevent_help_big", big ? "1" : "0");
  applySize();
  scrollDown();
}

function openPanel() {
  const panel = q("#help-panel");
  if (!panel.hidden) return;
  panel.hidden = false;
  root.classList.add("is-open");
  applySize();
  q("#help-fab").setAttribute("aria-expanded", "true");
  q("#help-bubble").hidden = true;
  sessionStorage.setItem("sixevent_help_greeted", "1");
}
function closePanel() {
  q("#help-panel").hidden = true;
  root.classList.remove("is-open");
  applySize();
  q("#help-fab").setAttribute("aria-expanded", "false");
}

export function mountHelp() {
  if (document.getElementById("help")) return;
  root = document.createElement("div");
  root.id = "help"; root.className = "help";
  root.innerHTML = `
    <div class="help__bubble" id="help-bubble" role="status" hidden><button type="button" class="help__bubble-x" data-bx aria-label="Cerrar saludo">${ico(I.close, 12)}</button>¡Hola! ¿Cómo podemos ayudarte?</div>
    <div class="help__backdrop" id="help-backdrop" hidden></div>
    <section class="help__panel" id="help-panel" role="dialog" aria-label="Centro de ayuda de SIX EVENT" hidden>
      <header class="help__head"><img src="${robot}" alt="" class="help__av"><div><b>Asistente SIX EVENT</b><small><i class="dot"></i> En línea</small></div>
        <div class="help__btns"><button type="button" class="help__x" id="help-size" data-size aria-pressed="false"></button>
        <button type="button" class="help__x" data-close aria-label="Cerrar ayuda">${ico(I.close, 20)}</button></div></header>
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
          <nav class="man__nav" id="help-man-nav" aria-label="Secciones del manual"></nav>
          <div class="man__main">
          <div class="man__search">${ico(I.search, 16)}<input id="help-search" type="search" placeholder="Buscar en el manual…" aria-label="Buscar en el manual"></div>
          <div class="man__scroll"><div id="help-manual-list"></div>
            <p class="man__empty" id="help-manual-empty" hidden>No encontramos ese tema. <button type="button" class="msg__act" data-tab-go="chat">Pregúntale al asistente</button></p>
            <div class="man__foot"><a class="msg__act" href="#/como-funciona">Guía «Cómo funciona»</a><a class="msg__act" href="#/info/${encodeURIComponent("Política de privacidad")}">Privacidad</a><a class="msg__act" href="#/info/${encodeURIComponent("Términos y condiciones")}">Términos</a></div></div>
          </div>
        </div>
      </div>
    </section>
    <button type="button" class="help__fab" id="help-fab" aria-label="Abrir ayuda" aria-expanded="false" aria-controls="help-panel"><img src="${robot}" alt=""></button>`;
  document.body.append(root);

  renderManual(); renderChips(); applySize();
  addBot({ html: `<p>¡Hola! Soy el asistente de <b>SIX EVENT</b>. 👋 ¿En qué te puedo ayudar?</p><p id="help-greet-p">Por ahora puedo contarte qué es la página y qué ventajas tiene ser agente. También tienes el manual de usuario en la otra pestaña.</p>` });

  // ¿El servidor tiene la IA configurada? Si sí, el texto libre lo responde la IA.
  fetch("/api/chat/status").then(r => r.json()).then((j: { enabled?: boolean }) => {
    aiEnabled = Boolean(j.enabled);
    if (aiEnabled) {
      const p = root.querySelector("#help-greet-p");
      if (p) p.innerHTML = "Pregúntame lo que quieras sobre la plataforma: comprar boletas, puntos, reembolsos o cómo ser agente. También tienes el manual de usuario en la otra pestaña.";
      q<HTMLInputElement>("#help-input").placeholder = "Escribe tu pregunta (responde una IA)…";
      q("#help-form").insertAdjacentHTML("afterend", `<p class="help__hint">Responde una IA. No escribas datos personales ni contraseñas.</p>`);
    }
  }).catch(() => {});

  root.addEventListener("click", e => {
    const t = e.target as HTMLElement;
    if (t.closest("#help-fab")) return root.classList.contains("is-open") ? closePanel() : showTab("chat");
    if (t.closest("[data-size]")) return toggleSize();
    if (t.closest("[data-close]") || t.closest("#help-backdrop")) { closePanel(); q("#help-fab").focus(); return; }
    const go = t.closest<HTMLElement>("[data-man-go]");
    if (go) { const sec = q("#help-manual-list").children[Number(go.dataset.manGo)] as HTMLElement | undefined; sec?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
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
