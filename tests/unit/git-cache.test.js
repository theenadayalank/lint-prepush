import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getCachedHash, setCachedHash } from '../../src/git/cache.ts';
const TEST_BASE = mkdtempSync(join(tmpdir(), 'lp-cache-test-'));
afterAll(() => rmSync(TEST_BASE, { recursive: true, force: true }));
describe('getCachedHash', () => {
    it('returns empty string when no cache file exists', () => {
        expect(getCachedHash('/nonexistent/project', TEST_BASE)).toBe('');
    });
});
describe('setCachedHash / getCachedHash', () => {
    it('round-trips a hash for a given namespace', () => {
        setCachedHash('/my/project', 'abc123def', TEST_BASE);
        expect(getCachedHash('/my/project', TEST_BASE)).toBe('abc123def');
    });
    it('isolates different namespaces', () => {
        setCachedHash('/project-a', 'hash-a', TEST_BASE);
        setCachedHash('/project-b', 'hash-b', TEST_BASE);
        expect(getCachedHash('/project-a', TEST_BASE)).toBe('hash-a');
        expect(getCachedHash('/project-b', TEST_BASE)).toBe('hash-b');
    });
    it('overwrites an existing hash', () => {
        setCachedHash('/my/project', 'first', TEST_BASE);
        setCachedHash('/my/project', 'second', TEST_BASE);
        expect(getCachedHash('/my/project', TEST_BASE)).toBe('second');
    });
});
