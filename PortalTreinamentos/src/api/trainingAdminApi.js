import { cacheBackendSlice, readBackendSlice } from './backendSync';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '/api';

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error ?? 'Não foi possível salvar o treinamento.');
  }

  return payload;
};

export const getCachedTrainings = () => readBackendSlice('trainings', []);

export const fetchTrainings = async () => {
  const payload = await requestJson('/trainings');
  const trainings = Array.isArray(payload.trainings) ? payload.trainings : [];
  cacheBackendSlice('trainings', trainings);
  return trainings;
};

export const createTraining = async (training) => {
  const payload = await requestJson('/trainings', {
    method: 'POST',
    body: JSON.stringify(training),
  });

  cacheBackendSlice('trainings', payload.trainings ?? []);
  return payload.training;
};

export const updateTraining = async (trainingId, training) => {
  const payload = await requestJson(`/trainings/${encodeURIComponent(trainingId)}`, {
    method: 'PUT',
    body: JSON.stringify(training),
  });

  cacheBackendSlice('trainings', payload.trainings ?? []);
  return payload.training;
};

export const deleteTraining = async (trainingId) => {
  const payload = await requestJson(`/trainings/${encodeURIComponent(trainingId)}`, {
    method: 'DELETE',
  });

  cacheBackendSlice('trainings', payload.trainings ?? []);
  return payload.trainings ?? [];
};

export const extractTrainingPdf = async ({ file, departmentId }) => {
  const response = await fetch(`${API_BASE_URL}/pdf/extract?departmentId=${encodeURIComponent(departmentId)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/pdf',
      'x-file-name': file.name,
    },
    body: file,
  });
  const rawPayload = await response.text();
  const payload = rawPayload
    ? (() => {
        try {
          return JSON.parse(rawPayload);
        } catch {
          return { error: rawPayload || 'Resposta inválida do servidor.' };
        }
      })()
    : {};

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error ?? 'Não foi possível extrair as informações do PDF.');
  }

  return payload;
};

export const uploadTrainingImage = async (file) => {
  const response = await fetch(`${API_BASE_URL}/assets/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'image/jpeg',
      'x-file-name': file.name,
    },
    body: file,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error ?? 'Não foi possível enviar a imagem.');
  }

  return payload.asset;
};
