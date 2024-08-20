import { execSyncProcess } from './common.js';

export default function getAllTrackedFiles(branch = "master") {
  let command = `git ls-tree -r ${branch} --name-only`;

  let committedGitFiles = execSyncProcess(command) || '';
  committedGitFiles = committedGitFiles.split('\n');
  return committedGitFiles;
};
