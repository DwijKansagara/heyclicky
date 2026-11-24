import { readFile, rm, stat } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = path.resolve('.');
const distDir = path.join(projectRoot, 'dist');

// Read AntiDeploy application ID from .antideploy.json
const antideployConfig = JSON.parse(
  await readFile(path.join(projectRoot, '.antideploy.json'), 'utf8')
);
const appId = antideployConfig.applicationId;
if (!appId) {
  throw new Error('Missing applicationId in .antideploy.json');
}

// Read credential token safely from ~/.antideploy/config.json
const { token } = JSON.parse(
  await readFile(path.join(homedir(), '.antideploy', 'config.json'), 'utf8')
);

console.log(`Packaging dist/ for AntiDeploy application: ${appId}...`);
const archivePath = path.join(tmpdir(), `antideploy-static-${appId}.tar.gz`);
await rm(archivePath, { force: true });

const tar = spawnSync('tar.exe', ['-czf', archivePath, '.'], {
  cwd: distDir,
  stdio: 'inherit',
});

if (tar.status !== 0) {
  throw new Error(`tar.exe failed with exit code ${tar.status}`);
}

const archiveStat = await stat(archivePath);
console.log(`Archive packaged: ${(archiveStat.size / 1024).toFixed(1)} KB`);

// Upload archive to AntiDeploy
const archiveBlob = new Blob([await readFile(archivePath)]);
const form = new FormData();
form.append('archive', archiveBlob, 'site.tar.gz');

const headers = { Authorization: `Bearer ${token}` };

console.log('Sending deployment payload to AntiDeploy API...');
const deployResponse = await fetch(
  `https://antideploy.com/api/v1/deploy?applicationId=${appId}`,
  {
    method: 'POST',
    headers,
    body: form,
  }
);

if (!deployResponse.ok) {
  const errText = await deployResponse.text();
  throw new Error(`Deploy failed HTTP ${deployResponse.status}: ${errText}`);
}

const queued = await deployResponse.json();
console.log('Deploy response:', JSON.stringify(queued, null, 2));

if (queued.status === 'unchanged') {
  console.log('No deployment needed: source files unchanged.');
  process.exit(0);
}

const taskId = queued.taskId;
console.log(`Deployment queued with Task ID: ${taskId}`);

// Poll status until completion
let lastStatus = '';
const deadline = Date.now() + 15 * 60 * 1000;

while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 3000));

  const pollResponse = await fetch(
    `https://antideploy.com/api/v1/deployments/${taskId}`,
    { headers }
  );

  if (!pollResponse.ok) {
    console.warn(`Polling returned HTTP ${pollResponse.status}, retrying...`);
    continue;
  }

  const result = await pollResponse.json();

  if (result.status !== lastStatus) {
    console.log(`Status update: ${result.status}`);
    lastStatus = result.status;
  }

  if (result.status === 'succeeded' || result.status === 'live') {
    console.log('====================================');
    console.log('Deployment Succeeded!');
    console.log(`Live URL: https://heyclicky.antideploy.app`);
    console.log('====================================');
    process.exit(0);
  }

  if (result.status === 'failed') {
    console.error('Deployment Failed:', result.error || 'Unknown error');
    process.exit(1);
  }
}
