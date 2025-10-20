import '@testing-library/jest-dom';

// eslint-disable-next-line no-undef
beforeAll(() => {
  // eslint-disable-next-line no-undef
  jest.spyOn(console, "log").mockImplementation(() => {});
});