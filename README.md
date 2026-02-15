
# lint-prepush: Automate Code Quality Before Every Push 🚀

**lint-prepush** ensures that linters are automatically run on committed files before you push to a remote, maintaining code quality and consistency within teams.

## ⚙️ Prerequisites

Make sure you have:
- **Node.js** `>=18.18.0` – [Download Node.js](https://nodejs.org/)
- **Git Hook Manager** – [Husky](https://github.com/typicode/husky) is recommended to integrate with your Git hooks

## 🚀 Installation

### Using npm:
```bash
npm install --save-dev lint-prepush
```

### Using yarn:
```bash
yarn add --dev lint-prepush
```

## 🛠️ Configuration

Once installed, configure **lint-prepush** in your `package.json` to lint specific file types before pushing.

### Basic Example: Lint JavaScript Files with ESLint

```json
"lint-prepush": {
  "base": "main",
  "tasks": {
    "*.js": [
      "eslint"
    ]
  }
}
```

This ensures that **eslint** runs on all `.js` files in your commit, blocking pushes if any errors are found.

### ⚡ Concurrent Task Execution

You can run multiple tasks simultaneously on the same file type for faster processing:
```json
"lint-prepush": {
  "tasks": {
    "*.js": {
      "concurrent": ["eslint", "jest"]
    }
  }
}
```

### 📢 Verbose Logging

Want more details during the lint process? Enable verbose mode:
```json
"lint-prepush": {
  "verbose": true,
  "tasks": { ... }
}
```
This will log every step in the process, even when there are no errors.

## 🎯 How It Works

- **Hooks into Git's Pre-Push**: By using [Husky](https://github.com/typicode/husky), **lint-prepush** leverages Git hooks to automatically run specified tasks on your code before it leaves your local environment.
- **Ensures Code Quality**: Stop bad code from being pushed by enforcing linting standards.
- **Faster Feedback**: Concurrent task execution helps you catch problems quickly, reducing the time spent in code review.

## 🤝 Acknowledgments

This project draws inspiration from:
- [Husky](https://github.com/typicode/husky) for handling Git hooks
- [Lint-staged](https://github.com/okonet/lint-staged) for ideas on managing tasks effectively

We appreciate the efforts of these projects!

## 🔑 Keywords

- git pre-push hook
- linting automation
- code quality
- eslint
- concurrent tasks
- git hooks
- husky

## 📜 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
