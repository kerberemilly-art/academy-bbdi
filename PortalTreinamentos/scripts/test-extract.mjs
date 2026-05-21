import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pdfPath = join(__dirname, '..', '..', '05 - MEMÓRIA', 'Treinamento Memoria Ram.pdf');

console.log('Loading PDF from:', pdfPath);
const pdfBuffer = readFileSync(pdfPath);
console.log('PDF size:', pdfBuffer.length, 'bytes');

// Let's call our backend API!
const response = await fetch('http://127.0.0.1:8787/api/pdf/extract?departmentId=marketing-produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/pdf',
    'x-file-name': 'Treinamento Memoria Ram.pdf',
  },
  body: pdfBuffer,
});

console.log('Response Status:', response.status);
const payload = await response.json();
console.log('Payload Status:', payload.status);
console.log('Payload Error:', payload.error);
console.log('Payload Organization Status:', payload.organizationStatus);
console.log('Payload Organization Error:', payload.organizationError);
console.log('Payload Suggestion Title:', payload.suggestion?.title);
console.log('Payload Suggestion Quiz Count:', payload.suggestion?.quizQuestions?.length);
