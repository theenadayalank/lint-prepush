import { resolve } from 'node:path';
import micromatch from 'micromatch';
const cwd = process.cwd();
export function resolveFileLists(tasks, committedFiles) {
    return Object.entries(tasks).map(([fileFormat, commandList]) => {
        const patterns = fileFormat.split(',').map(p => p.trim());
        const fileList = micromatch(committedFiles, patterns, {
            matchBase: patterns.every(p => !p.includes('/')),
            dot: true,
        }).map(file => resolve(cwd, file));
        return { fileFormat, commandList, fileList };
    });
}
