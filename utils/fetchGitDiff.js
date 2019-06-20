const { execChildProcess } = require("./common");

module.exports = function fetchGitDiff( baseBranch = "master" ) {

  // git command to pull out the changed file names between current branch and base branch (Excluded delelted files which cannot be fetched now)
  let command = `git diff --relative --name-only --diff-filter=d ${baseBranch}`;

  return new Promise( (resolve, reject) => {
    return execChildProcess({ command })
      .then((result = '') => {
        let fileList = result.split('\n');
        resolve(fileList);
      })
      .catch((err) => {
        reject(`\n Fetching committed file list process has been stopped with the following error: \n ${err}`);
      });
  });
};
