const chalk = require("chalk");
const warning = chalk.keyword("orange");
const { log } = console;
const { spawnChildProcess } = require("./common");

module.exports = function fetchGitDiff(origin = "master") {
  // git command to push out the changed file names between current branch and master (Exclude delelted files which cannot be fetched now)
  let command = `git diff --name-only --diff-filter=d ${origin} HEAD`;

  return new Promise(resolve => {
    spawnChildProcess({ command }, ({ hasErrors, output }) => {
      let fileList = [];
      if (hasErrors) {
        log(
          warning(
            `Fetching GIT diff process closed with errors: \n ${output.stderr}`
          )
        );
        resolve(fileList);
      } else {
        output.stdout.split("\n").forEach(filename => {
          if (filename) {
            fileList.push(filename);
          }
        });
        resolve(fileList);
      }
    });
  });
};
