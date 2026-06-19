import { execSyncProcess } from '../utils/process.ts';
export function checkBranchExists(branch, remote = '') {
    const command = remote
        ? `git ls-remote --heads ${remote} ${branch}`
        : `git branch --list ${branch}`;
    return !!execSyncProcess(command);
}
