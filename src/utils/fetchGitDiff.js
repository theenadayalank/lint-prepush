import { execSyncProcess } from './common.js';

// constants
import { DEFAULT_BASE_BRANCH } from '../constants.js';

export default function fetchGitDiff(baseBranch = DEFAULT_BASE_BRANCH ) {
  // git command to pull out the changed file names between current branch and base branch (Excluded delelted files which cannot be fetched now)
  let command = `git diff --relative --name-only --diff-filter=d ${baseBranch}...HEAD`;

  let committedGitFiles = execSyncProcess(command) || "";
  committedGitFiles = committedGitFiles.split('\n');
  return committedGitFiles;
};
