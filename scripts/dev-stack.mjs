import { spawn } from 'node:child_process';

const run = (label, command, args) => {
  const child = spawn(command, args, { stdio: 'pipe', shell: true });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${label}] ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${label}] ${chunk}`);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      process.stderr.write(`[${label}] exited with code ${code}\n`);
    }
  });

  return child;
};

const backend = run('backend', 'npm', ['run', 'server']);
const frontend = run('frontend', 'npm', ['run', 'dev']);

const shutdown = () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

