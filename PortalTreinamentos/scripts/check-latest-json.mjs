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

let db;
if (sqliteModule.DatabaseSync) {
  db = new sqliteModule.DatabaseSync(dbPath);
} else if (sqliteModule.default) {
  db = new sqliteModule.default(dbPath);
}

const row = db.prepare('SELECT file_name, extraction_status, extracted_json FROM training_pdf_uploads ORDER BY created_at DESC LIMIT 1').get();
console.log('--- LATEST UPLOAD ---');
if (row) {
  console.log('File Name:', row.file_name);
  console.log('Status:', row.extraction_status);
  try {
    const parsed = JSON.parse(row.extracted_json);
    console.log('Title:', parsed.title);
    console.log('Description:', parsed.description);
    console.log('Sections Count:', parsed.sections ? parsed.sections.length : (parsed.content ? 'has content' : 0));
    console.log('Quiz Questions Count:', parsed.quizQuestions ? parsed.quizQuestions.length : 0);
    console.log('Quiz Questions:', JSON.stringify(parsed.quizQuestions, null, 2));
  } catch (e) {
    console.log('Error parsing JSON:', e.message);
    console.log('Raw JSON:', row.extracted_json);
  }
} else {
  console.log('No uploads found.');
}
