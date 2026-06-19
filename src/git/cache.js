import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
function cacheDir(base = homedir()) {
    return join(base, '.lint-prepush');
}
function cacheFilePath(ns, base) {
    const key = createHash('sha1').update(ns).digest('hex').slice(0, 16);
    return join(cacheDir(base), `${key}.hash`);
}
export function getCachedHash(ns, base) {
    const filePath = cacheFilePath(ns, base);
    if (!existsSync(filePath))
        return '';
    try {
        return readFileSync(filePath, 'utf-8').trim();
    }
    catch {
        return '';
    }
}
export function setCachedHash(ns, hash, base) {
    const dir = cacheDir(base);
    if (!existsSync(dir))
        mkdirSync(dir, { recursive: true });
    writeFileSync(cacheFilePath(ns, base), hash, 'utf-8');
}
