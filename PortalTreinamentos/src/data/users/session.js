import { getSessionStorageKey, normalizeEmail } from './shared';
import { getUsers } from './base';

export const authenticateUser = (email, password) => {
  const normalizedEmail = normalizeEmail(email);
  const user = getUsers().find(
    (item) => item.email === normalizedEmail && item.password === password && item.active,
  );

  if (!user) return null;

  localStorage.setItem(getSessionStorageKey(), user.id);
  return user;
};

export const getCurrentUser = () => {
  const currentUserId = localStorage.getItem(getSessionStorageKey());
  if (!currentUserId) return null;

  return getUsers().find((user) => user.id === currentUserId && user.active) ?? null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(getSessionStorageKey());
};
