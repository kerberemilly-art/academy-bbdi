import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, '..');
const apiBaseUrl = process.env.IMPORT_API_BASE_URL ?? `http://127.0.0.1:${process.env.PORT || '8787'}/api`;
const sourceFiles = [
  join(projectDir, 'new_trainings.json'),
  join(projectDir, 'trainings.json'),
];

const decodeJsonFile = (filePath) => {
  const raw = readFileSync(filePath);
  const decoders = [];

  if (raw.length >= 2 && raw[0] === 0xff && raw[1] === 0xfe) {
    decoders.push(() => raw.toString('utf16le'));
  } else if (raw.length >= 2 && raw[0] === 0xfe && raw[1] === 0xff) {
    decoders.push(() => {
      const swapped = Buffer.from(raw);
      for (let index = 0; index < swapped.length - 1; index += 2) {
        const current = swapped[index];
        swapped[index] = swapped[index + 1];
        swapped[index + 1] = current;
      }
      return swapped.toString('utf16le');
    });
  }

  decoders.push(
    () => raw.toString('utf8'),
    () => raw.toString('latin1'),
  );

  for (const decode of decoders) {
    try {
      const text = decode().replace(/^\uFEFF/, '');
      return JSON.parse(text);
    } catch {
      // Try the next decoder variant.
    }
  }

  throw new Error(`Nao foi possivel ler ${filePath}.`);
};

const parseMaybeJson = (value, fallback) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
};

const repairText = (value) => {
  const text = String(value ?? '');

  if (!/[ÃÂâ€œâ€|â€™â€“]/.test(text)) {
    return text;
  }

  try {
    const repaired = Buffer.from(text, 'latin1').toString('utf8');
    return repaired.includes('\uFFFD') ? text : repaired;
  } catch {
    return text;
  }
};

const normalizeQuestion = (question, index) => {
  const options = Array.isArray(question?.options)
    ? question.options.map((option) => repairText(option).trim()).filter(Boolean).slice(0, 4)
    : [];
  const answerIndex = Number.isInteger(question?.answerIndex)
    ? question.answerIndex
    : Number.parseInt(question?.answerIndex ?? '-1', 10);

  if (!String(question?.question ?? '').trim() || options.length < 2 || answerIndex < 0 || answerIndex >= options.length) {
    return null;
  }

  return {
    id: String(question?.id ?? `q-${index + 1}`),
    question: repairText(question.question).trim(),
    options,
    answerIndex,
    explanation: repairText(question?.explanation ?? '').trim(),
  };
};

const normalizeTraining = (training, index) => {
  const quizQuestions = parseMaybeJson(training?.quizQuestions, [])
    .map(normalizeQuestion)
    .filter(Boolean);
  const contentBlocks = parseMaybeJson(training?.contentBlocks, []);

  return {
    id: String(training?.id ?? '').trim(),
    departmentId: String(training?.departmentId ?? '').trim(),
    title: repairText(training?.title).trim(),
    description: repairText(training?.description).trim(),
    createdAt: String(training?.createdAt ?? '').trim(),
    updatedAt: String(training?.updatedAt ?? '').trim(),
    status: training?.status === 'published' ? 'published' : 'draft',
    moduleId: String(training?.moduleId ?? '').trim(),
    level: String(training?.level ?? 'basico').trim() || 'basico',
    content: repairText(training?.content).trim(),
    quizQuestions,
    contentBlocks: Array.isArray(contentBlocks) ? contentBlocks : [],
    sourceIndex: index,
  };
};

const getTrainingKey = (training) => [
  training.departmentId,
  training.moduleId,
  training.level,
  repairText(training.title).toLowerCase(),
].join('::');

const getTrainingQualityScore = (training) => (
  (training.quizQuestions.length * 100)
  + (training.contentBlocks.length * 10)
  + (training.content ? 5 : 0)
  + (training.description ? 3 : 0)
  + (training.id ? 1 : 0)
);

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error ?? `Falha em ${path}.`);
  }

  return payload;
};

const dedupeExistingTrainings = async () => {
  const payload = await requestJson('/trainings');
  const existingTrainings = Array.isArray(payload.trainings) ? payload.trainings : [];
  const grouped = new Map();

  for (const training of existingTrainings) {
    const normalized = normalizeTraining(training, 0);
    const key = getTrainingKey(normalized);
    const current = grouped.get(key) ?? [];
    current.push({ raw: training, normalized });
    grouped.set(key, current);
  }

  let removed = 0;

  for (const entries of grouped.values()) {
    if (entries.length < 2) {
      continue;
    }

    entries.sort((left, right) => getTrainingQualityScore(right.normalized) - getTrainingQualityScore(left.normalized));

    for (const duplicate of entries.slice(1)) {
      await requestJson(`/trainings/${encodeURIComponent(duplicate.raw.id)}`, {
        method: 'DELETE',
      });
      removed += 1;
      console.log(`Duplicado removido: ${duplicate.raw.title}`);
    }
  }

  return removed;
};

const loadSourceTrainings = () => {
  const merged = new Map();

  for (const filePath of sourceFiles) {
    if (!existsSync(filePath)) {
      continue;
    }

    const payload = decodeJsonFile(filePath);
    const trainings = Array.isArray(payload?.trainings) ? payload.trainings : [];

    trainings
      .map(normalizeTraining)
      .filter((training) => training.departmentId && training.title)
      .forEach((training) => {
        const key = training.id || getTrainingKey(training);
        const current = merged.get(key);

        if (!current || getTrainingQualityScore(training) >= getTrainingQualityScore(current)) {
          merged.set(key, training);
        }
      });
  }

  return [...merged.values()];
};

const removedDuplicates = await dedupeExistingTrainings();
const existingPayload = await requestJson('/trainings');
const existingTrainings = Array.isArray(existingPayload.trainings) ? existingPayload.trainings : [];
const byId = new Map(existingTrainings.filter((training) => training?.id).map((training) => [String(training.id), training]));
const byKey = new Map(existingTrainings.map((training) => [getTrainingKey({
  departmentId: String(training?.departmentId ?? ''),
  moduleId: String(training?.moduleId ?? ''),
  level: String(training?.level ?? 'basico'),
  title: String(training?.title ?? ''),
}), training]));

const sourceTrainings = loadSourceTrainings();
let created = 0;
let updated = 0;
let skipped = 0;

for (const training of sourceTrainings) {
  if (!training.quizQuestions.length) {
    skipped += 1;
    console.log(`Pulando "${training.title}" por falta de quiz valido.`);
    continue;
  }

  const existing = (training.id && byId.get(training.id)) || byKey.get(getTrainingKey(training));
  const payload = {
    departmentId: training.departmentId,
    title: training.title,
    description: training.description,
    createdAt: training.createdAt,
    updatedAt: training.updatedAt,
    status: training.status,
    moduleId: training.moduleId,
    level: training.level,
    content: training.content,
    quizQuestions: training.quizQuestions,
    contentBlocks: training.contentBlocks,
  };

  if (existing) {
    await requestJson(`/trainings/${encodeURIComponent(existing.id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    updated += 1;
    console.log(`Atualizado: ${training.title}`);
  } else {
    await requestJson('/trainings', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        id: training.id,
      }),
    });
    created += 1;
    console.log(`Criado: ${training.title}`);
  }
}

const finalPayload = await requestJson('/trainings');
console.log(`Resumo: created=${created} updated=${updated} skipped=${skipped} deduped=${removedDuplicates} total=${finalPayload.trainings?.length ?? 0}`);
