const wb = require('./wb.config.js');

module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '^Components(.*)$': '<rootDir>/_source/_components$1',
    '^CSS(.*)$': '<rootDir>/_source/_css$1',
    '^GQL(.*)$': '<rootDir>/gql$1',
    '^JS(.*)$': '<rootDir>/_source/_js$1',
    '^Layouts(.*)$': '<rootDir>/layouts$1',
    '^Pages(.*)$': '<rootDir>/pages$1',
    '^Source(.*)$': '<rootDir>/_source$1',
    '^WB(.*)$': '<rootDir>/_wb$1',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverage: wb.devMode,
  collectCoverageFrom: [
    '<rootDir>/_source/_components/**/*.vue',
    // '<rootDir>/pages/**/*.vue'
  ],
  coveragePathIgnorePatterns: ['/node_modules/', 'demo.vue'],
};
