module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['import', 'prettier', '@typescript-eslint'],
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      }, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-param-reassign': ['error', { props: false }],
    // 'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-console': 'off',
    'no-restricted-syntax': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
};
