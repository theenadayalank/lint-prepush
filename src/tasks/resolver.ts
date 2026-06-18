import { resolve } from 'node:path';
import micromatch from 'micromatch';
import type { CommandList, ResolvedTask } from '../types.js';

const cwd = process.cwd();

export function resolveFileLists(
  tasks: Record<string, CommandList>,
  committedFiles: string[]
): ResolvedTask[] {
  return Object.entries(tasks).map(([fileFormat, commandList]) => {
    const fileList = micromatch(committedFiles, [fileFormat], {
      matchBase: !fileFormat.includes('/'),
      dot: true,
    }).map(file => resolve(cwd, file));

    return { fileFormat, commandList, fileList };
  });
}
