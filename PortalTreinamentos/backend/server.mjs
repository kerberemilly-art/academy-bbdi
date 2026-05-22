import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleMentorRequest } from './mentorHandler.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(__dirname);
const dataDir = join(__dirname, 'data');
const uploadsDir = join(__dirname, 'uploads');
const dbPath = join(dataDir, 'portal-treinamentos.sqlite');
const port = Number(process.env.PORT ?? 8787);

mkdirSync(dataDir, { recursive: true });
mkdirSync(uploadsDir, { recursive: true });

const loadEnvFile = () => {
  const envPath = join(projectDir, '.env');

  if (!existsSync(envPath)) {
    return;
  }

  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .forEach((line) => {
      const separatorIndex = line.indexOf('=');
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
};

loadEnvFile();

const sqliteModule = await import('node:sqlite').catch(async () => {
  try {
    return await import('better-sqlite3');
  } catch {
    return null;
  }
});

if (!sqliteModule) {
  console.error('Nenhum driver SQLite disponível. Instale Node com node:sqlite ou adicione better-sqlite3.');
  process.exit(1);
}

let db;

if (sqliteModule.DatabaseSync) {
  db = new sqliteModule.DatabaseSync(dbPath);
} else if (sqliteModule.default) {
  db = new sqliteModule.default(dbPath);
} else {
  console.error('Driver SQLite não reconhecido.');
  process.exit(1);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS app_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    users_json TEXT NOT NULL DEFAULT '[]',
    results_json TEXT NOT NULL DEFAULT '[]',
    certificates_json TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

try {
  db.exec("ALTER TABLE app_state ADD COLUMN trainings_json TEXT NOT NULL DEFAULT '[]'");
} catch {
  // Column already exists.
}

try {
  db.exec("ALTER TABLE trainings ADD COLUMN quiz_questions_json TEXT NOT NULL DEFAULT '[]'");
} catch {
  // Column already exists.
}

try {
  db.exec("ALTER TABLE trainings ADD COLUMN module_id TEXT NOT NULL DEFAULT ''");
} catch {
  // Column already exists.
}

try {
  db.exec("ALTER TABLE trainings ADD COLUMN content_blocks_json TEXT NOT NULL DEFAULT '[]'");
} catch {
  // Column already exists.
}

db.exec(`
  INSERT OR IGNORE INTO app_state (id, users_json, results_json, certificates_json, trainings_json, updated_at)
  VALUES (1, '[]', '[]', '[]', '[]', datetime('now'));

  CREATE TABLE IF NOT EXISTS trainings (
    id TEXT PRIMARY KEY,
    department_id TEXT NOT NULL,
    module_id TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    content_blocks_json TEXT NOT NULL DEFAULT '[]',
    quiz_questions_json TEXT NOT NULL DEFAULT '[]',
    level TEXT NOT NULL DEFAULT 'basico',
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS training_pdf_uploads (
    id TEXT PRIMARY KEY,
    department_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    extraction_status TEXT NOT NULL,
    extracted_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  );
`);

const mapTrainingRow = (row) => ({
  id: row.id,
  departmentId: row.department_id,
  moduleId: row.module_id ?? '',
  title: row.title,
  description: row.description,
  content: row.content,
  contentBlocks: JSON.parse(row.content_blocks_json ?? '[]'),
  quizQuestions: JSON.parse(row.quiz_questions_json ?? '[]'),
  level: row.level,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getTrainingsFromTable = () => (
  db.prepare(`
    SELECT id, department_id, module_id, title, description, content, content_blocks_json, quiz_questions_json, level, status, created_at, updated_at
    FROM trainings
    ORDER BY datetime(created_at) DESC
  `).all().map(mapTrainingRow)
);

const replaceTrainingsInTable = (trainings) => {
  const safeTrainings = Array.isArray(trainings) ? trainings : [];
  const insertTraining = db.prepare(`
    INSERT INTO trainings (
      id, department_id, module_id, title, description, content, content_blocks_json, quiz_questions_json, level, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec('BEGIN');

  try {
    db.exec('DELETE FROM trainings');
    safeTrainings.forEach((training) => {
      if (!training?.id || !training?.departmentId || !training?.title) return;

      insertTraining.run(
        String(training.id),
        String(training.departmentId),
        String(training.moduleId ?? ''),
        String(training.title),
        String(training.description ?? ''),
        String(training.content ?? ''),
        JSON.stringify(Array.isArray(training.contentBlocks) ? training.contentBlocks : []),
        JSON.stringify(Array.isArray(training.quizQuestions) ? training.quizQuestions : []),
        String(training.level ?? 'basico'),
        training.status === 'published' ? 'published' : 'draft',
        String(training.createdAt ?? new Date().toISOString()),
        String(training.updatedAt ?? new Date().toISOString()),
      );
    });
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
};

const migrateTrainingsJsonToTable = () => {
  const existingTrainings = getTrainingsFromTable();

  if (existingTrainings.length > 0) {
    return;
  }

  const row = db.prepare('SELECT trainings_json FROM app_state WHERE id = 1').get();
  const trainings = JSON.parse(row?.trainings_json ?? '[]');

  if (Array.isArray(trainings) && trainings.length > 0) {
    replaceTrainingsInTable(trainings);
  }
};

migrateTrainingsJsonToTable();

const getState = () => {
  const row = db.prepare('SELECT users_json, results_json, certificates_json, trainings_json, updated_at FROM app_state WHERE id = 1').get();

  return {
    users: JSON.parse(row?.users_json ?? '[]'),
    results: JSON.parse(row?.results_json ?? '[]'),
    certificates: JSON.parse(row?.certificates_json ?? '[]'),
    trainings: getTrainingsFromTable(),
    updatedAt: row?.updated_at ?? null,
  };
};

const saveState = (state) => {
  const users = Array.isArray(state?.users) ? state.users : [];
  const results = Array.isArray(state?.results) ? state.results : [];
  const certificates = Array.isArray(state?.certificates) ? state.certificates : [];
  const trainings = getTrainingsFromTable();

  db.prepare(`
    UPDATE app_state
    SET users_json = ?,
        results_json = ?,
        certificates_json = ?,
        trainings_json = ?,
        updated_at = datetime('now')
    WHERE id = 1
  `).run(JSON.stringify(users), JSON.stringify(results), JSON.stringify(certificates), JSON.stringify(trainings));

  return getState();
};

const createId = (prefix) => `${prefix}-${randomUUID()}`;

const getTrainings = () => getTrainingsFromTable();

const saveTrainings = (trainings) => {
  replaceTrainingsInTable(trainings);
  db.prepare(`
    UPDATE app_state
    SET trainings_json = ?,
        updated_at = datetime('now')
    WHERE id = 1
  `).run(JSON.stringify(getTrainingsFromTable()));

  return getTrainingsFromTable();
};

const sanitizeBlockHtml = (value = '') => String(value ?? '')
  .slice(0, 12000)
  .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  .replace(/\son\w+="[^"]*"/gi, '')
  .replace(/\son\w+='[^']*'/gi, '')
  .replace(/\shref=(["'])javascript:[\s\S]*?\1/gi, ' href="#"')
  .replace(/\ssrc=(["'])javascript:[\s\S]*?\1/gi, ' src="#"');

const getSafeEmbedUrl = (value = '') => {
  const rawUrl = String(value ?? '').slice(0, 800).trim();
  if (!rawUrl) return '';

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if ((host === 'youtube.com' || host === 'm.youtube.com') && url.pathname === '/watch' && url.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${encodeURIComponent(url.searchParams.get('v'))}`;
    }
    if ((host === 'youtube.com' || host === 'm.youtube.com') && url.pathname.startsWith('/embed/')) {
      return `https://www.youtube.com${url.pathname}`;
    }
    if (host === 'youtu.be' && url.pathname.length > 1) {
      return `https://www.youtube.com/embed/${encodeURIComponent(url.pathname.slice(1))}`;
    }
    if (host === 'vimeo.com' && /^\/\d+/.test(url.pathname)) {
      return `https://player.vimeo.com/video/${url.pathname.match(/\d+/)[0]}`;
    }
    if (host === 'player.vimeo.com' && url.pathname.startsWith('/video/')) {
      return `https://player.vimeo.com${url.pathname}`;
    }
  } catch {
    return '';
  }

  return '';
};

const normalizeTypedContentBlock = (block, index) => {
  const id = String(block?.id ?? `block-${index + 1}`);
  const props = block?.props ?? {};

  if (block?.type === 'title') {
    const titleText = String(props.text ?? '').slice(0, 240).trim();
    return titleText ? { id, type: 'title', props: { text: titleText, level: Math.min(Math.max(Number(props.level) || 2, 1), 3) } } : null;
  }

  if (block?.type === 'image') {
    const imageUrl = String(props.imageUrl ?? '').slice(0, 1200).trim();
    return imageUrl ? { id, type: 'image', props: { imageUrl, imageAlt: String(props.imageAlt ?? '').slice(0, 240).trim() } } : null;
  }

  if (block?.type === 'link') {
    const label = String(props.label ?? '').slice(0, 240).trim();
    const url = String(props.url ?? '').slice(0, 1200).trim();
    return label && url ? { id, type: 'link', props: { label, url } } : null;
  }

  if (block?.type === 'table') {
    const columns = Array.isArray(props.columns) ? props.columns.map((cell) => String(cell ?? '').slice(0, 160).trim()).slice(0, 8) : [];
    const rows = Array.isArray(props.rows)
      ? props.rows.map((row) => columns.map((_, columnIndex) => String(row?.[columnIndex] ?? '').slice(0, 300).trim())).slice(0, 30)
      : [];
    const hasContent = columns.some(Boolean) || rows.flat().some(Boolean);
    return hasContent ? { id, type: 'table', props: { columns, rows } } : null;
  }

  if (block?.type === 'videoEmbed') {
    const url = String(props.url ?? '').slice(0, 800).trim();
    return url && getSafeEmbedUrl(url) ? { id, type: 'videoEmbed', props: { url, title: String(props.title ?? '').slice(0, 240).trim() } } : null;
  }

  if (block?.type === 'richText') {
    const content = sanitizeBlockHtml(props.content ?? '').trim();
    return content ? { id, type: 'richText', props: { content } } : null;
  }

  return null;
};

const normalizeContentBlocks = (blocks, fallbackBlocks = []) => {
  const source = Array.isArray(blocks) ? blocks : fallbackBlocks;

  return source
    .flatMap((block, index) => {
      const typedBlock = normalizeTypedContentBlock(block, index);
      if (typedBlock) {
        return [typedBlock];
      }

      const title = String(block?.title ?? '').trim();
      const text = String(block?.text ?? '').trim();
      const imageUrl = String(block?.imageUrl ?? '').trim();
      const imageAlt = String(block?.imageAlt ?? title ?? '').trim();

      if (!title && !text && !imageUrl) {
        return [];
      }

      return [
        title ? { id: `${String(block?.id ?? `block-${index + 1}`)}-title`, type: 'title', props: { text: title, level: 2 } } : null,
        text ? { id: `${String(block?.id ?? `block-${index + 1}`)}-text`, type: 'richText', props: { content: sanitizeBlockHtml(text.split(/\n{2,}/).map((part) => `<p>${part.replace(/\n/g, '<br />')}</p>`).join('')) } } : null,
        imageUrl ? { id: `${String(block?.id ?? `block-${index + 1}`)}-image`, type: 'image', props: { imageUrl, imageAlt } } : null,
      ].filter(Boolean);
    })
    .filter(Boolean)
    .slice(0, 60);
};
const normalizeTrainingPayload = (payload, existingTraining = {}) => ({
  ...existingTraining,
  title: String(payload?.title ?? existingTraining.title ?? '').trim(),
  description: String(payload?.description ?? existingTraining.description ?? '').trim(),
  content: String(payload?.content ?? existingTraining.content ?? '').trim(),
  contentBlocks: normalizeContentBlocks(payload?.contentBlocks, existingTraining.contentBlocks),
  quizQuestions: normalizeQuizQuestions(payload?.quizQuestions, existingTraining.quizQuestions),
  catalogImport: Boolean(payload?.catalogImport),
  level: String(payload?.level ?? existingTraining.level ?? 'basico'),
  status: payload?.status === 'published' ? 'published' : 'draft',
  departmentId: String(payload?.departmentId ?? existingTraining.departmentId ?? '').trim(),
  moduleId: payload?.moduleId !== undefined ? String(payload.moduleId).trim() : existingTraining.moduleId ?? '',
});

const validateTraining = (training) => {
  if (!training.title) return 'Informe o título do treinamento.';
  if (!training.departmentId) return 'Informe o departamento.';
  const minimumQuizQuestions = training.catalogImport ? 8 : 10;
  if (!Array.isArray(training.quizQuestions) || training.quizQuestions.length < minimumQuizQuestions) {
    return training.catalogImport
      ? 'O quiz do treinamento nativo precisa manter pelo menos oito perguntas.'
      : 'O quiz do treinamento precisa ter pelo menos dez perguntas.';
  }
  return null;
};

const normalizeQuizQuestions = (questions, fallbackQuestions = []) => {
  const source = Array.isArray(questions) ? questions : fallbackQuestions;

  return source
    .map((question, index) => {
      const questionText = String(question?.question ?? '').trim();
      const options = Array.isArray(question?.options)
        ? question.options.map((option) => String(option ?? '').trim()).filter(Boolean).slice(0, 4)
        : [];
      const answerIndex = Number.isInteger(question?.answerIndex)
        ? question.answerIndex
        : Number.parseInt(question?.answerIndex, 10);
      const explanation = String(question?.explanation ?? '').trim();

      if (!questionText || options.length < 2 || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) {
        return null;
      }

      return {
        id: String(question?.id ?? `q-${index + 1}`),
        question: questionText,
        options,
        answerIndex,
        explanation,
      };
    })
    .filter(Boolean)
    .slice(0, 20);
};

const sanitizeFileName = (fileName) => (
  String(fileName || 'treinamento.pdf')
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140) || 'treinamento.pdf'
);


const sanitizeImageFileName = (fileName) => (
  String(fileName || 'imagem-treinamento')
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'imagem-treinamento'
);

const getImageExtension = (contentType, fileName) => {
  const extension = String(fileName ?? '').match(/\.(png|jpe?g|webp|gif)$/i)?.[1]?.toLowerCase();
  if (extension) return extension === 'jpeg' ? 'jpg' : extension;
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  return 'jpg';
};

const getAssetContentType = (fileName) => {
  const lower = String(fileName).toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
};
const normalizeExtractionSuggestion = (payload, fileName) => {
  const pageMarkdown = Array.isArray(payload?.pages)
    ? payload.pages.map((page) => page?.markdown).filter(Boolean).join('\n\n')
    : '';
  const text = String(payload?.text ?? payload?.content ?? payload?.markdown ?? pageMarkdown);
  const summary = String(payload?.summary ?? payload?.description ?? '').trim();
  const firstHeading = text.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const title = String(payload?.title ?? payload?.name ?? firstHeading ?? fileName.replace(/\.pdf$/i, '')).trim();
  const keyPoints = Array.isArray(payload?.keyPoints)
    ? payload.keyPoints
    : Array.isArray(payload?.key_points)
      ? payload.key_points
      : [];

  return {
    title,
    description: summary || text.slice(0, 280),
    content: text || JSON.stringify(payload, null, 2),
    keyPoints,
    raw: payload,
  };
};

const parseJsonObjectFromText = (value) => {
  const text = String(value ?? '').trim();

  if (!text) {
    return null;
  }

  const withoutFence = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch {
    const firstBrace = withoutFence.indexOf('{');
    const lastBrace = withoutFence.lastIndexOf('}');

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
  }

  return null;
};

const normalizeOrganizedTraining = (payload, fallbackSuggestion) => {
  const content = Array.isArray(payload?.sections)
    ? payload.sections
        .map((section) => {
          const title = String(section?.title ?? '').trim();
          const body = Array.isArray(section?.items)
            ? section.items.map((item) => `- ${String(item).trim()}`).join('\n')
            : String(section?.body ?? '').trim();

          return [title ? `## ${title}` : '', body].filter(Boolean).join('\n');
        })
        .filter(Boolean)
        .join('\n\n')
    : String(payload?.content ?? fallbackSuggestion.content ?? '').trim();

  return {
    ...fallbackSuggestion,
    title: String(payload?.title ?? fallbackSuggestion.title ?? '').trim(),
    description: String(payload?.description ?? fallbackSuggestion.description ?? '').trim(),
    content,
    keyPoints: Array.isArray(payload?.keyPoints) ? payload.keyPoints : fallbackSuggestion.keyPoints ?? [],
    quizQuestions: Array.isArray(payload?.quizQuestions) ? payload.quizQuestions : [],
    raw: {
      ocr: fallbackSuggestion.raw,
      organized: payload,
    },
  };
};

const compactTrainingText = (text, maxChars = 12000) => {
  const normalizedText = String(text ?? '')
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (normalizedText.length <= maxChars) {
    return normalizedText;
  }

  const headings = normalizedText
    .split('\n')
    .filter((line) => /^#{1,3}\s+/.test(line) || /^\d+\)/.test(line) || /^[-*]\s+/.test(line))
    .join('\n')
    .slice(0, Math.floor(maxChars * 0.45));
  const beginning = normalizedText.slice(0, Math.floor(maxChars * 0.45));
  const ending = normalizedText.slice(-Math.floor(maxChars * 0.1));

  return [beginning, headings, ending]
    .filter(Boolean)
    .join('\n\n---\n\n')
    .slice(0, maxChars);
};

const organizeTrainingWithGroq = async ({ suggestion, departmentId, fileName }) => {
  const apiKey = process.env.GROQ_API_KEY;
  const apiUrl = process.env.GROQ_CHAT_URL ?? 'https://api.groq.com/openai/v1/chat/completions';
  const model = process.env.GROQ_TRAINING_MODEL ?? 'llama-3.3-70b-versatile';

  if (!apiKey || !suggestion?.content) {
    return {
      status: apiKey ? 'skipped' : 'configuration_missing',
      suggestion,
    };
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_completion_tokens: 4000,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'Você é um especialista em design instrucional e treinamento corporativo de alto impacto.',
            'Seu objetivo é organizar conteúdos internos técnicos em materiais de estudo extremamente didáticos, visualmente atraentes e profissionais (em português do Brasil).',
            'Responda estritamente com um objeto JSON válido seguindo o esquema solicitado.',
            'Diretrizes de formatação estética e conteúdo:',
            '1. Título: Crie um título profissional, claro e motivador.',
            '2. Descrição: Resumo curto (até 300 caracteres) em markdown simples, usando termos em negrito para destacar os objetivos de aprendizado.',
            '3. Conteúdo das Seções (sections): Divida em 3 a 5 seções lógicas. Para cada seção, forneça um título claro ("title") e um array de itens ("items") com explicações ricas em Markdown. Use emojis temáticos, termos em negrito para novos conceitos, e destaque pontos cruciais ou alertas importantes usando blocos de citação (ex: "> 💡 **Dica:** ..." ou "> ⚠️ **Importante:** ...") para tornar a leitura dinâmica e agradável.',
            '4. Pontos-chave (keyPoints): Forneça de 3 a 5 insights práticos ou regras cruciais de fácil memorização, usando negrito e emojis relevantes.',
            '5. Quiz de Revisão (quizQuestions): Inclua obrigatoriamente exatamente 10 perguntas de quiz robustas, inteligentes e bem variadas com base em todo o conteúdo técnico e informações extraídas do PDF original. Nenhuma pergunta deve ser idêntica ou repetida e cada uma deve focar em um aspecto técnico, compatibilidade ou detalhe diferente apresentado no texto. Cada pergunta deve conter "question", "options" (exatamente 4 alternativas bem formuladas), "answerIndex" (0 a 3) e uma explicação didática e clara em "explanation" justificando a resposta correta.',
            'Atenção técnica: Seja 100% fiel às informações extraídas do documento original (voltagens, pinagens, compatibilidades). Nunca invente dados falsos ou códigos técnicos que não estejam no PDF.',
          ].join(' '),
        },
        {
          role: 'user',
          content: JSON.stringify({
            departmentId,
            fileName,
            expectedSchema: {
              title: 'string',
              description: 'string com ate 300 caracteres, em markdown com termos em negrito',
              sections: [{ title: 'string', items: ['string contendo rico conteudo em markdown (negritos, emojis, blocos de citacao >)'] }],
              keyPoints: ['string com negrito e emojis'],
              quizQuestions: [
                {
                  question: 'Primeira pergunta técnica baseada no PDF original',
                  options: ['Alternativa 1', 'Alternativa 2', 'Alternativa 3', 'Alternativa 4'],
                  answerIndex: 0,
                  explanation: 'Explicação detalhada e amigável da resposta 1'
                },
                {
                  question: 'Segunda pergunta técnica (gere exatamente 10 perguntas técnicas diferentes e robustas no total deste array)',
                  options: ['Alternativa 1', 'Alternativa 2', 'Alternativa 3', 'Alternativa 4'],
                  answerIndex: 1,
                  explanation: 'Explicação detalhada e amigável da resposta 2'
                }
              ],
            },
            ocrText: compactTrainingText(suggestion.content),
          }),
        },
      ],
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      status: 'failed',
      suggestion,
      error: payload?.error?.message ?? payload?.message ?? 'A Groq recusou o tratamento do treinamento.',
    };
  }

  const content = payload?.choices?.[0]?.message?.content;
  const organizedPayload = parseJsonObjectFromText(content);

  if (!organizedPayload) {
    return {
      status: 'failed',
      suggestion,
      error: 'A Groq não retornou JSON válido para o treinamento.',
    };
  }

  return {
    status: 'organized',
    suggestion: normalizeOrganizedTraining(organizedPayload, suggestion),
  };
};

const extractPdfWithMistral = async ({ pdfBuffer, fileName }) => {
  const apiKey = process.env.MISTRAL_API_KEY ?? process.env.PDF_EXTRACT_API_KEY;
  const apiUrl = process.env.MISTRAL_OCR_URL ?? 'https://api.mistral.ai/v1/ocr';
  const model = process.env.MISTRAL_OCR_MODEL ?? 'mistral-ocr-latest';

  if (!apiKey) {
    return {
      status: 'configuration_missing',
      suggestion: {
        title: fileName.replace(/\.pdf$/i, ''),
        description: '',
        content: '',
        keyPoints: [],
        raw: {
          message: 'Configure MISTRAL_API_KEY no .env para ativar a leitura automática com Mistral OCR.',
        },
      },
    };
  }

  const base64Pdf = pdfBuffer.toString('base64');
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      document: {
        type: 'document_url',
        document_url: `data:application/pdf;base64,${base64Pdf}`,
      },
      include_image_base64: false,
      table_format: 'markdown',
    }),
  });
  const rawResponse = await response.text();
  let payload;

  try {
    payload = rawResponse ? JSON.parse(rawResponse) : {};
  } catch {
    payload = { text: rawResponse };
  }

  if (!response.ok) {
    return {
      status: 'failed',
      suggestion: normalizeExtractionSuggestion(payload, fileName),
      error: payload?.error?.message ?? payload?.error ?? payload?.message ?? 'A Mistral recusou o PDF.',
    };
  }

  return {
    status: 'extracted',
    suggestion: normalizeExtractionSuggestion(payload, fileName),
  };
};

const extractPdfWithProvider = async ({ pdfBuffer, fileName }) => {
  const provider = process.env.PDF_EXTRACT_PROVIDER ?? (process.env.MISTRAL_API_KEY ? 'mistral' : 'generic');

  if (provider === 'mistral') {
    return extractPdfWithMistral({ pdfBuffer, fileName });
  }

  const apiUrl = process.env.PDF_EXTRACT_API_URL;
  const apiKey = process.env.PDF_EXTRACT_API_KEY;
  const authMode = process.env.PDF_EXTRACT_AUTH_MODE ?? 'header';
  const apiHeader = process.env.PDF_EXTRACT_API_HEADER ?? 'x-api-key';

  if (!apiUrl || !apiKey) {
    return {
      status: 'configuration_missing',
      suggestion: {
        title: fileName.replace(/\.pdf$/i, ''),
        description: '',
        content: '',
        keyPoints: [],
        raw: {
          message: 'Configure PDF_EXTRACT_API_URL e PDF_EXTRACT_API_KEY no .env para ativar a extração automática.',
        },
      },
    };
  }

  const headers = {
    'Content-Type': 'application/pdf',
    'x-file-name': fileName,
  };

  if (authMode === 'bearer') {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    headers[apiHeader] = apiKey;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: pdfBuffer,
  });
  const rawResponse = await response.text();
  let payload;

  try {
    payload = rawResponse ? JSON.parse(rawResponse) : {};
  } catch {
    payload = { text: rawResponse };
  }

  if (!response.ok) {
    return {
      status: 'failed',
      suggestion: normalizeExtractionSuggestion(payload, fileName),
      error: payload?.error ?? payload?.message ?? 'A API de extração recusou o PDF.',
    };
  }

  return {
    status: 'extracted',
    suggestion: normalizeExtractionSuggestion(payload, fileName),
  };
};

const savePdfExtraction = ({ departmentId, fileName, filePath, fileSize, extraction }) => {
  const document = {
    id: createId('pdf'),
    departmentId,
    fileName,
    filePath,
    fileSize,
    extractionStatus: extraction.status,
    extractedJson: extraction.suggestion,
    createdAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO training_pdf_uploads (
      id, department_id, file_name, file_path, file_size, extraction_status, extracted_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    document.id,
    document.departmentId,
    document.fileName,
    document.filePath,
    document.fileSize,
    document.extractionStatus,
    JSON.stringify(document.extractedJson),
    document.createdAt,
  );

  return document;
};

const getClientSuggestion = (suggestion) => ({
  title: String(suggestion?.title ?? '').slice(0, 160),
  description: String(suggestion?.description ?? '').slice(0, 600),
  content: String(suggestion?.content ?? '').slice(0, 12000),
  keyPoints: Array.isArray(suggestion?.keyPoints) ? suggestion.keyPoints.slice(0, 8) : [],
  quizQuestions: Array.isArray(suggestion?.quizQuestions) ? suggestion.quizQuestions.slice(0, 20) : [],
});

const getClientDocument = (document) => ({
  id: document.id,
  departmentId: document.departmentId,
  fileName: document.fileName,
  fileSize: document.fileSize,
  extractionStatus: document.extractionStatus,
  createdAt: document.createdAt,
});

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,x-file-name',
  });
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readBodyBuffer = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,x-file-name',
    });
    res.end();
    return;
  }

  if (req.url?.startsWith('/uploads/') && req.method === 'GET') {
    const requestedName = decodeURIComponent(req.url.replace(/^\/uploads\//, '').split('?')[0] ?? '');
    const safeName = sanitizeImageFileName(requestedName);
    const filePath = join(uploadsDir, safeName);

    if (!safeName || !existsSync(filePath)) {
      sendJson(res, 404, { ok: false, error: 'Imagem não encontrada.' });
      return;
    }

    res.writeHead(200, {
      'Content-Type': getAssetContentType(safeName),
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    res.end(readFileSync(filePath));
    return;
  }

  if (req.url === '/api/assets/upload' && req.method === 'POST') {
    const contentType = String(req.headers['content-type'] ?? '');
    const originalName = sanitizeImageFileName(req.headers['x-file-name']);

    if (!contentType.startsWith('image/')) {
      sendJson(res, 400, { ok: false, error: 'Envie uma imagem válida.' });
      return;
    }

    const imageBuffer = await readBodyBuffer(req);
    const maxSize = 5 * 1024 * 1024;

    if (!imageBuffer.length || imageBuffer.length > maxSize) {
      sendJson(res, 400, { ok: false, error: 'A imagem precisa ter até 5 MB.' });
      return;
    }

    const extension = getImageExtension(contentType, originalName);
    const baseName = originalName.replace(/\.(png|jpe?g|webp|gif)$/i, '') || 'imagem-treinamento';
    const storedFileName = `${createId('asset')}-${baseName}.${extension}`;
    const filePath = join(uploadsDir, storedFileName);

    writeFileSync(filePath, imageBuffer);
    sendJson(res, 201, {
      ok: true,
      asset: {
        fileName: storedFileName,
        url: `/uploads/${encodeURIComponent(storedFileName)}`,
      },
    });
    return;
  }
  if (req.url === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true, port });
    return;
  }

  if (req.url === '/api/state' && req.method === 'GET') {
    sendJson(res, 200, getState());
    return;
  }

  if (req.url === '/api/state' && req.method === 'PUT') {
    const body = await parseBody(req);

    if (body === null) {
      sendJson(res, 400, { ok: false, error: 'JSON inválido.' });
      return;
    }

    sendJson(res, 200, { ok: true, state: saveState(body) });
    return;
  }

  if (req.url === '/api/trainings' && req.method === 'GET') {
    sendJson(res, 200, { trainings: getTrainings() });
    return;
  }

  if (req.url === '/api/trainings' && req.method === 'POST') {
    const body = await parseBody(req);

    if (body === null) {
      sendJson(res, 400, { ok: false, error: 'JSON inválido.' });
      return;
    }

    const training = {
      ...normalizeTrainingPayload(body),
      id: createId('training'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const validationError = validateTraining(training);

    if (validationError) {
      sendJson(res, 400, { ok: false, error: validationError });
      return;
    }

    const trainings = saveTrainings([...getTrainings(), training]);
    sendJson(res, 201, { ok: true, training, trainings });
    return;
  }

  const trainingMatch = req.url?.match(/^\/api\/trainings\/([^/?]+)$/);

  if (trainingMatch && req.method === 'PUT') {
    const body = await parseBody(req);

    if (body === null) {
      sendJson(res, 400, { ok: false, error: 'JSON inválido.' });
      return;
    }

    const trainingId = decodeURIComponent(trainingMatch[1]);
    const existingTraining = getTrainings().find((training) => training.id === trainingId);

    if (!existingTraining) {
      sendJson(res, 404, { ok: false, error: 'Treinamento não encontrado.' });
      return;
    }

    const updatedTraining = {
      ...normalizeTrainingPayload(body, existingTraining),
      id: trainingId,
      createdAt: existingTraining.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const validationError = validateTraining(updatedTraining);

    if (validationError) {
      sendJson(res, 400, { ok: false, error: validationError });
      return;
    }

    const trainings = saveTrainings(getTrainings().map((training) => (
      training.id === trainingId ? updatedTraining : training
    )));
    sendJson(res, 200, { ok: true, training: updatedTraining, trainings });
    return;
  }

  if (trainingMatch && req.method === 'DELETE') {
    const trainingId = decodeURIComponent(trainingMatch[1]);
    const trainings = getTrainings();
    const nextTrainings = trainings.filter((training) => training.id !== trainingId);

    if (nextTrainings.length === trainings.length) {
      sendJson(res, 404, { ok: false, error: 'Treinamento não encontrado.' });
      return;
    }

    sendJson(res, 200, { ok: true, trainings: saveTrainings(nextTrainings) });
    return;
  }

  if (req.url?.startsWith('/api/pdf/extract') && req.method === 'POST') {
    const requestUrl = new URL(req.url, `http://${req.headers.host ?? '127.0.0.1'}`);
    const departmentId = String(requestUrl.searchParams.get('departmentId') ?? '').trim();
    const fileName = sanitizeFileName(req.headers['x-file-name']);
    const contentType = String(req.headers['content-type'] ?? '');

    if (!departmentId) {
      sendJson(res, 400, { ok: false, error: 'Informe o departamento do PDF.' });
      return;
    }

    if (!contentType.includes('application/pdf')) {
      sendJson(res, 400, { ok: false, error: 'Envie um arquivo PDF válido.' });
      return;
    }

    const pdfBuffer = await readBodyBuffer(req);
    const maxSize = 15 * 1024 * 1024;

    if (!pdfBuffer.length || pdfBuffer.length > maxSize) {
      sendJson(res, 400, { ok: false, error: 'O PDF precisa ter até 15 MB.' });
      return;
    }

    const documentId = createId('upload');
    const storedFileName = `${documentId}-${fileName}`;
    const filePath = join(uploadsDir, storedFileName);

    writeFileSync(filePath, pdfBuffer);

    try {
      const extraction = await extractPdfWithProvider({ pdfBuffer, fileName });
      const organization = extraction.status === 'extracted'
        ? await organizeTrainingWithGroq({
            suggestion: extraction.suggestion,
            departmentId,
            fileName,
          })
        : { status: 'skipped', suggestion: extraction.suggestion };
      const finalExtraction = {
        ...extraction,
        status: organization.status === 'organized' ? 'organized' : extraction.status,
        suggestion: organization.suggestion,
        organizationStatus: organization.status,
        organizationError: organization.error,
      };
      const document = savePdfExtraction({
        departmentId,
        fileName,
        filePath,
        fileSize: pdfBuffer.length,
        extraction: finalExtraction,
      });

      sendJson(res, extraction.status === 'failed' ? 502 : 200, {
        ok: extraction.status !== 'failed',
        document: getClientDocument(document),
        suggestion: getClientSuggestion(finalExtraction.suggestion),
        status: finalExtraction.status,
        organizationStatus: finalExtraction.organizationStatus,
        organizationError: finalExtraction.organizationError,
        error: extraction.error,
      });
    } catch (error) {
      const extraction = {
        status: 'failed',
        suggestion: {
          title: fileName.replace(/\.pdf$/i, ''),
          description: '',
          content: '',
          keyPoints: [],
          raw: { message: error.message },
        },
        error: error.message,
      };
      const document = savePdfExtraction({
        departmentId,
        fileName,
        filePath,
        fileSize: pdfBuffer.length,
        extraction,
      });

      sendJson(res, 502, {
        ok: false,
        document: getClientDocument(document),
        suggestion: getClientSuggestion(extraction.suggestion),
        status: 'failed',
        error: error.message,
      });
    }
    return;
  }

  if (req.url === '/api/mentor' && req.method === 'POST') {
    await handleMentorRequest({ req, res, parseBody, sendJson });
    return;
  }

  sendJson(res, 404, { ok: false, error: 'Rota não encontrada.' });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Backend SQLite ativo em http://127.0.0.1:${port}`);
});
