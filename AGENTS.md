# SIX EVENT

Proyecto Integrador de cuarto semestre: plataforma web de venta de boletas para eventos corporativos.

## Stack
- TypeScript + esbuild (sin framework). Los datos se guardan en `localStorage` (no hay backend).
- Gestor de paquetes: pnpm (ver `.mise.toml` para versiones de Node y pnpm).

## Estructura
- `index.html` – página que se abre en el navegador; carga `app/main.js` y `app/main.css`.
- `app/` – código compilado (se genera con `pnpm build` y SE SUBE a git para que el proyecto abra sin instalar nada).
- `src/main.ts` – página principal y rutas por hash (`#/login`, `#/perfil`, ...). `src/styles.css` – estilos globales.
- `src/services/` – lógica y datos: `db.ts` (eventos), `geo.ts` (ciudades), `auth.ts` (usuarios y sesión), `points.ts` (puntos), `ticket.ts` (boletas con QR).
- `src/views/` – pantallas: `login.ts`, `profile.ts`, `screens.ts` (reserva), `pages.ts` (páginas estáticas), `dashboard.ts` (admin).
- `src/assets/` – imágenes importadas desde el código. `public/` – archivos estáticos (favicon).
- `docs/` – documentación del proyecto.

## Comandos
`pnpm install` · `pnpm dev` · `pnpm typecheck` · `pnpm build` (después de cambiar `src/`, correr `pnpm build` y commitear `app/`)

## Convenciones
- Idioma de la interfaz y comentarios: español.
- No commitear `node_modules/`, `dist/` ni archivos `.DS_Store`.
