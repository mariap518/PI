/** Modos de color: claro (por defecto), oscuro y exótico. Se guarda la elección en el navegador. */
export type Theme = "light" | "dark" | "exotic";

export const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: "light", label: "Modo claro", icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" },
  { id: "dark", label: "Modo oscuro", icon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" },
  { id: "exotic", label: "Modo exótico", icon: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" },
];

export const MOON = THEMES[1].icon;
const KEY = "sixevent_theme";
const valid = (t: unknown): t is Theme => THEMES.some(x => x.id === t);

export function getTheme(): Theme {
  try { const t = localStorage.getItem(KEY); if (valid(t)) return t; } catch { /* sin almacenamiento */ }
  return "light";
}

/** Aplica el modo al documento. Con `animate` los colores cambian suavemente. */
export function setTheme(t: Theme, animate = false) {
  const root = document.documentElement;
  if (animate) { root.classList.add("theme-anim"); window.setTimeout(() => root.classList.remove("theme-anim"), 450); }
  root.dataset.theme = t;
  try { localStorage.setItem(KEY, t); } catch { /* sin almacenamiento */ }
}

export const initTheme = () => { document.documentElement.dataset.theme = getTheme(); };
