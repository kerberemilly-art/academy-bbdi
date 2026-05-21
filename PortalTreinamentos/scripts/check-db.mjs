import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'backend', 'data', 'portal-treinamentos.sqlite');

const sqliteModule = await import('node:sqlite').catch(async () => {
  try {
    return await import('better-sqlite3');
  } catch {
    return null;
  }
});

if (!sqliteModule) {
  console.error('Nenhum driver SQLite disponível.');
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

const trainings = db.prepare('SELECT id, department_id, title, level, status FROM trainings').all();
console.log('--- Custom Trainings ---');
console.log(trainings);

const appState = db.prepare('SELECT id, updated_at FROM app_state WHERE id = 1').get();
console.log('--- App State ---');
console.log(appState);

const uploads = db.prepare('SELECT id, department_id, file_name, extraction_status FROM training_pdf_uploads').all();
console.log('--- PDF Uploads ---');
console.log(uploads);
