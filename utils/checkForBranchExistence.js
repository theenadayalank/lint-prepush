const { execSyncProcess } = require('./common');

module.exports = function checkForBranchExistence(branch = 'master', remote = '') {
  // check whether branch exists local
  let command = `git branch --list ${branch}`;
  if (remote) {
    // check whether branch exists in remote repo
    command = `git ls-remote --heads ${remote} ${branch}`;
  }
  let isExisted = execSyncProcess(command) || '';
  return !!isExisted;
};
