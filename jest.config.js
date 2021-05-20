module.exports = {
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(moment|core-js|babel-runtime|regenerator-runtime|lodash)/',
  ],
  collectCoverage: false,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  moduleFileExtensions: ['js', 'ts'],
  testPathIgnorePatterns: ['/(node_modules|lib|coverage|types)/'],
  testMatch: null,
  preset: 'ts-jest/presets/js-with-babel',
};
