import { execa } from 'execa';
import chalk from 'chalk';
class LintError extends Error {
    constructor(command, stdout, stderr) {
        const parts = [
            `\n✖ "${command}" has errors — please fix them before pushing.\n`,
            stdout,
            stderr,
        ].filter(Boolean);
        super(parts.join('\n'));
        this.name = 'LintError';
    }
}
function hrToMs(end) {
    return Math.round(end[0] * 1000 + end[1] / 1_000_000);
}
function collectOutput(command, stderr, stdout, options) {
    if (!stderr && !stdout)
        return;
    const lines = [`\nℹ Task: ${command}\n`, stderr, stdout].filter(Boolean);
    options.output.push(lines.join('\n'));
}
export async function execTask({ command, fileList, task, options }) {
    const [executor, ...rest] = command.split(' ');
    const args = [...rest, ...fileList];
    const start = process.hrtime();
    const result = await execa(executor, args, { reject: false, preferLocal: true });
    task.title = `${task.title} ${chalk.grey(`(${hrToMs(process.hrtime(start))}ms)`)}`;
    if (result.failed) {
        throw new LintError(command, result.stdout, result.stderr);
    }
    if (options.verbose) {
        collectOutput(command, result.stderr, result.stdout, options);
    }
    return `Passed: ${command}`;
}
