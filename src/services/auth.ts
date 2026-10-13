export type UserRole = "cliente" | "agente" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: UserRole;
  empresa?: string;
  cc?: string;
  phone?: string;
  city?: string;
  points?: number;
  reservations?: any[];
  favorites?: number[];
  position?: string;
  lifetimePoints?: number;
  coupons?: Coupon[];
}

export interface Coupon { code: string; label: string; percent: number; cost: number; date: string; used: boolean }

export const ADMIN_CREDENTIALS = { username: "admin78", password: "op98rtUcev" };

export const ADMIN_CODES: Record<string, string> = {
  "007": "Samuel Garcia Vinasco",
  "008": "Maria Paula Gamboa Rengifo",
  "009": "Juan Jose Ariza Londoño",
  "010": "Alejandro Garcia Reyes",
};

export const AGENT_CODES: Record<string, string> = {
  "Uceva": "900",
  "SENA": "567",
};

function loadUsers(): AuthUser[] {
  try {
    const data = localStorage.getItem("sixevent_users");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem("sixevent_users", JSON.stringify(users));
}

let usersDB: AuthUser[] = loadUsers();
let currentUser: AuthUser | null = null;

try {
  const session = localStorage.getItem("sixevent_session");
  if (session) {
    const sessionUser = JSON.parse(session);
    // Find updated user in DB to ensure fresh data
    const u = usersDB.find(u => u.id === sessionUser.id);
    if (u) currentUser = u;
    else currentUser = sessionUser;
  }
} catch (e) {}

function saveSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem("sixevent_session", JSON.stringify(user));
  } else {
    localStorage.removeItem("sixevent_session");
  }
}

export function registerUser(user: AuthUser) {
  user.points = 0;
  user.lifetimePoints = 0;
  user.coupons = [];
  user.reservations = [];
  user.favorites = [];
  usersDB.push(user);
  saveUsers(usersDB);
}

export function loginUser(emailOrUser: string, pass: string): AuthUser | null {
  const u = usersDB.find(u => (u.email === emailOrUser || u.username === emailOrUser) && u.password === pass);
  if (u) {
    currentUser = u;
    saveSession(u);
    return u;
  }
  return null;
}

export function setAdminSession(code: string): AuthUser | null {
  const name = ADMIN_CODES[code];
  if (!name) return null;
  const id = "admin-" + code;
  // Si el admin ya existe se reutiliza, para conservar los cambios de su perfil
  let adminUser = usersDB.find(u => u.id === id);
  if (!adminUser) {
    adminUser = { id, name, email: "admin@sixevent.co", username: "admin78", role: "admin", points: 0, reservations: [], favorites: [] };
    usersDB.push(adminUser);
    saveUsers(usersDB);
  }
  currentUser = adminUser;
  saveSession(adminUser);
  return adminUser;
}

export function getCurrentUser() {
  return currentUser;
}

export function logout() {
  currentUser = null;
  saveSession(null);
}

export function getUsers() {
  return [...usersDB];
}

/** Devuelve false si el navegador no pudo guardar los datos */
export function updateUser(updatedData: Partial<AuthUser>): boolean {
  if (!currentUser) return false;
  try {
    const index = usersDB.findIndex(u => u.id === currentUser!.id);
    if (index !== -1) {
      usersDB[index] = { ...usersDB[index], ...updatedData };
      currentUser = usersDB[index];
    } else {
      // sesión antigua que no estaba en la lista de usuarios: se agrega para que no se pierda
      currentUser = { ...currentUser, ...updatedData };
      usersDB.push(currentUser);
    }
    saveUsers(usersDB);
    saveSession(currentUser);
    return true;
  } catch {
    return false;
  }
}
