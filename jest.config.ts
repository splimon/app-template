module.exports = {
  setupFilesAfterEnv: ['./tests/setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': './$1',
  },
};