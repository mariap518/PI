export interface Tier { name: string; min: number; color: string; fg: string }
/** Los niveles se calculan con los puntos acumulados en total (canjear no te baja de nivel). 1 punto = $1.000 COP. */
export const TIERS: Tier[] = [
  { name: "Bronce", min: 0, color: "#B87333", fg: "#fff" },
  { name: "Plata", min: 5000, color: "#C0C6CE", fg: "#1E3A5F" },
  { name: "Oro", min: 25000, color: "#E0B22E", fg: "#1E3A5F" },
  { name: "Platino", min: 100000, color: "#8FB3DE", fg: "#1E3A5F" },
  { name: "Diamante", min: 500000, color: "#4FB6E8", fg: "#fff" },
  { name: "Plus", min: 2000000, color: "#1E3A5F", fg: "#F7ECC7" },
];
export const REWARDS = [
  { id: "d10", label: "Cupón del 10% de descuento", percent: 10, cost: 200 },
  { id: "d25", label: "Cupón del 25% de descuento", percent: 25, cost: 600 },
  { id: "d50", label: "Cupón del 50% de descuento", percent: 50, cost: 1500 },
];
export function tierInfo(lifetime: number) {
  let i = 0; TIERS.forEach((t, k) => { if (lifetime >= t.min) i = k; });
  const tier = TIERS[i], next = TIERS[i + 1] ?? null;
  return { tier, next, toNext: next ? next.min - lifetime : 0, pct: next ? Math.min(100, ((lifetime - tier.min) / (next.min - tier.min)) * 100) : 100 };
}
