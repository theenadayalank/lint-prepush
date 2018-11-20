const cosmiconfig = require("cosmiconfig");
const { spawn } = require("child_process");

function loadConfig() {
  const explorer = cosmiconfig("lint-prepush", {
    searchPlaces: [
      "package.json",
      "lintprepush.config.js",
      ".lintprepushrc",
      ".lintprepushrc.js",
      ".lintprepushrc.json",
      ".lintprepushrc.yaml",
      ".lintprepushrc.yml"
    ]
  });
  return explorer.search();
}

function spawnChildProcess({ command = "", params = [] }, callback) {
  let [bin, ...args] = command.split(" ");
  args = args.concat(params);
  let executor = spawn(bin, args);

  let output = "",
    error = "";

  executor.stdout.on("data", data => {
    output += data.toString();
  });

  executor.stderr.on("data", data => {
    error += data.toString();
  });

  executor.on("close", code => {
    if (code === 0) {
      callback({
        hasErrors: false,
        output: {
          stdout: output,
          stderr: error
        }
      });
    } else {
      callback({
        hasErrors: true,
        output: {
          stdout: output,
          stderr: error
        }
      });
    }
  });
}

module.exports = {
  loadConfig,
  spawnChildProcess
};
