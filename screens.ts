import logo from "./assets/logo-new.png";
import { getCurrentUser, updateUser } from "./auth";
import { consumeTickets, formatDateString, placeLabel, type EventItem } from "./db";

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const cop = (n: number) => "$ " + n.toLocaleString("es-CO");
const P = {
  arrow: "M19 12H5M12 19l-7-7 7-7", loc: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
  cal: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13", heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  check: "M20 6L9 17l-5-5", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", minus: "M5 12h14", plus: "M12 5v14M5 12h14",
};
const svg = (d: string, s = 14, fill = "none") => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const topbar = (left: string, right: string) => `<header class="top"><div class="container top__in">${left}<img src="${logo}" alt="6ixEvent logo" height="36" style="mix-blend-mode:screen">${right}</div></header>`;

/* ───────── Detalle de evento ───────── */
export function renderEventDetail(root: HTMLElement, e: EventItem, onBack: () => void, onCheckout: () => void, onLogin: () => void) {
  const venue = e.venue || "Por definir", t1 = e.startTime || "09:00", t2 = e.endTime || "18:00";
  const cap = e.capacity || 500, av = e.availableTickets ?? 500;
  const cats = e.ticketCategories || [{ name: "General", price: e.price, available: av }];
  const pct = cap > 0 ? Math.min(100, (av / cap) * 100) : 0;
  const agenda = (e.agenda || "09:00 - Inicio del evento").split("\n").filter(Boolean);
  const saved = () => !!getCurrentUser()?.favorites?.includes(e.id);
  let toast = false;

  function draw() {
    const rows: [string, string][] = [["Teatro / Auditorio", venue], ["Ciudad", `${placeLabel(e, true)}`], ["Hora de inicio", t1], ["Hora de fin", t2], ["Capacidad total", `${cap.toLocaleString()} personas`], ["Disponibilidad", `${av} entradas restantes`]];
    root.innerHTML = `<div class="toast${toast ? " is-on" : ""}">${svg(P.check)} Enlace copiado al portapapeles</div>
    ${topbar(`<button class="tbtn" id="d-back">${svg(P.arrow)} Volver</button>`,
      `<span class="tgrp"><button class="tbtn tbtn--o" id="d-share">${svg(toast ? P.check : P.share)} ${toast ? "Copiado" : "Compartir"}</button><button class="tbtn tbtn--o${saved() ? " is-on" : ""}" id="d-save">${svg(P.heart, 14, saved() ? "currentColor" : "none")} ${saved() ? "Guardado" : "Guardar"}</button></span>`)}
    <div class="dhero"><img src="${esc(e.img.replace("w=600&h=380", "w=1400&h=500"))}" alt="${esc(e.title)}"><div class="dhero__shade"></div><span class="badge badge--c">${esc(e.category)}</span></div>
    <div class="container dgrid"><div>
      <h1 class="dtitle">${esc(e.title)}</h1>
      <div class="dmeta">${[[P.loc, venue], [P.loc, `${placeLabel(e, true)}`], [P.cal, formatDateString(e.date)], [P.clock, `${t1} — ${t2}`]].map(([i, t]) => `<span>${svg(i, 15)}${esc(t)}</span>`).join("")}</div>
      <section class="dsec"><h2>Descripción del evento</h2>${(e.description || "").split("\n").map(p => `<p>${esc(p)}</p>`).join("")}</section>
      <section class="dsec"><h2>Recinto</h2><div class="vgrid">${rows.map(([l, v]) => `<div><small>${l}</small><b>${esc(v)}</b></div>`).join("")}</div></section>
      <section class="dsec"><h2>Agenda del día</h2><ol class="agenda">${agenda.map(l => { const [h, ...r] = l.split(" - "); return `<li><b>${esc(h)}</b><span>${esc(r.join(" - ") || h)}</span></li>`; }).join("")}</ol></section>
      <section class="dsec"><h2>Categorías de entrada</h2>${cats.map(c => `<div class="catrow"><span>${esc(c.name)}</span><span>${c.available !== undefined ? `${c.available} disp.` : ""}</span><b>${cop(c.price)}</b></div>`).join("")}</section>
    </div><aside class="dside"><small>Precio desde</small><div class="dprice">${cop(Math.min(...cats.map(c => c.price)))}</div>
      <div class="bar"><i style="width:${pct}%"></i></div><p class="dav">${av} de ${cap} entradas disponibles</p>
      <button class="btn btn--navy full" id="d-res"${av === 0 ? " disabled" : ""}>${av === 0 ? "Agotado" : "Reservar entradas"}</button>
      <p class="dnote">${svg(P.shield, 13)} Pago 100% seguro</p></aside></div>`;
  }

  root.onclick = ev => {
    const t = ev.target as HTMLElement;
    if (t.closest("#d-back")) return onBack();
    if (t.closest("#d-res")) return getCurrentUser() ? onCheckout() : onLogin();
    if (t.closest("#d-save")) {
      const u = getCurrentUser(); if (!u) return onLogin();
      const f = u.favorites ?? [];
      updateUser({ favorites: f.includes(e.id) ? f.filter(i => i !== e.id) : [...f, e.id] });
      return draw();
    }
    if (t.closest("#d-share")) {
      const url = location.href;
      (async () => {
        try { navigator.share ? await navigator.share({ title: e.title, text: `Mira este evento: ${e.title}`, url }) : await navigator.clipboard.writeText(url); } catch { /* cancelado */ }
        toast = true; draw(); setTimeout(() => { toast = false; draw(); }, 2500);
      })();
    }
  };
  root.oninput = null; root.onsubmit = null;
  draw();
}

/* ───────── Checkout ───────── */
const FEE = 0.04;
const BANKS = ["Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA Colombia", "Banco Popular", "Banco de Occidente", "Colpatria"];

export function renderCheckout(root: HTMLElement, e: EventItem, onBack: () => void, onConfirm: () => void) {
  const cats = e.ticketCategories || [{ name: "General", price: e.price }];
  const s = { qty: 1, cat: cats.find(c => c.name === "General")?.name ?? cats[0].name, notes: "", coupon: "", pay: "card" as "card" | "pse", busy: false,
    bank: "", docType: "CC", docNumber: "", cardNum: "", cardName: "", exp: "", cvv: "" };
  const unit = () => cats.find(c => c.name === s.cat)?.price ?? e.price;
  const coupons = () => (getCurrentUser()?.coupons ?? []).filter(c => !c.used);
  const cp = () => coupons().find(c => c.code === s.coupon);
  const sub = () => unit() * s.qty, disc = () => Math.round((sub() * (cp()?.percent ?? 0)) / 100), fee = () => Math.round((sub() - disc()) * FEE), total = () => sub() - disc() + fee();
  const inp = (id: keyof typeof s, label: string, ph: string, attrs = "") => `<div class="fg"><label for="${id}">${label}</label><input id="${id}" value="${esc(String(s[id]))}" placeholder="${ph}" required ${attrs}></div>`;

  function draw() {
    const steps = ["Selección", "Reserva", "Pago", "Confirmación"];
    root.innerHTML = `${topbar(`<button class="tbtn" id="c-back">${svg(P.arrow)} Volver al evento</button>`, `<span class="tbtn">${svg(P.shield)} Pago seguro</span>`)}
    <div class="steps container">${steps.map((l, i) => `<span class="${i === 1 ? "is-cur" : i < 1 ? "is-done" : ""}"><i>${i < 1 ? svg(P.check, 12) : i + 1}</i>${l}</span>`).join("")}</div>
    <div class="container cgrid"><form id="c-form">
      <section class="cbox"><h2>Datos de la reserva</h2>
        <label class="lbl">Categoría de entrada</label><div class="opts">${cats.map(c => `<button type="button" data-cat="${esc(c.name)}" class="opt${c.name === s.cat ? " is-on" : ""}"><b>${esc(c.name)}</b><span>${cop(c.price)}</span></button>`).join("")}</div>
        <label class="lbl">Cantidad de entradas</label><div class="qty"><button type="button" data-q="-1" aria-label="Menos">${svg(P.minus, 16)}</button><b>${s.qty}</b><button type="button" data-q="1" aria-label="Más">${svg(P.plus, 16)}</button></div>
        <small class="hint">Máximo 10 entradas por transacción.</small>
        ${coupons().length ? `<div class="fg"><label for="coupon">Cupón de descuento</label><select id="coupon"><option value="">Sin cupón</option>${coupons().map(c => `<option value="${c.code}"${c.code === s.coupon ? " selected" : ""}>${esc(c.label)} · ${c.code}</option>`).join("")}</select></div>` : ""}
        <div class="fg"><label for="notes">Observaciones (opcional)</label><textarea id="notes" rows="3" placeholder="Requisitos especiales de accesibilidad, necesidades dietéticas, etc.">${esc(s.notes)}</textarea></div></section>
      <section class="cbox"><h2>Método de pago</h2>
        <div class="opts"><button type="button" data-pay="card" class="opt${s.pay === "card" ? " is-on" : ""}"><b>Tarjeta de crédito/débito</b></button><button type="button" data-pay="pse" class="opt${s.pay === "pse" ? " is-on" : ""}"><b>PSE / Transferencia</b></button></div>
        ${s.pay === "card"
          ? inp("cardNum", "Número de tarjeta", "0000 0000 0000 0000", 'inputmode="numeric" pattern="[0-9 ]{13,19}" autocomplete="cc-number"') + inp("cardName", "Nombre en la tarjeta", "Como aparece en la tarjeta", 'autocomplete="cc-name"') +
            `<div class="two">${inp("exp", "Vencimiento", "MM/AA", 'pattern="(0[1-9]|1[0-2])\\/\\d{2}" maxlength="5"')}${inp("cvv", "CVV", "123", 'inputmode="numeric" pattern="[0-9]{3,4}" maxlength="4"')}</div>`
          : `<div class="fg"><label for="bank">Banco</label><select id="bank" required><option value="">Selecciona tu banco</option>${BANKS.map(b => `<option${b === s.bank ? " selected" : ""}>${b}</option>`).join("")}</select></div>
             <div class="two"><div class="fg"><label for="docType">Tipo de documento</label><select id="docType">${["CC", "CE", "NIT", "Pasaporte"].map(d => `<option${d === s.docType ? " selected" : ""}>${d}</option>`).join("")}</select></div>${inp("docNumber", "Número", "Documento", 'inputmode="numeric"')}</div>`}
      </section>
      <button class="btn btn--navy full" type="submit"${s.busy ? " disabled" : ""}>${s.busy ? "Procesando pago…" : `Pagar ${cop(total())}`}</button></form>
      <aside class="dside"><h3>Resumen</h3><p class="sumt">${esc(e.title)}</p><p class="meta">${svg(P.cal)} ${formatDateString(e.date)}</p><p class="meta">${svg(P.loc)} ${esc(e.city)}</p><hr>
        <div class="sumr"><span>${s.qty} × ${esc(s.cat)}</span><b>${cop(sub())}</b></div>${disc() ? `<div class="sumr"><span>Cupón ${cp()!.percent}%</span><b>− ${cop(disc())}</b></div>` : ""}<div class="sumr"><span>Cargo por servicio (4%)</span><b>${cop(fee())}</b></div>
        <div class="sumr sumr--t"><span>Total</span><b>${cop(total())}</b></div></aside></div>`;
  }

  root.onclick = ev => {
    const t = ev.target as HTMLElement, el = (k: string) => t.closest<HTMLElement>(`[${k}]`);
    if (t.closest("#c-back")) return onBack();
    if (el("data-cat")) { s.cat = el("data-cat")!.dataset.cat!; draw(); }
    else if (el("data-q")) { s.qty = Math.min(10, Math.max(1, s.qty + Number(el("data-q")!.dataset.q))); draw(); }
    else if (el("data-pay")) { s.pay = el("data-pay")!.dataset.pay as "card" | "pse"; draw(); }
  };
  root.oninput = ev => { const t = ev.target as HTMLInputElement; if (t.id in s) (s as Record<string, unknown>)[t.id] = t.value; if (t.id === "coupon") draw(); };
  root.onsubmit = ev => {
    ev.preventDefault();
    s.busy = true; draw();
    setTimeout(() => {
      const u = getCurrentUser();
      if (u) {
        const res = { id: `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, eventId: e.id, event: e.title, date: formatDateString(e.date), tickets: s.qty, total: total(), status: "confirmed", category: s.cat, venue: e.city, createdAt: new Date().toISOString(), discount: disc() };
        const earned = Math.round(total() / 1000);
        updateUser({ reservations: [res, ...(u.reservations || [])], points: (u.points || 0) + earned, lifetimePoints: (u.lifetimePoints ?? u.points ?? 0) + earned,
          coupons: (u.coupons || []).map(c => (c.code === s.coupon ? { ...c, used: true } : c)) });
        consumeTickets(e.id, s.qty, s.cat);
      }
      onConfirm();
    }, 1600);
  };
  draw();
}
