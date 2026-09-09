import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButtons = page.getByRole('button', { name: /Add to cart/ });
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
}