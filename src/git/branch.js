import { execSyncProcess } from '../utils/process.ts';
export function getCurrentBranch() {
    return execSyncProcess('git rev-parse --abbrev-ref HEAD');
}
export function getUpstreamBranch() {
    // @{upstream} is git's own shorthand for the upstream of the current branch
    return execSyncProcess('git rev-parse --abbrev-ref @{upstream}');
}
export function getRemote() {
    return execSyncProcess('git remote | head -1');
}
export function getCommitHash() {
    return execSyncProcess('git rev-parse HEAD');
}
