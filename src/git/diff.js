import { execSyncProcess } from '../utils/process.ts';
import { DEFAULT_BASE_BRANCH } from '../constants.ts';
export function getDiffFiles(baseBranch = DEFAULT_BASE_BRANCH) {
    const output = execSyncProcess(`git diff --relative --name-only --diff-filter=d ${baseBranch}...HEAD`);
    return output ? output.split('\n') : [];
}
export function getAllTrackedFiles(branch = DEFAULT_BASE_BRANCH) {
    const output = execSyncProcess(`git ls-tree -r ${branch} --name-only`);
    return output ? output.split('\n') : [];
}
