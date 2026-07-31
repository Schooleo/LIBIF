import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import {
  cleanupAbandonedOcrWorkspaces,
  createPrivateOcrWorkspace,
  makeFilesPrivate,
  writePrivateFile
} from './ocr-temp-workspace';

describe('OCR temporary workspace privacy', () => {
  let root: string;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'libif-ocr-workspace-test-'));
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it('creates private workspaces and private files', async () => {
    const workspace = await createPrivateOcrWorkspace(root);
    const input = path.join(workspace, 'input.pdf');
    const renderedPage = path.join(workspace, 'page-1.png');

    await writePrivateFile(input, Buffer.from('private document'));
    await fs.writeFile(renderedPage, 'rendered page', { mode: 0o644 });
    await makeFilesPrivate([renderedPage]);

    await expect(mode(workspace)).resolves.toBe(0o700);
    await expect(mode(input)).resolves.toBe(0o600);
    await expect(mode(renderedPage)).resolves.toBe(0o600);
  });

  it('removes dead-process and stale legacy workspaces but preserves active work', async () => {
    const dead = path.join(root, 'libif-ocr-999999-dead');
    const active = path.join(root, `libif-ocr-${process.pid}-active`);
    const staleLegacy = path.join(root, 'libif-ocr-prototype.old');
    const freshLegacy = path.join(root, 'libif-ocr-prototype.fresh');
    const unrelated = path.join(root, 'not-an-ocr-workspace');
    await Promise.all([dead, active, staleLegacy, freshLegacy, unrelated].map((directory) => fs.mkdir(directory)));
    const now = Date.now();
    const old = new Date(now - 2 * 60 * 60 * 1000);
    await fs.utimes(staleLegacy, old, old);

    const removed = await cleanupAbandonedOcrWorkspaces({
      root,
      now,
      legacyStaleAgeMs: 60 * 60 * 1000,
      isProcessAlive: (pid) => pid === process.pid
    });

    expect(removed).toBe(2);
    await expect(exists(dead)).resolves.toBe(false);
    await expect(exists(staleLegacy)).resolves.toBe(false);
    await expect(exists(active)).resolves.toBe(true);
    await expect(exists(freshLegacy)).resolves.toBe(true);
    await expect(exists(unrelated)).resolves.toBe(true);
  });
});

async function mode(target: string): Promise<number> {
  return (await fs.stat(target)).mode & 0o777;
}

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
