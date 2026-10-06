import logo from "./assets/logo-new.png";
import { allCities } from "./geo";
import { loginUser, registerUser, logout, setAdminSession, ADMIN_CREDENTIALS, AGENT_CODES, type AuthUser } from "./auth";

type Mode = "login" | "register" | "forgot";
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const eye = "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z";
const eyeOff = "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22";
const svg = (d: string) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;

export function renderLogin(root: HTMLElement, startMode: "login" | "register", onBack: () => void, onSuccess: () => void) {
  const s = {
    mode: startMode as Mode, role: "cliente" as "cliente" | "agente",
    email: "", name: "", username: "", password: "", empresa: "Uceva", cc: "", phone: "", city: "",
    show: false, remember: false, loading: false,
    modal: null as null | "admin" | "agent", code: "", codeErr: "",
    errs: {} as Record<string, string>, pending: null as AuthUser | null,
  };
  type K = "email" | "name" | "username" | "password" | "cc" | "phone" | "city";

  function validate() {
    const e: Record<string, string> = {};
    const reg = s.mode === "register";
    if (reg && s.role === "agente" && s.name.trim().length < 2) e.name = "Ingresa tu nombre completo.";
    if (s.mode === "login" && !s.email.trim()) e.email = "Ingresa tu correo o usuario.";
    if (s.mode !== "login" && !s.email.includes("@")) e.email = "Ingresa un correo válido.";
    if (reg && s.role === "cliente" && s.username.trim().length < 3) e.username = "Nombre de usuario debe tener mínimo 3 caracteres.";
    if (reg && s.role === "agente" && s.cc.trim().length < 6) e.cc = "Ingresa una cédula válida.";
    if (reg) {
      if (s.phone.replace(/\D/g, "").length < 10) e.phone = "Ingresa un celular válido (mínimo 10 dígitos).";
      if (s.city.trim().length < 2) e.city = "Ingresa tu ciudad.";
    }
    if (s.mode !== "forgot" && s.password.length < 6) e.password = "La contraseña debe tener al menos 6 caracteres.";
    return e;
  }

  const input = (id: K, label: string, type: string, ph: string) =>
    `<div class="fg"><label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${ph}" value="${esc(s[id])}" class="${s.errs[id] ? "err" : ""}">${s.errs[id] ? `<small class="errtxt">${s.errs[id]}</small>` : ""}</div>`;

  const cityInput = () => `<div class="fg"><label for="city">Ciudad</label><input id="city" type="text" list="cities-list" placeholder="Ej: Bogotá" value="${esc(s.city)}" class="${s.errs.city ? "err" : ""}" autocomplete="off"><datalist id="cities-list">${allCities().map(c => `<option value="${esc(c)}">`).join("")}</datalist>${s.errs.city ? `<small class="errtxt">${s.errs.city}</small>` : ""}</div>`;

  function form() {
    const reg = s.mode === "register", cli = s.role === "cliente";
    const titles = { login: ["Iniciar sesión", "Ingresa tus credenciales para continuar."], forgot: ["Recuperar contraseña", "Ingresa tu correo para recibir un código de recuperación."], register: ["Crear cuenta", "Regístrate en la plataforma."] }[s.mode];
    return `<h2>${titles[0]}</h2><p class="sub">${titles[1]}</p>
    <form id="auth-form" novalidate>
      ${reg ? `<div class="fg"><label>Rol</label><div class="roles">${(["cliente", "agente"] as const).map(r => `<button type="button" data-role="${r}" class="${s.role === r ? "is-on" : ""}">${r}</button>`).join("")}</div></div>` : ""}
      ${reg && !cli ? input("name", "Nombre completo", "text", "Tu nombre") : ""}
      ${reg && cli ? input("username", "Nombre de usuario", "text", "Ej. jperez99") : ""}
      ${input("email", s.mode === "login" ? "Correo o usuario" : "Correo electrónico", "text", "correo@empresa.com")}
      ${reg ? input("phone", "Celular", "tel", "3001234567") + cityInput() : ""}
      ${reg && !cli ? `<div class="fg"><label for="empresa">Empresa</label><select id="empresa">${Object.keys(AGENT_CODES).map(e => `<option${e === s.empresa ? " selected" : ""}>${e}</option>`).join("")}</select></div>${input("cc", "Cédula", "text", "Número de cédula")}` : ""}
      ${s.mode !== "forgot" ? `<div class="fg"><label for="password">Contraseña</label><div class="pw"><input id="password" type="${s.show ? "text" : "password"}" placeholder="Mínimo 6 caracteres" value="${esc(s.password)}" class="${s.errs.password ? "err" : ""}"><button type="button" id="toggle-pw" aria-label="Mostrar contraseña">${svg(s.show ? eyeOff : eye)}</button></div>${s.errs.password ? `<small class="errtxt">${s.errs.password}</small>` : ""}</div>` : ""}
      ${s.mode === "login" ? `<div class="row"><label class="chk"><input type="checkbox" id="remember"${s.remember ? " checked" : ""}> Recordarme</label><button type="button" class="lnk" data-mode="forgot">¿Olvidaste tu contraseña?</button></div>` : ""}
      <button class="btn btn--navy full" type="submit"${s.loading ? " disabled" : ""}>${s.loading ? "Procesando…" : s.mode === "login" ? "Entrar" : s.mode === "forgot" ? "Enviar código" : "Crear cuenta"}</button>
    </form>
    <p class="switch">${s.mode === "login" ? `¿No tienes cuenta? <button class="lnk" data-mode="register">Regístrate</button>` : `<button class="lnk" data-mode="login">Volver a iniciar sesión</button>`}</p>`;
  }

  function modal() {
    if (!s.modal) return "";
    const admin = s.modal === "admin";
    return `<div class="modal"><div class="modal__box"><h3>${admin ? "Acceso de administrador" : "Verificación de agente"}</h3>
      <p class="sub">Ingresa tu código de acceso${admin ? "" : ` de ${esc(s.pending?.empresa ?? "tu empresa")}`}.</p>
      <input id="code" type="password" placeholder="Código" value="${esc(s.code)}" class="${s.codeErr ? "err" : ""}">${s.codeErr ? `<small class="errtxt">${s.codeErr}</small>` : ""}
      <div class="row" style="margin-top:16px"><button class="btn btn--ghost2" id="m-cancel">Cancelar</button><button class="btn btn--navy" id="m-ok">Confirmar</button></div></div></div>`;
  }

  function draw() {
    root.innerHTML = `<div class="auth"><div class="auth__l"><button class="back" id="back">← Volver al inicio</button>
      <img src="${logo}" alt="6ixEvent logo" height="64" style="mix-blend-mode:multiply"><h1>Bienvenido a SIX EVENT</h1>
      <p>La plataforma corporativa de gestión de eventos y venta de boletas más confiable de Colombia.</p>
      <div class="badges">${["1.8M+ boletas vendidas", "4.200+ eventos", "38 ciudades"].map(b => `<span>${b}</span>`).join("")}</div></div>
      <div class="auth__r"><div class="auth__box">${form()}</div></div></div>${modal()}`;
  }

  function submit() {
    s.errs = validate();
    if (Object.keys(s.errs).length) return draw();
    if (s.mode === "login" && s.email === ADMIN_CREDENTIALS.username && s.password === ADMIN_CREDENTIALS.password) { s.modal = "admin"; s.code = ""; return draw(); }
    s.loading = true; draw();
    setTimeout(() => {
      s.loading = false;
      if (s.mode === "forgot") { alert("¡Código enviado al correo! (PRÓXIMAMENTE)"); s.mode = "login"; return draw(); }
      if (s.mode === "register") {
        registerUser({ id: Date.now().toString(), name: s.role === "cliente" ? s.username.trim() : s.name.trim(), email: s.email, username: s.username, password: s.password, role: s.role,
          empresa: s.role === "agente" ? s.empresa : undefined, cc: s.role === "agente" ? s.cc : undefined, phone: s.phone.trim(), city: s.city.trim() });
      }
      const u = loginUser(s.email, s.password);
      if (!u) { s.errs = { password: "Credenciales incorrectas o cuenta no registrada." }; return draw(); }
      if (u.role === "agente") { s.pending = u; s.modal = "agent"; s.code = ""; return draw(); }
      onSuccess();
    }, 800);
  }

  function confirmCode() {
    if (s.modal === "admin") {
      if (setAdminSession(s.code)) return onSuccess();
      s.codeErr = "Código de acceso inválido.";
    } else {
      const need = s.pending?.empresa ? AGENT_CODES[s.pending.empresa] : undefined;
      if (need && s.code === need) return onSuccess();
      s.codeErr = "Código de acceso inválido para tu empresa.";
    }
    draw();
  }

  root.onclick = e => {
    const t = e.target as HTMLElement;
    const mode = t.closest<HTMLElement>("[data-mode]")?.dataset.mode as Mode | undefined;
    const role = t.closest<HTMLElement>("[data-role]")?.dataset.role as "cliente" | "agente" | undefined;
    if (t.closest("#back")) return onBack();
    if (mode) { s.mode = mode; s.errs = {}; return draw(); }
    if (role) { s.role = role; s.errs = {}; return draw(); }
    if (t.closest("#toggle-pw")) { s.show = !s.show; return draw(); }
    if (t.closest("#m-cancel")) { logout(); s.modal = null; s.codeErr = ""; return draw(); }
    if (t.closest("#m-ok")) return confirmCode();
  };
  root.oninput = e => {
    const t = e.target as HTMLInputElement;
    if (t.id === "code") s.code = t.value;
    else if (t.id === "remember") s.remember = t.checked;
    else if (t.id in s) (s as Record<string, unknown>)[t.id] = t.value;
  };
  root.onsubmit = e => { e.preventDefault(); submit(); };
  root.onkeydown = e => { if (e.key === "Enter" && (e.target as HTMLElement).id === "code") confirmCode(); };
  draw();
}
