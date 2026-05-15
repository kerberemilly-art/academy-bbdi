const QUIZ_RESULTS_STORAGE_KEY = 'portalTreinamentos.quizResults';

export const readResults = () => {
  try {
    const storedResults = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
    return storedResults ? JSON.parse(storedResults) : [];
  } catch {
    return [];
  }
};

export const writeResults = (results) => {
  localStorage.setItem(QUIZ_RESULTS_STORAGE_KEY, JSON.stringify(results));
};

export const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `result-${Date.now()}`;
};
