import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // tests配下にあるテストファイルを対象にする
  testDir: 'tests',

  // テストファイル内の複数のtestの並列実行を有効
  fullyParallel: true,

  // test.onlyが残っている場合にCIでエラーにする
  forbidOnly: !!process.env.CI,

  // CIではリトライにしているのは、リトライ全部でエラーならバグ、そうでなければflakyと判断できるようにするため
  retries: process.env.CI ? 2 : 0,

  // CIでは直列実行。並列による過負荷によるflakyを防ぐ為
  workers: process.env.CI ? 1 : undefined,

  // レポートはHTMLで
  reporter: 'html',

  use: {
    // ベースURLを設定することでフルパス指定の手間を省く
    baseURL: 'http://localhost:3000',

    // リトライ一回目だけトレース出力。２回目以降は出力しない。ファイルサイズが大きくなるのを防ぐ
    trace: 'on-first-retry',

    testIdAttribute: 'data-test',
  },
  // 実行するブラウザはChromiumのみ
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  /*
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  */
});