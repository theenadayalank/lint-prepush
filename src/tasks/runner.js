import { Listr } from 'listr2';
import { execTask } from './executor.ts';
import { resolveFileLists } from './resolver.ts';
export function createRunner(config, committedFiles, options) {
    const resolved = resolveFileLists(config.tasks, committedFiles);
    const tasks = resolved.map(({ fileFormat, commandList, fileList }) => {
        const isConcurrent = !Array.isArray(commandList);
        const commands = isConcurrent ? commandList.concurrent : commandList;
        return {
            title: `Linting ${fileFormat} files`,
            skip: () => (fileList.length === 0 ? `No ${fileFormat} files found` : false),
            task: (_, task) => task.newListr(commands.map(command => ({
                title: command,
                task: (__, t) => execTask({ command, fileList, task: t, options }),
            })), { exitOnError: true, concurrent: isConcurrent }),
        };
    });
    return new Listr(tasks, {
        exitOnError: false,
        concurrent: true,
        collectErrors: 'full',
        rendererOptions: { collapseSubtasks: false },
    });
}
