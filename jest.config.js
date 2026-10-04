const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const paths = Object.fromEntries(
  Object.entries(compilerOptions.paths || {}).map(([k, v]) => [
    k,
    v.map(p => p.replace(/\.js$/, '.ts'))
  ])
);

const aliasMapper = pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' });

module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!(p-map|lodash-es|@faker-js)/)'],
  moduleNameMapper: {
    ...aliasMapper,
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^lodash-es$': 'lodash'
  },
  testMatch: ['<rootDir>/**/*.spec.ts', '<rootDir>/**/__tests__/**/*.ts'],
  transform: {
    '^.+\\.(t|j)s?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: { syntax: 'typescript', decorators: true },
          transform: { legacyDecorator: true, decoratorMetadata: true, useDefineForClassFields: false },
        },
        module: { type: 'commonjs', strict: false, strictMode: false }
      },
    ],
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/']
};
