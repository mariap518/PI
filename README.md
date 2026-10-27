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

**Para ver el proyecto (profesor):** descargar el repositorio y abrir `index.html` con doble clic en el navegador. No hace falta instalar nada (se necesita internet para las fuentes y las fotos de los eventos).

**Para desarrollar:**

```bash
pnpm install
pnpm dev         # servidor en http://localhost:5173
pnpm typecheck   # revisar tipos
pnpm build       # regenera la carpeta app/ (hacer commit de app/ después)
```

> `app/` contiene el código ya compilado que usa `index.html`. Después de cambiar algo en `src/`, hay que correr `pnpm build` y subir también `app/`, o el cambio no se verá al abrir `index.html`.

## Tecnologías
TypeScript + esbuild (sin framework). Los datos se guardan en `localStorage` (sin backend).

## Estructura

```
index.html        página que se abre en el navegador
app/              código compilado (main.js, main.css, assets/)
src/main.ts       página principal y rutas
src/services/     lógica y datos (db, auth, geo, points, ticket)
src/views/        pantallas (login, profile, screens, pages, dashboard)
src/assets/       imágenes usadas desde el código
public/           archivos estáticos (favicon)
docs/             documentación
```
