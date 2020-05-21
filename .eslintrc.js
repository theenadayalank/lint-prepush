module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended"
  ],
  rules: {
    "space-unary-ops": [
      "error",
      {
        words: true,
        nonwords: false
      }
    ],
    camelcase: "off",
    "func-call-spacing": ["error", "never"],
    "eol-last": ["error", "always"],
    "no-console": "off",
    "no-alert": "error",
    eqeqeq: ["error", "always"],
    "no-eval": "error",
    "no-caller": "error",
    "no-undef": "error",
    "no-eq-null": "error",
    "no-useless-escape": "off",
    "no-extra-parens": "off",
    "no-trailing-spaces": "error",
    "no-multi-spaces": "error",
    "array-bracket-spacing": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
    "space-before-function-paren": ["error", "never"],
    semi: "error"
  },
  overrides: [
    // test files
    {
      files: ['tests/**/*.js'],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2017
      },
      env: {
        mocha: true
      },
      plugins: [
        "mocha"
      ],
      rules: {
        "mocha/no-exclusive-tests": "error"
      }
    }
  ]
};
