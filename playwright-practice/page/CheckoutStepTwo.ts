import { Page, Locator } from '@playwright/test';
import { CheckoutComplete } from './CheckoutComplete';

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  /** 「Checkout: Overview」見出し要素を返す */
  getHeading(): Locator {
    return this.page.getByTestId('title');
  }

  /** 「Finish」をクリックし、CheckoutCompleteを返す */
  async finish(): Promise<CheckoutComplete> {
    await this.finishButton.click();
    return new CheckoutComplete(this.page);
  }
}
