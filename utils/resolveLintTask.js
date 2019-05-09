const execTask = require("./execTask");

module.exports = function resolveLintTask(commandList, fileList) {
  return commandList.map(command => ({
    title: command,
    task: (ctx, task) => execTask({
      command,
      fileList,
      ctx,
      task
    })()
  }));
};
