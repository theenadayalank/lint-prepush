import { execSync } from 'node:child_process';
export function execSyncProcess(command) {
    return execSync(command).toString().trimEnd();
}
