import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // pooled: para la app
  max: 5,
});