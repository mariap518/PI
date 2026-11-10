// CRUD de eventos sobre Postgres. Columnas clave + `data` (JSONB) con el resto del evento.
const ALL_SQL = `SELECT id, title, category, city, to_char(date,'YYYY-MM-DD') AS date,
  price, img, rating, created_by, data,
  (SELECT COUNT(*)::int FROM event_ratings r WHERE r.event_id = events.id) AS rating_count,
  (SELECT COALESCE(SUM(stars), 0)::int FROM event_ratings r WHERE r.event_id = events.id) AS rating_sum
  FROM events`;

// La calificación inicial del evento pesa como 5 votos; así un solo voto no tumba (ni sube) el promedio de golpe.
export const RATING_PRIOR = 5;
export const shownRating = (base, count, sum) =>
  count ? Math.round(((base * RATING_PRIOR + sum) / (RATING_PRIOR + count)) * 10) / 10 : base;
export { ALL_SQL };

const wrap = fn => (req, res) =>
  fn(req, res).catch(err => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });

export function toItem(row) {
  const { id, title, category, city, date, price, img, rating, created_by, data, rating_count, rating_sum } = row;
  const base = Number(rating), n = Number(rating_count ?? 0);
  return { ...data, id, title, category, city, date, price, img,
    rating: shownRating(base, n, Number(rating_sum ?? 0)),   // la que se muestra (mezcla inicial + votos)
    ratingBase: base,                                        // la calificación inicial (la cambia un admin)
    ratingCount: n,                                          // votos reales
    createdBy: created_by };
}

function splitItem(item) {
  const { id, title, category, city, date, price, img, rating, createdBy, ratingBase, ratingCount, ...rest } = item;
  return {
    title, category, city, date,
    price: Math.round(Number(price)),
    img: img ?? null,
    rating: rating ?? 5.0,
    created_by: createdBy ?? "system",
    data: rest,
  };
}

export function registerEvents(app, pool) {
  app.get("/api/events", wrap(async (_req, res) => {
    const { rows } = await pool.query(`${ALL_SQL} ORDER BY date, id`);
    res.json(rows.map(toItem));
  }));

  app.post("/api/events", wrap(async (req, res) => {
    const { ratingBase: _b, ratingCount: _c, ...body } = req.body ?? {};
    const r = Number(body.rating);
    body.rating = Number.isFinite(r) && r >= 0 && r <= 5 ? Math.round(r * 10) / 10 : undefined;   // calificación inicial (por defecto 5.0)
    const s = splitItem(body);
    const { rows } = await pool.query(
      `INSERT INTO events (title, category, city, date, price, img, rating, created_by, data)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [s.title, s.category, s.city, s.date, s.price, s.img, s.rating, s.created_by, s.data]
    );
    const { rows: [row] } = await pool.query(`${ALL_SQL} WHERE id = $1`, [rows[0].id]);
    res.status(201).json(toItem(row));
  }));

  app.put("/api/events/:id", wrap(async (req, res) => {
    const id = Number(req.params.id);
    const { rows: [cur] } = await pool.query(`${ALL_SQL} WHERE id = $1`, [id]);
    if (!cur) return res.status(404).json({ error: "Evento no existe" });
    // Las calificaciones no se editan desde aquí: tienen sus propias rutas (server/ratings.mjs)
    const { rating: _r, ratingBase: _b, ratingCount: _c, ...body } = req.body ?? {};
    const s = splitItem({ ...toItem(cur), rating: Number(cur.rating), ...body, id });
    await pool.query(
      `UPDATE events SET title=$2, category=$3, city=$4, date=$5, price=$6, img=$7,
         rating=$8, created_by=$9, data=$10 WHERE id=$1`,
      [id, s.title, s.category, s.city, s.date, s.price, s.img, s.rating, s.created_by, s.data]
    );
    const { rows: [row] } = await pool.query(`${ALL_SQL} WHERE id = $1`, [id]);
    res.json(toItem(row));
  }));

  app.delete("/api/events/:id", wrap(async (req, res) => {
    const { rowCount } = await pool.query("DELETE FROM events WHERE id = $1", [Number(req.params.id)]);
    if (!rowCount) return res.status(404).json({ error: "Evento no existe" });
    res.status(204).end();
  }));

  // Descuenta boletas dentro de una transacción con fila bloqueada (evita ventas dobles)
  app.post("/api/events/:id/consume", wrap(async (req, res) => {
    const id = Number(req.params.id);
    const qty = Math.max(0, Math.floor(Number(req.body.qty) || 0));
    const category = req.body.category;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows: [cur] } = await client.query(`${ALL_SQL} WHERE id = $1 FOR UPDATE`, [id]);
      if (!cur) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Evento no existe" });
      }
      const item = toItem(cur);
      if (item.availableTickets !== undefined) item.availableTickets = Math.max(0, item.availableTickets - qty);
      const c = item.ticketCategories?.find(x => x.name === category);
      if (c && c.available !== undefined) c.available = Math.max(0, c.available - qty);
      await client.query("UPDATE events SET data = $2 WHERE id = $1", [id, splitItem(item).data]);
      await client.query("COMMIT");
      res.json(item);
    } catch (err) {
      await client.query("ROLLBACK").catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  }));
}
