import { readStorageJSON, writeStorageJSON } from './runtime';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '/api';
const USERS_STORAGE_KEY = 'portalTreinamentos.users';
const RESULTS_STORAGE_KEY = 'portalTreinamentos.quizResults';
const CERTIFICATES_STORAGE_KEY = 'portalTreinamentos.certificates';

const hasWindow = () => typeof window !== 'undefined';
let cachedSnapshot = {
  users: [],
  results: [],
  certificates: [],
};

const readSnapshot = () => ({
  users: readStorageJSON(USERS_STORAGE_KEY, []),
  results: readStorageJSON(RESULTS_STORAGE_KEY, []),
  certificates: readStorageJSON(CERTIFICATES_STORAGE_KEY, []),
});

const writeSnapshot = (snapshot) => {
  writeStorageJSON(USERS_STORAGE_KEY, snapshot.users ?? []);
  writeStorageJSON(RESULTS_STORAGE_KEY, snapshot.results ?? []);
  writeStorageJSON(CERTIFICATES_STORAGE_KEY, snapshot.certificates ?? []);
};

const setCachedSnapshot = (snapshot) => {
  cachedSnapshot = {
    users: Array.isArray(snapshot?.users) ? snapshot.users : [],
    results: Array.isArray(snapshot?.results) ? snapshot.results : [],
    certificates: Array.isArray(snapshot?.certificates) ? snapshot.certificates : [],
  };
};

const hasSnapshotData = (snapshot) => (
  Array.isArray(snapshot?.users) && snapshot.users.length > 0
  || Array.isArray(snapshot?.results) && snapshot.results.length > 0
  || Array.isArray(snapshot?.certificates) && snapshot.certificates.length > 0
);

export const loadBackendSnapshot = async () => {
  if (!hasWindow()) {
    return null;
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/state`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
};

export const syncBackendSnapshot = async (snapshot = readSnapshot()) => {
  if (!hasWindow()) {
    return false;
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(snapshot),
      keepalive: true,
    });

    return response.ok;
  } catch {
    return false;
  }
};

export const readBackendSlice = (sliceName, fallback = []) => {
  const value = cachedSnapshot[sliceName];
  return Array.isArray(value) ? value : fallback;
};

export const writeBackendSlice = (sliceName, value) => {
  cachedSnapshot = {
    ...cachedSnapshot,
    [sliceName]: Array.isArray(value) ? value : [],
  };

  void syncBackendSnapshot(cachedSnapshot);
};

export const bootstrapBackendSnapshot = async () => {
  if (!hasWindow()) {
    return { source: 'none' };
  }

  const remoteSnapshot = await loadBackendSnapshot();

  if (hasSnapshotData(remoteSnapshot)) {
    setCachedSnapshot(remoteSnapshot);
    writeSnapshot(remoteSnapshot);
    return { source: 'remote' };
  }

  const localSnapshot = readSnapshot();

  if (hasSnapshotData(localSnapshot)) {
    setCachedSnapshot(localSnapshot);
    await syncBackendSnapshot(cachedSnapshot);
    return { source: 'local' };
  }

  setCachedSnapshot({ users: [], results: [], certificates: [] });
  return { source: 'empty' };
};
