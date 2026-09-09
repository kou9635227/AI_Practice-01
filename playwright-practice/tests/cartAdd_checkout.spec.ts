import { test, expect } from '../Fixtures/fixtures';
import { CartPage } from '../page/CartPage';
import { CheckoutStepOnePage } from '../page/CheckoutStepOne';
import { CheckoutStepTwoPage } from '../page/CheckoutStepTwo';

test('LOGIN-002: 正しい認証情報でログインすると商品一覧画面へ遷移する', async ({ inventoryPage, page }) => {

  await inventoryPage.itemAddToCart('Sauce Labs Backpack');
  await inventoryPage.cartMove();

  const cartPage = new CartPage(page);
  await cartPage.checkout();

  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  await checkoutStepOnePage.register('Taro', 'Test', '123-4567');
  await checkoutStepOnePage.continue();

  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  await checkoutStepTwoPage.finish();

  //await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
});

/*
  type address= {
    city: 'tokyo' | 'osaka';
  }

  interface user {
    username: string;
    password: string;
    address?: address;
    region?: string;
  }
  */
/*
import { LoginPage } from '../page/LoginPage';
import { InventoryPage } from '../page/InventoryPage';
*/
/*
test('testタイムアウトの確認', async ({ page }) => {
  test.setTimeout(3000); // このテストだけ3秒に短縮
  await page.goto('https://www.saucedemo.com/');
  await page.waitForTimeout(5000); // 5秒待つ処理をわざと入れる
});

// ②expect timeoutを試す
test('expectタイムアウトの確認', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page.getByText('存在しないテキスト')).toBeVisible({ timeout: 2000 });
});

// ③action timeoutを試す（Day3の演習の応用）
test('actionタイムアウトの確認', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('button', { name: '存在しないボタン' }).click({ timeout: 2000 });
});
*/

/*
test('わざとタイムアウトさせる演習', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');

  // ログインボタンの上に、透明な覆いをJSで無理やり被せる
  await page.evaluate(() => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.background = 'transparent';
    document.body.appendChild(overlay);
  });

  // クリックを試みる → 覆いのせいでタイムアウトするはず
  await page.getByRole('button', { name: 'Login' }).click({ timeout: 5000 });
});
*/

/*
type MyFixtures = {
  loginPage: LoginPage;
};


//Fixture
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    //test前にstandard会員でログインする
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await use(loginPage);

    //test後にログアウトする
    await page.getByRole('button' , { name: 'Open Menu' }).click();
    await page.getByRole('link' , { name: 'Logout' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  }
})
*/

/*
test('LOGIN-001: ...', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
});
*/

/*
test('LOGIN-001: ...', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
});
*/

