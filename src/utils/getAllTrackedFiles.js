import { execSyncProcess } from './common.js';

// constants
import { DEFAULT_BASE_BRANCH } from '../constants.js';

export default function getAllTrackedFiles(branch = DEFAULT_BASE_BRANCH) {
  let command = `git ls-tree -r ${branch} --name-only`;

  let committedGitFiles = execSyncProcess(command) || '';
  committedGitFiles = committedGitFiles.split('\n');
  return committedGitFiles;
};
