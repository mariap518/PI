/** Calificaciones de eventos: llamadas al servidor y la sección «Calificaciones» del detalle del evento. */
import "./ratings.css";
import { getCurrentUser } from "../services/auth";
import { applyEventUpdate, type EventItem } from "../services/db";

export interface RatingStats {
  base: number;                     // calificación inicial / por defecto
  count: number;                    // votos de usuarios
  average: number | null;           // promedio de los votos de usuarios
  rating: number;                   // la que se muestra
  dist: Record<"1" | "2" | "3" | "4" | "5", number>;
  mine: number | null;              // mi calificación
  canRate: boolean;
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const u = getCurrentUser();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(u ? { "x-user-id": u.id, "x-user-role": u.role } : {}) };
  const res = await fetch("/api" + path, { ...init, headers });
  if (!res.ok) throw new Error((await res.json().catch(() => ({} as { error?: string }))).error ?? `Error ${res.status}`);
  return res.json() as Promise<T>;
}

export const getRatingStats = (id: number) => call<RatingStats>(`/events/${id}/ratings`);
export const rateEvent = async (id: number, stars: number) => applyEventUpdate(await call<EventItem>(`/events/${id}/rating`, { method: "PUT", body: JSON.stringify({ stars }) }));
export const removeMyRating = async (id: number) => applyEventUpdate(await call<EventItem>(`/events/${id}/rating`, { method: "DELETE" }));
export const setDefaultRating = async (id: number, value: number) => applyEventUpdate(await call<EventItem>(`/events/${id}/default-rating`, { method: "PUT", body: JSON.stringify({ value }) }));
export const resetUserRatings = async (id: number) => applyEventUpdate(await call<EventItem>(`/events/${id}/ratings`, { method: "DELETE" }));

/* ───────── Sección en el detalle del evento ───────── */
const fmt = (n: number) => n.toFixed(1).replace(".", ",");
const starsStatic = (r: number) => `<span class="rstars" role="img" aria-label="${fmt(r)} de 5 estrellas"><span class="rstars__fill" style="width:${Math.max(0, Math.min(100, (r / 5) * 100))}%">★★★★★</span></span>`;

export interface RatingState { stats: RatingStats | null; error: string; msg: string; busy: boolean; adminDraft: string }
export const newRatingState = (): RatingState => ({ stats: null, error: "", msg: "", busy: false, adminDraft: "" });

/** HTML de la sección. `s` guarda el estado entre dibujos. */
export function ratingSection(e: EventItem, s: RatingState): string {
  const u = getCurrentUser(), st = s.stats;
  if (!st) return `<section class="dsec rbox" id="rate-box"><h2>Calificaciones</h2><p class="rnote">${s.error ? esc(s.error) : "Cargando calificaciones…"}</p></section>`;
  const total = st.count;
  const bars = ([5, 4, 3, 2, 1] as const).map(n => { const c = st.dist[String(n) as "1"], pct = total ? Math.round((c / total) * 100) : 0;
    return `<div class="rdist"><span>${n} ★</span><div class="rdist__bar"><i style="width:${pct}%"></i></div><span>${c}</span></div>`; }).join("");

  let mine: string;
  if (!u) mine = `<p class="rnote">Inicia sesión para calificar este evento.</p><button class="btn btn--cream" data-rate-login>Iniciar sesión</button>`;
  else if (!st.canRate) mine = `<p class="rnote">No puedes calificar un evento que tú creaste.</p>`;
  else mine = `<p class="rnote">${st.mine ? `Tu calificación: <b>${st.mine} ★</b>. Puedes cambiarla.` : "¿Qué te pareció este evento? Toca una estrella."}</p>
      <div class="rpick" role="radiogroup" aria-label="Tu calificación">${[5, 4, 3, 2, 1].map(n => `<button type="button" role="radio" aria-checked="${st.mine === n}" class="rpick__s${st.mine !== null && n <= st.mine ? " is-on" : ""}" data-rate="${n}" aria-label="${n} ${n === 1 ? "estrella" : "estrellas"}"${s.busy ? " disabled" : ""}>★</button>`).join("")}</div>
      ${st.mine ? `<button type="button" class="rlink" data-rate-remove${s.busy ? " disabled" : ""}>Quitar mi calificación</button>` : ""}`;

  const admin = u?.role === "admin" ? `<div class="radmin"><h3>Administrar calificación <small>(solo administradores)</small></h3>
      <p class="rnote">Calificación por defecto actual: <b>${fmt(st.base)}</b> · Promedio de usuarios: <b>${st.average === null ? "—" : fmt(st.average)}</b> (${st.count} ${st.count === 1 ? "voto" : "votos"}) · Mostrada: <b>${fmt(st.rating)}</b></p>
      <div class="radmin__row"><label for="rate-default" id="rate-default-help">Nueva calificación por defecto (de 0 a 5, por ejemplo 4,5)</label>
        <input id="rate-default" type="text" inputmode="decimal" autocomplete="off" maxlength="4" value="${esc(s.adminDraft || fmt(st.base))}" aria-describedby="rate-default-help">
        <button type="button" class="btn btn--cream" data-rate-default${s.busy ? " disabled" : ""}>Guardar</button></div>
      <button type="button" class="rlink rlink--danger" data-rate-reset${s.busy || !st.count ? " disabled" : ""}>${st.count === 1 ? "Borrar el voto de usuario de este evento" : `Borrar los ${st.count} votos de usuarios de este evento`}</button></div>` : "";

  return `<section class="dsec rbox" id="rate-box"><h2>Calificaciones</h2>
    <div class="rsum"><div class="rsum__big"><b>${fmt(st.rating)}</b>${starsStatic(st.rating)}<small>${total ? `${total} ${total === 1 ? "opinión" : "opiniones"}` : "Sin opiniones todavía"}</small></div>
      ${total ? `<div class="rsum__dist">${bars}</div>` : `<p class="rnote">Aún nadie ha calificado este evento. La calificación mostrada es la inicial.</p>`}</div>
    <div class="rmine">${mine}</div>
    ${s.msg ? `<p class="rmsg" role="status">${esc(s.msg)}</p>` : ""}${s.error ? `<p class="rerr" role="alert">${esc(s.error)}</p>` : ""}${admin}
    <p class="rfoot">La calificación mostrada combina la calificación inicial del evento con las opiniones de las personas.</p></section>`;
}
