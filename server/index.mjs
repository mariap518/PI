import express from "express";
import { pool } from "./db.mjs";
import { registerEvents } from "./events.mjs";

const app = express();
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT now() AS now, current_database() AS database");
    res.json({ ok: true, ...rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

registerEvents(app, pool);

app.listen(3001, () => console.log("API en http://localhost:3001"));
