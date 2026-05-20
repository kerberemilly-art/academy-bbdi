import {
  DEFAULT_COLLABORATOR_DEPARTMENT_ID,
  getNormalizedDepartmentId,
  getNormalizedDepartmentIds,
} from '../sectorAccess';
import {
  normalizeEmail,
  readStorageJSON,
  safeTrim,
  writeStorageJSON,
} from '../runtime';

const USERS_STORAGE_KEY = 'portalTreinamentos.users';
const SESSION_STORAGE_KEY = 'portalTreinamentos.currentUserId';

export const MASTER_CREDENTIALS = {
  email: 'master@treinamentos.local',
  password: 'MASTER_PASSWORD_REMOVED',
};

export const MASTER_USER = {
  id: 'master',
  name: 'Administrador Master',
  email: MASTER_CREDENTIALS.email,
  password: MASTER_CREDENTIALS.password,
  role: 'master',
  active: true,
  createdAt: '2026-05-15T00:00:00.000Z',
  departmentId: null,
  departmentIds: [],
};

export const readStoredUsers = () => {
  const storedUsers = readStorageJSON(USERS_STORAGE_KEY, []);

  return Array.isArray(storedUsers) ? storedUsers : [];
};

export const writeUsers = (users) => {
  writeStorageJSON(USERS_STORAGE_KEY, users);
};

export const getSessionStorageKey = () => SESSION_STORAGE_KEY;

export const normalizeStoredUser = (user) => {
  if (!user || typeof user !== 'object') {
    return null;
  }

  if (user.role === 'master') {
    return {
      ...MASTER_USER,
      ...user,
      email: MASTER_CREDENTIALS.email,
      password: MASTER_CREDENTIALS.password,
      departmentId: null,
      departmentIds: [],
    };
  }

  const normalizedDepartmentIds = getNormalizedDepartmentIds(
    user.departmentIds ?? user.departmentId ?? DEFAULT_COLLABORATOR_DEPARTMENT_ID,
  );
  const normalizedName = safeTrim(user.name, 'Colaborador');
  const normalizedEmail = normalizeEmail(user.email);

  return {
    ...user,
    name: normalizedName,
    email: normalizedEmail,
    departmentId: getNormalizedDepartmentId(normalizedDepartmentIds[0]),
    departmentIds: normalizedDepartmentIds,
  };
};

export { normalizeEmail } from '../runtime';
export { createId } from '../runtime';
