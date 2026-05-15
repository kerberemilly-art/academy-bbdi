import { createId, normalizeEmail, writeUsers } from './shared';
import { getUsers } from './base';

export const createUser = ({ name, email, password }) => {
  const normalizedName = name.trim();
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = password.trim();
  const users = getUsers();

  if (!normalizedName) {
    return { ok: false, error: 'Informe o nome do colaborador.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { ok: false, error: 'Informe um e-mail válido.' };
  }

  if (normalizedPassword.length < 6) {
    return { ok: false, error: 'A senha precisa ter pelo menos 6 caracteres.' };
  }

  if (users.some((user) => user.email === normalizedEmail)) {
    return { ok: false, error: 'Já existe um usuário com este e-mail.' };
  }

  const user = {
    id: createId(),
    name: normalizedName,
    email: normalizedEmail,
    password: normalizedPassword,
    role: 'collaborator',
    active: true,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, user]);
  return { ok: true, user };
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
