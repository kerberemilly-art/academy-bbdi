const USERS_STORAGE_KEY = 'portalTreinamentos.users';
const SESSION_STORAGE_KEY = 'portalTreinamentos.currentUserId';

export const MASTER_CREDENTIALS = {
  email: 'master@treinamentos.local',
  password: 'Master@123',
};

export const MASTER_USER = {
  id: 'master',
  name: 'Administrador Master',
  email: MASTER_CREDENTIALS.email,
  password: MASTER_CREDENTIALS.password,
  role: 'master',
  active: true,
  createdAt: '2026-05-15T00:00:00.000Z',
};

export const normalizeEmail = (email) => email.trim().toLowerCase();

export const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}`;
};

export const readStoredUsers = () => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch {
    return [];
  }
};

export const writeUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getSessionStorageKey = () => SESSION_STORAGE_KEY;
