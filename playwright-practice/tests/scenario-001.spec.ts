import { test, expect } from '@playwright/test';
import { LoginPage } from '../page/LoginPage';
import { InventoryPage } from '../page/InventoryPage';
import { CartPage } from '../page/CartPage';
import { ProductDetailPage } from '../page/ProductDetailPage';
import { CheckoutStepTwoPage } from '../page/CheckoutStepTwo';
import { NavigationMenu } from '../page/NavigationMenu';

/**
 * SCENARIO-001: 商品ソート〜カート操作〜チェックアウト〜ログアウト
 *
 * - `loggedInPage` フィクスチャは使わず、素の `page` から開始する。
 *   手順1（ログイン）自体がこのシナリオの検証対象のため（LOGIN-001と同じ考え方）。
 * - 各手順は `test.step()` で分割し、テストケースのNo.1〜12と1対1で対応させる。
 */
test('SCENARIO-001: 商品ソート〜カート操作〜チェックアウト〜ログアウト', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // このシナリオで扱う商品
  const CHEAPEST_ITEM = 'Sauce Labs Onesie'; // Price (low to high) 適用時の先頭（$7.99）
  const DETAIL_ITEM = 'Sauce Labs Backpack'; // 商品詳細から購入する商品
  const LIST_ITEM = 'Sauce Labs Bike Light'; // 一覧から追加/購入する商品

  let inventoryPage = new InventoryPage(page);

  await test.step('1. ログイン', async () => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.getHeading()).toHaveText('Products');
  });

  await test.step('2. ソート変更(Price low to high)', async () => {
    await inventoryPage.sortBy('Price (low to high)');
    expect(await inventoryPage.getSortedOption()).toBe('Price (low to high)');
    // 期待結果: 最安値の商品が先頭に並ぶ
    await expect(page.locator('.inventory_item_name').first()).toHaveText(CHEAPEST_ITEM);
  });

  let productDetailPage: ProductDetailPage;

  await test.step('3. 商品名リンクから商品詳細へ遷移', async () => {
    productDetailPage = await inventoryPage.clickProduct(DETAIL_ITEM);
    await expect(page).toHaveURL(/inventory-item\.html/);
    // 期待結果: 選択した商品の商品名が表示される
    await expect(productDetailPage.productName()).toHaveText(DETAIL_ITEM);
  });

  await test.step('4. 商品詳細で Add to cart', async () => {
    await productDetailPage.addToCart();
    // 期待結果: カートバッジが 1 になる
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
    await expect(productDetailPage.backToProductsButton()).toBeVisible();
  });

  await test.step('5. Back to products で一覧へ戻る', async () => {
    inventoryPage = await productDetailPage.backToProducts();
    await expect(page).toHaveURL(/inventory\.html/);
    // 期待結果: 商品一覧（Products見出し）が表示される
    await expect(inventoryPage.getHeading()).toHaveText('Products');
  });

  await test.step('6. ソート順のリセット確認（要検証事項）', async () => {
    // レビュー指摘シートNo.1: 商品詳細へ遷移→Back to products で一覧に戻った際に
    // ソート順が保持されるか未確定。
    // 【A案採用】期待結果を仮に「デフォルト(Name A to Z)にリセットされる」として実装し、
    // 実行結果で saucedemo の実挙動を確定させる（PoCの目的＝動作未確認事項の実機確定）。
    const sortedOption = await inventoryPage.getSortedOption();
    console.log(`[SCENARIO-001 No.6] Back to products 後のソート順: "${sortedOption}"`);
    expect(sortedOption).toBe('Name (A to Z)');
  });

  await test.step('7. 一覧で別商品を Add to cart', async () => {
    await inventoryPage.addToCartByName(LIST_ITEM);
    // 期待結果: カートバッジが 2 になる
    expect(await inventoryPage.getCartBadgeCount()).toBe('2');
  });

  await test.step('8. 一覧で1商品を Remove', async () => {
    await inventoryPage.removeFromCartByName(DETAIL_ITEM);
    // 期待結果: カートバッジが 1 に戻る
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  });

  const cartPage = new CartPage(page);

  await test.step('9. カート画面へ遷移', async () => {
    await inventoryPage.cartMove();
    await expect(page).toHaveURL(/cart\.html/);
    // 期待結果: カート内に残した商品のみが表示される
    expect(await cartPage.getCartItemNames()).toEqual([LIST_ITEM]);
  });

  let checkoutStepTwoPage: CheckoutStepTwoPage;

  await test.step('10. チェックアウト情報入力 → Continue', async () => {
    const checkoutStepOnePage = await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await checkoutStepOnePage.fillInfo('Taro', 'Test', '123-4567');
    checkoutStepTwoPage = await checkoutStepOnePage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    // 期待結果: 注文確認（Checkout: Overview）画面へ遷移する
    await expect(checkoutStepTwoPage.getHeading()).toHaveText('Checkout: Overview');
  });

  await test.step('11. Finish で注文確定', async () => {
    const checkoutCompletePage = await checkoutStepTwoPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    // 期待結果: 「Thank you for your order!」が表示される
    await checkoutCompletePage.expectCompleted();
  });

  await test.step('12. ハンバーガーメニューからログアウト', async () => {
    const navigationMenu = new NavigationMenu(page);
    await navigationMenu.open();
    const loginPageAfterLogout = await navigationMenu.logout();
    // 期待結果: ログイン画面へ戻る
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPageAfterLogout.loginButton).toBeVisible();
  });
});
