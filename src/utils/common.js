import { cosmiconfigSync } from 'cosmiconfig';
import { execSync } from 'child_process';

export const userConfig = (cosmiconfigSync("lint-prepush").search() || {}).config;

export const execSyncProcess = (command = '') => {
  let result = execSync(command).toString() || '';
  result = result.split('\n');
  result = result.slice(0,-1);
  result = result.join('\n');
  return result;
};
