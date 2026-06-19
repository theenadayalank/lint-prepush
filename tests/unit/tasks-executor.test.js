import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('execa', () => ({ execa: vi.fn() }));
import { execa } from 'execa';
import { execTask } from '../../src/tasks/executor.ts';
const mockExeca = vi.mocked(execa);
const makeTask = (title = 'test command') => {
    let _title = title;
    return {
        get title() { return _title; },
        set title(v) { _title = v; },
    };
};
const options = { verbose: false, output: [] };
beforeEach(() => mockExeca.mockReset());
describe('execTask', () => {
    it('returns a success string on zero exit', async () => {
        mockExeca.mockResolvedValue({ failed: false, stderr: '', stdout: '' });
        const result = await execTask({
            command: 'eslint src',
            fileList: ['src/foo.ts'],
            task: makeTask(),
            options,
        });
        expect(result).toBe('Passed: eslint src');
    });
    it('throws on non-zero exit', async () => {
        mockExeca.mockResolvedValue({
            failed: true,
            stderr: 'parse error',
            stdout: '1 error found',
        });
        await expect(execTask({
            command: 'eslint src',
            fileList: ['src/foo.ts'],
            task: makeTask(),
            options,
        })).rejects.toThrow(/eslint src/);
    });
    it('appends elapsed time to task title', async () => {
        mockExeca.mockResolvedValue({ failed: false, stderr: '', stdout: '' });
        const task = makeTask('eslint');
        await execTask({
            command: 'eslint src',
            fileList: [],
            task: task,
            options,
        });
        expect(task.title).toMatch(/eslint \(\d+ms\)/);
    });
    it('collects output in verbose mode when there is stdout', async () => {
        mockExeca.mockResolvedValue({
            failed: false,
            stderr: '',
            stdout: 'lint output',
        });
        const verboseOptions = { verbose: true, output: [] };
        await execTask({
            command: 'eslint src',
            fileList: [],
            task: makeTask(),
            options: verboseOptions,
        });
        expect(verboseOptions.output.length).toBeGreaterThan(0);
        expect(verboseOptions.output[0]).toContain('lint output');
    });
    it('does not collect output when stdout and stderr are empty', async () => {
        mockExeca.mockResolvedValue({ failed: false, stderr: '', stdout: '' });
        const verboseOptions = { verbose: true, output: [] };
        await execTask({
            command: 'eslint src',
            fileList: [],
            task: makeTask(),
            options: verboseOptions,
        });
        expect(verboseOptions.output).toHaveLength(0);
    });
});
