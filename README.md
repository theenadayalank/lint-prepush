# lint-prepush    [![npm version](https://badge.fury.io/js/lint-prepush.svg)](https://badge.fury.io/js/lint-prepush)

> Run linters on committed files in a Branch🔬

## Getting Started 🔮

This package will run linters on your project for the committed files in your branch.

### Prerequisites🔭

It require Node.js v6 or newer. It also requires a package to manage git hooks. I strongly suggest [Husky](https://github.com/typicode/husky) which I use for most of my projects.


```js
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm test",
      "...": "..."
    }
  }
}
```

### Installing

* This project requires a package to manage git hooks depending. 
* I strongly suggest [Husky](https://github.com/typicode/husky) which pauses the git push by overriding pre-commit hook (it almost overrides all hooks, here we need only pre-commit hook) and allow us to run our custom scripts and resumes pushing.


### npm

```bash
npm install --save-dev husky lint-prepush
```

or using [`yarn`](https://yarnpkg.com/):

```bash
yarn add --dev husky lint-prepush
```

### Usage

Configure the following scripts in package.json to lint your committed files 🔧. You can also follow any of the  [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) methods to configure lint-prepush.

```diff
{
  "scripts": {
+   "prepush": "lint-prepush"
  },
+ "lint-prepush": {
+    "*.js": [
+      "eslint"
+    ]
+  }
}
```

The above scrips will lint the js files while pushing to git. It will terminate the process if there are any errors, otherwise, the changes will be pushed.

### With Errors
<img src="screenshots/OutputWithErrors.gif" width="496" height="340" alt="With Erros">

### Without Errors
<img src="screenshots/OutputWithoutErrors.gif" width="496" height="340" alt="WithoutErrors">

## Built With

* [NodeJs](https://nodejs.org/en/) - Framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [VSCode](https://code.visualstudio.com/) - Code Editor
* [Gifox](https://gifox.io/) - For Making Gif

## Contributing

* If you have any ideas, just open an [issue](https://github.com/theenadayalank/lint-prepush/issues) and tell me what you think.
* Pull requests are warmly welcome, If you would like to contribute to this Project.


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/theenadayalank/lint-prepush/tags). 

## Authors

* **Theena Dayalan** - *Owner* - [website](https://www.theenadayalan.me/)

See also the list of [contributors](https://github.com/theenadayalank/lint-prepush/contributors) who participated in this project.

## Acknowledgments

* Inspired from [lint-staged](https://github.com/okonet/lint-staged) by [Andrey Okonetchnikov](https://github.com/okonet)

## License

MIT @ [Theena Dayalan](https://www.theenadayalan.me/)
