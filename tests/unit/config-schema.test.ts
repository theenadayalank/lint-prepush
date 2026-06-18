import { describe, it, expect } from 'vitest';
import { configSchema } from '../../src/config/schema.js';

describe('configSchema', () => {
  it('accepts a valid config with sequential tasks', () => {
    const result = configSchema.safeParse({
      tasks: { '*.ts': ['eslint'] },
    });
    expect(result.success).toBe(true);
  });

  it('accepts concurrent task config', () => {
    const result = configSchema.safeParse({
      tasks: { '*.ts': { concurrent: ['eslint', 'tsc'] } },
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional base and verbose fields', () => {
    const result = configSchema.safeParse({
      base: 'develop',
      verbose: true,
      tasks: { '*.ts': ['eslint'] },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.base).toBe('develop');
      expect(result.data.verbose).toBe(true);
    }
  });

  it('defaults verbose to false when omitted', () => {
    const result = configSchema.safeParse({ tasks: { '*.ts': ['eslint'] } });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.verbose).toBe(false);
    }
  });

  it('rejects config with no tasks field', () => {
    const result = configSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects a task where the command list is a plain string', () => {
    const result = configSchema.safeParse({
      tasks: { '*.ts': 'eslint' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty command list', () => {
    const result = configSchema.safeParse({
      tasks: { '*.ts': [] },
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty concurrent list', () => {
    const result = configSchema.safeParse({
      tasks: { '*.ts': { concurrent: [] } },
    });
    expect(result.success).toBe(false);
  });
});
