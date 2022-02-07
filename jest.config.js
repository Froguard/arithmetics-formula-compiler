/**
 * ts-jest 测试配置文件
 */
module.exports = {
    verbose: true,
    // coverage
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageReports: ['json','locv'],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 20,
            lines: 50,
            statements: 50
        }
    },
    testEnviroment: 'node',
    testMatch: ['./tests/**/*.test.ts'],
    testPathIgnorePatterns: ['/node_modules/'],
    moduleDirectories: ['/node_modules/'],
    moduleFileExtensions: ['ts', 'json', 'node'],
    trnsform: {
        '^.+\\.ts$': 'ts-jest'
    },
    transformIgnorePatterns: ['node_modules/(?!variables/.*)']
};