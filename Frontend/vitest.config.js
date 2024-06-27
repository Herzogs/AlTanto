import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig({
  ...viteConfig,
  test: {
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    environment: 'jsdom',
  },
});

