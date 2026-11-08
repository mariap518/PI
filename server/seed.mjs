// Siembra eventos de ejemplo (3 por categoría) usando la API local.
// Uso:  npm run seed            (solo si no hay eventos)
//       npm run seed -- --force (inserta aunque ya existan)
// Requiere que el servidor esté corriendo (npm run server).
import { readFile } from "node:fs/promises";

const API = "http://localhost:3001/api/events";
const force = process.argv.includes("--force");

const existing = await (await fetch(API)).json();
if (existing.length > 0 && !force) {
  console.log(`Ya hay ${existing.length} eventos. No se siembra nada (usa --force para insertar igual).`);
  process.exit(0);
}

const events = JSON.parse(await readFile("server/seed-events.json", "utf8"));
let ok = 0;
for (const ev of events) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ev),
  });
  if (res.ok) ok++;
  else console.error("Falló:", ev.title, await res.text());
}
console.log(`Sembrados ${ok} de ${events.length} eventos.`);
