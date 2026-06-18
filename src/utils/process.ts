import { execSync } from 'node:child_process';

export function execSyncProcess(command: string): string {
  return execSync(command).toString().trimEnd();
}
