/** Categorías de eventos y su paleta (tonos suaves que acompañan el azul marino y el crema de la marca).
 *  bg  = fondo de la tarjeta · tag = etiqueta/chip · el texto siempre es negro. */
export interface Cat { name: string; plural: string; bg: string; tag: string }

export const CATEGORIES: Cat[] = [
  { name: "Conferencia", plural: "Conferencias", bg: "#DCE5F1", tag: "#A9BFDD" },
  { name: "Congreso",    plural: "Congresos",    bg: "#DDEBE1", tag: "#A9CDB6" },
  { name: "Exposición",  plural: "Exposiciones", bg: "#F6E5D3", tag: "#E9C29B" },
  { name: "Foro",        plural: "Foros",        bg: "#E6E1F2", tag: "#C4B9E2" },
  { name: "Gala",        plural: "Galas",        bg: "#F3DEE4", tag: "#E2AFBF" },
  { name: "Seminario",   plural: "Seminarios",   bg: "#D9EDEA", tag: "#A0D0C9" },
  { name: "Feria",       plural: "Ferias",       bg: "#F5EBC8", tag: "#E6D18A" },
  { name: "Taller",      plural: "Talleres",     bg: "#EADFD1", tag: "#CDB598" },
  { name: "Simposio",    plural: "Simposios",    bg: "#E1E4EA", tag: "#B7BFCD" },
  { name: "Encuentro",   plural: "Encuentros",   bg: "#E6EED2", tag: "#C1D68F" },
  { name: "Concierto",   plural: "Conciertos",   bg: "#F1DCEB", tag: "#DDA9CB" },
  { name: "Experiencia", plural: "Experiencias", bg: "#F8DBD2", tag: "#EDA895" },
  { name: "Deporte",     plural: "Deportes",     bg: "#D6EBF4", tag: "#94CDE4" },
];

/** Categorías que se muestran como chips bajo el buscador */
export const POPULAR = ["Conferencia", "Congreso", "Exposición", "Gala", "Foro", "Encuentro", "Concierto", "Experiencia", "Deporte"];

const FALLBACK = { bg: "#EEF0F3", tag: "#C9CED6" };
const find = (name: string) => CATEGORIES.find(c => c.name.toLowerCase() === (name ?? "").trim().toLowerCase());

export const catNames = () => CATEGORIES.map(c => c.name);
export const catPlural = (name: string) => find(name)?.plural ?? name;
/** Variables CSS inline para pintar un elemento con los colores de su categoría */
export const catStyle = (name: string) => { const c = find(name) ?? FALLBACK; return `--cat-bg:${c.bg};--cat-tag:${c.tag}`; };
