import { Page, Locator, expect } from '@playwright/test';

/**
 * チェックアウト完了画面（checkout-complete.html）を表すPOM。
 */
export class CheckoutComplete {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** 完了メッセージ（「Thank you for your order!」）の要素を返す */
  completeHeader(): Locator {
    return this.page.getByTestId('complete-header');
  }

  /** 画面見出し（「Checkout: Complete!」）の要素を返す */
  getHeading(): Locator {
    return this.page.getByTestId('title');
  }

  /** 注文完了を検証する（完了メッセージ＋画面見出し） */
  async expectCompleted(): Promise<void> {
    await expect(this.completeHeader()).toHaveText('Thank you for your order!');
    await expect(this.getHeading()).toHaveText('Checkout: Complete!');
  }
}
