const cosmiconfig = require("cosmiconfig");
var findParentDir = require("find-parent-dir");

function loadConfig() {
  const explorer = cosmiconfig("lint-prepush", {
    searchPlaces: [
      "package.json",
      "lint-prepush.config.js",
      ".lintprepushrc",
      ".lintprepushrc.js",
      ".lintprepushrc.json",
      ".lintprepushrc.yaml",
      ".lintprepushrc.yml"
    ]
  });
  return explorer.search();
}

function getGitDir() {
  return findParentDir.sync(process.cwd(), ".git");
}

module.exports = {
  loadConfig,
  getGitDir
};
