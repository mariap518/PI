IMPORTANTE, LEER!!

Proyecto Integrador de Cuarto semestre
Consiste en una página de eventos con los siguientes requisitos:

•	Iniciar sesión de usuarios en la plataforma (con un método sencillo).
•	Registrar clientes y agentes en la plataforma.
•	Administrar eventos y reservas.
•	Administrar el estado de los eventos y reservas.
•	Consultar la información de eventos y reservas.
•	Vistas personalizadas para cada tipo de usuario.
•	Mostrar reportes en un Dashboard solo para administradores.

Por favor mantener la organización, estar pendientes de los commits y asumiendo que todos sabemos usar git SIEMPRE hacer
un pull antes de intentar subir cualquier cosa para evitar conflictos, tambien evitar trabajar dos personas al tiempo en una misma rama




---

## Cómo ejecutar

Los eventos se guardan en una base de datos **Neon (PostgreSQL)** y la página los pide a un pequeño servidor (`server/`). Por eso hacen falta tres cosas:

1. **Instalar:** `pnpm install`
2. **Credenciales:** crear un archivo `.env.local` en la raíz con `DATABASE_URL` y `DATABASE_URL_UNPOOLED` (los pide el equipo; **nunca** se suben al repositorio).
3. **Correr** (en tres terminales):

```bash
pnpm server    # API en http://localhost:3001 (conecta con Neon)
pnpm watch     # recompila src/ en app/ cada vez que se guarda
pnpm dev       # abre la página en http://localhost:5173 (redirige /api al servidor)
```

Otros comandos: `pnpm migrate` (crea las tablas y datos iniciales), `pnpm smoke` (prueba rápida de la API), `pnpm typecheck` y `pnpm build` (genera `app/`; hacer commit de `app/` después de cambiar `src/`).

> Si se abre `index.html` con doble clic, la página no tiene servidor y muestra el mensaje "No se pudieron cargar los eventos".

## Tecnologías
TypeScript + esbuild (frontend sin framework), Express + `pg` (servidor) y Neon PostgreSQL (base de datos).

## Estructura

```
index.html        página principal (carga app/main.js y app/main.css)
app/              código compilado del frontend
src/main.ts       página principal y rutas
src/services/     lógica y datos (db, auth, geo, points, ticket, categories, seed, theme)
src/views/        pantallas (login, profile, screens, pages, dashboard)
src/assets/       imágenes usadas desde el código
public/           archivos estáticos (favicon)
server/           API Express y scripts de base de datos
neon.ts           configuración de Neon
vite.config.ts    servidor de desarrollo (redirige /api a localhost:3001)
docs/             documentación
```
