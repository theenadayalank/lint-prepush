const chalk = require("chalk");
const warning = chalk.keyword("orange");
const { log } = console;
const { spawnChildProcess } = require("./common");

module.exports = function fetchGitDiff( baseBranch = "master" ) {
  // git command to pull out the changed file names between current branch and master (Exclude delelted files which cannot be fetched now)
  let command = `git diff --name-only --diff-filter=d ${baseBranch}...HEAD`;

  return new Promise(resolve => {
    spawnChildProcess({ command }, ({ hasErrors = false, output = {} }) => {
      let fileList = [];
      if (hasErrors) {
        log(
          warning(
            `Fetching commited files process closed with errors: \n ${output.stderr}`
          )
        );
      } else {
        output.stdout.split("\n").forEach(filename => {
          filename ? fileList.push(filename) : null;
        });
      }
      resolve(fileList);
    });
  });
};
