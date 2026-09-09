import { test, expect} from '../Fixtures/fixtures'; // 独自testをimport

test('カートに商品を追加できる', async ({ inventoryPage }) => {
  // すでにログイン済みで、InventoryPageのメソッドがすぐ使える
  await inventoryPage.addFirstItemToCart();

  await expect(inventoryPage.cartBadge).toHaveText('1');
});