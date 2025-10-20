export default {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // transform: {
  //   '^.+\\.(ts|tsx)$': 'ts-jest',
  // },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.ts',
    "^@/(.*)$": "<rootDir>/src/$1", // maps @/ to src/
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"]
};
