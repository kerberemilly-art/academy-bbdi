import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, '..');
const frontendDistDir = join(projectDir, 'dist');
const embeddedDistDir = join(projectDir, 'go-backend', 'dist');
const goBackendDir = join(projectDir, 'go-backend');
const binaryName = process.platform === 'win32' ? 'portal-treinamentos.exe' : 'portal-treinamentos';
const binaryPath = join(goBackendDir, binaryName);

const run = (command, args, label, options = {}) => new Promise((resolve, reject) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });

  child.on('exit', (code) => {
    if (code === 0) {
      resolve();
      return;
    }

    reject(new Error(`${label} terminou com código ${code ?? 'desconhecido'}`));
  });

  child.on('error', (error) => {
    reject(new Error(`${label} falhou: ${error.message}`));
  });
});

const syncFrontendBuild = () => {
  if (!existsSync(frontendDistDir)) {
    throw new Error('Build do frontend não encontrado em dist/.');
  }

  mkdirSync(embeddedDistDir, { recursive: true });
  cpSync(frontendDistDir, embeddedDistDir, { recursive: true, force: true });
};

const startBinary = () => {
  const child = spawn(binaryPath, [], {
    stdio: 'inherit',
    shell: false,
    cwd: goBackendDir,
    env: {
      ...process.env,
      PORT: process.env.PORT || '8787',
    },
  });

  const shutdown = () => {
    child.kill();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error(`Go backend falhou: ${error.message}`);
    process.exit(1);
  });
};

try {
  await run('npm', ['run', 'build'], 'Build do frontend', { cwd: projectDir });
  syncFrontendBuild();
  await run('go', ['build', '-o', binaryName, '.'], 'Build do backend Go', { cwd: goBackendDir });
  startBinary();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
