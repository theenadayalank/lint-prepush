const Listr = require("listr");
const path = require("path");
const micromatch = require("micromatch");

const cwd = process.cwd();
const resolveLintTask = require("./resolveLintTask");

module.exports = function resolveMainTask( config = {} ) {
  return constructTaskList(config).map(task => ({
    title: `Linting ${task.fileFormat} files`,
    task: () =>
      new Listr(resolveLintTask(task.commandList.concurrent || task.commandList, task.fileList, config.options), {
        exitOnError: true,
        concurrent: Array.isArray(task.commandList.concurrent)
      }),
    skip: () => {
      if (task.fileList.length === 0) {
        return `No files found with ${task.fileFormat}`;
      }
      return false;
    }
  }));
};

function constructTaskList({ tasks = {}, committedGitFiles = [] } = {}) {
  return Object.keys(tasks).map(fileFormat => {
    let fileList = [];
    let commandList = tasks[fileFormat];
    fileList = micromatch(committedGitFiles, [fileFormat], {
      // Glob patterns break if matchBase is true, disable if fileFormat looks like path
      matchBase: !fileFormat.includes('/'),
      dot: true
    }).map(file => path.resolve(cwd, file));
    return { fileFormat, commandList, fileList };
  });
}
