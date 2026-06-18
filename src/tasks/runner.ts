import { Listr, type ListrTask } from 'listr2';
import { execTask } from './executor.js';
import { resolveFileLists } from './resolver.js';
import type { LintPrepushConfig, RunOptions } from '../types.js';

type Ctx = Record<string, never>;

export function createRunner(
  config: LintPrepushConfig,
  committedFiles: string[],
  options: RunOptions
): Listr<Ctx> {
  const resolved = resolveFileLists(config.tasks, committedFiles);

  const tasks: ListrTask<Ctx>[] = resolved.map(({ fileFormat, commandList, fileList }) => {
    const isConcurrent = !Array.isArray(commandList);
    const commands = isConcurrent ? commandList.concurrent : commandList;

    return {
      title: `Linting ${fileFormat} files`,
      skip: () => (fileList.length === 0 ? `No ${fileFormat} files found` : false),
      task: (_, task) =>
        task.newListr(
          commands.map(command => ({
            title: command,
            task: (__, t) => execTask({ command, fileList, task: t, options }),
          })),
          { exitOnError: true, concurrent: isConcurrent }
        ),
    };
  });

  return new Listr<Ctx>(tasks, {
    exitOnError: false,
    concurrent: true,
    collectErrors: 'full',
    rendererOptions: { collapseSubtasks: false },
  });
}
