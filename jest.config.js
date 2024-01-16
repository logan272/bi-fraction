module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist'],
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  // Set maxWorkers to 1 to circumvent the "Do not know how to serialize a BigInt" issue
  // https://github.com/jestjs/jest/issues/11617#issuecomment-1028651059
  maxWorkers: 1,
};
