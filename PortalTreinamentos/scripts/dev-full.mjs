import { spawn } from 'node:child_process';

const run = (command, args, label) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${label} terminou com código ${code}`);
      process.exit(code);
    }
  });

  return child;
};

const backend = run(process.execPath, ['backend/server.mjs'], 'Backend');
const frontend = run('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173'], 'Frontend');

const shutdown = () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

