import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    date DATE NOT NULL,
    price INTEGER NOT NULL,
    img TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0,
    created_by TEXT DEFAULT 'system',
    data JSONB NOT NULL DEFAULT '{}'::jsonb
  );

  CREATE TABLE IF NOT EXISTS app_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('cliente','agente','admin')),
    password_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`);

await client.end();
console.log("Migración OK");