const cosmiconfig = require("cosmiconfig");
const { execSync } = require("child_process");

const userConfig = (cosmiconfig("lint-prepush", {
  searchPlaces: [
    "package.json",
    "lintprepush.config.js",
    ".lintprepushrc",
    ".lintprepushrc.js",
    ".lintprepushrc.json",
    ".lintprepushrc.yaml",
    ".lintprepushrc.yml"
  ]
}).searchSync() || {}).config;

function execSyncProcess(command = '') {
  let result = execSync(command).toString() || '';
  result = result.split('\n');
  result = result.slice(0,-1);
  result = result.join('\n');
  return result;
}

module.exports = {
  userConfig,
  execSyncProcess
};
