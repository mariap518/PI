import logo from "./assets/logo-new.png";
import { getCurrentUser, getUsers, logout, updateUser } from "./auth";
import { TIERS, REWARDS, tierInfo } from "./points";
import { downloadTicket, qrSvg } from "./ticket";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const cop = (n: number) => "$ " + n.toLocaleString("es-CO");
const I = {
  ticket: "M2 9a2 2 0 0 1 0-4V3h20v2a2 2 0 0 1 0 4v2a2 2 0 0 1 0 4v2H2v-2a2 2 0 0 1 0-4V9zM12 3v18", star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3", edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  x: "M18 6 6 18M6 6l12 12", chev: "M9 18l6-6-6-6", check: "M20 6L9 17l-5-5", arrow: "M19 12H5M12 19l-7-7 7-7",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", eyeOff: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
};
const svg = (d: string, s = 16, f = "none") => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const STATUS: Record<string, [string, string]> = { confirmed: ["Confirmada", "ok"], reserved: ["Reservada", "warn"], cancelled: ["Cancelada", "bad"] };
const pill = (st: string) => { const [l, c] = STATUS[st] ?? STATUS.confirmed; return `<span class="pill pill--${c}">${l}</span>`; };
const TABS = [["reservas", "Mis Reservas", I.ticket], ["puntos", "Mis Puntos", I.star], ["perfil", "Mi Perfil", I.user]] as const;
type Tab = (typeof TABS)[number][0];
type Res = { id: string; event: string; date: string; tickets: number; total: number; status: string; category: string; venue: string };

function download(name: string, text: string, type = "text/plain;charset=utf-8;") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

export function renderProfile(root: HTMLElement, onBack: () => void) {
  if (!getCurrentUser()) return onBack();
  const s = { tab: "reservas" as Tab, sel: null as Res | null, editing: false, draft: { nombre: "", correo: "", telefono: "", ciudad: "", empresa: "", cargo: "" }, saved: false, saveErr: "",
    pw: false, fa: false, faOn: true, show: false, cur: "", nxt: "", conf: "", pwMsg: "", pwOk: false, faOk: false };
  const info = () => {
    const u = getCurrentUser()!;
    return { nombre: u.name, correo: u.email, telefono: u.phone || "", ciudad: u.city || "", empresa: u.empresa || "",
      cargo: u.position || (u.role === "admin" ? "Administrador" : u.role === "agente" ? "Agente de Ventas" : "Cliente") };
  };

  function tabReservas(list: Res[]) {
    const stat = [["Total reservas", String(list.length), "historial completo"], ["Confirmadas", String(list.filter(r => r.status === "confirmed").length), "acceso garantizado"], ["Gasto total", cop(list.reduce((a, r) => a + r.total, 0)), "en eventos 2026"]];
    return `<div class="stats3">${stat.map(([l, v, sb]) => `<div class="pcard"><small>${l}</small><b>${v}</b><span>${sb}</span></div>`).join("")}</div>
    <div class="pcard"><div class="phead"><h2>Historial de reservas</h2><button class="pbtn" data-csv>${svg(I.dl, 14)} Exportar CSV</button></div>
    <div class="tscroll"><table><thead><tr>${["ID", "Evento", "Fecha", "Entradas", "Total", "Estado", ""].map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>
    ${list.length ? list.map((r, i) => `<tr><td>${esc(r.id)}</td><td><b>${esc(r.event)}</b></td><td>${esc(r.date)}</td><td>${r.tickets}</td><td>${cop(r.total)}</td><td>${pill(r.status)}</td><td><button class="lnk" data-res="${i}">Ver ${svg(I.chev, 13)}</button></td></tr>`).join("") : `<tr><td colspan="7" class="empty2">No hay reservas registradas.</td></tr>`}</tbody></table></div></div>`;
  }

  function tabPuntos(list: Res[], pts: number) {
    const u = getCurrentUser()!, life = u.lifetimePoints ?? u.points ?? 0, ti = tierInfo(life), coupons = u.coupons ?? [];
    const rules = [["1 punto por cada", "$1.000 COP", "pagados en cada compra"], ["Tu nivel depende de", "puntos acumulados", "canjear NO te baja de nivel"], ["Cupones", "se usan en el checkout", "un cupón por compra"]];
    return `<div class="pcard pts"><div><small>Puntos disponibles</small><div class="big">${pts.toLocaleString()} <span>pts</span></div>
      <p>Nivel actual: <b>${ti.tier.name}</b>${ti.next ? ` · Próximo: ${ti.next.name}` : " · Nivel máximo"}</p>
      <div class="prog"><span>${ti.next ? `Progreso hacia ${ti.next.name}` : "Has llegado al tope"}</span><span>${life.toLocaleString()}${ti.next ? ` / ${ti.next.min.toLocaleString()}` : ""} pts acumulados</span></div><div class="bar"><i style="width:${ti.pct}%"></i></div></div>
      <div class="medal" style="background:${ti.tier.color};color:${ti.tier.fg}">${svg(I.star, 44, "currentColor")}<b>Nivel ${ti.tier.name}</b></div></div>
    <div class="stats3">${rules.map(([l, v, sb]) => `<div class="pcard"><small>${l}</small><b>${v}</b><span>${sb}</span></div>`).join("")}</div>
    <div class="pcard"><h2>Canjear puntos</h2><div class="rewards">${REWARDS.map(r => `<div class="reward"><b>${r.label}</b><small>${r.cost.toLocaleString()} pts</small><button class="pbtn pbtn--p" data-redeem="${r.id}"${pts < r.cost ? " disabled" : ""}>${pts < r.cost ? `Te faltan ${(r.cost - pts).toLocaleString()}` : "Canjear"}</button></div>`).join("")}</div>
      ${coupons.length ? `<h4 class="subh">Mis cupones</h4>${coupons.map(c => `<div class="mov"><span class="ico">%</span><div><b>${esc(c.label)}</b><small>Código ${esc(c.code)} · canjeado el ${esc(c.date)}</small></div><span class="pill pill--${c.used ? "bad" : "ok"}">${c.used ? "Usado" : "Disponible"}</span></div>`).join("")}` : ""}</div>
    <div class="pcard"><h2>Niveles</h2>${TIERS.map(t => `<div class="tier${t.name === ti.tier.name ? " is-cur" : ""}"><span class="dot" style="background:${t.color}"></span><b>${t.name}</b><span>${t.min.toLocaleString()} pts acumulados</span><small>≈ $ ${(t.min * 1000).toLocaleString("es-CO")} en compras</small></div>`).join("")}</div>
    <div class="pcard"><div class="phead"><h2>Historial de movimientos</h2></div>${list.length || coupons.length ? [...list.map(r => `<div class="mov"><span class="ico">${svg(I.star)}</span><div><b>Compra: ${esc(r.event)}</b><small>${esc(r.date)}</small></div><strong>+${Math.round(r.total / 1000).toLocaleString()} pts</strong></div>`),
      ...coupons.map(c => `<div class="mov"><span class="ico">%</span><div><b>Canje: ${esc(c.label)}</b><small>${esc(c.date)}</small></div><strong style="color:#B91C1C">−${c.cost.toLocaleString()} pts</strong></div>`)].join("") : `<div class="empty2">No hay movimientos registrados.</div>`}</div>`;
  }

  function pwForm() {
    const f = (id: string, l: string, v: string) => `<div class="fg"><label for="${id}">${l}</label><div class="pw"><input id="${id}" type="${s.show ? "text" : "password"}" value="${esc(v)}"><button type="button" data-show aria-label="Mostrar">${svg(s.show ? I.eyeOff : I.eye, 15)}</button></div></div>`;
    const mismatch = s.nxt && s.conf && s.nxt !== s.conf ? "Las contraseñas no coinciden." : "";
    return `<div class="sub2"><h4>Cambiar contraseña</h4>${f("cur", "Contraseña actual", s.cur)}${f("nxt", "Nueva contraseña", s.nxt)}${f("conf", "Confirmar nueva", s.conf)}
      ${(mismatch || s.pwMsg) ? `<p class="errtxt">${mismatch || s.pwMsg}</p>` : ""}${s.pwOk ? `<p class="oktxt">${svg(I.check, 13)} Contraseña actualizada.</p>` : ""}
      <div class="row2"><button class="btn btn--navy" data-pwsave${mismatch ? " disabled" : ""}>Guardar</button><button class="btn btn--ghost2" data-pw>Cancelar</button></div></div>`;
  }

  function tabPerfil() {
    const p = info(), u = getCurrentUser()!;
    const L: Record<string, string> = { nombre: "Nombre completo", correo: "Correo electrónico", telefono: "Teléfono", ciudad: "Ciudad", empresa: "Empresa", cargo: "Cargo" };
    return `<div class="pgrid"><div>
      <div class="pcard"><div class="phead"><h2>Información personal</h2>${s.editing
        ? `<span class="row2"><button class="pbtn pbtn--p" data-save>${svg(I.check, 13)} Guardar</button><button class="pbtn" data-cancel>Cancelar</button></span>`
        : `<button class="pbtn" data-edit>${svg(I.edit, 13)} Editar</button>`}</div>
        <div class="two">${(Object.keys(L) as (keyof typeof p)[]).map(k => `<div><small>${L[k]}</small>${s.editing && (k !== "empresa" || u.role !== "agente")
          ? `<input class="pin" data-d="${k}" value="${esc(s.draft[k as keyof typeof s.draft])}">` : `<div class="val">${esc(p[k] || "—")}</div>`}</div>`).join("")}</div>
        ${s.saveErr ? `<p class="errtxt" style="margin-top:12px">${s.saveErr}</p>` : ""}${s.editing && u.role === "agente" ? `<p class="hint">La empresa de un agente no se puede cambiar porque depende de su código de acceso.</p>` : ""}</div>
      <div class="pcard"><h2>Seguridad</h2>
        <div class="srow"><div><b>${svg(I.lock, 15)} Contraseña</b><small>Protege tu cuenta</small></div><button class="pbtn" data-pw>${s.pw ? "Cancelar" : "Cambiar"}</button></div>${s.pw ? pwForm() : ""}<hr>
        <div class="srow"><div><b>${svg(I.shield, 15)} Autenticación de dos factores <span class="pill pill--${s.faOn ? "ok" : "bad"}">${s.faOn ? "Activa" : "Inactiva"}</span></b><small>${s.faOn ? "Código por SMS en cada inicio de sesión" : "Sin verificación adicional"}</small></div><button class="pbtn" data-fa>${s.fa ? "Cancelar" : "Cambiar"}</button></div>
        ${s.fa ? `<div class="sub2"><h4>${s.faOn ? "Desactivar" : "Activar"} autenticación de dos factores</h4><p>${s.faOn ? "Al desactivar 2FA tu cuenta quedará protegida únicamente por contraseña. ¿Confirmas?" : "Recibirás un código por SMS cada vez que inicies sesión. ¿Deseas activarlo?"}</p>${s.faOk ? `<p class="oktxt">${svg(I.check, 13)} Listo.</p>` : ""}<div class="row2"><button class="btn btn--navy" data-faok>${s.faOn ? "Desactivar" : "Activar"}</button><button class="btn btn--ghost2" data-fa>Cancelar</button></div></div>` : ""}</div></div>
      <div class="pcard qr"><small>Credencial de acceso</small><h3>ID: ${esc(u.id)}</h3><div class="qrbox" role="img" aria-label="QR de acceso">${qrSvg("SIXEVENT:" + u.id)}</div><p>Presenta este código QR desde tu celular para agilizar tu registro en los recintos.</p></div></div>`;
  }

  function modal() {
    const r = s.sel; if (!r) return "";
    return `<div class="modal" data-close><div class="modal__box wide"><div class="phead"><div><small>Detalle de reserva</small><b>${esc(r.id)}</b></div><button class="lnk" data-close aria-label="Cerrar">${svg(I.x, 18)}</button></div>
      <div class="phead"><h3>${esc(r.event)}</h3>${pill(r.status)}</div>
      <div class="two">${[["Fecha", r.date], ["Categoría", r.category], ["Entradas", `${r.tickets} entrada${r.tickets > 1 ? "s" : ""}`], ["Recinto", r.venue]].map(([l, v]) => `<div><small>${l}</small><div class="val">${esc(v)}</div></div>`).join("")}</div>
      <div class="sumr sumr--t"><span>Total pagado</span><b>${cop(r.total)}</b></div>
      <div class="row2" style="margin-top:16px"><button class="btn btn--navy" style="flex:1" data-dl>${svg(I.dl, 15)} Descargar boleta</button><button class="btn btn--ghost2" style="flex:1" data-close>Cerrar</button></div></div></div>`;
  }

  function draw() {
    const u = getCurrentUser(); if (!u) return onBack();
    const list = (u.reservations || []) as Res[], pts = u.points || 0, ti = tierInfo(u.lifetimePoints ?? u.points ?? 0), pct = ti.pct;
    const title = TABS.find(t => t[0] === s.tab)![1];
    root.innerHTML = `${modal()}<div class="prof"><aside class="pside"><img src="${logo}" alt="6ixEvent logo" height="40" style="mix-blend-mode:screen">
      <div class="who"><span class="avatar big-av">${esc(u.name.slice(0, 2).toUpperCase())}</span><div><b>${esc(u.name.split(" ").slice(0, 2).join(" "))}</b><small>${esc(info().cargo)} · Nivel ${ti.tier.name}</small></div></div>
      <nav>${TABS.map(([k, l, ic]) => `<button class="${s.tab === k ? "is-on" : ""}" data-tab="${k}">${svg(ic)} ${l}</button>`).join("")}<button data-logout>${svg(I.logout)} Cerrar sesión</button></nav>
      <div class="ptsbox"><small>Puntos acumulados</small><b>${pts.toLocaleString()}</b><div class="bar bar--l"><i style="width:${pct}%"></i></div><small>${ti.next ? `${ti.toNext.toLocaleString()} pts para ${ti.next.name}` : "Nivel máximo"}</small></div>
      <button class="tbtn" data-back>${svg(I.arrow, 13)} Volver al inicio</button></aside>
      <main class="pmain"><div class="phead"><h1>${title}</h1>${s.saved ? `<span class="oktxt">${svg(I.check, 14)} Perfil actualizado</span>` : ""}</div>
      ${s.tab === "reservas" ? tabReservas(list) : s.tab === "puntos" ? tabPuntos(list, pts) : tabPerfil()}</main></div>`;
  }

  root.onclick = e => {
    const t = e.target as HTMLElement, has = (k: string) => t.closest<HTMLElement>(`[${k}]`);
    const u = getCurrentUser()!, list = (u?.reservations || []) as Res[];
    const tab = has("data-tab"), res = has("data-res");
    if (has("data-back")) return onBack();
    const rd = has("data-redeem");
    if (rd) {
      const r = REWARDS.find(x => x.id === rd.dataset.redeem);
      if (r && (u.points || 0) >= r.cost) updateUser({ points: (u.points || 0) - r.cost, coupons: [{ code: "SIX-" + Math.random().toString(36).slice(2, 8).toUpperCase(), label: r.label, percent: r.percent, cost: r.cost, date: new Date().toLocaleDateString("es-CO"), used: false }, ...(u.coupons || [])] });
      return draw();
    }
    if (has("data-logout")) { logout(); return onBack(); }
    if (tab) { s.tab = tab.dataset.tab as Tab; return draw(); }
    if (res) { s.sel = list[Number(res.dataset.res)]; return draw(); }
    if (has("data-dl") && s.sel) return void downloadTicket(s.sel, u.name);
    if (has("data-close")) { if (t.closest(".modal__box") && !t.closest("button")) return; s.sel = null; return draw(); }
    if (has("data-csv")) {
      const rows = list.map(r => [r.id, `"${r.event}"`, r.date, r.tickets, r.total, (STATUS[r.status] ?? STATUS.confirmed)[0]]);
      return download("reservas_sixevent.csv", "\ufeff" + [["ID", "Evento", "Fecha", "Entradas", "Total (COP)", "Estado"], ...rows].map(r => r.join(",")).join("\n"), "text/csv;charset=utf-8;");
    }
    if (has("data-edit")) { s.draft = { ...info() }; s.saveErr = ""; s.editing = true; return draw(); }
    if (has("data-cancel")) { s.editing = false; s.saveErr = ""; return draw(); }
    if (has("data-save")) {
      const d = s.draft, email = d.correo.trim();
      if (!email.includes("@")) { s.saveErr = "Ingresa un correo válido."; return draw(); }
      if (getUsers().some(x => x.id !== u.id && x.email.toLowerCase() === email.toLowerCase())) { s.saveErr = "Ese correo ya está registrado."; return draw(); }
      const ok = updateUser({ name: d.nombre.trim() || u.name, email, phone: d.telefono.trim(), city: d.ciudad.trim(), position: d.cargo.trim() || undefined,
        ...(u.role === "agente" ? {} : { empresa: d.empresa.trim() || undefined }) });
      if (!ok) { s.saveErr = "El navegador no permitió guardar los datos (almacenamiento bloqueado)."; return draw(); }
      s.saveErr = ""; s.editing = false; s.saved = true; draw(); setTimeout(() => { s.saved = false; draw(); }, 2500); return;
    }
    if (has("data-pw")) { s.pw = !s.pw; s.fa = false; s.cur = s.nxt = s.conf = s.pwMsg = ""; s.pwOk = false; return draw(); }
    if (has("data-fa")) { s.fa = !s.fa; s.pw = false; s.faOk = false; return draw(); }
    if (has("data-show")) { s.show = !s.show; return draw(); }
    if (has("data-faok")) { s.faOk = true; draw(); setTimeout(() => { s.faOn = !s.faOn; s.fa = false; s.faOk = false; draw(); }, 900); return; }
    if (has("data-pwsave")) {
      if (!s.cur || !s.nxt || s.nxt !== s.conf) return;
      if (s.nxt.length < 6) { s.pwMsg = "La contraseña debe tener al menos 6 caracteres."; return draw(); }
      if (u.password && s.cur !== u.password) { s.pwMsg = "La contraseña actual es incorrecta."; return draw(); }
      updateUser({ password: s.nxt }); s.pwMsg = ""; s.pwOk = true; draw();
      setTimeout(() => { s.pw = false; s.pwOk = false; s.cur = s.nxt = s.conf = ""; draw(); }, 1200);
    }
  };
  root.oninput = e => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.d) (s.draft as Record<string, string>)[t.dataset.d] = t.value;
    else if (t.id === "cur" || t.id === "nxt" || t.id === "conf") { s[t.id] = t.value; if (t.id !== "cur") { const w = root.querySelector(".sub2 .errtxt"); if (!w && s.nxt && s.conf && s.nxt !== s.conf) draw(); } }
  };
  root.onsubmit = null;
  draw();
}
