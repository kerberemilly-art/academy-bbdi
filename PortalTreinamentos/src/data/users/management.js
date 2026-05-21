import { normalizeEmail, writeUsers } from './shared';
import { getUsers } from './base';
import {
  canManageSector,
  getNormalizedDepartmentId,
  getNormalizedDepartmentIds,
  getUserDepartmentIds,
  isSuperAdmin,
} from '../sectorAccess';
import { createId, isValidEmail, safeTrim } from '../runtime';

const normalizeRole = (role) => (role === 'admin' ? 'admin' : 'collaborator');

const getActorDepartmentIds = (actorUser) => {
  if (!actorUser || isSuperAdmin(actorUser)) {
    return [];
  }

  return getUserDepartmentIds(actorUser);
};

const normalizeDepartmentSelectionForActor = (actorUser, role, departmentId, departmentIds) => {
  const normalizedDepartmentIds = getNormalizedDepartmentIds(departmentIds ?? departmentId);
  const actorDepartmentIds = getActorDepartmentIds(actorUser);

  if (!actorUser) {
    return normalizedDepartmentIds;
  }

  if (role === 'admin') {
    const requestedDepartmentId = normalizedDepartmentIds[0];

    if (isSuperAdmin(actorUser) || canManageSector(actorUser, requestedDepartmentId)) {
      return [requestedDepartmentId];
    }

    return [actorDepartmentIds[0]];
  }

  if (actorDepartmentIds.length === 0) {
    return normalizedDepartmentIds;
  }

  const restrictedDepartmentIds = normalizedDepartmentIds.filter((currentDepartmentId) => (
    actorDepartmentIds.includes(currentDepartmentId)
  ));

  return restrictedDepartmentIds.length > 0
    ? restrictedDepartmentIds
    : [actorDepartmentIds[0]];
};

const normalizeDepartmentSelectionForUpdate = (actorUser, role, departmentId, departmentIds) => {
  if (isSuperAdmin(actorUser)) {
    return normalizeDepartmentSelectionForActor(actorUser, role, departmentId, departmentIds);
  }

  const actorDepartmentIds = getActorDepartmentIds(actorUser);
  const normalizedDepartmentIds = normalizeDepartmentSelectionForActor(actorUser, role, departmentId, departmentIds);

  return normalizedDepartmentIds.filter((currentDepartmentId) => actorDepartmentIds.includes(currentDepartmentId));
};

const ensureActorScopedDepartments = (actorUser, departmentIds) => {
  if (!actorUser || isSuperAdmin(actorUser)) {
    return departmentIds;
  }

  const actorDepartmentIds = getActorDepartmentIds(actorUser);
  const scopedDepartmentIds = departmentIds.filter((currentDepartmentId) => (
    actorDepartmentIds.includes(currentDepartmentId)
  ));

  return scopedDepartmentIds.length > 0 ? scopedDepartmentIds : actorDepartmentIds.slice(0, 1);
};

const hasDepartmentAdmin = (users, departmentId, ignoredUserId = null) => (
  users.some((user) => (
    user.id !== ignoredUserId
    && user.role === 'admin'
    && getNormalizedDepartmentIds(user.departmentIds ?? user.departmentId).includes(departmentId)
  ))
);

export const createUser = ({ name, email, password, role, departmentId, departmentIds }, actorUser = null) => {
  const normalizedName = safeTrim(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = safeTrim(password);
  const normalizedRole = normalizeRole(role);
  const normalizedDepartmentIds = ensureActorScopedDepartments(
    actorUser,
    normalizeDepartmentSelectionForActor(actorUser, normalizedRole, departmentId, departmentIds),
  );
  const normalizedDepartmentId = getNormalizedDepartmentId(normalizedDepartmentIds[0]);
  const users = getUsers();

  if (!normalizedName) {
    return { ok: false, error: 'Informe o nome do colaborador.' };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, error: 'Informe um e-mail válido.' };
  }

  if (normalizedPassword.length < 6) {
    return { ok: false, error: 'A senha precisa ter pelo menos 6 caracteres.' };
  }

  if (users.some((user) => user.email === normalizedEmail)) {
    return { ok: false, error: 'Já existe um usuário com este e-mail.' };
  }

  if (normalizedRole === 'admin' && hasDepartmentAdmin(users, normalizedDepartmentId)) {
    return { ok: false, error: 'Este departamento já possui um admin responsável.' };
  }

  const user = {
    id: createId('user'),
    name: normalizedName,
    email: normalizedEmail,
    password: normalizedPassword,
    role: normalizedRole,
    active: true,
    createdAt: new Date().toISOString(),
    departmentId: normalizedDepartmentId,
    departmentIds: normalizedDepartmentIds,
  };

  writeUsers([...users, user]);
  return { ok: true, user };
};

export const updateUser = (userId, { name, email, password, role, departmentId, departmentIds }, actorUser = null) => {
  const normalizedName = safeTrim(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = safeTrim(password);
  const normalizedRole = normalizeRole(role);
  const normalizedDepartmentIds = ensureActorScopedDepartments(
    actorUser,
    normalizeDepartmentSelectionForUpdate(actorUser, normalizedRole, departmentId, departmentIds),
  );
  const normalizedDepartmentId = getNormalizedDepartmentId(normalizedDepartmentIds[0]);
  const users = getUsers();
  const existingUser = users.find((user) => user.id === userId);

  if (!existingUser || existingUser.role === 'master') {
    return { ok: false, error: 'Usuário não encontrado.' };
  }

  if (!normalizedName) {
    return { ok: false, error: 'Informe o nome do colaborador.' };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, error: 'Informe um e-mail válido.' };
  }

  if (normalizedPassword && normalizedPassword.length < 6) {
    return { ok: false, error: 'A nova senha precisa ter pelo menos 6 caracteres.' };
  }

  if (users.some((user) => user.email === normalizedEmail && user.id !== userId)) {
    return { ok: false, error: 'Já existe um usuário com este e-mail.' };
  }

  if (normalizedRole === 'admin' && hasDepartmentAdmin(users, normalizedDepartmentId, userId)) {
    return { ok: false, error: 'Este departamento já possui um admin responsável.' };
  }

  const updatedUsers = users.map((user) => {
    if (user.id !== userId) return user;

    return {
      ...user,
      name: normalizedName,
      email: normalizedEmail,
      role: normalizedRole,
      ...(normalizedPassword ? { password: normalizedPassword } : {}),
      departmentId: normalizedDepartmentId,
      departmentIds: normalizedDepartmentIds,
    };
  });

  writeUsers(updatedUsers);
  return { ok: true, user: updatedUsers.find((user) => user.id === userId) };
};

export const updateUserDepartments = (userId, departmentIds, actorUser = null) => {
  const normalizedDepartmentIds = ensureActorScopedDepartments(
    actorUser,
    getNormalizedDepartmentIds(departmentIds),
  );
  const normalizedDepartmentId = getNormalizedDepartmentId(normalizedDepartmentIds[0]);
  const users = getUsers();

  const updatedUsers = users.map((user) => {
    if (user.id !== userId || user.role === 'master') return user;

    return {
      ...user,
      departmentId: normalizedDepartmentId,
      departmentIds: normalizedDepartmentIds,
    };
  });

  writeUsers(updatedUsers);
  return { ok: true, user: updatedUsers.find((user) => user.id === userId) };
};

export const setUserActive = (userId, active, actorUser = null) => {
  const users = getUsers();
  const updatedUsers = users.map((user) => {
    if (user.id !== userId || user.role === 'master') return user;

    if (!isSuperAdmin(actorUser) && !getActorDepartmentIds(actorUser).some((departmentId) => (
      getNormalizedDepartmentIds(user.departmentIds ?? user.departmentId).includes(departmentId)
    ))) {
      return user;
    }

    return { ...user, active };
  });

  writeUsers(updatedUsers);
  return updatedUsers;
};

export const deleteUser = (userId, actorUser = null) => {
  const updatedUsers = getUsers().filter((user) => {
    if (user.id === userId && user.role !== 'master') {
      if (isSuperAdmin(actorUser)) {
        return false;
      }

      const actorDepartmentIds = getActorDepartmentIds(actorUser);
      const userDepartmentIds = getNormalizedDepartmentIds(user.departmentIds ?? user.departmentId);
      const canDelete = actorDepartmentIds.some((departmentId) => userDepartmentIds.includes(departmentId));

      return !canDelete;
    }

    return true;
  });
  writeUsers(updatedUsers);
  return updatedUsers;
};
