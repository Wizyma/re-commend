/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    alias: {
      src: '/src',
    },
    clearMocks: true,
    setupFiles: ['./setup-test.ts'],
    env: {
      DATABASE_TEST: "true",
      DATABASE_URL: "postgres://postgres:admin@127.0.0.1:5432/postgres",
      DIRECT_URL: "postgres://postgres:admin@127.0.0.1:5432/postgres"
    }
  },
});