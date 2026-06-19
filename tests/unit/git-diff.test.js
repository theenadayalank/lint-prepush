import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('../../src/utils/process.js', () => ({
    execSyncProcess: vi.fn(),
}));
import { execSyncProcess } from '../../src/utils/process.ts';
import { getDiffFiles, getAllTrackedFiles } from '../../src/git/diff.ts';
const mockExec = vi.mocked(execSyncProcess);
beforeEach(() => mockExec.mockReset());
describe('getDiffFiles', () => {
    it('returns an array of file paths', () => {
        mockExec.mockReturnValue('src/foo.ts\nsrc/bar.ts');
        expect(getDiffFiles('main')).toEqual(['src/foo.ts', 'src/bar.ts']);
    });
    it('returns empty array when output is empty', () => {
        mockExec.mockReturnValue('');
        expect(getDiffFiles('main')).toEqual([]);
    });
    it('passes the correct git command', () => {
        mockExec.mockReturnValue('');
        getDiffFiles('develop');
        expect(mockExec).toHaveBeenCalledWith('git diff --relative --name-only --diff-filter=d develop...HEAD');
    });
});
describe('getAllTrackedFiles', () => {
    it('returns an array of tracked file paths', () => {
        mockExec.mockReturnValue('index.ts\nREADME.md\nsrc/utils.ts');
        expect(getAllTrackedFiles('main')).toEqual(['index.ts', 'README.md', 'src/utils.ts']);
    });
    it('returns empty array when output is empty', () => {
        mockExec.mockReturnValue('');
        expect(getAllTrackedFiles('main')).toEqual([]);
    });
});
