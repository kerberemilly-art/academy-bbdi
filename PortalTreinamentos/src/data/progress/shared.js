import { readStorageJSON, writeStorageJSON } from '../runtime';

const QUIZ_RESULTS_STORAGE_KEY = 'portalTreinamentos.quizResults';

export const readResults = () => {
  const storedResults = readStorageJSON(QUIZ_RESULTS_STORAGE_KEY, []);

  return Array.isArray(storedResults) ? storedResults : [];
};

export const writeResults = (results) => {
  writeStorageJSON(QUIZ_RESULTS_STORAGE_KEY, results);
};

export { createId } from '../runtime';
