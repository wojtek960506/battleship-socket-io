# This is a template for creating application with usage of React, TypeScript, Vite, Jest and React Testing Library

After cloning this repository make sure not to update it by following given steps
```bash
git clone https://github.com/wojtek960506/react-ts-vite-jest-testing-template.git name-of-new-project
cd name-of-my-new-project
rm -rf .git     # remove Git history
git init        # reinitialize Git for your new project
git add .
git commit -m "Initial commit from template"
git branch -M main
git remote add origin https://github.com/your-username/name-of-my-new-project.git
git push -u origin main
```


## Below I specify steps which I followed to achieve this structure:

1. First create project with Vite

```bash
npm create vite@latest name-of-the-app -- --template react-ts
```

If you do not have something installed you will be asked for it.

2. Then change directory and install dependencies for tests

```bash
npm cd name-of-the-app

npm install --save-dev jest @types/jest ts-jest ts-node jest-environment-jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  babel-jest @babel/preset-env @babel/preset-react @babel/preset-typescript \
  identity-obj-proxy
```

3. Create file `jest.config.ts`

```ts
export default {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.ts',
  },
};

```

4. Create file `babel.config.js`
```js
export default {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
};
```

5. Add `"compilerOptions"` property to `tsconfig.json`
```json
"compilerOptions": {
  "target": "ES2020",
  "module": "ESNext",
  "moduleResolution": "Bundler",
  "jsx": "react-jsx",
  "esModuleInterop": true,
  "strict": true,
  "skipLibCheck": true
},
```

6. Create test setup `src/setupTests.ts`
```ts
import '@testing-library/jest-dom';
```

7. To support non-JS assets like `.svg` or `.css` in tests you need to follow those steps
* Create a file named `__mocks__/fileMock.ts`
```ts
export default 'test-file-stub';
```
* In `jest.config.ts` property `moduleNameMapper` is responsible for mocking it correctly (`indentity-obj-proxy` for files with styles to be precise)

8. To let TypeScript to understand the shape of SVG imports it needs `.d.ts` module declarations
* to fix it add file `src/declarations.d.ts`
```
declare module '*.svg' {
  const content: string;
  export default content;
}
```
* add the following property to `tsconfig.json`
```json
"include": ["src"]
```
* to fix references in `tsconfig.json` you need to update `tsconfig.app.json` and `tsconfig.node.json`

- update `tsconfig.app.json` to inclue
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,     // ✅ Required for references
    "noEmit": false,       // ✅ Optional: or remove it if present
    "outDir": "dist",
    "emitDeclarationOnly": true,
  },
  "include": ["src"]
}
```

- update `tsconfig.node.json` to inclue
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,     // ✅ Required for references
    "noEmit": false,       // ✅ Optional: or remove it if present
    "outDir": "dist-node",
  },
  "include": ["src"]
}
```

9. Create Example Test `src/App.test.tsx`
```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
});
```

10. In `package.json` inside `"scripts"` property add:
```
"test": "jest"
```

11. Run tests with:
```bash
npm run test
```

***

### All text below was created by executing bash command to create project with Vite

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
