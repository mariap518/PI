import qrcode from "qrcode-generator";

export interface TicketData { id: string; event: string; date: string; tickets: number; total: number; category: string; venue: string }
const W = 1400, H = 560, SX = 1010, NAVY = "#1E3A5F", BLUE = "#3B6EA5", CREAM = "#F7ECC7";
const FONT = "'Work Sans', ui-sans-serif, system-ui, sans-serif";

/** QR como SVG (sin internet) */
export function qrSvg(text: string): string {
  const q = qrcode(0, "M"); q.addData(text); q.make();
  return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
}

function hex(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath();
  for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 2; c[i ? "lineTo" : "moveTo"](x + r * Math.cos(a), y + r * Math.sin(a)); }
  c.closePath();
}
function wrap(c: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const lines: string[] = []; let cur = "";
  for (const w of text.split(" ")) {
    if (c.measureText((cur + " " + w).trim()).width > maxW && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s?\S*$/, "") + "…"; }
  return lines;
}

/** Dibuja el modelo único de boleta SIX EVENT (1400×560) */
export function paintTicket(c: CanvasRenderingContext2D, r: TicketData, holder: string) {
  const sp = (v: string) => { try { (c as unknown as { letterSpacing: string }).letterSpacing = v; } catch { /* sin soporte */ } };
  c.clearRect(0, 0, W, H);
  c.save();
  c.beginPath(); c.roundRect(0, 0, W, H, 28); c.clip();
  const g = c.createLinearGradient(0, 0, SX, H); g.addColorStop(0, NAVY); g.addColorStop(1, BLUE);
  c.fillStyle = g; c.fillRect(0, 0, SX, H);
  c.fillStyle = CREAM; c.fillRect(SX, 0, W - SX, H);
  c.strokeStyle = "rgba(247,236,199,0.07)"; c.lineWidth = 3;
  for (const [x, y, s] of [[820, 90, 120], [930, 270, 90], [760, 430, 150], [980, 500, 60]]) { hex(c, x, y, s); c.stroke(); }
  c.restore();

  // muescas y línea de corte
  c.save(); c.globalCompositeOperation = "destination-out";
  for (const y of [0, H]) { c.beginPath(); c.arc(SX, y, 26, 0, Math.PI * 2); c.fill(); }
  c.restore();
  c.save(); c.setLineDash([10, 10]); c.strokeStyle = "rgba(30,58,95,0.35)"; c.lineWidth = 2;
  c.beginPath(); c.moveTo(SX, 40); c.lineTo(SX, H - 40); c.stroke(); c.restore();

  // cabecera
  c.strokeStyle = CREAM; c.lineWidth = 4; hex(c, 92, 90, 38); c.stroke();
  c.fillStyle = CREAM; c.textBaseline = "middle"; c.textAlign = "center"; c.font = `700 40px ${FONT}`; c.fillText("6", 92, 92);
  c.textAlign = "left"; c.font = `700 34px ${FONT}`; sp("6px"); c.fillText("SIX EVENT", 150, 90);
  c.textAlign = "right"; c.font = `600 17px ${FONT}`; c.fillStyle = "rgba(247,236,199,0.75)"; sp("4px"); c.fillText("BOLETA DE ENTRADA", SX - 60, 90);
  sp("0px"); c.fillStyle = "rgba(247,236,199,0.25)"; c.fillRect(60, 144, SX - 120, 2);

  // categoría + título
  c.textAlign = "left"; c.font = `700 17px ${FONT}`; sp("2px");
  const cat = r.category.toUpperCase(), cw = c.measureText(cat).width + 36;
  c.fillStyle = CREAM; c.beginPath(); c.roundRect(60, 172, cw, 38, 19); c.fill();
  c.fillStyle = NAVY; c.fillText(cat, 78, 192); sp("0px");
  c.fillStyle = "#fff"; c.font = `700 52px ${FONT}`;
  wrap(c, r.event, SX - 130, 2).forEach((l, i) => c.fillText(l, 60, 262 + i * 62));

  // datos
  const cols: [string, string, number][] = [["FECHA", r.date, 60], ["CIUDAD", r.venue, 330], ["ENTRADAS", String(r.tickets), 580], ["TOTAL PAGADO", "$ " + r.total.toLocaleString("es-CO"), 740]];
  for (const [l, v, x] of cols) {
    c.fillStyle = "rgba(247,236,199,0.6)"; c.font = `600 14px ${FONT}`; sp("2px"); c.fillText(l, x, 392); sp("0px");
    c.fillStyle = "#fff"; c.font = `700 26px ${FONT}`; c.fillText(v, x, 428);
  }
  c.fillStyle = "rgba(247,236,199,0.6)"; c.font = `600 14px ${FONT}`; sp("2px"); c.fillText("TITULAR", 60, 492); sp("0px");
  c.fillStyle = "#fff"; c.font = `600 24px ${FONT}`; c.fillText(holder.length > 34 ? holder.slice(0, 33) + "…" : holder, 60, 520);
  c.textAlign = "right"; c.fillStyle = CREAM; c.font = `600 20px ${FONT}`; c.fillText("N.º " + r.id, SX - 60, 520);

  // talón
  const cx = (SX + W) / 2;
  c.textAlign = "center"; c.fillStyle = NAVY; c.font = `600 15px ${FONT}`; sp("4px"); c.fillText("ADMITE", cx, 110); sp("0px");
  c.font = `700 150px ${FONT}`; c.fillText(String(r.tickets), cx, 225);
  c.font = `600 17px ${FONT}`; sp("3px"); c.fillText(r.tickets === 1 ? "PERSONA" : "PERSONAS", cx, 300); sp("0px");
  let x = SX + 55, i = 0;
  c.fillStyle = NAVY;
  while (x < W - 55) { const w = 2 + ((r.id.charCodeAt(i % r.id.length) + i * 7) % 5); if (i % 2 === 0) c.fillRect(x, 340, w, 96); x += w + 2; i++; }
  c.font = `500 15px ui-monospace, Consolas, monospace`; sp("2px"); c.fillText(r.id, cx, 462); sp("0px");
  c.fillStyle = "rgba(30,58,95,0.65)"; c.font = `500 14px ${FONT}`;
  c.fillText("Presenta el QR de tu perfil", cx, 506); c.fillText("junto a esta boleta", cx, 526);
}

/** Genera y descarga la boleta como imagen PNG */
export async function downloadTicket(r: TicketData, holder: string) {
  try { await Promise.all([document.fonts.load(`700 40px 'Work Sans'`), document.fonts.load(`600 20px 'Work Sans'`)]); } catch { /* usa fuente de respaldo */ }
  const cv = document.createElement("canvas"); cv.width = W * 2; cv.height = H * 2;
  const c = cv.getContext("2d")!; c.scale(2, 2);
  paintTicket(c, r, holder);
  cv.toBlob(b => {
    if (!b) return;
    const url = URL.createObjectURL(b), a = document.createElement("a");
    a.href = url; a.download = `boleta_${r.id}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}
