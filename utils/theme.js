const chalk = require("chalk");

const { loadConfig } = require('./common');

const message = (color, output) => console.log(chalk.keyword(color)(...output));

const defaultTheme = {
  success: (...output) => message('green', output),
  warning: (...output) => message('orange', output),
  error: (...output) => message('red', output),
};

// extend our default theme with any user-supplied theme colors
const theme = loadConfig()
  .then(({ config = {} }) => {
    const { theme: userTheme = {} } = config;

    return Object.keys(userTheme).reduce((themeObject, type) => {
      themeObject[type] = (...output) => message(userTheme[type], output);

      return themeObject;
    }, defaultTheme);
  })
  .catch(() => {
    process.exitCode = 1;
    defaultTheme.error("\nLoading Configuration⚙️ Failed!😑\n");
  });

module.exports = {
  theme,
  defaultTheme,
};
