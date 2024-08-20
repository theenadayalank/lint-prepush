import globals from "globals";
import js from "@eslint/js";
import mochaPlugin from 'eslint-plugin-mocha';

export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "space-unary-ops": [
        "error",
        {
          words: true,
          nonwords: false,
        },
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
      semi: "error",
    },
  },

  // mocha related eslint rules
  {
    ...mochaPlugin.configs.flat.recommended,
    files: ["tests/**/*.js"],
    languageOptions: {
      parserOptions: {
        sourceType: "script",
        ecmaVersion: "latest",
      },
    },
    rules: {
      "mocha/no-exclusive-tests": "error",
    },
  },
];
