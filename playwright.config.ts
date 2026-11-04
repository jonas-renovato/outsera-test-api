import { defineConfig } from '@playwright/test';
import { environment } from './src/config/environment';

const testOutputDir = 'test-results';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  outputDir: testOutputDir,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Keep the public API suite deterministic and avoid unnecessary concurrency.
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: environment.baseUrl,
    trace: 'retain-on-failure',
  },
  expect: {
    timeout: 5_000,
  },
  timeout: 30_000,
});
