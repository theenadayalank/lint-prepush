const { execSyncProcess } = require("./common");

module.exports = function fetchGitDiff( baseBranch = "master" ) {
  // git command to pull out the changed file names between current branch and base branch (Excluded delelted files which cannot be fetched now)
  let command = `git diff --relative --name-only --diff-filter=d ${baseBranch}...HEAD`;

  let committedGitFiles = execSyncProcess(command) || "";
  committedGitFiles = committedGitFiles.split('\n');
  return committedGitFiles;
};
