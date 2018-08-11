const Listr = require("listr");
const path = require("path");
const micromatch = require("micromatch");

const cwd = process.cwd();
const resolveLintTask = require("./resolveLintTask");

module.exports = function resolveMainTask(options) {
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

function constructTaskList({ config, committedGitFiles }) {
  return Object.keys(config).map(fileFormat => {
    let fileList = [];
    let commandList = config[fileFormat];
    fileList = micromatch(committedGitFiles, [fileFormat], {
      matchBase: true,
      dot: true
    }).map(file => path.resolve(cwd, file));
    return { fileFormat, commandList, fileList };
  });
}
