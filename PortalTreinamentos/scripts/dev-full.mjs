import { spawn } from 'node:child_process';

const run = (command, args, label, useShell = process.platform === 'win32') => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: useShell,
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${label} terminou com código ${code}`);
      process.exit(code);
    }
  });

  return child;
};

// Node executable does not need a shell wrapper, avoiding spacing issues on Windows
const backend = run(process.execPath, ['backend/server.mjs'], 'Backend', false);
// npm on Windows is a cmd/ps script, so it needs shell: true
const frontend = run('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173'], 'Frontend');

const shutdown = () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


