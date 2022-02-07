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
        'max-len': ['error', { 'code': 160 }],
        'max-statements': ['error', 30, { 'ignoreTopLevelFunctions': true }],
        'max-params': 'off',
        'max-lines': ['error', { 'max': 400, 'skipBlankLines': true, 'skpComments': true }],
        'complexity': ['error', { 'max': 30 }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-var-require': ['off', false],
        '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        '@typescript-eslint/ban-ts-comment': ['warn']
    }
}