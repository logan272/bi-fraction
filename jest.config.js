module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['dist'],
  testMatch: ['<rootDir>/packages/**/*.test.[jt]s?(x)'],
  // Set maxWorkers to 1 to circumvent the "Do not know how to serialize a BigInt" issue
  // https://github.com/jestjs/jest/issues/11617#issuecomment-1028651059
  maxWorkers: 1,
  moduleNameMapper: {
    '^@fraction-asset/(.*)$': [
      '<rootDir>/packages/$1/src',
      '<rootDir>/connectors/$1/src',
    ],
  },
};
