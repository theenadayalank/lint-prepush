#!/usr/bin/env node

if (process.stdout.isTTY) {
  process.env.FORCE_COLOR = "1";
}

(function() {
  const Listr = require("listr");
  const chalk = require("chalk");
  const debug = require("debug")("lint-prepush:index");

  const success = chalk.keyword("green");
  const error = chalk.keyword("red");
  const warning = chalk.keyword("yellow");

  const { log } = console;

  const { loadConfig, spawnChildProcess } = require("./utils/common");
  const resolveMainTask = require("./utils/resolveMainTask");
  const fetchGitDiff = require("./utils/fetchGitDiff");

  loadConfig()
    .then(({ config = {} } = {}) => {
      let { base : baseBranch = 'master', tasks = {} } = config;
      debug('Base Branch:' + baseBranch);

      // Skip linter for base branch
      let getCurrentBranchCommand = 'git rev-parse --abbrev-ref HEAD';
      spawnChildProcess({ command : getCurrentBranchCommand }, ({ hasErrors = false, output = '' }) => {
        let currentBranch = (output.split('\n') || [])[0];
        if (hasErrors) {
          log(error('\nCould not get the current Branch.\n'));
          process.exitCode = 1;
          return;
        }

        if(currentBranch === baseBranch) {
          log(warning("\nNOTE: Skipping the Lintners since you are in the base branch\n"));
          return;
        }

        // Fetching committed git files
        fetchGitDiff( baseBranch ).then((committedGitFiles = []) => {
          debug(committedGitFiles);
          new Listr(resolveMainTask({ tasks, committedGitFiles }), {
            exitOnError: false,
            concurrent: true
          })
            .run()
            .then(() => {
              log(success("\nVoila! 🎉  Code is ready to be Shipped.\n"));
            })
            .catch(({ errors }) => {
              process.exitCode = 1;
              errors.forEach(err => {
                console.error(err.customErrorMessage);
              });
            });
        })
        .catch((message = '') => {
          process.exitCode = 1;
          log(warning(message));
        });

      });
    })
    .catch(() => {
      process.exitCode = 1;
      log(error("Loading Configuration⚙️ Failed!😑"));
    });
})();
