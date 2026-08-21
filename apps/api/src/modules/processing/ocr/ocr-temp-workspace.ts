import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

export const OCR_TEMP_PREFIX = 'libif-ocr-';

type CleanupOptions = {
  root?: string;
  now?: number;
  legacyStaleAgeMs?: number;
  isProcessAlive?: (pid: number) => boolean;
};

export async function createPrivateOcrWorkspace(root = os.tmpdir()): Promise<string> {
  const workspace = await fs.mkdtemp(path.join(root, `${OCR_TEMP_PREFIX}${process.pid}-`));
  await fs.chmod(workspace, 0o700);
  return workspace;
}

export async function writePrivateFile(filePath: string, contents: Buffer | string): Promise<void> {
  await fs.writeFile(filePath, contents, { mode: 0o600 });
  await fs.chmod(filePath, 0o600);
}

export async function makeFilesPrivate(filePaths: string[]): Promise<void> {
  await Promise.all(filePaths.map((filePath) => fs.chmod(filePath, 0o600)));
}

export async function cleanupAbandonedOcrWorkspaces(options: CleanupOptions = {}): Promise<number> {
  const root = options.root ?? os.tmpdir();
  const now = options.now ?? Date.now();
  const legacyStaleAgeMs = options.legacyStaleAgeMs ?? 60 * 60 * 1000;
  const isProcessAlive = options.isProcessAlive ?? processIsAlive;
  let entries;

  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return 0;
  }

  let removed = 0;
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith(OCR_TEMP_PREFIX)) continue;

    const workspacePath = path.join(root, entry.name);
    const ownerPid = workspaceOwnerPid(entry.name);
    const shouldRemove = ownerPid === undefined
      ? await isLegacyWorkspaceStale(workspacePath, now, legacyStaleAgeMs)
      : !isProcessAlive(ownerPid);

    if (!shouldRemove) continue;
    await fs.rm(workspacePath, { recursive: true, force: true });
    removed += 1;
  }

  return removed;
}

function workspaceOwnerPid(directoryName: string): number | undefined {
  const match = new RegExp(`^${OCR_TEMP_PREFIX}(\\d+)-`).exec(directoryName);
  if (!match) return undefined;
  const pid = Number.parseInt(match[1], 10);
  return Number.isSafeInteger(pid) && pid > 0 ? pid : undefined;
}

async function isLegacyWorkspaceStale(
  workspacePath: string,
  now: number,
  legacyStaleAgeMs: number
): Promise<boolean> {
  try {
    const stats = await fs.stat(workspacePath);
    return now - stats.mtimeMs >= legacyStaleAgeMs;
  } catch {
    return false;
  }
}

function processIsAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== 'ESRCH';
  }
}
