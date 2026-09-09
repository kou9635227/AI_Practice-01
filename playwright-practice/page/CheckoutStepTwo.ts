import { Page, Locator } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async finish() {
    await this.finishButton.click();
  }
}