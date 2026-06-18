import { execSyncProcess } from '../utils/process.js';

export function checkBranchExists(branch: string, remote = ''): boolean {
  const command = remote
    ? `git ls-remote --heads ${remote} ${branch}`
    : `git branch --list ${branch}`;
  return !!execSyncProcess(command);
}
