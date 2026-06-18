import chalk from 'chalk';
import debugFactory from 'debug';
import { loadConfig } from './config/loader.js';
import { getCachedHash, setCachedHash } from './git/cache.js';
import { getCurrentBranch, getUpstreamBranch, getRemote, getCommitHash } from './git/branch.js';
import { checkBranchExists } from './git/existence.js';
import { getDiffFiles, getAllTrackedFiles } from './git/diff.js';
import { createRunner } from './tasks/runner.js';
import { DEFAULT_BASE_BRANCH } from './constants.js';
import type { RunOptions } from './types.js';

const debug = debugFactory('lint-prepush');

export async function run(): Promise<void> {
  if (process.stdout.isTTY) {
    process.env.FORCE_COLOR = '1';
  }

  const config = await loadConfig();
  const { verbose } = config;
  const ns = process.cwd();

  const cachedHash = getCachedHash(ns);
  debug('Cached commit SHA: %s', cachedHash);

  let commitHash: string;
  try {
    commitHash = getCommitHash();
    debug('Latest commit SHA: %s', commitHash);
  } catch (err) {
    console.error(chalk.red(String(err)));
    process.exitCode = 1;
    return;
  }

  if (commitHash === cachedHash) {
    debug('Skipping — commits already linted.');
    console.log(chalk.yellow('\nNOTE: Skipping checks since the commit(s) have been linted already.\n'));
    return;
  }

  let currentBranch: string;
  try {
    currentBranch = getCurrentBranch();
    debug('Current branch: %s', currentBranch);
  } catch (err) {
    console.error(chalk.red('\nError while retrieving current branch name\n'));
    console.error(err);
    process.exitCode = 1;
    return;
  }

  let baseBranch = config.base;
  let upstreamDetected = false;

  if (!baseBranch) {
    debug('Base not specified, checking for upstream ref');
    try {
      baseBranch = getUpstreamBranch();
      upstreamDetected = true;
      debug('Upstream branch: %s', baseBranch);
    } catch {
      baseBranch = DEFAULT_BASE_BRANCH;
      debug('No upstream found, falling back to: %s', baseBranch);
    }
  }

  let diffBranch = baseBranch;
  let remote = '';

  if (currentBranch === baseBranch) {
    debug('Current branch equals base branch — resolving remote');
    try {
      remote = getRemote();
      diffBranch = `${remote}/${baseBranch}`;
      debug('Remote: %s, diffBranch: %s', remote, diffBranch);
    } catch (err) {
      debug('Could not determine remote: %s', err);
    }
  }

  let branchExists: boolean;
  try {
    branchExists = upstreamDetected || checkBranchExists(baseBranch, remote);
    debug('Branch exists: %s', branchExists);
  } catch (err) {
    console.error(chalk.red('\nError while checking branch existence:\n'));
    console.error(err);
    process.exitCode = 1;
    return;
  }

  let committedFiles: string[];
  if (branchExists) {
    try {
      committedFiles = getDiffFiles(diffBranch);
      debug('Diff files: %o', committedFiles);
    } catch (err) {
      console.error(chalk.red('\nError while fetching committed file list:\n'));
      console.error(err);
      process.exitCode = 1;
      return;
    }
  } else {
    console.log(chalk.yellow(`\n⚠️  Base branch (${diffBranch}) does not exist — linting all tracked files.\n`));
    try {
      committedFiles = getAllTrackedFiles(currentBranch);
      debug('Tracked files: %o', committedFiles);
    } catch (err) {
      console.error(chalk.red('\nError while getting tracked file list:\n'));
      console.error(err);
      process.exitCode = 1;
      return;
    }
  }

  const options: RunOptions = { verbose, output: [] };
  const runner = createRunner(config, committedFiles, options);

  await runner.run();

  if (runner.errors.length) {
    process.exitCode = 1;
    runner.errors.forEach(({ error }) => {
      if (error?.message) console.error(error.message);
    });
    return;
  }

  setCachedHash(ns, commitHash);
  debug('Cached commit hash');

  if (verbose && options.output.length) {
    console.log(chalk.green('\nAll tasks completed successfully. Printing output.\n'));
    for (const line of options.output) {
      console.log(line);
    }
  }

  console.log(chalk.green('\nVoila! 🎉  Code is ready to be shipped.\n'));
}
