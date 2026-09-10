import { Page, Locator } from '@playwright/test';
import { InventoryPage } from './InventoryPage';

/**
 * 商品詳細画面（inventory-item.html）を表すPOM。
 */
export class ProductDetailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** 商品名見出しの要素を返す */
  productName(): Locator {
    return this.page.getByTestId('inventory-item-name');
  }

  /** 「Add to cart」ボタン */
  addToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to cart' });
  }

  /** 「Back to products」ボタン */
  backToProductsButton(): Locator {
    return this.page.getByRole('button', { name: 'Back to products' });
  }

  /** Add to cartをクリック */
  async addToCart(): Promise<void> {
    await this.addToCartButton().click();
  }

  /** クリックしてInventoryPageインスタンスを返す */
  async backToProducts(): Promise<InventoryPage> {
    await this.backToProductsButton().click();
    return new InventoryPage(this.page);
  }
}
