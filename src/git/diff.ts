import { execSyncProcess } from '../utils/process.js';
import { DEFAULT_BASE_BRANCH } from '../constants.js';

export function getDiffFiles(baseBranch = DEFAULT_BASE_BRANCH): string[] {
  const output = execSyncProcess(
    `git diff --relative --name-only --diff-filter=d ${baseBranch}...HEAD`
  );
  return output ? output.split('\n') : [];
}

export function getAllTrackedFiles(branch = DEFAULT_BASE_BRANCH): string[] {
  const output = execSyncProcess(`git ls-tree -r ${branch} --name-only`);
  return output ? output.split('\n') : [];
}
