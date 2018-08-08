#!/usr/bin/env node
const pkg = require("./package.json");
require("please-upgrade-node")(pkg);

if (process.stdout.isTTY) {
  process.env.FORCE_COLOR = "1";
}

(function() {
  const cgf = require("committed-git-files");
  const Listr = require("listr");
  const chalk = require("chalk");

  const warning = chalk.keyword("orange");
  const success = chalk.keyword("green");
  const { log } = console;

  const { loadConfig } = require("./utils/loadConfig");
  const resolveMainTask = require("./utils/resolveMainTask");

  loadConfig()
    .then(({ config = [] }) => {
      // Fetching committed git files
      cgf((err, committedGitFiles = []) => {
        new Listr(resolveMainTask({ config, committedGitFiles }), {
          exitOnError: false,
          concurrent: true
        })
          .run()
          .then(() => {
            log(success("Voila! 🎉 You code is ready to be Shipped."));
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
      warning("Loading Configuration⚙️ Failed!😑");
    });
})();
