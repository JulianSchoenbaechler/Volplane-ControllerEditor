module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jquery: true
  },
  globals: {
    '$': true,
    'jQuery': true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': [2, { props: false }],
    'object-curly-newline': ['error', { 'consistent': true }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
