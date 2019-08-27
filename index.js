#!/usr/bin/env node

if (process.stdout.isTTY) {
  process.env.FORCE_COLOR = "1";
}

(function() {
  const Listr = require("listr");
  const chalk = require("chalk");
  const debug = require("debug")("lint-prepush:index");
  const os = require('os');
  const Cache = require("file-system-cache").default;

  const cache = Cache({
    basePath: `${os.homedir()}/.lint-prepush`, //Path where cache files are stored.
    ns: process.cwd() //A grouping namespace for items.
  });

  const success = chalk.keyword("green");
  const error = chalk.keyword("red");
  const warning = chalk.keyword("yellow");

  const { log } = console;

  const { userConfig, execChildProcess } = require("./utils/common");
  const resolveMainTask = require("./utils/resolveMainTask");
  const fetchGitDiff = require("./utils/fetchGitDiff");

  if(!userConfig) {
    process.exitCode = 1;
    log(error("\nLoading Configuration⚙️ Failed!😑\n"));
    return;
  }

  let { base : baseBranch = 'master', tasks = {} } = userConfig || {};
  debug('Base Branch:' + baseBranch);

  // Skip linter for base branch
  let getCurrentBranchCommand = 'git rev-parse --abbrev-ref HEAD';

  // we're going to use a Promise here because if we are on the baseBranch
  // we'll need to execute a `git remote | head -1` below to get the current
  // remote so we can compare the baseBranch to its remote counterpart
  let resolveBaseBranch = Promise.resolve(baseBranch);

  execChildProcess({ command: getCurrentBranchCommand })
    .then(currentBranch => {

      debug('Current Branch:' + currentBranch);

      if(currentBranch === baseBranch) {
        const getRemoteName = `git remote | head -1`;

        debug('Current Branch is Base Branch.');

        // since we're on our baseBranch, we'll redeclare our resolveBaseBranch
        // Promise from above so we can retrieve the remote and append it to
        // our baseBranch
        resolveBaseBranch = execChildProcess({ command: getRemoteName })
          .then((remote) => {
            const base = `${remote}/${baseBranch}`;
            debug('Base Branch:' + base);

            return base;
          })
          .catch(() => {
            log(error('\nCould not get the current branch\'s remote.\n'));
            process.exitCode = 1;
            return;
          });
      }

      execChildProcess({ command: 'git rev-parse HEAD' })
        .then((commitHash = '') => {
          debug('Curret Commit Hash:' + commitHash);

          let cachedCommitHash = cache.getSync("linted-hash") || "";
          debug('Cached Commit Hash:' + cachedCommitHash);

          if(commitHash === cachedCommitHash) {
            log(warning("\nNOTE: Skipping checks since the commit(s) have been linted already.\n"));
            return;
          }

          execChildProcess({ command: 'git rev-parse HEAD' })
            .then((commitHash = '') => {
              debug('Current Commit Hash:' + commitHash);

              let cachedCommitHash = cache.getSync("linted-hash") || "";
              debug('Cached Commit Hash:' + cachedCommitHash);

              if(commitHash === cachedCommitHash) {
                log(warning("\nNOTE: Skipping checks since the commit(s) have been linted already.\n"));
                return;
              }

              resolveBaseBranch.then((base) => {
                debug(`Using ${base} as base branch`);

                // Fetching committed git files
                fetchGitDiff( base ).then((committedGitFiles = []) => {
                  debug(committedGitFiles);
                  new Listr(resolveMainTask({ tasks, committedGitFiles }), {
                    exitOnError: false,
                    concurrent: true,
                    collapse: false
                  })
                    .run()
                    .then(() => {
                      cache.setSync("linted-hash", commitHash);
                      debug('Cached Current Commit Hash');
                      log(success("\nVoila! 🎉  Code is ready to be Shipped.\n"));
                    })
                    .catch(({ errors }) => {
                      process.exitCode = 1;
                      errors.forEach(err => {
                        console.error(err.customErrorMessage);
                      });
                    });
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
        .catch((message = '') => {
          process.exitCode = 1;
          log(warning(message));
        });
    })
    .catch(() => {
      log(error('\nCould not get the current Branch.\n'));
      process.exitCode = 1;
      return;
    });
})();
