module.exports = {
  testEnvironment: '<rootDir>/src/index.js',
  testMatch: [
    '**/*.test.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
   'test/**/*.{js,jsx,ts,tsx}',
  ],
};