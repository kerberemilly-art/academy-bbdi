import { getSessionStorageKey, normalizeEmail, normalizeStoredUser } from './shared';
import { getUsers } from './base';
import { readStorageValue, removeStorageValue, writeStorageValue } from '../runtime';

export const authenticateUser = (email, password) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = typeof password === 'string' ? password.trim() : '';
  const user = getUsers().find(
    (item) => item.email === normalizedEmail && item.password === normalizedPassword && item.active,
  );

  if (!user) return null;

  writeStorageValue(getSessionStorageKey(), user.id);
  return normalizeStoredUser(user);
};

export const getCurrentUser = () => {
  const currentUserId = readStorageValue(getSessionStorageKey(), null);
  if (!currentUserId) return null;

  const currentUser = normalizeStoredUser(
    getUsers().find((user) => user.id === currentUserId && user.active) ?? null,
  );

  if (!currentUser) {
    clearCurrentUser();
  }

  return currentUser;
};

export const clearCurrentUser = () => {
  removeStorageValue(getSessionStorageKey());
};
