import { describe, it, expect } from 'vitest';
import { execSyncProcess } from '../../src/utils/process.ts';
describe('execSyncProcess', () => {
    it('returns stdout without trailing newline', () => {
        expect(execSyncProcess("echo 'hello'")).toBe('hello');
    });
    it('handles multi-line output', () => {
        const result = execSyncProcess("printf 'a\\nb\\nc'");
        expect(result).toBe('a\nb\nc');
    });
    it('returns empty string for no output', () => {
        expect(execSyncProcess('true')).toBe('');
    });
    it('throws on non-zero exit code', () => {
        expect(() => execSyncProcess('node -e "process.exit(1)"')).toThrow();
    });
});
