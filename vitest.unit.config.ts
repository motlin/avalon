import {defineConfig} from 'vite';

// Kept separate from vitest.config.ts, which runs Storybook tests in a browser.
export default defineConfig({
  test: {
    name: 'unit',
    environment: 'node',
    include: ['client/src/**/*.test.js', 'server/**/*.test.js'],
  },
});
