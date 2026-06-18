import type { ListrTaskWrapper, DefaultRenderer } from 'listr2';
import type { LintPrepushConfig, CommandList } from './config/schema.js';

export type { LintPrepushConfig, CommandList };

export interface ResolvedTask {
  fileFormat: string;
  commandList: CommandList;
  fileList: string[];
}

export interface RunOptions {
  verbose: boolean;
  output: string[];
}

export interface ExecTaskParams {
  command: string;
  fileList: string[];
  task: ListrTaskWrapper<Record<string, never>, typeof DefaultRenderer, typeof DefaultRenderer>;
  options: RunOptions;
}
