// Calificaciones de eventos: cada persona puede calificar 1-5 estrellas (una vez por evento, editable).
// La calificación que se muestra mezcla la calificación inicial del evento con los votos (ver events.mjs).
// Los administradores pueden cambiar la calificación por defecto y borrar los votos de un evento.
//
// ⚠ Quién llama se toma de las cabeceras x-user-id / x-user-role que manda la página. Mientras los usuarios
//   vivan en el navegador (sin sesiones en el servidor) esto NO es seguro: cualquiera podría falsificarlas.
//   Cuando los usuarios pasen a Neon con sesiones, solo hay que cambiar actor() para leer la sesión.
import { ALL_SQL, toItem, shownRating } from "./events.mjs";

const wrap = fn => (req, res) =>
  fn(req, res).catch(err => {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  });
const fail = (status, message) => Object.assign(new Error(message), { status });

const actor = req => ({ id: String(req.get("x-user-id") ?? "").slice(0, 100), role: String(req.get("x-user-role") ?? "") });
const needUser = req => { const a = actor(req); if (!a.id) throw fail(401, "Inicia sesión para calificar."); return a; };
const needAdmin = req => { const a = actor(req); if (a.role !== "admin") throw fail(403, "Solo los administradores pueden hacer esto."); return a; };

export async function registerRatings(app, pool) {
  // Se crea sola la primera vez (no hay que ejecutar nada más)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_ratings (
      event_id   INTEGER  NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      user_id    TEXT     NOT NULL,
      stars      SMALLINT NOT NULL CHECK (stars BETWEEN 1 AND 5),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (event_id, user_id)
    )`);

  const eventRow = async id => {
    const { rows: [row] } = await pool.query(`${ALL_SQL} WHERE id = $1`, [id]);
    if (!row) throw fail(404, "Evento no existe");
    return row;
  };
  const idOf = req => { const id = Number(req.params.id); if (!Number.isInteger(id)) throw fail(400, "Evento no válido"); return id; };

  // Resumen: promedio, reparto por estrellas y, si hay sesión, la calificación de esa persona
  app.get("/api/events/:id/ratings", wrap(async (req, res) => {
    const id = idOf(req), a = actor(req), row = await eventRow(id);
    const { rows } = await pool.query(`SELECT stars, COUNT(*)::int AS n FROM event_ratings WHERE event_id = $1 GROUP BY stars`, [id]);
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of rows) dist[r.stars] = r.n;
    const count = row.rating_count, sum = row.rating_sum, base = Number(row.rating);
    const { rows: [mine] } = a.id ? await pool.query(`SELECT stars FROM event_ratings WHERE event_id = $1 AND user_id = $2`, [id, a.id]) : { rows: [] };
    res.json({
      base, count, dist,
      average: count ? Math.round((sum / count) * 10) / 10 : null,
      rating: shownRating(base, count, sum),
      mine: mine?.stars ?? null,
      canRate: Boolean(a.id) && a.id !== row.created_by,
    });
  }));

  // Calificar (o cambiar mi calificación)
  app.put("/api/events/:id/rating", wrap(async (req, res) => {
    const id = idOf(req), a = needUser(req), row = await eventRow(id);
    const stars = Number(req.body?.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw fail(400, "La calificación debe ser de 1 a 5 estrellas.");
    if (a.id === row.created_by) throw fail(403, "No puedes calificar un evento que tú creaste.");
    await pool.query(
      `INSERT INTO event_ratings (event_id, user_id, stars) VALUES ($1, $2, $3)
       ON CONFLICT (event_id, user_id) DO UPDATE SET stars = EXCLUDED.stars, updated_at = now()`, [id, a.id, stars]);
    res.json(toItem(await eventRow(id)));
  }));

  // Quitar mi calificación
  app.delete("/api/events/:id/rating", wrap(async (req, res) => {
    const id = idOf(req), a = needUser(req);
    await eventRow(id);
    await pool.query(`DELETE FROM event_ratings WHERE event_id = $1 AND user_id = $2`, [id, a.id]);
    res.json(toItem(await eventRow(id)));
  }));

  // Admin: cambiar la calificación por defecto (inicial) del evento
  app.put("/api/events/:id/default-rating", wrap(async (req, res) => {
    needAdmin(req);
    const id = idOf(req); await eventRow(id);
    const value = Number(req.body?.value);
    if (!Number.isFinite(value) || value < 0 || value > 5) throw fail(400, "La calificación por defecto debe estar entre 0 y 5.");
    await pool.query(`UPDATE events SET rating = $2 WHERE id = $1`, [id, Math.round(value * 10) / 10]);
    res.json(toItem(await eventRow(id)));
  }));

  // Admin: borrar todos los votos de usuarios de un evento
  app.delete("/api/events/:id/ratings", wrap(async (req, res) => {
    needAdmin(req);
    const id = idOf(req); await eventRow(id);
    await pool.query(`DELETE FROM event_ratings WHERE event_id = $1`, [id]);
    res.json(toItem(await eventRow(id)));
  }));
}
