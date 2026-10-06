/** País → Departamento/Estado → Ciudades. Para agregar lugares, edita este objeto. */
const RAW: Record<string, string> = {
  "Colombia": "Amazonas: Leticia, Puerto Nariño | Antioquia: Medellín, Envigado, Bello, Itagüí, Sabaneta, Rionegro, Apartadó, Turbo | Arauca: Arauca, Saravena, Tame | Atlántico: Barranquilla, Soledad, Malambo, Puerto Colombia | Bolívar: Cartagena, Magangué, Turbaco, Mompox | Boyacá: Tunja, Duitama, Sogamoso, Paipa, Villa de Leyva | Caldas: Manizales, La Dorada, Chinchiná | Caquetá: Florencia, San Vicente del Caguán | Casanare: Yopal, Aguazul | Cauca: Popayán, Santander de Quilichao | Cesar: Valledupar, Aguachica | Chocó: Quibdó, Istmina | Córdoba: Montería, Sahagún, Lorica | Cundinamarca: Bogotá, Soacha, Zipaquirá, Chía, Fusagasugá, Girardot, Facatativá | Guainía: Inírida | Guaviare: San José del Guaviare | Huila: Neiva, Pitalito, Garzón | La Guajira: Riohacha, Maicao, Uribia | Magdalena: Santa Marta, Ciénaga | Meta: Villavicencio, Acacías | Nariño: Pasto, Tumaco, Ipiales | Norte de Santander: Cúcuta, Ocaña, Pamplona | Putumayo: Mocoa, Puerto Asís | Quindío: Armenia, Calarcá, Salento | Risaralda: Pereira, Dosquebradas | San Andrés y Providencia: San Andrés, Providencia | Santander: Bucaramanga, Floridablanca, Girón, Piedecuesta, San Gil | Sucre: Sincelejo, Corozal | Tolima: Ibagué, Espinal, Honda | Valle del Cauca: Cali, Palmira, Buenaventura, Tuluá, Buga, Cartago, Yumbo | Vaupés: Mitú | Vichada: Puerto Carreño",
  "Argentina": "Buenos Aires (CABA): Buenos Aires | Córdoba: Córdoba | Mendoza: Mendoza | Santa Fe: Rosario, Santa Fe",
  "Chile": "Biobío: Concepción | Región Metropolitana: Santiago | Valparaíso: Valparaíso, Viña del Mar",
  "Ecuador": "Azuay: Cuenca | Guayas: Guayaquil | Pichincha: Quito", 
  "España": "Andalucía: Sevilla, Málaga | Cataluña: Barcelona | Comunidad de Madrid: Madrid | Comunidad Valenciana: Valencia",
  "Estados Unidos": "California: Los Ángeles, San Francisco | Florida: Miami, Orlando | Nueva York: Nueva York | Texas: Austin, Houston",
  "México": "Ciudad de México: Ciudad de México | Jalisco: Guadalajara, Zapopan | Nuevo León: Monterrey, San Pedro Garza García | Quintana Roo: Cancún, Playa del Carmen",
  "Panamá": "Chiriquí: David | Panamá: Ciudad de Panamá",
  "Perú": "Arequipa: Arequipa | Cusco: Cusco | Lima: Lima, Miraflores",
};

const GEO: Record<string, Record<string, string[]>> = {};
for (const [country, deps] of Object.entries(RAW)) {
  GEO[country] = {};
  for (const d of deps.split("|")) { const [name, list] = d.split(":"); GEO[country][name.trim()] = list.split(",").map(c => c.trim()); }
}

export const COUNTRIES = Object.keys(GEO);
export const departments = (country: string) => Object.keys(GEO[country] ?? {});
export const cities = (country: string, dept: string) => GEO[country]?.[dept] ?? [];

/** Busca a qué país y departamento pertenece una ciudad (prioriza Colombia) */
export function locate(city: string): { country: string; department: string } | null {
  for (const country of COUNTRIES) for (const [department, list] of Object.entries(GEO[country])) if (list.includes(city)) return { country, department };
  return null;
}

export const allCities = () => Array.from(new Set(COUNTRIES.flatMap(c => Object.values(GEO[c]).flat()))).sort((a, b) => a.localeCompare(b, "es"));
