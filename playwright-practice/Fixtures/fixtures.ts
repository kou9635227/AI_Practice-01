// fixtures.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { InventoryPage } from '../page/InventoryPage';

type MyFixtures = {
  inventoryPage: InventoryPage;
};

export const test = base.extend<MyFixtures>({
  inventoryPage: async ({ page }, use) => {
    // ① ログイン処理はLoginPage(POM)を使って行う
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // ② ログイン後のpageを、InventoryPage(POM)に割り当てる
    const inventoryPage = new InventoryPage(page);

    // ③ 「ログイン済み状態のInventoryPageインスタンス」をテストに渡す
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';