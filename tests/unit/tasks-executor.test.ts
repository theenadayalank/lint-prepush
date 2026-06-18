import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RunOptions } from '../../src/types.js';

vi.mock('execa', () => ({ execa: vi.fn() }));

import { execa } from 'execa';
import { execTask } from '../../src/tasks/executor.js';

const mockExeca = vi.mocked(execa);

const makeTask = (title = 'test command') => {
  let _title = title;
  return {
    get title() { return _title; },
    set title(v: string) { _title = v; },
  };
};

const options: RunOptions = { verbose: false, output: [] };

beforeEach(() => mockExeca.mockReset());

describe('execTask', () => {
  it('returns a success string on zero exit', async () => {
    mockExeca.mockResolvedValue({ failed: false, stderr: '', stdout: '' } as any);

    const result = await execTask({
      command: 'eslint src',
      fileList: ['src/foo.ts'],
      task: makeTask() as any,
      options,
    });

    expect(result).toBe('Passed: eslint src');
  });

  it('throws on non-zero exit', async () => {
    mockExeca.mockResolvedValue({
      failed: true,
      stderr: 'parse error',
      stdout: '1 error found',
    } as any);

    await expect(
      execTask({
        command: 'eslint src',
        fileList: ['src/foo.ts'],
        task: makeTask() as any,
        options,
      })
    ).rejects.toThrow(/eslint src/);
  });

  it('appends elapsed time to task title', async () => {
    mockExeca.mockResolvedValue({ failed: false, stderr: '', stdout: '' } as any);

    const task = makeTask('eslint');
    await execTask({
      command: 'eslint src',
      fileList: [],
      task: task as any,
      options,
    });

    expect(task.title).toMatch(/eslint \(\d+ms\)/);
  });

  it('collects output in verbose mode when there is stdout', async () => {
    mockExeca.mockResolvedValue({
      failed: false,
      stderr: '',
      stdout: 'lint output',
    } as any);

    const verboseOptions: RunOptions = { verbose: true, output: [] };
    await execTask({
      command: 'eslint src',
      fileList: [],
      task: makeTask() as any,
      options: verboseOptions,
    });

    expect(verboseOptions.output.length).toBeGreaterThan(0);
    expect(verboseOptions.output[0]).toContain('lint output');
  });

  it('does not collect output when stdout and stderr are empty', async () => {
    mockExeca.mockResolvedValue({ failed: false, stderr: '', stdout: '' } as any);

    const verboseOptions: RunOptions = { verbose: true, output: [] };
    await execTask({
      command: 'eslint src',
      fileList: [],
      task: makeTask() as any,
      options: verboseOptions,
    });

    expect(verboseOptions.output).toHaveLength(0);
  });
});
