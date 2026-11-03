import { pool } from "./db.mjs";

const inserted = await pool.query(
  "INSERT INTO events (title, category, city, date, price) VALUES ($1,$2,$3,$4,$5) RETURNING id, title",
  ["Evento de prueba", "Prueba", "Cali", "2027-01-01", 1000]
);
const id = inserted.rows[0].id;

const read = await pool.query("SELECT id, title FROM events WHERE id = $1", [id]);
console.log("Escritura y lectura:", read.rows[0]);

await pool.query("DELETE FROM events WHERE id = $1", [id]);
console.log("Borrado OK");

await pool.end();