module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        'no-var': 'error',
        'no-debugger': 'error',
        'max-len': ['error', { code: 160 }],
        'max-statements': ['error', 50, { ignoreTopLevelFunctions: true }],
        'max-params': 'off',
        'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
        'complexity': ['error', { max: 30 }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-var-require': ['off', false],
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^__' }],
        '@typescript-eslint/ban-ts-comment': ['warn']
    }
};