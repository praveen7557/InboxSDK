'use strict';

module.exports = {
  globals: {
    SDK_VERSION: 'beep',
  },
  moduleNameMapper: {
    '\\.css$': require.resolve('jest-css-modules'),
  },
  modulePathIgnorePatterns: ['/packages/core/src/*'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/test/',
    '/packages/core/src/',
  ],
  testRunner: 'jest-circus/runner',
};
