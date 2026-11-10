/** Texto del manual de usuario. Lo usan el panel de ayuda (ts/help.ts) y el chat con IA (server/chat.mjs),
 *  así que solo hay que editarlo aquí. Mantén este archivo con sintaxis TypeScript "borrable" (sin enums). */
export interface Tema { id: string; q: string; html: string }
export interface Seccion { titulo: string; temas: Tema[] }
const L = (hash: string, label: string) => `<a href="${hash}">${label}</a>`;

export const MANUAL: Seccion[] = [
  { titulo: "Primeros pasos", temas: [
    { id: "que-es", q: "¿Qué es SIX EVENT?", html: `<p>Es una plataforma de venta de boletas para eventos corporativos en Colombia: congresos, conferencias, foros, simposios, ferias, galas y más. Aquí encuentras el evento, reservas tus entradas, pagas en línea y descargas tus boletas con código QR.</p><p>${L("#/como-funciona", "Ver la guía «Cómo funciona»")}</p>` },
    { id: "cuenta", q: "Crear mi cuenta", html: `<ol><li>Pulsa <b>Registro</b> (arriba a la derecha).</li><li>Elige el tipo de cuenta: <b>Cliente</b> (usuario, correo, celular, ciudad y contraseña) o <b>Agente</b> (nombre, correo, empresa, cédula, celular, ciudad y contraseña).</li><li>Pulsa el botón para crear la cuenta. Es gratis.</li></ol><p>Para comprar boletas necesitas haber iniciado sesión.</p>` },
    { id: "sesion", q: "Iniciar y cerrar sesión", html: `<p>Pulsa <b>Entrar</b> e ingresa tu correo o usuario y tu contraseña. Si eres <b>agente</b> o administrador, la página te pedirá además tu <b>código de acceso</b>.</p><p>Para salir, abre tu perfil (tu nombre, arriba a la derecha) y pulsa <b>Cerrar sesión</b>.</p>` },
    { id: "modos", q: "Cambiar el modo de color", html: `<p>Con el botón de la <b>luna</b> (arriba a la derecha) eliges entre modo <b>claro</b>, <b>oscuro</b> y <b>exótico</b>. La página recuerda tu elección.</p>` },
  ] },
  { titulo: "Encontrar eventos", temas: [
    { id: "buscar", q: "Buscar y filtrar eventos", html: `<p>En el inicio usa la barra de búsqueda para escribir el nombre del evento y elige la <b>ciudad</b> o la <b>fecha</b> (esta semana, este mes o un rango). Debajo hay chips de <b>categorías</b> para filtrar con un clic. Todos los filtros se combinan.</p>` },
    { id: "destacados", q: "Eventos destacados y próximos", html: `<p>El carrusel de arriba y la sección <b>Eventos destacados</b> muestran la selección especial. En <b>Próximos eventos</b> aparece el resto, ordenado por fecha; usa <b>Ver más eventos</b> para cargar más.</p>` },
    { id: "categorias", q: "Categorías", html: `<p>Al final del inicio está la sección <b>Categorías</b>: cada recuadro lleva a una página con todos los eventos de esa categoría (conferencias, congresos, foros, galas, conciertos, deportes y más).</p>` },
    { id: "favoritos", q: "Guardar favoritos", html: `<p>Toca el <b>corazón</b> de una tarjeta para guardar el evento. Necesitas haber iniciado sesión.</p>` },
    { id: "calificar", q: "Calificar un evento", html: `<p>Abre el evento y baja hasta <b>Calificaciones</b>. Toca de 1 a 5 estrellas para dejar tu opinión (necesitas haber iniciado sesión). Puedes <b>cambiar</b> tu calificación cuando quieras o usar <b>Quitar mi calificación</b>. No es posible calificar un evento que tú creaste.</p>` },
    { id: "calificacion-mostrada", q: "¿Cómo se calcula la calificación que veo?", html: `<p>Cada evento parte de una <b>calificación inicial</b> (la define un administrador). La que ves combina esa calificación inicial con las <b>opiniones de las personas</b>: con pocas opiniones pesa más la inicial, y con muchas pesan más las opiniones. En el detalle del evento ves el promedio, cuántas opiniones hay y cuántas estrellas recibió cada puntaje.</p>` },
    { id: "compartir", q: "Compartir un evento", html: `<p>Dentro del evento pulsa <b>Compartir</b>: se copia el enlace para que lo envíes a quien quieras.</p>` },
  ] },
  { titulo: "Comprar boletas", temas: [
    { id: "reservar", q: "Reservar paso a paso", html: `<ol><li>Abre el evento que te interesa.</li><li>Pulsa <b>Reservar entradas</b> (inicia sesión si te lo pide).</li><li>Elige el <b>tipo de entrada</b> y la <b>cantidad</b> (máximo 10 por transacción).</li><li>Si tienes un cupón, selecciónalo.</li><li>Elige el medio de pago y completa tus datos.</li><li>Confirma el pago y revisa el resumen.</li></ol>` },
    { id: "pago", q: "Medios de pago y cargos", html: `<p>Puedes pagar con <b>tarjeta de crédito o débito</b> o por <b>PSE / transferencia</b>. Sobre el subtotal se suma un <b>cargo por servicio del 4 %</b>, que ves en el resumen antes de pagar.</p>` },
    { id: "cupones", q: "Usar un cupón de descuento", html: `<p>Los cupones se consiguen canjeando puntos (ver <i>Puntos y cupones</i>). En el pago aparece el selector <b>Cupón de descuento</b>; solo puedes usar uno por compra.</p>` },
    { id: "tiempo", q: "Tiempo para completar el pago", html: `<p>Según las normas de uso de la plataforma, mientras pagas las entradas se reservan temporalmente (15 minutos) para que no se agoten. Si se acaba el tiempo, vuelve a elegir tus entradas.</p>` },
  ] },
  { titulo: "Mis boletas", temas: [
    { id: "mis-reservas", q: "Dónde veo mis reservas y boletas", html: `<p>Abre tu perfil y entra a <b>Mis Reservas</b>: allí está el historial con su estado. Al abrir una reserva ves tu boleta con el <b>código QR</b> y el botón <b>Descargar boleta</b>. También puedes <b>Exportar CSV</b> con el historial.</p>` },
    { id: "ingreso", q: "Entrar al evento", html: `<p>Presenta tu <b>código QR</b> junto con tu documento de identidad. Las entradas son personales e intransferibles: están ligadas al titular de la compra.</p>` },
    { id: "autentica", q: "¿Cómo sé que mi boleta es auténtica?", html: `<p>Cada boleta tiene un <b>código QR único</b> que se verifica en la puerta del evento.</p>` },
  ] },
  { titulo: "Puntos y cupones", temas: [
    { id: "ganar", q: "Cómo gano puntos", html: `<p>Ganas <b>1 punto por cada $1.000 COP</b> pagados en cada compra. Tu saldo y tu historial están en <b>Mis Puntos</b>, dentro de tu perfil.</p>` },
    { id: "niveles", q: "Niveles", html: `<p>Tu nivel depende de los puntos <b>acumulados</b> en total (canjear no te baja de nivel):</p><ul><li>Bronce: desde 0</li><li>Plata: 5.000</li><li>Oro: 25.000</li><li>Platino: 100.000</li><li>Diamante: 500.000</li><li>Plus: 2.000.000</li></ul>` },
    { id: "canjear", q: "Canjear puntos por cupones", html: `<p>En <b>Mis Puntos → Canjear puntos</b> eliges tu cupón:</p><ul><li>10 % de descuento: 200 puntos</li><li>25 % de descuento: 600 puntos</li><li>50 % de descuento: 1.500 puntos</li></ul>` },
  ] },
  { titulo: "Cancelaciones y reembolsos", temas: [
    { id: "cancelan", q: "Si cancelan el evento", html: `<p>Si el organizador cancela, recibes el reembolso del valor de tu boleta en un plazo de 5 a 10 días hábiles.</p>` },
    { id: "retracto", q: "Retracto y otros casos", html: `<p>Tienes derecho a retracto dentro de los 5 días hábiles siguientes a la compra, siempre que falten 48 horas o más para el evento. Cada organizador puede tener condiciones propias.</p><p>${L("#/info/" + encodeURIComponent("Política de reembolsos"), "Leer la política de reembolsos")}</p>` },
  ] },
  { titulo: "Para agentes (organizadores)", temas: [
    { id: "ser-agente", q: "Cómo ser agente", html: `<p>En el registro elige <b>Agente</b>, selecciona tu <b>empresa</b> e ingresa tu cédula. Cuando inicies sesión, la página te pedirá el <b>código de acceso</b> de tu empresa.</p>` },
    { id: "crear-evento", q: "Crear un evento", html: `<ol><li>En el inicio pulsa <b>Crear nuevo evento</b>.</li><li>Completa título, descripción, categoría, ubicación, fecha, horario, recinto y aforo.</li><li>Agrega tus <b>tipos de boleta</b> con su precio, la agenda y la imagen.</li><li>Pulsa <b>Crear Evento</b> <b>una sola vez</b> y espera a que termine de guardar.</li></ol>` },
    { id: "editar", q: "Editar o eliminar mis eventos", html: `<p>En las tarjetas de tus eventos aparecen los botones de <b>editar</b> (lápiz) y <b>eliminar</b> (X). Solo puedes modificar los eventos que creaste.</p>` },
    { id: "panel", q: "Panel de ventas", html: `<p>Entra a <b>Panel</b> (menú superior) para ver los <b>ingresos estimados</b>, las boletas vendidas, la ocupación, los ingresos por evento, por categoría y por ciudad, y una tabla con el detalle de cada evento de tu empresa.</p>` },
    { id: "calif-agente", q: "Calificación de mis eventos", html: `<p>Tus eventos reciben las calificaciones de las personas que los califican (tú no puedes calificar los tuyos). La calificación inicial de cada evento la ajusta un administrador; si crees que una está mal, escríbenos a contacto@sixevent.co.</p>` },
    { id: "tarifas", q: "Tarifas", html: `<p>La cuenta de agente funciona por comisión: desde <b>3,5 % por boleta vendida + $500 COP fijos</b>.</p><p>${L("#/info/Precios", "Ver precios y tarifas")}</p>` },
  ] },
  { titulo: "Contacto y soporte", temas: [
    { id: "contacto", q: "Hablar con nosotros", html: `<p>Nuestro equipo atiende de <b>lunes a sábado, de 8 a. m. a 8 p. m.</b></p><ul><li>Correo: <a href="mailto:contacto@sixevent.co">contacto@sixevent.co</a></li><li>Teléfono: +57 601 744 0000</li><li>O escríbenos aquí, en el chat.</li></ul>` },
  ] },
];

