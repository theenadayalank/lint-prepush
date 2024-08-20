import execTask from './execTask.js';

export default function resolveLintTask(commandList, fileList, options) {
  return commandList.map((command) => ({
    title: command,
    task: (ctx, task) =>
      execTask({
        command,
        fileList,
        ctx,
        task,
        options,
      })(),
  }));
};
