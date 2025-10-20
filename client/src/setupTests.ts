import '@testing-library/jest-dom';

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});