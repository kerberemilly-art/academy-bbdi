import { createServer } from 'node:http';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');
const dbPath = join(dataDir, 'portal-treinamentos.sqlite');
const port = Number(process.env.PORT ?? 8787);

mkdirSync(dataDir, { recursive: true });

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

  INSERT OR IGNORE INTO app_state (id, users_json, results_json, certificates_json, updated_at)
  VALUES (1, '[]', '[]', '[]', datetime('now'));
`);

const getState = () => {
  const row = db.prepare('SELECT users_json, results_json, certificates_json, updated_at FROM app_state WHERE id = 1').get();

  return {
    users: JSON.parse(row?.users_json ?? '[]'),
    results: JSON.parse(row?.results_json ?? '[]'),
    certificates: JSON.parse(row?.certificates_json ?? '[]'),
    updatedAt: row?.updated_at ?? null,
  };
};

const saveState = (state) => {
  const users = Array.isArray(state?.users) ? state.users : [];
  const results = Array.isArray(state?.results) ? state.results : [];
  const certificates = Array.isArray(state?.certificates) ? state.certificates : [];

  db.prepare(`
    UPDATE app_state
    SET users_json = ?,
        results_json = ?,
        certificates_json = ?,
        updated_at = datetime('now')
    WHERE id = 1
  `).run(JSON.stringify(users), JSON.stringify(results), JSON.stringify(certificates));

  return getState();
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
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

  sendJson(res, 404, { ok: false, error: 'Rota não encontrada.' });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Backend SQLite ativo em http://127.0.0.1:${port}`);
});

