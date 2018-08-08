const Listr = require("listr");
const path = require("path");
const micromatch = require("micromatch");
const pathIsInside = require("path-is-inside");

const cwd = process.cwd();
const resolveLintTask = require("./resolveLintTask");
const { getGitDir } = require("./loadConfig");
const gitDir = getGitDir();

module.exports = function resolveMainTask(options) {
  return constructTaskList(options).map(task => ({
    title: `Linting ${task.fileFormat} files`,
    task: () =>
      new Listr(resolveLintTask(task.commandList, task.fileList, gitDir), {
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
  let filenames = committedGitFiles
    .map(file => file.filename)
    .map(file => path.resolve(gitDir, file));
  return Object.keys(config).map(fileFormat => {
    let fileList = [];
    let commandList = config[fileFormat];
    fileList = micromatch(
      filenames
        .filter(file => pathIsInside(file, cwd))
        .map(file => path.relative(cwd, file)),
      [fileFormat],
      {
        matchBase: true,
        dot: true
      }
    ).map(file => path.resolve(cwd, file));
    return { fileFormat, commandList, fileList };
  });
}
