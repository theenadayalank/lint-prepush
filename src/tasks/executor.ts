import { execa } from 'execa';
import chalk from 'chalk';
import type { ExecTaskParams, RunOptions } from '../types.ts';

class LintError extends Error {
  constructor(command: string, stdout: string, stderr: string) {
    const parts = [
      `\n✖ "${command}" has errors — please fix them before pushing.\n`,
      stdout,
      stderr,
    ].filter(Boolean);
    super(parts.join('\n'));
    this.name = 'LintError';
  }
}

function hrToMs(end: [number, number]): number {
  return Math.round(end[0] * 1000 + end[1] / 1_000_000);
}

function collectOutput(command: string, stderr: string, stdout: string, options: RunOptions): void {
  if (!stderr && !stdout) return;
  const lines = [`\nℹ Task: ${command}\n`, stderr, stdout].filter(Boolean);
  options.output.push(lines.join('\n'));
}

export async function execTask({ command, fileList, task, options }: ExecTaskParams): Promise<string> {
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
