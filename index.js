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
    basePath: `${os.homedir()}/.lint-prepush`, // Path where cache files are stored.
    ns: process.cwd() // A grouping namespace for items.
  });

  const success = chalk.keyword("green");
  const error = chalk.keyword("red");
  const warning = chalk.keyword("yellow");

  const { log } = console;

  const { userConfig, execSyncProcess } = require("./utils/common");
  const resolveMainTask = require("./utils/resolveMainTask");
  const fetchGitDiff = require("./utils/fetchGitDiff");
  const checkForBranchExistence = require('./utils/checkForBranchExistence');
  const getAllTrackedFiles = require('./utils/getAllTrackedFiles');

  if(!userConfig) {
    process.exitCode = 1;
    log(error("\nLoading Configuration⚙️ Failed!😑\n"));
    return;
  }

  let cachedCommitHash = cache.getSync("linted-hash") || "";
  debug('Cached Commit SHA: ' + cachedCommitHash);

  let commitHash = '';

  try {
    commitHash = execSyncProcess('git rev-parse HEAD');
    debug('Latest Commit SHA: ' + commitHash);
  }
  catch(err) {
    log(error(err));
    process.exitCode = 1;
    return;
  }

  if(commitHash === cachedCommitHash) {
    debug('Skipping checks since the commit(s) have been linted already.');
    log(warning("\nNOTE: Skipping checks since the commit(s) have been linted already.\n"));
    return;
  }

  let currentBranch = '';
  let getCurrentBranchCommand = 'git rev-parse --abbrev-ref HEAD';

  try {
    currentBranch = execSyncProcess(getCurrentBranchCommand);
    debug('Current Branch: ' + currentBranch);
  }
  catch(err) {
    log(error('\nError while retrieving current branch name\n'));
    process.exitCode = 1;
    return;
  }

  let {
    base : baseBranch = 'master',
    tasks = {},
    verbose = false
  } = userConfig || {};

  debug('Base Branch: ' + baseBranch);

  // set base branch as the default diff branch
  let diffBranch = baseBranch;
  let remote = '';

  // Finding the remote name, if current branch is base branch
  if(currentBranch === baseBranch) {
    debug('Fetching the remote of base branch since current branch and base branch is same');
    try {
      const getRemote = 'git remote | head -1';
      remote = execSyncProcess(getRemote);
      diffBranch = `${remote}/${baseBranch}`;
      debug('Remote of base branch: ', remote);
    }
    catch(e) {
      debug('Couldn\'t find the remote.');
    }
    debug('Branch to Diff: ', diffBranch);
  }

  let isdiffBranchExisted = false;
  try {
    isdiffBranchExisted = checkForBranchExistence(baseBranch,remote);
    debug('Check whether branch is existed: ', diffBranch);
  } catch (err) {
    process.exitCode = 1;
    log(warning('\nCheck for diffBranch existence process has been stopped with the following error\n'));
    log(err);
    return;
  }

  let committedGitFiles = [];
  if (isdiffBranchExisted) {
    debug('Base branch exists.');
    try {
      committedGitFiles = fetchGitDiff(diffBranch);
      debug('Committed GIT files: ', committedGitFiles);
    } catch (err) {
      process.exitCode = 1;
      log(warning('\nFetching committed file list process has been stopped with the following error\n'));
      log(err);
      return;
    }
  }
  // if diffBranch is not existed,get all tracked files on currentBranch to lint
  else {
    log(warning('\n⚠️ The base branch(' + diffBranch + ") doesn't exist."));
    log(warning('Hence all the files will be considered\n'));
    try {
      committedGitFiles = getAllTrackedFiles(currentBranch);
      debug('Tracked files: ', committedGitFiles);
    } catch (err) {
      process.exitCode = 1;
      log(warning('\nGetting tracked file list process has been stopped with the following error\n'));
      log(err);
      return;
    }
  }

  const options = {
    verbose,
    output: []
  };

  new Listr(resolveMainTask({ tasks, committedGitFiles, options }), {
    exitOnError: false,
    concurrent: true,
    collapse: false
  })
  .run()
  .then(() => {
    cache.setSync("linted-hash", commitHash);
    debug('Cached Current Commit Hash');
    if (options.verbose && options.output.length) {
      log(success('\nAll tasks completed successfully. Printing tasks output.\n'));
      for (const line of options.output) {
        log(line);
      }
    }
    log(success("\nVoila! 🎉  Code is ready to be Shipped.\n"));
  })
  .catch( ({ errors }) => {
    process.exitCode = 1;
    errors.forEach(err => {
      console.error(err.customErrorMessage);
    });
  });

})();
