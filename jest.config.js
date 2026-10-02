const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const aliasMapper = pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' });

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!(p-map|lodash-es|@faker-js)/)'],
  moduleNameMapper: {
    ...aliasMapper,
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^lodash-es$': 'lodash'
  },
  testMatch: ['<rootDir>/**/*.spec.ts', '<rootDir>/**/__tests__/**/*.ts'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.json', isolatedModules: true }]
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/']
};
