import logo from "./assets/logo-new.png";
import { getEvents, formatDateString, type EventItem } from "./db";
import { getCurrentUser, getUsers } from "./auth";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const cop = (n: number) => "$ " + Math.round(n).toLocaleString("es-CO");
const short = (n: number) => (n >= 1e9 ? (n / 1e9).toFixed(1) + " mil M" : n >= 1e6 ? (n / 1e6).toFixed(1) + " M" : n >= 1e3 ? Math.round(n / 1e3) + " mil" : String(Math.round(n)));
const PALETTE = ["#1E3A5F", "#3B6EA5", "#D9C17A", "#8FB3DE", "#5C7FA3", "#B8A25A", "#C9D6E8"];

/** Ventas = entradas descontadas del inventario de cada evento (incluye las compras hechas en el checkout) */
function stats(e: EventItem) {
  const cap = e.capacity ?? 0, sold = Math.max(0, cap - (e.availableTickets ?? cap));
  const cats = (e.ticketCategories ?? []).map(c => ({ n: Math.max(0, (c.capacity ?? 0) - (c.available ?? c.capacity ?? 0)), price: c.price }));
  const catSold = cats.reduce((a, c) => a + c.n, 0);
  const revenue = Math.max(0, sold - catSold) * e.price + cats.reduce((a, c) => a + c.n * c.price, 0);
  return { cap, sold, revenue, occ: cap ? (sold / cap) * 100 : 0 };
}

export function renderDashboard(root: HTMLElement, onBack: () => void) {
  const u = getCurrentUser();
  if (!u || u.role === "cliente") return onBack();
  const users = getUsers();
  const company = (e: EventItem) => e.company ?? users.find(x => x.id === e.createdBy)?.empresa;
  const events = getEvents().filter(e => u.role === "admin" || e.createdBy === u.id || (!!u.empresa && company(e) === u.empresa));
  const rows = events.map(e => ({ e, ...stats(e) }));
  const total = rows.reduce((a, r) => a + r.revenue, 0), sold = rows.reduce((a, r) => a + r.sold, 0), cap = rows.reduce((a, r) => a + r.cap, 0);
  const group = (key: (e: EventItem) => string) => {
    const m = new Map<string, number>(); rows.forEach(r => m.set(key(r.e), (m.get(key(r.e)) ?? 0) + r.revenue));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const byCat = group(e => e.category), byCity = group(e => e.city).slice(0, 6);
  const top = [...rows].sort((a, b) => b.revenue - a.revenue).slice(0, 8), maxRev = Math.max(1, ...top.map(r => r.revenue)), maxCity = Math.max(1, ...byCity.map(c => c[1]));
  const C = 2 * Math.PI * 70; let acc = 0;
  const donut = byCat.map(([, v], i) => { const len = total ? (v / total) * C : 0; const s = `<circle r="70" cx="90" cy="90" fill="none" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="32" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-acc}" transform="rotate(-90 90 90)"/>`; acc += len; return s; }).join("");
  const scope = u.role === "admin" ? "Todas las ventas de la plataforma" : `Eventos creados por ${esc(u.empresa || u.name)}`;

  root.innerHTML = `<div class="dash"><header class="top"><div class="container top__in"><button class="tbtn" data-back>← Volver al inicio</button><img src="${logo}" alt="6ixEvent logo" height="36" style="mix-blend-mode:screen"></div></header>
  <div class="container dash__in"><div class="phead"><div><span class="eyebrow" style="color:var(--navy-l)">${u.role === "admin" ? "Administrador" : "Agente"}</span><h1>Panel de ventas</h1><p class="sub" style="margin:0">${scope}</p></div></div>
  ${rows.length ? `
  <div class="stats3 kpis">${[["Ingresos estimados", cop(total), "boletas vendidas × precio"], ["Boletas vendidas", sold.toLocaleString(), `de ${cap.toLocaleString()} disponibles`], ["Ocupación promedio", (cap ? (sold / cap) * 100 : 0).toFixed(1) + "%", "vendidas / capacidad"], ["Eventos", String(events.length), `${rows.filter(r => r.sold > 0).length} con ventas`]].map(([l, v, s]) => `<div class="pcard kpi"><small>${l}</small><b>${v}</b><span>${s}</span></div>`).join("")}</div>
  <div class="dgrid2"><div class="pcard"><h2>Ingresos por evento</h2>${top.map(r => `<div class="hb"><span title="${esc(r.e.title)}">${esc(r.e.title)}</span><div><i style="width:${(r.revenue / maxRev) * 100}%"></i></div><b>${short(r.revenue)}</b></div>`).join("")}</div>
  <div class="pcard"><h2>Ventas por categoría</h2><div class="donut"><svg viewBox="0 0 180 180" role="img" aria-label="Ventas por categoría">${donut}<text x="90" y="86" text-anchor="middle" font-size="11" fill="#6B7280">Total</text><text x="90" y="104" text-anchor="middle" font-size="15" font-weight="700" fill="#1E3A5F">${short(total)}</text></svg>
    <ul>${byCat.map(([n, v], i) => `<li><i style="background:${PALETTE[i % PALETTE.length]}"></i>${esc(n)}<b>${total ? Math.round((v / total) * 100) : 0}%</b></li>`).join("")}</ul></div></div></div>
  <div class="pcard"><h2>Ventas por ciudad</h2><div class="vb">${byCity.map(([n, v]) => `<div><b>${short(v)}</b><i style="height:${Math.max(4, (v / maxCity) * 150)}px"></i><span>${esc(n)}</span></div>`).join("")}</div></div>
  <div class="pcard"><h2>Detalle por evento</h2><div class="tscroll"><table><thead><tr>${["Evento", "Fecha", "Vendidas", "Ocupación", "Ingresos"].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>
  ${[...rows].sort((a, b) => b.revenue - a.revenue).map(r => `<tr><td><b>${esc(r.e.title)}</b></td><td>${formatDateString(r.e.date)}</td><td>${r.sold.toLocaleString()} / ${r.cap.toLocaleString()}</td><td><div class="occ"><i style="width:${r.occ}%"></i></div> ${r.occ.toFixed(0)}%</td><td>${cop(r.revenue)}</td></tr>`).join("")}</tbody></table></div></div>`
  : `<div class="pcard empty2">Todavía no hay eventos para mostrar. ${u.role === "agente" ? "Crea tu primer evento desde la página de inicio y sus ventas aparecerán aquí." : ""}</div>`}</div></div>`;
  root.onclick = e => { if ((e.target as HTMLElement).closest("[data-back]")) onBack(); };
  root.oninput = null; root.onsubmit = null;
}
