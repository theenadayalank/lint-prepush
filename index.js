#!/usr/bin/env node
const pkg = require("./package.json");
require("please-upgrade-node")(pkg);

if (process.stdout.isTTY) {
  process.env.FORCE_COLOR = "1";
}

(function() {
  const Listr = require("listr");
  const chalk = require("chalk");
  const debug = require("debug")("lint-prepush:index");

  const success = chalk.keyword("green");
  const error = chalk.keyword("red");
  const { log } = console;

  const { loadConfig } = require("./utils/common");
  const resolveMainTask = require("./utils/resolveMainTask");
  const fetchGitDiff = require("./utils/fetchGitDiff");

  loadConfig()
    .then(({ config = {} } = {}) => {
      let { base : baseBranch = 'master', tasks = {} } = config;
      debug('Base Branch:' + baseBranch);
      // Fetching committed git files
      fetchGitDiff( baseBranch ).then((committedGitFiles = []) => {
        debug(committedGitFiles);
        new Listr(resolveMainTask({ tasks, committedGitFiles }), {
          exitOnError: false,
          concurrent: true
        })
          .run()
          .then(() => {
            log(success("Voila! 🎉 Code is ready to be Shipped."));
          })
          .catch(({ errors }) => {
            process.exitCode = 1;
            errors.forEach(err => {
              console.error(err.customErrorMessage);
            });
          });
      });
    })
    .catch(() => {
      process.exitCode = 1;
      log(error("Loading Configuration⚙️ Failed!😑"));
    });
})();
