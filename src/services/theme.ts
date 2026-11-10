import "./theme-lock.css";
import { getCurrentUser } from "./auth";

/** Modos de color: claro (por defecto), oscuro y exótico (solo con sesión iniciada). Se guarda la elección en el navegador. */
export type Theme = "light" | "dark" | "exotic" | "secret";

export const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: "light", label: "Modo claro", icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" },
  { id: "dark", label: "Modo oscuro", icon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" },
  { id: "exotic", label: "Modo exótico", icon: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" },
];

/** Modo secreto: solo aparece y se puede activar con una cuenta de administrador */
export const SECRET = { id: "secret" as Theme, label: "Modo secreto", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" };
const isAdmin = () => getCurrentUser()?.role === "admin";
const isLoggedIn = () => getCurrentUser() !== null;
export const LOCK = "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4";

export interface ThemeItem { id: Theme; label: string; icon: string; locked: boolean }
/** Opciones del menú: el exótico aparece bloqueado hasta iniciar sesión; el secreto solo lo ve un admin. */
export const themeItems = (): ThemeItem[] => [
  ...THEMES.map(t => ({ ...t, locked: t.id === "exotic" && !isLoggedIn() })),
  ...(isAdmin() ? [{ ...SECRET, locked: false }] : []),
];
/** ¿Se puede usar este modo con la sesión actual? */
const allowed = (t: Theme) => (t !== "secret" || isAdmin()) && (t !== "exotic" || isLoggedIn());

export const MOON = THEMES[1].icon;
const KEY = "sixevent_theme";
const valid = (t: unknown): t is Theme => THEMES.some(x => x.id === t) || t === SECRET.id;

/** Modo en uso: si el guardado es el exótico sin sesión, o el secreto sin un admin, se usa el claro */
export function getTheme(): Theme {
  try { const t = localStorage.getItem(KEY); if (valid(t) && allowed(t)) return t; } catch { /* sin almacenamiento */ }
  return "light";
}

/** Aplica el modo al documento. Con `animate` los colores cambian suavemente. */
export function setTheme(t: Theme, animate = false) {
  if (!allowed(t)) t = "light";
  const root = document.documentElement;
  if (animate) { root.classList.add("theme-anim"); window.setTimeout(() => root.classList.remove("theme-anim"), 450); }
  root.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* sin almacenamiento */ }
}

/** Aplica el modo guardado (se llama al iniciar y al cambiar de pantalla, por si cambió la sesión) */
export const initTheme = () => { document.documentElement.dataset.theme = getTheme(); };
