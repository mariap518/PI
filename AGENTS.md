# SIX EVENT

Proyecto Integrador de cuarto semestre: plataforma web de venta de boletas para eventos corporativos.

## Stack
- TypeScript + esbuild (frontend sin framework), servidor Express + `pg` y base de datos Neon (PostgreSQL). Los eventos viven en Neon; la sesión, usuarios y tema se guardan en `localStorage`.
- Gestor de paquetes: pnpm (ver `.mise.toml` para versiones de Node y pnpm).

## Estructura
- `index.html` – página; carga `app/main.js` y `app/main.css` y necesita la API para mostrar eventos.
- `app/` – código compilado (se genera con `pnpm build` y SE SUBE a git para que el proyecto abra sin instalar nada).
- `src/main.ts` – página principal y rutas por hash (`#/login`, `#/perfil`, ...). `src/styles.css` – estilos globales.
- `src/services/` – lógica y datos: `db.ts` (eventos), `geo.ts` (ciudades), `auth.ts` (usuarios y sesión), `points.ts` (puntos), `ticket.ts` (boletas con QR).
- `src/views/` – pantallas: `login.ts`, `profile.ts`, `screens.ts` (reserva), `pages.ts` (páginas estáticas), `dashboard.ts` (admin).
- `src/assets/` – imágenes importadas desde el código. `public/` – archivos estáticos (favicon).
- `server/` – API Express (`index.mjs`, `events.mjs`) y scripts de base de datos (`migrate.mjs`, `smoke.mjs`). `neon.ts` – configuración de Neon. `vite.config.ts` – servidor de desarrollo con proxy `/api`.
- `docs/` – documentación del proyecto.
- Secretos: `DATABASE_URL` va en `.env.local` (ignorado por git). **Nunca** subir `.env*`, `.neon` ni `node_modules/`.

## Comandos
`pnpm install` · `pnpm server` · `pnpm watch` · `pnpm dev` · `pnpm typecheck` · `pnpm build` (después de cambiar `src/`, correr `pnpm build` y commitear `app/`)

## Convenciones
- Idioma de la interfaz y comentarios: español.
- No commitear `node_modules/`, `dist/` ni archivos `.DS_Store`.
