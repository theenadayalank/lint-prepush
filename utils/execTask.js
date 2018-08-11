const execa = require("execa");
const dedent = require("dedent");
const symbols = require("log-symbols");
const npmWhich = require("npm-which")(process.cwd());

module.exports = function execTask({ command, fileList }) {
  let { executor, args } = resolveLinterPackage({ command, fileList });
  return () =>
    execa(executor, args, { reject: false }).then(result => {
      if (!result.failed) return `Passed ${command}`;
      throw constructErrorObject(command, result.stderr, result.stdout);
    });
};

function resolveLinterPackage({ command, fileList }) {
  let [executor, ...args] = command.split(" ");
  executor = npmWhich.sync(executor);
  args = args.concat(fileList);
  return {
    executor,
    args
  };
}

function constructErrorObject(command, error, output) {
  const e = new Error();
  e.customErrorMessage = dedent`\n
    ${
      symbols.error
    } "${command}" is having Errors. Consider revisiting them one more time😉
    ${output}
    ${error}
  `;
  return e;
}
