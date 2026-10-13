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

```bash
pnpm install
pnpm dev         # servidor de desarrollo
pnpm typecheck   # revisar tipos
pnpm build       # compilar para producción (carpeta dist/)
```

## Tecnologías
TypeScript + Vite. Los datos se guardan en `localStorage` (sin backend).

## Estructura

```
index.html        entrada de Vite
src/main.ts       página principal y rutas
src/services/     lógica y datos (db, auth, geo, points, ticket)
src/views/        pantallas (login, profile, screens, pages, dashboard)
src/assets/       imágenes usadas desde el código
public/           archivos estáticos (favicon)
docs/             documentación
```
