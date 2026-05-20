const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hasWindow = () => typeof window !== 'undefined';

export const safeTrim = (value, fallback = '') => (
  typeof value === 'string' ? value.trim() : fallback
);

export const normalizeEmail = (value) => safeTrim(value).toLowerCase();

export const isValidEmail = (value) => EMAIL_PATTERN.test(normalizeEmail(value));

export const createId = (prefix = 'id') => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}`;
};

export const readStorageValue = (key, fallback = null) => {
  if (!hasWindow()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
};

export const writeStorageValue = (key, value) => {
  if (!hasWindow()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const removeStorageValue = (key) => {
  if (!hasWindow()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const readStorageJSON = (key, fallback) => {
  const rawValue = readStorageValue(key, null);

  if (rawValue === null) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
};

export const writeStorageJSON = (key, value) => {
  try {
    return writeStorageValue(key, JSON.stringify(value));
  } catch {
    return false;
  }
};
