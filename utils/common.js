const { cosmiconfigSync } = require("cosmiconfig");
const { execSync } = require("child_process");

const userConfig = (cosmiconfigSync("lint-prepush", {
  searchPlaces: [
    "package.json",
    "lintprepush.config.js",
    ".lintprepushrc",
    ".lintprepushrc.js",
    ".lintprepushrc.json",
    ".lintprepushrc.yaml",
    ".lintprepushrc.yml"
  ]
}).search() || {}).config;

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
