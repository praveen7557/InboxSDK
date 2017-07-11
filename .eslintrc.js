module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jest": true,
    "node": true,
    "es6": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react", "flowtype"
  ],
  "rules": {
    "flowtype/define-flow-type": 1,
    "flowtype/require-valid-file-annotation": ["error", "always"],

    "no-unused-vars": ["off"],
    // "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    // "quotes": ["error", "single", "avoid-escape"],
    "semi": ["error", "always"],
    "no-var": ["off"], //["error"],
    "brace-style": ["off"], //["error"],
    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["off"], //["error", "always"],
    "no-spaced-func": ["error"],
    "no-whitespace-before-property": ["error"],
    "space-before-blocks": ["off"], //["error", "always"],
    "keyword-spacing": ["off"], //["error"],
  }
};