module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-hooks'],
  ignorePatterns: ['dist', 'node_modules', 'server', 'remote'],
  rules: { 'no-unused-vars': 'off', 'no-undef': 'off', 'react-hooks/rules-of-hooks': 'error' },
}
