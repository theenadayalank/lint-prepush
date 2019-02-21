const { spawnChildProcess } = require("./common");

module.exports = function fetchGitDiff( baseBranch = "master" ) {

  // git command to pull out the changed file names between current branch and base branch (Excluded delelted files which cannot be fetched now)
  let command = `git diff --relative --name-only --diff-filter=d ${baseBranch}...HEAD`;

  return new Promise( (resolve, reject) => {
    spawnChildProcess({ command }, ({ hasErrors = false, output = '' }) => {
      let fileList = [];
      if (hasErrors) {
        reject(`\n Fetching committed file list process has been stopped with the following error: \n ${output}`);
      }
      output.split("\n").forEach(filename => {
        filename ? fileList.push(filename) : null;
      });
      resolve(fileList);
    });
  });
};
