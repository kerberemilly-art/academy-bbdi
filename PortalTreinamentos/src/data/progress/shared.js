import { readBackendSlice, writeBackendSlice } from '../../api/backendSync';

export const readResults = () => {
  const storedResults = readBackendSlice('results', []);

  return Array.isArray(storedResults) ? storedResults : [];
};

export const writeResults = (results) => {
  writeBackendSlice('results', results);
};

export { createId } from '../runtime';
