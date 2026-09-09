import { test, expect } from '@playwright/test';

test('商品画像の読み込みに失敗した場合の見た目を確認する', async ({ page }) => {
  // 画像ファイルへのリクエストをすべて失敗させる
  await page.route('**/*.{png,jpg,jpeg}', (route) => route.abort());

  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // 画像が読み込めていない状態でも、商品名などのテキストは表示されているはず
  await expect(page.locator('.title')).toHaveText('Products');
});