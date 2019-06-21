# lint-prepush

[![npm version](https://badge.fury.io/js/lint-prepush.svg)](https://www.npmjs.com/package/lint-prepush)
[![npm downloads](https://img.shields.io/npm/dt/lint-prepush.svg)](https://www.npmtrends.com/lint-prepush)
[![GitHub license](https://img.shields.io/github/license/theenadayalank/lint-prepush.svg)](https://github.com/theenadayalank/lint-prepush/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/theenadayalank/lint-prepush.svg?branch=master)](https://travis-ci.org/theenadayalank/lint-prepush)

> Run linters on committed files of a GIT Branch

## Getting Started

This package will run linters on your project for the committed files in your branch.

### Prerequisites

- Node.js `>=6.0.0`
- a separate package to manage integration with git hooks, like [husky](https://github.com/typicode/husky)

### Installation

Install `lint-prepush` and `husky` via [`npm`](https://www.npmjs.com/):

```shell
npm install --save-dev husky lint-prepush
```

You can also use [`yarn`](https://yarnpkg.com/) to install them:

```shell
yarn add --dev husky lint-prepush
```

### Usage

Add the following to your `package.json` to lint your committed files. You can also
follow any of the [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) methods
to configure `lint-prepush`.

```json
{
  "husky": {
    "hooks": {
      "pre-push": "lint-prepush",
    }
  },
  "lint-prepush": {
    "base": "master",
    "tasks": {
      "**/*.js": [
        "npx eslint"
      ]
    }
  }
}
```

The above configuration will lint any `.js` files in your commit before pushing
to git. It will terminate the `git push` if there are any linting errors, otherwise
the changes will be pushed.

### With Errors

<img src="screenshots/OutputWithErrors.gif" width="496" height="340" alt="lint-prepush output with errors">

### Without Errors

<img src="screenshots/OutputWithoutErrors.gif" width="496" height="340" alt="lint-prepush output without errors">

## Built With

* [Node.js](https://nodejs.org/en/) - Framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [VSCode](https://code.visualstudio.com/) - Code Editor
* [Gifox](https://gifox.io/) - For Making Gif

## Contributing

* If you have any ideas, just open an [Issue](https://github.com/theenadayalank/lint-prepush/issues) and tell me what you think.
* If you would like to contribute to this Project, [Pull Requests](https://github.com/theenadayalank/lint-prepush/pulls) are welcome.


## Versioning

This package follows [SemVer](http://semver.org/) for versioning. For the available
versions, see the [tags on this repository](https://github.com/theenadayalank/lint-prepush/tags).

## Authors

* **Theena Dayalan** - *Owner* - [website](https://www.theenadayalan.me/)

See the list of [contributors](https://github.com/theenadayalank/lint-prepush/contributors)
who participated in this project.

## Acknowledgments

* Inspired from [lint-staged](https://github.com/okonet/lint-staged) by [Andrey Okonetchnikov](https://github.com/okonet)

## License

MIT @ [Theena Dayalan](https://www.theenadayalan.me/)
