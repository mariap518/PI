import { locate } from "./geo";

export interface EventItem {
  id: number;
  title: string;
  category: string;
  city: string;
  country?: string;
  department?: string;
  date: string; // Stored as YYYY-MM-DD
  price: number; // Base price
  img: string;
  rating: number;
  createdBy: string;
  company?: string;
  description?: string;
  
  startTime?: string;
  endTime?: string;
  venue?: string;
  capacity?: number;
  availableTickets?: number;
  agenda?: string;
  ticketCategories?: { name: string; price: number; capacity?: number; available?: number }[];
}

function loadEvents(): EventItem[] {
  try {
    const data = localStorage.getItem("sixevent_events");
    if (data) return (JSON.parse(data) as EventItem[]).map(normalize);
  } catch (e) {}
  return initialEvents.map(normalize);
}

const DESC: Record<number, string> = {
 "1": "Encuentro regional que reúne a CEOs, inversionistas y líderes de más de 15 países para discutir expansión de mercados, alianzas estratégicas y el futuro de la economía latinoamericana. Incluye ruedas de negocios y cena de networking.",
 "2": "Dos jornadas de paneles y demostraciones sobre inteligencia artificial, computación en la nube y transformación digital, con startups invitadas y espacio para conectar con aceleradoras y fondos de capital de riesgo.",
 "3": "Especialistas en tesorería, fusiones y gestión de riesgos presentan casos reales de empresas colombianas. Las sesiones técnicas abordan valoración, financiación y cumplimiento normativo para directores financieros.",
 "4": "Magistrados, abogados y académicos analizan las reformas más recientes en derecho societario, contratación y arbitraje comercial, con sesiones de preguntas y casos prácticos.",
 "5": "Feria con más de cien expositores de maquinaria, materiales y software de ingeniería. Habrá demostraciones en vivo, charlas sobre obra sostenible y encuentros con constructoras y proveedores.",
 "6": "Noche de reconocimiento a las empresas con mayor impacto social y ambiental del año. Incluye cena de gala, presentación de los proyectos ganadores y una subasta benéfica.",
 "7": "Seminario práctico para profesionales que quieren aplicar IA en sus equipos: modelos de lenguaje, automatización de procesos, ética y gobernanza de datos, con talleres guiados.",
 "8": "Estudiantes y jóvenes emprendedores muestran sus proyectos ante mentores e inversionistas. Hay pitches de tres minutos, stands de incubadoras y premios para las mejores ideas.",
 "9": "Taller intensivo de un día sobre comunicación, toma de decisiones y gestión de equipos de alto desempeño, con ejercicios en grupos pequeños y retroalimentación personalizada.",
 "10": "Expertos en posicionamiento, analítica y publicidad en redes comparten estrategias para crecer en entornos digitales. Incluye talleres de contenido, comercio electrónico y marca personal.",
 "11": "Espacio para mujeres directivas y emprendedoras: conversatorios sobre liderazgo, equidad salarial y acceso a financiación, con mentorías abiertas y una red de contactos.",
 "12": "Empresas, gobierno y organizaciones debaten metas de descarbonización, economía circular y reportes ESG, con casos de éxito y mesas de trabajo sobre financiación verde.",
 "13": "Desarrolladores y empresarios exploran contratos inteligentes, tokenización y finanzas descentralizadas, con demostraciones técnicas y un panel sobre regulación en América Latina.",
 "14": "Muestra de obras de artistas colombianos y latinoamericanos en distintos formatos, con visitas guiadas, charlas con los creadores y un espacio dedicado a coleccionistas.",
 "15": "Ceremonia que premia a los proyectos, empresas y talentos más innovadores del año en software, hardware y emprendimiento, con cóctel, presentaciones y música en vivo.",
 "16": "Psicólogos y líderes de talento humano presentan estrategias para prevenir el agotamiento, mejorar el clima laboral y construir programas de bienestar que funcionen."
};

/** Eventos antiguos: completa país, departamento y descripción */
function normalize(e: EventItem): EventItem {
  let r = e;
  if (r.department === "Bogotá D.C.") r = { ...r, department: "Cundinamarca" }; // Bogotá pertenece a Cundinamarca
  if (!r.country || !r.department) { const g = locate(r.city); r = { ...r, country: r.country ?? g?.country ?? "Colombia", department: r.department ?? g?.department ?? "" }; }
  if (!r.description) r = { ...r, description: DESC[r.id] ?? `${r.title} es un evento de ${r.category.toLowerCase()} que se realizará en ${r.city}. Reúne a profesionales y organizaciones del sector para compartir experiencias, conocimiento y oportunidades de negocio.` };
  return r;
}

export function placeLabel(e: EventItem, full = false) {
  return [e.city, e.department, full ? e.country : ""].filter(Boolean).join(", ");
}

function saveEvents(events: EventItem[]) {
  localStorage.setItem("sixevent_events", JSON.stringify(events));
}

const mockCategories = (price: number, cap: number) => [
  { name: "VIP Ejecutivo", price: Math.round(price * 2.03), capacity: Math.round(cap * 0.1), available: Math.round(cap * 0.1) },
  { name: "General", price: price, capacity: Math.round(cap * 0.6), available: Math.round(cap * 0.6) },
  { name: "Estudiante Afiliado", price: Math.round(price * 0.28), capacity: Math.round(cap * 0.3), available: Math.round(cap * 0.3) }
];

const initialEvents: EventItem[] = [
  { id: 1, title: "Cumbre Empresarial Latinoamérica 2026", category: "Conferencia", city: "Medellín", date: "2026-10-15", price: 320000, img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", startTime: "09:00", endTime: "18:30", venue: "Centro de Convenciones Medellín", capacity: 500, availableTickets: 48, agenda: "09:00 - Registro\n10:00 - Conferencia inaugural", ticketCategories: mockCategories(320000, 500) },
  { id: 2, title: "Foro Internacional de Innovación y Tecnología", category: "Foro", city: "Bogotá", date: "2026-10-22", price: 180000, img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", startTime: "08:30", endTime: "17:00", venue: "Hotel Tequendama", capacity: 300, availableTickets: 120, agenda: "08:30 - Registro\n09:30 - Panel", ticketCategories: mockCategories(180000, 300) },
  { id: 3, title: "Congreso Nacional de Finanzas Corporativas", category: "Congreso", city: "Cali", date: "2026-11-03", price: 250000, img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", startTime: "10:00", endTime: "18:00", venue: "Palacio de Exposiciones", capacity: 200, availableTickets: 30, agenda: "10:00 - Inicio\n12:00 - Almuerzo", ticketCategories: mockCategories(250000, 200) },
  { id: 4, title: "Simposio de Derecho Corporativo 2026", category: "Simposio", city: "Bogotá", date: "2026-11-10", price: 90000, img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=380&fit=crop&auto=format", rating: 4.6, createdBy: "system", startTime: "09:00", endTime: "16:00", venue: "U. de los Andes", capacity: 400, availableTickets: 200, agenda: "09:00 - Apertura\n15:00 - Cierre", ticketCategories: mockCategories(90000, 400) },
  { id: 5, title: "Expo Construcción e Infraestructura 2026", category: "Exposición", city: "Bogotá", date: "2026-11-18", price: 60000, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=380&fit=crop&auto=format", rating: 4.5, createdBy: "system", startTime: "08:00", endTime: "19:00", venue: "Corferias", capacity: 2000, availableTickets: 800, agenda: "08:00 - Apertura stands", ticketCategories: mockCategories(60000, 2000) },
  { id: 6, title: "Gala Anual de Responsabilidad Social Empresarial", category: "Gala", city: "Bogotá", date: "2026-11-25", price: 450000, img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", startTime: "19:00", endTime: "23:30", venue: "Club El Nogal", capacity: 150, availableTickets: 15, agenda: "19:00 - Cóctel\n20:30 - Premiación", ticketCategories: mockCategories(450000, 150) },
  { id: 7, title: "Seminario de Inteligencia Artificial", category: "Seminario", city: "Medellín", date: "2026-12-05", price: 120000, img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", capacity: 500, availableTickets: 500, startTime: "09:00", endTime: "17:00", venue: "Ruta N", agenda: "09:00 - Registro", ticketCategories: mockCategories(120000, 500) },
  { id: 8, title: "Feria de Emprendimiento Universitario", category: "Feria", city: "Cali", date: "2026-12-12", price: 45000, img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=380&fit=crop&auto=format", rating: 4.4, createdBy: "system", capacity: 1000, availableTickets: 1000, startTime: "10:00", endTime: "18:00", venue: "Centro de Eventos Valle del Pacífico", agenda: "10:00 - Apertura", ticketCategories: mockCategories(45000, 1000) },
  { id: 9, title: "Taller de Liderazgo Ejecutivo", category: "Taller", city: "Bogotá", date: "2026-12-15", price: 210000, img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 100, availableTickets: 100, startTime: "08:00", endTime: "12:00", venue: "Hotel W", agenda: "08:00 - Desayuno", ticketCategories: mockCategories(210000, 100) },
  { id: 10, title: "Congreso de Marketing Digital", category: "Congreso", city: "Barranquilla", date: "2027-01-20", price: 150000, img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", capacity: 300, availableTickets: 300, startTime: "09:00", endTime: "18:00", venue: "Puerta de Oro", agenda: "09:00 - Registro", ticketCategories: mockCategories(150000, 300) },
  { id: 11, title: "Encuentro de Mujeres Líderes", category: "Encuentro", city: "Cartagena", date: "2027-02-10", price: 130000, img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 250, availableTickets: 250, startTime: "14:00", endTime: "20:00", venue: "Centro de Convenciones", agenda: "14:00 - Registro", ticketCategories: mockCategories(130000, 250) },
  { id: 12, title: "Foro de Sostenibilidad Ambiental", category: "Foro", city: "Bogotá", date: "2027-02-18", price: 80000, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=380&fit=crop&auto=format", rating: 4.6, createdBy: "system", capacity: 400, availableTickets: 400, startTime: "08:00", endTime: "14:00", venue: "Auditorio Principal", agenda: "08:00 - Registro", ticketCategories: mockCategories(80000, 400) },
  { id: 13, title: "Conferencia de Blockchain y Web3", category: "Conferencia", city: "Medellín", date: "2027-03-05", price: 195000, img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=380&fit=crop&auto=format", rating: 4.8, createdBy: "system", capacity: 350, availableTickets: 350, startTime: "09:00", endTime: "18:00", venue: "Plaza Mayor", agenda: "09:00 - Registro", ticketCategories: mockCategories(195000, 350) },
  { id: 14, title: "Exposición de Arte Contemporáneo", category: "Exposición", city: "Bogotá", date: "2027-03-15", price: 35000, img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&h=380&fit=crop&auto=format", rating: 4.5, createdBy: "system", capacity: 1500, availableTickets: 1500, startTime: "10:00", endTime: "20:00", venue: "Museo de Arte Moderno", agenda: "10:00 - Apertura", ticketCategories: mockCategories(35000, 1500) },
  { id: 15, title: "Gala de Premios Tecnológicos", category: "Gala", city: "Cali", date: "2027-03-25", price: 300000, img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=380&fit=crop&auto=format", rating: 4.9, createdBy: "system", capacity: 200, availableTickets: 200, startTime: "19:00", endTime: "00:00", venue: "Centro de Eventos Valle del Pacífico", agenda: "19:00 - Alfombra roja", ticketCategories: mockCategories(300000, 200) },
  { id: 16, title: "Simposio de Salud Mental en el Trabajo", category: "Simposio", city: "Medellín", date: "2027-04-10", price: 75000, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=380&fit=crop&auto=format", rating: 4.7, createdBy: "system", capacity: 300, availableTickets: 300, startTime: "08:00", endTime: "16:00", venue: "Auditorio Ruta N", agenda: "08:00 - Registro", ticketCategories: mockCategories(75000, 300) },
];

let eventsDB: EventItem[] = loadEvents();
let nextId = eventsDB.length > 0 ? Math.max(...eventsDB.map(e => e.id)) + 1 : 17;

export function getEvents() {
  return [...eventsDB];
}

export function addEvent(event: Omit<EventItem, "id" | "rating">) {
  const newEvent: EventItem = {
    ...event,
    id: nextId++,
    rating: 5.0,
  };
  eventsDB = [newEvent, ...eventsDB];
  saveEvents(eventsDB);
  return newEvent;
}

export function updateEvent(id: number, patch: Partial<EventItem>) {
  eventsDB = eventsDB.map(e => (e.id === id ? { ...e, ...patch, id } : e));
  saveEvents(eventsDB);
}

export function deleteEvent(id: number) {
  eventsDB = eventsDB.filter(e => e.id !== id);
  saveEvents(eventsDB);
}

export function consumeTickets(id: number, qty: number, category?: string) {
  const e = eventsDB.find(x => x.id === id);
  if (!e || e.availableTickets === undefined) return;
  e.availableTickets = Math.max(0, e.availableTickets - qty);
  const c = e.ticketCategories?.find(x => x.name === category);
  if (c && c.available !== undefined) c.available = Math.max(0, c.available - qty);
  saveEvents(eventsDB);
}

export function formatDateString(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
