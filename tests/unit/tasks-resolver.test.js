import { describe, it, expect } from 'vitest';
import { resolveFileLists } from '../../src/tasks/resolver.ts';
describe('resolveFileLists', () => {
    it('matches files against a glob pattern', () => {
        const result = resolveFileLists({ '*.ts': ['eslint'] }, ['src/foo.ts', 'src/bar.js', 'README.md']);
        expect(result).toHaveLength(1);
        expect(result[0].fileList).toHaveLength(1);
        expect(result[0].fileList[0]).toContain('foo.ts');
    });
    it('resolves a concurrent command list correctly', () => {
        const result = resolveFileLists({ '*.ts': { concurrent: ['eslint', 'tsc'] } }, ['src/foo.ts']);
        expect(result[0].commandList).toEqual({ concurrent: ['eslint', 'tsc'] });
    });
    it('returns empty fileList when no files match the pattern', () => {
        const result = resolveFileLists({ '*.css': ['stylelint'] }, ['src/foo.ts', 'src/bar.js']);
        expect(result[0].fileList).toHaveLength(0);
    });
    it('handles multiple patterns independently', () => {
        const result = resolveFileLists({ '*.ts': ['eslint'], '*.css': ['stylelint'] }, ['src/foo.ts', 'styles/main.css']);
        expect(result).toHaveLength(2);
        expect(result[0].fileFormat).toBe('*.ts');
        expect(result[1].fileFormat).toBe('*.css');
    });
    it('resolves files to absolute paths', () => {
        const result = resolveFileLists({ '*.ts': ['eslint'] }, ['src/foo.ts']);
        expect(result[0].fileList[0]).toMatch(/^\/.*foo\.ts$/);
    });
    it('matches dotfiles when dot option is active', () => {
        const result = resolveFileLists({ '*.ts': ['eslint'] }, ['.hidden.ts', 'visible.ts']);
        expect(result[0].fileList).toHaveLength(2);
    });
    it('matches files against comma-separated patterns', () => {
        const result = resolveFileLists({ '*.js,*.jsx,*.ts,*.tsx': ['eslint'] }, ['app/not-found.tsx', 'package.json', 'pnpm-lock.yaml']);
        expect(result[0].fileList).toHaveLength(1);
        expect(result[0].fileList[0]).toContain('not-found.tsx');
    });
});
