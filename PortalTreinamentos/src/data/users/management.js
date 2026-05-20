import { normalizeEmail, writeUsers } from './shared';
import { getUsers } from './base';
import { getNormalizedDepartmentId, getNormalizedDepartmentIds } from '../sectorAccess';
import { createId, isValidEmail, safeTrim } from '../runtime';

export const createUser = ({ name, email, password, departmentId, departmentIds }) => {
  const normalizedName = safeTrim(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = safeTrim(password);
  const normalizedDepartmentIds = getNormalizedDepartmentIds(departmentIds ?? departmentId);
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

  const user = {
    id: createId('user'),
    name: normalizedName,
    email: normalizedEmail,
    password: normalizedPassword,
    role: 'collaborator',
    active: true,
    createdAt: new Date().toISOString(),
    departmentId: normalizedDepartmentId,
    departmentIds: normalizedDepartmentIds,
  };

  writeUsers([...users, user]);
  return { ok: true, user };
};

export const updateUser = (userId, { name, email, password, departmentId, departmentIds }) => {
  const normalizedName = safeTrim(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = safeTrim(password);
  const normalizedDepartmentIds = getNormalizedDepartmentIds(departmentIds ?? departmentId);
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

  const updatedUsers = users.map((user) => {
    if (user.id !== userId) return user;

    return {
      ...user,
      name: normalizedName,
      email: normalizedEmail,
      ...(normalizedPassword ? { password: normalizedPassword } : {}),
      departmentId: normalizedDepartmentId,
      departmentIds: normalizedDepartmentIds,
    };
  });

  writeUsers(updatedUsers);
  return { ok: true, user: updatedUsers.find((user) => user.id === userId) };
};

export const updateUserDepartments = (userId, departmentIds) => {
  const normalizedDepartmentIds = getNormalizedDepartmentIds(departmentIds);
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

export const setUserActive = (userId, active) => {
  const users = getUsers();
  const updatedUsers = users.map((user) => {
    if (user.id !== userId || user.role === 'master') return user;
    return { ...user, active };
  });

  writeUsers(updatedUsers);
  return updatedUsers;
};

export const deleteUser = (userId) => {
  const updatedUsers = getUsers().filter((user) => user.id !== userId || user.role === 'master');
  writeUsers(updatedUsers);
  return updatedUsers;
};
