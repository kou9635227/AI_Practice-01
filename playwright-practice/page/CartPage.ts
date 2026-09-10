import { Page, Locator } from '@playwright/test';
import { CheckoutStepOnePage } from './CheckoutStepOne';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  /** カート内の商品名一覧を返す */
  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  /** 「Checkout」ボタンをクリックし、CheckoutStepOnePageを返す */
  async proceedToCheckout(): Promise<CheckoutStepOnePage> {
    await this.checkoutButton.click();
    return new CheckoutStepOnePage(this.page);
  }
}
