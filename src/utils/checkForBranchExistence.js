import { execSyncProcess } from './common.js';

// constants
import { DEFAULT_BASE_BRANCH } from '../constants.js';

export default function checkForBranchExistence(branch = DEFAULT_BASE_BRANCH, remote = '') {
  // check whether branch exists local
  let command = `git branch --list ${branch}`;
  if (remote) {
    // check whether branch exists in remote repo
    command = `git ls-remote --heads ${remote} ${branch}`;
  }
  let isExisted = execSyncProcess(command) || '';
  return !!isExisted;
};
