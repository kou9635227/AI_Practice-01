import { Page, Locator } from '@playwright/test';
import { ProductDetailPage } from './ProductDetailPage';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartButtons: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButtons = page.getByRole('button', { name: /Add to cart/ });
    this.sortDropdown = page.getByRole('combobox');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async itemAddToCart(ItemName: string) {
    await this.page
      .locator('.inventory_item', { hasText: ItemName })
      .getByRole('button' , { name: 'Add to cart' })
      .click();
  }

  async cartMove() {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  /** ソートドロップダウンで指定オプション（例: 'Price (low to high)'）を選択する */
  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
  }

  /** 現在選択されているソートオプションの表示値を返す（リセット確認用） */
  async getSortedOption(): Promise<string> {
    return (await this.sortDropdown.locator('option:checked').textContent())?.trim() ?? '';
  }

  /** 商品名リンクをクリックしProductDetailPageを返す */
  async clickProduct(productName: string): Promise<ProductDetailPage> {
    // 商品カード単位でスコープを絞ってから商品名リンクをクリック
    // （画像リンクも同じアクセシブルネームを持つため strict mode violation 対策）
    await this.page
      .locator('.inventory_item', { hasText: productName })
      .locator('.inventory_item_name')
      .click();
    return new ProductDetailPage(this.page);
  }

  /** 一覧上の特定商品の「Add to cart」ボタンをクリック（商品単位でスコープを絞る） */
  async addToCartByName(productName: string): Promise<void> {
    await this.page
      .locator('.inventory_item', { hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  /** 一覧上の特定商品の「Remove」ボタンをクリック（商品単位でスコープを絞る） */
  async removeFromCartByName(productName: string): Promise<void> {
    await this.page
      .locator('.inventory_item', { hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  /** カートアイコンのバッジ数値を返す（バッジが無い＝0件の場合は空文字を返す） */
  async getCartBadgeCount(): Promise<string> {
    if (await this.cartBadge.count() === 0) {
      return '';
    }
    return (await this.cartBadge.textContent())?.trim() ?? '';
  }

  /** 「Products」見出し要素を返す */
  getHeading(): Locator {
    return this.page.getByTestId('title');
  }
}
