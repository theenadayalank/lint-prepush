const execa = require("execa");
const dedent = require("dedent");
const chalk = require("chalk");
const symbols = require("log-symbols");
const npmWhich = require("npm-which")(process.cwd());

function getFormattedTime(end) {
  return Math.round((end[0] * 1000) + (end[1] / 1000000));
}

module.exports = function execTask({ command, fileList, task, options = {} }) {
  let { executor, args } = resolveLinterPackage({ command, fileList });
  let startTime = process.hrtime();

  return () =>
    execa(executor, args, { reject: false }).then(result => {
      let end = process.hrtime(startTime);
      let elapsedTime = `(${getFormattedTime(end)}ms)`;
      task.title = `${task.title} ${chalk.grey(elapsedTime)}`;

      if (!result.failed) {
        if (options.verbose) {
          processOutput(command, result, options);
        }
        return `Passed ${command}`;
      }

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

function processOutput(command, { stderr, stdout }, options) {
  const hasOutput = !!stderr || !!stdout;
  if (hasOutput) {
    const output = []
      .concat(`\n${symbols.info} Task: ${command}\n`)
      .concat(stderr ? stderr : [])
      .concat(stdout ? stdout : []);
    options.output.push(output.join('\n'));
  }
}
