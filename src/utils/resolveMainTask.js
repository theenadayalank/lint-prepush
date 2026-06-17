import path from 'path';
import micromatch from 'micromatch';

import resolveLintTask from './resolveLintTask.js';

const cwd = process.cwd();

export default function resolveMainTask( config = {} ) {
  return constructTaskList(config).map(item => ({
    title: `Linting ${item.fileFormat} files`,
    task: (_, task) =>
      task.newListr(resolveLintTask(item.commandList.concurrent || item.commandList, item.fileList, config.options), {
        exitOnError: true,
        concurrent: Array.isArray(item.commandList.concurrent)
      }),
    skip: () => {
      if (item.fileList.length === 0) {
        return `No files found with ${item.fileFormat}`;
      }
      return false;
    }
  }));
};

function constructTaskList({ tasks = {}, committedGitFiles = [] } = {}) {
  return Object.keys(tasks).map(fileFormat => {
    const commandList = tasks[fileFormat];
    const fileList = micromatch(committedGitFiles, [fileFormat], {
      // Glob patterns break if matchBase is true, disable if fileFormat looks like path
      matchBase: !fileFormat.includes('/'),
      dot: true
    }).map(file => path.resolve(cwd, file));
    return { fileFormat, commandList, fileList };
  });
}
