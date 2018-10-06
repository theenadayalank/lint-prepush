const Listr = require("listr");
const path = require("path");
const micromatch = require("micromatch");

const cwd = process.cwd();
const resolveLintTask = require("./resolveLintTask");

module.exports = function resolveMainTask( options = {} ) {
  return constructTaskList(options).map(task => ({
    title: `Linting ${task.fileFormat} files`,
    task: () =>
      new Listr(resolveLintTask(task.commandList, task.fileList), {
        exitOnError: true,
        concurrent: false
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
      matchBase: true,
      dot: true
    }).map(file => path.resolve(cwd, file));
    return { fileFormat, commandList, fileList };
  });
}
