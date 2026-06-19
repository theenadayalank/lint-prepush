import { execSyncProcess } from '../utils/process.ts';

export function getCurrentBranch(): string {
  return execSyncProcess('git rev-parse --abbrev-ref HEAD');
}

export function getUpstreamBranch(): string {
  // @{upstream} is git's own shorthand for the upstream of the current branch
  return execSyncProcess('git rev-parse --abbrev-ref @{upstream}');
}

export function getRemote(): string {
  return execSyncProcess('git remote | head -1');
}

export function getCommitHash(): string {
  return execSyncProcess('git rev-parse HEAD');
}
