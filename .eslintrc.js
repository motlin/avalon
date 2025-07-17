module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  'extends': ['plugin:vue/essential', 'eslint:recommended', 'plugin:storybook/recommended'],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-mutating-props': 'off'
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  }
}
