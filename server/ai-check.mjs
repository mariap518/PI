// Comprueba tu clave de Gemini:  node server/ai-check.mjs
// Muestra los modelos que tu clave puede usar y prueba el modelo configurado (GEMINI_MODEL).
import { config } from "dotenv";
config({ path: ".env.local" });

const key = process.env.GEMINI_API_KEY?.trim();
const base = (process.env.GEMINI_BASE_URL?.trim() || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";

if (!key) {
  console.error('✖ No encuentro GEMINI_API_KEY.\n  Agrega esta línea a tu archivo .env.local (junto a DATABASE_URL):\n  GEMINI_API_KEY="tu_clave"\n  La clave se crea en https://aistudio.google.com/app/apikey');
  process.exit(1);
}
console.log(`Clave: ${key.slice(0, 4)}…${key.slice(-3)} (${key.length} caracteres)   Modelo configurado: ${model}`);

const call = async (path, init) => {
  const r = await fetch(base + path, { ...init, headers: { "x-goog-api-key": key, "content-type": "application/json" }, signal: AbortSignal.timeout(20_000) });
  const text = await r.text(); let json; try { json = JSON.parse(text); } catch { json = null; }
  return { ok: r.ok, status: r.status, json, text };
};

try {
  const list = await call("/models?pageSize=200");
  if (!list.ok) throw Object.assign(new Error(list.json?.error?.message ?? list.text.slice(0, 200)), { status: list.status });
  const names = (list.json.models ?? []).filter(m => m.supportedGenerationMethods?.includes("generateContent")).map(m => m.name.replace(/^models\//, ""));
  const gemini = names.filter(n => /^gemini-/.test(n) && !/(image|tts|embedding|live|audio|robotics|computer)/.test(n));
  console.log(`\nModelos de texto disponibles con tu clave (${gemini.length}):`);
  console.log(gemini.slice(0, 25).map(n => `  ${n === model ? "→" : " "} ${n}`).join("\n"));
  if (!names.includes(model)) console.log(`\n⚠ El modelo «${model}» no está en la lista. Elige uno de arriba y ponlo en .env.local:\n  GEMINI_MODEL="nombre-del-modelo"`);

  const t0 = Date.now();
  const r = await call(`/models/${encodeURIComponent(model)}:generateContent`, { method: "POST", body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Responde solo con la palabra: listo" }] }], generationConfig: { maxOutputTokens: 100 } }) });
  if (!r.ok) throw Object.assign(new Error(r.json?.error?.message ?? r.text.slice(0, 200)), { status: r.status });
  const answer = (r.json.candidates?.[0]?.content?.parts ?? []).map(p => p.text).join("").trim();
  console.log(`\n✔ Gemini respondió en ${Date.now() - t0} ms: «${answer}»`);
  console.log("  Todo listo: reinicia el servidor (npm run server) y prueba el chat.");
} catch (e) {
  const hints = { 400: "La clave parece no ser válida o la petición está mal formada.", 403: "Clave sin permiso (revisa que sea de AI Studio y que no tenga restricciones).", 404: "Ese modelo no existe para tu clave: usa uno de la lista.", 429: "Se acabó el cupo gratuito por ahora. Espera un rato o hasta mañana." };
  console.error(`\n✖ Falló (${e.status ?? "sin respuesta"}): ${e.message}${hints[e.status] ? "\n  → " + hints[e.status] : ""}`);
  process.exit(1);
}
