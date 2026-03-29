import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          styles: ['styled-components']
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: false,
    testTimeout: 15000,
    exclude: [...configDefaults.exclude, '.validation-*/**', '.worktrees/**'],
    pool: 'forks',
    maxWorkers: 1,
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    setupFiles: resolve(rootDirectory, 'src/test/setup.ts'),
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      processingConcurrency: 1,
      reportsDirectory: resolve(rootDirectory, 'coverage'),
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/test/**',
        '.worktrees/**'
      ]
    }
  }
});
