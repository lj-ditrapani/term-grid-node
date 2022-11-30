module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 96,
      branches: 75,
      functions: 95,
      lines: 96,
    },
  },
}
